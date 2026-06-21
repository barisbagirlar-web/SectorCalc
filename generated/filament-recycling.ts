// Auto-generated from filament-recycling-schema.json
import * as z from 'zod';

export interface Filament_recyclingInput {
  safFiyatFire: number;
  toplamaPellet: number;
  verim: number;
  enerji: number;
  mukavemetKayip: number;
  karbon: number;
  dataConfidence?: number;
}

export const Filament_recyclingInputSchema = z.object({
  safFiyatFire: z.number().min(0).default(0),
  toplamaPellet: z.number().min(0).default(0),
  verim: z.number().min(0).default(0),
  enerji: z.number().min(0).default(0),
  mukavemetKayip: z.number().min(0).default(0),
  karbon: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Filament_recyclingInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.safFiyatFire * input.toplamaPellet * input.verim * input.enerji; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["normalized_product"] = Number.NaN; }
  try { const v = input.safFiyatFire * input.toplamaPellet * input.verim * input.enerji * (input.mukavemetKayip * input.karbon); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  try { const v = input.mukavemetKayip * input.karbon; results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["adjustment_factor"] = Number.NaN; }
  return results;
}


export function calculateFilament_recycling(input: Filament_recyclingInput): Filament_recyclingOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    normalized_product: toNumericFormulaValue(values["normalized_product"]),
    adjustment_factor: toNumericFormulaValue(values["adjustment_factor"])
  };
  const hiddenLossDrivers: string[] = ["Model uses normalized input chain — validate units","Assumption-heavy without site benchmark"];
  const suggestedActions: string[] = ["Cross-check with historical actuals","Run sensitivity on top 2 inputs"];
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
    unit: "units",
    premiumRequired: true,
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Verdict report"],
  };
}


export interface Filament_recyclingOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { normalized_product: number; adjustment_factor: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Filament_recyclingOutputMeta = {
  primaryKey: "result",
  unit: "units",
  breakdownKeys: ["normalized_product","adjustment_factor"],
} as const;

