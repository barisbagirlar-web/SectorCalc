import { DinamikZamanPencereliVehicleAtamaVrptwKapasiteAnalysisCalculator175InputSchema, type DinamikZamanPencereliVehicleAtamaVrptwKapasiteAnalysisCalculator175Input } from "./dinamik-zaman-pencereli-vehicle-atama-vrptw-kapasite-analysis-calculator-175-validation";

export const calculateDinamikZamanPencereliVehicleAtamaVrptwKapasiteAnalysisCalculator175Contract: any = {
  id: "dinamik-zaman-pencereli-vehicle-atama-vrptw-kapasite-analysis-calculator-175",
  version: "1.0.0",
  category: "cost",
  inputSchema: DinamikZamanPencereliVehicleAtamaVrptwKapasiteAnalysisCalculator175InputSchema,
  
  execute: async (input: any) => {
    try {
      // Validate and extract input values
      const {
        totalDemandTon,
        vehicleCapacityTon,
        totalDistanceKm,
        fleetSizeAvailable,
        fixedCostPerVehicle,
        variableCostKm,
        timeWindowPenalty,
        totalDelayMinutes
      } = input as DinamikZamanPencereliVehicleAtamaVrptwKapasiteAnalysisCalculator175Input;

      // Ensure non-zero/positive values for division safety
      const safeVehicleCapacity = Math.max(vehicleCapacityTon, 0.001);
      const safeFleetSize = Math.max(fleetSizeAvailable, 1);

      // Formula: Theoretical_Min_Vehicles = CEILING(total_demand_ton / vehicle_capacity_ton)
      const theoreticalMinVehicles = Math.ceil(totalDemandTon / safeVehicleCapacity);

      // Formula: Fixed_Fleet_Cost = Theoretical_Min_Vehicles * fixed_cost_per_vehicle
      const fixedFleetCost = theoreticalMinVehicles * fixedCostPerVehicle;

      // Formula: Variable_Distance_Cost = total_distance_km * variable_cost_km
      const variableDistanceCost = totalDistanceKm * variableCostKm;

      // Formula: Delay_Penalty_Cost = total_delay_minutes * time_window_penalty
      const delayPenaltyCost = totalDelayMinutes * timeWindowPenalty;

      // Formula: Total_LOG_Cost = Fixed_Fleet_Cost + Variable_Distance_Cost + Delay_Penalty_Cost
      const totalLOGCost = fixedFleetCost + variableDistanceCost + delayPenaltyCost;

      // Formula: Capacity_Utilization_Pct = (total_demand_ton / (Theoretical_Min_Vehicles * vehicle_capacity_ton)) * 100
      const capacityUtilizationPct = (totalDemandTon / (theoreticalMinVehicles * safeVehicleCapacity)) * 100;

      return {
        theoreticalMinVehicles: Math.round(theoreticalMinVehicles),
        fixedFleetCost: Math.round(fixedFleetCost * 100) / 100,
        variableDistanceCost: Math.round(variableDistanceCost * 100) / 100,
        delayPenaltyCost: Math.round(delayPenaltyCost * 100) / 100,
        totalLOGCost: Math.round(totalLOGCost * 100) / 100,
        capacityUtilizationPct: Math.round(capacityUtilizationPct * 100) / 100
      };
    } catch (error) {
      throw new Error("Failed to calculate: " + String(error));
    }
  },
};