// Auto-generated from nihss-calculator-schema.json
import * as z from 'zod';

export interface Nihss_calculatorInput {
  consciousness: number;
  gaze: number;
  visual: number;
  facial: number;
  motor_arm: number;
  motor_leg: number;
  language: number;
  dataConfidence?: number;
}

export const Nihss_calculatorInputSchema = z.object({
  consciousness: z.number().default(0),
  gaze: z.number().default(0),
  visual: z.number().default(0),
  facial: z.number().default(0),
  motor_arm: z.number().default(0),
  motor_leg: z.number().default(0),
  language: z.number().default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Nihss_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.consciousness + input.gaze + input.visual + input.facial + input.motor_arm + input.motor_leg + input.language; results["total"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["total"] = Number.NaN; }
  try { const v = input.consciousness; results["consciousness"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["consciousness"] = Number.NaN; }
  try { const v = input.gaze; results["gaze"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["gaze"] = Number.NaN; }
  try { const v = input.visual; results["visual"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["visual"] = Number.NaN; }
  try { const v = input.facial; results["facial"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["facial"] = Number.NaN; }
  try { const v = input.motor_arm; results["motor_arm"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["motor_arm"] = Number.NaN; }
  try { const v = input.motor_leg; results["motor_leg"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["motor_leg"] = Number.NaN; }
  try { const v = input.language; results["language"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["language"] = Number.NaN; }
  return results;
}


export function calculateNihss_calculator(input: Nihss_calculatorInput): Nihss_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["total"]);
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


export interface Nihss_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
