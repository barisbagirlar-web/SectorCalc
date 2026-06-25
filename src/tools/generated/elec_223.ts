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
 * ID: ELEC_223
 * Name: AC Güç ve Güç Faktörü
 */

export const InputSchema_ELEC_223 = z.object({
  gorunur_guc: z.number(),
  aktif_guc: z.number(),
});

export type Input_ELEC_223 = z.infer<typeof InputSchema_ELEC_223>;

export interface Output_ELEC_223 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_ELEC_223(input: Input_ELEC_223): Output_ELEC_223 {
  const validData = InputSchema_ELEC_223.parse(input);
  const { gorunur_guc, aktif_guc } = validData as any;
  

  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if ((aktif_guc / gorunur_guc) < 0.85) {
      smartWarnings.push({
        severity: "CRITICAL",
        source: "Şebeke Regülasyonları (IEC / TEDAŞ)",
        message: "Kritik Uyarı: Güç faktörünüz (Cos φ) 0.85'in altında. Sistem şebekeden aşırı reaktif güç çekmektedir. Kompanzasyon panosu kurulmazsa elektrik faturanıza ağır 'Reaktif Ceza' yansıyacak ve trafo kapasiteniz boşa harcanacaktır."
      });
    }
  
  return {
    result: 0,
    smartWarnings
  };
}
