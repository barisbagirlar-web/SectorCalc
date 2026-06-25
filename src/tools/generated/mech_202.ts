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
 * ID: MECH_202
 * Name: Tolerans ve Geçme
 */

export const InputSchema_MECH_202 = z.object({
  delik_cap: z.number(),
  mil_cap: z.number(),
});

export type Input_MECH_202 = z.infer<typeof InputSchema_MECH_202>;

export interface Output_MECH_202 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_MECH_202(input: Input_MECH_202): Output_MECH_202 {
  const validData = InputSchema_MECH_202.parse(input);
  const { delik_cap, mil_cap } = validData as any;
  

  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if ((delik_cap - mil_cap) < -0.0005) {
      smartWarnings.push({
        severity: "CRITICAL",
        source: "ISO 286 Tolerans Standartları",
        message: "Kritik Uyarı: Negatif boşluk (sıkılık) 500 mikronu aşmaktadır. Presleme esnasında parçaların deforme olması veya montajın kilitlenmesi riski mevcuttur."
      });
    }
  
  return {
    result: 0,
    smartWarnings
  };
}
