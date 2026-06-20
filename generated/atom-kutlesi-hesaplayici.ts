// Auto-generated from atom-kutlesi-hesaplayici-schema.json
import * as z from 'zod';

export interface Atom_kutlesi_hesaplayiciInput {
  massValue: number;
  dataConfidence?: number;
}

export const Atom_kutlesi_hesaplayiciInputSchema = z.object({
  massValue: z.number().min(0).default(50),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Atom_kutlesi_hesaplayiciInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.massValue * (1 + input.massValue/500) + Math.sqrt(input.massValue) * 5; results["main"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["main"] = Number.NaN; }
  try { const v = input.massValue * (1 + input.massValue/500) + Math.sqrt(input.massValue) * 5; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  return results;
}


export function calculateAtom_kutlesi_hesaplayici(input: Atom_kutlesi_hesaplayiciInput): Atom_kutlesi_hesaplayiciOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    result: toNumericFormulaValue(values["result"])
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review assumptions."];
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
    unit: "kg",
    premiumRequired: false,
    premiumFeatures: ["PDF report","Scenario comparison"],
  };
}


export interface Atom_kutlesi_hesaplayiciOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { result: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Atom_kutlesi_hesaplayiciOutputMeta = {
  primaryKey: "result",
  unit: "kg",
  breakdownKeys: ["result"],
} as const;

