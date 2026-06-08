"use client";

import { useMemo, useState } from "react";
import { buildSmartFormPilotCalculationPayload } from "@/components/tools/smart-form/build-smart-form-pilot-calculation-payload";
import {
  isEditablePilotField,
  isPilotMappedCalculationField,
  isPilotSubmitDisabled,
} from "@/components/tools/smart-form/pilot-field-utils";
import type { PilotFieldValues } from "@/components/tools/smart-form/pilot-calculation-payload";
import type {
  SmartFormFieldComponentProps,
  SmartFormSectionComponentProps,
  SmartFormUiBridgeManifest,
} from "@/lib/formula-governance/smart-form-ui-bridge/smart-form-ui-bridge-types";

export const SMART_FORM_PILOT_CONNECTED_LABEL =
  "Smart form pilot — connected to existing calculation path.";

type SmartFormBridgeRendererProps = {
  readonly manifest: SmartFormUiBridgeManifest;
  readonly calculationConnected?: boolean;
  readonly isCalculating?: boolean;
  readonly fieldErrors?: Readonly<Record<string, string>>;
  readonly onPilotCalculate?: (fieldValues: PilotFieldValues) => void;
  readonly onPilotStarted?: () => void;
};

function FieldBadges({ field }: { field: SmartFormFieldComponentProps }) {
  if (field.badges.length === 0) {
    return null;
  }

  return (
    <div className="mt-1 flex flex-wrap gap-1">
      {field.badges.map((badge) => (
        <span
          key={`${field.key}-${badge}`}
          className="rounded border border-border-subtle bg-surface-muted px-2 py-0.5 text-xs text-text-secondary"
        >
          {badge}
        </span>
      ))}
    </div>
  );
}

function SmartFormFieldRenderer({
  field,
  value,
  error,
  onChange,
}: {
  field: SmartFormFieldComponentProps;
  value: string;
  error?: string;
  onChange: (next: string) => void;
}) {
  const inputId = `smart-form-${field.key}`;

  if (field.componentKind === "field_readonly" || field.inputType === "readonly_display") {
    return (
      <div className="sc-industrial-field" data-component-kind="field_readonly">
        <p className="sc-ledger-label sc-industrial-field__label">{field.label}</p>
        <p className="text-sm text-text-secondary">Read-only derived value (pilot display).</p>
        <FieldBadges field={field} />
      </div>
    );
  }

  if (field.componentKind === "assumption_callout") {
    return (
      <div
        className="rounded border border-border-subtle bg-surface-muted p-3"
        data-component-kind="assumption_callout"
      >
        <p className="text-sm font-medium text-text-primary">{field.label}</p>
        <FieldBadges field={field} />
      </div>
    );
  }

  if (field.componentKind === "validation_message" || field.visibility === "hidden") {
    return (
      <div className="sr-only" data-component-kind="validation_message" aria-hidden>
        {field.validationMessages.join(" ")}
      </div>
    );
  }

  return (
    <div className="sc-industrial-field" data-component-kind={field.componentKind}>
      <div className="sc-industrial-field__label-row">
        <label htmlFor={inputId} className="sc-ledger-label sc-industrial-field__label">
          {field.label}
          {field.required ? <span aria-hidden> *</span> : null}
        </label>
      </div>
      <div className="sc-industrial-input-row">
        <input
          id={inputId}
          type="text"
          inputMode="decimal"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={field.placeholder}
          readOnly={!field.editable}
          disabled={!field.editable}
          className="sc-ledger-input-underline sc-industrial-input w-full"
          aria-readonly={!field.editable}
          aria-invalid={Boolean(error)}
        />
        {field.unitLabel ? (
          <span className="sc-industrial-input__unit text-sm text-text-secondary">
            {field.unitLabel}
          </span>
        ) : null}
      </div>
      {error ? (
        <p className="sc-industrial-field__error mt-1" role="alert">
          {error}
        </p>
      ) : null}
      <FieldBadges field={field} />
    </div>
  );
}

function SmartFormSectionRenderer({
  section,
  fields,
  fieldValues,
  fieldErrors,
  onFieldChange,
}: {
  section: SmartFormSectionComponentProps;
  fields: readonly SmartFormFieldComponentProps[];
  fieldValues: Readonly<Record<string, string>>;
  fieldErrors: Readonly<Record<string, string>>;
  onFieldChange: (key: string, value: string) => void;
}) {
  const [expanded, setExpanded] = useState(section.defaultExpanded);
  const sectionFields = fields.filter((field) => section.fields.includes(field.key));

  if (sectionFields.length === 0 && section.componentKind !== "trust_trace_panel") {
    return null;
  }

  return (
    <section
      className="sc-ledger-panel sc-industrial-panel border border-border-subtle p-4"
      data-section-type={section.componentKind}
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-text-primary">{section.title}</h3>
          {section.helpText ? (
            <p className="mt-1 text-sm text-text-secondary">{section.helpText}</p>
          ) : null}
        </div>
        {section.collapsible ? (
          <button
            type="button"
            className="sc-cta-secondary min-h-[44px] px-3 py-2 text-sm"
            onClick={() => setExpanded((current) => !current)}
            aria-expanded={expanded}
          >
            {expanded ? "Collapse" : "Expand"}
          </button>
        ) : null}
      </div>

      {expanded ? (
        <div className="space-y-4">
          {sectionFields.map((field) => (
            <SmartFormFieldRenderer
              key={field.key}
              field={field}
              value={fieldValues[field.key] ?? ""}
              error={fieldErrors[field.key]}
              onChange={(next) => onFieldChange(field.key, next)}
            />
          ))}
        </div>
      ) : null}
    </section>
  );
}

