"use client";

import { Suspense } from "react";
import Link from "@/lib/ui-shared/navigation/next-link";
import { useTranslations } from "next-intl";
import { CreditsPackages } from "@/components/billing/CreditsPackages";
import { CreditsBalance } from "@/components/credits/CreditsBalance";
import { PageLayout } from "@/components/layout/PageLayout";
import { Container } from "@/components/ui/Container";
import { useClientSearchParam } from "@/lib/ui-shared/navigation/use-client-search-params";
import { useUserSubscription } from "@/lib/features/billing/use-user-subscription";
import { getLoginHref } from "@/lib/features/tools/tool-links";

function CreditsStatusBanner() {
  const t = useTranslations("credits");
  const success = useClientSearchParam("success") === "true";
  const canceled = useClientSearchParam("canceled") === "true";

  if (!success && !canceled) {
    return null;
  }

  return (
    <div
      className={`sc-account-hub__banner${
        success ? " sc-account-hub__banner--success" : ""
      }`}
      role="status"
    >
      <p className="sc-account-hub__banner-title">
        {success ? t("successTitle") : t("canceledTitle")}
      </p>
      <p className="sc-account-hub__banner-body">
        {success ? t("successBody") : t("canceledBody")}
      </p>
    </div>
  );
}

function AccountCreditsContent() {
  const t = useTranslations("credits");
  const { user, loading } = useUserSubscription();
  const loginHref = getLoginHref("/account/credits");

  return (
    <PageLayout>
      <div className="sc-account-hub">
        <section className="sc-account-hub__hero">
          <Container size="wide" className="sc-pro-container sc-pro-container--wide min-w-0">
            <div className="sc-account-hub__hero-inner">
              <div className="sc-account-hub__hero-copy">
                <p className="sc-pro-eyebrow">{t("eyebrow")}</p>
                <h1 className="sc-account-hub__title">{t("title")}</h1>
                <p className="sc-account-hub__subtitle">{t("subtitle")}</p>
              </div>
              {user ? <CreditsBalance /> : null}
            </div>
          </Container>
        </section>

        <section className="sc-craft-section overflow-x-hidden">
          <Container size="wide" className="sc-craft-container sc-craft-container--wide min-w-0">
            <Suspense fallback={null}>
              <CreditsStatusBanner />
            </Suspense>

            {loading ? (
              <p className="text-sm text-body-charcoal">{t("loading")}</p>
            ) : !user ? (
              <div className="sc-account-hub__guest-card max-w-lg">
                <h2 className="sc-account-hub__guest-title">{t("loginTitle")}</h2>
                <p className="sc-account-hub__guest-lead">{t("loginBody")}</p>
                <Link href={loginHref} className="sc-cta-primary sc-account-hub__guest-cta">
                  {t("loginCta")}
                </Link>
              </div>
            ) : (
              <div className="max-w-xl space-y-4">
                <p className="text-sm text-body-charcoal">{t("buyIntro")}</p>
                <CreditsPackages />
                <p className="text-xs text-body-charcoal">{t("disclaimer")}</p>
                <Link href="/account" className="text-sm text-[var(--sc-navy)] underline">
                  {t("backToAccount")}
                </Link>
              </div>
            )}
          </Container>
        </section>
      </div>
    </PageLayout>
  );
}

export function AccountCreditsPageContent() {
  return (
    <Suspense fallback={null}>
      <AccountCreditsContent />
    </Suspense>
  );
}
