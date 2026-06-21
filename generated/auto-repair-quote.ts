// Auto-generated from auto-repair-quote-schema.json
import * as z from 'zod';

export interface Auto_repair_quoteInput {
  QuoteAmounts: number;
  QuotedPartPrice: number;
  MarketAvg: number;
  QuotedLaborHours: number;
  StandardHours: number;
  MarketPrice: number;
  QuotedPrice: number;
  Quantity: number;
  dataConfidence?: number;
}

export const Auto_repair_quoteInputSchema = z.object({
  QuoteAmounts: z.number().min(0).default(0),
  QuotedPartPrice: z.number().min(0).default(0),
  MarketAvg: z.number().min(0).default(0),
  QuotedLaborHours: z.number().min(0).default(0),
  StandardHours: z.number().min(0).default(0),
  MarketPrice: z.number().min(0).default(0),
  QuotedPrice: z.number().min(0).default(0),
  Quantity: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Auto_repair_quoteInput): Record<string, number> {
  const results: Record<string, number> = {};
  results["QuoteVariance"] = Number.NaN;
  try { const v = (input.QuotedPartPrice - input.MarketAvg) / input.MarketAvg; results["PartPriceDeviation"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["PartPriceDeviation"] = Number.NaN; }
  try { const v = (input.QuotedLaborHours - input.StandardHours) / input.StandardHours; results["LaborTimeDeviation"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["LaborTimeDeviation"] = Number.NaN; }
  try { const v = 100 - ((toNumericFormulaValue(results["QuoteVariance"])) * 50 + Math.abs((toNumericFormulaValue(results["PartPriceDeviation"]))) * 25 + Math.abs((toNumericFormulaValue(results["LaborTimeDeviation"]))) * 25); results["ConsistencyScore"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["ConsistencyScore"] = Number.NaN; }
  results["MarginLeak"] = Number.NaN;
  return results;
}


export function calculateAuto_repair_quote(input: Auto_repair_quoteInput): Auto_repair_quoteOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["MarginLeak"]);
  const breakdown = {
    QuoteVariance: toNumericFormulaValue(values["QuoteVariance"]),
    PartPriceDeviation: toNumericFormulaValue(values["PartPriceDeviation"]),
    LaborTimeDeviation: toNumericFormulaValue(values["LaborTimeDeviation"]),
    ConsistencyScore: toNumericFormulaValue(values["ConsistencyScore"]),
    MarginLeak: toNumericFormulaValue(values["MarginLeak"])
  };
  const hiddenLossDrivers: string[] = ["Verify assumptions with real data","Cross-check with industry benchmarks"];
  const suggestedActions: string[] = ["Run sensitivity analysis","Review assumptions with domain expert"];
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
    unit: "USD",
    premiumRequired: true,
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Verdict report","Action plan"],
  };
}


export interface Auto_repair_quoteOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { QuoteVariance: number; PartPriceDeviation: number; LaborTimeDeviation: number; ConsistencyScore: number; MarginLeak: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Auto_repair_quoteOutputMeta = {
  primaryKey: "MarginLeak",
  unit: "USD",
  breakdownKeys: ["QuoteVariance","PartPriceDeviation","LaborTimeDeviation","ConsistencyScore","MarginLeak"],
} as const;

