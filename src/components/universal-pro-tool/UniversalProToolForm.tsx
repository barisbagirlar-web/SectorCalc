"use client";
/**
 * UniversalProToolForm — Schema-driven input form renderer
 * Reads tool.inputs schema and dynamically renders form fields
 * using exact CSS classes from UNIVERSAL PRO TOOL FORM.txt
 */

import { useEffect, useMemo } from "react";
import type { ToolSchemaInput } from "@/lib/features/tool-schemas/types";

function confidenceClass(label?: string): string {
  if (!label) return "";
  const u = label.toUpperCase();
  if (u === "CERTAIN" || u === "HIGH" || u === "EXACT") return "conf-exact";
  if (u === "STRONG" || u === "MEDIUM") return "conf-strong";
  return "conf-approx";
}

function confidenceText(label?: string): string {
  if (!label) return "";
  const u = label.toUpperCase();
  if (u === "CERTAIN" || u === "HIGH" || u === "EXACT") return "Exact";
  if (u === "STRONG" || u === "MEDIUM") return "Strong";
  if (u === "DEFAULT" || u === "ASSUMPTION" || u === "LOW") return "Assumption";
  return label;
}

interface EnumInputProps {
  inp: ToolSchemaInput;
  value: any;
  onChange: (id: string, value: any) => void;
}

