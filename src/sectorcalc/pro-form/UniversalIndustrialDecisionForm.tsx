// SectorCalc Universal Industrial Decision Form — V5.3.1
// Calculator-first renderer (V2). Temporary build-and-verify file.
// The public client never executes formulas.

"use client";

import type { ChangeEvent, ReactNode } from "react";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import type {
  CalcStatus,
  ExecuteResponse,
  ProfileMode,
  ServerOutput,
  ServerWarning,
  SuperV4Input,
  SuperV4Schema,
} from "./contract-types";
import type { ToolRenderContract } from "@/sectorcalc/runtime/build-tool-render-contract";
import { assertToolSchemaIdentity } from "@/sectorcalc/runtime/assert-tool-schema-identity";
import { getExecutionStateLabel } from "./form-state-machine";
import { useUniversalIndustrialDecisionFormMachine } from "./useUniversalIndustrialDecisionFormMachine";
import {
  getDisplayToolName,
  getDisplayCategoryLabel,
  getDisplayOperationLabel,
  humanizeEnum,
} from "./display-labels";
import {
  hasServerResponse,
  safeBasePreview,
  safeDisplayCategory,
  getPrimaryCtaLabel,
  formatSafeValue,
  formatDisplayNumber,
  formatBusinessResult,
  safeDisplayScope,
  formatCleanUnitLabel,
  buildSafeDisplayUnitOptions,
  getProOutputSymbol,
  getProOutputDisplayUnit,
  SUPPORTED_CURRENCIES,
  type CurrencyCode,
  replaceCurrencyLabel,
  getFreeToolDescription,
  isGenericHelpText,
  deriveFieldDescription,
} from "./form-render-helpers";
import { normalizeV531FieldMetadata } from "./normalize-v531-field-metadata";
import { FreeToolResultPanel } from "@/sectorcalc/free-form/FreeToolResultPanel";
import { MobileStickyActionBar, resolveToolStickyBarState } from "@/components/layout/mobile/MobileStickyActionBar";
import {
  convertDisplayToCanonical,
  convertCanonicalToDisplay,
} from "./unit-display-resolver";
import { buildProReport } from "@/sectorcalc/pro-report/pro-report-adapter";
import { ProReportPanelV2 } from "@/sectorcalc/pro-report/ProReportPanelV2";
import { assertCrossToolIdentity } from "@/sectorcalc/runtime/cross-tool-contract-assertions";
import {
  parseProNumericDraft,
  sanitizeProNumericDraft,
  type ProNumericFieldType,
} from "./numeric-input-draft";

// ── ViewModel types ────────────────────────────────────────────────────────────

/** True only for non-empty strings after trim. */
function hasMessage(value: unknown): boolean {
  return typeof value === "string" && value.trim().length > 0;
}

interface EvidenceRow {
  valueVerified: boolean;
  sourceVerified: boolean;
  evidenceRequired: boolean;
  evidenceLabel: string;
}

interface FieldViewModel {
  id: string;
  label: string;
  symbol: string | null;
  type: "number" | "integer" | "boolean" | "select" | "string";
  value: string | number | boolean | null;
  selectedUnit: string;
  allowedUnits: string[];
  unitSelectable: boolean;
  canonicalUnit: string;
  allowedValues: string[];
  helpText: string;
  criticality: string;
  blockers: Array<{ id: string; message: string; severity: string; suggested_action?: string }>;
  basePreview: string | null;
  /** Public-safe reference source label, tool-characteristic. Never generic placeholder. */
  referenceSource: string | null;
  tolerancePct: string | null;
  evidence: EvidenceRow;
  /** Compact reference metadata lines rendered under the input row. */
  referenceStrip: string[];
  /** V5.3.1: Always-present metadata block values or neutral "No declared..." messages. */
  declaredRange: string;
  declaredDefaultReference: string;
  declaredAcceptedValues: string;
  declaredTolerance: string;
  /** Single clean user-facing reference helper line. Shown in both FREE and PRO. */
  cleanReferenceHelper: string;
}

interface ActionViewModel {
  label: string;
  disabled: boolean;
  disabledReason: string | null;
  onAction: () => void;
}

interface ResultViewModel {
  hasResult: boolean;
  status: string;
  executionLabel: string;
  primaryOutput: { name: string; value: string; unit: string; explanation: string } | null;
  decision: string | null;
  reason: string | null;
  nextAction: string | null;
}

interface CalculatorViewModel {
  title: string;
  purpose: string;
  badges: Array<{ label: string; type: "category" | "tier" | "risk" | "version" | "runs" }>;
  fields: FieldViewModel[];
  action: ActionViewModel;
  resultState: ResultViewModel;
  warnings: Array<{ severity: string; title: string; detail: string }>;
}

// ── Props ──────────────────────────────────────────────────────────────────────

export interface UniversalIndustrialDecisionFormProps {
  schema: SuperV4Schema;
  schemaHash?: string | null;
  executeEndpoint?: string;
  initialProfileMode?: ProfileMode;
  className?: string;
  /** Route slug for identity assertion. Must match schema.tool_key. */
  toolKey?: string;
  /** Access tier: FREE tools require no payment, PRO tools are credit-gated. */
  accessTier?: "FREE" | "PRO";
  /** Presentation mode: FREE_COMPACT (compact calculator), PRO_AUDIT (full audit), ASSISTED_DOSSIER (file-based). */
  presentationMode?: "FREE_COMPACT" | "PRO_AUDIT" | "ASSISTED_DOSSIER";
  /** Usage session ID for Pro tool execution tracking. */
  usageSessionId?: string | null;
  /** Remaining runs for the active Pro usage session. */
  remainingRuns?: number | null;
  /** Called when user requests to use a credit for a Pro tool. */
  onRequestCreditSession?: (toolKey: string) => void;
  /** Whether a credit session is being created. */
  creditSessionLoading?: boolean;
  /** Whether the user is signed in (for button label gating). */
  isSignedIn?: boolean;
  /** Firebase Auth ID token for execute API authorization. */
  executeAuthToken?: string | null;
  /** Pre-validated render contract from buildToolRenderContract. */
  renderContract?: ToolRenderContract;
}

// ── ViewModel builder ──────────────────────────────────────────────────────────

function buildCalculatorViewModel(
  schema: SuperV4Schema,
  state: ReturnType<typeof useUniversalIndustrialDecisionFormMachine>["state"],
  machine: ReturnType<typeof useUniversalIndustrialDecisionFormMachine>,
  props: UniversalIndustrialDecisionFormProps,
  activeMode: ProfileMode,
  response: ExecuteResponse | null,
  accessTier: "FREE" | "PRO",
  hasSession: boolean,
  runsRemaining: number,
  isExecuting: boolean,
  hasResult: boolean,
  primaryButtonDisabled: boolean,
  primaryButtonLabel: string,
  primaryButtonAction: () => void,
  clientBlockerCount: number,
  toolName: string,
  displayScope: string,
  displayCategory: string,
  displayOperation: string,
  identityCheck: { ok: boolean; reason?: string } | null,
  selectedCurrency: CurrencyCode,
): CalculatorViewModel {
  const decision = response?.decision_interpretation;
  const isFree = accessTier === "FREE";

  // Badges — only category + tier in primary UI
  const badges: CalculatorViewModel["badges"] = [];
  const cleanBadgeLabel = (label: string) =>
    label.replace(/[·\s]*SuperV4[^·]*/gi, "").replace(/[·\s]*V5[.\d]*/gi, "").replace(/\s{2,}/g, " ").replace(/[·\s]*$/g, "").trim() || label;
  if (isFree) {
    // FREE mode: only category + tier, no version/risk/runs badges
    badges.push({ label: cleanBadgeLabel(displayCategory) || "Calculator", type: "category" });
    badges.push({ label: "Free", type: "tier" });
  } else {
    badges.push({ label: cleanBadgeLabel(displayCategory) || "Calculator", type: "category" });
    badges.push({ label: accessTier === "PRO" ? "Pro" : "Free", type: "tier" });
  }

  // Compute tool-characteristic reference source label based on category
  const referenceSourceLabel = getReferenceSourceLabel(
    schema.category,
    schema.reference_status,
  );

  const fields: FieldViewModel[] = schema.inputs
    .filter((input) => {
      const binding = input.ui_binding;
      const modes = binding?.visible_in_modes ?? ["quick", "engineering", "cost", "audit"];
      return modes.includes(activeMode);
    })
    .map((input) => {
      const basePreviewVal = (() => {
        const preview = (machine.normalizedPreview ?? []).find((item) => item.input_id === input.id);
        if (!preview || preview.base_value === null || preview.base_value === undefined) return null;
        return safeBasePreview(preview.base_value, preview.base_unit ?? input.base_unit ?? null);
      })();

      // Compute evidence row state
      const evState = state.evidenceState[input.id];
      const evReq = input.evidence_requirement;
      const evidenceRequired = typeof evReq === "string"
        ? evReq.toLowerCase().includes("required")
        : evReq?.required === true;
      const evidenceLabel = evidenceRequired ? "Source verification required" : "Source verification (optional)";

      // Tolerance
      const tolPct = computeTolerancePct(input);

      // Reference source: per-input if available, else tool-characteristic default
      const inputRefSource = computeInputReferenceSource(input, referenceSourceLabel);

      // ── V5.3.1: Normalize field metadata from schema ──
      const meta = normalizeV531FieldMetadata(input, props.schema);

      // Clean reference helper — one user-facing line per input, en-US format
      // Priority: 1. engineering_range / engineering_reference_range, 2. meta.allowedRange, 3. physical_hard_bounds as "Input limit"
      const cleanReferenceHelper = (() => {
        // Priority 1: engineering_reference_range or engineering_range
        const er = input.engineering_reference_range ?? input.engineering_range;
        if (er && er.min !== null && er.max !== null) {
          const uLabel = er.unit ? formatCleanUnitLabel(er.unit) : "";
          const minF = formatDisplayNumber(er.min, { decimals: 6, stripTrailingZeros: true });
          const maxF = formatDisplayNumber(er.max, { decimals: 6, stripTrailingZeros: true });
          const uStr = uLabel ? ` ${uLabel}` : "";
          return `Reference: ${minF}–${maxF}${uStr}`;
        }
        // Priority 2: normalized allowedRange (from physical_hard_bounds or other)
        if (meta.allowedRange) {
          return `Reference: ${meta.allowedRange}`;
        }
        // Priority 3: physical_hard_bounds as "Input limit"
        const hb = input.physical_hard_bounds;
        if (hb && hb.min !== null && hb.max !== null) {
          const unitLabel = hb.unit ? formatCleanUnitLabel(hb.unit) : "";
          const minFormatted = formatDisplayNumber(hb.min, { decimals: 0, stripTrailingZeros: true });
          const maxFormatted = formatDisplayNumber(hb.max, { decimals: 0, stripTrailingZeros: true });
          const unitStr = unitLabel ? ` ${unitLabel}` : "";
          return `Input limit: ${minFormatted}–${maxFormatted}${unitStr}`;
        }
        if (meta.defaultReference) {
          return `Reference: ${meta.defaultReference}`;
        }
        return "";
      })();

      // ── Reference strip: compact metadata lines under each input ──
      const refStrip: string[] = [];

      // Priority 1: physical hard bounds (min/max)
      const hb = input.physical_hard_bounds;
      if (hb && hb.min !== null && hb.max !== null) {
        const hbUnit = hb.unit ? ` ${hb.unit}` : "";
        refStrip.push(`Allowed range: ${hb.min}–${hb.max}${hbUnit}`);
      }

      // Priority 2: resolution / precision
      if (input.resolution != null) {
        refStrip.push(`Resolution: ${input.resolution}`);
      } else if (input.precision_policy?.input_decimals != null) {
        refStrip.push(`Precision: ${input.precision_policy.input_decimals} decimal places`);
      }

      // Priority 3: default value (from schema default or enriched _reference_default_text)
      const defVal = input.default_value ?? input.default;
      if (defVal != null && defVal !== "") {
        refStrip.push(`Default reference: ${String(defVal)}`);
      } else if (meta.defaultReference) {
        refStrip.push(`Reference: ${meta.defaultReference}`);
      }

      // Priority 4: enum / allowed values
      if (Array.isArray(input.allowed_values) && input.allowed_values.length > 0) {
        refStrip.push(`Accepted values: ${input.allowed_values.map(humanizeEnum).join(", ")}`);
      }

      // Priority 5: evidence text (only if no richer metadata exists)
      const hasNumericRef = refStrip.length > 0;
      if (!hasNumericRef && input.required) {
        refStrip.push(
          "Evidence required: user-verified source, calibrated measurement, ERP/job record, or approved engineering note.",
        );
      }

      // Fallback if truly no metadata
      if (refStrip.length === 0) {
        refStrip.push("Reference data: not specified in this tool schema.");
      }

      const declaredRange = meta.allowedRange
        ? `Allowed range: ${meta.allowedRange}`
        : "No declared range in schema";

      const declaredDefaultReference = meta.defaultReference
        ? `Default reference: ${meta.defaultReference}`
        : "No declared reference value in schema";

      const declaredAcceptedValues = Array.isArray(meta.acceptedValues) && meta.acceptedValues.length > 0
        ? `Accepted values: ${meta.acceptedValues.join(", ")}`
        : "No declared accepted values in schema";

      const declaredTolerance = meta.toleranceText
        ? `Tolerance: ${meta.toleranceText}`
        : "No declared tolerance in schema";

      // Build unit options context for currency-aware resolution
      const isMonetary = isMonetaryField(input);
      const isMonetaryPerUnit = isMonetary && isMonetaryPerUnitField(input);
      const isCount = isCountField(input);
      const unitCtx = { selectedCurrency, isMonetary, isMonetaryPerUnit, isCount, inputId: input.id, inputName: input.name };
      const resolvedUnitOptions = buildSafeDisplayUnitOptions(input.base_unit ?? "", unitCtx);
      // For count fields, always use resolver to get Units/pcs/batches/cycles options.
      // For other fields, prefer schema-allowed_display_units when defined.
      const useResolverForUnit = isCount;
      return {
        id: input.id,
        label: input.name,
        symbol: input.symbol ?? null,
        type: input.type === "integer" ? "integer" : (input.type as FieldViewModel["type"]),
        value: state.rawInputState[input.id] ?? null,
        selectedUnit: state.selectedUnitState[input.id]
          ?? (useResolverForUnit
            ? (resolvedUnitOptions[0] ?? "")
            : (input.allowed_display_units?.length
              ? input.allowed_display_units[0]
              : (resolvedUnitOptions[0] ?? ""))),
        allowedUnits: useResolverForUnit
          ? resolvedUnitOptions
          : (input.allowed_display_units?.length
            ? input.allowed_display_units
            : resolvedUnitOptions),
        unitSelectable: !!input.unit_selectable,
        canonicalUnit: input.base_unit ?? "",
        allowedValues: input.allowed_values ?? [],
        helpText: (() => {
          const raw = input.user_help_text ?? input.help_text ?? "";
          if (isGenericHelpText(raw)) {
            return deriveFieldDescription(input.name, props.toolKey ?? props.schema?.tool_key ?? "", input.base_unit);
          }
          return raw;
        })(),
        criticality: input.criticality,
        blockers: state.validationState.client_precheck_errors.filter((issue) => issue.input_id === input.id),
        basePreview: isFree ? null : basePreviewVal,
        referenceSource: isFree ? null : inputRefSource,
        tolerancePct: isFree ? null : tolPct,
        evidence: isFree
          ? { valueVerified: false, sourceVerified: false, evidenceRequired: false, evidenceLabel: "" }
          : {
              valueVerified: evState?.user_verified === true || evState?.enabled === true,
              sourceVerified: evState?.source_verified === true,
              evidenceRequired,
              evidenceLabel,
            },
        referenceStrip: isFree ? [] : refStrip,
        declaredRange: isFree ? "" : declaredRange,
        declaredDefaultReference: isFree ? "" : declaredDefaultReference,
        declaredAcceptedValues: isFree ? "" : declaredAcceptedValues,
        declaredTolerance: isFree ? "" : declaredTolerance,
        cleanReferenceHelper,
      };
    });

  // Action
  const action: ActionViewModel = {
    label: primaryButtonLabel,
    disabled: primaryButtonDisabled,
    disabledReason: primaryButtonDisabled
      ? (isExecuting
          ? (isFree ? "Processing..." : "Server execution in progress.")
          : (accessTier === "PRO" && !hasSession)
            ? "Use 1 credit to start."
            : (accessTier === "PRO" && runsRemaining <= 0)
              ? "Session exhausted."
              : null)
      : null,
    onAction: primaryButtonAction,
  };

  // Result state
  const primaryOutput = hasResult && response?.outputs?.length
    ? {
        name: response.outputs[0].name,
        value: formatSafeValue(response.outputs[0].value),
        unit: response.outputs[0].unit ?? "",
        explanation: response.outputs[0].public_explanation ?? "",
      }
    : null;

  const resultState: ResultViewModel = {
    hasResult,
    status: response?.status ?? executionStateToStatus(state.executionState),
    executionLabel: getExecutionStateLabel(state.executionState),
    primaryOutput,
    decision: decision?.primary_decision ?? null,
    reason: decision?.primary_reason ?? null,
    nextAction: decision?.next_best_actions?.[0] ?? null,
  };

  // Warnings (filtered — hide internal/system warnings for both FREE and PRO)
  const warnings: CalculatorViewModel["warnings"] = [];
  for (const issue of state.validationState.client_precheck_errors) {
    if (isInternalWarning(issue.message)) continue;
    warnings.push({
      severity: issue.severity,
      title: issue.message,
      detail: issue.suggested_action ?? "Resolve before execution.",
    });
  }
  if (response?.warnings) {
    for (const w of response.warnings) {
      if (isInternalWarning(w.message)) continue;
      warnings.push({ severity: w.severity, title: w.message, detail: w.suggested_action ?? "" });
    }
  }

  return { title: toolName, purpose: displayScope, badges, fields, action, resultState, warnings };
}

