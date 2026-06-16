// Auto-generated from moon-phase-calculator-schema.json
import * as z from 'zod';

export interface Moon_phase_calculatorInput {
  year: number;
  month: number;
  day: number;
  hour: number;
}

export const Moon_phase_calculatorInputSchema = z.object({
  year: z.number().default(2023),
  month: z.number().default(1),
  day: z.number().default(1),
  hour: z.number().default(0),
});

function evaluateAllFormulas(input: Moon_phase_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (() => { let y = year; let m = month; let d = day + hour/24; if (m <= 2) { y -= 1; m += 12; } let A = Math.floor(y/100); let B = 2 - A + Math.floor(A/4); return Math.floor(365.25*(y+4716)) + Math.floor(30.6001*(m+1)) + d + B - 1524.5; })(); results["jd"] = Number.isFinite(v) ? v : 0; } catch { results["jd"] = 0; }
  try { const v = (((results["jd"] ?? 0) - 2451549.5) % 29.53058867) / 29.53058867; results["moonPhaseFraction"] = Number.isFinite(v) ? v : 0; } catch { results["moonPhaseFraction"] = 0; }
  try { const v = ((results["jd"] ?? 0) - 2451549.5) % 29.53058867; results["moonAgeDays"] = Number.isFinite(v) ? v : 0; } catch { results["moonAgeDays"] = 0; }
  try { const v = 50*(1 - Math.cos(2*Math.PI*(results["moonPhaseFraction"] ?? 0))); results["illuminationPercent"] = Number.isFinite(v) ? v : 0; } catch { results["illuminationPercent"] = 0; }
  return results;
}


export function calculateMoon_phase_calculator(input: Moon_phase_calculatorInput): Moon_phase_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["moonPhaseFraction"] ?? 0;
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


export interface Moon_phase_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
