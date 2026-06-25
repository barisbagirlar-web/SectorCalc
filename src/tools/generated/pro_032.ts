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
 * ID: PRO_032
 * Name: Tekstil/Kimya Boya Reçete ve RFT (İlk Seferde Doğru) Maliyeti
 */

export const InputSchema_PRO_032 = z.object({
  fabric_weight_kg: z.number(),
  liquor_ratio: z.number(),
  dye_chem_cost_kg: z.number(),
  water_tariff_m3: z.number(),
  energy_cost_batch: z.number(),
  rft_pct: z.number(),
  rework_penalty_multiplier: z.number(),
});

export type Input_PRO_032 = z.infer<typeof InputSchema_PRO_032>;

export interface Output_PRO_032 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_PRO_032(input: Input_PRO_032): Output_PRO_032 {
  const validData = InputSchema_PRO_032.parse(input);
  const { fabric_weight_kg, liquor_ratio, dye_chem_cost_kg, water_tariff_m3, energy_cost_batch, rft_pct, rework_penalty_multiplier } = validData as any;
  
  const Bath_Volume_Liters = fabric_weight_kg * liquor_ratio;
  const Water_Cost = (Bath_Volume_Liters / 1000) * water_tariff_m3;
  const Chem_Cost = fabric_weight_kg * dye_chem_cost_kg;
  const Base_Batch_Cost = Chem_Cost + Water_Cost + energy_cost_batch;
  const Rework_Prob = 1 - (rft_pct / 100);
  const Expected_Rework_Cost = Base_Batch_Cost * rework_penalty_multiplier * Rework_Prob;
  const Total_Effective_Cost = Base_Batch_Cost + Expected_Rework_Cost;
  const Cost_Per_Kg = Total_Effective_Cost / fabric_weight_kg;
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (rft_pct < 85) {
      smartWarnings.push({
        severity: "CRITICAL",
        source: "Kimyasal Proses Kalitesi",
        message: "Kritik Kalite Kaybı: İlk Seferde Doğru (RFT) oranınız %85'in altında. Hatalı şarjları söküp yeniden boyamak (Stripping & Redyeing) kapasiteyi yarıya düşürürken kimyasal/su maliyetini katlar. Kâr marjınız tamamen tükeniyor."
      });
    }
  
  return {
    result: Cost_Per_Kg,
    smartWarnings
  };
}
