// Auto-generated from saas-shelfware-maliyet-schema.json
import * as z from 'zod';

export interface Saas_shelfware_maliyetInput {
  PurchasedLicenses: number;
  UsersLoggedInLast30Days: number;
  TotalContractValue: number;
  FeaturesUsed: number;
  TotalFeatures: number;
  UnderutilizedTierPriceDiff: number;
  Users: number;
  ActualUsage: number;
  ContractedUsage: number;
  OverageRate: number;
  dataConfidence?: number;
}

export const Saas_shelfware_maliyetInputSchema = z.object({
  PurchasedLicenses: z.number().min(0).default(0),
  UsersLoggedInLast30Days: z.number().min(0).default(0),
  TotalContractValue: z.number().min(0).default(0),
  FeaturesUsed: z.number().min(0).default(0),
  TotalFeatures: z.number().min(0).default(0),
  UnderutilizedTierPriceDiff: z.number().min(0).default(0),
  Users: z.number().min(0).default(0),
  ActualUsage: z.number().min(0).default(0),
  ContractedUsage: z.number().min(0).default(0),
  OverageRate: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Saas_shelfware_maliyetInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.PurchasedLicenses; results["TotalLicenses"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["TotalLicenses"] = Number.NaN; }
  try { const v = input.UsersLoggedInLast30Days; results["ActiveUsers"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["ActiveUsers"] = Number.NaN; }
  try { const v = ((toNumericFormulaValue(results["TotalLicenses"])) - (toNumericFormulaValue(results["ActiveUsers"]))) / (toNumericFormulaValue(results["TotalLicenses"])); results["ShelfwarePct"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["ShelfwarePct"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["ShelfwarePct"])) * input.TotalContractValue; results["ShelfwareCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["ShelfwareCost"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["ActiveUsers"])) / (toNumericFormulaValue(results["TotalLicenses"])); results["UtilizationRate"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["UtilizationRate"] = Number.NaN; }
  try { const v = input.FeaturesUsed / input.TotalFeatures; results["FeatureAdoption"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["FeatureAdoption"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["ShelfwareCost"])) + (input.UnderutilizedTierPriceDiff * input.Users); results["OptimizationSavings"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["OptimizationSavings"] = Number.NaN; }
  try { const v = Math.max(0, input.ActualUsage - input.ContractedUsage) * input.OverageRate; results["TrueUpCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["TrueUpCost"] = Number.NaN; }
  return results;
}


export function calculateSaas_shelfware_maliyet(input: Saas_shelfware_maliyetInput): Saas_shelfware_maliyetOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["TrueUpCost"]);
  const breakdown = {
    TotalLicenses: toNumericFormulaValue(values["TotalLicenses"]),
    ActiveUsers: toNumericFormulaValue(values["ActiveUsers"]),
    ShelfwarePct: toNumericFormulaValue(values["ShelfwarePct"]),
    ShelfwareCost: toNumericFormulaValue(values["ShelfwareCost"]),
    UtilizationRate: toNumericFormulaValue(values["UtilizationRate"]),
    FeatureAdoption: toNumericFormulaValue(values["FeatureAdoption"]),
    OptimizationSavings: toNumericFormulaValue(values["OptimizationSavings"]),
    TrueUpCost: toNumericFormulaValue(values["TrueUpCost"])
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


export interface Saas_shelfware_maliyetOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { TotalLicenses: number; ActiveUsers: number; ShelfwarePct: number; ShelfwareCost: number; UtilizationRate: number; FeatureAdoption: number; OptimizationSavings: number; TrueUpCost: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Saas_shelfware_maliyetOutputMeta = {
  primaryKey: "TrueUpCost",
  unit: "USD",
  breakdownKeys: ["TotalLicenses","ActiveUsers","ShelfwarePct","ShelfwareCost","UtilizationRate","FeatureAdoption","OptimizationSavings","TrueUpCost"],
} as const;

