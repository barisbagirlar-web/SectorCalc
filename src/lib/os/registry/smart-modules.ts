/**
 * Smart Modules — sektörel uzmanlık modül kataloğu.
 * IndustrialRegistry.features bu kimlikleri referans alır.
 */

export const SmartModuleIds = {
  decision_support: "decision_support",
  tolerance_opt: "tolerance_opt",
  hidden_loss: "hidden_loss",
  benchmarking: "benchmarking",
  prescriptions: "prescriptions",
  offline_mode: "offline_mode",
  fiscal_multi: "fiscal_multi",
  seasonal_loss: "seasonal_loss",
  machine_age: "machine_age",
  energy_opt: "energy_opt",
  deadhead: "deadhead",
  compliance: "compliance",
  soil_nutrients: "soil_nutrients",
  feed_efficiency: "feed_efficiency",
  carbon_cbam: "carbon_cbam",
} as const;

export type SmartModuleId = (typeof SmartModuleIds)[keyof typeof SmartModuleIds];

export const SmartModules: Record<SmartModuleId, string> = {
  decision_support: "Real-time Action Plans",
  tolerance_opt: "Tolerance-Cost Analysis",
  hidden_loss: "Hidden Loss Detector",
  benchmarking: "Industry Benchmark",
  prescriptions: "Actionable Prescriptions",
  offline_mode: "Offline-First UX",
  fiscal_multi: "Tax & Multi-Currency",
  seasonal_loss: "Seasonal Impact Engine",
  machine_age: "Asset Aging Analysis",
  energy_opt: "Energy Tariff Optimizer",
  deadhead: "Deadhead Detector",
  compliance: "Legal & Penalty Risk",
  soil_nutrients: "Soil-Nutrient Engine",
  feed_efficiency: "Feed Efficiency Module",
  carbon_cbam: "CBAM & Carbon Tracker",
};

export function hasSmartModule(
  features: readonly SmartModuleId[],
  moduleId: SmartModuleId,
): boolean {
  return features.includes(moduleId);
}

export function listSmartModules(features: readonly SmartModuleId[]): SmartModuleId[] {
  return [...features];
}

export function resolveSmartModuleLabel(moduleId: SmartModuleId): string {
  return SmartModules[moduleId];
}

export function isSmartModuleId(value: string): value is SmartModuleId {
  return Object.values(SmartModuleIds).includes(value as SmartModuleId);
}

/** Intelligence Layer UI — legacy expert feature bayraklarına köprü. */
export type ExpertFeatureKey =
  | "hiddenLoss"
  | "energyOpt"
  | "benchmarking"
  | "deadhead"
  | "compliance"
  | "weatherRisk"
  | "carbonCbam"
  | "decisionSupport";

export type SectorExpertFeatures = Partial<Record<ExpertFeatureKey, boolean>>;

export function smartModulesToExpertFeatures(
  features: readonly SmartModuleId[],
): SectorExpertFeatures {
  return {
    decisionSupport:
      hasSmartModule(features, SmartModuleIds.decision_support) ||
      hasSmartModule(features, SmartModuleIds.prescriptions),
    benchmarking: hasSmartModule(features, SmartModuleIds.benchmarking),
    hiddenLoss: hasSmartModule(features, SmartModuleIds.hidden_loss),
    deadhead: hasSmartModule(features, SmartModuleIds.deadhead),
    compliance: hasSmartModule(features, SmartModuleIds.compliance),
    energyOpt: hasSmartModule(features, SmartModuleIds.energy_opt),
    carbonCbam: hasSmartModule(features, SmartModuleIds.carbon_cbam),
    weatherRisk: hasSmartModule(features, SmartModuleIds.seasonal_loss),
  };
}
