# The document format · ultrafast docs

> An ultrafast video is one JSON document: a format, a graph of nodes, animated params and timing windows. The full shape, with examples.

URL: https://ultrafast.mov/docs/documents/

Docs

# The document

A video is one JSON file. Here is its whole shape.

## Start

  * [Quickstart](<https://ultrafast.mov/docs/>)
  * [The document](<https://ultrafast.mov/docs/documents/>)

## Guides

  * [Render video from JSON](<https://ultrafast.mov/guides/render-video-from-json/>)
  * [Personalized videos from a CSV](<https://ultrafast.mov/guides/personalized-videos-from-csv/>)
  * [Make a video with Claude Code](<https://ultrafast.mov/guides/claude-code/>)
  * [Lottie to MP4, WebM or ProRes](<https://ultrafast.mov/guides/lottie-to-mp4/>)
  * [Animated captions from Whisper or SRT](<https://ultrafast.mov/guides/animated-captions/>)

## Reference

  * [Ops](<https://ultrafast.mov/docs/ops/>)
  * [CLI](<https://ultrafast.mov/docs/cli/>)
  * [MCP server](<https://ultrafast.mov/docs/mcp/>)
  * [HTTP API](<https://ultrafast.mov/docs/api/>)

## For agents

  * [llms.txt](<https://ultrafast.mov/llms.txt>)
  * [This page as Markdown](<https://ultrafast.mov/docs/documents/index.md>)

**On this page**

  1. Shape
  2. format
  3. nodes
  4. Params and animation
  5. timing
  6. components
  7. Assets, colour, type
  8. Schema and versions

## Shape

```
{
  "version": 1,
  "format": { "width": 1080, "height": 1920, "fps": 30, "duration": 10,
              "motion_blur": { "samples": 6, "shutter": 0.5 } },
  "nodes": {
    "<id>": { "op": "<op>", "params": { }, "inputs": { }, "timing": { } }
  },
  "components": { },
  "output": "<id of the node to render>"
}
``` 

Documents are plain files you can diff, template and edit. The engine reloads a document when it changes, so an agent can write it directly or through `uf edit`.

## format

  * `width`, `height`: any size, in pixels. Change them and frame-relative layout (blocks, captions, `fit`, stacks) follows.
  * `fps`, `duration`: frames per second and seconds.
  * `motion_blur`: `samples` and `shutter`, plus `max_samples` for whips and fast pans. Each moving layer is blurred on its own, as a compositor does; footage and shaders hold at the frame's time.

## nodes

Each node has an `op`, its `params`, its `inputs` (other nodes, by id, on named ports) and optional `timing`. Sources have no inputs; effects take a `source`; composites take `fg` and `bg`.

```
"clip":  { "op": "video", "params": { "src": "launch.mp4", "fit": "cover", "start": 12 } },
"grade": { "op": "grade", "inputs": { "source": "clip" }, "params": { "look": 2, "amount": 0.6 } },
"title": { "op": "block", "params": { "kind": "title", "title": "Artemis I", "kicker": "16 Nov 2022" } },
"comp":  { "op": "over", "inputs": { "fg": "title", "bg": "grade" } }
``` 

Generators (`solid`, `gradient`, `noise`, shaders) are infinite: crop or transform them into panels. Paths and text stay vector until they are rasterized, so a `transform` directly on them stays sharp at any scale. The planner fuses chains of nodes into one GPU kernel and skips what can't be seen.

## Params and animation

Any param can be a constant or animated:

```
"size": 64
"position": { "keys": [ { "t": 0, "v": [540, 2100], "ease": "out_expo" },
                        { "t": 0.8, "v": [540, 960] } ] }
"rotation": { "keys": [ { "t": 0, "v": 0 }, { "t": 1, "v": 10 } ], "repeat": "pingpong" }
"position": { "wiggle": { "frequency": 2, "amplitude": 10, "base": [540, 960] } }
"opacity":  { "expr": "0.5 + 0.5 * sin(t * 3)" }
``` 

  * **Keys** : `t` in seconds, `v` the value, `ease` a name (`in_out_cubic`, `out_expo`, `out_back`, `spring`...) or a CSS-style bezier `{"bezier": [0.16, 1, 0.3, 1]}`. `repeat`: `cycle` or `pingpong`.
  * **Drivers** : `wiggle`, `oscillate`, and `audio`, which follows a soundtrack band so a param pulses with the music.
  * **Expressions** : `{"expr": "..."}`, a formula of `t`, with a list for vectors.

## timing

```
"timing": { "in": 2, "out": 6, "offset": 2, "speed": 0.5 }
``` 

  * `in`, `out`: when the node is on screen. Outside its window a composite passes its background through and an effect passes its source; neither costs anything.
  * `offset`: where the node's local time zero sits in its parent's time. `speed`: local seconds per parent second (negative plays backwards). `loop`: local time wraps at this duration.
  * Windows compose through nesting. For cuts between shots, prefer `transition` nodes (crossfade, dip, wipe, push, slide, iris, zoom, dissolve, glitch, blur); each shot renders only while it is on screen.

## components

A component is a small document with its own params and inputs, used like an op. `"$name"` inside a component refers to one of its params. Components are flattened before planning, so they cost nothing at render time. `uf import-svg` and `uf import-lottie` write SVG artwork and Lottie animations as components with every part editable.

## Assets, colour, type

  * File paths (footage, images, fonts, SVG, Lottie, audio) are relative to the document.
  * Colours are sRGB hex (`#ff48b0`, `#ff48b080`) or 0–1 arrays with straight alpha. Compositing is in linear light; set `"space": "srgb"` on an `over`, `blend` or `gradient` to blend the way CSS and Figma do.
  * Fonts: a family name (any Google Font is fetched once by name), a font file, or a bundled face (`ultrafast:display`, `ultrafast:sans`, `ultrafast:serif`, `ultrafast:mono`, `ultrafast:wide`). Variable fonts animate any axis with `axis_<tag>`.

## Schema and versions

Documents carry `"version": 1`. The JSON Schema is published at [ultrafast.mov/schema/v1.json](<https://ultrafast.mov/schema/v1.json>) for editor completion and validation; `uf schema` prints the same file, and `uf ops` the vocabulary with every param's type and default. Changes within a version are additive.
