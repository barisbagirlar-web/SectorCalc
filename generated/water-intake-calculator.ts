// Auto-generated from water-intake-calculator-schema.json
import * as z from 'zod';

export interface Water_intake_calculatorInput {
  numEmployees: number;
  workDaysPerYear: number;
  avgWaterUsePerPersonPerDay: number;
  processWaterIntensity: number;
  annualProductionUnits: number;
  leakageFactor: number;
  recyclingRate: number;
  seasonalFactor: number;
  dataConfidence?: number;
}

export const Water_intake_calculatorInputSchema = z.object({
  numEmployees: z.number().min(1).max(100000).default(100),
  workDaysPerYear: z.number().min(1).max(365).default(250),
  avgWaterUsePerPersonPerDay: z.number().min(0).max(500).default(50),
  processWaterIntensity: z.number().min(0).max(1000).default(10),
  annualProductionUnits: z.number().min(0).max(100000000).default(50000),
  leakageFactor: z.number().min(0).max(50).default(5),
  recyclingRate: z.number().min(0).max(100).default(20),
  seasonalFactor: z.number().min(0.5).max(2).default(1),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Water_intake_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.numEmployees * input.workDaysPerYear * input.avgWaterUsePerPersonPerDay * input.processWaterIntensity; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["normalized_product"] = 0; }
  try { const v = input.numEmployees * input.workDaysPerYear * input.avgWaterUsePerPersonPerDay * input.processWaterIntensity * (input.annualProductionUnits * (input.leakageFactor / 100) * (input.recyclingRate / 100) * input.seasonalFactor); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.annualProductionUnits * (input.leakageFactor / 100) * (input.recyclingRate / 100) * input.seasonalFactor; results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["adjustment_factor"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateWater_intake_calculator(input: Water_intake_calculatorInput): Water_intake_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["result"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Model uses normalized input chain — validate units","Assumption-heavy without site benchmark"];
  const suggestedActions: string[] = ["Cross-check with historical actuals","Run sensitivity on top 2 inputs"];
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis"],
  };
}


export interface Water_intake_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
