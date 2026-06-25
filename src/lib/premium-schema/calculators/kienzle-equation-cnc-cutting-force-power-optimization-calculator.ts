import { KienzleDenklemiIleCncKesmeKuvvetiVeGucOptimizasyonuCalculator179InputSchema, type KienzleDenklemiIleCncKesmeKuvvetiVeGucOptimizasyonuCalculator179Input } from "./kienzle-denklemi-ile-cnc-kesme-kuvveti-ve-guc-optimizasyonu-calculator-179-validation";

export const calculateKienzleDenklemiIleCncKesmeKuvvetiVeGucOptimizasyonuCalculator179Contract: any = {
  id: "kienzle-denklemi-ile-cnc-kesme-kuvveti-ve-guc-optimizasyonu-calculator-179",
  version: "1.0.0",
  category: "cost",
  inputSchema: KienzleDenklemiIleCncKesmeKuvvetiVeGucOptimizasyonuCalculator179InputSchema,
  
  execute: async (input: any) => {
    try {
      // Destructure input with the correct field names from the schema
      const {
        feedF,
        depthAp,
        kc11Force,
        mcExponent,
        cuttingSpeedVc,
        efficiencyEta,
        spindlePowerLimit
      } = input as KienzleDenklemiIleCncKesmeKuvvetiVeGucOptimizasyonuCalculator179Input;

      // Validate inputs are positive numbers
      if (feedF <= 0 || depthAp <= 0 || kc11Force <= 0 || mcExponent <= 0 || 
          cuttingSpeedVc <= 0 || efficiencyEta <= 0 || spindlePowerLimit <= 0) {
        throw new Error("All input values must be positive numbers.");
      }

      // Kienzle Equation calculations
      // 1. Chip Thickness (h) = feed per tooth (f)
      const chipThicknessH = feedF;

      // 2. Actual specific cutting force: Kc = kc1.1 / h^mc
      const kcActual = kc11Force / Math.pow(chipThicknessH, mcExponent);

      // 3. Tangential cutting force: Fc = Kc * ap * f
      const tangentialForceFc = kcActual * depthAp * feedF;

      // 4. Net cutting power: Pc = (Fc * Vc) / 60000 (Vc in m/min, Fc in N -> kW)
      const netCuttingPowerPc = (tangentialForceFc * cuttingSpeedVc) / 60000;

      // 5. Gross power required: Pgross = Pc / η (η as decimal)
      const efficiencyDecimal = efficiencyEta / 100;
      const grossPowerRequired = netCuttingPowerPc / efficiencyDecimal;

      // Round results to 2 decimal places for cleaner output
      const roundedChipThicknessH = Math.round(chipThicknessH * 100) / 100;
      const roundedKcActual = Math.round(kcActual * 100) / 100;
      const roundedTangentialForceFc = Math.round(tangentialForceFc * 100) / 100;
      const roundedNetCuttingPowerPc = Math.round(netCuttingPowerPc * 100) / 100;
      const roundedGrossPowerRequired = Math.round(grossPowerRequired * 100) / 100;

      return {
        chipThicknessH: roundedChipThicknessH,
        kcActual: roundedKcActual,
        tangentialForceFc: roundedTangentialForceFc,
        netCuttingPowerPc: roundedNetCuttingPowerPc,
        grossPowerRequired: roundedGrossPowerRequired
      };
    } catch (error) {
      throw new Error("Failed to calculate: " + String(error));
    }
  },
};