"use client";

import type { FormEvent, ReactNode } from "react";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { CalculationWorkspace } from "@/components/smart-form/CalculationWorkspace";
import type { CalculatorExperienceContract, CalculatorExperienceMode } from "@/lib/calculator-experience/calculator-experience-types";
import type { SmartFormTier, SmartFormViewMode } from "@/lib/smart-form/types";

export type SmartFormShellLayout = "split" | "workspace";

export type SmartFormShellProps = {
  readonly title: string;
  readonly description?: string;
  readonly tier: SmartFormTier;
  readonly layout?: SmartFormShellLayout;
  readonly experience?: CalculatorExperienceContract;
  readonly mode?: CalculatorExperienceMode;
  readonly onModeChange?: (mode: CalculatorExperienceMode) => void;
  readonly fallback?: boolean;
  readonly formContent: ReactNode;
  readonly expertContent?: ReactNode;
  readonly resultContent?: ReactNode;
  readonly onSubmit?: (event: FormEvent<HTMLFormElement>) => void;
  readonly calculateLabel?: string;
  readonly isCalculating?: boolean;
  readonly showSubmit?: boolean;
  readonly hasCalculated?: boolean;
};

const TIER_LABEL_KEY: Record<SmartFormTier, "preCheck" | "premiumAnalyzer"> = {
  free: "preCheck",
  premium: "premiumAnalyzer",
};

export function SmartFormShell({
  title,
  description,
  tier,
  layout = "split",
  experience,
  mode: controlledMode,
  onModeChange,
  fallback = false,
  formContent,
  expertContent,
  resultContent,
  onSubmit,
  calculateLabel,
  isCalculating = false,
  showSubmit = false,
  hasCalculated = false,
}: SmartFormShellProps) {
  const tUi = useTranslations("freeToolUi");
  const tCalc = useTranslations("calculator");
  const [internalMode, setInternalMode] = useState<CalculatorExperienceMode>("quick");
  const mode = controlledMode ?? internalMode;
  const submitLabel = calculateLabel ?? tUi("runAnalysis");
  const hasExpertMode = experience?.hasExpertMode ?? Boolean(expertContent);
  const showModeSwitch = hasExpertMode;

  const setMode = (nextMode: CalculatorExperienceMode) => {
    if (onModeChange) {
      onModeChange(nextMode);
      return;
    }
    setInternalMode(nextMode);
  };

  const activeFormContent =
    showModeSwitch && mode === "expert" ? (expertContent ?? formContent) : formContent;

  const formBody = (
    <>
      {activeFormContent}
      {showSubmit && onSubmit ? (
        <form onSubmit={onSubmit} noValidate className="mt-4" data-calculation-form="true">
          <div className="sc-industrial-form-actions">
            <button
              type="submit"
              disabled={isCalculating}
              className="sc-cta-primary min-h-[48px] disabled:opacity-60"
            >
              {isCalculating ? tUi("calculating") : submitLabel}
            </button>
          </div>
        </form>
      ) : null}
    </>
  );

  return (
    <div
      className="sc-smart-form-shell min-w-0"
      data-smart-form-shell="true"
      data-smart-form-tier={tier}
      data-smart-form-fallback={fallback ? "true" : "false"}
    >
      <header className="mb-4 min-w-0 border-b border-slate-200 pb-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-sm bg-navy px-2 py-1 text-[11px] font-semibold uppercase tracking-wider text-white">
            {tUi(TIER_LABEL_KEY[tier])}
          </span>
          {!fallback ? (
            <span className="rounded-sm border border-safe-green/40 px-2 py-1 text-[11px] text-safe-green">
              {tUi("smartFormMeta")}
            </span>
          ) : null}
        </div>
        <h2 className="mt-2 text-base font-semibold text-slate-900 sm:text-lg">{title}</h2>
        {description ? (
          <p className="mt-1 text-sm leading-relaxed text-slate-600">{description}</p>
        ) : null}
        {showModeSwitch ? (
          <div className="sc-mode-switch mt-4" role="tablist" aria-label={tCalc("mode.label")}>
            <button
              type="button"
              onClick={() => setMode("quick")}
              className={mode === "quick" ? "is-active" : ""}
              aria-selected={mode === "quick"}
            >
              {tCalc("mode.quick")}
            </button>
            <button
              type="button"
              onClick={() => setMode("expert")}
              className={mode === "expert" ? "is-active" : ""}
              aria-selected={mode === "expert"}
            >
              {tCalc("mode.expert")}
            </button>
          </div>
        ) : null}
      </header>

      {layout === "workspace" ? (
        <div className="sc-smart-form-workspace min-w-0">{formBody}</div>
      ) : (
        <CalculationWorkspace
          variant="split"
          inputs={formBody}
          decision={null}
          output={
            hasCalculated && resultContent ? (
              resultContent
            ) : (
              <p className="sc-empty-state">{tCalc("emptyState.enterValues")}</p>
            )
          }
        />
      )}
    </div>
  );
}

/** @deprecated Use CalculatorExperienceMode quick/expert only */
export type LegacySmartFormViewMode = SmartFormViewMode;
