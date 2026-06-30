/**
 * P8 — Low-bandwidth preference (local-only).
 */

import { FIELD_MODE_STORAGE_KEYS } from "@/lib/features/field-mode/types";

export function getLowBandwidth(): boolean {
  if (typeof window === "undefined") {
    return false;
  }
  try {
    return window.localStorage.getItem(FIELD_MODE_STORAGE_KEYS.lowBandwidth) === "1";
  } catch {
    return false;
  }
}

export function setLowBandwidth(enabled: boolean): void {
  if (typeof window === "undefined") {
    return;
  }
  try {
    window.localStorage.setItem(FIELD_MODE_STORAGE_KEYS.lowBandwidth, enabled ? "1" : "0");
  } catch {
    /* non-fatal */
  }
}
