"use client";

import type { Control, FieldErrors } from "react-hook-form";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { PremiumDynamicToolFormField } from "@/components/tools/PremiumDynamicToolFormField";
import { PremiumToolReportModal } from "@/components/tools/PremiumToolReportModal";
import type {
  GeneratedToolInput,
  GeneratedToolResult,
  GeneratedToolSchema,
} from "@/lib/generated-tools/types";
import type { FeedbackSnapshotValue } from "@/lib/feedback/types";

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
  readonly vote: "up" | "down" | null;
  readonly onVote: (type: "up" | "down") => void;
  readonly voteNotice: string | null;
  readonly modalOpen: boolean;
  readonly onOpenReport: () => void;
  readonly onCloseReport: () => void;
  readonly userId?: string | null;
  readonly onCalculate: () => void;
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

function formatPremiumPrimaryValue(value: number, locale: string): string {
  if (value >= 0 && value <= 1) {
    return new Intl.NumberFormat(locale, {
      style: "percent",
      maximumFractionDigits: 1,
    }).format(value);
  }

  if (Math.abs(value) >= 1000) {
    return new Intl.NumberFormat(locale, {
      maximumFractionDigits: 0,
    }).format(value);
  }

  return new Intl.NumberFormat(locale, {
    maximumFractionDigits: 2,
  }).format(value);
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
  vote,
  onVote,
  voteNotice,
  modalOpen,
  onOpenReport,
  onCloseReport,
  userId,
  onCalculate,
}: PremiumDynamicToolFormLayoutProps) {
  const t = useTranslations("generatedTool");
  const tPremium = useTranslations("generatedTool.premiumForm");

  const primaryValue = result ? resolvePrimaryNumericValue(result, primaryOutputKey) : null;
  const formattedPrimary =
    primaryValue !== null ? formatPremiumPrimaryValue(primaryValue, locale) : "—";

  const breakdown = result?.breakdown;
  const inputSnapshot = buildFeedbackSnapshot(formValues);
  const resultSnapshot = buildResultSnapshot(result);

  return (
    <>
      <div className="sc-premium-dtf-workspace">
        <div className="sc-premium-dtf-panel">
          <div className="sc-premium-dtf-panel__header">
            <div className="sc-premium-dtf-panel__accent" aria-hidden="true" />
            {toolTitle || schema.toolName}
          </div>
          <div className="sc-premium-dtf-panel__body">
            <div className="sc-premium-dtf-input-grid">
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
                />
              ))}
            </div>
          </div>
        </div>

        <div className="sc-premium-dtf-panel">
          <div className="sc-premium-dtf-panel__header">{tPremium("analysisStatusTitle")}</div>
          <div className="sc-premium-dtf-panel__body sc-premium-dtf-feedback-area">
            {result ? (
              <div className="sc-premium-dtf-result sc-premium-dtf-result--pass">
                <div className="sc-premium-dtf-result__title">{tPremium("calculatedValueTitle")}</div>
                <div className="sc-premium-dtf-result__value">{formattedPrimary}</div>
                <div className="sc-premium-dtf-result__status">{tPremium("validStatus")}</div>
                {breakdown && Object.keys(breakdown).length > 0 ? (
                  <div className="sc-premium-dtf-result__breakdown">
                    {Object.entries(breakdown).map(([key, value]) => (
                      <div key={key}>
                        {schema.outputs.breakdown[key] ?? key.replace(/_/g, " ")}:{" "}
                        {typeof value === "number"
                          ? formatPremiumPrimaryValue(value, locale)
                          : String(value ?? "—")}
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

            <div className="sc-premium-dtf-operator-bar">
              <div className="sc-premium-dtf-vote-group">
                <button
                  type="button"
                  onClick={() => onVote("up")}
                  className={[
                    "sc-premium-dtf-btn-vote",
                    vote === "up" ? "sc-premium-dtf-btn-vote--active-up" : "",
                  ].join(" ")}
                >
                  {tPremium("voteCorrect")}
                </button>
                <button
                  type="button"
                  onClick={() => onVote("down")}
                  className={[
                    "sc-premium-dtf-btn-vote",
                    vote === "down" ? "sc-premium-dtf-btn-vote--active-down" : "",
                  ].join(" ")}
                >
                  {tPremium("voteIncorrect")}
                </button>
              </div>
              <button type="button" onClick={onOpenReport} className="sc-premium-dtf-btn-report">
                {tPremium("reportIssue")}
              </button>
            </div>

            {voteNotice ? (
              <p className="text-xs text-emerald-300" role="status">
                {voteNotice}
              </p>
            ) : null}

            {creditGateError ? (
              <p className="text-sm text-red-300" role="alert">
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
