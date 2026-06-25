import { DsoVeErkenOdemeIskontoTradeCreditOptimizasyonuCalculator108InputSchema, type DsoVeErkenOdemeIskontoTradeCreditOptimizasyonuCalculator108Input } from "./dso-ve-erken-odeme-iskonto-trade-credit-optimizasyonu-calculator-108-validation";

export const calculateDsoVeErkenOdemeIskontoTradeCreditOptimizasyonuCalculator108Contract: any = {
  id: "dso-ve-erken-odeme-iskonto-trade-credit-optimizasyonu-calculator-108",
  version: "1.0.0",
  category: "cost",
  inputSchema: DsoVeErkenOdemeIskontoTradeCreditOptimizasyonuCalculator108InputSchema,
  
  execute: async (input: any) => {
    try {
      // Destructure inputs with defaults
      const {
        annualRevenue = 0,
        avgArBalance = 0,
        wacc = 0,
        discountPct = 0,
        discountTerm = 0,
        normalTerm = 0,
        expectedTakeRate = 0,
        defaultRate = 0,
        collectionFeePct = 0
      } = input;

      // Convert percentage inputs to decimal fractions
      const waccDecimal = wacc / 100;
      const discountPctDecimal = discountPct / 100;
      const expectedTakeRateDecimal = expectedTakeRate / 100;
      const defaultRateDecimal = defaultRate / 100;
      const collectionFeePctDecimal = collectionFeePct / 100;

      // Formula: DSO_Current = (avg_ar_balance / annual_revenue) * 365
      const dSOCurrent = annualRevenue > 0 ? (avgArBalance / annualRevenue) * 365 : 0;

      // Formula: Cost_Of_Carrying_AR = avg_ar_balance * (wacc / 100)
      const costOfCarryingAR = avgArBalance * waccDecimal;

      // Formula: Bad_Debt_Cost = annual_revenue * (default_rate / 100)
      const badDebtCost = annualRevenue * defaultRateDecimal;

      // Formula: Collection_Cost = annual_revenue * (default_rate / 100) * (collection_fee_pct / 100)
      const collectionCost = annualRevenue * defaultRateDecimal * collectionFeePctDecimal;

      // Formula: Cost_Of_Discount_Offered = annual_revenue * (expected_take_rate / 100) * (discount_pct / 100)
      const costOfDiscountOffered = annualRevenue * expectedTakeRateDecimal * discountPctDecimal;

      // Formula: New_Avg_AR_Balance = annual_revenue * (((expected_take_rate / 100) * discount_term) + ((1 - (expected_take_rate / 100)) * DSO_Current)) / 365
      const newAvgARBalance = annualRevenue * (
        (expectedTakeRateDecimal * discountTerm) + 
        ((1 - expectedTakeRateDecimal) * dSOCurrent)
      ) / 365;

      // Formula: New_Carrying_Cost = New_Avg_AR_Balance * (wacc / 100)
      const newCarryingCost = newAvgARBalance * waccDecimal;

      // Formula: Net_Financial_Impact_Of_Policy = Cost_Of_Carrying_AR - New_Carrying_Cost - Cost_Of_Discount_Offered
      const netFinancialImpactOfPolicy = costOfCarryingAR - newCarryingCost - costOfDiscountOffered;

      // Formula: Annualized_Discount_Rate_Cost = (discount_pct / (100 - discount_pct)) * (365 / (normal_term - discount_term)) * 100
      const annualizedDiscountRateCost = 
        (discountPct / (100 - discountPct)) * 
        (365 / Math.max(normalTerm - discountTerm, 1)) * 
        100;

      return {
        dSOCurrent: Math.round(dSOCurrent * 100) / 100,
        costOfCarryingAR: Math.round(costOfCarryingAR * 100) / 100,
        badDebtCost: Math.round(badDebtCost * 100) / 100,
        collectionCost: Math.round(collectionCost * 100) / 100,
        costOfDiscountOffered: Math.round(costOfDiscountOffered * 100) / 100,
        newAvgARBalance: Math.round(newAvgARBalance * 100) / 100,
        newCarryingCost: Math.round(newCarryingCost * 100) / 100,
        netFinancialImpactOfPolicy: Math.round(netFinancialImpactOfPolicy * 100) / 100,
        annualizedDiscountRateCost: Math.round(annualizedDiscountRateCost * 100) / 100
      };
    } catch (error) {
      throw new Error("Failed to calculate: " + String(error));
    }
  },
};