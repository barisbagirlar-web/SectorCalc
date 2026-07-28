/**
 * Universal calculator credit gate — boots from auth-nav on every *-pro page.
 *
 * Monetization model (Tier-A only; free tools never reach here):
 * - Locked: Load Demo OK, Reset blocked, inputs readonly, custom calc blocked.
 * - Unlocked (session): full edit + Reset + calculate.
 *
 * Critical: engines wire local `calculate` on input/change BEFORE window.calculate
 * is wrapped. Field lock + capture-phase guards close that bypass; wrapping alone
 * is not enough.
 */
import { isCreditRequired } from './domain/packages.js';
import { mountProfessionalGate, type ProfessionalGate } from './professional-ui.js';

declare global {
  interface Window {
    __scProGate?: ProfessionalGate;
    /** When true, gated calculate may run (demo restore / Load Demo Data). */
    __scDemoCalcPass?: boolean;
    calculate?: (...args: unknown[]) => unknown;
    compute?: (...args: unknown[]) => unknown;
    validateAndCalc?: (...args: unknown[]) => unknown;
    SCStudy?: {
      setAccessMode?: (mode: 'locked' | 'open') => void;
      restoreDemoSnapshot?: () => void;
      loadSample?: () => void;
      snapshot?: () => unknown;
    };
  }
}

const WRAPPED = new WeakSet<Function>();
const LOCK_ATTR = 'data-sc-gate-lock';

function readToolId(): string | null {
  const fromGuide = document.querySelector<HTMLElement>('#sc-guide[data-tool-id]')?.dataset.toolId;
  if (fromGuide) return fromGuide;
  const fromGate = document.querySelector<HTMLElement>('[data-tool]')?.getAttribute('data-tool');
  return fromGate || null;
}

function ensureBillingCss(): void {
  if (document.querySelector('link[href*="sc-billing.css"]')) return;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = '/sc-billing.css?v=2';
  document.head.appendChild(link);
}

function ensureMount(): HTMLElement {
  let el = document.getElementById('sc-pro-gate-root');
  if (el) return el;
  el = document.createElement('div');
  el.id = 'sc-pro-gate-root';
  const calcBtn = document.getElementById('calcBtn');
  const sidebar = calcBtn?.closest('.sc-sidebar, aside, .sc-panel') || null;
  const host =
    sidebar ||
    document.querySelector('.sc-main-inner, .sc-main, main, #reportArea') ||
    document.body;
  if (calcBtn && calcBtn.parentElement) {
    calcBtn.parentElement.insertBefore(el, calcBtn);
  } else {
    host.prepend(el);
  }
  return el;
}

function formControls(): HTMLElement[] {
  const root =
    document.querySelector('.sc-sidebar-scroll, .sc-sidebar, .wrap .panel, .wrap') || document.body;
  return Array.from(
    root.querySelectorAll<HTMLElement>(
      'input:not([type="hidden"]):not([type="file"]):not([type="button"]):not([type="submit"]):not([type="reset"]):not([type="image"]), select, textarea'
    )
  ).filter((node) => !node.closest('.sc-study-bar') && !node.closest('[data-sc-engage]'));
}

function lockFields(): void {
  for (const node of formControls()) {
    if (node.getAttribute(LOCK_ATTR) === '1') continue;
    const el = node as HTMLInputElement;
    if (el.tagName === 'SELECT' || el.type === 'checkbox' || el.type === 'radio') {
      node.dataset.scGateWasDisabled = el.disabled ? '1' : '0';
      el.disabled = true;
    } else {
      node.dataset.scGateWasReadonly = el.readOnly ? '1' : '0';
      el.readOnly = true;
    }
    node.setAttribute(LOCK_ATTR, '1');
  }
  document.documentElement.classList.add('sc-demo-locked');
  document.body.classList.add('sc-demo-locked');
}

function unlockFields(): void {
  for (const node of formControls()) {
    if (node.getAttribute(LOCK_ATTR) !== '1') continue;
    const el = node as HTMLInputElement;
    if (el.tagName === 'SELECT' || el.type === 'checkbox' || el.type === 'radio') {
      el.disabled = node.dataset.scGateWasDisabled === '1';
      delete node.dataset.scGateWasDisabled;
    } else {
      el.readOnly = node.dataset.scGateWasReadonly === '1';
      delete node.dataset.scGateWasReadonly;
    }
    node.removeAttribute(LOCK_ATTR);
  }
  document.documentElement.classList.remove('sc-demo-locked');
  document.body.classList.remove('sc-demo-locked');
}

function notifyStudy(mode: 'locked' | 'open'): void {
  try {
    window.SCStudy?.setAccessMode?.(mode);
  } catch {
    /* study bar may not be ready */
  }
}

function restoreDemoValues(): void {
  window.__scDemoCalcPass = true;
  try {
    if (typeof window.SCStudy?.restoreDemoSnapshot === 'function') {
      window.SCStudy.restoreDemoSnapshot();
    } else if (typeof window.SCStudy?.loadSample === 'function') {
      window.SCStudy.loadSample();
    }
  } catch {
    /* ignore */
  } finally {
    window.__scDemoCalcPass = false;
  }
}

