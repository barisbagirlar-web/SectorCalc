"use client";

import { useMemo, type FormEvent } from "react";
import { SmartFormField } from "@/components/tools/smart-form/SmartFormField";
import { SmartFormSection } from "@/components/tools/smart-form/SmartFormSection";
import { SmartFormTrustSummary } from "@/components/tools/smart-form/SmartFormTrustSummary";
import { SmartFormValidationSummary } from "@/components/tools/smart-form/SmartFormValidationSummary";
import {
  buildSmartFormFieldSpecsFromContract,
  type SmartFormContractFieldSpec,
  type SmartFormRawValues,
} from "@/lib/formula-governance/runtime-validation/smart-form-contract-adapter";

export type SmartToolFormProps = {
  readonly slug: string;
  readonly values: SmartFormRawValues;
  readonly errors: Readonly<Record<string, string>>;
  readonly onChange: (key: string, value: number | string) => void;
  readonly onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  readonly calculateLabel: string;
  readonly blocked?: boolean;
  readonly blockers?: readonly string[];
  readonly isCalculating?: boolean;
  readonly inputIdPrefix?: string;
};

const SECTION_META: Record<
  SmartFormContractFieldSpec["group"],
  { readonly title: string; readonly description: string; readonly collapsible: boolean; readonly defaultExpanded: boolean }
> = {
  required: {
    title: "Required inputs",
    description: "Core contract inputs for a valid calculation path.",
    collapsible: false,
    defaultExpanded: true,
  },
  optional: {
    title: "Optional refinements",
    description: "Improve estimate fidelity without breaking defaults.",
    collapsible: true,
    defaultExpanded: false,
  },
  advanced: {
    title: "Advanced inputs",
    description: "Professional depth overrides when available.",
    collapsible: true,
    defaultExpanded: false,
  },
};

function renderFieldGrid(
  fields: readonly SmartFormContractFieldSpec[],
  values: SmartFormRawValues,
  errors: Readonly<Record<string, string>>,
  onChange: SmartToolFormProps["onChange"],
  inputIdPrefix: string,
) {
  if (fields.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
      {fields.map((field) => (
        <SmartFormField
          key={field.key}
          field={field}
          value={values[field.key] ?? ""}
          error={errors[field.key]}
          onChange={onChange}
          inputIdPrefix={inputIdPrefix}
        />
      ))}
    </div>
  );
}

export function SmartToolForm({
  slug,
  values,
  errors,
  onChange,
  onSubmit,
  calculateLabel,
  blocked = false,
  blockers = [],
  isCalculating = false,
  inputIdPrefix = "smart-form",
}: SmartToolFormProps) {
  const plan = useMemo(() => buildSmartFormFieldSpecsFromContract(slug), [slug]);

  const fieldsByGroup = useMemo(() => {
    const groups: Record<SmartFormContractFieldSpec["group"], SmartFormContractFieldSpec[]> = {
      required: [],
      optional: [],
      advanced: [],
    };
    for (const field of plan?.fields ?? []) {
      groups[field.group].push(field);
    }
    return groups;
  }, [plan?.fields]);

  if (!plan) {
    return (
      <div className="sc-industrial-panel p-4" role="alert">
        <p className="text-sm text-crit-red">Smart form contract not found for this tool.</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="sc-ledger-cetele__form sc-ledger-cetele-form sc-ledger-panel sc-industrial-panel sc-ledger-letterpress space-y-4 p-4 sm:p-5"
      noValidate
      data-smart-form-slug={slug}
      data-contract-slug={plan.contractSlug}
    >
      <SmartFormTrustSummary
        decisionGoal={plan.decisionGoal}
        assumptions={plan.assumptions}
        validationRuleCount={plan.validationRules.length}
      />

      {(Object.keys(SECTION_META) as SmartFormContractFieldSpec["group"][]).map((group) => {
        const sectionFields = fieldsByGroup[group];
        if (sectionFields.length === 0) {
          return null;
        }
        const meta = SECTION_META[group];
        return (
          <SmartFormSection
            key={group}
            title={meta.title}
            description={meta.description}
            collapsible={meta.collapsible}
            defaultExpanded={meta.defaultExpanded}
            sectionType={group}
          >
            {renderFieldGrid(sectionFields, values, errors, onChange, inputIdPrefix)}
          </SmartFormSection>
        );
      })}

      {blocked ? (
        <SmartFormValidationSummary
          title="Analysis blocked"
          blockers={blockers}
          errors={errors}
        />
      ) : null}

      <div className="sc-industrial-form-actions">
        <button
          type="submit"
          disabled={isCalculating}
          className="sc-cta-primary disabled:opacity-60"
        >
          {isCalculating ? "…" : calculateLabel}
        </button>
      </div>
    </form>
  );
}
