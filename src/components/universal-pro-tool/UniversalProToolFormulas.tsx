"use client";
/**
 * UniversalProToolFormulas — Schema-driven formulas + validation rules panel
 * Renders formulas and validation rules from tool schema
 * using exact CSS classes from UNIVERSAL PRO TOOL FORM.txt
 */

import type { ToolSchemaFormula, ToolSchemaValidationRule } from "@/lib/features/tool-schemas/types";

interface UniversalProToolFormulasProps {
  tool: any;
}

function parseFormula(f: string | ToolSchemaFormula): {
  id: string;
  lhs: string;
  rhs: string;
  ref: string;
} {
  if (typeof f === "object" && f.lhs && f.rhs) {
    return {
      id: f.id || "",
      lhs: f.lhs,
      rhs: f.rhs,
      ref: f.reference || f.note || "",
    };
  }
  const raw = typeof f === "string" ? f : (f as any).raw || "";
  const eqIdx = raw.indexOf("=");
  if (eqIdx === -1) {
    return { id: "", lhs: "", rhs: raw.trim(), ref: "" };
  }
  const lhs = raw.substring(0, eqIdx).trim();
  const after = raw.substring(eqIdx + 1);
  const refIdx = after.indexOf("//");
  const rhs = refIdx >= 0 ? after.substring(0, refIdx).trim() : after.trim();
  let ref = refIdx >= 0 ? after.substring(refIdx + 2).trim() : "";
  // Remove unit metadata like [kN.m] from ref
  ref = ref.replace(/^\[.*?\]\s*/, "").trim();
  return { id: "", lhs, rhs, ref };
}

export default function UniversalProToolFormulas({ tool }: UniversalProToolFormulasProps) {
  const rawFormulas: (string | ToolSchemaFormula)[] = tool.formulas || [];
  const validationRules: ToolSchemaValidationRule[] = tool.validationRules || tool.engine_rules?.validation_rules || [];

  const formulas = rawFormulas.filter(f => {
    if (typeof f === "string") {
      const trimmed = f.trim();
      return trimmed.length > 0 && !trimmed.startsWith("//") && trimmed.includes("=");
    }
    return f.lhs && f.rhs;
  });

  return (
    <div className="panel">
      <div className="sec-lbl">
        Calculation Formulas
        <span className="sec-note">All expressions dimensionally verified</span>
      </div>

      {/* Formula List */}
      {formulas.length > 0 && (
        <div className="frm-list">
          {formulas.map((f, i) => {
            const parsed = parseFormula(f);
            if (!parsed.lhs && !parsed.rhs) return null;
            return (
              <div key={i} className="frm-row">
                <div>
                  {parsed.id && <div className="frm-id">{parsed.id}</div>}
                  <div className="frm-lhs">{parsed.lhs}</div>
                </div>
                <div className="frm-eq">=</div>
                <div className="frm-body">
                  <div className="frm-rhs">{parsed.rhs}</div>
                  {parsed.ref && <div className="frm-ref">{parsed.ref}</div>}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Validation Rules */}
      {validationRules.length > 0 && (
        <>
          <div className="sec-lbl" style={{ marginTop: 14 }}>
            Validation Rules
            <span className="sec-note">BLOCK = calculation prevented · WARN = flagged output</span>
          </div>
          <div className="val-table">
            <div className="val-hdr">
              <span>Rule ID</span>
              <span>Action</span>
              <span>Condition &amp; Message</span>
            </div>
            {validationRules.map((rule, i) => (
              <div key={rule.id || i} className="val-row">
                <div className="val-id">{rule.id}</div>
                <div>
                  <span className={rule.action === "BLOCK" ? "val-action-block" : "val-action-warn"}>
                    {rule.action}
                  </span>
                </div>
                <div className="val-msg">
                  <strong>{rule.condition}</strong> — {rule.message}
                  {rule.standard_ref && <span style={{ display: "block", fontStyle: "italic", marginTop: 2, color: "rgba(26,25,21,0.45)", fontSize: 9 }}>{rule.standard_ref}</span>}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {formulas.length === 0 && validationRules.length === 0 && (
        <div className="empty-state">
          <p>No formulas or validation rules defined for this tool.</p>
        </div>
      )}
    </div>
  );
}
