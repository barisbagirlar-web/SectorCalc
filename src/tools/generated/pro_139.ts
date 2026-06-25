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
 * ID: PRO_139
 * Name: Gıda Fire ve Reçete Marj Kaçağı (Yield & Shrinkage)
 */

export const InputSchema_PRO_139 = z.object({
  raw_input_kg: z.number(),
  finished_output_kg: z.number(),
  spoiled_waste_kg: z.number(),
  raw_cost_per_kg: z.number(),
  processing_cost_kg: z.number(),
  theoretical_recipe_yield: z.number(),
  salvage_value_kg: z.number(),
});

export type Input_PRO_139 = z.infer<typeof InputSchema_PRO_139>;

export interface Output_PRO_139 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_PRO_139(input: Input_PRO_139): Output_PRO_139 {
  const validData = InputSchema_PRO_139.parse(input);
  const { raw_input_kg, finished_output_kg, spoiled_waste_kg, raw_cost_per_kg, processing_cost_kg, theoretical_recipe_yield, salvage_value_kg } = validData as any;
  
  const Actual_Yield_Pct = (finished_output_kg / raw_input_kg) * 100;
  const Shrinkage_kg = raw_input_kg - finished_output_kg;
  const Cost_Of_Shrinkage = Shrinkage_kg * raw_cost_per_kg;
  const Cost_Of_Spoilage_Added_Value = spoiled_waste_kg * processing_cost_kg;
  const Salvage_Recovery = (Shrinkage_kg + spoiled_waste_kg) * salvage_value_kg;
  const Yield_Variance_Pct = theoretical_recipe_yield - Actual_Yield_Pct;
  const Margin_Leak_Due_To_Variance = (Yield_Variance_Pct / 100) * raw_input_kg * (raw_cost_per_kg + processing_cost_kg);
  const Total_Cost_Of_Quality_Loss = Cost_Of_Shrinkage + Cost_Of_Spoilage_Added_Value - Salvage_Recovery;
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (Yield_Variance_Pct > 5.0) {
      smartWarnings.push({
        severity: "CRITICAL",
        source: "Endüstriyel Gıda Maliyet Kontrolü",
        message: "Reçete Fire Sızıntısı: Gerçekleşen randıman (Yield), teorik reçetenin %5 oranından daha fazla altındadır. Ya temizleme aşamasında aşırı et/sebze çöpe gidiyor ya da pişirme (Moisture Loss) kaybı kontrolden çıkmış durumda. Kâr marjınız doğrudan eriyor."
      });
    }
  
  return {
    result: Total_Cost_Of_Quality_Loss,
    smartWarnings
  };
}
