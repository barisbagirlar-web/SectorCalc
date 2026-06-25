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
 * ID: PRO_131
 * Name: Helisel Baskı Yayı Yorulma (Goodman) ve Rezonans Analizi
 */

export const InputSchema_PRO_131 = z.object({
  wire_dia_d: z.number(),
  coil_dia_D: z.number(),
  active_coils_N: z.number(),
  f_max: z.number(),
  f_min: z.number(),
  shear_modulus_G: z.number(),
  density: z.number(),
  uts_shear: z.number(),
  fatigue_limit: z.number(),
  safety_factor: z.number(),
  op_freq_hz: z.number(),
});

export type Input_PRO_131 = z.infer<typeof InputSchema_PRO_131>;

export interface Output_PRO_131 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_PRO_131(input: Input_PRO_131): Output_PRO_131 {
  const validData = InputSchema_PRO_131.parse(input);
  const { wire_dia_d, coil_dia_D, active_coils_N, f_max, f_min, shear_modulus_G, density, uts_shear, fatigue_limit, safety_factor, op_freq_hz } = validData as any;
  
  const Spring_Index_C = coil_dia_D / wire_dia_d;
  const Wahl_Factor_K = ((4 * Spring_Index_C - 1) / (4 * Spring_Index_C - 4)) + (0.615 / Spring_Index_C);
  const Tau_Max = (8 * f_max * coil_dia_D * Wahl_Factor_K) / (Math.PI * Math.pow(wire_dia_d, 3));
  const Tau_Min = (8 * f_min * coil_dia_D * Wahl_Factor_K) / (Math.PI * Math.pow(wire_dia_d, 3));
  const Tau_Mean = (Tau_Max + Tau_Min) / 2;
  const Tau_Amp = (Tau_Max - Tau_Min) / 2;
  const Goodman_Ratio = (Tau_Amp / fatigue_limit) + (Tau_Mean / uts_shear);
  const Actual_Safety_Factor = 1 / Goodman_Ratio;
  const Spring_Rate_k = (shear_modulus_G * Math.pow(wire_dia_d, 4)) / (8 * Math.pow(coil_dia_D, 3) * active_coils_N);
  const Surge_Freq_Hz = (wire_dia_d / (Math.PI * Math.pow(coil_dia_D, 2) * active_coils_N)) * Math.sqrt((shear_modulus_G * 1000000) / (2 * density));
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (op_freq_hz > (Surge_Freq_Hz / 13)) {
      smartWarnings.push({
        severity: "CRITICAL",
        source: "Makine Dinamiği",
        message: "Rezonans (Surge) Tehlikesi: Çalışma frekansı, yayın doğal frekansının 1/13'ünü aşmaktadır. Valf yayı (Spring Surge) dalgalanmasına girerek bobinlerin birbirine çarpmasına ve yayın parçalanmasına neden olacaktır."
      });
    }
  
  return {
    result: Surge_Freq_Hz,
    smartWarnings
  };
}
