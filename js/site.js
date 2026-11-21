// site.js: the print shop, run live. Every headline is already printed when
// it appears. One requestAnimationFrame loop drives the plates' registration
// (it drifts with scroll speed), the light table and the web press. Each part
// only runs on pages that have its element.
import { materials } from './gl.js';

const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const root = document.documentElement;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const easeInOut = t => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const INK = { pink: '#ff48b0', blue: '#0078bf', black: '#1d1b19', yellow: '#ffe800', red: '#d6332a' };
const rand = (a, b) => a + Math.random() * (b - a);
let vh = innerHeight;

// ---------------------------------------------------------------- materials
materials(['ink', 'cotton', 'iron', 'stamp', 'newsprint', 'canary', 'manila', 'kraft', 'thermal'], (name, url) => {
  const v = name === 'ink' ? '--ink-mask' : name === 'stamp' ? '--stamp-mask' : `--tex-${name}`;
  root.style.setProperty(v, `url(${url})`);
});

// ---------------------------------------------------------------- registration springs
// Every plate hangs on a spring. Scroll speed pulls each plate along its own
// direction; when the scroll stops they wobble back into register.
const springs = new Set();
function spring(el, opts = {}) {
  const a = rand(0, Math.PI * 2);
  const s = {
    el, x: 0, y: 0, vx: 0, vy: 0, dx: Math.cos(a), dy: Math.sin(a),
    gain: opts.gain ?? rand(0.0045, 0.009), k: rand(110, 190), c: rand(7, 11),
    bx: opts.bx ?? 0, by: opts.by ?? 0, extra: opts.extra || (() => ''), live: opts.live || (() => true), last: '',
  };
  springs.add(s);
  return s;
}
// How far scroll speed pushes the ink plates out of register: a fraction of
// the springs' gain, never more than INK_MAX px, so headlines stay readable.
const INK_SCROLL = 0.25, INK_MAX = 2;
function stepSprings(dt, vel) {
  const v = clamp(vel, -4000, 4000);
  for (const s of springs) {
    if (!s.live()) continue;
    const hv = (s.hov || 0) * 2;
    const push = clamp(v * s.gain * INK_SCROLL, -INK_MAX, INK_MAX) + hv;
    const tx = s.dx * push, ty = s.dy * push;
    s.vx += (s.k * (tx - s.x) - s.c * s.vx) * dt; s.x += s.vx * dt;
    s.vy += (s.k * (ty - s.y) - s.c * s.vy) * dt; s.y += s.vy * dt;
    const t = `translate3d(${(s.bx + s.x).toFixed(2)}px, ${(s.by + s.y).toFixed(2)}px, 0)${s.extra()}`;
    if (t !== s.last) { s.el.style.transform = t; s.last = t; }
  }
}

// ---------------------------------------------------------------- visibility
const seen = new Map();
const io = new IntersectionObserver(es => es.forEach(e => seen.set(e.target, e.isIntersecting)), { rootMargin: '10% 0px' });
const bands = $$('.band');
bands.forEach(s => io.observe(s));
const visible = el => !el || seen.get(el) !== false;
function onceVisible(el, ratio, fn) {
  if (!el) return;
  const o = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { o.disconnect(); fn(); } }), { threshold: ratio });
  o.observe(el);
}

// ---------------------------------------------------------------- formes (hero and install)
// A forme is a set of lines in a blind deboss, plus one clone per ink plate.
function forme(band, plates) {
  const deb = $('.deboss', band), host = deb.parentElement;
  const F = { band, deb, host, plates: {}, H: 1 };
  for (const p of plates) {
    const rv = document.createElement('div'); rv.className = 'reveal';
    const ly = deb.cloneNode(true); ly.className = `layer ink ${p}`;
    rv.appendChild(ly); host.appendChild(rv);
    const P = { rv, ly };
    P.s = spring(rv, { bx: rand(-2.2, 2.2), by: rand(-1.8, 1.8), live: () => visible(band) });
    F.plates[p] = P;
  }
  F.words = $$('.w', band);
  return F;
}
function arm(F) { F.band.classList.add('armed'); }
// fit a word to a measure on Anybody's width axis
function wdthFor(el, target, lo = 50, hi = 150) {
  for (let i = 0; i < 12; i++) {
    const mid = (lo + hi) / 2;
    el.style.fontVariationSettings = `"wdth" ${mid}`;
    if (el.getBoundingClientRect().width < target) lo = mid; else hi = mid;
  }
  return (lo + hi) / 2;
}
const setWdth = (els, w) => els.forEach(e => (e.style.fontVariationSettings = `"wdth" ${w.toFixed(2)}`));

