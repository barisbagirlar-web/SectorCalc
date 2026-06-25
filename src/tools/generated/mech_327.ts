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
 * ID: MECH_327
 * Name: Mil Kritik (Rezonans) Devri (Rayleigh Yöntemi)
 */

export const InputSchema_MECH_327 = z.object({
  statik_sehim: z.number(),
  calisma_devri: z.number(),
});

export type Input_MECH_327 = z.infer<typeof InputSchema_MECH_327>;

export interface Output_MECH_327 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_MECH_327(input: Input_MECH_327): Output_MECH_327 {
  const validData = InputSchema_MECH_327.parse(input);
  const { statik_sehim, calisma_devri } = validData as any;
  

  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (ABS(calisma_devri - (29.9 / SQRT(statik_sehim))) < (calisma_devri * 0.2)) {
      smartWarnings.push({
        severity: "CRITICAL",
        source: "API 610 / Makine Dinamiği",
        message: "Kritik İSG ve Hasar Riski: Çalışma devri, milin kritik rezonans hızına (Critical Speed) %20'lik tehlike bandı kadar yaklaşmıştır. Sistemde yıkıcı titreşimler oluşacak, rulmanlar patlayacak ve mil fırlayacaktır. Mili kalınlaştırın veya yatak arasını daraltın."
      });
    }
  
  return {
    result: 0,
    smartWarnings
  };
}
