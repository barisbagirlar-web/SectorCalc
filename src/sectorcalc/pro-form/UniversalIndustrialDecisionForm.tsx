// SectorCalc SuperV4 Universal Industrial Decision Form — V5.3.1
// Role-adaptive industrial decision cockpit. The public client never executes formulas.

"use client";

import type { ChangeEvent, ReactNode } from "react";
import { useMemo, useState } from "react";
import type {
  CalcStatus,
  ExecuteResponse,
  ProfileMode,
  RedactionStatus,
  ServerOutput,
  ServerWarning,
  SuperV4Input,
  SuperV4Schema,
  UIInputGroup,
} from "./contract-types";
import { getExecutionStateLabel } from "./form-state-machine";
import { useUniversalIndustrialDecisionFormMachine } from "./useUniversalIndustrialDecisionFormMachine";
import "./universal-industrial-decision-form.css";

export interface UniversalIndustrialDecisionFormProps {
  schema: SuperV4Schema;
  schemaHash?: string | null;
  executeEndpoint?: string;
  initialProfileMode?: ProfileMode;
  className?: string;
}

const PROFILE_MODES: Array<{ id: ProfileMode; label: string; description: string }> = [
  { id: "quick", label: "Quick", description: "Fast field screening" },
  { id: "engineering", label: "Engineering", description: "Technical verification" },
  { id: "cost", label: "Cost", description: "Commercial exposure" },
  { id: "audit", label: "Audit", description: "Evidence and seal" },
];

