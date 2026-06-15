"use client";

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { CarbonFootprintReport } from "@/components/tools/CarbonFootprintReport";
import { DynamicToolForm } from "@/components/tools/DynamicToolForm";
import { EOQOptimizer } from "@/components/tools/EOQOptimizer";
import { GeneratedToolExportActions } from "@/components/tools/GeneratedToolExportActions";
import { QuoteBuilder } from "@/components/tools/QuoteBuilder";
import { useSubscription } from "@/hooks/useSubscription";
import { mapInventoryToolInputsToEOQ } from "@/lib/inventory/eoq-optimizer";
import {
  isCarbonFootprintReportTool,
  mapCarbonToolInputsToReport,
} from "@/lib/carbon/carbon-footprint-report";
import {
  resolveGeneratedToolDescription,
  resolveGeneratedToolTitle,
  resolvePrimaryOutputKey,
  resolvePrimaryOutputLabel,
} from "@/lib/generated-tools/resolve-tool-display";
import {
  runGeneratedToolCalculation,
  useToolSchema,
} from "@/lib/generated-tools/use-tool-schema";
import type { GeneratedToolResult, GeneratedToolSchema } from "@/lib/generated-tools/types";

export type GeneratedToolPageProps = {
  readonly slug: string;
  readonly schema: GeneratedToolSchema;
  readonly diagramSrc?: string | null;
};

function formatPrimaryValue(value: unknown, locale: string): string {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return "—";
  }
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  }).format(value);
}

function resolveHiddenDrivers(
  result: GeneratedToolResult,
  schema: GeneratedToolSchema,
): readonly string[] {
  if (result.hiddenLossDrivers.length > 0) {
    return result.hiddenLossDrivers;
  }
  return schema.outputs.hiddenLossDrivers;
}

function resolveSuggestedActions(
  result: GeneratedToolResult,
  schema: GeneratedToolSchema,
): readonly string[] {
  if (result.suggestedActions.length > 0) {
    return result.suggestedActions;
  }
  return schema.outputs.suggestedActions;
}

