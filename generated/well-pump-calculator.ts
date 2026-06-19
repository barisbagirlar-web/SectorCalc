// Auto-generated from well-pump-calculator-schema.json
import * as z from 'zod';

export interface Well_pump_calculatorInput {
  staticWaterLevel: number;
  drawdown: number;
  dischargeHead: number;
  frictionLoss: number;
  flowRate: number;
  pumpEfficiency: number;
  dataConfidence?: number;
}

export const Well_pump_calculatorInputSchema = z.object({
  staticWaterLevel: z.number().default(10),
  drawdown: z.number().default(5),
  dischargeHead: z.number().default(20),
  frictionLoss: z.number().default(2),
  flowRate: z.number().default(10),
  pumpEfficiency: z.number().default(70),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Well_pump_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.staticWaterLevel + input.drawdown + input.dischargeHead + input.frictionLoss; results["totalDynamicHead"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalDynamicHead"] = 0; }
  try { const v = (input.flowRate * (asFormulaNumber(results["totalDynamicHead"])) * 9.81) / 3600; results["hydraulicPower"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["hydraulicPower"] = 0; }
  try { const v = (asFormulaNumber(results["hydraulicPower"])) / (input.pumpEfficiency / 100); results["pumpPower"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["pumpPower"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateWell_pump_calculator(input: Well_pump_calculatorInput): Well_pump_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["pumpPower"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? Math.max(0, totalWasteCost * (input.dataConfidence / 100))
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
