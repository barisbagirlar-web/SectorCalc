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
 * ID: MECH_347
 * Name: Dişli Kutusu Verim ve Isıl Güç Kapasitesi
 */

export const InputSchema_MECH_347 = z.object({
  giris_gucu: z.number(),
  govde_yuzey_alani: z.number(),
  disli_verimi: z.number(),
  ortam_sicakligi: z.number(),
});

export type Input_MECH_347 = z.infer<typeof InputSchema_MECH_347>;

export interface Output_MECH_347 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_MECH_347(input: Input_MECH_347): Output_MECH_347 {
  const validData = InputSchema_MECH_347.parse(input);
  const { giris_gucu, govde_yuzey_alani, disli_verimi, ortam_sicakligi } = validData as any;
  

  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if ((giris_gucu * (1 - (disli_verimi/100))) / govde_yuzey_alani > 0.6 && ortam_sicakligi > 40) {
      smartWarnings.push({
        severity: "CRITICAL",
        source: "AGMA / ISO 14179 Thermal Capacity",
        message: "Kritik Termal Kaçak Riski: Dişli kutusunun kayıp ısı enerjisi, gövde yüzey alanından doğal taşınımla atılamıyor. Yağ sıcaklığı 95°C'yi aşarak viskozitesini kaybedecek, yağ filmi yırtılacak ve dişliler saracaktır. Şanzımana harici eşanjör veya fan ekleyin."
      });
    }
  
  return {
    result: 0,
    smartWarnings
  };
}
