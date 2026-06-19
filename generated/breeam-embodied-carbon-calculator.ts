// Auto-generated from breeam-embodied-carbon-calculator-schema.json
import * as z from 'zod';

export interface Breeam_embodied_carbon_calculatorInput {
  steelMass: number;
  concreteMass: number;
  timberMass: number;
  glassMass: number;
  insulationMass: number;
  area: number;
  dataConfidence?: number;
}

export const Breeam_embodied_carbon_calculatorInputSchema = z.object({
  steelMass: z.number().default(0),
  concreteMass: z.number().default(0),
  timberMass: z.number().default(0),
  glassMass: z.number().default(0),
  insulationMass: z.number().default(0),
  area: z.number().default(1),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Breeam_embodied_carbon_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.steelMass * 1.85 + input.concreteMass * 0.15 + input.timberMass * (-0.5) + input.glassMass * 1.2 + input.insulationMass * 0.8; results["totalCarbon"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalCarbon"] = 0; }
  try { const v = (asFormulaNumber(results["totalCarbon"])) / input.area; results["carbonPerArea"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["carbonPerArea"] = 0; }
  try { const v = input.steelMass * 1.85; results["steelContribution"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["steelContribution"] = 0; }
  try { const v = input.concreteMass * 0.15; results["concreteContribution"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["concreteContribution"] = 0; }
  try { const v = input.timberMass * (-0.5); results["timberContribution"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["timberContribution"] = 0; }
  try { const v = input.glassMass * 1.2; results["glassContribution"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["glassContribution"] = 0; }
  try { const v = input.insulationMass * 0.8; results["insulationContribution"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["insulationContribution"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateBreeam_embodied_carbon_calculator(input: Breeam_embodied_carbon_calculatorInput): Breeam_embodied_carbon_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["carbonPerArea"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? Math.max(0, totalWasteCost * (input.dataConfidence / 100))
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


export interface Breeam_embodied_carbon_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
