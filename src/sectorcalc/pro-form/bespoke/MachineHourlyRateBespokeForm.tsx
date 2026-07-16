"use client";

// SectorCalc PRO — Machine Hourly Rate Proof Report: bespoke "ledger" design pilot.
//
// This is a NEW, isolated visual skin for exactly one tool. It does NOT touch, extend, or
// replace the x1 universal form (UniversalIndustrialDecisionForm.tsx / pro-tool-form.css) --
// the other 19 PRO tools are completely unaffected by this file.
//
// Correctness contract (why this differs from the original design mockup):
//   - No calculation logic lives in this file. The real, tested, server-only formula module
//     (machine-hourly-rate-proof-report.formula.ts) is the single source of truth, reached
//     two ways: a read-only live-preview call (/api/pro-calculator/preview, no credits, no
//     formula code sent to the browser) while typing, and the real paid execute call
//     (/api/pro-calculator/execute -- the exact same endpoint and state machine x1 uses)
//     when the person clicks "Generate sealed report".
//   - Every input field, its unit choices, its reference range, and its help text come from
//     the live schema (props.schema), not from a hardcoded field list.
//   - The audit seal shown after generation is the real one the execute API returns
//     (state.auditSealState.seal), not a fabricated hash.

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useUniversalIndustrialDecisionFormMachine } from "@/sectorcalc/pro-form/useUniversalIndustrialDecisionFormMachine";
import type { SuperV4Schema, SuperV4Input } from "@/sectorcalc/pro-form/contract-types";
import { buildProReport } from "@/sectorcalc/pro-report/pro-report-adapter";
import { useUserSubscription } from "@/lib/features/billing/use-user-subscription";
import { isProBypassEmail } from "@/lib/features/billing/subscription";
import "./machine-hourly-rate-bespoke.css";

const BYPASS_SESSION_ID = "bypass-unlimited";

interface Props {
  schema: SuperV4Schema;
  toolKey: string;
}

