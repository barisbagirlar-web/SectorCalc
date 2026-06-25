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
 * ID: PRO_016
 * Name: VDI 2230 Cıvata Tork ve Akma (Yield) Hesaplayıcı
 */

export const InputSchema_PRO_016 = z.object({
  d_nom: z.number(),
  pitch: z.number(),
  mu_t: z.number(),
  mu_b: z.number(),
  d_w: z.number(),
  yield_strength: z.number(),
  target_preload: z.number(),
});

export type Input_PRO_016 = z.infer<typeof InputSchema_PRO_016>;

export interface Output_PRO_016 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_PRO_016(input: Input_PRO_016): Output_PRO_016 {
  const validData = InputSchema_PRO_016.parse(input);
  const { d_nom, pitch, mu_t, mu_b, d_w, yield_strength, target_preload } = validData as any;
  
  const d_2 = d_nom - (0.649519 * pitch);
  const d_3 = d_nom - (1.226869 * pitch);
  const A_t = (Math.PI / 4) * Math.pow((d_2 + d_3) / 2, 2);
  const F_M_max = (target_preload / 100) * yield_strength * A_t;
  const alpha_rad = (30 * Math.PI) / 180;
  const K_factor = 0.5 * ((pitch / (Math.PI * d_nom)) + (mu_t / COS(alpha_rad)) * (d_2 / d_nom) + (mu_b * (d_w / d_nom)));
  const Tightening_Torque = K_factor * d_nom * F_M_max / 1000;
  const sigma_tensile = F_M_max / A_t;
  const tau_torsion = (Tightening_Torque * 1000 * (d_2 / 2)) / (0.196 * Math.pow(d_3, 3));
  const sigma_vonMises = Math.sqrt(Math.pow(sigma_tensile, 2) + 3 * Math.pow(tau_torsion, 2));
  const Utilization = (sigma_vonMises / yield_strength) * 100;
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (Utilization > 100) {
      smartWarnings.push({
        severity: "CRITICAL",
        source: "VDI 2230 Plastik Deformasyon Sınırı",
        message: "Kritik Montaj Hatası: Çekme ve burulma gerilmelerinin birleşik etkisi (Von Mises), cıvatanın akma sınırını aşmaktadır. Cıvata sıkma anında uzayarak (boyun vererek) sıyıracak veya kopacaktır. Sürtünmeyi azaltın (Yağlayın) veya hedef ön yükü düşürün."
      });
    }
  
  return {
    result: Utilization,
    smartWarnings
  };
}
