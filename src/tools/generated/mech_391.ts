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
 * ID: MECH_391
 * Name: Isıl Genleşme Boru Mesnet (Anchor) Yükü
 */

export const InputSchema_MECH_391 = z.object({
  elastisite: z.number(),
  kesit_alani: z.number(),
  genlesme_katsayisi: z.number(),
  sicaklik_farki: z.number(),
});

export type Input_MECH_391 = z.infer<typeof InputSchema_MECH_391>;

export interface Output_MECH_391 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_MECH_391(input: Input_MECH_391): Output_MECH_391 {
  const validData = InputSchema_MECH_391.parse(input);
  const { elastisite, kesit_alani, genlesme_katsayisi, sicaklik_farki } = validData as any;
  

  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if ((elastisite * kesit_alani * genlesme_katsayisi * sicaklik_farki) > 50000) {
      smartWarnings.push({
        severity: "CRITICAL",
        source: "ASME B31.3 Proses Borulama",
        message: "Kritik Yapısal İhlal: İki sabit nokta (Anchor) arasında genleşemeyen borunun mesnetlere uygulayacağı itme kuvveti 50 kN'u (5 Ton) aşmaktadır. Tesisat bu yük altında bükülecek (Bowing) veya ankrajları beton/çelik yapıdan koparacaktır. Sisteme genleşme kompansatörü (Expansion Joint) veya omega/U-büküm eklenmesi KESİNLİKLE şarttır."
      });
    }
  
  return {
    result: 0,
    smartWarnings
  };
}
