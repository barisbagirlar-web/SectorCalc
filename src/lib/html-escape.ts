/** Escape text for HTML text nodes and quoted attributes. */
export function escapeHtml(value: unknown): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** Attribute-safe alias (same escaping). */
export function escapeAttr(value: unknown): string {
  return escapeHtml(value);
}
