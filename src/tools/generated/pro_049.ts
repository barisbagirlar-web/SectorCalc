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
 * ID: PRO_049
 * Name: Duman Tahliye Kapağı (SHEV) Boyutlandırma (EN 12101-5)
 */

export const InputSchema_PRO_049 = z.object({
  roof_area: z.number(),
  ceiling_height: z.number(),
  smoke_depth: z.number(),
  fire_area: z.number(),
  inlet_area: z.number(),
  cv_factor: z.number(),
  t_ambient: z.number(),
});

export type Input_PRO_049 = z.infer<typeof InputSchema_PRO_049>;

export interface Output_PRO_049 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_PRO_049(input: Input_PRO_049): Output_PRO_049 {
  const validData = InputSchema_PRO_049.parse(input);
  const { roof_area, ceiling_height, smoke_depth, fire_area, inlet_area, cv_factor, t_ambient } = validData as any;
  
  const P_fire_perimeter = 4 * Math.sqrt(fire_area);
  const Q_mass = 0.188 * P_fire_perimeter * Math.pow(ceiling_height - smoke_depth, 1.5);
  const Q_heat_release = 250 * fire_area;
  const T_smoke = t_ambient + (Q_heat_release / (Q_mass * 1.005));
  const Av_Required = Q_mass / (cv_factor * Math.sqrt(2 * 9.81 * smoke_depth * (T_smoke - t_ambient) / t_ambient));
  const Aa_Effective = Av_Required;
  const Roof_Ratio_Pct = (Aa_Effective / roof_area) * 100;
  const Min_Hatch_Count = CEILING(Aa_Effective / 2.25);
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (inlet_area < (2 * Aa_Effective)) {
      smartWarnings.push({
        severity: "CRITICAL",
        source: "EN 12101-5 Duman Tahliye Standardı",
        message: "Kritik Boğulma (Choking) Riski: Taze hava giriş alanı, etkin duman egzoz alanının (Aa) en az iki katı olmalıdır. Eksik hava girişi sistemde negatif basınç yaratıp dumanın tahliyesini KESİNLİKLE durduracaktır."
      });
    }
  
  return {
    result: Min_Hatch_Count,
    smartWarnings
  };
}
