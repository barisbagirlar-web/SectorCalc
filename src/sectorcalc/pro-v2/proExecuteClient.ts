// SectorCalc PRO V2 — Execute Client
// POST /api/pro-calculator/execute with usageSessionId as explicit argument.
// No stale usageSessionId from props/state. One click = one execute request.

export interface ExecuteRequest {
  tool_key: string;
  tool_id: string;
  schema_version: string;
  raw_inputs: Record<string, unknown>;
  selected_units: Record<string, string>;
  engine_inputs: Record<string, number | string>;
  evidence_state: Record<string, unknown>;
  client_schema_hash: string;
  usageSessionId: string;
}

export interface ExecuteResult {
  ok: true;
  status: string;
  pipeline_state: string;
  outputs: Array<{
    id: string;
    name: string;
    value: number;
    status: string;
    public_explanation?: string;
    decision_use?: string;
  }>;
  warnings: Array<{
    id: string;
    severity: string;
    message: string;
    why_it_matters?: string;
    suggested_action?: string;
  }>;
}

export interface ExecuteError {
  ok: false;
  status: number;
  error: string;
}

export type ExecuteResponse = ExecuteResult | ExecuteError;

/**
 * Execute a PRO calculation with the given usageSessionId.
 * usageSessionId is passed as an explicit argument — never read from stale state.
 */
export async function executeWithUsageSession(
  endpoint: string,
  body: ExecuteRequest,
): Promise<ExecuteResponse> {
  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok) {
      return {
        ok: false,
        status: res.status,
        error: data.error ?? "EXECUTE_FAILED",
      };
    }

    return {
      ok: true,
      status: data.status ?? "OK",
      pipeline_state: data.pipeline_state ?? "completed",
      outputs: data.outputs ?? [],
      warnings: data.warnings ?? [],
    };
  } catch (err) {
    return {
      ok: false,
      status: 0,
      error: err instanceof Error ? err.message : "NETWORK_ERROR",
    };
  }
}
