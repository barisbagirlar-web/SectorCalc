"use client";

import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { AuditHistoryPanel } from "@/components/os/AuditHistoryPanel";
import { PageLayout } from "@/components/layout/PageLayout";
import { useAuditArchive } from "@/lib/os/hooks/use-audit-archive";
import { getAccountHref, getArchiveHref, getLoginHref } from "@/lib/tools/tool-links";

export function AuditArchivePageContent() {
  const t = useTranslations("auditArchive");
  const { records, loading, error, isSample, isAuthenticated } = useAuditArchive(100);

  return (
    <PageLayout>
      <div className="ind-os-page">
        <div className="ind-os-container">
          <section className="ind-os-section ind-os-section--hero" aria-labelledby="archive-page-title">
            <Link
              href={getAccountHref()}
              className="text-sm font-medium text-body-charcoal transition-colors hover:text-premium-velvet"
            >
              {t("backToAccount")}
            </Link>
            <p className="label-badge mt-6 text-body-charcoal">{t("eyebrow")}</p>
            <h1
              id="archive-page-title"
              className="ind-os-headline mt-3"
            >
              {t("title")}
            </h1>
            <p className="ind-os-lead mt-4 max-w-3xl">{t("subtitle")}</p>
          </section>

          <section className="ind-os-section">
            {loading ? (
              <p className="text-sm text-body-charcoal">{t("loading")}</p>
            ) : !isAuthenticated ? (
              <div className="space-y-6">
                <AuditHistoryPanel records={records} />
                <div className="ind-os-panel p-6 text-sm text-body-charcoal">
                  <p>{t("signInPrompt")}</p>
                  <Link
                    href={getLoginHref(getArchiveHref())}
                    className="ind-os-btn-action mt-4 inline-flex min-h-[44px] items-center px-5 text-xs font-semibold uppercase tracking-wider"
                  >
                    {t("signInCta")}
                  </Link>
                </div>
              </div>
            ) : (
              <>
                {error ? (
                  <p className="mb-4 text-sm text-crit-red status-crit" role="alert">
                    {error}
                  </p>
                ) : null}
                <AuditHistoryPanel records={records} />
                {isSample ? null : records.length === 0 ? (
                  <p className="mt-4 text-xs text-body-charcoal">{t("emptySignedIn")}</p>
                ) : null}
              </>
            )}
          </section>
        </div>
      </div>
    </PageLayout>
  );
}
