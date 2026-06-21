// Auto-generated from wps-preheat-sicaklik-schema.json
import * as z from 'zod';

export interface Wps_preheat_sicaklikInput {
  C: number;
  Mn: number;
  Cr: number;
  Mo: number;
  V: number;
  Ni: number;
  Cu: number;
  CE: number;
  Thickness: number;
  HydrogenLevel: number;
  HeatInput: number;
  t_8_5: number;
  Constant: number;
  RequiredPreheat: number;
  Mass: number;
  SpecificHeat: number;
  AmbientTemp: number;
  HeaterEfficiency: number;
  EnergyPrice: number;
  dataConfidence?: number;
}

export const Wps_preheat_sicaklikInputSchema = z.object({
  C: z.number().min(0).default(0),
  Mn: z.number().min(0).default(0),
  Cr: z.number().min(0).default(0),
  Mo: z.number().min(0).default(0),
  V: z.number().min(0).default(0),
  Ni: z.number().min(0).default(0),
  Cu: z.number().min(0).default(0),
  CE: z.number().min(0).default(0),
  Thickness: z.number().min(0).default(0),
  HydrogenLevel: z.number().min(0).default(0),
  HeatInput: z.number().min(0).default(0),
  t_8_5: z.number().min(0).default(0),
  Constant: z.number().min(0).default(0),
  RequiredPreheat: z.number().min(0).default(0),
  Mass: z.number().min(0).default(0),
  SpecificHeat: z.number().min(0).default(0),
  AmbientTemp: z.number().min(0).default(0),
  HeaterEfficiency: z.number().min(0).default(0),
  EnergyPrice: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Wps_preheat_sicaklikInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.C + (input.Mn/6) + ((input.Cr+input.Mo+input.V)/5) + ((input.Ni+input.Cu)/15); results["CarbonEquivalent_CE"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["CarbonEquivalent_CE"] = Number.NaN; }
  results["PreheatTemp"] = Number.NaN;
  try { const v = (input.Thickness**2 / input.HeatInput) * input.Constant; results["CriticalCoolingTime"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["CriticalCoolingTime"] = Number.NaN; }
  try { const v = (((toNumericFormulaValue(results["PreheatTemp"])) < input.RequiredPreheat) ? ("HIGH") : ("LOW")); results["HydrogenCrackingRisk"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["HydrogenCrackingRisk"] = Number.NaN; }
  try { const v = input.Mass * input.SpecificHeat * ((toNumericFormulaValue(results["PreheatTemp"])) - input.AmbientTemp) / input.HeaterEfficiency * input.EnergyPrice; results["EnergyCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["EnergyCost"] = Number.NaN; }
  return results;
}


export function calculateWps_preheat_sicaklik(input: Wps_preheat_sicaklikInput): Wps_preheat_sicaklikOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["EnergyCost"]);
  const breakdown = {
    CarbonEquivalent_CE: toNumericFormulaValue(values["CarbonEquivalent_CE"]),
    PreheatTemp: toNumericFormulaValue(values["PreheatTemp"]),
    CriticalCoolingTime: toNumericFormulaValue(values["CriticalCoolingTime"]),
    HydrogenCrackingRisk: toNumericFormulaValue(values["HydrogenCrackingRisk"]),
    EnergyCost: toNumericFormulaValue(values["EnergyCost"])
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


export interface Wps_preheat_sicaklikOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { CarbonEquivalent_CE: number; PreheatTemp: number; CriticalCoolingTime: number; HydrogenCrackingRisk: number; EnergyCost: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Wps_preheat_sicaklikOutputMeta = {
  primaryKey: "EnergyCost",
  unit: "USD",
  breakdownKeys: ["CarbonEquivalent_CE","PreheatTemp","CriticalCoolingTime","HydrogenCrackingRisk","EnergyCost"],
} as const;

