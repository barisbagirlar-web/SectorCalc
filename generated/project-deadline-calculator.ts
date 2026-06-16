// Auto-generated from project-deadline-calculator-schema.json
import * as z from 'zod';

export interface Project_deadline_calculatorInput {
  totalTasks: number;
  tasksPerDay: number;
  teamSize: number;
  complexityFactor: number;
  contingencyPercent: number;
}

export const Project_deadline_calculatorInputSchema = z.object({
  totalTasks: z.number().default(100),
  tasksPerDay: z.number().default(5),
  teamSize: z.number().default(3),
  complexityFactor: z.number().default(1.2),
  contingencyPercent: z.number().default(15),
});

function evaluateAllFormulas(input: Project_deadline_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.totalTasks / (input.tasksPerDay * input.teamSize)) * input.complexityFactor; results["baseDays"] = Number.isFinite(v) ? v : 0; } catch { results["baseDays"] = 0; }
  try { const v = (results["baseDays"] ?? 0) * (1 + input.contingencyPercent / 100); results["totalDays"] = Number.isFinite(v) ? v : 0; } catch { results["totalDays"] = 0; }
  try { const v = (results["totalDays"] ?? 0) - (results["baseDays"] ?? 0); results["contingencyDays"] = Number.isFinite(v) ? v : 0; } catch { results["contingencyDays"] = 0; }
  return results;
}


export function calculateProject_deadline_calculator(input: Project_deadline_calculatorInput): Project_deadline_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalDays"] ?? 0;
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


export interface Project_deadline_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
