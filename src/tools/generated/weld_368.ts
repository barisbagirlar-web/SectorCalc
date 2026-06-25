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
 * ID: WELD_368
 * Name: Kaynak Köşe Boyutu (Fillet Weld Sizing)
 */

export const InputSchema_WELD_368 = z.object({
  kalin_sac: z.number(),
  hedef_kaynak_boyutu: z.number(),
});

export type Input_WELD_368 = z.infer<typeof InputSchema_WELD_368>;

export interface Output_WELD_368 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_WELD_368(input: Input_WELD_368): Output_WELD_368 {
  const validData = InputSchema_WELD_368.parse(input);
  const { kalin_sac, hedef_kaynak_boyutu } = validData as any;
  

  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (hedef_kaynak_boyutu < 3 && kalin_sac >= 6) {
      smartWarnings.push({
        severity: "CRITICAL",
        source: "AWS D1.1 Structural Welding Code",
        message: "Kritik Kalite İhlali: 6 mm ve üzeri kalınlıktaki sacların köşe kaynak birleşimlerinde (T-Joint), kaynak bacak boyu (Leg Size) minimum 3 mm (veya 5mm) olmalıdır. Düşük boyut ısıl gerilmeleri karşılayamaz ve kök yırtılması (Root Cracking) yapar."
      });
    }

    if (hedef_kaynak_boyutu > kalin_sac) {
      smartWarnings.push({
        severity: "INFO",
        source: "Kaynak Ekonomisi",
        message: "Bilgi: Kaynak bacak boyu sac kalınlığını aşıyor. Mekanik dayanım en zayıf kesit (Sac) tarafından belirleneceğinden, sac kalınlığından daha büyük bir kaynak çekmek sıfır ek mukavemet sağlar, sadece tel/gaz ve zaman israfıdır (Overwelding)."
      });
    }
  
  return {
    result: 0,
    smartWarnings
  };
}
