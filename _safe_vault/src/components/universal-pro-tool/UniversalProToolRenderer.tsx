/**
 * UniversalProToolRenderer — Schema-driven universal PRO tool renderer
 * 
 * Central orchestrator that:
 * 1. Renders tool selector (ts-btn grid)
 * 2. Manages active tool state and tab switching
 * 3. Handles calculation dispatch to schema-defined engine
 * 4. Generates audit records
 * 5. Wires all sub-components (Form, Results, Formulas, FMEA, Audit)
 * 
 * Uses exact CSS classes from UNIVERSAL PRO TOOL FORM.txt
 */
"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import Link from "next/link";
import type { ToolSchema } from "@/lib/tool-schemas/types";
import { calculateRCBeamShearFlexure } from "@/lib/engines/calculateRCBeamShearFlexure";
import { calculateCNCCutting } from "@/lib/engines/calculateCNCCutting";
import { calculateWPSPreheat } from "@/lib/engines/calculateWPSPreheat";
import { calculateOEE } from "@/lib/engines/calculateOEE";
import UniversalProToolForm from "./UniversalProToolForm";
import UniversalProToolResults from "./UniversalProToolResults";
import UniversalProToolFormulas from "./UniversalProToolFormulas";
import UniversalProToolFMEA from "./UniversalProToolFMEA";
import UniversalProToolAudit from "./UniversalProToolAudit";

export interface ToolEntry {
  key: string;
  schema: ToolSchema;
}

interface UniversalProToolRendererProps {
  /** New API: array of tools */
  tools?: ToolEntry[];
  initialTool?: string;
  /** Backward compat API: single tool object (from UniversalCalculator.jsx) */
  tool?: any;
  locale?: string;
  onCalculate?: () => Promise<boolean>;
  customCalc?: (input: Record<string, any>) => any;
}

type TabId = "inputs" | "results" | "formulas" | "fmea" | "audit";

