# ultrafast · Shot on the GPU · Open-source video engine for agents

> Shot on the GPU. Shaders, 3D, motion type and camera optics, written by your agent and rendered on the GPU. An open-source video engine for coding agents.

URL: https://ultrafast.mov/

Open source · Apache-2.0 or MIT

# ultrafast: video shot on the GPU

Shaders, 3D, motion type and real camera optics, written by your agent and rendered at GPU speed.

`curl -fsSL https://ultrafast.mov/install.sh | sh` [Read the quickstart](<https://ultrafast.mov/docs/>)

macOS (Apple silicon) and Linux. [Other ways to install](<https://ultrafast.mov/docs/#install>)

Or tell your agent `“Go to ultrafast.mov and make…”`

clay.json · excerpt

```
{
  "format": { "width": 1080,
    "height": 1920, "fps": 30 },
  "nodes": {
    "vessel": {
      "op": "shader",
      "params": {
        "code": "// a lathe, its profile keyed…",
        "u4": { "keys": [ … ] } } },
    "title": {
      "op": "text",
      "params": {
        "text": "Spin something new.",
        "font": "ultrafast:display",
        "size": 176 } },
    …
  },
  "output": "grain"
}
``` 

[Video: Spin something new: a 10-second pottery class teaser](https://ultrafast.mov/media/examples/clay.mp4) 

**1.68 s** to export these 10 seconds at 1080×1920.

Rust · Vulkan on Linux and WSL2 · Metal on macOS · 70 ops · 20 MCP tools · a live player

Use cases

## Made by asking.

What agents made with it, and each brief in a sentence.

[All use cases](<https://ultrafast.mov/use-cases/>)

[Video: Lens launch](https://ultrafast.mov/media/examples/product.mp4) 3D rendered by ultrafast

### [Launch films](<https://ultrafast.mov/use-cases/#launches>)

A launch film for our 35 mm lens: the knurling, the iris, an exploded view, then the price.

16:9 · 1920×1080 · 16 s · exported in 4.88 s · `review`: 0 findings · [document](<https://ultrafast.mov/examples/product.json>)

[Video: Year in review](https://ultrafast.mov/media/examples/wrapped.mp4)

### [One video per customer](<https://ultrafast.mov/use-cases/#at-scale>)

Make every member their year in review from this spreadsheet.

9:16 · 1080×1920 · 12 s · exported in 1.37 s · `review`: 0 findings · [document](<https://ultrafast.mov/examples/wrapped.json>)

[[Video: Year in review: Tomás](https://ultrafast.mov/media/examples/wrapped-tomas.mp4)Tomás](<https://ultrafast.mov/examples/wrapped-tomas.json>)[[Video: Year in review: Oluwaseun](https://ultrafast.mov/media/examples/wrapped-oluwaseun.mp4)Oluwaseun](<https://ultrafast.mov/examples/wrapped-oluwaseun.json>)[[Video: Year in review: Bea](https://ultrafast.mov/media/examples/wrapped-bea.mp4)Bea](<https://ultrafast.mov/examples/wrapped-bea.json>)

[Video: The Keeling Curve](https://ultrafast.mov/media/examples/keeling.mp4)

### [Data stories](<https://ultrafast.mov/use-cases/#data>)

Turn NOAA's Mauna Loa CO₂ file into a chart for Instagram.

4:5 · 1080×1350 · 16 s · exported in 1.50 s · `review`: 0 findings · [document](<https://ultrafast.mov/examples/keeling.json>)

[Video: Celadon dish](https://ultrafast.mov/media/examples/bloom.mp4)

### [Loops and visuals](<https://ultrafast.mov/use-cases/#loops>)

A 15-second loop for the album cover: something growing, in celadon.

1:1 · 1080×1080 · 15 s · exported in 1.06 s · `review`: 0 findings · [document](<https://ultrafast.mov/examples/bloom.json>)

[Video: Two launches, one count](https://ultrafast.mov/media/examples/liftoff.mp4)

### [Documentaries and recaps](<https://ultrafast.mov/use-cases/#documentary>)

Cut the Apollo 11 and Artemis I launches together on the 1969 countdown. Make it feel like a documentary.

2.39:1 · 1920×804 · 22.5 s · exported in 3.36 s · `review`: 0 findings · [document](<https://ultrafast.mov/examples/liftoff.json>)

[Video: Podcast clip](https://ultrafast.mov/media/examples/podcast.mp4)

### [Podcast and interview clips](<https://ultrafast.mov/use-cases/#podcasts>)

Pull the best 25 seconds from this episode. Captions on, vertical, our colours.

9:16 · 1080×1920 · 27.5 s · exported in 4.07 s · `review`: 0 findings · [document](<https://ultrafast.mov/examples/podcast.json>)

How it works

## A frame is a stack of plates.

Each plate is a node in one JSON document. Point at a line to find its plate; click to pull it.

clay.json · 1080×1920 · 30 fps · 10 s

3D and 2D

## 3D, 2D, or both.

One engine renders 3D models, type, vector shapes, charts and footage, and composites them in the same frame. No Blender, no After Effects, no plugins: all of it is in the document.

[All the films](<https://ultrafast.mov/examples/>)

  * ![The HOLM 35 lens from the launch film, rendered in 3D by ultrafast](https://ultrafast.mov/img/lens_front.webp)3D
  * ![The same lens rendered again with the camera turned 84 degrees](https://ultrafast.mov/img/lens_side.webp)3D, camera turned 84°
  * ![The concert poster: Swiss-style type and vector shapes](https://ultrafast.mov/img/mix_poster.webp)2D: type and shapes
  * ![The pottery class teaser: a 3D pot on its wheel under the title and details](https://ultrafast.mov/img/mix_clay.webp)both: a 3D pot under set type

The lens and the pot are geometry and materials in their documents, lit and rendered by ultrafast, not made in a 3D app. Turning the camera is one more render of the same node: about 0.3 s.

Speed

## 894 frames a second

1920×1080 · 6-sample motion blur · one RTX 5090

press log

1080p, 6-sample blur
    894 fps
launch film, 16 s
    4.88 s
simulation, 15 s
    1.06 s
class teaser, 10 s
    1.68 s

no browser in the loop

[Video: HOLM 35 f/1.4, a launch film for a camera lens](https://ultrafast.mov/media/examples/product.mp4) 

**4.88 s** to export this 16-second launch film: 480 frames at 1920×1080.

Review

## First draft: eight findings. Second: none.

`uf review` read all 300 frames in 4.7 s.

![Contact sheet of the first draft from uf sheet, frames at 0.55, 2.6, 4.5 and 7.5 seconds. Frame one is a white flash, the title runs off the right edge, the studio name is too dark to read and the details are tiny.](https://ultrafast.mov/img/proof_draft.webp)

  1. **flashing** more than 3 flashes per second: a photosensitive seizure risk (WCAG 2.3.1)
  2. **clipped** "Pottery class" runs off the frame (right by 40 px)
  3. **low contrast ×2** "HALDEN CLAY STUDIO" never reaches readable contrast (best 1.6:1, want 3:1 or more); "118 TANNER STREET" 1.6:1
  4. **too brief** "First class free" is readable for 0.4 s; 3 words need about 0.9 s
  5. **small text ×3** set at 20 px; below about 24 px it is hard to read on a phone

![Contact sheet of the second draft at the same moments: no flash, the title fits, the studio name and the details read.](https://ultrafast.mov/img/proof_approved.webp) 0 findings

  1. `new`: starts from a template
  2. `check`: finds problems without rendering
  3. `review`: reads every frame
  4. `export`: the teaser in 1.68 s

Edits

## Edit it by asking.

Your agent edits the document, not the pixels. One sentence changed one node: the pot's shape, its camera and its shader. The type, light and timing stayed as they were.

This works today in Claude Code, Codex, Cursor and Gemini CLI with `uf mcp`.

Coming soon The ChatGPT app and the Claude connector, for making videos in a chat. [Join the waitlist](<https://ultrafast.mov/cloud/#apps>)

A 10-second vertical teaser for my pottery class. Saturdays, first class free.

[Video: The teaser, first version: a vase thrown on the wheel](https://ultrafast.mov/media/examples/clay.mp4)

agentclay.json · 10 s · 1080×1920 · `review` 0 findings

Make it a wide bowl instead of a vase.

[Video: The teaser after the edit: a wide bowl](https://ultrafast.mov/media/examples/clay-bowl.mp4)

agentedited 1 node, `vessel`. The type, light and timing are untouched.

Compare

## No browser in the loop.

Remotion and HyperFrames draw each frame in headless Chrome and capture it. ultrafast draws it on the GPU, and your agent writes a quarter to a third fewer tokens than for Remotion.

[Full comparison](<https://ultrafast.mov/compare/>)

| ultrafast| Remotion| HyperFrames  
---|---|---|---  
Draws each frame with| GPU kernels, Metal or Vulkan| headless Chrome, a screenshot per frame| headless Chrome, captured frame by frame  
You write| one JSON document| a React project| HTML, CSS and JavaScript  
Output tokens for a 10 s short| about 1,234| about 1,868| about 1,680  
Export, same machine ([benchmark](<https://github.com/ultrafastmov/benchmarks>))| 0.98 s for 10 s of captioned NASA footage, 1080×1920, end to end| 6.69 s at its fastest setting found; 8.53 s with its default command| 4.46 s at its fastest setting found; 5.05 s with its default command  
Agents review their frames| `check`, `review`, `inspect`, frames and contact sheets| no built-in review| no built-in review  
Licence| Apache-2.0 or MIT| free up to 3 people; companies pay per render or per seat| Apache-2.0  
Hosted rendering| ultrafast Cloud, coming soon ([waitlist](<https://ultrafast.mov/cloud/>)); `uf serve` on your GPU today| none: Lambda in your AWS account| HeyGen credits, or your own Lambda or Cloud Run  
  
Remotion and HyperFrames figures are from their own docs, November 2026. [Sources](<https://ultrafast.mov/compare/#sources>).

Integrations

## Wherever your agent runs.

[All integrations](<https://ultrafast.mov/integrations/>)

  * [**MCP server**`uf mcp`local · 20 tools _Available_](<https://ultrafast.mov/docs/mcp/>)
  * [**Coding agents** Claude Code, Codex, Cursor, Gemini CLI _Available_](<https://ultrafast.mov/integrations/#coding-agents>)
  * [**Skill and plugin**`npx skills add``ultrafastmov/ultrafast` _Available_](<https://ultrafast.mov/integrations/#coding-agents>)
  * [**Remote MCP**`uf serve`/mcp on your server, one key _Available_](<https://ultrafast.mov/integrations/#remote-mcp>)
  * [**SDKs**`pip install ultrafastmov``npm i ultrafastmov` _Available_](<https://ultrafast.mov/integrations/#sdks>)
  * [**Framework starters** Vercel AI SDK, OpenAI Agents SDK, LangGraph, Mastra _Available_](<https://ultrafast.mov/integrations/#frameworks>)
  * [**Self-host**`docker run …`the HTTP API on one GPU _Available_](<https://ultrafast.mov/integrations/#self-host>)
  * [**ChatGPT app** make and edit videos in a chat _Coming soon_](<https://ultrafast.mov/cloud/#apps>)
  * [**Claude connector** for Claude on the web, desktop and phone _Coming soon_](<https://ultrafast.mov/cloud/#apps>)
  * [**ultrafast Cloud** hosted GPUs, one API key _Waitlist_](<https://ultrafast.mov/cloud/>)

Two ways to run it

## Your GPU today. ultrafast Cloud soon.

[About ultrafast Cloud](<https://ultrafast.mov/cloud/>)

docket Aopen source · available

### Yours

licence
    Apache-2.0 or MIT
runs on
    Metal on macOS (Apple silicon) · Vulkan on Linux and Windows (WSL2)
in the box
    70 ops · 20 MCP tools · the live player · the render service
costs
    nothing, at any scale

`curl -fsSL https://ultrafast.mov/install.sh | sh`

docket Bultrafast Cloud · coming soon

### Cloud

you bring
    one API key. No GPU, drivers or ffmpeg
you get
    the same engine and HTTP API, on hosted GPUs
with it
    the ChatGPT app, the Claude connector and remote MCP with sign-in
price
    set before it opens

waitlist Email for the ultrafast Cloud waitlist Join the waitlist

Questions

## Common questions.

What is ultrafast?

An open-source video engine built for AI agents. A video is a JSON document of nodes (footage, type, shapes, 3D, effects); ultrafast checks it, shows the agent its frames and renders it on the GPU at hundreds of frames a second.

Do I need a GPU?

Yes, for now: a Mac with Apple silicon, or a computer with a Vulkan GPU on Linux or Windows (through WSL2). ultrafast Cloud, which renders on hosted GPUs, is coming soon: [join the waitlist](<https://ultrafast.mov/cloud/>).

Can it edit my own footage?

Yes. Cut, trim, speed-ramp, reframe, grade, key and caption video files, mix in music and voiceover, and add titles, logos and charts. The [footage examples](<https://ultrafast.mov/examples/#footage>) cut, caption and grade NASA film and sound.

Is the 3D in the examples rendered by ultrafast?

Yes. The pot, the lens, the compass, the chrome ring, the Earth and the Moon are geometry and materials written in each film's document. ultrafast lights and renders them on the GPU every frame, in the same pass as the type. Nothing was filmed, and nothing was made in a 3D app.

Which sizes and formats can it make?

Any size and frame rate: 9:16, 1:1, 4:5, 16:9, 21:9 or your own, up to 4K. Exports are MP4 or MOV in H.264 or HEVC, with sound.

How is it different from Remotion or HyperFrames?

They draw each frame in headless Chrome and screenshot it. ultrafast draws on the GPU with no browser. On one RTX 5090 workstation, three 10-second videos exported in 0.85 to 0.98 s; at their fastest settings, Remotion took 2.6 to 6.8 times as long and HyperFrames 3.8 to 4.5 times ([benchmark](<https://github.com/ultrafastmov/benchmarks>)). It also gives agents tools to check and review their videos. See the [comparison](<https://ultrafast.mov/compare/>).

Does an agent use fewer tokens with ultrafast?

Yes: a quarter to a third fewer than with Remotion, and a fifth to a quarter fewer than with HyperFrames. Measured on the same 10-second short (tiktoken o200k_base): 1,234 tokens across the files the agent writes in ultrafast, 1,868 for Remotion and 1,680 for HyperFrames; counting only what is typed after each tool's scaffold, 1,218, 1,660 and 1,500. See [tokens](<https://ultrafast.mov/compare/#tokens>).

What does it cost?

Nothing. The engine is free under Apache-2.0 or MIT, for commercial use, at any scale.

Is there a hosted version?

Not yet. ultrafast Cloud will run the same engine on hosted GPUs with one API key, and the ChatGPT app and the Claude connector will run on it. [Join the waitlist](<https://ultrafast.mov/cloud/>) for one email when it opens.

## curl -fsSL https://ultrafast.mov/install.sh | sh

`curl -fsSL https://ultrafast.mov/install.sh | sh` [Read the quickstart](<https://ultrafast.mov/docs/>)

Want it hosted? [Join the ultrafast Cloud waitlist](<https://ultrafast.mov/cloud/>).
