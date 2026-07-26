/**
 * SectorCalc Administration console — light control plane.
 * Access: passphrase gate + Firebase Auth allowlist + Firestore admin rules.
 */
import {
  authReady,
  watchAuth,
  signOutUser,
  isOpsGateConfigured,
  isOpsUnlocked,
  unlockOpsGate,
  lockOpsGate,
  isOpsAdminEmail,
  getOpsAdminEmails,
  getFirebasePublicConfig,
  listUserProfiles,
  listOpsAudit,
  writeOpsAudit,
  adminSetUserCredits,
  adminAdjustUserCredits,
  profilesToCsv,
  downloadTextFile,
  type UserProfile,
  type OpsAuditEvent
} from './auth/index.js';
import { getPaddlePublicConfig } from './payments/paddle/index.js';
import { PACKAGES } from './lib/pricing-packages.js';
import { OPS_TOOL_CATALOG } from './lib/ops-tool-catalog.js';
import type { User } from 'firebase/auth';

const PANEL_META: Record<string, { title: string; sub: string }> = {
  overview: {
    title: 'Overview',
    sub: 'Operational health, registry counts, and payment surface status.'
  },
  users: {
    title: 'Users & credits',
    sub: 'Firestore profiles, search, CSV export, and audited credit adjustments.'
  },
  commerce: {
    title: 'Commerce',
    sub: 'Paddle merchant surface and published credit pack catalog.'
  },
  catalog: {
    title: 'Tool catalog',
    sub: 'Live engineering calculators in the public product registry.'
  },
  security: {
    title: 'Security',
    sub: 'Gate, allowlist, operator identity, and control-plane model.'
  },
  audit: {
    title: 'Audit log',
    sub: 'Immutable operator actions recorded in Firestore ops_audit.'
  },
  consoles: {
    title: 'External consoles',
    sub: 'Deep links to Firebase, Paddle, and public product surfaces.'
  }
};

let currentUser: User | null = null;
let profilesCache: UserProfile[] = [];
let auditCache: OpsAuditEvent[] = [];
let activeTab = 'overview';
let openLogged = false;

function $(id: string): HTMLElement | null {
  return document.getElementById(id);
}

function show(id: string, on: boolean): void {
  const el = $(id);
  if (el) el.hidden = !on;
}

function setMsg(id: string, text: string, kind: string = ''): void {
  const el = $(id);
  if (!el) return;
  el.textContent = text;
  el.dataset.kind = kind;
  el.hidden = !text;
}

function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function fmtWhen(ev: OpsAuditEvent): string {
  const ts = ev.at;
  if (!ts || typeof ts.toDate !== 'function') return '—';
  try {
    return ts.toDate().toISOString().replace('T', ' ').slice(0, 19);
  } catch {
    return '—';
  }
}

function tickClock(): void {
  const el = $('ops-chip-clock');
  if (el) el.textContent = new Date().toISOString().replace('T', ' ').slice(0, 19) + 'Z';
}

function setTab(tab: string): void {
  if (!PANEL_META[tab]) tab = 'overview';
  activeTab = tab;
  document.querySelectorAll<HTMLButtonElement>('.ops-nav-btn').forEach((btn) => {
    const on = btn.dataset.tab === tab;
    btn.classList.toggle('is-active', on);
    btn.setAttribute('aria-selected', on ? 'true' : 'false');
  });
  document.querySelectorAll<HTMLElement>('.ops-panel').forEach((panel) => {
    const on = panel.id === `panel-${tab}`;
    panel.hidden = !on;
    panel.classList.toggle('is-active', on);
  });
  const meta = PANEL_META[activeTab]!;
  setMsg('ops-panel-title', meta.title);
  const sub = $('ops-panel-sub');
  if (sub) sub.textContent = meta.sub;
}

function renderPacks(): void {
  const el = $('ops-packs');
  if (!el) return;
  el.innerHTML = PACKAGES.map((p) => {
    const badge = p.badge ? esc(p.badge) : '—';
    return `<tr>
      <td class="mono">${p.credits}</td>
      <td class="mono">${esc(p.price)}</td>
      <td class="mono">${esc(p.perCredit)}</td>
      <td>${badge}</td>
      <td><code>${esc(p.paddlePriceId)}</code></td>
      <td><button type="button" class="ops-btn ops-btn-sm ops-btn-ghost" data-copy="${esc(p.paddlePriceId)}">Copy ID</button></td>
    </tr>`;
  }).join('');
}

