/* sc-hero-cell.js — SectorCalc Live Cell v23
   Cinema-grade CNC turning cell. Fail-soft forever.
   - 4K-feel render (DPR≤2) + ACES controlled exposure (no blowout)
   - Brushed physical metals, soft contact shadows
   - Hot-core spark shader + streak trails
   - Full 360° orbit, frameToFit, optional env map
*/

const stageEl = document.getElementById('stage');
const heroRoot = document.querySelector('.sc-hero') || stageEl;
const posterEl = document.querySelector('.stage-poster');
let posterAnimStop = null;
let hudFallbackStarted = false;
let threeReady = false;

window.__SC_HERO_LIVE__ = false;
window.__SC_HERO_BUILD__ = 'v23';
window.__SC_HERO_ERR__ = null;

function reducedMotion() {
  try {
    return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  } catch (e) {
    return false;
  }
}

function startHudFallback() {
  if (hudFallbackStarted) return;
  hudFallbackStarted = true;
  window.__SC_HERO_LIVE__ = true;

  const gcodeEl = document.getElementById('gcode');
  const tRpmEl = document.getElementById('tRpm');
  const tProbe = document.getElementById('tProbe');
  const tX = document.getElementById('tX');
  const tZ = document.getElementById('tZ');
  const tMode = document.getElementById('tMode');
  const glines = [
    'G01 X40.000 Z-12.000 F0.20',
    'G02 X36.800 Z-24.500 R3.0',
    'G01 Z-48.000 F0.18',
    'M05 (SPINDLE STOP)',
    'G28 U0 W0 (HOME)',
    'M00 (MEASURE D41.6)',
    'G04 X0.8 (DWELL)'
  ];
  const stations = [
    { x: -1.35, label: 'D24.000' },
    { x: -0.75, label: 'D36.800' },
    { x: 0.05, label: 'D28.800' },
    { x: 0.65, label: 'D41.600' },
    { x: 1.35, label: 'D22.400' }
  ];
  const modes = ['MOVE', 'PROBE', 'READ', 'RETRACT'];
  let gi = 0;
  let si = 0;
  let mi = 0;

  setInterval(() => {
    if (threeReady) return;
    if (gcodeEl) gcodeEl.textContent = glines[gi++ % glines.length];
  }, 1400);
  setInterval(() => {
    if (threeReady) return;
    if (tRpmEl) tRpmEl.textContent = String(1415 + Math.round(Math.random() * 10));
  }, 700);
  setInterval(() => {
    if (threeReady) return;
    si = (si + 1) % stations.length;
    mi = (mi + 1) % modes.length;
    const st = stations[si];
    if (tProbe) tProbe.textContent = modes[mi];
    if (tMode) tMode.textContent = 'AUTO-MEASURE';
    if (tX) tX.textContent = (st.x >= 0 ? '+' : '') + st.x.toFixed(3);
    if (tZ) tZ.textContent = '-' + Math.abs(st.x).toFixed(3);
  }, 900);
}

function startPosterAnimator() {
  if (!posterEl || posterAnimStop) return;
  if (posterEl.tagName === 'IMG') return;
  const probe = posterEl.querySelector('.sp-probe');
  const readout = posterEl.querySelector('.sp-readout');
  const spin = posterEl.querySelector('.sp-spin');
  const readoutText = readout && readout.querySelector('text');
  if (!probe) return;
  posterEl.classList.add('is-js-anim');
  const stops = [
    { x: 0, y: 0, nom: 'D41.600', off: -0.006 },
    { x: 36, y: 18, nom: 'D36.800', off: 0.009 },
    { x: 72, y: 8, nom: 'D28.800', off: -0.012 },
    { x: 110, y: 22, nom: 'D24.000', off: 0.004 },
    { x: 148, y: 10, nom: 'D22.400', off: -0.008 }
  ];
  let i = 0;
  let spinX = 0;
  let dir = 1;
  const stepMs = reducedMotion() ? 1400 : 700;
  function paint() {
    if (threeReady) return;
    const s = stops[i % stops.length];
    probe.setAttribute('transform', 'translate(' + s.x + ' ' + s.y + ')');
    if (readout) {
      readout.setAttribute('transform', 'translate(' + s.x + ' ' + (s.y - 8) + ')');
      readout.setAttribute('opacity', '1');
    }
    if (readoutText) {
      const sign = s.off >= 0 ? '+' : '';
      readoutText.innerHTML =
        s.nom + ' <tspan fill="#E87722">' + sign + s.off.toFixed(3) + '</tspan>';
    }
    if (spin && !reducedMotion()) {
      spinX += 8 * dir;
      if (spinX > 28 || spinX < 0) dir *= -1;
      spin.setAttribute('transform', 'translate(' + spinX + ' 0)');
    }
    i += 1;
  }
  paint();
  const timer = setInterval(paint, stepMs);
  posterAnimStop = function stop() {
    clearInterval(timer);
    posterAnimStop = null;
  };
}

function stopPosterAnimator() {
  if (typeof posterAnimStop === 'function') posterAnimStop();
  if (posterEl) posterEl.classList.remove('is-js-anim');
}

function heroFallback(err) {
  window.__SC_HERO_ERR__ = String(err && err.message ? err.message : err);
  if (stageEl) {
    stageEl.classList.remove('is-ready');
    stageEl.style.opacity = '0';
  }
  console.warn('3D fallback:', err);
  startHudFallback();
  startPosterAnimator();
}

function waitUntilVisible(el) {
  return new Promise((resolve) => {
    if (!el) return resolve('visible');
    const rect = el.getBoundingClientRect();
    if (rect.bottom > 0 && rect.top < (window.innerHeight || 800) + 200) {
      return resolve('visible');
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          io.disconnect();
          resolve('visible');
        }
      },
      { rootMargin: '240px 0px' }
    );
    io.observe(el);
  });
}

