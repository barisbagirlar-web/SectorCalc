/**
 * Shared session-activation feedback — shows a success panel after a NEW
 * professional session is opened (reused === false && creditCost > 0).
 *
 * Listens for the `sectorcalc:session-activated` CustomEvent dispatched by
 * ProfessionalGate.startSession(). Renders once, works on every credit-gated
 * premium calculator without any tool-specific script.
 *
 * Behavior:
 * - Success panel under the access bar, above the form.
 * - Auto-closes after 5s (paused while hovered).
 * - "Reset & Start" clicks the existing tool reset button (data-sc-reset).
 * - Reset button gets a brief .sc-reset-attention pulse.
 * - One-shot per session id via sessionStorage.
 * - ARIA: role=status, aria-live=polite, Escape closes.
 */

const STORAGE_KEY = 'sectorcalc:session-activation-seen';
const AUTO_CLOSE_MS = 5000;
const ATTENTION_MS = 3000;
const EVENT = 'sectorcalc:session-activated';

export interface SessionActivatedDetail {
  toolId: string;
  sessionId: string;
  creditCost: number;
  expiresAt: string;
  newWalletBalance: number;
  reused: boolean;
}

function seenKey(sessionId: string, toolId: string, expiresAt: string): string {
  return sessionId || `${toolId}:${expiresAt}`;
}

function wasSeen(key: string): boolean {
  try {
    const seen = sessionStorage.getItem(STORAGE_KEY);
    return !!seen && seen.split('|').includes(key);
  } catch {
    return false;
  }
}

function markSeen(key: string): void {
  try {
    const seen = sessionStorage.getItem(STORAGE_KEY) || '';
    sessionStorage.setItem(STORAGE_KEY, seen ? `${seen}|${key}` : key);
  } catch {
    /* storage may be unavailable (privacy mode) — fall back to reused flag */
  }
}

function esc(s: string): string {
  return s.replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!
  );
}

function formatExpiry(iso: string): string {
  try {
    return new Date(iso).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
  } catch {
    return iso;
  }
}

/**
 * Find the tool's reset control. Priority:
 * 1. [data-sc-reset] (shared attribute added by the study toolbar / build layer)
 * 2. [data-sc-study="blank"] (study toolbar Reset)
 * 3. #resetAll / [data-action="reset"] / button[data-reset]
 * 4. visible button whose text is Reset / Clear / New Calculation / Start Over
 */
export function resolveToolResetButton(): HTMLButtonElement | null {
  const selectors = [
    '[data-sc-reset]',
    '[data-sc-study="blank"]',
    '#resetAll',
    '[data-action="reset"]',
    'button[data-reset]'
  ];
  for (const sel of selectors) {
    const el = document.querySelector<HTMLElement>(sel);
    if (el && el instanceof HTMLButtonElement) return el;
  }
  const words = ['reset', 'clear', 'new calculation', 'start over'];
  for (const btn of Array.from(document.querySelectorAll<HTMLButtonElement>('button'))) {
    const text = (btn.textContent || '').toLowerCase();
    if (words.some((w) => text.includes(w))) return btn;
  }
  return null;
}

function hostForPanel(): HTMLElement {
  const abar = document.getElementById('sc-abar-root');
  if (abar && abar.parentElement) return abar.parentElement;
  const gate = document.getElementById('sc-pro-gate-root');
  if (gate && gate.parentElement) return gate.parentElement;
  const sidebar = document.querySelector<HTMLElement>('.sc-sidebar, .sc-sidebar-scroll');
  if (sidebar) return sidebar;
  return document.body;
}

