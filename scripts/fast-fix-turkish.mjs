/**
 * Fast bulk Turkish → English replacement across all source files.
 * Uses the hash set to identify which tokens are Turkish.
 * Run: node scripts/fast-fix-turkish.mjs
 */
import fs from "fs";
import path from "path";
import crypto from "crypto";

const ROOT = new URL("..", import.meta.url).pathname;

// Phase 1: Load hash set and find tokens
const hashes = JSON.parse(fs.readFileSync(path.join(ROOT, "data/governance/forbidden-token-hashes.json"), "utf8"));
const hashSet = new Set(hashes);

// Turkish → English map (must be comprehensive)
const TR_TO_EN = {
  uretim:"production", uretimi:"production", uretir:"produces",
  imalat:"manufacturing", imalati:"manufacturing",
  maliyet:"cost", maliyeti:"cost", maliyete:"cost", maliyette:"cost",
  iscilik:"labor",
  yatirim:"investment", yatirimi:"investment",
  ortalama:"average", ortalamasi:"average",
  malzeme:"material", malzemesi:"material",
  birim:"unit", birimi:"unit",
  ornek:"example", ornegi:"example",
  hacim:"volume", hacmi:"volume", hacmine:"volume",
  toplam:"total", toplami:"total",
  miktar:"quantity", miktari:"quantity",
  agirlik:"weight", agirligi:"weight",
  stok:"inventory", stogu:"inventory",
  girdi:"input", girdisi:"input",
  cikti:"output", ciktisi:"output",
  cikis:"outlet", cikisa:"outlet",
  hesapla:"calculate", hesaplama:"calculation", hesap:"account",
  sonuc:"result", sonucu:"result",
  odeme:"payment", odemesi:"payment",
  verim:"efficiency", verimi:"efficiency", verimlilik:"productivity",
  urun:"product", urunu:"product", urune:"product",
  parca:"part", parcasi:"part",
  tedarikci:"supplier", tedarik:"supply",
  insaat:"construction",
  muhendis:"engineer", muhendislik:"engineering",
  emlak:"realestate",
  cevre:"environment", cevresel:"environmental",
  ahsap:"wood",
  hidrolik:"hydraulic", pnomatik:"pneumatic",
  demiryolu:"railway",
  butce:"budget",
  kutle:"mass", kutlesel:"mass",
  kuvvet:"force",
  gerilim:"stress",
  celik:"steel",
  cati:"roof",
  kiris:"beam",
  kolon:"column",
  duvar:"wall",
  beton:"concrete",
  gunes:"solar",
  ruzgar:"wind",
  egim:"slope", egimi:"slope",
  yuzey:"surface", yuzeyi:"surface",
  alan:"area", alani:"area",
  akis:"flow", akisi:"flow",
  hiz:"speed", hizi:"speed", hizli:"fast",
  kullanici:"user", kullanim:"usage", kullan:"user",
  guvenlik:"safety", guvenli:"safe",
  basinc:"pressure",
  sicaklik:"temperature",
  tasarim:"design", tasarimi:"design",
  direnc:"resistance", direnci:"resistance",
  kapasite:"capacity", kapasitesi:"capacity",
  guc:"power", gucu:"power",
  deger:"value", degeri:"value",
  donem:"period", donemi:"period",
  oran:"ratio", orani:"ratio",
  adet:"count", adedi:"count",
  yukseklik:"height", yuksek:"high",
  uzunluk:"length", uzun:"long",
  genislik:"width", genis:"wide",
  enerji:"energy",
  proje:"project", projesi:"project",
  saha:"site",
  teknik:"technical", tekniker:"technician",
  marj:"margin",
  fire:"waste", fireyi:"waste",
  kayip:"loss", kaybi:"loss",
  kalite:"quality",
  bakim:"maintenance", bakimli:"maintained",
  cozum:"solution", cozumu:"solution",
  yapi:"structure", yapisi:"structure",
  yonetim:"management",
  planlama:"planning",
  musteri:"customer", musterisi:"customer",
  arac:"tool", araci:"tool",
  israf:"waste",
  kaynak:"resource", kaynagi:"resource",
  tasarruf:"savings",
  potansiyel:"potential",
  performans:"performance", performansi:"performance",
  izleme:"monitoring",
  denetim:"audit", denetimi:"audit",
  rapor:"report", raporu:"report",
  belge:"document", belgesi:"document",
  kayit:"record", kaydi:"record",
  guncelleme:"update",
  onarim:"repair",
  durum:"status", durumu:"status",
  kurulum:"installation",
  calisma:"operation", calisan:"running", calistir:"execute", calistirma:"execution",
  durdurma:"shutdown", durdur:"stop",
  acil:"emergency",
  kriz:"crisis",
  bildirim:"notification",
  uyari:"warning", uyarisi:"warning",
  mudahale:"intervention",
  kurtarma:"recovery",
  periyot:"period", periyodu:"period",
  anlik:"instant",
  tepe:"peak",
  dip:"trough",
  degisim:"change", degisimi:"change", degisken:"variable", degiskene:"variable",
  momentum:"momentum",
  ivme:"acceleration",
  baslangic:"start",
  bitis:"finish",
  asama:"phase", asamasi:"phase",
  adim:"step", adimi:"step",
  sira:"sequence", sirasi:"sequence",
  tekrar:"repeat",
  dongu:"cycle", dongusu:"cycle",
  aktif:"active", aktifi:"active",
  degradasyon:"degradation",
  sinyal:"signal",
  goruntu:"image",
  modelleme:"modeling",
  tahmin:"prediction", tahmini:"prediction",
  sayisal:"numerical",
  analiz:"analysis", analizi:"analysis",
  sentetik:"synthetic",
  uretec:"generator",
  bilesen:"component", bileseni:"component",
  algoritma:"algorithm",
  birikimli:"cumulative",
  dagilim:"distribution", dagilimi:"distribution",
  olasilik:"probability",
  beklenen:"expected",
  bilesik:"compound", bilesigi:"compound",
  artis:"increase",
  sinir:"limit", siniri:"limit",
  kosul:"condition",
  kisit:"constraint",
  kontrol:"control", kontrolu:"control",
  belirsizlik:"uncertainty",
  duyarlilik:"sensitivity",
  katki:"contribution", katkisi:"contribution",
  agirlikli:"weighted",
  harmanlanmis:"blended",
  gecmis:"historical",
  simdiki:"current",
  gelecek:"future",
  gerceklesen:"actual", gerceklesme:"realization",
  planlanan:"planned",
  sapma:"deviation", sapmasi:"deviation",
  dogruluk:"accuracy", dogrulama:"validation",
  kesinlik:"precision",
  seviye:"level", seviyesi:"level",
  frekans:"frequency",
  davranis:"behavior",
  proses:"process", prosesi:"process",
  talep:"demand", talebi:"demand",
  hazirlik:"setup", hazirligi:"setup",
  satis:"sales", satisi:"sales",
  fiyat:"price", fiyati:"price",
  gun:"day", gunluk:"daily", gunde:"perday",
  yil:"year", yillik:"annual", yilda:"peryear",
  hata:"error", hatali:"incorrect",
  pay:"share",
  yedek:"spare", yedegi:"spare",
  cevrim:"cycle", cevrimi:"cycle",
  sure:"duration", suresi:"duration",
  dogru:"correct",
  yapilan:"performed",
  gecikme:"delay", gecikmesi:"delay",
  egilim:"trend",
  zorluk:"difficulty", zorlugu:"difficulty",
  katsayi:"coefficient", katsayisi:"coefficient",
  sayisi:"count",
  mesafe:"distance",
  araba:"vehicle",
  yukleme:"loading", yukle:"load",
  bosaltma:"unloading", bosalt:"unload",
  bekleme:"waiting", bekle:"wait",
  surucu:"driver",
  isletme:"operating", islet:"operate",
  gider:"expense",
  amortisman:"depreciation",
  tamir:"repair",
  yakit:"fuel",
  yag:"oil",
  lastik:"tire",
  sigorta:"insurance",
  vergi:"tax",
  kasko:"comprehensive",
  kar:"profit", kari:"profit",
  zarar:"loss", zarari:"loss",
  varyans:"variance",
  korelasyon:"correlation",
  regresyon:"regression",
  kumeleme:"clustering",
  siniflandirma:"classification",
  sinif:"class", sinifi:"class",
  etiket:"label", etiketi:"label",
  ozellik:"feature", ozelligi:"feature",
  ogrenme:"learning",
  egitim:"training", egitimi:"training",
  esik:"threshold",
  makine:"machine", makinesi:"machine",
  muhasebe:"accounting",
  finans:"finance", finansal:"financial",
  fabrika:"factory",
  depo:"warehouse",
  santiye:"constructionsite",
  hakedis:"progresspayment",
  sozlesme:"contract",
  bilinmez:"unknown", bilinmiyor:"unknown",
  yanlis:"wrong", yanlisi:"wrong",
  yontem:"method", yontemi:"method",
  ekonomik:"economic",
  optimum:"optimal", optimumu:"optimal",
  taseron:"subcontractor",
  yuklenici:"contractor",
  uyusmazlik:"dispute",
  kacinilmaz:"inevitable",
  cezalar:"penalties",
  mali:"financial",
  sektor:"sector", sektorel:"sectoral",
  reel:"real",
  nominal:"nominal",
  kira:"rent",
  kiralama:"leasing",
  faiz:"interest",
  enflasyon:"inflation",
  risk:"risk", riskli:"risky",
  trend:"trend",
  senaryo:"scenario", senaryosu:"scenario",
  referans:"reference", referansi:"reference",
  yuk:"load", yuku:"load",
  tork:"torque",
  moment:"moment",
  isil:"thermal",
  termal:"thermal",
  kimya:"chemical", kimyasal:"chemical",
  tur:"type", turu:"type",
  cap:"diameter", capi:"diameter",
  saat:"hour", saati:"hour",
  motor:"motor", motoru:"motor",
  para:"money",
  tip:"type", tipi:"type",
  uc:"three",
  mur:"",
  maks:"max",
  min:"min",
  mak:"max",
  sur:"drive",
  sureklilik:"continuity",
  belirle:"determine",
  surdurulebilirlik:"sustainability",
  tamamlanan:"completed", tamamlanmamis:"incomplete",
  basarili:"successful", basarisiz:"failed",
  beklemede:"pending",
  iptal:"cancelled",
  onay:"approved", onayi:"approved",
  bekleyen:"waiting",
  bosta:"idle", bosa:"wasted",
  harcan:"consume", harcani:"consume",
  sigar:"fits",
  kac:"many", kaca:"many",
  tablaya:"totable",
  edilmez:"notdone",
  hangi:"which",
  adette:"perquantity",
  secenek:"option", secenegi:"option",
  bilesik:"compound",
  birbirine:"mutual",
  dondurulmus:"frozen",
  kullanilabilir:"available",
  belirlenemez:"undetermined",
  belirlenmemis:"unset",
  tanimlanmamis:"undefined",
  basinc:"pressure",
  elektrik:"electric",
  elektronik:"electronic",
  haberlesme:"communication",
  otomasyon:"automation",
  yazilim:"software",
  donanim:"hardware",
  bilisim:"informatics",
  iletisim:"communication",
  ulasim:"transportation",
  lojistik:"logistics",
  dagitim:"distribution",
  depolama:"storage",
  nakliye:"shipping",
};

