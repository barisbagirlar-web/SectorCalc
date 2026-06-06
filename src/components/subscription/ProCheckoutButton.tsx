"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { startCheckoutSession, type CheckoutPlan } from "@/lib/billing/create-checkout-session";
import {
  REVENUE_EVENTS,
  trackRevenueEvent,
} from "@/lib/analytics/revenue-events";
import { useProSubscription } from "@/lib/subscription/use-pro-subscription";
import {
  ANALYTICS_EVENTS,
  trackEvent,
} from "@/lib/analytics/events";

interface StripePlanCheckoutButtonProps {
  plan: CheckoutPlan;
  label?: string;
  className?: string;
  source?: string;
  toolSlug?: string;
  returnPath?: string;
  hideWhenProActive?: boolean;
}

export function StripePlanCheckoutButton({
  plan,
  label,
  className = "",
  source = "pricing",
  toolSlug,
  returnPath = "/pricing",
  hideWhenProActive = plan === "pro" || plan === "pro_annual" || plan === "team",
}: StripePlanCheckoutButtonProps) {
  const t = useTranslations("checkout");
  const locale = useLocale();
  const { isPro, loading } = useProSubscription();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (hideWhenProActive && !loading && isPro) {
    return (
      <p className={`text-sm font-semibold text-emerald ${className}`.trim()}>
        {t("proActive")}
      </p>
    );
  }

  const handleClick = async () => {
    setError(null);
    setPending(true);

    try {
      trackEvent(ANALYTICS_EVENTS.pricing_clicked, {
        plan,
        source,
      });

      trackRevenueEvent(REVENUE_EVENTS.checkout_started, {
        source,
        toolSlug,
        plan,
      });

      await startCheckoutSession({
        plan,
        toolSlug,
        locale,
        returnPath,
      });
    } catch (caught) {
      if (caught instanceof Error) {
        setError(caught.message);
      } else {
        setError(t("error"));
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
        {pending ? t("redirecting") : label}
      </button>
      {error ? <p className="mt-2 text-sm text-amber">{error}</p> : null}
    </div>
  );
}

interface ProCheckoutButtonProps {
  label?: string;
  className?: string;
  source?: string;
  toolSlug?: string;
}

export function ProCheckoutButton({
  label,
  className = "",
  source = "pricing",
  toolSlug,
}: ProCheckoutButtonProps) {
  return (
    <StripePlanCheckoutButton
      plan="pro"
      label={label}
      className={className}
      source={source}
      toolSlug={toolSlug}
      returnPath={toolSlug ? `/pricing?tool=${encodeURIComponent(toolSlug)}` : "/pricing"}
    />
  );
}
