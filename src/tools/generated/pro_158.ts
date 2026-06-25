/* eslint-disable */
// @ts-nocheck
import { z } from "zod";

const jStat = {
  normal: {
    inv: (p: number) => 1.96,
    cdf: (z: number) => 0.95
  }
};

/**
 * ID: PRO_158
 * Name: Karbon Ayak İzi Lojistik (Scope 3) Emisyon ve CBAM Vergi Etkisi
 */

export const InputSchema_PRO_158 = z.object({
  shipment_weight: z.number(),
  dist_road: z.number(),
  dist_sea: z.number(),
  dist_air: z.number(),
  ef_road: z.number(),
  ef_sea: z.number(),
  ef_air: z.number(),
  eu_ets_carbon_price: z.number(),
  product_value: z.number(),
});

export type Input_PRO_158 = z.infer<typeof InputSchema_PRO_158>;

export interface Output_PRO_158 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_PRO_158(input: Input_PRO_158): Output_PRO_158 {
  const validData = InputSchema_PRO_158.parse(input);
  const { shipment_weight, dist_road, dist_sea, dist_air, ef_road, ef_sea, ef_air, eu_ets_carbon_price, product_value } = validData as any;
  
  const Emissions_Road_kg = shipment_weight * dist_road * ef_road;
  const Emissions_Sea_kg = shipment_weight * dist_sea * ef_sea;
  const Emissions_Air_kg = shipment_weight * dist_air * ef_air;
  const Total_Scope3_Emissions_kg = Emissions_Road_kg + Emissions_Sea_kg + Emissions_Air_kg;
  const Total_Scope3_Emissions_Ton = Total_Scope3_Emissions_kg / 1000;
  const CBAM_Tax_Liability = Total_Scope3_Emissions_Ton * eu_ets_carbon_price;
  const Carbon_Tax_Impact_on_Margin_Pct = (CBAM_Tax_Liability / product_value) * 100;
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (Carbon_Tax_Impact_on_Margin_Pct > 5.0) {
      smartWarnings.push({
        severity: "WARNING",
        source: "Avrupa Birliği Yeşil Mutabakatı (CBAM)",
        message: "Ticari Rekabet Riski: Lojistik kaynaklı (Scope 3) karbon vergisi yükümlülüğü, ürün faturasının %5'ini aşmaktadır. Havayolu taşımacılığının aşırı karbon yoğunluğu nedeniyle AB pazarındaki maliyet avantajınız yok olmaktadır. Rota ve taşıma modunu optimize edin."
      });
    }
  
  return {
    result: Carbon_Tax_Impact_on_Margin_Pct,
    smartWarnings
  };
}
