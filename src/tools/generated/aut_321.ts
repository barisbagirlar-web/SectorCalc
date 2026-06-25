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
 * ID: AUT_321
 * Name: Servo Motor Rejeneratif Frenleme Enerjisi
 */

export const InputSchema_AUT_321 = z.object({
  sistem_ataleti: z.number(),
  hiz: z.number(),
  surucu_kapasitesi: z.number(),
});

export type Input_AUT_321 = z.infer<typeof InputSchema_AUT_321>;

export interface Output_AUT_321 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_AUT_321(input: Input_AUT_321): Output_AUT_321 {
  const validData = InputSchema_AUT_321.parse(input);
  const { sistem_ataleti, hiz, surucu_kapasitesi } = validData as any;
  

  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if ((0.5 * sistem_ataleti * hiz * hiz) > surucu_kapasitesi) {
      smartWarnings.push({
        severity: "CRITICAL",
        source: "Yaskawa / Siemens Sürücü Standartları",
        message: "Kritik Elektriksel Arıza: Yüksek atalete sahip yükün ani duruşuyla motorda jeneratör modunda (Rejeneratif) üretilen enerji, sürücünün dâhili kapasitör sınırını aşmaktadır. Sürücü anında 'Overvoltage / Aşırı Gerilim' hatasına geçip yükü serbest bırakacaktır. Harici Frenleme Direnci (Braking Resistor) bağlanması ZORUNLUDUR."
      });
    }
  
  return {
    result: 0,
    smartWarnings
  };
}
