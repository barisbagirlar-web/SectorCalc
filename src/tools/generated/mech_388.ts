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
 * ID: MECH_388
 * Name: Flanş Cıvatası Gerilme ve Conta (Gasket) Yükü
 */

export const InputSchema_MECH_388 = z.object({
  ic_basinc: z.number(),
  flans_ic_capi: z.number(),
  civata_sayisi: z.number(),
  civata_kesit: z.number(),
});

export type Input_MECH_388 = z.infer<typeof InputSchema_MECH_388>;

export interface Output_MECH_388 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_MECH_388(input: Input_MECH_388): Output_MECH_388 {
  const validData = InputSchema_MECH_388.parse(input);
  const { ic_basinc, flans_ic_capi, civata_sayisi, civata_kesit } = validData as any;
  

  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (((ic_basinc * 3.14159 * (flans_ic_capi/2) * (flans_ic_capi/2)) / (civata_sayisi * civata_kesit)) > 150) {
      smartWarnings.push({
        severity: "WARNING",
        source: "ASME B16.5 Flanş Tasarımı",
        message: "Uyarı: Hidrostatik itme (End Thrust) kuvvetinden cıvatalara binen çekme gerilmesi 150 MPa'yı aşmaktadır. Contanın sızdırmazlık sağlaması için gereken ek ön yük (Preload / Gasket Seating) hesaba katıldığında düşük kalite cıvatalar akma/kopma yaşayacaktır. Min. 8.8 veya B7 kalite cıvata kullanın."
      });
    }
  
  return {
    result: 0,
    smartWarnings
  };
}
