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
 * ID: PRO_094
 * Name: Buhar Kapanı (Steam Trap) Termodinamik Kayıp Analizi
 */

export const InputSchema_PRO_094 = z.object({
  orifice_d: z.number(),
  line_p: z.number(),
  back_p: z.number(),
  cd: z.number(),
  steam_enthalpy: z.number(),
  op_hours: z.number(),
  steam_cost: z.number(),
});

export type Input_PRO_094 = z.infer<typeof InputSchema_PRO_094>;

export interface Output_PRO_094 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_PRO_094(input: Input_PRO_094): Output_PRO_094 {
  const validData = InputSchema_PRO_094.parse(input);
  const { orifice_d, line_p, back_p, cd, steam_enthalpy, op_hours, steam_cost } = validData as any;
  
  const Orifice_Area_m2 = (Math.PI / 4) * Math.pow(orifice_d / 1000, 2);
  const Pressure_Ratio = back_p / line_p;
  const Napier_Choked_Flow_kg_s = cd * Orifice_Area_m2 * (line_p * 100000) * 0.000192;
  const Subsonic_Correction = Math.sqrt(1 - Math.pow((Pressure_Ratio - 0.542) / (1 - 0.542), 2));
  const Actual_Leak_Flow_kg_s = ((Pressure_Ratio <= 0.542) ? (Napier_Choked_Flow_kg_s) : (Napier_Choked_Flow_kg_s * Subsonic_Correction));
  const Annual_Steam_Loss_Ton = (Actual_Leak_Flow_kg_s * 3600 * op_hours) / 1000;
  const Annual_Financial_Loss = Annual_Steam_Loss_Ton * steam_cost;
  const Energy_Waste_GJ = Annual_Steam_Loss_Ton * steam_enthalpy / 1000;
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (Pressure_Ratio <= 0.542) {
      smartWarnings.push({
        severity: "CRITICAL",
        source: "ISO 3977 Termodinamik Sızıntı",
        message: "Sonik Boğulma (Choked Flow): Buhar çıkış hızı ses hızına (Mach 1) ulaşmıştır. Bu noktada sızıntı debisi maksimum seviyededir; arızalı (Açık kalmış) bir buhar kapanı devasa miktarda gizli ısı (Latent Heat) israfına neden olmaktadır."
      });
    }
  
  return {
    result: Energy_Waste_GJ,
    smartWarnings
  };
}
