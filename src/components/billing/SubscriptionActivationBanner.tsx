"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useUserSubscription } from "@/lib/billing/use-user-subscription";
import { getAccountHref, getPremiumToolHref } from "@/lib/tools/tool-links";
import { getRevenueToolByPaidSlug, revenueTools } from "@/lib/tools/revenue-tools";

export function PricingSubscribedBanner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const subscribed = searchParams.get("subscribed") === "true";
  const { user, isActive, loading } = useUserSubscription();
  const toolParam = searchParams.get("tool");
  const tool = toolParam ? getRevenueToolByPaidSlug(toolParam) : null;
  const premiumHref = tool
    ? getPremiumToolHref(tool)
    : revenueTools[0]
      ? getPremiumToolHref(revenueTools[0])
      : getAccountHref();

  if (!subscribed) {
    return null;
  }

  return (
    <div
      className="border-b border-emerald/25 bg-emerald/10"
      role="status"
    >
      <div className="mx-auto max-w-4xl px-4 py-4 sm:px-6">
        <p className="text-sm font-medium text-deep-navy">
          Payment received. Your SectorCalc Pro access may take a few seconds to
          activate.
        </p>
        {!loading && user ? (
          <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center">
            {isActive ? (
              <p className="text-sm text-emerald">SectorCalc Pro is active on your account.</p>
            ) : (
              <p className="text-sm text-slate">
                Waiting for subscription activation… this page updates automatically.
              </p>
            )}
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <Link
                href={premiumHref}
                className="inline-flex min-h-[44px] items-center justify-center rounded-lg bg-professional-blue px-4 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
              >
                Open premium tools
              </Link>
              {!tool ? (
                <Link
                  href={getAccountHref()}
                  className="inline-flex min-h-[44px] items-center justify-center rounded-lg border border-slate/20 bg-white px-4 text-sm font-semibold text-deep-navy transition-colors hover:border-professional-blue hover:text-professional-blue"
                >
                  Go to account
                </Link>
              ) : null}
              {!isActive ? (
                <button
                  type="button"
                  onClick={() => router.refresh()}
                  className="inline-flex min-h-[44px] items-center justify-center rounded-lg border border-slate/20 bg-white px-4 text-sm font-semibold text-deep-navy transition-colors hover:border-professional-blue hover:text-professional-blue"
                >
                  Refresh access
                </button>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export function PremiumSubscribedBanner() {
  const searchParams = useSearchParams();
  const subscribed = searchParams.get("subscribed") === "true";
  const { isActive, loading } = useUserSubscription();

  if (!subscribed) {
    return null;
  }

  return (
    <div className="mb-6 rounded-xl border border-emerald/25 bg-emerald/10 px-4 py-4 sm:px-5">
      <p className="text-sm font-medium text-deep-navy">
        Payment received. Your SectorCalc Pro access may take a few seconds to activate.
      </p>
      {!loading && isActive ? (
        <p className="mt-2 text-sm text-emerald">Access is active — run the analyzer below.</p>
      ) : (
        <p className="mt-2 text-sm text-slate">
          Waiting for activation… this page updates automatically when your subscription is ready.
        </p>
      )}
    </div>
  );
}
