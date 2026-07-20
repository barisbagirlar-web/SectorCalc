"use client";

import React, { useCallback, useState } from "react";
import Big from "big.js";
import Link from "@/lib/ui-shared/navigation/next-link";
import NextActionPDCA from "@/components/calculators/NextActionPDCA";
import type { LeanMetricHubSlug } from "@/lib/features/tools/lean-metric-hubs";

interface InputDef {
  key: string;
  label: string;
  type: "number" | "percentage";
  placeholder: string;
  defaultValue: string;
  lowerBound: number;
  upperBound: number;
}

interface MetricCalcDef {
  inputs: InputDef[];
  unit: string;
  metricName: string;
  defaultTarget: number;
  compute: (values: Record<string, number>) => { result: number; isOptimal: boolean };
}

export const LEAN_HUB_METRIC_CALC: Record<LeanMetricHubSlug, MetricCalcDef> = {
  "takt-time": {
    inputs: [
      { key: "availableTime", label: "Available Production Time (min/day)", type: "number", placeholder: "480", defaultValue: "480", lowerBound: 0.001, upperBound: 1440 },
      { key: "customerDemand", label: "Customer Demand (units/day)", type: "number", placeholder: "240", defaultValue: "240", lowerBound: 1, upperBound: 1_000_000 },
    ],
    unit: "min/unit",
    metricName: "Takt Time",
    defaultTarget: 2.0,
    compute: (v) => {
      const result = Number(new Big(v.availableTime).div(new Big(v.customerDemand)));
      return { result, isOptimal: result <= 2.0 };
    },
  },
  oee: {
    inputs: [
      { key: "availability", label: "Availability (%)", type: "percentage", placeholder: "90", defaultValue: "90", lowerBound: 0, upperBound: 100 },
      { key: "performance", label: "Performance (%)", type: "percentage", placeholder: "95", defaultValue: "95", lowerBound: 0, upperBound: 100 },
      { key: "quality", label: "Quality (%)", type: "percentage", placeholder: "99", defaultValue: "99", lowerBound: 0, upperBound: 100 },
    ],
    unit: "%",
    metricName: "OEE",
    defaultTarget: 85,
    compute: (v) => {
      const result = Number(
        new Big(v.availability).times(new Big(v.performance)).times(new Big(v.quality)).div(new Big(10000)),
      );
      return { result, isOptimal: result >= 85 };
    },
  },
  "scrap-rate": {
    inputs: [
      { key: "scrapUnits", label: "Scrap Units", type: "number", placeholder: "150", defaultValue: "150", lowerBound: 0, upperBound: 1_000_000_000 },
      { key: "totalUnits", label: "Total Units Produced", type: "number", placeholder: "10000", defaultValue: "10000", lowerBound: 1, upperBound: 1_000_000_000 },
    ],
    unit: "%",
    metricName: "Scrap Rate",
    defaultTarget: 5,
    compute: (v) => {
      const result = Number(new Big(v.scrapUnits).div(new Big(v.totalUnits)).times(new Big(100)));
      return { result, isOptimal: result <= 5 };
    },
  },
  "cycle-time": {
    inputs: [
      { key: "totalTime", label: "Total Production Time (min/shift)", type: "number", placeholder: "480", defaultValue: "480", lowerBound: 0.001, upperBound: 10080 },
      { key: "unitsProduced", label: "Units Produced", type: "number", placeholder: "200", defaultValue: "200", lowerBound: 1, upperBound: 1_000_000 },
    ],
    unit: "min/unit",
    metricName: "Cycle Time",
    defaultTarget: 5,
    compute: (v) => {
      const result = Number(new Big(v.totalTime).div(new Big(v.unitsProduced)));
      return { result, isOptimal: result <= 5 };
    },
  },
  "capacity-utilization": {
    inputs: [
      { key: "actualOutput", label: "Actual Output (units/shift)", type: "number", placeholder: "180", defaultValue: "180", lowerBound: 0, upperBound: 1_000_000_000 },
      { key: "maxOutput", label: "Maximum Possible Output (units/shift)", type: "number", placeholder: "240", defaultValue: "240", lowerBound: 1, upperBound: 1_000_000_000 },
    ],
    unit: "%",
    metricName: "Capacity Utilization",
    defaultTarget: 75,
    compute: (v) => {
      const result = Number(new Big(v.actualOutput).div(new Big(v.maxOutput)).times(new Big(100)));
      return { result, isOptimal: result >= 75 && result <= 90 };
    },
  },
};

export interface LeanMetricCalculatorPanelProps {
  slug: LeanMetricHubSlug;
  freeToolPath?: string | null;
  freeToolLabel?: string | null;
}

