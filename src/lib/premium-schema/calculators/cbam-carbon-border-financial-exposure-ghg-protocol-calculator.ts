import { CbamSinirdaKarbonFinansalMaruziyetiGhgProtocolCalculator14InputSchema, type CbamSinirdaKarbonFinansalMaruziyetiGhgProtocolCalculator14Input } from "./cbam-sinirda-karbon-finansal-maruziyeti-ghg-protocol-calculator-14-validation";

export const calculateCbamSinirdaKarbonFinansalMaruziyetiGhgProtocolCalculator14Contract: any = {
  id: "cbam-sinirda-karbon-finansal-maruziyeti-ghg-protocol-calculator-14",
  version: "1.0.0",
  category: "cost",
  inputSchema: CbamSinirdaKarbonFinansalMaruziyetiGhgProtocolCalculator14InputSchema,
  
  execute: async (input: any) => {
    try {
      // Parse and validate inputs
      const fuelQty = Number(input.fuelQty) || 0;
      const fuelEf = Number(input.fuelEf) || 0;
      const processEmissions = Number(input.processEmissions) || 0;
      const elecKwh = Number(input.elecKwh) || 0;
      const gridEf = Number(input.gridEf) || 0;
      const prodVolume = Number(input.prodVolume) || 0;
      const euExportVol = Number(input.euExportVol) || 0;
      const sectorBenchmark = Number(input.sectorBenchmark) || 0;
      const euEtsPrice = Number(input.euEtsPrice) || 0;
      const localCarbonTax = Number(input.localCarbonTax) || 0;

      // Formula: Scope1 = (fuel_qty * fuel_ef) + process_emissions
      const scope1 = (fuelQty * fuelEf) + processEmissions;

      // Formula: Scope2 = (elec_kwh * grid_ef) / 1000
      const scope2 = (elecKwh * gridEf) / 1000;

      // Formula: TotalEmissions = Scope1 + Scope2
      const totalEmissions = scope1 + scope2;

      // Formula: SpecificEmbedded = TotalEmissions / prod_volume (handle division by zero)
      const specificEmbedded = prodVolume > 0 ? totalEmissions / prodVolume : 0;

      // Formula: ExcessEmissions = MAX(0, SpecificEmbedded - sector_benchmark) * eu_export_vol
      const excessPerUnit = Math.max(0, specificEmbedded - sectorBenchmark);
      const excessEmissions = excessPerUnit * euExportVol;

      // Formula: CBAM_Liability = ExcessEmissions * eu_ets_price
      const cBAMLiability = excessEmissions * euEtsPrice;

      // Formula: Net_CBAM_Cost = MAX(0, CBAM_Liability - (ExcessEmissions * local_carbon_tax))
      const localTaxDeduction = excessEmissions * localCarbonTax;
      const netCBAMCost = Math.max(0, cBAMLiability - localTaxDeduction);

      // Return calculated values
      return {
        scope1,
        scope2,
        totalEmissions,
        specificEmbedded,
        excessEmissions,
        cBAMLiability,
        netCBAMCost
      };
    } catch (error) {
      throw new Error("Failed to calculate: " + String(error));
    }
  },
};