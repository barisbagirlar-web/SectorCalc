"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PageLayout } from "@/components/layout/PageLayout";
import { getCurrentUserIdToken } from "@/lib/infrastructure/firebase/auth";
import { PhotoUpload } from "@/components/diagnostics/PhotoUpload";
import type { PhotoEntry } from "@/components/diagnostics/PhotoUpload";
import { CameraOnlyPreview } from "@/components/diagnostics/CameraOnlyPreview";

/* ── Constants ── */

const DOMAIN_OPTIONS = [
  { value: "", label: "-- Select Domain --" },
  { value: "CNC_MACHINING", label: "CNC Machining" },
  { value: "WELDING", label: "Welding" },
  { value: "STEEL_CONSTRUCTION", label: "Steel Construction" },
  { value: "CONCRETE", label: "Concrete" },
  { value: "ELECTRICAL", label: "Electrical" },
  { value: "MECHANICAL", label: "Mechanical" },
  { value: "LOGISTICS", label: "Logistics" },
  { value: "FACILITY", label: "Facility" },
  { value: "AGRICULTURE", label: "Agriculture" },
  { value: "TEXTILE", label: "Textile" },
  { value: "WAREHOUSE", label: "Warehouse" },
  { value: "RESTAURANT", label: "Restaurant" },
];

const MEASUREMENT_TOOL_OPTIONS = [
  { value: "caliper", label: "Caliper" },
  { value: "micrometer", label: "Micrometer" },
  { value: "bore_gauge", label: "Bore Gauge" },
  { value: "dial_indicator", label: "Dial Indicator" },
  { value: "cmm", label: "CMM" },
  { value: "unknown", label: "Unknown / Other" },
];

const CALIBRATION_OPTIONS = [
  { value: "valid", label: "Valid" },
  { value: "unknown", label: "Unknown" },
  { value: "expired", label: "Expired" },
];

const PRIVACY_OPTIONS = [
  { value: "standard", label: "Standard" },
  { value: "reduced_retention", label: "Reduced Retention" },
];

const PROB_SOURCE_OPTIONS = [
  { value: "DEFAULT_TABLE", label: "Industry Default Table" },
  { value: "USER_ADJUSTED", label: "User-Adjusted" },
];

/* ── Types ── */

type DomainType = "dimensional" | "electrical" | "operational";

function getDomainType(domainId: string): DomainType {
  const dim = ["CNC_MACHINING", "WELDING", "STEEL_CONSTRUCTION", "CONCRETE", "MECHANICAL"];
  if (domainId === "ELECTRICAL") return "electrical";
  if (dim.includes(domainId)) return "dimensional";
  return "operational";
}

interface DomainFieldLabels {
  measuredLabel: string;
  nominalLabel: string;
  tolerancePlusLabel: string;
  toleranceMinusLabel: string;
  unitPlaceholder: string;
  toolPlaceholder: string;
  conditionLabel: string;
  showNominalTolerance: boolean;
}

function getDomainLabels(domainId: string): DomainFieldLabels {
  const dt = getDomainType(domainId);
  if (dt === "electrical") {
    return {
      measuredLabel: "Measured Value (Voltage / Current / Resistance)",
      nominalLabel: "Nominal / Expected Value",
      tolerancePlusLabel: "Upper Tolerance",
      toleranceMinusLabel: "Lower Tolerance",
      unitPlaceholder: "V, A, Ohm, degC",
      toolPlaceholder: "Multimeter, Clamp Meter, Thermal Imager",
      conditionLabel: "Component Condition",
      showNominalTolerance: false,
    };
  }
  if (dt === "operational") {
    return {
      measuredLabel: "Observed Quantity / Count",
      nominalLabel: "Expected / Baseline Quantity",
      tolerancePlusLabel: "Upper Acceptable Deviation",
      toleranceMinusLabel: "Lower Acceptable Deviation",
      unitPlaceholder: "Units, hours, kg, m",
      toolPlaceholder: "Observation, Log, Gauge, Scale",
      conditionLabel: "Current State Description",
      showNominalTolerance: false,
    };
  }
  return {
    measuredLabel: "Measured Value",
    nominalLabel: "Nominal / Design Value",
    tolerancePlusLabel: "Tolerance (+)",
    toleranceMinusLabel: "Tolerance (−)",
    unitPlaceholder: "mm, in, deg",
    toolPlaceholder: "Caliper, Micrometer, CMM",
    conditionLabel: "Part Condition",
    showNominalTolerance: true,
  };
}

type FormState = {
  domain_id: string;
  problem_context: string;
  measurement: {
    measured_value: string;
    nominal_value: string;
    tolerance_plus: string;
    tolerance_minus: string;
    unit: string;
    measurement_tool: string;
    calibration_status: string;
    part_condition: string;
  };
  costs: {
    affected_quantity: string;
    material_cost_per_unit: string;
    rework_hours_per_unit: string;
    blended_hourly_rate: string;
    downtime_hours: string;
    machine_hourly_rate: string;
    expedite_or_delay_cost: string;
    scrap_probability: string;
    rework_probability: string;
    probability_source: string;
  };
  privacy_mode: string;
};

type FieldErrors = Record<string, string>;

type DiagnosticResult = {
  ok: boolean;
  diagnostic_id: string;
  domain: {
    id: string;
    label: string;
    description: string;
    category: string;
    context: {
      process_description: string;
      typical_tolerances: string;
      common_defect_modes: string[];
    };
  };
  measurement_results: Array<{
    index: number;
    input_summary: { measured_value: number; nominal_value: number; unit: string; tool: string };
    expanded_uncertainty_k2: number;
    confidence_class: string;
    tolerance_status: string;
    mandatory_decision_floor: string | null;
  }>;
  cost_at_risk: { total: number; probability_source: string; assumptions: string[] };
  decision: {
    total_risk_score: number;
    decision: string;
    mandatory_floor_applied: boolean;
    breakdown: {
      measurement_risk: number;
      confidence_risk: number;
      visual_advisory_risk: number;
      exposure_risk: number;
      cost_risk: number;
      manual_check_risk: number;
    };
  };
  action_plan: {
    containment: Array<{ action: string; responsible_role: string; priority: string; estimated_duration: string }>;
    temporary_fix: Array<{ action: string; responsible_role: string; priority: string; estimated_duration: string }>;
    permanent_corrective_action: Array<{ action: string; responsible_role: string; priority: string; estimated_duration: string }>;
    required_manual_checks: Array<{ action: string; responsible_role: string; priority: string; estimated_duration: string }>;
  };
  audit_log: string[];
  disclaimer: string;
  error?: string;
  issues?: Array<{ path: string; message: string }>;
};

/* ── Gated Preview (free, no commercial value) ── */
type GatedPreviewResult = {
  ok: boolean;
  mode: "gated_preview";
  preview: {
    domain_detected: string;
    domain_category: string;
    risk_band: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
    risk_band_label: string;
    brief_explanation: string;
  };
  requires_upgrade: boolean;
  disclaimer: string;
  error?: string;
};

type AnalyzeResponse = DiagnosticResult | GatedPreviewResult;

function isGatedPreview(r: AnalyzeResponse): r is GatedPreviewResult {
  return (r as GatedPreviewResult).mode === "gated_preview";
}

