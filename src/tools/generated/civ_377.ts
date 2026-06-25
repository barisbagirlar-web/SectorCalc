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
 * ID: CIV_377
 * Name: Kaynaklı Kiriş Kayma Akısı (Shear Flow - q)
 */

export const InputSchema_CIV_377 = z.object({
  kesme_kuvveti: z.number(),
  statik_moment: z.number(),
  atalet_momenti: z.number(),
});

export type Input_CIV_377 = z.infer<typeof InputSchema_CIV_377>;

export interface Output_CIV_377 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_CIV_377(input: Input_CIV_377): Output_CIV_377 {
  const validData = InputSchema_CIV_377.parse(input);
  const { kesme_kuvveti, statik_moment, atalet_momenti } = validData as any;
  

  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if ((kesme_kuvveti * statik_moment) / atalet_momenti > 500) {
      smartWarnings.push({
        severity: "WARNING",
        source: "AISC Steel Construction Manual",
        message: "Uyarı: Birleşim yüzeyindeki mm başına düşen kayma akısı (q) 500 N/mm'yi aşıyor. Başlık (Flange) ve gövdeyi (Web) birleştiren sürekli köşe kaynağı bu yüke dayanamayabilir; kaynak dikiş kalınlığını artırın veya tam penetrasyonlu kaynak (CJP) kullanın."
      });
    }
  
  return {
    result: 0,
    smartWarnings
  };
}
