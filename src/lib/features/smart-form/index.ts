export {
  DYNAMIC_SMART_FORM_PILOT_SLUGS,
  isDynamicSmartFormPilotSlug,
  slugToSmartFormToolKey,
  type DynamicSmartFormPilotSlug,
  type SmartFormCondition,
  type SmartFormDefinition,
  type SmartFormMode,
  type SmartFormScenario,
  type SmartFormValidationResult,
  type SmartInputKind,
  type SmartInputRequirement,
} from "@/lib/features/smart-form/dynamic-form-types";

export {
  assertPremiumSmartFormCoverage,
  getDefaultScenarioId,
  getPremiumSmartFormDefinition,
  getPremiumSmartFormSlugs,
  getSmartFormDefinition,
  hasPremiumSmartFormDefinition,
  PREMIUM_SMART_FORM_SLUGS,
  type PremiumSmartFormSlug,
} from "@/lib/features/smart-form/premium-smart-form-definitions";

export {
  assertAllPremiumSmartFormsRuntimeCompatible,
  buildCanonicalRuntimeInputs,
  getFormulaContractInputKeys,
  getSmartFormInputKeys,
  validateSmartFormRuntimeCompatibility,
  type CanonicalRuntimeInputsResult,
  type RuntimeCompatibilityResult,
} from "@/lib/features/smart-form/runtime-compatibility";

export { getRequiredInputs, getScenarioById, getVisibleInputs } from "@/lib/features/smart-form/requirements";
export { normalizeSmartFormValues, validateSmartForm } from "@/lib/features/smart-form/validation";