function TrustTracePanel({
  manifest,
}: {
  manifest: SmartFormUiBridgeManifest;
}) {
  if (!manifest.trustTrace.enabled) {
    return null;
  }

  return (
    <section
      className="sc-ledger-panel sc-industrial-panel border border-dashed border-border-subtle p-4"
      data-component-kind="trust_trace_panel"
    >
      <h3 className="text-base font-semibold text-text-primary">Trust trace (pilot placeholder)</h3>
      <p className="mt-1 text-sm text-text-secondary">
        Governance mapping preview — no report output in this phase.
      </p>
      <ul className="mt-3 space-y-1 text-sm text-text-secondary">
        <li>Used inputs: {manifest.trustTrace.usedInputs.join(", ") || "—"}</li>
        <li>Derived values: {manifest.trustTrace.derivedValues.join(", ") || "—"}</li>
        <li>Assumptions: {manifest.trustTrace.assumptions.length}</li>
        <li>Validation sources: {manifest.trustTrace.validationSources.length}</li>
      </ul>
    </section>
  );
}

export function SmartFormBridgeRenderer({
  manifest,
  calculationConnected = false,
  isCalculating = false,
  fieldErrors = {},
  onPilotCalculate,
  onPilotStarted,
}: SmartFormBridgeRendererProps) {
  const pilotInputFields = useMemo(
    () => manifest.fields.filter((field) => isEditablePilotField(field)),
    [manifest.fields],
  );

  const [fieldValues, setFieldValues] = useState<PilotFieldValues>(() => {
    const initial: Record<string, string> = {};
    for (const field of pilotInputFields) {
      initial[field.key] = "";
    }
    return initial;
  });

  const [localErrors, setLocalErrors] = useState<Record<string, string>>({});

  const orderedSections = useMemo(
    () => [...manifest.sections].sort((left, right) => left.order - right.order),
    [manifest.sections],
  );

  const mergedErrors = { ...localErrors, ...fieldErrors };
  const submitDisabled =
    isCalculating || isPilotSubmitDisabled(fieldValues, manifest.slug) || !calculationConnected;

  const handleFieldChange = (key: string, value: string) => {
    const field = pilotInputFields.find((entry) => entry.key === key);
    if (!field || !isEditablePilotField(field)) {
      return;
    }
    if (isPilotMappedCalculationField(field, manifest.slug)) {
      onPilotStarted?.();
    }
    setFieldValues((current) => ({ ...current, [key]: value }));
    setLocalErrors((current) => {
      const next = { ...current };
      delete next[key];
      return next;
    });
  };

  const handlePilotCalculate = () => {
    const validation = buildSmartFormPilotCalculationPayload({
      slug: manifest.slug,
      fieldValues,
      manifest,
    });
    if (!validation.supported || !validation.payload) {
      setLocalErrors({ ...validation.errors });
      return;
    }
    onPilotCalculate?.(fieldValues);
  };

  return (
    <div className="smart-form-bridge space-y-4" data-pilot-slug={manifest.slug}>
      <div className="rounded border border-amber-200 bg-amber-50 p-3 text-sm text-amber-950">
        {calculationConnected
          ? SMART_FORM_PILOT_CONNECTED_LABEL
          : "Smart form pilot — render only. Production calculator output path is unchanged."}
      </div>

      {orderedSections
        .filter((section) => section.componentKind !== "trust_trace_panel")
        .map((section) => (
          <SmartFormSectionRenderer
            key={section.id}
            section={section}
            fields={manifest.fields}
            fieldValues={fieldValues}
            fieldErrors={mergedErrors}
            onFieldChange={handleFieldChange}
          />
        ))}

      <TrustTracePanel manifest={manifest} />

      {calculationConnected ? (
        <div className="sc-industrial-form-actions">
          <button
            type="button"
            disabled={submitDisabled}
            onClick={handlePilotCalculate}
            className="sc-cta-primary disabled:opacity-60"
          >
            {isCalculating ? "…" : "Pilot calculate"}
          </button>
        </div>
      ) : null}
    </div>
  );
}
