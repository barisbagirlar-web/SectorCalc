// Auto-generated from apr-calculator-schema.json
import * as z from 'zod';

export interface Apr_calculatorInput {
  kredi: number;
  faiz: number;
  vade: number;
  masraf: number;
  dataConfidence?: number;
}

export const Apr_calculatorInputSchema = z.object({
  kredi: z.number().min(0).default(50000),
  faiz: z.number().min(0).default(12),
  vade: z.number().min(1).default(36),
  masraf: z.number().min(0).default(1500),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Apr_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.kredi - input.masraf; results["netKredi"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["netKredi"] = Number.NaN; }
  try { const v = input.kredi * ((input.faiz/12/100) * Math.pow(1 + input.faiz/12/100, input.vade)) / (Math.pow(1 + input.faiz/12/100, input.vade) - 1); results["aylikTaksit"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["aylikTaksit"] = Number.NaN; }
  try { const v = ((input.kredi - input.masraf) > 0) ? ((((input.kredi * ((input.faiz/12/100) * Math.pow(1 + input.faiz/12/100, input.vade)) / (Math.pow(1 + input.faiz/12/100, input.vade) - 1)) * input.vade) - input.kredi) / input.kredi) * 100 / (input.vade/12) : 0; results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateApr_calculator(input: Apr_calculatorInput): Apr_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown = {
    sonuc: toNumericFormulaValue(values["sonuc"]),
    aylikTaksit: toNumericFormulaValue(values["aylikTaksit"])
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
    unit: "%",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Apr_calculatorOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number; aylikTaksit: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Apr_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "%",
  breakdownKeys: ["sonuc","aylikTaksit"],
} as const;

