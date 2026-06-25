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
 * ID: MECH_217
 * Name: Isıl Genleşme
 */

export const InputSchema_MECH_217 = z.object({
  ilk_boy: z.number(),
  sicaklik_farki: z.number(),
  genlesme_katsayisi: z.number(),
});

export type Input_MECH_217 = z.infer<typeof InputSchema_MECH_217>;

export interface Output_MECH_217 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_MECH_217(input: Input_MECH_217): Output_MECH_217 {
  const validData = InputSchema_MECH_217.parse(input);
  const { ilk_boy, sicaklik_farki, genlesme_katsayisi } = validData as any;
  

  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if ((ilk_boy * sicaklik_farki * genlesme_katsayisi) > 0.00005) {
      smartWarnings.push({
        severity: "CRITICAL",
        source: "ISO 286 İmalat Toleransları",
        message: "Kritik Uyarı: İmalat ortamı veya çalışma ısısı nedeniyle parçadaki boyutsal büyüme 50 mikronu (0.05 mm) aşıyor. Bu durum hassas toleranslı mil-delik geçmelerinde (Örn: H7/g6) doğrudan sıkışmaya veya rulman kilitlenmesine neden olacaktır."
      });
    }
  
  return {
    result: 0,
    smartWarnings
  };
}
