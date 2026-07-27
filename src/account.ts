/**
 * Premium SectorCalc account workspace.
 */
import {
  authReady,
  watchAuth,
  signOutUser,
  readUserProfile,
  friendlyAuthError,
  isOpsAdminEmail,
  listCloudPurchases,
  mergePurchases,
  readLocalPurchases,
  readPrefs,
  writePrefs,
  syncPrefsToCloud,
  listSessions,
  revokeSession,
  touchSession,
  listCloudLedger,
  readLocalLedger,
  mergeMovements,
  withRunningBalance,
  ledgerTotals,
  purchasesAsMovements,
  type PurchaseRecord,
  type DeviceSession,
  type AccountPrefs,
  type CreditMovement
} from './auth/index.js';
import { readCredits } from './payments/paddle/credits.js';
import { fetchWallet } from './billing/api.js';
import type { User } from 'firebase/auth';

const TAB_META: Record<string, { title: string; sub: string }> = {
  overview: { title: 'Overview', sub: 'Balance, receipts, and session posture for your SectorCalc identity.' },
  billing: { title: 'Billing', sub: 'Purchase receipts from Paddle checkout (browser + cloud).' },
  credits: {
    title: 'Credits',
    sub: 'Credit statement — purchases, spends, and adjustments with date and time.'
  },
  security: { title: 'Security', sub: 'Identity plate and registered device sessions.' },
  preferences: { title: 'Preferences', sub: 'Notification and workspace density settings.' },
  workspace: { title: 'Workspace', sub: 'Jump into calculators and the credit store.' }
};

let activeTab = 'overview';
let current: User | null = null;
let purchases: PurchaseRecord[] = [];
let sessions: DeviceSession[] = [];
let movements: CreditMovement[] = [];
let inspectUid: string | null = null;

function $(id: string): HTMLElement | null {
  return document.getElementById(id);
}

function setText(id: string, text: string): void {
  const el = $(id);
  if (el) el.textContent = text;
}

function toast(text: string, kind: '' | 'ok' | 'err' = ''): void {
  const el = $('acc-toast');
  if (!el) return;
  el.textContent = text;
  el.dataset.kind = kind;
}

function providerLabel(raw: string): string {
  if (raw === 'password') return 'Email / password';
  if (raw === 'google.com') return 'Google';
  return raw || 'Email / password';
}

function fmtDate(iso: string): string {
  if (!iso) return '—';
  return iso.replace('T', ' ').slice(0, 19);
}

function readInspectUid(): string | null {
  try {
    const v = new URLSearchParams(location.search).get('inspect');
    return v && /^[A-Za-z0-9]{8,128}$/.test(v) ? v : null;
  } catch {
    return null;
  }
}



function kindLabel(kind: CreditMovement['kind']): string {
  switch (kind) {
    case 'purchase':
      return 'Purchase';
    case 'spend':
      return 'Spend';
    case 'refund':
      return 'Refund';
    case 'admin':
      return 'Admin';
    case 'promo':
      return 'Promo';
    case 'sync':
      return 'Sync';
    default:
      return 'Movement';
  }
}

function renderLedger(): void {
  const tbody = $('ledger-tbody');
  const empty = $('ledger-empty');
  if (!tbody) return;
  const totals = ledgerTotals(movements);
  setText('acc-ledger-purchased', String(totals.purchased));
  setText('acc-ledger-spent', String(totals.spent));
  setText('acc-ledger-count', String(movements.length));
  if (!movements.length) {
    tbody.innerHTML = '';
    if (empty) empty.hidden = false;
    return;
  }
  if (empty) empty.hidden = true;
  tbody.innerHTML = movements
    .map((m) => {
      const amtClass = m.delta > 0 ? 'acc-amt-credit' : 'acc-amt-debit';
      const amt = m.delta > 0 ? `+${m.delta}` : String(m.delta);
      const bal = m.balanceAfter == null ? '—' : String(m.balanceAfter);
      const detail = m.detail ? `<div class="acc-muted">${m.detail}</div>` : '';
      return `<tr>
        <td class="mono">${fmtDate(m.at)}</td>
        <td><span class="acc-kind acc-kind-${m.kind}">${kindLabel(m.kind)}</span></td>
        <td><strong>${m.label}</strong>${detail}</td>
        <td class="mono ${amtClass}">${amt}</td>
        <td class="mono">${bal}</td>
        <td><code class="mono">${m.txnId}</code></td>
      </tr>`;
    })
    .join('');
}

