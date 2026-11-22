# ultrafast vs Remotion · A Remotion alternative on the GPU

> Remotion renders React in headless Chrome. ultrafast renders a JSON document on the GPU: faster renders, no per-render licence fee, and tools that let agents see their work.

URL: https://ultrafast.mov/compare/remotion/

Compare

# ultrafast vs Remotion.

Remotion renders React components in headless Chrome, one screenshot per frame. ultrafast renders a JSON document on the GPU. Both make video from code; they differ in speed, licence and what an agent can see.

At a glance

## Side by side.

| ultrafast| Remotion  
---|---|---  
How a frame is made| GPU kernels compiled from the document; encoded on the same GPU with no readback| a React tree laid out in Chrome Headless Shell, screenshotted, encoded with FFmpeg  
You write| one JSON document, checked before it renders| a React and TypeScript project  
Output tokens for a 10 s short| about 1,234, measured| about 1,868, most of it web code  
Speed| 894 fps at 1080p with motion blur on one GPU; 11.6 s of 1080×1920 in about 2.2 s on one L4| an 80 s video in 15 s on Lambda across up to 200 functions; a 1-minute example in 19 s  
Licence| Apache-2.0 or MIT, for everyone| source-available; a company licence from 4 people, counting all staff  
Price to render| free on your GPU| $0.01 per render ($100/mo minimum) or $25 per seat per month, plus your AWS bill  
Hosted rendering| ultrafast Cloud is coming soon ([waitlist](<https://ultrafast.mov/cloud/>)); `uf serve` on your own GPU today| none; Lambda in your own AWS account  
For agents| 20 MCP tools (local and remote), a skill, ChatGPT and Claude apps coming soon; frames come back as images| 13 Agent Skills, plugins for 5 coding agents, Studio WebMCP; the hosted MCP closed on 26 October 2026  
Review of the result| `review` reads every frame: unreadable, clipped, overlapping or too-brief text, text under app buttons, flashing| no built-in review  
Effects| 3D with image-based light and glass, raymarching, particles, fluid and feedback sims, Slang shaders, 19 blend modes| Three.js through React Three Fiber, shaders, Lottie, motion blur  
Export| H.264, HEVC and AV1 MP4; ProRes proxy to 4444 XQ; transparent ProRes 4444 and VP9 WebM; GIF; PNG and EXR sequences; sound alone. Any size, rendered sharp, and any frame rate; four quality levels from draft to master| H.264, H.265, VP8, VP9, AV1, ProRes, GIF, transparent video, image sequences, sound alone; `--scale`; CRF and bitrate, no quality levels  
  
Speed

## One GPU instead of 200 functions.

Remotion gets its speed by splitting a video across many Lambda functions. ultrafast renders the whole video on one GPU, faster than playback, so a short is done before a cold function starts.

ultrafast, measured

1080p, 6-sample blur, RTX 5090
    894 fps
10 s hero, same GPU
    0.34 s
11.6 s of 1080×1920, one L4
    2.2 s
10 s vertical teaser, 3D
    1.68 s
16 s launch film, 3D
    4.88 s

On the same RTX 5090 workstation, three 10-second videos took Remotion 2.32 to 6.69 s at the fastest setting found (2.6 to 6.8 times ultrafast's time) and 4.45 to 8.53 s with its default command ([benchmark](<https://github.com/ultrafastmov/benchmarks>)). Remotion's published Lambda figures: an 80 s video in 15 s; a 1-minute render in 19 s for $0.017 of AWS compute.

Tokens

## A quarter to a third fewer tokens.

Output tokens an agent writes for a 10-second vertical short: footage, a title, three lines of detail, captions timed to each word, a grade and grain, counted with tiktoken (o200k_base) over the files each tool needs: the ultrafast document; Remotion's composition, config and CLI commands; HyperFrames' HTML and its grading command. Counting only what is typed after each tool's own scaffold: ultrafast 1,218, HyperFrames 1,500, Remotion 1,660. Measured 22 November 2026.

  1. ultrafast **1,234**
  2. Remotion **1,868**

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

Remotion

```
import {AbsoluteFill, Easing, interpolate, useCurrentFrame,
  useVideoConfig} from 'remotion';
import {loadFont} from '@remotion/google-fonts/Fraunces';

const {fontFamily} = loadFont('normal', {weights: ['300']});
const TEXT = 'Spin something new.';
const clamp = {
  extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
} as const;

export const Title: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  let n = 0;
  return (
    <AbsoluteFill>
      <h1 style={{
        position: 'absolute', left: 80, top: 222, width: 880,
        margin: 0, fontFamily, fontWeight: 300, fontSize: 176,
        lineHeight: 0.9, letterSpacing: -3, color: '#f1e8dc',
      }}>
        {TEXT.split(' ').map((word, w) => (
          <span key={w} style={{display: 'inline-block'}}>
            {[...word, '\u00a0'].map((ch, c) => {
              const t = frame / fps - 0.7 - 0.03 * n++;
              const opacity = interpolate(t, [0, 0.8], [0, 1], {
                ...clamp, easing: Easing.inOut(Easing.sin),
              });
              const y = interpolate(t, [0, 1.1], [56, 0], {
                ...clamp, easing: Easing.bezier(0.16, 1, 0.3, 1),
              });
              return (
                <span key={c} style={{
                  display: 'inline-block', opacity,
                  transform: `translateY(${y}px)`,
                }}>{ch}</span>
              );
            })}
          </span>
        ))}
      </h1>
    </AbsoluteFill>
  );
};
``` 

Grain, a grade and word-timed captions are built in on both sides now: `@remotion/effects` and a captions Element that Remotion's CLI installs, against one node each in ultrafast. The gap is mostly the React around them.

Licence and cost

## No company licence.

Remotion is free for individuals and organisations of up to 3 people. At 4, counting everyone in the company whether they touch video or not, it needs a company licence. ultrafast is Apache-2.0 or MIT for everyone. Tokens at $20 per million output tokens.

10,000 ten-second shorts a month| to write them| to render them  
---|---|---  
ultrafast on your GPUs| about $247 in output tokens| $0 in licences  
Remotion, Automators licence| about $374 in output tokens| $100 in render fees, plus Lambda compute in your AWS account  
  
For agents

## An agent that can see what it made.

A Remotion agent writes React and renders it; a person finds out what went wrong. An ultrafast agent checks the document, looks at contact sheets, and fixes what `review` reports before you watch.

### Write

JSON with a published schema and `uf ops` for every param. No project, no build, no `node_modules`.

### Check and look

`check` before rendering; frames and contact sheets returned as images; `inspect` names the node behind a pixel.

### Review and fix

`review` reads every frame for unreadable, clipped or too-brief text and flashing. The agent edits one node and renders again in under a second.

### Choose ultrafast when

  * An agent makes the videos and should review them.
  * You render often enough that per-render fees, Lambda bills and model tokens add up.
  * You need 3D, simulation or shader work alongside captions and footage.
  * Your company has more than 3 people and wants a permissive licence.

### Choose Remotion when

  * Your video is built from React components you already have.
  * You need Remotion's embeddable web Player.
  * You want a mature React ecosystem: in development since 2020, with about 75,000 GitHub stars.

If neither fits, the roundup of [open-source Remotion alternatives](<https://ultrafast.mov/alternatives/remotion/>) covers seven more tools and when each one is the better choice.

Questions

## Common questions.

Is ultrafast free for companies?

Yes, at any size. The engine is Apache-2.0 or MIT. Remotion requires a company licence once an organisation has 4 or more people: $0.01 per render with a $100 monthly minimum, or $25 per seat per month.

Can ultrafast render my Remotion project?

Not directly: it doesn't run React. Ask your agent to rewrite the composition as an ultrafast document, or run `uf reconstruct` on a finished render to get an editable draft.

Does ultrafast need a GPU?

A GPU is the fast path: a Mac with Apple silicon or a Vulkan GPU. No GPU? The Docker image renders on the CPU through Mesa's software Vulkan driver: frames in under a second, and a 6-second 1080×1920 export in about 17 seconds on 4 cores of a fast desktop CPU. Heavy 3D or particle work is much slower. ultrafast Cloud, which renders on hosted GPUs, is coming soon ([waitlist](<https://ultrafast.mov/cloud/>)).

Does ultrafast have an embeddable web player like Remotion's?

No. ultrafast's live player is a desktop window for authoring. For the web, export an MP4.

How many tokens does an agent spend on a Remotion video?

Measured on a 10-second vertical short (footage, a title, three lines, word-timed captions, a grade and grain): 1,868 output tokens for the composition, config and CLI commands. The same short as an ultrafast document is 1,234 (tiktoken o200k_base). Counting only what is typed after each tool's scaffold: 1,660 and 1,218.

Remotion facts from its docs, checked 21 November 2026: [pricing](<https://www.remotion.dev/docs/license/pricing>), [team size](<https://www.remotion.dev/docs/terms#TeamSize>), [Lambda](<https://www.remotion.dev/lambda>), [cost example](<https://www.remotion.dev/docs/lambda/cost-example>), [MCP](<https://www.remotion.dev/docs/ai/mcp>), [skills](<https://www.remotion.dev/docs/ai/skills>), [plugins](<https://www.remotion.dev/docs/ai/plugins>). Remotion is a trademark of its owner.

## Make one and time it.

Install the engine and time a render on your own GPU.

`curl -fsSL https://ultrafast.mov/install.sh | sh` [Read the quickstart](<https://ultrafast.mov/docs/>)

Want it hosted? [Join the ultrafast Cloud waitlist](<https://ultrafast.mov/cloud/>).
