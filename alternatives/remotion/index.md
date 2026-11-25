# Open source Remotion alternatives, compared · ultrafast

> Remotion alternatives that are open source: Revideo, Motion Canvas, HyperFrames, Framefields, VideoFlow, Editly, Manim and ultrafast, and when to pick each.

URL: https://ultrafast.mov/alternatives/remotion/

# Open-source Remotion alternatives.

Eight tools that make video from code under an open-source licence, and when each one fits better than Remotion.

Updated 22 November 2026. ultrafast wrote this page and is one of the eight. Every figure is from each project's own repository and docs; sources are at the end.

## Why people look elsewhere.

Three reasons come up, each in Remotion's own words. Its pages were read on 22 November 2026, the licence and pricing quotes again on 26 November 2026.

### A company licence from 4 people

The free licence is “for individuals and companies of up to 3 people,” and it counts the whole company. Asked whether a 20-person company where one person uses Remotion needs a Company License, the FAQ answers: “Yes, unless a Free License exemption applies. Eligibility depends on your company's total headcount.”

[Pricing](<https://www.remotion.dev/docs/license/pricing>) · [FAQ](<https://www.remotion.dev/docs/license/faq#our-company-has-20-people-but-only-one-uses-remotion-do-we-need-a-company-license>) · [Remotion's licence, explained](<https://ultrafast.mov/learn/remotion-license/>)

### A fee for every render

Automated rendering costs “$0.01 per render, $100/mo minimum.” Making videos by hand costs “$25/mo per seat.” On Lambda, “Teams of 4+ people also need to acquire a Remotion Company License in addition to the AWS cost.”

[Pricing](<https://www.remotion.dev/docs/license/pricing>) · [Lambda cost example](<https://www.remotion.dev/docs/lambda/cost-example>)

### Chrome draws every frame

“Remotion downloads ‘Chrome Headless Shell’ into your `node_modules` to render videos.” Locally, “each Chrome tab renders web content and then screenshots it.” And: “By default in many cases, the GPU is disabled in headless mode, which can lead to a significant slowdown in rendering time.”

[Chrome Headless Shell](<https://www.remotion.dev/docs/miscellaneous/chrome-headless-shell>) · [Concurrency](<https://www.remotion.dev/docs/terminology/concurrency>) · [GPU](<https://www.remotion.dev/docs/gpu>)

Remotion's source is public under its own Remotion License. Its two tiers were “designed to ensure funding for this project while still allowing the source code to be available and the program to be free for most.” The tools below use open-source licences, MIT or Apache-2.0, so they are free for a company of any size. A few sell extras, noted below.

## Eight alternatives, side by side.

In alphabetical order, with Remotion first for reference. Stars, licences and dates from the GitHub API, checked 22 November 2026.

Project| Licence| You write| How it renders| Agent tooling| GPU| Latest release · last commit| Stars  
---|---|---|---|---|---|---|---  
[Remotion](<https://github.com/remotion-dev/remotion>) for reference| Remotion License, source-available; a company licence from 4 people| React and TypeScript| Chrome Headless Shell; each tab renders the page and screenshots it; FFmpeg encodes| 13 Agent Skills; plugins for 5 coding agents; its hosted MCP server shut down on 26 October 2026| often off in headless Chrome; none on Lambda| v4.0.545, 18 Nov 2026 · 20 Nov 2026| 74,759  
[Editly](<https://github.com/mifi/editly>)| MIT| a JSON5 edit spec, or JavaScript| Node.js and FFmpeg, streaming; Canvas and Fabric.js layers; GL transitions| none found| GL shaders through headless-gl; no GPU in its requirements| v0.15.0-rc.1, 19 Jan 2025 (npm: 0.14.2, Dec 2022) · 20 Feb 2025| 5,638  
[Framefields](<https://github.com/gatewai-dev/framefields>)| Apache-2.0| TypeScript| WebGPU in Node through Dawn (Metal, Vulkan, D3D12); no browser; hardware-encoded MP4| 7 skills and a Claude Code plugin; agents inspect frame grids| renders on it; a CPU fallback (lavapipe or WARP) is about 10 to 12 times slower| npm 3.0.2, 13 Nov 2026 · 18 Nov 2026| 529  
[HyperFrames](<https://github.com/heygen-com/hyperframes>) by HeyGen| Apache-2.0| HTML, CSS and JavaScript with a seekable animation (GSAP or another adapter)| headless Chrome through Puppeteer seeks and captures each frame; 1 to 24 workers; FFmpeg encodes| 9 skills; plugins for 6 agents; a hosted MCP server that renders on HeyGen| optional: `--browser-gpu` for capture, `--gpu` for hardware encoding| v0.9.79, 21 Nov 2026 · 21 Nov 2026| 87,831  
[Manim](<https://github.com/ManimCommunity/manim>) Community edition| MIT| Python| Cairo by default, or OpenGL; PyAV (FFmpeg's libraries) writes the video| none found| with the optional OpenGL renderer| v0.22.1, 27 Oct 2026 · 21 Nov 2026| 42,775 3b1b/manim: 96,778  
[Motion Canvas](<https://github.com/motion-canvas/motion-canvas>)| MIT| TypeScript, with generators| its editor draws each frame on a canvas in your browser; an image sequence, or video through the FFmpeg exporter| none found| no GPU in its requirements| v3.17.2, 14 Dec 2024 · 2 Jul 2026| 20,124  
[Revideo](<https://github.com/midrender/revideo>)| MIT| TypeScript scenes as generator functions| headless Chrome through Puppeteer draws each frame on a canvas; WebCodecs encodes; FFmpeg adds the audio; parallel workers| none found| none required: it runs where Node and a headless browser run| v0.11.0, 10 Jul 2026 · 15 Jul 2026| 4,223  
[ultrafast](<https://github.com/ultrafastmov/ultrafast>)| Apache-2.0 or MIT| one JSON document, checked before it renders| GPU kernels on Metal or Vulkan; H.264 and HEVC encoded on the same GPU; no browser| 20 MCP tools, a skill and a Claude Code plugin; `check`, `review` and `inspect`| renders on it; needs an Apple silicon Mac or Linux with a Vulkan GPU| v0.2.0, 23 Nov 2026 · 23 Nov 2026| 0  
[VideoFlow](<https://github.com/ybouane/VideoFlow>)| Apache-2.0 (its React editor has its own licence)| TypeScript, compiled to a portable JSON format| headless Chromium on a server, or WebCodecs in the browser; WebGL effects| llms.txt and Markdown docs| no GPU in its requirements| 1.3.4, 16 Sep 2026 · 16 Sep 2026| 174  
  
“None found”: no skills, MCP server or agent plugin in the repository or docs. Dates are UTC. A release is the latest GitHub release, or the latest npm version where the project publishes there. The last commit is on the default branch. Product names belong to their owners.

## Which one to choose.

Each tool is the better fit for some jobs. Remotion included.

### Choose Remotion when

  * Your team builds in React and wants to reuse its components.
  * You need an embeddable web player.
  * You want a project in development since 2020, with 74,759 stars, and the licence fits: 3 people or fewer, or a company licence.

### Choose Editly when

  * You are cutting clips, photos, titles and music together from a JSON5 file or the command line.
  * You want an MIT tool that runs on Windows, macOS and Linux with Node and FFmpeg.
  * You don't need recent updates: the last commit was in February 2025.

### Choose Framefields when

  * You want to write TypeScript and render on the GPU with no browser.
  * You need Windows (D3D12), or a CPU fallback for CI.
  * You want PBR materials and glTF models, or on-device vision such as SAM tracking.
  * You can work with beta software. Its AI gateway for generated media and its cloud GPU renders are optional and paid.

### Choose HyperFrames when

  * Your team writes HTML, CSS and GSAP.
  * You want a large, fast-moving project: 87,831 stars and a release on 21 November 2026.
  * You are porting Remotion code: it ships a `/remotion-to-hyperframes` skill.
  * You need HDR or HLS output, or hosted renders on HeyGen, which its MCP server uses.

### Choose Manim when

  * You are animating maths in Python: equations, graphs and geometry.
  * You want the edition its maintainers recommend for new work, the Community edition; or Grant Sanderson's original, 3b1b/manim (96,778 stars), to study how the 3Blue1Brown videos are made.

### Choose Motion Canvas when

  * You make vector explainers timed to a voice-over, in a real-time editor.
  * You render from the editor, don't need a server or an API, and don't mind that the last release was in December 2024.

### Choose Revideo when

  * You want generator-based TypeScript scenes rendered from code or an endpoint, with a React player for previews.
  * You want to split renders across workers on serverless machines.
  * You accept anonymous render counts, or set `DISABLE_TELEMETRY=true` to turn them off.

### Choose VideoFlow when

  * You want one JSON format to render on a server, in the browser, or as live playback with scrubbing.
  * You build a web app around video. Its core and renderers are Apache-2.0; its React Video Editor needs a company licence beyond 3 employees.

### Choose ultrafast when

  * An agent writes the video and should check and review its own frames before you watch.
  * You want 3D, particles, fluid and shaders in the same video as the type and the footage.
  * You render often on your own GPU and want no per-render fee at any company size.

## Shot on the GPU.

Shaders, 3D, motion type and camera optics, written by your agent and rendered on the GPU. Open source.

Apache-2.0 or MIT, for everyone. No per-render fee and no licence tiers, at any company size.

ultrafast, measured on one RTX 5090

1080p, 6-sample motion blur
    894 fps
10 s hero, 300 frames
    0.34 s
launch film, 16 s, 3D
    4.88 s
simulation, 15 s
    1.06 s
vertical teaser, 10 s, 3D
    1.68 s

Export times for every film are on [examples](<https://ultrafast.mov/examples/>). No other tool on this page has been timed on the same machine, so this page compares no speeds.

Measured on one RTX 5090 workstation, end to end: three 10-second videos (a title card, an animated chart and captioned NASA footage) exported in 0.66 to 0.78 s with ultrafast, against 2.25 to 6.69 s for Remotion and 3.31 to 4.46 s for HyperFrames at the fastest setting found for each. Only these three tools were measured. [Method and raw results](<https://github.com/ultrafastmov/benchmarks>).

### Agents see their frames

`check` finds mistakes before rendering. Frames and contact sheets come back as images. `review` reads every frame for unreadable, clipped, overlapping or too-brief text and flashing. `inspect` names the node behind a pixel.

### One graph for all of it

3D with image-based light, raymarching, particles, fluid and feedback simulations, and Slang shaders, in the same document as the type and the footage.

### Built for agents

20 MCP tools over stdio with `uf mcp`, or 16 over HTTP from your own `uf serve`. A skill, and a Claude Code plugin with both. See the [MCP docs](<https://ultrafast.mov/docs/mcp/>).

### Where ultrafast doesn't fit

  * No React. A video is a JSON document, not components.
  * No embeddable web player. The live player is a desktop window; for the web, export an MP4.
  * It needs a GPU: a Mac with Apple silicon, or Linux with a Vulkan GPU.
  * No prebuilt Windows or Intel Mac build yet.
  * No hosted rendering yet. ultrafast Cloud has a [waitlist](<https://ultrafast.mov/cloud/>).
  * It is new: the first release came out on 21 November 2026.

## Moving from Remotion.

ultrafast doesn't run React, so a Remotion project is rebuilt, not imported. There are two ways to start.

### Ask your coding agent

Give it the composition and ask for the same video in ultrafast. With the ultrafast skill installed, the agent knows the document format and the loop: check, look at the frames, review, export. The skill works in Claude Code, Codex, Cursor, Antigravity CLI and Gemini CLI.

### Reconstruct a render

`uf reconstruct` turns a finished video into an editable draft: shots, text layers in matched fonts, backgrounds and fades, with a report of each decision. It reads text with Apple Vision on macOS, or with Tesseract (installed separately) elsewhere. A shot it can't explain as a gradient or a still keeps the video itself as its background.

```
npx skills add ultrafastmov/ultrafast                       # the skill, for your coding agent
uf reconstruct render.mp4 --out-dir rec                     # writes rec/reconstruction.json
uf check rec/reconstruction.json && uf sheet rec/reconstruction.json --out rec/sheet.png
``` 

More in the [CLI reference](<https://ultrafast.mov/docs/cli/>) and [RECONSTRUCTION.md](<https://github.com/ultrafastmov/ultrafast/blob/main/docs/RECONSTRUCTION.md>).

## Sources.

All read on 22 November 2026.

  * **GitHub API:** stars, licence and default branch from `gh api repos/OWNER/REPO`; releases from `/releases/latest` and `/tags`; last commits from `/commits` on the default branch. Package dates from [npm](<https://www.npmjs.com/>) and [PyPI](<https://pypi.org/project/manim/>).
  * **Remotion:** [pricing](<https://www.remotion.dev/docs/license/pricing>), [licence FAQ (team size)](<https://www.remotion.dev/docs/license/faq#our-company-has-20-people-but-only-one-uses-remotion-do-we-need-a-company-license>), [Remotion's licence, explained](<https://ultrafast.mov/learn/remotion-license/>), [LICENSE.md](<https://github.com/remotion-dev/remotion/blob/main/LICENSE.md>), [Lambda cost example](<https://www.remotion.dev/docs/lambda/cost-example>), [Chrome Headless Shell](<https://www.remotion.dev/docs/miscellaneous/chrome-headless-shell>), [renderMedia](<https://www.remotion.dev/docs/renderer/render-media>) (FFmpeg), [Player](<https://www.remotion.dev/docs/player>), [concurrency](<https://www.remotion.dev/docs/terminology/concurrency>), [GPU](<https://www.remotion.dev/docs/gpu>), [skills](<https://www.remotion.dev/docs/ai/skills>), [plugins](<https://www.remotion.dev/docs/ai/plugins>), [MCP](<https://www.remotion.dev/docs/ai/mcp>).
  * **Editly:** [README](<https://github.com/mifi/editly#readme>) (features, requirements).
  * **Framefields:** [README](<https://github.com/gatewai-dev/framefields#readme>) (rendering, requirements, CPU fallback, 3D, vision, AI gateway, status), [Claude Code plugin](<https://github.com/gatewai-dev/framefields/tree/main/plugins/framefields>) (7 skills, cloud renders, a read-only MCP server).
  * **HyperFrames:** [README](<https://github.com/heygen-com/hyperframes#readme>) (rendering, 9 skills, `/remotion-to-hyperframes`), [CLI](<https://hyperframes.heygen.com/packages/cli>) (workers, `--gpu`, `--browser-gpu`, HLS, HDR), [plugins](<https://hyperframes.heygen.com/guides/plugins>), [MCP](<https://hyperframes.heygen.com/guides/mcp>).
  * **Manim:** [Community edition README](<https://github.com/ManimCommunity/manim#readme>), [default renderer](<https://github.com/ManimCommunity/manim/blob/main/manim/_config/default.cfg>), [dependencies](<https://github.com/ManimCommunity/manim/blob/main/pyproject.toml>), [3b1b/manim](<https://github.com/3b1b/manim#readme>).
  * **Motion Canvas:** [README](<https://github.com/motion-canvas/motion-canvas#readme>), [quickstart](<https://motion-canvas.io/docs/quickstart>) (requirements), [rendering](<https://motion-canvas.io/docs/rendering/>), [FFmpeg exporter](<https://motion-canvas.io/docs/rendering/video/>).
  * **Revideo:** [README](<https://github.com/midrender/revideo#readme>) (headless rendering, Cloud Run, telemetry), [how rendering works](<https://midrender.com/revideo/docs/guide/rendering-videos>), [renderer source](<https://github.com/midrender/revideo/blob/main/packages/renderer/server/render-video.ts>) (Puppeteer).
  * **VideoFlow:** [README](<https://github.com/ybouane/VideoFlow#readme>) (renderers, WebGL effects), [licence](<https://videoflow.dev/license>), [llms.txt](<https://videoflow.dev/llms.txt>).
  * **ultrafast:** [repository](<https://github.com/ultrafastmov/ultrafast>) (LICENSE-APACHE, LICENSE-MIT), [v0.2.0 release](<https://github.com/ultrafastmov/ultrafast/releases/tag/v0.2.0>) (macOS arm64 and Linux x86_64), [MCP server](<https://ultrafast.mov/docs/mcp/>), [CLI](<https://ultrafast.mov/docs/cli/>), [ops](<https://ultrafast.mov/docs/ops/>), [skill and plugin](<https://ultrafast.mov/integrations/#coding-agents>), [example films and export times](<https://ultrafast.mov/examples/>), [ultrafast vs Remotion](<https://ultrafast.mov/compare/remotion/>).

## Make one and time it.

Install the engine and time a render on your own GPU.

`curl -fsSL https://ultrafast.mov/install.sh | sh` [Read the quickstart](<https://ultrafast.mov/docs/>)

Want it hosted? [Join the ultrafast Cloud waitlist](<https://ultrafast.mov/cloud/>).
