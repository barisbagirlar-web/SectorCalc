import { SectorcalcKureselEndustriyelOtoriteTcoVeEkosistemRoiCalculator191InputSchema, type SectorcalcKureselEndustriyelOtoriteTcoVeEkosistemRoiCalculator191Input } from "./sectorcalc-kuresel-endustriyel-otorite-tco-ve-ekosistem-roi-calculator-191-validation";

export const calculateSectorcalcKureselEndustriyelOtoriteTcoVeEkosistemRoiCalculator191Contract: any = {
  id: "sectorcalc-kuresel-endustriyel-otorite-tco-ve-ekosistem-roi-calculator-191",
  version: "1.0.0",
  category: "cost",
  inputSchema: SectorcalcKureselEndustriyelOtoriteTcoVeEkosistemRoiCalculator191InputSchema,
  
  execute: async (input: SectorcalcKureselEndustriyelOtoriteTcoVeEkosistemRoiCalculator191Input) => {
    try {
    // Formula: Annual_OpEx_Savings = legacy_software_lic_usd + (engineering_hours_saved * hourly_engineering_rate) + scrap_reduction_value_yr
    const annualOpExSavings = input.legacySoftwareLicUsd + (input.engineeringHoursSaved * input.hourlyEngineeringRate) + input.scrapReductionValueYr;

    // Formula: Net_Annual_CashFlow = Annual_OpEx_Savings - sectorcalc_sub_cost_yr
    const netAnnualCashFlow = annualOpExSavings - input.sectorcalcSubCostYr;

    // Formula: Project_NPV = (Net_Annual_CashFlow * ((1 - POWER(1 + (wacc_discount_rate/100), -evaluation_horizon_yrs)) / (wacc_discount_rate/100))) - implementation_capex
    const discountRate = input.waccDiscountRate / 100;
    const years = input.evaluationHorizonYrs;
    const projectNPV = discountRate > 0 
      ? (netAnnualCashFlow * ((1 - Math.pow(1 + discountRate, -years)) / discountRate)) - input.implementationCapex
      : (netAnnualCashFlow * years) - input.implementationCapex;

    // Formula: SectorCalc_ROI_Pct = (Project_NPV / (implementation_capex + sectorcalc_sub_cost_yr)) * 100
    const totalInvestment = input.implementationCapex + input.sectorcalcSubCostYr;
    const sectorCalcROIPct = totalInvestment > 0 
      ? (projectNPV / totalInvestment) * 100 
      : 0;

    // Formula: Simple_Payback_Months = (implementation_capex / Net_Annual_CashFlow) * 12
    const simplePaybackMonths = netAnnualCashFlow > 0 
      ? (input.implementationCapex / netAnnualCashFlow) * 12 
      : 0;

      return {
      annualOpExSavings,
      netAnnualCashFlow,
      projectNPV,
      sectorCalcROIPct,
      simplePaybackMonths: Math.round(simplePaybackMonths * 100) / 100
      };
    } catch (error) {
      throw new Error("Failed to calculate: " + String(error));
    }
  },
};