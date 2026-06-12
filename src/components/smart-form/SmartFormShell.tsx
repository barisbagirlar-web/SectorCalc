"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import { CalculationWorkspace } from "@/components/smart-form/CalculationWorkspace";
import type { SmartFormTier, SmartFormViewMode } from "@/lib/smart-form/types";

export type SmartFormShellLayout = "split" | "workspace";

export type SmartFormShellProps = {
  readonly title: string;
  readonly description?: string;
  readonly tier: SmartFormTier;
  /** split = form | output columns; workspace = full-width balanced grid below header */
  readonly layout?: SmartFormShellLayout;
  readonly viewMode?: SmartFormViewMode;
  readonly onViewModeChange?: (mode: SmartFormViewMode) => void;
  readonly fallback?: boolean;
  readonly formContent: ReactNode;
  readonly expertContent?: ReactNode;
  readonly resultContent?: ReactNode;
  readonly trustTraceContent?: ReactNode;
  readonly onSubmit?: (event: FormEvent<HTMLFormElement>) => void;
  readonly calculateLabel?: string;
  readonly isCalculating?: boolean;
  readonly showSubmit?: boolean;
};

const TIER_LABEL_KEY: Record<SmartFormTier, "preCheck" | "premiumAnalyzer"> = {
  free: "preCheck",
  premium: "premiumAnalyzer",
};

const VIEW_TAB_KEYS: readonly {
  id: SmartFormViewMode;
  key: "simple" | "expert" | "calculationSummary";
}[] = [
  { id: "simple", key: "simple" },
  { id: "expert", key: "expert" },
  { id: "trust", key: "calculationSummary" },
];

export function SmartFormShell({
  title,
  description,
  tier,
  layout = "split",
  viewMode: controlledViewMode,
  onViewModeChange,
  fallback = false,
  formContent,
  expertContent,
  resultContent,
  trustTraceContent,
  onSubmit,
  calculateLabel,
  isCalculating = false,
  showSubmit = false,
}: SmartFormShellProps) {
  const t = useTranslations("freeToolUi");
  const [internalView, setInternalView] = useState<SmartFormViewMode>("simple");
  const viewMode = controlledViewMode ?? internalView;
  const submitLabel = calculateLabel ?? t("runAnalysis");

  const setViewMode = (mode: SmartFormViewMode) => {
    if (onViewModeChange) {
      onViewModeChange(mode);
      return;
    }
    setInternalView(mode);
  };

  const formBody = (
    <>
      {viewMode === "simple" ? formContent : null}
      {viewMode === "expert" ? (expertContent ?? formContent) : null}
      {viewMode === "trust" ? trustTraceContent ?? resultContent : null}
      {showSubmit && onSubmit ? (
        <form onSubmit={onSubmit} noValidate className="mt-4" data-calculation-form="true">
          <div className="sc-industrial-form-actions">
            <button
              type="submit"
              disabled={isCalculating}
              className="sc-cta-primary min-h-[48px] disabled:opacity-60"
            >
              {isCalculating ? t("calculating") : submitLabel}
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
      <header className="rounded-sm border border-border-subtle bg-off-white p-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-sm bg-navy px-2 py-1 text-[11px] font-semibold uppercase tracking-wider text-white">
            {t(TIER_LABEL_KEY[tier])}
          </span>
          {fallback ? (
            <span className="rounded-sm border border-border-subtle px-2 py-1 text-[11px] text-text-secondary">
              {t("classicForm")}
            </span>
          ) : (
            <span className="rounded-sm border border-safe-green/40 px-2 py-1 text-[11px] text-safe-green">
              {t("smartFormMeta")}
            </span>
          )}
        </div>
        <h2 className="mt-3 text-lg font-bold text-text-primary">{title}</h2>
        {description ? (
          <p className="mt-1 text-sm leading-relaxed text-text-secondary">{description}</p>
        ) : null}
        <div className="mt-4 flex flex-wrap gap-2">
          {VIEW_TAB_KEYS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setViewMode(tab.id)}
              className={`min-h-[44px] rounded-sm px-3 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy ${
                viewMode === tab.id
                  ? "bg-navy text-white"
                  : "border border-border-subtle bg-white text-body-charcoal"
              }`}
              aria-pressed={viewMode === tab.id}
            >
              {t(tab.key)}
            </button>
          ))}
        </div>
      </header>

      {layout === "workspace" ? (
        <div className="sc-smart-form-workspace min-w-0">{formBody}</div>
      ) : viewMode !== "trust" && resultContent ? (
        <CalculationWorkspace
          variant="split"
          inputs={formBody}
          decision={null}
          output={resultContent}
        />
      ) : (
        <div className="sc-smart-form-layout sc-smart-form-layout--single">
          <div className="sc-smart-form-panel min-w-0">{formBody}</div>
        </div>
      )}
    </div>
  );
}
