import { HsmTalasInceltmeChipThinningVeIlerlemeKompanzasyonuCalculator139InputSchema, type HsmTalasInceltmeChipThinningVeIlerlemeKompanzasyonuCalculator139Input } from "./hsm-talas-inceltme-chip-thinning-ve-ilerleme-kompanzasyonu-calculator-139-validation";

export const calculateHsmTalasInceltmeChipThinningVeIlerlemeKompanzasyonuCalculator139Contract: any = {
  id: "hsm-talas-inceltme-chip-thinning-ve-ilerleme-kompanzasyonu-calculator-139",
  version: "1.0.0",
  category: "cost",
  inputSchema: HsmTalasInceltmeChipThinningVeIlerlemeKompanzasyonuCalculator139InputSchema,
  
  execute: async (input: any) => {
    try {
      const { toolDia, radialDoc, baseFz, flutes, spindleRpm } = input;

      // Formula: Ratio_ae_Dc = radial_doc / tool_dia
      const ratioAeDc = radialDoc / toolDia;

      // Formula: Chip_Thinning_Factor = IF(radial_doc < (tool_dia / 2), SQRT(tool_dia / radial_doc), 1.0)
      const chipThinningFactor = radialDoc < (toolDia / 2) ? Math.sqrt(toolDia / radialDoc) : 1.0;

      // Formula: Compensated_fz = base_fz * Chip_Thinning_Factor
      const compensatedFz = baseFz * chipThinningFactor;

      // Formula: Actual_Max_Chip_Thickness_hex = IF(radial_doc < (tool_dia / 2), Compensated_fz * SQRT(radial_doc / tool_dia), Compensated_fz)
      const actualMaxChipThicknessHex = radialDoc < (toolDia / 2) ? compensatedFz * Math.sqrt(radialDoc / toolDia) : compensatedFz;

      // Formula: Base_FeedRate_Vf0 = base_fz * flutes * spindle_rpm
      const baseFeedRateVf0 = baseFz * flutes * spindleRpm;

      // Formula: Compensated_FeedRate_Vfc = Compensated_fz * flutes * spindle_rpm
      const compensatedFeedRateVfc = compensatedFz * flutes * spindleRpm;

      // Formula: Productivity_Gain_Pct = ((Compensated_FeedRate_Vfc / Base_FeedRate_Vf0) - 1) * 100
      const productivityGainPct = ((compensatedFeedRateVfc / baseFeedRateVf0) - 1) * 100;

      return {
        ratioAeDc,
        chipThinningFactor,
        compensatedFz,
        actualMaxChipThicknessHex,
        baseFeedRateVf0,
        compensatedFeedRateVfc,
        productivityGainPct
      };
    } catch (error) {
      throw new Error("Failed to calculate: " + String(error));
    }
  },
};