function renderPanel(detail: SessionActivatedDetail, onReset: () => void): void {
  const existing = document.getElementById('sc-session-feedback');
  if (existing) existing.remove();

  const panel = document.createElement('div');
  panel.id = 'sc-session-feedback';
  panel.className = 'sc-session-feedback';
  panel.setAttribute('role', 'status');
  panel.setAttribute('aria-live', 'polite');
  panel.setAttribute('aria-atomic', 'true');
  panel.innerHTML = `
    <div class="sc-session-feedback-body">
      <div class="sc-session-feedback-check" aria-hidden="true">✓</div>
      <div class="sc-session-feedback-copy">
        <p class="sc-session-feedback-title">Professional session activated</p>
        <p class="sc-session-feedback-meta">${esc(String(detail.creditCost))} credits used · Active for 24 hours</p>
        <p class="sc-session-feedback-desc">Your calculator is now unlocked. Press Reset to clear the demo values and start a new calculation.</p>
        <p class="sc-session-feedback-expires">Active until ${esc(formatExpiry(detail.expiresAt))}</p>
      </div>
      <div class="sc-session-feedback-actions">
        <button type="button" class="sc-session-feedback-btn sc-session-feedback-btn-primary" data-sc-sf-reset>Reset &amp; Start</button>
        <button type="button" class="sc-session-feedback-btn" data-sc-sf-continue>Continue with current values</button>
        <button type="button" class="sc-session-feedback-close" data-sc-sf-close aria-label="Close session activation message">✕</button>
      </div>
    </div>
  `;

  hostForPanel().insertBefore(panel, hostForPanel().firstChild);

  const close = (): void => panel.remove();
  panel.querySelector<HTMLButtonElement>('[data-sc-sf-close]')?.addEventListener('click', close);
  panel.querySelector<HTMLButtonElement>('[data-sc-sf-continue]')?.addEventListener('click', close);
  panel.querySelector<HTMLButtonElement>('[data-sc-sf-reset]')?.addEventListener('click', () => {
    close();
    onReset();
  });

  let hovered = false;
  panel.addEventListener('mouseenter', () => {
    hovered = true;
  });
  panel.addEventListener('mouseleave', () => {
    hovered = false;
  });
  window.setTimeout(function tick() {
    if (hovered) {
      window.setTimeout(tick, 500);
      return;
    }
    if (document.getElementById('sc-session-feedback')) close();
  }, AUTO_CLOSE_MS);

  const onKey = (e: KeyboardEvent): void => {
    if (e.key === 'Escape') {
      close();
      window.removeEventListener('keydown', onKey);
    }
  };
  window.addEventListener('keydown', onKey);
}

let pulseTimer: number | undefined;

function pulseResetButton(): void {
  const btn = resolveToolResetButton();
  if (!btn) return;
  if (pulseTimer !== undefined) window.clearTimeout(pulseTimer);
  btn.classList.add('sc-reset-attention');
  pulseTimer = window.setTimeout(() => {
    btn.classList.remove('sc-reset-attention');
    pulseTimer = undefined;
  }, ATTENTION_MS);
}

function handleActivated(detail: SessionActivatedDetail): void {
  if (!detail || detail.reused || !(detail.creditCost > 0)) return;
  const key = seenKey(detail.sessionId, detail.toolId, detail.expiresAt);
  if (wasSeen(key)) return;
  markSeen(key);

  const resetBtn = resolveToolResetButton();
  renderPanel(detail, () => {
    if (resetBtn) {
      resetBtn.click();
    } else if (typeof (window as Window & { resetAll?: () => void }).resetAll === 'function') {
      (window as Window & { resetAll?: () => void }).resetAll!();
    }
  });
  pulseResetButton();
}

/** Boot the shared feedback listener. Safe to call more than once. */
export function mountSessionActivationFeedback(): void {
  if ((window as Window & { __scSessionFeedbackMounted?: boolean }).__scSessionFeedbackMounted) {
    return;
  }
  (window as Window & { __scSessionFeedbackMounted?: boolean }).__scSessionFeedbackMounted = true;
  window.addEventListener(EVENT, ((e: Event) => {
    handleActivated((e as CustomEvent<SessionActivatedDetail>).detail);
  }) as EventListener);
}
