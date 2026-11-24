# Personalized videos from a CSV, open source · ultrafast

> Make one personalized video per row of a CSV or JSON file on your own GPU with an open-source engine: the template, the sheet, checking every row before rendering, long names, a photo per row, and the same from Python or HTTP.

URL: https://ultrafast.mov/guides/personalized-videos-from-csv/

Docs

# Personalized videos from a CSV.

A template and a spreadsheet make a finished video per row, each with its own customer name, order number and code. Rendered on your own GPU by an open-source engine, so the rows never leave your machine and no one charges per video.

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
  * [This page as Markdown](<https://ultrafast.mov/guides/personalized-videos-from-csv/index.md>)

[Video: Twelve thank-you videos playing side by side, each with its own name, colour, order number and discount code](https://ultrafast.mov/media/guides/csv-batch.mp4) Twelve of 100 videos made from one template and a 100-row sheet. All 100 exported in 18.0 s on one RTX 5090. **On this page**

  1. The template
  2. The sheet
  3. Check every row first
  4. Long names
  5. Render the batch
  6. A photo or clip per row
  7. From code, a queue or an agent
  8. Limits
  9. Questions

## The template

The template is an ordinary ultrafast document: a JSON file with a `format`, a graph of `nodes` and an `output` (the whole shape is in [Render video from JSON](<https://ultrafast.mov/guides/render-video-from-json/>)). This one is the engine's vertical starter (`uf new vertical card.json`), a 6-second 1080×1920 card, with its words changed to a thank-you note. Three of its nodes are the parts that change per customer:

```
"line2": { "op": "text", "params": {
  "text": "Priya.", "font": "Instrument Serif", "style": "italic", "size": 190, "color": "#ffd7a8",
  "position": { "keys": [ { "t": 0.55, "v": [84, 1210], "ease": { "bezier": [0.16, 1, 0.3, 1] } },
                          { "t": 1.25, "v": [84, 1020] } ] } } },
"label": { "op": "text", "params": {
  "text": "ORDER 10482", "font": "Geist Mono", "size": 26, "position": [86, 600] } },
"code": { "op": "text", "params": {
  "text": "10% off the next one: PRIYA10", "font": "Geist Mono", "size": 36, "color": "#ffd7a8",
  "position": [86, 1320], "reveal": { "keys": [ { "t": 2.4, "v": 0 }, { "t": 4.4, "v": 50 } ] } } }
``` 

Nothing in the template marks a field as a variable. Any param of any node can be set from the sheet, so the design stays a normal document you can preview, check and edit like any other.

## The sheet

A column named `node.param` sets that param in each row's copy of the template. Any other column is just data, and can name the output file.

```
name,line2.text,label.text,code.text,line2.color
priya,Priya.,ORDER 10482,10% off the next one: PRIYA10,#ffd7a8
tomas,Tomás.,ORDER 10483,10% off the next one: TOMAS10,#a8e0ff
mei,Mei.,ORDER 10484,10% off the next one: MEI10,#c8ffa8
``` 

  * Rows can be CSV, a JSON array of objects, or JSON lines.
  * Numbers are read as numbers (`line2.size` = `160`), colours as hex text with optional alpha.
  * `format.width`, `format.height` and the other format fields can be columns too. Layout built from blocks and captions follows the frame; pixel positions such as this card's don't, so give each size its own template.
  * In `--out`, `{name}` is filled from the `name` column (any column works) and `{row}` is the row number. Two rows that would write the same file stop the batch before it starts (`Error: row 97: writes out/ines.mp4 again`, from an Inès and an Ines), so add `{row}` when names can repeat.

## Check every row before anything renders

`uf batch` builds every row's document first and checks each one, so a typo in row 400 stops the run before the first frame. The error names the row and what's wrong:

```
$ uf batch card.json --data rows.csv --out 'out/{name}.mp4'
Error: row 1: `nosuch.text`: no node `nosuch` (did you mean `code`?)
``` 

To see each row's document, write them out instead of rendering, and check them like any other file:

```
uf batch card.json --data rows.csv --out 'out/{name}.mp4' --docs docs/   # docs/priya.json, docs/tomas.json, docs/mei.json
for f in docs/*.json; do uf check "$f"; done
``` 

`check` reports two levels. A missing file is an error (`"severity": "error"`) and stops a batch. A value of the wrong type, such as text in a number column, is a warning: the batch still runs, so read the warnings when a sheet comes from somewhere new.

## Long names

Add a row for `Maximiliana-Josefina.` and `check` still passes: a name too wide for the frame is a valid document. Catching it takes a render. `uf sheet` puts nine frames of one row on a single image, and `uf review` reads every frame for text that is clipped, overlapping, too small or on screen too briefly to read:

```
uf sheet docs/maximiliana.json --count 9 --out sheet.png
uf review docs/maximiliana.json --safe social      # also flags text under a social app's buttons and captions
``` 

For a sheet of unknown names, review the longest few rows before the full run. For full names with spaces, a wrap width (`"width"` on the text node, in pixels) breaks a long one onto a second line instead of running it off the edge.

Text that types itself on needs the same care. `reveal` counts glyphs, so its last key must be at least as long as the longest row's text. This card's code first stopped at 30, and `10% off the next one: ISABELA10`, 31 glyphs, ended on `ISABELA1`. The batch still exports that row, and from 0.2.1 it says which row it is:

```
36/100 out/isabela.mp4: 180 frames in 0.19 s
warning: row 36: node `code`: text: its `reveal` keys stop at 30, so the last 1 of its 31 glyphs never show in full: key it up to 31
``` 

`uf check` gives the same warning on that row's document, so check the documents from `--docs` before a long run. This card now types on at the same speed up to 50.

## Render the batch

```
uf batch card.json --data rows.csv --out 'out/{name}.mp4'
uf batch card.json --data rows.csv --out 'out/{name}.mp4' --codec hevc --quality high   # export settings apply to every row
``` 

One renderer stays warm for the whole sheet, so fonts and GPU pipelines load once for the whole run, not once per video. Each row prints its frame count and time, and the run ends with the total. With this card and a 100-row sheet, on one RTX 5090 workstation:

```
$ uf batch card.json --data rows.csv --out 'out/{name}.mp4'
1/100 out/priya.mp4: 180 frames in 0.33 s
2/100 out/tomas.mp4: 180 frames in 0.18 s
3/100 out/mei.mp4: 180 frames in 0.18 s
...
100 videos in 18.0 s
``` 

That's 18.0 s for 100 six-second 1080×1920 videos, the same in each of three runs. After the first row, each video took 0.17 or 0.18 s. A longer or busier template takes longer per row. Every export setting works here: H.264, HEVC or AV1 MP4, ProRes, WebM, GIF, any size and frame rate. `uf estimate card.json` reports the GPU time of one video before you start.

## A photo, a logo or a clip per row

An `image` or `video` node takes its file from `src`, so a column can swap it per row:

```
name,line2.text,photo.src
priya,Priya.,photos/priya.jpg
tomas,Tomás.,photos/tomas.jpg
``` 

Relative paths resolve from the template's folder. When `--docs` writes the row documents to another folder, it rewrites those paths so each document still finds its files. A row whose file is missing fails the check, before rendering starts.

## From code, a queue or an agent

When the rows come from a database or a form instead of a file, set the params in code. `uf serve` runs the same engine behind an HTTP API on your machine, with one API key, and the Python and TypeScript SDKs wrap it:

```
import csv
from ultrafastmov import Ultrafast

uf = Ultrafast()                          # your uf serve; ULTRAFAST_API_KEY
card = uf.load("card.json")
for row in csv.DictReader(open("customers.csv")):
    doc = card.copy()                     # a deep copy; relative paths still resolve from card.json's folder
    doc["nodes"]["line2"]["params"]["text"] = row["first_name"] + "."
    doc["nodes"]["code"]["params"]["text"] = f"10% off the next one: {row['code']}"
    uf.render(doc).save(f"out/{row['id']}.mp4")
``` 

Any tool that can send an HTTP request can do the same with `POST /v1/render` and the row's document ([HTTP API](<https://ultrafast.mov/docs/api/>)). A self-hosted server renders one job at a time on its GPU; send the rows one after another. Agents get the same thing as an MCP tool: `ultrafast_batch` renders one document per row of a data file, or of rows passed inline (up to 20 a call on a remote server, a download link per row; see [MCP server](<https://ultrafast.mov/docs/mcp/>)).

## Limits

  * It needs a Mac with Apple silicon, or Linux with a Vulkan GPU. Without a GPU, the Docker image renders on the CPU, correctly but much more slowly.
  * There's no hosted service yet: you run the renderer. [ultrafast Cloud](<https://ultrafast.mov/cloud/>) is a waitlist.
  * One template per batch. Different layouts per segment are separate templates, or a `format` column with layout that follows the frame.
  * Hosted APIs such as Shotstack, JSON2Video and Creatomate run the render for you and charge per minute; their prices and formats are compared on [ultrafast vs JSON-to-video APIs](<https://ultrafast.mov/alternatives/json-to-video-api/>).

## Questions

Can I make personalized videos from a spreadsheet for free?

Yes, if you have the hardware. ultrafast is open source (Apache-2.0 or MIT) and renders on your own Mac with Apple silicon or Linux machine with a Vulkan GPU, so there is no per-video or per-minute fee: `uf batch card.json --data rows.csv --out 'out/{name}.mp4'` makes one video per row.

Does my customer data leave my machine?

Not with the command line: `uf batch` reads the sheet and renders on the same machine. With `uf serve`, the rows go only to the server you run. Fonts named in a template may be downloaded by name the first time they are used.

Can each row have its own photo or video clip?

Yes. A column such as `photo.src` sets the file of an `image` or `video` node per row. Relative paths resolve from the template's folder, and a row whose file is missing stops the batch before anything renders.

How do I stop long names from running off the frame?

Render and look: `uf review` on the longest rows reports text that runs off the frame, overlaps other text or is too small, and `uf sheet` shows nine frames on one image. A wrap width on the text node breaks a long full name onto a second line. `uf check` alone can't see it, because a long name is a valid document.

How long does it take to render 100 personalized videos?

It depends on the template and the GPU. The 6-second 1080×1920 card in this guide took 18.0 s for a 100-row sheet on one RTX 5090 workstation, about 0.18 s per video after the first. `uf estimate card.json` reports one video's GPU time on your machine before you run the batch.

Can I do this from n8n, Zapier or my own code?

From your own code, yes: the Python and TypeScript SDKs talk to `uf serve`, so you copy the template, set the params from your data and render. There is no n8n or Zapier node, but their HTTP request step can POST each row's document to `/v1/render` on your server.
