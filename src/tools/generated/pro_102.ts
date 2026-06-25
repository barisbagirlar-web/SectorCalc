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
 * ID: PRO_102
 * Name: Stokastik MOQ ve Raf Ömrü Denge Optimizasyonu
 */

export const InputSchema_PRO_102 = z.object({
  annual_demand: z.number(),
  order_cost: z.number(),
  holding_rate: z.number(),
  std_price: z.number(),
  moq_qty: z.number(),
  moq_price: z.number(),
  shelf_life_days: z.number(),
  daily_demand: z.number(),
});

export type Input_PRO_102 = z.infer<typeof InputSchema_PRO_102>;

export interface Output_PRO_102 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_PRO_102(input: Input_PRO_102): Output_PRO_102 {
  const validData = InputSchema_PRO_102.parse(input);
  const { annual_demand, order_cost, holding_rate, std_price, moq_qty, moq_price, shelf_life_days, daily_demand } = validData as any;
  
  const Holding_Cost_Std = std_price * (holding_rate / 100);
  const Holding_Cost_MOQ = moq_price * (holding_rate / 100);
  const EOQ = Math.sqrt((2 * annual_demand * order_cost) / Holding_Cost_Std);
  const Total_Cost_EOQ = (annual_demand * std_price) + (annual_demand / EOQ) * order_cost + (EOQ / 2) * Holding_Cost_Std;
  const Total_Cost_MOQ = (annual_demand * moq_price) + (annual_demand / moq_qty) * order_cost + (moq_qty / 2) * Holding_Cost_MOQ;
  const Optimal_Order_Qty = ((Total_Cost_MOQ < Total_Cost_EOQ && moq_qty > EOQ) ? (moq_qty) : (EOQ));
  const Cost_Savings = Math.max(0, Total_Cost_EOQ - Total_Cost_MOQ);
  const Days_To_Consume_Optimal = Optimal_Order_Qty / daily_demand;
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (Days_To_Consume_Optimal > shelf_life_days) {
      smartWarnings.push({
        severity: "CRITICAL",
        source: "APICS Envanter Yönetimi",
        message: "Kritik Fire Riski: Hesaplanan optimum sipariş miktarını (Özellikle MOQ) tüketmeniz raf ömründen daha uzun sürüyor. İskonto kazancı, son kullanma tarihi geçecek ürünlerin imha maliyetiyle sıfırlanacaktır. MOQ teklifini reddedin."
      });
    }
  
  return {
    result: Days_To_Consume_Optimal,
    smartWarnings
  };
}
