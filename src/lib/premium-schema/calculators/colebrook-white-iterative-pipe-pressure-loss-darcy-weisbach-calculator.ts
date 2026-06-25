import { ColebrookwhiteIteratifBoruBasincKaybiDarcyweisbachCalculator130InputSchema, type ColebrookwhiteIteratifBoruBasincKaybiDarcyweisbachCalculator130Input } from "./colebrookwhite-iteratif-boru-basinc-kaybi-darcyweisbach-calculator-130-validation";

export const calculateColebrookwhiteIteratifBoruBasincKaybiDarcyweisbachCalculator130Contract: any = {
  id: "colebrookwhite-iteratif-boru-basinc-kaybi-darcyweisbach-calculator-130",
  version: "1.0.0",
  category: "cost",
  inputSchema: ColebrookwhiteIteratifBoruBasincKaybiDarcyweisbachCalculator130InputSchema,
  
  execute: async (input: any) => {
    try {
      const flowRate = input.flowRate;
      const pipeDia = input.pipeDia;
      const pipeLen = input.pipeLen;
      const roughnessEpsilon = input.roughnessEpsilon;
      const fluidDensity = input.fluidDensity;
      const dynamicViscosity = input.dynamicViscosity;
      const sumMinorK = input.sumMinorK;
      const pumpEff = input.pumpEff;

      const PI = Math.PI;
      const G = 9.81;
      const STEPS_MAX = 50;
      const TOLERANCE = 1e-8;

      // Cross Area
      const crossArea = (PI / 4) * Math.pow(pipeDia, 2);

      // Velocity V
      const velocityV = flowRate / crossArea;

      // Reynolds Re
      const reynoldsRe = (fluidDensity * velocityV * pipeDia) / dynamicViscosity;

      // Laminar friction factor
      let fLaminar = 0;
      if (reynoldsRe < 2300) {
        fLaminar = 64 / reynoldsRe;
      }

      // Swamee-Jain initial friction factor
      const roughPart = roughnessEpsilon / (3.7 * pipeDia);
      const reynoldsPart = 5.74 / Math.pow(reynoldsRe, 0.9);
      const fSwameeJainInit = 0.25 / Math.pow(Math.log10(roughPart + reynoldsPart), 2);

      // Colebrook-White iterative solver
      let fIterativeCW = fLaminar;
      if (reynoldsRe >= 2300) {
        let fCurrent = fSwameeJainInit;
        for (let i = 0; i < STEPS_MAX; i++) {
          const left = 1 / Math.sqrt(fCurrent);
          const right = -2.0 * Math.log10(
            (roughnessEpsilon / (3.7 * pipeDia)) + 
            (2.51 / (reynoldsRe * Math.sqrt(fCurrent)))
          );
          const fNext = 1 / Math.pow(right, 2);
          if (Math.abs(fNext - fCurrent) < TOLERANCE) {
            fIterativeCW = fNext;
            break;
          }
          fCurrent = fNext;
        }
        if (fIterativeCW === fLaminar) {
          fIterativeCW = fCurrent;
        }
      }

      // Major Loss Head m
      const majorLossHeadM = fIterativeCW * (pipeLen / pipeDia) * (Math.pow(velocityV, 2) / (2 * G));

      // Minor Loss Head m
      const minorLossHeadM = sumMinorK * (Math.pow(velocityV, 2) / (2 * G));

      // Total Head Loss m
      const totalHeadLossM = majorLossHeadM + minorLossHeadM;

      // Pressure Drop Bar
      const pressureDropBar = (fluidDensity * G * totalHeadLossM) / 100000;

      // Required Pump Power kW
      const requiredPumpPowerKW = (flowRate * fluidDensity * G * totalHeadLossM) / (1000 * (pumpEff / 100));

      return {
        crossArea,
        velocityV,
        reynoldsRe,
        fLaminar,
        fSwameeJainInit,
        fIterativeCW,
        majorLossHeadM,
        minorLossHeadM,
        totalHeadLossM,
        pressureDropBar,
        requiredPumpPowerKW
      };
    } catch (error) {
      throw new Error("Failed to calculate: " + String(error));
    }
  },
};