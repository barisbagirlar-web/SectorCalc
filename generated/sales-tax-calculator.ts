// @ts-nocheck
// Auto-generated from sales-tax-calculator-schema.json
import * as z from 'zod';

export interface Sales_tax_calculatorInput {
  net_sales: number;
  tax_rate: number;
  exempt_ratio: number;
  tax_jurisdiction: string;
  use_sourcing: string;
  include_shipping: boolean;
  shipping_charge: number;
}

export const Sales_tax_calculatorInputSchema = z.object({
  net_sales: z.number().min(0).max(100000000).default(10000),
  tax_rate: z.number().min(0).max(50).default(8.25),
  exempt_ratio: z.number().min(0).max(100).default(0),
  tax_jurisdiction: z.enum(['state_only', 'state_county', 'state_county_city']).default('state_county'),
  use_sourcing: z.enum(['origin', 'destination']).default('origin'),
  include_shipping: z.boolean().default(true),
  shipping_charge: z.number().min(0).max(100000).default(500),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Sales_tax_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.include_shipping * input.net_sales; results["base_cost"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["base_cost"] = 0; }
  try { const v = input.include_shipping * input.net_sales * (1 + (input.tax_rate / 100)); results["adjusted_cost"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["adjusted_cost"] = 0; }
  try { const v = input.include_shipping * input.net_sales * (1 + (input.tax_rate / 100)) * ((input.exempt_ratio / 100)); results["result"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result"] = 0; }
  try { const v = (input.exempt_ratio / 100); results["factor_exempt_ratio"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["factor_exempt_ratio"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateSales_tax_calculator(input: Sales_tax_calculatorInput): Sales_tax_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Scrap and rework not in unit price","Volume discount not applied"];
  const suggestedActions: string[] = ["Reconcile unit cost with last PO","Stress-test with +10% waste"];
  const dataConfidenceAdjusted =
    typeof (input as unknown as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as unknown as Record<string, unknown>).dataConfidence as number) / 100)
      : totalWasteCost;
  return {
    totalWasteCost,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: false,
    premiumFeatures: ["PDF export","CSV export","Trend analysis"],
  };
}


export interface Sales_tax_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
