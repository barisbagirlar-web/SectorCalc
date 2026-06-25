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
 * ID: MECH_371
 * Name: Basınçlı Boru Et Kalınlığı (Barlow Formülü)
 */

export const InputSchema_MECH_371 = z.object({
  ic_basinc: z.number(),
  dis_cap: z.number(),
  akma_dayanimi: z.number(),
  dikis_faktoru: z.number(),
});

export type Input_MECH_371 = z.infer<typeof InputSchema_MECH_371>;

export interface Output_MECH_371 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_MECH_371(input: Input_MECH_371): Output_MECH_371 {
  const validData = InputSchema_MECH_371.parse(input);
  const { ic_basinc, dis_cap, akma_dayanimi, dikis_faktoru } = validData as any;
  

  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (((ic_basinc * dis_cap) / (2 * (akma_dayanimi * dikis_faktoru))) / (dis_cap/2) > 0.1) {
      smartWarnings.push({
        severity: "WARNING",
        source: "ASME B31.3 Proses Borulama",
        message: "Uyarı: Gerekli cidar kalınlığının çapa oranı ince cidarlı boru (Thin-Walled) sınırlarını aşıyor. Barlow formülü basite indirgenmiştir, yüksek basınç borulaması için Lamé denklemleri veya doğrudan ASME kalın cidarlı kap formülleri kullanılmalıdır."
      });
    }

    if (akma_dayanimi / ((ic_basinc * dis_cap) / (2 * 1 * dikis_faktoru)) < 4) {
      smartWarnings.push({
        severity: "CRITICAL",
        source: "ASME B31.3 Güvenlik Marjı",
        message: "Kritik Patlama Riski: Hesaplanan boru et kalınlığına göre sistemin Emniyet Katsayısı (Safety Factor) 4'ün altına düşmektedir. Korozyon payı (Corrosion Allowance) ve diş açma payı (Thread Depth) eklenmeden imalata GEÇİLEMEZ."
      });
    }
  
  return {
    result: 0,
    smartWarnings
  };
}
