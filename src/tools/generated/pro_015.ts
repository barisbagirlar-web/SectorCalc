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
 * ID: PRO_015
 * Name: Talaşlama Titreşim (Chatter) ve Yüzey Pürüzlülüğü
 */

export const InputSchema_PRO_015 = z.object({
  vc: z.number(),
  d_tool: z.number(),
  fz: z.number(),
  z: z.number(),
  r_epsilon: z.number(),
  ap: z.number(),
  chatter_factor: z.number(),
  ra_limit: z.number(),
});

export type Input_PRO_015 = z.infer<typeof InputSchema_PRO_015>;

export interface Output_PRO_015 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_PRO_015(input: Input_PRO_015): Output_PRO_015 {
  const validData = InputSchema_PRO_015.parse(input);
  const { vc, d_tool, fz, z, r_epsilon, ap, chatter_factor, ra_limit } = validData as any;
  
  const RPM = (vc * 1000) / (Math.PI * d_tool);
  const FeedRate = fz * z * RPM;
  const Rz_theo = (Math.pow(fz, 2) / (8 * r_epsilon)) * 1000;
  const Rz_actual = Rz_theo * chatter_factor;
  const Ra_approx = Rz_actual / 4;
  const L_D_Ratio = ap / d_tool;
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (Ra_approx > ra_limit) {
      smartWarnings.push({
        severity: "CRITICAL",
        source: "Yüzey Bütünlüğü Kontrolü",
        message: "Kritik Kalite İhlali: Tahmini yüzey pürüzlülüğü (Ra), teknik resim sınırını aşmaktadır. İlerlemeyi (fz) düşürün veya daha büyük burun radyüslü (Re) bir kesici uç (Wiper) kullanın."
      });
    }

    if (L_D_Ratio > 4 && chatter_factor < 1.5) {
      smartWarnings.push({
        severity: "INFO",
        source: "Takım Esnemesi",
        message: "Bilgi: Takımın L/D oranı 4'ün üzerinde (Uzun takım). Girilen titreşim çarpanı (Chatter) iyimser kalabilir, uzun takımlarda harmonik tırlama Rz değerini logaritmik olarak artırır."
      });
    }
  
  return {
    result: L_D_Ratio,
    smartWarnings
  };
}
