// Auto-generated from mtv-motorlu-tasitlar-vergisi-hesaplama-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface MtvMotorluTasitlarVergisiHesaplamaInput {
  vehicleType: 'otomobil' | 'minibus' | 'panelvan' | 'arazi_tasiti' | 'motosiklet';
  engineDisplacement: number;
  vehicleAge: number;
  isHybridOrElectric: boolean;
  taxYear: number;
}

export const MtvMotorluTasitlarVergisiHesaplamaInputSchema = z.object({
  vehicleType: z.enum(['otomobil', 'minibus', 'panelvan', 'arazi_tasiti', 'motosiklet']).default('otomobil'),
  engineDisplacement: z.number().min(0).max(6000).default(1600),
  vehicleAge: z.number().min(0).max(50).default(0),
  isHybridOrElectric: z.boolean().default(false),
  taxYear: z.number().min(2020).max(2030).default(2025),
});

export interface MtvMotorluTasitlarVergisiHesaplamaOutput {
  annualTax: number;
  breakdown: {
    baseTax: number;
    hybridDiscount: number;
    annualTax: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: MtvMotorluTasitlarVergisiHesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.baseTax = ((): number => { try { const __v = getBaseTax(input.vehicleType, input.engineDisplacement, input.vehicleAge, input.taxYear); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.hybridDiscount = ((): number => { try { const __v = input.isHybridOrElectric ? 0.5 : 0; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.annualTax = ((): number => { try { const __v = results.baseTax * (1 - results.hybridDiscount); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.primary = ((): number => { try { const __v = results.annualTax; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateMtvMotorluTasitlarVergisiHesaplama(input: MtvMotorluTasitlarVergisiHesaplamaInput): MtvMotorluTasitlarVergisiHesaplamaOutput {
  const results = evaluateFormulas(input);
  const annualTax = results.annualTax ?? 0;
  const breakdown = {
    baseTax: results.baseTax,
    hybridDiscount: results.hybridDiscount,
    annualTax: results.annualTax,
  };

  // rule: engineDisplacement > 0
  // rule: vehicleAge >= 0
  // rule: taxYear >= 2020
  // rule: if vehicleType == 'motosiklet' then engineDisplacement <= 2500
  // rule: if isHybridOrElectric == true then engineDisplacement >= 0
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  if (input.engineDisplacement > 4000) hiddenLossDrivers.push("engineDisplacement");
  if (input.vehicleAge > 15) hiddenLossDrivers.push("vehicleAge");

  const dataConfidenceAdjusted = (() => { try { return results.annualTax; } catch { return annualTax; } })();

  return {
    annualTax,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF/CSV export","Trend analizi (yillik MTV degisimi)","Karsilastirma (farkli arac modelleri arasinda)","Detayli rapor (vergi dilimleri, indirimler)"],
  };
}
