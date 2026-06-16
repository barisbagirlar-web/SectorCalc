// Auto-generated from peak-demand-calculator-schema.json
import * as z from 'zod';

export interface Peak_demand_calculatorInput {
  connectedLoad: number;
  demandFactor: number;
  powerFactor: number;
  reserveMargin: number;
}

export const Peak_demand_calculatorInputSchema = z.object({
  connectedLoad: z.number().default(100),
  demandFactor: z.number().default(0.8),
  powerFactor: z.number().default(0.9),
  reserveMargin: z.number().default(10),
});

function evaluateAllFormulas(input: Peak_demand_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.connectedLoad * input.demandFactor * (1 + input.reserveMargin / 100); results["peakDemand_kW"] = Number.isFinite(v) ? v : 0; } catch { results["peakDemand_kW"] = 0; }
  try { const v = (results["peakDemand_kW"] ?? 0) / input.powerFactor; results["peakDemand_kVA"] = Number.isFinite(v) ? v : 0; } catch { results["peakDemand_kVA"] = 0; }
  try { const v = ((results["peakDemand_kW"] ?? 0) / input.connectedLoad) * 100; results["demandPercentage"] = Number.isFinite(v) ? v : 0; } catch { results["demandPercentage"] = 0; }
  return results;
}


export function calculatePeak_demand_calculator(input: Peak_demand_calculatorInput): Peak_demand_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["peakDemand_kW"] ?? 0;
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


export interface Peak_demand_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
