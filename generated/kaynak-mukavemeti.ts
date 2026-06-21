// Auto-generated from kaynak-mukavemeti-schema.json
import * as z from 'zod';

export interface Kaynak_mukavemetiInput {
  Leg: number;
  Length: number;
  TensileStrength_Electrode: number;
  AppliedLoad: number;
  AppliedMoment: number;
  MomentOfInertia: number;
  ShearStress: number;
  dataConfidence?: number;
}

export const Kaynak_mukavemetiInputSchema = z.object({
  Leg: z.number().min(0).default(0),
  Length: z.number().min(0).default(0),
  TensileStrength_Electrode: z.number().min(0).default(0),
  AppliedLoad: z.number().min(0).default(0),
  AppliedMoment: z.number().min(0).default(0),
  MomentOfInertia: z.number().min(0).default(0),
  ShearStress: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Kaynak_mukavemetiInput): Record<string, number> {
  const results: Record<string, number> = {};
  results["ThroatThickness"] = Number.NaN;
  try { const v = (toNumericFormulaValue(results["ThroatThickness"])) * input.Length; results["Area_Shear"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Area_Shear"] = Number.NaN; }
  try { const v = 0.3 * input.TensileStrength_Electrode; results["AllowableShearStress"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["AllowableShearStress"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["Area_Shear"])) * (toNumericFormulaValue(results["AllowableShearStress"])); results["MaxLoad_Shear"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["MaxLoad_Shear"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["MaxLoad_Shear"])) / input.AppliedLoad; results["SafetyFactor"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["SafetyFactor"] = Number.NaN; }
  try { const v = (input.AppliedMoment * (toNumericFormulaValue(results["ThroatThickness"]))) / input.MomentOfInertia; results["BendingStress"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["BendingStress"] = Number.NaN; }
  try { const v = Math.sqrt(input.ShearStress**2 + (toNumericFormulaValue(results["BendingStress"]))**2); results["CombinedStress"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["CombinedStress"] = Number.NaN; }
  return results;
}


export function calculateKaynak_mukavemeti(input: Kaynak_mukavemetiInput): Kaynak_mukavemetiOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["CombinedStress"]);
  const breakdown = {
    ThroatThickness: toNumericFormulaValue(values["ThroatThickness"]),
    Area_Shear: toNumericFormulaValue(values["Area_Shear"]),
    AllowableShearStress: toNumericFormulaValue(values["AllowableShearStress"]),
    MaxLoad_Shear: toNumericFormulaValue(values["MaxLoad_Shear"]),
    SafetyFactor: toNumericFormulaValue(values["SafetyFactor"]),
    BendingStress: toNumericFormulaValue(values["BendingStress"]),
    CombinedStress: toNumericFormulaValue(values["CombinedStress"])
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


export interface Kaynak_mukavemetiOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { ThroatThickness: number; Area_Shear: number; AllowableShearStress: number; MaxLoad_Shear: number; SafetyFactor: number; BendingStress: number; CombinedStress: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Kaynak_mukavemetiOutputMeta = {
  primaryKey: "CombinedStress",
  unit: "USD",
  breakdownKeys: ["ThroatThickness","Area_Shear","AllowableShearStress","MaxLoad_Shear","SafetyFactor","BendingStress","CombinedStress"],
} as const;

