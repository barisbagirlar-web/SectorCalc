"use client";

import Link from "@/lib/navigation/next-link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useClientSearchParam } from "@/lib/navigation/use-client-search-params";
import { getAccountHref } from "@/lib/tools/tool-links";
import {
  completeCustomerGoogleRedirect,
  getCustomerSignInErrorCode,
  signInCustomerWithGoogle,
} from "@/lib/firebase/customer-auth";

const buttonClass =
 "inline-flex min-h-[48px] w-full items-center justify-center rounded-lg bg-accent-teal px-4 text-sm font-semibold text-white transition-colors hover:bg-black disabled:cursor-not-allowed disabled:opacity-50";

interface CustomerSignInPanelProps {
 nextPath: string;
}

export function CustomerSignInPanel({ nextPath }: CustomerSignInPanelProps) {
  const router = useRouter();
  const t = useTranslations("premiumAccess");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    completeCustomerGoogleRedirect()
      .then((completed) => {
        if (active && completed) {
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

  return (
    <div
      className="mt-8 rounded-sm border border-border-subtle bg-bg-subtle p-6"
      data-auth-state={pending ? "pending" : "ready"}
    >
      <h2 className="text-lg font-bold text-text-primary">{t("panelTitle")}</h2>
      <p className="mt-2 text-sm leading-relaxed text-text-secondary">
        {t("panelDescription")}
      </p>
      <button
        type="button"
        data-auth-google-button="true"
        onClick={() => void handleGoogleSignIn()}
        disabled={pending}
        className={`${buttonClass} mt-4`}
      >
        {pending ? t("signingIn") : t("signInButton")}
      </button>
      <p
        data-auth-error="true"
        role="alert"
        aria-live="polite"
        className={error ? "mt-3 text-sm text-amber" : "sr-only"}
      >
        {error ?? ""}
      </p>
    </div>
  );
}

export function CustomerSignInFromNextParam() {
  const next = useClientSearchParam("next");
  const nextPath = next && next.startsWith("/") ? next : getAccountHref();

  return <CustomerSignInPanel nextPath={nextPath} />;
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
