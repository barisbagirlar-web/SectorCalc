/**
 * Smart form render adapter — Phase 5H-G-B SmartFormPlan → SmartFormRenderPlan (no UI).
 */

import type {
  SmartFormFieldSpec,
  SmartFormPlan,
  SmartFormSection,
} from "@/lib/formula-governance/smart-form-architecture/smart-form-types";
import { buildSmartFormLayoutPlan } from "@/lib/formula-governance/smart-form-rendering/smart-form-layout-planner";
import { resolveSmartFormInputType } from "@/lib/formula-governance/smart-form-rendering/smart-form-input-type-resolver";
import type {
  SmartFormRenderField,
  SmartFormRenderMode,
  SmartFormRenderPlan,
  SmartFormRenderReadinessStatus,
  SmartFormRenderSection,
  SmartFormRenderVisibility,
  SmartFormTrustTracePanel,
} from "@/lib/formula-governance/smart-form-rendering/smart-form-render-types";

export type BuildSmartFormRenderPlanParams = {
  readonly smartFormSpec: SmartFormPlan;
  readonly renderMode: SmartFormRenderMode;
};

const RENDER_SECTION_ORDER = [
  "decision_goal",
  "required_inputs",
  "optional_refinements",
  "advanced_professional_inputs",
  "default_assumptions",
  "derived_values",
  "result_preview",
  "validation_messages",
  "trust_trace",
] as const;

function resolveReadinessStatus(spec: SmartFormPlan): SmartFormRenderReadinessStatus {
  if (spec.blockers.length > 0 || spec.readinessStatus === "blocked") {
    return "blocked";
  }
  if (spec.readinessStatus !== "ready_for_spec") {
    return "needs_smart_form_spec";
  }
  return "rendering_adapter_ready";
}

function isAdvancedExpanded(renderMode: SmartFormRenderMode): boolean {
  return renderMode === "premium_decision" || renderMode === "professional_report";
}

function mapVisibility(field: SmartFormFieldSpec): SmartFormRenderVisibility {
  if (field.role === "validation_only") {
    return "hidden";
  }
  if (field.visibility === "hidden_derived") {
    return "hidden_derived";
  }
  return field.visibility;
}

function buildRenderField(
  field: SmartFormFieldSpec,
  order: number,
  renderMode: SmartFormRenderMode,
): SmartFormRenderField {
  const resolved = resolveSmartFormInputType(field);
  const editable = field.role === "derived" || field.role === "assumption" ? false : field.userEditable;

  return {
    key: field.key,
    label: field.label,
    role: field.role,
    inputType: resolved.inputType,
    order,
    required: field.requiredForCalculation,
    editable,
    visibility: mapVisibility(field),
    placeholder: field.missingQuestion,
    unitLabel: resolved.unitLabel,
    validationMessages: [...field.validationMessages],
    assumptionBadge: field.role === "assumption" ? "Assumption" : undefined,
    derivedBadge: field.role === "derived" ? "Derived" : undefined,
    advancedBadge:
      field.role === "advanced"
        ? renderMode === "professional_report"
          ? "Professional"
          : "Advanced"
        : undefined,
  };
}

function buildTrustTracePanel(spec: SmartFormPlan): SmartFormTrustTracePanel {
  const mapping = spec.trustTraceMapping;
  const enabled =
    mapping.usedInputs.length > 0 ||
    mapping.derivedValues.length > 0 ||
    mapping.defaultAssumptions.length > 0;

  return {
    enabled,
    usedInputKeys: [...mapping.usedInputs],
    assumptionKeys: spec.defaultAssumptionDisplays.map((entry) => entry.id),
    derivedValueKeys: [...mapping.derivedValues],
    validationSourceKeys: [...mapping.validationSources],
    modelLimitationKeys: [...mapping.modelLimitationsSource],
  };
}

function shouldIncludeSection(section: SmartFormSection, fields: SmartFormFieldSpec[]): boolean {
  if (section.type === "trust_trace") {
    return true;
  }
  return fields.some((field) => section.fieldKeys.includes(field.key));
}

