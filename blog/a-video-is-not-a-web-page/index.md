# A video is not a web page · ultrafast blog

> Remotion and HyperFrames make video by screenshotting a web page, frame after frame. Why that design is slow and fragile, what the web still gets right, and what an engine made for video does instead.

URL: https://ultrafast.mov/blog/a-video-is-not-a-web-page/

Blog

# A video is not a web page

Remotion and HyperFrames make video by screenshotting a web page, frame after frame. Why that design is slow and fragile, what the web still gets right, and what an engine made for video does instead.

2026-11-238 min read

Every browser-based video tool has the same loop at its heart. Open a page. Set the clock to frame 0 and take a screenshot. Set it to frame 1 and take another. Three hundred screenshots later, hand the pile to FFmpeg and call it a video.

It's a clever hack, and it works. Remotion has been doing it for years, and HyperFrames, from HeyGen, has more than 87,000 GitHub stars for doing it with plain HTML. Both are good tools made by people who know video. But that loop explains nearly everything that goes wrong when you make video with them, and most of it traces back to one fact. A browser was made to show a document to a person. A video renderer has no person to show it to.

## A browser runs on the wall clock

A web page lives in real time. Animations are driven by `requestAnimationFrame`, CSS transitions follow the system clock, and a video element plays at whatever rate its decoder can keep up with. Fonts and images arrive when the network gets round to them. That is right for a page someone is looking at. It is wrong for a renderer that needs frame 212 to look exactly like frame 212, every time, on every machine.

So every browser renderer has to fake time. HyperFrames' docs put it plainly: "No wall clock. No `Date.now()`, no `requestAnimationFrame`, no system timers." Remotion asks you to write every component as a pure function of its frame number, and its own page on flickering says what happens when you don't: tabs "don't share state and animations that run independent of `useCurrentFrame()` will break." The same page warns that if the renderer doesn't wait for an asset, it "will take a screenshot of a loading state."

Footage is the hardest case. The browser's video element was built to play, and Remotion's own table marks it frame-perfect "not guaranteed". So Remotion routes around it. One component pulls each frame out with FFmpeg, outside the browser, and paints it as an image. The newer one decodes with WebCodecs into a canvas. Both work. They exist because the browser's own video element can't be trusted to land on a frame.

Even with all of that, the result can depend on the machine. HyperFrames' determinism page says fonts and Chrome versions differ between computers, so a local render can move by a pixel between machines. Its fix is to run the render in Docker, so the browser and the fonts are pinned too.

## Every frame is a screenshot

