import { TalasliImalatKesmeDinamikleriVeSpindleGucuCalculator41InputSchema } from "./talasli-imalat-kesme-dinamikleri-ve-spindle-gucu-calculator-41-validation";

export const calculateTalasliImalatKesmeDinamikleriVeSpindleGucuCalculator41Contract: any = {
  id: "talasli-imalat-kesme-dinamikleri-ve-spindle-gucu-calculator-41",
  version: "1.0.0",
  category: "cost",
  inputSchema: TalasliImalatKesmeDinamikleriVeSpindleGucuCalculator41InputSchema,
  
  execute: async (input: any) => {
    try {
      const {
        toolDia,
        flutes,
        vc,
        fz,
        ap,
        ae,
        kc1,
        mc,
        spindleEff,
        maxSpindleKw
      } = input;

      // n_rpm = (1000 * vc) / (PI * tool_dia)
      const nRpm = (1000 * vc) / (Math.PI * toolDia);

      // Vf_feed = fz * flutes * n_rpm
      const vfFeed = fz * flutes * nRpm;

      // h_m = fz * SQRT(ae / tool_dia) - using Math.sqrt
      const hM = fz * Math.sqrt(ae / toolDia);

      // kc_actual = kc1 / POWER(h_m, mc)
      const kcActual = kc1 / Math.pow(hM, mc);

      // Fc_tangential = kc_actual * ap * fz * (ae / tool_dia) * flutes
      const fcTangential = kcActual * ap * fz * (ae / toolDia) * flutes;

      // Tc_torque = (Fc_tangential * tool_dia) / 2000
      const tcTorque = (fcTangential * toolDia) / 2000;

      // Pc_net = (Fc_tangential * vc) / 60000
      const pcNet = (fcTangential * vc) / 60000;

      // P_motor_req = Pc_net / (spindle_eff / 100)
      const pMotorReq = pcNet / (spindleEff / 100);

      // MRR = (ap * ae * Vf_feed) / 1000
      const mRR = (ap * ae * vfFeed) / 1000;

      // Ra_theoretical = (POWER(fz, 2) * 1000) / (8 * (tool_dia / 2))
      const raTheoretical = (Math.pow(fz, 2) * 1000) / (8 * (toolDia / 2));

      return {
        nRpm: Number(nRpm.toFixed(2)),
        vfFeed: Number(vfFeed.toFixed(2)),
        hM: Number(hM.toFixed(4)),
        kcActual: Number(kcActual.toFixed(2)),
        fcTangential: Number(fcTangential.toFixed(2)),
        tcTorque: Number(tcTorque.toFixed(2)),
        pcNet: Number(pcNet.toFixed(2)),
        pMotorReq: Number(pMotorReq.toFixed(2)),
        mRR: Number(mRR.toFixed(2)),
        raTheoretical: Number(raTheoretical.toFixed(4))
      };
    } catch (error) {
      throw new Error("Failed to calculate: " + String(error));
    }
  },
};