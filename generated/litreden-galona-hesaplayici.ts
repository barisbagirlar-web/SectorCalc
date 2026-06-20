// Auto-generated from litreden-galona-hesaplayici-schema.json
import * as z from 'zod';

export interface Litreden_galona_hesaplayiciInput {
  volumeValue: number;
  param2: number;
  dataConfidence?: number;
}

export const Litreden_galona_hesaplayiciInputSchema = z.object({
  volumeValue: z.number().min(0).default(100),
  param2: z.number().min(0).default(50),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Litreden_galona_hesaplayiciInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.volumeValue * input.param2 + Math.floor(input.volumeValue / input.param2) * 0.5; results["main"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["main"] = Number.NaN; }
  try { const v = input.volumeValue * input.param2 + Math.floor(input.volumeValue / input.param2) * 0.5; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  return results;
}


export function calculateLitreden_galona_hesaplayici(input: Litreden_galona_hesaplayiciInput): Litreden_galona_hesaplayiciOutput {
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
    unit: "m³",
    premiumRequired: false,
    premiumFeatures: ["Detailed PDF report","Scenario comparison","Multi-year projections"],
  };
}


export interface Litreden_galona_hesaplayiciOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { result: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Litreden_galona_hesaplayiciOutputMeta = {
  primaryKey: "result",
  unit: "m³",
  breakdownKeys: ["result"],
} as const;

