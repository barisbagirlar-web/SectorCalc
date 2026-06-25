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
 * ID: PRO_149
 * Name: Üret vs. Satın Al (Make-or-Buy) Başabaş ve Fırsat Maliyeti
 */

export const InputSchema_PRO_149 = z.object({
  supplier_price: z.number(),
  supplier_order_cost: z.number(),
  inhouse_fixed_capex: z.number(),
  inhouse_var_cost: z.number(),
  annual_volume: z.number(),
  lost_margin_opportunity: z.number(),
});

export type Input_PRO_149 = z.infer<typeof InputSchema_PRO_149>;

export interface Output_PRO_149 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_PRO_149(input: Input_PRO_149): Output_PRO_149 {
  const validData = InputSchema_PRO_149.parse(input);
  const { supplier_price, supplier_order_cost, inhouse_fixed_capex, inhouse_var_cost, annual_volume, lost_margin_opportunity } = validData as any;
  
  const Total_Buy_Cost = (annual_volume * supplier_price) + supplier_order_cost;
  const Total_Make_Cost = inhouse_fixed_capex + (annual_volume * inhouse_var_cost) + lost_margin_opportunity;
  const Breakeven_Volume = (inhouse_fixed_capex + lost_margin_opportunity - supplier_order_cost) / (supplier_price - inhouse_var_cost);
  const Decision_Score = Total_Buy_Cost - Total_Make_Cost;
  const Strategic_Decision = ((Decision_Score > 0) ? ('İÇERİDE ÜRET (MAKE)') : ('DIŞARIDAN AL (BUY)'));
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (false) {
      smartWarnings.push({
        severity: "WARNING",
        source: "Kurumsal Finans (Fırsat Maliyeti)",
        message: "Kör Nokta Uyarısı: Karar 'İçeride Üret' çıkmış olsa da, bu işi yapmak için fabrikanızdaki diğer kârlı işleri bekletmenizden (Fırsat Maliyeti) doğan gizli bir zarar söz konusudur. Makine kapasiteniz tamamen doluysa dış kaynak kullanımında (Outsourcing) kalın."
      });
    }
  
  return {
    result: Strategic_Decision,
    smartWarnings
  };
}
