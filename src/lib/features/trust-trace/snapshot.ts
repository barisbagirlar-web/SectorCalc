/**
 * Snapshot sanitizer — safely captures input/result for approved reports
 */

const SECRET_LIKE_PATTERNS = [
  "secret",
  "token",
  "apikey",
  "api_key",
  "password",
  "passwd",
  "bearer",
  "authorization",
  "auth",
  "stripe",
  "brevo",
  "private",
  "credential",
];

const MAX_STRING_LENGTH = 500;

/**
 * Returns true if a key looks like it might contain a secret.
 */
export function isSecretLikeKey(key: string): boolean {
  const lower = key.toLowerCase();
  return SECRET_LIKE_PATTERNS.some((pattern) => lower.includes(pattern));
}

/**
 * Returns true if a value is safe to store in a snapshot.
 */
export function isSafeSnapshotValue(value: unknown): boolean {
  if (value === null) return true;
  if (typeof value === "boolean") return true;
  if (typeof value === "string") return true;
  if (typeof value === "number") {
    return Number.isFinite(value);
  }
  return false;
}

/**
 * Sanitize a snapshot object for safe storage.
 * - Max 40 keys
 * - Only string / number / boolean / null values
 * - NaN / Infinity dropped
 * - Long strings truncated
 * - Secret-like keys dropped
 * - Functions, symbols, undefined dropped
 */
export function sanitizeSnapshot(
  input: Record<string, unknown>,
  maxKeys = 40
): Record<string, unknown> {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return {};
  }

  const result: Record<string, unknown> = {};
  let count = 0;

  for (const [key, value] of Object.entries(input)) {
    if (count >= maxKeys) break;

    // Skip secret-like keys
    if (isSecretLikeKey(key)) continue;

    // Skip unsafe types
    if (value === undefined) continue;
    if (typeof value === "function") continue;
    if (typeof value === "symbol") continue;
    // Skip File/Blob-like objects
    if (
      typeof value === "object" &&
      value !== null &&
      (value instanceof Blob ||
        (typeof File !== "undefined" && value instanceof File))
    ) {
      continue;
    }

    if (value === null) {
      result[key] = null;
      count++;
      continue;
    }

    if (typeof value === "boolean") {
      result[key] = value;
      count++;
      continue;
    }

    if (typeof value === "number") {
      if (!Number.isFinite(value)) continue; // Drop NaN / Infinity
      result[key] = value;
      count++;
      continue;
    }

    if (typeof value === "string") {
      result[key] =
        value.length > MAX_STRING_LENGTH
          ? value.slice(0, MAX_STRING_LENGTH) + "…"
          : value;
      count++;
      continue;
    }

    // Nested objects: attempt safe stringify then drop if problematic
    if (typeof value === "object") {
      try {
        const str = JSON.stringify(value);
        if (str && str.length <= MAX_STRING_LENGTH) {
          result[key] = str;
          count++;
        }
        // else drop (too large or complex)
      } catch {
        // Drop non-serializable nested objects
      }
    }
  }

  return result;
}