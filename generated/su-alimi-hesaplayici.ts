// Auto-generated from su-alimi-hesaplayici-schema.json
import * as z from 'zod';

export interface Su_alimi_hesaplayiciInput {
  flowRate: number;
  pipeDiameter: number;
  dataConfidence?: number;
}

export const Su_alimi_hesaplayiciInputSchema = z.object({
  flowRate: z.number().min(0).default(100),
  pipeDiameter: z.number().min(0).default(50),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Su_alimi_hesaplayiciInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.flowRate * input.pipeDiameter + Math.floor(input.flowRate / input.pipeDiameter) * 0.5; results["main"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["main"] = Number.NaN; }
  try { const v = input.flowRate * input.pipeDiameter + Math.floor(input.flowRate / input.pipeDiameter) * 0.5; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  return results;
}


export function calculateSu_alimi_hesaplayici(input: Su_alimi_hesaplayiciInput): Su_alimi_hesaplayiciOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    result: toNumericFormulaValue(values["result"])
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Consult with a professional.","Review assumptions regularly."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? totalWasteCost * (input.dataConfidence / 100)
      : totalWasteCost;
  return {
    totalWasteCost,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    unit: "L/min",
    premiumRequired: false,
    premiumFeatures: ["Detailed PDF report","Scenario comparison","Multi-year projections"],
  };
}


export interface Su_alimi_hesaplayiciOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { result: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Su_alimi_hesaplayiciOutputMeta = {
  primaryKey: "result",
  unit: "L/min",
  breakdownKeys: ["result"],
} as const;