// riso yellow, screened. `knock` is a list of rectangles the screen stops
// short of, as a printer would set it behind small type.
function halftone(canvas, density, cell = 8.5, knock = [], color = INK.yellow) {
  const r = canvas.getBoundingClientRect(), d = Math.min(devicePixelRatio || 1, 2);
  canvas.width = Math.round(r.width * d); canvas.height = Math.round(r.height * d);
  const g = canvas.getContext('2d');
  g.setTransform(d, 0, 0, d, 0, 0);
  g.clearRect(0, 0, r.width, r.height);
  g.fillStyle = color;
  g.beginPath();
  for (let y = cell / 2; y < r.height; y += cell) {
    for (let x = cell / 2; x < r.width; x += cell) {
      if (knock.some(k => x > k.x0 && x < k.x1 && y > k.y0 && y < k.y1)) continue;
      let v = density(x, y);
      if (v <= 0.02) continue;
      v *= 0.9 + 0.2 * Math.random();
      const rad = cell * (v < 0.785 ? Math.sqrt(v / Math.PI) : 0.5 + (v - 0.785) * 1.1);
      g.moveTo(x + rad, y); g.arc(x, y, rad, 0, Math.PI * 2);
    }
  }
  g.fill();
}
const knocks = (els, base, pad = 16) => els.map(el => {
  const b = el.getBoundingClientRect();
  return { x0: b.left - base.left - pad, x1: b.right - base.left + pad, y0: b.top - base.top - pad, y1: b.bottom - base.top + pad };
});
const sunburst = (cx, cy, R, r0, N, sun = 0) => (x, y) => {
  const dx = x - cx, dy = y - cy, d = Math.hypot(dx, dy);
  if (d < sun) return 0.42;
  if (d > R || d < r0) return 0;
  const a = Math.atan2(dy, dx) + Math.PI / 2;
  if (Math.floor(((a / (Math.PI * 2)) * N + N) % N) % 2) return 0;
  const f = 1 - (d - r0) / (R - r0);
  return 0.66 * (f < 0.5 ? 0.75 + 0.5 * f : 1.5 * f) * 0.85;
};
const layouts = [];   // run after fonts load and on resize
const steps = [];     // run every frame: (dt, now, vel)

