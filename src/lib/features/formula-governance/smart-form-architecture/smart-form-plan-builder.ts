/**
 * Smart form plan builder - Phase 5H-G-A deterministic form planning (no UI).
 */

import type { ControlledInputDesignPatch } from "@/lib/features/formula-governance/input-design-audit/controlled-input-patch/controlled-input-patch-types";
import type { ToolMigrationPlanItem } from "@/lib/features/formula-governance/input-design-audit/migration-plan/migration-plan-types";
import { getFormulaContractBySlug } from "@/lib/features/formula-governance/contracts";
import {
  humanizeFieldKey,
  inferFieldDimension,
} from "@/lib/features/formula-governance/smart-form-architecture/form-field-helpers";
import { buildMissingInputQuestions } from "@/lib/features/formula-governance/smart-form-architecture/missing-input-question-planner";
import { evaluateSmartFormReadiness } from "@/lib/features/formula-governance/smart-form-architecture/smart-form-readiness-gate";
import type {
  SmartFormAssumptionDisplay,
  SmartFormDerivedValueDisplay,
  SmartFormFieldRole,
  SmartFormFieldSpec,
  SmartFormPlan,
  SmartFormSection,
  SmartFormSectionType,
  SmartFormValidationMessagePlan,
} from "@/lib/features/formula-governance/smart-form-architecture/smart-form-types";
import { buildTrustTraceFieldMapping } from "@/lib/features/formula-governance/smart-form-architecture/trust-trace-field-mapping";
import type { BatchAlignmentSummary } from "@/lib/features/formula-governance/requirement-engine/batch-alignment-audit";
import type { RequirementSolveResult } from "@/lib/features/formula-governance/requirement-engine/requirement-engine-types";

const SECTION_META: Record<
  SmartFormSectionType,
  { readonly title: string; readonly description: string; readonly collapsedByDefault: boolean }
> = {
  decision_goal: {
    title: "Decision goal",
    description: "What this tool helps you decide before entering job inputs.",
    collapsedByDefault: false,
  },
  required_inputs: {
    title: "Required inputs",
    description: "Core job inputs required for a valid calculation path.",
    collapsedByDefault: false,
  },
  optional_refinements: {
    title: "Optional refinements",
    description: "Recommended overrides that improve estimate fidelity without breaking defaults.",
    collapsedByDefault: true,
  },
  advanced_professional_inputs: {
    title: "Advanced professional inputs",
    description: "Professional depth inputs for smart-form expansion; governance placeholders until UI phase.",
    collapsedByDefault: true,
  },
  default_assumptions: {
    title: "Default assumptions",
    description: "Assumptions displayed before calculation; production math unchanged.",
    collapsedByDefault: false,
  },
  derived_values: {
    title: "Derived values",
    description: "Read-only derived outputs mapped from production formula paths.",
    collapsedByDefault: true,
  },
  validation_messages: {
    title: "Validation messages",
    description: "Runtime validation and dimension guard messages for the smart form.",
    collapsedByDefault: false,
  },
  result_preview: {
    title: "Result preview",
    description: "Contract outputs available for trust trace and result preview sections.",
    collapsedByDefault: false,
  },
  trust_trace: {
    title: "Trust trace",
    description: "Field mapping for future trust trace report - governance only in this phase.",
    collapsedByDefault: false,
  },
};

export type BuildSmartFormPlanParams = {
  readonly migrationPlanItem: ToolMigrationPlanItem;
  readonly controlledInputPatch?: ControlledInputDesignPatch;
  readonly requirementResult?: RequirementSolveResult;
  readonly alignmentSummary?: BatchAlignmentSummary;
};

function buildInputField(
  key: string,
  role: Exclude<SmartFormFieldRole, "assumption" | "validation_only" | "derived">,
  section: SmartFormSectionType,
  source: SmartFormFieldSpec["source"],
  professionalNote?: string,
): SmartFormFieldSpec {
  const dimensionMeta = inferFieldDimension(key);
  const visibility =
    role === "required"
      ? "always"
      : role === "optional"
        ? "conditional"
        : "advanced_toggle";

  return {
    key,
    label: humanizeFieldKey(key),
    role,
    section,
    dimension: dimensionMeta.dimension,
    unit: dimensionMeta.unit,
    source,
    userEditable: true,
    requiredForCalculation: role === "required",
    validationMessages: [],
    professionalNote,
    visibility,
  };
}

