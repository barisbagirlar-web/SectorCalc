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

function evaluateAllFormulas(input: Sales_tax_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { results["taxable_base"] = input.net_sales * (1 - input.exempt_ratio/100) + (input.include_shipping ? input.shipping_charge : 0); } catch { results["taxable_base"] = 0; }
  try { results["effective_tax_rate"] = input.tax_rate * (1 + 0.05 * (input.tax_jurisdiction == 'state_county' ? 1 : (input.tax_jurisdiction == 'state_county_city' ? 2 : 0))); } catch { results["effective_tax_rate"] = 0; }
  try { results["gross_tax_amount"] = (results["taxable_base"] ?? 0) * ((results["effective_tax_rate"] ?? 0) / 100); } catch { results["gross_tax_amount"] = 0; }
  try { results["sourcing_adjustment"] = input.use_sourcing == 'origin' ? 1.0 : 1.02; } catch { results["sourcing_adjustment"] = 0; }
  try { results["adjusted_tax_amount"] = (results["gross_tax_amount"] ?? 0) * (results["sourcing_adjustment"] ?? 0); } catch { results["adjusted_tax_amount"] = 0; }
  try { results["rounding_loss"] = (results["adjusted_tax_amount"] ?? 0) - Math.round((results["adjusted_tax_amount"] ?? 0) * 100) / 100; } catch { results["rounding_loss"] = 0; }
  try { results["total_tax_liability"] = Math.round((results["adjusted_tax_amount"] ?? 0) * 100) / 100; } catch { results["total_tax_liability"] = 0; }
  return results;
}


export function calculateSales_tax_calculator(input: Sales_tax_calculatorInput): Sales_tax_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["total_tax_liability"] ?? 0;
  const breakdown = {
    taxable_base: values["taxable_base"] ?? 0,
    effective_tax_rate: values["effective_tax_rate"] ?? 0,
    gross_tax_amount: values["gross_tax_amount"] ?? 0,
    sourcing_adjustment: values["sourcing_adjustment"] ?? 0,
    adjusted_tax_amount: values["adjusted_tax_amount"] ?? 0,
    rounding_loss: values["rounding_loss"] ?? 0
  };
  const hiddenLossDrivers: string[] = ["Exempt Ratio Erosion","Sourcing Mismatch","Shipping Taxability"];
  const suggestedActions: string[] = ["Review Exemption Certificates","Evaluate Sourcing Method","Review Shipping Tax Policy","Monitor Rate Changes"];
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis"],
  };
}


export interface Sales_tax_calculatorOutput {
  totalWasteCost: number;
  breakdown: { taxable_base: number; effective_tax_rate: number; gross_tax_amount: number; sourcing_adjustment: number; adjusted_tax_amount: number; rounding_loss: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
