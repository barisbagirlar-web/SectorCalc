// Auto-generated from phantom-yuk-hesaplama-schema.json
import * as z from 'zod';

export interface Phantom_yuk_hesaplamaInput {
  shipmentWeight: number;
  distanceKm: number;
  dataConfidence?: number;
}

export const Phantom_yuk_hesaplamaInputSchema = z.object({
  shipmentWeight: z.number().min(0).default(100),
  distanceKm: z.number().min(0).default(50),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Phantom_yuk_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.shipmentWeight * Math.exp(-input.distanceKm / 100) + input.shipmentWeight * input.distanceKm / 1000; results["main"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["main"] = Number.NaN; }
  try { const v = input.shipmentWeight * Math.exp(-input.distanceKm / 100) + input.shipmentWeight * input.distanceKm / 1000; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  return results;
}


export function calculatePhantom_yuk_hesaplama(input: Phantom_yuk_hesaplamaInput): Phantom_yuk_hesaplamaOutput {
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
    unit: "kg",
    premiumRequired: false,
    premiumFeatures: ["Detailed PDF report","Scenario comparison","Multi-year projections"],
  };
}


export interface Phantom_yuk_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { result: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Phantom_yuk_hesaplamaOutputMeta = {
  primaryKey: "result",
  unit: "kg",
  breakdownKeys: ["result"],
} as const;

