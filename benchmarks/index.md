# Render benchmark: ultrafast vs Remotion vs HyperFrames · ultrafast

> Render benchmark on one RTX 5090: 10-second videos in 0.85–0.98 s with ultrafast; Remotion 2.25–6.69 s and HyperFrames 3.31–4.46 s at their fastest settings.

URL: https://ultrafast.mov/benchmarks/

# ultrafast, Remotion and HyperFrames, timed.

Three 10-second videos, exported on one RTX 5090 workstation. ultrafast took 0.85 to 0.98 s. Remotion took 2.25 to 6.69 s and HyperFrames 3.31 to 4.46 s, each at the fastest setting found.

Measured 22 November 2026. ultrafast ran the benchmark and wrote this page. The code, every run and the frames are in the [benchmark repository](<https://github.com/ultrafastmov/benchmarks>), with one script to reproduce it.

## Faster in every scene and every setting.

Seconds from the start of each tool's render command to the finished MP4. Median of 5 warm runs, 300 frames each. At the fastest setting found, Remotion took 2.6 to 6.8 times as long as ultrafast, and HyperFrames 3.8 to 4.5 times. With their default commands: 5.1 to 8.7 times, and 4.2 to 5.1 times.

### Title card 1080×1920, 10 s, fastest setting found

  1. ultrafast **0.85 s**
  2. Remotion **2.32 s**
  3. HyperFrames **3.53 s**

### Chart 1920×1080, 10 s, fastest setting found

  1. ultrafast **0.88 s**
  2. Remotion **2.25 s**
  3. HyperFrames **3.31 s**

### Footage 1080×1920, 10 s, fastest setting found

  1. ultrafast **0.98 s**
  2. Remotion **6.69 s**
  3. HyperFrames **4.46 s**

Scene| ultrafast| Remotion, fastest found| Remotion, default| HyperFrames, fastest found| HyperFrames, default  
---|---|---|---|---|---  
Title card| **0.85**|  2.32 (2.7×)| 4.73 (5.6×)| 3.53 (4.1×)| 3.92 (4.6×)  
Chart| **0.88**|  2.25 (2.6×)| 4.45 (5.1×)| 3.31 (3.8×)| 3.71 (4.2×)  
Footage| **0.98**|  6.69 (6.8×)| 8.53 (8.7×)| 4.46 (4.5×)| 5.05 (5.1×)  
  
Seconds, lower is better. In brackets: that time divided by ultrafast's. “Fastest found” is the quickest of every configuration measured for that tool on that scene (how it was searched). On the title card and the footage, Remotion's fastest run used NVENC at its default quality, which is lower than the CRF 18 used everywhere else. A fourth scene, effects, is reported apart.

## The first run, and one frame.

A cold first run took 2.5 to 2.6 s with ultrafast, 8.4 to 12.6 s with Remotion and 3.7 to 5.6 s with HyperFrames. One still frame took 0.34 to 0.82 s, against 2.2 to 2.3 s and 1.5 to 2.1 s.

Cold first run, default command, seconds Scene| ultrafast| Remotion| HyperFrames  
---|---|---|---  
Title card| 2.49| 8.46| 3.93  
Chart| 2.63| 8.41| 3.66  
Footage| 2.62| 12.56| 5.55  
  
The first render after deleting each tool's own caches. ultrafast compiles its GPU pipelines, Remotion runs webpack without its cache, and HyperFrames extracts the video frames again. The operating system's file cache is kept, so this is not a cold boot.

One still frame at 5 s, warm median, seconds Scene| ultrafast| Remotion| HyperFrames  
---|---|---|---  
Title card| 0.34| 2.19| 1.52  
Chart| 0.35| 2.16| 1.52  
Footage| 0.82| 2.29| 2.10  
  
One PNG of frame 150 from each CLI: `ultrafast render --at 5`, `remotion still --frame=150`, `hyperframes snapshot --at 5`. It stands in for the time to a first preview frame.

## Fewer tokens to write it.

A separate count. The same 10-second vertical short was written for each tool the way its docs and agent skills teach: NASA footage, an animated title, three lines of detail, captions timed to each word, a grade and grain. Tokens counted with tiktoken `o200k_base`.

  1. ultrafast **1,234**
  2. Remotion **1,868**
  3. HyperFrames **1,680**
  4. Shotstack **1,657**

| Files written, whole| Typed after the scaffold| What the agent writes  
---|---|---|---  
ultrafast 0.1.1| **1,234**| **1,218**|  one JSON document  
Remotion 4.0.545| 1,868| 1,660| a React and TypeScript composition, a config line and two CLI commands  
HyperFrames 0.9.79| 1,680| 1,500| one HTML file (CSS and a GSAP timeline) and one CLI command  
Shotstack| 1,657| 1,657| an Edit JSON and an SRT file; written and validated, not rendered  
  
Counting only what is typed after each tool's own scaffold step, the ultrafast document is 19% fewer tokens than HyperFrames, and 27% fewer than Remotion and Shotstack.

The tokenizer is OpenAI's `o200k_base`, not Claude's: the ratios should roughly hold, and the absolute counts will differ. Counts depend on authoring style; each version is one competent way to write it, not a minimum. Shotstack's version was never rendered, because that needs an account, so whether its frames match is unknown; Shotstack is not in the render benchmark. Lockfiles, `node_modules`, untouched scaffold files, render commands and code the tools generate are not counted. Per-file counts and the method: [tokens/RESULTS.md](<https://github.com/ultrafastmov/benchmarks/blob/main/tokens/RESULTS.md>).

## How it was measured.

Each tool ran its own render command on the same workstation, with the clock running from launch until the MP4 was on disk.

### The machine

One workstation: an AMD Ryzen 9 9950X3D2 (16 cores, 32 threads), an NVIDIA GeForce RTX 5090 and Fedora Linux 45. ultrafast 0.1.1 (the release binary, on Vulkan), Remotion 4.0.545 and HyperFrames 0.9.79, each with the Chrome headless shell it pins.

### The videos

  * **Title card** , 1080×1920: a gradient, shapes, staggered type, a fade and a slide out.
  * **Chart** , 1920×1080: 12 bars growing with counters and labels, a target line drawing on, a legend.
  * **Footage** , 1080×1920: a NASA clip of Orion approaching the Moon, a push-in, a shade and word-timed karaoke captions.

Each is 10 s at 30 fps, so every render is 300 frames, written to an H.264 MP4 with `--crf 18` in all three tools. Each scene is written the way the tool's docs teach, with the same font files and the same clip.

### The clock

The number is the wall-clock time of the tool's own render command. It covers everything a user waits for: process start, bundling (Remotion), browser launch (Remotion and HyperFrames), GPU start-up and shader compilation (ultrafast), rendering, encoding and muxing. Warm is the median of 5 runs after one warm-up run. Cold is the first run after deleting the tool's own caches.

### A quiet machine

Before every run, the harness waited until no other renderer was working, other processes used at most 1.5 of the 32 CPU threads, and the GPU was under 15% busy. If other load showed up during a run, that run was thrown out and repeated. 560 runs counted. None had to be thrown out, and none failed.

Every output was checked with ffprobe: H.264, the right size, exactly 300 decoded frames, 10.0 s, 30 fps. A run counted only if its output passed.

### How “fastest found” was searched

ultrafast ran its default command only; its `export --workers` option was left at its default. Remotion and HyperFrames got their default command, and then:

  * **A concurrency sweep.** Remotion at 2, 4, 8, 12, 16, 24 and 32 browser tabs; HyperFrames at 2, 4, 8, 12, 16 and 24 workers; twice each. Both tools' docs say to find this setting by benchmarking.
  * **The maximum.** `--concurrency 32` for Remotion and `--workers 24` for HyperFrames.
  * **A prebuilt bundle.** Remotion rendering from `npx remotion bundle` made beforehand, so the timed command has no webpack step.
  * **GPU flags.** Remotion with `--gl=angle-egl`, the option its docs give for Linux, and with `--gl=vulkan`, swept again at 8 to 32 tabs from the prebuilt bundle. On this machine `angle-egl` ran on the integrated Radeon GPU; `vulkan` used the RTX 5090.
  * **NVENC.** Remotion with `--hardware-acceleration if-possible`, which Remotion allows only without `--crf`, so at NVENC's default quality. HyperFrames with `--gpu`, alone and with the sweep's worker count.

The headline compares ultrafast with each tool's default command (Remotion's uses 8 tabs here; HyperFrames' `--workers auto` chose 6) and with the fastest of all its configurations:

Scene| Remotion, fastest found| HyperFrames, fastest found  
---|---|---  
Title card| prebuilt bundle, `--gl=vulkan`, NVENC, `--concurrency 24`| `--workers 8`  
Chart| prebuilt bundle, `--gl=angle-egl`, `--concurrency 16`| `--workers 4`  
Footage| prebuilt bundle, `--gl=vulkan`, NVENC, `--concurrency 8`| `--workers 8`  
  
Every configuration with its timings, CPU, memory, GPU use and file size is in [the repository's README](<https://github.com/ultrafastmov/benchmarks#every-measured-configuration>).

## The same picture from all three.

The same six moments from each tool's video, one row per tool: ultrafast, then Remotion, then HyperFrames. Over all 300 frames, luma SSIM against ultrafast's video is 0.985 to 0.993 on the title card and chart, and 0.936 to 0.949 on the footage.

![Title card frames at 0.5, 1.5, 3, 5, 7 and 9.5 seconds from ultrafast, Remotion and HyperFrames, one row each. A yellow circle, a cyan shape and the words Make it move on a purple-to-pink gradient look the same in all three rows.](https://ultrafast.mov/img/bench/title.webp) Title card, 1080×1920. ![Footage frames at the same six moments from the three tools: NASA footage of the Moon with word-timed captions, one word highlighted in yellow. The rows match.](https://ultrafast.mov/img/bench/footage.webp) Footage, 1080×1920, NASA.

![Chart frames at the same six moments from the three tools: twelve blue bars growing to a pink final bar, with a target line and legend. The rows match.](https://ultrafast.mov/img/bench/chart.webp) Chart, 1920×1080. Contact sheets of all 10 frames per tool are in [frames/](<https://github.com/ultrafastmov/benchmarks/tree/main/frames>).

## The effects scene, reported apart.

A fourth scene, 1920×1080: blurred colour fields, a glowing title, a motion-blurred whip, grain and a vignette. It is not like-for-like, so it is not in the headline.

Blur, glow, motion blur and grain are cheap on a GPU and slow in Chrome. The three looks are also close, not identical: the grain is random noise drawn differently in each, and the blurs are computed differently. The scene shows the size of that effect, nothing more.

Warm median: ultrafast 0.97 s. Remotion 2.98 s at its fastest setting found, 5.95 s with its default command. HyperFrames 5.23 s at its fastest, 6.42 s by default.

![Effects frames at six moments from ultrafast, Remotion and HyperFrames: blurred purple, cyan and red fields behind a glowing GLOW title. The blur and the background differ between the rows.](https://ultrafast.mov/img/bench/effects.webp) Effects, 1920×1080: ultrafast, Remotion, HyperFrames. The looks differ.

## Where ultrafast does worse.

Read these before quoting a number.

### Bigger files

At the same nominal `--crf 18`, ultrafast's NVENC files for the title card, chart and footage are 2.0 to 4.4 times the size of the libx264 files from Remotion and HyperFrames. The title card is 2.7 MB, against 0.6 MB and 1.1 MB. On the effects scene they are about half the size.

### It needs a GPU

A Mac with Apple silicon, or Linux with a Vulkan GPU. Without one, the Docker image renders on the CPU through Mesa's software Vulkan driver, which is much slower. Remotion and HyperFrames need no GPU.

### No colour tags in 0.1.1

ultrafast 0.1.1 writes BT.709 H.264 with no colour tags in the file. Players that guess BT.601 for untagged HD video, such as FFmpeg-based tools, show its colours slightly off. A fix is planned for 0.1.2. Remotion writes BT.601 without tags; HyperFrames tags its files as BT.709.

### One machine

Every number comes from one workstation with a large GPU, on one night. That is a GPU engine against browser engines on hardware that suits the GPU engine. On a machine without a capable GPU the comparison is different.

### Other caveats

  * **The encoders differ.** CRF 18 on NVENC is not the same quality as CRF 18 on libx264. Swapping in NVENC barely moved the browser tools: HyperFrames with `--gpu` was 0.1 to 0.4 s slower than with libx264 at the same worker count, and Remotion with NVENC ranged from 0.22 s faster to 0.04 s slower.
  * **Most of ultrafast's time is start-up.** Of about 0.9 s per render, its own log gives 0.30 to 0.42 s for rendering and encoding the 300 frames. The rest is process and GPU start-up and muxing. Only 10-second videos were measured.
  * **Video decoding differs.** Remotion decodes the clip in every browser tab, so more tabs made it slower on the footage: 8.6 s at 8 tabs, 21.7 s at 32. HyperFrames extracts the frames once and reuses them on warm runs.
  * **“Cold” is not a cold boot.** ultrafast's cold run compiles its GPU pipelines, which adds about 1.6 to 1.8 s. The operating system's file cache is not dropped, and the browsers stay installed.
  * **Idiomatic, not hand-tuned.** Each scene is written the way the tool's docs teach. Someone who knows a tool well could probably make it faster. The source for all three is in the repository.

## Run it yourself.

You need Linux with cgroup v2 and systemd, an NVIDIA GPU with `nvidia-smi`, Node 22 or newer, Python 3, FFmpeg and ffprobe, and the ultrafast 0.1.1 release. A full run takes one to two hours.

```
git clone https://github.com/ultrafastmov/benchmarks
cd benchmarks
./setup.sh                               # the pinned npm packages, browsers and FFmpeg, in this folder
UF=/path/to/ultrafast ./run.sh --fresh   # the render benchmark; or put ultrafast 0.1.1 on PATH
pip install tiktoken && python3 tokens/tokens.py   # the token count
``` 

Nothing in it is random: the scenes are pure functions of time, and the runs go in a fixed order. `run.sh` writes `results.json`, `results/tables.md` and `frames/`. Product names belong to their owners.

## Make one and time it.

Install the engine and time a render on your own GPU.

`curl -fsSL https://ultrafast.mov/install.sh | sh` [Read the quickstart](<https://ultrafast.mov/docs/>)

Want it hosted? [Join the ultrafast Cloud waitlist](<https://ultrafast.mov/cloud/>).
