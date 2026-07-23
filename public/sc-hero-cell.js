/* sc-hero-cell.js - Live Cell hero (Three.js)
   Load: parallel three + RoomEnvironment via document import map.
   Runtime: pause off-screen / hidden tab; reduced-motion = static frame.
   Fail-soft: any WebGL/init error keeps the SVG poster visible.
*/

let THREE, RoomEnvironment;
const stageEl = document.getElementById('stage');

function heroFallback(err){
  if (stageEl) stageEl.style.display = 'none';
  console.warn('3D fallback:', err);
}

try{
  const [threeMod, roomMod] = await Promise.all([
    import('three'),
    import('three/addons/environments/RoomEnvironment.js')
  ]);
  THREE = threeMod;
  RoomEnvironment = roomMod.RoomEnvironment;
}catch(e){
  heroFallback(e);
}

if(THREE && stageEl){
try{
const canvas = stageEl;
/* Default powerPreference - "high-performance" fails WebGL on some GPUs */
const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  alpha: true
});
renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.92;
const scene = new THREE.Scene();
const pmrem = new THREE.PMREMGenerator(renderer);
scene.environment = pmrem.fromScene(new RoomEnvironment(renderer), 0.04).texture;
pmrem.dispose();

const camera = new THREE.PerspectiveCamera(38, 2, 0.1, 100);
camera.position.set(0.4, 1.5, 5.4);
camera.lookAt(0, 0.15, 0);

scene.add(new THREE.AmbientLight(0xF0F2F5, 0.35));
const key = new THREE.DirectionalLight(0xffffff, 2.6); key.position.set(3, 4, 5); scene.add(key);
const rim = new THREE.DirectionalLight(0x9CC4E8, 1.2); rim.position.set(-4, 2, -3); scene.add(rim);
const warm = new THREE.PointLight(0xE87722, 7, 12); warm.position.set(0, -1.6, 2.2); scene.add(warm);

const profile = [[0.001,0],[0.30,0],[0.30,0.55],[0.46,0.62],[0.46,1.45],[0.36,1.52],[0.36,2.25],[0.52,2.32],[0.52,3.05],[0.28,3.12],[0.28,3.8],[0.001,3.8]]
  .map(p => new THREE.Vector2(p[0], p[1]));
const shaftGeo = new THREE.LatheGeometry(profile, 96);
const steel = new THREE.MeshStandardMaterial({ color: 0x9BA2AB, metalness: 1.0, roughness: 0.3 });
const shaft = new THREE.Mesh(shaftGeo, steel);
shaft.rotation.z = -Math.PI / 2; shaft.position.x = -1.9;

const ring = new THREE.Mesh(new THREE.TorusGeometry(0.56, 0.15, 24, 72),
  new THREE.MeshStandardMaterial({ color: 0x8A9098, metalness: 1, roughness: 0.35 }));
ring.rotation.y = Math.PI / 2; ring.position.x = 0.55;

const chuckMat = new THREE.MeshStandardMaterial({ color: 0x2E3338, metalness: 0.9, roughness: 0.5 });
const chuck = new THREE.Mesh(new THREE.CylinderGeometry(0.62, 0.62, 0.5, 48), chuckMat);
chuck.rotation.z = Math.PI / 2; chuck.position.x = -2.15;
const jaws = new THREE.Group();
for (let i = 0; i < 3; i++) {
  const j = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.22, 0.24), new THREE.MeshStandardMaterial({ color: 0x4A5058, metalness: .9, roughness: .4 }));
  const a = i * Math.PI * 2 / 3;
  j.position.set(-1.92, Math.cos(a) * 0.42, Math.sin(a) * 0.42);
  j.rotation.x = -a; jaws.add(j);
}
const spin = new THREE.Group();
spin.add(shaft, ring, chuck, jaws);
scene.add(spin);

const grid = new THREE.GridHelper(14, 28, 0x8FB6D9, 0xC9D2DA);
grid.position.y = -1.35; grid.material.transparent = true; grid.material.opacity = 0.5;
scene.add(grid);

const probe = new THREE.Group();
const pBody = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.85, 20),
  new THREE.MeshStandardMaterial({ color: 0x4A5058, metalness: .9, roughness: .35 }));
