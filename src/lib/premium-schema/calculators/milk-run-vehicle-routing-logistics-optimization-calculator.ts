import { MilkRunVehicleRotalamaVrpLojistikOptimizasyonuCalculator55InputSchema, type MilkRunVehicleRotalamaVrpLojistikOptimizasyonuCalculator55Input } from "./milk-run-vehicle-rotalama-vrp-lojistik-optimizasyonu-calculator-55-validation";

export const calculateMilkRunVehicleRotalamaVrpLojistikOptimizasyonuCalculator55Contract: any = {
  id: "milk-run-vehicle-rotalama-vrp-lojistik-optimizasyonu-calculator-55",
  version: "1.0.0",
  category: "cost",
  inputSchema: MilkRunVehicleRotalamaVrpLojistikOptimizasyonuCalculator55InputSchema,
  
  execute: async (input: any) => {
    try {
      // Parse input values
      const currentDist = Number(input.currentDist);
      const optimizedDist = Number(input.optimizedDist);
      const avgSpeed = Number(input.avgSpeed);
      const fuelConsumption = Number(input.fuelConsumption);
      const fuelPrice = Number(input.fuelPrice);
      const driverRate = Number(input.driverRate);
      const stopsCount = Number(input.stopsCount);
      const stopTimeMin = Number(input.stopTimeMin);

      // Validate inputs to prevent division by zero or NaN
      if (avgSpeed <= 0 || fuelConsumption <= 0 || fuelPrice <= 0 || driverRate <= 0 || stopsCount < 0 || stopTimeMin < 0 || currentDist < 0 || optimizedDist < 0) {
        return {
          timeCurrent: 0,
          timeOptimized: 0,
          fuelCostCurrent: 0,
          fuelCostOptimized: 0,
          driverCostCurrent: 0,
          driverCostOptimized: 0,
          totalCostCurrent: 0,
          totalCostOptimized: 0,
          netSavingsPerRun: 0,
          savingsPct: 0
        };
      }

      // Time calculations (in hours)
      // Travel time = distance / speed, Stop time = stops * stop_time_min / 60
      const timeCurrent = (currentDist / avgSpeed) + ((stopsCount * stopTimeMin) / 60);
      const timeOptimized = (optimizedDist / avgSpeed) + ((stopsCount * stopTimeMin) / 60);

      // Fuel cost calculations (fuel_consumption is L/100km)
      const fuelCostCurrent = currentDist * (fuelConsumption / 100) * fuelPrice;
      const fuelCostOptimized = optimizedDist * (fuelConsumption / 100) * fuelPrice;

      // Driver cost calculations
      const driverCostCurrent = timeCurrent * driverRate;
      const driverCostOptimized = timeOptimized * driverRate;

      // Total cost calculations
      const totalCostCurrent = fuelCostCurrent + driverCostCurrent;
      const totalCostOptimized = fuelCostOptimized + driverCostOptimized;

      // Savings calculations
      const netSavingsPerRun = totalCostCurrent - totalCostOptimized;
      const savingsPct = totalCostCurrent > 0 ? (netSavingsPerRun / totalCostCurrent) * 100 : 0;

      return {
        timeCurrent: Math.round(timeCurrent * 100) / 100,
        timeOptimized: Math.round(timeOptimized * 100) / 100,
        fuelCostCurrent: Math.round(fuelCostCurrent * 100) / 100,
        fuelCostOptimized: Math.round(fuelCostOptimized * 100) / 100,
        driverCostCurrent: Math.round(driverCostCurrent * 100) / 100,
        driverCostOptimized: Math.round(driverCostOptimized * 100) / 100,
        totalCostCurrent: Math.round(totalCostCurrent * 100) / 100,
        totalCostOptimized: Math.round(totalCostOptimized * 100) / 100,
        netSavingsPerRun: Math.round(netSavingsPerRun * 100) / 100,
        savingsPct: Math.round(savingsPct * 100) / 100
      };
    } catch (error) {
      throw new Error("Failed to calculate: " + String(error));
    }
  },
};