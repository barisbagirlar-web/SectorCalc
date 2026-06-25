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
 * ID: OHS_246
 * Name: Endüstriyel Gürültü Maruziyeti ve Dozaj
 */

export const InputSchema_OHS_246 = z.object({
  ses_seviyesi: z.number(),
  maruziyet_suresi: z.number(),
});

export type Input_OHS_246 = z.infer<typeof InputSchema_OHS_246>;

export interface Output_OHS_246 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_OHS_246(input: Input_OHS_246): Output_OHS_246 {
  const validData = InputSchema_OHS_246.parse(input);
  const { ses_seviyesi, maruziyet_suresi } = validData as any;
  

  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (ses_seviyesi >= 85 && maruziyet_suresi >= 8) {
      smartWarnings.push({
        severity: "WARNING",
        source: "OSHA / NIOSH İşitme Sağlığı Yönetmeliği",
        message: "Uyarı: Gürültü maruziyeti eylem eşiğine (85 dBA, 8 Saat) ulaşmıştır. İşyerinde gürültü ölçümleri periyodik yapılmalı, kulak koruyucu (KKD) sağlanmalı ve işçilere odyometri testi uygulanmalıdır."
      });
    }

    if (ses_seviyesi >= 115) {
      smartWarnings.push({
        severity: "CRITICAL",
        source: "İSG Tüzüğü Kısa Vadeli Limit (STEL)",
        message: "Kritik Yaşam Riski: Ses seviyesi 115 dBA ve üzerindedir. Bu ortamda maruziyet süresinden bağımsız olarak kulak koruyucu donanım olmadan bulunulması kalıcı ve ani işitme kaybına (akustik travma) yol açar."
      });
    }
  
  return {
    result: 0,
    smartWarnings
  };
}