function buildDerivedField(key: string, source: SmartFormFieldSpec["source"]): SmartFormFieldSpec {
  const dimensionMeta = inferFieldDimension(key);
  return {
    key,
    label: humanizeFieldKey(key),
    role: "derived",
    section: "derived_values",
    dimension: dimensionMeta.dimension,
    unit: dimensionMeta.unit,
    source,
    userEditable: false,
    requiredForCalculation: false,
    validationMessages: [],
    professionalNote: "Derived output - read-only trust trace; production formula unchanged.",
    visibility: "hidden_derived",
  };
}

function buildAssumptionField(
  key: string,
  text: string,
  displayOrder: number,
): SmartFormFieldSpec {
  return {
    key: `assumption-${displayOrder}`,
    label: text,
    role: "assumption",
    section: "default_assumptions",
    source: "assumption",
    userEditable: false,
    requiredForCalculation: false,
    validationMessages: [],
    visibility: "always",
  };
}

function buildValidationField(
  ruleId: string,
  message: string,
  kind: string,
): SmartFormFieldSpec {
  return {
    key: `validation-${ruleId}`,
    label: message,
    role: "validation_only",
    section: "validation_messages",
    source: "contract",
    userEditable: false,
    requiredForCalculation: false,
    validationMessages: [message],
    visibility: "always",
  };
}

function buildSections(fieldKeysBySection: Map<SmartFormSectionType, string[]>): SmartFormSection[] {
  return (Object.keys(SECTION_META) as SmartFormSectionType[]).map((type) => ({
    type,
    title: SECTION_META[type].title,
    description: SECTION_META[type].description,
    fieldKeys: fieldKeysBySection.get(type) ?? [],
    collapsedByDefault: SECTION_META[type].collapsedByDefault,
  }));
}

