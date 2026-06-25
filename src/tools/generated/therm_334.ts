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
 * ID: THERM_334
 * Name: Eşanjör Kirlenme Faktörü (Fouling Factor - Rf)
 */

export const InputSchema_THERM_334 = z.object({
  temiz_u: z.number(),
  kirli_u: z.number(),
});

export type Input_THERM_334 = z.infer<typeof InputSchema_THERM_334>;

export interface Output_THERM_334 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_THERM_334(input: Input_THERM_334): Output_THERM_334 {
  const validData = InputSchema_THERM_334.parse(input);
  const { temiz_u, kirli_u } = validData as any;
  

  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if ((1/kirli_u) - (1/temiz_u) > 0.002) {
      smartWarnings.push({
        severity: "CRITICAL",
        source: "TEMA (Tubular Exchanger Manufacturers Assoc.)",
        message: "Kritik Bakım İhbarı: Kirlenme faktörü 0.002 m²K/W değerini aşmıştır. Boru yüzeylerinde ciddi kireç (Scaling), alg veya tortu birikimi var. Isı transfer verimi çökmüştür, sistemi acilen CIP (Clean-in-Place) asit/kimyasal yıkamasına alın."
      });
    }
  
  return {
    result: 0,
    smartWarnings
  };
}
