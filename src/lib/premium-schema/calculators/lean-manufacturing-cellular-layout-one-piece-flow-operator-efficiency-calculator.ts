import { YalinUretimHucreselDuzenOnepieceFlowVeOperatorVerimiCalculator186InputSchema, type YalinUretimHucreselDuzenOnepieceFlowVeOperatorVerimiCalculator186Input } from "./yalin-uretim-hucresel-duzen-onepiece-flow-ve-operator-verimi-calculator-186-validation";

export const calculateYalinUretimHucreselDuzenOnepieceFlowVeOperatorVerimiCalculator186Contract: any = {
  id: "yalin-uretim-hucresel-duzen-onepiece-flow-ve-operator-verimi-calculator-186",
  version: "1.0.0",
  category: "cost",
  inputSchema: YalinUretimHucreselDuzenOnepieceFlowVeOperatorVerimiCalculator186InputSchema,
  
  execute: async (input: any) => {
    try {
      const manualTimeSec = Number(input.manualTimeSec) || 0;
      const walkingTimeSec = Number(input.walkingTimeSec) || 0;
      const taktTimeSec = Number(input.taktTimeSec) || 1;
      const operatorsCount = Number(input.operatorsCount) || 1;

      const totalCellCycleTime = manualTimeSec + walkingTimeSec;
      const theoreticalOperatorsReq = totalCellCycleTime / taktTimeSec;
      const cellBalancingEfficiency = (manualTimeSec / (operatorsCount * taktTimeSec)) * 100;
      const laborWasteHoursDaily = ((operatorsCount * taktTimeSec) - manualTimeSec) * 480 / 3600;

      return {
        totalCellCycleTime: totalCellCycleTime,
        theoreticalOperatorsReq: theoreticalOperatorsReq,
        cellBalancingEfficiency: cellBalancingEfficiency,
        laborWasteHoursDaily: laborWasteHoursDaily
      };
    } catch (error) {
      throw new Error("Failed to calculate: " + String(error));
    }
  },
};