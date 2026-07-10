// SectorCalc PRO V2 — Tool Registry
// Every migrated PRO slug must have exactly one registered definition.
// Unknown or incomplete definitions produce a controlled contract error.

import type { ProFieldGroup } from "./proFieldContract";

// ── Preset ─────────────────────────────────────────────────────────────

export interface ProPreset {
  label: string;
  values: Record<string, string>;
  units: Record<string, string>;
}

// ── Adapter types ──────────────────────────────────────────────────────

export interface ServerContract {
  toolKey: string;
  toolId: string;
  schemaVersion: string;
  requiredInputKeys: string[];
  optionalInputKeys: string[];
  expectedOutputKeys: string[];
}

export type ProExecutePayloadAdapter = (
  fieldState: Record<string, { value: string; unit: string }>,
  hiddenValues: Record<string, number>,
) => {
  raw_inputs: Record<string, number>;
  selected_units: Record<string, string>;
};

import type { ProInsightReport } from "./proInsightContract";

export type ProReportAdapter = (params: {
  toolName: string;
  outputs: Record<string, number>;
  warnings: Array<{ id: string; severity: string; message: string }>;
  displayInputs: Record<string, { value: string; unit: string }>;
  engineInputs: Record<string, number>;
  traceId?: string;
}) => ProInsightReport;

export interface ReportCapabilities {
  primaryKpis: boolean;
  decisionState: boolean;
  executiveInterpretation: boolean;
  breakdown: boolean;
  scenarioComparison: boolean;
  sensitivity: boolean;
  hiddenLosses: boolean;
  missedAssumptions: boolean;
  riskWarnings: boolean;
  checklist: boolean;
  recommendations: boolean;
  pdfExport: boolean;
}

// ── Tool definition ────────────────────────────────────────────────────

export interface ProV2ToolDefinition {
  slug: string;
  title: string;
  category: string;

  fieldContract: ProFieldGroup[];
  presets: ProPreset[];

  serverContract: ServerContract;

  buildExecutePayload: ProExecutePayloadAdapter;
  buildReport: ProReportAdapter;

  reportCapabilities: ReportCapabilities;
}

// ── Registry ────────────────────────────────────────────────────────────

const registry = new Map<string, ProV2ToolDefinition>();

export function registerTool(def: ProV2ToolDefinition): void {
  if (registry.has(def.slug)) {
    throw new Error(
      `[PRO_V2_REGISTRY] Duplicate registration for slug: ${def.slug}`,
    );
  }
  registry.set(def.slug, def);
}

export function getToolDefinition(slug: string): ProV2ToolDefinition | undefined {
  return registry.get(slug);
}

export function getRegisteredSlugs(): string[] {
  return Array.from(registry.keys());
}

export function getAllToolDefinitions(): ProV2ToolDefinition[] {
  return Array.from(registry.values());
}
