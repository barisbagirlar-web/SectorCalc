// Auto-generated from oss-vat-hesaplama-schema.json
import * as z from 'zod';

export interface Oss_vat_hesaplamaInput {
  inputA: number;
  inputB: number;
  dataConfidence?: number;
}

export const Oss_vat_hesaplamaInputSchema = z.object({
  inputA: z.number().min(0).default(100),
  inputB: z.number().min(0).default(50),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Oss_vat_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.inputA * (1 + input.inputB/100) - input.inputA * input.inputB / 10000; results["main"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["main"] = Number.NaN; }
  try { const v = input.inputA * (1 + input.inputB/100) - input.inputA * input.inputB / 10000; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  return results;
}


export function calculateOss_vat_hesaplama(input: Oss_vat_hesaplamaInput): Oss_vat_hesaplamaOutput {
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
    unit: "",
    premiumRequired: false,
    premiumFeatures: ["Detailed PDF report","Scenario comparison","Multi-year projections"],
  };
}


export interface Oss_vat_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { result: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Oss_vat_hesaplamaOutputMeta = {
  primaryKey: "result",
  unit: "",
  breakdownKeys: ["result"],
} as const;

