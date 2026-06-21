// Auto-generated from yangin-hidranti-akis-schema.json
import * as z from 'zod';

export interface Yangin_hidranti_akisInput {
  c_d: number;
  d: number;
  P_Pitot: number;
  P_Static: number;
  Coefficient: number;
  P_Residual: number;
  Length: number;
  Diameter: number;
  Velocity: number;
  ElevationHead: number;
  NozzlePressure: number;
  RequiredFlow: number;
  FAIL: number;
  dataConfidence?: number;
}

export const Yangin_hidranti_akisInputSchema = z.object({
  c_d: z.number().min(0).default(0),
  d: z.number().min(0).default(0),
  P_Pitot: z.number().min(0).default(0),
  P_Static: z.number().min(0).default(0),
  Coefficient: z.number().min(0).default(0),
  P_Residual: z.number().min(0).default(0),
  Length: z.number().min(0).default(0),
  Diameter: z.number().min(0).default(0),
  Velocity: z.number().min(0).default(0),
  ElevationHead: z.number().min(0).default(0),
  NozzlePressure: z.number().min(0).default(0),
  RequiredFlow: z.number().min(0).default(0),
  FAIL: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Yangin_hidranti_akisInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 29.83 * input.c_d * input.d**2 * Math.sqrt(input.P_Pitot); results["FlowRate_Q"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["FlowRate_Q"] = Number.NaN; }
  try { const v = input.P_Static - ((toNumericFormulaValue(results["FlowRate_Q"])) / input.Coefficient)**1.85; results["ResidualPressure"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["ResidualPressure"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["FlowRate_Q"])) * ((input.P_Static - 20) / (input.P_Static - input.P_Residual))**0.54; results["AvailableFlow_At20psi"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["AvailableFlow_At20psi"] = Number.NaN; }
  results["FrictionLoss"] = Number.NaN;
  try { const v = input.ElevationHead + (toNumericFormulaValue(results["FrictionLoss"])) + input.NozzlePressure; results["RequiredPumpHead"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["RequiredPumpHead"] = Number.NaN; }
  try { const v = (((toNumericFormulaValue(results["AvailableFlow_At20psi"])) > input.RequiredFlow) ? ("PASS") : ("input.FAIL")); results["Compliance"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Compliance"] = Number.NaN; }
  return results;
}


export function calculateYangin_hidranti_akis(input: Yangin_hidranti_akisInput): Yangin_hidranti_akisOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["Compliance"]);
  const breakdown = {
    FlowRate_Q: toNumericFormulaValue(values["FlowRate_Q"]),
    ResidualPressure: toNumericFormulaValue(values["ResidualPressure"]),
    AvailableFlow_At20psi: toNumericFormulaValue(values["AvailableFlow_At20psi"]),
    FrictionLoss: toNumericFormulaValue(values["FrictionLoss"]),
    RequiredPumpHead: toNumericFormulaValue(values["RequiredPumpHead"]),
    Compliance: toNumericFormulaValue(values["Compliance"])
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


export interface Yangin_hidranti_akisOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { FlowRate_Q: number; ResidualPressure: number; AvailableFlow_At20psi: number; FrictionLoss: number; RequiredPumpHead: number; Compliance: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Yangin_hidranti_akisOutputMeta = {
  primaryKey: "Compliance",
  unit: "USD",
  breakdownKeys: ["FlowRate_Q","ResidualPressure","AvailableFlow_At20psi","FrictionLoss","RequiredPumpHead","Compliance"],
} as const;

