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
 * ID: PRO_011
 * Name: Çoklu Ürün Başabaş (Break-Even) ve DOL Analizi
 */

export const InputSchema_PRO_011 = z.object({
  fixed_costs: z.number(),
  target_profit: z.number(),
  tax_rate: z.number(),
  product_prices: z.number(),
  product_vcosts: z.number(),
  product_mix: z.number(),
  actual_volume: z.number(),
});

export type Input_PRO_011 = z.infer<typeof InputSchema_PRO_011>;

export interface Output_PRO_011 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_PRO_011(input: Input_PRO_011): Output_PRO_011 {
  const validData = InputSchema_PRO_011.parse(input);
  const { fixed_costs, target_profit, tax_rate, product_prices, product_vcosts, product_mix, actual_volume } = validData as any;
  
  const UnitCM_Array = product_prices - product_vcosts;
  const WACM = SUM(UnitCM_Array * product_mix);
  const BEP_Units = fixed_costs / WACM;
  const BEP_Revenue = SUM(BEP_Units * product_mix * product_prices);
  const Target_Units = (fixed_costs + (target_profit / (1 - (tax_rate/100)))) / WACM;
  const MarginOfSafety = Math.max(0, ((actual_volume - BEP_Units) / actual_volume) * 100);
  const OperatingIncome = (actual_volume * WACM) - fixed_costs;
  const DOL = ((OperatingIncome > 0) ? ((actual_volume * WACM) / OperatingIncome) : (null));
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (DOL > 4) {
      smartWarnings.push({
        severity: "WARNING",
        source: "Finansal Kaldıraç Riski",
        message: "Faaliyet Kaldıracı (DOL) 4'ün üzerindedir. Sabit maliyet yükünüz çok yüksek; satışlardaki %10'luk bir düşüş, kârınızı %40'tan fazla eritecektir."
      });
    }
  
  return {
    result: DOL,
    smartWarnings
  };
}
