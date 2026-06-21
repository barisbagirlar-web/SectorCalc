// Auto-generated from backdoor-roth-ira-conversion-calculator-schema.json
import * as z from 'zod';

export interface Backdoor_roth_ira_conversion_calculatorInput {
  gelenekselBakiye: number;
  donusenTutar: number;
  vergiOrani: number;
  dataConfidence?: number;
}

export const Backdoor_roth_ira_conversion_calculatorInputSchema = z.object({
  gelenekselBakiye: z.number().min(0).default(50000),
  donusenTutar: z.number().min(0).default(50000),
  vergiOrani: z.number().min(0).default(25),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Backdoor_roth_ira_conversion_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.donusenTutar * (input.vergiOrani / 100); results["vergi"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["vergi"] = Number.NaN; }
  try { const v = input.gelenekselBakiye + input.donusenTutar - (input.donusenTutar * (input.vergiOrani / 100)); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateBackdoor_roth_ira_conversion_calculator(input: Backdoor_roth_ira_conversion_calculatorInput): Backdoor_roth_ira_conversion_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown = {
    sonuc: toNumericFormulaValue(values["sonuc"])
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review insurance coverage annually.","Consult a retirement planner for personalized strategy."];
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
    unit: "USD",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Backdoor_roth_ira_conversion_calculatorOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Backdoor_roth_ira_conversion_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "USD",
  breakdownKeys: ["sonuc"],
} as const;

