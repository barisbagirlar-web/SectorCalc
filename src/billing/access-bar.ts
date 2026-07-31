/**
 * Compact entitlement access bar for premium tool pages.
 * Read-only: renders only what the backend returned. Does not block the form.
 */
import { fetchToolEntitlement, type EntitlementView } from './entitlements-api.js';

const EN = 'en';
const esc = (s: string): string =>
  s.replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!
  );

function fmtDate(iso: string | null): string {
  if (!iso) return '—';
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? '—'
    : d.toLocaleDateString(EN, { month: 'short', day: 'numeric', year: 'numeric' });
}

function statusChip(status: string): string {
  const label = status.charAt(0) + status.slice(1).toLowerCase();
  return `<span class="sc-abar-chip sc-abar-chip-${status.toLowerCase()}">${label}</span>`;
}

function accessText(e: EntitlementView): string {
  if (e.accessType === 'LIFETIME') return 'Lifetime access';
  if (e.accessType === 'USAGE_LIMIT' && e.usageRemaining != null) {
    return `${e.usageRemaining} / ${e.usageLimit} uses remaining`;
  }
  if (e.expiresAt && (e.accessType === 'FIXED_TERM' || e.accessType === 'SUBSCRIPTION')) {
    const days =
      e.daysRemaining != null && e.daysRemaining > 0
        ? ` · ${e.daysRemaining} day${e.daysRemaining === 1 ? '' : 's'} remaining`
        : '';
    return `Available until ${fmtDate(e.expiresAt)}${days}`;
  }
  if (e.sessionActive) {
    return `Session active · ${e.creditsRemaining.toLocaleString('en-US')} credits remaining`;
  }
  return `${e.creditsRemaining.toLocaleString('en-US')} credits available · ${e.creditCost} per session`;
}

function cta(e: EntitlementView): string {
  if (!e.canAccess || e.status === 'EXPIRED' || e.status === 'SUSPENDED') {
    const label = e.status === 'EXPIRED' ? 'Renew access' : 'Get access';
    return `<a class="sc-abar-cta" href="/pricing.html">${label}</a>`;
  }
  return `<a class="sc-abar-cta sc-abar-cta-quiet" href="/account.html#tools">View purchase details</a>`;
}

export async function mountToolAccessBar(toolId: string, host: HTMLElement): Promise<void> {
  let el = host.querySelector<HTMLElement>('.sc-abar');
  if (el) el.remove();

  let view: EntitlementView;
  try {
    view = await fetchToolEntitlement(toolId);
  } catch {
    return; // no auth / network — never paint a broken bar
  }

  el = document.createElement('div');
  el.className = `sc-abar sc-abar-${view.status.toLowerCase()}`;
  el.innerHTML = `
    <div class="sc-abar-lead">
      ${statusChip(view.status)}
      <span class="sc-abar-text">${esc(accessText(view))}</span>
    </div>
    ${cta(view)}`;
  host.insertBefore(el, host.firstChild);
}
