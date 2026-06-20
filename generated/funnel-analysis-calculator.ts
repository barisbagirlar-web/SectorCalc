// Auto-generated from funnel-analysis-calculator-schema.json
import * as z from 'zod';

export interface Funnel_analysis_calculatorInput {
  visitors: number;
  leads: number;
  qualifiedLeads: number;
  opportunities: number;
  customers: number;
  dataConfidence?: number;
}

export const Funnel_analysis_calculatorInputSchema = z.object({
  visitors: z.number().default(1000),
  leads: z.number().default(500),
  qualifiedLeads: z.number().default(200),
  opportunities: z.number().default(100),
  customers: z.number().default(30),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Funnel_analysis_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.visitors > 0 ? (input.leads / input.visitors) * 100 : 0; results["visitorToLeadRate"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["visitorToLeadRate"] = Number.NaN; }
  try { const v = input.leads > 0 ? (input.qualifiedLeads / input.leads) * 100 : 0; results["leadToQualifiedRate"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["leadToQualifiedRate"] = Number.NaN; }
  try { const v = input.qualifiedLeads > 0 ? (input.opportunities / input.qualifiedLeads) * 100 : 0; results["qualifiedToOpportunityRate"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["qualifiedToOpportunityRate"] = Number.NaN; }
  try { const v = input.opportunities > 0 ? (input.customers / input.opportunities) * 100 : 0; results["opportunityToCustomerRate"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["opportunityToCustomerRate"] = Number.NaN; }
  try { const v = input.visitors > 0 ? (input.customers / input.visitors) * 100 : 0; results["overallConversion"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["overallConversion"] = Number.NaN; }
  return results;
}


export function calculateFunnel_analysis_calculator(input: Funnel_analysis_calculatorInput): Funnel_analysis_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["overallConversion"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
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
