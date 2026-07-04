import crypto from "node:crypto";
import forbiddenHashes from "../../../data/governance/forbidden-token-hashes.json";

const forbiddenHashSet = new Set(forbiddenHashes);

// Standard Turkish character range check (using code points to avoid raw characters in code)
const TURKISH_CHAR_CODES = [
  199, 231, // C, c
  286, 287, // G, g
  304, 305, // I, i
  214, 246, // O, o
  350, 351, // S, s
  220, 252  // U, u
];
const TURKISH_PATTERN = new RegExp("[" + TURKISH_CHAR_CODES.map(c => String.fromCharCode(c)).join("") + "]", "u");

/**
 * Check if a string contains a Turkish token.
 * Uses SHA-256 hashes from forbidden-token-hashes.json.
 * Returns the first matching token or "unicode_char" or null.
 */
export function hasTurkishToken(value: string): string | null {
  if (!value || typeof value !== "string") return null;

  // 1. Unicode character range check
  if (TURKISH_PATTERN.test(value)) {
    const match = value.match(TURKISH_PATTERN);
    return match ? match[0] : "unicode_char";
  }

  // 2. Hash check for transliterated tokens
  const lower = value.toLowerCase().trim();
  // Split by camelCase boundaries, underscores, whitespace, hyphens, slashes
  const parts = lower.split(/(?<=[a-z])(?=[A-Z])|_|\s+|[-/]/);

  for (const part of parts) {
    const trimmed = part.trim();
    if (!trimmed || trimmed.length < 3) continue;

    // Standard SHA-256 token hashing
    const hash = crypto.createHash("sha256").update(trimmed).digest("hex");
    if (forbiddenHashSet.has(hash)) {
      return trimmed;
    }
  }

  return null;
}

/**
 * Check if a value is pure English (no Turkish tokens)
 */
export function isPureEnglish(value: string): boolean {
  return hasTurkishToken(value) === null;
}
