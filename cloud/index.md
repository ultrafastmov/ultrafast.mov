# ultrafast Cloud · Coming soon · Join the waitlist

> ultrafast Cloud will render the open-source engine on our GPUs with one API key, and run the ChatGPT app and the Claude connector. Coming soon; join the waitlist.

URL: https://ultrafast.mov/cloud/

ultrafast Cloud · coming soon

# Our GPUs. Coming soon.

The open-source engine, rendering on our GPUs: one API key, nothing to install. Join the waitlist and we’ll email you when it opens.

Email for the ultrafast Cloud waitlist Join the waitlist

Planned

## What Cloud adds.

None of this is open yet. The engine underneath is the one you can install today.

### One API key

The same HTTP API as `uf serve`: renders, frames, contact sheets, check and review, from the SDKs, curl or an agent.

### No GPU to run

No drivers, no ffmpeg and no machine to keep warm. Renders start on GPUs that are already running.

### The ChatGPT app

Describe a video in a chat, edit it by asking, download the file.

### The Claude connector

The same in Claude on the web, desktop and phone, added under Connectors.

### Remote MCP with sign-in

The MCP tools at one URL for any MCP client, signed in with OAuth instead of a key.

### Jobs and storage

Long renders as jobs with signed webhooks, and output written to your own S3, R2 or GCS bucket.

ChatGPT and Claude · coming soon

## Make it in a chat.

The ChatGPT app and the Claude connector render on Cloud, so they open with it.

The edit on the right was made by a coding agent with `uf mcp`, which works today. In the apps, the same request will happen in a chat.

A 10-second vertical teaser for my pottery class. Saturdays, first class free.

[Video: The teaser, first version: a vase thrown on the wheel](https://ultrafast.mov/media/examples/clay.mp4)

agentclay.json · 10 s · 1080×1920 · `review` 0 findings

Make it a wide bowl instead of a vase.

[Video: The teaser after the edit: a wide bowl](https://ultrafast.mov/media/examples/clay-bowl.mp4)

agentedited 1 node, `vessel`. The type, light and timing are untouched.

Available today

## Run it yourself.

Everything Cloud will run is open source. `uf serve` gives you the HTTP API and remote MCP on one machine with a GPU, with one API key and files on local disk.

`curl -fsSL https://ultrafast.mov/install.sh | sh`[HTTP API docs](<https://ultrafast.mov/docs/api/>)

```
docker run --gpus all -p 8080:8080 -v ultrafast:/data \
  ghcr.io/ultrafastmov/ultrafast:latest serve
``` 

```
uf serve --port 8080       # prints its API key at first start
``` 

Questions

## Common questions.

When does ultrafast Cloud open?

There's no date yet. Join the waitlist and we'll email you when it opens.

What will it cost?

Prices aren't set yet. They'll be on this page before it opens. The engine stays free and open source.

Can I render on my own GPU today?

Yes. The engine, the CLI, `uf mcp` and the render service are all open source. `uf serve` or the Docker image serves the HTTP API and remote MCP from one machine with a GPU, with one API key and files on local disk. See the [HTTP API](<https://ultrafast.mov/docs/api/>).

Is the open-source engine limited?

No. It's the engine Cloud will run, under Apache-2.0 or MIT. Use it commercially, at any scale, for free.

Do the ChatGPT app and the Claude connector need Cloud?

Yes. They render on our GPUs, so they open with Cloud. Coding agents work today with `uf mcp` on your own machine.

What do you do with my email?

We email you when Cloud opens. We don't use it for anything else or share it.

## Get on the list.

We’ll email you when ultrafast Cloud opens.

Email for the ultrafast Cloud waitlist Join the waitlist