pBody.position.y = 0.45;
const pTip = new THREE.Mesh(new THREE.SphereGeometry(0.055, 20, 16),
  new THREE.MeshStandardMaterial({ color: 0xE8536B, emissive: 0xE8536B, emissiveIntensity: 0.9, metalness: .4, roughness: .3 }));
const pCollar = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.1, 20),
  new THREE.MeshStandardMaterial({ color: 0x0055A4, metalness: .9, roughness: .3 }));
pCollar.position.y = 0.88;
probe.add(pBody, pTip, pCollar);
scene.add(probe);

const SN = 26;
const sparkGeo = new THREE.BufferGeometry();
sparkGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(SN * 3), 3));
const sparks = new THREE.Points(sparkGeo, new THREE.PointsMaterial({ color: 0xFFB36B, size: 0.05, transparent: true, opacity: 0 }));
sparks.visible = false; scene.add(sparks);
let sparkV = [], sparkT = 0;

const DN = 240, dPos = new Float32Array(DN * 3);
for (let i = 0; i < DN; i++) {
  dPos[i * 3] = (Math.random() - 0.5) * 9;
  dPos[i * 3 + 1] = (Math.random() - 0.5) * 4;
  dPos[i * 3 + 2] = (Math.random() - 0.5) * 4;
}
const dustGeo = new THREE.BufferGeometry();
dustGeo.setAttribute('position', new THREE.BufferAttribute(dPos, 3));
const dust = new THREE.Points(dustGeo, new THREE.PointsMaterial({ color: 0x0055A4, size: 0.02, transparent: true, opacity: 0.35 }));
scene.add(dust);

const stations = [
  { x: -1.55, r: 0.30, nom: 'D24.000' },
  { x: -0.95, r: 0.46, nom: 'D36.800' },
  { x: -0.05, r: 0.36, nom: 'D28.800' },
  { x: 0.62, r: 0.52, nom: 'D41.600' },
  { x: 1.45, r: 0.28, nom: 'D22.400' }
];
let stIdx = 0, phase = 'move', phaseT = 0, px = stations[0].x, py = 1.7;
probe.position.set(px, py, 0);
const mlabel = document.getElementById('mlabel');
const tX = document.getElementById('tX'), tZ = document.getElementById('tZ'), tProbe = document.getElementById('tProbe');
function burst(x, y, z) {
  const pos = sparkGeo.attributes.position.array; sparkV = [];
  for (let i = 0; i < SN; i++) {
    pos[i * 3] = x; pos[i * 3 + 1] = y; pos[i * 3 + 2] = z;
    sparkV.push([(Math.random() - 0.5) * 0.03, Math.random() * 0.03, (Math.random() - 0.5) * 0.03]);
  }
  sparkGeo.attributes.position.needsUpdate = true;
  sparks.visible = true; sparks.material.opacity = 1; sparkT = performance.now();
}
function fireLabel(st, off) {
  mlabel.innerHTML = st.nom + ' <span class="mu">' + (off >= 0 ? '+' : '') + off.toFixed(3) + '</span>';
  mlabel.classList.add('show');
  setTimeout(() => mlabel.classList.remove('show'), 1500);
}
let mx = 0, my = 0;
addEventListener('pointermove', e => { mx = (e.clientX / innerWidth - 0.5); my = (e.clientY / innerHeight - 0.5); }, { passive: true });

function resize() {
  const w = canvas.clientWidth || canvas.parentElement?.clientWidth || 640;
  const h = canvas.clientHeight || canvas.parentElement?.clientHeight || 430;
  if (w < 2 || h < 2) return;
  renderer.setSize(w, h, false);
  camera.aspect = w / h; camera.updateProjectionMatrix();
}
addEventListener('resize', resize); resize();

const glines = ['G01 X40.000 Z-12.000 F0.20', 'G02 X36.800 Z-24.500 R3.0', 'G01 Z-48.000 F0.18', 'M05 (SPINDLE STOP)', 'G28 U0 W0 (HOME)', 'M00 (MEASURE D41.6)', 'G04 X0.8 (DWELL)'];
let gi = 0; setInterval(() => { document.getElementById('gcode').textContent = glines[gi++ % glines.length]; }, 1400);
setInterval(() => { document.getElementById('tRpm').textContent = (1415 + Math.round(Math.random() * 10)); }, 700);

