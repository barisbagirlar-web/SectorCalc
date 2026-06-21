// Auto-generated from belt-pulley-gear-calculator-schema.json
import * as z from 'zod';

export interface Belt_pulley_gear_calculatorInput {
  power: number;
  rpm: number;
  teethDriver: number;
  teethDriven: number;
  module: number;
  faceWidth: number;
  frictionCoeff: number;
  wrapAngle: number;
  pressureAngle: number;
  pitchDiameter: number;
  dynamicFactor: number;
  tensionT1: number;
  tensionT2: number;
  vDriver: number;
  vDriven: number;
  dataConfidence?: number;
}

export const Belt_pulley_gear_calculatorInputSchema = z.object({
  power: z.number().min(0).default(0),
  rpm: z.number().min(0).default(0),
  teethDriver: z.number().min(0).default(0),
  teethDriven: z.number().min(0).default(0),
  module: z.number().min(0).default(0),
  faceWidth: z.number().min(0).default(0),
  frictionCoeff: z.number().min(0).default(0),
  wrapAngle: z.number().min(0).default(0),
  pressureAngle: z.number().min(0).default(0),
  pitchDiameter: z.number().min(0).default(0),
  dynamicFactor: z.number().min(0).default(0),
  tensionT1: z.number().min(0).default(0),
  tensionT2: z.number().min(0).default(0),
  vDriver: z.number().min(0).default(0),
  vDriven: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Belt_pulley_gear_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.power * input.rpm * input.teethDriver * input.teethDriven; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["normalized_product"] = Number.NaN; }
  try { const v = input.power * input.rpm * input.teethDriver * input.teethDriven * (input.module * input.faceWidth * input.frictionCoeff * input.wrapAngle * input.pressureAngle * input.pitchDiameter * input.dynamicFactor * input.tensionT1 * input.tensionT2 * input.vDriver * input.vDriven); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  try { const v = input.module * input.faceWidth * input.frictionCoeff * input.wrapAngle * input.pressureAngle * input.pitchDiameter * input.dynamicFactor * input.tensionT1 * input.tensionT2 * input.vDriver * input.vDriven; results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["adjustment_factor"] = Number.NaN; }
  return results;
}


export function calculateBelt_pulley_gear_calculator(input: Belt_pulley_gear_calculatorInput): Belt_pulley_gear_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    normalized_product: toNumericFormulaValue(values["normalized_product"]),
    adjustment_factor: toNumericFormulaValue(values["adjustment_factor"])
  };
  const hiddenLossDrivers: string[] = ["Model uses normalized input chain — validate units","Assumption-heavy without site benchmark"];
  const suggestedActions: string[] = ["Cross-check with historical actuals","Run sensitivity on top 2 inputs"];
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
    unit: "units",
    premiumRequired: true,
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Verdict report"],
  };
}


export interface Belt_pulley_gear_calculatorOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { normalized_product: number; adjustment_factor: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Belt_pulley_gear_calculatorOutputMeta = {
  primaryKey: "result",
  unit: "units",
  breakdownKeys: ["normalized_product","adjustment_factor"],
} as const;

