/* sc-hero-cell.js — SectorCalc Live Cell v22
   Cinematic 360° orbit CNC turning cell. Fail-soft forever.
   - Auto azimuth orbit (full turn)
   - Framed to fit stage (no crop)
   - Env map optional; reduced-motion slows (never kills WebGL)
*/

const stageEl = document.getElementById('stage');
const heroRoot = document.querySelector('.sc-hero') || stageEl;
const posterEl = document.querySelector('.stage-poster');
let posterAnimStop = null;
let hudFallbackStarted = false;
let threeReady = false;

window.__SC_HERO_LIVE__ = false;
window.__SC_HERO_BUILD__ = 'v22';
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

function mat(THREE, hasEnv, o) {
  const C = THREE.MeshPhysicalMaterial || THREE.MeshStandardMaterial;
  const conf = {
    color: o.color,
    metalness: hasEnv ? o.metal : o.metal * 0.55,
    roughness: hasEnv ? o.rough : Math.min(0.75, o.rough + 0.12)
  };
  if (C === THREE.MeshPhysicalMaterial) {
    if (o.clearcoat != null) conf.clearcoat = o.clearcoat;
    if (o.clearcoatRoughness != null) conf.clearcoatRoughness = o.clearcoatRoughness;
    if (o.envMapIntensity != null) conf.envMapIntensity = o.envMapIntensity;
  }
  if (o.emissive != null) {
    conf.emissive = o.emissive;
    conf.emissiveIntensity = o.emissiveIntensity || 0.2;
  }
  return new C(conf);
}

function shadowable(mesh, cast, receive) {
  mesh.castShadow = !!cast;
  mesh.receiveShadow = !!receive;
  return mesh;
}

