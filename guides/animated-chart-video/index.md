# Animated chart videos from a CSV: bar, line and donut · ultrafast

> Make animated bar, line and donut chart videos from a CSV with code: one JSON node per chart, a video per row with uf batch, 16:9, 4:5 and 9:16 from one document, and a review pass before you post. Real data, measured render times.

URL: https://ultrafast.mov/guides/animated-chart-video/

Docs

# Animated charts from a CSV.

Bar, line and donut charts that build themselves on screen, rendered to MP4 on your own GPU from the numbers in a CSV. Every chart on this page uses real data, solar's share of electricity from Ember via Our World in Data, and each one comes with its document, its clip and how long the export took.

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
  * [This page as Markdown](<https://ultrafast.mov/guides/animated-chart-video/index.md>)

[Video: A bar chart titled Where the sun does the most work: seven bars rise one after another, Chile first in amber at 25.1 percent, then Spain, Australia, Germany, China, India and the United States in cream, each value counting up as its bar grows](https://ultrafast.mov/media/guides/chart-video-bar.mp4) A bar chart from seven numbers and their labels, exported in about half a second. **On this page**

  1. A chart is one node
  2. Bar charts
  3. Donuts
  4. Values from a CSV
  5. A video per row
  6. Check before you post
  7. 16:9, 4:5 and 9:16
  8. Charts the blocks don't draw
  9. Render times
  10. Limits
  11. Questions

## A chart is one node

ultrafast has three ready-made charts: `bar_chart`, `line_chart` and `donut`. Each is a `block` node. You give it the values and labels, and it builds the axis, the marks, the numbers and the animation in one house style. This is the whole document for the line chart below:

```
{
  "version": 1,
  "format": { "width": 1920, "height": 1080, "fps": 30, "duration": 6 },
  "output": "out",
  "nodes": {
    "bg": { "op": "solid", "params": { "color": "#0e1116" } },
    "chart": { "op": "block", "params": {
      "kind": "line_chart",
      "kicker": "WORLD, 2015 TO 2025",
      "title": "Solar's share of electricity",
      "values": [1.1, 1.3, 1.7, 2.2, 2.6, 3.2, 3.7, 4.6, 5.6, 6.9, 8.7],
      "labels": "2015,2016,2017,2018,2019,2020,2021,2022,2023,2024,2025",
      "suffix": "%", "decimals": 1, "height": 500, "draw_time": 2.2,
      "ink": "#f4efe6", "accent": "#ffb21e" } },
    "source": { "op": "text", "params": {
      "text": "Data: Ember and others, via Our World in Data (CC BY 4.0)",
      "font": "ultrafast:mono", "size": 26, "color": "#8a8f98", "position": [192, 983] } },
    "a": { "op": "over", "inputs": { "fg": "chart", "bg": "bg" } },
    "out": { "op": "over", "inputs": { "fg": "source", "bg": "a" } }
  }
}
``` 

```
uf check line.json && uf export line.json line.mp4
``` 

[Video: A line chart titled Solar's share of electricity, world, 2015 to 2025: the amber line draws itself from left to right with the area under it filling in, a dot pops at each year, and 8.7 percent appears over the last point](https://ultrafast.mov/media/guides/chart-video-line.mp4)

  * The line draws on over `draw_time` seconds, a dot pops as the line reaches each value, and the area underneath fills in behind it (`"area": false` leaves it out).
  * `highlight` picks the point that gets the large dot and its value; for a line it defaults to the last. `suffix`, `prefix` and `decimals` format the numbers.
  * The plot runs from 0 (or the smallest value, if it's negative) to the largest value. Set `min` and `max` to fix the scale.
  * The chart stays for `duration` seconds (5 by default), then leaves. Put it later in a longer film with `"timing": {"offset": 12}` on the node.
  * `ink`, `muted` and `accent` set the colours; `display_font`, `text_font` and `mono_font` the type. Sizes follow the frame.

## Bar charts

Swap the `kind` and the data. Bars rise one after another and each value counts up on top of its bar. The largest is drawn in the accent colour unless `highlight` names another index (`-1` for none). The clip at the top of the page is this node:

```
"chart": { "op": "block", "params": {
  "kind": "bar_chart",
  "kicker": "SHARE OF ELECTRICITY FROM SOLAR, 2025",
  "title": "Where the sun does the most work",
  "values": [25.1, 21.8, 19.6, 17.9, 11.1, 9.4, 8.6],
  "labels": "Chile,Spain,Australia,Germany,China,India,US",
  "suffix": "%", "decimals": 1, "height": 500,
  "ink": "#f4efe6", "accent": "#ffb21e" } },
``` 

`color` sets the other bars. Labels are comma-separated; when a label holds a comma, separate them with `|` instead.

## Donuts

[Video: A donut chart titled Where electricity comes from, world, 2025: seven segments sweep round in turn, solar in amber, then coal, gas, hydro, nuclear, wind and other, with a legend of shares beside it and 9 percent, solar, counting up in the middle](https://ultrafast.mov/media/guides/chart-video-donut.mp4)

```
"chart": { "op": "block", "params": {
  "kind": "donut",
  "kicker": "WORLD, 2025",
  "title": "Where electricity comes from",
  "values": [8.75, 32.96, 21.78, 13.96, 8.85, 8.54, 5.17],
  "labels": "Solar,Coal,Gas,Hydro,Nuclear,Wind,Other",
  "highlight": 0, "height": 520,
  "ink": "#f4efe6", "accent": "#ffb21e" } },
``` 

  * Values are shares of their total, so they don't have to add up to 100. The middle counts up to the highlighted segment's share, here solar.
  * The legend rounds each share to a whole percent. Pass two decimals, as here: rounded to one, wind's 8.54 becomes 8.5, which rounds down to 8% while its real share is nearer 9%.
  * `colors` takes a comma-separated list of segment colours; by default the accent comes first, then a built-in palette. `radius` and `thickness` size the ring.

## Values from a CSV

The numbers above come from Our World in Data's download of Ember's electricity data, a plain CSV with one row per country and year:

```
$ curl -L -o share-electricity-solar.csv \
    "https://ourworldindata.org/grapher/share-electricity-solar.csv?v=1&csvType=full&useColumnShortNames=true"
$ head -3 share-electricity-solar.csv
entity,code,year,solar_share_of_electricity__pct
ASEAN (Ember),,2000,0
ASEAN (Ember),,2001,0
``` 

A document is JSON, so filling a chart from a file is a few lines in any language. This script puts the world's last eleven years into `line.json`:

```
# fill_line.py: the world's share of electricity from solar, 2015 to 2025, into line.json
import csv, json

rows = csv.DictReader(open("share-electricity-solar.csv"))
share = {int(r["year"]): float(r["solar_share_of_electricity__pct"]) for r in rows if r["entity"] == "World"}
years = range(2015, 2026)

doc = json.load(open("line.json"))
chart = doc["nodes"]["chart"]["params"]
chart["values"] = [round(share[y], 1) for y in years]
chart["labels"] = ",".join(str(y) for y in years)
json.dump(doc, open("line.json", "w"), indent=2)
print(chart["values"])
``` 

```
$ python fill_line.py
[1.1, 1.3, 1.7, 2.2, 2.6, 3.2, 3.7, 4.6, 5.6, 6.9, 8.7]
``` 

## A video per row

[Video: Eight portrait line charts in a four by two grid, one each for the world, Chile, Spain, Australia, Germany, China, India and the United States, all drawing at once on the same 0 to 30 percent scale; Chile climbs highest, to 25.1 percent](https://ultrafast.mov/media/guides/chart-video-batch.mp4) Eight 4:5 videos from one template and an eight-row CSV, made in 1.7 s.

For many charts of the same kind, keep one template and let `uf batch` fill it from a CSV. A column named `node.param` sets that param on that node; other columns, like `name`, only name the output files. The template is a 4:5 version of the line chart:

```
"format": { "width": 1080, "height": 1350, "fps": 30, "duration": 6 },
...
"chart": { "op": "block", "params": {
  "kind": "line_chart",
  "kicker": "2015 TO 2025",
  "title": "Solar's share of electricity",
  "values": [1.1, 1.3, 1.7, 2.2, 2.6, 3.2, 3.7, 4.6, 5.6, 6.9, 8.7],
  "labels": "2015,2016,2017,2018,2019,2020,2021,2022,2023,2024,2025",
  "suffix": "%", "decimals": 1, "height": 640, "max": 30, "draw_time": 2.2,
  "ink": "#f4efe6", "accent": "#ffb21e" } },
"source": { "op": "text", "params": { ..., "position": [108, 1262] } },
``` 

```
# make_rows.py: one row per country for uf batch
import csv

src = list(csv.DictReader(open("share-electricity-solar.csv")))
places = ["World", "Chile", "Spain", "Australia", "Germany", "China", "India", "United States"]

with open("rows.csv", "w", newline="") as f:
    out = csv.writer(f)
    out.writerow(["name", "chart.kicker", "chart.values"])
    for place in places:
        share = {int(r["year"]): float(r["solar_share_of_electricity__pct"]) for r in src if r["entity"] == place}
        out.writerow([place.lower().replace(" ", "-"), f"{place.upper()}, 2015 TO 2025",
                      ",".join(f"{share[y]:.1f}" for y in range(2015, 2026))])
``` 

```
name,chart.kicker,chart.values
world,"WORLD, 2015 TO 2025","1.1,1.3,1.7,2.2,2.6,3.2,3.7,4.6,5.6,6.9,8.7"
chile,"CHILE, 2015 TO 2025","1.7,3.3,4.9,6.3,7.5,9.0,12.0,17.3,20.1,22.8,25.1"
spain,"SPAIN, 2015 TO 2025","5.0,5.0,5.3,4.7,5.6,8.0,10.0,12.4,17.4,20.7,21.8"
...
``` 

```
$ uf batch country.json --data rows.csv --out 'out/{name}.mp4'
1/8 out/world.mp4: 180 frames in 0.29 s
2/8 out/chile.mp4: 180 frames in 0.15 s
3/8 out/spain.mp4: 180 frames in 0.15 s
...
8/8 out/united-states.mp4: 180 frames in 0.15 s
8 videos in 1.4 s
``` 

  * A cell of numbers separated by commas becomes the list of values. Quote it in the CSV, as Python's `csv` module does, because it holds commas.
  * `"max": 30` in the template puts every country on the same scale. Without it, each chart scales to its own peak, and the world's 8.7% would look as tall as Chile's 25.1%.
  * A column that names a node the template doesn't have stops the batch before the first frame: `Error: row 1: `chrat.values`: no node `chrat` (did you mean `chart`?)`. A misspelled param on a real node doesn't. In 0.2.1, `chart.valeus` rendered every video with the template's values and said nothing. Write the row documents with `--docs` and run `uf check` on one first: it warns ``block` has no param `valeus``.
  * An empty cell keeps the template's value. More on templates, names and photos per row in [personalized videos from a CSV](<https://ultrafast.mov/guides/personalized-videos-from-csv/>).

## Check before you post

`uf review` reads every frame and reports text that is clipped, too small, too brief, low in contrast or outside the safe areas. On the first version of these charts it caught the source line twice. At 22 px:

```
"kind": "small_text", "node": "source",
"message": "\"Data: Ember and others, via Our World in…\" is set at 22 px; below about 24 px it is hard to read on a phone"
``` 

And once it was 26 px, still sitting near the bottom edge of the 16:9 frame:

```
"kind": "unsafe_area", "node": "source",
"message": "\"Data: Ember and others, via Our World in…\" sits in the safe margin (bounds 195,1017 to 1075,1037)"
``` 

Moving it up to y 983 cleared both. All four documents on this page, and the eight row documents the batch made (`uf batch ... --docs DIR` writes them out), now review with no issues.

## 16:9, 4:5 and 9:16 from one document

[Video: The same line chart three times side by side, in a wide 16:9 frame, a 4:5 portrait frame and a tall 9:16 frame, each laid out to fit its own shape](https://ultrafast.mov/media/guides/chart-video-shapes.mp4)

Charts lay themselves out from the frame, so the same document renders for YouTube, an Instagram post and Shorts or Reels. `format.width` and `format.height` work as batch columns too, so one CSV gives all three:

```
name,format.width,format.height,chart.height,source.position
youtube,1920,1080,500,"192,983"
instagram,1080,1350,640,"108,1262"
shorts,1080,1920,900,"108,1800"
``` 

```
$ uf batch line.json --data shapes.csv --out '{name}.mp4'
1/3 youtube.mp4: 180 frames in 0.33 s
2/3 instagram.mp4: 180 frames in 0.15 s
3/3 shorts.mp4: 180 frames in 0.19 s
3 videos in 0.7 s
``` 

The chart's own `height` and the source line's `position` are in pixels, so they change with the shape. The title, labels and numbers scale with the frame on their own.

## Charts the blocks don't draw

A chart block expands into ordinary `path`, `shape` and `text` nodes, and you can write those yourself for any chart the blocks don't cover. [The Keeling Curve](<https://ultrafast.mov/examples/keeling/>) example does this: every monthly mean of carbon dioxide at Mauna Loa since March 1958, 824 values, is one `path` whose `d` a script wrote from NOAA's file. Keying its `trim_end` up to 1 draws the curve on, and `morph` blends it into a stretched copy of itself (`to`) for the dive into 2025. Its full document is [keeling.json](<https://ultrafast.mov/examples/keeling.json>).

The same parts make other charts: a `shape` per point for a scatter plot, one `path` per series for several lines, `text` with a keyed `number` for a counter that tracks a value.

Data from an API works the same way as data from a CSV. [A film of a GitHub repo](<https://ultrafast.mov/guides/github-repo-video/>) fills a line chart, a bar chart and a donut from the GitHub API and puts them in one film with a title and an end card.

## Render times

Command| Frames| Time  
---|---|---  
`uf export line.json`| 180| 0.54–0.57 s  
`uf export bar.json`| 180| 0.51–0.57 s  
`uf export donut.json`| 180| 0.52–0.55 s  
`uf export country.json`, 1080×1350| 180| 0.57–0.62 s  
`uf batch country.json`, 8 rows| 8 × 180| 1.68–1.70 s  
`uf batch line.json`, 3 shapes| 3 × 180| 1.00–1.46 s  
  
Wall clock from the command to the last file, warm, three runs each (five for the eight-row batch, six for the shapes), on one RTX 5090 workstation with the published 0.2.1 binary, 6-second videos at 30 fps to H.264. The time inside a batch's own report leaves out start-up, which is why it says 1.3 or 1.4 s. The clips on this page are smaller web copies of these exports.

## Limits

  * **One series per chart.** `bar_chart` and `line_chart` take one list of values: no grouped or stacked bars and no second line. Build those from paths and shapes, as above.
  * **No bar chart race.** There's no block for bars that reorder over time.
  * **No y axis or gridlines.** Bars carry their own values and the line labels its highlighted point.
  * **Up to about nine x labels.** With more values, the chart shows every second or third label and always the last. Blank labels count in that thinning, so pass every label and let the chart pick; a hand-thinned list like `2015,,,,,2020,,,,,2025` loses 2020.
  * **Video, not a web chart.** For a chart people can hover and zoom on a page, use a charting library. ultrafast makes video files, and it needs a GPU: an Apple silicon Mac, or Linux or WSL2 with Vulkan.

## Questions

How do I turn a CSV into an animated chart video?

Put the numbers in a chart block's `values` and the categories in `labels`, then run `uf export chart.json chart.mp4`. A few lines of Python can read the CSV and fill the document, and `uf batch chart.json --data rows.csv` makes one video per row, with a `chart.values` column setting each row's numbers.

Can I make a bar chart race?

Not with a ready-made block. `bar_chart` draws one set of values that rise in turn; there's no block for bars that reorder over time.

Can I make animated chart videos with Python?

Yes. Python can write the ultrafast document, as `fill_line.py` and `make_rows.py` do on this page, and ultrafast renders it on the GPU. matplotlib's animation module is the other common route: it draws each frame on the CPU and saves the video through FFmpeg.

What size should a chart video be for YouTube, Instagram and Shorts?

1920×1080 (16:9) for YouTube, 1080×1350 (4:5) for an Instagram post, and 1080×1920 (9:16) for Shorts, Reels and TikTok. Chart blocks lay themselves out from the frame, so one document makes all three with `format.width` and `format.height` columns in a batch.

How long does a chart video take to render?

On one RTX 5090 workstation with ultrafast 0.2.1, each 6-second 1080p chart on this page exported in 0.51 to 0.57 s, and eight 4:5 videos, one per country, took 1.68 to 1.70 s as a batch.
