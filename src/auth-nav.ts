/**
 * Global header session indicator.
 * Signed-in users must see an active session chip — never a "Sign in" CTA.
 * Calculator pages also boot the universal credit gate.
 */
import type { User } from 'firebase/auth';
import { authReady, watchAuth } from './auth/index.js';
import { installDemoReportBridge } from './billing/demo-report-bridge.js';
import { bootToolCreditGate } from './billing/boot-tool-gate.js';

function initials(user: User): string {
  const base = (user.displayName || user.email || 'SC').trim();
  const parts = base.split(/[\s@._-]+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0]![0]! + parts[1]![0]!).toUpperCase();
  return base.slice(0, 2).toUpperCase();
}

function whoLabel(user: User): string {
  const name = user.displayName?.trim();
  if (name) return name.split(/\s+/)[0]!;
  const local = (user.email || '').split('@')[0] || 'Account';
  return local.length > 16 ? `${local.slice(0, 14)}…` : local;
}

function esc(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function loginAnchors(): HTMLAnchorElement[] {
  return Array.from(
    document.querySelectorAll<HTMLAnchorElement>(
      'a[data-nav="login"], .site-header a.btn-primary[href="/login"], #mobileNav a.btn-primary[href="/login"], .site-header a.sc-nav-session, #mobileNav a.sc-nav-session'
    )
  );
}

function paintSignedOut(): void {
  for (const a of loginAnchors()) {
    const inMobile = Boolean(a.closest('#mobileNav'));
    a.href = '/login';
    a.setAttribute('data-nav', 'login');
    a.removeAttribute('data-auth-state');
    a.setAttribute('aria-label', 'Sign in to SectorCalc');
    a.className = inMobile ? 'btn-primary' : 'btn btn-primary';
    a.textContent = 'Sign in';
  }
}

function paintSignedIn(user: User): void {
  const who = whoLabel(user);
  const ini = initials(user);
  for (const a of loginAnchors()) {
    const inMobile = Boolean(a.closest('#mobileNav'));
    a.href = '/account.html';
    a.setAttribute('data-nav', 'login');
    a.setAttribute('data-auth-state', 'in');
    a.setAttribute('aria-label', `Signed in as ${who}. Open your account`);
    a.className = inMobile ? 'sc-nav-session sc-nav-session-mobile' : 'sc-nav-session';
    a.innerHTML = `<span class="sc-nav-session-avatar" aria-hidden="true">${esc(ini)}</span><span class="sc-nav-session-meta"><span class="sc-nav-session-state">Signed in</span><span class="sc-nav-session-who">${esc(who)}</span></span>`;
  }

  // Keep the text "Account" nav item as workspace entry; mark active when signed in.
  document.querySelectorAll<HTMLAnchorElement>('a[data-nav="account"]').forEach((el) => {
    el.setAttribute('data-auth-state', 'in');
    if (!el.getAttribute('title')) el.setAttribute('title', 'Your account is active');
  });
}

function boot(): void {
  bootToolCreditGate();
  installDemoReportBridge();
  if (!authReady()) return;
  watchAuth((user) => {
    if (user) paintSignedIn(user);
    else paintSignedOut();
  });
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
else boot();