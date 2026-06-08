/**
 * Smart Form Architecture builder — Phase 5H-G-A governance spec (no UI).
 */

import { getControlledInputDesignPatch } from "@/lib/formula-governance/input-design-audit/controlled-input-patch/controlled-input-design-registry";
import { isControlledInputDesignPatchCompleted } from "@/lib/formula-governance/input-design-audit/controlled-input-patch/controlled-input-design-status";
import {
  buildMissingInputQuestion,
  humanizeVariableId,
  inferFieldDimension,
  inferMissingRisk,
  isNarrativeOutput,
} from "@/lib/formula-governance/input-design-audit/smart-form-architecture/smart-form-field-helpers";
import type {
  BatchSmartFormArchitecturePlan,
  SmartFormArchitectureSpec,
  SmartFormAssumptionDisplay,
  SmartFormFieldGroup,
  SmartFormFieldSpec,
  SmartFormMissingInputQuestion,
  SmartFormSectionPlan,
  SmartFormTrustTraceMapping,
  SmartFormValidationMessagePlan,
} from "@/lib/formula-governance/input-design-audit/smart-form-architecture/smart-form-architecture-types";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import type { FormulaContract } from "@/lib/formula-governance/types";

function buildFieldSpecs(
  variableIds: readonly string[],
  group: SmartFormFieldGroup,
  startOrder: number,
): SmartFormFieldSpec[] {
  return variableIds.map((variableId, index) => {
    const dimensionMeta = inferFieldDimension(variableId);
    return {
      variableId,
      label: humanizeVariableId(variableId),
      group,
      displayOrder: startOrder + index,
      dimension: dimensionMeta.dimension,
      unit: dimensionMeta.unit,
      missingRisk: group === "derived" ? "low" : inferMissingRisk(group),
      helpText:
        group === "derived"
          ? "Derived output — read-only trust trace; production formula unchanged."
          : undefined,
    };
  });
}

function buildAssumptionDisplays(
  patch: NonNullable<ReturnType<typeof getControlledInputDesignPatch>>,
  contract: FormulaContract,
): SmartFormAssumptionDisplay[] {
  const displays: SmartFormAssumptionDisplay[] = [];
  let order = 0;

  for (const text of patch.defaultAssumptions) {
    displays.push({
      id: `${patch.slug}-default-${order}`,
      text,
      category: "default",
      displayOrder: order++,
    });
  }
  for (const text of patch.userBurdenNotes) {
    displays.push({
      id: `${patch.slug}-burden-${order}`,
      text,
      category: "user_burden",
      displayOrder: order++,
    });
  }
  for (const text of patch.professionalDepthNotes) {
    displays.push({
      id: `${patch.slug}-depth-${order}`,
      text,
      category: "professional",
      displayOrder: order++,
    });
  }
  for (const text of contract.warningPolicy?.acceptedAssumptions ?? []) {
    displays.push({
      id: `${patch.slug}-accepted-${order}`,
      text,
      category: "accepted",
      displayOrder: order++,
    });
  }
  for (const text of contract.warningPolicy?.modelLimitations ?? []) {
    displays.push({
      id: `${patch.slug}-limit-${order}`,
      text,
      category: "limitation",
      displayOrder: order++,
    });
  }

  return displays;
}

function buildMissingInputQuestions(
  fields: readonly SmartFormFieldSpec[],
): SmartFormMissingInputQuestion[] {
  return fields
    .filter(
      (field): field is SmartFormFieldSpec & {
        group: "required" | "optional" | "advanced";
      } => field.group !== "derived",
    )
    .map((field) => ({
      variableId: field.variableId,
      question: buildMissingInputQuestion(field.variableId, field.group),
      missingRisk: field.missingRisk,
      priority: field.group,
    }));
}

function buildValidationMessagePlans(contract: FormulaContract): SmartFormValidationMessagePlan[] {
  return contract.validationRules.map((rule) => ({
    ruleId: rule.id,
    message: rule.description,
    kind: rule.kind,
    trigger: `validation:${rule.id}`,
  }));
}

function buildSectionPlans(
  requiredIds: readonly string[],
  optionalIds: readonly string[],
  advancedIds: readonly string[],
  derivedIds: readonly string[],
  outputIds: readonly string[],
): SmartFormSectionPlan[] {
  return [
    {
      id: "core-inputs",
      title: "Core inputs",
      description: "Required job inputs aligned with production calculator fields.",
      group: "required",
      fieldIds: requiredIds,
      collapsedByDefault: false,
    },
    {
      id: "optional-drivers",
      title: "Optional cost drivers",
      description: "Recommended overrides that improve estimate fidelity without breaking free-tier defaults.",
      group: "optional",
      fieldIds: optionalIds,
      collapsedByDefault: true,
    },
    {
      id: "advanced-risk",
      title: "Advanced risk inputs",
      description: "Professional depth inputs for smart-form expansion; governance placeholders until UI phase.",
      group: "advanced",
      fieldIds: advancedIds,
      collapsedByDefault: true,
    },
    {
      id: "assumptions",
      title: "Assumptions and limitations",
      description: "Default assumptions and model scope displayed before calculation.",
      group: "assumptions",
      fieldIds: [],
      collapsedByDefault: false,
    },
    {
      id: "derived-outputs",
      title: "Derived outputs",
      description: "Read-only derived values mapped from production outputs.",
      group: "derived_outputs",
      fieldIds: derivedIds,
      collapsedByDefault: true,
    },
    {
      id: "trust-trace",
      title: "Trust trace",
      description: "Output trace mapping with disclaimer and narrative output flags.",
      group: "trust_trace",
      fieldIds: outputIds,
      collapsedByDefault: false,
    },
  ];
}

