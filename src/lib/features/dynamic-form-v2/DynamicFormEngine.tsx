"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { ToolData, ToolInputField, ToolOutput } from "./types";
import { compile, safeEval, type CompiledExpression } from "./ast-parser";
import { FAM, UNIT_MAP, convert as unitConvert } from "./unit-conversion";
import { fmt, pctf, hash, interp } from "./formatter";

/* ===== CSS ===== */
const FORM_CSS = `
:root{--bg:#F0EEE6;--surface:#FAF9F5;--surface-2:#F4F2EA;--ink:#1A1915;--ink-70:rgba(26,25,21,.70);--ink-50:rgba(26,25,21,.50);--ink-38:rgba(26,25,21,.38);--accent:#BD5D3A;--accent-12:rgba(189,93,58,.12);--accent-24:rgba(189,93,58,.24);--line:rgba(26,25,21,.10);--line-18:rgba(26,25,21,.18);--ok:#4F6F52;--serif:Georgia,'Times New Roman',Times,serif;--sans:ui-sans-serif,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;--mono:ui-monospace,'SF Mono','JetBrains Mono',Menlo,Consolas,monospace;}
.dfe{background:var(--bg);color:var(--ink);font-family:var(--sans);font-size:15px;line-height:1.5;-webkit-font-smoothing:antialiased}
.dfe ::selection{background:var(--accent-24)}
.dfe .wrap{max-width:1200px;margin:0 auto;padding:0 20px}
.dfe .masthead{border-bottom:1px solid var(--line);padding:24px 0 18px;margin-bottom:22px}
.dfe .eyebrow{font-family:var(--mono);font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:var(--ink-50)}
.dfe .mast-row{display:flex;align-items:flex-end;justify-content:space-between;gap:24px;flex-wrap:wrap}
.dfe h1{font-family:var(--serif);font-weight:600;font-size:32px;line-height:1.08;margin:6px 0 0;letter-spacing:-.01em;max-width:20ch}
.dfe .sub-cap{font-size:12px;color:var(--ink-50);margin-top:8px;max-width:64ch}
.dfe .mast-meta{display:flex;flex-direction:column;align-items:flex-end;gap:8px;text-align:right}
.dfe .pill{font-family:var(--mono);font-size:10.5px;letter-spacing:.08em;text-transform:uppercase;border:1px solid var(--line-18);padding:4px 9px;color:var(--ink-70);white-space:nowrap}
.dfe .pill.accent{border-color:var(--accent);color:var(--accent)}
.dfe .stds{display:flex;gap:6px;flex-wrap:wrap;justify-content:flex-end;max-width:540px}
.dfe .std{font-family:var(--mono);font-size:9.5px;letter-spacing:.04em;color:var(--ink-50);border-bottom:1px solid var(--line);padding-bottom:1px}
.dfe .grid{display:grid;grid-template-columns:1fr 400px;gap:30px;align-items:start}
@media(max-width:1000px){.dfe .grid{grid-template-columns:1fr}}
.dfe .group{margin-bottom:26px}
.dfe .group-head{display:flex;align-items:baseline;gap:12px;border-bottom:1px solid var(--ink);padding-bottom:7px;margin-bottom:16px}
.dfe .group-letter{font-family:var(--mono);font-size:11px;color:var(--accent);letter-spacing:.1em}
.dfe .group-title{font-family:var(--serif);font-size:18px;font-weight:600}
.dfe .fields{display:grid;grid-template-columns:1fr 1fr;gap:16px 20px}
@media(max-width:560px){.dfe .fields{grid-template-columns:1fr}}
.dfe .field.span{grid-column:1/-1}
.dfe .field label{display:flex;align-items:baseline;gap:8px;margin-bottom:6px}
.dfe .f-name{font-weight:550;font-size:13.5px}
.dfe .f-sym{font-family:var(--mono);font-size:11px;color:var(--ink-38);margin-left:auto}
.dfe .chip{font-family:var(--mono);font-size:9px;letter-spacing:.06em;padding:1px 5px;border:1px solid var(--line-18);color:var(--ink-50)}
.dfe .chip.kesin{color:var(--ok);border-color:rgba(79,111,82,.4)}
.dfe .chip.guclu{color:var(--ink-70)}
.dfe .chip.orta{color:var(--accent);border-color:var(--accent-24)}
.dfe .ctrl{display:flex;align-items:stretch;border:1px solid var(--line-18);background:var(--surface)}
.dfe .ctrl:focus-within{border-color:var(--accent);box-shadow:0 0 0 3px var(--accent-12)}
.dfe .ctrl input{appearance:none;-webkit-appearance:none;border:0;background:transparent;font-family:var(--mono);font-size:18px;color:var(--ink);padding:13px 14px;width:100%;text-align:right;min-height:50px}
.dfe .ctrl input:focus{outline:none}
.dfe .ubtn{display:flex;align-items:center;gap:6px;padding:0 13px;font-family:var(--mono);font-size:12.5px;color:var(--ink-70);background:var(--surface-2);border:0;border-left:1px solid var(--line);cursor:pointer;white-space:nowrap;min-width:60px;justify-content:space-between}
.dfe .ubtn .car{color:var(--ink-38);font-size:9px}
.dfe .ubtn:hover{color:var(--accent)}
.dfe .ubtn.static{cursor:default;color:var(--ink-50)}
.dfe .ubtn.static .car{display:none}
.dfe .ubtn:focus-visible{outline:2px solid var(--accent);outline-offset:-2px}
.dfe .choice{width:100%;min-height:50px;border:1px solid var(--line-18);background:var(--surface);color:var(--ink);font-family:var(--sans);font-size:15px;padding:0 14px;cursor:pointer;display:flex;align-items:center;justify-content:space-between;text-align:left}
.dfe .choice .car{color:var(--ink-38);font-size:10px}
.dfe .choice:hover{border-color:var(--ink-38)}
.dfe .choice:focus-visible{outline:none;border-color:var(--accent);box-shadow:0 0 0 3px var(--accent-12)}
.dfe .choice .cv{font-family:var(--mono);font-size:14px}
.dfe .toggle{width:100%;min-height:50px;border:1px solid var(--line-18);background:var(--surface);color:var(--ink);font-family:var(--mono);font-size:13px;padding:0 14px;cursor:pointer;display:flex;align-items:center;justify-content:space-between;text-align:left}
.dfe .toggle .state{color:var(--accent);font-weight:600}
.dfe .toggle[aria-pressed=false] .state{color:var(--ink-38)}
.dfe .toggle:focus-visible{outline:none;border-color:var(--accent);box-shadow:0 0 0 3px var(--accent-12)}
.dfe .tog-track{width:42px;height:22px;border:1px solid var(--line-18);position:relative;background:var(--surface-2);flex:none}
.dfe .tog-knob{position:absolute;top:1px;left:1px;width:18px;height:18px;background:var(--ink-38);transition:left .14s,background .14s}
.dfe .toggle[aria-pressed=true] .tog-knob{left:21px;background:var(--accent)}
.dfe .pop{position:fixed;z-index:80;background:var(--surface);border:1px solid var(--ink);min-width:120px;box-shadow:0 14px 40px rgba(26,25,21,.18);padding:4px;max-height:60vh;overflow:auto}
.dfe .pop .opt{display:flex;align-items:center;justify-content:space-between;gap:14px;padding:9px 12px;cursor:pointer;font-family:var(--mono);font-size:13px;color:var(--ink-70)}
.dfe .pop .opt small{font-family:var(--sans);font-size:10.5px;color:var(--ink-38)}
.dfe .pop .opt:hover{background:var(--accent-12);color:var(--accent)}
.dfe .pop .opt[aria-selected=true]{color:var(--ink);background:var(--surface-2)}
.dfe .pop .opt[aria-selected=true]:before{content:'›';color:var(--accent);margin-right:-6px}
.dfe .pop .pnote{padding:7px 12px;font-family:var(--sans);font-size:10.5px;color:var(--ink-50);border-top:1px solid var(--line);line-height:1.35}
.dfe .ref{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-top:6px;font-family:var(--mono);font-size:10.5px;color:var(--ink-50)}
.dfe .ref b{color:var(--ink-70);font-weight:600}
.dfe .ref .seg{display:flex;gap:4px;align-items:center}
.dfe .ref .dot{width:3px;height:3px;background:var(--ink-38);border-radius:50%}
.dfe .ref .pct{color:var(--accent)}
.dfe .err{color:var(--accent);font-size:11.5px;margin-top:5px;font-weight:500;display:none}
.dfe .field.invalid .ctrl,.dfe .field.invalid .choice{border-color:var(--accent)}
.dfe .field.invalid .err{display:block}
.dfe .rail{position:sticky;top:18px;display:flex;flex-direction:column;gap:16px}
@media(max-width:1000px){.dfe .rail{position:static}}
.dfe .card{background:var(--surface);border:1px solid var(--line);padding:18px}
.dfe .card h3{font-family:var(--mono);font-size:10.5px;letter-spacing:.12em;text-transform:uppercase;color:var(--ink-50);margin:0 0 12px;font-weight:600}
.dfe .decision{border:1px solid var(--ink);padding:18px}
.dfe .decision .d-label{font-family:var(--mono);font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:var(--ink-50)}
.dfe .decision .d-text{font-family:var(--serif);font-size:21px;font-weight:600;line-height:1.15;margin-top:6px}
.dfe .decision.review{border-color:var(--accent);background:var(--accent-12)}
.dfe .decision.review .d-text{color:var(--accent)}
.dfe .decision.ok{border-color:var(--ok)}
.dfe .decision .d-sub{font-size:12.5px;color:var(--ink-70);margin-top:8px;line-height:1.45}
.dfe .kpis{display:grid;grid-template-columns:1fr 1fr;gap:1px;background:var(--line)}
.dfe .kpi{background:var(--surface);padding:13px 14px}
.dfe .kpi .k-label{font-size:11px;color:var(--ink-50)}
.dfe .kpi .k-val{font-family:var(--mono);font-size:22px;font-weight:500;margin-top:3px;line-height:1.05}
.dfe .kpi .k-unit{font-size:11px;color:var(--ink-38);font-family:var(--mono)}
.dfe .kpi .k-band{font-family:var(--mono);font-size:10px;color:var(--ink-50);margin-top:3px}
.dfe .kpi.lead{grid-column:1/-1}
.dfe .kpi.lead .k-val{font-size:30px}
.dfe .resolver .bar-row{display:flex;align-items:center;gap:10px;margin:9px 0}
.dfe .resolver .bl{width:84px;font-family:var(--mono);font-size:10.5px;color:var(--ink-70);text-align:right;flex:none}
.dfe .resolver .track{flex:1;height:20px;background:var(--surface-2);position:relative;border:1px solid var(--line)}
.dfe .resolver .fill{height:100%;background:var(--ink-38);transition:width .3s}
.dfe .resolver .bar-row.bind .fill{background:var(--accent)}
.dfe .resolver .bv{width:78px;font-family:var(--mono);font-size:11px;text-align:left;flex:none}
.dfe .resolver .bar-row.bind .bv{color:var(--accent);font-weight:600}
.dfe .resolver .note{font-size:11.5px;color:var(--ink-70);margin-top:10px;padding-top:10px;border-top:1px solid var(--line);line-height:1.5}
.dfe .resolver .note b{color:var(--accent)}
.dfe .readout .blk{padding:12px 0;border-top:1px solid var(--line)}
.dfe .readout .blk:first-child{padding-top:2px;border-top:0}
.dfe .readout .bh{display:flex;align-items:baseline;gap:8px;margin-bottom:6px}
.dfe .readout .bt{font-family:var(--serif);font-size:14px;font-weight:600}
.dfe .readout .bc{font-family:var(--mono);font-size:9px;letter-spacing:.06em;padding:1px 5px;border:1px solid var(--line-18);color:var(--ink-50);margin-left:auto}
.dfe .readout p{margin:0 0 6px;font-size:12.5px;line-height:1.5;color:var(--ink-70)}
.dfe .readout p:last-child{margin-bottom:0}
.dfe .readout b{color:var(--ink);font-weight:600}
.dfe .readout .em{color:var(--accent);font-weight:600}
.dfe .readout .num{font-family:var(--mono)}
.dfe .readout .lever{display:flex;gap:9px;align-items:baseline;padding:5px 0;font-size:12px;color:var(--ink-70);line-height:1.45}
.dfe .readout .lever .lk{font-family:var(--mono);color:var(--accent);font-size:11px;flex:none;width:16px}
.dfe .readout .blk.neg{background:var(--accent-12);margin:0 -18px;padding:12px 18px;border-top:1px solid var(--accent-24)}
.dfe .readout .blk.neg .bt{color:var(--accent)}
.dfe .readout .blk.neg .bc{border-color:var(--accent-24);color:var(--accent)}
.dfe .readout .blk.pos .bt:before{content:'✓ ';color:var(--ok)}
.dfe .readout .verdict{font-family:var(--serif);font-size:13.5px;color:var(--ink);line-height:1.5}
.dfe .stack{display:flex;height:26px;border:1px solid var(--line);overflow:hidden}
.dfe .stack .seg-b{height:100%}
.dfe .legend{display:grid;grid-template-columns:1fr 1fr;gap:5px 12px;margin-top:12px}
.dfe .lg{display:flex;align-items:center;gap:7px;font-size:11.5px;color:var(--ink-70)}
.dfe .lg .sw{width:9px;height:9px;flex:none}
.dfe .lg .lv{margin-left:auto;font-family:var(--mono);color:var(--ink)}
.dfe .warn{display:flex;gap:10px;padding:10px 0;border-top:1px solid var(--line);font-size:12.5px;line-height:1.45}
.dfe .warn:first-of-type{border-top:0}
.dfe .wsev{width:9px;height:9px;border-radius:50%;flex:none;margin-top:4px;border:1.5px solid var(--accent)}
.dfe .warn.CRITICAL .wsev{background:var(--accent)}
.dfe .warn.WARNING .wsev{background:transparent}
.dfe .warn.INFO .wsev{border-color:var(--ink-38)}
.dfe .warn .wmsg b{color:var(--accent)}
.dfe .warn.INFO .wmsg{color:var(--ink-70)}
.dfe .no-warn{font-size:12.5px;color:var(--ok)}
.dfe details{border-top:1px solid var(--line)}
.dfe details summary{cursor:pointer;list-style:none;padding:13px 0 12px;font-family:var(--mono);font-size:10.5px;letter-spacing:.12em;text-transform:uppercase;color:var(--ink-50);display:flex;align-items:center;justify-content:space-between}
.dfe details summary::-webkit-details-marker{display:none}
.dfe details summary .arrow{transition:transform .15s;color:var(--ink-38)}
.dfe details[open] summary .arrow{transform:rotate(90deg)}
.dfe .frow{display:flex;justify-content:space-between;gap:14px;padding:6px 0;border-top:1px dashed var(--line);font-family:var(--mono);font-size:11px}
.dfe .frow .fn{color:var(--ink-70)}
.dfe .frow .fid{color:var(--ink-38);margin-right:8px}
.dfe .frow .fv{color:var(--ink);text-align:right;white-space:nowrap}
.dfe .audit-line{font-family:var(--mono);font-size:10.5px;color:var(--ink-70);padding:4px 0;display:flex;justify-content:space-between;gap:12px}
.dfe .audit-line span:last-child{color:var(--ink)}
.dfe .btn{width:100%;border:1px solid var(--ink);background:var(--ink);color:var(--surface);font-family:var(--mono);font-size:12px;letter-spacing:.08em;text-transform:uppercase;padding:14px;cursor:pointer}
.dfe .btn:hover{background:var(--accent);border-color:var(--accent)}
.dfe .mbar{display:none}
@media(max-width:1000px){.dfe .mbar{display:flex;position:fixed;left:0;right:0;bottom:0;z-index:60;background:var(--ink);color:var(--surface);align-items:center;justify-content:space-between;padding:11px 18px;gap:14px;border-top:2px solid var(--accent)}.dfe .mbar .ml{font-family:var(--mono);font-size:10px;letter-spacing:.1em;text-transform:uppercase;opacity:.7}.dfe .mbar .mv{font-family:var(--mono);font-size:17px}.dfe .mbar .md{font-family:var(--serif);font-size:13px;text-align:right;max-width:46%}}
.dfe *:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.dfe .info{position:relative;cursor:help;border-bottom:1px dotted var(--ink-38);color:var(--ink-70)}
.dfe .info:hover .tip,.dfe .info:focus .tip{opacity:1;transform:translateY(0);pointer-events:auto}
.dfe .tip{position:absolute;left:0;bottom:130%;width:248px;background:var(--ink);color:var(--surface);font-family:var(--sans);font-size:11.5px;line-height:1.4;padding:9px 11px;opacity:0;transform:translateY(4px);transition:opacity .12s,transform .12s;pointer-events:none;z-index:20}
.dfe .tip:after{content:'';position:absolute;left:14px;top:100%;border:5px solid transparent;border-top-color:var(--ink)}
@media print{.dfe .rail{position:static}.dfe .btn,.dfe .mbar,.dfe .info,.dfe .ubtn .car,.dfe .choice .car{display:none}.dfe body{background:#fff;padding:0}}
`;

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
  if (u === "unit" || u === "package") return { c: "int", label: inp.unit };
  if (UNIT_MAP[u]) return { c: "num", fam: UNIT_MAP[u][0], declared: UNIT_MAP[u][1] };
  return { c: "num", label: inp.unit || undefined };
}