export function GeneratedToolPage({ slug, schema, diagramSrc = null }: GeneratedToolPageProps) {
  const locale = useLocale();
  const t = useTranslations("generatedTool");
  const tQuote = useTranslations("generatedTool.quoteBuilder");
  const tEoq = useTranslations("generatedTool.eoqOptimizer");
  const tCarbon = useTranslations("generatedTool.carbonFootprintReport");
  const { isPro, loading: subscriptionLoading } = useSubscription();
  const { loading, error, calculator, zodSchema } = useToolSchema(slug, schema);
  const [result, setResult] = useState<GeneratedToolResult | null>(null);
  const [lastInputs, setLastInputs] = useState<Record<string, unknown>>({});
  const [showQuoteBuilder, setShowQuoteBuilder] = useState(false);

  const title = resolveGeneratedToolTitle(slug, schema, locale);
  const description = resolveGeneratedToolDescription(slug, schema, locale);
  const primaryKey = resolvePrimaryOutputKey(schema);
  const hasDiagram = Boolean(diagramSrc);

  const primaryValue = useMemo(() => {
    if (!result) {
      return null;
    }
    const raw = result[primaryKey];
    if (typeof raw === "number") {
      return raw;
    }
    return result.dataConfidenceAdjusted;
  }, [primaryKey, result]);

  const hiddenDrivers = useMemo(
    () => (result ? resolveHiddenDrivers(result, schema) : []),
    [result, schema],
  );

  const suggestedActions = useMemo(
    () => (result ? resolveSuggestedActions(result, schema) : []),
    [result, schema],
  );

  const eoqInitialInputs = useMemo(
    () =>
      slug === "inventory-carrying-cost-eoq-calculator"
        ? mapInventoryToolInputsToEOQ(lastInputs)
        : undefined,
    [lastInputs, slug],
  );

  const showEoqOptimizer = slug === "inventory-carrying-cost-eoq-calculator";

  const carbonReportConfig = useMemo(
    () =>
      isCarbonFootprintReportTool(slug)
        ? mapCarbonToolInputsToReport(slug, lastInputs)
        : null,
    [lastInputs, slug],
  );

  const showCarbonFootprintReport = isCarbonFootprintReportTool(slug);

  const handleCalculate = (values: Record<string, unknown>) => {
    if (!calculator) {
      return;
    }
    setLastInputs(values);
    setResult(runGeneratedToolCalculation(calculator, values));
  };

  if (loading) {
    return (
      <div className="rounded-lg border border-technical-gray bg-surface-cream p-6 text-sm text-body-charcoal">
        {t("loading")}
      </div>
    );
  }

  if (error || !calculator || !zodSchema) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-sm text-red-800">
        {error ?? t("loadError")}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 sm:p-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-bold text-premium-velvet sm:text-3xl">{title}</h1>
        <p className="max-w-3xl text-sm text-body-charcoal sm:text-base">{description}</p>
      </header>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {hasDiagram ? (
          <div className="rounded-lg bg-surface-cream p-4 md:col-span-1">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={diagramSrc ?? ""}
              alt={t("diagramAlt", { title })}
              className="h-auto w-full"
              loading="lazy"
            />
          </div>
        ) : null}

        <div
          className={`rounded-lg border border-technical-gray bg-white p-4 shadow-sm ${hasDiagram ? "md:col-span-2" : "md:col-span-3"}`}
        >
          {result && primaryValue !== null ? (
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-body-charcoal">
                {t("primaryResult")}
              </p>
              <p className="font-mono text-3xl font-semibold text-premium-velvet">
                {formatPrimaryValue(primaryValue, locale)}
              </p>
              <p className="text-sm text-body-charcoal">
                {resolvePrimaryOutputLabel(schema)}
              </p>
            </div>
          ) : (
            <p className="text-sm text-body-charcoal">{t("clickToCompute")}</p>
          )}
        </div>
      </div>

      <div className="sc-form-shell sc-industrial-form sc-ledger-panel sc-industrial-panel rounded-lg p-4 sm:p-5">
        <DynamicToolForm
          slug={slug}
          schema={schema}
          zodSchema={zodSchema}
          toolTitle={title}
          primaryOutputKey={primaryKey}
          result={result}
          onSubmit={handleCalculate}
          breakdown={result?.breakdown ?? null}
          breakdownInputs={lastInputs}
          breakdownLabelMap={schema.outputs.breakdown}
          scenarioComparison={{
            calculateFn: (values) => runGeneratedToolCalculation(calculator, values),
            primaryOutputKey: primaryKey,
            enabled: schema.premiumFeatures.some((feature) =>
              /scenario|what-if/i.test(feature),
            ),
          }}
        />
      </div>

      {result ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-red-100 bg-red-50 p-4">
            <h2 className="mb-2 text-sm font-semibold text-red-900">{t("hiddenLossDrivers")}</h2>
            {hiddenDrivers.length > 0 ? (
              <ul className="list-disc space-y-1 pl-5 text-sm text-red-800">
                {hiddenDrivers.map((driver) => (
                  <li key={driver}>{driver}</li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-red-800">{t("noWarnings")}</p>
            )}
          </div>

          <div className="rounded-lg border border-green-100 bg-green-50 p-4">
            <h2 className="mb-2 text-sm font-semibold text-green-900">{t("suggestedActions")}</h2>
            {suggestedActions.length > 0 ? (
              <ul className="list-disc space-y-1 pl-5 text-sm text-green-900">
                {suggestedActions.map((action) => (
                  <li key={action}>{action}</li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-green-900">{t("noSuggestedActions")}</p>
            )}
          </div>
        </div>
      ) : null}

      {result ? (
        <GeneratedToolExportActions
          slug={slug}
          title={title}
          schema={schema}
          inputs={lastInputs}
          result={result}
        />
      ) : null}

      {result && isPro && !subscriptionLoading ? (
        <div className="space-y-4">
          {!showQuoteBuilder ? (
            <button
              type="button"
              onClick={() => setShowQuoteBuilder(true)}
              className="sc-ledger-cta-primary sc-cta-primary min-h-[44px] px-4 py-2 text-sm"
            >
              {tQuote("open")}
            </button>
          ) : (
            <QuoteBuilder
              slug={slug}
              toolName={title}
              schema={schema}
              inputs={lastInputs}
              result={result}
              primaryOutputKey={primaryKey}
              onClose={() => setShowQuoteBuilder(false)}
            />
          )}
        </div>
      ) : null}

      {showEoqOptimizer && isPro && !subscriptionLoading ? (
        <details className="rounded-xl border border-technical-gray bg-white p-4 shadow-sm">
          <summary className="cursor-pointer text-sm font-semibold text-premium-velvet">
            {tEoq("summary")}
          </summary>
          <div className="mt-4">
            <EOQOptimizer initialInputs={eoqInitialInputs} />
          </div>
        </details>
      ) : null}

      {showCarbonFootprintReport && isPro && !subscriptionLoading ? (
        <details className="rounded-xl border border-technical-gray bg-white p-4 shadow-sm">
          <summary className="cursor-pointer text-sm font-semibold text-premium-velvet">
            {tCarbon("summary")}
          </summary>
          <div className="mt-4">
            <CarbonFootprintReport
              initialInputs={carbonReportConfig?.seed}
              calculationOptions={carbonReportConfig?.options}
            />
          </div>
        </details>
      ) : null}
    </div>
  );
}
