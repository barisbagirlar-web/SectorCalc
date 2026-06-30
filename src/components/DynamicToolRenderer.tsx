/**
 * ═══════════════════════════════════════════════════════════════════════════
 * SECTORCALC PRO — DYNAMIC TOOL RENDERER (Industrial Grade v2.0)
 * ───────────────────────────────────────────────────────────────────────────
 * Schema-driven, mobile-responsive, WCAG 2.1 AA accessible form renderer.
 *  - Real-time calculation on input change
 *  - Conditional visibility for dependent fields
 *  - Reference value quick-input buttons
 *  - Fail-closed error display
 *  - GUM uncertainty results
 *  - Audit trail display
 * ═══════════════════════════════════════════════════════════════════════════
 */
"use client";

import React, { useState, useEffect, useCallback } from "react";
import type {
  ToolSchema,
  InputField,
} from "@/types/tool-schema";
import { ExpressionEngine } from "@/engine/expression-evaluator";
import { AuditService, type AuditRecord } from "@/services/audit-service";

// ── PROPS

export interface DynamicToolRendererProps {
  schema: ToolSchema;
  engine?: ExpressionEngine;
  auditService?: AuditService;
  locale?: string;
}

// ── CONSTANTS

const CONFIDENCE_COLORS: Record<string, string> = {
  EXACT:     "#16a34a",
  STRONG:    "#2563eb",
  MODERATE:  "#ca8a04",
  DEFAULT:   "#6b7280",
};

const CONFIDENCE_LABELS: Record<string, string> = {
  EXACT:     "EXACT",
  STRONG:    "STRONG",
  MODERATE:  "MODERATE",
  DEFAULT:   "DEFAULT",
};

// ── COMPONENT