function renderTools(): void {
  const el = $('ops-tools');
  const count = $('catalog-count');
  if (count) count.textContent = `${OPS_TOOL_CATALOG.length} live engineering calculators`;
  if (!el) return;
  el.innerHTML = OPS_TOOL_CATALOG.map(
    (t) => `<tr>
      <td class="mono">${esc(t.id)}</td>
      <td>${esc(t.name)}</td>
      <td class="mono">${esc(t.status)}</td>
      <td><a class="ops-btn ops-btn-sm ops-btn-ghost" href="${esc(t.href)}" target="_blank" rel="noopener">Open</a></td>
    </tr>`
  ).join('');
}

function filteredProfiles(): UserProfile[] {
  const q = (($('user-search') as HTMLInputElement | null)?.value || '').trim().toLowerCase();
  if (!q) return profilesCache;
  return profilesCache.filter(
    (p) =>
      p.email.toLowerCase().includes(q) ||
      p.displayName.toLowerCase().includes(q) ||
      p.uid.toLowerCase().includes(q)
  );
}

function renderUsersTable(): void {
  const tbody = $('users-tbody');
  if (!tbody) return;
  const rows = filteredProfiles();
  if (!rows.length) {
    tbody.innerHTML = `<tr><td colspan="5">${profilesCache.length ? 'No matches.' : 'No Firestore profiles yet.'}</td></tr>`;
    return;
  }
  tbody.innerHTML = rows
    .map(
      (p) => `<tr>
      <td>${esc(p.email || '—')}</td>
      <td>${esc(p.displayName || '—')}</td>
      <td class="mono">${p.credits}</td>
      <td><code title="${esc(p.uid)}">${esc(p.uid.slice(0, 10))}…</code></td>
      <td class="ops-actions">
        <button type="button" class="ops-btn ops-btn-sm ops-btn-primary" data-select-user="${esc(p.uid)}" data-email="${esc(p.email)}">Adjust</button>
        <button type="button" class="ops-btn ops-btn-sm ops-btn-ghost" data-copy="${esc(p.uid)}">Copy UID</button>
      </td>
    </tr>`
    )
    .join('');
}

function renderAudit(): void {
  const tbody = $('audit-tbody');
  if (!tbody) return;
  if (!auditCache.length) {
    tbody.innerHTML = '<tr><td colspan="5">No audit events yet.</td></tr>';
    return;
  }
  tbody.innerHTML = auditCache
    .map(
      (ev) => `<tr>
      <td class="mono">${esc(fmtWhen(ev))}</td>
      <td class="mono">${esc(ev.action)}</td>
      <td>${esc(ev.actorEmail || ev.actorUid)}</td>
      <td>${esc(ev.targetEmail || ev.targetUid || '—')}</td>
      <td>${esc(ev.detail || '—')}</td>
    </tr>`
    )
    .join('');
}

function renderOverviewHealth(): void {
  const paddle = getPaddlePublicConfig();
  const fb = getFirebasePublicConfig();
  const items: Array<{ label: string; ok: boolean; detail: string }> = [
    { label: 'Firebase Auth', ok: authReady(), detail: authReady() ? 'ready' : 'missing' },
    { label: 'Firebase project', ok: Boolean(fb.projectId), detail: fb.projectId || 'missing' },
    { label: 'Paddle client token', ok: Boolean(paddle.clientToken), detail: paddle.clientToken ? 'configured' : 'missing' },
    { label: 'Paddle environment', ok: Boolean(paddle.environment), detail: paddle.environment || '—' },
    { label: 'Ops gate hash', ok: isOpsGateConfigured(), detail: isOpsGateConfigured() ? 'configured' : 'missing' },
    { label: 'Admin allowlist', ok: getOpsAdminEmails().length > 0, detail: `${getOpsAdminEmails().length} operator(s)` },
    { label: 'Tool registry', ok: OPS_TOOL_CATALOG.length >= 20, detail: `${OPS_TOOL_CATALOG.length} calculators` },
    { label: 'Credit packs', ok: PACKAGES.length > 0, detail: `${PACKAGES.length} SKUs` }
  ];
  const list = $('ops-health-list');
  if (list) {
    list.innerHTML = items
      .map(
        (i) =>
          `<li><span>${esc(i.label)}</span><span class="${i.ok ? 'ok' : 'bad'}">${esc(i.detail.toUpperCase())}</span></li>`
      )
      .join('');
  }
  setMsg('kpi-users', String(profilesCache.length));
  setMsg('kpi-credits', String(profilesCache.reduce((n, p) => n + p.credits, 0)));
  setMsg('kpi-tools', String(OPS_TOOL_CATALOG.length));
  setMsg('kpi-packs', String(PACKAGES.length));

  const paddleEnv = $('ops-paddle-env');
  const paddleTok = $('ops-paddle-token');
  if (paddleEnv) paddleEnv.textContent = paddle.environment || '—';
  if (paddleTok) paddleTok.textContent = paddle.clientToken ? `${paddle.clientToken.slice(0, 12)}…` : 'missing';
  setMsg('ops-chip-env', `paddle · ${paddle.environment || 'n/a'}`);
}

