"use client";

import { useMemo, type FormEvent, type ReactNode } from "react";
import { useLocale } from "next-intl";
import { SmartFormFieldsRenderer } from "@/components/smart-form/SmartFormFieldsRenderer";
import { SmartFormShell } from "@/components/smart-form/SmartFormShell";
import { SmartResultPanel } from "@/components/smart-form/SmartResultPanel";
import {
  buildSmartFormForTool,
  type SmartFormExistingInputConfig,
} from "@/lib/smart-form/smart-form-adapter";
import { ToolGuidanceLayout } from "@/components/guidance/ToolGuidanceLayout";
import { buildGuidanceFieldsFromInputConfig } from "@/lib/guidance/build-guidance-fields";
import { UsageAgreementNotice } from "@/components/disclaimer/UsageAgreementNotice";
import { ResultLayerTabs } from "@/components/results/ResultLayerTabs";
import type { SmartFormResult, SmartFormSectionConfig, SmartFormTier } from "@/lib/smart-form/types";

function mergeSmartFormSections(
  simpleSections: readonly SmartFormSectionConfig[],
  expertSections: readonly SmartFormSectionConfig[],
): SmartFormSectionConfig[] {
  const seenKeys = new Set<string>();
  const merged: SmartFormSectionConfig[] = [];

  const absorb = (sections: readonly SmartFormSectionConfig[]) => {
    for (const section of sections) {
      const uniqueInputs = section.inputs.filter((input) => {
        if (seenKeys.has(input.key)) {
          return false;
        }
        seenKeys.add(input.key);
        return true;
      });
      if (uniqueInputs.length === 0) {
        continue;
      }

      const existingIndex = merged.findIndex((candidate) => candidate.id === section.id);
      if (existingIndex >= 0) {
        merged[existingIndex] = {
          ...merged[existingIndex],
          inputs: [...merged[existingIndex].inputs, ...uniqueInputs],
        };
      } else {
        merged.push({ ...section, inputs: uniqueInputs });
      }
    }
  };

  absorb(simpleSections);
  absorb(expertSections);
  return merged;
}

export type SmartFormWorkspaceProps = {
  readonly toolSlug: string;
  readonly tier: SmartFormTier;
  readonly title: string;
  readonly description?: string;
  readonly inputConfig?: SmartFormExistingInputConfig;
  readonly values?: Record<string, number | string>;
  readonly errors?: Readonly<Record<string, string>>;
  readonly onChange?: (key: string, value: number | string) => void;
  readonly onSubmit?: (event: FormEvent<HTMLFormElement>) => void;
  readonly calculateLabel?: string;
  readonly isCalculating?: boolean;
  readonly formFallback: ReactNode;
  readonly resultPanel: ReactNode;
  readonly trustTraceSlot?: ReactNode;
  readonly resultSummary?: SmartFormResult | null;
  readonly hasCalculated?: boolean;
  readonly forceFallback?: boolean;
  readonly nativeContractForm?: boolean;
  readonly toolCategory?: string;
  readonly toolSector?: string;
};

export function SmartFormWorkspace({
  toolSlug,
  tier,
  title,
  description,
  inputConfig,
  values = {},
  errors = {},
  onChange,
  onSubmit,
  calculateLabel = "Run calculation",
  isCalculating = false,
  formFallback,
  resultPanel,
  trustTraceSlot,
  resultSummary = null,
  hasCalculated = false,
  forceFallback = false,
  nativeContractForm = false,
  toolCategory,
  toolSector,
}: SmartFormWorkspaceProps) {
  const locale = useLocale();
  const adapter = useMemo(
    () => buildSmartFormForTool(toolSlug, inputConfig, locale),
    [toolSlug, inputConfig, locale],
  );

  const mergedSections = useMemo(() => {
    if (!adapter.ok) {
      return [];
    }
    return mergeSmartFormSections(adapter.simpleSections, adapter.expertSections);
  }, [adapter]);

  const useAdapter =
    !forceFallback &&
    !nativeContractForm &&
    adapter.ok &&
    Boolean(onChange) &&
    Boolean(onSubmit);

  const guidanceFields = useMemo(
    () => buildGuidanceFieldsFromInputConfig(inputConfig),
    [inputConfig],
  );

  const formContent = useAdapter ? (
    <form
      onSubmit={onSubmit}
      className="sc-form-shell sc-ledger-cetele-form space-y-4"
      noValidate
      data-smart-form-adapter="true"
      data-calculation-form="true"
      data-testid="tool-form"
    >
      <SmartFormFieldsRenderer
        sections={mergedSections}
        values={values}
        errors={errors}
        onChange={onChange!}
        collapsible={false}
      />
      <div className="sc-industrial-form-actions">
        <button
          type="submit"
          disabled={isCalculating}
          className="sc-cta-primary min-h-[48px] disabled:opacity-60"
        >
          {isCalculating ? "Calculating…" : calculateLabel}
        </button>
      </div>
    </form>
  ) : (
    formFallback
  );

  const guidedFormContent = (
    <ToolGuidanceLayout
      toolSlug={toolSlug}
      tier={tier}
      fields={guidanceFields}
      toolTitle={title}
      toolCategory={toolCategory}
      toolSector={toolSector}
    >
      <div className="flex min-w-0 flex-col gap-4">
        <div className="order-1 min-w-0 lg:order-2">{formContent}</div>
      </div>
    </ToolGuidanceLayout>
  );

  return (
    <SmartFormShell
      title={title}
      description={description ?? (adapter.ok ? adapter.decisionGoal : undefined)}
      tier={tier}
      fallback={!useAdapter}
      formContent={
        <div className="flex flex-col gap-4">
          <div className="order-2 min-w-0 lg:order-1">
            <UsageAgreementNotice
              toolSlug={toolSlug}
              tier={tier === "premium" ? "premium" : "free"}
              sector={toolSector}
              category={toolCategory}
            />
          </div>
          <div className="order-1 min-w-0 lg:order-2">{guidedFormContent}</div>
        </div>
      }
      hasCalculated={hasCalculated}
      resultContent={
        hasCalculated ? (
          <ResultLayerTabs
            quickContent={
              <SmartResultPanel
                result={resultSummary}
                calculationSteps={adapter.ok ? adapter.calculationSteps : []}
                trustTraceSlot={trustTraceSlot}
              >
                {resultPanel}
              </SmartResultPanel>
            }
            deepContent={trustTraceSlot ?? undefined}
          />
        ) : undefined
      }
    />
  );
}
