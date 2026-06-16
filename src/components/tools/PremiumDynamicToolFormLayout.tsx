"use client";

import type { Control, FieldErrors } from "react-hook-form";
import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { PremiumDynamicToolFormField } from "@/components/tools/PremiumDynamicToolFormField";
import { PremiumToolReportModal } from "@/components/tools/PremiumToolReportModal";
import { ToolOmniMetaSection } from "@/components/tools/ToolOmniMetaSection";
import { ToolStandardSelector } from "@/components/tools/ToolStandardSelector";
import type {
  GeneratedToolInput,
  GeneratedToolResult,
  GeneratedToolSchema,
} from "@/lib/generated-tools/types";
import type { FeedbackSnapshotValue } from "@/lib/feedback/types";
import { formatGeneratedNumericValue } from "@/lib/generated-tools/format-generated-numeric";
import { resolveGeneratedBreakdownLabel } from "@/lib/generated-tools/resolve-generated-display-text";
import { resolveToolDisplayChrome } from "@/lib/tools/resolve-tool-display-chrome";

type PremiumDynamicToolFormLayoutProps = {
  readonly slug: string;
  readonly schema: GeneratedToolSchema;
  readonly toolTitle: string;
  readonly locale: string;
  readonly routePath: string;
  readonly control: Control<Record<string, unknown>>;
  readonly errors: FieldErrors<Record<string, unknown>>;
  readonly inputs: readonly GeneratedToolInput[];
  readonly resolveInputLabel: (input: GeneratedToolInput) => string;
  readonly resolveBusinessContext: (input: GeneratedToolInput) => string;
  readonly selectedUnits: Record<string, string>;
  readonly onUnitChange: (inputId: string, unit: string) => void;
  readonly result: GeneratedToolResult | null;
  readonly primaryOutputKey: string;
  readonly formValues: Record<string, unknown>;
  readonly submitLabel: string;
  readonly creditGateError: string | null;
  readonly disabled: boolean;
  readonly loading: boolean;
  readonly voteResetKey?: number;
  readonly onVoteFeedback?: (type: "up" | "down") => void | Promise<void>;
  readonly voteNotice: string | null;
  readonly modalOpen: boolean;
  readonly onOpenReport: () => void;
  readonly onCloseReport: () => void;
  readonly userId?: string | null;
  readonly onCalculate: () => void;
  readonly selectedStandard?: string;
  readonly onStandardChange?: (standardId: string) => void;
};

function resolvePrimaryNumericValue(
  result: GeneratedToolResult,
  primaryOutputKey: string,
): number | null {
  const candidates = [
    result[primaryOutputKey],
    result.totalWasteCost,
    result.dataConfidenceAdjusted,
  ];
  for (const candidate of candidates) {
    if (typeof candidate === "number" && Number.isFinite(candidate)) {
      return candidate;
    }
  }
  return null;
}

function formatPremiumPrimaryValue(value: number, key: string, locale: string): string {
  return formatGeneratedNumericValue(value, key, locale);
}

function buildFeedbackSnapshot(
  values: Record<string, unknown>,
): Record<string, FeedbackSnapshotValue> {
  const snapshot: Record<string, FeedbackSnapshotValue> = {};
  for (const [key, value] of Object.entries(values)) {
    if (typeof value === "number" || typeof value === "boolean" || typeof value === "string") {
      snapshot[key] = value;
    }
  }
  return snapshot;
}

function buildResultSnapshot(
  result: GeneratedToolResult | null,
): Record<string, FeedbackSnapshotValue> | undefined {
  if (!result) {
    return undefined;
  }
  const snapshot: Record<string, FeedbackSnapshotValue> = {};
  for (const [key, value] of Object.entries(result)) {
    if (typeof value === "number" || typeof value === "boolean" || typeof value === "string") {
      snapshot[key] = value;
    }
  }
  return Object.keys(snapshot).length > 0 ? snapshot : undefined;
}

