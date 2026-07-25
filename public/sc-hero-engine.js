/* sc-hero-engine.js — SectorCalc Live Deck v27
   Cinematic auto-live SC-008 deck.
   Soft analytical scrub · full MC only on settle · no histogram explode.
*/
(function () {
  'use strict';

  function mulberry32(a) {
    return function () {
      a |= 0;
      a = (a + 0x6d2b79f5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  var SEED = 0x7a3f1c9e;
  var N = 10000;
  var SPEC = 0.1; // bilateral half-spec ±0.100 mm → LSL/USL
  var FIXED = [
    { id: 'housing', name: 'HOUSING', tol: 0.02 },
    { id: 'shaft', name: 'SHAFT', tol: 0.03 },
    { id: 'bearing', name: 'BEARING', tol: 0.025 }
  ];

  function gauss(r) {
    var u = 0;
    var v = 0;
    while (!u) u = r();
    while (!v) v = r();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  }

  function runEngine(t1) {
    var t0 = performance.now();
    var tols = [t1].concat(FIXED.map(function (p) { return p.tol; }));
    var wc = tols.reduce(function (a, b) { return a + b; }, 0);
    var sig = tols.map(function (t) { return t / 3; });
    var sS = Math.sqrt(sig.reduce(function (a, s) { return a + s * s; }, 0));
    var rss = 3 * sS;
    var rnd = mulberry32(SEED);
    var s = new Float64Array(N);
    for (var i = 0; i < N; i++) {
      var x = 0;
      for (var j = 0; j < sig.length; j++) x += gauss(rnd) * sig[j];
      s[i] = x;
    }
    var m = 0;
    for (var k = 0; k < N; k++) m += s[k];
    m /= N;
    var v = 0;
    for (var q = 0; q < N; q++) v += (s[q] - m) * (s[q] - m);
    v /= N;
    var mc = 3 * Math.sqrt(v);
    var cpk = SPEC / mc;
    return {
      wc: wc,
      rss: rss,
      mc: mc,
      cpk: cpk,
      mean: m,
      samples: s,
      contrib: tols,
      ms: (performance.now() - t0).toFixed(1)
    };
  }

  var canvas = document.getElementById('histo');
  if (!canvas) return;
  var ctx = canvas.getContext('2d', { alpha: false });
  var dots = [];
  var animStart = 0;
  var raf = null;
  var current = null;
  var RANGE = 0.15; // histogram ±mm window

  function sizeC() {
    var r = canvas.getBoundingClientRect();
    var d = Math.min(devicePixelRatio || 1, 2);
    var w = Math.max(1, r.width);
    var h = 120;
    canvas.width = w * d;
    canvas.height = h * d;
    ctx.setTransform(d, 0, 0, d, 0, 0);
    return { w: w, h: h };
  }

  function xOf(val, w) {
    return ((val + RANGE) / (2 * RANGE)) * w;
  }

  function build(samples) {
    var size = sizeC();
    var w = size.w;
    var h = size.h;
    var B = 72;
    var bins = new Array(B).fill(0);
    for (var i = 0; i < N; i++) {
      var b = Math.floor(((samples[i] + RANGE) / (2 * RANGE)) * B);
      bins[Math.max(0, Math.min(B - 1, b))]++;
    }
    var mx = Math.max.apply(null, bins) || 1;
    var cnt = new Array(B).fill(0);
    dots = [];
    // Subsample for visual density (premium rain, not 10k rects)
    var step = 4;
    for (var i2 = 0; i2 < N; i2 += step) {
      var b2 = Math.max(0, Math.min(B - 1, Math.floor(((samples[i2] + RANGE) / (2 * RANGE)) * B)));
      var k = cnt[b2]++;
      var rnd = mulberry32(SEED + i2)();
      dots.push({
        x: ((b2 + 0.5) / B) * w + (rnd - 0.5) * (w / B * 0.75),
        y: h - 18 - (k / mx) * (h - 36),
        delay: (i2 / N) * 900,
        inSpec: Math.abs(samples[i2]) <= SPEC
      });
    }
    animStart = performance.now();
    if (raf) cancelAnimationFrame(raf);
    raf = requestAnimationFrame(draw);
  }

  function draw(now) {
    var size = sizeC();
    var w = size.w;
    var h = size.h;
    var dark = document.documentElement.getAttribute('data-theme') === 'dark';
    var bg = dark ? '#1B1F23' : '#F4F6F8';
    var ink = dark ? 'rgba(232,234,236,.55)' : 'rgba(26,26,26,.45)';
    var blue = '#0055A4';
    var green = '#007A33';
    var red = '#C8102E';

    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    // Spec band (LSL → USL)
    var xL = xOf(-SPEC, w);
    var xU = xOf(SPEC, w);
    ctx.fillStyle = dark ? 'rgba(0,122,51,.12)' : 'rgba(0,122,51,.08)';
    ctx.fillRect(xL, 0, Math.max(0, xU - xL), h);

    // Out-of-spec side washes
    ctx.fillStyle = dark ? 'rgba(200,16,46,.1)' : 'rgba(200,16,46,.06)';
    ctx.fillRect(0, 0, xL, h);
    ctx.fillRect(xU, 0, w - xU, h);

    // Limit lines
    ctx.strokeStyle = red;
    ctx.lineWidth = 1.2;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(xL, 4);
    ctx.lineTo(xL, h - 14);
    ctx.moveTo(xU, 4);
    ctx.lineTo(xU, h - 14);
    ctx.stroke();
    ctx.setLineDash([]);

    // Zero / mean
    var x0 = xOf(0, w);
    ctx.strokeStyle = ink;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x0, 4);
    ctx.lineTo(x0, h - 14);
    ctx.stroke();

    // Animated Monte Carlo points
    var t = now - animStart;
    for (var i = 0; i < dots.length; i++) {
      var d = dots[i];
      var p = (t - d.delay) / 520;
      if (p <= 0) continue;
      var e = p >= 1 ? 1 : 1 - Math.pow(1 - p, 3);
      ctx.globalAlpha = 0.22 + 0.78 * e;
      ctx.fillStyle = d.inSpec ? blue : red;
      ctx.fillRect(d.x - 1.1, -10 + (d.y + 10) * e - 1.1, 2.2, 2.2);
    }
    ctx.globalAlpha = 1;

    // Normal curve overlay
    if (current) {
      var s = current.mc / 3;
      ctx.beginPath();
      ctx.strokeStyle = dark ? 'rgba(232,119,34,.9)' : '#E87722';
      ctx.lineWidth = 1.6;
      for (var px = 0; px <= w; px += 2) {
        var xv = (px / w - 0.5) * (2 * RANGE);
        var yv = Math.exp(-(xv * xv) / (2 * s * s));
        var y = h - 18 - yv * (h - 36) * 0.98;
        if (px === 0) ctx.moveTo(px, y);
        else ctx.lineTo(px, y);
      }
      ctx.stroke();
    }

    // Axis labels
    ctx.fillStyle = dark ? 'rgba(180,190,200,.75)' : 'rgba(90,100,110,.85)';
    ctx.font = '9px ui-monospace, SFMono-Regular, Menlo, monospace';
    ctx.fillText('LSL', Math.max(4, xL - 18), h - 4);
    ctx.fillText('0', x0 - 3, h - 4);
    ctx.fillText('USL', Math.min(w - 22, xU + 4), h - 4);

    if (t < 1500) raf = requestAnimationFrame(draw);
  }

  var needle = document.getElementById('needle');
  var ang = -90;
  var tgt = -90;
  var vel = 0;
  var gRaf = null;

  function spring() {
    if (gRaf) return;
    gRaf = requestAnimationFrame(function s() {
      vel += (tgt - ang) * 0.045;
      vel *= 0.82;
      ang += vel;
      if (needle) needle.setAttribute('transform', 'rotate(' + ang.toFixed(2) + ' 100 108)');
      if (Math.abs(tgt - ang) > 0.05 || Math.abs(vel) > 0.05) gRaf = requestAnimationFrame(s);
      else {
        if (needle) needle.setAttribute('transform', 'rotate(' + tgt.toFixed(2) + ' 100 108)');
        gRaf = null;
      }
    });
  }

  function tween(el, to, fmt) {
    if (!el) return;
    var from = el._v == null ? to : el._v;
    el._v = to;
    var t0 = performance.now();
    (function s(n) {
      var p = Math.min((n - t0) / 420, 1);
      var e = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(from + (to - from) * e);
      if (p < 1) requestAnimationFrame(s);
    })(t0);
  }

  function cpkStatus(cpk) {
    if (cpk >= 1.67) return { key: 'capable', label: 'CAPABLE', tone: 'ok' };
    if (cpk >= 1.33) return { key: 'ok', label: 'OK', tone: 'ok' };
    if (cpk >= 1.0) return { key: 'marginal', label: 'MARGINAL', tone: 'warn' };
    return { key: 'fail', label: 'OUT OF SPEC', tone: 'bad' };
  }

  var f4 = function (v) { return '±' + v.toFixed(4); };
  var f2 = function (v) { return v.toFixed(2); };
  var inTol = document.getElementById('inTol');
  var oTol = document.getElementById('oTol');
  var cpkStatusEl = document.getElementById('cpkStatus');
  var stackFill = document.getElementById('stackFill');
  var formulaEl = document.getElementById('deckFormula');
  var tickRail = document.getElementById('tolTicks');

  function paintStack(t1, r) {
    var max = Math.max(r.wc, 0.001);
    if (stackFill) {
      var parts = stackFill.querySelectorAll('[data-part]');
      for (var i = 0; i < parts.length; i++) {
        var el = parts[i];
        var id = el.getAttribute('data-part');
        var tol = id === 'spacer' ? t1 : (FIXED.find(function (p) { return p.id === id; }) || { tol: 0 }).tol;
        el.style.flexGrow = String(Math.max(tol / max, 0.08) * 100);
        var lab = el.querySelector('b');
        if (lab) lab.textContent = '±' + tol.toFixed(3);
      }
    }
    if (formulaEl) {
      formulaEl.innerHTML =
        'WC = Σ|t<sub>i</sub>| · RSS = 3√Σ(σ<sub>i</sub>²) · σ = Tol/3 · Cpk = Spec/(3σ<sub>stack</sub>)';
    }
  }

  function paintTicks() {
    if (!tickRail || tickRail.childElementCount) return;
    // ISO 2768-ish demo marks at 0.020 / 0.050 / 0.080 / 0.100
    [20, 50, 80, 100].forEach(function (v) {
      var m = document.createElement('span');
      m.style.left = (((v - 10) / 90) * 100).toFixed(2) + '%';
      m.title = '±' + (v / 1000).toFixed(3) + ' mm';
      tickRail.appendChild(m);
    });
  }

  function analytical(t1) {
    var tols = [t1].concat(FIXED.map(function (p) { return p.tol; }));
    var wc = tols.reduce(function (a, b) { return a + b; }, 0);
    var sig = tols.map(function (t) { return t / 3; });
    var sS = Math.sqrt(sig.reduce(function (a, s) { return a + s * s; }, 0));
    var rss = 3 * sS;
    // During scrub, RSS is the closed-form stand-in for MC — no particle rebuild.
    var mc = rss;
    return { wc: wc, rss: rss, mc: mc, cpk: SPEC / mc, contrib: tols, samples: null, ms: '—' };
  }

  function applyReadout(t1, r, opts) {
    opts = opts || {};
    if (oTol) oTol.textContent = '±' + t1.toFixed(3) + ' mm';
    if (opts.tween) {
      tween(document.getElementById('vWC'), r.wc, f4);
      tween(document.getElementById('vRSS'), r.rss, f4);
      tween(document.getElementById('vMC'), r.mc, f4);
      tween(document.getElementById('cpkVal'), r.cpk, f2);
    } else {
      var elWC = document.getElementById('vWC');
      var elRSS = document.getElementById('vRSS');
      var elMC = document.getElementById('vMC');
      var elCpk = document.getElementById('cpkVal');
      if (elWC) { elWC._v = r.wc; elWC.textContent = f4(r.wc); }
      if (elRSS) { elRSS._v = r.rss; elRSS.textContent = f4(r.rss); }
      if (elMC) { elMC._v = r.mc; elMC.textContent = f4(r.mc); }
      if (elCpk) { elCpk._v = r.cpk; elCpk.textContent = f2(r.cpk); }
    }
    var ct = document.getElementById('calcTime');
    if (ct) ct.textContent = r.ms === '—' ? 'preview' : r.ms + ' ms';

    var st = cpkStatus(r.cpk);
    if (cpkStatusEl) {
      cpkStatusEl.textContent = st.label;
      cpkStatusEl.dataset.tone = st.tone;
    }
    var wrap = document.querySelector('.sc-hero-gauge-wrap');
    if (wrap) wrap.dataset.tone = st.tone;

    tgt = -90 + (Math.max(0, Math.min(2.2, r.cpk)) / 2.2) * 180;
    spring();
    paintStack(t1, r);
  }

  /** Soft live preview — no Monte Carlo, no histogram restart (prevents "explode"). */
  function previewTol(tMicron) {
    var t1 = Math.max(0.01, Math.min(0.1, tMicron / 1000));
    if (inTol) inTol.value = String(Math.round(tMicron / 5) * 5);
    var r = analytical(t1);
    if (current && current.samples) {
      // Keep settled samples; only move the PDF overlay sigma.
      current = {
        wc: r.wc,
        rss: r.rss,
        mc: r.mc,
        cpk: r.cpk,
        samples: current.samples,
        ms: '—'
      };
    } else {
      current = r;
    }
    applyReadout(t1, r, { tween: false });
    // Gentle curve re-draw without particle rain restart
    if (raf) cancelAnimationFrame(raf);
    raf = requestAnimationFrame(function (now) {
      animStart = now - 2000; // skip rain; draw settled frame
      draw(now);
    });
  }

  /** Full commit — seeded MC + one cinematic histogram settle. */
  function recalc(opts) {
    opts = opts || {};
    if (!inTol) return;
    var t1 = +inTol.value / 1000;
    var r = runEngine(t1);
    current = r;
    applyReadout(t1, r, { tween: opts.tween !== false });
    if (opts.histo !== false) build(r.samples);
  }

  paintTicks();
  var deb = null;
  var userPinned = false;
  var resumeTimer = null;
  var autoRaf = null;
  var sceneEl = document.getElementById('deckScene');
  var liveDot = document.getElementById('deckLive');
  var calm = false;
  try {
    calm = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  } catch (e) {}

  // Cinematic one-way scenes — long ease, long hold, no scrub/rewind pulse.
  var SCENES = [
    { name: 'TIGHT FIT', from: 50, to: 20, ms: 5600, hold: 3400 },
    { name: 'NOMINAL ISO-m', from: 20, to: 50, ms: 6200, hold: 3800 },
    { name: 'PROCESS DRIFT', from: 50, to: 85, ms: 7200, hold: 3200 },
    { name: 'SPEC RISK', from: 85, to: 100, ms: 4800, hold: 4000 },
    { name: 'CORRECTIVE', from: 100, to: 50, ms: 7800, hold: 4200 }
  ];
  if (calm) {
    SCENES = [
      { name: 'TIGHT FIT', from: 50, to: 25, ms: 7000, hold: 4500 },
      { name: 'NOMINAL ISO-m', from: 25, to: 50, ms: 7000, hold: 4500 },
      { name: 'SPEC RISK', from: 50, to: 95, ms: 8000, hold: 4500 },
      { name: 'CORRECTIVE', from: 95, to: 50, ms: 8000, hold: 4500 }
    ];
  }

  var sceneIdx = 0;
  var sceneT0 = 0;
  var scenePhase = 'move'; // move | hold
  var lastPreviewSnap = -1;
  var activeScene = null;

  function setSceneLabel(name, live) {
    if (sceneEl) sceneEl.textContent = name;
    if (liveDot) {
      liveDot.dataset.on = live ? '1' : '0';
      liveDot.textContent = live ? 'AUTO-LIVE' : 'PAUSED';
    }
  }

  function easeInOut(p) {
    // Smoother cinematic ease (quintic)
    return p < 0.5
      ? 16 * p * p * p * p * p
      : 1 - Math.pow(-2 * p + 2, 5) / 2;
  }

  function pinUser() {
    userPinned = true;
    if (autoRaf) cancelAnimationFrame(autoRaf);
    autoRaf = null;
    setSceneLabel('MANUAL INPUT', false);
    if (resumeTimer) clearTimeout(resumeTimer);
    resumeTimer = setTimeout(function () {
      userPinned = false;
      startAuto();
    }, calm ? 16000 : 12000);
  }

  function autoTick(now) {
    autoRaf = null;
    if (userPinned || document.hidden) return;
    var sc = activeScene || SCENES[sceneIdx % SCENES.length];
    setSceneLabel(sc.name, true);

    if (scenePhase === 'move') {
      var p = Math.min(1, (now - sceneT0) / sc.ms);
      var e = easeInOut(p);
      var v = sc.from + (sc.to - sc.from) * e;
      var snap = Math.round(v / 5) * 5;
      if (oTol) oTol.textContent = '±' + (v / 1000).toFixed(3) + ' mm';
      if (snap !== lastPreviewSnap) {
        lastPreviewSnap = snap;
        previewTol(v);
      } else if (inTol) {
        inTol.value = String(snap);
      }

      if (p >= 1) {
        scenePhase = 'hold';
        sceneT0 = now;
        lastPreviewSnap = -1;
        if (inTol) inTol.value = String(sc.to);
        recalc({ tween: true, histo: true });
      }
    } else if (now - sceneT0 >= sc.hold) {
      sceneIdx = (sceneIdx + 1) % SCENES.length;
      var next = SCENES[sceneIdx];
      var cur = inTol ? +inTol.value : next.from;
      activeScene = {
        name: next.name,
        from: cur,
        to: next.to,
        ms: Math.max(next.ms, Math.abs(next.to - cur) * 90),
        hold: next.hold
      };
      scenePhase = 'move';
      sceneT0 = now;
      lastPreviewSnap = -1;
    }
    autoRaf = requestAnimationFrame(autoTick);
  }

  function startAuto() {
    if (userPinned) return;
    if (autoRaf) cancelAnimationFrame(autoRaf);
    var base = SCENES[sceneIdx % SCENES.length];
    var cur = inTol ? +inTol.value : base.from;
    activeScene = {
      name: base.name,
      from: cur,
      to: base.to,
      ms: Math.max(base.ms, Math.abs(base.to - cur) * 90),
      hold: base.hold
    };
    scenePhase = 'move';
    sceneT0 = performance.now();
    lastPreviewSnap = -1;
    setSceneLabel(activeScene.name, true);
    autoRaf = requestAnimationFrame(autoTick);
  }

  if (inTol) {
    inTol.addEventListener('pointerdown', pinUser);
    inTol.addEventListener('input', function () {
      pinUser();
      previewTol(+inTol.value);
      clearTimeout(deb);
      deb = setTimeout(function () { recalc({ tween: true, histo: true }); }, 220);
    });
    inTol.addEventListener('change', function () {
      pinUser();
      recalc({ tween: true, histo: true });
    });
  }

  var deckRoot = document.querySelector('.sc-hero .deck');
  if (deckRoot) {
    deckRoot.addEventListener('pointerdown', function (e) {
      if (e.target && (e.target.id === 'inTol' || (e.target.closest && e.target.closest('.e-ctrl')))) pinUser();
    });
  }

  addEventListener('resize', function () {
    if (current && current.samples) build(current.samples);
  });
  if (typeof ResizeObserver !== 'undefined') {
    var ro = new ResizeObserver(function () {
      if (current && current.samples) build(current.samples);
    });
    ro.observe(canvas.parentElement || canvas);
  }

  try {
    var cell = document.querySelector('.sc-hero .cell') || deckRoot;
    if (cell && typeof IntersectionObserver !== 'undefined') {
      var visIO = new IntersectionObserver(function (entries) {
        var on = entries.some(function (en) { return en.isIntersecting; });
        if (!on) {
          if (autoRaf) cancelAnimationFrame(autoRaf);
          autoRaf = null;
          setSceneLabel('STANDBY', false);
        } else if (!userPinned) startAuto();
      }, { threshold: 0.2 });
      visIO.observe(cell);
    }
  } catch (e2) {}

  document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
      if (autoRaf) cancelAnimationFrame(autoRaf);
      autoRaf = null;
    } else if (!userPinned) startAuto();
  });

  recalc({ tween: false, histo: true });
  setTimeout(function () {
    if (!userPinned) startAuto();
  }, 1600);
  document.addEventListener('sectorcalc-theme', function () {
    if (current && current.samples) build(current.samples);
  });
})();
