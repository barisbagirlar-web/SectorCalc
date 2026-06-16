"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { DynamicToolForm } from "@/components/tools/DynamicToolForm";
import { FreeToolForm } from "@/components/tools/FreeToolForm";
import {
  resolveGeneratedToolTitle,
  resolvePrimaryOutputKey,
} from "@/lib/generated-tools/resolve-tool-display";
import {
  runGeneratedToolCalculation,
  useToolSchema,
} from "@/lib/generated-tools/use-tool-schema";
import type { GeneratedToolResult, GeneratedToolSchema } from "@/lib/generated-tools/types";

export type GeneratedToolFormViewProps = {
  readonly slug: string;
  readonly schema: GeneratedToolSchema;
};

export function GeneratedToolFormView({ slug, schema }: GeneratedToolFormViewProps) {
  const locale = useLocale();
  const t = useTranslations("generatedTool");
  const { loading, error, calculator, zodSchema } = useToolSchema(slug, schema);
  const [result, setResult] = useState<GeneratedToolResult | null>(null);
  const [lastInputs, setLastInputs] = useState<Record<string, unknown>>({});

  const title = resolveGeneratedToolTitle(slug, schema, locale);
  const primaryOutputKey = resolvePrimaryOutputKey(schema);
  const isPremium = schema.premiumRequired === true;

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

  return (
    <div className="container mx-auto max-w-6xl px-4 py-6">
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
    </div>
  );
}
