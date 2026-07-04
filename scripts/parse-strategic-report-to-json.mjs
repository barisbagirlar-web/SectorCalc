#!/usr/bin/env node
/**
 * One-time parser: strategic report TXT → scripts/data/strategic-roadmap-source.json
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "..");
const REPORT = join(
  process.env.HOME ?? "",
  "Downloads",
  "SECTORCALC İÇİN NİHAİ STRATEJİK ARAÇ Report.txt",
);

const text = readFileSync(REPORT, "utf8");

const TRAFFIC_MAP = {
  "Çok Yüksek": "very-high",
  "Yüksek": "high",
  Orta: "medium",
  "Düşük-Orta": "medium",
  Düşük: "low",
};

const CATEGORY_META = [
  {
    id: "basic-converters-math",
    tr: "Temel Dönüştürücüler ve Matematik",
    en: "Basic Converters and Math",
    de: "Grundlegende Umrechner und Mathematik",
    fr: "Convertisseurs de base et mathématiques",
    es: "Convertidores básicos y matemáticas",
  },
  {
    id: "construction-workshop-infrastructure",
    tr: "İnşaat, Yapı ve Atölye Altyapısı",
    en: "Construction, Building and Workshop Infrastructure",
    de: "Bau, Gebäude und Werkstattinfrastruktur",
    fr: "Construction, bâtiment et infrastructure d'atelier",
    es: "Construcción, edificación e infraestructura de taller",
  },
  {
    id: "electrical-energy-mechanical",
    tr: "Elektrik, Energy ve Mekanik",
    en: "Electrical, Energy and Mechanical",
    de: "Elektrik, Energie und Mechanik",
    fr: "Électricité, énergie et mécanique",
    es: "Electricidad, energía y mecánica",
  },
  {
    id: "manufacturing-material-inventory",
    tr: "İmalat, Material ve Inventory",
    en: "Manufacturing, Material and Inventory",
    de: "Fertigung, Material und Lager",
    fr: "Fabrication, matériaux et stock",
    es: "Fabricación, material e inventario",
  },
  {
    id: "finance-accounting-hr",
    tr: "Finance, Accounting ve İK",
    en: "Finance, Accounting and HR",
    de: "Finanzen, Buchhaltung und Personal",
    fr: "Finance, comptabilité et RH",
    es: "Finanzas, contabilidad y RR. HH.",
  },
  {
    id: "logistics-vehicle-shipping",
    tr: "Lojistik, Araç ve Sevkiyat",
    en: "Logistics, Vehicles and Shipping",
    de: "Logistik, Fahrzeuge und Versand",
    fr: "Logistique, véhicules et expédition",
    es: "Logística, vehículos y envíos",
  },
  {
    id: "business-daily-use",
    tr: "İşletme ve Günlük Useım",
    en: "Business and Daily Use",
    de: "Betrieb und tägliche Nutzung",
    fr: "Entreprise et usage quotidien",
    es: "Negocio y uso diario",
  },
  {
    id: "engineering-technical",
    tr: "Mühendislik ve Technical Hesaplar",
    en: "Engineering and Technical Calculations",
    de: "Ingenieur- und Technikberechnungen",
    fr: "Calculs d'ingénierie et techniques",
    es: "Cálculos de ingeniería y técnicos",
  },
];

/** Report row number → existing live free-tool slug */
const LIVE_FREE_BY_NUM = {
  1: "length-converter",
  2: "length-converter",
  3: "weight-converter",
  4: "weight-converter",
  5: "volume-converter",
  6: "volume-converter",
  7: "temperature-converter",
  12: "time-duration-calculator",
  13: "date-difference-calculator",
  14: "percentage-calculator",
  15: "percentage-calculator",
  16: "percentage-increase-calculator",
  17: "discount-calculator",
  18: "ratio-calculator",
  19: "average-calculator",
  21: "standard-deviation-calculator",
  25: "square-meter-calculator",
  31: "concrete-volume-calculator",
  32: "plaster-calculator",
  33: "concrete-bag-calculator",
  34: "rebar-weight-calculator",
  37: "sheet-metal-weight-calculator",
  39: "rebar-weight-calculator",
  40: "brick-calculator",
  41: "tile-calculator",
  43: "drywall-calculator",
  44: "roofing-area-calculator",
  45: "stair-calculator",
  46: "flooring-calculator",
  47: "excavation-volume-calculator",
  56: "electricity-bill-calculator",
  57: "energy-consumption-check",
  66: "kwh-cost-calculator",
  69: "compressor-energy-cost-calculator",
  80: "fuel-consumption-calculator",
  81: "fuel-cost-calculator",
  86: "material-waste-calculator",
  87: "welding-cost-estimator",
  91: "cutting-speed-calculator",
  92: "feed-rate-calculator",
  100: "paint-coverage-calculator",
  102: "home-renovation-m2-calculator",
  108: "cutting-speed-calculator",
  109: "feed-rate-calculator",
  111: "vat-calculator",
  115: "salary-cost-calculator",
  116: "salary-cost-calculator",
  118: "time-duration-calculator",
  119: "salary-cost-calculator",
  120: "salary-cost-calculator",
  125: "depreciation-calculator",
  128: "loan-payment-calculator",
  131: "unit-price-calculator",
  133: "interest-calculator",
  136: "profit-margin-calculator",
  137: "break-even-calculator",
  138: "roi-calculator",
  139: "compound-interest-calculator",
  141: "desi-calculator",
  142: "volumetric-weight-calculator",
  145: "fuel-consumption-calculator",
  146: "fuel-cost-calculator",
  147: "trip-budget-calculator",
  152: "warehouse-storage-cost-calculator",
  155: "vehicle-depreciation-calculator",
  175: "water-usage-calculator",
  191: "solar-panel-output-calculator",
  196: "tolerance-drift-calculator",
  199: "batch-yield-calculator",
  200: "unit-cost-calculator",
};

