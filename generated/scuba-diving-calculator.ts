// Auto-generated from scuba-diving-calculator-schema.json
import * as z from 'zod';

export interface Scuba_diving_calculatorInput {
  tankVolume: number;
  startPressure: number;
  reservePressure: number;
  diveDepth: number;
  sacRate: number;
  waterDensity: number;
  dataConfidence?: number;
}

export const Scuba_diving_calculatorInputSchema = z.object({
  tankVolume: z.number().default(12),
  startPressure: z.number().default(200),
  reservePressure: z.number().default(50),
  diveDepth: z.number().default(18),
  sacRate: z.number().default(20),
  waterDensity: z.number().default(1.03),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Scuba_diving_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 1 + (input.diveDepth / 10) * input.waterDensity; results["ambientPressure"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["ambientPressure"] = 0; }
  try { const v = (input.startPressure - input.reservePressure) * input.tankVolume; results["totalGas"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalGas"] = 0; }
  try { const v = input.sacRate * (asFormulaNumber(results["ambientPressure"])); results["breathingRateDepth"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["breathingRateDepth"] = 0; }
  try { const v = (asFormulaNumber(results["totalGas"])) / (asFormulaNumber(results["breathingRateDepth"])); results["maxDiveTime"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["maxDiveTime"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateScuba_diving_calculator(input: Scuba_diving_calculatorInput): Scuba_diving_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["maxDiveTime"]);
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


export interface Scuba_diving_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
