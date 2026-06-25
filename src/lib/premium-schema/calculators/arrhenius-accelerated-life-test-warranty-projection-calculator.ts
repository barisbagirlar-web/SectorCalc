import { ArrheniusHizlandirilmisYasamTestiAltVeGarantiProjeksiyonuCalculator178InputSchema, type ArrheniusHizlandirilmisYasamTestiAltVeGarantiProjeksiyonuCalculator178Input } from "./arrhenius-hizlandirilmis-yasam-testi-alt-ve-garanti-projeksiyonu-calculator-178-validation";

export const calculateArrheniusHizlandirilmisYasamTestiAltVeGarantiProjeksiyonuCalculator178Contract: any = {
  id: "arrhenius-hizlandirilmis-yasam-testi-alt-ve-garanti-projeksiyonu-calculator-178",
  version: "1.0.0",
  category: "cost",
  inputSchema: ArrheniusHizlandirilmisYasamTestiAltVeGarantiProjeksiyonuCalculator178InputSchema,
  
  execute: async (input: any) => {
    try {
      // Parse and convert inputs
      const useTempC = Number(input.useTempC) || 0;
      const stressTempC = Number(input.stressTempC) || 0;
      const activationEnergyEv = Number(input.activationEnergyEv) || 0;
      const testHoursToFailure = Number(input.testHoursToFailure) || 0;
      const targetWarrantyYrs = Number(input.targetWarrantyYrs) || 0;

      // Boltzmann constant in eV/K
      const boltzmannK = 8.617333e-5;

      // Convert temperatures from Celsius to Kelvin
      const tUseK = useTempC + 273.15;
      const tStressK = stressTempC + 273.15;

      // Calculate Acceleration Factor using Arrhenius equation
      // AF = exp((Ea / k) * ((1/T_use) - (1/T_stress)))
      const activationOverBoltzmann = activationEnergyEv / boltzmannK;
      const inverseUseTemp = 1 / tUseK;
      const inverseStressTemp = 1 / tStressK;
      const accelerationFactorAF = Math.exp(activationOverBoltzmann * (inverseUseTemp - inverseStressTemp));

      // Calculate projected normal life in hours at use temperature
      // Projected_Normal_Life_Hrs = test_hours_to_failure * AF
      const projectedNormalLifeHrs = testHoursToFailure * accelerationFactorAF;

      // Convert to years (8760 hours per year)
      const projectedNormalLifeYrs = projectedNormalLifeHrs / 8760;

      // Calculate warranty safety margin
      // Warranty_Safety_Margin = Projected_Normal_Life_Yrs - target_warranty_yrs
      const warrantySafetyMargin = projectedNormalLifeYrs - targetWarrantyYrs;

      return {
        boltzmannK,
        tUseK,
        tStressK,
        accelerationFactorAF,
        projectedNormalLifeHrs,
        projectedNormalLifeYrs,
        warrantySafetyMargin
      };
    } catch (error) {
      throw new Error("Failed to calculate: " + String(error));
    }
  },
};