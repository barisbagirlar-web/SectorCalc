import { SozlesmeTesvikPaylasimiVeCostHedefOptimizasyonuCalculator94InputSchema, type SozlesmeTesvikPaylasimiVeCostHedefOptimizasyonuCalculator94Input } from "./sozlesme-tesvik-paylasimi-ve-cost-hedef-optimizasyonu-calculator-94-validation";

export const calculateSozlesmeTesvikPaylasimiVeCostHedefOptimizasyonuCalculator94Contract: any = {
  id: "sozlesme-tesvik-paylasimi-ve-cost-hedef-optimizasyonu-calculator-94",
  version: "1.0.0",
  category: "cost",
  inputSchema: SozlesmeTesvikPaylasimiVeCostHedefOptimizasyonuCalculator94InputSchema,
  
  execute: async (input: SozlesmeTesvikPaylasimiVeCostHedefOptimizasyonuCalculator94Input) => {
    try {
      const { targetCost, targetFee, contractorShare, maxFee, minFee, actualCost } = input;

      // Step 1: Cost Deviation = target_cost - actual_cost
      const costDeviation = targetCost - actualCost;

      // Step 2: Contractor Incentive = Cost_Deviation * contractor_share
      const contractorIncentive = costDeviation * contractorShare;

      // Step 3: Adjusted Fee = target_fee + Contractor_Incentive
      const adjustedFee = targetFee + contractorIncentive;

      // Step 4: Final Fee = MIN(MAX(Adjusted_Fee, min_fee), max_fee)
      const finalFee = Math.min(Math.max(adjustedFee, minFee), maxFee);

      // Step 5: Final_Price_To_Client = actual_cost + Final_Fee
      const finalPriceToClient = actualCost + finalFee;

      // Step 6: Effective_Margin_Pct = (Final_Fee / actual_cost) * 100
      const effectiveMarginPct = actualCost !== 0 ? (finalFee / actualCost) * 100 : 0;

      // Step 7: Point_Of_Total_Assumption_PTA = target_cost + ((target_fee - min_fee) / contractor_share)
      const pointOfTotalAssumptionPTA = contractorShare !== 0 
        ? targetCost + ((targetFee - minFee) / contractorShare) 
        : Infinity;

      return {
        costDeviation: Math.round(costDeviation * 1000) / 1000,
        contractorIncentive: Math.round(contractorIncentive * 1000) / 1000,
        adjustedFee: Math.round(adjustedFee * 1000) / 1000,
        finalFee: Math.round(finalFee * 1000) / 1000,
        finalPriceToClient: Math.round(finalPriceToClient * 1000) / 1000,
        effectiveMarginPct: Math.round(effectiveMarginPct * 1000) / 1000,
        pointOfTotalAssumptionPTA: Math.round(pointOfTotalAssumptionPTA * 1000) / 1000
      };
    } catch (error) {
      throw new Error("Failed to calculate: " + String(error));
    }
  },
};