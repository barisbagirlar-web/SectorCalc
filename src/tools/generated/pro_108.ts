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
 * ID: PRO_108
 * Name: Sarf/Ofis Malzemesi EOQ ve Toplu İskonto Optimizasyonu
 */

export const InputSchema_PRO_108 = z.object({
  monthly_qty: z.number(),
  unit_price: z.number(),
  bulk_discount_pct: z.number(),
  bulk_min_qty: z.number(),
  order_cost: z.number(),
  holding_rate: z.number(),
});

export type Input_PRO_108 = z.infer<typeof InputSchema_PRO_108>;

export interface Output_PRO_108 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_PRO_108(input: Input_PRO_108): Output_PRO_108 {
  const validData = InputSchema_PRO_108.parse(input);
  const { monthly_qty, unit_price, bulk_discount_pct, bulk_min_qty, order_cost, holding_rate } = validData as any;
  
  const Annual_Demand = monthly_qty * 12;
  const Holding_Cost_Std = unit_price * (holding_rate / 100);
  const Discounted_Price = unit_price * (1 - (bulk_discount_pct / 100));
  const Holding_Cost_Bulk = Discounted_Price * (holding_rate / 100);
  const EOQ_Standard = Math.sqrt((2 * Annual_Demand * order_cost) / Holding_Cost_Std);
  const Total_Cost_EOQ = (Annual_Demand * unit_price) + (Annual_Demand / EOQ_Standard) * order_cost + (EOQ_Standard / 2) * Holding_Cost_Std;
  const Total_Cost_Bulk = (Annual_Demand * Discounted_Price) + (Annual_Demand / bulk_min_qty) * order_cost + (bulk_min_qty / 2) * Holding_Cost_Bulk;
  const Optimized_Decision_Cost = Math.min(Total_Cost_EOQ, Total_Cost_Bulk);
  const Savings_From_Optimization = Total_Cost_EOQ - Optimized_Decision_Cost;
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (false) {
      smartWarnings.push({
        severity: "WARNING",
        source: "Satınalma Optimizasyonu",
        message: "Gizli Envanter Maliyeti: İskonto almak için önerilen yüksek alım miktarı (Bulk), deponuzda yaratacağı taşıma maliyetiyle iskontonun kendisinden daha pahalıya gelmektedir. Miktarı artırmadan standart EOQ ile sipariş verin."
      });
    }
  
  return {
    result: Savings_From_Optimization,
    smartWarnings
  };
}
