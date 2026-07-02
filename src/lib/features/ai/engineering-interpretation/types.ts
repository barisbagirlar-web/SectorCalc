/**
 * Engineering interpretation types - premium result commentary.
 * Structured output from DeepSeek for industrial-grade result interpretation.
 */

/** Single output field analysis */
export type OutputInterpretation = {
  readonly outputId: string;
  readonly label: string;
  readonly interpretation: string;
  readonly significance: "critical" | "significant" | "notable" | "informational";
};

/** Risk factor identified in the result */
export type InterpretationRisk = {
  readonly factor: string;
  readonly severity: "high" | "medium" | "low";
  readonly explanation: string;
};

/** Actionable recommendation */
export type InterpretationRecommendation = {
  readonly priority: "immediate" | "short_term" | "long_term";
  readonly action: string;
  readonly expectedImpact: string;
};

/** Full structured interpretation from DeepSeek */
export type EngineeringInterpretation = {
  readonly executiveSummary: string;
  readonly outputAnalyses: readonly OutputInterpretation[];
  readonly riskAssessment: readonly InterpretationRisk[];
  readonly recommendations: readonly InterpretationRecommendation[];
  readonly fieldNotes: readonly string[];
  readonly confidence: "high" | "medium" | "low";
};

/** Request payload sent to the API route */
export type InterpretPremiumResultRequest = {
  readonly toolId: string;
  readonly toolName: string;
  readonly sectorSlug: string;
  readonly locale: string;
  readonly inputs: Record<string, string | number | boolean>;
  readonly outputs: ReadonlyArray<{
    readonly id: string;
    readonly label: string;
    readonly value: string;
    readonly unit?: string;
  }>;
  readonly verdict?: string;
  readonly bigNumber?: {
    readonly label: string;
    readonly value: string;
  };
};

/** Response from the API route */
export type InterpretPremiumResultResponse = {
  readonly ok: true;
  readonly interpretation: EngineeringInterpretation;
} | {
  readonly ok: false;
  readonly error: string;
  readonly fallbackMessage: string;
};

/**
 * Build input context for DeepSeek prompt.
 * Serializes inputs/outputs in a structured text format.
 */
export function buildInterpretationContext(request: InterpretPremiumResultRequest): string {
  const lines: string[] = [];

  lines.push(`Tool: ${request.toolName} (ID: ${request.toolId})`);
  lines.push(`Sector: ${request.sectorSlug}`);
  lines.push(`Locale: ${request.locale}`);
  lines.push("");

  lines.push("--- Inputs ---");
  for (const [key, value] of Object.entries(request.inputs)) {
    lines.push(`  ${key}: ${String(value)}`);
  }

  lines.push("");
  lines.push("--- Calculated Outputs ---");
  for (const output of request.outputs) {
    const unitStr = output.unit ? ` ${output.unit}` : "";
    lines.push(`  ${output.label}: ${output.value}${unitStr}`);
  }

  if (request.bigNumber) {
    lines.push("");
    lines.push(`Primary metric - ${request.bigNumber.label}: ${request.bigNumber.value}`);
  }

  if (request.verdict) {
    lines.push("");
    lines.push(`Verdict: ${request.verdict}`);
  }

  return lines.join("\n");
}
