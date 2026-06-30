/**
 * Missing input question planner — Phase 5H-G-A governance copy (no UI).
 */

import { humanizeFieldKey } from "@/lib/features/formula-governance/smart-form-architecture/form-field-helpers";
import type {
  SmartFormFieldSpec,
  SmartFormMissingInputQuestion,
} from "@/lib/features/formula-governance/smart-form-architecture/smart-form-types";

const FIELD_QUESTION_OVERRIDES: Readonly<Record<string, string>> = {
  materialCost: "What is the direct material cost for this job?",
  laborHours: "How many labor hours do you estimate for this job?",
  laborRate: "What is your labor rate per hour for this job?",
  machineRate: "What is the machine rate per hour for this job?",
  printHours: "How many print hours does this job require?",
  postProcessHours: "How many post-processing hours does this job need?",
  targetMargin: "What profit margin percentage are you targeting for this job?",
  targetMarginPercent: "What profit margin percentage are you targeting for this job?",
  shopRate: "What is your shop labor rate per hour?",
  partsCost: "What is the parts cost for this job?",
  jobRevenue: "What revenue are you quoting or billing for this job?",
  directLaborCost: "What is the direct labor cost for this job?",
  overheadPercent: "What overhead percentage do you apply to this job?",
};

function buildRequiredQuestion(key: string): string {
  if (FIELD_QUESTION_OVERRIDES[key]) {
    return FIELD_QUESTION_OVERRIDES[key];
  }
  const label = humanizeFieldKey(key).toLowerCase();
  return `What is the ${label} for this job?`;
}

function buildOptionalQuestion(key: string): string {
  const label = humanizeFieldKey(key).toLowerCase();
  return `Do you want to refine the default ${label} for this estimate?`;
}

function buildAdvancedQuestion(key: string): string {
  const label = humanizeFieldKey(key).toLowerCase();
  return `Add ${label} for a more precise professional estimate?`;
}

function buildAssumptionDisplay(key: string, text: string): string {
  return `Assumption display — ${key}: ${text}`;
}

export function buildMissingInputQuestions(
  fields: readonly SmartFormFieldSpec[],
): SmartFormMissingInputQuestion[] {
  const questions: SmartFormMissingInputQuestion[] = [];

  for (const field of fields) {
    if (field.role === "derived" || field.role === "validation_only") {
      continue;
    }

    if (field.role === "assumption") {
      questions.push({
        fieldKey: field.key,
        question: buildAssumptionDisplay(field.key, field.label),
        priority: "assumption",
      });
      continue;
    }

    let question: string;
    if (field.role === "required") {
      question = buildRequiredQuestion(field.key);
    } else if (field.role === "optional") {
      question = buildOptionalQuestion(field.key);
    } else {
      question = buildAdvancedQuestion(field.key);
    }

    questions.push({
      fieldKey: field.key,
      question,
      priority: field.role,
    });
  }

  return questions;
}
