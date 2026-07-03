/**
 * turkish-token-detector.ts — V5.3.1 Turkish Token Detection Utilities
 *
 * Shared detection functions used by:
 *   - assert-pure-english-schema.ts
 *   - server-only-input-aliases.ts
 *   - export/proof-pack builders
 *
 * Matching strategy:
 *   - Multi-character Turkish tokens (>=4 chars): matched when found in any token boundary
 *   - 3-char tokens: matched with extra context checks
 *   - Turkish short tokens (2-3 chars like "ic", "dis", "ag", "cap"): only matched when
 *     they appear as part of a camelCase compound with ANOTHER Turkish token
 *   - Turkish characters: always matched
 *   - English technical false positives: explicitly excluded
 */

// Complete list of Turkish transliterated tokens (4+ chars, unambiguous)
export const TURKISH_TOKENS: ReadonlySet<string> = new Set([
  "muhendis", "muhendisi", "muhendislik",
  "danismani", "danışmanı", "uzmani", "uzmanı",
  "yapisal", "yapısal", "istatistik", "istatistikci",
  "istatistikci",
  "marangoz", "emlak", "degerleme", "değerleme",
  "yatirim", "yatırım", "maliyet",
  "kapasite", "verim",
  "sicaklik", "sıcaklık",
  "tasarim", "tasarım",
  "cevre", "çevre", "surdurulebilirlik", "sürdürülebilirlik",
  "hidrolik", "demiryolu", "sinyalizasyon",
  "gunes", "güneş", "ruzgar", "rüzgar",
  "elektrikci", "elektrikçi", "tesisatci", "tesisatçı",
  "kaynakci", "kaynakçı", "tornaci", "tornacı",
  "frezeci", "tamirci",
  "insaat", "inşaat",
  "celik", "çelik", "tesfiye",
  "iscilik", "işçilik",
  "veresiye",
  "agirlik", "ağırlık", "uzunluk",
  "genislik", "genişlik", "yukseklik", "yükseklik",
  "derinlik",
  "yaricap", "yarıçap",
  "baslangic", "başlangıç",
  "ortalama",
  "katsayi", "katsayı",
  "kullanici", "kullanıcı",
  "hesapla", "guncel", "güncel",
  "dikdortgen", "dikdörtgen",
  "ucgen", "üçgen", "cokgen", "çokgen",
  "doseme", "döşeme",
  "merdiven", "korkuluk",
  "kompresor", "kompresör",
  "diyafram", "debimetre",
  "pervane",
  "burkulma", "burulma",
  "bukulme", "bükülme",
  "sarfiyat",
  "tedarikci", "tedarikçi",
  "uretici", "üretici",
  "titresim", "titreşim",
  "giris", "giriş",
  "cikti", "çıktı",
]);

// Short Turkish tokens (2-3 chars) — only flagged in compound identifiers
// These are matched ONLY when part of a camelCase compound with another Turkish token
export const SHORT_TURKISH_TOKENS: ReadonlySet<string> = new Set([
  "ic", "iç",
  "dis", "dış",
  "ag", "ağ",
  "cap", "çap",
  "uc", "uç",
  "yuk", "guc", "güç",
  "debi",
  "kar", "kâr",
  "oran",
  "adet",
  "birim",
  "alan",
  "hacim",
  "kesit",
  "hiz", "hız",
  "ivme",
  "bitis", "bitiş",
  "sonuc", "sonuç",
  "standart",
  "sapma",
  "tutar",
  "hisse",
  "tahvil",
  "odeme", "ödeme",
  "miktar",
  "toplam",
  "fiyat",
  "direnc", "direnç",
  "gerilim",
  "akim", "akım",
  "taksit",
  "faiz",
  "kazanc",
  "zarar",
  "gelir",
  "gider",
  "donem", "dönem",
  "kira",
  "teslimat",
  "kalite",
  "musteri", "müşteri",
  "calisan", "calışan",
  "yay",
  "rulman",
  "yatak",
  "kasnak",
  "kayis", "kayış",
  "zincir",
  "bant",
  "piston",
  "silindir",
  "valf",
  "pompa",
  "motor",
  "kanat",
  "egim", "eğim",
  "egme",
  "yillik",
  "aylik",
  "haftalik",
  "rapor",
  "kayit", "kayıt",
  "saniye",
  "katman",
  "tabaka",
  "levha",
  "plaka",
  "eksen",
  "dilim",
  "kose", "köşe",
  "kenar",
  "kare",
  "daire",
  "dikey",
  "kolon",
  "kiris", "kiriş",
  "temel",
  "duvar",
  "perde",
  "cati", "çatı",
  "kubbe",
  "kemer",
  "donati", "donatı",
  "beton",
  "ahsap", "ahşap",
  "kompozit",
  "kuvvet",
  "enerji",
  "frekans",
  "surec", "süreç",
  "girdi",
  "dip",
  "yeni",
  "eski",
  "mevcut",
  "yil",
  "gun",
  "ay",
  "hafta",
  "saat",
  "dakika",
  "kat",
  "yuk",
]);

