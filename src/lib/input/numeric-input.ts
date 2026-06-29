/** Strip non-numeric characters; allow at most one decimal point. */
export function sanitizeNumericInput(
  raw: string,
  options?: { allowDecimal?: boolean },
): string {
  const allowDecimal = options?.allowDecimal ?? true;
  let result = "";
  let dotUsed = false;

  for (const char of raw) {
    if (char >= "0" && char <= "9") {
      result += char;
      continue;
    }
    if (allowDecimal && (char === "." || char === ",") && !dotUsed) {
      dotUsed = true;
      result += ".";
    }
  }

  return result;
}

export function parseNumericInput(raw: string): number {
  if (raw === "" || raw === ".") {
    return 0;
  }
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function handleNumericInputChange(
  raw: string,
  options?: { allowDecimal?: boolean },
): { sanitized: string; numeric: number } {
  const sanitized = sanitizeNumericInput(raw, options);
  return { sanitized, numeric: parseNumericInput(sanitized) };
}

/** Industrial numeric input — JetBrains Mono + tabular alignment */
export const SC_NUMERIC_INPUT_CLASS =
  "sc-input data-value w-full min-h-[32px] rounded-none border border-technical-gray bg-white px-2 py-1 font-mono text-xs tabular-nums text-premium-velvet focus:border-premium-velvet focus:outline-none";