function initialsFor(user: User): string {
  const base = (user.displayName || user.email || 'SC').trim();
  const parts = base.split(/[\s@._-]+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0]![0]! + parts[1]![0]!).toUpperCase();
  return base.slice(0, 2).toUpperCase();
}

function setLoading(on: boolean): void {
  const load = $('acc-loading');
  if (load) load.hidden = !on;
}

function setTab(tab: string): void {
  if (!TAB_META[tab]) tab = 'overview';
  activeTab = tab;
  document.querySelectorAll<HTMLButtonElement>('.acc-side-btn').forEach((btn) => {
    const on = btn.dataset.accTab === tab;
    btn.classList.toggle('is-active', on);
    btn.setAttribute('aria-selected', on ? 'true' : 'false');
  });
  document.querySelectorAll<HTMLElement>('.acc-tab').forEach((panel) => {
    const on = panel.id === `acc-tab-${tab}`;
    panel.hidden = !on;
    panel.classList.toggle('is-active', on);
  });
  const meta = TAB_META[activeTab]!;
  setText('acc-panel-title', meta.title);
  const sub = $('acc-panel-sub');
  if (sub) sub.textContent = meta.sub;
}

function paintAvatar(user: User): void {
  const ini = initialsFor(user);
  setText('acc-initials', ini);
  setText('acc-initials-lg', ini);
  const apply = (imgId: string, iniId: string) => {
    const photo = $(imgId) as HTMLImageElement | null;
    const initials = $(iniId);
    if (!photo) return;
    if (user.photoURL) {
      photo.src = user.photoURL;
      photo.hidden = false;
      if (initials) initials.hidden = true;
    } else {
      photo.hidden = true;
      if (initials) initials.hidden = false;
    }
  };
  apply('acc-photo', 'acc-initials');
  apply('acc-photo-lg', 'acc-initials-lg');
}

function renderBilling(): void {
  const tbody = $('billing-tbody');
  const empty = $('billing-empty');
  if (!tbody) return;
  if (!purchases.length) {
    tbody.innerHTML = '';
    if (empty) empty.hidden = false;
    return;
  }
  if (empty) empty.hidden = true;
  tbody.innerHTML = purchases
    .map(
      (p) => `<tr>
      <td class="mono">${fmtDate(p.at)}</td>
      <td class="mono">${p.credits}</td>
      <td class="mono">${p.amountLabel}</td>
      <td><code class="mono">${p.txnId}</code></td>
      <td>${p.source}</td>
    </tr>`
    )
    .join('');
}

function renderDevices(): void {
  const list = $('device-list');
  if (!list) return;
  if (!sessions.length) {
    list.innerHTML = '<li class="acc-muted">No registered devices yet.</li>';
    return;
  }
  list.innerHTML = sessions
    .map((s) => {
      const badge = s.current ? '<span class="acc-chip">This device</span>' : '';
      const action = s.current
        ? ''
        : `<button type="button" class="acc-btn acc-btn-ghost acc-btn-sm" data-revoke="${s.id}">Revoke</button>`;
      return `<li class="acc-device">
        <div><strong>${s.label}</strong> ${badge}<br><span class="mono acc-muted">${fmtDate(s.lastSeenAt)}</span></div>
        ${action}
      </li>`;
    })
    .join('');
}

function fillPrefs(prefs: AccountPrefs): void {
  const a = $('pref-email-product') as HTMLInputElement | null;
  const b = $('pref-email-receipts') as HTMLInputElement | null;
  const c = $('pref-compact') as HTMLInputElement | null;
  if (a) a.checked = prefs.emailProduct;
  if (b) b.checked = prefs.emailReceipts;
  if (c) c.checked = prefs.compactWorkspace;
  document.documentElement.dataset.accCompact = prefs.compactWorkspace ? '1' : '0';
}

