// Auto-generated from barrel-to-litre-hesaplama-schema.json
import * as z from 'zod';

export interface Barrel_to_litre_hesaplamaInput {
  volumeValue: number;
  param2: number;
  dataConfidence?: number;
}

export const Barrel_to_litre_hesaplamaInputSchema = z.object({
  volumeValue: z.number().min(0).default(100),
  param2: z.number().min(0).default(50),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Barrel_to_litre_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.volumeValue * input.param2 / (input.volumeValue + input.param2 + 1) * 100 + Math.sqrt(Math.abs(input.volumeValue - input.param2)); results["main"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["main"] = Number.NaN; }
  try { const v = input.volumeValue * input.param2 / (input.volumeValue + input.param2 + 1) * 100 + Math.sqrt(Math.abs(input.volumeValue - input.param2)); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  return results;
}


export function calculateBarrel_to_litre_hesaplama(input: Barrel_to_litre_hesaplamaInput): Barrel_to_litre_hesaplamaOutput {
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


export interface Barrel_to_litre_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { result: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Barrel_to_litre_hesaplamaOutputMeta = {
  primaryKey: "result",
  unit: "m³",
  breakdownKeys: ["result"],
} as const;

