"use client";

import { useCallback, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link, usePathname } from "@/i18n/routing";
import { startCheckoutSession } from "@/lib/billing/create-checkout-session";
import { trackSectorCalcEvent } from "@/lib/analytics/event-taxonomy";
import { useAttributionContext } from "@/lib/analytics/use-attribution-context";
import { stripLocalePrefix } from "@/i18n/locales";
import type { PremiumEntitlement } from "@/lib/entitlements/premium-entitlements";
import {
  buildPremiumReportSummaryText,
  serializePremiumReportCsv,
  type PremiumReportExportPayload,
} from "@/lib/premium-schema/premium-report-export";

export interface PremiumReportExportActionsProps {
  payload: PremiumReportExportPayload;
  printHref: string;
  entitlement: PremiumEntitlement;
  checkoutHref: string;
}

function downloadCsv(filename: string, content: string): void {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.rel = "noopener";
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

export function PremiumReportExportActions({
  payload,
  printHref,
  entitlement,
  checkoutHref,
}: PremiumReportExportActionsProps) {
  const t = useTranslations("premiumDecisionReport.export");
  const tLocked = useTranslations("premiumDecisionReport.locked");
  const locale = useLocale();
  const pathname = usePathname();
  const attribution = useAttributionContext();
  const pagePath = stripLocalePrefix(pathname);
  const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">("idle");

  const trackExportEvent = useCallback(
    (eventName: "report_export_click" | "report_print_click" | "report_csv_click" | "premium_unlock_click") => {
      trackSectorCalcEvent({
        eventName,
        locale,
        pagePath,
        premiumSlug: payload.schemaSlug,
        campaignId: attribution.utmCampaign,
        source: attribution.utmSource,
        medium: attribution.utmMedium,
        ctaId: eventName,
      });
    },
    [attribution.utmCampaign, attribution.utmMedium, attribution.utmSource, locale, pagePath, payload.schemaSlug]
  );

  const handleUnlock = useCallback(() => {
    trackExportEvent("premium_unlock_click");
    void startCheckoutSession({
      toolSlug: payload.schemaSlug,
      plan: "single_report",
      returnPath: `/tools/premium-schema/${payload.schemaSlug}`,
    });
  }, [payload.schemaSlug, trackExportEvent]);

  const handleDownloadCsv = useCallback(() => {
    if (!entitlement.canExportCsv || typeof document === "undefined") {
      return;
    }
    trackExportEvent("report_csv_click");
    const csv = serializePremiumReportCsv(payload);
    downloadCsv(`${payload.schemaSlug}-report.csv`, csv);
  }, [entitlement.canExportCsv, payload, trackExportEvent]);

  const handleCopySummary = useCallback(async () => {
    if (!entitlement.canExportCsv) {
      return;
    }
    trackExportEvent("report_export_click");
    if (typeof navigator === "undefined" || !navigator.clipboard) {
      setCopyState("failed");
      return;
    }
    try {
      await navigator.clipboard.writeText(buildPremiumReportSummaryText(payload));
      setCopyState("copied");
      window.setTimeout(() => setCopyState("idle"), 2500);
    } catch {
      setCopyState("failed");
    }
  }, [entitlement.canExportCsv, payload, trackExportEvent]);

  const handlePrint = useCallback(() => {
    if (!entitlement.canExportPdf || typeof window === "undefined") {
      return;
    }
    trackExportEvent("report_print_click");
    window.open(printHref, "_blank", "noopener,noreferrer");
  }, [entitlement.canExportPdf, printHref, trackExportEvent]);

  const exportLocked = !entitlement.canExportPdf && !entitlement.canExportCsv;

  return (
    <section className="sc-premium-decision-report__section sc-premium-decision-report__export">
      <h3 className="sc-premium-decision-report__heading">{t("title")}</h3>
      <ul className="sc-premium-export-list">
        <li>{t("sectionExecutive")}</li>
        <li>{t("sectionDrivers")}</li>
        <li>{t("sectionThreshold")}</li>
        <li>{t("sectionAction")}</li>
        <li>{t("sectionAssumptions")}</li>
        <li>{t("sectionReady")}</li>
      </ul>

      <div className="sc-premium-export-actions sc-print-hide">
        {exportLocked ? (
          <>
            <p className="sc-premium-export-actions__locked-note">{tLocked("exportLocked")}</p>
            <button
              type="button"
              onClick={handleUnlock}
              className="sc-ledger-cta-primary sc-premium-export-actions__btn min-h-[44px]"
            >
              {tLocked("unlockCta")}
            </button>
            <Link
              href={checkoutHref}
              className="sc-ledger-cta-secondary sc-premium-export-actions__btn min-h-[44px]"
            >
              {tLocked("pricingCta")}
            </Link>
          </>
        ) : (
          <>
            {entitlement.canExportPdf ? (
              <button
                type="button"
                onClick={handlePrint}
                className="sc-ledger-cta-primary sc-premium-export-actions__btn min-h-[44px]"
              >
                {t("printPdf")}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleUnlock}
                className="sc-ledger-cta-secondary sc-premium-export-actions__btn min-h-[44px]"
              >
                {tLocked("unlockPrint")}
              </button>
            )}

            {entitlement.canExportCsv ? (
              <button
                type="button"
                onClick={handleDownloadCsv}
                className="sc-ledger-cta-secondary sc-premium-export-actions__btn min-h-[44px]"
              >
                {t("downloadCsv")}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleUnlock}
                className="sc-ledger-cta-secondary sc-premium-export-actions__btn min-h-[44px]"
              >
                {tLocked("unlockCsv")}
              </button>
            )}

            {entitlement.canExportCsv ? (
              <button
                type="button"
                onClick={() => void handleCopySummary()}
                className="sc-ledger-cta-secondary sc-premium-export-actions__btn min-h-[44px]"
              >
                {copyState === "copied"
                  ? t("copied")
                  : copyState === "failed"
                    ? t("copyFailed")
                    : t("copySummary")}
              </button>
            ) : null}

            {entitlement.canExportPdf ? (
              <Link
                href={printHref}
                target="_blank"
                rel="noopener noreferrer"
                className="sc-premium-export-actions__link min-h-[44px]"
              >
                {t("openPrintPage")}
              </Link>
            ) : null}
          </>
        )}
      </div>
    </section>
  );
}

