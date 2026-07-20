"use client";

import React, { useState, useCallback } from "react";
import Big from "big.js";
import NextActionPDCA from "@/components/calculators/NextActionPDCA";
import type { LeanCalcEntry } from "@/lib/features/tools/lean-calc-registry";

/* ---- Per-metric calculation engine ---- */

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
  defaultTarget: number;
  compute: (values: Record<string, number>) => { result: number; isOptimal: boolean };
}

const METRIC_CALC_MAP: Record<string, MetricCalcDef> = {
  "takt-time": {
    inputs: [
      { key: "availableTime", label: "Available Production Time (min/day)", type: "number", placeholder: "480", defaultValue: "480", lowerBound: 0.001, upperBound: 1440 },
      { key: "customerDemand", label: "Customer Demand (units/day)", type: "number", placeholder: "240", defaultValue: "240", lowerBound: 1, upperBound: 1000000 },
    ],
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
    defaultTarget: 85,
    compute: (v) => {
      const result = Number(new Big(v.availability).times(new Big(v.performance)).times(new Big(v.quality)).div(new Big(10000)));
      return { result, isOptimal: result >= 85 };
    },
  },
  "scrap-rate": {
    inputs: [
      { key: "scrapUnits", label: "Scrap Units", type: "number", placeholder: "150", defaultValue: "150", lowerBound: 0, upperBound: 1000000000 },
      { key: "totalUnits", label: "Total Units Produced", type: "number", placeholder: "10000", defaultValue: "10000", lowerBound: 1, upperBound: 1000000000 },
    ],
    defaultTarget: 5,
    compute: (v) => {
      const result = Number(new Big(v.scrapUnits).div(new Big(v.totalUnits)).times(new Big(100)));
      return { result, isOptimal: result <= 5 };
    },
  },
  "cycle-time": {
    inputs: [
      { key: "totalTime", label: "Total Production Time (min/shift)", type: "number", placeholder: "480", defaultValue: "480", lowerBound: 0.001, upperBound: 10080 },
      { key: "unitsProduced", label: "Units Produced", type: "number", placeholder: "200", defaultValue: "200", lowerBound: 1, upperBound: 1000000 },
    ],
    defaultTarget: 5,
    compute: (v) => {
      const result = Number(new Big(v.totalTime).div(new Big(v.unitsProduced)));
      return { result, isOptimal: result <= 5 };
    },
  },
  "capacity-utilization": {
    inputs: [
      { key: "actualOutput", label: "Actual Output (units/shift)", type: "number", placeholder: "180", defaultValue: "180", lowerBound: 0, upperBound: 1000000000 },
      { key: "maxOutput", label: "Maximum Possible Output (units/shift)", type: "number", placeholder: "240", defaultValue: "240", lowerBound: 1, upperBound: 1000000000 },
    ],
    defaultTarget: 75,
    compute: (v) => {
      const result = Number(new Big(v.actualOutput).div(new Big(v.maxOutput)).times(new Big(100)));
      return { result, isOptimal: result >= 75 };
    },
  },
};

/* ---- Component ---- */

export interface LeanCalculatorClientProps {
  entry: LeanCalcEntry;
}

