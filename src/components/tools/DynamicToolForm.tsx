"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm, type FieldValues, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocale, useTranslations } from "next-intl";
import type { z } from "zod";
import { Link } from "@/i18n/routing";
import { DynamicToolFormField } from "@/components/tools/DynamicToolFormField";
import { BreakdownWasteDetailModal } from "@/components/tools/BreakdownWasteDetailModal";
import { EnhancedBreakdownChart } from "@/components/tools/EnhancedBreakdownChart";
import { ScenarioComparison } from "@/components/tools/ScenarioComparison";
import { MachineRateSelector } from "@/components/tools/MachineRateSelector";
import { usePreferredUnitSystem } from "@/hooks/use-preferred-unit-system";
import { useSubscription } from "@/hooks/useSubscription";
import { buildGeneratedInputGroups } from "@/lib/generated-tools/input-groups";
import { resolveGeneratedI18nText } from "@/lib/generated-tools/resolve-i18n-text";
import {
  buildInitialSelectedUnits,
  convertGeneratedFormValues,
} from "@/lib/generated-tools/unit-conversion";
import {
  buildMachineInputMapping,
  hasMachineRateMappableInputs,
} from "@/lib/machine-rate/input-mapping";
import type { BreakdownChartItem } from "@/lib/chart-helpers/breakdown-chart-data";
import { resolveRelatedInputsForBreakdownKey } from "@/lib/chart-helpers/resolve-waste-related-inputs";
import type {
  GeneratedToolBreakdown,
  GeneratedToolInput,
  GeneratedToolResult,
  GeneratedToolSchema,
} from "@/lib/generated-tools/types";

export type DynamicToolScenarioComparisonConfig = {
  readonly calculateFn: (values: Record<string, unknown>) => GeneratedToolResult;
  readonly primaryOutputKey: string;
  readonly enabled?: boolean;
};

export type DynamicToolFormProps = {
  readonly slug: string;
  readonly schema: GeneratedToolSchema;
  readonly zodSchema: z.ZodTypeAny;
  readonly calculateLabel?: string;
  readonly onSubmit: (values: Record<string, unknown>) => void;
  readonly disabled?: boolean;
  readonly loading?: boolean;
  readonly scenarioComparison?: DynamicToolScenarioComparisonConfig;
  readonly breakdown?: GeneratedToolBreakdown | null;
  readonly breakdownInputs?: Record<string, unknown>;
  readonly breakdownLabelMap?: Readonly<Record<string, string>>;
  readonly breakdownCurrency?: string;
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

export function DynamicToolForm({
  slug,
  schema,
  zodSchema,
  calculateLabel,
  onSubmit,
  disabled = false,
  loading = false,
  scenarioComparison,
  breakdown = null,
  breakdownInputs,
  breakdownLabelMap,
  breakdownCurrency = "TRY",
}: DynamicToolFormProps) {
  const locale = useLocale();
  const unitSystem = usePreferredUnitSystem();
  const t = useTranslations("generatedTool");
  const tScenario = useTranslations("generatedTool.scenarioComparison");
  const tMachineRate = useTranslations("generatedTool.machineRateSelector");
  const tGroups = useTranslations("generatedTool.inputGroups");
  const { isPro, loading: subscriptionLoading } = useSubscription();
  const [selectedUnits, setSelectedUnits] = useState<Record<string, string>>({});
  const [machineRateApplied, setMachineRateApplied] = useState(false);
  const [selectedBreakdownItem, setSelectedBreakdownItem] = useState<BreakdownChartItem | null>(
    null,
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
      labels[input.id] = resolveGeneratedI18nText(input.label_i18n, locale, input.label);
    }
    return labels;
  }, [locale, schema.inputs]);

  const formValues = useMemo(
    () => watchedValues as Record<string, unknown>,
    [watchedValues],
  );

  const breakdownFormValues = breakdownInputs ?? formValues;

  const resolveInputLabel = useCallback(
    (input: GeneratedToolInput) =>
      resolveGeneratedI18nText(input.label_i18n, locale, input.label),
    [locale],
  );

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
      return scenarioComparison.calculateFn(converted);
    },
    [scenarioComparison, schema.inputs, selectedUnits],
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
  };

  const resolveGroupTitle = (groupId: string): string => {
    if (tGroups.has(groupId)) {
      return tGroups(groupId);
    }
    return tGroups("general");
  };

  const submitLabel = loading
    ? t("calculating")
    : (calculateLabel ?? t("calculate"));

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="space-y-6"
      noValidate
      data-calculation-form="true"
      data-testid="dynamic-tool-form"
      data-tool-slug={slug}
    >
      {showMachineRateSelector ? (
        isPro ? (
          <section className="rounded-xl border border-technical-gray bg-white p-4 shadow-sm sm:p-5">
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
          <section className="rounded-xl border border-technical-gray bg-white p-4 shadow-sm sm:p-5">
            <h3 className="text-lg font-semibold text-premium-velvet">{tMachineRate("label")}</h3>
            <p className="mt-2 text-sm text-body-charcoal">
              {tMachineRate("lockedMessage")}{" "}
              <Link href="/pricing" className="font-semibold text-premium-copper hover:underline">
                {tMachineRate("unlockCta")}
              </Link>
            </p>
          </section>
        )
      ) : null}

      {groups.map((group) => (
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
      ))}

      <div className="sc-industrial-form-actions">
        <button
          type="submit"
          disabled={disabled || loading}
          className="sc-ledger-cta-primary sc-cta-primary min-h-[44px] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitLabel}
        </button>
      </div>

      {showScenarioComparison && scenarioComparison ? (
        isPro ? (
          <ScenarioComparison
            calculateFn={scenarioCalculateFn}
            currentInputs={formValues}
            inputLabels={inputLabels}
            numericInputIds={numericInputIds}
            primaryOutputKey={scenarioComparison.primaryOutputKey}
          />
        ) : (
          <section className="mt-8 rounded-xl border border-technical-gray bg-white p-4 shadow-sm sm:p-5">
            <h3 className="text-lg font-semibold text-premium-velvet">{tScenario("title")}</h3>
            <p className="mt-2 text-sm text-body-charcoal">
              {tScenario("lockedMessage")}{" "}
              <Link href="/pricing" className="font-semibold text-premium-copper hover:underline">
                {tScenario("unlockCta")}
              </Link>
            </p>
          </section>
        )
      ) : null}

      {hasBreakdown && breakdown ? (
        <EnhancedBreakdownChart
          breakdown={breakdown}
          labelMap={breakdownLabelMap ?? schema.outputs.breakdown}
          locale={locale}
          currency={breakdownCurrency}
          isPro={isPro}
          onItemClick={setSelectedBreakdownItem}
        />
      ) : null}

      {selectedBreakdownItem ? (
        <BreakdownWasteDetailModal
          item={selectedBreakdownItem}
          relatedInputs={relatedBreakdownInputs}
          onClose={() => setSelectedBreakdownItem(null)}
        />
      ) : null}
    </form>
  );
}
