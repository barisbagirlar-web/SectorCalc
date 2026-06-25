import { FgazSizintiRegulasyonuVeKarbonEsdegeriTco2eCalculator45InputSchema, type FgazSizintiRegulasyonuVeKarbonEsdegeriTco2eCalculator45Input } from "./fgaz-sizinti-regulasyonu-ve-karbon-esdegeri-tco2e-calculator-45-validation";

export const calculateFgazSizintiRegulasyonuVeKarbonEsdegeriTco2eCalculator45Contract: any = {
  id: "fgaz-sizinti-regulasyonu-ve-karbon-esdegeri-tco2e-calculator-45",
  version: "1.0.0",
  category: "cost",
  inputSchema: FgazSizintiRegulasyonuVeKarbonEsdegeriTco2eCalculator45InputSchema,
  
  execute: async (input: any) => {
    try {
      const {
        gwpValue,
        chargeKg,
        deviceCount,
        leakRatePct,
        testCost,
        gasPrice
      } = input;

      // Validate inputs
      if (gwpValue == null || chargeKg == null || deviceCount == null || 
          leakRatePct == null || testCost == null || gasPrice == null) {
        throw new Error("All input fields are required");
      }

      // Convert to numbers
      const gwp = Number(gwpValue);
      const charge = Number(chargeKg);
      const devices = Number(deviceCount);
      const leakRate = Number(leakRatePct);
      const testFee = Number(testCost);
      const pricePerKg = Number(gasPrice);

      // Prevent division by zero or negative values
      if (gwp <= 0 || charge <= 0 || devices <= 0 || leakRate < 0 || testFee < 0 || pricePerKg < 0) {
        throw new Error("Input values must be positive numbers");
      }

      // Formula: Total_Charge = charge_kg * device_count
      const totalCharge = charge * devices;

      // Formula: tCO2e_PerDevice = (charge_kg * gwp_value) / 1000
      const tCO2ePerDevice = (charge * gwp) / 1000;

      // Formula: Total_tCO2e = tCO2e_PerDevice * device_count
      const totalTCO2e = tCO2ePerDevice * devices;

      // Formula: Test_Frequency_Factor = IF(tCO2e_PerDevice >= 500, 4, IF(tCO2e_PerDevice >= 50, 2, IF(tCO2e_PerDevice >= 5, 1, 0)))
      let testFrequencyFactor = 0;
      if (tCO2ePerDevice >= 500) {
        testFrequencyFactor = 4;
      } else if (tCO2ePerDevice >= 50) {
        testFrequencyFactor = 2;
      } else if (tCO2ePerDevice >= 5) {
        testFrequencyFactor = 1;
      } else {
        testFrequencyFactor = 0;
      }

      // Formula: Annual_Test_Cost = Test_Frequency_Factor * device_count * test_cost
      const annualTestCost = testFrequencyFactor * devices * testFee;

      // Formula: Annual_Leak_kg = Total_Charge * (leak_rate_pct / 100)
      const annualLeakKg = totalCharge * (leakRate / 100);

      // Formula: Leakage_Cost = Annual_Leak_kg * gas_price
      const leakageCost = annualLeakKg * pricePerKg;

      // Formula: Leaked_Emissions_tCO2e = (Annual_Leak_kg * gwp_value) / 1000
      const leakedEmissionsTCO2e = (annualLeakKg * gwp) / 1000;

      // Formula: Total_Compliance_Cost = Annual_Test_Cost + Leakage_Cost
      const totalComplianceCost = annualTestCost + leakageCost;

      return {
        totalCharge: Math.round(totalCharge * 100) / 100,
        tCO2ePerDevice: Math.round(tCO2ePerDevice * 100) / 100,
        totalTCO2e: Math.round(totalTCO2e * 100) / 100,
        testFrequencyFactor: testFrequencyFactor,
        annualTestCost: Math.round(annualTestCost * 100) / 100,
        annualLeakKg: Math.round(annualLeakKg * 100) / 100,
        leakageCost: Math.round(leakageCost * 100) / 100,
        leakedEmissionsTCO2e: Math.round(leakedEmissionsTCO2e * 100) / 100,
        totalComplianceCost: Math.round(totalComplianceCost * 100) / 100
      };
    } catch (error) {
      throw new Error("Failed to calculate: " + String(error));
    }
  },
};