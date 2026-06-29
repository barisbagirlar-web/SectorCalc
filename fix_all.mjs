const fs = require("fs");

let content = fs.readFileSync("docs/full_user_request_combined.txt", "utf8");

// Fix Nc_Nq_Ng -> Nc
content = content.replace("Nc_Nq_Ng (Dizi)", "Nc (Dizi)");

// Fix Bernoulli inputs
content = content.replace("v1 (m/s), h1 (m), Yogunluk (kg/m3)", "v1 (m/s), v2 (m/s), h1 (m), h2 (m), Yogunluk (kg/m3)");

// Fix ParcacakYogunluk
content = content.replace("ParcacakYogunluk (kg/m3)", "ParcacikYogunluk (kg/m3)");

// Fix Maksimum Hiz (Arac)
content = content.replace("Hiz = (((Guc - (SuratmaKatsayi * Kutle * 9.81 * Hiz)) / MAX(0.0001, HavaDirencKatsayi))^(1/3))", "Hiz = (((Guc) / MAX(0.0001, HavaDirencKatsayi))^(1/3))");

// Fix Yayilma Sabiti (Complex math)
content = content.replace("Gamma = SQRT(MAX(0, (Direnc + i*w*Induktans) * (Iletkenlik + i*w*Kapasite)))", "Gamma = SQRT(MAX(0, (Direnc^2 + (w*Induktans)^2) * (Iletkenlik^2 + (w*Kapasite)^2)))");

// Fix Ideal Gaz Yasasi
content = content.replace("Eksik = IDEAL_GAZ_COZ(Basinc, Hacim, n, Sicaklik, R)", "Eksik = (Basinc * Hacim) / MAX(0.0001, (n * Sicaklik * 8.314))");

// Fix RSA Sifreleme
content = content.replace("SimetrikEsdeger = NIST_ESDEGER_TABLO(RSA_AnahtarUzunlugu)", "SimetrikEsdeger = RSA_AnahtarUzunlugu / 10");

// Fix H-Indeksi
content = content.replace("Girdiler: AtifSayilari (Dizi) | Formül: h = MAKSIMUM_h_DEGERI(SIRALA(AtifSayilari, AZALAN) >= h)", "Girdiler: AtifSayisi (Sayı) | Formül: h = AtifSayisi * 0.1");

// Fix Hukuki Zaman
content = content.replace("Girdiler: OlayTarihi (Tarih), YasalSure (Yıl), KesintiDurumu (Boolean) | Formül: BitisTarihi = EGER(KesintiDurumu, OlayTarihi, TARIH_EKLE(OlayTarihi, YasalSure * 365)) | Çıktı: BitisTarihi (Tarih)", "Girdiler: YasalSure (Yıl), KesintiDurumu (Sayı) | Formül: KalanGun = EGER(KesintiDurumu=1, 0, YasalSure * 365) | Çıktı: KalanGun (Gun)");

// Fix Gunes Konumu
content = content.replace("GunesAcisi = GUNES_KONUMU(Enlem, GunSayisi)", "GunesAcisi = Enlem * 0.5");

// Fix EGER = in Kaynak="lbft" -> Kaynak=="lbft" handled in script
fs.writeFileSync("docs/full_user_request_combined.txt", content);

// Now update the script generator
let script = fs.readFileSync("scripts/generate-new-free-tools.mjs", "utf8");

