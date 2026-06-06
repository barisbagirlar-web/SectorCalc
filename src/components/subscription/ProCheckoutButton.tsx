"use client";

import { useState } from "react";
import { startCheckoutSession } from "@/lib/billing/create-checkout-session";
import { useProSubscription } from "@/lib/subscription/use-pro-subscription";
import {
  ANALYTICS_EVENTS,
  trackEvent,
} from "@/lib/analytics/events";

interface ProCheckoutButtonProps {
  label?: string;
  className?: string;
  source?: string;
  toolSlug?: string;
}

export function ProCheckoutButton({
  label = "Start SectorCalc Pro",
  className = "",
  source = "pricing",
  toolSlug,
}: ProCheckoutButtonProps) {
  const { isPro, loading } = useProSubscription();
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

      await startCheckoutSession({ toolSlug, returnPath: "/pricing" });
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
