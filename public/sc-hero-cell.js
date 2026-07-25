/* sc-hero-cell.js - Live Cell hero (Three.js + SVG fallback)
   Always shows motion: JS/SVG poster animator starts immediately.
   Three.js upgrades when WebGL is available. Fail-soft forever.
*/

const stageEl = document.getElementById('stage');
const heroRoot = document.querySelector('.sc-hero') || stageEl;
const posterEl = document.querySelector('.stage-poster');
let posterAnimStop = null;
let hudFallbackStarted = false;
let threeReady = false;

window.__SC_HERO_LIVE__ = false;

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
    { x: -1.55, label: 'D24.000' },
    { x: -0.95, label: 'D36.800' },
    { x: -0.05, label: 'D28.800' },
    { x: 0.62, label: 'D41.600' },
    { x: 1.45, label: 'D22.400' }
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

/** JS-driven SVG probe tour — works even when CSS animations are disabled. */
function startPosterAnimator() {
  if (!posterEl || posterAnimStop) return;
  const probe = posterEl.querySelector('.sp-probe');
  const readout = posterEl.querySelector('.sp-readout');
  const spin = posterEl.querySelector('.sp-spin');
  const readoutText = readout && readout.querySelector('text');
  if (!probe) return;

  // Disable CSS animations so JS owns transforms (avoids fighting reduced-motion CSS).
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
  const stepMs = reducedMotion() ? 1800 : 1100;

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
      spinX += 3 * dir;
      if (spinX > 14 || spinX < 0) dir *= -1;
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
  try {
    const [threeMod, roomMod] = await Promise.all([
      import('three'),
      import('three/addons/environments/RoomEnvironment.js')
    ]);
    return { THREE: threeMod, RoomEnvironment: roomMod.RoomEnvironment };
  } catch (e1) {
    const [threeMod, roomMod] = await Promise.all([
      import('/vendor/three/three.module.min.js'),
      import('/vendor/three/RoomEnvironment.js')
    ]);
    return { THREE: threeMod, RoomEnvironment: roomMod.RoomEnvironment };
  }
}