/**
 * Locked Tier-A state: keep demo results visible, block custom work.
 * Do NOT wipe outputs to "Locked" — that destroys the demo teaser.
 */
function applyLockedDemoState(): void {
  lockFields();
  notifyStudy('locked');
}

function applyUnlockedState(): void {
  unlockFields();
  notifyStudy('open');
}

function denyCustomCalc(gate: ProfessionalGate): void {
  gate.requireEntitled();
}

function wrapFn(name: 'calculate' | 'compute' | 'validateAndCalc', gate: ProfessionalGate): void {
  const fn = window[name];
  if (typeof fn !== 'function' || WRAPPED.has(fn)) return;
  const original = fn.bind(window);
  const gated = function gatedCalc(this: unknown, ...args: unknown[]) {
    if (window.__scDemoCalcPass) return original(...args);
    if (!gate.isEntitled()) {
      denyCustomCalc(gate);
      return undefined;
    }
    return original(...args);
  };
  WRAPPED.add(gated);
  WRAPPED.add(original);
  window[name] = gated as typeof fn;
}

function installCalcButtonGuard(gate: ProfessionalGate): void {
  const btn = document.getElementById('calcBtn');
  if (!btn || btn.dataset.scGateBound === '1') return;
  btn.dataset.scGateBound = '1';
  btn.addEventListener(
    'click',
    (ev) => {
      if (window.__scDemoCalcPass || gate.isEntitled()) return;
      ev.preventDefault();
      ev.stopImmediatePropagation();
      denyCustomCalc(gate);
    },
    true
  );
}

/** Block Reset while locked (button may still exist before SCStudy syncs). */
function installResetGuard(gate: ProfessionalGate): void {
  if (document.documentElement.dataset.scResetGuard === '1') return;
  document.documentElement.dataset.scResetGuard = '1';
  document.addEventListener(
    'click',
    (ev) => {
      if (gate.isEntitled() || window.__scDemoCalcPass) return;
      const t = ev.target as HTMLElement | null;
      if (!t || typeof t.closest !== 'function') return;
      const resetBtn = t.closest('[data-sc-study="blank"]');
      if (!resetBtn) return;
      ev.preventDefault();
      ev.stopImmediatePropagation();
      denyCustomCalc(gate);
    },
    true
  );
}

/**
 * Defense-in-depth: even if readonly is stripped, force-edit reverts to demo
 * and never reaches local calculate listeners with custom values.
 */
function installFieldEditGuard(gate: ProfessionalGate): void {
  if (document.documentElement.dataset.scFieldGuard === '1') return;
  document.documentElement.dataset.scFieldGuard = '1';

  const revert = (ev: Event) => {
    if (window.__scDemoCalcPass || gate.isEntitled()) return;
    const t = ev.target as HTMLElement | null;
    if (!t || typeof t.closest !== 'function') return;
    if (t.closest('.sc-study-bar') || t.closest('[data-sc-engage]')) return;
    if (!t.matches('input, select, textarea')) return;
    ev.preventDefault();
    ev.stopImmediatePropagation();
    restoreDemoValues();
    denyCustomCalc(gate);
  };

  document.addEventListener('beforeinput', revert, true);
  document.addEventListener('input', revert, true);
  document.addEventListener('change', revert, true);
}

function installIntercepts(gate: ProfessionalGate): void {
  wrapFn('calculate', gate);
  wrapFn('compute', gate);
  wrapFn('validateAndCalc', gate);
  installCalcButtonGuard(gate);
  installResetGuard(gate);
  installFieldEditGuard(gate);
  if (gate.isEntitled()) applyUnlockedState();
  else applyLockedDemoState();
}

/**
 * Boot on calculator pages only. Safe no-op on pricing/account/home.
 * Free tools (isCreditRequired === false) never enter — full Reset/edit OK.
 */
export function bootToolCreditGate(): void {
  const toolId = readToolId();
  if (!toolId || !/^SC-\d{3}$/.test(toolId)) return;
  if (!isCreditRequired(toolId)) return;

  ensureBillingCss();
  const mount = ensureMount();
  if (window.__scProGate && mount.querySelector('.sc-pro-gate')) {
    installIntercepts(window.__scProGate);
    return;
  }

  const gate = mountProfessionalGate({
    toolId,
    mount,
    onEntitled: (session) => {
      if (session) {
        applyUnlockedState();
        const run = window.calculate || window.compute || window.validateAndCalc;
        if (typeof run === 'function') {
          try {
            run();
          } catch {
            /* engine may need inputs */
          }
        }
      } else {
        applyLockedDemoState();
        // Keep authored/demo values visible as the teaser — do not wipe.
      }
    }
  });
  window.__scProGate = gate;
  installIntercepts(gate);

  // Classic inline engines define calculate() after modules; poll briefly.
  // Also re-apply lock after SCStudy mounts / late field injection.
  let tries = 0;
  const timer = window.setInterval(() => {
    tries += 1;
    installIntercepts(gate);
    if (tries >= 40) window.clearInterval(timer);
  }, 100);
}
