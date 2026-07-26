/**
 * SectorCalc account workspace — engineer identity + credit balance.
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

function $(id: string): HTMLElement | null {
  return document.getElementById(id);
}

function setText(id: string, text: string): void {
  const el = $(id);
  if (el) el.textContent = text;
}

function providerLabel(raw: string): string {
  if (raw === 'password') return 'email/password';
  if (raw === 'google.com') return 'Google';
  return raw || 'password';
}

function formatSince(user: User): string {
  const ms = user.metadata?.creationTime ? Date.parse(user.metadata.creationTime) : NaN;
  if (!Number.isFinite(ms)) return '—';
  return new Date(ms).toISOString().slice(0, 10);
}

function initialsFor(user: User): string {
  const base = (user.displayName || user.email || 'SC').trim();
  const parts = base.split(/[\s@._-]+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0]![0]! + parts[1]![0]!).toUpperCase();
  return base.slice(0, 2).toUpperCase();
}

async function render(user: User): Promise<void> {
  const guest = readCredits().balance;
  let cloud = guest;
  try {
    const profile = await readUserProfile(user.uid);
    if (profile) cloud = Math.max(profile.credits, guest);
  } catch {
    /* keep local */
  }

  const providers = user.providerData.map((p) => providerLabel(p.providerId));
  const providerText = providers.length ? providers.join(' · ') : 'email/password';

  setText('acc-name', user.displayName || 'SectorCalc engineer');
  setText('acc-email', user.email || 'No email on file');
  setText('acc-email-spec', user.email || '—');
  setText('acc-uid', user.uid);
  setText('acc-credits', String(cloud));
  setText('acc-provider', providerText);
  setText('acc-provider-spec', providerText);
  setText('acc-since', formatSince(user));
  setText(
    'acc-session',
    user.emailVerified ? 'Verified session' : 'Session active · email not verified'
  );
  setText(
    'acc-verified',
    user.emailVerified ? 'Email verified' : 'Verify email when prompted by your provider'
  );
  setText('acc-initials', initialsFor(user));

  const photo = $('acc-photo') as HTMLImageElement | null;
  const initials = $('acc-initials');
  if (photo) {
    if (user.photoURL) {
      photo.src = user.photoURL;
      photo.hidden = false;
      if (initials) initials.hidden = true;
    } else {
      photo.hidden = true;
      if (initials) initials.hidden = false;
    }
  }

  const out = $('signed-out');
  const inn = $('signed-in');
  if (out) out.hidden = true;
  if (inn) inn.hidden = false;
  setText('acc-status', '');
}

function init(): void {
  if (!authReady()) {
    setText(
      'acc-status',
      'Authentication is not configured (VITE_FIREBASE_* missing).'
    );
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

  $('sign-out')?.addEventListener('click', async () => {
    await signOutUser();
    location.assign('/login.html');
  });

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

document.addEventListener('DOMContentLoaded', init);
