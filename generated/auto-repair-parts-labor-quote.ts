// Auto-generated from auto-repair-parts-labor-quote-schema.json
import * as z from 'zod';

export interface Auto_repair_parts_labor_quoteInput {
  parts_cost: number;
  labor_hours: number;
  labor_rate: number;
  overhead_percent: number;
  profit_margin: number;
  tax_rate: number;
  discount_percent: number;
  parts_markup: number;
  complexity_factor: string;
  warranty_included: boolean;
}

export const Auto_repair_parts_labor_quoteInputSchema = z.object({
  parts_cost: z.number().min(0).max(100000).default(0),
  labor_hours: z.number().min(0.1).max(100).default(1),
  labor_rate: z.number().min(20).max(300).default(85),
  overhead_percent: z.number().min(0).max(100).default(25),
  profit_margin: z.number().min(0).max(100).default(15),
  tax_rate: z.number().min(0).max(20).default(8),
  discount_percent: z.number().min(0).max(100).default(0),
  parts_markup: z.number().min(0).max(200).default(30),
  complexity_factor: z.enum(['1', '1.2', '1.5']).default('1'),
  warranty_included: z.boolean().default(false),
});

function evaluateAllFormulas(input: Auto_repair_parts_labor_quoteInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.labor_hours * input.complexity_factor; results["adjusted_labor_hours"] = Number.isFinite(v) ? v : 0; } catch { results["adjusted_labor_hours"] = 0; }
  try { const v = input.parts_cost * (1 + input.parts_markup / 100); results["parts_cost_with_markup"] = Number.isFinite(v) ? v : 0; } catch { results["parts_cost_with_markup"] = 0; }
  try { const v = (results["adjusted_labor_hours"] ?? 0) * input.labor_rate; results["labor_cost"] = Number.isFinite(v) ? v : 0; } catch { results["labor_cost"] = 0; }
  try { const v = (results["parts_cost_with_markup"] ?? 0) + (results["labor_cost"] ?? 0); results["direct_cost"] = Number.isFinite(v) ? v : 0; } catch { results["direct_cost"] = 0; }
  try { const v = (results["direct_cost"] ?? 0) * (input.overhead_percent / 100); results["overhead_cost"] = Number.isFinite(v) ? v : 0; } catch { results["overhead_cost"] = 0; }
  try { const v = (results["direct_cost"] ?? 0) + (results["overhead_cost"] ?? 0); results["total_cost_before_margin"] = Number.isFinite(v) ? v : 0; } catch { results["total_cost_before_margin"] = 0; }
  try { const v = (((results["total_cost_before_margin"] ?? 0) * (1 + input.profit_margin / 100)) * (1 - input.discount_percent / 100)) * (1 + input.tax_rate / 100) + (input.warranty_included ? 150 : 0); results["total_quote"] = Number.isFinite(v) ? v : 0; } catch { results["total_quote"] = 0; }
  return results;
}


export function calculateAuto_repair_parts_labor_quote(input: Auto_repair_parts_labor_quoteInput): Auto_repair_parts_labor_quoteOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["total_quote"] ?? 0;
  const breakdown = {
    parts_cost_with_markup: values["parts_cost_with_markup"] ?? 0,
    labor_cost: values["labor_cost"] ?? 0,
    overhead_cost: values["overhead_cost"] ?? 0,
    profit_amount: values["profit_amount"] ?? 0,
    discount_amount: values["discount_amount"] ?? 0,
    tax_amount: values["tax_amount"] ?? 0,
    warranty_fee: values["warranty_fee"] ?? 0
  };
  const hiddenLossDrivers: string[] = ["Excess Labor Time","Low Parts Markup","Overhead Underestimation"];
  const suggestedActions: string[] = ["Consider raising parts markup to at least 20% to improve margin.","Job complexity factor is high; review process for waste reduction (Lean).","Overhead allocation may be too low; verify indirect costs per ISO 9001.","Consider offering extended warranty for quotes over $2,000 to increase customer trust and revenue."];
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Multi-currency support","Custom markup profiles","API integration"],
  };
}


export interface Auto_repair_parts_labor_quoteOutput {
  totalWasteCost: number;
  breakdown: { parts_cost_with_markup: number; labor_cost: number; overhead_cost: number; profit_amount: number; discount_amount: number; tax_amount: number; warranty_fee: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
