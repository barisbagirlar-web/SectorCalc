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
 * ID: MECH_396
 * Name: Rulman Eşdeğer Statik Yükü (P0)
 */

export const InputSchema_MECH_396 = z.object({
  radyal_yuk: z.number(),
  eksenel_yuk: z.number(),
  statik_kapasite: z.number(),
  x0_y0_katsayisi: z.number(),
});

export type Input_MECH_396 = z.infer<typeof InputSchema_MECH_396>;

export interface Output_MECH_396 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_MECH_396(input: Input_MECH_396): Output_MECH_396 {
  const validData = InputSchema_MECH_396.parse(input);
  const { radyal_yuk, eksenel_yuk, statik_kapasite, x0_y0_katsayisi } = validData as any;
  

  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (((radyal_yuk) + (eksenel_yuk * x0_y0_katsayisi)) > (statik_kapasite * 0.5)) {
      smartWarnings.push({
        severity: "INFO",
        source: "SKF Statik Emniyet Kriteri",
        message: "Bilgi: Eşdeğer yük, statik kapasitenin %50'sini geçmektedir. Sistemde şok yükleri (Impact) veya ağır titreşimler varsa, statik emniyet katsayısı (S0) yetersiz kalabilir, daha büyük bir rulmana geçilmesi tavsiye edilir."
      });
    }
  
  return {
    result: 0,
    smartWarnings
  };
}
