// Auto-generated from gross-net-profit-calculator-schema.json
import * as z from 'zod';

export interface Gross_net_profit_calculatorInput {
  ciro: number;
  cogs: number;
  isletmeGideri: number;
  vergi: number;
  dataConfidence?: number;
}

export const Gross_net_profit_calculatorInputSchema = z.object({
  ciro: z.number().min(0).default(1000000),
  cogs: z.number().min(0).default(600000),
  isletmeGideri: z.number().min(0).default(200000),
  vergi: z.number().min(0).default(50000),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Gross_net_profit_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.ciro - input.cogs; results["brut"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["brut"] = Number.NaN; }
  try { const v = (input.ciro - input.cogs) - input.isletmeGideri - input.vergi; results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateGross_net_profit_calculator(input: Gross_net_profit_calculatorInput): Gross_net_profit_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown = {
    brut: toNumericFormulaValue(values["brut"]),
    sonuc: toNumericFormulaValue(values["sonuc"])
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Verify financial projections with actual data.","Review assumptions quarterly."];
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


export interface Gross_net_profit_calculatorOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { brut: number; sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Gross_net_profit_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "USD",
  breakdownKeys: ["brut","sonuc"],
} as const;

