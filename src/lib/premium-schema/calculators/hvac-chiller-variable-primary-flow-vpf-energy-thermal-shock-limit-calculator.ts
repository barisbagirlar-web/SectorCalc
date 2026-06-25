import { HvacChillerDegiskenBirincilAkisVpfEnerjiVeTermalSokSiniriCalculator185InputSchema, type HvacChillerDegiskenBirincilAkisVpfEnerjiVeTermalSokSiniriCalculator185Input } from "./hvac-chiller-degisken-birincil-akis-vpf-enerji-ve-termal-sok-siniri-calculator-185-validation";

export const calculateHvacChillerDegiskenBirincilAkisVpfEnerjiVeTermalSokSiniriCalculator185Contract: any = {
  id: "hvac-chiller-degisken-birincil-akis-vpf-enerji-ve-termal-sok-siniri-calculator-185",
  version: "1.0.0",
  category: "cost",
  inputSchema: HvacChillerDegiskenBirincilAkisVpfEnerjiVeTermalSokSiniriCalculator185InputSchema,
  
  execute: async (input: any) => {
    try {
      const {
        minFlowGpm,
        maxFlowGpm,
        currentFlowGpm,
        flowChangeRatePct,
        evapVolumeLiters,
        pumpPowerKw
      } = input;

      // Flow Safety Margin Low = current_flow_gpm - min_flow_gpm
      const flowSafetyMarginLow = currentFlowGpm - minFlowGpm;

      // Flow Safety Margin High = max_flow_gpm - current_flow_gpm
      const flowSafetyMarginHigh = maxFlowGpm - currentFlowGpm;

      // V Velocity Factor = current_flow_gpm / max_flow_gpm
      // Ensure we don't divide by zero
      const vVelocityFactor = maxFlowGpm !== 0 ? currentFlowGpm / maxFlowGpm : 0;

      // Pump Energy Savings Pct = (1 - (current_flow_gpm / max_flow_gpm)^3) * 100
      const pumpEnergySavingsPct = maxFlowGpm !== 0 
        ? (1 - Math.pow(currentFlowGpm / maxFlowGpm, 3)) * 100 
        : 0;

      return {
        flowSafetyMarginLow: Math.round(flowSafetyMarginLow * 100) / 100,
        flowSafetyMarginHigh: Math.round(flowSafetyMarginHigh * 100) / 100,
        vVelocityFactor: Math.round(vVelocityFactor * 10000) / 10000,
        pumpEnergySavingsPct: Math.round(pumpEnergySavingsPct * 100) / 100
      };
    } catch (error) {
      throw new Error("Failed to calculate: " + String(error));
    }
  },
};