/**
 * Smart Form UI bridge manifest types — Phase 5H-G-C (prop contract only; no UI).
 */

import type { SmartFormInputType, SmartFormRenderVisibility } from "@/lib/formula-governance/smart-form-rendering/smart-form-render-types";

export type SmartFormUiBridgeStatus =
  | "ui_bridge_ready"
  | "needs_render_plan"
  | "blocked";

export type SmartFormComponentKind =
  | "section_shell"
  | "field_input"
  | "field_readonly"
  | "assumption_callout"
  | "validation_message"
  | "advanced_toggle"
  | "trust_trace_panel";

export type SmartFormFieldComponentProps = {
  readonly key: string;
  readonly label: string;
  readonly inputType: SmartFormInputType;
  readonly required: boolean;
  readonly editable: boolean;
  readonly placeholder?: string;
  readonly unitLabel?: string;
  readonly validationMessages: readonly string[];
  readonly badges: readonly string[];
  readonly visibility: SmartFormRenderVisibility;
  readonly sectionId: string;
  readonly componentKind: SmartFormComponentKind;
};

export type SmartFormSectionComponentProps = {
  readonly id: string;
  readonly title: string;
  readonly order: number;
  readonly collapsible: boolean;
  readonly defaultExpanded: boolean;
  readonly helpText?: string;
  readonly fields: readonly string[];
  readonly componentKind: SmartFormComponentKind;
};

export type SmartFormTrustTraceComponentProps = {
  readonly enabled: boolean;
  readonly usedInputs: readonly string[];
  readonly assumptions: readonly string[];
  readonly derivedValues: readonly string[];
  readonly validationSources: readonly string[];
  readonly modelLimitations: readonly string[];
};

export type SmartFormUiLayoutProps = {
  readonly sectionOrder: readonly string[];
  readonly placements: readonly {
    readonly sectionId: string;
    readonly columnIndex: number;
    readonly rowOrder: number;
  }[];
};

export type SmartFormUiBridgeManifest = {
  readonly slug: string;
  readonly status: SmartFormUiBridgeStatus;
  readonly sections: readonly SmartFormSectionComponentProps[];
  readonly fields: readonly SmartFormFieldComponentProps[];
  readonly trustTrace: SmartFormTrustTraceComponentProps;
  readonly componentKinds: Readonly<Record<string, SmartFormComponentKind>>;
  readonly mobileProps: SmartFormUiLayoutProps;
  readonly desktopProps: SmartFormUiLayoutProps;
  readonly warnings: readonly string[];
  readonly blockers: readonly string[];
};

export type BatchSmartFormUiBridgeAuditResult = {
  readonly renderingReady: number;
  readonly uiBridgeReady: number;
  readonly blocked: number;
  readonly pilotManifestsReady: number;
  readonly manifests: readonly SmartFormUiBridgeManifest[];
  readonly pilotManifests: readonly SmartFormUiBridgeManifest[];
  readonly recommendedFirstUiPilot: readonly string[];
  readonly derivedReadonlyViolations: number;
  readonly warnings: readonly string[];
  readonly blockers: readonly string[];
};
