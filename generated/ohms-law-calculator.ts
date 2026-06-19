// Auto-generated from ohms-law-calculator-schema.json
import * as z from 'zod';

export interface Ohms_law_calculatorInput {
  voltage: number;
  current: number;
  resistance: number;
  powerFactor: number;
  phaseType: string;
  temperature: number;
  dataConfidence?: number;
}

export const Ohms_law_calculatorInputSchema = z.object({
  voltage: z.number().min(0).max(1000000).default(230),
  current: z.number().min(0).max(100000).default(10),
  resistance: z.number().min(0).max(1000000000).default(23),
  powerFactor: z.number().min(0).max(1).default(1),
  phaseType: z.enum(['single', 'three']).default('single'),
  temperature: z.number().min(-40).max(85).default(25),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Ohms_law_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.voltage * input.current * input.resistance * input.powerFactor; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["normalized_product"] = 0; }
  try { const v = input.voltage * input.current * input.resistance * input.powerFactor * (input.temperature); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.temperature; results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["adjustment_factor"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateOhms_law_calculator(input: Ohms_law_calculatorInput): Ohms_law_calculatorOutput {
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


export interface Ohms_law_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
