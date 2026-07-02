"use client";

import type { ReactNode } from "react";

export type CalculationWorkspaceProps = {
  readonly inputs: ReactNode;
  readonly decision: ReactNode;
  readonly output: ReactNode;
  /** two columns: inputs | output (decision merged into output column when omitted) */
  readonly variant?: "triple" | "split";
  readonly splitOutput?: ReactNode;
};

const panelClassName =
  "sc-calc-workspace__panel min-w-0 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6 lg:p-8";

/**
 * Balanced calculator workspace - equal-height columns for field technicians.
 * triple: legacy three-column layout (deprecated for premium calculators)
 * split: inputs | result (free / revenue premium)
 */
export function CalculationWorkspace({
  inputs,
  decision,
  output,
  variant = "triple",
  splitOutput,
}: CalculationWorkspaceProps) {
  if (variant === "split") {
    return (
      <div className="sc-calc-workspace sc-calc-workspace--split grid min-w-0 gap-6 lg:grid-cols-2 xl:grid-cols-[minmax(0,1.05fr)_minmax(360px,0.95fr)]">
        <section className="sc-calc-workspace__col sc-calc-workspace__col--inputs min-w-0">
          <div className={panelClassName}>{inputs}</div>
        </section>
        <section className="sc-calc-workspace__col sc-calc-workspace__col--output min-w-0">
          <div className={panelClassName}>{splitOutput ?? output}</div>
        </section>
      </div>
    );
  }

  return (
    <div className="sc-calc-workspace sc-calc-workspace--triple grid min-w-0 gap-6 lg:grid-cols-3">
      <section className="sc-calc-workspace__col sc-calc-workspace__col--inputs min-w-0">
        <div className={panelClassName}>{inputs}</div>
      </section>
      <section className="sc-calc-workspace__col sc-calc-workspace__col--decision min-w-0">
        <div className={panelClassName}>{decision}</div>
      </section>
      <section className="sc-calc-workspace__col sc-calc-workspace__col--output min-w-0">
        <div className={panelClassName}>{output}</div>
      </section>
    </div>
  );
}
