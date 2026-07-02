// @ts-nocheck
"use client";
/* eslint-disable */
// @ts-nocheck


import { useMemo, type FormEvent, type ReactNode } from "react";
import { useLocale } from "@/lib/i18n-stub";
import { SmartExpertPanel } from "@/components/smart-form/SmartExpertPanel";
import { SmartFormFieldsRenderer } from "@/components/smart-form/SmartFormFieldsRenderer";
import { SmartFormShell } from "@/components/smart-form/SmartFormShell";
import { SmartResultPanel } from "@/components/smart-form/SmartResultPanel";
import {
  buildSmartFormForTool,
  type SmartFormExistingInputConfig,
} from "@/lib/features/smart-form/smart-form-adapter";
import { ToolGuidanceLayout } from "@/components/guidance/ToolGuidanceLayout";
import { buildGuidanceFieldsFromInputConfig } from "@/lib/content/guidance/build-guidance-fields";
import { UsageAgreementNotice } from "@/components/disclaimer/UsageAgreementNotice";
import { ResultLayerTabs } from "@/components/results/ResultLayerTabs";
import type { SmartFormResult, SmartFormTier } from "@/lib/features/smart-form/types";

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

  const combinedSections = useMemo(() => {
    if (!adapter.ok) return [];
    if (tier === "free") {
      return [...adapter.simpleSections, ...adapter.expertSections];
    }
    return adapter.simpleSections;
  }, [adapter, tier]);

  const formContent = useAdapter ? (
    <form
      onSubmit={onSubmit}
      className="sc-form-shell sc-ledger-cetele-form space-y-4"
      noValidate
      data-smart-form-adapter="true"
      data-calculation-form="true"
    >
      <SmartFormFieldsRenderer
        sections={combinedSections}
        values={values}
        errors={errors}
        onChange={onChange!}
        collapsible={false}
      />
      {tier === "premium" && adapter.expertSections.length > 0 ? (
        <SmartExpertPanel>
          <SmartFormFieldsRenderer
            sections={adapter.expertSections}
            values={values}
            errors={errors}
            onChange={onChange!}
            collapsible
          />
        </SmartExpertPanel>
      ) : null}
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

  const expertContent = tier === "premium" && useAdapter ? (
    <SmartExpertPanel>
      <SmartFormFieldsRenderer
        sections={adapter.ok ? adapter.expertSections : []}
        values={values}
        errors={errors}
        onChange={onChange!}
      />
    </SmartExpertPanel>
  ) : undefined;

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
      expertContent={expertContent}
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
