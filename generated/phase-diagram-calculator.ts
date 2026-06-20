// Auto-generated from phase-diagram-calculator-schema.json
import * as z from 'zod';

export interface Phase_diagram_calculatorInput {
  alloyComposition: number;
  solidComposition: number;
  liquidComposition: number;
  temperature: number;
  dataConfidence?: number;
}

export const Phase_diagram_calculatorInputSchema = z.object({
  alloyComposition: z.number().default(30),
  solidComposition: z.number().default(10),
  liquidComposition: z.number().default(60),
  temperature: z.number().default(300),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Phase_diagram_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 100 * (input.liquidComposition - input.alloyComposition) / (input.liquidComposition - input.solidComposition); results["primary"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["primary"] = Number.NaN; }
  try { const v = input.alloyComposition; results["breakdown"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["breakdown"] = Number.NaN; }
  return results;
}


export function calculatePhase_diagram_calculator(input: Phase_diagram_calculatorInput): Phase_diagram_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["breakdown"]);
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


export interface Phase_diagram_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
