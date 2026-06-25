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
 * ID: PRO_067
 * Name: Kaynak Hacmi ve Dolgu Malzemesi İhtiyacı
 */

export const InputSchema_PRO_067 = z.object({
  weld_type: z.enum(["Köşe Kaynağı (Fillet)", "V-Oluk Alın Kaynağı"]),
  leg_size: z.number(),
  root_gap: z.number(),
  groove_angle: z.number(),
  weld_length: z.number(),
  reinforcement: z.number(),
  density: z.number(),
  dep_efficiency: z.number(),
});

export type Input_PRO_067 = z.infer<typeof InputSchema_PRO_067>;

export interface Output_PRO_067 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_PRO_067(input: Input_PRO_067): Output_PRO_067 {
  const validData = InputSchema_PRO_067.parse(input);
  const { weld_type, leg_size, root_gap, groove_angle, weld_length, reinforcement, density, dep_efficiency } = validData as any;
  
  const Rad_Angle = (groove_angle * Math.PI) / 180;
  const Area_Fillet = (Math.pow(leg_size, 2) / 2) + (leg_size * reinforcement);
  const Area_V_Groove = (root_gap * leg_size) + (Math.pow(leg_size, 2) * TAN(Rad_Angle / 2)) + (leg_size * reinforcement);
  const Cross_Section_Area = ((weld_type == 'Köşe Kaynağı (Fillet)') ? (Area_Fillet) : (Area_V_Groove));
  const Volume_cm3 = Cross_Section_Area * (weld_length * 1000) / 100;
  const Weight_Deposited_kg = (Volume_cm3 * density) / 1000000;
  const Required_Filler_kg = Weight_Deposited_kg / (dep_efficiency / 100);
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (dep_efficiency < 60) {
      smartWarnings.push({
        severity: "WARNING",
        source: "Kaynak Ekonomisi",
        message: "Uyarı: Yığma veriminiz %60'ın altındadır. Satın aldığınız telin/elektrodun %40'ı cüruf, sıçrantı (Spatter) ve duman olarak israf olmaktadır. Prosesi SMAW'dan (Örtülü Elektrot) GMAW veya FCAW'a çevirmeyi değerlendirin."
      });
    }
  
  return {
    result: Required_Filler_kg,
    smartWarnings
  };
}
