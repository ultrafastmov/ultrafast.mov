# Quickstart · ultrafast docs

> Install ultrafast, make your first video, and learn the loop agents use: new, check, sheet, review, export. Then connect it to your agent over MCP.

URL: https://ultrafast.mov/docs/

Docs

# Quickstart

Install it, make your first video, then hand the loop to your agent.

## Start

  * [Quickstart](<https://ultrafast.mov/docs/>)
  * [The document](<https://ultrafast.mov/docs/documents/>)
  * [Templates](<https://ultrafast.mov/templates/>)

## Guides

  * [Render video from JSON](<https://ultrafast.mov/guides/render-video-from-json/>)
  * [Personalized videos from a CSV](<https://ultrafast.mov/guides/personalized-videos-from-csv/>)
  * [Videos from n8n](<https://ultrafast.mov/guides/n8n-video-automation/>)
  * [Make a video with Claude Code](<https://ultrafast.mov/guides/claude-code/>)
  * [Make a video with Codex](<https://ultrafast.mov/guides/codex/>)
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
  * [This page as Markdown](<https://ultrafast.mov/docs/index.md>)

**On this page**

  1. Install
  2. Your first video
  3. What you just made
  4. The loop
  5. Connect an agent
  6. Run it as a service
  7. Next

## Install

One binary, `ultrafast`, with `uf` as its short name. On macOS (Apple silicon) or Linux x86_64:

```
curl -fsSL https://ultrafast.mov/install.sh | sh
``` 

[The script](<https://ultrafast.mov/install.sh>) downloads the prebuilt release for your machine from [GitHub releases](<https://github.com/ultrafastmov/ultrafast/releases>), checks its SHA-256, unpacks it into `~/.ultrafast` and links `ultrafast` and `uf` into `~/.local/bin`. Or pick one of these:

```
brew install ultrafastmov/tap/ultrafast    # macOS and Linux, prebuilt
cargo install ultrafast                    # from crates.io, Rust 1.91 or later
docker run --gpus all ghcr.io/ultrafastmov/ultrafast:latest info
``` 

Or tell your agent “Go to ultrafast.mov and make…” and finish the sentence: it reads [llms.txt](<https://ultrafast.mov/llms.txt>), installs ultrafast and makes the video. Say “go to”: a bare “ultrafast.mov” reads to an agent like a video file.

It renders with **Metal** on macOS and **Vulkan** on Linux, and on Windows through WSL2 ([WINDOWS.md](<https://github.com/ultrafastmov/ultrafast/blob/main/docs/WINDOWS.md>)). Exports on Vulkan use ffmpeg, and on Linux voiceover and OCR use eSpeak NG and Tesseract. The Docker image includes all of them; the prebuilt binaries include everything else. No GPU? [ultrafast Cloud](<https://ultrafast.mov/cloud/>) is coming soon.

```
$ uf info
backend: vulkan
device:  NVIDIA GeForce RTX 5090
``` 

## Your first video

Start from a template (there are [six](<https://ultrafast.mov/templates/>)), look at it, then export it.

```
uf new vertical film.json                       # 1080×1920, 6 s, already looks finished
uf check film.json                              # problems, before anything renders
uf sheet film.json --count 9 --out sheet.png    # nine frames in one image
uf live film.json                               # plays it; edits show on the next frame
uf review film.json --safe social               # what a viewer would trip over
uf export film.json film.mp4                    # hardware-encoded mp4
``` 

Other templates: `title`, `square`, `promo`, `explainer` and `product`. Edit the words in `film.json` and run `uf export` again.

## What you just made

A video is one JSON document: a `format`, a graph of `nodes`, and the node to `output`. Nodes are sources (footage, type, shapes, 3D), effects and composites; any param can be animated.

```
{
  "version": 1,
  "format": { "width": 1920, "height": 1080, "fps": 60, "duration": 4.0 },
  "output": "comp",
  "nodes": {
    "bg":   { "op": "gradient", "params": { "a": "#0b0b1a", "b": "#2a1650" } },
    "disc": { "op": "shape", "params": {
      "kind": "circle", "color": "#ff7a2e", "size": [360, 360],
      "center": { "keys": [
        { "t": 0, "v": [560, 540], "ease": "in_out_cubic" },
        { "t": 4, "v": [1360, 540] }
      ] } } },
    "comp": { "op": "over", "inputs": { "fg": "disc", "bg": "bg" } }
  }
}
``` 

The whole vocabulary is in [the op reference](<https://ultrafast.mov/docs/ops/>), and `uf ops` prints it as JSON. The shape of a document is in [The document](<https://ultrafast.mov/docs/documents/>).

## The loop

This is how an agent works, and how you should too:

  1. **Start** from `uf new` or a copy of an example.
  2. **Check** : `uf check` reports unknown ops, misspelled params (with suggestions), wrongly shaped values, broken shaders and missing files, without rendering.
  3. **Look** : `uf sheet` for motion at a glance, `uf render --at 2.5` for one exact frame, `uf inspect --at 2.5` for which node drew what.
  4. **Review** : `uf review` renders the film and reports unreadable, clipped, overlapping, tiny or too-brief text, text under social app buttons, and flashing faster than three times a second.
  5. **Export** : `uf export`, hardware-encoded with sound and motion blur.

## Connect an agent

`uf mcp` serves all of this as 20 MCP tools over stdio. Frames and contact sheets come back as images, so the agent sees what it made.

```
claude mcp add ultrafast -- uf mcp
``` 

Codex, Cursor, Antigravity CLI, Gemini CLI and remote MCP over HTTP are on the [MCP page](<https://ultrafast.mov/docs/mcp/>). Agents can also read [llms.txt](<https://ultrafast.mov/llms.txt>) and every page of these docs as Markdown.

## Run it as a service

`uf serve` puts the engine behind an HTTP API and remote MCP on your GPU, with one API key, for apps, the [SDKs](<https://ultrafast.mov/integrations/#sdks>) and agents on other machines.

```
uf serve --port 8080                   # prints its API key at first start
export ULTRAFAST_API_KEY=uf_live_...
jq '{document: ., output: {inline: true}}' film.json |
curl http://localhost:8080/v1/render -H "Authorization: Bearer $ULTRAFAST_API_KEY" \
  -H "Content-Type: application/json" --data-binary @- -o film.mp4
``` 

The requests are in [HTTP API](<https://ultrafast.mov/docs/api/>). A hosted version, ultrafast Cloud, is coming soon: [join the waitlist](<https://ultrafast.mov/cloud/>).

## Next

  * [The document](<https://ultrafast.mov/docs/documents/>): format, nodes, animation, timing and components.
  * [Op reference](<https://ultrafast.mov/docs/ops/>): all 70 ops with their params.
  * [CLI](<https://ultrafast.mov/docs/cli/>) and [HTTP API](<https://ultrafast.mov/docs/api/>).
  * [Examples](<https://ultrafast.mov/examples/>): every video there links to its document.