function renderSecurity(user: User): void {
  setMsg('ops-who-side', user.email || user.uid);
  setMsg('sec-gate', isOpsUnlocked() ? 'unlocked (tab session)' : 'locked');
  setMsg('sec-allowlist', getOpsAdminEmails().join(', ') || '—');
  setMsg('sec-operator', user.email || '—');
  setMsg('sec-uid', user.uid);
  setMsg('sec-verified', user.emailVerified ? 'yes' : 'no');
  const fb = getFirebasePublicConfig();
  setMsg('sec-project', fb.projectId || '—');
  const env = (import.meta as ImportMeta & { env?: Record<string, string | undefined> }).env;
  setMsg('sec-db', env?.VITE_FIREBASE_FIRESTORE_DB || 'sectorcalc-2');
}

async function loadData(showStatus = false): Promise<void> {
  if (!currentUser) return;
  try {
    if (showStatus) setMsg('ops-desk-msg', 'Refreshing registry…', '');
    profilesCache = await listUserProfiles();
    auditCache = await listOpsAudit(150);
    renderUsersTable();
    renderAudit();
    renderOverviewHealth();
    if (showStatus) setMsg('ops-desk-msg', `Synced · ${profilesCache.length} profiles · ${auditCache.length} audit rows`, 'ok');
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Refresh failed';
    setMsg('ops-desk-msg', msg, 'err');
  }
}