// ---------------------------------------------------------------- hero: the printed headline
const hero = $('#top.hero'), bill = hero && $('.bill', hero);
if (bill) {
  const H = forme(hero, ['pink', 'blue', 'black']);
  layouts.push(() => {
    const sets = $$('.set', hero), set = $('.set', H.deb);
    const W = set.getBoundingClientRect().width;
    // sizes in proportion to the measure, as the engine poster sets them
    const s1 = 0.093 * W, s2 = 0.21 * W, s3 = 0.118 * W;
    for (const s of sets) {
      $('.l1', s).style.fontSize = s1 + 'px';
      $('.l2', s).style.fontSize = s2 + 'px';
      $('.l3', s).style.fontSize = s3 + 'px';
    }
    const fs1 = s1 * W / $('.l1', set).getBoundingClientRect().width;
    const word = $('.l2 .w', set);
    let wd = wdthFor(word, W), fs2 = s2;
    if (wd > 149) { fs2 = s2 * W / word.getBoundingClientRect().width; wd = 150; }
    const g = W * 0.016;
    for (const s of sets) {
      $('.l1', s).style.fontSize = fs1 + 'px';
      $('.l2', s).style.fontSize = fs2 + 'px';
      $('.rule2', s).style.margin = `${g * 0.9}px 0 ${g * 1.2}px`;
      $('.l3', s).style.margin = `${g * 0.6}px 0 0`;
    }
    setWdth(H.words, wd);
    arm(H);
  });
  layouts.push(() => {
    const cv = $('.ht', hero), hb = hero.getBoundingClientRect(), pb = $('.phone', hero).getBoundingClientRect();
    const cx = pb.left - hb.left + pb.width / 2, cy = pb.top - hb.top + pb.height * 0.55;
    halftone(cv, sunburst(cx, cy, Math.max(hb.width * 0.42, 560), 0, 30, pb.width * 0.62), 8.5, knocks($$('.knock', hero), hb));
  });

  // wet ink: pointing at the fresh print drags it
  let smudged = 0;
  const hint = $('.hint', bill);
  const showHint = () => { if (!hint) return; hint.classList.add('on'); setTimeout(() => hint.classList.remove('on'), 9000); };
  const cv = document.createElement('canvas'); cv.className = 'smudge'; cv.setAttribute('aria-hidden', 'true');
  cv.style.cssText = 'left:-40px;top:-40px';
  bill.appendChild(cv);
  const g = cv.getContext('2d');
  layouts.push(() => { const r = bill.getBoundingClientRect(); cv.width = Math.round(r.width + 80); cv.height = Math.round(r.height + 80); cv.style.width = cv.width + 'px'; cv.style.height = cv.height + 'px'; });
  let last = null, carry = 0, color = null;
  bill.addEventListener('pointermove', e => {
    if (e.pointerType === 'touch') { last = null; return; }
    const r = bill.getBoundingClientRect(), x = e.clientX - r.left + 40, y = e.clientY - r.top + 40;
    let hit = null;
    for (const el of document.elementsFromPoint(e.clientX, e.clientY)) {
      const lay = el.closest('.ink');
      if (lay && el.closest('[data-p]') && lay.contains(el)) { hit = lay.classList.contains('pink') ? 'pink' : lay.classList.contains('blue') ? 'blue' : 'black'; break; }
      if (el === bill) break;
    }
    if (hit) { color = INK[hit]; carry = 1; }
    if (last && color && carry > 0.04) {
      const dist = Math.hypot(x - last.x, y - last.y);
      if (dist > 0.5) {
        g.save();
        g.globalAlpha = 0.11 * carry; g.strokeStyle = color; g.lineCap = 'round'; g.lineWidth = 14 + 9 * carry;
        g.filter = 'blur(2.5px)';
        g.beginPath(); g.moveTo(last.x, last.y); g.lineTo(x, y); g.stroke();
        g.restore();
        carry *= Math.exp(-dist / (hit ? 400 : 140));
        if (!smudged++ && hint) hint.classList.remove('on');
      }
    }
    last = { x, y };
  });
  bill.addEventListener('pointerleave', () => (last = null));
  document.fonts.ready.then(() => setTimeout(showHint, reduce ? 0 : 1200));
}

// ---------------------------------------------------------------- printed headlines
// Heads are set at one size; a line only narrows on the width axis if it
// would overrun the column. The ink plates sit over the type, a little out
// of register.
const heads = [];
for (const h of $$('.pr')) {
  const names = (h.dataset.plates || 'pink black').split(' ');
  const html = h.innerHTML;
  const band = h.closest('.band');
  const plates = names.map((n, i) => {
    const s = document.createElement('span');
    s.className = 'pl'; s.setAttribute('aria-hidden', 'true'); s.innerHTML = html; s.style.color = INK[n];
    h.appendChild(s);
    s._sp = spring(s, { bx: i === 0 ? rand(0.8, 1.6) : 0, by: i === 0 ? rand(0.6, 1.3) : 0, gain: i === 0 ? rand(0.006, 0.01) : rand(0.002, 0.004), live: () => visible(band) });
    return s;
  });
  h.classList.add('plated');
  h.addEventListener('pointerenter', () => plates.forEach(p => (p._sp.hov = 1)));
  h.addEventListener('pointerleave', () => plates.forEach(p => (p._sp.hov = 0)));
  heads.push({ h, rows: [$$(':scope > .ln', h), ...plates.map(p => $$('.ln', p))] });
}
layouts.push(() => heads.forEach(S => {
  const W = S.h.parentElement.clientWidth;
  const base = parseFloat(getComputedStyle(S.h).fontSize);
  const fits = S.rows[0].map(ln => {
    ln.style.fontSize = base + 'px';
    ln.style.fontVariationSettings = '"wdth" 100';
    let wd = 100, fs = base;
    if (ln.getBoundingClientRect().width > W) {
      wd = wdthFor(ln, W, 50, 100);
      if (wd < 64) { wd = 64; ln.style.fontVariationSettings = '"wdth" 64'; fs = base * W / ln.getBoundingClientRect().width; }
    }
    return { fs, wd };
  });
  // One size per headline: if a line had to shrink, the others follow it down
  // (and re-fit their width at that size), so the lines read as one setting.
  const fs = Math.min(...fits.map(f => f.fs));
  if (fs < base) fits.forEach((f, i) => {
    if (f.fs > fs) {
      const ln = S.rows[0][i];
      ln.style.fontSize = fs + 'px'; ln.style.fontVariationSettings = '"wdth" 100';
      f.wd = ln.getBoundingClientRect().width > W ? Math.max(64, wdthFor(ln, W, 50, 100)) : 100;
    }
    f.fs = fs;
  });
  S.rows.forEach(row => row.forEach((ln, i) => {
    ln.style.fontSize = fits[i].fs + 'px';
    ln.style.fontVariationSettings = `"wdth" ${fits[i].wd.toFixed(2)}`;
  }));
}));

