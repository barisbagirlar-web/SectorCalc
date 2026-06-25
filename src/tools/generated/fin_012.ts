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
 * ID: FIN_012
 * Name: Günlük/Aylık/Yıllık Bileşik Faiz
 */

export const InputSchema_FIN_012 = z.object({
  anapara: z.number(),
  faiz: z.number(),
  gun: z.number(),
});

export type Input_FIN_012 = z.infer<typeof InputSchema_FIN_012>;

export interface Output_FIN_012 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_FIN_012(input: Input_FIN_012): Output_FIN_012 {
  const validData = InputSchema_FIN_012.parse(input);
  const { anapara, faiz, gun } = validData as any;
  

  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (gun < 30) {
      smartWarnings.push({
        severity: "INFO",
        source: "Bankacılık Uygulamaları",
        message: "Not: 30 günden kısa vadelerde, çoğu ticari kurum bileşik faiz yerine basit faiz işletmeyi tercih eder. Sözleşme şartlarınızı kontrol edin."
      });
    }
  
  return {
    result: 0,
    smartWarnings
  };
}
