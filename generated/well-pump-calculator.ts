// Auto-generated from well-pump-calculator-schema.json
import * as z from 'zod';

export interface Well_pump_calculatorInput {
  staticWaterLevel: number;
  drawdown: number;
  dischargeHead: number;
  frictionLoss: number;
  flowRate: number;
  pumpEfficiency: number;
}

export const Well_pump_calculatorInputSchema = z.object({
  staticWaterLevel: z.number().default(10),
  drawdown: z.number().default(5),
  dischargeHead: z.number().default(20),
  frictionLoss: z.number().default(2),
  flowRate: z.number().default(10),
  pumpEfficiency: z.number().default(70),
});

function evaluateAllFormulas(input: Well_pump_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.staticWaterLevel + input.drawdown + input.dischargeHead + input.frictionLoss; results["totalDynamicHead"] = Number.isFinite(v) ? v : 0; } catch { results["totalDynamicHead"] = 0; }
  try { const v = (input.flowRate * (results["totalDynamicHead"] ?? 0) * 9.81) / 3600; results["hydraulicPower"] = Number.isFinite(v) ? v : 0; } catch { results["hydraulicPower"] = 0; }
  try { const v = (results["hydraulicPower"] ?? 0) / (input.pumpEfficiency / 100); results["pumpPower"] = Number.isFinite(v) ? v : 0; } catch { results["pumpPower"] = 0; }
  return results;
}


export function calculateWell_pump_calculator(input: Well_pump_calculatorInput): Well_pump_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["pumpPower"] ?? 0;
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


export interface Well_pump_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
