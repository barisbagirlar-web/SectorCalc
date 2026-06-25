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
 * ID: PRO_166
 * Name: Çelik Yapılarda Eksantrik Yüklü Cıvata Grupları Anlık Dönme Merkezi (ICR)
 */

export const InputSchema_PRO_166 = z.object({
  bolt_count: z.number(),
  eccentricity_mm: z.number(),
  bolt_shear_capacity_kn: z.number(),
  applied_load_kn: z.number(),
  r_squared_sum_mm2: z.number(),
  max_distance_r_mm: z.number(),
});

export type Input_PRO_166 = z.infer<typeof InputSchema_PRO_166>;

export interface Output_PRO_166 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_PRO_166(input: Input_PRO_166): Output_PRO_166 {
  const validData = InputSchema_PRO_166.parse(input);
  const { bolt_count, eccentricity_mm, bolt_shear_capacity_kn, applied_load_kn, r_squared_sum_mm2, max_distance_r_mm } = validData as any;
  
  const Direct_Shear_Per_Bolt = applied_load_kn / bolt_count;
  const Torsional_Shear_Max = (applied_load_kn * eccentricity_mm * max_distance_r_mm) / r_squared_sum_mm2;
  const Elastic_Combined_Force_kN = Math.sqrt(Math.pow(Direct_Shear_Per_Bolt, 2) + Math.pow(Torsional_Shear_Max, 2));
  const Group_Ultimate_Capacity_ICR_kN = bolt_count * bolt_shear_capacity_kn * 0.85;
  const Safety_Factor_Elastic = bolt_shear_capacity_kn / Elastic_Combined_Force_kN;
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (Elastic_Combined_Force_kN > bolt_shear_capacity_kn) {
      smartWarnings.push({
        severity: "CRITICAL",
        source: "AISC Manual of Steel Construction",
        message: "Cıvata Kesme (Bağlantı Göçmesi) Riski: En kritik cıvata üzerindeki birleşik elastik yük, cıvatanın kesme limitini aşmıştır. Bağlantı eksantrik moment altında sırayla kesilerek yırtılacaktır. Cıvata çapını veya sayısını artırın."
      });
    }
  
  return {
    result: Safety_Factor_Elastic,
    smartWarnings
  };
}
