# HTTP API · ultrafast docs

> Render ultrafast documents over HTTP with uf serve on your own GPU: renders, frames, sheets, check, review, estimates and uploads, with one API key.

URL: https://ultrafast.mov/docs/api/

Docs

# HTTP API

Render documents over HTTP from `uf serve` on your own GPU, with one API key and files on local disk.

## Start

  * [Quickstart](<https://ultrafast.mov/docs/>)
  * [The document](<https://ultrafast.mov/docs/documents/>)

## Guides

  * [Render video from JSON](<https://ultrafast.mov/guides/render-video-from-json/>)
  * [Personalized videos from a CSV](<https://ultrafast.mov/guides/personalized-videos-from-csv/>)
  * [Make a video with Claude Code](<https://ultrafast.mov/guides/claude-code/>)
  * [Lottie to MP4, WebM or ProRes](<https://ultrafast.mov/guides/lottie-to-mp4/>)
  * [Animated captions from Whisper or SRT](<https://ultrafast.mov/guides/animated-captions/>)
  * [Motion graphics with code](<https://ultrafast.mov/guides/motion-graphics-with-code/>)
  * [Animated chart videos from a CSV](<https://ultrafast.mov/guides/animated-chart-video/>)
  * [Animate an SVG logo](<https://ultrafast.mov/guides/animate-svg-logo/>)

## Reference

  * [Ops](<https://ultrafast.mov/docs/ops/>)
  * [CLI](<https://ultrafast.mov/docs/cli/>)
  * [MCP server](<https://ultrafast.mov/docs/mcp/>)
  * [HTTP API](<https://ultrafast.mov/docs/api/>)

## For agents

  * [llms.txt](<https://ultrafast.mov/llms.txt>)
  * [This page as Markdown](<https://ultrafast.mov/docs/api/index.md>)

**On this page**

  1. Authentication
  2. POST /v1/render
  3. Jobs and webhooks
  4. POST /v1/estimate
  5. POST /v1/frame
  6. Check and review
  7. Uploads
  8. Errors and limits
  9. Cloud-only parts

## Authentication

Start the server with `uf serve` (or the [Docker image](<https://ultrafast.mov/integrations/#self-host>)); the base URL is `http://localhost:8080` unless you pass `--port` or `--host`. Send its API key as a bearer token: with none set, it makes one at first start and prints it, and `uf serve key` prints a new one. The SDKs read `ULTRAFAST_BASE_URL` and `ULTRAFAST_API_KEY`.

```
Authorization: Bearer uf_live_...
Content-Type: application/json
``` 

## POST /v1/render

A document in, a video out: MP4, MOV, WebM, a GIF, a PNG or EXR sequence, or sound alone, at any size and frame rate. Short renders can come back in the response; anything longer goes to storage and returns a receipt.

```
{
  "document": { "version": 1, "format": { }, "nodes": { }, "output": "comp" },
  "output": {
    "inline": true,
    "quality": "draft",
    "size": "720p",
    "audio": true,
    "range": null
  }
}
``` 

  * `output.inline: true`: the file is the response body (up to 32 MiB), with its own content type. Otherwise it is stored and you get a receipt with a signed URL.
  * `output.format`: `mp4` (default), `mov`, `mkv`, `webm`, `gif`; `png` or `exr` for an image sequence, delivered as a zip with the sound as `audio.wav`; `wav`, `mp3`, `m4a`, `flac` or `opus` for the sound alone. `output.name`'s extension picks it too.
  * `output.codec`: `h264` (default), `hevc`, `av1`, `vp9` or `prores` (`prores_profile`: `proxy` to `4444-xq`, default `hq`). `output.alpha: true` keeps transparency in ProRes 4444, VP9, GIF, PNG and EXR.
  * `output.quality`: `draft` (a fast preview without motion blur), `standard` (default), `high` or `master`. `crf` or `bitrate` (`"8M"`) override its encoder setting.
  * `output.size`: `720p`, `1080p`, `1440p`, `4k` or `"WxH"`, rendered at that size, sharp, not scaled up; or `scale`. `output.fps`: another frame rate; the film plays at the same speed. Minutes count the size you render.
  * `audio`, `audio_codec`, `audio_bitrate`; `loops` for GIFs; `output.range`: `[from, to]` seconds. Settings that don't go together are a `400` before anything renders.
  * `output.uri` (Cloud only): write to your own bucket (`s3://`, `gs://`, `r2://`) instead, create-only, so a retry never overwrites a finished video.

```
{
  "status": "rendered",
  "url": "http://localhost:8080/v1/files/renders/render_01M7.../film.mp4?expires=...&sig=...",
  "duration": 11.6,
  "frames": 348,
  "bytes": 6620112,
  "sha256": "2b7e...",
  "video": { "width": 1080, "height": 1920, "fps": 30, "format": "mp4", "codec": "h264", "quality": "standard" },
  "minutes": 0.19,
  "timings": { "plan_s": 0.03, "render_s": 1.71, "encode_s": 0.22, "total_s": 2.2 }
}
``` 

## Jobs and webhooks

Planned for [ultrafast Cloud](<https://ultrafast.mov/cloud/>), and not in `uf serve`: long or batch renders as jobs, with a webhook called when each is done. A self-hosted server answers `/v1/jobs` with `501` and the code `cloud_only`.

Webhooks are signed with your webhook secret (`GET /v1/me`; `Ultrafast-Signature: sha256=` and the hex HMAC-SHA256 of the body) and retried with backoff for 24 hours.

## POST /v1/estimate

What a document will cost before it renders: rendered minutes, GPU seconds and the time to the first byte, from the same plan the renderer runs. A few sampled frames render on the GPU and nothing is encoded. Send the render request's `output` along (`{"size": "4k", "quality": "high"}`) to estimate that render.

```
{ "minutes": 0.2, "gpu_seconds": 2.1, "first_byte_s": 3.0, "usd": null }
``` 

`usd` stays null unless whoever runs the server sets a price per minute.

## POST /v1/frame

One frame as PNG or JPEG: `{"document": {...}, "at": 2.5, "format": "png"}`. `POST /v1/sheet` returns a labelled contact sheet the same way.

## Check and review

`POST /v1/check` with `{"document": {...}}` returns `{"ok", "issues"}`, the same as `uf check`. `POST /v1/review` renders the film and returns what `uf review` finds: `{"document": {...}, "safe": "social"}`.

## Uploads

Footage, images, fonts and audio go up once and are referenced by id in documents.

```
curl http://localhost:8080/v1/uploads -H "Authorization: Bearer $ULTRAFAST_API_KEY" \
  -F file=@interview.mp4
# {"id": "asset_7Kq...", "uri": "asset://7Kq...", "bytes": 48211002, ...}
``` 

Then use `"src": "asset://7Kq..."` in a `video`, `image`, `audio` or `captions` node. Public `https://` URLs work too. Documents sent to the server never read local paths; the SDKs upload a document's local files for you.

## Errors and limits

Errors come back as `{"error": {"status", "code", "message", "retry"}}`.

status| meaning  
---|---  
`400`| The document doesn't pass `check`. The body lists the issues, the same as `uf check`.  
`401`| Missing or wrong API key.  
`403`| The document reads a local path, or a host the server doesn't allow.  
`413`| Inline output over 32 MiB: leave out `inline` to store it and get a receipt.  
`422`| An input couldn't be fetched.  
`429`| The queue is full: the server renders one request at a time, and 16 more can wait.  
`501`| `cloud_only`: jobs, `output.uri` and bucket inputs are planned for ultrafast Cloud.  
  
A render stops after 10 minutes of work. The limits on output length, input size and the queue are settings; see [SELF_HOST.md](<https://github.com/ultrafastmov/ultrafast/blob/main/docs/service/SELF_HOST.md>).

## Cloud-only parts

A few parts of the API wait for [ultrafast Cloud](<https://ultrafast.mov/cloud/>): jobs with signed webhooks, writing renders to your own S3, R2 or GCS bucket with `output.uri`, reading inputs from buckets, and many keys with sign-in. `uf serve` answers them with `501` and the code `cloud_only`, and the SDKs raise `CloudOnly` (Python) or `CloudOnlyError` (TypeScript). It has no billing, so `/v1/estimate` gives a price only if you set `ULTRAFAST_USD_PER_MINUTE`. The full list of settings is in [SELF_HOST.md](<https://github.com/ultrafastmov/ultrafast/blob/main/docs/service/SELF_HOST.md>).
