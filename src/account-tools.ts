/**
 * "My Tools" entitlement panel — renders only what the backend computed.
 * No status/expiry/credit math on the client; the backend owns every
 * access decision (sessionStatus, sessionRemaining*, canStartNewSession).
 */
import { fetchMyEntitlements, type EntitlementView } from './billing/entitlements-api.js';

export type EntToolFilter = 'all' | 'active' | 'ended' | 'need-credits';

const FILTERS: Array<{ key: EntToolFilter; label: string }> = [
  { key: 'all', label: 'All' },
  { key: 'active', label: 'Active sessions' },
  { key: 'ended', label: 'Session ended' },
  { key: 'need-credits', label: 'Need credits' }
];

function esc(s: string): string {
  return s.replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!
  );
}

function fmtNum(n: number): string {
  return n.toLocaleString('en-US');
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

function chipFor(e: EntitlementView): { cls: string; label: string } {
  if (e.status === 'SUSPENDED') return { cls: 'suspended', label: 'Suspended' };
  if (e.sessionStatus === 'ACTIVE') return { cls: 'active', label: 'Active' };
  return { cls: 'ended', label: 'Ended' };
}

function card(e: EntitlementView): string {
  const chip = chipFor(e);
  const active = e.sessionStatus === 'ACTIVE';

  let body: string;
  if (e.status === 'SUSPENDED') {
    body = `
      <p class="sc-tools-status">Access temporarily paused</p>
      <p class="sc-tools-detail">Session access is paused by the operator. Contact support for help.</p>`;
  } else if (active) {
    body = `
      <p class="sc-tools-status">Session active</p>
      <p class="sc-tools-detail">Ends in: <strong>${esc(e.sessionRemainingLabel)}</strong></p>
      <p class="sc-tools-detail">Wallet: ${fmtNum(e.creditsAvailable)} credits</p>
      <p class="sc-tools-detail sc-tools-muted">Next session: no additional charge while active</p>`;
  } else if (e.canStartNewSession) {
    body = `
      <p class="sc-tools-status">Session ended</p>
      <p class="sc-tools-detail">${fmtNum(e.creditsAvailable)} credits available</p>
      <p class="sc-tools-detail">Open tool to start a new 24-hour session</p>
      <p class="sc-tools-detail">Session cost: ${fmtNum(e.sessionCreditCost)} credits</p>`;
  } else {
    body = `
      <p class="sc-tools-status">Session ended</p>
      <p class="sc-tools-detail">${fmtNum(e.creditsAvailable)} credits available</p>
      <p class="sc-tools-detail">${fmtNum(e.sessionCreditCost)} credits required</p>`;
  }

  let cta: string;
  if (e.status === 'SUSPENDED') {
    cta = `<a class="acc-btn acc-btn-ghost acc-btn-sm" href="/contact.html">Contact support</a>`;
  } else if (active) {
    cta = `<a class="acc-btn acc-btn-primary acc-btn-sm" href="${esc(e.toolUrl)}">Open Tool</a>`;
  } else if (e.canStartNewSession) {
    cta = `<a class="acc-btn acc-btn-primary acc-btn-sm" href="${esc(e.toolUrl)}">Start New Session</a>`;
  } else {
    cta = `<a class="acc-btn acc-btn-primary acc-btn-sm" href="/pricing.html">Buy Credits</a>`;
  }

  return `<article class="acc-card sc-tools-card" data-tool-id="${esc(e.toolId)}">
    <div class="sc-tools-head">
      <h3>${esc(e.toolName)}</h3>
      <span class="sc-tools-chip sc-tools-chip-${chip.cls}">${chip.label}</span>
    </div>
    ${body}
    <p class="sc-tools-last">Last used: ${fmtWhen(e.lastUsedAt)}</p>
    <div class="acc-btn-row sc-tools-actions">
      ${cta}
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
  tools: number;
  activeSessions: number;
  suspended: number;
  creditsRemaining: number;
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
    tools: state.tools.length,
    activeSessions: state.tools.filter((t) => t.sessionStatus === 'ACTIVE').length,
    suspended: state.tools.filter((t) => t.status === 'SUSPENDED').length,
    creditsRemaining: state.creditsRemaining
  });

  const paint = (): void => {
    const s = summary();
    if (onSummary) onSummary(s);

    const visible =
      filter === 'all'
        ? state.tools
        : state.tools.filter((t) =>
            filter === 'active'
              ? t.sessionStatus === 'ACTIVE'
              : filter === 'ended'
                ? t.sessionStatus === 'ENDED' && t.canStartNewSession
                : t.sessionStatus === 'ENDED' && !t.canStartNewSession && t.status !== 'SUSPENDED'
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
        <h3>You have not used any tools yet.</h3>
        <p class="acc-muted">Buy credits, then open a calculator to start a 24-hour session. Tools you use will appear here.</p>
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
        <article class="acc-stat"><p class="acc-stat-label">Tools used</p><p class="acc-stat-value mono">${state.tools.length}</p></article>
        <article class="acc-stat"><p class="acc-stat-label">Active sessions</p><p class="acc-stat-value mono">${s.activeSessions}</p></article>
        <article class="acc-stat"><p class="acc-stat-label">Suspended</p><p class="acc-stat-value mono">${s.suspended}</p></article>
        <article class="acc-stat"><p class="acc-stat-label">Credits available</p><p class="acc-stat-value mono">${fmtNum(state.creditsRemaining)}</p></article>
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
