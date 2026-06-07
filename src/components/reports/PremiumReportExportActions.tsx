"use client";

import { useCallback, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import {
  buildPremiumReportSummaryText,
  serializePremiumReportCsv,
  type PremiumReportExportPayload,
} from "@/lib/premium-schema/premium-report-export";

export interface PremiumReportExportActionsProps {
  payload: PremiumReportExportPayload;
  printHref: string;
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
}: PremiumReportExportActionsProps) {
  const t = useTranslations("premiumDecisionReport.export");
  const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">("idle");

  const handleDownloadCsv = useCallback(() => {
    if (typeof document === "undefined") {
      return;
    }
    const csv = serializePremiumReportCsv(payload);
    downloadCsv(`${payload.schemaSlug}-report.csv`, csv);
  }, [payload]);

  const handleCopySummary = useCallback(async () => {
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
  }, [payload]);

  const handlePrint = useCallback(() => {
    if (typeof window === "undefined") {
      return;
    }
    window.open(printHref, "_blank", "noopener,noreferrer");
  }, [printHref]);

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
        <button
          type="button"
          onClick={handlePrint}
          className="sc-ledger-cta-primary sc-premium-export-actions__btn min-h-[44px]"
        >
          {t("printPdf")}
        </button>
        <button
          type="button"
          onClick={handleDownloadCsv}
          className="sc-ledger-cta-secondary sc-premium-export-actions__btn min-h-[44px]"
        >
          {t("downloadCsv")}
        </button>
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
        <Link
          href={printHref}
          target="_blank"
          rel="noopener noreferrer"
          className="sc-premium-export-actions__link min-h-[44px]"
        >
          {t("openPrintPage")}
        </Link>
      </div>
    </section>
  );
}

export function PremiumPrintToolbar({ backHref }: { backHref: string }) {
  const t = useTranslations("premiumDecisionReport.export");

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div className="sc-print-toolbar sc-print-hide">
      <button type="button" onClick={handlePrint} className="sc-ledger-cta-primary min-h-[44px]">
        {t("printPdf")}
      </button>
      <Link href={backHref} className="sc-ledger-cta-secondary min-h-[44px]">
        {t("backToReport")}
      </Link>
    </div>
  );
}
