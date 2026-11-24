# Changelog · ultrafast release notes

> Every ultrafast release and what it changed, newest first, with the numbers measured. Latest: 0.2.2, beats that keep to the music, SVGs as a browser shows them, and batches that catch typos.

URL: https://ultrafast.mov/changelog/

Changelog

# Every release, what changed.

What each ultrafast release changed, newest first, with the numbers measured. The same notes are on [GitHub releases](<https://github.com/ultrafastmov/ultrafast/releases>).

  1. **0.2.2** Beats that keep to the music, SVGs as a browser shows them, and batches that catch typos
  2. **0.2.1** Fixes found converting Lottie files
  3. **0.2.0** Smaller files, sooner
  4. **0.1.1** Every deliverable from one document
  5. **0.1.0** The first release

0.2.2

24 November 2026Latest

  * [GitHub release](<https://github.com/ultrafastmov/ultrafast/releases/tag/v0.2.2>)
  * [Every commit](<https://github.com/ultrafastmov/ultrafast/compare/v0.2.1...v0.2.2>)

## Beats that keep to the music, SVGs as a browser shows them, and batches that catch typos

Downbeats land on the one and the beat list starts at 0.0, SVG text, blend modes and translucency import as a browser shows them, `uf batch` stops on a misspelled param, end card titles wrap, `uf review` sees text that runs off the frame or sits under a card, and every `uf new` template reviews clean.

  * **`uf beats` follows the music.** Downbeats now land on the one. On generated drum tracks they mostly fell on the snare, and 24 of 224 were right; now 210 are. Beats are tracked through the whole song, where before one grid was fitted to its start and drifted. On four-on-the-floor tracks they no longer sit on the off-beats. Against the beat_this tracker on 23 CC-BY songs, the beat F-measure went from 0.38 to 0.69 and the downbeat F-measure from 0.05 to 0.39. Downbeats still assume 4/4, and a song whose off-beats outweigh its beats (strummed, or heavy on hi-hats) can still lock to the off-beat.
  * **A beat at 0.0.** When the music starts on a beat, the list now starts at 0.0. Before, a loop that opens on a kick listed its first beat at 0.5 s. **If your script adds 0.0 to the beats itself, stop:** with two cuts at 0.0, the first shot is empty and every later one comes a beat early. A set, like `sorted({0.0, *beats})`, is unaffected.
  * **`uf batch` stops on a misspelled param.** A column like `chart.valeus` (a real node, with a param it doesn't have) rendered every video with the template's values and said nothing. It now stops before the first frame, as a misspelled node already did: `Error: row 1: `chart.valeus`: `block` has no param `valeus` (did you mean `values`?)`. The same goes for a `set_param` in a row's `edits`, and for `ultrafast_batch` over MCP. `uf batch` also prints the warnings a row brings that the template doesn't have, once each with the first row that has it. For example, text in a number column gives `warning: row 1: node `line2`: param `size`: expected number, got "abc"`.
  * **Hand-thinned chart labels show.** With more than nine x labels, a chart shows every second or third one, and blank labels counted toward that. So `2015,,,,,2020,,,,,2025` (11 labels) lost 2020. Only labels with text count now, so that list shows all three. A full list thins as before.
  * **SVG text, blend modes and translucency as a browser shows them.** `<text>` in a font that isn't installed (Inter, Manrope, even `sans-serif`) imported as nothing, with no warning. It's now set from the faces the `text` op uses: installed ones, ultrafast's own, and Google Fonts, fetched the first time. A font none of them has is replaced, with a warning that names the face used. `mix-blend-mode` was ignored; it now becomes a `blend` with the same mode. Opacity and translucent fills inside an SVG now composite in sRGB, as browsers do: a red circle at 50 % over white is (255, 128, 128), not linear light's (255, 188, 188). Over your film, the `over` that places the SVG decides; give it `"space": "srgb"` to match a browser there too.
  * **End card titles wrap, and`uf review` sees a headline that doesn't fit.** The `end_card` block set its title and tagline on one line, so a 25-character title ran 330 px off each side of a vertical frame. They now wrap at the block's `width`, as the other blocks' text does. `review` had passed that title: text wider than the frame on both sides counted as texture (a marquee, a huge cropped word). Now only type that moves across the frame or is set huge counts as texture, and a still headline that runs off both edges is reported.
  * **`uf inspect` and `uf review` skip text that a card covers.** A word under an opaque card that cuts in over it stayed on `inspect`'s list of what is on screen. `review` kept measuring it too, and warned that it was hard to read (down to 1.5:1). Text now counts as on screen only where no opaque layer covers all of it. A card that is translucent, faded, blended or only partly covering still lets the text show. `inspect` and `pick` also leave out text that a crop removes.
  * **Starter templates start clean.** In `vertical`, the tops of the letters showed through the line masks for the first 0.4 s, and in `square` the word sat cut off at the bottom of the frame for 0.6 s before it rose. Both now enter from out of sight. `uf review` now passes all six templates: `product` sets its line and price in the name's ink (they read at 2.9:1 and 2.0:1 on the grey sweep), `square`'s blue is a shade deeper, and `promo`'s placeholder subtitle and quote are short enough to read while they're on screen. In `promo`, the stat and the end card now arrive with the push and the iris instead of after them, so neither transition opens onto an empty background. The usage line of `uf new` now lists `product`.
  * **Better suggestions in`uf check`.** Two swapped letters count as one edit, so `valeus` suggests `values` rather than `value`, and a misspelled component param gets a suggestion too. `check` no longer wrongly warns about the end card's `title_font`, which is now in the schema. Nor does it warn about a param an instance sets that its component uses as `$name` without declaring it.

The Python and TypeScript SDKs go to 0.1.3: their document types gain the end card's `title_font`.

0.2.1

24 November 2026

  * [GitHub release](<https://github.com/ultrafastmov/ultrafast/releases/tag/v0.2.1>)
  * [Every commit](<https://github.com/ultrafastmov/ultrafast/compare/v0.2.0...v0.2.1>)

## Fixes found converting Lottie files

Layers that grow from nothing render, Lottie files match lottie-web more often, small videos export on NVIDIA, and `uf check` warns about text that never shows in full and keys written twice.

  * **Layers that grow from nothing render.** A `transform` whose scale is exactly 0 at some moment, the usual way to pop something in, stopped `check`, `render` and `export` with "transform is not invertible (zero scale)". At that moment the layer now shows nothing, and it grows as keyed. A `corner_pin` whose corners meet on a point or a line is treated the same way.
  * **Closer to lottie-web.** A Lottie stroke with a width of 0 was filled in the stroke's colour, and lottie-web draws nothing; ultrafast now draws nothing too. On lottie-android's 217 test files, compared with lottie-web 5.13.0 at five frames each, files whose worst frame differs by less than 1 % of pixels went from 118 to 132, and by less than 5 % from 172 to 182. The four files that wouldn't load now render, and no frame got worse.
  * **`uf check` no longer crashes after a failed render.** When the render failed while kernels were still compiling, `uf check` printed its report, then sometimes aborted or segfaulted on exit instead of exiting with 1.
  * **Small videos on NVIDIA.** NVENC refuses frames below a minimum size (145×49 for H.264 on an RTX 5090), and a 72×72 MP4 failed. Exports below the minimum now use a software encoder. When ffmpeg has no libx264 (Fedora's ffmpeg-free), H.264 is encoded with OpenH264.
  * **Clearer errors and warnings.** When a frame fails to render during an export, the error is the render's, not "ffmpeg failed". `uf check` now warns about a text whose `reveal` keys stop before its last glyph, as happens when a CSV row's text is longer than the template's, and about a key written twice in a document. `render`, `export` and `batch` print the reveal warning too, and `batch` says which row has it.
  * **`uf batch --docs DIR`** writes each row's document so its files resolve from `DIR`.

The SDKs stay at 0.1.2: nothing in their API changed.

0.2.0

23 November 2026

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
