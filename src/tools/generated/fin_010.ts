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
 * ID: FIN_010
 * Name: Basit Faiz
 */

export const InputSchema_FIN_010 = z.object({
  anapara: z.number(),
  faiz: z.number(),
  sure: z.number(),
});

export type Input_FIN_010 = z.infer<typeof InputSchema_FIN_010>;

export interface Output_FIN_010 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_FIN_010(input: Input_FIN_010): Output_FIN_010 {
  const validData = InputSchema_FIN_010.parse(input);
  const { anapara, faiz, sure } = validData as any;
  

  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (sure > 5) {
      smartWarnings.push({
        severity: "INFO",
        source: "Zaman Değeri Konsepti",
        message: "Not: Süre 5 yılı aşıyor. Uzun vadeli yatırımlarda basit faiz yerine 'Bileşik Faiz' (Compound Interest) kullanılması paranın gerçek değerini yansıtmak açısından daha doğrudur."
      });
    }
  
  return {
    result: 0,
    smartWarnings
  };
}
