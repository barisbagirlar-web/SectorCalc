export type ProNumericFieldType = "number" | "integer";

const EMPTY_NUMERIC_DRAFTS = new Set(["", "-", ".", "-."]);

/**
 * Preserve editable numeric text while rejecting characters outside the
 * calculator contract. Commas are normalized to decimal points.
 */
export function sanitizeProNumericDraft(
  raw: string,
  fieldType: ProNumericFieldType,
): string {
  const allowDecimal = fieldType === "number";
  let result = "";
  let decimalUsed = false;

  for (const char of raw) {
    if (char >= "0" && char <= "9") {
      result += char;
      continue;
    }

    if (char === "-" && result.length === 0) {
      result = "-";
      continue;
    }

    if (!allowDecimal && (char === "." || char === ",")) {
      break;
    }

    if (allowDecimal && (char === "." || char === ",") && !decimalUsed) {
      result += ".";
      decimalUsed = true;
    }
  }

  return result;
}

/** Convert a complete draft to a finite number; editable empty states stay null. */
export function parseProNumericDraft(draft: string): number | null {
  if (EMPTY_NUMERIC_DRAFTS.has(draft)) return null;
  const value = Number(draft);
  return Number.isFinite(value) ? value : null;
}
