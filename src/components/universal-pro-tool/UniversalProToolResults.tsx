/**
 * UniversalProToolResults — Schema-driven results panel
 * Renders UC gauge, verdict banner, warnings, and result table
 * using exact CSS classes from UNIVERSAL PRO TOOL FORM.txt
 */
"use client";

import type { ToolSchemaOutput } from "@/lib/features/tool-schemas/types";

function fmt(value: any, decimals = 3): string {
  if (value === null || value === undefined || isNaN(value)) return "—";
  const abs = Math.abs(value);
  if (abs === 0) return "0";
  if (abs >= 1e6) return Number(value).toExponential(2);
  if (abs >= 1000) return Number(value).toLocaleString("en-US", { maximumFractionDigits: 1 });
  if (abs >= 1) return Number(value).toLocaleString("en-US", { maximumFractionDigits: decimals });
  if (abs >= 0.01) return Number(value).toLocaleString("en-US", { maximumFractionDigits: decimals + 1 });
  return Number(value).toExponential(2);
}

function ucClass(UC?: number): string {
  if (!UC || UC <= 0.9) return "pass";
  if (UC <= 1.0) return "warn";
  return "fail";
}

function ucColor(UC?: number): string {
  if (!UC || UC <= 0.9) return "#059669";
  if (UC <= 1.0) return "#D97706";
  return "#DC2626";
}

function ucFillWidth(UC?: number): number {
  if (!UC) return 0;
  return Math.min(Math.max(UC * 100, 0), 150);
}

interface UniversalProToolResultsProps {
  tool: any;
  calculated: boolean;
  results: any;
  warnings: Array<{ severity: string; source: string; message: string }>;
  outputDefinitions?: ToolSchemaOutput[];
}

export default function UniversalProToolResults({
  tool,
  calculated,
  results,
  warnings,
  outputDefinitions,
}: UniversalProToolResultsProps) {
  if (!calculated || !results) {
    return (
      <div className="panel">
        <div className="empty-state">
          <div className="empty-state-icon">⚙</div>
          <p>No calculation performed. Enter parameters in the Inputs tab and click Calculate.</p>
        </div>
      </div>
    );
  }

  const UC = results.UC;
  const status = results.status || (UC && UC > 1.0 ? "FAIL" : UC && UC > 0.9 ? "WARN" : "PASS");
  const uClass = ucClass(UC);
  const statusBadgeCls = status === "PASS" ? "badge-ok" : status === "WARN" ? "badge-warn" : "badge-crit";
  const statusText = status === "PASS" ? "PASS" : status === "WARN" ? "WARN" : "FAIL";

  const outputs: ToolSchemaOutput[] = outputDefinitions || tool.outputs || [];

  // Collect result fields that the tool outputs define
  const resultFields = outputs.length > 0
    ? outputs
    : Object.entries(results)
        .filter(([k]) => !["warnings", "steps", "audit", "fmea", "status"].includes(k))
        .map(([k, v]) => ({
          id: k,
          name: k.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase()),
          unit: typeof v === "number" ? "" : "",
          group: "results",
        }));

  return (
    <div className="panel">
      {/* Warnings */}
      {warnings.length > 0 && (
        <div className="warn-panel">
          {warnings.map((w, i) => (
            <div key={i} className={`warn-card ${w.severity}`}>
              <div className="warn-hdr">
                <span className="warn-sev">{w.severity}</span>
                {w.source && <span className="warn-src">{w.source}</span>}
              </div>
              <div className="warn-msg">{w.message}</div>
            </div>
          ))}
        </div>
      )}

      {/* OK banner on pass */}
      {status === "PASS" && warnings.length === 0 && (
        <div className="ok-banner">
          ✓ Section capacity verified — all utilization ratios within safe limits.
        </div>
      )}

      {/* UC Gauge */}
      {UC !== undefined && (
        <div className="uc-gauge-wrap">
          <div className="uc-gauge-hdr">
            <span className="uc-label">Governing Utilization (UC)</span>
            <span className={`uc-value-display ${uClass}`}>
              {fmt(UC, 3)}
            </span>
          </div>
          <div className="uc-gauge-track">
            <div
              className="uc-gauge-fill"
              style={{
                width: `${ucFillWidth(UC)}%`,
                background: ucColor(UC),
              }}
            />
          </div>
          <div className="uc-gauge-zones">
            <span className="uc-zone">0</span>
            <span className="uc-zone">0.90</span>
            <span className="uc-zone">1.00+</span>
          </div>
        </div>
      )}

      {/* Verdict banner */}
      {status && (
        <div className={`verdict-banner ${uClass}`}>
          <div className="verdict-icon">
            {status === "PASS" ? "✓" : status === "WARN" ? "⚠" : "✕"}
          </div>
          <div className="verdict-body">
            <div className="verdict-title">
              {status === "PASS" ? "Section Capacity Adequate" :
               status === "WARN" ? "Marginal — Engineering Review Required" :
               "Section Capacity INSUFFICIENT"}
            </div>
            <div className="verdict-sub">
              {results.governingMode ? `Governing: ${results.governingMode} · ` : ""}
              {results.designStandard ? `${results.designStandard}` : ""}
              {UC !== undefined ? ` · UC = ${fmt(UC, 3)}` : ""}
            </div>
          </div>
        </div>
      )}

      {/* Results Table */}
      {resultFields.length > 0 && (
        <div className="res-table">
          <div className="res-hdr">
            <span>Calculated Value</span>
            <span>Conf</span>
            <span>Result</span>
            <span>Unit</span>
          </div>
          {resultFields.map((field: any, i: number) => {
            const val = field.id ? results[field.id] : undefined;
            if (val === undefined || typeof val === "object") return null;
            const isUC = field.id?.toLowerCase().includes("uc");
            const isStatus = field.id === "status";
            const valClass = isUC ? ucClass(Number(val)) : isStatus ? "" : "";
            return (
              <div key={field.id || i} className="res-row">
                <div className="res-name">
                  {field.name || field.id}
                  {field.id && <span className="res-sym">{field.id}</span>}
                </div>
                <div className="res-conf">
                </div>
                <span className={`res-val ${valClass}`}>{fmt(val)}</span>
                <span className="res-unit">{field.unit || ""}</span>
              </div>
            );
          })}
        </div>
      )}

      {/* References */}
      {tool.standards && tool.standards.length > 0 && (
        <div className="refs-row">
          <span className="ref-ttl">Standards:</span>
          {tool.standards.map((s: string, i: number) => (
            <span key={i} className="ref-tag">{s}</span>
          ))}
        </div>
      )}
    </div>
  );
}
