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
 * ID: MECH_313
 * Name: Rulman Ön Yükleme (Preload) Kuvveti
 */

export const InputSchema_MECH_313 = z.object({
  dinamik_kapasite: z.number(),
  uygulanan_onyuk: z.number(),
  calisma_devri: z.number(),
});

export type Input_MECH_313 = z.infer<typeof InputSchema_MECH_313>;

export interface Output_MECH_313 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_MECH_313(input: Input_MECH_313): Output_MECH_313 {
  const validData = InputSchema_MECH_313.parse(input);
  const { dinamik_kapasite, uygulanan_onyuk, calisma_devri } = validData as any;
  

  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if ((uygulanan_onyuk / dinamik_kapasite) > 0.05 && calisma_devri > 5000) {
      smartWarnings.push({
        severity: "WARNING",
        source: "SKF Spindle Yataklama Standartları",
        message: "Uyarı: Yüksek devirli CNC spindle rulmanları için %5 C üzeri ön yükleme aşırı ısınmaya (Thermal Runaway) yol açar. Isı, yataklamayı genleştirerek ön yükü geometrik olarak artırır ve rulmanı patlatır."
      });
    }
  
  return {
    result: 0,
    smartWarnings
  };
}
