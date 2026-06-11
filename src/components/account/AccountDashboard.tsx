"use client";

import Link from "@/lib/navigation/next-link";
import { Suspense } from "react";
import { useClientSearchParam } from "@/lib/navigation/use-client-search-params";
import { AccountFeaturedAccess } from "@/components/account/AccountFeaturedAccess";
import { AccountQuickActions } from "@/components/account/AccountQuickActions";
import { RecentReportsPanel } from "@/components/account/RecentReportsPanel";
import { SubscriptionStatusCard } from "@/components/account/SubscriptionStatusCard";
import { PageLayout } from "@/components/layout/PageLayout";
import { Container } from "@/components/ui/Container";
import { useUserSubscription } from "@/lib/billing/use-user-subscription";
import { useUserReports } from "@/lib/reports/use-user-reports";
import { getLoginHref } from "@/lib/tools/tool-links";

function AccountSubscribedBanner() {
  const subscribed = useClientSearchParam("subscribed") === "true";

  if (!subscribed) {
    return null;
  }

  return (
    <div className="sc-account-hub__banner sc-account-hub__banner--success" role="status">
      <p className="sc-account-hub__banner-title">Payment received</p>
      <p className="sc-account-hub__banner-body">
        SectorCalc Pro access may take a few seconds to activate. Refresh if premium tools
        do not appear immediately.
      </p>
    </div>
  );
}

function AccountDashboardLoginPrompt() {
  const loginHref = getLoginHref("/account");

  return (
    <div className="sc-account-hub__guest">
      <aside className="sc-account-hub__guest-card">
        <span className="sc-omni-hub__pro-badge">Account</span>
        <h2 className="sc-account-hub__guest-title">Sign in to your workspace</h2>
        <p className="sc-account-hub__guest-lead">
          Access premium calculators, subscription status and saved verdict reports from one
          place.
        </p>
        <ul className="sc-account-hub__guest-benefits">
          <li>Saved verdict reports & PDF history</li>
          <li>SectorCalc Pro subscription status</li>
          <li>Quick links to premium & free tools</li>
        </ul>
        <Link href={loginHref} className="sc-cta-primary sc-account-hub__guest-cta">
          Sign in with Google
        </Link>
      </aside>
    </div>
  );
}

function formatUserLabel(email: string | null | undefined): string {
  if (!email) {
    return "Operator";
  }
  const local = email.split("@")[0];
  return local.length > 0 ? local : "Operator";
}

export function AccountDashboard() {
  const { user, subscription, isActive, loading: authLoading } = useUserSubscription();
  const {
    reports,
    loading: reportsLoading,
    error: reportsError,
  } = useUserReports(user, 5);

  return (
    <PageLayout>
      <div className="sc-account-hub">
        <section className="sc-account-hub__hero">
          <Container size="wide" className="sc-pro-container sc-pro-container--wide min-w-0">
            <div className="sc-account-hub__hero-inner">
              <div className="sc-account-hub__hero-copy">
                <p className="sc-pro-eyebrow">Customer account</p>
                <h1 className="sc-account-hub__title">
                  {authLoading
                    ? "Your SectorCalc account"
                    : user
                      ? `Welcome, ${formatUserLabel(user.email)}`
                      : "Your SectorCalc account"}
                </h1>
                <p className="sc-account-hub__subtitle">
                  Premium decision tools, saved verdict reports and subscription — one
                  dashboard.
                </p>
              </div>
              {!authLoading && user ? (
                <div className="sc-account-hub__status-pill" aria-live="polite">
                  <span
                    className={`sc-account-hub__status-badge${
                      isActive ? " sc-account-hub__status-badge--pro" : ""
                    }`}
                  >
                    {isActive ? "Pro active" : "Free plan"}
                  </span>
                  {user.email ? (
                    <span className="sc-account-hub__status-email">{user.email}</span>
                  ) : null}
                </div>
              ) : null}
            </div>
          </Container>
        </section>

        <section className="sc-account-hub__body">
          <Container size="wide" className="sc-pro-container sc-pro-container--wide min-w-0">
            {authLoading ? (
              <div className="sc-account-hub__loading">
                <p className="sc-account-hub__loading-text">Loading your account…</p>
              </div>
            ) : !user ? (
              <AccountDashboardLoginPrompt />
            ) : (
              <>
                <Suspense fallback={null}>
                  <AccountSubscribedBanner />
                </Suspense>

                <SubscriptionStatusCard
                  subscription={subscription}
                  isActive={isActive}
                  loading={false}
                />

                <AccountQuickActions isActive={isActive} reportCount={reports.length} />

                <div className="sc-account-hub__main-grid">
                  <RecentReportsPanel
                    reports={reports}
                    loading={reportsLoading}
                    error={reportsError}
                  />
                  <AccountFeaturedAccess isActive={isActive} />
                </div>

                <footer className="sc-account-hub__disclaimer">
                  <p>
                    Saved reports are linked to your account. Free tool inputs are not stored
                    unless you save a premium report.
                  </p>
                  <p>
                    SectorCalc outputs are decision-support estimates — not financial, legal
                    or engineering advice.
                  </p>
                </footer>
              </>
            )}
          </Container>
        </section>
      </div>
    </PageLayout>
  );
}
