// Auto-generated from growing-zone-hesaplama-schema.json
import * as z from 'zod';

export interface Growing_zone_hesaplamaInput {
  boardVolume: number;
  riderWeight: number;
  dataConfidence?: number;
}

export const Growing_zone_hesaplamaInputSchema = z.object({
  boardVolume: z.number().min(0).default(100),
  riderWeight: z.number().min(0).default(50),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Growing_zone_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.boardVolume / input.riderWeight * 100 + Math.sqrt(input.boardVolume * input.riderWeight) / 10; results["main"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["main"] = Number.NaN; }
  try { const v = input.boardVolume / input.riderWeight * 100 + Math.sqrt(input.boardVolume * input.riderWeight) / 10; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  return results;
}


export function calculateGrowing_zone_hesaplama(input: Growing_zone_hesaplamaInput): Growing_zone_hesaplamaOutput {
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
    unit: "L",
    premiumRequired: false,
    premiumFeatures: ["Detailed PDF report","Scenario comparison","Multi-year projections"],
  };
}


export interface Growing_zone_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { result: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Growing_zone_hesaplamaOutputMeta = {
  primaryKey: "result",
  unit: "L",
  breakdownKeys: ["result"],
} as const;

