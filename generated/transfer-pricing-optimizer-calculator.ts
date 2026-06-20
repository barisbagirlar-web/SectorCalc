// Auto-generated from transfer-pricing-optimizer-calculator-schema.json
import * as z from 'zod';

export interface Transfer_pricing_optimizer_calculatorInput {
  production_cost_per_unit: number;
  market_price_per_unit: number;
  volume_units: number;
  tax_rate_producer: number;
  tax_rate_distributor: number;
  transfer_price_current: number;
  compliance_risk_tolerance: string;
  include_lean_waste_factor: boolean;
  dataConfidence?: number;
}

export const Transfer_pricing_optimizer_calculatorInputSchema = z.object({
  production_cost_per_unit: z.number().min(0).max(10000).default(100),
  market_price_per_unit: z.number().min(0).max(50000).default(150),
  volume_units: z.number().min(1).max(10000000).default(10000),
  tax_rate_producer: z.number().min(0).max(50).default(21),
  tax_rate_distributor: z.number().min(0).max(50).default(25),
  transfer_price_current: z.number().min(0).max(50000).default(120),
  compliance_risk_tolerance: z.enum(['Low', 'Medium', 'High']).default('Medium'),
  include_lean_waste_factor: z.boolean().default(true),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Transfer_pricing_optimizer_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.volume_units * input.production_cost_per_unit; results["base_cost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["base_cost"] = Number.NaN; }
  try { const v = input.volume_units * input.production_cost_per_unit * (1 + (input.tax_rate_producer / 100)); results["adjusted_cost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["adjusted_cost"] = Number.NaN; }
  try { const v = input.volume_units * input.production_cost_per_unit * (1 + (input.tax_rate_producer / 100)) * (input.market_price_per_unit); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  try { const v = input.market_price_per_unit; results["factor_market_price_per_unit"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["factor_market_price_per_unit"] = Number.NaN; }
  return results;
}


export function calculateTransfer_pricing_optimizer_calculator(input: Transfer_pricing_optimizer_calculatorInput): Transfer_pricing_optimizer_calculatorOutput {
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Multi-entity scenario comparison","Automated compliance report (OECD/UN)"],
  };
}


export interface Transfer_pricing_optimizer_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
