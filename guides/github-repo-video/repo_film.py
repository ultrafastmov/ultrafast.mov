#!/usr/bin/env python3
# SPDX-License-Identifier: Apache-2.0 OR MIT
"""repo_film: a short film of a GitHub repository, made from its public stats and
rendered on your GPU by ultrafast (https://ultrafast.mov).

    python3 repo_film.py owner/name                 # owner-name.json and owner-name.mp4
    python3 repo_film.py owner/name --vertical      # 1080x1920, for Shorts, Reels and TikTok
    python3 repo_film.py owner/name --json-only     # write the document, render it yourself

Five shots: the name and description, stars over time, commits per month for the
last year, the languages, and an end card. Every number comes from the GitHub API
on the day you run it. A film takes 6 to 40 API requests (more for older repositories);
without a token GitHub allows 60 an hour, so set GITHUB_TOKEN if you make several.
Needs Python 3.9+ and `uf` on your PATH (or --uf). Apache-2.0 OR MIT, like ultrafast.
"""

import argparse
import datetime as dt
import json
import os
import re
import shutil
import subprocess
import sys
import time
import urllib.error
import urllib.request
from concurrent.futures import ThreadPoolExecutor

API = "https://api.github.com"
UTC = dt.timezone.utc

# A few of GitHub's language colours; the film's accent follows the main language.
LANG_COLORS = {
    "Rust": "#dea584", "Python": "#3572a5", "TypeScript": "#3178c6", "JavaScript": "#f1e05a",
    "Go": "#00add8", "C": "#a8b9cc", "C++": "#f34b7d", "C#": "#178600", "Java": "#b07219",
    "Kotlin": "#a97bff", "Swift": "#f05138", "Ruby": "#cc342d", "PHP": "#4f5d95", "Zig": "#ec915c",
    "Haskell": "#5e5086", "Elixir": "#6e4a7e", "Dart": "#00b4ab", "Lua": "#5a6fd6",
    "Shell": "#89e051", "Nix": "#7e7eff", "OCaml": "#ef7a08", "Scala": "#dc322f",
    "Julia": "#a270ba", "Vue": "#41b883", "Svelte": "#ff3e00", "HTML": "#e34c26", "CSS": "#663399",
}
DEFAULT_ACCENT = "#ff5c7a"
MONTHS = "Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split()


# ------------------------------------------------------------------ GitHub
def get(path, accept="application/vnd.github+json", tries=6):
    """GET an API path; returns (json, headers). Waits out 202 (stats being computed)."""
    req = urllib.request.Request(API + path, headers={"Accept": accept, "User-Agent": "repo-film"})
    token = os.environ.get("GITHUB_TOKEN") or os.environ.get("GH_TOKEN")
    if token:
        req.add_header("Authorization", "Bearer " + token)
    for attempt in range(tries):
        try:
            with urllib.request.urlopen(req, timeout=30) as r:
                body = r.read()
                if r.status == 202:  # GitHub is computing the stats; ask again shortly
                    time.sleep(1.5 + attempt)
                    continue
                return (json.loads(body) if body else None), r.headers
        except urllib.error.HTTPError as e:
            if e.code == 404:
                return None, e.headers
            if e.code in (403, 429) and e.headers.get("x-ratelimit-remaining") == "0":
                sys.exit("GitHub API rate limit reached. Set GITHUB_TOKEN and run again.")
            if e.code in (403, 422):  # a list too large for the API, or past the last page it lists
                return None, e.headers
            if e.code < 500:
                raise
        except (urllib.error.URLError, TimeoutError):
            pass
        time.sleep(1.5 + attempt)  # a server error or a timeout: try again
    return None, {}


def parse_time(s):
    return dt.datetime.strptime(s, "%Y-%m-%dT%H:%M:%SZ").replace(tzinfo=UTC)


def last_page(headers):
    link = headers.get("link") or headers.get("Link") or ""
    for part in link.split(","):
        if 'rel="last"' in part:
            return int(part.split("page=")[-1].split(">")[0].split("&")[0])
    return 1


def star_history(full, now, pool):
    """Stars over time, from GitHub's star history endpoint: new stars per week, newest
    first, about 30 weeks to a page. Returns the running total at the end of each week
    (the current week ends now). The weekly counts add up to the repository's star count."""
    first, headers = get(f"/repos/{full}/stargazers/history")
    weeks = list(first or [])
    pages = pool.map(lambda p: get(f"/repos/{full}/stargazers/history?page={p}")[0] or [],
                     range(2, last_page(headers) + 1))
    for page in pages:
        weeks += page
    weeks.sort(key=lambda w: w["week"])
    if not weeks:
        return []
    start = dt.datetime.fromtimestamp(weeks[0]["week"], UTC)
    points, total = [(start, 0)], 0
    for w in weeks:
        total += w["total"]
        points.append((min(dt.datetime.fromtimestamp(w["week"], UTC) + dt.timedelta(days=7), now), total))
    return points


