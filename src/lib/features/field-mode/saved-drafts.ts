/**
 * P8 - Saved input drafts (local-only). No secrets or sensitive personal data.
 */

import {
  FIELD_MODE_LIMITS,
  FIELD_MODE_STORAGE_KEYS,
  type SavedDraft,
} from "@/lib/features/field-mode/types";

/** Pure: prepend draft, dedupe by id, cap to max. */
export function addDraftToList(
  list: readonly SavedDraft[],
  draft: SavedDraft,
  max: number = FIELD_MODE_LIMITS.maxDrafts,
): readonly SavedDraft[] {
  const filtered = list.filter((item) => item.id !== draft.id);
  return [draft, ...filtered].slice(0, Math.max(0, max));
}

function readStorage(): readonly SavedDraft[] {
  if (typeof window === "undefined") {
    return [];
  }
  try {
    const raw = window.localStorage.getItem(FIELD_MODE_STORAGE_KEYS.drafts);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as SavedDraft[]) : [];
  } catch {
    return [];
  }
}

export function getSavedDrafts(): readonly SavedDraft[] {
  return readStorage();
}

export function saveDraft(draft: SavedDraft): readonly SavedDraft[] {
  if (typeof window === "undefined") {
    return [];
  }
  const next = addDraftToList(readStorage(), draft);
  try {
    window.localStorage.setItem(FIELD_MODE_STORAGE_KEYS.drafts, JSON.stringify(next));
  } catch {
    /* non-fatal */
  }
  return next;
}

export function clearSavedDrafts(): void {
  if (typeof window === "undefined") {
    return;
  }
  try {
    window.localStorage.removeItem(FIELD_MODE_STORAGE_KEYS.drafts);
  } catch {
    /* non-fatal */
  }
}
