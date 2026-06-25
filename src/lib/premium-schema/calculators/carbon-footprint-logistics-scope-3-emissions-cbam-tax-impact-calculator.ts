import { KarbonAyakIziLojistikScope3EmisyonVeCbamVergiEtkisiCalculator156InputSchema, type KarbonAyakIziLojistikScope3EmisyonVeCbamVergiEtkisiCalculator156Input } from "./karbon-ayak-izi-lojistik-scope-3-emisyon-ve-cbam-vergi-etkisi-calculator-156-validation";

export const calculateKarbonAyakIziLojistikScope3EmisyonVeCbamVergiEtkisiCalculator156Contract: any = {
  id: "karbon-ayak-izi-lojistik-scope-3-emisyon-ve-cbam-vergi-etkisi-calculator-156",
  version: "1.0.0",
  category: "cost",
  inputSchema: KarbonAyakIziLojistikScope3EmisyonVeCbamVergiEtkisiCalculator156InputSchema,
  
  execute: async (input: any) => {
    try {
      const {
        shipmentWeight,
        distRoad,
        distSea,
        distAir,
        efRoad,
        efSea,
        efAir,
        euEtsCarbonPrice,
        productValue
      } = input;

      // Formula: Emissions_Road_kg = shipment_weight * dist_road * ef_road
      const emissionsRoadKg = shipmentWeight * distRoad * efRoad;

      // Formula: Emissions_Sea_kg = shipment_weight * dist_sea * ef_sea
      const emissionsSeaKg = shipmentWeight * distSea * efSea;

      // Formula: Emissions_Air_kg = shipment_weight * dist_air * ef_air
      const emissionsAirKg = shipmentWeight * distAir * efAir;

      // Formula: Total_Scope3_Emissions_kg = Emissions_Road_kg + Emissions_Sea_kg + Emissions_Air_kg
      const totalScope3EmissionsKg = emissionsRoadKg + emissionsSeaKg + emissionsAirKg;

      // Formula: Total_Scope3_Emissions_Ton = Total_Scope3_Emissions_kg / 1000
      const totalScope3EmissionsTon = totalScope3EmissionsKg / 1000;

      // Formula: CBAM_Tax_Liability = Total_Scope3_Emissions_Ton * eu_ets_carbon_price
      const cBAMTaxLiability = totalScope3EmissionsTon * euEtsCarbonPrice;

      // Formula: Carbon_Tax_Impact_on_Margin_Pct = (CBAM_Tax_Liability / product_value) * 100
      const carbonTaxImpactOnMarginPct = productValue > 0 
        ? (cBAMTaxLiability / productValue) * 100 
        : 0;

      return {
        emissionsRoadKg: Math.round(emissionsRoadKg * 100) / 100,
        emissionsSeaKg: Math.round(emissionsSeaKg * 100) / 100,
        emissionsAirKg: Math.round(emissionsAirKg * 100) / 100,
        totalScope3EmissionsKg: Math.round(totalScope3EmissionsKg * 100) / 100,
        totalScope3EmissionsTon: Math.round(totalScope3EmissionsTon * 100) / 100,
        cBAMTaxLiability: Math.round(cBAMTaxLiability * 100) / 100,
        carbonTaxImpactOnMarginPct: Math.round(carbonTaxImpactOnMarginPct * 100) / 100
      };
    } catch (error) {
      throw new Error("Failed to calculate: " + String(error));
    }
  },
};