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
Output tokens for a 10 s short| about 1,234, measured| about 1,680, most of it web code  
Export, same machine ([benchmark](<https://github.com/ultrafastmov/benchmarks>))| 0.85–0.98 s for three 10-second videos| 3.31–4.46 s at its fastest setting found; 3.71–5.05 s with its default command  
Same pixels everywhere| bundled fonts, the same kernels on every machine| fonts and Chrome versions can shift pixels; `--docker` pins them  
Install| one binary| Node 22+, FFmpeg, a managed Chrome  
For agents| 20 MCP tools (local and remote) including `check`, `review` and `inspect`; frames returned as images; ChatGPT and Claude apps coming soon| 9 skills; plugins for 6 agents; a Claude connector with `compose` and `render_video`; a ChatGPT Work plugin  
Review of the result| every frame read for unreadable, clipped or too-brief text and flashing| no built-in review  
Effects| 3D with image-based light and glass, raymarching, particles, fluid and feedback sims, Slang shaders| Three.js, WebGPU, Lottie, WebGL shader transitions, motion blur  
Export| H.264, HEVC and AV1 MP4; ProRes proxy to 4444 XQ; transparent ProRes 4444 and VP9 WebM; GIF; PNG and EXR sequences; sound alone. Any size and frame rate; draft, standard, high and master| H.264 and H.265 MP4, ProRes, transparent WebM and MOV, GIF, PNG sequences, HLS, HDR10; draft, standard and high; 1080p or 4K  
Licence| Apache-2.0 or MIT| Apache-2.0  
Hosted rendering| your own GPU with `uf serve`; ultrafast Cloud has a [waitlist](<https://ultrafast.mov/cloud/>)| HeyGen credits, or your own Lambda or Cloud Run  
  
Speed

## About four times faster, measured.

Three 10-second videos written in both tools and exported end to end on one RTX 5090 workstation. At the fastest setting found, HyperFrames took 3.8 to 4.5 times as long; with its default command, 4.2 to 5.1 times. [Method and raw results](<https://github.com/ultrafastmov/benchmarks>).

  1. Title card, ultrafast **0.85 s**
  2. Title card, HyperFrames **3.53 s**
  3. Chart, ultrafast **0.88 s**
  4. Chart, HyperFrames **3.31 s**
  5. Footage, ultrafast **0.98 s**
  6. Footage, HyperFrames **4.46 s**

Tokens

## A fifth to a quarter fewer tokens.

Output tokens an agent writes for a 10-second vertical short: footage, a title, three lines of detail, captions timed to each word, a grade and grain, counted with tiktoken (o200k_base) over the files each tool needs: the ultrafast document; Remotion's composition, config and CLI commands; HyperFrames' HTML and its grading command. Counting only what is typed after each tool's own scaffold: ultrafast 1,218, HyperFrames 1,500, Remotion 1,660. Measured 22 November 2026.

  1. ultrafast **1,234**
  2. HyperFrames **1,680**

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

Grain, a grade and word-timed captions are built in on both sides now: HyperFrames' `media-treatment` command and caption groups, against one node each in ultrafast. The gap is mostly the HTML, CSS and timeline set-up around them.

10,000 shorts a month| output tokens| at $20 per million  
---|---|---  
ultrafast| 12.34 million| $247  
HyperFrames| 16.8 million| $336  
  
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

HyperFrames renders HTML and GSAP in headless Chrome; ultrafast renders a JSON document on the GPU. That makes ultrafast about four times faster on the same machine (3.8 to 4.5 times at HyperFrames' fastest setting, in a [public benchmark](<https://github.com/ultrafastmov/benchmarks>)), and lets agents review the frames they made.

Will my video look the same on every machine?

With ultrafast, yes: fonts are bundled or fetched by name, and the GPU kernels are the same on every machine. HyperFrames notes that fonts and Chrome versions can shift pixels between machines unless you render in Docker.

Can I use GSAP or HTML I already have?

Not directly. Ask your agent to rewrite the composition as an ultrafast document, or run `uf reconstruct` on a finished render to get an editable draft.

Do I need Node or FFmpeg?

No Node. ultrafast is one binary; exports on Vulkan use FFmpeg, and the prebuilt binaries and Docker image bring what they need.

How many tokens does an agent spend on a HyperFrames video?

Measured on a 10-second vertical short (footage, a title, three lines, word-timed captions, a grade and grain): 1,680 output tokens for the HTML composition and its grading command. The same short as an ultrafast document is 1,234 (tiktoken o200k_base). Counting only what is typed after each tool's scaffold: 1,500 and 1,218.

HyperFrames facts from its docs, checked 21 November 2026: [repository](<https://github.com/heygen-com/hyperframes>), [CLI](<https://hyperframes.heygen.com/packages/cli>), [performance](<https://hyperframes.heygen.com/guides/performance>), [determinism](<https://hyperframes.heygen.com/concepts/determinism>), [plugins](<https://hyperframes.heygen.com/guides/plugins>), [MCP](<https://hyperframes.heygen.com/guides/mcp>), [Lambda](<https://hyperframes.heygen.com/deploy/aws-lambda>). HyperFrames and HeyGen are trademarks of their owner.

## Make one and time it.

Install the engine and time a render on your own GPU.

`curl -fsSL https://ultrafast.mov/install.sh | sh` [Read the quickstart](<https://ultrafast.mov/docs/>)

Want it hosted? [Join the ultrafast Cloud waitlist](<https://ultrafast.mov/cloud/>).
