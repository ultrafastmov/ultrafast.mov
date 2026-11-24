# Make a launch video of a GitHub repo from its stats · ultrafast

> One Python script turns any public GitHub repository into a 17-second film: stars over time, commits per month, languages and an end card, rendered on your GPU in about a second, at 16:9 or 9:16.

URL: https://ultrafast.mov/guides/github-repo-video/

Docs

# A launch film for your GitHub repo, made from its stats.

Turn a public GitHub repository into a 17-second film: its name and description, stars over time, commits per month, the languages it's written in, and an end card with the link. One Python script reads the GitHub API and writes an ultrafast document, and ultrafast renders it on your own GPU in about a second, at 16:9 for a README or a launch post, or 9:16 for Shorts, Reels and TikTok.

## Start

  * [Quickstart](<https://ultrafast.mov/docs/>)
  * [The document](<https://ultrafast.mov/docs/documents/>)
  * [Templates](<https://ultrafast.mov/templates/>)

## Guides

  * [Render video from JSON](<https://ultrafast.mov/guides/render-video-from-json/>)
  * [Personalized videos from a CSV](<https://ultrafast.mov/guides/personalized-videos-from-csv/>)
  * [Make a video with Claude Code](<https://ultrafast.mov/guides/claude-code/>)
  * [Lottie to MP4, WebM or ProRes](<https://ultrafast.mov/guides/lottie-to-mp4/>)
  * [Animated captions from Whisper or SRT](<https://ultrafast.mov/guides/animated-captions/>)
  * [Motion graphics with code](<https://ultrafast.mov/guides/motion-graphics-with-code/>)
  * [Animated chart videos from a CSV](<https://ultrafast.mov/guides/animated-chart-video/>)
  * [Animate an SVG logo](<https://ultrafast.mov/guides/animate-svg-logo/>)
  * [A film of a GitHub repo](<https://ultrafast.mov/guides/github-repo-video/>)

## Learn

  * [Video rendering without a browser](<https://ultrafast.mov/learn/gpu-video-rendering/>)

## Reference

  * [Ops](<https://ultrafast.mov/docs/ops/>)
  * [CLI](<https://ultrafast.mov/docs/cli/>)
  * [MCP server](<https://ultrafast.mov/docs/mcp/>)
  * [HTTP API](<https://ultrafast.mov/docs/api/>)

## For agents

  * [llms.txt](<https://ultrafast.mov/llms.txt>)
  * [This page as Markdown](<https://ultrafast.mov/guides/github-repo-video/index.md>)

[Video: A 17-second film over dark, slowly moving copper marbling: BURNTSUSHI / ripgrep and its description, then a line chart of 70k stars climbing from 2016 to 2026, bars of commits per month with the busiest in copper, a donut showing the code is 95 percent Rust, and an end card reading ripgrep, 70k stars, 542 contributors, Unlicense, with a pill button linking github.com/BurntSushi/ripgrep](https://ultrafast.mov/media/guides/repo-film-ripgrep.mp4) ripgrep, from the GitHub API on 24 November 2026. 17.6 s at 1080p, exported in 0.98–1.00 s. ripgrep is BurntSushi's project; the film only reads its public stats. **On this page**

  1. Make one
  2. What's in the film
  3. The document it writes
  4. Change the look
  5. Vertical, and many repos
  6. With an agent
  7. Other ways
  8. Questions

## Make one

Install `uf` (a Mac with Apple silicon, or Linux with a Vulkan GPU; Windows through WSL2), download the script, and give it a repository:

```
curl -fsSL https://ultrafast.mov/install.sh | sh     # or: brew install ultrafastmov/tap/ultrafast
curl -fsSLO https://ultrafast.mov/guides/github-repo-video/repo_film.py
python3 repo_film.py BurntSushi/ripgrep
``` 

```
wrote BurntSushi-ripgrep.json (17.6 s)
{
  "issues": [],
  "ok": true
}
exported 528 frames (1920x1080 @ 30 fps, mp4 h264, standard) in 0.51 s = 1035 fps, 0 readbacks -> BurntSushi-ripgrep.mp4
BurntSushi-ripgrep.mp4 in 0.9 s
``` 

The script is about 400 lines of Python with no dependencies outside the standard library (Python 3.9 or newer), under the same Apache-2.0 or MIT licence as ultrafast. It writes three files: the stats it read (`BurntSushi-ripgrep.stats.json`), the document (`BurntSushi-ripgrep.json`), and the film. `uf check` runs on the document before it renders.

  * **Time.** On one RTX 5090 workstation with ultrafast 0.2.1, the whole run took 3.7 s for ripgrep: the API reads, then the export, which took 0.98 to 1.00 s over three runs. microsoft/vscode and rust-lang/rust took 4.3 and 4.4 s on their first runs. GitHub computes commit stats on demand and answers "202, not ready" until it has them; the script waits and asks again.
  * **A token.** A film takes between 7 and 41 API requests, more for older repositories, and GitHub allows 60 an hour without a token. Set `GITHUB_TOKEN` (or run `export GITHUB_TOKEN=$(gh auth token)` if you use the GitHub CLI) to make several in a row.
  * **Options.** `--vertical` makes a 1080×1920 film, `--out film.webm` (or `.mov`, `.gif`) picks the format, `--json-only` writes the document without rendering, `--stats FILE` rebuilds from saved stats without calling the API, and `--no-credit` takes "rendered with ultrafast" off the footer.

## What's in the film

Five shots, each one ultrafast `block` node, so each animates in and out by itself. A shot without enough data is left out, and the film gets shorter.

Shot| From the GitHub API| Left out when  
---|---|---  
Owner, name and description| `/repos/{owner}/{repo}`. The description is cut to 100 characters, and emoji and `:shortcodes:` are dropped. Without one, the shot shows the language, the year it started, the licence and the latest release.| Never  
Stars over time, a line chart| `/stargazers/history`: new stars per week since the first one. The weeks add up to the repository's star count.| Under 50 stars, or under eight weeks of stars  
Commits per month, a bar chart| `/stats/commit_activity`: commits to the default branch per week for the last 52 weeks. The bars are whole months, the busiest in colour; the title counts all 52 weeks.| Fewer than six whole months, or no commits  
Languages, a donut| `/languages`: bytes of code per language; the top four, the rest as Other.| Only one language  
End card| Stars, contributors (from `/contributors`), the licence, and the link. GitHub names one licence even for a dual-licensed repository, so the script also reads the licence files in the top folder (`LICENSE-MIT`, `LICENSE-APACHE`, `UNLICENSE`) and names both, as in "Apache-2.0 OR MIT".| Never  
  
Every film uses the main language's colour from GitHub (Rust's copper, C's grey-blue, Python's blue) as its accent, and the footer gives the date the data was read.

The star chart needs no access to the repository. Since July 2026 GitHub shows the list of who starred a repository only to its admins and collaborators, so older scripts that rebuilt the curve from that list stopped working for other people's repositories. The `/stargazers/history` endpoint GitHub added in September 2026 gives weekly counts for any public repository, with or without a token.

## The document it writes

An ultrafast document is JSON: a frame size, a frame rate, a length, and named nodes wired into each other. The script builds one of 19 nodes. The star chart is this node, with the curve sampled at 12 dates:

```
"s_stars": { "op": "block", "timing": { "offset": 4.0 }, "params": {
  "kind": "line_chart",
  "kicker": "STARS SINCE 2016",
  "title": "70k stars",
  "values": [0, 3114, 7289, 11806, 16941, 22333, 27747, 33828, 40991, 48242, 57077, 70221],
  "labels": "2016|2017|2018|2019|2020|2021|2022||2023|2024|2025|2026",
  "draw_time": 1.8, "duration": 3.05, "scale": 1.35,
  "ink": "#f4f1ea", "muted": "#f4f1ea9e", "accent": "#dea584" } },
``` 

`timing.offset` places it in the film, and `duration` is how long it stays before it leaves. The other shots are the same op with `"kind": "title"`, `"bar_chart"`, `"donut"` and `"end_card"`; the [chart video guide](<https://ultrafast.mov/guides/animated-chart-video/>) covers every chart param. Behind them is a radial `gradient`, slow `marble` tinted toward the accent with `tint` and darkened with `adjust`, and a `vignette` and `grain` over everything. Seven `over` nodes stack the layers.

## Change the look

Edit the JSON, or the `build()` function in the script, and render again. `uf check` names any param it doesn't know before anything renders.

  * **Colours and type:** `ink`, `muted` and `accent` on each block; `display_font`, `text_font` and `mono_font` take any installed font or Google Fonts family by name.
  * **A different backdrop:** replace the `marble` node with a `solid`, a `noise` field or your own `shader`; every op is in the [op reference](<https://ultrafast.mov/docs/ops/>).
  * **Your logo:** the end card takes an SVG file as `logo`. To animate the logo itself, see [Animate an SVG logo](<https://ultrafast.mov/guides/animate-svg-logo/>).
  * **Another shot:** add a block with a later offset, for instance a `quote` from a user or a `stat` for downloads, and move the end card back.
  * **Look before you export:** `uf sheet BurntSushi-ripgrep.json --count 12` renders a contact sheet of 12 frames, and `uf review` reports text that's too small, too brief, clipped or overlapping. The script was tuned until review had nothing to say on both shapes, including a description that runs long and commit counts in the thousands.
  * **Other sizes and formats:** `uf export BurntSushi-ripgrep.json film-4k.mp4 --size 4k` draws every frame at 3840×2160; `.webm`, `.mov` with `--codec prores`, and `.gif` work too. All the flags are in the [CLI reference](<https://ultrafast.mov/docs/cli/>).

## Vertical, and many repos

[Video: A 17-second vertical film over grey-blue marbling: TORVALDS / linux, Linux kernel source tree, then 256k stars climbing from 2011 to 2026, bars of about 74 thousand commits over the last year, a donut showing 98 percent C, and an end card linking github.com/torvalds/linux](https://ultrafast.mov/media/guides/repo-film-linux.mp4) `python3 repo_film.py torvalds/linux --vertical`: 17.0 s at 1080×1920, exported in 0.90–0.97 s.

`--vertical` lays the same shots out for a phone: the charts sit lower and larger, commit counts over a thousand are shortened to `8k` so twelve labels fit over the bars, and the star count shrinks until it fits inside the safe margin. Every text is at least 24 px, the size `uf review` asks for on a phone.

For a film of every repository in an organization, loop over them. The API reads take most of the time, so a token matters more than the GPU here:

```
export GITHUB_TOKEN=$(gh auth token)
gh repo list my-org --limit 20 --json nameWithOwner --jq '.[].nameWithOwner' |
  while read -r repo; do python3 repo_film.py "$repo"; done
``` 

## With an agent

The script is a starting point an agent can change. With ultrafast's [MCP server](<https://ultrafast.mov/mcp/>) or skill installed, a coding agent can run it, look at a contact sheet of the result, edit the document and export again. A prompt to start from:

```
Download https://ultrafast.mov/guides/github-repo-video/repo_film.py and make a
launch film for my-org/my-repo. Use our brand colours (#0f172a background, #22d3ee
accent), add a shot after the stars with the line "used in production at 40 teams",
check it with a contact sheet and uf review, then export 16:9 and 9:16 versions.
``` 

Setup for Claude Code, Codex, Cursor and Gemini CLI is on the [Integrations](<https://ultrafast.mov/integrations/>) page, and a recorded session from prompt to MP4 is in [Make a video with Claude Code](<https://ultrafast.mov/guides/claude-code/>).

## Other ways to make a video of a repository

  * **Gource** draws a repository's history as an animated tree of files, with each contributor flying in to work on them. It plays in a window, and its `--output-ppm-stream` option piped into ffmpeg gives a video. It shows how the code grew, not stars or reach.
  * **git-story** animates commits, branches and tags as a graph and renders an MP4 with Manim. It's for explaining a Git history, from inside a local clone.
  * **GitHub Unwrapped** , by the Remotion team, made a year-in-review film for each GitHub user in its 2021 to 2023 editions, rendered in the cloud. It covers a person's year, not a repository.
  * **star-history.com** draws star charts for any repository as images you can embed in a README. They're still images, not video.

Use this script when you want a short film about a repository's reach and activity that you can post with a launch, a release or a milestone, rendered on your own machine from numbers anyone can check. Use Gource or git-story to show how the code itself changed.

## Questions

How do I make a video of my GitHub repository?

Install `uf`, download `repo_film.py` from ultrafast.mov and run `python3 repo_film.py owner/name`. It reads the repository's stats from the GitHub API, writes an ultrafast document and exports a 17-second MP4: the name and description, stars over time, commits per month, languages and an end card. On one RTX 5090 workstation the whole run took 3.7 s for ripgrep.

Can I make a star history video for a repository I don't own?

Yes. The script uses GitHub's `/stargazers/history` endpoint, added in September 2026, which gives new stars per week for any public repository, with or without a token. The older way, reading the list of stargazers, has been limited to a repository's admins and collaborators since July 2026.

Do I need a GitHub token?

Not for one film. A film takes between 7 and 41 API requests and GitHub allows 60 an hour without a token. Set `GITHUB_TOKEN` to make several in a row.

Can I make a vertical version for Shorts, Reels or TikTok?

Yes: `--vertical` makes a 1080×1920 film with the charts laid out for a phone. A 17-second vertical film of torvalds/linux exported in 0.90 to 0.97 s.

Can I change the colours, fonts or shots?

Yes. The script writes a plain JSON document, so you can change the colours, fonts and backdrop in it, add a shot such as a quote or a download count, or ask a coding agent to do it, then render again with `uf export`.
