import { BuharKapaniSteamTrapTermodinamikLossAnalysisCalculator92InputSchema, type BuharKapaniSteamTrapTermodinamikLossAnalysisCalculator92Input } from "./buhar-kapani-steam-trap-termodinamik-loss-analysis-calculator-92-validation";

export const calculateBuharKapaniSteamTrapTermodinamikLossAnalysisCalculator92Contract: any = {
  id: "buhar-kapani-steam-trap-termodinamik-loss-analysis-calculator-92",
  version: "1.0.0",
  category: "cost",
  inputSchema: BuharKapaniSteamTrapTermodinamikLossAnalysisCalculator92InputSchema,
  
  execute: async (input: any) => {
    try {
      // Validate and parse input
      const validatedInput = BuharKapaniSteamTrapTermodinamikLossAnalysisCalculator92InputSchema.parse(input);
      
      // Extract inputs
      const orificeD = validatedInput.orificeD; // mm
      const lineP = validatedInput.lineP; // Bar absolute
      const backP = validatedInput.backP; // Bar
      const cd = validatedInput.cd; // Discharge coefficient (0.65-0.70)
      const steamEnthalpy = validatedInput.steamEnthalpy; // kJ/kg
      const opHours = validatedInput.opHours; // hours/year
      const steamCost = validatedInput.steamCost; // USD/Ton

      // Formula: Orifice_Area_m2 = (PI / 4) * POWER(orifice_d / 1000, 2)
      const orificeDMeters = orificeD / 1000;
      const orificeAreaM2 = (Math.PI / 4) * Math.pow(orificeDMeters, 2);

      // Formula: Pressure_Ratio = back_p / line_p
      const pressureRatio = lineP !== 0 ? backP / lineP : 0;

      // Formula: Napier_Choked_Flow_kg_s = cd * Orifice_Area_m2 * (line_p * 100000) * 0.000192
      // Using Napier's equation for choked flow through an orifice
      // Typical constant for steam: 0.000192 converts pressure in Pa and area to flow rate
      const linePPa = lineP * 100000; // Convert Bar to Pascals
      const napierChokedFlowKgS = cd * orificeAreaM2 * linePPa * 0.000192;

      // Formula: Subsonic_Correction = SQRT(1 - POWER((Pressure_Ratio - 0.542) / (1 - 0.542), 2))
      // 0.542 is the critical pressure ratio for steam (approximately)
      const criticalPressureRatio = 0.542;
      let subsonicCorrection = 0;
      if (pressureRatio > criticalPressureRatio && pressureRatio < 1) {
        const correctionFactor = (pressureRatio - criticalPressureRatio) / (1 - criticalPressureRatio);
        subsonicCorrection = Math.sqrt(1 - Math.pow(correctionFactor, 2));
      } else if (pressureRatio >= 1) {
        subsonicCorrection = 0; // No flow if back pressure >= line pressure
      } else {
        subsonicCorrection = 1; // Choked flow condition
      }

      // Formula: Actual_Leak_Flow_kg_s = IF(Pressure_Ratio <= 0.542, Napier_Choked_Flow_kg_s, Napier_Choked_Flow_kg_s * Subsonic_Correction)
      const actualLeakFlowKgS = pressureRatio <= criticalPressureRatio 
        ? napierChokedFlowKgS 
        : napierChokedFlowKgS * subsonicCorrection;

      // Formula: Annual_Steam_Loss_Ton = (Actual_Leak_Flow_kg_s * 3600 * op_hours) / 1000
      const annualSteamLossTon = (actualLeakFlowKgS * 3600 * opHours) / 1000;

      // Formula: Annual_Financial_Loss = Annual_Steam_Loss_Ton * steam_cost
      const annualFinancialLoss = annualSteamLossTon * steamCost;

      // Formula: Energy_Waste_GJ = Annual_Steam_Loss_Ton * steam_enthalpy / 1000
      const energyWasteGJ = (annualSteamLossTon * steamEnthalpy) / 1000;

      return {
        orificeAreaM2,
        pressureRatio,
        napierChokedFlowKgS,
        subsonicCorrection,
        actualLeakFlowKgS,
        annualSteamLossTon,
        annualFinancialLoss,
        energyWasteGJ
      };
    } catch (error) {
      throw new Error("Failed to calculate: " + String(error));
    }
  },
};