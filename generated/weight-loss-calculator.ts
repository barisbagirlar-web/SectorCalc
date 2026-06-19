// Auto-generated from weight-loss-calculator-schema.json
import * as z from 'zod';

export interface Weight_loss_calculatorInput {
  initialWeight: number;
  initialMoisture: number;
  finalMoisture: number;
  targetWeightLoss: number;
  dataConfidence?: number;
}

export const Weight_loss_calculatorInputSchema = z.object({
  initialWeight: z.number().default(100),
  initialMoisture: z.number().default(50),
  finalMoisture: z.number().default(10),
  targetWeightLoss: z.number().default(40),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Weight_loss_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.initialWeight / (1 + input.initialMoisture / 100); results["boneDryWeight"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["boneDryWeight"] = 0; }
  try { const v = (asFormulaNumber(results["boneDryWeight"])) * (1 + input.finalMoisture / 100); results["finalWeight"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["finalWeight"] = 0; }
  try { const v = input.initialWeight - (asFormulaNumber(results["finalWeight"])); results["weightLoss"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["weightLoss"] = 0; }
  try { const v = ((asFormulaNumber(results["weightLoss"])) / input.initialWeight) * 100; results["percentageLoss"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["percentageLoss"] = 0; }
  try { const v = input.targetWeightLoss - (asFormulaNumber(results["weightLoss"])); results["targetDelta"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["targetDelta"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateWeight_loss_calculator(input: Weight_loss_calculatorInput): Weight_loss_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["weightLoss"]));
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


export interface Weight_loss_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
