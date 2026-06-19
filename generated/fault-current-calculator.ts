// Auto-generated from fault-current-calculator-schema.json
import * as z from 'zod';

export interface Fault_current_calculatorInput {
  primaryVoltage: number;
  secondaryVoltage: number;
  sourceSCMVA: number;
  transformerKVA: number;
  transformerPercentZ: number;
  dataConfidence?: number;
}

export const Fault_current_calculatorInputSchema = z.object({
  primaryVoltage: z.number().default(34.5),
  secondaryVoltage: z.number().default(480),
  sourceSCMVA: z.number().default(500),
  transformerKVA: z.number().default(1000),
  transformerPercentZ: z.number().default(5.75),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Fault_current_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.primaryVoltage * input.secondaryVoltage * input.sourceSCMVA * input.transformerKVA; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["normalized_product"] = 0; }
  try { const v = input.primaryVoltage * input.secondaryVoltage * input.sourceSCMVA * input.transformerKVA * ((input.transformerPercentZ / 100)); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  try { const v = (input.transformerPercentZ / 100); results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["adjustment_factor"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateFault_current_calculator(input: Fault_current_calculatorInput): Fault_current_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Model uses normalized input chain — validate units","Assumption-heavy without site benchmark"];
  const suggestedActions: string[] = ["Cross-check with historical actuals","Run sensitivity on top 2 inputs"];
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


export interface Fault_current_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
