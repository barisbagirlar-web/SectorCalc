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
 * ID: MECH_348
 * Name: Pnömatik Akış Hatlarında Basınç Düşüşü
 */

export const InputSchema_MECH_348 = z.object({
  hava_debisi: z.number(),
  boru_ic_capi: z.number(),
  calisma_basinci: z.number(),
});

export type Input_MECH_348 = z.infer<typeof InputSchema_MECH_348>;

export interface Output_MECH_348 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_MECH_348(input: Input_MECH_348): Output_MECH_348 {
  const validData = InputSchema_MECH_348.parse(input);
  const { hava_debisi, boru_ic_capi, calisma_basinci } = validData as any;
  

  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (((hava_debisi / 60) / (3.14159 * (boru_ic_capi/2) * (boru_ic_capi/2))) / (calisma_basinci + 1) > 15) {
      smartWarnings.push({
        severity: "WARNING",
        source: "FESTO Pnömatik Tesisat Standartları",
        message: "Uyarı: Boru hattındaki sıkıştırılmış hava hızı 15 m/s sınırını aşmıştır. Hat sonunda aşırı basınç düşümü (Pressure Drop) yaşanacak, pnömatik silindirler istenen hıza ulaşamayacak ve türbülans nedeniyle yüksek gürültü oluşacaktır."
      });
    }
  
  return {
    result: 0,
    smartWarnings
  };
}
