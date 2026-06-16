// Auto-generated from fault-current-calculator-schema.json
import * as z from 'zod';

export interface Fault_current_calculatorInput {
  primaryVoltage: number;
  secondaryVoltage: number;
  sourceSCMVA: number;
  transformerKVA: number;
  transformerPercentZ: number;
}

export const Fault_current_calculatorInputSchema = z.object({
  primaryVoltage: z.number().default(34.5),
  secondaryVoltage: z.number().default(480),
  sourceSCMVA: z.number().default(500),
  transformerKVA: z.number().default(1000),
  transformerPercentZ: z.number().default(5.75),
});

function evaluateAllFormulas(input: Fault_current_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.pow(input.primaryVoltage, 2) / input.sourceSCMVA; results["sourceImpedancePrim"] = Number.isFinite(v) ? v : 0; } catch { results["sourceImpedancePrim"] = 0; }
  try { const v = (results["sourceImpedancePrim"] ?? 0) * Math.pow((input.secondaryVoltage / 1000) / input.primaryVoltage, 2); results["sourceImpedanceSec"] = Number.isFinite(v) ? v : 0; } catch { results["sourceImpedanceSec"] = 0; }
  try { const v = (input.transformerPercentZ / 100) * Math.pow(input.secondaryVoltage, 2) / (input.transformerKVA * 1000); results["transformerImpedance"] = Number.isFinite(v) ? v : 0; } catch { results["transformerImpedance"] = 0; }
  try { const v = (results["sourceImpedanceSec"] ?? 0) + (results["transformerImpedance"] ?? 0); results["totalImpedance"] = Number.isFinite(v) ? v : 0; } catch { results["totalImpedance"] = 0; }
  try { const v = input.secondaryVoltage / (Math.sqrt(3) * (results["totalImpedance"] ?? 0)) / 1000; results["faultCurrentKA"] = Number.isFinite(v) ? v : 0; } catch { results["faultCurrentKA"] = 0; }
  return results;
}


export function calculateFault_current_calculator(input: Fault_current_calculatorInput): Fault_current_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["faultCurrentKA"] ?? 0;
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


export interface Fault_current_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
