"use client";

import type { ReactNode } from "react";

type DeepTracePanelProps = {
  readonly title?: string;
  readonly children: ReactNode;
};

export function DeepTracePanel({ title = "Detailed trace", children }: DeepTracePanelProps) {
  return (
    <section className="space-y-3 rounded-xl border border-slate-200 bg-white p-4" data-deep-trace-panel="true">
      <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
      <div className="space-y-3 text-sm text-slate-700">{children}</div>
    </section>
  );
}
