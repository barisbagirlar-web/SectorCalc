/**
 * Compact entitlement access bar for premium tool pages.
 * Read-only: renders only what the backend returned. Fail-closed: on any
 * entitlement API failure it shows a retry bar and NEVER unlocks the tool.
 */
import { fetchToolEntitlement, type EntitlementView } from './entitlements-api.js';

const esc = (s: string): string =>
  s.replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!
  );

const fmtNum = (n: number): string => n.toLocaleString('en-US');

function statusChip(cls: string, label: string): string {
  return `<span class="sc-abar-chip sc-abar-chip-${cls}">${label}</span>`;
}

/** Active-session bar. */
function activeBar(e: EntitlementView): string {
  return `
    ${statusChip('active', 'Session active')}
    <span class="sc-abar-text">${esc(e.sessionRemainingLabel)} remaining · ${fmtNum(
      e.creditsAvailable
    )} credits</span>`;
}

/** Ended session with enough credits to start a new one. */
function canStartBar(e: EntitlementView): string {
  return `
    ${statusChip('ended', 'Session ended')}
    <span class="sc-abar-text">New 24h session costs ${fmtNum(
      e.sessionCreditCost
    )} credits · ${fmtNum(e.creditsAvailable)} available</span>`;
}

/** Ended session with insufficient credits. */
function needCreditsBar(e: EntitlementView): string {
  return `
    ${statusChip('ended', 'Session ended')}
    <span class="sc-abar-text">${fmtNum(e.sessionCreditCost)} credits required · ${fmtNum(
      e.creditsAvailable
    )} available</span>
    <a class="sc-abar-cta" href="/pricing">Buy Credits</a>`;
}

function suspendedBar(): string {
  return `
    ${statusChip('suspended', 'Suspended')}
    <span class="sc-abar-text">Access is temporarily paused. Contact support.</span>`;
}

function retryBar(toolId: string): string {
  return `
    ${statusChip('ended', 'Unavailable')}
    <span class="sc-abar-text">Could not load access status.</span>
    <button type="button" class="sc-abar-cta" data-sc-abar-retry="${esc(toolId)}">Retry</button>`;
}

export async function mountToolAccessBar(toolId: string, host: HTMLElement): Promise<void> {
  let el = host.querySelector<HTMLElement>('.sc-abar');
  if (el) el.remove();

  const paint = (inner: string): void => {
    el = document.createElement('div');
    el.className = 'sc-abar';
    el.innerHTML = `<div class="sc-abar-lead">${inner}</div>`;
    host.insertBefore(el, host.firstChild);
    const retry = el.querySelector<HTMLButtonElement>('[data-sc-abar-retry]');
    retry?.addEventListener('click', () => void mountToolAccessBar(toolId, host));
  };

  let view: EntitlementView;
  try {
    view = await fetchToolEntitlement(toolId);
  } catch (err) {
    if (err instanceof Error && err.message === 'NOT_AUTHENTICATED') return; // sign-in flow handles this
    paint(retryBar(toolId)); // fail closed: never unlock on API failure
    return;
  }

  if (view.status === 'SUSPENDED') {
    paint(suspendedBar());
    return;
  }
  if (view.sessionStatus === 'ACTIVE' || view.canOpenWithoutDebit) {
    paint(activeBar(view));
    return;
  }
  if (view.canStartNewSession) {
    paint(canStartBar(view));
    return;
  }
  paint(needCreditsBar(view));
}
