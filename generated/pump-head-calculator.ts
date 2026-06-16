// Auto-generated from pump-head-calculator-schema.json
import * as z from 'zod';

export interface Pump_head_calculatorInput {
  suctionHead: number;
  dischargeHead: number;
  flowRate: number;
  pipeLength: number;
  pipeDiameter: number;
  roughnessCoefficient: number;
}

export const Pump_head_calculatorInputSchema = z.object({
  suctionHead: z.number().default(0),
  dischargeHead: z.number().default(10),
  flowRate: z.number().default(10),
  pipeLength: z.number().default(50),
  pipeDiameter: z.number().default(100),
  roughnessCoefficient: z.number().default(120),
});

function evaluateAllFormulas(input: Pump_head_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.dischargeHead - input.suctionHead; results["staticHead"] = Number.isFinite(v) ? v : 0; } catch { results["staticHead"] = 0; }
  try { const v = input.flowRate / 1000; results["Q"] = Number.isFinite(v) ? v : 0; } catch { results["Q"] = 0; }
  try { const v = input.pipeDiameter / 1000; results["d"] = Number.isFinite(v) ? v : 0; } catch { results["d"] = 0; }
  try { const v = 10.67 * input.pipeLength * Math.pow((results["Q"] ?? 0) / input.roughnessCoefficient, 1.852) / Math.pow((results["d"] ?? 0), 4.87); results["frictionLoss"] = Number.isFinite(v) ? v : 0; } catch { results["frictionLoss"] = 0; }
  try { const v = (results["staticHead"] ?? 0) + (results["frictionLoss"] ?? 0); results["totalHead"] = Number.isFinite(v) ? v : 0; } catch { results["totalHead"] = 0; }
  return results;
}


export function calculatePump_head_calculator(input: Pump_head_calculatorInput): Pump_head_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalHead"] ?? 0;
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


export interface Pump_head_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
