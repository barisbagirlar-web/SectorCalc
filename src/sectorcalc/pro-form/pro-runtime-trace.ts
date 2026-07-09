// SectorCalc PRO Runtime Trace — P0 diagnostic traceId pipeline
// Generates a single traceId per Calculate click and logs every pipeline stage.
// In production, only logs if debugRuntime query parameter is present.

let _traceSlug: string | null = null;

export function generateTraceId(): string {
  const id = `trc_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  return id;
}

export function setTraceSlug(slug: string): void {
  _traceSlug = slug;
}

export function getTraceSlug(): string | null {
  return _traceSlug;
}

const IS_DEV = typeof process !== "undefined" && process.env?.NODE_ENV === "development";

export function proTrace(
  tag: string,
  data: Record<string, unknown>,
): void {
  if (!IS_DEV) return;
  // eslint-disable-next-line no-console
  console.log(`[${tag}]`, JSON.stringify(data));
}

export function isDebugRuntime(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const params = new URLSearchParams(window.location.search);
    return params.get("debugRuntime") === "1";
  } catch {
    return false;
  }
}

export function buildTraceEntry(
  traceId: string,
  tag: string,
  data: Record<string, unknown>,
): Record<string, unknown> {
  return { traceId, tag, ts: Date.now(), ...data };
}