export function UniversalIndustrialDecisionForm(props: UniversalIndustrialDecisionFormProps) {
  const machine = useUniversalIndustrialDecisionFormMachine({
    schema: props.schema,
    schemaHash: props.schemaHash,
    executeEndpoint: props.executeEndpoint,
    initialProfileMode: props.initialProfileMode ?? "engineering",
  });

  const { state } = machine;
  const premiumHook = state.premiumHookState.hook;
  const response = state.serverResponseState.response;
  const decision = response?.decision_interpretation;
  const activeMode = state.profileModeState.mode;

  const visibleGroups = useMemo(
    () => getVisibleGroups(props.schema.ui_contract.input_groups, activeMode, state.advancedDisclosureState.advanced_visible),
    [activeMode, props.schema.ui_contract.input_groups, state.advancedDisclosureState.advanced_visible],
  );

  const inputsById = useMemo(() => new Map(props.schema.inputs.map((input) => [input.id, input])), [props.schema.inputs]);

  const status = response?.status ?? executionStateToStatus(state.executionState);

  return (
    <section className={`sc-v531-shell ${props.className ?? ""}`} data-renderer="UniversalIndustrialDecisionForm" data-v531="true">
      <header className="sc-v531-hero">
        <div className="sc-v531-hero__eyebrow">SectorCalc SuperV4 · V5.3.1 Industrial Decision Form</div>
        <div className="sc-v531-hero__main">
          <div>
            <h1 className="sc-v531-hero__title">{props.schema.tool_name}</h1>
            <p className="sc-v531-hero__scope">{props.schema.scope}</p>
          </div>
          <div className="sc-v531-status-card" data-status={status.toLowerCase()}>
            <span className="sc-v531-status-card__label">Execution state</span>
            <strong>{getExecutionStateLabel(state.executionState)}</strong>
            <span>{status}</span>
          </div>
        </div>
        <div className="sc-v531-hero__meta" aria-label="Tool metadata">
          <span>{props.schema.category}</span>
          <span>{props.schema.primary_operation}</span>
          <span>Risk: {props.schema.risk_level}</span>
          <span>Schema: {props.schema.metadata.schema_version}</span>
          <span>Formula: {props.schema.metadata.formula_version}</span>
        </div>
      </header>

      {state.schemaState.validation_status === "invalid" ? (
        <ContractBlocker errors={state.schemaState.validation_errors} />
      ) : (
        <>
          <section className="sc-v531-mode-panel" aria-label="Profile mode selector">
            {PROFILE_MODES.map((mode) => (
              <button
                key={mode.id}
                type="button"
                className="sc-v531-mode-card"
                aria-pressed={activeMode === mode.id}
                data-active={activeMode === mode.id}
                onClick={() => machine.setProfileMode(mode.id)}
              >
                <strong>{mode.label}</strong>
                <span>{mode.description}</span>
              </button>
            ))}
          </section>

          <div className="sc-v531-layout">
            <main className="sc-v531-main">
              <section className="sc-v531-section sc-v531-guidance" aria-label="Decision context">
                <SectionHeader title="Decision context" subtitle="Operational boundary, evidence expectation, and result use." />
                <dl className="sc-v531-context-grid">
                  <ContextItem label="Decision support" value={readString(props.schema.decision_context, "decision_after_output")} />
                  <ContextItem label="Primary metric" value={readString(props.schema.decision_context, "primary_metric")} />
                  <ContextItem label="Wrong decision cost" value={readString(props.schema.decision_context, "cost_of_wrong_decision")} />
                  <ContextItem label="Classification" value={readString(props.schema.decision_context, "tool_use_classification")} />
                </dl>
              </section>

              <section className="sc-v531-section" aria-label="Guided input flow">
                <div className="sc-v531-section__topline">
                  <SectionHeader title="Guided input flow" subtitle="Enter measured values, select units, and confirm source evidence." />
                  <button
                    type="button"
                    className="sc-v531-secondary-button"
                    onClick={() => machine.setAdvancedVisible(!state.advancedDisclosureState.advanced_visible)}
                  >
                    {state.advancedDisclosureState.advanced_visible ? "Hide advanced fields" : "Show advanced fields"}
                  </button>
                </div>

                <div className="sc-v531-group-stack">
                  {visibleGroups.map((group) => (
                    <InputGroupPanel
                      key={group.id}
                      group={group}
                      expanded={state.advancedDisclosureState.expanded_groups[group.id] ?? true}
                      onToggle={() => machine.toggleGroup(group.id)}
                    >
                      <div className="sc-v531-field-grid">
                        {group.fields
                          .map((fieldId) => inputsById.get(fieldId))
                          .filter(isDefined)
                          .filter((input) => isInputVisibleInMode(input, activeMode, state.advancedDisclosureState.advanced_visible))
                          .map((input) => (
                            <IndustrialInputField
                              key={input.id}
                              input={input}
                              value={state.rawInputState[input.id] ?? null}
                              selectedUnit={state.selectedUnitState[input.id] ?? ""}
                              normalizedPreview={machine.normalizedPreview.find((item) => item.input_id === input.id) ?? null}
                              evidence={state.evidenceState[input.id]}
                              blockers={state.validationState.client_precheck_errors.filter((issue) => issue.input_id === input.id)}
                              onValueChange={(value) => machine.setInputValue(input.id, value)}
                              onUnitChange={(unit) => machine.setSelectedUnit(input.id, unit)}
                              onEvidenceChange={(patch) => machine.updateEvidence(input.id, patch)}
                            />
                          ))}
                      </div>
                    </InputGroupPanel>
                  ))}
                </div>
              </section>

              <WarningsPanel warnings={response?.warnings ?? []} clientIssues={state.validationState.client_precheck_errors} />
              <ResultsPanel outputs={response?.outputs ?? []} />
              <HiddenRiskPanel response={response} />
              <BusinessImpactPanel response={response} />
              {premiumHook ? <PremiumPanel hook={premiumHook} onCheckout={() => machine.requestCheckout()} /> : null}
              <FmeaPanel response={response} />
              <ProtectedMethodologyPanel schema={props.schema} response={response} />
              <AuditSealPanel response={response} redactionStatus={response?.redaction_status ?? null} />
              <ExportPanel
                pdfAvailable={state.exportState.pdf_available}
                jsonAuditAvailable={state.exportState.json_audit_available}
                copySummaryAvailable={state.exportState.copy_summary_available}
                redactionStatus={response?.redaction_status ?? null}
              />
            </main>

            <aside className="sc-v531-cockpit" aria-label="Sticky decision cockpit">
              <div className="sc-v531-cockpit__inner">
                <div className="sc-v531-cockpit__status" data-status={status.toLowerCase()}>
                  <span>Decision state</span>
                  <strong>{decision?.primary_decision ?? status}</strong>
                </div>
                <p className="sc-v531-cockpit__reason">
                  {decision?.primary_reason ?? "Server-side decision interpretation will appear after execution."}
                </p>

                <div className="sc-v531-cockpit__metrics">
                  <Metric label="Client blockers" value={String(state.blockerState.blockers.length)} />
                  <Metric label="Warnings" value={String((response?.warnings ?? []).length)} />
                  <Metric label="Audit seal" value={response?.audit_seal?.seal_status ?? "Pending"} />
                  <Metric label="Redaction" value={formatRedaction(response?.redaction_status ?? null)} />
                </div>

                <button
                  type="button"
                  className="sc-v531-primary-button"
                  disabled={state.executionState === "executing"}
                  onClick={() => void machine.submitServerExecution()}
                >
                  {state.executionState === "executing" ? "Executing on server" : "Run server decision check"}
                </button>
                <button type="button" className="sc-v531-secondary-button" onClick={machine.runClientPrecheck}>
                  Run client precheck
                </button>
                <button type="button" className="sc-v531-ghost-button" onClick={machine.resetResultOnly}>
                  Reset result only
                </button>
              </div>
            </aside>
          </div>

          <div className="sc-v531-mobile-action-bar">
            <span>{decision?.primary_decision ?? getExecutionStateLabel(state.executionState)}</span>
            <button
              type="button"
              className="sc-v531-primary-button"
              disabled={state.executionState === "executing"}
              onClick={() => void machine.submitServerExecution()}
            >
              Execute
            </button>
          </div>
        </>
      )}
    </section>
  );
}