/** True if an output is a status/decision output and should not appear in primary result grid. */
function isStatusOutput(out: { name?: string; decision_use?: string | null }): boolean {
  const key = (out.name ?? "").toLowerCase().replace(/[\s-]+/g, "_");
  return (
    key.includes("decision_status") ||
    key.includes("governing_driver") ||
    out.decision_use === "STATUS"
  );
}

/** Warnings to hide in primary UI — applied for both FREE and PRO. */
function isInternalWarning(message: string): boolean {
  const lower = message.toLowerCase();
  return (
    lower.includes("derating") ||
    lower.includes("trigger_inputs") ||
    lower.includes("source evidence") ||
    lower.includes("source verified") ||
    lower.includes("evidence required") ||
    lower.includes("review derating contract") ||
    lower.includes("no declared accepted values") ||
    lower.includes("no declared range") ||
    lower.includes("no declared tolerance") ||
    lower.includes("no declared reference") ||
    lower.includes("superv4") ||
    lower.includes("single-operation")
  );
}

// ── FREE output unit suffix map (tool-specific) ────────────────────────────
// Maps output IDs to their proper customer-facing unit suffix in FREE result cards.
// This is needed because server output units may be raw/empty for FREE tools.
const FREE_OUTPUT_UNIT_SUFFIX: Record<string, string> = {
  "contribution_margin_per_unit": "Currency/unit",
  "break_even_units": "Units",
  "break_even_revenue": "Currency",
  "margin_of_safety_units": "Units",
  "margin_of_safety_percent": "%",
};

/** Outputs in this set have their "Currency" placeholder replaced with selected ISO code. */
const FREE_CURRENCY_OUTPUTS = new Set([
  "contribution_margin_per_unit",
  "break_even_revenue",
]);

/**
 * Get the display-ready unit suffix for a FREE tool output.
 * Uses a safe map for known outputs, falls back to server unit formatting.
 */
function getFreeOutputUnitSuffix(
  out: { id?: string | null; name?: string; unit?: string | null },
  currencyCode: CurrencyCode = "USD",
): string {
  const outputKey = (out.id ?? out.name ?? "").toLowerCase().replace(/[\s-]+/g, "_");
  const mapped = FREE_OUTPUT_UNIT_SUFFIX[outputKey];
  if (mapped) {
    // Replace "Currency" placeholder with selected ISO code
    if (FREE_CURRENCY_OUTPUTS.has(outputKey)) {
      return replaceCurrencyLabel(mapped, currencyCode);
    }
    return mapped;
  }
  // Fallback: use server unit if available
  if (out.unit) {
    if (out.unit === "display_currency") return currencyCode;
    const label = formatCleanUnitLabel(out.unit);
    if (label) return label;
  }
  return "";
}

// ── Reference source helper ────────────────────────────────────────────────────

function getReferenceSourceLabel(
  category: string | null | undefined,
  referenceStatus: string | null | undefined,
): string {
  const cat = (category ?? "").toLowerCase();

  if (cat.includes("manufactur") || cat.includes("production") || cat.includes("shop")) {
    return "Datasheet, routing, standard, or measured baseline";
  }
  if (cat.includes("finance") || cat.includes("sales") || cat.includes("working") || cat.includes("business") || cat.includes("commercial")) {
    return "Quote, invoice, ERP, or user benchmark";
  }
  if (cat.includes("construction") || cat.includes("structural") || cat.includes("measurement")) {
    return "Project specification, standard, or measured baseline";
  }
  if (cat.includes("energy") || cat.includes("electrical") || cat.includes("power")) {
    return "Nameplate, datasheet, standard, or measured baseline";
  }
  if (cat.includes("logistics") || cat.includes("supply") || cat.includes("transport")) {
    return "ERP/WMS/TMS record or measured baseline";
  }
  if (cat.includes("automotive") || cat.includes("engine") || cat.includes("vehicle")) {
    return "Engine spec sheet, data plate, service manual, or dyno report";
  }
  if (cat.includes("hvac") || cat.includes("mechanical") || cat.includes("thermal")) {
    return "Nameplate, datasheet, standard, or measured baseline";
  }
  if (cat.includes("agriculture") || cat.includes("food")) {
    return "Equipment spec, standard, or measured baseline";
  }
  if (cat.includes("quality") || cat.includes("six") || cat.includes("sigma")) {
    return "Process record, standard, or measured baseline";
  }
  if (cat.includes("textile") || cat.includes("printing") || cat.includes("lab")) {
    return "Specification sheet, standard, or measured baseline";
  }
  if (cat.includes("hse") || cat.includes("ergonomics") || cat.includes("safety")) {
    return "Standard, assessment record, or measured baseline";
  }

  return "User benchmark / datasheet reference";
}

function computeInputReferenceSource(
  input: SuperV4Input,
  fallbackSource: string,
): string {
  const ref = input.reference_values;
  if (ref) {
    if (typeof ref === "object" && "source" in ref && typeof (ref as { source?: string }).source === "string") {
      const s = (ref as { source: string }).source.trim();
      if (s && s.length > 0) return s;
    }
  }
  return fallbackSource;
}

function computeTolerancePct(input: SuperV4Input): string | null {
  // If input has a tolerance defined via physical bounds or precision policy
  // This is a display helper; actual tolerance is server-side
  const bounds = input.physical_hard_bounds;
  if (bounds && bounds.min !== null && bounds.max !== null && bounds.min !== bounds.max) {
    return `±${((bounds.max - bounds.min) / (bounds.max + bounds.min) * 100).toFixed(1)}%`;
  }
  return null;
}

/** Detect if a field is monetary by base_unit or semantic tag. */
function isMonetaryField(input: SuperV4Input): boolean {
  const bu = (input.base_unit ?? "").toLowerCase();
  if (bu === "display_currency" || bu === "currency") return true;
  if (["usd", "eur", "gbp", "try", "inr", "cny", "jpy", "aud", "cad", "brl"].some((c) => bu.startsWith(c))) return true;
  const tag = (input.ui_binding as Record<string, unknown> | undefined)?.semantic_tag;
  if (typeof tag === "string" && String(tag).toLowerCase().includes("monet")) return true;
  // /unit and /year patterns
  if (bu.includes("/unit") || bu.includes("/year") || bu.includes("/kwh") || bu.includes("/mwh")) return true;
  return false;
}

/** Detect if a monetary field is per-unit (price/cost per unit). */
function isMonetaryPerUnitField(input: SuperV4Input): boolean {
  const name = (input.name ?? "").toLowerCase();
  const id = (input.id ?? "").toLowerCase();
  if (name.includes("per unit") || name.includes("price") || name.includes("cost per")) return true;
  if (id.endsWith("per_unit") || id.includes("price")) return true;
  return false;
}

/** Detect if a field is a count/quantity field. */
function isCountField(input: SuperV4Input): boolean {
  const bu = (input.base_unit ?? "").toLowerCase();
  if (bu === "count" || bu === "units") return true;
  const tag = (input.ui_binding as Record<string, unknown> | undefined)?.semantic_tag;
  if (typeof tag === "string" && String(tag).toLowerCase() === "count") return true;
  return false;
}

const PROFILE_MODE_COPY: Record<ProfileMode, string> = {
  quick: "Fast decision view — essential inputs and the primary decision only.",
  engineering: "Engineering view — normalized units, references, evidence, and technical controls.",
  cost: "Cost view — monetary drivers, exposure, and commercial decision outputs.",
  audit: "Audit view — source verification, traceability, and report controls.",
  diagnostic: "Diagnostic view — blockers, normalization, and execution-state diagnostics.",
};

