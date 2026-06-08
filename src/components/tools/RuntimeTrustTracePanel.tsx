"use client";

import type { RuntimeTrustTraceView } from "@/lib/formula-governance/runtime-validation/full-loop-bridge-shared";

type RuntimeTrustTracePanelProps = {
  readonly trustTrace: RuntimeTrustTraceView;
};

function statusLabel(status: RuntimeTrustTraceView["loopStatus"]): string {
  switch (status) {
    case "SUCCESS":
      return "Validated";
    case "READY_TO_CALCULATE":
      return "Ready";
    case "NEED_DATA":
      return "Missing inputs";
    case "PHYSICS_OR_LOGIC_ERROR":
      return "Validation failed";
    case "BLOCKED":
      return "Blocked";
    default:
      return status;
  }
}

export function RuntimeTrustTracePanel({ trustTrace }: RuntimeTrustTracePanelProps) {
  return (
    <section
      className="sc-ledger-panel sc-industrial-panel border border-dashed border-border-subtle p-4"
      data-component-kind="runtime_trust_trace_panel"
      aria-label="Trust trace"
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <h3 className="text-base font-semibold text-text-primary">Trust trace</h3>
        <span className="rounded border border-border-subtle bg-surface-muted px-2 py-0.5 text-xs font-medium text-text-secondary">
          {statusLabel(trustTrace.loopStatus)}
        </span>
      </div>
      <p className="mt-1 text-sm text-text-secondary">
        Dual-intelligence runtime path — inputs, requirement resolution, and validation before verdict.
      </p>

      <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-text-secondary">Canonical inputs</dt>
          <dd className="mt-1 text-text-primary">{trustTrace.canonicalInputs.join(", ") || "—"}</dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-text-secondary">Requirement engine</dt>
          <dd className="mt-1 text-text-primary">{trustTrace.requirementStatus}</dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-text-secondary">Validation</dt>
          <dd className="mt-1 text-text-primary">
            {trustTrace.validationPassed ? "Pass" : "Blocked"}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-text-secondary">Formula path</dt>
          <dd className="mt-1 text-text-primary">{trustTrace.formulaPath.join(" → ") || "—"}</dd>
        </div>
      </dl>

      {trustTrace.rejectedKeys.length > 0 ? (
        <p className="mt-3 text-xs text-amber-800">
          Rejected non-canonical keys: {trustTrace.rejectedKeys.join(", ")}
        </p>
      ) : null}

      {trustTrace.requiredMissingInputs.length > 0 ? (
        <p className="mt-3 text-xs text-crit-red" role="alert">
          Missing: {trustTrace.requiredMissingInputs.join(", ")}
        </p>
      ) : null}

      <ul className="mt-4 space-y-2 text-sm text-text-secondary">
        <li>
          <span className="font-medium text-text-primary">Assumptions:</span>{" "}
          {trustTrace.acceptedAssumptions.length > 0
            ? trustTrace.acceptedAssumptions.join(" · ")
            : "—"}
        </li>
        <li>
          <span className="font-medium text-text-primary">Validation sources:</span>{" "}
          {trustTrace.validationSources.join(", ")}
        </li>
        {trustTrace.validationErrors.length > 0 ? (
          <li className="text-crit-red" role="alert">
            <span className="font-medium">Validation errors:</span>{" "}
            {trustTrace.validationErrors.join(" · ")}
          </li>
        ) : null}
        {trustTrace.limitations.length > 0 ? (
          <li>
            <span className="font-medium text-text-primary">Model limitations:</span>{" "}
            {trustTrace.limitations.slice(0, 3).join(" · ")}
          </li>
        ) : null}
      </ul>
    </section>
  );
}
