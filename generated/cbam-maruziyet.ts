// Auto-generated from cbam-maruziyet-schema.json
import * as z from 'zod';

export interface Cbam_maruziyetInput {
  ActivityData: number;
  EmissionFactor: number;
  ElecConsumption: number;
  GridFactor: number;
  ProductionVolume: number;
  EmbeddedEmissions: number;
  EU_ETS_Price: number;
  Benchmark: number;
  LeakageFactor: number;
  DataComplete: number;
  Verification: number;
  Reduction: number;
  dataConfidence?: number;
}

export const Cbam_maruziyetInputSchema = z.object({
  ActivityData: z.number().min(0).default(0),
  EmissionFactor: z.number().min(0).default(0),
  ElecConsumption: z.number().min(0).default(0),
  GridFactor: z.number().min(0).default(0),
  ProductionVolume: z.number().min(0).default(0),
  EmbeddedEmissions: z.number().min(0).default(0),
  EU_ETS_Price: z.number().min(0).default(0),
  Benchmark: z.number().min(0).default(0),
  LeakageFactor: z.number().min(0).default(0),
  DataComplete: z.number().min(0).default(0),
  Verification: z.number().min(0).default(0),
  Reduction: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Cbam_maruziyetInput): Record<string, number> {
  const results: Record<string, number> = {};
  results["DirectEmissions"] = Number.NaN;
  try { const v = input.ElecConsumption * input.GridFactor; results["IndirectEmissions"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["IndirectEmissions"] = Number.NaN; }
  try { const v = ((toNumericFormulaValue(results["DirectEmissions"])) + (toNumericFormulaValue(results["IndirectEmissions"]))) / input.ProductionVolume; results["CarbonIntensity"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["CarbonIntensity"] = Number.NaN; }
  try { const v = (input.EmbeddedEmissions - (toNumericFormulaValue(results["FreeAllowance"]))) * input.EU_ETS_Price; results["CBAMCertificateCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["CBAMCertificateCost"] = Number.NaN; }
  try { const v = input.Benchmark * input.ProductionVolume * input.LeakageFactor; results["FreeAllowance"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["FreeAllowance"] = Number.NaN; }
  try { const v = (input.DataComplete * 0.3) + (input.Verification * 0.3) + (input.Reduction * 0.4); results["ComplianceScore"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["ComplianceScore"] = Number.NaN; }
  return results;
}


export function calculateCbam_maruziyet(input: Cbam_maruziyetInput): Cbam_maruziyetOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["ComplianceScore"]);
  const breakdown = {
    DirectEmissions: toNumericFormulaValue(values["DirectEmissions"]),
    IndirectEmissions: toNumericFormulaValue(values["IndirectEmissions"]),
    CarbonIntensity: toNumericFormulaValue(values["CarbonIntensity"]),
    CBAMCertificateCost: toNumericFormulaValue(values["CBAMCertificateCost"]),
    FreeAllowance: toNumericFormulaValue(values["FreeAllowance"]),
    ComplianceScore: toNumericFormulaValue(values["ComplianceScore"])
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


export interface Cbam_maruziyetOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { DirectEmissions: number; IndirectEmissions: number; CarbonIntensity: number; CBAMCertificateCost: number; FreeAllowance: number; ComplianceScore: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Cbam_maruziyetOutputMeta = {
  primaryKey: "ComplianceScore",
  unit: "USD",
  breakdownKeys: ["DirectEmissions","IndirectEmissions","CarbonIntensity","CBAMCertificateCost","FreeAllowance","ComplianceScore"],
} as const;

