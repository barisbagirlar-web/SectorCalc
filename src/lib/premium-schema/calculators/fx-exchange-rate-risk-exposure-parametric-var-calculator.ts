import { DovizKuruRiskiFxExposureVeParametrikVarCalculator74InputSchema, type DovizKuruRiskiFxExposureVeParametrikVarCalculator74Input } from "./doviz-kuru-riski-fx-exposure-ve-parametrik-var-calculator-74-validation";

export const calculateDovizKuruRiskiFxExposureVeParametrikVarCalculator74Contract: any = {
  id: "doviz-kuru-riski-fx-exposure-ve-parametrik-var-calculator-74",
  version: "1.0.0",
  category: "cost",
  inputSchema: DovizKuruRiskiFxExposureVeParametrikVarCalculator74InputSchema,
  
  execute: async (input: any) => {
    try {
      const fxRevenue = Number(input.fxRevenue) || 0;
      const fxExpense = Number(input.fxExpense) || 0;
      const spotRate = Number(input.spotRate) || 0;
      const forwardRate = Number(input.forwardRate) || 0;
      const volatilityAnnual = Number(input.volatilityAnnual) || 0;
      const horizonDays = Number(input.horizonDays) || 0;
      const hedgeRatio = Number(input.hedgeRatio) || 0;
      const zScore = Number(input.zScore) || 0;

      // Formula: Net_Exposure_FX = fx_revenue - fx_expense
      const netExposureFX = fxRevenue - fxExpense;

      // Formula: Net_Exposure_Base = Net_Exposure_FX * spot_rate
      const netExposureBase = netExposureFX * spotRate;

      // Formula: Unhedged_Exposure = Net_Exposure_Base * (1 - (hedge_ratio / 100))
      const unhedgedExposure = netExposureBase * (1 - (hedgeRatio / 100));

      // Formula: Volatility_Horizon = (volatility_annual / 100) * SQRT(horizon_days / 252)
      const volatilityHorizon = (volatilityAnnual / 100) * Math.sqrt(horizonDays / 252);

      // Formula: VaR_Parametric = ABS(Unhedged_Exposure) * Volatility_Horizon * z_score
      const vaRParametric = Math.abs(unhedgedExposure) * volatilityHorizon * zScore;

      // Formula: Hedge_Contract_Notional = Net_Exposure_FX * (hedge_ratio / 100)
      const hedgeContractNotional = netExposureFX * (hedgeRatio / 100);

      // Formula: Hedge_Premium_Discount = Hedge_Contract_Notional * (forward_rate - spot_rate)
      const hedgePremiumDiscount = hedgeContractNotional * (forwardRate - spotRate);

      // Formula: Total_Financial_Risk_Impact = VaR_Parametric + Hedge_Premium_Discount
      const totalFinancialRiskImpact = vaRParametric + hedgePremiumDiscount;

      return {
        netExposureFX,
        netExposureBase,
        unhedgedExposure,
        volatilityHorizon,
        vaRParametric,
        hedgeContractNotional,
        hedgePremiumDiscount,
        totalFinancialRiskImpact
      };
    } catch (error) {
      throw new Error("Failed to calculate: " + String(error));
    }
  },
};