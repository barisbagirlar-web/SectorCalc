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
 * ID: PRO_164
 * Name: Dişli Çarklarda Temas Yorulması (Pitting) ve Hertzian Gerilmesi
 */

export const InputSchema_PRO_164 = z.object({
  tangential_load_n: z.number(),
  pinion_dia_mm: z.number(),
  face_width_mm: z.number(),
  elastic_coefficient_ze: z.number(),
  geometry_factor_i: z.number(),
  overload_factor_ko: z.number(),
  dynamic_factor_kv: z.number(),
  allowable_contact_stress: z.number(),
});

export type Input_PRO_164 = z.infer<typeof InputSchema_PRO_164>;

export interface Output_PRO_164 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_PRO_164(input: Input_PRO_164): Output_PRO_164 {
  const validData = InputSchema_PRO_164.parse(input);
  const { tangential_load_n, pinion_dia_mm, face_width_mm, elastic_coefficient_ze, geometry_factor_i, overload_factor_ko, dynamic_factor_kv, allowable_contact_stress } = validData as any;
  
  const Hertzian_Stress_Sc = elastic_coefficient_ze * Math.sqrt((tangential_load_n * overload_factor_ko * dynamic_factor_kv) / (pinion_dia_mm * face_width_mm * geometry_factor_i));
  const Contact_Safety_Factor = allowable_contact_stress / Hertzian_Stress_Sc;
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (Contact_Safety_Factor < 1.0) {
      smartWarnings.push({
        severity: "CRITICAL",
        source: "AGMA 2001-D04 Standartları",
        message: "Yüzey Yorulma (Pitting) Reddi: Hesaplanan Hertzian temas gerilmesi malzeme dayanım limitini aşmıştır. Diş yüzeylerinde mikroskobik dökülmeler (Pitting/Spalling) başlayacak ve şanzıman kısa sürede yüksek gürültü üreterek diş kırılmasına yol açacaktır."
      });
    }
  
  return {
    result: Contact_Safety_Factor,
    smartWarnings
  };
}
