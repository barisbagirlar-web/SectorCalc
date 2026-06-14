// Auto-generated from akaryakit-fiyati-ile-yol-butcesi-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface AkaryakitFiyatiIleYolButcesiInput {
  fuelPricePerLiter: number;
  fuelConsumptionPer100km: number;
  distanceKm: number;
  vehicleType: 'binek' | 'ticari' | 'agir';
  maintenanceCostPerKm: number;
  tollCost: number;
  parkingCost: number;
  driverCostPerHour: number;
  averageSpeedKmh: number;
}

export const AkaryakitFiyatiIleYolButcesiInputSchema = z.object({
  fuelPricePerLiter: z.number().min(0).max(100).default(30),
  fuelConsumptionPer100km: z.number().min(0).max(50).default(8),
  distanceKm: z.number().min(0).max(100000).default(100),
  vehicleType: z.enum(['binek', 'ticari', 'agir']).default('binek'),
  maintenanceCostPerKm: z.number().min(0).max(10).default(0.5),
  tollCost: z.number().min(0).max(10000).default(0),
  parkingCost: z.number().min(0).max(5000).default(0),
  driverCostPerHour: z.number().min(0).max(1000).default(0),
  averageSpeedKmh: z.number().min(0).max(200).default(80),
});

export interface AkaryakitFiyatiIleYolButcesiOutput {
  totalCost: number;
  breakdown: {
    fuelCost: number;
    maintenanceCost: number;
    tollCost: number;
    parkingCost: number;
    driverCost: number;
    travelTimeHours: number;
    costPerKm: number;
    fuelCostPerKm: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: AkaryakitFiyatiIleYolButcesiInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.fuelCost = (() => { try { return input.fuelPricePerLiter * (input.fuelConsumptionPer100km / 100) * input.distanceKm; } catch { return 0; } })();
  results.maintenanceCost = (() => { try { return input.maintenanceCostPerKm * input.distanceKm; } catch { return 0; } })();
  results.travelTimeHours = (() => { try { return input.distanceKm / input.averageSpeedKmh; } catch { return 0; } })();
  results.driverCost = (() => { try { return input.driverCostPerHour * results.travelTimeHours; } catch { return 0; } })();
  results.totalCost = (() => { try { return results.fuelCost + results.maintenanceCost + input.tollCost + input.parkingCost + results.driverCost; } catch { return 0; } })();
  results.costPerKm = (() => { try { return results.totalCost / input.distanceKm; } catch { return 0; } })();
  results.fuelCostPerKm = (() => { try { return results.fuelCost / input.distanceKm; } catch { return 0; } })();
  return results;
}

export function calculateAkaryakitFiyatiIleYolButcesi(input: AkaryakitFiyatiIleYolButcesiInput): AkaryakitFiyatiIleYolButcesiOutput {
  const results = evaluateFormulas(input);
  const totalCost = results.totalCost ?? 0;
  const breakdown = {
    fuelCost: results.fuelCost,
    maintenanceCost: results.maintenanceCost,
    tollCost: results.tollCost,
    parkingCost: results.parkingCost,
    driverCost: results.driverCost,
    travelTimeHours: results.travelTimeHours,
    costPerKm: results.costPerKm,
    fuelCostPerKm: results.fuelCostPerKm,
  };

  // rule: fuelPricePerLiter > 0
  // rule: fuelConsumptionPer100km > 0
  // rule: distanceKm > 0
  // rule: averageSpeedKmh > 0
  // rule: maintenanceCostPerKm >= 0
  // rule: tollCost >= 0
  // rule: parkingCost >= 0
  // rule: driverCostPerHour >= 0
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  if (fuelCostPerKm > 5) hiddenLossDrivers.push("Yuksek yakit maliyeti");
  if (totalCost > 10000) hiddenLossDrivers.push("Butce asimi uyarisi");

  const dataConfidenceAdjusted = (() => { try { return results.totalCost; } catch { return totalCost; } })();

  return {
    totalCost,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: false,
    premiumFeatures: ["PDF/CSV export","Trend analizi (gecmis verilerle karsilastirma)","Detayli rapor (maliyet kirilimi grafikleri)","Karsilastirma (farkli arac/guzergah senaryolari)"],
  };
}
