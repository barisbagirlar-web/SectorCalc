// Auto-generated from quote-risk-analyzer-calculator-schema.json
import * as z from 'zod';

export interface Quote_risk_analyzer_calculatorInput {
  order_volume: number;
  unit_price: number;
  production_lead_time_days: number;
  material_cost_variability: number;
  labor_skill_level: string;
  quality_defect_rate: number;
  logistics_complexity: number;
  customer_credit_rating: string;
  dataConfidence?: number;
}

export const Quote_risk_analyzer_calculatorInputSchema = z.object({
  order_volume: z.number().min(1).max(1000000).default(1000),
  unit_price: z.number().min(0.01).max(100000).default(50),
  production_lead_time_days: z.number().min(1).max(365).default(30),
  material_cost_variability: z.number().min(0).max(50).default(5),
  labor_skill_level: z.enum(['low', 'medium', 'high']).default('medium'),
  quality_defect_rate: z.number().min(0).max(100).default(2),
  logistics_complexity: z.number().min(1).max(10).default(5),
  customer_credit_rating: z.enum(['AAA', 'AA', 'A', 'BBB', 'BB', 'B', 'CCC', 'D']).default('BBB'),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Quote_risk_analyzer_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.order_volume * input.unit_price; results["base_cost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["base_cost"] = 0; }
  try { const v = input.order_volume * input.unit_price * (1 + (input.material_cost_variability / 100)); results["adjusted_cost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["adjusted_cost"] = 0; }
  try { const v = input.order_volume * input.unit_price * (1 + (input.material_cost_variability / 100)) * (input.production_lead_time_days); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.production_lead_time_days; results["factor_production_lead_time_days"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["factor_production_lead_time_days"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateQuote_risk_analyzer_calculator(input: Quote_risk_analyzer_calculatorInput): Quote_risk_analyzer_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Scrap and rework not in unit price","Volume discount not applied"];
  const suggestedActions: string[] = ["Reconcile unit cost with last PO","Stress-test with +10% waste"];
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
    premiumRequired: true,
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Multi-scenario comparison","API integration"],
  };
}


export interface Quote_risk_analyzer_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
