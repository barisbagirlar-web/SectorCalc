// Auto-generated from horizontal-center-gravity-hesaplama-schema.json
import * as z from 'zod';

export interface Horizontal_center_gravity_hesaplamaInput {
  massObject: number;
  gravitationalAccel: number;
  dataConfidence?: number;
}

export const Horizontal_center_gravity_hesaplamaInputSchema = z.object({
  massObject: z.number().min(0).default(100),
  gravitationalAccel: z.number().min(0).default(50),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Horizontal_center_gravity_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.massObject / input.gravitationalAccel * 100 + Math.sqrt(input.massObject * input.gravitationalAccel) / 10; results["main"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["main"] = Number.NaN; }
  try { const v = input.massObject / input.gravitationalAccel * 100 + Math.sqrt(input.massObject * input.gravitationalAccel) / 10; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  return results;
}


export function calculateHorizontal_center_gravity_hesaplama(input: Horizontal_center_gravity_hesaplamaInput): Horizontal_center_gravity_hesaplamaOutput {
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


export interface Horizontal_center_gravity_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { result: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Horizontal_center_gravity_hesaplamaOutputMeta = {
  primaryKey: "result",
  unit: "kg",
  breakdownKeys: ["result"],
} as const;