export function PremiumDynamicToolFormLayout({
  slug,
  schema,
  toolTitle,
  locale,
  routePath,
  control,
  errors,
  inputs,
  resolveInputLabel,
  resolveBusinessContext,
  selectedUnits,
  onUnitChange,
  result,
  primaryOutputKey,
  formValues,
  submitLabel,
  creditGateError,
  disabled,
  loading,
  voteResetKey,
  onVoteFeedback,
  voteNotice,
  modalOpen,
  onOpenReport,
  onCloseReport,
  userId,
  onCalculate,
  selectedStandard,
  onStandardChange,
}: PremiumDynamicToolFormLayoutProps) {
  const t = useTranslations("generatedTool");
  const tPremium = useTranslations("generatedTool.premiumForm");
  const tFree = useTranslations("generatedTool.freeForm");

  const displayChrome = useMemo(
    () => resolveToolDisplayChrome(slug, schema, locale),
    [locale, schema, slug],
  );

  const primaryValue = result ? resolvePrimaryNumericValue(result, primaryOutputKey) : null;
  const formattedPrimary =
    primaryValue !== null
      ? formatPremiumPrimaryValue(primaryValue, primaryOutputKey, locale)
      : "—";

  const breakdown = result?.breakdown;
  const inputSnapshot = buildFeedbackSnapshot(formValues);
  const resultSnapshot = buildResultSnapshot(result);

  return (
    <>
      <div className="sc-premium-dtf-container">
        <ToolOmniMetaSection
          toolName={toolTitle || schema.toolName}
          slug={slug}
          tier="premium"
          canonicalPath={routePath}
          summary={displayChrome.summary}
          keywordTags={displayChrome.keywordTags}
          icon={displayChrome.icon}
          voteResetKey={voteResetKey}
          onVoteFeedback={onVoteFeedback}
          onFeedback={onOpenReport}
          voteNotice={voteNotice}
        />

        <div className="sc-premium-dtf-card">
          <div className="sc-premium-dtf-columns">
            <div className="sc-premium-dtf-input-panel">
              <div className="sc-premium-dtf-input-grid">
                {schema.standardOptions && schema.standardOptions.length > 0 && selectedStandard && onStandardChange ? (
                  <ToolStandardSelector
                    options={schema.standardOptions}
                    value={selectedStandard}
                    onChange={onStandardChange}
                    disabled={disabled || loading}
                  />
                ) : null}
                {inputs.map((input) => (
                  <PremiumDynamicToolFormField
                    key={input.id}
                    input={input}
                    control={control}
                    errors={errors}
                    inputId={`premium-${slug}-${input.id}`}
                    label={resolveInputLabel(input)}
                    businessContext={resolveBusinessContext(input)}
                    selectedUnit={selectedUnits[input.id]}
                    onUnitChange={(unit) => onUnitChange(input.id, unit)}
                    enterValuePlaceholder={tFree("enterValue")}
                  />
                ))}
              </div>

              {creditGateError ? (
                <p className="sc-premium-dtf-alert mt-3" role="alert">
                  {creditGateError}{" "}
                  <Link href="/account/credits" className="font-semibold underline">
                    {t("buyCreditsCta")}
                  </Link>
                </p>
              ) : null}

              <button
                type="button"
                onClick={onCalculate}
                disabled={disabled || loading}
                className="sc-premium-dtf-btn-calculate"
              >
                {submitLabel}
              </button>
            </div>

            <div className="sc-premium-dtf-result-panel sc-premium-dtf-feedback-area">
              {result ? (
                <div className="sc-premium-dtf-result sc-premium-dtf-result--pass">
                  <div className="sc-premium-dtf-result__title">{tPremium("calculatedValueTitle")}</div>
                  <div className="sc-premium-dtf-result__value">{formattedPrimary}</div>
                  <div className="sc-premium-dtf-result__status">{tPremium("validStatus")}</div>
                  {breakdown && Object.keys(breakdown).length > 0 ? (
                    <div className="sc-premium-dtf-result__breakdown">
                      {Object.entries(breakdown).map(([key, value]) => (
                        <div key={key}>
                          <span>
                            {resolveGeneratedBreakdownLabel(
                              key,
                              schema.outputs.breakdown,
                              locale,
                            )}
                          </span>
                          <span>
                            {typeof value === "number"
                              ? formatPremiumPrimaryValue(value, key, locale)
                              : String(value ?? "—")}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>
              ) : (
                <div className="sc-premium-dtf-result">
                  <div className="sc-premium-dtf-result__title">{t("clickToCompute")}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {modalOpen ? (
        <PremiumToolReportModal
          toolSlug={slug}
          locale={locale}
          routePath={routePath}
          userId={userId}
          inputSnapshot={inputSnapshot}
          resultSnapshot={resultSnapshot}
          onClose={onCloseReport}
        />
      ) : null}
    </>
  );
}