function selectUser(uid: string, email: string): void {
  const uidEl = $('credit-uid') as HTMLInputElement | null;
  const emailEl = $('credit-email') as HTMLInputElement | null;
  const valEl = $('credit-value') as HTMLInputElement | null;
  if (uidEl) uidEl.value = uid;
  if (emailEl) emailEl.value = email;
  const row = profilesCache.find((p) => p.uid === uid);
  if (valEl && row) {
    const mode = ($('credit-mode') as HTMLSelectElement | null)?.value || 'set';
    valEl.value = mode === 'set' ? String(row.credits) : '0';
  }
  setTab('users');
  $('credit-desk')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

async function copyText(text: string): Promise<void> {
  try {
    await navigator.clipboard.writeText(text);
    setMsg('ops-desk-msg', 'Copied to clipboard.', 'ok');
  } catch {
    setMsg('ops-desk-msg', 'Clipboard unavailable.', 'warn');
  }
}

function renderDashboard(user: User): void {
  currentUser = user;
  renderPacks();
  renderTools();
  renderSecurity(user);
  renderOverviewHealth();
  setTab(activeTab);
  void loadData(false);
  if (!openLogged) {
    openLogged = true;
    void writeOpsAudit(user, { action: 'console.open', detail: 'Administration console opened' }).catch(() => {
      /* audit best-effort on open */
    });
  }
}

function paint(user: User | null): void {
  currentUser = user;
  if (!isOpsGateConfigured()) {
    show('ops-setup', true);
    show('ops-gate', false);
    show('ops-auth', false);
    show('ops-desk', false);
    setMsg(
      'ops-setup-msg',
      'Set VITE_OPS_GATE_HASH and VITE_OPS_ADMIN_EMAILS in production env, then rebuild.'
    );
    return;
  }

  show('ops-setup', false);

  if (!isOpsUnlocked()) {
    show('ops-gate', true);
    show('ops-auth', false);
    show('ops-desk', false);
    return;
  }

  if (!user) {
    show('ops-gate', false);
    show('ops-auth', true);
    show('ops-desk', false);
    return;
  }

  if (!isOpsAdminEmail(user.email)) {
    show('ops-gate', false);
    show('ops-auth', true);
    show('ops-desk', false);
    setMsg(
      'ops-auth-msg',
      `Signed in as ${user.email}, but this email is not on the ops allowlist (${getOpsAdminEmails().join(', ')}).`,
      'err'
    );
    return;
  }

  show('ops-gate', false);
  show('ops-auth', false);
  show('ops-desk', true);
  renderDashboard(user);
}

function bindEvents(): void {
  $('gate-form')?.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    const pass = ($('gate-pass') as HTMLInputElement).value;
    const btn = $('gate-submit') as HTMLButtonElement | null;
    if (btn) btn.disabled = true;
    try {
      const ok = await unlockOpsGate(pass);
      if (!ok) {
        setMsg('gate-msg', 'Passphrase incorrect.', 'err');
        return;
      }
      setMsg('gate-msg', 'Gate unlocked for this browser tab.', 'ok');
      watchAuth((u) => paint(u));
    } finally {
      if (btn) btn.disabled = false;
    }
  });

  const lock = () => {
    lockOpsGate();
    location.reload();
  };

  $('ops-lock')?.addEventListener('click', lock);
  $('ops-lock-auth')?.addEventListener('click', lock);
  $('sec-lock')?.addEventListener('click', lock);

  $('ops-signout')?.addEventListener('click', async () => {
    await signOutUser();
    location.assign('/login.html?next=/sc-ops.html');
  });

  $('ops-goto-login')?.addEventListener('click', () => {
    location.assign('/login.html?next=/sc-ops.html');
  });

  document.querySelectorAll<HTMLButtonElement>('.ops-nav-btn').forEach((btn) => {
    btn.addEventListener('click', () => setTab(btn.dataset.tab || 'overview'));
  });

  document.querySelectorAll<HTMLButtonElement>('[data-goto]').forEach((btn) => {
    btn.addEventListener('click', () => setTab(btn.dataset.goto || 'overview'));
  });

  $('ops-refresh')?.addEventListener('click', () => void loadData(true));
  $('users-reload')?.addEventListener('click', () => void loadData(true));
  $('audit-reload')?.addEventListener('click', () => void loadData(true));

  $('user-search')?.addEventListener('input', () => renderUsersTable());

  $('users-export')?.addEventListener('click', () => {
    const csv = profilesToCsv(profilesCache);
    downloadTextFile(`sectorcalc-users-${new Date().toISOString().slice(0, 10)}.csv`, csv);
    setMsg('ops-desk-msg', `Exported ${profilesCache.length} profiles.`, 'ok');
  });

  $('audit-export')?.addEventListener('click', () => {
    const payload = JSON.stringify(
      auditCache.map((e) => ({
        id: e.id,
        action: e.action,
        actorEmail: e.actorEmail,
        actorUid: e.actorUid,
        targetEmail: e.targetEmail,
        targetUid: e.targetUid,
        detail: e.detail,
        at: fmtWhen(e)
      })),
      null,
      2
    );
    downloadTextFile(`sectorcalc-audit-${new Date().toISOString().slice(0, 10)}.json`, payload, 'application/json');
    setMsg('ops-desk-msg', `Exported ${auditCache.length} audit events.`, 'ok');
  });

  $('copy-paddle-token')?.addEventListener('click', () => {
    const paddle = getPaddlePublicConfig();
    void copyText(paddle.clientToken || '');
  });

  $('sec-copy-uid')?.addEventListener('click', () => {
    if (currentUser) void copyText(currentUser.uid);
  });

  $('credit-clear')?.addEventListener('click', () => {
    ($('credit-form') as HTMLFormElement | null)?.reset();
  });

  $('credit-form')?.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    if (!currentUser) return;
    const uid = (($('credit-uid') as HTMLInputElement).value || '').trim();
    const mode = ($('credit-mode') as HTMLSelectElement).value;
    const raw = Number(($('credit-value') as HTMLInputElement).value);
    const reason = (($('credit-reason') as HTMLInputElement).value || '').trim();
    if (!uid || !Number.isInteger(raw)) {
      setMsg('ops-desk-msg', 'UID and integer value are required.', 'err');
      return;
    }
    const btn = $('credit-submit') as HTMLButtonElement | null;
    if (btn) btn.disabled = true;
    try {
      const updated =
        mode === 'delta'
          ? await adminAdjustUserCredits(currentUser, uid, raw, reason)
          : await adminSetUserCredits(currentUser, uid, raw, reason);
      setMsg('ops-desk-msg', `Credits updated for ${updated.email || uid}: ${updated.credits}`, 'ok');
      await loadData(false);
    } catch (err) {
      setMsg('ops-desk-msg', err instanceof Error ? err.message : 'Credit update failed', 'err');
    } finally {
      if (btn) btn.disabled = false;
    }
  });

  document.addEventListener('click', (ev) => {
    const t = ev.target as HTMLElement | null;
    if (!t) return;
    const copyBtn = t.closest<HTMLElement>('[data-copy]');
    if (copyBtn?.dataset.copy) {
      void copyText(copyBtn.dataset.copy);
      return;
    }
    const sel = t.closest<HTMLElement>('[data-select-user]');
    if (sel?.dataset.selectUser) {
      selectUser(sel.dataset.selectUser, sel.dataset.email || '');
    }
  });
}

function init(): void {
  tickClock();
  window.setInterval(tickClock, 1000);
  bindEvents();

  if (!authReady()) {
    const boot = $('ops-boot');
    if (boot) {
      boot.hidden = false;
      setMsg('ops-boot', 'Firebase Auth is required for the administration console.', 'err');
    }
  }

  if (isOpsUnlocked()) {
    watchAuth((u) => paint(u));
  } else {
    paint(null);
  }
}

document.addEventListener('DOMContentLoaded', init);
