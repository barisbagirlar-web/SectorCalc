import { SaatlikUcretTamYukluBurdenedRateVeServisMarjiCalculator97InputSchema, type SaatlikUcretTamYukluBurdenedRateVeServisMarjiCalculator97Input } from "./saatlik-ucret-tam-yuklu-burdened-rate-ve-servis-marji-calculator-97-validation";

export const calculateSaatlikUcretTamYukluBurdenedRateVeServisMarjiCalculator97Contract: any = {
  id: "saatlik-ucret-tam-yuklu-burdened-rate-ve-servis-marji-calculator-97",
  version: "1.0.0",
  category: "cost",
  inputSchema: SaatlikUcretTamYukluBurdenedRateVeServisMarjiCalculator97InputSchema,
  
  execute: async (input: any) => {
    try {
      const { baseSalary, benefits, statutory, idlePct, marginPct } = input;

      // Step 1: Gross Labor Cost = baseSalary * (1 + statutory/100) + benefits
      const grossLaborCost = baseSalary * (1 + statutory / 100) + benefits;

      // Step 2: Total Working Hours = 52 weeks * 40 hours/week
      const totalWorkingHours = 52 * 40;

      // Step 3: Productive Hours = totalWorkingHours * (1 - idlePct/100)
      const productiveHours = totalWorkingHours * (1 - idlePct / 100);

      // Step 4: Burdened Cost Rate = grossLaborCost / productiveHours
      const burdenedCostRate = productiveHours > 0 ? grossLaborCost / productiveHours : 0;

      // Step 5: Target Billing Rate = burdenedCostRate / (1 - marginPct/100)
      const targetBillingRate = (1 - marginPct / 100) > 0 ? burdenedCostRate / (1 - marginPct / 100) : 0;

      // Step 6: Margin Markup Multiplier = targetBillingRate / (baseSalary / totalWorkingHours)
      const baseHourly = totalWorkingHours > 0 ? baseSalary / totalWorkingHours : 0;
      const marginMarkupMultiplier = baseHourly > 0 ? targetBillingRate / baseHourly : 0;

      return {
        grossLaborCost,
        totalWorkingHours,
        productiveHours,
        burdenedCostRate,
        targetBillingRate,
        marginMarkupMultiplier
      };
    } catch (error) {
      throw new Error("Failed to calculate: " + String(error));
    }
  },
};