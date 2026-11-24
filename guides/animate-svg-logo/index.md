# Animate an SVG logo and export it as MP4, ProRes or GIF · ultrafast

> Turn a static SVG logo into a logo reveal with code: one svg node for a quick fade, or every shape as a named part with uf import-svg, then MP4, 4K, transparent ProRes 4444 or WebM, or a GIF, with measured render times.

URL: https://ultrafast.mov/guides/animate-svg-logo/

Docs

# Animate an SVG logo, export it as video.

Turn a static SVG logo into a logo reveal and export it as an MP4, a transparent ProRes or WebM, or a GIF, rendered on your own GPU by an open-source engine. Every shape in the file becomes a named part you can animate, and the artwork stays vector, so the logo is as sharp at 4K as at 1080p.

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
  * [This page as Markdown](<https://ultrafast.mov/guides/animate-svg-logo/index.md>)

[Video: A logo reveal on cream: a green rounded square pops up in the middle of the frame, a white stem draws itself upward and six leaves unfold from it, then the mark slides left as the letters of fernway rise into place one by one and a green underline draws beneath them](https://ultrafast.mov/media/guides/svg-logo-reveal.mp4) fernway, a made-up logo: one SVG file, its 16 shapes animated one at a time, exported at 1080p in 0.62–0.64 s. **On this page**

  1. The quick way: one node
  2. Animate each part
  3. MP4, ProRes, WebM or GIF
  4. Prepare the SVG
  5. What imports
  6. With an agent
  7. Other ways
  8. Questions

## The quick way: one node

Install `uf` (a Mac with Apple silicon, or Linux with a Vulkan GPU; Windows through WSL2):

```
curl -fsSL https://ultrafast.mov/install.sh | sh     # or: brew install ultrafastmov/tap/ultrafast
``` 

ultrafast renders documents: a frame size, a frame rate, a length, and nodes. An `svg` node places the whole logo, and keyframes on its `scale` and `opacity` make a simple reveal:

```
{
  "version": 1,
  "format": { "width": 1920, "height": 1080, "fps": 30, "duration": 3 },
  "output": "out",
  "nodes": {
    "paper": { "op": "solid", "params": { "color": "#f4f1ea" } },
    "logo": { "op": "svg", "params": {
      "src": "fernway.svg", "size": [1300, 400],
      "anchor": [650, 200], "position": [960, 540],
      "scale":   { "keys": [ { "t": 0.2, "v": 0.85, "ease": "out_back" }, { "t": 1.0, "v": 1 } ] },
      "opacity": { "keys": [ { "t": 0.2, "v": 0, "ease": "out_cubic" }, { "t": 0.7, "v": 1 } ] } } },
    "out": { "op": "over", "inputs": { "fg": "logo", "bg": "paper" } }
  }
}
``` 

```
$ uf check quick.json && uf export quick.json quick.mp4
exported 90 frames (1920x1080 @ 30 fps, mp4 h264, standard) in 0.10 s = 888 fps, 0 readbacks -> quick.mp4
``` 

  * `size` fits the artwork inside a box and keeps its proportions. The paths are drawn at that size, not scaled up from pixels, so a 780×240 SVG is sharp at 1300×400 or at 4K.
  * `anchor` is the point the logo scales and turns around, in the artwork's pixels after `size`: `[650, 200]` is the middle of 1300×400. `position` puts that point in the middle of the frame.
  * Each key sets a value at a time in seconds, and its `ease` shapes the move to the next key. `out_back` overshoots a little and settles, which reads as a pop.
  * `uf check` reads the SVG and lists anything in it that won't import, before you render.

From pressing Enter to a finished file took 0.56–0.58 s warm on one RTX 5090 workstation with the published 0.2.1 binary, of which 0.09–0.10 s was the export itself.

[Video: The fernway logo, a green leaf mark and the word fernway, fades in and grows to full size in the middle of a cream frame with a slight overshoot](https://ultrafast.mov/media/guides/svg-logo-quick.mp4)

## Animate each part

A reveal that builds the logo piece by piece needs the pieces. `uf import-svg` reads the file and prints it as a component: one node per shape, named after the shape's `id` in the SVG.

```
$ uf import-svg fernway.svg --size 1300,400
``` 

For this logo that gives 16 shapes, 35 nodes in all with the ones that stack them:

In the SVG| Nodes  
---|---  
`<rect id="tile">` with a gradient fill| `tile_shape` (the rounded square), `tile_gradient` and `tile_gradient_placed` (its fill), and `tile`, the gradient cut to the shape  
`<path id="stem">`, a stroke| `stem_stroke`  
six `<path id="leaf-1">` … with transforms| `leaf-1` … `leaf-6`, transforms applied to the paths  
seven outlined letters| `letter-f`, `letter-e` … `letter-y`  
`<path id="swoosh">`, a stroke| `swoosh_stroke`  
  
Every part's placement reads the component's own params, written `"$position"`, `"$scale"` and so on, so the logo moves as one. To animate one part by itself, give it values of its own, in the logo's pixels. This script imports the logo, sets keys on the parts, and writes the document:

```
import json, subprocess

# Import the logo as named parts: one path per shape, named after the SVG's ids.
parts = json.loads(subprocess.run(["uf", "import-svg", "fernway.svg", "--size", "1300,400"],
                                  capture_output=True, text=True, check=True).stdout)
nodes = parts["nodes"]

def keys(t0, t1, v0, v1, ease="out_cubic"):
    return {"keys": [{"t": t0, "v": v0, "ease": ease}, {"t": t1, "v": v1}]}

def pop(name, pivot, t, length=0.5):
    # grow from a point in the logo's own space (out_back overshoots a little)
    nodes[name]["params"] |= {"anchor": pivot, "position": pivot,
                              "scale": keys(t, t + length, 0, 1, "out_back")}

# 1. the tile grows from its centre (its gradient fill is a second node that moves with it)
for name in ["tile_shape", "tile_gradient_placed"]:
    pop(name, [183.33, 183.33], 0.1, 0.6)

# 2. the stem draws itself upward
nodes["stem_stroke"]["params"]["trim_end"] = keys(0.45, 1.1, 0, 1, "in_out_cubic")

# 3. the leaves unfold from where they meet the stem, one after another
for i in range(1, 7):
    d = nodes[f"leaf-{i}"]["params"]["d"].split()
    pop(f"leaf-{i}", [float(d[1]), float(d[2])], 0.7 + 0.09 * i, 0.45)

# 4. the letters rise into place and fade in, 60 ms apart
for i, ch in enumerate("fernway"):
    t = 1.05 + 0.06 * i
    nodes[f"letter-{ch}"]["params"] |= {"position": keys(t, t + 0.5, [0, 36], [0, 0]),
                                        "opacity": keys(t, t + 0.3, 0, 1)}

# 5. the underline draws left to right
nodes["swoosh_stroke"]["params"]["trim_end"] = keys(1.6, 2.2, 0, 1)

doc = {
    "version": 1,
    "format": {"width": 1920, "height": 1080, "fps": 30, "duration": 3.5,
               "motion_blur": {"samples": 6, "shutter": 0.5, "max_samples": 32}},
    "output": "out",
    "components": {"fernway": parts},
    "nodes": {
        "paper": {"op": "solid", "params": {"color": "#f4f1ea"}},
        "logo": {"op": "fernway"},
        # the tile starts in the middle of the frame, then the logo slides left as the name arrives
        "placed": {"op": "transform", "inputs": {"source": "logo"},
                   "params": {"anchor": [650, 200],
                              "position": keys(0.85, 1.65, [1426.67, 540], [960, 540], "in_out_cubic"),
                              "scale": keys(0, 3.5, 0.96, 1, "out_sine")}},
        "out": {"op": "over", "inputs": {"fg": "placed", "bg": "paper"}},
    },
}
json.dump(doc, open("reveal.json", "w"), indent=1)
``` 

After the script, the first letter looks like this (its path data cut short here):

```
"letter-f": { "op": "path", "params": {
  "d": "M 432.40 238.33 L 432.40 117.67 Q 432.40 113.15 432.73 107.7 …",
  "color": "#10261dff", "fill_rule": "nonzero",
  "anchor": "$anchor", "rotation": "$rotation", "scale": "$scale",
  "position": { "keys": [ { "t": 1.05, "v": [0, 36], "ease": "out_cubic" }, { "t": 1.55, "v": [0, 0] } ] },
  "opacity":  { "keys": [ { "t": 1.05, "v": 0, "ease": "out_cubic" }, { "t": 1.35, "v": 1 } ] } } }
``` 

```
$ python3 animate.py && uf check reveal.json && uf sheet reveal.json --count 10
$ uf export reveal.json reveal.mp4
exported 105 frames (1920x1080 @ 30 fps, mp4 h264, standard) in 0.18 s = 574 fps, 0 readbacks -> reveal.mp4
``` 

  * `trim_end` draws a stroke along its length, from where the path starts. The stem's path starts at the bottom, so it grows upward; the underline's starts on the left.
  * Each leaf grows from the first point of its path, which is where it meets the stem. A pivot from the path data is often the right one: designers tend to start a shape where it attaches.
  * The whole logo is placed once, by the `transform` node around it, so every key inside stays in the logo's own pixels. Paths under a transform are drawn at their final size, so nothing goes soft.
  * Motion blur is on. At the default six samples the slide showed as separate copies of the logo; `max_samples` lets a frame take one sample for every 2 px its fastest layer moves, up to 32, so fast frames blur smoothly and still frames stay cheap.
  * `uf sheet` puts frames from across the reveal on one image, which is the quickest way to check the timing. The letters are outlines, not text, so `uf review`'s text checks (size, contrast, clipping) don't apply to them; it found no other problems here.

The export took 0.62–0.64 s from Enter to file, warm. The document is 18 KB, most of it path data, and it renders the same every time.

## MP4, ProRes, WebM or GIF

The output format follows the file name, and flags set the codec, size and transparency. For a transparent background, render the logo without the paper behind it: point the document's output at the placed logo.

```
jq '.output = "placed"' reveal.json > reveal-alpha.json
``` 

Times are wall clock from the command to the file, warm, on one RTX 5090 workstation with the published 0.2.1 binary, three runs each. Every file is the 3.5 s reveal.

Output| Command| Time| File  
---|---|---|---  
MP4, H.264, 1920×1080| `uf export reveal.json reveal.mp4`| 0.62–0.64 s| 261 KB  
MP4, 4K (3840×2160)| `uf export reveal.json reveal-4k.mp4 --size 4k`| 1.0 s| 600 KB  
ProRes 4444 with alpha| `uf export reveal-alpha.json reveal.mov --codec prores --alpha`| 1.36–1.39 s| 21 MB  
WebM (VP9) with alpha| `uf export reveal-alpha.json reveal.webm --alpha`| 2.1 s| 273 KB  
GIF, 960×540| `uf export reveal.json reveal.gif --size 960x540`| 1.0 s| 918 KB  
  
  * H.264 is encoded on the GPU straight from the rendered frames. ProRes, VP9 and GIF are encoded on the CPU, which is why they take longer.
  * The transparent files are really transparent: the ProRes is 4444 with 12-bit alpha (`yuva444p12le`), and the WebM carries VP9's alpha channel. In a frame decoded from each at 3 s, near the end of the reveal, over 91 % of the pixels are fully transparent. The ProRes drops into Premiere Pro, Final Cut Pro, DaVinci Resolve or After Effects as a logo layer over footage, and the WebM plays over a web page in Chrome and Firefox.
  * 4K is drawn at 3840×2160 from the vector paths, not scaled up from the 1080p frames.
  * A GIF for a README or an email is better small: `--size 960x540` keeps it to 918 KB.
  * `--fps 60` renders more frames for smoother motion, and `--from` and `--to` export part of the timeline. The full list is in the [CLI reference](<https://ultrafast.mov/docs/cli/>).

## Prepare the SVG

  * **Name the parts you'll animate.** The nodes take their names from the SVG's `id` attributes, so `letter-f` beats `path12`. In Figma, turn on _Include "id" attribute_ in the SVG export settings; in Illustrator, choose _Object IDs: Layer Names_ in the SVG options; in Inkscape, set the ID in Object Properties.
  * **Turn text into outlines.** SVG text is set in the fonts the `text` op finds: installed ones, ultrafast's own, and Google Fonts, fetched the first time. A font none of them has is replaced, with a warning. For the exact letterforms, and to move letters one at a time, outline it before you export: _Outline text_ in Figma's SVG export settings, _Type > Create Outlines_ in Illustrator, _Path > Object to Path_ in Inkscape.
  * **One path per piece that moves.** Letters you want to move one at a time each need their own path. Outlined text is often grouped by word or line, so ungroup it before you export.
  * **Keep it flat.** Images, pattern fills and filter effects don't come through (next section). Leave the drop shadow or glow out of the SVG and add it in ultrafast with `drop_shadow` or `glow`, where it can be animated too.

## What imports

These were tested one feature at a time with 0.2.2, each file rendered by ultrafast and by Chromium. Drawn the same as in the browser: paths and basic shapes; fills and strokes with dashes, caps and joins; linear and radial gradients on fills and strokes; even-odd fills; groups, transforms and `<use>`; CSS classes in a `<style>` block; clip paths and masks; Gaussian blur; `mix-blend-mode`, as a `blend` node. The rest:

In the SVG| What 0.2.2 does| Warned  
---|---|---  
Text| Drawn as outlines in the fonts the `text` op finds: installed, ultrafast's own, or fetched from Google Fonts. A font none of them has falls back to the list's generic family, or a serif.| Yes, when a font is replaced  
Opacity below 1| Blended in sRGB inside the SVG, as in a browser. Over your film, the `over` that places it decides: with `"space": "srgb"`, a red circle at 50 % over white is (255, 127, 127), where Chromium gives (255, 126, 126); ultrafast's default, linear light, gives (255, 188, 188).| No  
Radial gradient focal point| Drawn centred| Yes  
Pattern fills| Skipped| Yes  
Embedded images| Skipped; place the image with an `image` node| Yes  
Filters other than a plain blur, such as drop shadows| Skipped; add `drop_shadow` or `glow`| Yes  
SMIL or CSS animation| Ignored: the SVG is read as a still| No  
  
To see what your own file does, run `uf import-svg logo.svg` (warnings go to the terminal, the parts to the output) and render a still with `uf render quick.json --at 1 --out still.png` to compare with the file open in a browser.

## With an agent

The same steps work from a coding agent. ultrafast's [MCP server](<https://ultrafast.mov/mcp/>) has an `ultrafast_import_svg` tool that returns the parts, or adds them to a document, and the skill's reference tells agents that SVG artwork imports as a component with every part editable. The agent writes the keys, looks at a contact sheet, and exports. A prompt to start from:

```
Animate logo.svg as a 3-second logo reveal for a 1080p video intro: the mark pops in
first, then the name rises in letter by letter. Check the timing with a contact sheet,
then export reveal.mp4 and a transparent ProRes 4444 reveal.mov.
``` 

Setup for Claude Code, Codex, Cursor and Gemini CLI is on the [Integrations](<https://ultrafast.mov/integrations/>) page, and a recorded session from prompt to MP4 is in [Make a video with Claude Code](<https://ultrafast.mov/guides/claude-code/>).

## Other ways to animate an SVG logo

  * **SVGator** is a web app for animating SVGs on a timeline. Video and GIF export are on its Pro and Team plans; the free plan exports static SVG only, and Starter exports animated SVG, Lottie, React Native and Flutter. Video comes out as MP4, AVI, MKV, MOV or WebM.
  * **After Effects** imports an SVG as footage or as a composition of editable shape layers, one per element, which you keyframe on the timeline and render from After Effects or Media Encoder. Ways to automate it, or replace it with code, are compared in [After Effects alternatives](<https://ultrafast.mov/alternatives/after-effects/>).
  * **Lottie:** animate the logo in After Effects with Bodymovin or in a Lottie editor, then render the Lottie to video; see [Lottie to MP4](<https://ultrafast.mov/guides/lottie-to-mp4/>).
  * **Browser capture:** if the SVG already animates with CSS or SMIL, a tool that plays it in headless Chrome and records the frames keeps that animation. HyperFrames has a [converter for this](<https://hyperframes.heygen.com/tools/svg-animation-to-mp4>). ultrafast reads an SVG as a still, so it doesn't play those animations.

Use ultrafast when you have a static logo and want the reveal written down: a script or an agent sets the keys, the same document renders the same every time, and one command gives MP4, ProRes, WebM or GIF in seconds. It also fits when the logo is one layer of a longer video. Use SVGator or After Effects to keyframe by hand on a timeline, and browser capture when the SVG already moves.

## Questions

How do I turn an SVG logo into an MP4?

Put the SVG in a short ultrafast document with an `svg` node, add keys to its `scale` and `opacity`, and run `uf export logo.json logo.mp4`. On one RTX 5090 workstation with ultrafast 0.2.1, a 3-second 1080p reveal took 0.56 to 0.58 s from the command to the file.

How do I animate each part of a logo separately?

Run `uf import-svg logo.svg`. It gives every shape as its own node, named after its `id` in the SVG, and you set keys on the parts you want to move: `trim_end` to draw a stroke on, `scale` around a pivot to pop a shape in, `position` and `opacity` to stagger letters.

Can I export a logo animation with a transparent background?

Yes. Leave the background out of the document's output and export with `--alpha`: `--codec prores` gives ProRes 4444 with 12-bit alpha for video editors, and a `.webm` name gives VP9 with alpha for web pages.

Can ultrafast convert an animated SVG to video?

No. It reads an SVG as a still image and doesn't play SMIL or CSS animation. A tool that plays the SVG in headless Chrome and records it keeps that animation; ultrafast is for animating a static logo.

Why is the text in my SVG missing?

SVG text is drawn only when its font is installed on the machine that renders it. In ultrafast 0.2.1 a font that isn't installed draws nothing, with no warning. Convert the text to outlines in Figma, Illustrator or Inkscape before exporting the SVG.
