// Auto-generated from electrical-panel-calculator-schema.json
import * as z from 'zod';

export interface Electrical_panel_calculatorInput {
  voltage: number;
  phases: number;
  numberOfCircuits: number;
  loadPerCircuit: number;
  diversityFactor: number;
  powerFactor: number;
}

export const Electrical_panel_calculatorInputSchema = z.object({
  voltage: z.number().default(400),
  phases: z.number().default(3),
  numberOfCircuits: z.number().default(10),
  loadPerCircuit: z.number().default(20),
  diversityFactor: z.number().default(0.8),
  powerFactor: z.number().default(0.85),
});

function evaluateAllFormulas(input: Electrical_panel_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.numberOfCircuits * input.loadPerCircuit * input.diversityFactor; results["totalCurrent"] = Number.isFinite(v) ? v : 0; } catch { results["totalCurrent"] = 0; }
  try { const v = input.phases === 3 ? (Math.sqrt(3) * input.voltage * (results["totalCurrent"] ?? 0) * input.powerFactor / 1000) : (input.voltage * (results["totalCurrent"] ?? 0) * input.powerFactor / 1000); results["totalLoadkW"] = Number.isFinite(v) ? v : 0; } catch { results["totalLoadkW"] = 0; }
  try { const v = (results["totalLoadkW"] ?? 0) / input.powerFactor; results["totalLoadkVA"] = Number.isFinite(v) ? v : 0; } catch { results["totalLoadkVA"] = 0; }
  try { const v = (results["totalLoadkVA"] ?? 0) * 1.25; results["requiredPanelRating"] = Number.isFinite(v) ? v : 0; } catch { results["requiredPanelRating"] = 0; }
  try { const v = (results["totalLoadkVA"] ?? 0) * 1000 / (input.phases === 3 ? (Math.sqrt(3) * input.voltage) : input.voltage); results["mainBreakerCurrent"] = Number.isFinite(v) ? v : 0; } catch { results["mainBreakerCurrent"] = 0; }
  return results;
}


export function calculateElectrical_panel_calculator(input: Electrical_panel_calculatorInput): Electrical_panel_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["requiredPanelRating"] ?? 0;
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


export interface Electrical_panel_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