/** @type {Record<string, string>} */
const LIVE_FREE_SLUG_MAP = {
  "metre-centimetre-millimetre-converter": "length-converter",
  "kilometre-mile-converter": "length-converter",
  "kilogram-pound-converter": "weight-converter",
  "gram-ounce-converter": "weight-converter",
  "litre-gallon-converter": "volume-converter",
  "cubic-metre-litre-converter": "volume-converter",
  "celsius-fahrenheit-converter": "temperature-converter",
  "time-duration-calculator": "time-duration-calculator",
  "days-between-dates-calculator": "date-difference-calculator",
  "percentage-calculator": "percentage-calculator",
  "percent-of-number-calculator": "percentage-calculator",
  "percentage-change-calculator": "percentage-increase-calculator",
  "discount-calculator": "discount-calculator",
  "ratio-proportion-calculator": "ratio-calculator",
  "arithmetic-mean-calculator": "average-calculator",
  "standard-deviation-calculator": "standard-deviation-calculator",
  "rectangle-area-calculator": "square-meter-calculator",
  "concrete-volume-calculator": "concrete-volume-calculator",
  "screed-volume-material-calculator": "plaster-calculator",
  "ready-mix-concrete-order-calculator": "concrete-bag-calculator",
  "steel-weight-calculator": "rebar-weight-calculator",
  "sheet-metal-weight-calculator": "sheet-metal-weight-calculator",
  "rebar-mesh-weight-calculator": "rebar-weight-calculator",
  "brick-block-quantity-calculator": "brick-calculator",
  "tile-ceramic-area-calculator": "tile-calculator",
  "drywall-plasterboard-calculator": "drywall-calculator",
  "roof-pitch-slope-calculator": "roofing-area-calculator",
  "stair-riser-tread-calculator": "stair-calculator",
  "floor-covering-area-calculator": "flooring-calculator",
  "excavation-volume-calculator": "excavation-volume-calculator",
  "electricity-bill-estimate-calculator": "electricity-bill-calculator",
  "daily-monthly-electricity-usage-calculator": "energy-consumption-check",
  "led-lighting-savings-calculator": "kwh-cost-calculator",
  "compressor-leak-cost-calculator": "compressor-energy-cost-calculator",
  "fuel-consumption-l100km-calculator": "fuel-consumption-calculator",
  "fuel-consumption-logistics-calculator": "fuel-consumption-calculator",
  "cost-per-km-calculator": "fuel-cost-calculator",
  "sheet-metal-nesting-scrap-calculator": "material-waste-calculator",
  "welding-consumable-calculator": "welding-cost-estimator",
  "belt-pulley-speed-calculator": "cutting-speed-calculator",
  "belt-length-calculator": "feed-rate-calculator",
  "cnc-spindle-feed-speed-calculator": "cutting-speed-calculator",
  "cutting-speed-rpm-converter": "feed-rate-calculator",
  "vat-calculator": "vat-calculator",
  "gross-net-salary-calculator": "salary-cost-calculator",
  "annual-leave-days-calculator": "time-duration-calculator",
  "severance-share-calculator": "salary-cost-calculator",
  "notice-share-calculator": "salary-cost-calculator",
  "depreciation-calculator": "depreciation-calculator",
  "loan-installment-calculator": "loan-payment-calculator",
  "currency-converter-calculator": "unit-price-calculator",
  "invoice-late-payment-interest-calculator": "interest-calculator",
  "gross-net-margin-calculator": "profit-margin-calculator",
  "break-even-point-calculator": "break-even-calculator",
  "payback-period-calculator": "roi-calculator",
  "npv-calculator": "compound-interest-calculator",
  "shipping-desi-calculator": "desi-calculator",
  "volumetric-weight-calculator": "volumetric-weight-calculator",
  "fuel-consumption-logistics-calculator": "fuel-consumption-calculator",
  "intercity-distance-fuel-budget-calculator": "trip-budget-calculator",
  "warehouse-rent-per-sqm-calculator": "warehouse-storage-cost-calculator",
  "vehicle-depreciation-calculator": "vehicle-depreciation-calculator",
  "water-bill-wastewater-calculator": "water-usage-calculator",
  "tolerance-stack-up-calculator": "tolerance-stack-up-calculator",
  "safety-stock-calculator": "batch-yield-calculator",
  "economic-order-quantity-calculator": "unit-cost-calculator",
  "oee-calculator": "oee-calculator",
  "machine-hour-rate-calculator": "machine-hour-rate-calculator",
  "solar-panel-output-calculator": "solar-panel-output-calculator",
  "paint-coating-consumption-calculator": "paint-coverage-calculator",
  "wood-timber-volume-calculator": "home-renovation-m2-calculator",
  "freight-cost-calculator": "freight-cost-calculator",
  "route-cost-calculator": "route-cost-calculator",
};