// ---------------------------------------------------------------- how it works: the light table
const table = $('#how');
if (table && $('#frame')) {
  const PLATES = [
    { id: 'backdrop', op: 'shader', img: 'backdrop', line: '<span class="k">"backdrop"</span>: { <span class="o">"op": "shader"</span>, "code": <span class="s">"// the wall, one window to the left…"</span> }' },
    { id: 'vessel', op: 'shader', img: 'vessel', line: '<span class="k">"vessel"</span>: { <span class="o">"op": "shader"</span>, "code": <span class="s">"// a lathe, its profile keyed…"</span>, "u4": { "keys": […] } }' },
    { id: 'dust, haze', op: 'particles', img: 'light', line: '<span class="k">"dust"</span>: { <span class="o">"op": "particles"</span>, "rate": 34, "life": [6, 9], "drag": 0.15 }' },
    { id: 'title', op: 'text', img: 'title', line: '<span class="k">"title"</span>: { <span class="o">"op": "text"</span>, "text": <span class="s">"Spin something new."</span>, "size": 176 }' },
    { id: 'studio, details', op: 'text, stack', img: 'details', line: '<span class="k">"details"</span>: { <span class="o">"op": "stack"</span>, "direction": <span class="s">"column"</span>, "gap": 9 }' },
    { id: 'vignette, grain', op: 'grain', line: '<span class="k">"grain"</span>: { <span class="o">"op": "grain"</span>, "amount": 0.05 }' },
  ];
  const frame = $('#frame'), doc = $('#doc');
  // Plate labels sit in a flat layer above the stage, pinned to each plate's
  // corner, so the plates above never cover them.
  const box3 = $('.table3d', table), tags = document.createElement('div');
  tags.className = 'tags3'; tags.setAttribute('aria-hidden', 'true'); box3.appendChild(tags);
  const pl3 = PLATES.map((P, i) => {
    const d = document.createElement('div'); d.className = 'pl3'; d.tabIndex = 0;
    d.setAttribute('role', 'button'); d.setAttribute('aria-label', `${P.id}: ${P.op}. Pull this plate.`);
    if (!P.img) {
      // the finish: a vignette and grain, drawn here rather than shipped as noise
      const cv = document.createElement('canvas'); cv.width = 270; cv.height = 480;
      const g = cv.getContext('2d'), im = g.createImageData(270, 480);
      for (let k = 0; k < im.data.length; k += 4) {
        const x = (k / 4) % 270 / 270 - 0.5, y = Math.floor(k / 4 / 270) / 480 - 0.5;
        const r = Math.min(1, Math.max(0, (Math.hypot(x * 1.1, y * 0.8) - 0.28) / 0.4));
        const v = Math.random() * 255; im.data[k] = im.data[k + 1] = im.data[k + 2] = v * (1 - r);
        im.data[k + 3] = 30 + r * r * 120;
      }
      g.putImageData(im, 0, 0); d.appendChild(cv);
    } else d.innerHTML = `<img src="/img/plates/clay_${P.img}.webp" width="540" height="960" alt="" decoding="async" loading="lazy">`;
    d.insertAdjacentHTML('beforeend', '<i class="edge"></i><i class="pin3"></i>');
    frame.appendChild(d);
    const tag = document.createElement('span'); tag.className = 'tag3';
    tag.innerHTML = `<b>${P.op}</b><span>${P.id}</span>`; tags.appendChild(tag);
    const li = document.createElement('li'); li.innerHTML = `<code>${P.line}</code>`; doc.appendChild(li);
    const st = { d, li, tag, pin: $('.pin3', d), lift: 0, out: 0, pulled: false };
    const hot = on => { st.hover = on; };
    for (const el of [d, li, tag]) { el.addEventListener('pointerenter', () => hot(true)); el.addEventListener('pointerleave', () => hot(false)); }
    const toggle = () => { st.pulled = !st.pulled; for (const el of [d, li, tag]) el.classList.toggle('pulled', st.pulled); };
    d.addEventListener('click', toggle); li.addEventListener('click', toggle); tag.addEventListener('click', toggle);
    d.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); } });
    return st;
  });
  // Frame / Plates: the table opens the frame into its plates when it comes
  // into view, then walks the plates one by one until you point at one.
  const LT = { e: 0, target: 0, walk: -1, next: 0 };
  const segs = $$('.seg button', table);
  const setView = v => { LT.target = v; if (reduce) LT.e = v; segs.forEach(b => b.setAttribute('aria-pressed', String(+b.dataset.view === v))); };
  segs.forEach(b => b.addEventListener('click', () => setView(+b.dataset.view)));
  setView(0);
  onceVisible($('.stage3d', table), 0.45, () => setTimeout(() => setView(1), reduce ? 0 : 450));
  layouts.push(() => {
    const st = $('.stage3d', table).getBoundingClientRect();
    frame.style.setProperty('--fw', Math.min(st.width * 0.44, 320, (st.height - 40) / 1.7778).toFixed(1) + 'px');
  });
  steps.push((dt, now) => {
    if (!visible(table)) { frame.classList.add('paused'); return; }
    frame.classList.remove('paused');
    LT.e += (LT.target - LT.e) * (1 - Math.exp(-dt * 3.4));
    const e = easeInOut(clamp(LT.e, 0, 1));
    const ax = 56 * e, az = -34 * e;
    frame.style.transform = `translateY(${(e * 24).toFixed(1)}px) rotateX(${ax.toFixed(2)}deg) rotateZ(${az.toFixed(2)}deg) scale(${(1 - 0.1 * e).toFixed(3)})`;
    frame.classList.toggle('exploded', e > 0.55); tags.classList.toggle('on', e > 0.55);
    const b3 = box3.getBoundingClientRect();
    const pointing = pl3.some(s => s.hover);
    if (reduce || pointing || e < 0.9) LT.walk = -1;
    else if (now > LT.next) { LT.walk = (LT.walk + 1) % pl3.length; LT.next = now + 1500; }
    const gap = 74 * e;
    pl3.forEach((s, i) => {
      const hh = s.hover || LT.walk === i;
      s.lift += ((hh ? 1 : 0) - s.lift) * (1 - Math.exp(-dt * 10));
      s.out += ((s.pulled ? 1 : 0) - s.out) * (1 - Math.exp(-dt * 7));
      const z = (i - (pl3.length - 1) / 2) * gap + s.lift * 30 * Math.max(e, 0.25);
      s.d.style.transform = `translate3d(${(s.out * 120).toFixed(1)}%, 0, ${z.toFixed(1)}px)`;
      s.d.classList.toggle('hot', hh); s.li.classList.toggle('hot', hh); s.tag.classList.toggle('hot', hh);
    });
    // after the plates move: pin each label to its plate's projected corner
    pl3.forEach(s => {
      const p = s.pin.getBoundingClientRect();
      s.tag.style.transform = `translate(${(p.left - b3.left).toFixed(1)}px, ${(p.top - b3.top).toFixed(1)}px)`;
    });
  });
}

