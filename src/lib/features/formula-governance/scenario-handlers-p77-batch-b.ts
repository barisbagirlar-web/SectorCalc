type ScenarioHandler = () => void;

export const KWH_CONSUMPTION_SCENARIOS: Record<string, ScenarioHandler> = {};
export const PAINT_COVERAGE_SCENARIOS: Record<string, ScenarioHandler> = {};
export const PLUMBING_FIXTURE_SCENARIOS: Record<string, ScenarioHandler> = {};
export const HOME_RENOVATION_M2_SCENARIOS: Record<string, ScenarioHandler> = {};

export const P77_BATCH_B_SCENARIO_HANDLERS: Record<string, Record<string, ScenarioHandler>> = {
  "kwh-consumption-check": KWH_CONSUMPTION_SCENARIOS,
  "paint-coverage-cost-check": PAINT_COVERAGE_SCENARIOS,
  "plumbing-fixture-cost-check": PLUMBING_FIXTURE_SCENARIOS,
  "home-renovation-m2": HOME_RENOVATION_M2_SCENARIOS,
};
