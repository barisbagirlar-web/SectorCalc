"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState, useId } from "react";
import { createPortal } from "react-dom";
import type { ToolData, ToolInputField, ToolOutput } from "./types";
import { compile, safeEval, type CompiledExpression } from "./ast-parser";
import { FAM, UNIT_MAP, convert as unitConvert } from "./unit-conversion";
import { fmt, pctf, hash, interp } from "./formatter";
import { HMI_CSS as FORM_CSS } from "./hmi-css";
import { formatTitle } from "@/lib/utils/formatTitle";
/* ===== Helpers ===== */

type InputCls =
  | { c: "enum" }
  | { c: "bool" }
  | { c: "ratio"; label?: string }
  | { c: "ccy"; suffix: string }
  | { c: "int"; label?: string }
  | { c: "num"; fam?: string; declared?: string; label?: string };

export function classify(inp: ToolInputField): InputCls {
  const u = inp.unit.toLowerCase();
  if (inp.unit === "enum" || (inp.allowed_values && inp.allowed_values.length > 0)) return { c: "enum" };
  if (inp.unit === "boolean") return { c: "bool" };
  if (u === "ratio") return { c: "ratio" };
  if (u.indexOf("currency") === 0) return { c: "ccy", suffix: inp.unit.slice(8) };
  if (inp.unit_family === "currency") return { c: "ccy", suffix: "" };
  if (u === "unit" || u === "package") return { c: "int", label: inp.unit };
  // Check explicit unit_family first (resolved from schema unit_families map)
  if (inp.unit_family && FAM[inp.unit_family]) return { c: "num", fam: inp.unit_family, declared: inp.unit };
  if (UNIT_MAP[u]) return { c: "num", fam: UNIT_MAP[u][0], declared: UNIT_MAP[u][1] };
  return { c: "num", label: inp.unit || undefined };
}

function metaOf(outputs: ToolOutput[], id: string): ToolOutput | undefined {
  return outputs.find((o) => o.id === id);
}

function valFmt(out: { name?: string; unit?: string; precision?: number | null; enum_labels?: Record<string, string> } | undefined, v: unknown, ccy: string): [string, string] {
  if (v === null || v === undefined) return ["-", ""];
  if (!out) return [String(v), ""];
  if (out.unit === "enum") {
    const labels = out.enum_labels || {};
    return [labels[v as string] || (v as string), ""];
  }
  const nv = v as number;
  if (out.unit === "ratio") return [(nv * 100).toFixed(out.precision != null ? out.precision : 1), "%"];
  if (out.unit && out.unit.indexOf("currency") === 0) return [fmt(nv, out.precision != null ? out.precision : 2), ccy];
  return [fmt(nv, out.precision != null ? out.precision : 2), out.unit || ""];
}

/* ===== Popover Portal ===== */

type PopoverOption = { val: string; label: string; sub?: string };

function PopoverMenu({
  options, current, onPick, note, anchorRect, onClose,
}: {
  options: PopoverOption[];
  current: string;
  onPick: (v: string) => void;
  note?: string;
  anchorRect: DOMRect;
  onClose: () => void;
}) {
  const popRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handleKey);
    const handleClick = (e: MouseEvent) => {
      if (popRef.current && !popRef.current.contains(e.target as Node)) onClose();
    };
    setTimeout(() => document.addEventListener("click", handleClick), 0);
    return () => { document.removeEventListener("keydown", handleKey); document.removeEventListener("click", handleClick); };
  }, [onClose]);

  const left = Math.max(8, Math.min(anchorRect.left, window.innerWidth - 200 - 8));
  let top = anchorRect.bottom + 4;
  if (top + 300 > window.innerHeight - 8) top = Math.max(8, anchorRect.top - 300 - 4);

  return createPortal(
    <div ref={popRef} className="pop" role="listbox" style={{ left, top }}>
      {options.map((o) => (
        <div
          key={o.val}
          className="opt"
          role="option"
          aria-selected={o.val === current}
          tabIndex={0}
          onClick={() => { onPick(o.val); onClose(); }}
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onPick(o.val); onClose(); } }}
        >
          <span>{o.label}</span>
          {o.sub ? <small>{o.sub}</small> : null}
        </div>
      ))}
      {note ? <div className="pnote">{note}</div> : null}
    </div>,
    document.body,
  );
}

/* ===== Main Component ===== */

export type DynamicFormEngineProps = {
  tool: ToolData;
  showMasthead?: boolean;
  toolRegistry?: Array<{ id: string; name: string }>;
  onToolSwitch?: (toolId: string) => void;
  onCompute?: (scope: Record<string, unknown>, uncertainties: Record<string, number>) => void;
  externalCompute?: (scope: Record<string, unknown>) => { results: Record<string, unknown>; uncertainties?: Record<string, number> };
  renderInputExtra?: (inputId: string) => React.ReactNode;
};

