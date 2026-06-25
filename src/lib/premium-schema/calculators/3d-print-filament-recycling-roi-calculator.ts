import { ProTool3dBaskiFilamentGeriDonusumRoiVeMukavemetKaybiCalculator38InputSchema, type ProTool3dBaskiFilamentGeriDonusumRoiVeMukavemetKaybiCalculator38Input } from "./3d-baski-filament-geri-donusum-roi-ve-mukavemet-kaybi-calculator-38-validation";

export const calculateProTool3dBaskiFilamentGeriDonusumRoiVeMukavemetKaybiCalculator38Contract: any = {
  id: "3d-baski-filament-geri-donusum-roi-ve-mukavemet-kaybi-calculator-38",
  version: "1.0.0",
  category: "cost",
  inputSchema: ProTool3dBaskiFilamentGeriDonusumRoiVeMukavemetKaybiCalculator38InputSchema,
  
  execute: async (input: any) => {
    try {
      const {
        virginPriceKg,
        scrapVolumeKg,
        recycleYieldPct,
        recycleCapex,
        processCostKg,
        tensileLossPct,
        qualityPenaltyRate,
        carbonCreditKg
      } = input as ProTool3dBaskiFilamentGeriDonusumRoiVeMukavemetKaybiCalculator38Input;

      // Validate inputs
      if (virginPriceKg < 0 || scrapVolumeKg < 0 || recycleYieldPct < 0 || recycleCapex < 0 ||
          processCostKg < 0 || tensileLossPct < 0 || qualityPenaltyRate < 0 || carbonCreditKg < 0) {
        throw new Error("Input values cannot be negative");
      }

      // Formula: Usable_Recycled_kg = scrap_volume_kg * (recycle_yield_pct / 100)
      const usableRecycledKg = scrapVolumeKg * (recycleYieldPct / 100);

      // Formula: Cost_Avoidance = Usable_Recycled_kg * virgin_price_kg
      const costAvoidance = usableRecycledKg * virginPriceKg;

      // Formula: Processing_Opex = Usable_Recycled_kg * process_cost_kg
      const processingOpex = usableRecycledKg * processCostKg;

      // Formula: Quality_Penalty_Cost = tensile_loss_pct * quality_penalty_rate * Usable_Recycled_kg
      const qualityPenaltyCost = (tensileLossPct / 100) * qualityPenaltyRate * usableRecycledKg;

      // Formula: Carbon_Credit_Revenue = Usable_Recycled_kg * carbon_credit_kg
      const carbonCreditRevenue = usableRecycledKg * carbonCreditKg;

      // Formula: Net_Annual_Savings = Cost_Avoidance - Processing_Opex - Quality_Penalty_Cost + Carbon_Credit_Revenue
      const netAnnualSavings = costAvoidance - processingOpex - qualityPenaltyCost + carbonCreditRevenue;

      // Formula: ROI_Recycling = (Net_Annual_Savings / recycle_capex) * 100
      const rOIRecycling = recycleCapex > 0 ? (netAnnualSavings / recycleCapex) * 100 : 0;

      // Formula: Payback_Months = (recycle_capex / Net_Annual_Savings) * 12
      const paybackMonths = netAnnualSavings > 0 ? (recycleCapex / netAnnualSavings) * 12 : Infinity;

      return {
        usableRecycledKg: Math.round(usableRecycledKg * 100) / 100,
        costAvoidance: Math.round(costAvoidance * 100) / 100,
        processingOpex: Math.round(processingOpex * 100) / 100,
        qualityPenaltyCost: Math.round(qualityPenaltyCost * 100) / 100,
        carbonCreditRevenue: Math.round(carbonCreditRevenue * 100) / 100,
        netAnnualSavings: Math.round(netAnnualSavings * 100) / 100,
        rOIRecycling: Math.round(rOIRecycling * 100) / 100,
        paybackMonths: paybackMonths === Infinity ? Infinity : Math.round(paybackMonths * 100) / 100
      };
    } catch (error) {
      throw new Error("Failed to calculate: " + String(error));
    }
  },
};