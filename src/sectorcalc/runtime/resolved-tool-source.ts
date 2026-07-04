// SectorCalc V5.3.1 — ResolvedToolSource type
// Source-aware resolution discriminator. Every resolved schema carries its provenance.

export type ResolvedToolSource =
  | "pro_v531"
  | "free_v531"
  | "industrial_free"
  | "legacy_generated";

export interface ToolRenderContract {
  toolKey: string;
  toolName: string;
  categoryLabel: string;
  operationLabel: string;
  scopeText: string;
  riskLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  schemaVersion: string;
  formulaVersion: string;
  inputs: readonly unknown[];
  normalizedInputs: readonly unknown[];
  outputs: readonly unknown[];
  formRuntimeBinding: {
    executeResponseContract: {
      redaction_status: string;
      status: string;
      pipeline_state: string;
    };
  };
  executeResponseContract: {
    redaction_status: string;
    status: string;
    pipeline_state: string;
  };
  redactionStatusContract: string;
  source: ResolvedToolSource;
  rawSchema?: unknown;
}

export interface BuildRenderContractInput {
  source: ResolvedToolSource;
  slug: string;
  schema: unknown;
}

export interface BuildRenderContractOk {
  ok: true;
  contract: ToolRenderContract;
}

export interface BuildRenderContractFail {
  ok: false;
  reason: string;
  detail: string;
  slug: string;
  source: ResolvedToolSource;
}

export type BuildRenderContractResult =
  | BuildRenderContractOk
  | BuildRenderContractFail;
