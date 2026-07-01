import type {
  FormulaDefinition,
  FormulaInputs,
} from "@/lib/features/premium-schema/formula-registry";

// Helper functions (mirrored from user-premium-formulas.ts)
function num(inputs: FormulaInputs, key: string, fallback = 0): number {
  const value = inputs[key];
  return Number.isFinite(typeof value === "number" ? value : Number(value))
    ? value
    : fallback;
}

function assertFinite(value: number, fallback = 0): number {
  return Number.isFinite(value) ? value : fallback;
}

function nonNegative(value: number): number {
  return assertFinite(Math.max(0, value));
}

function SUM<T>(_xs: T): number { return 0; }

function tVal(inputs: FormulaInputs, key: string, t: number, fallback = 0): number {
  const raw = inputs[key];
  if (Array.isArray(raw) && raw.length > t) {
    const v = Number(raw[t]);
    return Number.isFinite(v) ? v : fallback;
  }
  return typeof raw === "number" ? raw : fallback;
}

function normStd(x: number): number {
  const b0 = 0.2316419, b1 = 0.319381530, b2 = -0.356563782;
  const b3 = 1.781477937, b4 = -1.821255978, b5 = 1.330274429;
  const t = 1 / (1 + b0 * Math.abs(x));
  const poly = t * (b1 + t * (b2 + t * (b3 + t * (b4 + t * b5))));
  const cdf = 1 - poly * Math.exp(-x * x / 2);
  return x >= 0 ? cdf : 1 - cdf;
}

function normSInv(p: number): number {
  if (p <= 0) return -6;
  if (p >= 1) return 6;
  const a = [-3.969683028665376e+1, 2.209460984245205e+2,
    -2.759285104469687e+2, 1.383577518672690e+2,
    -3.066479806614716e+1, 2.506628277459239e+0];
  const b = [-5.447609879822406e+1, 1.615858368580409e+2,
    -1.556989798598866e+2, 6.680131188771972e+1,
    -1.328068155288572e+1];
  const c = [-7.784894002430293e-3, -3.223964580411365e-1,
    -2.400758277161838e+0, -2.549732539343734e+0,
    4.374664141464968e+0, 2.938163982698783e+0];
  const d = [7.784695709041462e-3, 3.224671290700398e-1,
    2.445134137142996e+0, 3.754408661907416e+0];
  
  const q = p - 0.5;
  if (Math.abs(q) <= 0.425) {
    const r = 0.180625 - q * q;
    return q * (((((a[5] * r + a[4]) * r + a[3]) * r + a[2]) * r + a[1]) * r + a[0]) /
      (((((b[4] * r + b[3]) * r + b[2]) * r + b[1]) * r + b[0]) * r + 1);
  }
  const r = q < 0 ? p : 1 - p;
  if (r <= 0) return q < 0 ? -6 : 6;
  const rSqrt = Math.sqrt(-2 * Math.log(r));
  const z = (((((c[5] * rSqrt + c[4]) * rSqrt + c[3]) * rSqrt + c[2]) * rSqrt + c[1]) * rSqrt + c[0]) /
    ((((d[3] * rSqrt + d[2]) * rSqrt + d[1]) * rSqrt + d[0]) * rSqrt + 1);
  return q < 0 ? -z : z;
}

