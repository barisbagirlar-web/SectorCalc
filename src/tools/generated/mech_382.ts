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
 * ID: MECH_382
 * Name: Asansör / Vinç Motor Gücü
 */

export const InputSchema_MECH_382 = z.object({
  kaldirma_hizi: z.number(),
  toplam_kütle: z.number(),
  karsi_agirlik_orani: z.number(),
  sistem_verimi: z.number(),
});

export type Input_MECH_382 = z.infer<typeof InputSchema_MECH_382>;

export interface Output_MECH_382 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_MECH_382(input: Input_MECH_382): Output_MECH_382 {
  const validData = InputSchema_MECH_382.parse(input);
  const { kaldirma_hizi, toplam_kütle, karsi_agirlik_orani, sistem_verimi } = validData as any;
  

  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (kaldirma_hizi > 2.5) {
      smartWarnings.push({
        severity: "WARNING",
        source: "EN 81 Asansör Standartları",
        message: "Uyarı: Kaldırma hızı 2.5 m/s'yi aşıyor. Yüksek hızlı dikey taşımacılıkta paraşüt fren (Safety Gear) ve ray kılavuzlarının aerodinamik sürtünmesi motor gücü hesaplamalarına belirgin bir direnç (Drag) olarak eklenmelidir."
      });
    }
  
  return {
    result: 0,
    smartWarnings
  };
}
