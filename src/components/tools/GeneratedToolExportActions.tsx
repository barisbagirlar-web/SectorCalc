"use client";

import { useCallback } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { useSubscription } from "@/hooks/useSubscription";
import {
  downloadGeneratedToolCsv,
  serializeGeneratedToolCsv,
} from "@/lib/generated-tools/generated-tool-export";
import type { GeneratedToolResult, GeneratedToolSchema } from "@/lib/generated-tools/types";
import { translateCalculatorPhrase } from "@/lib/i18n/calculator-phrase-translate";

type GeneratedToolExportActionsProps = {
  readonly slug: string;
  readonly title: string;
  readonly schema: GeneratedToolSchema;
  readonly inputs: Record<string, unknown>;
  readonly result: GeneratedToolResult;
};

export function GeneratedToolExportActions({
  slug,
  title,
  schema,
  inputs,
  result,
}: GeneratedToolExportActionsProps) {
  const locale = useLocale();
  const t = useTranslations("generatedTool.export");
  const { isPro, loading } = useSubscription();
  const exportLocked = schema.premiumRequired && !isPro;

  const handleCsvDownload = useCallback(() => {
    if (exportLocked) {
      return;
    }
    const csv = serializeGeneratedToolCsv({ slug, title, schema, inputs, result });
    downloadGeneratedToolCsv(`${slug}-report.csv`, csv);
  }, [exportLocked, inputs, result, schema, slug, title]);

  const handlePrint = useCallback(() => {
    if (exportLocked) {
      return;
    }
    window.print();
  }, [exportLocked]);

  if (loading) {
    return null;
  }

  return (
    <section
      className="rounded-lg border border-technical-gray bg-white p-4 print:hidden"
      aria-label={t("sectionLabel")}
    >
      <h2 className="text-sm font-semibold text-premium-velvet">{t("sectionLabel")}</h2>
      <p className="mt-1 text-xs text-body-charcoal">{t("privacyNote")}</p>

      <div className="mt-4 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={handleCsvDownload}
          disabled={exportLocked}
          className="sc-ledger-cta-secondary min-h-[44px] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {t("downloadCsv")}
        </button>
        <button
          type="button"
          onClick={handlePrint}
          disabled={exportLocked}
          className="sc-ledger-cta-secondary min-h-[44px] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {t("printReport")}
        </button>
      </div>

      {exportLocked ? (
        <p className="mt-3 text-sm text-body-charcoal">
          {t("lockedMessage")}{" "}
          <Link href="/pricing" className="font-semibold text-premium-copper hover:underline">
            {t("unlockCta")}
          </Link>
        </p>
      ) : null}

      {schema.premiumFeatures.length > 0 ? (
        <ul className="mt-3 list-disc space-y-1 pl-5 text-xs text-body-charcoal">
          {schema.premiumFeatures.slice(0, 3).map((feature) => (
            <li key={feature}>{translateCalculatorPhrase(feature, locale)}</li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
