/**
 * @deprecated Import from `@/lib/features/tools/cnc-logic` instead.
 * Kept for backward compatibility with pilot imports.
 */
export {
  CNC_DEFAULT_HOURLY_RATE_USD as CNC_PILOT_DEFAULT_MACHINE_RATE_USD,
  buildCncMarginCoreInputs as buildCncPremiumInputsFromPilot,
  calculateCncNaiveCost as calculateCncPilotNaiveCost,
  type CncMachineTimeInputs as CncPilotInputs,
  type CncNaiveCostResult as CncPilotNaiveResult,
} from "@/lib/features/tools/cnc-logic";
