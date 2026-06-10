/**
 * Calculation hash service — deterministic hashing for approved reports
 */

/**
 * Canonicalize a value to a stable JSON string for hashing.
 * - Keys sorted alphabetically
 * - Consistent representation
 * - No undefined values
 */
export function canonicalizeReportPayload(value: unknown): string {
  if (value === null || value === undefined) {
    return "null";
  }

  if (typeof value !== "object") {
    return JSON.stringify(value);
  }

  if (Array.isArray(value)) {
    return (
      "[" +
      value.map((item) => canonicalizeReportPayload(item)).join(",") +
      "]"
    );
  }

  // Object: sort keys, recursively canonicalize values
  const keys = Object.keys(value as Record<string, unknown>).sort();
  const pairs = keys.map(
    (key) =>
      JSON.stringify(key) +
      ":" +
      canonicalizeReportPayload((value as Record<string, unknown>)[key])
  );
  return "{" + pairs.join(",") + "}";
}

/**
 * Create a SHA-256 hash of the canonicalized payload.
 * Uses Web Crypto API (works in browser and Node.js edge).
 */
export async function createCalculationHash(
  payload: unknown
): Promise<string> {
  const canonical = canonicalizeReportPayload(payload);
  const encoder = new TextEncoder();
  const data = encoder.encode(canonical);

  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return hashHex;
}

/**
 * Verify that a payload matches a given hash.
 */
export async function verifyCalculationHash(
  payload: unknown,
  hash: string
): Promise<boolean> {
  const computed = await createCalculationHash(payload);
  return computed === hash;
}