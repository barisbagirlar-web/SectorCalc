import { KaynakIslemEkonomisiVeArkVerimiCalculator66InputSchema, type KaynakIslemEkonomisiVeArkVerimiCalculator66Input } from "./kaynak-islem-ekonomisi-ve-ark-verimi-calculator-66-validation";

export const calculateKaynakIslemEkonomisiVeArkVerimiCalculator66Contract: any = {
  id: "kaynak-islem-ekonomisi-ve-ark-verimi-calculator-66",
  version: "1.0.0",
  category: "cost",
  inputSchema: KaynakIslemEkonomisiVeArkVerimiCalculator66InputSchema,
  
  execute: async (input: any) => {
    try {
      const travelSpeed = Number(input.travelSpeed);
      const weldLength = Number(input.weldLength);
      const arcOnFactor = Number(input.arcOnFactor);
      const laborRate = Number(input.laborRate);
      const powerKw = Number(input.powerKw);
      const elecRate = Number(input.elecRate);
      const gasFlow = Number(input.gasFlow);
      const gasPrice = Number(input.gasPrice);
      const fillerRequiredKg = Number(input.fillerRequiredKg);
      const fillerPrice = Number(input.fillerPrice);

      // Formula: Arc_Time_Min = (weld_length * 100) / travel_speed
      const arcTimeMin = (weldLength * 100) / travelSpeed;

      // Formula: Total_Labor_Time_Min = Arc_Time_Min / (arc_on_factor / 100)
      const totalLaborTimeMin = arcTimeMin / (arcOnFactor / 100);

      // Formula: Labor_Cost = (Total_Labor_Time_Min / 60) * labor_rate
      const laborCost = (totalLaborTimeMin / 60) * laborRate;

      // Formula: Energy_Cost = power_kw * (Arc_Time_Min / 60) * elec_rate
      const energyCost = powerKw * (arcTimeMin / 60) * elecRate;

      // Formula: Gas_Cost = gas_flow * Arc_Time_Min * gas_price
      const gasCost = gasFlow * arcTimeMin * gasPrice;

      // Formula: Material_Cost = filler_required_kg * filler_price
      const materialCost = fillerRequiredKg * fillerPrice;

      // Formula: Total_Weld_Cost = Labor_Cost + Energy_Cost + Gas_Cost + Material_Cost
      const totalWeldCost = laborCost + energyCost + gasCost + materialCost;

      // Formula: Cost_Per_Meter = Total_Weld_Cost / weld_length
      const costPerMeter = totalWeldCost / weldLength;

      return {
        arcTimeMin: Math.round(arcTimeMin * 100) / 100,
        totalLaborTimeMin: Math.round(totalLaborTimeMin * 100) / 100,
        laborCost: Math.round(laborCost * 100) / 100,
        energyCost: Math.round(energyCost * 100) / 100,
        gasCost: Math.round(gasCost * 100) / 100,
        materialCost: Math.round(materialCost * 100) / 100,
        totalWeldCost: Math.round(totalWeldCost * 100) / 100,
        costPerMeter: Math.round(costPerMeter * 100) / 100
      };
    } catch (error) {
      throw new Error("Failed to calculate: " + String(error));
    }
  },
};