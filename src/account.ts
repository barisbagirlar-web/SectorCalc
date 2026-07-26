/**
 * SectorCalc account workspace — global-grade engineer control surface.
 */
import {
  authReady,
  watchAuth,
  signOutUser,
  readUserProfile,
  friendlyAuthError
} from './auth/index.js';
import { readCredits } from './payments/paddle/credits.js';
import type { User } from 'firebase/auth';

const TAB_META: Record<string, { title: string; sub: string }> = {
  overview: {
    title: 'Overview',
    sub: 'Balance, identity, and shortcuts for your SectorCalc workspace.'
  },
  credits: {
    title: 'Credits',
    sub: 'Pay-per-use balance, validity, and how cloud sync works on this device.'
  },
  workspace: {
    title: 'Workspace',
    sub: 'Jump into live calculators and the credit store.'
  },
  security: {
    title: 'Security',
    sub: 'Identity plate, providers, and session controls.'
  },
  support: {
    title: 'Support',
    sub: 'What to include when you need help with credits or engines.'
  }
};

let activeTab = 'overview';

function $(id: string): HTMLElement | null {
  return document.getElementById(id);
}

function setText(id: string, text: string): void {
  const el = $(id);
  if (el) el.textContent = text;
}

function providerLabel(raw: string): string {
  if (raw === 'password') return 'Email / password';
  if (raw === 'google.com') return 'Google';
  return raw || 'Email / password';
}

function formatSince(user: User): string {
  const ms = user.metadata?.creationTime ? Date.parse(user.metadata.creationTime) : NaN;
  if (!Number.isFinite(ms)) return '—';
  return new Date(ms).toISOString().slice(0, 10);
}

function formatLastSignIn(user: User): string {
  const ms = user.metadata?.lastSignInTime ? Date.parse(user.metadata.lastSignInTime) : NaN;
  if (!Number.isFinite(ms)) return '—';
  return new Date(ms).toISOString().replace('T', ' ').slice(0, 19) + 'Z';
}

function initialsFor(user: User): string {
  const base = (user.displayName || user.email || 'SC').trim();
  const parts = base.split(/[\s@._-]+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0]![0]! + parts[1]![0]!).toUpperCase();
  return base.slice(0, 2).toUpperCase();
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

async function render(user: User): Promise<void> {
  const guest = readCredits().balance;
  let cloud = guest;
  try {
    const profile = await readUserProfile(user.uid);
    if (profile) cloud = profile.credits;
  } catch {
    /* keep local */
  }
  const display = Math.max(cloud, guest);
  const providers = user.providerData.map((p) => providerLabel(p.providerId));
  const providerText = providers.length ? providers.join(' · ') : 'Email / password';
  const name = user.displayName || 'SectorCalc engineer';
  const email = user.email || 'No email on file';

  setText('acc-name', name);
  setText('acc-name-side', name);
  setText('acc-email', email);
  setText('acc-email-side', email);
  setText('acc-email-spec', user.email || '—');
  setText('acc-uid', user.uid);
  setText('acc-credits', String(display));
  setText('acc-credits-hero', String(display));
  setText('acc-credits-detail', String(display));
  setText('acc-local-credits', String(guest));
  setText('acc-local-detail', String(guest));
  setText('acc-cloud-detail', String(cloud));
  setText('acc-display-detail', String(display));
  setText('acc-provider', providerText);
  setText('acc-provider-spec', providerText);
  setText('acc-since', formatSince(user));
  setText('acc-last-signin', formatLastSignIn(user));
  setText(
    'acc-session',
    user.emailVerified ? 'Verified session' : 'Session active · email not verified'
  );
  setText(
    'acc-verified',
    user.emailVerified ? 'Email verified' : 'Email not verified yet'
  );
  setText(
    'acc-verified-spec',
    user.emailVerified ? 'Yes' : 'No — complete provider verification if prompted'
  );
  setText(
    'acc-next-copy',
    display < 1
      ? 'You have no credits available. Load a pack to unlock paid report runs, or keep exploring free tool previews.'
      : 'You have credits ready. Open a calculator and generate an auditable report when you need a formal deliverable.'
  );

  paintAvatar(user);
  const out = $('signed-out');
  const inn = $('signed-in');
  if (out) out.hidden = true;
  if (inn) inn.hidden = false;
  setText('acc-status', '');
  setTab(activeTab);
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
  $('copy-uid')?.addEventListener('click', async () => {
    const uid = $('acc-uid')?.textContent?.trim();
    if (!uid || uid === '—') return;
    try {
      await navigator.clipboard.writeText(uid);
      const btn = $('copy-uid');
      if (btn) {
        const prev = btn.textContent;
        btn.textContent = 'Copied';
        window.setTimeout(() => {
          btn.textContent = prev || 'Copy';
        }, 1200);
      }
    } catch {
      /* ignore */
    }
  });
}

function init(): void {
  bind();
  if (!authReady()) {
    setText('acc-status', 'Authentication is not configured (VITE_FIREBASE_* missing).');
    return;
  }
  watchAuth(async (user) => {
    if (!user) {
      $('signed-in')!.hidden = true;
      $('signed-out')!.hidden = false;
      return;
    }
    try {
      await render(user);
    } catch (err) {
      setText('acc-status', friendlyAuthError(err));
      $('signed-out')!.hidden = false;
    }
  });
}

document.addEventListener('DOMContentLoaded', init);
