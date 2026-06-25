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
 * ID: PRO_080
 * Name: Mahsul Verim Kaybı (Yield Gap) ve Müdahale ROI Analizi
 */

export const InputSchema_PRO_080 = z.object({
  genetic_potential: z.number(),
  env_factor: z.number(),
  actual_harvest: z.number(),
  field_area: z.number(),
  loss_pest: z.number(),
  loss_disease: z.number(),
  loss_weed: z.number(),
  crop_price: z.number(),
  intervention_cost: z.number(),
  recovery_pct: z.number(),
});

export type Input_PRO_080 = z.infer<typeof InputSchema_PRO_080>;

export interface Output_PRO_080 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_PRO_080(input: Input_PRO_080): Output_PRO_080 {
  const validData = InputSchema_PRO_080.parse(input);
  const { genetic_potential, env_factor, actual_harvest, field_area, loss_pest, loss_disease, loss_weed, crop_price, intervention_cost, recovery_pct } = validData as any;
  
  const Attainable_Yield_kg_da = genetic_potential * env_factor;
  const Actual_Yield_kg_da = actual_harvest / field_area;
  const Yield_Gap_kg_da = Math.max(0, Attainable_Yield_kg_da - Actual_Yield_kg_da);
  const Total_Financial_Loss = Yield_Gap_kg_da * field_area * crop_price;
  const Loss_Attributed_Pest = (loss_pest / 100) * Attainable_Yield_kg_da * field_area * crop_price;
  const Loss_Attributed_Disease = (loss_disease / 100) * Attainable_Yield_kg_da * field_area * crop_price;
  const Loss_Attributed_Weed = (loss_weed / 100) * Attainable_Yield_kg_da * field_area * crop_price;
  const Recoverable_Value = Total_Financial_Loss * (recovery_pct / 100);
  const Intervention_ROI = ((Recoverable_Value - intervention_cost) / intervention_cost) * 100;
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (Intervention_ROI < 0) {
      smartWarnings.push({
        severity: "INFO",
        source: "Zirai Ekonomi",
        message: "Ekonomik Uyumsuzluk: Zirai müdahalenin (Örn: İlaçlama) maliyeti, kurtaracağı mahsulün piyasa değerinden daha yüksektir. Salgın yayılma riski taşımıyorsa, mahsulü fireye ayırmak finansal olarak daha mantıklıdır."
      });
    }
  
  return {
    result: Intervention_ROI,
    smartWarnings
  };
}
