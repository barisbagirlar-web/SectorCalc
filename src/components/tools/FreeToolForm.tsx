"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Controller, useForm, type FieldValues, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocale, useTranslations } from "next-intl";
import type { z } from "zod";
import { FreeToolReportModal } from "@/components/tools/FreeToolReportModal";
import { ToolOmniMetaSection } from "@/components/tools/ToolOmniMetaSection";
import { usePreferredUnitSystem } from "@/hooks/use-preferred-unit-system";
import { useGeneratedToolFieldDisplay } from "@/hooks/use-generated-tool-field-display";
import {
  getOrCreateFeedbackSessionId,
  submitToolFeedback,
} from "@/lib/feedback/feedback-service";
import { resolveGeneratedI18nText } from "@/lib/generated-tools/resolve-i18n-text";
import { resolvePrimaryOutputKey } from "@/lib/generated-tools/resolve-tool-display";
import { buildGeneratedInputGroups } from "@/lib/generated-tools/input-groups";
import {
  buildInitialSelectedUnits,
  convertGeneratedFormValues,
  getGeneratedInputUnitOptions,
  shouldShowGeneratedUnitSelector,
} from "@/lib/generated-tools/unit-conversion";
import { handleNumericInputChange } from "@/lib/input/numeric-input";
import { useUserSubscription } from "@/lib/billing/use-user-subscription";
import type {
  GeneratedToolInput,
  GeneratedToolResult,
  GeneratedToolSchema,
} from "@/lib/generated-tools/types";
import type { FeedbackSnapshotValue } from "@/lib/feedback/types";

export type FreeToolFormProps = {
  readonly slug: string;
  readonly schema: GeneratedToolSchema;
  readonly zodSchema: z.ZodTypeAny;
  readonly toolTitle: string;
  readonly primaryOutputKey: string;
  readonly onSubmit: (values: Record<string, unknown>) => void;
  readonly result: GeneratedToolResult | null;
  readonly loading?: boolean;
  readonly disabled?: boolean;
};

