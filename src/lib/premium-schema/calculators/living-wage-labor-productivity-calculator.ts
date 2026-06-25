import { AdilYasamUcretiLivingWageVeIsgucuVerimiCalculator59InputSchema, type AdilYasamUcretiLivingWageVeIsgucuVerimiCalculator59Input } from "./adil-yasam-ucreti-living-wage-ve-isgucu-verimi-calculator-59-validation";

export const calculateAdilYasamUcretiLivingWageVeIsgucuVerimiCalculator59Contract: any = {
  id: "adil-yasam-ucreti-living-wage-ve-isgucu-verimi-calculator-59",
  version: "1.0.0",
  category: "cost",
  inputSchema: AdilYasamUcretiLivingWageVeIsgucuVerimiCalculator59InputSchema,
  
  execute: async (input: any) => {
    try {
      const rentCost = input.rentCost as number;
      const foodCost = input.foodCost as number;
      const transportCost = input.transportCost as number;
      const healthEduCost = input.healthEduCost as number;
      const utilitiesMisc = input.utilitiesMisc as number;
      const adults = input.adults as number;
      const children = input.children as number;
      const taxRate = input.taxRate as number;
      const workHoursWk = input.workHoursWk as number;
      const currentWage = input.currentWage as number;

      // Formula: Monthly_Net_Required = rent_cost + food_cost + transport_cost + health_edu_cost + utilities_misc
      const monthlyNetRequired = rentCost + foodCost + transportCost + healthEduCost + utilitiesMisc;

      // Formula: Annual_Net_Required = Monthly_Net_Required * 12
      const annualNetRequired = monthlyNetRequired * 12;

      // Formula: Annual_Gross_Required = Annual_Net_Required / (1 - (tax_rate / 100))
      const annualGrossRequired = annualNetRequired / (1 - (taxRate / 100));

      // Formula: Target_Hourly_Wage = Annual_Gross_Required / (work_hours_wk * 52) / adults
      const totalAnnualWorkHours = workHoursWk * 52;
      // Ensure adults is at least 1 to avoid division by zero
      const effectiveAdults = adults > 0 ? adults : 1;
      const targetHourlyWage = totalAnnualWorkHours > 0 
        ? annualGrossRequired / totalAnnualWorkHours / effectiveAdults 
        : 0;

      // Formula: Wage_Gap_Pct = ((Target_Hourly_Wage - current_wage) / Target_Hourly_Wage) * 100
      const wageGapPct = targetHourlyWage > 0 
        ? ((targetHourlyWage - currentWage) / targetHourlyWage) * 100 
        : 0;

      // Formula: Daily_Allowance_Per_Capita = Monthly_Net_Required / 30 / (adults + (children * 0.5))
      // Children are counted as 0.5 adult equivalent
      const adultEquivalentUnits = effectiveAdults + (children * 0.5);
      const dailyAllowancePerCapita = adultEquivalentUnits > 0 
        ? monthlyNetRequired / 30 / adultEquivalentUnits 
        : 0;

      return {
        monthlyNetRequired: Math.round(monthlyNetRequired * 100) / 100,
        annualNetRequired: Math.round(annualNetRequired * 100) / 100,
        annualGrossRequired: Math.round(annualGrossRequired * 100) / 100,
        targetHourlyWage: Math.round(targetHourlyWage * 100) / 100,
        wageGapPct: Math.round(wageGapPct * 100) / 100,
        dailyAllowancePerCapita: Math.round(dailyAllowancePerCapita * 100) / 100
      };
    } catch (error) {
      throw new Error("Failed to calculate: " + String(error));
    }
  },
};