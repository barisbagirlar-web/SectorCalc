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
 * ID: MECH_269
 * Name: Sıcak Geçme Sıcaklık İhtiyacı
 */

export const InputSchema_MECH_269 = z.object({
  nominal_cap: z.number(),
  sikilik_payi: z.number(),
  genlesme_katsayisi: z.number(),
  ortam_sicakligi: z.number(),
});

export type Input_MECH_269 = z.infer<typeof InputSchema_MECH_269>;

export interface Output_MECH_269 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_MECH_269(input: Input_MECH_269): Output_MECH_269 {
  const validData = InputSchema_MECH_269.parse(input);
  const { nominal_cap, sikilik_payi, genlesme_katsayisi, ortam_sicakligi } = validData as any;
  

  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if ((sikilik_payi / (nominal_cap * genlesme_katsayisi)) + ortam_sicakligi > 250) {
      smartWarnings.push({
        severity: "CRITICAL",
        source: "Malzeme Metalurjisi / Rulman Montajı",
        message: "Kritik Uyarı: İstenen genleşmeyi sağlamak için parçanın 250°C'nin üzerine ısıtılması gerekmektedir. Eğer ısıtılan parça bir rulman veya ısıl işlemli bir göbek ise, bu sıcaklık su verme (Meneviş/Tempering) sınırını aşarak malzemenin sertliğini kalıcı olarak bozacaktır (Annealing)."
      });
    }
  
  return {
    result: 0,
    smartWarnings
  };
}
