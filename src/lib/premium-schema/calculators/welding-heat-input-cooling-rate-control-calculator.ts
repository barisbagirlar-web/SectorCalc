import { KaynakIsiGirdisiHeatInputVeSogumaHiziKontroluCalculator110InputSchema, type KaynakIsiGirdisiHeatInputVeSogumaHiziKontroluCalculator110Input } from "./kaynak-isi-girdisi-heat-input-ve-soguma-hizi-kontrolu-calculator-110-validation";

export const calculateKaynakIsiGirdisiHeatInputVeSogumaHiziKontroluCalculator110Contract: any = {
  id: "kaynak-isi-girdisi-heat-input-ve-soguma-hizi-kontrolu-calculator-110",
  version: "1.0.0",
  category: "cost",
  inputSchema: KaynakIsiGirdisiHeatInputVeSogumaHiziKontroluCalculator110InputSchema,
  
  execute: async (input: any) => {
    try {
      // Destructure inputs with defaults
      const arcVoltage = Number(input.arcVoltage) || 0;
      const arcCurrent = Number(input.arcCurrent) || 0;
      const travelSpeed = Number(input.travelSpeed) || 0;
      const thermalEfficiency = Number(input.thermalEfficiency) || 0;
      const plateThickness = Number(input.plateThickness) || 0;
      const maxHeatInput = Number(input.maxHeatInput) || 0;

      // Validate inputs to avoid division by zero or negative values
      if (travelSpeed <= 0 || arcVoltage <= 0 || arcCurrent <= 0 || thermalEfficiency <= 0 || plateThickness <= 0) {
        return {
          heatInputKJMm: 0,
          coolingTimeT85: 0,
          complianceGap: 0
        };
      }

      // Formula: Heat_Input_kJ_mm = (arc_voltage * arc_current * 60) / (travel_speed * 1000) * thermal_efficiency
      const heatInputKJMm = (arcVoltage * arcCurrent * 60) / (travelSpeed * 1000) * thermalEfficiency;

      // Formula: Cooling_Time_t8_5 = (plate_thickness^2 * 45000) / (Heat_Input_kJ_mm * 1000)
      const coolingTimeT85 = heatInputKJMm > 0 
        ? (Math.pow(plateThickness, 2) * 45000) / (heatInputKJMm * 1000) 
        : 0;

      // Formula: Compliance_Gap = max_heat_input - Heat_Input_kJ_mm
      const complianceGap = heatInputKJMm > 0 
        ? maxHeatInput - heatInputKJMm 
        : 0;

      // Return calculated values with proper rounding for practical use
      return {
        heatInputKJMm: Math.round(heatInputKJMm * 1000) / 1000,
        coolingTimeT85: Math.round(coolingTimeT85 * 100) / 100,
        complianceGap: Math.round(complianceGap * 1000) / 1000
      };
    } catch (error) {
      throw new Error("Failed to calculate: " + String(error));
    }
  },
};