function riskBandBadge(band: string): { bg: string; fg: string } {
  switch (band) {
    case "LOW": return { bg: "#D6F5D6", fg: "#238A23" };
    case "MEDIUM": return { bg: "#FFF8D6", fg: "#8A7A23" };
    case "HIGH": return { bg: "#FFF0D6", fg: "#A16A23" };
    case "CRITICAL": return { bg: "#F5D6D6", fg: "#A12323" };
    default: return { bg: "#F0EEE6", fg: "#6B6B68" };
  }
}

/* ── Helpers ── */

function toleranceStatusBadgeClass(status: string): { bg: string; fg: string; label: string } {
  switch (status) {
    case "BREACH": return { bg: "#F5D6D6", fg: "#A12323", label: "Breach" };
    case "UNCERTAIN": return { bg: "#FFF0D6", fg: "#A16A23", label: "Uncertain" };
    case "NEAR_LIMIT": return { bg: "#FFF8D6", fg: "#8A7A23", label: "Near Limit" };
    default: return { bg: "#D6F5D6", fg: "#238A23", label: "Inside" };
  }
}

function confidenceBadgeClass(cls: string): { background: string; color: string } {
  switch (cls) {
    case "HIGH": return { background: "#D6F5D6", color: "#238A23" };
    case "MEDIUM": return { background: "#FFF8D6", color: "#8A7A23" };
    default: return { background: "#F5D6D6", color: "#A12323" };
  }
}

function decisionBadgeClass(state: string): { background: string; color: string } {
  switch (state) {
    case "LOW_RISK": return { background: "#D6F5D6", color: "#238A23" };
    case "PROCEED_WITH_CAUTION": return { background: "#FFF8D6", color: "#8A7A23" };
    case "STOP_AND_INSPECT": return { background: "#FFF0D6", color: "#A16A23" };
    case "QC_REQUIRED": return { background: "#F5D6D6", color: "#A12323" };
    case "HIGH_SCRAP_RISK": return { background: "#F5D0D0", color: "#8A1010" };
    default: return { background: "#F5D0D0", color: "#8A1010" };
  }
}

/* ── Page Component ── */

