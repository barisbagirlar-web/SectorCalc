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
 * ID: PRO_111
 * Name: Rulman Ömrü (L10h) ve Geliştirilmiş Modifiye Ömür (ISO 281)
 */

export const InputSchema_PRO_111 = z.object({
  dynamic_load_C: z.number(),
  equiv_load_P: z.number(),
  rpm: z.number(),
  bearing_type: z.number(),
  reliability_a1: z.number(),
  viscosity_ratio_kappa: z.number(),
  contamination_ec: z.number(),
  fatigue_limit_Pu: z.number(),
});

export type Input_PRO_111 = z.infer<typeof InputSchema_PRO_111>;

export interface Output_PRO_111 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_PRO_111(input: Input_PRO_111): Output_PRO_111 {
  const validData = InputSchema_PRO_111.parse(input);
  const { dynamic_load_C, equiv_load_P, rpm, bearing_type, reliability_a1, viscosity_ratio_kappa, contamination_ec, fatigue_limit_Pu } = validData as any;
  
  const L10_Revs = Math.pow(dynamic_load_C / equiv_load_P, bearing_type);
  const L10h_Hours = (L10_Revs * 1000000) / (60 * rpm);
  const a_iso_factor = 0.1 * Math.pow(1 - (fatigue_limit_Pu * contamination_ec / equiv_load_P), 1.5) * Math.sqrt(viscosity_ratio_kappa);
  const Lnm_Modified_Hours = reliability_a1 * a_iso_factor * L10h_Hours;
  const Life_Reduction_Pct = (1 - (Lnm_Modified_Hours / L10h_Hours)) * 100;
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (viscosity_ratio_kappa < 1.0) {
      smartWarnings.push({
        severity: "CRITICAL",
        source: "SKF Yağlama Standartları",
        message: "Kritik Aşınma Riski: Viskozite oranı (κ) 1.0'in altındadır. Yuvarlanma elemanları arasında hidrodinamik yağ filmi oluşamamakta, sınır yağlama (metal-metale temas) nedeniyle modifiye ömür (Lnm) dramatik şekilde düşmektedir. Daha kalın bir yağ seçin."
      });
    }
  
  return {
    result: Life_Reduction_Pct,
    smartWarnings
  };
}
