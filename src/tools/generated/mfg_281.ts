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
 * ID: MFG_281
 * Name: Döküm Çekme Payı (Shrinkage Allowance)
 */

export const InputSchema_MFG_281 = z.object({
  parca_boyu: z.number(),
  cekme_orani: z.number(),
});

export type Input_MFG_281 = z.infer<typeof InputSchema_MFG_281>;

export interface Output_MFG_281 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_MFG_281(input: Input_MFG_281): Output_MFG_281 {
  const validData = InputSchema_MFG_281.parse(input);
  const { parca_boyu, cekme_orani } = validData as any;
  

  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (cekme_orani > 3.0) {
      smartWarnings.push({
        severity: "INFO",
        source: "Döküm Kalıp (Model) Tasarımı",
        message: "Bilgi: Çekme oranı %3'ün üzerindedir (Muhtemelen Dökme Çelik veya özel alışımlar). Soğuma esnasında yüksek çekilme boşlukları (Shrinkage Cavity) oluşma riski vardır. Kalıp tasarımında hacimli besleyiciler (Riser) kullanılması şarttır."
      });
    }
  
  return {
    result: 0,
    smartWarnings
  };
}
