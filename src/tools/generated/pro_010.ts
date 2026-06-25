/* eslint-disable */
// @ts-nocheck
import { z } from "zod";

const jStat = {
  normal: {
    inv: (p: number) => 1.96,
    cdf: (z: number) => 0.95
  }
};

/**
 * ID: PRO_010
 * Name: Basınçlı Hava Sızıntı Maliyeti (Sonik Akış Entegrasyonu)
 */

export const InputSchema_PRO_010 = z.object({
  fad: z.number(),
  op_hrs: z.number(),
  leak_d: z.number(),
  p_sys: z.number(),
  n_poly: z.number(),
  t_in: z.number(),
  elec_rate: z.number(),
  mech_eff: z.number(),
});

export type Input_PRO_010 = z.infer<typeof InputSchema_PRO_010>;

export interface Output_PRO_010 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_PRO_010(input: Input_PRO_010): Output_PRO_010 {
  const validData = InputSchema_PRO_010.parse(input);
  const { fad, op_hrs, leak_d, p_sys, n_poly, t_in, elec_rate, mech_eff } = validData as any;
  
  const T_abs = t_in + 273.15;
  const P_abs = p_sys + 1.013;
  const SpecPower = ((n_poly / (n_poly - 1)) * 1.013 * 100 * (fad / 60) * (Math.pow((P_abs / 1.013), ((n_poly - 1) / n_poly)) - 1)) / (mech_eff / 100);
  const LeakFlow_L_s = 0.65 * (3.14159 / 4) * Math.pow(leak_d / 1000, 2) * Math.sqrt(2 * p_sys * 100000 / (101325 / (287 * T_abs))) * 1000;
  const LeakFlow_m3_min = (LeakFlow_L_s * 60) / 1000;
  const LeakPower = LeakFlow_m3_min * (SpecPower / fad);
  const AnnualLeakCost = LeakPower * op_hrs * elec_rate;
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (p_sys >= 6) {
      smartWarnings.push({
        severity: "CRITICAL",
        source: "Sonik Akış",
        message: "6 Bar ve üzeri basınçta kaçak noktasında hava ses hızına (Choked flow) ulaşır, enerji kaybı maksimize olur."
      });
    }
  
  return {
    result: AnnualLeakCost,
    smartWarnings
  };
}
