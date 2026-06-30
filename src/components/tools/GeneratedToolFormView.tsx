"use client";

import { useMemo } from "react";
import { useLocale, useTranslations } from "next-intl";
import { DynamicToolFormWrapper } from "@/lib/features/dynamic-form-v2";
import { ToolAcademicReferences } from "@/components/tools/ToolAcademicReferences";
import { ToolDescription } from "@/components/tools/ToolDescription";
import {
  resolveGeneratedToolTitle,
} from "@/lib/features/generated-tools/resolve-tool-display";
import { resolveGeneratedToolAboutContent } from "@/lib/features/generated-tools/resolve-tool-about";
import {
  useToolSchema,
} from "@/lib/features/generated-tools/use-tool-schema";
import type { GeneratedToolSchema } from "@/lib/features/generated-tools/types";

export type GeneratedToolFormViewProps = {
  readonly slug: string;
  readonly schema: GeneratedToolSchema;
};

export function GeneratedToolFormView({ slug, schema }: GeneratedToolFormViewProps) {
  const locale = useLocale();
  const t = useTranslations("generatedTool");
  const { loading, error, trustStatus } = useToolSchema(slug, schema);

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

  const isPremium = schema.premiumRequired === true;

  if (loading) {
    return (
      <div className="container mx-auto max-w-6xl px-4 py-6">
        <p className="text-sm text-body-charcoal">{t("loading")}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto max-w-6xl px-4 py-6">
        <p className="text-sm text-red-800">{error ?? t("loadError")}</p>
      </div>
    );
  }

  const isQuarantine = trustStatus === "QUARANTINE";

  return (
    <div className="container mx-auto max-w-6xl px-4 py-6">
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

      <DynamicToolFormWrapper schema={schema} slug={slug} showMasthead={false} />

      <ToolDescription content={aboutContent} isPremium={isPremium} />

      <ToolAcademicReferences />
    </div>
  );
}