function ContractBlocker({ errors }: { errors: string[] }) {
  return (
    <section className="sc-v531-contract-blocker" role="alert">
      <h2>Schema contract rejected</h2>
      <p>The form cannot render this schema until V5.3.1 contract blockers are corrected.</p>
      <ul>
        {errors.map((error) => (
          <li key={error}>{error}</li>
        ))}
      </ul>
    </section>
  );
}

function InputGroupPanel({ group, expanded, onToggle, children }: { group: UIInputGroup; expanded: boolean; onToggle: () => void; children: ReactNode }) {
  return (
    <article className="sc-v531-group" data-advanced={group.advanced === true}>
      <button type="button" className="sc-v531-group__header" aria-expanded={expanded} onClick={onToggle}>
        <span>
          <strong>{group.title}</strong>
          <small>{group.description}</small>
        </span>
        <span aria-hidden="true">{expanded ? "−" : "+"}</span>
      </button>
      {expanded ? <div className="sc-v531-group__body">{children}</div> : null}
    </article>
  );
}

function IndustrialInputField(props: {
  input: SuperV4Input;
  value: string | number | boolean | null;
  selectedUnit: string;
  normalizedPreview: { base_value: string | number | boolean | null; base_unit: string | null } | null;
  evidence?: { enabled: boolean; source_verified: boolean; user_verified: boolean; uploaded_references: string[] };
  blockers: Array<{ id: string; message: string; severity: string; suggested_action?: string }>;
  onValueChange: (value: string | number | boolean | null) => void;
  onUnitChange: (unit: string) => void;
  onEvidenceChange: (patch: { enabled?: boolean; source_verified?: boolean; user_verified?: boolean }) => void;
}) {
  const inputId = `sc-v531-${props.input.id}`;
  const helpText = props.input.user_help_text ?? props.input.help_text ?? "Enter a verified value for server-side decision execution.";
  const range = props.input.engineering_range ?? props.input.engineering_reference_range;
  const evidenceRequired = typeof props.input.evidence_requirement === "string"
    ? props.input.evidence_requirement.toLowerCase().includes("required")
    : props.input.evidence_requirement.required;

  return (
    <div className="sc-v531-field" data-criticality={props.input.criticality.toLowerCase()}>
      <div className="sc-v531-field__head">
        <label htmlFor={inputId}>{props.input.name}</label>
        <span>{props.input.symbol}</span>
      </div>
      <p className="sc-v531-field__help">{helpText}</p>

      <div className="sc-v531-field__control-row">
        {renderValueInput(inputId, props.input, props.value, props.onValueChange)}
        {props.input.unit_selectable ? (
          <select
            className="sc-v531-unit-select"
            value={props.selectedUnit}
            aria-label={`${props.input.name} display unit`}
            onChange={(event: ChangeEvent<HTMLSelectElement>) => props.onUnitChange(event.target.value)}
          >
            {props.input.allowed_display_units.map((unit) => (
              <option key={unit} value={unit}>{unit}</option>
            ))}
          </select>
        ) : null}
      </div>

      <div className="sc-v531-field__preview" aria-label="Normalized base-unit preview">
        <span>Base preview</span>
        <strong>{formatValue(props.normalizedPreview?.base_value ?? null)} {props.normalizedPreview?.base_unit ?? props.input.base_unit ?? ""}</strong>
      </div>

      <div className="sc-v531-reference-grid">
        <InfoChip label="Physical bounds" value={formatPhysicalBounds(props.input)} />
        <InfoChip label="Engineering range" value={formatEngineeringRange(range)} />
        <InfoChip label="Reference" value={formatReferenceValues(props.input.reference_values)} />
        <InfoChip label="Evidence" value={evidenceRequired ? "Required" : "Advisory"} />
      </div>

      <div className="sc-v531-evidence-row" aria-label={`${props.input.name} evidence controls`}>
        <label>
          <input
            type="checkbox"
            checked={props.evidence?.user_verified ?? false}
            onChange={(event: ChangeEvent<HTMLInputElement>) => props.onEvidenceChange({ user_verified: event.target.checked, enabled: true })}
          />
          User verified
        </label>
        <label>
          <input
            type="checkbox"
            checked={props.evidence?.source_verified ?? false}
            onChange={(event: ChangeEvent<HTMLInputElement>) => props.onEvidenceChange({ source_verified: event.target.checked, enabled: true })}
          />
          Source verified
        </label>
      </div>

      {props.blockers.length > 0 ? (
        <ul className="sc-v531-field__issues">
          {props.blockers.map((issue) => (
            <li key={issue.id} data-severity={issue.severity.toLowerCase()}>
              <strong>{issue.severity}</strong> {issue.message}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

function renderValueInput(
  inputId: string,
  input: SuperV4Input,
  value: string | number | boolean | null,
  onValueChange: (value: string | number | boolean | null) => void,
) {
  if (input.type === "boolean") {
    return (
      <label className="sc-v531-toggle">
        <input type="checkbox" checked={value === true} onChange={(event: ChangeEvent<HTMLInputElement>) => onValueChange(event.target.checked)} />
        <span>Enabled</span>
      </label>
    );
  }

  if (input.type === "select") {
    return (
      <select id={inputId} className="sc-v531-input" value={typeof value === "string" ? value : ""} onChange={(event: ChangeEvent<HTMLSelectElement>) => onValueChange(event.target.value)}>
        <option value="">Select value</option>
        {(input.allowed_values ?? []).map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    );
  }

  if (input.type === "number" || input.type === "integer") {
    return (
      <input
        id={inputId}
        className="sc-v531-input"
        inputMode="decimal"
        type="number"
        step={input.type === "integer" ? "1" : "0.000001"}
        value={typeof value === "number" ? String(value) : ""}
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          if (event.target.value === "") {
            onValueChange(null);
            return;
          }
          const next = Number(event.target.value);
          onValueChange(Number.isFinite(next) ? next : null);
        }}
      />
    );
  }

  return (
    <input
      id={inputId}
      className="sc-v531-input"
      type="text"
      value={typeof value === "string" ? value : ""}
      onChange={(event: ChangeEvent<HTMLInputElement>) => onValueChange(event.target.value)}
    />
  );
}

function WarningsPanel({ warnings, clientIssues }: { warnings: ServerWarning[]; clientIssues: Array<{ id: string; message: string; severity: string; suggested_action?: string }> }) {
  const hasContent = warnings.length > 0 || clientIssues.length > 0;
  return (
    <section className="sc-v531-section" aria-label="Semantic warnings">
      <SectionHeader title="Semantic warnings" subtitle="Client precheck and server warnings are shown without public formula exposure." />
      {hasContent ? (
        <div className="sc-v531-warning-stack">
          {clientIssues.map((issue) => (
            <WarningCard key={issue.id} severity={issue.severity} title={issue.message} detail={issue.suggested_action ?? "Resolve the issue before execution."} />
          ))}
          {warnings.map((warning) => (
            <WarningCard key={warning.id} severity={warning.severity} title={warning.message} detail={warning.suggested_action} />
          ))}
        </div>
      ) : (
        <p className="sc-v531-empty">No warnings are available yet.</p>
      )}
    </section>
  );
}

function ResultsPanel({ outputs }: { outputs: ServerOutput[] }) {
  return (
    <section className="sc-v531-section" aria-label="Result cards">
      <SectionHeader title="Result cards" subtitle="Server-generated outputs and user-facing interpretations." />
      {outputs.length > 0 ? (
        <div className="sc-v531-result-grid">
          {outputs.map((output) => (
            <article key={output.id} className="sc-v531-result-card" data-status={(output.status ?? "OK").toLowerCase()}>
              <span>{output.decision_use}</span>
              <strong>{output.name}</strong>
              <p className="sc-v531-result-card__value">{formatValue(output.value)} {output.unit ?? ""}</p>
              <p>{output.public_explanation}</p>
            </article>
          ))}
        </div>
      ) : (
        <p className="sc-v531-empty">Server outputs will appear after execution.</p>
      )}
    </section>
  );
}

function HiddenRiskPanel({ response }: { response: ExecuteResponse | null }) {
  const risks = response?.decision_interpretation.hidden_risk_explanations ?? [];
  return (
    <section className="sc-v531-section" aria-label="Hidden risk panel">
      <SectionHeader title="Hidden risk panel" subtitle="Server-generated risk explanations and next action guidance." />
      {risks.length > 0 ? (
        <div className="sc-v531-warning-stack">
          {risks.map((risk) => (
            <WarningCard key={risk.id} severity={risk.severity} title={risk.message} detail={risk.suggested_action} />
          ))}
        </div>
      ) : (
        <p className="sc-v531-empty">Hidden risk explanations will appear after server execution.</p>
      )}
    </section>
  );
}

function BusinessImpactPanel({ response }: { response: ExecuteResponse | null }) {
  const impact = response?.decision_interpretation.money_impact_summary;
  return (
    <section className="sc-v531-section" aria-label="Business impact panel">
      <SectionHeader title="Business impact panel" subtitle="Commercial exposure, cost driver, and quote or decision impact." />
      {impact?.enabled ? (
        <dl className="sc-v531-context-grid">
          <ContextItem label="Money at risk" value={impact.money_at_risk_formatted ?? "Not calculated"} />
          <ContextItem label="Main cost driver" value={impact.main_cost_driver ?? "Not identified"} />
          <ContextItem label="Decision impact" value={impact.quote_or_decision_impact} />
          <ContextItem label="Currency" value={impact.currency ?? "User-entered display currency only"} />
        </dl>
      ) : (
        <p className="sc-v531-empty">Business impact will appear when commercial inputs and server outputs are available.</p>
      )}
    </section>
  );
}

function PremiumPanel({
  hook,
  onCheckout,
}: {
  hook: import("@/sectorcalc/monetization/monetization-types").PremiumHookPublic;
  onCheckout: () => Promise<string | null>;
}) {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const url = await onCheckout();
      if (url) {
        window.location.href = url;
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="sc-v531-section" aria-label="Premium hook panel">
      <SectionHeader
        title="Monetary loss exposure"
        subtitle="Estimated decision-support pain metric based on current outputs and user-entered commercial context."
      />
      <article className="sc-v531-result-card" data-status={hook.pain_metric.status.toLowerCase()}>
        <strong>{hook.pain_metric.label}</strong>
        <p className="sc-v531-result-card__value">
          {hook.pain_metric.value !== null
            ? `${formatValue(hook.pain_metric.value)} ${hook.pain_metric.unit}`
            : "Insufficient input context to estimate monetary exposure."}
        </p>
        <p>{hook.pain_metric.explanation}</p>
        <p className="sc-v531-legal-disclaimer">{hook.pain_metric.safety_note}</p>
      </article>
      <div className="sc-v531-export-row" style={{ marginTop: "1rem" }}>
        <button
          type="button"
          className="sc-v531-primary-button"
          disabled={loading}
          onClick={handleCheckout}
        >
          {loading ? "Opening checkout..." : hook.cta.label}
        </button>
      </div>
      <p className="sc-v531-empty">{hook.cta.subtext}</p>
    </section>
  );
}

function FmeaPanel({ response }: { response: ExecuteResponse | null }) {
  const fmea = response?.fmea_summary;
  return (
    <section className="sc-v531-section" aria-label="FMEA panel">
      <SectionHeader title="FMEA panel" subtitle="Triggered when utilization, uncertainty, evidence, or risk thresholds require review." />
      {fmea?.triggered ? (
        <div className="sc-v531-fmea-grid">
          <Metric label="Highest RPN" value={String(fmea.highest_rpn)} />
          <Metric label="Total RPN" value={String(fmea.total_rpn)} />
          <Metric label="Threshold exceeded" value={fmea.threshold_exceeded ? "Yes" : "No"} />
          {fmea.items.map((item, index) => (
            <article key={`${item.failure_mode}-${index}`} className="sc-v531-fmea-card">
              <strong>{item.failure_mode}</strong>
              <p>{item.effect}</p>
              <span>RPN {item.rpn}</span>
            </article>
          ))}
        </div>
      ) : (
        <p className="sc-v531-empty">No FMEA summary is available yet.</p>
      )}
    </section>
  );
}

function ProtectedMethodologyPanel({ schema, response }: { schema: SuperV4Schema; response: ExecuteResponse | null }) {
  const proofSections = response?.proof_pack_public.sections ?? [];
  return (
    <section className="sc-v531-section" aria-label="Protected methodology panel">
      <SectionHeader title="Protected methodology" subtitle="Public-safe methodology context without exact formula disclosure." />
      <div className="sc-v531-methodology-box">
        <p>Exact formulas, private registry nodes, restricted tables, and internal execution sequence are not exposed in this public form.</p>
        <p>Formula quality gate: {String(schema.metadata.formula_quality_gate ?? "SECTORCALC_FORMULA_QUALITY_GATE_V5_3_1")}</p>
      </div>
      {proofSections.length > 0 ? (
        <div className="sc-v531-proof-stack">
          {proofSections.map((section) => (
            <article key={section.id} className="sc-v531-proof-card">
              <strong>{section.title}</strong>
              <p>{section.public_content}</p>
            </article>
          ))}
        </div>
      ) : null}
    </section>
  );
}

function AuditSealPanel({ response, redactionStatus }: { response: ExecuteResponse | null; redactionStatus: RedactionStatus | null }) {
  const seal = response?.audit_seal;
  return (
    <section className="sc-v531-section" aria-label="Audit seal panel">
      <SectionHeader title="Audit seal" subtitle="Public audit seal summary for reproducibility and tamper awareness." />
      {seal ? (
        <dl className="sc-v531-context-grid">
          <ContextItem label="Seal status" value={seal.seal_status} />
          <ContextItem label="Schema version" value={seal.schema_version} />
          <ContextItem label="Formula version" value={seal.formula_version} />
          <ContextItem label="Runtime version" value={seal.runtime_version} />
          <ContextItem label="Redaction" value={formatRedaction(redactionStatus)} />
          <ContextItem label="Hash algorithm" value={seal.hash_algorithm} />
        </dl>
      ) : (
        <p className="sc-v531-empty">Audit seal will appear after server execution.</p>
      )}
    </section>
  );
}

function ExportPanel(props: { pdfAvailable: boolean; jsonAuditAvailable: boolean; copySummaryAvailable: boolean; redactionStatus: RedactionStatus | null }) {
  return (
    <section className="sc-v531-section" aria-label="Export panel">
      <SectionHeader title="Export panel" subtitle="Exports are available only after public-safe redaction." />
      <div className="sc-v531-export-row">
        <button type="button" className="sc-v531-secondary-button" disabled={!props.pdfAvailable}>PDF</button>
        <button type="button" className="sc-v531-secondary-button" disabled={!props.jsonAuditAvailable}>JSON audit</button>
        <button type="button" className="sc-v531-secondary-button" disabled={!props.copySummaryAvailable}>Copy summary</button>
      </div>
      <p className="sc-v531-empty">Redaction status: {formatRedaction(props.redactionStatus)}</p>
    </section>
  );
}

function SectionHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="sc-v531-section__header">
      <h2>{title}</h2>
      <p>{subtitle}</p>
    </div>
  );
}

function ContextItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="sc-v531-context-item">
      <dt>{label}</dt>
      <dd>{value || "Not specified"}</dd>
    </div>
  );
}

function InfoChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="sc-v531-info-chip">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="sc-v531-metric">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function WarningCard({ severity, title, detail }: { severity: string; title: string; detail: string }) {
  return (
    <article className="sc-v531-warning-card" data-severity={severity.toLowerCase()}>
      <span>{severity}</span>
      <strong>{title}</strong>
      <p>{detail}</p>
    </article>
  );
}

function getVisibleGroups(groups: UIInputGroup[], mode: ProfileMode, advancedVisible: boolean): UIInputGroup[] {
  return groups.filter((group) => {
    const modes = group.mode_visibility ?? group.visible_in_modes ?? ["quick", "engineering", "cost", "audit"];
    if (!modes.includes(mode)) return false;
    if (group.advanced && !advancedVisible) return false;
    return true;
  });
}

function isInputVisibleInMode(input: SuperV4Input, mode: ProfileMode, advancedVisible: boolean): boolean {
  const binding = input.ui_binding;
  const modes = binding?.visible_in_modes ?? ["quick", "engineering", "cost", "audit"];
  if (!modes.includes(mode)) return false;
  if (binding?.advanced && !advancedVisible) return false;
  return true;
}

function formatPhysicalBounds(input: SuperV4Input): string {
  const bounds = input.physical_hard_bounds;
  if (!bounds) return "No universal bound available";
  const min = bounds.min === null ? "−∞" : String(bounds.min);
  const max = bounds.max === null ? "+∞" : String(bounds.max);
  return `${min} to ${max} ${bounds.unit}`;
}

function formatEngineeringRange(range: SuperV4Input["engineering_range"] | SuperV4Input["engineering_reference_range"]): string {
  if (!range || range.status === "NOT_APPLICABLE") return "Not applicable";
  const min = range.min === null ? "−∞" : String(range.min);
  const max = range.max === null ? "+∞" : String(range.max);
  return `${min} to ${max} ${range.unit}`;
}

function formatReferenceValues(referenceValues: SuperV4Input["reference_values"]): string {
  if (Array.isArray(referenceValues)) {
    if (referenceValues.length === 0) return "No reference values";
    return referenceValues.map((item) => item.source).join(" · ");
  }
  return referenceValues.source || referenceValues.public_note || "Source-labeled reference required";
}

function readString(record: Record<string, unknown>, key: string): string {
  const value = record[key];
  return typeof value === "string" ? value : "";
}

function formatValue(value: number | string | boolean | null): string {
  if (typeof value === "number") return Number.isInteger(value) ? String(value) : value.toPrecision(6).replace(/\.?0+$/, "");
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (typeof value === "string") return value;
  return "Pending";
}

function formatRedaction(status: RedactionStatus | null): string {
  if (!status) return "Pending";
  return status.replaceAll("_", " ");
}

function executionStateToStatus(state: string): CalcStatus {
  if (state === "server_ok") return "OK";
  if (state === "server_review") return "REVIEW";
  if (state === "server_blocked" || state === "client_precheck_blocked" || state === "schema_rejected") return "BLOCKED";
  if (state === "server_reprice") return "REPRICE";
  if (state === "server_reject") return "REJECT";
  if (state === "server_hold") return "HOLD";
  return "REVIEW";
}

function isDefined<T>(value: T | undefined | null): value is T {
  return value !== undefined && value !== null;
}


export default UniversalIndustrialDecisionForm;
