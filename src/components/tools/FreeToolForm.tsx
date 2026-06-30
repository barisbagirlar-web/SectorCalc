"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Controller, useForm, type FieldValues, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocale, useTranslations } from "next-intl";
import type { z } from "zod";
import { FreeToolReportModal } from "@/components/tools/FreeToolReportModal";
import { PremiumUpsell } from "@/components/tools/PremiumUpsell";
import { ResultPanel } from "@/components/tools/ResultPanel";
import { ToolOmniMetaSection } from "@/components/tools/ToolOmniMetaSection";
import { usePreferredUnitSystem } from "@/hooks/use-preferred-unit-system";
import { useGeneratedToolFieldDisplay } from "@/hooks/use-generated-tool-field-display";
import { translateZodErrorMessage } from "@/lib/infrastructure/i18n/zod-error-translate";
import {
  getOrCreateFeedbackSessionId,
  submitToolFeedback,
} from "@/lib/features/feedback/feedback-service";
import { resolveToolDisplayChrome } from "@/lib/features/tools/resolve-tool-display-chrome";
import { resolveLocalizedGeneratedSelectOptions } from "@/lib/features/generated-tools/select-options";
import { buildGeneratedInputGroups } from "@/lib/features/generated-tools/input-groups";
import {
  buildInitialSelectedUnits,
  convertGeneratedFormValues,
  getGeneratedInputUnitOptions,
  shouldShowGeneratedUnitSelector,
} from "@/lib/features/generated-tools/unit-conversion";
import { handleNumericInputChange } from "@/lib/features/input/numeric-input";
import { useUserSubscription } from "@/lib/features/billing/use-user-subscription";
import type {
  GeneratedToolInput,
  GeneratedToolResult,
  GeneratedToolSchema,
} from "@/lib/features/generated-tools/types";
import type { FeedbackSnapshotValue } from "@/lib/features/feedback/types";

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

type NumericInputProps = {
  value: any;
  onChange: (val: number) => void;
  onBlur: () => void;
  inputId: string;
  enterValuePlaceholder: string;
  errorMessage: any;
  errorId: string;
};

function NumericInput({
  value,
  onChange,
  onBlur,
  inputId,
  enterValuePlaceholder,
  errorMessage,
  errorId,
}: NumericInputProps) {
  const [inputValue, setInputValue] = useState<string>(() => {
    return value === undefined || value === null ? "" : String(value);
  });

  useEffect(() => {
    const num = Number(inputValue);
    const isTypingDecimal = inputValue.endsWith(".") || inputValue.endsWith(",");
    if (value !== num && !isTypingDecimal && inputValue !== ".") {
      setInputValue(value === undefined || value === null ? "" : String(value));
    }
  }, [value]);

  return (
    <input
      id={inputId}
      type="text"
      inputMode="decimal"
      autoComplete="off"
      value={inputValue}
      onChange={(event) => {
        const { sanitized, numeric } = handleNumericInputChange(event.target.value);
        setInputValue(sanitized);
        onChange(numeric);
      }}
      onBlur={onBlur}
      aria-invalid={Boolean(errorMessage)}
      aria-describedby={errorMessage ? errorId : undefined}
      className="sc-premium-dtf-touch-input"
      placeholder={enterValuePlaceholder}
    />
  );
}

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

type FreeToolFormFieldProps = {
  readonly slug: string;
  readonly input: GeneratedToolInput;
  readonly control: ReturnType<typeof useForm<Record<string, unknown>>>["control"];
  readonly errors: ReturnType<typeof useForm<Record<string, unknown>>>["formState"]["errors"];
  readonly selectedUnit?: string;
  readonly onUnitChange?: (unit: string) => void;
  readonly enterValuePlaceholder: string;
};

function FreeToolFormField({
  slug,
  input,
  control,
  errors,
  selectedUnit,
  onUnitChange,
  enterValuePlaceholder,
}: FreeToolFormFieldProps) {
  const locale = useLocale();
  const tFree = useTranslations("generatedTool.freeForm");
  const unitSystem = usePreferredUnitSystem();
  const display = useGeneratedToolFieldDisplay(slug, input);
  const inputId = `free-${slug}-${input.id}`;
  const errorId = `${inputId}-error`;
  const fieldError = errors[input.id];
  const rawErrorMessage = fieldError?.message ? String(fieldError.message) : undefined;
  const errorMessage = rawErrorMessage ? translateZodErrorMessage(rawErrorMessage, locale) : undefined;
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
              <div className="sc-premium-dtf-input-title">{display.label}</div>
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
              <span>{display.label}</span>
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
    const selectOptions = resolveLocalizedGeneratedSelectOptions(input, locale);
    return (
      <Controller
        name={input.id}
        control={control}
        render={({ field }) => (
          <div className="sc-premium-dtf-input-row">
            <div className="sc-premium-dtf-input-label">
              <div className="sc-premium-dtf-input-title">{display.label}</div>
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
                {selectOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
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
              {display.label}
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
            <NumericInput
              inputId={inputId}
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              enterValuePlaceholder={enterValuePlaceholder}
              errorMessage={errorMessage}
              errorId={errorId}
            />
            {showUnitSelector && unitOptions.length > 0 ? (
              <select
                id={`${inputId}-unit`}
                value={selectedUnit ?? input.unit}
                onChange={(event) => onUnitChange?.(event.target.value)}
                className="sc-premium-dtf-unit-select"
                aria-label={tFree("unitSuffix", { label: display.label })}
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
  const [voteResetKey, setVoteResetKey] = useState(0);
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
  const displayChrome = useMemo(
    () => resolveToolDisplayChrome(slug, schema, locale),
    [locale, schema, slug],
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
    setVoteResetKey((current) => current + 1);
    setVoteNotice(null);
  };

  const handleVoteFeedback = async (type: "up" | "down") => {
    setVoteNotice(null);

    const message =
      type === "up"
        ? tFree("voteCorrectMessage")
        : tFree("voteIncorrectMessage");

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

  const inputSnapshot = buildFeedbackSnapshot(formValues);
  const resultSnapshot = buildResultFeedbackSnapshot(result);

  return (
    <>
      <div
        className="sc-premium-dtf-container"
        data-testid="free-tool-form"
        data-tool-slug={slug}
      >
        <ToolOmniMetaSection
          toolName={toolTitle}
          slug={slug}
          tier="free"
          summary={displayChrome.summary}
          keywordTags={displayChrome.keywordTags}
          icon={displayChrome.icon}
          voteResetKey={voteResetKey}
          onVoteFeedback={handleVoteFeedback}
          onFeedback={() => setReportModalOpen(true)}
          voteNotice={voteNotice}
        />

        <div className="sc-premium-dtf-card">
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

            <ResultPanel
              result={result}
              schema={schema}
              locale={locale}
              primaryOutputKey={primaryOutputKey}
              titleLabel={tFree("resultLabel")}
              emptyLabel={t("clickToCompute")}
              loading={loading}
            />
          </div>
        </div>
      </div>

      <PremiumUpsell />

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
