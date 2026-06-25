import { TalasliImalatStratejisiVeOptimumKesmeHiziCalculator62InputSchema, type TalasliImalatStratejisiVeOptimumKesmeHiziCalculator62Input } from "./talasli-imalat-stratejisi-ve-optimum-kesme-hizi-calculator-62-validation";

export const calculateTalasliImalatStratejisiVeOptimumKesmeHiziCalculator62Contract: any = {
  id: "talasli-imalat-stratejisi-ve-optimum-kesme-hizi-calculator-62",
  version: "1.0.0",
  category: "cost",
  inputSchema: TalasliImalatStratejisiVeOptimumKesmeHiziCalculator62InputSchema,
  
  execute: async (input: any) => {
    try {
      const {
        currentVc,
        taylorC,
        taylorN,
        toolChangeTime,
        insertCost,
        edges,
        machineRate
      } = input;

      // Formula: Cost_Per_Edge = insert_cost / edges
      const costPerEdge = edges > 0 ? insertCost / edges : 0;

      // Formula: Machine_Rate_Min = machine_rate / 60
      const machineRateMin = machineRate / 60;

      // Formula: T_opt_MinCost = ((1 / taylor_n) - 1) * (tool_change_time + (Cost_Per_Edge / Machine_Rate_Min))
      const tOptMinCost = taylorN !== 0 && machineRateMin !== 0
        ? ((1 / taylorN) - 1) * (toolChangeTime + (costPerEdge / machineRateMin))
        : 0;

      // Formula: Vc_opt_MinCost = taylor_c / POWER(T_opt_MinCost, taylor_n)
      const vcOptMinCost = tOptMinCost > 0 && taylorN !== 0
        ? taylorC / Math.pow(tOptMinCost, taylorN)
        : 0;

      // Formula: T_opt_MaxProd = ((1 / taylor_n) - 1) * tool_change_time
      const tOptMaxProd = taylorN !== 0
        ? ((1 / taylorN) - 1) * toolChangeTime
        : 0;

      // Formula: Vc_opt_MaxProd = taylor_c / POWER(T_opt_MaxProd, taylor_n)
      const vcOptMaxProd = tOptMaxProd > 0 && taylorN !== 0
        ? taylorC / Math.pow(tOptMaxProd, taylorN)
        : 0;

      // Formula: Current_Tool_Life = POWER(taylor_c / current_vc, 1 / taylor_n)
      const currentToolLife = currentVc !== 0 && taylorN !== 0
        ? Math.pow(taylorC / currentVc, 1 / taylorN)
        : 0;

      return {
        costPerEdge,
        machineRateMin,
        tOptMinCost,
        vcOptMinCost,
        tOptMaxProd,
        vcOptMaxProd,
        currentToolLife
      };
    } catch (error) {
      throw new Error("Failed to calculate: " + String(error));
    }
  },
};