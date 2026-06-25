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
 * ID: CNC_216
 * Name: Net Kesme Gücü (Pc)
 */

export const InputSchema_CNC_216 = z.object({
  ap: z.number(),
  f: z.number(),
  vc: z.number(),
  kc: z.number(),
  verim: z.number(),
});

export type Input_CNC_216 = z.infer<typeof InputSchema_CNC_216>;

export interface Output_CNC_216 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_CNC_216(input: Input_CNC_216): Output_CNC_216 {
  const validData = InputSchema_CNC_216.parse(input);
  const { ap, f, vc, kc, verim } = validData as any;
  

  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if ((((ap * f * vc * kc) / 60000) / verim) > 20) {
      smartWarnings.push({
        severity: "WARNING",
        source: "Spindle Yük Sınırları",
        message: "Uyarı: Gerekli motor gücü 20 kW'ın üzerindedir. Ağır tip endüstriyel CNC yatay işleme veya dikey torna tezgâhınız yoksa, spindle motorunuz bu yük altında aşırı akım (Overload) çekerek alarm verecektir."
      });
    }
  
  return {
    result: 0,
    smartWarnings
  };
}
