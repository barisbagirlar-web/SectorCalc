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
 * ID: ELEC_226
 * Name: Transformatör Sarım Oranı
 */

export const InputSchema_ELEC_226 = z.object({
  v_primer: z.number(),
  n_primer: z.number(),
  n_sekonder: z.number(),
});

export type Input_ELEC_226 = z.infer<typeof InputSchema_ELEC_226>;

export interface Output_ELEC_226 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_ELEC_226(input: Input_ELEC_226): Output_ELEC_226 {
  const validData = InputSchema_ELEC_226.parse(input);
  const { v_primer, n_primer, n_sekonder } = validData as any;
  

  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (n_sekonder / n_primer > 20 || n_primer / n_sekonder > 20) {
      smartWarnings.push({
        severity: "INFO",
        source: "Trafo İzolasyon Sınırları",
        message: "Not: Dönüştürme oranı 20:1'den büyüktür. Bu kadar agresif gerilim düşürme/yükseltme işlemleri tek kademede yapıldığında izolasyon stresleri ve kaçak akı (Leakage Flux) çok artar. Çift kademeli trafo değerlendirilebilir."
      });
    }
  
  return {
    result: 0,
    smartWarnings
  };
}
