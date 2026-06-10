"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { SmartFormModeToggle } from "@/components/smart-form/SmartFormModeToggle";
import { SmartFormRequirementNotice } from "@/components/smart-form/SmartFormRequirementNotice";
import { SmartInputField } from "@/components/smart-form/SmartInputField";
import type { SmartFormMode } from "@/lib/smart-form/dynamic-form-types";
import {
  getDefaultScenarioId,
  getPremiumSmartFormDefinition,
  hasPremiumSmartFormDefinition,
} from "@/lib/smart-form/premium-smart-form-definitions";
import { getRequiredInputs, getVisibleInputs } from "@/lib/smart-form/requirements";
import { validateSmartFormRuntimeCompatibility } from "@/lib/smart-form/runtime-compatibility";
import { validateSmartForm } from "@/lib/smart-form/validation";
import type { SmartFormRawValues } from "@/lib/formula-governance/runtime-validation/smart-form-contract-adapter";

export type DynamicSmartFormPilotProps = {
  readonly slug: string;
  readonly values: SmartFormRawValues;
  readonly errors: Readonly<Record<string, string>>;
  readonly onChange: (key: string, value: number | string) => void;
  readonly onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  readonly onValidationChange?: (valid: boolean) => void;
  readonly calculateLabel: string;
  readonly isCalculating?: boolean;
};

function translateValidationMessage(
  translate: ReturnType<typeof useTranslations>,
  messageKey: string,
  min?: number,
  max?: number,
): string {
  if (messageKey === "validation.min" && min !== undefined) {
    return translate("validation.min", { min });
  }
  if (messageKey === "validation.max" && max !== undefined) {
    return translate("validation.max", { max });
  }
  return translate(messageKey as "validation.required");
}

export function DynamicSmartFormPilot({
  slug,
  values,
  errors,
  onChange,
  onSubmit,
  onValidationChange,
  calculateLabel,
  isCalculating = false,
}: DynamicSmartFormPilotProps) {
  const t = useTranslations("smartForm");
  const definition = useMemo(() => getPremiumSmartFormDefinition(slug), [slug]);
  const [mode, setMode] = useState<SmartFormMode>("simple");
  const [scenarioId, setScenarioId] = useState(() => getDefaultScenarioId(slug));

  const validation = useMemo(() => {
    if (!definition) {
      return null;
    }
    return validateSmartForm(definition, values as Record<string, unknown>, mode, scenarioId);
  }, [definition, values, mode, scenarioId]);

  const visibleInputs = useMemo(() => {
    if (!definition) {
      return [];
    }
    return getVisibleInputs(definition, values as Record<string, unknown>, mode, scenarioId);
  }, [definition, values, mode, scenarioId]);

  const requiredKeys = useMemo(() => {
    if (!definition) {
      return new Set<string>();
    }
    return new Set(
      getRequiredInputs(definition, values as Record<string, unknown>, mode, scenarioId).map(
        (input) => input.key,
      ),
    );
  }, [definition, values, mode, scenarioId]);

  const fieldErrors = useMemo(() => {
    const next: Record<string, string> = { ...errors };
    if (!validation || !definition) {
      return next;
    }

    for (const key of validation.missing) {
      next[key] = t("validation.required");
    }

    for (const item of validation.invalid) {
      const input = definition.inputs.find((candidate) => candidate.key === item.key);
      next[item.key] = translateValidationMessage(t, item.messageKey, input?.min, input?.max);
    }

    return next;
  }, [errors, validation, definition, t]);

  const runtimeCompatibility = useMemo(() => {
    if (!definition) {
      return null;
    }
    return validateSmartFormRuntimeCompatibility(slug, definition, values as Record<string, unknown>, mode, scenarioId);
  }, [definition, slug, values, mode, scenarioId]);

  const isValid = (validation?.ok ?? false) && (runtimeCompatibility?.ok ?? false);
  const activeScenario = definition?.scenarios.find((scenario) => scenario.id === scenarioId);

  useEffect(() => {
    onValidationChange?.(isValid);
  }, [isValid, onValidationChange]);

  if (!definition || !hasPremiumSmartFormDefinition(slug)) {
    return (
      <div className="sc-industrial-panel p-4" role="alert">
        <p className="text-sm text-crit-red">{t("notices.calculationBlocked")}</p>
      </div>
    );
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validation?.ok) {
      return;
    }
    onSubmit(event);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="sc-dynamic-smart-form sc-smart-form-pilot sc-ledger-panel sc-industrial-panel sc-ledger-letterpress"
      noValidate
      data-smart-form-slug={slug}
      data-smart-form-mode={mode}
      data-smart-form-scenario={scenarioId}
    >
      <div className="sc-smart-form-controls">
        <div className="sc-smart-form-scenario min-w-0">
          <p className="sc-ledger-eyebrow">{t("scenario.label")}</p>
          <select
            value={scenarioId}
            onChange={(event) => setScenarioId(event.target.value)}
            className="sc-ledger-input-boxed sc-smart-form-scenario__select"
            aria-label={t("scenario.label")}
          >
            {definition.scenarios.map((scenario) => (
              <option key={scenario.id} value={scenario.id}>
                {t(scenario.labelKey)}
              </option>
            ))}
          </select>
          {activeScenario?.descriptionKey ? (
            <p className="sc-smart-form-scenario__desc">{t(activeScenario.descriptionKey)}</p>
          ) : null}
        </div>
        <SmartFormModeToggle mode={mode} onChange={setMode} />
      </div>

      <SmartFormRequirementNotice
        missingCount={validation?.missing.length ?? 0}
        invalidCount={validation?.invalid.length ?? 0}
        blocked={!isValid}
      />

      <div className="sc-smart-form-fields">
        {visibleInputs.map((input) => (
          <SmartInputField
            key={input.key}
            input={input}
            value={values[input.key] ?? ""}
            error={fieldErrors[input.key]}
            required={requiredKeys.has(input.key)}
            onChange={onChange}
          />
        ))}
      </div>

      <div className="sc-smart-form-actions sc-industrial-form-actions">
        <button
          type="submit"
          disabled={isCalculating || !isValid}
          className="sc-ledger-cta-primary sc-cta-primary sc-smart-form-submit disabled:opacity-60"
        >
          {isCalculating ? "…" : calculateLabel}
        </button>
      </div>
    </form>
  );
}
