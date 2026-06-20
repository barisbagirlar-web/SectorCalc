// Auto-generated from scrap-rate-optimizer-calculator-schema.json
import * as z from 'zod';

export interface Scrap_rate_optimizer_calculatorInput {
  total_units_produced: number;
  defective_units: number;
  rework_units: number;
  material_cost_per_unit: number;
  labor_cost_per_unit: number;
  overhead_cost_per_unit: number;
  process_stage: string;
  defect_type: string;
  dataConfidence?: number;
}

export const Scrap_rate_optimizer_calculatorInputSchema = z.object({
  total_units_produced: z.number().min(1).max(10000000).default(10000),
  defective_units: z.number().min(0).max(10000000).default(500),
  rework_units: z.number().min(0).max(10000000).default(200),
  material_cost_per_unit: z.number().min(0.01).max(10000).default(5.5),
  labor_cost_per_unit: z.number().min(0.01).max(10000).default(2.75),
  overhead_cost_per_unit: z.number().min(0.01).max(10000).default(1.25),
  process_stage: z.enum(['raw_material', 'machining', 'assembly', 'final_assembly', 'packaging']).default('final_assembly'),
  defect_type: z.enum(['dimensional', 'surface', 'material', 'assembly', 'functional', 'cosmetic']).default('dimensional'),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Scrap_rate_optimizer_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.defective_units / input.total_units_produced) * 100; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  try { const v = input.defective_units * (input.material_cost_per_unit + input.labor_cost_per_unit + input.overhead_cost_per_unit); results["scrap_cost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["scrap_cost"] = Number.NaN; }
  try { const v = input.rework_units * (input.material_cost_per_unit + input.labor_cost_per_unit + input.overhead_cost_per_unit); results["rework_cost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["rework_cost"] = Number.NaN; }
  try { const v = ((input.defective_units + input.rework_units) / input.total_units_produced) * 100; results["total_scrap_rate"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["total_scrap_rate"] = Number.NaN; }
  return results;
}


export function calculateScrap_rate_optimizer_calculator(input: Scrap_rate_optimizer_calculatorInput): Scrap_rate_optimizer_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    scrap_cost: toNumericFormulaValue(values["scrap_cost"]),
    rework_cost: toNumericFormulaValue(values["rework_cost"])
  };
  const hiddenLossDrivers: string[] = ["Inadequate process control","Poor raw material quality"];
  const suggestedActions: string[] = ["Implement SPC for real-time monitoring","Conduct root cause analysis on top defect types"];
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
    unit: "%",
    premiumRequired: true,
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Real-time dashboard","Multi-plant comparison","Automated alerting"],
  };
}


export interface Scrap_rate_optimizer_calculatorOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { scrap_cost: number; rework_cost: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Scrap_rate_optimizer_calculatorOutputMeta = {
  primaryKey: "result",
  unit: "%",
  breakdownKeys: ["scrap_cost","rework_cost"],
} as const;

