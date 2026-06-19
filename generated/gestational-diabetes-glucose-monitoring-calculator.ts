// Auto-generated from gestational-diabetes-glucose-monitoring-calculator-schema.json
import * as z from 'zod';

export interface Gestational_diabetes_glucose_monitoring_calculatorInput {
  bloodGlucose: number;
  conversionFactor: number;
  timeSinceMeal: number;
  targetLow: number;
  targetHigh: number;
  dataConfidence?: number;
}

export const Gestational_diabetes_glucose_monitoring_calculatorInputSchema = z.object({
  bloodGlucose: z.number().default(100),
  conversionFactor: z.number().default(0.0555),
  timeSinceMeal: z.number().default(2),
  targetLow: z.number().default(70),
  targetHigh: z.number().default(140),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Gestational_diabetes_glucose_monitoring_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.bloodGlucose - input.targetLow) / (input.targetHigh - input.targetLow); results["glucoseScore"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["glucoseScore"] = 0; }
  try { const v = input.bloodGlucose * input.conversionFactor; results["glucoseMmol"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["glucoseMmol"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateGestational_diabetes_glucose_monitoring_calculator(input: Gestational_diabetes_glucose_monitoring_calculatorInput): Gestational_diabetes_glucose_monitoring_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["glucoseScore"]));
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


export interface Gestational_diabetes_glucose_monitoring_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