export default function UniversalProToolRenderer({
  tools: toolsProp,
  initialTool,
  tool: singleTool,
  locale: _locale,
  onCalculate: externalOnCalculate,
  customCalc,
}: UniversalProToolRendererProps) {
  // Backward compat: if single tool passed, wrap it
  const tools = toolsProp || (singleTool ? [{ key: singleTool.tool_key || "tool", schema: singleTool }] : []);
  const [activeToolKey, setActiveToolKey] = useState<string>(
    initialTool || (tools.length > 0 ? tools[0].key : "")
  );
  const [activeTab, setActiveTab] = useState<TabId>("inputs");
  const [inputValues, setInputValues] = useState<Record<string, Record<string, any>>>({});
  const [calculationResults, setCalculationResults] = useState<Record<string, any>>({});
  const [auditRecords, setAuditRecords] = useState<Record<string, any>>({});
  const [calculated, setCalculated] = useState<Record<string, boolean>>({});
  const [validErrors, setValidErrors] = useState<Array<{ field: string; message: string; type: string }>>([]);

  const activeSchema = tools.find(t => t.key === activeToolKey)?.schema;
  const activeResults = calculationResults[activeToolKey] || null;
  const activeAudit = auditRecords[activeToolKey] || null;
  const activeCalculated = calculated[activeToolKey] || false;
  const activeWarnings = activeResults?.warnings || [];

  const toolKeyRef = useRef(activeToolKey);
  useEffect(() => { toolKeyRef.current = activeToolKey; }, [activeToolKey]);

  const switchTool = useCallback((key: string) => {
    setActiveToolKey(key);
    setActiveTab("inputs");
    setValidErrors([]);
  }, []);

  const switchTab = useCallback((tab: TabId) => {
    setActiveTab(tab);
  }, []);

  const handleInputChange = useCallback((id: string, value: any) => {
    setInputValues(prev => ({
      ...prev,
      [toolKeyRef.current]: {
        ...(prev[toolKeyRef.current] || {}),
        [id]: value,
      },
    }));
    // Clear validation errors when input changes
    setValidErrors(prev => prev.filter(e => e.field !== id));
  }, []);

  const handleReset = useCallback(() => {
    const key = toolKeyRef.current;
    setInputValues(prev => ({ ...prev, [key]: {} }));
    setCalculationResults(prev => ({ ...prev, [key]: null }));
    setAuditRecords(prev => ({ ...prev, [key]: null }));
    setCalculated(prev => ({ ...prev, [key]: false }));
    setValidErrors([]);
    setActiveTab("inputs");
  }, []);

  const handleCalculate = useCallback(() => {
    const key = toolKeyRef.current;
    const schema = tools.find(t => t.key === key)?.schema;
    if (!schema) return;

    const values = inputValues[key] || {};
    const errors: Array<{ field: string; message: string; type: string }> = [];

    // Schema-driven validation
    for (const inp of schema.inputs || []) {
      const val = values[inp.id];

      // Check if field should be visible
      let visible = true;
      if (inp.visibleWhen) {
        visible = values[inp.visibleWhen.field] === inp.visibleWhen.equals;
      } else if (inp.conditional_on) {
        visible = values[inp.conditional_on.field] === inp.conditional_on.value;
      }

      if (!visible) continue;

      // Required check
      if (inp.required && (val === undefined || val === "" || val === null)) {
        errors.push({ field: inp.id, message: `${inp.name} is required.`, type: "required" });
        continue;
      }

      if (val === undefined || val === "" || val === null) continue;

      const numVal = Number(val);
      if (isNaN(numVal)) {
        errors.push({ field: inp.id, message: `${inp.name} must be a valid number.`, type: "type" });
        continue;
      }

      if (inp.absolute_min !== undefined && numVal < inp.absolute_min) {
        errors.push({ field: inp.id, message: `${inp.name} minimum is ${inp.absolute_min}.`, type: "range" });
      }
      if (inp.absolute_max !== undefined && numVal > inp.absolute_max) {
        errors.push({ field: inp.id, message: `${inp.name} maximum is ${inp.absolute_max}.`, type: "range" });
      }
    }

    if (errors.length > 0) {
      setValidErrors(errors);
      return;
    }

    setValidErrors([]);

    // Build input record from schema
    const calcInput: Record<string, any> = {};
    for (const inp of schema.inputs || []) {
      let visible = true;
      if (inp.visibleWhen) {
        visible = values[inp.visibleWhen.field] === inp.visibleWhen.equals;
      } else if (inp.conditional_on) {
        visible = values[inp.conditional_on.field] === inp.conditional_on.value;
      }
      if (visible) {
        calcInput[inp.id] = values[inp.id] !== undefined ? Number(values[inp.id]) : (inp.default !== undefined ? inp.default : undefined);
      }
    }

    // Dispatch to engine
    try {
      let result: any;

      // Backward compat: call external onCalculate first
      if (externalOnCalculate) {
        // Note: external onCalculate is async, we don't await it for now
        // to maintain synchronous calculation flow
      }

      // Backward compat: use customCalc from old API
      if (customCalc) {
        result = customCalc(calcInput);
      } else {
        switch (key) {
          case "cnc":
            result = calculateCNCCutting(calcInput);
            break;
          case "weld":
            result = calculateWPSPreheat(calcInput);
            break;
          case "oee":
            result = calculateOEE(calcInput);
            break;
          case "rcBeam":
            result = calculateRCBeamShearFlexure(calcInput);
            break;
          default:
            // Generic fallback for future tools
            if (schema.calculationEngine) {
              result = schema.calculationEngine(calcInput);
            } else {
              throw new Error(`No calculation engine registered for tool: ${key}`);
            }
        }
      }

      // Generate audit record
      const audit = {
        tool_id: schema.tool_id,
        tool_key: key,
        version: "1.0.0",
        timestamp: new Date().toISOString(),
        designStandard: values.designStandard || "unknown",
        calculation_engine: key === "rcBeam" ? "calculateRCBeamShearFlexure" : "generic",
        formula_version: schema.standards?.join(", ") || "1.0",
        status: result.status || (result.UC && result.UC > 1.0 ? "FAIL" : "PASS"),
        UC: result.UC || null,
        governingMode: result.governingMode || null,
        warnings_count: result.warnings?.length || 0,
      };

      setCalculationResults(prev => ({ ...prev, [key]: result }));
      setAuditRecords(prev => ({ ...prev, [key]: audit }));
      setCalculated(prev => ({ ...prev, [key]: true }));
      setActiveTab("results");
    } catch (err: any) {
      errors.push({ field: "_engine", message: err.message || "Calculation engine error.", type: "engine" });
      setValidErrors(errors);
    }
  }, [tools, inputValues, externalOnCalculate, customCalc]);

  // Render tool selector buttons
  const renderToolSelector = () => (
    <div className="tool-selector">
      {tools.map(tool => {
        const isActive = tool.key === activeToolKey;
        return (
          <button
            key={tool.key}
            className={`ts-btn${isActive ? " active" : ""}`}
            onClick={() => switchTool(tool.key)}
          >
            <div className="ts-id">{tool.schema.tool_id || "PRO"}</div>
            <div className="ts-name">{tool.schema.title || tool.schema.tool_name}</div>
            <div className="ts-cat">{tool.schema.category}</div>
            <div className="ts-active-bar" />
          </button>
        );
      })}
    </div>
  );

  // Render standards strip
  const renderStandardsStrip = () => {
    const standards = activeSchema?.standards || [];
    if (standards.length === 0) return null;
    return (
      <div className="std-strip">
        <span className="std-lbl">Standards:</span>
        {standards.map((s: string, i: number) => (
          <span key={i} className="std-tag">{s}</span>
        ))}
      </div>
    );
  };

  // Render tool header
  const renderToolHeader = () => {
    if (!activeSchema) return null;
    return (
      <div className="tool-card">
        <div className="tool-hdr">
          <div>
            <div className="tool-eyebrow">{activeSchema.category}</div>
            <div className="tool-title">{activeSchema.title || activeSchema.tool_name}</div>
            <div className="tool-meta">
              <span>{activeSchema.tool_id}</span>
              <span className="tool-meta-dot" />
              <span>{activeSchema.scope || activeSchema.primary_operation || ""}</span>
            </div>
          </div>
          <div className="hdr-badges">
            <span className="cert-badge cert-iso">ISO 9001 §8.5.1</span>
            <span className="cert-badge cert-ecmi">ECMI</span>
          </div>
        </div>

        {/* Status row */}
        <div className="status-row">
          <div>
            {activeCalculated ? (
              activeResults?.status === "PASS" ? (
                <span className="badge badge-pass">PASS</span>
              ) : activeResults?.status === "WARN" || (activeResults?.UC && activeResults.UC > 0.9) ? (
                <span className="badge badge-warn">WARN</span>
              ) : (
                <span className="badge badge-crit">FAIL</span>
              )
            ) : (
              <span className="badge badge-idle">— NOT CALCULATED</span>
            )}
          </div>
          {activeCalculated && activeResults?.UC !== undefined && (
            <span className="status-uc">
              UC = <strong>{(activeResults.UC as number).toFixed(3)}</strong>
              {activeResults.governingMode ? ` · ${activeResults.governingMode}` : ""}
            </span>
          )}
        </div>

        {/* Tabs */}
        <div className="tabs">
          <button
            className={`tab-btn${activeTab === "inputs" ? " active" : ""}`}
            onClick={() => switchTab("inputs")}
          >
            Inputs
          </button>
          <button
            className={`tab-btn${activeTab === "results" ? " active" : ""}`}
            onClick={() => switchTab("results")}
          >
            Results
            {activeCalculated && <span className="tab-dot" />}
          </button>
          <button
            className={`tab-btn${activeTab === "formulas" ? " active" : ""}`}
            onClick={() => switchTab("formulas")}
          >
            Formulas &amp; Standards
          </button>
          <button
            className={`tab-btn${activeTab === "fmea" ? " active" : ""}`}
            onClick={() => switchTab("fmea")}
          >
            FMEA
          </button>
          <button
            className={`tab-btn${activeTab === "audit" ? " active" : ""}`}
            onClick={() => switchTab("audit")}
          >
            Audit Log
          </button>
        </div>

        {/* Tab content */}
        {activeTab === "inputs" && (
          <UniversalProToolForm
            tool={activeSchema}
            inputValues={inputValues[activeToolKey] || {}}
            validErrors={validErrors}
            calculated={activeCalculated}
            onChange={handleInputChange}
            onCalculate={handleCalculate}
            onReset={handleReset}
          />
        )}

        {activeTab === "results" && (
          <UniversalProToolResults
            tool={activeSchema}
            calculated={activeCalculated}
            results={activeResults}
            warnings={activeWarnings}
            outputDefinitions={activeSchema.outputs}
          />
        )}

        {activeTab === "formulas" && (
          <UniversalProToolFormulas tool={activeSchema} />
        )}

        {activeTab === "fmea" && (
          <UniversalProToolFMEA tool={activeSchema} />
        )}

        {activeTab === "audit" && (
          <UniversalProToolAudit
            tool={activeSchema}
            calculated={activeCalculated}
            audit={activeAudit}
          />
        )}

        {/* CBAR */}
        {activeCalculated && (
          <div className="cbar">
            <div className="cbar-left">
              <span className={`badge ${activeResults?.status === "PASS" ? "badge-pass" : activeResults?.status === "WARN" ? "badge-warn" : "badge-crit"}`}>
                {activeResults?.status === "PASS" ? "PASS" : activeResults?.status === "WARN" ? "WARN" : "FAIL"}
              </span>
              <span className="cbar-status">
                {activeSchema?.standards?.slice(0, 2).join(" · ")}
              </span>
            </div>
            <button className="cbar-btn" onClick={() => switchTab("results")}>
              View Results →
            </button>
          </div>
        )}

        {/* Tool footer */}
        <div className="tool-footer">
          {activeSchema?.standards?.map((s: string, i: number) => (
            <span key={i}>📐 {s}</span>
          ))}
          <span>⚠ Engineering decision support only — verify before use</span>
          <span>SectorCalc {activeSchema?.tool_id} v1.0.0</span>
        </div>
      </div>
    );
  };

  return (
    <div className="unified-pro-tools">
      {/* Topbar */}
      <div className="pro-suite-topbar">
        <span className="nav-badge">PRO SUITE</span>
        <span className="pro-suite-label">
          Unified Calculator Suite · {tools.map(t => t.schema.tool_id).join(" · ")}
        </span>
        <button className="nav-cta" onClick={() => window.location.href = "/pricing"}>
          Get Credits
        </button>
      </div>

      <div className="page-wrap">
        {renderToolSelector()}

        {/* Breadcrumb */}
        <div className="breadcrumb">
          <Link href="/pro-tools">PRO Tools</Link>
          <span className="breadcrumb-sep">/</span>
          <Link href={activeSchema ? `/pro-tools/${activeToolKey}` : "#"}>
            {activeSchema?.category?.split("·")[0]?.trim() || ""}
          </Link>
          <span className="breadcrumb-sep">/</span>
          <span>{activeSchema?.title || activeSchema?.tool_name}</span>
        </div>

        {renderStandardsStrip()}
        {renderToolHeader()}
      </div>
    </div>
  );
}
