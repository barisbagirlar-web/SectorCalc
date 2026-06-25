import { PadMediaPsikrometrikVeBasincDusumuAnalysisCalculator44InputSchema, type PadMediaPsikrometrikVeBasincDusumuAnalysisCalculator44Input } from "./pad-media-psikrometrik-ve-basinc-dusumu-analysis-calculator-44-validation";

export const calculatePadMediaPsikrometrikVeBasincDusumuAnalysisCalculator44Contract: any = {
  id: "pad-media-psikrometrik-ve-basinc-dusumu-analysis-calculator-44",
  version: "1.0.0",
  category: "cost",
  inputSchema: PadMediaPsikrometrikVeBasincDusumuAnalysisCalculator44InputSchema,
  
  execute: async (input: any) => {
    try {
      const { padThickness, airVelocity, padArea, tDb, rhIn, pAtm } = input;

      // Convert inputs to numbers
      const padThicknessNum = Number(padThickness);
      const airVelocityNum = Number(airVelocity);
      const padAreaNum = Number(padArea);
      const tDbNum = Number(tDb);
      const rhInNum = Number(rhIn);
      const pAtmNum = Number(pAtm);

      // Formula: Pws_in = 6.112 * EXP((17.67 * t_db) / (t_db + 243.5))
      const pwsIn = 6.112 * Math.exp((17.67 * tDbNum) / (tDbNum + 243.5));

      // Formula: Pv_in = Pws_in * (rh_in / 100)
      const pvIn = pwsIn * (rhInNum / 100);

      // Formula: W_in = 0.622 * (Pv_in / (p_atm - Pv_in))
      const wIn = 0.622 * (pvIn / (pAtmNum - pvIn));

      // Formula: T_wb_approx = t_db * ATAN(0.151977 * SQRT(rh_in + 8.313659)) + ATAN(t_db + rh_in) - ATAN(rh_in - 1.676331) + 0.00391838 * POWER(rh_in, 1.5) * ATAN(0.023101 * rh_in) - 4.686035
      const tWbApprox = 
        tDbNum * Math.atan(0.151977 * Math.sqrt(rhInNum + 8.313659)) + 
        Math.atan(tDbNum + rhInNum) - 
        Math.atan(rhInNum - 1.676331) + 
        0.00391838 * Math.pow(rhInNum, 1.5) * Math.atan(0.023101 * rhInNum) - 
        4.686035;

      // Formula: Eff_Sat = (95 - (air_velocity * 10)) * (pad_thickness / 150)
      const effSat = (95 - (airVelocityNum * 10)) * (padThicknessNum / 150);

      // Formula: T_out_db = t_db - (Eff_Sat / 100) * (t_db - T_wb_approx)
      const tOutDb = tDbNum - (effSat / 100) * (tDbNum - tWbApprox);

      // Formula: Delta_T = t_db - T_out_db
      const deltaT = tDbNum - tOutDb;

      // Formula: Pws_out = 6.112 * EXP((17.67 * T_out_db) / (T_out_db + 243.5))
      const pwsOut = 6.112 * Math.exp((17.67 * tOutDb) / (tOutDb + 243.5));

      // Formula: Q_air = air_velocity * pad_area * 3600
      const qAir = airVelocityNum * padAreaNum * 3600;

      // Formula: CoolingCapacity_kW = Q_air * 1.2 * 1.006 * Delta_T / 3600
      const coolingCapacityKW = qAir * 1.2 * 1.006 * deltaT / 3600;

      // Formula: PressureDrop_Pa = (air_velocity * 15) * (pad_thickness / 100)
      const pressureDropPa = (airVelocityNum * 15) * (padThicknessNum / 100);

      return {
        pwsIn: Math.round(pwsIn * 100) / 100,
        pvIn: Math.round(pvIn * 100) / 100,
        wIn: Math.round(wIn * 100000) / 100000,
        tWbApprox: Math.round(tWbApprox * 100) / 100,
        effSat: Math.round(effSat * 100) / 100,
        tOutDb: Math.round(tOutDb * 100) / 100,
        deltaT: Math.round(deltaT * 100) / 100,
        pwsOut: Math.round(pwsOut * 100) / 100,
        qAir: Math.round(qAir * 100) / 100,
        coolingCapacityKW: Math.round(coolingCapacityKW * 100) / 100,
        pressureDropPa: Math.round(pressureDropPa * 100) / 100
      };
    } catch (error) {
      throw new Error("Failed to calculate: " + String(error));
    }
  },
};