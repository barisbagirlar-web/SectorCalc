import { FaizOraniKurRiskiVeVarHedgeMaliyetiCalculator37InputSchema, type FaizOraniKurRiskiVeVarHedgeMaliyetiCalculator37Input } from "./faiz-orani-kur-riski-ve-var-hedge-maliyeti-calculator-37-validation";

export const calculateFaizOraniKurRiskiVeVarHedgeMaliyetiCalculator37Contract: any = {
  id: "faiz-orani-kur-riski-ve-var-hedge-maliyeti-calculator-37",
  version: "1.0.0",
  category: "cost",
  inputSchema: FaizOraniKurRiskiVeVarHedgeMaliyetiCalculator37InputSchema,
  
  execute: async (input: any) => {
    try {
      const {
        floatingDebt = 0,
        hedgeRatio = 0,
        bpsShock = 0,
        volatilityAnnual = 0,
        var99Z = 2.33,
        swapPremium = 0,
        ebitda = 0
      } = input;

      // Formula: Unhedged_Exposure = floating_debt * (1 - (hedge_ratio / 100))
      const unhedgedExposure = floatingDebt * (1 - (hedgeRatio / 100));

      // Formula: Interest_Shock_Impact = Unhedged_Exposure * (bps_shock / 10000)
      const interestShockImpact = unhedgedExposure * (bpsShock / 10000);

      // Formula: VaR_1_Year = Unhedged_Exposure * (volatility_annual / 100) * var_99_z
      const vaR1Year = unhedgedExposure * (volatilityAnnual / 100) * var99Z;

      // Formula: Total_Risk_Cost = swap_premium + Interest_Shock_Impact
      const totalRiskCost = swapPremium + interestShockImpact;

      // Formula: Stress_Test_EBITDA_Impact = (VaR_1_Year / ebitda) * 100
      const stressTestEBITDAImpact = ebitda !== 0 ? (vaR1Year / ebitda) * 100 : 0;

      return {
        unhedgedExposure: Math.round(unhedgedExposure * 100) / 100,
        interestShockImpact: Math.round(interestShockImpact * 100) / 100,
        vaR1Year: Math.round(vaR1Year * 100) / 100,
        totalRiskCost: Math.round(totalRiskCost * 100) / 100,
        stressTestEBITDAImpact: Math.round(stressTestEBITDAImpact * 100) / 100
      };
    } catch (error) {
      throw new Error("Failed to calculate: " + String(error));
    }
  },
};