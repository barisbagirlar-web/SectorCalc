import { TR_FORBIDDEN_SURFACE_WORDS } from "@/lib/i18n/calculator-surface-forbidden";

/** Exact public TR product titles allowed despite broader forbidden-term rules. */
export const ALLOWED_PUBLIC_TR_PHRASES = ["Fiyat Teklif Sihirbazı"] as const;

export function stripAllowedPublicTrPhrases(text: string): string {
  let out = text;
  for (const phrase of ALLOWED_PUBLIC_TR_PHRASES) {
    out = out.split(phrase).join("");
  }
  return out;
}

/** Internal / roadmap strings that must not appear in public rendered HTML. */
export const INTERNAL_PUBLIC_FORBIDDEN_TR = [
  "Strategic roadmap",
  "Strategic Premium Calculator Roadmap",
  "Faz 1",
  "Faz 2",
  "Faz 3",
  "Faz 4",
  "Score",
  "Score",
  "Planned",
  "Live",
  "REG:",
  "CUR:",
  "SYS.OK",
  "VER:",
  "HYBRID",
  "RECORD: GLOBAL",
  "INAPILLMS",
  "INAPI",
  "APILLMS",
  "Wizard",
  "METAL MANUFACTURING INTELLIGENCE",
  "Standard Weight",
  "NEXT PARAMETER",
  "Next Parameter",
] as const;

export const INTERNAL_PUBLIC_FORBIDDEN_ANY_LOCALE = [
  "Wizard",
  "Intelligence",
  "Step 1",
  "Next parameter",
  "Industry Wizard",
  "Lorem ipsum",
  "HesapPro",
  "230 hardcoded",
  "%100 free",
] as const;

/** English UI crumbs forbidden on TR public pages. */
export const TR_FORBIDDEN_ENGLISH_UI = [...TR_FORBIDDEN_SURFACE_WORDS] as const;

/** UI crumbs forbidden on EN public pages. */
export const EN_FORBIDDEN_TURKISH_UI = [
  "Calculator",
  "Calculate",
  "Free",
  "Pricing",
  "Sector",
  "Input",
  "Result",
  "Sign Up",
  "Privacy Policy",
  "Terms of Use",
  "Disclaimer",
] as const;

export const FOREIGN_DEMO_MARKERS = [
  "HesapPro",
  "Upgrade to Pro",
  "Lorem ipsum",
  "Playfair Display",
  "site-header",
  "site-footer",
  "href=\"#\"",
] as const;

export const RENDERED_HTML_ALLOWLIST = [
  "SectorCalc",
  "m",
  "cm",
  "kg",
  "kWh",
  "bar",
  "psi",
  "ft",
  "in",
  "TRY",
  "USD",
  "EUR",
  "GBP",
  "AED",
  "SAR",
  "API",
  "LLMS",
  "IN",
  "OEE",
  "PDF",
  "CSV",
  "Pro",
  "RTL",
  "rtl",
  "lang",
  "dir",
] as const;

export function buildForbiddenPattern(
  terms: readonly string[],
  flags = "i",
): RegExp {
  const escaped = terms.map((term) => term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  return new RegExp(`(${escaped.join("|")})`, flags);
}

export const TR_RENDERED_FORBIDDEN_RE = buildForbiddenPattern([
  ...TR_FORBIDDEN_ENGLISH_UI.map(String),
  ...INTERNAL_PUBLIC_FORBIDDEN_TR.map(String),
  "Wizard",
  "Intelligence",
  "REG:",
  "CUR:",
  "SYS.OK",
  "VER:",
  "HYBRID",
]);

export const EN_RENDERED_FORBIDDEN_RE = buildForbiddenPattern([...EN_FORBIDDEN_TURKISH_UI]);
