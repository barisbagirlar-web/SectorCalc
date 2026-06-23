import type { SmartFormMode } from "@/lib/smart-form/dynamic-form-types";

export type PremiumScenarioEntry = {
  readonly id: string;
  readonly labelEn: string;
  readonly descriptionEn: string;
  readonly inputKeys?: readonly string[];
};

export type PremiumScenarioConfig = {
  readonly defaultScenarioId: string;
  readonly scenarios: readonly PremiumScenarioEntry[];
  readonly modeByKey?: Record<string, SmartFormMode>;
};

/** Scenario metadata for all premium analyzers. */
export const PREMIUM_SMART_FORM_SCENARIO_CONFIG: Record<string, PremiumScenarioConfig> = {};