// Turkish characters regex
export const TURKISH_CHAR_REGEX = /[çÇğĞıİöÖşŞüÜ]/;

// English technical terms that are NOT Turkish — must be explicitly excluded
const FALSE_POSITIVE_ENGLISH = new Set([
  // Words containing "ag" that are English
  "agenda", "agent", "aggregate", "aggressive", "agile",
  // Units and measures
  "capacity", "standard", "ratio", "area", "volume", "pressure",
  "temperature", "production", "efficiency", "quality", "duration",
  "cost", "profit", "result",
  // Statistics
  "variance", "variable", "variant",
  "statistics", "statistical",
  // Materials
  "material", "matter",
  // Design
  "design", "designer",
  // Control
  "control", "controller",
  // Location
  "center", "central",
  // Units
  "kilogram", "kilometer", "kilowatt",
  // Reference
  "index", "indicator",
  // Technology
  "digital", "signal",
  "analysis", "analyzer",
  // Business
  "strategy", "strategic",
  "integration",
  // Geology (contains "kar")
  "karst", "karma",
  // Security (contains "fire")
  "firewall", "firebase", "firefighter",
  // Finance (cap = capitalization)
  "capital", "caption", "capture",
  "caprate", "cap_rate", "cap",
  "caps",
  // IT (contains "dis")
  "discuss", "display", "distance", "district", "distinct",
  "disable", "disabled",
  // Chemical symbols
  "silver", "argon", "gold", "iron", "silicon",
  "carbon", "copper", "magnesium", "aluminum",
  // Engineering terms that look Turkish
  "moment",    // bending moment
  "moments",
  "torque",
  "velocity",
  "viscosity",
  "critical",  // contains "ic"
  "periodic",  // contains "ic"
  "electric",  // contains "ic"
  "specific",  // contains "ic"
  "automatic", // contains "ic"
  "metric",    // contains "ic"
  "generic",   // contains "ic"
  "basic",     // contains "ic"
  "public",    // contains "ic"
  "domestic",  // contains "ic"
  // Common substrings
  "stock",
  "motor",
]);

/**
 * Check if a string contains a Turkish token
 * Returns the first matching token or null
 */
export function hasTurkishToken(value: string): string | null {
  if (!value || typeof value !== "string") return null;

  const lower = value.toLowerCase();

  // Check for Turkish characters first
  if (TURKISH_CHAR_REGEX.test(value)) {
    return value.match(TURKISH_CHAR_REGEX)![0];
  }

  // Split by camelCase boundaries, underscores, whitespace, hyphens, slashes
  const parts = lower.split(/(?<=[a-z])(?=[A-Z])|_|\s+|[-/]/);

  // Check if any full part is a known Turkish token
  for (let i = 0; i < parts.length; i++) {
    const trimmed = parts[i].trim();
    if (!trimmed) continue;
    if (trimmed.length < 3) continue; // skip single/two chars as standalone

    // Check false positive list
    if (FALSE_POSITIVE_ENGLISH.has(trimmed)) continue;

    if (TURKISH_TOKENS.has(trimmed)) {
      return trimmed;
    }
  }

  // For short tokens (2-4 chars), only match in camelCase compounds
  // where the compound contains another Turkish token
  // Check full string for camelCase compounds with short Turkish tokens
  const camelMatch = lower.match(/[a-z]+[A-Z][a-z]+/g);
  if (camelMatch) {
    for (const compound of camelMatch) {
      const compoundLower = compound.toLowerCase();
      const subParts = compoundLower.split(/(?<=[a-z])(?=[A-Z])/);

      // Check if any sub-part is a short Turkish token
      for (let i = 0; i < subParts.length; i++) {
        const sub = subParts[i].trim();
        if (!sub || sub.length < 2) continue;
        if (FALSE_POSITIVE_ENGLISH.has(sub)) continue;

        // Check if it's a SHORT token
        if (SHORT_TURKISH_TOKENS.has(sub)) {
          // Verify at least one OTHER part is also a SHORT or MAIN Turkish token
          for (let j = 0; j < subParts.length; j++) {
            if (i === j) continue;
            const other = subParts[j].trim();
            if (SHORT_TURKISH_TOKENS.has(other) || TURKISH_TOKENS.has(other)) {
              return sub; // Found short token in compound with another Turkish token
            }
          }
        }
      }
    }
  }

  return null;
}

/**
 * Check if a value is pure English (no Turkish tokens)
 */
export function isPureEnglish(value: string): boolean {
  return hasTurkishToken(value) === null;
}
