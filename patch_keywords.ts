import fs from 'fs';

let content = fs.readFileSync('src/lib/catalog/resolve-tool-category.ts', 'utf8');

const updatedKeywords = `const KEYWORD_CATEGORY_RULES: ReadonlyArray<{
  readonly categorySlug: GlobalToolCategorySlug;
  readonly keywords: readonly string[];
}> = [
  { categorySlug: "lean-production", keywords: ["smed", "kanban", "vsm", "kaizen", "andon", "oee", "takt", "heijunka", "poka", "muda", "israf", "waste", "downtime", "lean", "uretim hatti", "yalin"] },
  { categorySlug: "quality-six-sigma", keywords: ["cpk", "ppk", "spc", "msa", "sigma", "aql", "fty", "rty", "taguchi", "fmea", "htea", "kalite", "quality", "scrap", "fire", "tolerance", "tolerans", "rework", "defect", "kusur", "hata"] },
  { categorySlug: "process-chemical", keywords: ["reaktor", "pompa", "harman", "kutle", "ventil", "kimya", "proses", "chemical", "fluid", "buhar", "reactor", "process"] },
  { categorySlug: "cnc-additive-manufacturing", keywords: ["cnc", "3b", "3d", "takim", "tool", "filament", "baski", "machining", "tezgah", "spindle", "torna", "freze", "additive", "manufacturing"] },
  { categorySlug: "metal-plastics-forming", keywords: ["sac", "dokum", "enjeksiyon", "pres", "bukum", "metal", "sheet", "forming", "injection", "plastic", "molding", "welding", "kaynak"] },
  { categorySlug: "project-construction-management", keywords: ["evm", "cpm", "santiye", "insaat", "construction", "hakedis", "sozlesme", "concrete", "paint", "roof", "cati", "boya", "plumbing", "boru", "metraj", "saha", "contractor", "taseron"] },
  { categorySlug: "digital-factory-automation", keywords: ["iot", "cobot", "agv", "dijital", "otomasyon", "digital", "automation", "robot"] },
  { categorySlug: "maintenance-reliability", keywords: ["mtbf", "mttr", "bakim", "ariza", "maintenance", "reliability", "rca", "repair", "tamir", "comeback"] },
  { categorySlug: "hse-ergonomics", keywords: ["isg", "ergonomi", "kaza", "gurultu", "hse", "safety", "health", "noise", "risk", "maruziyet", "titresim", "vibration"] },
  { categorySlug: "procurement-supply-chain", keywords: ["tedarik", "tco", "moq", "lojistik", "supply", "procurement", "route", "fuel", "transport", "freight", "navlun", "depo", "warehouse", "inventory", "envanter"] },
  { categorySlug: "workforce-hr", keywords: ["vardiya", "turnover", "egitim", "mesai", "workforce", "hr", "employee", "labor", "iscilik", "personel", "tazminat"] },
  { categorySlug: "finance-sales-working-capital", keywords: ["finans", "clv", "cac", "marj", "margin", "finance", "profit", "price", "quote", "rent", "loan", "roi", "npv", "amortisman", "payback", "revenue", "cost", "maliyet", "teklif", "karlilik"] },
  { categorySlug: "sustainability-resource-esg", keywords: ["karbon", "scope", "cbam", "esg", "surdur", "carbon", "emission", "energy", "footprint", "ayak izi"] },
  { categorySlug: "food-cold-chain-hygiene", keywords: ["gida", "soguk", "hygiene", "food", "menu", "restaurant", "agriculture", "tarim", "hayvancilik", "sut", "dairy", "crop", "yield", "hasat", "mahsul"] },
  { categorySlug: "textile-print-lab", keywords: ["tekstil", "baski", "print", "textile", "fabric", "reprint"] },
  { categorySlug: "electrical-power-systems", keywords: ["elektrik", "panel", "power", "voltage", "current", "electrical", "pano", "kablo", "akim"] },
  { categorySlug: "mechanical-hvac-energy-loss", keywords: ["hvac", "kompresor", "compressor", "mechanical", "leak", "pressure", "isi", "heat", "sogutma", "havalandirma", "basinc"] },
  { categorySlug: "packaging-local-business", keywords: ["paket", "local", "cleaning", "daily", "packaging", "retail", "temizlik"] },
  { categorySlug: "global-compliance-trade", keywords: ["compliance", "trade", "customs", "ihracat", "import", "regulation", "gumruk", "export", "kur", "doviz", "foreign exchange"] },
  { categorySlug: "technology-ai-cloud-cyber", keywords: ["cloud", "api", "ai", "siber", "cyber", "software", "math", "statistics", "conversion"] },
];`

content = content.replace(/const KEYWORD_CATEGORY_RULES: ReadonlyArray<\{[\s\S]*?\}\];/m, updatedKeywords);

fs.writeFileSync('src/lib/catalog/resolve-tool-category.ts', content);
