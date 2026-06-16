// Auto-generated from cavity-risk-calculator-schema.json
import * as z from 'zod';

export interface Cavity_risk_calculatorInput {
  meltTemp: number;
  moldTemp: number;
  injectionPressure: number;
  coolingRate: number;
  alloyPurity: number;
  ventingEfficiency: number;
}

export const Cavity_risk_calculatorInputSchema = z.object({
  meltTemp: z.number().default(720),
  moldTemp: z.number().default(180),
  injectionPressure: z.number().default(100),
  coolingRate: z.number().default(50),
  alloyPurity: z.number().default(99.5),
  ventingEfficiency: z.number().default(90),
});

function evaluateAllFormulas(input: Cavity_risk_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.exp(-0.01 * (input.meltTemp - 700)) + Math.sqrt(Math.abs(input.moldTemp - 200)) / 10; results["thermalFactor"] = Number.isFinite(v) ? v : 0; } catch { results["thermalFactor"] = 0; }
  try { const v = Math.max(0, 1 - (input.injectionPressure / 150)); results["pressureFactor"] = Number.isFinite(v) ? v : 0; } catch { results["pressureFactor"] = 0; }
  try { const v = 1 - (input.alloyPurity / 100); results["purityFactor"] = Number.isFinite(v) ? v : 0; } catch { results["purityFactor"] = 0; }
  try { const v = Math.log(1 + input.coolingRate) / Math.log(10); results["coolingRisk"] = Number.isFinite(v) ? v : 0; } catch { results["coolingRisk"] = 0; }
  try { const v = 1 - (input.ventingEfficiency / 100); results["ventingFactor"] = Number.isFinite(v) ? v : 0; } catch { results["ventingFactor"] = 0; }
  try { const v = ((Math.exp(-0.01 * (input.meltTemp - 700)) + Math.sqrt(Math.abs(input.moldTemp - 200)) / 10) * Math.max(0, 1 - (input.injectionPressure / 150)) * (1 - (input.alloyPurity / 100)) * (Math.log(1 + input.coolingRate) / Math.log(10)) * (1 - (input.ventingEfficiency / 100))) * 100; results["cavityRiskIndex"] = Number.isFinite(v) ? v : 0; } catch { results["cavityRiskIndex"] = 0; }
  return results;
}


export function calculateCavity_risk_calculator(input: Cavity_risk_calculatorInput): Cavity_risk_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["cavityRiskIndex"] ?? 0;
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  const dataConfidenceAdjusted =
    typeof (input as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as Record<string, unknown>).dataConfidence as number) / 100)
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
