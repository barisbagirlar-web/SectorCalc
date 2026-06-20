// Auto-generated from guven-interval-icin-prokisim-hesaplama-schema.json
import * as z from 'zod';

export interface Guven_interval_icin_prokisim_hesaplamaInput {
  temperatureValue: number;
  param2: number;
  dataConfidence?: number;
}

export const Guven_interval_icin_prokisim_hesaplamaInputSchema = z.object({
  temperatureValue: z.number().min(0).default(100),
  param2: z.number().min(0).default(50),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Guven_interval_icin_prokisim_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.temperatureValue * input.param2 / 100 + Math.pow(input.temperatureValue - input.param2, 2) / 1000; results["main"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["main"] = Number.NaN; }
  try { const v = input.temperatureValue * input.param2 / 100 + Math.pow(input.temperatureValue - input.param2, 2) / 1000; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  return results;
}


export function calculateGuven_interval_icin_prokisim_hesaplama(input: Guven_interval_icin_prokisim_hesaplamaInput): Guven_interval_icin_prokisim_hesaplamaOutput {
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


export interface Guven_interval_icin_prokisim_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { result: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Guven_interval_icin_prokisim_hesaplamaOutputMeta = {
  primaryKey: "result",
  unit: "°C",
  breakdownKeys: ["result"],
} as const;

