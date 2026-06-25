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
 * ID: MECH_367
 * Name: Yay İndeksi ve Sarım Zorluğu (Spring Index - C)
 */

export const InputSchema_MECH_367 = z.object({
  ortalama_cap: z.number(),
  tel_cap: z.number(),
});

export type Input_MECH_367 = z.infer<typeof InputSchema_MECH_367>;

export interface Output_MECH_367 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_MECH_367(input: Input_MECH_367): Output_MECH_367 {
  const validData = InputSchema_MECH_367.parse(input);
  const { ortalama_cap, tel_cap } = validData as any;
  

  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if ((ortalama_cap / tel_cap) < 4) {
      smartWarnings.push({
        severity: "CRITICAL",
        source: "SMI Yay İmalat Standartları",
        message: "Kritik İmalat Reddi: Yay indeksi (C) 4'ün altındadır. Tel o kadar kalın ve yay çapı o kadar dar ki, sarım makinesinde (Spring Coiler) telin plastik deformasyona uğratılıp sarılması fiziken imkansızdır; sarılsa bile iç gerilmelerden dolayı anında kırılır."
      });
    }

    if ((ortalama_cap / tel_cap) > 12) {
      smartWarnings.push({
        severity: "WARNING",
        source: "SMI Yay İmalat Standartları",
        message: "Uyarı: Yay indeksi 12'nin üzerindedir. Yay kendi ağırlığını taşımakta bile zorlanacak, basma kuvveti altında anında burkulacaktır (Buckling). Tel çapını artırın veya içine kılavuz mil (Guide Pin) ekleyin."
      });
    }
  
  return {
    result: 0,
    smartWarnings
  };
}