function EnumInput({ inp, value, onChange }: EnumInputProps) {
  const options = inp.options
    ? (typeof inp.options[0] === "string"
        ? (inp.options as string[]).map(o => ({ value: o, label: o }))
        : inp.options as { value: string; label: string }[])
    : [];

  return (
    <div className="inp-item">
      <label className="inp-lbl">
        {inp.name}
        {inp.required && <span className="req">*</span>}
        {inp.symbol && inp.symbol !== inp.id && (
          <span className="sym">[{inp.symbol}]</span>
        )}
        {inp.confidence_label && (
          <span className={`conf-badge ${confidenceClass(inp.confidence_label)}`}>
            {confidenceText(inp.confidence_label)}
          </span>
        )}
      </label>
      <div className="inp-row">
        <select
          value={value ?? ""}
          onChange={e => onChange(inp.id, e.target.value)}
        >
          <option value="">— Select —</option>
          {options.map((opt, i) => (
            <option key={i} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
      {inp.note && <div className="inp-meta"><span className="inp-hint">{inp.note}</span></div>}
    </div>
  );
}

interface NumericInputProps {
  inp: ToolSchemaInput;
  value: any;
  error?: string | null;
  onChange: (id: string, value: any) => void;
}

function NumericInput({ inp, value, error, onChange }: NumericInputProps) {
  const hintParts: string[] = [];
  if (inp.absolute_min !== undefined) hintParts.push(`Min: ${inp.absolute_min}`);
  if (inp.absolute_max !== undefined) hintParts.push(`Max: ${inp.absolute_max}`);

  return (
    <div className={`inp-item${error ? " has-err" : ""}`}>
      <label className="inp-lbl">
        {inp.name}
        {inp.required && <span className="req">*</span>}
        {inp.symbol && inp.symbol !== inp.id && (
          <span className="sym">[{inp.symbol}]</span>
        )}
        {inp.confidence_label && (
          <span className={`conf-badge ${confidenceClass(inp.confidence_label)}`}>
            {confidenceText(inp.confidence_label)}
          </span>
        )}
      </label>
      <div className="inp-row">
        <input
          type="number"
          value={value ?? ""}
          placeholder={inp.default !== undefined ? `Default: ${inp.default}` : ""}
          min={inp.absolute_min}
          max={inp.absolute_max}
          step={inp.resolution || "any"}
          onChange={e => onChange(inp.id, e.target.value)}
        />
        {inp.unit && <span className="inp-unit">{inp.unit}</span>}
      </div>
      <div className="inp-meta">
        {hintParts.length > 0 && <span className="inp-hint">{hintParts.join(" · ")}</span>}
        {inp.uncertainty && <span className="inp-unc">±{inp.uncertainty}</span>}
      </div>
      {inp.note && !error && <div className="inp-meta"><span className="inp-hint">{inp.note}</span></div>}
      {error && <div className="inp-err-msg">{error}</div>}
    </div>
  );
}

interface UniversalProToolFormProps {
  tool: any;
  inputValues: Record<string, any>;
  validErrors: Array<{ field: string; message: string; type: string }>;
  calculated: boolean;
  onChange: (id: string, value: any) => void;
  onCalculate: () => void;
  onReset: () => void;
}

export default function UniversalProToolForm({
  tool,
  inputValues,
  validErrors,
  calculated,
  onChange,
  onCalculate,
  onReset,
}: UniversalProToolFormProps) {
  const inputs: ToolSchemaInput[] = tool.inputs || [];

  const visibleInputs = useMemo(() => {
    return inputs.filter((inp: ToolSchemaInput) => {
      if (inp.visibleWhen) {
        const condVal = inputValues[inp.visibleWhen.field];
        return condVal === inp.visibleWhen.equals;
      }
      if (inp.conditional_on) {
        const condVal = inputValues[inp.conditional_on.field];
        return condVal === inp.conditional_on.value;
      }
      return true;
    });
  }, [inputs, inputValues]);

  const enumInputs = visibleInputs.filter((i: ToolSchemaInput) => i.type === "enum");
  const numInputs = visibleInputs.filter((i: ToolSchemaInput) => i.type !== "enum");

  const grouped = useMemo(() => {
    const groups: Record<string, ToolSchemaInput[]> = { _default: [] };
    for (const inp of numInputs) {
      const g = inp.group || "_default";
      if (!groups[g]) groups[g] = [];
      groups[g].push(inp);
    }
    return groups;
  }, [numInputs]);

  return (
    <div className="panel">
      {/* Enum / Standard Selection */}
      {enumInputs.length > 0 && (
        <>
          <div className="sec-lbl">Design Standard / Classification</div>
          <div className="enum-row">
            {enumInputs.map((inp: ToolSchemaInput) => (
              <div key={inp.id} className="enum-item">
                <EnumInput
                  inp={inp}
                  value={inputValues[inp.id] ?? ""}
                  onChange={onChange}
                />
              </div>
            ))}
          </div>
        </>
      )}

      {/* Numeric Inputs */}
      {Object.keys(grouped).length > 0 && (
        <div className="inp-grid">
          {Object.entries(grouped).map(([groupName, groupInputs]) => (
            <div key={groupName} style={{ gridColumn: "1/-1" }}>
              {groupName !== "_default" && (
                <div className="inp-group-title">{groupName.replace(/_/g, " ").toUpperCase()}</div>
              )}
              <div className="inp-grid" style={{ marginBottom: 0 }}>
                {groupInputs.map((inp: ToolSchemaInput) => (
                  <NumericInput
                    key={inp.id}
                    inp={inp}
                    value={inputValues[inp.id] ?? ""}
                    error={validErrors.find(e => e.field === inp.id)?.message || null}
                    onChange={onChange}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Validation errors */}
      {validErrors.length > 0 && (
        <div className="err-panel">
          {validErrors.map((e, i) => (
            <div key={i} className="err-item">
              <span className="err-code">BLOCK</span>
              <span className="err-msg">{e.message}</span>
            </div>
          ))}
        </div>
      )}

      {/* Action row */}
      <div className="action-row">
        <button className="calc-btn" onClick={onCalculate}>
          Calculate
        </button>
        {calculated && (
          <button className="reset-btn" onClick={onReset}>
            Reset
          </button>
        )}
        {tool.standards && (
          <div className="action-note">
            {tool.standards.slice(0, 3).join(" · ")}
          </div>
        )}
      </div>
    </div>
  );
}
