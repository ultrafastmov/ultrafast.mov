# Free video templates as JSON: promo, explainer, 3D product · ultrafast

> Six free video templates you edit as JSON and render on your own GPU: a vertical title card, a 16:9 title, a square poster, a 13-second promo, an explainer and a 3D product shot, each exported in under half a second.

URL: https://ultrafast.mov/templates/

Docs

# Video templates you edit as JSON.

Six free video templates built into ultrafast, an open-source video engine that renders on your own GPU: a vertical title card, a 16:9 title, a square poster, a 13-second promo, an explainer and a 3D product shot. Each one is a single JSON file. Change the words and colours, check it, and export it in under half a second.

## Start

  * [Quickstart](<https://ultrafast.mov/docs/>)
  * [The document](<https://ultrafast.mov/docs/documents/>)
  * [Templates](<https://ultrafast.mov/templates/>)

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
  * [This page as Markdown](<https://ultrafast.mov/templates/index.md>)

[Video: A white ceramic speaker with a grey fabric band and a gold top ring turns slowly on a pale studio sweep as the camera drifts round it; on the left, the name Aurora fades up letter by letter, then the line Room-filling sound, in porcelain, and the price, From $349](https://ultrafast.mov/media/guides/template-product.mp4) The product template, as `uf new product` writes it: a 3D speaker on a studio sweep, 240 frames of 1080p exported in 0.24 s. **On this page**

  1. The six templates
  2. Vertical title card
  3. 16:9 title
  4. Square poster
  5. Promo
  6. Explainer
  7. 3D product shot
  8. Make one your own
  9. Another shape
  10. With an agent
  11. One video per row
  12. Templates elsewhere
  13. Questions

## The six templates

Install `uf` (a Mac with Apple silicon, or Linux with a Vulkan GPU; Windows through WSL2), then ask for a template by name: `vertical`, `title`, `square`, `promo`, `explainer` or `product`.

```
curl -fsSL https://ultrafast.mov/install.sh | sh     # or: brew install ultrafastmov/tap/ultrafast
uf new promo launch.json
uf export launch.json launch.mp4
``` 

Template| Frame| Length| What's in it| Export  
---|---|---|---|---  
`vertical`| 1080×1920| 6 s| Two lines of serif type rising through masks, a label, a rule drawing in, bloom, vignette, grain| 0.16 s  
`title`| 1920×1080| 6 s| A title rising letter by letter from the middle out over moving marble, a subtitle that types on| 0.34 s  
`square`| 1080×1080| 6 s| A disc and a word in two halftone inks, multiplied onto paper like a two-colour print| 0.12 s  
`promo`| 1080×1920| 13 s| Title, stat, quote and end card with a button, joined by a push, a dissolve and an iris| 0.43 s  
`explainer`| 1920×1080| 12 s| Chapter card, key idea with a lower third, a stat that counts up, a wipe and a slide| 0.27 s  
`product`| 1920×1080| 8 s| A 3D speaker in a studio with the camera orbiting, a name, a line and a price, a film look| 0.24 s  
  
All six are 30 fps, and all but the explainer have motion blur on. Export times are the median of five runs, 0.12 to 0.43 s, with the published 0.2.1 binary on one RTX 5090 workstation, each encoded on the GPU with no frame copied back to the CPU. From pressing Enter to a finished file took 0.51 to 0.84 s.

`uf check` passes all six as they come. `uf review`, which renders the film and looks for text a viewer would trip over, has nothing to say about three of them. For the other three it points at small grey type on the product shot, two placeholder lines in the promo that leave the screen too soon, and the square's word entering from below the frame. Run it again after every edit: it's the quickest way to find what your own words broke.

Each section below shows the film and names the nodes to change. Every node has a name, so `line1`'s `text` is a param you can set by hand, from a script, from a spreadsheet or from an agent. The JSON files are also here to read without installing anything.

## Vertical title card: `vertical`

[Video: A tall dark frame: the words Say the, in pale serif type, rise into place, then one thing., in warm italic, rises beneath them; a small label CHAPTER 01 types on above and a thin rule draws across below](https://ultrafast.mov/media/guides/template-vertical.mp4)

A chapter card or a hook for a short: 6 seconds at 1080×1920, made for Reels, Shorts and TikTok.

  * `line1` and `line2`: the two lines. Each rises into its own window (`line1_mask`, `line2_mask`, both `crop` nodes), so the type appears to come up from behind a line.
  * `label`: `CHAPTER 01`, one glyph at a time.
  * `line2`'s `color` is the warm italic; `ground`'s `stops` set the background.
  * The lines start 84 px from the left edge, which leaves about 1,000 px at 190 px type. `uf review` reports a line that runs off the frame; lower its `size`.

[vertical.json](<https://ultrafast.mov/templates/vertical.json>) · 14 nodes · 0.16 s

## 16:9 title: `title`

[Video: Dark marble in dusky pink, blue and copper swirls and flows across a wide frame; the words Your Title rise into place letter by letter from the middle out, then a subtitle, a subtitle that breathes, types itself on underneath and drifts gently](https://ultrafast.mov/media/guides/template-title.mp4)

An opening title for a talk, a trailer or a YouTube video, over `marble`, a procedural fluid texture that never repeats.

  * `title`: the text, rising from the middle letter outward (`stagger_order` is `center`).
  * `sub`: the subtitle. It types on with a `reveal` that counts glyphs and stops at 24, the length of the placeholder. With longer words, `uf check` says so: `its `reveal` keys stop at 24, so the last 14 of its 38 glyphs never show in full: key it up to 38`.
  * `world`'s `filaments` sets how much fine detail the marble has, and `dim`'s `exposure` how dark it sits behind the type.

[title.json](<https://ultrafast.mov/templates/title.json>) · 8 nodes · 0.34 s

## Square poster: `square`

[Video: A cream square: a pink halftone disc grows in the upper right, then the word BOLD in blue halftone rises into place letter by letter, overlapping the disc where the two inks mix to purple](https://ultrafast.mov/media/guides/template-square.mp4)

A feed post or a cover in the look of a two-ink risograph print.

  * `word`: the text, rising letter by letter.
  * `disc`: a `shape`; its `center` and the last `size` key place it.
  * `pink` and `blue`: `halftone` nodes, each an ink. `r`, `g` and `b` set the ink's colour, `cell` the dot size, `angle` the screen.
  * The inks `multiply` onto `paper`, so where they overlap they darken the way real ink does.

[square.json](<https://ultrafast.mov/templates/square.json>) · 8 nodes · 0.12 s

## Promo: `promo`

[Video: A tall frame over dark purple marble: a small pink kicker over Your product, in one line, and a sentence; a push to 10x FASTER THAN BEFORE with a teal rule; a dissolve in pink specks to a quote from a happy customer; an iris to an end card reading product, the tagline goes here, and a pink Try it free button](https://ultrafast.mov/media/guides/template-promo.mp4)

A 13-second vertical launch video in four parts. It's built from [blocks](<https://ultrafast.mov/docs/ops/>), designed parts with their own layout and motion, so the template's JSON stays short.

  * `title`: `kicker`, `title`, `subtitle`.
  * `stat`: `value` (it counts up), `suffix`, `label`, `accent`.
  * `quote`: `quote` and `author`.
  * `end`: `title`, `tagline` and `cta`, the button.
  * `cut1`, `cut2` and `cut3` are the transitions; each has a `kind` and an `at` time.

Keep the subtitle and the quote short. The quote is readable from 8.6 s until the iris closes on it at 10.3 s, and `uf review` wants about a quarter of a second per word.

[promo.json](<https://ultrafast.mov/templates/promo.json>) · 16 nodes · 0.43 s

## Explainer: `explainer`

[Video: A warm off-white wide frame: 01, The problem, with a red rule drawing beneath it; a wipe to a key-idea headline, a line of evidence and a lower third for Speaker Name; a slide to a large 42% counting up over OF TEAMS SAY SO](https://ultrafast.mov/media/guides/template-explainer.mp4)

A 12-second explainer in three beats on warm paper: a chapter card, a point with the speaker's name, and a number.

  * `chapter`: `number` and `title`.
  * `point`: `kicker`, `title`, `subtitle`; `who` is the lower third, with `name` and `role`.
  * `stat`: `value`, `suffix`, `label`.
  * Every block takes an `ink` colour, and the stat an `accent`; `ground` is the paper.

[explainer.json](<https://ultrafast.mov/templates/explainer.json>) · 12 nodes · 0.27 s

## 3D product shot: `product`

The film at the top of this page. The speaker isn't a model file: a `raymarch` node draws it from 25 lines of signed-distance code in its `scene` param (a ceramic body, a woven band, a brushed gold ring), lit by a studio environment.

  * `name`, `line` and `price`: the three lines of type. `price` types on with a `reveal` that stops at 9, the length of `From $349`.
  * `product`'s `orbit` keys move the camera over the 8 seconds, and `k0` turns the speaker 40°.
  * The materials are numbered in the scene's first comment: 7 ceramic and 4 gold are presets, 20 the fabric and 21 the sweep.
  * `finish` is a `film_look`: halation, grain, a vignette and a little chromatic aberration.

`uf review` rates the grey line at 2.9:1 against the sweep and the price at 2.0:1, under the 3:1 it wants. Setting both `color`s to `#1d1d1f`, the name's colour, clears it.

[product.json](<https://ultrafast.mov/templates/product.json>) · 8 nodes · 0.24 s

## Make one your own

Here's the promo turned into a launch video for Tidewell, a made-up notes app. Start from the template:

```
$ uf new promo launch.json
wrote launch.json (ultrafast check / sheet / live / export it)
``` 

You can open `launch.json` and change the words in place. A list of edits does the same from a script, and keeps the change readable:

```
[
  { "edit": "set_param", "node": "title", "param": "kicker",   "value": "NOW IN BETA" },
  { "edit": "set_param", "node": "title", "param": "title",    "value": "Tidewell" },
  { "edit": "set_param", "node": "title", "param": "subtitle", "value": "Notes that file themselves." },
  { "edit": "set_param", "node": "stat",  "param": "value",    "value": 4 },
  { "edit": "set_param", "node": "stat",  "param": "suffix",   "value": " apps" },
  { "edit": "set_param", "node": "stat",  "param": "label",    "value": "REPLACED BY ONE" },
  { "edit": "set_param", "node": "quote", "param": "quote",    "value": "I stopped losing things the first week I used it, and I haven't opened a folder since." },
  { "edit": "set_param", "node": "quote", "param": "author",   "value": "Priya, product designer" },
  { "edit": "set_param", "node": "end",   "param": "title",    "value": "tidewell" },
  { "edit": "set_param", "node": "end",   "param": "tagline",  "value": "write first, sort later" },
  { "edit": "set_param", "node": "end",   "param": "cta",      "value": "Join the beta" }
]
``` 

```
$ uf edit launch.json edits.json --out launch.json
Params
$ uf review launch.json
{
  "issues": [
    {
      "severity": "warning",
      "kind": "too_brief",
      "node": "quote/quote2",
      "from": 8.6,
      "to": 10.3,
      "message": "\"I stopped losing things the first week I…\" is readable for 1.7 s; 17 word(s) need about 4.0 s"
    }
  ],
  "frames": 390,
  "texts": 11,
  "seconds": 1.5153431
}
``` 

`Params` means the edit only changed values, so nothing in the render plan has to be rebuilt. The review caught the quote: 17 words won't read in 1.7 s. Either cut it down or give it room by moving `cut3`'s `at`, the end card's `timing.offset` and the `format`'s `duration` later. Cutting is quicker. `shorter.json` sets the quote to "I haven't opened a folder since."

```
$ uf edit launch.json shorter.json --out launch.json
Params
$ uf review launch.json            # "issues": []
$ uf export launch.json launch.mp4
exported 390 frames (1080x1920 @ 30 fps, mp4 h264, standard) in 0.41 s = 953 fps, 0 readbacks -> launch.mp4
``` 

[Video: The promo template with new words over dark purple marble: NOW IN BETA, Tidewell, Notes that file themselves; 4 apps, REPLACED BY ONE; a quote, I haven't opened a folder since, from Priya, product designer; an end card reading tidewell, write first, sort later, with a pink Join the beta button](https://ultrafast.mov/media/guides/template-promo-tidewell.mp4) Tidewell, from the promo template and eleven edits, exported in 0.41 s.

Both files are here: [tidewell-edits.json](<https://ultrafast.mov/templates/tidewell-edits.json>) and the finished [tidewell.json](<https://ultrafast.mov/templates/tidewell.json>). To look at frames before you export, `uf sheet launch.json` writes a labelled contact sheet.

## Another shape

The promo and the explainer are made of blocks, and blocks lay themselves out for the frame they're in. Change only the `format`'s `width` and `height`, and the same document becomes a 16:9 or a square video:

```
"format": {
  "width": 1920, "height": 1080, "fps": 30, "duration": 13,
  "motion_blur": { "samples": 4, "shutter": 0.5 }
}
``` 

![The same moment of the Tidewell promo in three frames side by side: a tall 9:16, a square and a wide 16:9, each with 4 apps, REPLACED BY ONE and a teal rule, sized and placed to fit its own frame.](https://ultrafast.mov/img/guides/template-promo-shapes.webp) The Tidewell document as a tall, a square and a wide video, with only the frame size changed. `uf review` finds nothing in any of them.

The other four place their type at pixel positions, so they stay at the size they were made for. To change their shape, move the nodes yourself, or start from `promo` or `explainer`. Any template exports larger without changes: `uf export film.json film.mp4 --size 4k` draws every frame sharp at the new size.

## With an agent

With ultrafast's skill or MCP server installed, an agent can start from a template too. The MCP tool `ultrafast_new` takes the same six names. A prompt that gets a good result names the template, the words, and the check to run:

```
Start from the promo template and make a 13-second vertical launch video for Tidewell,
a notes app in beta: "Notes that file themselves", 4 apps replaced by one, a short quote
from a beta user, and an end card with a "Join the beta" button. Run uf review and fix
anything it reports, then export launch.mp4.
``` 

Setup for Claude Code, Codex, Cursor and Gemini CLI is on the [Integrations](<https://ultrafast.mov/integrations/>) page, and a recorded session from prompt to MP4 is in [Make a video with Claude Code](<https://ultrafast.mov/guides/claude-code/>).

## One video per row

Any template can be filled from a spreadsheet. A column named `node.param`, such as `title.title` or `stat.value`, sets that param in each row's copy, and `uf batch` checks every row before it renders any of them:

```
uf batch launch.json --data rows.csv --out 'out/{name}.mp4'
``` 

[Personalized videos from a CSV](<https://ultrafast.mov/guides/personalized-videos-from-csv/>) walks through it with the vertical template: 100 thank-you videos from one sheet, exported in 18.0 s.

## Templates elsewhere

  * **Remotion** lists 20 free templates and 3 paid ones. They're React projects you start with a command such as `npx create-video@latest --tiktok`: a blank canvas and Hello World, app and server starters (Next.js, React Router, Express, Electron), and visual ones such as TikTok captions, an audiogram and Code Hike code animations. Use them when you want a codebase to build on; ultrafast's are finished-looking films to change, one JSON file each.
  * **ultrafast's examples:** the [example films](<https://ultrafast.mov/examples/>) are longer and more ambitious, and each document can be downloaded. Most read footage or images you'd download first, so they aren't templates in the `uf new` sense.
  * **After Effects templates** need After Effects to render. The [After Effects alternative](<https://ultrafast.mov/alternatives/after-effects/>) page covers what carries over through Lottie and what doesn't.

## Questions

Can I use these templates in commercial videos?

Yes. They ship inside ultrafast, which is open source under Apache-2.0 or MIT, so you can change them and use what you render in paid work. The fonts they use ship with ultrafast too (Geist, Geist Mono, Instrument Serif, Fraunces and Unbounded), under the SIL Open Font License.

Can I make my own template?

Any ultrafast document is a template. Nothing marks a field as a variable: save a document you like, then set any node's param per copy with `uf edit`, from a script, or per row of a CSV with `uf batch`.

Do I need a GPU to render them?

A Mac with Apple silicon, or Linux with a Vulkan GPU; Windows through WSL2. Without one, the Docker image renders on the CPU through Mesa's software Vulkan driver, more slowly: about 17 s for a 6-second 1080×1920 export on 4 desktop cores.

How do I make a template longer?

Raise `format.duration`, then move the parts: each block has a `duration` and a `timing.offset`, and each transition an `at` time. `uf review` tells you when a line ends up on screen too briefly to read.

How are these different from Remotion templates?

Remotion's templates are React projects you start with `npx create-video`, and most are starters for apps and render servers. These are finished-looking films, one JSON file each, rendered by the engine without a browser. [ultrafast vs Remotion](<https://ultrafast.mov/compare/remotion/>) covers the rest.

## Sources

All read or run on 24 November 2026.

  * **ultrafast:** the templates as the published 0.2.1 binary writes them (`uf new`), and their source in [crates/ultrafast-ops/templates](<https://github.com/ultrafastmov/ultrafast/tree/main/crates/ultrafast-ops/templates>).
  * **Remotion:** [Starter templates](<https://www.remotion.dev/templates>) and the [TikTok template](<https://www.remotion.dev/templates/tiktok>) page.