function slugify(title) {
  const map = {
    ç: "c",
    Ç: "c",
    ğ: "g",
    Ğ: "g",
    ı: "i",
    İ: "i",
    ö: "o",
    Ö: "o",
    ş: "s",
    Ş: "s",
    ü: "u",
    Ü: "u",
    "–": "-",
    "—": "-",
    "/": "-",
    "(": "",
    ")": "",
    "'": "",
    '"': "",
    ".": "",
    ",": "",
    "+": "plus",
    "%": "percent",
  };
  let s = title;
  for (const [k, v] of Object.entries(map)) s = s.split(k).join(v);
  return s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .replace(/-+/g, "-");
}

function enTitleFromTr(trTitle) {
  const replacements = [
    [/Hesaplayıcı/gi, "Calculator"],
    [/Calculation/gi, "Calculation"],
    [/Çevirici/gi, "Converter"],
    [/Çevirme/gi, "Conversion"],
    [/Hesabı/gi, "Calculation"],
    [/Account/gi, "Calculation"],
    [/ – /g, " — "],
  ];
  let s = trTitle;
  for (const [re, rep] of replacements) s = s.replace(re, rep);
  return s;
}

function parseFreeSection() {
  const start = text.indexOf("KATEGORİ 1: TEMEL DÖNÜŞTÜRÜCÜLER");
  const end = text.indexOf("200\tEkonomik Sipariş Quantityı");
  const section = text.slice(start, end + 200);
  const lines = section.split("\n");
  const items = [];
  let catIndex = -1;
  const usedSlugs = new Set();

  for (const line of lines) {
    const catMatch = line.match(/^KATEGORİ (\d+): (.+) \((\d+) Araç\)/);
    if (catMatch) {
      catIndex = Number(catMatch[1]) - 1;
      continue;
    }
    const rowMatch = line.match(/^(\d+)\t(.+)\t(.+)\t(.+)$/);
    if (!rowMatch || catIndex < 0) continue;
    const num = Number(rowMatch[1]);
    const trTitle = rowMatch[2].trim();
    const trAudience = rowMatch[3].trim();
    const trafficRaw = rowMatch[4].trim();
    let slug = slugify(trTitle);
    if (usedSlugs.has(slug)) slug = `${slug}-${num}`;
    usedSlugs.add(slug);
    const mapped = LIVE_FREE_BY_NUM[num] ?? null;
    items.push({
      id: `ft-${String(num).padStart(3, "0")}`,
      slug,
      categoryId: CATEGORY_META[catIndex].id,
      trTitle,
      enTitle: enTitleFromTr(trTitle),
      trAudience,
      enAudience: trAudience
        .replace(/Herkes/g, "Everyone")
        .replace(/İnşaat, atölye/g, "Construction and workshops")
        .replace(/İnşaat, tadilat/g, "Construction and renovation")
        .replace(/İnşaat/g, "Construction")
        .replace(/Accounting, satış/g, "Accounting and sales")
        .replace(/Muhasebeci/g, "Accountants")
        .replace(/İK, patron/g, "HR and owners")
        .replace(/İK, çalışan/g, "HR and employees")
        .replace(/İK/g, "HR")
        .replace(/Patron, yönetici/g, "Owners and managers")
        .replace(/Patron/g, "Business owners")
        .replace(/Lojistik, e-ticaret/g, "Logistics and e-commerce")
        .replace(/Lojistik/g, "Logistics")
        .replace(/Bakım, otomasyon/g, "Maintenance and automation")
        .replace(/Bakım/g, "Maintenance")
        .replace(/Elektrikçi/g, "Electricians")
        .replace(/Machine, otomotiv/g, "Machinery and automotive")
        .replace(/Quality control/g, "Quality control")
        .replace(/Quality, üduction, İK/g, "Quality, production and HR")
        .replace(/Quality, montaj/g, "Quality and assembly")
        .replace(/Quality/g, "Quality teams")
        .replace(/Technical resim, manufacturing/g, "Technical drawing and manufacturing")
        .replace(/Technical resim/g, "Technical drawing")
        .replace(/Sac metal, lazer/g, "Sheet metal and laser")
        .replace(/Sac metal/g, "Sheet metal shops")
        .replace(/Resource atölyesi/g, "Welding shops")
        .replace(/CNC, torna/g, "CNC and lathe shops")
        .replace(/Finance/g, "Finance teams")
        .replace(/Energy, mühendis/g, "Energy and engineers")
        .replace(/Energy, çatı GES/g, "Energy and rooftop solar")
        .replace(/Energy/g, "Energy teams")
        .replace(/Ofis, ev/g, "Office and home")
        .replace(/Ofis, atölye/g, "Office and workshop")
        .replace(/Ofis/g, "Office teams")
        .replace(/İşletme, ev/g, "Business and home")
        .replace(/İşletme/g, "Business teams")
        .replace(/Araç, lojistik/g, "Fleet and logistics")
        .replace(/Filo/g, "Fleet managers"),
      trafficPotential: TRAFFIC_MAP[trafficRaw] ?? "medium",
      mappedLiveSlug: mapped,
      status: mapped ? "live" : "planned",
    });
  }
  return items;
}

