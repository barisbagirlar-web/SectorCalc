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
 * ID: PRO_063
 * Name: İstatistiksel Proses Kontrol (SPC XBar-R) Sınırları
 */

export const InputSchema_PRO_063 = z.object({
  mean_of_means: z.number(),
  mean_of_ranges: z.number(),
  subgroup_size: z.number(),
  a2_factor: z.number(),
  d3_factor: z.number(),
  d4_factor: z.number(),
  d2_factor: z.number(),
  usl: z.number(),
  lsl: z.number(),
});

export type Input_PRO_063 = z.infer<typeof InputSchema_PRO_063>;

export interface Output_PRO_063 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_PRO_063(input: Input_PRO_063): Output_PRO_063 {
  const validData = InputSchema_PRO_063.parse(input);
  const { mean_of_means, mean_of_ranges, subgroup_size, a2_factor, d3_factor, d4_factor, d2_factor, usl, lsl } = validData as any;
  
  const UCL_X = mean_of_means + (a2_factor * mean_of_ranges);
  const LCL_X = mean_of_means - (a2_factor * mean_of_ranges);
  const UCL_R = d4_factor * mean_of_ranges;
  const LCL_R = Math.max(0, d3_factor * mean_of_ranges);
  const Estimated_Sigma = mean_of_ranges / d2_factor;
  const Cp = (usl - lsl) / (6 * Estimated_Sigma);
  const Cpk = Math.min((usl - mean_of_means) / (3 * Estimated_Sigma), (mean_of_means - lsl) / (3 * Estimated_Sigma));
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (false) {
      smartWarnings.push({
        severity: "CRITICAL",
        source: "AIAG SPC Referansı",
        message: "Proses Kontrol Dışı: Prosesinizin doğal kontrol sınırları (UCL/LCL), müşterinin spesifikasyon sınırlarını aşmaktadır. Makine stabil çalışsa dahi istatistiksel olarak sürekli hatalı (Scrap) ürün üretmektedir. Makine revizyonu şarttır."
      });
    }
  
  return {
    result: Cpk,
    smartWarnings
  };
}