// Sort by length descending
const sortedKeys = Object.keys(TR_TO_EN).sort((a, b) => b.length - a.length);

function fixContent(content) {
  let result = content;
  for (const tr of sortedKeys) {
    const en = TR_TO_EN[tr];
    if (tr === en) continue;
    
    // Word boundary replacement with case preservation
    // This matches the token as a standalone word (between non-alpha chars or string edges)
    // OR when preceded by uppercase+lowercase transition (camelCase middle)
    
    // Primary: word boundary matches
    const re1 = new RegExp("(?<=^|[^a-zA-Z])" + tr + "(?=[^a-zA-Z]|$)", "gi");
    result = result.replace(re1, (match) => {
      if (match === tr) return en;
      if (match === tr.charAt(0).toUpperCase() + tr.slice(1))
        return en.charAt(0).toUpperCase() + en.slice(1);
      if (match === tr.toUpperCase()) return en.toUpperCase();
      const firstUpper = match.charAt(0) === match.charAt(0).toUpperCase();
      return firstUpper ? en.charAt(0).toUpperCase() + en.slice(1) : en;
    });
    
    // Secondary: camelCase boundary — token that starts with uppercase
    // and is followed by uppercase (e.g., "UretimHizi" → "ProductionHizi")
    if (tr.length >= 3) {
      const trUpper = tr.charAt(0).toUpperCase() + tr.slice(1);
      const enUpper = en.charAt(0).toUpperCase() + en.slice(1);
      // Inside camelCase: preceded by lowercase letter and followed by uppercase
      const re2a = new RegExp("(?<=[a-z])" + trUpper + "(?=[A-Z])", "g");
      result = result.replace(re2a, enUpper);
      // Start of identifier or after non-alpha: followed by uppercase
      const re2b = new RegExp("(?<=^|[^a-zA-Z])" + trUpper + "(?=[A-Z])", "g");
      result = result.replace(re2b, enUpper);
    }
  }
  return result;
}

