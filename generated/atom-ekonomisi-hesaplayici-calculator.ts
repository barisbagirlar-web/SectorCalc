// Auto-generated from atom-ekonomisi-hesaplayici-calculator-schema.json
import * as z from 'zod';

export interface Atom_ekonomisi_hesaplayici_calculatorInput {
  productMW: number;
  reactantMW1: number;
  reactantMW2: number;
  reactantMW3: number;
  reactantMW4: number;
  reactantMW5: number;
  dataConfidence?: number;
}

export const Atom_ekonomisi_hesaplayici_calculatorInputSchema = z.object({
  productMW: z.number().default(100),
  reactantMW1: z.number().default(50),
  reactantMW2: z.number().default(50),
  reactantMW3: z.number().default(0),
  reactantMW4: z.number().default(0),
  reactantMW5: z.number().default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Atom_ekonomisi_hesaplayici_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.reactantMW1 + input.reactantMW2 + input.reactantMW3 + input.reactantMW4 + input.reactantMW5; results["toplamReaktanAgirlik"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["toplamReaktanAgirlik"] = Number.NaN; }
  try { const v = input.productMW; results["urunAgirlik"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["urunAgirlik"] = Number.NaN; }
  try { const v = input.productMW / (input.reactantMW1 + input.reactantMW2 + input.reactantMW3 + input.reactantMW4 + input.reactantMW5) * 100; results["atomEkonomisi"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["atomEkonomisi"] = Number.NaN; }
  return results;
}


export function calculateAtom_ekonomisi_hesaplayici_calculator(input: Atom_ekonomisi_hesaplayici_calculatorInput): Atom_ekonomisi_hesaplayici_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["atomEkonomisi"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
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
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Atom_ekonomisi_hesaplayici_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
