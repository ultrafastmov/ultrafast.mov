# Use cases · Make videos by asking · ultrafast

> Social posts, podcast clips, documentaries, explainers, data stories, launch films and title sequences, made by asking an agent: Claude Code, Codex, Cursor or Gemini CLI with ultrafast.

URL: https://ultrafast.mov/use-cases/

Use cases

# Ask your agent for a video.

Describe it to Claude Code, Codex, Cursor or Gemini CLI with ultrafast connected. The agent writes the document, ultrafast checks every frame, and the agent exports the file. No timeline, no editor.

[Connect your agent](<https://ultrafast.mov/docs/#agents>) [See examples](<https://ultrafast.mov/examples/>)

How it goes

## Three steps.

  1. ### Ask

Say what it's for, how long, and what's in it. Give the agent footage, photos or a logo if you have them.

  2. ### Look

The agent reads contact sheets and fixes what `review` finds; `uf live` plays the draft for you. Say what to change: words, colours, music, length.

  3. ### Export

An MP4 in each size you need, 9:16 to 21:9. The document stays in your folder, so next week's changes start from it.

Twelve things agents made

## Made by asking.

Each card gives the brief in a sentence. Every film here is a real render, made by a coding agent with ultrafast; its document is on the [examples page](<https://ultrafast.mov/examples/>).

[Video: Pottery class teaser](https://ultrafast.mov/media/examples/clay.mp4)

### Social posts for a small business

Shops, studios, classes, cafés

A 10-second vertical teaser for my pottery class. Saturdays, first class free.

10 s · 1080×1920 · a pot thrown on the wheel in 3D

[Video: Podcast clip](https://ultrafast.mov/media/examples/podcast.mp4)

### Podcast and interview clips

Podcasters, interviewers, conference teams

Pull the best 25 seconds from this episode. Captions on, vertical, our colours.

26 s · 1080×1920 · captions timed to each word, his own voice

[Video: Two launches, one count](https://ultrafast.mov/media/examples/liftoff.mp4)

### Documentaries and recaps

Documentary makers, archives, event teams

Cut the Apollo 11 and Artemis I launches together on the 1969 countdown. Make it feel like a documentary.

22.5 s · 1920×804 · NASA footage and commentary, cut to the count

[Video: Artemis I's route](https://ultrafast.mov/media/examples/orbit.mp4)

### Explainers

Teachers, science and news channels

Show how Artemis I got to the Moon and back, from NASA's trajectory data.

20 s · 1920×1080 · the as-flown route, day and distance counters

[Video: The Keeling Curve](https://ultrafast.mov/media/examples/keeling.mp4)

### Data stories

Analysts, newsrooms, newsletters

Turn NOAA's Mauna Loa CO₂ file into a chart for Instagram.

16 s · 1080×1350 · every value read from the file

[Video: Lens launch](https://ultrafast.mov/media/examples/product.mp4)

### Launch films

Hardware makers, product and marketing teams

A launch film for our 35 mm lens: the knurling, the iris, an exploded view, then the price.

16 s · 1920×1080 · studio-lit 3D, callouts pinned to the parts

[Video: SQL notebook launch](https://ultrafast.mov/media/examples/ui.mp4)

### Product demos

Software, developer tools, docs teams

Show someone running this query and sharing the chart, with the app tilting in 3D.

16 s · 1920×1080 · real query results, a cursor that moves like a hand

[Video: Year in review](https://ultrafast.mov/media/examples/wrapped.mp4)

### One video per customer

Apps, clubs, subscriptions, ecommerce

Make every member their year in review from this spreadsheet.

12 s · 1080×1920 · one document, a file per member

[Video: Concert poster](https://ultrafast.mov/media/examples/swiss.mp4)

### Posters that move

Venues, festivals, promoters

A poster for our concert night that moves with the music.

12.8 s · 1080×1350 · locked to the beat of its own track

[Video: Celadon dish](https://ultrafast.mov/media/examples/bloom.mp4)

### Loops and visuals

Musicians, artists, galleries, brands

A 15-second loop for the album cover: something growing, in celadon.

15 s · 1080×1080 · a simulation stepped every frame, a seamless loop

[Video: Main titles](https://ultrafast.mov/media/examples/meridian.mp4)

### Title sequences

Filmmakers, studios, streaming teams

Main titles for our drama: a brass compass, sea charts, a lighthouse in fog.

24 s · 1920×804 · 3D brass, parchment, star trails

[Video: Endless zoom](https://ultrafast.mov/media/examples/dive.mp4)

### Brand films

Studios, agencies, launches

One continuous zoom through everything we make, ending on our logo.

28 s · 1920×1080 · seven worlds, one camera, a seamless loop

For builders

## Put it inside your product.

Your users ask your app for a video; your agent writes the document; ultrafast renders it on your GPU with `uf serve`. They never see a timeline.

[Read the quickstart](<https://ultrafast.mov/docs/>)[Integrations](<https://ultrafast.mov/integrations/>)

```
from ultrafastmov import Ultrafast

uf = Ultrafast(base_url="http://localhost:8080")  # your uf serve

doc = uf.load("teaser.json")     # what your agent wrote
issues = uf.check(doc)           # before a frame renders
video = uf.render(doc)
video.save("teaser.mp4")
``` 

Questions

## Common questions.

Do I need to know how to edit video?

No. Describe what you want to your agent in plain words, the way you'd brief a person. The agent writes the document, ultrafast checks every frame for unreadable or clipped text, and the agent exports the file.

Which agents can do this?

Any agent that can run an MCP server or a shell: Claude Code, Codex, Cursor and Gemini CLI connect to `uf mcp` in one line. See [MCP](<https://ultrafast.mov/docs/mcp/>). The ChatGPT app and the Claude connector come with [ultrafast Cloud](<https://ultrafast.mov/cloud/>).

Can I use my own footage, photos and logo?

Yes. Give your agent the files. ultrafast works with video, photos, SVG logos, Lottie animations, music and voiceover, and any Google Font by name.

How long does a video take?

The render takes seconds: each film on this page exported in under 8 seconds on one RTX 5090. Writing and reviewing the document takes your agent longer, depending on the model and the film.

Can I change it afterwards?

Yes. The video is a JSON document file, so ask for changes any time: new words, another size, a different song. The agent edits the nodes that change and leaves the rest as it was.

## Make the first one.

Free and open source. Install it, connect your agent, and ask.

`cargo install ultrafast` [Read the quickstart](<https://ultrafast.mov/docs/>)

Want it hosted? [Join the ultrafast Cloud waitlist](<https://ultrafast.mov/cloud/>).
