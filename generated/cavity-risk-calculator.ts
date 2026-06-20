// Auto-generated from cavity-risk-calculator-schema.json
import * as z from 'zod';

export interface Cavity_risk_calculatorInput {
  meltTemp: number;
  moldTemp: number;
  injectionPressure: number;
  coolingRate: number;
  alloyPurity: number;
  ventingEfficiency: number;
  dataConfidence?: number;
}

export const Cavity_risk_calculatorInputSchema = z.object({
  meltTemp: z.number().default(720),
  moldTemp: z.number().default(180),
  injectionPressure: z.number().default(100),
  coolingRate: z.number().default(50),
  alloyPurity: z.number().default(99.5),
  ventingEfficiency: z.number().default(90),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Cavity_risk_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.meltTemp - 700) / 100 + (input.moldTemp - 150) / 50; results["thermalFactor"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["thermalFactor"] = Number.NaN; }
  try { const v = 1 - (input.injectionPressure / 200); results["pressureFactor"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["pressureFactor"] = Number.NaN; }
  try { const v = input.coolingRate / 100; results["coolingRisk"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["coolingRisk"] = Number.NaN; }
  try { const v = 1 - (input.alloyPurity / 100); results["purityFactor"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["purityFactor"] = Number.NaN; }
  try { const v = 1 - (input.ventingEfficiency / 100); results["ventingFactor"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["ventingFactor"] = Number.NaN; }
  try { const v = ((toNumericFormulaValue(results["thermalFactor"])) + (toNumericFormulaValue(results["pressureFactor"])) + (toNumericFormulaValue(results["coolingRisk"])) + (toNumericFormulaValue(results["purityFactor"])) + (toNumericFormulaValue(results["ventingFactor"]))) / 5; results["cavityRiskIndex"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["cavityRiskIndex"] = Number.NaN; }
  return results;
}


export function calculateCavity_risk_calculator(input: Cavity_risk_calculatorInput): Cavity_risk_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["cavityRiskIndex"]);
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


export interface Cavity_risk_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
