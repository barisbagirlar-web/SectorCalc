// Auto-generated from api-latency-sla-calculator-schema.json
import * as z from 'zod';

export interface Api_latency_sla_calculatorInput {
  dataConfidence?: number;
  toplamIstek: number;
  hataliIstek: number;
  toplamGecikme: number;
}

export const Api_latency_sla_calculatorInputSchema = z.object({
  dataConfidence: z.number().optional(),
  toplamIstek: z.number().min(0).default(10000),
  hataliIstek: z.number().min(0).default(50),
  toplamGecikme: z.number().min(0).default(250000),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Api_latency_sla_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input["toplamGecikme"] / Math.max(1, input["toplamIstek"]); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  try { const v = ((input["toplamIstek"] - input["hataliIstek"]) / Math.max(1, input["toplamIstek"])) * 100; results["sla"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sla"] = Number.NaN; }
  return results;
}

export function calculateApi_latency_sla_calculator(input: Api_latency_sla_calculatorInput): Api_latency_sla_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown: Record<string, number> = {
    "sla": toNumericFormulaValue(values["sla"])
  };
  const hiddenLossDrivers: string[] = ["Low SLA indicates service reliability issue.","High latency degrades user experience."];
  const suggestedActions: string[] = ["Monitor system performance regularly.","Implement redundancy for critical infrastructure."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? totalWasteCost * (input.dataConfidence / 100)
      : totalWasteCost;
  return {
    totalWasteCost,
    ["sonuc"]: totalWasteCost,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    unit: "ms",
    premiumRequired: false,
    premiumFeatures: [],
  };
}

export interface Api_latency_sla_calculatorOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: Record<string, number>;
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
  [key: string]: unknown;
}

export const Api_latency_sla_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "ms",
  breakdownKeys: ["sla"],
} as const;
