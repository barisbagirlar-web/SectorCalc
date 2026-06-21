// Auto-generated from cnc-cevrim-suresi-schema.json
import * as z from 'zod';

export interface Cnc_cevrim_suresiInput {
  L: number;
  D: number;
  a_p: number;
  f_z: number;
  z: number;
  V_c: number;
  D_tool: number;
  Distance_rapid: number;
  V_rapid: number;
  Changes: number;
  TimePerChange: number;
  T_noncutting: number;
  T_load_unload: number;
  Planned: number;
  Downtime: number;
  dataConfidence?: number;
}

export const Cnc_cevrim_suresiInputSchema = z.object({
  L: z.number().min(0).default(0),
  D: z.number().min(0).default(0),
  a_p: z.number().min(0).default(0),
  f_z: z.number().min(0).default(0),
  z: z.number().min(0).default(0),
  V_c: z.number().min(0).default(0),
  D_tool: z.number().min(0).default(0),
  Distance_rapid: z.number().min(0).default(0),
  V_rapid: z.number().min(0).default(0),
  Changes: z.number().min(0).default(0),
  TimePerChange: z.number().min(0).default(0),
  T_noncutting: z.number().min(0).default(0),
  T_load_unload: z.number().min(0).default(0),
  Planned: z.number().min(0).default(0),
  Downtime: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Cnc_cevrim_suresiInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.L * input.D) / ((toNumericFormulaValue(results["V_f"])) * input.a_p); results["T_cut"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["T_cut"] = Number.NaN; }
  try { const v = input.f_z * input.z * (toNumericFormulaValue(results["n"])); results["V_f"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["V_f"] = Number.NaN; }
  try { const v = (1000 * input.V_c) / (Math.PI * input.D_tool); results["n"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["n"] = Number.NaN; }
  try { const v = input.Distance_rapid / input.V_rapid; results["T_rapid"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["T_rapid"] = Number.NaN; }
  try { const v = input.Changes * input.TimePerChange; results["T_toolchange"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["T_toolchange"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["T_cut"])) + (toNumericFormulaValue(results["T_rapid"])) + (toNumericFormulaValue(results["T_toolchange"])) + input.T_noncutting + input.T_load_unload; results["T_total"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["T_total"] = Number.NaN; }
  try { const v = input.Planned / (input.Planned + input.Downtime); results["OEE_Availability"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["OEE_Availability"] = Number.NaN; }
  return results;
}


export function calculateCnc_cevrim_suresi(input: Cnc_cevrim_suresiInput): Cnc_cevrim_suresiOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["OEE_Availability"]);
  const breakdown = {
    T_cut: toNumericFormulaValue(values["T_cut"]),
    V_f: toNumericFormulaValue(values["V_f"]),
    n: toNumericFormulaValue(values["n"]),
    T_rapid: toNumericFormulaValue(values["T_rapid"]),
    T_toolchange: toNumericFormulaValue(values["T_toolchange"]),
    T_total: toNumericFormulaValue(values["T_total"]),
    OEE_Availability: toNumericFormulaValue(values["OEE_Availability"])
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


export interface Cnc_cevrim_suresiOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { T_cut: number; V_f: number; n: number; T_rapid: number; T_toolchange: number; T_total: number; OEE_Availability: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Cnc_cevrim_suresiOutputMeta = {
  primaryKey: "OEE_Availability",
  unit: "USD",
  breakdownKeys: ["T_cut","V_f","n","T_rapid","T_toolchange","T_total","OEE_Availability"],
} as const;

