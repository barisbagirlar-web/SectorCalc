// Auto-generated from symmetrical-components-schema.json
import * as z from 'zod';

export interface Symmetrical_componentsInput {
  va: number;
  vb: number;
  vc: number;
  angle_a: number;
  angle_b: number;
  angle_c: number;
}

export const Symmetrical_componentsInputSchema = z.object({
  va: z.number().default(100),
  vb: z.number().default(100),
  vc: z.number().default(100),
  angle_a: z.number().default(0),
  angle_b: z.number().default(-120),
  angle_c: z.number().default(120),
});

function evaluateAllFormulas(input: Symmetrical_componentsInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.angle_a * Math.PI / 180; results["a_rad"] = Number.isFinite(v) ? v : 0; } catch { results["a_rad"] = 0; }
  try { const v = input.angle_b * Math.PI / 180; results["b_rad"] = Number.isFinite(v) ? v : 0; } catch { results["b_rad"] = 0; }
  try { const v = input.angle_c * Math.PI / 180; results["c_rad"] = Number.isFinite(v) ? v : 0; } catch { results["c_rad"] = 0; }
  try { const v = input.va * Math.cos((results["a_rad"] ?? 0)); results["va_complex_real"] = Number.isFinite(v) ? v : 0; } catch { results["va_complex_real"] = 0; }
  try { const v = input.va * Math.sin((results["a_rad"] ?? 0)); results["va_complex_imag"] = Number.isFinite(v) ? v : 0; } catch { results["va_complex_imag"] = 0; }
  try { const v = input.vb * Math.cos((results["b_rad"] ?? 0)); results["vb_complex_real"] = Number.isFinite(v) ? v : 0; } catch { results["vb_complex_real"] = 0; }
  try { const v = input.vb * Math.sin((results["b_rad"] ?? 0)); results["vb_complex_imag"] = Number.isFinite(v) ? v : 0; } catch { results["vb_complex_imag"] = 0; }
  try { const v = input.vc * Math.cos((results["c_rad"] ?? 0)); results["vc_complex_real"] = Number.isFinite(v) ? v : 0; } catch { results["vc_complex_real"] = 0; }
  try { const v = input.vc * Math.sin((results["c_rad"] ?? 0)); results["vc_complex_imag"] = Number.isFinite(v) ? v : 0; } catch { results["vc_complex_imag"] = 0; }
  try { const v = ((results["va_complex_real"] ?? 0) + (results["vb_complex_real"] ?? 0) + (results["vc_complex_real"] ?? 0)) / 3; results["v0_real"] = Number.isFinite(v) ? v : 0; } catch { results["v0_real"] = 0; }
  try { const v = ((results["va_complex_imag"] ?? 0) + (results["vb_complex_imag"] ?? 0) + (results["vc_complex_imag"] ?? 0)) / 3; results["v0_imag"] = Number.isFinite(v) ? v : 0; } catch { results["v0_imag"] = 0; }
  try { const v = Math.sqrt((results["v0_real"] ?? 0)**2 + (results["v0_imag"] ?? 0)**2); results["v0_mag"] = Number.isFinite(v) ? v : 0; } catch { results["v0_mag"] = 0; }
  try { const v = Math.atan2((results["v0_imag"] ?? 0), (results["v0_real"] ?? 0)) * 180 / Math.PI; results["v0_angle_deg"] = Number.isFinite(v) ? v : 0; } catch { results["v0_angle_deg"] = 0; }
  try { const v = ((results["va_complex_real"] ?? 0) + (results["vb_complex_real"] ?? 0) * Math.cos(2*Math.PI/3) - (results["vb_complex_imag"] ?? 0) * Math.sin(2*Math.PI/3) + (results["vc_complex_real"] ?? 0) * Math.cos(-2*Math.PI/3) - (results["vc_complex_imag"] ?? 0) * Math.sin(-2*Math.PI/3)) / 3; results["v1_real"] = Number.isFinite(v) ? v : 0; } catch { results["v1_real"] = 0; }
  try { const v = ((results["va_complex_imag"] ?? 0) + (results["vb_complex_real"] ?? 0) * Math.sin(2*Math.PI/3) + (results["vb_complex_imag"] ?? 0) * Math.cos(2*Math.PI/3) + (results["vc_complex_real"] ?? 0) * Math.sin(-2*Math.PI/3) + (results["vc_complex_imag"] ?? 0) * Math.cos(-2*Math.PI/3)) / 3; results["v1_imag"] = Number.isFinite(v) ? v : 0; } catch { results["v1_imag"] = 0; }
  try { const v = Math.sqrt((results["v1_real"] ?? 0)**2 + (results["v1_imag"] ?? 0)**2); results["v1_mag"] = Number.isFinite(v) ? v : 0; } catch { results["v1_mag"] = 0; }
  try { const v = Math.atan2((results["v1_imag"] ?? 0), (results["v1_real"] ?? 0)) * 180 / Math.PI; results["v1_angle_deg"] = Number.isFinite(v) ? v : 0; } catch { results["v1_angle_deg"] = 0; }
  try { const v = ((results["va_complex_real"] ?? 0) + (results["vb_complex_real"] ?? 0) * Math.cos(-2*Math.PI/3) - (results["vb_complex_imag"] ?? 0) * Math.sin(-2*Math.PI/3) + (results["vc_complex_real"] ?? 0) * Math.cos(2*Math.PI/3) - (results["vc_complex_imag"] ?? 0) * Math.sin(2*Math.PI/3)) / 3; results["v2_real"] = Number.isFinite(v) ? v : 0; } catch { results["v2_real"] = 0; }
  try { const v = ((results["va_complex_imag"] ?? 0) + (results["vb_complex_real"] ?? 0) * Math.sin(-2*Math.PI/3) + (results["vb_complex_imag"] ?? 0) * Math.cos(-2*Math.PI/3) + (results["vc_complex_real"] ?? 0) * Math.sin(2*Math.PI/3) + (results["vc_complex_imag"] ?? 0) * Math.cos(2*Math.PI/3)) / 3; results["v2_imag"] = Number.isFinite(v) ? v : 0; } catch { results["v2_imag"] = 0; }
  try { const v = Math.sqrt((results["v2_real"] ?? 0)**2 + (results["v2_imag"] ?? 0)**2); results["v2_mag"] = Number.isFinite(v) ? v : 0; } catch { results["v2_mag"] = 0; }
  try { const v = Math.atan2((results["v2_imag"] ?? 0), (results["v2_real"] ?? 0)) * 180 / Math.PI; results["v2_angle_deg"] = Number.isFinite(v) ? v : 0; } catch { results["v2_angle_deg"] = 0; }
  try { const v = (results["v2_mag"] ?? 0) / (results["v1_mag"] ?? 0) * 100; results["unbalance_percent"] = Number.isFinite(v) ? v : 0; } catch { results["unbalance_percent"] = 0; }
  return results;
}


export function calculateSymmetrical_components(input: Symmetrical_componentsInput): Symmetrical_componentsOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["unbalance_percent"] ?? 0;
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  const dataConfidenceAdjusted =
    typeof (input as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as Record<string, unknown>).dataConfidence as number) / 100)
      : totalWasteCost;
  return {
    totalWasteCost,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Symmetrical_componentsOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
