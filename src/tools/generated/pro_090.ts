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
 * ID: PRO_090
 * Name: 5S İleri Denetim ve Kültürel Sürdürülebilirlik Endeksi
 */

export const InputSchema_PRO_090 = z.object({
  seiri_sort: z.number(),
  seiton_set: z.number(),
  seiso_shine: z.number(),
  seiketsu_standardize: z.number(),
  shitsuke_sustain: z.number(),
  prev_total_score: z.number(),
});

export type Input_PRO_090 = z.infer<typeof InputSchema_PRO_090>;

export interface Output_PRO_090 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_PRO_090(input: Input_PRO_090): Output_PRO_090 {
  const validData = InputSchema_PRO_090.parse(input);
  const { seiri_sort, seiton_set, seiso_shine, seiketsu_standardize, shitsuke_sustain, prev_total_score } = validData as any;
  
  const Total_Current_Score = seiri_sort + seiton_set + seiso_shine + seiketsu_standardize + shitsuke_sustain;
  const Compliance_Rate_Pct = (Total_Current_Score / 25) * 100;
  const Decay_Rate_Pct = ((prev_total_score - Total_Current_Score) / prev_total_score) * 100;
  const Weakest_Link_Score = Math.min(seiri_sort, seiton_set, seiso_shine, seiketsu_standardize, shitsuke_sustain);
  const Radar_Area = 0.5 * SIN(72 * Math.PI / 180) * ((seiri_sort * seiton_set) + (seiton_set * seiso_shine) + (seiso_shine * seiketsu_standardize) + (seiketsu_standardize * shitsuke_sustain) + (shitsuke_sustain * seiri_sort));
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (Decay_Rate_Pct > 10) {
      smartWarnings.push({
        severity: "CRITICAL",
        source: "Yalın Kültür Yönetimi",
        message: "Kültürel Yıkım: Önceki denetime göre 5S skorunda %10'dan fazla düşüş (Decay) var. Saha yönetimi standartları koruyamıyor ve disiplin (Shitsuke) kırılmış durumda. Acil görsel yönetim rotasyonuna ihtiyaç var."
      });
    }

    if (Weakest_Link_Score < 3) {
      smartWarnings.push({
        severity: "WARNING",
        source: "Sürekli İyileştirme",
        message: "Uyarı: En az bir 5S adımında puan 3'ün (Geçer sınır) altındadır. Zayıf halkanın tespit edilip kök neden analizi (5 Neden) yapılması gerekmektedir."
      });
    }
  
  return {
    result: Radar_Area,
    smartWarnings
  };
}
