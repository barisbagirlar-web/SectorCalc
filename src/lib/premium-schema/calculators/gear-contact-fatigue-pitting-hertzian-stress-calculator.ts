import { DisliCarklardaTemasYorulmasiPittingVeHertzianGerilmesiCalculator162InputSchema, type DisliCarklardaTemasYorulmasiPittingVeHertzianGerilmesiCalculator162Input } from "./disli-carklarda-temas-yorulmasi-pitting-ve-hertzian-gerilmesi-calculator-162-validation";

export const calculateDisliCarklardaTemasYorulmasiPittingVeHertzianGerilmesiCalculator162Contract: any = {
  id: "disli-carklarda-temas-yorulmasi-pitting-ve-hertzian-gerilmesi-calculator-162",
  version: "1.0.0",
  category: "cost",
  inputSchema: DisliCarklardaTemasYorulmasiPittingVeHertzianGerilmesiCalculator162InputSchema,
  
  execute: async (input: DisliCarklardaTemasYorulmasiPittingVeHertzianGerilmesiCalculator162Input) => {
    try {
      // Extract input values
      const {
        tangentialLoadN,
        pinionDiaMm,
        faceWidthMm,
        elasticCoefficientZe,
        geometryFactorI,
        overloadFactorKo,
        dynamicFactorKv,
        allowableContactStress
      } = input;

      // Validate inputs to avoid division by zero or NaN
      if (!pinionDiaMm || !faceWidthMm || !geometryFactorI || pinionDiaMm <= 0 || faceWidthMm <= 0 || geometryFactorI <= 0) {
        throw new Error("Invalid input: pinionDiaMm, faceWidthMm, and geometryFactorI must be positive numbers.");
      }

      // Convert pinion diameter from mm to meters for stress calculation
      const pinionDiaM = pinionDiaMm / 1000;
      const faceWidthM = faceWidthMm / 1000;

      // Calculate Hertzian Stress (Sc) using the formula:
      // Sc = Ze * sqrt((Wt * Ko * Kv) / (d * b * I))
      // where:
      //   Wt = tangentialLoadN (N)
      //   Ko = overloadFactorKo (-)
      //   Kv = dynamicFactorKv (-)
      //   d = pinionDiaM (m) - pitch circle diameter
      //   b = faceWidthM (m) - face width
      //   I = geometryFactorI (-)
      //   Ze = elasticCoefficientZe (MPa^0.5)
      const numerator = tangentialLoadN * overloadFactorKo * dynamicFactorKv;
      const denominator = pinionDiaM * faceWidthM * geometryFactorI;
      
      // Ensure denominator is positive to avoid complex numbers
      if (denominator <= 0) {
        throw new Error("Denominator in stress calculation must be positive.");
      }

      const hertzianStressSc = elasticCoefficientZe * Math.sqrt(numerator / denominator);

      // Calculate Contact Safety Factor
      // Safety Factor = allowableContactStress / hertzianStressSc
      if (hertzianStressSc <= 0) {
        throw new Error("Hertzian stress is zero or negative, cannot calculate safety factor.");
      }
      const contactSafetyFactor = allowableContactStress / hertzianStressSc;

      // Return calculated values with appropriate rounding for engineering precision
      return {
        hertzianStressSc: Math.round(hertzianStressSc * 100) / 100,
        contactSafetyFactor: Math.round(contactSafetyFactor * 100) / 100
      };
    } catch (error) {
      throw new Error("Failed to calculate: " + String(error));
    }
  },
};