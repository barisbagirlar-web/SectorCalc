/**
 * Shared HTML utility functions for workbook generators.
 *
 * Provides safe HTML escaping used consistently across the
 * Data Dictionary and Import Checklist generators.
 */

export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
