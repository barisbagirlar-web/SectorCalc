import { KalibrasyonSapmaVeIso17025DecisionRiskiCalculator13InputSchema, type KalibrasyonSapmaVeIso17025DecisionRiskiCalculator13Input } from "./kalibrasyon-sapma-ve-iso-17025-decision-riski-calculator-13-validation";

export const calculateKalibrasyonSapmaVeIso17025DecisionRiskiCalculator13Contract: any = {
  id: "kalibrasyon-sapma-ve-iso-17025-decision-riski-calculator-13",
  version: "1.0.0",
  category: "cost",
  inputSchema: KalibrasyonSapmaVeIso17025DecisionRiskiCalculator13InputSchema,
  
  execute: async (input: any) => {
    try {
      // Parse inputs with safety checks
      const currentErr = Number(input.currentErr) || 0;
      const prevErr = Number(input.prevErr) || 0;
      const daysBetween = Number(input.daysBetween) || 1;
      const nextInterval = Number(input.nextInterval) || 1;
      const tolerance = Number(input.tolerance) || 0;
      const baseU = Number(input.baseU) || 0;
      const deltaT = Number(input.deltaT) || 0;
      const tempCoeff = Number(input.tempCoeff) || 0;

      // Formula: DriftRate_Daily = ABS(current_err - prev_err) / days_between
      const driftRateDaily = Math.abs(currentErr - prevErr) / daysBetween;

      // Formula: PredictedDrift = DriftRate_Daily * next_interval
      const predictedDrift = driftRateDaily * nextInterval;

      // Formula: U_env = temp_coeff * delta_t
      const uEnv = tempCoeff * deltaT;

      // Formula: U_combined = SQRT(POWER(base_u/2, 2) + POWER(PredictedDrift/SQRT(3), 2) + POWER(U_env/SQRT(3), 2))
      const uCombined = Math.sqrt(
        Math.pow(baseU / 2, 2) +
        Math.pow(predictedDrift / Math.sqrt(3), 2) +
        Math.pow(uEnv / Math.sqrt(3), 2)
      );

      // Formula: U_expanded = U_combined * 2
      const uExpanded = uCombined * 2;

      // Formula: TUR = tolerance / U_expanded
      const tUR = uExpanded !== 0 ? tolerance / uExpanded : 0;

      // Formula: GuardBand = U_expanded
      const guardBand = uExpanded;

      // Formula: AcceptanceLimit = tolerance - GuardBand
      const acceptanceLimit = tolerance - guardBand;

      return {
        driftRateDaily,
        predictedDrift,
        uEnv,
        uCombined,
        uExpanded,
        tUR,
        guardBand,
        acceptanceLimit
      };
    } catch (error) {
      throw new Error("Failed to calculate: " + String(error));
    }
  },
};