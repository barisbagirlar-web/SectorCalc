"use client";

import { useMemo, type FormEvent, type ReactNode } from "react";
import { SmartExpertPanel } from "@/components/smart-form/SmartExpertPanel";
import { SmartFormFieldsRenderer } from "@/components/smart-form/SmartFormFieldsRenderer";
import { SmartFormShell } from "@/components/smart-form/SmartFormShell";
import { SmartResultPanel } from "@/components/smart-form/SmartResultPanel";
import {
  buildSmartFormForTool,
  type SmartFormExistingInputConfig,
} from "@/lib/smart-form/smart-form-adapter";
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
  calculateLabel = "Run analysis",
  isCalculating = false,
  formFallback,
  resultPanel,
  trustTraceSlot,
  resultSummary = null,
  forceFallback = false,
  nativeContractForm = false,
}: SmartFormWorkspaceProps) {
  const adapter = useMemo(
    () => buildSmartFormForTool(toolSlug, inputConfig),
    [toolSlug, inputConfig],
  );

  const useAdapter =
    !forceFallback &&
    !nativeContractForm &&
    adapter.ok &&
    Boolean(onChange) &&
    Boolean(onSubmit);

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

  return (
    <SmartFormShell
      title={title}
      description={description ?? (adapter.ok ? adapter.decisionGoal : undefined)}
      tier={tier}
      fallback={!useAdapter}
      formContent={formContent}
      expertContent={expertContent}
      resultContent={
        <SmartResultPanel
          result={resultSummary}
          calculationSteps={adapter.ok ? adapter.calculationSteps : []}
          trustTraceSlot={trustTraceSlot}
        >
          {resultPanel}
        </SmartResultPanel>
      }
      trustTraceContent={trustTraceSlot ?? resultPanel}
    />
  );
}
