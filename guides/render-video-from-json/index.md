# Render video from JSON: a worked example · ultrafast

> Render a video from a JSON file on your GPU: a 21-line example, check and export from the CLI, one video per CSV row, the HTTP API, Python and TypeScript, the JSON Schema, and other JSON video formats.

URL: https://ultrafast.mov/guides/render-video-from-json/

Docs

# Render video from JSON.

One JSON file in, a finished video out, rendered on your GPU. A worked example, then the same document from the command line, over HTTP, from Python or TypeScript, and once per row of a spreadsheet.

## Start

  * [Quickstart](<https://ultrafast.mov/docs/>)
  * [The document](<https://ultrafast.mov/docs/documents/>)

## Guides

  * [Render video from JSON](<https://ultrafast.mov/guides/render-video-from-json/>)
  * [Personalized videos from a CSV](<https://ultrafast.mov/guides/personalized-videos-from-csv/>)
  * [Make a video with Claude Code](<https://ultrafast.mov/guides/claude-code/>)
  * [Lottie to MP4, WebM or ProRes](<https://ultrafast.mov/guides/lottie-to-mp4/>)

## Reference

  * [Ops](<https://ultrafast.mov/docs/ops/>)
  * [CLI](<https://ultrafast.mov/docs/cli/>)
  * [MCP server](<https://ultrafast.mov/docs/mcp/>)
  * [HTTP API](<https://ultrafast.mov/docs/api/>)

## For agents

  * [llms.txt](<https://ultrafast.mov/llms.txt>)
  * [This page as Markdown](<https://ultrafast.mov/guides/render-video-from-json/index.md>)

**On this page**

  1. A whole video in 21 lines
  2. Check, look, export
  3. Animation
  4. One video per row
  5. Over HTTP and from code
  6. From an agent
  7. The schema
  8. Other JSON video formats

## A whole video in 21 lines

A 6-second title card at 1920×1080: a moving marble background, darkened, a title whose letters rise into place from the centre out, a subtitle that types itself on, then bloom and film grain. It is the engine's `title` starter (`uf new title card.json`) with its two lines of text changed.

```
{
  "version": 1,
  "format": { "width": 1920, "height": 1080, "fps": 30, "duration": 6, "motion_blur": { "samples": 6, "shutter": 0.5 } },
  "output": "finish",
  "nodes": {
    "world": { "op": "marble", "params": { "filaments": 0.6 } },
    "dim": { "op": "adjust", "inputs": { "source": "world" }, "params": { "exposure": -1.2 } },
    "title": { "op": "text", "params": { "text": "Night Shift", "font": "Geist", "weight": 700, "size": 200, "align": "center", "valign": "middle",
      "position": [960, 520], "color": "#ffffff", "tracking": -6,
      "stagger": 0.05, "stagger_order": "center",
      "glyph_offset": { "keys": [ { "t": 0.3, "v": [0, 80], "ease": { "bezier": [0.16, 1, 0.3, 1] } }, { "t": 1.1, "v": [0, 0] } ] },
      "glyph_opacity": { "keys": [ { "t": 0.3, "v": 0 }, { "t": 0.6, "v": 1 } ] } } },
    "sub": { "op": "text", "params": { "text": "Episode 41 · out Thursday", "font": "Geist", "size": 44, "align": "center", "valign": "middle",
      "position": { "wiggle": { "frequency": 0.4, "amplitude": [6, 4], "base": [960, 660] } }, "color": "#ffffffb0", "tracking": 2,
      "reveal": { "keys": [ { "t": 1.0, "v": 0 }, { "t": 2.2, "v": 30 } ] } } },
    "l1": { "op": "over", "inputs": { "fg": "title", "bg": "dim" } },
    "l2": { "op": "over", "inputs": { "fg": "sub", "bg": "l1" } },
    "lit": { "op": "bloom", "inputs": { "source": "l2" }, "params": { "intensity": 0.5 } },
    "finish": { "op": "grain", "inputs": { "source": "lit" } }
  }
}
``` 

[Video: The title card the JSON describes: Night Shift rises letter by letter over moving marble, then Episode 41, out Thursday types on](https://ultrafast.mov/media/guides/json-card.mp4) card.json, exported. About 0.7 s from the command to the finished MP4 on one RTX 5090, and `uf review` found nothing to fix.

Four parts make every document:

  * `format`: size, frame rate, length, and motion blur (here 6 samples over half a frame's shutter).
  * `nodes`: a graph. Each node has an `op` (one of 70), its `params`, and `inputs` naming other nodes. Generators such as `marble` and `text` have none; `over` takes a foreground and a background; effects take a `source`.
  * Animated params: any param can be a constant, a list of keyframes, a driver such as `wiggle`, or a formula of `t`.
  * `output`: the node whose picture is the video.

There is no timeline of tracks. A node is on screen when its `timing` says so (all of the film when it has none), and layering is the order of `over` nodes. The full shape is in [the document reference](<https://ultrafast.mov/docs/documents/>), and every op with its params is in [the op reference](<https://ultrafast.mov/docs/ops/>).

## Check, look, export

```
curl -fsSL https://ultrafast.mov/install.sh | sh    # or: brew install ultrafastmov/tap/ultrafast
uf check card.json                                  # {"ok": true, "issues": []} before anything renders
uf sheet card.json --count 9 --out sheet.png        # nine labelled frames on one image
uf review card.json                                 # every frame read for unreadable, clipped or too-brief text
uf export card.json card.mp4                        # H.264 MP4; the container follows the file name
``` 

`check` catches an unknown op or param, an input that points at no node, or a malformed colour before any GPU work, and names the node for each. `sheet` renders a few frames to one image, which is how an agent or a person sees the motion without watching it. `export` writes MP4 (H.264, HEVC or AV1), MOV (ProRes up to 4444 XQ, with alpha), WebM, GIF, PNG or EXR sequences, or the sound alone, at any size and frame rate:

```
uf export card.json card.mov --codec prores --prores-profile 4444 --alpha   # a transparent master
uf export card.json card-4k.mp4 --size 4k --codec hevc
uf export card.json card.gif --size 720p
``` 

Rendering runs on the GPU: Metal on a Mac with Apple silicon, Vulkan on Linux. The same document renders the same picture on every machine: fonts come with the engine or are fetched by name, and the GPU kernels are the same everywhere. Without a GPU, the Docker image renders on the CPU, much more slowly.

## Animation

The example uses three of the five ways to set a param. Keyframes move the letters (`glyph_offset` and `glyph_opacity`, staggered 0.05 s apart from the centre), a driver keeps the subtitle drifting (`wiggle`), and keyframes on `reveal` type it on.

```
"size": 64
"position": { "keys": [ { "t": 0, "v": [540, 2100], "ease": "out_expo" }, { "t": 0.8, "v": [540, 960] } ] }
"rotation": { "keys": [ { "t": 0, "v": 0 }, { "t": 1, "v": 10 } ], "repeat": "pingpong" }
"position": { "wiggle": { "frequency": 2, "amplitude": 10, "base": [540, 960] } }
"opacity":  { "expr": "0.5 + 0.5 * sin(t * 3)" }
``` 

Eases are named (`in_out_cubic`, `out_back`, `spring`...) or a CSS-style bezier. An `audio` driver makes a param follow a band of the soundtrack. To show a node only part of the time, give it `"timing": { "in": 2, "out": 6 }`.

## One video per row

Columns named `node.param` set that param in each row; other columns fill the output name. Three episode cards from one document:

```
name,title.text,sub.text
ep41,Night Shift,Episode 41 · out Thursday
ep42,Night Shift,Episode 42 · out 4 December
ep43,Night Shift,Episode 43 · out 11 December
``` 

```
uf batch card.json --data rows.csv --out 'out/{name}.mp4'     # one warm renderer, a video per row
uf batch card.json --data rows.csv --docs docs/               # or write each row's document and render later
``` 

The subtitle's `reveal` runs to 30 glyphs, so the longest row's 28 type on in full. A reveal counts glyphs, so give it room for the longest row's text.

Rows can be CSV, JSON or JSON lines, and a column can change the format too (`format.width`, `format.height`), so one sheet can give several sizes; frame-relative layout such as blocks and captions follows the frame.

## Over HTTP and from code

`uf serve` is the same engine behind an HTTP API with one API key, on your own GPU. Short renders come back in the response; longer ones are stored with a signed link.

```
docker run --gpus all -p 8080:8080 -v ultrafast:/data ghcr.io/ultrafastmov/ultrafast:latest serve

curl http://localhost:8080/v1/render -H "Authorization: Bearer $ULTRAFAST_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"document": '"$(cat card.json)"', "output": {"codec": "h264", "size": "1080p", "inline": true}}' -o card.mp4
``` 

The Python and TypeScript SDKs wrap the same API, with no dependencies:

```
from ultrafastmov import Ultrafast

uf = Ultrafast()                      # the server on this machine; ULTRAFAST_API_KEY
doc = uf.load("card.json")
for issue in uf.review(doc):
    print(issue.kind, issue.node, issue.message)
uf.render(doc).save("card.mp4")
``` 

```
import { Ultrafast } from "ultrafastmov";

const uf = new Ultrafast();
const doc = await uf.load("card.json");
await (await uf.render(doc)).save("card.mp4");
``` 

Endpoints for checking, single frames, contact sheets, reviews and uploads are in the [HTTP API reference](<https://ultrafast.mov/docs/api/>).

## From an agent

A JSON document is a good thing for a coding agent to write: it is short, it can be checked before anything renders, and the agent can look at the frames it made. With the skill installed, Claude Code, Codex, Cursor and Gemini CLI know the format and the loop; the MCP server gives any MCP client the same tools without a shell.

```
npx skills add ultrafastmov/ultrafast        # the skill
claude mcp add ultrafast -- uf mcp           # 20 MCP tools, local
``` 

Measured on the same 10-second short, the ultrafast document took about 1,234 output tokens, against 1,868 for the same video in Remotion and 1,680 in HyperFrames ([method](<https://github.com/ultrafastmov/benchmarks>)). More on the [video MCP server](<https://ultrafast.mov/mcp/>) page.

## The schema

The document format is versioned (`"version": 1`) and published as JSON Schema at [ultrafast.mov/schema/v1.json](<https://ultrafast.mov/schema/v1.json>). Point your editor at it for completion and inline errors:

```
{ "$schema": "https://ultrafast.mov/schema/v1.json", "version": 1, "format": { }, "nodes": { }, "output": "finish" }
``` 

The schema checks shape; `uf check` also checks meaning: that ops and params exist, inputs point at real nodes, values are well formed, and shaders compile.

## Other JSON video formats

Several tools describe a video as JSON. What each one's docs say, as of 23 November 2026:

Format| Shape| Where it renders  
---|---|---  
ultrafast document| a graph of nodes with animated params and timing windows; 3D, shaders and simulations are nodes| your GPU, locally or with `uf serve`; open source  
[Shotstack Edit](<https://shotstack.io/docs/api/>)| a timeline of tracks of clips; 16 asset types; merge fields for templates| Shotstack's cloud  
[JSON2Video Movie](<https://json2video.com/docs/v2/reference/json-syntax>)| scenes that play back to back, each with elements; variables, conditions and iteration| JSON2Video's cloud  
[Creatomate RenderScript](<https://creatomate.com/docs/api/render-script/element-properties>)| elements on tracks with keyframes; nested compositions| Creatomate's cloud  
[Editly](<https://github.com/mifi/editly#readme>)| a JSON5 edit spec of clips and layers| locally with Node.js and FFmpeg; open source  
[VideoFlow](<https://github.com/ybouane/VideoFlow#readme>)| TypeScript compiled to a portable JSON format| headless Chromium on a server, or WebCodecs in the browser; open source  
  
The hosted services are compared in more depth on [ultrafast vs JSON-to-video APIs](<https://ultrafast.mov/alternatives/json-to-video-api/>), and the open-source tools on [Remotion alternatives](<https://ultrafast.mov/alternatives/remotion/>).
