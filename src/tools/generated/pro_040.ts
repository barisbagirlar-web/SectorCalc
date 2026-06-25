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
 * ID: PRO_040
 * Name: 3D Baskı Filament Geri Dönüşüm ROI ve Mukavemet Kaybı
 */

export const InputSchema_PRO_040 = z.object({
  virgin_price_kg: z.number(),
  scrap_volume_kg: z.number(),
  recycle_yield_pct: z.number(),
  recycle_capex: z.number(),
  process_cost_kg: z.number(),
  tensile_loss_pct: z.number(),
  quality_penalty_rate: z.number(),
  carbon_credit_kg: z.number(),
});

export type Input_PRO_040 = z.infer<typeof InputSchema_PRO_040>;

export interface Output_PRO_040 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_PRO_040(input: Input_PRO_040): Output_PRO_040 {
  const validData = InputSchema_PRO_040.parse(input);
  const { virgin_price_kg, scrap_volume_kg, recycle_yield_pct, recycle_capex, process_cost_kg, tensile_loss_pct, quality_penalty_rate, carbon_credit_kg } = validData as any;
  
  const Usable_Recycled_kg = scrap_volume_kg * (recycle_yield_pct / 100);
  const Cost_Avoidance = Usable_Recycled_kg * virgin_price_kg;
  const Processing_Opex = Usable_Recycled_kg * process_cost_kg;
  const Quality_Penalty_Cost = tensile_loss_pct * quality_penalty_rate * Usable_Recycled_kg;
  const Carbon_Credit_Revenue = Usable_Recycled_kg * carbon_credit_kg;
  const Net_Annual_Savings = Cost_Avoidance - Processing_Opex - Quality_Penalty_Cost + Carbon_Credit_Revenue;
  const ROI_Recycling = (Net_Annual_Savings / recycle_capex) * 100;
  const Payback_Months = (recycle_capex / Net_Annual_Savings) * 12;
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (tensile_loss_pct > 20) {
      smartWarnings.push({
        severity: "WARNING",
        source: "Polimer Degradasyonu",
        message: "Malzeme Mukavemet İhlali: Termal geçmiş nedeniyle polimerin çekme dayanımı (Tensile Strength) %20'den fazla düşmüştür. Bu geri dönüştürülmüş filamenti yük taşıyıcı veya mekanik (Structural) parçalarda kullanmak kırılma garantisidir; sadece prototipleme için ayırın."
      });
    }

    if (Net_Annual_Savings < 0) {
      smartWarnings.push({
        severity: "INFO",
        source: "Yeşil Aklama (Greenwashing) Riski",
        message: "Bilgi: Yüksek işleme ve kalite kaybı maliyetleri, hurdayı geri dönüştürmeyi saf malzeme almaktan daha pahalı hale getiriyor. Karbon kredisi teşviki yetersiz kalmış. Yatırım finansal değil, sadece pazarlama (PR) amaçlı kalacaktır."
      });
    }
  
  return {
    result: Payback_Months,
    smartWarnings
  };
}
