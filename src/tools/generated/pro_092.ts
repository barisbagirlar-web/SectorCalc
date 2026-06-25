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
 * ID: PRO_092
 * Name: Yangın Hidrantı Akış ve Şebeke Basınç Analizi (NFPA 291)
 */

export const InputSchema_PRO_092 = z.object({
  hydrant_dia: z.number(),
  pitot_p: z.number(),
  static_p: z.number(),
  residual_p: z.number(),
  cd: z.number(),
  required_flow: z.number(),
});

export type Input_PRO_092 = z.infer<typeof InputSchema_PRO_092>;

export interface Output_PRO_092 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_PRO_092(input: Input_PRO_092): Output_PRO_092 {
  const validData = InputSchema_PRO_092.parse(input);
  const { hydrant_dia, pitot_p, static_p, residual_p, cd, required_flow } = validData as any;
  
  const FlowRate_gpm = 29.83 * cd * Math.pow(hydrant_dia, 2) * Math.sqrt(pitot_p);
  const Flow_At_20psi = FlowRate_gpm * Math.pow((static_p - 20) / (static_p - residual_p), 0.54);
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (residual_p < 20) {
      smartWarnings.push({
        severity: "CRITICAL",
        source: "NFPA 291",
        message: "Şebeke Çökme Riski: Kalan (Residual) basınç 20 psi'nin altına düşmüştür. Şehir şebekesinde negatif basınç oluşarak kirli suların (Cross-Contamination) şebekeye emilmesi ve itfaiye pompalarında kavitasyon oluşması riski mevcuttur."
      });
    }

    if (Flow_At_20psi < required_flow) {
      smartWarnings.push({
        severity: "WARNING",
        source: "Tesis Yangın Senaryosu",
        message: "Kapasite Yetersizliği: Şebekenin 20 psi güvenli sınırında sağlayabileceği teorik maksimum debi, tesisinizin yangın senaryosu için gereken debinin altındadır. İlave su deposu ve yangın pompası yatırımı gereklidir."
      });
    }
  
  return {
    result: Flow_At_20psi,
    smartWarnings
  };
}
