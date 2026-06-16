// Auto-generated from fiber-cement-siding-estimator-calculator-schema.json
import * as z from 'zod';

export interface Fiber_cement_siding_estimator_calculatorInput {
  wallArea: number;
  panelLength: number;
  panelWidth: number;
  wasteFactor: number;
  costPerPanel: number;
  laborHoursPerPanel: number;
  laborCostPerHour: number;
}

export const Fiber_cement_siding_estimator_calculatorInputSchema = z.object({
  wallArea: z.number().default(100),
  panelLength: z.number().default(3.66),
  panelWidth: z.number().default(0.2),
  wasteFactor: z.number().default(10),
  costPerPanel: z.number().default(5),
  laborHoursPerPanel: z.number().default(0.1),
  laborCostPerHour: z.number().default(50),
});

function evaluateAllFormulas(input: Fiber_cement_siding_estimator_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.panelLength * input.panelWidth; results["panelArea"] = Number.isFinite(v) ? v : 0; } catch { results["panelArea"] = 0; }
  try { const v = input.wallArea * (1 + input.wasteFactor / 100); results["adjustedArea"] = Number.isFinite(v) ? v : 0; } catch { results["adjustedArea"] = 0; }
  try { const v = Math.ceil((results["adjustedArea"] ?? 0) / (results["panelArea"] ?? 0)); results["numberOfPanels"] = Number.isFinite(v) ? v : 0; } catch { results["numberOfPanels"] = 0; }
  try { const v = (results["numberOfPanels"] ?? 0) * input.costPerPanel; results["totalMaterialCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalMaterialCost"] = 0; }
  try { const v = (results["numberOfPanels"] ?? 0) * input.laborHoursPerPanel * input.laborCostPerHour; results["totalLaborCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalLaborCost"] = 0; }
  try { const v = (results["totalMaterialCost"] ?? 0) + (results["totalLaborCost"] ?? 0); results["totalCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalCost"] = 0; }
  try { const v = (results["adjustedArea"] ?? 0) - input.wallArea; results["wasteMaterialArea"] = Number.isFinite(v) ? v : 0; } catch { results["wasteMaterialArea"] = 0; }
  return results;
}


export function calculateFiber_cement_siding_estimator_calculator(input: Fiber_cement_siding_estimator_calculatorInput): Fiber_cement_siding_estimator_calculatorOutput {
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


export interface Fiber_cement_siding_estimator_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
