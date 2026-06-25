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
 * ID: MECH_274
 * Name: Hidrolik Silindir Strok Hızı
 */

export const InputSchema_MECH_274 = z.object({
  pompa_debisi: z.number(),
  piston_capi: z.number(),
  boru_capi: z.number(),
});

export type Input_MECH_274 = z.infer<typeof InputSchema_MECH_274>;

export interface Output_MECH_274 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_MECH_274(input: Input_MECH_274): Output_MECH_274 {
  const validData = InputSchema_MECH_274.parse(input);
  const { pompa_debisi, piston_capi, boru_capi } = validData as any;
  

  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (((pompa_debisi / 60000) / (3.14159 * (boru_capi/2000) * (boru_capi/2000))) > 6) {
      smartWarnings.push({
        severity: "CRITICAL",
        source: "ISO 4413 Hidrolik Akışkan Gücü",
        message: "Kritik Uyarı: Basınç hattındaki akışkan hızı 6 m/s'yi aşıyor. Sistemde şiddetli türbülans, yağ ısınması (Termal Degradation) ve valflerde kavitasyon oluşacaktır. Bağlantı borusu ve rekor çaplarını acilen büyütün."
      });
    }
  
  return {
    result: 0,
    smartWarnings
  };
}
