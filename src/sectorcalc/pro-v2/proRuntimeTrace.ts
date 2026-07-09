// SectorCalc PRO V2 — Runtime Trace
// Debug mode: /tools/pro/[slug]?debugRuntime=1
// Visible only in development or for owner/superadmin.

export type TraceEventType =
  | "PRO_V2_CLICK"
  | "PRO_V2_VALIDATE_END"
  | "PRO_V2_SESSION_START"
  | "PRO_V2_SESSION_END"
  | "PRO_V2_EXECUTE_START"
  | "PRO_V2_EXECUTE_END"
  | "PRO_V2_STATE"
  | "PRO_V2_RESULT_PANEL"
  | "PRO_V2_CONTROLLED_ERROR";

export interface TraceEvent {
  event: TraceEventType;
  traceId: string;
  slug: string;
  timestamp: string;
  executionState?: string;
  usageSessionIdPresent?: boolean;
  httpStatus?: number;
  pipeline_state?: string;
  outputCount?: number;
  errorCode?: string;
}

let traceEnabled = false;
let currentSlug = "";

export function enableRuntimeTrace(slug: string): void {
  traceEnabled = true;
  currentSlug = slug;
}

export function disableRuntimeTrace(): void {
  traceEnabled = false;
  currentSlug = "";
}

export function isTraceEnabled(): boolean {
  return traceEnabled;
}

export function emitTraceEvent(event: Omit<TraceEvent, "timestamp">): void {
  if (!traceEnabled) return;

  const fullEvent: TraceEvent = {
    ...event,
    timestamp: new Date().toISOString(),
  };

  if (typeof window !== "undefined") {
    console.log("[PRO_V2_TRACE]", JSON.stringify(fullEvent));
  }
}
