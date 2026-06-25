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
 * ID: MECH_389
 * Name: Hidrolik Pompa Emme Özgül Hızı (Nss - Suction Specific Speed)
 */

export const InputSchema_MECH_389 = z.object({
  devir: z.number(),
  debi: z.number(),
  npsh_r: z.number(),
});

export type Input_MECH_389 = z.infer<typeof InputSchema_MECH_389>;

export interface Output_MECH_389 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_MECH_389(input: Input_MECH_389): Output_MECH_389 {
  const validData = InputSchema_MECH_389.parse(input);
  const { devir, debi, npsh_r } = validData as any;
  

  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if ((devir * SQRT(debi)) / POWER(npsh_r, 0.75) > 11000) {
      smartWarnings.push({
        severity: "CRITICAL",
        source: "API 610 Pompa Standartları",
        message: "Kritik Kavitasyon/Titreşim Riski: Emme Özgül Hızı (Nss) 11.000 sınırını aşmıştır. Bu tip pervaneler (Impeller) tasarımsal olarak stabil değildir; kısmi yüklerde çalışırken çark girişinde şiddetli resirkülasyon (Recirculation Cavitation) yaşanacak ve pompa aşırı titreşimle parçalanacaktır."
      });
    }
  
  return {
    result: 0,
    smartWarnings
  };
}
