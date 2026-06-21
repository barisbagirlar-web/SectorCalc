// Auto-generated from smed-degisim-optimize-edici-schema.json
import * as z from 'zod';

export interface Smed_degisim_optimize_ediciInput {
  Internal_Current: number;
  External_Current: number;
  Internal_Target: number;
  External_Target: number;
  ChangeoverFrequency: number;
  BottleneckThroughput: number;
  UnitMargin: number;
  Training: number;
  Tooling: number;
  Modification: number;
  dataConfidence?: number;
}

export const Smed_degisim_optimize_ediciInputSchema = z.object({
  Internal_Current: z.number().min(0).default(0),
  External_Current: z.number().min(0).default(0),
  Internal_Target: z.number().min(0).default(0),
  External_Target: z.number().min(0).default(0),
  ChangeoverFrequency: z.number().min(0).default(0),
  BottleneckThroughput: z.number().min(0).default(0),
  UnitMargin: z.number().min(0).default(0),
  Training: z.number().min(0).default(0),
  Tooling: z.number().min(0).default(0),
  Modification: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Smed_degisim_optimize_ediciInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.Internal_Current + input.External_Current; results["CurrentSetupTime"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["CurrentSetupTime"] = Number.NaN; }
  try { const v = input.Internal_Target + input.External_Target; results["TargetSetupTime"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["TargetSetupTime"] = Number.NaN; }
  try { const v = (input.Internal_Current - input.Internal_Target) / input.Internal_Current; results["ConversionRate"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["ConversionRate"] = Number.NaN; }
  try { const v = ((toNumericFormulaValue(results["CurrentSetupTime"])) - (toNumericFormulaValue(results["TargetSetupTime"]))) * input.ChangeoverFrequency; results["CapacityRecovered"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["CapacityRecovered"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["CapacityRecovered"])) * input.BottleneckThroughput * input.UnitMargin; results["FinancialGain"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["FinancialGain"] = Number.NaN; }
  try { const v = input.Training + input.Tooling + input.Modification; results["SMED_Investment"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["SMED_Investment"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["FinancialGain"])) / (toNumericFormulaValue(results["SMED_Investment"])); results["ROI"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["ROI"] = Number.NaN; }
  return results;
}


export function calculateSmed_degisim_optimize_edici(input: Smed_degisim_optimize_ediciInput): Smed_degisim_optimize_ediciOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["ROI"]);
  const breakdown = {
    CurrentSetupTime: toNumericFormulaValue(values["CurrentSetupTime"]),
    TargetSetupTime: toNumericFormulaValue(values["TargetSetupTime"]),
    ConversionRate: toNumericFormulaValue(values["ConversionRate"]),
    CapacityRecovered: toNumericFormulaValue(values["CapacityRecovered"]),
    FinancialGain: toNumericFormulaValue(values["FinancialGain"]),
    SMED_Investment: toNumericFormulaValue(values["SMED_Investment"]),
    ROI: toNumericFormulaValue(values["ROI"])
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


export interface Smed_degisim_optimize_ediciOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { CurrentSetupTime: number; TargetSetupTime: number; ConversionRate: number; CapacityRecovered: number; FinancialGain: number; SMED_Investment: number; ROI: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Smed_degisim_optimize_ediciOutputMeta = {
  primaryKey: "ROI",
  unit: "USD",
  breakdownKeys: ["CurrentSetupTime","TargetSetupTime","ConversionRate","CapacityRecovered","FinancialGain","SMED_Investment","ROI"],
} as const;

