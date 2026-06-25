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
 * ID: CNC_253
 * Name: Matkap Ucu Derinlik Kompanzasyonu
 */

export const InputSchema_CNC_253 = z.object({
  matkap_cap: z.number(),
  tepe_acisi: z.number(),
  hedef_derinlik: z.number(),
});

export type Input_CNC_253 = z.infer<typeof InputSchema_CNC_253>;

export interface Output_CNC_253 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_CNC_253(input: Input_CNC_253): Output_CNC_253 {
  const validData = InputSchema_CNC_253.parse(input);
  const { matkap_cap, tepe_acisi, hedef_derinlik } = validData as any;
  

  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (matkap_cap > 12 && tepe_acisi < 135) {
      smartWarnings.push({
        severity: "INFO",
        source: "Guhring Delme Standartları",
        message: "Bilgi: Büyük çaplı (12mm+) matkaplarda 118 derece tepe açısı kullanımı merkezleme zorluğu yaratır. G-Kodunuza punta matkabı (Spot Drill) operasyonu eklemediyseniz parça yüzeyinde kayma (Wandering) yaşanabilir."
      });
    }
  
  return {
    result: 0,
    smartWarnings
  };
}
