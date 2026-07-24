/**
 * SectorCalc site-wide theme engine.
 * - Persists: localStorage key "sectorcalc-theme" ("light" | "dark")
 * - Attribute: <html data-theme="light|dark">
 * - Toggle #themeToggle: click = theme; drag = reposition; double-click = reset position
 * - Position key: "sectorcalc-theme-pos" ({ leftPct, topPct } of available viewport)
 * - Pair with early head boot snippet (theme + optional position) to limit FOUC
 */
(function (global) {
  'use strict';

  var KEY = 'sectorcalc-theme';
  var POS_KEY = 'sectorcalc-theme-pos';
  var root = document.documentElement;
  var DRAG_THRESHOLD = 5;
  var BTN_FALLBACK = 48;
  var suppressClick = false;
  var drag = null;

  function systemPrefersDark() {
    try {
      return !!(global.matchMedia && global.matchMedia('(prefers-color-scheme: dark)').matches);
    } catch (e) {
      return false;
    }
  }

  function normalize(theme) {
    return theme === 'dark' ? 'dark' : 'light';
  }

  function readStored() {
    try {
      var stored = localStorage.getItem(KEY);
      if (stored === 'dark' || stored === 'light') return stored;
    } catch (e) {}
    return null;
  }

  function read() {
    var stored = readStored();
    if (stored) return stored;
    return systemPrefersDark() ? 'dark' : 'light';
  }

  function syncUi(theme) {
    var isDark = theme === 'dark';
    var btn = document.getElementById('themeToggle');
    if (btn) {
      btn.setAttribute('aria-pressed', isDark ? 'true' : 'false');
      btn.setAttribute(
        'aria-label',
        isDark ? 'Switch to light mode (drag to move)' : 'Switch to dark mode (drag to move)'
      );
      btn.title = isDark
        ? 'Light mode - drag to move, double-click to reset'
        : 'Dark mode - drag to move, double-click to reset';
    }
  }

  function apply(theme, opts) {
    theme = normalize(theme);
    root.setAttribute('data-theme', theme);
    root.style.colorScheme = theme;
    syncUi(theme);
    if (!opts || opts.emit !== false) {
      try {
        global.dispatchEvent(new CustomEvent('sectorcalc-theme', { detail: { theme: theme } }));
      } catch (e) {}
    }
    return theme;
  }

  function set(theme) {
    theme = normalize(theme);
    try {
      localStorage.setItem(KEY, theme);
    } catch (e) {}
    return apply(theme);
  }

  function toggle() {
    return set(read() === 'dark' ? 'light' : 'dark');
  }

  function clamp(n, min, max) {
    return Math.min(max, Math.max(min, n));
  }

  function readPos() {
    try {
      var raw = localStorage.getItem(POS_KEY);
      if (!raw) return null;
      var p = JSON.parse(raw);
      if (typeof p.leftPct === 'number' && typeof p.topPct === 'number') {
        return {
          leftPct: clamp(p.leftPct, 0, 100),
          topPct: clamp(p.topPct, 0, 100)
        };
      }
    } catch (e) {}
    return null;
  }

  function savePos(leftPct, topPct) {
    try {
      localStorage.setItem(
        POS_KEY,
        JSON.stringify({
          leftPct: clamp(leftPct, 0, 100),
          topPct: clamp(topPct, 0, 100)
        })
      );
    } catch (e) {}
  }

  function buttonSize(btn) {
    var w = (btn && btn.offsetWidth) || BTN_FALLBACK;
    var h = (btn && btn.offsetHeight) || BTN_FALLBACK;
    return { w: w, h: h };
  }

  function placeButton(btn, leftPx, topPx) {
    var size = buttonSize(btn);
    var maxL = Math.max(0, global.innerWidth - size.w);
    var maxT = Math.max(0, global.innerHeight - size.h);
    var left = clamp(leftPx, 0, maxL);
    var top = clamp(topPx, 0, maxT);
    btn.style.left = left + 'px';
    btn.style.top = top + 'px';
    btn.style.right = 'auto';
    btn.style.bottom = 'auto';
    btn.setAttribute('data-sc-pos', '1');
    return { left: left, top: top, maxL: maxL, maxT: maxT };
  }

  function clearInlinePosition(btn) {
    if (!btn) return;
    btn.removeAttribute('data-sc-pos');
    btn.style.left = '';
    btn.style.top = '';
    btn.style.right = '';
    btn.style.bottom = '';
  }

  function applyStoredPosition(btn) {
    if (!btn) return false;
    var pos = readPos();
    if (!pos) return false;
    var size = buttonSize(btn);
    var maxL = Math.max(0, global.innerWidth - size.w);
    var maxT = Math.max(0, global.innerHeight - size.h);
    placeButton(btn, (pos.leftPct / 100) * maxL, (pos.topPct / 100) * maxT);
    return true;
  }

  function resetPosition() {
    try {
      localStorage.removeItem(POS_KEY);
    } catch (e) {}
    clearInlinePosition(document.getElementById('themeToggle'));
  }

  function pointerXY(ev) {
    if (ev.touches && ev.touches[0]) {
      return { x: ev.touches[0].clientX, y: ev.touches[0].clientY };
    }
    if (ev.changedTouches && ev.changedTouches[0]) {
      return { x: ev.changedTouches[0].clientX, y: ev.changedTouches[0].clientY };
    }
    return { x: ev.clientX, y: ev.clientY };
  }

  function onPointerDown(ev) {
    var t = ev.target;
    if (!t || !t.closest) return;
    var btn = t.closest('#themeToggle');
    if (!btn) return;
    if (ev.type === 'mousedown' && ev.button !== 0) return;

    var pt = pointerXY(ev);
    var rect = btn.getBoundingClientRect();
    drag = {
      btn: btn,
      startX: pt.x,
      startY: pt.y,
      origLeft: rect.left,
      origTop: rect.top,
      moved: false
    };
    suppressClick = false;
    btn.classList.add('is-dragging');

    if (ev.type !== 'touchstart') {
      ev.preventDefault();
    }
  }

  function onPointerMove(ev) {
    if (!drag) return;
    var pt = pointerXY(ev);
    var dx = pt.x - drag.startX;
    var dy = pt.y - drag.startY;
    if (!drag.moved && Math.sqrt(dx * dx + dy * dy) < DRAG_THRESHOLD) return;
    drag.moved = true;
    suppressClick = true;
    if (ev.cancelable) ev.preventDefault();
    placeButton(drag.btn, drag.origLeft + dx, drag.origTop + dy);
  }

  function onPointerUp(ev) {
    if (!drag) return;
    var btn = drag.btn;
    var moved = drag.moved;
    btn.classList.remove('is-dragging');
    if (moved) {
      var rect = btn.getBoundingClientRect();
      var size = buttonSize(btn);
      var maxL = Math.max(0, global.innerWidth - size.w);
      var maxT = Math.max(0, global.innerHeight - size.h);
      var leftPct = maxL > 0 ? (rect.left / maxL) * 100 : 0;
      var topPct = maxT > 0 ? (rect.top / maxT) * 100 : 0;
      savePos(leftPct, topPct);
      placeButton(btn, rect.left, rect.top);
      if (ev && ev.cancelable) ev.preventDefault();
    }
    drag = null;
  }

  function onResize() {
    var btn = document.getElementById('themeToggle');
    if (!btn || btn.getAttribute('data-sc-pos') !== '1') return;
    applyStoredPosition(btn);
  }

  apply(read(), { emit: false });

  global.SectorCalcTheme = {
    key: KEY,
    posKey: POS_KEY,
    read: read,
    set: set,
    toggle: toggle,
    apply: apply,
    resetPosition: resetPosition,
    applyStoredPosition: function () {
      return applyStoredPosition(document.getElementById('themeToggle'));
    }
  };

  document.addEventListener(
    'click',
    function (ev) {
      var t = ev.target;
      if (!t || !t.closest) return;
      var btn = t.closest('#themeToggle');
      if (!btn) return;
      if (suppressClick) {
        suppressClick = false;
        ev.preventDefault();
        ev.stopPropagation();
        return;
      }
      ev.preventDefault();
      toggle();
    },
    true
  );

  document.addEventListener(
    'dblclick',
    function (ev) {
      var t = ev.target;
      if (!t || !t.closest) return;
      var btn = t.closest('#themeToggle');
      if (!btn) return;
      ev.preventDefault();
      ev.stopPropagation();
      suppressClick = true;
      resetPosition();
      global.setTimeout(function () {
        suppressClick = false;
      }, 0);
    },
    true
  );

  document.addEventListener('keydown', function (ev) {
    if (ev.key !== 'Enter' && ev.key !== ' ') return;
    var t = ev.target;
    if (!t || t.id !== 'themeToggle') return;
    ev.preventDefault();
    toggle();
  });

  // Pointer listeners on window so drag continues outside the button.
  document.addEventListener('mousedown', onPointerDown, true);
  global.addEventListener('mousemove', onPointerMove, true);
  global.addEventListener('mouseup', onPointerUp, true);
  document.addEventListener('touchstart', onPointerDown, { capture: true, passive: true });
  global.addEventListener('touchmove', onPointerMove, { capture: true, passive: false });
  global.addEventListener('touchend', onPointerUp, { capture: true, passive: false });
  global.addEventListener('touchcancel', onPointerUp, true);
  global.addEventListener('resize', onResize);

  global.addEventListener('storage', function (ev) {
    if (ev.key === KEY) {
      if (ev.newValue === 'dark' || ev.newValue === 'light') apply(ev.newValue);
      return;
    }
    if (ev.key === POS_KEY) {
      var btn = document.getElementById('themeToggle');
      if (!ev.newValue) clearInlinePosition(btn);
      else applyStoredPosition(btn);
    }
  });

  if (global.matchMedia) {
    try {
      global.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
        if (readStored()) return;
        apply(e.matches ? 'dark' : 'light');
      });
    } catch (e) {}
  }

  function removePosBootStyle() {
    var boot = document.getElementById('sc-theme-pos-boot');
    if (boot && boot.parentNode) boot.parentNode.removeChild(boot);
    root.removeAttribute('data-sc-pos-boot');
  }

  function bootButton() {
    var btn = document.getElementById('themeToggle');
    syncUi(read());
    applyStoredPosition(btn);
    removePosBootStyle();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootButton);
  } else {
    bootButton();
  }
})(window);
