# Integrations · MCP, coding agents, SDKs · ultrafast

> Use ultrafast from Claude Code, Codex, Cursor, Gemini CLI and any MCP client, from Python and TypeScript, over HTTP, or in Docker on your own GPU. The ChatGPT app and Claude connector are coming with ultrafast Cloud.

URL: https://ultrafast.mov/integrations/

Integrations

# Wherever your agent runs.

Coding agents, any MCP client, Python and TypeScript, an HTTP API and Docker, all on your own GPU today. The ChatGPT app and the Claude connector come with ultrafast Cloud.

  * [**MCP server**`uf mcp`local · 20 tools _Available_](<https://ultrafast.mov/docs/mcp/>)
  * [**Coding agents** Claude Code, Codex, Cursor, Gemini CLI _Available_](<https://ultrafast.mov/integrations/#coding-agents>)
  * [**Skill and plugin**`npx skills add``ultrafastmov/ultrafast` _Available_](<https://ultrafast.mov/integrations/#coding-agents>)
  * [**Remote MCP**`uf serve`/mcp on your server, one key _Available_](<https://ultrafast.mov/integrations/#remote-mcp>)
  * [**SDKs**`pip install ultrafastmov``npm i ultrafastmov` _Available_](<https://ultrafast.mov/integrations/#sdks>)
  * [**Framework starters** Vercel AI SDK, OpenAI Agents SDK, LangGraph, Mastra _Available_](<https://ultrafast.mov/integrations/#frameworks>)
  * [**Self-host**`docker run …`the HTTP API on one GPU _Available_](<https://ultrafast.mov/integrations/#self-host>)
  * [**ChatGPT app** make and edit videos in a chat _Coming soon_](<https://ultrafast.mov/cloud/#apps>)
  * [**Claude connector** for Claude on the web, desktop and phone _Coming soon_](<https://ultrafast.mov/cloud/#apps>)
  * [**ultrafast Cloud** hosted GPUs, one API key _Waitlist_](<https://ultrafast.mov/cloud/>)

Coding agents

## Claude Code, Codex, Cursor, Gemini CLI.

Run `uf mcp` on your machine and the agent gets 20 tools: it writes the document, looks at frames and contact sheets, fixes what `review` finds and exports. The [MCP server page](<https://ultrafast.mov/mcp/>) shows that loop on a real film.

### Claude Code

```
claude mcp add ultrafast -- uf mcp
``` 

### Codex

```
[mcp_servers.ultrafast]
command = "uf"
args = ["mcp"]
``` 

### Cursor

```
{
  "mcpServers": {
    "ultrafast": { "command": "uf", "args": ["mcp"] }
  }
}
``` 

### Gemini CLI

```
{
  "mcpServers": {
    "ultrafast": { "command": "uf", "args": ["mcp"] }
  }
}
``` 

Each agent also gets the ultrafast skill: `npx skills add ultrafastmov/ultrafast`. In Claude Code, the plugin brings both: `claude plugin marketplace add ultrafastmov/ultrafast`, then `claude plugin install ultrafast@ultrafast`.

Remote MCP

## From your own server.

`uf serve` answers MCP over Streamable HTTP at `/mcp`, with its API key as a bearer token. The tools take documents and asset ids instead of file paths; frames and contact sheets come back as images, so the agent sees its work.

A hosted server with OAuth sign-in comes with [ultrafast Cloud](<https://ultrafast.mov/cloud/>).

[MCP docs](<https://ultrafast.mov/docs/mcp/#remote>)

```
claude mcp add --transport http ultrafast \
  http://localhost:8080/mcp \
  --header "Authorization: Bearer $ULTRAFAST_API_KEY"
``` 

```
{
  "mcpServers": {
    "ultrafast": {
      "url": "http://localhost:8080/mcp",
      "headers": { "Authorization": "Bearer uf_live_..." }
    }
  }
}
``` 

SDKs

## Python and TypeScript.

`render`, `frame`, `sheet`, `check`, `review`, `estimate` and `upload`, against your own `uf serve`. Local footage, images and fonts in the document are uploaded for you.

```
from ultrafastmov import Ultrafast

# your uf serve, and the key it printed
uf = Ultrafast(base_url="http://localhost:8080")

doc = uf.load("film.json")
for issue in uf.review(doc):
    print(issue.kind, issue.node, issue.message)
uf.render(doc).save("film.mp4")
``` 

```
import { Ultrafast } from "ultrafastmov";

// your uf serve, and the key it printed
const uf = new Ultrafast({ baseUrl: "http://localhost:8080" });

const doc = await uf.load("film.json");
await (await uf.sheet(doc, { count: 9 })).save("sheet.png");
const render = await uf.render(doc);
await render.save("film.mp4");
``` 

Agent frameworks

## Starters for the frameworks you build on.

Starter apps for the Vercel AI SDK, the OpenAI Agents SDK, LangGraph and Mastra: an agent that takes a brief, works through the `/mcp` tools of your `uf serve` and returns a reviewed MP4. They're in the `starters/` folder of the repo.

[Starters on GitHub](<https://github.com/ultrafastmov/ultrafast/tree/main/starters>)

```
from agents import Agent, Runner
from agents.mcp import MCPServerStreamableHttp

async with MCPServerStreamableHttp(params={
    "url": "http://localhost:8080/mcp",
    "headers": {"Authorization": f"Bearer {key}"},
}) as ultrafast:
    agent = Agent(
        name="Editor",
        mcp_servers=[ultrafast],
        instructions="Make it, review it, export it.",
    )
    result = await Runner.run(agent, "A 15 s launch promo")
``` 

HTTP API

## One request, one video.

POST a document to your `uf serve`, get an MP4 back.

[HTTP API docs](<https://ultrafast.mov/docs/api/>)

```
jq '{document: ., output: {inline: true}}' film.json |
curl http://localhost:8080/v1/render \
  -H "Authorization: Bearer $ULTRAFAST_API_KEY" \
  -H "Content-Type: application/json" \
  --data-binary @- -o film.mp4
``` 

Self-host

## Your GPU.

The render service is open source: the HTTP API and remote MCP on one machine with a GPU, one API key, files on local disk. Enough to build against and to share one box on a small team.

Jobs with signed webhooks, output to your own bucket, sign-in and GPUs that scale are planned for [ultrafast Cloud](<https://ultrafast.mov/cloud/>).

[SELF_HOST.md](<https://github.com/ultrafastmov/ultrafast/blob/main/docs/service/SELF_HOST.md>)

```
docker run --gpus all -p 8080:8080 -v ultrafast:/data \
  ghcr.io/ultrafastmov/ultrafast:latest serve
``` 

CLI and live player

## And a shell.

`uf live film.json` plays a document while you or an agent edit it; parameter edits show on the next frame.

[CLI reference](<https://ultrafast.mov/docs/cli/>)

```
uf new vertical film.json
uf check film.json
uf live film.json
uf review film.json --safe social
uf export film.json film.mp4
``` 

Chat apps · coming soon

## ChatGPT and Claude.

For anyone who can describe a video. They render on ultrafast Cloud, so they open with it.

[Join the waitlist](<https://ultrafast.mov/cloud/#waitlist>)

### ChatGPT app Coming soon

  * Add ultrafast from ChatGPT's app directory.
  * Ask for a video; attach footage, photos or a logo.
  * Edit it by asking, then download the file.

### Claude connector Coming soon

  * Add ultrafast in Claude's settings under Connectors, then sign in.
  * Works in Claude on the web, desktop and phone.
  * The ultrafast skill, which teaches the document and the review loop, works today in Claude Code.

## Pick one and start.

Every integration renders the same documents with the same engine.

`curl -fsSL https://ultrafast.mov/install.sh | sh` [Read the quickstart](<https://ultrafast.mov/docs/>)

Want it hosted? [Join the ultrafast Cloud waitlist](<https://ultrafast.mov/cloud/>).
