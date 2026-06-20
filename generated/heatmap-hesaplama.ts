// Auto-generated from heatmap-hesaplama-schema.json
import * as z from 'zod';

export interface Heatmap_hesaplamaInput {
  temperatureValue: number;
  dataConfidence?: number;
}

export const Heatmap_hesaplamaInputSchema = z.object({
  temperatureValue: z.number().min(0).default(50),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Heatmap_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.temperatureValue * (1 + input.temperatureValue/500) + Math.sqrt(input.temperatureValue) * 5; results["main"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["main"] = Number.NaN; }
  try { const v = input.temperatureValue * (1 + input.temperatureValue/500) + Math.sqrt(input.temperatureValue) * 5; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  return results;
}


export function calculateHeatmap_hesaplama(input: Heatmap_hesaplamaInput): Heatmap_hesaplamaOutput {
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


export interface Heatmap_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { result: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Heatmap_hesaplamaOutputMeta = {
  primaryKey: "result",
  unit: "°C",
  breakdownKeys: ["result"],
} as const;