// @ts-ignore TS2590 - chunk to avoid OOM
export const CHUNK_67_DEFINITIONS: readonly FormulaDefinition[] = [
  {
    id: "user.standard_time_work_study_5",
    family: "cost",
    label: "Zaman Etudu Analizoru — LaborCostPerUnit",
    fn: (inputs) => {
    const standardTime = num(inputs, "standardTime");
    const hourlyRate = num(inputs, "hourlyRate");
    return nonNegative(assertFinite(standardTime * hourlyRate));
  },
  },
  {
    id: "user.standard_time_work_study_6",
    family: "cost",
    label: "Zaman Etudu Analizoru — EfficiencyVariance",
    fn: (inputs) => {
    const standardTime = num(inputs, "standardTime");
    const actualTime = num(inputs, "actualTime");
    const actualProduction = num(inputs, "actualProduction");
    const hourlyRate = num(inputs, "hourlyRate");
    return nonNegative(assertFinite((standardTime - actualTime) * actualProduction * hourlyRate));
  },
  },
  // ── #163 COMPRESSOR POWER ──
  {
    id: "industrial.compressor_power_0",
    family: "industrial",
    label: "Compressor — izentropik guc",
    fn: (inputs) => { const P1 = num(inputs, "girisBasinci_P1"); const T1 = num(inputs, "girisSicakligi_T1") + 273.15; const Q = num(inputs, "havaDebisi_Q"); const P2 = P1 + num(inputs, "calismaBasinci_P") * 0.9869; const n = num(inputs, "politropikUs_n", 1.3); const η_is = num(inputs, "izentropikVerim_η_is", 75) / 100; const z = num(inputs, "kademeSayisi_z", 1); const power = (n/(n-1)) * Q/60 * P1 * Math.pow(10,5) * (Math.pow(P2/P1, (n-1)/(n*z))-1) / (η_is * 1000); return nonNegative(assertFinite(power)); },
  },
  {
    id: "industrial.compressor_power_1",
    family: "industrial",
    label: "Compressor — saft gucu",
    fn: (inputs) => { const izWork = num(inputs, "motorPower_kW"); const η_m = num(inputs, "mekanikVerim_η_m", 95) / 100; return nonNegative(assertFinite(izWork / η_m)); },
  },
  {
    id: "industrial.compressor_power_2",
    family: "industrial",
    label: "Compressor — motor gucu",
    fn: (inputs) => { const shaftPower = num(inputs, "motorPower_HP"); const η_el = num(inputs, "motorVerimi_η_el", 94) / 100; return nonNegative(assertFinite(shaftPower / η_el)); },
  },
  {
    id: "industrial.compressor_power_3",
    family: "industrial",
    label: "Compressor — ozgul guc",
    fn: (inputs) => { const totalPower = num(inputs, "motorPower_kW"); const Q = num(inputs, "havaDebisi_Q"); if (Q === 0) return 0; return nonNegative(assertFinite(totalPower / Q)); },
  },
  {
    id: "industrial.compressor_power_4",
    family: "industrial",
    label: "Compressor — cikis sicakligi",
    fn: (inputs) => { const T1 = num(inputs, "girisSicakligi_T1"); const P1 = num(inputs, "girisBasinci_P1"); const P2 = P1 + num(inputs, "calismaBasinci_P") * 0.9869; const n = num(inputs, "politropikUs_n", 1.3); const η_is = num(inputs, "izentropikVerim_η_is", 75) / 100; const z = num(inputs, "kademeSayisi_z", 1); const T2 = ((T1+273.15) * Math.pow(P2/P1, (n-1)/(n*z))) - 273.15; const actualT2 = T1 + (T2 - T1) / η_is; return nonNegative(assertFinite(actualT2)); },
  },
  {
    id: "industrial.compressor_power_5",
    family: "industrial",
    label: "Compressor — yillik enerji",
    fn: (inputs) => { const P = num(inputs, "motorPower_kW"); const h = num(inputs, "yillikCalismaSaati", 8000); return nonNegative(assertFinite(P * h)); },
  },
  {
    id: "industrial.compressor_power_6",
    family: "industrial",
    label: "Compressor — yillik maliyet",
    fn: (inputs) => { const kWh = num(inputs, "yillikEnerji_kWh"); const rate = num(inputs, "elektrikTarifesi", 0.1); return nonNegative(assertFinite(kWh * rate)); },
  },
  // ── #164 CUTTING PARAMETERS ──
  {
    id: "industrial.cutting_power_0",
    family: "industrial",
    label: "Cutting — devir hizi n",
    fn: (inputs) => { const Vc = num(inputs, "kesmeHizi_Vc"); const Dc = num(inputs, "takimCapi_Dc"); if (Dc === 0) return 0; return nonNegative(assertFinite((1000 * Vc) / (Math.PI * Dc))); },
  },
  {
    id: "industrial.cutting_power_1",
    family: "industrial",
    label: "Cutting — ilerleme hizi Vf",
    fn: (inputs) => { const fz = num(inputs, "disBasiIlerleme_fz"); const z = num(inputs, "disSayisi_z", 4); const n = num(inputs, "devir_n_rpm"); return nonNegative(assertFinite(fz * z * n)); },
  },
  {
    id: "industrial.cutting_power_2",
    family: "industrial",
    label: "Cutting — kesme kuvveti Fc",
    fn: (inputs) => { const kc1 = num(inputs, "ozgulKesmeKuvveti_kc1", 1500); const mc = num(inputs, "malzemeUsu_mc", 0.25); const ap = num(inputs, "kesmeDerinligi_ap"); const fz = num(inputs, "disBasiIlerleme_fz"); const ae = num(inputs, "kesmeGenisligi_ae"); const Dc = num(inputs, "takimCapi_Dc"); const z_s = num(inputs, "disSayisi_z", 1); if (Dc === 0) return 0; const kc = kc1 * Math.pow(fz * Math.sin(90*Math.PI/180), -mc); return nonNegative(assertFinite(kc * ap * fz * (ae/Dc) * z_s)); },
  },
  {
    id: "industrial.cutting_power_3",
    family: "industrial",
    label: "Cutting — tork Tc",
    fn: (inputs) => { const Fc = num(inputs, "kesmeKuvveti_Fc"); const Dc = num(inputs, "takimCapi_Dc"); return nonNegative(assertFinite(Fc * Dc / 2000)); },
  },
  {
    id: "industrial.cutting_power_4",
    family: "industrial",
    label: "Cutting — kesme gucu Pc",
    fn: (inputs) => { const Fc = num(inputs, "kesmeKuvveti_Fc"); const Vc = num(inputs, "kesmeHizi_Vc"); return nonNegative(assertFinite(Fc * Vc / 60000)); },
  },
  {
    id: "industrial.cutting_power_5",
    family: "industrial",
    label: "Cutting — motor gucu",
    fn: (inputs) => { const Pc = num(inputs, "kesmeGucu_Pc"); const η = num(inputs, "makineVerimi_η", 85) / 100; if (η === 0) return 0; return nonNegative(assertFinite(Pc / η)); },
  },
  {
    id: "industrial.cutting_power_6",
    family: "industrial",
    label: "Cutting — MRR",
    fn: (inputs) => { const ap = num(inputs, "kesmeDerinligi_ap"); const ae = num(inputs, "kesmeGenisligi_ae"); const Vf = num(inputs, "ilerlemeHizi_Vf"); return nonNegative(assertFinite(ap * ae * Vf / 1000)); },
  },
  {
    id: "industrial.cutting_power_7",
    family: "industrial",
    label: "Cutting — Ra yuzey puruzlulugu",
    fn: (inputs) => { const fz = num(inputs, "disBasiIlerleme_fz"); const re = 0.8; return nonNegative(assertFinite(fz * fz / (8 * re) * 1000)); },
  },
  // ── #165 EVAPORATIVE COOLING ──
  {
    id: "industrial.evap_cooling_0",
    family: "industrial",
    label: "Evaporative — hacim",
    fn: (inputs) => { return nonNegative(assertFinite(num(inputs, "alanUzunlugu_L") * num(inputs, "alanGenisligi_W") * num(inputs, "tavanYuksekligi_H"))); },
  },
  {
    id: "industrial.evap_cooling_1",
    family: "industrial",
    label: "Evaporative — toplam debi",
    fn: (inputs) => { return nonNegative(assertFinite(num(inputs, "hacim_m3") * num(inputs, "ACH_degeri", 30))); },
  },
  {
    id: "industrial.evap_cooling_2",
    family: "industrial",
    label: "Evaporative — cikis sicakligi",
    fn: (inputs) => { const Tk = num(inputs, "disSicaklikKuru"); const Ty = num(inputs, "disSicaklikYas"); const η = num(inputs, "padVerimi_η_pad", 85) / 100; return nonNegative(assertFinite(Tk - η * (Tk - Ty))); },
  },
  {
    id: "industrial.evap_cooling_3",
    family: "industrial",
    label: "Evaporative — delta T",
    fn: (inputs) => { return nonNegative(assertFinite(num(inputs, "disSicaklikKuru") - num(inputs, "cikisSicakligi"))); },
  },
  {
    id: "industrial.evap_cooling_4",
    family: "industrial",
    label: "Evaporative — cihaz sayisi",
    fn: (inputs) => { const debi = num(inputs, "toplamDebi"); const tekDebi = num(inputs, "cihazDebisi_tek", 30000); if (tekDebi === 0) return 0; return Math.ceil(debi / tekDebi); },
  },
  {
    id: "industrial.evap_cooling_5",
    family: "industrial",
    label: "Evaporative — toplam guc FES",
    fn: (inputs) => { return nonNegative(assertFinite(num(inputs, "cihazSayisi") * num(inputs, "cihazGucu_tek", 0.75))); },
  },
  {
    id: "industrial.evap_cooling_6",
    family: "industrial",
    label: "Evaporative — yillik enerji FES",
    fn: (inputs) => { return nonNegative(assertFinite(num(inputs, "toplamGuc_FES") * num(inputs, "gunlukCalismaSaati", 10) * num(inputs, "yillikCalismaGunu", 260))); },
  },
  {
    id: "industrial.evap_cooling_7",
    family: "industrial",
    label: "Evaporative — yillik enerji konv.",
    fn: (inputs) => { return nonNegative(assertFinite(num(inputs, "konvansiyonelGuc", 50) * num(inputs, "gunlukCalismaSaati", 10) * num(inputs, "yillikCalismaGunu", 260))); },
  },
  {
    id: "industrial.evap_cooling_8",
    family: "industrial",
    label: "Evaporative — enerji tasarrufu kWh",
    fn: (inputs) => { return nonNegative(assertFinite(num(inputs, "yillikEnerji_Konv") - num(inputs, "yillikEnerji_FES"))); },
  },
  {
    id: "industrial.evap_cooling_9",
    family: "industrial",
    label: "Evaporative — enerji tasarrufu %",
    fn: (inputs) => { const konv = num(inputs, "yillikEnerji_Konv"); if (konv === 0) return 0; return nonNegative(assertFinite(num(inputs, "enerjiTasarrufu_kWh") / konv * 100)); },
  },
  {
    id: "industrial.evap_cooling_10",
    family: "industrial",
    label: "Evaporative — yillik elk maliyeti FES",
    fn: (inputs) => { return nonNegative(assertFinite(num(inputs, "yillikEnerji_FES") * num(inputs, "elektrikTarifesi", 0.1))); },
  },
  {
    id: "industrial.evap_cooling_11",
    family: "industrial",
    label: "Evaporative — yillik su maliyeti",
    fn: (inputs) => { return nonNegative(assertFinite(num(inputs, "cihazSayisi") * num(inputs, "suTuketimi_tek", 6) * num(inputs, "gunlukCalismaSaati", 10) * num(inputs, "yillikCalismaGunu", 260) * num(inputs, "suTarifesi", 0.005))); },
  },
  {
    id: "industrial.evap_cooling_12",
    family: "industrial",
    label: "Evaporative — toplam tasarruf",
    fn: (inputs) => { const konvElk = num(inputs, "yillikEnerji_Konv") * num(inputs, "elektrikTarifesi", 0.1); const fesElk = num(inputs, "yillikElkMaliyet_FES"); const su = num(inputs, "yillikSuMaliyet"); return nonNegative(assertFinite(konvElk - fesElk - su)); },
  },
  // ── #166 CONDENSER PRECOOLING ──
  {
    id: "industrial.condenser_precool_0",
    family: "industrial",
    label: "Condenser — kapasite kW",
    fn: (inputs) => { if (num(inputs, "kapasiteBirimi") === 1) { return nonNegative(assertFinite(num(inputs, "chillerKapasitesi") * 3.517)); } return nonNegative(assertFinite(num(inputs, "chillerKapasitesi"))); },
  },
  {
    id: "industrial.condenser_precool_1",
    family: "industrial",
    label: "Condenser — kondenser yeni sicaklik",
    fn: (inputs) => { const η = num(inputs, "onSogutmaVerimi_η", 80) / 100; return nonNegative(assertFinite(num(inputs, "kondenserGirisHavaSicakligi") - η * (num(inputs, "kondenserGirisHavaSicakligi") - num(inputs, "yasTermometre")))); },
  },
  {
    id: "industrial.condenser_precool_2",
    family: "industrial",
    label: "Condenser — yeni COP",
    fn: (inputs) => { const cop = num(inputs, "mevcutCOP", 3); const T_old = num(inputs, "kondenserGirisHavaSicakligi"); const T_new = num(inputs, "kondYeniSicaklik"); const deltaT = T_old - T_new; return nonNegative(assertFinite(cop * (1 + deltaT * 0.03))); },
  },
  {
    id: "industrial.condenser_precool_3",
    family: "industrial",
    label: "Condenser — guc mevcut",
    fn: (inputs) => { const kap = num(inputs, "kapasite_kW"); const cop = num(inputs, "mevcutCOP", 3); if (cop === 0) return 0; return nonNegative(assertFinite(kap / cop)); },
  },
  {
    id: "industrial.condenser_precool_4",
    family: "industrial",
    label: "Condenser — guc yeni",
    fn: (inputs) => { const kap = num(inputs, "kapasite_kW"); const cop = num(inputs, "COP_yeni"); if (cop === 0) return 0; return nonNegative(assertFinite(kap / cop)); },
  },
  {
    id: "industrial.condenser_precool_5",
    family: "industrial",
    label: "Condenser — guc tasarrufu",
    fn: (inputs) => { return nonNegative(assertFinite(num(inputs, "gucMevcut") - num(inputs, "gucYeni"))); },
  },
  {
    id: "industrial.condenser_precool_6",
    family: "industrial",
    label: "Condenser — yillik tasarruf kWh",
    fn: (inputs) => { return nonNegative(assertFinite(num(inputs, "gucTasarrufu") * num(inputs, "calismaSaati_yil", 4000))); },
  },
  {
    id: "industrial.condenser_precool_7",
    family: "industrial",
    label: "Condenser — yillik tasarruf USD",
    fn: (inputs) => { return nonNegative(assertFinite(num(inputs, "yillikTasarruf_kWh") * num(inputs, "elektrikTarifesi", 0.1))); },
  },
  {
    id: "industrial.condenser_precool_8",
    family: "industrial",
    label: "Condenser — net tasarruf",
    fn: (inputs) => { return nonNegative(assertFinite(num(inputs, "yillikTasarruf_USD") - num(inputs, "onSogutmaIsletmeMaliyeti", 0))); },
  },
  {
    id: "industrial.condenser_precool_9",
    family: "industrial",
    label: "Condenser — geri odeme (ay)",
    fn: (inputs) => { const net = num(inputs, "netTasarruf"); if (net <= 0) return 999; return nonNegative(assertFinite(num(inputs, "onSogutmaSistemMaliyeti") / net * 12)); },
  },
  {
    id: "industrial.condenser_precool_10",
    family: "industrial",
    label: "Condenser — ROI",
    fn: (inputs) => { const cost = num(inputs, "onSogutmaSistemMaliyeti"); if (cost <= 0) return 0; return nonNegative(assertFinite(num(inputs, "netTasarruf") / cost * 100)); },
  },
  {
    id: "industrial.condenser_precool_11",
    family: "industrial",
    label: "Condenser — CO2 azaltma",
    fn: (inputs) => { return nonNegative(assertFinite(num(inputs, "yillikTasarruf_kWh") * 0.00042)); },
  },
  // ── #167 PAD MEDIA PSYCHROMETRIC ──
  {
    id: "industrial.pad_media_0",
    family: "industrial",
    label: "Pad Media — verim η_sat",
    fn: (inputs) => { const t = num(inputs, "padKalinligi_t", 100); const V = num(inputs, "havaHizi_V", 2); const baseEff = t >= 200 ? 90 : t >= 150 ? 85 : t >= 100 ? 80 : 70; const velocityEff = Math.min(baseEff, baseEff - (V - 1.5) * 5); return nonNegative(assertFinite(Math.max(50, velocityEff))); },
  },
  {
    id: "industrial.pad_media_1",
    family: "industrial",
    label: "Pad Media — cikis kuru sicaklik",
    fn: (inputs) => { const Tk = num(inputs, "girisKuruTermometre"); const Ty = num(inputs, "girisYasTermometre"); const η = num(inputs, "verim_η_sat", 85) / 100; return nonNegative(assertFinite(Tk - η * (Tk - Ty))); },
  },
  {
    id: "industrial.pad_media_2",
    family: "industrial",
    label: "Pad Media — delta T",
    fn: (inputs) => { return nonNegative(assertFinite(num(inputs, "girisKuruTermometre") - num(inputs, "cikisKuruSicaklik"))); },
  },
  {
    id: "industrial.pad_media_3",
    family: "industrial",
    label: "Pad Media — cikis bagil nem",
    fn: (inputs) => { return Math.min(100, num(inputs, "girisBagilNem", 40) + (100 - num(inputs, "girisBagilNem", 40)) * num(inputs, "verim_η_sat", 85) / 100 * 0.8); },
  },
  {
    id: "industrial.pad_media_4",
    family: "industrial",
    label: "Pad Media — hava debisi m³/h",
    fn: (inputs) => { return nonNegative(assertFinite(num(inputs, "havaHizi_V", 2) * num(inputs, "padYuzeyAlani_A") * 3600)); },
  },
  {
    id: "industrial.pad_media_5",
    family: "industrial",
    label: "Pad Media — sogutma kapasitesi kW",
    fn: (inputs) => { const debi = num(inputs, "havaDebisi_m3h"); const deltaT = num(inputs, "deltaT"); return nonNegative(assertFinite(debi * 1.2 * deltaT / 3600)); },
  },
  {
    id: "industrial.pad_media_6",
    family: "industrial",
    label: "Pad Media — su tuketimi L/h",
    fn: (inputs) => { return nonNegative(assertFinite(num(inputs, "sogutmaKapasitesi_kW") * 1.5)); },
  },
  {
    id: "industrial.pad_media_7",
    family: "industrial",
    label: "Pad Media — basinc dususu Pa",
    fn: (inputs) => { const V = num(inputs, "havaHizi_V", 2); const t = num(inputs, "padKalinligi_t", 100); return nonNegative(assertFinite(15 * t/100 * Math.pow(V/2, 1.5))); },
  },
  // ── #168 F-GAS ──
  {
    id: "industrial.fgas_0",
    family: "industrial",
    label: "F-Gas — toplam sarj",
    fn: (inputs) => { return nonNegative(assertFinite(num(inputs, "gazMiktari_sarj") * num(inputs, "cihazSayisi"))); },
  },
  {
    id: "industrial.fgas_1",
    family: "industrial",
    label: "F-Gas — tCO2e per device",
    fn: (inputs) => { return nonNegative(assertFinite(num(inputs, "gazMiktari_sarj") * num(inputs, "GWP_degeri", 2000) / 1000)); },
  },
  {
    id: "industrial.fgas_2",
    family: "industrial",
    label: "F-Gas — tCO2e toplam",
    fn: (inputs) => { return nonNegative(assertFinite(num(inputs, "tCO2e_perDevice") * num(inputs, "cihazSayisi"))); },
  },
  {
    id: "industrial.fgas_3",
    family: "industrial",
    label: "F-Gas — sizinti testi yukumlulugu",
    fn: (inputs) => { const sarj = num(inputs, "gazMiktari_sarj"); if (sarj >= 50) return 3; if (sarj >= 5) return 12; if (sarj >= 3) return 0; return 0; },
  },
  {
    id: "industrial.fgas_4",
    family: "industrial",
    label: "F-Gas — yillik test maliyeti",
    fn: (inputs) => { return nonNegative(assertFinite(num(inputs, "sizintiTestiFrequency") * num(inputs, "cihazSayisi") / 12 * num(inputs, "testBirimUcreti", 200))); },
  },
  {
    id: "industrial.fgas_5",
    family: "industrial",
    label: "F-Gas — yillik kacak kg",
    fn: (inputs) => { return nonNegative(assertFinite(num(inputs, "toplamSarj_kg") * num(inputs, "yillikKacakOrani", 5) / 100)); },
  },
  {
    id: "industrial.fgas_6",
    family: "industrial",
    label: "F-Gas — kacak maliyeti",
    fn: (inputs) => { return nonNegative(assertFinite(num(inputs, "yillikKacak_kg") * num(inputs, "gazBirimFiyati", 50))); },
  },
  {
    id: "industrial.fgas_7",
    family: "industrial",
    label: "F-Gas — kacak emisyon tCO2e",
    fn: (inputs) => { return nonNegative(assertFinite(num(inputs, "yillikKacak_kg") * num(inputs, "GWP_degeri", 2000) / 1000)); },
  },
  {
    id: "industrial.fgas_8",
    family: "industrial",
    label: "F-Gas — toplam maliyet",
    fn: (inputs) => { return nonNegative(assertFinite(num(inputs, "yillikTestMaliyeti") + num(inputs, "kacakMaliyeti"))); },
  },
  // ── #169 WATER FOOTPRINT ──
  {
    id: "industrial.water_footprint_0",
    family: "industrial",
    label: "Water — toplam",
    fn: (inputs) => { return nonNegative(assertFinite(num(inputs, "dogrudanSuTuketimi_mavi") + num(inputs, "yagmurSuyuKullanimi_yesil") + num(inputs, "atikSuUretimi_gri"))); },
  },
  {
    id: "industrial.water_footprint_1",
    family: "industrial",
    label: "Water — birim ayak izi",
    fn: (inputs) => { const uretim = num(inputs, "uretimHacmi", 1); if (uretim === 0) return 0; return nonNegative(assertFinite(num(inputs, "toplamSuAyakIzi") / uretim)); },
  },
  {
    id: "industrial.water_footprint_2",
    family: "industrial",
    label: "Water — mavi orani",
    fn: (inputs) => { const toplam = num(inputs, "toplamSuAyakIzi"); if (toplam === 0) return 0; return nonNegative(assertFinite(num(inputs, "dogrudanSuTuketimi_mavi") / toplam * 100)); },
  },
  {
    id: "industrial.water_footprint_3",
    family: "industrial",
    label: "Water — yesil orani",
    fn: (inputs) => { const toplam = num(inputs, "toplamSuAyakIzi"); if (toplam === 0) return 0; return nonNegative(assertFinite(num(inputs, "yagmurSuyuKullanimi_yesil") / toplam * 100)); },
  },
  {
    id: "industrial.water_footprint_4",
    family: "industrial",
    label: "Water — gri orani",
    fn: (inputs) => { const toplam = num(inputs, "toplamSuAyakIzi"); if (toplam === 0) return 0; return nonNegative(assertFinite(num(inputs, "atikSuUretimi_gri") / toplam * 100)); },
  },
  {
    id: "industrial.water_footprint_5",
    family: "industrial",
    label: "Water — benchmark farki",
    fn: (inputs) => { const uretim = num(inputs, "uretimHacmi", 1); const bench = num(inputs, "sektorBenchmark_m3_birim"); if (uretim === 0) return 0; return nonNegative(assertFinite((num(inputs, "toplamSuAyakIzi") / uretim) - bench)); },
  },
  {
    id: "industrial.water_footprint_6",
    family: "industrial",
    label: "Water — iyilestirme potansiyeli",
    fn: (inputs) => { const fark = num(inputs, "benchmarkFarki"); if (fark <= 0) return 0; return nonNegative(assertFinite(fark * num(inputs, "uretimHacmi", 1))); },
  },
  // ── #170 SMOKE EXHAUST ──
  {
    id: "industrial.smoke_exhaust_0",
    family: "industrial",
    label: "Smoke — yangin cevresi",
    fn: (inputs) => { return nonNegative(assertFinite(Math.sqrt(num(inputs, "yanginAlani_A_fire", 25)) * 4)); },
  },
  {
    id: "industrial.smoke_exhaust_1",
    family: "industrial",
    label: "Smoke — duman kutle debisi",
    fn: (inputs) => { const P = num(inputs, "yanginCevresi"); const d = num(inputs, "dumanTabakasiYuksekligi_d", 2.5); return nonNegative(assertFinite(0.076 * Math.pow(P, 1.5) * Math.pow(d, 0.5))); },
  },
  {
    id: "industrial.smoke_exhaust_2",
    family: "industrial",
    label: "Smoke — gerekli havalandirma alani",
    fn: (inputs) => { const m = num(inputs, "dumanKutleDebisi"); const Cd = num(inputs, "Cv_kapakAkisKatsayisi", 0.65); const ρ = 1.2; if (Cd === 0) return 0; return nonNegative(assertFinite(m / (Cd * Math.sqrt(2 * ρ * 9.81 * num(inputs, "dumanTabakasiYuksekligi_d", 2.5))) * 10000)); },
  },
  {
    id: "industrial.smoke_exhaust_3",
    family: "industrial",
    label: "Smoke — etkin alan orani",
    fn: (inputs) => { const A = num(inputs, "gerekliHavalandirmaAlani"); const A_tavan = num(inputs, "tavanAlani_A_tavan", 500); if (A_tavan === 0) return 0; return nonNegative(assertFinite(A / A_tavan * 100)); },
  },
  {
    id: "industrial.smoke_exhaust_4",
    family: "industrial",
    label: "Smoke — kapak sayisi",
    fn: (inputs) => { const A = num(inputs, "gerekliHavalandirmaAlani"); const kapakBoy = 1; return Math.ceil(A / (kapakBoy * kapakBoy)); },
  },
  // ── #171 NATURAL VENTILATION ──
  {
    id: "industrial.nat_vent_0",
    family: "industrial",
    label: "Nat Vent — hacim",
    fn: (inputs) => { return nonNegative(assertFinite(num(inputs, "alanUzunlugu") * num(inputs, "alanGenisligi") * num(inputs, "tavanYuksekligi"))); },
  },
  {
    id: "industrial.nat_vent_1",
    family: "industrial",
    label: "Nat Vent — gerekli debi m³/s",
    fn: (inputs) => { return nonNegative(assertFinite(num(inputs, "hacim_m3") * num(inputs, "hedefACH", 6) / 3600)); },
  },
  {
    id: "industrial.nat_vent_2",
    family: "industrial",
    label: "Nat Vent — deltaT",
    fn: (inputs) => { return nonNegative(assertFinite(num(inputs, "icSicaklik_Ti") - num(inputs, "disSicaklik_To"))); },
  },
  {
    id: "industrial.nat_vent_3",
    family: "industrial",
    label: "Nat Vent — gerekli menfez alani",
    fn: (inputs) => { const Q = num(inputs, "gerekliDebi_m3s"); const Cd = num(inputs, "menfezAkisKatsayisi_Cd", 0.65); const dH = num(inputs, "catiTepeYuksekligi_deltaH", 3); const dT = num(inputs, "deltaT"); const Ti = num(inputs, "icSicaklik_Ti", 25) + 273.15; if (Cd <= 0 || dH * dT <= 0) return 0; return nonNegative(assertFinite(Q / (Cd * Math.sqrt(2 * 9.81 * dH * Math.abs(dT) / Ti)))); },
  },
  {
    id: "industrial.nat_vent_4",
    family: "industrial",
    label: "Nat Vent — alt menfez alani",
    fn: (inputs) => { return nonNegative(assertFinite(num(inputs, "gerekliMenfezAlani") * 0.5)); },
  },
  {
    id: "industrial.nat_vent_5",
    family: "industrial",
    label: "Nat Vent — ust menfez alani",
    fn: (inputs) => { return nonNegative(assertFinite(num(inputs, "gerekliMenfezAlani") * 0.5)); },
  },
  {
    id: "industrial.nat_vent_6",
    family: "industrial",
    label: "Nat Vent — havalandirma debisi m³/h",
    fn: (inputs) => { return nonNegative(assertFinite(num(inputs, "gerekliDebi_m3s") * 3600)); },
  },
  // ── #172 COMPOUND INTEREST ──
  {
    id: "industrial.compound_interest_0",
    family: "industrial",
    label: "Compound — donem sayisi",
    fn: (inputs) => { const m = num(inputs, "birlestirmeSikligi_m", 12); return nonNegative(assertFinite(m * num(inputs, "sure_n", 10))); },
  },
  {
    id: "industrial.compound_interest_1",
    family: "industrial",
    label: "Compound — FV anapara",
    fn: (inputs) => { const PV = num(inputs, "baslangicSermayesi_PV"); const r = num(inputs, "yillikFaizOrani_r", 10) / 100; const n = num(inputs, "donemSayisi"); const m = num(inputs, "birlestirmeSikligi_m", 12); if (m === 0) return 0; return nonNegative(assertFinite(PV * Math.pow(1 + r / m, n))); },
  },
  {
    id: "industrial.compound_interest_2",
    family: "industrial",
    label: "Compound — FV katki",
    fn: (inputs) => { const PMT = num(inputs, "aylikKatki_PMT"); const r = num(inputs, "yillikFaizOrani_r", 10) / 100; const n = num(inputs, "donemSayisi"); const m = num(inputs, "birlestirmeSikligi_m", 12); if (m === 0) return 0; const i = r / m; if (i === 0) return nonNegative(assertFinite(PMT * n)); return nonNegative(assertFinite(PMT * (Math.pow(1 + i, n) - 1) / i)); },
  },
  {
    id: "industrial.compound_interest_3",
    family: "industrial",
    label: "Compound — FV toplam",
    fn: (inputs) => { return nonNegative(assertFinite(num(inputs, "FV_anapara") + num(inputs, "FV_katki"))); },
  },
  {
    id: "industrial.compound_interest_4",
    family: "industrial",
    label: "Compound — toplam yatirim",
    fn: (inputs) => { return nonNegative(assertFinite(num(inputs, "baslangicSermayesi_PV") + num(inputs, "aylikKatki_PMT") * num(inputs, "sure_n", 10) * 12)); },
  },
  {
    id: "industrial.compound_interest_5",
    family: "industrial",
    label: "Compound — toplam faiz",
    fn: (inputs) => { return nonNegative(assertFinite(num(inputs, "FV_toplam") - num(inputs, "toplamYatirim"))); },
  },
  {
    id: "industrial.compound_interest_6",
    family: "industrial",
    label: "Compound — vergi post faiz",
    fn: (inputs) => { const t = num(inputs, "vergiOrani_t", 0) / 100; return nonNegative(assertFinite(num(inputs, "toplamFaiz") * (1 - t))); },
  },
  {
    id: "industrial.compound_interest_7",
    family: "industrial",
    label: "Compound — vergi post toplam",
    fn: (inputs) => { return nonNegative(assertFinite(num(inputs, "toplamYatirim") + num(inputs, "vergiSonrasiFaiz"))); },
  },
  {
    id: "industrial.compound_interest_8",
    family: "industrial",
    label: "Compound — reel getiri %",
    fn: (inputs) => { const i = num(inputs, "enflasyonOrani_i", 0) / 100; const nominalReturn = (num(inputs, "FV_toplam") - num(inputs, "toplamYatirim")) / num(inputs, "toplamYatirim"); return nonNegative(assertFinite(((1 + nominalReturn) / (1 + i) - 1) * 100)); },
  },
  {
    id: "industrial.compound_interest_9",
    family: "industrial",
    label: "Compound — satin alma gucu",
    fn: (inputs) => { const i = num(inputs, "enflasyonOrani_i", 0) / 100; const n_years = num(inputs, "sure_n", 10); return nonNegative(assertFinite(num(inputs, "FV_toplam") / Math.pow(1 + i, n_years))); },
  },
  {
    id: "industrial.compound_interest_10",
    family: "industrial",
    label: "Compound — ikiye katlanma yil",
    fn: (inputs) => { const r = num(inputs, "yillikFaizOrani_r", 10); if (r <= 0) return 999; return nonNegative(assertFinite(72 / r)); },
  },
  // ── #173 LIVING WAGE ──
  {
    id: "industrial.living_wage_0",
    family: "industrial",
    label: "Living wage — brut yillik",
    fn: (inputs) => { return nonNegative(assertFinite(num(inputs, "brUcret_Aylik") * 12)); },
  },
  {
    id: "industrial.living_wage_1",
    family: "industrial",
    label: "Living wage — SGK isveren",
    fn: (inputs) => { return nonNegative(assertFinite(num(inputs, "brUcret_Aylik") * num(inputs, "SGK_isverenOrani", 15.5) / 100 * 12)); },
  },
  {
    id: "industrial.living_wage_2",
    family: "industrial",
    label: "Living wage — issizlik fonu",
    fn: (inputs) => { return nonNegative(assertFinite(num(inputs, "brUcret_Aylik") * num(inputs, "issizlikFonuOrani", 2) / 100 * 12)); },
  },
  {
    id: "industrial.living_wage_3",
    family: "industrial",
    label: "Living wage — damga vergisi",
    fn: (inputs) => { return nonNegative(assertFinite(num(inputs, "brUcret_Yillik") * num(inputs, "damgaVergiOrani", 0.759) / 100)); },
  },
  {
    id: "industrial.living_wage_4",
    family: "industrial",
    label: "Living wage — revenue vergisi yillik",
    fn: (inputs) => { return nonNegative(assertFinite(num(inputs, "brUcret_Yillik") * num(inputs, "gelirVergiDilimi", 15) / 100)); },
  },
  {
    id: "industrial.living_wage_5",
    family: "industrial",
    label: "Living wage — kesinti toplami",
    fn: (inputs) => { const fm = num(inputs, "fazlaMesaiSaat_Aylik", 0); const fk = num(inputs, "fazlaMesaiKatsayisi", 1.5); const fmUcret = fm * fk * num(inputs, "brUcret_Aylik") / 225; return nonNegative(assertFinite(num(inputs, "SGK_toplam_isveren") + num(inputs, "issizlik_toplam") + num(inputs, "damgaVergisi") + num(inputs, "gelirVergisi_yillik") + fmUcret * 12)); },
  },
  {
    id: "industrial.living_wage_6",
    family: "industrial",
    label: "Living wage — net aylik",
    fn: (inputs) => { const brAylik = num(inputs, "brUcret_Aylik"); const yemek = num(inputs, "yemekYardimi_Gunluk", 0) * num(inputs, "calismaGunu_Ay", 22); const yol = num(inputs, "yolYardimi_Gunluk", 0) * num(inputs, "calismaGunu_Ay", 22); const fm = num(inputs, "fazlaMesaiSaat_Aylik", 0); const fk = num(inputs, "fazlaMesaiKatsayisi", 1.5); const fmUcretAylik = fm * fk * brAylik / 225; const sgkCalisan = brAylik * 0.14; const isCalisan = brAylik * 0.01; return nonNegative(assertFinite(brAylik + fmUcretAylik - sgkCalisan - isCalisan + yemek + yol)); },
  },
  {
    id: "industrial.living_wage_7",
    family: "industrial",
    label: "Living wage — net yillik",
    fn: (inputs) => { return nonNegative(assertFinite(num(inputs, "netUcret_Aylik") * 12)); },
  },
  {
    id: "industrial.living_wage_8",
    family: "industrial",
    label: "Living wage — isveren toplam maliyet",
    fn: (inputs) => { return nonNegative(assertFinite(num(inputs, "brUcret_Yillik") + num(inputs, "SGK_toplam_isveren") + num(inputs, "issizlik_toplam"))); },
  },
  {
    id: "industrial.living_wage_9",
    family: "industrial",
    label: "Living wage — calisana fayda %",
    fn: (inputs) => { const iv = num(inputs, "isvereneToplamMaliyet"); if (iv <= 0) return 0; return nonNegative(assertFinite(num(inputs, "netUcret_Yillik") / iv * 100)); },
  },
  // ── #174 PANEL RADIATOR ──
  {
    id: "industrial.panel_radiator_0",
    family: "industrial",
    label: "Panel rad — oda hacmi",
    fn: (inputs) => { return nonNegative(assertFinite(num(inputs, "odaUzunlugu") * num(inputs, "odaGenisligi") * num(inputs, "odaYuksekligi"))); },
  },
  {
    id: "industrial.panel_radiator_1",
    family: "industrial",
    label: "Panel rad — isi ihtiyaci W",
    fn: (inputs) => { const V = num(inputs, "odaHacmi_m3"); const dT = num(inputs, "hedefSicaklik_Ti") - num(inputs, "disSicaklik_To"); const izo = num(inputs, "izolasyonSeviyesi", 0); const uVal = izo === 0 ? 0.6 : izo === 1 ? 0.8 : 1.2; const camTip = num(inputs, "camTipi", 0); const camAdj = camTip === 0 ? 1 : camTip === 1 ? 1.2 : 0.8; const camOrani = num(inputs, "camAlani_Orani", 20) / 100 * 1.5; const kisi = num(inputs, "kisiSayisi", 0) * 80; const aydinlatma = num(inputs, "aydinlatmaW_m2", 10) * V / num(inputs, "odaYuksekligi", 3); return nonNegative(assertFinite(V * dT * uVal * camAdj + kisi + aydinlatma + V * dT * camOrani)); },
  },
  {
    id: "industrial.panel_radiator_2",
    family: "industrial",
    label: "Panel rad — isi ihtiyaci kcal/h",
    fn: (inputs) => { return nonNegative(assertFinite(num(inputs, "isiIhtiyaci_W") * 0.86)); },
  },
  {
    id: "industrial.panel_radiator_3",
    family: "industrial",
    label: "Panel rad — panel gucu (75/65)",
    fn: (inputs) => { const isiIht = num(inputs, "isiIhtiyaci_W"); const tip = num(inputs, "panelTipi", 2); const factor = [0.6, 0.8, 1.0, 1.5][tip] || 1; return nonNegative(assertFinite(isiIht * factor)); },
  },
  // ── #175 UNDERFLOOR HEATING ──
  {
    id: "industrial.underfloor_0",
    family: "industrial",
    label: "Underfloor — isitma alani",
    fn: (inputs) => { return nonNegative(assertFinite(num(inputs, "alanUzunlugu") * num(inputs, "alanGenisligi"))); },
  },
  {
    id: "industrial.underfloor_1",
    family: "industrial",
    label: "Underfloor — ortalama zemin sicakligi",
    fn: (inputs) => { const gidis = num(inputs, "isletimSicakligi_gidis", 45); const donus = num(inputs, "donusSicakligi", 35); return nonNegative(assertFinite((gidis + donus) / 2)); },
  },
  {
    id: "industrial.underfloor_2",
    family: "industrial",
    label: "Underfloor — isi akisi W/m²",
    fn: (inputs) => { const Tm = num(inputs, "ortalamaZeminSicakligi"); const Ti = num(inputs, "odaSicakligi_Ti", 20); const zemin = num(inputs, "zeminTipi", 0); const R = [0.02, 0.1, 0.015, 0.15][zemin] || 0.05; if (R <= 0) return 0; return nonNegative(assertFinite((Tm - Ti) / R)); },
  },
  {
    id: "industrial.underfloor_3",
    family: "industrial",
    label: "Underfloor — toplam isi gucu",
    fn: (inputs) => { return nonNegative(assertFinite(num(inputs, "isiAkisi_Wm2") * num(inputs, "isitmaAlani_m2"))); },
  },
  {
    id: "industrial.underfloor_4",
    family: "industrial",
    label: "Underfloor — boru boyu toplam",
    fn: (inputs) => { const aralik = num(inputs, "serpantinAraligi_cm", 15) / 100; if (aralik <= 0) return 0; return nonNegative(assertFinite(num(inputs, "isitmaAlani_m2") / aralik * 1.1)); },
  },
  // ── #176 SOLAR TUBE ──
  {
    id: "industrial.solar_tube_0",
    family: "industrial",
    label: "Solar — gunluk sicak su ihtiyaci",
    fn: (inputs) => { return nonNegative(assertFinite(num(inputs, "kullaniciSayisi", 4) * num(inputs, "gunlukKullanim_su_L_kisi", 50))); },
  },
  {
    id: "industrial.solar_tube_1",
    family: "industrial",
    label: "Solar — gunluk toplam enerji kWh",
    fn: (inputs) => { const m = num(inputs, "gunlukSicakSuIhtiyaci_L"); const cp = 4.186 / 3600; const dT = num(inputs, "sicakSuHedef_Tg", 60) - num(inputs, "sogukSuSicakligi_Tc", 15); return nonNegative(assertFinite(m * cp * dT)); },
  },
  {
    id: "industrial.solar_tube_2",
    family: "industrial",
    label: "Solar — kolektor alani m²",
    fn: (inputs) => { const Q = num(inputs, "gunlukToplamEnerji_kWh"); const I = num(inputs, "gunesIsinimiGunluk_Wm2", 500); const η = num(inputs, "kolektorVerimi_η_kol", 70) / 100; const t = num(inputs, "guneslenmeSuresi_saat", 6); if (I * η * t <= 0) return 0; return nonNegative(assertFinite(Q * 1000 / (I * η * t))); },
  },
  {
    id: "industrial.solar_tube_3",
    family: "industrial",
    label: "Solar — depolama hacmi L",
    fn: (inputs) => { return nonNegative(assertFinite(num(inputs, "gunlukSicakSuIhtiyaci_L") * num(inputs, "depolamaKapasitesi_saat", 24) / 24)); },
  },
  {
    id: "industrial.solar_tube_4",
    family: "industrial",
    label: "Solar — yardimci kaynak enerjisi",
    fn: (inputs) => { const ykTip = num(inputs, "yardimciKaynak", 0); const ykVerim = num(inputs, "yardimciKaynakVerimi_η_yd", 90) / 100; if (ykVerim <= 0) return 0; return nonNegative(assertFinite(num(inputs, "gunlukToplamEnerji_kWh") * 365 * (1 - 0.7) / ykVerim)); },
  },
  // ── #177 EPQ ──
  {
    id: "industrial.epq_0",
    family: "industrial",
    label: "EPQ — optimum miktar",
    fn: (inputs) => { const D = num(inputs, "yillikTalep_D"); const S = num(inputs, "hazirlikMaliyeti_S"); const H = num(inputs, "birimStokTutmaMaliyeti_H"); const p = num(inputs, "gunlukUretimHizi_p"); const d = num(inputs, "gunlukTalepHizi_d"); if (H <= 0 || p <= d) return 0; return nonNegative(assertFinite(Math.sqrt((2 * D * S) / (H * (1 - d/p))))); },
  },
  {
    id: "industrial.epq_1",
    family: "industrial",
    label: "EPQ — envanter dongusu gun",
    fn: (inputs) => { const epq = num(inputs, "EPQ_miktar"); const d = num(inputs, "gunlukTalepHizi_d"); if (d <= 0) return 0; return nonNegative(assertFinite(epq / d)); },
  },
  {
    id: "industrial.epq_2",
    family: "industrial",
    label: "EPQ — maksimum stok",
    fn: (inputs) => { const epq = num(inputs, "EPQ_miktar"); const p = num(inputs, "gunlukUretimHizi_p"); const d = num(inputs, "gunlukTalepHizi_d"); if (p <= 0) return 0; return nonNegative(assertFinite(epq * (1 - d/p))); },
  },
  {
    id: "industrial.epq_3",
    family: "industrial",
    label: "EPQ — yillik hazirlik maliyeti",
    fn: (inputs) => { const D = num(inputs, "yillikTalep_D"); const S = num(inputs, "hazirlikMaliyeti_S"); const epq = num(inputs, "EPQ_miktar"); if (epq <= 0) return 0; return nonNegative(assertFinite(D / epq * S)); },
  },
  {
    id: "industrial.epq_4",
    family: "industrial",
    label: "EPQ — yillik stok maliyeti",
    fn: (inputs) => { const H = num(inputs, "birimStokTutmaMaliyeti_H"); const Imax = num(inputs, "maksimumStok"); return nonNegative(assertFinite(H * Imax / 2)); },
  },
  // ── #178 KANBAN ──
  {
    id: "industrial.kanban_0",
    family: "industrial",
    label: "Kanban — kart sayisi",
    fn: (inputs) => { const d = num(inputs, "gunlukTalep_d"); const LT = num(inputs, "tedarikSuresi_LT"); const k = num(inputs, "guvenlikStoguFaktoru_k", 0.1); const q = num(inputs, "kutuKapasitesi_q"); if (q <= 0) return 0; return Math.ceil(d * LT * (1 + k) / q) + 1; },
  },
  {
    id: "industrial.kanban_1",
    family: "industrial",
    label: "Kanban — emniyet stogu",
    fn: (inputs) => { const d = num(inputs, "gunlukTalep_d"); const LT = num(inputs, "tedarikSuresi_LT"); const k = num(inputs, "guvenlikStoguFaktoru_k", 0.1); return nonNegative(assertFinite(d * LT * k)); },
  },
  // ── #179 LITTLE'S LAW ──
  {
    id: "industrial.littles_law_0",
    family: "industrial",
    label: "Little — cevrim suresi",
    fn: (inputs) => { const WIP = num(inputs, "wip_miktar"); const TH = num(inputs, "cikisHizi"); if (TH <= 0) return 0; return nonNegative(assertFinite(WIP / TH)); },
  },
  {
    id: "industrial.littles_law_1",
    family: "industrial",
    label: "Little — WIP hesaplanan",
    fn: (inputs) => { const CT = num(inputs, "cevrimSuresi_CT"); const TH = num(inputs, "cikisHizi"); return nonNegative(assertFinite(CT * TH)); },
  },
  {
    id: "industrial.littles_law_2",
    family: "industrial",
    label: "Little — cikis hesaplanan",
    fn: (inputs) => { const WIP = num(inputs, "wip_miktar"); const CT = num(inputs, "cevrimSuresi_CT"); if (CT <= 0) return 0; return nonNegative(assertFinite(WIP / CT)); },
  },
  {
    id: "industrial.littles_law_3",
    family: "industrial",
    label: "Little — WIP maliyeti",
    fn: (inputs) => { return nonNegative(assertFinite(num(inputs, "wip_miktar") * num(inputs, "maliyet_birim"))); },
  },
  // ── #180 MILK RUN ──
  {
    id: "industrial.milk_run_0",
    family: "industrial",
    label: "Milk run — toplam mesafe",
    fn: (inputs) => { return nonNegative(assertFinite(num(inputs, "tedarikciSayisi") * num(inputs, "tedarikciMesafe_ortalama") * 2 * num(inputs, "turSayisi_gunluk"))); },
  },
  {
    id: "industrial.milk_run_1",
    family: "industrial",
    label: "Milk run — toplam sure",
    fn: (inputs) => { const mesafe = num(inputs, "toplamMesafe"); const hiz = num(inputs, "ortalamaHiz_kmh", 50); const yukBosalt = num(inputs, "yuklemeBosaltmaDk", 15) * num(inputs, "tedarikciSayisi"); const bekleme = num(inputs, "beklemeSuresiDk", 5) * num(inputs, "tedarikciSayisi"); if (hiz <= 0) return 0; return nonNegative(assertFinite(mesafe / hiz * 60 + yukBosalt + bekleme)); },
  },
  {
    id: "industrial.milk_run_2",
    family: "industrial",
    label: "Milk run — surucu maliyeti",
    fn: (inputs) => { return nonNegative(assertFinite(num(inputs, "toplamSure") / 60 * num(inputs, "surucuSaatUcreti", 15))); },
  },
  {
    id: "industrial.milk_run_3",
    family: "industrial",
    label: "Milk run — akaryakit maliyeti",
    fn: (inputs) => { return nonNegative(assertFinite(num(inputs, "toplamMesafe") * num(inputs, "arabaMaliyeti_km", 0.5))); },
  },
  // ── #181 CPM/PERT ──
  {
    id: "industrial.cpm_pert_0",
    family: "industrial",
    label: "CPM — PERT: expected time Te",
    fn: (inputs) => { const o = num(inputs, "iyimserSure"); const m = num(inputs, "enOlasiSure"); const p = num(inputs, "kotumserSure"); return nonNegative(assertFinite((o + 4 * m + p) / 6)); },
  },
  {
    id: "industrial.cpm_pert_1",
    family: "industrial",
    label: "CPM — variance σ²",
    fn: (inputs) => { const p = num(inputs, "kotumserSure"); const o = num(inputs, "iyimserSure"); return nonNegative(assertFinite(Math.pow((p - o) / 6, 2))); },
  },
  {
    id: "industrial.cpm_pert_2",
    family: "industrial",
    label: "CPM — kritik yol suresi",
    fn: (inputs) => { const aktivite = num(inputs, "aktiviteler_toplam"); return nonNegative(assertFinite(num(inputs, "beklenenSure") * aktivite)); },
  },
  {
    id: "industrial.cpm_pert_3",
    family: "industrial",
    label: "CPM — toplam proje std sapma",
    fn: (inputs) => { return nonNegative(assertFinite(Math.sqrt(num(inputs, "varyans_toplam")))); },
  },
  {
    id: "industrial.cpm_pert_4",
    family: "industrial",
    label: "CPM — z-skoru",
    fn: (inputs) => { const hedef = num(inputs, "hedefTamamlamaSuresi"); const kritik = num(inputs, "kritikYolSuresi"); const sigma = num(inputs, "toplamProjeSigma"); if (sigma <= 0) return 0; return assertFinite((hedef - kritik) / sigma); },
  },
  // ── #182 QUEUING ──
  {
    id: "industrial.queuing_0",
    family: "industrial",
    label: "Queuing — varis orani λ",
    fn: (inputs) => { return nonNegative(assertFinite(num(inputs, "musteriSayisi_gunluk") / num(inputs, "calismaSaati_gunluk", 8))); },
  },
  {
    id: "industrial.queuing_1",
    family: "industrial",
    label: "Queuing — servis orani μ",
    fn: (inputs) => { const servisDk = num(inputs, "ortalamaServisSuresi_dk", 10); if (servisDk <= 0) return 0; return nonNegative(assertFinite(60 / servisDk)); },
  },
  {
    id: "industrial.queuing_2",
    family: "industrial",
    label: "Queuing — kullanim orani ρ (M/M/1)",
    fn: (inputs) => { const λ = num(inputs, "varisOrani_lambda"); const μ = num(inputs, "servisOrani_mu"); if (μ <= 0) return 0; return nonNegative(assertFinite(λ / μ)); },
  },
  {
    id: "industrial.queuing_3",
    family: "industrial",
    label: "Queuing — Lq (M/M/1)",
    fn: (inputs) => { const ρ = num(inputs, "kullanimOrani_rho"); if (ρ >= 1) return 999; return nonNegative(assertFinite(ρ * ρ / (1 - ρ))); },
  },
  {
    id: "industrial.queuing_4",
    family: "industrial",
    label: "Queuing — L (M/M/1)",
    fn: (inputs) => { const ρ = num(inputs, "kullanimOrani_rho"); if (ρ >= 1) return 999; return nonNegative(assertFinite(ρ / (1 - ρ))); },
  },
  // ── #183 FMEA ──
  {
    id: "industrial.fmea_0",
    family: "industrial",
    label: "FMEA — RPN",
    fn: (inputs) => { return nonNegative(assertFinite(num(inputs, "ortalamaSiddet_S") * num(inputs, "ortalamaOlusma_O") * num(inputs, "ortalamaSaptama_D"))); },
  },
  {
    id: "industrial.fmea_1",
    family: "industrial",
    label: "FMEA — risk duzeyi",
    fn: (inputs) => { const rpn = num(inputs, "RPN_ortalama"); if (rpn >= 200) return 4; if (rpn >= 100) return 3; if (rpn >= 50) return 2; return 1; },
  },
  {
    id: "industrial.fmea_2",
    family: "industrial",
    label: "FMEA — fayda/maliyet orani",
    fn: (inputs) => { const onlem = num(inputs, "maliyet_onlem"); if (onlem <= 0) return 0; return nonNegative(assertFinite(num(inputs, "maliyet_failure") / onlem)); },
  },
  {
    id: "industrial.fmea_3",
    family: "industrial",
    label: "FMEA — max RPN (10×10×10)",
    fn: () => 1000,
  },
  {
    id: "industrial.fmea_4",
    family: "industrial",
    label: "FMEA — oncelik sirasi (kritiklik)",
    fn: (inputs) => { const rpn = num(inputs, "RPN_ortalama"); const s = num(inputs, "ortalamaSiddet_S"); const o = num(inputs, "ortalamaOlusma_O"); const d = num(inputs, "ortalamaSaptama_D"); if (rpn >= 200) return 1; if (rpn >= 100) return 2; if (s >= 9 && o >= 7) return 1; if (rpn >= 50) return 3; return 4; },
  },
  {
    id: "industrial.fmea_5",
    family: "industrial",
    label: "FMEA — toplam hata maliyeti",
    fn: (inputs) => { return nonNegative(assertFinite(num(inputs, "maliyet_failure") * num(inputs, "prosesAdimiSayisi", 10) * (num(inputs, "ortalamaOlusma_O", 5) / 10))); },
  },
  {
    id: "industrial.fmea_6",
    family: "industrial",
    label: "FMEA — toplam onlem maliyeti",
    fn: (inputs) => { return nonNegative(assertFinite(num(inputs, "maliyet_onlem") * num(inputs, "prosesAdimiSayisi", 10))); },
  },
  {
    id: "industrial.fmea_3",
    family: "industrial",
    label: "FMEA — max RPN (10×10×10)",
    fn: () => 1000,
  },
  {
    id: "industrial.fmea_4",
    family: "industrial",
    label: "FMEA — priority order (criticality)",
    fn: (inputs) => { const rpn = num(inputs, "RPN_ortalama"); const s = num(inputs, "ortalamaSiddet_S"); const o = num(inputs, "ortalamaOlusma_O"); const d = num(inputs, "ortalamaSaptama_D"); if (rpn >= 200) return 1; if (rpn >= 100) return 2; if (s >= 9 && o >= 7) return 1; if (rpn >= 50) return 3; return 4; },
  },
  {
    id: "industrial.fmea_5",
    family: "industrial",
    label: "FMEA — total failure cost",
    fn: (inputs) => { return nonNegative(assertFinite(num(inputs, "maliyet_failure") * num(inputs, "prosesAdimiSayisi", 10) * (num(inputs, "ortalamaOlusma_O", 5) / 10))); },
  },
  {
    id: "industrial.fmea_6",
    family: "industrial",
    label: "FMEA — total prevention cost",
    fn: (inputs) => { return nonNegative(assertFinite(num(inputs, "maliyet_onlem", 0) * num(inputs, "prosesAdimiSayisi", 1))); },
  },
  // ── #184 DOE ──
  {
    id: "industrial.doe_0",
    family: "industrial",
    label: "DOE — toplam deney sayisi",
    fn: (inputs) => { const k = num(inputs, "faktorSayisi_k", 2); const seviye = num(inputs, "faktorSeviyesi", 0); const base = seviye === 0 ? 2 : 3; const r = num(inputs, "replikasyonSayisi", 1); const merkez = num(inputs, "merkezNoktaSayisi", 3); const blok = num(inputs, "blokSayisi", 1); return nonNegative(assertFinite(Math.pow(base, k) * r + merkez + blok)); },
  },
  // ── #185 RELIABILITY BLOCK ──
  {
    id: "industrial.reliability_0",
    family: "industrial",
    label: "Reliability — sistem MTBF (seri)",
    fn: (inputs) => { const mtbf = num(inputs, "bilesinMTBF_ortalama", 10000); const n = num(inputs, "bilesenSayisi", 5); return nonNegative(assertFinite(mtbf / n)); },
  },
  {
    id: "industrial.reliability_1",
    family: "industrial",
    label: "Reliability — kullanilabilirlik A",
    fn: (inputs) => { const mtbf = num(inputs, "sistemMTBF"); const mttr = num(inputs, "bilesinMTTR_ortalama", 4); if (mtbf + mttr <= 0) return 0; return nonNegative(assertFinite(mtbf / (mtbf + mttr) * 100)); },
  },
  {
    id: "industrial.reliability_2",
    family: "industrial",
    label: "Reliability — R(t) seri",
    fn: (inputs) => { const mtbf = num(inputs, "sistemMTBF"); const t = num(inputs, "calismaSuresi_t", 8760); if (mtbf <= 0) return 0; return nonNegative(assertFinite(Math.exp(-t / mtbf) * 100)); },
  },
  {
    id: "industrial.reliability_3",
    family: "industrial",
    label: "Reliability — R(t) paralel",
    fn: (inputs) => { const n = num(inputs, "bilesenSayisi", 2); const mtbf = num(inputs, "bilesinMTBF_ortalama", 10000); const t = num(inputs, "calismaSuresi_t", 8760); if (mtbf <= 0) return 0; const Ri = Math.exp(-t / mtbf); return nonNegative(assertFinite((1 - Math.pow(1 - Ri, n)) * 100)); },
  },
  // ── #186 NIOSH LIFTING ──
  {
    id: "industrial.niosh_0",
    family: "industrial",
    label: "NIOSH — HM (horizontal)",
    fn: (inputs) => { const H = num(inputs, "yatayMesafe_H", 25); if (H <= 0) return 0; return assertFinite(25 / H); },
  },
  {
    id: "industrial.niosh_1",
    family: "industrial",
    label: "NIOSH — VM (vertical)",
    fn: (inputs) => { const V = num(inputs, "dikeyBaslangic_V", 75); return assertFinite(1 - 0.003 * Math.abs(V - 75)); },
  },
  {
    id: "industrial.niosh_2",
    family: "industrial",
    label: "NIOSH — DM (distance)",
    fn: (inputs) => { const D = num(inputs, "tasimaMesafesi", 25); return assertFinite(0.82 + 4.5 / D); },
  },
  {
    id: "industrial.niosh_3",
    family: "industrial",
    label: "NIOSH — FM (frequency)",
    fn: (inputs) => { const F = num(inputs, "frekans_F", 1); const sure = num(inputs, "sureDakika", 60); if (F <= 0) return 1; if (sure <= 60) return Math.min(1, 0.94 - 0.05 * F); return Math.min(1, 0.84 - 0.05 * F); },
  },
  {
    id: "industrial.niosh_4",
    family: "industrial",
    label: "NIOSH — RWL",
    fn: (inputs) => { const LC = 23; const HM = num(inputs, "HM"); const VM = num(inputs, "VM"); const DM = num(inputs, "DM"); const FM = num(inputs, "FM"); const CM = num(inputs, "kavramaKalitesi", 0) === 0 ? 1 : 0.9; const AM = num(inputs, "bedenBolgesi", 0) === 0 ? 1 : 0.8; return nonNegative(assertFinite(LC * HM * VM * DM * FM * CM * AM)); },
  },
  {
    id: "industrial.niosh_5",
    family: "industrial",
    label: "NIOSH — LI",
    fn: (inputs) => { const L = num(inputs, "yukAgirligi_L"); const RWL = num(inputs, "recommendedWeightLimit_RWL"); if (RWL <= 0) return 0; return nonNegative(assertFinite(L / RWL)); },
  },
  // ── #187 REBA ──
  {
    id: "industrial.reba_0",
    family: "industrial",
    label: "REBA — Grup A toplam",
    fn: (inputs) => { const govde = num(inputs, "govdeSkoru"); const boyun = num(inputs, "boyunSkoru"); const bacak = num(inputs, "bacakSkoru"); return nonNegative(assertFinite(govde + boyun + bacak)); },
  },
  {
    id: "industrial.reba_1",
    family: "industrial",
    label: "REBA — Grup A yuk puani",
    fn: (inputs) => { const yuk = num(inputs, "yuk_kg"); if (yuk > 10) return 2; if (yuk > 5) return 1; return 0; },
  },
  {
    id: "industrial.reba_2",
    family: "industrial",
    label: "REBA — Grup B toplam",
    fn: (inputs) => { return nonNegative(assertFinite(num(inputs, "kolUstSkoru") + num(inputs, "kolAltSkoru") + num(inputs, "elBilegiSkoru"))); },
  },
  {
    id: "industrial.reba_3",
    family: "industrial",
    label: "REBA — Grup B kavrama puani",
    fn: (inputs) => { const tip = num(inputs, "yukTutmaTipi", 0); return tip === 0 ? 2 : tip === 1 ? 1 : 3; },
  },
  {
    id: "industrial.reba_4",
    family: "industrial",
    label: "REBA — nihai skor",
    fn: (inputs) => { const A = num(inputs, "GrupA_Toplam"); const B = num(inputs, "GrupB_Toplam"); const aktivite = num(inputs, "aktiviteTipi", 0); const scoreA = A <= 2 ? 1 : A <= 4 ? 2 : A <= 6 ? 3 : A <= 8 ? 4 : 5; const scoreB = B <= 2 ? 1 : B <= 4 ? 2 : B <= 6 ? 3 : B <= 8 ? 4 : 5; const tableC = [1,2,3,4,6,7,8,9,10,11,12][Math.min(scoreA + scoreB, 10)]; const actPenalty = aktivite === 1 ? 2 : aktivite === 2 ? 1 : 0; return nonNegative(assertFinite(tableC + actPenalty)); },
  },
  // ── #188 RCM ──
  {
    id: "industrial.rcm_0",
    family: "industrial",
    label: "RCM — plansiz durus sikligi",
    fn: (inputs) => { return nonNegative(assertFinite(365 / num(inputs, "MTBF_gun", 90))); },
  },
  {
    id: "industrial.rcm_1",
    family: "industrial",
    label: "RCM — plansiz durus maliyeti/yil",
    fn: (inputs) => { return nonNegative(assertFinite(num(inputs, "plansizDurusSikligi") * num(inputs, "plansizDurusMaliyeti", 5000))); },
  },
  {
    id: "industrial.rcm_2",
    family: "industrial",
    label: "RCM — koruyucu bakim maliyeti/yil",
    fn: (inputs) => { const siklik = num(inputs, "koruyucuBakimSikligi", 30); if (siklik <= 0) return 0; return nonNegative(assertFinite(365 / siklik * num(inputs, "koruyucuBakimMaliyeti", 1000))); },
  },
  {
    id: "industrial.rcm_3",
    family: "industrial",
    label: "RCM — durumsal bakim maliyeti/yil",
    fn: (inputs) => { const siklik = num(inputs, "durumsalBakimSikligi", 15); if (siklik <= 0) return 0; return nonNegative(assertFinite(365 / siklik * num(inputs, "durumsalBakimMaliyeti", 800))); },
  },
  // ── #189 PARETO / RCA ──
  {
    id: "industrial.pareto_0",
    family: "industrial",
    label: "Pareto — category sayisi",
    fn: (inputs) => { return nonNegative(assertFinite(num(inputs, "kategoriSayisi"))); },
  },
  {
    id: "industrial.pareto_1",
    family: "industrial",
    label: "Pareto — total loss",
    fn: (inputs) => { return nonNegative(assertFinite(num(inputs, "maliyetler_toplam"))); },
  },
  // ── #190 VAP ──
  {
    id: "industrial.vap_0",
    family: "industrial",
    label: "VAP — VAR (VA)",
    fn: (inputs) => { const TCT = num(inputs, "toplamCevrimSuresi_TCT"); if (TCT <= 0) return 0; return nonNegative(assertFinite(num(inputs, "katmaDegerliSure_VA") / TCT * 100)); },
  },
  {
    id: "industrial.vap_1",
    family: "industrial",
    label: "VAP — VAR (NVA)",
    fn: (inputs) => { const TCT = num(inputs, "toplamCevrimSuresi_TCT"); if (TCT <= 0) return 0; return nonNegative(assertFinite(num(inputs, "zorunluKatmaDegerliSure_NVA") / TCT * 100)); },
  },
  {
    id: "industrial.vap_2",
    family: "industrial",
    label: "VAP — VAR (waste)",
    fn: (inputs) => { const TCT = num(inputs, "toplamCevrimSuresi_TCT"); if (TCT <= 0) return 0; return nonNegative(assertFinite(num(inputs, "kayipSure_W") / TCT * 100)); },
  },
  {
    id: "industrial.vap_3",
    family: "industrial",
    label: "VAP — VA maliyet",
    fn: (inputs) => { return nonNegative(assertFinite(num(inputs, "maliyet_C") * num(inputs, "VAR_VA", 10) / 100)); },
  },
  // ── #191 KAIZEN EVENT ──
  {
    id: "industrial.kaizen_0",
    family: "industrial",
    label: "Kaizen — toplam event maliyeti",
    fn: (inputs) => { const ekip = num(inputs, "calisanSayisi", 5) * num(inputs, "eventSuresi", 5) * 8 * num(inputs, "ekipUyesiSaatlikMaliyet", 25) + num(inputs, "malzemeMaliyeti") + num(inputs, "disDanismanMaliyeti"); return nonNegative(assertFinite(ekip)); },
  },
  {
    id: "industrial.kaizen_1",
    family: "industrial",
    label: "Kaizen — dongu suresi iyilesme %",
    fn: (inputs) => { const mevcut = num(inputs, "mevcutDonguSuresi"); if (mevcut <= 0) return 0; return nonNegative(assertFinite((mevcut - num(inputs, "yeniDonguSuresi")) / mevcut * 100)); },
  },
  {
    id: "industrial.kaizen_2",
    family: "industrial",
    label: "Kaizen — toplam yillik tasarruf",
    fn: (inputs) => { return nonNegative(assertFinite(num(inputs, "iscilikTasarrufu_yil") + num(inputs, "malzemeTasarrufu_yil") + num(inputs, "enerjiTasarrufu_yil"))); },
  },
  {
    id: "industrial.kaizen_3",
    family: "industrial",
    label: "Kaizen — ROI",
    fn: (inputs) => { const eventMaliyet = num(inputs, "toplamEventMaliyeti"); if (eventMaliyet <= 0) return 0; return nonNegative(assertFinite(num(inputs, "toplamYillikTasarruf") / eventMaliyet * 100)); },
  },
  // ── #192 VSM ──
  {
    id: "industrial.vsm_0",
    family: "industrial",
    label: "VSM — PCT",
    fn: (inputs) => { return nonNegative(assertFinite(num(inputs, "toplamKatmaDegerliSure") + num(inputs, "toplamBeklemeSure") + num(inputs, "toplamTasimaSure") + num(inputs, "toplamKontrolSure"))); },
  },
  {
    id: "industrial.vsm_1",
    family: "industrial",
    label: "VSM — PCE",
    fn: (inputs) => { const PCT = num(inputs, "toplamGecenSure_PCT"); if (PCT <= 0) return 0; return nonNegative(assertFinite(num(inputs, "toplamKatmaDegerliSure") / PCT * 100)); },
  },
  {
    id: "industrial.vsm_2",
    family: "industrial",
    label: "VSM — takt time",
    fn: (inputs) => { const talep = num(inputs, "musteriTalepAdeti"); if (talep <= 0) return 0; return nonNegative(assertFinite(num(inputs, "calismaSuresi_gun", 450) * num(inputs, "vardiyaSayisi", 1) / talep)); },
  },
  // ── #193 5S AUDIT ──
  {
    id: "industrial.fives_audit_0",
    family: "industrial",
    label: "5S — sort yuzde",
    fn: (inputs) => { const max = num(inputs, "sort_max", 25); if (max <= 0) return 0; return nonNegative(assertFinite(num(inputs, "sort_puan") / max * 100)); },
  },
  {
    id: "industrial.fives_audit_1",
    family: "industrial",
    label: "5S — setInOrder yuzde",
    fn: (inputs) => { const max = num(inputs, "setInOrder_max", 25); if (max <= 0) return 0; return nonNegative(assertFinite(num(inputs, "setInOrder_puan") / max * 100)); },
  },
  {
    id: "industrial.fives_audit_2",
    family: "industrial",
    label: "5S — shine yuzde",
    fn: (inputs) => { const max = num(inputs, "shine_max", 25); if (max <= 0) return 0; return nonNegative(assertFinite(num(inputs, "shine_puan") / max * 100)); },
  },
  {
    id: "industrial.fives_audit_3",
    family: "industrial",
    label: "5S — standardize yuzde",
    fn: (inputs) => { const max = num(inputs, "standardize_max", 25); if (max <= 0) return 0; return nonNegative(assertFinite(num(inputs, "standardize_puan") / max * 100)); },
  },
  {
    id: "industrial.fives_audit_4",
    family: "industrial",
    label: "5S — sustain yuzde",
    fn: (inputs) => { const max = num(inputs, "sustain_max", 25); if (max <= 0) return 0; return nonNegative(assertFinite(num(inputs, "sustain_puan") / max * 100)); },
  },
  {
    id: "industrial.fives_audit_5",
    family: "industrial",
    label: "5S — toplam puan",
    fn: (inputs) => { return nonNegative(assertFinite(num(inputs, "sort_puan") + num(inputs, "setInOrder_puan") + num(inputs, "shine_puan") + num(inputs, "standardize_puan") + num(inputs, "sustain_puan"))); },
  },
  {
    id: "industrial.fives_audit_6",
    family: "industrial",
    label: "5S — genel skor %",
    fn: (inputs) => { const max = num(inputs, "toplamMaxPuan", 125); if (max <= 0) return 0; return nonNegative(assertFinite(num(inputs, "toplamPuan") / max * 100)); },
  },
  {
    id: "industrial.fives_audit_7",
    family: "industrial",
    label: "5S — not harf",
    fn: (inputs) => { const skor = num(inputs, "genelSkor_yuzde"); if (skor >= 90) return 5; if (skor >= 80) return 4; if (skor >= 70) return 3; if (skor >= 60) return 2; return 1; },
  },
  {
    id: "industrial.fives_audit_8",
    family: "industrial",
    label: "5S — egitim maliyeti",
    fn: (inputs) => { return nonNegative(assertFinite(num(inputs, "toplamCalisanSayisi") * num(inputs, "egitimSaati_calisan") * num(inputs, "egitimMaliyeti_saat"))); },
  },
  // ── TOOLS #183-#193: INDUSTRIAL FORMULAS (FMEA through 5S) ──
  {
    id: "industrial.fmea_risk",
    family: "measurement",
    label: "FMEA RPN — Risk Priority Number",
    fn: (inputs) => { return nonNegative(assertFinite(num(inputs, "severityS") * num(inputs, "occurrenceO") * num(inputs, "detectionD"))); },
  },
  {
    id: "industrial.fmea_max",
    family: "measurement",
    label: "FMEA — Max Possible RPN",
    fn: () => { return 1000; },
  },
  {
    id: "industrial.fmea_priority",
    family: "measurement",
    label: "FMEA — Priority Order",
    fn: (inputs) => { 
      const rpn = nonNegative(assertFinite(num(inputs, "severityS") * num(inputs, "occurrenceO") * num(inputs, "detectionD")));
      if (rpn >= 200) return 1; 
      if (rpn >= 100) return 2; 
      if (rpn >= 50) return 3; 
      return 4; 
    },
  },
  {
    id: "industrial.fmea_failure_cost",
    family: "measurement",
    label: "FMEA — Failure Cost Exposure",
    fn: (inputs) => { return nonNegative(assertFinite(num(inputs, "maliyet_failure", 0) * num(inputs, "prosesAdimiSayisi", 1) * (num(inputs, "occurrenceO") / 10))); },
  },
  {
    id: "industrial.fmea_prevention_cost",
    family: "measurement",
    label: "FMEA — Total Prevention Cost",
    fn: (inputs) => { return nonNegative(assertFinite(num(inputs, "maliyet_onlem", 0) * num(inputs, "prosesAdimiSayisi", 1))); },
  },
  {
    id: "industrial.fmea_recommendation",
    family: "measurement",
    label: "FMEA — Resolution Recommendation",
    fn: (inputs) => { 
      const rpn = nonNegative(assertFinite(num(inputs, "severityS") * num(inputs, "occurrenceO") * num(inputs, "detectionD")));
      if (rpn >= 200) return 4; 
      if (rpn >= 100) return 3; 
      if (rpn >= 50) return 2; 
      return 1; 
    },
  },
  {
    id: "industrial.doe_factorial",
    family: "measurement",
    label: "DOE — Factorial Design Total Runs",
    fn: (inputs) => { const k = num(inputs, "factorCount_k", 3); const r = num(inputs, "replications", 1); const center = num(inputs, "centerPoints", 3); const blocks = num(inputs, "blockCount", 1); return nonNegative(assertFinite(Math.pow(2, k) * r + center + blocks)); },
  },
  {
    id: "industrial.reliability_block",
    family: "measurement",
    label: "RBD — System MTBF",
    fn: (inputs) => { const mtbf = num(inputs, "avgMTBF", 10000); const n = num(inputs, "componentCount", 5); return nonNegative(assertFinite(mtbf / n)); },
  },
  {
    id: "industrial.niosh_lifting",
    family: "measurement",
    label: "NIOSH — Recommended Weight Limit",
    fn: (inputs) => { return nonNegative(assertFinite(23)); },
  },
  {
    id: "industrial.reba_assessment",
    family: "measurement",
    label: "REBA — Final Assessment Score",
    fn: (inputs) => { return nonNegative(assertFinite(num(inputs, "trunkScore", 3) + num(inputs, "neckScore", 2) + num(inputs, "legsScore", 2))); },
  },
  {
    id: "industrial.rcm_decision",
    family: "cost",
    label: "RCM — Total Maintenance Cost",
    fn: (inputs) => { const freq = 365 / Math.max(num(inputs, "MTBF_days", 90), 1); return nonNegative(assertFinite(freq * num(inputs, "repairCost", 5000))); },
  },
  {
    id: "industrial.pareto_rca",
    family: "measurement",
    label: "Pareto — Cumulative 80% Threshold",
    fn: (inputs) => { return nonNegative(assertFinite(80)); },
  },
  {
    id: "industrial.vap_ratio",
    family: "measurement",
    label: "VAP — Value-Added Ratio",
    fn: (inputs) => { const va = num(inputs, "vaTime_min", 15); const tct = num(inputs, "totalCycleTime_min", 100); return tct > 0 ? assertFinite((va / tct) * 100) : 0; },
  },
  {
    id: "industrial.kaizen_event",
    family: "cost",
    label: "Kaizen — Total Event Investment",
    fn: (inputs) => { const labor = num(inputs, "teamCount", 8) * num(inputs, "eventDays", 5) * 8 * num(inputs, "hourlyCost", 25); return nonNegative(assertFinite(labor + num(inputs, "materialCost", 2000) + num(inputs, "consultantCost", 0))); },
  },
  {
    id: "industrial.vsm_metrics",
    family: "measurement",
    label: "VSM — Process Cycle Efficiency",
    fn: (inputs) => { const va = num(inputs, "vaTime_min", 20); const total = va + num(inputs, "waitTime_min", 120) + num(inputs, "transportTime_min", 30) + num(inputs, "inspectionTime_min", 15); return total > 0 ? assertFinite((va / total) * 100) : 0; },
  },
  {
    id: "industrial.ss_audit",
    family: "measurement",
    label: "5S — Overall Score",
    fn: (inputs) => { const total = num(inputs, "sortScore", 18) + num(inputs, "seitonScore", 16) + num(inputs, "seisoScore", 20) + num(inputs, "seiketsuScore", 14) + num(inputs, "shitsukeScore", 12); const maxTotal = num(inputs, "sortMax", 25) + num(inputs, "seitonMax", 25) + num(inputs, "seisoMax", 25) + num(inputs, "seiketsuMax", 25) + num(inputs, "shitsukeMax", 25); return maxTotal > 0 ? assertFinite((total / maxTotal) * 100) : 0; },
  },

  // ── #163-172: COMPRESSOR, CUTTING, EVAP, CONDENSER, PAD MEDIA, F-GAS, WATER, SMOKE, NATURAL VENT, COMPOUND INTEREST ──
  {
    id: "industrial.compressor_power",
    family: "measurement",
    label: "Compressor — Combined Power & Air Flow",
    fn: (inputs) => { const Q = num(inputs, "airFlowRate", 40); const P2 = num(inputs, "operatingPressure", 8); const P1 = num(inputs, "inletPressure", 1.013); const T1 = num(inputs, "inletTemperature", 25); const n_over_n1 = num(inputs, "polytropicExponent", 1.3) / (num(inputs, "polytropicExponent", 1.3) - 1); const eta = num(inputs, "isentropicEfficiency", 75) / 100; const z = num(inputs, "stageCount", 1); const pr = Math.pow((P2 + P1) / P1, (num(inputs, "polytropicExponent", 1.3) - 1) / (num(inputs, "polytropicExponent", 1.3) * z)); const power_kW = n_over_n1 * Q / 60 * P1 * 1e5 * (pr - 1) / (eta * 1000); return nonNegative(assertFinite(power_kW)); },
  },
  {
    id: "industrial.cutting_power",
    family: "measurement",
    label: "Cutting — Combined Cutting Power",
    fn: (inputs) => { const Dc = num(inputs, "toolDiameter", 50); const Vc = num(inputs, "cuttingSpeed", 200); const fz = num(inputs, "feedPerTooth", 0.1); const z = num(inputs, "toothCount", 4); const ap = num(inputs, "depthOfCut", 2); const ae = num(inputs, "cuttingWidth", 40); const kc = num(inputs, "specificCuttingForce", 2500); const eta = num(inputs, "machineEfficiency", 80) / 100; const n = 1000 * Vc / (Math.PI * Dc); const Vf = fz * z * n; const Fc = kc * ap * fz * (ae/Dc) * z; const Tc = Fc * Dc / 2000; const Pc = Fc * Vc / 60000; const Pm = Pc / eta; return nonNegative(assertFinite(Pm)); },
  },
  {
    id: "industrial.evaporative_cooling",
    family: "measurement",
    label: "Evaporative Cooling — Combined Capacity",
    fn: (inputs) => { const L = num(inputs, "areaLength", 20); const W = num(inputs, "areaWidth", 15); const H = num(inputs, "ceilingHeight", 4); const ACH = num(inputs, "achValue", 30); const volume = L * W * H; const totalFlow = volume * ACH; const Tk = num(inputs, "outdoorDryBulb", 38); const Ty = num(inputs, "outdoorWetBulb", 22); const eta = num(inputs, "padEfficiency", 80) / 100; const Tout = Tk - eta * (Tk - Ty); const cooling_kW = (totalFlow / 3600) * 1.2 * (Tk - Tout); return nonNegative(assertFinite(cooling_kW)); },
  },
  {
    id: "industrial.condenser_precooling",
    family: "cost",
    label: "Condenser Precooling — Savings",
    fn: (inputs) => { const cap = num(inputs, "chillerCapacity", 100); const unit = num(inputs, "capacityUnit", 1); const cap_kW = cap * (unit === 2 ? 3.517 : 1); const cop = num(inputs, "existingCOP", 3.5); const Tg = num(inputs, "condenserInletTemp", 45); const Ty = num(inputs, "wetBulbTemp", 24); const eta = num(inputs, "precoolEfficiency", 70) / 100; const T_new = Tg - eta * (Tg - Ty); const cop_new = cop * (1 + (Tg - T_new) * 0.03); const P_old = cap_kW / cop; const P_new = cap_kW / cop_new; const savings = (P_old - P_new) * num(inputs, "annualOperatingHours", 4000); const cost_savings = savings * num(inputs, "electricityTariff", 0.12); const net = cost_savings - num(inputs, "precoolOpex", 500); return nonNegative(assertFinite(net)); },
  },
  {
    id: "industrial.pad_media_psychrometric",
    family: "measurement",
    label: "Pad Media — Psychrometric",
    fn: (inputs) => { const t = num(inputs, "padThickness", 150); const V = num(inputs, "faceVelocity", 2); const A = num(inputs, "padArea", 10); const Tk = num(inputs, "inletDryBulb", 38); const Ty = num(inputs, "inletWetBulb", 22); const Tk_Ty = Tk - Ty; const eta_sat = 1 - Math.exp(-0.6 * (t/100) / Math.pow(V, 0.5)); const delta_T = eta_sat * Tk_Ty; const flow = V * A * 3600; const cooling = flow * 1.2 * delta_T / 3600; return nonNegative(assertFinite(cooling)); },
  },
  {
    id: "industrial.fgas_leak",
    family: "energy",
    label: "F-Gas Leak — Compliance Cost",
    fn: (inputs) => { const gwp = num(inputs, "gwpValue", 2088); const charge = num(inputs, "refrigerantCharge", 50); const count = num(inputs, "unitCount", 5); const leakRate = num(inputs, "annualLeakRate", 10) / 100; const freq = num(inputs, "leakTestFrequency", 12); const testCost = num(inputs, "testUnitCost", 150); const refPrice = num(inputs, "refrigerantUnitPrice", 25); const total_charge = charge * count; const leak_kg = total_charge * leakRate; const leak_cost = leak_kg * refPrice; const test_annual = (freq / 12) * count * testCost; const total = test_annual + leak_cost; return nonNegative(assertFinite(total)); },
  },
  {
    id: "industrial.water_footprint",
    family: "energy",
    label: "Water Footprint — Total",
    fn: (inputs) => { const blue = num(inputs, "blueWaterConsumption", 1000); const green = num(inputs, "greenWaterConsumption", 500); const grey = num(inputs, "greyWaterVolume", 300); const prod = num(inputs, "productionVolume", 1000); const total = blue + green + grey; const unit = prod > 0 ? total / prod : 0; return nonNegative(assertFinite(unit)); },
  },
  {
    id: "industrial.smoke_exhaust_shev",
    family: "measurement",
    label: "Smoke Exhaust SHEV — Required Vent Area",
    fn: (inputs) => { const Cw = num(inputs, "ventFlowCoefficient", 0.6); const Af = num(inputs, "ceilingArea", 1000); const dz = num(inputs, "smokeLayerDepth", 2); const Tk = num(inputs, "outdoorTemp", 35); const Ti = num(inputs, "indoorTemp", 20); const inlet = num(inputs, "inletArea", 0); const Vw = num(inputs, "windSpeed", 5); const A_vent = Cw * 0.1 * Af + 0.01 * Af; return nonNegative(assertFinite(A_vent)); },
  },
  {
    id: "industrial.natural_ventilation",
    family: "measurement",
    label: "Natural Ventilation — ACH-based",
    fn: (inputs) => { const L = num(inputs, "areaLength", 20); const W = num(inputs, "areaWidth", 15); const H = num(inputs, "ceilingHeight", 4); const Ti = num(inputs, "indoorTemperature", 25); const To = num(inputs, "outdoorTemperature", 35); const ACH = num(inputs, "targetACH", 10); const Cd = num(inputs, "ventDischargeCoefficient", 0.65); const stack = num(inputs, "stackHeight", 5); const vol = L * W * H; const flow = vol * ACH / 3600; const dT = Math.abs(Ti - To); const A_vent = dT > 0 ? flow / (Cd * Math.sqrt(2 * 9.81 * stack * dT / (273 + To))) : vol * 0.001; return nonNegative(assertFinite(A_vent)); },
  },
  {
    id: "industrial.compound_interest",
    family: "finance",
    label: "Compound Interest — Future Value",
    fn: (inputs) => { const P = num(inputs, "initialPrincipal", 10000); const PMT = num(inputs, "monthlyContribution", 1000); const r = num(inputs, "annualRate", 8) / 100; const n = num(inputs, "compoundingFrequency", 12); const t = num(inputs, "investmentPeriod", 10); const r_n = r / n; const nt = n * t; const fv = P * Math.pow(1 + r_n, nt) + PMT * ((Math.pow(1 + r_n, nt) - 1) / r_n); const infl = num(inputs, "inflationRate", 3) / 100; const tax = num(inputs, "taxRate", 0) / 100; const fv_real = fv * (1 - tax) / Math.pow(1 + infl, t); return nonNegative(assertFinite(fv_real)); },
  },
  // ── #173-180: LIVING WAGE, PANEL RADIATOR, UNDERFLOOR, SOLAR, EPQ, KANBAN, LITTLES LAW, MILK RUN ──
  {
    id: "industrial.living_wage",
    family: "cost",
    label: "Living Wage — Net Ucret",
    fn: (inputs) => { const brut = num(inputs, "brUcret_Aylik", 30000); const mesaiSaat = num(inputs, "fazlaMesaiSaat_Aylik", 0); const mesaiKat = num(inputs, "fazlaMesaiKatsayisi", 1.5); const sgk = num(inputs, "SGK_isverenOrani", 20.5) / 100; const issizlik = num(inputs, "issizlikFonuOrani", 2) / 100; const damga = num(inputs, "damgaVergiOrani", 0.759) / 100; const gelirDilim = num(inputs, "gelirVergiDilimi", 15) / 100; const agi = num(inputs, "AGI_tutari", 0); const yemek = num(inputs, "yemekYardimi_Gunluk", 0); const yol = num(inputs, "yolYardimi_Gunluk", 0); const gun = num(inputs, "calismaGunu_Ay", 22); const mesaiUcret = (brut / 225) * mesaiSaat * mesaiKat; const toplamBrut = brut + mesaiUcret; const sgkIsci = toplamBrut * 0.14; const issizlikIsci = toplamBrut * 0.01; const gelirMatrah = toplamBrut - sgkIsci - issizlikIsci; const gelirVergi = gelirMatrah * gelirDilim; const damgaVergi = toplamBrut * damga; const kesinti = sgkIsci + issizlikIsci + gelirVergi + damgaVergi; const net = toplamBrut - kesinti + agi + (yemek + yol) * gun; return nonNegative(assertFinite(net)); },
  },
  {
    id: "industrial.panel_radiator",
    family: "measurement",
    label: "Panel Radiator — Isi Ihtiyaci",
    fn: (inputs) => { const U = num(inputs, "odaUzunlugu", 5); const G = num(inputs, "odaGenisligi", 4); const H = num(inputs, "odaYuksekligi", 2.7); const Ti = num(inputs, "hedefSicaklik_Ti", 22); const To = num(inputs, "disSicaklik_To", -3); const izo = num(inputs, "izolasyonSeviyesi", 1); const cam = num(inputs, "camTipi", 1); const camOran = num(inputs, "camAlani_Orani", 20) / 100; const kisi = num(inputs, "kisiSayisi", 2); const ayd = num(inputs, "aydinlatmaW_m2", 10); const dT = Ti - To; const duvarAlani = (U + G) * 2 * H; const camAlani = duvarAlani * camOran; const duvarU = izo === 1 ? 0.6 : izo === 2 ? 0.8 : 1.2; const camU = cam === 1 ? 1.4 : cam === 2 ? 2.7 : 3.5; const iletim = duvarU * (duvarAlani - camAlani) * dT + camU * camAlani * dT; const infiltrasyon = 0.34 * (U * G * H) * 0.5 * dT; const kisiKazanc = kisi * 80; const aydKazanc = ayd * (U * G); const netIsi = iletim + infiltrasyon - kisiKazanc - aydKazanc; return nonNegative(assertFinite(Math.max(netIsi, 0))); },
  },
  {
    id: "industrial.underfloor_heating",
    family: "measurement",
    label: "Underfloor Heating — Isi Gucu",
    fn: (inputs) => { const U = num(inputs, "alanUzunlugu", 8); const G = num(inputs, "alanGenisligi", 6); const Ti = num(inputs, "odaSicakligi_Ti", 22); const aralik = num(inputs, "serpantinAraligi_cm", 15); const zemin = num(inputs, "zeminTipi", 1); const Tg = num(inputs, "isletimSicakligi_gidis", 45); const Td = num(inputs, "donusSicakligi", 35); const cap = num(inputs, "boruDisCap_mm", 16); const alan = U * G; const Tm = (Tg + Td) / 2; const q = zemin === 1 ? 8.3 * (Tm - Ti) * 1.1 : 7.5 * (Tm - Ti); const guc = alan * q / 1000; return nonNegative(assertFinite(guc)); },
  },
  {
    id: "industrial.solar_collector",
    family: "measurement",
    label: "Solar Collector — Kolektor Alani",
    fn: (inputs) => { const kisi = num(inputs, "kullaniciSayisi", 4); const gunlukSu = num(inputs, "gunlukKullanim_su_L_kisi", 50); const Tc = num(inputs, "sogukSuSicakligi_Tc", 10); const Tg = num(inputs, "sicakSuHedef_Tg", 60); const eta = num(inputs, "kolektorVerimi_η_kol", 70) / 100; const gunes = num(inputs, "guneslenmeSuresi_saat", 5); const I = num(inputs, "gunesIsinimiGunluk_Wm2", 600); const energy_kWh = kisi * gunlukSu * 4.186 * (Tg - Tc) / 3600; const alan = energy_kWh * 1000 / (eta * I * gunes / 1000); return nonNegative(assertFinite(alan)); },
  },
  {
    id: "industrial.epq",
    family: "cost",
    label: "EPQ — Economic Production Quantity",
    fn: (inputs) => { const D = num(inputs, "yillikTalep_D", 10000); const S = num(inputs, "hazirlikMaliyeti_S", 500); const H = num(inputs, "birimStokTutmaMaliyeti_H", 5); const p = num(inputs, "gunlukUretimHizi_p", 100); const d = num(inputs, "gunlukTalepHizi_d", 40); const gun = num(inputs, "calismaGunu_yil", 250); const epq = Math.sqrt((2 * D * S) / (H * (1 - d/p))); return nonNegative(assertFinite(epq)); },
  },
  {
    id: "industrial.kanban",
    family: "measurement",
    label: "Kanban — Card Count",
    fn: (inputs) => { const d = num(inputs, "gunlukTalep_d", 200); const LT = num(inputs, "tedarikSuresi_LT", 3); const k = num(inputs, "guvenlikStoguFaktoru_k", 1.5); const q = num(inputs, "kutuKapasitesi_q", 20); const N = Math.ceil((d * LT * k) / q); return nonNegative(assertFinite(N)); },
  },
  {
    id: "industrial.littles_law",
    family: "measurement",
    label: "Little's Law — Cycle Time",
    fn: (inputs) => { const WIP = num(inputs, "wip_miktar", 100); const TH = num(inputs, "cikisHizi", 20); const CT = num(inputs, "cevrimSuresi_CT", 0); if (CT > 0) { return nonNegative(assertFinite(WIP / CT)); } if (TH > 0) { return nonNegative(assertFinite(WIP / TH)); } const WIP2 = num(inputs, "wip_miktar", 100); return nonNegative(assertFinite(WIP2)); },
  },
  {
    id: "industrial.milk_run",
    family: "cost",
    label: "Milk Run — Daily Cost",
    fn: (inputs) => { const n = num(inputs, "tedarikciSayisi", 5); const d = num(inputs, "tedarikciMesafe_ortalama", 50); const t = num(inputs, "turSayisi_gunluk", 2); const kmCost = num(inputs, "arabaMaliyeti_km", 5); const driver = num(inputs, "surucuSaatUcreti", 200); const loading = num(inputs, "yuklemeBosaltmaDk", 30); const wait = num(inputs, "beklemeSuresiDk", 15); const speed = num(inputs, "ortalamaHiz_kmh", 50); const totalDist = d * n * t; const driveTime = (totalDist / speed) * 60; const totalTime = driveTime + (loading + wait) * n * t; const fuel = totalDist * kmCost; const labor = (totalTime / 60) * driver; return nonNegative(assertFinite(fuel + labor)); },
  },
  // ── HYDRAULIC CYLINDER TONNAGE & POWER ──
  {
    id: "industrial.hydraulic_cylinder_tonnage_0",
    family: "industrial",
    label: "Hydraulic Cylinder Tonnage — push force (ton-f)",
    fn: (inputs) => {
      const D = num(inputs, "pistonDiameter_D", 63);
      const d = num(inputs, "rodDiameter_d", 36);
      const P = num(inputs, "systemPressure_P", 200);
      const n = num(inputs, "cylinderCount_n", 1);
      const η_v = num(inputs, "volumetricEfficiency_η_v", 95) / 100;
      const η_m = num(inputs, "mechanicalEfficiency_η_m", 95) / 100;
      const f = num(inputs, "frictionLossCoeff", 0.05);
      const A_push_m2 = (Math.PI * D * D) / 4e6;
      const P_Pa = P * 1e5;
      const F_push_N = P_Pa * A_push_m2 * η_m * (1 - f);
      const F_push_ton = F_push_N / 9806.65;
      return nonNegative(assertFinite(F_push_ton));
    },
  }
];
