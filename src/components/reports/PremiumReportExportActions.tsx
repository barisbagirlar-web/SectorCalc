"use client";

import { PDFDownloadLink } from "@react-pdf/renderer";
import { useCallback, useMemo, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { usePathname } from "next/navigation";
import { Link } from "@/i18n/routing";
import { VerdictPdfDocument } from "@/components/reports/VerdictPdfDocument";
import { startCheckoutRedirect } from "@/lib/billing/start-checkout";
import { trackConversionEvent } from "@/lib/analytics/conversion-funnel";
import { useAttributionContext } from "@/lib/analytics/use-attribution-context";
import { stripLocalePrefix } from "@/i18n/locales";
import type { PremiumEntitlement } from "@/lib/entitlements/premium-entitlements";
import {
  buildPremiumReportSummaryText,
  serializePremiumReportCsv,
  type PremiumReportExportPayload,
} from "@/lib/premium-schema/premium-report-export";
import {
  buildVerdictReportFileName,
  mapPremiumReportExportToVerdictReportData,
} from "@/lib/reports/verdict-report";
import {
  REVENUE_EVENTS,
  trackRevenueEvent,
} from "@/lib/analytics/revenue-events";

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

  const trackExport = useCallback(
    (
      eventName:
        | "report_export_click"
        | "report_print_click"
        | "report_csv_click"
        | "report_copy_summary_click"
        | "locked_export_click"
        | "premium_unlock_click",
      exportType: "pdf" | "print" | "csv" | "copy",
      entitled: boolean
    ) => {
      trackConversionEvent({
        stage: entitled ? "export_intent" : "unlock_intent",
        eventName: entitled ? eventName : "locked_export_click",
        locale,
        pagePath,
        premiumSlug: payload.schemaSlug,
        campaignId: attribution.utmCampaign,
        source: attribution.utmSource,
        medium: attribution.utmMedium,
        ctaId: entitled ? eventName : `locked_${exportType}`,
        valueType: entitled ? "export" : "premium",
        exportType,
      });
    },
    [
      attribution.utmCampaign,
      attribution.utmMedium,
      attribution.utmSource,
      locale,
      pagePath,
      payload.schemaSlug,
    ]
  );

  const handleUnlock = useCallback(() => {
    trackConversionEvent({
      stage: "unlock_intent",
      eventName: "premium_unlock_click",
      locale,
      pagePath,
      premiumSlug: payload.schemaSlug,
      campaignId: attribution.utmCampaign,
      source: attribution.utmSource,
      medium: attribution.utmMedium,
      ctaId: "unlock_export",
      valueType: "premium",
    });
    void startCheckoutRedirect({
      planId: "single_report",
      premiumSlug: payload.schemaSlug,
      returnPath: `/tools/premium-schema/${payload.schemaSlug}`,
      locale,
    }).catch(() => {
      window.location.assign(checkoutHref);
    });
  }, [
    attribution.utmCampaign,
    attribution.utmMedium,
    attribution.utmSource,
    locale,
    pagePath,
    payload.schemaSlug,
  ]);

  const handleDownloadCsv = useCallback(() => {
    if (typeof document === "undefined") {
      return;
    }
    if (!entitlement.canExportCsv) {
      trackExport("locked_export_click", "csv", false);
      return;
    }
    trackExport("report_csv_click", "csv", true);
    const csv = serializePremiumReportCsv(payload, locale);
    downloadCsv(`${payload.schemaSlug}-report.csv`, csv);
  }, [entitlement.canExportCsv, locale, payload, trackExport]);

  const handleCopySummary = useCallback(async () => {
    if (!entitlement.canExportCsv) {
      trackExport("locked_export_click", "copy", false);
      return;
    }
    trackExport("report_copy_summary_click", "copy", true);
    if (typeof navigator === "undefined" || !navigator.clipboard) {
      setCopyState("failed");
      return;
    }
    try {
      await navigator.clipboard.writeText(buildPremiumReportSummaryText(payload, locale));
      setCopyState("copied");
      window.setTimeout(() => setCopyState("idle"), 2500);
    } catch {
      setCopyState("failed");
    }
  }, [entitlement.canExportCsv, payload, trackExport]);

  const handlePrint = useCallback(() => {
    if (typeof window === "undefined") {
      return;
    }
    if (!entitlement.canExportPdf) {
      trackExport("locked_export_click", "print", false);
      return;
    }
    trackExport("report_print_click", "print", true);
    window.open(printHref, "_blank", "noopener,noreferrer");
  }, [entitlement.canExportPdf, printHref, trackExport]);

  const handleLockedExportClick = useCallback(
    (exportType: "print" | "csv") => {
      trackExport("locked_export_click", exportType, false);
      handleUnlock();
    },
    [handleUnlock, trackExport]
  );

  const exportLocked = !entitlement.canExportPdf && !entitlement.canExportCsv;

  const pdfExport = useMemo(
    () => mapPremiumReportExportToVerdictReportData(payload),
    [payload]
  );
  const pdfFileName = buildVerdictReportFileName(payload.schemaSlug, payload.generatedAt);

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
              <PDFDownloadLink
                document={
                  <VerdictPdfDocument
                    data={pdfExport.data}
                    severity={pdfExport.severity}
                  />
                }
                fileName={pdfFileName}
                onClick={() =>
                  trackRevenueEvent(REVENUE_EVENTS.verdict_pdf_downloaded, {
                    slug: payload.schemaSlug,
                  })
                }
                className="sc-ledger-cta-primary sc-premium-export-actions__btn inline-flex min-h-[44px] items-center justify-center"
              >
                {({ loading }) =>
                  loading
                    ? "Preparing PDF…"
                    : "Download Premium Decision Summary PDF"
                }
              </PDFDownloadLink>
            ) : null}

            {entitlement.canExportPdf ? (
              <button
                type="button"
                onClick={handlePrint}
                className="sc-ledger-cta-secondary sc-premium-export-actions__btn min-h-[44px]"
              >
                {t("printPdf")}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => handleLockedExportClick("print")}
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
                onClick={() => handleLockedExportClick("csv")}
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
    void startCheckoutRedirect({
      planId: "single_report",
      returnPath: backHref,
    }).catch(() => {
      window.location.assign(checkoutHref);
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
