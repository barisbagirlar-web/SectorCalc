/**
 * "My Tools" entitlement panel — renders only what the backend computed.
 * No status/expiry logic on the client.
 */
import { fetchMyEntitlements, type EntitlementView } from './billing/entitlements-api.js';

export type EntToolFilter = 'all' | 'active' | 'expiring' | 'expired';

const FILTERS: Array<{ key: EntToolFilter; label: string }> = [
  { key: 'all', label: 'All' },
  { key: 'active', label: 'Active' },
  { key: 'expiring', label: 'Expiring' },
  { key: 'expired', label: 'Expired' }
];

function esc(s: string): string {
  return s.replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!
  );
}

function fmtDate(iso: string | null): string {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

function fmtWhen(iso: string | null): string {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  const today = new Date();
  const sameDay = d.toDateString() === today.toDateString();
  if (sameDay) {
    return `Today, ${d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}`;
  }
  return fmtDate(iso);
}

function statusLabel(status: string): string {
  switch (status) {
    case 'ACTIVE':
      return 'Active';
    case 'EXPIRING':
      return 'Expiring';
    case 'EXPIRED':
      return 'Expired';
    case 'SUSPENDED':
      return 'Suspended';
    default:
      return status;
  }
}

function statusHint(status: string): string {
  switch (status) {
    case 'ACTIVE':
      return 'You can use this tool.';
    case 'EXPIRING':
      return 'Access ends soon — renew before it expires.';
    case 'EXPIRED':
      return 'Access has ended. Renew to continue.';
    case 'SUSPENDED':
      return 'Access is temporarily paused.';
    default:
      return '';
  }
}

function progressRatio(e: EntitlementView): number {
  if (!e.startsAt || !e.expiresAt) return 0;
  const start = Date.parse(e.startsAt);
  const end = Date.parse(e.expiresAt);
  if (Number.isNaN(start) || Number.isNaN(end) || end <= start) return 0;
  return Math.min(1, Math.max(0, (Date.now() - start) / (end - start)));
}

function usageText(e: EntitlementView): string {
  if (e.accessType === 'USAGE_LIMIT' && e.usageRemaining != null) {
    return `${e.usageRemaining} / ${e.usageLimit} uses remaining`;
  }
  if (e.accessType === 'LIFETIME') return 'Lifetime access';
  return `${e.creditsRemaining.toLocaleString('en-US')} credits available · ${e.creditCost} per session`;
}

function card(e: EntitlementView): string {
  const pct = Math.round(progressRatio(e) * 100);
  const showBar = e.accessType !== 'LIFETIME' && e.expiresAt;
  const expiresLine = showBar
    ? `<div class="sc-tools-exp">Access until ${fmtDate(e.expiresAt)}<span class="sc-tools-days">${
        e.daysRemaining != null && e.daysRemaining > 0
          ? `${e.daysRemaining} day${e.daysRemaining === 1 ? '' : 's'} remaining`
          : e.status === 'EXPIRED'
            ? 'ended'
            : 'expires today'
      }</span></div>
      <div class="sc-tools-bar" role="presentation"><span class="sc-tools-bar-fill" style="width:${Math.max(4, Math.min(100, pct))}%"></span></div>`
    : e.accessType === 'LIFETIME'
      ? `<div class="sc-tools-exp">Lifetime access</div>`
      : `<div class="sc-tools-exp">Session access</div>`;

  const cta =
    e.status === 'EXPIRED' || e.status === 'SUSPENDED'
      ? `<a class="acc-btn acc-btn-primary acc-btn-sm" href="/pricing.html">Renew access</a>`
      : `<a class="acc-btn acc-btn-primary acc-btn-sm" href="${esc(e.toolUrl)}">Open tool</a>`;

  return `<article class="acc-card sc-tools-card" data-tool-id="${esc(e.toolId)}">
    <div class="sc-tools-head">
      <h3>${esc(e.toolName)}</h3>
      <span class="sc-tools-chip sc-tools-chip-${e.status.toLowerCase()}">${statusLabel(e.status)}</span>
    </div>
    <p class="sc-tools-purchased">Purchased: ${fmtDate(e.purchasedAt)} · Last used: ${fmtWhen(e.lastUsedAt)}</p>
    ${expiresLine}
    <p class="sc-tools-usage">${usageText(e)}</p>
    <p class="sc-tools-hint">${statusHint(e.status)}</p>
    <div class="acc-btn-row sc-tools-actions">
      ${cta}
      <a class="acc-btn acc-btn-ghost acc-btn-sm" href="/account.html">Details</a>
    </div>
  </article>`;
}

export interface MyToolsState {
  tools: EntitlementView[];
  creditsRemaining: number;
  filter: EntToolFilter;
  loading: boolean;
  error: string | null;
}

export type MyToolsSummary = {
  purchased: number;
  active: number;
  expiring: number;
  expired: number;
};

export async function mountMyTools(
  container: HTMLElement,
  onSummary?: (s: MyToolsSummary) => void
): Promise<MyToolsState | null> {
  let filter: EntToolFilter = 'all';
  const state: MyToolsState = {
    tools: [],
    creditsRemaining: 0,
    filter,
    loading: true,
    error: null
  };

  const summary = (): MyToolsSummary => ({
    purchased: state.tools.length,
    active: state.tools.filter((t) => t.status === 'ACTIVE').length,
    expiring: state.tools.filter((t) => t.status === 'EXPIRING').length,
    expired: state.tools.filter((t) => t.status === 'EXPIRED' || t.status === 'SUSPENDED').length
  });

  const paint = (): void => {
    const s = summary();
    if (onSummary) onSummary(s);
    const { active, expiring } = s;

    const visible =
      filter === 'all'
        ? state.tools
        : state.tools.filter((t) =>
            filter === 'active'
              ? t.status === 'ACTIVE'
              : filter === 'expiring'
                ? t.status === 'EXPIRING'
                : t.status === 'EXPIRED' || t.status === 'SUSPENDED'
          );

    let body: string;
    if (state.loading) {
      body = `<div class="acc-card-grid sc-tools-grid">${'<div class="acc-card sc-tools-skel"></div>'.repeat(3)}</div>`;
    } else if (state.error) {
      body = `<div class="acc-card sc-tools-empty">
        <h3>We could not load your tools.</h3>
        <p class="acc-muted">${esc(state.error)}</p>
        <div class="acc-btn-row"><button type="button" class="acc-btn acc-btn-primary" id="sc-tools-retry">Retry</button></div>
      </div>`;
    } else if (state.tools.length === 0) {
      body = `<div class="acc-card sc-tools-empty">
        <h3>You have not purchased any tools yet.</h3>
        <p class="acc-muted">Buy credits, then open a calculator to unlock a 24-hour session. Your tools will appear here.</p>
        <div class="acc-btn-row"><a class="acc-btn acc-btn-primary" href="/pricing.html">Explore tools</a></div>
      </div>`;
    } else if (visible.length === 0) {
      body = `<div class="acc-card sc-tools-empty"><h3>No tools in this view.</h3></div>`;
    } else {
      body = `<div class="acc-card-grid sc-tools-grid">${visible.map(card).join('')}</div>`;
    }

    const filters = FILTERS.map(
      (f) =>
        `<button type="button" class="sc-tools-filter${filter === f.key ? ' is-active' : ''}" data-filter="${f.key}">${f.label}</button>`
    ).join('');

    container.innerHTML = `
      <div class="acc-stat-row sc-tools-stats">
        <article class="acc-stat"><p class="acc-stat-label">Purchased tools</p><p class="acc-stat-value mono">${state.tools.length}</p></article>
        <article class="acc-stat"><p class="acc-stat-label">Active</p><p class="acc-stat-value mono">${active}</p></article>
        <article class="acc-stat"><p class="acc-stat-label">Expiring soon</p><p class="acc-stat-value mono">${expiring}</p></article>
        <article class="acc-stat"><p class="acc-stat-label">Credits remaining</p><p class="acc-stat-value mono">${state.creditsRemaining.toLocaleString('en-US')}</p></article>
      </div>
      <div class="sc-tools-filterbar">${filters}</div>
      ${body}`;

    container.querySelectorAll<HTMLButtonElement>('.sc-tools-filter').forEach((btn) => {
      btn.addEventListener('click', () => {
        filter = (btn.dataset.filter || 'all') as EntToolFilter;
        state.filter = filter;
        paint();
      });
    });
    container.querySelector('#sc-tools-retry')?.addEventListener('click', () => {
      state.loading = true;
      state.error = null;
      paint();
      void load();
    });
  };

  const load = async (): Promise<void> => {
    state.loading = true;
    state.error = null;
    paint();
    try {
      const res = await fetchMyEntitlements();
      state.tools = res.tools || [];
      state.creditsRemaining = res.creditsRemaining || 0;
    } catch (err) {
      state.error = err instanceof Error ? err.message : 'Request failed';
    } finally {
      state.loading = false;
      paint();
    }
  };

  await load();
  return state;
}
