// @ts-nocheck
// Auto-generated from funnel-analysis-calculator-schema.json
import * as z from 'zod';

export interface Funnel_analysis_calculatorInput {
  visitors: number;
  leads: number;
  qualifiedLeads: number;
  opportunities: number;
  customers: number;
}

export const Funnel_analysis_calculatorInputSchema = z.object({
  visitors: z.number().default(1000),
  leads: z.number().default(500),
  qualifiedLeads: z.number().default(200),
  opportunities: z.number().default(100),
  customers: z.number().default(30),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Funnel_analysis_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.visitors > 0 ? (input.leads / input.visitors) * 100 : 0; results["visitorToLeadRate"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["visitorToLeadRate"] = 0; }
  try { const v = input.leads > 0 ? (input.qualifiedLeads / input.leads) * 100 : 0; results["leadToQualifiedRate"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["leadToQualifiedRate"] = 0; }
  try { const v = input.qualifiedLeads > 0 ? (input.opportunities / input.qualifiedLeads) * 100 : 0; results["qualifiedToOpportunityRate"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["qualifiedToOpportunityRate"] = 0; }
  try { const v = input.opportunities > 0 ? (input.customers / input.opportunities) * 100 : 0; results["opportunityToCustomerRate"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["opportunityToCustomerRate"] = 0; }
  try { const v = input.visitors > 0 ? (input.customers / input.visitors) * 100 : 0; results["overallConversion"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["overallConversion"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateFunnel_analysis_calculator(input: Funnel_analysis_calculatorInput): Funnel_analysis_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["overallConversion"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
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
    premiumFeatures: [],
  };
}


export interface Funnel_analysis_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
