import { HidrolikSistemEnerjiKaybiVeTermalCokusAnalysisCalculator119InputSchema, type HidrolikSistemEnerjiKaybiVeTermalCokusAnalysisCalculator119Input } from "./hidrolik-sistem-enerji-kaybi-ve-termal-cokus-analysis-calculator-119-validation";

export const calculateHidrolikSistemEnerjiKaybiVeTermalCokusAnalysisCalculator119Contract: any = {
  id: "hidrolik-sistem-enerji-kaybi-ve-termal-cokus-analysis-calculator-119",
  version: "1.0.0",
  category: "cost",
  inputSchema: HidrolikSistemEnerjiKaybiVeTermalCokusAnalysisCalculator119InputSchema,
  
  execute: async (input: any) => {
    try {
      // Parse input values
      const supplyPressure = Number(input.supplyPressure) || 0;
      const tankPressure = Number(input.tankPressure) || 0;
      const pumpFlow = Number(input.pumpFlow) || 0;
      const leakFlow = Number(input.leakFlow) || 0;
      const pipeDp = Number(input.pipeDp) || 0;
      const valveDp = Number(input.valveDp) || 0;
      const coolingCop = Number(input.coolingCop) || 1; // Avoid division by zero
      const fluidVolume = Number(input.fluidVolume) || 0;
      const fluidPrice = Number(input.fluidPrice) || 0;
      const opHours = Number(input.opHours) || 0;
      const elecRate = Number(input.elecRate) || 0;

      // Formula: LeakPower_kW = leak_flow * (supply_pressure - tank_pressure) / 600
      const leakPowerKW = leakFlow * (supplyPressure - tankPressure) / 600;

      // Formula: FrictionLoss_kW = pipe_dp * pump_flow / 600
      const frictionLossKW = pipeDp * pumpFlow / 600;

      // Formula: ValveLoss_kW = valve_dp * pump_flow / 600
      const valveLossKW = valveDp * pumpFlow / 600;

      // Formula: TotalLoss_kW = LeakPower_kW + FrictionLoss_kW + ValveLoss_kW
      const totalLossKW = leakPowerKW + frictionLossKW + valveLossKW;

      // Formula: CoolingEnergy_kW = TotalLoss_kW / cooling_cop
      const coolingEnergyKW = totalLossKW / coolingCop;

      // Formula: AnnualEnergyCost = (TotalLoss_kW + CoolingEnergy_kW) * op_hours * elec_rate
      const annualEnergyCost = (totalLossKW + coolingEnergyKW) * opHours * elecRate;

      // Formula: Power_Input_Est_kW = (supply_pressure * pump_flow) / 600
      const powerInputEstKW = (supplyPressure * pumpFlow) / 600;

      // Formula: SystemEfficiency = ((Power_Input_Est_kW - TotalLoss_kW) / Power_Input_Est_kW) * 100
      const systemEfficiency = powerInputEstKW > 0 
        ? ((powerInputEstKW - totalLossKW) / powerInputEstKW) * 100 
        : 0;

      return {
        leakPowerKW: Math.round(leakPowerKW * 100) / 100,
        frictionLossKW: Math.round(frictionLossKW * 100) / 100,
        valveLossKW: Math.round(valveLossKW * 100) / 100,
        totalLossKW: Math.round(totalLossKW * 100) / 100,
        coolingEnergyKW: Math.round(coolingEnergyKW * 100) / 100,
        annualEnergyCost: Math.round(annualEnergyCost * 100) / 100,
        powerInputEstKW: Math.round(powerInputEstKW * 100) / 100,
        systemEfficiency: Math.round(systemEfficiency * 100) / 100
      };
    } catch (error) {
      throw new Error("Failed to calculate: " + String(error));
    }
  },
};