export const DynamicToolRenderer: React.FC<DynamicToolRendererProps> = ({
  schema,
  engine: engineProp,
  auditService: auditServiceProp,
  locale = "en-US",
}) => {
  const engine = engineProp ?? new ExpressionEngine();
  const auditService = auditServiceProp ?? new AuditService();

  const [values, setValues] = useState<Record<string, number>>({});
  const [output, setOutput] = useState<any>(null);
  const [auditRecord, setAuditRecord] = useState<AuditRecord | null>(null);
  const [isComputing, setIsComputing] = useState(false);
  const [expandedAudit, setExpandedAudit] = useState(false);

  useEffect(() => {
    const defaults: Record<string, number> = {};
    schema.inputs.forEach(i => { if (i.defaultValue !== undefined) defaults[i.id] = i.defaultValue; });
    setValues(prev => Object.keys(prev).length === 0 ? defaults : prev);
  }, [schema]);

  useEffect(() => {
    const hasValue = Object.keys(values).length > 0;
    if (!hasValue) return;
    setIsComputing(true);

    const runCompute = async () => {
      const compResult = engine.compute(schema, values);
      setOutput(compResult);

      if (compResult.errors.length === 0 && Object.keys(compResult.results).length > 0) {
        const record = await auditService.createAuditRecord(schema.id, values, compResult.results);
        setAuditRecord(record);
      }
      setIsComputing(false);
    };
    runCompute();
  }, [values, schema, engine, auditService]);

  const handleInputChange = useCallback((id: string, rawValue: string) => {
    const numValue = rawValue === "" ? 0 : parseFloat(rawValue);
    if (isNaN(numValue)) return;
    setValues(prev => ({ ...prev, [id]: numValue }));
  }, []);

  const isFieldVisible = useCallback((field: InputField): boolean => {
    if (!field.dependsOn) return true;
    const dep = field.dependsOn;
    const depValue = values[dep.fieldId];
    switch (dep.operator) {
      case "eq":   return depValue === dep.value;
      case "neq":  return depValue !== dep.value;
      case "gt":   return depValue > (dep.value as number);
      case "lt":   return depValue < (dep.value as number);
      case "gte":  return depValue >= (dep.value as number);
      case "lte":  return depValue <= (dep.value as number);
      default:     return true;
    }
  }, [values]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-4 max-w-7xl mx-auto" role="main" aria-label={`${schema.name} calculation tool`}>
      {/* ═══ SOL PANEL: INPUTS (lg:col-span-4) ═══ */}
      <div className="lg:col-span-4 space-y-6">
        <div className="bg-white shadow-sm rounded-lg p-6 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">{schema.name}</h2>
          <div className="space-y-5">
            {schema.inputs.map((field) => {
              if (!isFieldVisible(field)) return null;

              const confidenceColor = CONFIDENCE_COLORS[field.confidence] ?? "#6b7280";
              const confidenceLabel = CONFIDENCE_LABELS[field.confidence] ?? field.confidence;

              return (
                <div key={field.id} className="form-group">
                  <label htmlFor={`input-${field.id}`}
                    className="flex flex-col sm:flex-row sm:items-center justify-between text-sm font-medium text-gray-700 mb-1 gap-2">
                    <span className="break-words whitespace-normal leading-tight">
                      {field.label}
                      <span className="text-xs text-gray-400 ml-1">({field.symbol})</span>
                      {field.required && <span className="text-red-500 ml-1">*</span>}
                    </span>
                    <span className="inline-flex shrink-0 self-start sm:self-auto px-2 py-0.5 rounded text-xs font-medium text-white"
                      style={{ backgroundColor: confidenceColor }}>{confidenceLabel}</span>
                  </label>

                  <div className="relative">
                    {field.type === "select" && field.enum ? (
                      <select id={`input-${field.id}`}
                        value={values[field.id] ?? field.defaultValue ?? ""}
                        onChange={(e) => handleInputChange(field.id, e.target.value)}
                        className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 sm:text-sm bg-white"
                        tabIndex={0}>
                        {field.enum.map(opt => (
                          <option key={String(opt.value)} value={String(opt.value)}>{opt.label}</option>
                        ))}
                      </select>
                    ) : field.type === "boolean" ? (
                      <div className="flex items-center">
                        <input type="checkbox" id={`input-${field.id}`}
                          checked={!!values[field.id]}
                          onChange={(e) => handleInputChange(field.id, e.target.checked ? "1" : "0")}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" tabIndex={0} />
                        <span className="ml-2 text-sm text-gray-600">{values[field.id] ? "Yes / True" : "No / False"}</span>
                      </div>
                    ) : (
                      <input type="number" id={`input-${field.id}`}
                        value={values[field.id] ?? ""}
                        onChange={(e) => handleInputChange(field.id, e.target.value)}
                        placeholder={field.defaultValue?.toString()}
                        min={field.min} max={field.max}
                        className="block w-full pl-3 pr-14 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 sm:text-sm transition-colors"
                        tabIndex={0} />
                    )}
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <span className="text-gray-400 text-xs font-mono uppercase tracking-wide">{field.unitRef}</span>
                    </div>
                  </div>

                  {/* GAP 5: Reference Values — Quick Input Buttons */}
                  {field.referenceValues && field.referenceValues.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {field.referenceSource && (
                        <span className="text-xs text-gray-400 font-medium self-center mr-1" title={field.referenceSource}>Ref:</span>
                      )}
                      {field.referenceValues.map((ref, idx) => {
                        const val = typeof ref === "number" ? ref : ref.value;
                        const lbl = typeof ref === "number" ? String(ref) : ref.label;
                        return (
                          <button key={idx} type="button"
                            onClick={() => handleInputChange(field.id, String(val))}
                            title={field.referenceSource ?? lbl}
                            className="px-2 py-0.5 text-xs bg-gray-50 hover:bg-blue-100 text-gray-600 hover:text-blue-700 rounded border border-gray-200 hover:border-blue-300 transition-colors cursor-pointer"
                            tabIndex={0}>{lbl}</button>
                        );
                      })}
                    </div>
                  )}

                  {field.description && <p className="mt-1 text-xs text-gray-500">{field.description}</p>}
                  {field.uncertainty && (
                    <p className="mt-1 text-xs text-amber-600">
                      ±{typeof field.uncertainty.value === "string" ? field.uncertainty.value : `${field.uncertainty.value} ${field.unitRef}`}
                      ({field.uncertainty.type}-type, {field.uncertainty.distribution})
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ═══ RIGHT PANEL: RESULTS & AUDIT (lg:col-span-8) ═══ */}
      <div className="lg:col-span-8 space-y-6">
        {/* Error / Warning */}
        {output && (output.errors.length > 0 || output.warnings.length > 0) && (
          <div className={`rounded-lg p-4 border-l-4 ${output.errors.length > 0 ? "bg-red-50 border-red-500" : "bg-yellow-50 border-yellow-500"}`} role="alert">
            {output.errors.map((e: string, i: number) => (
              <div key={i} className="flex items-start mb-1 last:mb-0">
                <span className="text-red-600 font-bold mr-2">⛔</span>
                <span className="text-red-700 text-sm font-semibold">{e}</span>
              </div>
            ))}
            {output.warnings.map((w: string, i: number) => (
              <div key={`w-${i}`} className="flex items-start mb-1 last:mb-0">
                <span className="text-yellow-600 font-bold mr-2">⚠</span>
                <span className="text-yellow-700 text-sm">{w}</span>
              </div>
            ))}
          </div>
        )}

        {/* Results */}
        {output && output.errors.length === 0 && Object.keys(output.results).length > 0 && (
          <div className="bg-white shadow-sm rounded-lg p-6 border border-gray-200">
            <h3 className="text-lg font-bold mb-4 text-gray-800">
              Results
              <span className="ml-2 text-xs font-normal text-gray-400">{new Date(output.timestamp).toLocaleString(locale)}</span>
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {Object.entries(output.results)
                .filter(([key]) => !schema.inputs.some(i => i.id === key))
                .map(([key, value]) => {
                  const formula = schema.formulas.find(f => f.outputVar === key);
                  return (
                    <div key={key} className="bg-gray-50 p-3 rounded border border-gray-100">
                      <div className="flex flex-col gap-1 items-start justify-between">
                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide break-words w-full">{key}</span>
                        <span className="text-xs font-mono text-gray-400 shrink-0">{formula?.unitRef ?? ""}</span>
                      </div>
                      <div className="text-lg sm:text-xl font-mono font-semibold text-gray-900 mt-2 break-all">
                        {typeof value === "number"
                          ? value.toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 4 })
                          : String(value)}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* GUM Uncertainty */}
        {output?.uncertainty && (
          <div className="bg-white shadow-sm rounded-lg p-6 border border-gray-200">
            <h3 className="text-lg font-bold mb-4 text-gray-800">
              Measurement Uncertainty (GUM)
              <span className="ml-2 text-xs font-normal text-gray-400">JCGM 100:2008</span>
            </h3>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-gray-50 p-3 rounded border border-gray-100">
                <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Standart u<sub>c</sub></div>
                <div className="text-lg font-mono font-semibold text-gray-900 mt-1">
                  {output.uncertainty.standard.toLocaleString(locale, { minimumFractionDigits: 4, maximumFractionDigits: 6 })}
                </div>
              </div>
              <div className="bg-gray-50 p-3 rounded border border-gray-100">
                <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Expanded U (k={output.uncertainty.coverageFactor})</div>
                <div className="text-lg font-mono font-semibold text-gray-900 mt-1">
                  {output.uncertainty.expanded.toLocaleString(locale, { minimumFractionDigits: 4, maximumFractionDigits: 6 })}
                </div>
              </div>
              <div className="bg-gray-50 p-3 rounded border border-gray-100">
                <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Coverage Factor k</div>
                <div className="text-lg font-mono font-semibold text-gray-900 mt-1">
                  {output.uncertainty.coverageFactor}
                  <span className="text-xs text-gray-400 ml-1">(~%95 GA)</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Audit Trail */}
        {auditRecord && (
          <div className="bg-white shadow-sm rounded-lg p-6 border border-gray-200">
            <button onClick={() => setExpandedAudit(!expandedAudit)}
              className="w-full flex items-center justify-between" aria-expanded={expandedAudit} tabIndex={0}>
              <h3 className="text-lg font-bold text-gray-800">Audit Trail & Yorumlar</h3>
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded text-gray-500">
                  {auditRecord.inputHash.substring(0, 12)}...
                </span>
                <svg className={`w-5 h-5 text-gray-400 transition-transform ${expandedAudit ? "rotate-180" : ""}`}
                  fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </button>

            {expandedAudit && (
              <div className="mt-4 space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm bg-gray-50 p-3 rounded">
                  <div><span className="text-gray-500">Tool:</span><span className="ml-2 font-mono">{auditRecord.toolId}</span></div>
                  <div><span className="text-gray-500">Timestamp:</span><span className="ml-2">{new Date(auditRecord.timestamp).toLocaleString(locale)}</span></div>
                  <div className="col-span-2"><span className="text-gray-500">Input Hash (SHA-256):</span>
                    <span className="ml-2 font-mono text-xs break-all">{auditRecord.inputHash}</span></div>
                </div>

                {auditRecord.comments.map(comment => (
                  <div key={comment.id} className="border-l-2 border-blue-500 pl-4 py-2">
                    <div className="flex justify-between text-xs text-gray-500">
                      <span className="font-medium">{comment.authorRole}</span>
                      <span>{new Date(comment.timestamp).toLocaleString(locale)}</span>
                    </div>
                    <p className="text-sm text-gray-800 mt-1">{comment.content}</p>
                    {comment.signature && <p className="text-xs text-gray-400 mt-1 font-mono">sig: {comment.signature.substring(0, 16)}...</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DynamicToolRenderer;
