// Auto-generated from candy-sicaklik-hesaplama-schema.json
import * as z from 'zod';

export interface Candy_sicaklik_hesaplamaInput {
  temperatureValue: number;
  dataConfidence?: number;
}

export const Candy_sicaklik_hesaplamaInputSchema = z.object({
  temperatureValue: z.number().min(0).default(50),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Candy_sicaklik_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.temperatureValue * (1 + input.temperatureValue/500) + Math.sqrt(input.temperatureValue) * 5; results["main"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["main"] = Number.NaN; }
  try { const v = input.temperatureValue * (1 + input.temperatureValue/500) + Math.sqrt(input.temperatureValue) * 5; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  return results;
}


export function calculateCandy_sicaklik_hesaplama(input: Candy_sicaklik_hesaplamaInput): Candy_sicaklik_hesaplamaOutput {
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


export interface Candy_sicaklik_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { result: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Candy_sicaklik_hesaplamaOutputMeta = {
  primaryKey: "result",
  unit: "°C",
  breakdownKeys: ["result"],
} as const;

