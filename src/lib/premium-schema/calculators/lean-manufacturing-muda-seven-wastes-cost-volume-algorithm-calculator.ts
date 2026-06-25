import { YalinUretimMudaYediIsrafCostHacimAlgoritmasiCalculator102InputSchema, type YalinUretimMudaYediIsrafCostHacimAlgoritmasiCalculator102Input } from "./yalin-uretim-muda-yedi-israf-cost-hacim-algoritmasi-calculator-102-validation";

export const calculateYalinUretimMudaYediIsrafCostHacimAlgoritmasiCalculator102Contract: any = {
  id: "yalin-uretim-muda-yedi-israf-cost-hacim-algoritmasi-calculator-102",
  version: "1.0.0",
  category: "cost",
  inputSchema: YalinUretimMudaYediIsrafCostHacimAlgoritmasiCalculator102InputSchema,
  
  execute: async (input: any) => {
    try {
      // Parse and validate input
      const validatedInput = YalinUretimMudaYediIsrafCostHacimAlgoritmasiCalculator102InputSchema.parse(input);
      
      const {
        overproductionUnits,
        waitingHours,
        transportDistanceM,
        transportCostM,
        overprocessingHours,
        excessInventoryValue,
        holdingRate,
        motionHours,
        defectUnits,
        reworkCostPerUnit,
        unitMargin,
        laborRate,
        machineRate
      } = validatedInput;

      // Formula: Cost_Overproduction = overproduction_units * (rework_cost_per_unit + unit_margin)
      const costOverproduction = overproductionUnits * (reworkCostPerUnit + unitMargin);

      // Formula: Cost_Waiting = waiting_hours * (labor_rate + machine_rate)
      const costWaiting = waitingHours * (laborRate + machineRate);

      // Formula: Cost_Transport = transport_distance_m * transport_cost_m
      const costTransport = transportDistanceM * transportCostM;

      // Formula: Cost_Overprocessing = overprocessing_hours * (labor_rate + machine_rate)
      const costOverprocessing = overprocessingHours * (laborRate + machineRate);

      // Formula: Cost_Inventory = excess_inventory_value * (holding_rate / 100)
      const costInventory = excessInventoryValue * (holdingRate / 100);

      // Formula: Cost_Motion = motion_hours * labor_rate
      const costMotion = motionHours * laborRate;

      // Formula: Cost_Defects = defect_units * (rework_cost_per_unit + unit_margin)
      const costDefects = defectUnits * (reworkCostPerUnit + unitMargin);

      // Formula: Total_Muda_Cost = Cost_Overproduction + Cost_Waiting + Cost_Transport + Cost_Overprocessing + Cost_Inventory + Cost_Motion + Cost_Defects
      const totalMudaCost = costOverproduction + costWaiting + costTransport + costOverprocessing + costInventory + costMotion + costDefects;

      return {
        costOverproduction: Math.round(costOverproduction * 100) / 100,
        costWaiting: Math.round(costWaiting * 100) / 100,
        costTransport: Math.round(costTransport * 100) / 100,
        costOverprocessing: Math.round(costOverprocessing * 100) / 100,
        costInventory: Math.round(costInventory * 100) / 100,
        costMotion: Math.round(costMotion * 100) / 100,
        costDefects: Math.round(costDefects * 100) / 100,
        totalMudaCost: Math.round(totalMudaCost * 100) / 100
      };
    } catch (error) {
      throw new Error("Failed to calculate: " + String(error));
    }
  },
};