import { HidrolikSilindirTonajHizVeMotorGucuCalculator39InputSchema, type HidrolikSilindirTonajHizVeMotorGucuCalculator39Input } from "./hidrolik-silindir-tonaj-hiz-ve-motor-gucu-calculator-39-validation";

export const calculateHidrolikSilindirTonajHizVeMotorGucuCalculator39Contract: any = {
  id: "hidrolik-silindir-tonaj-hiz-ve-motor-gucu-calculator-39",
  version: "1.0.0",
  category: "cost",
  inputSchema: HidrolikSilindirTonajHizVeMotorGucuCalculator39InputSchema,
  
  execute: async (input: any) => {
    try {
      const {
        boreDia,
        rodDia,
        sysPressure,
        strokeLength,
        cylinderQty,
        pumpFlow,
        volEff,
        mechEff,
        frictionCoeff
      } = input;

      // Convert units and apply formulas
      const boreDiaM = boreDia / 1000;
      const rodDiaM = rodDia / 1000;

      // A_piston = (PI / 4) * bore_dia_m^2
      const aPiston = (Math.PI / 4) * Math.pow(boreDiaM, 2);

      // A_annular = (PI / 4) * (bore_dia_m^2 - rod_dia_m^2)
      const aAnnular = (Math.PI / 4) * (Math.pow(boreDiaM, 2) - Math.pow(rodDiaM, 2));

      // Force_Push_N = sys_pressure * 100000 * A_piston * (1 - friction_coeff)
      const forcePushN = sysPressure * 100000 * aPiston * (1 - frictionCoeff);

      // Force_Push_Ton = Force_Push_N / 9806.65
      const forcePushTon = forcePushN / 9806.65;

      // Force_Pull_N = sys_pressure * 100000 * A_annular * (1 - friction_coeff)
      const forcePullN = sysPressure * 100000 * aAnnular * (1 - frictionCoeff);

      // Force_Pull_Ton = Force_Pull_N / 9806.65
      const forcePullTon = forcePullN / 9806.65;

      // Vel_Extend = (pump_flow * 1000) / (A_piston * 60 * 1000)
      // Simplified: pump_flow L/min -> m^3/s: pump_flow / 1000 / 60
      // Vel = Flow / Area => (pump_flow / 1000 / 60) / A_piston = pump_flow / (A_piston * 60)
      const velExtend = pumpFlow / (aPiston * 60 * 1000) / 1000;
      // Correcting: pump_flow (L/dk) => L/min => m^3/s: pump_flow / 1000 / 60
      // Vel (m/s) = (pump_flow / 1000 / 60) / A_piston = pump_flow / (A_piston * 60 * 1000)
      // Let's use: velExtend = (pumpFlow / 1000) / (aPiston * 60)
      // Actually: 1 L/min = 1/60000 m^3/s
      // So velExtend = (pumpFlow / 60000) / aPiston
      const velExtendCorrected = (pumpFlow / 60000) / aPiston;

      // Vel_Retract = (pump_flow / 60000) / A_annular
      const velRetractCorrected = (pumpFlow / 60000) / aAnnular;

      // CycleTime_s = (stroke_length / vel_extend) + (stroke_length / vel_retract)
      // stroke_length is in mm, convert to m
      const strokeLengthM = strokeLength / 1000;
      const cycleTimeS = (strokeLengthM / velExtendCorrected) + (strokeLengthM / velRetractCorrected);

      // Total_Q = pump_flow * cylinder_qty
      const totalQ = pumpFlow * cylinderQty;

      // HydraulicPower_kW = (Total_Q * sys_pressure) / (600 * (vol_eff / 100) * (mech_eff / 100))
      const hydraulicPowerKW = (totalQ * sysPressure) / (600 * (volEff / 100) * (mechEff / 100));

      // AreaRatio = A_piston / A_annular
      const areaRatio = aAnnular !== 0 ? aPiston / aAnnular : 0;

      return {
        aPiston,
        aAnnular,
        forcePushN,
        forcePushTon,
        forcePullN,
        forcePullTon,
        velExtend: velExtendCorrected,
        velRetract: velRetractCorrected,
        cycleTimeS,
        totalQ,
        hydraulicPowerKW,
        areaRatio
      };
    } catch (error) {
      throw new Error("Failed to calculate: " + String(error));
    }
  },
};