// SectorCalc SuperV4 Universal Industrial Decision Form — V5.3.1 barrel exports

export { UniversalIndustrialDecisionForm, default } from "./UniversalIndustrialDecisionForm";
export type { UniversalIndustrialDecisionFormProps } from "./UniversalIndustrialDecisionForm";
export {
  createInitialUniversalFormState,
  createNormalizedAuditFromPreview,
  getExecutionStateLabel,
  mapStatusToExecutionState,
  REQUIRED_TRANSITIONS,
  universalFormMachineReducer,
} from "./form-state-machine";
export type {
  EvidenceFieldState,
  NormalizedPreviewItem,
  UniversalFormMachineEvent,
  UniversalFormMachineState,
  ValidationIssue,
} from "./form-state-machine";
export { useUniversalIndustrialDecisionFormMachine } from "./useUniversalIndustrialDecisionFormMachine";
export type { MachineApi, MachineOptions } from "./useUniversalIndustrialDecisionFormMachine";
export * from "./contract-types";
export { buildSuperV4SchemaFromPremiumSchema } from "./premium-schema-bridge";
