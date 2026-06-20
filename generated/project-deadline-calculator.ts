// Auto-generated from project-deadline-calculator-schema.json
import * as z from 'zod';

export interface Project_deadline_calculatorInput {
  totalTasks: number;
  tasksPerDay: number;
  teamSize: number;
  complexityFactor: number;
  contingencyPercent: number;
  dataConfidence?: number;
}

export const Project_deadline_calculatorInputSchema = z.object({
  totalTasks: z.number().default(100),
  tasksPerDay: z.number().default(5),
  teamSize: z.number().default(3),
  complexityFactor: z.number().default(1.2),
  contingencyPercent: z.number().default(15),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Project_deadline_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.totalTasks / (input.tasksPerDay * input.teamSize)) * input.complexityFactor; results["baseDays"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["baseDays"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["baseDays"])) * (1 + input.contingencyPercent / 100); results["totalDays"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalDays"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalDays"])) - (toNumericFormulaValue(results["baseDays"])); results["contingencyDays"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["contingencyDays"] = Number.NaN; }
  return results;
}


export function calculateProject_deadline_calculator(input: Project_deadline_calculatorInput): Project_deadline_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalDays"]);
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


export interface Project_deadline_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