const PREMIUM_ITEMS = [
  {
    id: "sp-001",
    slug: "quote-price-profit-margin-calculator",
    phase: 1,
    score: 9.7,
    categoryId: "cost-margin",
    trTitle: "Teklif Priceı ve Kâr Marginı Hesaplayıcı",
    mappedLiveSlug: "quote-price-profit-margin-calculator",
    status: "live",
  },
  {
    id: "sp-002",
    slug: "shop-rate-hourly-cost-calculator",
    phase: 1,
    score: 9.2,
    categoryId: "operations-oee",
    trTitle: "Machine Saat Ücreti Hesaplayıcı",
    mappedLiveSlug: "machine-hour-rate-calculator",
    status: "live",
  },
  {
    id: "sp-003",
    slug: "break-even-safety-margin-calculator",
    phase: 1,
    score: 9.1,
    categoryId: "finance-hr",
    trTitle: "Başabaş Noktası ve Güvenlik Marginı Hesaplayıcı",
    mappedLiveSlug: "break-even-calculator",
    status: "live",
  },
  {
    id: "sp-004",
    slug: "auto-repair-parts-labor-quote-calculator",
    phase: 1,
    score: 9.0,
    categoryId: "cost-margin",
    trTitle: "Tamirhane Parça ve İşçilik Teklif Hesaplayıcı",
    status: "planned",
  },
  {
    id: "sp-005",
    slug: "cbam-unit-product-carbon-footprint-calculator",
    phase: 1,
    score: 8.8,
    categoryId: "energy-carbon",
    trTitle: "SKDM Unit Ürün Karbon Ayak İzi Hesaplayıcı",
    mappedLiveSlug: "cbam-exposure-quick-check",
    status: "live",
  },
  {
    id: "sp-006",
    slug: "oee-equipment-effectiveness-calculator",
    phase: 1,
    score: 8.8,
    categoryId: "operations-oee",
    trTitle: "OEE Hesaplayıcı",
    mappedLiveSlug: "oee-calculator",
    status: "live",
  },
  {
    id: "sp-007",
    slug: "compressor-leak-cost-calculator",
    phase: 1,
    score: 8.7,
    categoryId: "energy-carbon",
    trTitle: "Kompresör Kaçağı Cost Hesaplayıcı",
    mappedLiveSlug: "compressor-energy-cost-calculator",
    status: "live",
  },
  {
    id: "sp-008",
    slug: "employee-total-cost-calculator",
    phase: 2,
    score: 8.5,
    categoryId: "finance-hr",
    trTitle: "Personel Tam Cost Hesaplayıcı",
    mappedLiveSlug: "salary-cost-calculator",
    status: "live",
  },
  {
    id: "sp-009",
    slug: "downtime-minute-cost-calculator",
    phase: 2,
    score: 8.4,
    categoryId: "operations-oee",
    trTitle: "Duruş Dakika Cost Hesaplayıcı",
    status: "planned",
  },
  {
    id: "sp-010",
    slug: "product-customer-profitability-calculator",
    phase: 2,
    score: 8.3,
    categoryId: "cost-margin",
    trTitle: "Ürün ve Müşteri Kârlılığı Hesaplayıcı",
    mappedLiveSlug: "profit-margin-calculator",
    status: "live",
  },
  {
    id: "sp-011",
    slug: "inventory-carrying-cost-eoq-calculator",
    phase: 2,
    score: 7.9,
    categoryId: "manufacturing-engineering",
    trTitle: "Inventory Taşıma Cost ve EOQ Hesaplayıcı",
    mappedLiveSlug: "unit-cost-calculator",
    status: "live",
  },
  {
    id: "sp-012",
    slug: "welded-bolted-connection-calculator",
    phase: 2,
    score: 7.7,
    categoryId: "manufacturing-engineering",
    trTitle: "Kaynaklı ve Bulonlu Bağlantı Hesaplayıcı",
    status: "planned",
  },
  {
    id: "sp-013",
    slug: "tolerance-stack-up-calculator",
    phase: 2,
    score: 7.7,
    categoryId: "manufacturing-engineering",
    trTitle: "Tolerans Yığılma Hesaplayıcı",
    mappedLiveSlug: "tolerance-stack-up-calculator",
    status: "live",
  },
  {
    id: "sp-014",
    slug: "bolt-tightening-torque-calculator",
    phase: 3,
    score: 7.4,
    categoryId: "manufacturing-engineering",
    trTitle: "Civata Sıkma Torku Hesaplayıcı",
    status: "planned",
  },
  {
    id: "sp-015",
    slug: "energy-savings-package-calculator",
    phase: 3,
    score: 7.4,
    categoryId: "energy-carbon",
    trTitle: "Energy Savings Hesaplayıcı",
    mappedLiveSlug: "energy-savings-package-calculator",
    status: "live",
  },
  {
    id: "sp-016",
    slug: "investment-payback-npv-calculator",
    phase: 3,
    score: 7.1,
    categoryId: "finance-hr",
    trTitle: "Yatırım Geri Dönüş ve NPV Hesaplayıcı",
    mappedLiveSlug: "investment-payback-npv-calculator",
    status: "live",
  },
  {
    id: "sp-017",
    slug: "waste-system-flow-hydrant-calculator",
    phase: 3,
    score: 6.7,
    categoryId: "engineering-technical",
    trTitle: "Yangın Tesisatı Debi ve Hidrant Hesaplayıcı",
    status: "planned",
  },
  {
    id: "sp-018",
    slug: "annual-leave-severance-notice-calculator",
    phase: 3,
    score: 6.6,
    categoryId: "finance-hr",
    trTitle: "Yıllık İzin, Kıdem ve İhbar Tazminatı Hesaplayıcı",
    mappedLiveSlug: "annual-leave-severance-notice-calculator",
    status: "live",
  },
  {
    id: "sp-019",
    slug: "hydraulic-pneumatic-cylinder-force-calculator",
    phase: 4,
    score: 6.4,
    categoryId: "engineering-technical",
    trTitle: "Hydraulic ve Pnömatik Silindir Force Hesaplayıcı",
    status: "planned",
  },
  {
    id: "sp-020",
    slug: "belt-pulley-speed-length-calculator",
    phase: 4,
    score: 6.2,
    categoryId: "engineering-technical",
    trTitle: "Kayış Kasnak Devir ve Length Hesaplayıcı",
    mappedLiveSlug: "belt-pulley-speed-length-calculator",
    status: "live",
  },
  {
    id: "sp-021",
    slug: "quality-cost-paf-calculator",
    phase: 4,
    score: 6.1,
    categoryId: "quality-lean",
    trTitle: "Quality Cost PAF Hesaplayıcı",
    status: "planned",
  },
  {
    id: "sp-022",
    slug: "pressure-vessel-wall-thickness-calculator",
    phase: 4,
    score: 5.9,
    categoryId: "engineering-technical",
    trTitle: "Basınçlı Kap Cidar Kalınlığı Hesaplayıcı",
    status: "planned",
  },
  {
    id: "sp-023",
    slug: "value-stream-map-vsm-calculator",
    phase: 4,
    score: 5.7,
    categoryId: "quality-lean",
    trTitle: "Değer Akış Haritası VSM Hesaplayıcı",
    status: "planned",
  },
];

const freeItems = parseFreeSection();
if (freeItems.length !== 200) {
  console.error(`Expected 200 free items, got ${freeItems.length}`);
  process.exit(1);
}

mkdirSync(join(ROOT, "scripts/data"), { recursive: true });
writeFileSync(
  join(ROOT, "archive/migration-only/scripts/data/strategic-roadmap-source.json"),
  JSON.stringify(
    {
      categories: CATEGORY_META,
      premium: PREMIUM_ITEMS,
      free: freeItems,
    },
    null,
    2,
  ),
);
console.log(`Wrote source JSON: premium=${PREMIUM_ITEMS.length}, free=${freeItems.length}`);
