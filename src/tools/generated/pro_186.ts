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
 * ID: PRO_186
 * Name: Paris-Erdogan Yasası ile Yorulma Çatlağı İlerlemesi ve Ömür Analizi
 */

export const InputSchema_PRO_186 = z.object({
  initial_crack_a0: z.number(),
  critical_crack_ac: z.number(),
  delta_sigma_mpa: z.number(),
  geometry_factor_Y: z.number(),
  paris_constant_M: z.number(),
  paris_exponent_m: z.number(),
  fracture_toughness_k1c: z.number(),
});

export type Input_PRO_186 = z.infer<typeof InputSchema_PRO_186>;

export interface Output_PRO_186 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_PRO_186(input: Input_PRO_186): Output_PRO_186 {
  const validData = InputSchema_PRO_186.parse(input);
  const { initial_crack_a0, critical_crack_ac, delta_sigma_mpa, geometry_factor_Y, paris_constant_M, paris_exponent_m, fracture_toughness_k1c } = validData as any;
  
  const a0_m = initial_crack_a0 / 1000;
  const ac_m = critical_crack_ac / 1000;
  const Delta_K_Initial = geometry_factor_Y * delta_sigma_mpa * Math.sqrt(Math.PI * a0_m);
  const Cycles_To_Failure = (Math.pow(ac_m, 1 - (paris_exponent_m / 2)) - Math.pow(a0_m, 1 - (paris_exponent_m / 2))) / (paris_constant_M * Math.pow(geometry_factor_Y * delta_sigma_mpa * Math.sqrt(Math.PI), paris_exponent_m) * (1 - (paris_exponent_m / 2)));
  const Delta_K_Final = geometry_factor_Y * delta_sigma_mpa * Math.sqrt(Math.PI * ac_m);
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (Delta_K_Final >= fracture_toughness_k1c) {
      smartWarnings.push({
        severity: "CRITICAL",
        source: "ASTM E647 Yorulma Çatlağı Standartları",
        message: "Katastrofik Kırılma Tehlikesi: Çatlak ilerleme ucundaki gerilme yoğunluğu dalgası malzemenin K1c kırılma tokluğu sınırını aşmıştır. Yapı yorulma evresinden çıkıp aniden plastik kararsız yırtılma (Fast fracture) moduna geçerek çökecektir. Dinamik yükü düşürün."
      });
    }
  
  return {
    result: Delta_K_Final,
    smartWarnings
  };
}
