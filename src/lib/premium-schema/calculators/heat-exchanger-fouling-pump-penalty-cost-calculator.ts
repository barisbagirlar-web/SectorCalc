import { IsiEsanjoruKirlenmeFoulingVePompaCezaMaliyetiCalculator120InputSchema, type IsiEsanjoruKirlenmeFoulingVePompaCezaMaliyetiCalculator120Input } from "./isi-esanjoru-kirlenme-fouling-ve-pompa-ceza-maliyeti-calculator-120-validation";

export const calculateIsiEsanjoruKirlenmeFoulingVePompaCezaMaliyetiCalculator120Contract: any = {
  id: "isi-esanjoru-kirlenme-fouling-ve-pompa-ceza-maliyeti-calculator-120",
  version: "1.0.0",
  category: "cost",
  inputSchema: IsiEsanjoruKirlenmeFoulingVePompaCezaMaliyetiCalculator120InputSchema,
  
  execute: async (input: any) => {
    try {
      const {
        uClean,
        uDirty,
        area,
        lmtd,
        flowRate,
        dpClean,
        dpDirty,
        cleaningCost,
        pumpEff,
        boilerEff,
        fuelCost,
        elecRate,
        opHours
      } = input;

      // Validate all required inputs exist and are positive numbers
      if (!uClean || !uDirty || !area || !lmtd || !flowRate || !dpClean || !dpDirty || 
          !cleaningCost || !pumpEff || !boilerEff || !fuelCost || !elecRate || !opHours) {
        throw new Error("All input fields are required and must be positive numbers");
      }

      // Convert percentage values to decimal
      const pumpEffDecimal = pumpEff / 100;
      const boilerEffDecimal = boilerEff / 100;

      // Formula: R_fouling = (1 / u_dirty) - (1 / u_clean)
      // Thermal resistance due to fouling (m²K/W)
      const rFouling = (1 / uDirty) - (1 / uClean);

      // Formula: HeatLoss_kW = (area * (u_clean - u_dirty) * lmtd) / 1000
      // Heat transfer loss due to fouling in kW
      const heatLossKW = (area * (uClean - uDirty) * lmtd) / 1000;

      // Formula: AnnualEnergyPenalty_GJ = (HeatLoss_kW * op_hours * 3600) / 1000000
      // Convert heat loss to annual energy penalty in GJ
      const annualEnergyPenaltyGJ = (heatLossKW * opHours * 3600) / 1000000;

      // Formula: Cost_ThermalEnergy = (AnnualEnergyPenalty_GJ * fuel_cost) / (boiler_eff / 100)
      // Annual cost of extra fuel to compensate for fouling (USD)
      const costThermalEnergy = (annualEnergyPenaltyGJ * fuelCost) / boilerEffDecimal;

      // Formula: PumpPenalty_kW = ((dp_dirty - dp_clean) * 100000 * flow_rate) / ((pump_eff / 100) * 1000)
      // Convert bar to Pa (1 bar = 100,000 Pa), calculate hydraulic power, then electric power
      const pressureDifferencePa = (dpDirty - dpClean) * 100000;
      const pumpPenaltyKW = (pressureDifferencePa * flowRate) / (pumpEffDecimal * 1000);

      // Formula: AnnualPumpCost = PumpPenalty_kW * op_hours * elec_rate
      // Annual cost of extra pump power (USD)
      const annualPumpCost = pumpPenaltyKW * opHours * elecRate;

      // Formula: TotalFoulingCost = Cost_ThermalEnergy + AnnualPumpCost
      // Total annual penalty due to fouling (USD)
      const totalFoulingCost = costThermalEnergy + annualPumpCost;

      // Formula: CleaningROI = TotalFoulingCost / cleaning_cost
      // Return on investment for cleaning (how many times cleaning cost is recovered per year)
      const cleaningROI = totalFoulingCost / cleaningCost;

      // Formula: OptimalCleaningInterval_Days = SQRT(2 * cleaning_cost / (TotalFoulingCost / 365))
      // Economic optimal time between cleanings in days
      const dailyPenaltyRate = totalFoulingCost / 365;
      const optimalCleaningIntervalDays = Math.sqrt((2 * cleaningCost) / dailyPenaltyRate);

      return {
        rFouling: Math.round(rFouling * 1000000) / 1000000,
        heatLossKW: Math.round(heatLossKW * 100) / 100,
        annualEnergyPenaltyGJ: Math.round(annualEnergyPenaltyGJ * 100) / 100,
        costThermalEnergy: Math.round(costThermalEnergy * 100) / 100,
        pumpPenaltyKW: Math.round(pumpPenaltyKW * 100) / 100,
        annualPumpCost: Math.round(annualPumpCost * 100) / 100,
        totalFoulingCost: Math.round(totalFoulingCost * 100) / 100,
        cleaningROI: Math.round(cleaningROI * 100) / 100,
        optimalCleaningIntervalDays: Math.round(optimalCleaningIntervalDays * 100) / 100
      };
    } catch (error) {
      throw new Error("Failed to calculate: " + String(error));
    }
  },
};