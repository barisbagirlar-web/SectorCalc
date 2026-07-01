"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm, type FieldValues, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocale, useTranslations } from "next-intl";
import type { z } from "zod";
import { Link } from "@/i18n/routing";
import { DynamicToolFormField } from "@/components/tools/DynamicToolFormField";
import { FreeToolForm } from "@/components/tools/FreeToolForm";
import { PremiumDynamicToolFormLayout } from "@/components/tools/PremiumDynamicToolFormLayout";
import {
  getOrCreateFeedbackSessionId,
  submitToolFeedback,
} from "@/lib/features/feedback/feedback-service";
import { resolveGeneratedFieldDisplay } from "@/lib/infrastructure/i18n/generated-field-display";
import { useUserSubscription } from "@/lib/features/billing/use-user-subscription";
import { BreakdownWasteDetailModal } from "@/components/tools/BreakdownWasteDetailModal";
import { EnhancedBreakdownChart } from "@/components/tools/EnhancedBreakdownChart";
import { ScenarioComparison } from "@/components/tools/ScenarioComparison";
import { MachineRateSelector } from "@/components/tools/MachineRateSelector";
import { usePreferredUnitSystem } from "@/hooks/use-preferred-unit-system";
import { useCredits } from "@/hooks/useCredits";
import { useSubscription } from "@/hooks/useSubscription";
import { buildGeneratedInputGroups } from "@/lib/features/generated-tools/input-groups";
import { firstSelectOptionValue } from "@/lib/features/generated-tools/select-options";
import { withCalculationStandard } from "@/lib/features/generated-tools/standard-input";
import { resolvePrimaryOutputKey } from "@/lib/features/generated-tools/resolve-tool-display";
import {
  buildInitialSelectedUnits,
  convertGeneratedFormValues,
} from "@/lib/features/generated-tools/unit-conversion";
import {
  buildMachineInputMapping,
  hasMachineRateMappableInputs,
} from "@/lib/features/machine-rate/input-mapping";
import type { BreakdownChartItem } from "@/lib/ui-shared/chart-helpers/breakdown-chart-data";
import { resolveRelatedInputsForBreakdownKey } from "@/lib/ui-shared/chart-helpers/resolve-waste-related-inputs";
import type {
  GeneratedToolBreakdown,
  GeneratedToolInput,
  GeneratedToolResult,
  GeneratedToolSchema,
} from "@/lib/features/generated-tools/types";
import { evaluateSchemaTrust } from "@/lib/features/generated-tools/trust-gate";
import type { FeedbackSnapshotValue } from "@/lib/features/feedback/types";

export type DynamicToolScenarioComparisonConfig = {
  readonly calculateFn: (values: Record<string, unknown>) => GeneratedToolResult;
  readonly primaryOutputKey: string;
  readonly enabled?: boolean;
};

export type DynamicToolFormLayout = "auto" | "premium" | "standard";

export type DynamicToolFormProps = {
  readonly slug: string;
  readonly schema: GeneratedToolSchema;
  readonly zodSchema: z.ZodTypeAny;
  readonly calculateLabel?: string;
  readonly onSubmit: (values: Record<string, unknown>) => void;
  readonly disabled?: boolean;
  readonly loading?: boolean;
  readonly layout?: DynamicToolFormLayout;
  readonly toolTitle?: string;
  readonly primaryOutputKey?: string;
  readonly result?: GeneratedToolResult | null;
  readonly scenarioComparison?: DynamicToolScenarioComparisonConfig;
  readonly breakdown?: GeneratedToolBreakdown | null;
  readonly breakdownInputs?: Record<string, unknown>;
  readonly breakdownLabelMap?: Readonly<Record<string, string>>;
  readonly breakdownCurrency?: string;
  readonly lastUpdatedIso?: string | null;
};

