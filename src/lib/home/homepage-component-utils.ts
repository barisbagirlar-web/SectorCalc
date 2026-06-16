export function readHomepageStringArray(raw: unknown): string[] {
  if (!Array.isArray(raw)) {
    return [];
  }
  return raw.filter((item): item is string => typeof item === "string");
}

export type HomepageMessageTranslator = {
  (key: string): string;
  has: (key: string) => boolean;
  raw: (key: string) => unknown;
};

/** Prefer primary copy key; fall back when Omni layout keys are not patched yet. */
export function resolveHomepageMessage(
  t: HomepageMessageTranslator,
  primaryKey: string,
  fallbackKey: string,
): string {
  if (t.has(primaryKey)) {
    return t(primaryKey);
  }
  if (t.has(fallbackKey)) {
    return t(fallbackKey);
  }
  return primaryKey;
}

/** String list from array key, or values from a nested message object. */
export function readHomepageMessageList(
  t: HomepageMessageTranslator,
  primaryKey: string,
  fallbackObjectKey: string,
): string[] {
  const fromPrimary = t.has(primaryKey) ? readHomepageStringArray(t.raw(primaryKey)) : [];
  if (fromPrimary.length > 0) {
    return fromPrimary;
  }

  if (!t.has(fallbackObjectKey)) {
    return [];
  }

  const raw = t.raw(fallbackObjectKey);
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return [];
  }

  return Object.values(raw as Record<string, unknown>).filter(
    (value): value is string => typeof value === "string" && value.trim().length > 0,
  );
}
