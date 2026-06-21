// Auto-generated from cbam-uyumluluk-schema.json
import * as z from 'zod';

export interface Cbam_uyumlulukInput {
  Mass: number;
  Direct: number;
  DefaultEmissionFactor: number;
  EU_ETS_Price: number;
  CarbonPricePaidOrigin: number;
  Liability: number;
  MarginThreshold: number;
  dataConfidence?: number;
}

export const Cbam_uyumlulukInputSchema = z.object({
  Mass: z.number().min(0).default(0),
  Direct: z.number().min(0).default(0),
  DefaultEmissionFactor: z.number().min(0).default(0),
  EU_ETS_Price: z.number().min(0).default(0),
  CarbonPricePaidOrigin: z.number().min(0).default(0),
  Liability: z.number().min(0).default(0),
  MarginThreshold: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Cbam_uyumlulukInput): Record<string, number> {
  const results: Record<string, number> = {};
  results["TotalMass"] = Number.NaN;
  results["TotalEmbedded"] = Number.NaN;
  try { const v = (toNumericFormulaValue(results["TotalEmbedded"])) / (toNumericFormulaValue(results["TotalMass"])); results["SpecificEmbedded"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["SpecificEmbedded"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["SpecificEmbedded"])) / input.DefaultEmissionFactor; results["ActualVsDefault"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["ActualVsDefault"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["TotalEmbedded"])) * (input.EU_ETS_Price - input.CarbonPricePaidOrigin); results["FinancialLiability"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["FinancialLiability"] = Number.NaN; }
  results["ComplianceDecision"] = Number.NaN;
  return results;
}


export function calculateCbam_uyumluluk(input: Cbam_uyumlulukInput): Cbam_uyumlulukOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["ComplianceDecision"]);
  const breakdown = {
    TotalMass: toNumericFormulaValue(values["TotalMass"]),
    TotalEmbedded: toNumericFormulaValue(values["TotalEmbedded"]),
    SpecificEmbedded: toNumericFormulaValue(values["SpecificEmbedded"]),
    ActualVsDefault: toNumericFormulaValue(values["ActualVsDefault"]),
    FinancialLiability: toNumericFormulaValue(values["FinancialLiability"]),
    ComplianceDecision: toNumericFormulaValue(values["ComplianceDecision"])
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


export interface Cbam_uyumlulukOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { TotalMass: number; TotalEmbedded: number; SpecificEmbedded: number; ActualVsDefault: number; FinancialLiability: number; ComplianceDecision: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Cbam_uyumlulukOutputMeta = {
  primaryKey: "ComplianceDecision",
  unit: "USD",
  breakdownKeys: ["TotalMass","TotalEmbedded","SpecificEmbedded","ActualVsDefault","FinancialLiability","ComplianceDecision"],
} as const;

