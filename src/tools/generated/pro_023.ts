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
 * ID: PRO_023
 * Name: CPK-PPM Dönüştürücü ve Kalite Kayıp Finansı
 */

export const InputSchema_PRO_023 = z.object({
  usl: z.number(),
  lsl: z.number(),
  process_mean: z.number(),
  std_dev: z.number(),
  daily_volume: z.number(),
  cost_per_defect: z.number(),
});

export type Input_PRO_023 = z.infer<typeof InputSchema_PRO_023>;

export interface Output_PRO_023 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_PRO_023(input: Input_PRO_023): Output_PRO_023 {
  const validData = InputSchema_PRO_023.parse(input);
  const { usl, lsl, process_mean, std_dev, daily_volume, cost_per_defect } = validData as any;
  
  const Z_USL = (usl - process_mean) / std_dev;
  const Z_LSL = (process_mean - lsl) / std_dev;
  const Cp = (usl - lsl) / (6 * std_dev);
  const Cpk = Math.min(Z_USL, Z_LSL) / 3;
  const P_above = 1 - jStat.normal.cdf(Z_USL);
  const P_below = jStat.normal.cdf(-Z_LSL);
  const Total_PPM = (P_above + P_below) * 1000000;
  const Sigma_Level = Cpk * 3 + 1.5;
  const Daily_Scrap_Cost = (Total_PPM / 1000000) * daily_volume * cost_per_defect;
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (Cpk < 1.33) {
      smartWarnings.push({
        severity: "CRITICAL",
        source: "AIAG SPC Standartları",
        message: "Kritik Süreç Yetersizliği: Cpk değeriniz 1.33'ün altındadır (Otomotiv endüstrisi min. kabul sınırı). Süreciniz teknik spesifikasyonları karşılamakta zorlanıyor ve yüksek oranda (PPM bazında) hurda üretiyor. Varyansı düşürün."
      });
    }

    if (Cp > (Cpk * 1.5)) {
      smartWarnings.push({
        severity: "WARNING",
        source: "Süreç Merkezleme",
        message: "Uyarı: Cp değeriniz Cpk'ya göre oldukça yüksek. Sürecinizin potansiyeli iyi ancak ortalaması (Mean) hedeften çok kaymış durumda. Makine ayarını (Setup) merkeze çekerseniz PPM dramatik şekilde düşecektir."
      });
    }
  
  return {
    result: Daily_Scrap_Cost,
    smartWarnings
  };
}
