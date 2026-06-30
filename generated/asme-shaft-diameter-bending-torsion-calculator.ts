// Auto-generated from asme-shaft-diameter-bending-torsion-calculator-schema.json
import * as z from 'zod';

export interface Asme_shaft_diameter_bending_torsion_calculatorInput {
  dataConfidence?: number;
  moment: number;
  tork: number;
  akmaGerilmesi: number;
}

export const Asme_shaft_diameter_bending_torsion_calculatorInputSchema = z.object({
  dataConfidence: z.number().optional(),
  moment: z.number().min(0).default(500),
  tork: z.number().min(0).default(1000),
  akmaGerilmesi: z.number().min(0).default(300000000),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Asme_shaft_diameter_bending_torsion_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.pow((16 / (Math.PI * input["akmaGerilmesi"])) * Math.sqrt(Math.max(0, input["moment"]*input["moment"] + 0.75*input["tork"]*input["tork"])), 1/3); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}

export function calculateAsme_shaft_diameter_bending_torsion_calculator(input: Asme_shaft_diameter_bending_torsion_calculatorInput): Asme_shaft_diameter_bending_torsion_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown: Record<string, number> = {};
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Verify calculations with FEA or physical testing.","Use appropriate safety factors for design."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? totalWasteCost * (input.dataConfidence / 100)
      : totalWasteCost;
  return {
    totalWasteCost,
    ["sonuc"]: totalWasteCost,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    unit: "m",
    premiumRequired: false,
    premiumFeatures: [],
  };
}

export interface Asme_shaft_diameter_bending_torsion_calculatorOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: Record<string, number>;
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
  [key: string]: unknown;
}

export const Asme_shaft_diameter_bending_torsion_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "m",
  breakdownKeys: [],
} as const;