function buildDefaultValues(
  schema: GeneratedToolSchema,
  zodSchema: z.ZodTypeAny,
): FieldValues {
  const parsed = zodSchema.safeParse({});
  if (parsed.success) {
    return parsed.data as Record<string, unknown>;
  }

  const fallback: FieldValues = {};
  for (const input of schema.inputs) {
    if (input.default !== undefined) {
      fallback[input.id] = input.default;
    } else if (input.type === "boolean") {
      fallback[input.id] = false;
    } else if (input.type === "select" && input.options?.[0]) {
      fallback[input.id] = input.options[0];
    } else {
      fallback[input.id] = "";
    }
  }
  return fallback;
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

function buildResultFeedbackSnapshot(
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

function resolvePrimaryNumericValue(
  result: GeneratedToolResult,
  primaryOutputKey: string,
): number | null {
  const candidates = [result[primaryOutputKey], result.totalWasteCost, result.dataConfidenceAdjusted];
  for (const candidate of candidates) {
    if (typeof candidate === "number" && Number.isFinite(candidate)) {
      return candidate;
    }
  }
  return null;
}

function formatFreePrimaryValue(
  value: number,
  locale: string,
  primaryOutputKey: string,
  unitHint?: string,
): string {
  const normalizedUnit = unitHint?.trim().toLowerCase() ?? "";
  const normalizedKey = primaryOutputKey.toLowerCase();
  const isPercentLike =
    normalizedUnit.includes("%") ||
    normalizedUnit.includes("percent") ||
    normalizedKey.includes("margin") ||
    normalizedKey.includes("rate") ||
    normalizedKey.includes("percent") ||
    normalizedKey.includes("ratio");

  if (isPercentLike && value >= -1000 && value <= 1000) {
    const asFraction = Math.abs(value) > 1 ? value / 100 : value;
    return new Intl.NumberFormat(locale, {
      style: "percent",
      maximumFractionDigits: 1,
    }).format(asFraction);
  }

  if (
    normalizedUnit.includes("usd") ||
    normalizedUnit.includes("try") ||
    normalizedUnit.includes("eur") ||
    normalizedUnit.includes("$")
  ) {
    const currency = normalizedUnit.includes("try")
      ? "TRY"
      : normalizedUnit.includes("eur")
        ? "EUR"
        : "USD";
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(value);
  }

  return new Intl.NumberFormat(locale, {
    maximumFractionDigits: Math.abs(value) >= 1000 ? 0 : 2,
  }).format(value);
}

type FreeToolFormFieldProps = {
  readonly slug: string;
  readonly input: GeneratedToolInput;
  readonly control: ReturnType<typeof useForm<Record<string, unknown>>>["control"];
  readonly errors: ReturnType<typeof useForm<Record<string, unknown>>>["formState"]["errors"];
  readonly selectedUnit?: string;
  readonly onUnitChange?: (unit: string) => void;
  readonly resolveInputLabel: (input: GeneratedToolInput) => string;
};

function FreeToolFormField({
  slug,
  input,
  control,
  errors,
  selectedUnit,
  onUnitChange,
  resolveInputLabel,
  enterValuePlaceholder,
}: FreeToolFormFieldProps & { readonly enterValuePlaceholder: string }) {
  const locale = useLocale();
  const unitSystem = usePreferredUnitSystem();
  const display = useGeneratedToolFieldDisplay(slug, input);
  const inputId = `free-${slug}-${input.id}`;
  const errorId = `${inputId}-error`;
  const fieldError = errors[input.id];
  const errorMessage = fieldError?.message ? String(fieldError.message) : undefined;
  const showUnitSelector = shouldShowGeneratedUnitSelector(input);
  const unitOptions = showUnitSelector
    ? getGeneratedInputUnitOptions(input, locale, unitSystem)
    : [];
  const showStaticUnit = Boolean(input.unit) && !showUnitSelector;

  if (input.type === "boolean") {
    return (
      <Controller
        name={input.id}
        control={control}
        render={({ field }) => (
          <div className="sc-premium-dtf-input-row">
            <div className="sc-premium-dtf-input-label">
              <div className="sc-premium-dtf-input-title">{resolveInputLabel(input)}</div>
              {display.helper ? (
                <div className="sc-premium-dtf-input-desc">{display.helper}</div>
              ) : null}
            </div>
            <label className="sc-premium-dtf-boolean-row" htmlFor={inputId}>
              <input
                id={inputId}
                type="checkbox"
                checked={Boolean(field.value)}
                onChange={(event) => field.onChange(event.target.checked)}
                onBlur={field.onBlur}
                aria-invalid={Boolean(errorMessage)}
                aria-describedby={errorMessage ? errorId : undefined}
              />
              <span>{resolveInputLabel(input)}</span>
            </label>
            {errorMessage ? (
              <p id={errorId} className="sc-premium-dtf-field-error" role="alert">
                {errorMessage}
              </p>
            ) : null}
          </div>
        )}
      />
    );
  }

  if (input.type === "select" && input.options) {
    return (
      <Controller
        name={input.id}
        control={control}
        render={({ field }) => (
          <div className="sc-premium-dtf-input-row">
            <div className="sc-premium-dtf-input-label">
              <div className="sc-premium-dtf-input-title">{resolveInputLabel(input)}</div>
              {display.helper ? (
                <div className="sc-premium-dtf-input-desc">{display.helper}</div>
              ) : null}
            </div>
            <div className="sc-premium-dtf-input-control">
              <select
                id={inputId}
                value={String(field.value ?? "")}
                onChange={(event) => field.onChange(event.target.value)}
                onBlur={field.onBlur}
                aria-invalid={Boolean(errorMessage)}
                aria-describedby={errorMessage ? errorId : undefined}
                className="sc-premium-dtf-touch-select"
              >
                {(input.options ?? []).map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </div>
            {errorMessage ? (
              <p id={errorId} className="sc-premium-dtf-field-error" role="alert">
                {errorMessage}
              </p>
            ) : null}
          </div>
        )}
      />
    );
  }

  return (
    <Controller
      name={input.id}
      control={control}
      render={({ field }) => (
        <div className="sc-premium-dtf-input-row">
          <div className="sc-premium-dtf-input-label">
            <div className="sc-premium-dtf-input-title">
              {resolveInputLabel(input)}
              {showStaticUnit ? (
                <span className="ml-1 text-[0.75rem] font-normal text-body-charcoal">
                  ({input.unit})
                </span>
              ) : null}
            </div>
            {display.helper ? (
              <div className="sc-premium-dtf-input-desc">{display.helper}</div>
            ) : null}
          </div>
          <div className="sc-premium-dtf-input-control">
            <input
              id={inputId}
              type="text"
              inputMode="decimal"
              autoComplete="off"
              value={field.value === undefined || field.value === null ? "" : String(field.value)}
              onChange={(event) => {
                const { numeric } = handleNumericInputChange(event.target.value);
                field.onChange(numeric);
              }}
              onBlur={field.onBlur}
              aria-invalid={Boolean(errorMessage)}
              aria-describedby={errorMessage ? errorId : undefined}
              className="sc-premium-dtf-touch-input"
              placeholder={enterValuePlaceholder}
            />
            {showUnitSelector && unitOptions.length > 0 ? (
              <select
                id={`${inputId}-unit`}
                value={selectedUnit ?? input.unit}
                onChange={(event) => onUnitChange?.(event.target.value)}
                className="sc-premium-dtf-unit-select"
                aria-label={`${resolveInputLabel(input)} unit`}
              >
                {unitOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ) : showStaticUnit ? null : null}
          </div>
          {errorMessage ? (
            <p id={errorId} className="sc-premium-dtf-field-error" role="alert">
              {errorMessage}
            </p>
          ) : null}
        </div>
      )}
    />
  );
}

export function FreeToolForm({
  slug,
  schema,
  zodSchema,
  toolTitle,
  primaryOutputKey,
  onSubmit,
  result,
  loading = false,
  disabled = false,
}: FreeToolFormProps) {
  const locale = useLocale();
  const unitSystem = usePreferredUnitSystem();
  const t = useTranslations("generatedTool");
  const tFree = useTranslations("generatedTool.freeForm");
  const tGroups = useTranslations("generatedTool.inputGroups");
  const { user } = useUserSubscription();

  const [selectedUnits, setSelectedUnits] = useState<Record<string, string>>({});
  const [vote, setVote] = useState<"up" | "down" | null>(null);
  const [voteNotice, setVoteNotice] = useState<string | null>(null);
  const [reportModalOpen, setReportModalOpen] = useState(false);

  const defaultValues = useMemo(
    () => buildDefaultValues(schema, zodSchema),
    [schema, zodSchema],
  );

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Record<string, unknown>>({
    resolver: zodResolver(zodSchema as never),
    defaultValues,
    mode: "onBlur",
  });

  const formValues = watch() as Record<string, unknown>;
  const groups = useMemo(() => buildGeneratedInputGroups(schema.inputs), [schema.inputs]);
  const inputById = useMemo(() => {
    const map = new Map<string, GeneratedToolInput>();
    for (const input of schema.inputs) {
      map.set(input.id, input);
    }
    return map;
  }, [schema.inputs]);

  const routePath = `/tools/generated/${slug}`;

  const resolveInputLabel = useCallback(
    (input: GeneratedToolInput) =>
      resolveGeneratedI18nText(input.label_i18n, locale, input.label),
    [locale],
  );

  const resolveGroupTitle = useCallback(
    (groupId: string): string => {
      if (tGroups.has(groupId)) {
        return tGroups(groupId);
      }
      return tGroups("general");
    },
    [tGroups],
  );

  useEffect(() => {
    setSelectedUnits(buildInitialSelectedUnits(schema.inputs, locale, unitSystem));
  }, [schema.inputs, locale, unitSystem]);

  const handleUnitChange = (inputId: string, unit: string) => {
    setSelectedUnits((current) => ({ ...current, [inputId]: unit }));
  };

  const handleFormSubmit: SubmitHandler<FieldValues> = (values) => {
    const converted = convertGeneratedFormValues(
      schema.inputs,
      values as Record<string, unknown>,
      selectedUnits,
    );
    onSubmit(converted);
    setVote(null);
    setVoteNotice(null);
  };

  const handleVote = async (type: "up" | "down") => {
    setVote(type);
    setVoteNotice(null);

    const message =
      type === "up"
        ? "Quick operator vote: calculation result appears correct."
        : "Quick operator vote: calculation result appears incorrect.";

    const feedbackResult = await submitToolFeedback({
      kind: type === "up" ? "other" : "wrong_result",
      message,
      toolSlug: slug,
      toolType: "free",
      locale,
      routePath,
      source: "free_tool",
      inputSnapshot: buildFeedbackSnapshot(formValues),
      resultSnapshot: buildResultFeedbackSnapshot(result),
      userId: user?.uid ?? null,
      userEmail: user?.email ?? null,
      sessionId: getOrCreateFeedbackSessionId(),
    });

    if (feedbackResult.ok) {
      setVoteNotice(tFree("voteThanks"));
    }
  };

  const resolvedPrimaryKey = resolvePrimaryOutputKey(schema);
  const primaryOutputLabel =
    schema.outputs.breakdown[resolvedPrimaryKey]?.trim() ||
    resolvedPrimaryKey.replace(/_/g, " ");
  const primaryValue = result ? resolvePrimaryNumericValue(result, primaryOutputKey) : null;
  const primaryUnitHint = typeof schema.outputs.primary === "string" ? schema.outputs.primary : "";
  const formattedPrimary =
    primaryValue !== null
      ? formatFreePrimaryValue(primaryValue, locale, primaryOutputKey, primaryUnitHint)
      : null;
  const breakdown = result?.breakdown ?? null;
  const inputSnapshot = buildFeedbackSnapshot(formValues);
  const resultSnapshot = buildResultFeedbackSnapshot(result);

  return (
    <>
      <div
        className="sc-premium-dtf-container"
        data-testid="free-tool-form"
        data-tool-slug={slug}
      >
        <ToolOmniMetaSection toolTitle={toolTitle} />

        <div className="sc-premium-dtf-card">
          <header className="sc-premium-dtf-header">
            <span className="sc-premium-dtf-header__accent" aria-hidden="true" />
            <div>
              <h2 className="sc-premium-dtf-header__title">{toolTitle}</h2>
              <p className="sc-premium-dtf-header__subtitle">
                {primaryOutputLabel || tFree("defaultDescription")}
              </p>
            </div>
          </header>

          <div className="sc-premium-dtf-columns">
            <div className="sc-premium-dtf-input-panel">
              <form onSubmit={handleSubmit(handleFormSubmit)} className="sc-premium-dtf-input-grid" noValidate>
                {groups.map((group) => (
                  <section key={group.id} aria-labelledby={`${slug}-free-group-${group.id}`}>
                    {groups.length > 1 ? (
                      <h3
                        id={`${slug}-free-group-${group.id}`}
                        className="mb-2 text-xs font-semibold uppercase tracking-wide text-body-charcoal"
                      >
                        {resolveGroupTitle(group.id)}
                      </h3>
                    ) : null}
                    <div className="space-y-3">
                      {group.inputIds.map((inputId) => {
                        const input = inputById.get(inputId);
                        if (!input) {
                          return null;
                        }
                        return (
                          <FreeToolFormField
                            key={input.id}
                            slug={slug}
                            input={input}
                            control={control}
                            errors={errors}
                            selectedUnit={selectedUnits[input.id]}
                            onUnitChange={(unit) => handleUnitChange(input.id, unit)}
                            resolveInputLabel={resolveInputLabel}
                            enterValuePlaceholder={tFree("enterValue")}
                          />
                        );
                      })}
                    </div>
                  </section>
                ))}

                <button
                  type="submit"
                  disabled={disabled || loading}
                  className="sc-premium-dtf-btn-calculate"
                >
                  {loading ? t("calculating") : t("calculate")}
                </button>
              </form>
            </div>

            <div className="sc-premium-dtf-result-panel sc-premium-dtf-feedback-area">
              {result && formattedPrimary !== null ? (
                <div className="sc-premium-dtf-result sc-premium-dtf-result--pass">
                  <div className="sc-premium-dtf-result__title">{tFree("resultLabel")}</div>
                  <div className="sc-premium-dtf-result__value">{formattedPrimary}</div>
                  {breakdown && Object.keys(breakdown).length > 0 ? (
                    <div className="sc-premium-dtf-result__breakdown">
                      {Object.entries(breakdown).map(([key, value]) => {
                        if (typeof value !== "number" || !Number.isFinite(value)) {
                          return null;
                        }
                        const label = schema.outputs.breakdown[key] ?? key.replace(/_/g, " ");
                        return (
                          <div key={key}>
                            <span>{label}</span>
                            <span>
                              {new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(value)}
                            </span>
                          </div>
                        );
                      })}
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
                    onClick={() => void handleVote("up")}
                    className={[
                      "sc-premium-dtf-btn-vote",
                      vote === "up" ? "sc-premium-dtf-btn-vote--active-up" : "",
                    ].join(" ")}
                  >
                    {tFree("voteYes")}
                  </button>
                  <button
                    type="button"
                    onClick={() => void handleVote("down")}
                    className={[
                      "sc-premium-dtf-btn-vote",
                      vote === "down" ? "sc-premium-dtf-btn-vote--active-down" : "",
                    ].join(" ")}
                  >
                    {tFree("voteNo")}
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => setReportModalOpen(true)}
                  className="sc-premium-dtf-btn-report"
                >
                  {tFree("reportIssue")}
                </button>
              </div>

              {voteNotice ? (
                <p className="sc-premium-dtf-notice" role="status">
                  {voteNotice}
                </p>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      {reportModalOpen ? (
        <FreeToolReportModal
          toolSlug={slug}
          locale={locale}
          routePath={routePath}
          userId={user?.uid ?? null}
          inputSnapshot={inputSnapshot}
          resultSnapshot={resultSnapshot}
          onClose={() => setReportModalOpen(false)}
        />
      ) : null}
    </>
  );
}
