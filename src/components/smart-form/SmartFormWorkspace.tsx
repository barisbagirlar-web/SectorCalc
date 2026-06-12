"use client";

import { useMemo, type FormEvent, type ReactNode } from "react";
import { useLocale } from "next-intl";
import { SmartExpertPanel } from "@/components/smart-form/SmartExpertPanel";
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
import type { SmartFormResult, SmartFormTier } from "@/lib/smart-form/types";

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

  const formContent = useAdapter ? (
    <form
      onSubmit={onSubmit}
      className="sc-form-shell sc-ledger-cetele-form space-y-4"
      noValidate
      data-smart-form-adapter="true"
      data-calculation-form="true"
    >
      <SmartFormFieldsRenderer
        sections={adapter.simpleSections}
        values={values}
        errors={errors}
        onChange={onChange!}
        collapsible={false}
      />
      {adapter.expertSections.length > 0 ? (
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

  const expertContent = useAdapter ? (
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
      {formContent}
    </ToolGuidanceLayout>
  );

  return (
    <SmartFormShell
      title={title}
      description={description ?? (adapter.ok ? adapter.decisionGoal : undefined)}
      tier={tier}
      fallback={!useAdapter}
      formContent={
        <div className="space-y-4">
          <UsageAgreementNotice
            toolSlug={toolSlug}
            tier={tier === "premium" ? "premium" : "free"}
            sector={toolSector}
            category={toolCategory}
          />
          {guidedFormContent}
        </div>
      }
      expertContent={expertContent}
      resultContent={
        <ResultLayerTabs
          quickContent={
            <SmartResultPanel
              result={resultSummary}
              calculationSteps={adapter.ok ? adapter.calculationSteps : []}
              trustTraceSlot={undefined}
            >
              {resultPanel}
            </SmartResultPanel>
          }
          deepContent={trustTraceSlot ?? undefined}
        />
      }
      trustTraceContent={trustTraceSlot ?? resultPanel}
    />
  );
}
