"use client";

import { useState } from "react";
import { signInCustomerWithGoogle, mapCustomerSignInError } from "@/lib/firebase/customer-auth";
import { createProCheckoutSession } from "@/lib/subscription/checkout";
import { useProSubscription } from "@/lib/subscription/use-pro-subscription";
import {
  ANALYTICS_EVENTS,
  trackEvent,
} from "@/lib/analytics/events";

interface ProCheckoutButtonProps {
  label?: string;
  className?: string;
  source?: string;
}

export function ProCheckoutButton({
  label = "Unlock Decision Tools — $29/mo",
  className = "",
  source = "pricing",
}: ProCheckoutButtonProps) {
  const { user, isPro, loading } = useProSubscription();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!loading && isPro) {
    return (
      <p className={`text-sm font-semibold text-emerald ${className}`.trim()}>
        SectorCalc Pro is active on your account.
      </p>
    );
  }

  const handleClick = async () => {
    setError(null);
    setPending(true);

    try {
      trackEvent(ANALYTICS_EVENTS.pricing_clicked, {
        plan: "pro",
        source,
      });

      if (!user) {
        try {
          await signInCustomerWithGoogle();
        } catch (signInError) {
          throw new Error(mapCustomerSignInError(signInError));
        }
      }

      const session = await createProCheckoutSession();
      window.location.assign(session.url);
    } catch (caught) {
      if (caught instanceof Error) {
        setError(caught.message);
      } else {
        setError("Unable to start checkout.");
      }
      setPending(false);
    }
  };

  return (
    <div className={className}>
      <button
        type="button"
        onClick={() => void handleClick()}
        disabled={pending || loading}
        className="inline-flex min-h-[48px] w-full items-center justify-center rounded-lg bg-cyan px-6 text-sm font-semibold text-deep-navy transition-colors hover:bg-cyan/90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Redirecting to checkout…" : label}
      </button>
      {error ? <p className="mt-2 text-sm text-amber">{error}</p> : null}
    </div>
  );
}