function buildTrustTraceMappings(
  contract: FormulaContract,
  requiredIds: readonly string[],
): SmartFormTrustTraceMapping[] {
  const traceSource = requiredIds.join(", ");

  return contract.outputs.map((outputId) => ({
    outputId,
    label: humanizeVariableId(outputId),
    traceSource: traceSource.length > 0 ? traceSource : "contract inputs",
    disclaimerRequired: contract.decisionLanguageRules.some((rule) => rule.requiredDisclaimer),
    narrativeOutput: isNarrativeOutput(outputId),
  }));
}

export function buildSmartFormArchitectureSpec(slug: string): SmartFormArchitectureSpec | undefined {
  if (!isControlledInputDesignPatchCompleted(slug)) {
    return undefined;
  }

  const patch = getControlledInputDesignPatch(slug);
  const contract = getFormulaContractBySlug(slug);
  if (!patch || !contract) {
    return undefined;
  }

  const blockers: string[] = [...patch.blockers];
  const warnings: string[] = [...patch.warnings];

  if (patch.productionImpact !== "none") {
    blockers.push(`Patch "${slug}" must declare productionImpact none for smart form architecture.`);
  }

  const requiredFields = buildFieldSpecs(patch.requiredInputs, "required", 0);
  const optionalFields = buildFieldSpecs(patch.optionalInputs, "optional", requiredFields.length);
  const advancedFields = buildFieldSpecs(
    patch.advancedInputs,
    "advanced",
    requiredFields.length + optionalFields.length,
  );
  const derivedFields = buildFieldSpecs(
    patch.derivedInputs,
    "derived",
    requiredFields.length + optionalFields.length + advancedFields.length,
  );

  const fields = [...requiredFields, ...optionalFields, ...advancedFields, ...derivedFields];

  if (requiredFields.length === 0) {
    blockers.push(`Smart form architecture for "${slug}" requires at least one required field.`);
  }

  const assumptionDisplays = buildAssumptionDisplays(patch, contract);
  const missingInputQuestions = buildMissingInputQuestions(fields);
  const validationMessagePlans = buildValidationMessagePlans(contract);
  const sections = buildSectionPlans(
    patch.requiredInputs,
    patch.optionalInputs,
    patch.advancedInputs,
    patch.derivedInputs,
    contract.outputs,
  );
  const trustTraceMappings = buildTrustTraceMappings(contract, patch.requiredInputs);

  return {
    slug,
    toolName: contract.toolName,
    nextGate: blockers.length === 0 ? "smart_form_rendering_ready" : "smart_form_architecture_pending",
    productionImpact: "none",
    uiImpact: "none",
    fields,
    assumptionDisplays,
    missingInputQuestions,
    validationMessagePlans,
    sections,
    trustTraceMappings,
    warnings,
    blockers,
  };
}

export function buildBatchSmartFormArchitecturePlan(
  slugs: readonly string[],
): BatchSmartFormArchitecturePlan {
  const specs: SmartFormArchitectureSpec[] = [];
  const warnings: string[] = [];
  const blockers: string[] = [];

  for (const slug of slugs) {
    const spec = buildSmartFormArchitectureSpec(slug);
    if (!spec) {
      blockers.push(`No controlled input design patch for "${slug}" — smart form architecture skipped.`);
      continue;
    }
    specs.push(spec);
    warnings.push(...spec.warnings.map((warning) => `${slug}: ${warning}`));
    blockers.push(...spec.blockers.map((blocker) => `${slug}: ${blocker}`));
  }

  const renderingReady = specs.filter((spec) => spec.nextGate === "smart_form_rendering_ready").length;

  return {
    totalTools: slugs.length,
    renderingReady,
    pending: slugs.length - renderingReady,
    specs,
    warnings,
    blockers,
  };
}

export function formatSmartFormArchitectureReport(plan: BatchSmartFormArchitecturePlan): string {
  const lines = [
    "Smart Form Architecture Summary",
    `Total tools: ${plan.totalTools}`,
    `Rendering ready: ${plan.renderingReady}`,
    `Pending: ${plan.pending}`,
    "",
    "Specs:",
  ];

  for (const spec of plan.specs) {
    lines.push(
      `- ${spec.slug} — ${spec.nextGate}, sections ${spec.sections.length}, fields ${spec.fields.length}`,
    );
  }

  if (plan.blockers.length > 0) {
    lines.push("", "Blockers:");
    for (const blocker of plan.blockers.slice(0, 5)) {
      lines.push(`- ${blocker}`);
    }
  }

  return lines.join("\n");
}

export function isSmartFormRenderingReady(slug: string): boolean {
  const spec = buildSmartFormArchitectureSpec(slug);
  return spec?.nextGate === "smart_form_rendering_ready";
}