export function PremiumPrintToolbar({
  backHref,
  entitlement,
  checkoutHref,
}: {
  backHref: string;
  entitlement: PremiumEntitlement;
  checkoutHref: string;
}) {
  const t = useTranslations("premiumDecisionReport.export");
  const tLocked = useTranslations("premiumDecisionReport.locked");

  const handlePrint = () => {
    if (!entitlement.canExportPdf || typeof window === "undefined") {
      return;
    }
    window.print();
  };

  const handleUnlock = () => {
    void startCheckoutSession({
      plan: "single_report",
      returnPath: backHref,
    });
  };

  return (
    <div className="sc-print-toolbar sc-print-hide">
      {entitlement.canExportPdf ? (
        <button type="button" onClick={handlePrint} className="sc-ledger-cta-primary min-h-[44px]">
          {t("printPdf")}
        </button>
      ) : (
        <>
          <p className="sc-print-toolbar__sample-note">{tLocked("samplePrintNote")}</p>
          <button type="button" onClick={handleUnlock} className="sc-ledger-cta-primary min-h-[44px]">
            {tLocked("unlockCta")}
          </button>
          <Link href={checkoutHref} className="sc-ledger-cta-secondary min-h-[44px]">
            {tLocked("pricingCta")}
          </Link>
        </>
      )}
      <Link href={backHref} className="sc-ledger-cta-secondary min-h-[44px]">
        {t("backToReport")}
      </Link>
    </div>
  );
}