def fetch(full):
    repo, _ = get(f"/repos/{full}")
    if not repo:
        sys.exit(f"No public repository called {full}.")
    full = repo["full_name"]
    now = dt.datetime.now(UTC).replace(microsecond=0)
    with ThreadPoolExecutor(8) as pool:
        langs = pool.submit(get, f"/repos/{full}/languages")
        weeks = pool.submit(get, f"/repos/{full}/stats/commit_activity")
        release = pool.submit(get, f"/repos/{full}/releases/latest")
        people = pool.submit(get, f"/repos/{full}/contributors?per_page=1&anon=1")
        history = star_history(full, now, pool)
        langs, weeks, release = langs.result()[0], weeks.result()[0], release.result()[0]
        data, headers = people.result()
    contributors = last_page(headers) if data else None
    return {
        "full_name": full,
        "owner": repo["owner"]["login"],
        "name": repo["name"],
        "description": (repo.get("description") or "").strip(),
        "homepage": repo.get("homepage") or "",
        "stars": repo["stargazers_count"],
        "forks": repo["forks_count"],
        "language": repo.get("language") or "",
        "license": (repo.get("license") or {}).get("spdx_id") or "",
        "created": repo["created_at"],
        "fetched": now.strftime("%Y-%m-%dT%H:%M:%SZ"),
        "languages": langs or {},
        "weeks": [{"week": w["week"], "total": w["total"]} for w in (weeks or [])],
        "release": (release or {}).get("tag_name") or "",
        "contributors": contributors,
        "star_history": [[t.strftime("%Y-%m-%dT%H:%M:%SZ"), n] for t, n in history],
    }


# ------------------------------------------------------------------ shaping the data
def human(n):
    if n >= 1_000_000:
        return f"{n / 1_000_000:.1f}M".replace(".0M", "M")
    if n >= 10_000:
        return f"{n / 1000:.0f}k"
    if n >= 1000:
        return f"{n / 1000:.1f}k".replace(".0k", "k")
    return str(n)


def stars_curve(stats, n=12):
    """Resample the star history at n evenly spaced dates, labelled by year (or month)."""
    pts = [(parse_time(t).timestamp(), s) for t, s in stats["star_history"]]
    t0, t1 = pts[0][0], pts[-1][0]
    span_days = (t1 - t0) / 86400
    values, labels, last = [], [], None
    for i in range(n):
        t = t0 + (t1 - t0) * i / (n - 1)
        for (a, sa), (b, sb) in zip(pts, pts[1:]):
            if a <= t <= b:
                values.append(round(sa + (sb - sa) * ((t - a) / (b - a) if b > a else 1)))
                break
        d = dt.datetime.fromtimestamp(t, UTC)
        lab = str(d.year) if span_days > 730 else f"{MONTHS[d.month - 1]} {d.year % 100:02d}"
        labels.append(lab if lab != last else "")
        last = lab
    return values, labels


def commits_by_month(stats):
    """Commits to the default branch per calendar month (by the week each count starts),
    whole months only: GitHub gives the last 52 weeks, so the first month and the
    current one are partial and left out."""
    by, first = {}, {}
    for w in stats["weeks"]:
        d = dt.datetime.fromtimestamp(w["week"], UTC)
        by[(d.year, d.month)] = by.get((d.year, d.month), 0) + w["total"]
        first.setdefault((d.year, d.month), d.day)
    keys = sorted(by)
    now = parse_time(stats["fetched"])
    if keys and keys[-1] == (now.year, now.month):
        keys = keys[:-1]
    if keys and first[keys[0]] > 7:
        keys = keys[1:]
    return [by[k] for k in keys], [MONTHS[m - 1] for _, m in keys]


def language_split(stats, top=4):
    total = sum(stats["languages"].values())
    if not total:
        return [], []
    items = sorted(stats["languages"].items(), key=lambda kv: -kv[1])
    head, rest = items[:top], sum(v for _, v in items[top:])
    values = [round(100 * v / total, 1) for _, v in head]
    labels = [k for k, _ in head]
    if rest and round(100 * rest / total, 1) >= 0.5:
        values.append(round(100 * rest / total, 1))
        labels.append("Other")
    return values, labels


