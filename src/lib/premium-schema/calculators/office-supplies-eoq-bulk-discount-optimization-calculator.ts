import { SarfofisMalzemesiEoqVeTopluIskontoOptimizasyonuCalculator106InputSchema, type SarfofisMalzemesiEoqVeTopluIskontoOptimizasyonuCalculator106Input } from "./sarfofis-malzemesi-eoq-ve-toplu-iskonto-optimizasyonu-calculator-106-validation";

export const calculateSarfofisMalzemesiEoqVeTopluIskontoOptimizasyonuCalculator106Contract: any = {
  id: "sarfofis-malzemesi-eoq-ve-toplu-iskonto-optimizasyonu-calculator-106",
  version: "1.0.0",
  category: "cost",
  inputSchema: SarfofisMalzemesiEoqVeTopluIskontoOptimizasyonuCalculator106InputSchema,
  
  execute: async (input: any) => {
    try {
      const {
        monthlyQty,
        unitPrice,
        bulkDiscountPct,
        bulkMinQty,
        orderCost,
        holdingRate
      } = input;

      // Validate required inputs
      if (!monthlyQty || !unitPrice || !bulkDiscountPct || !bulkMinQty || !orderCost || !holdingRate) {
        throw new Error("All input fields are required");
      }

      const annualDemand = monthlyQty * 12;
      const annualDemandNum = Number(annualDemand);
      
      // Holding cost for standard price (per unit per year)
      const holdingCostStd = unitPrice * (holdingRate / 100);
      const holdingCostStdNum = Number(holdingCostStd);
      
      // Discounted price per unit
      const discountedPrice = unitPrice * (1 - (bulkDiscountPct / 100));
      const discountedPriceNum = Number(discountedPrice);
      
      // Holding cost for bulk price (per unit per year)
      const holdingCostBulk = discountedPriceNum * (holdingRate / 100);
      const holdingCostBulkNum = Number(holdingCostBulk);
      
      // EOQ for standard pricing
      const eoqStandard = Math.sqrt((2 * annualDemandNum * orderCost) / holdingCostStdNum);
      const eoqStandardNum = Number(eoqStandard.toFixed(2));
      
      // Total cost using EOQ strategy
      const totalCostEOQ = (annualDemandNum * unitPrice) + 
                          (annualDemandNum / eoqStandardNum) * orderCost + 
                          (eoqStandardNum / 2) * holdingCostStdNum;
      const totalCostEOQNum = Number(totalCostEOQ.toFixed(2));
      
      // Total cost using bulk discount strategy
      const totalCostBulk = (annualDemandNum * discountedPriceNum) + 
                           (annualDemandNum / bulkMinQty) * orderCost + 
                           (bulkMinQty / 2) * holdingCostBulkNum;
      const totalCostBulkNum = Number(totalCostBulk.toFixed(2));
      
      // Optimized decision - minimum cost between EOQ and bulk strategies
      const optimizedDecisionCost = Math.min(totalCostEOQNum, totalCostBulkNum);
      
      // Savings from optimization (comparing EOQ cost to optimized decision)
      const savingsFromOptimization = Math.max(0, totalCostEOQNum - optimizedDecisionCost);
      const savingsFromOptimizationNum = Number(savingsFromOptimization.toFixed(2));

      return {
        annualDemand: annualDemandNum,
        holdingCostStd: holdingCostStdNum,
        discountedPrice: discountedPriceNum,
        holdingCostBulk: holdingCostBulkNum,
        eOQStandard: eoqStandardNum,
        totalCostEOQ: totalCostEOQNum,
        totalCostBulk: totalCostBulkNum,
        optimizedDecisionCost: optimizedDecisionCost,
        savingsFromOptimization: savingsFromOptimizationNum
      };
    } catch (error) {
      throw new Error("Failed to calculate: " + String(error));
    }
  },
};