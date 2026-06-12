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

/**
 * Balanced calculator workspace — equal-height columns for field technicians.
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
      <div className="sc-calc-workspace sc-calc-workspace--split min-w-0">
        <section className="sc-calc-workspace__col sc-calc-workspace__col--inputs min-w-0">
          <div className="sc-calc-workspace__panel min-w-0">{inputs}</div>
        </section>
        <section className="sc-calc-workspace__col sc-calc-workspace__col--output min-w-0">
          <div className="sc-calc-workspace__panel min-w-0">{splitOutput ?? output}</div>
        </section>
      </div>
    );
  }

  return (
    <div className="sc-calc-workspace sc-calc-workspace--triple min-w-0">
      <section className="sc-calc-workspace__col sc-calc-workspace__col--inputs min-w-0">
        <div className="sc-calc-workspace__panel min-w-0">{inputs}</div>
      </section>
      <section className="sc-calc-workspace__col sc-calc-workspace__col--decision min-w-0">
        <div className="sc-calc-workspace__panel min-w-0">{decision}</div>
      </section>
      <section className="sc-calc-workspace__col sc-calc-workspace__col--output min-w-0">
        <div className="sc-calc-workspace__panel min-w-0">{output}</div>
      </section>
    </div>
  );
}
