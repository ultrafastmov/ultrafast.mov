# CLI reference · ultrafast docs

> Every ultrafast command: new, check, sheet, render, review, inspect, live, export, serve, mcp and more. The CLI is ultrafast, or uf for short.

URL: https://ultrafast.mov/docs/cli/

Docs  
  
# The CLI

`ultrafast`, or `uf` for short. Every command answers in JSON or in files you can look at.

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
  * [This page as Markdown](<https://ultrafast.mov/docs/cli/index.md>)

**On this page**

  1. Make
  2. Export
  3. Look and review
  4. Learn the vocabulary
  5. Import and rebuild
  6. Sound
  7. Speed
  8. Serve
  9. Cloud

## Make

`uf new <template> <out.json>`| Start from a template: `vertical`, `title`, `square`, `promo`, `explainer`, `product` ([all six](<https://ultrafast.mov/templates/>)).  
---|---  
`uf check <doc.json>`| Problems without rendering: unknown ops, misspelled params, bad values, broken shaders, missing files.  
`uf edit <doc.json> <edits.json>`| Apply an edit batch; prints what kind of change it was.  
`uf live <doc.json> [--port 7878]`| A realtime player and JSON-lines edit server; reloads the file when it changes. `--compare ref.mp4` shows a reference split against it.  
`uf send '<json>'`| Send one request to a live session.  
`uf record <doc> <script> <out.mp4>`| Play a document while applying a script of edits, and film the player.  
`uf export <doc> <out>`| Encode the film; the format follows `<out>`. H.264 and HEVC encode on the GPU with zero readback. All the options are under Export.  
`uf batch <doc> --data rows.csv`| One document, a video per row of a CSV, JSON or JSON-lines file. A column named `node.param` sets that param; other columns name the files: `--out 'out/{name}.mp4'`. `--docs DIR` writes each row's document instead.  
  
## Export

One document gives every deliverable. The same settings work as `uf export` flags, [MCP](<https://ultrafast.mov/docs/mcp/>) tool arguments and the [API](<https://ultrafast.mov/docs/api/>)'s `output`. Settings that don't go together are refused before anything renders.

Formats| `.mp4`, `.mov`, `.mkv`, `.webm`, `.gif`; a folder (`frames/`) or a pattern (`frames/{frame:05}.exr`) for a PNG or EXR sequence, with the sound beside it as `audio.wav`; `.wav`, `.mp3`, `.m4a`, `.flac`, `.opus` for the sound alone. `--format` names one.  
---|---  
`--quality draft|standard|high|master`| `draft` is a fast preview: no motion blur and the fastest encode. `standard` is the default. `high` takes more motion-blur samples and a slower encode, for uploads that get re-encoded. `master` takes twice the samples and the best encode. The shutter never changes, so the look stays the document's.  
`--size 720p|1080p|1440p|4k|WxH`, `--scale S`| Renders at that size, sharp; it is not an upscale. `720p` is the short side, so a vertical film stays vertical.  
`--fps N`| Another frame rate (`29.97` and `30000/1001` work); the film plays at the same speed. GIFs default to at most 30.  
`--codec h264|hevc|av1|vp9|prores`| The default is H.264 (VP9 in `.webm`). `--prores-profile proxy|light|standard|hq|4444|4444-xq` defaults to `hq`.  
`--alpha`| Keeps transparency: ProRes 4444 in `.mov`, VP9 in `.webm`, GIF, PNG and EXR. Leave the full-frame background out of the document.  
`--crf N`, `--bitrate 8M`| Constant quality on the codec's scale, or an average bitrate, instead of the quality level's.  
`--audio-codec aac|opus|mp3|flac|pcm|pcm-24`, `--audio-bitrate 192k`, `--no-audio`| The sound in the file: AAC by default, Opus in WebM, PCM with ProRes.  
`--loops N`| GIF: how many more times it plays after the first. `0` plays once; the default is forever.  
`--from S`, `--to S`, `--workers N`| A range of the film; several renderers on the GPU at once.  
  
```
uf export film.json film.mp4 --quality draft --size 720p     # watch the motion
uf export film.json film.mp4 --size 4k --quality high         # a sharp 4K upload
uf export film.json overlay.mov --codec prores --alpha        # ProRes 4444 for an editor
uf export film.json web.webm --alpha                          # VP9 with alpha for a page
uf export film.json teaser.gif --size 480p --fps 15           # a GIF
uf export film.json plates/ --alpha                           # PNG frames and audio.wav
``` 

## Look and review

`uf sheet <doc> [--count N]`| A labelled contact sheet of frames: motion at a glance.  
---|---  
`uf render <doc> --at 2.5 --out f.png`| One exact frame; `--size 4k` or `--scale 2` renders it larger.  
`uf frames <doc> --out-dir DIR`| Every frame (or every Nth) as PNG.  
`uf inspect <doc> --at T [--point X,Y]`| What is on screen at a time: each element's node, bounds and words; with `--point`, the topmost element there.  
`uf review <doc> [--safe margin|social]`| Render the film and report what viewers would trip over: unreadable, too-brief, clipped, overlapping or tiny text; text under social app buttons; flashing faster than 3 per second.  
  
## Learn the vocabulary

`uf ops`| Every op, its ports, params, types and defaults, as JSON. The same as the [op reference](<https://ultrafast.mov/docs/ops/>).  
---|---  
`uf schema`| The document format as JSON Schema, the same as [/schema/v1.json](<https://ultrafast.mov/schema/v1.json>).  
`uf measure '<text params>'`| Glyph-by-glyph metrics of a line of text, for hand layout.  
`uf outline '<text params>'`| A line of text as SVG path data, for morphs and vector work.  
`uf info`| The GPU and backend in use.  
  
## Import and rebuild

`uf import-svg <file.svg>`| An SVG as an editable component: one path per shape, gradients, strokes, text as outlines.  
---|---  
`uf import-lottie <anim.json>`| A Lottie animation as editable paths and keyframes. To render one as video, see [Lottie to MP4](<https://ultrafast.mov/guides/lottie-to-mp4/>).  
`uf decompose <video> --out-dir DIR`| Split a motion-graphics video into a still plate and vector layers keyed frame by frame.  
`uf reconstruct <video> --out-dir DIR`| A whole video as an editable draft: shots, text layers with matched fonts, backgrounds, fades.  
`uf probe`, `extract`, `compare`, `fit`, `fit-motion`, `match-font`, `plate`, `ocr`, `matte`| Refine a reconstruction: shots, reference frames, PSNR and SSIM, fitted params and motion, fonts, plates, text, mattes. Text is read with Apple Vision on macOS and Tesseract elsewhere; `matte` needs macOS.  
`uf faces <video>`| Face tracks, who is talking and the cuts: what a `clip_camera` follows. A `clip_camera` without `faces` tracks them itself.  
  
## Sound

`uf beats <audio or video>`| Tempo, beat grid, downbeats and onsets as JSON: cut on the beat.  
---|---  
`uf voiceover '<text>' out.wav words.json`| Speak a script and write the time of every word, for `audio` and `captions` nodes. The system voices on macOS, eSpeak NG elsewhere.  
  
## Speed

`uf estimate <doc>`| What an export costs before it runs: rendered minutes, GPU seconds timed on sampled frames, and the time to the first byte. Give it the export flags (`--size 4k --quality high`) to estimate that export. `--json` for the numbers.  
---|---  
`uf bench <doc>`| GPU throughput with no readback.  
`uf profile <doc> [--from T]`| GPU time per render group: which nodes cost what, and how many motion-blur samples each runs.  
`uf plan <doc>`| How the graph fused into kernels.  
`uf warm <doc>...`| Compile and cache every kernel the documents need, so a fresh instance starts compiled.  
  
## Serve

`uf mcp`| 20 MCP tools over stdio. See [MCP server](<https://ultrafast.mov/docs/mcp/>).  
---|---  
`uf serve [--port 8080]`| The render service on your GPU: the [HTTP API](<https://ultrafast.mov/docs/api/>) (renders, uploads, frames, sheets, check, review, estimate) and remote MCP at `/mcp`, with one API key and files on local disk. `uf serve key` prints a new key.  
`uf batch`| With no document: export `<doc.json> <out.mp4>` per line of stdin with one warm renderer.  
  
## Cloud

ultrafast Cloud, which will run these commands on hosted GPUs, is coming soon: [join the waitlist](<https://ultrafast.mov/cloud/>). Until then every command runs on your own GPU, and `uf serve` shares it over HTTP.
