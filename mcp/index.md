# Video MCP server for agents · Shot on the GPU · ultrafast

> A video MCP server for Claude Code, Cursor and any MCP client: 20 tools to write, look at, review and export video, rendered on your GPU. Open source.

URL: https://ultrafast.mov/mcp/

# Shot on the GPU.

Shaders, 3D, motion type and camera optics, written by your agent and rendered on the GPU. Open source.

The ultrafast MCP server gives your agent 20 tools to write a video, look at its frames, review them and export the file, on your own GPU.

`curl -fsSL https://ultrafast.mov/install.sh | sh` Set up your client

macOS on Apple silicon and Linux x86_64. Every parameter is in the [MCP reference](<https://ultrafast.mov/docs/mcp/>).

ultrafast MCP server, v0.2.0

tools over stdio, uf mcp
    20
tools over HTTP, /mcp
    16
frames and sheets
    images
review reads
    every frame
licence
    Apache-2.0 or MIT

In the official MCP Registry as io.github.ultrafastmov/ultrafast

## What your agent sees.

Frames and contact sheets come back as images. The review comes back as findings, each naming a node, a time and a fix.

  1. ### It looks

`ultrafast_frame` returns one exact frame and `ultrafast_sheet` a labelled contact sheet, as images in the conversation. `ultrafast_inspect` names the node behind anything on screen.

  2. ### It reviews

`ultrafast_review` renders every frame. It reports text that is unreadable, clipped, overlapping, too small or too brief, text under social-app buttons, and flashing that risks seizures.

  3. ### It fixes and exports

`ultrafast_edit` changes the nodes a finding names and leaves the rest. `ultrafast_export` writes MP4, MOV, WebM, a GIF or an image sequence, at any size.

![Contact sheet of the first draft, frames at 0.55, 2.6, 4.5 and 7.5 seconds. Frame one is a white flash, the title runs off the right edge, the studio name is too dark to read and the details are tiny.](https://ultrafast.mov/img/proof_draft.webp)

  1. **flashing** more than 3 flashes per second: a photosensitive seizure risk (WCAG 2.3.1)
  2. **clipped** "Pottery class" runs off the frame (right by 40 px)
  3. **low contrast ×2** "HALDEN CLAY STUDIO" never reaches readable contrast (best 1.6:1, want 3:1 or more); "118 TANNER STREET" 1.6:1
  4. **too brief** "First class free" is readable for 0.4 s; 3 words need about 0.9 s
  5. **small text ×3** set at 20 px; below about 24 px it is hard to read on a phone

![Contact sheet of the second draft at the same moments: no flash, the title fits, the studio name and the details read.](https://ultrafast.mov/img/proof_approved.webp) 0 findings

  1. `sheet`: the draft, as an image
  2. `review`: 8 findings, each with a fix
  3. `edit`: the nodes they name
  4. `export`: after 0 findings, in 1.68 s

The pottery teaser from the [examples](<https://ultrafast.mov/examples/>): its first draft and its second, at the same four moments. The review read all 300 frames in 4.7 s. These sheets and reviews came from the CLI (`uf sheet`, `uf review --safe social`), which runs the same code as the tools. The second version's document is [clay-v1.json](<https://ultrafast.mov/examples/clay-v1.json>).

## 20 tools, in six groups.

As `uf mcp` lists them in v0.2.0. The remote server has the 16 that don't read or write files on your machine.

### Write

  * `ultrafast_ops`: the op vocabulary, with every port, param, type and default.
  * `ultrafast_new`: a template to start from: vertical, title, square, promo, explainer or product.
  * `ultrafast_edit`: an edit batch applied to the document, atomically.

### Look

  * `ultrafast_frame`: one exact frame, as an image.
  * `ultrafast_sheet`: a labelled contact sheet of frames, as one image.
  * `ultrafast_inspect`: what is on screen at a time, with each element's node, bounds and words.

### Check and review

  * `ultrafast_check`: problems before rendering: unknown ops, misspelled params, broken shaders, missing files or fonts.
  * `ultrafast_review`: renders the film and reports what a viewer would trip over, with the node and a fix.

### Render and export

  * `ultrafast_export`: MP4, MOV, MKV or WebM, a GIF, PNG or EXR frames, or sound alone, at any size and frame rate.
  * `ultrafast_estimate`: rendered minutes, GPU seconds and the time to the first frame, before rendering.
  * `ultrafast_batch`: one document, a video per row of data.
  * `ultrafast_profile`: GPU milliseconds per render group, for slow films.

### Import

  * `ultrafast_import_svg`: an SVG as an editable component.
  * `ultrafast_decompose`: a finished motion-graphics video as an editable document. Local only.
  * `ultrafast_ocr`: the text in a video frame, with word boxes and draft text nodes. Local only.
  * `ultrafast_match_font`: a text node's font, size, tracking and colour, from a video frame. Local only.

### Sound and type

  * `ultrafast_beats`: tempo, beats, downbeats and onsets of a soundtrack.
  * `ultrafast_voiceover`: a script spoken to WAV, with every word's time. Local only.
  * `ultrafast_measure`: glyph metrics of a line of text.
  * `ultrafast_outline`: a line of text as SVG path data.

The server also tells the agent the loop when it connects: ops, a template, check until clean, look at sheets and frames, review and fix, then export. “Always look at a sheet before exporting.” Parameters for every tool are in the [MCP reference](<https://ultrafast.mov/docs/mcp/#tools>).

## Set up your client.

Install ultrafast, run `uf info` to check the GPU, then add the server to your client. Each block says what was tested, in November 2026.

`curl -fsSL https://ultrafast.mov/install.sh | sh`

### Claude Code, with the plugin

```
claude plugin marketplace add ultrafastmov/ultrafast
claude plugin install ultrafast@ultrafast
``` 

The ultrafast skill and `uf mcp` together. Tested: the plugin installs from the repo. With the skill, Claude Code went from a one-line request to an exported video with 0 review findings.

### Claude Code, the MCP server alone

```
claude mcp add ultrafast -- uf mcp
``` 

Tested with Claude Code 2.1.325: a model run used new, check, sheet (and saw the image), inspect, edit and export.

### Cursor

```
{
  "mcpServers": {
    "ultrafast": { "command": "uf", "args": ["mcp"] }
  }
}
``` 

Tested with Cursor CLI 2026.11.19: all 20 tools listed. No model run yet.

### Gemini CLI

```
{
  "mcpServers": {
    "ultrafast": { "command": "uf", "args": ["mcp"] }
  }
}
``` 

Tested with Gemini CLI 0.70: connected over stdio, and over HTTP with `httpUrl` and a header. No model run yet.

### Remote, from your own uf serve

```
uf serve    # on the machine with the GPU; prints an API key on first start
claude mcp add --transport http ultrafast http://localhost:8080/mcp \
  --header "Authorization: Bearer $ULTRAFAST_API_KEY"
``` 

16 tools over Streamable HTTP, with the server's API key as a bearer token. Documents travel inline; exports come back as download links. Tested with Claude Code over HTTP, and with MCP Inspector, which called all 16 tools.

### The MCP Registry and the MCP bundles

```
io.github.ultrafastmov/ultrafast

ultrafast-0.2.0-macos-arm64.mcpb
ultrafast-0.2.0-linux-x86_64.mcpb
``` 

The name in the [official MCP Registry](<https://registry.modelcontextprotocol.io/v0/servers?search=io.github.ultrafastmov/ultrafast>), which points to the two bundles on the [v0.2.0 release](<https://github.com/ultrafastmov/ultrafast/releases/tag/v0.2.0>), the `ultrafast` crate and the Docker image. The bundles are for Claude Desktop, one for a [Mac with Apple silicon](<https://github.com/ultrafastmov/ultrafast/releases/download/v0.2.0/ultrafast-0.2.0-macos-arm64.mcpb>) and one for [Linux x86_64](<https://github.com/ultrafastmov/ultrafast/releases/download/v0.2.0/ultrafast-0.2.0-linux-x86_64.mcpb>). Each carries the binary and asks for one setting: the folder for documents and videos, `~/ultrafast` by default.

The server is also listed on [Glama](<https://glama.ai/mcp/servers/ultrafastmov/ultrafast>) and [mcpservers.org](<https://mcpservers.org/servers/ultrafastmov/ultrafast>).

Codex and the JSON config for Claude Desktop are in the [MCP reference](<https://ultrafast.mov/docs/mcp/#local>); neither has been tested yet. Any other MCP client that runs a stdio server, or connects over Streamable HTTP with a header, takes the same settings.

## How it differs from other video MCP servers.

Most video MCP servers wrap FFmpeg to edit files you already have, or call a hosted API. ultrafast makes the frames.

### FFmpeg wrappers

  * They cut, trim, join and convert video files you already have.
  * FFmpeg does the work. The tools pass it the commands.

### Hosted APIs

  * The tools send the job to a rendering service and get a result back.
  * They need an account with that service, and stop working if it closes. Remotion's hosted MCP server shut down on 26 October 2026.

### ultrafast renders the frames

  * It draws every frame on your GPU: 3D, simulations, shaders, motion type and footage, in one document.
  * Frames and contact sheets come back as images the agent can look at, before anyone watches the film.
  * `ultrafast_review` reads every frame and names the node, the time and a fix for each problem it finds.
  * A video is a JSON document, so a change edits the nodes it touches and leaves the rest as they were.
  * It runs on your machine with no account, under Apache-2.0 or MIT.

Remotion's MCP page: [remotion.dev/docs/ai/mcp](<https://www.remotion.dev/docs/ai/mcp>), read on 21 November 2026. Remotion is a trademark of its owner. More on how ultrafast compares: [Compare](<https://ultrafast.mov/compare/>).

## Limits.

What to know before you connect it. Checked 22 November 2026.

### What it needs, and what it doesn't do yet

  * A GPU: a Mac with Apple silicon, or a Linux x86_64 machine with a Vulkan GPU.
  * No GPU? The Docker image (`ghcr.io/ultrafastmov/ultrafast`) renders on the CPU through Mesa's software Vulkan driver: frames in under a second, and a 6-second 1080×1920 export in about 17 seconds on 4 cores of a fast desktop CPU. Heavy 3D or particle work is much slower. On Linux, `mesa-vulkan-drivers` gives the other installs the same CPU path.
  * No prebuilt Windows or Intel Mac build.
  * On Linux, exports need ffmpeg; `ultrafast_voiceover` needs espeak-ng and `ultrafast_ocr` needs Tesseract.
  * The remote server at `/mcp` takes one API key as a bearer token. There is no OAuth sign-in on it.
  * OAuth sign-in and hosted rendering come with ultrafast Cloud, and so do the Claude connector and the ChatGPT app. Cloud has a [waitlist](<https://ultrafast.mov/cloud/>).
  * Lottie import is in the CLI only (`uf import-lottie`). A document can still use a `lottie` node.

## Questions about the MCP server.

Can Claude make videos with an MCP server?

Yes. With ultrafast connected, Claude Code writes the video as a document, looks at its frames, reviews them and exports the file on your GPU. In a test with the ultrafast skill, it went from a one-line request to an exported video with 0 review findings. Add it with `claude mcp add ultrafast -- uf mcp` or the plugin. There is also a .mcpb bundle for Claude Desktop. The Claude connector comes with [ultrafast Cloud](<https://ultrafast.mov/cloud/>).

Which MCP clients does it work with?

Any client that starts a local server over stdio or connects over Streamable HTTP. Tested: Claude Code used it over stdio and HTTP, Cursor CLI listed all 20 tools, and Gemini CLI connected over stdio and HTTP. The configs for Codex and Claude Desktop are in the [MCP reference](<https://ultrafast.mov/docs/mcp/>); they haven't been tested yet.

Can it edit videos I already have?

Yes, as footage in a document: cut, trim, speed-ramp, reframe, grade, key and caption clips, and put the cuts on the beat with `ultrafast_beats`. `ultrafast_decompose` turns a finished motion-graphics video into an editable document. It is not an FFmpeg wrapper: ultrafast renders every frame on the GPU.

Do I need a GPU?

A GPU is the fast path: a Mac with Apple silicon, or a Linux x86_64 machine with a Vulkan GPU. There is no prebuilt Windows or Intel Mac build. No GPU? The Docker image renders on the CPU through Mesa's software Vulkan driver: frames in under a second, and a 6-second 1080×1920 export in about 17 seconds on 4 cores of a fast desktop CPU. Heavy 3D or particle work is much slower. An agent can also connect to a server that has a GPU: `uf serve` answers MCP at `/mcp` with its API key. Hosted GPUs come with [ultrafast Cloud](<https://ultrafast.mov/cloud/>), which has a waitlist.

Is there a hosted MCP server?

Not yet. The server runs on your machine (`uf mcp`) or on your own server (`/mcp` on `uf serve`, with its API key). A hosted server with OAuth sign-in comes with [ultrafast Cloud](<https://ultrafast.mov/cloud/>). Join the waitlist for one email when it opens.

## Connect your agent.

Install ultrafast, then add `uf mcp` to your client.

`curl -fsSL https://ultrafast.mov/install.sh | sh` [Read the quickstart](<https://ultrafast.mov/docs/>)

Want it hosted? [Join the ultrafast Cloud waitlist](<https://ultrafast.mov/cloud/>).
