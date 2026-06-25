import { CncIsMiliSpindleTermalUzamaVeRulmanOnYukKaybiCalculator149InputSchema, type CncIsMiliSpindleTermalUzamaVeRulmanOnYukKaybiCalculator149Input } from "./cnc-is-mili-spindle-termal-uzama-ve-rulman-on-yuk-kaybi-calculator-149-validation";

export const calculateCncIsMiliSpindleTermalUzamaVeRulmanOnYukKaybiCalculator149Contract: any = {
  id: "cnc-is-mili-spindle-termal-uzama-ve-rulman-on-yuk-kaybi-calculator-149",
  version: "1.0.0",
  category: "cost",
  inputSchema: CncIsMiliSpindleTermalUzamaVeRulmanOnYukKaybiCalculator149InputSchema,
  
  execute: async (input: CncIsMiliSpindleTermalUzamaVeRulmanOnYukKaybiCalculator149Input) => {
    try {
      // Destructure inputs
      const {
        spindleRpm,
        bearingPitchDia,
        shaftLength,
        tempDelta,
        thermalExpCoeff,
        initialPreload,
        stiffnessAxial
      } = input;

      // Calculate Speed Factor: ndm = spindleRpm * bearingPitchDia
      const speedFactorNdm = spindleRpm * bearingPitchDia;

      // Calculate Thermal Elongation: ΔL (µm) = shaftLength (mm) * 1000 * α * ΔT
      const thermalElongationUm = shaftLength * 1000 * thermalExpCoeff * tempDelta;

      // Calculate Preload Loss: due to thermal elongation against system stiffness
      // Preload Loss (N) = Thermal Elongation (µm) * Axial Stiffness (N/µm)
      const preloadLossN = thermalElongationUm * stiffnessAxial;

      // Calculate Residual Preload: initial preload minus loss (cannot go below 0)
      const residualPreloadN = Math.max(0, initialPreload - preloadLossN);

      // Calculate Preload Loss Percentage
      let preloadLossPct = 0;
      if (initialPreload > 0) {
        preloadLossPct = (preloadLossN / initialPreload) * 100;
      }

      // Return calculated values
      return {
        speedFactorNdm: Math.round(speedFactorNdm * 100) / 100,
        thermalElongationUm: Math.round(thermalElongationUm * 100) / 100,
        preloadLossN: Math.round(preloadLossN * 100) / 100,
        residualPreloadN: Math.round(residualPreloadN * 100) / 100,
        preloadLossPct: Math.round(preloadLossPct * 100) / 100
      };
    } catch (error) {
      throw new Error("Failed to calculate: " + String(error));
    }
  },
};