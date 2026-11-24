# After Effects alternatives for code and agents · ultrafast

> Motion graphics from code instead of the After Effects timeline: automating After Effects with aerender and nexrender, hosted template renderers, Cavalry, and ultrafast, with what carries over from After Effects and what doesn't.

URL: https://ultrafast.mov/alternatives/after-effects/

# After Effects, written as code.

After Effects is a timeline you keyframe by hand. When the motion graphics should come from code, from data or from a coding agent, there are three ways to go: drive After Effects from a script, render its templates as a service, or replace it with a tool you write. Each is compared below on cost, platforms and what carries over.

Updated 24 November 2026. ultrafast wrote this page and is one of the tools on it. Facts about the others are from their own pages; sources are at the end. ultrafast doesn't open After Effects projects.

## A trailer title, in 46 lines.

Extruded chrome type, a camera push with depth of field, a lens flare, bloom, a light leak, a text animator, a grade and grain: the stack an After Effects artist would build from Cinema 4D Lite, Optical Flares and a few adjustment layers. Here it is one JSON document, exported in 0.71 s.

[Video: The word NIGHTFALL in chrome extruded letters turns towards the camera as it pushes in, with a lens flare sliding across the top of the frame, soft out-of-focus orange lights, and THIS WINTER rising letter by letter underneath](https://ultrafast.mov/media/guides/after-effects-title.mp4)

150 frames of 1080p, exported to MP4 in 0.70 to 0.73 s on one RTX 5090 with ultrafast 0.2.1, and to ProRes 422 HQ in 1.62 to 1.65 s. `uf review` read every frame in 0.73 s and found nothing to fix.

```
{
  "version": 1,
  "format": { "width": 1920, "height": 1080, "fps": 30, "duration": 5,
              "motion_blur": { "samples": 6, "shutter": 0.5, "max_samples": 32 } },
  "output": "out",
  "nodes": {
    "sky": { "op": "gradient", "params": { "kind": "radial", "stops": "0:#1d2440, 1:#05060b", "space": "srgb", "radius": 1250 } },
    "fractal": { "op": "noise", "params": { "a": "#000000", "b": "#2a3358", "scale": 520, "octaves": 5,
      "evolution": { "keys": [ { "t": 0, "v": 0 }, { "t": 5, "v": 1.4 } ] } } },
    "smoke": { "op": "blend", "inputs": { "fg": "fractal", "bg": "sky" }, "params": { "mode": "screen", "opacity": 0.6 } },

    "word": { "op": "mesh", "params": { "primitive": "text", "text": "NIGHTFALL", "weight": 800, "size": 1.0,
      "depth": 0.32, "bevel": 0.025, "color": "#eef1f7", "metallic": 1, "roughness": 0.16,
      "rotation": { "keys": [ { "t": 0, "v": [4, -24, 0], "ease": "out_cubic" }, { "t": 5, "v": [2, 4, 0] } ] } } },
    "near1": { "op": "mesh", "params": { "primitive": "sphere", "scale": 0.28, "position": [-2.2, -1.2, 3.2], "emissive": "#ffb46a" } },
    "near2": { "op": "mesh", "params": { "primitive": "sphere", "scale": 0.2, "position": [2.0, 1.1, 3.6], "emissive": "#ffd29a" } },
    "far1": { "op": "mesh", "params": { "primitive": "sphere", "scale": 0.2, "position": [-4.2, 1.6, -5], "emissive": "#ff9a4d" } },
    "far2": { "op": "mesh", "params": { "primitive": "sphere", "scale": 0.18, "position": [3.8, -1.3, -4], "emissive": "#ffc07a" } },
    "far3": { "op": "mesh", "params": { "primitive": "sphere", "scale": 0.16, "position": [5.6, 2.1, -7], "emissive": "#ff8a3d" } },
    "key": { "op": "light", "params": { "direction": [0.4, 0.7, 0.8], "intensity": 3.2 } },
    "rim": { "op": "light", "params": { "kind": "point", "position": [-3, 2.2, -2], "intensity": 30, "color": "#6f9cff" } },
    "warm": { "op": "light", "params": { "kind": "point", "position": [3.5, -1, 2], "intensity": 14, "color": "#ffae66" } },
    "cam": { "op": "camera", "params": { "fov": 34, "target": [0, 0, 0],
      "position": { "keys": [ { "t": 0, "v": [0.6, 0.25, 10], "ease": "out_cubic" }, { "t": 5, "v": [-0.2, 0.1, 7.6] } ] } } },
    "scene": { "op": "render3d", "inputs": { "camera": "cam", "word": "word", "near1": "near1", "near2": "near2",
        "far1": "far1", "far2": "far2", "far3": "far3", "key": "key", "rim": "rim", "warm": "warm" },
      "params": { "ambient": 0.9, "sky": "#b9c6ff", "ground": "#3a2618", "aperture": 60 } },
    "shot": { "op": "over", "inputs": { "fg": "scene", "bg": "smoke" } },

    "bloomed": { "op": "bloom", "inputs": { "source": "shot" }, "params": { "intensity": 0.55, "threshold": 0.7, "radius": 40 } },
    "flared": { "op": "lens_flare", "inputs": { "source": "bloomed" }, "params": { "y": 250, "intensity": 0.75,
      "x": { "keys": [ { "t": 0, "v": 260, "ease": "in_out_sine" }, { "t": 5, "v": 1500 } ] } } },
    "leaked": { "op": "light_leak", "inputs": { "source": "flared" }, "params": { "intensity": 0.18, "speed": 0.6 } },

    "kicker": { "op": "text", "params": { "text": "THIS WINTER", "font": "ultrafast:wide", "weight": 500, "size": 34,
      "tracking": 18, "color": "#f2e6d6", "position": [960, 760], "align": "center", "valign": "middle",
      "stagger": 0.06, "stagger_order": "center",
      "glyph_opacity": { "keys": [ { "t": 1.6, "v": 0 }, { "t": 2.3, "v": 1 } ] },
      "glyph_offset": { "keys": [ { "t": 1.6, "v": [0, 26], "ease": "out_cubic" }, { "t": 2.4, "v": [0, 0] } ] } } },
    "titled": { "op": "over", "inputs": { "fg": "kicker", "bg": "leaked" } },

    "graded": { "op": "grade", "inputs": { "source": "titled" }, "params": { "look": 1, "amount": 0.35 } },
    "vig": { "op": "vignette", "inputs": { "source": "graded" } },
    "out": { "op": "grain", "inputs": { "source": "vig" }, "params": { "amount": 0.05 } }
  }
}
``` 

Read it top to bottom as a layer stack: a Fractal Noise solid in Screen mode, the 3D scene, then the effects in the order they apply. `uf export title.json title.mp4` renders it; `--codec prores` gives the ProRes file an editor wants.

## Keep After Effects, automate it.

If the templates already exist as After Effects projects, the cheapest change is to keep them and fill them from data. Every option here still renders with After Effects, so a designer keeps working in the app.

| `aerender` and scripts| nexrender| Templater| Plainly| Nexrender Cloud  
---|---|---|---|---|---  
What it is| After Effects' own command-line renderer, and ExtendScript (a JavaScript dialect) to change a project| an open-source job runner: a JSON job swaps footage, text and data into an .aep, then calls `aerender`| an After Effects extension that fills a rigged project from a spreadsheet or feed; the Bot edition renders from the command line| a hosted service that renders After Effects templates you upload, through an API| nexrender as a hosted service  
Needs After Effects| on every machine; render-only nodes run signed out, “without requiring serialization”| on every worker| yes, CS5 to 2027| to build the template; Plainly renders it| to build the template  
Renders on| Windows 11 24H2 or later, or macOS 15 on Apple silicon; no Linux| workers on Windows or macOS; the job server also runs on Linux| Windows or macOS| Plainly's cloud| Nexrender's cloud  
Price| After Effects is $22.99 a month on an annual plan, $34.49 month to month| free (MIT), plus your After Effects machines| Pro $225 a month, Bot $450 a month per machine; Rig $80 once| $69 a month for 50 output minutes, up to $649 for 600, billed monthly| €99 a month plus €0.18 a minute of processing time  
For agents| community MCP servers drive a running After Effects through ExtendScript; the most-starred has 921 stars. None renders without the app open| the job is plain JSON an agent can write| command line (Bot)| REST API| REST API; data from CSV or Google Sheets  
  
After Effects, Templater, Plainly and nexrender are trademarks of their owners. Third-party plug-ins on render nodes need their own licences, as Adobe's render-farm page points out. nexrender 1.63.4 (3 June 2026) has 1,867 stars; its README says it needs no After Effects licence on workers and, in its requirements, a “licensed/trial version”.

## Or replace the timeline.

Tools that don't need After Effects at all and can be driven from code or by an agent. None of them opens an .aep file, so templates are rebuilt, not imported.

| ultrafast| EffectCraft| Cavalry| Fusion Studio  
---|---|---|---|---  
What you make it in| a JSON document: nodes, keyframes and timing windows, usually written by a coding agent| an After Effects-style app: compositions, layers, keyframes, 308 effects, expressions, 3D cameras and lights| a procedural animation app, with JavaScript layers and scripts| a node-based compositor, with Lua and Python scripting  
Render without the app open| `uf export`, `uf batch` for one video per CSV row, `uf serve` for an HTTP API| `effectcraft-cli render`| no: “The CLI is not currently available in Cavalry 2.7 or above”| network render nodes, with no per-node fee  
Runs on| a Mac with Apple silicon, or Linux or WSL2 with a Vulkan GPU| macOS, Windows, Linux and the browser; macOS is the most tested| macOS and Windows| Linux, macOS on Apple silicon, Windows  
Price and licence| free; Apache-2.0 or MIT| free; Apache-2.0 (the README also says MIT)| free for individuals since April 2026; part of Canva; closed source| $295 once; the free DaVinci Resolve has a Fusion page  
For agents| a skill and 20 MCP tools: `check` before rendering, contact sheets, `review` of every frame| `effectcraft-cli mcp`, headless| a local MCP server, with Cavalry running| Lua and Python scripts  
Lottie| imports it (below)| imports and exports it| not checked| not checked  
Maturity| 0.2.1; first public release November 2026| first commit 1 October 2026; its README says it “isn't yet recommended for production client work”| version 2.8.1| version 21  
  
Cavalry, Fusion and EffectCraft are trademarks of their owners. EffectCraft has 9,174 stars and released 0.25.1 on 23 November 2026. For video from React, HTML or Python (Remotion, HyperFrames, Motion Canvas, Manim), see [Motion graphics with code](<https://ultrafast.mov/guides/motion-graphics-with-code/>) and [Remotion alternatives](<https://ultrafast.mov/alternatives/remotion/>).

## From the timeline to the document.

What an After Effects habit becomes in an ultrafast document, and what has no equivalent. Every op is in the [op reference](<https://ultrafast.mov/docs/ops/>) with its parameters.

In After Effects| In ultrafast  
---|---  
Composition, precomp| the document; a [component](<https://ultrafast.mov/docs/documents/#components>) is a small document used like an op  
Layer in and out points, time stretch, time remap| `timing` on any node: `in`, `out`, `offset`, `speed` (negative plays backwards) and `loop`  
Keyframes, easy ease, the graph editor| `keys` on any animated param, an `ease` per key (20 named curves including `hold` and `spring`, or a CSS `bezier`), and `cycle` or `pingpong` after the last key, like `loopOut()`  
Expressions: `wiggle()`, `time`| drivers: `wiggle`, `oscillate`, and `{"expr": "…"}`, a formula of `t` with maths functions, `noise()` and `wiggle()`. No JavaScript, and a formula can't read another layer  
Convert Audio to Keyframes| the `audio` driver, which follows a band of the soundtrack; `uf beats` lists beats and downbeats to cut on  
Track mattes| `mask`: `alpha`, `alpha_inverted`, `luma`, `luma_inverted`  
Blending modes| `blend`: the 16 W3C modes plus add, subtract and divide; `composite` for Porter-Duff operators  
Shape layers, Trim Paths, Repeater| `path` with `trim_start` and `trim_end`, dashes and path morphs; `repeater`  
Text animators and range selectors| `text` with `stagger` (forward, reverse, from the centre or random) and per-glyph offset, scale and opacity  
Glow, Drop Shadow, Stroke| `glow`, `bloom`, `drop_shadow`, `stroke_outline`  
Levels, Lumetri looks, LUTs| `levels`, `adjust`, `lut` (.cube files), `grade`, `tint`. No curves  
Fractal Noise, Turbulent Displace, Twirl, Wave Warp, Motion Tile| `noise`, `displace`, `twirl`, `wave`, `tile`; anything else as a Slang `shader`  
Corner Pin, Keylight| `corner_pin`, `chroma_key`  
Gaussian Blur, Camera Lens Blur| `blur`; depth of field from the 3D camera (`aperture`, `focus`)  
Motion blur switch| `motion_blur` in the format: samples and shutter, on everything that moves  
3D layers, cameras, lights; extruded type| `render3d` with `mesh` (extruded text and SVG paths, glTF models, primitives), `camera` and `light`, shadows, image-based light, fog  
Particle plugins, lens-flare plugins| `particles`, `swarm` (particles that form type), `fluid`; `lens_flare`, `light_leak`, `grain`, `aberration`, `film_look`  
Essential Graphics templates filled from data| a document plus a CSV: `uf batch` renders one video per row ([guide](<https://ultrafast.mov/guides/personalized-videos-from-csv/>))  
Render queue, Media Encoder, `aerender`| `uf export`: H.264, HEVC and AV1 MP4, ProRes up to 4444 XQ, transparent ProRes and WebM, GIF, PNG and EXR sequences  
Bodymovin export| a `lottie` node, or `uf import-lottie` for editable paths (below)  
Roto Brush, Content-Aware Fill, Mocha, the 3D Camera Tracker, Warp Stabilizer, Puppet| no equivalent. The only tracking is of faces, to reframe a talking-head clip (`clip_camera`)  
Third-party plugins and scripts| no plugin system; write a Slang `shader`, or keep After Effects  
  
## Bring the animation, add the look back.

An animation already built in After Effects can come over through Bodymovin, which exports it as Lottie JSON. ultrafast reads the Lottie as editable vector nodes, so the effects Lottie leaves behind can be put back as nodes.

[Video: Thick teal strokes sweep through a tall frame and settle into the word Lottie written as a glowing neon line, over a dark warm background](https://ultrafast.mov/media/guides/after-effects-lottie-glow.mp4) lottie-android's logo animation (Apache-2.0) with a glow, a light leak and grain added: 285 frames of 1080 × 1920, exported in 0.81 to 0.84 s.

```
"bg": { "op": "gradient", "params": { "kind": "radial",
  "stops": "0:#1a1530, 1:#06050a", "space": "srgb", "radius": 1300 } },
"logo": { "op": "lottie", "params": {
  "src": "lottie-logo-2.json", "size": [1080, 1920], "loop": false } },
"glowing": { "op": "glow", "inputs": { "source": "logo" },
  "params": { "intensity": 1.6, "radius": 28 } },
"shot": { "op": "over", "inputs": { "fg": "glowing", "bg": "bg" } },
"leaked": { "op": "light_leak", "inputs": { "source": "shot" },
  "params": { "intensity": 0.12, "speed": 0.8 } },
"out": { "op": "grain", "inputs": { "source": "leaked" },
  "params": { "amount": 0.05 } }
``` 

  * **What Bodymovin carries:** shape layers with trim paths and repeaters, solids, nulls, text with range selectors, images, precomps, masks (add and subtract), alpha mattes, blend modes, time remapping and expressions, as far as lottie-web plays them. Most effects from the Effect menu don't export; Fill, Stroke, Tint and Tritone do. Video, audio and image sequences don't.
  * **What ultrafast doesn't import:** layer effects (blurs, glows, fills), merge paths, time remapping and 3D layers, which are drawn flat. Of After Effects expressions, `loopOut`, `wiggle` and `time` run; the rest keep their keyframes. `uf import-lottie` prints a warning for each.
  * **How close it gets:** across 212 test files compared frame by frame with lottie-web, 177 were within 5 % of pixels at their worst frame. The method and every warning are in [Lottie to MP4](<https://ultrafast.mov/guides/lottie-to-mp4/#fidelity>).
  * `uf import-lottie anim.json --into doc.json` turns the file into a component whose paths, keyframes and colours can be edited like any other node.

## Which way to go.

Most teams that ask this have both kinds of work, and each side wins some of it.

### Keep After Effects when

  * Designers time the motion by eye in the graph editor. Editing numbers is slower for that, even with ultrafast's live player.
  * The work needs rotoscoping, Content-Aware Fill, camera tracking or third-party plug-ins.
  * Templates already exist as .aep projects, or clients send them. Fill them from data with nexrender, Templater or Plainly.
  * The edit lives in Premiere Pro and moves back and forth with Dynamic Link.

### Write it as code when

  * Renders run on Linux servers, in CI or in a container. After Effects has no Linux version.
  * You make many versions from data: names, prices, scores, languages. `uf batch` renders one video per row.
  * A coding agent makes the video and should check every frame before you see it.
  * You want the film in git as a file that diffs and reviews like code.
  * Render time matters: the title above exports in under a second on one GPU, and ten-second videos in the [benchmark](<https://ultrafast.mov/benchmarks/>) took 0.66 to 0.78 s.

ultrafast itself needs a GPU: a Mac with Apple silicon, or Linux or WSL2 with Vulkan. Hosted rendering is on a [waitlist](<https://ultrafast.mov/cloud/>), and there is no visual editor. Its player, `uf live`, shows edits on the next frame, but it isn't a timeline.

## Common questions.

Is there an open-source alternative to After Effects?

For motion graphics made from code, yes: ultrafast (Apache-2.0 or MIT) renders a JSON document on your GPU with 3D, track mattes, blend modes, glows, particles, motion blur and grades, and a coding agent can write the document. For an After Effects-style app with a timeline, EffectCraft is open source (Apache-2.0) and runs on macOS, Windows and Linux, though its README says it isn't yet recommended for production client work.

Can ultrafast open After Effects projects?

No. An .aep file needs After Effects. Either keep the project and render it with `aerender` or nexrender, or export the animation with Bodymovin and bring the Lottie file in, where it becomes editable vector nodes. Layer effects, merge paths, time remapping and 3D layers don't come across that way.

Can I render After Effects templates on Linux?

Not with After Effects itself: version 27.0 runs on Windows 11 and on macOS with Apple silicon, and `aerender` ships with it. nexrender's job server runs on Linux, but its workers need Windows or macOS. Hosted services such as Plainly and Nexrender Cloud render in their own cloud. ultrafast renders on Linux or WSL2 with a Vulkan GPU, but from its own documents, not .aep files.

Can an AI agent make After Effects-style motion graphics?

Yes. With the ultrafast skill or its MCP server, an agent such as Claude Code or Codex writes the document, checks it, looks at contact sheets, reviews every frame and exports. MCP servers for After Effects also exist; they drive a running After Effects window through ExtendScript on Windows or macOS.

How fast does it render?

The 5-second 1080p title on this page exported to MP4 in 0.70 to 0.73 s on one RTX 5090 with ultrafast 0.2.1, and to ProRes 422 HQ in 1.62 to 1.65 s. In the published benchmark, three 10-second videos took 0.66 to 0.78 s; Remotion took 3.1 to 8.6 times as long and HyperFrames 4.6 to 5.7 times.

## Sources.

All read on 24 November 2026.

  * **After Effects:** [plans](<https://www.adobe.com/products/aftereffects/plans.html>) (prices for the United States, subscription only), [system requirements](<https://helpx.adobe.com/after-effects/desktop/get-started/technical-requirements/system-requirements.html>) (version 27.0: Windows 11 24H2, macOS 15 on Apple silicon), [automated and network rendering](<https://helpx.adobe.com/after-effects/desktop/render-and-export/automate-rendering/automated-rendering-network-rendering.html>) (`aerender`, render-only nodes, plug-in licences), [scripts](<https://helpx.adobe.com/after-effects/desktop/automate-in-after-effects/automate-animation/scripts.html>) (ExtendScript).
  * **nexrender:** [repository](<https://github.com/inlife/nexrender>) (licence, requirements, jobs, platforms), [Nexrender Cloud pricing](<https://www.nexrender.com/pricing>). **Templater:** [downloads](<https://dataclay.com/downloads/>) (After Effects versions, platforms), [fee schedule, Q4 2025](<https://assets.dataclay.com/dataclay-templater-licensing-fee-schedule-Q42025.pdf>). **Plainly:** [pricing](<https://www.plainlyvideos.com/pricing>), [Renders API](<https://help.plainlyvideos.com/docs/developer-guide/renders-api>).
  * **After Effects MCP servers:** [Dakkshin/after-effects-mcp](<https://github.com/Dakkshin/after-effects-mcp>), [JUNKDOGE-JOE/after-effects-mcp](<https://github.com/JUNKDOGE-JOE/after-effects-mcp>), [solomondivyananth/aftereffects-mcp](<https://github.com/solomondivyananth/aftereffects-mcp>).
  * **EffectCraft:** [repository](<https://github.com/storytold/effectcraft>) (features, CLI, MCP, platforms, maturity, project format). **Cavalry:** [home](<https://cavalry.studio/>) (free for individuals), [requirements](<https://cavalry.studio/docs/getting-started/requirements/>), [scripting](<https://cavalry.studio/docs/tech-info/scripting/scripting-getting-started/>), [CLI (legacy)](<https://cavalry.studio/docs/applications/cavalry-cli/>), [MCP](<https://cavalry.studio/docs/tips/ai-automation-with-claude/>). **Fusion Studio:** [product page](<https://www.blackmagicdesign.com/products/fusion>) (price, scripting, render nodes), [21.2 readme](<https://www.blackmagicdesign.com/us/support/content/readme/b9f8f52968a645a7afd796524d5afb03>) (platforms).
  * **Lottie:** [supported features](<https://github.com/airbnb/lottie/blob/master/supported-features.md>), [LottieFiles' table](<https://lottiefiles.com/supported-features>), [lottie-web](<https://github.com/airbnb/lottie-web>). The sample animation is from [lottie-android](<https://github.com/airbnb/lottie-android>) (Apache-2.0).
  * **ultrafast:** [repository](<https://github.com/ultrafastmov/ultrafast>), [ops](<https://ultrafast.mov/docs/ops/>), [the document](<https://ultrafast.mov/docs/documents/>), [Lottie to MP4](<https://ultrafast.mov/guides/lottie-to-mp4/>), [benchmarks](<https://ultrafast.mov/benchmarks/>). The times on this page, 0.70 to 1.65 s, were measured with ultrafast 0.2.1 on one RTX 5090 workstation, warm, with no other render running.

## Render one yourself.

Install the engine and export the title above on your own GPU.

`curl -fsSL https://ultrafast.mov/install.sh | sh` [Read the quickstart](<https://ultrafast.mov/docs/>)

Want it hosted? [Join the ultrafast Cloud waitlist](<https://ultrafast.mov/cloud/>).