function buildRenderSections(
  spec: SmartFormPlan,
  renderMode: SmartFormRenderMode,
): SmartFormRenderSection[] {
  const fieldsByKey = new Map(spec.fields.map((field) => [field.key, field]));
  const sections: SmartFormRenderSection[] = [];
  let globalFieldOrder = 0;

  for (const sectionType of RENDER_SECTION_ORDER) {
    const sourceSection = spec.sections.find((section) => section.type === sectionType);
    if (!sourceSection) {
      continue;
    }

    const sectionFields = sourceSection.fieldKeys
      .map((key) => fieldsByKey.get(key))
      .filter((field): field is SmartFormFieldSpec => field !== undefined);

    if (!shouldIncludeSection(sourceSection, sectionFields) && sectionType !== "trust_trace") {
      continue;
    }

    const roleOrder: Record<string, number> = {
      required: 0,
      optional: 1,
      advanced: 2,
      assumption: 3,
      derived: 4,
      validation_only: 5,
    };

    const orderedFields = [...sectionFields].sort((left, right) => {
      const leftOrder = roleOrder[left.role] ?? 99;
      const rightOrder = roleOrder[right.role] ?? 99;
      if (leftOrder !== rightOrder) {
        return leftOrder - rightOrder;
      }
      return left.key.localeCompare(right.key);
    });

    const renderFields = orderedFields.map((field) => {
      const renderField = buildRenderField(field, globalFieldOrder, renderMode);
      globalFieldOrder += 1;
      return renderField;
    });

    const collapsible =
      sectionType === "advanced_professional_inputs" ||
      sectionType === "optional_refinements" ||
      sectionType === "derived_values";

    let defaultExpanded = !sourceSection.collapsedByDefault;
    if (sectionType === "advanced_professional_inputs") {
      defaultExpanded = isAdvancedExpanded(renderMode);
    }
    if (renderMode === "free_quick_check" && sectionType === "advanced_professional_inputs") {
      defaultExpanded = false;
    }

    sections.push({
      id: `${spec.slug}-${sectionType}`,
      title: sourceSection.title,
      sectionType,
      order: sections.length,
      collapsible,
      defaultExpanded,
      fields: renderFields,
      helpText: sourceSection.description,
    });
  }

  if (sections.every((section) => section.sectionType !== "trust_trace")) {
    sections.push({
      id: `${spec.slug}-trust_trace`,
      title: "Trust trace",
      sectionType: "trust_trace",
      order: sections.length,
      collapsible: false,
      defaultExpanded: true,
      fields: [],
      helpText: "Governance trust trace panel mapping for future report output.",
    });
  }

  return sections;
}

export function buildSmartFormRenderPlan(
  params: BuildSmartFormRenderPlanParams,
): SmartFormRenderPlan {
  const { smartFormSpec, renderMode } = params;
  const blockers = [...smartFormSpec.blockers];
  const warnings = [...smartFormSpec.warnings];
  const readinessStatus = resolveReadinessStatus(smartFormSpec);

  if (readinessStatus === "needs_smart_form_spec") {
    return {
      slug: smartFormSpec.slug,
      renderMode,
      readinessStatus,
      sections: [],
      fieldCount: 0,
      requiredFieldCount: 0,
      advancedFieldCount: 0,
      derivedFieldCount: 0,
      assumptionCount: 0,
      trustTracePanel: {
        enabled: false,
        usedInputKeys: [],
        assumptionKeys: [],
        derivedValueKeys: [],
        validationSourceKeys: [],
        modelLimitationKeys: [],
      },
      mobileLayout: { columns: 1, sectionOrder: [], placements: [] },
      desktopLayout: { maxColumns: 2, sectionOrder: [], placements: [] },
      warnings,
      blockers,
    };
  }

  const sections = buildRenderSections(smartFormSpec, renderMode);
  const allFields = sections.flatMap((section) => section.fields);

  for (const field of allFields) {
    if (field.role === "derived" && field.editable) {
      blockers.push(`Derived field "${field.key}" must be read-only in render plan.`);
    }
  }

  const requiredFieldCount = allFields.filter((field) => field.required).length;
  if (requiredFieldCount === 0 && readinessStatus === "rendering_adapter_ready") {
    blockers.push(`Render plan for "${smartFormSpec.slug}" requires at least one required field.`);
  }

  const trustTracePanel = buildTrustTracePanel(smartFormSpec);

  const basePlan: SmartFormRenderPlan = {
    slug: smartFormSpec.slug,
    renderMode,
    readinessStatus: blockers.length > 0 ? "blocked" : readinessStatus,
    sections,
    fieldCount: allFields.length,
    requiredFieldCount,
    advancedFieldCount: allFields.filter((field) => field.role === "advanced").length,
    derivedFieldCount: allFields.filter((field) => field.role === "derived").length,
    assumptionCount: allFields.filter((field) => field.role === "assumption").length,
    trustTracePanel,
    mobileLayout: { columns: 1, sectionOrder: [], placements: [] },
    desktopLayout: { maxColumns: 2, sectionOrder: [], placements: [] },
    warnings,
    blockers,
  };

  const layouts = buildSmartFormLayoutPlan(basePlan);

  return {
    ...basePlan,
    mobileLayout: layouts.mobileLayout,
    desktopLayout: layouts.desktopLayout,
  };
}
