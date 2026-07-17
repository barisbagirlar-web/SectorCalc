// SectorCalc — 3-Pass Render Pattern V5.4
// Every PRO tool page MUST follow this render order.
// Violation: state/DOM race condition crash (verified in Break-Even bug #2).
//
// PASS 1: State initialization — ALL field state entries created before any DOM work.
// PASS 2: DOM construction — innerHTML + event listeners. NO compute() calls.
// PASS 3: Compute — all fields exist in both state and DOM, safe to cross-reference.

// ── Field state type ───────────────────────────────────────────────────────

export interface FieldState {
  value: number | string | boolean | null;
  unit: string;
  error?: string | null;
  touched?: boolean;
}

export interface FieldDefinition {
  id: string;
  ev: string; // engine variable name
  label: string;
  unit: string;
  hardBounds?: [number, number];
  plausibleBounds?: [number, number];
  hint?: string;
}

// ── 3-pass render skeleton ─────────────────────────────────────────────────

/**
 * Initialize state for all fields without touching the DOM.
 * Every field gets a state entry before any DOM work begins.
 */
export function initFieldState(fields: FieldDefinition[]): Record<string, FieldState> {
  const state: Record<string, FieldState> = {};
  for (const f of fields) {
    state[f.id] = {
      value: null,
      unit: f.unit,
      error: null,
      touched: false,
    };
  }
  return state;
}

/**
 * Build DOM nodes for all fields.
 * This pass MUST NOT call compute(). It only creates markup + attaches listeners.
 * Returns a map of id -> HTMLElement for the compute pass.
 */
export function buildFieldDOM(
  fields: FieldDefinition[]
): Record<string, HTMLElement | null> {
  const domMap: Record<string, HTMLElement | null> = {};
  for (const f of fields) {
    domMap[f.id] = null; // Created by concrete page component
  }
  return domMap;
}

/**
 * Safe cross-referencing accessor.
 * Every state[id] access MUST be guarded by this function.
 * Single-point protection against the Break-Even crash pattern.
 */
export function safeState<K extends string>(
  state: Record<K, FieldState | undefined>,
  id: K
): FieldState | null {
  const s = state[id];
  return s ?? null;
}

/**
 * Collect engine inputs from fields that have values.
 * Each missing field is reported as a warning, not a crash.
 */
export function collectEngineInputs(
  state: Record<string, FieldState>,
  fields: FieldDefinition[]
): { inputs: Record<string, number>; missing: string[] } {
  const inputs: Record<string, number> = {};
  const missing: string[] = [];
  for (const f of fields) {
    const s = state[f.id];
    if (!s || s.value === null || s.value === undefined) {
      missing.push(f.id);
      continue;
    }
    if (typeof s.value === "number") {
      inputs[f.ev] = s.value;
    } else {
      const parsed = Number(s.value);
      if (Number.isFinite(parsed)) {
        inputs[f.ev] = parsed;
      } else {
        missing.push(f.id);
      }
    }
  }
  return { inputs, missing };
}

/**
 * Cross-validate fields after all are in state.
 * Null-guarded: skips any field not yet in state.
 */
export function crossValidate(
  state: Record<string, FieldState>,
  fields: FieldDefinition[]
): string[] {
  const errors: string[] = [];
  for (const f of fields) {
    const s = state[f.id];
    if (!s) continue; // null-guard: field not yet initialized
    if (s.error) {
      errors.push(`${f.label}: ${s.error}`);
    }
    if (f.hardBounds) {
      const [min, max] = f.hardBounds;
      if (typeof s.value === "number") {
        if (s.value < min) errors.push(`${f.label}: below minimum (${s.value} < ${min})`);
        if (s.value > max) errors.push(`${f.label}: exceeds maximum (${s.value} > ${max})`);
      }
    }
  }
  return errors;
}
