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
 * ID: MET_374
 * Name: CMM Dinamik Tarama Hızı Hatası
 */

export const InputSchema_MET_374 = z.object({
  tarama_hizi: z.number(),
  prob_uzunlugu: z.number(),
  beklenen_tolerans: z.number(),
});

export type Input_MET_374 = z.infer<typeof InputSchema_MET_374>;

export interface Output_MET_374 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_MET_374(input: Input_MET_374): Output_MET_374 {
  const validData = InputSchema_MET_374.parse(input);
  const { tarama_hizi, prob_uzunlugu, beklenen_tolerans } = validData as any;
  

  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if ((tarama_hizi > 20) && (prob_uzunlugu > 50)) {
      smartWarnings.push({
        severity: "WARNING",
        source: "ISO 10360-4 Tarama Modu",
        message: "Uyarı: Uzun prob ucu (>50mm) ile yüksek hızlı tarama (>20mm/s) yapıyorsunuz. İvmelenmeler sırasında prob şaftında 'Dinamik Bükülme (Stylus Bending)' yaşanacak ve okunan nokta bulutu (Point Cloud) verilerinde ±5 mikrona varan asılsız sapmalar (False Deviation) ölçülecektir. Hızı düşürün."
      });
    }
  
  return {
    result: 0,
    smartWarnings
  };
}
