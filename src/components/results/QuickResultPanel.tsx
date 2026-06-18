"use client";

import type { ReactNode } from "react";

type QuickResultPanelProps = {
  readonly headline?: string;
  readonly unitLabel?: string;
  readonly summary?: string;
  readonly warning?: string;
  readonly children?: ReactNode;
};

export function QuickResultPanel({
  headline,
  unitLabel,
  summary,
  warning,
  children,
}: QuickResultPanelProps) {
  return (
    <section className="space-y-3" data-quick-result-panel="true">
      {headline ? (
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Result</p>
          <p className="text-2xl font-semibold text-slate-900">{headline}</p>
          {unitLabel ? <p className="text-sm font-medium text-slate-600">Unit: {unitLabel}</p> : null}
        </div>
      ) : null}
      {summary ? <p className="text-sm leading-relaxed text-slate-700">{summary}</p> : null}
      {warning ? (
        <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs leading-relaxed text-amber-900">
          {warning}
        </p>
      ) : null}
      {children}
    </section>
  );
}
