export const PRINT_STORAGE_KEY = "sc-premium-print-data";

export interface PrintData {
  slug: string;
  inputs: Record<string, unknown>;
  result: Record<string, unknown>;
  /** Full schema snapshot as a plain JSON object (no readonly symbols). */
  schema: Record<string, unknown>;
}

export function savePrintData(data: PrintData): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(PRINT_STORAGE_KEY, JSON.stringify(data));
  } catch {
    // sessionStorage full or unavailable - silently fail
  }
}

export function getPrintData(): PrintData | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(PRINT_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as PrintData;
  } catch {
    return null;
  }
}