async function boot() {
  if (!stageEl) return;

  // Motion immediately — never leave a frozen poster.
  startHudFallback();
  startPosterAnimator();

  await waitUntilVisible(heroRoot);

  // Still try WebGL upgrade (skip only if user prefers reduced motion for 3D).
  if (reducedMotion()) return;

  let THREE;
  let RoomEnvironment;
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
      powerPreference: 'default',
      failIfMajorPerformanceCaveat: false
    });
    const gl = renderer.getContext();
    if (!gl || (typeof gl.isContextLost === 'function' && gl.isContextLost())) {
      throw new Error('WebGL context unavailable');
    }
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.92;
    const scene = new THREE.Scene();
    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(new RoomEnvironment(renderer), 0.04).texture;

    const camera = new THREE.PerspectiveCamera(38, 2, 0.1, 100);
    camera.position.set(0.4, 1.5, 5.4);
    camera.lookAt(0, 0.15, 0);

    scene.add(new THREE.AmbientLight(0xf0f2f5, 0.35));
    const key = new THREE.DirectionalLight(0xffffff, 2.6);
    key.position.set(3, 4, 5);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0x9cc4e8, 1.2);
    rim.position.set(-4, 2, -3);
    scene.add(rim);
    const warm = new THREE.PointLight(0xe87722, 7, 12);
    warm.position.set(0, -1.6, 2.2);
    scene.add(warm);

    const profile = [
      [0.001, 0],
      [0.3, 0],
      [0.3, 0.55],
      [0.46, 0.62],
      [0.46, 1.45],
      [0.36, 1.52],
      [0.36, 2.25],
      [0.52, 2.32],
      [0.52, 3.05],
      [0.28, 3.12],
      [0.28, 3.8],
      [0.001, 3.8]
    ].map((p) => new THREE.Vector2(p[0], p[1]));
    const shaftGeo = new THREE.LatheGeometry(profile, 96);
    const steel = new THREE.MeshStandardMaterial({ color: 0x9ba2ab, metalness: 1.0, roughness: 0.3 });
    const shaft = new THREE.Mesh(shaftGeo, steel);
    shaft.rotation.z = -Math.PI / 2;
    shaft.position.x = -1.9;

    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(0.56, 0.15, 20, 64),
      new THREE.MeshStandardMaterial({ color: 0x8a9098, metalness: 1, roughness: 0.35 })
    );
    ring.rotation.y = Math.PI / 2;
    ring.position.x = 0.55;

    const chuckMat = new THREE.MeshStandardMaterial({ color: 0x2e3338, metalness: 0.9, roughness: 0.5 });
    const chuck = new THREE.Mesh(new THREE.CylinderGeometry(0.62, 0.62, 0.5, 32), chuckMat);
    chuck.rotation.z = Math.PI / 2;
    chuck.position.x = -2.15;
    const jaws = new THREE.Group();
    for (let i = 0; i < 3; i++) {
      const j = new THREE.Mesh(
        new THREE.BoxGeometry(0.3, 0.22, 0.24),
        new THREE.MeshStandardMaterial({ color: 0x4a5058, metalness: 0.9, roughness: 0.4 })
      );
      const a = (i * Math.PI * 2) / 3;
      j.position.set(-1.92, Math.cos(a) * 0.42, Math.sin(a) * 0.42);
      j.rotation.x = -a;
      jaws.add(j);
    }
    const spin = new THREE.Group();
    spin.add(shaft, ring, chuck, jaws);
    scene.add(spin);

    const grid = new THREE.GridHelper(14, 28, 0x8fb6d9, 0xc9d2da);
    grid.position.y = -1.35;
    grid.material.transparent = true;
    grid.material.opacity = 0.5;
    scene.add(grid);

    const probe = new THREE.Group();
    const pBody = new THREE.Mesh(
      new THREE.CylinderGeometry(0.045, 0.045, 0.85, 16),
      new THREE.MeshStandardMaterial({ color: 0x4a5058, metalness: 0.9, roughness: 0.35 })
    );
    pBody.position.y = 0.45;
    const pTip = new THREE.Mesh(
      new THREE.SphereGeometry(0.055, 16, 12),
      new THREE.MeshStandardMaterial({
        color: 0xe8536b,
        emissive: 0xe8536b,
        emissiveIntensity: 0.9,
        metalness: 0.4,
        roughness: 0.3
      })
    );
    const pCollar = new THREE.Mesh(
      new THREE.CylinderGeometry(0.1, 0.1, 0.1, 16),
      new THREE.MeshStandardMaterial({ color: 0x0055a4, metalness: 0.9, roughness: 0.3 })
    );
    pCollar.position.y = 0.88;
    probe.add(pBody, pTip, pCollar);
    scene.add(probe);

    const SN = 20;
    const sparkGeo = new THREE.BufferGeometry();
    sparkGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(SN * 3), 3));
    const sparks = new THREE.Points(
      sparkGeo,
      new THREE.PointsMaterial({ color: 0xffb36b, size: 0.05, transparent: true, opacity: 0 })
    );
    sparks.visible = false;
    scene.add(sparks);
    let sparkV = [];
    let sparkT = 0;

    const DN = 160;
    const dPos = new Float32Array(DN * 3);
    for (let i = 0; i < DN; i++) {
      dPos[i * 3] = (Math.random() - 0.5) * 9;
      dPos[i * 3 + 1] = (Math.random() - 0.5) * 4;
      dPos[i * 3 + 2] = (Math.random() - 0.5) * 4;
    }
    const dustGeo = new THREE.BufferGeometry();
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dPos, 3));
    const dust = new THREE.Points(
      dustGeo,
      new THREE.PointsMaterial({ color: 0x0055a4, size: 0.02, transparent: true, opacity: 0.35 })
    );
    scene.add(dust);

    const stations = [
      { x: -1.55, r: 0.3, nom: 'D24.000' },
      { x: -0.95, r: 0.46, nom: 'D36.800' },
      { x: -0.05, r: 0.36, nom: 'D28.800' },
      { x: 0.62, r: 0.52, nom: 'D41.600' },
      { x: 1.45, r: 0.28, nom: 'D22.400' }
    ];
    let stIdx = 0;
    let phase = 'move';
    let phaseT = 0;
    let px = stations[0].x;
    let py = 1.7;
    probe.position.set(px, py, 0);
    const mlabel = document.getElementById('mlabel');
    const tX = document.getElementById('tX');
    const tZ = document.getElementById('tZ');
    const tProbe = document.getElementById('tProbe');
    function burst(x, y, z) {
      const pos = sparkGeo.attributes.position.array;
      sparkV = [];
      for (let i = 0; i < SN; i++) {
        pos[i * 3] = x;
        pos[i * 3 + 1] = y;
        pos[i * 3 + 2] = z;
        sparkV.push([(Math.random() - 0.5) * 0.03, Math.random() * 0.03, (Math.random() - 0.5) * 0.03]);
      }
      sparkGeo.attributes.position.needsUpdate = true;
      sparks.visible = true;
      sparks.material.opacity = 1;
      sparkT = performance.now();
    }
    function fireLabel(st, off) {
      if (!mlabel) return;
      mlabel.innerHTML = st.nom + ' <span class="mu">' + (off >= 0 ? '+' : '') + off.toFixed(3) + '</span>';
      mlabel.classList.add('show');
      setTimeout(() => mlabel.classList.remove('show'), 1500);
    }
    let mx = 0;
    let my = 0;
    addEventListener('pointermove', (e) => {
      mx = e.clientX / innerWidth - 0.5;
      my = e.clientY / innerHeight - 0.5;
    });

    function resize() {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (w < 2 || h < 2) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
    addEventListener('resize', resize);
    resize();

    const glines = [
      'G01 X40.000 Z-12.000 F0.20',
      'G02 X36.800 Z-24.500 R3.0',
      'G01 Z-48.000 F0.18',
      'M05 (SPINDLE STOP)',
      'G28 U0 W0 (HOME)',
      'M00 (MEASURE D41.6)',
      'G04 X0.8 (DWELL)'
    ];
    let gi = 0;
    const gcodeEl = document.getElementById('gcode');
    const tRpmEl = document.getElementById('tRpm');
    const gcodeTimer = setInterval(() => {
      if (gcodeEl) gcodeEl.textContent = glines[gi++ % glines.length];
    }, 1400);
    const rpmTimer = setInterval(() => {
      if (tRpmEl) tRpmEl.textContent = 1415 + Math.round(Math.random() * 10);
    }, 700);

    const v3 = new THREE.Vector3();
    function placeLabel(st) {
      if (!mlabel) return;
      v3.set(st.x, st.r, 0);
      v3.project(camera);
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      mlabel.style.left = (v3.x * 0.5 + 0.5) * w + 'px';
      mlabel.style.top = (-v3.y * 0.5 + 0.5) * h + 'px';
    }
    let labelAnchor = null;

    let last = performance.now();
    let running = true;
    let raf = 0;
    const visIO = new IntersectionObserver(
      (entries) => {
        running = entries.some((e) => e.isIntersecting) && !document.hidden;
        if (running && !raf) raf = requestAnimationFrame(loop);
      },
      { threshold: 0.05 }
    );
    visIO.observe(heroRoot);
    document.addEventListener('visibilitychange', () => {
      running = !document.hidden;
      if (running && !raf) raf = requestAnimationFrame(loop);
    });

    function loop(now) {
      raf = 0;
      if (!running) return;
      raf = requestAnimationFrame(loop);
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      spin.rotation.x += dt * 2.2;
      spin.rotation.y += (mx * 0.3 - spin.rotation.y) * 0.04;
      scene.rotation.x += (my * 0.12 - scene.rotation.x) * 0.04;
      dust.rotation.y += dt * 0.02;

      phaseT += dt;
      const st = stations[stIdx];
      if (phase === 'move') {
        px += (st.x - px) * Math.min(1, dt * 4);
        py += (1.7 - py) * Math.min(1, dt * 4);
        if (tProbe) tProbe.textContent = 'MOVE';
        if (Math.abs(px - st.x) < 0.01 && phaseT > 0.6) {
          phase = 'down';
          phaseT = 0;
        }
      } else if (phase === 'down') {
        py += (st.r + 0.06 - py) * Math.min(1, dt * 6);
        if (tProbe) tProbe.textContent = 'PROBE';
        if (py < st.r + 0.09) {
          phase = 'touch';
          phaseT = 0;
          burst(st.x, st.r + 0.03, 0);
          fireLabel(st, (Math.random() - 0.35) * 0.03);
          labelAnchor = st;
        }
      } else if (phase === 'touch') {
        if (tProbe) tProbe.textContent = 'READ';
        if (phaseT > 0.9) {
          phase = 'up';
          phaseT = 0;
        }
      } else if (phase === 'up') {
        py += (1.7 - py) * Math.min(1, dt * 4);
        if (tProbe) tProbe.textContent = 'RETRACT';
        if (py > 1.6) {
          phase = 'move';
          phaseT = 0;
          stIdx = (stIdx + 1) % stations.length;
          labelAnchor = null;
        }
      }
      probe.position.set(px, py, 0);
      pTip.material.emissiveIntensity = phase === 'touch' ? 2.2 : 0.9;
      if (tX) tX.textContent = (px >= 0 ? '+' : '') + px.toFixed(3);
      if (tZ) tZ.textContent = '-' + Math.abs(st.x).toFixed(3);
      if (labelAnchor) placeLabel(labelAnchor);

      if (sparks.visible) {
        const el = now - sparkT;
        const pos = sparkGeo.attributes.position.array;
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

    resize();
    renderer.render(scene, camera);
    threeReady = true;
    window.__SC_HERO_LIVE__ = true;
    stopPosterAnimator();
    canvas.classList.add('is-ready');
    raf = requestAnimationFrame(loop);

    void gcodeTimer;
    void rpmTimer;
  } catch (e) {
    heroFallback(e);
  }
}

boot();
