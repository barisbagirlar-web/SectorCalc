"use client";

import Link from "@/lib/ui-shared/navigation/next-link";
import type { UserSubscription } from "@/lib/features/billing/subscription";
import { getPremiumToolsNavHref, getPricingHref } from "@/lib/features/tools/tool-links";
import { sectorCalcProPricing } from "@/lib/features/tools/revenue-tools";

function formatPeriodEnd(value: string | undefined): string | null {
  if (!value) {
    return null;
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  return parsed.toLocaleDateString("en-US", {
    dateStyle: "medium",
  });
}

interface SubscriptionStatusCardProps {
  subscription: UserSubscription | null;
  isActive: boolean;
  loading: boolean;
}

export function SubscriptionStatusCard({
  subscription,
  isActive,
  loading,
}: SubscriptionStatusCardProps) {
  if (loading) {
    return (
      <section className="sc-account-hub__subscription sc-account-hub__subscription--loading">
        <p className="text-sm text-text-secondary">Loading subscription status…</p>
      </section>
    );
  }

  const status = subscription?.status ?? "none";
  const periodEnd = formatPeriodEnd(subscription?.currentPeriodEnd);

  if (status === "past_due") {
    return (
      <section className="sc-account-hub__subscription sc-account-hub__subscription--warn">
        <div className="sc-account-hub__subscription-copy">
          <p className="sc-account-hub__subscription-eyebrow">Subscription</p>
          <h2 className="sc-account-hub__subscription-title">Payment needs attention</h2>
          <p className="sc-account-hub__subscription-lead">
            Update billing to restore premium calculator access and saved report exports.
          </p>
        </div>
        <Link href={getPricingHref()} className="sc-cta-primary sc-account-hub__subscription-cta">
          Update billing
        </Link>
      </section>
    );
  }

  if (isActive) {
    return (
      <section className="sc-account-hub__subscription sc-account-hub__subscription--pro">
        <div className="sc-account-hub__subscription-copy">
          <p className="sc-account-hub__subscription-eyebrow">SectorCalc Pro</p>
          <h2 className="sc-account-hub__subscription-title">All premium calculators unlocked</h2>
          <p className="sc-account-hub__subscription-lead">
            {periodEnd
              ? `Current billing period ends ${periodEnd}.`
              : "Verdict reports, field panels and PDF save are available on your account."}
          </p>
        </div>
        <Link
          href={getPremiumToolsNavHref()}
          className="sc-cta-secondary sc-account-hub__subscription-cta sc-account-hub__subscription-cta--on-dark"
        >
          Open premium tools
        </Link>
      </section>
    );
  }

  return (
    <section className="sc-account-hub__subscription sc-account-hub__subscription--free">
      <div className="sc-account-hub__subscription-copy">
        <p className="sc-account-hub__subscription-eyebrow">Upgrade</p>
        <h2 className="sc-account-hub__subscription-title">Unlock SectorCalc Pro</h2>
        <p className="sc-account-hub__subscription-lead">
          Safe price floors, margin leak detection and accept / reprice verdicts -{" "}
          {sectorCalcProPricing.planName} from ${sectorCalcProPricing.priceMonthly}/month.
        </p>
      </div>
      <Link href={getPricingHref()} className="sc-cta-primary sc-account-hub__subscription-cta">
        View pricing
      </Link>
    </section>
  );
}
