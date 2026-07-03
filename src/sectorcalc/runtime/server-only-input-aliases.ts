/**
 * server-only-input-aliases.ts — V5.3.1 Server-Only Input Alias Resolution
 *
 * Maps old Turkish input IDs to new English canonical IDs.
 * Used only in server-side request normalization.
 * Aliases NEVER appear in public schema, UI, audit, PDF, or copy summary.
 *
 * import "server-only";
 */

// Map of old Turkish IDs → new English canonical IDs
const TURKISH_TO_ENGLISH_ID_MAP: Record<string, string> = {
  // Cost / Financial
  birimMaliyet: "unitCost",
  degiskenMaliyet: "variableCost",
  sabitMaliyet: "fixedCost",
  toplamMaliyet: "totalCost",
  yillikMaliyet: "annualCost",
  iscilikMaliyeti: "laborCost",
  malzemeMaliyeti: "materialCost",
  uretimMaliyeti: "productionCost",

  // Revenue / Income
  yillikNetGelir: "annualNetRevenue",
  netKar: "netProfit",
  brütKar: "grossProfit",
  kar: "profit",
  zarar: "loss",

  // Value / Amount
  yillikDeger: "annualValue",
  ilkDeger: "initialValue",
  paraBirimi: "currencyUnit",
  krediTutari: "loanAmount",
  faiz: "interest",
  faizOrani: "interestRate",
  toplam: "total",
  toplamIstek: "totalRequests",

  // Investment / Shares
  portfoy: "portfolio",
  hisse: "share",
  hisseTutar: "shareAmount",
  hisseAdet: "shareQuantity",
  tahvil: "bond",

  // Stocks / Inventory
  stok: "stock",
  stokGun: "stockDays",
  emniyetStoku: "safetyStock",
  yenidenSiparis: "reorderPoint",
  tedarik: "supply",
  tedarikSuresi: "leadTime",
  tedarikci: "supplier",

  // Period / Time
  yillik: "annual",
  aylik: "monthly",
  gun: "day",
  ay: "month",
  yil: "year",
  donem: "period",

  // Production / Manufacturing
  uretim: "production",
  uretimMiktari: "productionQuantity",
  kapasite: "capacity",
  verim: "efficiency",
  fire: "scrap",
  fireOrani: "scrapRate",

  // Customer / Sales
  musteri: "customer",
  yeniMusteri: "newCustomer",
  satis: "sales",
  satisFiyati: "salesPrice",

  // Employee
  calisan: "employee",
  calisanSayisi: "employeeCount",

  // Physical / Engineering
  yukseklik: "height",
  genislik: "width",
  uzunluk: "length",
  derinlik: "depth",
  alan: "area",
  hacim: "volume",
  agirlik: "weight",
  hiz: "speed",
  yaricap: "radius",
  cap: "diameter",

  // Electrical
  gerilim: "voltage",
  akim: "current",
  guc: "power",
  direnc: "resistance",

  // Temperature / Pressure
  sicaklik: "temperature",
  basinc: "pressure",

  // Time / Duration
  sure: "duration",
  saat: "hour",

  // Production
  uretimAdeti: "productionQuantity",

  // Mechanics
  moment: "moment",
  tork: "torque",
  frekans: "frequency",
  enerji: "energy",

  // Quality
  kalite: "quality",
  ortalama: "average",
  standart: "standard",
  sapma: "deviation",

  // Business
  oran: "ratio",
  birim: "unit",
  adet: "quantity",
  miktar: "quantity",
};

/**
 * Resolve an input ID from any supported alias to its canonical English form.
 * If no alias mapping exists, returns the ID unchanged.
 * This is a server-only operation. Results never appear in public output.
 */
export function resolveAliasToCanonical(id: string): string {
  if (TURKISH_TO_ENGLISH_ID_MAP[id]) {
    return TURKISH_TO_ENGLISH_ID_MAP[id];
  }

  // Try camelCase split resolution
  const parts = id.split(/(?<=[a-z])(?=[A-Z])/);
  if (parts.length > 1) {
    const translated = parts.map((part) => TURKISH_TO_ENGLISH_ID_MAP[part] || part);
    return translated.join("");
  }

  return id;
}

export function resolveAliasToCanonicalMap(ids: string[]): Record<string, string> {
  const result: Record<string, string> = {};
  for (const id of ids) {
    const canonical = resolveAliasToCanonical(id);
    if (canonical !== id) {
      result[id] = canonical;
    }
  }
  return result;
}
