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
 * ID: CNC_323
 * Name: Kılavuz Ön Delik Çapı (Tap Drill Size)
 */

export const InputSchema_CNC_323 = z.object({
  vida_cap: z.number(),
  hatve: z.number(),
  matkap_cap: z.number(),
});

export type Input_CNC_323 = z.infer<typeof InputSchema_CNC_323>;

export interface Output_CNC_323 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_CNC_323(input: Input_CNC_323): Output_CNC_323 {
  const validData = InputSchema_CNC_323.parse(input);
  const { vida_cap, hatve, matkap_cap } = validData as any;
  

  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (matkap_cap < (vida_cap - hatve) * 0.95) {
      smartWarnings.push({
        severity: "CRITICAL",
        source: "Sandvik Kılavuz Çekme Standartları",
        message: "Kritik İmalat Riski: Seçilen matkap çapı çok küçüktür (Sıkı Tolerans). Kılavuz parça içine girerken aşırı tork (Torque Overload) oluşacak ve kılavuz kesinlikle kırılarak parça içinde kalacaktır (Elektro erozyon ile çıkarılması gerekir)."
      });
    }

    if (matkap_cap > (vida_cap - hatve) * 1.05) {
      smartWarnings.push({
        severity: "WARNING",
        source: "ISO Vida Dişi Standartları",
        message: "Uyarı: Matkap çapı gereğinden büyüktür. Diş yüksekliği (Thread Height) kısa kalacak ve cıvata montajında diş sıyırma (Stripping) yük dayanımı %40'a varan oranda düşecektir."
      });
    }
  
  return {
    result: 0,
    smartWarnings
  };
}
