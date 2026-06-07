"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname } from "@/i18n/routing";
import { startCheckoutSession, type CheckoutPlan } from "@/lib/billing/create-checkout-session";
import {
  mapCheckoutPlanToBillingPlanId,
} from "@/lib/billing/billing-config";
import { CheckoutStartError, startCheckoutRedirect } from "@/lib/billing/start-checkout";
import {
 REVENUE_EVENTS,
 trackRevenueEvent,
} from "@/lib/analytics/revenue-events";
import { useProSubscription } from "@/lib/subscription/use-pro-subscription";
import {
 ANALYTICS_EVENTS,
 trackEvent,
} from "@/lib/analytics/events";
import { trackConversionEvent } from "@/lib/analytics/conversion-funnel";
import { useAttributionContext } from "@/lib/analytics/use-attribution-context";
import { stripLocalePrefix } from "@/i18n/locales";

interface StripePlanCheckoutButtonProps {
 plan: CheckoutPlan;
 label?: string;
 className?: string;
 source?: string;
 toolSlug?: string;
 returnPath?: string;
 hideWhenProActive?: boolean;
 ctaId?: string;
}

export function StripePlanCheckoutButton({
 plan,
 label,
 className = "",
 source = "pricing",
 toolSlug,
 returnPath = "/pricing",
 hideWhenProActive = plan === "pro" || plan === "pro_annual" || plan === "team",
 ctaId = "pricing_pro_start",
}: StripePlanCheckoutButtonProps) {
 const t = useTranslations("checkout");
 const locale = useLocale();
 const pathname = usePathname();
 const attribution = useAttributionContext();
 const pagePath = stripLocalePrefix(pathname);
 const { isPro, loading } = useProSubscription();
 const [pending, setPending] = useState(false);
 const [error, setError] = useState<string | null>(null);

 if (hideWhenProActive && !loading && isPro) {
 return (
 <p className={`text-sm font-semibold text-deep-navy ${className}`.trim()}>
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

 trackConversionEvent({
 eventName: "pricing_cta_click",
 stage: "pricing_intent",
 locale,
 pagePath,
 toolSlug,
 campaignId: attribution.utmCampaign,
 source: attribution.utmSource ?? source,
 medium: attribution.utmMedium ?? "checkout",
 ctaId,
 valueType: "premium",
 });

 trackRevenueEvent(REVENUE_EVENTS.checkout_started, {
 source,
 toolSlug,
 plan,
 });

 const billingPlanId = mapCheckoutPlanToBillingPlanId(plan);
 if (billingPlanId) {
 await startCheckoutRedirect({
 planId: billingPlanId,
 premiumSlug: toolSlug,
 locale,
 returnPath,
 });
 return;
 }

 await startCheckoutSession({
 plan,
 toolSlug,
 locale,
 returnPath,
 });
 } catch (caught) {
 if (caught instanceof CheckoutStartError) {
 setError(caught.message);
 } else if (caught instanceof Error) {
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
 className="inline-flex min-h-[48px] w-full items-center justify-center rounded-lg bg-accent-teal px-6 text-sm font-semibold text-text-primary transition-colors hover:bg-accent-teal/90 disabled:cursor-not-allowed disabled:opacity-60"
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
 ctaId?: string;
}

export function ProCheckoutButton({
 label,
 className = "",
 source = "pricing",
 toolSlug,
 ctaId = "pricing_pro_start",
}: ProCheckoutButtonProps) {
 return (
 <StripePlanCheckoutButton
 plan="pro"
 label={label}
 className={className}
 source={source}
 toolSlug={toolSlug}
 ctaId={ctaId}
 returnPath={toolSlug ? `/pricing?tool=${encodeURIComponent(toolSlug)}` : "/pricing"}
 />
 );
}
