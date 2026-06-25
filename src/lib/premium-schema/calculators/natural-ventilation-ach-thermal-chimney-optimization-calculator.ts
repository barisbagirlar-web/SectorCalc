import { DogalHavalandirmaAchIsilBacaOptimizasyonuCalculator48InputSchema, type DogalHavalandirmaAchIsilBacaOptimizasyonuCalculator48Input } from "./dogal-havalandirma-ach-isil-baca-optimizasyonu-calculator-48-validation";

export const calculateDogalHavalandirmaAchIsilBacaOptimizasyonuCalculator48Contract: any = {
  id: "dogal-havalandirma-ach-isil-baca-optimizasyonu-calculator-48",
  version: "1.0.0",
  category: "cost",
  inputSchema: DogalHavalandirmaAchIsilBacaOptimizasyonuCalculator48InputSchema,
  
  execute: async (input: any) => {
    try {
      const { vol, tIn, tOut, targetAch, cd, deltaH } = input;

      // Formula: Q_required_m3_s = (vol * target_ach) / 3600
      const qRequiredM3S = (vol * targetAch) / 3600;

      // Formula: Delta_T = t_in - t_out
      const deltaT = tIn - tOut;

      // Formula: T_in_K = t_in + 273.15
      const tInK = tIn + 273.15;

      // Standard gravity constant (m/s^2)
      const g = 9.81;

      // Formula: A_vent_required = Q_required_m3_s / (cd * SQRT(2 * 9.81 * delta_h * Delta_T / T_in_K))
      // Note: When deltaT is 0 or negative, the natural ventilation driving force disappears.
      // In such cases, the required vent area approaches infinity (or undefined). 
      // We handle this by setting a very large number or returning 0/Infinity depending on context.
      // For practical purposes, if deltaT <= 0, we set aVentRequired to a very high value to indicate infeasibility.
      let aVentRequired: number;
      if (deltaT <= 0) {
        // Natural ventilation not possible; set to a very large number to represent infeasibility.
        aVentRequired = 1e10;
      } else {
        const denominator = cd * Math.sqrt((2 * g * deltaH * deltaT) / tInK);
        if (denominator === 0) {
          aVentRequired = 1e10; // Infeasible if denominator is zero
        } else {
          aVentRequired = qRequiredM3S / denominator;
        }
      }

      // Formula: A_lower_vent = A_vent_required * 0.55
      const aLowerVent = aVentRequired * 0.55;

      // Formula: A_upper_vent = A_vent_required * 0.45
      const aUpperVent = aVentRequired * 0.45;

      // Formula: Ventilation_Flow_m3_hr = Q_required_m3_s * 3600
      const ventilationFlowM3Hr = qRequiredM3S * 3600;

      return {
        qRequiredM3S,
        deltaT,
        tInK,
        aVentRequired,
        aLowerVent,
        aUpperVent,
        ventilationFlowM3Hr
      };
    } catch (error) {
      throw new Error("Failed to calculate: " + String(error));
    }
  },
};