function mesh(THREE, geo, material, opts) {
  const m = new THREE.Mesh(geo, material);
  if (opts) {
    if (opts.px != null) m.position.set(opts.px, opts.py || 0, opts.pz || 0);
    if (opts.rx != null || opts.ry != null || opts.rz != null) {
      m.rotation.set(opts.rx || 0, opts.ry || 0, opts.rz || 0);
    }
    if (opts.cast != null || opts.receive != null) shadowable(m, opts.cast, opts.receive);
  }
  return m;
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
      canvas, antialias: true, alpha: true,
      powerPreference: 'default', failIfMajorPerformanceCaveat: false
    });
    const gl = renderer.getContext();
    if (!gl || (typeof gl.isContextLost === 'function' && gl.isContextLost())) {
      throw new Error('WebGL context unavailable');
    }
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    if ('outputColorSpace' in renderer && THREE.SRGBColorSpace) renderer.outputColorSpace = THREE.SRGBColorSpace;

    let shadowsOk = false;
    try {
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      shadowsOk = true;
    } catch (e) { try { renderer.shadowMap.enabled = false; } catch (e2) {} }

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0xd5dee6, 10, 22);

    let hasEnv = false;
    try {
      if (typeof RoomEnvironment === 'function') {
        const pmrem = new THREE.PMREMGenerator(renderer);
        scene.environment = pmrem.fromScene(new RoomEnvironment(renderer), 0.04).texture;
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
      speed: preferCalm ? 0.11 : 0.2,
      fitted: false
    };

    scene.add(new THREE.AmbientLight(0xf2f4f6, hasEnv ? 0.32 : 0.62));
    scene.add(new THREE.HemisphereLight(0xffffff, 0x8e98a4, hasEnv ? 0.5 : 1.0));

    const key = new THREE.DirectionalLight(0xffffff, hasEnv ? 2.2 : 2.9);
    key.position.set(5, 7, 4);
    if (shadowsOk) {
      key.castShadow = true;
      key.shadow.mapSize.set(1024, 1024);
      key.shadow.camera.near = 1;
      key.shadow.camera.far = 28;
      key.shadow.camera.left = -8;
      key.shadow.camera.right = 8;
      key.shadow.camera.top = 6;
      key.shadow.camera.bottom = -6;
      key.shadow.bias = -0.0002;
      key.shadow.normalBias = 0.035;
    }
    scene.add(key);
    const rim = new THREE.DirectionalLight(0x9ec8e8, hasEnv ? 1.05 : 1.55);
    rim.position.set(-6, 3, -3);
    scene.add(rim);
    const fill = new THREE.DirectionalLight(0xffffff, hasEnv ? 0.55 : 1.05);
    fill.position.set(-1, 2, 6);
    scene.add(fill);
    const warm = new THREE.PointLight(0xe87722, hasEnv ? 5 : 8, 14, 2);
    warm.position.set(0.8, -0.2, 2.6);
    scene.add(warm);
    const tipGlow = new THREE.PointLight(0xff5a72, 0.5, 2.6, 2);
    scene.add(tipGlow);

    const steel = mat(THREE, hasEnv, { color: 0xb8c0c8, metal: 0.92, rough: 0.26, clearcoat: 0.4, clearcoatRoughness: 0.32, envMapIntensity: 1.2 });
    const steelBright = mat(THREE, hasEnv, { color: 0xcbd2da, metal: 0.95, rough: 0.2, clearcoat: 0.5, clearcoatRoughness: 0.25, envMapIntensity: 1.3 });
    const castIron = mat(THREE, hasEnv, { color: 0x262b32, metal: 0.5, rough: 0.58, clearcoat: 0.08, clearcoatRoughness: 0.72, envMapIntensity: 0.65 });
    const paintBlue = mat(THREE, hasEnv, { color: 0x0055a4, metal: 0.32, rough: 0.38, clearcoat: 0.6, clearcoatRoughness: 0.22, envMapIntensity: 0.95, emissive: 0x00284d, emissiveIntensity: 0.1 });
    const accent = mat(THREE, hasEnv, { color: 0xe87722, metal: 0.4, rough: 0.4, emissive: 0xe87722, emissiveIntensity: 0.4 });
    const rubber = mat(THREE, hasEnv, { color: 0x171a1e, metal: 0.05, rough: 0.88 });

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

    const ground = M(new THREE.CircleGeometry(5.2, 72), new THREE.MeshStandardMaterial({
      color: 0xc2ccd5, metalness: 0.04, roughness: 0.94, transparent: true, opacity: 0.95
    }), 0, -1.48, 0, false, true, -Math.PI / 2, 0, 0);
    ground.name = 'ground';
    root.add(ground);

    const grid = new THREE.GridHelper(8.5, 17, 0x7eabcf, 0xb0bcc8);
    grid.position.y = -1.465;
    grid.name = 'grid';
    const gm = Array.isArray(grid.material) ? grid.material : [grid.material];
    gm.forEach((m) => { m.transparent = true; m.opacity = 0.32; });
    root.add(grid);

    // Framing root: machine only (exclude infinite-feeling ground disc).
    const frameRoot = new THREE.Group();
    frameRoot.name = 'frameRoot';
    root.add(frameRoot);

    const bed = new THREE.Group();
    bed.add(M(new THREE.BoxGeometry(5.6, 0.36, 1.45), castIron, 0.1, -1.22, 0, true, true));
    bed.add(M(new THREE.BoxGeometry(4.9, 0.07, 0.2), steelBright, 0.15, -1.0, -0.4, true, true));
    bed.add(M(new THREE.BoxGeometry(4.9, 0.07, 0.2), steelBright, 0.15, -1.0, 0.4, true, true));
    bed.add(M(new THREE.BoxGeometry(4.6, 0.05, 1.0), rubber, 0.2, -1.04, 0, false, true));
    bed.add(M(new THREE.BoxGeometry(5.1, 0.055, 0.035), paintBlue, 0.1, -1.08, 0.74));
    bed.add(M(new THREE.BoxGeometry(0.18, 0.04, 0.18), accent, -2.4, -1.02, 0.55));
    bed.add(M(new THREE.BoxGeometry(0.18, 0.04, 0.18), accent, 2.4, -1.02, 0.55));
    frameRoot.add(bed);

    const head = new THREE.Group();
    head.add(M(new THREE.BoxGeometry(1.2, 1.45, 1.25), castIron, -2.35, -0.28, 0, true, true));
    head.add(M(new THREE.BoxGeometry(1.02, 0.2, 1.05), paintBlue, -2.35, 0.52, 0, true, false));
    head.add(M(new THREE.CylinderGeometry(0.4, 0.46, 0.5, 40), steel, -1.8, 0, 0, true, true, 0, 0, Math.PI / 2));
    head.add(M(new THREE.BoxGeometry(0.5, 0.16, 0.03), rubber, -2.35, -0.55, 0.64));
    const led = new THREE.Mesh(new THREE.SphereGeometry(0.038, 12, 10), new THREE.MeshStandardMaterial({
      color: 0x33c46a, emissive: 0x22aa55, emissiveIntensity: 1.35, metalness: 0.2, roughness: 0.4
    }));
    led.position.set(-2.2, 0.18, 0.66);
    head.add(led);
    frameRoot.add(head);

    const tail = new THREE.Group();
    tail.add(M(new THREE.BoxGeometry(0.85, 0.95, 0.95), castIron, 2.55, -0.55, 0, true, true));
    tail.add(M(new THREE.CylinderGeometry(0.12, 0.12, 0.7, 24), steelBright, 2.05, 0, 0, true, false, 0, 0, Math.PI / 2));
    tail.add(M(new THREE.ConeGeometry(0.08, 0.22, 20), steel, 1.68, 0, 0, false, false, 0, 0, -Math.PI / 2));
    frameRoot.add(tail);

    const spin = new THREE.Group();
    const profile = [
      [0.001, 0], [0.26, 0], [0.26, 0.4], [0.42, 0.48], [0.42, 1.15], [0.32, 1.24],
      [0.32, 1.9], [0.48, 1.98], [0.48, 2.6], [0.24, 2.68], [0.24, 3.2], [0.001, 3.2]
    ].map((p) => new THREE.Vector2(p[0], p[1]));
    spin.add(M(new THREE.LatheGeometry(profile, 96), steelBright, -1.55, 0, 0, true, true, 0, 0, -Math.PI / 2));
    spin.add(M(new THREE.BoxGeometry(3.05, 0.032, 0.065), accent, 0.05, 0.34, 0, true, false));
    spin.add(M(new THREE.TorusGeometry(0.5, 0.12, 22, 64), steel, 0.55, 0, 0, true, true, 0, Math.PI / 2, 0));
    spin.add(M(new THREE.CylinderGeometry(0.68, 0.74, 0.5, 48), castIron, -1.9, 0, 0, true, true, 0, 0, Math.PI / 2));
    spin.add(M(new THREE.CylinderGeometry(0.54, 0.54, 0.08, 48), steel, -1.62, 0, 0, true, false, 0, 0, Math.PI / 2));
    for (let i = 0; i < 3; i++) {
      const jaw = new THREE.Group();
      jaw.add(M(new THREE.BoxGeometry(0.3, 0.18, 0.24), steel, 0, 0, 0, true, false));
      jaw.add(M(new THREE.BoxGeometry(0.14, 0.12, 0.16), steelBright, 0.18, 0, 0, true, false));
      const a = (i * Math.PI * 2) / 3;
      jaw.position.set(-1.58, Math.cos(a) * 0.4, Math.sin(a) * 0.4);
      jaw.rotation.x = -a;
      spin.add(jaw);
    }
    frameRoot.add(spin);

    const gantry = new THREE.Group();
    gantry.add(M(new THREE.BoxGeometry(0.2, 1.9, 0.2), castIron, 0.15, 0.4, -1.05, true, true));
    gantry.add(M(new THREE.BoxGeometry(0.14, 0.14, 1.05), paintBlue, 0.15, 1.25, -0.5, true, false));
    const probe = new THREE.Group();
    const pBody = M(new THREE.CylinderGeometry(0.04, 0.04, 0.85, 18), steel, 0, 0.45, 0, true, false);
    const pTip = new THREE.Mesh(new THREE.SphereGeometry(0.048, 18, 14), new THREE.MeshStandardMaterial({
      color: 0xe8536b, emissive: 0xe8536b, emissiveIntensity: 1.15, metalness: 0.2, roughness: 0.3
    }));
    const pCollar = M(new THREE.CylinderGeometry(0.09, 0.09, 0.09, 18), paintBlue, 0, 0.88, 0, true, false);
    probe.add(pBody, pTip, pCollar);
    gantry.add(probe);
    frameRoot.add(gantry);

    const SN = 40;
    const sparkGeo = new THREE.BufferGeometry();
    sparkGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(SN * 3), 3));
    const sparks = new THREE.Points(sparkGeo, new THREE.PointsMaterial({
      color: 0xffc078, size: 0.042, transparent: true, opacity: 0, depthWrite: false, sizeAttenuation: true
    }));
    sparks.visible = false;
    root.add(sparks);
    let sparkV = [];
    let sparkT = 0;

    const MN = 70;
    const mistPos = new Float32Array(MN * 3);
    for (let i = 0; i < MN; i++) {
      mistPos[i * 3] = (Math.random() - 0.5) * 4.5;
      mistPos[i * 3 + 1] = Math.random() * 1.6 - 0.5;
      mistPos[i * 3 + 2] = (Math.random() - 0.5) * 2;
    }
    const mistGeo = new THREE.BufferGeometry();
    mistGeo.setAttribute('position', new THREE.BufferAttribute(mistPos, 3));
    root.add(new THREE.Points(mistGeo, new THREE.PointsMaterial({
      color: 0x9eb6c8, size: 0.025, transparent: true, opacity: 0.2, depthWrite: false
    })));

    const stations = [
      { x: -1.35, r: 0.26, nom: 'D24.000' },
      { x: -0.75, r: 0.42, nom: 'D36.800' },
      { x: 0.05, r: 0.32, nom: 'D28.800' },
      { x: 0.65, r: 0.48, nom: 'D41.600' },
      { x: 1.35, r: 0.24, nom: 'D22.400' }
    ];
    let stIdx = 0, phase = 'move', phaseT = 0, px = stations[0].x, py = 1.45;
    probe.position.set(px, py, 0);

    const mlabel = document.getElementById('mlabel');
    const tX = document.getElementById('tX');
    const tZ = document.getElementById('tZ');
    const tProbe = document.getElementById('tProbe');
    const gcodeEl = document.getElementById('gcode');
    const tRpmEl = document.getElementById('tRpm');

    function burst(x, y, z) {
      const pos = sparkGeo.attributes.position.array;
      sparkV = [];
      for (let i = 0; i < SN; i++) {
        pos[i * 3] = x; pos[i * 3 + 1] = y; pos[i * 3 + 2] = z;
        sparkV.push([(Math.random() - 0.5) * 0.05, Math.random() * 0.045 + 0.01, (Math.random() - 0.5) * 0.05]);
      }
      sparkGeo.attributes.position.needsUpdate = true;
      sparks.visible = true; sparks.material.opacity = 1; sparkT = performance.now();
    }
    function fireLabel(st, off) {
      if (!mlabel) return;
      mlabel.innerHTML = st.nom + ' <span class="mu">' + (off >= 0 ? '+' : '') + off.toFixed(3) + '</span>';
      mlabel.classList.add('show');
      setTimeout(() => mlabel.classList.remove('show'), 1500);
    }

    let mx = 0, my = 0, dragging = false, lastPx = 0;
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

    /** Fit MACHINE (not ground disc) into stage — cinematic fill without crop. */
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
      // Distance so sphere fills ~72% of the shorter viewport axis.
      const vFov = fov;
      const hFov = 2 * Math.atan(Math.tan(vFov / 2) * aspect);
      const fitV = sphere.radius / Math.sin(vFov / 2);
      const fitH = sphere.radius / Math.sin(hFov / 2);
      orbit.radius = Math.max(fitV, fitH) * 0.92;
      orbit.fitted = true;
    }

    function resize() {
      const w = canvas.clientWidth, h = canvas.clientHeight;
      if (w < 2 || h < 2) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      // Wider stages get a slightly tighter cinematic FOV.
      camera.fov = w / h > 1.55 ? 28 : (w / h < 0.9 ? 36 : 31);
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

    let last = performance.now(), running = true, raf = 0;
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
        orbit.elev = 0.38 + Math.sin(now * 0.00035) * 0.045;
      }
      placeCamera();
      spin.rotation.x += dt * 3.15 * motion;

      const mp = mistGeo.attributes.position.array;
      for (let i = 0; i < MN; i++) {
        mp[i * 3 + 1] += dt * 0.05 * motion;
        if (mp[i * 3 + 1] > 1.3) mp[i * 3 + 1] = -0.6;
      }
      mistGeo.attributes.position.needsUpdate = true;

      phaseT += dt * motion;
      const st = stations[stIdx];
      if (phase === 'move') {
        px += (st.x - px) * Math.min(1, dt * 3.4 * motion);
        py += (1.45 - py) * Math.min(1, dt * 3.4 * motion);
        if (tProbe) tProbe.textContent = 'MOVE'; tipGlow.intensity = 0.45;
        if (Math.abs(px - st.x) < 0.012 && phaseT > 0.55) { phase = 'down'; phaseT = 0; }
      } else if (phase === 'down') {
        py += (st.r + 0.05 - py) * Math.min(1, dt * 5.2 * motion);
        if (tProbe) tProbe.textContent = 'PROBE'; tipGlow.intensity = 1.3;
        if (py < st.r + 0.08) {
          phase = 'touch'; phaseT = 0; burst(st.x, st.r + 0.03, 0);
          fireLabel(st, (Math.random() - 0.35) * 0.03); labelAnchor = st;
        }
      } else if (phase === 'touch') {
        if (tProbe) tProbe.textContent = 'READ';
        tipGlow.intensity = 2.5 + Math.sin(now * 0.028) * 0.55;
        if (phaseT > 0.95) { phase = 'up'; phaseT = 0; }
      } else if (phase === 'up') {
        py += (1.45 - py) * Math.min(1, dt * 3.6 * motion);
        if (tProbe) tProbe.textContent = 'RETRACT'; tipGlow.intensity = 0.7;
        if (py > 1.38) { phase = 'move'; phaseT = 0; stIdx = (stIdx + 1) % stations.length; labelAnchor = null; }
      }
      probe.position.set(px, py, 0); tipGlow.position.set(px, py, 0);
      pTip.material.emissiveIntensity = phase === 'touch' ? 2.35 : 1.05;
      if (tX) tX.textContent = (px >= 0 ? '+' : '') + px.toFixed(3);
      if (tZ) tZ.textContent = '-' + Math.abs(st.x).toFixed(3);
      if (labelAnchor) placeLabel(labelAnchor);

      if (sparks.visible) {
        const el = now - sparkT;
        const pos = sparkGeo.attributes.position.array;
        for (let i = 0; i < SN; i++) {
          pos[i * 3] += sparkV[i][0];
          pos[i * 3 + 1] += sparkV[i][1] - el * 0.000032;
          pos[i * 3 + 2] += sparkV[i][2];
        }
        sparkGeo.attributes.position.needsUpdate = true;
        sparks.material.opacity = Math.max(0, 1 - el / 520);
        if (el > 520) sparks.visible = false;
      }
      led.material.emissiveIntensity = 1.15 + Math.sin(now * 0.0032) * 0.4;
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