async function loadThree() {
  async function loadPair(threeUrl, roomUrl) {
    const threeMod = await import(threeUrl);
    let RoomEnvironment = null;
    try {
      const roomMod = await import(roomUrl);
      RoomEnvironment = roomMod.RoomEnvironment || null;
    } catch (eRoom) {
      console.warn('RoomEnvironment import skipped:', eRoom && eRoom.message ? eRoom.message : eRoom);
    }
    return { THREE: threeMod, RoomEnvironment };
  }
  try {
    return await loadPair('three', 'three/addons/environments/RoomEnvironment.js');
  } catch (e1) {
    return await loadPair('/vendor/three/three.module.min.js', '/vendor/three/RoomEnvironment.js');
  }
}

/** Procedural brushed / cast textures — film-grade grit without external assets. */
function makeTex(THREE, kind) {
  const c = document.createElement('canvas');
  const N = kind === 'brush' ? 512 : 256;
  c.width = N;
  c.height = N;
  const ctx = c.getContext('2d');
  if (kind === 'brush') {
    ctx.fillStyle = '#9aa3ad';
    ctx.fillRect(0, 0, N, N);
    for (let y = 0; y < N; y++) {
      const g = 140 + ((y * 17) % 40);
      ctx.strokeStyle = 'rgba(' + g + ',' + (g + 4) + ',' + (g + 8) + ',' + (0.08 + (y % 7) * 0.01) + ')';
      ctx.beginPath();
      ctx.moveTo(0, y + 0.5);
      ctx.lineTo(N, y + ((y % 5) - 2) * 0.35);
      ctx.stroke();
    }
    for (let i = 0; i < 900; i++) {
      const x = Math.random() * N;
      const y = Math.random() * N;
      ctx.fillStyle = 'rgba(255,255,255,' + (Math.random() * 0.04) + ')';
      ctx.fillRect(x, y, 1.2, 0.6);
    }
  } else if (kind === 'cast') {
    const grd = ctx.createRadialGradient(N * 0.4, N * 0.35, 10, N * 0.5, N * 0.5, N * 0.7);
    grd.addColorStop(0, '#3a414a');
    grd.addColorStop(1, '#1a1e24');
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, N, N);
    for (let i = 0; i < 4200; i++) {
      const x = Math.random() * N;
      const y = Math.random() * N;
      const v = 18 + Math.random() * 40;
      ctx.fillStyle = 'rgba(' + v + ',' + (v + 2) + ',' + (v + 4) + ',' + (0.15 + Math.random() * 0.25) + ')';
      ctx.fillRect(x, y, 1 + Math.random() * 1.5, 1 + Math.random() * 1.5);
    }
  } else {
    ctx.fillStyle = '#b8c2cc';
    ctx.fillRect(0, 0, N, N);
    for (let i = 0; i < 1800; i++) {
      ctx.fillStyle = 'rgba(90,100,110,' + (Math.random() * 0.08) + ')';
      ctx.fillRect(Math.random() * N, Math.random() * N, 2, 2);
    }
  }
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.anisotropy = Math.min(8, (typeof rendererMaxAniso === 'number' ? rendererMaxAniso : 4));
  if ('colorSpace' in tex && THREE.SRGBColorSpace) tex.colorSpace = THREE.SRGBColorSpace;
  else if ('encoding' in tex && THREE.sRGBEncoding != null) tex.encoding = THREE.sRGBEncoding;
  tex.needsUpdate = true;
  return tex;
}

let rendererMaxAniso = 4;

function mat(THREE, hasEnv, o) {
  const C = THREE.MeshPhysicalMaterial || THREE.MeshStandardMaterial;
  const conf = {
    color: o.color,
    metalness: hasEnv ? o.metal : o.metal * 0.55,
    roughness: hasEnv ? o.rough : Math.min(0.78, o.rough + 0.1),
    map: o.map || null,
    roughnessMap: o.roughnessMap || null,
    bumpMap: o.bumpMap || null,
    bumpScale: o.bumpScale != null ? o.bumpScale : 0
  };
  if (C === THREE.MeshPhysicalMaterial) {
    if (o.clearcoat != null) conf.clearcoat = o.clearcoat;
    if (o.clearcoatRoughness != null) conf.clearcoatRoughness = o.clearcoatRoughness;
    if (o.envMapIntensity != null) conf.envMapIntensity = o.envMapIntensity;
    if (o.reflectivity != null) conf.reflectivity = o.reflectivity;
    if (o.ior != null) conf.ior = o.ior;
  }
  if (o.emissive != null) {
    conf.emissive = o.emissive;
    conf.emissiveIntensity = o.emissiveIntensity || 0.15;
  }
  return new C(conf);
}

function makeSparkMaterial(THREE) {
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uOpacity: { value: 0 },
      uTime: { value: 0 }
    },
    vertexShader: `
      attribute float aSize;
      attribute vec3 aColor;
      varying vec3 vColor;
      varying float vLife;
      uniform float uOpacity;
      void main() {
        vColor = aColor;
        vLife = uOpacity;
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        float dist = max(0.8, -mv.z);
        gl_PointSize = clamp(aSize * (72.0 / dist), 1.5, 14.0) * (0.7 + uOpacity * 0.45);
        gl_Position = projectionMatrix * mv;
      }
    `,
    fragmentShader: `
      varying vec3 vColor;
      varying float vLife;
      void main() {
        vec2 uv = gl_PointCoord - vec2(0.5);
        float d = length(uv);
        // Hard hot core + thin rim — no soft white fog bloom.
        float core = smoothstep(0.14, 0.0, d);
        float rim = smoothstep(0.42, 0.12, d) * (1.0 - core);
        float a = (core * 1.0 + rim * 0.35) * vLife;
        if (a < 0.04) discard;
        vec3 col = mix(vColor, vec3(1.0, 0.96, 0.88), core * 0.55);
        gl_FragColor = vec4(col * (0.75 + core * 0.9), a);
      }
    `
  });
}