export default function EngineeringDiagnosticsStartPage() {
  const router = useRouter();
  const lastRequestBodyRef = useRef<unknown>(null);
  const [entryMode, setEntryMode] = useState<"photo" | "full" | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [remainingUses, setRemainingUses] = useState<number | null>(null);
  const [fullDiagLoading, setFullDiagLoading] = useState(false);
  const [fullDiagError, setFullDiagError] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>({
    domain_id: "",
    problem_context: "",
    measurement: {
      measured_value: "",
      nominal_value: "",
      tolerance_plus: "",
      tolerance_minus: "",
      unit: "mm",
      measurement_tool: "caliper",
      calibration_status: "valid",
      part_condition: "",
    },
    costs: {
      affected_quantity: "",
      material_cost_per_unit: "",
      rework_hours_per_unit: "",
      blended_hourly_rate: "",
      downtime_hours: "",
      machine_hourly_rate: "",
      expedite_or_delay_cost: "",
      scrap_probability: "",
      rework_probability: "",
      probability_source: "DEFAULT_TABLE",
    },
    privacy_mode: "standard",
  });

  const [photos, setPhotos] = useState<PhotoEntry[]>([]);
  const [hasDiagnosticAccess, setHasDiagnosticAccess] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DiagnosticResult | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);

  // Auto-save form state to localStorage
  const STORAGE_KEY = "ediag_form_state";
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setForm((prev) => ({ ...prev, ...parsed }));
      } catch { /* ignore */ }
    }
  }, []);
  const autoSaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
    autoSaveTimerRef.current = setTimeout(() => {
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(form)); } catch { /* quota */ }
    }, 400);
    return () => { if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current); };
  }, [form]);
  function clearAutosave() { try { localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ } }

  // Fetch remaining diagnostic uses on mount
  useEffect(() => {
    (async () => {
      try {
        const token = await getCurrentUserIdToken();
        if (!token) return;
        const res = await fetch("/api/engineering-diagnostics/usage", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.ok && typeof data.remainingUses === "number") {
          setRemainingUses(data.remainingUses);
          setHasDiagnosticAccess(data.remainingUses > 0);
        }
      } catch {
        // silent — usage info is non-critical
      }
    })();
  }, []);

  function setField(path: string, value: string) {
    setFieldErrors((prev) => {
      const copy = { ...prev };
      delete copy[path];
      return copy;
    });
    setServerError(null);

    if (path.startsWith("measurement.")) {
      const key = path.slice("measurement.".length) as keyof FormState["measurement"];
      setForm((prev) => ({
        ...prev,
        measurement: { ...prev.measurement, [key]: value },
      }));
    } else if (path.startsWith("costs.")) {
      const key = path.slice("costs.".length) as keyof FormState["costs"];
      setForm((prev) => ({
        ...prev,
        costs: { ...prev.costs, [key]: value },
      }));
    } else {
      setForm((prev) => ({ ...prev, [path]: value }));
    }
  }

  function validateForm(): boolean {
    const errors: FieldErrors = {};
    if (!form.domain_id) errors.domain_id = "Domain is required";
    if (!form.problem_context.trim()) errors.problem_context = "Problem context is required";
    if (form.problem_context.trim().length > 5000) errors.problem_context = "Max 5000 characters";

    const num = (v: string) => {
      const n = parseFloat(v);
      return isNaN(n) ? null : n;
    };

    const m = form.measurement;
    const dt = form.domain_id ? getDomainType(form.domain_id) : "dimensional";
    const labels = form.domain_id ? getDomainLabels(form.domain_id) : null;

    if (num(m.measured_value) === null) errors["measurement.measured_value"] = "Required";
    if (dt === "dimensional" || (labels && labels.showNominalTolerance)) {
      if (num(m.nominal_value) === null) errors["measurement.nominal_value"] = "Required";
      if (num(m.tolerance_plus) === null) errors["measurement.tolerance_plus"] = "Required";
      if (num(m.tolerance_minus) === null) errors["measurement.tolerance_minus"] = "Required";
    }
    if (!m.unit.trim()) errors["measurement.unit"] = "Required";
    if (!m.part_condition.trim()) errors["measurement.part_condition"] = "Required";

    const c = form.costs;
    if (num(c.affected_quantity) === null) errors["costs.affected_quantity"] = "Required";
    if (num(c.material_cost_per_unit) === null) errors["costs.material_cost_per_unit"] = "Required";
    if (num(c.rework_hours_per_unit) === null) errors["costs.rework_hours_per_unit"] = "Required";
    if (num(c.blended_hourly_rate) === null) errors["costs.blended_hourly_rate"] = "Required";
    if (num(c.downtime_hours) === null) errors["costs.downtime_hours"] = "Required";
    if (num(c.machine_hourly_rate) === null) errors["costs.machine_hourly_rate"] = "Required";
    if (num(c.expedite_or_delay_cost) === null) errors["costs.expedite_or_delay_cost"] = "Required";
    if (num(c.scrap_probability) === null) errors["costs.scrap_probability"] = "Required";
    if (num(c.rework_probability) === null) errors["costs.rework_probability"] = "Required";

    const sp = num(c.scrap_probability);
    if (sp !== null && (sp < 0 || sp > 1)) errors["costs.scrap_probability"] = "Must be between 0 and 1";
    const rp = num(c.rework_probability);
    if (rp !== null && (rp < 0 || rp > 1)) errors["costs.rework_probability"] = "Must be between 0 and 1";

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setResult(null);
    setServerError(null);

    const dt = form.domain_id ? getDomainType(form.domain_id) : "dimensional";

    const body = {
      domain_id: form.domain_id,
      problem_context: form.problem_context.trim(),
      measurements: [
        {
          measured_value: parseFloat(form.measurement.measured_value),
          nominal_value: dt === "dimensional"
            ? parseFloat(form.measurement.nominal_value)
            : parseFloat(form.measurement.measured_value) * 0.5,
          tolerance_plus: dt === "dimensional"
            ? parseFloat(form.measurement.tolerance_plus)
            : parseFloat(form.measurement.measured_value) * 0.1,
          tolerance_minus: dt === "dimensional"
            ? parseFloat(form.measurement.tolerance_minus)
            : parseFloat(form.measurement.measured_value) * 0.1,
          unit: form.measurement.unit.trim(),
          measurement_tool: form.measurement.measurement_tool,
          calibration_status: form.measurement.calibration_status,
          part_condition: form.measurement.part_condition.trim(),
        },
      ],
      costs: {
        affected_quantity: parseFloat(form.costs.affected_quantity),
        material_cost_per_unit: parseFloat(form.costs.material_cost_per_unit),
        rework_hours_per_unit: parseFloat(form.costs.rework_hours_per_unit),
        blended_hourly_rate: parseFloat(form.costs.blended_hourly_rate),
        downtime_hours: parseFloat(form.costs.downtime_hours),
        machine_hourly_rate: parseFloat(form.costs.machine_hourly_rate),
        expedite_or_delay_cost: parseFloat(form.costs.expedite_or_delay_cost),
        scrap_probability: parseFloat(form.costs.scrap_probability),
        rework_probability: parseFloat(form.costs.rework_probability),
        probability_source: form.costs.probability_source,
      },
      privacy_mode: form.privacy_mode,
    };

    try {
      const res = await fetch("/api/engineering-diagnostics/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      lastRequestBodyRef.current = body;

      const data: DiagnosticResult = await res.json();

      if (!res.ok) {
        if (data.issues) {
          const fieldErrors2: FieldErrors = {};
          for (const issue of data.issues) {
            fieldErrors2[issue.path] = issue.message;
          }
          setFieldErrors(fieldErrors2);
        } else {
          setServerError(data.error || "Request failed. Please review inputs and try again.");
        }
        setLoading(false);
        return;
      }

      setResult(data);
    } catch {
      setServerError("Unable to reach the diagnostic service. Please try again.");
    }
    setLoading(false);
  }

  /* ── Result Panel ── */

  function renderResult() {
    if (!result) return null;

    /* ── Gated Preview (free, no commercial value) ── */
    if (isGatedPreview(result)) {
      const bandBadge = riskBandBadge(result.preview.risk_band);
      return (
        <div style={{ marginTop: "2.5rem" }}>
          {/* Risk Band Banner */}
          <div
            style={{
              padding: "1.25rem 1.5rem",
              borderRadius: "8px",
              background: bandBadge.bg,
              border: `1px solid ${bandBadge.fg}`,
              marginBottom: "1.5rem",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "0.75rem",
              }}
            >
              <div>
                <div style={{ fontSize: "0.8rem", color: "#6B6B68", marginBottom: "0.25rem" }}>
                  Engineering Risk Assessment
                </div>
                <div style={{ fontSize: "1.25rem", fontWeight: 700, color: bandBadge.fg }}>
                  {result.preview.risk_band_label}
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "0.8rem", color: "#6B6B68", marginBottom: "0.25rem" }}>
                  Condition
                </div>
                <div style={{ fontSize: "1.25rem", fontWeight: 600, color: bandBadge.fg }}>
                  {result.preview.risk_band}
                </div>
              </div>
            </div>
          </div>

          {/* Domain Info */}
          <Card title="Detected Domain">
            <InfoRow label="Domain" value={result.preview.domain_detected} />
            <InfoRow label="Category" value={result.preview.domain_category} />
          </Card>

          {/* Brief Explanation */}
          <Card title="Summary">
            <p style={{ lineHeight: 1.6, color: "#3A3A38", margin: 0 }}>
              {result.preview.brief_explanation}
            </p>
          </Card>

          {/* Upgrade CTA */}
          <div
            style={{
              marginTop: "1.5rem",
              padding: "1.5rem",
              background: "linear-gradient(135deg, #F0EEE6 0%, #E8E6DE 100%)",
              border: "2px solid #BD5D3A",
              borderRadius: "12px",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "#1A1915", marginBottom: "0.5rem" }}>
              Unlock Full Engineering Diagnostic
            </div>
            <div style={{ fontSize: "0.9rem", color: "#6B6B68", lineHeight: 1.5, marginBottom: "1rem" }}>
              Get the complete analysis including root cause hypotheses, cost exposure,
              corrective action plan, and professional report with AI interpretation.
            </div>
            <div style={{ fontSize: "0.85rem", color: "#BD5D3A", fontWeight: 600, marginBottom: "1rem" }}>
              5 Credits &middot; 3 Full Diagnostics included
            </div>
            <Link
              href="/pricing"
              style={{
                display: "inline-block",
                padding: "0.8rem 2rem",
                background: "#BD5D3A",
                color: "#fff",
                borderRadius: "8px",
                textDecoration: "none",
                fontWeight: 600,
                fontSize: "1rem",
                minHeight: "48px",
                lineHeight: "48px",
              }}
            >
              Get Diagnostic Credits
            </Link>
          </div>

          {/* Manual Inspection Reminder */}
          <div
            style={{
              marginTop: "1rem",
              padding: "1rem 1.25rem",
              background: "#FFF9F0",
              border: "1px solid #E8D5B5",
              borderRadius: "8px",
              fontSize: "0.85rem",
              color: "#6B6B68",
              lineHeight: 1.6,
            }}
          >
            <strong>Important:</strong> This is a preliminary engineering assessment. A qualified
            professional must perform an on-site inspection before any production decision is made.
            The full diagnostic report includes engineering reasoning, root cause analysis, and a
            corrective action plan.
          </div>
        </div>
      );
    }

    /* ── Full Deterministic Result (authenticated + entitled) ── */
    const dec = result.decision;
    const dBadge = decisionBadgeClass(dec.decision);

    return (
      <div style={{ marginTop: "2.5rem" }}>
        {/* Decision Banner */}
        <div
          style={{
            padding: "1.25rem 1.5rem",
            borderRadius: "8px",
            background: dBadge.background,
            border: `1px solid ${dBadge.color}`,
            marginBottom: "1.5rem",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "0.75rem",
            }}
          >
            <div>
              <div style={{ fontSize: "0.8rem", color: "#6B6B68", marginBottom: "0.25rem" }}>
                Decision State
              </div>
              <div style={{ fontSize: "1.25rem", fontWeight: 700, color: dBadge.color }}>
                {dec.decision.replace(/_/g, " ")}
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "0.8rem", color: "#6B6B68", marginBottom: "0.25rem" }}>
                Risk Score
              </div>
              <div style={{ fontSize: "1.5rem", fontWeight: 700, color: dBadge.color }}>
                {dec.total_risk_score}/100
              </div>
            </div>
          </div>
          {dec.mandatory_floor_applied && (
            <div
              style={{
                marginTop: "0.75rem",
                padding: "0.5rem 0.75rem",
                background: "#FFF0D6",
                borderRadius: "6px",
                fontSize: "0.85rem",
                color: "#A16A23",
              }}
            >
              Measurement uncertainty triggered mandatory minimum decision floor: STOP_AND_INSPECT
            </div>
          )}
        </div>

        {/* Domain Info */}
        <Card title="Domain">
          <InfoRow label="Domain" value={result.domain.label} />
          <InfoRow label="Category" value={result.domain.category === "core" ? "Core Engineering" : "Advisory"} />
          <InfoRow label="Process" value={result.domain.context.process_description} />
          <InfoRow label="Typical Tolerances" value={result.domain.context.typical_tolerances} />
        </Card>

        {/* Measurement Results */}
        <Card title="Measurement Confidence">
          {result.measurement_results.map((mr) => {
            const tb = toleranceStatusBadgeClass(mr.tolerance_status);
            const cb = confidenceBadgeClass(mr.confidence_class);
            return (
              <div key={mr.index} style={{ marginBottom: "0.75rem" }}>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "0.5rem",
                    marginBottom: "0.5rem",
                  }}
                >
                  <Badge style={{ background: tb.bg, color: tb.fg }}>Status: {tb.label}</Badge>
                  <Badge style={cb}>Confidence: {mr.confidence_class}</Badge>
                </div>
                <InfoRow label="Tool" value={mr.input_summary.tool} />
                <InfoRow label="Measured / Nominal" value={`${mr.input_summary.measured_value} / ${mr.input_summary.nominal_value} ${mr.input_summary.unit}`} />
                <InfoRow label="Expanded Uncertainty (k=2)" value={`${mr.expanded_uncertainty_k2.toFixed(4)} ${mr.input_summary.unit}`} />
                {mr.mandatory_decision_floor && (
                  <InfoRow label="Mandatory Floor" value={mr.mandatory_decision_floor} />
                )}
              </div>
            );
          })}
        </Card>

        {/* Cost at Risk */}
        <Card title="Cost at Risk">
          <InfoRow label="Estimated Cost at Risk" value={`$${result.cost_at_risk.total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} />
          <InfoRow label="Probability Source" value={result.cost_at_risk.probability_source === "DEFAULT_TABLE" ? "Industry Default Table" : "User-Adjusted"} />
          <div style={{ fontSize: "0.85rem", color: "#6B6B68", marginTop: "0.5rem" }}>
            <strong>Assumptions:</strong>
            <ul style={{ margin: "0.25rem 0 0", paddingLeft: "1.25rem", lineHeight: 1.5 }}>
              {result.cost_at_risk.assumptions.map((a, i) => (
                <li key={i}>{a}</li>
              ))}
            </ul>
          </div>
        </Card>

        {/* Risk Breakdown */}
        <Card title="Risk Score Breakdown">
          {([
            ["Measurement Risk", dec.breakdown.measurement_risk, 25],
            ["Confidence Risk", dec.breakdown.confidence_risk, 15],
            ["Visual Advisory Risk", dec.breakdown.visual_advisory_risk, 30],
            ["Exposure Risk", dec.breakdown.exposure_risk, 15],
            ["Cost Risk", dec.breakdown.cost_risk, 10],
            ["Manual Check Risk", dec.breakdown.manual_check_risk, 5],
          ] as const).map(([label, score, maxVal]) => (
            <RiskBar key={label} label={label} score={score} maxVal={maxVal} />
          ))}
        </Card>

        {/* Action Plan */}
        <Card title="Action Plan">
          <ActionGroup title="Containment" items={result.action_plan.containment} />
          <ActionGroup title="Temporary Fix" items={result.action_plan.temporary_fix} />
          <ActionGroup title="Permanent Corrective Action" items={result.action_plan.permanent_corrective_action} />
          <ActionGroup title="Required Manual Checks" items={result.action_plan.required_manual_checks} />
        </Card>

        {/* Audit Log */}
        <Card title="Audit Log">
          <div
            style={{
              background: "#1A1915",
              color: "#D6D4CC",
              padding: "0.75rem 1rem",
              borderRadius: "6px",
              fontSize: "0.75rem",
              fontFamily: "monospace",
              lineHeight: 1.6,
              maxHeight: "200px",
              overflowY: "auto",
              whiteSpace: "pre-wrap",
            }}
          >
            {result.audit_log.map((line, i) => (
              <div key={i}>{line}</div>
            ))}
          </div>
        </Card>

        {/* Disclaimer */}
        <div
          style={{
            padding: "1rem 1.25rem",
            background: "#FFF9F0",
            border: "1px solid #E8D5B5",
            borderRadius: "8px",
            fontSize: "0.85rem",
            color: "#6B6B68",
            lineHeight: 1.6,
            marginTop: "1rem",
          }}
        >
          {result.disclaimer}
        </div>

        {/* Create Report Preview (requires auth + entitlement) */}
        <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
          <button
            onClick={async () => {
              setPreviewError(null);
              setPreviewLoading(true);
              try {
                const token = await getCurrentUserIdToken();
                if (!token) {
                  setPreviewError("Please sign in to create a report preview.");
                  setPreviewLoading(false);
                  return;
                }
                const res = await fetch("/api/engineering-diagnostics/report-preview", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                  },
                  body: JSON.stringify(lastRequestBodyRef.current),
                });
                const data = await res.json();
                if (!res.ok || !data.ok) {
                  if (res.status === 402) {
                    setPreviewError("Diagnostic credits required for report generation.");
                  } else {
                    setPreviewError(data.error || "Failed to create report preview.");
                  }
                  setPreviewLoading(false);
                  return;
                }
                const report = data.report;
                const reportId = report.report_id;
                try {
                  sessionStorage.setItem("ediag_report_" + reportId, JSON.stringify(report));
                } catch {
                  // sessionStorage may be full or unavailable; navigate anyway
                }
                setPreviewLoading(false);
                router.push("/engineering-diagnostics/reports/" + encodeURIComponent(reportId));
              } catch {
                setPreviewError("Unable to create report preview. Please try again.");
                setPreviewLoading(false);
              }
            }}
            disabled={previewLoading}
            style={{
              padding: "0.9rem 2rem",
              background: previewLoading ? "#D6D4CC" : "#1A1915",
              color: previewLoading ? "#6B6B68" : "#fff",
              border: "none",
              borderRadius: "8px",
              fontSize: "1rem",
              fontWeight: 600,
              cursor: previewLoading ? "not-allowed" : "pointer",
              minHeight: "48px",
              transition: "background 0.13s",
            }}
          >
            {previewLoading ? "Creating Report Preview..." : "Create Report Preview"}
          </button>
          {previewError && (
            <div
              style={{
                marginTop: "0.75rem",
                padding: "0.5rem 0.75rem",
                background: "#F5D6D6",
                borderRadius: "6px",
                fontSize: "0.85rem",
                color: "#A12323",
              }}
            >
              {previewError}
            </div>
          )}
        </div>

        {/* Full Engineering Diagnostic */}
        <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
          {(remainingUses !== null && remainingUses > 0) || remainingUses === null ? (
            <>
              <button
                onClick={async () => {
                  setFullDiagError(null);
                  setFullDiagLoading(true);
                  try {
                    const token = await getCurrentUserIdToken();
                    if (!token) {
                      setFullDiagError("Please sign in to generate a Full Diagnostic.");
                      setFullDiagLoading(false);
                      return;
                    }
                    const res = await fetch("/api/engineering-diagnostics/full-diagnostic", {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                      },
                      body: JSON.stringify({
                        ...(lastRequestBodyRef.current as Record<string, unknown>),
                        photos: photos.map((p) => p.data),
                      }),
                    });
                    const data = await res.json();
                    if (!res.ok || !data.ok) {
                      if (data.error === "INSUFFICIENT_DIAGNOSTIC_CREDITS") {
                        setFullDiagError(data.message || "Diagnostic credits required.");
                      } else {
                        setFullDiagError(data.error || "Failed to generate Full Diagnostic.");
                      }
                      setFullDiagLoading(false);
                      return;
                    }
                    if (data.report) {
                      try {
                        sessionStorage.setItem("ediag_report_" + data.report_id, JSON.stringify(data.report));
                      } catch {
                        // sessionStorage may be full
                      }
                    }
                    setFullDiagLoading(false);
                    router.push("/engineering-diagnostics/reports/" + encodeURIComponent(data.report_id));
                  } catch {
                    setFullDiagError("Unable to generate Full Diagnostic. Please try again.");
                    setFullDiagLoading(false);
                  }
                }}
                disabled={fullDiagLoading}
                style={{
                  padding: "0.9rem 2rem",
                  background: fullDiagLoading ? "#D6D4CC" : "#BD5D3A",
                  color: fullDiagLoading ? "#6B6B68" : "#fff",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "1rem",
                  fontWeight: 600,
                  cursor: fullDiagLoading ? "not-allowed" : "pointer",
                  minHeight: "48px",
                  transition: "background 0.13s",
                }}
              >
                {fullDiagLoading ? "Generating Full Diagnostic..." : "Generate Full Engineering Diagnostic"}
              </button>
              {remainingUses !== null && remainingUses > 0 && (
                <div style={{ fontSize: "0.8rem", color: "#6B6B68", marginTop: "0.4rem" }}>
                  {remainingUses} Full Diagnostic use{remainingUses > 1 ? "s" : ""} remaining
                </div>
              )}
            </>
          ) : (
            <div
              style={{
                padding: "1rem 1.25rem",
                background: "#FFF0D6",
                border: "1px solid #E8D4A0",
                borderRadius: "8px",
                color: "#8A7A23",
                fontSize: "0.9rem",
                lineHeight: 1.5,
              }}
            >
              <div style={{ fontWeight: 600, marginBottom: "0.25rem" }}>Diagnostic Credits Required</div>
              <div style={{ fontSize: "0.85rem" }}>
                You need Diagnostic Credits to generate a Full Engineering Diagnostic.
              </div>
              <Link
                href="/pricing"
                style={{
                  display: "inline-block",
                  marginTop: "0.75rem",
                  padding: "0.5rem 1.25rem",
                  background: "#BD5D3A",
                  color: "#fff",
                  borderRadius: "6px",
                  textDecoration: "none",
                  fontWeight: 600,
                  fontSize: "0.85rem",
                }}
              >
                Get Diagnostic Credits
              </Link>
            </div>
          )}
        </div>

        {fullDiagError && (
          <div
            style={{
              marginTop: "0.75rem",
              padding: "0.5rem 0.75rem",
              background: "#F5D6D6",
              borderRadius: "6px",
              fontSize: "0.85rem",
              color: "#A12323",
            }}
          >
            {fullDiagError}
          </div>
        )}

        {/* Download as JSON (auth-gated) */}
        <div style={{ textAlign: "center", marginTop: "1rem" }}>
          <button
            onClick={() => {
              if (!result) return;
              const blob = new Blob([JSON.stringify(result, null, 2)], { type: "application/json" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = `diagnostic-result-${result.domain.id}-${Date.now()}.json`;
              a.click();
              URL.revokeObjectURL(url);
            }}
            style={{
              background: "none",
              border: "1px solid #6B6B68",
              color: "#6B6B68",
              padding: "0.5rem 1.25rem",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "0.85rem",
            }}
          >
            Download Result as JSON
          </button>
        </div>

        {/* Back to top */}
        <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
          <button
            onClick={() => {
              setResult(null);
              clearAutosave();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            style={{
              background: "none",
              border: "1px solid #BD5D3A",
              color: "#BD5D3A",
              padding: "0.6rem 1.5rem",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "0.9rem",
            }}
          >
            Start Another Diagnostic
          </button>
        </div>
      </div>
    );
  }

  /* ── Render ── */

  return (
    <PageLayout>
      <section
        className="sc-pro-section sc-pro-section--border"
        style={{ padding: "4rem 1.5rem" }}
      >
        <div style={{ maxWidth: "720px", margin: "0 auto" }}>
          <Link
            href="/engineering-diagnostics"
            style={{
              fontSize: "0.85rem",
              color: "#BD5D3A",
              textDecoration: "none",
              display: "inline-block",
              marginBottom: "1.5rem",
            }}
          >
            &larr; Back to Engineering Diagnostics
          </Link>

          <h1
            style={{
              fontSize: "1.5rem",
              fontWeight: 600,
              marginBottom: "0.5rem",
              color: "#1A1915",
            }}
          >
            Start New Diagnostic
          </h1>
          <p
            style={{
              fontSize: "0.95rem",
              lineHeight: 1.6,
              color: "#4A4A48",
              marginBottom: "1.5rem",
            }}
          >
            Choose how you want to start. Upload photos for a quick visual
            assessment or enter full measurement data for a complete engineering
            diagnostic report.
          </p>

          {/* Entry Mode Selection */}
          {!entryMode && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1rem",
                marginBottom: "2rem",
              }}
            >
              {/* Photo Preview Option */}
              <button
                onClick={() => setEntryMode("photo")}
                style={{
                  padding: "1.5rem",
                  background: "#F0EEE6",
                  border: "2px solid #D6D4CC",
                  borderRadius: "12px",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "border-color 0.13s",
                  minHeight: "160px",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div
                  style={{
                    fontSize: "1.8rem",
                    marginBottom: "0.75rem",
                    color: "#6B6B68",
                  }}
                >
                  📷
                </div>
                <div style={{ fontSize: "1.1rem", fontWeight: 600, color: "#1A1915", marginBottom: "0.4rem" }}>
                  Start with Photos
                </div>
                <div style={{ fontSize: "0.85rem", color: "#4A4A48", lineHeight: 1.5, flex: 1 }}>
                  Get a preliminary visual assessment and learn what data is
                  needed for a full engineering report.
                </div>
                <div
                  style={{
                    marginTop: "0.75rem",
                    fontSize: "0.75rem",
                    color: "#6B6B68",
                    fontStyle: "italic",
                  }}
                >
                  No credit required
                </div>
              </button>

              {/* Full Diagnostic Option */}
              <button
                onClick={() => setEntryMode("full")}
                style={{
                  padding: "1.5rem",
                  background: "#FFF9F0",
                  border: "2px solid #BD5D3A",
                  borderRadius: "12px",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "border-color 0.13s",
                  minHeight: "160px",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div
                  style={{
                    fontSize: "1.8rem",
                    marginBottom: "0.75rem",
                    color: "#6B6B68",
                  }}
                >
                  ⚙️
                </div>
                <div style={{ fontSize: "1.1rem", fontWeight: 600, color: "#1A1915", marginBottom: "0.4rem" }}>
                  Create Full Engineering Diagnostic
                </div>
                <div style={{ fontSize: "0.85rem", color: "#4A4A48", lineHeight: 1.5, flex: 1 }}>
                  Add photos, measurements, tolerances, cost exposure, and
                  context to generate a professional report.
                </div>
                <div
                  style={{
                    marginTop: "0.75rem",
                    fontSize: "0.75rem",
                    color: "#BD5D3A",
                    fontWeight: 600,
                  }}
                >
                  1 credit per diagnostic
                </div>
              </button>
            </div>
          )}

          {/* Back button when mode selected */}
          {entryMode && (
            <button
              onClick={() => { setEntryMode(null); setResult(null); }}
              style={{
                background: "none",
                border: "none",
                color: "#BD5D3A",
                fontSize: "0.85rem",
                cursor: "pointer",
                padding: 0,
                marginBottom: "1.5rem",
                display: "inline-block",
                textDecoration: "underline",
              }}
            >
              &larr; Choose Different Mode
            </button>
          )}

          {/* Photo Preview Mode */}
          {entryMode === "photo" && <CameraOnlyPreview />}

          {/* Professional Diagnostic Package (shown only in full mode) */}
          {entryMode === "full" && (
            <div
              style={{
                padding: "1.25rem",
                background: "#F0EEE6",
                border: "1px solid #D6D4CC",
                borderRadius: "8px",
                marginBottom: "1.5rem",
              }}
            >
              <div style={{ fontSize: "0.9rem", color: "#1A1915", fontWeight: 600, marginBottom: "0.5rem" }}>
                Professional Diagnostic Package
              </div>
              <div style={{ fontSize: "0.85rem", color: "#4A4A48", lineHeight: 1.6, marginBottom: "0.75rem" }}>
                Engineering Diagnostics is a professional report service. A 5-credit
                package includes 3 Full Engineering Diagnostics. Each Full Diagnostic
                includes AI-assisted engineering interpretation, deterministic risk
                assessment, action planning, PDF export, audit trail, and verification
                record.
              </div>
              <div style={{ fontSize: "0.8rem", color: "#6B6B68", lineHeight: 1.5, marginBottom: "0.75rem" }}>
                Preview analysis may be available before export. Camera/photo-based
                interpretation, Full Diagnostic report generation, PDF export,
                verification record, and report history require available Diagnostic
                Credits.
              </div>
              <div style={{ textAlign: "right" }}>
                <Link
                  href="/pricing"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    padding: "0.5rem 1.25rem",
                    background: "#BD5D3A",
                    color: "#fff",
                    borderRadius: "6px",
                    textDecoration: "none",
                    fontWeight: 600,
                    fontSize: "0.85rem",
                    transition: "background 0.13s",
                  }}
                >
                  Get Diagnostic Credits
                </Link>
              </div>
            </div>
          )}

          {/* Loading skeleton during Full Diagnostic generation */}
          {entryMode === "full" && fullDiagLoading && (
            <div style={{ marginBottom: "1.5rem", padding: "2rem", borderRadius: "12px", border: "1px solid #D6D4CC", background: "#F0EEE6" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem", alignItems: "center" }}>
                <div style={{ width: "48px", height: "48px", border: "3px solid #D6D4CC", borderTopColor: "#BD5D3A", borderRadius: "50%", animation: "diagSpin 0.8s linear infinite" }} />
                <div style={{ fontSize: "1rem", fontWeight: 600, color: "#1A1915" }}>Generating Full Engineering Diagnostic</div>
                <div style={{ fontSize: "0.85rem", color: "#6B6B68", textAlign: "center", maxWidth: "400px" }}>
                  Processing photos, analyzing measurements, calculating risk scores, running AI interpretation, and building your professional diagnostic report.
                </div>
                <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", justifyContent: "center" }}>
                  {["Photo Processing", "Domain Analysis", "Uncertainty Check", "Cost at Risk", "AI Interpretation", "Action Plan", "Report Generation"].map((step) => (
                    <div key={step} style={{ display: "flex", alignItems: "center", gap: "0.35rem", padding: "0.3rem 0.7rem", background: "#E8E6DE", borderRadius: "20px", fontSize: "0.75rem", color: "#4A4A48" }}>
                      <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#BD5D3A", animation: "diagPulse 1.2s ease-in-out infinite" }} />
                      {step}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          <style>{`@keyframes diagSpin { to { transform: rotate(360deg); } } @keyframes diagPulse { 0%, 100% { opacity: 0.4; } 50% { opacity: 1; } }`}</style>

          {entryMode === "full" && !result && (
            <form onSubmit={handleSubmit} noValidate>
              {/* Domain */}
              <FieldSet legend="Domain & Context">
                <FieldRow>
                  <Field label="Domain" error={fieldErrors.domain_id} required>
                    <select
                      value={form.domain_id}
                      onChange={(e) => setField("domain_id", e.target.value)}
                      style={selectStyle}
                    >
                      {DOMAIN_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Privacy Mode">
                    <select
                      value={form.privacy_mode}
                      onChange={(e) => setField("privacy_mode", e.target.value)}
                      style={selectStyle}
                    >
                      {PRIVACY_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    {form.privacy_mode === "reduced_retention" && (
                      <div
                        style={{
                          marginTop: "0.4rem",
                          fontSize: "0.8rem",
                          color: "#8A7A23",
                          background: "#FFF8D6",
                          padding: "0.4rem 0.6rem",
                          borderRadius: "4px",
                          lineHeight: 1.4,
                        }}
                      >
                        Photos are not stored on servers. Only image hashes, report metadata,
                        and required verification records are retained. Full diagnostics with
                        AI interpretation are always processed server-side.
                      </div>
                    )}
                  </Field>
                </FieldRow>
                <Field label="Problem Context" error={fieldErrors.problem_context} required>
                  <textarea
                    value={form.problem_context}
                    onChange={(e) => setField("problem_context", e.target.value)}
                    placeholder="Describe the issue you are investigating. Include relevant process details, symptoms, and any preliminary observations."
                    rows={3}
                    style={{ ...inputStyle, resize: "vertical", minHeight: "80px" }}
                  />
                </Field>
              </FieldSet>

              {/* Photo Evidence */}
              <div
                style={{
                  padding: "1.25rem",
                  background: "#F0EEE6",
                  border: "1px solid #D6D4CC",
                  borderRadius: "8px",
                  marginBottom: "1rem",
                }}
              >
                <PhotoUpload
                  photos={photos}
                  onPhotosChange={setPhotos}
                  disabled={loading}
                  accessGated={remainingUses !== null && remainingUses <= 0}
                />
              </div>

              {/* Measurement */}
              <FieldSet legend="Measurement">
                <div style={{ fontSize: "0.8rem", color: "#BD5D3A", marginBottom: "0.75rem", fontWeight: 500 }}>
                  {form.domain_id ? getDomainLabels(form.domain_id).toolPlaceholder : "Select a domain above"}
                </div>
                {(function() {
                  const labels = form.domain_id ? getDomainLabels(form.domain_id) : getDomainLabels("");
                  return (
                    <>
                      <FieldRow>
                        <Field label={labels.measuredLabel} error={fieldErrors["measurement.measured_value"]} required>
                          <input
                            type="number"
                            step="any"
                            value={form.measurement.measured_value}
                            onChange={(e) => setField("measurement.measured_value", e.target.value)}
                            style={inputStyle}
                          />
                        </Field>
                        {labels.showNominalTolerance && (
                          <Field label={labels.nominalLabel} error={fieldErrors["measurement.nominal_value"]} required>
                            <input
                              type="number"
                              step="any"
                              value={form.measurement.nominal_value}
                              onChange={(e) => setField("measurement.nominal_value", e.target.value)}
                              style={inputStyle}
                            />
                          </Field>
                        )}
                      </FieldRow>
                      {labels.showNominalTolerance && (
                        <FieldRow>
                          <Field label={labels.tolerancePlusLabel} error={fieldErrors["measurement.tolerance_plus"]} required>
                            <input
                              type="number"
                              step="any"
                              value={form.measurement.tolerance_plus}
                              onChange={(e) => setField("measurement.tolerance_plus", e.target.value)}
                              style={inputStyle}
                            />
                          </Field>
                          <Field label={labels.toleranceMinusLabel} error={fieldErrors["measurement.tolerance_minus"]} required>
                            <input
                              type="number"
                              step="any"
                              value={form.measurement.tolerance_minus}
                              onChange={(e) => setField("measurement.tolerance_minus", e.target.value)}
                              style={inputStyle}
                            />
                          </Field>
                        </FieldRow>
                      )}
                      <FieldRow>
                        <Field label="Unit" error={fieldErrors["measurement.unit"]} required>
                          <input
                            type="text"
                            value={form.measurement.unit}
                            onChange={(e) => setField("measurement.unit", e.target.value)}
                            placeholder={labels.unitPlaceholder}
                            style={inputStyle}
                          />
                        </Field>
                        <Field label="Measurement Tool" required>
                          <select
                            value={form.measurement.measurement_tool}
                            onChange={(e) => setField("measurement.measurement_tool", e.target.value)}
                            style={selectStyle}
                          >
                            {MEASUREMENT_TOOL_OPTIONS.map((opt) => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                        </Field>
                      </FieldRow>
                      <FieldRow>
                        <Field label="Calibration Status" required>
                          <select
                            value={form.measurement.calibration_status}
                            onChange={(e) => setField("measurement.calibration_status", e.target.value)}
                            style={selectStyle}
                          >
                            {CALIBRATION_OPTIONS.map((opt) => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                        </Field>
                        <Field label={labels.conditionLabel} error={fieldErrors["measurement.part_condition"]} required>
                          <input
                            type="text"
                            value={form.measurement.part_condition}
                            onChange={(e) => setField("measurement.part_condition", e.target.value)}
                            placeholder="e.g. good, worn, rough surface"
                            style={inputStyle}
                          />
                        </Field>
                      </FieldRow>
                    </>
                  );
                })()}
              </FieldSet>

              {/* Costs */}
              <FieldSet legend="Costs">
                <FieldRow>
                  <Field label="Affected Quantity" error={fieldErrors["costs.affected_quantity"]} required>
                    <input
                      type="number"
                      min="0"
                      step="any"
                      value={form.costs.affected_quantity}
                      onChange={(e) => setField("costs.affected_quantity", e.target.value)}
                      style={inputStyle}
                    />
                  </Field>
                  <Field label="Material Cost / Unit" error={fieldErrors["costs.material_cost_per_unit"]} required>
                    <input
                      type="number"
                      min="0"
                      step="any"
                      value={form.costs.material_cost_per_unit}
                      onChange={(e) => setField("costs.material_cost_per_unit", e.target.value)}
                      style={inputStyle}
                    />
                  </Field>
                </FieldRow>
                <FieldRow>
                  <Field label="Rework Hours / Unit" error={fieldErrors["costs.rework_hours_per_unit"]} required>
                    <input
                      type="number"
                      min="0"
                      step="any"
                      value={form.costs.rework_hours_per_unit}
                      onChange={(e) => setField("costs.rework_hours_per_unit", e.target.value)}
                      style={inputStyle}
                    />
                  </Field>
                  <Field label="Hourly Rate (blended)" error={fieldErrors["costs.blended_hourly_rate"]} required>
                    <input
                      type="number"
                      min="0"
                      step="any"
                      value={form.costs.blended_hourly_rate}
                      onChange={(e) => setField("costs.blended_hourly_rate", e.target.value)}
                      style={inputStyle}
                    />
                  </Field>
                </FieldRow>
                <FieldRow>
                  <Field label="Downtime Hours" error={fieldErrors["costs.downtime_hours"]} required>
                    <input
                      type="number"
                      min="0"
                      step="any"
                      value={form.costs.downtime_hours}
                      onChange={(e) => setField("costs.downtime_hours", e.target.value)}
                      style={inputStyle}
                    />
                  </Field>
                  <Field label="Machine Rate / Hour" error={fieldErrors["costs.machine_hourly_rate"]} required>
                    <input
                      type="number"
                      min="0"
                      step="any"
                      value={form.costs.machine_hourly_rate}
                      onChange={(e) => setField("costs.machine_hourly_rate", e.target.value)}
                      style={inputStyle}
                    />
                  </Field>
                </FieldRow>
                <Field label="Expedite / Delay Cost" error={fieldErrors["costs.expedite_or_delay_cost"]} required>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={form.costs.expedite_or_delay_cost}
                    onChange={(e) => setField("costs.expedite_or_delay_cost", e.target.value)}
                    style={inputStyle}
                  />
                </Field>
                <FieldRow>
                  <Field
                    label="Scrap Probability (0-1)"
                    error={fieldErrors["costs.scrap_probability"]}
                    required
                  >
                    <input
                      type="number"
                      min="0"
                      max="1"
                      step="0.01"
                      value={form.costs.scrap_probability}
                      onChange={(e) => setField("costs.scrap_probability", e.target.value)}
                      style={inputStyle}
                    />
                  </Field>
                  <Field
                    label="Rework Probability (0-1)"
                    error={fieldErrors["costs.rework_probability"]}
                    required
                  >
                    <input
                      type="number"
                      min="0"
                      max="1"
                      step="0.01"
                      value={form.costs.rework_probability}
                      onChange={(e) => setField("costs.rework_probability", e.target.value)}
                      style={inputStyle}
                    />
                  </Field>
                </FieldRow>
                <Field label="Probability Source" required>
                  <select
                    value={form.costs.probability_source}
                    onChange={(e) => setField("costs.probability_source", e.target.value)}
                    style={selectStyle}
                  >
                    {PROB_SOURCE_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </Field>
              </FieldSet>

              {/* Server Error */}
              {serverError && (
                <div
                  style={{
                    padding: "0.75rem 1rem",
                    background: "#F5D6D6",
                    border: "1px solid #D99A9A",
                    borderRadius: "6px",
                    color: "#A12323",
                    fontSize: "0.9rem",
                    marginBottom: "1rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "0.75rem",
                    flexWrap: "wrap",
                  }}
                >
                  <span>{serverError}</span>
                  <button
                    onClick={() => { setServerError(null); }}
                    style={{
                      background: "#A12323",
                      color: "#fff",
                      border: "none",
                      borderRadius: "4px",
                      padding: "0.4rem 0.8rem",
                      fontSize: "0.8rem",
                      cursor: "pointer",
                      fontWeight: 600,
                      whiteSpace: "nowrap",
                    }}
                  >
                    Retry
                  </button>
                </div>
              )}

              {/* Submit */}
              <div style={{ textAlign: "center", marginTop: "2rem" }}>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    padding: "0.9rem 2.5rem",
                    background: loading ? "#D6D4CC" : "#BD5D3A",
                    color: loading ? "#6B6B68" : "#fff",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "1rem",
                    fontWeight: 600,
                    cursor: loading ? "not-allowed" : "pointer",
                    transition: "background 0.13s",
                    minHeight: "48px",
                  }}
                >
                  {loading ? "Running Diagnostic Analysis..." : "Run Diagnostic Analysis"}
                </button>
              </div>
            </form>
          )}

          {renderResult()}
        </div>
      </section>
    </PageLayout>
  );
}

/* ── Sub-components ── */

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div
      style={{
        padding: "1.25rem",
        background: "#F0EEE6",
        border: "1px solid #D6D4CC",
        borderRadius: "8px",
        marginBottom: "1rem",
      }}
    >
      <h3
        style={{
          fontSize: "0.95rem",
          fontWeight: 600,
          color: "#BD5D3A",
          marginBottom: "0.75rem",
          marginTop: 0,
        }}
      >
        {title}
      </h3>
      {children}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        display: "flex",
        gap: "0.5rem",
        fontSize: "0.85rem",
        lineHeight: 1.6,
        marginBottom: "0.25rem",
      }}
    >
      <span style={{ color: "#6B6B68", minWidth: "140px", flexShrink: 0 }}>{label}:</span>
      <span style={{ color: "#1A1915" }}>{value}</span>
    </div>
  );
}

function Badge({
  style: badgeStyle,
  children,
}: {
  style: { background: string; color: string };
  children: React.ReactNode;
}) {
  return (
    <span
      style={{
        display: "inline-block",
        padding: "0.2rem 0.6rem",
        borderRadius: "4px",
        fontSize: "0.8rem",
        fontWeight: 600,
        ...badgeStyle,
      }}
    >
      {children}
    </span>
  );
}

function RiskBar({
  label,
  score,
  maxVal,
}: {
  label: string;
  score: number;
  maxVal: number;
}) {
  const pct = Math.min((score / maxVal) * 100, 100);
  const fillColor =
    pct >= 80 ? "#A12323" : pct >= 50 ? "#A16A23" : "#238A23";
  return (
    <div style={{ marginBottom: "0.6rem" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: "0.85rem",
          marginBottom: "0.2rem",
        }}
      >
        <span style={{ color: "#6B6B68" }}>{label}</span>
        <span style={{ color: "#1A1915", fontWeight: 600 }}>
          {score}/{maxVal}
        </span>
      </div>
      <div
        style={{
          height: "8px",
          background: "#D6D4CC",
          borderRadius: "4px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${pct}%`,
            background: fillColor,
            borderRadius: "4px",
            transition: "width 0.3s",
          }}
        />
      </div>
    </div>
  );
}

