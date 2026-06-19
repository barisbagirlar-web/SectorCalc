// Auto-generated from inductor-calculator-schema.json
import * as z from 'zod';

export interface Inductor_calculatorInput {
  coreDiameter: number;
  coreLength: number;
  turns: number;
  relativePermeability: number;
  wireDiameter: number;
  resistivity: number;
  dataConfidence?: number;
}

export const Inductor_calculatorInputSchema = z.object({
  coreDiameter: z.number().default(10),
  coreLength: z.number().default(20),
  turns: z.number().default(100),
  relativePermeability: z.number().default(2000),
  wireDiameter: z.number().default(0.5),
  resistivity: z.number().default(0.0172),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Inductor_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 4 * Math.PI * 1e-7 * input.relativePermeability * input.turns * input.turns * (Math.PI * (input.coreDiameter/2)**2) / (input.coreLength/1000); results["inductance"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["inductance"] = 0; }
  try { const v = input.resistivity * (Math.PI * input.coreDiameter * input.turns) / (Math.PI * (input.wireDiameter/2)**2); results["dcResistance"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["dcResistance"] = 0; }
  try { const v = 0.5 * (input.coreLength/1000) / (input.turns * 4 * Math.PI * 1e-7 * input.relativePermeability); results["saturationCurrent"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["saturationCurrent"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateInductor_calculator(input: Inductor_calculatorInput): Inductor_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["inductance"]);
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


export interface Inductor_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
