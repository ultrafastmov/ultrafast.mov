// gl.js: the shop's materials, drawn once by the GPU when the page loads.
// Paper stocks, the iron press bed and the ink mask (the wood grain and salt
// that letterpress ink leaves) are tileable noise shaders, ported from the
// press kit in films/presskit.py. Each is rendered to a small tile, encoded
// to a blob URL and used as a CSS background or mask. Nothing is downloaded.

const HEAD = `precision highp float;
uniform vec2 uTile; uniform vec3 uBase; uniform float uFibre, uFleck, uSeed;
vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+10.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
vec3 fade(vec3 t){return t*t*t*(t*(t*6.0-15.0)+10.0);}
// Periodic classic Perlin noise (Stefan Gustavson, MIT): tiles every rep.
float pnoise(vec3 P, vec3 rep){
  vec3 Pi0=mod(floor(P),rep), Pi1=mod(Pi0+vec3(1.0),rep);
  Pi0=mod289(Pi0); Pi1=mod289(Pi1);
  vec3 Pf0=fract(P), Pf1=Pf0-vec3(1.0);
  vec4 ix=vec4(Pi0.x,Pi1.x,Pi0.x,Pi1.x), iy=vec4(Pi0.yy,Pi1.yy);
  vec4 iz0=Pi0.zzzz, iz1=Pi1.zzzz;
  vec4 ixy=permute(permute(ix)+iy), ixy0=permute(ixy+iz0), ixy1=permute(ixy+iz1);
  vec4 gx0=ixy0*(1.0/7.0); vec4 gy0=fract(floor(gx0)*(1.0/7.0))-0.5; gx0=fract(gx0);
  vec4 gz0=vec4(0.5)-abs(gx0)-abs(gy0); vec4 sz0=step(gz0,vec4(0.0));
  gx0-=sz0*(step(0.0,gx0)-0.5); gy0-=sz0*(step(0.0,gy0)-0.5);
  vec4 gx1=ixy1*(1.0/7.0); vec4 gy1=fract(floor(gx1)*(1.0/7.0))-0.5; gx1=fract(gx1);
  vec4 gz1=vec4(0.5)-abs(gx1)-abs(gy1); vec4 sz1=step(gz1,vec4(0.0));
  gx1-=sz1*(step(0.0,gx1)-0.5); gy1-=sz1*(step(0.0,gy1)-0.5);
  vec3 g000=vec3(gx0.x,gy0.x,gz0.x), g100=vec3(gx0.y,gy0.y,gz0.y), g010=vec3(gx0.z,gy0.z,gz0.z), g110=vec3(gx0.w,gy0.w,gz0.w);
  vec3 g001=vec3(gx1.x,gy1.x,gz1.x), g101=vec3(gx1.y,gy1.y,gz1.y), g011=vec3(gx1.z,gy1.z,gz1.z), g111=vec3(gx1.w,gy1.w,gz1.w);
  vec4 n0=taylorInvSqrt(vec4(dot(g000,g000),dot(g010,g010),dot(g100,g100),dot(g110,g110)));
  g000*=n0.x; g010*=n0.y; g100*=n0.z; g110*=n0.w;
  vec4 n1=taylorInvSqrt(vec4(dot(g001,g001),dot(g011,g011),dot(g101,g101),dot(g111,g111)));
  g001*=n1.x; g011*=n1.y; g101*=n1.z; g111*=n1.w;
  float n000=dot(g000,Pf0), n100=dot(g100,vec3(Pf1.x,Pf0.yz)), n010=dot(g010,vec3(Pf0.x,Pf1.y,Pf0.z)), n110=dot(g110,vec3(Pf1.xy,Pf0.z));
  float n001=dot(g001,vec3(Pf0.xy,Pf1.z)), n101=dot(g101,vec3(Pf1.x,Pf0.y,Pf1.z)), n011=dot(g011,vec3(Pf0.x,Pf1.yz)), n111=dot(g111,Pf1);
  vec3 f=fade(Pf0);
  vec4 nz=mix(vec4(n000,n100,n010,n110),vec4(n001,n101,n011,n111),f.z);
  vec2 nyz=mix(nz.xy,nz.zw,f.y);
  return 2.2*mix(nyz.x,nyz.y,f.x);
}
// cyc: whole cycles across the tile, so every layer wraps.
float N(vec2 p, vec2 cyc, float s){ return pnoise(vec3(p/uTile*cyc, s), vec3(cyc, 289.0)); }
float h21(vec2 p){ vec3 p3=fract(vec3(p.xyx)*0.1031); p3+=dot(p3,p3.yzx+33.33); return fract((p3.x+p3.y)*p3.z); }
vec2 P(){ return vec2(gl_FragCoord.x, uTile.y-gl_FragCoord.y); }
`;

