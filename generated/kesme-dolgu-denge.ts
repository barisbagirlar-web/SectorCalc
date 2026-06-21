// Auto-generated from kesme-dolgu-denge-schema.json
import * as z from 'zod';

export interface Kesme_dolgu_dengeInput {
  Area_Cut_i: number;
  Distance_i: number;
  Area_Fill_i: number;
  CompactedVolume: number;
  LooseVolume: number;
  BankVolume: number;
  Volume_i: number;
  UnitHaulCost: number;
  dataConfidence?: number;
}

export const Kesme_dolgu_dengeInputSchema = z.object({
  Area_Cut_i: z.number().min(0).default(0),
  Distance_i: z.number().min(0).default(0),
  Area_Fill_i: z.number().min(0).default(0),
  CompactedVolume: z.number().min(0).default(0),
  LooseVolume: z.number().min(0).default(0),
  BankVolume: z.number().min(0).default(0),
  Volume_i: z.number().min(0).default(0),
  UnitHaulCost: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Kesme_dolgu_dengeInput): Record<string, number> {
  const results: Record<string, number> = {};
  results["Volume_Cut"] = Number.NaN;
  results["Volume_Fill"] = Number.NaN;
  try { const v = 1 - (input.CompactedVolume / input.LooseVolume); results["ShrinkageFactor"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["ShrinkageFactor"] = Number.NaN; }
  try { const v = input.LooseVolume / input.BankVolume; results["SwellFactor"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["SwellFactor"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["Volume_Cut"])) - ((toNumericFormulaValue(results["Volume_Fill"])) * (toNumericFormulaValue(results["ShrinkageFactor"]))); results["NetBalance"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["NetBalance"] = Number.NaN; }
  try { const v = Math.max(0, ((toNumericFormulaValue(results["Volume_Fill"])) * (toNumericFormulaValue(results["ShrinkageFactor"]))) - (toNumericFormulaValue(results["Volume_Cut"]))); results["BorrowRequired"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["BorrowRequired"] = Number.NaN; }
  try { const v = Math.max(0, (toNumericFormulaValue(results["Volume_Cut"])) - ((toNumericFormulaValue(results["Volume_Fill"])) * (toNumericFormulaValue(results["ShrinkageFactor"])))); results["WasteRequired"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["WasteRequired"] = Number.NaN; }
  results["HaulCost"] = Number.NaN;
  return results;
}


export function calculateKesme_dolgu_denge(input: Kesme_dolgu_dengeInput): Kesme_dolgu_dengeOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["HaulCost"]);
  const breakdown = {
    Volume_Cut: toNumericFormulaValue(values["Volume_Cut"]),
    Volume_Fill: toNumericFormulaValue(values["Volume_Fill"]),
    ShrinkageFactor: toNumericFormulaValue(values["ShrinkageFactor"]),
    SwellFactor: toNumericFormulaValue(values["SwellFactor"]),
    NetBalance: toNumericFormulaValue(values["NetBalance"]),
    BorrowRequired: toNumericFormulaValue(values["BorrowRequired"]),
    WasteRequired: toNumericFormulaValue(values["WasteRequired"]),
    HaulCost: toNumericFormulaValue(values["HaulCost"])
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


export interface Kesme_dolgu_dengeOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { Volume_Cut: number; Volume_Fill: number; ShrinkageFactor: number; SwellFactor: number; NetBalance: number; BorrowRequired: number; WasteRequired: number; HaulCost: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Kesme_dolgu_dengeOutputMeta = {
  primaryKey: "HaulCost",
  unit: "USD",
  breakdownKeys: ["Volume_Cut","Volume_Fill","ShrinkageFactor","SwellFactor","NetBalance","BorrowRequired","WasteRequired","HaulCost"],
} as const;

