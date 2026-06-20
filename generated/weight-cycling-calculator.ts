// Auto-generated from weight-cycling-calculator-schema.json
import * as z from 'zod';

export interface Weight_cycling_calculatorInput {
  mass: number;
  height: number;
  cyclesPerDay: number;
  operatingDays: number;
  efficiency: number;
  energyCost: number;
  dataConfidence?: number;
}

export const Weight_cycling_calculatorInputSchema = z.object({
  mass: z.number().min(0.1).max(1000000).default(100),
  height: z.number().min(0.01).max(200).default(5),
  cyclesPerDay: z.number().min(1).max(100000).default(100),
  operatingDays: z.number().min(1).max(366).default(250),
  efficiency: z.number().min(1).max(100).default(90),
  energyCost: z.number().min(0.001).max(1000).default(0.15),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Weight_cycling_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.mass * 9.81 * input.height) / (3.6e6) / (input.efficiency / 100); results["energyPerCycle"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["energyPerCycle"] = Number.NaN; }
  try { const v = input.cyclesPerDay * input.operatingDays; results["totalCycles"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalCycles"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["energyPerCycle"])) * (toNumericFormulaValue(results["totalCycles"])); results["totalEnergy"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalEnergy"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalEnergy"])) * input.energyCost; results["totalCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalCost"] = Number.NaN; }
  return results;
}


export function calculateWeight_cycling_calculator(input: Weight_cycling_calculatorInput): Weight_cycling_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalCost"]);
  const breakdown = {
    energyPerCycle: toNumericFormulaValue(values["energyPerCycle"]),
    totalEnergy: toNumericFormulaValue(values["totalEnergy"]),
    totalCycles: toNumericFormulaValue(values["totalCycles"])
  };
  const hiddenLossDrivers: string[] = ["Low system efficiency increases energy waste - consider motor/transmission upgrades.","High total cycle count - consider mechanical fatigue and maintenance costs."];
  const suggestedActions: string[] = ["Improve system efficiency with regular lubrication and motor maintenance.","Optimize lifting height where possible to reduce energy consumption per cycle.","Schedule heavy cycling during off-peak energy hours to reduce electricity costs."];
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


export interface Weight_cycling_calculatorOutput {
  totalWasteCost: number;
  breakdown: { energyPerCycle: number; totalEnergy: number; totalCycles: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
