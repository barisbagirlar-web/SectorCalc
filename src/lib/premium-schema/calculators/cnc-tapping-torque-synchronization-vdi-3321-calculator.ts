import { CncKilavuzCekmeTappingTorkuVeSenkronizasyonVdi3321Calculator113InputSchema, type CncKilavuzCekmeTappingTorkuVeSenkronizasyonVdi3321Calculator113Input } from "./cnc-kilavuz-cekme-tapping-torku-ve-senkronizasyon-vdi-3321-calculator-113-validation";

export const calculateCncKilavuzCekmeTappingTorkuVeSenkronizasyonVdi3321Calculator113Contract: any = {
  id: "cnc-kilavuz-cekme-tapping-torku-ve-senkronizasyon-vdi-3321-calculator-113",
  version: "1.0.0",
  category: "cost",
  inputSchema: CncKilavuzCekmeTappingTorkuVeSenkronizasyonVdi3321Calculator113InputSchema,
  
  execute: async (input: any) => {
    try {
      // Parse validated inputs
      const tapDia = Number(input.tapDia);
      const pitch = Number(input.pitch);
      const kc = Number(input.kc);
      const rpm = Number(input.rpm);
      const chuckTorqueLimit = Number(input.chuckTorqueLimit);

      // Validate inputs to prevent NaN or Infinity
      if (isNaN(tapDia) || isNaN(pitch) || isNaN(kc) || isNaN(rpm) || isNaN(chuckTorqueLimit)) {
        throw new Error("All inputs must be valid numbers");
      }

      // Formula: Torque_Nm = (kc * pitch^2 * tap_dia) / 4000
      // This is a standard tapping torque formula based on VDI 3321 guidelines
      const torqueNm = (kc * Math.pow(pitch, 2) * tapDia) / 4000;

      // Formula: Torque_Peak = For blind holes, torque can spike ~30% due to chip evacuation
      // Since input doesn't specify hole type, we assume blind hole (more conservative)
      const torquePeak = torqueNm * 1.3;

      // Formula: Spindle_Power_kW = (Torque_Peak * rpm) / 9550
      // 9550 is conversion constant (60 * 1000 / (2 * PI))
      const spindlePowerKW = (torquePeak * rpm) / 9550;

      // Formula: Feed_Rate_mm_min = rpm * pitch
      // For tapping, feed is exactly one pitch per revolution
      const feedRateMmMin = rpm * pitch;

      // Formula: Utilization_Pct = (Torque_Peak / chuck_torque_limit) * 100
      // Percentage of chuck torque limit being used
      if (chuckTorqueLimit <= 0) {
        throw new Error("Chuck torque limit must be greater than zero");
      }
      const utilizationPct = (torquePeak / chuckTorqueLimit) * 100;

      // Round outputs to 2 decimal places for readability
      return {
        torqueNm: Math.round(torqueNm * 100) / 100,
        torquePeak: Math.round(torquePeak * 100) / 100,
        spindlePowerKW: Math.round(spindlePowerKW * 100) / 100,
        feedRateMmMin: Math.round(feedRateMmMin * 100) / 100,
        utilizationPct: Math.round(utilizationPct * 100) / 100
      };
    } catch (error) {
      throw new Error("Failed to calculate: " + String(error));
    }
  },
};