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
  "Stratejik yol haritası",
  "Stratejik Premium Hesaplayıcı Yol Haritası",
  "Faz 1",
  "Faz 2",
  "Faz 3",
  "Faz 4",
  "Puan",
  "Skor",
  "Planlandı",
  "Yayında",
  "REG:",
  "CUR:",
  "SYS.OK",
  "VER:",
  "HYBRID",
  "KAYIT: KÜRESEL",
  "INAPILLMS",
  "INAPI",
  "APILLMS",
  "Sihirbaz",
  "METAL İMALAT ZEKÂSI",
  "Standart Ağırlık",
  "SONRAKİ PARAMETRE",
  "Sonraki Parametre",
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
  "%100 ücretsiz",
] as const;

/** English UI crumbs forbidden on TR public pages. */
export const TR_FORBIDDEN_ENGLISH_UI = [...TR_FORBIDDEN_SURFACE_WORDS] as const;

/** Turkish UI crumbs forbidden on EN public pages. */
export const EN_FORBIDDEN_TURKISH_UI = [
  "Hesaplayıcı",
  "Hesapla",
  "Ücretsiz",
  "Fiyatlandırma",
  "Sektör",
  "Girdi",
  "Sonuç",
  "Kayıt Ol",
  "Gizlilik Politikası",
  "Kullanım Koşulları",
  "Sorumluluk Reddi",
] as const;

export const FOREIGN_DEMO_MARKERS = [
  "HesapPro",
  "Pro'ya Geç",
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
