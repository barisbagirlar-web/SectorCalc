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
 * ID: MECH_390
 * Name: Rulman Yağlama Filmi Kalınlık Oranı (Kappa - κ / Lambda - λ)
 */

export const InputSchema_MECH_390 = z.object({
  calisma_viskozitesi: z.number(),
  referans_viskozite: z.number(),
});

export type Input_MECH_390 = z.infer<typeof InputSchema_MECH_390>;

export interface Output_MECH_390 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_MECH_390(input: Input_MECH_390): Output_MECH_390 {
  const validData = InputSchema_MECH_390.parse(input);
  const { calisma_viskozitesi, referans_viskozite } = validData as any;
  

  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if ((calisma_viskozitesi / referans_viskozite) < 1.0) {
      smartWarnings.push({
        severity: "CRITICAL",
        source: "SKF / Elastohidrodinamik Yağlama (EHL)",
        message: "Kritik Aşınma Reddi: Lambda oranı (κ) 1.0'in altındadır. Yuvarlanma elemanları ile yuva arasındaki ince hidrodinamik yağ filmi yırtılmıştır (Boundary Lubrication). Bilyeler doğrudan metal-metale temas ederek sürtecek ve yatağı yakacaktır (Smearing/Spalling). Daha viskoz (kalın) bir yağ veya EP katkılı gres seçin."
      });
    }

    if ((calisma_viskozitesi / referans_viskozite) > 4.0) {
      smartWarnings.push({
        severity: "WARNING",
        source: "Triboloji Dinamikleri",
        message: "Uyarı: Lambda oranı 4.0'ün üzerindedir. Çok güvenli bir yağ filmi olsa da, aşırı viskoz yağ sürtünme ısılarını (Churning) tetikler ve rulmanın mekanik verimini düşürür."
      });
    }
  
  return {
    result: 0,
    smartWarnings
  };
}
