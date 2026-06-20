// Auto-generated from working-sermaye-devir-hizi-hesaplama-schema.json
import * as z from 'zod';

export interface Working_sermaye_devir_hizi_hesaplamaInput {
  speedValue: number;
  dataConfidence?: number;
}

export const Working_sermaye_devir_hizi_hesaplamaInputSchema = z.object({
  speedValue: z.number().min(0).default(50),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Working_sermaye_devir_hizi_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.speedValue * (1 + input.speedValue/500) + Math.sqrt(input.speedValue) * 5; results["main"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["main"] = Number.NaN; }
  try { const v = input.speedValue * (1 + input.speedValue/500) + Math.sqrt(input.speedValue) * 5; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  return results;
}


export function calculateWorking_sermaye_devir_hizi_hesaplama(input: Working_sermaye_devir_hizi_hesaplamaInput): Working_sermaye_devir_hizi_hesaplamaOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    result: toNumericFormulaValue(values["result"])
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review assumptions."];
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
    unit: "km/h",
    premiumRequired: false,
    premiumFeatures: ["PDF report","Scenario comparison"],
  };
}


export interface Working_sermaye_devir_hizi_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { result: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Working_sermaye_devir_hizi_hesaplamaOutputMeta = {
  primaryKey: "result",
  unit: "km/h",
  breakdownKeys: ["result"],
} as const;

