import { GrossmannIdealKritikCapDiVeIsilIslemSertlesmeDerinligiCalculator190InputSchema, type GrossmannIdealKritikCapDiVeIsilIslemSertlesmeDerinligiCalculator190Input } from "./grossmann-ideal-kritik-cap-di-ve-isil-islem-sertlesme-derinligi-calculator-190-validation";

export const calculateGrossmannIdealKritikCapDiVeIsilIslemSertlesmeDerinligiCalculator190Contract: any = {
  id: "grossmann-ideal-kritik-cap-di-ve-isil-islem-sertlesme-derinligi-calculator-190",
  version: "1.0.0",
  category: "cost",
  inputSchema: GrossmannIdealKritikCapDiVeIsilIslemSertlesmeDerinligiCalculator190InputSchema,
  
  execute: async (input: any) => {
    try {
      const {
        carbonPct,
        grainSizeAstm,
        manganesePct,
        chromiumPct,
        molybdenumPct,
        nickelPct,
        quenchIntensityH
      } = input;

      // Formula: Di_Base_Inches = SQRT(carbon_pct) * (0.07 * grain_size_astm + 0.40)
      const diBaseInches = Math.sqrt(carbonPct) * (0.07 * grainSizeAstm + 0.40);

      // Formula: Multiplier_Mn = 1 + 3.333 * manganese_pct
      const multiplierMn = 1 + 3.333 * manganesePct;

      // Formula: Multiplier_Cr = 1 + 2.16 * chromium_pct
      const multiplierCr = 1 + 2.16 * chromiumPct;

      // Formula: Multiplier_Mo = 1 + 3.0 * molybdenum_pct
      const multiplierMo = 1 + 3.0 * molybdenumPct;

      // Formula: Multiplier_Ni = 1 + 0.363 * nickel_pct
      const multiplierNi = 1 + 0.363 * nickelPct;

      // Formula: Di_Ideal_Inches = Di_Base_Inches * Multiplier_Mn * Multiplier_Cr * Multiplier_Mo * Multiplier_Ni
      const diIdealInches = diBaseInches * multiplierMn * multiplierCr * multiplierMo * multiplierNi;

      // Formula: Di_Ideal_mm = Di_Ideal_Inches * 25.4
      const diIdealMm = diIdealInches * 25.4;

      // Formula: Critical_Diameter_Dc_mm = Di_Ideal_mm * (POWER(quench_intensity_H, 0.4) / (1 + POWER(quench_intensity_H, 0.4)))
      const quenchPower = Math.pow(quenchIntensityH, 0.4);
      const criticalDiameterDcMm = diIdealMm * (quenchPower / (1 + quenchPower));

      return {
        diBaseInches,
        multiplierMn,
        multiplierCr,
        multiplierMo,
        multiplierNi,
        diIdealInches,
        diIdealMm,
        criticalDiameterDcMm
      };
    } catch (error) {
      throw new Error("Failed to calculate: " + String(error));
    }
  },
};