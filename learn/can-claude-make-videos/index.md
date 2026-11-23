# Can Claude make videos? Every way, compared · ultrafast

> Yes, as animation built from code. Claude Motion on Team and Enterprise, or Claude Code with ultrafast, Remotion or HyperFrames on any paid plan: plans, renderers, costs and limits.

URL: https://ultrafast.mov/learn/can-claude-make-videos/

# Can Claude make videos?

Yes, as animation written in code, not as generated footage. Claude Motion makes short animations inside Claude on Team and Enterprise plans. On Pro, Max or Ultra, Claude Code writes the video for an engine such as ultrafast, Remotion or HyperFrames, which renders the MP4.

Updated 24 November 2026. ultrafast wrote this page and is one of the engines on it. Facts about Claude are from Anthropic's help, launch and pricing pages; sources are at the end.

## How Claude makes a video.

Claude has no video model. In Anthropic's words, Claude Motion “doesn't use a video generation model, so it doesn't create realistic footage or people.” The same holds for every route on this page.

  1. ### Claude writes it

Code or a document describes every layer: the text, shapes, charts, images and footage, and when each one moves. Change a word or a timing and the rest stays as it was.

  2. ### A renderer draws it

Something turns that description into frames. Claude Motion does this inside Claude. Remotion and HyperFrames load a web page in headless Chrome and capture it. ultrafast draws each frame on the GPU, with no browser.

  3. ### An encoder writes the file

The frames become an MP4 you can download, post or cut into an edit. Engines that run on your computer can also write transparent video, GIFs and image sequences.

## Every route, side by side.

Plans from Anthropic's pricing page, checked 24 November 2026. Claude Code comes with Pro, Max and Ultra, or runs on an API key.