export function DynamicFormEngine({ tool, showMasthead = true, toolRegistry, onToolSwitch, onCompute, externalCompute, renderInputExtra }: DynamicFormEngineProps) {
  // Batch-commit: state = committed, draft = editing
  const [state, setState] = useState<Record<string, unknown>>(() => {
    const init: Record<string, unknown> = {};
    (tool.inputs || []).forEach((inp) => { init[inp.id] = inp.default != null ? inp.default : null; });
    return init;
  });
  const [draft, setDraft] = useState<Record<string, unknown>>(() => ({ ...state }));
  const [dispUnit, setDispUnit] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    (tool.inputs || []).forEach((inp) => {
      const cl = classify(inp);
      if (cl.c === "num" && cl.declared) init[inp.id] = cl.declared;
    });
    return init;
  });
  const [ccy, setCcy] = useState<string>(() => {
    const ccyInput = tool.ui_contract.currency_input;
    return ccyInput && state[ccyInput] != null ? String(state[ccyInput]) : "USD";
  });
  const [popover, setPopover] = useState<{ id: string; rect: DOMRect; options: PopoverOption[]; current: string; note?: string } | null>(null);
  const [computed, setComputed] = useState<Record<string, unknown>>({});
  const [uncertainties, setUncertainties] = useState<Record<string, number>>({});
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [utcTime, setUtcTime] = useState("");
  const [lastExecTime, setLastExecTime] = useState<number | null>(null);
  const [executionCounter, setExecutionCounter] = useState(0);
  const [isExecuting, setIsExecuting] = useState(false);
  const [computationStatus, setComputationStatus] = useState<'IDLE' | 'COMPUTING' | 'DONE' | 'ERROR'>('IDLE');
  const formRef = useRef<HTMLDivElement>(null);
  const dirtyFieldsRef = useRef<Set<string>>(new Set());

  // UTC clock
  useEffect(() => {
    function tick() { setUtcTime("UTC · " + new Date().toISOString().replace("T", " ").slice(0, 19)); }
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // beforeunload warning
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (dirtyFieldsRef.current.size > 0) { e.preventDefault(); e.returnValue = ""; }
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, []);

  // F9 / Ctrl+Enter keyboard shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "F9") { e.preventDefault(); handleExecute(); }
      if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) { e.preventDefault(); handleExecute(); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [draft, state, validationErrors]);

  // Compiled expressions
  const compiled = useMemo(() => {
    const f: Record<string, CompiledExpression> = {};
    const u: Record<string, CompiledExpression> = {};
    const v: Record<string, CompiledExpression> = {};
    const w: Record<string, CompiledExpression> = {};
    (tool.formulas || []).forEach((fm) => {
      f[fm.id] = compile(fm.expression);
      if (fm.uncertainty_expression) { try { u[fm.id] = compile(fm.uncertainty_expression); } catch { /* ignore */ } }
    });
    (tool.engine_rules?.validation?.rules || []).forEach((r) => { v[r.id] = compile(r.condition); });
    (tool.engine_rules?.smart_warnings || []).forEach((sw) => { w[sw.id] = compile(sw.trigger); });
    return { f, u, v, w };
  }, [tool]);

  // Dirty detection
  const isDirty = useCallback(() => {
    for (const k in draft) { if (draft[k] !== state[k]) return true; }
    return false;
  }, [draft, state]);

  const dirtyFieldIds = useCallback(() => {
    const ids: string[] = [];
    for (const k in draft) { if (draft[k] !== state[k]) ids.push(k); }
    return ids;
  }, [draft, state]);

  // Sync dirty ref
  useEffect(() => {
    dirtyFieldsRef.current = new Set(dirtyFieldIds());
  }, [dirtyFieldIds]);

  const dirtyCount = dirtyFieldIds().length;
  const hasDirty = dirtyCount > 0;

  // Commit draft → state
  const handleExecute = useCallback(() => {
    // Run live validation on draft
    const scope: Record<string, unknown> = { Math, Number, isFinite };
    (tool.inputs || []).forEach((inp) => { scope[inp.id] = draft[inp.id]; });
    const vFails: string[] = [];
    (tool.engine_rules?.validation?.rules || []).forEach((r) => {
      const ok = safeEval(compiled.v[r.id], scope);
      if (ok === false) vFails.push(r.message);
    });
    if (vFails.length > 0) {
      // Find first failing field and flash it
      for (const rule of tool.engine_rules?.validation?.rules || []) {
        const ok = safeEval(compiled.v[rule.id], scope);
        if (ok === false) {
          for (const inp of tool.inputs || []) {
            if (rule.condition.includes(inp.id)) {
              const el = document.getElementById("field_" + inp.id);
              if (el) {
                el.scrollIntoView({ behavior: "smooth", block: "center" });
                el.style.outline = "2px solid var(--danger)";
                setTimeout(() => el.style.outline = "", 1200);
              }
              break;
            }
          }
          break;
        }
      }
      return;
    }
    // Commit
    setIsExecuting(true);
    setComputationStatus('COMPUTING');
    setTimeout(() => {
      setState({ ...draft });
      setExecutionCounter((c) => c + 1);
      setLastExecTime(Date.now());
      setIsExecuting(false);
    }, 120);
  }, [draft, tool, compiled.v]);

  // Reset to defaults
  const handleReset = useCallback(() => {
    if (hasDirty && !window.confirm("Reset all inputs to schema defaults? Uncommitted changes will be lost.")) return;
    const newDraft: Record<string, unknown> = {};
    (tool.inputs || []).forEach((inp) => { newDraft[inp.id] = inp.default != null ? inp.default : null; });
    setDraft({ ...newDraft });
    setState({ ...newDraft });
    setExecutionCounter(0);
    setLastExecTime(null);
  }, [tool, hasDirty]);

  // Compute on committed state
  const recompute = useCallback(() => {
    const scope: Record<string, unknown> = { Math, Number, isFinite };
    (tool.inputs || []).forEach((inp) => { scope[inp.id] = state[inp.id]; });
    const results: Record<string, unknown> = { ...scope };
    const unc: Record<string, number> = {};
    const valErrors: Record<string, string> = {};

    // Validation
    let hasBlocking = false;
    (tool.engine_rules?.validation?.rules || []).forEach((rule) => {
      const ok = safeEval(compiled.v[rule.id], scope);
      if (ok === false) {
        hasBlocking = true;
        (tool.inputs || []).forEach((inp) => {
          if (!valErrors[inp.id] && rule.condition.includes(inp.id)) valErrors[inp.id] = rule.message;
        });
      }
    });
    setValidationErrors(valErrors);

    if (hasBlocking) {
      setComputed({});
      setUncertainties({});
      setComputationStatus('ERROR');
      return;
    }

    // Formulas
    if (externalCompute) {
      try {
        const ext = externalCompute(results);
        Object.assign(results, ext.results);
        if (ext.uncertainties) Object.assign(unc, ext.uncertainties);
      } catch (err) {
        console.error("externalCompute failed:", err);
      }
    } else {
      (tool.formulas || []).forEach((fm) => {
        const val = safeEval(compiled.f[fm.id], results);
        if (val !== undefined) results[fm.output] = val;
        if (compiled.u[fm.id]) {
          const uv = safeEval(compiled.u[fm.id], results);
          if (typeof uv === "number" && Number.isFinite(uv)) unc[fm.output] = uv;
        }
      });
    }
    setComputed(results);
    setUncertainties(unc);
    setComputationStatus('DONE');
    onCompute?.(results, unc);
  }, [tool, state, compiled, onCompute]);

  // Live validation on draft
  const liveErrors = useMemo(() => {
    const errs: Record<string, string> = {};
    const scope: Record<string, unknown> = { Math, Number, isFinite };
    (tool.inputs || []).forEach((inp) => { scope[inp.id] = draft[inp.id]; });
    (tool.engine_rules?.validation?.rules || []).forEach((rule) => {
      const ok = safeEval(compiled.v[rule.id], scope);
      if (ok === false) {
        (tool.inputs || []).forEach((inp) => {
          if (!errs[inp.id] && rule.condition.includes(inp.id)) errs[inp.id] = rule.message;
        });
      }
    });
    return errs;
  }, [draft, tool, compiled.v]);

  // Auto-execute: debounced commit on draft changes (no validation errors)
  const autoCommitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (Object.keys(liveErrors).length > 0) return;
    if (!hasDirty) return;
    if (autoCommitTimerRef.current) clearTimeout(autoCommitTimerRef.current);
    autoCommitTimerRef.current = setTimeout(() => {
      if (Object.keys(liveErrors).length === 0) {
        setState({ ...draft });
      }
    }, 100);
    return () => {
      if (autoCommitTimerRef.current) clearTimeout(autoCommitTimerRef.current);
    };
  }, [draft, hasDirty, liveErrors]);

  // Recompute on state change
  useEffect(() => { recompute(); }, [recompute]);

  const updateField = (id: string, value: unknown) => {
    setDraft((prev) => ({ ...prev, [id]: value }));
  };

  const handleNumericInput = (inp: ToolInputField, raw: string) => {
    const cl = classify(inp);
    const v = raw === "" ? null : Number(raw);
    if (v === null || isNaN(v)) { updateField(inp.id, null); return; }
    if (cl.c === "num" && cl.fam && cl.declared) {
      updateField(inp.id, unitConvert(cl.fam, dispUnit[inp.id], cl.declared, v));
    } else {
      updateField(inp.id, v);
    }
  };

  const handleUnitChange = (inpId: string, newUnit: string) => {
    setDispUnit((prev) => ({ ...prev, [inpId]: newUnit }));
  };

  const handleEnumPick = (inpId: string, val: string) => {
    updateField(inpId, val);
    if (inpId === tool.ui_contract.currency_input) {
      setCcy(val);
      // Currency is display-level, auto-commit
      setState((prev) => ({ ...prev, [inpId]: val }));
    }
  };

  const handleBoolToggle = (inpId: string) => {
    setDraft((prev) => ({ ...prev, [inpId]: !prev[inpId] }));
  };

  const openPopover = (anchorEl: HTMLElement, inpId: string) => {
    const inp = (tool.inputs || []).find((i) => i.id === inpId);
    if (!inp) return;
    const rect = anchorEl.getBoundingClientRect();
    if (inp.allowed_values && inp.allowed_values.length > 0) {
      const note = inpId === tool.ui_contract.currency_input ? "Label only - no FX conversion inside this tool." : undefined;
      setPopover({
        id: inpId,
        rect,
        options: inp.allowed_values.map((v) => ({ val: v, label: v })),
        current: String(draft[inpId] ?? inp.default ?? ""),
        note,
      });
    }
  };

  const openUnitPopover = (anchorEl: HTMLElement, inpId: string) => {
    const inp = (tool.inputs || []).find((i) => i.id === inpId);
    if (!inp) return;
    const cl = classify(inp);
    if (cl.c !== "num" || !cl.fam) return;
    const fam = FAM[cl.fam];
    if (!fam || fam.order.length <= 1) return;
    const rect = anchorEl.getBoundingClientRect();
    setPopover({
      id: inpId,
      rect,
      options: fam.order.map((u) => ({ val: u, label: u, sub: fam.u[u].n })),
      current: dispUnit[inpId] || cl.declared || "",
    });
  };

  const closePopover = () => setPopover(null);

  const handlePopoverPick = (val: string) => {
    if (!popover) return;
    const inp = (tool.inputs || []).find((i) => i.id === popover.id);
    if (inp) {
      const cl = classify(inp);
      if (cl.c === "num" && cl.fam) {
        handleUnitChange(popover.id, val);
      } else {
        handleEnumPick(popover.id, val);
      }
    }
    closePopover();
  };

  // Warnings (on committed state)
  const warnings = useMemo(() => {
    const result: Array<[string, string]> = [];
    (tool.engine_rules?.smart_warnings || []).forEach((sw) => {
      const triggered = safeEval(compiled.w[sw.id], computed);
      if (triggered === true) result.push([sw.severity, sw.message]);
    });
    return result;
  }, [tool, compiled, computed]);

  const outMeta = useCallback(
    (id: string): { name?: string; unit?: string; precision?: number | null; enum_labels?: Record<string, string> } =>
      metaOf(tool.outputs, id) ?? {},
    [tool],
  );

  // Tornado sensitivity analysis
  const tornadoDeltas = useMemo(() => {
    const t = tool.ui_contract.tornado;
    if (!t) return [];
    const primary = t.primary;
    const base = computed[primary] as number;
    if (base === null || base === undefined || !isFinite(base) || base === 0) return [];
    const v = t.variation_pct || 0.1;
    type Delta = { input: string; name: string; swing: number; swing_pct: number; plus: number; minus: number; baseVal: number };
    const deltas: Delta[] = [];
    const scopeBase: Record<string, unknown> = { Math, Number, isFinite };
    (tool.inputs || []).forEach((inp) => { scopeBase[inp.id] = computed[inp.id]; });
    (t.inputs || []).forEach((inputId) => {
      const inp = (tool.inputs || []).find((i) => i.id === inputId);
      if (!inp) return;
      const baseVal = computed[inputId] as number;
      if (baseVal === null || baseVal === undefined || !isFinite(baseVal) || baseVal === 0) return;
      const computeWith = (newVals: Record<string, unknown>) => {
        const s: Record<string, unknown> = { Math, Number, isFinite, ...scopeBase, ...newVals };
        (tool.formulas || []).forEach((fm) => {
          const cv = safeEval(compiled.f[fm.id], s);
          if (cv !== undefined) s[fm.output] = cv;
        });
        return s[primary] as number;
      };
      const valPlus = computeWith({ [inputId]: baseVal * (1 + v) });
      const valMinus = computeWith({ [inputId]: baseVal * (1 - v) });
      if (!isFinite(valPlus) || !isFinite(valMinus)) return;
      const swing = Math.abs(valPlus - valMinus);
      deltas.push({ input: inputId, name: inp.name, swing, swing_pct: swing / Math.abs(base), plus: valPlus, minus: valMinus, baseVal });
    });
    return deltas.sort((a, b) => b.swing - a.swing).slice(0, t.top_n || 5);
  }, [tool, computed, compiled.f]);

  // Interpretation engine
  const interpretations = useMemo(() => {
    const rules = tool.ui_contract.interpretations;
    if (!rules) return [];
    const scope: Record<string, unknown> = { Math, Number, isFinite };
    (tool.inputs || []).forEach((inp) => { scope[inp.id] = computed[inp.id]; });
    (tool.formulas || []).forEach((fm) => { if (computed[fm.output] !== undefined) scope[fm.output] = computed[fm.output]; });
    const sevOrder: Record<string, number> = { CRITICAL: 0, WARNING: 1, INFO: 2 };
    return rules
      .filter((r) => { try { const fn = compile(r.condition); return safeEval(fn, scope) === true; } catch { return false; } })
      .map((r) => ({
        ...r,
        message_rendered: interp(r.message, scope, ccy, outMeta),
        recommendation_rendered: interp(r.recommendation, scope, ccy, outMeta),
      }))
      .sort((a, b) => (sevOrder[a.severity] ?? 9) - (sevOrder[b.severity] ?? 9));
  }, [tool, computed, ccy, outMeta]);

  const decisionOutput = tool.ui_contract.decision_output;
  const decisionVal = decisionOutput ? (computed[decisionOutput] as string) : null;
  const decisionMeta = decisionOutput ? outMeta(decisionOutput) : undefined;
  // Fallback: when no decision output is defined, show primary result value
  const decisionLabel = decisionVal && decisionMeta?.enum_labels
    ? decisionMeta.enum_labels[decisionVal] || decisionVal
    : decisionVal != null
      ? decisionVal
      : decisionOutput
        ? "AWAITING INPUTS"
        : computationStatus === 'IDLE'
          ? "AWAITING INPUTS"
          : computationStatus === 'COMPUTING'
            ? "COMPUTING…"
            : computationStatus === 'ERROR'
              ? "VALIDATION ERROR"
              : (() => {
                  const pk = tool.ui_contract.primary;
                  const pkVal = computed[pk];
                  if (pkVal != null && (typeof pkVal === "number" && isFinite(pkVal))) {
                    const [pv, pu] = valFmt(outMeta(pk), pkVal, ccy);
                    return `${pv} ${pu}`;
                  }
                  return "AWAITING INPUTS";
                })();
  const isCritical = decisionVal ? /REVIEW|REQUIRED|FAIL|RISK|REJECT/.test(decisionVal) : false;
  const isOK = decisionVal ? /ACCEPTABLE|OK|PASS/.test(decisionVal) : false;

  return (
    <div className="" ref={formRef}>
      <style>{FORM_CSS}</style>

      <div className="wrap">
        {/* STATUS STRIP */}
        <div className="status-strip">
          <div className="brand">
            <span className={`led ${Object.keys(liveErrors).length > 0 ? "warn" : "ok"} pulse`} />
            <div>
              <div className="brand-mark">SECTORCALC PRO</div>
              <div className="brand-sub">Industrial Dynamic Tool Engine · SC-9000</div>
            </div>
          </div>
          <div className="indicators">
            <div className="ind">
              <span className={`led ${Object.keys(liveErrors).length > 0 ? "warn" : "ok"}`} />
              <b>RUN</b>
            </div>
            <div className="ind">
              <span className={`led ${Object.keys(liveErrors).length > 0 ? "danger pulse" : "off"}`} />
              <b>ALM</b>
            </div>
            <div className="ind">
              <span className={`led ${hasDirty ? "warn pulse" : "off"}`} />
              <b>PENDING</b>
            </div>
            <div className="ind">
              <span className="led signal pulse" />
              <b>COM</b>
            </div>
            <div className="timestamp">{utcTime || "-"}</div>
          </div>
        </div>

        {/* DISPLAY HEADER */}
        <div className="display-header">
          <div>
            <div className="module-id">MODULE · {formatTitle(tool.tool_id)} · {(tool.category || "").toUpperCase()}</div>
            <h1>{formatTitle(tool.tool_name)}</h1>
            <div className="sub-cap">
              Dynamic engine - inputs, formulas, validation, warnings and units are read from {tool.tool_id}.json.
              Batch-commit execution model: edit inputs freely, press EXECUTE (or F9) to commit and compute.
            </div>
          </div>
          <div className="meta">
            <div className="pill-row">
              {toolRegistry && toolRegistry.length > 0 ? (
                <span
                  className="pill btn"
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    setPopover({
                      id: "__tool_switcher__",
                      rect,
                      options: toolRegistry.map((t) => ({ val: t.id, label: t.id, sub: t.name })),
                      current: tool.tool_id,
                    });
                  }}
                >
                  {tool.tool_id} ▾
                </span>
              ) : null}
              <span className="pill pro">PRO</span>
              <span className="pill">RISK · {tool.risk_level}</span>
              <span className="pill">{ccy}</span>
            </div>
            <div className="stds">
              {(tool.standards || []).map((s, i) => (
                <span key={i} className="std">{s}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="grid">
          {/* LEFT: FORM */}
          <main>
            {(tool.ui_contract.input_groups || []).map((group, gi) => {
              const letter = String.fromCharCode(65 + gi);
              const hasInvalid = (group.fields || []).some((fid) => liveErrors[fid]);
              return (
                <section key={group.id} className="group">
                  <div className="group-head">
                    <span className={`led ${hasInvalid ? "danger pulse" : "ok"} group-led`} />
                    <span className="group-letter">MOD · {letter}.0{gi + 1}</span>
                    <span className="group-title">{group.title}</span>
                    <span className="group-count">{(group.fields || []).length} CH</span>
                  </div>
                  <div className="fields">
                    {(group.fields || []).map((fid) => {
                      const inp = (tool.inputs || []).find((i) => i.id === fid);
                      if (!inp) return null;
                      const cl = classify(inp);
                      const chipLabel = inp.confidence_label;
                      const chipClass =
                        chipLabel === "CERTAIN" || chipLabel === "EXACT" ? "certain" :
                        chipLabel === "STRONG" || chipLabel === "HIGH" ? "strong" :
                        chipLabel === "MODERATE" || chipLabel === "MEDIUM" ? "moderate" : "strong";

                      // Reference strip
                      const refParts: React.ReactNode[] = [];
                      if (cl.c !== "enum" && cl.c !== "bool") {
                        const unitStr = (() => {
                          if (cl.c === "num" && cl.fam) return " " + (dispUnit[inp.id] || cl.declared || "");
                          if (inp.unit && inp.unit !== "ratio" && inp.unit !== "enum") return " " + inp.unit;
                          return "";
                        })();
                        if (cl.c === "ratio") {
                          refParts.push(<span className="seg" key="r">RANGE <b>{(inp.absolute_min ?? 0) * 100}–{(inp.absolute_max ?? 1) * 100}%</b></span>);
                          if (inp.default != null) refParts.push(<span className="seg" key="rf">REF <b>{(inp.default as number * 100).toFixed(inp.resolution && inp.resolution < 0.01 ? 1 : 0)}%</b></span>);
                        } else if (inp.absolute_min != null || inp.absolute_max != null) {
                          let mn = inp.absolute_min, mx = inp.absolute_max, refVal = inp.default as number;
                          if (cl.c === "num" && cl.fam) {
                            const dec = cl.declared!;
                            if (mn != null) mn = unitConvert(cl.fam, dec, dispUnit[inp.id] || dec, mn);
                            if (mx != null) mx = unitConvert(cl.fam, dec, dispUnit[inp.id] || dec, mx);
                            if (refVal != null && isFinite(refVal)) refVal = unitConvert(cl.fam, dec, dispUnit[inp.id] || dec, refVal);
                          }
                          if (mn != null && mx != null) refParts.push(<span className="seg" key="r">RANGE <b>{fmt(Math.abs(mn) < 1 && mn !== 0 ? mn : mn, 0)}–{mx >= 1e7 ? "\u221E" : fmt(mx, 0)}{unitStr}</b></span>);
                          if (inp.reference) refParts.push(<span className="seg" key="rf">REF <b>{inp.reference}</b></span>);
                          else if (inp.default != null && typeof inp.default === "number" && isFinite(inp.default)) refParts.push(<span className="seg" key="rf">REF <b>{fmt(Math.abs(refVal) < 1 ? refVal : Number(refVal.toFixed(0)), 0)}{unitStr}</b></span>);
                        } else if (inp.default != null && typeof inp.default === "number" && isFinite(inp.default)) {
                          refParts.push(<span className="seg" key="rf">REF <b>{fmt(inp.default as number, 2)}{unitStr}</b></span>);
                        }
                        // Benchmarks
                        if (inp.benchmarks && inp.benchmarks.length > 0) {
                          const nFam = cl.c === "num" ? cl.fam : undefined;
                          const nDecl = cl.c === "num" ? cl.declared : undefined;
                          inp.benchmarks.forEach((bm, bmi) => {
                            let bVal = bm.value;
                            let bUnit = "";
                            if (bm.type === "ratio") {
                              bUnit = "%";
                              bVal = bVal * 100;
                            } else if (nFam && nDecl) {
                              bUnit = " " + (dispUnit[inp.id] || nDecl);
                              if (typeof bVal === "number") {
                                bVal = unitConvert(nFam, nDecl, dispUnit[inp.id] || nDecl, bVal);
                              }
                            } else if (bm.unit) {
                              bUnit = " " + bm.unit;
                            }
                            refParts.push(
                              <span className="seg" key={`bm${bmi}`}>
                                BENCH <b>{bm.label}: {fmt(bVal, bm.type === "ratio" ? 1 : 2)}{bUnit}</b>
                              </span>
                            );
                          });
                        }
                      }

                      const displayVal = (() => {
                        const v = draft[inp.id];
                        if (cl.c === "num" && cl.fam) {
                          const dec = cl.declared!;
                          if (v != null && isFinite(v as number)) return unitConvert(cl.fam, dec, dispUnit[inp.id] || dec, v as number);
                        }
                        return v;
                      })();

                      let ctrl: React.ReactNode = null;
                      const isFieldDirty = draft[inp.id] !== state[inp.id];
                      if (cl.c === "enum") {
                        ctrl = (
                          <button type="button" className="choice" onClick={(e) => openPopover(e.currentTarget, inp.id)}>
                            <span className="cv">{String(draft[inp.id] ?? inp.default ?? "")}</span>
                            <span className="car">▾</span>
                          </button>
                        );
                      } else if (cl.c === "bool") {
                        const isOn = !!draft[inp.id];
                        ctrl = (
                          <button type="button" className="toggle" aria-pressed={isOn} onClick={() => handleBoolToggle(inp.id)}>
                            <span className="tog-track"><span className="tog-knob" /></span>
                            <span className="state">{isOn ? "ON · EXCLUDED" : "OFF · INCLUDED"}</span>
                          </button>
                        );
                      } else {
                        const pickable = cl.c === "num" && cl.fam && FAM[cl.fam]?.order.length > 1;
                        ctrl = (
                          <div className="ctrl">
                            <input inputMode="decimal" value={displayVal != null ? String(displayVal) : ""} onChange={(e) => handleNumericInput(inp, e.target.value)} aria-label={inp.name} />
                            <button type="button" className={`ubtn ${pickable ? "" : "static"}`} onClick={(e) => pickable ? openUnitPopover(e.currentTarget, inp.id) : undefined}>
                              {(() => { const _c = cl; if (_c.c === "ccy") return ccy + (_c.suffix || ""); if (_c.c === "int") return _c.label || ""; if (_c.c === "num") { const n = _c as { c: "num"; fam?: string; declared?: string; label?: string }; if (n.fam) return dispUnit[inp.id] || n.declared || ""; return n.label || ""; } return ""; })()}
                              {pickable ? <span className="car">▾</span> : null}
                            </button>
                          </div>
                        );
                      }

                      const spanClass = cl.c === "bool" ? "span" : "";
                      const isInvalid = !!liveErrors[inp.id];

                      return (
                        <div key={inp.id} className={`field ${spanClass} ${isInvalid ? "invalid" : ""} ${isFieldDirty ? "dirty" : ""}`}>
                          <label>
                            <span className="f-name">{inp.name}</span>
                            <span className={`chip ${chipClass}`}>{chipLabel}</span>
                            <span className="f-sym">{inp.symbol || ""}</span>
                          </label>
                          {ctrl}
                          <div className="ref">
                            {refParts}
                            {refParts.length > 0 ? <span className="dot" /> : null}
                            <span className="info" tabIndex={0}>i<span className="tip">{inp.note || inp.name}</span></span>
                            {cl.c === "ratio" && draft[inp.id] != null ? <span className="pct">= {(draft[inp.id] as number * 100).toFixed(2)}%</span> : null}
                          </div>
                          {renderInputExtra ? renderInputExtra(inp.id) : null}
                          <div className="err" style={{ display: isInvalid ? "block" : "none" }}>{liveErrors[inp.id] || ""}</div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              );
            })}

            {/* EXECUTE PANEL */}
            <div className="exec-panel">
              <div className="exec-status">
                <span className={`led ${Object.keys(liveErrors).length > 0 ? "danger" : hasDirty ? "warn pulse" : executionCounter > 0 ? "ok" : "off"}`} />
                <div>
                  <div><b>{Object.keys(liveErrors).length > 0 ? "VALIDATION ERRORS" : hasDirty ? `PENDING · ${dirtyCount} FIELD${dirtyCount > 1 ? "S" : ""}` : executionCounter > 0 ? "COMMITTED" : "READY"}</b></div>
                  <div className="tx">{lastExecTime ? `Last execution · ${new Date(lastExecTime).toISOString().replace("T", " ").slice(0, 19)} UTC · #${executionCounter}` : "Last execution · -"}</div>
                </div>
              </div>
              <button className="btn-reset" onClick={handleReset} disabled={Object.keys(liveErrors).length > 0 && !hasDirty} title="Revert all inputs to schema defaults">
                ↺ RESET
              </button>
              <button className={`btn-exec ${hasDirty ? "dirty" : ""} ${isExecuting ? "executing" : ""}`} onClick={handleExecute} disabled={Object.keys(liveErrors).length > 0}>
                {isExecuting ? (
                  <><span>◼ EXECUTING…</span><span className="kbd">F9</span></>
                ) : (
                  <><span>▶ EXECUTE</span><span className="kbd">F9</span></>
                )}
              </button>
            </div>
          </main>

          {/* RIGHT: RAIL */}
          <aside className="rail">
            {/* Decision */}
            <div className={`decision ${isCritical ? "review" : isOK ? "ok" : ""} ${hasDirty ? "stale" : ""}`}>
              <div className="d-label">
                PRIMARY READOUT · STATUS
                {hasDirty ? <span className="stale-chip">STALE</span> : null}
              </div>
              <div className="d-text">{decisionLabel}</div>
              {tool.ui_contract.decision_note ? (
                <div className="d-sub">{interp(tool.ui_contract.decision_note, computed, ccy, outMeta)}</div>
              ) : null}
            </div>

            {/* KPIs */}
            <div className="card">
              <h3>PRIMARY READOUTS</h3>
              <div className="kpis">
                {Array.from(new Set(tool.ui_contract.result_cards || [])).map((id) => {
                  const m = outMeta(id);
                  const [val, unit] = valFmt(m, computed[id], ccy);
                  const isPrimary = id === tool.ui_contract.primary;
                  const uncVal = uncertainties[id];
                  const primUnc = tool.ui_contract.primary_uncertainty;
                  const band = uncVal != null ? `± ${fmt(uncVal, m?.unit && m.unit.indexOf("currency") === 0 && Math.abs(computed[id] as number) > 1000 ? 0 : 2)} ${unit}` : "";
                  return (
                    <div key={id} className={`kpi ${isPrimary ? "lead" : ""}`}>
                      <div className="k-label">{m?.name || id}</div>
                      <div className="k-val">{val} <span className="k-unit">{unit}</span></div>
                      {band ? <div className="k-band">{band}{id === primUnc && computed[id] != null ? ` · ${pctf(uncVal / (computed[id] as number))} GUM` : ""}</div> : null}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Resolver */}
            {tool.ui_contract.resolver ? (
              <div className="card resolver">
                <h3>{tool.ui_contract.resolver.title}</h3>
                <div className="resolver">
                  {(tool.ui_contract.resolver.bars || []).map((bar, i) => {
                    const barVal = (computed[bar.ref] as number) || 0;
                    const allVals = (tool.ui_contract.resolver?.bars || []).map((b) => (computed[b.ref] as number) || 0);
                    const maxVal = Math.max(...allVals.concat([0.0001]));
                    const bindVal = computed[tool.ui_contract.resolver!.binding] as string;
                    const bindIdx = tool.ui_contract.resolver!.map ? tool.ui_contract.resolver!.map[bindVal] : -1;
                    const isBound = i === bindIdx;
                    return (
                      <div key={bar.ref} className={`bar-row ${isBound ? "bind" : ""}`}>
                        <span className="bl">{bar.label}</span>
                        <span className="track"><span className="fill" style={{ width: `${Math.max(2, (barVal / maxVal) * 100)}%` }} /></span>
                        <span className="bv">{fmt(barVal, 1)} {tool.ui_contract.resolver!.unit}</span>
                      </div>
                    );
                  })}
                  {tool.ui_contract.resolver.note ? <div className="note">{interp(tool.ui_contract.resolver.note, computed, ccy, outMeta)}</div> : null}
                </div>
              </div>
            ) : null}

            {/* Tornado Sensitivity */}
            {tornadoDeltas.length > 0 ? (
              <div className="card tornado-card">
                <h3>LEVERAGE ANALYSIS · TORNADO</h3>
                <div className="resolver">
                  {tornadoDeltas.map((t, i) => {
                    const pct = (t.swing_pct * 100).toFixed(1);
                    const maxSwing = tornadoDeltas[0].swing_pct;
                    const width = Math.min(100, (t.swing_pct / maxSwing) * 100);
                    return (
                      <div key={t.input} className={`bar-row ${i === 0 ? "bind" : ""}`}>
                        <span className="bl">{t.name}</span>
                        <span className="track"><span className="fill" style={{ width: `${width}%` }} /></span>
                        <span className="bv">&plusmn;{pct}% impact</span>
                      </div>
                    );
                  })}
                  <div className="note">
                    <b>TORNADO SENSITIVITY:</b> &plusmn;10% variation on each input, ranked by impact on {outMeta(tool.ui_contract.tornado!.primary).name || tool.ui_contract.tornado!.primary}. Top lever is <b>{tornadoDeltas[0].name}</b>.
                  </div>
                </div>
              </div>
            ) : null}

            {/* Interpretation Engine */}
            {tool.ui_contract.interpretations ? (
              <div className={`card interp-card ${interpretations.length > 0 && interpretations[0].severity === "CRITICAL" ? "critical" : interpretations.length > 0 && interpretations[0].severity === "WARNING" ? "warning" : "info"}`}>
                <h3>INTERPRETATION ENGINE</h3>
                {interpretations.length > 0 ? interpretations.map((i) => (
                  <div key={i.id} className={`interp-item ${i.severity}`}>
                    <div className="ih">
                      <span className="is">{i.severity}</span>
                      <span className="it">{i.title}</span>
                    </div>
                    <div className="im">{i.message_rendered}</div>
                    <div className="ir"><b>Action: </b>{i.recommendation_rendered}</div>
                  </div>
                )) : (
                  <div className="no-warn" style={{ padding: "8px 0" }}>● NO DEEP INTERPRETATIONS TRIGGERED - INPUTS WITHIN NORMAL OPERATING RANGE</div>
                )}
              </div>
            ) : null}

            {/* Engineering Diagnostics */}
            <div className="card readout">
              <h3>ENGINEERING DIAGNOSTICS</h3>
              <div className="readout">
                {(tool.ui_contract.insights || []).filter((b) => !b.when || safeEval(compile(b.when), computed) === true).map((block, i) => {
                  const confClass = block.conf === "CERTAIN" ? "cert" : block.conf === "STRONG" ? "strong" : block.conf === "MODERATE" ? "moderate" : "";
                  return (
                    <div key={i} className="blk">
                      <div className="bh">
                        <span className="bt">{block.title}</span>
                        {block.conf ? <span className={`bc ${confClass}`}>{block.conf}</span> : null}
                      </div>
                      {(block.lines || []).map((l, li) => <p key={li}>{interp(l, computed, ccy, outMeta)}</p>)}
                    </div>
                  );
                })}
                {tool.ui_contract.primary_uncertainty && uncertainties[tool.ui_contract.primary_uncertainty] != null ? (() => {
                  const pKey = tool.ui_contract.primary_uncertainty!;
                  const pMeta = outMeta(pKey);
                  const [pv, pu] = valFmt(pMeta, computed[pKey], ccy);
                  return (
                    <div className="blk">
                      <div className="bh"><span className="bt">CONFIDENCE &amp; UNCERTAINTY</span><span className="bc strong">STRONG</span></div>
                      <p>GUM (ISO/IEC 98-3) combined Type-B, root-sum-square: <b>{pv} {pu} ± {fmt(uncertainties[pKey], 0)}</b> (±{pctf(uncertainties[pKey] / (computed[pKey] as number))}). Tighten the highest-variance inputs before committing.</p>
                    </div>
                  );
                })() : null}
                {(!tool.ui_contract.insights || tool.ui_contract.insights.length === 0) ? <p className="blk" style={{ color: "var(--ink-50)", fontSize: "11px", margin: 0, fontFamily: "var(--mono)", textTransform: "uppercase", letterSpacing: ".08em" }}>No interpretation configured.</p> : null}
              </div>
            </div>

            {/* Breakdown */}
            {tool.ui_contract.breakdown ? (
              <div className="card">
                <h3>{tool.ui_contract.breakdown.title}</h3>
                {(() => {
                  const total = (computed[tool.ui_contract.breakdown!.total] as number) || 1;
                  const colors = ["var(--accent)", "var(--signal)", "var(--ok)", "rgba(230,234,241,.6)", "rgba(230,234,241,.4)", "rgba(230,234,241,.25)"];
                  const parts = tool.ui_contract.breakdown!.parts || [];
                  return (
                    <>
                      <div className="stack">
                        {parts.map((p, i) => (
                          <span key={p.ref} className="seg-b" title={p.label} style={{ width: `${Math.max(0, ((computed[p.ref] as number) || 0) / total * 100)}%`, background: colors[i % colors.length] }} />
                        ))}
                      </div>
                      <div className="legend">
                        {parts.map((p, i) => (
                          <div key={p.ref} className="lg">
                            <span className="sw" style={{ background: colors[i % colors.length] }} />
                            {p.label}
                            <span className="lv">{fmt((computed[p.ref] as number) || 0, Math.abs(computed[p.ref] as number) < 100 ? 2 : 0)}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  );
                })()}
              </div>
            ) : null}

            {/* Warnings */}
            <div className="card">
              <h3>ALARM LOG</h3>
              <div style={{ minHeight: 20 }}>
                {warnings.length > 0 ? warnings.map(([severity, msg], i) => (
                  <div key={i} className={`warn ${severity}`}>
                    <span className="wsev" />
                    <span className="wmsg"><b>{severity}.</b> {msg}</span>
                  </div>
                )) : <div className="no-warn">● NO THRESHOLD ALERTS · ALL INPUTS WITHIN OPERATING RANGE</div>}
              </div>
            </div>

            {/* Formula Trace & Audit */}
            <div className="card" style={{ paddingTop: 4 }}>
              <details>
                <summary>FORMULA TRACE <span className="arrow">›</span></summary>
                <div style={{ paddingBottom: 10 }}>
                  {(tool.formulas || []).filter((f) => !f.id.startsWith("X")).map((f) => {
                    const v = computed[f.output];
                    const str = typeof v === "string" ? v : (typeof v === "number" ? fmt(v, Math.abs(v) < 10 ? 3 : 2) : String(v ?? "-"));
                    return (
                      <div key={f.id} className="frow">
                        <span className="fn"><span className="fid">{f.id}</span>{f.output}</span>
                        <span className="fv">{str}</span>
                      </div>
                    );
                  })}
                </div>
              </details>
              <details>
                <summary>AUDIT LOG · ISO 9001 §8.5.1 <span className="arrow">›</span></summary>
                <div style={{ paddingBottom: 12 }}>
                  {[
                    ["Tool ID", tool.tool_id],
                    ["Formula version", tool.formula_version],
                    ["Traceability ID", tool.traceability_id],
                    ["Execution #", String(executionCounter)],
                    ["Timestamp (UTC)", new Date().toISOString().replace("T", " ").slice(0, 19)],
                    ["Input hash", "#" + hash(JSON.stringify(state) + ccy)],
                    ["Display currency", ccy + " (label only)"],
                    ["Uncertainty", "GUM 98-3 · RSS Type B"],
                  ].map(([label, val]) => (
                    <div key={label} className="audit-line">
                      <span>{label}</span>
                      <span>{val}</span>
                    </div>
                  ))}
                </div>
              </details>
            </div>

            {/* Export */}
            <button className="btn-export" onClick={() => window.print()}>&#x2398; EXPORT REPORT</button>
          </aside>
        </div>
      </div>

      {/* Mobile Bar */}
      <div className="mbar">
        <div>
          <div className="ml">RESULT</div>
          <div className="mv">
            {(() => { const pk = tool.ui_contract.primary; const pkVal = computed[pk]; if (pkVal != null && typeof pkVal === "number" && isFinite(pkVal)) { const [pv, pu] = valFmt(outMeta(pk), pkVal, ccy); return pv + " " + pu; } return "-"; })()}
          </div>
        </div>
        <div className="md">{decisionLabel}</div>
      </div>

      {/* Popover Portal */}
      {popover ? (
        popover.id === "__tool_switcher__" ? (
          <PopoverMenu
            options={popover.options} current={popover.current}
            onPick={(val) => { closePopover(); if (hasDirty && !window.confirm("You have uncommitted changes. Load a different tool? Changes will be discarded.")) return; onToolSwitch?.(val); }}
            note={popover.note} anchorRect={popover.rect} onClose={closePopover}
          />
        ) : (
          <PopoverMenu
            options={popover.options} current={popover.current}
            onPick={handlePopoverPick} note={popover.note}
            anchorRect={popover.rect} onClose={closePopover}
          />
        )
      ) : null}
    </div>
  );
}
