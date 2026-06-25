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
 * ID: AUT_385
 * Name: Pnömatik Valf Kritik Basınç Oranı (b Değeri)
 */

export const InputSchema_AUT_385 = z.object({
  cikis_basinci_sinir: z.number(),
  giris_basinci: z.number(),
});

export type Input_AUT_385 = z.infer<typeof InputSchema_AUT_385>;

export interface Output_AUT_385 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_AUT_385(input: Input_AUT_385): Output_AUT_385 {
  const validData = InputSchema_AUT_385.parse(input);
  const { cikis_basinci_sinir, giris_basinci } = validData as any;
  

  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if ((cikis_basinci_sinir / giris_basinci) > 0.528) {
      smartWarnings.push({
        severity: "WARNING",
        source: "İdeal Gaz Dinamiği",
        message: "Uyarı: Pnömatik sistemlerde kritik basınç oranı (b) hava için teorik olarak 0.528'dir. Elde edilen değerin 0.528'den çok yüksek olması, valf iç geometrisinde (Spool/Poppet) ciddi bir daralma veya türbülans kaybı olduğunu gösterir."
      });
    }
  
  return {
    result: 0,
    smartWarnings
  };
}