function metaOf(outputs: ToolOutput[], id: string): ToolOutput | undefined {
  return outputs.find((o) => o.id === id);
}

function valFmt(out: { name?: string; unit?: string; precision?: number | null; enum_labels?: Record<string, string> } | undefined, v: unknown, ccy: string): [string, string] {
  if (v === null || v === undefined) return ["—", ""];
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
  /** Optional: set to false to hide the tool-level masthead (use when site header already visible) */
  showMasthead?: boolean;
  /** Optional callback when results are computed */
  onCompute?: (scope: Record<string, unknown>, uncertainties: Record<string, number>) => void;
};

const stripFormulaIds = {};

export function DynamicFormEngine({ tool, showMasthead = true, onCompute }: DynamicFormEngineProps) {
  const [state, setState] = useState<Record<string, unknown>>(() => {
    const init: Record<string, unknown> = {};
    tool.inputs.forEach((inp) => {
      init[inp.id] = inp.default != null ? inp.default : null;
    });
    return init;
  });
  const [dispUnit, setDispUnit] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    tool.inputs.forEach((inp) => {
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
  const [blockingError, setBlockingError] = useState<string | null>(null);
  const formRef = useRef<HTMLDivElement>(null);

  // Compiled expressions
  const compiled = useMemo(() => {
    const f: Record<string, CompiledExpression> = {};
    const u: Record<string, CompiledExpression> = {};
    const v: Record<string, CompiledExpression> = {};
    const w: Record<string, CompiledExpression> = {};
    tool.formulas.forEach((fm) => {
      f[fm.id] = compile(fm.expression);
      if (fm.uncertainty_expression) {
        try { u[fm.id] = compile(fm.uncertainty_expression); } catch { /* ignore */ }
      }
    });
    tool.engine_rules.validation.rules.forEach((r) => { v[r.id] = compile(r.condition); });
    tool.engine_rules.smart_warnings.forEach((sw) => { w[sw.id] = compile(sw.trigger); });
    return { f, u, v, w };
  }, [tool]);

  // Build scope from inputs
  const buildScope = useCallback(() => {
    const s: Record<string, unknown> = { Math, Number, isFinite };
    tool.inputs.forEach((inp) => { s[inp.id] = state[inp.id]; });
    return s;
  }, [tool, state]);

  // Perform computation
  const recompute = useCallback(() => {
    const scope = buildScope();
    const results: Record<string, unknown> = { ...scope };
    const unc: Record<string, number> = {};
    const valErrors: Record<string, string> = {};

    // Run validation
    let hasBlocking = false;
    tool.engine_rules.validation.rules.forEach((rule) => {
      const ok = safeEval(compiled.v[rule.id], scope);
      if (ok !== true) {
        hasBlocking = true;
        // Find offending inputs
        tool.inputs.forEach((inp) => {
          if (!valErrors[inp.id] && rule.condition.includes(inp.id)) {
            valErrors[inp.id] = rule.message;
          }
        });
      }
    });
    setValidationErrors(valErrors);

    if (hasBlocking) {
      setBlockingError("Validation errors exist. Check highlighted fields.");
      setComputed({});
      setUncertainties({});
      return;
    }
    setBlockingError(null);

    // Compute formulas
    tool.formulas.forEach((fm) => {
      const val = safeEval(compiled.f[fm.id], results);
      if (val !== undefined) results[fm.output] = val;
      // Uncertainty
      if (compiled.u[fm.id]) {
        const uv = safeEval(compiled.u[fm.id], results);
        if (typeof uv === "number" && Number.isFinite(uv)) unc[fm.output] = uv;
      }
    });
    setComputed(results);
    setUncertainties(unc);
    onCompute?.(results, unc);
  }, [tool, state, compiled, buildScope, onCompute]);

  // Recompute on state change
  useEffect(() => { recompute(); }, [recompute]);

  const updateField = (id: string, value: unknown) => {
    setState((prev) => ({ ...prev, [id]: value }));
  };

  const handleNumericInput = (inp: ToolInputField, raw: string) => {
    const cl = classify(inp);
    const v = raw === "" ? null : Number(raw);
    if (v === null || isNaN(v)) {
      updateField(inp.id, null);
      return;
    }
    if (cl.c === "num" && cl.fam && cl.declared) {
      const baseVal = unitConvert(cl.fam, dispUnit[inp.id], cl.declared, v);
      updateField(inp.id, baseVal);
    } else {
      updateField(inp.id, v);
    }
  };

  const handleUnitChange = (inpId: string, newUnit: string) => {
    setDispUnit((prev) => ({ ...prev, [inpId]: newUnit }));
    // Re-compute display value from stored base
    const inp = tool.inputs.find((i) => i.id === inpId);
    if (inp) {
      const cl = classify(inp);
      if (cl.c === "num" && cl.fam && cl.declared) {
        const baseVal = state[inpId] as number;
        if (baseVal != null && isFinite(baseVal)) {
          const disp = unitConvert(cl.fam, cl.declared, newUnit, baseVal);
          // Trigger re-render by updating state with same base value
        }
      }
    }
  };

  const handleEnumPick = (inpId: string, val: string) => {
    updateField(inpId, val);
    if (inpId === tool.ui_contract.currency_input) setCcy(val);
  };

  const handleBoolToggle = (inpId: string) => {
    setState((prev) => ({ ...prev, [inpId]: !prev[inpId] }));
  };

  const openPopover = (anchorEl: HTMLElement, inpId: string) => {
    const inp = tool.inputs.find((i) => i.id === inpId);
    if (!inp) return;
    const rect = anchorEl.getBoundingClientRect();
    if (inp.allowed_values && inp.allowed_values.length > 0) {
      const note = inpId === tool.ui_contract.currency_input ? "Label only — no FX conversion inside this tool." : undefined;
      setPopover({
        id: inpId,
        rect,
        options: inp.allowed_values.map((v) => ({ val: v, label: v })),
        current: String(state[inpId] ?? inp.default ?? ""),
        note,
      });
    }
  };

  const openUnitPopover = (anchorEl: HTMLElement, inpId: string) => {
    const inp = tool.inputs.find((i) => i.id === inpId);
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
    // Check if it's a unit pick or enum pick
    const inp = tool.inputs.find((i) => i.id === popover.id);
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

  // Warnings
  const warnings = useMemo(() => {
    const result: Array<[string, string]> = [];
    tool.engine_rules.smart_warnings.forEach((sw) => {
      const triggered = safeEval(compiled.w[sw.id], computed);
      if (triggered === true) result.push([sw.severity, sw.message]);
    });
    return result;
  }, [tool, compiled, computed]);

  // Output meta lookup
  const outMeta = useCallback(
    (id: string): { name?: string; unit?: string; precision?: number | null; enum_labels?: Record<string, string> } =>
      metaOf(tool.outputs, id) ?? {},
    [tool],
  );

  // Determine decision
  const decisionOutput = tool.ui_contract.decision_output;
  const decisionVal = decisionOutput ? (computed[decisionOutput] as string) : null;
  const decisionMeta = decisionOutput ? outMeta(decisionOutput) : undefined;
  const decisionLabel = decisionVal && decisionMeta?.enum_labels
    ? decisionMeta.enum_labels[decisionVal] || decisionVal
    : decisionVal || "—";
  const isCritical = decisionVal ? /REVIEW|REQUIRED|FAIL|RISK|REJECT/.test(decisionVal) : false;
  const isOK = decisionVal ? /ACCEPTABLE|OK|PASS/.test(decisionVal) : false;

  return (
    <div className="dfe" ref={formRef}>
      <style>{FORM_CSS}</style>

      <div className="wrap">
        {showMasthead ? (
          <header className="masthead">
            <div className="eyebrow">SectorCalc PRO · {tool.category}</div>
            <div className="mast-row">
              <div>
                <h1>{tool.tool_name}</h1>
                <div className="sub-cap">
                  Dynamic engine — inputs, formulas, validation, warnings and units are read from {tool.tool_id}.json.
                  Units adapt per field; the engine computes in the schema&apos;s declared units.
                </div>
              </div>
              <div className="mast-meta">
                <div style={{ display: "flex", gap: 8 }}>
                  <span className="pill accent">PRO</span>
                  <span className="pill">Risk · {tool.risk_level}</span>
                  <span className="pill">{ccy}</span>
                </div>
                <div className="stds">
                  {tool.standards.map((s) => (
                    <span key={s} className="std">{s}</span>
                  ))}
                </div>
              </div>
            </div>
          </header>
        ) : null}

        <div className="grid">
          {/* ===== FORM FIELDS ===== */}
          <main>
            {tool.ui_contract.input_groups.map((group, gi) => {
              const letter = String.fromCharCode(65 + gi);
              return (
                <section key={group.id} className="group">
                  <div className="group-head">
                    <span className="group-letter">{letter}</span>
                    <span className="group-title">{group.title}</span>
                  </div>
                  <div className="fields">
                    {group.fields.map((fid) => {
                      const inp = tool.inputs.find((i) => i.id === fid);
                      if (!inp) return null;
                      const cl = classify(inp);
                      const chipLabel = inp.confidence_label;
                      const chipClass =
                        chipLabel === "KESİN" ? "kesin" :
                        chipLabel === "GÜÇLÜ" ? "guclu" :
                        chipLabel === "ORTA" ? "orta" : "guclu";

                      // Reference strip
                      const refParts: React.ReactNode[] = [];
                      if (cl.c !== "enum" && cl.c !== "bool") {
                        // Build unit string for display (handles both UNIT_MAP units and arbitrary labels)
                        const unitStr = (() => {
                          if (cl.c === "num" && cl.fam) return " " + (dispUnit[inp.id] || cl.declared || "");
                          if (inp.unit && inp.unit !== "ratio" && inp.unit !== "enum") return " " + inp.unit;
                          return "";
                        })();
                        if (cl.c === "ratio") {
                          refParts.push(<span className="seg" key="range">range <b>{(inp.absolute_min ?? 0) * 100}–{(inp.absolute_max ?? 1) * 100}%</b></span>);
                          if (inp.default != null) {
                            refParts.push(<span className="seg" key="ref">ref <b>{(inp.default as number * 100).toFixed(inp.resolution && inp.resolution < 0.01 ? 1 : 0)}%</b></span>);
                          }
                        } else if (inp.absolute_min != null || inp.absolute_max != null) {
                          let mn = inp.absolute_min;
                          let mx = inp.absolute_max;
                          let refVal = inp.default as number;
                          if (cl.c === "num" && cl.fam) {
                            const dec = cl.declared!;
                            if (mn != null) mn = unitConvert(cl.fam, dec, dispUnit[inp.id] || dec, mn);
                            if (mx != null) mx = unitConvert(cl.fam, dec, dispUnit[inp.id] || dec, mx);
                            if (refVal != null && isFinite(refVal)) refVal = unitConvert(cl.fam, dec, dispUnit[inp.id] || dec, refVal);
                          }
                          if (mn != null && mx != null) {
                            refParts.push(
                              <span className="seg" key="range">range <b>{fmt(Math.abs(mn) < 1 && mn !== 0 ? mn : mn, 0)}–{mx >= 1e7 ? "∞" : fmt(mx, 0)}{unitStr}</b></span>,
                            );
                          }
                          // Show reference value from available data
                          if (inp.reference) {
                            refParts.push(<span className="seg" key="ref">ref <b>{inp.reference}</b></span>);
                          } else if (inp.default != null && typeof inp.default === "number" && isFinite(inp.default)) {
                            const displayRef = Math.abs(refVal) < 1 ? refVal : Number(refVal.toFixed(0));
                            refParts.push(
                              <span className="seg" key="ref">ref <b>{fmt(displayRef, 0)}{unitStr}</b></span>,
                            );
                          }
                        } else if (inp.default != null && typeof inp.default === "number" && isFinite(inp.default)) {
                          // No range defined but has a default — show it as reference
                          refParts.push(<span className="seg" key="ref">ref <b>{fmt(inp.default as number, 2)}{unitStr}</b></span>);
                        }
                      }

                      const displayVal = (() => {
                        const v = state[inp.id];
                        if (cl.c === "num" && cl.fam) {
                          const dec = cl.declared!;
                          if (v != null && isFinite(v as number)) {
                            return unitConvert(cl.fam, dec, dispUnit[inp.id] || dec, v as number);
                          }
                        }
                        return v;
                      })();

                      let ctrl: React.ReactNode = null;
                      if (cl.c === "enum") {
                        ctrl = (
                          <button
                            type="button"
                            className="choice"
                            onClick={(e) => openPopover(e.currentTarget, inp.id)}
                          >
                            <span className="cv">{String(state[inp.id] ?? inp.default ?? "")}</span>
                            <span className="car">▾</span>
                          </button>
                        );
                      } else if (cl.c === "bool") {
                        const isOn = !!state[inp.id];
                        ctrl = (
                          <button
                            type="button"
                            className="toggle"
                            aria-pressed={isOn}
                            onClick={() => handleBoolToggle(inp.id)}
                          >
                            <span className="tog-track"><span className="tog-knob" /></span>
                            <span className="state">{isOn ? "On — excluded from economic cost" : "Off — included"}</span>
                          </button>
                        );
                      } else {
                        const pickable = cl.c === "num" && cl.fam && FAM[cl.fam]?.order.length > 1;
                        ctrl = (
                          <div className="ctrl">
                            <input
                              inputMode="decimal"
                              value={displayVal != null ? String(displayVal) : ""}
                              onChange={(e) => handleNumericInput(inp, e.target.value)}
                              aria-label={inp.name}
                            />
                            <button
                              type="button"
                              className={`ubtn ${pickable ? "" : "static"}`}
                              onClick={(e) => pickable ? openUnitPopover(e.currentTarget, inp.id) : undefined}
                            >
                              {(function(): string {
                               
                              const _c = cl;
                              if (_c.c === "ccy") return ccy + ((_c as { c: "ccy"; suffix: string }).suffix || "");
                              if (_c.c === "int") return (_c as { c: "int"; label?: string }).label || "";
                              if (_c.c === "num") {
                                const n = _c as { c: "num"; fam?: string; declared?: string; label?: string };
                                if (n.fam) return dispUnit[inp.id] || n.declared || "";
                                return n.label || "";
                              }
                              return "";
                            })()}
                              {pickable ? <span className="car">▾</span> : null}
                            </button>
                          </div>
                        );
                      }

                      const spanClass = cl.c === "bool" ? "span" : "";
                      const isInvalid = !!validationErrors[inp.id];

                      return (
                        <div key={inp.id} className={`field ${spanClass} ${isInvalid ? "invalid" : ""}`}>
                          <label>
                            <span className="f-name">{inp.name}</span>
                            <span className={`chip ${chipClass}`}>{chipLabel}</span>
                            <span className="f-sym">{inp.symbol || ""}</span>
                          </label>
                          {ctrl}
                          <div className="ref">
                            {refParts}
                            <span className="dot" />
                            <span
                              className="info"
                              tabIndex={0}
                            >
                              i
                              <span className="tip">{inp.note || inp.name}</span>
                            </span>
                            {cl.c === "ratio" && state[inp.id] != null ? (
                              <span className="pct">= {(state[inp.id] as number * 100).toFixed(2)}%</span>
                            ) : null}
                          </div>
                          <div className="err" style={{ display: isInvalid ? "block" : "none" }}>
                            {validationErrors[inp.id] || ""}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              );
            })}
          </main>

          {/* ===== RESULTS RAIL ===== */}
          <aside className="rail">
            {/* Decision */}
            <div className={`decision ${isCritical ? "review" : isOK ? "ok" : ""}`}>
              <div className="d-label">Decision</div>
              <div className="d-text">{decisionLabel}</div>
              {tool.ui_contract.decision_note ? (
                <div className="d-sub">{interp(tool.ui_contract.decision_note, computed, ccy, outMeta)}</div>
              ) : null}
            </div>

            {/* KPIs */}
            <div className="card">
              <h3>Key results</h3>
              <div className="kpis">
                {tool.ui_contract.result_cards.map((id) => {
                  const m = outMeta(id);
                  const [val, unit] = valFmt(m, computed[id], ccy);
                  const isPrimary = id === tool.ui_contract.primary;
                  const uncVal = uncertainties[id];
                  const primUnc = tool.ui_contract.primary_uncertainty;
                  const band = uncVal != null
                    ? `± ${fmt(uncVal, m?.unit && m.unit.indexOf("currency") === 0 && Math.abs(computed[id] as number) > 1000 ? 0 : 2)} ${unit}`
                    : "";
                  return (
                    <div key={id} className={`kpi ${isPrimary ? "lead" : ""}`}>
                      <div className="k-label">{m?.name || id}</div>
                      <div className="k-val">{val} <span className="k-unit">{unit}</span></div>
                      {band ? (
                        <div className="k-band">
                          {band}
                          {id === primUnc && computed[id] != null ? ` · ${pctf(uncVal / (computed[id] as number))} (GUM)` : ""}
                        </div>
                      ) : null}
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
                        <span className="track">
                          <span className="fill" style={{ width: `${Math.max(2, (barVal / maxVal) * 100)}%` }} />
                        </span>
                        <span className="bv">{fmt(barVal, 1)} {tool.ui_contract.resolver!.unit}</span>
                      </div>
                    );
                  })}
                  {tool.ui_contract.resolver.note ? (
                    <div className="note">{interp(tool.ui_contract.resolver.note, computed, ccy, outMeta)}</div>
                  ) : null}
                </div>
              </div>
            ) : null}

            {/* Engineering Read-out */}
            <div className="card readout">
              <h3>Engineering read-out · assessment &amp; interpretation</h3>
              <div className="readout">
                {(tool.ui_contract.insights || []).filter((b) => !b.when || safeEval(compile(b.when), computed) === true).map((block, i) => {
                  const lines = (block.lines || []).map((l, li) => (
                    <p key={li} className={block.verdict ? "verdict" : ""}>
                      {interp(l, computed, ccy, outMeta)}
                    </p>
                  ));
                  const levers = (block.levers || []).map((l, li) => (
                    <div key={li} className="lever">
                      <span className="lk">{li + 1}</span>
                      <span>{interp(l, computed, ccy, outMeta)}</span>
                    </div>
                  ));
                  const toneClass = block.tone === "negative" ? "neg" : block.tone === "positive" ? "pos" : "";
                  return (
                    <div key={i} className={`blk ${toneClass}`}>
                      <div className="bh">
                        <span className="bt">{block.title}</span>
                        <span className="bc">{block.conf}</span>
                      </div>
                      {lines}
                      {levers}
                    </div>
                  );
                })}
                {/* Uncertainty readout */}
                {tool.ui_contract.primary_uncertainty && uncertainties[tool.ui_contract.primary_uncertainty] != null ? (
                  (() => {
                    const pKey = tool.ui_contract.primary_uncertainty!;
                    const pMeta = outMeta(pKey);
                    const [pv, pu] = valFmt(pMeta, computed[pKey], ccy);
                    const uncVal = uncertainties[pKey];
                    return (
                      <div className="blk">
                        <div className="bh">
                          <span className="bt">Confidence &amp; uncertainty</span>
                          <span className="bc">GÜÇLÜ</span>
                        </div>
                        <p>
                          GUM (ISO/IEC 98-3) combined Type-B, root-sum-square: <b>{pv} {pu} ± {fmt(uncVal, 0)}</b> (±{pctf(uncVal / (computed[pKey] as number))}). Tighten the highest-variance inputs before committing.
                        </p>
                      </div>
                    );
                  })()
                ) : null}
                {(!tool.ui_contract.insights || tool.ui_contract.insights.length === 0) ? (
                  <p style={{ color: "var(--ink-50)", fontSize: "12.5px", margin: 0 }}>No interpretation configured for this tool.</p>
                ) : null}
              </div>
            </div>

            {/* Breakdown */}
            {tool.ui_contract.breakdown ? (
              <div className="card">
                <h3>{tool.ui_contract.breakdown.title}</h3>
                {(() => {
                  const total = (computed[tool.ui_contract.breakdown!.total] as number) || 1;
                  const colors = ["var(--ink)", "var(--accent)", "rgba(189,93,58,.55)", "rgba(26,25,21,.6)", "rgba(26,25,21,.4)", "rgba(26,25,21,.25)"];
                  const parts = tool.ui_contract.breakdown!.parts || [];
                  return (
                    <>
                      <div className="stack">
                        {parts.map((p, i) => (
                          <span
                            key={p.ref}
                            className="seg-b"
                            title={p.label}
                            style={{
                              width: `${Math.max(0, ((computed[p.ref] as number) || 0) / total * 100)}%`,
                              background: colors[i % colors.length],
                            }}
                          />
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
              <h3>Smart warnings</h3>
              <div style={{ minHeight: 20 }}>
                {warnings.length > 0 ? (
                  warnings.map(([severity, msg], i) => (
                    <div key={i} className={`warn ${severity}`}>
                      <span className="wsev" />
                      <span className="wmsg"><b>{severity}.</b> {msg}</span>
                    </div>
                  ))
                ) : (
                  <div className="no-warn">No threshold alerts. Inputs within expected operating ranges.</div>
                )}
              </div>
            </div>

            {/* Formula Trace & Audit */}
            <div className="card" style={{ paddingTop: 4 }}>
              <details>
                <summary>Formula trace <span className="arrow">›</span></summary>
                <div style={{ paddingBottom: 10 }}>
                  {tool.formulas.filter((f) => !f.id.startsWith("X")).map((f) => {
                    const v = computed[f.output];
                    const str = typeof v === "string" ? v : (typeof v === "number" ? fmt(v, Math.abs(v) < 10 ? 3 : 2) : String(v ?? "—"));
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
                <summary>Audit record · ISO 9001 §8.5.1 <span className="arrow">›</span></summary>
                <div style={{ paddingBottom: 12 }}>
                  {[
                    ["Tool", tool.tool_id],
                    ["Formula version", tool.formula_version],
                    ["Traceability ID", tool.traceability_id],
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

            {/* Export button */}
            <button className="btn" onClick={() => window.print()}>Export PDF report</button>
          </aside>
        </div>
      </div>

      {/* ===== Mobile Bar ===== */}
      <div className="mbar" style={{ display: "flex" }}>
        <div>
          <div className="ml">Result</div>
          <div className="mv">
            {(() => {
              const pk = tool.ui_contract.primary;
              const [pv, pu] = valFmt(outMeta(pk), computed[pk], ccy);
              return pv + " " + pu;
            })()}
          </div>
        </div>
        <div className="md">{decisionLabel}</div>
      </div>

      {/* ===== Popover Portal ===== */}
      {popover ? (
        <PopoverMenu
          options={popover.options}
          current={popover.current}
          onPick={handlePopoverPick}
          note={popover.note}
          anchorRect={popover.rect}
          onClose={closePopover}
        />
      ) : null}
    </div>
  );
}
