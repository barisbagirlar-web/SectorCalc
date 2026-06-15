import type { SupportedLocale } from "@/lib/i18n/locale-config";
import { TR_FORBIDDEN_SURFACE_WORDS } from "@/lib/i18n/calculator-surface-forbidden";

/** Word-boundary cleanup after glossary pass — removes visible EN residue on calculator surfaces. */
const TR_SURFACE_RESIDUE: Record<string, string> = {
  Time: "Süre",
  Input: "Girdi",
  Amount: "Tutar",
  Loading: "Yükleme",
  Unloading: "Boşaltma",
  Coolant: "Soğutucu",
  Measurement: "Ölçüm",
  Driving: "Sürüş",
  Processing: "İşlem",
  Continuous: "Sürekli",
  discrete: "ayrık",
  Compute: "Hesapla",
  compute: "hesapla",
  travel: "seyahat",
  origin: "çıkış",
  destination: "varış",
  expedited: "acil",
  multiplier: "çarpan",
  bill: "fatura",
  service: "hizmet",
  transaction: "işlem",
  defects: "kusur",
  probing: "prob",
  manual: "manuel",
  activate: "aktive et",
  stabilize: "stabilize et",
  before: "önce",
  during: "sırasında",
  after: "sonrasında",
  expected: "beklenen",
  influences: "etkiler",
  assumed: "varsayılan",
  reporting: "raporlama",
  machinability: "işlenebilirlik",
  workpiece: "iş parçası",
  machine: "makine",
  turret: "taret",
  indexing: "indeksleme",
  change: "değiştirme",
  tool: "takım",
  average: "ortalama",
  traffic: "trafik",
  stops: "duraklar",
  stop: "durak",
  premium: "prim",
  surcharge: "ek ücret",
  soil: "toprak",
  test: "test",
  recipe: "reçete",
  batch: "parti",
  portion: "porsiyon",
  product: "ürün",
  dollar: "dolar",
  rounded: "yuvarlanmış",
  whole: "tam",
  saved: "biriktirilen",
  Length: "Uzunluk",
  Width: "Genişlik",
  Height: "Yükseklik",
  Depth: "Derinlik",
  Yardage: "Metraj",
  Area: "Alan",
  Volume: "Hacim",
  Weight: "Ağırlık",
  Price: "Fiyat",
  Cost: "Maliyet",
  Rate: "Oran",
  Margin: "Marj",
  Revenue: "Gelir",
  Profit: "Kâr",
  Discount: "İndirim",
  Tax: "Vergi",
  Loan: "Kredi",
  Payment: "Ödeme",
  Quantity: "Miktar",
  Unit: "Birim",
  Result: "Sonuç",
  Calculate: "Hesapla",
  Calculator: "Hesaplama aracı",
  Output: "Çıktı",
  Select: "Seçin",
  Choose: "Seçin",
  Search: "Ara",
  Reset: "Sıfırla",
  Submit: "Gönder",
  Required: "Zorunlu",
  Optional: "İsteğe bağlı",
  Invalid: "Geçersiz",
  Error: "Hata",
  Warning: "Uyarı",
  Total: "Toplam",
  Subtotal: "Ara toplam",
  Annual: "Yıllık",
  Monthly: "Aylık",
  Daily: "Günlük",
  Hourly: "Saatlik",
  Distance: "Mesafe",
  Speed: "Hız",
  Fuel: "Yakıt",
  Energy: "Enerji",
  Power: "Güç",
  Temperature: "Sıcaklık",
  Pressure: "Basınç",
  Diameter: "Çap",
  Radius: "Yarıçap",
  Thickness: "Kalınlık",
  Density: "Yoğunluk",
};

const DE_SURFACE_RESIDUE: Record<string, string> = {
  Calculate: "Berechnen",
  Select: "Wählen",
  Result: "Ergebnis",
  Input: "Eingabe",
  Amount: "Betrag",
  Time: "Zeit",
};

const FR_SURFACE_RESIDUE: Record<string, string> = {
  Calculate: "Calculer",
  Select: "Sélectionner",
  Result: "Résultat",
  Input: "Entrée",
  Amount: "Montant",
  Time: "Temps",
};

const ES_SURFACE_RESIDUE: Record<string, string> = {
  Calculate: "Calcular",
  Select: "Seleccionar",
  Result: "Resultado",
  Input: "Entrada",
  Amount: "Importe",
  Time: "Tiempo",
};

const AR_SURFACE_RESIDUE: Record<string, string> = {
  Calculate: "احسب",
  Select: "اختر",
  Result: "النتيجة",
  Input: "إدخال",
  Amount: "المبلغ",
  Time: "الوقت",
};

const RESIDUE_BY_LOCALE: Partial<Record<SupportedLocale, Record<string, string>>> = {
  tr: TR_SURFACE_RESIDUE,
  de: DE_SURFACE_RESIDUE,
  fr: FR_SURFACE_RESIDUE,
  es: ES_SURFACE_RESIDUE,
  ar: AR_SURFACE_RESIDUE,
};

function sortedResidueEntries(locale: SupportedLocale): readonly (readonly [string, string])[] {
  const map = RESIDUE_BY_LOCALE[locale] ?? {};
  return Object.entries(map).sort((a, b) => b[0].length - a[0].length);
}

export function polishCalculatorSurfaceResidue(text: string, locale: SupportedLocale): string {
  if (!text || locale === "en") {
    return text;
  }

  const entries = sortedResidueEntries(locale);
  if (entries.length === 0) {
    return text;
  }

  let result = text;
  for (const [en, localized] of entries) {
    const re = new RegExp(`\\b${en.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "gi");
    result = result.replace(re, localized);
  }
  return result;
}

/** @internal test helper */
export function getTrForbiddenCoverage(): readonly string[] {
  return TR_FORBIDDEN_SURFACE_WORDS.filter((word) => TR_SURFACE_RESIDUE[word] !== undefined);
}
