# Make a video with Antigravity CLI: a real session · ultrafast

> Make videos with Antigravity CLI (agy) and ultrafast: install the plugin, the permission rule agy -p needs, the exact prompt, every tool call, what the review and the frames caught, a vertical copy, and the time and tokens it took.

URL: https://ultrafast.mov/guides/antigravity/

Docs

# Make a video with Antigravity CLI.

Antigravity CLI, Google's coding agent for the terminal, can make real videos when it has a video engine to write for. Here is one session from start to finish: a 12-second release video for a command-line tool, from the prompt to the MP4, with every tool call it made, what the review and the contact sheets caught, a vertical copy after, how long each part took, and the setting `agy -p` needs.

## Start

  * [Quickstart](<https://ultrafast.mov/docs/>)
  * [The document](<https://ultrafast.mov/docs/documents/>)
  * [Templates](<https://ultrafast.mov/templates/>)

## Guides

  * [Render video from JSON](<https://ultrafast.mov/guides/render-video-from-json/>)
  * [Personalized videos from a CSV](<https://ultrafast.mov/guides/personalized-videos-from-csv/>)
  * [Videos from n8n](<https://ultrafast.mov/guides/n8n-video-automation/>)
  * [Make a video with Claude Code](<https://ultrafast.mov/guides/claude-code/>)
  * [Make a video with Codex](<https://ultrafast.mov/guides/codex/>)
  * [Make a video with Antigravity CLI](<https://ultrafast.mov/guides/antigravity/>)
  * [Lottie to MP4, WebM or ProRes](<https://ultrafast.mov/guides/lottie-to-mp4/>)
  * [Animated captions from Whisper or SRT](<https://ultrafast.mov/guides/animated-captions/>)
  * [Motion graphics with code](<https://ultrafast.mov/guides/motion-graphics-with-code/>)
  * [Animated chart videos from a CSV](<https://ultrafast.mov/guides/animated-chart-video/>)
  * [Animate an SVG logo](<https://ultrafast.mov/guides/animate-svg-logo/>)
  * [A film of a GitHub repo](<https://ultrafast.mov/guides/github-repo-video/>)

## Learn

  * [Video rendering without a browser](<https://ultrafast.mov/learn/gpu-video-rendering/>)

## Reference

  * [Ops](<https://ultrafast.mov/docs/ops/>)
  * [CLI](<https://ultrafast.mov/docs/cli/>)
  * [MCP server](<https://ultrafast.mov/docs/mcp/>)
  * [HTTP API](<https://ultrafast.mov/docs/api/>)

## For agents

  * [llms.txt](<https://ultrafast.mov/llms.txt>)
  * [This page as Markdown](<https://ultrafast.mov/guides/antigravity/index.md>)

[Video: A 12-second 16:9 video in monospace type on a dark navy background: gullwing, 2.0 is out, beside a git branch diagram whose two stale branches are pruned, then three slides, watch mode, plugins and a Windows build, each with a terminal typing its commands, ending on gullwing 2.0 is out](https://ultrafast.mov/media/guides/agy-gullwing.mp4) Made by Antigravity CLI with ultrafast from the two prompts on this page, and encoded again for the web from the documents it wrote. **On this page**

  1. Install
  2. Running it with agy -p
  3. The prompt
  4. What Antigravity did
  5. Changing it by asking
  6. Time and tokens
  7. If it doesn't work
  8. Gemini CLI
  9. Remotion, HyperFrames and other agents
  10. Questions

## Install

Two parts: `uf`, the engine that renders on your GPU, and the ultrafast plugin, which gives Antigravity the ultrafast skill (how to write and check a video document) and the MCP server, `uf mcp`, with the tools it calls.

```
curl -fsSL https://ultrafast.mov/install.sh | sh        # or: brew install ultrafastmov/tap/ultrafast
agy plugin install https://github.com/ultrafastmov/ultrafast
``` 

It runs on a Mac with Apple silicon or on Linux with a Vulkan GPU. To confirm Antigravity has both parts:

```
$ agy plugin list
Installed plugins:
- ultrafast (enabled, 0.2.2)
    Source:     antigravity
    Components: 1 skill, 1 MCP server
``` 

`agy mcp list` shows only servers you added yourself, so it says `No MCP servers configured.` even when the plugin's server is there. To add the server without the plugin, `agy mcp add ultrafast uf mcp` works too; the skill then comes from `npx skills add ultrafastmov/ultrafast`.

## Running it with agy -p

Antigravity wants an approval before it runs an MCP tool, and in an interactive session it asks you. `agy -p`, the one-shot mode for scripts, can't ask anyone, so it turns the call down. A run with ultrafast's tools and no permission set came back with an empty answer and this on stderr:

```
jetski: no output produced — a tool required the "mcp" permission that headless mode cannot
prompt for, so it was auto-denied. Add an allow-rule under permissions.allow in settings.json
(e.g. mcp(<target>)). Alternatively, re-run with --dangerously-skip-permissions to auto-approve
all tools.
``` 

The rule that lets the plugin's tools run, in `~/.gemini/antigravity-cli/settings.json`:

```
{ "permissions": { "allow": ["mcp(ultrafast_ultrafast/*)"] } }
``` 

Antigravity names a plugin's server after the plugin and the server, so ultrafast's is `ultrafast_ultrafast`; `mcp(ultrafast/*)` is the rule for a server added with `agy mcp add ultrafast`. The session on this page ran with `--dangerously-skip-permissions` instead, which approves every tool, shell commands included.

## The prompt

One message, sent as written to `agy -p` in an empty git folder. It's the same prompt as [the Codex session](<https://ultrafast.mov/guides/codex/>), so the two can be compared:

```
Make a 12-second 16:9 video (1920x1080) announcing version 2.0 of gullwing, a small
command-line tool for tidying old git branches. Show the name, the line "2.0 is out",
and its three new features: watch mode, plugins, and a Windows build. Dark, crisp and
quick, in a monospace face. Check it, look at the frames, fix anything the review finds,
and export an MP4.
``` 

gullwing is made up for this test. The last sentence names the loop the skill teaches: check the document, look at frames, review every frame, then export.

## What Antigravity did

Every step below is from the session's log, in order, with what came back. Antigravity called ultrafast's tools 12 times, read 24 files and ran 3 shell commands.

  1. **Read the skill** from the plugin's `SKILL.md`, then its two references on the document format and recipes. Antigravity doesn't put every MCP tool in front of the model: it keeps each tool's description as a file, and the model reads the ones it needs. It read eleven of ultrafast's 20, from `ultrafast_ops` to `ultrafast_export`, then called the tools through one of its own, `call_mcp_tool`.
  2. **Asked`ultrafast_ops`** for the whole op vocabulary, read two example documents from the skill, then asked again for the six ops it planned to use: `text`, `path`, `stack`, `code`, `transition` and `shape`.
  3. **Wrote`gullwing.json`** in one go, 11,800 output tokens in one 53-second model turn: the name beside a git branch diagram whose two stale branches turn grey and fade, three feature slides with a terminal typing its commands, and a closing card, all in `ultrafast:mono`, the monospace face that ships with `uf`. Its notes say it picked the bundled face over downloading one so the render would work offline.
  4. **`ultrafast_check`** : no issues. Then a 12-frame `ultrafast_sheet` and `ultrafast_review` at the same time. The review read all 360 frames in 6.7 s and found three things: 

```
small text  "feat/old-auth\nfix/stale-ci" is set at 22 px; below about 24 px it is hard to read on a phone
too brief   "A small CLI tool for tidying old git bra…" is readable for 2.2 s; 9 word(s) need about 2.2 s
too brief   "Native x64 & ARM64 binaries.\nSame speed …" is readable for 1.9 s; 11 word(s) need about 2.7 s
``` 

  5. **Looked at the sheet** and found one more the review hadn't: both branch labels were one block of text sitting across the tips of the branches. Its notes: "Visual inspection of the frame layout also reveals an overlap between branch labels and path vectors, requiring coordinate shifts to maintain clean separation."
  6. **Rewrote the document** (9,668 output tokens): each label its own line at 24 px beside its own branch, the tagline cut to "Tidy old git branches from the CLI.", the Windows line to "Native x64 & ARM64. PowerShell and CMD ready.", and wider terminals. The check came back empty, and the review read 360 frames and 25 texts in 7.9 s with no findings. It looked at a second sheet.
  7. **`ultrafast_estimate`** before exporting: `gpu 0.17 s on NVIDIA GeForce RTX 5090`. Then two frames at full size, at 1 s and 9.5 s, and **`ultrafast_export`** : `exported 360 frames (1920x1080 @ 30 fps, mp4 h264, high) in 0.88 s (407 fps)`. It looked at the two frames, listed the files and gave the paths to the MP4 and the document.

Antigravity never called `ultrafast_edit`: it wrote the whole file again for the fixes. Either works: the document is a plain file, and every tool reads it again on the next call.

![Contact sheet of twelve frames of the first draft from 0.3 to 11.7 seconds: at 1 second the two branch labels feat/old-auth and fix/stale-ci sit on top of each other across the ends of the two pink branches.](https://ultrafast.mov/img/guides/agy-sheet-1.webp) The first contact sheet Antigravity looked at. At 1.00 s the two branch labels sit across the branch tips. `uf review` compares text with text, not text with drawn paths, so the sheet is where this showed.

## Changing it by asking

The first export passed the review, but two things were off that a viewer would notice. The three feature slides sat in the top part of the frame and left the bottom empty, and in the watch-mode terminal "auth" and "nav" came out a different colour from the rest of their branch names. A second message, in the same session (`agy -p --conversation` with the first run's id):

```
Two things. The feature slides sit in the top half and leave the bottom of the frame empty;
centre them vertically. In the watch-mode terminal, "auth" and "nav" come out a different
colour from the rest of each branch name; keep a branch name one colour. Then make a 1080x1920
vertical copy for Shorts and Reels next to it, with the same words. Check, review and export both.
``` 

Antigravity measured the two slides first with `ultrafast_inspect`, which returns the box of everything visible at a given moment, then wrote both documents in one 58-second model turn: the fixed `gullwing.json` and a new `gullwing-vertical.json`. It moved the feature slides down so the text and the terminal both centre on the middle of the frame, and nudged the opening and closing cards to match. The colour came from syntax highlighting: the terminal was set as `bash`, which reads `-auth` and `-nav` as command flags, so Antigravity set it to plain `text`.

The vertical copy has the same words and timings, with each slide's text stacked above its diagram or terminal. Antigravity reviewed it with `safe: "social"`, which checks that no text runs into the bottom fifth or the right 12 % of the frame, where Shorts and Reels put their captions and buttons. Both checks and both reviews came back empty (360 frames and 25 texts each, 8.5 s and 7.2 s), it looked at a contact sheet of each and a full-size frame of the watch-mode slide, and the exports took 0.77 s for the wide video and 0.72 s for the vertical one. Again it wrote whole files rather than calling `ultrafast_edit`.

[Video: The 1080 by 1920 vertical copy of the gullwing video: the same lines in the same order, with each slide's text above its branch diagram or terminal](https://ultrafast.mov/media/guides/agy-gullwing-vertical.mp4) The vertical copy, from the second message.

## Time and tokens

Wall time runs from starting `agy -p` to its exit, so it includes start-up, every model turn and every tool call.

| First video| Fix and vertical copy  
---|---|---  
Wall time| 246 s of work (850 s on the clock, see below)| 159.3 s  
ultrafast tool calls| 12| 11  
Files read, shell commands| 24, 3| 3, 1  
Output tokens| 27,909, and 7,815 thinking| 26,840, and 7,356 thinking  
Final review| 360 frames, 0 issues, 7.9 s| 360 frames each, 0 issues, 8.5 s and 7.2 s  
Export| 0.88 s| 0.77 s wide, 0.72 s vertical  
  
Antigravity CLI 1.5.17 with its default model, Gemini 4 Hydrogen (High), on a personal Google account's free quota, and ultrafast 0.2.2 on one RTX 5090 workstation, where every export took under a second with a game open on the same GPU through both turns (86 % and 96 % busy as each turn began). The first run's clock read 850 s: one model request hung for ten minutes while the test machine's network was down, until Antigravity's stream timeout retried it. The rest of that run took 246 s. Most of the time is the model thinking and writing: the second turn spent 58 s in the one model turn that wrote both documents. The engine's share was small: a review of all 360 frames took 6.7 to 8.5 s, an export 0.72 to 0.88 s.

## If it doesn't work

  * **`agy -p` answers with nothing**, and stderr says a tool required the "mcp" permission: add the allow rule (above), or run Antigravity interactively and approve the calls.
  * **A file the agent made isn't in your project.** Antigravity starts a plugin's MCP server in the plugin's own folder, so a relative path such as `./video.json` lands in `~/.gemini/config/plugins/ultrafast/`, while the agent reports it as written. In a test run the agent said `wrote ./t.json` and linked a file in the project that wasn't there. Ask for full paths, or add the server with `agy mcp add ultrafast uf mcp`, which starts it in the folder you run `agy` from. The session on this page used full paths throughout.
  * **The plugin installs the skill but no tools.** `agy plugin list` should say `1 skill, 1 MCP server`. Antigravity reads a plugin's servers from `mcp_config.json`; plugins without one install only their skills. ultrafast's has one since 26 November 2026, so install again with `agy plugin install https://github.com/ultrafastmov/ultrafast`.
  * **Which GPU will it use?** `uf info` names the GPU it will render on. ultrafast needs one: Apple silicon on a Mac, or a Vulkan GPU on Linux.

## Gemini CLI

Gemini CLI stopped serving personal Google accounts (Code Assist for individuals, Google AI Pro and Ultra) on 18 June 2026; signing in with one now says the client "is no longer supported" and points to Antigravity. Gemini CLI still works with a paid Gemini API key, Vertex AI, or Code Assist Standard and Enterprise, and ultrafast installs there as an extension: `gemini extensions install https://github.com/ultrafastmov/ultrafast`. Setup for both is on [Integrations](<https://ultrafast.mov/integrations/>).

## Remotion, HyperFrames and other agents

An agent can also make video with Remotion (React rendered in headless Chrome) or HyperFrames (HTML and GSAP in headless Chrome). On one RTX 5090, the same three 10-second videos exported in 0.66–0.78 s with ultrafast; Remotion took 3.1–8.6 times as long at its fastest settings, and HyperFrames 4.6–5.7 times ([benchmark](<https://ultrafast.mov/benchmarks/>)). For the same 10-second short, the ultrafast document took about 1,234 output tokens against 1,868 for Remotion. Head-to-head pages: [ultrafast vs Remotion](<https://ultrafast.mov/compare/remotion/>), [ultrafast vs HyperFrames](<https://ultrafast.mov/compare/hyperframes/>).

The same skill and MCP server work in Claude Code ([a recorded Claude Code session](<https://ultrafast.mov/guides/claude-code/>)), Codex ([a recorded Codex session](<https://ultrafast.mov/guides/codex/>)), Cursor and any MCP client: setup for each is on [Integrations](<https://ultrafast.mov/integrations/>), and the tools are listed in [MCP server](<https://ultrafast.mov/docs/mcp/>).

## Questions

Can Antigravity CLI make videos?

Yes, with a video engine to write for. With the ultrafast plugin, Antigravity CLI writes the video as a JSON document, checks it, looks at its frames, reviews every frame and exports an MP4 on your GPU. In the session on this page that took 246 s of work for a 12-second 1920×1080 MP4, and 159 s more for a fix and a vertical copy; each export took under a second.

What do I need to install?

The `uf` engine (`curl -fsSL https://ultrafast.mov/install.sh | sh` or Homebrew) and the plugin: `agy plugin install https://github.com/ultrafastmov/ultrafast`, which adds the ultrafast skill and the `uf mcp` server. `agy plugin list` should show `1 skill, 1 MCP server`. It renders on a Mac with Apple silicon or on Linux with a Vulkan GPU.

Why does agy -p return nothing when it should call ultrafast?

Antigravity wants an approval before it runs an MCP tool, and `agy -p` can't ask, so it denies the call and ends with no output. Add `"mcp(ultrafast_ultrafast/*)"` to `permissions.allow` in `~/.gemini/antigravity-cli/settings.json` (the plugin's server is named after the plugin and the server), or `mcp(ultrafast/*)` for a server added with `agy mcp add ultrafast uf mcp`.

Does it still work with Gemini CLI?

Yes, where Gemini CLI still runs: with a paid Gemini API key, Vertex AI, or Code Assist Standard and Enterprise. Personal Google accounts moved from Gemini CLI to Antigravity CLI on 18 June 2026. In Gemini CLI, ultrafast installs with `gemini extensions install https://github.com/ultrafastmov/ultrafast`.

Does Antigravity see the video it makes?

It sees frames. `ultrafast_sheet` returns several frames on one image and `ultrafast_frame` one at full size, and Antigravity looked at both. In this session the contact sheet showed two branch labels sitting across the branches they named, which the review doesn't check, and Antigravity moved them before exporting. `ultrafast_review` reads every frame for clipped, low-contrast, too-small or too-brief text.

How many tokens does a video take?

In this session, 27,909 output tokens and 7,815 thinking tokens, as Antigravity reports them, for the first 12-second video, with Gemini 4 Hydrogen (High), Antigravity's default model, on a personal account's free quota. Most went into writing the document twice: 11,800 for the first draft and 9,668 for the fixed one. The second message, a fix plus a vertical copy, took 26,840 output and 7,356 thinking tokens. Measured on the same 10-second short, an ultrafast document was about 1,234 output tokens against 1,868 for Remotion.