def clean(s):
    """Descriptions often hold :shortcodes: and emoji the film's fonts don't have, and
    * or [ ] that ultrafast's inline markup would read; keep plain text."""
    s = re.sub(r":[a-z0-9_+-]+:", "", s)
    s = "".join(ch for ch in s if ord(ch) < 0x2190 or 0x2c00 <= ord(ch) < 0xfe00)
    return re.sub(r"[*\[\]{}]", "", s)


def clip(s, n):
    s = " ".join(clean(s).split())
    return s if len(s) <= n else s[: n - 1].rsplit(" ", 1)[0].rstrip(",.;:") + "…"


# ------------------------------------------------------------------ the document
def build(stats, vertical=False, credit=True):
    W, H = (1080, 1920) if vertical else (1920, 1080)
    accent = LANG_COLORS.get(stats["language"], DEFAULT_ACCENT)
    ink, muted, bg0, bg1 = "#f4f1ea", "#f4f1ea9e", "#15131c", "#08070b"
    nodes = {}

    def add(name, op, params=None, inputs=None, timing=None):
        node = {"op": op}
        if params is not None:
            node["params"] = params
        if inputs is not None:
            node["inputs"] = inputs
        if timing is not None:
            node["timing"] = timing
        nodes[name] = node
        return name

    # Backdrop: a dark radial gradient under slow silk (the marble op), tinted toward the accent.
    add("grad", "gradient", {"kind": "radial", "center": [W * 0.5, H * 0.18], "radius": max(W, H) * 1.05,
                             "stops": f"0:{bg0}, 1:{bg1}"})
    add("silk", "marble", {"filaments": 0.35})
    add("silk_tint", "tint", {"dark": "#000000", "light": accent}, inputs={"source": "silk"})
    add("silk_dim", "adjust", {"exposure": -2.6, "saturation": 0.7}, inputs={"source": "silk_tint"})
    add("bg", "over", {"opacity": 0.45}, inputs={"fg": "silk_dim", "bg": "grad"})
    big = 0.9 if vertical else 1.35
    look = {"ink": ink, "muted": muted, "accent": accent}
    shots, t = [], 0.0

    def shot(name, length, params):
        nonlocal t
        p = dict(look)
        if vertical and params["kind"] in ("bar_chart", "line_chart", "donut"):
            p.update({"position": [W * 0.1, H * 0.27], "height": H * 0.3, "scale": 1.05})
        p.update(params)
        p.setdefault("scale", big)
        p["duration"] = length - 0.55  # leave time for the exit before the next shot
        add(name, "block", p, timing={"offset": round(t, 2)})
        shots.append(name)
        t += length

    full = stats["full_name"]
    desc = clip(stats["description"], 100)
    since = parse_time(stats["created"]).year
    facts = [f"since {since}"]
    if stats["language"]:
        facts.insert(0, stats["language"])
    if stats["license"] and stats["license"] != "NOASSERTION":
        facts.append(stats["license"])
    if stats["release"]:
        facts.append(stats["release"])
    words = len((desc or " · ".join(facts)).split())
    shot("s_title", max(3.4, 1.6 + 0.2 * words), {"kind": "title", "kicker": stats["owner"].upper() + " /", "title": stats["name"],
                          "subtitle": desc or " · ".join(facts), "scale": big * 1.25,
                          "position": [W * 0.1, H * (0.36 if vertical else 0.3)]})

    if stats["stars"] >= 50 and len(stats["star_history"]) >= 9:  # eight weeks or more
        values, labels = stars_curve(stats)
        shot("s_stars", 3.6, {"kind": "line_chart", "kicker": f"STARS SINCE {stats['star_history'][0][0][:4]}",
                              "title": f"{human(stats['stars'])} stars", "values": values, "labels": "|".join(labels),
                              "draw_time": 1.8})
    elif stats["stars"] >= 50:
        shot("s_stars", 3.0, {"kind": "stat", "value": stats["stars"], "label": "stars on GitHub",
                              "number_font": "ultrafast:wide",
                              # about 133 px a character at scale 1: keep the count inside the safe area
                              "scale": round(min(big * 1.3, 0.8 * W / (133 * len(f"{stats['stars']:,}"))), 3),
                              "position": [W * 0.1, H * (0.38 if vertical else 0.3)]})

    cvals, clabels = commits_by_month(stats)
    if len(cvals) >= 6 and sum(cvals) > 0:
        bars = {"values": cvals}
        if max(cvals) >= (1000 if vertical else 10000):  # a dozen four-digit labels don't fit over the bars
            d = 0 if vertical else 1
            bars = {"values": [round(v / 1000, d) for v in cvals], "suffix": "k", "decimals": d}
        year = sum(w["total"] for w in stats["weeks"])
        shot("s_commits", 3.4, dict(bars, kind="bar_chart", kicker="COMMITS PER MONTH, BUSIEST IN COLOUR",
                                    title=f"{year:,} commits in the last year", labels="|".join(clabels)))

    lvals, llabels = language_split(stats)
    if len(lvals) >= 2:
        shot("s_langs", 3.2, {"kind": "donut", "kicker": "LANGUAGES, BY BYTES OF CODE",
                              "title": f"Mostly {llabels[0]}", "values": lvals, "labels": "|".join(llabels),
                              "suffix": "%", "decimals": 0})

    tagline = " · ".join(x for x in [f"{human(stats['stars'])} stars" if stats["stars"] >= 50 else "",
                                     f"{stats['contributors']:,} contributors" if stats["contributors"] else "",
                                     stats["license"] if stats["license"] not in ("", "NOASSERTION") else ""] if x)
    end_len = 3.4
    p = dict(look)
    p.update({"kind": "end_card", "title": stats["name"], "tagline": tagline, "cta": f"github.com/{full}",
              "scale": big * (1.2 if vertical else 1.0)})
    add("s_end", "block", p, timing={"offset": round(t, 2)})
    shots.append("s_end")
    t += end_len

    fetched = stats["fetched"][:10]
    foot = f"Data: GitHub API, {fetched}"
    if credit:
        foot += "  ·  rendered with ultrafast"
    add("foot", "text", {"text": foot, "font": "ultrafast:mono", "size": 24 if not vertical else 26,
                         "color": "#f4f1ea66", "position": [W * 0.5, H - (84 if not vertical else 150)],
                         "align": "center", "markup": False})

    below = "bg"
    for i, name in enumerate(shots + ["foot"]):
        below = add(f"o{i}", "over", inputs={"fg": name, "bg": below})
    add("vig", "vignette", {"inner": "#00000000", "outer": "#00000090"}, inputs={"source": below})
    add("grain", "grain", {"amount": 0.035}, inputs={"source": "vig"})
    return {"version": 1,
            "format": {"width": W, "height": H, "fps": 30, "duration": round(t, 2)},
            "nodes": nodes, "output": "grain"}