Follow one frame through a browser renderer. The page is laid out and painted. The compositor draws it, on the CPU unless you have turned the GPU on, because headless Chromium disables the GPU by default (Remotion's docs call it "a significant slowdown"). The pixels are captured through the Chrome DevTools Protocol, encoded as an image, handed to Node, and decoded again by FFmpeg before the video encoder ever sees them. None of those steps is slow on its own. Thirty times a second, for every second of video, they add up.

The usual way out is more browsers. Remotion renders in parallel tabs, and on AWS Lambda it fans one render out across as many as 200 functions, none of which has a GPU. HyperFrames runs up to 24 workers, each its own Chrome of about 256 MB. That buys speed with memory and machines, and it multiplies the overhead along with the work. In the footage test below, Remotion decodes the clip again in every tab, so adding tabs made it slower: 8.6 s at 8 tabs, 21.7 s at 32.

Here is what the difference looks like on one machine, an RTX 5090 workstation, timed from the render command to a finished MP4. Three 10-second videos took ultrafast 0.66 to 0.78 s with its 0.2.0 release (0.85 to 0.98 s with 0.1.1, when this post went up). Remotion took 2.25 to 6.69 s at the fastest of every setting tried, and HyperFrames 3.31 to 4.46 s. Most of ultrafast's time was process start-up; drawing and encoding the 300 frames took 0.22 to 0.36 s of it. The [benchmark](<https://ultrafast.mov/benchmarks/>) has every run and every configuration, with frames from all three tools side by side, and it says plainly where ultrafast does worse.

![The same six moments of a 10-second clip with word-timed captions over NASA footage of the Moon, rendered by ultrafast, Remotion and HyperFrames, one row each. The three rows match.](https://ultrafast.mov/img/bench/footage.webp) _The footage test from the benchmark: the same frames from all three tools. The pictures match. The times don't._

## The pixels are slightly wrong

Speed is the part people notice. The part they feel without naming it is in the pixels.

Browsers composite on gamma-encoded sRGB values, because the web always has. Film and VFX pipelines composite in linear light, because that is how light adds up. The gap shows where motion graphics live: a glow, a soft shadow, the anti-aliased edge of white type over a red field. Blended in sRGB, those transitions come out muddy and a little dark in the middle. Nobody points at it. The frame just looks cheaper than it should.

Motion is worse. A browser has no shutter. Each screenshot is an instant, so anything that moves fast strobes across the frames. A real camera smears motion across the time its shutter is open, and that smear is a large part of why filmed motion feels smooth at 24 or 30 frames a second. Remotion's motion blur does the only thing a browser allows: it "samples frames from before and after the current time and blends them together", and every extra sample is more rendering work. HyperFrames' determinism page names motion blur as the exception to its pixel-stability promise.

Then there is the plumbing every video player depends on. Pixels are stored as Y'CbCr rather than RGB, with a BT.709 matrix and a limited range, and the file carries colour tags that tell the player how to decode it. It is easy to get wrong. ultrafast's own 0.1.1 wrote H.264 with no colour tags, so FFmpeg-based players showed its colours slightly off. 0.2.0 tags every file. A video engine has to own that whole path, because nobody else will.

## What the web gets right

None of this makes HTML a bad way to describe a video. In some ways it's the best one there is.

Text on the web has decades of work behind it, down to line breaking in scripts most engines never test. Every developer already knows CSS. Models have read an enormous amount of HTML, which is a big reason agents write decent first drafts in HyperFrames. And if your video really is a web page that moves, like a walkthrough of your own app or a chart lifted from a React dashboard, then rendering the actual page is the honest choice.

The trouble starts when the page stops being the point. A title over footage is not a document. Neither is a lens turning in studio light, a sea at golden hour or a podcast clip with word-timed captions. Each of those is light changing over time, and a browser renderer has to smuggle it through a document format, one screenshot at a time, to get it into a file.

## Made for video, from the first line

ultrafast starts from the other end. There is no browser in it, and no DOM. The engine talks to the GPU directly, through Metal on a Mac and Vulkan on Linux.

![A camera lens that doesn't exist, lit like a studio product shot, with its knurled focus ring catching a strip of light.](https://ultrafast.mov/media/examples/product.jpg) _A lens ad from the[examples](<https://ultrafast.mov/examples/>): one JSON document, raymarched on the GPU with real depth of field and motion blur. Nothing in it was filmed._

A frame is a function of time. Every parameter of every node is either a value or a curve evaluated at `t`, so frame 212 has exactly one answer, and any frame can be drawn on its own, in any order. The exceptions are simulations like fluid and feedback, which step forward one frame at a time and replay exactly on export. There is no clock to fake and nothing to wait for.

The GPU owns the frame from the first pixel to the encoder. On Linux with an NVIDIA card, the last pass writes each frame into the hardware encoder's buffer where it already sits, and on a Mac it goes straight into VideoToolbox. For H.264 and HEVC without alpha, that means no screenshots and no copies back to the CPU at all.

Compositing happens in linear light, in half-float precision, and colour is converted once at each edge: decoded to linear when footage comes in, encoded to BT.709 when the file goes out. Type and vector paths are rasterized on the GPU with exact area coverage, so a word scaled up for a slow push stays sharp instead of being resampled. Motion blur is a setting in the document's format, with a shutter, so a whole film can have it on.

A video is one JSON document: a graph of nodes an agent writes and edits. It can be checked for mistakes without rendering anything, and the agent can pull any frame, or a contact sheet of many, as an image, look at what it made and fix it before exporting. A browser tool can show an agent screenshots too. The difference is cost. When a frame takes a fraction of a second, looking at your own work stops being a luxury and becomes the normal loop. The same 10-second short took 1,234 tokens to write as an ultrafast document, against 1,680 for the HyperFrames HTML and 1,868 for the Remotion composition.

## Where it loses

It needs a GPU: Apple silicon, or Linux with a Vulkan driver. Without one, the Docker image falls back to a software renderer that is much slower, and the browser tools, which need no GPU at all, look a lot better. Its files come out bigger at the same nominal quality setting. And there is no CSS, so if what you want on screen is a real web page, a browser is still the right tool for the job.

## Try it on your own machine

The benchmark is one script in a [public repository](<https://github.com/ultrafastmov/benchmarks>), and the numbers above come with every run and every frame. Run it on your own hardware. If you know Remotion or HyperFrames better than the benchmark script does and can make them faster, open a pull request.

To try ultrafast, install it with `curl -fsSL https://ultrafast.mov/install.sh | sh`, or tell your agent: "Go to ultrafast.mov and make a 10-second title over this clip." It writes the document, looks at the frames and exports the file.

## Make your own.

Install ultrafast, connect your agent, and give it a brief.

`curl -fsSL https://ultrafast.mov/install.sh | sh` [Read the quickstart](<https://ultrafast.mov/docs/>)

Want it hosted? [Join the ultrafast Cloud waitlist](<https://ultrafast.mov/cloud/>).