const v3 = new THREE.Vector3();
function placeLabel(st) {
  v3.set(st.x, st.r, 0); v3.project(camera);
  const w = canvas.clientWidth, h = canvas.clientHeight;
  mlabel.style.left = ((v3.x * 0.5 + 0.5) * w) + 'px';
  mlabel.style.top = ((-v3.y * 0.5 + 0.5) * h) + 'px';
}
let labelAnchor = null;

let running = false, inView = true, rafId = null, ready = false;
const reduced = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

function setRunning(on) {
  if (on && !running) { running = true; last = performance.now(); rafId = requestAnimationFrame(loop); }
  else if (!on && running) { running = false; if (rafId) cancelAnimationFrame(rafId); rafId = null; }
}
document.addEventListener('visibilitychange', () => {
  if (!ready || reduced) return;
  setRunning(!document.hidden && inView);
});
if ('IntersectionObserver' in window) {
  new IntersectionObserver((entries) => {
    inView = entries[0].isIntersecting;
    if (!ready || reduced) return;
    setRunning(inView && !document.hidden);
  }, { threshold: 0.01, rootMargin: '40px' }).observe(canvas.parentElement || canvas);
}

let last = performance.now();
function loop(now) {
  if (!running) return;
  rafId = requestAnimationFrame(loop);
  const dt = Math.min((now - last) / 1000, 0.05); last = now;
  spin.rotation.x += dt * 2.2;
  spin.rotation.y += ((mx * 0.3) - spin.rotation.y) * 0.04;
  scene.rotation.x += ((my * 0.12) - scene.rotation.x) * 0.04;
  dust.rotation.y += dt * 0.02;

  phaseT += dt;
  const st = stations[stIdx];
  if (phase === 'move') {
    px += (st.x - px) * Math.min(1, dt * 4); py += (1.7 - py) * Math.min(1, dt * 4);
    tProbe.textContent = 'MOVE';
    if (Math.abs(px - st.x) < 0.01 && phaseT > 0.6) { phase = 'down'; phaseT = 0; }
  } else if (phase === 'down') {
    py += ((st.r + 0.06) - py) * Math.min(1, dt * 6);
    tProbe.textContent = 'PROBE';
    if (py < st.r + 0.09) {
      phase = 'touch'; phaseT = 0;
      burst(st.x, st.r + 0.03, 0);
      fireLabel(st, (Math.random() - 0.35) * 0.03);
      labelAnchor = st;
    }
  } else if (phase === 'touch') {
    tProbe.textContent = 'READ';
    if (phaseT > 0.9) { phase = 'up'; phaseT = 0; }
  } else if (phase === 'up') {
    py += (1.7 - py) * Math.min(1, dt * 4);
    tProbe.textContent = 'RETRACT';
    if (py > 1.6) { phase = 'move'; phaseT = 0; stIdx = (stIdx + 1) % stations.length; labelAnchor = null; }
  }
  probe.position.set(px, py, 0);
  pTip.material.emissiveIntensity = phase === 'touch' ? 2.2 : 0.9;
  tX.textContent = (px >= 0 ? '+' : '') + px.toFixed(3);
  tZ.textContent = '-' + Math.abs(st.x).toFixed(3);
  if (labelAnchor) placeLabel(labelAnchor);

  if (sparks.visible) {
    const el = now - sparkT, pos = sparkGeo.attributes.position.array;
    for (let i = 0; i < SN; i++) {
      pos[i * 3] += sparkV[i][0];
      pos[i * 3 + 1] += sparkV[i][1] - el * 0.00004;
      pos[i * 3 + 2] += sparkV[i][2];
    }
    sparkGeo.attributes.position.needsUpdate = true;
    sparks.material.opacity = Math.max(0, 1 - el / 450);
    if (el > 450) sparks.visible = false;
  }
  renderer.render(scene, camera);
}

/* First frame: poster -> live canvas (only after a successful render) */
resize();
renderer.render(scene, camera);
canvas.classList.add('is-ready');
ready = true;

if (!reduced) {
  setRunning(true);
} else {
  canvas.classList.add('reduced');
}
}catch(e){
  heroFallback(e);
}
}
