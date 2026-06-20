// Auto-generated from pay-donem-hesaplama-schema.json
import * as z from 'zod';

export interface Pay_donem_hesaplamaInput {
  airTemperature: number;
  dataConfidence?: number;
}

export const Pay_donem_hesaplamaInputSchema = z.object({
  airTemperature: z.number().min(0).default(50),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Pay_donem_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.airTemperature * (1 + input.airTemperature/500) + Math.sqrt(input.airTemperature) * 5; results["main"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["main"] = Number.NaN; }
  try { const v = input.airTemperature * (1 + input.airTemperature/500) + Math.sqrt(input.airTemperature) * 5; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  return results;
}


export function calculatePay_donem_hesaplama(input: Pay_donem_hesaplamaInput): Pay_donem_hesaplamaOutput {
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
    unit: "°C",
    premiumRequired: false,
    premiumFeatures: ["PDF report","Scenario comparison"],
  };
}


export interface Pay_donem_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { result: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Pay_donem_hesaplamaOutputMeta = {
  primaryKey: "result",
  unit: "°C",
  breakdownKeys: ["result"],
} as const;

