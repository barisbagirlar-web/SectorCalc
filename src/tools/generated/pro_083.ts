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
 * ID: PRO_083
 * Name: NIOSH Biyomekanik Kaldırma Denklemi ve Risk İndeksi
 */

export const InputSchema_PRO_083 = z.object({
  load_weight_l: z.number(),
  horizontal_dist_h: z.number(),
  vertical_height_v: z.number(),
  vertical_travel_d: z.number(),
  asymmetry_angle_a: z.number(),
  frequency_f: z.number(),
  coupling_c: z.number(),
  frequency_multiplier_fm: z.number(),
});

export type Input_PRO_083 = z.infer<typeof InputSchema_PRO_083>;

export interface Output_PRO_083 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_PRO_083(input: Input_PRO_083): Output_PRO_083 {
  const validData = InputSchema_PRO_083.parse(input);
  const { load_weight_l, horizontal_dist_h, vertical_height_v, vertical_travel_d, asymmetry_angle_a, frequency_f, coupling_c, frequency_multiplier_fm } = validData as any;
  
  const LC_Constant = 23;
  const HM_Multiplier = 25 / horizontal_dist_h;
  const VM_Multiplier = 1 - (0.003 * Math.abs(vertical_height_v - 75));
  const DM_Multiplier = 0.82 + (4.5 / vertical_travel_d);
  const AM_Multiplier = 1 - (0.0032 * asymmetry_angle_a);
  const Recommended_Weight_Limit_RWL = LC_Constant * HM_Multiplier * VM_Multiplier * DM_Multiplier * AM_Multiplier * frequency_multiplier_fm * coupling_c;
  const Lifting_Index_LI = load_weight_l / Recommended_Weight_Limit_RWL;
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (Lifting_Index_LI > 3.0) {
      smartWarnings.push({
        severity: "CRITICAL",
        source: "NIOSH Ergonomi Direktifi",
        message: "Acil İSG Müdahalesi: Kaldırma İndeksi (LI) 3.0 değerini aşmıştır. Operatörün bel/omurga bölgesinde şiddetli kas-iskelet sistemi rahatsızlıkları (WMSD) ve fıtık oluşumu KESİNDİR. Yük manuel olarak KALDIRILAMAZ, vinç veya manipülatör kullanımı yasal zorunluluktur."
      });
    }
  
  return {
    result: Lifting_Index_LI,
    smartWarnings
  };
}