export function buildSmartFormPlan(params: BuildSmartFormPlanParams): SmartFormPlan {
  const { migrationPlanItem, controlledInputPatch, requirementResult, alignmentSummary } = params;
  const slug = migrationPlanItem.slug;
  const contract = getFormulaContractBySlug(slug);
  const readiness = evaluateSmartFormReadiness({
    migrationPlanItem,
    controlledInputPatch,
    alignmentSummary,
  });

  const blockers = [...readiness.blockers];
  const warnings = [...readiness.warnings];
  const fields: SmartFormFieldSpec[] = [];

  if (contract) {
    fields.push({
      key: "decision-goal",
      label: contract.userDecision,
      role: "validation_only",
      section: "decision_goal",
      source: "contract",
      userEditable: false,
      requiredForCalculation: false,
      validationMessages: [],
      professionalNote: contract.purpose,
      visibility: "always",
    });
  }

  if (controlledInputPatch) {
    for (const key of controlledInputPatch.requiredInputs) {
      fields.push(
        buildInputField(key, "required", "required_inputs", "controlled_input_patch"),
      );
    }
    for (const key of controlledInputPatch.optionalInputs) {
      fields.push(
        buildInputField(key, "optional", "optional_refinements", "controlled_input_patch"),
      );
    }
    for (const key of controlledInputPatch.advancedInputs) {
      const depthNote = controlledInputPatch.professionalDepthNotes[0];
      fields.push(
        buildInputField(
          key,
          "advanced",
          "advanced_professional_inputs",
          "controlled_input_patch",
          depthNote,
        ),
      );
    }
    for (const key of controlledInputPatch.derivedInputs) {
      const derivedField = buildDerivedField(key, "derived");
      if (derivedField.userEditable) {
        blockers.push(`Derived field "${key}" must not be user-editable.`);
      }
      fields.push(derivedField);
    }

    let assumptionOrder = 0;
    for (const text of controlledInputPatch.defaultAssumptions) {
      fields.push(buildAssumptionField(`default-${assumptionOrder}`, text, assumptionOrder));
      assumptionOrder += 1;
    }
    for (const text of controlledInputPatch.userBurdenNotes) {
      fields.push(buildAssumptionField(`burden-${assumptionOrder}`, text, assumptionOrder));
      assumptionOrder += 1;
    }
  }

  if (requirementResult) {
    for (const variableId of requirementResult.defaultedInputs) {
      if (!fields.some((field) => field.key === variableId)) {
        fields.push(
          buildInputField(variableId, "optional", "optional_refinements", "requirement_engine"),
        );
      }
    }
  }

  const validationMessagePlan: SmartFormValidationMessagePlan[] = [];
  if (contract) {
    for (const rule of contract.validationRules) {
      validationMessagePlan.push({
        ruleId: rule.id,
        message: rule.description,
        kind: rule.kind,
      });
      fields.push(buildValidationField(rule.id, rule.description, rule.kind));
    }

    for (const outputId of contract.outputs) {
      fields.push({
        key: `output-${outputId}`,
        label: humanizeFieldKey(outputId),
        role: "derived",
        section: "result_preview",
        source: "contract",
        userEditable: false,
        requiredForCalculation: false,
        validationMessages: [],
        visibility: "hidden_derived",
      });
    }

    for (const text of contract.warningPolicy?.modelLimitations ?? []) {
      fields.push({
        key: `limitation-${fields.length}`,
        label: text,
        role: "assumption",
        section: "default_assumptions",
        source: "contract",
        userEditable: false,
        requiredForCalculation: false,
        validationMessages: [],
        professionalNote: `limitation: ${text}`,
        visibility: "always",
      });
    }
  }

  const missingInputQuestions = buildMissingInputQuestions(fields);

  for (const field of fields) {
    if (field.role === "required" || field.role === "optional" || field.role === "advanced") {
      const question = missingInputQuestions.find((entry) => entry.fieldKey === field.key)?.question;
      if (question) {
        const index = fields.findIndex((entry) => entry.key === field.key);
        fields[index] = { ...field, missingQuestion: question };
      }
    }
  }

  const defaultAssumptionDisplays: SmartFormAssumptionDisplay[] = fields
    .filter((field) => field.role === "assumption")
    .map((field, index) => ({
      id: `${slug}-assumption-${index}`,
      text: field.label,
      displayOrder: index,
    }));

  const derivedValueDisplays: SmartFormDerivedValueDisplay[] = fields
    .filter((field) => field.role === "derived" && field.section === "derived_values")
    .map((field) => ({
      fieldKey: field.key,
      label: field.label,
      description: field.professionalNote ?? "Derived governance output.",
    }));

  const fieldKeysBySection = new Map<SmartFormSectionType, string[]>();
  for (const field of fields) {
    const existing = fieldKeysBySection.get(field.section) ?? [];
    fieldKeysBySection.set(field.section, [...existing, field.key]);
  }
  fieldKeysBySection.set("trust_trace", ["trust-trace-mapping"]);

  const sections = buildSections(fieldKeysBySection);

  const readinessStatus = blockers.length > 0 ? "blocked" : readiness.status;

  const plan: SmartFormPlan = {
    slug,
    readinessStatus,
    sections,
    fields,
    missingInputQuestions,
    defaultAssumptionDisplays,
    derivedValueDisplays,
    validationMessagePlan,
    trustTraceMapping: {
      usedInputs: [],
      defaultAssumptions: [],
      derivedValues: [],
      validationSources: [],
      professionalInputs: [],
      hiddenNonEditableValues: [],
      modelLimitationsSource: [],
    },
    nextGate:
      readinessStatus === "ready_for_spec"
        ? "smart_form_rendering_ready"
        : readinessStatus === "needs_input_design_patch"
          ? "controlled_input_patch"
          : readinessStatus === "needs_alignment_review"
            ? "alignment_review"
            : "smart_form_architecture_pending",
    warnings,
    blockers,
  };

  return {
    ...plan,
    trustTraceMapping: buildTrustTraceFieldMapping(plan),
  };
}
