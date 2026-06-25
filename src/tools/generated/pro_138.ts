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
 * ID: PRO_138
 * Name: Tarımsal Gübre Dozaj, Leaching (Sızma) ve ROI Optimizasyonu
 */

export const InputSchema_PRO_138 = z.object({
  target_yield_kg_da: z.number(),
  plant_req_nutrient: z.number(),
  soil_supply: z.number(),
  fertilizer_efficiency: z.number(),
  fertilizer_content_pct: z.number(),
  field_area: z.number(),
  fertilizer_price: z.number(),
  crop_price: z.number(),
  leaching_coeff: z.number(),
});

export type Input_PRO_138 = z.infer<typeof InputSchema_PRO_138>;

export interface Output_PRO_138 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_PRO_138(input: Input_PRO_138): Output_PRO_138 {
  const validData = InputSchema_PRO_138.parse(input);
  const { target_yield_kg_da, plant_req_nutrient, soil_supply, fertilizer_efficiency, fertilizer_content_pct, field_area, fertilizer_price, crop_price, leaching_coeff } = validData as any;
  
  const Nutrient_Required_Total_kg_da = (target_yield_kg_da / 1000) * plant_req_nutrient;
  const Nutrient_Deficit_kg_da = Math.max(0, Nutrient_Required_Total_kg_da - soil_supply);
  const Pure_Nutrient_To_Apply_kg_da = Nutrient_Deficit_kg_da / (fertilizer_efficiency / 100);
  const Commercial_Fertilizer_Rate_kg_da = Pure_Nutrient_To_Apply_kg_da / (fertilizer_content_pct / 100);
  const Total_Fertilizer_Needed_kg = Commercial_Fertilizer_Rate_kg_da * field_area;
  const Total_Application_Cost = Total_Fertilizer_Needed_kg * fertilizer_price;
  const Environmental_Leach_Loss_kg = Pure_Nutrient_To_Apply_kg_da * leaching_coeff * field_area;
  const Expected_Revenue = target_yield_kg_da * field_area * crop_price;
  const Base_Revenue_No_Fertilizer = (soil_supply / plant_req_nutrient) * 1000 * field_area * crop_price;
  const Value_Added_By_Fertilizer = Expected_Revenue - Base_Revenue_No_Fertilizer;
  const Fertilizer_ROI_Pct = ((Value_Added_By_Fertilizer - Total_Application_Cost) / Total_Application_Cost) * 100;
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (Environmental_Leach_Loss_kg > (Total_Fertilizer_Needed_kg * 0.30)) {
      smartWarnings.push({
        severity: "WARNING",
        source: "Zirai Çevre Yönetimi",
        message: "Çevresel Kirlilik (Leaching): Uygulanan gübrenin %30'undan fazlası kök bölgesinden yıkanarak yeraltı sularına sızmaktadır (Nitrat kirliliği). Bu durum gübre israfıdır; tek seferde vermek yerine dozu bölerek uygulayın (Fertigasyon)."
      });
    }
  
  return {
    result: Fertilizer_ROI_Pct,
    smartWarnings
  };
}
