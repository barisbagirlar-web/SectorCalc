// Auto-generated from project-cost-calculator-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface ProjectCostCalculatorInput {
  projectDuration: number;
  teamSize: number;
  avgHourlyRate: number;
  hoursPerWeekPerFte: number;
  weeksPerMonth: number;
  materialCost: number;
  equipmentCost: number;
  overheadRate: number;
  contingencyRate: number;
  profitMargin: number;
  dataConfidence: 'low' | 'medium' | 'high';
}

export const ProjectCostCalculatorInputSchema = z.object({
  projectDuration: z.number().min(1).max(120).default(12),
  teamSize: z.number().min(1).max(1000).default(5),
  avgHourlyRate: z.number().min(0).max(500).default(50),
  hoursPerWeekPerFte: z.number().min(1).max(80).default(40),
  weeksPerMonth: z.number().min(4).max(4.5).default(4.33),
  materialCost: z.number().min(0).max(10000000).default(10000),
  equipmentCost: z.number().min(0).max(10000000).default(5000),
  overheadRate: z.number().min(0).max(100).default(20),
  contingencyRate: z.number().min(0).max(50).default(10),
  profitMargin: z.number().min(0).max(100).default(15),
  dataConfidence: z.enum(['low', 'medium', 'high']).default('medium'),
});

export interface ProjectCostCalculatorOutput {
  totalRevenue: number;
  breakdown: {
    laborCost: number;
    materialCost: number;
    equipmentCost: number;
    overheadCost: number;
    contingencyCost: number;
    totalCost: number;
    profitAmount: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: ProjectCostCalculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.laborCost = ((): number => { try { const __v = input.teamSize * input.avgHourlyRate * input.hoursPerWeekPerFte * input.weeksPerMonth * input.projectDuration; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.directCost = ((): number => { try { const __v = results.laborCost + input.materialCost + input.equipmentCost; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.overheadCost = ((): number => { try { const __v = results.directCost * (input.overheadRate / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalCostBeforeContingency = ((): number => { try { const __v = results.directCost + results.overheadCost; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.contingencyCost = ((): number => { try { const __v = results.totalCostBeforeContingency * (input.contingencyRate / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalCost = ((): number => { try { const __v = results.totalCostBeforeContingency + results.contingencyCost; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalRevenue = ((): number => { try { const __v = results.totalCost / (1 - input.profitMargin / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.profitAmount = ((): number => { try { const __v = results.totalRevenue - results.totalCost; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.dataConfidenceAdjusted = ((): number => { try { const __v = results.totalRevenue * (input.dataConfidence == 'low' ? 1.2 : (input.dataConfidence == 'medium' ? 1.0 : 0.9)); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateProjectCostCalculator(input: ProjectCostCalculatorInput): ProjectCostCalculatorOutput {
  const results = evaluateFormulas(input);
  const totalRevenue = results.totalRevenue ?? 0;
  const breakdown = {
    laborCost: results.laborCost,
    materialCost: results.materialCost,
    equipmentCost: results.equipmentCost,
    overheadCost: results.overheadCost,
    contingencyCost: results.contingencyCost,
    totalCost: results.totalCost,
    profitAmount: results.profitAmount,
  };

  // rule: projectDuration must be >= 1 and <= 120
  // rule: teamSize must be >= 1 and <= 1000
  // rule: avgHourlyRate must be >= 0 and <= 500
  // rule: hoursPerWeekPerFte must be >= 1 and <= 80
  // rule: weeksPerMonth must be >= 4 and <= 4.5
  // rule: materialCost must be >= 0
  // rule: equipmentCost must be >= 0
  // rule: overheadRate must be >= 0 and <= 100
  // rule: contingencyRate must be >= 0 and <= 50
  // rule: profitMargin must be >= 0 and <= 100
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): Overhead rate exceeds typical maximum; verify allocation.
  // threshold skipped (non-JS): Contingency rate high; consider risk reassessment.
  // threshold skipped (non-JS): Profit margin unusually high; check market competitiveness.
  // threshold skipped (non-JS): Hourly rate above typical; ensure justification.

  const dataConfidenceAdjusted = (() => { try { return results.dataConfidenceAdjusted; } catch { return totalRevenue; } })();

  return {
    totalRevenue,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF Export","CSV Export","Trend Analysis","Scenario Comparison","Detailed Report with Charts"],
  };
}
