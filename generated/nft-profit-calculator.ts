// Auto-generated from nft-profit-calculator-schema.json
import * as z from 'zod';

export interface Nft_profit_calculatorInput {
  alis: number;
  satis: number;
  gas: number;
  royalty: number;
  dataConfidence?: number;
}

export const Nft_profit_calculatorInputSchema = z.object({
  alis: z.number().min(0).default(1),
  satis: z.number().min(0).default(2.5),
  gas: z.number().min(0).default(0.05),
  royalty: z.number().min(0).default(5),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Nft_profit_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.satis - input.alis - input.gas - (input.satis * input.royalty / 100); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateNft_profit_calculator(input: Nft_profit_calculatorInput): Nft_profit_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown = {
    sonuc: toNumericFormulaValue(values["sonuc"])
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Verify inputs before making financial decisions.","Consult a licensed financial advisor for personalized advice."];
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
    unit: "ETH",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Nft_profit_calculatorOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Nft_profit_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "ETH",
  breakdownKeys: ["sonuc"],
} as const;

