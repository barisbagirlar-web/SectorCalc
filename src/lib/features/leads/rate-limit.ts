import { isBrowser } from "@/lib/features/leads/storage";

const RATE_LIMIT_STORAGE_KEY = "sectorcalc:lead-rate-limit";
const MAX_SUBMISSIONS = 5;
const WINDOW_MS = 10 * 60 * 1000;

export const LEAD_RATE_LIMIT_MESSAGE =
 "Too many requests. Please try again later.";

interface RateLimitState {
 timestamps: number[];
}

function readState(): RateLimitState {
 if (!isBrowser()) return { timestamps: [] };

 try {
 const raw = localStorage.getItem(RATE_LIMIT_STORAGE_KEY);
 if (!raw) return { timestamps: [] };
 const parsed: unknown = JSON.parse(raw);
 if (
 !parsed ||
 typeof parsed !== "object" ||
 !Array.isArray((parsed as RateLimitState).timestamps)
 ) {
 return { timestamps: [] };
 }
 return { timestamps: (parsed as RateLimitState).timestamps };
 } catch {
 return { timestamps: [] };
 }
}

function writeState(state: RateLimitState): void {
 if (!isBrowser()) return;
 localStorage.setItem(RATE_LIMIT_STORAGE_KEY, JSON.stringify(state));
}

function pruneTimestamps(timestamps: number[], now: number): number[] {
 const cutoff = now - WINDOW_MS;
 return timestamps.filter((ts) => ts > cutoff);
}

export interface LeadRateLimitCheck {
 allowed: boolean;
 message?: string;
}

/**
 * Client-side spam guard only — not a security control.
 *
 * Server-side rate limiting (Cloud Functions + Firestore write guard)
 * must be added before production paid traffic scales.
 * See: docs/lead-rate-limit-server-plan.md
 */
export function checkLeadRateLimit(now = Date.now()): LeadRateLimitCheck {
 if (!isBrowser()) {
 return { allowed: true };
 }

 const state = readState();
 const recent = pruneTimestamps(state.timestamps, now);

 if (recent.length >= MAX_SUBMISSIONS) {
 return { allowed: false, message: LEAD_RATE_LIMIT_MESSAGE };
 }

 return { allowed: true };
}

export function recordLeadSubmission(now = Date.now()): void {
 if (!isBrowser()) return;

 const state = readState();
 const recent = pruneTimestamps(state.timestamps, now);
 recent.push(now);
 writeState({ timestamps: recent });
}
