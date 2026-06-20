import fs from "fs";
import path from "path";

const SCHEMAS_DIR = path.join(process.cwd(), "generated", "schemas");
const NAMES_PATH = path.join(process.cwd(), "data", "free-tools-names.json");

function slugFromTr(name: string): string {
  const trMap: Record<string, string> = { "ü": "u", "ğ": "g", "ş": "s", "ı": "i", "ç": "c", "ö": "o", "â": "a", "î": "i", "û": "u", "é": "e", "è": "e", "İ": "i" };
  let s = name.toLowerCase();
  for (const [k, v] of Object.entries(trMap)) s = s.replace(new RegExp(k, "g"), v);
  return s.replace(/[''`]/g, "").replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
}

function inferSector(name: string): { sector: string; category: string } {
  const lc = name.toLowerCase();
  if (lc.includes("vergi") || lc.includes("tax")) return { sector: "Vergi", category: "tax" };
  if (lc.includes("karbon") || lc.includes("co2") || lc.includes("carbon") || lc.includes("emission") || lc.includes("emisyon") || lc.includes("ghg") || lc.includes("carbon footprint") || lc.includes("sustainability") || lc.includes("breeam") || lc.includes("leed") || lc.includes("ecological") || lc.includes("energy")) return { sector: "Enerji & Sürdürülebilirlik", category: "energy" };
  if (lc.includes("kredi") || lc.includes("loan") || lc.includes("mortgage") || lc.includes("borç") || lc.includes("debt")) return { sector: "Finans & Muhasebe", category: "loan" };
  if (lc.includes("faiz") || lc.includes("interest") || lc.includes("compound") || lc.includes("roi") || lc.includes("cagr") || lc.includes("annuity")) return { sector: "Finans & Muhasebe", category: "interest" };
  if (lc.includes("bütçe") || lc.includes("budget") || lc.includes("savings") || lc.includes("birikim")) return { sector: "Kişisel Finans", category: "budget" };
  if (lc.includes("yatırım") || lc.includes("investment") || lc.includes("stock") || lc.includes("bond") || lc.includes("crypto") || lc.includes("fund") || lc.includes("portfolio") || lc.includes("roth") || lc.includes("ira") || lc.includes("401k") || lc.includes("529")) return { sector: "Yatırım", category: "investment" };
  if (lc.includes("emeklilik") || lc.includes("retirement") || lc.includes("pension")) return { sector: "Emeklilik", category: "retirement" };
  if (lc.includes("sigorta") || lc.includes("insurance")) return { sector: "Sigorta", category: "insurance" };
  if (lc.includes("pazarlama") || lc.includes("marketing") || lc.includes("cac") || lc.includes("cpc") || lc.includes("clv")) return { sector: "Pazarlama", category: "marketing" };
  if (lc.includes("gayrimenkul") || lc.includes("rental") || lc.includes("property") || lc.includes("emlak") || lc.includes("ev") && (lc.includes("kredi") || lc.includes("fiyat") || lc.includes("maliyet"))) return { sector: "Gayrimenkul", category: "real-estate" };
  if (lc.includes("yemek") || lc.includes("food") || lc.includes("catering") || lc.includes("restaurant") || lc.includes("pizza") || lc.includes("gıda") || lc.includes("coffee") || lc.includes("tea") || lc.includes("beer") || lc.includes("cheese") || lc.includes("butter") || lc.includes("bread") || lc.includes("pasta") || lc.includes("juice") || lc.includes("kombucha") || lc.includes("jambon") || lc.includes("soap") || lc.includes("chocolate") || lc.includes("sourdough") || lc.includes("sugar")) return { sector: "Yemek & İçecek", category: "food" };
  if (lc.includes("matematik") || lc.includes("math") || lc.includes("algebra") || lc.includes("calculus") || lc.includes("theorem") || lc.includes("equation") || lc.includes("derivative") || lc.includes("integral") || lc.includes("vector") || lc.includes("matrix") || lc.includes("eigen") || lc.includes("limit") || lc.includes("function") || lc.includes("fonksiyon") || lc.includes("logarithm") || lc.includes("logaritma") || lc.includes("polynomial") || lc.includes("fraction") || lc.includes("decimal") || lc.includes("binary") || lc.includes("hex") || lc.includes("octal") || lc.includes("trig") || lc.includes("sine") || lc.includes("cosine") || lc.includes("tangent") || lc.includes("arc") || lc.includes("fourier") || lc.includes("laplace") || lc.includes("taylor") || lc.includes("maclaurin") || lc.includes("prime") || lc.includes("fibonacci") || lc.includes("factorial") || lc.includes("pythagorean")) return { sector: "Matematik", category: "math" };
  if (lc.includes("fizik") || lc.includes("physics") || lc.includes("pendulum") || lc.includes("mirror") || lc.includes("projectile") || lc.includes("motion") || lc.includes("lorentz") || lc.includes("gravity") || lc.includes("velocity") || lc.includes("acceleration") || lc.includes("force") || lc.includes("energy") || lc.includes("work") || lc.includes("power") || lc.includes("momentum") || lc.includes("collision") || lc.includes("wave") || lc.includes("frequency") || lc.includes("wavelength") || lc.includes("optics") || lc.includes("lens") || lc.includes("diffraction") || lc.includes("quantum") || lc.includes("schrodinger") || lc.includes("blackbody") || lc.includes("thermodynamic") || lc.includes("carnot") || lc.includes("boyle") || lc.includes("charles") || lc.includes("gay lussac") || lc.includes("ideal gas") || lc.includes("doppler") || lc.includes("escape") || lc.includes("relativistic") || lc.includes("de broglie") || lc.includes("compton") || lc.includes("photon")) return { sector: "Fizik", category: "physics" };
  if (lc.includes("kimya") || lc.includes("chemistry") || lc.includes("mole") || lc.includes("molar") || lc.includes("titration") || lc.includes("acid") || lc.includes("base") || lc.includes("ph") || lc.includes("poh") || lc.includes("pka") || lc.includes("pkb") || lc.includes("buffer") || lc.includes("hen") || lc.includes("equilibrium") || lc.includes("reaction") || lc.includes("stoichiometry") || lc.includes("atomic") || lc.includes("electron") || lc.includes("ion") || lc.includes("electro") || lc.includes("fareday") || lc.includes("gibbs") || lc.includes("enthalpy") || lc.includes("activation") || lc.includes("arrhenius") || lc.includes("redox") || lc.includes("oxidation") || lc.includes("empirical")) return { sector: "Kimya", category: "chemistry" };
  if (lc.includes("dönüştürücü") || lc.includes("converter") || lc.includes("cevirme") || lc.includes("to ") || lc.includes("to_") || lc.includes("donusturucu")) return { sector: "Dönüştürücü", category: "converter" };
  if (lc.includes("sağlık") || lc.includes("health") || lc.includes("diet") || lc.includes("fitness") || lc.includes("calorie") || lc.includes("weight") || lc.includes("kilo") || lc.includes("creatine") || lc.includes("insulin") || lc.includes("diabetes") || lc.includes("glucose") || lc.includes("blood") || lc.includes("cholesterol") || lc.includes("vitamin") || lc.includes("body fat") || lc.includes("bmi") || lc.includes("vucut") || lc.includes("sleep") || lc.includes("uyku") || lc.includes("fasting") || lc.includes("keto") || lc.includes("macro") || lc.includes("protein") || lc.includes("heart") || lc.includes("ağırlık") || lc.includes("bac") || lc.includes("caffeine") || lc.includes("nicotine") || lc.includes("pregnancy") || lc.includes("hamilelik") || lc.includes("baby") || lc.includes("fetal") || lc.includes("doğum") || lc.includes("growth") || lc.includes("percentile") || lc.includes("frailty") || lc.includes("sofa") || lc.includes("glasgow") || lc.includes("apgar") || lc.includes("curb") || lc.includes("falls") || lc.includes("hearing") || lc.includes("vision") || lc.includes("snellen") || lc.includes("pace") || lc.includes("walking") || lc.includes("running") || lc.includes("swimming") || lc.includes("cycling") || lc.includes("rowing") || lc.includes("treadmill") || lc.includes("yoga") || lc.includes("pilates") || lc.includes("hiit") || lc.includes("jump rope") || lc.includes("push") || lc.includes("bench") || lc.includes("deadlift") || lc.includes("squat") || lc.includes("stronglifts") || lc.includes("wendler") || lc.includes("starting strength") || lc.includes("candito") || lc.includes("texas method") || lc.includes("powerlifting") || lc.includes("wrestling") || lc.includes("boxing") || lc.includes("martial")) return { sector: "Sağlık & Fitness", category: "health" };
  if (lc.includes("eğitim") || lc.includes("education") || lc.includes("college") || lc.includes("tuition") || lc.includes("student") || lc.includes("grade") || lc.includes("gpa") || lc.includes("sat") || lc.includes("act") || lc.includes("gre") || lc.includes("gmat") || lc.includes("toefl") || lc.includes("ielts") || lc.includes("duolingo") || lc.includes("scholarship") || lc.includes("finansal aid") || lc.includes("transcript") || lc.includes("honor") || lc.includes("deans") || lc.includes("valedictorian") || lc.includes("class rank")) return { sector: "Eğitim", category: "education" };
  if (lc.includes("teknoloji") || lc.includes("tech") || lc.includes("data") || lc.includes("download") || lc.includes("upload") || lc.includes("file") || lc.includes("email") || lc.includes("internet") || lc.includes("byte") || lc.includes("bit") || lc.includes("pixel") || lc.includes("resolution") || lc.includes("bandwidth") || lc.includes("ascii") || lc.includes("utf") || lc.includes("unicode") || lc.includes("barcode") || lc.includes("uuid") || lc.includes("font") || lc.includes("typography")) return { sector: "Teknoloji", category: "technology" };
  if (lc.includes("elektrik") || lc.includes("electrical") || lc.includes("voltage") || lc.includes("current") || lc.includes("resistor") || lc.includes("capacitor") || lc.includes("inductor") || lc.includes("impedance") || lc.includes("transformer") || lc.includes("amplifier") || lc.includes("motor") || lc.includes("generator") || lc.includes("circuit") || lc.includes("ohm") || lc.includes("power factor") || lc.includes("güç") || lc.includes("faz") || lc.includes("phase") || lc.includes("short circuit") || lc.includes("fault") || lc.includes("relay") || lc.includes("inverter") || lc.includes("ups") || lc.includes("battery") || lc.includes("cable") || lc.includes("wire") || lc.includes("conduit") || lc.includes("pano") || lc.includes("panel")) return { sector: "Elektrik", category: "electrical" };
  if (lc.includes("ev") || lc.includes("home") || lc.includes("decor") || lc.includes("renovation") || lc.includes("flooring") || lc.includes("paint") || lc.includes("boya") || lc.includes("wallpaper") || lc.includes("duvar") || lc.includes("tile") || lc.includes("fayans") || lc.includes("stairs") || lc.includes("deck") || lc.includes("fence") || lc.includes("siding") || lc.includes("roof") || lc.includes("drywall") || lc.includes("insulation") || lc.includes("caulk") || lc.includes("grout") || lc.includes("thinset") || lc.includes("underlayment") || lc.includes("backsp") || lc.includes("baseboard") || lc.includes("crown") || lc.includes("chair rail") || lc.includes("stain") || lc.includes("epoxy") || lc.includes("mastic") || lc.includes("sheetrock") || lc.includes("stucco") || lc.includes("soffit") || lc.includes("ridge") || lc.includes("paver") || lc.includes("sod") || lc.includes("mulch") || lc.includes("compost") || lc.includes("grass") || lc.includes("plant") || lc.includes("tree") || lc.includes("garden") || lc.includes("greenhouse") || lc.includes("pond") || lc.includes("pool") || lc.includes("aquarium") || lc.includes("rainwater") || lc.includes("greywater")) return { sector: "Ev & Bahçe", category: "home" };
  if (lc.includes("inşaat") || lc.includes("construction") || lc.includes("building") || lc.includes("excavation") || lc.includes("fill") || lc.includes("sand") || lc.includes("gravel") || lc.includes("concrete") || lc.includes("trench") || lc.includes("culvert") || lc.includes("highway") || lc.includes("retaining") || lc.includes("slope") || lc.includes("earth")) return { sector: "İnşaat", category: "construction" };
  if (lc.includes("lojistik") || lc.includes("logistics") || lc.includes("shipping") || lc.includes("freight") || lc.includes("delivery") || lc.includes("navlun") || lc.includes("transport")) return { sector: "Lojistik", category: "logistics" };
  if (lc.includes("bahis") || lc.includes("betting") || lc.includes("odds") || lc.includes("lottery") || lc.includes("poker") || lc.includes("blackjack") || lc.includes("baccarat") || lc.includes("roulette") || lc.includes("craps") || lc.includes("probability") || lc.includes("pot odds") || lc.includes("parlay") || lc.includes("dutching") || lc.includes("yahtzee") || lc.includes("catan") || lc.includes("monopoly") || lc.includes("gacha") || lc.includes("dice") || lc.includes("coin flip") || lc.includes("dnd") || lc.includes("pokemon") || lc.includes("powerball") || lc.includes("megamil") || lc.includes("euromillion")) return { sector: "Oyun & Bahis", category: "gaming" };
  if (lc.includes("seyehat") || lc.includes("travel") || lc.includes("flight") || lc.includes("hotel") || lc.includes("taxi") || lc.includes("uber") || lc.includes("bus") || lc.includes("train") || lc.includes("jet lag") || lc.includes("time zone") || lc.includes("world clock") || lc.includes("passport") || lc.includes("visa") || lc.includes("camping") || lc.includes("backpacking") || lc.includes("hiking") || lc.includes("van life")) return { sector: "Seyahat", category: "travel" };
  if (lc.includes("gök") || lc.includes("astronomy") || lc.includes("astro") || lc.includes("space") || lc.includes("orbit") || lc.includes("rocket") || lc.includes("planet") || lc.includes("star") || lc.includes("galaxy") || lc.includes("telescope") || lc.includes("magnitude") || lc.includes("parsec") || lc.includes("light year") || lc.includes("au ") || lc.includes("astronomical")) return { sector: "Astronomi", category: "astronomy" };
  if (lc.includes("düğün") || lc.includes("wedding") || lc.includes("party") || lc.includes("event") || lc.includes("etkinlik") || lc.includes("catering") || lc.includes("valentine") || lc.includes("christmas") || lc.includes("thanksgiving") || lc.includes("easter") || lc.includes("ramadan") || lc.includes("cadı") || lc.includes("halloween") || lc.includes("birthday") || lc.includes("doğum günü") || lc.includes("anniversary")) return { sector: "Kişisel", category: "events" };
  if (lc.includes("spor") || lc.includes("sport") || lc.includes("soccer") || lc.includes("football") || lc.includes("basketball") || lc.includes("baseball") || lc.includes("tennis") || lc.includes("golf") || lc.includes("hockey") || lc.includes("cricket")) return { sector: "Spor", category: "sports" };
  if (lc.includes("müzik") || lc.includes("music") || lc.includes("guitar") || lc.includes("piano") || lc.includes("fret") || lc.includes("note") || lc.includes("reverb") || lc.includes("bpm") || lc.includes("tempo")) return { sector: "Müzik", category: "music" };
  if (lc.includes("fotoğraf") || lc.includes("photography") || lc.includes("camera") || lc.includes("lens") || lc.includes("aperture") || lc.includes("shutter") || lc.includes("iso") || lc.includes("flash") || lc.includes("exposure") || lc.includes("sunny") || lc.includes("golden hour") || lc.includes("blue hour") || lc.includes("nd filter") || lc.includes("hyperfocal")) return { sector: "Fotoğrafçılık", category: "photography" };
  if (lc.includes("çevre") || lc.includes("environment") || lc.includes("recycle") || lc.includes("waste") || lc.includes("landfill") || lc.includes("water") || lc.includes("su ") || lc.includes("sulama") || lc.includes("irrigation") || lc.includes("biodiversity") || lc.includes("watershed") || lc.includes("ecological") || lc.includes("plastic")) return { sector: "Çevre", category: "environment" };
  if (lc.includes("hedge") || lc.includes("black scholes") || lc.includes("option") || lc.includes("future") || lc.includes("swap") || lc.includes("derivative") || lc.includes("futures")) return { sector: "Finans & Muhasebe", category: "derivatives" };
  return { sector: "Genel", category: "general" };
}

function generateSchema(name: string): Record<string, unknown> {
  const s = slugFromTr(name);
  const { sector, category } = inferSector(name);
  const lc = name.toLowerCase();
  const inputs: Record<string, unknown>[] = [];

  if (lc.includes("vergi") || lc.includes("tax")) {
    inputs.push({ id:"income", label:"Gelir / Income", type:"number", unit:"USD", default:80000, min:0, businessContext:"Annual income.", label_i18n:{en:"Annual Income",tr:"Yıllık Gelir"}, businessContext_i18n:{en:"Annual income.",tr:"Yıllık gelir."} },
      { id:"rate", label:"Oran / Rate", type:"number", unit:"%", default:25, min:0, max:100, businessContext:"Rate.", label_i18n:{en:"Rate",tr:"Oran"}, businessContext_i18n:{en:"Rate.",tr:"Oran."} });
  } else if (lc.includes("karbon") || lc.includes("co2") || lc.includes("carbon") || lc.includes("emisyon") || lc.includes("emission") || lc.includes("ayak izi") || lc.includes("footprint") || lc.includes("energy") || lc.includes("enerji") || lc.includes("kwh") || lc.includes("kettle") || lc.includes("güç") || lc.includes("power") || lc.includes("watt") || lc.includes("hp ") || lc.includes("horsepower") || lc.includes("solar") || lc.includes("güneş") || lc.includes("wind turbine") || lc.includes("turbine") || lc.includes("battery") || lc.includes("inverter") || lc.includes("transformer") || lc.includes("circuit") || lc.includes("led ") || lc.includes("appliance") || lc.includes("hvac") || lc.includes("refrigerator") || lc.includes("standby") || lc.includes("phantom")) {
    inputs.push({ id:"usage", label:"Kullanım / Usage", type:"number", unit:"kWh", default:100, min:0, businessContext:"Energy usage.", label_i18n:{en:"Energy Usage",tr:"Enerji Kullanımı"}, businessContext_i18n:{en:"Energy usage.",tr:"Enerji kullanımı."} },
      { id:"rate", label:"Birim Fiyat / Unit Rate", type:"number", unit:"USD/kWh", default:0.12, min:0, businessContext:"Cost per unit.", label_i18n:{en:"Rate",tr:"Birim Fiyat"}, businessContext_i18n:{en:"Cost per unit.",tr:"Birim fiyat."} });
  } else if (lc.includes("yatırım") || lc.includes("investment") || lc.includes("stock") || lc.includes("roi") || lc.includes("return") || lc.includes("getiri") || lc.includes("portfolio") || lc.includes("roth") || lc.includes("ira") || lc.includes("401k") || lc.includes("529") || lc.includes("emeklilik") || lc.includes("retirement") || lc.includes("pension") || lc.includes("annuity") || lc.includes("dividend") || lc.includes("equity")) {
    inputs.push({ id:"investment", label:"Yatırım / Investment", type:"number", unit:"USD", default:10000, min:0, businessContext:"Investment amount.", label_i18n:{en:"Investment Amount",tr:"Yatırım Tutarı"}, businessContext_i18n:{en:"Investment amount.",tr:"Yatırım tutarı."} },
      { id:"returnRate", label:"Getiri / Return", type:"number", unit:"%", default:8, min:-100, max:10000, businessContext:"Rate of return.", label_i18n:{en:"Rate of Return",tr:"Getiri Oranı"}, businessContext_i18n:{en:"Rate of return.",tr:"Getiri oranı."} });
  } else if (lc.includes("ağırlık") || lc.includes("kilo") || lc.includes("weight") || lc.includes("body") || lc.includes("vücut") || lc.includes("vucut") || lc.includes("bmi") || lc.includes("diet") || lc.includes("diyet") || lc.includes("kalori") || lc.includes("calorie") || lc.includes("fitness") || lc.includes("exercise") || lc.includes("egzersiz") || lc.includes("spor") || lc.includes("workout") || lc.includes("bench") || lc.includes("press") || lc.includes("squat") || lc.includes("deadlift") || lc.includes("strong") || lc.includes("protein") || lc.includes("fat") || lc.includes("karbonhidrat") || lc.includes("macro")) {
    inputs.push({ id:"weight", label:"Ağırlık / Weight", type:"number", unit:"kg", default:70, min:0, businessContext:"Body weight.", label_i18n:{en:"Weight",tr:"Ağırlık"}, businessContext_i18n:{en:"Body weight.",tr:"Vücut ağırlığı."} },
      { id:"height", label:"Boy / Height", type:"number", unit:"cm", default:170, min:0, businessContext:"Height.", label_i18n:{en:"Height",tr:"Boy"}, businessContext_i18n:{en:"Height.",tr:"Boy."} });
  } else if (lc.includes("ev ") || lc.includes("home ") || lc.includes("boya") || lc.includes("paint") || lc.includes("flooring") || lc.includes("tile") || lc.includes("fayans") || lc.includes("dekor") || lc.includes("rooms") || lc.includes("oda") || lc.includes("floor") || lc.includes("kat")) {
    inputs.push({ id:"area", label:"Alan / Area", type:"number", unit:"m²", default:100, min:0, businessContext:"Area to cover.", label_i18n:{en:"Area",tr:"Alan"}, businessContext_i18n:{en:"Area.",tr:"Alan."} },
      { id:"unitCost", label:"Birim Maliyet / Unit Cost", type:"number", unit:"USD", default:10, min:0, businessContext:"Cost per unit area.", label_i18n:{en:"Unit Cost",tr:"Birim Maliyet"}, businessContext_i18n:{en:"Cost per unit area.",tr:"Birim alan maliyeti."} });
  } else if (lc.includes("kredi") || lc.includes("loan")) {
    inputs.push({ id:"loanAmount", label:"Kredi / Loan", type:"number", unit:"USD", default:200000, min:0, businessContext:"Loan amount.", label_i18n:{en:"Loan Amount",tr:"Kredi Tutarı"}, businessContext_i18n:{en:"Loan amount.",tr:"Kredi tutarı."} },
      { id:"interestRate", label:"Faiz / Interest", type:"number", unit:"%", default:6, min:0, max:100, businessContext:"Annual rate.", label_i18n:{en:"Interest Rate",tr:"Faiz Oranı"}, businessContext_i18n:{en:"Annual rate.",tr:"Yıllık faiz."} });
  } else if (lc.includes("ölçüm") || lc.includes("measure") || lc.includes("dönüş") || lc.includes("convert") || lc.includes("to ") || lc.includes("donustur")) {
    inputs.push({ id:"value", label:"Değer / Value", type:"number", unit:"", default:100, min:0, businessContext:"Input value.", label_i18n:{en:"Value",tr:"Değer"}, businessContext_i18n:{en:"Input value.",tr:"Giriş değeri."} });
  } else if (lc.includes("hesap") || lc.includes("calculator") || lc.includes("test") || lc.includes("skor") || lc.includes("score") || lc.includes("puan") || lc.includes("index")) {
    inputs.push({ id:"score", label:"Puan / Score", type:"number", unit:"", default:50, min:0, businessContext:"Score value.", label_i18n:{en:"Score",tr:"Puan"}, businessContext_i18n:{en:"Score.",tr:"Puan."} });
  } else if (lc.includes("süre") || lc.includes("time") || lc.includes("zaman") || lc.includes("yaş") || lc.includes("age") || lc.includes("tarih") || lc.includes("date") || lc.includes("gün") || lc.includes("day") || lc.includes("hafta") || lc.includes("ay") || lc.includes("yıl") || lc.includes("year")) {
    inputs.push({ id:"startDate", label:"Başlangıç / Start", type:"number", unit:"gün", default:0, min:0, businessContext:"Start value.", label_i18n:{en:"Start",tr:"Başlangıç"}, businessContext_i18n:{en:"Start value.",tr:"Başlangıç değeri."} },
      { id:"endDate", label:"Bitiş / End", type:"number", unit:"gün", default:365, min:0, businessContext:"End value.", label_i18n:{en:"End",tr:"Bitiş"}, businessContext_i18n:{en:"End value.",tr:"Bitiş değeri."} });
  } else if (lc.includes("iş") || lc.includes("work") || lc.includes("business") || lc.includes("şirket") || lc.includes("company") || lc.includes("startup") || lc.includes("firma") || lc.includes("maaliyet") || lc.includes("cost") || lc.includes("gelir") || lc.includes("revenue") || lc.includes("satış") || lc.includes("sales") || lc.includes("kar ") || lc.includes("kâr") || lc.includes("profit") || lc.includes("margin") || lc.includes("marj")) {
    inputs.push({ id:"revenue", label:"Gelir / Revenue", type:"number", unit:"USD", default:100000, min:0, businessContext:"Revenue.", label_i18n:{en:"Revenue",tr:"Gelir"}, businessContext_i18n:{en:"Revenue.",tr:"Gelir."} },
      { id:"expenses", label:"Gider / Expenses", type:"number", unit:"USD", default:70000, min:0, businessContext:"Expenses.", label_i18n:{en:"Expenses",tr:"Giderler"}, businessContext_i18n:{en:"Expenses.",tr:"Giderler."} });
  } else {
    inputs.push({ id:"value1", label:"Değer 1 / Value 1", type:"number", unit:"", default:100, min:0, businessContext:"First input.", label_i18n:{en:"Value 1",tr:"Değer 1"}, businessContext_i18n:{en:"First value.",tr:"Birinci değer."} },
      { id:"value2", label:"Değer 2 / Value 2", type:"number", unit:"", default:50, min:0, businessContext:"Second input.", label_i18n:{en:"Value 2",tr:"Değer 2"}, businessContext_i18n:{en:"Second value.",tr:"İkinci değer."} });
  }

  const ids = inputs.map((i: any) => i.id);

  let main = "";
  if (ids.includes("income") && ids.includes("rate")) main = `${ids[0]} * (${ids[1]}/100)`;
  else if (ids.includes("usage") && ids.includes("rate")) main = `${ids[0]} * ${ids[1]}`;
  else if (ids.includes("investment") && ids.includes("returnRate")) main = `${ids[0]} * (1 + ${ids[1]}/100)`;
  else if (ids.includes("weight") && ids.includes("height")) main = `${ids[0]} / Math.pow(${ids[1]}/100, 2)`;
  else if (ids.includes("area") && ids.includes("unitCost")) main = `${ids[0]} * ${ids[1]}`;
  else if (ids.includes("loanAmount")) main = `${ids[0]} * (${ids[1]}/100/12 * Math.pow(1+${ids[1]}/100/12, 360)) / (Math.pow(1+${ids[1]}/100/12, 360)-1)`;
  else if (ids.includes("revenue") && ids.includes("expenses")) main = `${ids[0]} - ${ids[1]}`;
  else if (ids.includes("startDate") && ids.includes("endDate")) main = `${ids[1]} - ${ids[0]}`;
  else if (ids.length >= 2) main = `${ids[0]} * ${ids[1]}`;
  else main = `${ids[0]}`;

  const breakdown: Record<string, string> = { result: main };

  return {
    slug: s, name, premiumRequired: false, premiumFeatures: ["PDF export", "CSV export"],
    inputs, validation: { rules: ["Positive numbers required."], thresholds: {} },
    formulas: { main, breakdown },
    outputs: {
      primary: "result", unit: (inputs[0] as any)?.unit ?? "", breakdown,
      breakdown_i18n: { result: { en: "Result", tr: "Sonuç" } },
      hiddenLossDrivers: [], suggestedActions: ["Review assumptions."],
      dataConfidenceAdjusted: "Free-tier estimate.",
    },
    premiumFeatures: ["PDF report", "Scenario comparison"],
    about: { description: { short: `Quick ${name.toLowerCase()}.`, long: `Free ${name.toLowerCase()} tool.` } },
    sector, toolName: s, sectorId: "genel", profession: "Professional", categoryId: category,
  };
}

function main() {
  if (!fs.existsSync(SCHEMAS_DIR)) { console.error("Schemas dir not found"); process.exit(1); }
  const names: string[] = JSON.parse(fs.readFileSync(NAMES_PATH, "utf-8"));
  let created = 0, skipped = 0;
  for (const name of names) {
    const s = slugFromTr(name);
    const fp = path.join(SCHEMAS_DIR, `${s}-schema.json`);
    if (fs.existsSync(fp)) { skipped++; continue; }
    fs.writeFileSync(fp, JSON.stringify(generateSchema(name), null, 2) + "\n", "utf-8");
    created++;
  }
  console.log(`Total: ${names.length}, Created: ${created}, Skipped: ${skipped}, Errors: 0`);
}
main();
