# HyperFrames alternatives, compared · ultrafast

> Alternatives to HyperFrames for video from code: Remotion, Revideo, Motion Canvas, Framefields, VideoFlow, Editly, Manim and ultrafast, which renders on the GPU with no browser.

URL: https://ultrafast.mov/alternatives/hyperframes/

# HyperFrames alternatives.

HyperFrames turns HTML into video in headless Chrome. Eight tools that make video from code another way, and when each one fits better.

Updated 23 November 2026. ultrafast wrote this page and is one of the eight. Every figure is from each project's own repository and docs; sources are at the end.

## Why people look elsewhere.

HyperFrames is open source (Apache-2.0) and moves fast: 88,793 stars and a release on 23 November 2026. The reasons to look elsewhere are about the renderer, in HyperFrames' own words.

### A browser draws every frame

“Rendering never plays your video. It asks for one frame at a time.” Each frame is seeked, then “Chrome's `HeadlessExperimental.beginFrame` grabs the pixels,” and “FFmpeg turns the captured frames into the MP4.” Parallel renders use 1 to 24 workers: “Each is a separate Chrome, roughly 256 MB.”

[Deterministic rendering](<https://hyperframes.heygen.com/concepts/determinism>) · [CLI](<https://hyperframes.heygen.com/packages/cli>)

### Render time is page work

Its performance guide times one composition built two ways: “25.0s against 9.8s, taken as the median of three runs at 1920x1080 over 300 frames. One CSS declaration is the whole difference.” Its advice is to “use fewer large `backdrop-filter` and `filter: blur()` layers.”

[Fix a slow preview or render](<https://hyperframes.heygen.com/guides/performance>)

### Pixels can move between machines

“Fonts and Chrome versions differ between computers, so a local render can shift by a pixel from one machine to the next. Render in Docker when you need exact reproducibility.”

[Deterministic rendering](<https://hyperframes.heygen.com/concepts/determinism>)

None of this makes HyperFrames a poor choice. A web page is a good way to lay out type, and the browser's cost is the price of using it. The tools below either draw with something other than a browser, or ask you to describe the video another way.

## Eight alternatives, side by side.

In alphabetical order, with HyperFrames first for reference. Stars, licences and dates from the GitHub API, checked 23 November 2026.

Project| Licence| You write| How it renders| Agent tooling| GPU| Latest release · last commit| Stars  
---|---|---|---|---|---|---|---  
[HyperFrames](<https://github.com/heygen-com/hyperframes>) for reference, by HeyGen| Apache-2.0| HTML, CSS and JavaScript with a seekable animation (GSAP or another adapter)| headless Chrome seeks and captures each frame; 1 to 24 workers; FFmpeg encodes| 9 skills; plugins for 6 agents; a hosted MCP server that renders on HeyGen; a Studio app| optional: `--browser-gpu` for capture, `--gpu` for hardware encoding| v0.9.86, 23 Nov 2026 · 23 Nov 2026| 88,793  
[Editly](<https://github.com/mifi/editly>)| MIT| a JSON5 edit spec, or JavaScript| Node.js and FFmpeg, streaming; Canvas and Fabric.js layers; GL transitions| none found| GL shaders through headless-gl; no GPU in its requirements| v0.15.0-rc.1, 19 Jan 2025 (npm: 0.14.2, Dec 2022) · 20 Feb 2025| 5,647  
[Framefields](<https://github.com/gatewai-dev/framefields>)| Apache-2.0| TypeScript| WebGPU in Node through Dawn (Metal, Vulkan, D3D12); no browser; hardware-encoded MP4| 7 skills and a Claude Code plugin; agents inspect frame grids| renders on it; a CPU fallback (lavapipe or WARP) is about 10 to 12 times slower| npm 3.0.2, 13 Nov 2026 · 18 Nov 2026| 530  
[Manim](<https://github.com/ManimCommunity/manim>) Community edition| MIT| Python| Cairo by default, or OpenGL; PyAV (FFmpeg's libraries) writes the video| none found| with the optional OpenGL renderer| v0.22.1, 27 Oct 2026 · 23 Nov 2026| 42,850  
[Motion Canvas](<https://github.com/motion-canvas/motion-canvas>)| MIT| TypeScript, with generators| its editor draws each frame on a canvas in your browser; an image sequence, or video through the FFmpeg exporter| none found| no GPU in its requirements| v3.17.2, 14 Dec 2024 · 2 Jul 2026| 20,163  
[Remotion](<https://github.com/remotion-dev/remotion>)| Remotion License, source-available; a company licence from 4 people| React and TypeScript| Chrome Headless Shell; each tab renders the page and screenshots it; FFmpeg encodes| 13 Agent Skills; plugins for 5 coding agents; its hosted MCP server shut down on 26 October 2026| often off in headless Chrome; none on Lambda| v4.0.546, 23 Nov 2026 · 23 Nov 2026| 75,168  
[Revideo](<https://github.com/midrender/revideo>)| MIT| TypeScript scenes as generator functions| headless Chrome through Puppeteer draws each frame on a canvas; WebCodecs encodes; FFmpeg adds the audio; parallel workers| none found| none required: it runs where Node and a headless browser run| v0.11.0, 10 Jul 2026 · 15 Jul 2026| 4,231  
[ultrafast](<https://github.com/ultrafastmov/ultrafast>)| Apache-2.0 or MIT| one JSON document, checked before it renders| GPU kernels on Metal or Vulkan; H.264 and HEVC encoded on the same GPU; no browser| 20 MCP tools, a skill and a Claude Code plugin; `check`, `review` and `inspect`| renders on it; an Apple silicon Mac or Linux with a Vulkan GPU, or much slower on the CPU in Docker| v0.2.0, 23 Nov 2026 · 23 Nov 2026| 1  
[VideoFlow](<https://github.com/ybouane/VideoFlow>)| Apache-2.0 (its React editor has its own licence)| TypeScript, compiled to a portable JSON format| headless Chromium on a server, or WebCodecs in the browser; WebGL effects| llms.txt and Markdown docs| no GPU in its requirements| 1.3.4, 16 Sep 2026 · 16 Sep 2026| 174  
  
“None found”: no skills, MCP server or agent plugin in the repository or docs. Dates are UTC. A release is the latest GitHub release, or the latest npm version where the project publishes there. The last commit is on the default branch. Product names belong to their owners.

## Which one to choose.

Each tool is the better fit for some jobs. HyperFrames included.

### Stay with HyperFrames when

  * Your team writes HTML, CSS and GSAP, or has compositions in them already.
  * You want HeyGen's avatars and voices, its Studio app, or hosted renders on HeyGen.
  * You need HDR or HLS output today.

### Choose Editly when

  * You are cutting clips, photos, titles and music together from a JSON5 file or the command line.
  * You want an MIT tool that runs on Windows, macOS and Linux with Node and FFmpeg.
  * You don't need recent updates: the last commit was in February 2025.

### Choose Framefields when

  * You want to keep writing TypeScript but render on the GPU with no browser.
  * You need Windows (D3D12), or a CPU fallback for CI.
  * You can work with beta software. Its AI gateway for generated media and its cloud GPU renders are optional and paid.

### Choose Manim when

  * You are animating maths in Python: equations, graphs and geometry.
  * You want a large, long-lived community: 42,850 stars on the Community edition.

### Choose Motion Canvas when

  * You make vector explainers timed to a voice-over, in a real-time editor.
  * You render from the editor, don't need a server or an API, and don't mind that the last release was in December 2024.

### Choose Remotion when

  * Your team builds in React and wants to reuse its components.
  * You need an embeddable web player.
  * The licence fits: 3 people or fewer, or a company licence. It still renders in Chrome.

### Choose Revideo when

  * You want generator-based TypeScript scenes rendered from code or an endpoint, with a React player for previews.
  * You want to split renders across workers on serverless machines. It also renders in headless Chrome.

### Choose VideoFlow when

  * You want one JSON format to render on a server, in the browser, or as live playback with scrubbing.
  * You build a web app around video. Its core and renderers are Apache-2.0; its React Video Editor needs a company licence beyond 3 employees.

### Choose ultrafast when

  * You want no browser in the render: the frame is drawn and encoded on the GPU.
  * An agent writes the video and should check and review its own frames before you watch.
  * You want 3D, particles, fluid and shaders in the same video as the type and the footage, without a page doing the work.
  * You need the same pixels on every machine without pinning a browser.

## Shot on the GPU.

Shaders, 3D, motion type and camera optics, written by your agent and rendered on the GPU. Open source, Apache-2.0 or MIT.

Measured on one RTX 5090 workstation, end to end: three 10-second videos (a title card, an animated chart and captioned NASA footage) exported in 0.66 to 0.78 s with ultrafast. At the fastest setting found for each, HyperFrames took 4.6 to 5.7 times as long, and Remotion 3.1 to 8.6 times. No other tool on this page was measured. [Method and results](<https://ultrafast.mov/benchmarks/>).

### Agents see their frames

`check` finds mistakes before rendering. Frames and contact sheets come back as images. `review` reads every frame for unreadable, clipped, overlapping or too-brief text and flashing. `inspect` names the node behind a pixel.

### Built for agents

20 MCP tools over stdio with `uf mcp`, or 16 over HTTP from your own `uf serve`. A skill, and a Claude Code plugin with both. See the [video MCP server](<https://ultrafast.mov/mcp/>).

### Where ultrafast doesn't fit

  * No HTML or CSS. A video is a JSON document, not a web page.
  * No embeddable web player. The live player is a desktop window; for the web, export an MP4.
  * It is built for a GPU: a Mac with Apple silicon, or Linux with a Vulkan GPU. Without one, the Docker image renders on the CPU, much more slowly.
  * No prebuilt Windows or Intel Mac build yet, and no HDR or HLS output.
  * No hosted rendering yet. ultrafast Cloud has a [waitlist](<https://ultrafast.mov/cloud/>).
  * It is new: the first release came out on 21 November 2026.

## Moving from HyperFrames.

ultrafast doesn't run HTML, so a HyperFrames composition is rebuilt, not imported. There are two ways to start.

### Ask your coding agent

Give it the composition and ask for the same video in ultrafast. With the ultrafast skill installed, the agent knows the document format and the loop: check, look at the frames, review, export. The skill works in Claude Code, Codex, Cursor, Antigravity CLI and Gemini CLI.

### Reconstruct a render

`uf reconstruct` turns a finished video into an editable draft: shots, text layers in matched fonts, backgrounds and fades, with a report of each decision. A shot it can't explain as a gradient or a still keeps the video itself as its background.

```
npx skills add ultrafastmov/ultrafast                       # the skill, for your coding agent
uf reconstruct render.mp4 --out-dir rec                     # writes rec/reconstruction.json
uf check rec/reconstruction.json && uf sheet rec/reconstruction.json --out rec/sheet.png
``` 

More in the [CLI reference](<https://ultrafast.mov/docs/cli/>), the head-to-head on [ultrafast vs HyperFrames](<https://ultrafast.mov/compare/hyperframes/>), and the [Remotion alternatives](<https://ultrafast.mov/alternatives/remotion/>).

## Common questions.

Is HyperFrames open source?

Yes. HyperFrames is Apache-2.0, from HeyGen. So are Framefields and VideoFlow's core; Editly, Manim, Motion Canvas and Revideo are MIT; ultrafast is Apache-2.0 or MIT. Remotion is source-available under its own licence, with a company licence from 4 people.

Which HyperFrames alternatives don't use a browser?

ultrafast (GPU kernels on Metal or Vulkan), Framefields (WebGPU in Node through Dawn), Manim (Cairo or OpenGL) and Editly (Node.js, Canvas and FFmpeg). Remotion, Revideo and VideoFlow's server renderer use headless Chrome, and Motion Canvas renders from its editor in your browser.

Which one is fastest?

Only three tools have been timed on the same machine: on one RTX 5090, three 10-second videos exported in 0.66 to 0.78 s with ultrafast, and HyperFrames took 4.6 to 5.7 times as long at its fastest setting found. The method and raw results are in the [benchmark](<https://ultrafast.mov/benchmarks/>). The other tools on this page weren't measured.

Can I bring my HyperFrames compositions to ultrafast?

Not as files: ultrafast doesn't run HTML. Ask your coding agent to rewrite the composition as an ultrafast document (the ultrafast skill teaches it the format), or run `uf reconstruct` on a finished render to get an editable draft.

Do I need a GPU?

For ultrafast and Framefields, a GPU is the fast path. ultrafast runs on a Mac with Apple silicon or Linux with a Vulkan GPU; its Docker image also renders on the CPU, much more slowly. HyperFrames, Remotion, Revideo and VideoFlow run on CPUs, with Chrome doing the drawing.

## Sources.

All read on 23 November 2026.

  * **GitHub API:** stars, licence and default branch from `gh api repos/OWNER/REPO`; releases from `/releases/latest` and `/tags`; last commits from `/commits` on the default branch. Package dates from [npm](<https://www.npmjs.com/>) and [PyPI](<https://pypi.org/project/manim/>).
  * **HyperFrames:** [README](<https://github.com/heygen-com/hyperframes#readme>), [deterministic rendering](<https://hyperframes.heygen.com/concepts/determinism>) (seek, capture, encode; fonts and Chrome versions), [performance guide](<https://hyperframes.heygen.com/guides/performance>) (25.0 s against 9.8 s), [CLI](<https://hyperframes.heygen.com/packages/cli>) (workers, `--gpu`, `--browser-gpu`, HLS, HDR), [quickstart](<https://hyperframes.heygen.com/quickstart>) (Studio app), [plugins](<https://hyperframes.heygen.com/guides/plugins>), [MCP](<https://hyperframes.heygen.com/guides/mcp>).
  * **Editly:** [README](<https://github.com/mifi/editly#readme>) (features, requirements).
  * **Framefields:** [README](<https://github.com/gatewai-dev/framefields#readme>) (rendering, requirements, CPU fallback, AI gateway, status), [Claude Code plugin](<https://github.com/gatewai-dev/framefields/tree/main/plugins/framefields>).
  * **Manim:** [Community edition README](<https://github.com/ManimCommunity/manim#readme>), [default renderer](<https://github.com/ManimCommunity/manim/blob/main/manim/_config/default.cfg>), [dependencies](<https://github.com/ManimCommunity/manim/blob/main/pyproject.toml>).
  * **Motion Canvas:** [README](<https://github.com/motion-canvas/motion-canvas#readme>), [quickstart](<https://motion-canvas.io/docs/quickstart>), [rendering](<https://motion-canvas.io/docs/rendering/>).
  * **Remotion:** [pricing](<https://www.remotion.dev/docs/license/pricing>), [licence FAQ (team size)](<https://www.remotion.dev/docs/license/faq#our-company-has-20-people-but-only-one-uses-remotion-do-we-need-a-company-license>), [Chrome Headless Shell](<https://www.remotion.dev/docs/miscellaneous/chrome-headless-shell>), [GPU](<https://www.remotion.dev/docs/gpu>), [skills](<https://www.remotion.dev/docs/ai/skills>), [MCP](<https://www.remotion.dev/docs/ai/mcp>).
  * **Revideo:** [README](<https://github.com/midrender/revideo#readme>), [how rendering works](<https://midrender.com/revideo/docs/guide/rendering-videos>).
  * **VideoFlow:** [README](<https://github.com/ybouane/VideoFlow#readme>), [licence](<https://videoflow.dev/license>).
  * **ultrafast:** [repository](<https://github.com/ultrafastmov/ultrafast>), [v0.2.0 release](<https://github.com/ultrafastmov/ultrafast/releases/tag/v0.2.0>), [MCP server](<https://ultrafast.mov/docs/mcp/>), [CLI](<https://ultrafast.mov/docs/cli/>), [benchmark](<https://ultrafast.mov/benchmarks/>).

## Make one and time it.

Install the engine and time a render on your own GPU.

`curl -fsSL https://ultrafast.mov/install.sh | sh` [Read the quickstart](<https://ultrafast.mov/docs/>)

Want it hosted? [Join the ultrafast Cloud waitlist](<https://ultrafast.mov/cloud/>).