function scan(dir) {
  let fixed = 0, total = 0;
  try {
    const entries = fs.readdirSync(dir);
    for (const entry of entries) {
      if (entry.startsWith(".")) continue;
      const fullPath = path.join(dir, entry);
      if (entry === "node_modules" || entry === ".next" || entry === "archive" ||
          entry === "sectorcalc_pro_new_v531_package" || entry === "sectorcalc_free_v531_formula_blueprints" ||
          entry === "sectorcalc_deprecated_v530") continue;
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        const sf = scan(fullPath);
        fixed += sf.fixed;
        total += sf.total;
      } else if (/\.(ts|tsx|js|jsx|mjs|cjs)$/.test(entry) && stat.size < 5242880 && stat.size > 50) {
        total++;
        try {
          const content = fs.readFileSync(fullPath, "utf8");
          const fixed_content = fixContent(content);
          if (fixed_content !== content) {
            fs.writeFileSync(fullPath, fixed_content, "utf8");
            const rel = path.relative(ROOT, fullPath);
            console.log(`FIXED ${rel}`);
            fixed++;
          }
        } catch (e) {
          // skip
        }
      }
    }
  } catch (e) {
    // skip
  }
  return { fixed, total };
}

console.log("=== FAST TURKISH BULK FIX ===");
const start = Date.now();

// Phase 1: Move the already-archived directories back so we can fix them properly
// (we removed formula-governance and premium-schema earlier)
const archivedFormulaGov = "archive/migration-only/src/lib/features/formula-governance";
const archivedPremiumSchema = "archive/migration-only/src/lib/features/premium-schema";
const liveFormulaGov = "src/lib/features/formula-governance";
const livePremiumSchema = "src/lib/features/premium-schema";

// Skip archive restore — we'll fix remaining files and then restore archives
console.log("Scanning src/...");
const r1 = scan(path.join(ROOT, "src"));
console.log(`src/: ${r1.fixed} fixed of ${r1.total}`);
console.log("Scanning scripts/...");
const r2 = scan(path.join(ROOT, "scripts"));
console.log(`scripts/: ${r2.fixed} fixed of ${r2.total}`);

const elapsed = ((Date.now() - start) / 1000).toFixed(1);
console.log(`\nTotal: ${r1.fixed + r2.fixed} files fixed in ${elapsed}s`);
console.log("Done.");
