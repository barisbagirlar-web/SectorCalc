// Auto-generated from contact-lens-hesaplama-schema.json
import * as z from 'zod';

export interface Contact_lens_hesaplamaInput {
  focalLength: number;
  objectDistance: number;
  dataConfidence?: number;
}

export const Contact_lens_hesaplamaInputSchema = z.object({
  focalLength: z.number().min(0).default(100),
  objectDistance: z.number().min(0).default(50),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Contact_lens_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.focalLength / input.objectDistance * 100 + Math.sqrt(input.focalLength * input.objectDistance) / 10; results["main"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["main"] = Number.NaN; }
  try { const v = input.focalLength / input.objectDistance * 100 + Math.sqrt(input.focalLength * input.objectDistance) / 10; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  return results;
}


export function calculateContact_lens_hesaplama(input: Contact_lens_hesaplamaInput): Contact_lens_hesaplamaOutput {
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
    unit: "mm",
    premiumRequired: false,
    premiumFeatures: ["Detailed PDF report","Scenario comparison","Multi-year projections"],
  };
}


export interface Contact_lens_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { result: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Contact_lens_hesaplamaOutputMeta = {
  primaryKey: "result",
  unit: "mm",
  breakdownKeys: ["result"],
} as const;

