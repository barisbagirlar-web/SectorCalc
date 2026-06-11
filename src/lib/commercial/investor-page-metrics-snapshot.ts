/**
 * SSR-safe investor page metric snapshot — no fs/process.cwd().
 * Update trustTraceReady when `npm run audit:investor-demo` drift is confirmed in dev/CI.
 */

/** Last aligned with audit:investor-demo / batch-trust-trace from repo root (Phase 6E). */
export const INVESTOR_PAGE_TRUST_TRACE_READY = 113 as const;
