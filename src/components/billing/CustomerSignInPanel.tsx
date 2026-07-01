"use client";
/* eslint-disable react/no-unescaped-entities */

import Link from "@/lib/ui-shared/navigation/next-link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useClientSearchParam } from "@/lib/ui-shared/navigation/use-client-search-params";
import { getAccountHref } from "@/lib/features/tools/tool-links";
import { syncSessionCookie } from "@/lib/infrastructure/auth/session-cookie";
import { getFirebaseAuth } from "@/lib/infrastructure/firebase/auth";
import {
  completeCustomerGoogleRedirect,
  getCustomerSignInErrorCode,
  signInCustomerWithGoogle,
  signInCustomerWithEmail,
  signUpCustomerWithEmail,
} from "@/lib/infrastructure/firebase/customer-auth";

const buttonClass =
 "inline-flex min-h-[48px] w-full items-center justify-center rounded-lg bg-accent-teal px-4 text-sm font-semibold text-white transition-colors hover:bg-black disabled:cursor-not-allowed disabled:opacity-50";

interface CustomerSignInPanelProps {
 nextPath: string;
 defaultMode?: "signin" | "signup";
}

export function CustomerSignInPanel({ nextPath, defaultMode = "signin" }: CustomerSignInPanelProps) {
  const router = useRouter();
  const t = useTranslations("premiumAccess");
  const [mode, setMode] = useState<"signin" | "signup">(defaultMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    completeCustomerGoogleRedirect()
      .then(async (completed) => {
        if (active && completed) {
          const auth = getFirebaseAuth();
          if (auth?.currentUser) {
            await syncSessionCookie(auth.currentUser);
          }
          router.replace(nextPath);
        }
      })
      .catch((caught) => {
        if (active) {
          setError(t(`signInErrors.${getCustomerSignInErrorCode(caught)}`));
        }
      });

    return () => {
      active = false;
    };
  }, [nextPath, router, t]);

  const handleGoogleSignIn = async () => {
    setError(null);
    setPending(true);

    try {
      const result = await signInCustomerWithGoogle();
      if (!result.redirected) {
        const auth = getFirebaseAuth();
        if (auth?.currentUser) {
          await syncSessionCookie(auth.currentUser);
        }
        router.replace(nextPath);
        return;
      }
      setPending(true);
    } catch (caught) {
      const code = getCustomerSignInErrorCode(caught);
      setError(t(`signInErrors.${code}`));
      setPending(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setPending(true);

    const normalizedEmail = email.trim().toLowerCase();

    try {
      if (mode === "signup") {
        await signUpCustomerWithEmail(normalizedEmail, password);
      } else {
        await signInCustomerWithEmail(normalizedEmail, password);
      }
      const auth = getFirebaseAuth();
      if (auth?.currentUser) {
        await syncSessionCookie(auth.currentUser);
      }
      router.replace(nextPath);
    } catch (caught) {
      const code = getCustomerSignInErrorCode(caught);
      setError(t(`signInErrors.${code}`) || "Authentication failed. Please check your credentials.");
      setPending(false);
    }
  };

  return (
    <div
      className="mt-8 rounded-sm border border-border-subtle bg-bg-subtle p-6"
      data-auth-state={pending ? "pending" : "ready"}
    >
      <h2 className="text-lg font-bold text-text-primary">{mode === "signup" ? "Create an account" : t("panelTitle")}</h2>
      <p className="mt-2 text-sm leading-relaxed text-text-secondary">
        {mode === "signup" ? "Sign up to access Pro tools and save your progress." : t("panelDescription")}
      </p>

      <form onSubmit={handleEmailAuth} className="mt-4 flex flex-col gap-3">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email address"
          required
          className="rounded-lg border border-border-subtle p-3 text-sm text-text-primary"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
          minLength={6}
          className="rounded-lg border border-border-subtle p-3 text-sm text-text-primary"
        />
        <button
          type="submit"
          disabled={pending}
          className={`${buttonClass}`}
        >
          {pending ? t("signingIn") : (mode === "signup" ? "Sign up with Email" : "Sign in with Email")}
        </button>
      </form>

      <div className="my-4 flex items-center justify-center space-x-2">
        <span className="h-px w-full bg-border-subtle"></span>
        <span className="text-xs text-text-secondary uppercase">OR</span>
        <span className="h-px w-full bg-border-subtle"></span>
      </div>

      <button
        type="button"
        data-auth-google-button="true"
        onClick={() => void handleGoogleSignIn()}
        disabled={pending}
        className={`${buttonClass} !bg-white !text-text-primary border border-border-subtle hover:!bg-bg-subtle`}
      >
        {pending ? t("signingIn") : "Continue with Google"}
      </button>
      <p
        data-auth-error="true"
        role="alert"
        aria-live="polite"
        className={error ? "mt-3 text-sm text-amber" : "sr-only"}
      >
        {error ?? ""}
      </p>

      <div className="mt-4 text-center text-sm">
        {mode === "signin" ? (
          <p className="text-text-secondary">
            Don't have an account?{" "}
            <button type="button" onClick={() => setMode("signup")} className="text-accent-teal font-semibold hover:underline">
              Sign up
            </button>
          </p>
        ) : (
          <p className="text-text-secondary">
            Already have an account?{" "}
            <button type="button" onClick={() => setMode("signin")} className="text-accent-teal font-semibold hover:underline">
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
 <p className="text-xs font-semibold uppercase tracking-wider text-deep-navy">
 Sign in required
 </p>
 <h2 className="mt-3 text-xl font-bold text-text-primary sm:text-2xl">
 Sign in to check SectorCalc Pro access
 </h2>
 <p className="mt-3 text-sm leading-relaxed text-text-secondary">
 Premium calculators require a signed-in account with an active SectorCalc Pro
 subscription.
 </p>
 <Link
 href={loginHref}
 className="mt-6 inline-flex min-h-[48px] w-full items-center justify-center rounded-lg bg-deep-navy px-5 text-sm font-semibold text-white transition-colors hover:bg-black sm:w-auto"
 >
 Sign in
 </Link>
 </aside>
 );
}
