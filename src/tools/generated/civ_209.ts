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
 * ID: CIV_209
 * Name: Ahşap Kiriş (Kesme)
 */

export const InputSchema_CIV_209 = z.object({
  kesme_kuvveti: z.number(),
  genislik: z.number(),
  yukseklik: z.number(),
});

export type Input_CIV_209 = z.infer<typeof InputSchema_CIV_209>;

export interface Output_CIV_209 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_CIV_209(input: Input_CIV_209): Output_CIV_209 {
  const validData = InputSchema_CIV_209.parse(input);
  const { kesme_kuvveti, genislik, yukseklik } = validData as any;
  

  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (((1.5 * kesme_kuvveti) / (genislik * yukseklik)) > 1500000) {
      smartWarnings.push({
        severity: "WARNING",
        source: "NDS (National Design Specification for Wood Construction)",
        message: "Uyarı: Liflere paralel doğrultudaki maksimum kayma gerilmesi ahşap malzeme sınırlarını (1.5 MPa) aşmıştır. Lif boyunca çatlama ve katmanlarına ayrılma riski mevcuttur."
      });
    }
  
  return {
    result: 0,
    smartWarnings
  };
}
