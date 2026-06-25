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
 * ID: PRO_192
 * Name: Grossmann İdeal Kritik Çap (Di) ve Isıl İşlem Sertleşme Derinliği
 */

export const InputSchema_PRO_192 = z.object({
  carbon_pct: z.number(),
  grain_size_astm: z.number(),
  manganese_pct: z.number(),
  chromium_pct: z.number(),
  molybdenum_pct: z.number(),
  nickel_pct: z.number(),
  quench_intensity_H: z.number(),
});

export type Input_PRO_192 = z.infer<typeof InputSchema_PRO_192>;

export interface Output_PRO_192 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_PRO_192(input: Input_PRO_192): Output_PRO_192 {
  const validData = InputSchema_PRO_192.parse(input);
  const { carbon_pct, grain_size_astm, manganese_pct, chromium_pct, molybdenum_pct, nickel_pct, quench_intensity_H } = validData as any;
  
  const Di_Base_Inches = Math.sqrt(carbon_pct) * (0.07 * grain_size_astm + 0.40);
  const Multiplier_Mn = 1 + 3.333 * manganese_pct;
  const Multiplier_Cr = 1 + 2.16 * chromium_pct;
  const Multiplier_Mo = 1 + 3.0 * molybdenum_pct;
  const Multiplier_Ni = 1 + 0.363 * nickel_pct;
  const Di_Ideal_Inches = Di_Base_Inches * Multiplier_Mn * Multiplier_Cr * Multiplier_Mo * Multiplier_Ni;
  const Di_Ideal_mm = Di_Ideal_Inches * 25.4;
  const Critical_Diameter_Dc_mm = Di_Ideal_mm * (Math.pow(quench_intensity_H, 0.4) / (1 + Math.pow(quench_intensity_H, 0.4)));
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (false) {
      smartWarnings.push({
        severity: "CRITICAL",
        source: "ASTM E112 / ISO 642",
        message: "Kritik Çatlama İhbarı: Yüksek alaşımlı çelikte sert tuz veya agresif sulu çözeltide (H >= 1.5) ani soğutma yapılmaktadır. Termal gerilmeler ve martenzitik hacimsel genleşme nedeniyle parçada derin su verme çatlakları (Quench cracking) ve yüksek kalıntı östenit fazı oluşacaktır. Soğutma ortamını sakinleştirin veya yağa geçin."
      });
    }
  
  return {
    result: Critical_Diameter_Dc_mm,
    smartWarnings
  };
}
