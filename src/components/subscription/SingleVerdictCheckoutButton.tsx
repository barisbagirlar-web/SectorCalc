"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { CheckoutLoadingOverlay } from "@/components/billing/CheckoutLoadingOverlay";
import { TrustBadgeStrip } from "@/components/billing/TrustBadgeStrip";
import { startCheckoutRedirect } from "@/lib/features/billing/start-checkout";
import {
 REVENUE_EVENTS,
 trackRevenueEvent,
} from "@/lib/infrastructure/analytics/revenue-events";
import {
 ANALYTICS_EVENTS,
 trackEvent,
} from "@/lib/infrastructure/analytics/events";
import { SINGLE_VERDICT_CTA } from "@/lib/pricing/plan-catalog";

interface SingleVerdictCheckoutButtonProps {
 toolSlug?: string;
 returnPath?: string;
 className?: string;
 buttonClassName?: string;
 label?: string;
 source?: string;
 showTrust?: boolean;
}

const DEFAULT_BUTTON_CLASS =
 "inline-flex min-h-[48px] w-full items-center justify-center rounded-lg bg-amber px-6 text-sm font-semibold text-text-primary transition-colors hover:bg-amber/90 disabled:cursor-not-allowed disabled:opacity-60";

export function SingleVerdictCheckoutButton({
 toolSlug,
 returnPath = "/pricing",
 className = "",
 buttonClassName,
 label = SINGLE_VERDICT_CTA,
 source = "single_verdict_upsell",
 showTrust = true,
}: SingleVerdictCheckoutButtonProps) {
 const t = useTranslations("checkout");
 const locale = useLocale();
 const [pending, setPending] = useState(false);
 const [error, setError] = useState<string | null>(null);

 const handleClick = async () => {
 setError(null);
 setPending(true);

 try {
 trackEvent(ANALYTICS_EVENTS.pricing_clicked, {
 plan: "single_verdict",
 source,
 });

 trackRevenueEvent(REVENUE_EVENTS.checkout_started, {
 source,
 toolSlug,
 plan: "single_report",
 });

 await startCheckoutRedirect({
 planId: "single_report",
 premiumSlug: toolSlug,
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
 {pending ? <CheckoutLoadingOverlay /> : null}
 <button
 type="button"
 onClick={() => void handleClick()}
 disabled={pending}
 className={buttonClassName ?? DEFAULT_BUTTON_CLASS}
 >
 {pending ? t("redirecting") : label}
 </button>
 {error ? <p className="mt-2 text-center text-sm text-amber">{error}</p> : null}
 {showTrust ? (
 <>
 <TrustBadgeStrip />
 <p className="mt-2 text-center text-xs text-text-secondary">{t("socialProof")}</p>
 </>
 ) : null}
 </div>
 );
}

/** @deprecated Use toolSlug — toolTitle kept for call-site compatibility only */
export function SingleVerdictUpsellButton({
 toolSlug,
 pagePath,
 className,
 source,
 showTrust,
}: {
 toolSlug?: string;
 toolTitle?: string;
 pagePath: string;
 className?: string;
 source?: string;
 showTrust?: boolean;
}) {
 return (
 <SingleVerdictCheckoutButton
 toolSlug={toolSlug}
 returnPath={pagePath}
 buttonClassName={className}
 source={source}
 showTrust={showTrust}
 />
 );
}