async function boot() {
  if (!stageEl) return;
  startHudFallback();
  startPosterAnimator();
  await waitUntilVisible(heroRoot);
  const preferCalm = reducedMotion();

  let THREE, RoomEnvironment;
  try {
    const mods = await loadThree();
    THREE = mods.THREE;
    RoomEnvironment = mods.RoomEnvironment;
  } catch (e) {
    heroFallback(e);
    return;
  }

  try {
    const canvas = stageEl;
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
      failIfMajorPerformanceCaveat: false,
      stencil: false
    });
    const gl = renderer.getContext();
    if (!gl || (typeof gl.isContextLost === 'function' && gl.isContextLost())) {
      throw new Error('WebGL context unavailable');
    }
    try {
      rendererMaxAniso = renderer.capabilities.getMaxAnisotropy();
    } catch (eA) {}

    // Cinema sharpness without crushing midtones — ACES + conservative exposure.
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.9;
    if ('outputColorSpace' in renderer && THREE.SRGBColorSpace) renderer.outputColorSpace = THREE.SRGBColorSpace;
    if ('physicallyCorrectLights' in renderer) renderer.physicallyCorrectLights = true;

    let shadowsOk = false;
    try {
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      shadowsOk = true;
    } catch (e) {
      try { renderer.shadowMap.enabled = false; } catch (e2) {}
    }

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0xcfd8e0, 12, 28);

    let hasEnv = false;
    try {
      if (typeof RoomEnvironment === 'function') {
        const pmrem = new THREE.PMREMGenerator(renderer);
        scene.environment = pmrem.fromScene(new RoomEnvironment(renderer), 0.055).texture;
        hasEnv = true;
        try { pmrem.dispose(); } catch (eD) {}
      }
    } catch (eEnv) {
      console.warn('3D env map skipped:', eEnv && eEnv.message ? eEnv.message : eEnv);
    }

    const camera = new THREE.PerspectiveCamera(30, 2, 0.08, 80);
    const orbit = {
      target: new THREE.Vector3(0, -0.15, 0),
      radius: 6.4,
      elev: 0.38,
      azim: 0.85,
      speed: preferCalm ? 0.1 : 0.18,
      fitted: false
    };

    // Soft industrial studio — cool key, restrained bounce, no neon wash.
    scene.add(new THREE.AmbientLight(0xe8eef3, hasEnv ? 0.16 : 0.4));
    scene.add(new THREE.HemisphereLight(0xf4f7fa, 0x5a6570, hasEnv ? 0.32 : 0.7));

    const key = new THREE.DirectionalLight(0xfff6ec, hasEnv ? 1.65 : 2.2);
    key.position.set(5.2, 7.4, 3.6);
    if (shadowsOk) {
      key.castShadow = true;
      key.shadow.mapSize.set(2048, 2048);
      key.shadow.camera.near = 1;
      key.shadow.camera.far = 30;
      key.shadow.camera.left = -7;
      key.shadow.camera.right = 7;
      key.shadow.camera.top = 5.5;
      key.shadow.camera.bottom = -5.5;
      key.shadow.bias = -0.00015;
      key.shadow.normalBias = 0.028;
      key.shadow.radius = 2.2;
    }
    scene.add(key);

    const rim = new THREE.DirectionalLight(0xb7d0e4, hasEnv ? 0.62 : 0.95);
    rim.position.set(-6.2, 2.8, -3.4);
    scene.add(rim);

    const fill = new THREE.DirectionalLight(0xffffff, hasEnv ? 0.38 : 0.72);
    fill.position.set(-1.2, 2.4, 6.2);
    scene.add(fill);

    const bounce = new THREE.PointLight(0xffb070, hasEnv ? 2.2 : 3.4, 10, 2);
    bounce.position.set(0.6, -0.85, 2.2);
    scene.add(bounce);

    const tipGlow = new THREE.PointLight(0xff6a55, 0.35, 2.2, 2);
    scene.add(tipGlow);

    const flash = new THREE.PointLight(0xffd9a0, 0, 3.2, 2);
    scene.add(flash);

    const brushMap = makeTex(THREE, 'brush');
    brushMap.repeat.set(2.4, 1.2);
    const castMap = makeTex(THREE, 'cast');
    castMap.repeat.set(1.6, 1.6);
    const floorMap = makeTex(THREE, 'floor');
    floorMap.repeat.set(4, 4);

    const steel = mat(THREE, hasEnv, {
      color: 0xaeb6bf, metal: 0.94, rough: 0.28,
      map: brushMap, clearcoat: 0.35, clearcoatRoughness: 0.38, envMapIntensity: 0.82
    });
    const steelBright = mat(THREE, hasEnv, {
      color: 0xc4ccd4, metal: 0.96, rough: 0.18,
      map: brushMap, clearcoat: 0.55, clearcoatRoughness: 0.22, envMapIntensity: 0.95
    });
    const steelMirror = mat(THREE, hasEnv, {
      color: 0xd0d6dc, metal: 0.98, rough: 0.1,
      clearcoat: 0.7, clearcoatRoughness: 0.12, envMapIntensity: 1.05
    });
    const castIron = mat(THREE, hasEnv, {
      color: 0x2a3038, metal: 0.42, rough: 0.62,
      map: castMap, bumpMap: castMap, bumpScale: 0.012,
      clearcoat: 0.06, clearcoatRoughness: 0.78, envMapIntensity: 0.45
    });
    const paintBlue = mat(THREE, hasEnv, {
      color: 0x0a5aa8, metal: 0.28, rough: 0.34,
      clearcoat: 0.72, clearcoatRoughness: 0.18, envMapIntensity: 0.75,
      emissive: 0x001a33, emissiveIntensity: 0.06
    });
    const accent = mat(THREE, hasEnv, {
      color: 0xd96a18, metal: 0.35, rough: 0.42,
      emissive: 0xa84a10, emissiveIntensity: 0.18
    });
    const rubber = mat(THREE, hasEnv, { color: 0x14171b, metal: 0.04, rough: 0.92 });
    const glassDark = mat(THREE, hasEnv, {
      color: 0x0c1218, metal: 0.15, rough: 0.12,
      clearcoat: 1, clearcoatRoughness: 0.05, envMapIntensity: 1.1
    });

    function M(geo, material, px, py, pz, cast, receive, rx, ry, rz) {
      const m = new THREE.Mesh(geo, material);
      m.position.set(px || 0, py || 0, pz || 0);
      if (rx || ry || rz) m.rotation.set(rx || 0, ry || 0, rz || 0);
      if (cast != null) m.castShadow = !!cast;
      if (receive != null) m.receiveShadow = !!receive;
      return m;
    }

    const root = new THREE.Group();
    scene.add(root);

    const ground = M(new THREE.CircleGeometry(5.4, 96), new THREE.MeshStandardMaterial({
      color: 0xb4bec8, map: floorMap, metalness: 0.06, roughness: 0.9,
      transparent: true, opacity: 0.97
    }), 0, -1.48, 0, false, true, -Math.PI / 2, 0, 0);
    ground.name = 'ground';
    root.add(ground);

    // Soft reflection disc — subtle, not mirror blowout.
    const mirror = M(new THREE.CircleGeometry(3.6, 64), new THREE.MeshPhysicalMaterial({
      color: 0xc8d0d8, metalness: 0.55, roughness: 0.22, clearcoat: 0.4,
      clearcoatRoughness: 0.35, transparent: true, opacity: 0.22, envMapIntensity: 0.5
    }), 0, -1.472, 0, false, false, -Math.PI / 2, 0, 0);
    root.add(mirror);

    const grid = new THREE.GridHelper(8.2, 16, 0x6f9fc4, 0xa8b4c0);
    grid.position.y = -1.465;
    grid.name = 'grid';
    const gm = Array.isArray(grid.material) ? grid.material : [grid.material];
    gm.forEach((m) => { m.transparent = true; m.opacity = 0.22; });
    root.add(grid);

    const frameRoot = new THREE.Group();
    frameRoot.name = 'frameRoot';
    root.add(frameRoot);

    // Industrial bay — outside frameRoot so auto-fit stays machine-tight.
    const bay = new THREE.Group();
    bay.add(M(new THREE.BoxGeometry(7.2, 3.4, 0.08), new THREE.MeshStandardMaterial({
      color: 0x3a4450, metalness: 0.15, roughness: 0.88
    }), 0.1, 0.35, -2.15, false, true));
    bay.add(M(new THREE.BoxGeometry(6.6, 0.06, 0.1), paintBlue, 0.1, 1.85, -2.08));
    bay.add(M(new THREE.BoxGeometry(0.08, 3.0, 0.1), steel, -3.2, 0.35, -2.08));
    bay.add(M(new THREE.BoxGeometry(0.08, 3.0, 0.1), steel, 3.4, 0.35, -2.08));
    bay.add(M(new THREE.BoxGeometry(4.2, 0.06, 0.35), new THREE.MeshStandardMaterial({
      color: 0xf2f6fa, emissive: 0xdde6f0, emissiveIntensity: 0.55, metalness: 0.1, roughness: 0.4
    }), 0.1, 1.95, -1.7, false, false));
    const bayLamp = new THREE.PointLight(0xf5f8fc, hasEnv ? 3.2 : 4.5, 9, 2);
    bayLamp.position.set(0.1, 1.7, -1.4);
    bay.add(bayLamp);
    root.add(bay);

    // —— BED / WAYS ——
    const bed = new THREE.Group();
    bed.add(M(new THREE.BoxGeometry(5.7, 0.38, 1.52), castIron, 0.1, -1.22, 0, true, true));
    bed.add(M(new THREE.BoxGeometry(5.3, 0.12, 1.62), castIron, 0.1, -1.42, 0, true, true));
    bed.add(M(new THREE.BoxGeometry(4.95, 0.075, 0.22), steelBright, 0.15, -0.99, -0.42, true, true));
    bed.add(M(new THREE.BoxGeometry(4.95, 0.075, 0.22), steelBright, 0.15, -0.99, 0.42, true, true));
    bed.add(M(new THREE.BoxGeometry(4.7, 0.04, 0.95), rubber, 0.2, -1.03, 0, false, true));
    bed.add(M(new THREE.BoxGeometry(5.15, 0.05, 0.032), paintBlue, 0.1, -1.07, 0.78));
    bed.add(M(new THREE.BoxGeometry(5.15, 0.05, 0.032), paintBlue, 0.1, -1.07, -0.78));
    // Chip pan
    bed.add(M(new THREE.BoxGeometry(4.2, 0.08, 0.55), castIron, 0.2, -1.36, 0.95, true, true));
    bed.add(M(new THREE.BoxGeometry(0.2, 0.045, 0.2), accent, -2.45, -1.0, 0.58));
    bed.add(M(new THREE.BoxGeometry(0.2, 0.045, 0.2), accent, 2.45, -1.0, 0.58));
    // Foot pads
    for (const fx of [-2.5, 2.5]) {
      bed.add(M(new THREE.CylinderGeometry(0.14, 0.16, 0.08, 16), rubber, fx, -1.5, 0.55, false, true));
      bed.add(M(new THREE.CylinderGeometry(0.14, 0.16, 0.08, 16), rubber, fx, -1.5, -0.55, false, true));
    }
    frameRoot.add(bed);

    // —— HEADSTOCK ——
    const head = new THREE.Group();
    head.add(M(new THREE.BoxGeometry(1.28, 1.52, 1.32), castIron, -2.38, -0.26, 0, true, true));
    head.add(M(new THREE.BoxGeometry(1.08, 0.22, 1.12), paintBlue, -2.38, 0.58, 0, true, false));
    head.add(M(new THREE.BoxGeometry(0.9, 0.55, 0.06), glassDark, -2.38, 0.12, 0.68, false, false));
    // HMI bezel
    head.add(M(new THREE.BoxGeometry(0.72, 0.42, 0.04), castIron, -2.38, 0.15, 0.71));
    const hmi = M(new THREE.BoxGeometry(0.62, 0.32, 0.02), new THREE.MeshStandardMaterial({
      color: 0x0a1824, emissive: 0x1a6a9a, emissiveIntensity: 0.45, metalness: 0.2, roughness: 0.35
    }), -2.38, 0.15, 0.735);
    head.add(hmi);
    head.add(M(new THREE.CylinderGeometry(0.42, 0.48, 0.55, 48), steel, -1.78, 0, 0, true, true, 0, 0, Math.PI / 2));
    head.add(M(new THREE.CylinderGeometry(0.52, 0.52, 0.08, 48), steelBright, -1.5, 0, 0, true, false, 0, 0, Math.PI / 2));
    // Spindle flange bolts
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      head.add(M(
        new THREE.CylinderGeometry(0.035, 0.035, 0.06, 10),
        steelMirror,
        -1.46,
        Math.cos(a) * 0.42,
        Math.sin(a) * 0.42,
        false, false, 0, 0, Math.PI / 2
      ));
    }
    head.add(M(new THREE.BoxGeometry(0.55, 0.14, 0.04), rubber, -2.38, -0.58, 0.68));
    const led = new THREE.Mesh(new THREE.SphereGeometry(0.036, 14, 12), new THREE.MeshStandardMaterial({
      color: 0x2ecc71, emissive: 0x1a9a4a, emissiveIntensity: 0.85, metalness: 0.25, roughness: 0.35
    }));
    led.position.set(-2.22, 0.22, 0.7);
    head.add(led);
    // Cable conduit
    head.add(M(new THREE.CylinderGeometry(0.045, 0.045, 0.9, 12), rubber, -2.9, 0.1, -0.35, false, false, 0, 0, 0.4));
    frameRoot.add(head);

    // —— TAILSTOCK ——
    const tail = new THREE.Group();
    tail.add(M(new THREE.BoxGeometry(0.9, 1.0, 1.0), castIron, 2.58, -0.52, 0, true, true));
    tail.add(M(new THREE.BoxGeometry(0.7, 0.14, 0.7), paintBlue, 2.58, 0.05, 0, true, false));
    tail.add(M(new THREE.CylinderGeometry(0.125, 0.125, 0.78, 28), steelBright, 2.08, 0, 0, true, false, 0, 0, Math.PI / 2));
    tail.add(M(new THREE.ConeGeometry(0.085, 0.24, 24), steelMirror, 1.68, 0, 0, false, false, 0, 0, -Math.PI / 2));
    tail.add(M(new THREE.CylinderGeometry(0.08, 0.08, 0.12, 16), accent, 2.58, 0.2, 0.42, false, false));
    frameRoot.add(tail);

    // —— WORKPIECE / CHUCK ——
    const spin = new THREE.Group();
    const profile = [
      [0.001, 0], [0.255, 0], [0.255, 0.38], [0.415, 0.46], [0.415, 1.12], [0.315, 1.22],
      [0.315, 1.88], [0.475, 1.96], [0.475, 2.58], [0.235, 2.66], [0.235, 3.18], [0.001, 3.18]
    ].map((p) => new THREE.Vector2(p[0], p[1]));
    spin.add(M(new THREE.LatheGeometry(profile, 128), steelMirror, -1.55, 0, 0, true, true, 0, 0, -Math.PI / 2));
    // Turned highlight groove
    spin.add(M(new THREE.TorusGeometry(0.42, 0.018, 12, 64), steelBright, 0.05, 0, 0, false, false, 0, Math.PI / 2, 0));
    spin.add(M(new THREE.BoxGeometry(3.05, 0.028, 0.055), accent, 0.05, 0.36, 0, true, false));
    spin.add(M(new THREE.TorusGeometry(0.5, 0.11, 24, 72), steel, 0.55, 0, 0, true, true, 0, Math.PI / 2, 0));
    spin.add(M(new THREE.CylinderGeometry(0.7, 0.76, 0.52, 56), castIron, -1.9, 0, 0, true, true, 0, 0, Math.PI / 2));
    spin.add(M(new THREE.CylinderGeometry(0.56, 0.56, 0.09, 56), steelBright, -1.62, 0, 0, true, false, 0, 0, Math.PI / 2));
    for (let i = 0; i < 3; i++) {
      const jaw = new THREE.Group();
      jaw.add(M(new THREE.BoxGeometry(0.32, 0.2, 0.26), steel, 0, 0, 0, true, false));
      jaw.add(M(new THREE.BoxGeometry(0.15, 0.13, 0.17), steelBright, 0.19, 0, 0, true, false));
      jaw.add(M(new THREE.BoxGeometry(0.08, 0.06, 0.1), steelMirror, 0.28, 0, 0, false, false));
      const a = (i * Math.PI * 2) / 3;
      jaw.position.set(-1.58, Math.cos(a) * 0.4, Math.sin(a) * 0.4);
      jaw.rotation.x = -a;
      spin.add(jaw);
    }
    frameRoot.add(spin);

    // —— GANTRY / PROBE ——
    const gantry = new THREE.Group();
    gantry.add(M(new THREE.BoxGeometry(0.22, 2.0, 0.22), castIron, 0.15, 0.42, -1.08, true, true));
    gantry.add(M(new THREE.BoxGeometry(0.16, 0.16, 1.12), paintBlue, 0.15, 1.3, -0.52, true, false));
    gantry.add(M(new THREE.BoxGeometry(0.1, 0.1, 0.85), steel, 0.15, 1.15, -0.4, true, false));
    // Cable chain
    for (let i = 0; i < 7; i++) {
      gantry.add(M(
        new THREE.BoxGeometry(0.08, 0.05, 0.07),
        rubber,
        0.28,
        1.22 - i * 0.08,
        -0.95 + i * 0.08,
        false, false
      ));
    }
    const probe = new THREE.Group();
    const pBody = M(new THREE.CylinderGeometry(0.042, 0.042, 0.88, 20), steel, 0, 0.46, 0, true, false);
    const pTip = new THREE.Mesh(new THREE.SphereGeometry(0.05, 20, 16), new THREE.MeshStandardMaterial({
      color: 0xe24a62, emissive: 0xb83248, emissiveIntensity: 0.7, metalness: 0.35, roughness: 0.28
    }));
    const pCollar = M(new THREE.CylinderGeometry(0.095, 0.095, 0.1, 20), paintBlue, 0, 0.9, 0, true, false);
    const coolant = M(new THREE.CylinderGeometry(0.02, 0.02, 0.35, 10), accent, 0.12, 0.55, 0.08, false, false, 0.5, 0, 0.3);
    probe.add(pBody, pTip, pCollar, coolant);
    gantry.add(probe);
    frameRoot.add(gantry);

    // —— SPARKS (crisp hot-core + tangential streaks, no white fog) ——
    const SN = 110;
    const sparkPos = new Float32Array(SN * 3);
    const sparkSize = new Float32Array(SN);
    const sparkCol = new Float32Array(SN * 3);
    const sparkGeo = new THREE.BufferGeometry();
    sparkGeo.setAttribute('position', new THREE.BufferAttribute(sparkPos, 3));
    sparkGeo.setAttribute('aSize', new THREE.BufferAttribute(sparkSize, 1));
    sparkGeo.setAttribute('aColor', new THREE.BufferAttribute(sparkCol, 3));
    const sparkMat = makeSparkMaterial(THREE);
    const sparks = new THREE.Points(sparkGeo, sparkMat);
    sparks.frustumCulled = false;
    sparks.visible = false;
    root.add(sparks);

    const streakGeo = new THREE.BufferGeometry();
    const streakPos = new Float32Array(SN * 2 * 3);
    streakGeo.setAttribute('position', new THREE.BufferAttribute(streakPos, 3));
    const streaks = new THREE.LineSegments(streakGeo, new THREE.LineBasicMaterial({
      color: 0xff9a3a,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    }));
    streaks.frustumCulled = false;
    streaks.visible = false;
    root.add(streaks);

    const flashOrb = new THREE.Mesh(
      new THREE.SphereGeometry(0.028, 12, 10),
      new THREE.MeshBasicMaterial({
        color: 0xffc878, transparent: true, opacity: 0,
        blending: THREE.AdditiveBlending, depthWrite: false
      })
    );
    flashOrb.visible = false;
    root.add(flashOrb);

    let sparkV = [];
    let sparkT = 0;
    let sparkLife = 0;

    // Coolant mist — restrained
    const MN = 55;
    const mistPos = new Float32Array(MN * 3);
    for (let i = 0; i < MN; i++) {
      mistPos[i * 3] = (Math.random() - 0.5) * 4.2;
      mistPos[i * 3 + 1] = Math.random() * 1.5 - 0.5;
      mistPos[i * 3 + 2] = (Math.random() - 0.5) * 1.8;
    }
    const mistGeo = new THREE.BufferGeometry();
    mistGeo.setAttribute('position', new THREE.BufferAttribute(mistPos, 3));
    root.add(new THREE.Points(mistGeo, new THREE.PointsMaterial({
      color: 0x9eb0c0, size: 0.02, transparent: true, opacity: 0.14, depthWrite: false
    })));

    const stations = [
      { x: -1.35, r: 0.26, nom: 'D24.000' },
      { x: -0.75, r: 0.42, nom: 'D36.800' },
      { x: 0.05, r: 0.32, nom: 'D28.800' },
      { x: 0.65, r: 0.48, nom: 'D41.600' },
      { x: 1.35, r: 0.24, nom: 'D22.400' }
    ];
    let stIdx = 0; let phase = 'move'; let phaseT = 0; let px = stations[0].x; let py = 1.45;
    probe.position.set(px, py, 0);

    const mlabel = document.getElementById('mlabel');
    const tX = document.getElementById('tX');
    const tZ = document.getElementById('tZ');
    const tProbe = document.getElementById('tProbe');
    const gcodeEl = document.getElementById('gcode');
    const tRpmEl = document.getElementById('tRpm');

    function burst(x, y, z) {
      sparkV = [];
      // Tangential spray like real turning chips off a spinning part.
      const spinDir = spin.rotation.x;
      for (let i = 0; i < SN; i++) {
        sparkPos[i * 3] = x + (Math.random() - 0.5) * 0.018;
        sparkPos[i * 3 + 1] = y + (Math.random() - 0.5) * 0.012;
        sparkPos[i * 3 + 2] = z + (Math.random() - 0.5) * 0.018;

        const speed = 0.055 + Math.random() * 0.12;
        const elev = 0.15 + Math.random() * 0.75;
        const az = spinDir + (Math.random() - 0.5) * 1.4 + Math.PI * 0.5;
        sparkV.push([
          Math.cos(az) * Math.sin(elev) * speed * 0.55,
          Math.cos(elev) * speed * 0.95 + 0.02,
          Math.sin(az) * Math.sin(elev) * speed
        ]);

        const hot = Math.random();
        if (hot > 0.88) {
          sparkCol[i * 3] = 1.0; sparkCol[i * 3 + 1] = 0.93; sparkCol[i * 3 + 2] = 0.78;
          sparkSize[i] = 2.1 + Math.random() * 1.1;
        } else if (hot > 0.4) {
          sparkCol[i * 3] = 1.0; sparkCol[i * 3 + 1] = 0.55; sparkCol[i * 3 + 2] = 0.14;
          sparkSize[i] = 1.35 + Math.random() * 1.1;
        } else {
          sparkCol[i * 3] = 0.98; sparkCol[i * 3 + 1] = 0.28; sparkCol[i * 3 + 2] = 0.05;
          sparkSize[i] = 0.95 + Math.random() * 0.85;
        }
      }
      sparkGeo.attributes.position.needsUpdate = true;
      sparkGeo.attributes.aSize.needsUpdate = true;
      sparkGeo.attributes.aColor.needsUpdate = true;
      sparkMat.uniforms.uOpacity.value = 1;
      sparks.visible = true;
      streaks.visible = true;
      sparkT = performance.now();
      sparkLife = preferCalm ? 620 : 760;

      flash.position.set(x, y, z);
      flash.intensity = 1.65;
      flashOrb.position.set(x, y, z);
      flashOrb.material.opacity = 0.42;
      flashOrb.visible = true;
      flashOrb.scale.setScalar(1);
    }

    function fireLabel(st, off) {
      if (!mlabel) return;
      mlabel.innerHTML = st.nom + ' <span class="mu">' + (off >= 0 ? '+' : '') + off.toFixed(3) + '</span>';
      mlabel.classList.add('show');
      setTimeout(() => mlabel.classList.remove('show'), 1500);
    }

    let mx = 0; let my = 0; let dragging = false; let lastPx = 0;
    addEventListener('pointermove', (e) => {
      mx = e.clientX / innerWidth - 0.5;
      my = e.clientY / innerHeight - 0.5;
      if (dragging) { orbit.azim -= (e.clientX - lastPx) * 0.005; lastPx = e.clientX; }
    });
    canvas.addEventListener('pointerdown', (e) => {
      dragging = true; lastPx = e.clientX;
      try { canvas.setPointerCapture(e.pointerId); } catch (err) {}
    });
    addEventListener('pointerup', () => { dragging = false; });

    function placeCamera() {
      const elev = THREE.MathUtils.clamp(orbit.elev + my * 0.1, 0.18, 0.72);
      const az = orbit.azim;
      const r = orbit.radius;
      camera.position.set(
        orbit.target.x + Math.cos(az) * Math.cos(elev) * r,
        orbit.target.y + Math.sin(elev) * r,
        orbit.target.z + Math.sin(az) * Math.cos(elev) * r
      );
      camera.lookAt(orbit.target);
    }

    function frameToFit() {
      const box = new THREE.Box3().setFromObject(frameRoot);
      if (box.isEmpty()) return;
      const size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());
      orbit.target.copy(center);
      orbit.target.y += size.y * 0.04;
      const sphere = box.getBoundingSphere(new THREE.Sphere());
      const fov = THREE.MathUtils.degToRad(camera.fov);
      const aspect = Math.max(camera.aspect, 0.6);
      const vFov = fov;
      const hFov = 2 * Math.atan(Math.tan(vFov / 2) * aspect);
      const fitV = sphere.radius / Math.sin(vFov / 2);
      const fitH = sphere.radius / Math.sin(hFov / 2);
      orbit.radius = Math.max(fitV, fitH) * 0.9;
      orbit.fitted = true;
    }

    function resize() {
      const w = canvas.clientWidth; const h = canvas.clientHeight;
      if (w < 2 || h < 2) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.fov = w / h > 1.55 ? 27 : (w / h < 0.9 ? 35 : 30);
      camera.updateProjectionMatrix();
      frameToFit();
      placeCamera();
    }
    addEventListener('resize', resize);
    resize();

    const glines = [
      'G01 X40.000 Z-12.000 F0.20', 'G02 X36.800 Z-24.500 R3.0', 'G01 Z-48.000 F0.18',
      'M05 (SPINDLE STOP)', 'G28 U0 W0 (HOME)', 'M00 (MEASURE D41.6)', 'G04 X0.8 (DWELL)'
    ];
    let gi = 0;
    const gcodeTimer = setInterval(() => { if (gcodeEl) gcodeEl.textContent = glines[gi++ % glines.length]; }, 1400);
    const rpmTimer = setInterval(() => { if (tRpmEl) tRpmEl.textContent = 1415 + Math.round(Math.random() * 10); }, 700);

    const v3 = new THREE.Vector3();
    let labelAnchor = null;
    function placeLabel(st) {
      if (!mlabel) return;
      v3.set(st.x, st.r + 0.1, 0); v3.project(camera);
      mlabel.style.left = (v3.x * 0.5 + 0.5) * canvas.clientWidth + 'px';
      mlabel.style.top = (-v3.y * 0.5 + 0.5) * canvas.clientHeight + 'px';
    }

    let last = performance.now(); let running = true; let raf = 0;
    const visIO = new IntersectionObserver((entries) => {
      running = entries.some((e) => e.isIntersecting) && !document.hidden;
      if (running && !raf) raf = requestAnimationFrame(loop);
    }, { threshold: 0.01, rootMargin: '80px 0px' });
    visIO.observe(heroRoot);
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) { running = false; return; }
      running = true; if (!raf) raf = requestAnimationFrame(loop);
    });

    function loop(now) {
      raf = 0; if (!running) return; raf = requestAnimationFrame(loop);
      const dt = Math.min((now - last) / 1000, 0.05); last = now;
      const motion = preferCalm ? 0.45 : 1;

      if (!dragging) {
        orbit.azim += dt * orbit.speed * motion;
        orbit.elev = 0.36 + Math.sin(now * 0.00032) * 0.05;
      }
      placeCamera();
      spin.rotation.x += dt * 3.35 * motion;

      const mp = mistGeo.attributes.position.array;
      for (let i = 0; i < MN; i++) {
        mp[i * 3 + 1] += dt * 0.045 * motion;
        if (mp[i * 3 + 1] > 1.25) mp[i * 3 + 1] = -0.55;
      }
      mistGeo.attributes.position.needsUpdate = true;

      phaseT += dt * motion;
      const st = stations[stIdx];
      if (phase === 'move') {
        px += (st.x - px) * Math.min(1, dt * 3.4 * motion);
        py += (1.45 - py) * Math.min(1, dt * 3.4 * motion);
        if (tProbe) tProbe.textContent = 'MOVE'; tipGlow.intensity = 0.3;
        if (Math.abs(px - st.x) < 0.012 && phaseT > 0.55) { phase = 'down'; phaseT = 0; }
      } else if (phase === 'down') {
        py += (st.r + 0.05 - py) * Math.min(1, dt * 5.2 * motion);
        if (tProbe) tProbe.textContent = 'PROBE'; tipGlow.intensity = 0.85;
        if (py < st.r + 0.08) {
          phase = 'touch'; phaseT = 0; burst(st.x, st.r + 0.03, 0);
          fireLabel(st, (Math.random() - 0.35) * 0.03); labelAnchor = st;
        }
      } else if (phase === 'touch') {
        if (tProbe) tProbe.textContent = 'READ';
        tipGlow.intensity = 1.15 + Math.sin(now * 0.028) * 0.25;
        if (phaseT > 0.95) { phase = 'up'; phaseT = 0; }
      } else if (phase === 'up') {
        py += (1.45 - py) * Math.min(1, dt * 3.6 * motion);
        if (tProbe) tProbe.textContent = 'RETRACT'; tipGlow.intensity = 0.45;
        if (py > 1.38) { phase = 'move'; phaseT = 0; stIdx = (stIdx + 1) % stations.length; labelAnchor = null; }
      }
      probe.position.set(px, py, 0); tipGlow.position.set(px, py, 0);
      pTip.material.emissiveIntensity = phase === 'touch' ? 1.35 : 0.65;
      if (tX) tX.textContent = (px >= 0 ? '+' : '') + px.toFixed(3);
      if (tZ) tZ.textContent = '-' + Math.abs(st.x).toFixed(3);
      if (labelAnchor) placeLabel(labelAnchor);

      if (sparks.visible) {
        const el = now - sparkT;
        const life = Math.max(0, 1 - el / sparkLife);
        sparkMat.uniforms.uOpacity.value = life;
        sparkMat.uniforms.uTime.value = el * 0.001;
        for (let i = 0; i < SN; i++) {
          const ox = sparkPos[i * 3];
          const oy = sparkPos[i * 3 + 1];
          const oz = sparkPos[i * 3 + 2];
          sparkPos[i * 3] += sparkV[i][0];
          sparkPos[i * 3 + 1] += sparkV[i][1] - dt * 1.15;
          sparkPos[i * 3 + 2] += sparkV[i][2];
          sparkV[i][0] *= 0.985;
          sparkV[i][1] *= 0.985;
          sparkV[i][2] *= 0.985;
          // Streak from previous → current
          streakPos[i * 6] = ox;
          streakPos[i * 6 + 1] = oy;
          streakPos[i * 6 + 2] = oz;
          streakPos[i * 6 + 3] = sparkPos[i * 3];
          streakPos[i * 6 + 4] = sparkPos[i * 3 + 1];
          streakPos[i * 6 + 5] = sparkPos[i * 3 + 2];
        }
        sparkGeo.attributes.position.needsUpdate = true;
        streakGeo.attributes.position.needsUpdate = true;
        streaks.material.opacity = life * 0.9;
        flash.intensity = Math.max(0, 1.65 * life * life);
        flashOrb.material.opacity = life * 0.35;
        flashOrb.scale.setScalar(1 + (1 - life) * 1.1);
        if (el > sparkLife) {
          sparks.visible = false;
          streaks.visible = false;
          flashOrb.visible = false;
          flash.intensity = 0;
        }
      }

      led.material.emissiveIntensity = 0.7 + Math.sin(now * 0.003) * 0.25;
      hmi.material.emissiveIntensity = 0.35 + Math.sin(now * 0.0022) * 0.08;
      renderer.render(scene, camera);
    }

    resize();
    renderer.render(scene, camera);
    threeReady = true;
    window.__SC_HERO_LIVE__ = true;
    stopPosterAnimator();
    canvas.classList.add('is-ready');
    raf = requestAnimationFrame(loop);
    void gcodeTimer; void rpmTimer;
  } catch (e) {
    heroFallback(e);
  }
}

boot();
