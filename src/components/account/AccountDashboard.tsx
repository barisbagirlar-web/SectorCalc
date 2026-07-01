"use client";

import Link from "@/lib/ui-shared/navigation/next-link";
import { CreditSummary } from "@/components/account/CreditSummary";
import { SupportTicketForm } from "@/components/account/SupportTicketForm";
import { SubscriptionStatusCard } from "@/components/account/SubscriptionStatusCard";
import { LogoutButton } from "@/components/account/LogoutButton";
import { PageLayout } from "@/components/layout/PageLayout";
import { Container } from "@/components/ui/Container";
import { useUserSubscription } from "@/lib/features/billing/use-user-subscription";
import { getLoginHref } from "@/lib/features/tools/tool-links";

function AccountDashboardLoginPrompt() {
  const loginHref = getLoginHref("/account");

  return (
    <div className="sc-account-hub__guest">
      <aside className="sc-account-hub__guest-card">
        <span className="sc-omni-hub__pro-badge">Account</span>
        <h2 className="sc-account-hub__guest-title">Sign in to your workspace</h2>
        <p className="sc-account-hub__guest-lead">
          Access credit balance, support tickets and account settings from one place.
        </p>
        <ul className="sc-account-hub__guest-benefits">
          <li>Credit balance & usage summary</li>
          <li>Open support tickets</li>
          <li>Subscription & billing management</li>
        </ul>
        <Link href={loginHref} className="sc-cta-primary sc-account-hub__guest-cta">
          Sign in with Google
        </Link>
      </aside>
    </div>
  );
}

export function AccountDashboard() {
  const { user, subscription, isActive, loading: authLoading } = useUserSubscription();

  return (
    <PageLayout>
      <div className="sc-account-hub">
        <section className="sc-account-hub__hero">
          <Container size="wide" className="sc-pro-container sc-pro-container--wide min-w-0">
            <div className="sc-account-hub__hero-inner">
              <div className="sc-account-hub__hero-copy">
                <p className="sc-pro-eyebrow">Account dashboard</p>
                <h1 className="sc-account-hub__title">
                  {authLoading
                    ? "Loading..."
                    : user
                      ? `Welcome, ${user.email?.split("@")[0] ?? "Operator"}`
                      : "Account Dashboard"}
                </h1>
                <p className="sc-account-hub__subtitle">
                  Credit balance, usage summary, support and sign-out — one dashboard.
                </p>
              </div>
              {user && (
                <div className="account-dashboard__header-action">
                  <LogoutButton />
                </div>
              )}
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
              <div className="account-dashboard__content">
                <SubscriptionStatusCard
                  subscription={subscription}
                  isActive={isActive}
                  loading={authLoading}
                />
                <CreditSummary />
                <SupportTicketForm />
              </div>
            )}
          </Container>
        </section>
      </div>
    </PageLayout>
  );
}
