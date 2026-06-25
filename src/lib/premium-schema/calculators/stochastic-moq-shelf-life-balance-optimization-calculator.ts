import { StokastikMoqVeRafOmruDengeOptimizasyonuCalculator100InputSchema, type StokastikMoqVeRafOmruDengeOptimizasyonuCalculator100Input } from "./stokastik-moq-ve-raf-omru-denge-optimizasyonu-calculator-100-validation";

export const calculateStokastikMoqVeRafOmruDengeOptimizasyonuCalculator100Contract: any = {
  id: "stokastik-moq-ve-raf-omru-denge-optimizasyonu-calculator-100",
  version: "1.0.0",
  category: "cost",
  inputSchema: StokastikMoqVeRafOmruDengeOptimizasyonuCalculator100InputSchema,
  
  execute: async (input: any) => {
    try {
      const {
        annualDemand,
        orderCost,
        holdingRate,
        stdPrice,
        moqQty,
        moqPrice,
        shelfLifeDays,
        dailyDemand
      } = input;

      // Validate inputs
      if (!annualDemand || !orderCost || !holdingRate || !stdPrice || !moqQty || !moqPrice || !shelfLifeDays || !dailyDemand) {
        throw new Error("Missing required input fields");
      }

      if (annualDemand <= 0 || orderCost <= 0 || holdingRate <= 0 || stdPrice <= 0 || moqQty <= 0 || moqPrice <= 0 || shelfLifeDays <= 0 || dailyDemand <= 0) {
        throw new Error("All input values must be greater than zero");
      }

      // Formula: Holding_Cost_Std = std_price * (holding_rate / 100)
      const holdingCostStd = stdPrice * (holdingRate / 100);

      // Formula: Holding_Cost_MOQ = moq_price * (holding_rate / 100)
      const holdingCostMOQ = moqPrice * (holdingRate / 100);

      // Formula: EOQ = SQRT((2 * annual_demand * order_cost) / Holding_Cost_Std)
      const eOQ = Math.sqrt((2 * annualDemand * orderCost) / holdingCostStd);

      // Formula: Total_Cost_EOQ = (annual_demand * std_price) + (annual_demand / EOQ) * order_cost + (EOQ / 2) * Holding_Cost_Std
      const totalCostEOQ = (annualDemand * stdPrice) + 
                          (annualDemand / eOQ) * orderCost + 
                          (eOQ / 2) * holdingCostStd;

      // Formula: Total_Cost_MOQ = (annual_demand * moq_price) + (annual_demand / moq_qty) * order_cost + (moq_qty / 2) * Holding_Cost_MOQ
      const totalCostMOQ = (annualDemand * moqPrice) + 
                          (annualDemand / moqQty) * orderCost + 
                          (moqQty / 2) * holdingCostMOQ;

      // Formula: Optimal_Order_Qty = IF(Total_Cost_MOQ < Total_Cost_EOQ AND moq_qty > EOQ, moq_qty, EOQ)
      const optimalOrderQty = (totalCostMOQ < totalCostEOQ && moqQty > eOQ) ? moqQty : eOQ;

      // Formula: Cost_Savings = MAX(0, Total_Cost_EOQ - Total_Cost_MOQ)
      const costSavings = Math.max(0, totalCostEOQ - totalCostMOQ);

      // Formula: Days_To_Consume_Optimal = Optimal_Order_Qty / daily_demand
      const daysToConsumeOptimal = optimalOrderQty / dailyDemand;

      return {
        holdingCostStd: Math.round(holdingCostStd * 100) / 100,
        holdingCostMOQ: Math.round(holdingCostMOQ * 100) / 100,
        eOQ: Math.round(eOQ * 100) / 100,
        totalCostEOQ: Math.round(totalCostEOQ * 100) / 100,
        totalCostMOQ: Math.round(totalCostMOQ * 100) / 100,
        optimalOrderQty: Math.round(optimalOrderQty * 100) / 100,
        costSavings: Math.round(costSavings * 100) / 100,
        daysToConsumeOptimal: Math.round(daysToConsumeOptimal * 100) / 100
      };
    } catch (error) {
      throw new Error("Failed to calculate: " + String(error));
    }
  },
};