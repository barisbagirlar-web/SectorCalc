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
 * ID: PRO_037
 * Name: EVM (Kazanılmış Değer) ve TCPI Kurtarma Analizi
 */

export const InputSchema_PRO_037 = z.object({
  bac: z.number(),
  pv: z.number(),
  ev: z.number(),
  ac: z.number(),
  management_reserve: z.number(),
});

export type Input_PRO_037 = z.infer<typeof InputSchema_PRO_037>;

export interface Output_PRO_037 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_PRO_037(input: Input_PRO_037): Output_PRO_037 {
  const validData = InputSchema_PRO_037.parse(input);
  const { bac, pv, ev, ac, management_reserve } = validData as any;
  
  const SPI = ev / pv;
  const CPI = ev / ac;
  const Cost_Variance_CV = ev - ac;
  const Schedule_Variance_SV = ev - pv;
  const Estimate_At_Completion_EAC = bac / CPI;
  const Estimate_To_Complete_ETC = EAC - ac;
  const Variance_At_Completion_VAC = bac - EAC;
  const TCPI_To_BAC = (bac - ev) / (bac - ac);
  const Net_Financial_Position = VAC + management_reserve;
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (TCPI_To_BAC > 1.10) {
      smartWarnings.push({
        severity: "CRITICAL",
        source: "PMI / Earned Value Analizi",
        message: "Kritik Proje İflası: TCPI (To-Complete Performance Index) 1.10'u aşmıştır. Kalan bütçe (BAC) hedefini tutturabilmek için ekibin bundan sonra imkansız bir verimlilikle çalışması gereklidir. Bütçe tavanını revize etmeden (EAC bazlı yeni bütçe) ilerlemek projenin durmasına neden olacaktır."
      });
    }

    if (SPI < 0.90 && CPI < 0.90) {
      smartWarnings.push({
        severity: "WARNING",
        source: "Proje Sağlık Durumu",
        message: "Uyarı: Proje hem zaman çizelgesinin gerisinde (SPI < 1) hem de bütçeyi aşıyor (CPI < 1). Gecikmeyi kapatmak için kaynak eklerseniz (Crashing) maliyet (CPI) daha da kötüleşecektir."
      });
    }
  
  return {
    result: Net_Financial_Position,
    smartWarnings
  };
}
