import { EndustriyelDepreciationVeYenilemeReelEuacCalculator4InputSchema, type EndustriyelDepreciationVeYenilemeReelEuacCalculator4Input } from "./endustriyel-depreciation-ve-yenileme-reel-euac-calculator-4-validation";

export const calculateEndustriyelDepreciationVeYenilemeReelEuacCalculator4Contract: any = {
  id: "endustriyel-depreciation-ve-yenileme-reel-euac-calculator-4",
  version: "1.0.0",
  category: "cost",
  inputSchema: EndustriyelDepreciationVeYenilemeReelEuacCalculator4InputSchema,
  
  execute: async (input: any) => {
    try {
      const {
        acqCost,
        salvage,
        life,
        taxRate,
        nominalWacc,
        inflation,
        baseMaint,
        maintGradient,
        baseEnergy,
        degRate,
        elecPrice
      } = input;

      // Step 1: Calculate real WACC
      const realWACC = ((1 + (nominalWacc / 100)) / (1 + (inflation / 100))) - 1;

      // Step 2: Calculate annual depreciation (straight-line)
      const deprAnnual = (acqCost - salvage) / life;

      // Step 3: Calculate present value of tax shield from depreciation
      let taxShieldPV = 0;
      for (let t = 1; t <= life; t++) {
        const discountFactor = Math.pow(1 + (nominalWacc / 100), t);
        taxShieldPV += (deprAnnual * (taxRate / 100)) / discountFactor;
      }

      // Step 4: Calculate maintenance and energy costs for each year
      let opExPVReal = 0;
      for (let t = 1; t <= life; t++) {
        const maintT = baseMaint + ((t - 1) * maintGradient);
        const energyT = baseEnergy * elecPrice * Math.pow(1 + (degRate / 100), t);
        const totalOpEx = maintT + energyT;
        const afterTaxOpEx = totalOpEx * (1 - (taxRate / 100));
        const discountFactor = Math.pow(1 + realWACC, t);
        opExPVReal += afterTaxOpEx / discountFactor;
      }

      // Step 5: Calculate present value of salvage
      const salvagePV = salvage / Math.pow(1 + (nominalWacc / 100), life);

      // Step 6: Calculate net NPV
      const netNPV = acqCost - taxShieldPV + opExPVReal - salvagePV;

      // Step 7: Calculate real EUAC (Equivalent Uniform Annual Cost)
      const realEUAC = netNPV * (realWACC * Math.pow(1 + realWACC, life)) / (Math.pow(1 + realWACC, life) - 1);

      return {
        realWACC,
        deprAnnual,
        taxShieldPV,
        maintT: baseMaint,
        energyT: baseEnergy * elecPrice,
        opExPVReal,
        salvagePV,
        netNPV,
        realEUAC
      };
    } catch (error) {
      throw new Error("Failed to calculate: " + String(error));
    }
  },
};