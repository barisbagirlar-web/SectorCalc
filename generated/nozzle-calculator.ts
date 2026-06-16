// Auto-generated from nozzle-calculator-schema.json
import * as z from 'zod';

export interface Nozzle_calculatorInput {
  pressureDrop: number;
  diameter: number;
  dischargeCoefficient: number;
  density: number;
  viscosity: number;
}

export const Nozzle_calculatorInputSchema = z.object({
  pressureDrop: z.number().default(1),
  diameter: z.number().default(10),
  dischargeCoefficient: z.number().default(0.98),
  density: z.number().default(1000),
  viscosity: z.number().default(0.000001),
});

function evaluateAllFormulas(input: Nozzle_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.PI * (input.diameter / 1000) ** 2 / 4; results["area"] = Number.isFinite(v) ? v : 0; } catch { results["area"] = 0; }
  try { const v = input.pressureDrop * 100000; results["deltaP_Pa"] = Number.isFinite(v) ? v : 0; } catch { results["deltaP_Pa"] = 0; }
  try { const v = input.dischargeCoefficient * (results["area"] ?? 0) * Math.sqrt(2 * (results["deltaP_Pa"] ?? 0) / input.density); results["flowRate"] = Number.isFinite(v) ? v : 0; } catch { results["flowRate"] = 0; }
  try { const v = (results["flowRate"] ?? 0) * input.density; results["massFlowRate"] = Number.isFinite(v) ? v : 0; } catch { results["massFlowRate"] = 0; }
  try { const v = (results["flowRate"] ?? 0) / (results["area"] ?? 0); results["velocity"] = Number.isFinite(v) ? v : 0; } catch { results["velocity"] = 0; }
  try { const v = (results["velocity"] ?? 0) * (input.diameter / 1000) / input.viscosity; results["reynoldsNumber"] = Number.isFinite(v) ? v : 0; } catch { results["reynoldsNumber"] = 0; }
  return results;
}


export function calculateNozzle_calculator(input: Nozzle_calculatorInput): Nozzle_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["flowRate"] ?? 0;
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


export interface Nozzle_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
