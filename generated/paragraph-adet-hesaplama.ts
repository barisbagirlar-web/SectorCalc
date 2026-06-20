// Auto-generated from paragraph-adet-hesaplama-schema.json
import * as z from 'zod';

export interface Paragraph_adet_hesaplamaInput {
  matrixSize: number;
  matrixElement: number;
  dataConfidence?: number;
}

export const Paragraph_adet_hesaplamaInputSchema = z.object({
  matrixSize: z.number().min(0).default(100),
  matrixElement: z.number().min(0).default(50),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Paragraph_adet_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.matrixSize * Math.exp(-input.matrixElement / 100) + input.matrixSize * input.matrixElement / 1000; results["main"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["main"] = Number.NaN; }
  try { const v = input.matrixSize * Math.exp(-input.matrixElement / 100) + input.matrixSize * input.matrixElement / 1000; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  return results;
}


export function calculateParagraph_adet_hesaplama(input: Paragraph_adet_hesaplamaInput): Paragraph_adet_hesaplamaOutput {
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
    unit: "n",
    premiumRequired: false,
    premiumFeatures: ["Detailed PDF report","Scenario comparison","Multi-year projections"],
  };
}


export interface Paragraph_adet_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { result: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Paragraph_adet_hesaplamaOutputMeta = {
  primaryKey: "result",
  unit: "n",
  breakdownKeys: ["result"],
} as const;

