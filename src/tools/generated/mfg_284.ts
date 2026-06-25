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
 * ID: MFG_284
 * Name: Sıcak Daldırma Galvaniz Kaplama Kalınlığı
 */

export const InputSchema_MFG_284 = z.object({
  parca_agirligi: z.number(),
  kaplamali_agirlik: z.number(),
  yuzey_alani: z.number(),
});

export type Input_MFG_284 = z.infer<typeof InputSchema_MFG_284>;

export interface Output_MFG_284 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_MFG_284(input: Input_MFG_284): Output_MFG_284 {
  const validData = InputSchema_MFG_284.parse(input);
  const { parca_agirligi, kaplamali_agirlik, yuzey_alani } = validData as any;
  

  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (((kaplamali_agirlik - parca_agirligi) * 1000) / yuzey_alani > 1000) {
      smartWarnings.push({
        severity: "WARNING",
        source: "ASTM A123 / ISO 1461",
        message: "Uyarı: Birim alana düşen çinko kütlesi çok yüksek (>1000 gr/m2). Banyodan çıkarma hızı çok yavaş olabilir veya banyo sıcaklığı düşüktür. Aşırı kalın kaplama mekanik montajı engeller ve dökülme (Flaking) riski yaratır."
      });
    }
  
  return {
    result: 0,
    smartWarnings
  };
}
