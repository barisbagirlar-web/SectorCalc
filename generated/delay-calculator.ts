// Auto-generated from delay-calculator-schema.json
import * as z from 'zod';

export interface Delay_calculatorInput {
  setupDelay: number;
  queueDelay: number;
  processDelay: number;
  transportDelay: number;
  unplannedDelay: number;
  dataConfidence?: number;
}

export const Delay_calculatorInputSchema = z.object({
  setupDelay: z.number().default(0),
  queueDelay: z.number().default(0),
  processDelay: z.number().default(0),
  transportDelay: z.number().default(0),
  unplannedDelay: z.number().default(0),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Delay_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.setupDelay + input.queueDelay + input.processDelay + input.transportDelay + input.unplannedDelay; results["totalDelay"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalDelay"] = 0; }
  try { const v = input.setupDelay; results["setupDelay"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["setupDelay"] = 0; }
  try { const v = input.queueDelay; results["queueDelay"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["queueDelay"] = 0; }
  try { const v = input.processDelay; results["processDelay"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["processDelay"] = 0; }
  try { const v = input.transportDelay; results["transportDelay"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["transportDelay"] = 0; }
  try { const v = input.unplannedDelay; results["unplannedDelay"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["unplannedDelay"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateDelay_calculator(input: Delay_calculatorInput): Delay_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalDelay"]);
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


export interface Delay_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
