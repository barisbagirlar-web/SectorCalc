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
 * ID: PRO_071
 * Name: Kiriş Ağırlığı, Eğilme Gerilmesi ve Sehim (AISC/EC3)
 */

export const InputSchema_PRO_071 = z.object({
  profile_area: z.number(),
  inertia_ix: z.number(),
  section_modulus: z.number(),
  length: z.number(),
  yield_strength: z.number(),
  dist_load: z.number(),
  elastic_modulus: z.number(),
  density: z.number(),
  support_cond: z.enum(["Basit Destekli", "Konsol", "Ankastre (İki Ucu Sabit)"]),
});

export type Input_PRO_071 = z.infer<typeof InputSchema_PRO_071>;

export interface Output_PRO_071 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_PRO_071(input: Input_PRO_071): Output_PRO_071 {
  const validData = InputSchema_PRO_071.parse(input);
  const { profile_area, inertia_ix, section_modulus, length, yield_strength, dist_load, elastic_modulus, density, support_cond } = validData as any;
  
  const Weight_kg_per_m = (profile_area / 10000) * density;
    const Total_Weight_kg = Weight_kg_per_m * length;
    const Total_Dead_Load_kN_m = (Weight_kg_per_m * 9.81) / 1000;
    const Total_Load_w = dist_load + Total_Dead_Load_kN_m;
    const M_max_kNm = (support_cond == 'Basit Destekli') ? ((Total_Load_w * Math.pow(length, 2)) / 8) : (support_cond == 'Konsol' ? ((Total_Load_w * Math.pow(length, 2)) / 2) : ((Total_Load_w * Math.pow(length, 2)) / 12));
    const Bending_Stress_MPa = (M_max_kNm * 1000000) / (section_modulus * 1000);
    const Safety_Factor = yield_strength / Bending_Stress_MPa;
    const Deflection_Max_mm = (support_cond == 'Basit Destekli') ? ((5 * Total_Load_w * Math.pow(length * 1000, 4)) / (384 * (elastic_modulus * 1000) * (inertia_ix * 10000))) : (support_cond == 'Konsol' ? ((Total_Load_w * Math.pow(length * 1000, 4)) / (8 * (elastic_modulus * 1000) * (inertia_ix * 10000))) : ((Total_Load_w * Math.pow(length * 1000, 4)) / (384 * (elastic_modulus * 1000) * (inertia_ix * 10000))));
    const Deflection_Limit_mm = (length * 1000) / 360;
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (Safety_Factor < 1.6) {
      smartWarnings.push({
        severity: "CRITICAL",
        source: "AISC Steel Construction Manual",
        message: "Kritik Çökme Riski: Eğilme gerilmesi için güvenlik faktörü (SF) yapısal sınırların altındadır. Kiriş kalıcı plastik deformasyona uğrayacaktır. Profili büyütün veya mesnet aralığını (L) daraltın."
      });
    }

    if (Deflection_Max_mm > Deflection_Limit_mm) {
      smartWarnings.push({
        severity: "WARNING",
        source: "Eurocode 3 Servis Sınır Durumu",
        message: "Servis İhlali: Kirişteki maksimum sehim (çökme), L/360 limitini aşmaktadır. Kiriş kopmasa dahi üzerindeki duvar, cam veya mekanik tesisat elemanlarını kıracak/çatlatacaktır."
      });
    }
  
  return {
    result: Deflection_Limit_mm,
    smartWarnings
  };
}
