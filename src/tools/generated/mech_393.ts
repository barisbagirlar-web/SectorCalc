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
 * ID: MECH_393
 * Name: Volan (Flywheel) Kinetik Enerji ve Stres
 */

export const InputSchema_MECH_393 = z.object({
  atalet_momenti: z.number(),
  calisma_devri: z.number(),
  dis_cap: z.number(),
});

export type Input_MECH_393 = z.infer<typeof InputSchema_MECH_393>;

export interface Output_MECH_393 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_MECH_393(input: Input_MECH_393): Output_MECH_393 {
  const validData = InputSchema_MECH_393.parse(input);
  const { atalet_momenti, calisma_devri, dis_cap } = validData as any;
  

  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (((3.14159 * dis_cap * calisma_devri) / 60) > 250) {
      smartWarnings.push({
        severity: "CRITICAL",
        source: "Makine Tasarımı Patlama Limiti",
        message: "Kritik İSG Reddi: Volan çember hızı (Peripheral Velocity) 250 m/s'yi aşmaktadır. Standart çelik döküm volanlar merkezkaç kuvvetlerinden dolayı içten dışa doğru yırtılarak (Burst) şarapnel gibi patlar. Devri düşürün veya dövme/karbon-fiber kompozit volana geçin."
      });
    }
  
  return {
    result: 0,
    smartWarnings
  };
}