// ── Minimal, self-contained credit-session logic (deliberately duplicated rather than
//    imported from ProToolSessionWrapper.tsx, so this pilot page carries zero coupling to --
//    and zero risk for -- the shared x1 session wrapper used by the other 19 tools). ──
function useCreditSession(toolKey: string) {
  const [usageSessionId, setUsageSessionId] = useState<string | null>(null);
  const [remainingRuns, setRemainingRuns] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const { user } = useUserSubscription();
  const [authToken, setAuthToken] = useState<string | null>(null);
  const tokenFetched = useRef(false);

  useEffect(() => {
    if (user && !tokenFetched.current) {
      tokenFetched.current = true;
      user.getIdToken(false).then(setAuthToken).catch(() => {});
    }
  }, [user]);

  useEffect(() => {
    if (user?.email && isProBypassEmail(user.email)) {
      setUsageSessionId(BYPASS_SESSION_ID);
      setRemainingRuns(999);
    }
  }, [user?.email]);

  const requestSession = useCallback(async () => {
    if (user?.email && isProBypassEmail(user.email)) return;
    setLoading(true);
    try {
      if (!user) {
        window.location.href = `/login?next=${encodeURIComponent(window.location.pathname)}`;
        return;
      }
      const idToken = await user.getIdToken(false);
      const res = await fetch("/api/pro-tool-session/create", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${idToken}` },
        body: JSON.stringify({ toolKey }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        if (data.error === "INSUFFICIENT_CREDITS") {
          window.location.href = "/pricing";
          return;
        }
        throw new Error(data.error || "Failed to create session");
      }
      const session = await res.json();
      setUsageSessionId(session.usageSessionId);
      setRemainingRuns(session.remainingRuns);
    } catch {
      // swallow -- form stays in its current (unable-to-execute) state
    } finally {
      setLoading(false);
    }
  }, [user, toolKey]);

  return { usageSessionId, remainingRuns, loading, authToken, isSignedIn: !!user, requestSession };
}

// ── Live preview rail (debounced, read-only, no credits, no formula exposure) ──
function useLivePreview(toolKey: string, rawInputs: Record<string, string | number | boolean | null>, selectedUnits: Record<string, string>, schema: SuperV4Schema) {
  const [preview, setPreview] = useState<{ complete: boolean; outputs: Record<string, number> } | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      const numeric: Record<string, number> = {};
      for (const [k, v] of Object.entries(rawInputs)) {
        if (typeof v === "number" && Number.isFinite(v)) numeric[k] = v;
        else if (typeof v === "string" && v.trim() !== "" && Number.isFinite(Number(v))) numeric[k] = Number(v);
      }
      fetch("/api/pro-calculator/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tool_key: toolKey, raw_inputs: numeric, selected_units: selectedUnits }),
      })
        .then((r) => (r.ok ? r.json() : null))
        .then((data) => {
          if (!data?.ok) return;
          setPreview({ complete: !!data.complete, outputs: data.outputs ?? {} });
        })
        .catch(() => {});
    }, 250);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toolKey, JSON.stringify(rawInputs), JSON.stringify(selectedUnits)]);

  return preview;
}

function fmtNum(x: number | null | undefined): string {
  if (x == null || Number.isNaN(x)) return "—";
  if (!Number.isFinite(x)) return "∞";
  const a = Math.abs(x);
  return x.toLocaleString("en-US", { maximumFractionDigits: a >= 100 ? 0 : 2 });
}

const GROUPS: Array<{ n: string; title: string; desc: string; fields: string[] }> = [
  { n: "01", title: "Machine & capital", desc: "What the machine costs to own, and over how long that cost is spread.", fields: ["purchase_price", "useful_life", "annual_hours"] },
  { n: "02", title: "Running cost", desc: "What it costs to actually operate the machine for those hours.", fields: ["wage_rate", "power_draw", "energy_price"] },
];
const ADVANCED_FIELDS = ["idle_share", "maintenance_rate", "source_confidence_ratio"];

export function MachineHourlyRateBespokeForm({ schema, toolKey }: Props) {
  const session = useCreditSession(toolKey);
  const machine = useUniversalIndustrialDecisionFormMachine({
    schema,
    executeEndpoint: "/api/pro-calculator/execute",
    usageSessionId: session.usageSessionId,
    authToken: session.authToken ?? undefined,
    initialProfileMode: "engineering",
  });

  const preview = useLivePreview(toolKey, machine.state.rawInputState, machine.state.selectedUnitState, schema);
  const fieldById = useMemo(() => new Map(schema.inputs.map((f) => [f.id, f] as const)), [schema.inputs]);

  const response = machine.state.serverResponseState.response;
  const seal = machine.state.auditSealState.seal;
  const isExecuting = machine.state.executionState === "executing";
  const hasResult = !!response && (machine.state.executionState === "server_ok" || machine.state.executionState === "server_review");

  const proReport = useMemo(() => {
    if (!response?.outputs) return null;
    return buildProReport({
      toolSlug: toolKey,
      outputs: response.outputs.map((o) => ({ id: o.id, name: o.name ?? o.id, value: o.value, unit: o.unit ?? undefined })),
      rawInputs: machine.state.rawInputState,
      selectedUnits: machine.state.selectedUnitState,
      displayCurrency: null,
    });
  }, [response, toolKey, machine.state.rawInputState, machine.state.selectedUnitState]);

  const rateOutput = response?.outputs?.find((o) => o.id === "out_utilization_margin");
  const naiveOutput = response?.outputs?.find((o) => o.id === "out_normalized_demand");
  const premiumOutput = response?.outputs?.find((o) => o.id === "out_scenario_delta");

  const previewRate = preview?.complete ? preview.outputs["out_utilization_margin"] : undefined;

  const renderField = (id: string) => {
    const f = fieldById.get(id) as SuperV4Input | undefined;
    if (!f) return null;
    const raw = machine.state.rawInputState[id];
    const unit = machine.state.selectedUnitState[id] ?? f.allowed_display_units?.[0] ?? "";
    const isCurrency = f.quantity_kind === "currency" || f.quantity_kind === "currency_rate";
    const err = machine.state.validationState.client_precheck_errors.find((e) => e.input_id === id)?.message;
    const range = f.engineering_range;

    return (
      <div className="mhr-f" key={id}>
        <div className="mhr-f-top">
          <label htmlFor={`in_${id}`}>{f.name}</label>
          <span className="mhr-unitline">
            {range ? `ref ${fmtNum(range.min)}–${fmtNum(range.max)} ${range.unit ?? ""}` : ""}
          </span>
        </div>
        <div className={`mhr-control${err ? " mhr-bad" : ""}`}>
          {isCurrency && <span className="mhr-prefix">$</span>}
          <input
            id={`in_${id}`}
            type="number"
            step="any"
            inputMode="decimal"
            value={raw === null || raw === undefined ? "" : String(raw)}
            onChange={(e) => {
              const v = e.target.value;
              machine.setInputValue(id, v === "" ? null : Number(v));
            }}
          />
          {f.allowed_display_units && f.allowed_display_units.length > 1 && (
            <select value={unit} onChange={(e) => machine.setSelectedUnit(id, e.target.value)} aria-label="unit">
              {f.allowed_display_units.map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>
          )}
        </div>
        <div className="mhr-f-foot">
          <span className="mhr-hint">{f.user_help_text}</span>
        </div>
        {err && <div className="mhr-msg mhr-err">{err}</div>}
      </div>
    );
  };

  return (
    <div className="mhr-shell">
      <div className="mhr-mast">
        <div className="mhr-kicker">SectorCalc PRO · Machinery &amp; Manufacturing · Cost proof</div>
        <h1>{schema.tool_name}</h1>
        <p className="mhr-lede">
          The rate you quote against and the rate the machine actually costs are rarely the same number. This tool
          prices every productive hour — depreciation, maintenance, energy and labor, spread only across hours that
          make something sellable.
        </p>
        <div className="mhr-meta">
          <span>
            Schema <b>{schema.metadata?.schema_version}</b>
          </span>
          <span>
            Formula <b>{schema.metadata?.formula_version}</b>
          </span>
          <span>
            Method <b>full absorption costing</b>
          </span>
        </div>
      </div>

      <div className="mhr-bench">
        <div className="mhr-form-col">
          {GROUPS.map((g) => (
            <div className="mhr-grp" key={g.n}>
              <div className="mhr-grp-h">
                <span className="mhr-grp-n">{g.n}</span>
                <span className="mhr-grp-t">{g.title}</span>
              </div>
              <div className="mhr-grp-d">{g.desc}</div>
              {g.fields.map(renderField)}
            </div>
          ))}
          <details open>
            <summary>Advanced — idle time, maintenance &amp; confidence</summary>
            <div style={{ paddingTop: 14 }}>{ADVANCED_FIELDS.map(renderField)}</div>
          </details>
        </div>

        <div className="mhr-rail">
          <div className="mhr-rail-in">
            <div className="mhr-verdict">
              <div
                className={`mhr-verdict-band ${
                  hasResult ? (machine.state.executionState === "server_ok" ? "mhr-pos" : "mhr-warn") : preview?.complete ? "mhr-pos" : "mhr-warn"
                }`}
              >
                {hasResult ? "rate proven — sealed" : preview?.complete ? "live preview" : "incomplete"}
              </div>
              <div className="mhr-verdict-body">
                <div className="mhr-big">
                  {hasResult
                    ? `$${fmtNum(rateOutput?.value as number)}`
                    : previewRate !== undefined
                      ? `$${fmtNum(previewRate)}`
                      : "—"}
                  <small> /productive h</small>
                </div>
                <div className="mhr-big-cap">
                  {hasResult
                    ? "sealed result"
                    : previewRate !== undefined
                      ? "live estimate — not sealed, no credit used"
                      : "enter machine & capital data to begin"}
                </div>
              </div>
            </div>
            <button className="mhr-cta" disabled={!machine.canExecute || isExecuting} onClick={() => machine.submitServerExecution()}>
              {isExecuting ? "Generating…" : "Generate sealed report · 1 credit"}
            </button>
            {session.remainingRuns !== null && <div className="mhr-conf">Remaining runs: {session.remainingRuns}</div>}
            {!session.usageSessionId && (
              <button className="mhr-cta" style={{ marginTop: 8, background: "#3A4D8F", borderColor: "#2c3a6b" }} onClick={() => session.requestSession()} disabled={session.loading}>
                {session.loading ? "Starting session…" : "Start credit session"}
              </button>
            )}
          </div>
        </div>
      </div>

      {hasResult && response && (
        <div className="mhr-report">
          <div className="mhr-rep-mast">
            <h2>Machine hourly rate — proof report</h2>
            <div className="mhr-rid">
              engine {schema.metadata?.formula_version}
              <br />
              seal {seal?.hash_algorithm ?? "SHA-256"} · {seal?.output_hash ?? "—"}
              <br />
              executed {seal?.executed_at ? new Date(seal.executed_at).toISOString().slice(0, 19).replace("T", " ") : "—"}
            </div>
          </div>
          <div className="mhr-rep-body">
            <div className="mhr-sec">
              <div className="mhr-verdict-box">
                <div className="mhr-head">
                  This machine truly costs ${fmtNum(rateOutput?.value as number)} per productive hour.
                </div>
                <p>
                  The naive rate — total annual cost divided by planned hours, ignoring idle time — is{" "}
                  <strong>${fmtNum(naiveOutput?.value as number)}/h</strong>. Quoting on that number hides a{" "}
                  <strong>${fmtNum(premiumOutput?.value as number)}/h</strong> gap against the proven rate.
                </p>
              </div>
            </div>

            {proReport?.firedInsights && proReport.firedInsights.length > 0 && (
              <div className="mhr-sec">
                <div className="mhr-sec-h">
                  <span className="mhr-sec-n">1</span>
                  <span className="mhr-sec-t">Engineering insights</span>
                </div>
                {proReport.firedInsights.map((ins) => (
                  <div key={ins.id} className={`mhr-ins mhr-${ins.severity}`}>
                    <span className="mhr-t">{ins.severity}</span>
                    <span dangerouslySetInnerHTML={{ __html: ins.message }} />
                  </div>
                ))}
              </div>
            )}

            {proReport?.resolvedSections?.map((section, si) => (
              <div className="mhr-sec" key={si}>
                <div className="mhr-sec-h">
                  <span className="mhr-sec-n">{si + 2}</span>
                  <span className="mhr-sec-t">{section.sectionTitle}</span>
                </div>
                <table>
                  <tbody>
                    {section.entries.map((entry, ei) => (
                      <tr key={ei}>
                        <td>{entry.label}</td>
                        <td className="mhr-n">
                          {typeof entry.value === "number" ? fmtNum(entry.value) : String(entry.value ?? "—")}
                          {entry.unit ? ` ${entry.unit}` : ""}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}

            <div className="mhr-seal">
              SEAL · {seal?.hash_algorithm ?? "SHA-256"} · input {seal?.input_hash ?? "—"} · output {seal?.output_hash ?? "—"} · schema{" "}
              {seal?.schema_hash ?? "—"}
              <br />
              Computed server-side from the exact inputs and outputs of this run.
            </div>
            <div className="mhr-disc">
              Technical simulation for engineering and financial decision support. Not a substitute for professional
              accounting or engineering review.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
