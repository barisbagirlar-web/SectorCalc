import { LojistikRotaSapmasiDriftVeYakitIsrafiCalculator76InputSchema, type LojistikRotaSapmasiDriftVeYakitIsrafiCalculator76Input } from "./lojistik-rota-sapmasi-drift-ve-yakit-israfi-calculator-76-validation";

export const calculateLojistikRotaSapmasiDriftVeYakitIsrafiCalculator76Contract: any = {
  id: "lojistik-rota-sapmasi-drift-ve-yakit-israfi-calculator-76",
  version: "1.0.0",
  category: "cost",
  inputSchema: LojistikRotaSapmasiDriftVeYakitIsrafiCalculator76InputSchema,
  
  execute: async (input: LojistikRotaSapmasiDriftVeYakitIsrafiCalculator76Input) => {
    try {
      const {
        plannedDist,
        actualDist,
        avgSpeed,
        fuelConsumption,
        fuelPrice,
        idleTimeMins,
        idleFuelRate,
        driverWage,
        missedDrops,
        costPerMissedDrop
      } = input;

      // Route Drift km - how much extra distance was traveled
      const routeDriftKm = Math.max(0, actualDist - plannedDist);
      
      // Fuel Waste Liters - extra fuel used due to route drift
      const fuelWasteLiters = (routeDriftKm / 100) * fuelConsumption;
      
      // Fuel Waste Cost - cost of the extra fuel used
      const fuelWasteCost = fuelWasteLiters * fuelPrice;
      
      // Time Waste Hrs - extra time spent due to route drift
      const timeWasteHrs = avgSpeed > 0 ? routeDriftKm / avgSpeed : 0;
      
      // Driver Waste Cost - cost of extra driver time
      const driverWasteCost = timeWasteHrs * driverWage;
      
      // Idle Fuel Cost - fuel wasted during idle time
      const idleFuelCost = (idleTimeMins / 60) * idleFuelRate * fuelPrice;
      
      // Missed Drop Cost - penalties for missed deliveries
      const missedDropCost = missedDrops * costPerMissedDrop;
      
      // Total Route Loss - total financial impact
      const totalRouteLoss = fuelWasteCost + driverWasteCost + idleFuelCost + missedDropCost;
      
      // Route Adherence Pct - how closely the actual route matched the planned route
      const routeAdherencePct = actualDist > 0 ? (plannedDist / actualDist) * 100 : 0;

      return {
        routeDriftKm: Math.round(routeDriftKm * 100) / 100,
        fuelWasteLiters: Math.round(fuelWasteLiters * 100) / 100,
        fuelWasteCost: Math.round(fuelWasteCost * 100) / 100,
        timeWasteHrs: Math.round(timeWasteHrs * 100) / 100,
        driverWasteCost: Math.round(driverWasteCost * 100) / 100,
        idleFuelCost: Math.round(idleFuelCost * 100) / 100,
        missedDropCost: Math.round(missedDropCost * 100) / 100,
        totalRouteLoss: Math.round(totalRouteLoss * 100) / 100,
        routeAdherencePct: Math.round(routeAdherencePct * 100) / 100
      };
    } catch (error) {
      throw new Error("Failed to calculate: " + String(error));
    }
  },
};