# Open-source alternative to Shotstack, JSON2Video and Creatomate · ultrafast

> Render JSON to video on your own GPU instead of a per-minute API: ultrafast compared with Shotstack, JSON2Video and Creatomate on price, formats, 3D, self-hosting and agent tools.

URL: https://ultrafast.mov/alternatives/json-to-video-api/

# JSON to video, on your own GPU.

Shotstack, JSON2Video and Creatomate render your JSON in their cloud and charge by the minute. ultrafast is an open-source engine that renders it on your own GPU. Here is what each one does better, from their own docs.

Updated 23 November 2026. ultrafast wrote this page. Every vendor figure is from that vendor's own pages; sources are at the end. Prices marked “about” are worked out from the vendor's published credit rules.

## Four ways to render a JSON video.

The three APIs are hosted services. ultrafast is a binary, a Docker image and an HTTP server you run yourself.

| ultrafast| Shotstack| JSON2Video| Creatomate  
---|---|---|---|---  
Where it renders| your GPU: a Mac with Apple silicon, or Linux with a Vulkan GPU; much more slowly on the CPU in Docker| Shotstack's cloud; the Studio SDK can also export in the browser| JSON2Video's cloud| Creatomate's cloud  
Self-hosted| `uf serve`: an HTTP API and a remote MCP server on one machine| not offered| not offered| not offered  
Licence| Apache-2.0 or MIT, engine included| proprietary service; Studio SDK under PolyForm Shield (source-available); CLI Apache-2.0| proprietary service; CLI and SDKs MIT| proprietary service; Preview SDK and libraries MIT  
Price per rendered minute| no fee; your GPU's time| 5¢ to 20¢, by plan; 4K from the $99 Pro plan| one credit per second: about 17¢ to 42¢| credits by pixels × frames: about 84¢ for 1080p at 30 fps on Essential, billed yearly  
Free to start| free for any use, commercial included| 10 credits on sign-up, valid 30 days; watermarked sandbox| 600 credits once; watermarked, up to 60 s, no commercial use| 50 credits; renders are previews of up to 480 px  
The JSON| a graph of nodes with animated params and timing windows, checked against a [published schema](<https://ultrafast.mov/schema/v1.json>)| an Edit: a timeline of tracks and clips, 16 asset types, merge fields| a Movie: scenes played back to back, 9 element types, variables| RenderScript: 6 element types, keyframes, nested compositions  
3D and shaders| 3D (glTF, extruded type, image-based light, glass), Slang shaders, particles, fluid| not documented| not documented| 3D-style transforms only  
Lottie| as editable vector nodes ([guide](<https://ultrafast.mov/guides/lottie-to-mp4/>))| inside the `html5` asset, captured from a browser page, which Shotstack calls “the heaviest to render”| not documented| not documented  
Output| H.264, HEVC and AV1 MP4; ProRes up to 4444 XQ; transparent ProRes and WebM; GIF; PNG and EXR sequences; sound alone| mp4, gif, mp3, jpg, png, bmp| MP4, and an MP3 audio track on paid plans| mp4, jpg, png, gif  
Frame rate| any| 12 to 60 fps| “Currently every movie renders at 25 fps”| at most 60 fps  
Largest size| any size; presets up to 4K on the short side| 3840 px a side| 3840 px a side, by plan| 3840 px a side  
For agents| 20 MCP tools locally, 16 over HTTP; `check` before rendering, `review` of every frame after| hosted MCP with OAuth; a CLI and skill that validate edits offline| hosted and local MCP, 15 tools including `validate_movie`| hosted MCP with OAuth  
Output tokens for a 10 s short| about 1,234, measured| about 1,657, measured (validated, not rendered)| not measured| not measured  
No-code| none; call the HTTP API| not checked for this page| Make, n8n, Zapier| Zapier, Make, n8n and about 30 more  
Templates and editors| five starter documents (`uf new`); no visual editor| Studio editor and a templates API| visual editor and “dozens” of templates| template editor; embeddable Preview SDK  
Voices and transcripts| captions from Whisper, SRT or VTT you bring; voiceover with macOS voices or eSpeak NG| transcription in 99 languages; text to speech| ElevenLabs and Azure voices; automatic subtitles| automatic subtitles  
  
Shotstack, JSON2Video and Creatomate are trademarks of their owners. Token counts are from the [benchmark repository](<https://github.com/ultrafastmov/benchmarks>) (tiktoken o200k_base, the same 10-second short written for each tool). None of the three hosted services can be timed on the same machine as ultrafast, so this page compares no render speeds.

## Which one to choose.

A hosted API is the right call for many teams. Here is where each side wins.

### Choose a hosted API when

  * You have no GPU and don't want to run a server. All three take a request and send back a link.
  * You need many renders at once, webhooks or delivery to your own storage. `uf serve` renders one job at a time on one GPU.
  * Your workflow lives in Zapier, Make or n8n, or non-developers edit templates in a visual editor.
  * You want transcription, stock voices or generated media inside the same API.
  * You want a Claude or ChatGPT connector with OAuth today. ultrafast's comes with [ultrafast Cloud](<https://ultrafast.mov/cloud/>), which has a waitlist.

### Choose ultrafast when

  * You render a lot and the per-minute bill matters, or the footage can't leave your machine. Inputs are local files.
  * You need ProRes, HEVC, AV1, transparent video or a frame rate other than 25, 30 or 60.
  * The video needs 3D, shaders, particles or real motion blur, not only clips, text and transitions.
  * An agent writes the JSON and should check it before rendering and review every frame after.
  * You want the engine's source under a licence that lets you ship it.

## Run the API yourself.

One container on a machine with an NVIDIA GPU. It prints its API key on first start.

```
docker run --gpus all -p 8080:8080 -v ultrafast:/data \
  ghcr.io/ultrafastmov/ultrafast:latest serve

curl http://localhost:8080/v1/render \
  -H "Authorization: Bearer $ULTRAFAST_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"document": '"$(cat video.json)"', "output": {"codec": "h264", "size": "1080p"}}' \
  -o video.mp4
``` 

The same server answers MCP at `/mcp`, and has endpoints to check a document, render a single frame or a contact sheet, review every frame, and upload footage. Short renders come back in the response; longer ones go to its storage with a signed link. On a laptop or desktop, skip the server: `uf export video.json` writes the file directly.

Full reference: [HTTP API](<https://ultrafast.mov/docs/api/>) and [SELF_HOST.md](<https://github.com/ultrafastmov/ultrafast/blob/main/docs/service/SELF_HOST.md>). Limits of the open-source server: one API key, one render at a time with up to 16 waiting, renders stop after 10 minutes, files on local disk.

## Moving an edit over.

The formats differ: a Shotstack Edit is a timeline of tracks and clips; an ultrafast document is a graph of nodes, each with a timing window. Nothing imports either one directly.

### Ask your coding agent

Give it the JSON you send today and ask for the same video as an ultrafast document. With the ultrafast skill installed it knows the format, runs `uf check` until the document is valid, and looks at a contact sheet before it exports.

### Batch renders from data

Merge fields and template variables become a CSV or JSON file of rows: `uf batch` renders one video per row, changing the fields each row names.

```
npx skills add ultrafastmov/ultrafast            # the skill, for your coding agent
uf check video.json && uf sheet video.json --out sheet.png
uf batch video.json --data rows.csv              # one video per row
``` 

## Common questions.

Is there an open-source alternative to Shotstack or JSON2Video?

Yes. ultrafast is an open-source (Apache-2.0 or MIT) engine that renders a JSON document to video on your own GPU, from the command line, over MCP or through a self-hosted HTTP API. Its JSON format is its own, so an existing Shotstack Edit or JSON2Video Movie is rewritten rather than imported; a coding agent with the ultrafast skill can do that.

Can I self-host a JSON-to-video API?

With ultrafast, yes: `docker run --gpus all ghcr.io/ultrafastmov/ultrafast serve` starts an HTTP API and a remote MCP server on one machine with one API key. It renders one job at a time on its GPU. Shotstack, JSON2Video and Creatomate don't offer a self-hosted renderer.

How much does it cost?

The engine is free, including for commercial use; the cost is your own GPU's time. For comparison, Shotstack lists 5¢ to 20¢ per rendered minute by plan, JSON2Video's one credit per second works out to about 17¢ to 42¢ a minute, and Creatomate's pixel-based credits come to about 84¢ a minute of 1080p at 30 fps on its Essential plan billed yearly.

Does ultrafast have a hosted API like Shotstack?

Not yet. Hosted rendering with OAuth connectors for Claude and ChatGPT comes with [ultrafast Cloud](<https://ultrafast.mov/cloud/>), which has a waitlist. Until then you run it yourself, on a Mac with Apple silicon, Linux with a Vulkan GPU, or the Docker image.

Does it work with n8n, Zapier or Make?

There is no ready-made node or app. Any of them can call the HTTP API of `uf serve` with an HTTP request step: POST the document to `/v1/render` with the API key as a bearer token.

## Sources.

All read on 23 November 2026.

  * **Shotstack:** [pricing](<https://shotstack.io/pricing/>) (plans, per-minute rates, 4K from Pro, free credits), [API reference](<https://shotstack.io/docs/api/>) (Edit format, asset types, output formats and frame rates), [limitations](<https://shotstack.io/docs/guide/architecting-an-application/limitations/>) (3840 px, sandbox watermark), [html5 asset](<https://shotstack.io/docs/guide/architecting-an-application/html5.md>), [MCP server](<https://shotstack.io/docs/guide/agents/mcp-server/>), [CLI](<https://shotstack.io/docs/guide/agents/cli/>), [Studio SDK](<https://github.com/shotstack/shotstack-studio-sdk>) (licence, browser export).
  * **JSON2Video:** [home](<https://json2video.com/>) (cloud rendering, templates, voices), [pricing](<https://json2video.com/pricing/>), [credit consumption](<https://json2video.com/docs/v2/reference/credits/credit-consumption>) (one credit per second), [plans](<https://json2video.com/docs/v2/reference/credits/plans>) (free plan terms), [JSON syntax](<https://json2video.com/docs/v2/reference/json-syntax>), [movie](<https://json2video.com/docs/v2/reference/json-syntax/movie>) (25 fps, sizes), [MCP server](<https://json2video.com/docs/v2/help-for-ai-agents/mcp-server>), [integrations](<https://json2video.com/docs/>).
  * **Creatomate:** [pricing](<https://creatomate.com/pricing>), [how credits are calculated](<https://creatomate.com/docs/account/how-are-credits-calculated>) (1 credit per 100 million pixels), [RenderScript elements](<https://creatomate.com/docs/api/render-script/element-properties>), [output properties](<https://creatomate.com/docs/api/render-script/top-level-properties>), [limits](<https://creatomate.com/docs/api/reference/limits-and-concurrency>), [MCP](<https://creatomate.com/docs/fundamentals/getting-started/mcp-integration>), [Preview SDK](<https://github.com/Creatomate/creatomate-preview>) (cloud processing).
  * **Worked-out prices:** JSON2Video at one credit per second is 60 credits a minute: Professional billed yearly ($33.30 for 200 minutes) is about 17¢ a minute, Pre-paid A ($49.95 for 120 minutes) about 42¢. Creatomate: 1920 × 1080 × 30 fps × 60 s is 3.73 billion pixels, 37.3 credits a minute; Essential billed yearly ($540 for 24,000 credits) makes that about 84¢.
  * **ultrafast:** [repository](<https://github.com/ultrafastmov/ultrafast>), [HTTP API](<https://ultrafast.mov/docs/api/>), [self-hosting](<https://github.com/ultrafastmov/ultrafast/blob/main/docs/service/SELF_HOST.md>), [MCP server](<https://ultrafast.mov/docs/mcp/>), [ops](<https://ultrafast.mov/docs/ops/>), [benchmark and token counts](<https://github.com/ultrafastmov/benchmarks>).

## Render one yourself.

Install the engine and export a video on your own GPU.

`curl -fsSL https://ultrafast.mov/install.sh | sh` [Read the quickstart](<https://ultrafast.mov/docs/>)

Want it hosted? [Join the ultrafast Cloud waitlist](<https://ultrafast.mov/cloud/>).
