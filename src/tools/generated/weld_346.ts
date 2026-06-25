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
 * ID: WELD_346
 * Name: Kaynak Dikişi Mikroyapı ve Soğuma Analizi
 */

export const InputSchema_WELD_346 = z.object({
  karbon_esdegeri: z.number(),
  soguma_hizi: z.number(),
});

export type Input_WELD_346 = z.infer<typeof InputSchema_WELD_346>;

export interface Output_WELD_346 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_WELD_346(input: Input_WELD_346): Output_WELD_346 {
  const validData = InputSchema_WELD_346.parse(input);
  const { karbon_esdegeri, soguma_hizi } = validData as any;
  

  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (karbon_esdegeri > 0.42 && soguma_hizi < 6) {
      smartWarnings.push({
        severity: "CRITICAL",
        source: "AWS D1.1 / IIW Metallurgical Rules",
        message: "Kritik Soğuk Çatlak Riski: Yüksek karbon eşdeğerine sahip bu çelikte t8/5 soğuma süresi 6 saniyenin altındadır. Isıdan Etkilenen Bölgede (HAZ) kırılgan Martenzit yapısı oluşacak ve dikiş içindeki hidrojen nedeniyle kaynak aniden çatlayacaktır. Ön ısıtmayı artırın."
      });
    }
  
  return {
    result: 0,
    smartWarnings
  };
}
