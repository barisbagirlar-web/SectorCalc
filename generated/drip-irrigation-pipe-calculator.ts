// Auto-generated from drip-irrigation-pipe-calculator-schema.json
import * as z from 'zod';

export interface Drip_irrigation_pipe_calculatorInput {
  damaticiDebi: number;
  damaticiSayisi: number;
  maxHiz: number;
  dataConfidence?: number;
}

export const Drip_irrigation_pipe_calculatorInputSchema = z.object({
  damaticiDebi: z.number().min(0).default(4),
  damaticiSayisi: z.number().min(0).default(500),
  maxHiz: z.number().min(0).default(1.5),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Drip_irrigation_pipe_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.damaticiDebi * input.damaticiSayisi) / 3600000; results["toplamDebi"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["toplamDebi"] = Number.NaN; }
  try { const v = Math.sqrt(Math.max(0, (4 * (toNumericFormulaValue(results["toplamDebi"]))) / Math.max(0.0001, (Math.PI * input.maxHiz)))) * 1000; results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateDrip_irrigation_pipe_calculator(input: Drip_irrigation_pipe_calculatorInput): Drip_irrigation_pipe_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown = {
    sonuc: toNumericFormulaValue(values["sonuc"])
  };
  const hiddenLossDrivers: string[] = ["Low efficiency may indicate equipment or process issues."];
  const suggestedActions: string[] = ["Calibrate all measuring equipment regularly.","Use site-specific data when available."];
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
    unit: "mm",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Drip_irrigation_pipe_calculatorOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Drip_irrigation_pipe_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "mm",
  breakdownKeys: ["sonuc"],
} as const;

