"use client";

import React from "react";

export interface NextActionPDCAProps {
  metricName: string;
  /** The calculated result value. */
  result: number;
  /** Unit displayed after the result value. */
  unit: string;
  /** Whether the result meets the target threshold. null = not yet calculated. */
  isOptimal: boolean | null;
  conceptSlug: string;
}

/**
 * "Clear Next Action" CRO & AI Overview hook.
 *
 * Maps SectorCalc's "Clear next action" promise to the Lean PDCA "Act" step.
 * Signals to Google NLP models that this page is action-oriented,
 * maximizing "Helpful Content" scoring.
 *
 * Renders a structured action block with:
 * - Conditional countermeasure text (standardize vs A3 report)
 * - Downloadable A3 template CTA
 */
export default function NextActionPDCA({
  metricName,
  result,
  unit,
  isOptimal,
  conceptSlug,
}: NextActionPDCAProps) {
  const actionHeading = isOptimal
    ? `Standardize the ${metricName} process — update the Gemba control plan`
    : `Initiate an A3 Problem Solving report for ${metricName} variance`;

  const actionDetail = isOptimal
    ? `The calculated ${metricName} of ${result.toFixed(2)} ${unit} meets the target threshold. Standardize this process, update the Gemba control plan, and document the current state as the new baseline for continuous improvement.`
    : `The calculated ${metricName} of ${result.toFixed(2)} ${unit} falls below the target threshold. Initiate an A3 Problem Solving report: define the gap, collect Gemba data, perform root cause analysis, implement countermeasure, and verify sustainment.`;

  const a3Link = `/lean/a3-report?metric=${encodeURIComponent(metricName)}&result=${result.toFixed(2)}&unit=${encodeURIComponent(unit)}&concept=${encodeURIComponent(conceptSlug)}`;

  return (
    <section
      id="next-action"
      className="mt-8 border-l-4 border-green-600 bg-green-50 p-4"
    >
      <h3 className="font-bold text-[#1A1915] text-base mb-2">
        {actionHeading}
      </h3>
      <p className="text-[#1A1915] text-sm leading-relaxed">{actionDetail}</p>
      <a
        href={a3Link}
        className="mt-2 inline-block text-[#BD5D3A] font-semibold hover:underline text-sm"
      >
        Download A3 Countermeasure Template →
      </a>
    </section>
  );
}
