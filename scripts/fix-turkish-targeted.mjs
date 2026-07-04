/**
 * Fast fix Turkish tokens in specific target directories.
 * Run: node scripts/fix-turkish-targeted.mjs
 */
import fs from "fs";
import path from "path";

const ROOT = new URL("..", import.meta.url).pathname;

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
  cikti:"output", ciktisi:"output", cikis:"outlet",
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
  fire:"waste",
  kayip:"loss", kaybi:"loss",
  kalite:"quality",
  bakim:"maintenance",
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
  calisma:"operation", calisan:"running", calistir:"execute",
  durdurma:"shutdown",
  acil:"emergency",
  kriz:"crisis",
  bildirim:"notification",
  uyari:"warning",
  mudahale:"intervention",
  kurtarma:"recovery",
  periyot:"period", periyodu:"period",
  anlik:"instant",
  tepe:"peak",
  dip:"trough",
  degisim:"change", degisimi:"change", degisken:"variable",
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
  zorluk:"difficulty",
  katsayi:"coefficient",
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
  kira:"rent", kiralama:"leasing",
  faiz:"interest",
  enflasyon:"inflation",
  risk:"risk", riskli:"risky",
  trend:"trend",
  senaryo:"scenario", senaryosu:"scenario",
  referans:"reference", referansi:"reference",
  yuk:"load", yuku:"load",
  tork:"torque",
  moment:"moment",
  isil:"thermal", termal:"thermal",
  kimya:"chemical", kimyasal:"chemical",
  tur:"type", turu:"type",
  cap:"diameter", capi:"diameter",
  saat:"hour", saati:"hour",
  motor:"motor", motoru:"motor",
  para:"money",
  tip:"type", tipi:"type",
  uc:"three",
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
  belirlenemez:"undetermined", belirlenmemis:"unset",
  tanimlanmamis:"undefined",
  basinc:"pressure",
  elektrik:"electric", elektronik:"electronic",
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
  uretec:"generator",
  hedef:"target",
  strateji:"strategy",
  politika:"policy",
  kurallar:"rules",
  duzenleme:"regulation",
};

const sortedKeys = Object.keys(TR_TO_EN).sort((a, b) => b.length - a.length);

function fixOneFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, "utf8");
    const orig = content;
    
    for (const tr of sortedKeys) {
      const en = TR_TO_EN[tr];
      if (tr === en || !tr || !en) continue;
      const trUpper = tr.charAt(0).toUpperCase() + tr.slice(1);
      const enUpper = en.charAt(0).toUpperCase() + en.slice(1);
      
      // Word boundary (surrounded by non-alpha or edges)
      const re = new RegExp("(?<=^|[^a-zA-Z0-9_])" + tr + "(?=[^a-zA-Z0-9_])", "gi");
      content = content.replace(re, (match) => {
        if (match === tr) return en;
        if (match === trUpper) return enUpper;
        if (match === tr.toUpperCase()) return en.toUpperCase();
        return match[0] === match[0].toUpperCase() ? enUpper : en;
      });
      
      // CamelCase embedded: token with uppercase first letter before another uppercase
      if (tr.length >= 3) {
        const re2 = new RegExp("(?<=[a-z0-9])" + trUpper + "(?=[A-Z])", "g");
        content = content.replace(re2, enUpper);
        // Start-of-identifier camelCase
        const re3 = new RegExp("(?<=^|[^a-zA-Z0-9])" + trUpper + "(?=[A-Z])", "g");
        content = content.replace(re3, enUpper);
        // All-lowercase camelCase inside: e.g. "Uretim" → "production" when preceded by alpha
        const re4 = new RegExp("(?<=[a-z0-9])" + tr.charAt(0).toUpperCase() + tr.slice(1) + "(?=[a-z])", "g");
        content = content.replace(re4, enUpper + en.slice(1));
        // hmm this is getting too complicated, just use the basic approach
      }
    }
    
    if (content !== orig) {
      fs.writeFileSync(filePath, content, "utf8");
      return true;
    }
    return false;
  } catch (e) {
    return false;
  }
}

function scanDir(dir) {
  let fixed = 0;
  try {
    const entries = fs.readdirSync(dir);
    for (const entry of entries) {
      if (entry.startsWith(".") || entry === "node_modules") continue;
      const fp = path.join(dir, entry);
      const stat = fs.statSync(fp);
      if (stat.isDirectory()) {
        fixed += scanDir(fp);
      } else if (/\.(ts|tsx|js|jsx|mjs|cjs)$/.test(entry) && stat.size < 5242880 && stat.size > 100) {
        if (fixOneFile(fp)) {
          console.log(`  FIXED ${path.relative(ROOT, fp)}`);
          fixed++;
        }
      }
    }
  } catch (e) { /* skip */ }
  return fixed;
}

// Target just the worst directories
const targets = [
  "src/lib/features/formula-governance",
  "src/lib/features/premium-schema",
  "src/lib/features/tools",
  "src/lib/features/engines",
  "src/lib/features/calculators",
  "src/lib/features/tool-guides",
  "src/lib/features/reports",
  "src/lib/features/smart-form",
  "src/lib/features/ai",
  "src/lib/infrastructure",
  "src/components",
];

console.log("Targeted Turkish fixer — processing worst directories only...\n");
let totalFixed = 0;
for (const target of targets) {
  const fullPath = path.join(ROOT, target);
  if (fs.existsSync(fullPath)) {
    console.log(`Scanning ${target}...`);
    const f = scanDir(fullPath);
    if (f > 0) console.log(`  → ${f} files fixed`);
    totalFixed += f;
  }
}
console.log(`\nTotal files fixed: ${totalFixed}`);
console.log("Done.");
