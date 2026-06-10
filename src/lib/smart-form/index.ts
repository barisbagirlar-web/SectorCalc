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
} from "@/lib/smart-form/dynamic-form-types";

export {
  assertPremiumSmartFormCoverage,
  getDefaultScenarioId,
  getPremiumSmartFormDefinition,
  getPremiumSmartFormSlugs,
  getSmartFormDefinition,
  hasPremiumSmartFormDefinition,
  PREMIUM_SMART_FORM_SLUGS,
  type PremiumSmartFormSlug,
} from "@/lib/smart-form/premium-smart-form-definitions";

export {
  assertAllPremiumSmartFormsRuntimeCompatible,
  buildCanonicalRuntimeInputs,
  getFormulaContractInputKeys,
  getSmartFormInputKeys,
  validateSmartFormRuntimeCompatibility,
  type CanonicalRuntimeInputsResult,
  type RuntimeCompatibilityResult,
} from "@/lib/smart-form/runtime-compatibility";

export { getRequiredInputs, getScenarioById, getVisibleInputs } from "@/lib/smart-form/requirements";
export { normalizeSmartFormValues, validateSmartForm } from "@/lib/smart-form/validation";
