/**
 * SHA-256 checksum via browser SubtleCrypto.
 * Same inputs + same result = same stamp. Always.
 * Written into the PDF report as proof the calculation has not changed.
 */
export async function sha256(text: string): Promise<string> {
  const data = new TextEncoder().encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const bytes = Array.from(new Uint8Array(hashBuffer));
  return bytes.map((b) => b.toString(16).padStart(2, '0')).join('');
}

/** Build the canonical stamp for a calculation (sorted, stable). */
export async function calculationChecksum(
  toolCode: string,
  version: string,
  inputs: unknown,
  primaryResult: string | number
): Promise<string> {
  const canonical = JSON.stringify({
    tool: toolCode,
    version,
    inputs: sortDeep(inputs),
    result: String(primaryResult)
  });
  const full = await sha256(canonical);
  return full.slice(0, 16); // short, readable stamp
}

function sortDeep(obj: unknown): unknown {
  if (Array.isArray(obj)) return obj.map(sortDeep);
  if (obj !== null && typeof obj === 'object') {
    const source = obj as Record<string, unknown>;
    return Object.keys(source)
      .sort()
      .reduce<Record<string, unknown>>((acc, k) => {
        acc[k] = sortDeep(source[k]);
        return acc;
      }, {});
  }
  return obj;
}
