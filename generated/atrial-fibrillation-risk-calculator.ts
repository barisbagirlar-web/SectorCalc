// Auto-generated from atrial-fibrillation-risk-calculator-schema.json
import * as z from 'zod';

export interface Atrial_fibrillation_risk_calculatorInput {
  congestiveHeartFailure: number;
  hypertension: number;
  age: number;
  diabetes: number;
  priorStrokeOrTIA: number;
  vascularDisease: number;
  sex: number;
}

export const Atrial_fibrillation_risk_calculatorInputSchema = z.object({
  congestiveHeartFailure: z.number().default(0),
  hypertension: z.number().default(0),
  age: z.number().default(65),
  diabetes: z.number().default(0),
  priorStrokeOrTIA: z.number().default(0),
  vascularDisease: z.number().default(0),
  sex: z.number().default(0),
});

function evaluateAllFormulas(input: Atrial_fibrillation_risk_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.congestiveHeartFailure; results["chfPoints"] = Number.isFinite(v) ? v : 0; } catch { results["chfPoints"] = 0; }
  try { const v = input.hypertension; results["htnPoints"] = Number.isFinite(v) ? v : 0; } catch { results["htnPoints"] = 0; }
  try { const v = input.age >= 75 ? 2 : (input.age >= 65 ? 1 : 0); results["agePoints"] = Number.isFinite(v) ? v : 0; } catch { results["agePoints"] = 0; }
  try { const v = input.diabetes; results["dmPoints"] = Number.isFinite(v) ? v : 0; } catch { results["dmPoints"] = 0; }
  try { const v = input.priorStrokeOrTIA || input.vascularDisease ? 2 : 0; results["strokePoints"] = Number.isFinite(v) ? v : 0; } catch { results["strokePoints"] = 0; }
  try { const v = input.sex; results["sexPoints"] = Number.isFinite(v) ? v : 0; } catch { results["sexPoints"] = 0; }
  try { const v = (results["chfPoints"] ?? 0) + (results["htnPoints"] ?? 0) + (results["agePoints"] ?? 0) + (results["dmPoints"] ?? 0) + (results["strokePoints"] ?? 0) + (results["sexPoints"] ?? 0); results["riskScore"] = Number.isFinite(v) ? v : 0; } catch { results["riskScore"] = 0; }
  try { const v = `CHF: ${(results["chfPoints"] ?? 0)}, HTN: ${(results["htnPoints"] ?? 0)}, Age: ${(results["agePoints"] ?? 0)}, DM: ${(results["dmPoints"] ?? 0)}, Stroke/TIA/Vasc: ${(results["strokePoints"] ?? 0)}, Sex: ${(results["sexPoints"] ?? 0)}`; results["pointsBreakdown"] = Number.isFinite(v) ? v : 0; } catch { results["pointsBreakdown"] = 0; }
  try { const v = (results["riskScore"] ?? 0) == 0 ? 'Low risk' : (results["riskScore"] ?? 0) == 1 ? 'Moderate risk' : 'High risk'; results["riskCategory"] = Number.isFinite(v) ? v : 0; } catch { results["riskCategory"] = 0; }
  return results;
}


export function calculateAtrial_fibrillation_risk_calculator(input: Atrial_fibrillation_risk_calculatorInput): Atrial_fibrillation_risk_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["riskScore"] ?? 0;
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


export interface Atrial_fibrillation_risk_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
