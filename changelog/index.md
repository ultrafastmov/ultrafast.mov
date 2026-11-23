# Changelog · ultrafast release notes

> Every ultrafast release and what it changed, newest first, with the numbers measured. Latest: 0.2.0, smaller files, sooner.

URL: https://ultrafast.mov/changelog/

Changelog

# Every release, what changed.

What each ultrafast release changed, newest first, with the numbers measured. The same notes are on [GitHub releases](<https://github.com/ultrafastmov/ultrafast/releases>).

  1. **0.2.0** Smaller files, sooner
  2. **0.1.1** Every deliverable from one document
  3. **0.1.0** The first release

0.2.0

23 November 2026Latest

  * [GitHub release](<https://github.com/ultrafastmov/ultrafast/releases/tag/v0.2.0>)
  * [Every commit](<https://github.com/ultrafastmov/ultrafast/compare/v0.1.1...v0.2.0>)

## Smaller files, sooner

On NVIDIA, exports come out a fifth to a half the size at the same picture, and in about a fifth less time end to end. First runs are quicker, every file says its colours, and the review follows the camera.

[Video: ultrafast 0.2.0: smaller files, sooner](https://ultrafast.mov/media/changelog/ultrafast-0.2.0.mp4)

The benchmark's captioned-footage scene as 300 prints, one per frame, each as thick as its bytes (1 cm = 1 MB). One ultrafast document, rendered by 0.2.0.

### File size at the same picture

  1. Title card: 2.72 MB in 0.1.1, 1.08 MB in 0.2.0.
  2. Chart: 0.73 MB in 0.1.1, 0.35 MB in 0.2.0.
  3. Captioned footage: 9.33 MB in 0.1.1, 2.93 MB in 0.2.0.
  4. Effects reel: 9.04 MB in 0.1.1, 1.59 MB in 0.2.0.

### Export time, end to end

  1. Title card: 0.88 s in 0.1.1, 0.68 s in 0.2.0.
  2. Chart: 0.88 s in 0.1.1, 0.70 s in 0.2.0.
  3. Captioned footage: 1.00 s in 0.1.1, 0.82 s in 0.2.0.
  4. Effects reel: 0.98 s in 0.1.1, 0.76 s in 0.2.0.

The four 10-second scenes of the [benchmark](<https://github.com/ultrafastmov/benchmarks>) (300 frames each), exported by 0.1.1 and 0.2.0 on the same RTX 5090 workstation with the same harness, at the standard quality. Times are end to end, from the command to the finished MP4, the median of warm runs.

  * **Files a fifth to a half the size, at the same picture.** On NVIDIA, `--crf` now means libx264's scale (libx265's for HEVC), so `--crf 18` makes the picture libx264 makes at CRF 18. 0.1.1 gave NVENC the number as it was, and its files came out 2 to 4.4 times the size of libx264's. Standard quality also encodes with B-frames and a key frame every 250 frames.
  * **Faster, end to end.** Each frame is encoded in strips across the GPU's encoder engines, the GPU starts with one queue instead of eight, and the encoder's driver starts while the GPU does. The benchmark's scenes export in 0.68 to 0.82 s, against 0.88 to 1.00 s for 0.1.1 on the same machine and harness; one still frame takes 0.20 s, from 0.35 s.
  * **Quicker first runs.** Commands that render and exit compile only the kernels their frames use: a first export after an install or an upgrade takes 1.8 to 2.2 s (2.5 to 2.7 s in 0.1.1).
  * **Colours tagged.** Every YUV export says it is BT.709, limited range, so players don't guess (FFmpeg-based ones guessed BT.601).
  * **`uf review` follows the camera.** Type under a `corner_pin` (a screen or a page in perspective) is measured where the pin puts it, at its size on screen; a label faded out far up a deep stack of layers is no longer reviewed as if it showed. On the SQL notebook example the false "never visible" findings went from 30 to 0.
  * **Fixes.** Two renderers starting at once in one process no longer crash on NVIDIA (the render service's workers could). On macOS, 29.97 fps exports put every frame at its exact time (they were rounded to 1/30 s steps).
  * **Packaging.** The release builds the Claude Desktop extensions and publishes to the MCP Registry from the tag. A `Dockerfile` at the root of the repository runs the MCP server over stdio, so MCP directories such as Glama can build it from the repository, and `plugin.json` and `mcp.json` at the root describe the plugin in the Agent Plugins format GitHub Copilot CLI reads.

The SDKs stay at 0.1.2: nothing in their API changed.

0.1.1

21 November 2026

  * [GitHub release](<https://github.com/ultrafastmov/ultrafast/releases/tag/v0.1.1>)
  * [Every commit](<https://github.com/ultrafastmov/ultrafast/compare/v0.1.0...v0.1.1>)

## Every deliverable from one document

One document exports to every format a delivery asks for, at any size and frame rate, with one quality setting from draft to master.

  * **Formats and codecs.** H.264, HEVC and AV1 MP4s; ProRes from proxy to 4444 XQ; transparent ProRes 4444 and VP9 WebM (`--alpha`); GIFs; PNG and EXR sequences; and sound alone (WAV, MP3, M4A, FLAC, Opus). The format follows the file name.
  * **Quality levels.** `--quality draft|standard|high|master`: encoder quality, samples and motion blur in one setting. Draft is a fast preview; master is for delivery.
  * **Any size, sharp.** `--size 720p|1080p|4k|WxH` or `--scale`, for `export`, `render` and `frames`. The document is drawn at the new size, not upscaled, so a sharp 4K comes from the same 1080p document.
  * **Any frame rate.** `--fps`.
  * **Estimates as the export will render.** `uf estimate` counts the output size, frame rate and quality level.
  * **The same settings everywhere.** The MCP export tool, the `uf serve` HTTP API and the Python and TypeScript SDKs (0.1.2) take them. The SDKs now default to a local `uf serve`.
  * **Fixes.** Transparent EXR is premultiplied with every ffmpeg; sound-only and GIF outputs are named once; `uf ops | head` exits quietly.
  * **Releases.** crates.io, PyPI, npm, ghcr.io and the Homebrew tap all publish from the tag with trusted publishing.
  * **Claude Desktop and the MCP Registry.** Added to the release on 22 November: a `.mcpb` extension for Claude Desktop on each platform, and the listing `io.github.ultrafastmov/ultrafast` on the official MCP Registry.

```
uf export film.json film.mp4
uf export film.json overlay.mov --codec prores --alpha --size 4k
uf export film.json preview.gif --quality draft --size 480p --fps 15
``` 

0.1.0

21 November 2026

  * [GitHub release](<https://github.com/ultrafastmov/ultrafast/releases/tag/v0.1.0>)
  * [Every commit](<https://github.com/ultrafastmov/ultrafast/commits/v0.1.0>)

## The first release

The engine, its JSON document and the tools an agent uses to write, check, review and export video, on macOS and Linux.

  * **The engine.** Every frame is drawn on the GPU, with Metal on macOS and Vulkan on Linux and Windows (WSL2), and no browser in the loop. A video is one JSON document: a format, a graph of nodes, animated params and timing windows.
  * **70 ops.** Type with variable fonts, glyph animators and text on paths; vector paths, SVG and Lottie; images and video; Slang shaders; 3D with image-based light, shadows, depth of field and glass; particles, fluid and feedback simulations; masks, warps, 19 blend modes and looks such as grain, bloom and film looks. Sound is mixed into exports.
  * **The loop.** `uf new` starts from a template, `uf check` finds mistakes without rendering, `uf sheet` draws a contact sheet, `uf review` renders the film and lists text that is unreadable, clipped or on screen too briefly, and flashing, and `uf export` writes the file through the GPU's hardware encoder.
  * **Live.** `uf live` plays a document while an agent edits it over a socket; a parameter edit shows on the next frame.
  * **For agents.** `uf mcp` serves 20 MCP tools. A skill, a Claude Code plugin and a Gemini CLI extension teach the document and the loop.
  * **On your own GPU.** `uf serve` renders over HTTP with one API key, and the Python and TypeScript SDKs (`ultrafastmov` on PyPI and npm) talk to it.
  * **Installs.** Prebuilt archives for macOS on Apple silicon and Linux x86_64, `cargo install ultrafast`, the Homebrew tap and a Docker image on ghcr.io.

## Get the latest.

The install command fetches the newest release, and running it again upgrades. Or `brew upgrade ultrafast`.

`curl -fsSL https://ultrafast.mov/install.sh | sh` [Read the quickstart](<https://ultrafast.mov/docs/>)

Want it hosted? [Join the ultrafast Cloud waitlist](<https://ultrafast.mov/cloud/>).