Route| Claude plan| Claude writes| Where it renders| What you get| Cost beyond Claude  
---|---|---|---|---|---  
Claude Motion| Team and Enterprise, in beta; off on Enterprise until an owner turns it on| animation code, in an artifact| inside Claude| an MP4 export or a share link; edit by asking or in the editor| none; it counts toward the plan's usage limits  
Claude Code + [ultrafast](<https://github.com/ultrafastmov/ultrafast>)| Pro, Max, Ultra or an API key| one JSON document, checked before it renders| your GPU: Metal on an Apple silicon Mac, Vulkan on Linux; no browser| MP4 (H.264, HEVC, AV1), ProRes, transparent WebM, GIF, PNG and EXR sequences| none; Apache-2.0 or MIT  
Claude Code + [Remotion](<https://www.remotion.dev/docs/ai/coding-agents>)| Pro, Max, Ultra or an API key| React components| headless Chrome on your computer, or Remotion Lambda| MP4 and other formats, an embeddable web player| free for individuals and companies of up to 3 people; a company licence from 4  
Claude Code + [HyperFrames](<https://hyperframes.heygen.com/>)| Pro, Max, Ultra or an API key| HTML, CSS and animation code| headless Chrome on your computer| MP4, WebM or MOV| none; Apache-2.0  
Claude chat + the HyperFrames connector| any, including Free, according to HyperFrames| a video, through the connector's tools| HeyGen's cloud, on your HeyGen account| an MP4; HyperFrames says videos are planned at up to 90 seconds| a free HeyGen account  
Claude chat + the ultrafast connector| Not available yet. It comes with [ultrafast Cloud](<https://ultrafast.mov/cloud/>), which has a waitlist. Until then, use Claude Code.  
  
Product names belong to their owners. HyperFrames' connector details are from its own page and weren't tested here.

## Which one to use.

Pick by where you already work and what the video has to hold.

### Use Claude Motion when

  * Your organisation is on a Team or Enterprise plan and has it turned on.
  * You want an animated chart, an explainer or a walkthrough built from a report, data or images you attach.
  * You'd rather not install anything. To take an animation further, Anthropic names Adobe, Descript, HeyGen, Higgsfield, invideo, Luma AI and Runway.

### Use Remotion when

  * Your team builds in React and wants to reuse its components.
  * You need a player embedded in a web page.
  * The licence fits: 3 people or fewer, or a company licence.

### Use HyperFrames when

  * You write HTML, CSS and GSAP, or have compositions in them already.
  * You want a connector in the ordinary Claude chat today, or HeyGen's avatars, voices and Studio app.

### Use ultrafast when

  * You want the render on your own GPU, with no browser in it.
  * The video mixes your footage with type, 3D, particles, shaders or a Lottie file.
  * Claude should check and review its own frames before you watch.
  * You need one video per row of a spreadsheet, or a licence that doesn't count your headcount.

## Make one with Claude Code.

With ultrafast: install the engine, add the plugin, then ask. The plugin brings the ultrafast skill, which teaches Claude the document and the review loop, and the MCP server with 20 tools.

```
curl -fsSL https://ultrafast.mov/install.sh | sh          # the engine, as uf
uf info                                                   # checks the GPU
claude plugin marketplace add ultrafastmov/ultrafast
claude plugin install ultrafast@ultrafast                 # the skill and the MCP server
claude "Make a 10-second vertical teaser for a pottery class from photo.jpg. Review it before you export."
``` 

  1. ### It writes and looks

Claude writes one JSON document and runs `check`, which catches mistakes before anything renders. Single frames and contact sheets come back to it as images, so it sees the video before you do.

  2. ### It reviews

`review` reads every frame for text that is clipped, unreadable, too small or gone too fast, and for flashing. The [pottery teaser's](<https://ultrafast.mov/mcp/>) first draft had 8 findings; the second had none.

  3. ### It exports

A 10-second export took under a second on an RTX 5090 in the [benchmark](<https://ultrafast.mov/benchmarks/>). Writing the same short took about a third fewer tokens than in Remotion ([token count](<https://ultrafast.mov/benchmarks/#tokens>)).

Codex, Cursor and Gemini CLI work the same way: [setup for each](<https://ultrafast.mov/integrations/>). Other ways to install are in the [quickstart](<https://ultrafast.mov/docs/>).

### Where ultrafast doesn't fit

  * It renders on a GPU: a Mac with Apple silicon, or Linux with a Vulkan GPU. Without one, the Docker image renders on the CPU, much more slowly.
  * There's no connector for the Claude chat yet, so you need Claude Code or another coding agent.
  * No HTML or CSS. A video is a JSON document, not a web page.
  * It is new: the first release came out on 21 November 2026.

## What Claude can't do.

### Film people or places

Every route here builds the picture from text, shapes, charts and your own images and footage. For generated footage or people, use a video generation model.

### Motion on a personal plan

Anthropic's pricing table lists Claude Motion for none of Free, Pro, Max or Ultra as of 24 November 2026. Those plans reach video through Claude Code or a connector.

### Render with nothing behind it

In Claude Code, the video only becomes a file when an engine is installed to render it. Without one, Claude can write the code but has nothing to turn it into frames.

## Common questions.

Can Claude make videos?

Yes, as animation built from code. Claude Motion makes short animations inside Claude on Team and Enterprise plans and exports them as MP4. On any plan with Claude Code, Claude writes the video for an engine such as ultrafast, Remotion or HyperFrames, which renders it on your computer. None of them generates realistic footage or people.

Is Claude Motion available on Pro or Max?

No. Anthropic's pricing page lists Claude Motion, in beta, for Team and Enterprise plans only, and not for Free, Pro, Max or Ultra (checked 24 November 2026). On those plans, Claude Code with a video engine makes the same kind of animated video.

Can Claude Code make videos?

Yes, with a video engine installed. Claude Code writes the video as code or a document, and the engine renders it: ultrafast on your GPU, Remotion and HyperFrames in headless Chrome. With the ultrafast plugin (`claude plugin install ultrafast@ultrafast`), Claude also checks the document, looks at frames and reviews the whole video before it exports.

Can Claude use my own footage?

With an engine on your computer, yes: ultrafast takes video, images, SVG, Lottie, glTF geometry and audio files you point it to. Anthropic's Claude Motion help page talks about attaching reports, data and images.

Is it free?

ultrafast and HyperFrames are free and open source; Remotion is free for individuals and companies of up to 3 people and needs a company licence from 4. Claude Code itself needs a paid Claude plan or an API key, and Claude Motion counts toward a Team or Enterprise plan's usage.

## Sources.

All read on 24 November 2026.

  * **Anthropic:** [Get started with Claude Motion](<https://support.claude.com/en/articles/17454997-get-started-with-claude-motion>) (plans, how it works, no video generation model, MP4 export, usage), [the launch post of 8 October 2026](<https://claude.com/resources/articles/dashboards-and-motion>) (built for explaining your own work; the tools to take it further), [pricing](<https://claude.com/pricing>) (which plans include Claude Motion and Claude Code).
  * **Remotion:** [prompting videos with coding agents](<https://www.remotion.dev/docs/ai/coding-agents>), [agent skills](<https://www.remotion.dev/docs/ai/skills>), [licence pricing](<https://www.remotion.dev/docs/license/pricing>).
  * **HyperFrames:** [Can Claude make videos?](<https://hyperframes.heygen.com/blog/can-claude-make-videos>) (the connector, its plans and its 90-second plan, in HyperFrames' words), [deterministic rendering](<https://hyperframes.heygen.com/concepts/determinism>) (headless Chrome).
  * **ultrafast:** [repository](<https://github.com/ultrafastmov/ultrafast>), [integrations](<https://ultrafast.mov/integrations/>), [MCP server](<https://ultrafast.mov/mcp/>), [benchmark and token count](<https://ultrafast.mov/benchmarks/>), [Remotion alternatives](<https://ultrafast.mov/alternatives/remotion/>), [HyperFrames alternatives](<https://ultrafast.mov/alternatives/hyperframes/>).

## Make one with Claude Code.

Install the engine, add the plugin, and ask for a video.

`curl -fsSL https://ultrafast.mov/install.sh | sh` [Read the quickstart](<https://ultrafast.mov/docs/>)

Want it hosted? [Join the ultrafast Cloud waitlist](<https://ultrafast.mov/cloud/>).
