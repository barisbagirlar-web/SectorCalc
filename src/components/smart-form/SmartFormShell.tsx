"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import type { SmartFormTier, SmartFormViewMode } from "@/lib/smart-form/types";

export type SmartFormShellProps = {
  readonly title: string;
  readonly description?: string;
  readonly tier: SmartFormTier;
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

const TIER_LABEL: Record<SmartFormTier, string> = {
  free: "Free pre-check",
  premium: "Premium analyzer",
};

const VIEW_TABS: readonly { id: SmartFormViewMode; label: string }[] = [
  { id: "simple", label: "Simple" },
  { id: "expert", label: "Expert" },
  { id: "trust", label: "Trust trace" },
];

export function SmartFormShell({
  title,
  description,
  tier,
  viewMode: controlledViewMode,
  onViewModeChange,
  fallback = false,
  formContent,
  expertContent,
  resultContent,
  trustTraceContent,
  onSubmit,
  calculateLabel = "Run analysis",
  isCalculating = false,
  showSubmit = false,
}: SmartFormShellProps) {
  const [internalView, setInternalView] = useState<SmartFormViewMode>("simple");
  const viewMode = controlledViewMode ?? internalView;

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
        <form onSubmit={onSubmit} noValidate className="mt-4">
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
            {TIER_LABEL[tier]}
          </span>
          {fallback ? (
            <span className="rounded-sm border border-border-subtle px-2 py-1 text-[11px] text-text-secondary">
              Legacy form fallback
            </span>
          ) : (
            <span className="rounded-sm border border-safe-green/40 px-2 py-1 text-[11px] text-safe-green">
              Smart form metadata
            </span>
          )}
        </div>
        <h2 className="mt-3 text-lg font-bold text-text-primary">{title}</h2>
        {description ? (
          <p className="mt-1 text-sm leading-relaxed text-text-secondary">{description}</p>
        ) : null}
        <div className="mt-4 flex flex-wrap gap-2">
          {VIEW_TABS.map((tab) => (
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
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      <div className="sc-smart-form-layout">
        <div className="sc-smart-form-panel min-w-0">{formBody}</div>
        {viewMode !== "trust" && resultContent ? (
          <div className="sc-smart-form-output min-w-0">{resultContent}</div>
        ) : null}
      </div>
    </div>
  );
}
