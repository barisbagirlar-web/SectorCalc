// Auto-generated from saps-ii-calculator-schema.json
import * as z from 'zod';

export interface Saps_ii_calculatorInput {
  age: number;
  heartRate: number;
  systolicBP: number;
  temperature: number;
  ventilation: number;
  paO2FiO2: number;
  urineOutput: number;
  serumUrea: number;
}

export const Saps_ii_calculatorInputSchema = z.object({
  age: z.number().default(60),
  heartRate: z.number().default(80),
  systolicBP: z.number().default(120),
  temperature: z.number().default(37),
  ventilation: z.number().default(0),
  paO2FiO2: z.number().default(0),
  urineOutput: z.number().default(1.5),
  serumUrea: z.number().default(5),
});

function evaluateAllFormulas(input: Saps_ii_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.age < 40) ? 0 : (input.age < 60) ? 7 : (input.age < 70) ? 12 : (input.age < 75) ? 15 : (input.age < 80) ? 16 : 18; results["agePoints"] = Number.isFinite(v) ? v : 0; } catch { results["agePoints"] = 0; }
  try { const v = (input.heartRate < 40) ? 11 : (input.heartRate < 70) ? 2 : (input.heartRate < 120) ? 0 : (input.heartRate < 160) ? 4 : 7; results["hrPoints"] = Number.isFinite(v) ? v : 0; } catch { results["hrPoints"] = 0; }
  try { const v = (input.systolicBP < 70) ? 13 : (input.systolicBP < 100) ? 5 : (input.systolicBP < 200) ? 0 : 2; results["sysBPPoints"] = Number.isFinite(v) ? v : 0; } catch { results["sysBPPoints"] = 0; }
  try { const v = (input.temperature >= 39) ? 3 : 0; results["tempPoints"] = Number.isFinite(v) ? v : 0; } catch { results["tempPoints"] = 0; }
  try { const v = (input.ventilation === 1) ? ((input.paO2FiO2 < 100) ? 11 : (input.paO2FiO2 < 200) ? 9 : 6) : 0; results["ventPoints"] = Number.isFinite(v) ? v : 0; } catch { results["ventPoints"] = 0; }
  try { const v = (input.urineOutput < 0.5) ? 11 : (input.urineOutput < 1) ? 4 : 0; results["urinePoints"] = Number.isFinite(v) ? v : 0; } catch { results["urinePoints"] = 0; }
  try { const v = (input.serumUrea < 10) ? 0 : (input.serumUrea < 30) ? 6 : 10; results["ureaPoints"] = Number.isFinite(v) ? v : 0; } catch { results["ureaPoints"] = 0; }
  try { const v = (results["agePoints"] ?? 0) + (results["hrPoints"] ?? 0) + (results["sysBPPoints"] ?? 0) + (results["tempPoints"] ?? 0) + (results["ventPoints"] ?? 0) + (results["urinePoints"] ?? 0) + (results["ureaPoints"] ?? 0); results["saps2Score"] = Number.isFinite(v) ? v : 0; } catch { results["saps2Score"] = 0; }
  return results;
}


export function calculateSaps_ii_calculator(input: Saps_ii_calculatorInput): Saps_ii_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["saps2Score"] ?? 0;
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


export interface Saps_ii_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
