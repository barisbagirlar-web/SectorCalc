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
 * ID: OHS_249
 * Name: Radyasyon Maruziyeti (Ters Kare Yasası)
 */

export const InputSchema_OHS_249 = z.object({
  kaynak_doz_hizi: z.number(),
  yeni_mesafe: z.number(),
});

export type Input_OHS_249 = z.infer<typeof InputSchema_OHS_249>;

export interface Output_OHS_249 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_OHS_249(input: Input_OHS_249): Output_OHS_249 {
  const validData = InputSchema_OHS_249.parse(input);
  const { kaynak_doz_hizi, yeni_mesafe } = validData as any;
  

  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if ((kaynak_doz_hizi / (yeni_mesafe * yeni_mesafe)) > 0.02) {
      smartWarnings.push({
        severity: "CRITICAL",
        source: "TAEK / ICRP Radyasyon Korunma Sınırları (ALARA)",
        message: "Kritik Radyasyon Riski: Belirlenen mesafedeki saatlik doz hızı halk/çalışan limitlerini (0.02 mSv/h) aşmaktadır. Bu bölgede kesintisiz çalışılması yıllık yasal doz limitlerinin aşılmasına yol açar; mesafeyi artırın veya kurşun/beton zırhlama (Shielding) uygulayın."
      });
    }
  
  return {
    result: 0,
    smartWarnings
  };
}
