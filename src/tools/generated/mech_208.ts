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
 * ID: MECH_208
 * Name: Kaynak Isı Girdisi
 */

export const InputSchema_MECH_208 = z.object({
  akim: z.number(),
  gerilim: z.number(),
  ilerleme_hizi: z.number(),
  verim: z.number(),
});

export type Input_MECH_208 = z.infer<typeof InputSchema_MECH_208>;

export interface Output_MECH_208 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_MECH_208(input: Input_MECH_208): Output_MECH_208 {
  const validData = InputSchema_MECH_208.parse(input);
  const { akim, gerilim, ilerleme_hizi, verim } = validData as any;
  

  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (((akim * gerilim * verim) / ilerleme_hizi) > 3500) {
      smartWarnings.push({
        severity: "CRITICAL",
        source: "ASME Section IX / AWS D1.1",
        message: "Kritik Uyarı: Birim kaynak boyuna düşen ısı girdisi çok yüksek (>3500 J/mm). Kaynak dikişinde aşırı aşırı ısınma, geniş HAZ bölgesi ve kaba taneli mikroyapı oluşarak darbe tokluğunu düşürecektir."
      });
    }
  
  return {
    result: 0,
    smartWarnings
  };
}
