"use client";

import type { ReactNode } from "react";

export type SmartExpertPanelProps = {
  readonly title?: string;
  readonly description?: string;
  readonly children: ReactNode;
  readonly sensitivityPlaceholder?: string;
  readonly scenarioPlaceholder?: string;
};

export function SmartExpertPanel({
  title = "Expert view",
  description = "Advanced parameters, scenario hooks and sensitivity controls.",
  children,
  sensitivityPlaceholder = "Sensitivity sweep will appear when this contract exposes deterministic scenario fixtures.",
  scenarioPlaceholder = "Scenario comparison will appear when contract scenario specs are wired to UI.",
}: SmartExpertPanelProps) {
  return (
    <details className="rounded-sm border border-dashed border-border-subtle bg-off-white p-4">
      <summary className="cursor-pointer text-sm font-semibold text-text-primary">
        {title}
      </summary>
      <p className="mt-2 text-xs leading-relaxed text-text-secondary">{description}</p>
      <div className="mt-4 space-y-4">{children}</div>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <div className="rounded-sm border border-border-subtle bg-white p-3 text-xs text-text-secondary">
          <p className="font-semibold text-text-primary">Scenario</p>
          <p className="mt-1">{scenarioPlaceholder}</p>
        </div>
        <div className="rounded-sm border border-border-subtle bg-white p-3 text-xs text-text-secondary">
          <p className="font-semibold text-text-primary">Sensitivity</p>
          <p className="mt-1">{sensitivityPlaceholder}</p>
        </div>
      </div>
    </details>
  );
}
