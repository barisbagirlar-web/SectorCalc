// Auto-generated from peak-demand-calculator-schema.json
import * as z from 'zod';

export interface Peak_demand_calculatorInput {
  connectedLoad: number;
  demandFactor: number;
  powerFactor: number;
  reserveMargin: number;
  dataConfidence?: number;
}

export const Peak_demand_calculatorInputSchema = z.object({
  connectedLoad: z.number().default(100),
  demandFactor: z.number().default(0.8),
  powerFactor: z.number().default(0.9),
  reserveMargin: z.number().default(10),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Peak_demand_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.connectedLoad * input.demandFactor * (1 + input.reserveMargin / 100); results["peakDemand_kW"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["peakDemand_kW"] = 0; }
  try { const v = (asFormulaNumber(results["peakDemand_kW"])) / input.powerFactor; results["peakDemand_kVA"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["peakDemand_kVA"] = 0; }
  try { const v = ((asFormulaNumber(results["peakDemand_kW"])) / input.connectedLoad) * 100; results["demandPercentage"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["demandPercentage"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculatePeak_demand_calculator(input: Peak_demand_calculatorInput): Peak_demand_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["peakDemand_kW"]);
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


export interface Peak_demand_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
