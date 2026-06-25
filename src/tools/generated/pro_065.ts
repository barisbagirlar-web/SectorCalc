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
 * ID: PRO_065
 * Name: Kaizen Finansal Etki ve Sürdürülebilirlik (ROI)
 */

export const InputSchema_PRO_065 = z.object({
  baseline_cost: z.number(),
  actual_cost: z.number(),
  time_saved_min: z.number(),
  labor_rate: z.number(),
  conversion_factor: z.number(),
  annual_volume: z.number(),
  implementation_cost: z.number(),
  month_1_savings: z.number(),
  month_6_savings: z.number(),
});

export type Input_PRO_065 = z.infer<typeof InputSchema_PRO_065>;

export interface Output_PRO_065 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_PRO_065(input: Input_PRO_065): Output_PRO_065 {
  const validData = InputSchema_PRO_065.parse(input);
  const { baseline_cost, actual_cost, time_saved_min, labor_rate, conversion_factor, annual_volume, implementation_cost, month_1_savings, month_6_savings } = validData as any;
  
  const Hard_Savings = baseline_cost - actual_cost;
  const Soft_Savings = (time_saved_min / 60) * labor_rate * annual_volume * (conversion_factor / 100);
  const Total_Annual_Savings = Hard_Savings + Soft_Savings;
  const Kaizen_ROI_Pct = ((Total_Annual_Savings - implementation_cost) / implementation_cost) * 100;
  const Payback_Months = implementation_cost / (Total_Annual_Savings / 12);
  const Sustainability_Index = (month_6_savings / month_1_savings) * 100;
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (Sustainability_Index < 70) {
      smartWarnings.push({
        severity: "WARNING",
        source: "Kaizen Enstitüsü",
        message: "Sürdürülebilirlik Riski: 6. aydaki tasarruf, ilk aya kıyasla %30'dan fazla düşmüştür. Uygulanan standartlaştırma (Seiketsu) başarısız olmuş ve çalışanlar eski alışkanlıklarına geri dönmüştür. Standart İş Formlarını (SWI) denetleyin."
      });
    }
  
  return {
    result: Sustainability_Index,
    smartWarnings
  };
}
