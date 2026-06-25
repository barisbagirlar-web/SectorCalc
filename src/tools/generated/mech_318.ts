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
 * ID: MECH_318
 * Name: Mil Balans Sınıfı (ISO 1940 / G-Grade)
 */

export const InputSchema_MECH_318 = z.object({
  rotor_agirlik: z.number(),
  calisma_devri: z.number(),
  kabul_edilen_balanssizlik: z.number(),
});

export type Input_MECH_318 = z.infer<typeof InputSchema_MECH_318>;

export interface Output_MECH_318 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_MECH_318(input: Input_MECH_318): Output_MECH_318 {
  const validData = InputSchema_MECH_318.parse(input);
  const { rotor_agirlik, calisma_devri, kabul_edilen_balanssizlik } = validData as any;
  

  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if ((kabul_edilen_balanssizlik / (1000 * rotor_agirlik)) * ((3.14159 * calisma_devri) / 30) > 6.3) {
      smartWarnings.push({
        severity: "CRITICAL",
        source: "ISO 1940-1 Balans Kalitesi",
        message: "Kritik Titreşim Riski: Balans kalitesi G6.3 sınırının (Standart endüstriyel fan ve pompalar) çok üzerindedir. Sistemin yüksek devirde yarattığı merkezkaç kuvveti yatakları parçalayacaktır. Dinamik balans makinesinde (Rotor Balancing) talaş kaldırılarak dengelenmelidir."
      });
    }
  
  return {
    result: 0,
    smartWarnings
  };
}
