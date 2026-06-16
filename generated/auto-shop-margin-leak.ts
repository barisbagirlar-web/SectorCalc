// Auto-generated from auto-shop-margin-leak-schema.json
import * as z from 'zod';

export interface Auto_shop_margin_leakInput {
  labor_rate_charged: number;
  labor_rate_effective: number;
  total_labor_hours_sold: number;
  parts_markup_percent: number;
  parts_markup_realized: number;
  total_parts_cost: number;
  shop_supply_charge_per_ro: number;
  shop_supply_cost_per_ro: number;
  number_of_repair_orders: number;
  warranty_labor_hours: number;
  warranty_labor_rate_reimbursed: number;
  employee_utilization_rate: number;
  target_utilization_rate: number;
  include_hidden_loss_drivers: boolean;
}

export const Auto_shop_margin_leakInputSchema = z.object({
  labor_rate_charged: z.number().min(50).max(250).default(120),
  labor_rate_effective: z.number().min(30).max(200).default(95),
  total_labor_hours_sold: z.number().min(0).max(10000).default(1600),
  parts_markup_percent: z.number().min(0).max(200).default(40),
  parts_markup_realized: z.number().min(0).max(200).default(28),
  total_parts_cost: z.number().min(0).max(5000000).default(240000),
  shop_supply_charge_per_ro: z.number().min(0).max(100).default(15),
  shop_supply_cost_per_ro: z.number().min(0).max(150).default(22),
  number_of_repair_orders: z.number().min(0).max(50000).default(1200),
  warranty_labor_hours: z.number().min(0).max(2000).default(80),
  warranty_labor_rate_reimbursed: z.number().min(0).max(200).default(70),
  employee_utilization_rate: z.number().min(0).max(100).default(75),
  target_utilization_rate: z.number().min(50).max(100).default(85),
  include_hidden_loss_drivers: z.boolean().default(true),
});

function evaluateAllFormulas(input: Auto_shop_margin_leakInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.labor_rate_charged - input.labor_rate_effective) * input.total_labor_hours_sold + (input.labor_rate_charged - input.warranty_labor_rate_reimbursed) * input.warranty_labor_hours; results["labor_margin_leak"] = Number.isFinite(v) ? v : 0; } catch { results["labor_margin_leak"] = 0; }
  try { const v = (input.parts_markup_percent - input.parts_markup_realized) / 100 * input.total_parts_cost; results["parts_margin_leak"] = Number.isFinite(v) ? v : 0; } catch { results["parts_margin_leak"] = 0; }
  try { const v = Math.max(0, (input.shop_supply_cost_per_ro - input.shop_supply_charge_per_ro)) * input.number_of_repair_orders; results["shop_supply_margin_leak"] = Number.isFinite(v) ? v : 0; } catch { results["shop_supply_margin_leak"] = 0; }
  try { const v = input.target_utilization_rate - input.employee_utilization_rate; results["utilization_gap"] = Number.isFinite(v) ? v : 0; } catch { results["utilization_gap"] = 0; }
  try { const v = Math.max(0, (input.target_utilization_rate - input.employee_utilization_rate) / 100 * input.total_labor_hours_sold * input.labor_rate_charged); results["utilization_loss"] = Number.isFinite(v) ? v : 0; } catch { results["utilization_loss"] = 0; }
  try { const v = (results["labor_margin_leak"] ?? 0) + (results["parts_margin_leak"] ?? 0) + (results["shop_supply_margin_leak"] ?? 0) + (input.include_hidden_loss_drivers ? (results["utilization_loss"] ?? 0) : 0); results["total_margin_leak"] = Number.isFinite(v) ? v : 0; } catch { results["total_margin_leak"] = 0; }
  try { const v = (results["total_margin_leak"] ?? 0) * (1 - 0.05 * (number_of_validation_errors + number_of_warnings)); results["data_confidence_adjusted"] = Number.isFinite(v) ? v : 0; } catch { results["data_confidence_adjusted"] = 0; }
  return results;
}


export function calculateAuto_shop_margin_leak(input: Auto_shop_margin_leakInput): Auto_shop_margin_leakOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["total_margin_leak"] ?? 0;
  const breakdown = {
    labor_margin_leak: values["labor_margin_leak"] ?? 0,
    parts_margin_leak: values["parts_margin_leak"] ?? 0,
    shop_supply_margin_leak: values["shop_supply_margin_leak"] ?? 0,
    utilization_loss: values["utilization_loss"] ?? 0
  };
  const hiddenLossDrivers: string[] = ["Warranty Labor Underpayment","Shop Supply Cost Overrun","Idle Time Opportunity Cost"];
  const suggestedActions: string[] = ["Review Labor Rate Discounting","Optimize Parts Markup Strategy","Reconcile Shop Supply Charges","Improve Technician Utilization","Negotiate Warranty Reimbursement Rates"];
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Real-time dashboard","Benchmarking against industry KPIs"],
  };
}


export interface Auto_shop_margin_leakOutput {
  totalWasteCost: number;
  breakdown: { labor_margin_leak: number; parts_margin_leak: number; shop_supply_margin_leak: number; utilization_loss: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
