"use client";

import { useMemo, useState } from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { useLocale, useTranslations } from "next-intl";
import { QuotePdfDocument } from "@/components/tools/QuotePdfDocument";
import { BRAND_ASSETS } from "@/config/brand";
import { resolveGeneratedI18nText } from "@/lib/features/generated-tools/resolve-i18n-text";
import type { GeneratedToolResult, GeneratedToolSchema } from "@/lib/features/generated-tools/types";
import {
  applyFireRateToQuoteTotal,
  resolveQuoteBaseTotal,
} from "@/lib/features/quote/resolve-quote-total";
import { buildQuoteCsvRows, downloadQuoteCsv } from "@/lib/features/quote/quote-csv-export";

export type QuoteBuilderProps = {
  readonly slug: string;
  readonly toolName: string;
  readonly schema: GeneratedToolSchema;
  readonly inputs: Readonly<Record<string, unknown>>;
  readonly result: GeneratedToolResult;
  readonly primaryOutputKey: string;
  readonly onClose?: () => void;
};

const BOOLEAN_LABELS: Record<string, [string, string]> = {
  en: ["Yes", "No"],
  tr: ["Yes", "No"],
  de: ["Ja", "Nein"],
  fr: ["Oui", "Non"],
  es: ["Sí", "No"],
  ar: ["نعم", "لا"],
};

function formatInputValue(value: unknown, locale: string): string {
  if (typeof value === "number" && Number.isFinite(value)) {
    return new Intl.NumberFormat(locale).format(value);
  }
  if (typeof value === "boolean") {
    const labels = BOOLEAN_LABELS[locale] ?? BOOLEAN_LABELS.en;
    return value ? labels[0] : labels[1];
  }
  if (value === null || value === undefined) {
    return "\u2014";
  }
  return String(value);
}

