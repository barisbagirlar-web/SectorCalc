// Auto-generated from motor-verimlilik-hesaplama-schema.json
import * as z from 'zod';

export interface Motor_verimlilik_hesaplamaInput {
  workHours: number;
  hourlyRate: number;
  dataConfidence?: number;
}

export const Motor_verimlilik_hesaplamaInputSchema = z.object({
  workHours: z.number().min(0).default(100),
  hourlyRate: z.number().min(0).default(50),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Motor_verimlilik_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 0.5 * input.workHours * input.hourlyRate * input.hourlyRate / 1000 + input.workHours * input.hourlyRate / 100; results["main"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["main"] = Number.NaN; }
  try { const v = 0.5 * input.workHours * input.hourlyRate * input.hourlyRate / 1000 + input.workHours * input.hourlyRate / 100; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  return results;
}


export function calculateMotor_verimlilik_hesaplama(input: Motor_verimlilik_hesaplamaInput): Motor_verimlilik_hesaplamaOutput {
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
    unit: "h",
    premiumRequired: false,
    premiumFeatures: ["Detailed PDF report","Scenario comparison","Multi-year projections"],
  };
}


export interface Motor_verimlilik_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { result: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Motor_verimlilik_hesaplamaOutputMeta = {
  primaryKey: "result",
  unit: "h",
  breakdownKeys: ["result"],
} as const;

