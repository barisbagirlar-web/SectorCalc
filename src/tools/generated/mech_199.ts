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
 * ID: MECH_199
 * Name: Çelik Kiriş (Eğilme)
 */

export const InputSchema_MECH_199 = z.object({
  moment: z.number(),
  kesit_modulu: z.number(),
});

export type Input_MECH_199 = z.infer<typeof InputSchema_MECH_199>;

export interface Output_MECH_199 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_MECH_199(input: Input_MECH_199): Output_MECH_199 {
  const validData = InputSchema_MECH_199.parse(input);
  const { moment, kesit_modulu } = validData as any;
  

  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (Gerilme_Result > 235000000) {
      smartWarnings.push({
        severity: "WARNING",
        source: "AISC Çelik Yapılar",
        message: "Uyarı: Dış liflerdeki eğilme gerilmesi (Bending Stress) 235 MPa'yı aşmaktadır. Standart yapı çeliklerinde (S235JR) plastik mafsal oluşumu (Yielding) başlar. Kiriş kesiti (IPE/HEA) büyütülmelidir."
      });
    }
  
  return {
    result: 0,
    smartWarnings
  };
}
