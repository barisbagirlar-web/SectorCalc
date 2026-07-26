import {
  authReady,
  watchAuth,
  signInEmail,
  signUpEmail,
  signInGoogle,
  friendlyAuthError
} from './auth/index.js';

type Mode = 'signin' | 'signup';

function $(id: string): HTMLElement | null {
  return document.getElementById(id);
}

function setMsg(text: string, kind: 'ok' | 'err' | '' = ''): void {
  const el = $('auth-msg');
  if (!el) return;
  el.textContent = text;
  el.dataset.kind = kind;
  el.hidden = !text;
}

function params(): URLSearchParams {
  return new URLSearchParams(location.search);
}

function mode(): Mode {
  return params().get('mode') === 'signup' ? 'signup' : 'signin';
}

function nextPath(): string {
  const next = params().get('next') || '/account.html';
  return next.startsWith('/') && !next.startsWith('//') ? next : '/account.html';
}

/** Keep mode + next in the address bar (do not strip return URL). */
function syncUrl(m: Mode): void {
  const q = new URLSearchParams();
  if (m === 'signup') q.set('mode', 'signup');
  const next = params().get('next');
  if (next && next.startsWith('/') && !next.startsWith('//')) q.set('next', next);
  const qs = q.toString();
  history.replaceState({}, '', qs ? `/login.html?${qs}` : '/login.html');
}

function applyMode(m: Mode): void {
  const title = $('auth-title');
  const sub = $('auth-sub');
  const submit = $('auth-submit') as HTMLButtonElement | null;
  const toggle = $('auth-toggle');
  const nameWrap = $('name-wrap');
  const next = encodeURIComponent(nextPath());
  if (title) title.textContent = m === 'signup' ? 'Create account' : 'Sign in';
  if (sub)
    sub.textContent =
      m === 'signup'
        ? 'Save credits and purchase history across devices.'
        : 'Access your SectorCalc account and credit balance.';
  if (submit) submit.textContent = m === 'signup' ? 'Create account' : 'Sign in';
  if (nameWrap) nameWrap.hidden = m !== 'signup';
  if (toggle) {
    toggle.innerHTML =
      m === 'signup'
        ? `Already have an account? <a href="/login.html?next=${next}">Sign in</a>`
        : `New here? <a href="/login.html?mode=signup&next=${next}">Create account</a>`;
  }
  syncUrl(m);
}

function redirectAfterAuth(): void {
  location.assign(nextPath());
}

function setBusy(on: boolean): void {
  const submit = $('auth-submit') as HTMLButtonElement | null;
  const google = $('google-btn') as HTMLButtonElement | null;
  if (submit) submit.disabled = on;
  if (google) google.disabled = on;
}

function init(): void {
  applyMode(mode());

  if (!authReady()) {
    setMsg(
      'Authentication is not configured yet. Set VITE_FIREBASE_* in .env.local and enable Email/Password + Google in Firebase Console.',
      'err'
    );
    return;
  }

  watchAuth((user) => {
    if (!user) return;
    setMsg('Already signed in — opening your account…', 'ok');
    redirectAfterAuth();
  });

  $('auth-form')?.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    const email = (($('email') as HTMLInputElement).value || '').trim();
    const password = ($('password') as HTMLInputElement).value;
    const displayName = ($('displayName') as HTMLInputElement | null)?.value;
    const m = mode();

    if (!email || !email.includes('@')) {
      setMsg('Enter a valid email address.', 'err');
      return;
    }
    if (!password || password.length < 6) {
      setMsg('Password must be at least 6 characters.', 'err');
      return;
    }

    setBusy(true);
    setMsg(m === 'signup' ? 'Creating account…' : 'Signing in…');
    try {
      if (m === 'signup') await signUpEmail(email, password, displayName);
      else await signInEmail(email, password);
      setMsg('Success. Redirecting…', 'ok');
      redirectAfterAuth();
    } catch (err) {
      setMsg(friendlyAuthError(err), 'err');
    } finally {
      setBusy(false);
    }
  });

  $('google-btn')?.addEventListener('click', async () => {
    setBusy(true);
    setMsg('Opening Google…');
    try {
      await signInGoogle();
      setMsg('Success. Redirecting…', 'ok');
      redirectAfterAuth();
    } catch (err) {
      setMsg(friendlyAuthError(err), 'err');
    } finally {
      setBusy(false);
    }
  });
}

document.addEventListener('DOMContentLoaded', init);
