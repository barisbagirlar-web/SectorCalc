"use client";

import { useMemo, useState } from "react";
import type {
  SmartFormFieldComponentProps,
  SmartFormSectionComponentProps,
  SmartFormUiBridgeManifest,
} from "@/lib/formula-governance/smart-form-ui-bridge/smart-form-ui-bridge-types";

export const SMART_FORM_PILOT_RENDER_ONLY_LABEL =
  "Smart form pilot — render only. Production calculator output path is unchanged.";

type SmartFormBridgeRendererProps = {
  readonly manifest: SmartFormUiBridgeManifest;
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
  onChange,
}: {
  field: SmartFormFieldComponentProps;
  value: string;
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
        />
        {field.unitLabel ? (
          <span className="sc-industrial-input__unit text-sm text-text-secondary">
            {field.unitLabel}
          </span>
        ) : null}
      </div>
      {field.validationMessages.length > 0 ? (
        <p className="mt-1 text-xs text-text-secondary">{field.validationMessages[0]}</p>
      ) : null}
      <FieldBadges field={field} />
    </div>
  );
}

function SmartFormSectionRenderer({
  section,
  fields,
  fieldValues,
  onFieldChange,
}: {
  section: SmartFormSectionComponentProps;
  fields: readonly SmartFormFieldComponentProps[];
  fieldValues: Readonly<Record<string, string>>;
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

export function SmartFormBridgeRenderer({ manifest }: SmartFormBridgeRendererProps) {
  const editableFieldKeys = useMemo(
    () =>
      manifest.fields
        .filter((field) => field.editable && field.componentKind === "field_input")
        .map((field) => field.key),
    [manifest.fields],
  );

  const [fieldValues, setFieldValues] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    for (const key of editableFieldKeys) {
      initial[key] = "";
    }
    return initial;
  });

  const orderedSections = useMemo(
    () => [...manifest.sections].sort((left, right) => left.order - right.order),
    [manifest.sections],
  );

  const handleFieldChange = (key: string, value: string) => {
    setFieldValues((current) => ({ ...current, [key]: value }));
  };

  return (
    <div className="smart-form-bridge space-y-4" data-pilot-slug={manifest.slug}>
      <div className="rounded border border-amber-200 bg-amber-50 p-3 text-sm text-amber-950">
        {SMART_FORM_PILOT_RENDER_ONLY_LABEL}
      </div>

      {orderedSections
        .filter((section) => section.componentKind !== "trust_trace_panel")
        .map((section) => (
          <SmartFormSectionRenderer
            key={section.id}
            section={section}
            fields={manifest.fields}
            fieldValues={fieldValues}
            onFieldChange={handleFieldChange}
          />
        ))}

      <TrustTracePanel manifest={manifest} />
    </div>
  );
}
