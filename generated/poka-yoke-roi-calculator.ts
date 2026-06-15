// Auto-generated from poka-yoke-roi-calculator-schema.json
import * as z from 'zod';

export interface Poka_yoke_roi_calculatorInput {
  annual_units: number;
  current_defect_rate: number;
  defect_cost_per_unit: number;
  poka_yoke_effectiveness: string;
  implementation_cost: number;
  annual_maintenance_cost: number;
  labor_hours_saved_per_year: number;
  labor_rate: number;
  discount_rate: number;
  project_life_years: number;
}

export const Poka_yoke_roi_calculatorInputSchema = z.object({
  annual_units: z.number().min(1000).max(10000000).default(100000),
  current_defect_rate: z.number().min(10).max(100000).default(5000),
  defect_cost_per_unit: z.number().min(0.5).max(5000).default(25),
  poka_yoke_effectiveness: z.enum(['80', '90', '95', '99']).default('95'),
  implementation_cost: z.number().min(500).max(500000).default(15000),
  annual_maintenance_cost: z.number().min(0).max(50000).default(2000),
  labor_hours_saved_per_year: z.number().min(0).max(10000).default(500),
  labor_rate: z.number().min(10).max(150).default(35),
  discount_rate: z.number().min(0).max(30).default(10),
  project_life_years: z.number().min(1).max(20).default(5),
});

function evaluateAllFormulas(input: Poka_yoke_roi_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { results["defects_prevented_per_year"] = input.annual_units * (input.current_defect_rate / 1000000) * (input.poka_yoke_effectiveness / 100); } catch { results["defects_prevented_per_year"] = 0; }
  try { results["annual_defect_cost_savings"] = (results["defects_prevented_per_year"] ?? 0) * input.defect_cost_per_unit; } catch { results["annual_defect_cost_savings"] = 0; }
  try { results["annual_labor_savings"] = input.labor_hours_saved_per_year * input.labor_rate; } catch { results["annual_labor_savings"] = 0; }
  try { results["total_annual_benefit"] = (results["annual_defect_cost_savings"] ?? 0) + (results["annual_labor_savings"] ?? 0); } catch { results["total_annual_benefit"] = 0; }
  try { results["net_annual_cash_flow"] = (results["total_annual_benefit"] ?? 0) - input.annual_maintenance_cost; } catch { results["net_annual_cash_flow"] = 0; }
  try { results["npv"] = -input.implementation_cost + ((results["net_annual_cash_flow"] ?? 0) * ((1 - (1 + input.discount_rate/100)^(-input.project_life_years)) / (input.discount_rate/100))); } catch { results["npv"] = 0; }
  try { results["roi"] = ((results["npv"] ?? 0) / input.implementation_cost) * 100; } catch { results["roi"] = 0; }
  return results;
}


export function calculatePoka_yoke_roi_calculator(input: Poka_yoke_roi_calculatorInput): Poka_yoke_roi_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["roi"] ?? 0;
  const breakdown = {
    defects_prevented_per_year: values["defects_prevented_per_year"] ?? 0,
    annual_defect_cost_savings: values["annual_defect_cost_savings"] ?? 0,
    annual_labor_savings: values["annual_labor_savings"] ?? 0,
    total_annual_benefit: values["total_annual_benefit"] ?? 0,
    net_annual_cash_flow: values["net_annual_cash_flow"] ?? 0,
    npv: values["npv"] ?? 0
  };
  const hiddenLossDrivers: string[] = ["Hidden Defect Escalation Cost","Hidden Quality Administration Overhead","Hidden Opportunity Cost of Downtime"];
  const suggestedActions: string[] = ["Implement poka-yoke with highest effectiveness (99%) to maximize defect reduction.","Conduct a detailed cost-of-quality study to refine defect_cost_per_unit and capture hidden costs.","Integrate poka-yoke with real-time monitoring and SPC to sustain gains and detect drift.","Train operators on poka-yoke principles to foster continuous improvement culture."];
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
    premiumRequired: true,
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Multi-scenario comparison","Custom dashboard"],
  };
}


export interface Poka_yoke_roi_calculatorOutput {
  totalWasteCost: number;
  breakdown: { defects_prevented_per_year: number; annual_defect_cost_savings: number; annual_labor_savings: number; total_annual_benefit: number; net_annual_cash_flow: number; npv: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
