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
 * ID: MFG_363
 * Name: Kompozit Fiber Hacim Oranı (Vf)
 */

export const InputSchema_MFG_363 = z.object({
  fiber_hacmi: z.number(),
  recine_hacmi: z.number(),
});

export type Input_MFG_363 = z.infer<typeof InputSchema_MFG_363>;

export interface Output_MFG_363 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_MFG_363(input: Input_MFG_363): Output_MFG_363 {
  const validData = InputSchema_MFG_363.parse(input);
  const { fiber_hacmi, recine_hacmi } = validData as any;
  

  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if ((fiber_hacmi / (fiber_hacmi + recine_hacmi)) * 100 > 70) {
      smartWarnings.push({
        severity: "CRITICAL",
        source: "Havacılık Kompozit Standartları",
        message: "Kritik Yapısal Zafiyet: Fiber hacim oranı %70'in üzerindedir. Reçine miktarı yetersiz kalarak elyafları tam olarak ıslatamayacak (Wet-out failure); yapıda mikro boşluklar (Voids), kuru bölgeler (Dry Spots) ve katman ayrışması (Delamination) oluşacaktır."
      });
    }

    if ((fiber_hacmi / (fiber_hacmi + recine_hacmi)) * 100 < 30) {
      smartWarnings.push({
        severity: "WARNING",
        source: "Kompozit Mühendisliği",
        message: "Uyarı: Fiber oranı çok düşük (<%30). Reçine açısından zengin (Resin-rich) olan bu parça gereksiz yere ağır ve mekanik dayanım (Çekme/Eğilme) açısından son derece zayıf olacaktır. İnfüzyon veya Prepreg yöntemine geçin."
      });
    }
  
  return {
    result: 0,
    smartWarnings
  };
}
