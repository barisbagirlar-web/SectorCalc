// Auto-generated from boru-hatti-surtunme-ve-pompa-enerji-kayip-calculator-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface BoruHattiSurtunmeVePompaEnerjiKayipCalculatorInput {
  pipeLength: number;
  pipeDiameter: number;
  flowRate: number;
  fluidDensity: number;
  fluidViscosity: number;
  pipeRoughness: number;
  pumpEfficiency: number;
  electricityCost: number;
  operatingHours: number;
  fittingCount: number;
}

export const BoruHattiSurtunmeVePompaEnerjiKayipCalculatorInputSchema = z.object({
  pipeLength: z.number().min(1).max(10000).default(100),
  pipeDiameter: z.number().min(10).max(1000).default(100),
  flowRate: z.number().min(0.1).max(10000).default(50),
  fluidDensity: z.number().min(1).max(2000).default(1000),
  fluidViscosity: z.number().min(0.1).max(1000).default(1),
  pipeRoughness: z.number().min(0.001).max(10).default(0.05),
  pumpEfficiency: z.number().min(10).max(100).default(75),
  electricityCost: z.number().min(0.01).max(1).default(0.12),
  operatingHours: z.number().min(0).max(8760).default(8000),
  fittingCount: z.number().min(0).max(100).default(10),
});

export interface BoruHattiSurtunmeVePompaEnerjiKayipCalculatorOutput {
  totalExposure: number;
  breakdown: {
    flowVelocity: number;
    reynoldsNumber: number;
    frictionFactor: number;
    frictionLoss: number;
    minorLoss: number;
    totalHeadLoss: number;
    hydraulicPower: number;
    shaftPower: number;
    annualEnergyConsumption: number;
    annualEnergyCost: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: BoruHattiSurtunmeVePompaEnerjiKayipCalculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.flowVelocity = input.flowRate / (3600 * pi * (input.pipeDiameter/2000)^2);
  results.reynoldsNumber = input.fluidDensity * results.flowVelocity * (input.pipeDiameter/1000) / (input.fluidViscosity/1000);
  results.frictionFactor = if results.reynoldsNumber < 2000 then 64/results.reynoldsNumber else 1/(-2*log10(input.pipeRoughness/(3.7*input.pipeDiameter/1000) + 2.51/(results.reynoldsNumber*sqrt(results.frictionFactor))))^2 (iterative);
  results.frictionLoss = results.frictionFactor * (input.pipeLength/(input.pipeDiameter/1000)) * (input.fluidDensity * results.flowVelocity^2 / 2);
  results.minorLoss = input.fittingCount * 0.5 * input.fluidDensity * results.flowVelocity^2 / 2;
  results.totalHeadLoss = (results.frictionLoss + results.minorLoss) / (input.fluidDensity * 9.81);
  results.hydraulicPower = input.flowRate/3600 * results.totalHeadLoss * input.fluidDensity * 9.81;
  results.shaftPower = results.hydraulicPower / (input.pumpEfficiency/100);
  results.annualEnergyConsumption = results.shaftPower * input.operatingHours;
  results.annualEnergyCost = results.annualEnergyConsumption * input.electricityCost;
  results.totalExposure = results.annualEnergyCost;
  results.variancePercent = 0;
  results.summaryLevel = if results.totalExposure > 3 then 'critical' else if results.totalExposure > 1 then 'warning' else 'normal';
  results.primaryDriver = if results.frictionLoss > results.minorLoss then 'results.frictionLoss' else 'results.minorLoss';
  results.decisionVerdict = if results.summaryLevel == 'critical' then 'review required' else 'acceptable';
  return results;
}

export function calculateBoruHattiSurtunmeVePompaEnerjiKayipCalculator(input: BoruHattiSurtunmeVePompaEnerjiKayipCalculatorInput): BoruHattiSurtunmeVePompaEnerjiKayipCalculatorOutput {
  const results = evaluateFormulas(input);
  const totalExposure = results.totalExposure;
  const breakdown = {
    flowVelocity: results.flowVelocity,
    reynoldsNumber: results.reynoldsNumber,
    frictionFactor: results.frictionFactor,
    frictionLoss: results.frictionLoss,
    minorLoss: results.minorLoss,
    totalHeadLoss: results.totalHeadLoss,
    hydraulicPower: results.hydraulicPower,
    shaftPower: results.shaftPower,
    annualEnergyConsumption: results.annualEnergyConsumption,
    annualEnergyCost: results.annualEnergyCost,
  };

  // rule: pipeLength > 0
  // rule: pipeDiameter > 0
  // rule: flowRate > 0
  // rule: fluidDensity > 0
  // rule: fluidViscosity > 0
  // rule: pipeRoughness >= 0
  // rule: pumpEfficiency between 0 and 100
  // rule: electricityCost >= 0
  // rule: operatingHours between 0 and 8760
  // rule: fittingCount >= 0
  // threshold frictionLossCritical: frictionLoss > 100000 Pa
  // threshold energyCostWarning: annualEnergyCost > 10000 USD
  // threshold pumpEfficiencyLow: pumpEfficiency < 50
  const hiddenLossDrivers: string[] = ["frictionLoss > 100000 Pa","annualEnergyCost > 10000 USD","pumpEfficiency < 50"];
  const suggestedActions: string[] = ["Boru çapını artırarak sürtünme kaybını azaltın.","Pompa verimini artırmak için bakım yapın veya daha verimli pompa seçin.","Dirsek sayısını azaltarak yerel kayıpları düşürün.","Akış hızını düşürmek için paralel boru hattı ekleyin."];
  const dataConfidenceAdjusted = results.totalExposure;

  return {
    totalExposure,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF raporu","CSV veri indirme","Trend analizi (zaman serisi)","Senaryo karşılaştırma","Detaylı grafikler","Özelleştirilebilir varsayılan değerler"],
  };
}
