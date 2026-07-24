/**
 * SectorCalc demo toolbar — English "Load Demo Data" + "Reset" + "Demo scenario active".
 * Same control pattern as degerlet (Load Demo Data / Reset / Demo scenario active).
 * Mounts on every *-pro calculator. Tools may override via window.SCStudy.register().
 * Default adapter: snapshot page-load form values as golden demo; Reset clears inputs.
 */
(function () {
  const handlers = Object.create(null);
  let sampleSnapshot = null;
  let mode = 'demo'; // 'demo' | 'blank'
  let editWired = false;

  const ICON_PLAY =
    '<svg class="sc-study-ico" width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M8 5.14v13.72L19 12 8 5.14z" fill="currentColor"/></svg>';
  const ICON_RESET =
    '<svg class="sc-study-ico" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M1 4v6h6"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>';

  function el(html) {
    const t = document.createElement('template');
    t.innerHTML = html.trim();
    return t.content.firstElementChild;
  }

  function toolMeta() {
    const guide = document.querySelector('#sc-guide, .sc-guide');
    return {
      toolId: (guide && guide.dataset.toolId) || document.body.dataset.toolBadge || 'SC',
      toolName: (guide && guide.dataset.toolName) || document.title
    };
  }

  function formRoot() {
    const calcBtn = document.getElementById('calcBtn');
    if (calcBtn) {
      const panel = calcBtn.closest('.panel, .sc-sidebar, form, .wrap');
      if (panel) return panel;
    }
    const sidebar = document.querySelector('.sc-sidebar');
    if (sidebar) return sidebar;
    const firstPanel = document.querySelector('.wrap .panel, .sc-layout .sc-sidebar');
    if (firstPanel) return firstPanel;
    return document.querySelector('.wrap') || document.body;
  }

  function controls(root) {
    return Array.from(
      root.querySelectorAll(
        'input:not([type="hidden"]):not([type="file"]):not([type="button"]):not([type="submit"]):not([type="reset"]):not([type="image"]), select, textarea'
      )
    ).filter((node) => !node.closest('.sc-study-bar') && !node.closest('[data-sc-engage]'));
  }

  function snapshotValues(root) {
    const out = [];
    controls(root).forEach((node, i) => {
      const key = node.id || node.name || `idx:${i}`;
      if (node.type === 'checkbox' || node.type === 'radio') {
        out.push({ key, id: node.id, type: node.type, checked: !!node.checked, value: node.value });
      } else {
        out.push({ key, id: node.id, type: node.type || node.tagName.toLowerCase(), value: node.value });
      }
    });
    return out;
  }

  function applySnapshot(snap) {
    const root = formRoot();
    const byId = new Map();
    controls(root).forEach((node, i) => {
      const key = node.id || node.name || `idx:${i}`;
      byId.set(key, node);
      if (node.id) byId.set('#' + node.id, node);
    });
    snap.forEach((item) => {
      const node = (item.id && document.getElementById(item.id)) || byId.get(item.key);
      if (!node) return;
      if (item.type === 'checkbox' || item.type === 'radio') {
        node.checked = !!item.checked;
      } else {
        node.value = item.value;
      }
      node.dispatchEvent(new Event('input', { bubbles: true }));
      node.dispatchEvent(new Event('change', { bubbles: true }));
    });
  }

  function clearForm() {
    const root = formRoot();
    controls(root).forEach((node) => {
      if (node.tagName === 'SELECT') {
        if (node.options.length) node.selectedIndex = 0;
      } else if (node.type === 'checkbox' || node.type === 'radio') {
        node.checked = false;
      } else {
        node.value = '';
      }
      node.dispatchEvent(new Event('input', { bubbles: true }));
      node.dispatchEvent(new Event('change', { bubbles: true }));
    });
  }

  function clearResults() {
    const live = document.getElementById('liveResult');
    const sub = document.getElementById('liveSub');
    if (live) live.textContent = '—';
    if (sub) sub.innerHTML = '';
    const report = document.getElementById('reportArea');
    if (report) report.innerHTML = '';
    const kpis = document.querySelectorAll('.kpi .v, .verdict, #verdictBanner, #auditBox');
    kpis.forEach((n) => {
      if (n.id === 'auditBox' || n.classList.contains('verdict')) n.innerHTML = '';
    });
  }

  function runCalc() {
    if (typeof window.calculate === 'function') {
      try { window.calculate(); return; } catch (e) { console.warn(e); }
    }
    if (typeof window.validateAndCalc === 'function') {
      try { window.validateAndCalc(); return; } catch (e) { console.warn(e); }
    }
    if (typeof window.compute === 'function') {
      try { window.compute(); return; } catch (e) { console.warn(e); }
    }
    const btn = document.getElementById('calcBtn') || document.getElementById('genReport');
    if (btn) btn.click();
  }

  function setMode(next) {
    mode = next;
    document.querySelectorAll('[data-sc-study]').forEach((btn) => {
      const key = btn.getAttribute('data-sc-study');
      btn.classList.toggle('is-active', key === next || (next === 'demo' && key === 'sample'));
    });
    const badge = document.querySelector('[data-sc-study-banner]');
    if (badge) {
      badge.hidden = next !== 'demo';
    }
  }

  function markEdited() {
    if (mode === 'demo') setMode('blank');
  }

  function wireEditClear() {
    if (editWired) return;
    editWired = true;
    const root = formRoot();
    root.addEventListener(
      'input',
      (e) => {
        if (e.target && e.target.closest && e.target.closest('.sc-study-bar')) return;
        markEdited();
      },
      true
    );
    root.addEventListener(
      'change',
      (e) => {
        if (e.target && e.target.closest && e.target.closest('.sc-study-bar')) return;
        markEdited();
      },
      true
    );
  }

  function defaultLoadSample() {
    if (!sampleSnapshot) sampleSnapshot = snapshotValues(formRoot());
    applySnapshot(sampleSnapshot);
    runCalc();
  }

  function defaultStartBlank() {
    clearForm();
    clearResults();
  }

  function loadSample() {
    const id = toolMeta().toolId;
    const custom = handlers[id] || handlers['*'];
    if (custom && typeof custom.loadSample === 'function') custom.loadSample();
    else defaultLoadSample();
    setMode('demo');
    if (custom && typeof custom.afterApply === 'function') custom.afterApply('sample');
  }

  function startBlank() {
    const id = toolMeta().toolId;
    const custom = handlers[id] || handlers['*'];
    if (custom && typeof custom.startBlank === 'function') custom.startBlank();
    else defaultStartBlank();
    setMode('blank');
    if (custom && typeof custom.afterApply === 'function') custom.afterApply('blank');
  }

  function ensureMount() {
    let host = document.querySelector('[data-sc-study-slot]');
    if (host) return host;

    host = el('<div class="sc-study-bar" data-sc-study-slot aria-label="Demo controls"></div>');

    const strip = document.querySelector('.sc-tool-strip');
    if (strip) {
      strip.appendChild(host);
      return host;
    }

    const head = document.querySelector('.wrap > .head, .wrap .head');
    if (head && head.parentElement) {
      head.parentElement.insertBefore(host, head);
      return host;
    }

    const wrap = document.querySelector('.wrap, .sc-layout');
    if (wrap) {
      wrap.insertBefore(host, wrap.firstChild);
      return host;
    }

    document.body.insertBefore(host, document.body.firstChild);
    return host;
  }

  function render() {
    const host = ensureMount();
    if (host.dataset.ready === '1') return host;
    host.dataset.ready = '1';
    host.innerHTML = `
      <div class="sc-study-bar__actions">
        <button type="button" class="sc-study-btn sc-study-btn--primary is-active" data-sc-study="sample" aria-label="Load Demo Data">
          ${ICON_PLAY}<span>Load Demo Data</span>
        </button>
        <button type="button" class="sc-study-btn sc-study-btn--ghost" data-sc-study="blank" aria-label="Reset">
          ${ICON_RESET}<span>Reset</span>
        </button>
        <span class="sc-study-badge" data-sc-study-banner>Demo scenario active</span>
      </div>
    `;
    host.querySelector('[data-sc-study="sample"]').addEventListener('click', loadSample);
    host.querySelector('[data-sc-study="blank"]').addEventListener('click', startBlank);
    return host;
  }

  function boot() {
    if (!/-pro\.html(?:$|\?)/.test(location.pathname) && !document.querySelector('.sc-tool-strip, #calcBtn, .sc-sidebar')) {
      return;
    }
    // Capture golden demo from authored HTML defaults before user edits.
    sampleSnapshot = snapshotValues(formRoot());
    render();
    wireEditClear();
    setMode('demo');
  }

  window.SCStudy = {
    register(toolId, api) {
      if (!toolId || !api) return;
      handlers[toolId] = Object.assign({}, handlers[toolId] || {}, api);
    },
    loadSample,
    startBlank,
    loadDemo: loadSample,
    reset: startBlank,
    snapshot: () => sampleSnapshot,
    resnapshot() {
      sampleSnapshot = snapshotValues(formRoot());
      return sampleSnapshot;
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      // Allow module tools one turn to render dynamic fields before snapshot.
      setTimeout(boot, 0);
    });
  } else {
    setTimeout(boot, 0);
  }
})();
