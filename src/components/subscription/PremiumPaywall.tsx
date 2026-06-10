"use client";

import type { ReactNode } from "react";
import Link from "@/lib/navigation/next-link";
import { IntelligenceSubscriptionGate } from "@/components/os/IntelligenceSubscriptionGate";
import { isProBypassEmail } from "@/lib/billing/subscription";
import { useProSubscription } from "@/lib/subscription/use-pro-subscription";
import { getFreeToolHref } from "@/lib/tools/tool-links";
import type { RevenueTool } from "@/lib/tools/revenue-tools";

interface PremiumPaywallProps {
  tool?: RevenueTool;
  toolSlug?: string;
  pricingHref?: string;
  variant?: "default" | "modal";
  children?: ReactNode;
}

export function PremiumPaywall({
  tool,
  toolSlug,
  children = null,
}: PremiumPaywallProps) {
  const { user, isPro, loading } = useProSubscription();

  if (loading) {
    return <p className="font-mono text-xs text-body-charcoal">…</p>;
  }

  if (isPro) {
    return <>{children}</>;
  }

  const resolvedToolSlug = tool?.paidSlug ?? toolSlug ?? "cnc-quote-risk-analyzer";

  if (isProBypassEmail(user?.email)) {
    return (
      <div className="ind-os-panel font-mono text-xs text-body-charcoal">
        DEV BYPASS ·{" "}
        <Link href={`/tools/premium/${resolvedToolSlug}`} className="text-premium-velvet underline">
          RUN
        </Link>
      </div>
    );
  }

  const freeHref = tool ? getFreeToolHref(tool) : "/free-tools";

  return (
    <div className="space-y-2 font-mono">
      <IntelligenceSubscriptionGate toolSlug={resolvedToolSlug} />
      <Link
        href={freeHref}
        className="inline-block text-[10px] font-semibold uppercase tracking-widest text-body-charcoal hover:text-premium-velvet"
      >
        ← Utility module
      </Link>
    </div>
  );
}

export default PremiumPaywall;