export default function LeanCalculatorClient({ entry }: LeanCalculatorClientProps) {
  const calcDef = METRIC_CALC_MAP[entry.metric.slug];
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
        setErrorMsg(`Invalid value for "${inp.label}". Enter a positive number.`);
        return;
      }
      numeric[inp.key] = v;
    }
    try {
      const output = calcDef.compute(numeric);
      if (!isFinite(output.result)) {
        setErrorMsg("Calculation returned non-finite result. Check inputs.");
        return;
      }
      setResult(output.result);
      setIsOptimal(output.isOptimal);
    } catch {
      setErrorMsg("Calculation error. Check your inputs and try again.");
    }
  }, [values, calcDef]);

  const handleReset = useCallback(() => {
    setValues(initialValues);
    setResult(null);
    setIsOptimal(null);
    setErrorMsg("");
  }, [initialValues]);

  return (
    <article
      aria-label={entry.title}
      className="mx-auto max-w-3xl px-4 py-8"
      style={{ fontFamily: "Barlow, sans-serif" }}
    >
      {/* Header */}
      <div className="mb-6">
        <p className="text-xs uppercase tracking-widest text-[#BD5D3A] mb-1">
          Lean Manufacturing · Operational Check
        </p>
        <h1 className="text-2xl font-bold text-[#1A1915] mb-2">{entry.title}</h1>
        <p className="text-sm text-[#1A1915]/70 leading-relaxed">
          {entry.description}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <span className="inline-flex items-center rounded bg-[#1A1915] px-2.5 py-0.5 text-xs text-white font-mono">
            {entry.concept.name}
          </span>
          <span className="inline-flex items-center rounded bg-[#BD5D3A]/10 px-2.5 py-0.5 text-xs text-[#BD5D3A] font-mono">
            {entry.metric.formula}
          </span>
        </div>
      </div>

      {/* Structured Inputs */}
      <div className="bg-[#F0EEE6] p-5 rounded" data-testid="structured-inputs">
        <h2 className="text-sm font-bold text-[#1A1915] uppercase tracking-wide mb-4">
          Structured Inputs
        </h2>
        <div className="space-y-4">
          {calcDef.inputs.map((inp) => (
            <div key={inp.key} className="flex flex-col gap-1">
              <label
                htmlFor={`lean-input-${inp.key}`}
                className="text-xs font-semibold text-[#1A1915]/70 uppercase tracking-wide"
              >
                {inp.label}
              </label>
              <input
                id={`lean-input-${inp.key}`}
                type={inp.type === "percentage" ? "number" : "number"}
                min="0"
                max={inp.type === "percentage" ? "100" : undefined}
                step="any"
                value={values[inp.key]}
                onChange={(e) => handleChange(inp.key, e.target.value)}
                className="w-full border border-[#1A1915]/20 bg-white px-3 py-2 text-sm text-[#1A1915] focus:outline-none focus:border-[#BD5D3A]"
                style={{ minHeight: "44px" }}
                placeholder={inp.placeholder}
              />
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="mt-5 flex items-center gap-3 flex-wrap">
          <button
            type="button"
            onClick={handleCalculate}
            className="inline-flex items-center h-12 px-6 text-sm font-semibold text-white bg-[#BD5D3A] hover:bg-[#9E4E31] focus:outline-none"
          >
            Calculate
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center h-12 px-4 text-sm font-medium text-[#1A1915]/60 hover:text-[#1A1915] focus:outline-none"
          >
            Reset
          </button>
        </div>

        {/* Error */}
        {errorMsg && (
          <div className="mt-3 border-l-4 border-red-500 bg-red-50 p-3 text-sm text-red-800">
            {errorMsg}
          </div>
        )}
      </div>

      {/* Immediate Result */}
      {result !== null && (
        <div className="mt-6" data-testid="immediate-result">
          {/* Verdict Banner */}
          <div
            className={`p-4 border-l-4 ${
              isOptimal
                ? "border-green-600 bg-green-50"
                : "border-[#BD5D3A] bg-[#BD5D3A]/5"
            }`}
          >
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <p className="text-xs uppercase tracking-widest text-[#1A1915]/50 font-semibold">
                  Immediate Result
                </p>
                <p className="text-2xl font-bold text-[#1A1915] mt-1">
                  {result.toFixed(2)}
                  <span className="text-base font-normal text-[#1A1915]/50 ml-1">
                    {entry.metric.unit}
                  </span>
                </p>
              </div>
              <div>
                <span
                  className={`inline-flex items-center px-3 py-1 text-xs font-semibold uppercase ${
                    isOptimal
                      ? "bg-green-100 text-green-800"
                      : "bg-[#BD5D3A]/10 text-[#BD5D3A]"
                  }`}
                >
                  {isOptimal ? "Optimal" : "Needs Action"}
                </span>
              </div>
            </div>
          </div>

          {/* Results Table */}
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-[#1A1915]/20">
                  <th className="text-left py-2 pr-4 font-semibold text-[#1A1915]/60 uppercase text-xs">
                    Metric
                  </th>
                  <th className="text-left py-2 pr-4 font-semibold text-[#1A1915]/60 uppercase text-xs">
                    Value
                  </th>
                  <th className="text-left py-2 font-semibold text-[#1A1915]/60 uppercase text-xs">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {calcDef.inputs.map((inp) => (
                  <tr key={inp.key} className="border-b border-[#1A1915]/10">
                    <td className="py-2 pr-4 text-[#1A1915]/70">{inp.label}</td>
                    <td className="py-2 pr-4 font-mono text-[#1A1915]">{values[inp.key]}</td>
                    <td className="py-2 text-[#1A1915]/40">—</td>
                  </tr>
                ))}
                <tr className="border-b-2 border-[#1A1915]/30">
                  <td className="py-2 pr-4 font-semibold text-[#1A1915]">
                    {entry.metric.name}
                  </td>
                  <td className="py-2 pr-4 font-mono font-bold text-[#1A1915]">
                    {result.toFixed(2)} {entry.metric.unit}
                  </td>
                  <td className="py-2">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 text-xs font-semibold ${
                        isOptimal ? "text-green-700" : "text-[#BD5D3A]"
                      }`}
                    >
                      {isOptimal ? "Pass" : "Review"}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Next Action PDCA */}
          <NextActionPDCA
            metricName={entry.metric.name}
            result={result}
            unit={entry.metric.unit}
            isOptimal={isOptimal}
            conceptSlug={entry.concept.slug}
          />
        </div>
      )}

      {/* Lean standards note — ISO 22400-2 / LEI (RM-LEAN-001 KARAR-3) */}
      <p className="mt-6 text-[10px] text-[#1A1915]/30 uppercase tracking-widest text-center">
        ISO 22400-2 manufacturing KPI context · Lean Enterprise Institute practice. Not financial advice.
      </p>
    </article>
  );
}