// ---------------------------------------------------------------- speed: the counter and the web press
for (const counter of $$('.counter')) {
  const wheels = $$('.wheel', counter);
  for (const w of wheels) {
    const strip = document.createElement('span'); strip.className = 'strip';
    for (let k = 0; k < 40; k++) strip.insertAdjacentHTML('beforeend', `<span>${k % 10}</span>`);
    w.appendChild(strip);
  }
  const roll = () => wheels.forEach((w, i) => {
    const strip = $('.strip', w);
    strip.style.transitionDelay = (i * 0.18) + 's';
    strip.style.transform = `translateY(-${30 + +w.dataset.d}em)`;
  });
  if (reduce) roll(); else onceVisible(counter, 0.6, roll);
}
const webcv = $('canvas.web');
if (webcv) {
  const band = webcv.closest('.band');
  const web = { cv: webcv, x: 0, img: new Image(), g: webcv.getContext('2d') };
  web.img.src = webcv.dataset.sheet || '/media/examples/product.jpg';
  layouts.push(() => {
    const r = web.cv.getBoundingClientRect(), d = Math.min(devicePixelRatio || 1, 1.5);
    web.cv.width = Math.round(r.width * d); web.cv.height = Math.round(r.height * d); web.d = d; web.w = r.width; web.h = r.height;
  });
  steps.push((dt, now, vel) => {
    if (!visible(band) || !web.w) return;
    const g = web.g, d = web.d, W = web.w, Hh = web.h;
    const speed = reduce ? 0 : 70 + Math.min(5200, Math.abs(vel) * 2.2);
    const cw = 168, ch = 99, gap = 30, pitch = cw + gap;
    web.x = (web.x + speed * dt) % pitch;
    g.setTransform(d, 0, 0, d, 0, 0);
    g.clearRect(0, 0, W, Hh);
    const y0 = (Hh - ch) / 2 - 12;
    g.fillStyle = 'rgba(29,27,25,.10)'; g.fillRect(0, y0 - 6, W, 2); g.fillRect(0, y0 + ch + 28, W, 2);
    const blur = Math.min(10, speed / 260);
    const copies = blur > 1 ? 5 : 1;
    for (let x = -pitch + web.x; x < W + pitch; x += pitch) {
      for (let k = 0; k < copies; k++) {
        const ox = copies > 1 ? -k * blur * 2.2 : 0;
        g.globalAlpha = copies > 1 ? (k === 0 ? 0.55 : 0.22) : 1;
        g.fillStyle = '#fbf8f1'; g.fillRect(x + ox, y0, cw, ch + 18);
        if (web.img.complete && web.img.naturalWidth) g.drawImage(web.img, x + ox + 6, y0 + 6, cw - 12, ch - 6);
      }
    }
    g.globalAlpha = 1;
  });
}

