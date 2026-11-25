# Op reference · all 70 ops · ultrafast docs

> Every ultrafast op with its ports, params, types and defaults: text, paths, video, captions, blocks, 3D, particles, fluid, shaders, transitions and looks.

URL: https://ultrafast.mov/docs/ops/

Docs

# 70 ops

Every op with its ports, params, types and defaults. `uf ops` prints the same as JSON.

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
  * [This page as Markdown](<https://ultrafast.mov/docs/ops/index.md>)

**Groups**

  1. Sources (14)
  2. Compositing (8)
  3. Color (8)
  4. Geometry and warps (8)
  5. 3D (5)
  6. Simulation and particles (4)
  7. Footage, sound and captions (4)
  8. Blocks (1)
  9. Shaders (1)
  10. Looks (17)

Params marked animatable take a constant, `{"keys": [...]}`, `{"expr": "..."}` or a driver (see [params and animation](<https://ultrafast.mov/docs/documents/#params>)). Ports are the node's `inputs`.

## Sources

### solid

flat color

color| color| fill color · default `#000000`  
---|---|---  
  
### gradient

linear, radial or conic gradient

kind| enum(linear | radial | conic)| gradient shape · default `linear`  
---|---|---  
a| color| start color (with b: a two-stop gradient)  
b| color| end color  
stops| text | number[]| "0:#ff0000, 1:#0000ff" or [pos,r,g,b,a,...], up to 8  
space| enum(linear | srgb)| interpolation space; srgb matches CSS/Figma · default `linear`  
start| vec2| linear: start point px · default `[0,0]`  
end| vec2| linear: end point px · default `[0,h]`  
center| vec2| radial/conic center px · default `frame center`  
radius| number| radial radius px · default `max(w,h)/2`  
angle| number| conic start angle, degrees · default `0`  
  
### shape

analytic rectangle / rounded rect / ellipse (SDF, antialiased)

kind| enum(rect | ellipse | circle)| shape · default `rect`  
---|---|---  
color| color| fill (or stroke) color · default `#ffffff`  
center| vec2| center px · default `frame center`  
size| vec2| width and height px · default `[w/4,w/4]`  
radius| number| corner radius px · default `0`  
rotation| number| degrees · default `0`  
scale| number | vec2| scale about the center (size, corners and stroke) · default `1`  
opacity| number| 0..1, fades the shape · default `1`  
stroke| number| outline width px; 0 fills · default `0`  
softness| number| edge softness in output pixels · default `1`  
  
### checker

checkerboard

a| color| first cell · default `#333333`  
---|---|---  
b| color| second cell · default `#666666`  
size| number| cell px · default `32`  
  
### noise

fractal simplex noise between two colors

a| color| low color · default `#000000`  
---|---|---  
b| color| high color · default `#ffffff`  
scale| vec2 | number| px per noise cell · default `[200,200]`  
offset| vec2| pan px · default `[0,0]`  
evolution| number| third noise dimension; animate it · default `0`  
octaves| number| 1..8 · default `4`  
  
### image

still image or image sequence

src| text| file path relative to the document; {frame} / {frame:05} for sequences  
---|---|---  
fit| enum(contain | cover | fill | none)| placement in the frame, or in `rect` (cover there by default); only fill stretches · default `contain`  
rect| vec4| [x,y,w,h] px box the picture goes in, by `fit`; it keeps its aspect ratio  
opacity| number| 0..1 · default `1`  
space| enum(linear | srgb)| interpolation space when scaled; srgb filters the encoded values as browsers do · default `linear`  
fps| number| sequence frame rate · default `document fps`  
first_frame| number| sequence frame number at local time 0 · default `0`  
  
### video

video clip, hardware decoded

src| text| file path  
---|---|---  
fit| enum(contain | cover | fill | none)| placement in the frame, or in `rect` (cover there by default); only fill stretches · default `contain`  
rect| vec4| [x,y,w,h] px box the footage goes in, by `fit`; it keeps its aspect ratio  
opacity| number| 0..1 · default `1`  
space| enum(linear | srgb)| interpolation space when scaled; srgb filters the encoded values as browsers do · default `linear`  
start| number| source seconds at local time 0 · default `0`  
speed| number| playback rate · default `1`  
loop| bool| wrap at the clip's end (else hold the last frame) · default `false`  
time| number| explicit source time (animate for time remapping)  
  
### path

vector path (SVG data or preset), GPU exact-coverage raster

to| text| SVG path data to morph toward; several separated by | to morph through each in turn  
---|---|---  
morph| number| 0 = this path, 1 = `to` (with several targets, 2 = the second, ...); animate it · default `0`  
d| text| SVG path data  
kind| enum(star | polygon | circle | line | polyline | polygon_points)| preset instead of d  
center| vec2| preset center · default `frame center`  
radius| number| preset radius · default `h/4`  
sides| number| star points / polygon sides · default `5 / 6`  
inner_radius| number| star inner radius · default `0.45 r`  
points| number[]| flat [x0,y0,x1,y1,...] for line/polyline/polygon_points  
color| color| paint · default `#ffffff`  
opacity| number| 0..1, fades the whole node (animate for fades) · default `1`  
fill_rule| enum(nonzero | evenodd)| fill rule · default `nonzero`  
trim_start| number| 0..1 of length · default `0`  
trim_end| number| 0..1 of length (animate for draw-on) · default `1`  
stroke| number| stroke width px; 0 fills · default `0`  
join| enum(miter | round | bevel)| stroke joins · default `miter`  
cap| enum(butt | round | square)| stroke caps · default `butt`  
dash| number[]| dash pattern [on, off, ...] px  
dash_offset| number| dash phase px · default `0`  
position| vec2| where the anchor lands, px · default `[0,0]`  
anchor| vec2| pivot in the node's own space, px · default `[0,0]`  
scale| vec2 | number| scale around the anchor · default `[1,1]`  
rotation| number| degrees, clockwise · default `0`  
  
### text

shaped text, GPU exact-coverage raster

text| text| content; \n breaks lines; *word* is emphasis (em_ params), [words]{color=#ffd23f highlight=#ff4d6d} styles a span  
---|---|---  
font| text| family name or font file path · default `Helvetica Neue`  
weight| number| 100..900 · default `400`  
style| enum(normal | italic)| style · default `normal`  
size| number| px · default `64`  
color| color| paint · default `#ffffff`  
opacity| number| 0..1, fades the whole node (animate for fades) · default `1`  
align| enum(left | center | right)| horizontal anchor of each line · default `left`  
valign| enum(top | middle | baseline | bottom)| vertical anchor of the block · default `top`  
width| number| wrap width px  
line_height| number| multiple of size · default `1.2`  
tracking| number| extra px between glyphs · default `0`  
features| text| OpenType features, e.g. "liga=0,ss01"  
variations| text| variable-font axes, e.g. "wdth=80, opsz=144" (weight drives wght; opsz follows size unless set)  
axis_<tag>| number| one variable-font axis, animatable: axis_wdth, axis_SOFT · default `axis default`  
stagger| number| seconds between glyphs for the glyph_* animators · default `0`  
stagger_order| enum(forward | reverse | center | random)| which glyphs go first · default `forward`  
glyph_offset| vec2| per-glyph offset px, keyed in glyph time (t - stagger * order) · default `[0,0]`  
glyph_scale| vec2| per-glyph scale about the glyph's center, glyph time · default `[1,1]`  
glyph_rotation| number| per-glyph rotation degrees, glyph time · default `0`  
glyph_opacity| number| per-glyph opacity, glyph time · default `1`  
reveal| number| glyphs visible (fractional fades) · default `all`  
reveal_softness| number| glyphs the reveal fade spans · default `1`  
reveal_offset| vec2| offset of not-yet-revealed glyphs px · default `[0,0]`  
fill_rule| enum(nonzero | evenodd)| fill rule · default `nonzero`  
skim| bool| glanced at, not read (code, data labels): ultrafast review skips its reading-time check · default `false`  
markup| bool| parse inline styling in text: *emphasis* and [words]{color=#ffd23f weight=800 font="ultrafast:serif" style=italic size=80 highlight=#ff4d6d underline=4 underline_color=#fff rise=10 draw=1} · default `true`  
em_color| color| color of *emphasis* · default `text color`  
em_font| text| face of *emphasis* (e.g. ultrafast:serif for a serif accent) · default `font`  
em_weight| number| weight of *emphasis* · default `weight`  
em_style| enum(normal | italic)| style of *emphasis* (italic is synthesized for faces without one) · default `italic when no em_ param is set`  
em_size| number| size px of *emphasis* · default `size`  
em_highlight| color| marker box behind *emphasis* · default `none`  
em_underline| number| underline thickness px under *emphasis* · default `0`  
em_underline_color| color| underline color · default `em_color`  
em_rise| number| baseline shift px of *emphasis* (up) · default `0`  
em_draw| number| share of the emphasis highlights and underlines drawn, 0..1, one stroke across lines in reading order (animate it) · default `1`  
on_path| text| SVG path data the text follows (closed paths wrap: circular badges); align picks start, middle or end  
path_offset| number| px along the path; animate it to run text along · default `0`  
number| number| show this value instead of text (animate it: counters)  
decimals| number| digits after the point for number · default `0`  
thousands| text| group separator for number ("" for none) · default `,`  
prefix| text| before number, e.g. $  
suffix| text| after number, e.g. % or k  
scramble| number| decoding text: animate 0 (all random) to 1 (the text)  
scramble_chars| text| characters the undecoded ones cycle through · default `A-Z, 0-9, symbols`  
stroke| number| stroke width px; 0 fills · default `0`  
join| enum(miter | round | bevel)| stroke joins · default `miter`  
cap| enum(butt | round | square)| stroke caps · default `butt`  
dash| number[]| dash pattern [on, off, ...] px  
dash_offset| number| dash phase px · default `0`  
position| vec2| where the anchor lands, px · default `[0,0]`  
anchor| vec2| pivot in the node's own space, px · default `[0,0]`  
scale| vec2 | number| scale around the anchor · default `[1,1]`  
rotation| number| degrees, clockwise · default `0`  
  
### svg

an SVG file (logo, icon, illustration) as vector paths: fills, strokes, gradients, blend modes, and text as outlines in the fonts the text op finds; `ultrafast import-svg` gives the same as editable nodes. It composites in sRGB, like a browser: put it on the film with an `over` in `srgb` space to match one there too

src| text| .svg file (relative to the document)  
---|---|---  
size| vec2 | number| fit inside [w, h] px, keeping its aspect · default `the SVG's own size`  
position| vec2| where the anchor lands, px · default `[0,0]`  
anchor| vec2| pivot in the artwork's px (after size) · default `[0,0]`  
scale| vec2 | number| scale around the anchor (stays vector-sharp) · default `[1,1]`  
rotation| number| degrees, clockwise · default `0`  
opacity| number| 0..1 · default `1`  
  
### lottie

a Lottie (Bodymovin) animation as editable ultrafast nodes: shape layers become paths with Lottie's keyframes, transforms stay vector; loops by default

src| text| Lottie .json file  
---|---|---  
size| vec2 | number| fit it into this box px · default `the animation's size`  
loop| bool| repeat over its duration · default `true`  
position| vec2| where its top-left (or anchor) lands px · default `[0,0]`  
anchor| vec2| pivot px in its fitted space · default `[0,0]`  
scale| vec2 | number| scale · default `[1,1]`  
rotation| number| degrees · default `0`  
opacity| number| 0..1 · default `1`  
  
### code

source code in a panel: syntax-highlighted, optionally typed on with a caret, line numbers, highlighted lines, window chrome

code| text| the source (\n between lines; tabs become 4 spaces)  
---|---|---  
language| enum(rust | python | js | ts | json | bash | go | swift | c | cpp | slang | sql | css | html | text)| how to color it · default `text`  
theme| enum(ultrafast | paper | mono)| colors (paper is light) · default `ultrafast`  
title| text| file name in the title bar  
window| bool| title bar with three dots · default `true`  
background| bool| the panel and its shadow · default `true`  
line_numbers| bool| gutter numbers · default `true`  
highlight| text| lines to mark, e.g. "3" or "2,5-7"  
highlight_at| number| when the marked lines light up · default `0`  
type_speed| number| characters per second typed on (0: all shown) · default `0`  
at| number| when typing starts · default `0`  
caret| bool| a blinking caret while and after typing · default `true`  
font| text| a monospaced face · default `ultrafast:mono`  
size| number| px · default `30 at 1080p`  
line_height| number| multiple of size · default `1.55`  
padding| number| px inside the panel · default `1.4 x size`  
radius| number| panel corner radius px · default `0.55 x size`  
width| number| panel width px · default `fits the longest line`  
position| vec2| top-left of the panel · default `centered`  
opacity| number| 0..1 · default `1`  
  
### marble

flowing marble/ink generator (half resolution by default)

filaments| number| default `0.8`  
---|---|---  
resolution| number| default `0.5`  
veins| number| default `1.0`  
  
### starfield

drifting starfield generator

speed| number| default `0.3`  
---|---|---  
travel| number| default `0.0`  
  
## Compositing

### over (fg, bg)

fg over bg (Porter-Duff)

opacity| number| fg opacity · default `1`  
---|---|---  
space| enum(linear | srgb)| blend space · default `linear`  
  
### blend (fg, bg)

blend modes (W3C)

mode| enum(normal | multiply | screen | overlay | darken | lighten | color_dodge | color_burn | hard_light | soft_light | difference | exclusion | hue | saturation | color | luminosity | add | subtract | divide)| mode · default `normal`  
---|---|---  
opacity| number| fg opacity · default `1`  
space| enum(linear | srgb)| blend space · default `linear`  
  
### composite (fg, bg)

Porter-Duff operators

operator| enum(in | out | atop | xor | plus | over)| operator · default `over`  
---|---|---  
  
### mask (source, matte)

track matte

mode| enum(alpha | alpha_inverted | luma | luma_inverted)| matte channel · default `alpha`  
---|---|---  
  
### mix (a, b)

crossfade

t| number| 0 = a, 1 = b · default `0.5`  
---|---|---  
  
### opacity (source)

multiply alpha

opacity| number| 0..1 · default `1`  
---|---|---  
  
### stack (in0, in1, in2, in3, in4, in5, in6, in7, in8, in9, in10, in11, in12, in13, in14, in15)

lays its inputs (in0, in1, ...: text, path, shape, svg or stack) out in a column or row by their measured bounds

direction| enum(column | row)| stack downward or rightward · default `column`  
---|---|---  
at| number| seconds at which children are measured (when their entrances have landed) · default `0`  
gap| number| px between children · default `24`  
align| enum(start | center | end)| children across the stack · default `start`  
position| vec2| where the block's anchor goes · default `[0,0]`  
anchor| enum(top_left | top | top_right | left | center | right | bottom_left | bottom | bottom_right)| which point of the block sits at position · default `top_left`  
  
### transition (a, b)

from shot `a` to shot `b` over `duration` s starting `at`: only a renders before, only b after

kind| enum(crossfade | dip | wipe | push | slide | iris | zoom | dissolve | glitch | blur)| how: dip goes through `color`; wipe/push/slide move along `direction`; iris opens from `center`; dissolve burns through noise · default `crossfade`  
---|---|---  
at| number| start, seconds · default `0`  
duration| number| seconds · default `0.8`  
direction| number| degrees: 0 moves rightward, 90 downward · default `0`  
softness| number| edge softness (blur: strength) · default `per kind`  
color| color| dip color; wipe and dissolve edge glow color (dissolve: ember #ff9a4a) · default `#000000`  
glow| number| edge glow strength · default `0 (dissolve 2)`  
center| vec2| iris and zoom center px · default `frame center`  
grain| number| dissolve noise size px · default `160`  
ease| text | number[]| progress easing: a name (in_out_cubic) or [x1, y1, x2, y2] · default `per kind`  
  
## Color

### adjust (source)

exposure, contrast, saturation, hue, brightness, gamma

exposure| number| stops (linear light) · default `0`  
---|---|---  
contrast| number| around mid grey · default `1`  
saturation| number| 0 = grey · default `1`  
hue| number| degrees · default `0`  
brightness| number| offset · default `0`  
gamma| number| gamma · default `1`  
  
### levels (source)

input/output levels with gamma

in_black| number| default `0`  
---|---|---  
in_white| number| default `1`  
gamma| number| default `1`  
out_black| number| default `0`  
out_white| number| default `1`  
  
### color_matrix (source)

4x5 matrix on straight linear RGBA

matrix| number[]| 20 numbers, row-major · default `identity`  
---|---|---  
  
### lut (source)

3D LUT color grade (.cube)

src| text| .cube file (3D LUT)  
---|---|---  
amount| number| 0..1 mix with the ungraded image · default `1`  
space| enum(srgb | linear)| what the LUT expects as input (most grading LUTs: srgb) · default `srgb`  
  
### invert (source)

invert colors

amount| number| 0..1 · default `1`  
---|---|---  
  
### tint (source)

map luminance between two colors

dark| color| shadows · default `#000000`  
---|---|---  
light| color| highlights · default `#ffffff`  
  
### threshold (source)

luminance threshold

level| number| default `0.5`  
---|---|---  
softness| number| default `0.01`  
  
### grade (source)

color grade looks 0..4 (look, amount)

amount| number| default `1.0`  
---|---|---  
look| number| default `0.0`  
  
## Geometry and warps

### crop (source)

keep a rectangle

rect| vec4| [x,y,w,h] px · default `frame`  
---|---|---  
softness| number| edge px · default `1`  
  
### transform (source)

2D transform (absorbed into paths/text for sharpness)

position| vec2| where the anchor lands · default `frame center`  
---|---|---  
anchor| vec2| pivot · default `frame center`  
scale| vec2 | number| scale · default `[1,1]`  
rotation| number| degrees · default `0`  
skew| number| degrees · default `0`  
  
### corner_pin (source)

perspective: map the frame (or source_rect) to four corners

corners| number[]| [tl, tr, br, bl] as 8 numbers · default `frame corners`  
---|---|---  
source_rect| vec4| [x,y,w,h] of the source mapped · default `frame`  
  
### wave (source)

sine displacement

amplitude| number| px · default `10`  
---|---|---  
wavelength| number| px · default `100`  
phase| number| degrees · default `0`  
direction| number| degrees · default `0`  
  
### twirl (source)

swirl around a center

center| vec2| default `frame center`  
---|---|---  
radius| number| default `min(w,h)/2`  
angle| number| degrees · default `90`  
  
### tile (source)

repeat a region

origin| vec2| default `[0,0]`  
---|---|---  
size| vec2| default `frame`  
  
### displace (source, map)

displace source by a map's red/green

amount| vec2| px · default `[20,20]`  
---|---|---  
  
### blur (source)

gaussian blur

radius| number| sigma px · default `8`  
---|---|---  
  
## 3D

### mesh (texture)

3D mesh (scene object for render3d)

primitive| enum(cube | plane | sphere | cylinder | cone | torus | text | path)| unit-sized primitive, or extruded text / SVG path · default `cube`  
---|---|---  
text| text| primitive text: content  
font| text| primitive text: family or file · default `Helvetica Neue`  
weight| number| primitive text: weight · default `400`  
style| enum(normal | italic)| primitive text: style · default `normal`  
size| number| primitive text: size in world units · default `1`  
align| enum(left | center | right)| primitive text: alignment · default `center`  
tracking| number| primitive text: extra spacing (px at 100 px/unit) · default `0`  
line_height| number| primitive text: multiple of size · default `1.2`  
d| text| primitive path: SVG path data  
units| number| primitive path: path px per world unit · default `100`  
depth| number| extrusion depth, world units · default `0.25`  
bevel| number| text/path: 45-degree chamfer on both rims, world units · default `0`  
src| text| .gltf/.glb file instead of a primitive  
segments| number| tessellation · default `32`  
position| vec3| default `[0,0,0]`  
rotation| vec3| degrees, X then Y then Z · default `[0,0,0]`  
scale| vec3 | number| default `[1,1,1]`  
color| color| base color · default `#cccccc`  
metallic| number| 0..1 · default `0`  
roughness| number| 0..1 · default `0.5`  
emissive| color| emitted light · default `#000000`  
transmission| number| glass: 0..1 of the scene behind seen through it (refracted) · default `0`  
ior| number| glass: index of refraction (water 1.33, glass 1.5, diamond 2.4) · default `1.45`  
thickness| number| glass: how far refracted rays travel inside, world units (more bends more) · default `0.5`  
dispersion| number| glass: color splitting (try 1..2) · default `0`  
opacity| number| 0..1 · default `1`  
  
### light

3D light (scene object)

kind| enum(directional | point)| default `directional`  
---|---|---  
direction| vec3| toward the light (directional) · default `[0.4,0.8,0.6]`  
position| vec3| point light position · default `[0,2,2]`  
color| color| default `#ffffff`  
intensity| number| default `3`  
  
### camera

3D camera (scene object)

position| vec3| default `[0,0,5]`  
---|---|---  
orbit| vec3| [azimuth, elevation, distance] around target (overrides position)  
target| vec3| default `[0,0,0]`  
up| vec3| default `[0,1,0]`  
fov| number| vertical, degrees · default `45`  
near| number| default `0.1`  
far| number| default `1000`  
  
### render3d (*)

renders connected meshes/lights/camera (any port names; camera on `camera`)

ambient| number| hemisphere light intensity · default `0.35`  
---|---|---  
sky| color| ambient from above · default `#e6f2ff`  
ground| color| ambient from below · default `#5a4d47`  
background| color| clear color · default `transparent`  
shadows| bool| the first directional light casts a shadow map · default `true`  
shadow_strength| number| 0 = no darkening, 1 = full · default `0.85`  
shadow_bias| number| depth bias in shadow-map texels (raise if surfaces self-shadow) · default `1`  
environment_intensity| number| scale of the image on the `environment` port (equirectangular; lights and reflects) · default `1`  
environment_rotation| number| turns the environment around +y, degrees · default `0`  
fog| vec2| [start, end] distance from the camera where surfaces fade into fog_color  
fog_color| color| fog color · default `background`  
aperture| number| depth of field: blur radius px far from focus (0 = off) · default `0`  
focus| number| depth of field: in-focus distance, world units · default `camera to target`  
  
### raymarch (in0, in1, in2, in3)

3D as a signed-distance scene marched per pixel: write float2 map(float3 p) -> (distance, material id); soft shadows, occlusion, a reflection bounce, environment and antialiasing come with it

scene| text| Slang: float2 map(float3 p) (+ optional void material(float id, float3 p, float3 n, inout float3 albedo, inout float metallic, inout float roughness)); helpers sdSphere, sdBox, sdCylinder, sdTorus, sdCapsule, sdBand, sdPlane, smin, opU, rotX/Y/Z, fbm3, knob(i), layerDistance + extrude (any ultrafast layer as a 3D solid), presetMaterial (ids 0 matte, 1 brass, 2 polished brass, 3 steel, 4 gold, 5 copper, 6 black lacquer, 7 ceramic, 8 rubber, 9 clear glass, 10 chrome; metallic < 0 makes glass); input(i, px) reads in0..in3  
---|---|---  
orbit| vec3| camera [azimuth, elevation, distance] around target, degrees and world units · default `[30,20,8]`  
target| vec3| what the camera looks at · default `[0,0,0]`  
fov| number| vertical, degrees · default `35`  
light| vec3| point light position (casts soft shadows) · default `[-4,5,4]`  
light_color| color| light color · default `#fff2e0`  
light_intensity| number| inverse-square intensity · default `40`  
environment| enum(studio | room | night | sky | lightbox | horizon)| what reflections and ambient light see (lightbox: bars of light, made for glass and chrome) · default `studio`  
background| text| environment, transparent (to composite over 2D), or a color · default `environment`  
background_level| number| brightness of an environment background · default `0.35`  
exposure| number| before tone mapping · default `1`  
samples| number| rays per pixel (1..8), jittered · default `2`  
bounce| bool| trace one reflection bounce for glossy surfaces · default `true`  
ior| number| glass index of refraction (materials with metallic < 0, preset 9) · default `1.5`  
dispersion| number| glass color splitting (0 none, 2 strong) · default `1`  
max_distance| number| rays stop here · default `80`  
k0| number| k0..k4: free knobs read as knob(0..4) in the scene (animatable)  
resolution| number| render scale · default `1`  
  
## Simulation and particles

### swarm

particles that assemble into text (or a path) and scatter: progress 0..1

text| text| what the particles form (or `d`)  
---|---|---  
d| text| SVG path data to form instead of text (offset by position)  
font| text| font family or file · default `Helvetica Neue`  
weight| number| font weight · default `400`  
style| enum(normal | italic)| font style · default `normal`  
tracking| number| extra px between glyphs · default `0`  
variations| text| variable-font axes, as on text  
axis_<tag>| number| one variable-font axis, as on text · default `axis default`  
size| number| text size px · default `64`  
position| vec2| text position (as `text`) · default `[0,0]`  
align| enum(left | center | right)| text alignment · default `left`  
valign| enum(top | middle | baseline | bottom)| vertical alignment · default `top`  
count| number| particles · default `4000`  
progress| number| 0 scattered, 1 formed; animate it · default `1`  
stagger| number| spread of arrival times (fraction of progress) · default `0.5`  
scatter| number| how far particles start from home, px · default `700`  
origin| vec2| start every particle from this point instead  
turbulence| number| drift amplitude while away from home, px · default `40`  
particle_size| vec2| size scattered and formed, px · default `[2,3]`  
color| color| color when formed · default `#ffffff`  
color_scatter| color| color when scattered · default `color`  
shimmer| number| 0..1 twinkle · default `0`  
stretch| number| streak along travel while moving · default `0`  
seed| number| random seed · default `1`  
blend| enum(over | add)| how particles combine · default `over`  
  
### particles (sprite)

deterministic particle system (closed form: scrub anywhere), drawn as sprites

seed| number| random seed · default `1`  
---|---|---  
rate| number| particles emitted per second · default `60`  
max| number| cap on particles alive · default `5000`  
life| vec2| lifetime range, s · default `[1.5,2.5]`  
position| vec2| emitter center px · default `[960,540]`  
emitter_size| vec2| emitter rectangle px · default `[0,0]`  
direction| number| degrees (-90 = up) · default `-90`  
spread| number| cone angle, degrees · default `30`  
speed| vec2| initial speed range, px/s · default `[200,400]`  
gravity| vec2| px/s^2 · default `[0,300]`  
drag| number| linear drag, 1/s · default `0`  
size| vec2| size at birth and death, px · default `[8,2]`  
size_jitter| number| 0..1 random size reduction · default `0.3`  
spin| vec2| rotation speed range, deg/s · default `[0,0]`  
color_start| color| color at birth · default `#ffffff`  
color_end| color| color at death · default `color_start`  
fade_in| number| fraction of life fading in · default `0.1`  
fade_out| number| fraction of life fading out · default `0.3`  
shape| enum(circle | square | spark | sprite)| sprite uses the `sprite` input · default `circle`  
stretch| number| spark stretch along velocity · default `0`  
blend| enum(over | add)| how particles combine · default `over`  
emit_start| number| emission start, s (negative pre-warms) · default `0`  
emit_end| number| emission end, s · default `forever`  
  
### fluid (dye, stir)

ink/smoke simulation: `dye` pours color in, `stir` pushes it around; stepped once per frame (exact on export, seekable)

start| number| local time the simulation starts (blank before) · default `0`  
---|---|---  
emit| number| how fast `dye` replaces the fluid where it is, per s · default `6`  
dissipation| number| dye fade per s · default `0.15`  
velocity_dissipation| number| motion fade per s · default `0.4`  
vorticity| number| keeps eddies curling (0 = silky, 10+ = churning) · default `4`  
turbulence| number| curl-noise stirring, px/s^2 (try 400..3000) · default `0`  
turbulence_scale| number| size of the noise eddies, px · default `260`  
wind| vec2| drift of everything, px/s · default `[0,0]`  
buoyancy| number| dye rises (smoke), px/s^2 per unit alpha · default `0`  
stir| number| push away from the edges of the `stir` image · default `2500`  
swirl| number| spin around the edges of the `stir` image · default `0`  
resolution| number| velocity grid, fraction of the frame · default `0.25`  
dye_resolution| number| dye grid, fraction of the frame · default `0.5`  
pressure_iterations| number| incompressibility solver iterations · default `24`  
substeps| number| steps per frame (1..8) · default `1`  
seed| number| turbulence pattern · default `1`  
  
### feedback (in0, in1, in2, in3)

agent Slang stepped once per frame on its own previous result: float4 update(float2 pos, float px) with prev(pos), input(i,pos), dt(), step_index()

code| text| Slang source defining update()  
---|---|---  
start| number| local time the simulation starts (blank before) · default `0`  
resolution| number| state grid, fraction of the frame · default `1`  
substeps| number| updates per frame (1..64) · default `1`  
u| number[]| up to 16 values, param(i)  
u0| number| u0..u15 individually (animatable)  
  
## Footage, sound and captions

### clip_camera

video framed on its speaker: faces are tracked from the footage (or given), then a follow camera with dead zone and eased pans, cuts on shots and speaker changes, scope zoom, protect mode (blurred cover behind the contained frame)

src| text| source video  
---|---|---  
faces| text| face tracks, inline as JSON text or a file: {sourceWidth, sourceHeight, fps, frames: [{frame, faces: [{id, x, y, w, h, talk, focus}]}], shots: [{startFrame, endFrame, protect, cinematicScope}]}; omit it and the clip's faces, who is talking and its cuts are tracked from the footage (`ultrafast faces` writes the same) · default `tracked from src`  
start| number| source seconds where the clip begins · default `0`  
duration| number| clip seconds · default `document duration`  
tuning| text| camera tuning overrides as JSON  
opacity| number| 0..1 · default `1`  
  
### captions

animated captions from word timings (karaoke, pop, reveal): pages laid out to fit, every word its own text node

src| text| transcript: Whisper/word JSON, .srt or .vtt  
---|---|---  
words| text| inline instead: lines of `start end word`, SRT text or JSON  
style| enum(karaoke | pop | reveal | plain)| karaoke lights the spoken word; pop pops each word on; reveal fades them on · default `karaoke`  
font| text| family or file · default `Helvetica Neue`  
size| number| px · default `6.5% of the short side`  
weight| number| 100..900 · default `800`  
color| color| words not yet spoken · default `#ffffff`  
highlight| color| the word being spoken · default `#ffd23f`  
spoken| color| words already spoken · default `color`  
highlight_background| color| a rounded pill behind the spoken word  
background| color| a rounded box behind each page  
uppercase| bool| set in capitals · default `false`  
tracking| number| extra px between glyphs · default `0`  
width| number| line width px · default `82% of the width`  
max_lines| number| lines per page · default `2`  
line_height| number| multiple of size · default `1.18`  
position| vec2| center of the caption block (moved into `safe` if it would cross it) · default `[w/2, 0.72 h]`  
align| enum(left | center | right)| line alignment · default `center`  
safe| enum(auto | social | margin | none)| area pages stay inside: auto is clear of the social apps' buttons and captions on a vertical frame (what `review --safe social` checks) and a 4% margin otherwise; none places them exactly at position · default `auto`  
linger| number| seconds a page stays after its last word · default `0.6`  
opacity| number| 0..1 · default `1`  
  
### audio

sound mixed into exports

src| text| any media file with audio  
---|---|---  
start| number| source seconds playing at local time `from` · default `0`  
gain| number| linear, animatable · default `1`  
from| number| local seconds the sound starts at (silent before) · default `0`  
duration| number| seconds it plays from `from` (0: until the source ends) · default `0`  
rate| number| playback speed with the pitch kept (time stretched) · default `1`  
  
### chroma_key (source)

keys out a green (or any) screen: key color r, g, b (sRGB 0..1), tolerance, softness, spill

b| number| default `0.25`  
---|---|---  
g| number| default `0.69`  
r| number| default `0.0`  
softness| number| default `0.08`  
spill| number| default `0.8`  
tolerance| number| default `0.12`  
  
## Blocks

### block

a ready-made animated block in one house style: title, lower_third, quote, stat, chapter, end_card, and charts: bar_chart, line_chart, donut (place it in time with a timing offset)

kind| enum(title | lower_third | quote | stat | chapter | end_card | bar_chart | line_chart | donut)| which block · default `title`  
---|---|---  
title| text| title / chapter / end_card / charts (above the chart)  
kicker| text| title, charts: small line above  
subtitle| text| title: line below  
number| text| chapter: its number, e.g. 01  
name| text| lower_third  
role| text| lower_third  
quote| text| quote  
author| text| quote  
value| number| stat: counts up to it · default `0`  
prefix| text| stat, bar and line values  
suffix| text| stat, bar and line values  
decimals| number| stat, bar and line values · default `0`  
label| text| stat  
tagline| text| end_card  
cta| text| end_card: a pill button  
logo| text| end_card: SVG file  
values| number[]| charts: the data, e.g. [24, 31, 58, 265]  
labels| text| charts: one per value, comma separated (or | when labels hold commas)  
highlight| number| charts: index of the value set in the accent and called out (-1: none) · default `bar, donut: the largest; line: the last`  
height| number| charts: plot height px · default `34% of the height`  
max| number| bar, line: the value at the top of the plot · default `largest value`  
min| number| line: the value at the baseline · default `0 or the smallest`  
color| color| bar: other bars; line: the line · default `muted (line: accent)`  
area| bool| line: fill under the line · default `true`  
draw_time| number| line: seconds the line takes to draw · default `1.6`  
colors| text| donut: segment colors, comma separated · default `accent, then a palette`  
radius| number| donut: outer radius px · default `fits the plot`  
thickness| number| donut: ring thickness px · default `30% of radius`  
number_font| text| stat, donut: the big number's face · default `ultrafast:wide`  
title_font| text| end_card: the title's face · default `ultrafast:wide`  
duration| number| seconds before it exits (end_card stays) · default `3.5 (lower_third 4, quote 5, chapter 2.5, charts 5)`  
ink| color| type color · default `#f6f3ee`  
muted| color| secondary type · default `ink at 72%`  
accent| color| rules, bars, quote mark, pill · default `#ff5c7a`  
display_font| text| headline face · default `ultrafast:display`  
text_font| text| body face · default `ultrafast:sans`  
mono_font| text| labels · default `ultrafast:mono`  
align| enum(left | center)| alignment (end_card is centered) · default `left`  
position| vec2| title/quote/stat: top of the block; lower_third: bottom-left; end_card: center · default `per kind`  
width| number| wrap width px · default `80% of the width`  
scale| number| size multiplier (sizes follow the frame) · default `1`  
opacity| number| 0..1 · default `1`  
  
## Shaders

### shader (in0, in1, in2, in3)

agent-written Slang: float4 shade(float2 pos, float px)

resolution| number| render at this fraction of the frame size and upscale (soft, costly looks; write shaders with pos/size()) · default `1`  
---|---|---  
code| text| Slang source defining shade(); `static const` tables of 64+ numbers are read from the params (editing their values compiles nothing)  
u| number[]| up to 16 values, param(i)  
u0| number| u0..u15 individually (animatable)  
motion_blur| bool| true: the format's motion blur samples its clock and animated u values (a shader that moves things); otherwise it holds at the frame's time · default `false`  
  
## Looks

### drop_shadow (source)

soft shadow under the source (color, opacity, offset, radius)

color| color| default `#000000`  
---|---|---  
offset| vec2| default `[8.0,8.0]`  
opacity| number| default `0.6`  
radius| number| default `12.0`  
  
### glow (source)

soft colored glow around the source

intensity| number| default `1.0`  
---|---|---  
radius| number| default `16.0`  
  
### vignette (source)

darkened edges (inner, outer colors)

inner| color| default `#00000000`  
---|---|---  
outer| color| default `#000000b0`  
  
### stroke_outline (source)

solid outline around the source's shape (color, width px)

color| color| default `#ffffff`  
---|---|---  
width| number| default `4.0`  
  
### bloom (source)

light bleeding from bright areas (threshold, radius, intensity, wide)

intensity| number| default `0.6`  
---|---|---  
radius| number| default `32.0`  
threshold| number| default `0.75`  
wide| number| default `0.3`  
  
### grain (source)

animated film grain (amount)

amount| number| default `0.07`  
---|---|---  
  
### aberration (source)

chromatic fringes toward the edges

amount| number| default `8.0`  
---|---|---  
  
### repeater (source)

count copies, each moved by (dx, dy), turned by rotate degrees and scaled by scale about (cx, cy), fading by fade: trails, radial arrays, tunnels

count| number| default `6.0`  
---|---|---  
cx| number| default `0.0`  
cy| number| default `0.0`  
dx| number| default `0.0`  
dy| number| default `0.0`  
fade| number| default `1.0`  
rotate| number| default `0.0`  
scale| number| default `1.0`  
  
### halftone (source)

riso halftone dots of one ink (cell, angle, r, g, b): sized by the source's coverage, or with tone 1 by how dark it is (to screen footage)

angle| number| default `15.0`  
---|---|---  
b| number| default `0.69`  
cell| number| default `9.0`  
g| number| default `0.28`  
r| number| default `1.0`  
seed| number| default `1.0`  
tone| number| default `0.0`  
  
### glitch (source)

digital glitch: slices, offsets, color splits

amount| number| default `0.5`  
---|---|---  
roll| number| default `0.35`  
tracking| number| default `0.3`  
  
### crt (source)

CRT screen: curvature, scanlines, aperture grille

phosphor| number| default `0.9`  
---|---|---  
  
### dot_matrix (source)

LED dot-matrix resampling

b| number| default `0.61`  
---|---|---  
cell| number| default `11.0`  
g| number| default `1.0`  
r| number| default `0.49`  
  
### glass_pane (source)

frosted, refracting glass pane over what is beneath

bend| number| default `36.0`  
---|---|---  
bevel| number| default `34.0`  
frost| number| default `26.0`  
gain| number| default `0.92`  
height| number| default `400.0`  
lift| number| default `0.06`  
light| number| default `1.0`  
radius| number| default `48.0`  
width| number| default `600.0`  
x| number| default `540.0`  
y| number| default `540.0`  
  
### lens_flare (source)

lens flare from a light at (x, y)

b| number| default `0.6`  
---|---|---  
g| number| default `0.82`  
intensity| number| default `1.0`  
r| number| default `1.0`  
x| number| default `1400.0`  
y| number| default `300.0`  
  
### light_leak (source)

warm film light leaks drifting over the frame

b| number| default `0.18`  
---|---|---  
g| number| default `0.45`  
intensity| number| default `0.6`  
r| number| default `1.0`  
speed| number| default `1.0`  
  
### film_look (source)

lens and film over the source: red halation, a hair of softness, grit, lifted blacks, grade, fringes, vignette, grain (hides the tells of plain 3D)

aberration| number| default `0.8`  
---|---|---  
grain| number| default `0.09`  
grit| number| default `0.35`  
halation| number| default `0.9`  
lift| number| default `0.03`  
saturation| number| default `0.82`  
softness| number| default `0.55`  
vignette| color| default `#000000b0`  
  
### engrave (source)

copperplate engraving: tone to hatching, contours inked, dark backdrop left as paper (spacing, backdrop, ink_*, paper_*)

backdrop| number| default `0.3`  
---|---|---  
ink_b| number| default `0.04`  
ink_g| number| default `0.07`  
ink_r| number| default `0.12`  
paper_b| number| default `0.76`  
paper_g| number| default `0.88`  
paper_r| number| default `0.93`  
spacing| number| default `6.0`
