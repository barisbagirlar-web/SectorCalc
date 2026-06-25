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
 * ID: MFG_325
 * Name: Plastik Enjeksiyon Soğuma Süresi
 */

export const InputSchema_MFG_325 = z.object({
  parca_kalinlik: z.number(),
  eriyik_sicaklik: z.number(),
  kalip_sicaklik: z.number(),
  cikarma_sicaklik: z.number(),
});

export type Input_MFG_325 = z.infer<typeof InputSchema_MFG_325>;

export interface Output_MFG_325 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_MFG_325(input: Input_MFG_325): Output_MFG_325 {
  const validData = InputSchema_MFG_325.parse(input);
  const { parca_kalinlik, eriyik_sicaklik, kalip_sicaklik, cikarma_sicaklik } = validData as any;
  

  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (cikarma_sicaklik > (eriyik_sicaklik * 0.7)) {
      smartWarnings.push({
        severity: "WARNING",
        source: "Polimer Fiziği",
        message: "Uyarı: Çıkarma (Ejection) sıcaklığı çok yüksek seçilmiştir. Parça tam katılaşmadan itici pimler (Ejector Pins) tarafından itilirse, parça yüzeyinde derin izler oluşacak ve kalıp dışında şiddetli çarpılma (Warpage/Distortion) yaşanacaktır."
      });
    }
  
  return {
    result: 0,
    smartWarnings
  };
}
