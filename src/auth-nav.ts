/**
 * Updates the primary nav CTA to Account when signed in.
 */
import { authReady, watchAuth } from './auth/index.js';

function relabel(href: string, label: string): void {
  document.querySelectorAll('a[data-nav="login"], a.btn-primary[href="/login.html"]').forEach((a) => {
    const el = a as HTMLAnchorElement;
    el.setAttribute('href', href);
    el.textContent = label;
  });
  document.querySelectorAll('#mobileNav a[href="/login.html"], #mobileNav a.btn-primary').forEach((a) => {
    const el = a as HTMLAnchorElement;
    if (/login|Sign in|Account/i.test(el.textContent || '') || el.getAttribute('data-nav') === 'login') {
      el.setAttribute('href', href);
      el.textContent = label;
    }
  });
}

function boot(): void {
  if (!authReady()) return;
  watchAuth((user) => {
    if (user) relabel('/account.html', 'Account');
    else relabel('/login.html', 'Sign in');
  });
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
else boot();
