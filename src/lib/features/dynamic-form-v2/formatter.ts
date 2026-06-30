/**
 * Formatting helpers — matching original HTML spec.
 */

export function fmt(v: number | null | undefined, d = 2): string {
  if (v === null || v === undefined || !Number.isFinite(v)) return "—";
  return Number(v).toLocaleString("en-US", {
    minimumFractionDigits: d,
    maximumFractionDigits: d,
  });
}

export function money(v: number | null | undefined, ccy: string, d = 2): string {
  if (v === null || v === undefined || !Number.isFinite(v)) return "—";
  return fmt(v, d) + " " + ccy;
}

export function pctf(v: number | null | undefined, d = 1): string {
  if (v === null || v === undefined || !Number.isFinite(v)) return "—";
  return (v * 100).toFixed(d) + "%";
}

export function hash(str: string): string {
  let h = 5381;
  for (let i = 0; i < str.length; i++) h = ((h << 5) + h + str.charCodeAt(i)) >>> 0;
  return ("00000000" + h.toString(16)).slice(-8);
}

/**
 * Template interpolation for notes/insights.
 * Patterns: {id} {id%} {id$} {id#n}
 */
export function interp(
  tpl: string,
  scope: Record<string, unknown>,
  ccy: string,
  meta?: (id: string) => { name?: string; unit?: string; precision?: number | null; enum_labels?: Record<string, string> },
): string {
  return tpl.replace(/\{([a-zA-Z0-9_]+)([%$]|#\d+)?\}/g, (_m, id: string, sfx: string | undefined) => {
    const v = scope[id];
    const m = meta ? meta(id) : undefined;
    if (v === null || v === undefined) {
      if (m?.enum_labels && typeof v === "string") return m.enum_labels[v] || v;
      return "—";
    }
    if (typeof v === "string") {
      if (m?.enum_labels && m.enum_labels[v]) return m.enum_labels[v];
      return v;
    }
    const nv = v as number;
    if (sfx === "%") return pctf(nv);
    if (sfx === "$") return money(nv, ccy);
    if (sfx && sfx[0] === "#") return fmt(nv, parseInt(sfx.slice(1)));
    if (m?.unit === "ratio") return pctf(nv);
    if (m?.unit && m.unit.indexOf("currency") === 0) return money(nv, ccy);
    return fmt(nv, m?.precision != null ? m.precision : 2);
  });
}
