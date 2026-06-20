// Auto-generated from payback-donem-hesaplama-schema.json
import * as z from 'zod';

export interface Payback_donem_hesaplamaInput {
  airTemperature: number;
  relativeHumidity: number;
  dataConfidence?: number;
}

export const Payback_donem_hesaplamaInputSchema = z.object({
  airTemperature: z.number().min(0).default(100),
  relativeHumidity: z.number().min(0).default(50),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Payback_donem_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.airTemperature * input.relativeHumidity + Math.floor(input.airTemperature / input.relativeHumidity) * 0.5; results["main"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["main"] = Number.NaN; }
  try { const v = input.airTemperature * input.relativeHumidity + Math.floor(input.airTemperature / input.relativeHumidity) * 0.5; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  return results;
}


export function calculatePayback_donem_hesaplama(input: Payback_donem_hesaplamaInput): Payback_donem_hesaplamaOutput {
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
    unit: "°C",
    premiumRequired: false,
    premiumFeatures: ["Detailed PDF report","Scenario comparison","Multi-year projections"],
  };
}


export interface Payback_donem_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { result: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Payback_donem_hesaplamaOutputMeta = {
  primaryKey: "result",
  unit: "°C",
  breakdownKeys: ["result"],
} as const;

