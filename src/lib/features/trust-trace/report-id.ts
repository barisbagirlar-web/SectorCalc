/**
 * Report ID service - generates SC-{YYYYMMDD}-{TOOLSHORT}-{ID} format
 */

function formatDateYYYYMMDD(date: Date): string {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  return `${y}${m}${d}`;
}

/**
 * Sanitize a tool slug to a compact uppercase identifier (max 10 chars).
 * e.g., "cnc-quote-risk-analyzer" → "CNCQUOTE"
 */
function toolSlugToShort(toolSlug: string): string {
  return toolSlug
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .slice(0, 10);
}

/**
 * Generate a short random ID (6 uppercase alphanumeric chars).
 */
function shortRandomId(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  const array = new Uint8Array(6);
  crypto.getRandomValues(array);
  for (const byte of array) {
    result += chars[byte % chars.length];
  }
  return result;
}

/**
 * Create a report ID in SC-{YYYYMMDD}-{TOOLSHORT}-{ID} format.
 */
export function createReportId(toolSlug: string, date?: Date): string {
  const d = date ?? new Date();
  const dateStr = formatDateYYYYMMDD(d);
  const toolShort = toolSlugToShort(toolSlug) || "TOOL";
  const id = shortRandomId();
  return `SC-${dateStr}-${toolShort}-${id}`;
}

/**
 * Create a validation stamp ID derived from the report ID.
 */
export function createValidationStampId(reportId: string): string {
  // Prefix with VS- and append a short random suffix
  const suffix = shortRandomId();
  return `VS-${reportId}-${suffix}`;
}

/**
 * Parse a report ID into its components.
 * Format: SC-{YYYYMMDD}-{TOOLSHORT}-{ID}
 */
export function parseReportId(reportId: string): {
  ok: boolean;
  date?: string;
  toolShort?: string;
  id?: string;
} {
  if (!reportId || typeof reportId !== "string") {
    return { ok: false };
  }

  const match = reportId.match(/^SC-(\d{8})-([A-Z0-9]+)-([A-Z0-9]+)$/);
  if (!match) {
    return { ok: false };
  }

  const [, dateStr, toolShort, id] = match;
  // Validate date portion
  const year = parseInt(dateStr.slice(0, 4), 10);
  const month = parseInt(dateStr.slice(4, 6), 10);
  const day = parseInt(dateStr.slice(6, 8), 10);
  if (year < 2020 || month < 1 || month > 12 || day < 1 || day > 31) {
    return { ok: false };
  }

  return {
    ok: true,
    date: `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
    toolShort,
    id,
  };
}