// ---------------------------------------------------------------- review: the proof
for (const sheet of $$('.proofsheet')) {
  const mark = () => {
    $('.redpen', sheet)?.classList.add('drawn'); $('.notes', sheet)?.classList.add('on');
    setTimeout(() => $('.approved .stamp', sheet)?.classList.add('down'), reduce ? 0 : 2500);
    setTimeout(() => $('.slip', sheet)?.classList.add('on'), reduce ? 0 : 2900);
  };
  if (reduce) mark(); else onceVisible(sheet, 0.45, mark);
}

// ---------------------------------------------------------------- tickets and stamps
$$('.tk').forEach(t => t.style.setProperty('--r', rand(-2.2, 2.2).toFixed(2) + 'deg'));
for (const box of $$('[data-stamps]')) {
  const list = $$('.stamp', box), gap = +box.dataset.stamps || 140;
  onceVisible(box, 0.3, () => list.forEach((s, i) => setTimeout(() => s.classList.add('down'), reduce ? 0 : i * gap)));
}

// ---------------------------------------------------------------- install: the last sheet
const fin = $('#install');
const poster = fin && $('.poster', fin);
if (poster) {
  const FN = forme(fin, ['pink', 'black']);
  layouts.push(() => {
    const sets = $$('.fset', fin), set = $('.fset', FN.deb);
    const W = set.getBoundingClientRect().width;
    // the big word is set for nine letters; a longer one gets a smaller size, then widens to fill
    const big = W * 0.25 * Math.min(1, 9 / $('.f2 .w', set).textContent.trim().length);
    for (const s of sets) { $('.f1', s).style.fontSize = (W * 0.13) + 'px'; $('.f2', s).style.fontSize = big + 'px'; }
    const k = W / $('.f1', set).getBoundingClientRect().width;
    const wd = wdthFor($('.f2 .w', set), W);
    for (const s of sets) $('.f1', s).style.fontSize = (W * 0.13 * Math.min(k, 1.4) * 0.98) + 'px';
    setWdth(FN.words, wd);
    arm(FN);
  });
  layouts.push(() => {
    const cv = $('.ht', fin), r = fin.getBoundingClientRect();
    halftone(cv, sunburst(r.width / 2, r.height * 1.06, r.width * 0.62, r.width * 0.3, 34), 9, knocks([$('.finalcta', fin)], r, 18));
  });
}

