# ultrafast vs Remotion vs HyperFrames · Comparison

> How ultrafast compares with Remotion and HyperFrames: how each renders, speed, agent tools, licence and cost per minute.

URL: https://ultrafast.mov/compare/

Compare

# No browser in the loop.

Remotion and HyperFrames lay out a web page for every frame in headless Chrome, then capture it. ultrafast draws the frame on the GPU and encodes it there.

[ultrafast vs Remotion](<https://ultrafast.mov/compare/remotion/>) [ultrafast vs HyperFrames](<https://ultrafast.mov/compare/hyperframes/>)

At a glance

## Three ways to make video from code.

| ultrafast| Remotion| HyperFrames  
---|---|---|---  
Draws each frame with| GPU kernels, Metal or Vulkan; the planner fuses nodes into one kernel per group| headless Chrome; parallel tabs render and screenshot frames| headless Chrome via Puppeteer; 1 to 24 browser workers  
You write| one JSON document; no build step| a React and TypeScript project| HTML, CSS and JS with a paused GSAP timeline or another adapter  
Output tokens for a 10 s short| about 1,234| about 1,868| about 1,680  
Published speed, 1080p| 300 frames with 6-sample motion blur in 0.34 s on one RTX 5090| an 80 s video in 15 s on Lambda, up to 200 functions| 300 frames in 9.8 s; 25 s with one costly CSS rule  
GPU| renders on it| not used by default; none on Lambda| optional, for WebGL and hardware encoding  
Agents check and review| `check` before rendering; `review` reads every frame for unreadable, clipped or too-brief text and flashing; `inspect` maps pixels to nodes| no built-in review| no built-in review  
Agent surfaces| 20 MCP tools, local and remote; skills; ChatGPT and Claude apps coming soon| 13 Agent Skills; plugins for 5 coding agents; hosted MCP shut down in October 2026| 9 skills; plugins for 6 agents; Claude connector; ChatGPT Work plugin  
Same pixels on every machine| bundled fonts, the same kernels everywhere| frames must be pure functions of the frame number| fonts and Chrome versions can shift pixels; Docker pins them  
Export| MP4 (H.264, HEVC, AV1), ProRes to 4444 XQ, transparent ProRes and WebM, GIF, PNG and EXR sequences, sound alone; any size, sharp; draft to master| H.264, H.265, VP8, VP9, AV1, ProRes, GIF, transparent video, image sequences, sound alone; `--scale`| H.264, H.265, ProRes, transparent WebM and MOV, GIF, PNG sequences, HLS, HDR10; 1080p or 4K  
3D, simulation, shaders| in the same graph: 3D with image-based light and glass, raymarching, particles, fluid, feedback, Slang shaders| Three.js through React Three Fiber, shaders| Three.js, WebGPU, WebGL shader transitions  
Licence| Apache-2.0 or MIT| source-available: free up to 3 people; companies $0.01 a render ($100/mo minimum) or $25 a seat| Apache-2.0  
Hosted rendering| your own GPU with `uf serve`; ultrafast Cloud has a [waitlist](<https://ultrafast.mov/cloud/>)| none; Lambda runs in your AWS account| HeyGen credits, or your own Lambda or Cloud Run  
  
Tokens

## Up to a third fewer tokens.

Output tokens an agent writes for a 10-second vertical short: footage, a title, three lines of detail, captions timed to each word, a grade and grain, counted with tiktoken (o200k_base) over the files each tool needs: the ultrafast document; Remotion's composition, config and CLI commands; HyperFrames' HTML and its grading command. Counting only what is typed after each tool's own scaffold: ultrafast 1,218, HyperFrames 1,500, Remotion 1,660. Measured 22 November 2026.

  1. ultrafast **1,234**
  2. HyperFrames **1,680**
  3. Remotion **1,868**

The same title written both ways: [ultrafast and Remotion](<https://ultrafast.mov/compare/remotion/#tokens>), [ultrafast and HyperFrames](<https://ultrafast.mov/compare/hyperframes/#tokens>).

10,000 shorts a month| output tokens| at $20 per million  
---|---|---  
ultrafast| 12.34 million| $247  
HyperFrames| 16.8 million| $336  
Remotion| 18.68 million| $374  
  
Speed

## Frames a second, per machine.

300 frames of 1080p. ultrafast's run includes 6-sample motion blur; HyperFrames' numbers are from its performance guide. Remotion publishes Lambda times instead of per-machine ones.

  1. ultrafast **894 fps**
  2. HyperFrames **31 fps**
  3. HyperFrames, one costly CSS rule **12 fps**

Cost

## A 10-second short.

What it takes to write and render one vertical 1080p clip, the most common thing agents make. Tokens at $20 per million output tokens.

| to write it| to render it| also needed  
---|---|---|---  
ultrafast, your GPU| about 2¢ of tokens| nothing| a Mac or a Vulkan GPU  
Remotion, company of 4+| about 4¢ of tokens| $0.01 licence fee plus Lambda compute in your AWS account| $100 a month minimum, an AWS account  
HyperFrames| about 3¢ of tokens| your own Lambda or Cloud Run compute, or HeyGen credits| Node 22, FFmpeg, a cloud account  
  
Which one

## Pick by the job.

### Choose ultrafast when

  * An agent writes the video and should see and fix it before anyone watches.
  * You render a lot: shorts at scale, one video per customer, every aspect ratio.
  * You want 3D, particles, fluid or shaders in the same document as the captions.
  * You want a permissive licence with no per-render fee.

### Choose a browser renderer when

  * Your team already builds the video's parts as React components or HTML and CSS.
  * You need an embeddable web player (Remotion) or HeyGen's avatars and voices (HyperFrames).
  * You need HDR or HLS output today.
  * You have no GPU and don't want to use a hosted service.

For more options, the page on [open-source Remotion alternatives](<https://ultrafast.mov/alternatives/remotion/>) compares eight tools, with when to choose each.

Questions

## Common questions.

Is ultrafast a Remotion alternative?

Yes. Both make video from code. Remotion renders React components in headless Chrome; ultrafast renders a JSON document on the GPU with no browser, under Apache-2.0 or MIT with no per-render fee.

Is ultrafast a HyperFrames alternative?

Yes. HyperFrames turns HTML and GSAP into video in headless Chrome. ultrafast has the same permissive licence, renders on the GPU with no browser, and gives agents tools to review their frames.

Why does a browser renderer take longer?

It lays out a web page for every frame, then captures it from the browser and hands it to an encoder. ultrafast compiles the document into GPU kernels once, draws each frame directly and encodes it on the same GPU, without copying frames back to the CPU.

Can I bring videos I already made?

Yes. `uf reconstruct` turns a finished video into an editable document draft: shots, text layers in matched fonts, backgrounds and fades. Or ask your agent to rewrite a composition as a document.

Why does an agent need fewer tokens with ultrafast?

A document only describes the video: nodes and their params. A Remotion or HyperFrames project also needs imports, components, CSS and timeline set-up around its effects. Measured on the same 10-second short (tiktoken o200k_base): 1,234 tokens in ultrafast, 1,680 in HyperFrames and 1,868 in Remotion across the files the agent writes; 1,218, 1,500 and 1,660 counting only what is typed after each tool's scaffold.

**Sources** , checked 21 November 2026: Remotion [pricing](<https://www.remotion.dev/docs/license/pricing>), [team size](<https://www.remotion.dev/docs/terms#TeamSize>), [Lambda](<https://www.remotion.dev/lambda>), [MCP](<https://www.remotion.dev/docs/ai/mcp>), [skills](<https://www.remotion.dev/docs/ai/skills>), [GPU](<https://www.remotion.dev/docs/gpu>), [flickering](<https://www.remotion.dev/docs/flickering>); HyperFrames [repository](<https://github.com/heygen-com/hyperframes>), [CLI](<https://hyperframes.heygen.com/packages/cli>), [performance](<https://hyperframes.heygen.com/guides/performance>), [determinism](<https://hyperframes.heygen.com/concepts/determinism>), [plugins](<https://hyperframes.heygen.com/guides/plugins>), [Lambda](<https://hyperframes.heygen.com/deploy/aws-lambda>). Product names belong to their owners.

## Make one and time it.

Install the engine and time a render on your own GPU.

`curl -fsSL https://ultrafast.mov/install.sh | sh` [Read the quickstart](<https://ultrafast.mov/docs/>)

Want it hosted? [Join the ultrafast Cloud waitlist](<https://ultrafast.mov/cloud/>).
