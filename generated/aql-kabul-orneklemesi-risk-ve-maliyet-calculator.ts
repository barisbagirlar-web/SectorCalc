// Auto-generated from aql-kabul-orneklemesi-risk-ve-maliyet-calculator-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface AqlKabulOrneklemesiRiskVeMaliyetCalculatorInput {
  lotSize: number;
  aql: number;
  defectRate: number;
  sampleSize: number;
  acceptNumber: number;
  unitCost: number;
  reworkCostPerUnit: number;
  rejectionCostPerUnit: number;
  inspectionCostPerUnit: number;
  dataConfidence: number;
}

export const AqlKabulOrneklemesiRiskVeMaliyetCalculatorInputSchema = z.object({
  lotSize: z.number().min(1).max(1000000).default(1000),
  aql: z.number().min(0.01).max(10).default(1),
  defectRate: z.number().min(0).max(100).default(2),
  sampleSize: z.number().min(1).max(10000).default(80),
  acceptNumber: z.number().min(0).max(100).default(2),
  unitCost: z.number().min(0.01).max(100000).default(10),
  reworkCostPerUnit: z.number().min(0).max(100000).default(5),
  rejectionCostPerUnit: z.number().min(0).max(100000).default(8),
  inspectionCostPerUnit: z.number().min(0).max(1000).default(1),
  dataConfidence: z.number().min(0).max(100).default(90),
});

export interface AqlKabulOrneklemesiRiskVeMaliyetCalculatorOutput {
  totalExposure: number;
  breakdown: {
    probabilityOfAcceptance: number;
    producerRisk: number;
    consumerRisk: number;
    expectedDefectsInLot: number;
    expectedDefectsInSample: number;
    expectedDefectsAfterAcceptance: number;
    inspectionCost: number;
    reworkCost: number;
    rejectionCost: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: AqlKabulOrneklemesiRiskVeMaliyetCalculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.probabilityOfAcceptance = P_accept = sum_{k=0}^{input.acceptNumber} (C(input.sampleSize, k) * (input.defectRate/100)^k * (1 - input.defectRate/100)^(input.sampleSize - k));
  results.producerRisk = alpha = 1 - P_accept (when input.defectRate = AQL);
  results.consumerRisk = beta = P_accept (when input.defectRate = LTPD, e.g., 2*AQL);
  results.expectedDefectsInLot = expectedDefects = input.lotSize * (input.defectRate/100);
  results.expectedDefectsInSample = expectedDefectsSample = input.sampleSize * (input.defectRate/100);
  results.expectedDefectsAfterAcceptance = expectedDefectsAccepted = (input.lotSize - input.sampleSize) * (input.defectRate/100) * P_accept;
  results.totalExposure = results.totalExposure = (expectedDefectsAccepted * input.rejectionCostPerUnit) + (input.sampleSize * input.inspectionCostPerUnit) + (results.expectedDefectsInSample * input.reworkCostPerUnit);
  results.variancePercent = results.variancePercent = (input.defectRate - input.aql) / input.aql * 100;
  results.summaryLevel = results.summaryLevel = (results.totalExposure > 3 * input.lotSize * input.unitCost) ? 'critical' : (results.totalExposure > 1 * input.lotSize * input.unitCost) ? 'warning' : 'normal';
  results.primaryDriver = results.primaryDriver = (input.defectRate > input.aql) ? 'input.defectRate' : 'input.sampleSize';
  results.decisionVerdict = results.decisionVerdict = (input.defectRate <= input.aql) ? 'accept' : (P_accept > 0.5) ? 'accept' : 'reject';
  results.dataConfidenceAdjusted = results.dataConfidenceAdjusted = results.totalExposure * (1 + (100 - input.dataConfidence)/100);
  return results;
}

export function calculateAqlKabulOrneklemesiRiskVeMaliyetCalculator(input: AqlKabulOrneklemesiRiskVeMaliyetCalculatorInput): AqlKabulOrneklemesiRiskVeMaliyetCalculatorOutput {
  const results = evaluateFormulas(input);
  const totalExposure = results.totalExposure;
  const breakdown = {
    probabilityOfAcceptance: results.probabilityOfAcceptance,
    producerRisk: results.producerRisk,
    consumerRisk: results.consumerRisk,
    expectedDefectsInLot: results.expectedDefectsInLot,
    expectedDefectsInSample: results.expectedDefectsInSample,
    expectedDefectsAfterAcceptance: results.expectedDefectsAfterAcceptance,
    inspectionCost: results.inspectionCost,
    reworkCost: results.reworkCost,
    rejectionCost: results.rejectionCost,
  };

  // rule: sampleSize must be <= lotSize
  // rule: acceptNumber must be <= sampleSize
  // rule: aql must be between 0.01 and 10
  // rule: defectRate must be between 0 and 100
  // rule: unitCost, reworkCostPerUnit, rejectionCostPerUnit, inspectionCostPerUnit must be >= 0
  // rule: dataConfidence must be between 0 and 100
  // threshold defectRate > aql * 2: Kritik: Gerçek kusur oranı AQL'nin iki katından fazla, yüksek risk
  // threshold defectRate > aql: Uyarı: Gerçek kusur oranı AQL'yi aşıyor
  // threshold sampleSize < 30: Uyarı: Örneklem büyüklüğü çok küçük, istatistiksel güven düşük
  // threshold acceptNumber == 0: Uyarı: Sıfır kabul sayısı, çok katı plan
  // threshold inspectionCostPerUnit > unitCost * 0.5: Uyarı: Muayene maliyeti birim maliyetin yarısından fazla
  const hiddenLossDrivers: string[] = ["defectRate > aql * 2 ise: 'Yüksek kusur oranı nedeniyle gizli kayıp riski'","sampleSize < 30 ise: 'Küçük örneklem nedeniyle düşük güven'","acceptNumber == 0 ise: 'Sıfır kabul sayısı nedeniyle yüksek red riski'"];
  const suggestedActions: string[] = ["defectRate > aql ise: 'Kusur oranını düşürmek için süreç iyileştirme yapın'","producerRisk > 0.05 ise: 'Örneklem büyüklüğünü artırın veya AQL'yi gevşetin'","consumerRisk > 0.10 ise: 'Kabul sayısını azaltın veya örneklem büyüklüğünü artırın'","inspectionCost > unitCost*0.2 ise: 'Muayene yöntemini otomatikleştirin veya örneklem planını optimize edin'"];
  const dataConfidenceAdjusted = results.dataConfidenceAdjusted;

  return {
    totalExposure,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF raporu","CSV export","Trend analizi (geçmiş verilerle karşılaştırma)","Detaylı risk raporu (OC eğrisi, risk tablosu)","Karşılaştırmalı senaryo analizi"],
  };
}
