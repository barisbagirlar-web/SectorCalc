import { TalasliImalatGercekBirimCostTcoCalculator20InputSchema, type TalasliImalatGercekBirimCostTcoCalculator20Input } from "./talasli-imalat-gercek-birim-cost-tco-calculator-20-validation";

export const calculateTalasliImalatGercekBirimCostTcoCalculator20Contract: any = {
  id: "talasli-imalat-gercek-birim-cost-tco-calculator-20",
  version: "1.0.0",
  category: "cost",
  inputSchema: TalasliImalatGercekBirimCostTcoCalculator20InputSchema,
  
  execute: async (input: any) => {
    try {
      // Destructure input with proper numeric conversion
      const matVolM3 = Number(input.matVolM3) || 0;
      const matDensity = Number(input.matDensity) || 0;
      const matPriceKg = Number(input.matPriceKg) || 0;
      const machineRateHr = Number(input.machineRateHr) || 0;
      const cycleTimeMin = Number(input.cycleTimeMin) || 0;
      const toolCost = Number(input.toolCost) || 0;
      const cuttingEdges = Number(input.cuttingEdges) || 1; // Prevent division by zero
      const toolLifeMin = Number(input.toolLifeMin) || 1; // Prevent division by zero
      const scrapRate = Number(input.scrapRate) || 0;
      const overheadRate = Number(input.overheadRate) || 0;

      // Formula: MatCost_Base = mat_vol_m3 * mat_density * mat_price_kg
      const matCostBase = matVolM3 * matDensity * matPriceKg;

      // Formula: MachiningCost = (cycle_time_min / 60) * machine_rate_hr
      const machiningCost = (cycleTimeMin / 60) * machineRateHr;

      // Formula: ToolingCost_PerPart = (cycle_time_min / tool_life_min) * (tool_cost / cutting_edges)
      const toolingCostPerPart = (cycleTimeMin / toolLifeMin) * (toolCost / cuttingEdges);

      // Formula: BaseCost_PerPart = MatCost_Base + MachiningCost + ToolingCost_PerPart
      const baseCostPerPart = matCostBase + machiningCost + toolingCostPerPart;

      // Formula: OverheadCost = BaseCost_PerPart * (overhead_rate / 100)
      const overheadCost = baseCostPerPart * (overheadRate / 100);

      // Formula: ScrapPenalty = (BaseCost_PerPart + OverheadCost) * (scrap_rate / 100)
      const scrapPenalty = (baseCostPerPart + overheadCost) * (scrapRate / 100);

      // Formula: Total_Unit_Cost = BaseCost_PerPart + OverheadCost + ScrapPenalty
      const totalUnitCost = baseCostPerPart + overheadCost + scrapPenalty;

      return {
        matCostBase: Math.round(matCostBase * 100) / 100,
        machiningCost: Math.round(machiningCost * 100) / 100,
        toolingCostPerPart: Math.round(toolingCostPerPart * 100) / 100,
        baseCostPerPart: Math.round(baseCostPerPart * 100) / 100,
        overheadCost: Math.round(overheadCost * 100) / 100,
        scrapPenalty: Math.round(scrapPenalty * 100) / 100,
        totalUnitCost: Math.round(totalUnitCost * 100) / 100
      };
    } catch (error) {
      throw new Error("Failed to calculate: " + String(error));
    }
  },
};