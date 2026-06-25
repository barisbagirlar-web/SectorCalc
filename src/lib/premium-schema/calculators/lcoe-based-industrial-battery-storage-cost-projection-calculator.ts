import { LcoeBazliEndustriyelEnerjiDepolamaBessCostProjeksiyonuCalculator173InputSchema, type LcoeBazliEndustriyelEnerjiDepolamaBessCostProjeksiyonuCalculator173Input } from "./lcoe-bazli-endustriyel-enerji-depolama-bess-cost-projeksiyonu-calculator-173-validation";

export const calculateLcoeBazliEndustriyelEnerjiDepolamaBessCostProjeksiyonuCalculator173Contract: any = {
  id: "lcoe-bazli-endustriyel-enerji-depolama-bess-cost-projeksiyonu-calculator-173",
  version: "1.0.0",
  category: "cost",
  inputSchema: LcoeBazliEndustriyelEnerjiDepolamaBessCostProjeksiyonuCalculator173InputSchema,
  
  execute: async (input: any) => {
    try {
      const {
        bessCapex,
        annualOpex,
        batteryCapacityMwh,
        dodPct,
        roundTripEffPct,
        annualCycles,
        chargingCostMwh,
        batteryLifeYrs,
        wacc
      } = input;

      const safeNumber = (val: any, defaultVal: number = 0): number => {
        const num = Number(val);
        return isNaN(num) ? defaultVal : num;
      };

      const capex = safeNumber(bessCapex);
      const opex = safeNumber(annualOpex);
      const capacityMwh = safeNumber(batteryCapacityMwh);
      const dod = safeNumber(dodPct);
      const roundTripEff = safeNumber(roundTripEffPct);
      const cycles = safeNumber(annualCycles);
      const chargeCost = safeNumber(chargingCostMwh);
      const lifeYears = safeNumber(batteryLifeYrs);
      const discountRate = safeNumber(wacc);

      // Formula: Annual_Discharged_Energy_MWh = battery_capacity_mwh * (dod_pct / 100) * annual_cycles
      const annualDischargedEnergyMWh = capacityMwh * (dod / 100) * cycles;

      // Formula: Annual_Charged_Energy_MWh = Annual_Discharged_Energy_MWh / (round_trip_eff_pct / 100)
      const annualChargedEnergyMWh = roundTripEff > 0 ? annualDischargedEnergyMWh / (roundTripEff / 100) : 0;

      // Formula: Annual_Charging_Cost_Total = Annual_Charged_Energy_MWh * charging_cost_mwh
      const annualChargingCostTotal = annualChargedEnergyMWh * chargeCost;

      // Formula: Total_Annual_Cost_t = annual_opex + Annual_Charging_Cost_Total
      const totalAnnualCostT = opex + annualChargingCostTotal;

      // Formula: Discounted_Costs_Sum = bess_capex + SUM_t=1_to_life(Total_Annual_Cost_t / POWER(1 + (wacc/100), t))
      let discountedCostsSum = capex;
      let discountedEnergySum = 0;

      const discountRateDecimal = discountRate / 100;

      for (let t = 1; t <= lifeYears; t++) {
        const discountFactor = Math.pow(1 + discountRateDecimal, t);
        discountedCostsSum += totalAnnualCostT / discountFactor;
        discountedEnergySum += annualDischargedEnergyMWh / discountFactor;
      }

      // Formula: LCOE_Storage_Per_MWh = Discounted_Costs_Sum / Discounted_Energy_Sum
      const lCOEStoragePerMWh = discountedEnergySum > 0 ? discountedCostsSum / discountedEnergySum : 0;

      return {
        annualDischargedEnergyMWh,
        annualChargedEnergyMWh,
        annualChargingCostTotal,
        totalAnnualCostT,
        discountedCostsSum,
        discountedEnergySum,
        lCOEStoragePerMWh
      };
    } catch (error) {
      throw new Error("Failed to calculate: " + String(error));
    }
  },
};