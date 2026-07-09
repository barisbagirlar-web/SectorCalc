// SectorCalc PRO V2 — Runtime Reducer
// Defines all possible execution states and transitions.

export type ProV2ExecutionState =
  | "idle"                  // before first Calculate
  | "client_blocked"        // local validation failed
  | "auth_required"         // not signed in
  | "session_minting"       // creating credit session
  | "entitlement_required"  // insufficient credits
  | "session_mint_failed"   // session creation error
  | "executing"             // executing calculation
  | "server_ok"             // successful result
  | "server_review"         // server returned review status
  | "server_blocked"        // server blocked execution
  | "server_reprice"        // server reprice needed
  | "engine_error"          // server engine error
  | "contract_error"        // response contract mismatch
  | "network_error";        // network failure

export interface ProV2RuntimeState {
  executionState: ProV2ExecutionState;
  blockers: Array<{ fieldId: string; message: string; severity: string }>;
  serverResult: Record<string, unknown> | null;
  serverWarnings: Array<{ id: string; severity: string; message: string }>;
  usageSessionId: string | null;
  remainingRuns: number | null;
  errorMessage: string | null;
  traceId: string | null;
}

export const INITIAL_RUNTIME_STATE: ProV2RuntimeState = {
  executionState: "idle",
  blockers: [],
  serverResult: null,
  serverWarnings: [],
  usageSessionId: null,
  remainingRuns: null,
  errorMessage: null,
  traceId: null,
};

export type ProV2RuntimeAction =
  | { type: "RESET" }
  | { type: "SET_TRACE_ID"; traceId: string }
  | { type: "CLIENT_BLOCKED"; blockers: ProV2RuntimeState["blockers"] }
  | { type: "AUTH_REQUIRED" }
  | { type: "SESSION_MINTING" }
  | { type: "ENTITLEMENT_REQUIRED"; message?: string }
  | { type: "SESSION_MINTED"; usageSessionId: string; remainingRuns: number }
  | { type: "SESSION_MINT_FAILED"; error: string }
  | { type: "EXECUTING" }
  | { type: "SERVER_OK"; result: Record<string, unknown>; warnings: ProV2RuntimeState["serverWarnings"] }
  | { type: "SERVER_REVIEW"; result: Record<string, unknown>; warnings: ProV2RuntimeState["serverWarnings"] }
  | { type: "SERVER_BLOCKED"; result: Record<string, unknown> }
  | { type: "SERVER_REPRICE"; result: Record<string, unknown> }
  | { type: "ENGINE_ERROR"; error: string }
  | { type: "CONTRACT_ERROR"; error: string }
  | { type: "NETWORK_ERROR"; error: string };

export function proV2RuntimeReducer(
  state: ProV2RuntimeState,
  action: ProV2RuntimeAction,
): ProV2RuntimeState {
  switch (action.type) {
    case "RESET":
      return { ...INITIAL_RUNTIME_STATE };

    case "SET_TRACE_ID":
      return { ...state, traceId: action.traceId };

    case "CLIENT_BLOCKED":
      return {
        ...state,
        executionState: "client_blocked",
        blockers: action.blockers,
        serverResult: null,
        serverWarnings: [],
      };

    case "AUTH_REQUIRED":
      return { ...state, executionState: "auth_required", serverResult: null };

    case "SESSION_MINTING":
      return { ...state, executionState: "session_minting" };

    case "ENTITLEMENT_REQUIRED":
      return {
        ...state,
        executionState: "entitlement_required",
        errorMessage: action.message ?? "Insufficient credits. Please purchase more.",
      };

    case "SESSION_MINTED":
      return {
        ...state,
        executionState: "idle",
        usageSessionId: action.usageSessionId,
        remainingRuns: action.remainingRuns,
      };

    case "SESSION_MINT_FAILED":
      return {
        ...state,
        executionState: "session_mint_failed",
        errorMessage: action.error,
      };

    case "EXECUTING":
      return { ...state, executionState: "executing", serverResult: null };

    case "SERVER_OK":
      return {
        ...state,
        executionState: "server_ok",
        serverResult: action.result,
        serverWarnings: action.warnings,
        errorMessage: null,
      };

    case "SERVER_REVIEW":
      return {
        ...state,
        executionState: "server_review",
        serverResult: action.result,
        serverWarnings: action.warnings,
      };

    case "SERVER_BLOCKED":
      return {
        ...state,
        executionState: "server_blocked",
        serverResult: action.result,
        errorMessage: "Server blocked this calculation.",
      };

    case "SERVER_REPRICE":
      return {
        ...state,
        executionState: "server_reprice",
        serverResult: action.result,
        errorMessage: "Server requires reprice.",
      };

    case "ENGINE_ERROR":
      return {
        ...state,
        executionState: "engine_error",
        errorMessage: action.error,
      };

    case "CONTRACT_ERROR":
      return {
        ...state,
        executionState: "contract_error",
        errorMessage: action.error,
      };

    case "NETWORK_ERROR":
      return {
        ...state,
        executionState: "network_error",
        errorMessage: action.error,
      };

    default:
      return state;
  }
}
