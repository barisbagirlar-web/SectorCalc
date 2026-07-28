/* sc-hero-engine.js — SectorCalc Live Deck v31
   Seiko sweep + LIVE histogram morph (counter and graph move together).
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
    var tols = [t1].concat(
      FIXED.map(function (p) {
        return p.tol;
      })
    );
    var wc = tols.reduce(function (a, b) {
      return a + b;
    }, 0);
    var sig = tols.map(function (t) {
      return t / 3;
    });
    var sS = Math.sqrt(
      sig.reduce(function (a, s) {
        return a + s * s;
      }, 0)
    );
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
  var baseSamples = null;
  var baseMc = 0;
  var liveScale = 1;
  var paintLive = false;

  var lastCssW = 0;
  var lastDpr = 0;

  function sizeC() {
    var r = canvas.getBoundingClientRect();
    var d = Math.min(devicePixelRatio || 1, 2);
    var w = Math.max(1, r.width);
    var h = 120;
    // Only reset backing store when size/DPR changes — avoids blank flicker mid-frame.
    if (w !== lastCssW || d !== lastDpr || canvas.width !== ((w * d) | 0)) {
      lastCssW = w;
      lastDpr = d;
      canvas.width = w * d;
      canvas.height = h * d;
      ctx.setTransform(d, 0, 0, d, 0, 0);
    }
    return { w: w, h: h };
  }

  function xOf(val, w) {
    return ((val + RANGE) / (2 * RANGE)) * w;
  }

  /** Build particle cloud from samples (optionally scaled). rain=false = settled morph. */
  function layoutDots(samples, scale, rain) {
    var size = sizeC();
    var w = size.w;
    var h = size.h;
    var B = 72;
    var bins = new Array(B).fill(0);
    var step = 4;
    var vals = new Float64Array(Math.ceil(N / step));
    var vi = 0;
    for (var i = 0; i < N; i += step) {
      var val = samples[i] * scale;
      vals[vi++] = val;
      var b = Math.floor(((val + RANGE) / (2 * RANGE)) * B);
      bins[Math.max(0, Math.min(B - 1, b))]++;
    }
    var mx = Math.max.apply(null, bins) || 1;
    var cnt = new Array(B).fill(0);
    dots = [];
    vi = 0;
    for (var i2 = 0; i2 < N; i2 += step) {
      var v2 = vals[vi++];
      var b2 = Math.max(0, Math.min(B - 1, Math.floor(((v2 + RANGE) / (2 * RANGE)) * B)));
      var k = cnt[b2]++;
      var rnd = mulberry32(SEED + i2)();
      dots.push({
        x: ((b2 + 0.5) / B) * w + (rnd - 0.5) * ((w / B) * 0.75),
        y: h - 18 - (k / mx) * (h - 36),
        delay: rain ? (i2 / N) * 900 : 0,
        inSpec: Math.abs(v2) <= SPEC
      });
    }
    animStart = rain ? performance.now() : performance.now() - 2000;
  }

  function ensureDraw() {
    if (raf) return;
    raf = requestAnimationFrame(draw);
  }

  function build(samples) {
    baseSamples = samples;
    baseMc = current && current.mc ? current.mc : 1;
    liveScale = 1;
    layoutDots(samples, 1, true);
    paintLive = true;
    ensureDraw();
  }

  /** Live morph — rescale last MC cloud to match analytical sigma. No rain restart. */
  function remorph(scale) {
    if (!baseSamples) return;
    liveScale = scale;
    layoutDots(baseSamples, scale, false);
    ensureDraw();
  }

  function draw(now) {
    var size = sizeC();
    var w = size.w;
    var h = size.h;
    var dark = document.documentElement.getAttribute('data-theme') === 'dark';
    var bg = dark ? '#1B1F23' : '#F4F6F8';
    var ink = dark ? 'rgba(232,234,236,.55)' : 'rgba(26,26,26,.45)';
    var blue = '#0055A4';
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

    // Normal curve overlay — always tracks live mc/sigma
    if (current) {
      var s = Math.max(1e-6, current.mc / 3);
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

    if (paintLive || t < 1500) {
      raf = requestAnimationFrame(draw);
    } else {
      raf = null;
    }
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

  var f4 = function (v) {
    return '±' + v.toFixed(4);
  };
  var f2 = function (v) {
    return v.toFixed(2);
  };
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
        var tol =
          id === 'spacer'
            ? t1
            : (
                FIXED.find(function (p) {
                  return p.id === id;
                }) || { tol: 0 }
              ).tol;
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
    var tols = [t1].concat(
      FIXED.map(function (p) {
        return p.tol;
      })
    );
    var wc = tols.reduce(function (a, b) {
      return a + b;
    }, 0);
    var sig = tols.map(function (t) {
      return t / 3;
    });
    var sS = Math.sqrt(
      sig.reduce(function (a, s) {
        return a + s * s;
      }, 0)
    );
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
      if (elWC) {
        elWC._v = r.wc;
        elWC.textContent = f4(r.wc);
      }
      if (elRSS) {
        elRSS._v = r.rss;
        elRSS.textContent = f4(r.rss);
      }
      if (elMC) {
        elMC._v = r.mc;
        elMC.textContent = f4(r.mc);
      }
      if (elCpk) {
        elCpk._v = r.cpk;
        elCpk.textContent = f2(r.cpk);
      }
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

  /** Soft live preview — readout + live histogram morph (graph moves with counter). */
  function previewTol(tMicron) {
    var t1 = Math.max(0.01, Math.min(0.1, tMicron / 1000));
    if (inTol) inTol.value = String(tMicron);
    var r = analytical(t1);
    if (current && baseSamples) {
      current = {
        wc: r.wc,
        rss: r.rss,
        mc: r.mc,
        cpk: r.cpk,
        samples: baseSamples,
        ms: '—'
      };
    } else {
      current = r;
    }
    applyReadout(t1, r, { tween: false });
    paintLive = true;
    if (baseSamples && baseMc > 0) {
      remorph(r.mc / baseMc);
    } else {
      // Curve-only redraw until first MC settle exists
      ensureDraw();
    }
  }

  /** Full commit — seeded MC + one cinematic histogram settle. */
  function recalc(opts) {
    opts = opts || {};
    if (!inTol) return;
    var t1 = +inTol.value / 1000;
    var r = runEngine(t1);
    current = r;
    baseSamples = r.samples;
    baseMc = r.mc;
    liveScale = 1;
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

  // Seiko akar saniye = constant |speed|, continuous (no 5µm tick jumps).
  // 60s round-trip 10→100→10 ⇒ 3 µm/s — same cadence as 6°/s second hand.
  var MIN_V = 10;
  var MAX_V = 100;
  var SPAN = MAX_V - MIN_V;
  var PERIOD_MS = calm ? 90000 : 60000;
  var HALF_MS = PERIOD_MS / 2;
  var sweepT0 = 0;
  var sweepDir = 1;
  var lastPreviewUm = -1;
  var lastSettleAt = 0;
  var lastZone = '';
  var frameN = 0;

  function zoneName(v) {
    if (v < 32) return 'TIGHT FIT';
    if (v < 58) return 'NOMINAL ISO-m';
    if (v < 82) return 'PROCESS DRIFT';
    return 'SPEC RISK';
  }

  function setSceneLabel(name, live) {
    if (sceneEl) sceneEl.textContent = name;
    if (liveDot) {
      liveDot.dataset.on = live ? '1' : '0';
      liveDot.textContent = live ? 'AUTO-LIVE' : 'PAUSED';
    }
  }

  /** Constant-speed triangle — never eases, never pauses. */
  function valueAtElapsed(elapsed) {
    var t = ((elapsed % PERIOD_MS) + PERIOD_MS) % PERIOD_MS;
    if (t <= HALF_MS) return MIN_V + SPAN * (t / HALF_MS);
    return MAX_V - SPAN * ((t - HALF_MS) / HALF_MS);
  }

  function setSweepVisual(v) {
    // Drive range with 0.1 resolution so the thumb crawls every frame.
    var q = Math.round(v * 10) / 10;
    q = Math.max(MIN_V, Math.min(MAX_V, q));
    if (inTol) inTol.value = String(q);
    if (oTol) oTol.textContent = '±' + (v / 1000).toFixed(3) + ' mm';
    // CSS fill for buttery track (independent of browser thumb rounding)
    var pct = ((v - MIN_V) / SPAN) * 100;
    if (inTol && inTol.parentElement) {
      inTol.parentElement.style.setProperty('--tol-pct', pct.toFixed(4) + '%');
    }
    return q;
  }

  function pinUser() {
    userPinned = true;
    if (autoRaf) cancelAnimationFrame(autoRaf);
    autoRaf = null;
    setSceneLabel('MANUAL INPUT', false);
    if (resumeTimer) clearTimeout(resumeTimer);
    resumeTimer = setTimeout(
      function () {
        userPinned = false;
        startAuto();
      },
      calm ? 16000 : 12000
    );
  }

  function autoTick(now) {
    autoRaf = null;
    if (userPinned || document.hidden) return;
    frameN++;

    var v = valueAtElapsed(now - sweepT0);
    setSweepVisual(v);

    var zone = zoneName(v);
    if (zone !== lastZone) lastZone = zone;
    setSceneLabel(zone, true);

    // Engine readout + histogram morph ~20Hz — graph tracks the hand.
    var um = Math.round(v * 10) / 10;
    if (um !== lastPreviewUm && frameN % 3 === 0) {
      lastPreviewUm = um;
      previewTol(v);
    }

    // Background full MC settle — refreshes particle seed base, never freezes graph.
    if (now - lastSettleAt > 20000) {
      lastSettleAt = now;
      if (inTol) inTol.value = String(Math.round(v * 10) / 10);
      recalc({ tween: false, histo: true });
    }

    autoRaf = requestAnimationFrame(autoTick);
  }

  function startAuto() {
    if (userPinned) return;
    if (autoRaf) cancelAnimationFrame(autoRaf);
    var cur = inTol ? +inTol.value : 55;
    var clamped = Math.max(MIN_V, Math.min(MAX_V, cur));
    var riseT = ((clamped - MIN_V) / SPAN) * HALF_MS;
    if (sweepDir < 0) {
      riseT = HALF_MS + ((MAX_V - clamped) / SPAN) * HALF_MS;
    }
    sweepT0 = performance.now() - riseT;
    lastPreviewUm = -1;
    lastSettleAt = 0;
    lastZone = '';
    frameN = 0;
    paintLive = true;
    setSceneLabel(zoneName(clamped), true);
    autoRaf = requestAnimationFrame(autoTick);
    ensureDraw();
  }

  if (inTol) {
    inTol.addEventListener('pointerdown', pinUser);
    inTol.addEventListener('input', function () {
      pinUser();
      previewTol(+inTol.value);
      clearTimeout(deb);
      deb = setTimeout(function () {
        recalc({ tween: true, histo: true });
      }, 220);
    });
    inTol.addEventListener('change', function () {
      pinUser();
      recalc({ tween: true, histo: true });
    });
  }

  var deckRoot = document.querySelector('.sc-hero .deck');
  if (deckRoot) {
    deckRoot.addEventListener('pointerdown', function (e) {
      if (
        e.target &&
        (e.target.id === 'inTol' || (e.target.closest && e.target.closest('.e-ctrl')))
      )
        pinUser();
    });
  }

  addEventListener('resize', function () {
    if (baseSamples) remorph(liveScale);
  });
  if (typeof ResizeObserver !== 'undefined') {
    var ro = new ResizeObserver(function () {
      if (baseSamples) remorph(liveScale);
    });
    ro.observe(canvas.parentElement || canvas);
  }

  try {
    var cell = document.querySelector('.sc-hero .cell') || deckRoot;
    if (cell && typeof IntersectionObserver !== 'undefined') {
      var visIO = new IntersectionObserver(
        function (entries) {
          var on = entries.some(function (en) {
            return en.isIntersecting;
          });
          if (!on) {
            if (autoRaf) cancelAnimationFrame(autoRaf);
            autoRaf = null;
            paintLive = false;
            setSceneLabel('STANDBY', false);
          } else if (!userPinned) startAuto();
        },
        { threshold: 0.2 }
      );
      visIO.observe(cell);
    }
  } catch (e2) {}

  document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
      if (autoRaf) cancelAnimationFrame(autoRaf);
      autoRaf = null;
      paintLive = false;
    } else if (!userPinned) startAuto();
  });

  recalc({ tween: false, histo: true });
  setTimeout(function () {
    if (!userPinned) startAuto();
  }, 1200);
  document.addEventListener('sectorcalc-theme', function () {
    if (baseSamples) remorph(liveScale);
  });
})();
