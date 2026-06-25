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
 * ID: FIN_008
 * Name: Varlık Dağılımı
 */

export const InputSchema_FIN_008 = z.object({
  portfoy: z.number(),
  hisse: z.number(),
  tahvil: z.number(),
  nakit: z.number(),
});

export type Input_FIN_008 = z.infer<typeof InputSchema_FIN_008>;

export interface Output_FIN_008 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_FIN_008(input: Input_FIN_008): Output_FIN_008 {
  const validData = InputSchema_FIN_008.parse(input);
  const { portfoy, hisse, tahvil, nakit } = validData as any;
  

  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (hisse > 90) {
      smartWarnings.push({
        severity: "WARNING",
        source: "Modern Portföy Teorisi",
        message: "Uyarı: Portföyün %90'ından fazlası hisse senedinde. Agresif büyüme hedeflense de volatilite ve piyasa çöküşü riski maksimum seviyededir."
      });
    }
  
  return {
    result: 0,
    smartWarnings
  };
}
