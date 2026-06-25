import { RuzgarTurbiniAepVeIleriLcoeAnalysisIec61400Calculator91InputSchema, type RuzgarTurbiniAepVeIleriLcoeAnalysisIec61400Calculator91Input } from "./ruzgar-turbini-aep-ve-ileri-lcoe-analysis-iec-61400-calculator-91-validation";

export const calculateRuzgarTurbiniAepVeIleriLcoeAnalysisIec61400Calculator91Contract: any = {
  id: "ruzgar-turbini-aep-ve-ileri-lcoe-analysis-iec-61400-calculator-91",
  version: "1.0.0",
  category: "cost",
  inputSchema: RuzgarTurbiniAepVeIleriLcoeAnalysisIec61400Calculator91InputSchema,
  
  execute: async (input: any) => {
    try {
      const {
        nominalKw,
        capacityFactor,
        capex,
        opexYr,
        degradation,
        systemLife,
        wacc,
        gridRate
      } = input as RuzgarTurbiniAepVeIleriLcoeAnalysisIec61400Calculator91Input;

      // AEP Year 1 (kWh/year)
      // AEP_Year1 = nominal_kw * (capacity_factor / 100) * 8760
      const aEPYear1 = nominalKw * (capacityFactor / 100) * 8760;

      // Calculate total discounted energy and total discounted cost
      let totalDiscountedEnergy = 0;
      let totalDiscountedCost = capex;
      
      for (let t = 1; t <= systemLife; t++) {
        // Degraded energy for year t: AEP_Year1 * (1 - degradation/100)^(t-1)
        const yearlyEnergyDegraded = aEPYear1 * Math.pow(1 - (degradation / 100), t - 1);
        // Discounted energy: yearly_energy / (1 + wacc/100)^t
        const discountedEnergy = yearlyEnergyDegraded / Math.pow(1 + (wacc / 100), t);
        totalDiscountedEnergy += discountedEnergy;

        // Discounted OPEX for year t
        const discountedOpex = opexYr / Math.pow(1 + (wacc / 100), t);
        totalDiscountedCost += discountedOpex;
      }

      // LCOE = Total_Discounted_Cost / Total_Discounted_Energy
      const lCOE = totalDiscountedEnergy > 0 ? totalDiscountedCost / totalDiscountedEnergy : 0;

      // NPV = (Total_Discounted_Energy * grid_rate) - Total_Discounted_Cost
      const nPV = (totalDiscountedEnergy * gridRate) - totalDiscountedCost;

      // Simple Payback = capex / ((AEP_Year1 * grid_rate) - opex_yr)
      const annualRevenue = aEPYear1 * gridRate;
      const annualNetCashflow = annualRevenue - opexYr;
      const simplePayback = annualNetCashflow > 0 ? capex / annualNetCashflow : Infinity;

      return {
        aEPYear1,
        totalDiscountedEnergy,
        totalDiscountedCost,
        lCOE,
        nPV,
        simplePayback: simplePayback === Infinity ? 0 : simplePayback
      };
    } catch (error) {
      throw new Error("Failed to calculate: " + String(error));
    }
  },
};