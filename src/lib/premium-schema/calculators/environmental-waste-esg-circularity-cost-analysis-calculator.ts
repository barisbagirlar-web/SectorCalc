import { CevreselAtikEsgVeDongusellikCostAnalysisCalculator33InputSchema, type CevreselAtikEsgVeDongusellikCostAnalysisCalculator33Input } from "./cevresel-atik-esg-ve-dongusellik-cost-analysis-calculator-33-validation";

export const calculateCevreselAtikEsgVeDongusellikCostAnalysisCalculator33Contract: any = {
  id: "cevresel-atik-esg-ve-dongusellik-cost-analysis-calculator-33",
  version: "1.0.0",
  category: "cost",
  inputSchema: CevreselAtikEsgVeDongusellikCostAnalysisCalculator33InputSchema,
  
  execute: async (input: any) => {
    try {
      const {
        nonHazWasteT = 0,
        hazWasteT = 0,
        recycledWasteT = 0,
        disposalFeeNonhaz = 0,
        disposalFeeHaz = 0,
        recycleRevenue = 0,
        regulatoryFine = 0,
        violationProb = 0
      } = input;

      // Formula: Total_Waste = non_haz_waste_t + haz_waste_t + recycled_waste_t
      const totalWaste = nonHazWasteT + hazWasteT + recycledWasteT;

      // Formula: Cost_NonHaz = non_haz_waste_t * disposal_fee_nonhaz
      const costNonHaz = nonHazWasteT * disposalFeeNonhaz;

      // Formula: Cost_Haz = haz_waste_t * disposal_fee_haz
      const costHaz = hazWasteT * disposalFeeHaz;

      // Formula: Net_Recycle_Income = recycled_waste_t * recycle_revenue
      const netRecycleIncome = recycledWasteT * recycleRevenue;

      // Formula: Risk_Exposure_Cost = (violation_prob / 100) * regulatory_fine
      const riskExposureCost = (violationProb / 100) * regulatoryFine;

      // Formula: Total_Waste_Cost = Cost_NonHaz + Cost_Haz - Net_Recycle_Income + Risk_Exposure_Cost
      const totalWasteCost = costNonHaz + costHaz - netRecycleIncome + riskExposureCost;

      // Formula: Circularity_Rate = (recycled_waste_t / Total_Waste) * 100
      // Avoid division by zero; if totalWaste is 0, circularity rate is 0
      const circularityRate = totalWaste > 0 ? (recycledWasteT / totalWaste) * 100 : 0;

      return {
        totalWaste: Math.round(totalWaste * 100) / 100,
        costNonHaz: Math.round(costNonHaz * 100) / 100,
        costHaz: Math.round(costHaz * 100) / 100,
        netRecycleIncome: Math.round(netRecycleIncome * 100) / 100,
        riskExposureCost: Math.round(riskExposureCost * 100) / 100,
        totalWasteCost: Math.round(totalWasteCost * 100) / 100,
        circularityRate: Math.round(circularityRate * 100) / 100
      };
    } catch (error) {
      throw new Error("Failed to calculate: " + String(error));
    }
  },
};