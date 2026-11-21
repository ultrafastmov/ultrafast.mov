# ultrafast vs HyperFrames · GPU rendering vs HTML in Chrome

> HyperFrames turns HTML and GSAP into video through headless Chrome. ultrafast renders on the GPU with no browser: faster, with 3D, simulation, shaders and a review loop for agents.

URL: https://ultrafast.mov/compare/hyperframes/

Compare

# ultrafast vs HyperFrames.

HyperFrames, from HeyGen, turns HTML and GSAP into video through headless Chrome. ultrafast renders on the GPU with no browser. Both are open source under permissive licences; the engines are different.

At a glance

## Side by side.

| ultrafast| HyperFrames  
---|---|---  
How a frame is made| GPU kernels compiled from the document; encoded on the same GPU| a page laid out in Chrome via Puppeteer, captured per frame, encoded with FFmpeg; 1 to 24 browsers of about 256 MB each  
You write| one JSON document with a published schema| HTML and CSS with `data-*` timing, and a paused GSAP timeline or another adapter  
Output tokens for a 10 s short| about 1,100, all of it the video| about 4,400, most of it web code  
Speed, 300 frames of 1080p| 0.34 s with 6-sample motion blur, one RTX 5090| 9.8 s; 25 s with one costly CSS rule  
Same pixels everywhere| bundled fonts, the same kernels on every machine| fonts and Chrome versions can shift pixels; `--docker` pins them  
Install| one binary| Node 22+, FFmpeg, a managed Chrome  
For agents| 20 MCP tools (local and remote) including `check`, `review` and `inspect`; frames returned as images; ChatGPT and Claude apps coming soon| 9 skills; plugins for 6 agents; a Claude connector with `compose` and `render_video`; a ChatGPT Work plugin  
Review of the result| every frame read for unreadable, clipped or too-brief text and flashing| no built-in review  
Effects| 3D with image-based light and glass, raymarching, particles, fluid and feedback sims, Slang shaders| Three.js, WebGPU, Lottie, WebGL shader transitions, motion blur  
Export| H.264, HEVC and AV1 MP4; ProRes proxy to 4444 XQ; transparent ProRes 4444 and VP9 WebM; GIF; PNG and EXR sequences; sound alone. Any size and frame rate; draft, standard, high and master| H.264 and H.265 MP4, ProRes, transparent WebM and MOV, GIF, PNG sequences, HLS, HDR10; draft, standard and high; 1080p or 4K  
Licence| Apache-2.0 or MIT| Apache-2.0  
Hosted rendering| your own GPU with `uf serve`; ultrafast Cloud has a [waitlist](<https://ultrafast.mov/cloud/>)| HeyGen credits, or your own Lambda or Cloud Run  
  
Speed

## About 30 times their own number.

HyperFrames' performance guide renders 300 frames of 1080p in 9.8 s. ultrafast renders 300 frames of 1080p, with 6-sample motion blur, in 0.34 s.

  1. ultrafast **0.34 s**
  2. HyperFrames **9.8 s**
  3. HyperFrames, one costly CSS rule **25 s**

Tokens

## A quarter of the tokens.

Output tokens an agent writes for a 10-second vertical short: footage, a title, three lines of detail, captions timed to each word, a grade and grain. In a web project most of them are web code. In an ultrafast document, every token describes the video.

  1. ultrafast **1,100**
  2. HyperFrames **4,400**

describes the video; web code around it: imports, components, styles, timeline set-up, project files

### The same title, both ways.

The pottery teaser’s title, its letters rising in one by one.

ultrafast

```
"title": {
  "op": "text",
  "params": {
    "text": "Spin something new.",
    "font": "ultrafast:display", "weight": 300, "size": 176,
    "color": "#f1e8dc", "position": [80, 380], "valign": "baseline",
    "width": 880, "line_height": 0.9, "tracking": -3,
    "stagger": 0.03,
    "glyph_opacity": { "keys": [
      { "t": 0.7, "v": [0], "ease": "in_out_sine" },
      { "t": 1.5, "v": [1] } ] },
    "glyph_offset": { "keys": [
      { "t": 0.7, "v": [0, 56],
        "ease": { "bezier": [0.16, 1, 0.3, 1] } },
      { "t": 1.8, "v": [0, 0] } ] }
  }
}
``` 

HyperFrames

```
<div id="root" data-composition-id="teaser" data-start="0"
     data-width="1080" data-height="1920">
  <h1 id="title" class="clip" data-start="0" data-duration="10"
      data-track-index="1">Spin something new.</h1>
</div>
<style>
  @import url("https://fonts.googleapis.com/css2?family=Fraunces:wght@300");
  #title {
    position: absolute; left: 80px; top: 222px; width: 880px;
    margin: 0; font: 300 176px/0.9 "Fraunces", serif;
    letter-spacing: -3px; color: #f1e8dc;
  }
  #title .w, #title .c { display: inline-block; }
</style>
<script src="https://cdn.jsdelivr.net/npm/gsap@3/dist/gsap.min.js">
</script>
<script>
  const title = document.getElementById("title");
  title.innerHTML = title.textContent.split(" ").map((w) =>
    '<span class="w">' + [...w, "\u00a0"].map((c) =>
      '<span class="c">' + c + "</span>").join("") + "</span>"
  ).join("");
  const tl = gsap.timeline({ paused: true });
  tl.from("#title .c", { opacity: 0, duration: 0.8,
    ease: "sine.inOut", stagger: 0.03 }, 0.7);
  tl.from("#title .c", { y: 56, duration: 1.1,
    ease: "expo.out", stagger: 0.03 }, 0.7);
  window.__timelines = window.__timelines || {};
  window.__timelines["teaser"] = tl;
</script>
``` 

The rest of the gap is the effects: grain, a grade and captions timed to each word are a script or a canvas each in HyperFrames and one node each in ultrafast.

10,000 shorts a month| output tokens| at $20 per million  
---|---|---  
ultrafast| 11 million| $220  
HyperFrames| 44 million| $880  
  
Beyond the browser

## What a page can't do quickly.

In a browser, every glass refraction, particle and fluid step is work done inside a web page. In ultrafast they are nodes in the same graph as the captions, fused into GPU kernels.

### 3D

Extruded and bevelled type, glTF, image-based light, shadows, depth of field, refractive glass, and raymarched product shots.

### Simulation

Particles and swarms that form type; ink and smoke fluid; feedback loops for trails and reaction-diffusion. Exact on export, and scrubbable.

### Shaders

Agents write Slang shaders as nodes. `check` compiles them before anything renders.

### Choose ultrafast when

  * Render time and cost matter: shorts at scale, every aspect ratio, one per customer.
  * An agent should review its own video before a person sees it.
  * You need the same pixels on every machine without pinning a browser.
  * You want 3D, simulation or shaders without a page doing the work.

### Choose HyperFrames when

  * You think in HTML, CSS and GSAP, or have compositions in them already.
  * You need HeyGen's avatars and voices in the same tool.
  * You need HDR10 or HLS output today.
  * You have no GPU and want to render on CPUs.

Questions

## Common questions.

Both are open source. What's the difference?

HyperFrames renders HTML and GSAP in headless Chrome; ultrafast renders a JSON document on the GPU. That makes ultrafast about 30 times faster on HyperFrames' own published numbers, and lets agents review the frames they made.

Will my video look the same on every machine?

With ultrafast, yes: fonts are bundled or fetched by name, and the GPU kernels are the same on every machine. HyperFrames notes that fonts and Chrome versions can shift pixels between machines unless you render in Docker.

Can I use GSAP or HTML I already have?

Not directly. Ask your agent to rewrite the composition as an ultrafast document, or run `uf reconstruct` on a finished render to get an editable draft.

Do I need Node or FFmpeg?

No Node. ultrafast is one binary; exports on Vulkan use FFmpeg, and the prebuilt binaries and Docker image bring what they need.

How many tokens does an agent spend on a HyperFrames video?

About 4,400 output tokens for a 10-second short: the HTML, the CSS, the GSAP timeline and the scripts for captions and grain. The same short as an ultrafast document is about 1,100. At $20 per million output tokens, 10,000 shorts cost about $880 to write in HyperFrames and $220 in ultrafast.

HyperFrames facts from its docs, checked 21 November 2026: [repository](<https://github.com/heygen-com/hyperframes>), [CLI](<https://hyperframes.heygen.com/packages/cli>), [performance](<https://hyperframes.heygen.com/guides/performance>), [determinism](<https://hyperframes.heygen.com/concepts/determinism>), [plugins](<https://hyperframes.heygen.com/guides/plugins>), [MCP](<https://hyperframes.heygen.com/guides/mcp>), [Lambda](<https://hyperframes.heygen.com/deploy/aws-lambda>). HyperFrames and HeyGen are trademarks of their owner.

## Make one and time it.

Install the engine and time a render on your own GPU.

`curl -fsSL https://ultrafast.mov/install.sh | sh` [Read the quickstart](<https://ultrafast.mov/docs/>)

Want it hosted? [Join the ultrafast Cloud waitlist](<https://ultrafast.mov/cloud/>).