// ---------------------------------------------------------------- videos: lazy, muted, paused offscreen
const vids = $$('video.lazy');
const synced = new Set($$('[data-sync] video.lazy'));
const vio = new IntersectionObserver(es => es.forEach(e => {
  const v = e.target;
  if (e.isIntersecting && !v.dataset.loaded) {
    $$('source', v).forEach(s => (s.src = s.dataset.src));
    v.load(); v.dataset.loaded = '1';
  }
  if (reduce || synced.has(v)) return;
  if (e.isIntersecting && e.intersectionRatio > 0.2) v.play().catch(() => {}); else v.pause();
}), { rootMargin: '400px 0px', threshold: [0, 0.2, 0.6] });
vids.forEach(v => vio.observe(v));
// a sync group plays its clips together and restarts them together
for (const grp of $$('[data-sync]')) {
  const gv = $$('video', grp);
  gv.forEach(v => { v.loop = false; });
  let ended = 0, on = false;
  const start = () => { ended = 0; gv.forEach(v => { v.currentTime = 0; v.play().catch(() => {}); }); };
  gv.forEach(v => v.addEventListener('ended', () => { if (++ended >= gv.length && on) start(); }));
  if (!reduce) new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting && !on) { on = true; Promise.all(gv.map(v => v.readyState >= 3 ? 0 : new Promise(r => v.addEventListener('canplay', r, { once: true })))).then(start); }
    else if (!e.isIntersecting && on) { on = false; gv.forEach(v => v.pause()); }
  }), { threshold: 0.25 }).observe(grp);
}

// a clip with a voice: the sound button restarts it with sound, or mutes it again
for (const b of $$('.snd')) {
  const v = $('video', b.closest('.sheet, .media, .vid, .clipframe'));
  b.addEventListener('click', () => {
    const on = v.muted;
    v.muted = !on;
    if (on) { v.currentTime = 0; v.play().catch(() => {}); }
    b.setAttribute('aria-pressed', String(on));
    b.textContent = on ? 'Sound off' : 'Sound on';
  });
  v.addEventListener('pause', () => { if (!v.muted && !v.ended) { v.muted = true; b.setAttribute('aria-pressed', 'false'); b.textContent = 'Sound on'; } });
}

// ---------------------------------------------------------------- a bigger view
// Click a film (or its enlarge button) to watch it larger in an overlay, with
// controls, from the moment it was at. Esc, the close button or a click
// outside the film closes it.
const lb = document.createElement('dialog');
lb.className = 'lightbox';
lb.setAttribute('aria-label', 'Film');
lb.innerHTML = '<figure class="lbin"><video controls playsinline loop></video><figcaption class="lbcap"></figcaption></figure>'
  + '<button class="lbx" type="button" aria-label="Close" autofocus>&times;</button>';
document.body.appendChild(lb);
const lbv = $('video', lb), lbcap = $('.lbcap', lb);
let lbFrom = null, lbAr = 16 / 9;
const fitFilm = () => {
  const W = innerWidth * 0.94, H = innerHeight - (innerWidth < 600 ? 120 : 140);
  const w = Math.min(W, H * lbAr);
  lbv.style.width = Math.round(w) + 'px'; lbv.style.height = Math.round(w / lbAr) + 'px';
};
function openFilm(v) {
  lbFrom = v;
  const r = v.getBoundingClientRect();
  lbAr = (v.videoWidth && v.videoHeight) ? v.videoWidth / v.videoHeight : (r.width / r.height || 16 / 9);
  // the page's sources, led by the full-size AV1 and HEVC copies when the film has them (data-full)
  const small = $$('source', v).map(s => ({ src: s.dataset.src || s.getAttribute('src'), type: s.type }));
  const full = v.dataset.full ? small.filter(s => /\.(av1|hevc)\.mp4$/.test(s.src))
    .map(s => ({ src: s.src.replace(/\.(av1|hevc)\.mp4$/, '.full.$1.mp4'), type: s.type })) : [];
  lbv.replaceChildren(...full.concat(small).map(s => {
    const n = document.createElement('source'); n.src = s.src; n.type = s.type; return n;
  }));
  lbv.poster = v.poster; lbv.muted = v.muted;
  lbcap.textContent = v.getAttribute('aria-label') || '';
  const t = v.currentTime || 0;
  lbv.addEventListener('loadedmetadata', () => { if (t) lbv.currentTime = t; lbv.play().catch(() => {}); }, { once: true });
  lbv.load(); fitFilm();
  v.pause();
  lb.showModal();
}
lb.addEventListener('close', () => {
  lbv.pause(); lbv.replaceChildren(); lbv.removeAttribute('src'); lbv.load();
  const v = lbFrom; lbFrom = null;
  if (v && !reduce && v.getBoundingClientRect().bottom > 0 && v.getBoundingClientRect().top < innerHeight) v.play().catch(() => {});
});
lb.addEventListener('click', e => { if (e.target === lb) lb.close(); });
$('.lbx', lb).addEventListener('click', () => lb.close());
addEventListener('resize', () => { if (lb.open) fitFilm(); });
const ENLARGE = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M9.5 2.5h4v4M13.5 2.5 9 7M6.5 13.5h-4v-4M2.5 13.5 7 9" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>';
for (const v of vids) {
  if (v.closest('a')) continue;
  const host = v.parentElement;
  if (getComputedStyle(host).position === 'static') host.style.position = 'relative';
  v.classList.add('zoomable');
  v.addEventListener('click', () => openFilm(v));
  const b = document.createElement('button');
  b.type = 'button'; b.className = 'enlarge'; b.innerHTML = ENLARGE;
  b.setAttribute('aria-label', 'Watch larger: ' + (v.getAttribute('aria-label') || 'film'));
  b.addEventListener('click', () => openFilm(v));
  host.appendChild(b);
}

