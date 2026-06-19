// Auto-generated from countdown-calculator-schema.json
import * as z from 'zod';

export interface Countdown_calculatorInput {
  totalDuration: number;
  elapsedDuration: number;
  bufferTime: number;
  warningThreshold: number;
  criticalThreshold: number;
  dataConfidence?: number;
}

export const Countdown_calculatorInputSchema = z.object({
  totalDuration: z.number().default(100),
  elapsedDuration: z.number().default(0),
  bufferTime: z.number().default(0),
  warningThreshold: z.number().default(20),
  criticalThreshold: z.number().default(5),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Countdown_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.totalDuration + input.bufferTime - input.elapsedDuration; results["remainingHours"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["remainingHours"] = 0; }
  try { const v = ((input.totalDuration + input.bufferTime - input.elapsedDuration) / (input.totalDuration + input.bufferTime)) * 100; results["percentRemaining"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["percentRemaining"] = 0; }
  try { const v = (((input.totalDuration + input.bufferTime - input.elapsedDuration) / (input.totalDuration + input.bufferTime)) * 100) <= input.criticalThreshold ? 2 : ((((input.totalDuration + input.bufferTime - input.elapsedDuration) / (input.totalDuration + input.bufferTime)) * 100) <= input.warningThreshold ? 1 : 0); results["status"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["status"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateCountdown_calculator(input: Countdown_calculatorInput): Countdown_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["remainingHours"]));
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


export interface Countdown_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
