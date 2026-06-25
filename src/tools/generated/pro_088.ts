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
 * ID: PRO_088
 * Name: Gage R&R (Ölçüm Sistemi Analizi) ve Yanlış Kabul Riski
 */

export const InputSchema_PRO_088 = z.object({
  ev_equipment_variation: z.number(),
  av_appraiser_variation: z.number(),
  pv_part_variation: z.number(),
  tolerance_band: z.number(),
});

export type Input_PRO_088 = z.infer<typeof InputSchema_PRO_088>;

export interface Output_PRO_088 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_PRO_088(input: Input_PRO_088): Output_PRO_088 {
  const validData = InputSchema_PRO_088.parse(input);
  const { ev_equipment_variation, av_appraiser_variation, pv_part_variation, tolerance_band } = validData as any;
  
  const GRR_Total = Math.sqrt(Math.pow(ev_equipment_variation, 2) + Math.pow(av_appraiser_variation, 2));
  const TV_Total_Variation = Math.sqrt(Math.pow(GRR_Total, 2) + Math.pow(pv_part_variation, 2));
  const Pct_GRR_to_TV = (GRR_Total / TV_Total_Variation) * 100;
  const Pct_GRR_to_Tolerance = (6 * GRR_Total) / tolerance_band * 100;
  const NDC_Number_Distinct_Categories = FLOOR(1.41 * (pv_part_variation / GRR_Total));
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (NDC_Number_Distinct_Categories < 5) {
      smartWarnings.push({
        severity: "CRITICAL",
        source: "AIAG MSA Kılavuzu",
        message: "Kritik Sistem Reddi: NDC (Ayrık Kategori Sayısı) 5'in altındadır. Cihazınızın çözünürlüğü ve tekrarlanabilirliği süreci yönetecek veya parçayı ölçecek kadar hassas değildir. Sağlam ürünleri hurdaya ayırma (False Reject) riski maksimumdur. Cihaz kalibrasyona veya değişime gitmelidir."
      });
    }

    if (Pct_GRR_to_TV > 30) {
      smartWarnings.push({
        severity: "WARNING",
        source: "AIAG MSA Kılavuzu",
        message: "Kabul Edilemez Varyans: Toplam GRR %30'un üzerindedir. Ölçüm hatalarından kaynaklı varyasyon, parçanın kendi varyasyonunu maskelemektedir."
      });
    }
  
  return {
    result: NDC_Number_Distinct_Categories,
    smartWarnings
  };
}
