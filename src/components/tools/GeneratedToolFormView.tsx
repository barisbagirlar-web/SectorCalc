"use client";

import { useCallback, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { ClaimReviewJsonLd } from "@/components/seo/ClaimReviewJsonLd";
import { DynamicToolForm } from "@/components/tools/DynamicToolForm";
import { ExportPDFButton } from "@/components/tools/ExportPDFButton";
import { FreeToolForm } from "@/components/tools/FreeToolForm";
import { ToolAcademicReferences } from "@/components/tools/ToolAcademicReferences";
import { ToolDescription } from "@/components/tools/ToolDescription";
import { formatGeneratedNumericValue } from "@/lib/generated-tools/format-generated-numeric";
import {
  resolveGeneratedToolTitle,
  resolvePrimaryOutputKey,
} from "@/lib/generated-tools/resolve-tool-display";
import { resolveGeneratedToolAboutContent } from "@/lib/generated-tools/resolve-tool-about";
import { resolvePrimaryOutputUnit } from "@/lib/generated-tools/resolve-output-unit";
import {
  runGeneratedToolCalculation,
  useToolSchema,
} from "@/lib/generated-tools/use-tool-schema";
import type { GeneratedToolResult, GeneratedToolSchema } from "@/lib/generated-tools/types";
import {
  buildPdfExportBreakdownRows,
  buildPdfExportInputRows,
} from "@/lib/pdf/build-pdf-export-rows";
import { absoluteLocalizedUrl } from "@/lib/semantic/site-url";
import { usePathname } from "@/i18n/routing";
import { savePrintData } from "@/lib/reports/generated-tool-print-data";
import { PremiumResultSummary } from "@/components/reports/PremiumResultSummary";

export type GeneratedToolFormViewProps = {
  readonly slug: string;
  readonly schema: GeneratedToolSchema;
};

export function GeneratedToolFormView({ slug, schema }: GeneratedToolFormViewProps) {
  const locale = useLocale();
  const pathname = usePathname();
  const t = useTranslations("generatedTool");
  const { loading, error, calculator, zodSchema } = useToolSchema(slug, schema);
  const [result, setResult] = useState<GeneratedToolResult | null>(null);
  const [lastInputs, setLastInputs] = useState<Record<string, unknown>>({});

  const title = resolveGeneratedToolTitle(slug, schema, locale);
  const primaryOutputKey = resolvePrimaryOutputKey(schema);
  const isPremium = schema.premiumRequired === true;
  const pageUrl = absoluteLocalizedUrl(locale, `/tools/generated/${slug}`);
  const aboutContent = useMemo(
    () => resolveGeneratedToolAboutContent(slug, schema, locale),
    [locale, schema, slug],
  );

  if (loading) {
    return (
      <div className="container mx-auto max-w-6xl px-4 py-6">
        <p className="text-sm text-body-charcoal">{t("loading")}</p>
      </div>
    );
  }

  if (error || !calculator || !zodSchema) {
    return (
      <div className="container mx-auto max-w-6xl px-4 py-6">
        <p className="text-sm text-red-800">{error ?? t("loadError")}</p>
      </div>
    );
  }

  const handleCalculate = (values: Record<string, unknown>) => {
    setLastInputs(values);
    setResult(runGeneratedToolCalculation(calculator, values));
  };

  const handlePrintPremiumReport = useCallback(() => {
    if (!result) return;
    savePrintData({
      slug,
      inputs: lastInputs,
      result: result as unknown as Record<string, unknown>,
      schema: JSON.parse(JSON.stringify(schema)),
    });
    window.open(`/${locale}/tools/generated/${slug}/print`, "_blank");
  }, [result, lastInputs, slug, locale, schema]);

  const primaryRaw = result?.[primaryOutputKey];
  const primaryUnit = resolvePrimaryOutputUnit(schema);
  const formattedPrimary =
    typeof primaryRaw === "number" && Number.isFinite(primaryRaw)
      ? formatGeneratedNumericValue(
          primaryRaw,
          primaryOutputKey,
          locale,
          primaryUnit !== "—" ? primaryUnit : undefined,
        )
      : null;

  const pdfInputRows = buildPdfExportInputRows({
    schema,
    values: lastInputs,
    locale,
  });
  const pdfBreakdownRows = buildPdfExportBreakdownRows({
    schema,
    breakdown: result?.breakdown,
    locale,
  });

  return (
    <div className="container mx-auto max-w-6xl px-4 py-6">
      {result && formattedPrimary ? (
        <ClaimReviewJsonLd claimReviewed={`${title}: ${formattedPrimary}`} pageUrl={pageUrl} />
      ) : null}
      {isPremium ? (
        <DynamicToolForm
          slug={slug}
          schema={schema}
          zodSchema={zodSchema}
          toolTitle={title}
          primaryOutputKey={primaryOutputKey}
          result={result}
          onSubmit={handleCalculate}
          breakdown={result?.breakdown ?? null}
          breakdownInputs={lastInputs}
          breakdownLabelMap={schema.outputs.breakdown}
        />
      ) : (
        <FreeToolForm
          slug={slug}
          schema={schema}
          zodSchema={zodSchema}
          toolTitle={title}
          primaryOutputKey={primaryOutputKey}
          result={result}
          onSubmit={handleCalculate}
        />
      )}

      {!isPremium && result && formattedPrimary && pdfInputRows.length > 0 ? (
        <ExportPDFButton
          toolName={title}
          toolSlug={slug}
          locale={locale}
          pagePath={pathname}
          primaryResult={formattedPrimary}
          inputRows={pdfInputRows}
          breakdownRows={pdfBreakdownRows}
        />
      ) : null}

      {isPremium && result ? (
        <>
          <PremiumResultSummary
            slug={slug}
            schema={schema}
            result={result}
            inputs={lastInputs}
            onOpenFullReport={handlePrintPremiumReport}
          />
          <div className="mt-4 flex justify-center">
            <button
              type="button"
              onClick={handlePrintPremiumReport}
              className="sc-cta-primary sc-ledger-cta-primary min-h-[44px] px-6"
            >
              ⬇ {t("downloadPdfReport")}
            </button>
          </div>
        </>
      ) : null}

      <ToolDescription content={aboutContent} isPremium={isPremium} />

      <ToolAcademicReferences />
    </div>
  );
}
