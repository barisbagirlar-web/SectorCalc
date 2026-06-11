"use client";

import { useMemo, type FormEvent } from "react";
import { useLocale, useTranslations } from "next-intl";
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
    <div className="sc-form-grid grid grid-cols-1 gap-3 md:grid-cols-2">
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
  const locale = useLocale();
  const t = useTranslations("freeToolUi");
  const plan = useMemo(
    () => buildSmartFormFieldSpecsFromContract(slug, locale),
    [slug, locale],
  );

  const sectionMeta = useMemo(
    (): Record<
      SmartFormContractFieldSpec["group"],
      {
        readonly title: string;
        readonly description: string;
        readonly collapsible: boolean;
        readonly defaultExpanded: boolean;
      }
    > => ({
      required: {
        title: t("requiredInputsTitle"),
        description: t("requiredInputsDescription"),
        collapsible: false,
        defaultExpanded: true,
      },
      optional: {
        title: t("optionalInputsTitle"),
        description: t("optionalInputsDescription"),
        collapsible: true,
        defaultExpanded: false,
      },
      advanced: {
        title: t("advancedInputsTitle"),
        description: t("advancedInputsDescription"),
        collapsible: true,
        defaultExpanded: false,
      },
    }),
    [t],
  );

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
        <p className="text-sm text-crit-red">{t("contractNotFound")}</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="sc-form-shell sc-ledger-cetele__form sc-ledger-cetele-form sc-ledger-panel sc-industrial-panel sc-ledger-letterpress space-y-4 p-4 sm:p-5"
      noValidate
      data-smart-form-slug={slug}
      data-contract-slug={plan.contractSlug}
      data-calculation-form="true"
    >
      <SmartFormTrustSummary
        decisionGoal={plan.decisionGoal}
        assumptions={plan.assumptions}
        validationRuleCount={plan.validationRules.length}
      />

      {(Object.keys(sectionMeta) as SmartFormContractFieldSpec["group"][]).map((group) => {
        const sectionFields = fieldsByGroup[group];
        if (sectionFields.length === 0) {
          return null;
        }
        const meta = sectionMeta[group];
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
          title={t("analysisBlockedTitle")}
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
