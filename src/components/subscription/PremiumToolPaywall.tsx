"use client";

import { ProCheckoutButton } from "@/components/subscription/ProCheckoutButton";
import { useProSubscription } from "@/lib/subscription/use-pro-subscription";
import {
 getRevenueToolByPremiumSlug,
 SECTORCALC_PRO_PRICE_LABEL,
} from "@/lib/tools/revenue-tools";

interface PremiumToolPaywallProps {
 toolTitle: string;
 toolSlug?: string;
}

export function PremiumToolPaywall({
 toolTitle,
 toolSlug,
}: PremiumToolPaywallProps) {
 const { isPro, loading } = useProSubscription();

 if (loading || isPro) {
 return null;
 }

 const revenue = toolSlug ? getRevenueToolByPremiumSlug(toolSlug) : undefined;
 const ctaHint = revenue?.premiumCtaLabel ?? "Unlock paid analyzer";

 return (
 <div className="rounded-sm border border-amber/30 bg-premium-surface p-6 md:p-8">
 <p className="text-xs font-semibold uppercase tracking-wider text-amber">
 SectorCalc Pro required
 </p>
 <h2 className="mt-3 text-xl font-bold text-premium-velvet sm:text-2xl">
 {ctaHint}
 </h2>
 <p className="mt-3 text-sm leading-relaxed text-body-charcoal sm:text-base">
 Free calculators show quick checks. {toolTitle} delivers safe price floors,
 margin leak detection and accept/reject verdicts — {SECTORCALC_PRO_PRICE_LABEL}.
 </p>
 <div className="mt-6">
 <ProCheckoutButton
 label="Unlock SectorCalc Pro"
 source="premium_tool_paywall"
 toolSlug={toolSlug ?? revenue?.paidSlug}
 className="max-w-md"
 />
 </div>
 </div>
 );
}