const SHADERS = {
  // Paper: machine-direction streaks, cloudy formation, tooth, fibres, flecks.
  paper: `void main(){
  vec2 pos=P(); float s=uSeed;
  float f1=N(pos,vec2(4.0,52.0),s), f3=N(pos,vec2(10.0,10.0),s+5.0), f4=N(pos,vec2(56.0,56.0),s+9.0);
  float mottle=N(pos,vec2(3.0,3.0),s+7.0), tooth=N(pos,vec2(420.0,420.0),s+11.0);
  vec3 c=uBase*(1.0+uFibre*(0.012*f1+0.016*f3+0.010*f4)+0.02*mottle+0.02*tooth);
  float r=1.0-abs(N(pos,vec2(22.0,80.0),s+13.0));
  float m=smoothstep(0.05,0.5,N(pos,vec2(8.0,8.0),s+17.0));
  c*=1.0-smoothstep(0.94,0.995,r)*m*0.075*uFibre;
  float r2=1.0-abs(N(pos,vec2(80.0,26.0),s+19.0));
  c*=1.0+smoothstep(0.95,0.996,r2)*0.035*uFibre;
  vec2 cell=mod(floor(pos/2.0),uTile/2.0);
  float k=h21(cell+s*17.0);
  c*=1.0-step(1.0-uFleck,k)*0.45;
  gl_FragColor=vec4(clamp(c,0.0,1.0),1.0);
}`,
  // The press bed: cast iron with machining, scratches and old ink.
  iron: `void main(){
  vec2 pos=P();
  float m=N(pos,vec2(4.0,4.0),1.0)*0.5+N(pos,vec2(22.0,22.0),2.0)*0.25+N(pos,vec2(140.0,140.0),3.0)*0.14;
  vec3 c=vec3(0.098,0.094,0.092)*(1.0+0.24*m);
  float sc=smoothstep(0.988,1.0,1.0-abs(N(pos,vec2(3.0,64.0),5.0)))*smoothstep(0.1,0.6,N(pos,vec2(5.0,5.0),6.0));
  float sc2=smoothstep(0.99,1.0,1.0-abs(N(pos,vec2(48.0,4.0),7.0)))*smoothstep(0.2,0.7,N(pos,vec2(4.0,4.0),8.0));
  c+=(sc+sc2)*0.045;
  float pinkst=smoothstep(0.45,0.85,N(pos,vec2(3.0,3.0),9.0));
  float bluest=smoothstep(0.5,0.9,N(pos,vec2(2.0,3.0),10.0));
  c=mix(c,vec3(0.32,0.07,0.19),pinkst*0.22);
  c=mix(c,vec3(0.03,0.13,0.22),bluest*0.25);
  float sp=step(0.9975,h21(mod(floor(pos/2.0),uTile/2.0)));
  c+=sp*0.05;
  gl_FragColor=vec4(clamp(c,0.0,1.0),1.0);
}`,
  // Ink coverage for letterpress plates (alpha): wood grain and salt.
  ink: `void main(){
  vec2 pos=P();
  float warp=N(pos,vec2(2.0,2.0),1.0);
  float g=N(pos+vec2(0.0,warp*14.0),vec2(3.0,44.0),2.0);
  float knot=smoothstep(0.5,0.9,N(pos,vec2(5.0,5.0),9.0));
  float grain=smoothstep(0.2,0.8,g)*0.8+knot*0.3;
  float t=N(pos,vec2(220.0,220.0),3.0)*0.5+0.5, t2=N(pos,vec2(60.0,60.0),4.0)*0.5+0.5;
  float salt=smoothstep(0.64,0.9,t)*0.8+smoothstep(0.72,0.95,t2)*0.5;
  float dens=0.94+0.06*N(pos,vec2(4.0,4.0),6.0);
  float a=clamp(dens*(1.0-grain*0.36-salt*0.62),0.0,1.0);
  gl_FragColor=vec4(0.0,0.0,0.0,a);
}`,
  // Rubber stamp ink: patchy, with pressure falling off unevenly.
  stamp: `void main(){
  vec2 pos=P();
  float p=N(pos,vec2(3.0,3.0),21.0)*0.5+0.5;
  float t=N(pos,vec2(160.0,160.0),22.0)*0.5+0.5;
  float a=clamp(0.55+0.55*p-smoothstep(0.62,0.9,t)*0.7,0.0,1.0);
  gl_FragColor=vec4(0.0,0.0,0.0,a);
}`,
};

