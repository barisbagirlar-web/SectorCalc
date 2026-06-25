import { KaynakliImalatKaliciCarpilmaTransverseShrinkageTahminiCalculator157InputSchema, type KaynakliImalatKaliciCarpilmaTransverseShrinkageTahminiCalculator157Input } from "./kaynakli-imalat-kalici-carpilma-transverse-shrinkage-tahmini-calculator-157-validation";

export const calculateKaynakliImalatKaliciCarpilmaTransverseShrinkageTahminiCalculator157Contract: any = {
  id: "kaynakli-imalat-kalici-carpilma-transverse-shrinkage-tahmini-calculator-157",
  version: "1.0.0",
  category: "cost",
  inputSchema: KaynakliImalatKaliciCarpilmaTransverseShrinkageTahminiCalculator157InputSchema,
  
  execute: async (input: any) => {
    try {
      const {
        weldLength,
        plateThickness,
        weldCrossSection,
        heatInput,
        materialExpCoeff,
        weldPasses
      } = input;

      // Validate inputs are numbers and positive
      if (plateThickness <= 0 || weldCrossSection <= 0 || heatInput <= 0 || materialExpCoeff <= 0 || weldPasses <= 0) {
        throw new Error("All input values must be positive numbers");
      }

      // Formula: Inherent_Shrinkage_Force_N = 1000 * heat_input * material_exp_coeff * 200000
      const inherentShrinkageForceN = 1000 * heatInput * materialExpCoeff * 200000;

      // Formula: Transverse_Shrinkage_mm = (0.2 * weld_cross_section) / plate_thickness
      const transverseShrinkageMm = (0.2 * weldCrossSection) / plateThickness;

      // Formula: Cumulative_Shrinkage_mm = Transverse_Shrinkage_mm * POWER(weld_passes, 0.8)
      const cumulativeShrinkageMm = transverseShrinkageMm * Math.pow(weldPasses, 0.8);

      // Formula: Angular_Distortion_Rad = (0.012 * heat_input) / POWER(plate_thickness, 2)
      const angularDistortionRad = (0.012 * heatInput) / Math.pow(plateThickness, 2);

      // Formula: Angular_Distortion_Deg = Angular_Distortion_Rad * (180 / PI)
      const angularDistortionDeg = angularDistortionRad * (180 / Math.PI);

      return {
        inherentShrinkageForceN,
        transverseShrinkageMm,
        cumulativeShrinkageMm,
        angularDistortionRad,
        angularDistortionDeg
      };
    } catch (error) {
      throw new Error("Failed to calculate: " + String(error));
    }
  },
};