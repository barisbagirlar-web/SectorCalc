/**
 * Universal calculator credit gate — boots from auth-nav on every *-pro page.
 * Blocks calculate/compute/validateAndCalc until a professional session is active.
 * Future free tools: isCreditRequired(toolId) === false → no-op.
 */
import { isCreditRequired } from './domain/packages.js';
import { mountProfessionalGate, type ProfessionalGate } from './professional-ui.js';

declare global {
  interface Window {
    __scProGate?: ProfessionalGate;
    calculate?: (...args: unknown[]) => unknown;
    compute?: (...args: unknown[]) => unknown;
    validateAndCalc?: (...args: unknown[]) => unknown;
  }
}

const WRAPPED = new WeakSet<Function>();

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

function wipeUnlockedOutputs(): void {
  const ids = [
    'liveResult',
    'liveSub',
    'verdict',
    'outBox',
    'results',
    'resultBox',
    'outNominal',
    'outRss',
    'kpiRow'
  ];
  for (const id of ids) {
    const n = document.getElementById(id);
    if (!n) continue;
    if (id === 'liveResult' || id === 'verdict') n.textContent = 'Locked';
    else if (id === 'liveSub') n.innerHTML = '<span>Unlock with credits to calculate</span>';
    else n.innerHTML = '';
  }
  document.querySelectorAll<HTMLElement>('[data-sc-out], .sc-out-primary, .sc-kpi-value').forEach((n) => {
    if (n.dataset.scLocked === '1') return;
    n.dataset.scLocked = '1';
    if (n.childElementCount === 0) n.textContent = '—';
  });
}

function wrapFn(name: 'calculate' | 'compute' | 'validateAndCalc', gate: ProfessionalGate): void {
  const fn = window[name];
  if (typeof fn !== 'function' || WRAPPED.has(fn)) return;
  const original = fn.bind(window);
  const gated = function gatedCalc(this: unknown, ...args: unknown[]) {
    if (!gate.isEntitled()) {
      wipeUnlockedOutputs();
      gate.requireEntitled();
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
      if (gate.isEntitled()) return;
      ev.preventDefault();
      ev.stopImmediatePropagation();
      wipeUnlockedOutputs();
      gate.requireEntitled();
    },
    true
  );
}

function installIntercepts(gate: ProfessionalGate): void {
  wrapFn('calculate', gate);
  wrapFn('compute', gate);
  wrapFn('validateAndCalc', gate);
  installCalcButtonGuard(gate);
  if (!gate.isEntitled()) wipeUnlockedOutputs();
}

/**
 * Boot on calculator pages only. Safe no-op on pricing/account/home.
 */
export function bootToolCreditGate(): void {
  const toolId = readToolId();
  if (!toolId || !/^SC-\d{3}$/.test(toolId)) return;
  if (!isCreditRequired(toolId)) return;

  ensureBillingCss();
  const mount = ensureMount();
  if (window.__scProGate && mount.querySelector('.sc-pro-gate')) {
    // Already mounted (e.g. dedicated tool module) — still install intercepts.
    installIntercepts(window.__scProGate);
    return;
  }

  const gate = mountProfessionalGate({
    toolId,
    mount,
    onEntitled: (session) => {
      if (session) {
        // Re-run after unlock if a calculate entrypoint exists.
        const run = window.calculate || window.compute || window.validateAndCalc;
        if (typeof run === 'function') {
          try {
            run();
          } catch {
            /* engine may need inputs */
          }
        }
      } else {
        wipeUnlockedOutputs();
      }
    }
  });
  window.__scProGate = gate;
  installIntercepts(gate);

  // Classic inline engines define calculate() after modules; poll briefly.
  let tries = 0;
  const timer = window.setInterval(() => {
    tries += 1;
    installIntercepts(gate);
    if (tries >= 40) window.clearInterval(timer);
  }, 100);
}