let gl, canvas, quad;
const programs = {};

function setup() {
  canvas = document.createElement('canvas');
  gl = canvas.getContext('webgl', { premultipliedAlpha: false, preserveDrawingBuffer: true, antialias: false });
  if (!gl) return false;
  quad = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, quad);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  return true;
}

function program(name) {
  if (programs[name]) return programs[name];
  const vs = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vs, 'attribute vec2 a; void main(){ gl_Position = vec4(a, 0.0, 1.0); }');
  gl.compileShader(vs);
  const fs = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(fs, HEAD + SHADERS[name]);
  gl.compileShader(fs);
  if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS)) { console.warn(gl.getShaderInfoLog(fs)); return null; }
  const p = gl.createProgram();
  gl.attachShader(p, vs); gl.attachShader(p, fs); gl.linkProgram(p);
  programs[name] = p;
  return p;
}

function draw(name, w, h, u = {}) {
  const p = program(name);
  if (!p) return false;
  canvas.width = w; canvas.height = h;
  gl.viewport(0, 0, w, h);
  gl.useProgram(p);
  const loc = gl.getAttribLocation(p, 'a');
  gl.bindBuffer(gl.ARRAY_BUFFER, quad);
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  gl.uniform2f(gl.getUniformLocation(p, 'uTile'), w, h);
  gl.uniform3fv(gl.getUniformLocation(p, 'uBase'), u.base || [1, 1, 1]);
  gl.uniform1f(gl.getUniformLocation(p, 'uFibre'), u.fibre ?? 1);
  gl.uniform1f(gl.getUniformLocation(p, 'uFleck'), u.fleck ?? 0);
  gl.uniform1f(gl.getUniformLocation(p, 'uSeed'), u.seed ?? 1);
  gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  return true;
}

function blob(type = 'image/webp', q = 0.9) {
  return new Promise(res => canvas.toBlob(b => res(b ? URL.createObjectURL(b) : null), type, q));
}

// Stocks: sRGB base, fibre strength, fleck density (from presskit.STOCKS).
export const STOCKS = {
  cotton: { base: [0.955, 0.930, 0.880], fibre: 0.8, fleck: 0.0012, seed: 2 },
  newsprint: { base: [0.880, 0.862, 0.808], fibre: 1.6, fleck: 0.0045, seed: 4 },
  kraft: { base: [0.735, 0.575, 0.395], fibre: 2.4, fleck: 0.0070, seed: 6 },
  manila: { base: [0.925, 0.860, 0.665], fibre: 1.2, fleck: 0.0025, seed: 8 },
  thermal: { base: [0.962, 0.958, 0.945], fibre: 0.25, fleck: 0.0004, seed: 9 },
  canary: { base: [0.975, 0.925, 0.560], fibre: 0.7, fleck: 0.0010, seed: 12 },
  film: { base: [0.93, 0.95, 0.97], fibre: 0.15, fleck: 0.0002, seed: 14 },
};

// Render the materials one at a time, yielding between them so the first
// paint and the opening print stay smooth. onEach(name, url) as each lands.
export async function materials(order, onEach) {
  if (!setup()) return false;
  const idle = () => new Promise(r => (window.requestIdleCallback ? requestIdleCallback(r, { timeout: 120 }) : setTimeout(r, 16)));
  for (const name of order) {
    await idle();
    let ok;
    if (name === 'iron') ok = draw('iron', 768, 768);
    else if (name === 'ink') ok = draw('ink', 512, 512);
    else if (name === 'stamp') ok = draw('stamp', 512, 512);
    else ok = draw('paper', 768, 768, STOCKS[name]);
    if (!ok) continue;
    const url = await blob(name === 'ink' || name === 'stamp' ? 'image/png' : 'image/webp', 0.9);
    if (url) onEach(name, url);
  }
  return true;
}
