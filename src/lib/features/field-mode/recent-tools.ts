/**
 * P8 - Recent tools (local-only). Pure list helpers + safe storage wrappers.
 */

import {
  FIELD_MODE_LIMITS,
  FIELD_MODE_STORAGE_KEYS,
  type RecentToolEntry,
} from "@/lib/features/field-mode/types";

/** Pure: prepend entry, dedupe by slug, cap to max (most-recent first). */
export function addRecentToolToList(
  list: readonly RecentToolEntry[],
  entry: RecentToolEntry,
  max: number = FIELD_MODE_LIMITS.maxRecentTools,
): readonly RecentToolEntry[] {
  const filtered = list.filter((item) => item.slug !== entry.slug);
  return [entry, ...filtered].slice(0, Math.max(0, max));
}

function readStorage(): readonly RecentToolEntry[] {
  if (typeof window === "undefined") {
    return [];
  }
  try {
    const raw = window.localStorage.getItem(FIELD_MODE_STORAGE_KEYS.recentTools);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as RecentToolEntry[]) : [];
  } catch {
    return [];
  }
}

export function getRecentTools(): readonly RecentToolEntry[] {
  return readStorage();
}

export function recordRecentTool(entry: Omit<RecentToolEntry, "visitedAt">): readonly RecentToolEntry[] {
  if (typeof window === "undefined") {
    return [];
  }
  const next = addRecentToolToList(readStorage(), { ...entry, visitedAt: Date.now() });
  try {
    window.localStorage.setItem(FIELD_MODE_STORAGE_KEYS.recentTools, JSON.stringify(next));
  } catch {
    /* storage unavailable - non-fatal */
  }
  return next;
}

export function clearRecentTools(): void {
  if (typeof window === "undefined") {
    return;
  }
  try {
    window.localStorage.removeItem(FIELD_MODE_STORAGE_KEYS.recentTools);
  } catch {
    /* non-fatal */
  }
}
