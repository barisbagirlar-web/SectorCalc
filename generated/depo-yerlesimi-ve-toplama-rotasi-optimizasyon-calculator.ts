// Auto-generated from depo-yerlesimi-ve-toplama-rotasi-optimizasyon-calculator-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface DepoYerlesimiVeToplamaRotasiOptimizasyonCalculatorInput {
  warehouseLength: number;
  warehouseWidth: number;
  numAisles: number;
  aisleWidth: number;
  numPickLocations: number;
  ordersPerDay: number;
  itemsPerOrder: number;
  pickTimePerItem: number;
  travelSpeed: number;
  laborCostPerHour: number;
  layoutType: 'traditional' | 'U-shaped' | 'cross-dock';
  routingStrategy: 's-shape' | 'largest-gap' | 'combined';
  dataConfidence: number;
}

export const DepoYerlesimiVeToplamaRotasiOptimizasyonCalculatorInputSchema = z.object({
  warehouseLength: z.number().min(10).max(500).default(100),
  warehouseWidth: z.number().min(10).max(300).default(50),
  numAisles: z.number().min(1).max(50).default(10),
  aisleWidth: z.number().min(1).max(10).default(3),
  numPickLocations: z.number().min(10).max(10000).default(500),
  ordersPerDay: z.number().min(1).max(10000).default(200),
  itemsPerOrder: z.number().min(1).max(100).default(5),
  pickTimePerItem: z.number().min(5).max(120).default(30),
  travelSpeed: z.number().min(0.5).max(2.5).default(1.4),
  laborCostPerHour: z.number().min(10).max(100).default(25),
  layoutType: z.enum(['traditional', 'U-shaped', 'cross-dock']).default('traditional'),
  routingStrategy: z.enum(['s-shape', 'largest-gap', 'combined']).default('s-shape'),
  dataConfidence: z.number().min(50).max(100).default(90),
});

export interface DepoYerlesimiVeToplamaRotasiOptimizasyonCalculatorOutput {
  totalLaborCostPerDay: number;
  breakdown: {
    totalTravelDistancePerDay: number;
    totalPickTimePerDay: number;
    totalTravelTimePerDay: number;
    totalLaborHoursPerDay: number;
    averagePickTimePerOrder: number;
    productivity: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: DepoYerlesimiVeToplamaRotasiOptimizasyonCalculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.totalTravelDistancePerOrder = (() => { try { return 2 * (input.warehouseLength + input.warehouseWidth) + (input.numPickLocations / input.numAisles) * input.aisleWidth * (input.routingStrategy == 's-shape' ? 1 : (input.routingStrategy == 'largest-gap' ? 0.8 : 0.9)); } catch { return 0; } })();
  results.totalTravelDistancePerDay = (() => { try { return results.totalTravelDistancePerOrder * input.ordersPerDay; } catch { return 0; } })();
  results.totalPickTimePerDay = (() => { try { return input.ordersPerDay * input.itemsPerOrder * input.pickTimePerItem / 3600; } catch { return 0; } })();
  results.totalTravelTimePerDay = (() => { try { return results.totalTravelDistancePerDay / input.travelSpeed / 3600; } catch { return 0; } })();
  results.totalLaborHoursPerDay = (() => { try { return results.totalPickTimePerDay + results.totalTravelTimePerDay; } catch { return 0; } })();
  results.totalLaborCostPerDay = (() => { try { return results.totalLaborHoursPerDay * input.laborCostPerHour; } catch { return 0; } })();
  results.averagePickTimePerOrder = (() => { try { return results.totalLaborHoursPerDay * 3600 / input.ordersPerDay; } catch { return 0; } })();
  results.productivity = (() => { try { return input.ordersPerDay / results.totalLaborHoursPerDay; } catch { return 0; } })();
  results.dataConfidenceAdjustedCost = (() => { try { return results.totalLaborCostPerDay * (100 / input.dataConfidence); } catch { return 0; } })();
  return results;
}

export function calculateDepoYerlesimiVeToplamaRotasiOptimizasyonCalculator(input: DepoYerlesimiVeToplamaRotasiOptimizasyonCalculatorInput): DepoYerlesimiVeToplamaRotasiOptimizasyonCalculatorOutput {
  const results = evaluateFormulas(input);
  const totalLaborCostPerDay = results.totalLaborCostPerDay ?? 0;
  const breakdown = {
    totalTravelDistancePerDay: results.totalTravelDistancePerDay,
    totalPickTimePerDay: results.totalPickTimePerDay,
    totalTravelTimePerDay: results.totalTravelTimePerDay,
    totalLaborHoursPerDay: results.totalLaborHoursPerDay,
    averagePickTimePerOrder: results.averagePickTimePerOrder,
    productivity: results.productivity,
  };

  // rule: warehouseLength > 0
  // rule: warehouseWidth > 0
  // rule: numAisles >= 1
  // rule: aisleWidth >= 1
  // rule: numPickLocations >= 1
  // rule: ordersPerDay >= 1
  // rule: itemsPerOrder >= 1
  // rule: pickTimePerItem >= 5
  // rule: travelSpeed >= 0.5
  // rule: laborCostPerHour >= 10
  // rule: dataConfidence >= 50 && dataConfidence <= 100
  // rule: if layoutType == 'cross-dock' then numAisles >= 2
  // rule: if routingStrategy == 'largest-gap' then numAisles >= 3
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): if > 50000 then 'Yuksek seyahat mesafesi, verimlilik dusuk'
  // threshold skipped (non-JS): if > 10000 then 'Iscilik maliyeti yuksek, optimizasyon onerilir'
  // threshold skipped (non-JS): if > 600 then 'Siparis basina toplama suresi yuksek'

  const dataConfidenceAdjusted = (() => { try { return results.dataConfidenceAdjustedCost; } catch { return totalLaborCostPerDay; } })();

  return {
    totalLaborCostPerDay,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF/CSV export","Trend analizi","Karsilastirma (farkli senaryolar)","Detayli rapor"],
  };
}
