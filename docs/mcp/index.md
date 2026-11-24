# MCP server · 20 tools · ultrafast docs

> ultrafast as MCP tools for Claude Code, Codex, Cursor, Gemini CLI and any MCP client: local over stdio with uf mcp, or remote over Streamable HTTP from your own uf serve with an API key.

URL: https://ultrafast.mov/docs/mcp/

Docs

# MCP server

20 tools that let an agent write a video, look at it, fix it and export it, without a shell.

## Start

  * [Quickstart](<https://ultrafast.mov/docs/>)
  * [The document](<https://ultrafast.mov/docs/documents/>)
  * [Templates](<https://ultrafast.mov/templates/>)

## Guides

  * [Render video from JSON](<https://ultrafast.mov/guides/render-video-from-json/>)
  * [Personalized videos from a CSV](<https://ultrafast.mov/guides/personalized-videos-from-csv/>)
  * [Make a video with Claude Code](<https://ultrafast.mov/guides/claude-code/>)
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
  * [This page as Markdown](<https://ultrafast.mov/docs/mcp/index.md>)

**On this page**

  1. Local, over stdio
  2. Remote, over HTTP
  3. The tools
  4. How agents use them

## Local, over stdio

`uf mcp` is a stdio MCP server (JSON-RPC 2.0, one message per line). Renders run on your GPU.

```
claude mcp add ultrafast -- uf mcp
``` 

```
[mcp_servers.ultrafast]
command = "uf"
args = ["mcp"]
``` 

```
{
  "mcpServers": {
    "ultrafast": { "command": "uf", "args": ["mcp"] }
  }
}
``` 

Documents stay plain JSON files. The server keeps a renderer per document, so repeated frames are fast, and reloads a file when it changes, whether the agent edits it with `ultrafast_edit` or writes it directly.

## Remote, over HTTP

`ultrafast serve` answers MCP over Streamable HTTP at `/mcp`, with its API key as a bearer token, for agent frameworks and any client that can't run a local process. It serves the 16 tools that need no local files; they take the document and asset ids instead of file paths; frames and sheets come back as images and exports as download links.

```
claude mcp add --transport http ultrafast http://localhost:8080/mcp \
  --header "Authorization: Bearer $ULTRAFAST_API_KEY"
``` 

A hosted server with OAuth sign-in, for the ChatGPT app and the Claude connector, comes with [ultrafast Cloud](<https://ultrafast.mov/cloud/>).

## The tools

tool| does  
---|---  
`ultrafast_ops`| The op vocabulary: ports, params, types, defaults, docs.  
`ultrafast_new`| Write a template (`vertical`, `title`, `square`, `promo`, `explainer`, `product`) to a path.  
`ultrafast_check`| Problems in a document, static and render-time.  
`ultrafast_frame`| One exact frame, returned as an image.  
`ultrafast_sheet`| A labelled contact sheet of frames, returned as an image.  
`ultrafast_review`| Renders the film and reports unreadable, too-brief, clipped, overlapping or tiny text, unsafe areas and seizure-risk flashing.  
`ultrafast_inspect`| What is on screen at a time: each element's node, bounds and words.  
`ultrafast_edit`| Apply an edit batch to the document file, atomically.  
`ultrafast_export`| Encode to MP4, MOV (ProRes), WebM, a GIF, a PNG or EXR sequence or sound alone, at any size, frame rate and quality level, transparent where the codec allows.  
`ultrafast_estimate`| Rendered minutes, GPU seconds and the time to the first byte, before rendering.  
`ultrafast_batch`| One document, a video per row of a CSV or JSON file.  
`ultrafast_profile`| GPU milliseconds per render group, for slow films.  
`ultrafast_beats`| Tempo, beats, downbeats and onsets of a soundtrack.  
`ultrafast_voiceover`| Speak a script to WAV with every word's time, for audio and captions.  
`ultrafast_import_svg`| An SVG as an editable component, or added to a document.  
`ultrafast_decompose`| A finished video as an editable document: plate, vector layers with their motion, gradients, type read back as text in its matched font.  
`ultrafast_match_font`| A text node's font, size, baseline, tracking and colour, from a video frame.  
`ultrafast_ocr`| The text in a video frame, with word boxes and a draft of text nodes.  
`ultrafast_measure`| Glyph metrics of a line of text.  
`ultrafast_outline`| A line of text as SVG path data.  
  
## How agents use them

  1. `ultrafast_new` or write the JSON; `ultrafast_ops` when unsure of a param.
  2. `ultrafast_check` until it's clean.
  3. `ultrafast_sheet` to see the motion; `ultrafast_inspect` to find the node behind a pixel.
  4. `ultrafast_review`; fix what it reports with `ultrafast_edit`.
  5. `ultrafast_export`.

The [MCP server overview](<https://ultrafast.mov/mcp/>) shows this loop on a real film, with the clients tested and how it differs from other video MCP servers.

The ultrafast skill teaches agents the document and this loop: `npx skills add ultrafastmov/ultrafast`. In Claude Code, the plugin brings the skill and `uf mcp` together: `claude plugin marketplace add ultrafastmov/ultrafast`, then `claude plugin install ultrafast@ultrafast`.

Agents that read docs can start from [llms.txt](<https://ultrafast.mov/llms.txt>); every page here is also available as Markdown at `index.md`.
