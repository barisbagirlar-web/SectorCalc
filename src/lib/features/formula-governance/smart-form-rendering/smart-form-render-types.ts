/**
 * Smart Form Rendering adapter types - Phase 5H-G-B (render plan only; no UI).
 */

import type { SmartFormFieldRole, SmartFormSectionType } from "@/lib/features/formula-governance/smart-form-architecture/smart-form-types";

export type SmartFormRenderMode =
  | "free_quick_check"
  | "premium_decision"
  | "professional_report";

export type SmartFormRenderReadinessStatus =
  | "rendering_adapter_ready"
  | "needs_smart_form_spec"
  | "blocked";

export type SmartFormInputType =
  | "number"
  | "readonly_display"
  | "assumption_display"
  | "hidden_validation_anchor";

export type SmartFormRenderVisibility =
  | "always"
  | "conditional"
  | "advanced_toggle"
  | "hidden_derived"
  | "hidden";

export type SmartFormRenderField = {
  readonly key: string;
  readonly label: string;
  readonly role: SmartFormFieldRole;
  readonly inputType: SmartFormInputType;
  readonly order: number;
  readonly required: boolean;
  readonly editable: boolean;
  readonly visibility: SmartFormRenderVisibility;
  readonly placeholder?: string;
  readonly unitLabel?: string;
  readonly validationMessages: readonly string[];
  readonly assumptionBadge?: string;
  readonly derivedBadge?: string;
  readonly advancedBadge?: string;
};

export type SmartFormRenderSection = {
  readonly id: string;
  readonly title: string;
  readonly sectionType: SmartFormSectionType;
  readonly order: number;
  readonly collapsible: boolean;
  readonly defaultExpanded: boolean;
  readonly fields: readonly SmartFormRenderField[];
  readonly helpText?: string;
};

export type SmartFormTrustTracePanel = {
  readonly enabled: boolean;
  readonly usedInputKeys: readonly string[];
  readonly assumptionKeys: readonly string[];
  readonly derivedValueKeys: readonly string[];
  readonly validationSourceKeys: readonly string[];
  readonly modelLimitationKeys: readonly string[];
};

export type SmartFormLayoutSectionPlacement = {
  readonly sectionId: string;
  readonly columnIndex: number;
  readonly rowOrder: number;
};

export type SmartFormMobileLayout = {
  readonly columns: 1;
  readonly sectionOrder: readonly string[];
  readonly placements: readonly SmartFormLayoutSectionPlacement[];
};

export type SmartFormDesktopLayout = {
  readonly maxColumns: 2;
  readonly sectionOrder: readonly string[];
  readonly placements: readonly SmartFormLayoutSectionPlacement[];
};

export type SmartFormRenderPlan = {
  readonly slug: string;
  readonly renderMode: SmartFormRenderMode;
  readonly readinessStatus: SmartFormRenderReadinessStatus;
  readonly sections: readonly SmartFormRenderSection[];
  readonly fieldCount: number;
  readonly requiredFieldCount: number;
  readonly advancedFieldCount: number;
  readonly derivedFieldCount: number;
  readonly assumptionCount: number;
  readonly trustTracePanel: SmartFormTrustTracePanel;
  readonly mobileLayout: SmartFormMobileLayout;
  readonly desktopLayout: SmartFormDesktopLayout;
  readonly warnings: readonly string[];
  readonly blockers: readonly string[];
};

export type BatchSmartFormRenderAuditResult = {
  readonly readySpecs: number;
  readonly renderingAdapterReady: number;
  readonly blocked: number;
  readonly derivedReadonlyViolations: number;
  readonly trustTracePanelCount: number;
  readonly renderPlans: readonly SmartFormRenderPlan[];
  readonly recommendedFirstUiPilot: readonly string[];
  readonly warnings: readonly string[];
  readonly blockers: readonly string[];
};
