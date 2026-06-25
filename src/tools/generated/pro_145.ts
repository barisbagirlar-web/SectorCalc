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
 * ID: PRO_145
 * Name: SMED Darboğaz Kapasite Açığa Çıkarma (Capacity Release) ROI
 */

export const InputSchema_PRO_145 = z.object({
  current_setup_min: z.number(),
  target_setup_min: z.number(),
  setups_per_week: z.number(),
  cycle_time_sec: z.number(),
  unit_margin: z.number(),
  is_bottleneck: z.enum(["Evet (Bottleneck)", "Hayır (Non-Bottleneck)"]),
  smed_capex: z.number(),
});

export type Input_PRO_145 = z.infer<typeof InputSchema_PRO_145>;

export interface Output_PRO_145 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_PRO_145(input: Input_PRO_145): Output_PRO_145 {
  const validData = InputSchema_PRO_145.parse(input);
  const { current_setup_min, target_setup_min, setups_per_week, cycle_time_sec, unit_margin, is_bottleneck, smed_capex } = validData as any;
  
  const Saved_Mins_Per_Setup = current_setup_min - target_setup_min;
  const Saved_Hours_Annual = (Saved_Mins_Per_Setup * setups_per_week * 52) / 60;
  const Extra_Capacity_Units_Annual = Saved_Hours_Annual * (3600 / cycle_time_sec);
  const Financial_Gain_Annual = ((is_bottleneck == 'Evet (Bottleneck)') ? (Extra_Capacity_Units_Annual * unit_margin) : (0));
  const Cost_Avoidance_Annual = ((is_bottleneck == 'Hayır (Non-Bottleneck)') ? (Saved_Hours_Annual * 50) : (0));
  const Total_Value_Created = Financial_Gain_Annual + Cost_Avoidance_Annual;
  const SMED_ROI = ((Total_Value_Created - smed_capex) / smed_capex) * 100;
  const Payback_Months = (smed_capex / Total_Value_Created) * 12;
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (false) {
      smartWarnings.push({
        severity: "WARNING",
        source: "Goldratt Kısıtlar Teorisi",
        message: "Yatırım İsrafı Yanılgısı: Bu makine fabrikanın darboğazı olmadığı için, SMED yaparak kazandığınız zaman size 'Daha Fazla Ürün Satışı (Throughput)' olarak DEĞİL, sadece operatörün boş bekleme süresi olarak geri dönecektir. Finansal kazanım sıfıra yakındır. QDC yatırım bütçesini gerçek darboğaza kaydırın."
      });
    }
  
  return {
    result: Payback_Months,
    smartWarnings
  };
}