const PROFILE_MODE_LABELS: Record<ProfileMode, string> = {
  quick: "Quick",
  engineering: "Engineering",
  cost: "Cost",
  audit: "Audit",
  diagnostic: "Diagnostic",
};

// ── Component ──────────────────────────────────────────────────────────────────

export function UniversalIndustrialDecisionForm(props: UniversalIndustrialDecisionFormProps) {
  // ── V5.3.1: Defensive contract invariants ──
  const contractErrors: string[] = [];
  if (!props.schema || typeof props.schema !== "object") {
    contractErrors.push("FORM_CONTRACT_SCHEMA_NULL");
  } else {
    if (!props.schema.tool_key || typeof props.schema.tool_key !== "string") {
      contractErrors.push("FORM_CONTRACT_TOOL_KEY_MISSING");
    }
    if (!props.schema.tool_name || typeof props.schema.tool_name !== "string") {
      contractErrors.push("FORM_CONTRACT_TOOL_NAME_MISSING");
    }
    if (!Array.isArray(props.schema.inputs)) {
      contractErrors.push("FORM_CONTRACT_INPUTS_INVALID");
    }
    if (!Array.isArray(props.schema.outputs)) {
      contractErrors.push("FORM_CONTRACT_OUTPUTS_INVALID");
    }
    if (!Array.isArray(props.schema.normalized_inputs)) {
      contractErrors.push("FORM_CONTRACT_NORMALIZED_INPUTS_INVALID");
    }
    if (!props.schema.metadata?.schema_version) {
      contractErrors.push("FORM_CONTRACT_SCHEMA_VERSION_MISSING");
    }
  }

  // V5.3.1: Schema identity check
  const identityCheck = !contractErrors.length && props.toolKey && props.schema
    ? assertToolSchemaIdentity({
        routeToolKey: props.toolKey,
        schemaToolKey: props.schema.tool_key,
        schemaToolId: props.schema.tool_id,
      })
    : null;

  // Minimal fallback schema for machine
  const machineSchema: SuperV4Schema = contractErrors.length
    ? ({
        tool_id: props.toolKey || "",
        tool_key: props.toolKey || "",
        tool_name: props.toolKey || "Tool",
        category: "General",
        scope: "",
        primary_operation: "calculate",
        inputs: [],
        normalized_inputs: [],
        outputs: [],
        formulas: [],
        metadata: { schema_version: "1.0.0", formula_version: "1.0.0" },
        ui_contract: {
          target_renderer: "UniversalIndustrialDecisionForm",
          profile_modes: [],
          input_groups: [],
          sticky_decision_cockpit: false,
          mobile_bottom_action_bar: false,
          normalized_preview_required: false,
          reference_values_visible: false,
          evidence_controls_required: false,
          semantic_error_summary_required: false,
          safety_factor_gauges_required: false,
          hidden_risk_panel_required: false,
          business_impact_panel_required: false,
          standards_clause_panel_required: false,
          protected_methodology_panel_required: false,
          audit_seal_panel_required: false,
          accessibility: {},
        },
        form_runtime_binding: {
          renderer: "UniversalIndustrialDecisionForm",
          schema_generation_runtime: "offline",
          llm_runtime_usage: "FORBIDDEN",
          client_formula_execution: "FORBIDDEN",
          server_execution_required: true,
          state_management_required: true,
          dynamic_ui_contract_required: true,
          json_schema_form_substrate_allowed: false,
          generic_json_schema_form_alone_sufficient: false,
          state_domains: [],
          state_transitions: [],
          execute_request_contract: {},
          execute_response_contract: {
            redaction_status: "REDACTION_NOT_REQUIRED",
            status: "OK",
            pipeline_state: "blocked",
          },
        },
        unit_conversion_contract: { conversion_registry: {} },
        reference_value_policy: {},
        physical_bounds_policy: {},
        validation_contract: {},
        derating_contract: {},
        precision_policy: {},
        output_formatting: {},
        decision_interpretation_contract: {},
        business_impact_contract: {},
        engine_rules: { client_formula_execution: false, llm_enabled: false, server_execution_required: true, fmea: null },
        uncertainty_model: { method: "NONE", confidence_level: null },
        safety_factor_gauges: [],
        proof_pack: { enabled: false, redaction_status: "PUBLIC_SAFE_REDACTED" as const, sections: [] },
        audit_trail_contract: {
          hash_algorithm: "SHA-256",
          seal_config: { enabled: false, include_input_hash: true, include_output_hash: true, include_schema_hash: true, include_formula_version: true },
          redaction_status: "PUBLIC_SAFE_REDACTED",
          seal_fields: [],
        },
        export_contract: { enabled: false, formats: [], redaction_required: true },
        reference_code: { code_language: null, code_block: null },
        test_plan: { test_cases: [], coverage_requirement: "NONE" },
        red_team_review: { review_status: "NOT_REVIEWED", issues: [] },
        risk_level: "MEDIUM",
        brand_safety_policy: { third_party_brand_references: [], legal_proof_claims: [], paid_standard_table_reproductions: [], policy_enforced: true, policy_version: "5.3.1" },
        calculation_basis: { method: "Fallback", assumptions: [], limitations: [] },
        unit_system: { preferred: "GLOBAL", strict: false },
        standards: [], standards_clause_map: [], reference_status: "UNVERIFIED",
        irreversible_commitment_metric: "result", decision_context: {},
      } as SuperV4Schema)
    : props.schema;

  // ── FREE-route detection ──
  // Synchronous check — no state needed. Safe because this is a client component.
  const isFreeRoute: boolean =
    typeof window !== "undefined" &&
    (window.location.pathname.includes("/tools/free/") ||
      window.location.pathname.startsWith("/free-tools/"));

  const effectiveAccessTier: "FREE" | "PRO" =
    isFreeRoute ? "FREE" : (props.accessTier ?? "FREE");
  const effectiveInitialMode: ProfileMode =
    isFreeRoute ? "quick" : (props.initialProfileMode ?? "engineering");

  // ── Currency display selector ──
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyCode>("USD");

  // ── Hooks (unconditional) ──
  const machine = useUniversalIndustrialDecisionFormMachine({
    schema: machineSchema,
    schemaHash: props.schemaHash,
    executeEndpoint: props.executeEndpoint,
    initialProfileMode: effectiveInitialMode,
    usageSessionId: props.usageSessionId,
    authToken: props.executeAuthToken ?? undefined,
    displayCurrency: selectedCurrency,
  });

  const { state } = machine;
  const response = state.serverResponseState.response;
  const premiumHook = state.premiumHookState.hook;

  // Access tier (effective — FREE route overrides wrapper PRO)
  const accessTier = effectiveAccessTier;
  const isPro = accessTier === "PRO";
  // Hydration-safe tier check — use accessTier (from props) not isFreeRoute (uses window)
  const isFreeTier = accessTier === "FREE";
  const hasSession = isPro && !!props.usageSessionId;

  // Presentation mode: prefer explicit prop, fall back to accessTier-based default
  const presentationMode = props.presentationMode ?? (isFreeTier ? "FREE_COMPACT" : "PRO_AUDIT");

  // ── Submission tracking: prevent early red validation state ──
  // Only show field-level validation errors after user attempts Calculate.
  const [submissionAttempted, setSubmissionAttempted] = useState(false);

  // ── Desktop detection for PRO cockpit layout (>= 1100px) ──
  // useLayoutEffect ensures correct layout before first paint.
  // Initial client render matches the real viewport synchronously.
  const [isDesktop, setIsDesktop] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(min-width: 1100px)").matches;
  });
  useLayoutEffect(() => {
    const mq = window.matchMedia("(min-width: 1100px)");
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const runsRemaining = props.remainingRuns ?? 0;
  const sessionExhausted = isPro && hasSession && runsRemaining <= 0;
  const creditSessionLoading = props.creditSessionLoading ?? false;
  const isExecuting = state.executionState === "executing";
  const isServerBlocked = state.executionState === "server_blocked";
  const hasResult = hasServerResponse(response);

  // ── Cross-tool contract assertion ──
  // Verify that the requested slug, tool key, and schema all match
  const crossToolAssertion = useMemo(() => {
    return assertCrossToolIdentity({
      requestedSlug: props.toolKey ?? "",
      definitionSlug: props.schema?.tool_key ?? "",
      executeResponseToolKey: null,
      reportToolSlug: null,
    });
  }, [props.toolKey, props.schema?.tool_key]);

  // ── Pro Report Panel (tool-specific, replaces generic universal_result for PRO) ──
  const proReportResult = useMemo(() => {
    if (!isPro || !hasResult || !response?.outputs) return null;
    const toolSlug = props.toolKey ?? props.schema?.tool_key ?? "";
    return buildProReport({
      toolSlug,
      outputs: response.outputs.map((o) => ({
        id: o.id,
        name: o.name ?? o.id,
        value: o.value,
        unit: o.unit ?? undefined,
      })),
      rawInputs: state.rawInputState,
      selectedUnits: state.selectedUnitState,
      displayCurrency: selectedCurrency,
    });
  }, [isPro, hasResult, response?.outputs, props.toolKey, props.schema?.tool_key, state.rawInputState, state.selectedUnitState, selectedCurrency]);

  // ── Sensitivity chart (opt-in per tool via ProReportContract.sensitivityDrivers) ──
  // Isolated fetch to a dedicated read-only endpoint, independent of the execute hook above --
  // a failure or slow response here can never block or corrupt the main report.
  type SensitivityDriverResult = { inputId: string; label: string; up: number | null; down: number | null; span: number | null };
  const [sensitivityData, setSensitivityData] = useState<{ targetOutput: string; drivers: SensitivityDriverResult[] } | null>(null);
  const toolSlugForSensitivity = props.toolKey ?? props.schema?.tool_key ?? "";

  useEffect(() => {
    if (!isPro || !hasResult || !proReportResult?.contract?.sensitivityDrivers?.length) {
      setSensitivityData(null);
      return;
    }
    let cancelled = false;
    fetch("/api/pro-calculator/sensitivity", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tool_key: toolSlugForSensitivity,
        raw_inputs: state.rawInputState,
        selected_units: state.selectedUnitState,
      }),
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (cancelled || !data?.ok || !data.supported) return;
        setSensitivityData({ targetOutput: data.targetOutput, drivers: data.drivers ?? [] });
      })
      .catch(() => {
        // Sensitivity chart is a bonus, not a required part of the report -- swallow errors.
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPro, hasResult, toolSlugForSensitivity, proReportResult?.contract?.sensitivityDrivers]);

  // Determine decision state from the response for ProReportPanelV2
  const reportDecisionState = useMemo<{ label: string; severity: "pass" | "warning" | "danger" | "info" } | null>(() => {
    if (!response?.decision_interpretation) return null;
    const ds = response.decision_interpretation;
    const label = ds.primary_reason || "Calculation completed.";
    let severity: "pass" | "warning" | "danger" | "info" = "info";
    const pd = ds.primary_decision;
    if (pd === "OK") severity = "pass";
    else if (pd === "REVIEW") severity = "warning";
    else if (pd === "BLOCKED") severity = "danger";
    return { label, severity };
  }, [response?.decision_interpretation]);

  const clientBlockerCount = state.blockerState.blockers.filter(
    (b) => b.severity === "BLOCKER" || b.severity === "CRITICAL",
  ).length;

  // Admin bypass: owner email (barisbagirlar@gmail.com) has unlimited Pro access
  // with no credit session required. The server-side API handles bypass.
  // Detected by the "bypass-unlimited" usageSessionId set in ProToolSessionWrapper.
  const isBypassUser = isPro && props.usageSessionId === "bypass-unlimited";
  const isSignedIn = props.isSignedIn ?? false;

  // Form runtime readiness: do not enable Calculate until auth, definition,
  // form state, and units are all initialized.
  const formRuntimeReady =
    state.schemaState.schema !== null &&
    state.executionState !== "idle" &&
    state.executionState !== "schema_loading" &&
    state.executionState !== "schema_rejected";

  const primaryButtonDisabled =
    !formRuntimeReady ||
    isExecuting ||
    creditSessionLoading ||
    (isPro && !isSignedIn) ||
    (isPro && sessionExhausted && !isSignedIn);

  // ── Button label state machine (V5.3.1) ──
  const primaryButtonLabel = (() => {
    if (isFreeTier) {
      if (isExecuting) return "Calculating...";
      if (isServerBlocked) return "Calculate";
      if (hasResult) return "Recalculate";
      return "Calculate";
    }
    // PRO
    if (creditSessionLoading) return "Processing credit...";
    if (isPro && !isSignedIn) return "Sign in to calculate";
    if (isPro && !hasSession && !isBypassUser) return "Calculate (1 credit)";
    if (isPro && sessionExhausted) return "Unlock Pro access";
    if (isExecuting) return "Calculating...";
    if (hasResult) return "Recalculate";
    return "Calculate";
  })();

  // Auto-execute after session creation completes
  const sessionRequestedRef = useRef(false);
  useEffect(() => {
    if (sessionRequestedRef.current && hasSession && !sessionExhausted && !creditSessionLoading) {
      sessionRequestedRef.current = false;
      machine.submitServerExecution();
    }
  }, [hasSession, sessionExhausted, creditSessionLoading, machine.submitServerExecution]);

  const primaryButtonAction = useCallback(() => {
    setSubmissionAttempted(true);
    if (isPro && (!hasSession || sessionExhausted)) {
      if (props.onRequestCreditSession && props.toolKey) {
        sessionRequestedRef.current = true;
        props.onRequestCreditSession(props.toolKey);
        return;
      }
      // No session handler provided (bypass path) → execute directly;
      // the server-side API handles admin/owner bypass internally.
      void machine.submitServerExecution();
      return;
    }
    void machine.submitServerExecution();
  }, [isPro, hasSession, sessionExhausted, props.onRequestCreditSession, props.toolKey, machine.submitServerExecution]);

  // Reset handler: clears submission state + form inputs
  const handleReset = useCallback(() => {
    setSubmissionAttempted(false);
    machine.resetInputs();
  }, [machine.resetInputs]);

  // Display-safe labels
  const schemaRecord = props.schema as unknown as Record<string, unknown>;
  const toolName =
    props.renderContract?.toolName ??
    String(schemaRecord.tool_name ?? schemaRecord.toolName ?? "");
  const rawCategoryLabel =
    props.renderContract?.categoryLabel ??
    String(schemaRecord.category_label ?? schemaRecord.categoryLabel ?? schemaRecord.category ?? "");

  const displayToolName = getDisplayToolName(
    props.schema?.tool_name as string | null | undefined,
    props.schema?.tool_key as string || props.toolKey || "",
  );
  const rawCategory = getDisplayCategoryLabel(props.schema?.category as string | null | undefined);
  const displayCategory = safeDisplayCategory(rawCategoryLabel || rawCategory);
  const rawOperation = props.schema?.primary_operation as string | null | undefined;
  const displayOperation = getDisplayOperationLabel(rawOperation);
  const rawScope = String(props.schema?.scope ?? "");
  const cleanedScope = rawOperation && rawScope.includes(rawOperation)
    ? rawScope.replaceAll(rawOperation, displayOperation)
    : rawScope;
  const displayScope = safeDisplayScope(
    cleanedScope || rawScope,
    displayToolName || toolName,
    displayCategory,
  );

  // FREE-mode: use practical descriptions, not SuperV4 jargon
  const freeToolDescription = isFreeTier
    ? getFreeToolDescription(
        props.toolKey ?? props.schema?.tool_key ?? "",
        displayToolName || toolName,
        displayCategory,
      )
    : "";

  const freeHeroSubtitle =
    isFreeTier
      ? freeToolDescription || displayScope
      : displayScope;

  // ── ViewModel ──
  const vmPurpose = isFreeTier ? freeHeroSubtitle : displayScope;
  const vm = useMemo(
    () => buildCalculatorViewModel(
      props.schema, state, machine, props, state.profileModeState.mode, response,
      accessTier, hasSession, runsRemaining, isExecuting, hasResult,
      primaryButtonDisabled, primaryButtonLabel, primaryButtonAction,
      clientBlockerCount, toolName, vmPurpose,
      displayCategory, displayOperation,
      identityCheck as { ok: boolean; reason?: string } | null,
      selectedCurrency,
    ),
    // machine and props omitted intentionally:
    // - machine callbacks (setInputValue, submitServerExecution, resetInputs, etc.)
    //   are stable references from useUniversalIndustrialDecisionFormMachine.
    // - props object identity changes every parent render and would defeat memoization.
    //   All values needed from props (schema, toolKey, etc.) are already listed individually.
    [
      props.schema, state, state.profileModeState.mode, response,
      accessTier, hasSession, runsRemaining, isExecuting, hasResult,
      primaryButtonDisabled, primaryButtonLabel, primaryButtonAction,
      clientBlockerCount, toolName, vmPurpose,
      displayCategory, displayOperation, identityCheck, selectedCurrency,
    ],
  );

  // ── Guard blocks (after hooks) ──
  if (contractErrors.length > 0) {
    return <ContractBlocker errors={contractErrors} />;
  }

  if (identityCheck && !identityCheck.ok) {
    return <IdentityBlocker reason={identityCheck.reason!} />;
  }

  // ── Shared hero content (title/desc/badges/currency) ──
  const heroContent = (
    <>
      <h1 className="sc-v531-title">{vm.title}</h1>
      <p className="sc-v531-hero__scope">{vm.purpose}</p>
      <div className="sc-v531-meta-row" aria-label="Tool metadata">
        {vm.badges.map((badge, i) => (
          <span key={i} className="sc-v531-chip">{badge.label}</span>
        ))}
      </div>
      {/* Currency display selector — only show when the tool has monetary fields */}
      {(() => {
        const isCurrencyUnit = (u: string) => {
          const bu = (u ?? "").toLowerCase();
          return bu === "display_currency" || bu === "currency" || ["usd","eur","gbp","try","inr","cny","jpy","aud","cad","brl"].some(c => bu.startsWith(c));
        };
        const inputMonetary = props.schema?.inputs?.some((input) => isCurrencyUnit(input.base_unit ?? "")) ?? false;
        const outputMonetary = (props.schema as any)?.outputs?.some((o: any) => isCurrencyUnit(o.unit ?? "")) ?? false;
        const hasMonetaryField = inputMonetary || outputMonetary;
        return hasMonetaryField ? (
        <div className="sc-v531-currency-row" aria-label="Currency selector">
          <label className="sc-v531-currency-label" htmlFor="sc-currency-select">Display currency</label>
          <select
            id="sc-currency-select"
            className="sc-v531-currency-select"
            value={selectedCurrency}
            onChange={(e: ChangeEvent<HTMLSelectElement>) => setSelectedCurrency(e.target.value as CurrencyCode)}
          >
            {SUPPORTED_CURRENCIES.map((code) => (
              <option key={code} value={code}>{code}</option>
            ))}
          </select>
        </div>
        ) : null;
      })()}
      {isPro && (
        <div className="sc-v531-mode-panel">
          <div className="sc-v531-mode-tabs" role="tablist" aria-label="Calculation view">
            {(["quick", "engineering", "cost", "audit", "diagnostic"] as ProfileMode[]).map((mode) => {
              const active = state.profileModeState.mode === mode;
              return (
                <button
                  key={mode}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  className="sc-v531-mode-tab"
                  data-active={active ? "true" : "false"}
                  onClick={() => machine.setProfileMode(mode)}
                >
                  {PROFILE_MODE_LABELS[mode]}
                </button>
              );
            })}
          </div>
          <p className="sc-v531-view-description">
            {PROFILE_MODE_COPY[state.profileModeState.mode]}
          </p>
        </div>
      )}
    </>
  );

  return (
    <section
      className={`sc-v531-shell ${props.className ?? ""}`}
      data-renderer="UniversalIndustrialDecisionForm"
      data-v531="true"
      data-access-tier={accessTier}
      data-presentation-mode={presentationMode}
    >
      {isPro && isDesktop ? (
        /* ── PRO Desktop: hero inside cockpit left panel ── */
        <div className="sc-v531-layout">
          <main className="sc-v531-main-panel">
            <div className="sc-v531-pro-cockpit">
              <div className="sc-v531-pro-cockpit-left">
                <header className="sc-v531-hero sc-v531-hero--cockpit">
                  {heroContent}
                </header>
                {vm.fields.length === 0 && (
                  <p className="sc-v531-empty">No inputs defined for this tool.</p>
                )}
                <div className="sc-v531-field-grid">
                  {vm.fields.map((field) => (
                    <CalculatorInputField
                      key={field.id}
                      field={field}
                      currencyCode={selectedCurrency}
                      onValueChange={(value) => machine.setInputValue(field.id, value)}
                      onUnitChange={(newUnit) => {
                      const oldVal = field.value;
                      const oldUnit = field.selectedUnit;
                      const canonUnit = field.canonicalUnit;
                      if (typeof oldVal === "number" && Number.isFinite(oldVal) && oldUnit && oldUnit !== newUnit) {
                        const canonVal = convertDisplayToCanonical(oldVal, oldUnit, canonUnit);
                        const newVal = convertCanonicalToDisplay(canonVal, newUnit, canonUnit);
                        machine.setInputValue(field.id, newVal);
                      }
                      machine.setSelectedUnit(field.id, newUnit);
                    }}
                      onEvidenceChange={(valueVerified, sourceVerified) => {
                        machine.updateEvidence(field.id, {
                          enabled: valueVerified || sourceVerified,
                          user_verified: valueVerified,
                          source_verified: sourceVerified,
                        });
                      }}
                      showErrors={submissionAttempted}
                      isFreeTier={isFreeTier}
                    />
                  ))}
                </div>
                {/* PRO Desktop CTA is in right Decision Panel only — no duplicate here */}
              </div>
              <aside className="sc-v531-pro-cockpit-right">
                <div className="sc-v531-cockpit-panel">
                  <h4 className="sc-v531-cockpit-panel-title">Decision Panel</h4>
                  {hasResult && response?.outputs ? (
                    <div className="sc-v531-cockpit-panel-content">
                      {(() => {
                        const dsOutput = response.outputs.find((o) =>
                          (o.name ?? "").toLowerCase().replace(/[\s-]+/g, "_").includes("decision_status")
                        );
                        const gdOutput = response.outputs.find((o) =>
                          (o.name ?? "").toLowerCase().replace(/[\s-]+/g, "_").includes("governing_driver")
                        );
                        const costOutput = response.outputs.find((o) =>
                          (o.id ?? "").includes("annual_leak_cost")
                        );
                        const paybackOutput = response.outputs.find((o) =>
                          (o.id ?? "").includes("repair_payback_days")
                        );
                        const dsValue = typeof dsOutput?.value === "string" ? dsOutput.value.replace(/_/g, " ") : "";
                        const gdValue = typeof gdOutput?.value === "string" ? gdOutput.value : "";
                        const costValue = typeof costOutput?.value === "number" ? costOutput.value : null;
                        const paybackValue = typeof paybackOutput?.value === "number" ? paybackOutput.value : null;
                        const costUnit = getProOutputDisplayUnit("annual_leak_cost", costOutput?.unit, selectedCurrency);
                        const dsKey = dsValue.toLowerCase().replace(/\s+/g, "_");
                        return (
                          <>
                            {dsValue && (
                              <div className="sc-v531-cockpit-row">
                                <span className="sc-v531-cockpit-row-label">Decision Status</span>
                                <span className={`sc-v531-cockpit-row-value sc-v531-ds-${dsKey}`}>{dsValue}</span>
                              </div>
                            )}
                            {gdValue && (
                              <div className="sc-v531-cockpit-row">
                                <span className="sc-v531-cockpit-row-label">Governing Driver</span>
                                <span className="sc-v531-cockpit-row-text">{gdValue}</span>
                              </div>
                            )}
                            {costValue !== null && (
                              <div className="sc-v531-cockpit-row">
                                <span className="sc-v531-cockpit-row-label">Annual Leak Cost</span>
                                <span className="sc-v531-cockpit-row-value">{formatDisplayNumber(costValue)} {costUnit}</span>
                              </div>
                            )}
                            {paybackValue !== null && (
                              <div className="sc-v531-cockpit-row">
                                <span className="sc-v531-cockpit-row-label">Repair Payback</span>
                                <span className="sc-v531-cockpit-row-value">{formatDisplayNumber(paybackValue)} days</span>
                              </div>
                            )}
                            {(() => {
                              let actionText = "";
                              if (dsValue === "ACTION REQUIRED") {
                                actionText = "Repair this leak immediately.";
                              } else if (dsValue === "MONITOR") {
                                actionText = "Schedule repair in next maintenance window.";
                              } else if (dsValue === "OK") {
                                actionText = "No urgent action needed. Monitor pressure.";
                              }
                              return actionText ? (
                                <div className="sc-v531-cockpit-block">
                                  <span className="sc-v531-cockpit-row-label">Recommended Action</span>
                                  <p className="sc-v531-cockpit-row-text">{actionText}</p>
                                </div>
                              ) : null;
                            })()}
                          </>
                        );
                      })()}
                      <div className="sc-v531-cockpit-actions">
                        <button
                          type="button"
                          className="sc-v531-primary-action"
                          disabled={vm.action.disabled}
                          onClick={vm.action.onAction}
                        >
                          {vm.action.label}
                        </button>
                        <button
                          type="button"
                          className="sc-v531-action-secondary"
                          onClick={machine.runClientPrecheck}
                        >
                          Check inputs
                        </button>
                        <button
                          type="button"
                          className="sc-v531-action-secondary"
                          onClick={handleReset}
                        >
                          Reset inputs
                        </button>
                      </div>
                      {vm.action.disabled && vm.action.disabledReason && (
                        <p className="sc-v531-disabled-reason" role="status">
                          {vm.action.disabledReason}
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="sc-v531-cockpit-panel-placeholder">
                      <button
                        type="button"
                        className="sc-v531-primary-action"
                        disabled={vm.action.disabled}
                        onClick={vm.action.onAction}
                      >
                        {vm.action.label}
                      </button>
                      <button
                        type="button"
                        className="sc-v531-action-secondary"
                        onClick={machine.runClientPrecheck}
                      >
                        Check inputs
                      </button>
                      <button
                        type="button"
                        className="sc-v531-action-secondary"
                        onClick={handleReset}
                      >
                        Reset inputs
                      </button>
                    </div>
                  )}
                </div>
              </aside>
            </div>
          </main>
        </div>
      ) : (
        /* ── FREE / mobile PRO: standalone hero + inputs + action bar ── */
        <>
          <header className="sc-v531-hero">{heroContent}</header>
          <div className="sc-v531-layout">
            <main className="sc-v531-main-panel">
              {vm.fields.length === 0 && (
                <p className="sc-v531-empty">No inputs defined for this tool.</p>
              )}
              <div className="sc-v531-field-grid">
                {vm.fields.map((field) => (
                  <CalculatorInputField
                    key={field.id}
                    field={field}
                    currencyCode={selectedCurrency}
                    onValueChange={(value) => machine.setInputValue(field.id, value)}
                    onUnitChange={(newUnit) => {
                      const oldVal = field.value;
                      const oldUnit = field.selectedUnit;
                      const canonUnit = field.canonicalUnit;
                      if (typeof oldVal === "number" && Number.isFinite(oldVal) && oldUnit && oldUnit !== newUnit) {
                        const canonVal = convertDisplayToCanonical(oldVal, oldUnit, canonUnit);
                        const newVal = convertCanonicalToDisplay(canonVal, newUnit, canonUnit);
                        machine.setInputValue(field.id, newVal);
                      }
                      machine.setSelectedUnit(field.id, newUnit);
                    }}
                    onEvidenceChange={(valueVerified, sourceVerified) => {
                      machine.updateEvidence(field.id, {
                        enabled: valueVerified || sourceVerified,
                        user_verified: valueVerified,
                        source_verified: sourceVerified,
                      });
                    }}
                    showErrors={submissionAttempted}
                    isFreeTier={isFreeTier}
                  />
                ))}
              </div>

              {/* Full-width action bar (desktop only — mobile uses sticky bar below) */}
              {isDesktop && (
              <div className="sc-v531-action-bar">
                  <div className="sc-v531-action-bar-buttons">
                    <button
                      type="button"
                      className="sc-v531-primary-action"
                      disabled={vm.action.disabled}
                      aria-disabled={vm.action.disabled}
                      onClick={vm.action.onAction}
                    >
                      {vm.action.label}
                    </button>
                    {isPro && (
                      <button
                        type="button"
                        className="sc-v531-action-secondary"
                        onClick={machine.runClientPrecheck}
                      >
                        Check inputs
                      </button>
                    )}
                    <button
                      type="button"
                      className="sc-v531-action-secondary"
                      onClick={handleReset}
                    >
                      Reset inputs
                    </button>
                  </div>
                  {vm.action.disabled && vm.action.disabledReason && (
                    <p className="sc-v531-disabled-reason" role="status">
                      {vm.action.disabledReason}
                    </p>
                  )}
              </div>
              )}
            </main>
          </div>
        </>
      )}

        {/* Results */}
        <section className="sc-v531-section sc-v531-results" aria-label="Results">
          {vm.resultState.hasResult ? (
            (isFreeTier && isServerBlocked) ? (
              <div className="sc-v531-free-validation-error">
                <p>Calculation not run</p>
                <ul>
                  {(response?.warnings ?? []).length > 0
                    ? response!.warnings.map((w, i) => (
                        <li key={i}>{w.message}</li>
                      ))
                    : [<li key="0">Required fields are missing or invalid.</li>]
                  }
                </ul>
              </div>
            ) : (
            <div className="sc-v531-result-content">
              {/* PRO V2 — Tool-Specific Report Panel (replaces generic universal_result) */}
              {isPro && hasResult && response?.outputs && response.outputs.length > 0 && (() => {
                if (!proReportResult || !proReportResult.resolvedSections) {
                  return (
                    <div className="sc-v531-report-contract-missing">
                      <p className="sc-v531-report-error-title">Calculation completed.</p>
                      <p className="sc-v531-report-error-desc">The tool-specific report could not be generated. No additional credit was used.</p>
                    </div>
                  );
                }
                const reportWarnings = response?.warnings
                  ? response.warnings.map((w) => w.message).filter(Boolean)
                  : [];
                return (
                  <ProReportPanelV2
                    toolTitle={vm.title}
                    sections={proReportResult.resolvedSections}
                    warnings={reportWarnings}
                    decisionStateLabel={reportDecisionState?.label}
                    decisionSeverity={reportDecisionState?.severity}
                    firedInsights={proReportResult.firedInsights}
                    sensitivity={sensitivityData}
                    paretoBreakdown={proReportResult.paretoBreakdown}
                  />
                );
              })()}

              {/* FREE tier: multi-perspective result cards (V5.4 Universal Result Perspectives Layer) */}
              {!isPro && response?.universal_result && response.universal_result.cards.length > 0 && (() => {
                const ur = response!.universal_result!;
                const primaryCard = ur.primary;
                const commercialCards = ur.cards.filter((c) => c.perspective === "commercial_price");
                const costCards = ur.cards.filter((c) => c.perspective === "cost_basis" && c.id !== primaryCard.id);
                const riskCards = ur.cards.filter((c) => c.perspective === "risk_sensitivity");
                const technicalCards = ur.cards.filter((c) => c.perspective === "technical_limit");
                const auditCards = ur.cards.filter((c) => c.perspective === "audit_note");

                const severityClass = (s?: string) => {
                  if (s === "danger") return "sc-v531-card-danger";
                  if (s === "warning") return "sc-v531-card-warning";
                  return "sc-v531-card-info";
                };

                const renderCardValue = (card: typeof primaryCard) => {
                  const val = typeof card.value === "number" ? formatBusinessResult("", card.value) : String(card.value);
                  const unitLabel = formatCleanUnitLabel(card.unit ?? "");
                  return unitLabel ? `${val} ${unitLabel}` : val;
                };

                return (
                  <div className="sc-v531-free-results sc-v531-universal-results">
                    {/* Universal Result Panel (primary KPI + decision state) */}
                    <FreeToolResultPanel
                      toolTitle={vm.title}
                      category={vm.purpose}
                      primaryLabel={primaryCard.label}
                      primaryValue={primaryCard.value}
                      primaryUnit={formatCleanUnitLabel(primaryCard.unit ?? "") || undefined}
                      decisionState={
                        ur.decisionState &&
                        ur.decisionState.label &&
                        ur.decisionState.label !== "—"
                          ? ur.decisionState.label
                          : ""
                      }
                      decisionSeverity={(() => { const s = ur.decisionState.severity; if (s === "danger") return "danger"; if (s === "warning") return "warning"; if (s === "pass") return "success"; return "info"; })()}
                      summary={primaryCard.explanation || ""}
                      isValid={response?.status !== "BLOCKED"}
                      warnings={
                        response?.warnings
                          ? response.warnings.map((w) => w.message).filter(Boolean)
                          : []
                      }
                    />

                    {/* Commercial View */}
                    {commercialCards.length > 0 && (
                      <div className="sc-v531-free-results-section">
                        <h4 className="sc-v531-free-results-subtitle">Commercial View</h4>
                        <div className="sc-v531-free-results-grid">
                          {commercialCards.map((card, ci) => (
                            <div key={ci} className={`sc-v531-free-result-item ${severityClass(card.severity)}`}>
                              <span className="sc-v531-free-result-name">{card.label}</span>
                              <span className="sc-v531-free-result-value">{renderCardValue(card)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Cost Breakdown */}
                    {costCards.length > 0 && (
                      <div className="sc-v531-free-results-section">
                        <h4 className="sc-v531-free-results-subtitle">Cost Breakdown</h4>
                        <div className="sc-v531-free-results-grid">
                          {costCards.map((card, ci) => (
                            <div key={ci} className="sc-v531-free-result-item">
                              <span className="sc-v531-free-result-name">{card.label}</span>
                              <span className="sc-v531-free-result-value">{renderCardValue(card)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Risk Sensitivity */}
                    {riskCards.length > 0 && (
                      <div className="sc-v531-free-results-section">
                        <h4 className="sc-v531-free-results-subtitle">Risk & Sensitivity</h4>
                        <div className="sc-v531-free-results-grid">
                          {riskCards.map((card, ci) => (
                            <div key={ci} className={`sc-v531-free-result-item ${severityClass(card.severity)}`}>
                              <span className="sc-v531-free-result-name">{card.label}</span>
                              <span className="sc-v531-free-result-value">{renderCardValue(card)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Technical Limit */}
                    {technicalCards.length > 0 && (
                      <div className="sc-v531-free-results-section">
                        <h4 className="sc-v531-free-results-subtitle">Technical Assessment</h4>
                        <div className="sc-v531-free-results-grid">
                          {technicalCards.map((card, ci) => (
                            <div key={ci} className={`sc-v531-free-result-item ${severityClass(card.severity)}`}>
                              <span className="sc-v531-free-result-name">{card.label}</span>
                              <span className="sc-v531-free-result-value">{renderCardValue(card)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Audit Notes */}
                    {auditCards.length > 0 && (
                      <div className="sc-v531-free-results-section">
                        <h4 className="sc-v531-free-results-subtitle">Audit Notes</h4>
                        <div className="sc-v531-free-results-grid">
                          {auditCards.map((card, ci) => (
                            <div key={ci} className="sc-v531-free-result-item">
                              <span className="sc-v531-free-result-name">{card.label}</span>
                              <span className="sc-v531-free-result-value">{renderCardValue(card)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Additional output cards not yet grouped */}
                    {(() => {
                      const groupedIds = new Set([
                        primaryCard.id,
                        ...commercialCards.map((c) => c.id),
                        ...costCards.map((c) => c.id),
                        ...riskCards.map((c) => c.id),
                        ...technicalCards.map((c) => c.id),
                        ...auditCards.map((c) => c.id),
                      ]);
                      const remaining = ur.cards.filter((c) => !groupedIds.has(c.id));
                      if (remaining.length === 0) return null;
                      return (
                        <div className="sc-v531-free-results-section">
                          <h4 className="sc-v531-free-results-subtitle">Additional Results</h4>
                          <div className="sc-v531-free-results-grid">
                            {remaining.map((card, ci) => (
                              <div key={ci} className="sc-v531-free-result-item">
                                <span className="sc-v531-free-result-name">{card.label}</span>
                                <span className="sc-v531-free-result-value">{renderCardValue(card)}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })()}

                    {/* Computed Values (outputs not covered by cards) */}
                    {response?.outputs && response.outputs.filter((o) => {
                      const inCard = ur.cards.some((c) => c.id === o.id);
                      return !isStatusOutput(o) && !inCard;
                    }).length > 0 && (
                      <div className="sc-v531-free-results-section">
                        <h4 className="sc-v531-free-results-subtitle">Computed Values</h4>
                        <div className="sc-v531-free-results-grid">
                          {response.outputs.filter((o) => {
                            const inCard = ur.cards.some((c) => c.id === o.id);
                            return !isStatusOutput(o) && !inCard;
                          }).map((out, idx) => {
                            const formattedValue = typeof out.value === "number"
                              ? formatBusinessResult(out.name, out.value)
                              : formatSafeValue(out.value);
                            const freeUnitSuffix = getFreeOutputUnitSuffix(out, selectedCurrency);
                            const displayStr = freeUnitSuffix
                              ? (formattedValue.endsWith(freeUnitSuffix) ? formattedValue : `${formattedValue} ${freeUnitSuffix}`)
                              : formattedValue;
                            const isLarge = displayStr.length > 20;
                            return (
                              <div key={idx} className="sc-v531-free-result-item">
                                <span className="sc-v531-free-result-name">{out.name}</span>
                                <span className={`sc-v531-free-result-value${isLarge ? " sc-v531-free-result-value--large" : ""}`}>
                                  {displayStr}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Assumptions */}
                    {ur.assumptions.length > 0 && (
                      <div className="sc-v531-free-results-section">
                        <h4 className="sc-v531-free-results-subtitle">Assumptions & Notes</h4>
                        <ul className="sc-v531-free-assumptions">
                          {ur.assumptions.map((a, ai) => (
                            <li key={ai}>{a}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Warnings */}
                    {ur.warnings.length > 0 && (
                      <div className="sc-v531-free-results-section">
                        <h4 className="sc-v531-free-results-subtitle">Warnings</h4>
                        <ul className="sc-v531-free-warnings">
                          {ur.warnings.map((w, wi) => (
                            <li key={wi}>{w}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                );
              })()}
              {/* FREE fallback — universal result panel (replaces legacy Business Summary / Decision / Interpretation) */}
              {isFreeTier && (!response?.universal_result || response.universal_result.cards.length === 0) && response?.outputs && response.outputs.length > 0 && (() => {
                const primaryOutput = response.outputs.find(o => 
                  !isStatusOutput(o) && typeof o.value === "number" && Number.isFinite(o.value)
                );
                if (!primaryOutput) return null;
                const unit = getFreeOutputUnitSuffix(primaryOutput, selectedCurrency) || undefined;
                const numericValue = primaryOutput.value as number;
                const comparatorInputIds = ["current_shop_rate", "current_price", "target_price", "current_rate", "existing_rate", "current_shop_rate_usd"];
                let currentValue: number | undefined;
                for (const inputId of comparatorInputIds) {
                  const rawVal = state.rawInputState[inputId];
                  if (typeof rawVal === "number" && Number.isFinite(rawVal)) { currentValue = rawVal; break; }
                  if (typeof rawVal === "string") { const n = Number(rawVal); if (Number.isFinite(n)) { currentValue = n; break; } }
                }
                const warnings = (response?.warnings ?? []).map(w => w.message).filter(Boolean);
                return (
                  <FreeToolResultPanel
                    toolTitle={vm.title}
                    category={vm.purpose}
                    primaryLabel={primaryOutput.name || "Result"}
                    primaryValue={numericValue}
                    primaryUnit={unit}
                    isValid={response?.status !== "BLOCKED"}
                    currentValue={currentValue}
                    currentLabel="Current shop rate"
                    warnings={warnings}
                    positiveExpected={true}
                  />
                );
              })()}

              {/* PRO mode: Decision Summary + Primary Results + Professional Interpretation (fallback when no universal_result and no tool-specific report) */}
              {!isFreeTier && !proReportResult?.resolvedSections && (!response?.universal_result || response.universal_result.cards.length === 0) && response?.outputs && (
                <div className="sc-v531-pro-results-container">
                  {/* Decision Summary — skipped when desktop cockpit already shows it */}
                  {!(isPro && isDesktop) && (() => {
                    const dsOutput = response.outputs.find((o) =>
                      (o.name ?? "").toLowerCase().replace(/[\s-]+/g, "_").includes("decision_status")
                    );
                    const gdOutput = response.outputs.find((o) =>
                      (o.name ?? "").toLowerCase().replace(/[\s-]+/g, "_").includes("governing_driver")
                    );
                    const dsValue = typeof dsOutput?.value === "string" ? dsOutput.value : "";
                    const gdValue = typeof gdOutput?.value === "string" ? gdOutput.value : "";

                    const isCompressedAir = props.toolKey === "compressed-air-leak-cost-calculator" ||
                      props.schema?.tool_key === "compressed-air-leak-cost-calculator";

                    let displayStatus = dsValue.replace(/_/g, " ");
                    let displayDriver = gdValue;
                    let nextAction = "";
                    let whyItMatters = "";
                    let keyAssumptionCheck = "";

                    if (isCompressedAir) {
                      if (dsValue === "ACTION_REQUIRED") {
                        displayStatus = "ACTION REQUIRED";
                        displayDriver = "Fast repair payback";
                        nextAction = "Repair this leak immediately and verify system pressure after repair.";
                        whyItMatters = "This leak creates recurring energy loss. Under the entered operating hours and electricity price, the repair pays back quickly.";
                        keyAssumptionCheck = "Confirm leak diameter, operating hours, compressor specific power, system pressure and electricity price before using this for procurement or maintenance planning.";
                      } else if (dsValue === "REVIEW") {
                        displayStatus = "MONITOR";
                        displayDriver = "Moderate economic impact";
                        nextAction = "Monitor the leak and schedule repair with the next maintenance window.";
                        whyItMatters = "The estimated annual loss exists, but urgency depends on repair access, downtime and operating schedule.";
                        keyAssumptionCheck = "Confirm operating hours and energy cost before deferring action.";
                      } else if (dsValue === "MONITOR") {
                        displayStatus = "OK";
                        displayDriver = "Low immediate economic impact";
                        nextAction = "Document the result and recheck if pressure, operating hours or electricity price changes.";
                        whyItMatters = "The current estimate does not justify urgent intervention under the entered values.";
                        keyAssumptionCheck = "Confirm that the leak size and compressor power assumptions are realistic.";
                      }
                    }

                    return (
                      <section className="sc-v531-pro-decision-summary" aria-label="Decision Summary">
                        <h3 className="sc-v531-pro-section-title">Decision Summary</h3>
                        {displayStatus && (
                          <div className="sc-v531-pro-ds-row">
                            <span className="sc-v531-pro-ds-label">Decision Status</span>
                            <span className={`sc-v531-pro-ds-value sc-v531-ds-${displayStatus.toLowerCase().replace(/\s+/g, "_")}`}>
                              {displayStatus}
                            </span>
                          </div>
                        )}
                        {displayDriver && (
                          <div className="sc-v531-pro-ds-row">
                            <span className="sc-v531-pro-ds-label">Governing Driver</span>
                            <span className="sc-v531-pro-ds-text">{displayDriver}</span>
                          </div>
                        )}
                        {nextAction && (
                          <div className="sc-v531-pro-ds-block">
                            <span className="sc-v531-pro-ds-label">Recommended Next Action</span>
                            <p className="sc-v531-pro-ds-text">{nextAction}</p>
                          </div>
                        )}
                        {whyItMatters && (
                          <div className="sc-v531-pro-ds-block">
                            <span className="sc-v531-pro-ds-label">Why It Matters</span>
                            <p className="sc-v531-pro-ds-text">{whyItMatters}</p>
                          </div>
                        )}
                        {keyAssumptionCheck && (
                          <div className="sc-v531-pro-ds-block">
                            <span className="sc-v531-pro-ds-label">Key Assumption Check</span>
                            <p className="sc-v531-pro-ds-text">{keyAssumptionCheck}</p>
                          </div>
                        )}
                      </section>
                    );
                  })()}

                  {/* Primary Results */}
                  <section className="sc-v531-pro-results" aria-label="Primary Results">
                    <h3 className="sc-v531-pro-section-title">Primary Results</h3>
                    <div className="sc-v531-pro-results-grid">
                      {response.outputs
                        .filter((o) => !isStatusOutput(o))
                        .map((out, idx) => {
                          const formattedValue = typeof out.value === "number"
                            ? formatDisplayNumber(out.value)
                            : formatSafeValue(out.value);
                          const cleanUnit = getProOutputDisplayUnit(out.id ?? "", out.unit, selectedCurrency);
                          // Avoid duplicating unit when label already contains it
                          const outLabel = out.name || "";
                          const unitNeeded = cleanUnit && !outLabel.toLowerCase().includes(cleanUnit.toLowerCase());
                          const displayStr = unitNeeded ? `${formattedValue} ${cleanUnit}` : formattedValue;
                          const cleanSymbol = out.id ? getProOutputSymbol(out.id) : "";
                          const meaning = out.public_explanation || "";
                          return (
                            <div key={idx} className="sc-v531-pro-result-card">
                              <span className="sc-v531-pro-result-name">{out.name}</span>
                              <span className="sc-v531-pro-result-value">{displayStr}</span>
                              {cleanSymbol && <span className="sc-v531-pro-result-varid">{cleanSymbol}</span>}
                              {meaning && <p className="sc-v531-pro-result-meaning">{meaning}</p>}
                            </div>
                          );
                        })}
                    </div>
                  </section>

                  {/* ── Result Intelligence (PRO only) ── */}
                  {(() => {
                    const isCompressedAir = props.toolKey === "compressed-air-leak-cost-calculator" ||
                      props.schema?.tool_key === "compressed-air-leak-cost-calculator";
                    if (!isCompressedAir) return null;

                    const annualLeakOutput = response.outputs.find((o) =>
                      (o.id ?? "").includes("annual_leak_cost")
                    );
                    const annualLeakCost = typeof annualLeakOutput?.value === "number" ? annualLeakOutput.value : null;
                    const costUnit = annualLeakOutput?.unit
                      ? getProOutputDisplayUnit("annual_leak_cost", annualLeakOutput.unit, selectedCurrency)
                      : `${selectedCurrency}/year`;
                    const formattedCost = annualLeakCost !== null
                      ? `${formatDisplayNumber(annualLeakCost)} ${costUnit}`
                      : "";

                    const paybackOutput = response.outputs.find((o) =>
                      (o.id ?? "").includes("repair_payback_days")
                    );
                    const paybackDays = typeof paybackOutput?.value === "number" ? paybackOutput.value : null;

                    let actionPriorityLabel = "";
                    let actionPriorityText = "";
                    if (paybackDays !== null) {
                      if (paybackDays <= 30) {
                        actionPriorityLabel = "High";
                        actionPriorityText = "Repair should be prioritized because the expected payback is under 30 days.";
                      } else if (paybackDays <= 180) {
                        actionPriorityLabel = "Medium";
                        actionPriorityText = "Repair can be scheduled in the next maintenance window.";
                      } else {
                        actionPriorityLabel = "Low";
                        actionPriorityText = "Repair may be deferred unless reliability, safety or production constraints require action.";
                      }
                    } else {
                      actionPriorityLabel = "Review Required";
                      actionPriorityText = "Repair priority could not be determined from the available payback output.";
                    }

                    return (
                      <section className="sc-v531-pro-intelligence" aria-label="Result Intelligence">
                        <h3 className="sc-v531-pro-section-title">Result Intelligence</h3>
                        <p className="sc-v531-pro-ri-intro">
                          Use this decision layer to prioritize action, verify assumptions and translate the calculation into maintenance, cost and operational decisions.
                        </p>
                        <div className="sc-v531-pro-ri-grid">
                          {/* 1. Financial Impact */}
                          <div className="sc-v531-pro-ri-card">
                            <h4 className="sc-v531-pro-ri-card-title">Financial Impact</h4>
                            {annualLeakCost !== null ? (
                              <p className="sc-v531-pro-ri-card-text">
                                The estimated annual leak cost is {formattedCost}. This is recurring avoidable energy cost under the entered operating schedule and electricity price.
                              </p>
                            ) : (
                              <p className="sc-v531-pro-ri-card-text">
                                The annual cost impact could not be estimated from the available outputs.
                              </p>
                            )}
                          </div>

                          {/* 2. Operational Impact */}
                          <div className="sc-v531-pro-ri-card">
                            <h4 className="sc-v531-pro-ri-card-title">Operational Impact</h4>
                            <p className="sc-v531-pro-ri-card-text">
                              The leak increases compressor load during operating hours. Larger leak diameter, higher pressure and longer annual runtime increase the energy penalty.
                            </p>
                          </div>

                          {/* 3. Action Priority */}
                          <div className="sc-v531-pro-ri-card">
                            <h4 className="sc-v531-pro-ri-card-title">Action Priority</h4>
                            <p className="sc-v531-pro-ri-card-priority">
                              Priority: <strong>{actionPriorityLabel}</strong>
                            </p>
                            <p className="sc-v531-pro-ri-card-text">{actionPriorityText}</p>
                          </div>

                          {/* 4. Assumption Quality */}
                          <div className="sc-v531-pro-ri-card">
                            <h4 className="sc-v531-pro-ri-card-title">Assumption Quality</h4>
                            <p className="sc-v531-pro-ri-card-priority">
                              Status: <strong>Review Required</strong>
                            </p>
                            <p className="sc-v531-pro-ri-card-text">
                              Result quality depends on the accuracy of leak diameter, system pressure, operating hours, compressor specific power, electricity price and repair cost.
                            </p>
                            <ul className="sc-v531-pro-ri-verify-list">
                              <li>Leak diameter</li>
                              <li>System pressure</li>
                              <li>Operating hours</li>
                              <li>Compressor specific power</li>
                              <li>Electricity price</li>
                              <li>Repair cost</li>
                            </ul>
                          </div>

                          {/* 5. Key Sensitivity Drivers */}
                          <div className="sc-v531-pro-ri-card">
                            <h4 className="sc-v531-pro-ri-card-title">Key Sensitivity Drivers</h4>
                            <ul className="sc-v531-pro-ri-verify-list">
                              <li>Leak diameter</li>
                              <li>System pressure</li>
                              <li>Operating hours</li>
                              <li>Compressor specific power</li>
                              <li>Electricity price</li>
                              <li>Repair cost</li>
                            </ul>
                          </div>

                          {/* 6. Verification Checklist */}
                          <div className="sc-v531-pro-ri-card">
                            <h4 className="sc-v531-pro-ri-card-title">Verification Checklist</h4>
                            <ul className="sc-v531-pro-ri-verify-list sc-v531-pro-ri-check-list">
                              <li>Confirm leak diameter by site measurement.</li>
                              <li>Confirm pressure at or near the leak location.</li>
                              <li>Confirm annual operating hours.</li>
                              <li>Confirm compressor specific power from equipment or audit records.</li>
                              <li>Confirm electricity tariff.</li>
                              <li>Confirm repair cost estimate.</li>
                            </ul>
                          </div>
                        </div>
                      </section>
                    );
                  })()}

                  {/* Professional Interpretation (PRO only) */}
                  {(() => {
                    const isCompressedAir = props.toolKey === "compressed-air-leak-cost-calculator" ||
                      props.schema?.tool_key === "compressed-air-leak-cost-calculator";
                    if (!isCompressedAir) return null;

                    const paybackOutput = response.outputs.find((o) =>
                      (o.id ?? "").includes("repair_payback_days")
                    );
                    const paybackDays = typeof paybackOutput?.value === "number" ? paybackOutput.value : null;

                    let priorityLabel = "";
                    let priorityText = "";
                    if (paybackDays !== null) {
                      if (paybackDays <= 30) {
                        priorityLabel = "High";
                        priorityText = "Repair should be prioritized because the expected payback is under 30 days.";
                      } else if (paybackDays <= 180) {
                        priorityLabel = "Medium";
                        priorityText = "Repair can be scheduled in the next maintenance window.";
                      } else {
                        priorityLabel = "Low";
                        priorityText = "Repair may be deferred unless reliability, safety or production constraints require action.";
                      }
                    }

                    return (
                      <section className="sc-v531-pro-professional-interpretation" aria-label="Professional Interpretation">
                        <h3 className="sc-v531-pro-section-title">Professional Interpretation</h3>
                        <p className="sc-v531-pro-pi-intro">
                          Use this interpretation to prioritize leak repair, energy-cost reduction and maintenance scheduling.
                        </p>

                        <div className="sc-v531-pro-pi-block">
                          <h4 className="sc-v531-pro-pi-subtitle">1. Operating Impact</h4>
                          <p className="sc-v531-pro-pi-text">
                            The estimated air loss increases compressor load during operating hours. Higher pressure, larger leak diameter and longer annual runtime increase the loss.
                          </p>
                        </div>

                        <div className="sc-v531-pro-pi-block">
                          <h4 className="sc-v531-pro-pi-subtitle">2. Cost Impact</h4>
                          <p className="sc-v531-pro-pi-text">
                            Annual leak cost is driven by air loss, compressor specific power, operating hours and electricity price. Use site-specific energy tariffs for final maintenance decisions.
                          </p>
                        </div>

                        <div className="sc-v531-pro-pi-block">
                          <h4 className="sc-v531-pro-pi-subtitle">3. Payback Interpretation</h4>
                          <p className="sc-v531-pro-pi-text">
                            The repair payback period compares estimated repair cost against annualized leakage cost. Short payback indicates high maintenance priority.
                          </p>
                        </div>

                        <div className="sc-v531-pro-pi-block">
                          <h4 className="sc-v531-pro-pi-subtitle">4. Action Priority</h4>
                          {paybackDays !== null ? (
                            <>
                              <p className="sc-v531-pro-pi-priority">
                                Priority: <strong>{priorityLabel}</strong>
                              </p>
                              <p className="sc-v531-pro-pi-text">{priorityText}</p>
                            </>
                          ) : (
                            <p className="sc-v531-pro-pi-text">Payback period could not be determined.</p>
                          )}
                        </div>

                        <div className="sc-v531-pro-pi-block">
                          <h4 className="sc-v531-pro-pi-subtitle">5. Assumption Quality</h4>
                          <p className="sc-v531-pro-pi-text">
                            Result quality depends on the accuracy of leak diameter, pressure, operating hours, compressor specific power and electricity price. For final procurement decisions, validate these values from site measurements or maintenance records.
                          </p>
                        </div>
                      </section>
                    );
                  })()}
                </div>
              )}
              </div>
            )
            ) : (
              <div className="sc-v531-placeholder">
                <p className="sc-v531-placeholder-title">No result yet</p>
                <p className="sc-v531-placeholder-text">
                  {isFreeTier
                    ? "Enter your values and click \"Calculate\" to see your results."
                    : "Enter values and run the calculation. Results and decision guidance will appear here."
                  }
                </p>
              </div>
            )}
          </section>

          {/* Premium hook (hidden in FREE mode) */}
          {!isFreeRoute && premiumHook && (
            <PremiumPanel hook={premiumHook} onCheckout={() => machine.requestCheckout()} />
          )}

      {/* ── 3. Advanced details (collapsed by default — lazy body) ── */}
      <AdvancedDetailsWrapper isFreeTier={isFreeTier} toolKey={props.toolKey} schema={props.schema} selectedCurrency={selectedCurrency} />

      {/* Mobile bar — status + action (shared component with resolver) */}
      <MobileStickyActionBar
        config={resolveToolStickyBarState(
          isFreeTier ? "FREE" : "PRO",
          hasResult,
          isPro && !!props.usageSessionId,
          isExecuting,
          clientBlockerCount,
          hasResult ? vm.resultState.executionLabel : "",
          true, // isAuthenticated — form is only mounted when user is authenticated (guarded by ProToolPaywallGate)
          primaryButtonAction,
          () => {}, // onSignIn — guarded by ProToolPaywallGate
          () => props.onRequestCreditSession?.(props.toolKey ?? ""),
          () => {}, // onRequestAssisted — handled by ProToolAssistedDossierShell
        )}
      />
    </section>
  );
}

// ── Input field — clean primary UI ──────────────────────────────────────────────

/**
 * Infer a unit suffix from a field id/name when the schema has no explicit units.
 * Maps common field name patterns to display labels.
 */
function inferFieldUnit(fieldId: string, fieldName: string): string | null {
  const combined = `${fieldId} ${fieldName}`.toLowerCase().replace(/_/g, " ");
  if (/\bmm\b/.test(combined)) return "mm";
  if (/\binch\b/.test(combined)) return "in";
  if (/\bfeet\b/.test(combined) || /\bfoot\b/.test(combined)) return "ft";
  if (/\bkg\b/.test(combined)) return "kg";
  if (/\blb\b/.test(combined) || /\bpound\b/.test(combined)) return "lb";
  if (/\bnewton\b/.test(combined)) return "N";
  if (/\bmpa\b/.test(combined)) return "MPa";
  if (/\bpsi\b/.test(combined)) return "psi";
  return null;
}

function CalculatorInputField({
  field,
  currencyCode,
  onValueChange,
  onUnitChange,
  onEvidenceChange,
  showErrors,
  isFreeTier,
}: {
  field: FieldViewModel;
  currencyCode: CurrencyCode;
  onValueChange: (value: string | number | boolean | null) => void;
  onUnitChange: (unit: string) => void;
  onEvidenceChange: (valueVerified: boolean, sourceVerified: boolean) => void;
  showErrors?: boolean;
  isFreeTier?: boolean;
}) {
  const inputId = `sc-v531-input-${field.id}`;
  const hasBlocker = field.blockers.length > 0;

  // Only show red validation border when the user has attempted Calculate
  const showErrorState = showErrors === true && hasBlocker;

  // Resolve unit label — replace "Currency" placeholder with selected ISO code
  const resolveUnitLabel = (unit: string): string => {
    const label = formatCleanUnitLabel(unit);
    if (label === "Currency" || label.includes("Currency")) {
      return replaceCurrencyLabel(label, currencyCode);
    }
    return label;
  };

  // Real units: filter out empty strings from resolver fallback.
  // This prevents unitless numeric fields and SELECT fields from
  // rendering an empty unit suffix.
  const nonEmptyUnits = field.allowedUnits.filter((u) => u.length > 0);
  const isNumeric = field.type === "number" || field.type === "integer";
  const hasRealUnits = isNumeric && nonEmptyUnits.length > 0;
  // Infer a unit suffix from field name/id when schema has no explicit units.
  const inferredUnit = !hasRealUnits && isNumeric ? inferFieldUnit(field.id, field.label) : null;

  return (
    <div className="sc-v531-field-card" data-criticality={field.criticality.toLowerCase()} data-error={showErrorState}>
      {/* Header: label + symbol */}
      <div className="sc-v531-field-header">
        <label htmlFor={inputId} className="sc-v531-field-title">{field.label}</label>
        {field.symbol && <span className="sc-v531-field-symbol">({field.symbol})</span>}
      </div>

      {/* Help text */}
      {field.helpText && <p className="sc-v531-field-help">{field.helpText}</p>}

      {/* Numeric with units: use field-control layout (input dominant, unit as suffix) */}
      {hasRealUnits && field.unitSelectable ? (
        <div className="sc-v531-field-control">
          {renderValueInput(inputId, field, onValueChange, true)}
          <select
            className="sc-v531-unit-select"
            value={field.selectedUnit || nonEmptyUnits[0]}
            aria-label={`${field.label} unit`}
            onChange={(e: ChangeEvent<HTMLSelectElement>) => onUnitChange(e.target.value)}
          >
            {nonEmptyUnits.map((unit) => (
              <option key={unit} value={unit}>{resolveUnitLabel(unit)}</option>
            ))}
          </select>
        </div>
      ) : hasRealUnits && !field.unitSelectable ? (
        /* Fixed unit: passive suffix, no select */
        <div className="sc-v531-field-control">
          {renderValueInput(inputId, field, onValueChange, true)}
          <span className="sc-v531-unit-suffix">
            {resolveUnitLabel(field.selectedUnit || nonEmptyUnits[0])}
          </span>
        </div>
      ) : !hasRealUnits && isNumeric && inferredUnit ? (
        /* Inferred unit: passive suffix from field name (no explicit schema unit) */
        <div className="sc-v531-field-control">
          {renderValueInput(inputId, field, onValueChange, true)}
          <span className="sc-v531-unit-suffix">{inferredUnit}</span>
        </div>
      ) : (
        /* No units: single input only */
        <div className="sc-v531-input-row">
          {renderValueInput(inputId, field, onValueChange, false)}
        </div>
      )}

      {/* Clean reference helper — one line per input, "Currency" placeholder replaced */}
      {field.cleanReferenceHelper && (
        <p className="sc-v531-ref-helper">{replaceCurrencyLabel(field.cleanReferenceHelper, currencyCode)}</p>
      )}

      {!isFreeTier && (
        <div className="sc-v531-field-reference" aria-label={field.label + " reference controls"}>
          <div className="sc-v531-field-reference-strip">
            {field.referenceStrip.map((line) => (
              <span key={line} className="sc-v531-ref-line">
                {replaceCurrencyLabel(line, currencyCode)}
              </span>
            ))}
          </div>
          {field.referenceSource && (
            <p className="sc-v531-ref-line">
              <strong>Source:</strong> {field.referenceSource}
            </p>
          )}
          {field.tolerancePct && (
            <p className="sc-v531-field-tolerance">
              <strong>Declared span:</strong> {field.tolerancePct}
            </p>
          )}
        </div>
      )}

      {!isFreeTier && (
        <fieldset className="sc-v531-field-evidence">
          <legend className="sc-v531-evidence-title">{field.evidence.evidenceLabel}</legend>
          <div className="sc-v531-evidence-options">
            <label>
              <input
                type="checkbox"
                checked={field.evidence.valueVerified}
                onChange={(event) =>
                  onEvidenceChange(event.target.checked, field.evidence.sourceVerified)
                }
              />
              Value verified
            </label>
            <label>
              <input
                type="checkbox"
                checked={field.evidence.sourceVerified}
                onChange={(event) =>
                  onEvidenceChange(field.evidence.valueVerified, event.target.checked)
                }
              />
              Source record checked
            </label>
          </div>
        </fieldset>
      )}
    </div>
  );
}

function renderValueInput(
  inputId: string,
  field: FieldViewModel,
  onValueChange: (value: string | number | boolean | null) => void,
  useValueInputClass?: boolean,
) {
  if (field.type === "boolean") {
    return (
      <label className="sc-v531-toggle">
        <input
          type="checkbox"
          checked={field.value === true}
          onChange={(e: ChangeEvent<HTMLInputElement>) => onValueChange(e.target.checked)}
        />
        <span>Confirmed</span>
      </label>
    );
  }

  if (field.type === "select") {
    return (
      <select
        id={inputId}
        className="sc-v531-input"
        value={typeof field.value === "string" ? field.value : ""}
        onChange={(e: ChangeEvent<HTMLSelectElement>) => onValueChange(e.target.value)}
      >
        <option value="">Select value</option>
        {field.allowedValues.map((opt) => (
          <option key={opt} value={opt}>{humanizeEnum(opt)}</option>
        ))}
      </select>
    );
  }

  const unitHint = field.allowedUnits.some((u) => /[\$€£¥₺]/i.test(u) || /usd|eur|gbp|try|tl/i.test(u))
    ? "Use decimal point for cents, e.g. 500000.005"
    : "";

  const inputClass = useValueInputClass ? "sc-v531-value-input" : "sc-v531-input";

  if (field.type === "number" || field.type === "integer") {
    return (
      <NumericValueInput
        id={inputId}
        className={inputClass}
        fieldType={field.type}
        placeholder={unitHint}
        value={field.value}
        onValueChange={onValueChange}
      />
    );
  }

  return (
    <input
      id={inputId}
      className={inputClass}
      inputMode="text"
      type="text"
      placeholder={unitHint || ""}
      value={typeof field.value === "string" ? field.value : ""}
      onChange={(e: ChangeEvent<HTMLInputElement>) => onValueChange(e.target.value)}
    />
  );
}

interface NumericValueInputProps {
  id: string;
  className: string;
  fieldType: ProNumericFieldType;
  placeholder: string;
  value: FieldViewModel["value"];
  onValueChange: (value: string | number | boolean | null) => void;
}

function NumericValueInput({
  id,
  className,
  fieldType,
  placeholder,
  value,
  onValueChange,
}: NumericValueInputProps) {
  const externalValue =
    typeof value === "number" && Number.isFinite(value)
      ? String(value)
      : typeof value === "string"
        ? value
        : "";
  const [draft, setDraft] = useState(externalValue);
  const focusedRef = useRef(false);

  useEffect(() => {
    if (!focusedRef.current) setDraft(externalValue);
  }, [externalValue]);

  const commitDraft = useCallback((nextDraft: string) => {
    const numericValue = parseProNumericDraft(nextDraft);
    onValueChange(numericValue);
  }, [onValueChange]);

  return (
    <input
      id={id}
      className={className}
      inputMode={fieldType === "integer" ? "numeric" : "decimal"}
      type="text"
      placeholder={placeholder || ""}
      value={draft}
      onFocus={() => {
        focusedRef.current = true;
      }}
      onChange={(event: ChangeEvent<HTMLInputElement>) => {
        const nextDraft = sanitizeProNumericDraft(event.target.value, fieldType);
        setDraft(nextDraft);
        commitDraft(nextDraft);
      }}
      onBlur={() => {
        focusedRef.current = false;
        const numericValue = parseProNumericDraft(draft);
        const normalizedDraft = numericValue === null ? "" : String(numericValue);
        setDraft(normalizedDraft);
        onValueChange(numericValue);
      }}
    />
  );
}

// ── Guard components ───────────────────────────────────────────────────────────

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

function IdentityBlocker({ reason }: { reason: string }) {
  return (
    <section className="sc-v531-contract-blocker" role="alert">
      <h2>Schema identity mismatch</h2>
      <p>{reason}</p>
      <p>The requested tool does not match the resolved schema. No inputs or execution are available.</p>
    </section>
  );
}

// ── Post-execution panels (in advanced details) —────────────────────────────────
// ── NO server response data rendered here. Only controlled static text. ─────────

/**
 * Static formula description by tool_key.
 * No server response data (proof_pack_public.sections) is rendered in normal Advanced.
 */
function getFormulaText(toolKey: string | undefined): string {
  switch (toolKey) {
    case "tap-drill-size":
      return "The tap drill diameter is calculated as the major diameter minus thread pitch multiplied by a thread-dependent factor. For standard metric threads, the factor is approximately 1.0825 × pitch. The tool also accounts for material and plating allowances that adjust the final drill size.";
    case "compressed-air-leak-cost-calculator":
      return "The calculation estimates air loss from leak diameter and pressure, converts air loss into annual energy use using compressor specific power and operating hours, then estimates annual cost and repair payback.";
    case "break-even-and-margin-of-safety-analysis":
      return "This calculator uses the entered cost, price, variable cost and sales volume values to estimate break-even volume, break-even revenue and margin of safety.";
    default:
      return "Calculation uses standard engineering formulas based on input parameters. Exact formula expressions are protected.";
  }
}

/** Controlled formula logic — static text, no server data. */
function FormulaLogicSection({
  toolKey,
  schema,
}: {
  toolKey?: string;
  schema: SuperV4Schema;
}) {
  const formulaText = getFormulaText(toolKey);
  const standards = Array.isArray(schema.standards) ? (schema.standards as Array<{ name?: string }>) : [];
  const standardNames = standards
    .map((s) => s.name)
    .filter((n): n is string => Boolean(n));

  return (
    <section className="sc-v531-advanced-section" aria-label="Protected methodology">
      <h3 className="sc-v531-advanced-title">Protected methodology</h3>
      <p className="sc-v531-methodology-text"><strong>Formula logic:</strong> {formulaText}</p>
      {standardNames.length > 0 && (
        <div className="sc-v531-methodology-stack">
          <p className="sc-v531-methodology-text">
            <strong>Standards referenced:</strong> {standardNames.join(", ")}
          </p>
        </div>
      )}
    </section>
  );
}

/** Controlled validation notes — static text, no server warnings. */
function ValidationNotesSection({ isFreeTier }: { isFreeTier: boolean }) {
  return (
    <section className="sc-v531-advanced-section" aria-label="Validation notes">
      <h3 className="sc-v531-advanced-title">Validation notes</h3>
      <ul className="sc-v531-assumption-list">
        <li className="sc-v531-assumption-item">Inputs are checked against visible reference ranges.</li>
        <li className="sc-v531-assumption-item">Values outside the reference range may reduce decision quality.</li>
        <li className="sc-v531-assumption-item">
          {isFreeTier
            ? "Verify commercial values before using the result for pricing or planning."
            : "Evidence is recommended before final maintenance or procurement decision."
          }
        </li>
      </ul>
    </section>
  );
}

/** Controlled calculation assumptions — static text for FREE. */
function CalculationAssumptionsSection({ currencyCode }: { currencyCode: CurrencyCode }) {
  return (
    <section className="sc-v531-advanced-section" aria-label="Calculation assumptions">
      <h3 className="sc-v531-advanced-title">Calculation assumptions</h3>
      <ul className="sc-v531-assumption-list">
        <li className="sc-v531-assumption-item">Monetary values shown in {currencyCode}. Currency selector changes display only.</li>
        <li className="sc-v531-assumption-item">Results depend on user-entered values.</li>
        <li className="sc-v531-assumption-item">This output is decision support, not audited financial advice.</li>
      </ul>
    </section>
  );
}

/** Controlled sensitivity — static text from tool_key map. */
function SensitivitySection({ toolKey }: { toolKey?: string }) {
  const bullets = getSensitivityBullets(toolKey);
  return (
    <section className="sc-v531-advanced-section" aria-label="Sensitivity">
      <h3 className="sc-v531-advanced-title">Sensitivity</h3>
      <ul className="sc-v531-assumption-list">
        {bullets.map((b, i) => (
          <li key={i} className="sc-v531-assumption-item">{b}</li>
        ))}
      </ul>
    </section>
  );
}

function getSensitivityBullets(toolKey: string | undefined): string[] {
  switch (toolKey) {
    case "compressed-air-leak-cost-calculator":
      return [
        "Leak diameter and system pressure strongly affect estimated air loss.",
        "Operating hours and compressor specific power strongly affect annual energy loss.",
        "Electricity price and repair cost drive the economic payback.",
      ];
    default:
      return [
        "Verify key input values before making decisions based on results.",
      ];
  }
}

/** Controlled audit trail — PRO only. Clean text only. */
function ProAuditTrailSection() {
  return (
    <section className="sc-v531-advanced-section" aria-label="Audit trail">
      <h3 className="sc-v531-advanced-title">Audit trail</h3>
      <p className="sc-v531-methodology-text">
        Calculation inputs, normalized values, outputs and proof-pack metadata are
        audit-traceable. Raw developer payload is not displayed in the customer interface.
      </p>
    </section>
  );
}

/** Controlled export — PRO only. Clean text only. */
function ProExportSection() {
  return (
    <section className="sc-v531-advanced-section" aria-label="Export">
      <h3 className="sc-v531-advanced-title">Export</h3>
      <p className="sc-v531-methodology-text">
        Export-ready report structure is prepared for production workflows.
      </p>
    </section>
  );
}

/**
 * Advanced details with lazy body — only renders when the user expands it.
 * Prevents heavy section content (FormulaLogic, Sensitivity, Audit, Export)
 * from being rendered before the user opens the panel.
 */
function AdvancedDetailsWrapper({
  isFreeTier,
  toolKey,
  schema,
  selectedCurrency,
}: {
  isFreeTier: boolean;
  toolKey?: string;
  schema: SuperV4Schema;
  selectedCurrency: CurrencyCode;
}) {
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const [open, setOpen] = useState(false);

  return (
    <details
      ref={detailsRef}
      className="sc-v531-advanced"
      data-testid="advanced-details"
      onToggle={() => setOpen(detailsRef.current?.open ?? false)}
    >
      <summary className="sc-v531-advanced-summary">
        <span>Advanced details</span>
        <span className="sc-v531-advanced-links">
          {isFreeTier ? (
            <>
              <span>Formula logic</span>
              <span>Validation notes</span>
              <span>Calculation assumptions</span>
            </>
          ) : (
            <>
              <span>Formula logic</span>
              <span>Validation notes</span>
              <span>Sensitivity</span>
              <span>Audit trail</span>
              <span>Export</span>
            </>
          )}
        </span>
      </summary>
      {open && (
        <div className="sc-v531-advanced-body">
          <FormulaLogicSection toolKey={toolKey} schema={schema} />
          <ValidationNotesSection isFreeTier={isFreeTier} />
          {isFreeTier && <CalculationAssumptionsSection currencyCode={selectedCurrency} />}
          {!isFreeTier && (
            <>
              <SensitivitySection toolKey={toolKey} />
              <ProAuditTrailSection />
              <ProExportSection />
            </>
          )}
        </div>
      )}
    </details>
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
      if (url) window.location.href = url;
    } finally { setLoading(false); }
  };
  return (
    <section className="sc-v531-advanced-section" aria-label="Premium hook">
      <h3 className="sc-v531-advanced-title">Monetary loss exposure</h3>
      <div className="sc-v531-premium-card">
        <strong>{hook.pain_metric.label}</strong>
        <p className="sc-v531-premium-value">
          {hook.pain_metric.value !== null
            ? `${formatSafeValue(hook.pain_metric.value)} ${hook.pain_metric.unit}`
            : "Insufficient input context."}
        </p>
        <p>{hook.pain_metric.explanation}</p>
        <p className="sc-v531-legal-disclaimer">{hook.pain_metric.safety_note}</p>
        <button type="button" className="sc-v531-primary-button" disabled={loading} onClick={handleCheckout}>
          {loading ? "Opening..." : hook.cta.label}
        </button>
        <p className="sc-v531-empty">{hook.cta.subtext}</p>
      </div>
    </section>
  );
}

// ── Shared small components ─────────────────────────────────────────────────────

function WarningCard({ severity, title, detail }: { severity: string; title: string; detail: string }) {
  if (!hasMessage(title)) return null;
  return (
    <div className="sc-v531-warning-card" data-severity={severity.toLowerCase()}>
      <span className="sc-v531-warning-severity">{severity}</span>
      <strong className="sc-v531-warning-title">{title}</strong>
      {hasMessage(detail) && <p className="sc-v531-warning-detail">{detail}</p>}
    </div>
  );
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function executionStateToStatus(state: string): CalcStatus {
  if (state === "server_ok") return "OK";
  if (state === "server_review") return "REVIEW";
  if (state === "server_blocked" || state === "client_precheck_blocked" || state === "schema_rejected") return "BLOCKED";
  if (state === "server_reprice") return "REPRICE";
  if (state === "server_reject") return "REJECT";
  if (state === "server_hold") return "HOLD";
  return "REVIEW";
}

export default UniversalIndustrialDecisionForm;