function ActionGroup({
  title,
  items,
}: {
  title: string;
  items: Array<{
    action: string;
    responsible_role: string;
    priority: string;
    estimated_duration: string;
  }>;
}) {
  if (items.length === 0) return null;
  return (
    <div style={{ marginBottom: "0.75rem" }}>
      <h4
        style={{
          fontSize: "0.85rem",
          fontWeight: 600,
          color: "#1A1915",
          marginBottom: "0.4rem",
          marginTop: 0,
        }}
      >
        {title}
      </h4>
      {items.map((item, i) => {
        const pColor =
          item.priority === "IMMEDIATE"
            ? "#A12323"
            : item.priority === "HIGH"
              ? "#A16A23"
              : "#6B6B68";
        return (
          <div
            key={i}
            style={{
              display: "flex",
              gap: "0.5rem",
              fontSize: "0.85rem",
              lineHeight: 1.5,
              marginBottom: "0.3rem",
            }}
          >
            <span
              style={{
                color: pColor,
                fontWeight: 600,
                minWidth: "70px",
                flexShrink: 0,
              }}
            >
              {item.priority}
            </span>
            <span style={{ color: "#4A4A48" }}>{item.action}</span>
            <span style={{ color: "#6B6B68", marginLeft: "auto", whiteSpace: "nowrap" }}>
              {item.responsible_role} &middot; {item.estimated_duration}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function FieldSet({
  legend,
  children,
}: {
  legend: string;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        padding: "1.25rem",
        background: "#F0EEE6",
        border: "1px solid #D6D4CC",
        borderRadius: "8px",
        marginBottom: "1rem",
      }}
    >
      <h3
        style={{
          fontSize: "0.95rem",
          fontWeight: 600,
          color: "#BD5D3A",
          marginBottom: "1rem",
          marginTop: 0,
        }}
      >
        {legend}
      </h3>
      {children}
    </div>
  );
}

function FieldRow({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "0.75rem",
        marginBottom: "0.75rem",
      }}
    >
      {children}
    </div>
  );
}

function Field({
  label,
  error,
  required,
  children,
}: {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div style={{ marginBottom: "0.75rem" }}>
      <label
        style={{
          fontSize: "0.85rem",
          fontWeight: 500,
          color: "#1A1915",
          display: "block",
          marginBottom: "0.3rem",
        }}
      >
        {label}
        {required && <span style={{ color: "#A12323", marginLeft: "0.15rem" }}>*</span>}
      </label>
      {children}
      {error && (
        <div
          style={{
            fontSize: "0.8rem",
            color: "#A12323",
            marginTop: "0.2rem",
          }}
        >
          {error}
        </div>
      )}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.6rem 0.75rem",
  fontSize: "0.9rem",
  border: "1px solid #D6D4CC",
  borderRadius: "6px",
  background: "#fff",
  color: "#1A1915",
  boxSizing: "border-box",
  minHeight: "40px",
};

const selectStyle: React.CSSProperties = {
  ...inputStyle,
  cursor: "pointer",
};
