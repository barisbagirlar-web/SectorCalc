"use client";

import Link from "next/link";
import type { UserSubscription } from "@/lib/billing/subscription";

const PREMIUM_TOOLS_HREF = "/tools/premium/cnc-quote-risk-analyzer";

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
      <section className="rounded-xl border border-slate/15 bg-white p-6 shadow-card">
        <p className="text-sm text-slate">Loading subscription status…</p>
      </section>
    );
  }

  const status = subscription?.status ?? "none";
  const periodEnd = formatPeriodEnd(subscription?.currentPeriodEnd);

  if (status === "past_due") {
    return (
      <section className="rounded-xl border border-soft-red/25 bg-soft-red/[0.04] p-6 shadow-card">
        <p className="text-xs font-semibold uppercase tracking-wider text-soft-red">
          Subscription
        </p>
        <h2 className="mt-2 text-xl font-bold text-deep-navy">Payment issue</h2>
        <p className="mt-3 text-sm leading-relaxed text-slate">
          Your SectorCalc Pro subscription needs attention. Update billing to restore
          premium analyzer access.
        </p>
        <Link
          href="/pricing"
          className="mt-5 inline-flex min-h-[44px] items-center justify-center rounded-lg bg-professional-blue px-5 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
        >
          Go to pricing
        </Link>
      </section>
    );
  }

  if (isActive) {
    return (
      <section className="rounded-xl border border-emerald/25 bg-emerald/[0.04] p-6 shadow-card">
        <p className="text-xs font-semibold uppercase tracking-wider text-emerald">
          Subscription
        </p>
        <h2 className="mt-2 text-xl font-bold text-deep-navy">SectorCalc Pro active</h2>
        {periodEnd ? (
          <p className="mt-3 text-sm text-slate">Current period ends {periodEnd}</p>
        ) : (
          <p className="mt-3 text-sm text-slate">
            Premium decision tools and saved verdict reports are available on your account.
          </p>
        )}
        <Link
          href={PREMIUM_TOOLS_HREF}
          className="mt-5 inline-flex min-h-[44px] items-center justify-center rounded-lg bg-professional-blue px-5 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
        >
          Open premium tools
        </Link>
      </section>
    );
  }

  return (
    <section className="rounded-xl border border-slate/15 bg-white p-6 shadow-card">
      <p className="text-xs font-semibold uppercase tracking-wider text-professional-blue">
        Subscription
      </p>
      <h2 className="mt-2 text-xl font-bold text-deep-navy">SectorCalc Pro not active</h2>
      <p className="mt-3 text-sm leading-relaxed text-slate">
        Unlock sector-specific analyzers for safe price, bid risk and margin leak verdicts.
      </p>
      <Link
        href="/pricing"
        className="mt-5 inline-flex min-h-[44px] items-center justify-center rounded-lg bg-professional-blue px-5 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
      >
        Unlock SectorCalc Pro
      </Link>
    </section>
  );
}