export function QuoteBuilder({
  slug,
  toolName,
  schema,
  inputs,
  result,
  primaryOutputKey,
  onClose,
}: QuoteBuilderProps) {
  const locale = useLocale();
  const t = useTranslations("generatedTool.quoteBuilder");
  const [fireRate, setFireRate] = useState(5);
  const [companyName, setCompanyName] = useState("");
  const [quoteNumber, setQuoteNumber] = useState(`QUOTE-${Date.now()}`);
  const [includeFireRate, setIncludeFireRate] = useState(false);
  const [useBrandLogo, setUseBrandLogo] = useState(true);

  const currency = "USD";
  const baseTotal = resolveQuoteBaseTotal(result, primaryOutputKey);
  const adjustedTotal = applyFireRateToQuoteTotal(baseTotal, fireRate);
  const quoteDate = new Date().toLocaleDateString(locale);

  const pdfLabels = {
    quoteNo: t("pdfQuoteNo"),
    date: t("pdfDate"),
    quoteReport: t("pdfQuoteReport"),
    inputValues: t("pdfInputValues"),
    calcSummary: t("pdfCalcSummary"),
    baseTotal: t("pdfBaseTotal"),
    totalWithFireRate: t("pdfTotalWithFireRate"),
    breakdown: t("pdfBreakdown"),
    hiddenLossDrivers: t("pdfHiddenLossDrivers"),
    suggestedActions: t("pdfSuggestedActions"),
  };

  const inputRows = useMemo(
    () =>
      schema.inputs.map((input) => ({
        label: resolveGeneratedI18nText(input.label_i18n, locale, input.label),
        value: formatInputValue(inputs[input.id], locale),
      })),
    [inputs, locale, schema.inputs],
  );

  const logoSrc =
    useBrandLogo && typeof window !== "undefined"
      ? `${window.location.origin}${BRAND_ASSETS.logo.default}`
      : undefined;

  const csvRows = buildQuoteCsvRows({
    quoteNumber,
    companyName: companyName.trim() || t("defaultCompanyName"),
    toolName,
    inputRows: inputRows.map((row) => ({ field: row.label, value: row.value })),
    baseTotal,
    currency,
    includeFireRate,
    fireRatePercent: fireRate,
    adjustedTotal,
    hiddenLossDrivers: result.hiddenLossDrivers,
    suggestedActions: result.suggestedActions,
  });

  const handleCsvDownload = () => {
    downloadQuoteCsv(`${slug}-quote.csv`, csvRows);
  };

  return (
    <section className="rounded-xl border border-technical-gray bg-white p-4 shadow-sm sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-premium-velvet">{t("title")}</h2>
          <p className="mt-1 text-sm text-body-charcoal">{t("description")}</p>
        </div>
        {onClose ? (
          <button
            type="button"
            onClick={onClose}
            className="min-h-[44px] rounded-lg px-3 text-sm text-body-charcoal hover:bg-surface-cream"
          >
            {t("close")}
          </button>
        ) : null}
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        <label className="block text-sm">
          <span className="font-medium text-body-charcoal">{t("companyName")}</span>
          <input
            type="text"
            value={companyName}
            onChange={(event) => setCompanyName(event.target.value)}
            placeholder={t("defaultCompanyName")}
            className="mt-1 min-h-[44px] w-full rounded-lg border border-technical-gray px-3 py-2 text-sm"
          />
        </label>
        <label className="block text-sm">
          <span className="font-medium text-body-charcoal">{t("quoteNumber")}</span>
          <input
            type="text"
            value={quoteNumber}
            onChange={(event) => setQuoteNumber(event.target.value)}
            className="mt-1 min-h-[44px] w-full rounded-lg border border-technical-gray px-3 py-2 text-sm"
          />
        </label>
      </div>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <label className="flex min-h-[44px] items-center gap-2 text-sm text-body-charcoal">
          <input
            type="checkbox"
            checked={includeFireRate}
            onChange={(event) => setIncludeFireRate(event.target.checked)}
            className="h-4 w-4"
          />
          {t("includeFireRate")}
        </label>

        <label className="flex min-h-[44px] items-center gap-2 text-sm text-body-charcoal">
          <input
            type="checkbox"
            checked={useBrandLogo}
            onChange={(event) => setUseBrandLogo(event.target.checked)}
            className="h-4 w-4"
          />
          {t("includeBrandLogo")}
        </label>

        {includeFireRate ? (
          <label className="flex min-h-[44px] flex-1 items-center gap-3 text-sm sm:max-w-md">
            <span className="whitespace-nowrap font-medium text-body-charcoal">
              {t("fireRateLabel", { rate: fireRate })}
            </span>
            <input
              type="range"
              min={0}
              max={50}
              step={1}
              value={fireRate}
              onChange={(event) => setFireRate(Number(event.target.value))}
              className="w-full"
              aria-label={t("fireRateLabel", { rate: fireRate })}
            />
          </label>
        ) : null}
      </div>

      <div className="mt-4 rounded-lg border border-technical-gray bg-surface-cream p-3 text-sm">
        <p className="text-body-charcoal">
          {t("baseTotal")}:{" "}
          <span className="font-semibold text-premium-velvet">
            {new Intl.NumberFormat(locale, { style: "currency", currency }).format(baseTotal)}
          </span>
        </p>
        {includeFireRate ? (
          <p className="mt-1 text-body-charcoal">
            {t("adjustedTotal")}:{" "}
            <span className="font-semibold text-premium-velvet">
              {new Intl.NumberFormat(locale, { style: "currency", currency }).format(adjustedTotal)}
            </span>
          </p>
        ) : null}
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        <PDFDownloadLink
          document={
            <QuotePdfDocument
              companyName={companyName.trim() || t("defaultCompanyName")}
              quoteNumber={quoteNumber}
              toolName={toolName}
              quoteDate={quoteDate}
              currency={currency}
              locale={locale}
              inputRows={inputRows}
              result={result}
              baseTotal={baseTotal}
              adjustedTotal={adjustedTotal}
              includeFireRate={includeFireRate}
              fireRatePercent={fireRate}
              logoSrc={logoSrc}
              disclaimer={t("disclaimer")}
              labels={pdfLabels}
            />
          }
          fileName={`${slug}-quote.pdf`}
          className="sc-ledger-cta-primary sc-cta-primary inline-flex min-h-[44px] items-center justify-center px-4 py-2 text-sm"
        >
          {({ loading }) => (loading ? t("pdfPreparing") : t("downloadPdf"))}
        </PDFDownloadLink>

        <button
          type="button"
          onClick={handleCsvDownload}
          className="sc-ledger-cta-secondary min-h-[44px] px-4 py-2 text-sm"
        >
          {t("downloadCsv")}
        </button>
      </div>
    </section>
  );
}
