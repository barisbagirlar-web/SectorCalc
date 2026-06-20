"use client";

import { useCallback, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { ClaimReviewJsonLd } from "@/components/seo/ClaimReviewJsonLd";
import { DynamicToolForm } from "@/components/tools/DynamicToolForm";
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
import { absoluteLocalizedUrl } from "@/lib/semantic/site-url";
import { savePrintData } from "@/lib/reports/generated-tool-print-data";
import { PremiumResultSummary } from "@/components/reports/PremiumResultSummary";
import { resolvePrimaryPrintValue } from "@/lib/reports/resolve-print-values";

export type GeneratedToolFormViewProps = {
  readonly slug: string;
  readonly schema: GeneratedToolSchema;
};

export function GeneratedToolFormView({ slug, schema }: GeneratedToolFormViewProps) {
  const locale = useLocale();
  const t = useTranslations("generatedTool");
  const { loading, error, calculator, zodSchema, trustStatus } = useToolSchema(slug, schema);
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

  // Detect stub formula: all formulas are product chains (no domain operations)
  const isStubFormula = useMemo(() => {
    const formulas = schema.formulas ?? {};
    const expressions = Object.values(formulas).filter((v): v is string => typeof v === "string");
    if (expressions.length === 0) return false;
    return expressions.every((expr) => {
      const hasStubMarker = expr.includes("normalized_product") || expr.includes("adjustment_factor");
      const isBareMult =
        /^[\w\s*()]+$/.test(expr) &&
        !expr.includes("+") &&
        !expr.includes("/") &&
        !expr.includes("Math.") &&
        !expr.includes("**") &&
        expr.split("*").length >= 2;
      return hasStubMarker || isBareMult;
    });
  }, [schema]);

  const handlePrintPremiumReport = useCallback(() => {
    savePrintData({
      slug,
      inputs: lastInputs,
      result: result as unknown as Record<string, unknown>,
      schema: JSON.parse(JSON.stringify(schema)),
    });
    window.open(`/${locale}/tools/generated/${slug}/print`, "_blank");
  }, [result, lastInputs, slug, locale, schema]);

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

  const isQuarantine = trustStatus === "QUARANTINE";

  const handleCalculate = (values: Record<string, unknown>) => {
    setLastInputs(values);
    setResult(runGeneratedToolCalculation(calculator, values));
  };

  const primaryRaw = result ? resolvePrimaryPrintValue(result, primaryOutputKey) : null;
  const primaryUnit = resolvePrimaryOutputUnit(schema);
  const formattedPrimary =
    primaryRaw !== null
      ? formatGeneratedNumericValue(
          primaryRaw,
          primaryOutputKey,
          locale,
          primaryUnit !== "—" ? primaryUnit : undefined,
        )
      : null;

  return (
    <div className="container mx-auto max-w-6xl px-4 py-6">
      {result && formattedPrimary ? (
        <ClaimReviewJsonLd claimReviewed={`${title}: ${formattedPrimary}`} pageUrl={pageUrl} />
      ) : null}

      {isQuarantine ? (
        <div className="mb-4 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          <strong className="font-semibold">{t("quarantineWarning")}</strong>
        </div>
      ) : null}

      {isStubFormula && !isPremium ? (
        <div className="mb-4 rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-600">
          <strong className="font-semibold">{t("stubFormulaLabel")}</strong>
          <span className="ml-1">{t("stubFormulaHint")}</span>
        </div>
      ) : null}

      {isStubFormula && isPremium ? (
        <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-2.5 text-xs text-amber-800">
          <strong className="font-semibold">{t("stubFormulaLabel")}</strong>
          <span className="ml-1">{t("stubFormulaHint")}</span>
        </div>
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

      {isPremium && result ? (
        <PremiumResultSummary
          slug={slug}
          schema={schema}
          result={result}
          onOpenFullReport={handlePrintPremiumReport}
        />
      ) : null}

      <ToolDescription content={aboutContent} isPremium={isPremium} />

      <ToolAcademicReferences />
    </div>
  );
}
