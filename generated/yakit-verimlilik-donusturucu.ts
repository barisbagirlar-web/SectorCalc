// Auto-generated from yakit-verimlilik-donusturucu-schema.json
import * as z from 'zod';

export interface Yakit_verimlilik_donusturucuInput {
  workHours: number;
  hourlyRate: number;
  dataConfidence?: number;
}

export const Yakit_verimlilik_donusturucuInputSchema = z.object({
  workHours: z.number().min(0).default(100),
  hourlyRate: z.number().min(0).default(50),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Yakit_verimlilik_donusturucuInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.workHours * input.hourlyRate / 100 + Math.log(input.workHours * input.hourlyRate + 1) * 10; results["main"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["main"] = Number.NaN; }
  try { const v = input.workHours * input.hourlyRate / 100 + Math.log(input.workHours * input.hourlyRate + 1) * 10; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  return results;
}


export function calculateYakit_verimlilik_donusturucu(input: Yakit_verimlilik_donusturucuInput): Yakit_verimlilik_donusturucuOutput {
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


export interface Yakit_verimlilik_donusturucuOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { result: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Yakit_verimlilik_donusturucuOutputMeta = {
  primaryKey: "result",
  unit: "h",
  breakdownKeys: ["result"],
} as const;