export function LeanMetricCalculatorPanel({
  slug,
  freeToolPath,
  freeToolLabel,
}: LeanMetricCalculatorPanelProps) {
  const calcDef = LEAN_HUB_METRIC_CALC[slug];
  const initialValues: Record<string, string> = {};
  for (const inp of calcDef.inputs) {
    initialValues[inp.key] = inp.defaultValue;
  }

  const [values, setValues] = useState<Record<string, string>>(initialValues);
  const [result, setResult] = useState<number | null>(null);
  const [isOptimal, setIsOptimal] = useState<boolean | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>("");

  const handleChange = useCallback((key: string, raw: string) => {
    setValues((prev) => ({ ...prev, [key]: raw }));
    setResult(null);
    setErrorMsg("");
  }, []);

  const handleCalculate = useCallback(() => {
    setErrorMsg("");
    const numeric: Record<string, number> = {};
    for (const inp of calcDef.inputs) {
      const v = parseFloat(values[inp.key]);
      if (!isFinite(v) || v < 0) {
        setErrorMsg(`Invalid value for "${inp.label}". Enter a non-negative number.`);
        return;
      }
      if (v < inp.lowerBound || v > inp.upperBound) {
        setErrorMsg(`"${inp.label}" must be between ${inp.lowerBound} and ${inp.upperBound}.`);
        return;
      }
      numeric[inp.key] = v;
    }
    if (slug === "scrap-rate" && numeric.scrapUnits > numeric.totalUnits) {
      setErrorMsg("Scrap units cannot exceed total units produced.");
      return;
    }
    if (slug === "capacity-utilization" && numeric.actualOutput > numeric.maxOutput) {
      setErrorMsg("Actual output cannot exceed maximum output for the declared standard.");
      return;
    }
    if ((slug === "takt-time" || slug === "cycle-time") && Object.values(numeric).some((n) => n <= 0)) {
      setErrorMsg("All inputs must be greater than zero.");
      return;
    }
    try {
      const output = calcDef.compute(numeric);
      if (!isFinite(output.result)) {
        setErrorMsg("Calculation returned a non-finite result. Check inputs.");
        return;
      }
      setResult(output.result);
      setIsOptimal(output.isOptimal);
    } catch {
      setErrorMsg("Calculation error. Check your inputs and try again.");
    }
  }, [values, calcDef, slug]);

  const handleReset = useCallback(() => {
    setValues(initialValues);
    setResult(null);
    setIsOptimal(null);
    setErrorMsg("");
  }, [initialValues]);

  return (
    <div className="bg-[var(--sc-surface-strong)] border border-[var(--sc-border)] p-6 shadow-sm rounded-sm">
      <div className="bg-[var(--sc-surface)] border border-[var(--sc-border)] p-5" data-testid="structured-inputs">
        <h2 className="text-sm font-bold text-[var(--sc-text)] uppercase tracking-wide mb-4">
          Structured Inputs
        </h2>
        <div className="space-y-4">
          {calcDef.inputs.map((inp) => (
            <div key={inp.key} className="flex flex-col gap-1">
              <label
                htmlFor={`lean-hub-input-${slug}-${inp.key}`}
                className="text-xs font-semibold text-[var(--sc-muted)] uppercase tracking-wide"
              >
                {inp.label}
              </label>
              <input
                id={`lean-hub-input-${slug}-${inp.key}`}
                type="number"
                min="0"
                max={inp.type === "percentage" ? "100" : undefined}
                step="any"
                value={values[inp.key]}
                onChange={(e) => handleChange(inp.key, e.target.value)}
                className="w-full border border-[var(--sc-border)] bg-[var(--sc-surface-strong)] px-3 py-2 text-sm text-[var(--sc-text)] focus-visible min-h-[44px]"
                placeholder={inp.placeholder}
              />
            </div>
          ))}
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleCalculate}
            className="inline-flex items-center justify-center min-h-[48px] px-6 text-sm font-semibold !text-white bg-[var(--sc-accent)] hover:opacity-90 focus-visible"
            data-testid="lean-hub-calculate"
          >
            Calculate
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center justify-center min-h-[48px] px-4 text-sm font-medium text-[var(--sc-muted)] hover:text-[var(--sc-text)] focus-visible"
          >
            Reset
          </button>
          {freeToolPath && freeToolLabel ? (
            <Link
              href={freeToolPath}
              className="inline-flex items-center justify-center min-h-[48px] px-4 text-sm font-semibold uppercase tracking-wider border border-[var(--sc-border)] text-[var(--sc-text)] hover:bg-[var(--sc-surface)] focus-visible"
            >
              {freeToolLabel}
            </Link>
          ) : null}
        </div>

        {errorMsg ? (
          <div className="mt-3 border-l-4 border-[var(--sc-warning)] bg-[var(--sc-surface)] p-3 text-sm text-[var(--sc-text)]">
            {errorMsg}
          </div>
        ) : null}
      </div>

      {result !== null && isOptimal !== null ? (
        <div className="mt-6" data-testid="immediate-result">
          <div
            className={`p-4 border-l-4 ${
              isOptimal ? "border-green-700 bg-[var(--sc-surface)]" : "border-[var(--sc-accent)] bg-[var(--sc-surface)]"
            }`}
          >
            <p className="text-xs uppercase tracking-widest text-[var(--sc-muted)] font-semibold">Immediate Result</p>
            <p className="text-2xl font-bold text-[var(--sc-text)] mt-1 font-mono">
              {result.toFixed(2)}
              <span className="text-base font-normal text-[var(--sc-muted)] ml-1">{calcDef.unit}</span>
            </p>
            <span
              className={`inline-flex mt-2 items-center px-3 py-1 text-xs font-semibold uppercase border border-[var(--sc-border)] ${
                isOptimal ? "text-green-800" : "text-[var(--sc-accent)]"
              }`}
            >
              {isOptimal ? "Optimal" : "Needs Action"}
            </span>
          </div>

          <NextActionPDCA
            metricName={calcDef.metricName}
            result={result}
            unit={calcDef.unit}
            isOptimal={isOptimal}
            conceptSlug="pdca"
          />
        </div>
      ) : null}
    </div>
  );
}