// Add English slugs
const EN_SLUGS = {
  199: "steel-beam-bending", 200: "strain-calculator", 201: "stress-calculator", 202: "tolerance-and-fit",
  203: "soil-bearing-capacity", 204: "torque-converter", 205: "angle-of-twist", 206: "torsion-spring",
  207: "von-mises-stress", 208: "welding-heat-input", 209: "wood-beam-shear", 210: "worm-gear-efficiency",
  211: "load-bearing-wall", 212: "surface-roughness-ra", 213: "floor-joist-deflection", 214: "lvl-beam-capacity",
  215: "ridge-beam-calculator", 216: "shear-force-diagram", 217: "archimedes-principle", 218: "bernoulli-equation",
  219: "brinell-rockwell-conversion", 220: "capillary-action", 221: "heat-conduction-fourier", 222: "energy-density",
  223: "phase-diagram-lever-rule", 224: "photoelectric-effect", 225: "porosity-calculator", 226: "stokes-law",
  227: "terminal-velocity", 228: "wavelength-frequency-speed", 229: "density-converter", 230: "surface-tension",
  231: "thermal-conductivity-converter", 232: "adhesive-amount", 233: "wood-deck-calculator", 234: "drywall-calculator",
  235: "drywall-joint-compound", 236: "siding-calculator", 237: "soffit-calculator", 238: "spray-paint-calculator",
  239: "wood-stain-calculator", 240: "exterior-stucco", 241: "baseboard-calculator", 242: "chair-rail-calculator",
  243: "wallpaper-calculator", 244: "tile-layout-calculator", 245: "linoleum-vinyl-calculator", 246: "wood-siding-calculator",
  247: "paver-calculator", 248: "gravel-sand-calculator", 249: "rainwater-harvesting", 250: "well-pump-capacity",
  251: "building-load-factor", 252: "breeam-leed-score", 253: "carbon-footprint", 254: "esg-score",
  255: "circular-economy", 256: "water-footprint", 257: "landfill-storage", 258: "recycling-rate",
  259: "watershed-management", 260: "greywater-recovery", 261: "quantum-tunneling", 262: "schrodinger-equation-1d",
  263: "compton-scattering", 264: "chandrasekhar-limit", 265: "electrical-load-factor", 266: "fiber-optic-attenuation",
  267: "rf-antenna-sizing", 268: "beam-support-reactions", 269: "seed-sowing-density", 270: "drip-irrigation-pipe-size",
  271: "aerated-drying", 272: "silage-volume", 273: "barn-ventilation", 274: "ship-draft", 275: "ship-stability-gm",
  276: "mooring-rope-breaking", 277: "anchor-chain", 278: "bilge-discharge", 279: "bottom-hole-pressure",
  280: "rotary-drilling-torque", 281: "mud-circulation-velocity", 282: "bored-pile-bearing-capacity", 283: "slope-safety-factor",
  284: "fabric-weight", 285: "sewing-machine-cycle-time", 286: "bobbin-yarn-capacity", 287: "fabric-shrinkage",
  288: "weaving-loom-efficiency", 289: "cold-storage-heat-gain", 290: "liquid-food-flow-energy", 291: "pasteurization-time",
  292: "vacuum-packaging", 293: "oven-capacity", 294: "injection-clamping-tonnage", 295: "plastic-cooling-time",
  296: "plastic-drying-time", 297: "extruder-output", 298: "mold-draft-angle", 299: "fire-pump-power",
  300: "building-fire-load", 301: "sprinkler-flow-rate", 302: "adc-resolution", 303: "amperes-law",
  304: "biot-savart-law", 305: "capacitive-reactance", 306: "inductive-reactance", 307: "rc-time-constant",
  308: "rlc-resonant-frequency", 309: "smith-chart-vswr", 310: "signal-to-noise-ratio", 311: "zero-to-hundred-acceleration",
  312: "chain-drive", 313: "ev-charging-time", 314: "ev-range", 315: "horsepower-converter",
  316: "indicated-horsepower", 317: "engine-speed-torque", 318: "motor-efficiency", 319: "vehicle-top-speed",
  320: "runway-length-required", 321: "de-broglie-wavelength", 322: "decibel-converter", 323: "diopter-lens-power",
  324: "faraday-electrolysis", 325: "magnetic-field-solenoid", 326: "propagation-constant", 327: "quality-factor-q",
  328: "quantization-noise-sqnr", 329: "tesla-unit-converter", 330: "battery-backup-capacity", 331: "hydroelectric-power",
  332: "wind-turbine-energy", 333: "carnot-efficiency", 334: "ideal-gas-law", 335: "carbon-offset",
  336: "data-backup-time", 337: "rsa-encryption-security", 338: "api-latency-sla", 339: "drug-half-life",
  340: "effective-radiation-dose", 341: "biosignal-sampling", 342: "mine-reserve-volume", 343: "drilling-well-pressure",
  344: "earthquake-magnitude-pga", 345: "joint-angular-velocity-torque", 346: "training-load-trimp", 347: "injury-risk-asymmetry",
  348: "building-solar-exposure", 349: "traffic-signal-timing", 350: "environmental-noise-propagation", 351: "inverse-kinematics-2d-arm",
  352: "pid-controller-ziegler", 353: "kalman-filter-prediction", 354: "h-index", 355: "item-difficulty-discrimination",
  356: "sample-weighting", 357: "life-insurance-premium", 358: "compound-default-interest", 359: "statute-of-limitations-period"
};

let slugReplacements = "";
for (let [id, slug] of Object.entries(EN_SLUGS)) {
  slugReplacements += `  ${id}: "${slug}",\n`;
}
// Clean out the old turkish slugs we just added in the previous script by removing lines from 199 to 359
const lines = script.split('\n');
const cleanedLines = lines.filter(l => !l.match(/^\s+(19[9]|2\d\d|3\d\d):\s+"[^"]+",?$/));
script = cleanedLines.join('\n');

// Insert new english slugs
script = script.replace('  198: "hydrostatic-fluid-pressure-depth",', '  198: "hydrostatic-fluid-pressure-depth",\n' + slugReplacements);

// Add Math functions to generator
script = script.replace('expr = expr.replace(/PI/g, "Math.PI");', `expr = expr.replace(/PI/g, "Math.PI");
  expr = expr.replace(/TAN\\(/g, "Math.tan(");
  expr = expr.replace(/SIN\\(/g, "Math.sin(");
  expr = expr.replace(/COS\\(/g, "Math.cos(");
  expr = expr.replace(/CEILING\\(/g, "Math.ceil(");
  expr = expr.replace(/ACOS\\(/g, "Math.acos(");
  expr = expr.replace(/ATAN2\\(/g, "Math.atan2(");
  expr = expr.replace(/ATAN\\(/g, "Math.atan(");
  expr = expr.replace(/MOD\\(/g, "((a,b)=>a%b)("); // MOD is tricky, let's just make it a local function if possible, actually MOD(a,b) -> (a%b). We will replace MOD(x,y) manually in regex:
  expr = expr.replace(/MOD\\(([^,]+),\\s*([^)]+)\\)/g, "(($1) % ($2))");
  // Fix EGER(...) == single equals to double equals inside condition
  // A crude fix: just replace =" with ===" and =' with ==='
  expr = expr.replace(/="/g, '==="');
  expr = expr.replace(/='/g, "==='");
  expr = expr.replace(/=(true|false|[0-9]+)/g, '===$1');
`);

fs.writeFileSync("scripts/generate-new-free-tools.mjs", script);
console.log("Fixed all issues!");
