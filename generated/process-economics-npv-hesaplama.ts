// Auto-generated from process-economics-npv-hesaplama-schema.json
import * as z from 'zod';

export interface Process_economics_npv_hesaplamaInput {
  inputA: number;
  inputB: number;
  dataConfidence?: number;
}

export const Process_economics_npv_hesaplamaInputSchema = z.object({
  inputA: z.number().min(0).default(100),
  inputB: z.number().min(0).default(50),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Process_economics_npv_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.inputA * Math.pow(1 + input.inputB/100, 1) + input.inputA * input.inputB / 1000; results["main"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["main"] = Number.NaN; }
  try { const v = input.inputA * Math.pow(1 + input.inputB/100, 1) + input.inputA * input.inputB / 1000; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  return results;
}


export function calculateProcess_economics_npv_hesaplama(input: Process_economics_npv_hesaplamaInput): Process_economics_npv_hesaplamaOutput {
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


export interface Process_economics_npv_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { result: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Process_economics_npv_hesaplamaOutputMeta = {
  primaryKey: "result",
  unit: "",
  breakdownKeys: ["result"],
} as const;

