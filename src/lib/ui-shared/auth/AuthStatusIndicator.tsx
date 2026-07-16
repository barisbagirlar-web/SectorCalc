"use client";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { signOut } from "firebase/auth";
import { useUserSubscription, warmUserSubscriptionStore } from "@/lib/features/billing/use-user-subscription";
import { getAccountHref, getLoginHref } from "@/lib/features/tools/tool-links";
import { getFirebaseAuth, SUPER_ADMIN_EMAIL } from "@/lib/infrastructure/firebase/auth";
import { clearSessionCookie } from "@/lib/infrastructure/auth/session-cookie";

function LockIcon() {
  return (
    <svg className="auth-status__icon auth-status__icon--locked" width="12" height="14" viewBox="0 0 12 14" fill="none" aria-hidden="true">
      <rect x="1.5" y="6" width="9" height="7.5" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
      <path d="M3 6V4a3 3 0 1 1 6 0v2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  );
}
function UnlockIcon() {
  return (
    <svg className="auth-status__icon auth-status__icon--unlocked" width="12" height="14" viewBox="0 0 12 14" fill="none" aria-hidden="true">
      <rect x="1.5" y="6" width="9" height="7.5" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
      <path d="M3 6V4a3 3 0 0 1 5.5-1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  );
}
function LoadingIcon() {
  return (
    <svg className="auth-status__icon auth-status__icon--loading" width="12" height="14" viewBox="0 0 12 14" fill="none" aria-hidden="true">
      <rect x="1.5" y="6" width="9" height="7.5" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
      <path d="M3 6V4a3 3 0 0 1 5.5-1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeDasharray="2 2"/>
    </svg>
  );
}

export function AuthStatusIndicator() {
  const router = useRouter();
  const { user, loading } = useUserSubscription();
  const accountHref = getAccountHref();
  const loginHref = getLoginHref(accountHref);

  const handleSignOut = useCallback(async () => {
    await clearSessionCookie();
    const auth = getFirebaseAuth();
    if (auth) {
      await signOut(auth);
    }
    router.push("/");
  }, [router]);

  if (loading) {
    return (
      <div className="auth-status" role="status" aria-live="polite" aria-atomic="true" aria-label="Authentication status: checking">
        <LoadingIcon/>
        <span className="status-dot status-dot--loading" aria-hidden="true"/>
        <span className="auth-status__label auth-status__label--loading">Checking&hellip;</span>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="auth-status" role="status" aria-live="polite" aria-atomic="true" aria-label="Authentication status: not signed in">
        <UnlockIcon/>
        <span className="status-dot status-dot--offline" aria-hidden="true"/>
        <span className="auth-status__text">
          <span className="auth-status__label">Not signed in</span>
          <a href={loginHref} className="auth-status__link" onClick={() => warmUserSubscriptionStore()}>Sign In</a>
        </span>
      </div>
    );
  }

  const displayName = user.email?.split("@")[0] ?? "Operator";
  const isSuperAdmin = user.email?.toLowerCase() === SUPER_ADMIN_EMAIL;
  return (
    <div className="auth-status auth-status--active" role="status" aria-live="polite" aria-atomic="true" aria-label={`Authentication status: signed in as ${displayName}`}>
      <LockIcon/>
      <span className="status-dot status-dot--online" aria-hidden="true"/>
      <span className="auth-status__text">
        <span className="auth-status__label">Signed in as</span>
        <a href={accountHref} className="auth-status__link auth-status__link--user" title={user.email ?? undefined}>{displayName}</a>
      </span>
      {isSuperAdmin && (
        <a
          href="/admin"
          className="auth-status__admin-link"
          title="Admin Panel"
        >
          Admin
        </a>
      )}
      <button
        type="button"
        className="auth-status__signout"
        onClick={handleSignOut}
        aria-label="Sign out"
      >
        Sign Out
      </button>
    </div>
  );
}
