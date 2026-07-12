"use client";
/* eslint-disable react/no-unescaped-entities */

import Link from "@/lib/ui-shared/navigation/next-link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslations } from "@/lib/i18n-stub";
import { useClientSearchParam } from "@/lib/ui-shared/navigation/use-client-search-params";
import { getAccountHref } from "@/lib/features/tools/tool-links";
import { syncSessionCookie } from "@/lib/infrastructure/auth/session-cookie";
import { getFirebaseAuth } from "@/lib/infrastructure/firebase/auth";
import {
  completeCustomerGoogleRedirect,
  getCustomerSignInErrorMessage,
  sendCustomerPasswordReset,
  signInCustomerWithGoogle,
  signInCustomerWithEmail,
  signUpCustomerWithEmail,
} from "@/lib/infrastructure/firebase/customer-auth";

const buttonClass =
  "inline-flex min-h-[48px] w-full items-center justify-center rounded-lg bg-accent-teal px-4 text-sm font-semibold transition-colors hover:bg-black disabled:cursor-not-allowed disabled:opacity-50";

type AuthMode = "signin" | "signup" | "reset";

interface CustomerSignInPanelProps {
  nextPath: string;
  defaultMode?: "signin" | "signup";
}

export function CustomerSignInPanel({ nextPath, defaultMode = "signin" }: CustomerSignInPanelProps) {
  const router = useRouter();
  const t = useTranslations("premiumAccess");
  const [mode, setMode] = useState<AuthMode>(defaultMode);
  const [email, setEmail] = useState("");
  const [resetEmail, setResetEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const ADMIN_EMAIL = "barisbagirlar@gmail.com";
  const ADMIN_REDIRECT = "/admin/case-studies";

  async function resolveRedirect(fallbackPath: string): Promise<string> {
    const auth = getFirebaseAuth();
    const user = auth?.currentUser;
    if (!user) return fallbackPath;
    if (user.email?.toLowerCase() !== ADMIN_EMAIL) return fallbackPath;

    try {
      await user.getIdToken(true);
      const tokenResult = await user.getIdTokenResult();
      if (tokenResult.claims.admin === true) return ADMIN_REDIRECT;
    } catch {
      // Use the normal account destination when admin claim refresh fails.
    }
    return fallbackPath;
  }

  useEffect(() => {
    let active = true;

    completeCustomerGoogleRedirect()
      .then(async (completed) => {
        if (active && completed) {
          const auth = getFirebaseAuth();
          if (auth?.currentUser) await syncSessionCookie(auth.currentUser);
          const target = await resolveRedirect(nextPath);
          router.replace(target);
        }
      })
      .catch((caught) => {
        if (active) setError(getCustomerSignInErrorMessage(caught));
      });

    return () => {
      active = false;
    };
  }, [nextPath, router]);

  const clearMessages = () => {
    setError(null);
    setNotice(null);
  };

  const handleGoogleSignIn = async () => {
    clearMessages();
    setPending(true);

    try {
      const result = await signInCustomerWithGoogle();
      if (!result.redirected) {
        const auth = getFirebaseAuth();
        if (auth?.currentUser) await syncSessionCookie(auth.currentUser);
        const target = await resolveRedirect(nextPath);
        router.replace(target);
        return;
      }
      setPending(true);
    } catch (caught) {
      if (process.env.NODE_ENV !== "production") console.error("[CustomerAuth][Google]", caught);
      setError(getCustomerSignInErrorMessage(caught));
      setPending(false);
    }
  };

  const handleEmailAuth = async (event: React.FormEvent) => {
    event.preventDefault();
    clearMessages();
    setPending(true);

    const normalizedEmail = email.trim().toLowerCase();

    try {
      if (mode === "signup") {
        await signUpCustomerWithEmail(normalizedEmail, password);
      } else {
        await signInCustomerWithEmail(normalizedEmail, password);
      }
      const auth = getFirebaseAuth();
      if (auth?.currentUser) await syncSessionCookie(auth.currentUser);
      const target = await resolveRedirect(nextPath);
      router.replace(target);
    } catch (caught) {
      if (process.env.NODE_ENV !== "production") console.error("[CustomerAuth][Email]", caught);
      setError(getCustomerSignInErrorMessage(caught));
      setPending(false);
    }
  };

  const openPasswordReset = () => {
    setResetEmail(email.trim().toLowerCase());
    setMode("reset");
    clearMessages();
    setPassword("");
  };

  const handlePasswordReset = async (event: React.FormEvent) => {
    event.preventDefault();
    const normalizedEmail = resetEmail.trim().toLowerCase();
    clearMessages();

    if (!normalizedEmail) {
      setError("Enter the email address whose password you want to reset.");
      return;
    }

    setPending(true);
    try {
      await sendCustomerPasswordReset(normalizedEmail);
      setNotice("If an email/password account exists for this address, a reset link has been sent. Check the inbox and spam folder.");
    } catch (caught) {
      if (process.env.NODE_ENV !== "production") console.error("[CustomerAuth][PasswordReset]", caught);
      setError(getCustomerSignInErrorMessage(caught));
    } finally {
      setPending(false);
    }
  };

  const switchMode = (nextMode: AuthMode) => {
    setMode(nextMode);
    setPassword("");
    clearMessages();
  };

  if (mode === "reset") {
    return (
      <div className="mt-8 rounded-sm border border-border-subtle bg-bg-subtle p-6" data-auth-state={pending ? "pending" : "ready"}>
        <h2 className="text-lg font-bold text-text-primary">Reset your password</h2>
        <p className="mt-2 text-sm leading-relaxed text-text-secondary">
          Enter the exact email address for the SectorCalc account whose password you want to reset.
        </p>

        <form onSubmit={handlePasswordReset} className="mt-4 flex flex-col gap-3">
          <label htmlFor="password-reset-email" className="text-sm font-semibold text-text-primary">
            Account email
          </label>
          <input
            id="password-reset-email"
            type="email"
            value={resetEmail}
            onChange={(event) => setResetEmail(event.target.value)}
            placeholder="name@company.com"
            autoComplete="email"
            required
            autoFocus
            className="rounded-lg border border-border-subtle p-3 text-sm text-text-primary"
          />
          <button type="submit" disabled={pending} className={`${buttonClass} text-white`}>
            {pending ? "Sending reset link..." : "Send password reset email"}
          </button>
        </form>

        <button
          type="button"
          onClick={() => switchMode("signin")}
          disabled={pending}
          className="mt-3 text-sm font-semibold text-accent-teal hover:underline disabled:opacity-50"
        >
          Back to sign in
        </button>

        <p data-auth-error="true" role="alert" aria-live="polite" className={error ? "mt-3 text-sm text-amber" : "sr-only"}>
          {error ?? ""}
        </p>
        <p role="status" aria-live="polite" className={notice ? "mt-3 text-sm text-accent-teal" : "sr-only"}>
          {notice ?? ""}
        </p>
      </div>
    );
  }

  return (
    <div className="mt-8 rounded-sm border border-border-subtle bg-bg-subtle p-6" data-auth-state={pending ? "pending" : "ready"}>
      <h2 className="text-lg font-bold text-text-primary">{mode === "signup" ? "Create an account" : t("panelTitle")}</h2>
      <p className="mt-2 text-sm leading-relaxed text-text-secondary">
        {mode === "signup" ? "Sign up to access Pro tools and save your progress." : t("panelDescription")}
      </p>

      <form onSubmit={handleEmailAuth} className="mt-4 flex flex-col gap-3">
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Email address"
          autoComplete="email"
          required
          className="rounded-lg border border-border-subtle p-3 text-sm text-text-primary"
        />
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Password"
          autoComplete={mode === "signup" ? "new-password" : "current-password"}
          required
          className="rounded-lg border border-border-subtle p-3 text-sm text-text-primary"
        />
        <button type="submit" disabled={pending} className={`${buttonClass} text-white`}>
          {pending ? t("signingIn") : mode === "signup" ? "Sign up with Email" : "Sign in with Email"}
        </button>
      </form>

      {mode === "signin" && (
        <button
          type="button"
          onClick={openPasswordReset}
          disabled={pending}
          className="mt-3 text-sm font-semibold text-accent-teal hover:underline disabled:opacity-50"
        >
          Forgot password?
        </button>
      )}

      <div className="my-4 flex items-center justify-center space-x-2">
        <span className="h-px w-full bg-border-subtle" />
        <span className="text-xs text-text-secondary uppercase">OR</span>
        <span className="h-px w-full bg-border-subtle" />
      </div>

      <button
        type="button"
        data-auth-google-button="true"
        onClick={() => void handleGoogleSignIn()}
        disabled={pending}
        className="relative inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-lg border border-border-subtle !bg-white px-4 text-sm font-semibold transition-colors hover:!bg-bg-subtle disabled:cursor-not-allowed disabled:opacity-50"
        style={{ color: "#000000" }}
      >
        {!pending && (
          <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            <path d="M1 1h22v22H1z" fill="none" />
          </svg>
        )}
        <span style={{ color: "#000000" }}>{pending ? t("signingIn") : t("signInButton")}</span>
      </button>

      <p data-auth-error="true" role="alert" aria-live="polite" className={error ? "mt-3 text-sm text-amber" : "sr-only"}>
        {error ?? ""}
      </p>
      <p role="status" aria-live="polite" className={notice ? "mt-3 text-sm text-accent-teal" : "sr-only"}>
        {notice ?? ""}
      </p>

      <div className="mt-4 text-center text-sm">
        {mode === "signin" ? (
          <p className="text-text-secondary">
            Don't have an account?{" "}
            <button type="button" onClick={() => switchMode("signup")} className="font-semibold text-accent-teal hover:underline">
              Sign up
            </button>
          </p>
        ) : (
          <p className="text-text-secondary">
            Already have an account?{" "}
            <button type="button" onClick={() => switchMode("signin")} className="font-semibold text-accent-teal hover:underline">
              Sign in
            </button>
          </p>
        )}
      </div>
    </div>
  );
}

export function CustomerSignInFromNextParam({ defaultMode }: { defaultMode?: "signin" | "signup" }) {
  const next = useClientSearchParam("next");
  const nextPath = next && next.startsWith("/") ? next : getAccountHref();
  return <CustomerSignInPanel nextPath={nextPath} defaultMode={defaultMode} />;
}

interface PremiumLoginPromptProps {
  paidSlug: string;
}

export function PremiumLoginPrompt({ paidSlug }: PremiumLoginPromptProps) {
  const loginHref = `/login?next=${encodeURIComponent(`/tools/premium/${paidSlug}`)}`;

  return (
    <aside className="mx-auto max-w-2xl rounded-sm border border-border-subtle bg-white p-6 shadow-card sm:p-8">
      <p className="text-xs font-semibold uppercase tracking-wider text-deep-navy">Sign in required</p>
      <h2 className="mt-3 text-xl font-bold text-text-primary sm:text-2xl">Sign in to check SectorCalc Pro access</h2>
      <p className="mt-3 text-sm leading-relaxed text-text-secondary">
        Premium calculators require a signed-in account with an active SectorCalc Pro subscription.
      </p>
      <Link href={loginHref} className="mt-6 inline-flex min-h-[48px] w-full items-center justify-center rounded-lg bg-deep-navy px-5 text-sm font-semibold text-white transition-colors hover:bg-black sm:w-auto">
        Sign in
      </Link>
    </aside>
  );
}
