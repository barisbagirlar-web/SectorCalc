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
 * ID: CNC_304
 * Name: Vidalı Mil (Ball Screw) Kritik Devir
 */

export const InputSchema_CNC_304 = z.object({
  mil_cap: z.number(),
  mil_uzunluk: z.number(),
  calisma_devri: z.number(),
  yataklama_tipi: z.number(),
});

export type Input_CNC_304 = z.infer<typeof InputSchema_CNC_304>;

export interface Output_CNC_304 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_CNC_304(input: Input_CNC_304): Output_CNC_304 {
  const validData = InputSchema_CNC_304.parse(input);
  const { mil_cap, mil_uzunluk, calisma_devri, yataklama_tipi } = validData as any;
  

  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (calisma_devri > (yataklama_tipi * 10000000 * mil_cap / (mil_uzunluk * mil_uzunluk)) * 0.8) {
      smartWarnings.push({
        severity: "CRITICAL",
        source: "THK / HIWIN Vidalı Mil Standartları",
        message: "Kritik Mekanik Risk: Hedeflenen devir, vidalı milin kritik (rezonans) devrinin %80'ini aşmaktadır. Sistemde şiddetli kamçılama (Whipping) başlayacak, mil bükülecek ve bilye somunu parçalanacaktır. Çapı artırın veya uzunluğu düşürün."
      });
    }
  
  return {
    result: 0,
    smartWarnings
  };
}
