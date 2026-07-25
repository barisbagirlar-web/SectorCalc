/* sc-hero-engine.js — SectorCalc Live Deck v25
   Premium SC-008 Monte Carlo demo under the live cell.
   Deterministic seed · WC / RSS / MC · animated histogram with LSL/USL.
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
        delay: (i2 / N) * 520,
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
      var p = (t - d.delay) / 380;
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

    if (t < 980) raf = requestAnimationFrame(draw);
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

  function recalc() {
    if (!inTol) return;
    var t1 = +inTol.value / 1000;
    if (oTol) oTol.textContent = '±' + t1.toFixed(3) + ' mm';
    var r = runEngine(t1);
    current = r;
    tween(document.getElementById('vWC'), r.wc, f4);
    tween(document.getElementById('vRSS'), r.rss, f4);
    tween(document.getElementById('vMC'), r.mc, f4);
    tween(document.getElementById('cpkVal'), r.cpk, f2);
    var ct = document.getElementById('calcTime');
    if (ct) ct.textContent = r.ms + ' ms';

    var st = cpkStatus(r.cpk);
    if (cpkStatusEl) {
      cpkStatusEl.textContent = st.label;
      cpkStatusEl.dataset.tone = st.tone;
    }
    var wrap = document.querySelector('.sc-hero-gauge-wrap');
    if (wrap) wrap.dataset.tone = st.tone;

    // needle: Cpk 0 → 2.2 maps -90 → +90
    tgt = -90 + (Math.max(0, Math.min(2.2, r.cpk)) / 2.2) * 180;
    spring();
    paintStack(t1, r);
    build(r.samples);
  }

  paintTicks();
  var deb = null;
  if (inTol) {
    inTol.addEventListener('input', function () {
      clearTimeout(deb);
      deb = setTimeout(recalc, 90);
    });
  }
  addEventListener('resize', function () {
    if (current) build(current.samples);
  });
  if (typeof ResizeObserver !== 'undefined') {
    var ro = new ResizeObserver(function () {
      if (current) build(current.samples);
    });
    ro.observe(canvas.parentElement || canvas);
  }
  recalc();
  setTimeout(recalc, 2000);
  document.addEventListener('sectorcalc-theme', function () {
    if (current) build(current.samples);
  });
})();