async function loadPremiumData(user: User, displayBalance: number, subjectUid?: string): Promise<void> {
  const uid = subjectUid || user.uid;
  const inspecting = Boolean(subjectUid && subjectUid !== user.uid);
  let cloudPurchases: PurchaseRecord[] = [];
  try {
    cloudPurchases = await listCloudPurchases(uid);
  } catch {
    cloudPurchases = [];
  }
  purchases = inspecting
    ? mergePurchases(cloudPurchases, [])
    : mergePurchases(cloudPurchases, readLocalPurchases());

  let cloudLedger: CreditMovement[] = [];
  try {
    cloudLedger = await listCloudLedger(uid);
  } catch {
    cloudLedger = [];
  }
  movements = withRunningBalance(
    mergeMovements(
      cloudLedger,
      inspecting ? [] : readLocalLedger(),
      purchasesAsMovements(purchases)
    ),
    displayBalance
  );

  try {
    if (!inspecting) await touchSession(user);
    sessions = await listSessions(uid);
  } catch {
    sessions = [];
  }
  if (!inspecting) fillPrefs(readPrefs());
  renderBilling();
  renderLedger();
  renderDevices();
}

async function render(user: User): Promise<void> {
  current = user;
  setLoading(true);
  inspectUid = readInspectUid();
  const canInspect = Boolean(inspectUid && isOpsAdminEmail(user.email));
  if (inspectUid && !canInspect) {
    inspectUid = null;
  }
  const subjectUid = canInspect && inspectUid ? inspectUid : user.uid;
  const inspecting = subjectUid !== user.uid;

  const banner = $('acc-inspect-banner');
  if (banner) banner.hidden = !inspecting;

  let cloud = 0;
  let profileName = '';
  let profileEmail = '';
  try {
    const profile = await readUserProfile(subjectUid);
    if (profile) {
      cloud = profile.credits;
      profileName = profile.displayName || '';
      profileEmail = profile.email || '';
    }
  } catch {
    /* keep */
  }
  const guest = inspecting ? 0 : readCredits().balance;
  let serverSpendable: number | null = null;
  if (!inspecting) {
    try {
      const w = await fetchWallet();
      serverSpendable = w.spendableCredits;
    } catch {
      serverSpendable = null;
    }
  }
  const display = inspecting
    ? cloud
    : serverSpendable != null
      ? serverSpendable
      : Math.max(cloud, guest);
  await loadPremiumData(user, display, inspecting ? subjectUid : undefined);

  const lifetime = purchases.reduce((n, p) => n + p.credits, 0);
  const providers = user.providerData.map((p) => providerLabel(p.providerId));
  const providerText = inspecting
    ? 'Inspected cloud profile'
    : providers.length
      ? providers.join(' · ')
      : 'Email / password';
  const name = inspecting
    ? profileName || profileEmail || 'Customer account'
    : user.displayName || 'SectorCalc engineer';
  const email = inspecting ? profileEmail || 'No email on file' : user.email || 'No email on file';
  const last = inspecting
    ? '—'
    : user.metadata?.lastSignInTime
      ? new Date(user.metadata.lastSignInTime).toISOString().replace('T', ' ').slice(0, 19) + 'Z'
      : '—';
  const since = inspecting
    ? '—'
    : user.metadata?.creationTime
      ? new Date(user.metadata.creationTime).toISOString().slice(0, 10)
      : '—';

  if (inspecting) {
    setText(
      'acc-inspect-copy',
      `Viewing cloud account ${email} (${subjectUid}). Statement and devices are customer data; you remain signed in as ${user.email || 'operator'}.`
    );
  }

  setText('acc-name', name);
  setText('acc-name-side', name);
  setText('acc-email', email);
  setText('acc-email-side', email);
  setText('acc-email-spec', email);
  setText('acc-uid', subjectUid);
  setText('acc-credits', String(display));
  setText('acc-credits-hero', String(display));
  setText('acc-lifetime', String(lifetime));
  setText('acc-ledger-available', String(display));
  setText('acc-device-count', String(sessions.length));
  setText('acc-cloud-detail', String(cloud));
  setText('acc-local-detail', inspecting ? 'n/a (inspect)' : String(guest));
  setText('acc-display-detail', String(display));
  setText('acc-provider-spec', providerText);
  setText('acc-since', since);
  setText('acc-last-signin', last);
  setText(
    'acc-session',
    inspecting
      ? 'Operator inspect · read-only customer workspace'
      : user.emailVerified
        ? 'Verified session · premium workspace'
        : 'Session active · email not verified'
  );
  setText('acc-verified-spec', inspecting ? '—' : user.emailVerified ? 'Yes' : 'No');
  setText(
    'acc-next-copy',
    inspecting
      ? 'Use Credits for the customer statement. Return to ops to adjust balance.'
      : display < 1
        ? 'You have zero credits. Buy a pack to unlock paid report runs, or continue with free exploratory use.'
        : `You have ${display} credit${display === 1 ? '' : 's'} ready. Generate an auditable report when you need a formal deliverable.`
  );

  // Keep operator avatar when inspecting; show customer initials in identity plate via name fields.
  paintAvatar(user);
  $('signed-out')!.hidden = true;
  $('signed-in')!.hidden = false;
  setTab(inspecting ? 'credits' : activeTab);
  setLoading(false);
}

