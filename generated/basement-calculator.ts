// Auto-generated from basement-calculator-schema.json
import * as z from 'zod';

export interface Basement_calculatorInput {
  length: number;
  width: number;
  depth: number;
  wallThickness: number;
  floorThickness: number;
  concreteCost: number;
  waterproofingCost: number;
}

export const Basement_calculatorInputSchema = z.object({
  length: z.number().default(10),
  width: z.number().default(8),
  depth: z.number().default(3),
  wallThickness: z.number().default(25),
  floorThickness: z.number().default(20),
  concreteCost: z.number().default(1200),
  waterproofingCost: z.number().default(50),
});

function evaluateAllFormulas(input: Basement_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.length * input.width; results["floorArea"] = Number.isFinite(v) ? v : 0; } catch { results["floorArea"] = 0; }
  try { const v = 2 * (input.length + input.width) * input.depth; results["wallArea"] = Number.isFinite(v) ? v : 0; } catch { results["wallArea"] = 0; }
  try { const v = (results["wallArea"] ?? 0) * (input.wallThickness / 100); results["wallConcreteVolume"] = Number.isFinite(v) ? v : 0; } catch { results["wallConcreteVolume"] = 0; }
  try { const v = (results["floorArea"] ?? 0) * (input.floorThickness / 100); results["floorConcreteVolume"] = Number.isFinite(v) ? v : 0; } catch { results["floorConcreteVolume"] = 0; }
  try { const v = (results["wallConcreteVolume"] ?? 0) + (results["floorConcreteVolume"] ?? 0); results["totalConcreteVolume"] = Number.isFinite(v) ? v : 0; } catch { results["totalConcreteVolume"] = 0; }
  try { const v = (results["floorArea"] ?? 0) + (results["wallArea"] ?? 0); results["waterproofingArea"] = Number.isFinite(v) ? v : 0; } catch { results["waterproofingArea"] = 0; }
  try { const v = (results["totalConcreteVolume"] ?? 0) * input.concreteCost; results["concreteCostAmount"] = Number.isFinite(v) ? v : 0; } catch { results["concreteCostAmount"] = 0; }
  try { const v = (results["waterproofingArea"] ?? 0) * input.waterproofingCost; results["waterproofingCostAmount"] = Number.isFinite(v) ? v : 0; } catch { results["waterproofingCostAmount"] = 0; }
  try { const v = (results["concreteCostAmount"] ?? 0) + (results["waterproofingCostAmount"] ?? 0); results["totalCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalCost"] = 0; }
  return results;
}


export function calculateBasement_calculator(input: Basement_calculatorInput): Basement_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalCost"] ?? 0;
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


export interface Basement_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
