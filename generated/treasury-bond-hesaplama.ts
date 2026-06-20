// Auto-generated from treasury-bond-hesaplama-schema.json
import * as z from 'zod';

export interface Treasury_bond_hesaplamaInput {
  flowRate: number;
  pipeDiameter: number;
  dataConfidence?: number;
}

export const Treasury_bond_hesaplamaInputSchema = z.object({
  flowRate: z.number().min(0).default(100),
  pipeDiameter: z.number().min(0).default(50),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Treasury_bond_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.flowRate / input.pipeDiameter * 100 + Math.sqrt(input.flowRate * input.pipeDiameter) / 10; results["main"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["main"] = Number.NaN; }
  try { const v = input.flowRate / input.pipeDiameter * 100 + Math.sqrt(input.flowRate * input.pipeDiameter) / 10; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  return results;
}


export function calculateTreasury_bond_hesaplama(input: Treasury_bond_hesaplamaInput): Treasury_bond_hesaplamaOutput {
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
    unit: "L/min",
    premiumRequired: false,
    premiumFeatures: ["Detailed PDF report","Scenario comparison","Multi-year projections"],
  };
}


export interface Treasury_bond_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { result: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Treasury_bond_hesaplamaOutputMeta = {
  primaryKey: "result",
  unit: "L/min",
  breakdownKeys: ["result"],
} as const;

