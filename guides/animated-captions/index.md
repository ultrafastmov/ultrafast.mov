# Animated captions from Whisper, SRT or VTT, open source · ultrafast

> Burn word-by-word animated captions into a video from a Whisper transcript, an SRT or a VTT file on your own GPU: karaoke, pop, reveal or plain, vertical clips for TikTok and Reels, and a check before you post.

URL: https://ultrafast.mov/guides/animated-captions/

Docs

# Animated captions from Whisper, SRT or VTT.

Burn word-by-word captions into a video from a Whisper transcript, an SRT or a VTT file, rendered on your own GPU by an open-source engine. Karaoke, pop, reveal or plain subtitles, kept clear of the TikTok, Reels and Shorts buttons, and checked for words that flash by too fast before you post.

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
  * [This page as Markdown](<https://ultrafast.mov/guides/animated-captions/index.md>)

[Video: A vertical clip of the Voyager spacecraft and its golden record, with white capital captions that light up yellow word by word: Voyager 1, you have been a beacon of light, a symbol of exploration](https://ultrafast.mov/media/guides/animated-captions.mp4) The ISS crew's message to Voyager 1 (NASA, 19 Nov 2026), cut to 18.5 s, reframed to 9:16 and captioned from a Whisper transcript. Sound off, as most people watch. **On this page**

  1. Get the word times
  2. Caption a vertical clip
  3. Four styles
  4. From an SRT or VTT file
  5. Font, size and placement
  6. Check before posting
  7. Export
  8. Other ways to add captions
  9. Questions

## Get the word times

ultrafast doesn't listen to audio. It draws captions from word times you give it: a Whisper transcript with word timestamps, an SRT or VTT file, or plain lines of `start end word`. For speech you recorded, run Whisper first. This script uses faster-whisper:

```
# words.py: word times for ultrafast's captions op, from faster-whisper.
# pip install faster-whisper   then:   python words.py voyager.mp4 words.json
import json, sys
from faster_whisper import WhisperModel

model = WhisperModel("large-v3-turbo", device="cuda", compute_type="float16")  # or device="cpu", compute_type="int8"
segments, info = model.transcribe(sys.argv[1], word_timestamps=True, vad_filter=True)
out = {"segments": [{"start": s.start, "end": s.end, "text": s.text,
                     "words": [{"word": w.word, "start": w.start, "end": w.end} for w in s.words]}
                    for s in segments]}
json.dump(out, open(sys.argv[2], "w"), indent=1)
print(sum(len(s["words"]) for s in out["segments"]), "words")
``` 

```
$ python words.py voyager.mp4 words.json
264 words
``` 

  * The 112.5-second message took 2.7 s from Enter to file on an RTX 5090, and 12.6 s on the same machine's CPU with `device="cpu"`. The first run also downloads the model, 1.6 GB.
  * **Keep`vad_filter=True`.** Without it, Whisper wrote "Go Voyager 2!" seven times over the cheering at the end, which nobody says, and the word count changed from run to run (274, 282, 287). With it: 264 words, the same on every run.
  * On 24 Nov 2026, `pip install faster-whisper` picked PyAV 19, which faster-whisper 1.2.1 can't open files with ("unexpected keyword argument 'metadata_errors'"). Install it with `pip install faster-whisper "av<19"`. On an NVIDIA GPU it also needs cuBLAS and cuDNN 9; faster-whisper's README lists the pip packages.
  * The JSON is the shape openai-whisper writes with `--word_timestamps True`, so its `.json` output works as it is. Any JSON whose objects have a `word` or `text` with `start` and `end` works too.
  * Read the transcript before you render. Names, numbers and capitals after a comma are where Whisper slips.

## Caption a vertical clip

Transcribe the whole recording once, then cut as many clips from it as you like. This document takes 18.5 seconds from 48.3 s into the message, crops the 16:9 footage to fill a 9:16 frame, and captions it:

```
{
  "version": 1,
  "format": { "width": 1080, "height": 1920, "fps": 30, "duration": 18.5 },
  "output": "out",
  "nodes": {
    "footage": { "op": "video", "params": { "src": "voyager.mp4", "start": 48.3, "fit": "cover" } },
    "voice":   { "op": "audio", "params": { "src": "voyager.mp4", "start": 48.3 } },
    "words":   { "op": "captions",
                 "params": { "src": "words.json", "style": "karaoke", "uppercase": true,
                             "font": "ultrafast:sans", "weight": 800, "size": 76, "highlight": "#ffd23f" },
                 "timing": { "offset": -48.3 } },
    "edge":    { "op": "stroke_outline", "params": { "color": "#000000", "width": 5 }, "inputs": { "source": "words" } },
    "shade":   { "op": "drop_shadow", "params": { "offset": [0, 6], "radius": 18, "opacity": 0.7 }, "inputs": { "source": "edge" } },
    "out":     { "op": "over", "inputs": { "fg": "shade", "bg": "footage" } }
  }
}
``` 

```
$ uf export vertical.json vertical.mp4
exported 555 frames (1080x1920 @ 30 fps, mp4 h264, standard) in 3.09 s = 180 fps, 0 readbacks -> vertical.mp4
``` 

  * `start` on the video and the audio picks where the clip begins in the source. `"timing": {"offset": -48.3}` shifts the captions by the same amount, so the transcript's times line up with the clip. To cut another clip, change those three numbers and `duration`.
  * `"fit": "cover"` fills the frame and crops the sides of the 16:9 footage. For a different crop, give the video a `rect` larger than the frame and move it.
  * The outline and the shadow keep white words readable on the bright shots (the golden record, the Milky Way). They are two ordinary nodes on the captions layer, so any effect can go there.
  * Every word is its own text node, laid out once per page, so a page is set in place before the first word lights up and nothing jumps as the speaker goes on.

Start the clip on its first word. At 48.0 s instead of 48.3 s, the last page of the sentence before ("…the other reaches ever outward.") stayed on screen for the first 0.3 s, because a page lingers 0.6 s after its last word. `uf review` reported it (see Check before posting).

## Four styles

[Video: Four copies of a shot of the space station over Earth in a two by two grid, each with the same caption, Dear Voyager 1, As an orbiting outpost just 250 miles above Earth, in a different style: karaoke, pop, reveal and plain on a dark box](https://ultrafast.mov/media/guides/animated-captions-styles.mp4) The same ten seconds in each `style`, from one document with four captions nodes.

`style`| What it does| Colours it uses  
---|---|---  
`karaoke` (default)| The whole page shows; the word being spoken lights up and swells slightly| `color` for words to come, `highlight` for the spoken word, `spoken` for words already said  
`pop`| Each word pops on as it is spoken| `highlight` while it is spoken, then `spoken`  
`reveal`| Each word fades on as it is spoken| `color`  
`plain`| Whole pages, like ordinary subtitles| `color`  
  
Two more options change the look in every style: `highlight_background` puts a rounded pill behind the spoken word, and `background` puts a rounded box behind each page, as in the plain panel above (`"#000000b0"`).

## From an SRT or VTT file

An SRT or VTT file works in the same `src`. This burns NASA's own SRT into the whole 112.5-second film:

```
{
  "version": 1,
  "format": { "width": 1920, "height": 1080, "fps": 30, "duration": 112.5 },
  "output": "out",
  "nodes": {
    "footage":   { "op": "video", "params": { "src": "voyager.mp4" } },
    "voice":     { "op": "audio", "params": { "src": "voyager.mp4" } },
    "subtitles": { "op": "captions",
                   "params": { "src": "voyager.srt", "style": "plain", "font": "ultrafast:sans",
                               "weight": 600, "size": 46, "background": "#000000b0", "position": [960, 940] } },
    "out":       { "op": "over", "inputs": { "fg": "subtitles", "bg": "footage" } }
  }
}
``` 

```
$ uf export film.json film.mp4
exported 3375 frames (1920x1080 @ 30 fps, mp4 h264, standard) in 17.17 s = 197 fps, 0 readbacks -> film.mp4
``` 

A subtitle file has times for each cue, not for each word, so ultrafast shares a cue's time among its words by their length. On this film, those estimated word starts were within 0.25 s of Whisper's for 201 of the 259 words found in both, with a median gap of 0.12 s and the largest 0.72 s. That's fine for `plain` and `reveal`. For a karaoke highlight that lands on each syllable, use Whisper's word times. Pages are laid out again from the words, so they don't follow the file's own cue breaks. Simple markup such as `<i>` and `{\an8}` is removed.

## Font, size and placement

  * **`font`** : an installed family, a font file next to the document, or a built-in one such as `ultrafast:sans`; `weight` 100 to 900; `uppercase`; `tracking` for extra space between letters.
  * **`size`** : 6.5 % of the frame's short side by default (70 px on a 1080×1920 frame).
  * **`width`** and **`max_lines`** : lines fill to 82 % of the frame width by default, two lines a page. A page also ends at a pause over 0.8 s, and at the end of a sentence once the page has three words. For one or two words at a time, set `max_lines` to 1 and a narrower `width`.
  * **`position`** and **`align`** : the centre of the caption block, by default 72 % of the way down the frame.
  * **`linger`** : how long a page stays after its last word, 0.6 s by default.
  * **`safe`** : the area pages must stay inside. The default, `auto`, keeps them clear of the social apps' buttons and caption bar on a vertical frame and inside a 4 % margin on other frames. `none` places them exactly at `position`.

Every parameter is listed under [captions in the op reference](<https://ultrafast.mov/docs/ops/#op-captions>).

## Check before posting

`uf review` renders the film and reports text that viewers would trip over: words on screen too briefly to read, text that's clipped, overlapping, too small or low in contrast, and with `--safe social`, text under TikTok, Reels or Shorts buttons.

```
$ uf review vertical.json --safe social
{
  "issues": [],
  "frames": 555,
  "texts": 51,
  "seconds": 3.44
}
``` 

With the clip starting at 48.0 s, the same command listed four words, OTHER, REACHES, EVER and OUTWARD., each "readable for 0.3 s", the tail of the sentence before. Starting at 48.3 s cleared it. A coding agent working through the ultrafast MCP server gets the same report and can fix what it finds before it exports.

## Export

Document| Command| Time  
---|---|---  
`vertical.json`: 18.5 s at 1080×1920| `uf export vertical.json vertical.mp4`| 3.6–3.7 s  
`styles.json`: 10 s at 1920×1080, four videos and four caption tracks| `uf export styles.json styles.mp4`| 5.0–5.2 s  
`film.json`: the whole 112.5 s at 1920×1080, from the SRT| `uf export film.json film.mp4`| 17.9–18.2 s  
The captions of `vertical.json` alone, as a transparent overlay| `uf export overlay.json overlay.mov --codec prores --alpha`| 4.8–4.9 s  
The check of `vertical.json`| `uf review vertical.json --safe social`| 3.6 s  
  
Times are wall clock from the command to the file, warm, on the same workstation as the Whisper runs, with the published 0.2.1 binary. The export lines above are what `uf` printed. For the overlay, `overlay.json` is `vertical.json` without the footage and voice nodes and with `"output": "shade"`: ProRes 4444 with 12-bit alpha, to lay over the edit in another editor.

## Other ways to add animated captions

  * **Remotion's TikTok template** transcribes with Whisper.cpp and draws the captions as React components, rendered by capturing a headless Chrome page frame by frame. How browser rendering compares with ultrafast on the same videos is in [Benchmarks](<https://ultrafast.mov/benchmarks/>).
  * **HyperFrames Studio** is a desktop app: it transcribes the clip on your computer, offers 16 named caption styles, and an agent changes them when asked.
  * **ffmpeg's`subtitles` filter** burns an SRT or ASS file into a video with libass. ASS karaoke tags (`\k`) can colour words in turn, written by hand or by a script.
  * **Caption apps** such as CapCut, Submagic and VEED transcribe and caption in an editor or a web upload, one video at a time.

Use ultrafast when the captions are one layer of a video you build from a document: cut by an agent or a script, many clips from one transcript, with a check before export and the render on your own GPU. Use a caption app when you have one video and want to click through styles by eye, or Remotion if the rest of your video is already React.

## Questions

How do I add word-by-word animated captions to a video from the command line?

Get word times with Whisper (faster-whisper with `word_timestamps=True`), then put a `captions` node with `"src": "words.json"` over a `video` node in an ultrafast document and run `uf export`. The style is `karaoke`, `pop`, `reveal` or `plain`. The engine is open source and renders on your own GPU.

Can I use an SRT or VTT file instead of a Whisper transcript?

Yes, the same `src` reads .srt and .vtt. A subtitle file only has times per cue, so ultrafast shares each cue's time among its words by length. On NASA's SRT for a 112.5-second film, those estimated word starts had a median gap of 0.12 s from Whisper's word times. Fine for plain subtitles; for a karaoke highlight, use word times.

Does ultrafast transcribe the audio?

No. It draws captions from word times you give it. faster-whisper wrote them for a 112.5-second clip in 2.7 s on an RTX 5090 and in 12.6 s on the CPU. Keep its `vad_filter` on: without it, Whisper invented words over the music at the end.

How do I keep captions clear of the TikTok, Reels and Shorts buttons?

The default `"safe": "auto"` keeps every page out of the area the apps cover on a vertical frame, and `uf review doc.json --safe social` renders the film and reports any text under it, along with words on screen too briefly to read.

Can I cut several clips from one transcript?

Yes. Set the same start on the `video` and `audio` nodes, shift the captions by the same amount with `"timing": {"offset": -start}`, and set the clip's `duration`. Start each clip on its first word, or the last page of the sentence before shows for a moment.

Can I get the captions as a transparent overlay for another editor?

Yes. Leave the footage out of the document and export with `--alpha`, for example to ProRes 4444 with `--codec prores --alpha`, then lay it over your edit.
