import { GdtGercekKonumTruePositionVeMmcBonusToleransCalculator141InputSchema, type GdtGercekKonumTruePositionVeMmcBonusToleransCalculator141Input } from "./gdt-gercek-konum-true-position-ve-mmc-bonus-tolerans-calculator-141-validation";

export const calculateGdtGercekKonumTruePositionVeMmcBonusToleransCalculator141Contract: any = {
  id: "gdt-gercek-konum-true-position-ve-mmc-bonus-tolerans-calculator-141",
  version: "1.0.0",
  category: "cost",
  inputSchema: GdtGercekKonumTruePositionVeMmcBonusToleransCalculator141InputSchema,
  
  execute: async (input: any) => {
    try {
      // Parse input values
      const nomX = Number(input.nomX) || 0;
      const nomY = Number(input.nomY) || 0;
      const measX = Number(input.measX) || 0;
      const measY = Number(input.measY) || 0;
      const featureMmc = Number(input.featureMmc) || 0;
      const measDiameter = Number(input.measDiameter) || 0;
      const posTolerance = Number(input.posTolerance) || 0;

      // Formula: Dev_X = meas_x - nom_x
      const devX = measX - nomX;

      // Formula: Dev_Y = meas_y - nom_y
      const devY = measY - nomY;

      // Formula: Actual_True_Position = 2 * SQRT(POWER(Dev_X, 2) + POWER(Dev_Y, 2))
      const actualTruePosition = 2 * Math.sqrt(Math.pow(devX, 2) + Math.pow(devY, 2));

      // Formula: Bonus_Tolerance = IF(is_hole == 'Delik', MAX(0, meas_diameter - feature_mmc), MAX(0, feature_mmc - meas_diameter))
      // For this calculator, we assume it's a hole (Delik) as default behavior
      const bonusTolerance = Math.max(0, measDiameter - featureMmc);

      // Formula: Total_Allowable_Tolerance = pos_tolerance + Bonus_Tolerance
      const totalAllowableTolerance = posTolerance + bonusTolerance;

      // Formula: Position_Deviation_Gap = Total_Allowable_Tolerance - Actual_True_Position
      const positionDeviationGap = totalAllowableTolerance - actualTruePosition;

      // Formula: Pass_Fail_Status = IF(Actual_True_Position <= Total_Allowable_Tolerance, 'KABUL (PASS)', 'RET (FAIL)')
      const passFailStatus = actualTruePosition <= totalAllowableTolerance ? 1 : 0;

      return {
        devX,
        devY,
        actualTruePosition,
        bonusTolerance,
        totalAllowableTolerance,
        positionDeviationGap,
        passFailStatus
      };
    } catch (error) {
      throw new Error("Failed to calculate: " + String(error));
    }
  },
};