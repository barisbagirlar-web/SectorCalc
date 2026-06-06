"use client";

import Link from "next/link";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { FreeToolsQuickLinks } from "@/components/account/FreeToolsQuickLinks";
import { PremiumToolsGrid } from "@/components/account/PremiumToolsGrid";
import { RecentReportsPanel } from "@/components/account/RecentReportsPanel";
import { SubscriptionStatusCard } from "@/components/account/SubscriptionStatusCard";
import { PageLayout } from "@/components/layout/PageLayout";
import { Container } from "@/components/ui/Container";
import { useUserSubscription } from "@/lib/billing/use-user-subscription";
import { useUserReports } from "@/lib/reports/use-user-reports";
import { getLoginHref } from "@/lib/tools/tool-links";

function AccountSubscribedBanner() {
  const searchParams = useSearchParams();
  const subscribed = searchParams.get("subscribed") === "true";

  if (!subscribed) {
    return null;
  }

  return (
    <div className="mb-6 rounded-xl border border-emerald/25 bg-emerald/10 px-4 py-4 sm:px-5">
      <p className="text-sm font-medium text-deep-navy">
        Payment received. Your SectorCalc Pro access may take a few seconds to activate.
      </p>
      <p className="mt-2 text-sm text-slate">
        Premium tools and saved reports will appear here once your subscription is active.
      </p>
    </div>
  );
}

function AccountDashboardLoginPrompt() {
  const loginHref = getLoginHref("/account");

  return (
    <aside className="mx-auto max-w-2xl rounded-2xl border border-slate/15 bg-white p-6 shadow-card sm:p-8">
      <p className="text-xs font-semibold uppercase tracking-wider text-professional-blue">
        Sign in required
      </p>
      <h2 className="mt-3 text-xl font-bold text-deep-navy sm:text-2xl">
        Sign in to your SectorCalc account
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-slate">
        Access premium decision tools, subscription status and saved verdict reports.
      </p>
      <Link
        href={loginHref}
        className="mt-6 inline-flex min-h-[48px] w-full items-center justify-center rounded-lg bg-professional-blue px-5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 sm:w-auto"
      >
        Sign in
      </Link>
    </aside>
  );
}

export function AccountDashboard() {
  const { user, subscription, isActive, loading: authLoading } = useUserSubscription();
  const {
    reports,
    loading: reportsLoading,
    error: reportsError,
  } = useUserReports(user, 5);

  return (
    <PageLayout headerTheme="light">
      <section className="border-b border-slate/10 bg-white py-10 sm:py-12">
        <Container size="wide" className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-professional-blue">
            Customer account
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-deep-navy sm:text-4xl">
            Your SectorCalc account
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-slate">
            Access premium decision tools, saved verdict reports and subscription status.
          </p>
        </Container>
      </section>

      <section className="bg-off-white py-10 sm:py-12">
        <Container size="wide" className="min-w-0">
          {authLoading ? (
            <div className="rounded-xl border border-slate/15 bg-white p-6 text-sm text-slate">
              Loading your account…
            </div>
          ) : !user ? (
            <AccountDashboardLoginPrompt />
          ) : (
            <>
              <Suspense fallback={null}>
                <AccountSubscribedBanner />
              </Suspense>
              <div className="grid min-w-0 gap-8 lg:grid-cols-2 lg:items-start">
                <div className="min-w-0 space-y-6">
                  <SubscriptionStatusCard
                    subscription={subscription}
                    isActive={isActive}
                    loading={false}
                  />
                  <RecentReportsPanel
                    reports={reports}
                    loading={reportsLoading}
                    error={reportsError}
                  />
                  <FreeToolsQuickLinks />
                </div>
                <PremiumToolsGrid isActive={isActive} />
              </div>

              <div className="mt-10 space-y-3 border-t border-slate/10 pt-6">
                <p className="text-xs leading-relaxed text-slate">
                  Saved reports are linked to your account. Free tool inputs are not saved
                  unless you create a premium report.
                </p>
                <p className="text-xs leading-relaxed text-slate">
                  SectorCalc outputs are technical simulations and decision-support estimates,
                  not financial, legal or engineering advice.
                </p>
              </div>
            </>
          )}
        </Container>
      </section>
    </PageLayout>
  );
}
