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
 * ID: PRO_181
 * Name: Kienzle Denklemi ile CNC Kesme Kuvveti ve Güç Optimizasyonu
 */

export const InputSchema_PRO_181 = z.object({
  feed_f: z.number(),
  depth_ap: z.number(),
  kc11_force: z.number(),
  mc_exponent: z.number(),
  cutting_speed_vc: z.number(),
  efficiency_eta: z.number(),
  spindle_power_limit: z.number(),
});

export type Input_PRO_181 = z.infer<typeof InputSchema_PRO_181>;

export interface Output_PRO_181 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_PRO_181(input: Input_PRO_181): Output_PRO_181 {
  const validData = InputSchema_PRO_181.parse(input);
  const { feed_f, depth_ap, kc11_force, mc_exponent, cutting_speed_vc, efficiency_eta, spindle_power_limit } = validData as any;
  
  const Chip_Thickness_h = feed_f;
  const Kc_Actual = kc11_force / Math.pow(Chip_Thickness_h, mc_exponent);
  const Tangential_Force_Fc = Kc_Actual * depth_ap * feed_f;
  const Net_Cutting_Power_Pc = (Tangential_Force_Fc * cutting_speed_vc) / 60000;
  const Gross_Power_Required = Net_Cutting_Power_Pc / (efficiency_eta / 100);
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (Gross_Power_Required > spindle_power_limit) {
      smartWarnings.push({
        severity: "CRITICAL",
        source: "Sandvik Coromant İşleme Ekonomisi",
        message: "Kritik Güç Aşımı: Kienzle formülüne göre gereken brüt motor gücü tezgâh limitini aşmaktadır. Spindle kesim esnasında bayılacak (Stall) ve kesici uç parçaya saplanarak anında kırılacaktır. ap veya Vc değerini düşürün."
      });
    }
  
  return {
    result: Gross_Power_Required,
    smartWarnings
  };
}
