// Auto-generated from circuit-yuk-hesaplama-schema.json
import * as z from 'zod';

export interface Circuit_yuk_hesaplamaInput {
  shipmentWeight: number;
  distanceKm: number;
  dataConfidence?: number;
}

export const Circuit_yuk_hesaplamaInputSchema = z.object({
  shipmentWeight: z.number().min(0).default(100),
  distanceKm: z.number().min(0).default(50),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Circuit_yuk_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.shipmentWeight * input.distanceKm / 1000 + Math.pow(input.shipmentWeight, 2) / (input.distanceKm + 1); results["main"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["main"] = Number.NaN; }
  try { const v = input.shipmentWeight * input.distanceKm / 1000 + Math.pow(input.shipmentWeight, 2) / (input.distanceKm + 1); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  return results;
}


export function calculateCircuit_yuk_hesaplama(input: Circuit_yuk_hesaplamaInput): Circuit_yuk_hesaplamaOutput {
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


export interface Circuit_yuk_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { result: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Circuit_yuk_hesaplamaOutputMeta = {
  primaryKey: "result",
  unit: "kg",
  breakdownKeys: ["result"],
} as const;

