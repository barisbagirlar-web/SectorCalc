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
 * ID: MECH_267
 * Name: O-Ring Kanal Sıkışma (Squeeze) Oranı
 */

export const InputSchema_MECH_267 = z.object({
  kesit_cap: z.number(),
  kanal_derinligi: z.number(),
});

export type Input_MECH_267 = z.infer<typeof InputSchema_MECH_267>;

export interface Output_MECH_267 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_MECH_267(input: Input_MECH_267): Output_MECH_267 {
  const validData = InputSchema_MECH_267.parse(input);
  const { kesit_cap, kanal_derinligi } = validData as any;
  

  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (((kesit_cap - kanal_derinligi) / kesit_cap) * 100 < 10) {
      smartWarnings.push({
        severity: "WARNING",
        source: "Parker O-Ring Handbook",
        message: "Uyarı: Sıkışma (Squeeze) oranı %10'un altındadır. Düşük basınçlı veya gaz/vakum sistemlerinde kesinlikle sızıntı (Leakage) yapacaktır. Minimum %15 statik sıkışma tavsiye edilir."
      });
    }

    if (((kesit_cap - kanal_derinligi) / kesit_cap) * 100 > 30) {
      smartWarnings.push({
        severity: "CRITICAL",
        source: "Parker O-Ring Handbook",
        message: "Kritik Uyarı: Sıkışma oranı %30'u aşmaktadır. O-Ring montaj sırasında aşırı gerilime maruz kalarak yırtılacak (Compression Set / Extrusion), kauçuk malzeme kanal dışına taşarak parçalanacaktır."
      });
    }
  
  return {
    result: 0,
    smartWarnings
  };
}