async function doSignOut(): Promise<void> {
  await signOutUser();
  location.assign('/login.html?next=/account.html');
}

function bind(): void {
  document.querySelectorAll<HTMLButtonElement>('.acc-side-btn').forEach((btn) => {
    btn.addEventListener('click', () => setTab(btn.dataset.accTab || 'overview'));
  });
  $('sign-out')?.addEventListener('click', () => void doSignOut());
  $('sign-out-sec')?.addEventListener('click', () => void doSignOut());
  const refreshLedger = async () => {
    if (!current) return;
    toast('Refreshing statement…');
    await render(current);
    toast('Statement updated.', 'ok');
  };
  $('billing-refresh')?.addEventListener('click', () => void refreshLedger());
  $('ledger-refresh')?.addEventListener('click', () => void refreshLedger());
  $('copy-uid')?.addEventListener('click', async () => {
    const uid = $('acc-uid')?.textContent?.trim();
    if (!uid) return;
    try {
      await navigator.clipboard.writeText(uid);
      toast('User ID copied.', 'ok');
    } catch {
      toast('Clipboard unavailable.', 'err');
    }
  });
  $('prefs-form')?.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    if (inspectUid) {
      toast('Preferences are disabled in inspect mode.', 'err');
      return;
    }
    const prefs: AccountPrefs = {
      emailProduct: Boolean(($('pref-email-product') as HTMLInputElement)?.checked),
      emailReceipts: Boolean(($('pref-email-receipts') as HTMLInputElement)?.checked),
      compactWorkspace: Boolean(($('pref-compact') as HTMLInputElement)?.checked)
    };
    writePrefs(prefs);
    document.documentElement.dataset.accCompact = prefs.compactWorkspace ? '1' : '0';
    if (current) {
      try {
        await syncPrefsToCloud(current.uid, prefs);
      } catch {
        /* local still saved */
      }
    }
    toast('Preferences saved.', 'ok');
  });
  document.addEventListener('click', async (ev) => {
    const t = (ev.target as HTMLElement | null)?.closest<HTMLElement>('[data-revoke]');
    if (!t?.dataset.revoke || !current) return;
    try {
      await revokeSession(current.uid, t.dataset.revoke);
      sessions = await listSessions(current.uid);
      renderDevices();
      setText('acc-device-count', String(sessions.length));
      toast('Device revoked.', 'ok');
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Revoke failed', 'err');
    }
  });
}

function init(): void {
  bind();
  setLoading(true);
  if (!authReady()) {
    setLoading(false);
    setText('acc-status', 'Authentication is not configured (VITE_FIREBASE_* missing).');
    return;
  }
  watchAuth(async (user) => {
    if (!user) {
      setLoading(false);
      current = null;
      $('signed-in')!.hidden = true;
      $('signed-out')!.hidden = false;
      return;
    }
    try {
      await render(user);
    } catch (err) {
      setLoading(false);
      setText('acc-status', friendlyAuthError(err));
      $('signed-out')!.hidden = false;
    }
  });
}

document.addEventListener('DOMContentLoaded', init);