function buildDefaultValues(
  schema: GeneratedToolSchema,
  zodSchema: z.ZodTypeAny,
): FieldValues {
  if (zodSchema && typeof zodSchema.safeParse === "function") {
    try {
      const parsed = zodSchema.safeParse({});
      if (parsed.success) {
        return parsed.data as Record<string, unknown>;
      }
    } catch (e) {
      console.warn("[DynamicToolForm] zodSchema.safeParse failed:", e);
    }
  }

  const fallback: FieldValues = {};
  for (const input of schema.inputs) {
    if (input.default !== undefined) {
      fallback[input.id] = input.default;
    } else if (input.type === "boolean") {
      fallback[input.id] = false;
    } else if (input.type === "select") {
      const firstOption = firstSelectOptionValue(input);
      fallback[input.id] = firstOption ?? "";
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
  result: GeneratedToolResult | null | undefined,
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

export function DynamicToolForm({
  slug,
  schema,
  zodSchema,
  calculateLabel,
  onSubmit,
  disabled = false,
  loading = false,
  layout = "auto",
  toolTitle,
  primaryOutputKey,
  result = null,
  scenarioComparison,
  breakdown = null,
  breakdownInputs,
  breakdownLabelMap,
  breakdownCurrency = "TRY",
  lastUpdatedIso = null,
}: DynamicToolFormProps) {
  const locale = useLocale();
  const unitSystem = usePreferredUnitSystem();
  const t = useTranslations("generatedTool");
  const tPremium = useTranslations("generatedTool.premiumForm");
  const tScenario = useTranslations("generatedTool.scenarioComparison");
  const tMachineRate = useTranslations("generatedTool.machineRateSelector");
  const tGroups = useTranslations("generatedTool.inputGroups");
  const { isPro, loading: subscriptionLoading } = useSubscription();
  const { user } = useUserSubscription();
  const { credits, loading: creditsLoading, spendCredits } = useCredits();
  const [selectedUnits, setSelectedUnits] = useState<Record<string, string>>({});
  const [machineRateApplied, setMachineRateApplied] = useState(false);
  const [creditGateError, setCreditGateError] = useState<string | null>(null);
  const [spendingCredits, setSpendingCredits] = useState(false);
  const [selectedBreakdownItem, setSelectedBreakdownItem] = useState<BreakdownChartItem | null>(
    null,
  );
  const [voteResetKey, setVoteResetKey] = useState(0);
  const [voteNotice, setVoteNotice] = useState<string | null>(null);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [selectedStandard, setSelectedStandard] = useState<string>(
    () => schema.standardOptions?.[0]?.id ?? "",
  );

  const defaultValues = useMemo(
    () => buildDefaultValues(schema, zodSchema),
    [schema, zodSchema],
  );

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<Record<string, unknown>>({
    // zod v4 schema types differ from @hookform/resolvers expectations
    resolver: zodResolver(zodSchema as never),
    defaultValues,
    mode: "onBlur",
  });

  const inputById = useMemo(() => {
    const map = new Map<string, GeneratedToolInput>();
    for (const input of schema.inputs) {
      map.set(input.id, input);
    }
    return map;
  }, [schema.inputs]);

  const groups = useMemo(() => buildGeneratedInputGroups(schema.inputs), [schema.inputs]);
  const watchedValues = watch();

  const numericInputIds = useMemo(
    () => schema.inputs.filter((input) => input.type === "number").map((input) => input.id),
    [schema.inputs],
  );

  const inputLabels = useMemo(() => {
    const labels: Record<string, string> = {};
    for (const input of schema.inputs) {
      labels[input.id] = resolveGeneratedFieldDisplay(slug, input, locale).label;
    }
    return labels;
  }, [locale, schema.inputs, slug]);

  const formValues = useMemo(
    () => watchedValues as Record<string, unknown>,
    [watchedValues],
  );

  const breakdownFormValues = breakdownInputs ?? formValues;

  const resolveInputLabel = useCallback(
    (input: GeneratedToolInput) => resolveGeneratedFieldDisplay(slug, input, locale).label,
    [locale, slug],
  );

  const resolveBusinessContext = useCallback(
    (input: GeneratedToolInput) =>
      resolveGeneratedFieldDisplay(slug, input, locale).helper ?? input.businessContext,
    [locale, slug],
  );

  const usePremiumLayout =
    layout === "premium" || (layout === "auto" && schema.premiumRequired);

  const useFreeLayout = layout === "auto" && !schema.premiumRequired;

  const useStandardLayout = layout === "standard";

  const resolvedPrimaryOutputKey = primaryOutputKey?.trim() || resolvePrimaryOutputKey(schema);

  const showValidResultBadge = useMemo(
    () => evaluateSchemaTrust(schema as unknown as Record<string, unknown>, slug).status === "PASS",
    [schema, slug],
  );

  const routePath = `/tools/generated/${slug}`;

  const relatedBreakdownInputs = useMemo(() => {
    if (!selectedBreakdownItem) {
      return [];
    }
    return resolveRelatedInputsForBreakdownKey(
      selectedBreakdownItem.key,
      schema.inputs,
      breakdownFormValues,
      resolveInputLabel,
    );
  }, [breakdownFormValues, resolveInputLabel, schema.inputs, selectedBreakdownItem]);

  const hasBreakdown =
    breakdown !== null && Object.keys(breakdown).length > 0;

  const scenarioCalculateFn = useCallback(
    (values: Record<string, unknown>) => {
      if (!scenarioComparison) {
        throw new Error("Scenario comparison is not configured.");
      }
      const converted = convertGeneratedFormValues(schema.inputs, values, selectedUnits);
      const standard = selectedStandard || schema.standardOptions?.[0]?.id;
      return scenarioComparison.calculateFn(withCalculationStandard(converted, standard));
    },
    [scenarioComparison, schema.inputs, schema.standardOptions, selectedStandard, selectedUnits],
  );

  const toolInputIds = useMemo(
    () => schema.inputs.map((input) => input.id),
    [schema.inputs],
  );

  const machineInputMapping = useMemo(
    () => buildMachineInputMapping(toolInputIds),
    [toolInputIds],
  );

  const showMachineRateSelector =
    hasMachineRateMappableInputs(toolInputIds) &&
    Object.keys(machineInputMapping).length > 0 &&
    !subscriptionLoading;

  const showScenarioComparison =
    Boolean(scenarioComparison?.enabled ?? true) &&
    Boolean(scenarioComparison?.calculateFn) &&
    numericInputIds.length > 0 &&
    !subscriptionLoading;

  const handleMachineSelect = (values: Record<string, number>) => {
    for (const [field, value] of Object.entries(values)) {
      setValue(field, value, { shouldDirty: true, shouldValidate: true });
    }
    setMachineRateApplied(true);
  };

  useEffect(() => {
    setSelectedUnits(buildInitialSelectedUnits(schema.inputs, locale, unitSystem));
  }, [schema.inputs, locale, unitSystem]);

  useEffect(() => {
    const nextDefault = schema.standardOptions?.[0]?.id ?? "";
    setSelectedStandard(nextDefault);
  }, [schema.standardOptions, slug]);

  const handleUnitChange = (inputId: string, unit: string) => {
    setSelectedUnits((current) => ({ ...current, [inputId]: unit }));
  };

  const handleFormSubmit: SubmitHandler<FieldValues> = async (values) => {
    setCreditGateError(null);

    if (schema.premiumRequired && !isPro) {
      if (creditsLoading) {
        setCreditGateError(t("creditsLoading"));
        return;
      }

      const balance = credits ?? 0;
      if (balance < 1) {
        setCreditGateError(t("insufficientCredits"));
        return;
      }

      setSpendingCredits(true);
      try {
        const spent = await spendCredits(1, slug);
        if (!spent) {
          setCreditGateError(t("insufficientCredits"));
          return;
        }
      } finally {
        setSpendingCredits(false);
      }
    }

    const converted = convertGeneratedFormValues(
      schema.inputs,
      values as Record<string, unknown>,
      selectedUnits,
    );
    const standard = selectedStandard || schema.standardOptions?.[0]?.id;
    onSubmit(withCalculationStandard(converted, standard));
    setVoteResetKey((current) => current + 1);
    setVoteNotice(null);
  };

  const handleVoteFeedback = async (type: "up" | "down") => {
    setVoteNotice(null);

    const message =
      type === "up"
        ? tPremium("voteCorrectMessage")
        : tPremium("voteIncorrectMessage");

    const feedbackResult = await submitToolFeedback({
      kind: type === "up" ? "other" : "wrong_result",
      message,
      toolSlug: slug,
      toolType: "premium",
      locale,
      routePath,
      source: "premium_tool",
      inputSnapshot: buildFeedbackSnapshot(formValues),
      resultSnapshot: buildResultFeedbackSnapshot(result),
      userId: user?.uid ?? null,
      userEmail: user?.email ?? null,
      sessionId: getOrCreateFeedbackSessionId(),
    });

    if (feedbackResult.ok) {
      setVoteNotice(tPremium("voteThanks"));
    }
  };

  const resolveGroupTitle = (groupId: string): string => {
    if (tGroups.has(groupId)) {
      return tGroups(groupId);
    }
    return tGroups("general");
  };

  const submitLabel =
    spendingCredits || loading
      ? t("calculating")
      : (calculateLabel ?? t("calculate"));

  const machineRateSection = showMachineRateSelector ? (
    isPro ? (
      <section className="rounded-xl border border-technical-gray bg-kil-surface p-4 shadow-sm sm:p-5">
        <MachineRateSelector
          onSelect={handleMachineSelect}
          currentValues={formValues}
          inputMapping={machineInputMapping}
        />
        {machineRateApplied ? (
          <p className="mt-2 text-xs font-medium text-emerald-700" role="status">
            {tMachineRate("applied")}
          </p>
        ) : null}
      </section>
    ) : (
      <section className="rounded-xl border border-technical-gray bg-kil-surface p-4 shadow-sm sm:p-5">
        <h3 className="text-lg font-semibold text-premium-velvet">{tMachineRate("label")}</h3>
        <p className="mt-2 text-sm text-body-charcoal">
          {tMachineRate("lockedMessage")}{" "}
          <Link href="/pricing" className="font-semibold text-premium-copper hover:underline">
            {tMachineRate("unlockCta")}
          </Link>
        </p>
      </section>
    )
  ) : null;

  const scenarioComparisonSection =
    showScenarioComparison && scenarioComparison ? (
      isPro ? (
        <ScenarioComparison
          calculateFn={scenarioCalculateFn}
          currentInputs={formValues}
          inputLabels={inputLabels}
          numericInputIds={numericInputIds}
          primaryOutputKey={scenarioComparison.primaryOutputKey}
        />
      ) : (
        <section className="mt-8 rounded-xl border border-technical-gray bg-kil-surface p-4 shadow-sm sm:p-5">
          <h3 className="text-lg font-semibold text-premium-velvet">{tScenario("title")}</h3>
          <p className="mt-2 text-sm text-body-charcoal">
            {tScenario("lockedMessage")}{" "}
            <Link href="/pricing" className="font-semibold text-premium-copper hover:underline">
              {tScenario("unlockCta")}
            </Link>
          </p>
        </section>
      )
    ) : null;

  const breakdownSection =
    hasBreakdown && breakdown ? (
      <EnhancedBreakdownChart
        breakdown={breakdown}
        labelMap={breakdownLabelMap ?? schema.outputs.breakdown}
        unitHints={schema.outputs.breakdownUnits}
        locale={locale}
        currency={breakdownCurrency}
        isPro={isPro}
        onItemClick={setSelectedBreakdownItem}
      />
    ) : null;

  const breakdownModal = selectedBreakdownItem ? (
    <BreakdownWasteDetailModal
      item={selectedBreakdownItem}
      relatedInputs={relatedBreakdownInputs}
      onClose={() => setSelectedBreakdownItem(null)}
    />
  ) : null;

  if (useFreeLayout) {
    return (
      <div
        className="space-y-6"
        data-calculation-form="true"
        data-testid="dynamic-tool-form"
        data-tool-slug={slug}
        data-tool-tier="free"
      >
        {machineRateSection}
        <FreeToolForm
          slug={slug}
          schema={schema}
        />
        {scenarioComparisonSection}
        {breakdownSection}
        {breakdownModal}
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="space-y-6"
      noValidate
      data-calculation-form="true"
      data-testid="dynamic-tool-form"
      data-tool-slug={slug}
      data-tool-tier={schema.premiumRequired ? "premium" : "standard"}
    >
      {machineRateSection}

      {usePremiumLayout ? (
        <PremiumDynamicToolFormLayout
          slug={slug}
          schema={schema}
          toolTitle={toolTitle ?? schema.toolName}
          locale={locale}
          routePath={routePath}
          control={control}
          errors={errors}
          inputs={schema.inputs}
          resolveInputLabel={resolveInputLabel}
          resolveBusinessContext={resolveBusinessContext}
          selectedUnits={selectedUnits}
          onUnitChange={handleUnitChange}
          result={result}
          primaryOutputKey={resolvedPrimaryOutputKey}
          formValues={formValues}
          submitLabel={submitLabel}
          creditGateError={creditGateError}
          disabled={disabled || spendingCredits || creditsLoading}
          loading={loading || spendingCredits}
          voteResetKey={voteResetKey}
          onVoteFeedback={handleVoteFeedback}
          voteNotice={voteNotice}
          modalOpen={reportModalOpen}
          onOpenReport={() => setReportModalOpen(true)}
          onCloseReport={() => setReportModalOpen(false)}
          userId={user?.uid ?? null}
          onCalculate={() => {
            void handleSubmit(handleFormSubmit)();
          }}
          selectedStandard={selectedStandard}
          onStandardChange={setSelectedStandard}
          showValidResultBadge={showValidResultBadge}
        />
      ) : null}

      {!usePremiumLayout && useStandardLayout
        ? groups.map((group) => (
        <section key={group.id} aria-labelledby={`${slug}-group-${group.id}`}>
          <h3
            id={`${slug}-group-${group.id}`}
            className="mb-3 text-sm font-semibold uppercase tracking-wide text-body-charcoal"
          >
            {resolveGroupTitle(group.id)}
          </h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {group.inputIds.map((inputId) => {
              const input = inputById.get(inputId);
              if (!input) {
                return null;
              }
              return (
                <DynamicToolFormField
                  key={input.id}
                  slug={slug}
                  input={input}
                  control={control}
                  errors={errors}
                  inputIdPrefix={`generated-${slug}`}
                  selectedUnit={selectedUnits[input.id]}
                  onUnitChange={(unit) => handleUnitChange(input.id, unit)}
                />
              );
            })}
          </div>
        </section>
      ))
        : null}

      {!usePremiumLayout && useStandardLayout ? (
        <div className="sc-industrial-form-actions">
          {creditGateError ? (
            <p className="mb-3 text-sm text-red-700" role="alert">
              {creditGateError}{" "}
              <Link href="/account/credits" className="font-semibold underline">
                {t("buyCreditsCta")}
              </Link>
            </p>
          ) : null}
          <button
            type="submit"
            disabled={disabled || loading || spendingCredits || creditsLoading}
            className="sc-ledger-cta-primary sc-cta-primary min-h-[44px] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitLabel}
          </button>
        </div>
      ) : null}

      {scenarioComparisonSection}

      {breakdownSection}

      {breakdownModal}
    </form>
  );
}