def main():
    ap = argparse.ArgumentParser(description=__doc__.split("\n\n")[0])
    ap.add_argument("repo", help="owner/name, or a github.com URL")
    ap.add_argument("--out", help="the film (default owner-name.mp4; .webm, .mov or .gif work too)")
    ap.add_argument("--vertical", action="store_true", help="1080x1920 instead of 1920x1080")
    ap.add_argument("--json-only", action="store_true", help="write the document and stop")
    ap.add_argument("--stats", help="use a stats file saved by an earlier run instead of the API")
    ap.add_argument("--no-credit", action="store_true", help="leave 'rendered with ultrafast' off the footer")
    ap.add_argument("--uf", default=shutil.which("uf") or shutil.which("ultrafast") or "uf", help="path to uf")
    a = ap.parse_args()

    full = a.repo.strip().rstrip("/")
    full = full.split("github.com/")[-1].removesuffix(".git") if "github.com/" in full else full
    if full.count("/") != 1:
        sys.exit("Give the repository as owner/name.")
    if a.stats:
        with open(a.stats) as f:
            stats = json.load(f)
    else:
        stats = fetch(full)
        with open(stats["full_name"].replace("/", "-") + ".stats.json", "w") as f:
            json.dump(stats, f, indent=1)
    stem = stats["full_name"].replace("/", "-") + ("-vertical" if a.vertical else "")
    doc = build(stats, vertical=a.vertical, credit=not a.no_credit)
    with open(stem + ".json", "w") as f:
        json.dump(doc, f, indent=2)
    print(f"wrote {stem}.json ({doc['format']['duration']} s)", flush=True)
    if a.json_only:
        return
    out = a.out or stem + ".mp4"
    subprocess.run([a.uf, "check", stem + ".json"], check=True)
    t0 = time.time()
    subprocess.run([a.uf, "export", stem + ".json", out], check=True)
    print(f"{out} in {time.time() - t0:.1f} s")


if __name__ == "__main__":
    main()