// ---------------------------------------------------------------- copy, forms, nav
const flash = b => { b.classList.add('copied'); setTimeout(() => b.classList.remove('copied'), 1400); };
for (const b of $$('[data-copy]')) b.addEventListener('click', async () => {
  try { await navigator.clipboard.writeText(b.dataset.copy); } catch (e) { /* the text is still selectable */ }
  flash(b);
});
for (const b of $$('.code .copy')) b.addEventListener('click', async () => {
  const pre = b.closest('.code').querySelector('pre');
  try { await navigator.clipboard.writeText(pre.innerText.replace(/\n$/, '')); } catch (e) { /* selectable */ }
  const t = b.textContent; b.textContent = 'copied'; setTimeout(() => (b.textContent = t), 1400);
});
// The ultrafast Cloud waitlist. The email goes to the Apps Script web app in the form's action (waitlist/Code.js:
// urlencoded in, {success, already, message} out). t, the milliseconds the page has been open, is its bot check.
for (const f of $$('form[data-waitlist]')) f.addEventListener('submit', async e => {
  e.preventDefault();
  const note = $('.formnote', f), btn = $('button', f);
  const say = (t, cls) => { note.textContent = t; note.className = 'formnote' + (cls ? ' ' + cls : ''); };
  const done = t => { f.classList.add('done'); say(t, 'ok'); };
  const data = new FormData(f);
  if (data.get('website')) return done("You're on the list.");   // only bots fill the hidden field
  data.delete('website');
  data.set('t', String(Math.round(performance.now())));
  const url = f.getAttribute('action');
  if (!url) return say("The waitlist isn't connected yet.", 'err');
  btn.disabled = true; say('Adding you…');
  try {
    const r = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams(data) });
    const j = await r.json().catch(() => ({}));
    if (r.ok && j.success && j.already) done("You're already on the list.");
    else if (r.ok && j.success) done("You're on the list. We'll email you when ultrafast Cloud opens.");
    else if (r.status === 429) say('Too many tries from here. Wait a minute, then try again.', 'err');
    else say(j.message || "That didn't go through. Check the address and try again.", 'err');
  } catch (err) {
    say("Couldn't reach the waitlist. Try again in a minute.", 'err');
  }
  btn.disabled = false;
});
const nav = $('#nav');
const menu = $('details.menu');
if (menu) $$('.panel a', menu).forEach(a => a.addEventListener('click', () => menu.removeAttribute('open')));

// ---------------------------------------------------------------- the loop
let lastT = performance.now(), lastY = scrollY, vel = 0;
function tick(now) {
  const dt = Math.min(0.05, (now - lastT) / 1000) || 0.016; lastT = now;
  const v = (scrollY - lastY) / dt; lastY = scrollY;
  vel += (v - vel) * Math.min(1, dt * 9);
  if (!reduce) stepSprings(dt, vel);
  for (const s of steps) s(dt, now, vel);
  nav?.classList.toggle('scrolled', scrollY > 4);
  requestAnimationFrame(tick);
}
function layout() { vh = innerHeight; for (const f of layouts) f(); }
let rz, lastW = innerWidth;
addEventListener('resize', () => { if (innerWidth === lastW && Math.abs(innerHeight - vh) < 120) return; lastW = innerWidth; clearTimeout(rz); rz = setTimeout(layout, 120); });
document.fonts.ready.then(() => { layout(); requestAnimationFrame(tick); });
