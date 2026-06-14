// Auto-generated from dovme-ekstruzyon-proses-kuvvet-ve-pres-kapasite-calculator-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface DovmeEkstruzyonProsesKuvvetVePresKapasiteCalculatorInput {
  materialType: 'Aluminyum 6061' | 'Aluminyum 7075' | 'Celik 1045' | 'Celik 4140' | 'Titanyum Ti-6Al-4V' | 'Bakir C11000';
  billetDiameter: number;
  billetLength: number;
  extrusionRatio: number;
  dieAngle: number;
  frictionCoefficient: number;
  ramSpeed: number;
  temperature: number;
  containerDiameter: number;
  pressCapacity: number;
}

export const DovmeEkstruzyonProsesKuvvetVePresKapasiteCalculatorInputSchema = z.object({
  materialType: z.enum(['Aluminyum 6061', 'Aluminyum 7075', 'Celik 1045', 'Celik 4140', 'Titanyum Ti-6Al-4V', 'Bakir C11000']).default('Aluminyum 6061'),
  billetDiameter: z.number().min(10).max(500).default(100),
  billetLength: z.number().min(50).max(2000).default(300),
  extrusionRatio: z.number().min(1).max(100).default(20),
  dieAngle: z.number().min(15).max(90).default(45),
  frictionCoefficient: z.number().min(0.01).max(0.5).default(0.1),
  ramSpeed: z.number().min(0.5).max(50).default(5),
  temperature: z.number().min(20).max(600).default(400),
  containerDiameter: z.number().min(20).max(600).default(110),
  pressCapacity: z.number().min(1).max(100).default(10),
});

export interface DovmeEkstruzyonProsesKuvvetVePresKapasiteCalculatorOutput {
  requiredForce: number;
  breakdown: {
    extrusionPressure: number;
    billetArea: number;
    flowStress: number;
    strainRate: number;
    power: number;
    utilization: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: DovmeEkstruzyonProsesKuvvetVePresKapasiteCalculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.billetArea = ((): number => { try { const __v = Math.PI * (input.billetDiameter/2)**2; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.containerArea = ((): number => { try { const __v = Math.PI * (input.containerDiameter/2)**2; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.flowStress = ((): number => { try { const __v = materialFlowStress(input.temperature, input.materialType); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.extrusionPressure = ((): number => { try { const __v = results.flowStress * (0.8 + 1.2 * Math.log(input.extrusionRatio) + 0.5 * input.frictionCoefficient * (input.containerDiameter - input.billetDiameter) / (input.billetDiameter * Math.sin(input.dieAngle * Math.PI/180))); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.requiredForce = ((): number => { try { const __v = results.extrusionPressure * results.billetArea / 1e6; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.utilization = ((): number => { try { const __v = results.requiredForce / input.pressCapacity * 100; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.strainRate = ((): number => { try { const __v = 6 * input.ramSpeed * input.extrusionRatio * Math.log(input.extrusionRatio) / input.billetDiameter; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.power = ((): number => { try { const __v = results.requiredForce * input.ramSpeed / 1000; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateDovmeEkstruzyonProsesKuvvetVePresKapasiteCalculator(input: DovmeEkstruzyonProsesKuvvetVePresKapasiteCalculatorInput): DovmeEkstruzyonProsesKuvvetVePresKapasiteCalculatorOutput {
  const results = evaluateFormulas(input);
  const requiredForce = results.requiredForce ?? 0;
  const breakdown = {
    extrusionPressure: results.extrusionPressure,
    billetArea: results.billetArea,
    flowStress: results.flowStress,
    strainRate: results.strainRate,
    power: results.power,
    utilization: results.utilization,
  };

  // rule: containerDiameter > billetDiameter
  // rule: extrusionRatio > 1
  // rule: dieAngle > 0 && dieAngle < 90
  // rule: temperature > 0
  // rule: ramSpeed > 0
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): Gerekli kuvvet pres kapasitesini asiyor! Pres secimini gozden gecirin.
  // threshold skipped (non-JS): Yuksek ekstruzyon orani, malzeme catlamasi riski. Kalip tasarimini kontrol edin.
  // threshold skipped (non-JS): Dusuk sicaklik, akma dayanimini artirabilir. Isitma kontrolu onerilir.

  const dataConfidenceAdjusted = (() => { try { return results.requiredForce * (1 + 0.1 * (1 - dataConfidence)); } catch { return requiredForce; } })();

  return {
    requiredForce,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF raporu","CSV export","Trend analizi (gecmis hesaplamalar)","Pres karsilastirma","Detayli malzeme veritabani"],
  };
}
