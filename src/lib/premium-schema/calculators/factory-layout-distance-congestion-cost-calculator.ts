import { FabrikaYerlesimMesafeVeTikaniklikMaliyetiCalculator36InputSchema, type FabrikaYerlesimMesafeVeTikaniklikMaliyetiCalculator36Input } from "./fabrika-yerlesim-mesafe-ve-tikaniklik-maliyeti-calculator-36-validation";

export const calculateFabrikaYerlesimMesafeVeTikaniklikMaliyetiCalculator36Contract: any = {
  id: "fabrika-yerlesim-mesafe-ve-tikaniklik-maliyeti-calculator-36",
  version: "1.0.0",
  category: "cost",
  inputSchema: FabrikaYerlesimMesafeVeTikaniklikMaliyetiCalculator36InputSchema,
  
  execute: async (input: any) => {
    try {
      const {
        totalFlowVolume,
        avgDistanceM,
        unitMoveCost,
        crossFlowVolume,
        aisleCapacity
      } = input;

      // Validate inputs are positive numbers
      const validTotalFlowVolume = Math.max(0, Number(totalFlowVolume) || 0);
      const validAvgDistanceM = Math.max(0, Number(avgDistanceM) || 0);
      const validUnitMoveCost = Math.max(0, Number(unitMoveCost) || 0);
      const validCrossFlowVolume = Math.max(0, Number(crossFlowVolume) || 0);
      const validAisleCapacity = Math.max(0, Number(aisleCapacity) || 0);

      // Formula: Base_Handling_Cost = total_flow_volume * avg_distance_m * unit_move_cost
      const baseHandlingCost = validTotalFlowVolume * validAvgDistanceM * validUnitMoveCost;

      // Formula: Congestion_Factor = 1 + (cross_flow_volume / MAX(1, (aisle_capacity - cross_flow_volume)))
      const adjustedCapacity = Math.max(1, validAisleCapacity - validCrossFlowVolume);
      const congestionFactor = validCrossFlowVolume > 0 
        ? 1 + (validCrossFlowVolume / adjustedCapacity)
        : 1;

      // Formula: Total_Material_Handling_Cost = Base_Handling_Cost * Congestion_Factor
      const totalMaterialHandlingCost = baseHandlingCost * congestionFactor;

      // Formula: Congestion_Penalty_Cost = Total_Material_Handling_Cost - Base_Handling_Cost
      const congestionPenaltyCost = totalMaterialHandlingCost - baseHandlingCost;

      // Formula: Aisle_Utilization = (cross_flow_volume / aisle_capacity) * 100
      const aisleUtilization = validAisleCapacity > 0 
        ? (validCrossFlowVolume / validAisleCapacity) * 100
        : 0;

      return {
        baseHandlingCost: Math.round(baseHandlingCost * 100) / 100,
        congestionFactor: Math.round(congestionFactor * 100) / 100,
        totalMaterialHandlingCost: Math.round(totalMaterialHandlingCost * 100) / 100,
        congestionPenaltyCost: Math.round(congestionPenaltyCost * 100) / 100,
        aisleUtilization: Math.round(aisleUtilization * 100) / 100
      };
    } catch (error) {
      throw new Error("Failed to calculate: " + String(error));
    }
  },
};