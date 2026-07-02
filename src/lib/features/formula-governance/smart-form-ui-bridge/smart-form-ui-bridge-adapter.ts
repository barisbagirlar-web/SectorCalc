/**
 * Smart form UI bridge adapter - Phase 5H-G-C RenderPlan → UI manifest (no React/UI).
 */

import type { SmartFormRenderPlan } from "@/lib/features/formula-governance/smart-form-rendering/smart-form-render-types";
import {
  resolveComponentKindForRenderField,
  resolveComponentKindForSection,
} from "@/lib/features/formula-governance/smart-form-ui-bridge/component-kind-resolver";
import type {
  SmartFormComponentKind,
  SmartFormFieldComponentProps,
  SmartFormSectionComponentProps,
  SmartFormTrustTraceComponentProps,
  SmartFormUiBridgeManifest,
  SmartFormUiBridgeStatus,
  SmartFormUiLayoutProps,
} from "@/lib/features/formula-governance/smart-form-ui-bridge/smart-form-ui-bridge-types";

export type BuildSmartFormUiBridgeManifestParams = {
  readonly renderPlan: SmartFormRenderPlan;
};

function collectBadges(field: {
  readonly assumptionBadge?: string;
  readonly derivedBadge?: string;
  readonly advancedBadge?: string;
}): string[] {
  const badges: string[] = [];
  if (field.assumptionBadge) {
    badges.push(field.assumptionBadge);
  }
  if (field.derivedBadge) {
    badges.push(field.derivedBadge);
  }
  if (field.advancedBadge) {
    badges.push(field.advancedBadge);
  }
  return badges;
}

function resolveBridgeStatus(renderPlan: SmartFormRenderPlan): SmartFormUiBridgeStatus {
  if (renderPlan.blockers.length > 0 || renderPlan.readinessStatus === "blocked") {
    return "blocked";
  }
  if (renderPlan.readinessStatus !== "rendering_adapter_ready") {
    return "needs_render_plan";
  }
  return "ui_bridge_ready";
}

function buildTrustTraceProps(renderPlan: SmartFormRenderPlan): SmartFormTrustTraceComponentProps {
  const panel = renderPlan.trustTracePanel;
  return {
    enabled: panel.enabled,
    usedInputs: [...panel.usedInputKeys],
    assumptions: [...panel.assumptionKeys],
    derivedValues: [...panel.derivedValueKeys],
    validationSources: [...panel.validationSourceKeys],
    modelLimitations: [...panel.modelLimitationKeys],
  };
}

function buildLayoutProps(
  layout: SmartFormRenderPlan["mobileLayout"] | SmartFormRenderPlan["desktopLayout"],
): SmartFormUiLayoutProps {
  return {
    sectionOrder: [...layout.sectionOrder],
    placements: layout.placements.map((placement) => ({
      sectionId: placement.sectionId,
      columnIndex: placement.columnIndex,
      rowOrder: placement.rowOrder,
    })),
  };
}

export function buildSmartFormUiBridgeManifest(
  params: BuildSmartFormUiBridgeManifestParams,
): SmartFormUiBridgeManifest {
  const { renderPlan } = params;
  const blockers = [...renderPlan.blockers];
  const warnings = [...renderPlan.warnings];
  const status = resolveBridgeStatus(renderPlan);

  if (status !== "ui_bridge_ready") {
    return {
      slug: renderPlan.slug,
      status,
      sections: [],
      fields: [],
      trustTrace: {
        enabled: false,
        usedInputs: [],
        assumptions: [],
        derivedValues: [],
        validationSources: [],
        modelLimitations: [],
      },
      componentKinds: {},
      mobileProps: { sectionOrder: [], placements: [] },
      desktopProps: { sectionOrder: [], placements: [] },
      warnings,
      blockers,
    };
  }

  const componentKinds: Record<string, SmartFormComponentKind> = {};
  const sections: SmartFormSectionComponentProps[] = [];
  const fields: SmartFormFieldComponentProps[] = [];

  for (const section of renderPlan.sections) {
    const sectionKind = resolveComponentKindForSection(section.sectionType, section.fields);
    componentKinds[section.id] = sectionKind;

    const fieldKeys: string[] = [];
    for (const field of section.fields) {
      const fieldKind = resolveComponentKindForRenderField(field);
      componentKinds[field.key] = fieldKind;

      if (field.role === "derived" && field.editable) {
        blockers.push(`Derived field "${field.key}" must remain read-only in UI bridge manifest.`);
      }

      fieldKeys.push(field.key);
      fields.push({
        key: field.key,
        label: field.label,
        inputType: field.inputType,
        required: field.required,
        editable: field.editable,
        placeholder: field.placeholder,
        unitLabel: field.unitLabel,
        validationMessages: [...field.validationMessages],
        badges: collectBadges(field),
        visibility: field.visibility,
        sectionId: section.id,
        componentKind: fieldKind,
      });
    }

    sections.push({
      id: section.id,
      title: section.title,
      order: section.order,
      collapsible: section.collapsible,
      defaultExpanded: section.defaultExpanded,
      helpText: section.helpText,
      fields: fieldKeys,
      componentKind: sectionKind,
    });
  }

  const trustTrace = buildTrustTraceProps(renderPlan);
  if (trustTrace.enabled) {
    componentKinds[`${renderPlan.slug}-trust-trace`] = "trust_trace_panel";
  }

  return {
    slug: renderPlan.slug,
    status: blockers.length > 0 ? "blocked" : "ui_bridge_ready",
    sections,
    fields,
    trustTrace,
    componentKinds,
    mobileProps: buildLayoutProps(renderPlan.mobileLayout),
    desktopProps: buildLayoutProps(renderPlan.desktopLayout),
    warnings,
    blockers,
  };
}
