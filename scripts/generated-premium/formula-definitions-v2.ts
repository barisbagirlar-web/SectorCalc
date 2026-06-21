// ═══════════════════════════════════════════════════════════════════════════
// USER-PROVIDED PREMIUM FORMULAS (140 tools, 992 formulas)
// Auto-generated — must match user's exact specs
// ═══════════════════════════════════════════════════════════════════════════

  // ── User formulas — append to FORMULA_DEFINITIONS ──

  // ── AI TOKEN MALİYET (5 formulas) ──
  {
    id: "user.ai_token_cost_0",
    family: "general",
    label: "AI TOKEN MALİYET — BasePromptCost",
    fn: (inputs) => {
    const promptTokens = num(inputs, "promptTokens");
    const promptPrice = num(inputs, "promptPrice");
    return nonNegative(assertFinite((promptTokens * promptPrice) / 1000000));
  },
  },
  {
    id: "user.ai_token_cost_1",
    family: "general",
    label: "AI TOKEN MALİYET — BaseCompletionCost",
    fn: (inputs) => {
    const completionTokens = num(inputs, "completionTokens");
    const completionPrice = num(inputs, "completionPrice");
    return nonNegative(assertFinite((completionTokens * completionPrice) / 1000000));
  },
  },
  {
    id: "user.ai_token_cost_2",
    family: "general",
    label: "AI TOKEN MALİYET — CacheReadCost",
    fn: (inputs) => {
    const cachedTokens = num(inputs, "cachedTokens");
    const cacheReadPrice = num(inputs, "cacheReadPrice");
    return nonNegative(assertFinite((cachedTokens * cacheReadPrice) / 1000000));
  },
  },
  {
    id: "user.ai_token_cost_3",
    family: "general",
    label: "AI TOKEN MALİYET — MonthlyProjection",
    fn: (inputs) => {
    const dailyBaseCost = num(inputs, "dailyBaseCost");
    const growthRate = num(inputs, "growthRate");
    return nonNegative(assertFinite((dailyBaseCost * 30) * (1 + growthRate)));
  },
  },
  {
    id: "user.ai_token_cost_4",
    family: "general",
    label: "AI TOKEN MALİYET — TCO",
    fn: (inputs) => {
    const monthlyProjection = num(inputs, "monthlyProjection");
    const infraOverhead = num(inputs, "infraOverhead");
    const fallbackCost = num(inputs, "fallbackCost");
    return nonNegative(assertFinite(monthlyProjection + infraOverhead + fallbackCost));
  },
  },

  // ── ALTI SİGMA PROJE ÖNCELİKLENDİRİCİ (6 formulas) ──
  {
    id: "user.six_sigma_project_prioritizer_0",
    family: "general",
    label: "ALTI SİGMA PROJE ÖNCELİKLENDİRİCİ — DPMO",
    fn: (inputs) => {
    const defects = num(inputs, "defects");
    const units = num(inputs, "units");
    const opportunities = num(inputs, "opportunities");
    return nonNegative(assertFinite((defects / (units * opportunities)) * 1000000));
  },
  },
  {
    id: "user.six_sigma_project_prioritizer_1",
    family: "general",
    label: "ALTI SİGMA PROJE ÖNCELİKLENDİRİCİ — Yield",
    fn: (inputs) => {
    const defects = num(inputs, "defects");
    const units = num(inputs, "units");
    const opportunities = num(inputs, "opportunities");
    return nonNegative(assertFinite(1 - (defects / (units * opportunities))));
  },
  },
  {
    id: "user.six_sigma_project_prioritizer_2",
    family: "general",
    label: "ALTI SİGMA PROJE ÖNCELİKLENDİRİCİ — Z_bench",
    fn: (inputs) => {
      // COMPLEX: Z_bench = NORMSINV(Yield)
      // Requires external implementation
      return 0;
    },
  },
  {
    id: "user.six_sigma_project_prioritizer_3",
    family: "general",
    label: "ALTI SİGMA PROJE ÖNCELİKLENDİRİCİ — SigmaLevel",
    fn: (inputs) => {
    const z = num(inputs, "z");
    const bench = num(inputs, "bench");
    return nonNegative(assertFinite(z_bench + 1.5));
  },
  },
  {
    id: "user.six_sigma_project_prioritizer_4",
    family: "general",
    label: "ALTI SİGMA PROJE ÖNCELİKLENDİRİCİ — COPQ",
    fn: (inputs) => {
    const internalFailure = num(inputs, "internalFailure");
    const externalFailure = num(inputs, "externalFailure");
    const appraisal = num(inputs, "appraisal");
    const prevention = num(inputs, "prevention");
    return nonNegative(assertFinite(internalFailure + externalFailure + appraisal + prevention));
  },
  },
  {
    id: "user.six_sigma_project_prioritizer_5",
    family: "general",
    label: "ALTI SİGMA PROJE ÖNCELİKLENDİRİCİ — ProjectScore",
    fn: (inputs) => {
    const cOPQ = num(inputs, "cOPQ");
    const recoveryProb = num(inputs, "recoveryProb");
    const sigmaGap = num(inputs, "sigmaGap");
    const strategicAlignment = num(inputs, "strategicAlignment");
    const ease = num(inputs, "ease");
    return nonNegative(assertFinite((cOPQ * recoveryProb * 0.35) + (sigmaGap * 0.25) + (strategicAlignment * 0.25) + (ease * 0.15)));
  },
  },

  // ── AQL SAMPLING RİSK & MALİYET (9 formulas) ──
  {
    id: "user.aql_sampling_risk_0",
    family: "general",
    label: "AQL SAMPLING RİSK & MALİYET — CodeLetter",
    fn: (inputs) => {
    const lookupCodeLetter = num(inputs, "lookupCodeLetter");
    const lotSize = num(inputs, "lotSize");
    const inspectionLevel = num(inputs, "inspectionLevel");
    return nonNegative(assertFinite(lookupCodeLetter(lotSize, inspectionLevel)));
  },
  },
  {
    id: "user.aql_sampling_risk_1",
    family: "general",
    label: "AQL SAMPLING RİSK & MALİYET — n",
    fn: (inputs) => {
    const sampleSize = num(inputs, "sampleSize");
    const codeLetter = num(inputs, "codeLetter");
    const aQL = num(inputs, "aQL");
    return nonNegative(assertFinite(sampleSize(codeLetter, aQL)));
  },
  },
  {
    id: "user.aql_sampling_risk_2",
    family: "general",
    label: "AQL SAMPLING RİSK & MALİYET — Ac",
    fn: (inputs) => {
    const acceptanceNumber = num(inputs, "acceptanceNumber");
    const codeLetter = num(inputs, "codeLetter");
    const aQL = num(inputs, "aQL");
    return nonNegative(assertFinite(acceptanceNumber(codeLetter, aQL)));
  },
  },
  {
    id: "user.aql_sampling_risk_3",
    family: "general",
    label: "AQL SAMPLING RİSK & MALİYET — Pa_producer",
    fn: (inputs) => {
      // COMPLEX: Pa_producer = BINOMDIST(Ac, n, p_AQL, TRUE)
      // Requires external implementation
      return 0;
    },
  },
  {
    id: "user.aql_sampling_risk_4",
    family: "general",
    label: "AQL SAMPLING RİSK & MALİYET — Alpha",
    fn: (inputs) => {
    const pa = num(inputs, "pa");
    const producer = num(inputs, "producer");
    return nonNegative(assertFinite(1 - pa_producer));
  },
  },
  {
    id: "user.aql_sampling_risk_5",
    family: "general",
    label: "AQL SAMPLING RİSK & MALİYET — Pa_consumer",
    fn: (inputs) => {
      // COMPLEX: Pa_consumer = BINOMDIST(Ac, n, p_LTPD, TRUE)
      // Requires external implementation
      return 0;
    },
  },
  {
    id: "user.aql_sampling_risk_6",
    family: "general",
    label: "AQL SAMPLING RİSK & MALİYET — Beta",
    fn: (inputs) => {
    const pa = num(inputs, "pa");
    const consumer = num(inputs, "consumer");
    return nonNegative(assertFinite(pa_consumer));
  },
  },
  {
    id: "user.aql_sampling_risk_7",
    family: "general",
    label: "AQL SAMPLING RİSK & MALİYET — ATI",
    fn: (inputs) => {
    const n = num(inputs, "n");
    const pa = num(inputs, "pa");
    return nonNegative(assertFinite(n + (1 - pa) * (n - n)));
  },
  },
  {
    id: "user.aql_sampling_risk_8",
    family: "general",
    label: "AQL SAMPLING RİSK & MALİYET — TotalRiskCost",
    fn: (inputs) => {
    const n = num(inputs, "n");
    const p = num(inputs, "p");
    const pa = num(inputs, "pa");
    const detectionRate = num(inputs, "detectionRate");
    const costPerDefect = num(inputs, "costPerDefect");
    return nonNegative(assertFinite((n * p * (1 - pa) * (1 - detectionRate)) * costPerDefect));
  },
  },

  // ── ARAÇ AMORTİSMANI (7 formulas) ──
  {
    id: "user.vehicle_depreciation_tco_0",
    family: "general",
    label: "ARAÇ AMORTİSMANI — SL_Annual",
    fn: (inputs) => {
    const cost = num(inputs, "cost");
    const salvageValue = num(inputs, "salvageValue");
    const usefulLife = num(inputs, "usefulLife");
    return nonNegative(assertFinite((cost - salvageValue) / usefulLife));
  },
  },
  {
    id: "user.vehicle_depreciation_tco_1",
    family: "general",
    label: "ARAÇ AMORTİSMANI — DB_Rate",
    fn: (inputs) => {
    const usefulLife = num(inputs, "usefulLife");
    return nonNegative(assertFinite(2 / usefulLife));
  },
  },
  {
    id: "user.vehicle_depreciation_tco_2",
    family: "general",
    label: "ARAÇ AMORTİSMANI — DB_Year_t",
    fn: (inputs) => {
    const bookValue = num(inputs, "bookValue");
    const t = num(inputs, "t");
    const dB = num(inputs, "dB");
    const Rate = num(inputs, "Rate");
    return nonNegative(assertFinite(bookValue_(t-1) * dB_Rate));
  },
  },
  {
    id: "user.vehicle_depreciation_tco_3",
    family: "general",
    label: "ARAÇ AMORTİSMANI — MACRS_Year_t",
    fn: (inputs) => {
    const cost = num(inputs, "cost");
    const mACRS = num(inputs, "mACRS");
    const Table = num(inputs, "Table");
    const assetClass = num(inputs, "assetClass");
    const year = num(inputs, "year");
    return nonNegative(assertFinite(cost * mACRS_Table(assetClass, year)));
  },
  },
  {
    id: "user.vehicle_depreciation_tco_4",
    family: "general",
    label: "ARAÇ AMORTİSMANI — UoP_PerUnit",
    fn: (inputs) => {
    const cost = num(inputs, "cost");
    const salvageValue = num(inputs, "salvageValue");
    const totalExpectedUnits = num(inputs, "totalExpectedUnits");
    return nonNegative(assertFinite((cost - salvageValue) / totalExpectedUnits));
  },
  },
  {
    id: "user.vehicle_depreciation_tco_5",
    family: "general",
    label: "ARAÇ AMORTİSMANI — TCO",
    fn: (inputs) => {
    const acquisitionCost = num(inputs, "acquisitionCost");
    const opCost = num(inputs, "opCost");
    const t = num(inputs, "t");
    const maintCost = num(inputs, "maintCost");
    const salvage = num(inputs, "salvage");
    const discountRate = num(inputs, "discountRate");
    return nonNegative(assertFinite(acquisitionCost + SUM((opCost_t + maintCost_t - salvage_t) / (1 + discountRate)**t)));
  },
  },
  {
    id: "user.vehicle_depreciation_tco_6",
    family: "general",
    label: "ARAÇ AMORTİSMANI — TaxShield",
    fn: (inputs) => {
    const depreciation = num(inputs, "depreciation");
    const taxRate = num(inputs, "taxRate");
    return nonNegative(assertFinite(depreciation * taxRate));
  },
  },

  // ── ARIZA SÜRESİ MALİYETİ (5 formulas) ──
  {
    id: "user.downtime_cost_0",
    family: "general",
    label: "ARIZA SÜRESİ MALİYETİ — DirectLaborLoss",
    fn: (inputs) => {
    const downtimeHours = num(inputs, "downtimeHours");
    const affectedWorkers = num(inputs, "affectedWorkers");
    const avgHourlyRate = num(inputs, "avgHourlyRate");
    const burdenRate = num(inputs, "burdenRate");
    return nonNegative(assertFinite(downtimeHours * affectedWorkers * avgHourlyRate * (1 + burdenRate)));
  },
  },
  {
    id: "user.downtime_cost_1",
    family: "general",
    label: "ARIZA SÜRESİ MALİYETİ — ProductionLoss",
    fn: (inputs) => {
    const downtimeHours = num(inputs, "downtimeHours");
    const lineCapacity = num(inputs, "lineCapacity");
    const contributionMargin = num(inputs, "contributionMargin");
    return nonNegative(assertFinite(downtimeHours * lineCapacity * contributionMargin));
  },
  },
  {
    id: "user.downtime_cost_2",
    family: "general",
    label: "ARIZA SÜRESİ MALİYETİ — EnergyWaste",
    fn: (inputs) => {
    const idlePowerKW = num(inputs, "idlePowerKW");
    const downtimeHours = num(inputs, "downtimeHours");
    const electricityRate = num(inputs, "electricityRate");
    return nonNegative(assertFinite(idlePowerKW * downtimeHours * electricityRate));
  },
  },
  {
    id: "user.downtime_cost_3",
    family: "general",
    label: "ARIZA SÜRESİ MALİYETİ — RecoveryCost",
    fn: (inputs) => {
    const overtimeHours = num(inputs, "overtimeHours");
    const overtimeRate = num(inputs, "overtimeRate");
    const crewSize = num(inputs, "crewSize");
    return nonNegative(assertFinite(overtimeHours * overtimeRate * crewSize));
  },
  },
  {
    id: "user.downtime_cost_4",
    family: "general",
    label: "ARIZA SÜRESİ MALİYETİ — TotalDowntimeCost",
    fn: (inputs) => {
    const directLaborLoss = num(inputs, "directLaborLoss");
    const productionLoss = num(inputs, "productionLoss");
    const energyWaste = num(inputs, "energyWaste");
    const recoveryCost = num(inputs, "recoveryCost");
    const qualityLoss = num(inputs, "qualityLoss");
    const penalty = num(inputs, "penalty");
    return nonNegative(assertFinite(directLaborLoss + productionLoss + energyWaste + recoveryCost + qualityLoss + penalty));
  },
  },

  // ── AUTO REPAIR COMEBACK (6 formulas) ──
  {
    id: "user.auto_repair_comeback_0",
    family: "general",
    label: "AUTO REPAIR COMEBACK — ComebackRate",
    fn: (inputs) => {
    const comebackOrders = num(inputs, "comebackOrders");
    const totalCompleted = num(inputs, "totalCompleted");
    return nonNegative(assertFinite((comebackOrders / totalCompleted) * 100));
  },
  },
  {
    id: "user.auto_repair_comeback_1",
    family: "general",
    label: "AUTO REPAIR COMEBACK — ComebackCost_Direct",
    fn: (inputs) => {
    const comebackOrders = num(inputs, "comebackOrders");
    const diagTime = num(inputs, "diagTime");
    const repairTime = num(inputs, "repairTime");
    const laborRate = num(inputs, "laborRate");
    return nonNegative(assertFinite(comebackOrders * (diagTime + repairTime) * laborRate));
  },
  },
  {
    id: "user.auto_repair_comeback_2",
    family: "general",
    label: "AUTO REPAIR COMEBACK — ComebackCost_Parts",
    fn: (inputs) => {
    const comebackOrders = num(inputs, "comebackOrders");
    const wastedPartsValue = num(inputs, "wastedPartsValue");
    return nonNegative(assertFinite(comebackOrders * wastedPartsValue));
  },
  },
  {
    id: "user.auto_repair_comeback_3",
    family: "general",
    label: "AUTO REPAIR COMEBACK — ComebackCost_Opportunity",
    fn: (inputs) => {
    const comebackOrders = num(inputs, "comebackOrders");
    const bayOccupancyHours = num(inputs, "bayOccupancyHours");
    const revenuePerBayHour = num(inputs, "revenuePerBayHour");
    return nonNegative(assertFinite(comebackOrders * bayOccupancyHours * revenuePerBayHour));
  },
  },
  {
    id: "user.auto_repair_comeback_4",
    family: "general",
    label: "AUTO REPAIR COMEBACK — DPMO",
    fn: (inputs) => {
    const comebackOrders = num(inputs, "comebackOrders");
    const totalCompleted = num(inputs, "totalCompleted");
    return nonNegative(assertFinite((comebackOrders / totalCompleted) * 1000000));
  },
  },
  {
    id: "user.auto_repair_comeback_5",
    family: "general",
    label: "AUTO REPAIR COMEBACK — TotalCost",
    fn: (inputs) => {
    const direct = num(inputs, "direct");
    const parts = num(inputs, "parts");
    const warranty = num(inputs, "warranty");
    const goodwill = num(inputs, "goodwill");
    const opportunity = num(inputs, "opportunity");
    return nonNegative(assertFinite(direct + parts + warranty + goodwill + opportunity));
  },
  },

  // ── AUTO REPAIR QUOTE (5 formulas) ──
  {
    id: "user.auto_repair_quote_consistency_0",
    family: "general",
    label: "AUTO REPAIR QUOTE — QuoteVariance",
    fn: (inputs) => {
    const quoteAmounts = num(inputs, "quoteAmounts");
    return nonNegative(assertFinite(STDEV(quoteAmounts) / AVERAGE(quoteAmounts)));
  },
  },
  {
    id: "user.auto_repair_quote_consistency_1",
    family: "general",
    label: "AUTO REPAIR QUOTE — PartPriceDeviation",
    fn: (inputs) => {
    const quotedPartPrice = num(inputs, "quotedPartPrice");
    const marketAvg = num(inputs, "marketAvg");
    return nonNegative(assertFinite((quotedPartPrice - marketAvg) / marketAvg));
  },
  },
  {
    id: "user.auto_repair_quote_consistency_2",
    family: "general",
    label: "AUTO REPAIR QUOTE — LaborTimeDeviation",
    fn: (inputs) => {
    const quotedLaborHours = num(inputs, "quotedLaborHours");
    const standardHours = num(inputs, "standardHours");
    return nonNegative(assertFinite((quotedLaborHours - standardHours) / standardHours));
  },
  },
  {
    id: "user.auto_repair_quote_consistency_3",
    family: "general",
    label: "AUTO REPAIR QUOTE — ConsistencyScore",
    fn: (inputs) => {
    const quoteVariance = num(inputs, "quoteVariance");
    const partPriceDeviation = num(inputs, "partPriceDeviation");
    const laborTimeDeviation = num(inputs, "laborTimeDeviation");
    return nonNegative(assertFinite(100 - (quoteVariance * 50 + Math.abs(partPriceDeviation) * 25 + Math.abs(laborTimeDeviation) * 25)));
  },
  },
  {
    id: "user.auto_repair_quote_consistency_4",
    family: "general",
    label: "AUTO REPAIR QUOTE — MarginLeak",
    fn: (inputs) => {
    const marketPrice = num(inputs, "marketPrice");
    const quotedPrice = num(inputs, "quotedPrice");
    const quantity = num(inputs, "quantity");
    return nonNegative(assertFinite(SUM((marketPrice - quotedPrice) * quantity)));
  },
  },

  // ── AUTO SHOP MARJ KAÇAK (7 formulas) ──
  {
    id: "user.auto_shop_margin_leak_0",
    family: "general",
    label: "AUTO SHOP MARJ KAÇAK — GrossMargin_Parts",
    fn: (inputs) => {
    const partsRevenue = num(inputs, "partsRevenue");
    const partsCOGS = num(inputs, "partsCOGS");
    return nonNegative(assertFinite((partsRevenue - partsCOGS) / partsRevenue));
  },
  },
  {
    id: "user.auto_shop_margin_leak_1",
    family: "general",
    label: "AUTO SHOP MARJ KAÇAK — EffectiveLaborRate",
    fn: (inputs) => {
    const totalLaborRevenue = num(inputs, "totalLaborRevenue");
    const totalFlagHours = num(inputs, "totalFlagHours");
    return nonNegative(assertFinite(totalLaborRevenue / totalFlagHours));
  },
  },
  {
    id: "user.auto_shop_margin_leak_2",
    family: "general",
    label: "AUTO SHOP MARJ KAÇAK — ProductivityRate",
    fn: (inputs) => {
    const totalFlagHours = num(inputs, "totalFlagHours");
    const totalAvailableHours = num(inputs, "totalAvailableHours");
    return nonNegative(assertFinite(totalFlagHours / totalAvailableHours));
  },
  },
  {
    id: "user.auto_shop_margin_leak_3",
    family: "general",
    label: "AUTO SHOP MARJ KAÇAK — MarginLeak_Discount",
    fn: (inputs) => {
    const discount = num(inputs, "discount");
    const totalRevenue = num(inputs, "totalRevenue");
    return nonNegative(assertFinite(SUM(discount) / totalRevenue));
  },
  },
  {
    id: "user.auto_shop_margin_leak_4",
    family: "general",
    label: "AUTO SHOP MARJ KAÇAK — MarginLeak_Shrinkage",
    fn: (inputs) => {
    const inventoryShrinkage = num(inputs, "inventoryShrinkage");
    const partsCOGS = num(inputs, "partsCOGS");
    return nonNegative(assertFinite(inventoryShrinkage / partsCOGS));
  },
  },
  {
    id: "user.auto_shop_margin_leak_5",
    family: "general",
    label: "AUTO SHOP MARJ KAÇAK — NetMargin",
    fn: (inputs) => {
    const totalRevenue = num(inputs, "totalRevenue");
    const totalCOGS = num(inputs, "totalCOGS");
    const totalOpEx = num(inputs, "totalOpEx");
    return nonNegative(assertFinite((totalRevenue - totalCOGS - totalOpEx) / totalRevenue));
  },
  },
  {
    id: "user.auto_shop_margin_leak_6",
    family: "general",
    label: "AUTO SHOP MARJ KAÇAK — AnnualLeakage",
    fn: (inputs) => {
    const totalRevenue = num(inputs, "totalRevenue");
    const targetMargin = num(inputs, "targetMargin");
    const netMargin = num(inputs, "netMargin");
    return nonNegative(assertFinite(totalRevenue * (targetMargin - netMargin)));
  },
  },

  // ── BASINÇ VESSEL KALINLIK (6 formulas) ──
  {
    id: "user.asme_pressure_vessel_0",
    family: "general",
    label: "BASINÇ VESSEL KALINLIK — t_shell",
    fn: (inputs) => {
    const p = num(inputs, "p");
    const r = num(inputs, "r");
    const s = num(inputs, "s");
    const e = num(inputs, "e");
    const c = num(inputs, "c");
    return nonNegative(assertFinite((p * r) / (s * e - 0.6 * p) + c_A));
  },
  },
  {
    id: "user.asme_pressure_vessel_1",
    family: "general",
    label: "BASINÇ VESSEL KALINLIK — t_sphere",
    fn: (inputs) => {
    const p = num(inputs, "p");
    const r = num(inputs, "r");
    const s = num(inputs, "s");
    const e = num(inputs, "e");
    const c = num(inputs, "c");
    return nonNegative(assertFinite((p * r) / (2 * s * e - 0.2 * p) + c_A));
  },
  },
  {
    id: "user.asme_pressure_vessel_2",
    family: "general",
    label: "BASINÇ VESSEL KALINLIK — t_head_ellip",
    fn: (inputs) => {
    const p = num(inputs, "p");
    const d = num(inputs, "d");
    const s = num(inputs, "s");
    const e = num(inputs, "e");
    const c = num(inputs, "c");
    return nonNegative(assertFinite((p * d) / (2 * s * e - 0.2 * p) + c_A));
  },
  },
  {
    id: "user.asme_pressure_vessel_3",
    family: "general",
    label: "BASINÇ VESSEL KALINLIK — M",
    fn: (inputs) => {
    const l = num(inputs, "l");
    const r = num(inputs, "r");
    return nonNegative(assertFinite(0.25 * (3 + Math.sqrt(l/r))**2));
  },
  },
  {
    id: "user.asme_pressure_vessel_4",
    family: "general",
    label: "BASINÇ VESSEL KALINLIK — t_head_tori",
    fn: (inputs) => {
    const p = num(inputs, "p");
    const l = num(inputs, "l");
    const m = num(inputs, "m");
    const s = num(inputs, "s");
    const e = num(inputs, "e");
    const c = num(inputs, "c");
    return nonNegative(assertFinite((p * l * m) / (2 * s * e - 0.2 * p) + c_A));
  },
  },
  {
    id: "user.asme_pressure_vessel_5",
    family: "general",
    label: "BASINÇ VESSEL KALINLIK — MAWP",
    fn: (inputs) => {
    const s = num(inputs, "s");
    const e = num(inputs, "e");
    const t = num(inputs, "t");
    const c = num(inputs, "c");
    const r = num(inputs, "r");
    return nonNegative(assertFinite((s * e * (t - c_A)) / (r + 0.6 * (t - c_A))));
  },
  },

  // ── BASINÇLI HAVA ENERJİ (5 formulas) ──
  {
    id: "user.compressed_air_energy_cost_0",
    family: "general",
    label: "BASINÇLI HAVA ENERJİ — CompressorPower",
    fn: (inputs) => {
    const q = num(inputs, "q");
    const deltaP = num(inputs, "deltaP");
    const eff = num(inputs, "eff");
    const isothermal = num(inputs, "isothermal");
    const motor = num(inputs, "motor");
    const drive = num(inputs, "drive");
    return nonNegative(assertFinite((q * deltaP) / (eff_isothermal * eff_motor * eff_drive)));
  },
  },
  {
    id: "user.compressed_air_energy_cost_1",
    family: "general",
    label: "BASINÇLI HAVA ENERJİ — SpecificPower",
    fn: (inputs) => {
    const compressorPower = num(inputs, "compressorPower");
    const q = num(inputs, "q");
    const actual = num(inputs, "actual");
    return nonNegative(assertFinite(compressorPower / q_actual));
  },
  },
  {
    id: "user.compressed_air_energy_cost_2",
    family: "general",
    label: "BASINÇLI HAVA ENERJİ — AnnualEnergyCost",
    fn: (inputs) => {
    const compressorPower = num(inputs, "compressorPower");
    const opHours = num(inputs, "opHours");
    const elecRate = num(inputs, "elecRate");
    const loadFactor = num(inputs, "loadFactor");
    return nonNegative(assertFinite(compressorPower * opHours * elecRate * loadFactor));
  },
  },
  {
    id: "user.compressed_air_energy_cost_3",
    family: "general",
    label: "BASINÇLI HAVA ENERJİ — LeakageCost",
    fn: (inputs) => {
    const leakFlow = num(inputs, "leakFlow");
    const opHours = num(inputs, "opHours");
    const specificPower = num(inputs, "specificPower");
    const elecRate = num(inputs, "elecRate");
    return nonNegative(assertFinite(SUM(leakFlow * opHours * specificPower * elecRate)));
  },
  },
  {
    id: "user.compressed_air_energy_cost_4",
    family: "general",
    label: "BASINÇLI HAVA ENERJİ — TotalAnnualCost",
    fn: (inputs) => {
    const annualEnergyCost = num(inputs, "annualEnergyCost");
    const leakageCost = num(inputs, "leakageCost");
    const pressureDropCost = num(inputs, "pressureDropCost");
    const unloadWaste = num(inputs, "unloadWaste");
    const heatRecoverySavings = num(inputs, "heatRecoverySavings");
    return nonNegative(assertFinite(annualEnergyCost + leakageCost + pressureDropCost + unloadWaste - heatRecoverySavings));
  },
  },

  // ── BAŞABAŞ NOKTASI (6 formulas) ──
  {
    id: "user.break_even_margin_of_safety_0",
    family: "general",
    label: "BAŞABAŞ NOKTASI — BEP_Units",
    fn: (inputs) => {
    const fixedCosts = num(inputs, "fixedCosts");
    const unitPrice = num(inputs, "unitPrice");
    const unitVariableCost = num(inputs, "unitVariableCost");
    return nonNegative(assertFinite(fixedCosts / (unitPrice - unitVariableCost)));
  },
  },
  {
    id: "user.break_even_margin_of_safety_1",
    family: "general",
    label: "BAŞABAŞ NOKTASI — BEP_Revenue",
    fn: (inputs) => {
    const fixedCosts = num(inputs, "fixedCosts");
    const cMR = num(inputs, "cMR");
    return nonNegative(assertFinite(fixedCosts / cMR));
  },
  },
  {
    id: "user.break_even_margin_of_safety_2",
    family: "general",
    label: "BAŞABAŞ NOKTASI — CMR",
    fn: (inputs) => {
    const unitPrice = num(inputs, "unitPrice");
    const unitVariableCost = num(inputs, "unitVariableCost");
    return nonNegative(assertFinite((unitPrice - unitVariableCost) / unitPrice));
  },
  },
  {
    id: "user.break_even_margin_of_safety_3",
    family: "general",
    label: "BAŞABAŞ NOKTASI — MarginOfSafety_Percent",
    fn: (inputs) => {
    const actualSales = num(inputs, "actualSales");
    const bEP = num(inputs, "bEP");
    const Units = num(inputs, "Units");
    return nonNegative(assertFinite((actualSales - bEP_Units) / actualSales * 100));
  },
  },
  {
    id: "user.break_even_margin_of_safety_4",
    family: "general",
    label: "BAŞABAŞ NOKTASI — OperatingLeverage",
    fn: (inputs) => {
    const contributionMargin = num(inputs, "contributionMargin");
    const netOperatingIncome = num(inputs, "netOperatingIncome");
    return nonNegative(assertFinite(contributionMargin / netOperatingIncome));
  },
  },
  {
    id: "user.break_even_margin_of_safety_5",
    family: "general",
    label: "BAŞABAŞ NOKTASI — TargetProfit_Units",
    fn: (inputs) => {
    const fixedCosts = num(inputs, "fixedCosts");
    const targetProfit = num(inputs, "targetProfit");
    const unitContributionMargin = num(inputs, "unitContributionMargin");
    return nonNegative(assertFinite((fixedCosts + targetProfit) / unitContributionMargin));
  },
  },

  // ── BETON HACMİ (8 formulas) ──
  {
    id: "user.concrete_volume_cost_0",
    family: "general",
    label: "BETON HACMİ — V_slab",
    fn: (inputs) => {
    const length = num(inputs, "length");
    const width = num(inputs, "width");
    const thickness = num(inputs, "thickness");
    return nonNegative(assertFinite(length * width * thickness));
  },
  },
  {
    id: "user.concrete_volume_cost_1",
    family: "general",
    label: "BETON HACMİ — V_footing",
    fn: (inputs) => {
    const length = num(inputs, "length");
    const width = num(inputs, "width");
    const depth = num(inputs, "depth");
    const count = num(inputs, "count");
    return nonNegative(assertFinite(length * width * depth * count));
  },
  },
  {
    id: "user.concrete_volume_cost_2",
    family: "general",
    label: "BETON HACMİ — V_column",
    fn: (inputs) => {
    const diameter = num(inputs, "diameter");
    const height = num(inputs, "height");
    const count = num(inputs, "count");
    return nonNegative(assertFinite(Math.PI * (diameter/2)**2 * height * count));
  },
  },
  {
    id: "user.concrete_volume_cost_3",
    family: "general",
    label: "BETON HACMİ — V_wall",
    fn: (inputs) => {
    const length = num(inputs, "length");
    const height = num(inputs, "height");
    const thickness = num(inputs, "thickness");
    return nonNegative(assertFinite(length * height * thickness));
  },
  },
  {
    id: "user.concrete_volume_cost_4",
    family: "general",
    label: "BETON HACMİ — V_total",
    fn: (inputs) => {
    const v = num(inputs, "v");
    const geometric = num(inputs, "geometric");
    const wasteFactor = num(inputs, "wasteFactor");
    return nonNegative(assertFinite(v_geometric * (1 + wasteFactor)));
  },
  },
  {
    id: "user.concrete_volume_cost_5",
    family: "general",
    label: "BETON HACMİ — Weight",
    fn: (inputs) => {
    const v = num(inputs, "v");
    const total = num(inputs, "total");
    const density = num(inputs, "density");
    return nonNegative(assertFinite(v_total * density));
  },
  },
  {
    id: "user.concrete_volume_cost_6",
    family: "general",
    label: "BETON HACMİ — TruckLoads",
    fn: (inputs) => {
    const v = num(inputs, "v");
    const total = num(inputs, "total");
    const truckCapacity = num(inputs, "truckCapacity");
    return nonNegative(assertFinite(Math.ceil(v_total / truckCapacity)));
  },
  },
  {
    id: "user.concrete_volume_cost_7",
    family: "general",
    label: "BETON HACMİ — TotalCost",
    fn: (inputs) => {
    const v = num(inputs, "v");
    const total = num(inputs, "total");
    const unitPrice = num(inputs, "unitPrice");
    const pumpCost = num(inputs, "pumpCost");
    return nonNegative(assertFinite(v_total * unitPrice + pumpCost));
  },
  },

  // ── CALIBRATION SAPMA (6 formulas) ──
  {
    id: "user.calibration_drift_risk_0",
    family: "general",
    label: "CALIBRATION SAPMA — DriftRate",
    fn: (inputs) => {
    const lastError = num(inputs, "lastError");
    const prevError = num(inputs, "prevError");
    const timeBetween = num(inputs, "timeBetween");
    return nonNegative(assertFinite((lastError - prevError) / timeBetween));
  },
  },
  {
    id: "user.calibration_drift_risk_1",
    family: "general",
    label: "CALIBRATION SAPMA — PredictedDrift",
    fn: (inputs) => {
    const driftRate = num(inputs, "driftRate");
    const timeSinceLast = num(inputs, "timeSinceLast");
    return nonNegative(assertFinite(driftRate * timeSinceLast));
  },
  },
  {
    id: "user.calibration_drift_risk_2",
    family: "general",
    label: "CALIBRATION SAPMA — CurrentUncertainty",
    fn: (inputs) => {
    const baseUncertainty = num(inputs, "baseUncertainty");
    const predictedDrift = num(inputs, "predictedDrift");
    const envFactor = num(inputs, "envFactor");
    return nonNegative(assertFinite(Math.sqrt(baseUncertainty**2 + predictedDrift**2 + envFactor**2)));
  },
  },
  {
    id: "user.calibration_drift_risk_3",
    family: "general",
    label: "CALIBRATION SAPMA — RiskScore",
    fn: (inputs) => {
    const currentUncertainty = num(inputs, "currentUncertainty");
    const tolerance = num(inputs, "tolerance");
    const criticality = num(inputs, "criticality");
    const usageFreq = num(inputs, "usageFreq");
    return nonNegative(assertFinite((currentUncertainty / tolerance) * criticality * usageFreq));
  },
  },
  {
    id: "user.calibration_drift_risk_4",
    family: "general",
    label: "CALIBRATION SAPMA — OptimalInterval",
    fn: (inputs) => {
    const baseInterval = num(inputs, "baseInterval");
    const tolerance = num(inputs, "tolerance");
    const currentUncertainty = num(inputs, "currentUncertainty");
    return nonNegative(assertFinite(baseInterval * (tolerance / currentUncertainty)));
  },
  },
  {
    id: "user.calibration_drift_risk_5",
    family: "general",
    label: "CALIBRATION SAPMA — GuardBand",
    fn: (inputs) => {
    const expandedUncertainty = num(inputs, "expandedUncertainty");
    const k = num(inputs, "k");
    return nonNegative(assertFinite(expandedUncertainty * k));
  },
  },

  // ── CBAM MARUZİYET (6 formulas) ──
  {
    id: "user.cbam_exposure_0",
    family: "general",
    label: "CBAM MARUZİYET — DirectEmissions",
    fn: (inputs) => {
    const activityData = num(inputs, "activityData");
    const emissionFactor = num(inputs, "emissionFactor");
    return nonNegative(assertFinite(SUM(activityData * emissionFactor)));
  },
  },
  {
    id: "user.cbam_exposure_1",
    family: "general",
    label: "CBAM MARUZİYET — IndirectEmissions",
    fn: (inputs) => {
    const elecConsumption = num(inputs, "elecConsumption");
    const gridFactor = num(inputs, "gridFactor");
    return nonNegative(assertFinite(elecConsumption * gridFactor));
  },
  },
  {
    id: "user.cbam_exposure_2",
    family: "general",
    label: "CBAM MARUZİYET — CarbonIntensity",
    fn: (inputs) => {
    const directEmissions = num(inputs, "directEmissions");
    const indirectEmissions = num(inputs, "indirectEmissions");
    const productionVolume = num(inputs, "productionVolume");
    return nonNegative(assertFinite((directEmissions + indirectEmissions) / productionVolume));
  },
  },
  {
    id: "user.cbam_exposure_3",
    family: "general",
    label: "CBAM MARUZİYET — CBAMCertificateCost",
    fn: (inputs) => {
    const embeddedEmissions = num(inputs, "embeddedEmissions");
    const freeAllowance = num(inputs, "freeAllowance");
    const eU = num(inputs, "eU");
    const Price = num(inputs, "Price");
    return nonNegative(assertFinite((embeddedEmissions - freeAllowance) * eU_ETS_Price));
  },
  },
  {
    id: "user.cbam_exposure_4",
    family: "general",
    label: "CBAM MARUZİYET — FreeAllowance",
    fn: (inputs) => {
    const benchmark = num(inputs, "benchmark");
    const productionVolume = num(inputs, "productionVolume");
    const leakageFactor = num(inputs, "leakageFactor");
    return nonNegative(assertFinite(benchmark * productionVolume * leakageFactor));
  },
  },
  {
    id: "user.cbam_exposure_5",
    family: "general",
    label: "CBAM MARUZİYET — ComplianceScore",
    fn: (inputs) => {
    const dataComplete = num(inputs, "dataComplete");
    const verification = num(inputs, "verification");
    const reduction = num(inputs, "reduction");
    return nonNegative(assertFinite((dataComplete * 0.3) + (verification * 0.3) + (reduction * 0.4)));
  },
  },

  // ── CBAM UYUMLULUK (6 formulas) ──
  {
    id: "user.cbam_compliance_verdict_0",
    family: "general",
    label: "CBAM UYUMLULUK — TotalMass",
    fn: (inputs) => {
    const mass = num(inputs, "mass");
    return nonNegative(assertFinite(SUM(mass)));
  },
  },
  {
    id: "user.cbam_compliance_verdict_1",
    family: "general",
    label: "CBAM UYUMLULUK — TotalEmbedded",
    fn: (inputs) => {
    const direct = num(inputs, "direct");
    const indirect = num(inputs, "indirect");
    return nonNegative(assertFinite(SUM(direct + indirect)));
  },
  },
  {
    id: "user.cbam_compliance_verdict_2",
    family: "general",
    label: "CBAM UYUMLULUK — SpecificEmbedded",
    fn: (inputs) => {
    const totalEmbedded = num(inputs, "totalEmbedded");
    const totalMass = num(inputs, "totalMass");
    return nonNegative(assertFinite(totalEmbedded / totalMass));
  },
  },
  {
    id: "user.cbam_compliance_verdict_3",
    family: "general",
    label: "CBAM UYUMLULUK — ActualVsDefault",
    fn: (inputs) => {
    const specificEmbedded = num(inputs, "specificEmbedded");
    const defaultEmissionFactor = num(inputs, "defaultEmissionFactor");
    return nonNegative(assertFinite(specificEmbedded / defaultEmissionFactor));
  },
  },
  {
    id: "user.cbam_compliance_verdict_4",
    family: "general",
    label: "CBAM UYUMLULUK — FinancialLiability",
    fn: (inputs) => {
    const totalEmbedded = num(inputs, "totalEmbedded");
    const eU = num(inputs, "eU");
    const Price = num(inputs, "Price");
    const carbonPricePaidOrigin = num(inputs, "carbonPricePaidOrigin");
    return nonNegative(assertFinite(totalEmbedded * (eU_ETS_Price - carbonPricePaidOrigin)));
  },
  },
  {
    id: "user.cbam_compliance_verdict_5",
    family: "general",
    label: "CBAM UYUMLULUK — ComplianceDecision",
    fn: (inputs) => {
    const actualVsDefault = num(inputs, "actualVsDefault");
    const aND = num(inputs, "aND");
    const liability = num(inputs, "liability");
    const marginThreshold = num(inputs, "marginThreshold");
    const proceed = num(inputs, "proceed");
    const reevaluate = num(inputs, "reevaluate");
    return nonNegative(assertFinite(((actualVsDefault < 1 aND liability < marginThreshold) ? ("proceed") : ("reevaluate"))));
  },
  },

  // ── CHATTER YÜZEY KALİTE (6 formulas) ──
  {
    id: "user.chatter_surface_quality_0",
    family: "general",
    label: "CHATTER YÜZEY KALİTE — V_c",
    fn: (inputs) => {
    const d = num(inputs, "d");
    const n = num(inputs, "n");
    return nonNegative(assertFinite((Math.PI * d * n) / 1000));
  },
  },
  {
    id: "user.chatter_surface_quality_1",
    family: "general",
    label: "CHATTER YÜZEY KALİTE — f_z",
    fn: (inputs) => {
    const v = num(inputs, "v");
    const f = num(inputs, "f");
    const z = num(inputs, "z");
    const n = num(inputs, "n");
    return nonNegative(assertFinite(v_f / (z * n)));
  },
  },
  {
    id: "user.chatter_surface_quality_2",
    family: "general",
    label: "CHATTER YÜZEY KALİTE — SurfaceRoughness_Theo",
    fn: (inputs) => {
    const f = num(inputs, "f");
    const z = num(inputs, "z");
    const r = num(inputs, "r");
    const epsilon = num(inputs, "epsilon");
    return nonNegative(assertFinite(f_z**2 / (8 * r_epsilon)));
  },
  },
  {
    id: "user.chatter_surface_quality_3",
    family: "general",
    label: "CHATTER YÜZEY KALİTE — SurfaceRoughness_Actual",
    fn: (inputs) => {
    const theo = num(inputs, "theo");
    const chatterAmplification = num(inputs, "chatterAmplification");
    return nonNegative(assertFinite(theo * chatterAmplification));
  },
  },
  {
    id: "user.chatter_surface_quality_4",
    family: "general",
    label: "CHATTER YÜZEY KALİTE — QualityLossCost",
    fn: (inputs) => {
    const actual = num(inputs, "actual");
    const toleranceLimit = num(inputs, "toleranceLimit");
    const reworkCostPerMicron = num(inputs, "reworkCostPerMicron");
    return nonNegative(assertFinite((actual - toleranceLimit) * reworkCostPerMicron));
  },
  },
  {
    id: "user.chatter_surface_quality_5",
    family: "general",
    label: "CHATTER YÜZEY KALİTE — ScrapRate",
    fn: (inputs) => {
    const actual = num(inputs, "actual");
    const maxTolerance = num(inputs, "maxTolerance");
    const batchSize = num(inputs, "batchSize");
    return nonNegative(assertFinite(((actual > maxTolerance) ? (1) : (0)) * batchSize));
  },
  },

  // ── CIVATE TORK (7 formulas) ──
  {
    id: "user.bolt_torque_preload_0",
    family: "general",
    label: "CIVATE TORK — T",
    fn: (inputs) => {
    const k = num(inputs, "k");
    const d = num(inputs, "d");
    const f = num(inputs, "f");
    return nonNegative(assertFinite(k * d * f));
  },
  },
  {
    id: "user.bolt_torque_preload_1",
    family: "general",
    label: "CIVATE TORK — F",
    fn: (inputs) => {
    const preload = num(inputs, "preload");
    const sigma = num(inputs, "sigma");
    const p = num(inputs, "p");
    const a = num(inputs, "a");
    const t = num(inputs, "t");
    return nonNegative(assertFinite(preload = sigma_p * a_t));
  },
  },
  {
    id: "user.bolt_torque_preload_2",
    family: "general",
    label: "CIVATE TORK — Sigma_p",
    fn: (inputs) => {
    const proofStrength = num(inputs, "proofStrength");
    return nonNegative(assertFinite(0.7 * proofStrength));
  },
  },
  {
    id: "user.bolt_torque_preload_3",
    family: "general",
    label: "CIVATE TORK — A_t",
    fn: (inputs) => {
    const d2 = num(inputs, "d2");
    const d3 = num(inputs, "d3");
    return nonNegative(assertFinite((Math.PI / 4) * ((d2 + d3) / 2)**2));
  },
  },
  {
    id: "user.bolt_torque_preload_4",
    family: "general",
    label: "CIVATE TORK — d2",
    fn: (inputs) => {
    const d = num(inputs, "d");
    const p = num(inputs, "p");
    return nonNegative(assertFinite(d - 0.649519 * p));
  },
  },
  {
    id: "user.bolt_torque_preload_5",
    family: "general",
    label: "CIVATE TORK — d3",
    fn: (inputs) => {
    const d = num(inputs, "d");
    const p = num(inputs, "p");
    return nonNegative(assertFinite(d - 1.226869 * p));
  },
  },
  {
    id: "user.bolt_torque_preload_6",
    family: "general",
    label: "CIVATE TORK — YieldCheck",
    fn: (inputs) => {
    const sigma = num(inputs, "sigma");
    const p = num(inputs, "p");
    const yieldStrength = num(inputs, "yieldStrength");
    const fAIL = num(inputs, "fAIL");
    const pASS = num(inputs, "pASS");
    return nonNegative(assertFinite(((sigma_p > yieldStrength) ? ("fAIL") : ("pASS"))));
  },
  },

  // ── CİRO MALİYETİ (6 formulas) ──
  {
    id: "user.employee_turnover_cost_0",
    family: "general",
    label: "CİRO MALİYETİ — SeparationCost",
    fn: (inputs) => {
    const exitInterview = num(inputs, "exitInterview");
    const hRRate = num(inputs, "hRRate");
    const severance = num(inputs, "severance");
    const admin = num(inputs, "admin");
    return nonNegative(assertFinite(exitInterview * hRRate + severance + admin));
  },
  },
  {
    id: "user.employee_turnover_cost_1",
    family: "general",
    label: "CİRO MALİYETİ — VacancyCost",
    fn: (inputs) => {
    const timeToFill = num(inputs, "timeToFill");
    const dailyRevenue = num(inputs, "dailyRevenue");
    const tempCost = num(inputs, "tempCost");
    return nonNegative(assertFinite((timeToFill * dailyRevenue) + tempCost));
  },
  },
  {
    id: "user.employee_turnover_cost_2",
    family: "general",
    label: "CİRO MALİYETİ — ReplacementCost",
    fn: (inputs) => {
    const ads = num(inputs, "ads");
    const agency = num(inputs, "agency");
    const interviewTime = num(inputs, "interviewTime");
    const rate = num(inputs, "rate");
    return nonNegative(assertFinite(ads + agency + interviewTime * rate));
  },
  },
  {
    id: "user.employee_turnover_cost_3",
    family: "general",
    label: "CİRO MALİYETİ — TrainingCost",
    fn: (inputs) => {
    const trainHours = num(inputs, "trainHours");
    const trainerRate = num(inputs, "trainerRate");
    const onboardHours = num(inputs, "onboardHours");
    const newHireRate = num(inputs, "newHireRate");
    return nonNegative(assertFinite(trainHours * trainerRate + onboardHours * newHireRate));
  },
  },
  {
    id: "user.employee_turnover_cost_4",
    family: "general",
    label: "CİRO MALİYETİ — ProductivityLoss",
    fn: (inputs) => {
    const timeToFull = num(inputs, "timeToFull");
    const avgOutput = num(inputs, "avgOutput");
    const rampUp = num(inputs, "rampUp");
    const margin = num(inputs, "margin");
    return nonNegative(assertFinite(timeToFull * avgOutput * (1 - rampUp) * margin));
  },
  },
  {
    id: "user.employee_turnover_cost_5",
    family: "general",
    label: "CİRO MALİYETİ — TotalTurnoverCost",
    fn: (inputs) => {
    const separation = num(inputs, "separation");
    const vacancy = num(inputs, "vacancy");
    const replacement = num(inputs, "replacement");
    const training = num(inputs, "training");
    const productivity = num(inputs, "productivity");
    return nonNegative(assertFinite(separation + vacancy + replacement + training + productivity));
  },
  },

  // ── CLOUD API OVERRUN (6 formulas) ──
  {
    id: "user.cloud_api_overrun_0",
    family: "general",
    label: "CLOUD API OVERRUN — OverrunRequests",
    fn: (inputs) => {
    const totalRequests = num(inputs, "totalRequests");
    const includedRequests = num(inputs, "includedRequests");
    return nonNegative(assertFinite(Math.max(0, totalRequests - includedRequests)));
  },
  },
  {
    id: "user.cloud_api_overrun_1",
    family: "general",
    label: "CLOUD API OVERRUN — OverrunCost",
    fn: (inputs) => {
    const overrunRequests = num(inputs, "overrunRequests");
    const overageRate = num(inputs, "overageRate");
    return nonNegative(assertFinite(overrunRequests * overageRate));
  },
  },
  {
    id: "user.cloud_api_overrun_2",
    family: "general",
    label: "CLOUD API OVERRUN — ThrottlingCost",
    fn: (inputs) => {
    const throttledRequests = num(inputs, "throttledRequests");
    const retryCost = num(inputs, "retryCost");
    const avgRetries = num(inputs, "avgRetries");
    return nonNegative(assertFinite(throttledRequests * retryCost * avgRetries));
  },
  },
  {
    id: "user.cloud_api_overrun_3",
    family: "general",
    label: "CLOUD API OVERRUN — DataEgressCost",
    fn: (inputs) => {
    const dataOutGB = num(inputs, "dataOutGB");
    const egressRate = num(inputs, "egressRate");
    return nonNegative(assertFinite(dataOutGB * egressRate));
  },
  },
  {
    id: "user.cloud_api_overrun_4",
    family: "general",
    label: "CLOUD API OVERRUN — SLABreachPenalty",
    fn: (inputs) => {
    const availability = num(inputs, "availability");
    const sLA = num(inputs, "sLA");
    const monthlyFee = num(inputs, "monthlyFee");
    const creditPct = num(inputs, "creditPct");
    return nonNegative(assertFinite(((availability < sLA) ? (monthlyFee * creditPct) : (0))));
  },
  },
  {
    id: "user.cloud_api_overrun_5",
    family: "general",
    label: "CLOUD API OVERRUN — TotalOverrunCost",
    fn: (inputs) => {
    const overrunCost = num(inputs, "overrunCost");
    const throttlingCost = num(inputs, "throttlingCost");
    const dataEgressCost = num(inputs, "dataEgressCost");
    const sLABreachPenalty = num(inputs, "sLABreachPenalty");
    return nonNegative(assertFinite(overrunCost + throttlingCost + dataEgressCost + sLABreachPenalty));
  },
  },

  // ── CLOUD FIRE ELIMINATION (6 formulas) ──
  {
    id: "user.cloud_waste_elimination_0",
    family: "general",
    label: "CLOUD FIRE ELIMINATION — ZombieCost",
    fn: (inputs) => {
    const unattachedVolumes = num(inputs, "unattachedVolumes");
    const rate = num(inputs, "rate");
    const idleLBs = num(inputs, "idleLBs");
    const orphanSnapshots = num(inputs, "orphanSnapshots");
    const storageRate = num(inputs, "storageRate");
    return nonNegative(assertFinite(SUM(unattachedVolumes * rate) + SUM(idleLBs * rate) + SUM(orphanSnapshots * storageRate)));
  },
  },
  {
    id: "user.cloud_waste_elimination_1",
    family: "general",
    label: "CLOUD FIRE ELIMINATION — OversizingSavings",
    fn: (inputs) => {
    const currentCost = num(inputs, "currentCost");
    const rightSizedCost = num(inputs, "rightSizedCost");
    const uptime = num(inputs, "uptime");
    return nonNegative(assertFinite(SUM((currentCost - rightSizedCost) * uptime)));
  },
  },
  {
    id: "user.cloud_waste_elimination_2",
    family: "general",
    label: "CLOUD FIRE ELIMINATION — SpotSavings",
    fn: (inputs) => {
    const onDemand = num(inputs, "onDemand");
    const spot = num(inputs, "spot");
    const faultTolerantHours = num(inputs, "faultTolerantHours");
    return nonNegative(assertFinite(SUM((onDemand - spot) * faultTolerantHours)));
  },
  },
  {
    id: "user.cloud_waste_elimination_3",
    family: "general",
    label: "CLOUD FIRE ELIMINATION — ReservedSavings",
    fn: (inputs) => {
    const onDemand = num(inputs, "onDemand");
    const reserved = num(inputs, "reserved");
    const commitUtil = num(inputs, "commitUtil");
    return nonNegative(assertFinite((onDemand - reserved) * commitUtil));
  },
  },
  {
    id: "user.cloud_waste_elimination_4",
    family: "general",
    label: "CLOUD FIRE ELIMINATION — IdleHoursCost",
    fn: (inputs) => {
    const nonBizHours = num(inputs, "nonBizHours");
    const runningInstances = num(inputs, "runningInstances");
    const hourlyRate = num(inputs, "hourlyRate");
    return nonNegative(assertFinite(nonBizHours * runningInstances * hourlyRate));
  },
  },
  {
    id: "user.cloud_waste_elimination_5",
    family: "general",
    label: "CLOUD FIRE ELIMINATION — TotalWaste",
    fn: (inputs) => {
    const zombie = num(inputs, "zombie");
    const oversizing = num(inputs, "oversizing");
    const spot = num(inputs, "spot");
    const reserved = num(inputs, "reserved");
    const idle = num(inputs, "idle");
    return nonNegative(assertFinite(zombie + oversizing + spot + reserved + idle));
  },
  },

  // ── CLV / CAC ORANI (6 formulas) ──
  {
    id: "user.clv_cac_ratio_0",
    family: "general",
    label: "CLV / CAC ORANI — CLV",
    fn: (inputs) => {
    const avgOrderValue = num(inputs, "avgOrderValue");
    const purchaseFreq = num(inputs, "purchaseFreq");
    const lifespan = num(inputs, "lifespan");
    return nonNegative(assertFinite(avgOrderValue * purchaseFreq * lifespan));
  },
  },
  {
    id: "user.clv_cac_ratio_1",
    family: "general",
    label: "CLV / CAC ORANI — GrossMarginCLV",
    fn: (inputs) => {
    const cLV = num(inputs, "cLV");
    const grossMarginPct = num(inputs, "grossMarginPct");
    return nonNegative(assertFinite(cLV * grossMarginPct));
  },
  },
  {
    id: "user.clv_cac_ratio_2",
    family: "general",
    label: "CLV / CAC ORANI — DiscountedCLV",
    fn: (inputs) => {
    const grossMarginCLV = num(inputs, "grossMarginCLV");
    const retention = num(inputs, "retention");
    const t = num(inputs, "t");
    const discountRate = num(inputs, "discountRate");
    return nonNegative(assertFinite(SUM((grossMarginCLV * retention**t) / (1 + discountRate)**t)));
  },
  },
  {
    id: "user.clv_cac_ratio_3",
    family: "general",
    label: "CLV / CAC ORANI — CAC",
    fn: (inputs) => {
    const salesMarketing = num(inputs, "salesMarketing");
    const salaries = num(inputs, "salaries");
    const overhead = num(inputs, "overhead");
    const newCustomers = num(inputs, "newCustomers");
    return nonNegative(assertFinite((salesMarketing + salaries + overhead) / newCustomers));
  },
  },
  {
    id: "user.clv_cac_ratio_4",
    family: "general",
    label: "CLV / CAC ORANI — Payback",
    fn: (inputs) => {
    const cAC = num(inputs, "cAC");
    const avgMonthlyGrossProfit = num(inputs, "avgMonthlyGrossProfit");
    return nonNegative(assertFinite(cAC / avgMonthlyGrossProfit));
  },
  },
  {
    id: "user.clv_cac_ratio_5",
    family: "general",
    label: "CLV / CAC ORANI — LTV_CAC",
    fn: (inputs) => {
    const discountedCLV = num(inputs, "discountedCLV");
    const cAC = num(inputs, "cAC");
    return nonNegative(assertFinite(discountedCLV / cAC));
  },
  },

  // ── CNC ÇEVRİM SÜRESİ (7 formulas) ──
  {
    id: "user.cnc_cycle_time_0",
    family: "general",
    label: "CNC ÇEVRİM SÜRESİ — T_cut",
    fn: (inputs) => {
    const l = num(inputs, "l");
    const d = num(inputs, "d");
    const v = num(inputs, "v");
    const f = num(inputs, "f");
    const a = num(inputs, "a");
    const p = num(inputs, "p");
    return nonNegative(assertFinite((l * d) / (v_f * a_p)));
  },
  },
  {
    id: "user.cnc_cycle_time_1",
    family: "general",
    label: "CNC ÇEVRİM SÜRESİ — V_f",
    fn: (inputs) => {
    const f = num(inputs, "f");
    const z = num(inputs, "z");
    const n = num(inputs, "n");
    return nonNegative(assertFinite(f_z * z * n));
  },
  },
  {
    id: "user.cnc_cycle_time_2",
    family: "general",
    label: "CNC ÇEVRİM SÜRESİ — n",
    fn: (inputs) => {
    const v = num(inputs, "v");
    const c = num(inputs, "c");
    const d = num(inputs, "d");
    const tool = num(inputs, "tool");
    return nonNegative(assertFinite((1000 * v_c) / (Math.PI * d_tool)));
  },
  },
  {
    id: "user.cnc_cycle_time_3",
    family: "general",
    label: "CNC ÇEVRİM SÜRESİ — T_rapid",
    fn: (inputs) => {
    const distance = num(inputs, "distance");
    const rapid = num(inputs, "rapid");
    const v = num(inputs, "v");
    return nonNegative(assertFinite(distance_rapid / v_rapid));
  },
  },
  {
    id: "user.cnc_cycle_time_4",
    family: "general",
    label: "CNC ÇEVRİM SÜRESİ — T_toolchange",
    fn: (inputs) => {
    const changes = num(inputs, "changes");
    const timePerChange = num(inputs, "timePerChange");
    return nonNegative(assertFinite(changes * timePerChange));
  },
  },
  {
    id: "user.cnc_cycle_time_5",
    family: "general",
    label: "CNC ÇEVRİM SÜRESİ — T_total",
    fn: (inputs) => {
    const t = num(inputs, "t");
    const cut = num(inputs, "cut");
    const rapid = num(inputs, "rapid");
    const toolchange = num(inputs, "toolchange");
    const noncutting = num(inputs, "noncutting");
    const load = num(inputs, "load");
    const unload = num(inputs, "unload");
    return nonNegative(assertFinite(t_cut + t_rapid + t_toolchange + t_noncutting + t_load_unload));
  },
  },
  {
    id: "user.cnc_cycle_time_6",
    family: "general",
    label: "CNC ÇEVRİM SÜRESİ — OEE_Availability",
    fn: (inputs) => {
    const planned = num(inputs, "planned");
    const downtime = num(inputs, "downtime");
    return nonNegative(assertFinite(planned / (planned + downtime)));
  },
  },

  // ── CNC İŞLEME MALİYETİ (6 formulas) ──
  {
    id: "user.cnc_machining_cost_0",
    family: "general",
    label: "CNC İŞLEME MALİYETİ — Cost_Material",
    fn: (inputs) => {
    const volume = num(inputs, "volume");
    const raw = num(inputs, "raw");
    const density = num(inputs, "density");
    const pricePerKg = num(inputs, "pricePerKg");
    const scrapRate = num(inputs, "scrapRate");
    return nonNegative(assertFinite(volume_raw * density * pricePerKg * (1 + scrapRate)));
  },
  },
  {
    id: "user.cnc_machining_cost_1",
    family: "general",
    label: "CNC İŞLEME MALİYETİ — Cost_Machining",
    fn: (inputs) => {
    const t = num(inputs, "t");
    const total = num(inputs, "total");
    const machineRate = num(inputs, "machineRate");
    return nonNegative(assertFinite(t_total * machineRate));
  },
  },
  {
    id: "user.cnc_machining_cost_2",
    family: "general",
    label: "CNC İŞLEME MALİYETİ — Cost_Tooling",
    fn: (inputs) => {
    const t = num(inputs, "t");
    const cut = num(inputs, "cut");
    const toolLife = num(inputs, "toolLife");
    const toolCost = num(inputs, "toolCost");
    return nonNegative(assertFinite((t_cut / toolLife) * toolCost));
  },
  },
  {
    id: "user.cnc_machining_cost_3",
    family: "general",
    label: "CNC İŞLEME MALİYETİ — Cost_Energy",
    fn: (inputs) => {
    const power = num(inputs, "power");
    const t = num(inputs, "t");
    const total = num(inputs, "total");
    const elecRate = num(inputs, "elecRate");
    return nonNegative(assertFinite(power * t_total * elecRate));
  },
  },
  {
    id: "user.cnc_machining_cost_4",
    family: "general",
    label: "CNC İŞLEME MALİYETİ — Cost_Overhead",
    fn: (inputs) => {
    const t = num(inputs, "t");
    const total = num(inputs, "total");
    const overheadRate = num(inputs, "overheadRate");
    return nonNegative(assertFinite(t_total * overheadRate));
  },
  },
  {
    id: "user.cnc_machining_cost_5",
    family: "general",
    label: "CNC İŞLEME MALİYETİ — TotalUnitCost",
    fn: (inputs) => {
    const material = num(inputs, "material");
    const machining = num(inputs, "machining");
    const tooling = num(inputs, "tooling");
    const energy = num(inputs, "energy");
    const overhead = num(inputs, "overhead");
    const quality = num(inputs, "quality");
    return nonNegative(assertFinite(material + machining + tooling + energy + overhead + quality));
  },
  },

  // ── CPK TO PPM (9 formulas) ──
  {
    id: "user.cpk_ppm_converter_0",
    family: "general",
    label: "CPK TO PPM — Z_USL",
    fn: (inputs) => {
    const uSL = num(inputs, "uSL");
    const mean = num(inputs, "mean");
    const stdDev = num(inputs, "stdDev");
    return nonNegative(assertFinite((uSL - mean) / stdDev));
  },
  },
  {
    id: "user.cpk_ppm_converter_1",
    family: "general",
    label: "CPK TO PPM — Z_LSL",
    fn: (inputs) => {
    const mean = num(inputs, "mean");
    const lSL = num(inputs, "lSL");
    const stdDev = num(inputs, "stdDev");
    return nonNegative(assertFinite((mean - lSL) / stdDev));
  },
  },
  {
    id: "user.cpk_ppm_converter_2",
    family: "general",
    label: "CPK TO PPM — Cpk",
    fn: (inputs) => {
    const z = num(inputs, "z");
    return nonNegative(assertFinite(Math.min(z_USL, z_LSL) / 3));
  },
  },
  {
    id: "user.cpk_ppm_converter_3",
    family: "general",
    label: "CPK TO PPM — P_USL",
    fn: (inputs) => {
    const z = num(inputs, "z");
    return nonNegative(assertFinite(1 - __NORMSDIST__(z_USL)));
  },
  },
  {
    id: "user.cpk_ppm_converter_4",
    family: "general",
    label: "CPK TO PPM — P_LSL",
    fn: (inputs) => {
    const z = num(inputs, "z");
    return nonNegative(assertFinite(__NORMSDIST__(-z_LSL)));
  },
  },
  {
    id: "user.cpk_ppm_converter_5",
    family: "general",
    label: "CPK TO PPM — P_Total",
    fn: (inputs) => {
    const p = num(inputs, "p");
    return nonNegative(assertFinite(p_USL + p_LSL));
  },
  },
  {
    id: "user.cpk_ppm_converter_6",
    family: "general",
    label: "CPK TO PPM — PPM",
    fn: (inputs) => {
    const p = num(inputs, "p");
    const Total = num(inputs, "Total");
    return nonNegative(assertFinite(p_Total * 1000000));
  },
  },
  {
    id: "user.cpk_ppm_converter_7",
    family: "general",
    label: "CPK TO PPM — Yield",
    fn: (inputs) => {
    const p = num(inputs, "p");
    const Total = num(inputs, "Total");
    return nonNegative(assertFinite(1 - p_Total));
  },
  },
  {
    id: "user.cpk_ppm_converter_8",
    family: "general",
    label: "CPK TO PPM — Sigma_ShortTerm",
    fn: (inputs) => {
    const cpk = num(inputs, "cpk");
    return nonNegative(assertFinite((cpk * 3) + 1.5));
  },
  },

  // ── CPM GECİKME CEZASI (8 formulas) ──
  {
    id: "user.cpm_delay_penalty_0",
    family: "general",
    label: "CPM GECİKME CEZASI — TotalFloat",
    fn: (inputs) => {
    const lateStart = num(inputs, "lateStart");
    const earlyStart = num(inputs, "earlyStart");
    return nonNegative(assertFinite(lateStart - earlyStart));
  },
  },
  {
    id: "user.cpm_delay_penalty_1",
    family: "general",
    label: "CPM GECİKME CEZASI — CriticalDelay",
    fn: (inputs) => {
    const actual = num(inputs, "actual");
    const planned = num(inputs, "planned");
    const totalFloat = num(inputs, "totalFloat");
    return nonNegative(assertFinite(Math.max(0, actual - planned - totalFloat)));
  },
  },
  {
    id: "user.cpm_delay_penalty_2",
    family: "general",
    label: "CPM GECİKME CEZASI — ExcusableDelay",
    fn: (inputs) => {
    const forceMajeure = num(inputs, "forceMajeure");
    const ownerCaused = num(inputs, "ownerCaused");
    return nonNegative(assertFinite(forceMajeure + ownerCaused));
  },
  },
  {
    id: "user.cpm_delay_penalty_3",
    family: "general",
    label: "CPM GECİKME CEZASI — NonExcusable",
    fn: (inputs) => {
    const criticalDelay = num(inputs, "criticalDelay");
    const excusable = num(inputs, "excusable");
    return nonNegative(assertFinite(criticalDelay - excusable));
  },
  },
  {
    id: "user.cpm_delay_penalty_4",
    family: "general",
    label: "CPM GECİKME CEZASI — LiquidatedDamages",
    fn: (inputs) => {
    const nonExcusable = num(inputs, "nonExcusable");
    const dailyPenalty = num(inputs, "dailyPenalty");
    return nonNegative(assertFinite(nonExcusable * dailyPenalty));
  },
  },
  {
    id: "user.cpm_delay_penalty_5",
    family: "general",
    label: "CPM GECİKME CEZASI — AccelerationCost",
    fn: (inputs) => {
    const crashingCost = num(inputs, "crashingCost");
    const daysAccelerated = num(inputs, "daysAccelerated");
    return nonNegative(assertFinite(crashingCost * daysAccelerated));
  },
  },
  {
    id: "user.cpm_delay_penalty_6",
    family: "general",
    label: "CPM GECİKME CEZASI — NetPenalty",
    fn: (inputs) => {
    const liquidatedDamages = num(inputs, "liquidatedDamages");
    const accelerationCost = num(inputs, "accelerationCost");
    return nonNegative(assertFinite(liquidatedDamages - accelerationCost));
  },
  },
  {
    id: "user.cpm_delay_penalty_7",
    family: "general",
    label: "CPM GECİKME CEZASI — EOT_Claim",
    fn: (inputs) => {
    const excusable = num(inputs, "excusable");
    const effFactor = num(inputs, "effFactor");
    return nonNegative(assertFinite(excusable * (1 - effFactor)));
  },
  },

  // ── ÇATI ALANI (7 formulas) ──
  {
    id: "user.roof_area_load_0",
    family: "general",
    label: "ÇATI ALANI — Area_Footprint",
    fn: (inputs) => {
    const length = num(inputs, "length");
    const width = num(inputs, "width");
    return nonNegative(assertFinite(length * width));
  },
  },
  {
    id: "user.roof_area_load_1",
    family: "general",
    label: "ÇATI ALANI — Area_Gable",
    fn: (inputs) => {
    const footprint = num(inputs, "footprint");
    const pitchAngle = num(inputs, "pitchAngle");
    return nonNegative(assertFinite(footprint / Math.cos(pitchAngle)));
  },
  },
  {
    id: "user.roof_area_load_2",
    family: "general",
    label: "ÇATI ALANI — OverhangArea",
    fn: (inputs) => {
    const perimeter = num(inputs, "perimeter");
    const overhangWidth = num(inputs, "overhangWidth");
    return nonNegative(assertFinite(perimeter * overhangWidth));
  },
  },
  {
    id: "user.roof_area_load_3",
    family: "general",
    label: "ÇATI ALANI — TotalMaterialArea",
    fn: (inputs) => {
    const area = num(inputs, "area");
    const Roof = num(inputs, "Roof");
    const wasteFactor = num(inputs, "wasteFactor");
    return nonNegative(assertFinite(area_Roof * (1 + wasteFactor)));
  },
  },
  {
    id: "user.roof_area_load_4",
    family: "general",
    label: "ÇATI ALANI — RidgeLength",
    fn: (inputs) => {
    const length = num(inputs, "length");
    const width = num(inputs, "width");
    return nonNegative(assertFinite(length - width + (width * Math.sqrt(2))));
  },
  },
  {
    id: "user.roof_area_load_5",
    family: "general",
    label: "ÇATI ALANI — Load_Dead",
    fn: (inputs) => {
    const materialWeight = num(inputs, "materialWeight");
    const totalArea = num(inputs, "totalArea");
    return nonNegative(assertFinite(materialWeight * totalArea));
  },
  },
  {
    id: "user.roof_area_load_6",
    family: "general",
    label: "ÇATI ALANI — Load_Snow",
    fn: (inputs) => {
    const groundSnow = num(inputs, "groundSnow");
    const exposure = num(inputs, "exposure");
    const thermal = num(inputs, "thermal");
    const slope = num(inputs, "slope");
    return nonNegative(assertFinite(groundSnow * exposure * thermal * slope));
  },
  },

  // ── DARBOĞAZ YATIRIM (7 formulas) ──
  {
    id: "user.bottleneck_investment_0",
    family: "general",
    label: "DARBOĞAZ YATIRIM — Utilization",
    fn: (inputs) => {
    const actualOutput = num(inputs, "actualOutput");
    const designCapacity = num(inputs, "designCapacity");
    return nonNegative(assertFinite(actualOutput / designCapacity));
  },
  },
  {
    id: "user.bottleneck_investment_1",
    family: "general",
    label: "DARBOĞAZ YATIRIM — Throughput",
    fn: (inputs) => {
    const demand = num(inputs, "demand");
    const defectRate = num(inputs, "defectRate");
    return nonNegative(assertFinite(demand * (1 - defectRate)));
  },
  },
  {
    id: "user.bottleneck_investment_2",
    family: "general",
    label: "DARBOĞAZ YATIRIM — TaktTime",
    fn: (inputs) => {
    const availableTime = num(inputs, "availableTime");
    const demand = num(inputs, "demand");
    return nonNegative(assertFinite(availableTime / demand));
  },
  },
  {
    id: "user.bottleneck_investment_3",
    family: "general",
    label: "DARBOĞAZ YATIRIM — CycleTime_Gap",
    fn: (inputs) => {
    const bottleneckCycle = num(inputs, "bottleneckCycle");
    const taktTime = num(inputs, "taktTime");
    return nonNegative(assertFinite(bottleneckCycle - taktTime));
  },
  },
  {
    id: "user.bottleneck_investment_4",
    family: "general",
    label: "DARBOĞAZ YATIRIM — CostOfConstraint",
    fn: (inputs) => {
    const cycleTime = num(inputs, "cycleTime");
    const Gap = num(inputs, "Gap");
    const demand = num(inputs, "demand");
    const unitMargin = num(inputs, "unitMargin");
    return nonNegative(assertFinite(cycleTime_Gap * demand * unitMargin));
  },
  },
  {
    id: "user.bottleneck_investment_5",
    family: "general",
    label: "DARBOĞAZ YATIRIM — ROI",
    fn: (inputs) => {
    const throughputIncrease = num(inputs, "throughputIncrease");
    const margin = num(inputs, "margin");
    const days = num(inputs, "days");
    const upgradeCost = num(inputs, "upgradeCost");
    return nonNegative(assertFinite((throughputIncrease * margin * days) / upgradeCost));
  },
  },
  {
    id: "user.bottleneck_investment_6",
    family: "general",
    label: "DARBOĞAZ YATIRIM — Payback",
    fn: (inputs) => {
    const upgradeCost = num(inputs, "upgradeCost");
    const monthlyGain = num(inputs, "monthlyGain");
    return nonNegative(assertFinite(upgradeCost / monthlyGain));
  },
  },

  // ── DEĞİŞİM MATRİSİ SMED (8 formulas) ──
  {
    id: "user.smed_changeover_matrix_0",
    family: "general",
    label: "DEĞİŞİM MATRİSİ SMED — T_internal",
    fn: (inputs) => {
    const setupStopped = num(inputs, "setupStopped");
    return nonNegative(assertFinite(setupStopped));
  },
  },
  {
    id: "user.smed_changeover_matrix_1",
    family: "general",
    label: "DEĞİŞİM MATRİSİ SMED — T_external",
    fn: (inputs) => {
    const setupRunning = num(inputs, "setupRunning");
    return nonNegative(assertFinite(setupRunning));
  },
  },
  {
    id: "user.smed_changeover_matrix_2",
    family: "general",
    label: "DEĞİŞİM MATRİSİ SMED — T_total",
    fn: (inputs) => {
    const t = num(inputs, "t");
    const internal = num(inputs, "internal");
    const external = num(inputs, "external");
    return nonNegative(assertFinite(t_internal + t_external));
  },
  },
  {
    id: "user.smed_changeover_matrix_3",
    family: "general",
    label: "DEĞİŞİM MATRİSİ SMED — T_target",
    fn: (inputs) => {
    const t = num(inputs, "t");
    const internal = num(inputs, "internal");
    const conversionRate = num(inputs, "conversionRate");
    const external = num(inputs, "external");
    return nonNegative(assertFinite(t_internal * (1 - conversionRate) + t_external));
  },
  },
  {
    id: "user.smed_changeover_matrix_4",
    family: "general",
    label: "DEĞİŞİM MATRİSİ SMED — EBQ",
    fn: (inputs) => {
    const demand = num(inputs, "demand");
    const setupCost = num(inputs, "setupCost");
    const holdingCost = num(inputs, "holdingCost");
    return nonNegative(assertFinite(Math.sqrt((2 * demand * setupCost) / holdingCost)));
  },
  },
  {
    id: "user.smed_changeover_matrix_5",
    family: "general",
    label: "DEĞİŞİM MATRİSİ SMED — SetupCost",
    fn: (inputs) => {
    const t = num(inputs, "t");
    const total = num(inputs, "total");
    const machineRate = num(inputs, "machineRate");
    const labor = num(inputs, "labor");
    return nonNegative(assertFinite(t_total * machineRate + labor));
  },
  },
  {
    id: "user.smed_changeover_matrix_6",
    family: "general",
    label: "DEĞİŞİM MATRİSİ SMED — AnnualSavings",
    fn: (inputs) => {
    const t = num(inputs, "t");
    const total = num(inputs, "total");
    const target = num(inputs, "target");
    const freq = num(inputs, "freq");
    const rate = num(inputs, "rate");
    return nonNegative(assertFinite((t_total - t_target) * freq * rate));
  },
  },
  {
    id: "user.smed_changeover_matrix_7",
    family: "general",
    label: "DEĞİŞİM MATRİSİ SMED — CapacityGain",
    fn: (inputs) => {
    const t = num(inputs, "t");
    const total = num(inputs, "total");
    const target = num(inputs, "target");
    const freq = num(inputs, "freq");
    const available = num(inputs, "available");
    return nonNegative(assertFinite((t_total - t_target) * freq / available));
  },
  },

  // ── DEPO YERLEŞİMİ (8 formulas) ──
  {
    id: "user.warehouse_layout_0",
    family: "general",
    label: "DEPO YERLEŞİMİ — StorageArea",
    fn: (inputs) => {
    const footprint = num(inputs, "footprint");
    const utilRate = num(inputs, "utilRate");
    return nonNegative(assertFinite(footprint * utilRate));
  },
  },
  {
    id: "user.warehouse_layout_1",
    family: "general",
    label: "DEPO YERLEŞİMİ — PalletPositions",
    fn: (inputs) => {
    const storageArea = num(inputs, "storageArea");
    const palletFootprint = num(inputs, "palletFootprint");
    const aisleFactor = num(inputs, "aisleFactor");
    return nonNegative(assertFinite(storageArea / (palletFootprint * aisleFactor)));
  },
  },
  {
    id: "user.warehouse_layout_2",
    family: "general",
    label: "DEPO YERLEŞİMİ — VerticalCap",
    fn: (inputs) => {
    const palletPositions = num(inputs, "palletPositions");
    const rackLevels = num(inputs, "rackLevels");
    return nonNegative(assertFinite(palletPositions * rackLevels));
  },
  },
  {
    id: "user.warehouse_layout_3",
    family: "general",
    label: "DEPO YERLEŞİMİ — ThroughputCap",
    fn: (inputs) => {
    const doors = num(inputs, "doors");
    const turnaround = num(inputs, "turnaround");
    const Load = num(inputs, "Load");
    const Unload = num(inputs, "Unload");
    return nonNegative(assertFinite(doors / (turnaround_Load + turnaround_Unload)));
  },
  },
  {
    id: "user.warehouse_layout_4",
    family: "general",
    label: "DEPO YERLEŞİMİ — TravelDist",
    fn: (inputs) => {
    const freq = num(inputs, "freq");
    const dist = num(inputs, "dist");
    return nonNegative(assertFinite(SUM(freq * dist)));
  },
  },
  {
    id: "user.warehouse_layout_5",
    family: "general",
    label: "DEPO YERLEŞİMİ — PickEfficiency",
    fn: (inputs) => {
    const lines = num(inputs, "lines");
    const travelTime = num(inputs, "travelTime");
    return nonNegative(assertFinite(lines / travelTime));
  },
  },
  {
    id: "user.warehouse_layout_6",
    family: "general",
    label: "DEPO YERLEŞİMİ — CubeUtil",
    fn: (inputs) => {
    const actualVol = num(inputs, "actualVol");
    const rackVol = num(inputs, "rackVol");
    return nonNegative(assertFinite(actualVol / rackVol));
  },
  },
  {
    id: "user.warehouse_layout_7",
    family: "general",
    label: "DEPO YERLEŞİMİ — CostPerPos",
    fn: (inputs) => {
    const facilityCost = num(inputs, "facilityCost");
    const palletPositions = num(inputs, "palletPositions");
    return nonNegative(assertFinite(facilityCost / palletPositions));
  },
  },

  // ── DEVAMSIZLIK MALİYETİ (7 formulas) ──
  {
    id: "user.absenteeism_cost_0",
    family: "general",
    label: "DEVAMSIZLIK MALİYETİ — DirectCost",
    fn: (inputs) => {
    const absentHours = num(inputs, "absentHours");
    const hourlyRate = num(inputs, "hourlyRate");
    const burden = num(inputs, "burden");
    return nonNegative(assertFinite(absentHours * hourlyRate * (1 + burden)));
  },
  },
  {
    id: "user.absenteeism_cost_1",
    family: "general",
    label: "DEVAMSIZLIK MALİYETİ — OvertimePremium",
    fn: (inputs) => {
    const replaceOT = num(inputs, "replaceOT");
    const oTRate = num(inputs, "oTRate");
    const regRate = num(inputs, "regRate");
    return nonNegative(assertFinite(replaceOT * (oTRate - regRate)));
  },
  },
  {
    id: "user.absenteeism_cost_2",
    family: "general",
    label: "DEVAMSIZLIK MALİYETİ — TempCost",
    fn: (inputs) => {
    const tempHours = num(inputs, "tempHours");
    const tempRate = num(inputs, "tempRate");
    const markup = num(inputs, "markup");
    return nonNegative(assertFinite(tempHours * tempRate * (1 + markup)));
  },
  },
  {
    id: "user.absenteeism_cost_3",
    family: "general",
    label: "DEVAMSIZLIK MALİYETİ — ProdLoss",
    fn: (inputs) => {
    const absentHours = num(inputs, "absentHours");
    const outputPerHour = num(inputs, "outputPerHour");
    const margin = num(inputs, "margin");
    const effDrop = num(inputs, "effDrop");
    return nonNegative(assertFinite(absentHours * outputPerHour * margin * effDrop));
  },
  },
  {
    id: "user.absenteeism_cost_4",
    family: "general",
    label: "DEVAMSIZLIK MALİYETİ — AdminCost",
    fn: (inputs) => {
    const events = num(inputs, "events");
    const hR = num(inputs, "hR");
    const Time = num(inputs, "Time");
    const hRRate = num(inputs, "hRRate");
    return nonNegative(assertFinite(events * hR_Time * hRRate));
  },
  },
  {
    id: "user.absenteeism_cost_5",
    family: "general",
    label: "DEVAMSIZLIK MALİYETİ — BradfordFactor",
    fn: (inputs) => {
    const s = num(inputs, "s");
    const d = num(inputs, "d");
    return nonNegative(assertFinite(s**2 * d));
  },
  },
  {
    id: "user.absenteeism_cost_6",
    family: "general",
    label: "DEVAMSIZLIK MALİYETİ — TotalCost",
    fn: (inputs) => {
    const direct = num(inputs, "direct");
    const oT = num(inputs, "oT");
    const temp = num(inputs, "temp");
    const prod = num(inputs, "prod");
    const admin = num(inputs, "admin");
    return nonNegative(assertFinite(direct + oT + temp + prod + admin));
  },
  },

  // ── DIGITAL TWIN MALİYET (6 formulas) ──
  {
    id: "user.digital_twin_cost_0",
    family: "general",
    label: "DIGITAL TWIN MALİYET — Cost_Trad",
    fn: (inputs) => {
    const prototyping = num(inputs, "prototyping");
    const fieldTest = num(inputs, "fieldTest");
    const downtime = num(inputs, "downtime");
    const travel = num(inputs, "travel");
    return nonNegative(assertFinite(prototyping + fieldTest + downtime + travel));
  },
  },
  {
    id: "user.digital_twin_cost_1",
    family: "general",
    label: "DIGITAL TWIN MALİYET — Cost_DT",
    fn: (inputs) => {
    const license = num(inputs, "license");
    const compute = num(inputs, "compute");
    const sensor = num(inputs, "sensor");
    const modeling = num(inputs, "modeling");
    return nonNegative(assertFinite(license + compute + sensor + modeling));
  },
  },
  {
    id: "user.digital_twin_cost_2",
    family: "general",
    label: "DIGITAL TWIN MALİYET — TimeGain",
    fn: (inputs) => {
    const physCycle = num(inputs, "physCycle");
    const digCycle = num(inputs, "digCycle");
    const iterations = num(inputs, "iterations");
    return nonNegative(assertFinite((physCycle - digCycle) * iterations));
  },
  },
  {
    id: "user.digital_twin_cost_3",
    family: "general",
    label: "DIGITAL TWIN MALİYET — RevenueGain",
    fn: (inputs) => {
    const timeGain = num(inputs, "timeGain");
    const dailyRev = num(inputs, "dailyRev");
    return nonNegative(assertFinite(timeGain * dailyRev));
  },
  },
  {
    id: "user.digital_twin_cost_4",
    family: "general",
    label: "DIGITAL TWIN MALİYET — QualitySavings",
    fn: (inputs) => {
    const defectReduction = num(inputs, "defectReduction");
    const warrantyCost = num(inputs, "warrantyCost");
    const volume = num(inputs, "volume");
    return nonNegative(assertFinite(defectReduction * warrantyCost * volume));
  },
  },
  {
    id: "user.digital_twin_cost_5",
    family: "general",
    label: "DIGITAL TWIN MALİYET — ROI",
    fn: (inputs) => {
    const cost = num(inputs, "cost");
    const Trad = num(inputs, "Trad");
    const revenueGain = num(inputs, "revenueGain");
    const qualitySavings = num(inputs, "qualitySavings");
    return nonNegative(assertFinite((cost_Trad - cost_DT + revenueGain + qualitySavings) / cost_DT));
  },
  },

  // ── DİKİŞ HATTI DENGELEYİCİ (8 formulas) ──
  {
    id: "user.sewing_line_balance_analyzer_pro_0",
    family: "general",
    label: "DİKİŞ HATTI DENGELEYİCİ — TaktTime",
    fn: (inputs) => {
    const availableTime = num(inputs, "availableTime");
    const demand = num(inputs, "demand");
    return nonNegative(assertFinite(availableTime / demand));
  },
  },
  {
    id: "user.sewing_line_balance_analyzer_pro_1",
    family: "general",
    label: "DİKİŞ HATTI DENGELEYİCİ — CycleTotal",
    fn: (inputs) => {
    const sMV = num(inputs, "sMV");
    return nonNegative(assertFinite(SUM(sMV)));
  },
  },
  {
    id: "user.sewing_line_balance_analyzer_pro_2",
    family: "general",
    label: "DİKİŞ HATTI DENGELEYİCİ — TheoOperators",
    fn: (inputs) => {
    const cycleTotal = num(inputs, "cycleTotal");
    const taktTime = num(inputs, "taktTime");
    return nonNegative(assertFinite(cycleTotal / taktTime));
  },
  },
  {
    id: "user.sewing_line_balance_analyzer_pro_3",
    family: "general",
    label: "DİKİŞ HATTI DENGELEYİCİ — ActOperators",
    fn: (inputs) => {
    const theoOperators = num(inputs, "theoOperators");
    return nonNegative(assertFinite(Math.ceil(theoOperators)));
  },
  },
  {
    id: "user.sewing_line_balance_analyzer_pro_4",
    family: "general",
    label: "DİKİŞ HATTI DENGELEYİCİ — LineEff",
    fn: (inputs) => {
    const cycleTotal = num(inputs, "cycleTotal");
    const actOperators = num(inputs, "actOperators");
    const taktTime = num(inputs, "taktTime");
    return nonNegative(assertFinite((cycleTotal / (actOperators * taktTime)) * 100));
  },
  },
  {
    id: "user.sewing_line_balance_analyzer_pro_5",
    family: "general",
    label: "DİKİŞ HATTI DENGELEYİCİ — BalanceDelay",
    fn: (inputs) => {
    const lineEff = num(inputs, "lineEff");
    return nonNegative(assertFinite(100 - lineEff));
  },
  },
  {
    id: "user.sewing_line_balance_analyzer_pro_6",
    family: "general",
    label: "DİKİŞ HATTI DENGELEYİCİ — Smoothness",
    fn: (inputs) => {
    const maxCycle = num(inputs, "maxCycle");
    const cycle = num(inputs, "cycle");
    const i = num(inputs, "i");
    const actOperators = num(inputs, "actOperators");
    return nonNegative(assertFinite(Math.sqrt(SUM((maxCycle - cycle_i)**2) / actOperators)));
  },
  },
  {
    id: "user.sewing_line_balance_analyzer_pro_7",
    family: "general",
    label: "DİKİŞ HATTI DENGELEYİCİ — WIP",
    fn: (inputs) => {
    const bottleneck = num(inputs, "bottleneck");
    const takt = num(inputs, "takt");
    const demand = num(inputs, "demand");
    return nonNegative(assertFinite((bottleneck - takt) * demand));
  },
  },

  // ── DYE REÇETE MALİYET (8 formulas) ──
  {
    id: "user.dye_recipe_cost_0",
    family: "general",
    label: "DYE REÇETE MALİYET — Cost_Dye",
    fn: (inputs) => {
    const conc = num(inputs, "conc");
    const price = num(inputs, "price");
    const bathRatio = num(inputs, "bathRatio");
    return nonNegative(assertFinite(SUM(conc * price) / bathRatio));
  },
  },
  {
    id: "user.dye_recipe_cost_1",
    family: "general",
    label: "DYE REÇETE MALİYET — Cost_Chem",
    fn: (inputs) => {
    const dosage = num(inputs, "dosage");
    const price = num(inputs, "price");
    return nonNegative(assertFinite(SUM(dosage * price)));
  },
  },
  {
    id: "user.dye_recipe_cost_2",
    family: "general",
    label: "DYE REÇETE MALİYET — Cost_Water",
    fn: (inputs) => {
    const liquorRatio = num(inputs, "liquorRatio");
    const weight = num(inputs, "weight");
    const waterTariff = num(inputs, "waterTariff");
    return nonNegative(assertFinite(liquorRatio * weight * waterTariff));
  },
  },
  {
    id: "user.dye_recipe_cost_3",
    family: "general",
    label: "DYE REÇETE MALİYET — Cost_Energy",
    fn: (inputs) => {
    const heating = num(inputs, "heating");
    const holding = num(inputs, "holding");
    const drying = num(inputs, "drying");
    return nonNegative(assertFinite(heating + holding + drying));
  },
  },
  {
    id: "user.dye_recipe_cost_4",
    family: "general",
    label: "DYE REÇETE MALİYET — Cost_Waste",
    fn: (inputs) => {
    const effluent = num(inputs, "effluent");
    const treatCost = num(inputs, "treatCost");
    const surcharge = num(inputs, "surcharge");
    return nonNegative(assertFinite(effluent * treatCost + surcharge));
  },
  },
  {
    id: "user.dye_recipe_cost_5",
    family: "general",
    label: "DYE REÇETE MALİYET — TotalBatch",
    fn: (inputs) => {
    const dye = num(inputs, "dye");
    const chem = num(inputs, "chem");
    const water = num(inputs, "water");
    const energy = num(inputs, "energy");
    const waste = num(inputs, "waste");
    return nonNegative(assertFinite(dye + chem + water + energy + waste));
  },
  },
  {
    id: "user.dye_recipe_cost_6",
    family: "general",
    label: "DYE REÇETE MALİYET — RFT_Savings",
    fn: (inputs) => {
    const rework = num(inputs, "rework");
    const rFT = num(inputs, "rFT");
    return nonNegative(assertFinite(rework * (1 - rFT)));
  },
  },
  {
    id: "user.dye_recipe_cost_7",
    family: "general",
    label: "DYE REÇETE MALİYET — CostPerKg",
    fn: (inputs) => {
    const totalBatch = num(inputs, "totalBatch");
    const rFT = num(inputs, "rFT");
    const Savings = num(inputs, "Savings");
    const weight = num(inputs, "weight");
    return nonNegative(assertFinite((totalBatch + rFT_Savings) / weight));
  },
  },

  // ── ENERJİ TÜKETİM RAPORU (8 formulas) ──
  {
    id: "user.energy_consumption_report_0",
    family: "general",
    label: "ENERJİ TÜKETİM RAPORU — Active",
    fn: (inputs) => {
    const kWh = num(inputs, "kWh");
    return nonNegative(assertFinite(SUM(kWh)));
  },
  },
  {
    id: "user.energy_consumption_report_1",
    family: "general",
    label: "ENERJİ TÜKETİM RAPORU — Reactive",
    fn: (inputs) => {
    const kVArh = num(inputs, "kVArh");
    return nonNegative(assertFinite(SUM(kVArh)));
  },
  },
  {
    id: "user.energy_consumption_report_2",
    family: "general",
    label: "ENERJİ TÜKETİM RAPORU — PF",
    fn: (inputs) => {
    const active = num(inputs, "active");
    const reactive = num(inputs, "reactive");
    return nonNegative(assertFinite(active / Math.sqrt(active**2 + reactive**2)));
  },
  },
  {
    id: "user.energy_consumption_report_3",
    family: "general",
    label: "ENERJİ TÜKETİM RAPORU — ReactivePenalty",
    fn: (inputs) => {
    const pF = num(inputs, "pF");
    const thresh = num(inputs, "thresh");
    const reactive = num(inputs, "reactive");
    const active = num(inputs, "active");
    const tariff = num(inputs, "tariff");
    return nonNegative(assertFinite(((pF < thresh) ? ((reactive - active * Math.tan(Math.acos(thresh))) * tariff) : (0))));
  },
  },
  {
    id: "user.energy_consumption_report_4",
    family: "general",
    label: "ENERJİ TÜKETİM RAPORU — DemandCharge",
    fn: (inputs) => {
    const peak = num(inputs, "peak");
    const kW = num(inputs, "kW");
    const demandRate = num(inputs, "demandRate");
    return nonNegative(assertFinite(peak_kW * demandRate));
  },
  },
  {
    id: "user.energy_consumption_report_5",
    family: "general",
    label: "ENERJİ TÜKETİM RAPORU — TOU",
    fn: (inputs) => {
    const kWh = num(inputs, "kWh");
    const tOU = num(inputs, "tOU");
    const Rate = num(inputs, "Rate");
    return nonNegative(assertFinite(SUM(kWh * tOU_Rate)));
  },
  },
  {
    id: "user.energy_consumption_report_6",
    family: "general",
    label: "ENERJİ TÜKETİM RAPORU — Total",
    fn: (inputs) => {
    const base = num(inputs, "base");
    const tOU = num(inputs, "tOU");
    const demand = num(inputs, "demand");
    const penalty = num(inputs, "penalty");
    const tax = num(inputs, "tax");
    return nonNegative(assertFinite(base + tOU + demand + penalty + tax));
  },
  },
  {
    id: "user.energy_consumption_report_7",
    family: "general",
    label: "ENERJİ TÜKETİM RAPORU — Carbon",
    fn: (inputs) => {
    const active = num(inputs, "active");
    const emisFactor = num(inputs, "emisFactor");
    const carbonPrice = num(inputs, "carbonPrice");
    return nonNegative(assertFinite(active * emisFactor * carbonPrice));
  },
  },

  // ── ENFLASYON ESKALASYON (8 formulas) ──
  {
    id: "user.inflation_escalation_0",
    family: "general",
    label: "ENFLASYON ESKALASYON — Esc_Mat",
    fn: (inputs) => {
    const infl = num(inputs, "infl");
    const Mat = num(inputs, "Mat");
    const years = num(inputs, "years");
    return nonNegative(assertFinite((1 + infl_Mat)**years));
  },
  },
  {
    id: "user.inflation_escalation_1",
    family: "general",
    label: "ENFLASYON ESKALASYON — Esc_Lab",
    fn: (inputs) => {
    const infl = num(inputs, "infl");
    const Lab = num(inputs, "Lab");
    const years = num(inputs, "years");
    return nonNegative(assertFinite((1 + infl_Lab)**years));
  },
  },
  {
    id: "user.inflation_escalation_2",
    family: "general",
    label: "ENFLASYON ESKALASYON — BaseAdj",
    fn: (inputs) => {
    const baseMat = num(inputs, "baseMat");
    const esc = num(inputs, "esc");
    const Mat = num(inputs, "Mat");
    const baseLab = num(inputs, "baseLab");
    const Lab = num(inputs, "Lab");
    return nonNegative(assertFinite(baseMat * esc_Mat + baseLab * esc_Lab));
  },
  },
  {
    id: "user.inflation_escalation_3",
    family: "general",
    label: "ENFLASYON ESKALASYON — RealDisc",
    fn: (inputs) => {
    const nominal = num(inputs, "nominal");
    const infl = num(inputs, "infl");
    return nonNegative(assertFinite(((1 + nominal) / (1 + infl)) - 1));
  },
  },
  {
    id: "user.inflation_escalation_4",
    family: "general",
    label: "ENFLASYON ESKALASYON — NPV_Nom",
    fn: (inputs) => {
    const cash = num(inputs, "cash");
    const esc = num(inputs, "esc");
    const nom = num(inputs, "nom");
    const t = num(inputs, "t");
    return nonNegative(assertFinite(SUM(cash * esc / (1 + nom)**t)));
  },
  },
  {
    id: "user.inflation_escalation_5",
    family: "general",
    label: "ENFLASYON ESKALASYON — NPV_Real",
    fn: (inputs) => {
    const cash = num(inputs, "cash");
    const real = num(inputs, "real");
    const t = num(inputs, "t");
    return nonNegative(assertFinite(SUM(cash / (1 + real)**t)));
  },
  },
  {
    id: "user.inflation_escalation_6",
    family: "general",
    label: "ENFLASYON ESKALASYON — Contingency",
    fn: (inputs) => {
    const baseAdj = num(inputs, "baseAdj");
    const confFactor = num(inputs, "confFactor");
    return nonNegative(assertFinite(baseAdj * confFactor));
  },
  },
  {
    id: "user.inflation_escalation_7",
    family: "general",
    label: "ENFLASYON ESKALASYON — Total",
    fn: (inputs) => {
    const baseAdj = num(inputs, "baseAdj");
    const contingency = num(inputs, "contingency");
    return nonNegative(assertFinite(baseAdj + contingency));
  },
  },

  // ── ENVIRONMENTAL FIRE (8 formulas) ──
  {
    id: "user.environmental_waste_cost_0",
    family: "general",
    label: "ENVIRONMENTAL FIRE — Cost_Disp",
    fn: (inputs) => {
    const waste = num(inputs, "waste");
    const dispFee = num(inputs, "dispFee");
    return nonNegative(assertFinite(waste * dispFee));
  },
  },
  {
    id: "user.environmental_waste_cost_1",
    family: "general",
    label: "ENVIRONMENTAL FIRE — Cost_Haz",
    fn: (inputs) => {
    const hazMass = num(inputs, "hazMass");
    const hazFee = num(inputs, "hazFee");
    const surcharge = num(inputs, "surcharge");
    return nonNegative(assertFinite(hazMass * (hazFee + surcharge)));
  },
  },
  {
    id: "user.environmental_waste_cost_2",
    family: "general",
    label: "ENVIRONMENTAL FIRE — Cost_Recyc",
    fn: (inputs) => {
    const recycMass = num(inputs, "recycMass");
    const sortCost = num(inputs, "sortCost");
    const scrapRev = num(inputs, "scrapRev");
    return nonNegative(assertFinite(recycMass * (sortCost - scrapRev)));
  },
  },
  {
    id: "user.environmental_waste_cost_3",
    family: "general",
    label: "ENVIRONMENTAL FIRE — Cost_Emis",
    fn: (inputs) => {
    const air = num(inputs, "air");
    const carbonPrice = num(inputs, "carbonPrice");
    const water = num(inputs, "water");
    const treatCost = num(inputs, "treatCost");
    return nonNegative(assertFinite(air * carbonPrice + water * treatCost));
  },
  },
  {
    id: "user.environmental_waste_cost_4",
    family: "general",
    label: "ENVIRONMENTAL FIRE — PenaltyRisk",
    fn: (inputs) => {
    const probViolation = num(inputs, "probViolation");
    const fine = num(inputs, "fine");
    return nonNegative(assertFinite(probViolation * fine));
  },
  },
  {
    id: "user.environmental_waste_cost_5",
    family: "general",
    label: "ENVIRONMENTAL FIRE — Total",
    fn: (inputs) => {
    const disp = num(inputs, "disp");
    const haz = num(inputs, "haz");
    const recyc = num(inputs, "recyc");
    const emis = num(inputs, "emis");
    const penalty = num(inputs, "penalty");
    return nonNegative(assertFinite(disp + haz + recyc + emis + penalty));
  },
  },
  {
    id: "user.environmental_waste_cost_6",
    family: "general",
    label: "ENVIRONMENTAL FIRE — WasteIntensity",
    fn: (inputs) => {
    const totalWaste = num(inputs, "totalWaste");
    const volume = num(inputs, "volume");
    return nonNegative(assertFinite(totalWaste / volume));
  },
  },
  {
    id: "user.environmental_waste_cost_7",
    family: "general",
    label: "ENVIRONMENTAL FIRE — Circularity",
    fn: (inputs) => {
    const recyc = num(inputs, "recyc");
    const totalWaste = num(inputs, "totalWaste");
    return nonNegative(assertFinite(recyc / totalWaste));
  },
  },

  // ── EOQ ENVANTER (7 formulas) ──
  {
    id: "user.eoq_inventory_optimizer_0",
    family: "general",
    label: "EOQ ENVANTER — EOQ",
    fn: (inputs) => {
    const demand = num(inputs, "demand");
    const orderCost = num(inputs, "orderCost");
    const holdingCost = num(inputs, "holdingCost");
    return nonNegative(assertFinite(Math.sqrt((2 * demand * orderCost) / holdingCost)));
  },
  },
  {
    id: "user.eoq_inventory_optimizer_1",
    family: "general",
    label: "EOQ ENVANTER — ROP",
    fn: (inputs) => {
    const leadTime = num(inputs, "leadTime");
    const dailyDemand = num(inputs, "dailyDemand");
    const safetyStock = num(inputs, "safetyStock");
    return nonNegative(assertFinite((leadTime * dailyDemand) + safetyStock));
  },
  },
  {
    id: "user.eoq_inventory_optimizer_2",
    family: "general",
    label: "EOQ ENVANTER — SafetyStock",
    fn: (inputs) => {
    const z = num(inputs, "z");
    const stdDev = num(inputs, "stdDev");
    const leadTime = num(inputs, "leadTime");
    return nonNegative(assertFinite(z * stdDev * Math.sqrt(leadTime)));
  },
  },
  {
    id: "user.eoq_inventory_optimizer_3",
    family: "general",
    label: "EOQ ENVANTER — TotalCost",
    fn: (inputs) => {
    const demand = num(inputs, "demand");
    const eOQ = num(inputs, "eOQ");
    const orderCost = num(inputs, "orderCost");
    const safety = num(inputs, "safety");
    const holdingCost = num(inputs, "holdingCost");
    return nonNegative(assertFinite((demand / eOQ) * orderCost + (eOQ / 2 + safety) * holdingCost));
  },
  },
  {
    id: "user.eoq_inventory_optimizer_4",
    family: "general",
    label: "EOQ ENVANTER — CycleStock",
    fn: (inputs) => {
    const eOQ = num(inputs, "eOQ");
    return nonNegative(assertFinite(eOQ / 2));
  },
  },
  {
    id: "user.eoq_inventory_optimizer_5",
    family: "general",
    label: "EOQ ENVANTER — Turnover",
    fn: (inputs) => {
    const demand = num(inputs, "demand");
    const avgInv = num(inputs, "avgInv");
    return nonNegative(assertFinite(demand / avgInv));
  },
  },
  {
    id: "user.eoq_inventory_optimizer_6",
    family: "general",
    label: "EOQ ENVANTER — DaysSales",
    fn: (inputs) => {
    const turnover = num(inputs, "turnover");
    return nonNegative(assertFinite(365 / turnover));
  },
  },

  // ── EVM MALİYET FORECAST (9 formulas) ──
  {
    id: "user.evm_cost_forecast_0",
    family: "general",
    label: "EVM MALİYET FORECAST — SV",
    fn: (inputs) => {
    const eV = num(inputs, "eV");
    const pV = num(inputs, "pV");
    return nonNegative(assertFinite(eV - pV));
  },
  },
  {
    id: "user.evm_cost_forecast_1",
    family: "general",
    label: "EVM MALİYET FORECAST — CV",
    fn: (inputs) => {
    const eV = num(inputs, "eV");
    const aC = num(inputs, "aC");
    return nonNegative(assertFinite(eV - aC));
  },
  },
  {
    id: "user.evm_cost_forecast_2",
    family: "general",
    label: "EVM MALİYET FORECAST — SPI",
    fn: (inputs) => {
    const eV = num(inputs, "eV");
    const pV = num(inputs, "pV");
    return nonNegative(assertFinite(eV / pV));
  },
  },
  {
    id: "user.evm_cost_forecast_3",
    family: "general",
    label: "EVM MALİYET FORECAST — CPI",
    fn: (inputs) => {
    const eV = num(inputs, "eV");
    const aC = num(inputs, "aC");
    return nonNegative(assertFinite(eV / aC));
  },
  },
  {
    id: "user.evm_cost_forecast_4",
    family: "general",
    label: "EVM MALİYET FORECAST — EAC_CPI",
    fn: (inputs) => {
    const bAC = num(inputs, "bAC");
    const cPI = num(inputs, "cPI");
    return nonNegative(assertFinite(bAC / cPI));
  },
  },
  {
    id: "user.evm_cost_forecast_5",
    family: "general",
    label: "EVM MALİYET FORECAST — EAC_CPI_SPI",
    fn: (inputs) => {
    const aC = num(inputs, "aC");
    const bAC = num(inputs, "bAC");
    const eV = num(inputs, "eV");
    const cPI = num(inputs, "cPI");
    const sPI = num(inputs, "sPI");
    return nonNegative(assertFinite(aC + ((bAC - eV) / (cPI * sPI))));
  },
  },
  {
    id: "user.evm_cost_forecast_6",
    family: "general",
    label: "EVM MALİYET FORECAST — ETC",
    fn: (inputs) => {
    const eAC = num(inputs, "eAC");
    const aC = num(inputs, "aC");
    return nonNegative(assertFinite(eAC - aC));
  },
  },
  {
    id: "user.evm_cost_forecast_7",
    family: "general",
    label: "EVM MALİYET FORECAST — VAC",
    fn: (inputs) => {
    const bAC = num(inputs, "bAC");
    const eAC = num(inputs, "eAC");
    return nonNegative(assertFinite(bAC - eAC));
  },
  },
  {
    id: "user.evm_cost_forecast_8",
    family: "general",
    label: "EVM MALİYET FORECAST — TCPI",
    fn: (inputs) => {
    const bAC = num(inputs, "bAC");
    const eV = num(inputs, "eV");
    const aC = num(inputs, "aC");
    return nonNegative(assertFinite((bAC - eV) / (bAC - aC)));
  },
  },

  // ── FABRİKA YERLEŞİM MESAFE (7 formulas) ──
  {
    id: "user.factory_layout_distance_0",
    family: "general",
    label: "FABRİKA YERLEŞİM MESAFE — Dist_ij",
    fn: (inputs) => {
    const x = num(inputs, "x");
    const i = num(inputs, "i");
    const j = num(inputs, "j");
    const y = num(inputs, "y");
    return nonNegative(assertFinite(Math.abs(x_i - x_j) + Math.abs(y_i - y_j)));
  },
  },
  {
    id: "user.factory_layout_distance_1",
    family: "general",
    label: "FABRİKA YERLEŞİM MESAFE — FlowCost",
    fn: (inputs) => {
    const flow = num(inputs, "flow");
    const ij = num(inputs, "ij");
    const dist = num(inputs, "dist");
    const costPerDist = num(inputs, "costPerDist");
    return nonNegative(assertFinite(SUM(flow_ij * dist_ij * costPerDist)));
  },
  },
  {
    id: "user.factory_layout_distance_2",
    family: "general",
    label: "FABRİKA YERLEŞİM MESAFE — AdjScore",
    fn: (inputs) => {
    const flow = num(inputs, "flow");
    const ij = num(inputs, "ij");
    const adjFactor = num(inputs, "adjFactor");
    return nonNegative(assertFinite(SUM(flow_ij * adjFactor_ij)));
  },
  },
  {
    id: "user.factory_layout_distance_3",
    family: "general",
    label: "FABRİKA YERLEŞİM MESAFE — SpaceUtil",
    fn: (inputs) => {
    const equipArea = num(inputs, "equipArea");
    const facArea = num(inputs, "facArea");
    return nonNegative(assertFinite(equipArea / facArea));
  },
  },
  {
    id: "user.factory_layout_distance_4",
    family: "general",
    label: "FABRİKA YERLEŞİM MESAFE — MatHandCost",
    fn: (inputs) => {
    const flowCost = num(inputs, "flowCost");
    const handRate = num(inputs, "handRate");
    return nonNegative(assertFinite(flowCost * handRate));
  },
  },
  {
    id: "user.factory_layout_distance_5",
    family: "general",
    label: "FABRİKA YERLEŞİM MESAFE — Congestion",
    fn: (inputs) => {
    const crossTraffic = num(inputs, "crossTraffic");
    const aisleCap = num(inputs, "aisleCap");
    return nonNegative(assertFinite(1 + (crossTraffic / aisleCap)));
  },
  },
  {
    id: "user.factory_layout_distance_6",
    family: "general",
    label: "FABRİKA YERLEŞİM MESAFE — TotalCost",
    fn: (inputs) => {
    const matHand = num(inputs, "matHand");
    const space = num(inputs, "space");
    const congestion = num(inputs, "congestion");
    return nonNegative(assertFinite(matHand + space + congestion));
  },
  },

  // ── FAİZ ORANI RİSKİ (8 formulas) ──
  {
    id: "user.interest_rate_risk_0",
    family: "general",
    label: "FAİZ ORANI RİSKİ — Exposure",
    fn: (inputs) => {
    const floatingDebt = num(inputs, "floatingDebt");
    const hedgeRatio = num(inputs, "hedgeRatio");
    return nonNegative(assertFinite(floatingDebt * (1 - hedgeRatio)));
  },
  },
  {
    id: "user.interest_rate_risk_1",
    family: "general",
    label: "FAİZ ORANI RİSKİ — ShockImpact",
    fn: (inputs) => {
    const exposure = num(inputs, "exposure");
    const bpsChange = num(inputs, "bpsChange");
    return nonNegative(assertFinite(exposure * bpsChange / 10000));
  },
  },
  {
    id: "user.interest_rate_risk_2",
    family: "general",
    label: "FAİZ ORANI RİSKİ — DurGap",
    fn: (inputs) => {
    const assetDur = num(inputs, "assetDur");
    const liabDur = num(inputs, "liabDur");
    return nonNegative(assertFinite(assetDur - liabDur));
  },
  },
  {
    id: "user.interest_rate_risk_3",
    family: "general",
    label: "FAİZ ORANI RİSKİ — EVE_Change",
    fn: (inputs) => {
    const durGap = num(inputs, "durGap");
    const assetVal = num(inputs, "assetVal");
    const rateChange = num(inputs, "rateChange");
    return nonNegative(assertFinite(-durGap * assetVal * rateChange));
  },
  },
  {
    id: "user.interest_rate_risk_4",
    family: "general",
    label: "FAİZ ORANI RİSKİ — NIM",
    fn: (inputs) => {
    const inc = num(inputs, "inc");
    const earningAssets = num(inputs, "earningAssets");
    return nonNegative(assertFinite((inc - exp) / earningAssets));
  },
  },
  {
    id: "user.interest_rate_risk_5",
    family: "general",
    label: "FAİZ ORANI RİSKİ — VaR",
    fn: (inputs) => {
    const portVal = num(inputs, "portVal");
    const volatility = num(inputs, "volatility");
    const z = num(inputs, "z");
    return nonNegative(assertFinite(portVal * volatility * z));
  },
  },
  {
    id: "user.interest_rate_risk_6",
    family: "general",
    label: "FAİZ ORANI RİSKİ — HedgeCost",
    fn: (inputs) => {
    const notional = num(inputs, "notional");
    const swapSpread = num(inputs, "swapSpread");
    return nonNegative(assertFinite(notional * swapSpread));
  },
  },
  {
    id: "user.interest_rate_risk_7",
    family: "general",
    label: "FAİZ ORANI RİSKİ — BreakEven",
    fn: (inputs) => {
    const fixed = num(inputs, "fixed");
    const floating = num(inputs, "floating");
    const Curr = num(inputs, "Curr");
    return nonNegative(assertFinite(fixed - floating_Curr));
  },
  },

  // ── FILAMENT RECYCLING (7 formulas) ──
  {
    id: "user.filament_recycling_0",
    family: "general",
    label: "FILAMENT RECYCLING — Cost_Virgin",
    fn: (inputs) => {
    const price = num(inputs, "price");
    const scrap = num(inputs, "scrap");
    const transp = num(inputs, "transp");
    return nonNegative(assertFinite(price_V * (1 + scrap_V) + transp_V));
  },
  },
  {
    id: "user.filament_recycling_1",
    family: "general",
    label: "FILAMENT RECYCLING — Cost_Recyc",
    fn: (inputs) => {
    const collect = num(inputs, "collect");
    const sort = num(inputs, "sort");
    const pellet = num(inputs, "pellet");
    const yield = num(inputs, "yield");
    return nonNegative(assertFinite((collect + sort + pellet) / yield));
  },
  },
  {
    id: "user.filament_recycling_2",
    family: "general",
    label: "FILAMENT RECYCLING — QualPenalty",
    fn: (inputs) => {
    const tensile = num(inputs, "tensile");
    const appFactor = num(inputs, "appFactor");
    return nonNegative(assertFinite((tensile_V - tensile_R) * appFactor));
  },
  },
  {
    id: "user.filament_recycling_3",
    family: "general",
    label: "FILAMENT RECYCLING — EnergySav",
    fn: (inputs) => {
    const energy = num(inputs, "energy");
    const energyCost = num(inputs, "energyCost");
    return nonNegative(assertFinite((energy_V - energy_R) * energyCost));
  },
  },
  {
    id: "user.filament_recycling_4",
    family: "general",
    label: "FILAMENT RECYCLING — CarbonCred",
    fn: (inputs) => {
    const cO2 = num(inputs, "cO2");
    const carbonPrice = num(inputs, "carbonPrice");
    return nonNegative(assertFinite((cO2_V - cO2_R) * carbonPrice));
  },
  },
  {
    id: "user.filament_recycling_5",
    family: "general",
    label: "FILAMENT RECYCLING — Total_R",
    fn: (inputs) => {
    const cost = num(inputs, "cost");
    const Recyc = num(inputs, "Recyc");
    const qualPenalty = num(inputs, "qualPenalty");
    const energySav = num(inputs, "energySav");
    const carbonCred = num(inputs, "carbonCred");
    return nonNegative(assertFinite(cost_Recyc + qualPenalty - energySav - carbonCred));
  },
  },
  {
    id: "user.filament_recycling_6",
    family: "general",
    label: "FILAMENT RECYCLING — ROI",
    fn: (inputs) => {
    const cost = num(inputs, "cost");
    const total = num(inputs, "total");
    const vol = num(inputs, "vol");
    const capex = num(inputs, "capex");
    return nonNegative(assertFinite((cost_V - total_R) * vol / capex));
  },
  },

  // ── FİYAT ESNEKLİĞİ (8 formulas) ──
  {
    id: "user.price_elasticity_0",
    family: "general",
    label: "FİYAT ESNEKLİĞİ — Elasticity",
    fn: (inputs) => {
    const pctChange = num(inputs, "pctChange");
    const Dem = num(inputs, "Dem");
    const Price = num(inputs, "Price");
    return nonNegative(assertFinite(pctChange_Dem / pctChange_Price));
  },
  },
  {
    id: "user.price_elasticity_1",
    family: "general",
    label: "FİYAT ESNEKLİĞİ — NewDem",
    fn: (inputs) => {
    const currDem = num(inputs, "currDem");
    const elast = num(inputs, "elast");
    const pctChange = num(inputs, "pctChange");
    const Price = num(inputs, "Price");
    return nonNegative(assertFinite(currDem * (1 + elast * pctChange_Price)));
  },
  },
  {
    id: "user.price_elasticity_2",
    family: "general",
    label: "FİYAT ESNEKLİĞİ — NewRev",
    fn: (inputs) => {
    const newPrice = num(inputs, "newPrice");
    const newDem = num(inputs, "newDem");
    return nonNegative(assertFinite(newPrice * newDem));
  },
  },
  {
    id: "user.price_elasticity_3",
    family: "general",
    label: "FİYAT ESNEKLİĞİ — NewMargin",
    fn: (inputs) => {
    const newPrice = num(inputs, "newPrice");
    const varCost = num(inputs, "varCost");
    const newDem = num(inputs, "newDem");
    const fixed = num(inputs, "fixed");
    return nonNegative(assertFinite((newPrice - varCost) * newDem - fixed));
  },
  },
  {
    id: "user.price_elasticity_4",
    family: "general",
    label: "FİYAT ESNEKLİĞİ — MaxPrice",
    fn: (inputs) => {
    const elast = num(inputs, "elast");
    const varCost = num(inputs, "varCost");
    return nonNegative(assertFinite((elast / (elast + 1)) * varCost));
  },
  },
  {
    id: "user.price_elasticity_5",
    family: "general",
    label: "FİYAT ESNEKLİĞİ — Markup",
    fn: (inputs) => {
    const elast = num(inputs, "elast");
    return nonNegative(assertFinite(-1 / (elast + 1)));
  },
  },
  {
    id: "user.price_elasticity_6",
    family: "general",
    label: "FİYAT ESNEKLİĞİ — CannibLoss",
    fn: (inputs) => {
    const newDem = num(inputs, "newDem");
    const cannibRate = num(inputs, "cannibRate");
    const margin = num(inputs, "margin");
    const Other = num(inputs, "Other");
    return nonNegative(assertFinite(newDem * cannibRate * margin_Other));
  },
  },
  {
    id: "user.price_elasticity_7",
    family: "general",
    label: "FİYAT ESNEKLİĞİ — NetImpact",
    fn: (inputs) => {
    const newMargin = num(inputs, "newMargin");
    const currMargin = num(inputs, "currMargin");
    const cannib = num(inputs, "cannib");
    return nonNegative(assertFinite(newMargin - currMargin - cannib));
  },
  },

  // ── FLEXIBLE MANUFACTURING ROI (6 formulas) ──
  {
    id: "user.flexible_manufacturing_roi_0",
    family: "general",
    label: "FLEXIBLE MANUFACTURING ROI — Cost_Ded",
    fn: (inputs) => {
    const mach = num(inputs, "mach");
    const Ded = num(inputs, "Ded");
    const setup = num(inputs, "setup");
    const changeovers = num(inputs, "changeovers");
    const inv = num(inputs, "inv");
    const High = num(inputs, "High");
    return nonNegative(assertFinite(mach_Ded + setup_Ded * changeovers + inv_High));
  },
  },
  {
    id: "user.flexible_manufacturing_roi_1",
    family: "general",
    label: "FLEXIBLE MANUFACTURING ROI — Cost_Flex",
    fn: (inputs) => {
    const mach = num(inputs, "mach");
    const tool = num(inputs, "tool");
    const prog = num(inputs, "prog");
    const maint = num(inputs, "maint");
    return nonNegative(assertFinite(mach_FMS + tool_FMS + prog + maint));
  },
  },
  {
    id: "user.flexible_manufacturing_roi_2",
    family: "general",
    label: "FLEXIBLE MANUFACTURING ROI — FlexVal",
    fn: (inputs) => {
    const tTM = num(inputs, "tTM");
    const Red = num(inputs, "Red");
    const revGain = num(inputs, "revGain");
    const custPrem = num(inputs, "custPrem");
    const vol = num(inputs, "vol");
    return nonNegative(assertFinite((tTM_Red * revGain) + (custPrem * vol)));
  },
  },
  {
    id: "user.flexible_manufacturing_roi_3",
    family: "general",
    label: "FLEXIBLE MANUFACTURING ROI — InvSav",
    fn: (inputs) => {
    const wIP = num(inputs, "wIP");
    const Ded = num(inputs, "Ded");
    const Flex = num(inputs, "Flex");
    const carryCost = num(inputs, "carryCost");
    return nonNegative(assertFinite((wIP_Ded - wIP_Flex) * carryCost));
  },
  },
  {
    id: "user.flexible_manufacturing_roi_4",
    family: "general",
    label: "FLEXIBLE MANUFACTURING ROI — ScrapRed",
    fn: (inputs) => {
    const scrap = num(inputs, "scrap");
    const Ded = num(inputs, "Ded");
    const Flex = num(inputs, "Flex");
    const vol = num(inputs, "vol");
    const unitCost = num(inputs, "unitCost");
    return nonNegative(assertFinite((scrap_Ded - scrap_Flex) * vol * unitCost));
  },
  },
  {
    id: "user.flexible_manufacturing_roi_5",
    family: "general",
    label: "FLEXIBLE MANUFACTURING ROI — ROI",
    fn: (inputs) => {
    const cost = num(inputs, "cost");
    const Ded = num(inputs, "Ded");
    const Flex = num(inputs, "Flex");
    const flexVal = num(inputs, "flexVal");
    const invSav = num(inputs, "invSav");
    const scrapRed = num(inputs, "scrapRed");
    const capex = num(inputs, "capex");
    return nonNegative(assertFinite((cost_Ded - cost_Flex + flexVal + invSav + scrapRed) / capex));
  },
  },

  // ── GAGE R&R MALİYET (9 formulas) ──
  {
    id: "user.gage_rnr_cost_0",
    family: "general",
    label: "GAGE R&R MALİYET — EV",
    fn: (inputs) => {
    const range = num(inputs, "range");
    const Avg = num(inputs, "Avg");
    const d2 = num(inputs, "d2");
    const star = num(inputs, "star");
    return nonNegative(assertFinite(range_Avg * d2_star));
  },
  },
  {
    id: "user.gage_rnr_cost_1",
    family: "general",
    label: "GAGE R&R MALİYET — AV",
    fn: (inputs) => {
    const range = num(inputs, "range");
    const Ops = num(inputs, "Ops");
    const d2 = num(inputs, "d2");
    const star = num(inputs, "star");
    const eV = num(inputs, "eV");
    const n = num(inputs, "n");
    const r = num(inputs, "r");
    return nonNegative(assertFinite(Math.sqrt((range_Ops / d2_star)**2 - (eV**2 / (n * r)))));
  },
  },
  {
    id: "user.gage_rnr_cost_2",
    family: "general",
    label: "GAGE R&R MALİYET — GRR",
    fn: (inputs) => {
    const eV = num(inputs, "eV");
    const aV = num(inputs, "aV");
    return nonNegative(assertFinite(Math.sqrt(eV**2 + aV**2)));
  },
  },
  {
    id: "user.gage_rnr_cost_3",
    family: "general",
    label: "GAGE R&R MALİYET — PV",
    fn: (inputs) => {
    const range = num(inputs, "range");
    const Parts = num(inputs, "Parts");
    const d2 = num(inputs, "d2");
    const star = num(inputs, "star");
    return nonNegative(assertFinite(range_Parts / d2_star));
  },
  },
  {
    id: "user.gage_rnr_cost_4",
    family: "general",
    label: "GAGE R&R MALİYET — TV",
    fn: (inputs) => {
    const gRR = num(inputs, "gRR");
    const pV = num(inputs, "pV");
    return nonNegative(assertFinite(Math.sqrt(gRR**2 + pV**2)));
  },
  },
  {
    id: "user.gage_rnr_cost_5",
    family: "general",
    label: "GAGE R&R MALİYET — PctGRR",
    fn: (inputs) => {
    const gRR = num(inputs, "gRR");
    const tV = num(inputs, "tV");
    return nonNegative(assertFinite((gRR / tV) * 100));
  },
  },
  {
    id: "user.gage_rnr_cost_6",
    family: "general",
    label: "GAGE R&R MALİYET — CostError",
    fn: (inputs) => {
    const falseAcc = num(inputs, "falseAcc");
    const escapeCost = num(inputs, "escapeCost");
    const falseRej = num(inputs, "falseRej");
    const scrapCost = num(inputs, "scrapCost");
    return nonNegative(assertFinite((falseAcc * escapeCost) + (falseRej * scrapCost)));
  },
  },
  {
    id: "user.gage_rnr_cost_7",
    family: "general",
    label: "GAGE R&R MALİYET — OptTol",
    fn: (inputs) => {
    const gRR = num(inputs, "gRR");
    return nonNegative(assertFinite(gRR * 6));
  },
  },
  {
    id: "user.gage_rnr_cost_8",
    family: "general",
    label: "GAGE R&R MALİYET — FinImpact",
    fn: (inputs) => {
    const pctGRR = num(inputs, "pctGRR");
    const totalQualCost = num(inputs, "totalQualCost");
    return nonNegative(assertFinite(pctGRR * totalQualCost));
  },
  },

  // ── GIDA FİRE MARJ (9 formulas) ──
  {
    id: "user.food_waste_margin_0",
    family: "general",
    label: "GIDA FİRE MARJ — Yield",
    fn: (inputs) => {
    const finished = num(inputs, "finished");
    const raw = num(inputs, "raw");
    return nonNegative(assertFinite(finished / raw));
  },
  },
  {
    id: "user.food_waste_margin_1",
    family: "general",
    label: "GIDA FİRE MARJ — Shrinkage",
    fn: (inputs) => {
    const raw = num(inputs, "raw");
    const finished = num(inputs, "finished");
    return nonNegative(assertFinite(raw - finished));
  },
  },
  {
    id: "user.food_waste_margin_2",
    family: "general",
    label: "GIDA FİRE MARJ — Cost_Shrink",
    fn: (inputs) => {
    const shrinkage = num(inputs, "shrinkage");
    const rawCost = num(inputs, "rawCost");
    return nonNegative(assertFinite(shrinkage * rawCost));
  },
  },
  {
    id: "user.food_waste_margin_3",
    family: "general",
    label: "GIDA FİRE MARJ — Cost_Spoil",
    fn: (inputs) => {
    const spoiled = num(inputs, "spoiled");
    const prodCost = num(inputs, "prodCost");
    return nonNegative(assertFinite(spoiled * prodCost));
  },
  },
  {
    id: "user.food_waste_margin_4",
    family: "general",
    label: "GIDA FİRE MARJ — Cost_Over",
    fn: (inputs) => {
    const excess = num(inputs, "excess");
    const unitCost = num(inputs, "unitCost");
    const salvage = num(inputs, "salvage");
    return nonNegative(assertFinite(excess * (unitCost - salvage)));
  },
  },
  {
    id: "user.food_waste_margin_5",
    family: "general",
    label: "GIDA FİRE MARJ — MarginLeak",
    fn: (inputs) => {
    const shrink = num(inputs, "shrink");
    const spoil = num(inputs, "spoil");
    const over = num(inputs, "over");
    return nonNegative(assertFinite(shrink + spoil + over));
  },
  },
  {
    id: "user.food_waste_margin_6",
    family: "general",
    label: "GIDA FİRE MARJ — OEE_Food",
    fn: (inputs) => {
    const avail = num(inputs, "avail");
    const perf = num(inputs, "perf");
    const qual = num(inputs, "qual");
    const Yield = num(inputs, "Yield");
    return nonNegative(assertFinite(avail * perf * qual_Yield));
  },
  },
  {
    id: "user.food_waste_margin_7",
    family: "general",
    label: "GIDA FİRE MARJ — TheoUsage",
    fn: (inputs) => {
    const recipe = num(inputs, "recipe");
    const actualProd = num(inputs, "actualProd");
    return nonNegative(assertFinite(recipe * actualProd));
  },
  },
  {
    id: "user.food_waste_margin_8",
    family: "general",
    label: "GIDA FİRE MARJ — Variance",
    fn: (inputs) => {
    const actual = num(inputs, "actual");
    const theo = num(inputs, "theo");
    return nonNegative(assertFinite(actual - theo));
  },
  },

  // ── GÜBRE DOZAJ (8 formulas) ──
  {
    id: "user.fertilizer_dosage_0",
    family: "general",
    label: "GÜBRE DOZAJ — NutReq",
    fn: (inputs) => {
    const yieldTarget = num(inputs, "yieldTarget");
    const remRate = num(inputs, "remRate");
    return nonNegative(assertFinite(yieldTarget * remRate));
  },
  },
  {
    id: "user.fertilizer_dosage_1",
    family: "general",
    label: "GÜBRE DOZAJ — SoilSupp",
    fn: (inputs) => {
    const soilTest = num(inputs, "soilTest");
    const convFactor = num(inputs, "convFactor");
    return nonNegative(assertFinite(soilTest * convFactor));
  },
  },
  {
    id: "user.fertilizer_dosage_2",
    family: "general",
    label: "GÜBRE DOZAJ — FertNeed",
    fn: (inputs) => {
    const nutReq = num(inputs, "nutReq");
    const soilSupp = num(inputs, "soilSupp");
    const eff = num(inputs, "eff");
    return nonNegative(assertFinite((nutReq - soilSupp) / eff));
  },
  },
  {
    id: "user.fertilizer_dosage_3",
    family: "general",
    label: "GÜBRE DOZAJ — AppRate",
    fn: (inputs) => {
    const fertNeed = num(inputs, "fertNeed");
    const contentPct = num(inputs, "contentPct");
    return nonNegative(assertFinite(fertNeed / contentPct));
  },
  },
  {
    id: "user.fertilizer_dosage_4",
    family: "general",
    label: "GÜBRE DOZAJ — Cost",
    fn: (inputs) => {
    const appRate = num(inputs, "appRate");
    const area = num(inputs, "area");
    const price = num(inputs, "price");
    return nonNegative(assertFinite(appRate * area * price));
  },
  },
  {
    id: "user.fertilizer_dosage_5",
    family: "general",
    label: "GÜBRE DOZAJ — EnvRisk",
    fn: (inputs) => {
    const appRate = num(inputs, "appRate");
    const uptake = num(inputs, "uptake");
    const leach = num(inputs, "leach");
    return nonNegative(assertFinite((appRate - uptake) * leach));
  },
  },
  {
    id: "user.fertilizer_dosage_6",
    family: "general",
    label: "GÜBRE DOZAJ — ROI",
    fn: (inputs) => {
    const yieldInc = num(inputs, "yieldInc");
    const cropPrice = num(inputs, "cropPrice");
    const cost = num(inputs, "cost");
    return nonNegative(assertFinite((yieldInc * cropPrice - cost) / cost));
  },
  },
  {
    id: "user.fertilizer_dosage_7",
    family: "general",
    label: "GÜBRE DOZAJ — Precision",
    fn: (inputs) => {
    const baseRate = num(inputs, "baseRate");
    const zoneFactor = num(inputs, "zoneFactor");
    return nonNegative(assertFinite(baseRate * (1 + zoneFactor)));
  },
  },

  // ── HACCP DEVIATION (8 formulas) ──
  {
    id: "user.haccp_deviation_cost_0",
    family: "general",
    label: "HACCP DEVIATION — Cost_Hold",
    fn: (inputs) => {
    const quarVol = num(inputs, "quarVol");
    const holdCost = num(inputs, "holdCost");
    const days = num(inputs, "days");
    return nonNegative(assertFinite(quarVol * holdCost * days));
  },
  },
  {
    id: "user.haccp_deviation_cost_1",
    family: "general",
    label: "HACCP DEVIATION — Cost_Test",
    fn: (inputs) => {
    const samples = num(inputs, "samples");
    const labCost = num(inputs, "labCost");
    return nonNegative(assertFinite(samples * labCost));
  },
  },
  {
    id: "user.haccp_deviation_cost_2",
    family: "general",
    label: "HACCP DEVIATION — Cost_Rework",
    fn: (inputs) => {
    const devVol = num(inputs, "devVol");
    const reworkCost = num(inputs, "reworkCost");
    return nonNegative(assertFinite(devVol * reworkCost));
  },
  },
  {
    id: "user.haccp_deviation_cost_3",
    family: "general",
    label: "HACCP DEVIATION — Cost_Disp",
    fn: (inputs) => {
    const condVol = num(inputs, "condVol");
    const dispCost = num(inputs, "dispCost");
    const lostMat = num(inputs, "lostMat");
    return nonNegative(assertFinite(condVol * dispCost + lostMat));
  },
  },
  {
    id: "user.haccp_deviation_cost_4",
    family: "general",
    label: "HACCP DEVIATION — Cost_Recall",
    fn: (inputs) => {
    const notif = num(inputs, "notif");
    const Rev = num(inputs, "Rev");
    const retailPen = num(inputs, "retailPen");
    const brand = num(inputs, "brand");
    return nonNegative(assertFinite(notif + log_Rev + retailPen + brand));
  },
  },
  {
    id: "user.haccp_deviation_cost_5",
    family: "general",
    label: "HACCP DEVIATION — Fine",
    fn: (inputs) => {
    const probDet = num(inputs, "probDet");
    const fineAmt = num(inputs, "fineAmt");
    return nonNegative(assertFinite(probDet * fineAmt));
  },
  },
  {
    id: "user.haccp_deviation_cost_6",
    family: "general",
    label: "HACCP DEVIATION — Total",
    fn: (inputs) => {
    const hold = num(inputs, "hold");
    const test = num(inputs, "test");
    const rework = num(inputs, "rework");
    const disp = num(inputs, "disp");
    const recall = num(inputs, "recall");
    const fine = num(inputs, "fine");
    return nonNegative(assertFinite(hold + test + rework + disp + recall + fine));
  },
  },
  {
    id: "user.haccp_deviation_cost_7",
    family: "general",
    label: "HACCP DEVIATION — RPN",
    fn: (inputs) => {
    const sev = num(inputs, "sev");
    const occ = num(inputs, "occ");
    const det = num(inputs, "det");
    return nonNegative(assertFinite(sev * occ * det));
  },
  },

  // ── HACİMSEL AĞIRLIK (8 formulas) ──
  {
    id: "user.volumetric_weight_chargeable_0",
    family: "general",
    label: "HACİMSEL AĞIRLIK — VolWeight_Air",
    fn: (inputs) => {
    const l = num(inputs, "l");
    const w = num(inputs, "w");
    const h = num(inputs, "h");
    return nonNegative(assertFinite((l * w * h) / 6000));
  },
  },
  {
    id: "user.volumetric_weight_chargeable_1",
    family: "general",
    label: "HACİMSEL AĞIRLIK — VolWeight_Road",
    fn: (inputs) => {
    const l = num(inputs, "l");
    const w = num(inputs, "w");
    const h = num(inputs, "h");
    return nonNegative(assertFinite((l * w * h) / 5000));
  },
  },
  {
    id: "user.volumetric_weight_chargeable_2",
    family: "general",
    label: "HACİMSEL AĞIRLIK — VolWeight_Sea",
    fn: (inputs) => {
    const l = num(inputs, "l");
    const w = num(inputs, "w");
    const h = num(inputs, "h");
    return nonNegative(assertFinite((l * w * h) / 1000));
  },
  },
  {
    id: "user.volumetric_weight_chargeable_3",
    family: "general",
    label: "HACİMSEL AĞIRLIK — Chargeable",
    fn: (inputs) => {
    const gross = num(inputs, "gross");
    const volWeight = num(inputs, "volWeight");
    return nonNegative(assertFinite(Math.max(gross, volWeight)));
  },
  },
  {
    id: "user.volumetric_weight_chargeable_4",
    family: "general",
    label: "HACİMSEL AĞIRLIK — Freight",
    fn: (inputs) => {
    const chargeable = num(inputs, "chargeable");
    const rate = num(inputs, "rate");
    return nonNegative(assertFinite(chargeable * rate));
  },
  },
  {
    id: "user.volumetric_weight_chargeable_5",
    family: "general",
    label: "HACİMSEL AĞIRLIK — Density",
    fn: (inputs) => {
    const gross = num(inputs, "gross");
    const vol = num(inputs, "vol");
    return nonNegative(assertFinite(gross / vol));
  },
  },
  {
    id: "user.volumetric_weight_chargeable_6",
    family: "general",
    label: "HACİMSEL AĞIRLIK — StackLoss",
    fn: (inputs) => {
    const actualLoad = num(inputs, "actualLoad");
    const maxCont = num(inputs, "maxCont");
    return nonNegative(assertFinite(1 - (actualLoad / maxCont)));
  },
  },
  {
    id: "user.volumetric_weight_chargeable_7",
    family: "general",
    label: "HACİMSEL AĞIRLIK — Ineff",
    fn: (inputs) => {
    const chargeable = num(inputs, "chargeable");
    const gross = num(inputs, "gross");
    const rate = num(inputs, "rate");
    return nonNegative(assertFinite((chargeable - gross) * rate));
  },
  },

  // ── HAFİFLİK MALİYET TASARRUFU (7 formulas) ──
  {
    id: "user.lightweight_cost_savings_0",
    family: "general",
    label: "HAFİFLİK MALİYET TASARRUFU — WeightRed",
    fn: (inputs) => {
    const mass = num(inputs, "mass");
    const Orig = num(inputs, "Orig");
    return nonNegative(assertFinite(mass_Orig - mass_LW));
  },
  },
  {
    id: "user.lightweight_cost_savings_1",
    family: "general",
    label: "HAFİFLİK MALİYET TASARRUFU — FuelSav_Auto",
    fn: (inputs) => {
    const weightRed = num(inputs, "weightRed");
    const fuelFactor = num(inputs, "fuelFactor");
    const dist = num(inputs, "dist");
    const fuelPrice = num(inputs, "fuelPrice");
    return nonNegative(assertFinite(weightRed * fuelFactor * dist * fuelPrice));
  },
  },
  {
    id: "user.lightweight_cost_savings_2",
    family: "general",
    label: "HAFİFLİK MALİYET TASARRUFU — FuelSav_Aero",
    fn: (inputs) => {
    const weightRed = num(inputs, "weightRed");
    const burnFactor = num(inputs, "burnFactor");
    const hours = num(inputs, "hours");
    const jetPrice = num(inputs, "jetPrice");
    return nonNegative(assertFinite(weightRed * burnFactor * hours * jetPrice));
  },
  },
  {
    id: "user.lightweight_cost_savings_3",
    family: "general",
    label: "HAFİFLİK MALİYET TASARRUFU — PayloadGain",
    fn: (inputs) => {
    const weightRed = num(inputs, "weightRed");
    const revPerKg = num(inputs, "revPerKg");
    return nonNegative(assertFinite(weightRed * revPerKg));
  },
  },
  {
    id: "user.lightweight_cost_savings_4",
    family: "general",
    label: "HAFİFLİK MALİYET TASARRUFU — MatPrem",
    fn: (inputs) => {
    const cost = num(inputs, "cost");
    const Orig = num(inputs, "Orig");
    const vol = num(inputs, "vol");
    return nonNegative(assertFinite((cost_LW - cost_Orig) * vol));
  },
  },
  {
    id: "user.lightweight_cost_savings_5",
    family: "general",
    label: "HAFİFLİK MALİYET TASARRUFU — ToolDelta",
    fn: (inputs) => {
    const tool = num(inputs, "tool");
    const Orig = num(inputs, "Orig");
    return nonNegative(assertFinite(tool_LW - tool_Orig));
  },
  },
  {
    id: "user.lightweight_cost_savings_6",
    family: "general",
    label: "HAFİFLİK MALİYET TASARRUFU — NetSav",
    fn: (inputs) => {
    const fuelSav = num(inputs, "fuelSav");
    const payload = num(inputs, "payload");
    const life = num(inputs, "life");
    const matPrem = num(inputs, "matPrem");
    const toolDelta = num(inputs, "toolDelta");
    return nonNegative(assertFinite((fuelSav + payload) * life - matPrem - toolDelta));
  },
  },

  // ── HURDA ORANI OPTİMİZE (8 formulas) ──
  {
    id: "user.scrap_rate_optimize_0",
    family: "general",
    label: "HURDA ORANI OPTİMİZE — ScrapRate",
    fn: (inputs) => {
    const scrapQty = num(inputs, "scrapQty");
    const totalInput = num(inputs, "totalInput");
    return nonNegative(assertFinite(scrapQty / totalInput));
  },
  },
  {
    id: "user.scrap_rate_optimize_1",
    family: "general",
    label: "HURDA ORANI OPTİMİZE — Cost_Mat",
    fn: (inputs) => {
    const scrapQty = num(inputs, "scrapQty");
    const matCost = num(inputs, "matCost");
    return nonNegative(assertFinite(scrapQty * matCost));
  },
  },
  {
    id: "user.scrap_rate_optimize_2",
    family: "general",
    label: "HURDA ORANI OPTİMİZE — Cost_Lab",
    fn: (inputs) => {
    const scrapQty = num(inputs, "scrapQty");
    const cycle = num(inputs, "cycle");
    const labRate = num(inputs, "labRate");
    return nonNegative(assertFinite(scrapQty * cycle * labRate));
  },
  },
  {
    id: "user.scrap_rate_optimize_3",
    family: "general",
    label: "HURDA ORANI OPTİMİZE — Cost_OH",
    fn: (inputs) => {
    const scrapQty = num(inputs, "scrapQty");
    const cycle = num(inputs, "cycle");
    const machRate = num(inputs, "machRate");
    return nonNegative(assertFinite(scrapQty * cycle * machRate));
  },
  },
  {
    id: "user.scrap_rate_optimize_4",
    family: "general",
    label: "HURDA ORANI OPTİMİZE — OppCost",
    fn: (inputs) => {
    const scrapQty = num(inputs, "scrapQty");
    const unitMargin = num(inputs, "unitMargin");
    return nonNegative(assertFinite(scrapQty * unitMargin));
  },
  },
  {
    id: "user.scrap_rate_optimize_5",
    family: "general",
    label: "HURDA ORANI OPTİMİZE — TotalCost",
    fn: (inputs) => {
    const mat = num(inputs, "mat");
    const lab = num(inputs, "lab");
    const oH = num(inputs, "oH");
    const opp = num(inputs, "opp");
    const salvage = num(inputs, "salvage");
    return nonNegative(assertFinite(mat + lab + oH + opp - salvage));
  },
  },
  {
    id: "user.scrap_rate_optimize_6",
    family: "general",
    label: "HURDA ORANI OPTİMİZE — Pareto",
    fn: (inputs) => {
      // COMPLEX: Pareto = SORT(Defects, Freq, DESC)
      // Requires external implementation
      return 0;
    },
  },
  {
    id: "user.scrap_rate_optimize_7",
    family: "general",
    label: "HURDA ORANI OPTİMİZE — Target",
    fn: (inputs) => {
    const benchmark = num(inputs, "benchmark");
    const impFactor = num(inputs, "impFactor");
    return nonNegative(assertFinite(benchmark * (1 - impFactor)));
  },
  },

  // ── HVAC KAPASİTE (9 formulas) ──
  {
    id: "user.hvac_capacity_0",
    family: "general",
    label: "HVAC KAPASİTE — Sensible",
    fn: (inputs) => {
    const cFM = num(inputs, "cFM");
    const deltaT = num(inputs, "deltaT");
    return nonNegative(assertFinite(1.08 * cFM * deltaT));
  },
  },
  {
    id: "user.hvac_capacity_1",
    family: "general",
    label: "HVAC KAPASİTE — Latent",
    fn: (inputs) => {
    const cFM = num(inputs, "cFM");
    const deltaW = num(inputs, "deltaW");
    return nonNegative(assertFinite(0.68 * cFM * deltaW));
  },
  },
  {
    id: "user.hvac_capacity_2",
    family: "general",
    label: "HVAC KAPASİTE — Total",
    fn: (inputs) => {
    const sensible = num(inputs, "sensible");
    const latent = num(inputs, "latent");
    return nonNegative(assertFinite(sensible + latent));
  },
  },
  {
    id: "user.hvac_capacity_3",
    family: "general",
    label: "HVAC KAPASİTE — Envelope",
    fn: (inputs) => {
    const u = num(inputs, "u");
    const area = num(inputs, "area");
    const deltaT = num(inputs, "deltaT");
    return nonNegative(assertFinite(u * area * deltaT));
  },
  },
  {
    id: "user.hvac_capacity_4",
    family: "general",
    label: "HVAC KAPASİTE — Internal",
    fn: (inputs) => {
    const occ = num(inputs, "occ");
    const sensPer = num(inputs, "sensPer");
    const light = num(inputs, "light");
    const equip = num(inputs, "equip");
    return nonNegative(assertFinite(occ * sensPer + light + equip));
  },
  },
  {
    id: "user.hvac_capacity_5",
    family: "general",
    label: "HVAC KAPASİTE — Vent",
    fn: (inputs) => {
    const cFM = num(inputs, "cFM");
    const Out = num(inputs, "Out");
    const t = num(inputs, "t");
    const In = num(inputs, "In");
    return nonNegative(assertFinite(cFM_Out * 1.08 * (t_Out - t_In)));
  },
  },
  {
    id: "user.hvac_capacity_6",
    family: "general",
    label: "HVAC KAPASİTE — Tons",
    fn: (inputs) => {
    const total = num(inputs, "total");
    return nonNegative(assertFinite(total / 12000));
  },
  },
  {
    id: "user.hvac_capacity_7",
    family: "general",
    label: "HVAC KAPASİTE — EER",
    fn: (inputs) => {
    const bTU = num(inputs, "bTU");
    const w = num(inputs, "w");
    return nonNegative(assertFinite(bTU / w));
  },
  },
  {
    id: "user.hvac_capacity_8",
    family: "general",
    label: "HVAC KAPASİTE — AnnualCost",
    fn: (inputs) => {
    const total = num(inputs, "total");
    const eER = num(inputs, "eER");
    const hours = num(inputs, "hours");
    const elecRate = num(inputs, "elecRate");
    return nonNegative(assertFinite((total / eER) * hours * elecRate));
  },
  },

  // ── HYDRAULIC SİSTEM KAYIP (8 formulas) ──
  {
    id: "user.hydraulic_system_loss_0",
    family: "general",
    label: "HYDRAULIC SİSTEM KAYIP — Loss_Leak",
    fn: (inputs) => {
    const q = num(inputs, "q");
    const Leak = num(inputs, "Leak");
    const p = num(inputs, "p");
    return nonNegative(assertFinite(q_Leak * p));
  },
  },
  {
    id: "user.hydraulic_system_loss_1",
    family: "general",
    label: "HYDRAULIC SİSTEM KAYIP — Loss_Fric",
    fn: (inputs) => {
    const deltaP = num(inputs, "deltaP");
    const Pipe = num(inputs, "Pipe");
    const q = num(inputs, "q");
    const Flow = num(inputs, "Flow");
    return nonNegative(assertFinite(deltaP_Pipe * q_Flow));
  },
  },
  {
    id: "user.hydraulic_system_loss_2",
    family: "general",
    label: "HYDRAULIC SİSTEM KAYIP — Loss_Valve",
    fn: (inputs) => {
    const deltaP = num(inputs, "deltaP");
    const Valve = num(inputs, "Valve");
    const q = num(inputs, "q");
    const Flow = num(inputs, "Flow");
    return nonNegative(assertFinite(deltaP_Valve * q_Flow));
  },
  },
  {
    id: "user.hydraulic_system_loss_3",
    family: "general",
    label: "HYDRAULIC SİSTEM KAYIP — Heat",
    fn: (inputs) => {
    const loss = num(inputs, "loss");
    const Leak = num(inputs, "Leak");
    const Fric = num(inputs, "Fric");
    const Valve = num(inputs, "Valve");
    return nonNegative(assertFinite(loss_Leak + loss_Fric + loss_Valve));
  },
  },
  {
    id: "user.hydraulic_system_loss_4",
    family: "general",
    label: "HYDRAULIC SİSTEM KAYIP — Eff",
    fn: (inputs) => {
    const p = num(inputs, "p");
    const Out = num(inputs, "Out");
    const In = num(inputs, "In");
    return nonNegative(assertFinite((p_Out / p_In) * 100));
  },
  },
  {
    id: "user.hydraulic_system_loss_5",
    family: "general",
    label: "HYDRAULIC SİSTEM KAYIP — Cost_Loss",
    fn: (inputs) => {
    const heat = num(inputs, "heat");
    const hours = num(inputs, "hours");
    const elecRate = num(inputs, "elecRate");
    return nonNegative(assertFinite(heat * hours * elecRate));
  },
  },
  {
    id: "user.hydraulic_system_loss_6",
    family: "general",
    label: "HYDRAULIC SİSTEM KAYIP — Degrade",
    fn: (inputs) => {
    const t = num(inputs, "t");
    const Avg = num(inputs, "Avg");
    const thresh = num(inputs, "thresh");
    const fluidCost = num(inputs, "fluidCost");
    return nonNegative(assertFinite((t_Avg - thresh) * fluidCost));
  },
  },
  {
    id: "user.hydraulic_system_loss_7",
    family: "general",
    label: "HYDRAULIC SİSTEM KAYIP — Cool",
    fn: (inputs) => {
    const heat = num(inputs, "heat");
    const cOP = num(inputs, "cOP");
    const elecRate = num(inputs, "elecRate");
    return nonNegative(assertFinite(heat * cOP * elecRate));
  },
  },

  // ── ISI EXCHANGER FOULING (8 formulas) ──
  {
    id: "user.heat_exchanger_fouling_0",
    family: "general",
    label: "ISI EXCHANGER FOULING — R_foul",
    fn: (inputs) => {
    const u = num(inputs, "u");
    const dirty = num(inputs, "dirty");
    const clean = num(inputs, "clean");
    return nonNegative(assertFinite((1 / u_dirty) - (1 / u_clean)));
  },
  },
  {
    id: "user.heat_exchanger_fouling_1",
    family: "general",
    label: "ISI EXCHANGER FOULING — Loss",
    fn: (inputs) => {
    const area = num(inputs, "area");
    const u = num(inputs, "u");
    const clean = num(inputs, "clean");
    const lMTD = num(inputs, "lMTD");
    const dirty = num(inputs, "dirty");
    return nonNegative(assertFinite(area * u_clean * lMTD - area * u_dirty * lMTD));
  },
  },
  {
    id: "user.heat_exchanger_fouling_2",
    family: "general",
    label: "ISI EXCHANGER FOULING — EnergyPen",
    fn: (inputs) => {
    const loss = num(inputs, "loss");
    const hours = num(inputs, "hours");
    const boilEff = num(inputs, "boilEff");
    return nonNegative(assertFinite(loss * hours / boilEff));
  },
  },
  {
    id: "user.heat_exchanger_fouling_3",
    family: "general",
    label: "ISI EXCHANGER FOULING — Cost_Energy",
    fn: (inputs) => {
    const energyPen = num(inputs, "energyPen");
    const fuelCost = num(inputs, "fuelCost");
    return nonNegative(assertFinite(energyPen * fuelCost));
  },
  },
  {
    id: "user.heat_exchanger_fouling_4",
    family: "general",
    label: "ISI EXCHANGER FOULING — DP_Inc",
    fn: (inputs) => {
    const deltaP = num(inputs, "deltaP");
    const dirty = num(inputs, "dirty");
    const clean = num(inputs, "clean");
    return nonNegative(assertFinite(deltaP_dirty - deltaP_clean));
  },
  },
  {
    id: "user.heat_exchanger_fouling_5",
    family: "general",
    label: "ISI EXCHANGER FOULING — PumpInc",
    fn: (inputs) => {
    const dP = num(inputs, "dP");
    const Inc = num(inputs, "Inc");
    const flow = num(inputs, "flow");
    const hours = num(inputs, "hours");
    const pumpEff = num(inputs, "pumpEff");
    return nonNegative(assertFinite(dP_Inc * flow * hours / pumpEff));
  },
  },
  {
    id: "user.heat_exchanger_fouling_6",
    family: "general",
    label: "ISI EXCHANGER FOULING — Total",
    fn: (inputs) => {
    const cost = num(inputs, "cost");
    const Energy = num(inputs, "Energy");
    const pumpInc = num(inputs, "pumpInc");
    return nonNegative(assertFinite(cost_Energy + pumpInc));
  },
  },
  {
    id: "user.heat_exchanger_fouling_7",
    family: "general",
    label: "ISI EXCHANGER FOULING — ROI",
    fn: (inputs) => {
    const total = num(inputs, "total");
    const cleanCost = num(inputs, "cleanCost");
    return nonNegative(assertFinite(total / cleanCost));
  },
  },

  // ── ISO 50001 BASELINE (8 formulas) ──
  {
    id: "user.iso_50001_baseline_0",
    family: "general",
    label: "ISO 50001 BASELINE — EnPI",
    fn: (inputs) => {
    const energy = num(inputs, "energy");
    const volume = num(inputs, "volume");
    return nonNegative(assertFinite(energy / volume));
  },
  },
  {
    id: "user.iso_50001_baseline_1",
    family: "general",
    label: "ISO 50001 BASELINE — Baseline",
    fn: (inputs) => {
    const intercept = num(inputs, "intercept");
    const slope1 = num(inputs, "slope1");
    const prod = num(inputs, "prod");
    const slope2 = num(inputs, "slope2");
    const dD = num(inputs, "dD");
    return nonNegative(assertFinite(intercept + (slope1 * prod) + (slope2 * dD)));
  },
  },
  {
    id: "user.iso_50001_baseline_2",
    family: "general",
    label: "ISO 50001 BASELINE — Cusum_t",
    fn: (inputs) => {
    const actual = num(inputs, "actual");
    const predicted = num(inputs, "predicted");
    return nonNegative(assertFinite(actual - predicted));
  },
  },
  {
    id: "user.iso_50001_baseline_3",
    family: "general",
    label: "ISO 50001 BASELINE — Cusum_Cum",
    fn: (inputs) => {
    const cusum = num(inputs, "cusum");
    const t = num(inputs, "t");
    return nonNegative(assertFinite(SUM(cusum_t)));
  },
  },
  {
    id: "user.iso_50001_baseline_4",
    family: "general",
    label: "ISO 50001 BASELINE — Savings",
    fn: (inputs) => {
    const predicted = num(inputs, "predicted");
    const actual = num(inputs, "actual");
    return nonNegative(assertFinite(predicted - actual));
  },
  },
  {
    id: "user.iso_50001_baseline_5",
    family: "general",
    label: "ISO 50001 BASELINE — Norm",
    fn: (inputs) => {
    const dD = num(inputs, "dD");
    const Curr = num(inputs, "Curr");
    const Hist = num(inputs, "Hist");
    return nonNegative(assertFinite(dD_Curr / dD_Hist));
  },
  },
  {
    id: "user.iso_50001_baseline_6",
    family: "general",
    label: "ISO 50001 BASELINE — Sig",
    fn: (inputs) => {
    const r2 = num(inputs, "r2");
    const aND = num(inputs, "aND");
    const p = num(inputs, "p");
    return nonNegative(assertFinite(r2 > 0.75 aND p < 0.05));
  },
  },
  {
    id: "user.iso_50001_baseline_7",
    family: "general",
    label: "ISO 50001 BASELINE — Target",
    fn: (inputs) => {
    const baseline = num(inputs, "baseline");
    const redTarget = num(inputs, "redTarget");
    return nonNegative(assertFinite(baseline * (1 - redTarget)));
  },
  },

  // ── İÇ VERİM ORANI IRR (7 formulas) ──
  {
    id: "user.irr_investment_0",
    family: "general",
    label: "İÇ VERİM ORANI IRR — NPV",
    fn: (inputs) => {
    const cash = num(inputs, "cash");
    const t = num(inputs, "t");
    const r = num(inputs, "r");
    return nonNegative(assertFinite(SUM(cash_t / (1 + r)**t)));
  },
  },
  {
    id: "user.irr_investment_1",
    family: "general",
    label: "İÇ VERİM ORANI IRR — IRR",
    fn: (inputs) => {
    const r = num(inputs, "r");
    const where = num(inputs, "where");
    const nPV = num(inputs, "nPV");
    return nonNegative(assertFinite(r where nPV = 0));
  },
  },
  {
    id: "user.irr_investment_2",
    family: "general",
    label: "İÇ VERİM ORANI IRR — MIRR",
    fn: (inputs) => {
    const fV = num(inputs, "fV");
    const Pos = num(inputs, "Pos");
    const pV = num(inputs, "pV");
    const Neg = num(inputs, "Neg");
    const n = num(inputs, "n");
    return nonNegative(assertFinite((fV_Pos / pV_Neg)**(1/n) - 1));
  },
  },
  {
    id: "user.irr_investment_3",
    family: "general",
    label: "İÇ VERİM ORANI IRR — Payback",
    fn: (inputs) => {
    const year = num(inputs, "year");
    const Before = num(inputs, "Before");
    const unrecovered = num(inputs, "unrecovered");
    const cash = num(inputs, "cash");
    const Rec = num(inputs, "Rec");
    return nonNegative(assertFinite(year_Before + (unrecovered / cash_Rec)));
  },
  },
  {
    id: "user.irr_investment_4",
    family: "general",
    label: "İÇ VERİM ORANI IRR — PI",
    fn: (inputs) => {
    const pV = num(inputs, "pV");
    const Future = num(inputs, "Future");
    const initInv = num(inputs, "initInv");
    return nonNegative(assertFinite(pV_Future / initInv));
  },
  },
  {
    id: "user.irr_investment_5",
    family: "general",
    label: "İÇ VERİM ORANI IRR — Annuity",
    fn: (inputs) => {
    const nPV = num(inputs, "nPV");
    const r = num(inputs, "r");
    const n = num(inputs, "n");
    return nonNegative(assertFinite(nPV * (r * (1 + r)**n) / ((1 + r)**n - 1)));
  },
  },
  {
    id: "user.irr_investment_6",
    family: "general",
    label: "İÇ VERİM ORANI IRR — Sens",
    fn: (inputs) => {
    const delta = num(inputs, "delta");
    const Var = num(inputs, "Var");
    return nonNegative(assertFinite(delta_IRR / delta_Var));
  },
  },

  // ── İLERLEME YEM MALİYET (8 formulas) ──
  {
    id: "user.feed_cost_formulation_0",
    family: "general",
    label: "İLERLEME YEM MALİYET — Cost_Ing",
    fn: (inputs) => {
    const inclRate = num(inputs, "inclRate");
    const price = num(inputs, "price");
    return nonNegative(assertFinite(inclRate * price));
  },
  },
  {
    id: "user.feed_cost_formulation_1",
    family: "general",
    label: "İLERLEME YEM MALİYET — Cost_Base",
    fn: (inputs) => {
    const cost = num(inputs, "cost");
    const Ing = num(inputs, "Ing");
    return nonNegative(assertFinite(SUM(cost_Ing)));
  },
  },
  {
    id: "user.feed_cost_formulation_2",
    family: "general",
    label: "İLERLEME YEM MALİYET — Cost_Proc",
    fn: (inputs) => {
    const grind = num(inputs, "grind");
    const mix = num(inputs, "mix");
    const pellet = num(inputs, "pellet");
    return nonNegative(assertFinite(grind + mix + pellet));
  },
  },
  {
    id: "user.feed_cost_formulation_3",
    family: "general",
    label: "İLERLEME YEM MALİYET — Cost_Add",
    fn: (inputs) => {
    const enz = num(inputs, "enz");
    const vit = num(inputs, "vit");
    const tox = num(inputs, "tox");
    return nonNegative(assertFinite(SUM(enz + vit + tox)));
  },
  },
  {
    id: "user.feed_cost_formulation_4",
    family: "general",
    label: "İLERLEME YEM MALİYET — Shrink",
    fn: (inputs) => {
    const cost = num(inputs, "cost");
    const Base = num(inputs, "Base");
    const shrinkRate = num(inputs, "shrinkRate");
    return nonNegative(assertFinite(cost_Base * shrinkRate));
  },
  },
  {
    id: "user.feed_cost_formulation_5",
    family: "general",
    label: "İLERLEME YEM MALİYET — FCR",
    fn: (inputs) => {
    const feedCons = num(inputs, "feedCons");
    const weightGain = num(inputs, "weightGain");
    return nonNegative(assertFinite(feedCons / weightGain));
  },
  },
  {
    id: "user.feed_cost_formulation_6",
    family: "general",
    label: "İLERLEME YEM MALİYET — CostPerKg",
    fn: (inputs) => {
    const base = num(inputs, "base");
    const proc = num(inputs, "proc");
    const add = num(inputs, "add");
    const shrink = num(inputs, "shrink");
    const fCR = num(inputs, "fCR");
    return nonNegative(assertFinite((base + proc + add + shrink) * fCR));
  },
  },
  {
    id: "user.feed_cost_formulation_7",
    family: "general",
    label: "İLERLEME YEM MALİYET — Opt",
    fn: (inputs) => {
    const base = num(inputs, "base");
    const sUBJECT = num(inputs, "sUBJECT");
    const tO = num(inputs, "tO");
    const constraints = num(inputs, "constraints");
    return nonNegative(assertFinite(Math.min(base) sUBJECT tO constraints));
  },
  },

  // ── İSKELE KİRALAMA (9 formulas) ──
  {
    id: "user.scaffold_rental_cost_0",
    family: "general",
    label: "İSKELE KİRALAMA — Area",
    fn: (inputs) => {
    const perim = num(inputs, "perim");
    const height = num(inputs, "height");
    return nonNegative(assertFinite(perim * height));
  },
  },
  {
    id: "user.scaffold_rental_cost_1",
    family: "general",
    label: "İSKELE KİRALAMA — Vol",
    fn: (inputs) => {
    const area = num(inputs, "area");
    const standoff = num(inputs, "standoff");
    return nonNegative(assertFinite(area * standoff));
  },
  },
  {
    id: "user.scaffold_rental_cost_2",
    family: "general",
    label: "İSKELE KİRALAMA — Rental",
    fn: (inputs) => {
    const area = num(inputs, "area");
    const rate = num(inputs, "rate");
    const dur = num(inputs, "dur");
    return nonNegative(assertFinite(area * rate * dur));
  },
  },
  {
    id: "user.scaffold_rental_cost_3",
    family: "general",
    label: "İSKELE KİRALAMA — Lab_Erect",
    fn: (inputs) => {
    const area = num(inputs, "area");
    const erectRate = num(inputs, "erectRate");
    return nonNegative(assertFinite(area * erectRate));
  },
  },
  {
    id: "user.scaffold_rental_cost_4",
    family: "general",
    label: "İSKELE KİRALAMA — Lab_Dism",
    fn: (inputs) => {
    const area = num(inputs, "area");
    const dismRate = num(inputs, "dismRate");
    return nonNegative(assertFinite(area * dismRate));
  },
  },
  {
    id: "user.scaffold_rental_cost_5",
    family: "general",
    label: "İSKELE KİRALAMA — Transp",
    fn: (inputs) => {
    const trips = num(inputs, "trips");
    const truckRate = num(inputs, "truckRate");
    return nonNegative(assertFinite(trips * truckRate));
  },
  },
  {
    id: "user.scaffold_rental_cost_6",
    family: "general",
    label: "İSKELE KİRALAMA — Total",
    fn: (inputs) => {
    const rental = num(inputs, "rental");
    const lab = num(inputs, "lab");
    const Erect = num(inputs, "Erect");
    const Dism = num(inputs, "Dism");
    const transp = num(inputs, "transp");
    return nonNegative(assertFinite(rental + lab_Erect + lab_Dism + transp));
  },
  },
  {
    id: "user.scaffold_rental_cost_7",
    family: "general",
    label: "İSKELE KİRALAMA — OptDur",
    fn: (inputs) => {
    const critPath = num(inputs, "critPath");
    const buffer = num(inputs, "buffer");
    const overlap = num(inputs, "overlap");
    return nonNegative(assertFinite(critPath + buffer - overlap));
  },
  },
  {
    id: "user.scaffold_rental_cost_8",
    family: "general",
    label: "İSKELE KİRALAMA — Overrun",
    fn: (inputs) => {
    const actual = num(inputs, "actual");
    const optDur = num(inputs, "optDur");
    const dailyRate = num(inputs, "dailyRate");
    return nonNegative(assertFinite(Math.max(0, actual - optDur) * dailyRate));
  },
  },

  // ── İSTATİSTİKSEL PROSES KONTROL (9 formulas) ──
  {
    id: "user.spc_limit_control_0",
    family: "general",
    label: "İSTATİSTİKSEL PROSES KONTROL — X_Bar_Bar",
    fn: (inputs) => {
    const means = num(inputs, "means");
    return nonNegative(assertFinite(AVERAGE(means)));
  },
  },
  {
    id: "user.spc_limit_control_1",
    family: "general",
    label: "İSTATİSTİKSEL PROSES KONTROL — R_Bar",
    fn: (inputs) => {
    const ranges = num(inputs, "ranges");
    return nonNegative(assertFinite(AVERAGE(ranges)));
  },
  },
  {
    id: "user.spc_limit_control_2",
    family: "general",
    label: "İSTATİSTİKSEL PROSES KONTROL — S_Bar",
    fn: (inputs) => {
    const stdDevs = num(inputs, "stdDevs");
    return nonNegative(assertFinite(AVERAGE(stdDevs)));
  },
  },
  {
    id: "user.spc_limit_control_3",
    family: "general",
    label: "İSTATİSTİKSEL PROSES KONTROL — UCL_X",
    fn: (inputs) => {
    const x = num(inputs, "x");
    const Bar = num(inputs, "Bar");
    const a2 = num(inputs, "a2");
    const r = num(inputs, "r");
    return nonNegative(assertFinite(x_Bar_Bar + (a2 * r_Bar)));
  },
  },
  {
    id: "user.spc_limit_control_4",
    family: "general",
    label: "İSTATİSTİKSEL PROSES KONTROL — LCL_X",
    fn: (inputs) => {
    const x = num(inputs, "x");
    const Bar = num(inputs, "Bar");
    const a2 = num(inputs, "a2");
    const r = num(inputs, "r");
    return nonNegative(assertFinite(x_Bar_Bar - (a2 * r_Bar)));
  },
  },
  {
    id: "user.spc_limit_control_5",
    family: "general",
    label: "İSTATİSTİKSEL PROSES KONTROL — UCL_R",
    fn: (inputs) => {
    const d4 = num(inputs, "d4");
    const r = num(inputs, "r");
    const Bar = num(inputs, "Bar");
    return nonNegative(assertFinite(d4 * r_Bar));
  },
  },
  {
    id: "user.spc_limit_control_6",
    family: "general",
    label: "İSTATİSTİKSEL PROSES KONTROL — LCL_R",
    fn: (inputs) => {
    const d3 = num(inputs, "d3");
    const r = num(inputs, "r");
    const Bar = num(inputs, "Bar");
    return nonNegative(assertFinite(d3 * r_Bar));
  },
  },
  {
    id: "user.spc_limit_control_7",
    family: "general",
    label: "İSTATİSTİKSEL PROSES KONTROL — Sigma",
    fn: (inputs) => {
    const r = num(inputs, "r");
    const Bar = num(inputs, "Bar");
    const d2 = num(inputs, "d2");
    return nonNegative(assertFinite(r_Bar / d2));
  },
  },
  {
    id: "user.spc_limit_control_8",
    family: "general",
    label: "İSTATİSTİKSEL PROSES KONTROL — Cp",
    fn: (inputs) => {
    const uSL = num(inputs, "uSL");
    const lSL = num(inputs, "lSL");
    const sigma = num(inputs, "sigma");
    return nonNegative(assertFinite((uSL - lSL) / (6 * sigma)));
  },
  },

  // ── İŞLEME STRATEJİSİ SÜRE (8 formulas) ──
  {
    id: "user.machining_strategy_0",
    family: "general",
    label: "İŞLEME STRATEJİSİ SÜRE — MRR",
    fn: (inputs) => {
    const v = num(inputs, "v");
    const c = num(inputs, "c");
    const f = num(inputs, "f");
    const a = num(inputs, "a");
    const p = num(inputs, "p");
    return nonNegative(assertFinite(v_c * f * a_p));
  },
  },
  {
    id: "user.machining_strategy_1",
    family: "general",
    label: "İŞLEME STRATEJİSİ SÜRE — Power",
    fn: (inputs) => {
    const mRR = num(inputs, "mRR");
    const specEnergy = num(inputs, "specEnergy");
    return nonNegative(assertFinite(mRR * specEnergy));
  },
  },
  {
    id: "user.machining_strategy_2",
    family: "general",
    label: "İŞLEME STRATEJİSİ SÜRE — ToolLife",
    fn: (inputs) => {
    const c = num(inputs, "c");
    const v = num(inputs, "v");
    const n = num(inputs, "n");
    const f = num(inputs, "f");
    const m = num(inputs, "m");
    return nonNegative(assertFinite(c / (v_c**n * f**m)));
  },
  },
  {
    id: "user.machining_strategy_3",
    family: "general",
    label: "İŞLEME STRATEJİSİ SÜRE — Cost",
    fn: (inputs) => {
    const mach = num(inputs, "mach");
    const change = num(inputs, "change");
    const tool = num(inputs, "tool");
    return nonNegative(assertFinite(Math.min(mach + change + tool)));
  },
  },
  {
    id: "user.machining_strategy_4",
    family: "general",
    label: "İŞLEME STRATEJİSİ SÜRE — Opt_Vc",
    fn: (inputs) => {
    const c = num(inputs, "c");
    const t = num(inputs, "t");
    const opt = num(inputs, "opt");
    const n = num(inputs, "n");
    return nonNegative(assertFinite((c / (t_opt)**n)**(1/n)));
  },
  },
  {
    id: "user.machining_strategy_5",
    family: "general",
    label: "İŞLEME STRATEJİSİ SÜRE — T_opt",
    fn: (inputs) => {
    const n = num(inputs, "n");
    const changeTime = num(inputs, "changeTime");
    const toolCost = num(inputs, "toolCost");
    const machRate = num(inputs, "machRate");
    return nonNegative(assertFinite(((1/n - 1) * (changeTime + toolCost/machRate))));
  },
  },
  {
    id: "user.machining_strategy_6",
    family: "general",
    label: "İŞLEME STRATEJİSİ SÜRE — Ra",
    fn: (inputs) => {
    const f = num(inputs, "f");
    const noseRad = num(inputs, "noseRad");
    return nonNegative(assertFinite(f**2 / (8 * noseRad)));
  },
  },
  {
    id: "user.machining_strategy_7",
    family: "general",
    label: "İŞLEME STRATEJİSİ SÜRE — Check",
    fn: (inputs) => {
    const power = num(inputs, "power");
    const maxPower = num(inputs, "maxPower");
    const aND = num(inputs, "aND");
    const ra = num(inputs, "ra");
    const tol = num(inputs, "tol");
    return nonNegative(assertFinite(power < maxPower aND ra < tol));
  },
  },

  // ── KAIZEN TASARRUF TAKİPÇİSİ (8 formulas) ──
  {
    id: "user.kaizen_savings_tracker_0",
    family: "general",
    label: "KAIZEN TASARRUF TAKİPÇİSİ — Hard",
    fn: (inputs) => {
    const baseline = num(inputs, "baseline");
    const actual = num(inputs, "actual");
    const vol = num(inputs, "vol");
    return nonNegative(assertFinite((baseline - actual) * vol));
  },
  },
  {
    id: "user.kaizen_savings_tracker_1",
    family: "general",
    label: "KAIZEN TASARRUF TAKİPÇİSİ — Soft",
    fn: (inputs) => {
    const timeSaved = num(inputs, "timeSaved");
    const labRate = num(inputs, "labRate");
    const conv = num(inputs, "conv");
    return nonNegative(assertFinite(timeSaved * labRate * conv));
  },
  },
  {
    id: "user.kaizen_savings_tracker_2",
    family: "general",
    label: "KAIZEN TASARRUF TAKİPÇİSİ — ImpCost",
    fn: (inputs) => {
    const lab = num(inputs, "lab");
    const mat = num(inputs, "mat");
    const down = num(inputs, "down");
    return nonNegative(assertFinite(lab_K + mat + down));
  },
  },
  {
    id: "user.kaizen_savings_tracker_3",
    family: "general",
    label: "KAIZEN TASARRUF TAKİPÇİSİ — ROI",
    fn: (inputs) => {
    const hard = num(inputs, "hard");
    const soft = num(inputs, "soft");
    const impCost = num(inputs, "impCost");
    return nonNegative(assertFinite((hard + soft - impCost) / impCost));
  },
  },
  {
    id: "user.kaizen_savings_tracker_4",
    family: "general",
    label: "KAIZEN TASARRUF TAKİPÇİSİ — Payback",
    fn: (inputs) => {
    const impCost = num(inputs, "impCost");
    const monthSav = num(inputs, "monthSav");
    return nonNegative(assertFinite(impCost / monthSav));
  },
  },
  {
    id: "user.kaizen_savings_tracker_5",
    family: "general",
    label: "KAIZEN TASARRUF TAKİPÇİSİ — Sust",
    fn: (inputs) => {
    const sav = num(inputs, "sav");
    const M6 = num(inputs, "M6");
    const M1 = num(inputs, "M1");
    return nonNegative(assertFinite(sav_M6 / sav_M1));
  },
  },
  {
    id: "user.kaizen_savings_tracker_6",
    family: "general",
    label: "KAIZEN TASARRUF TAKİPÇİSİ — Cum",
    fn: (inputs) => {
    const monthSav = num(inputs, "monthSav");
    return nonNegative(assertFinite(SUM(monthSav)));
  },
  },
  {
    id: "user.kaizen_savings_tracker_7",
    family: "general",
    label: "KAIZEN TASARRUF TAKİPÇİSİ — Opp",
    fn: (inputs) => {
    const time = num(inputs, "time");
    const prodRate = num(inputs, "prodRate");
    const margin = num(inputs, "margin");
    return nonNegative(assertFinite(time_K * prodRate * margin));
  },
  },

  // ── Kalite Maliyeti PAF (7 formulas) ──
  {
    id: "user.quality_cost_paf_0",
    family: "general",
    label: "Kalite Maliyeti PAF — PreventionCost",
    fn: (inputs) => {
    const training = num(inputs, "training");
    const qualityPlanning = num(inputs, "qualityPlanning");
    const supplierEvaluation = num(inputs, "supplierEvaluation");
    const designReview = num(inputs, "designReview");
    return nonNegative(assertFinite(training + qualityPlanning + supplierEvaluation + designReview));
  },
  },
  {
    id: "user.quality_cost_paf_1",
    family: "general",
    label: "Kalite Maliyeti PAF — AppraisalCost",
    fn: (inputs) => {
    const inspection = num(inputs, "inspection");
    const testing = num(inputs, "testing");
    const calibration = num(inputs, "calibration");
    const audit = num(inputs, "audit");
    return nonNegative(assertFinite(inspection + testing + calibration + audit));
  },
  },
  {
    id: "user.quality_cost_paf_2",
    family: "general",
    label: "Kalite Maliyeti PAF — InternalFailure",
    fn: (inputs) => {
    const scrap = num(inputs, "scrap");
    const rework = num(inputs, "rework");
    const reinspection = num(inputs, "reinspection");
    const downtime = num(inputs, "downtime");
    return nonNegative(assertFinite(scrap + rework + reinspection + downtime));
  },
  },
  {
    id: "user.quality_cost_paf_3",
    family: "general",
    label: "Kalite Maliyeti PAF — ExternalFailure",
    fn: (inputs) => {
    const warranty = num(inputs, "warranty");
    const returns = num(inputs, "returns");
    const recall = num(inputs, "recall");
    const liability = num(inputs, "liability");
    const lostSales = num(inputs, "lostSales");
    return nonNegative(assertFinite(warranty + returns + recall + liability + lostSales));
  },
  },
  {
    id: "user.quality_cost_paf_4",
    family: "general",
    label: "Kalite Maliyeti PAF — TotalCOQ",
    fn: (inputs) => {
    const preventionCost = num(inputs, "preventionCost");
    const appraisalCost = num(inputs, "appraisalCost");
    const internalFailure = num(inputs, "internalFailure");
    const externalFailure = num(inputs, "externalFailure");
    return nonNegative(assertFinite(preventionCost + appraisalCost + internalFailure + externalFailure));
  },
  },
  {
    id: "user.quality_cost_paf_5",
    family: "general",
    label: "Kalite Maliyeti PAF — COQ_Ratio",
    fn: (inputs) => {
    const totalCOQ = num(inputs, "totalCOQ");
    const totalRevenue = num(inputs, "totalRevenue");
    return nonNegative(assertFinite(totalCOQ / totalRevenue));
  },
  },
  {
    id: "user.quality_cost_paf_6",
    family: "general",
    label: "Kalite Maliyeti PAF — PAF_Ratio",
    fn: (inputs) => {
    const preventionCost = num(inputs, "preventionCost");
    const totalCOQ = num(inputs, "totalCOQ");
    return nonNegative(assertFinite(preventionCost / totalCOQ));
  },
  },

  // ── Karbon Ayak izi Check (7 formulas) ──
  {
    id: "user.carbon_footprint_check_0",
    family: "general",
    label: "Karbon Ayak izi Check — Scope1",
    fn: (inputs) => {
    const fuelConsumption = num(inputs, "fuelConsumption");
    const i = num(inputs, "i");
    const emissionFactor = num(inputs, "emissionFactor");
    const fugitiveEmissions = num(inputs, "fugitiveEmissions");
    return nonNegative(assertFinite(SUM(fuelConsumption_i * emissionFactor_i) + fugitiveEmissions));
  },
  },
  {
    id: "user.carbon_footprint_check_1",
    family: "general",
    label: "Karbon Ayak izi Check — Scope2_Location",
    fn: (inputs) => {
    const electricityConsumption = num(inputs, "electricityConsumption");
    const gridEmissionFactor = num(inputs, "gridEmissionFactor");
    return nonNegative(assertFinite(electricityConsumption * gridEmissionFactor));
  },
  },
  {
    id: "user.carbon_footprint_check_2",
    family: "general",
    label: "Karbon Ayak izi Check — Scope2_Market",
    fn: (inputs) => {
    const electricityConsumption = num(inputs, "electricityConsumption");
    const gridFactor = num(inputs, "gridFactor");
    const rEC = num(inputs, "rEC");
    const Factor = num(inputs, "Factor");
    return nonNegative(assertFinite(electricityConsumption * (gridFactor - rEC_Factor)));
  },
  },
  {
    id: "user.carbon_footprint_check_3",
    family: "general",
    label: "Karbon Ayak izi Check — Scope3_Upstream",
    fn: (inputs) => {
    const material = num(inputs, "material");
    const i = num(inputs, "i");
    const materialEF = num(inputs, "materialEF");
    const logistics = num(inputs, "logistics");
    const Emissions = num(inputs, "Emissions");
    return nonNegative(assertFinite(SUM(material_i * materialEF_i) + logistics_Emissions));
  },
  },
  {
    id: "user.carbon_footprint_check_4",
    family: "general",
    label: "Karbon Ayak izi Check — TotalCarbon",
    fn: (inputs) => {
    const scope1 = num(inputs, "scope1");
    const scope2 = num(inputs, "scope2");
    const Market = num(inputs, "Market");
    const scope3 = num(inputs, "scope3");
    const Upstream = num(inputs, "Upstream");
    return nonNegative(assertFinite(scope1 + scope2_Market + scope3_Upstream));
  },
  },
  {
    id: "user.carbon_footprint_check_5",
    family: "general",
    label: "Karbon Ayak izi Check — CarbonIntensity",
    fn: (inputs) => {
    const totalCarbon = num(inputs, "totalCarbon");
    const productionVolume = num(inputs, "productionVolume");
    return nonNegative(assertFinite(totalCarbon / productionVolume));
  },
  },
  {
    id: "user.carbon_footprint_check_6",
    family: "general",
    label: "Karbon Ayak izi Check — FinancialRisk",
    fn: (inputs) => {
    const totalCarbon = num(inputs, "totalCarbon");
    const forecastedCarbonPrice = num(inputs, "forecastedCarbonPrice");
    return nonNegative(assertFinite(totalCarbon * forecastedCarbonPrice));
  },
  },

  // ── Kaynak Hacmi ve Maliyeti (8 formulas) ──
  {
    id: "user.weld_volume_cost_0",
    family: "general",
    label: "Kaynak Hacmi ve Maliyeti — Area_Weld",
    fn: (inputs) => {
    const leg = num(inputs, "leg");
    return nonNegative(assertFinite((leg**2) / 2));
  },
  },
  {
    id: "user.weld_volume_cost_1",
    family: "general",
    label: "Kaynak Hacmi ve Maliyeti — Volume_Weld",
    fn: (inputs) => {
    const area = num(inputs, "area");
    const Weld = num(inputs, "Weld");
    const length = num(inputs, "length");
    return nonNegative(assertFinite(area_Weld * length));
  },
  },
  {
    id: "user.weld_volume_cost_2",
    family: "general",
    label: "Kaynak Hacmi ve Maliyeti — Weight_Deposited",
    fn: (inputs) => {
    const volume = num(inputs, "volume");
    const Weld = num(inputs, "Weld");
    const density = num(inputs, "density");
    return nonNegative(assertFinite(volume_Weld * density));
  },
  },
  {
    id: "user.weld_volume_cost_3",
    family: "general",
    label: "Kaynak Hacmi ve Maliyeti — Weight_Electrode",
    fn: (inputs) => {
    const weight = num(inputs, "weight");
    const Deposited = num(inputs, "Deposited");
    const depositionEfficiency = num(inputs, "depositionEfficiency");
    return nonNegative(assertFinite(weight_Deposited / depositionEfficiency));
  },
  },
  {
    id: "user.weld_volume_cost_4",
    family: "general",
    label: "Kaynak Hacmi ve Maliyeti — Cost_Filler",
    fn: (inputs) => {
    const weight = num(inputs, "weight");
    const Electrode = num(inputs, "Electrode");
    const pricePerKg = num(inputs, "pricePerKg");
    return nonNegative(assertFinite(weight_Electrode * pricePerKg));
  },
  },
  {
    id: "user.weld_volume_cost_5",
    family: "general",
    label: "Kaynak Hacmi ve Maliyeti — Cost_Gas",
    fn: (inputs) => {
    const gasFlowRate = num(inputs, "gasFlowRate");
    const arcTime = num(inputs, "arcTime");
    const gasPrice = num(inputs, "gasPrice");
    return nonNegative(assertFinite(gasFlowRate * arcTime * gasPrice));
  },
  },
  {
    id: "user.weld_volume_cost_6",
    family: "general",
    label: "Kaynak Hacmi ve Maliyeti — Cost_Power",
    fn: (inputs) => {
    const voltage = num(inputs, "voltage");
    const current = num(inputs, "current");
    const arcTime = num(inputs, "arcTime");
    const machineEff = num(inputs, "machineEff");
    const elecRate = num(inputs, "elecRate");
    return nonNegative(assertFinite((voltage * current * arcTime) / (1000 * machineEff) * elecRate));
  },
  },
  {
    id: "user.weld_volume_cost_7",
    family: "general",
    label: "Kaynak Hacmi ve Maliyeti — TotalWeldCost",
    fn: (inputs) => {
    const cost = num(inputs, "cost");
    const Filler = num(inputs, "Filler");
    const Gas = num(inputs, "Gas");
    const Power = num(inputs, "Power");
    const arcTime = num(inputs, "arcTime");
    const depositionRate = num(inputs, "depositionRate");
    const laborRate = num(inputs, "laborRate");
    return nonNegative(assertFinite(cost_Filler + cost_Gas + cost_Power + (arcTime / depositionRate) * laborRate));
  },
  },

  // ── Kaynak Maliyeti (6 formulas) ──
  {
    id: "user.weld_cost_analysis_0",
    family: "general",
    label: "Kaynak Maliyeti — OperatingFactor",
    fn: (inputs) => {
    const arcTime = num(inputs, "arcTime");
    const totalShiftTime = num(inputs, "totalShiftTime");
    return nonNegative(assertFinite(arcTime / totalShiftTime));
  },
  },
  {
    id: "user.weld_cost_analysis_1",
    family: "general",
    label: "Kaynak Maliyeti — DepositionRate",
    fn: (inputs) => {
    const weight = num(inputs, "weight");
    const Deposited = num(inputs, "Deposited");
    const arcTime = num(inputs, "arcTime");
    return nonNegative(assertFinite(weight_Deposited / arcTime));
  },
  },
  {
    id: "user.weld_cost_analysis_2",
    family: "general",
    label: "Kaynak Maliyeti — TotalJointCost",
    fn: (inputs) => {
    const length = num(inputs, "length");
    const travelSpeed = num(inputs, "travelSpeed");
    const laborRate = num(inputs, "laborRate");
    const overheadRate = num(inputs, "overheadRate");
    const operatingFactor = num(inputs, "operatingFactor");
    const fillerCost = num(inputs, "fillerCost");
    const gasCost = num(inputs, "gasCost");
    const powerCost = num(inputs, "powerCost");
    return nonNegative(assertFinite((length / travelSpeed) * (laborRate + overheadRate) / operatingFactor + fillerCost + gasCost + powerCost));
  },
  },
  {
    id: "user.weld_cost_analysis_3",
    family: "general",
    label: "Kaynak Maliyeti — CostPerMeter",
    fn: (inputs) => {
    const totalJointCost = num(inputs, "totalJointCost");
    const length = num(inputs, "length");
    return nonNegative(assertFinite(totalJointCost / length));
  },
  },
  {
    id: "user.weld_cost_analysis_4",
    family: "general",
    label: "Kaynak Maliyeti — ConsumableCostPct",
    fn: (inputs) => {
    const fillerCost = num(inputs, "fillerCost");
    const totalJointCost = num(inputs, "totalJointCost");
    return nonNegative(assertFinite(fillerCost / totalJointCost));
  },
  },
  {
    id: "user.weld_cost_analysis_5",
    family: "general",
    label: "Kaynak Maliyeti — LaborCostPct",
    fn: (inputs) => {
    const laborCost = num(inputs, "laborCost");
    const totalJointCost = num(inputs, "totalJointCost");
    return nonNegative(assertFinite(laborCost / totalJointCost));
  },
  },

  // ── Kaynak Mukavemeti (7 formulas) ──
  {
    id: "user.weld_strength_0",
    family: "general",
    label: "Kaynak Mukavemeti — ThroatThickness",
    fn: (inputs) => {
    const leg = num(inputs, "leg");
    return nonNegative(assertFinite(leg * Math.cos(45)));
  },
  },
  {
    id: "user.weld_strength_1",
    family: "general",
    label: "Kaynak Mukavemeti — Area_Shear",
    fn: (inputs) => {
    const throatThickness = num(inputs, "throatThickness");
    const length = num(inputs, "length");
    return nonNegative(assertFinite(throatThickness * length));
  },
  },
  {
    id: "user.weld_strength_2",
    family: "general",
    label: "Kaynak Mukavemeti — AllowableShearStress",
    fn: (inputs) => {
    const tensileStrength = num(inputs, "tensileStrength");
    const Electrode = num(inputs, "Electrode");
    return nonNegative(assertFinite(0.3 * tensileStrength_Electrode));
  },
  },
  {
    id: "user.weld_strength_3",
    family: "general",
    label: "Kaynak Mukavemeti — MaxLoad_Shear",
    fn: (inputs) => {
    const area = num(inputs, "area");
    const Shear = num(inputs, "Shear");
    const allowableShearStress = num(inputs, "allowableShearStress");
    return nonNegative(assertFinite(area_Shear * allowableShearStress));
  },
  },
  {
    id: "user.weld_strength_4",
    family: "general",
    label: "Kaynak Mukavemeti — SafetyFactor",
    fn: (inputs) => {
    const maxLoad = num(inputs, "maxLoad");
    const Shear = num(inputs, "Shear");
    const appliedLoad = num(inputs, "appliedLoad");
    return nonNegative(assertFinite(maxLoad_Shear / appliedLoad));
  },
  },
  {
    id: "user.weld_strength_5",
    family: "general",
    label: "Kaynak Mukavemeti — BendingStress",
    fn: (inputs) => {
    const appliedMoment = num(inputs, "appliedMoment");
    const throatThickness = num(inputs, "throatThickness");
    const momentOfInertia = num(inputs, "momentOfInertia");
    return nonNegative(assertFinite((appliedMoment * throatThickness) / momentOfInertia));
  },
  },
  {
    id: "user.weld_strength_6",
    family: "general",
    label: "Kaynak Mukavemeti — CombinedStress",
    fn: (inputs) => {
    const shearStress = num(inputs, "shearStress");
    const bendingStress = num(inputs, "bendingStress");
    return nonNegative(assertFinite(Math.sqrt(shearStress**2 + bendingStress**2)));
  },
  },

  // ── Kesim Parameters Takım ömrü (6 formulas) ──
  {
    id: "user.cutting_tool_life_0",
    family: "general",
    label: "Kesim Parameters Takım ömrü — ToolLife_T",
    fn: (inputs) => {
    const c = num(inputs, "c");
    const v = num(inputs, "v");
    const n = num(inputs, "n");
    const f = num(inputs, "f");
    const m = num(inputs, "m");
    const a = num(inputs, "a");
    const p = num(inputs, "p");
    const k = num(inputs, "k");
    return nonNegative(assertFinite(c / (v_c**n * f**m * a_p**k)));
  },
  },
  {
    id: "user.cutting_tool_life_1",
    family: "general",
    label: "Kesim Parameters Takım ömrü — TaylorExponent_n",
    fn: (inputs) => {
    const t1 = num(inputs, "t1");
    const t2 = num(inputs, "t2");
    const v1 = num(inputs, "v1");
    const v2 = num(inputs, "v2");
    return nonNegative(assertFinite(-Math.log(t1/t2) / Math.log(v1/v2)));
  },
  },
  {
    id: "user.cutting_tool_life_2",
    family: "general",
    label: "Kesim Parameters Takım ömrü — CostPerPart_Tool",
    fn: (inputs) => {
    const toolCost = num(inputs, "toolCost");
    const edges = num(inputs, "edges");
    const machiningTime = num(inputs, "machiningTime");
    const toolLife = num(inputs, "toolLife");
    return nonNegative(assertFinite((toolCost / edges) * (machiningTime / toolLife)));
  },
  },
  {
    id: "user.cutting_tool_life_3",
    family: "general",
    label: "Kesim Parameters Takım ömrü — OptimalToolLife_Cost",
    fn: (inputs) => {
    const n = num(inputs, "n");
    const toolChangeTime = num(inputs, "toolChangeTime");
    const toolCost = num(inputs, "toolCost");
    const edges = num(inputs, "edges");
    const machineRate = num(inputs, "machineRate");
    return nonNegative(assertFinite(((1/n - 1) * (toolChangeTime + toolCost/edges / machineRate))));
  },
  },
  {
    id: "user.cutting_tool_life_4",
    family: "general",
    label: "Kesim Parameters Takım ömrü — Optimal_Vc",
    fn: (inputs) => {
    const c = num(inputs, "c");
    const optimalToolLife = num(inputs, "optimalToolLife");
    const Cost = num(inputs, "Cost");
    const n = num(inputs, "n");
    return nonNegative(assertFinite(c / (optimalToolLife_Cost**n)));
  },
  },
  {
    id: "user.cutting_tool_life_5",
    family: "general",
    label: "Kesim Parameters Takım ömrü — ProductionRate",
    fn: (inputs) => {
    const machiningTime = num(inputs, "machiningTime");
    const toolLife = num(inputs, "toolLife");
    const toolChangeTime = num(inputs, "toolChangeTime");
    return nonNegative(assertFinite(1 / (machiningTime + (machiningTime / toolLife) * toolChangeTime)));
  },
  },

  // ── Kesme-Dolgu Denge (8 formulas) ──
  {
    id: "user.cut_fill_balance_0",
    family: "general",
    label: "Kesme-Dolgu Denge — Volume_Cut",
    fn: (inputs) => {
    const area = num(inputs, "area");
    const Cut = num(inputs, "Cut");
    const i = num(inputs, "i");
    const distance = num(inputs, "distance");
    return nonNegative(assertFinite(SUM(area_Cut_i * distance_i)));
  },
  },
  {
    id: "user.cut_fill_balance_1",
    family: "general",
    label: "Kesme-Dolgu Denge — Volume_Fill",
    fn: (inputs) => {
    const area = num(inputs, "area");
    const Fill = num(inputs, "Fill");
    const i = num(inputs, "i");
    const distance = num(inputs, "distance");
    return nonNegative(assertFinite(SUM(area_Fill_i * distance_i)));
  },
  },
  {
    id: "user.cut_fill_balance_2",
    family: "general",
    label: "Kesme-Dolgu Denge — ShrinkageFactor",
    fn: (inputs) => {
    const compactedVolume = num(inputs, "compactedVolume");
    const looseVolume = num(inputs, "looseVolume");
    return nonNegative(assertFinite(1 - (compactedVolume / looseVolume)));
  },
  },
  {
    id: "user.cut_fill_balance_3",
    family: "general",
    label: "Kesme-Dolgu Denge — SwellFactor",
    fn: (inputs) => {
    const looseVolume = num(inputs, "looseVolume");
    const bankVolume = num(inputs, "bankVolume");
    return nonNegative(assertFinite(looseVolume / bankVolume));
  },
  },
  {
    id: "user.cut_fill_balance_4",
    family: "general",
    label: "Kesme-Dolgu Denge — NetBalance",
    fn: (inputs) => {
    const volume = num(inputs, "volume");
    const Cut = num(inputs, "Cut");
    const Fill = num(inputs, "Fill");
    const shrinkageFactor = num(inputs, "shrinkageFactor");
    return nonNegative(assertFinite(volume_Cut - (volume_Fill * shrinkageFactor)));
  },
  },
  {
    id: "user.cut_fill_balance_5",
    family: "general",
    label: "Kesme-Dolgu Denge — BorrowRequired",
    fn: (inputs) => {
    const volume = num(inputs, "volume");
    const Fill = num(inputs, "Fill");
    const shrinkageFactor = num(inputs, "shrinkageFactor");
    const Cut = num(inputs, "Cut");
    return nonNegative(assertFinite(Math.max(0, (volume_Fill * shrinkageFactor) - volume_Cut)));
  },
  },
  {
    id: "user.cut_fill_balance_6",
    family: "general",
    label: "Kesme-Dolgu Denge — WasteRequired",
    fn: (inputs) => {
    const volume = num(inputs, "volume");
    const Cut = num(inputs, "Cut");
    const Fill = num(inputs, "Fill");
    const shrinkageFactor = num(inputs, "shrinkageFactor");
    return nonNegative(assertFinite(Math.max(0, volume_Cut - (volume_Fill * shrinkageFactor))));
  },
  },
  {
    id: "user.cut_fill_balance_7",
    family: "general",
    label: "Kesme-Dolgu Denge — HaulCost",
    fn: (inputs) => {
    const volume = num(inputs, "volume");
    const i = num(inputs, "i");
    const distance = num(inputs, "distance");
    const unitHaulCost = num(inputs, "unitHaulCost");
    return nonNegative(assertFinite(SUM(volume_i * distance_i * unitHaulCost)));
  },
  },

  // ── Kiriş Ağırlığı (8 formulas) ──
  {
    id: "user.beam_weight_0",
    family: "general",
    label: "Kiriş Ağırlığı — Area_Cross",
    fn: (inputs) => {
    const lookupArea = num(inputs, "lookupArea");
    const profileType = num(inputs, "profileType");
    const size = num(inputs, "size");
    return nonNegative(assertFinite(lookupArea(profileType, size)));
  },
  },
  {
    id: "user.beam_weight_1",
    family: "general",
    label: "Kiriş Ağırlığı — Weight_PerMeter",
    fn: (inputs) => {
    const area = num(inputs, "area");
    const Cross = num(inputs, "Cross");
    const density = num(inputs, "density");
    const Steel = num(inputs, "Steel");
    return nonNegative(assertFinite(area_Cross * density_Steel));
  },
  },
  {
    id: "user.beam_weight_2",
    family: "general",
    label: "Kiriş Ağırlığı — TotalWeight",
    fn: (inputs) => {
    const weight = num(inputs, "weight");
    const PerMeter = num(inputs, "PerMeter");
    const length = num(inputs, "length");
    const quantity = num(inputs, "quantity");
    return nonNegative(assertFinite(weight_PerMeter * length * quantity));
  },
  },
  {
    id: "user.beam_weight_3",
    family: "general",
    label: "Kiriş Ağırlığı — Cost_Material",
    fn: (inputs) => {
    const totalWeight = num(inputs, "totalWeight");
    const pricePerTon = num(inputs, "pricePerTon");
    return nonNegative(assertFinite(totalWeight * pricePerTon));
  },
  },
  {
    id: "user.beam_weight_4",
    family: "general",
    label: "Kiriş Ağırlığı — PaintArea",
    fn: (inputs) => {
    const perimeter = num(inputs, "perimeter");
    const length = num(inputs, "length");
    return nonNegative(assertFinite(perimeter * length));
  },
  },
  {
    id: "user.beam_weight_5",
    family: "general",
    label: "Kiriş Ağırlığı — FireproofingArea",
    fn: (inputs) => {
    const paintArea = num(inputs, "paintArea");
    return nonNegative(assertFinite(paintArea));
  },
  },
  {
    id: "user.beam_weight_6",
    family: "general",
    label: "Kiriş Ağırlığı — Deflection_Max",
    fn: (inputs) => {
    const w = num(inputs, "w");
    const l = num(inputs, "l");
    const e = num(inputs, "e");
    const i = num(inputs, "i");
    return nonNegative(assertFinite((5 * w * l**4) / (384 * e * i)));
  },
  },
  {
    id: "user.beam_weight_7",
    family: "general",
    label: "Kiriş Ağırlığı — Moment_Max",
    fn: (inputs) => {
    const w = num(inputs, "w");
    const l = num(inputs, "l");
    return nonNegative(assertFinite((w * l**2) / 8));
  },
  },

  // ── Kompresör Kaçağı Maliyet (7 formulas) ──
  {
    id: "user.compressed_air_leak_0",
    family: "general",
    label: "Kompresör Kaçağı Maliyet — LeakFlow_CFM",
    fn: (inputs) => {
    const d = num(inputs, "d");
    const p = num(inputs, "p");
    const Line = num(inputs, "Line");
    const t = num(inputs, "t");
    const Abs = num(inputs, "Abs");
    return nonNegative(assertFinite((22.4 * d**2 * p_Line) / Math.sqrt(t_Abs)));
  },
  },
  {
    id: "user.compressed_air_leak_1",
    family: "general",
    label: "Kompresör Kaçağı Maliyet — Power_Loss_kW",
    fn: (inputs) => {
    const leakFlow = num(inputs, "leakFlow");
    const p = num(inputs, "p");
    const Line = num(inputs, "Line");
    const eff = num(inputs, "eff");
    const Compressor = num(inputs, "Compressor");
    return nonNegative(assertFinite((leakFlow_CFM * p_Line * 144) / (33000 * eff_Compressor)));
  },
  },
  {
    id: "user.compressed_air_leak_2",
    family: "general",
    label: "Kompresör Kaçağı Maliyet — AnnualEnergyLoss",
    fn: (inputs) => {
    const power = num(inputs, "power");
    const Loss = num(inputs, "Loss");
    const kW = num(inputs, "kW");
    const operatingHours = num(inputs, "operatingHours");
    return nonNegative(assertFinite(power_Loss_kW * operatingHours));
  },
  },
  {
    id: "user.compressed_air_leak_3",
    family: "general",
    label: "Kompresör Kaçağı Maliyet — Cost_Leak",
    fn: (inputs) => {
    const annualEnergyLoss = num(inputs, "annualEnergyLoss");
    const electricityRate = num(inputs, "electricityRate");
    return nonNegative(assertFinite(annualEnergyLoss * electricityRate));
  },
  },
  {
    id: "user.compressed_air_leak_4",
    family: "general",
    label: "Kompresör Kaçağı Maliyet — TotalLeakCost",
    fn: (inputs) => {
    const cost = num(inputs, "cost");
    const Leak = num(inputs, "Leak");
    const i = num(inputs, "i");
    return nonNegative(assertFinite(SUM(cost_Leak_i)));
  },
  },
  {
    id: "user.compressed_air_leak_5",
    family: "general",
    label: "Kompresör Kaçağı Maliyet — CarbonEmissions",
    fn: (inputs) => {
    const annualEnergyLoss = num(inputs, "annualEnergyLoss");
    const gridEmissionFactor = num(inputs, "gridEmissionFactor");
    return nonNegative(assertFinite(annualEnergyLoss * gridEmissionFactor));
  },
  },
  {
    id: "user.compressed_air_leak_6",
    family: "general",
    label: "Kompresör Kaçağı Maliyet — Payback_Repair",
    fn: (inputs) => {
    const repairCost = num(inputs, "repairCost");
    const cost = num(inputs, "cost");
    const Leak = num(inputs, "Leak");
    return nonNegative(assertFinite(repairCost / cost_Leak));
  },
  },

  // ── Kompresör Tankı Boyutlandırma (9 formulas) ──
  {
    id: "user.compressor_tank_sizing_0",
    family: "general",
    label: "Kompresör Tankı Boyutlandırma — V_Tank",
    fn: (inputs) => {
    const t = num(inputs, "t");
    const q = num(inputs, "q");
    const p = num(inputs, "p");
    const atm = num(inputs, "atm");
    const Max = num(inputs, "Max");
    const Min = num(inputs, "Min");
    return nonNegative(assertFinite((t * q * p_atm) / (p_Max - p_Min)));
  },
  },
  {
    id: "user.compressor_tank_sizing_1",
    family: "general",
    label: "Kompresör Tankı Boyutlandırma — t",
    fn: (inputs) => {
    const timeToFill = num(inputs, "timeToFill");
    return nonNegative(assertFinite(timeToFill));
  },
  },
  {
    id: "user.compressor_tank_sizing_2",
    family: "general",
    label: "Kompresör Tankı Boyutlandırma — Q",
    fn: (inputs) => {
    const freeAirDelivery = num(inputs, "freeAirDelivery");
    return nonNegative(assertFinite(freeAirDelivery));
  },
  },
  {
    id: "user.compressor_tank_sizing_3",
    family: "general",
    label: "Kompresör Tankı Boyutlandırma — P_Max",
    fn: (inputs) => {
    const cutOutPressure = num(inputs, "cutOutPressure");
    return nonNegative(assertFinite(cutOutPressure));
  },
  },
  {
    id: "user.compressor_tank_sizing_4",
    family: "general",
    label: "Kompresör Tankı Boyutlandırma — P_Min",
    fn: (inputs) => {
    const cutInPressure = num(inputs, "cutInPressure");
    return nonNegative(assertFinite(cutInPressure));
  },
  },
  {
    id: "user.compressor_tank_sizing_5",
    family: "general",
    label: "Kompresör Tankı Boyutlandırma — CycleTime",
    fn: (inputs) => {
    const v = num(inputs, "v");
    const Tank = num(inputs, "Tank");
    const p = num(inputs, "p");
    const Max = num(inputs, "Max");
    const Min = num(inputs, "Min");
    const q = num(inputs, "q");
    const atm = num(inputs, "atm");
    return nonNegative(assertFinite(v_Tank * (p_Max - p_Min) / (q * p_atm)));
  },
  },
  {
    id: "user.compressor_tank_sizing_6",
    family: "general",
    label: "Kompresör Tankı Boyutlandırma — CyclesPerHour",
    fn: (inputs) => {
    const cycleTime = num(inputs, "cycleTime");
    return nonNegative(assertFinite(60 / cycleTime));
  },
  },
  {
    id: "user.compressor_tank_sizing_7",
    family: "general",
    label: "Kompresör Tankı Boyutlandırma — MotorStartLimit",
    fn: (inputs) => {
    const cyclesPerHour = num(inputs, "cyclesPerHour");
    const maxStarts = num(inputs, "maxStarts");
    const fAIL = num(inputs, "fAIL");
    const pASS = num(inputs, "pASS");
    return nonNegative(assertFinite(((cyclesPerHour > maxStarts) ? ("fAIL") : ("pASS"))));
  },
  },
  {
    id: "user.compressor_tank_sizing_8",
    family: "general",
    label: "Kompresör Tankı Boyutlandırma — Cost_Tank",
    fn: (inputs) => {
    const volume = num(inputs, "volume");
    const pricePerLiter = num(inputs, "pricePerLiter");
    return nonNegative(assertFinite(volume * pricePerLiter));
  },
  },

  // ── Konteyner Yükü (7 formulas) ──
  {
    id: "user.container_load_0",
    family: "general",
    label: "Konteyner Yükü — Volume_Utilization",
    fn: (inputs) => {
    const itemVolume = num(inputs, "itemVolume");
    const i = num(inputs, "i");
    const containerMaxVolume = num(inputs, "containerMaxVolume");
    return nonNegative(assertFinite(SUM(itemVolume_i) / containerMaxVolume));
  },
  },
  {
    id: "user.container_load_1",
    family: "general",
    label: "Konteyner Yükü — Weight_Utilization",
    fn: (inputs) => {
    const itemWeight = num(inputs, "itemWeight");
    const i = num(inputs, "i");
    const containerMaxPayload = num(inputs, "containerMaxPayload");
    return nonNegative(assertFinite(SUM(itemWeight_i) / containerMaxPayload));
  },
  },
  {
    id: "user.container_load_2",
    family: "general",
    label: "Konteyner Yükü — ChargeableWeight",
    fn: (inputs) => {
    const grossWeight = num(inputs, "grossWeight");
    const volumetricWeight = num(inputs, "volumetricWeight");
    return nonNegative(assertFinite(Math.max(grossWeight, volumetricWeight)));
  },
  },
  {
    id: "user.container_load_3",
    family: "general",
    label: "Konteyner Yükü — LoadEfficiency",
    fn: (inputs) => {
    const volume = num(inputs, "volume");
    const Utilization = num(inputs, "Utilization");
    const weight = num(inputs, "weight");
    return nonNegative(assertFinite(Math.min(volume_Utilization, weight_Utilization)));
  },
  },
  {
    id: "user.container_load_4",
    family: "general",
    label: "Konteyner Yükü — WastedSpaceCost",
    fn: (inputs) => {
    const loadEfficiency = num(inputs, "loadEfficiency");
    const freightCost = num(inputs, "freightCost");
    return nonNegative(assertFinite((1 - loadEfficiency) * freightCost));
  },
  },
  {
    id: "user.container_load_5",
    family: "general",
    label: "Konteyner Yükü — PalletStacking",
    fn: (inputs) => {
    const containerHeight = num(inputs, "containerHeight");
    const palletHeight = num(inputs, "palletHeight");
    return nonNegative(assertFinite(floor(containerHeight / palletHeight)));
  },
  },
  {
    id: "user.container_load_6",
    family: "general",
    label: "Konteyner Yükü — MaxPallets",
    fn: (inputs) => {
    const palletStacking = num(inputs, "palletStacking");
    const floorArea = num(inputs, "floorArea");
    const Pallets = num(inputs, "Pallets");
    const weightLimit = num(inputs, "weightLimit");
    const palletWeight = num(inputs, "palletWeight");
    return nonNegative(assertFinite(Math.min(palletStacking * floorArea_Pallets, weightLimit / palletWeight)));
  },
  },

  // ── Kumaş Kesim Optimize Edici (6 formulas) ──
  {
    id: "user.fabric_cutting_optimizer_0",
    family: "general",
    label: "Kumaş Kesim Optimize Edici — MarkerEfficiency",
    fn: (inputs) => {
    const totalPatternArea = num(inputs, "totalPatternArea");
    const markerLength = num(inputs, "markerLength");
    const fabricWidth = num(inputs, "fabricWidth");
    return nonNegative(assertFinite((totalPatternArea / (markerLength * fabricWidth)) * 100));
  },
  },
  {
    id: "user.fabric_cutting_optimizer_1",
    family: "general",
    label: "Kumaş Kesim Optimize Edici — FabricRequired",
    fn: (inputs) => {
    const totalPatternArea = num(inputs, "totalPatternArea");
    const markerEfficiency = num(inputs, "markerEfficiency");
    const endLossPct = num(inputs, "endLossPct");
    return nonNegative(assertFinite((totalPatternArea / markerEfficiency) * (1 + endLossPct)));
  },
  },
  {
    id: "user.fabric_cutting_optimizer_2",
    family: "general",
    label: "Kumaş Kesim Optimize Edici — Cost_Fabric",
    fn: (inputs) => {
    const fabricRequired = num(inputs, "fabricRequired");
    const pricePerMeter = num(inputs, "pricePerMeter");
    return nonNegative(assertFinite(fabricRequired * pricePerMeter));
  },
  },
  {
    id: "user.fabric_cutting_optimizer_3",
    family: "general",
    label: "Kumaş Kesim Optimize Edici — Utilization_Gain",
    fn: (inputs) => {
    const newEfficiency = num(inputs, "newEfficiency");
    const oldEfficiency = num(inputs, "oldEfficiency");
    const fabricRequired = num(inputs, "fabricRequired");
    const pricePerMeter = num(inputs, "pricePerMeter");
    return nonNegative(assertFinite((newEfficiency - oldEfficiency) * fabricRequired * pricePerMeter));
  },
  },
  {
    id: "user.fabric_cutting_optimizer_4",
    family: "general",
    label: "Kumaş Kesim Optimize Edici — SplicingLoss",
    fn: (inputs) => {
    const splices = num(inputs, "splices");
    const overlapLength = num(inputs, "overlapLength");
    const fabricWidth = num(inputs, "fabricWidth");
    return nonNegative(assertFinite(splices * overlapLength * fabricWidth));
  },
  },
  {
    id: "user.fabric_cutting_optimizer_5",
    family: "general",
    label: "Kumaş Kesim Optimize Edici — TotalYardage",
    fn: (inputs) => {
    const markerLength = num(inputs, "markerLength");
    const endLoss = num(inputs, "endLoss");
    const splicingLoss = num(inputs, "splicingLoss");
    return nonNegative(assertFinite(markerLength + endLoss + splicingLoss));
  },
  },

  // ── Kur Riski (7 formulas) ──
  {
    id: "user.currency_risk_0",
    family: "general",
    label: "Kur Riski — Exposure_FC",
    fn: (inputs) => {
    const totalRevenue = num(inputs, "totalRevenue");
    const totalCost = num(inputs, "totalCost");
    return nonNegative(assertFinite(totalRevenue_FC - totalCost_FC));
  },
  },
  {
    id: "user.currency_risk_1",
    family: "general",
    label: "Kur Riski — VaR_Historical",
    fn: (inputs) => {
    const exposure = num(inputs, "exposure");
    const stdDev = num(inputs, "stdDev");
    const ExchangeRate = num(inputs, "ExchangeRate");
    const z = num(inputs, "z");
    const Score = num(inputs, "Score");
    return nonNegative(assertFinite(exposure_FC * stdDev_ExchangeRate * z_Score));
  },
  },
  {
    id: "user.currency_risk_2",
    family: "general",
    label: "Kur Riski — VaR_Parametric",
    fn: (inputs) => {
    const exposure = num(inputs, "exposure");
    const volatility = num(inputs, "volatility");
    const timeHorizon = num(inputs, "timeHorizon");
    return nonNegative(assertFinite(exposure_FC * volatility * Math.sqrt(timeHorizon)));
  },
  },
  {
    id: "user.currency_risk_3",
    family: "general",
    label: "Kur Riski — HedgedExposure",
    fn: (inputs) => {
    const exposure = num(inputs, "exposure");
    const hedgeRatio = num(inputs, "hedgeRatio");
    return nonNegative(assertFinite(exposure_FC * hedgeRatio));
  },
  },
  {
    id: "user.currency_risk_4",
    family: "general",
    label: "Kur Riski — UnhedgedVaR",
    fn: (inputs) => {
    const vaR = num(inputs, "vaR");
    const Historical = num(inputs, "Historical");
    const hedgeRatio = num(inputs, "hedgeRatio");
    return nonNegative(assertFinite(vaR_Historical * (1 - hedgeRatio)));
  },
  },
  {
    id: "user.currency_risk_5",
    family: "general",
    label: "Kur Riski — CostOfHedge",
    fn: (inputs) => {
    const notional = num(inputs, "notional");
    const forwardPoints = num(inputs, "forwardPoints");
    return nonNegative(assertFinite(notional * forwardPoints));
  },
  },
  {
    id: "user.currency_risk_6",
    family: "general",
    label: "Kur Riski — NetImpact",
    fn: (inputs) => {
    const spotRate = num(inputs, "spotRate");
    const forwardRate = num(inputs, "forwardRate");
    const hedgedExposure = num(inputs, "hedgedExposure");
    return nonNegative(assertFinite((spotRate - forwardRate) * hedgedExposure));
  },
  },

  // ── KWh Maliyet (7 formulas) ──
  {
    id: "user.kwh_cost_0",
    family: "general",
    label: "KWh Maliyet — EnergyCharge",
    fn: (inputs) => {
    const activeEnergy = num(inputs, "activeEnergy");
    const energyRate = num(inputs, "energyRate");
    return nonNegative(assertFinite(activeEnergy * energyRate));
  },
  },
  {
    id: "user.kwh_cost_1",
    family: "general",
    label: "KWh Maliyet — DemandCharge",
    fn: (inputs) => {
    const peakDemand = num(inputs, "peakDemand");
    const demandRate = num(inputs, "demandRate");
    return nonNegative(assertFinite(peakDemand * demandRate));
  },
  },
  {
    id: "user.kwh_cost_2",
    family: "general",
    label: "KWh Maliyet — ReactivePenalty",
    fn: (inputs) => {
    const powerFactor = num(inputs, "powerFactor");
    const threshold = num(inputs, "threshold");
    const reactiveEnergy = num(inputs, "reactiveEnergy");
    const penaltyRate = num(inputs, "penaltyRate");
    return nonNegative(assertFinite(((powerFactor < threshold) ? (reactiveEnergy * penaltyRate) : (0))));
  },
  },
  {
    id: "user.kwh_cost_3",
    family: "general",
    label: "KWh Maliyet — TaxesAndFees",
    fn: (inputs) => {
    const energyCharge = num(inputs, "energyCharge");
    const demandCharge = num(inputs, "demandCharge");
    const taxRate = num(inputs, "taxRate");
    return nonNegative(assertFinite((energyCharge + demandCharge) * taxRate));
  },
  },
  {
    id: "user.kwh_cost_4",
    family: "general",
    label: "KWh Maliyet — TotalBill",
    fn: (inputs) => {
    const energyCharge = num(inputs, "energyCharge");
    const demandCharge = num(inputs, "demandCharge");
    const reactivePenalty = num(inputs, "reactivePenalty");
    const taxesAndFees = num(inputs, "taxesAndFees");
    return nonNegative(assertFinite(energyCharge + demandCharge + reactivePenalty + taxesAndFees));
  },
  },
  {
    id: "user.kwh_cost_5",
    family: "general",
    label: "KWh Maliyet — UnitCost_kWh",
    fn: (inputs) => {
    const totalBill = num(inputs, "totalBill");
    const activeEnergy = num(inputs, "activeEnergy");
    return nonNegative(assertFinite(totalBill / activeEnergy));
  },
  },
  {
    id: "user.kwh_cost_6",
    family: "general",
    label: "KWh Maliyet — PeakShavingSavings",
    fn: (inputs) => {
    const oldPeak = num(inputs, "oldPeak");
    const newPeak = num(inputs, "newPeak");
    const demandRate = num(inputs, "demandRate");
    return nonNegative(assertFinite((oldPeak - newPeak) * demandRate));
  },
  },

  // ── Lojistik Rota Kaybı (7 formulas) ──
  {
    id: "user.logistics_route_loss_0",
    family: "general",
    label: "Lojistik Rota Kaybı — IdealDistance",
    fn: (inputs) => {
    const pointToPoint = num(inputs, "pointToPoint");
    const Distance = num(inputs, "Distance");
    return nonNegative(assertFinite(pointToPoint_Distance));
  },
  },
  {
    id: "user.logistics_route_loss_1",
    family: "general",
    label: "Lojistik Rota Kaybı — ActualDistance",
    fn: (inputs) => {
    const routeDistance = num(inputs, "routeDistance");
    return nonNegative(assertFinite(routeDistance));
  },
  },
  {
    id: "user.logistics_route_loss_2",
    family: "general",
    label: "Lojistik Rota Kaybı — DriftPct",
    fn: (inputs) => {
    const actualDistance = num(inputs, "actualDistance");
    const idealDistance = num(inputs, "idealDistance");
    return nonNegative(assertFinite((actualDistance - idealDistance) / idealDistance));
  },
  },
  {
    id: "user.logistics_route_loss_3",
    family: "general",
    label: "Lojistik Rota Kaybı — FuelWaste",
    fn: (inputs) => {
    const actualDistance = num(inputs, "actualDistance");
    const idealDistance = num(inputs, "idealDistance");
    const fuelConsumptionRate = num(inputs, "fuelConsumptionRate");
    const fuelPrice = num(inputs, "fuelPrice");
    return nonNegative(assertFinite((actualDistance - idealDistance) * fuelConsumptionRate * fuelPrice));
  },
  },
  {
    id: "user.logistics_route_loss_4",
    family: "general",
    label: "Lojistik Rota Kaybı — TimeWaste",
    fn: (inputs) => {
    const actualDistance = num(inputs, "actualDistance");
    const idealDistance = num(inputs, "idealDistance");
    const avgSpeed = num(inputs, "avgSpeed");
    const driverHourlyRate = num(inputs, "driverHourlyRate");
    return nonNegative(assertFinite((actualDistance - idealDistance) / avgSpeed * driverHourlyRate));
  },
  },
  {
    id: "user.logistics_route_loss_5",
    family: "general",
    label: "Lojistik Rota Kaybı — TotalRouteLoss",
    fn: (inputs) => {
    const fuelWaste = num(inputs, "fuelWaste");
    const timeWaste = num(inputs, "timeWaste");
    const vehicleWearCost = num(inputs, "vehicleWearCost");
    return nonNegative(assertFinite(fuelWaste + timeWaste + vehicleWearCost));
  },
  },
  {
    id: "user.logistics_route_loss_6",
    family: "general",
    label: "Lojistik Rota Kaybı — Efficiency",
    fn: (inputs) => {
    const idealDistance = num(inputs, "idealDistance");
    const actualDistance = num(inputs, "actualDistance");
    return nonNegative(assertFinite(idealDistance / actualDistance));
  },
  },

  // ── Mağaza Saatlik Ücret (7 formulas) ──
  {
    id: "user.shop_hourly_rate_0",
    family: "general",
    label: "Mağaza Saatlik Ücret — DirectLabor",
    fn: (inputs) => {
    const technicianWages = num(inputs, "technicianWages");
    return nonNegative(assertFinite(SUM(technicianWages)));
  },
  },
  {
    id: "user.shop_hourly_rate_1",
    family: "general",
    label: "Mağaza Saatlik Ücret — IndirectLabor",
    fn: (inputs) => {
    const managerWages = num(inputs, "managerWages");
    const adminWages = num(inputs, "adminWages");
    return nonNegative(assertFinite(SUM(managerWages + adminWages)));
  },
  },
  {
    id: "user.shop_hourly_rate_2",
    family: "general",
    label: "Mağaza Saatlik Ücret — Overhead",
    fn: (inputs) => {
    const rent = num(inputs, "rent");
    const utilities = num(inputs, "utilities");
    const insurance = num(inputs, "insurance");
    const tools = num(inputs, "tools");
    const depreciation = num(inputs, "depreciation");
    return nonNegative(assertFinite(rent + utilities + insurance + tools + depreciation));
  },
  },
  {
    id: "user.shop_hourly_rate_3",
    family: "general",
    label: "Mağaza Saatlik Ücret — TotalShopCost",
    fn: (inputs) => {
    const directLabor = num(inputs, "directLabor");
    const indirectLabor = num(inputs, "indirectLabor");
    const overhead = num(inputs, "overhead");
    return nonNegative(assertFinite(directLabor + indirectLabor + overhead));
  },
  },
  {
    id: "user.shop_hourly_rate_4",
    family: "general",
    label: "Mağaza Saatlik Ücret — BillableHours",
    fn: (inputs) => {
    const totalAvailableHours = num(inputs, "totalAvailableHours");
    const utilizationRate = num(inputs, "utilizationRate");
    return nonNegative(assertFinite(totalAvailableHours * utilizationRate));
  },
  },
  {
    id: "user.shop_hourly_rate_5",
    family: "general",
    label: "Mağaza Saatlik Ücret — ShopHourlyRate",
    fn: (inputs) => {
    const totalShopCost = num(inputs, "totalShopCost");
    const billableHours = num(inputs, "billableHours");
    return nonNegative(assertFinite(totalShopCost / billableHours));
  },
  },
  {
    id: "user.shop_hourly_rate_6",
    family: "general",
    label: "Mağaza Saatlik Ücret — EffectiveMargin",
    fn: (inputs) => {
    const actualBillingRate = num(inputs, "actualBillingRate");
    const shopHourlyRate = num(inputs, "shopHourlyRate");
    return nonNegative(assertFinite((actualBillingRate - shopHourlyRate) / actualBillingRate));
  },
  },

  // ── Mahsul Verim Kaybı Analizörü (8 formulas) ──
  {
    id: "user.crop_yield_loss_0",
    family: "general",
    label: "Mahsul Verim Kaybı Analizörü — PotentialYield",
    fn: (inputs) => {
    const geneticPotential = num(inputs, "geneticPotential");
    const environmentFactor = num(inputs, "environmentFactor");
    return nonNegative(assertFinite(geneticPotential * environmentFactor));
  },
  },
  {
    id: "user.crop_yield_loss_1",
    family: "general",
    label: "Mahsul Verim Kaybı Analizörü — ActualYield",
    fn: (inputs) => {
    const harvestedWeight = num(inputs, "harvestedWeight");
    const area = num(inputs, "area");
    return nonNegative(assertFinite(harvestedWeight / area));
  },
  },
  {
    id: "user.crop_yield_loss_2",
    family: "general",
    label: "Mahsul Verim Kaybı Analizörü — YieldGap",
    fn: (inputs) => {
    const potentialYield = num(inputs, "potentialYield");
    const actualYield = num(inputs, "actualYield");
    return nonNegative(assertFinite(potentialYield - actualYield));
  },
  },
  {
    id: "user.crop_yield_loss_3",
    family: "general",
    label: "Mahsul Verim Kaybı Analizörü — Loss_Pest",
    fn: (inputs) => {
    const pestDamagePct = num(inputs, "pestDamagePct");
    const potentialYield = num(inputs, "potentialYield");
    return nonNegative(assertFinite(pestDamagePct * potentialYield));
  },
  },
  {
    id: "user.crop_yield_loss_4",
    family: "general",
    label: "Mahsul Verim Kaybı Analizörü — Loss_Weather",
    fn: (inputs) => {
    const weatherStressPct = num(inputs, "weatherStressPct");
    const potentialYield = num(inputs, "potentialYield");
    return nonNegative(assertFinite(weatherStressPct * potentialYield));
  },
  },
  {
    id: "user.crop_yield_loss_5",
    family: "general",
    label: "Mahsul Verim Kaybı Analizörü — Loss_Nutrient",
    fn: (inputs) => {
    const nutrientDeficiencyPct = num(inputs, "nutrientDeficiencyPct");
    const potentialYield = num(inputs, "potentialYield");
    return nonNegative(assertFinite(nutrientDeficiencyPct * potentialYield));
  },
  },
  {
    id: "user.crop_yield_loss_6",
    family: "general",
    label: "Mahsul Verim Kaybı Analizörü — FinancialLoss",
    fn: (inputs) => {
    const yieldGap = num(inputs, "yieldGap");
    const marketPrice = num(inputs, "marketPrice");
    return nonNegative(assertFinite(yieldGap * marketPrice));
  },
  },
  {
    id: "user.crop_yield_loss_7",
    family: "general",
    label: "Mahsul Verim Kaybı Analizörü — ROI_Intervention",
    fn: (inputs) => {
    const financialLoss = num(inputs, "financialLoss");
    const Recovered = num(inputs, "Recovered");
    const interventionCost = num(inputs, "interventionCost");
    return nonNegative(assertFinite((financialLoss_Recovered - interventionCost) / interventionCost));
  },
  },

  // ── Makine Ekonomik Ömrü (7 formulas) ──
  {
    id: "user.machine_economic_life_0",
    family: "general",
    label: "Makine Ekonomik Ömrü — EUAC_Capital",
    fn: (inputs) => {
    const initialCost = num(inputs, "initialCost");
    const salvageValue = num(inputs, "salvageValue");
    const a = num(inputs, "a");
    const p = num(inputs, "p");
    const i = num(inputs, "i");
    const n = num(inputs, "n");
    return nonNegative(assertFinite((initialCost - salvageValue) * (a/p, i, n) + salvageValue * i));
  },
  },
  {
    id: "user.machine_economic_life_1",
    family: "general",
    label: "Makine Ekonomik Ömrü — EUAC_Operating",
    fn: (inputs) => {
    const opCost = num(inputs, "opCost");
    const t = num(inputs, "t");
    const p = num(inputs, "p");
    const f = num(inputs, "f");
    const i = num(inputs, "i");
    const a = num(inputs, "a");
    const n = num(inputs, "n");
    return nonNegative(assertFinite(SUM(opCost_t * (p/f, i, t)) * (a/p, i, n)));
  },
  },
  {
    id: "user.machine_economic_life_2",
    family: "general",
    label: "Makine Ekonomik Ömrü — TotalEUAC",
    fn: (inputs) => {
    const eUAC = num(inputs, "eUAC");
    const Capital = num(inputs, "Capital");
    const Operating = num(inputs, "Operating");
    return nonNegative(assertFinite(eUAC_Capital + eUAC_Operating));
  },
  },
  {
    id: "user.machine_economic_life_3",
    family: "general",
    label: "Makine Ekonomik Ömrü — EconomicLife",
    fn: (inputs) => {
    const n = num(inputs, "n");
    const where = num(inputs, "where");
    const totalEUAC = num(inputs, "totalEUAC");
    const is = num(inputs, "is");
    const mINIMUM = num(inputs, "mINIMUM");
    return nonNegative(assertFinite(n where totalEUAC is mINIMUM));
  },
  },
  {
    id: "user.machine_economic_life_4",
    family: "general",
    label: "Makine Ekonomik Ömrü — Defender_EUAC",
    fn: (inputs) => {
    const currentMarketValue = num(inputs, "currentMarketValue");
    const a = num(inputs, "a");
    const p = num(inputs, "p");
    const i = num(inputs, "i");
    const n = num(inputs, "n");
    const opCost = num(inputs, "opCost");
    const Defender = num(inputs, "Defender");
    return nonNegative(assertFinite(currentMarketValue * (a/p, i, n) + opCost_Defender));
  },
  },
  {
    id: "user.machine_economic_life_5",
    family: "general",
    label: "Makine Ekonomik Ömrü — Challenger_EUAC",
    fn: (inputs) => {
    const eUAC = num(inputs, "eUAC");
    const NewMachine = num(inputs, "NewMachine");
    return nonNegative(assertFinite(eUAC_NewMachine));
  },
  },
  {
    id: "user.machine_economic_life_6",
    family: "general",
    label: "Makine Ekonomik Ömrü — ReplacementDecision",
    fn: (inputs) => {
    const defender = num(inputs, "defender");
    const challenger = num(inputs, "challenger");
    const replace = num(inputs, "replace");
    const keep = num(inputs, "keep");
    return nonNegative(assertFinite(((defender_EUAC > challenger_EUAC) ? ("replace") : ("keep"))));
  },
  },

  // ── Malzeme Replacement Maliyet (6 formulas) ──
  {
    id: "user.material_replacement_cost_0",
    family: "general",
    label: "Malzeme Replacement Maliyet — TCO_Current",
    fn: (inputs) => {
    const matCost = num(inputs, "matCost");
    const Current = num(inputs, "Current");
    const processingCost = num(inputs, "processingCost");
    const lifecycleMaint = num(inputs, "lifecycleMaint");
    const disposalCost = num(inputs, "disposalCost");
    return nonNegative(assertFinite(matCost_Current + processingCost_Current + lifecycleMaint_Current + disposalCost_Current));
  },
  },
  {
    id: "user.material_replacement_cost_1",
    family: "general",
    label: "Malzeme Replacement Maliyet — TCO_Alternative",
    fn: (inputs) => {
    const matCost = num(inputs, "matCost");
    const Alt = num(inputs, "Alt");
    const processingCost = num(inputs, "processingCost");
    const lifecycleMaint = num(inputs, "lifecycleMaint");
    const disposalCost = num(inputs, "disposalCost");
    return nonNegative(assertFinite(matCost_Alt + processingCost_Alt + lifecycleMaint_Alt + disposalCost_Alt));
  },
  },
  {
    id: "user.material_replacement_cost_2",
    family: "general",
    label: "Malzeme Replacement Maliyet — WeightSavings",
    fn: (inputs) => {
    const weight = num(inputs, "weight");
    const Current = num(inputs, "Current");
    const Alt = num(inputs, "Alt");
    return nonNegative(assertFinite(weight_Current - weight_Alt));
  },
  },
  {
    id: "user.material_replacement_cost_3",
    family: "general",
    label: "Malzeme Replacement Maliyet — FuelSavings",
    fn: (inputs) => {
    const weightSavings = num(inputs, "weightSavings");
    const fuelFactor = num(inputs, "fuelFactor");
    const lifecycleDistance = num(inputs, "lifecycleDistance");
    const fuelPrice = num(inputs, "fuelPrice");
    return nonNegative(assertFinite(weightSavings * fuelFactor * lifecycleDistance * fuelPrice));
  },
  },
  {
    id: "user.material_replacement_cost_4",
    family: "general",
    label: "Malzeme Replacement Maliyet — NetBenefit",
    fn: (inputs) => {
    const tCO = num(inputs, "tCO");
    const Current = num(inputs, "Current");
    const Alternative = num(inputs, "Alternative");
    const fuelSavings = num(inputs, "fuelSavings");
    const qualityPremium = num(inputs, "qualityPremium");
    return nonNegative(assertFinite(tCO_Current - tCO_Alternative + fuelSavings + qualityPremium));
  },
  },
  {
    id: "user.material_replacement_cost_5",
    family: "general",
    label: "Malzeme Replacement Maliyet — Payback",
    fn: (inputs) => {
    const toolingCost = num(inputs, "toolingCost");
    const Alt = num(inputs, "Alt");
    const qualificationCost = num(inputs, "qualificationCost");
    const annualNetBenefit = num(inputs, "annualNetBenefit");
    return nonNegative(assertFinite((toolingCost_Alt + qualificationCost) / annualNetBenefit));
  },
  },

  // ── MOQ Stok Denge (6 formulas) ──
  {
    id: "user.moq_stock_balance_0",
    family: "general",
    label: "MOQ Stok Denge — EOQ",
    fn: (inputs) => {
    const annualDemand = num(inputs, "annualDemand");
    const orderCost = num(inputs, "orderCost");
    const holdingCost = num(inputs, "holdingCost");
    return nonNegative(assertFinite(Math.sqrt((2 * annualDemand * orderCost) / holdingCost)));
  },
  },
  {
    id: "user.moq_stock_balance_1",
    family: "general",
    label: "MOQ Stok Denge — MOQ_Penalty",
    fn: (inputs) => {
    const mOQ = num(inputs, "mOQ");
    const eOQ = num(inputs, "eOQ");
    const holdingCost = num(inputs, "holdingCost");
    return nonNegative(assertFinite(((mOQ > eOQ) ? ((mOQ - eOQ)/2 * holdingCost) : (0))));
  },
  },
  {
    id: "user.moq_stock_balance_2",
    family: "general",
    label: "MOQ Stok Denge — PriceBreakSavings",
    fn: (inputs) => {
    const unitPrice = num(inputs, "unitPrice");
    const Standard = num(inputs, "Standard");
    const annualDemand = num(inputs, "annualDemand");
    return nonNegative(assertFinite((unitPrice_Standard - unitPrice_MOQ) * annualDemand));
  },
  },
  {
    id: "user.moq_stock_balance_3",
    family: "general",
    label: "MOQ Stok Denge — NetBenefit",
    fn: (inputs) => {
    const priceBreakSavings = num(inputs, "priceBreakSavings");
    const mOQ = num(inputs, "mOQ");
    const Penalty = num(inputs, "Penalty");
    const additionalOrderCostSavings = num(inputs, "additionalOrderCostSavings");
    return nonNegative(assertFinite(priceBreakSavings - mOQ_Penalty - additionalOrderCostSavings));
  },
  },
  {
    id: "user.moq_stock_balance_4",
    family: "general",
    label: "MOQ Stok Denge — OptimalOrderQty",
    fn: (inputs) => {
    const netBenefit = num(inputs, "netBenefit");
    const mOQ = num(inputs, "mOQ");
    const eOQ = num(inputs, "eOQ");
    return nonNegative(assertFinite(((netBenefit > 0) ? (mOQ) : (eOQ))));
  },
  },
  {
    id: "user.moq_stock_balance_5",
    family: "general",
    label: "MOQ Stok Denge — CycleStock_Cost",
    fn: (inputs) => {
    const optimalOrderQty = num(inputs, "optimalOrderQty");
    const holdingCost = num(inputs, "holdingCost");
    return nonNegative(assertFinite((optimalOrderQty / 2) * holdingCost));
  },
  },

  // ── MTBF/MTTR Finansal Etki (8 formulas) ──
  {
    id: "user.mtbf_mttr_financial_0",
    family: "general",
    label: "MTBF/MTTR Finansal Etki — Availability",
    fn: (inputs) => {
    const mTBF = num(inputs, "mTBF");
    const mTTR = num(inputs, "mTTR");
    return nonNegative(assertFinite(mTBF / (mTBF + mTTR)));
  },
  },
  {
    id: "user.mtbf_mttr_financial_1",
    family: "general",
    label: "MTBF/MTTR Finansal Etki — ExpectedDowntime",
    fn: (inputs) => {
    const totalTime = num(inputs, "totalTime");
    const availability = num(inputs, "availability");
    return nonNegative(assertFinite(totalTime * (1 - availability)));
  },
  },
  {
    id: "user.mtbf_mttr_financial_2",
    family: "general",
    label: "MTBF/MTTR Finansal Etki — DowntimeCost",
    fn: (inputs) => {
    const expectedDowntime = num(inputs, "expectedDowntime");
    const costPerHour = num(inputs, "costPerHour");
    return nonNegative(assertFinite(expectedDowntime * costPerHour));
  },
  },
  {
    id: "user.mtbf_mttr_financial_3",
    family: "general",
    label: "MTBF/MTTR Finansal Etki — FailureFrequency",
    fn: (inputs) => {
    const totalTime = num(inputs, "totalTime");
    const mTBF = num(inputs, "mTBF");
    return nonNegative(assertFinite(totalTime / mTBF));
  },
  },
  {
    id: "user.mtbf_mttr_financial_4",
    family: "general",
    label: "MTBF/MTTR Finansal Etki — RepairCost",
    fn: (inputs) => {
    const failureFrequency = num(inputs, "failureFrequency");
    const mTTR = num(inputs, "mTTR");
    const laborRate = num(inputs, "laborRate");
    const partsCost = num(inputs, "partsCost");
    return nonNegative(assertFinite(failureFrequency * (mTTR * laborRate + partsCost)));
  },
  },
  {
    id: "user.mtbf_mttr_financial_5",
    family: "general",
    label: "MTBF/MTTR Finansal Etki — TotalReliabilityCost",
    fn: (inputs) => {
    const downtimeCost = num(inputs, "downtimeCost");
    const repairCost = num(inputs, "repairCost");
    return nonNegative(assertFinite(downtimeCost + repairCost));
  },
  },
  {
    id: "user.mtbf_mttr_financial_6",
    family: "general",
    label: "MTBF/MTTR Finansal Etki — ROI_Improvement",
    fn: (inputs) => {
    const oldCost = num(inputs, "oldCost");
    const newCost = num(inputs, "newCost");
    const investmentCost = num(inputs, "investmentCost");
    return nonNegative(assertFinite((oldCost - newCost) / investmentCost));
  },
  },
  {
    id: "user.mtbf_mttr_financial_7",
    family: "general",
    label: "MTBF/MTTR Finansal Etki — TargetMTBF",
    fn: (inputs) => {
    const totalTime = num(inputs, "totalTime");
    const targetAvailability = num(inputs, "targetAvailability");
    return nonNegative(assertFinite(-totalTime / Math.log(targetAvailability)));
  },
  },

  // ── Muda Atık Maliyet (8 formulas) ──
  {
    id: "user.muda_waste_cost_0",
    family: "general",
    label: "Muda Atık Maliyet — Overproduction",
    fn: (inputs) => {
    const excessUnits = num(inputs, "excessUnits");
    const unitCost = num(inputs, "unitCost");
    return nonNegative(assertFinite(excessUnits * unitCost));
  },
  },
  {
    id: "user.muda_waste_cost_1",
    family: "general",
    label: "Muda Atık Maliyet — Waiting",
    fn: (inputs) => {
    const waitingHours = num(inputs, "waitingHours");
    const laborRate = num(inputs, "laborRate");
    const machineRate = num(inputs, "machineRate");
    return nonNegative(assertFinite(waitingHours * (laborRate + machineRate)));
  },
  },
  {
    id: "user.muda_waste_cost_2",
    family: "general",
    label: "Muda Atık Maliyet — Transport",
    fn: (inputs) => {
    const transportDistance = num(inputs, "transportDistance");
    const costPerMeter = num(inputs, "costPerMeter");
    const trips = num(inputs, "trips");
    return nonNegative(assertFinite(transportDistance * costPerMeter * trips));
  },
  },
  {
    id: "user.muda_waste_cost_3",
    family: "general",
    label: "Muda Atık Maliyet — Overprocessing",
    fn: (inputs) => {
    const actualTime = num(inputs, "actualTime");
    const standardTime = num(inputs, "standardTime");
    const laborRate = num(inputs, "laborRate");
    return nonNegative(assertFinite((actualTime - standardTime) * laborRate));
  },
  },
  {
    id: "user.muda_waste_cost_4",
    family: "general",
    label: "Muda Atık Maliyet — Inventory",
    fn: (inputs) => {
    const excessInventory = num(inputs, "excessInventory");
    const holdingCostRate = num(inputs, "holdingCostRate");
    const time = num(inputs, "time");
    return nonNegative(assertFinite(excessInventory * holdingCostRate * time));
  },
  },
  {
    id: "user.muda_waste_cost_5",
    family: "general",
    label: "Muda Atık Maliyet — Motion",
    fn: (inputs) => {
    const unnecessaryMotionTime = num(inputs, "unnecessaryMotionTime");
    const laborRate = num(inputs, "laborRate");
    return nonNegative(assertFinite(unnecessaryMotionTime * laborRate));
  },
  },
  {
    id: "user.muda_waste_cost_6",
    family: "general",
    label: "Muda Atık Maliyet — Defects",
    fn: (inputs) => {
    const defectUnits = num(inputs, "defectUnits");
    const materialCost = num(inputs, "materialCost");
    const reworkCost = num(inputs, "reworkCost");
    return nonNegative(assertFinite(defectUnits * (materialCost + reworkCost)));
  },
  },
  {
    id: "user.muda_waste_cost_7",
    family: "general",
    label: "Muda Atık Maliyet — TotalMudaCost",
    fn: (inputs) => {
    const overproduction = num(inputs, "overproduction");
    const waiting = num(inputs, "waiting");
    const transport = num(inputs, "transport");
    const overprocessing = num(inputs, "overprocessing");
    const inventory = num(inputs, "inventory");
    const motion = num(inputs, "motion");
    const defects = num(inputs, "defects");
    return nonNegative(assertFinite(SUM(overproduction, waiting, transport, overprocessing, inventory, motion, defects)));
  },
  },

  // ── Nakit Akışı Açığı (10 formulas) ──
  {
    id: "user.cash_flow_gap_0",
    family: "general",
    label: "Nakit Akışı Açığı — CashInflow",
    fn: (inputs) => {
    const receipts = num(inputs, "receipts");
    const t = num(inputs, "t");
    return nonNegative(assertFinite(SUM(receipts_t)));
  },
  },
  {
    id: "user.cash_flow_gap_1",
    family: "general",
    label: "Nakit Akışı Açığı — CashOutflow",
    fn: (inputs) => {
    const payments = num(inputs, "payments");
    const t = num(inputs, "t");
    return nonNegative(assertFinite(SUM(payments_t)));
  },
  },
  {
    id: "user.cash_flow_gap_2",
    family: "general",
    label: "Nakit Akışı Açığı — NetCashFlow_t",
    fn: (inputs) => {
    const cashInflow = num(inputs, "cashInflow");
    const t = num(inputs, "t");
    const cashOutflow = num(inputs, "cashOutflow");
    return nonNegative(assertFinite(cashInflow_t - cashOutflow_t));
  },
  },
  {
    id: "user.cash_flow_gap_3",
    family: "general",
    label: "Nakit Akışı Açığı — CumulativeCashFlow",
    fn: (inputs) => {
    const netCashFlow = num(inputs, "netCashFlow");
    const t = num(inputs, "t");
    return nonNegative(assertFinite(SUM(netCashFlow_t)));
  },
  },
  {
    id: "user.cash_flow_gap_4",
    family: "general",
    label: "Nakit Akışı Açığı — CashGap",
    fn: (inputs) => {
    const cumulativeCashFlow = num(inputs, "cumulativeCashFlow");
    return nonNegative(assertFinite(Math.max(0, -Math.min(cumulativeCashFlow))));
  },
  },
  {
    id: "user.cash_flow_gap_5",
    family: "general",
    label: "Nakit Akışı Açığı — DSO",
    fn: (inputs) => {
    const accountsReceivable = num(inputs, "accountsReceivable");
    const totalCreditSales = num(inputs, "totalCreditSales");
    const days = num(inputs, "days");
    return nonNegative(assertFinite((accountsReceivable / totalCreditSales) * days));
  },
  },
  {
    id: "user.cash_flow_gap_6",
    family: "general",
    label: "Nakit Akışı Açığı — DPO",
    fn: (inputs) => {
    const accountsPayable = num(inputs, "accountsPayable");
    const totalCreditPurchases = num(inputs, "totalCreditPurchases");
    const days = num(inputs, "days");
    return nonNegative(assertFinite((accountsPayable / totalCreditPurchases) * days));
  },
  },
  {
    id: "user.cash_flow_gap_7",
    family: "general",
    label: "Nakit Akışı Açığı — DIO",
    fn: (inputs) => {
    const inventory = num(inputs, "inventory");
    const cOGS = num(inputs, "cOGS");
    const days = num(inputs, "days");
    return nonNegative(assertFinite((inventory / cOGS) * days));
  },
  },
  {
    id: "user.cash_flow_gap_8",
    family: "general",
    label: "Nakit Akışı Açığı — CashConversionCycle",
    fn: (inputs) => {
    const dSO = num(inputs, "dSO");
    const dIO = num(inputs, "dIO");
    const dPO = num(inputs, "dPO");
    return nonNegative(assertFinite(dSO + dIO - dPO));
  },
  },
  {
    id: "user.cash_flow_gap_9",
    family: "general",
    label: "Nakit Akışı Açığı — FinancingCost",
    fn: (inputs) => {
    const cashGap = num(inputs, "cashGap");
    const dailyInterestRate = num(inputs, "dailyInterestRate");
    return nonNegative(assertFinite(cashGap * dailyInterestRate));
  },
  },

  // ── Navlun Maliyeti (8 formulas) ──
  {
    id: "user.freight_cost_0",
    family: "general",
    label: "Navlun Maliyeti — ChargeableWeight",
    fn: (inputs) => {
    const grossWeight = num(inputs, "grossWeight");
    const volumetricWeight = num(inputs, "volumetricWeight");
    return nonNegative(assertFinite(Math.max(grossWeight, volumetricWeight)));
  },
  },
  {
    id: "user.freight_cost_1",
    family: "general",
    label: "Navlun Maliyeti — BaseFreight",
    fn: (inputs) => {
    const chargeableWeight = num(inputs, "chargeableWeight");
    const ratePerKg = num(inputs, "ratePerKg");
    return nonNegative(assertFinite(chargeableWeight * ratePerKg));
  },
  },
  {
    id: "user.freight_cost_2",
    family: "general",
    label: "Navlun Maliyeti — BunkerSurcharge",
    fn: (inputs) => {
    const baseFreight = num(inputs, "baseFreight");
    const bAF = num(inputs, "bAF");
    const Pct = num(inputs, "Pct");
    return nonNegative(assertFinite(baseFreight * bAF_Pct));
  },
  },
  {
    id: "user.freight_cost_3",
    family: "general",
    label: "Navlun Maliyeti — SecurityFee",
    fn: (inputs) => {
    const chargeableWeight = num(inputs, "chargeableWeight");
    const securityRate = num(inputs, "securityRate");
    return nonNegative(assertFinite(chargeableWeight * securityRate));
  },
  },
  {
    id: "user.freight_cost_4",
    family: "general",
    label: "Navlun Maliyeti — TerminalHandling",
    fn: (inputs) => {
    const units = num(inputs, "units");
    const tHC = num(inputs, "tHC");
    const Rate = num(inputs, "Rate");
    return nonNegative(assertFinite(units * tHC_Rate));
  },
  },
  {
    id: "user.freight_cost_5",
    family: "general",
    label: "Navlun Maliyeti — CustomsClearance",
    fn: (inputs) => {
    const fixedFee = num(inputs, "fixedFee");
    const value = num(inputs, "value");
    const dutyPct = num(inputs, "dutyPct");
    return nonNegative(assertFinite(fixedFee + (value * dutyPct)));
  },
  },
  {
    id: "user.freight_cost_6",
    family: "general",
    label: "Navlun Maliyeti — TotalFreightCost",
    fn: (inputs) => {
    const baseFreight = num(inputs, "baseFreight");
    const bunkerSurcharge = num(inputs, "bunkerSurcharge");
    const securityFee = num(inputs, "securityFee");
    const terminalHandling = num(inputs, "terminalHandling");
    const customsClearance = num(inputs, "customsClearance");
    return nonNegative(assertFinite(baseFreight + bunkerSurcharge + securityFee + terminalHandling + customsClearance));
  },
  },
  {
    id: "user.freight_cost_7",
    family: "general",
    label: "Navlun Maliyeti — CostPerUnit",
    fn: (inputs) => {
    const totalFreightCost = num(inputs, "totalFreightCost");
    const totalUnits = num(inputs, "totalUnits");
    return nonNegative(assertFinite(totalFreightCost / totalUnits));
  },
  },

  // ── Noise & Vibration Maliyet (6 formulas) ──
  {
    id: "user.noise_vibration_cost_0",
    family: "general",
    label: "Noise & Vibration Maliyet — NoiseExposure_dBA",
    fn: (inputs) => {
    const t = num(inputs, "t");
    const i = num(inputs, "i");
    const l = num(inputs, "l");
    return nonNegative(assertFinite(10 * Math.log10((1/t) * SUM(t_i * 10**(l_i/10)))));
  },
  },
  {
    id: "user.noise_vibration_cost_1",
    family: "general",
    label: "Noise & Vibration Maliyet — Vibration_RMS",
    fn: (inputs) => {
    const t = num(inputs, "t");
    const a = num(inputs, "a");
    const i = num(inputs, "i");
    return nonNegative(assertFinite(Math.sqrt((1/t) * SUM(a_i**2 * t_i))));
  },
  },
  {
    id: "user.noise_vibration_cost_2",
    family: "general",
    label: "Noise & Vibration Maliyet — HealthCost",
    fn: (inputs) => {
    const noise = num(inputs, "noise");
    const oR = num(inputs, "oR");
    const vibration = num(inputs, "vibration");
    const limit = num(inputs, "limit");
    const medicalScreening = num(inputs, "medicalScreening");
    const pPE = num(inputs, "pPE");
    const Cost = num(inputs, "Cost");
    const insurancePremiumHike = num(inputs, "insurancePremiumHike");
    return nonNegative(assertFinite(((noise > 85 oR vibration > limit) ? (medicalScreening + pPE_Cost + insurancePremiumHike) : (0))));
  },
  },
  {
    id: "user.noise_vibration_cost_3",
    family: "general",
    label: "Noise & Vibration Maliyet — ProductivityLoss",
    fn: (inputs) => {
    const actualOutput = num(inputs, "actualOutput");
    const baselineOutput = num(inputs, "baselineOutput");
    const unitMargin = num(inputs, "unitMargin");
    return nonNegative(assertFinite((actualOutput - baselineOutput) * unitMargin));
  },
  },
  {
    id: "user.noise_vibration_cost_4",
    family: "general",
    label: "Noise & Vibration Maliyet — ReworkCost",
    fn: (inputs) => {
    const vibrationDefectRate = num(inputs, "vibrationDefectRate");
    const totalUnits = num(inputs, "totalUnits");
    const reworkCostPerUnit = num(inputs, "reworkCostPerUnit");
    return nonNegative(assertFinite(vibrationDefectRate * totalUnits * reworkCostPerUnit));
  },
  },
  {
    id: "user.noise_vibration_cost_5",
    family: "general",
    label: "Noise & Vibration Maliyet — MitigationROI",
    fn: (inputs) => {
    const healthCost = num(inputs, "healthCost");
    const prodLoss = num(inputs, "prodLoss");
    const reworkCost = num(inputs, "reworkCost");
    const mitigationInvestment = num(inputs, "mitigationInvestment");
    return nonNegative(assertFinite((healthCost + prodLoss + reworkCost) / mitigationInvestment));
  },
  },

  // ── OEE ve Durma Süresi (8 formulas) ──
  {
    id: "user.oee_downtime_0",
    family: "general",
    label: "OEE ve Durma Süresi — Availability",
    fn: (inputs) => {
    const operatingTime = num(inputs, "operatingTime");
    const plannedProductionTime = num(inputs, "plannedProductionTime");
    return nonNegative(assertFinite(operatingTime / plannedProductionTime));
  },
  },
  {
    id: "user.oee_downtime_1",
    family: "general",
    label: "OEE ve Durma Süresi — Performance",
    fn: (inputs) => {
    const idealCycleTime = num(inputs, "idealCycleTime");
    const totalCount = num(inputs, "totalCount");
    const operatingTime = num(inputs, "operatingTime");
    return nonNegative(assertFinite((idealCycleTime * totalCount) / operatingTime));
  },
  },
  {
    id: "user.oee_downtime_2",
    family: "general",
    label: "OEE ve Durma Süresi — Quality",
    fn: (inputs) => {
    const goodCount = num(inputs, "goodCount");
    const totalCount = num(inputs, "totalCount");
    return nonNegative(assertFinite(goodCount / totalCount));
  },
  },
  {
    id: "user.oee_downtime_3",
    family: "general",
    label: "OEE ve Durma Süresi — OEE",
    fn: (inputs) => {
    const availability = num(inputs, "availability");
    const performance = num(inputs, "performance");
    const quality = num(inputs, "quality");
    return nonNegative(assertFinite(availability * performance * quality));
  },
  },
  {
    id: "user.oee_downtime_4",
    family: "general",
    label: "OEE ve Durma Süresi — TEEP",
    fn: (inputs) => {
    const oEE = num(inputs, "oEE");
    const plannedProductionTime = num(inputs, "plannedProductionTime");
    const allTime = num(inputs, "allTime");
    return nonNegative(assertFinite(oEE * (plannedProductionTime / allTime)));
  },
  },
  {
    id: "user.oee_downtime_5",
    family: "general",
    label: "OEE ve Durma Süresi — DowntimeCost",
    fn: (inputs) => {
    const plannedProductionTime = num(inputs, "plannedProductionTime");
    const operatingTime = num(inputs, "operatingTime");
    const costPerMinute = num(inputs, "costPerMinute");
    return nonNegative(assertFinite((plannedProductionTime - operatingTime) * costPerMinute));
  },
  },
  {
    id: "user.oee_downtime_6",
    family: "general",
    label: "OEE ve Durma Süresi — SpeedLoss",
    fn: (inputs) => {
    const operatingTime = num(inputs, "operatingTime");
    const idealCycleTime = num(inputs, "idealCycleTime");
    const totalCount = num(inputs, "totalCount");
    const costPerMinute = num(inputs, "costPerMinute");
    return nonNegative(assertFinite((operatingTime - (idealCycleTime * totalCount)) * costPerMinute));
  },
  },
  {
    id: "user.oee_downtime_7",
    family: "general",
    label: "OEE ve Durma Süresi — QualityLoss",
    fn: (inputs) => {
    const totalCount = num(inputs, "totalCount");
    const goodCount = num(inputs, "goodCount");
    const unitCost = num(inputs, "unitCost");
    return nonNegative(assertFinite((totalCount - goodCount) * unitCost));
  },
  },

  // ── Ofis Malzemeleri Maliyet (7 formulas) ──
  {
    id: "user.office_supplies_cost_0",
    family: "general",
    label: "Ofis Malzemeleri Maliyet — ConsumptionRate",
    fn: (inputs) => {
    const totalConsumed = num(inputs, "totalConsumed");
    const employeeCount = num(inputs, "employeeCount");
    return nonNegative(assertFinite(totalConsumed / employeeCount));
  },
  },
  {
    id: "user.office_supplies_cost_1",
    family: "general",
    label: "Ofis Malzemeleri Maliyet — AnnualCost",
    fn: (inputs) => {
    const item = num(inputs, "item");
    const i = num(inputs, "i");
    const unitPrice = num(inputs, "unitPrice");
    const annualUsage = num(inputs, "annualUsage");
    return nonNegative(assertFinite(SUM(item_i * unitPrice_i * annualUsage_i)));
  },
  },
  {
    id: "user.office_supplies_cost_2",
    family: "general",
    label: "Ofis Malzemeleri Maliyet — CarryingCost",
    fn: (inputs) => {
    const averageInventory = num(inputs, "averageInventory");
    const holdingRate = num(inputs, "holdingRate");
    return nonNegative(assertFinite(averageInventory * holdingRate));
  },
  },
  {
    id: "user.office_supplies_cost_3",
    family: "general",
    label: "Ofis Malzemeleri Maliyet — StockoutCost",
    fn: (inputs) => {
    const emergencyOrders = num(inputs, "emergencyOrders");
    const premiumFreight = num(inputs, "premiumFreight");
    return nonNegative(assertFinite(emergencyOrders * premiumFreight));
  },
  },
  {
    id: "user.office_supplies_cost_4",
    family: "general",
    label: "Ofis Malzemeleri Maliyet — EOQ_Office",
    fn: (inputs) => {
    const annualUsage = num(inputs, "annualUsage");
    const orderCost = num(inputs, "orderCost");
    const holdingCost = num(inputs, "holdingCost");
    return nonNegative(assertFinite(Math.sqrt((2 * annualUsage * orderCost) / holdingCost)));
  },
  },
  {
    id: "user.office_supplies_cost_5",
    family: "general",
    label: "Ofis Malzemeleri Maliyet — WastePct",
    fn: (inputs) => {
    const purchased = num(inputs, "purchased");
    const consumed = num(inputs, "consumed");
    return nonNegative(assertFinite((purchased - consumed) / purchased));
  },
  },
  {
    id: "user.office_supplies_cost_6",
    family: "general",
    label: "Ofis Malzemeleri Maliyet — OptimizationSavings",
    fn: (inputs) => {
    const currentCost = num(inputs, "currentCost");
    const eOQ = num(inputs, "eOQ");
    const Cost = num(inputs, "Cost");
    const wastePct = num(inputs, "wastePct");
    return nonNegative(assertFinite((currentCost - eOQ_Cost) + (wastePct * currentCost)));
  },
  },

  // ── Overtime vs. Hiring Breakeven (6 formulas) ──
  {
    id: "user.overtime_hiring_breakeven_0",
    family: "general",
    label: "Overtime vs. Hiring Breakeven — OvertimeCost_Hour",
    fn: (inputs) => {
    const regularRate = num(inputs, "regularRate");
    const overtimeMultiplier = num(inputs, "overtimeMultiplier");
    const burdenRate = num(inputs, "burdenRate");
    return nonNegative(assertFinite(regularRate * overtimeMultiplier * (1 + burdenRate)));
  },
  },
  {
    id: "user.overtime_hiring_breakeven_1",
    family: "general",
    label: "Overtime vs. Hiring Breakeven — HiringCost_Total",
    fn: (inputs) => {
    const recruitment = num(inputs, "recruitment");
    const onboarding = num(inputs, "onboarding");
    const training = num(inputs, "training");
    const rampUpProductivityLoss = num(inputs, "rampUpProductivityLoss");
    return nonNegative(assertFinite(recruitment + onboarding + training + rampUpProductivityLoss));
  },
  },
  {
    id: "user.overtime_hiring_breakeven_2",
    family: "general",
    label: "Overtime vs. Hiring Breakeven — AnnualNewHireCost",
    fn: (inputs) => {
    const regularRate = num(inputs, "regularRate");
    const annualHours = num(inputs, "annualHours");
    const burdenRate = num(inputs, "burdenRate");
    const benefits = num(inputs, "benefits");
    return nonNegative(assertFinite((regularRate * annualHours) * (1 + burdenRate) + benefits));
  },
  },
  {
    id: "user.overtime_hiring_breakeven_3",
    family: "general",
    label: "Overtime vs. Hiring Breakeven — BreakevenHours",
    fn: (inputs) => {
    const hiringCost = num(inputs, "hiringCost");
    const Total = num(inputs, "Total");
    const annualNewHireCost = num(inputs, "annualNewHireCost");
    const annualHours = num(inputs, "annualHours");
    const overtimeCost = num(inputs, "overtimeCost");
    const Hour = num(inputs, "Hour");
    return nonNegative(assertFinite(hiringCost_Total / (annualNewHireCost / annualHours - overtimeCost_Hour)));
  },
  },
  {
    id: "user.overtime_hiring_breakeven_4",
    family: "general",
    label: "Overtime vs. Hiring Breakeven — Decision",
    fn: (inputs) => {
    const expectedOvertimeHours = num(inputs, "expectedOvertimeHours");
    const breakevenHours = num(inputs, "breakevenHours");
    const hire = num(inputs, "hire");
    const overtime = num(inputs, "overtime");
    return nonNegative(assertFinite(((expectedOvertimeHours > breakevenHours) ? ("hire") : ("overtime"))));
  },
  },
  {
    id: "user.overtime_hiring_breakeven_5",
    family: "general",
    label: "Overtime vs. Hiring Breakeven — QualityCost_OT",
    fn: (inputs) => {
    const overtimeHours = num(inputs, "overtimeHours");
    const fatigueDefectRate = num(inputs, "fatigueDefectRate");
    const defectCost = num(inputs, "defectCost");
    return nonNegative(assertFinite(overtimeHours * fatigueDefectRate * defectCost));
  },
  },

  // ── Ödeme Vadesi Optimize Edici (7 formulas) ──
  {
    id: "user.payment_terms_optimizer_0",
    family: "general",
    label: "Ödeme Vadesi Optimize Edici — DSO",
    fn: (inputs) => {
    const accountsReceivable = num(inputs, "accountsReceivable");
    const revenue = num(inputs, "revenue");
    const days = num(inputs, "days");
    return nonNegative(assertFinite((accountsReceivable / revenue) * days));
  },
  },
  {
    id: "user.payment_terms_optimizer_1",
    family: "general",
    label: "Ödeme Vadesi Optimize Edici — CarryingCost_AR",
    fn: (inputs) => {
    const averageAR = num(inputs, "averageAR");
    const wACC = num(inputs, "wACC");
    return nonNegative(assertFinite(averageAR * wACC / 365));
  },
  },
  {
    id: "user.payment_terms_optimizer_2",
    family: "general",
    label: "Ödeme Vadesi Optimize Edici — BadDebtExpense",
    fn: (inputs) => {
    const revenue = num(inputs, "revenue");
    const defaultRate = num(inputs, "defaultRate");
    return nonNegative(assertFinite(revenue * defaultRate));
  },
  },
  {
    id: "user.payment_terms_optimizer_3",
    family: "general",
    label: "Ödeme Vadesi Optimize Edici — DiscountCost",
    fn: (inputs) => {
    const earlyPaymentDiscountPct = num(inputs, "earlyPaymentDiscountPct");
    const discountTakeRate = num(inputs, "discountTakeRate");
    const revenue = num(inputs, "revenue");
    return nonNegative(assertFinite(earlyPaymentDiscountPct * discountTakeRate * revenue));
  },
  },
  {
    id: "user.payment_terms_optimizer_4",
    family: "general",
    label: "Ödeme Vadesi Optimize Edici — OptimalTerms",
    fn: (inputs) => {
    const terms = num(inputs, "terms");
    const where = num(inputs, "where");
    const carryingCost = num(inputs, "carryingCost");
    const badDebt = num(inputs, "badDebt");
    const discountCost = num(inputs, "discountCost");
    const is = num(inputs, "is");
    const mINIMUM = num(inputs, "mINIMUM");
    return nonNegative(assertFinite(terms where (carryingCost + badDebt - discountCost) is mINIMUM));
  },
  },
  {
    id: "user.payment_terms_optimizer_5",
    family: "general",
    label: "Ödeme Vadesi Optimize Edici — CashFlowImpact",
    fn: (inputs) => {
    const newDSO = num(inputs, "newDSO");
    const oldDSO = num(inputs, "oldDSO");
    const revenue = num(inputs, "revenue");
    return nonNegative(assertFinite((newDSO - oldDSO) * (revenue / 365)));
  },
  },
  {
    id: "user.payment_terms_optimizer_6",
    family: "general",
    label: "Ödeme Vadesi Optimize Edici — NPV_Terms",
    fn: (inputs) => {
    const cashInflow = num(inputs, "cashInflow");
    const t = num(inputs, "t");
    const dailyWACC = num(inputs, "dailyWACC");
    return nonNegative(assertFinite(SUM(cashInflow_t / (1 + dailyWACC)**t)));
  },
  },

  // ── Öğrenme Eğrisi Süre Tahmincisi (8 formulas) ──
  {
    id: "user.learning_curve_time_0",
    family: "general",
    label: "Öğrenme Eğrisi Süre Tahmincisi — LearningRate",
    fn: (inputs) => {
    const time = num(inputs, "time");
    return nonNegative(assertFinite(1 - (time_2N / time_N)));
  },
  },
  {
    id: "user.learning_curve_time_1",
    family: "general",
    label: "Öğrenme Eğrisi Süre Tahmincisi — Slope_b",
    fn: (inputs) => {
    const learningRate = num(inputs, "learningRate");
    return nonNegative(assertFinite(Math.log(learningRate) / Math.log(2)));
  },
  },
  {
    id: "user.learning_curve_time_2",
    family: "general",
    label: "Öğrenme Eğrisi Süre Tahmincisi — Time_N",
    fn: (inputs) => {
    const time = num(inputs, "time");
    const n = num(inputs, "n");
    const b = num(inputs, "b");
    return nonNegative(assertFinite(time_1 * (n**b)));
  },
  },
  {
    id: "user.learning_curve_time_3",
    family: "general",
    label: "Öğrenme Eğrisi Süre Tahmincisi — CumulativeTime_N",
    fn: (inputs) => {
    const time = num(inputs, "time");
    const n = num(inputs, "n");
    const b = num(inputs, "b");
    return nonNegative(assertFinite(time_1 * (n**(b+1)) / (b+1)));
  },
  },
  {
    id: "user.learning_curve_time_4",
    family: "general",
    label: "Öğrenme Eğrisi Süre Tahmincisi — AverageTime_N",
    fn: (inputs) => {
    const cumulativeTime = num(inputs, "cumulativeTime");
    const n = num(inputs, "n");
    return nonNegative(assertFinite(cumulativeTime_N / n));
  },
  },
  {
    id: "user.learning_curve_time_5",
    family: "general",
    label: "Öğrenme Eğrisi Süre Tahmincisi — Cost_N",
    fn: (inputs) => {
    const time = num(inputs, "time");
    const laborRate = num(inputs, "laborRate");
    return nonNegative(assertFinite(time_N * laborRate));
  },
  },
  {
    id: "user.learning_curve_time_6",
    family: "general",
    label: "Öğrenme Eğrisi Süre Tahmincisi — BreakevenUnit",
    fn: (inputs) => {
    const n = num(inputs, "n");
    const where = num(inputs, "where");
    const standardTime = num(inputs, "standardTime");
    const is = num(inputs, "is");
    const reached = num(inputs, "reached");
    return nonNegative(assertFinite(n where standardTime is reached));
  },
  },
  {
    id: "user.learning_curve_time_7",
    family: "general",
    label: "Öğrenme Eğrisi Süre Tahmincisi — TotalLaborCost",
    fn: (inputs) => {
    const cumulativeTime = num(inputs, "cumulativeTime");
    const laborRate = num(inputs, "laborRate");
    return nonNegative(assertFinite(cumulativeTime_N * laborRate));
  },
  },

  // ── Palet Rafı Optimize Edici (7 formulas) ──
  {
    id: "user.pallet_rack_optimizer_0",
    family: "general",
    label: "Palet Rafı Optimize Edici — RackCapacity",
    fn: (inputs) => {
    const bays = num(inputs, "bays");
    const levels = num(inputs, "levels");
    const palletsPerBay = num(inputs, "palletsPerBay");
    return nonNegative(assertFinite(bays * levels * palletsPerBay));
  },
  },
  {
    id: "user.pallet_rack_optimizer_1",
    family: "general",
    label: "Palet Rafı Optimize Edici — FloorUtilization",
    fn: (inputs) => {
    const rackFootprint = num(inputs, "rackFootprint");
    const totalFloorArea = num(inputs, "totalFloorArea");
    return nonNegative(assertFinite(rackFootprint / totalFloorArea));
  },
  },
  {
    id: "user.pallet_rack_optimizer_2",
    family: "general",
    label: "Palet Rafı Optimize Edici — Throughput",
    fn: (inputs) => {
    const aisles = num(inputs, "aisles");
    const forkliftSpeed = num(inputs, "forkliftSpeed");
    const travelDistance = num(inputs, "travelDistance");
    return nonNegative(assertFinite(aisles * forkliftSpeed * travelDistance**-1));
  },
  },
  {
    id: "user.pallet_rack_optimizer_3",
    family: "general",
    label: "Palet Rafı Optimize Edici — Deflection",
    fn: (inputs) => {
    const load = num(inputs, "load");
    const beamLength = num(inputs, "beamLength");
    const e = num(inputs, "e");
    const i = num(inputs, "i");
    return nonNegative(assertFinite((5 * load * beamLength**3) / (384 * e * i)));
  },
  },
  {
    id: "user.pallet_rack_optimizer_4",
    family: "general",
    label: "Palet Rafı Optimize Edici — SafetyFactor",
    fn: (inputs) => {
    const maxLoadCapacity = num(inputs, "maxLoadCapacity");
    const actualLoad = num(inputs, "actualLoad");
    return nonNegative(assertFinite(maxLoadCapacity / actualLoad));
  },
  },
  {
    id: "user.pallet_rack_optimizer_5",
    family: "general",
    label: "Palet Rafı Optimize Edici — CostPerPosition",
    fn: (inputs) => {
    const totalRackCost = num(inputs, "totalRackCost");
    const rackCapacity = num(inputs, "rackCapacity");
    return nonNegative(assertFinite(totalRackCost / rackCapacity));
  },
  },
  {
    id: "user.pallet_rack_optimizer_6",
    family: "general",
    label: "Palet Rafı Optimize Edici — RetrievalTime",
    fn: (inputs) => {
    const travelTime = num(inputs, "travelTime");
    const Horizontal = num(inputs, "Horizontal");
    const Vertical = num(inputs, "Vertical");
    const pickTime = num(inputs, "pickTime");
    return nonNegative(assertFinite(travelTime_Horizontal + travelTime_Vertical + pickTime));
  },
  },

  // ── Poka-Yoke ROI (7 formulas) ──
  {
    id: "user.poka_yoke_roi_0",
    family: "general",
    label: "Poka-Yoke ROI — CurrentDefectRate",
    fn: (inputs) => {
    const defects = num(inputs, "defects");
    const totalUnits = num(inputs, "totalUnits");
    return nonNegative(assertFinite(defects / totalUnits));
  },
  },
  {
    id: "user.poka_yoke_roi_1",
    family: "general",
    label: "Poka-Yoke ROI — DefectCost_Annual",
    fn: (inputs) => {
    const currentDefectRate = num(inputs, "currentDefectRate");
    const totalUnits = num(inputs, "totalUnits");
    const costPerDefect = num(inputs, "costPerDefect");
    return nonNegative(assertFinite(currentDefectRate * totalUnits * costPerDefect));
  },
  },
  {
    id: "user.poka_yoke_roi_2",
    family: "general",
    label: "Poka-Yoke ROI — PokaYoke_Cost",
    fn: (inputs) => {
    const design = num(inputs, "design");
    const implementation = num(inputs, "implementation");
    const training = num(inputs, "training");
    const maintenance = num(inputs, "maintenance");
    return nonNegative(assertFinite(design + implementation + training + maintenance));
  },
  },
  {
    id: "user.poka_yoke_roi_3",
    family: "general",
    label: "Poka-Yoke ROI — NewDefectRate",
    fn: (inputs) => {
    const currentDefectRate = num(inputs, "currentDefectRate");
    const effectiveness = num(inputs, "effectiveness");
    return nonNegative(assertFinite(currentDefectRate * (1 - effectiveness)));
  },
  },
  {
    id: "user.poka_yoke_roi_4",
    family: "general",
    label: "Poka-Yoke ROI — Savings",
    fn: (inputs) => {
    const currentDefectRate = num(inputs, "currentDefectRate");
    const newDefectRate = num(inputs, "newDefectRate");
    const totalUnits = num(inputs, "totalUnits");
    const costPerDefect = num(inputs, "costPerDefect");
    return nonNegative(assertFinite((currentDefectRate - newDefectRate) * totalUnits * costPerDefect));
  },
  },
  {
    id: "user.poka_yoke_roi_5",
    family: "general",
    label: "Poka-Yoke ROI — ROI",
    fn: (inputs) => {
    const savings = num(inputs, "savings");
    const pokaYoke = num(inputs, "pokaYoke");
    const Cost = num(inputs, "Cost");
    return nonNegative(assertFinite((savings - pokaYoke_Cost) / pokaYoke_Cost));
  },
  },
  {
    id: "user.poka_yoke_roi_6",
    family: "general",
    label: "Poka-Yoke ROI — PaybackMonths",
    fn: (inputs) => {
    const pokaYoke = num(inputs, "pokaYoke");
    const Cost = num(inputs, "Cost");
    const savings = num(inputs, "savings");
    return nonNegative(assertFinite(pokaYoke_Cost / (savings / 12)));
  },
  },

  // ── Porsiyon Maliyet (8 formulas) ──
  {
    id: "user.portion_cost_0",
    family: "general",
    label: "Porsiyon Maliyet — IngredientCost",
    fn: (inputs) => {
    const quantity = num(inputs, "quantity");
    const i = num(inputs, "i");
    const unitPrice = num(inputs, "unitPrice");
    return nonNegative(assertFinite(SUM(quantity_i * unitPrice_i)));
  },
  },
  {
    id: "user.portion_cost_1",
    family: "general",
    label: "Porsiyon Maliyet — YieldAdjustedCost",
    fn: (inputs) => {
    const ingredientCost = num(inputs, "ingredientCost");
    const yieldPct = num(inputs, "yieldPct");
    return nonNegative(assertFinite(ingredientCost / yieldPct));
  },
  },
  {
    id: "user.portion_cost_2",
    family: "general",
    label: "Porsiyon Maliyet — LaborCost",
    fn: (inputs) => {
    const prepTime = num(inputs, "prepTime");
    const laborRate = num(inputs, "laborRate");
    return nonNegative(assertFinite(prepTime * laborRate));
  },
  },
  {
    id: "user.portion_cost_3",
    family: "general",
    label: "Porsiyon Maliyet — Overhead",
    fn: (inputs) => {
    const ingredientCost = num(inputs, "ingredientCost");
    const laborCost = num(inputs, "laborCost");
    const overheadPct = num(inputs, "overheadPct");
    return nonNegative(assertFinite((ingredientCost + laborCost) * overheadPct));
  },
  },
  {
    id: "user.portion_cost_4",
    family: "general",
    label: "Porsiyon Maliyet — TotalPortionCost",
    fn: (inputs) => {
    const yieldAdjustedCost = num(inputs, "yieldAdjustedCost");
    const laborCost = num(inputs, "laborCost");
    const overhead = num(inputs, "overhead");
    return nonNegative(assertFinite(yieldAdjustedCost + laborCost + overhead));
  },
  },
  {
    id: "user.portion_cost_5",
    family: "general",
    label: "Porsiyon Maliyet — FoodCostPct",
    fn: (inputs) => {
    const totalPortionCost = num(inputs, "totalPortionCost");
    const menuPrice = num(inputs, "menuPrice");
    return nonNegative(assertFinite(totalPortionCost / menuPrice));
  },
  },
  {
    id: "user.portion_cost_6",
    family: "general",
    label: "Porsiyon Maliyet — MenuPrice_Target",
    fn: (inputs) => {
    const totalPortionCost = num(inputs, "totalPortionCost");
    const targetFoodCostPct = num(inputs, "targetFoodCostPct");
    return nonNegative(assertFinite(totalPortionCost / targetFoodCostPct));
  },
  },
  {
    id: "user.portion_cost_7",
    family: "general",
    label: "Porsiyon Maliyet — Margin",
    fn: (inputs) => {
    const menuPrice = num(inputs, "menuPrice");
    const totalPortionCost = num(inputs, "totalPortionCost");
    return nonNegative(assertFinite(menuPrice - totalPortionCost));
  },
  },

  // ── Project Maliyet Tahmin (8 formulas) ──
  {
    id: "user.project_cost_estimate_0",
    family: "general",
    label: "Project Maliyet Tahmin — DirectLabor",
    fn: (inputs) => {
    const hours = num(inputs, "hours");
    const i = num(inputs, "i");
    const rate = num(inputs, "rate");
    return nonNegative(assertFinite(SUM(hours_i * rate_i)));
  },
  },
  {
    id: "user.project_cost_estimate_1",
    family: "general",
    label: "Project Maliyet Tahmin — DirectMaterial",
    fn: (inputs) => {
    const quantity = num(inputs, "quantity");
    const j = num(inputs, "j");
    const price = num(inputs, "price");
    return nonNegative(assertFinite(SUM(quantity_j * price_j)));
  },
  },
  {
    id: "user.project_cost_estimate_2",
    family: "general",
    label: "Project Maliyet Tahmin — Equipment",
    fn: (inputs) => {
    const rentalDays = num(inputs, "rentalDays");
    const k = num(inputs, "k");
    const dailyRate = num(inputs, "dailyRate");
    return nonNegative(assertFinite(SUM(rentalDays_k * dailyRate_k)));
  },
  },
  {
    id: "user.project_cost_estimate_3",
    family: "general",
    label: "Project Maliyet Tahmin — Subcontractor",
    fn: (inputs) => {
    const lumpSum = num(inputs, "lumpSum");
    const m = num(inputs, "m");
    return nonNegative(assertFinite(SUM(lumpSum_m)));
  },
  },
  {
    id: "user.project_cost_estimate_4",
    family: "general",
    label: "Project Maliyet Tahmin — Overhead",
    fn: (inputs) => {
    const directLabor = num(inputs, "directLabor");
    const directMaterial = num(inputs, "directMaterial");
    const overheadRate = num(inputs, "overheadRate");
    return nonNegative(assertFinite((directLabor + directMaterial) * overheadRate));
  },
  },
  {
    id: "user.project_cost_estimate_5",
    family: "general",
    label: "Project Maliyet Tahmin — Contingency",
    fn: (inputs) => {
    const direct = num(inputs, "direct");
    const overhead = num(inputs, "overhead");
    const riskFactor = num(inputs, "riskFactor");
    return nonNegative(assertFinite((direct + overhead) * riskFactor));
  },
  },
  {
    id: "user.project_cost_estimate_6",
    family: "general",
    label: "Project Maliyet Tahmin — TotalEstimate",
    fn: (inputs) => {
    const directLabor = num(inputs, "directLabor");
    const directMaterial = num(inputs, "directMaterial");
    const equipment = num(inputs, "equipment");
    const subcontractor = num(inputs, "subcontractor");
    const overhead = num(inputs, "overhead");
    const contingency = num(inputs, "contingency");
    return nonNegative(assertFinite(directLabor + directMaterial + equipment + subcontractor + overhead + contingency));
  },
  },
  {
    id: "user.project_cost_estimate_7",
    family: "general",
    label: "Project Maliyet Tahmin — CostVariance",
    fn: (inputs) => {
    const totalEstimate = num(inputs, "totalEstimate");
    const budget = num(inputs, "budget");
    return nonNegative(assertFinite(totalEstimate - budget));
  },
  },

  // ── Project Overrun risk (8 formulas) ──
  {
    id: "user.project_overrun_0",
    family: "general",
    label: "Project Overrun risk — SPI",
    fn: (inputs) => {
    const earnedValue = num(inputs, "earnedValue");
    const plannedValue = num(inputs, "plannedValue");
    return nonNegative(assertFinite(earnedValue / plannedValue));
  },
  },
  {
    id: "user.project_overrun_1",
    family: "general",
    label: "Project Overrun risk — CPI",
    fn: (inputs) => {
    const earnedValue = num(inputs, "earnedValue");
    const actualCost = num(inputs, "actualCost");
    return nonNegative(assertFinite(earnedValue / actualCost));
  },
  },
  {
    id: "user.project_overrun_2",
    family: "general",
    label: "Project Overrun risk — EAC",
    fn: (inputs) => {
    const budgetAtCompletion = num(inputs, "budgetAtCompletion");
    const cPI = num(inputs, "cPI");
    return nonNegative(assertFinite(budgetAtCompletion / cPI));
  },
  },
  {
    id: "user.project_overrun_3",
    family: "general",
    label: "Project Overrun risk — ExpectedOverrun",
    fn: (inputs) => {
    const eAC = num(inputs, "eAC");
    const budgetAtCompletion = num(inputs, "budgetAtCompletion");
    return nonNegative(assertFinite(eAC - budgetAtCompletion));
  },
  },
  {
    id: "user.project_overrun_4",
    family: "general",
    label: "Project Overrun risk — ScheduleDelay",
    fn: (inputs) => {
    const actualDuration = num(inputs, "actualDuration");
    const plannedDuration = num(inputs, "plannedDuration");
    return nonNegative(assertFinite((actualDuration - plannedDuration) / plannedDuration));
  },
  },
  {
    id: "user.project_overrun_5",
    family: "general",
    label: "Project Overrun risk — RiskExposure",
    fn: (inputs) => {
    const probabilityOfDelay = num(inputs, "probabilityOfDelay");
    const delayDays = num(inputs, "delayDays");
    const dailyPenalty = num(inputs, "dailyPenalty");
    const probabilityOfCostOverrun = num(inputs, "probabilityOfCostOverrun");
    const expectedOverrun = num(inputs, "expectedOverrun");
    return nonNegative(assertFinite(probabilityOfDelay * (delayDays * dailyPenalty) + probabilityOfCostOverrun * expectedOverrun));
  },
  },
  {
    id: "user.project_overrun_6",
    family: "general",
    label: "Project Overrun risk — MitigationCost",
    fn: (inputs) => {
    const crashingCost = num(inputs, "crashingCost");
    const fastTrackingCost = num(inputs, "fastTrackingCost");
    return nonNegative(assertFinite(crashingCost + fastTrackingCost));
  },
  },
  {
    id: "user.project_overrun_7",
    family: "general",
    label: "Project Overrun risk — NetRisk",
    fn: (inputs) => {
    const riskExposure = num(inputs, "riskExposure");
    const mitigationCost = num(inputs, "mitigationCost");
    return nonNegative(assertFinite(riskExposure - mitigationCost));
  },
  },

  // ── reçete Maliyet Check (7 formulas) ──
  {
    id: "user.recipe_cost_check_0",
    family: "general",
    label: "reçete Maliyet Check — TheoreticalCost",
    fn: (inputs) => {
    const formulationPct = num(inputs, "formulationPct");
    const i = num(inputs, "i");
    const ingredientPrice = num(inputs, "ingredientPrice");
    return nonNegative(assertFinite(SUM(formulationPct_i * ingredientPrice_i)));
  },
  },
  {
    id: "user.recipe_cost_check_1",
    family: "general",
    label: "reçete Maliyet Check — ActualCost",
    fn: (inputs) => {
    const totalMaterialConsumed = num(inputs, "totalMaterialConsumed");
    const avgPrice = num(inputs, "avgPrice");
    const totalOutput = num(inputs, "totalOutput");
    return nonNegative(assertFinite(totalMaterialConsumed * avgPrice / totalOutput));
  },
  },
  {
    id: "user.recipe_cost_check_2",
    family: "general",
    label: "reçete Maliyet Check — Variance",
    fn: (inputs) => {
    const actualCost = num(inputs, "actualCost");
    const theoreticalCost = num(inputs, "theoreticalCost");
    return nonNegative(assertFinite(actualCost - theoreticalCost));
  },
  },
  {
    id: "user.recipe_cost_check_3",
    family: "general",
    label: "reçete Maliyet Check — YieldLossCost",
    fn: (inputs) => {
    const actualYield = num(inputs, "actualYield");
    const theoreticalCost = num(inputs, "theoreticalCost");
    return nonNegative(assertFinite((1 - actualYield) * theoreticalCost));
  },
  },
  {
    id: "user.recipe_cost_check_4",
    family: "general",
    label: "reçete Maliyet Check — EvaporationLoss",
    fn: (inputs) => {
    const inputWeight = num(inputs, "inputWeight");
    const outputWeight = num(inputs, "outputWeight");
    const knownScrap = num(inputs, "knownScrap");
    return nonNegative(assertFinite(inputWeight - outputWeight - knownScrap));
  },
  },
  {
    id: "user.recipe_cost_check_5",
    family: "general",
    label: "reçete Maliyet Check — Efficiency",
    fn: (inputs) => {
    const actualOutput = num(inputs, "actualOutput");
    const theoreticalOutput = num(inputs, "theoreticalOutput");
    return nonNegative(assertFinite(actualOutput / theoreticalOutput));
  },
  },
  {
    id: "user.recipe_cost_check_6",
    family: "general",
    label: "reçete Maliyet Check — CostPerKg",
    fn: (inputs) => {
    const actualCost = num(inputs, "actualCost");
    const outputWeight = num(inputs, "outputWeight");
    return nonNegative(assertFinite(actualCost / outputWeight));
  },
  },

  // ── Restaurant Menü Marj Kaçak (8 formulas) ──
  {
    id: "user.restaurant_menu_margin_leak_0",
    family: "general",
    label: "Restaurant Menü Marj Kaçak — TheoreticalFoodCost",
    fn: (inputs) => {
    const itemsSold = num(inputs, "itemsSold");
    const i = num(inputs, "i");
    const portionCost = num(inputs, "portionCost");
    return nonNegative(assertFinite(SUM(itemsSold_i * portionCost_i)));
  },
  },
  {
    id: "user.restaurant_menu_margin_leak_1",
    family: "general",
    label: "Restaurant Menü Marj Kaçak — ActualFoodCost",
    fn: (inputs) => {
    const beginningInventory = num(inputs, "beginningInventory");
    const purchases = num(inputs, "purchases");
    const endingInventory = num(inputs, "endingInventory");
    return nonNegative(assertFinite(beginningInventory + purchases - endingInventory));
  },
  },
  {
    id: "user.restaurant_menu_margin_leak_2",
    family: "general",
    label: "Restaurant Menü Marj Kaçak — Variance",
    fn: (inputs) => {
    const actualFoodCost = num(inputs, "actualFoodCost");
    const theoreticalFoodCost = num(inputs, "theoreticalFoodCost");
    return nonNegative(assertFinite(actualFoodCost - theoreticalFoodCost));
  },
  },
  {
    id: "user.restaurant_menu_margin_leak_3",
    family: "general",
    label: "Restaurant Menü Marj Kaçak — VariancePct",
    fn: (inputs) => {
    const variance = num(inputs, "variance");
    const totalFoodSales = num(inputs, "totalFoodSales");
    return nonNegative(assertFinite(variance / totalFoodSales));
  },
  },
  {
    id: "user.restaurant_menu_margin_leak_4",
    family: "general",
    label: "Restaurant Menü Marj Kaçak — WasteCost",
    fn: (inputs) => {
    const recordedWaste = num(inputs, "recordedWaste");
    const avgPortionCost = num(inputs, "avgPortionCost");
    return nonNegative(assertFinite(recordedWaste * avgPortionCost));
  },
  },
  {
    id: "user.restaurant_menu_margin_leak_5",
    family: "general",
    label: "Restaurant Menü Marj Kaçak — TheftLoss",
    fn: (inputs) => {
    const variance = num(inputs, "variance");
    const wasteCost = num(inputs, "wasteCost");
    const compMeals = num(inputs, "compMeals");
    return nonNegative(assertFinite(variance - wasteCost - compMeals));
  },
  },
  {
    id: "user.restaurant_menu_margin_leak_6",
    family: "general",
    label: "Restaurant Menü Marj Kaçak — IdealMargin",
    fn: (inputs) => {
    const theoreticalFoodCost = num(inputs, "theoreticalFoodCost");
    const totalFoodSales = num(inputs, "totalFoodSales");
    return nonNegative(assertFinite(1 - (theoreticalFoodCost / totalFoodSales)));
  },
  },
  {
    id: "user.restaurant_menu_margin_leak_7",
    family: "general",
    label: "Restaurant Menü Marj Kaçak — ActualMargin",
    fn: (inputs) => {
    const actualFoodCost = num(inputs, "actualFoodCost");
    const totalFoodSales = num(inputs, "totalFoodSales");
    return nonNegative(assertFinite(1 - (actualFoodCost / totalFoodSales)));
  },
  },

  // ── Robot Kol vs. Manuel İşçi (8 formulas) ──
  {
    id: "user.robot_vs_manual_0",
    family: "general",
    label: "Robot Kol vs. Manuel İşçi — ManualCost_Annual",
    fn: (inputs) => {
    const operators = num(inputs, "operators");
    const hourlyRate = num(inputs, "hourlyRate");
    const hours = num(inputs, "hours");
    const burden = num(inputs, "burden");
    return nonNegative(assertFinite((operators * hourlyRate * hours) * (1 + burden)));
  },
  },
  {
    id: "user.robot_vs_manual_1",
    family: "general",
    label: "Robot Kol vs. Manuel İşçi — RobotCost_Annual",
    fn: (inputs) => {
    const robotCapex = num(inputs, "robotCapex");
    const depreciationLife = num(inputs, "depreciationLife");
    const maintenance = num(inputs, "maintenance");
    const energy = num(inputs, "energy");
    const programmerCost = num(inputs, "programmerCost");
    return nonNegative(assertFinite((robotCapex / depreciationLife) + maintenance + energy + programmerCost));
  },
  },
  {
    id: "user.robot_vs_manual_2",
    family: "general",
    label: "Robot Kol vs. Manuel İşçi — RobotOutput",
    fn: (inputs) => {
    const cycleTime = num(inputs, "cycleTime");
    const Robot = num(inputs, "Robot");
    const uptime = num(inputs, "uptime");
    return nonNegative(assertFinite(cycleTime_Robot**-1 * uptime));
  },
  },
  {
    id: "user.robot_vs_manual_3",
    family: "general",
    label: "Robot Kol vs. Manuel İşçi — ManualOutput",
    fn: (inputs) => {
    const cycleTime = num(inputs, "cycleTime");
    const Manual = num(inputs, "Manual");
    const efficiency = num(inputs, "efficiency");
    return nonNegative(assertFinite(cycleTime_Manual**-1 * efficiency));
  },
  },
  {
    id: "user.robot_vs_manual_4",
    family: "general",
    label: "Robot Kol vs. Manuel İşçi — CostPerUnit_Manual",
    fn: (inputs) => {
    const manualCost = num(inputs, "manualCost");
    const Annual = num(inputs, "Annual");
    const manualOutput = num(inputs, "manualOutput");
    return nonNegative(assertFinite(manualCost_Annual / manualOutput));
  },
  },
  {
    id: "user.robot_vs_manual_5",
    family: "general",
    label: "Robot Kol vs. Manuel İşçi — CostPerUnit_Robot",
    fn: (inputs) => {
    const robotCost = num(inputs, "robotCost");
    const Annual = num(inputs, "Annual");
    const robotOutput = num(inputs, "robotOutput");
    return nonNegative(assertFinite(robotCost_Annual / robotOutput));
  },
  },
  {
    id: "user.robot_vs_manual_6",
    family: "general",
    label: "Robot Kol vs. Manuel İşçi — ROI",
    fn: (inputs) => {
    const manualCost = num(inputs, "manualCost");
    const robotCost = num(inputs, "robotCost");
    const robotCapex = num(inputs, "robotCapex");
    return nonNegative(assertFinite((manualCost - robotCost) / robotCapex));
  },
  },
  {
    id: "user.robot_vs_manual_7",
    family: "general",
    label: "Robot Kol vs. Manuel İşçi — Payback",
    fn: (inputs) => {
    const robotCapex = num(inputs, "robotCapex");
    const manualCost = num(inputs, "manualCost");
    const Annual = num(inputs, "Annual");
    const robotCost = num(inputs, "robotCost");
    return nonNegative(assertFinite(robotCapex / (manualCost_Annual - robotCost_Annual)));
  },
  },

  // ── Rota Maliyet (8 formulas) ──
  {
    id: "user.route_cost_0",
    family: "general",
    label: "Rota Maliyet — DistanceCost",
    fn: (inputs) => {
    const totalDistance = num(inputs, "totalDistance");
    const fuelConsumption = num(inputs, "fuelConsumption");
    const fuelPrice = num(inputs, "fuelPrice");
    return nonNegative(assertFinite(totalDistance * fuelConsumption * fuelPrice));
  },
  },
  {
    id: "user.route_cost_1",
    family: "general",
    label: "Rota Maliyet — TimeCost",
    fn: (inputs) => {
    const totalTime = num(inputs, "totalTime");
    const driverWage = num(inputs, "driverWage");
    const vehicleDepreciation = num(inputs, "vehicleDepreciation");
    return nonNegative(assertFinite(totalTime * (driverWage + vehicleDepreciation)));
  },
  },
  {
    id: "user.route_cost_2",
    family: "general",
    label: "Rota Maliyet — TollCost",
    fn: (inputs) => {
    const tolls = num(inputs, "tolls");
    const i = num(inputs, "i");
    return nonNegative(assertFinite(SUM(tolls_i)));
  },
  },
  {
    id: "user.route_cost_3",
    family: "general",
    label: "Rota Maliyet — MaintenanceCost",
    fn: (inputs) => {
    const totalDistance = num(inputs, "totalDistance");
    const maintRatePerKm = num(inputs, "maintRatePerKm");
    return nonNegative(assertFinite(totalDistance * maintRatePerKm));
  },
  },
  {
    id: "user.route_cost_4",
    family: "general",
    label: "Rota Maliyet — Overhead",
    fn: (inputs) => {
    const distanceCost = num(inputs, "distanceCost");
    const timeCost = num(inputs, "timeCost");
    const overheadPct = num(inputs, "overheadPct");
    return nonNegative(assertFinite((distanceCost + timeCost) * overheadPct));
  },
  },
  {
    id: "user.route_cost_5",
    family: "general",
    label: "Rota Maliyet — TotalRouteCost",
    fn: (inputs) => {
    const distanceCost = num(inputs, "distanceCost");
    const timeCost = num(inputs, "timeCost");
    const tollCost = num(inputs, "tollCost");
    const maintenanceCost = num(inputs, "maintenanceCost");
    const overhead = num(inputs, "overhead");
    return nonNegative(assertFinite(distanceCost + timeCost + tollCost + maintenanceCost + overhead));
  },
  },
  {
    id: "user.route_cost_6",
    family: "general",
    label: "Rota Maliyet — CostPerKm",
    fn: (inputs) => {
    const totalRouteCost = num(inputs, "totalRouteCost");
    const totalDistance = num(inputs, "totalDistance");
    return nonNegative(assertFinite(totalRouteCost / totalDistance));
  },
  },
  {
    id: "user.route_cost_7",
    family: "general",
    label: "Rota Maliyet — CostPerDrop",
    fn: (inputs) => {
    const totalRouteCost = num(inputs, "totalRouteCost");
    const numberOfDrops = num(inputs, "numberOfDrops");
    return nonNegative(assertFinite(totalRouteCost / numberOfDrops));
  },
  },

  // ── Rota Optimizasyonu Analizörü (7 formulas) ──
  {
    id: "user.route_optimization_0",
    family: "general",
    label: "Rota Optimizasyonu Analizörü — NearestNeighbor_Dist",
    fn: (inputs) => {
    const minDistance = num(inputs, "minDistance");
    const i = num(inputs, "i");
    return nonNegative(assertFinite(SUM(minDistance_i)));
  },
  },
  {
    id: "user.route_optimization_1",
    family: "general",
    label: "Rota Optimizasyonu Analizörü — Savings_ClarkeWright",
    fn: (inputs) => {
    const distance = num(inputs, "distance");
    const Depot = num(inputs, "Depot");
    const i = num(inputs, "i");
    const j = num(inputs, "j");
    return nonNegative(assertFinite(distance_Depot_i + distance_Depot_j - distance_i_j));
  },
  },
  {
    id: "user.route_optimization_2",
    family: "general",
    label: "Rota Optimizasyonu Analizörü — RouteEfficiency",
    fn: (inputs) => {
    const theoreticalMinDistance = num(inputs, "theoreticalMinDistance");
    const actualRouteDistance = num(inputs, "actualRouteDistance");
    return nonNegative(assertFinite(theoreticalMinDistance / actualRouteDistance));
  },
  },
  {
    id: "user.route_optimization_3",
    family: "general",
    label: "Rota Optimizasyonu Analizörü — DropDensity",
    fn: (inputs) => {
    const numberOfDrops = num(inputs, "numberOfDrops");
    const routeArea = num(inputs, "routeArea");
    return nonNegative(assertFinite(numberOfDrops / routeArea));
  },
  },
  {
    id: "user.route_optimization_4",
    family: "general",
    label: "Rota Optimizasyonu Analizörü — TimeWindowPenalty",
    fn: (inputs) => {
    const arrivalTime = num(inputs, "arrivalTime");
    const lateWindow = num(inputs, "lateWindow");
    const penaltyRate = num(inputs, "penaltyRate");
    return nonNegative(assertFinite(SUM(Math.max(0, arrivalTime - lateWindow) * penaltyRate)));
  },
  },
  {
    id: "user.route_optimization_5",
    family: "general",
    label: "Rota Optimizasyonu Analizörü — VehicleUtilization",
    fn: (inputs) => {
    const totalLoad = num(inputs, "totalLoad");
    const vehicleCapacity = num(inputs, "vehicleCapacity");
    return nonNegative(assertFinite(totalLoad / vehicleCapacity));
  },
  },
  {
    id: "user.route_optimization_6",
    family: "general",
    label: "Rota Optimizasyonu Analizörü — TotalSavings",
    fn: (inputs) => {
    const baselineCost = num(inputs, "baselineCost");
    const optimizedCost = num(inputs, "optimizedCost");
    return nonNegative(assertFinite(baselineCost - optimizedCost));
  },
  },

  // ── Rüzgar Türbini Yatırım Getirisi (8 formulas) ──
  {
    id: "user.wind_turbine_investment_0",
    family: "general",
    label: "Rüzgar Türbini Yatırım Getirisi — AEP",
    fn: (inputs) => {
    const powerCurve = num(inputs, "powerCurve");
    const v = num(inputs, "v");
    const frequency = num(inputs, "frequency");
    return nonNegative(assertFinite(8760 * SUM(powerCurve_v * frequency_v)));
  },
  },
  {
    id: "user.wind_turbine_investment_1",
    family: "general",
    label: "Rüzgar Türbini Yatırım Getirisi — CapacityFactor",
    fn: (inputs) => {
    const aEP = num(inputs, "aEP");
    const ratedPower = num(inputs, "ratedPower");
    return nonNegative(assertFinite(aEP / (ratedPower * 8760)));
  },
  },
  {
    id: "user.wind_turbine_investment_2",
    family: "general",
    label: "Rüzgar Türbini Yatırım Getirisi — AnnualRevenue",
    fn: (inputs) => {
    const aEP = num(inputs, "aEP");
    const feedInTariff = num(inputs, "feedInTariff");
    return nonNegative(assertFinite(aEP * feedInTariff));
  },
  },
  {
    id: "user.wind_turbine_investment_3",
    family: "general",
    label: "Rüzgar Türbini Yatırım Getirisi — OPEX",
    fn: (inputs) => {
    const landLease = num(inputs, "landLease");
    const maintenance = num(inputs, "maintenance");
    const insurance = num(inputs, "insurance");
    const gridFees = num(inputs, "gridFees");
    return nonNegative(assertFinite(landLease + maintenance + insurance + gridFees));
  },
  },
  {
    id: "user.wind_turbine_investment_4",
    family: "general",
    label: "Rüzgar Türbini Yatırım Getirisi — EBITDA",
    fn: (inputs) => {
    const annualRevenue = num(inputs, "annualRevenue");
    const oPEX = num(inputs, "oPEX");
    return nonNegative(assertFinite(annualRevenue - oPEX));
  },
  },
  {
    id: "user.wind_turbine_investment_5",
    family: "general",
    label: "Rüzgar Türbini Yatırım Getirisi — LCOE",
    fn: (inputs) => {
    const capex = num(inputs, "capex");
    const opex = num(inputs, "opex");
    const t = num(inputs, "t");
    const r = num(inputs, "r");
    const aEP = num(inputs, "aEP");
    return nonNegative(assertFinite((SUM(capex + opex_t / (1+r)**t)) / (SUM(aEP_t / (1+r)**t))));
  },
  },
  {
    id: "user.wind_turbine_investment_6",
    family: "general",
    label: "Rüzgar Türbini Yatırım Getirisi — NPV",
    fn: (inputs) => {
    const eBITDA = num(inputs, "eBITDA");
    const t = num(inputs, "t");
    const wACC = num(inputs, "wACC");
    const capex = num(inputs, "capex");
    return nonNegative(assertFinite(SUM(eBITDA_t / (1+wACC)**t) - capex));
  },
  },
  {
    id: "user.wind_turbine_investment_7",
    family: "general",
    label: "Rüzgar Türbini Yatırım Getirisi — IRR",
    fn: (inputs) => {
    const r = num(inputs, "r");
    const where = num(inputs, "where");
    const nPV = num(inputs, "nPV");
    return nonNegative(assertFinite(r where nPV = 0));
  },
  },

  // ── SaaS Shelfware Maliyet (8 formulas) ──
  {
    id: "user.saas_shelfware_0",
    family: "general",
    label: "SaaS Shelfware Maliyet — TotalLicenses",
    fn: (inputs) => {
    const purchasedLicenses = num(inputs, "purchasedLicenses");
    return nonNegative(assertFinite(purchasedLicenses));
  },
  },
  {
    id: "user.saas_shelfware_1",
    family: "general",
    label: "SaaS Shelfware Maliyet — ActiveUsers",
    fn: (inputs) => {
    const usersLoggedInLast30Days = num(inputs, "usersLoggedInLast30Days");
    return nonNegative(assertFinite(usersLoggedInLast30Days));
  },
  },
  {
    id: "user.saas_shelfware_2",
    family: "general",
    label: "SaaS Shelfware Maliyet — ShelfwarePct",
    fn: (inputs) => {
    const totalLicenses = num(inputs, "totalLicenses");
    const activeUsers = num(inputs, "activeUsers");
    return nonNegative(assertFinite((totalLicenses - activeUsers) / totalLicenses));
  },
  },
  {
    id: "user.saas_shelfware_3",
    family: "general",
    label: "SaaS Shelfware Maliyet — ShelfwareCost",
    fn: (inputs) => {
    const shelfwarePct = num(inputs, "shelfwarePct");
    const totalContractValue = num(inputs, "totalContractValue");
    return nonNegative(assertFinite(shelfwarePct * totalContractValue));
  },
  },
  {
    id: "user.saas_shelfware_4",
    family: "general",
    label: "SaaS Shelfware Maliyet — UtilizationRate",
    fn: (inputs) => {
    const activeUsers = num(inputs, "activeUsers");
    const totalLicenses = num(inputs, "totalLicenses");
    return nonNegative(assertFinite(activeUsers / totalLicenses));
  },
  },
  {
    id: "user.saas_shelfware_5",
    family: "general",
    label: "SaaS Shelfware Maliyet — FeatureAdoption",
    fn: (inputs) => {
    const featuresUsed = num(inputs, "featuresUsed");
    const totalFeatures = num(inputs, "totalFeatures");
    return nonNegative(assertFinite(featuresUsed / totalFeatures));
  },
  },
  {
    id: "user.saas_shelfware_6",
    family: "general",
    label: "SaaS Shelfware Maliyet — OptimizationSavings",
    fn: (inputs) => {
    const shelfwareCost = num(inputs, "shelfwareCost");
    const underutilizedTierPriceDiff = num(inputs, "underutilizedTierPriceDiff");
    const users = num(inputs, "users");
    return nonNegative(assertFinite(shelfwareCost + (underutilizedTierPriceDiff * users)));
  },
  },
  {
    id: "user.saas_shelfware_7",
    family: "general",
    label: "SaaS Shelfware Maliyet — TrueUpCost",
    fn: (inputs) => {
    const actualUsage = num(inputs, "actualUsage");
    const contractedUsage = num(inputs, "contractedUsage");
    const overageRate = num(inputs, "overageRate");
    return nonNegative(assertFinite(Math.max(0, actualUsage - contractedUsage) * overageRate));
  },
  },

  // ── Saatlik Ücret (7 formulas) ──
  {
    id: "user.hourly_rate_0",
    family: "general",
    label: "Saatlik Ücret — GrossAnnualSalary",
    fn: (inputs) => {
    const baseSalary = num(inputs, "baseSalary");
    const bonuses = num(inputs, "bonuses");
    return nonNegative(assertFinite(baseSalary + bonuses));
  },
  },
  {
    id: "user.hourly_rate_1",
    family: "general",
    label: "Saatlik Ücret — EmployerTaxes",
    fn: (inputs) => {
    const grossAnnualSalary = num(inputs, "grossAnnualSalary");
    const taxRate = num(inputs, "taxRate");
    return nonNegative(assertFinite(grossAnnualSalary * taxRate));
  },
  },
  {
    id: "user.hourly_rate_2",
    family: "general",
    label: "Saatlik Ücret — Benefits",
    fn: (inputs) => {
    const healthInsurance = num(inputs, "healthInsurance");
    const retirementMatch = num(inputs, "retirementMatch");
    const paidTimeOffCost = num(inputs, "paidTimeOffCost");
    return nonNegative(assertFinite(healthInsurance + retirementMatch + paidTimeOffCost));
  },
  },
  {
    id: "user.hourly_rate_3",
    family: "general",
    label: "Saatlik Ücret — TotalLaborCost",
    fn: (inputs) => {
    const grossAnnualSalary = num(inputs, "grossAnnualSalary");
    const employerTaxes = num(inputs, "employerTaxes");
    const benefits = num(inputs, "benefits");
    return nonNegative(assertFinite(grossAnnualSalary + employerTaxes + benefits));
  },
  },
  {
    id: "user.hourly_rate_4",
    family: "general",
    label: "Saatlik Ücret — ProductiveHours",
    fn: (inputs) => {
    const weeksPerYear = num(inputs, "weeksPerYear");
    const vacationWeeks = num(inputs, "vacationWeeks");
    const hoursPerWeek = num(inputs, "hoursPerWeek");
    const idleTimePct = num(inputs, "idleTimePct");
    return nonNegative(assertFinite((weeksPerYear - vacationWeeks) * hoursPerWeek * (1 - idleTimePct)));
  },
  },
  {
    id: "user.hourly_rate_5",
    family: "general",
    label: "Saatlik Ücret — FullyBurdenedHourlyRate",
    fn: (inputs) => {
    const totalLaborCost = num(inputs, "totalLaborCost");
    const productiveHours = num(inputs, "productiveHours");
    return nonNegative(assertFinite(totalLaborCost / productiveHours));
  },
  },
  {
    id: "user.hourly_rate_6",
    family: "general",
    label: "Saatlik Ücret — MarginRate",
    fn: (inputs) => {
    const fullyBurdenedHourlyRate = num(inputs, "fullyBurdenedHourlyRate");
    const targetMargin = num(inputs, "targetMargin");
    return nonNegative(assertFinite(fullyBurdenedHourlyRate * (1 + targetMargin)));
  },
  },

  // ── SMED Değişim Optimize Edici (7 formulas) ──
  {
    id: "user.smed_changeover_optimizer_0",
    family: "general",
    label: "SMED Değişim Optimize Edici — CurrentSetupTime",
    fn: (inputs) => {
    const internal = num(inputs, "internal");
    const Current = num(inputs, "Current");
    const external = num(inputs, "external");
    return nonNegative(assertFinite(internal_Current + external_Current));
  },
  },
  {
    id: "user.smed_changeover_optimizer_1",
    family: "general",
    label: "SMED Değişim Optimize Edici — TargetSetupTime",
    fn: (inputs) => {
    const internal = num(inputs, "internal");
    const Target = num(inputs, "Target");
    const external = num(inputs, "external");
    return nonNegative(assertFinite(internal_Target + external_Target));
  },
  },
  {
    id: "user.smed_changeover_optimizer_2",
    family: "general",
    label: "SMED Değişim Optimize Edici — ConversionRate",
    fn: (inputs) => {
    const internal = num(inputs, "internal");
    const Current = num(inputs, "Current");
    const Target = num(inputs, "Target");
    return nonNegative(assertFinite((internal_Current - internal_Target) / internal_Current));
  },
  },
  {
    id: "user.smed_changeover_optimizer_3",
    family: "general",
    label: "SMED Değişim Optimize Edici — CapacityRecovered",
    fn: (inputs) => {
    const currentSetupTime = num(inputs, "currentSetupTime");
    const targetSetupTime = num(inputs, "targetSetupTime");
    const changeoverFrequency = num(inputs, "changeoverFrequency");
    return nonNegative(assertFinite((currentSetupTime - targetSetupTime) * changeoverFrequency));
  },
  },
  {
    id: "user.smed_changeover_optimizer_4",
    family: "general",
    label: "SMED Değişim Optimize Edici — FinancialGain",
    fn: (inputs) => {
    const capacityRecovered = num(inputs, "capacityRecovered");
    const bottleneckThroughput = num(inputs, "bottleneckThroughput");
    const unitMargin = num(inputs, "unitMargin");
    return nonNegative(assertFinite(capacityRecovered * bottleneckThroughput * unitMargin));
  },
  },
  {
    id: "user.smed_changeover_optimizer_5",
    family: "general",
    label: "SMED Değişim Optimize Edici — SMED_Investment",
    fn: (inputs) => {
    const training = num(inputs, "training");
    const tooling = num(inputs, "tooling");
    const modification = num(inputs, "modification");
    return nonNegative(assertFinite(training + tooling + modification));
  },
  },
  {
    id: "user.smed_changeover_optimizer_6",
    family: "general",
    label: "SMED Değişim Optimize Edici — ROI",
    fn: (inputs) => {
    const financialGain = num(inputs, "financialGain");
    const sMED = num(inputs, "sMED");
    const Investment = num(inputs, "Investment");
    return nonNegative(assertFinite(financialGain / sMED_Investment));
  },
  },

  // ── Sözleşme Teşvik (9 formulas) ──
  {
    id: "user.contract_incentive_0",
    family: "general",
    label: "Sözleşme Teşvik — TargetCost",
    fn: (inputs) => {
    const baselineEstimate = num(inputs, "baselineEstimate");
    return nonNegative(assertFinite(baselineEstimate));
  },
  },
  {
    id: "user.contract_incentive_1",
    family: "general",
    label: "Sözleşme Teşvik — TargetFee",
    fn: (inputs) => {
    const targetCost = num(inputs, "targetCost");
    const targetFeePct = num(inputs, "targetFeePct");
    return nonNegative(assertFinite(targetCost * targetFeePct));
  },
  },
  {
    id: "user.contract_incentive_2",
    family: "general",
    label: "Sözleşme Teşvik — ShareRatio",
    fn: (inputs) => {
    const overrunShare = num(inputs, "overrunShare");
    const underrunShare = num(inputs, "underrunShare");
    return nonNegative(assertFinite(overrunShare / underrunShare));
  },
  },
  {
    id: "user.contract_incentive_3",
    family: "general",
    label: "Sözleşme Teşvik — ActualFee",
    fn: (inputs) => {
    const targetFee = num(inputs, "targetFee");
    const targetCost = num(inputs, "targetCost");
    const actualCost = num(inputs, "actualCost");
    const contractorSharePct = num(inputs, "contractorSharePct");
    return nonNegative(assertFinite(targetFee + (targetCost - actualCost) * contractorSharePct));
  },
  },
  {
    id: "user.contract_incentive_4",
    family: "general",
    label: "Sözleşme Teşvik — MaxFee",
    fn: (inputs) => {
    const targetFee = num(inputs, "targetFee");
    const maxFeeMultiplier = num(inputs, "maxFeeMultiplier");
    return nonNegative(assertFinite(targetFee * maxFeeMultiplier));
  },
  },
  {
    id: "user.contract_incentive_5",
    family: "general",
    label: "Sözleşme Teşvik — MinFee",
    fn: (inputs) => {
    const targetFee = num(inputs, "targetFee");
    const minFeeMultiplier = num(inputs, "minFeeMultiplier");
    return nonNegative(assertFinite(targetFee * minFeeMultiplier));
  },
  },
  {
    id: "user.contract_incentive_6",
    family: "general",
    label: "Sözleşme Teşvik — FinalFee",
    fn: (inputs) => {
    const actualFee = num(inputs, "actualFee");
    const minFee = num(inputs, "minFee");
    const maxFee = num(inputs, "maxFee");
    return nonNegative(assertFinite(Math.min(Math.max(actualFee, minFee), maxFee)));
  },
  },
  {
    id: "user.contract_incentive_7",
    family: "general",
    label: "Sözleşme Teşvik — FinalPrice",
    fn: (inputs) => {
    const actualCost = num(inputs, "actualCost");
    const finalFee = num(inputs, "finalFee");
    return nonNegative(assertFinite(actualCost + finalFee));
  },
  },
  {
    id: "user.contract_incentive_8",
    family: "general",
    label: "Sözleşme Teşvik — PerformanceBonus",
    fn: (inputs) => {
    const metricWeight = num(inputs, "metricWeight");
    const i = num(inputs, "i");
    const metricScore = num(inputs, "metricScore");
    const bonusPool = num(inputs, "bonusPool");
    return nonNegative(assertFinite(SUM(metricWeight_i * metricScore_i) * bonusPool));
  },
  },

  // ── SPC Signal Delay Maliyet (7 formulas) ──
  {
    id: "user.spc_signal_delay_0",
    family: "general",
    label: "SPC Signal Delay Maliyet — ARL_InControl",
    fn: (inputs) => {
    const alpha = num(inputs, "alpha");
    return nonNegative(assertFinite(1 / alpha));
  },
  },
  {
    id: "user.spc_signal_delay_1",
    family: "general",
    label: "SPC Signal Delay Maliyet — ARL_OutOfControl",
    fn: (inputs) => {
    const beta = num(inputs, "beta");
    return nonNegative(assertFinite(1 / (1 - beta)));
  },
  },
  {
    id: "user.spc_signal_delay_2",
    family: "general",
    label: "SPC Signal Delay Maliyet — DetectionDelay_Hours",
    fn: (inputs) => {
    const aRL = num(inputs, "aRL");
    const OutOfControl = num(inputs, "OutOfControl");
    const samplingInterval = num(inputs, "samplingInterval");
    return nonNegative(assertFinite(aRL_OutOfControl * samplingInterval));
  },
  },
  {
    id: "user.spc_signal_delay_3",
    family: "general",
    label: "SPC Signal Delay Maliyet — DefectsProduced",
    fn: (inputs) => {
    const detectionDelay = num(inputs, "detectionDelay");
    const Hours = num(inputs, "Hours");
    const productionRate = num(inputs, "productionRate");
    const defectRate = num(inputs, "defectRate");
    return nonNegative(assertFinite(detectionDelay_Hours * productionRate * defectRate_OOC));
  },
  },
  {
    id: "user.spc_signal_delay_4",
    family: "general",
    label: "SPC Signal Delay Maliyet — Cost_Delay",
    fn: (inputs) => {
    const defectsProduced = num(inputs, "defectsProduced");
    const costPerDefect = num(inputs, "costPerDefect");
    return nonNegative(assertFinite(defectsProduced * costPerDefect));
  },
  },
  {
    id: "user.spc_signal_delay_5",
    family: "general",
    label: "SPC Signal Delay Maliyet — InvestigationCost",
    fn: (inputs) => {
    const falseAlarmRate = num(inputs, "falseAlarmRate");
    const samplingFrequency = num(inputs, "samplingFrequency");
    const laborRate = num(inputs, "laborRate");
    return nonNegative(assertFinite(falseAlarmRate * samplingFrequency * laborRate));
  },
  },
  {
    id: "user.spc_signal_delay_6",
    family: "general",
    label: "SPC Signal Delay Maliyet — OptimalInterval",
    fn: (inputs) => {
    const samplingCost = num(inputs, "samplingCost");
    const productionRate = num(inputs, "productionRate");
    const cost = num(inputs, "cost");
    const Delay = num(inputs, "Delay");
    const shiftMagnitude = num(inputs, "shiftMagnitude");
    return nonNegative(assertFinite(Math.sqrt((2 * samplingCost * productionRate) / (cost_Delay * shiftMagnitude**2))));
  },
  },

  // ── Steam Trap Enerji kayıp (7 formulas) ──
  {
    id: "user.steam_trap_energy_loss_0",
    family: "general",
    label: "Steam Trap Enerji kayıp — OrificeFlow",
    fn: (inputs) => {
    const c = num(inputs, "c");
    const d = num(inputs, "d");
    const a = num(inputs, "a");
    const deltaP = num(inputs, "deltaP");
    const density = num(inputs, "density");
    return nonNegative(assertFinite(c_d * a * Math.sqrt(2 * deltaP * density)));
  },
  },
  {
    id: "user.steam_trap_energy_loss_1",
    family: "general",
    label: "Steam Trap Enerji kayıp — SteamLoss_kg_h",
    fn: (inputs) => {
    const orificeFlow = num(inputs, "orificeFlow");
    return nonNegative(assertFinite(orificeFlow * 3600));
  },
  },
  {
    id: "user.steam_trap_energy_loss_2",
    family: "general",
    label: "Steam Trap Enerji kayıp — EnergyLoss_kW",
    fn: (inputs) => {
    const steamLoss = num(inputs, "steamLoss");
    const kg = num(inputs, "kg");
    const h = num(inputs, "h");
    const enthalpy = num(inputs, "enthalpy");
    const Steam = num(inputs, "Steam");
    return nonNegative(assertFinite(steamLoss_kg_h * enthalpy_Steam / 3600));
  },
  },
  {
    id: "user.steam_trap_energy_loss_3",
    family: "general",
    label: "Steam Trap Enerji kayıp — AnnualCost",
    fn: (inputs) => {
    const energyLoss = num(inputs, "energyLoss");
    const kW = num(inputs, "kW");
    const operatingHours = num(inputs, "operatingHours");
    const steamCost = num(inputs, "steamCost");
    const per = num(inputs, "per");
    const kWh = num(inputs, "kWh");
    return nonNegative(assertFinite(energyLoss_kW * operatingHours * steamCost_per_kWh));
  },
  },
  {
    id: "user.steam_trap_energy_loss_4",
    family: "general",
    label: "Steam Trap Enerji kayıp — TrapFailureRate",
    fn: (inputs) => {
    const failedTraps = num(inputs, "failedTraps");
    const totalTraps = num(inputs, "totalTraps");
    return nonNegative(assertFinite(failedTraps / totalTraps));
  },
  },
  {
    id: "user.steam_trap_energy_loss_5",
    family: "general",
    label: "Steam Trap Enerji kayıp — TotalSystemLoss",
    fn: (inputs) => {
    const annualCost = num(inputs, "annualCost");
    const i = num(inputs, "i");
    return nonNegative(assertFinite(SUM(annualCost_i)));
  },
  },
  {
    id: "user.steam_trap_energy_loss_6",
    family: "general",
    label: "Steam Trap Enerji kayıp — RepairROI",
    fn: (inputs) => {
    const totalSystemLoss = num(inputs, "totalSystemLoss");
    const trapCost = num(inputs, "trapCost");
    const laborCost = num(inputs, "laborCost");
    return nonNegative(assertFinite(totalSystemLoss / (trapCost + laborCost)));
  },
  },

  // ── Stok Devir hızı risk (7 formulas) ──
  {
    id: "user.inventory_turnover_risk_0",
    family: "general",
    label: "Stok Devir hızı risk — InventoryTurnover",
    fn: (inputs) => {
    const cOGS = num(inputs, "cOGS");
    const averageInventory = num(inputs, "averageInventory");
    return nonNegative(assertFinite(cOGS / averageInventory));
  },
  },
  {
    id: "user.inventory_turnover_risk_1",
    family: "general",
    label: "Stok Devir hızı risk — DaysSalesInventory",
    fn: (inputs) => {
    const inventoryTurnover = num(inputs, "inventoryTurnover");
    return nonNegative(assertFinite(365 / inventoryTurnover));
  },
  },
  {
    id: "user.inventory_turnover_risk_2",
    family: "general",
    label: "Stok Devir hızı risk — ObsolescenceRisk",
    fn: (inputs) => {
    const agingBracket = num(inputs, "agingBracket");
    const i = num(inputs, "i");
    const obsolescenceRate = num(inputs, "obsolescenceRate");
    const inventoryValue = num(inputs, "inventoryValue");
    return nonNegative(assertFinite(SUM(agingBracket_i * obsolescenceRate_i * inventoryValue_i)));
  },
  },
  {
    id: "user.inventory_turnover_risk_3",
    family: "general",
    label: "Stok Devir hızı risk — CarryingCost",
    fn: (inputs) => {
    const averageInventory = num(inputs, "averageInventory");
    const wACC = num(inputs, "wACC");
    const storage = num(inputs, "storage");
    const insurance = num(inputs, "insurance");
    const obsolescence = num(inputs, "obsolescence");
    return nonNegative(assertFinite(averageInventory * (wACC + storage + insurance + obsolescence)));
  },
  },
  {
    id: "user.inventory_turnover_risk_4",
    family: "general",
    label: "Stok Devir hızı risk — OptimalTurnover",
    fn: (inputs) => {
    const industryBenchmark = num(inputs, "industryBenchmark");
    const adjustmentFactor = num(inputs, "adjustmentFactor");
    return nonNegative(assertFinite(industryBenchmark * adjustmentFactor));
  },
  },
  {
    id: "user.inventory_turnover_risk_5",
    family: "general",
    label: "Stok Devir hızı risk — StockoutRisk",
    fn: (inputs) => {
    const turnover = num(inputs, "turnover");
    const maxThreshold = num(inputs, "maxThreshold");
    const high = num(inputs, "high");
    const low = num(inputs, "low");
    return nonNegative(assertFinite(((turnover > maxThreshold) ? (high) : (low))));
  },
  },
  {
    id: "user.inventory_turnover_risk_6",
    family: "general",
    label: "Stok Devir hızı risk — LiquidationLoss",
    fn: (inputs) => {
    const slowMovingInventory = num(inputs, "slowMovingInventory");
    const salvageValuePct = num(inputs, "salvageValuePct");
    return nonNegative(assertFinite(slowMovingInventory * (1 - salvageValuePct)));
  },
  },

  // ── Su Kullanımı Optimize Edici (8 formulas) ──
  {
    id: "user.water_usage_optimizer_0",
    family: "general",
    label: "Su Kullanımı Optimize Edici — WaterIntensity",
    fn: (inputs) => {
    const totalWaterConsumed = num(inputs, "totalWaterConsumed");
    const productionVolume = num(inputs, "productionVolume");
    return nonNegative(assertFinite(totalWaterConsumed / productionVolume));
  },
  },
  {
    id: "user.water_usage_optimizer_1",
    family: "general",
    label: "Su Kullanımı Optimize Edici — BaselineConsumption",
    fn: (inputs) => {
    const historicalAvg = num(inputs, "historicalAvg");
    const productionVolume = num(inputs, "productionVolume");
    return nonNegative(assertFinite(historicalAvg * productionVolume));
  },
  },
  {
    id: "user.water_usage_optimizer_2",
    family: "general",
    label: "Su Kullanımı Optimize Edici — WaterSavings",
    fn: (inputs) => {
    const baselineConsumption = num(inputs, "baselineConsumption");
    const actualConsumption = num(inputs, "actualConsumption");
    return nonNegative(assertFinite(baselineConsumption - actualConsumption));
  },
  },
  {
    id: "user.water_usage_optimizer_3",
    family: "general",
    label: "Su Kullanımı Optimize Edici — CostSavings",
    fn: (inputs) => {
    const waterSavings = num(inputs, "waterSavings");
    const waterSupplyRate = num(inputs, "waterSupplyRate");
    const wastewaterTreatmentRate = num(inputs, "wastewaterTreatmentRate");
    return nonNegative(assertFinite(waterSavings * (waterSupplyRate + wastewaterTreatmentRate)));
  },
  },
  {
    id: "user.water_usage_optimizer_4",
    family: "general",
    label: "Su Kullanımı Optimize Edici — RecycleRate",
    fn: (inputs) => {
    const recycledWater = num(inputs, "recycledWater");
    const totalWaterConsumed = num(inputs, "totalWaterConsumed");
    return nonNegative(assertFinite(recycledWater / totalWaterConsumed));
  },
  },
  {
    id: "user.water_usage_optimizer_5",
    family: "general",
    label: "Su Kullanımı Optimize Edici — LeakLoss",
    fn: (inputs) => {
    const totalSupplied = num(inputs, "totalSupplied");
    const totalMetered = num(inputs, "totalMetered");
    return nonNegative(assertFinite(totalSupplied - totalMetered));
  },
  },
  {
    id: "user.water_usage_optimizer_6",
    family: "general",
    label: "Su Kullanımı Optimize Edici — ROI_Water",
    fn: (inputs) => {
    const costSavings = num(inputs, "costSavings");
    const equipmentCost = num(inputs, "equipmentCost");
    const installationCost = num(inputs, "installationCost");
    return nonNegative(assertFinite(costSavings / (equipmentCost + installationCost)));
  },
  },
  {
    id: "user.water_usage_optimizer_7",
    family: "general",
    label: "Su Kullanımı Optimize Edici — CarbonFootprint_Water",
    fn: (inputs) => {
    const totalConsumed = num(inputs, "totalConsumed");
    const energyIntensity = num(inputs, "energyIntensity");
    const Water = num(inputs, "Water");
    const gridEmissionFactor = num(inputs, "gridEmissionFactor");
    return nonNegative(assertFinite(totalConsumed * energyIntensity_Water * gridEmissionFactor));
  },
  },

  // ── Sulama Maliyet Check (7 formulas) ──
  {
    id: "user.irrigation_cost_check_0",
    family: "general",
    label: "Sulama Maliyet Check — WaterRequirement",
    fn: (inputs) => {
    const eTc = num(inputs, "eTc");
    const area = num(inputs, "area");
    const effectiveRainfall = num(inputs, "effectiveRainfall");
    return nonNegative(assertFinite(eTc * area * (1 - effectiveRainfall)));
  },
  },
  {
    id: "user.irrigation_cost_check_1",
    family: "general",
    label: "Sulama Maliyet Check — PumpEnergy",
    fn: (inputs) => {
    const waterRequirement = num(inputs, "waterRequirement");
    const totalHead = num(inputs, "totalHead");
    const pumpEff = num(inputs, "pumpEff");
    const motorEff = num(inputs, "motorEff");
    return nonNegative(assertFinite((waterRequirement * totalHead) / (pumpEff * motorEff)));
  },
  },
  {
    id: "user.irrigation_cost_check_2",
    family: "general",
    label: "Sulama Maliyet Check — EnergyCost",
    fn: (inputs) => {
    const pumpEnergy = num(inputs, "pumpEnergy");
    const elecRate = num(inputs, "elecRate");
    return nonNegative(assertFinite(pumpEnergy * elecRate));
  },
  },
  {
    id: "user.irrigation_cost_check_3",
    family: "general",
    label: "Sulama Maliyet Check — MaintCost",
    fn: (inputs) => {
    const area = num(inputs, "area");
    const maintRatePerHa = num(inputs, "maintRatePerHa");
    return nonNegative(assertFinite(area * maintRatePerHa));
  },
  },
  {
    id: "user.irrigation_cost_check_4",
    family: "general",
    label: "Sulama Maliyet Check — TotalIrrigationCost",
    fn: (inputs) => {
    const energyCost = num(inputs, "energyCost");
    const maintCost = num(inputs, "maintCost");
    const laborCost = num(inputs, "laborCost");
    const depreciation = num(inputs, "depreciation");
    return nonNegative(assertFinite(energyCost + maintCost + laborCost + depreciation));
  },
  },
  {
    id: "user.irrigation_cost_check_5",
    family: "general",
    label: "Sulama Maliyet Check — CostPerM3",
    fn: (inputs) => {
    const totalIrrigationCost = num(inputs, "totalIrrigationCost");
    const waterRequirement = num(inputs, "waterRequirement");
    return nonNegative(assertFinite(totalIrrigationCost / waterRequirement));
  },
  },
  {
    id: "user.irrigation_cost_check_6",
    family: "general",
    label: "Sulama Maliyet Check — WaterUseEfficiency",
    fn: (inputs) => {
    const waterRequirement = num(inputs, "waterRequirement");
    const losses = num(inputs, "losses");
    return nonNegative(assertFinite((waterRequirement - losses) / waterRequirement));
  },
  },

  // ── Supplier Performans Tco (6 formulas) ──
  {
    id: "user.supplier_performance_tco_0",
    family: "general",
    label: "Supplier Performans Tco — TCO",
    fn: (inputs) => {
    const purchasePrice = num(inputs, "purchasePrice");
    const orderingCost = num(inputs, "orderingCost");
    const transportCost = num(inputs, "transportCost");
    const qualityCost = num(inputs, "qualityCost");
    const inventoryCost = num(inputs, "inventoryCost");
    const riskCost = num(inputs, "riskCost");
    return nonNegative(assertFinite(purchasePrice + orderingCost + transportCost + qualityCost + inventoryCost + riskCost));
  },
  },
  {
    id: "user.supplier_performance_tco_1",
    family: "general",
    label: "Supplier Performans Tco — QualityCost",
    fn: (inputs) => {
    const defectRate = num(inputs, "defectRate");
    const annualVolume = num(inputs, "annualVolume");
    const costPerDefect = num(inputs, "costPerDefect");
    return nonNegative(assertFinite(defectRate * annualVolume * costPerDefect));
  },
  },
  {
    id: "user.supplier_performance_tco_2",
    family: "general",
    label: "Supplier Performans Tco — InventoryCost",
    fn: (inputs) => {
    const avgLeadTime = num(inputs, "avgLeadTime");
    const safetyStockDays = num(inputs, "safetyStockDays");
    const dailyDemand = num(inputs, "dailyDemand");
    const holdingRate = num(inputs, "holdingRate");
    return nonNegative(assertFinite((avgLeadTime + safetyStockDays) * dailyDemand * holdingRate));
  },
  },
  {
    id: "user.supplier_performance_tco_3",
    family: "general",
    label: "Supplier Performans Tco — RiskCost",
    fn: (inputs) => {
    const probabilityOfDisruption = num(inputs, "probabilityOfDisruption");
    const impactCost = num(inputs, "impactCost");
    return nonNegative(assertFinite(probabilityOfDisruption * impactCost));
  },
  },
  {
    id: "user.supplier_performance_tco_4",
    family: "general",
    label: "Supplier Performans Tco — SupplierScore",
    fn: (inputs) => {
    const qualityWeight = num(inputs, "qualityWeight");
    const qualityScore = num(inputs, "qualityScore");
    const deliveryWeight = num(inputs, "deliveryWeight");
    const deliveryScore = num(inputs, "deliveryScore");
    const costWeight = num(inputs, "costWeight");
    const costScore = num(inputs, "costScore");
    return nonNegative(assertFinite((qualityWeight * qualityScore) + (deliveryWeight * deliveryScore) + (costWeight * costScore)));
  },
  },
  {
    id: "user.supplier_performance_tco_5",
    family: "general",
    label: "Supplier Performans Tco — TCO_Variance",
    fn: (inputs) => {
    const tCO = num(inputs, "tCO");
    const Actual = num(inputs, "Actual");
    const Quoted = num(inputs, "Quoted");
    return nonNegative(assertFinite(tCO_Actual - tCO_Quoted));
  },
  },

  // ── Süt Kâr Dedektörü (7 formulas) ──
  {
    id: "user.dairy_profit_detector_0",
    family: "general",
    label: "Süt Kâr Dedektörü — FatCorrectedMilk",
    fn: (inputs) => {
    const milkYield = num(inputs, "milkYield");
    const fatYield = num(inputs, "fatYield");
    return nonNegative(assertFinite((0.4 * milkYield) + (15 * fatYield)));
  },
  },
  {
    id: "user.dairy_profit_detector_1",
    family: "general",
    label: "Süt Kâr Dedektörü — ProteinCorrectedMilk",
    fn: (inputs) => {
    const milkYield = num(inputs, "milkYield");
    const proteinYield = num(inputs, "proteinYield");
    return nonNegative(assertFinite((0.337 * milkYield) + (11.6 * proteinYield)));
  },
  },
  {
    id: "user.dairy_profit_detector_2",
    family: "general",
    label: "Süt Kâr Dedektörü — FeedCostPerLiter",
    fn: (inputs) => {
    const totalFeedCost = num(inputs, "totalFeedCost");
    const milkYield = num(inputs, "milkYield");
    return nonNegative(assertFinite(totalFeedCost / milkYield));
  },
  },
  {
    id: "user.dairy_profit_detector_3",
    family: "general",
    label: "Süt Kâr Dedektörü — IncomeOverFeedCost",
    fn: (inputs) => {
    const milkPrice = num(inputs, "milkPrice");
    const milkYield = num(inputs, "milkYield");
    const totalFeedCost = num(inputs, "totalFeedCost");
    return nonNegative(assertFinite((milkPrice * milkYield) - totalFeedCost));
  },
  },
  {
    id: "user.dairy_profit_detector_4",
    family: "general",
    label: "Süt Kâr Dedektörü — MarginPerCow",
    fn: (inputs) => {
    const incomeOverFeedCost = num(inputs, "incomeOverFeedCost");
    const vetCost = num(inputs, "vetCost");
    const breedingCost = num(inputs, "breedingCost");
    const laborCost = num(inputs, "laborCost");
    return nonNegative(assertFinite(incomeOverFeedCost - (vetCost + breedingCost + laborCost)));
  },
  },
  {
    id: "user.dairy_profit_detector_5",
    family: "general",
    label: "Süt Kâr Dedektörü — HerdProfitability",
    fn: (inputs) => {
    const marginPerCow = num(inputs, "marginPerCow");
    const fixedOverhead = num(inputs, "fixedOverhead");
    return nonNegative(assertFinite(SUM(marginPerCow) - fixedOverhead));
  },
  },
  {
    id: "user.dairy_profit_detector_6",
    family: "general",
    label: "Süt Kâr Dedektörü — SomaticCellPenalty",
    fn: (inputs) => {
    const sCC = num(inputs, "sCC");
    const threshold = num(inputs, "threshold");
    const milkYield = num(inputs, "milkYield");
    const penaltyRate = num(inputs, "penaltyRate");
    return nonNegative(assertFinite(((sCC > threshold) ? (milkYield * penaltyRate) : (0))));
  },
  },

  // ── Taguchi kalite kayıp Fonksiyon (7 formulas) ──
  {
    id: "user.taguchi_quality_loss_0",
    family: "general",
    label: "Taguchi kalite kayıp Fonksiyon — LossPerUnit",
    fn: (inputs) => {
    const k = num(inputs, "k");
    const actualValue = num(inputs, "actualValue");
    const targetValue = num(inputs, "targetValue");
    return nonNegative(assertFinite(k * (actualValue - targetValue)**2));
  },
  },
  {
    id: "user.taguchi_quality_loss_1",
    family: "general",
    label: "Taguchi kalite kayıp Fonksiyon — k",
    fn: (inputs) => {
    const costAtTolerance = num(inputs, "costAtTolerance");
    const tolerance = num(inputs, "tolerance");
    return nonNegative(assertFinite(costAtTolerance / tolerance**2));
  },
  },
  {
    id: "user.taguchi_quality_loss_2",
    family: "general",
    label: "Taguchi kalite kayıp Fonksiyon — AverageLoss",
    fn: (inputs) => {
    const k = num(inputs, "k");
    const variance = num(inputs, "variance");
    const mean = num(inputs, "mean");
    const target = num(inputs, "target");
    return nonNegative(assertFinite(k * (variance + (mean - target)**2)));
  },
  },
  {
    id: "user.taguchi_quality_loss_3",
    family: "general",
    label: "Taguchi kalite kayıp Fonksiyon — TotalAnnualLoss",
    fn: (inputs) => {
    const averageLoss = num(inputs, "averageLoss");
    const annualProduction = num(inputs, "annualProduction");
    return nonNegative(assertFinite(averageLoss * annualProduction));
  },
  },
  {
    id: "user.taguchi_quality_loss_4",
    family: "general",
    label: "Taguchi kalite kayıp Fonksiyon — SignalToNoise_LargerBetter",
    fn: (inputs) => {
    const y = num(inputs, "y");
    const i = num(inputs, "i");
    const n = num(inputs, "n");
    return nonNegative(assertFinite(-10 * Math.log10(SUM(1/y_i**2) / n)));
  },
  },
  {
    id: "user.taguchi_quality_loss_5",
    family: "general",
    label: "Taguchi kalite kayıp Fonksiyon — SignalToNoise_SmallerBetter",
    fn: (inputs) => {
    const y = num(inputs, "y");
    const i = num(inputs, "i");
    const n = num(inputs, "n");
    return nonNegative(assertFinite(-10 * Math.log10(SUM(y_i**2) / n)));
  },
  },
  {
    id: "user.taguchi_quality_loss_6",
    family: "general",
    label: "Taguchi kalite kayıp Fonksiyon — QualityImprovementSavings",
    fn: (inputs) => {
    const oldAverageLoss = num(inputs, "oldAverageLoss");
    const newAverageLoss = num(inputs, "newAverageLoss");
    const annualProduction = num(inputs, "annualProduction");
    return nonNegative(assertFinite((oldAverageLoss - newAverageLoss) * annualProduction));
  },
  },

  // ── Takım Aşınma Maliyeti (6 formulas) ──
  {
    id: "user.tool_wear_cost_0",
    family: "general",
    label: "Takım Aşınma Maliyeti — ToolCostPerPart",
    fn: (inputs) => {
    const insertCost = num(inputs, "insertCost");
    const edges = num(inputs, "edges");
    const machiningTime = num(inputs, "machiningTime");
    const toolLife = num(inputs, "toolLife");
    return nonNegative(assertFinite((insertCost / edges) * (machiningTime / toolLife)));
  },
  },
  {
    id: "user.tool_wear_cost_1",
    family: "general",
    label: "Takım Aşınma Maliyeti — ChangeCostPerPart",
    fn: (inputs) => {
    const toolChangeTime = num(inputs, "toolChangeTime");
    const machineRate = num(inputs, "machineRate");
    const machiningTime = num(inputs, "machiningTime");
    const toolLife = num(inputs, "toolLife");
    return nonNegative(assertFinite((toolChangeTime * machineRate) * (machiningTime / toolLife)));
  },
  },
  {
    id: "user.tool_wear_cost_2",
    family: "general",
    label: "Takım Aşınma Maliyeti — TotalToolingCost",
    fn: (inputs) => {
    const toolCostPerPart = num(inputs, "toolCostPerPart");
    const changeCostPerPart = num(inputs, "changeCostPerPart");
    return nonNegative(assertFinite(toolCostPerPart + changeCostPerPart));
  },
  },
  {
    id: "user.tool_wear_cost_3",
    family: "general",
    label: "Takım Aşınma Maliyeti — WearRate",
    fn: (inputs) => {
    const flankWear = num(inputs, "flankWear");
    const machiningTime = num(inputs, "machiningTime");
    return nonNegative(assertFinite(flankWear / machiningTime));
  },
  },
  {
    id: "user.tool_wear_cost_4",
    family: "general",
    label: "Takım Aşınma Maliyeti — OptimalToolLife",
    fn: (inputs) => {
    const n = num(inputs, "n");
    const toolChangeTime = num(inputs, "toolChangeTime");
    const insertCost = num(inputs, "insertCost");
    const edges = num(inputs, "edges");
    const machineRate = num(inputs, "machineRate");
    return nonNegative(assertFinite(((1/n - 1) * (toolChangeTime + insertCost/edges / machineRate))));
  },
  },
  {
    id: "user.tool_wear_cost_5",
    family: "general",
    label: "Takım Aşınma Maliyeti — CostOfPrematureFailure",
    fn: (inputs) => {
    const expectedLife = num(inputs, "expectedLife");
    const actualLife = num(inputs, "actualLife");
    const insertCost = num(inputs, "insertCost");
    return nonNegative(assertFinite((expectedLife - actualLife) / expectedLife * insertCost));
  },
  },

  // ── Takt Süre Flexibility Maliyet (6 formulas) ──
  {
    id: "user.takt_time_flexibility_0",
    family: "general",
    label: "Takt Süre Flexibility Maliyet — TaktTime",
    fn: (inputs) => {
    const availableTime = num(inputs, "availableTime");
    const customerDemand = num(inputs, "customerDemand");
    return nonNegative(assertFinite(availableTime / customerDemand));
  },
  },
  {
    id: "user.takt_time_flexibility_1",
    family: "general",
    label: "Takt Süre Flexibility Maliyet — CycleTimeFlexibility",
    fn: (inputs) => {
    const cycleTime = num(inputs, "cycleTime");
    const i = num(inputs, "i");
    return nonNegative(assertFinite(Math.max(cycleTime_i) - Math.min(cycleTime_i)));
  },
  },
  {
    id: "user.takt_time_flexibility_2",
    family: "general",
    label: "Takt Süre Flexibility Maliyet — BalanceLoss",
    fn: (inputs) => {
    const taktTime = num(inputs, "taktTime");
    const cycleTime = num(inputs, "cycleTime");
    const i = num(inputs, "i");
    const laborRate = num(inputs, "laborRate");
    return nonNegative(assertFinite(SUM(taktTime - cycleTime_i) * laborRate));
  },
  },
  {
    id: "user.takt_time_flexibility_3",
    family: "general",
    label: "Takt Süre Flexibility Maliyet — CrossTrainingCost",
    fn: (inputs) => {
    const operators = num(inputs, "operators");
    const trainingHours = num(inputs, "trainingHours");
    const trainerRate = num(inputs, "trainerRate");
    return nonNegative(assertFinite(operators * trainingHours * trainerRate));
  },
  },
  {
    id: "user.takt_time_flexibility_4",
    family: "general",
    label: "Takt Süre Flexibility Maliyet — FlexibilityPremium",
    fn: (inputs) => {
    const crossTrainingCost = num(inputs, "crossTrainingCost");
    const annualProduction = num(inputs, "annualProduction");
    return nonNegative(assertFinite(crossTrainingCost / annualProduction));
  },
  },
  {
    id: "user.takt_time_flexibility_5",
    family: "general",
    label: "Takt Süre Flexibility Maliyet — VolumeVariationCost",
    fn: (inputs) => {
    const demand = num(inputs, "demand");
    const capacity = num(inputs, "capacity");
    const overtimeRate = num(inputs, "overtimeRate");
    const idleLaborCost = num(inputs, "idleLaborCost");
    return nonNegative(assertFinite(((demand > capacity) ? ((demand - capacity) * overtimeRate) : ((capacity - demand)) * idleLaborCost)));
  },
  },

  // ── talep Forecast Stok Maliyet (5 formulas) ──
  {
    id: "user.demand_forecast_stock_0",
    family: "general",
    label: "talep Forecast Stok Maliyet — ForecastError",
    fn: (inputs) => {
    const actualDemand = num(inputs, "actualDemand");
    const forecastDemand = num(inputs, "forecastDemand");
    return nonNegative(assertFinite(Math.abs(actualDemand - forecastDemand) / actualDemand));
  },
  },
  {
    id: "user.demand_forecast_stock_1",
    family: "general",
    label: "talep Forecast Stok Maliyet — SafetyStock",
    fn: (inputs) => {
    const z = num(inputs, "z");
    const Score = num(inputs, "Score");
    const stdDev = num(inputs, "stdDev");
    const ForecastError = num(inputs, "ForecastError");
    const leadTime = num(inputs, "leadTime");
    return nonNegative(assertFinite(z_Score * stdDev_ForecastError * Math.sqrt(leadTime)));
  },
  },
  {
    id: "user.demand_forecast_stock_2",
    family: "general",
    label: "talep Forecast Stok Maliyet — CarryingCost_Safety",
    fn: (inputs) => {
    const safetyStock = num(inputs, "safetyStock");
    const unitCost = num(inputs, "unitCost");
    const holdingRate = num(inputs, "holdingRate");
    return nonNegative(assertFinite(safetyStock * unitCost * holdingRate));
  },
  },
  {
    id: "user.demand_forecast_stock_3",
    family: "general",
    label: "talep Forecast Stok Maliyet — StockoutCost",
    fn: (inputs) => {
    const actualDemand = num(inputs, "actualDemand");
    const forecastDemand = num(inputs, "forecastDemand");
    const safetyStock = num(inputs, "safetyStock");
    const penaltyCost = num(inputs, "penaltyCost");
    return nonNegative(assertFinite(((actualDemand > (forecastDemand + safetyStock)) ? ((actualDemand - forecastDemand - safetyStock) * penaltyCost) : (0))));
  },
  },
  {
    id: "user.demand_forecast_stock_4",
    family: "general",
    label: "talep Forecast Stok Maliyet — TotalForecastCost",
    fn: (inputs) => {
    const carryingCost = num(inputs, "carryingCost");
    const Safety = num(inputs, "Safety");
    const stockoutCost = num(inputs, "stockoutCost");
    const forecastingSystemCost = num(inputs, "forecastingSystemCost");
    return nonNegative(assertFinite(carryingCost_Safety + stockoutCost + forecastingSystemCost));
  },
  },

  // ── Tamirhane Parça ve İşçilik Teklif (7 formulas) ──
  {
    id: "user.repair_shop_quote_0",
    family: "general",
    label: "Tamirhane Parça ve İşçilik Teklif — PartCost",
    fn: (inputs) => {
    const quantity = num(inputs, "quantity");
    const i = num(inputs, "i");
    const dealerPrice = num(inputs, "dealerPrice");
    return nonNegative(assertFinite(SUM(quantity_i * dealerPrice_i)));
  },
  },
  {
    id: "user.repair_shop_quote_1",
    family: "general",
    label: "Tamirhane Parça ve İşçilik Teklif — PartMargin",
    fn: (inputs) => {
    const partCost = num(inputs, "partCost");
    const partMarkupPct = num(inputs, "partMarkupPct");
    return nonNegative(assertFinite(partCost * partMarkupPct));
  },
  },
  {
    id: "user.repair_shop_quote_2",
    family: "general",
    label: "Tamirhane Parça ve İşçilik Teklif — LaborCost",
    fn: (inputs) => {
    const flatRateHours = num(inputs, "flatRateHours");
    const shopHourlyRate = num(inputs, "shopHourlyRate");
    return nonNegative(assertFinite(flatRateHours * shopHourlyRate));
  },
  },
  {
    id: "user.repair_shop_quote_3",
    family: "general",
    label: "Tamirhane Parça ve İşçilik Teklif — SubletCost",
    fn: (inputs) => {
    const subletInvoices = num(inputs, "subletInvoices");
    return nonNegative(assertFinite(SUM(subletInvoices)));
  },
  },
  {
    id: "user.repair_shop_quote_4",
    family: "general",
    label: "Tamirhane Parça ve İşçilik Teklif — TotalQuote",
    fn: (inputs) => {
    const partCost = num(inputs, "partCost");
    const partMargin = num(inputs, "partMargin");
    const laborCost = num(inputs, "laborCost");
    const subletCost = num(inputs, "subletCost");
    const shopSuppliesFee = num(inputs, "shopSuppliesFee");
    const environmentalFee = num(inputs, "environmentalFee");
    return nonNegative(assertFinite(partCost + partMargin + laborCost + subletCost + shopSuppliesFee + environmentalFee));
  },
  },
  {
    id: "user.repair_shop_quote_5",
    family: "general",
    label: "Tamirhane Parça ve İşçilik Teklif — EffectiveLaborRate",
    fn: (inputs) => {
    const laborCost = num(inputs, "laborCost");
    const partMargin = num(inputs, "partMargin");
    const actualHours = num(inputs, "actualHours");
    return nonNegative(assertFinite((laborCost + partMargin) / actualHours));
  },
  },
  {
    id: "user.repair_shop_quote_6",
    family: "general",
    label: "Tamirhane Parça ve İşçilik Teklif — GrossProfitPct",
    fn: (inputs) => {
    const totalQuote = num(inputs, "totalQuote");
    const partCost = num(inputs, "partCost");
    const actualLaborCost = num(inputs, "actualLaborCost");
    return nonNegative(assertFinite((totalQuote - partCost - actualLaborCost) / totalQuote));
  },
  },

  // ── Taşeron Marj Sızıntı Dedektörü (6 formulas) ──
  {
    id: "user.subcontractor_margin_leak_0",
    family: "general",
    label: "Taşeron Marj Sızıntı Dedektörü — QuotedMargin",
    fn: (inputs) => {
    const contractValue = num(inputs, "contractValue");
    const estimatedSubcontractorCost = num(inputs, "estimatedSubcontractorCost");
    return nonNegative(assertFinite((contractValue - estimatedSubcontractorCost) / contractValue));
  },
  },
  {
    id: "user.subcontractor_margin_leak_1",
    family: "general",
    label: "Taşeron Marj Sızıntı Dedektörü — ActualMargin",
    fn: (inputs) => {
    const contractValue = num(inputs, "contractValue");
    const actualSubcontractorCost = num(inputs, "actualSubcontractorCost");
    const reworkCost = num(inputs, "reworkCost");
    const delayPenalties = num(inputs, "delayPenalties");
    return nonNegative(assertFinite((contractValue - actualSubcontractorCost - reworkCost - delayPenalties) / contractValue));
  },
  },
  {
    id: "user.subcontractor_margin_leak_2",
    family: "general",
    label: "Taşeron Marj Sızıntı Dedektörü — MarginLeak",
    fn: (inputs) => {
    const quotedMargin = num(inputs, "quotedMargin");
    const actualMargin = num(inputs, "actualMargin");
    return nonNegative(assertFinite(quotedMargin - actualMargin));
  },
  },
  {
    id: "user.subcontractor_margin_leak_3",
    family: "general",
    label: "Taşeron Marj Sızıntı Dedektörü — ChangeOrderCost",
    fn: (inputs) => {
    const changeOrderAmount = num(inputs, "changeOrderAmount");
    const i = num(inputs, "i");
    return nonNegative(assertFinite(SUM(changeOrderAmount_i)));
  },
  },
  {
    id: "user.subcontractor_margin_leak_4",
    family: "general",
    label: "Taşeron Marj Sızıntı Dedektörü — UnbilledWork",
    fn: (inputs) => {
    const actualWorkCompleted = num(inputs, "actualWorkCompleted");
    const billedAmount = num(inputs, "billedAmount");
    return nonNegative(assertFinite(actualWorkCompleted - billedAmount));
  },
  },
  {
    id: "user.subcontractor_margin_leak_5",
    family: "general",
    label: "Taşeron Marj Sızıntı Dedektörü — LeakagePct",
    fn: (inputs) => {
    const marginLeak = num(inputs, "marginLeak");
    const quotedMargin = num(inputs, "quotedMargin");
    return nonNegative(assertFinite(marginLeak / quotedMargin));
  },
  },

  // ── Taşıma Mode Maliyet risk (7 formulas) ──
  {
    id: "user.transport_mode_risk_0",
    family: "general",
    label: "Taşıma Mode Maliyet risk — Cost_Air",
    fn: (inputs) => {
    const weight = num(inputs, "weight");
    const airRate = num(inputs, "airRate");
    const handling = num(inputs, "handling");
    return nonNegative(assertFinite(weight * airRate + handling));
  },
  },
  {
    id: "user.transport_mode_risk_1",
    family: "general",
    label: "Taşıma Mode Maliyet risk — Cost_Sea",
    fn: (inputs) => {
    const volume = num(inputs, "volume");
    const seaRate = num(inputs, "seaRate");
    const portFees = num(inputs, "portFees");
    const customs = num(inputs, "customs");
    return nonNegative(assertFinite(volume * seaRate + portFees + customs));
  },
  },
  {
    id: "user.transport_mode_risk_2",
    family: "general",
    label: "Taşıma Mode Maliyet risk — Cost_Road",
    fn: (inputs) => {
    const distance = num(inputs, "distance");
    const roadRate = num(inputs, "roadRate");
    const tolls = num(inputs, "tolls");
    return nonNegative(assertFinite(distance * roadRate + tolls));
  },
  },
  {
    id: "user.transport_mode_risk_3",
    family: "general",
    label: "Taşıma Mode Maliyet risk — TransitTimeCost",
    fn: (inputs) => {
    const transitDays = num(inputs, "transitDays");
    const inventoryCarryingCostPerDay = num(inputs, "inventoryCarryingCostPerDay");
    return nonNegative(assertFinite(transitDays * inventoryCarryingCostPerDay));
  },
  },
  {
    id: "user.transport_mode_risk_4",
    family: "general",
    label: "Taşıma Mode Maliyet risk — RiskCost",
    fn: (inputs) => {
    const probabilityOfDamage = num(inputs, "probabilityOfDamage");
    const cargoValue = num(inputs, "cargoValue");
    const probabilityOfDelay = num(inputs, "probabilityOfDelay");
    const delayPenalty = num(inputs, "delayPenalty");
    return nonNegative(assertFinite(probabilityOfDamage * cargoValue + probabilityOfDelay * delayPenalty));
  },
  },
  {
    id: "user.transport_mode_risk_5",
    family: "general",
    label: "Taşıma Mode Maliyet risk — TotalModeCost",
    fn: (inputs) => {
    const transportCost = num(inputs, "transportCost");
    const transitTimeCost = num(inputs, "transitTimeCost");
    const riskCost = num(inputs, "riskCost");
    return nonNegative(assertFinite(transportCost + transitTimeCost + riskCost));
  },
  },
  {
    id: "user.transport_mode_risk_6",
    family: "general",
    label: "Taşıma Mode Maliyet risk — ModeSelection",
    fn: (inputs) => {
    const totalModeCost = num(inputs, "totalModeCost");
    const Air = num(inputs, "Air");
    const Sea = num(inputs, "Sea");
    const Road = num(inputs, "Road");
    return nonNegative(assertFinite(Math.min(totalModeCost_Air, totalModeCost_Sea, totalModeCost_Road)));
  },
  },

  // ── Tedarik Zinciri Kesintisi Risk Değerlendirmesi (6 formulas) ──
  {
    id: "user.supply_chain_disruption_0",
    family: "general",
    label: "Tedarik Zinciri Kesintisi Risk Değerlendirmesi — RiskExposure",
    fn: (inputs) => {
    const probabilityOfDisruption = num(inputs, "probabilityOfDisruption");
    const financialImpact = num(inputs, "financialImpact");
    return nonNegative(assertFinite(probabilityOfDisruption * financialImpact));
  },
  },
  {
    id: "user.supply_chain_disruption_1",
    family: "general",
    label: "Tedarik Zinciri Kesintisi Risk Değerlendirmesi — TimeToRecover",
    fn: (inputs) => {
    const daysToRestoreFullCapacity = num(inputs, "daysToRestoreFullCapacity");
    return nonNegative(assertFinite(daysToRestoreFullCapacity));
  },
  },
  {
    id: "user.supply_chain_disruption_2",
    family: "general",
    label: "Tedarik Zinciri Kesintisi Risk Değerlendirmesi — RevenueLoss",
    fn: (inputs) => {
    const dailyRevenue = num(inputs, "dailyRevenue");
    const timeToRecover = num(inputs, "timeToRecover");
    const bufferCapacityPct = num(inputs, "bufferCapacityPct");
    return nonNegative(assertFinite(dailyRevenue * timeToRecover * (1 - bufferCapacityPct)));
  },
  },
  {
    id: "user.supply_chain_disruption_3",
    family: "general",
    label: "Tedarik Zinciri Kesintisi Risk Değerlendirmesi — MitigationCost",
    fn: (inputs) => {
    const dualSourcingPremium = num(inputs, "dualSourcingPremium");
    const safetyStockCarryingCost = num(inputs, "safetyStockCarryingCost");
    const insurancePremium = num(inputs, "insurancePremium");
    return nonNegative(assertFinite(dualSourcingPremium + safetyStockCarryingCost + insurancePremium));
  },
  },
  {
    id: "user.supply_chain_disruption_4",
    family: "general",
    label: "Tedarik Zinciri Kesintisi Risk Değerlendirmesi — RiskAdjustedCost",
    fn: (inputs) => {
    const expectedAnnualLoss = num(inputs, "expectedAnnualLoss");
    const mitigationCost = num(inputs, "mitigationCost");
    return nonNegative(assertFinite(expectedAnnualLoss + mitigationCost));
  },
  },
  {
    id: "user.supply_chain_disruption_5",
    family: "general",
    label: "Tedarik Zinciri Kesintisi Risk Değerlendirmesi — ResilienceIndex",
    fn: (inputs) => {
    const timeToRecover = num(inputs, "timeToRecover");
    const vulnerabilityScore = num(inputs, "vulnerabilityScore");
    return nonNegative(assertFinite(1 / (timeToRecover * vulnerabilityScore)));
  },
  },

  // ── Tedarikçi Döviz Kuru Riski (6 formulas) ──
  {
    id: "user.supplier_currency_risk_0",
    family: "general",
    label: "Tedarikçi Döviz Kuru Riski — Exposure",
    fn: (inputs) => {
    const contractValue = num(inputs, "contractValue");
    const unhedgedPct = num(inputs, "unhedgedPct");
    return nonNegative(assertFinite(contractValue_FC * unhedgedPct));
  },
  },
  {
    id: "user.supplier_currency_risk_1",
    family: "general",
    label: "Tedarikçi Döviz Kuru Riski — ExpectedLoss",
    fn: (inputs) => {
    const exposure = num(inputs, "exposure");
    const forwardRate = num(inputs, "forwardRate");
    const expectedSpotRate = num(inputs, "expectedSpotRate");
    return nonNegative(assertFinite(exposure * (forwardRate - expectedSpotRate)));
  },
  },
  {
    id: "user.supplier_currency_risk_2",
    family: "general",
    label: "Tedarikçi Döviz Kuru Riski — VaR",
    fn: (inputs) => {
    const exposure = num(inputs, "exposure");
    const volatility = num(inputs, "volatility");
    const z = num(inputs, "z");
    const Score = num(inputs, "Score");
    const timeHorizon = num(inputs, "timeHorizon");
    return nonNegative(assertFinite(exposure * volatility * z_Score * Math.sqrt(timeHorizon)));
  },
  },
  {
    id: "user.supplier_currency_risk_3",
    family: "general",
    label: "Tedarikçi Döviz Kuru Riski — HedgingCost",
    fn: (inputs) => {
    const exposure = num(inputs, "exposure");
    const forwardRate = num(inputs, "forwardRate");
    const spotRate = num(inputs, "spotRate");
    return nonNegative(assertFinite(exposure * (forwardRate - spotRate)));
  },
  },
  {
    id: "user.supplier_currency_risk_4",
    family: "general",
    label: "Tedarikçi Döviz Kuru Riski — NetRiskCost",
    fn: (inputs) => {
    const expectedLoss = num(inputs, "expectedLoss");
    const hedgingCost = num(inputs, "hedgingCost");
    return nonNegative(assertFinite(expectedLoss + hedgingCost));
  },
  },
  {
    id: "user.supplier_currency_risk_5",
    family: "general",
    label: "Tedarikçi Döviz Kuru Riski — CurrencyClauseSavings",
    fn: (inputs) => {
    const contractHasAdjustment = num(inputs, "contractHasAdjustment");
    const exposure = num(inputs, "exposure");
    const adjustmentFactor = num(inputs, "adjustmentFactor");
    return nonNegative(assertFinite(((contractHasAdjustment) ? (exposure * adjustmentFactor) : (0))));
  },
  },

  // ── Teklif Risk Analizörü (6 formulas) ──
  {
    id: "user.bid_risk_0",
    family: "general",
    label: "Teklif Risk Analizörü — BaseEstimate",
    fn: (inputs) => {
    const directCosts = num(inputs, "directCosts");
    const overhead = num(inputs, "overhead");
    return nonNegative(assertFinite(SUM(directCosts) + overhead));
  },
  },
  {
    id: "user.bid_risk_1",
    family: "general",
    label: "Teklif Risk Analizörü — Contingency",
    fn: (inputs) => {
    const baseEstimate = num(inputs, "baseEstimate");
    const riskFactor = num(inputs, "riskFactor");
    return nonNegative(assertFinite(baseEstimate * riskFactor));
  },
  },
  {
    id: "user.bid_risk_2",
    family: "general",
    label: "Teklif Risk Analizörü — ExpectedMargin",
    fn: (inputs) => {
    const bidPrice = num(inputs, "bidPrice");
    const baseEstimate = num(inputs, "baseEstimate");
    const contingency = num(inputs, "contingency");
    return nonNegative(assertFinite((bidPrice - (baseEstimate + contingency)) / bidPrice));
  },
  },
  {
    id: "user.bid_risk_3",
    family: "general",
    label: "Teklif Risk Analizörü — WinProbability",
    fn: (inputs) => {
    const f = num(inputs, "f");
    const bidPrice = num(inputs, "bidPrice");
    const competitorIndex = num(inputs, "competitorIndex");
    const historicalWinRate = num(inputs, "historicalWinRate");
    return nonNegative(assertFinite(f(bidPrice, competitorIndex, historicalWinRate)));
  },
  },
  {
    id: "user.bid_risk_4",
    family: "general",
    label: "Teklif Risk Analizörü — ExpectedValue",
    fn: (inputs) => {
    const winProbability = num(inputs, "winProbability");
    const expectedMargin = num(inputs, "expectedMargin");
    const bidPrice = num(inputs, "bidPrice");
    return nonNegative(assertFinite(winProbability * expectedMargin * bidPrice));
  },
  },
  {
    id: "user.bid_risk_5",
    family: "general",
    label: "Teklif Risk Analizörü — RiskAdjustedBid",
    fn: (inputs) => {
    const baseEstimate = num(inputs, "baseEstimate");
    const targetMargin = num(inputs, "targetMargin");
    const riskPremium = num(inputs, "riskPremium");
    return nonNegative(assertFinite(baseEstimate / (1 - targetMargin - riskPremium)));
  },
  },

  // ── Tekrarlayan Maliyet (RCA) (6 formulas) ──
  {
    id: "user.recurring_cost_0",
    family: "general",
    label: "Tekrarlayan Maliyet (RCA) — RecurringCost_Annual",
    fn: (inputs) => {
    const frequency = num(inputs, "frequency");
    const costPerEvent = num(inputs, "costPerEvent");
    return nonNegative(assertFinite(frequency * costPerEvent));
  },
  },
  {
    id: "user.recurring_cost_1",
    family: "general",
    label: "Tekrarlayan Maliyet (RCA) — PresentValue_Recurring",
    fn: (inputs) => {
    const recurringCost = num(inputs, "recurringCost");
    const Annual = num(inputs, "Annual");
    const r = num(inputs, "r");
    const n = num(inputs, "n");
    return nonNegative(assertFinite(recurringCost_Annual * ((1 - (1+r)**-n) / r)));
  },
  },
  {
    id: "user.recurring_cost_2",
    family: "general",
    label: "Tekrarlayan Maliyet (RCA) — RootCauseInvestment",
    fn: (inputs) => {
    const correctiveActionCost = num(inputs, "correctiveActionCost");
    const implementationCost = num(inputs, "implementationCost");
    return nonNegative(assertFinite(correctiveActionCost + implementationCost));
  },
  },
  {
    id: "user.recurring_cost_3",
    family: "general",
    label: "Tekrarlayan Maliyet (RCA) — PaybackPeriod",
    fn: (inputs) => {
    const rootCauseInvestment = num(inputs, "rootCauseInvestment");
    const recurringCost = num(inputs, "recurringCost");
    const Annual = num(inputs, "Annual");
    return nonNegative(assertFinite(rootCauseInvestment / recurringCost_Annual));
  },
  },
  {
    id: "user.recurring_cost_4",
    family: "general",
    label: "Tekrarlayan Maliyet (RCA) — NPV_Elimination",
    fn: (inputs) => {
    const presentValue = num(inputs, "presentValue");
    const Recurring = num(inputs, "Recurring");
    const rootCauseInvestment = num(inputs, "rootCauseInvestment");
    return nonNegative(assertFinite(presentValue_Recurring - rootCauseInvestment));
  },
  },
  {
    id: "user.recurring_cost_5",
    family: "general",
    label: "Tekrarlayan Maliyet (RCA) — BreakevenFrequency",
    fn: (inputs) => {
    const rootCauseInvestment = num(inputs, "rootCauseInvestment");
    const costPerEvent = num(inputs, "costPerEvent");
    return nonNegative(assertFinite(rootCauseInvestment / costPerEvent));
  },
  },

  // ── Tekstil Atığı Risk Değerlendirmesi (7 formulas) ──
  {
    id: "user.textile_waste_risk_0",
    family: "general",
    label: "Tekstil Atığı Risk Değerlendirmesi — WasteRate",
    fn: (inputs) => {
    const inputFabric = num(inputs, "inputFabric");
    const outputGarments = num(inputs, "outputGarments");
    return nonNegative(assertFinite((inputFabric - outputGarments) / inputFabric));
  },
  },
  {
    id: "user.textile_waste_risk_1",
    family: "general",
    label: "Tekstil Atığı Risk Değerlendirmesi — PreConsumerWaste",
    fn: (inputs) => {
    const cuttingScrap = num(inputs, "cuttingScrap");
    const sewingDefects = num(inputs, "sewingDefects");
    const dyeingRework = num(inputs, "dyeingRework");
    return nonNegative(assertFinite(cuttingScrap + sewingDefects + dyeingRework));
  },
  },
  {
    id: "user.textile_waste_risk_2",
    family: "general",
    label: "Tekstil Atığı Risk Değerlendirmesi — FinancialLoss",
    fn: (inputs) => {
    const preConsumerWaste = num(inputs, "preConsumerWaste");
    const fabricCostPerKg = num(inputs, "fabricCostPerKg");
    const processingCost = num(inputs, "processingCost");
    return nonNegative(assertFinite(preConsumerWaste * fabricCostPerKg + processingCost));
  },
  },
  {
    id: "user.textile_waste_risk_3",
    family: "general",
    label: "Tekstil Atığı Risk Değerlendirmesi — DisposalCost",
    fn: (inputs) => {
    const wasteWeight = num(inputs, "wasteWeight");
    const landfillFee = num(inputs, "landfillFee");
    return nonNegative(assertFinite(wasteWeight * landfillFee));
  },
  },
  {
    id: "user.textile_waste_risk_4",
    family: "general",
    label: "Tekstil Atığı Risk Değerlendirmesi — CircularRevenue",
    fn: (inputs) => {
    const recycledWasteWeight = num(inputs, "recycledWasteWeight");
    const scrapValue = num(inputs, "scrapValue");
    return nonNegative(assertFinite(recycledWasteWeight * scrapValue));
  },
  },
  {
    id: "user.textile_waste_risk_5",
    family: "general",
    label: "Tekstil Atığı Risk Değerlendirmesi — NetWasteCost",
    fn: (inputs) => {
    const financialLoss = num(inputs, "financialLoss");
    const disposalCost = num(inputs, "disposalCost");
    const circularRevenue = num(inputs, "circularRevenue");
    return nonNegative(assertFinite(financialLoss + disposalCost - circularRevenue));
  },
  },
  {
    id: "user.textile_waste_risk_6",
    family: "general",
    label: "Tekstil Atığı Risk Değerlendirmesi — RiskScore",
    fn: (inputs) => {
    const netWasteCost = num(inputs, "netWasteCost");
    const totalRevenue = num(inputs, "totalRevenue");
    return nonNegative(assertFinite(netWasteCost / totalRevenue));
  },
  },

  // ── Temizlik Teklifi Optimize Edici (7 formulas) ──
  {
    id: "user.cleaning_bid_optimizer_0",
    family: "general",
    label: "Temizlik Teklifi Optimize Edici — AreaToClean",
    fn: (inputs) => {
    const totalSqM = num(inputs, "totalSqM");
    const cleanablePct = num(inputs, "cleanablePct");
    return nonNegative(assertFinite(totalSqM * cleanablePct));
  },
  },
  {
    id: "user.cleaning_bid_optimizer_1",
    family: "general",
    label: "Temizlik Teklifi Optimize Edici — LaborHours",
    fn: (inputs) => {
    const areaToClean = num(inputs, "areaToClean");
    const productionRatePerHour = num(inputs, "productionRatePerHour");
    return nonNegative(assertFinite(areaToClean / productionRatePerHour));
  },
  },
  {
    id: "user.cleaning_bid_optimizer_2",
    family: "general",
    label: "Temizlik Teklifi Optimize Edici — LaborCost",
    fn: (inputs) => {
    const laborHours = num(inputs, "laborHours");
    const hourlyWage = num(inputs, "hourlyWage");
    const burden = num(inputs, "burden");
    return nonNegative(assertFinite(laborHours * hourlyWage * (1 + burden)));
  },
  },
  {
    id: "user.cleaning_bid_optimizer_3",
    family: "general",
    label: "Temizlik Teklifi Optimize Edici — MaterialCost",
    fn: (inputs) => {
    const areaToClean = num(inputs, "areaToClean");
    const consumableCostPerSqM = num(inputs, "consumableCostPerSqM");
    return nonNegative(assertFinite(areaToClean * consumableCostPerSqM));
  },
  },
  {
    id: "user.cleaning_bid_optimizer_4",
    family: "general",
    label: "Temizlik Teklifi Optimize Edici — EquipmentCost",
    fn: (inputs) => {
    const machineHours = num(inputs, "machineHours");
    const depreciationRate = num(inputs, "depreciationRate");
    return nonNegative(assertFinite(machineHours * depreciationRate));
  },
  },
  {
    id: "user.cleaning_bid_optimizer_5",
    family: "general",
    label: "Temizlik Teklifi Optimize Edici — Overhead",
    fn: (inputs) => {
    const laborCost = num(inputs, "laborCost");
    const materialCost = num(inputs, "materialCost");
    const overheadPct = num(inputs, "overheadPct");
    return nonNegative(assertFinite((laborCost + materialCost) * overheadPct));
  },
  },
  {
    id: "user.cleaning_bid_optimizer_6",
    family: "general",
    label: "Temizlik Teklifi Optimize Edici — BidPrice",
    fn: (inputs) => {
    const laborCost = num(inputs, "laborCost");
    const materialCost = num(inputs, "materialCost");
    const equipmentCost = num(inputs, "equipmentCost");
    const overhead = num(inputs, "overhead");
    const targetMargin = num(inputs, "targetMargin");
    return nonNegative(assertFinite((laborCost + materialCost + equipmentCost + overhead) / (1 - targetMargin)));
  },
  },

  // ── Teslimat Maliyeti (6 formulas) ──
  {
    id: "user.delivery_cost_0",
    family: "general",
    label: "Teslimat Maliyeti — CostPerDrop",
    fn: (inputs) => {
    const totalRouteCost = num(inputs, "totalRouteCost");
    const numberOfDrops = num(inputs, "numberOfDrops");
    return nonNegative(assertFinite(totalRouteCost / numberOfDrops));
  },
  },
  {
    id: "user.delivery_cost_1",
    family: "general",
    label: "Teslimat Maliyeti — CostPerKm",
    fn: (inputs) => {
    const totalRouteCost = num(inputs, "totalRouteCost");
    const totalDistance = num(inputs, "totalDistance");
    return nonNegative(assertFinite(totalRouteCost / totalDistance));
  },
  },
  {
    id: "user.delivery_cost_2",
    family: "general",
    label: "Teslimat Maliyeti — FailedDeliveryCost",
    fn: (inputs) => {
    const failedDrops = num(inputs, "failedDrops");
    const returnFreight = num(inputs, "returnFreight");
    const restockingFee = num(inputs, "restockingFee");
    const adminCost = num(inputs, "adminCost");
    return nonNegative(assertFinite(failedDrops * (returnFreight + restockingFee + adminCost)));
  },
  },
  {
    id: "user.delivery_cost_3",
    family: "general",
    label: "Teslimat Maliyeti — FuelSurcharge",
    fn: (inputs) => {
    const baseFreight = num(inputs, "baseFreight");
    const fuelIndexPct = num(inputs, "fuelIndexPct");
    return nonNegative(assertFinite(baseFreight * fuelIndexPct));
  },
  },
  {
    id: "user.delivery_cost_4",
    family: "general",
    label: "Teslimat Maliyeti — TotalDeliveryCost",
    fn: (inputs) => {
    const linehaul = num(inputs, "linehaul");
    const lastMile = num(inputs, "lastMile");
    const failedDeliveryCost = num(inputs, "failedDeliveryCost");
    const surcharges = num(inputs, "surcharges");
    return nonNegative(assertFinite(linehaul + lastMile + failedDeliveryCost + surcharges));
  },
  },
  {
    id: "user.delivery_cost_5",
    family: "general",
    label: "Teslimat Maliyeti — DeliveryEfficiency",
    fn: (inputs) => {
    const successfulDrops = num(inputs, "successfulDrops");
    const totalPlannedDrops = num(inputs, "totalPlannedDrops");
    return nonNegative(assertFinite(successfulDrops / totalPlannedDrops));
  },
  },

  // ── Tohum Oranı (7 formulas) ──
  {
    id: "user.seed_rate_0",
    family: "general",
    label: "Tohum Oranı — TargetPlantPopulation",
    fn: (inputs) => {
    const area = num(inputs, "area");
    const desiredPlantsPerSqm = num(inputs, "desiredPlantsPerSqm");
    return nonNegative(assertFinite(area * desiredPlantsPerSqm));
  },
  },
  {
    id: "user.seed_rate_1",
    family: "general",
    label: "Tohum Oranı — SeedRequirement",
    fn: (inputs) => {
    const targetPlantPopulation = num(inputs, "targetPlantPopulation");
    const germinationRate = num(inputs, "germinationRate");
    const fieldEmergenceRate = num(inputs, "fieldEmergenceRate");
    return nonNegative(assertFinite(targetPlantPopulation / (germinationRate * fieldEmergenceRate)));
  },
  },
  {
    id: "user.seed_rate_2",
    family: "general",
    label: "Tohum Oranı — SeedCost",
    fn: (inputs) => {
    const seedRequirement = num(inputs, "seedRequirement");
    const pricePerKg = num(inputs, "pricePerKg");
    return nonNegative(assertFinite(seedRequirement * pricePerKg));
  },
  },
  {
    id: "user.seed_rate_3",
    family: "general",
    label: "Tohum Oranı — OptimalYield",
    fn: (inputs) => {
    const f = num(inputs, "f");
    const plantPopulation = num(inputs, "plantPopulation");
    const soilFertility = num(inputs, "soilFertility");
    const water = num(inputs, "water");
    return nonNegative(assertFinite(f(plantPopulation, soilFertility, water)));
  },
  },
  {
    id: "user.seed_rate_4",
    family: "general",
    label: "Tohum Oranı — FinancialLoss_Under",
    fn: (inputs) => {
    const targetYield = num(inputs, "targetYield");
    const actualYield = num(inputs, "actualYield");
    const cropPrice = num(inputs, "cropPrice");
    return nonNegative(assertFinite((targetYield - actualYield) * cropPrice));
  },
  },
  {
    id: "user.seed_rate_5",
    family: "general",
    label: "Tohum Oranı — FinancialLoss_Over",
    fn: (inputs) => {
    const actualSeed = num(inputs, "actualSeed");
    const optimalSeed = num(inputs, "optimalSeed");
    const seedCost = num(inputs, "seedCost");
    return nonNegative(assertFinite((actualSeed - optimalSeed) * seedCost));
  },
  },
  {
    id: "user.seed_rate_6",
    family: "general",
    label: "Tohum Oranı — ROI_Seed",
    fn: (inputs) => {
    const optimalYield = num(inputs, "optimalYield");
    const cropPrice = num(inputs, "cropPrice");
    const seedCost = num(inputs, "seedCost");
    return nonNegative(assertFinite((optimalYield * cropPrice - seedCost) / seedCost));
  },
  },

  // ── Toplam Çalışan Maliyeti (7 formulas) ──
  {
    id: "user.total_employee_cost_0",
    family: "general",
    label: "Toplam Çalışan Maliyeti — GrossSalary",
    fn: (inputs) => {
    const basePay = num(inputs, "basePay");
    const bonuses = num(inputs, "bonuses");
    const overtime = num(inputs, "overtime");
    return nonNegative(assertFinite(basePay + bonuses + overtime));
  },
  },
  {
    id: "user.total_employee_cost_1",
    family: "general",
    label: "Toplam Çalışan Maliyeti — StatutoryCosts",
    fn: (inputs) => {
    const grossSalary = num(inputs, "grossSalary");
    const socialSecurity = num(inputs, "socialSecurity");
    const unemployment = num(inputs, "unemployment");
    const taxes = num(inputs, "taxes");
    return nonNegative(assertFinite(grossSalary * (socialSecurity + unemployment + taxes)));
  },
  },
  {
    id: "user.total_employee_cost_2",
    family: "general",
    label: "Toplam Çalışan Maliyeti — Benefits",
    fn: (inputs) => {
    const healthInsurance = num(inputs, "healthInsurance");
    const retirement = num(inputs, "retirement");
    const meals = num(inputs, "meals");
    const transport = num(inputs, "transport");
    return nonNegative(assertFinite(healthInsurance + retirement + meals + transport));
  },
  },
  {
    id: "user.total_employee_cost_3",
    family: "general",
    label: "Toplam Çalışan Maliyeti — AbsenteeismCost",
    fn: (inputs) => {
    const absentHours = num(inputs, "absentHours");
    const fullyBurdenedRate = num(inputs, "fullyBurdenedRate");
    return nonNegative(assertFinite(absentHours * fullyBurdenedRate));
  },
  },
  {
    id: "user.total_employee_cost_4",
    family: "general",
    label: "Toplam Çalışan Maliyeti — TurnoverCost",
    fn: (inputs) => {
    const recruitment = num(inputs, "recruitment");
    const training = num(inputs, "training");
    const turnoverRate = num(inputs, "turnoverRate");
    return nonNegative(assertFinite((recruitment + training) * turnoverRate));
  },
  },
  {
    id: "user.total_employee_cost_5",
    family: "general",
    label: "Toplam Çalışan Maliyeti — TotalEmployeeCost",
    fn: (inputs) => {
    const grossSalary = num(inputs, "grossSalary");
    const statutoryCosts = num(inputs, "statutoryCosts");
    const benefits = num(inputs, "benefits");
    const absenteeismCost = num(inputs, "absenteeismCost");
    const turnoverCost = num(inputs, "turnoverCost");
    return nonNegative(assertFinite(grossSalary + statutoryCosts + benefits + absenteeismCost + turnoverCost));
  },
  },
  {
    id: "user.total_employee_cost_6",
    family: "general",
    label: "Toplam Çalışan Maliyeti — CostPerHour",
    fn: (inputs) => {
    const totalEmployeeCost = num(inputs, "totalEmployeeCost");
    const productiveHours = num(inputs, "productiveHours");
    return nonNegative(assertFinite(totalEmployeeCost / productiveHours));
  },
  },

  // ── Transfer Fiyatlandırması Optimize Edici (6 formulas) ──
  {
    id: "user.transfer_pricing_optimizer_0",
    family: "general",
    label: "Transfer Fiyatlandırması Optimize Edici — CostPlusPrice",
    fn: (inputs) => {
    const fullCost = num(inputs, "fullCost");
    const markupPct = num(inputs, "markupPct");
    return nonNegative(assertFinite(fullCost * (1 + markupPct)));
  },
  },
  {
    id: "user.transfer_pricing_optimizer_1",
    family: "general",
    label: "Transfer Fiyatlandırması Optimize Edici — MarketBasedPrice",
    fn: (inputs) => {
    const comparableUncontrolledPrice = num(inputs, "comparableUncontrolledPrice");
    return nonNegative(assertFinite(comparableUncontrolledPrice));
  },
  },
  {
    id: "user.transfer_pricing_optimizer_2",
    family: "general",
    label: "Transfer Fiyatlandırması Optimize Edici — MarginalCost",
    fn: (inputs) => {
    const variableCost = num(inputs, "variableCost");
    const opportunityCost = num(inputs, "opportunityCost");
    return nonNegative(assertFinite(variableCost + opportunityCost));
  },
  },
  {
    id: "user.transfer_pricing_optimizer_3",
    family: "general",
    label: "Transfer Fiyatlandırması Optimize Edici — TaxImpact",
    fn: (inputs) => {
    const transferPrice = num(inputs, "transferPrice");
    const armLengthPrice = num(inputs, "armLengthPrice");
    const taxRate = num(inputs, "taxRate");
    const High = num(inputs, "High");
    const Low = num(inputs, "Low");
    return nonNegative(assertFinite((transferPrice - armLengthPrice) * (taxRate_High - taxRate_Low)));
  },
  },
  {
    id: "user.transfer_pricing_optimizer_4",
    family: "general",
    label: "Transfer Fiyatlandırması Optimize Edici — GlobalProfit",
    fn: (inputs) => {
    const revenue = num(inputs, "revenue");
    const Final = num(inputs, "Final");
    const cost = num(inputs, "cost");
    const Origin = num(inputs, "Origin");
    const Transfer = num(inputs, "Transfer");
    const taxImpact = num(inputs, "taxImpact");
    return nonNegative(assertFinite(revenue_Final - (cost_Origin + cost_Transfer + taxImpact)));
  },
  },
  {
    id: "user.transfer_pricing_optimizer_5",
    family: "general",
    label: "Transfer Fiyatlandırması Optimize Edici — OptimalTransferPrice",
    fn: (inputs) => {
    const price = num(inputs, "price");
    const that = num(inputs, "that");
    const mAXIMIZES = num(inputs, "mAXIMIZES");
    const globalProfit = num(inputs, "globalProfit");
    const subject = num(inputs, "subject");
    const to = num(inputs, "to");
    const taxRegulations = num(inputs, "taxRegulations");
    return nonNegative(assertFinite(price that mAXIMIZES globalProfit subject to taxRegulations));
  },
  },

  // ── ürün Complexity Hidden Maliyet (6 formulas) ──
  {
    id: "user.product_complexity_hidden_cost_0",
    family: "general",
    label: "ürün Complexity Hidden Maliyet — ComplexityIndex",
    fn: (inputs) => {
    const numberOfSKUs = num(inputs, "numberOfSKUs");
    const averageBOMDepth = num(inputs, "averageBOMDepth");
    return nonNegative(assertFinite(numberOfSKUs * averageBOMDepth));
  },
  },
  {
    id: "user.product_complexity_hidden_cost_1",
    family: "general",
    label: "ürün Complexity Hidden Maliyet — SetupCostComplexity",
    fn: (inputs) => {
    const changeovers = num(inputs, "changeovers");
    const setupCostPerChange = num(inputs, "setupCostPerChange");
    return nonNegative(assertFinite(changeovers * setupCostPerChange));
  },
  },
  {
    id: "user.product_complexity_hidden_cost_2",
    family: "general",
    label: "ürün Complexity Hidden Maliyet — InventoryCostComplexity",
    fn: (inputs) => {
    const safetyStock = num(inputs, "safetyStock");
    const AllSKUs = num(inputs, "AllSKUs");
    const holdingRate = num(inputs, "holdingRate");
    return nonNegative(assertFinite(safetyStock_AllSKUs * holdingRate));
  },
  },
  {
    id: "user.product_complexity_hidden_cost_3",
    family: "general",
    label: "ürün Complexity Hidden Maliyet — OverheadAllocation",
    fn: (inputs) => {
    const totalIndirectCosts = num(inputs, "totalIndirectCosts");
    const complexityDriverPct = num(inputs, "complexityDriverPct");
    return nonNegative(assertFinite(totalIndirectCosts * complexityDriverPct));
  },
  },
  {
    id: "user.product_complexity_hidden_cost_4",
    family: "general",
    label: "ürün Complexity Hidden Maliyet — HiddenCost",
    fn: (inputs) => {
    const setupCostComplexity = num(inputs, "setupCostComplexity");
    const inventoryCostComplexity = num(inputs, "inventoryCostComplexity");
    const overheadAllocation = num(inputs, "overheadAllocation");
    const traditionalOverhead = num(inputs, "traditionalOverhead");
    return nonNegative(assertFinite(setupCostComplexity + inventoryCostComplexity + (overheadAllocation - traditionalOverhead)));
  },
  },
  {
    id: "user.product_complexity_hidden_cost_5",
    family: "general",
    label: "ürün Complexity Hidden Maliyet — ProfitabilityPerSKU",
    fn: (inputs) => {
    const revenue = num(inputs, "revenue");
    const directCost = num(inputs, "directCost");
    const hiddenCost = num(inputs, "hiddenCost");
    return nonNegative(assertFinite((revenue_SKU - directCost_SKU - hiddenCost_SKU)));
  },
  },

  // ── Vakum Kaçağı Enerji Kaybı (6 formulas) ──
  {
    id: "user.vacuum_leak_energy_0",
    family: "general",
    label: "Vakum Kaçağı Enerji Kaybı — LeakRate",
    fn: (inputs) => {
    const volume = num(inputs, "volume");
    const deltaP = num(inputs, "deltaP");
    const deltaT = num(inputs, "deltaT");
    return nonNegative(assertFinite(volume * deltaP / deltaT));
  },
  },
  {
    id: "user.vacuum_leak_energy_1",
    family: "general",
    label: "Vakum Kaçağı Enerji Kaybı — PowerLoss_kW",
    fn: (inputs) => {
    const leakRate = num(inputs, "leakRate");
    const p = num(inputs, "p");
    const Atmospheric = num(inputs, "Atmospheric");
    const pumpEff = num(inputs, "pumpEff");
    return nonNegative(assertFinite((leakRate * p_Atmospheric) / (pumpEff * 1000)));
  },
  },
  {
    id: "user.vacuum_leak_energy_2",
    family: "general",
    label: "Vakum Kaçağı Enerji Kaybı — AnnualEnergyLoss",
    fn: (inputs) => {
    const powerLoss = num(inputs, "powerLoss");
    const kW = num(inputs, "kW");
    const operatingHours = num(inputs, "operatingHours");
    return nonNegative(assertFinite(powerLoss_kW * operatingHours));
  },
  },
  {
    id: "user.vacuum_leak_energy_3",
    family: "general",
    label: "Vakum Kaçağı Enerji Kaybı — CostOfLeak",
    fn: (inputs) => {
    const annualEnergyLoss = num(inputs, "annualEnergyLoss");
    const elecRate = num(inputs, "elecRate");
    return nonNegative(assertFinite(annualEnergyLoss * elecRate));
  },
  },
  {
    id: "user.vacuum_leak_energy_4",
    family: "general",
    label: "Vakum Kaçağı Enerji Kaybı — PumpCapacityWaste",
    fn: (inputs) => {
    const leakRate = num(inputs, "leakRate");
    const totalPumpCapacity = num(inputs, "totalPumpCapacity");
    return nonNegative(assertFinite(leakRate / totalPumpCapacity));
  },
  },
  {
    id: "user.vacuum_leak_energy_5",
    family: "general",
    label: "Vakum Kaçağı Enerji Kaybı — CarbonEmissions",
    fn: (inputs) => {
    const annualEnergyLoss = num(inputs, "annualEnergyLoss");
    const gridEmissionFactor = num(inputs, "gridEmissionFactor");
    return nonNegative(assertFinite(annualEnergyLoss * gridEmissionFactor));
  },
  },

  // ── Vardiya Maliyet Verimliliği (7 formulas) ──
  {
    id: "user.shift_cost_efficiency_0",
    family: "general",
    label: "Vardiya Maliyet Verimliliği — PlannedProductionTime",
    fn: (inputs) => {
    const shiftDuration = num(inputs, "shiftDuration");
    const plannedDowntime = num(inputs, "plannedDowntime");
    return nonNegative(assertFinite(shiftDuration - plannedDowntime));
  },
  },
  {
    id: "user.shift_cost_efficiency_1",
    family: "general",
    label: "Vardiya Maliyet Verimliliği — ActualRunTime",
    fn: (inputs) => {
    const plannedProductionTime = num(inputs, "plannedProductionTime");
    const unplannedDowntime = num(inputs, "unplannedDowntime");
    return nonNegative(assertFinite(plannedProductionTime - unplannedDowntime));
  },
  },
  {
    id: "user.shift_cost_efficiency_2",
    family: "general",
    label: "Vardiya Maliyet Verimliliği — LaborCost",
    fn: (inputs) => {
    const operators = num(inputs, "operators");
    const shiftHours = num(inputs, "shiftHours");
    const hourlyRate = num(inputs, "hourlyRate");
    return nonNegative(assertFinite(operators * shiftHours * hourlyRate));
  },
  },
  {
    id: "user.shift_cost_efficiency_3",
    family: "general",
    label: "Vardiya Maliyet Verimliliği — EnergyCost",
    fn: (inputs) => {
    const machinePower = num(inputs, "machinePower");
    const actualRunTime = num(inputs, "actualRunTime");
    const elecRate = num(inputs, "elecRate");
    return nonNegative(assertFinite(machinePower * actualRunTime * elecRate));
  },
  },
  {
    id: "user.shift_cost_efficiency_4",
    family: "general",
    label: "Vardiya Maliyet Verimliliği — OutputValue",
    fn: (inputs) => {
    const goodUnits = num(inputs, "goodUnits");
    const unitContributionMargin = num(inputs, "unitContributionMargin");
    return nonNegative(assertFinite(goodUnits * unitContributionMargin));
  },
  },
  {
    id: "user.shift_cost_efficiency_5",
    family: "general",
    label: "Vardiya Maliyet Verimliliği — ShiftEfficiency",
    fn: (inputs) => {
    const outputValue = num(inputs, "outputValue");
    const laborCost = num(inputs, "laborCost");
    const energyCost = num(inputs, "energyCost");
    const overhead = num(inputs, "overhead");
    return nonNegative(assertFinite(outputValue / (laborCost + energyCost + overhead)));
  },
  },
  {
    id: "user.shift_cost_efficiency_6",
    family: "general",
    label: "Vardiya Maliyet Verimliliği — CostPerUnit",
    fn: (inputs) => {
    const laborCost = num(inputs, "laborCost");
    const energyCost = num(inputs, "energyCost");
    const overhead = num(inputs, "overhead");
    const goodUnits = num(inputs, "goodUnits");
    return nonNegative(assertFinite((laborCost + energyCost + overhead) / goodUnits));
  },
  },

  // ── Vsm finansal Dönüştürücü (6 formulas) ──
  {
    id: "user.vsm_financial_converter_0",
    family: "general",
    label: "Vsm finansal Dönüştürücü — LeadTimeCost",
    fn: (inputs) => {
    const wIP = num(inputs, "wIP");
    const Inventory = num(inputs, "Inventory");
    const dailyCarryingCost = num(inputs, "dailyCarryingCost");
    const totalLeadTimeDays = num(inputs, "totalLeadTimeDays");
    return nonNegative(assertFinite(wIP_Inventory * dailyCarryingCost * totalLeadTimeDays));
  },
  },
  {
    id: "user.vsm_financial_converter_1",
    family: "general",
    label: "Vsm finansal Dönüştürücü — ValueAddedRatio",
    fn: (inputs) => {
    const valueAddedTime = num(inputs, "valueAddedTime");
    const totalLeadTime = num(inputs, "totalLeadTime");
    return nonNegative(assertFinite(valueAddedTime / totalLeadTime));
  },
  },
  {
    id: "user.vsm_financial_converter_2",
    family: "general",
    label: "Vsm finansal Dönüştürücü — NonValueAddedCost",
    fn: (inputs) => {
    const totalLeadTime = num(inputs, "totalLeadTime");
    const valueAddedTime = num(inputs, "valueAddedTime");
    const costPerMinute = num(inputs, "costPerMinute");
    return nonNegative(assertFinite((totalLeadTime - valueAddedTime) * costPerMinute));
  },
  },
  {
    id: "user.vsm_financial_converter_3",
    family: "general",
    label: "Vsm finansal Dönüştürücü — InventoryReductionSavings",
    fn: (inputs) => {
    const oldWIP = num(inputs, "oldWIP");
    const newWIP = num(inputs, "newWIP");
    const carryingRate = num(inputs, "carryingRate");
    return nonNegative(assertFinite((oldWIP - newWIP) * carryingRate));
  },
  },
  {
    id: "user.vsm_financial_converter_4",
    family: "general",
    label: "Vsm finansal Dönüştürücü — ProductivityGain",
    fn: (inputs) => {
    const oldCycleTime = num(inputs, "oldCycleTime");
    const newCycleTime = num(inputs, "newCycleTime");
    const annualVolume = num(inputs, "annualVolume");
    const laborRate = num(inputs, "laborRate");
    return nonNegative(assertFinite((oldCycleTime - newCycleTime) * annualVolume * laborRate));
  },
  },
  {
    id: "user.vsm_financial_converter_5",
    family: "general",
    label: "Vsm finansal Dönüştürücü — TotalFinancialImpact",
    fn: (inputs) => {
    const inventoryReductionSavings = num(inputs, "inventoryReductionSavings");
    const productivityGain = num(inputs, "productivityGain");
    const qualityImprovementSavings = num(inputs, "qualityImprovementSavings");
    return nonNegative(assertFinite(inventoryReductionSavings + productivityGain + qualityImprovementSavings));
  },
  },

  // ── WPS Preheat Sıcaklık (5 formulas) ──
  {
    id: "user.wps_preheat_temperature_0",
    family: "general",
    label: "WPS Preheat Sıcaklık — CarbonEquivalent_CE",
    fn: (inputs) => {
    const c = num(inputs, "c");
    const mn = num(inputs, "mn");
    const cr = num(inputs, "cr");
    const mo = num(inputs, "mo");
    const v = num(inputs, "v");
    const ni = num(inputs, "ni");
    const cu = num(inputs, "cu");
    return nonNegative(assertFinite(c + (mn/6) + ((cr+mo+v)/5) + ((ni+cu)/15)));
  },
  },
  {
    id: "user.wps_preheat_temperature_1",
    family: "general",
    label: "WPS Preheat Sıcaklık — PreheatTemp",
    fn: (inputs) => {
    const f = num(inputs, "f");
    const cE = num(inputs, "cE");
    const thickness = num(inputs, "thickness");
    const hydrogenLevel = num(inputs, "hydrogenLevel");
    const heatInput = num(inputs, "heatInput");
    return nonNegative(assertFinite(f(cE, thickness, hydrogenLevel, heatInput)));
  },
  },
  {
    id: "user.wps_preheat_temperature_2",
    family: "general",
    label: "WPS Preheat Sıcaklık — CriticalCoolingTime",
    fn: (inputs) => {
    const t = num(inputs, "t");
    const thickness = num(inputs, "thickness");
    const heatInput = num(inputs, "heatInput");
    const constant = num(inputs, "constant");
    return nonNegative(assertFinite(t_8_5 = (thickness**2 / heatInput) * constant));
  },
  },
  {
    id: "user.wps_preheat_temperature_3",
    family: "general",
    label: "WPS Preheat Sıcaklık — HydrogenCrackingRisk",
    fn: (inputs) => {
    const preheatTemp = num(inputs, "preheatTemp");
    const requiredPreheat = num(inputs, "requiredPreheat");
    const hIGH = num(inputs, "hIGH");
    const lOW = num(inputs, "lOW");
    return nonNegative(assertFinite(((preheatTemp < requiredPreheat) ? ("hIGH") : ("lOW"))));
  },
  },
  {
    id: "user.wps_preheat_temperature_4",
    family: "general",
    label: "WPS Preheat Sıcaklık — EnergyCost",
    fn: (inputs) => {
    const mass = num(inputs, "mass");
    const specificHeat = num(inputs, "specificHeat");
    const preheatTemp = num(inputs, "preheatTemp");
    const ambientTemp = num(inputs, "ambientTemp");
    const heaterEfficiency = num(inputs, "heaterEfficiency");
    const energyPrice = num(inputs, "energyPrice");
    return nonNegative(assertFinite(mass * specificHeat * (preheatTemp - ambientTemp) / heaterEfficiency * energyPrice));
  },
  },

  // ── Yakıt Rota Sapma (7 formulas) ──
  {
    id: "user.fuel_route_drift_0",
    family: "general",
    label: "Yakıt Rota Sapma — PlannedFuel",
    fn: (inputs) => {
    const plannedDistance = num(inputs, "plannedDistance");
    const fuelEfficiency = num(inputs, "fuelEfficiency");
    return nonNegative(assertFinite(plannedDistance * fuelEfficiency));
  },
  },
  {
    id: "user.fuel_route_drift_1",
    family: "general",
    label: "Yakıt Rota Sapma — ActualFuel",
    fn: (inputs) => {
    const actualDistance = num(inputs, "actualDistance");
    const actualFuelEfficiency = num(inputs, "actualFuelEfficiency");
    return nonNegative(assertFinite(actualDistance * actualFuelEfficiency));
  },
  },
  {
    id: "user.fuel_route_drift_2",
    family: "general",
    label: "Yakıt Rota Sapma — RouteDrift",
    fn: (inputs) => {
    const actualDistance = num(inputs, "actualDistance");
    const plannedDistance = num(inputs, "plannedDistance");
    return nonNegative(assertFinite(actualDistance - plannedDistance));
  },
  },
  {
    id: "user.fuel_route_drift_3",
    family: "general",
    label: "Yakıt Rota Sapma — FuelWaste_Distance",
    fn: (inputs) => {
    const routeDrift = num(inputs, "routeDrift");
    const fuelEfficiency = num(inputs, "fuelEfficiency");
    const fuelPrice = num(inputs, "fuelPrice");
    return nonNegative(assertFinite(routeDrift * fuelEfficiency * fuelPrice));
  },
  },
  {
    id: "user.fuel_route_drift_4",
    family: "general",
    label: "Yakıt Rota Sapma — FuelWaste_Efficiency",
    fn: (inputs) => {
    const plannedDistance = num(inputs, "plannedDistance");
    const actualFuelEfficiency = num(inputs, "actualFuelEfficiency");
    const fuelEfficiency = num(inputs, "fuelEfficiency");
    const fuelPrice = num(inputs, "fuelPrice");
    return nonNegative(assertFinite(plannedDistance * (actualFuelEfficiency - fuelEfficiency) * fuelPrice));
  },
  },
  {
    id: "user.fuel_route_drift_5",
    family: "general",
    label: "Yakıt Rota Sapma — IdleFuelCost",
    fn: (inputs) => {
    const idleTime = num(inputs, "idleTime");
    const idleConsumptionRate = num(inputs, "idleConsumptionRate");
    const fuelPrice = num(inputs, "fuelPrice");
    return nonNegative(assertFinite(idleTime * idleConsumptionRate * fuelPrice));
  },
  },
  {
    id: "user.fuel_route_drift_6",
    family: "general",
    label: "Yakıt Rota Sapma — TotalDriftCost",
    fn: (inputs) => {
    const fuelWaste = num(inputs, "fuelWaste");
    const Distance = num(inputs, "Distance");
    const Efficiency = num(inputs, "Efficiency");
    const idleFuelCost = num(inputs, "idleFuelCost");
    return nonNegative(assertFinite(fuelWaste_Distance + fuelWaste_Efficiency + idleFuelCost));
  },
  },

  // ── Yangın Hidrantı Akış (6 formulas) ──
  {
    id: "user.fire_hydrant_flow_0",
    family: "general",
    label: "Yangın Hidrantı Akış — FlowRate_Q",
    fn: (inputs) => {
    const c = num(inputs, "c");
    const d = num(inputs, "d");
    const p = num(inputs, "p");
    const Pitot = num(inputs, "Pitot");
    return nonNegative(assertFinite(29.83 * c_d * d**2 * Math.sqrt(p_Pitot)));
  },
  },
  {
    id: "user.fire_hydrant_flow_1",
    family: "general",
    label: "Yangın Hidrantı Akış — ResidualPressure",
    fn: (inputs) => {
    const p = num(inputs, "p");
    const Static = num(inputs, "Static");
    const flowRate = num(inputs, "flowRate");
    const coefficient = num(inputs, "coefficient");
    return nonNegative(assertFinite(p_Static - (flowRate_Q / coefficient)**1.85));
  },
  },
  {
    id: "user.fire_hydrant_flow_2",
    family: "general",
    label: "Yangın Hidrantı Akış — AvailableFlow_At20psi",
    fn: (inputs) => {
    const flowRate = num(inputs, "flowRate");
    const p = num(inputs, "p");
    const Static = num(inputs, "Static");
    const Residual = num(inputs, "Residual");
    return nonNegative(assertFinite(flowRate_Q * ((p_Static - 20) / (p_Static - p_Residual))**0.54));
  },
  },
  {
    id: "user.fire_hydrant_flow_3",
    family: "general",
    label: "Yangın Hidrantı Akış — FrictionLoss",
    fn: (inputs) => {
    const f = num(inputs, "f");
    const length = num(inputs, "length");
    const diameter = num(inputs, "diameter");
    const velocity = num(inputs, "velocity");
    const g = num(inputs, "g");
    return nonNegative(assertFinite(f * (length / diameter) * (velocity**2 / 2g)));
  },
  },
  {
    id: "user.fire_hydrant_flow_4",
    family: "general",
    label: "Yangın Hidrantı Akış — RequiredPumpHead",
    fn: (inputs) => {
    const elevationHead = num(inputs, "elevationHead");
    const frictionLoss = num(inputs, "frictionLoss");
    const nozzlePressure = num(inputs, "nozzlePressure");
    return nonNegative(assertFinite(elevationHead + frictionLoss + nozzlePressure));
  },
  },
  {
    id: "user.fire_hydrant_flow_5",
    family: "general",
    label: "Yangın Hidrantı Akış — Compliance",
    fn: (inputs) => {
    const availableFlow = num(inputs, "availableFlow");
    const At20psi = num(inputs, "At20psi");
    const requiredFlow = num(inputs, "requiredFlow");
    const pASS = num(inputs, "pASS");
    const fAIL = num(inputs, "fAIL");
    return nonNegative(assertFinite(((availableFlow_At20psi > requiredFlow) ? ("pASS") : ("fAIL"))));
  },
  },

  // ── Yenileme Bütçesi Optimize Edici (6 formulas) ──
  {
    id: "user.renovation_budget_optimizer_0",
    family: "general",
    label: "Yenileme Bütçesi Optimize Edici — BaseCost",
    fn: (inputs) => {
    const area = num(inputs, "area");
    const costPerSqM = num(inputs, "costPerSqM");
    const ByComplexity = num(inputs, "ByComplexity");
    return nonNegative(assertFinite(area * costPerSqM_ByComplexity));
  },
  },
  {
    id: "user.renovation_budget_optimizer_1",
    family: "general",
    label: "Yenileme Bütçesi Optimize Edici — Escalation",
    fn: (inputs) => {
    const baseCost = num(inputs, "baseCost");
    const inflationRate = num(inputs, "inflationRate");
    const projectDuration = num(inputs, "projectDuration");
    return nonNegative(assertFinite(baseCost * ((1 + inflationRate)**projectDuration - 1)));
  },
  },
  {
    id: "user.renovation_budget_optimizer_2",
    family: "general",
    label: "Yenileme Bütçesi Optimize Edici — Contingency",
    fn: (inputs) => {
    const baseCost = num(inputs, "baseCost");
    const escalation = num(inputs, "escalation");
    const riskFactor = num(inputs, "riskFactor");
    return nonNegative(assertFinite((baseCost + escalation) * riskFactor));
  },
  },
  {
    id: "user.renovation_budget_optimizer_3",
    family: "general",
    label: "Yenileme Bütçesi Optimize Edici — SoftCosts",
    fn: (inputs) => {
    const baseCost = num(inputs, "baseCost");
    const escalation = num(inputs, "escalation");
    const designFeePct = num(inputs, "designFeePct");
    const permitFeePct = num(inputs, "permitFeePct");
    return nonNegative(assertFinite((baseCost + escalation) * (designFeePct + permitFeePct)));
  },
  },
  {
    id: "user.renovation_budget_optimizer_4",
    family: "general",
    label: "Yenileme Bütçesi Optimize Edici — TotalBudget",
    fn: (inputs) => {
    const baseCost = num(inputs, "baseCost");
    const escalation = num(inputs, "escalation");
    const contingency = num(inputs, "contingency");
    const softCosts = num(inputs, "softCosts");
    const fF = num(inputs, "fF");
    return nonNegative(assertFinite(baseCost + escalation + contingency + softCosts + fF_E));
  },
  },
  {
    id: "user.renovation_budget_optimizer_5",
    family: "general",
    label: "Yenileme Bütçesi Optimize Edici — ROI_Renovation",
    fn: (inputs) => {
    const newPropertyValue = num(inputs, "newPropertyValue");
    const oldPropertyValue = num(inputs, "oldPropertyValue");
    const totalBudget = num(inputs, "totalBudget");
    return nonNegative(assertFinite((newPropertyValue - oldPropertyValue - totalBudget) / totalBudget));
  },
  },

  // ── Yenilenebilir Enerji YG (7 formulas) ──
  {
    id: "user.renewable_energy_irr_0",
    family: "general",
    label: "Yenilenebilir Enerji YG — AnnualGeneration",
    fn: (inputs) => {
    const systemCapacity = num(inputs, "systemCapacity");
    const capacityFactor = num(inputs, "capacityFactor");
    return nonNegative(assertFinite(systemCapacity * capacityFactor * 8760));
  },
  },
  {
    id: "user.renewable_energy_irr_1",
    family: "general",
    label: "Yenilenebilir Enerji YG — AnnualSavings",
    fn: (inputs) => {
    const annualGeneration = num(inputs, "annualGeneration");
    const gridElectricityRate = num(inputs, "gridElectricityRate");
    return nonNegative(assertFinite(annualGeneration * gridElectricityRate));
  },
  },
  {
    id: "user.renewable_energy_irr_2",
    family: "general",
    label: "Yenilenebilir Enerji YG — AnnualOPEX",
    fn: (inputs) => {
    const maintenance = num(inputs, "maintenance");
    const insurance = num(inputs, "insurance");
    const inverterReplacementFund = num(inputs, "inverterReplacementFund");
    return nonNegative(assertFinite(maintenance + insurance + inverterReplacementFund));
  },
  },
  {
    id: "user.renewable_energy_irr_3",
    family: "general",
    label: "Yenilenebilir Enerji YG — NetCashFlow",
    fn: (inputs) => {
    const annualSavings = num(inputs, "annualSavings");
    const annualOPEX = num(inputs, "annualOPEX");
    const incentives = num(inputs, "incentives");
    return nonNegative(assertFinite(annualSavings - annualOPEX + incentives));
  },
  },
  {
    id: "user.renewable_energy_irr_4",
    family: "general",
    label: "Yenilenebilir Enerji YG — PaybackPeriod",
    fn: (inputs) => {
    const totalCapex = num(inputs, "totalCapex");
    const netCashFlow = num(inputs, "netCashFlow");
    return nonNegative(assertFinite(totalCapex / netCashFlow));
  },
  },
  {
    id: "user.renewable_energy_irr_5",
    family: "general",
    label: "Yenilenebilir Enerji YG — LCOE",
    fn: (inputs) => {
    const totalCapex = num(inputs, "totalCapex");
    const oPEX = num(inputs, "oPEX");
    const t = num(inputs, "t");
    const r = num(inputs, "r");
    const generation = num(inputs, "generation");
    return nonNegative(assertFinite((totalCapex + SUM(oPEX_t / (1+r)**t)) / SUM(generation_t / (1+r)**t)));
  },
  },
  {
    id: "user.renewable_energy_irr_6",
    family: "general",
    label: "Yenilenebilir Enerji YG — NPV",
    fn: (inputs) => {
    const netCashFlow = num(inputs, "netCashFlow");
    const t = num(inputs, "t");
    const wACC = num(inputs, "wACC");
    const totalCapex = num(inputs, "totalCapex");
    return nonNegative(assertFinite(SUM(netCashFlow_t / (1+wACC)**t) - totalCapex));
  },
  },

  // ── YG ve NBD (6 formulas) ──
  {
    id: "user.roi_npv_0",
    family: "general",
    label: "YG ve NBD — ROI",
    fn: (inputs) => {
    const totalNetProfit = num(inputs, "totalNetProfit");
    const totalInvestment = num(inputs, "totalInvestment");
    return nonNegative(assertFinite((totalNetProfit / totalInvestment) * 100));
  },
  },
  {
    id: "user.roi_npv_1",
    family: "general",
    label: "YG ve NBD — NPV",
    fn: (inputs) => {
    const cashFlow = num(inputs, "cashFlow");
    const t = num(inputs, "t");
    const discountRate = num(inputs, "discountRate");
    const initialInvestment = num(inputs, "initialInvestment");
    return nonNegative(assertFinite(SUM(cashFlow_t / (1 + discountRate)**t) - initialInvestment));
  },
  },
  {
    id: "user.roi_npv_2",
    family: "general",
    label: "YG ve NBD — IRR",
    fn: (inputs) => {
    const rate = num(inputs, "rate");
    const where = num(inputs, "where");
    const nPV = num(inputs, "nPV");
    return nonNegative(assertFinite(rate where nPV = 0));
  },
  },
  {
    id: "user.roi_npv_3",
    family: "general",
    label: "YG ve NBD — PaybackPeriod",
    fn: (inputs) => {
    const year = num(inputs, "year");
    const before = num(inputs, "before");
    const full = num(inputs, "full");
    const recovery = num(inputs, "recovery");
    const unrecoveredCost = num(inputs, "unrecoveredCost");
    const cashFlow = num(inputs, "cashFlow");
    const RecoveryYear = num(inputs, "RecoveryYear");
    return nonNegative(assertFinite(year before full recovery + (unrecoveredCost / cashFlow_RecoveryYear)));
  },
  },
  {
    id: "user.roi_npv_4",
    family: "general",
    label: "YG ve NBD — ProfitabilityIndex",
    fn: (inputs) => {
    const pV = num(inputs, "pV");
    const FutureCashFlows = num(inputs, "FutureCashFlows");
    const initialInvestment = num(inputs, "initialInvestment");
    return nonNegative(assertFinite(pV_FutureCashFlows / initialInvestment));
  },
  },
  {
    id: "user.roi_npv_5",
    family: "general",
    label: "YG ve NBD — DiscountedPayback",
    fn: (inputs) => {
    const year = num(inputs, "year");
    const where = num(inputs, "where");
    const cumulativeDiscountedCashFlow = num(inputs, "cumulativeDiscountedCashFlow");
    return nonNegative(assertFinite(year where cumulativeDiscountedCashFlow > 0));
  },
  },

  // ── Zaman Etüdü Analizörü (7 formulas) ──
  {
    id: "user.standard_time_work_study_0",
    family: "general",
    label: "Zaman Etüdü Analizörü — ObservedTime",
    fn: (inputs) => {
    const cycleTimes = num(inputs, "cycleTimes");
    const numberOfCycles = num(inputs, "numberOfCycles");
    return nonNegative(assertFinite(SUM(cycleTimes) / numberOfCycles));
  },
  },
  {
    id: "user.standard_time_work_study_1",
    family: "general",
    label: "Zaman Etüdü Analizörü — NormalTime",
    fn: (inputs) => {
    const observedTime = num(inputs, "observedTime");
    const performanceRating = num(inputs, "performanceRating");
    return nonNegative(assertFinite(observedTime * performanceRating));
  },
  },
  {
    id: "user.standard_time_work_study_2",
    family: "general",
    label: "Zaman Etüdü Analizörü — AllowancePct",
    fn: (inputs) => {
    const personal = num(inputs, "personal");
    const fatigue = num(inputs, "fatigue");
    const delay = num(inputs, "delay");
    return nonNegative(assertFinite(personal + fatigue + delay));
  },
  },
  {
    id: "user.standard_time_work_study_3",
    family: "general",
    label: "Zaman Etüdü Analizörü — StandardTime",
    fn: (inputs) => {
    const normalTime = num(inputs, "normalTime");
    const allowancePct = num(inputs, "allowancePct");
    return nonNegative(assertFinite(normalTime * (1 + allowancePct)));
  },
  },
  {
    id: "user.standard_time_work_study_4",
    family: "general",
    label: "Zaman Etüdü Analizörü — StandardOutput",
    fn: (inputs) => {
    const shiftDuration = num(inputs, "shiftDuration");
    const standardTime = num(inputs, "standardTime");
    return nonNegative(assertFinite(shiftDuration / standardTime));
  },
  },
  {
    id: "user.standard_time_work_study_5",
    family: "general",
    label: "Zaman Etüdü Analizörü — LaborCostPerUnit",
    fn: (inputs) => {
    const standardTime = num(inputs, "standardTime");
    const hourlyRate = num(inputs, "hourlyRate");
    return nonNegative(assertFinite(standardTime * hourlyRate));
  },
  },
  {
    id: "user.standard_time_work_study_6",
    family: "general",
    label: "Zaman Etüdü Analizörü — EfficiencyVariance",
    fn: (inputs) => {
    const standardTime = num(inputs, "standardTime");
    const actualTime = num(inputs, "actualTime");
    const actualProduction = num(inputs, "actualProduction");
    const hourlyRate = num(inputs, "hourlyRate");
    return nonNegative(assertFinite((standardTime - actualTime) * actualProduction * hourlyRate));
  },
  },


  // ── User formula metadata — append to FORMULA_META ──
  // ── AI TOKEN MALİYET ──
  "user.ai_token_cost_0": { description: "AI TOKEN MALİYET: BasePromptCost = (PromptTokens * PromptPrice) / 1000000", requiredInputs: [], outputHint: "number" },
  "user.ai_token_cost_1": { description: "AI TOKEN MALİYET: BaseCompletionCost = (CompletionTokens * CompletionPrice) / 1000000", requiredInputs: [], outputHint: "number" },
  "user.ai_token_cost_2": { description: "AI TOKEN MALİYET: CacheReadCost = (CachedTokens * CacheReadPrice) / 1000000", requiredInputs: [], outputHint: "number" },
  "user.ai_token_cost_3": { description: "AI TOKEN MALİYET: MonthlyProjection = (DailyBaseCost * 30) * (1 + GrowthRate)", requiredInputs: [], outputHint: "number" },
  "user.ai_token_cost_4": { description: "AI TOKEN MALİYET: TCO = MonthlyProjection + InfraOverhead + FallbackCost", requiredInputs: [], outputHint: "number" },
  // ── ALTI SİGMA PROJE ÖNCELİKLENDİRİCİ ──
  "user.six_sigma_project_prioritizer_0": { description: "ALTI SİGMA PROJE ÖNCELİKLENDİRİCİ: DPMO = (Defects / (Units * Opportunities)) * 1000000", requiredInputs: [], outputHint: "number" },
  "user.six_sigma_project_prioritizer_1": { description: "ALTI SİGMA PROJE ÖNCELİKLENDİRİCİ: Yield = 1 - (Defects / (Units * Opportunities))", requiredInputs: [], outputHint: "number" },
  "user.six_sigma_project_prioritizer_2": { description: "ALTI SİGMA PROJE ÖNCELİKLENDİRİCİ: Z_bench = NORMSINV(Yield)", requiredInputs: [], outputHint: "number" },
  "user.six_sigma_project_prioritizer_3": { description: "ALTI SİGMA PROJE ÖNCELİKLENDİRİCİ: SigmaLevel = Z_bench + 1.5", requiredInputs: [], outputHint: "number" },
  "user.six_sigma_project_prioritizer_4": { description: "ALTI SİGMA PROJE ÖNCELİKLENDİRİCİ: COPQ = InternalFailure + ExternalFailure + Appraisal + Prevention", requiredInputs: [], outputHint: "number" },
  "user.six_sigma_project_prioritizer_5": { description: "ALTI SİGMA PROJE ÖNCELİKLENDİRİCİ: ProjectScore = (COPQ * RecoveryProb * 0.35) + (SigmaGap * 0.25) + (StrategicAlignment * 0.25) + (Ease * 0.15)", requiredInputs: [], outputHint: "number" },
  // ── AQL SAMPLING RİSK & MALİYET ──
  "user.aql_sampling_risk_0": { description: "AQL SAMPLING RİSK & MALİYET: CodeLetter = LookupCodeLetter(LotSize, InspectionLevel)", requiredInputs: [], outputHint: "number" },
  "user.aql_sampling_risk_1": { description: "AQL SAMPLING RİSK & MALİYET: n = SampleSize(CodeLetter, AQL)", requiredInputs: [], outputHint: "number" },
  "user.aql_sampling_risk_2": { description: "AQL SAMPLING RİSK & MALİYET: Ac = AcceptanceNumber(CodeLetter, AQL)", requiredInputs: [], outputHint: "number" },
  "user.aql_sampling_risk_3": { description: "AQL SAMPLING RİSK & MALİYET: Pa_producer = BINOMDIST(Ac, n, p_AQL, TRUE)", requiredInputs: [], outputHint: "number" },
  "user.aql_sampling_risk_4": { description: "AQL SAMPLING RİSK & MALİYET: Alpha = 1 - Pa_producer", requiredInputs: [], outputHint: "number" },
  "user.aql_sampling_risk_5": { description: "AQL SAMPLING RİSK & MALİYET: Pa_consumer = BINOMDIST(Ac, n, p_LTPD, TRUE)", requiredInputs: [], outputHint: "number" },
  "user.aql_sampling_risk_6": { description: "AQL SAMPLING RİSK & MALİYET: Beta = Pa_consumer", requiredInputs: [], outputHint: "number" },
  "user.aql_sampling_risk_7": { description: "AQL SAMPLING RİSK & MALİYET: ATI = n + (1 - Pa) * (N - n)", requiredInputs: [], outputHint: "number" },
  "user.aql_sampling_risk_8": { description: "AQL SAMPLING RİSK & MALİYET: TotalRiskCost = (N * p * (1 - Pa) * (1 - DetectionRate)) * CostPerDefect", requiredInputs: [], outputHint: "number" },
  // ── ARAÇ AMORTİSMANI ──
  "user.vehicle_depreciation_tco_0": { description: "ARAÇ AMORTİSMANI: SL_Annual = (Cost - SalvageValue) / UsefulLife", requiredInputs: [], outputHint: "number" },
  "user.vehicle_depreciation_tco_1": { description: "ARAÇ AMORTİSMANI: DB_Rate = 2 / UsefulLife", requiredInputs: [], outputHint: "number" },
  "user.vehicle_depreciation_tco_2": { description: "ARAÇ AMORTİSMANI: DB_Year_t = BookValue_(t-1) * DB_Rate", requiredInputs: [], outputHint: "number" },
  "user.vehicle_depreciation_tco_3": { description: "ARAÇ AMORTİSMANI: MACRS_Year_t = Cost * MACRS_Table(AssetClass, Year)", requiredInputs: [], outputHint: "number" },
  "user.vehicle_depreciation_tco_4": { description: "ARAÇ AMORTİSMANI: UoP_PerUnit = (Cost - SalvageValue) / TotalExpectedUnits", requiredInputs: [], outputHint: "number" },
  "user.vehicle_depreciation_tco_5": { description: "ARAÇ AMORTİSMANI: TCO = AcquisitionCost + SUM((OpCost_t + MaintCost_t - Salvage_t) / (1 + DiscountRate)^t)", requiredInputs: [], outputHint: "number" },
  "user.vehicle_depreciation_tco_6": { description: "ARAÇ AMORTİSMANI: TaxShield = Depreciation * TaxRate", requiredInputs: [], outputHint: "number" },
  // ── ARIZA SÜRESİ MALİYETİ ──
  "user.downtime_cost_0": { description: "ARIZA SÜRESİ MALİYETİ: DirectLaborLoss = DowntimeHours * AffectedWorkers * AvgHourlyRate * (1 + BurdenRate)", requiredInputs: [], outputHint: "number" },
  "user.downtime_cost_1": { description: "ARIZA SÜRESİ MALİYETİ: ProductionLoss = DowntimeHours * LineCapacity * ContributionMargin", requiredInputs: [], outputHint: "number" },
  "user.downtime_cost_2": { description: "ARIZA SÜRESİ MALİYETİ: EnergyWaste = IdlePowerKW * DowntimeHours * ElectricityRate", requiredInputs: [], outputHint: "number" },
  "user.downtime_cost_3": { description: "ARIZA SÜRESİ MALİYETİ: RecoveryCost = OvertimeHours * OvertimeRate * CrewSize", requiredInputs: [], outputHint: "number" },
  "user.downtime_cost_4": { description: "ARIZA SÜRESİ MALİYETİ: TotalDowntimeCost = DirectLaborLoss + ProductionLoss + EnergyWaste + RecoveryCost + QualityLoss + Penalty", requiredInputs: [], outputHint: "number" },
  // ── AUTO REPAIR COMEBACK ──
  "user.auto_repair_comeback_0": { description: "AUTO REPAIR COMEBACK: ComebackRate = (ComebackOrders / TotalCompleted) * 100", requiredInputs: [], outputHint: "number" },
  "user.auto_repair_comeback_1": { description: "AUTO REPAIR COMEBACK: ComebackCost_Direct = ComebackOrders * (DiagTime + RepairTime) * LaborRate", requiredInputs: [], outputHint: "number" },
  "user.auto_repair_comeback_2": { description: "AUTO REPAIR COMEBACK: ComebackCost_Parts = ComebackOrders * WastedPartsValue", requiredInputs: [], outputHint: "number" },
  "user.auto_repair_comeback_3": { description: "AUTO REPAIR COMEBACK: ComebackCost_Opportunity = ComebackOrders * BayOccupancyHours * RevenuePerBayHour", requiredInputs: [], outputHint: "number" },
  "user.auto_repair_comeback_4": { description: "AUTO REPAIR COMEBACK: DPMO = (ComebackOrders / TotalCompleted) * 1000000", requiredInputs: [], outputHint: "number" },
  "user.auto_repair_comeback_5": { description: "AUTO REPAIR COMEBACK: TotalCost = Direct + Parts + Warranty + Goodwill + Opportunity", requiredInputs: [], outputHint: "number" },
  // ── AUTO REPAIR QUOTE ──
  "user.auto_repair_quote_consistency_0": { description: "AUTO REPAIR QUOTE: QuoteVariance = STDEV(QuoteAmounts) / AVERAGE(QuoteAmounts)", requiredInputs: [], outputHint: "number" },
  "user.auto_repair_quote_consistency_1": { description: "AUTO REPAIR QUOTE: PartPriceDeviation = (QuotedPartPrice - MarketAvg) / MarketAvg", requiredInputs: [], outputHint: "number" },
  "user.auto_repair_quote_consistency_2": { description: "AUTO REPAIR QUOTE: LaborTimeDeviation = (QuotedLaborHours - StandardHours) / StandardHours", requiredInputs: [], outputHint: "number" },
  "user.auto_repair_quote_consistency_3": { description: "AUTO REPAIR QUOTE: ConsistencyScore = 100 - (QuoteVariance * 50 + ABS(PartPriceDeviation) * 25 + ABS(LaborTimeDeviation) * 25)", requiredInputs: [], outputHint: "number" },
  "user.auto_repair_quote_consistency_4": { description: "AUTO REPAIR QUOTE: MarginLeak = SUM((MarketPrice - QuotedPrice) * Quantity)", requiredInputs: [], outputHint: "number" },
  // ── AUTO SHOP MARJ KAÇAK ──
  "user.auto_shop_margin_leak_0": { description: "AUTO SHOP MARJ KAÇAK: GrossMargin_Parts = (PartsRevenue - PartsCOGS) / PartsRevenue", requiredInputs: [], outputHint: "number" },
  "user.auto_shop_margin_leak_1": { description: "AUTO SHOP MARJ KAÇAK: EffectiveLaborRate = TotalLaborRevenue / TotalFlagHours", requiredInputs: [], outputHint: "number" },
  "user.auto_shop_margin_leak_2": { description: "AUTO SHOP MARJ KAÇAK: ProductivityRate = TotalFlagHours / TotalAvailableHours", requiredInputs: [], outputHint: "number" },
  "user.auto_shop_margin_leak_3": { description: "AUTO SHOP MARJ KAÇAK: MarginLeak_Discount = SUM(Discount) / TotalRevenue", requiredInputs: [], outputHint: "number" },
  "user.auto_shop_margin_leak_4": { description: "AUTO SHOP MARJ KAÇAK: MarginLeak_Shrinkage = InventoryShrinkage / PartsCOGS", requiredInputs: [], outputHint: "number" },
  "user.auto_shop_margin_leak_5": { description: "AUTO SHOP MARJ KAÇAK: NetMargin = (TotalRevenue - TotalCOGS - TotalOpEx) / TotalRevenue", requiredInputs: [], outputHint: "number" },
  "user.auto_shop_margin_leak_6": { description: "AUTO SHOP MARJ KAÇAK: AnnualLeakage = TotalRevenue * (TargetMargin - NetMargin)", requiredInputs: [], outputHint: "number" },
  // ── BASINÇ VESSEL KALINLIK ──
  "user.asme_pressure_vessel_0": { description: "BASINÇ VESSEL KALINLIK: t_shell = (P * R) / (S * E - 0.6 * P) + C_A", requiredInputs: [], outputHint: "number" },
  "user.asme_pressure_vessel_1": { description: "BASINÇ VESSEL KALINLIK: t_sphere = (P * R) / (2 * S * E - 0.2 * P) + C_A", requiredInputs: [], outputHint: "number" },
  "user.asme_pressure_vessel_2": { description: "BASINÇ VESSEL KALINLIK: t_head_ellip = (P * D) / (2 * S * E - 0.2 * P) + C_A", requiredInputs: [], outputHint: "number" },
  "user.asme_pressure_vessel_3": { description: "BASINÇ VESSEL KALINLIK: M = 0.25 * (3 + SQRT(L/r))^2", requiredInputs: [], outputHint: "number" },
  "user.asme_pressure_vessel_4": { description: "BASINÇ VESSEL KALINLIK: t_head_tori = (P * L * M) / (2 * S * E - 0.2 * P) + C_A", requiredInputs: [], outputHint: "number" },
  "user.asme_pressure_vessel_5": { description: "BASINÇ VESSEL KALINLIK: MAWP = (S * E * (t - C_A)) / (R + 0.6 * (t - C_A))", requiredInputs: [], outputHint: "number" },
  // ── BASINÇLI HAVA ENERJİ ──
  "user.compressed_air_energy_cost_0": { description: "BASINÇLI HAVA ENERJİ: CompressorPower = (Q * DeltaP) / (Eff_isothermal * Eff_motor * Eff_drive)", requiredInputs: [], outputHint: "number" },
  "user.compressed_air_energy_cost_1": { description: "BASINÇLI HAVA ENERJİ: SpecificPower = CompressorPower / Q_actual", requiredInputs: [], outputHint: "number" },
  "user.compressed_air_energy_cost_2": { description: "BASINÇLI HAVA ENERJİ: AnnualEnergyCost = CompressorPower * OpHours * ElecRate * LoadFactor", requiredInputs: [], outputHint: "number" },
  "user.compressed_air_energy_cost_3": { description: "BASINÇLI HAVA ENERJİ: LeakageCost = SUM(LeakFlow * OpHours * SpecificPower * ElecRate)", requiredInputs: [], outputHint: "number" },
  "user.compressed_air_energy_cost_4": { description: "BASINÇLI HAVA ENERJİ: TotalAnnualCost = AnnualEnergyCost + LeakageCost + PressureDropCost + UnloadWaste - HeatRecoverySavings", requiredInputs: [], outputHint: "number" },
  // ── BAŞABAŞ NOKTASI ──
  "user.break_even_margin_of_safety_0": { description: "BAŞABAŞ NOKTASI: BEP_Units = FixedCosts / (UnitPrice - UnitVariableCost)", requiredInputs: [], outputHint: "number" },
  "user.break_even_margin_of_safety_1": { description: "BAŞABAŞ NOKTASI: BEP_Revenue = FixedCosts / CMR", requiredInputs: [], outputHint: "number" },
  "user.break_even_margin_of_safety_2": { description: "BAŞABAŞ NOKTASI: CMR = (UnitPrice - UnitVariableCost) / UnitPrice", requiredInputs: [], outputHint: "number" },
  "user.break_even_margin_of_safety_3": { description: "BAŞABAŞ NOKTASI: MarginOfSafety_Percent = (ActualSales - BEP_Units) / ActualSales * 100", requiredInputs: [], outputHint: "number" },
  "user.break_even_margin_of_safety_4": { description: "BAŞABAŞ NOKTASI: OperatingLeverage = ContributionMargin / NetOperatingIncome", requiredInputs: [], outputHint: "number" },
  "user.break_even_margin_of_safety_5": { description: "BAŞABAŞ NOKTASI: TargetProfit_Units = (FixedCosts + TargetProfit) / UnitContributionMargin", requiredInputs: [], outputHint: "number" },
  // ── BETON HACMİ ──
  "user.concrete_volume_cost_0": { description: "BETON HACMİ: V_slab = Length * Width * Thickness", requiredInputs: [], outputHint: "number" },
  "user.concrete_volume_cost_1": { description: "BETON HACMİ: V_footing = Length * Width * Depth * Count", requiredInputs: [], outputHint: "number" },
  "user.concrete_volume_cost_2": { description: "BETON HACMİ: V_column = PI * (Diameter/2)^2 * Height * Count", requiredInputs: [], outputHint: "number" },
  "user.concrete_volume_cost_3": { description: "BETON HACMİ: V_wall = Length * Height * Thickness", requiredInputs: [], outputHint: "number" },
  "user.concrete_volume_cost_4": { description: "BETON HACMİ: V_total = V_geometric * (1 + WasteFactor)", requiredInputs: [], outputHint: "number" },
  "user.concrete_volume_cost_5": { description: "BETON HACMİ: Weight = V_total * Density", requiredInputs: [], outputHint: "number" },
  "user.concrete_volume_cost_6": { description: "BETON HACMİ: TruckLoads = CEILING(V_total / TruckCapacity)", requiredInputs: [], outputHint: "number" },
  "user.concrete_volume_cost_7": { description: "BETON HACMİ: TotalCost = V_total * UnitPrice + PumpCost", requiredInputs: [], outputHint: "number" },
  // ── CALIBRATION SAPMA ──
  "user.calibration_drift_risk_0": { description: "CALIBRATION SAPMA: DriftRate = (LastError - PrevError) / TimeBetween", requiredInputs: [], outputHint: "number" },
  "user.calibration_drift_risk_1": { description: "CALIBRATION SAPMA: PredictedDrift = DriftRate * TimeSinceLast", requiredInputs: [], outputHint: "number" },
  "user.calibration_drift_risk_2": { description: "CALIBRATION SAPMA: CurrentUncertainty = SQRT(BaseUncertainty^2 + PredictedDrift^2 + EnvFactor^2)", requiredInputs: [], outputHint: "number" },
  "user.calibration_drift_risk_3": { description: "CALIBRATION SAPMA: RiskScore = (CurrentUncertainty / Tolerance) * Criticality * UsageFreq", requiredInputs: [], outputHint: "number" },
  "user.calibration_drift_risk_4": { description: "CALIBRATION SAPMA: OptimalInterval = BaseInterval * (Tolerance / CurrentUncertainty)", requiredInputs: [], outputHint: "number" },
  "user.calibration_drift_risk_5": { description: "CALIBRATION SAPMA: GuardBand = ExpandedUncertainty * k", requiredInputs: [], outputHint: "number" },
  // ── CBAM MARUZİYET ──
  "user.cbam_exposure_0": { description: "CBAM MARUZİYET: DirectEmissions = SUM(ActivityData * EmissionFactor)", requiredInputs: [], outputHint: "number" },
  "user.cbam_exposure_1": { description: "CBAM MARUZİYET: IndirectEmissions = ElecConsumption * GridFactor", requiredInputs: [], outputHint: "number" },
  "user.cbam_exposure_2": { description: "CBAM MARUZİYET: CarbonIntensity = (DirectEmissions + IndirectEmissions) / ProductionVolume", requiredInputs: [], outputHint: "number" },
  "user.cbam_exposure_3": { description: "CBAM MARUZİYET: CBAMCertificateCost = (EmbeddedEmissions - FreeAllowance) * EU_ETS_Price", requiredInputs: [], outputHint: "number" },
  "user.cbam_exposure_4": { description: "CBAM MARUZİYET: FreeAllowance = Benchmark * ProductionVolume * LeakageFactor", requiredInputs: [], outputHint: "number" },
  "user.cbam_exposure_5": { description: "CBAM MARUZİYET: ComplianceScore = (DataComplete * 0.3) + (Verification * 0.3) + (Reduction * 0.4)", requiredInputs: [], outputHint: "number" },
  // ── CBAM UYUMLULUK ──
  "user.cbam_compliance_verdict_0": { description: "CBAM UYUMLULUK: TotalMass = SUM(Mass)", requiredInputs: [], outputHint: "number" },
  "user.cbam_compliance_verdict_1": { description: "CBAM UYUMLULUK: TotalEmbedded = SUM(Direct + Indirect)", requiredInputs: [], outputHint: "number" },
  "user.cbam_compliance_verdict_2": { description: "CBAM UYUMLULUK: SpecificEmbedded = TotalEmbedded / TotalMass", requiredInputs: [], outputHint: "number" },
  "user.cbam_compliance_verdict_3": { description: "CBAM UYUMLULUK: ActualVsDefault = SpecificEmbedded / DefaultEmissionFactor", requiredInputs: [], outputHint: "number" },
  "user.cbam_compliance_verdict_4": { description: "CBAM UYUMLULUK: FinancialLiability = TotalEmbedded * (EU_ETS_Price - CarbonPricePaidOrigin)", requiredInputs: [], outputHint: "number" },
  "user.cbam_compliance_verdict_5": { description: "CBAM UYUMLULUK: ComplianceDecision = IF(ActualVsDefault < 1 AND Liability < MarginThreshold, 'Proceed', 'Reevaluate')", requiredInputs: [], outputHint: "number" },
  // ── CHATTER YÜZEY KALİTE ──
  "user.chatter_surface_quality_0": { description: "CHATTER YÜZEY KALİTE: V_c = (PI * D * n) / 1000", requiredInputs: [], outputHint: "number" },
  "user.chatter_surface_quality_1": { description: "CHATTER YÜZEY KALİTE: f_z = V_f / (z * n)", requiredInputs: [], outputHint: "number" },
  "user.chatter_surface_quality_2": { description: "CHATTER YÜZEY KALİTE: SurfaceRoughness_Theo = f_z^2 / (8 * r_epsilon)", requiredInputs: [], outputHint: "number" },
  "user.chatter_surface_quality_3": { description: "CHATTER YÜZEY KALİTE: SurfaceRoughness_Actual = Theo * ChatterAmplification", requiredInputs: [], outputHint: "number" },
  "user.chatter_surface_quality_4": { description: "CHATTER YÜZEY KALİTE: QualityLossCost = (Actual - ToleranceLimit) * ReworkCostPerMicron", requiredInputs: [], outputHint: "number" },
  "user.chatter_surface_quality_5": { description: "CHATTER YÜZEY KALİTE: ScrapRate = IF(Actual > MaxTolerance, 1, 0) * BatchSize", requiredInputs: [], outputHint: "number" },
  // ── CIVATE TORK ──
  "user.bolt_torque_preload_0": { description: "CIVATE TORK: T = K * D * F", requiredInputs: [], outputHint: "number" },
  "user.bolt_torque_preload_1": { description: "CIVATE TORK: F = Preload = Sigma_p * A_t", requiredInputs: [], outputHint: "number" },
  "user.bolt_torque_preload_2": { description: "CIVATE TORK: Sigma_p = 0.7 * ProofStrength", requiredInputs: [], outputHint: "number" },
  "user.bolt_torque_preload_3": { description: "CIVATE TORK: A_t = (PI / 4) * ((d2 + d3) / 2)^2", requiredInputs: [], outputHint: "number" },
  "user.bolt_torque_preload_4": { description: "CIVATE TORK: d2 = d - 0.649519 * p", requiredInputs: [], outputHint: "number" },
  "user.bolt_torque_preload_5": { description: "CIVATE TORK: d3 = d - 1.226869 * p", requiredInputs: [], outputHint: "number" },
  "user.bolt_torque_preload_6": { description: "CIVATE TORK: YieldCheck = IF(Sigma_p > YieldStrength, 'FAIL', 'PASS')", requiredInputs: [], outputHint: "number" },
  // ── CİRO MALİYETİ ──
  "user.employee_turnover_cost_0": { description: "CİRO MALİYETİ: SeparationCost = ExitInterview * HRRate + Severance + Admin", requiredInputs: [], outputHint: "number" },
  "user.employee_turnover_cost_1": { description: "CİRO MALİYETİ: VacancyCost = (TimeToFill * DailyRevenue) + TempCost", requiredInputs: [], outputHint: "number" },
  "user.employee_turnover_cost_2": { description: "CİRO MALİYETİ: ReplacementCost = Ads + Agency + InterviewTime * Rate", requiredInputs: [], outputHint: "number" },
  "user.employee_turnover_cost_3": { description: "CİRO MALİYETİ: TrainingCost = TrainHours * TrainerRate + OnboardHours * NewHireRate", requiredInputs: [], outputHint: "number" },
  "user.employee_turnover_cost_4": { description: "CİRO MALİYETİ: ProductivityLoss = TimeToFull * AvgOutput * (1 - RampUp) * Margin", requiredInputs: [], outputHint: "number" },
  "user.employee_turnover_cost_5": { description: "CİRO MALİYETİ: TotalTurnoverCost = Separation + Vacancy + Replacement + Training + Productivity", requiredInputs: [], outputHint: "number" },
  // ── CLOUD API OVERRUN ──
  "user.cloud_api_overrun_0": { description: "CLOUD API OVERRUN: OverrunRequests = MAX(0, TotalRequests - IncludedRequests)", requiredInputs: [], outputHint: "number" },
  "user.cloud_api_overrun_1": { description: "CLOUD API OVERRUN: OverrunCost = OverrunRequests * OverageRate", requiredInputs: [], outputHint: "number" },
  "user.cloud_api_overrun_2": { description: "CLOUD API OVERRUN: ThrottlingCost = ThrottledRequests * RetryCost * AvgRetries", requiredInputs: [], outputHint: "number" },
  "user.cloud_api_overrun_3": { description: "CLOUD API OVERRUN: DataEgressCost = DataOutGB * EgressRate", requiredInputs: [], outputHint: "number" },
  "user.cloud_api_overrun_4": { description: "CLOUD API OVERRUN: SLABreachPenalty = IF(Availability < SLA, MonthlyFee * CreditPct, 0)", requiredInputs: [], outputHint: "number" },
  "user.cloud_api_overrun_5": { description: "CLOUD API OVERRUN: TotalOverrunCost = OverrunCost + ThrottlingCost + DataEgressCost + SLABreachPenalty", requiredInputs: [], outputHint: "number" },
  // ── CLOUD FIRE ELIMINATION ──
  "user.cloud_waste_elimination_0": { description: "CLOUD FIRE ELIMINATION: ZombieCost = SUM(UnattachedVolumes * Rate) + SUM(IdleLBs * Rate) + SUM(OrphanSnapshots * StorageRate)", requiredInputs: [], outputHint: "number" },
  "user.cloud_waste_elimination_1": { description: "CLOUD FIRE ELIMINATION: OversizingSavings = SUM((CurrentCost - RightSizedCost) * Uptime)", requiredInputs: [], outputHint: "number" },
  "user.cloud_waste_elimination_2": { description: "CLOUD FIRE ELIMINATION: SpotSavings = SUM((OnDemand - Spot) * FaultTolerantHours)", requiredInputs: [], outputHint: "number" },
  "user.cloud_waste_elimination_3": { description: "CLOUD FIRE ELIMINATION: ReservedSavings = (OnDemand - Reserved) * CommitUtil", requiredInputs: [], outputHint: "number" },
  "user.cloud_waste_elimination_4": { description: "CLOUD FIRE ELIMINATION: IdleHoursCost = NonBizHours * RunningInstances * HourlyRate", requiredInputs: [], outputHint: "number" },
  "user.cloud_waste_elimination_5": { description: "CLOUD FIRE ELIMINATION: TotalWaste = Zombie + Oversizing + Spot + Reserved + Idle", requiredInputs: [], outputHint: "number" },
  // ── CLV / CAC ORANI ──
  "user.clv_cac_ratio_0": { description: "CLV / CAC ORANI: CLV = AvgOrderValue * PurchaseFreq * Lifespan", requiredInputs: [], outputHint: "number" },
  "user.clv_cac_ratio_1": { description: "CLV / CAC ORANI: GrossMarginCLV = CLV * GrossMarginPct", requiredInputs: [], outputHint: "number" },
  "user.clv_cac_ratio_2": { description: "CLV / CAC ORANI: DiscountedCLV = SUM((GrossMarginCLV * Retention^t) / (1 + DiscountRate)^t)", requiredInputs: [], outputHint: "number" },
  "user.clv_cac_ratio_3": { description: "CLV / CAC ORANI: CAC = (SalesMarketing + Salaries + Overhead) / NewCustomers", requiredInputs: [], outputHint: "number" },
  "user.clv_cac_ratio_4": { description: "CLV / CAC ORANI: Payback = CAC / AvgMonthlyGrossProfit", requiredInputs: [], outputHint: "number" },
  "user.clv_cac_ratio_5": { description: "CLV / CAC ORANI: LTV_CAC = DiscountedCLV / CAC", requiredInputs: [], outputHint: "number" },
  // ── CNC ÇEVRİM SÜRESİ ──
  "user.cnc_cycle_time_0": { description: "CNC ÇEVRİM SÜRESİ: T_cut = (L * D) / (V_f * a_p)", requiredInputs: [], outputHint: "number" },
  "user.cnc_cycle_time_1": { description: "CNC ÇEVRİM SÜRESİ: V_f = f_z * z * n", requiredInputs: [], outputHint: "number" },
  "user.cnc_cycle_time_2": { description: "CNC ÇEVRİM SÜRESİ: n = (1000 * V_c) / (PI * D_tool)", requiredInputs: [], outputHint: "number" },
  "user.cnc_cycle_time_3": { description: "CNC ÇEVRİM SÜRESİ: T_rapid = Distance_rapid / V_rapid", requiredInputs: [], outputHint: "number" },
  "user.cnc_cycle_time_4": { description: "CNC ÇEVRİM SÜRESİ: T_toolchange = Changes * TimePerChange", requiredInputs: [], outputHint: "number" },
  "user.cnc_cycle_time_5": { description: "CNC ÇEVRİM SÜRESİ: T_total = T_cut + T_rapid + T_toolchange + T_noncutting + T_load_unload", requiredInputs: [], outputHint: "number" },
  "user.cnc_cycle_time_6": { description: "CNC ÇEVRİM SÜRESİ: OEE_Availability = Planned / (Planned + Downtime)", requiredInputs: [], outputHint: "number" },
  // ── CNC İŞLEME MALİYETİ ──
  "user.cnc_machining_cost_0": { description: "CNC İŞLEME MALİYETİ: Cost_Material = Volume_raw * Density * PricePerKg * (1 + ScrapRate)", requiredInputs: [], outputHint: "number" },
  "user.cnc_machining_cost_1": { description: "CNC İŞLEME MALİYETİ: Cost_Machining = T_total * MachineRate", requiredInputs: [], outputHint: "number" },
  "user.cnc_machining_cost_2": { description: "CNC İŞLEME MALİYETİ: Cost_Tooling = (T_cut / ToolLife) * ToolCost", requiredInputs: [], outputHint: "number" },
  "user.cnc_machining_cost_3": { description: "CNC İŞLEME MALİYETİ: Cost_Energy = Power * T_total * ElecRate", requiredInputs: [], outputHint: "number" },
  "user.cnc_machining_cost_4": { description: "CNC İŞLEME MALİYETİ: Cost_Overhead = T_total * OverheadRate", requiredInputs: [], outputHint: "number" },
  "user.cnc_machining_cost_5": { description: "CNC İŞLEME MALİYETİ: TotalUnitCost = Material + Machining + Tooling + Energy + Overhead + Quality", requiredInputs: [], outputHint: "number" },
  // ── CPK TO PPM ──
  "user.cpk_ppm_converter_0": { description: "CPK TO PPM: Z_USL = (USL - Mean) / StdDev", requiredInputs: [], outputHint: "number" },
  "user.cpk_ppm_converter_1": { description: "CPK TO PPM: Z_LSL = (Mean - LSL) / StdDev", requiredInputs: [], outputHint: "number" },
  "user.cpk_ppm_converter_2": { description: "CPK TO PPM: Cpk = MIN(Z_USL, Z_LSL) / 3", requiredInputs: [], outputHint: "number" },
  "user.cpk_ppm_converter_3": { description: "CPK TO PPM: P_USL = 1 - NORMSDIST(Z_USL)", requiredInputs: [], outputHint: "number" },
  "user.cpk_ppm_converter_4": { description: "CPK TO PPM: P_LSL = NORMSDIST(-Z_LSL)", requiredInputs: [], outputHint: "number" },
  "user.cpk_ppm_converter_5": { description: "CPK TO PPM: P_Total = P_USL + P_LSL", requiredInputs: [], outputHint: "number" },
  "user.cpk_ppm_converter_6": { description: "CPK TO PPM: PPM = P_Total * 1000000", requiredInputs: [], outputHint: "number" },
  "user.cpk_ppm_converter_7": { description: "CPK TO PPM: Yield = 1 - P_Total", requiredInputs: [], outputHint: "number" },
  "user.cpk_ppm_converter_8": { description: "CPK TO PPM: Sigma_ShortTerm = (Cpk * 3) + 1.5", requiredInputs: [], outputHint: "number" },
  // ── CPM GECİKME CEZASI ──
  "user.cpm_delay_penalty_0": { description: "CPM GECİKME CEZASI: TotalFloat = LateStart - EarlyStart", requiredInputs: [], outputHint: "number" },
  "user.cpm_delay_penalty_1": { description: "CPM GECİKME CEZASI: CriticalDelay = MAX(0, Actual - Planned - TotalFloat)", requiredInputs: [], outputHint: "number" },
  "user.cpm_delay_penalty_2": { description: "CPM GECİKME CEZASI: ExcusableDelay = ForceMajeure + OwnerCaused", requiredInputs: [], outputHint: "number" },
  "user.cpm_delay_penalty_3": { description: "CPM GECİKME CEZASI: NonExcusable = CriticalDelay - Excusable", requiredInputs: [], outputHint: "number" },
  "user.cpm_delay_penalty_4": { description: "CPM GECİKME CEZASI: LiquidatedDamages = NonExcusable * DailyPenalty", requiredInputs: [], outputHint: "number" },
  "user.cpm_delay_penalty_5": { description: "CPM GECİKME CEZASI: AccelerationCost = CrashingCost * DaysAccelerated", requiredInputs: [], outputHint: "number" },
  "user.cpm_delay_penalty_6": { description: "CPM GECİKME CEZASI: NetPenalty = LiquidatedDamages - AccelerationCost", requiredInputs: [], outputHint: "number" },
  "user.cpm_delay_penalty_7": { description: "CPM GECİKME CEZASI: EOT_Claim = Excusable * (1 - EffFactor)", requiredInputs: [], outputHint: "number" },
  // ── ÇATI ALANI ──
  "user.roof_area_load_0": { description: "ÇATI ALANI: Area_Footprint = Length * Width", requiredInputs: [], outputHint: "number" },
  "user.roof_area_load_1": { description: "ÇATI ALANI: Area_Gable = Footprint / COS(PitchAngle)", requiredInputs: [], outputHint: "number" },
  "user.roof_area_load_2": { description: "ÇATI ALANI: OverhangArea = Perimeter * OverhangWidth", requiredInputs: [], outputHint: "number" },
  "user.roof_area_load_3": { description: "ÇATI ALANI: TotalMaterialArea = Area_Roof * (1 + WasteFactor)", requiredInputs: [], outputHint: "number" },
  "user.roof_area_load_4": { description: "ÇATI ALANI: RidgeLength = Length - Width + (Width * SQRT(2))", requiredInputs: [], outputHint: "number" },
  "user.roof_area_load_5": { description: "ÇATI ALANI: Load_Dead = MaterialWeight * TotalArea", requiredInputs: [], outputHint: "number" },
  "user.roof_area_load_6": { description: "ÇATI ALANI: Load_Snow = GroundSnow * Exposure * Thermal * Slope", requiredInputs: [], outputHint: "number" },
  // ── DARBOĞAZ YATIRIM ──
  "user.bottleneck_investment_0": { description: "DARBOĞAZ YATIRIM: Utilization = ActualOutput / DesignCapacity", requiredInputs: [], outputHint: "number" },
  "user.bottleneck_investment_1": { description: "DARBOĞAZ YATIRIM: Throughput = Demand * (1 - DefectRate)", requiredInputs: [], outputHint: "number" },
  "user.bottleneck_investment_2": { description: "DARBOĞAZ YATIRIM: TaktTime = AvailableTime / Demand", requiredInputs: [], outputHint: "number" },
  "user.bottleneck_investment_3": { description: "DARBOĞAZ YATIRIM: CycleTime_Gap = BottleneckCycle - TaktTime", requiredInputs: [], outputHint: "number" },
  "user.bottleneck_investment_4": { description: "DARBOĞAZ YATIRIM: CostOfConstraint = CycleTime_Gap * Demand * UnitMargin", requiredInputs: [], outputHint: "number" },
  "user.bottleneck_investment_5": { description: "DARBOĞAZ YATIRIM: ROI = (ThroughputIncrease * Margin * Days) / UpgradeCost", requiredInputs: [], outputHint: "number" },
  "user.bottleneck_investment_6": { description: "DARBOĞAZ YATIRIM: Payback = UpgradeCost / MonthlyGain", requiredInputs: [], outputHint: "number" },
  // ── DEĞİŞİM MATRİSİ SMED ──
  "user.smed_changeover_matrix_0": { description: "DEĞİŞİM MATRİSİ SMED: T_internal = SetupStopped", requiredInputs: [], outputHint: "number" },
  "user.smed_changeover_matrix_1": { description: "DEĞİŞİM MATRİSİ SMED: T_external = SetupRunning", requiredInputs: [], outputHint: "number" },
  "user.smed_changeover_matrix_2": { description: "DEĞİŞİM MATRİSİ SMED: T_total = T_internal + T_external", requiredInputs: [], outputHint: "number" },
  "user.smed_changeover_matrix_3": { description: "DEĞİŞİM MATRİSİ SMED: T_target = T_internal * (1 - ConversionRate) + T_external", requiredInputs: [], outputHint: "number" },
  "user.smed_changeover_matrix_4": { description: "DEĞİŞİM MATRİSİ SMED: EBQ = SQRT((2 * Demand * SetupCost) / HoldingCost)", requiredInputs: [], outputHint: "number" },
  "user.smed_changeover_matrix_5": { description: "DEĞİŞİM MATRİSİ SMED: SetupCost = T_total * MachineRate + Labor", requiredInputs: [], outputHint: "number" },
  "user.smed_changeover_matrix_6": { description: "DEĞİŞİM MATRİSİ SMED: AnnualSavings = (T_total - T_target) * Freq * Rate", requiredInputs: [], outputHint: "number" },
  "user.smed_changeover_matrix_7": { description: "DEĞİŞİM MATRİSİ SMED: CapacityGain = (T_total - T_target) * Freq / Available", requiredInputs: [], outputHint: "number" },
  // ── DEPO YERLEŞİMİ ──
  "user.warehouse_layout_0": { description: "DEPO YERLEŞİMİ: StorageArea = Footprint * UtilRate", requiredInputs: [], outputHint: "number" },
  "user.warehouse_layout_1": { description: "DEPO YERLEŞİMİ: PalletPositions = StorageArea / (PalletFootprint * AisleFactor)", requiredInputs: [], outputHint: "number" },
  "user.warehouse_layout_2": { description: "DEPO YERLEŞİMİ: VerticalCap = PalletPositions * RackLevels", requiredInputs: [], outputHint: "number" },
  "user.warehouse_layout_3": { description: "DEPO YERLEŞİMİ: ThroughputCap = Doors / (Turnaround_Load + Turnaround_Unload)", requiredInputs: [], outputHint: "number" },
  "user.warehouse_layout_4": { description: "DEPO YERLEŞİMİ: TravelDist = SUM(Freq * Dist)", requiredInputs: [], outputHint: "number" },
  "user.warehouse_layout_5": { description: "DEPO YERLEŞİMİ: PickEfficiency = Lines / TravelTime", requiredInputs: [], outputHint: "number" },
  "user.warehouse_layout_6": { description: "DEPO YERLEŞİMİ: CubeUtil = ActualVol / RackVol", requiredInputs: [], outputHint: "number" },
  "user.warehouse_layout_7": { description: "DEPO YERLEŞİMİ: CostPerPos = FacilityCost / PalletPositions", requiredInputs: [], outputHint: "number" },
  // ── DEVAMSIZLIK MALİYETİ ──
  "user.absenteeism_cost_0": { description: "DEVAMSIZLIK MALİYETİ: DirectCost = AbsentHours * HourlyRate * (1 + Burden)", requiredInputs: [], outputHint: "number" },
  "user.absenteeism_cost_1": { description: "DEVAMSIZLIK MALİYETİ: OvertimePremium = ReplaceOT * (OTRate - RegRate)", requiredInputs: [], outputHint: "number" },
  "user.absenteeism_cost_2": { description: "DEVAMSIZLIK MALİYETİ: TempCost = TempHours * TempRate * (1 + Markup)", requiredInputs: [], outputHint: "number" },
  "user.absenteeism_cost_3": { description: "DEVAMSIZLIK MALİYETİ: ProdLoss = AbsentHours * OutputPerHour * Margin * EffDrop", requiredInputs: [], outputHint: "number" },
  "user.absenteeism_cost_4": { description: "DEVAMSIZLIK MALİYETİ: AdminCost = Events * HR_Time * HRRate", requiredInputs: [], outputHint: "number" },
  "user.absenteeism_cost_5": { description: "DEVAMSIZLIK MALİYETİ: BradfordFactor = S^2 * D", requiredInputs: [], outputHint: "number" },
  "user.absenteeism_cost_6": { description: "DEVAMSIZLIK MALİYETİ: TotalCost = Direct + OT + Temp + Prod + Admin", requiredInputs: [], outputHint: "number" },
  // ── DIGITAL TWIN MALİYET ──
  "user.digital_twin_cost_0": { description: "DIGITAL TWIN MALİYET: Cost_Trad = Prototyping + FieldTest + Downtime + Travel", requiredInputs: [], outputHint: "number" },
  "user.digital_twin_cost_1": { description: "DIGITAL TWIN MALİYET: Cost_DT = License + Compute + Sensor + Modeling", requiredInputs: [], outputHint: "number" },
  "user.digital_twin_cost_2": { description: "DIGITAL TWIN MALİYET: TimeGain = (PhysCycle - DigCycle) * Iterations", requiredInputs: [], outputHint: "number" },
  "user.digital_twin_cost_3": { description: "DIGITAL TWIN MALİYET: RevenueGain = TimeGain * DailyRev", requiredInputs: [], outputHint: "number" },
  "user.digital_twin_cost_4": { description: "DIGITAL TWIN MALİYET: QualitySavings = DefectReduction * WarrantyCost * Volume", requiredInputs: [], outputHint: "number" },
  "user.digital_twin_cost_5": { description: "DIGITAL TWIN MALİYET: ROI = (Cost_Trad - Cost_DT + RevenueGain + QualitySavings) / Cost_DT", requiredInputs: [], outputHint: "number" },
  // ── DİKİŞ HATTI DENGELEYİCİ ──
  "user.sewing_line_balance_analyzer_pro_0": { description: "DİKİŞ HATTI DENGELEYİCİ: TaktTime = AvailableTime / Demand", requiredInputs: [], outputHint: "number" },
  "user.sewing_line_balance_analyzer_pro_1": { description: "DİKİŞ HATTI DENGELEYİCİ: CycleTotal = SUM(SMV)", requiredInputs: [], outputHint: "number" },
  "user.sewing_line_balance_analyzer_pro_2": { description: "DİKİŞ HATTI DENGELEYİCİ: TheoOperators = CycleTotal / TaktTime", requiredInputs: [], outputHint: "number" },
  "user.sewing_line_balance_analyzer_pro_3": { description: "DİKİŞ HATTI DENGELEYİCİ: ActOperators = CEILING(TheoOperators)", requiredInputs: [], outputHint: "number" },
  "user.sewing_line_balance_analyzer_pro_4": { description: "DİKİŞ HATTI DENGELEYİCİ: LineEff = (CycleTotal / (ActOperators * TaktTime)) * 100", requiredInputs: [], outputHint: "number" },
  "user.sewing_line_balance_analyzer_pro_5": { description: "DİKİŞ HATTI DENGELEYİCİ: BalanceDelay = 100 - LineEff", requiredInputs: [], outputHint: "number" },
  "user.sewing_line_balance_analyzer_pro_6": { description: "DİKİŞ HATTI DENGELEYİCİ: Smoothness = SQRT(SUM((MaxCycle - Cycle_i)^2) / ActOperators)", requiredInputs: [], outputHint: "number" },
  "user.sewing_line_balance_analyzer_pro_7": { description: "DİKİŞ HATTI DENGELEYİCİ: WIP = (Bottleneck - Takt) * Demand", requiredInputs: [], outputHint: "number" },
  // ── DYE REÇETE MALİYET ──
  "user.dye_recipe_cost_0": { description: "DYE REÇETE MALİYET: Cost_Dye = SUM(Conc * Price) / BathRatio", requiredInputs: [], outputHint: "number" },
  "user.dye_recipe_cost_1": { description: "DYE REÇETE MALİYET: Cost_Chem = SUM(Dosage * Price)", requiredInputs: [], outputHint: "number" },
  "user.dye_recipe_cost_2": { description: "DYE REÇETE MALİYET: Cost_Water = LiquorRatio * Weight * WaterTariff", requiredInputs: [], outputHint: "number" },
  "user.dye_recipe_cost_3": { description: "DYE REÇETE MALİYET: Cost_Energy = Heating + Holding + Drying", requiredInputs: [], outputHint: "number" },
  "user.dye_recipe_cost_4": { description: "DYE REÇETE MALİYET: Cost_Waste = Effluent * TreatCost + Surcharge", requiredInputs: [], outputHint: "number" },
  "user.dye_recipe_cost_5": { description: "DYE REÇETE MALİYET: TotalBatch = Dye + Chem + Water + Energy + Waste", requiredInputs: [], outputHint: "number" },
  "user.dye_recipe_cost_6": { description: "DYE REÇETE MALİYET: RFT_Savings = Rework * (1 - RFT)", requiredInputs: [], outputHint: "number" },
  "user.dye_recipe_cost_7": { description: "DYE REÇETE MALİYET: CostPerKg = (TotalBatch + RFT_Savings) / Weight", requiredInputs: [], outputHint: "number" },
  // ── ENERJİ TÜKETİM RAPORU ──
  "user.energy_consumption_report_0": { description: "ENERJİ TÜKETİM RAPORU: Active = SUM(kWh)", requiredInputs: [], outputHint: "number" },
  "user.energy_consumption_report_1": { description: "ENERJİ TÜKETİM RAPORU: Reactive = SUM(kVArh)", requiredInputs: [], outputHint: "number" },
  "user.energy_consumption_report_2": { description: "ENERJİ TÜKETİM RAPORU: PF = Active / SQRT(Active^2 + Reactive^2)", requiredInputs: [], outputHint: "number" },
  "user.energy_consumption_report_3": { description: "ENERJİ TÜKETİM RAPORU: ReactivePenalty = IF(PF < Thresh, (Reactive - Active * TAN(ACOS(Thresh))) * Tariff, 0)", requiredInputs: [], outputHint: "number" },
  "user.energy_consumption_report_4": { description: "ENERJİ TÜKETİM RAPORU: DemandCharge = Peak_kW * DemandRate", requiredInputs: [], outputHint: "number" },
  "user.energy_consumption_report_5": { description: "ENERJİ TÜKETİM RAPORU: TOU = SUM(kWh * TOU_Rate)", requiredInputs: [], outputHint: "number" },
  "user.energy_consumption_report_6": { description: "ENERJİ TÜKETİM RAPORU: Total = Base + TOU + Demand + Penalty + Tax", requiredInputs: [], outputHint: "number" },
  "user.energy_consumption_report_7": { description: "ENERJİ TÜKETİM RAPORU: Carbon = Active * EmisFactor * CarbonPrice", requiredInputs: [], outputHint: "number" },
  // ── ENFLASYON ESKALASYON ──
  "user.inflation_escalation_0": { description: "ENFLASYON ESKALASYON: Esc_Mat = (1 + Infl_Mat)^Years", requiredInputs: [], outputHint: "number" },
  "user.inflation_escalation_1": { description: "ENFLASYON ESKALASYON: Esc_Lab = (1 + Infl_Lab)^Years", requiredInputs: [], outputHint: "number" },
  "user.inflation_escalation_2": { description: "ENFLASYON ESKALASYON: BaseAdj = BaseMat * Esc_Mat + BaseLab * Esc_Lab", requiredInputs: [], outputHint: "number" },
  "user.inflation_escalation_3": { description: "ENFLASYON ESKALASYON: RealDisc = ((1 + Nominal) / (1 + Infl)) - 1", requiredInputs: [], outputHint: "number" },
  "user.inflation_escalation_4": { description: "ENFLASYON ESKALASYON: NPV_Nom = SUM(Cash * Esc / (1 + Nom)^t)", requiredInputs: [], outputHint: "number" },
  "user.inflation_escalation_5": { description: "ENFLASYON ESKALASYON: NPV_Real = SUM(Cash / (1 + Real)^t)", requiredInputs: [], outputHint: "number" },
  "user.inflation_escalation_6": { description: "ENFLASYON ESKALASYON: Contingency = BaseAdj * ConfFactor", requiredInputs: [], outputHint: "number" },
  "user.inflation_escalation_7": { description: "ENFLASYON ESKALASYON: Total = BaseAdj + Contingency", requiredInputs: [], outputHint: "number" },
  // ── ENVIRONMENTAL FIRE ──
  "user.environmental_waste_cost_0": { description: "ENVIRONMENTAL FIRE: Cost_Disp = Waste * DispFee", requiredInputs: [], outputHint: "number" },
  "user.environmental_waste_cost_1": { description: "ENVIRONMENTAL FIRE: Cost_Haz = HazMass * (HazFee + Surcharge)", requiredInputs: [], outputHint: "number" },
  "user.environmental_waste_cost_2": { description: "ENVIRONMENTAL FIRE: Cost_Recyc = RecycMass * (SortCost - ScrapRev)", requiredInputs: [], outputHint: "number" },
  "user.environmental_waste_cost_3": { description: "ENVIRONMENTAL FIRE: Cost_Emis = Air * CarbonPrice + Water * TreatCost", requiredInputs: [], outputHint: "number" },
  "user.environmental_waste_cost_4": { description: "ENVIRONMENTAL FIRE: PenaltyRisk = ProbViolation * Fine", requiredInputs: [], outputHint: "number" },
  "user.environmental_waste_cost_5": { description: "ENVIRONMENTAL FIRE: Total = Disp + Haz + Recyc + Emis + Penalty", requiredInputs: [], outputHint: "number" },
  "user.environmental_waste_cost_6": { description: "ENVIRONMENTAL FIRE: WasteIntensity = TotalWaste / Volume", requiredInputs: [], outputHint: "number" },
  "user.environmental_waste_cost_7": { description: "ENVIRONMENTAL FIRE: Circularity = Recyc / TotalWaste", requiredInputs: [], outputHint: "number" },
  // ── EOQ ENVANTER ──
  "user.eoq_inventory_optimizer_0": { description: "EOQ ENVANTER: EOQ = SQRT((2 * Demand * OrderCost) / HoldingCost)", requiredInputs: [], outputHint: "number" },
  "user.eoq_inventory_optimizer_1": { description: "EOQ ENVANTER: ROP = (LeadTime * DailyDemand) + SafetyStock", requiredInputs: [], outputHint: "number" },
  "user.eoq_inventory_optimizer_2": { description: "EOQ ENVANTER: SafetyStock = Z * StdDev * SQRT(LeadTime)", requiredInputs: [], outputHint: "number" },
  "user.eoq_inventory_optimizer_3": { description: "EOQ ENVANTER: TotalCost = (Demand / EOQ) * OrderCost + (EOQ / 2 + Safety) * HoldingCost", requiredInputs: [], outputHint: "number" },
  "user.eoq_inventory_optimizer_4": { description: "EOQ ENVANTER: CycleStock = EOQ / 2", requiredInputs: [], outputHint: "number" },
  "user.eoq_inventory_optimizer_5": { description: "EOQ ENVANTER: Turnover = Demand / AvgInv", requiredInputs: [], outputHint: "number" },
  "user.eoq_inventory_optimizer_6": { description: "EOQ ENVANTER: DaysSales = 365 / Turnover", requiredInputs: [], outputHint: "number" },
  // ── EVM MALİYET FORECAST ──
  "user.evm_cost_forecast_0": { description: "EVM MALİYET FORECAST: SV = EV - PV", requiredInputs: [], outputHint: "number" },
  "user.evm_cost_forecast_1": { description: "EVM MALİYET FORECAST: CV = EV - AC", requiredInputs: [], outputHint: "number" },
  "user.evm_cost_forecast_2": { description: "EVM MALİYET FORECAST: SPI = EV / PV", requiredInputs: [], outputHint: "number" },
  "user.evm_cost_forecast_3": { description: "EVM MALİYET FORECAST: CPI = EV / AC", requiredInputs: [], outputHint: "number" },
  "user.evm_cost_forecast_4": { description: "EVM MALİYET FORECAST: EAC_CPI = BAC / CPI", requiredInputs: [], outputHint: "number" },
  "user.evm_cost_forecast_5": { description: "EVM MALİYET FORECAST: EAC_CPI_SPI = AC + ((BAC - EV) / (CPI * SPI))", requiredInputs: [], outputHint: "number" },
  "user.evm_cost_forecast_6": { description: "EVM MALİYET FORECAST: ETC = EAC - AC", requiredInputs: [], outputHint: "number" },
  "user.evm_cost_forecast_7": { description: "EVM MALİYET FORECAST: VAC = BAC - EAC", requiredInputs: [], outputHint: "number" },
  "user.evm_cost_forecast_8": { description: "EVM MALİYET FORECAST: TCPI = (BAC - EV) / (BAC - AC)", requiredInputs: [], outputHint: "number" },
  // ── FABRİKA YERLEŞİM MESAFE ──
  "user.factory_layout_distance_0": { description: "FABRİKA YERLEŞİM MESAFE: Dist_ij = ABS(X_i - X_j) + ABS(Y_i - Y_j)", requiredInputs: [], outputHint: "number" },
  "user.factory_layout_distance_1": { description: "FABRİKA YERLEŞİM MESAFE: FlowCost = SUM(Flow_ij * Dist_ij * CostPerDist)", requiredInputs: [], outputHint: "number" },
  "user.factory_layout_distance_2": { description: "FABRİKA YERLEŞİM MESAFE: AdjScore = SUM(Flow_ij * AdjFactor_ij)", requiredInputs: [], outputHint: "number" },
  "user.factory_layout_distance_3": { description: "FABRİKA YERLEŞİM MESAFE: SpaceUtil = EquipArea / FacArea", requiredInputs: [], outputHint: "number" },
  "user.factory_layout_distance_4": { description: "FABRİKA YERLEŞİM MESAFE: MatHandCost = FlowCost * HandRate", requiredInputs: [], outputHint: "number" },
  "user.factory_layout_distance_5": { description: "FABRİKA YERLEŞİM MESAFE: Congestion = 1 + (CrossTraffic / AisleCap)", requiredInputs: [], outputHint: "number" },
  "user.factory_layout_distance_6": { description: "FABRİKA YERLEŞİM MESAFE: TotalCost = MatHand + Space + Congestion", requiredInputs: [], outputHint: "number" },
  // ── FAİZ ORANI RİSKİ ──
  "user.interest_rate_risk_0": { description: "FAİZ ORANI RİSKİ: Exposure = FloatingDebt * (1 - HedgeRatio)", requiredInputs: [], outputHint: "number" },
  "user.interest_rate_risk_1": { description: "FAİZ ORANI RİSKİ: ShockImpact = Exposure * BpsChange / 10000", requiredInputs: [], outputHint: "number" },
  "user.interest_rate_risk_2": { description: "FAİZ ORANI RİSKİ: DurGap = AssetDur - LiabDur", requiredInputs: [], outputHint: "number" },
  "user.interest_rate_risk_3": { description: "FAİZ ORANI RİSKİ: EVE_Change = -DurGap * AssetVal * RateChange", requiredInputs: [], outputHint: "number" },
  "user.interest_rate_risk_4": { description: "FAİZ ORANI RİSKİ: NIM = (Inc - Exp) / EarningAssets", requiredInputs: [], outputHint: "number" },
  "user.interest_rate_risk_5": { description: "FAİZ ORANI RİSKİ: VaR = PortVal * Volatility * Z", requiredInputs: [], outputHint: "number" },
  "user.interest_rate_risk_6": { description: "FAİZ ORANI RİSKİ: HedgeCost = Notional * SwapSpread", requiredInputs: [], outputHint: "number" },
  "user.interest_rate_risk_7": { description: "FAİZ ORANI RİSKİ: BreakEven = Fixed - Floating_Curr", requiredInputs: [], outputHint: "number" },
  // ── FILAMENT RECYCLING ──
  "user.filament_recycling_0": { description: "FILAMENT RECYCLING: Cost_Virgin = Price_V * (1 + Scrap_V) + Transp_V", requiredInputs: [], outputHint: "number" },
  "user.filament_recycling_1": { description: "FILAMENT RECYCLING: Cost_Recyc = (Collect + Sort + Pellet) / Yield", requiredInputs: [], outputHint: "number" },
  "user.filament_recycling_2": { description: "FILAMENT RECYCLING: QualPenalty = (Tensile_V - Tensile_R) * AppFactor", requiredInputs: [], outputHint: "number" },
  "user.filament_recycling_3": { description: "FILAMENT RECYCLING: EnergySav = (Energy_V - Energy_R) * EnergyCost", requiredInputs: [], outputHint: "number" },
  "user.filament_recycling_4": { description: "FILAMENT RECYCLING: CarbonCred = (CO2_V - CO2_R) * CarbonPrice", requiredInputs: [], outputHint: "number" },
  "user.filament_recycling_5": { description: "FILAMENT RECYCLING: Total_R = Cost_Recyc + QualPenalty - EnergySav - CarbonCred", requiredInputs: [], outputHint: "number" },
  "user.filament_recycling_6": { description: "FILAMENT RECYCLING: ROI = (Cost_V - Total_R) * Vol / Capex", requiredInputs: [], outputHint: "number" },
  // ── FİYAT ESNEKLİĞİ ──
  "user.price_elasticity_0": { description: "FİYAT ESNEKLİĞİ: Elasticity = PctChange_Dem / PctChange_Price", requiredInputs: [], outputHint: "number" },
  "user.price_elasticity_1": { description: "FİYAT ESNEKLİĞİ: NewDem = CurrDem * (1 + Elast * PctChange_Price)", requiredInputs: [], outputHint: "number" },
  "user.price_elasticity_2": { description: "FİYAT ESNEKLİĞİ: NewRev = NewPrice * NewDem", requiredInputs: [], outputHint: "number" },
  "user.price_elasticity_3": { description: "FİYAT ESNEKLİĞİ: NewMargin = (NewPrice - VarCost) * NewDem - Fixed", requiredInputs: [], outputHint: "number" },
  "user.price_elasticity_4": { description: "FİYAT ESNEKLİĞİ: MaxPrice = (Elast / (Elast + 1)) * VarCost", requiredInputs: [], outputHint: "number" },
  "user.price_elasticity_5": { description: "FİYAT ESNEKLİĞİ: Markup = -1 / (Elast + 1)", requiredInputs: [], outputHint: "number" },
  "user.price_elasticity_6": { description: "FİYAT ESNEKLİĞİ: CannibLoss = NewDem * CannibRate * Margin_Other", requiredInputs: [], outputHint: "number" },
  "user.price_elasticity_7": { description: "FİYAT ESNEKLİĞİ: NetImpact = NewMargin - CurrMargin - Cannib", requiredInputs: [], outputHint: "number" },
  // ── FLEXIBLE MANUFACTURING ROI ──
  "user.flexible_manufacturing_roi_0": { description: "FLEXIBLE MANUFACTURING ROI: Cost_Ded = Mach_Ded + Setup_Ded * Changeovers + Inv_High", requiredInputs: [], outputHint: "number" },
  "user.flexible_manufacturing_roi_1": { description: "FLEXIBLE MANUFACTURING ROI: Cost_Flex = Mach_FMS + Tool_FMS + Prog + Maint", requiredInputs: [], outputHint: "number" },
  "user.flexible_manufacturing_roi_2": { description: "FLEXIBLE MANUFACTURING ROI: FlexVal = (TTM_Red * RevGain) + (CustPrem * Vol)", requiredInputs: [], outputHint: "number" },
  "user.flexible_manufacturing_roi_3": { description: "FLEXIBLE MANUFACTURING ROI: InvSav = (WIP_Ded - WIP_Flex) * CarryCost", requiredInputs: [], outputHint: "number" },
  "user.flexible_manufacturing_roi_4": { description: "FLEXIBLE MANUFACTURING ROI: ScrapRed = (Scrap_Ded - Scrap_Flex) * Vol * UnitCost", requiredInputs: [], outputHint: "number" },
  "user.flexible_manufacturing_roi_5": { description: "FLEXIBLE MANUFACTURING ROI: ROI = (Cost_Ded - Cost_Flex + FlexVal + InvSav + ScrapRed) / Capex", requiredInputs: [], outputHint: "number" },
  // ── GAGE R&R MALİYET ──
  "user.gage_rnr_cost_0": { description: "GAGE R&R MALİYET: EV = Range_Avg * d2_star", requiredInputs: [], outputHint: "number" },
  "user.gage_rnr_cost_1": { description: "GAGE R&R MALİYET: AV = SQRT((Range_Ops / d2_star)^2 - (EV^2 / (n * r)))", requiredInputs: [], outputHint: "number" },
  "user.gage_rnr_cost_2": { description: "GAGE R&R MALİYET: GRR = SQRT(EV^2 + AV^2)", requiredInputs: [], outputHint: "number" },
  "user.gage_rnr_cost_3": { description: "GAGE R&R MALİYET: PV = Range_Parts / d2_star", requiredInputs: [], outputHint: "number" },
  "user.gage_rnr_cost_4": { description: "GAGE R&R MALİYET: TV = SQRT(GRR^2 + PV^2)", requiredInputs: [], outputHint: "number" },
  "user.gage_rnr_cost_5": { description: "GAGE R&R MALİYET: PctGRR = (GRR / TV) * 100", requiredInputs: [], outputHint: "number" },
  "user.gage_rnr_cost_6": { description: "GAGE R&R MALİYET: CostError = (FalseAcc * EscapeCost) + (FalseRej * ScrapCost)", requiredInputs: [], outputHint: "number" },
  "user.gage_rnr_cost_7": { description: "GAGE R&R MALİYET: OptTol = GRR * 6", requiredInputs: [], outputHint: "number" },
  "user.gage_rnr_cost_8": { description: "GAGE R&R MALİYET: FinImpact = PctGRR * TotalQualCost", requiredInputs: [], outputHint: "number" },
  // ── GIDA FİRE MARJ ──
  "user.food_waste_margin_0": { description: "GIDA FİRE MARJ: Yield = Finished / Raw", requiredInputs: [], outputHint: "number" },
  "user.food_waste_margin_1": { description: "GIDA FİRE MARJ: Shrinkage = Raw - Finished", requiredInputs: [], outputHint: "number" },
  "user.food_waste_margin_2": { description: "GIDA FİRE MARJ: Cost_Shrink = Shrinkage * RawCost", requiredInputs: [], outputHint: "number" },
  "user.food_waste_margin_3": { description: "GIDA FİRE MARJ: Cost_Spoil = Spoiled * ProdCost", requiredInputs: [], outputHint: "number" },
  "user.food_waste_margin_4": { description: "GIDA FİRE MARJ: Cost_Over = Excess * (UnitCost - Salvage)", requiredInputs: [], outputHint: "number" },
  "user.food_waste_margin_5": { description: "GIDA FİRE MARJ: MarginLeak = Shrink + Spoil + Over", requiredInputs: [], outputHint: "number" },
  "user.food_waste_margin_6": { description: "GIDA FİRE MARJ: OEE_Food = Avail * Perf * Qual_Yield", requiredInputs: [], outputHint: "number" },
  "user.food_waste_margin_7": { description: "GIDA FİRE MARJ: TheoUsage = Recipe * ActualProd", requiredInputs: [], outputHint: "number" },
  "user.food_waste_margin_8": { description: "GIDA FİRE MARJ: Variance = Actual - Theo", requiredInputs: [], outputHint: "number" },
  // ── GÜBRE DOZAJ ──
  "user.fertilizer_dosage_0": { description: "GÜBRE DOZAJ: NutReq = YieldTarget * RemRate", requiredInputs: [], outputHint: "number" },
  "user.fertilizer_dosage_1": { description: "GÜBRE DOZAJ: SoilSupp = SoilTest * ConvFactor", requiredInputs: [], outputHint: "number" },
  "user.fertilizer_dosage_2": { description: "GÜBRE DOZAJ: FertNeed = (NutReq - SoilSupp) / Eff", requiredInputs: [], outputHint: "number" },
  "user.fertilizer_dosage_3": { description: "GÜBRE DOZAJ: AppRate = FertNeed / ContentPct", requiredInputs: [], outputHint: "number" },
  "user.fertilizer_dosage_4": { description: "GÜBRE DOZAJ: Cost = AppRate * Area * Price", requiredInputs: [], outputHint: "number" },
  "user.fertilizer_dosage_5": { description: "GÜBRE DOZAJ: EnvRisk = (AppRate - Uptake) * Leach", requiredInputs: [], outputHint: "number" },
  "user.fertilizer_dosage_6": { description: "GÜBRE DOZAJ: ROI = (YieldInc * CropPrice - Cost) / Cost", requiredInputs: [], outputHint: "number" },
  "user.fertilizer_dosage_7": { description: "GÜBRE DOZAJ: Precision = BaseRate * (1 + ZoneFactor)", requiredInputs: [], outputHint: "number" },
  // ── HACCP DEVIATION ──
  "user.haccp_deviation_cost_0": { description: "HACCP DEVIATION: Cost_Hold = QuarVol * HoldCost * Days", requiredInputs: [], outputHint: "number" },
  "user.haccp_deviation_cost_1": { description: "HACCP DEVIATION: Cost_Test = Samples * LabCost", requiredInputs: [], outputHint: "number" },
  "user.haccp_deviation_cost_2": { description: "HACCP DEVIATION: Cost_Rework = DevVol * ReworkCost", requiredInputs: [], outputHint: "number" },
  "user.haccp_deviation_cost_3": { description: "HACCP DEVIATION: Cost_Disp = CondVol * DispCost + LostMat", requiredInputs: [], outputHint: "number" },
  "user.haccp_deviation_cost_4": { description: "HACCP DEVIATION: Cost_Recall = Notif + Log_Rev + RetailPen + Brand", requiredInputs: [], outputHint: "number" },
  "user.haccp_deviation_cost_5": { description: "HACCP DEVIATION: Fine = ProbDet * FineAmt", requiredInputs: [], outputHint: "number" },
  "user.haccp_deviation_cost_6": { description: "HACCP DEVIATION: Total = Hold + Test + Rework + Disp + Recall + Fine", requiredInputs: [], outputHint: "number" },
  "user.haccp_deviation_cost_7": { description: "HACCP DEVIATION: RPN = Sev * Occ * Det", requiredInputs: [], outputHint: "number" },
  // ── HACİMSEL AĞIRLIK ──
  "user.volumetric_weight_chargeable_0": { description: "HACİMSEL AĞIRLIK: VolWeight_Air = (L * W * H) / 6000", requiredInputs: [], outputHint: "number" },
  "user.volumetric_weight_chargeable_1": { description: "HACİMSEL AĞIRLIK: VolWeight_Road = (L * W * H) / 5000", requiredInputs: [], outputHint: "number" },
  "user.volumetric_weight_chargeable_2": { description: "HACİMSEL AĞIRLIK: VolWeight_Sea = (L * W * H) / 1000", requiredInputs: [], outputHint: "number" },
  "user.volumetric_weight_chargeable_3": { description: "HACİMSEL AĞIRLIK: Chargeable = MAX(Gross, VolWeight)", requiredInputs: [], outputHint: "number" },
  "user.volumetric_weight_chargeable_4": { description: "HACİMSEL AĞIRLIK: Freight = Chargeable * Rate", requiredInputs: [], outputHint: "number" },
  "user.volumetric_weight_chargeable_5": { description: "HACİMSEL AĞIRLIK: Density = Gross / Vol", requiredInputs: [], outputHint: "number" },
  "user.volumetric_weight_chargeable_6": { description: "HACİMSEL AĞIRLIK: StackLoss = 1 - (ActualLoad / MaxCont)", requiredInputs: [], outputHint: "number" },
  "user.volumetric_weight_chargeable_7": { description: "HACİMSEL AĞIRLIK: Ineff = (Chargeable - Gross) * Rate", requiredInputs: [], outputHint: "number" },
  // ── HAFİFLİK MALİYET TASARRUFU ──
  "user.lightweight_cost_savings_0": { description: "HAFİFLİK MALİYET TASARRUFU: WeightRed = Mass_Orig - Mass_LW", requiredInputs: [], outputHint: "number" },
  "user.lightweight_cost_savings_1": { description: "HAFİFLİK MALİYET TASARRUFU: FuelSav_Auto = WeightRed * FuelFactor * Dist * FuelPrice", requiredInputs: [], outputHint: "number" },
  "user.lightweight_cost_savings_2": { description: "HAFİFLİK MALİYET TASARRUFU: FuelSav_Aero = WeightRed * BurnFactor * Hours * JetPrice", requiredInputs: [], outputHint: "number" },
  "user.lightweight_cost_savings_3": { description: "HAFİFLİK MALİYET TASARRUFU: PayloadGain = WeightRed * RevPerKg", requiredInputs: [], outputHint: "number" },
  "user.lightweight_cost_savings_4": { description: "HAFİFLİK MALİYET TASARRUFU: MatPrem = (Cost_LW - Cost_Orig) * Vol", requiredInputs: [], outputHint: "number" },
  "user.lightweight_cost_savings_5": { description: "HAFİFLİK MALİYET TASARRUFU: ToolDelta = Tool_LW - Tool_Orig", requiredInputs: [], outputHint: "number" },
  "user.lightweight_cost_savings_6": { description: "HAFİFLİK MALİYET TASARRUFU: NetSav = (FuelSav + Payload) * Life - MatPrem - ToolDelta", requiredInputs: [], outputHint: "number" },
  // ── HURDA ORANI OPTİMİZE ──
  "user.scrap_rate_optimize_0": { description: "HURDA ORANI OPTİMİZE: ScrapRate = ScrapQty / TotalInput", requiredInputs: [], outputHint: "number" },
  "user.scrap_rate_optimize_1": { description: "HURDA ORANI OPTİMİZE: Cost_Mat = ScrapQty * MatCost", requiredInputs: [], outputHint: "number" },
  "user.scrap_rate_optimize_2": { description: "HURDA ORANI OPTİMİZE: Cost_Lab = ScrapQty * Cycle * LabRate", requiredInputs: [], outputHint: "number" },
  "user.scrap_rate_optimize_3": { description: "HURDA ORANI OPTİMİZE: Cost_OH = ScrapQty * Cycle * MachRate", requiredInputs: [], outputHint: "number" },
  "user.scrap_rate_optimize_4": { description: "HURDA ORANI OPTİMİZE: OppCost = ScrapQty * UnitMargin", requiredInputs: [], outputHint: "number" },
  "user.scrap_rate_optimize_5": { description: "HURDA ORANI OPTİMİZE: TotalCost = Mat + Lab + OH + Opp - Salvage", requiredInputs: [], outputHint: "number" },
  "user.scrap_rate_optimize_6": { description: "HURDA ORANI OPTİMİZE: Pareto = SORT(Defects, Freq, DESC)", requiredInputs: [], outputHint: "number" },
  "user.scrap_rate_optimize_7": { description: "HURDA ORANI OPTİMİZE: Target = Benchmark * (1 - ImpFactor)", requiredInputs: [], outputHint: "number" },
  // ── HVAC KAPASİTE ──
  "user.hvac_capacity_0": { description: "HVAC KAPASİTE: Sensible = 1.08 * CFM * DeltaT", requiredInputs: [], outputHint: "number" },
  "user.hvac_capacity_1": { description: "HVAC KAPASİTE: Latent = 0.68 * CFM * DeltaW", requiredInputs: [], outputHint: "number" },
  "user.hvac_capacity_2": { description: "HVAC KAPASİTE: Total = Sensible + Latent", requiredInputs: [], outputHint: "number" },
  "user.hvac_capacity_3": { description: "HVAC KAPASİTE: Envelope = U * Area * DeltaT", requiredInputs: [], outputHint: "number" },
  "user.hvac_capacity_4": { description: "HVAC KAPASİTE: Internal = Occ * SensPer + Light + Equip", requiredInputs: [], outputHint: "number" },
  "user.hvac_capacity_5": { description: "HVAC KAPASİTE: Vent = CFM_Out * 1.08 * (T_Out - T_In)", requiredInputs: [], outputHint: "number" },
  "user.hvac_capacity_6": { description: "HVAC KAPASİTE: Tons = Total / 12000", requiredInputs: [], outputHint: "number" },
  "user.hvac_capacity_7": { description: "HVAC KAPASİTE: EER = BTU / W", requiredInputs: [], outputHint: "number" },
  "user.hvac_capacity_8": { description: "HVAC KAPASİTE: AnnualCost = (Total / EER) * Hours * ElecRate", requiredInputs: [], outputHint: "number" },
  // ── HYDRAULIC SİSTEM KAYIP ──
  "user.hydraulic_system_loss_0": { description: "HYDRAULIC SİSTEM KAYIP: Loss_Leak = Q_Leak * P", requiredInputs: [], outputHint: "number" },
  "user.hydraulic_system_loss_1": { description: "HYDRAULIC SİSTEM KAYIP: Loss_Fric = DeltaP_Pipe * Q_Flow", requiredInputs: [], outputHint: "number" },
  "user.hydraulic_system_loss_2": { description: "HYDRAULIC SİSTEM KAYIP: Loss_Valve = DeltaP_Valve * Q_Flow", requiredInputs: [], outputHint: "number" },
  "user.hydraulic_system_loss_3": { description: "HYDRAULIC SİSTEM KAYIP: Heat = Loss_Leak + Loss_Fric + Loss_Valve", requiredInputs: [], outputHint: "number" },
  "user.hydraulic_system_loss_4": { description: "HYDRAULIC SİSTEM KAYIP: Eff = (P_Out / P_In) * 100", requiredInputs: [], outputHint: "number" },
  "user.hydraulic_system_loss_5": { description: "HYDRAULIC SİSTEM KAYIP: Cost_Loss = Heat * Hours * ElecRate", requiredInputs: [], outputHint: "number" },
  "user.hydraulic_system_loss_6": { description: "HYDRAULIC SİSTEM KAYIP: Degrade = (T_Avg - Thresh) * FluidCost", requiredInputs: [], outputHint: "number" },
  "user.hydraulic_system_loss_7": { description: "HYDRAULIC SİSTEM KAYIP: Cool = Heat * COP * ElecRate", requiredInputs: [], outputHint: "number" },
  // ── ISI EXCHANGER FOULING ──
  "user.heat_exchanger_fouling_0": { description: "ISI EXCHANGER FOULING: R_foul = (1 / U_dirty) - (1 / U_clean)", requiredInputs: [], outputHint: "number" },
  "user.heat_exchanger_fouling_1": { description: "ISI EXCHANGER FOULING: Loss = Area * U_clean * LMTD - Area * U_dirty * LMTD", requiredInputs: [], outputHint: "number" },
  "user.heat_exchanger_fouling_2": { description: "ISI EXCHANGER FOULING: EnergyPen = Loss * Hours / BoilEff", requiredInputs: [], outputHint: "number" },
  "user.heat_exchanger_fouling_3": { description: "ISI EXCHANGER FOULING: Cost_Energy = EnergyPen * FuelCost", requiredInputs: [], outputHint: "number" },
  "user.heat_exchanger_fouling_4": { description: "ISI EXCHANGER FOULING: DP_Inc = DeltaP_dirty - DeltaP_clean", requiredInputs: [], outputHint: "number" },
  "user.heat_exchanger_fouling_5": { description: "ISI EXCHANGER FOULING: PumpInc = DP_Inc * Flow * Hours / PumpEff", requiredInputs: [], outputHint: "number" },
  "user.heat_exchanger_fouling_6": { description: "ISI EXCHANGER FOULING: Total = Cost_Energy + PumpInc", requiredInputs: [], outputHint: "number" },
  "user.heat_exchanger_fouling_7": { description: "ISI EXCHANGER FOULING: ROI = Total / CleanCost", requiredInputs: [], outputHint: "number" },
  // ── ISO 50001 BASELINE ──
  "user.iso_50001_baseline_0": { description: "ISO 50001 BASELINE: EnPI = Energy / Volume", requiredInputs: [], outputHint: "number" },
  "user.iso_50001_baseline_1": { description: "ISO 50001 BASELINE: Baseline = Intercept + (Slope1 * Prod) + (Slope2 * DD)", requiredInputs: [], outputHint: "number" },
  "user.iso_50001_baseline_2": { description: "ISO 50001 BASELINE: Cusum_t = Actual - Predicted", requiredInputs: [], outputHint: "number" },
  "user.iso_50001_baseline_3": { description: "ISO 50001 BASELINE: Cusum_Cum = SUM(Cusum_t)", requiredInputs: [], outputHint: "number" },
  "user.iso_50001_baseline_4": { description: "ISO 50001 BASELINE: Savings = Predicted - Actual", requiredInputs: [], outputHint: "number" },
  "user.iso_50001_baseline_5": { description: "ISO 50001 BASELINE: Norm = DD_Curr / DD_Hist", requiredInputs: [], outputHint: "number" },
  "user.iso_50001_baseline_6": { description: "ISO 50001 BASELINE: Sig = R2 > 0.75 AND P < 0.05", requiredInputs: [], outputHint: "number" },
  "user.iso_50001_baseline_7": { description: "ISO 50001 BASELINE: Target = Baseline * (1 - RedTarget)", requiredInputs: [], outputHint: "number" },
  // ── İÇ VERİM ORANI IRR ──
  "user.irr_investment_0": { description: "İÇ VERİM ORANI IRR: NPV = SUM(Cash_t / (1 + r)^t)", requiredInputs: [], outputHint: "number" },
  "user.irr_investment_1": { description: "İÇ VERİM ORANI IRR: IRR = r where NPV = 0", requiredInputs: [], outputHint: "number" },
  "user.irr_investment_2": { description: "İÇ VERİM ORANI IRR: MIRR = (FV_Pos / PV_Neg)^(1/n) - 1", requiredInputs: [], outputHint: "number" },
  "user.irr_investment_3": { description: "İÇ VERİM ORANI IRR: Payback = Year_Before + (Unrecovered / Cash_Rec)", requiredInputs: [], outputHint: "number" },
  "user.irr_investment_4": { description: "İÇ VERİM ORANI IRR: PI = PV_Future / InitInv", requiredInputs: [], outputHint: "number" },
  "user.irr_investment_5": { description: "İÇ VERİM ORANI IRR: Annuity = NPV * (r * (1 + r)^n) / ((1 + r)^n - 1)", requiredInputs: [], outputHint: "number" },
  "user.irr_investment_6": { description: "İÇ VERİM ORANI IRR: Sens = Delta_IRR / Delta_Var", requiredInputs: [], outputHint: "number" },
  // ── İLERLEME YEM MALİYET ──
  "user.feed_cost_formulation_0": { description: "İLERLEME YEM MALİYET: Cost_Ing = InclRate * Price", requiredInputs: [], outputHint: "number" },
  "user.feed_cost_formulation_1": { description: "İLERLEME YEM MALİYET: Cost_Base = SUM(Cost_Ing)", requiredInputs: [], outputHint: "number" },
  "user.feed_cost_formulation_2": { description: "İLERLEME YEM MALİYET: Cost_Proc = Grind + Mix + Pellet", requiredInputs: [], outputHint: "number" },
  "user.feed_cost_formulation_3": { description: "İLERLEME YEM MALİYET: Cost_Add = SUM(Enz + Vit + Tox)", requiredInputs: [], outputHint: "number" },
  "user.feed_cost_formulation_4": { description: "İLERLEME YEM MALİYET: Shrink = Cost_Base * ShrinkRate", requiredInputs: [], outputHint: "number" },
  "user.feed_cost_formulation_5": { description: "İLERLEME YEM MALİYET: FCR = FeedCons / WeightGain", requiredInputs: [], outputHint: "number" },
  "user.feed_cost_formulation_6": { description: "İLERLEME YEM MALİYET: CostPerKg = (Base + Proc + Add + Shrink) * FCR", requiredInputs: [], outputHint: "number" },
  "user.feed_cost_formulation_7": { description: "İLERLEME YEM MALİYET: Opt = MIN(Base) SUBJECT TO Constraints", requiredInputs: [], outputHint: "number" },
  // ── İSKELE KİRALAMA ──
  "user.scaffold_rental_cost_0": { description: "İSKELE KİRALAMA: Area = Perim * Height", requiredInputs: [], outputHint: "number" },
  "user.scaffold_rental_cost_1": { description: "İSKELE KİRALAMA: Vol = Area * Standoff", requiredInputs: [], outputHint: "number" },
  "user.scaffold_rental_cost_2": { description: "İSKELE KİRALAMA: Rental = Area * Rate * Dur", requiredInputs: [], outputHint: "number" },
  "user.scaffold_rental_cost_3": { description: "İSKELE KİRALAMA: Lab_Erect = Area * ErectRate", requiredInputs: [], outputHint: "number" },
  "user.scaffold_rental_cost_4": { description: "İSKELE KİRALAMA: Lab_Dism = Area * DismRate", requiredInputs: [], outputHint: "number" },
  "user.scaffold_rental_cost_5": { description: "İSKELE KİRALAMA: Transp = Trips * TruckRate", requiredInputs: [], outputHint: "number" },
  "user.scaffold_rental_cost_6": { description: "İSKELE KİRALAMA: Total = Rental + Lab_Erect + Lab_Dism + Transp", requiredInputs: [], outputHint: "number" },
  "user.scaffold_rental_cost_7": { description: "İSKELE KİRALAMA: OptDur = CritPath + Buffer - Overlap", requiredInputs: [], outputHint: "number" },
  "user.scaffold_rental_cost_8": { description: "İSKELE KİRALAMA: Overrun = MAX(0, Actual - OptDur) * DailyRate", requiredInputs: [], outputHint: "number" },
  // ── İSTATİSTİKSEL PROSES KONTROL ──
  "user.spc_limit_control_0": { description: "İSTATİSTİKSEL PROSES KONTROL: X_Bar_Bar = AVERAGE(Means)", requiredInputs: [], outputHint: "number" },
  "user.spc_limit_control_1": { description: "İSTATİSTİKSEL PROSES KONTROL: R_Bar = AVERAGE(Ranges)", requiredInputs: [], outputHint: "number" },
  "user.spc_limit_control_2": { description: "İSTATİSTİKSEL PROSES KONTROL: S_Bar = AVERAGE(StdDevs)", requiredInputs: [], outputHint: "number" },
  "user.spc_limit_control_3": { description: "İSTATİSTİKSEL PROSES KONTROL: UCL_X = X_Bar_Bar + (A2 * R_Bar)", requiredInputs: [], outputHint: "number" },
  "user.spc_limit_control_4": { description: "İSTATİSTİKSEL PROSES KONTROL: LCL_X = X_Bar_Bar - (A2 * R_Bar)", requiredInputs: [], outputHint: "number" },
  "user.spc_limit_control_5": { description: "İSTATİSTİKSEL PROSES KONTROL: UCL_R = D4 * R_Bar", requiredInputs: [], outputHint: "number" },
  "user.spc_limit_control_6": { description: "İSTATİSTİKSEL PROSES KONTROL: LCL_R = D3 * R_Bar", requiredInputs: [], outputHint: "number" },
  "user.spc_limit_control_7": { description: "İSTATİSTİKSEL PROSES KONTROL: Sigma = R_Bar / d2", requiredInputs: [], outputHint: "number" },
  "user.spc_limit_control_8": { description: "İSTATİSTİKSEL PROSES KONTROL: Cp = (USL - LSL) / (6 * Sigma)", requiredInputs: [], outputHint: "number" },
  // ── İŞLEME STRATEJİSİ SÜRE ──
  "user.machining_strategy_0": { description: "İŞLEME STRATEJİSİ SÜRE: MRR = V_c * f * a_p", requiredInputs: [], outputHint: "number" },
  "user.machining_strategy_1": { description: "İŞLEME STRATEJİSİ SÜRE: Power = MRR * SpecEnergy", requiredInputs: [], outputHint: "number" },
  "user.machining_strategy_2": { description: "İŞLEME STRATEJİSİ SÜRE: ToolLife = C / (V_c^n * f^m)", requiredInputs: [], outputHint: "number" },
  "user.machining_strategy_3": { description: "İŞLEME STRATEJİSİ SÜRE: Cost = MIN(Mach + Change + Tool)", requiredInputs: [], outputHint: "number" },
  "user.machining_strategy_4": { description: "İŞLEME STRATEJİSİ SÜRE: Opt_Vc = (C / (T_opt)^n)^(1/n)", requiredInputs: [], outputHint: "number" },
  "user.machining_strategy_5": { description: "İŞLEME STRATEJİSİ SÜRE: T_opt = ((1/n - 1) * (ChangeTime + ToolCost/MachRate))", requiredInputs: [], outputHint: "number" },
  "user.machining_strategy_6": { description: "İŞLEME STRATEJİSİ SÜRE: Ra = f^2 / (8 * NoseRad)", requiredInputs: [], outputHint: "number" },
  "user.machining_strategy_7": { description: "İŞLEME STRATEJİSİ SÜRE: Check = Power < MaxPower AND Ra < Tol", requiredInputs: [], outputHint: "number" },
  // ── KAIZEN TASARRUF TAKİPÇİSİ ──
  "user.kaizen_savings_tracker_0": { description: "KAIZEN TASARRUF TAKİPÇİSİ: Hard = (Baseline - Actual) * Vol", requiredInputs: [], outputHint: "number" },
  "user.kaizen_savings_tracker_1": { description: "KAIZEN TASARRUF TAKİPÇİSİ: Soft = TimeSaved * LabRate * Conv", requiredInputs: [], outputHint: "number" },
  "user.kaizen_savings_tracker_2": { description: "KAIZEN TASARRUF TAKİPÇİSİ: ImpCost = Lab_K + Mat + Down", requiredInputs: [], outputHint: "number" },
  "user.kaizen_savings_tracker_3": { description: "KAIZEN TASARRUF TAKİPÇİSİ: ROI = (Hard + Soft - ImpCost) / ImpCost", requiredInputs: [], outputHint: "number" },
  "user.kaizen_savings_tracker_4": { description: "KAIZEN TASARRUF TAKİPÇİSİ: Payback = ImpCost / MonthSav", requiredInputs: [], outputHint: "number" },
  "user.kaizen_savings_tracker_5": { description: "KAIZEN TASARRUF TAKİPÇİSİ: Sust = Sav_M6 / Sav_M1", requiredInputs: [], outputHint: "number" },
  "user.kaizen_savings_tracker_6": { description: "KAIZEN TASARRUF TAKİPÇİSİ: Cum = SUM(MonthSav)", requiredInputs: [], outputHint: "number" },
  "user.kaizen_savings_tracker_7": { description: "KAIZEN TASARRUF TAKİPÇİSİ: Opp = Time_K * ProdRate * Margin", requiredInputs: [], outputHint: "number" },
  // ── Kalite Maliyeti PAF ──
  "user.quality_cost_paf_0": { description: "Kalite Maliyeti PAF: PreventionCost = Training + QualityPlanning + SupplierEvaluation + DesignReview", requiredInputs: [], outputHint: "number" },
  "user.quality_cost_paf_1": { description: "Kalite Maliyeti PAF: AppraisalCost = Inspection + Testing + Calibration + Audit", requiredInputs: [], outputHint: "number" },
  "user.quality_cost_paf_2": { description: "Kalite Maliyeti PAF: InternalFailure = Scrap + Rework + Reinspection + Downtime", requiredInputs: [], outputHint: "number" },
  "user.quality_cost_paf_3": { description: "Kalite Maliyeti PAF: ExternalFailure = Warranty + Returns + Recall + Liability + LostSales", requiredInputs: [], outputHint: "number" },
  "user.quality_cost_paf_4": { description: "Kalite Maliyeti PAF: TotalCOQ = PreventionCost + AppraisalCost + InternalFailure + ExternalFailure", requiredInputs: [], outputHint: "number" },
  "user.quality_cost_paf_5": { description: "Kalite Maliyeti PAF: COQ_Ratio = TotalCOQ / TotalRevenue", requiredInputs: [], outputHint: "number" },
  "user.quality_cost_paf_6": { description: "Kalite Maliyeti PAF: PAF_Ratio = PreventionCost / TotalCOQ", requiredInputs: [], outputHint: "number" },
  // ── Karbon Ayak izi Check ──
  "user.carbon_footprint_check_0": { description: "Karbon Ayak izi Check: Scope1 = SUM(FuelConsumption_i * EmissionFactor_i) + FugitiveEmissions", requiredInputs: [], outputHint: "number" },
  "user.carbon_footprint_check_1": { description: "Karbon Ayak izi Check: Scope2_Location = ElectricityConsumption * GridEmissionFactor", requiredInputs: [], outputHint: "number" },
  "user.carbon_footprint_check_2": { description: "Karbon Ayak izi Check: Scope2_Market = ElectricityConsumption * (GridFactor - REC_Factor)", requiredInputs: [], outputHint: "number" },
  "user.carbon_footprint_check_3": { description: "Karbon Ayak izi Check: Scope3_Upstream = SUM(Material_i * MaterialEF_i) + Logistics_Emissions", requiredInputs: [], outputHint: "number" },
  "user.carbon_footprint_check_4": { description: "Karbon Ayak izi Check: TotalCarbon = Scope1 + Scope2_Market + Scope3_Upstream", requiredInputs: [], outputHint: "number" },
  "user.carbon_footprint_check_5": { description: "Karbon Ayak izi Check: CarbonIntensity = TotalCarbon / ProductionVolume", requiredInputs: [], outputHint: "number" },
  "user.carbon_footprint_check_6": { description: "Karbon Ayak izi Check: FinancialRisk = TotalCarbon * ForecastedCarbonPrice", requiredInputs: [], outputHint: "number" },
  // ── Kaynak Hacmi ve Maliyeti ──
  "user.weld_volume_cost_0": { description: "Kaynak Hacmi ve Maliyeti: Area_Weld = (Leg^2) / 2", requiredInputs: [], outputHint: "number" },
  "user.weld_volume_cost_1": { description: "Kaynak Hacmi ve Maliyeti: Volume_Weld = Area_Weld * Length", requiredInputs: [], outputHint: "number" },
  "user.weld_volume_cost_2": { description: "Kaynak Hacmi ve Maliyeti: Weight_Deposited = Volume_Weld * Density", requiredInputs: [], outputHint: "number" },
  "user.weld_volume_cost_3": { description: "Kaynak Hacmi ve Maliyeti: Weight_Electrode = Weight_Deposited / DepositionEfficiency", requiredInputs: [], outputHint: "number" },
  "user.weld_volume_cost_4": { description: "Kaynak Hacmi ve Maliyeti: Cost_Filler = Weight_Electrode * PricePerKg", requiredInputs: [], outputHint: "number" },
  "user.weld_volume_cost_5": { description: "Kaynak Hacmi ve Maliyeti: Cost_Gas = GasFlowRate * ArcTime * GasPrice", requiredInputs: [], outputHint: "number" },
  "user.weld_volume_cost_6": { description: "Kaynak Hacmi ve Maliyeti: Cost_Power = (Voltage * Current * ArcTime) / (1000 * MachineEff) * ElecRate", requiredInputs: [], outputHint: "number" },
  "user.weld_volume_cost_7": { description: "Kaynak Hacmi ve Maliyeti: TotalWeldCost = Cost_Filler + Cost_Gas + Cost_Power + (ArcTime / DepositionRate) * LaborRate", requiredInputs: [], outputHint: "number" },
  // ── Kaynak Maliyeti ──
  "user.weld_cost_analysis_0": { description: "Kaynak Maliyeti: OperatingFactor = ArcTime / TotalShiftTime", requiredInputs: [], outputHint: "number" },
  "user.weld_cost_analysis_1": { description: "Kaynak Maliyeti: DepositionRate = Weight_Deposited / ArcTime", requiredInputs: [], outputHint: "number" },
  "user.weld_cost_analysis_2": { description: "Kaynak Maliyeti: TotalJointCost = (Length / TravelSpeed) * (LaborRate + OverheadRate) / OperatingFactor + FillerCost + GasCost + PowerCost", requiredInputs: [], outputHint: "number" },
  "user.weld_cost_analysis_3": { description: "Kaynak Maliyeti: CostPerMeter = TotalJointCost / Length", requiredInputs: [], outputHint: "number" },
  "user.weld_cost_analysis_4": { description: "Kaynak Maliyeti: ConsumableCostPct = FillerCost / TotalJointCost", requiredInputs: [], outputHint: "number" },
  "user.weld_cost_analysis_5": { description: "Kaynak Maliyeti: LaborCostPct = LaborCost / TotalJointCost", requiredInputs: [], outputHint: "number" },
  // ── Kaynak Mukavemeti ──
  "user.weld_strength_0": { description: "Kaynak Mukavemeti: ThroatThickness = Leg * COS(45)", requiredInputs: [], outputHint: "number" },
  "user.weld_strength_1": { description: "Kaynak Mukavemeti: Area_Shear = ThroatThickness * Length", requiredInputs: [], outputHint: "number" },
  "user.weld_strength_2": { description: "Kaynak Mukavemeti: AllowableShearStress = 0.3 * TensileStrength_Electrode", requiredInputs: [], outputHint: "number" },
  "user.weld_strength_3": { description: "Kaynak Mukavemeti: MaxLoad_Shear = Area_Shear * AllowableShearStress", requiredInputs: [], outputHint: "number" },
  "user.weld_strength_4": { description: "Kaynak Mukavemeti: SafetyFactor = MaxLoad_Shear / AppliedLoad", requiredInputs: [], outputHint: "number" },
  "user.weld_strength_5": { description: "Kaynak Mukavemeti: BendingStress = (AppliedMoment * ThroatThickness) / MomentOfInertia", requiredInputs: [], outputHint: "number" },
  "user.weld_strength_6": { description: "Kaynak Mukavemeti: CombinedStress = SQRT(ShearStress^2 + BendingStress^2)", requiredInputs: [], outputHint: "number" },
  // ── Kesim Parameters Takım ömrü ──
  "user.cutting_tool_life_0": { description: "Kesim Parameters Takım ömrü: ToolLife_T = C / (V_c^n * f^m * a_p^k)", requiredInputs: [], outputHint: "number" },
  "user.cutting_tool_life_1": { description: "Kesim Parameters Takım ömrü: TaylorExponent_n = -LOG(T1/T2) / LOG(V1/V2)", requiredInputs: [], outputHint: "number" },
  "user.cutting_tool_life_2": { description: "Kesim Parameters Takım ömrü: CostPerPart_Tool = (ToolCost / Edges) * (MachiningTime / ToolLife)", requiredInputs: [], outputHint: "number" },
  "user.cutting_tool_life_3": { description: "Kesim Parameters Takım ömrü: OptimalToolLife_Cost = ((1/n - 1) * (ToolChangeTime + ToolCost/Edges / MachineRate))", requiredInputs: [], outputHint: "number" },
  "user.cutting_tool_life_4": { description: "Kesim Parameters Takım ömrü: Optimal_Vc = C / (OptimalToolLife_Cost^n)", requiredInputs: [], outputHint: "number" },
  "user.cutting_tool_life_5": { description: "Kesim Parameters Takım ömrü: ProductionRate = 1 / (MachiningTime + (MachiningTime / ToolLife) * ToolChangeTime)", requiredInputs: [], outputHint: "number" },
  // ── Kesme-Dolgu Denge ──
  "user.cut_fill_balance_0": { description: "Kesme-Dolgu Denge: Volume_Cut = SUM(Area_Cut_i * Distance_i)", requiredInputs: [], outputHint: "number" },
  "user.cut_fill_balance_1": { description: "Kesme-Dolgu Denge: Volume_Fill = SUM(Area_Fill_i * Distance_i)", requiredInputs: [], outputHint: "number" },
  "user.cut_fill_balance_2": { description: "Kesme-Dolgu Denge: ShrinkageFactor = 1 - (CompactedVolume / LooseVolume)", requiredInputs: [], outputHint: "number" },
  "user.cut_fill_balance_3": { description: "Kesme-Dolgu Denge: SwellFactor = LooseVolume / BankVolume", requiredInputs: [], outputHint: "number" },
  "user.cut_fill_balance_4": { description: "Kesme-Dolgu Denge: NetBalance = Volume_Cut - (Volume_Fill * ShrinkageFactor)", requiredInputs: [], outputHint: "number" },
  "user.cut_fill_balance_5": { description: "Kesme-Dolgu Denge: BorrowRequired = MAX(0, (Volume_Fill * ShrinkageFactor) - Volume_Cut)", requiredInputs: [], outputHint: "number" },
  "user.cut_fill_balance_6": { description: "Kesme-Dolgu Denge: WasteRequired = MAX(0, Volume_Cut - (Volume_Fill * ShrinkageFactor))", requiredInputs: [], outputHint: "number" },
  "user.cut_fill_balance_7": { description: "Kesme-Dolgu Denge: HaulCost = SUM(Volume_i * Distance_i * UnitHaulCost)", requiredInputs: [], outputHint: "number" },
  // ── Kiriş Ağırlığı ──
  "user.beam_weight_0": { description: "Kiriş Ağırlığı: Area_Cross = LookupArea(ProfileType, Size)", requiredInputs: [], outputHint: "number" },
  "user.beam_weight_1": { description: "Kiriş Ağırlığı: Weight_PerMeter = Area_Cross * Density_Steel", requiredInputs: [], outputHint: "number" },
  "user.beam_weight_2": { description: "Kiriş Ağırlığı: TotalWeight = Weight_PerMeter * Length * Quantity", requiredInputs: [], outputHint: "number" },
  "user.beam_weight_3": { description: "Kiriş Ağırlığı: Cost_Material = TotalWeight * PricePerTon", requiredInputs: [], outputHint: "number" },
  "user.beam_weight_4": { description: "Kiriş Ağırlığı: PaintArea = Perimeter * Length", requiredInputs: [], outputHint: "number" },
  "user.beam_weight_5": { description: "Kiriş Ağırlığı: FireproofingArea = PaintArea", requiredInputs: [], outputHint: "number" },
  "user.beam_weight_6": { description: "Kiriş Ağırlığı: Deflection_Max = (5 * w * L^4) / (384 * E * I)", requiredInputs: [], outputHint: "number" },
  "user.beam_weight_7": { description: "Kiriş Ağırlığı: Moment_Max = (w * L^2) / 8", requiredInputs: [], outputHint: "number" },
  // ── Kompresör Kaçağı Maliyet ──
  "user.compressed_air_leak_0": { description: "Kompresör Kaçağı Maliyet: LeakFlow_CFM = (22.4 * d^2 * P_Line) / SQRT(T_Abs)", requiredInputs: [], outputHint: "number" },
  "user.compressed_air_leak_1": { description: "Kompresör Kaçağı Maliyet: Power_Loss_kW = (LeakFlow_CFM * P_Line * 144) / (33000 * Eff_Compressor)", requiredInputs: [], outputHint: "number" },
  "user.compressed_air_leak_2": { description: "Kompresör Kaçağı Maliyet: AnnualEnergyLoss = Power_Loss_kW * OperatingHours", requiredInputs: [], outputHint: "number" },
  "user.compressed_air_leak_3": { description: "Kompresör Kaçağı Maliyet: Cost_Leak = AnnualEnergyLoss * ElectricityRate", requiredInputs: [], outputHint: "number" },
  "user.compressed_air_leak_4": { description: "Kompresör Kaçağı Maliyet: TotalLeakCost = SUM(Cost_Leak_i)", requiredInputs: [], outputHint: "number" },
  "user.compressed_air_leak_5": { description: "Kompresör Kaçağı Maliyet: CarbonEmissions = AnnualEnergyLoss * GridEmissionFactor", requiredInputs: [], outputHint: "number" },
  "user.compressed_air_leak_6": { description: "Kompresör Kaçağı Maliyet: Payback_Repair = RepairCost / Cost_Leak", requiredInputs: [], outputHint: "number" },
  // ── Kompresör Tankı Boyutlandırma ──
  "user.compressor_tank_sizing_0": { description: "Kompresör Tankı Boyutlandırma: V_Tank = (t * Q * P_atm) / (P_Max - P_Min)", requiredInputs: [], outputHint: "number" },
  "user.compressor_tank_sizing_1": { description: "Kompresör Tankı Boyutlandırma: t = TimeToFill", requiredInputs: [], outputHint: "number" },
  "user.compressor_tank_sizing_2": { description: "Kompresör Tankı Boyutlandırma: Q = FreeAirDelivery", requiredInputs: [], outputHint: "number" },
  "user.compressor_tank_sizing_3": { description: "Kompresör Tankı Boyutlandırma: P_Max = CutOutPressure", requiredInputs: [], outputHint: "number" },
  "user.compressor_tank_sizing_4": { description: "Kompresör Tankı Boyutlandırma: P_Min = CutInPressure", requiredInputs: [], outputHint: "number" },
  "user.compressor_tank_sizing_5": { description: "Kompresör Tankı Boyutlandırma: CycleTime = V_Tank * (P_Max - P_Min) / (Q * P_atm)", requiredInputs: [], outputHint: "number" },
  "user.compressor_tank_sizing_6": { description: "Kompresör Tankı Boyutlandırma: CyclesPerHour = 60 / CycleTime", requiredInputs: [], outputHint: "number" },
  "user.compressor_tank_sizing_7": { description: "Kompresör Tankı Boyutlandırma: MotorStartLimit = IF(CyclesPerHour > MaxStarts, 'FAIL', 'PASS')", requiredInputs: [], outputHint: "number" },
  "user.compressor_tank_sizing_8": { description: "Kompresör Tankı Boyutlandırma: Cost_Tank = Volume * PricePerLiter", requiredInputs: [], outputHint: "number" },
  // ── Konteyner Yükü ──
  "user.container_load_0": { description: "Konteyner Yükü: Volume_Utilization = SUM(ItemVolume_i) / ContainerMaxVolume", requiredInputs: [], outputHint: "number" },
  "user.container_load_1": { description: "Konteyner Yükü: Weight_Utilization = SUM(ItemWeight_i) / ContainerMaxPayload", requiredInputs: [], outputHint: "number" },
  "user.container_load_2": { description: "Konteyner Yükü: ChargeableWeight = MAX(GrossWeight, VolumetricWeight)", requiredInputs: [], outputHint: "number" },
  "user.container_load_3": { description: "Konteyner Yükü: LoadEfficiency = MIN(Volume_Utilization, Weight_Utilization)", requiredInputs: [], outputHint: "number" },
  "user.container_load_4": { description: "Konteyner Yükü: WastedSpaceCost = (1 - LoadEfficiency) * FreightCost", requiredInputs: [], outputHint: "number" },
  "user.container_load_5": { description: "Konteyner Yükü: PalletStacking = Floor(ContainerHeight / PalletHeight)", requiredInputs: [], outputHint: "number" },
  "user.container_load_6": { description: "Konteyner Yükü: MaxPallets = MIN(PalletStacking * FloorArea_Pallets, WeightLimit / PalletWeight)", requiredInputs: [], outputHint: "number" },
  // ── Kumaş Kesim Optimize Edici ──
  "user.fabric_cutting_optimizer_0": { description: "Kumaş Kesim Optimize Edici: MarkerEfficiency = (TotalPatternArea / (MarkerLength * FabricWidth)) * 100", requiredInputs: [], outputHint: "number" },
  "user.fabric_cutting_optimizer_1": { description: "Kumaş Kesim Optimize Edici: FabricRequired = (TotalPatternArea / MarkerEfficiency) * (1 + EndLossPct)", requiredInputs: [], outputHint: "number" },
  "user.fabric_cutting_optimizer_2": { description: "Kumaş Kesim Optimize Edici: Cost_Fabric = FabricRequired * PricePerMeter", requiredInputs: [], outputHint: "number" },
  "user.fabric_cutting_optimizer_3": { description: "Kumaş Kesim Optimize Edici: Utilization_Gain = (NewEfficiency - OldEfficiency) * FabricRequired * PricePerMeter", requiredInputs: [], outputHint: "number" },
  "user.fabric_cutting_optimizer_4": { description: "Kumaş Kesim Optimize Edici: SplicingLoss = Splices * OverlapLength * FabricWidth", requiredInputs: [], outputHint: "number" },
  "user.fabric_cutting_optimizer_5": { description: "Kumaş Kesim Optimize Edici: TotalYardage = MarkerLength + EndLoss + SplicingLoss", requiredInputs: [], outputHint: "number" },
  // ── Kur Riski ──
  "user.currency_risk_0": { description: "Kur Riski: Exposure_FC = TotalRevenue_FC - TotalCost_FC", requiredInputs: [], outputHint: "number" },
  "user.currency_risk_1": { description: "Kur Riski: VaR_Historical = Exposure_FC * StdDev_ExchangeRate * Z_Score", requiredInputs: [], outputHint: "number" },
  "user.currency_risk_2": { description: "Kur Riski: VaR_Parametric = Exposure_FC * Volatility * SQRT(TimeHorizon)", requiredInputs: [], outputHint: "number" },
  "user.currency_risk_3": { description: "Kur Riski: HedgedExposure = Exposure_FC * HedgeRatio", requiredInputs: [], outputHint: "number" },
  "user.currency_risk_4": { description: "Kur Riski: UnhedgedVaR = VaR_Historical * (1 - HedgeRatio)", requiredInputs: [], outputHint: "number" },
  "user.currency_risk_5": { description: "Kur Riski: CostOfHedge = Notional * ForwardPoints", requiredInputs: [], outputHint: "number" },
  "user.currency_risk_6": { description: "Kur Riski: NetImpact = (SpotRate - ForwardRate) * HedgedExposure", requiredInputs: [], outputHint: "number" },
  // ── KWh Maliyet ──
  "user.kwh_cost_0": { description: "KWh Maliyet: EnergyCharge = ActiveEnergy * EnergyRate", requiredInputs: [], outputHint: "number" },
  "user.kwh_cost_1": { description: "KWh Maliyet: DemandCharge = PeakDemand * DemandRate", requiredInputs: [], outputHint: "number" },
  "user.kwh_cost_2": { description: "KWh Maliyet: ReactivePenalty = IF(PowerFactor < Threshold, ReactiveEnergy * PenaltyRate, 0)", requiredInputs: [], outputHint: "number" },
  "user.kwh_cost_3": { description: "KWh Maliyet: TaxesAndFees = (EnergyCharge + DemandCharge) * TaxRate", requiredInputs: [], outputHint: "number" },
  "user.kwh_cost_4": { description: "KWh Maliyet: TotalBill = EnergyCharge + DemandCharge + ReactivePenalty + TaxesAndFees", requiredInputs: [], outputHint: "number" },
  "user.kwh_cost_5": { description: "KWh Maliyet: UnitCost_kWh = TotalBill / ActiveEnergy", requiredInputs: [], outputHint: "number" },
  "user.kwh_cost_6": { description: "KWh Maliyet: PeakShavingSavings = (OldPeak - NewPeak) * DemandRate", requiredInputs: [], outputHint: "number" },
  // ── Lojistik Rota Kaybı ──
  "user.logistics_route_loss_0": { description: "Lojistik Rota Kaybı: IdealDistance = PointToPoint_Distance", requiredInputs: [], outputHint: "number" },
  "user.logistics_route_loss_1": { description: "Lojistik Rota Kaybı: ActualDistance = RouteDistance", requiredInputs: [], outputHint: "number" },
  "user.logistics_route_loss_2": { description: "Lojistik Rota Kaybı: DriftPct = (ActualDistance - IdealDistance) / IdealDistance", requiredInputs: [], outputHint: "number" },
  "user.logistics_route_loss_3": { description: "Lojistik Rota Kaybı: FuelWaste = (ActualDistance - IdealDistance) * FuelConsumptionRate * FuelPrice", requiredInputs: [], outputHint: "number" },
  "user.logistics_route_loss_4": { description: "Lojistik Rota Kaybı: TimeWaste = (ActualDistance - IdealDistance) / AvgSpeed * DriverHourlyRate", requiredInputs: [], outputHint: "number" },
  "user.logistics_route_loss_5": { description: "Lojistik Rota Kaybı: TotalRouteLoss = FuelWaste + TimeWaste + VehicleWearCost", requiredInputs: [], outputHint: "number" },
  "user.logistics_route_loss_6": { description: "Lojistik Rota Kaybı: Efficiency = IdealDistance / ActualDistance", requiredInputs: [], outputHint: "number" },
  // ── Mağaza Saatlik Ücret ──
  "user.shop_hourly_rate_0": { description: "Mağaza Saatlik Ücret: DirectLabor = SUM(TechnicianWages)", requiredInputs: [], outputHint: "number" },
  "user.shop_hourly_rate_1": { description: "Mağaza Saatlik Ücret: IndirectLabor = SUM(ManagerWages + AdminWages)", requiredInputs: [], outputHint: "number" },
  "user.shop_hourly_rate_2": { description: "Mağaza Saatlik Ücret: Overhead = Rent + Utilities + Insurance + Tools + Depreciation", requiredInputs: [], outputHint: "number" },
  "user.shop_hourly_rate_3": { description: "Mağaza Saatlik Ücret: TotalShopCost = DirectLabor + IndirectLabor + Overhead", requiredInputs: [], outputHint: "number" },
  "user.shop_hourly_rate_4": { description: "Mağaza Saatlik Ücret: BillableHours = TotalAvailableHours * UtilizationRate", requiredInputs: [], outputHint: "number" },
  "user.shop_hourly_rate_5": { description: "Mağaza Saatlik Ücret: ShopHourlyRate = TotalShopCost / BillableHours", requiredInputs: [], outputHint: "number" },
  "user.shop_hourly_rate_6": { description: "Mağaza Saatlik Ücret: EffectiveMargin = (ActualBillingRate - ShopHourlyRate) / ActualBillingRate", requiredInputs: [], outputHint: "number" },
  // ── Mahsul Verim Kaybı Analizörü ──
  "user.crop_yield_loss_0": { description: "Mahsul Verim Kaybı Analizörü: PotentialYield = GeneticPotential * EnvironmentFactor", requiredInputs: [], outputHint: "number" },
  "user.crop_yield_loss_1": { description: "Mahsul Verim Kaybı Analizörü: ActualYield = HarvestedWeight / Area", requiredInputs: [], outputHint: "number" },
  "user.crop_yield_loss_2": { description: "Mahsul Verim Kaybı Analizörü: YieldGap = PotentialYield - ActualYield", requiredInputs: [], outputHint: "number" },
  "user.crop_yield_loss_3": { description: "Mahsul Verim Kaybı Analizörü: Loss_Pest = PestDamagePct * PotentialYield", requiredInputs: [], outputHint: "number" },
  "user.crop_yield_loss_4": { description: "Mahsul Verim Kaybı Analizörü: Loss_Weather = WeatherStressPct * PotentialYield", requiredInputs: [], outputHint: "number" },
  "user.crop_yield_loss_5": { description: "Mahsul Verim Kaybı Analizörü: Loss_Nutrient = NutrientDeficiencyPct * PotentialYield", requiredInputs: [], outputHint: "number" },
  "user.crop_yield_loss_6": { description: "Mahsul Verim Kaybı Analizörü: FinancialLoss = YieldGap * MarketPrice", requiredInputs: [], outputHint: "number" },
  "user.crop_yield_loss_7": { description: "Mahsul Verim Kaybı Analizörü: ROI_Intervention = (FinancialLoss_Recovered - InterventionCost) / InterventionCost", requiredInputs: [], outputHint: "number" },
  // ── Makine Ekonomik Ömrü ──
  "user.machine_economic_life_0": { description: "Makine Ekonomik Ömrü: EUAC_Capital = (InitialCost - SalvageValue) * (A/P, i, n) + SalvageValue * i", requiredInputs: [], outputHint: "number" },
  "user.machine_economic_life_1": { description: "Makine Ekonomik Ömrü: EUAC_Operating = SUM(OpCost_t * (P/F, i, t)) * (A/P, i, n)", requiredInputs: [], outputHint: "number" },
  "user.machine_economic_life_2": { description: "Makine Ekonomik Ömrü: TotalEUAC = EUAC_Capital + EUAC_Operating", requiredInputs: [], outputHint: "number" },
  "user.machine_economic_life_3": { description: "Makine Ekonomik Ömrü: EconomicLife = n where TotalEUAC is MINIMUM", requiredInputs: [], outputHint: "number" },
  "user.machine_economic_life_4": { description: "Makine Ekonomik Ömrü: Defender_EUAC = CurrentMarketValue * (A/P, i, n) + OpCost_Defender", requiredInputs: [], outputHint: "number" },
  "user.machine_economic_life_5": { description: "Makine Ekonomik Ömrü: Challenger_EUAC = EUAC_NewMachine", requiredInputs: [], outputHint: "number" },
  "user.machine_economic_life_6": { description: "Makine Ekonomik Ömrü: ReplacementDecision = IF(Defender_EUAC > Challenger_EUAC, 'Replace', 'Keep')", requiredInputs: [], outputHint: "number" },
  // ── Malzeme Replacement Maliyet ──
  "user.material_replacement_cost_0": { description: "Malzeme Replacement Maliyet: TCO_Current = MatCost_Current + ProcessingCost_Current + LifecycleMaint_Current + DisposalCost_Current", requiredInputs: [], outputHint: "number" },
  "user.material_replacement_cost_1": { description: "Malzeme Replacement Maliyet: TCO_Alternative = MatCost_Alt + ProcessingCost_Alt + LifecycleMaint_Alt + DisposalCost_Alt", requiredInputs: [], outputHint: "number" },
  "user.material_replacement_cost_2": { description: "Malzeme Replacement Maliyet: WeightSavings = Weight_Current - Weight_Alt", requiredInputs: [], outputHint: "number" },
  "user.material_replacement_cost_3": { description: "Malzeme Replacement Maliyet: FuelSavings = WeightSavings * FuelFactor * LifecycleDistance * FuelPrice", requiredInputs: [], outputHint: "number" },
  "user.material_replacement_cost_4": { description: "Malzeme Replacement Maliyet: NetBenefit = TCO_Current - TCO_Alternative + FuelSavings + QualityPremium", requiredInputs: [], outputHint: "number" },
  "user.material_replacement_cost_5": { description: "Malzeme Replacement Maliyet: Payback = (ToolingCost_Alt + QualificationCost) / AnnualNetBenefit", requiredInputs: [], outputHint: "number" },
  // ── MOQ Stok Denge ──
  "user.moq_stock_balance_0": { description: "MOQ Stok Denge: EOQ = SQRT((2 * AnnualDemand * OrderCost) / HoldingCost)", requiredInputs: [], outputHint: "number" },
  "user.moq_stock_balance_1": { description: "MOQ Stok Denge: MOQ_Penalty = IF(MOQ > EOQ, (MOQ - EOQ)/2 * HoldingCost, 0)", requiredInputs: [], outputHint: "number" },
  "user.moq_stock_balance_2": { description: "MOQ Stok Denge: PriceBreakSavings = (UnitPrice_Standard - UnitPrice_MOQ) * AnnualDemand", requiredInputs: [], outputHint: "number" },
  "user.moq_stock_balance_3": { description: "MOQ Stok Denge: NetBenefit = PriceBreakSavings - MOQ_Penalty - AdditionalOrderCostSavings", requiredInputs: [], outputHint: "number" },
  "user.moq_stock_balance_4": { description: "MOQ Stok Denge: OptimalOrderQty = IF(NetBenefit > 0, MOQ, EOQ)", requiredInputs: [], outputHint: "number" },
  "user.moq_stock_balance_5": { description: "MOQ Stok Denge: CycleStock_Cost = (OptimalOrderQty / 2) * HoldingCost", requiredInputs: [], outputHint: "number" },
  // ── MTBF/MTTR Finansal Etki ──
  "user.mtbf_mttr_financial_0": { description: "MTBF/MTTR Finansal Etki: Availability = MTBF / (MTBF + MTTR)", requiredInputs: [], outputHint: "number" },
  "user.mtbf_mttr_financial_1": { description: "MTBF/MTTR Finansal Etki: ExpectedDowntime = TotalTime * (1 - Availability)", requiredInputs: [], outputHint: "number" },
  "user.mtbf_mttr_financial_2": { description: "MTBF/MTTR Finansal Etki: DowntimeCost = ExpectedDowntime * CostPerHour", requiredInputs: [], outputHint: "number" },
  "user.mtbf_mttr_financial_3": { description: "MTBF/MTTR Finansal Etki: FailureFrequency = TotalTime / MTBF", requiredInputs: [], outputHint: "number" },
  "user.mtbf_mttr_financial_4": { description: "MTBF/MTTR Finansal Etki: RepairCost = FailureFrequency * (MTTR * LaborRate + PartsCost)", requiredInputs: [], outputHint: "number" },
  "user.mtbf_mttr_financial_5": { description: "MTBF/MTTR Finansal Etki: TotalReliabilityCost = DowntimeCost + RepairCost", requiredInputs: [], outputHint: "number" },
  "user.mtbf_mttr_financial_6": { description: "MTBF/MTTR Finansal Etki: ROI_Improvement = (OldCost - NewCost) / InvestmentCost", requiredInputs: [], outputHint: "number" },
  "user.mtbf_mttr_financial_7": { description: "MTBF/MTTR Finansal Etki: TargetMTBF = -TotalTime / LN(TargetAvailability)", requiredInputs: [], outputHint: "number" },
  // ── Muda Atık Maliyet ──
  "user.muda_waste_cost_0": { description: "Muda Atık Maliyet: Overproduction = ExcessUnits * UnitCost", requiredInputs: [], outputHint: "number" },
  "user.muda_waste_cost_1": { description: "Muda Atık Maliyet: Waiting = WaitingHours * (LaborRate + MachineRate)", requiredInputs: [], outputHint: "number" },
  "user.muda_waste_cost_2": { description: "Muda Atık Maliyet: Transport = TransportDistance * CostPerMeter * Trips", requiredInputs: [], outputHint: "number" },
  "user.muda_waste_cost_3": { description: "Muda Atık Maliyet: Overprocessing = (ActualTime - StandardTime) * LaborRate", requiredInputs: [], outputHint: "number" },
  "user.muda_waste_cost_4": { description: "Muda Atık Maliyet: Inventory = ExcessInventory * HoldingCostRate * Time", requiredInputs: [], outputHint: "number" },
  "user.muda_waste_cost_5": { description: "Muda Atık Maliyet: Motion = UnnecessaryMotionTime * LaborRate", requiredInputs: [], outputHint: "number" },
  "user.muda_waste_cost_6": { description: "Muda Atık Maliyet: Defects = DefectUnits * (MaterialCost + ReworkCost)", requiredInputs: [], outputHint: "number" },
  "user.muda_waste_cost_7": { description: "Muda Atık Maliyet: TotalMudaCost = SUM(Overproduction, Waiting, Transport, Overprocessing, Inventory, Motion, Defects)", requiredInputs: [], outputHint: "number" },
  // ── Nakit Akışı Açığı ──
  "user.cash_flow_gap_0": { description: "Nakit Akışı Açığı: CashInflow = SUM(Receipts_t)", requiredInputs: [], outputHint: "number" },
  "user.cash_flow_gap_1": { description: "Nakit Akışı Açığı: CashOutflow = SUM(Payments_t)", requiredInputs: [], outputHint: "number" },
  "user.cash_flow_gap_2": { description: "Nakit Akışı Açığı: NetCashFlow_t = CashInflow_t - CashOutflow_t", requiredInputs: [], outputHint: "number" },
  "user.cash_flow_gap_3": { description: "Nakit Akışı Açığı: CumulativeCashFlow = SUM(NetCashFlow_t)", requiredInputs: [], outputHint: "number" },
  "user.cash_flow_gap_4": { description: "Nakit Akışı Açığı: CashGap = MAX(0, -MIN(CumulativeCashFlow))", requiredInputs: [], outputHint: "number" },
  "user.cash_flow_gap_5": { description: "Nakit Akışı Açığı: DSO = (AccountsReceivable / TotalCreditSales) * Days", requiredInputs: [], outputHint: "number" },
  "user.cash_flow_gap_6": { description: "Nakit Akışı Açığı: DPO = (AccountsPayable / TotalCreditPurchases) * Days", requiredInputs: [], outputHint: "number" },
  "user.cash_flow_gap_7": { description: "Nakit Akışı Açığı: DIO = (Inventory / COGS) * Days", requiredInputs: [], outputHint: "number" },
  "user.cash_flow_gap_8": { description: "Nakit Akışı Açığı: CashConversionCycle = DSO + DIO - DPO", requiredInputs: [], outputHint: "number" },
  "user.cash_flow_gap_9": { description: "Nakit Akışı Açığı: FinancingCost = CashGap * DailyInterestRate", requiredInputs: [], outputHint: "number" },
  // ── Navlun Maliyeti ──
  "user.freight_cost_0": { description: "Navlun Maliyeti: ChargeableWeight = MAX(GrossWeight, VolumetricWeight)", requiredInputs: [], outputHint: "number" },
  "user.freight_cost_1": { description: "Navlun Maliyeti: BaseFreight = ChargeableWeight * RatePerKg", requiredInputs: [], outputHint: "number" },
  "user.freight_cost_2": { description: "Navlun Maliyeti: BunkerSurcharge = BaseFreight * BAF_Pct", requiredInputs: [], outputHint: "number" },
  "user.freight_cost_3": { description: "Navlun Maliyeti: SecurityFee = ChargeableWeight * SecurityRate", requiredInputs: [], outputHint: "number" },
  "user.freight_cost_4": { description: "Navlun Maliyeti: TerminalHandling = Units * THC_Rate", requiredInputs: [], outputHint: "number" },
  "user.freight_cost_5": { description: "Navlun Maliyeti: CustomsClearance = FixedFee + (Value * DutyPct)", requiredInputs: [], outputHint: "number" },
  "user.freight_cost_6": { description: "Navlun Maliyeti: TotalFreightCost = BaseFreight + BunkerSurcharge + SecurityFee + TerminalHandling + CustomsClearance", requiredInputs: [], outputHint: "number" },
  "user.freight_cost_7": { description: "Navlun Maliyeti: CostPerUnit = TotalFreightCost / TotalUnits", requiredInputs: [], outputHint: "number" },
  // ── Noise & Vibration Maliyet ──
  "user.noise_vibration_cost_0": { description: "Noise & Vibration Maliyet: NoiseExposure_dBA = 10 * LOG10((1/T) * SUM(t_i * 10^(L_i/10)))", requiredInputs: [], outputHint: "number" },
  "user.noise_vibration_cost_1": { description: "Noise & Vibration Maliyet: Vibration_RMS = SQRT((1/T) * SUM(a_i^2 * t_i))", requiredInputs: [], outputHint: "number" },
  "user.noise_vibration_cost_2": { description: "Noise & Vibration Maliyet: HealthCost = IF(Noise > 85 OR Vibration > Limit, MedicalScreening + PPE_Cost + InsurancePremiumHike, 0)", requiredInputs: [], outputHint: "number" },
  "user.noise_vibration_cost_3": { description: "Noise & Vibration Maliyet: ProductivityLoss = (ActualOutput - BaselineOutput) * UnitMargin", requiredInputs: [], outputHint: "number" },
  "user.noise_vibration_cost_4": { description: "Noise & Vibration Maliyet: ReworkCost = VibrationDefectRate * TotalUnits * ReworkCostPerUnit", requiredInputs: [], outputHint: "number" },
  "user.noise_vibration_cost_5": { description: "Noise & Vibration Maliyet: MitigationROI = (HealthCost + ProdLoss + ReworkCost) / MitigationInvestment", requiredInputs: [], outputHint: "number" },
  // ── OEE ve Durma Süresi ──
  "user.oee_downtime_0": { description: "OEE ve Durma Süresi: Availability = OperatingTime / PlannedProductionTime", requiredInputs: [], outputHint: "number" },
  "user.oee_downtime_1": { description: "OEE ve Durma Süresi: Performance = (IdealCycleTime * TotalCount) / OperatingTime", requiredInputs: [], outputHint: "number" },
  "user.oee_downtime_2": { description: "OEE ve Durma Süresi: Quality = GoodCount / TotalCount", requiredInputs: [], outputHint: "number" },
  "user.oee_downtime_3": { description: "OEE ve Durma Süresi: OEE = Availability * Performance * Quality", requiredInputs: [], outputHint: "number" },
  "user.oee_downtime_4": { description: "OEE ve Durma Süresi: TEEP = OEE * (PlannedProductionTime / AllTime)", requiredInputs: [], outputHint: "number" },
  "user.oee_downtime_5": { description: "OEE ve Durma Süresi: DowntimeCost = (PlannedProductionTime - OperatingTime) * CostPerMinute", requiredInputs: [], outputHint: "number" },
  "user.oee_downtime_6": { description: "OEE ve Durma Süresi: SpeedLoss = (OperatingTime - (IdealCycleTime * TotalCount)) * CostPerMinute", requiredInputs: [], outputHint: "number" },
  "user.oee_downtime_7": { description: "OEE ve Durma Süresi: QualityLoss = (TotalCount - GoodCount) * UnitCost", requiredInputs: [], outputHint: "number" },
  // ── Ofis Malzemeleri Maliyet ──
  "user.office_supplies_cost_0": { description: "Ofis Malzemeleri Maliyet: ConsumptionRate = TotalConsumed / EmployeeCount", requiredInputs: [], outputHint: "number" },
  "user.office_supplies_cost_1": { description: "Ofis Malzemeleri Maliyet: AnnualCost = SUM(Item_i * UnitPrice_i * AnnualUsage_i)", requiredInputs: [], outputHint: "number" },
  "user.office_supplies_cost_2": { description: "Ofis Malzemeleri Maliyet: CarryingCost = AverageInventory * HoldingRate", requiredInputs: [], outputHint: "number" },
  "user.office_supplies_cost_3": { description: "Ofis Malzemeleri Maliyet: StockoutCost = EmergencyOrders * PremiumFreight", requiredInputs: [], outputHint: "number" },
  "user.office_supplies_cost_4": { description: "Ofis Malzemeleri Maliyet: EOQ_Office = SQRT((2 * AnnualUsage * OrderCost) / HoldingCost)", requiredInputs: [], outputHint: "number" },
  "user.office_supplies_cost_5": { description: "Ofis Malzemeleri Maliyet: WastePct = (Purchased - Consumed) / Purchased", requiredInputs: [], outputHint: "number" },
  "user.office_supplies_cost_6": { description: "Ofis Malzemeleri Maliyet: OptimizationSavings = (CurrentCost - EOQ_Cost) + (WastePct * CurrentCost)", requiredInputs: [], outputHint: "number" },
  // ── Overtime vs. Hiring Breakeven ──
  "user.overtime_hiring_breakeven_0": { description: "Overtime vs. Hiring Breakeven: OvertimeCost_Hour = RegularRate * OvertimeMultiplier * (1 + BurdenRate)", requiredInputs: [], outputHint: "number" },
  "user.overtime_hiring_breakeven_1": { description: "Overtime vs. Hiring Breakeven: HiringCost_Total = Recruitment + Onboarding + Training + RampUpProductivityLoss", requiredInputs: [], outputHint: "number" },
  "user.overtime_hiring_breakeven_2": { description: "Overtime vs. Hiring Breakeven: AnnualNewHireCost = (RegularRate * AnnualHours) * (1 + BurdenRate) + Benefits", requiredInputs: [], outputHint: "number" },
  "user.overtime_hiring_breakeven_3": { description: "Overtime vs. Hiring Breakeven: BreakevenHours = HiringCost_Total / (AnnualNewHireCost / AnnualHours - OvertimeCost_Hour)", requiredInputs: [], outputHint: "number" },
  "user.overtime_hiring_breakeven_4": { description: "Overtime vs. Hiring Breakeven: Decision = IF(ExpectedOvertimeHours > BreakevenHours, 'Hire', 'Overtime')", requiredInputs: [], outputHint: "number" },
  "user.overtime_hiring_breakeven_5": { description: "Overtime vs. Hiring Breakeven: QualityCost_OT = OvertimeHours * FatigueDefectRate * DefectCost", requiredInputs: [], outputHint: "number" },
  // ── Ödeme Vadesi Optimize Edici ──
  "user.payment_terms_optimizer_0": { description: "Ödeme Vadesi Optimize Edici: DSO = (AccountsReceivable / Revenue) * Days", requiredInputs: [], outputHint: "number" },
  "user.payment_terms_optimizer_1": { description: "Ödeme Vadesi Optimize Edici: CarryingCost_AR = AverageAR * WACC / 365", requiredInputs: [], outputHint: "number" },
  "user.payment_terms_optimizer_2": { description: "Ödeme Vadesi Optimize Edici: BadDebtExpense = Revenue * DefaultRate", requiredInputs: [], outputHint: "number" },
  "user.payment_terms_optimizer_3": { description: "Ödeme Vadesi Optimize Edici: DiscountCost = EarlyPaymentDiscountPct * DiscountTakeRate * Revenue", requiredInputs: [], outputHint: "number" },
  "user.payment_terms_optimizer_4": { description: "Ödeme Vadesi Optimize Edici: OptimalTerms = Terms where (CarryingCost + BadDebt - DiscountCost) is MINIMUM", requiredInputs: [], outputHint: "number" },
  "user.payment_terms_optimizer_5": { description: "Ödeme Vadesi Optimize Edici: CashFlowImpact = (NewDSO - OldDSO) * (Revenue / 365)", requiredInputs: [], outputHint: "number" },
  "user.payment_terms_optimizer_6": { description: "Ödeme Vadesi Optimize Edici: NPV_Terms = SUM(CashInflow_t / (1 + DailyWACC)^t)", requiredInputs: [], outputHint: "number" },
  // ── Öğrenme Eğrisi Süre Tahmincisi ──
  "user.learning_curve_time_0": { description: "Öğrenme Eğrisi Süre Tahmincisi: LearningRate = 1 - (Time_2N / Time_N)", requiredInputs: [], outputHint: "number" },
  "user.learning_curve_time_1": { description: "Öğrenme Eğrisi Süre Tahmincisi: Slope_b = LOG(LearningRate) / LOG(2)", requiredInputs: [], outputHint: "number" },
  "user.learning_curve_time_2": { description: "Öğrenme Eğrisi Süre Tahmincisi: Time_N = Time_1 * (N^b)", requiredInputs: [], outputHint: "number" },
  "user.learning_curve_time_3": { description: "Öğrenme Eğrisi Süre Tahmincisi: CumulativeTime_N = Time_1 * (N^(b+1)) / (b+1)", requiredInputs: [], outputHint: "number" },
  "user.learning_curve_time_4": { description: "Öğrenme Eğrisi Süre Tahmincisi: AverageTime_N = CumulativeTime_N / N", requiredInputs: [], outputHint: "number" },
  "user.learning_curve_time_5": { description: "Öğrenme Eğrisi Süre Tahmincisi: Cost_N = Time_N * LaborRate", requiredInputs: [], outputHint: "number" },
  "user.learning_curve_time_6": { description: "Öğrenme Eğrisi Süre Tahmincisi: BreakevenUnit = N where StandardTime is reached", requiredInputs: [], outputHint: "number" },
  "user.learning_curve_time_7": { description: "Öğrenme Eğrisi Süre Tahmincisi: TotalLaborCost = CumulativeTime_N * LaborRate", requiredInputs: [], outputHint: "number" },
  // ── Palet Rafı Optimize Edici ──
  "user.pallet_rack_optimizer_0": { description: "Palet Rafı Optimize Edici: RackCapacity = Bays * Levels * PalletsPerBay", requiredInputs: [], outputHint: "number" },
  "user.pallet_rack_optimizer_1": { description: "Palet Rafı Optimize Edici: FloorUtilization = RackFootprint / TotalFloorArea", requiredInputs: [], outputHint: "number" },
  "user.pallet_rack_optimizer_2": { description: "Palet Rafı Optimize Edici: Throughput = Aisles * ForkliftSpeed * TravelDistance^-1", requiredInputs: [], outputHint: "number" },
  "user.pallet_rack_optimizer_3": { description: "Palet Rafı Optimize Edici: Deflection = (5 * Load * BeamLength^3) / (384 * E * I)", requiredInputs: [], outputHint: "number" },
  "user.pallet_rack_optimizer_4": { description: "Palet Rafı Optimize Edici: SafetyFactor = MaxLoadCapacity / ActualLoad", requiredInputs: [], outputHint: "number" },
  "user.pallet_rack_optimizer_5": { description: "Palet Rafı Optimize Edici: CostPerPosition = TotalRackCost / RackCapacity", requiredInputs: [], outputHint: "number" },
  "user.pallet_rack_optimizer_6": { description: "Palet Rafı Optimize Edici: RetrievalTime = TravelTime_Horizontal + TravelTime_Vertical + PickTime", requiredInputs: [], outputHint: "number" },
  // ── Poka-Yoke ROI ──
  "user.poka_yoke_roi_0": { description: "Poka-Yoke ROI: CurrentDefectRate = Defects / TotalUnits", requiredInputs: [], outputHint: "number" },
  "user.poka_yoke_roi_1": { description: "Poka-Yoke ROI: DefectCost_Annual = CurrentDefectRate * TotalUnits * CostPerDefect", requiredInputs: [], outputHint: "number" },
  "user.poka_yoke_roi_2": { description: "Poka-Yoke ROI: PokaYoke_Cost = Design + Implementation + Training + Maintenance", requiredInputs: [], outputHint: "number" },
  "user.poka_yoke_roi_3": { description: "Poka-Yoke ROI: NewDefectRate = CurrentDefectRate * (1 - Effectiveness)", requiredInputs: [], outputHint: "number" },
  "user.poka_yoke_roi_4": { description: "Poka-Yoke ROI: Savings = (CurrentDefectRate - NewDefectRate) * TotalUnits * CostPerDefect", requiredInputs: [], outputHint: "number" },
  "user.poka_yoke_roi_5": { description: "Poka-Yoke ROI: ROI = (Savings - PokaYoke_Cost) / PokaYoke_Cost", requiredInputs: [], outputHint: "number" },
  "user.poka_yoke_roi_6": { description: "Poka-Yoke ROI: PaybackMonths = PokaYoke_Cost / (Savings / 12)", requiredInputs: [], outputHint: "number" },
  // ── Porsiyon Maliyet ──
  "user.portion_cost_0": { description: "Porsiyon Maliyet: IngredientCost = SUM(Quantity_i * UnitPrice_i)", requiredInputs: [], outputHint: "number" },
  "user.portion_cost_1": { description: "Porsiyon Maliyet: YieldAdjustedCost = IngredientCost / YieldPct", requiredInputs: [], outputHint: "number" },
  "user.portion_cost_2": { description: "Porsiyon Maliyet: LaborCost = PrepTime * LaborRate", requiredInputs: [], outputHint: "number" },
  "user.portion_cost_3": { description: "Porsiyon Maliyet: Overhead = (IngredientCost + LaborCost) * OverheadPct", requiredInputs: [], outputHint: "number" },
  "user.portion_cost_4": { description: "Porsiyon Maliyet: TotalPortionCost = YieldAdjustedCost + LaborCost + Overhead", requiredInputs: [], outputHint: "number" },
  "user.portion_cost_5": { description: "Porsiyon Maliyet: FoodCostPct = TotalPortionCost / MenuPrice", requiredInputs: [], outputHint: "number" },
  "user.portion_cost_6": { description: "Porsiyon Maliyet: MenuPrice_Target = TotalPortionCost / TargetFoodCostPct", requiredInputs: [], outputHint: "number" },
  "user.portion_cost_7": { description: "Porsiyon Maliyet: Margin = MenuPrice - TotalPortionCost", requiredInputs: [], outputHint: "number" },
  // ── Project Maliyet Tahmin ──
  "user.project_cost_estimate_0": { description: "Project Maliyet Tahmin: DirectLabor = SUM(Hours_i * Rate_i)", requiredInputs: [], outputHint: "number" },
  "user.project_cost_estimate_1": { description: "Project Maliyet Tahmin: DirectMaterial = SUM(Quantity_j * Price_j)", requiredInputs: [], outputHint: "number" },
  "user.project_cost_estimate_2": { description: "Project Maliyet Tahmin: Equipment = SUM(RentalDays_k * DailyRate_k)", requiredInputs: [], outputHint: "number" },
  "user.project_cost_estimate_3": { description: "Project Maliyet Tahmin: Subcontractor = SUM(LumpSum_m)", requiredInputs: [], outputHint: "number" },
  "user.project_cost_estimate_4": { description: "Project Maliyet Tahmin: Overhead = (DirectLabor + DirectMaterial) * OverheadRate", requiredInputs: [], outputHint: "number" },
  "user.project_cost_estimate_5": { description: "Project Maliyet Tahmin: Contingency = (Direct + Overhead) * RiskFactor", requiredInputs: [], outputHint: "number" },
  "user.project_cost_estimate_6": { description: "Project Maliyet Tahmin: TotalEstimate = DirectLabor + DirectMaterial + Equipment + Subcontractor + Overhead + Contingency", requiredInputs: [], outputHint: "number" },
  "user.project_cost_estimate_7": { description: "Project Maliyet Tahmin: CostVariance = TotalEstimate - Budget", requiredInputs: [], outputHint: "number" },
  // ── Project Overrun risk ──
  "user.project_overrun_0": { description: "Project Overrun risk: SPI = EarnedValue / PlannedValue", requiredInputs: [], outputHint: "number" },
  "user.project_overrun_1": { description: "Project Overrun risk: CPI = EarnedValue / ActualCost", requiredInputs: [], outputHint: "number" },
  "user.project_overrun_2": { description: "Project Overrun risk: EAC = BudgetAtCompletion / CPI", requiredInputs: [], outputHint: "number" },
  "user.project_overrun_3": { description: "Project Overrun risk: ExpectedOverrun = EAC - BudgetAtCompletion", requiredInputs: [], outputHint: "number" },
  "user.project_overrun_4": { description: "Project Overrun risk: ScheduleDelay = (ActualDuration - PlannedDuration) / PlannedDuration", requiredInputs: [], outputHint: "number" },
  "user.project_overrun_5": { description: "Project Overrun risk: RiskExposure = ProbabilityOfDelay * (DelayDays * DailyPenalty) + ProbabilityOfCostOverrun * ExpectedOverrun", requiredInputs: [], outputHint: "number" },
  "user.project_overrun_6": { description: "Project Overrun risk: MitigationCost = CrashingCost + FastTrackingCost", requiredInputs: [], outputHint: "number" },
  "user.project_overrun_7": { description: "Project Overrun risk: NetRisk = RiskExposure - MitigationCost", requiredInputs: [], outputHint: "number" },
  // ── reçete Maliyet Check ──
  "user.recipe_cost_check_0": { description: "reçete Maliyet Check: TheoreticalCost = SUM(FormulationPct_i * IngredientPrice_i)", requiredInputs: [], outputHint: "number" },
  "user.recipe_cost_check_1": { description: "reçete Maliyet Check: ActualCost = TotalMaterialConsumed * AvgPrice / TotalOutput", requiredInputs: [], outputHint: "number" },
  "user.recipe_cost_check_2": { description: "reçete Maliyet Check: Variance = ActualCost - TheoreticalCost", requiredInputs: [], outputHint: "number" },
  "user.recipe_cost_check_3": { description: "reçete Maliyet Check: YieldLossCost = (1 - ActualYield) * TheoreticalCost", requiredInputs: [], outputHint: "number" },
  "user.recipe_cost_check_4": { description: "reçete Maliyet Check: EvaporationLoss = InputWeight - OutputWeight - KnownScrap", requiredInputs: [], outputHint: "number" },
  "user.recipe_cost_check_5": { description: "reçete Maliyet Check: Efficiency = ActualOutput / TheoreticalOutput", requiredInputs: [], outputHint: "number" },
  "user.recipe_cost_check_6": { description: "reçete Maliyet Check: CostPerKg = ActualCost / OutputWeight", requiredInputs: [], outputHint: "number" },
  // ── Restaurant Menü Marj Kaçak ──
  "user.restaurant_menu_margin_leak_0": { description: "Restaurant Menü Marj Kaçak: TheoreticalFoodCost = SUM(ItemsSold_i * PortionCost_i)", requiredInputs: [], outputHint: "number" },
  "user.restaurant_menu_margin_leak_1": { description: "Restaurant Menü Marj Kaçak: ActualFoodCost = BeginningInventory + Purchases - EndingInventory", requiredInputs: [], outputHint: "number" },
  "user.restaurant_menu_margin_leak_2": { description: "Restaurant Menü Marj Kaçak: Variance = ActualFoodCost - TheoreticalFoodCost", requiredInputs: [], outputHint: "number" },
  "user.restaurant_menu_margin_leak_3": { description: "Restaurant Menü Marj Kaçak: VariancePct = Variance / TotalFoodSales", requiredInputs: [], outputHint: "number" },
  "user.restaurant_menu_margin_leak_4": { description: "Restaurant Menü Marj Kaçak: WasteCost = RecordedWaste * AvgPortionCost", requiredInputs: [], outputHint: "number" },
  "user.restaurant_menu_margin_leak_5": { description: "Restaurant Menü Marj Kaçak: TheftLoss = Variance - WasteCost - CompMeals", requiredInputs: [], outputHint: "number" },
  "user.restaurant_menu_margin_leak_6": { description: "Restaurant Menü Marj Kaçak: IdealMargin = 1 - (TheoreticalFoodCost / TotalFoodSales)", requiredInputs: [], outputHint: "number" },
  "user.restaurant_menu_margin_leak_7": { description: "Restaurant Menü Marj Kaçak: ActualMargin = 1 - (ActualFoodCost / TotalFoodSales)", requiredInputs: [], outputHint: "number" },
  // ── Robot Kol vs. Manuel İşçi ──
  "user.robot_vs_manual_0": { description: "Robot Kol vs. Manuel İşçi: ManualCost_Annual = (Operators * HourlyRate * Hours) * (1 + Burden)", requiredInputs: [], outputHint: "number" },
  "user.robot_vs_manual_1": { description: "Robot Kol vs. Manuel İşçi: RobotCost_Annual = (RobotCapex / DepreciationLife) + Maintenance + Energy + ProgrammerCost", requiredInputs: [], outputHint: "number" },
  "user.robot_vs_manual_2": { description: "Robot Kol vs. Manuel İşçi: RobotOutput = CycleTime_Robot^-1 * Uptime", requiredInputs: [], outputHint: "number" },
  "user.robot_vs_manual_3": { description: "Robot Kol vs. Manuel İşçi: ManualOutput = CycleTime_Manual^-1 * Efficiency", requiredInputs: [], outputHint: "number" },
  "user.robot_vs_manual_4": { description: "Robot Kol vs. Manuel İşçi: CostPerUnit_Manual = ManualCost_Annual / ManualOutput", requiredInputs: [], outputHint: "number" },
  "user.robot_vs_manual_5": { description: "Robot Kol vs. Manuel İşçi: CostPerUnit_Robot = RobotCost_Annual / RobotOutput", requiredInputs: [], outputHint: "number" },
  "user.robot_vs_manual_6": { description: "Robot Kol vs. Manuel İşçi: ROI = (ManualCost - RobotCost) / RobotCapex", requiredInputs: [], outputHint: "number" },
  "user.robot_vs_manual_7": { description: "Robot Kol vs. Manuel İşçi: Payback = RobotCapex / (ManualCost_Annual - RobotCost_Annual)", requiredInputs: [], outputHint: "number" },
  // ── Rota Maliyet ──
  "user.route_cost_0": { description: "Rota Maliyet: DistanceCost = TotalDistance * FuelConsumption * FuelPrice", requiredInputs: [], outputHint: "number" },
  "user.route_cost_1": { description: "Rota Maliyet: TimeCost = TotalTime * (DriverWage + VehicleDepreciation)", requiredInputs: [], outputHint: "number" },
  "user.route_cost_2": { description: "Rota Maliyet: TollCost = SUM(Tolls_i)", requiredInputs: [], outputHint: "number" },
  "user.route_cost_3": { description: "Rota Maliyet: MaintenanceCost = TotalDistance * MaintRatePerKm", requiredInputs: [], outputHint: "number" },
  "user.route_cost_4": { description: "Rota Maliyet: Overhead = (DistanceCost + TimeCost) * OverheadPct", requiredInputs: [], outputHint: "number" },
  "user.route_cost_5": { description: "Rota Maliyet: TotalRouteCost = DistanceCost + TimeCost + TollCost + MaintenanceCost + Overhead", requiredInputs: [], outputHint: "number" },
  "user.route_cost_6": { description: "Rota Maliyet: CostPerKm = TotalRouteCost / TotalDistance", requiredInputs: [], outputHint: "number" },
  "user.route_cost_7": { description: "Rota Maliyet: CostPerDrop = TotalRouteCost / NumberOfDrops", requiredInputs: [], outputHint: "number" },
  // ── Rota Optimizasyonu Analizörü ──
  "user.route_optimization_0": { description: "Rota Optimizasyonu Analizörü: NearestNeighbor_Dist = SUM(MinDistance_i)", requiredInputs: [], outputHint: "number" },
  "user.route_optimization_1": { description: "Rota Optimizasyonu Analizörü: Savings_ClarkeWright = Distance_Depot_i + Distance_Depot_j - Distance_i_j", requiredInputs: [], outputHint: "number" },
  "user.route_optimization_2": { description: "Rota Optimizasyonu Analizörü: RouteEfficiency = TheoreticalMinDistance / ActualRouteDistance", requiredInputs: [], outputHint: "number" },
  "user.route_optimization_3": { description: "Rota Optimizasyonu Analizörü: DropDensity = NumberOfDrops / RouteArea", requiredInputs: [], outputHint: "number" },
  "user.route_optimization_4": { description: "Rota Optimizasyonu Analizörü: TimeWindowPenalty = SUM(MAX(0, ArrivalTime - LateWindow) * PenaltyRate)", requiredInputs: [], outputHint: "number" },
  "user.route_optimization_5": { description: "Rota Optimizasyonu Analizörü: VehicleUtilization = TotalLoad / VehicleCapacity", requiredInputs: [], outputHint: "number" },
  "user.route_optimization_6": { description: "Rota Optimizasyonu Analizörü: TotalSavings = BaselineCost - OptimizedCost", requiredInputs: [], outputHint: "number" },
  // ── Rüzgar Türbini Yatırım Getirisi ──
  "user.wind_turbine_investment_0": { description: "Rüzgar Türbini Yatırım Getirisi: AEP = 8760 * SUM(PowerCurve_v * Frequency_v)", requiredInputs: [], outputHint: "number" },
  "user.wind_turbine_investment_1": { description: "Rüzgar Türbini Yatırım Getirisi: CapacityFactor = AEP / (RatedPower * 8760)", requiredInputs: [], outputHint: "number" },
  "user.wind_turbine_investment_2": { description: "Rüzgar Türbini Yatırım Getirisi: AnnualRevenue = AEP * FeedInTariff", requiredInputs: [], outputHint: "number" },
  "user.wind_turbine_investment_3": { description: "Rüzgar Türbini Yatırım Getirisi: OPEX = LandLease + Maintenance + Insurance + GridFees", requiredInputs: [], outputHint: "number" },
  "user.wind_turbine_investment_4": { description: "Rüzgar Türbini Yatırım Getirisi: EBITDA = AnnualRevenue - OPEX", requiredInputs: [], outputHint: "number" },
  "user.wind_turbine_investment_5": { description: "Rüzgar Türbini Yatırım Getirisi: LCOE = (SUM(Capex + Opex_t / (1+r)^t)) / (SUM(AEP_t / (1+r)^t))", requiredInputs: [], outputHint: "number" },
  "user.wind_turbine_investment_6": { description: "Rüzgar Türbini Yatırım Getirisi: NPV = SUM(EBITDA_t / (1+WACC)^t) - Capex", requiredInputs: [], outputHint: "number" },
  "user.wind_turbine_investment_7": { description: "Rüzgar Türbini Yatırım Getirisi: IRR = r where NPV = 0", requiredInputs: [], outputHint: "number" },
  // ── SaaS Shelfware Maliyet ──
  "user.saas_shelfware_0": { description: "SaaS Shelfware Maliyet: TotalLicenses = PurchasedLicenses", requiredInputs: [], outputHint: "number" },
  "user.saas_shelfware_1": { description: "SaaS Shelfware Maliyet: ActiveUsers = UsersLoggedInLast30Days", requiredInputs: [], outputHint: "number" },
  "user.saas_shelfware_2": { description: "SaaS Shelfware Maliyet: ShelfwarePct = (TotalLicenses - ActiveUsers) / TotalLicenses", requiredInputs: [], outputHint: "number" },
  "user.saas_shelfware_3": { description: "SaaS Shelfware Maliyet: ShelfwareCost = ShelfwarePct * TotalContractValue", requiredInputs: [], outputHint: "number" },
  "user.saas_shelfware_4": { description: "SaaS Shelfware Maliyet: UtilizationRate = ActiveUsers / TotalLicenses", requiredInputs: [], outputHint: "number" },
  "user.saas_shelfware_5": { description: "SaaS Shelfware Maliyet: FeatureAdoption = FeaturesUsed / TotalFeatures", requiredInputs: [], outputHint: "number" },
  "user.saas_shelfware_6": { description: "SaaS Shelfware Maliyet: OptimizationSavings = ShelfwareCost + (UnderutilizedTierPriceDiff * Users)", requiredInputs: [], outputHint: "number" },
  "user.saas_shelfware_7": { description: "SaaS Shelfware Maliyet: TrueUpCost = MAX(0, ActualUsage - ContractedUsage) * OverageRate", requiredInputs: [], outputHint: "number" },
  // ── Saatlik Ücret ──
  "user.hourly_rate_0": { description: "Saatlik Ücret: GrossAnnualSalary = BaseSalary + Bonuses", requiredInputs: [], outputHint: "number" },
  "user.hourly_rate_1": { description: "Saatlik Ücret: EmployerTaxes = GrossAnnualSalary * TaxRate", requiredInputs: [], outputHint: "number" },
  "user.hourly_rate_2": { description: "Saatlik Ücret: Benefits = HealthInsurance + RetirementMatch + PaidTimeOffCost", requiredInputs: [], outputHint: "number" },
  "user.hourly_rate_3": { description: "Saatlik Ücret: TotalLaborCost = GrossAnnualSalary + EmployerTaxes + Benefits", requiredInputs: [], outputHint: "number" },
  "user.hourly_rate_4": { description: "Saatlik Ücret: ProductiveHours = (WeeksPerYear - VacationWeeks) * HoursPerWeek * (1 - IdleTimePct)", requiredInputs: [], outputHint: "number" },
  "user.hourly_rate_5": { description: "Saatlik Ücret: FullyBurdenedHourlyRate = TotalLaborCost / ProductiveHours", requiredInputs: [], outputHint: "number" },
  "user.hourly_rate_6": { description: "Saatlik Ücret: MarginRate = FullyBurdenedHourlyRate * (1 + TargetMargin)", requiredInputs: [], outputHint: "number" },
  // ── SMED Değişim Optimize Edici ──
  "user.smed_changeover_optimizer_0": { description: "SMED Değişim Optimize Edici: CurrentSetupTime = Internal_Current + External_Current", requiredInputs: [], outputHint: "number" },
  "user.smed_changeover_optimizer_1": { description: "SMED Değişim Optimize Edici: TargetSetupTime = Internal_Target + External_Target", requiredInputs: [], outputHint: "number" },
  "user.smed_changeover_optimizer_2": { description: "SMED Değişim Optimize Edici: ConversionRate = (Internal_Current - Internal_Target) / Internal_Current", requiredInputs: [], outputHint: "number" },
  "user.smed_changeover_optimizer_3": { description: "SMED Değişim Optimize Edici: CapacityRecovered = (CurrentSetupTime - TargetSetupTime) * ChangeoverFrequency", requiredInputs: [], outputHint: "number" },
  "user.smed_changeover_optimizer_4": { description: "SMED Değişim Optimize Edici: FinancialGain = CapacityRecovered * BottleneckThroughput * UnitMargin", requiredInputs: [], outputHint: "number" },
  "user.smed_changeover_optimizer_5": { description: "SMED Değişim Optimize Edici: SMED_Investment = Training + Tooling + Modification", requiredInputs: [], outputHint: "number" },
  "user.smed_changeover_optimizer_6": { description: "SMED Değişim Optimize Edici: ROI = FinancialGain / SMED_Investment", requiredInputs: [], outputHint: "number" },
  // ── Sözleşme Teşvik ──
  "user.contract_incentive_0": { description: "Sözleşme Teşvik: TargetCost = BaselineEstimate", requiredInputs: [], outputHint: "number" },
  "user.contract_incentive_1": { description: "Sözleşme Teşvik: TargetFee = TargetCost * TargetFeePct", requiredInputs: [], outputHint: "number" },
  "user.contract_incentive_2": { description: "Sözleşme Teşvik: ShareRatio = OverrunShare / UnderrunShare", requiredInputs: [], outputHint: "number" },
  "user.contract_incentive_3": { description: "Sözleşme Teşvik: ActualFee = TargetFee + (TargetCost - ActualCost) * ContractorSharePct", requiredInputs: [], outputHint: "number" },
  "user.contract_incentive_4": { description: "Sözleşme Teşvik: MaxFee = TargetFee * MaxFeeMultiplier", requiredInputs: [], outputHint: "number" },
  "user.contract_incentive_5": { description: "Sözleşme Teşvik: MinFee = TargetFee * MinFeeMultiplier", requiredInputs: [], outputHint: "number" },
  "user.contract_incentive_6": { description: "Sözleşme Teşvik: FinalFee = MIN(MAX(ActualFee, MinFee), MaxFee)", requiredInputs: [], outputHint: "number" },
  "user.contract_incentive_7": { description: "Sözleşme Teşvik: FinalPrice = ActualCost + FinalFee", requiredInputs: [], outputHint: "number" },
  "user.contract_incentive_8": { description: "Sözleşme Teşvik: PerformanceBonus = SUM(MetricWeight_i * MetricScore_i) * BonusPool", requiredInputs: [], outputHint: "number" },
  // ── SPC Signal Delay Maliyet ──
  "user.spc_signal_delay_0": { description: "SPC Signal Delay Maliyet: ARL_InControl = 1 / Alpha", requiredInputs: [], outputHint: "number" },
  "user.spc_signal_delay_1": { description: "SPC Signal Delay Maliyet: ARL_OutOfControl = 1 / (1 - Beta)", requiredInputs: [], outputHint: "number" },
  "user.spc_signal_delay_2": { description: "SPC Signal Delay Maliyet: DetectionDelay_Hours = ARL_OutOfControl * SamplingInterval", requiredInputs: [], outputHint: "number" },
  "user.spc_signal_delay_3": { description: "SPC Signal Delay Maliyet: DefectsProduced = DetectionDelay_Hours * ProductionRate * DefectRate_OOC", requiredInputs: [], outputHint: "number" },
  "user.spc_signal_delay_4": { description: "SPC Signal Delay Maliyet: Cost_Delay = DefectsProduced * CostPerDefect", requiredInputs: [], outputHint: "number" },
  "user.spc_signal_delay_5": { description: "SPC Signal Delay Maliyet: InvestigationCost = FalseAlarmRate * SamplingFrequency * LaborRate", requiredInputs: [], outputHint: "number" },
  "user.spc_signal_delay_6": { description: "SPC Signal Delay Maliyet: OptimalInterval = SQRT((2 * SamplingCost * ProductionRate) / (Cost_Delay * ShiftMagnitude^2))", requiredInputs: [], outputHint: "number" },
  // ── Steam Trap Enerji kayıp ──
  "user.steam_trap_energy_loss_0": { description: "Steam Trap Enerji kayıp: OrificeFlow = C_d * A * SQRT(2 * DeltaP * Density)", requiredInputs: [], outputHint: "number" },
  "user.steam_trap_energy_loss_1": { description: "Steam Trap Enerji kayıp: SteamLoss_kg_h = OrificeFlow * 3600", requiredInputs: [], outputHint: "number" },
  "user.steam_trap_energy_loss_2": { description: "Steam Trap Enerji kayıp: EnergyLoss_kW = SteamLoss_kg_h * Enthalpy_Steam / 3600", requiredInputs: [], outputHint: "number" },
  "user.steam_trap_energy_loss_3": { description: "Steam Trap Enerji kayıp: AnnualCost = EnergyLoss_kW * OperatingHours * SteamCost_per_kWh", requiredInputs: [], outputHint: "number" },
  "user.steam_trap_energy_loss_4": { description: "Steam Trap Enerji kayıp: TrapFailureRate = FailedTraps / TotalTraps", requiredInputs: [], outputHint: "number" },
  "user.steam_trap_energy_loss_5": { description: "Steam Trap Enerji kayıp: TotalSystemLoss = SUM(AnnualCost_i)", requiredInputs: [], outputHint: "number" },
  "user.steam_trap_energy_loss_6": { description: "Steam Trap Enerji kayıp: RepairROI = TotalSystemLoss / (TrapCost + LaborCost)", requiredInputs: [], outputHint: "number" },
  // ── Stok Devir hızı risk ──
  "user.inventory_turnover_risk_0": { description: "Stok Devir hızı risk: InventoryTurnover = COGS / AverageInventory", requiredInputs: [], outputHint: "number" },
  "user.inventory_turnover_risk_1": { description: "Stok Devir hızı risk: DaysSalesInventory = 365 / InventoryTurnover", requiredInputs: [], outputHint: "number" },
  "user.inventory_turnover_risk_2": { description: "Stok Devir hızı risk: ObsolescenceRisk = SUM(AgingBracket_i * ObsolescenceRate_i * InventoryValue_i)", requiredInputs: [], outputHint: "number" },
  "user.inventory_turnover_risk_3": { description: "Stok Devir hızı risk: CarryingCost = AverageInventory * (WACC + Storage + Insurance + Obsolescence)", requiredInputs: [], outputHint: "number" },
  "user.inventory_turnover_risk_4": { description: "Stok Devir hızı risk: OptimalTurnover = IndustryBenchmark * AdjustmentFactor", requiredInputs: [], outputHint: "number" },
  "user.inventory_turnover_risk_5": { description: "Stok Devir hızı risk: StockoutRisk = IF(Turnover > MaxThreshold, High, Low)", requiredInputs: [], outputHint: "number" },
  "user.inventory_turnover_risk_6": { description: "Stok Devir hızı risk: LiquidationLoss = SlowMovingInventory * (1 - SalvageValuePct)", requiredInputs: [], outputHint: "number" },
  // ── Su Kullanımı Optimize Edici ──
  "user.water_usage_optimizer_0": { description: "Su Kullanımı Optimize Edici: WaterIntensity = TotalWaterConsumed / ProductionVolume", requiredInputs: [], outputHint: "number" },
  "user.water_usage_optimizer_1": { description: "Su Kullanımı Optimize Edici: BaselineConsumption = HistoricalAvg * ProductionVolume", requiredInputs: [], outputHint: "number" },
  "user.water_usage_optimizer_2": { description: "Su Kullanımı Optimize Edici: WaterSavings = BaselineConsumption - ActualConsumption", requiredInputs: [], outputHint: "number" },
  "user.water_usage_optimizer_3": { description: "Su Kullanımı Optimize Edici: CostSavings = WaterSavings * (WaterSupplyRate + WastewaterTreatmentRate)", requiredInputs: [], outputHint: "number" },
  "user.water_usage_optimizer_4": { description: "Su Kullanımı Optimize Edici: RecycleRate = RecycledWater / TotalWaterConsumed", requiredInputs: [], outputHint: "number" },
  "user.water_usage_optimizer_5": { description: "Su Kullanımı Optimize Edici: LeakLoss = TotalSupplied - TotalMetered", requiredInputs: [], outputHint: "number" },
  "user.water_usage_optimizer_6": { description: "Su Kullanımı Optimize Edici: ROI_Water = CostSavings / (EquipmentCost + InstallationCost)", requiredInputs: [], outputHint: "number" },
  "user.water_usage_optimizer_7": { description: "Su Kullanımı Optimize Edici: CarbonFootprint_Water = TotalConsumed * EnergyIntensity_Water * GridEmissionFactor", requiredInputs: [], outputHint: "number" },
  // ── Sulama Maliyet Check ──
  "user.irrigation_cost_check_0": { description: "Sulama Maliyet Check: WaterRequirement = ETc * Area * (1 - EffectiveRainfall)", requiredInputs: [], outputHint: "number" },
  "user.irrigation_cost_check_1": { description: "Sulama Maliyet Check: PumpEnergy = (WaterRequirement * TotalHead) / (PumpEff * MotorEff)", requiredInputs: [], outputHint: "number" },
  "user.irrigation_cost_check_2": { description: "Sulama Maliyet Check: EnergyCost = PumpEnergy * ElecRate", requiredInputs: [], outputHint: "number" },
  "user.irrigation_cost_check_3": { description: "Sulama Maliyet Check: MaintCost = Area * MaintRatePerHa", requiredInputs: [], outputHint: "number" },
  "user.irrigation_cost_check_4": { description: "Sulama Maliyet Check: TotalIrrigationCost = EnergyCost + MaintCost + LaborCost + Depreciation", requiredInputs: [], outputHint: "number" },
  "user.irrigation_cost_check_5": { description: "Sulama Maliyet Check: CostPerM3 = TotalIrrigationCost / WaterRequirement", requiredInputs: [], outputHint: "number" },
  "user.irrigation_cost_check_6": { description: "Sulama Maliyet Check: WaterUseEfficiency = (WaterRequirement - Losses) / WaterRequirement", requiredInputs: [], outputHint: "number" },
  // ── Supplier Performans Tco ──
  "user.supplier_performance_tco_0": { description: "Supplier Performans Tco: TCO = PurchasePrice + OrderingCost + TransportCost + QualityCost + InventoryCost + RiskCost", requiredInputs: [], outputHint: "number" },
  "user.supplier_performance_tco_1": { description: "Supplier Performans Tco: QualityCost = DefectRate * AnnualVolume * CostPerDefect", requiredInputs: [], outputHint: "number" },
  "user.supplier_performance_tco_2": { description: "Supplier Performans Tco: InventoryCost = (AvgLeadTime + SafetyStockDays) * DailyDemand * HoldingRate", requiredInputs: [], outputHint: "number" },
  "user.supplier_performance_tco_3": { description: "Supplier Performans Tco: RiskCost = ProbabilityOfDisruption * ImpactCost", requiredInputs: [], outputHint: "number" },
  "user.supplier_performance_tco_4": { description: "Supplier Performans Tco: SupplierScore = (QualityWeight * QualityScore) + (DeliveryWeight * DeliveryScore) + (CostWeight * CostScore)", requiredInputs: [], outputHint: "number" },
  "user.supplier_performance_tco_5": { description: "Supplier Performans Tco: TCO_Variance = TCO_Actual - TCO_Quoted", requiredInputs: [], outputHint: "number" },
  // ── Süt Kâr Dedektörü ──
  "user.dairy_profit_detector_0": { description: "Süt Kâr Dedektörü: FatCorrectedMilk = (0.4 * MilkYield) + (15 * FatYield)", requiredInputs: [], outputHint: "number" },
  "user.dairy_profit_detector_1": { description: "Süt Kâr Dedektörü: ProteinCorrectedMilk = (0.337 * MilkYield) + (11.6 * ProteinYield)", requiredInputs: [], outputHint: "number" },
  "user.dairy_profit_detector_2": { description: "Süt Kâr Dedektörü: FeedCostPerLiter = TotalFeedCost / MilkYield", requiredInputs: [], outputHint: "number" },
  "user.dairy_profit_detector_3": { description: "Süt Kâr Dedektörü: IncomeOverFeedCost = (MilkPrice * MilkYield) - TotalFeedCost", requiredInputs: [], outputHint: "number" },
  "user.dairy_profit_detector_4": { description: "Süt Kâr Dedektörü: MarginPerCow = IncomeOverFeedCost - (VetCost + BreedingCost + LaborCost)", requiredInputs: [], outputHint: "number" },
  "user.dairy_profit_detector_5": { description: "Süt Kâr Dedektörü: HerdProfitability = SUM(MarginPerCow) - FixedOverhead", requiredInputs: [], outputHint: "number" },
  "user.dairy_profit_detector_6": { description: "Süt Kâr Dedektörü: SomaticCellPenalty = IF(SCC > Threshold, MilkYield * PenaltyRate, 0)", requiredInputs: [], outputHint: "number" },
  // ── Taguchi kalite kayıp Fonksiyon ──
  "user.taguchi_quality_loss_0": { description: "Taguchi kalite kayıp Fonksiyon: LossPerUnit = k * (ActualValue - TargetValue)^2", requiredInputs: [], outputHint: "number" },
  "user.taguchi_quality_loss_1": { description: "Taguchi kalite kayıp Fonksiyon: k = CostAtTolerance / Tolerance^2", requiredInputs: [], outputHint: "number" },
  "user.taguchi_quality_loss_2": { description: "Taguchi kalite kayıp Fonksiyon: AverageLoss = k * (Variance + (Mean - Target)^2)", requiredInputs: [], outputHint: "number" },
  "user.taguchi_quality_loss_3": { description: "Taguchi kalite kayıp Fonksiyon: TotalAnnualLoss = AverageLoss * AnnualProduction", requiredInputs: [], outputHint: "number" },
  "user.taguchi_quality_loss_4": { description: "Taguchi kalite kayıp Fonksiyon: SignalToNoise_LargerBetter = -10 * LOG10(SUM(1/y_i^2) / n)", requiredInputs: [], outputHint: "number" },
  "user.taguchi_quality_loss_5": { description: "Taguchi kalite kayıp Fonksiyon: SignalToNoise_SmallerBetter = -10 * LOG10(SUM(y_i^2) / n)", requiredInputs: [], outputHint: "number" },
  "user.taguchi_quality_loss_6": { description: "Taguchi kalite kayıp Fonksiyon: QualityImprovementSavings = (OldAverageLoss - NewAverageLoss) * AnnualProduction", requiredInputs: [], outputHint: "number" },
  // ── Takım Aşınma Maliyeti ──
  "user.tool_wear_cost_0": { description: "Takım Aşınma Maliyeti: ToolCostPerPart = (InsertCost / Edges) * (MachiningTime / ToolLife)", requiredInputs: [], outputHint: "number" },
  "user.tool_wear_cost_1": { description: "Takım Aşınma Maliyeti: ChangeCostPerPart = (ToolChangeTime * MachineRate) * (MachiningTime / ToolLife)", requiredInputs: [], outputHint: "number" },
  "user.tool_wear_cost_2": { description: "Takım Aşınma Maliyeti: TotalToolingCost = ToolCostPerPart + ChangeCostPerPart", requiredInputs: [], outputHint: "number" },
  "user.tool_wear_cost_3": { description: "Takım Aşınma Maliyeti: WearRate = FlankWear / MachiningTime", requiredInputs: [], outputHint: "number" },
  "user.tool_wear_cost_4": { description: "Takım Aşınma Maliyeti: OptimalToolLife = ((1/n - 1) * (ToolChangeTime + InsertCost/Edges / MachineRate))", requiredInputs: [], outputHint: "number" },
  "user.tool_wear_cost_5": { description: "Takım Aşınma Maliyeti: CostOfPrematureFailure = (ExpectedLife - ActualLife) / ExpectedLife * InsertCost", requiredInputs: [], outputHint: "number" },
  // ── Takt Süre Flexibility Maliyet ──
  "user.takt_time_flexibility_0": { description: "Takt Süre Flexibility Maliyet: TaktTime = AvailableTime / CustomerDemand", requiredInputs: [], outputHint: "number" },
  "user.takt_time_flexibility_1": { description: "Takt Süre Flexibility Maliyet: CycleTimeFlexibility = MAX(CycleTime_i) - MIN(CycleTime_i)", requiredInputs: [], outputHint: "number" },
  "user.takt_time_flexibility_2": { description: "Takt Süre Flexibility Maliyet: BalanceLoss = SUM(TaktTime - CycleTime_i) * LaborRate", requiredInputs: [], outputHint: "number" },
  "user.takt_time_flexibility_3": { description: "Takt Süre Flexibility Maliyet: CrossTrainingCost = Operators * TrainingHours * TrainerRate", requiredInputs: [], outputHint: "number" },
  "user.takt_time_flexibility_4": { description: "Takt Süre Flexibility Maliyet: FlexibilityPremium = CrossTrainingCost / AnnualProduction", requiredInputs: [], outputHint: "number" },
  "user.takt_time_flexibility_5": { description: "Takt Süre Flexibility Maliyet: VolumeVariationCost = IF(Demand > Capacity, (Demand - Capacity) * OvertimeRate, (Capacity - Demand) * IdleLaborCost)", requiredInputs: [], outputHint: "number" },
  // ── talep Forecast Stok Maliyet ──
  "user.demand_forecast_stock_0": { description: "talep Forecast Stok Maliyet: ForecastError = ABS(ActualDemand - ForecastDemand) / ActualDemand", requiredInputs: [], outputHint: "number" },
  "user.demand_forecast_stock_1": { description: "talep Forecast Stok Maliyet: SafetyStock = Z_Score * StdDev_ForecastError * SQRT(LeadTime)", requiredInputs: [], outputHint: "number" },
  "user.demand_forecast_stock_2": { description: "talep Forecast Stok Maliyet: CarryingCost_Safety = SafetyStock * UnitCost * HoldingRate", requiredInputs: [], outputHint: "number" },
  "user.demand_forecast_stock_3": { description: "talep Forecast Stok Maliyet: StockoutCost = IF(ActualDemand > (ForecastDemand + SafetyStock), (ActualDemand - ForecastDemand - SafetyStock) * PenaltyCost, 0)", requiredInputs: [], outputHint: "number" },
  "user.demand_forecast_stock_4": { description: "talep Forecast Stok Maliyet: TotalForecastCost = CarryingCost_Safety + StockoutCost + ForecastingSystemCost", requiredInputs: [], outputHint: "number" },
  // ── Tamirhane Parça ve İşçilik Teklif ──
  "user.repair_shop_quote_0": { description: "Tamirhane Parça ve İşçilik Teklif: PartCost = SUM(Quantity_i * DealerPrice_i)", requiredInputs: [], outputHint: "number" },
  "user.repair_shop_quote_1": { description: "Tamirhane Parça ve İşçilik Teklif: PartMargin = PartCost * PartMarkupPct", requiredInputs: [], outputHint: "number" },
  "user.repair_shop_quote_2": { description: "Tamirhane Parça ve İşçilik Teklif: LaborCost = FlatRateHours * ShopHourlyRate", requiredInputs: [], outputHint: "number" },
  "user.repair_shop_quote_3": { description: "Tamirhane Parça ve İşçilik Teklif: SubletCost = SUM(SubletInvoices)", requiredInputs: [], outputHint: "number" },
  "user.repair_shop_quote_4": { description: "Tamirhane Parça ve İşçilik Teklif: TotalQuote = PartCost + PartMargin + LaborCost + SubletCost + ShopSuppliesFee + EnvironmentalFee", requiredInputs: [], outputHint: "number" },
  "user.repair_shop_quote_5": { description: "Tamirhane Parça ve İşçilik Teklif: EffectiveLaborRate = (LaborCost + PartMargin) / ActualHours", requiredInputs: [], outputHint: "number" },
  "user.repair_shop_quote_6": { description: "Tamirhane Parça ve İşçilik Teklif: GrossProfitPct = (TotalQuote - PartCost - ActualLaborCost) / TotalQuote", requiredInputs: [], outputHint: "number" },
  // ── Taşeron Marj Sızıntı Dedektörü ──
  "user.subcontractor_margin_leak_0": { description: "Taşeron Marj Sızıntı Dedektörü: QuotedMargin = (ContractValue - EstimatedSubcontractorCost) / ContractValue", requiredInputs: [], outputHint: "number" },
  "user.subcontractor_margin_leak_1": { description: "Taşeron Marj Sızıntı Dedektörü: ActualMargin = (ContractValue - ActualSubcontractorCost - ReworkCost - DelayPenalties) / ContractValue", requiredInputs: [], outputHint: "number" },
  "user.subcontractor_margin_leak_2": { description: "Taşeron Marj Sızıntı Dedektörü: MarginLeak = QuotedMargin - ActualMargin", requiredInputs: [], outputHint: "number" },
  "user.subcontractor_margin_leak_3": { description: "Taşeron Marj Sızıntı Dedektörü: ChangeOrderCost = SUM(ChangeOrderAmount_i)", requiredInputs: [], outputHint: "number" },
  "user.subcontractor_margin_leak_4": { description: "Taşeron Marj Sızıntı Dedektörü: UnbilledWork = ActualWorkCompleted - BilledAmount", requiredInputs: [], outputHint: "number" },
  "user.subcontractor_margin_leak_5": { description: "Taşeron Marj Sızıntı Dedektörü: LeakagePct = MarginLeak / QuotedMargin", requiredInputs: [], outputHint: "number" },
  // ── Taşıma Mode Maliyet risk ──
  "user.transport_mode_risk_0": { description: "Taşıma Mode Maliyet risk: Cost_Air = Weight * AirRate + Handling", requiredInputs: [], outputHint: "number" },
  "user.transport_mode_risk_1": { description: "Taşıma Mode Maliyet risk: Cost_Sea = Volume * SeaRate + PortFees + Customs", requiredInputs: [], outputHint: "number" },
  "user.transport_mode_risk_2": { description: "Taşıma Mode Maliyet risk: Cost_Road = Distance * RoadRate + Tolls", requiredInputs: [], outputHint: "number" },
  "user.transport_mode_risk_3": { description: "Taşıma Mode Maliyet risk: TransitTimeCost = TransitDays * InventoryCarryingCostPerDay", requiredInputs: [], outputHint: "number" },
  "user.transport_mode_risk_4": { description: "Taşıma Mode Maliyet risk: RiskCost = ProbabilityOfDamage * CargoValue + ProbabilityOfDelay * DelayPenalty", requiredInputs: [], outputHint: "number" },
  "user.transport_mode_risk_5": { description: "Taşıma Mode Maliyet risk: TotalModeCost = TransportCost + TransitTimeCost + RiskCost", requiredInputs: [], outputHint: "number" },
  "user.transport_mode_risk_6": { description: "Taşıma Mode Maliyet risk: ModeSelection = MIN(TotalModeCost_Air, TotalModeCost_Sea, TotalModeCost_Road)", requiredInputs: [], outputHint: "number" },
  // ── Tedarik Zinciri Kesintisi Risk Değerlendirmesi ──
  "user.supply_chain_disruption_0": { description: "Tedarik Zinciri Kesintisi Risk Değerlendirmesi: RiskExposure = ProbabilityOfDisruption * FinancialImpact", requiredInputs: [], outputHint: "number" },
  "user.supply_chain_disruption_1": { description: "Tedarik Zinciri Kesintisi Risk Değerlendirmesi: TimeToRecover = DaysToRestoreFullCapacity", requiredInputs: [], outputHint: "number" },
  "user.supply_chain_disruption_2": { description: "Tedarik Zinciri Kesintisi Risk Değerlendirmesi: RevenueLoss = DailyRevenue * TimeToRecover * (1 - BufferCapacityPct)", requiredInputs: [], outputHint: "number" },
  "user.supply_chain_disruption_3": { description: "Tedarik Zinciri Kesintisi Risk Değerlendirmesi: MitigationCost = DualSourcingPremium + SafetyStockCarryingCost + InsurancePremium", requiredInputs: [], outputHint: "number" },
  "user.supply_chain_disruption_4": { description: "Tedarik Zinciri Kesintisi Risk Değerlendirmesi: RiskAdjustedCost = ExpectedAnnualLoss + MitigationCost", requiredInputs: [], outputHint: "number" },
  "user.supply_chain_disruption_5": { description: "Tedarik Zinciri Kesintisi Risk Değerlendirmesi: ResilienceIndex = 1 / (TimeToRecover * VulnerabilityScore)", requiredInputs: [], outputHint: "number" },
  // ── Tedarikçi Döviz Kuru Riski ──
  "user.supplier_currency_risk_0": { description: "Tedarikçi Döviz Kuru Riski: Exposure = ContractValue_FC * UnhedgedPct", requiredInputs: [], outputHint: "number" },
  "user.supplier_currency_risk_1": { description: "Tedarikçi Döviz Kuru Riski: ExpectedLoss = Exposure * (ForwardRate - ExpectedSpotRate)", requiredInputs: [], outputHint: "number" },
  "user.supplier_currency_risk_2": { description: "Tedarikçi Döviz Kuru Riski: VaR = Exposure * Volatility * Z_Score * SQRT(TimeHorizon)", requiredInputs: [], outputHint: "number" },
  "user.supplier_currency_risk_3": { description: "Tedarikçi Döviz Kuru Riski: HedgingCost = Exposure * (ForwardRate - SpotRate)", requiredInputs: [], outputHint: "number" },
  "user.supplier_currency_risk_4": { description: "Tedarikçi Döviz Kuru Riski: NetRiskCost = ExpectedLoss + HedgingCost", requiredInputs: [], outputHint: "number" },
  "user.supplier_currency_risk_5": { description: "Tedarikçi Döviz Kuru Riski: CurrencyClauseSavings = IF(ContractHasAdjustment, Exposure * AdjustmentFactor, 0)", requiredInputs: [], outputHint: "number" },
  // ── Teklif Risk Analizörü ──
  "user.bid_risk_0": { description: "Teklif Risk Analizörü: BaseEstimate = SUM(DirectCosts) + Overhead", requiredInputs: [], outputHint: "number" },
  "user.bid_risk_1": { description: "Teklif Risk Analizörü: Contingency = BaseEstimate * RiskFactor", requiredInputs: [], outputHint: "number" },
  "user.bid_risk_2": { description: "Teklif Risk Analizörü: ExpectedMargin = (BidPrice - (BaseEstimate + Contingency)) / BidPrice", requiredInputs: [], outputHint: "number" },
  "user.bid_risk_3": { description: "Teklif Risk Analizörü: WinProbability = f(BidPrice, CompetitorIndex, HistoricalWinRate)", requiredInputs: [], outputHint: "number" },
  "user.bid_risk_4": { description: "Teklif Risk Analizörü: ExpectedValue = WinProbability * ExpectedMargin * BidPrice", requiredInputs: [], outputHint: "number" },
  "user.bid_risk_5": { description: "Teklif Risk Analizörü: RiskAdjustedBid = BaseEstimate / (1 - TargetMargin - RiskPremium)", requiredInputs: [], outputHint: "number" },
  // ── Tekrarlayan Maliyet (RCA) ──
  "user.recurring_cost_0": { description: "Tekrarlayan Maliyet (RCA): RecurringCost_Annual = Frequency * CostPerEvent", requiredInputs: [], outputHint: "number" },
  "user.recurring_cost_1": { description: "Tekrarlayan Maliyet (RCA): PresentValue_Recurring = RecurringCost_Annual * ((1 - (1+r)^-n) / r)", requiredInputs: [], outputHint: "number" },
  "user.recurring_cost_2": { description: "Tekrarlayan Maliyet (RCA): RootCauseInvestment = CorrectiveActionCost + ImplementationCost", requiredInputs: [], outputHint: "number" },
  "user.recurring_cost_3": { description: "Tekrarlayan Maliyet (RCA): PaybackPeriod = RootCauseInvestment / RecurringCost_Annual", requiredInputs: [], outputHint: "number" },
  "user.recurring_cost_4": { description: "Tekrarlayan Maliyet (RCA): NPV_Elimination = PresentValue_Recurring - RootCauseInvestment", requiredInputs: [], outputHint: "number" },
  "user.recurring_cost_5": { description: "Tekrarlayan Maliyet (RCA): BreakevenFrequency = RootCauseInvestment / CostPerEvent", requiredInputs: [], outputHint: "number" },
  // ── Tekstil Atığı Risk Değerlendirmesi ──
  "user.textile_waste_risk_0": { description: "Tekstil Atığı Risk Değerlendirmesi: WasteRate = (InputFabric - OutputGarments) / InputFabric", requiredInputs: [], outputHint: "number" },
  "user.textile_waste_risk_1": { description: "Tekstil Atığı Risk Değerlendirmesi: PreConsumerWaste = CuttingScrap + SewingDefects + DyeingRework", requiredInputs: [], outputHint: "number" },
  "user.textile_waste_risk_2": { description: "Tekstil Atığı Risk Değerlendirmesi: FinancialLoss = PreConsumerWaste * FabricCostPerKg + ProcessingCost", requiredInputs: [], outputHint: "number" },
  "user.textile_waste_risk_3": { description: "Tekstil Atığı Risk Değerlendirmesi: DisposalCost = WasteWeight * LandfillFee", requiredInputs: [], outputHint: "number" },
  "user.textile_waste_risk_4": { description: "Tekstil Atığı Risk Değerlendirmesi: CircularRevenue = RecycledWasteWeight * ScrapValue", requiredInputs: [], outputHint: "number" },
  "user.textile_waste_risk_5": { description: "Tekstil Atığı Risk Değerlendirmesi: NetWasteCost = FinancialLoss + DisposalCost - CircularRevenue", requiredInputs: [], outputHint: "number" },
  "user.textile_waste_risk_6": { description: "Tekstil Atığı Risk Değerlendirmesi: RiskScore = NetWasteCost / TotalRevenue", requiredInputs: [], outputHint: "number" },
  // ── Temizlik Teklifi Optimize Edici ──
  "user.cleaning_bid_optimizer_0": { description: "Temizlik Teklifi Optimize Edici: AreaToClean = TotalSqM * CleanablePct", requiredInputs: [], outputHint: "number" },
  "user.cleaning_bid_optimizer_1": { description: "Temizlik Teklifi Optimize Edici: LaborHours = AreaToClean / ProductionRatePerHour", requiredInputs: [], outputHint: "number" },
  "user.cleaning_bid_optimizer_2": { description: "Temizlik Teklifi Optimize Edici: LaborCost = LaborHours * HourlyWage * (1 + Burden)", requiredInputs: [], outputHint: "number" },
  "user.cleaning_bid_optimizer_3": { description: "Temizlik Teklifi Optimize Edici: MaterialCost = AreaToClean * ConsumableCostPerSqM", requiredInputs: [], outputHint: "number" },
  "user.cleaning_bid_optimizer_4": { description: "Temizlik Teklifi Optimize Edici: EquipmentCost = MachineHours * DepreciationRate", requiredInputs: [], outputHint: "number" },
  "user.cleaning_bid_optimizer_5": { description: "Temizlik Teklifi Optimize Edici: Overhead = (LaborCost + MaterialCost) * OverheadPct", requiredInputs: [], outputHint: "number" },
  "user.cleaning_bid_optimizer_6": { description: "Temizlik Teklifi Optimize Edici: BidPrice = (LaborCost + MaterialCost + EquipmentCost + Overhead) / (1 - TargetMargin)", requiredInputs: [], outputHint: "number" },
  // ── Teslimat Maliyeti ──
  "user.delivery_cost_0": { description: "Teslimat Maliyeti: CostPerDrop = TotalRouteCost / NumberOfDrops", requiredInputs: [], outputHint: "number" },
  "user.delivery_cost_1": { description: "Teslimat Maliyeti: CostPerKm = TotalRouteCost / TotalDistance", requiredInputs: [], outputHint: "number" },
  "user.delivery_cost_2": { description: "Teslimat Maliyeti: FailedDeliveryCost = FailedDrops * (ReturnFreight + RestockingFee + AdminCost)", requiredInputs: [], outputHint: "number" },
  "user.delivery_cost_3": { description: "Teslimat Maliyeti: FuelSurcharge = BaseFreight * FuelIndexPct", requiredInputs: [], outputHint: "number" },
  "user.delivery_cost_4": { description: "Teslimat Maliyeti: TotalDeliveryCost = Linehaul + LastMile + FailedDeliveryCost + Surcharges", requiredInputs: [], outputHint: "number" },
  "user.delivery_cost_5": { description: "Teslimat Maliyeti: DeliveryEfficiency = SuccessfulDrops / TotalPlannedDrops", requiredInputs: [], outputHint: "number" },
  // ── Tohum Oranı ──
  "user.seed_rate_0": { description: "Tohum Oranı: TargetPlantPopulation = Area * DesiredPlantsPerSqm", requiredInputs: [], outputHint: "number" },
  "user.seed_rate_1": { description: "Tohum Oranı: SeedRequirement = TargetPlantPopulation / (GerminationRate * FieldEmergenceRate)", requiredInputs: [], outputHint: "number" },
  "user.seed_rate_2": { description: "Tohum Oranı: SeedCost = SeedRequirement * PricePerKg", requiredInputs: [], outputHint: "number" },
  "user.seed_rate_3": { description: "Tohum Oranı: OptimalYield = f(PlantPopulation, SoilFertility, Water)", requiredInputs: [], outputHint: "number" },
  "user.seed_rate_4": { description: "Tohum Oranı: FinancialLoss_Under = (TargetYield - ActualYield) * CropPrice", requiredInputs: [], outputHint: "number" },
  "user.seed_rate_5": { description: "Tohum Oranı: FinancialLoss_Over = (ActualSeed - OptimalSeed) * SeedCost", requiredInputs: [], outputHint: "number" },
  "user.seed_rate_6": { description: "Tohum Oranı: ROI_Seed = (OptimalYield * CropPrice - SeedCost) / SeedCost", requiredInputs: [], outputHint: "number" },
  // ── Toplam Çalışan Maliyeti ──
  "user.total_employee_cost_0": { description: "Toplam Çalışan Maliyeti: GrossSalary = BasePay + Bonuses + Overtime", requiredInputs: [], outputHint: "number" },
  "user.total_employee_cost_1": { description: "Toplam Çalışan Maliyeti: StatutoryCosts = GrossSalary * (SocialSecurity + Unemployment + Taxes)", requiredInputs: [], outputHint: "number" },
  "user.total_employee_cost_2": { description: "Toplam Çalışan Maliyeti: Benefits = HealthInsurance + Retirement + Meals + Transport", requiredInputs: [], outputHint: "number" },
  "user.total_employee_cost_3": { description: "Toplam Çalışan Maliyeti: AbsenteeismCost = AbsentHours * FullyBurdenedRate", requiredInputs: [], outputHint: "number" },
  "user.total_employee_cost_4": { description: "Toplam Çalışan Maliyeti: TurnoverCost = (Recruitment + Training) * TurnoverRate", requiredInputs: [], outputHint: "number" },
  "user.total_employee_cost_5": { description: "Toplam Çalışan Maliyeti: TotalEmployeeCost = GrossSalary + StatutoryCosts + Benefits + AbsenteeismCost + TurnoverCost", requiredInputs: [], outputHint: "number" },
  "user.total_employee_cost_6": { description: "Toplam Çalışan Maliyeti: CostPerHour = TotalEmployeeCost / ProductiveHours", requiredInputs: [], outputHint: "number" },
  // ── Transfer Fiyatlandırması Optimize Edici ──
  "user.transfer_pricing_optimizer_0": { description: "Transfer Fiyatlandırması Optimize Edici: CostPlusPrice = FullCost * (1 + MarkupPct)", requiredInputs: [], outputHint: "number" },
  "user.transfer_pricing_optimizer_1": { description: "Transfer Fiyatlandırması Optimize Edici: MarketBasedPrice = ComparableUncontrolledPrice", requiredInputs: [], outputHint: "number" },
  "user.transfer_pricing_optimizer_2": { description: "Transfer Fiyatlandırması Optimize Edici: MarginalCost = VariableCost + OpportunityCost", requiredInputs: [], outputHint: "number" },
  "user.transfer_pricing_optimizer_3": { description: "Transfer Fiyatlandırması Optimize Edici: TaxImpact = (TransferPrice - ArmLengthPrice) * (TaxRate_High - TaxRate_Low)", requiredInputs: [], outputHint: "number" },
  "user.transfer_pricing_optimizer_4": { description: "Transfer Fiyatlandırması Optimize Edici: GlobalProfit = Revenue_Final - (Cost_Origin + Cost_Transfer + TaxImpact)", requiredInputs: [], outputHint: "number" },
  "user.transfer_pricing_optimizer_5": { description: "Transfer Fiyatlandırması Optimize Edici: OptimalTransferPrice = Price that MAXIMIZES GlobalProfit subject to TaxRegulations", requiredInputs: [], outputHint: "number" },
  // ── ürün Complexity Hidden Maliyet ──
  "user.product_complexity_hidden_cost_0": { description: "ürün Complexity Hidden Maliyet: ComplexityIndex = NumberOfSKUs * AverageBOMDepth", requiredInputs: [], outputHint: "number" },
  "user.product_complexity_hidden_cost_1": { description: "ürün Complexity Hidden Maliyet: SetupCostComplexity = Changeovers * SetupCostPerChange", requiredInputs: [], outputHint: "number" },
  "user.product_complexity_hidden_cost_2": { description: "ürün Complexity Hidden Maliyet: InventoryCostComplexity = SafetyStock_AllSKUs * HoldingRate", requiredInputs: [], outputHint: "number" },
  "user.product_complexity_hidden_cost_3": { description: "ürün Complexity Hidden Maliyet: OverheadAllocation = TotalIndirectCosts * ComplexityDriverPct", requiredInputs: [], outputHint: "number" },
  "user.product_complexity_hidden_cost_4": { description: "ürün Complexity Hidden Maliyet: HiddenCost = SetupCostComplexity + InventoryCostComplexity + (OverheadAllocation - TraditionalOverhead)", requiredInputs: [], outputHint: "number" },
  "user.product_complexity_hidden_cost_5": { description: "ürün Complexity Hidden Maliyet: ProfitabilityPerSKU = (Revenue_SKU - DirectCost_SKU - HiddenCost_SKU)", requiredInputs: [], outputHint: "number" },
  // ── Vakum Kaçağı Enerji Kaybı ──
  "user.vacuum_leak_energy_0": { description: "Vakum Kaçağı Enerji Kaybı: LeakRate = Volume * DeltaP / DeltaT", requiredInputs: [], outputHint: "number" },
  "user.vacuum_leak_energy_1": { description: "Vakum Kaçağı Enerji Kaybı: PowerLoss_kW = (LeakRate * P_Atmospheric) / (PumpEff * 1000)", requiredInputs: [], outputHint: "number" },
  "user.vacuum_leak_energy_2": { description: "Vakum Kaçağı Enerji Kaybı: AnnualEnergyLoss = PowerLoss_kW * OperatingHours", requiredInputs: [], outputHint: "number" },
  "user.vacuum_leak_energy_3": { description: "Vakum Kaçağı Enerji Kaybı: CostOfLeak = AnnualEnergyLoss * ElecRate", requiredInputs: [], outputHint: "number" },
  "user.vacuum_leak_energy_4": { description: "Vakum Kaçağı Enerji Kaybı: PumpCapacityWaste = LeakRate / TotalPumpCapacity", requiredInputs: [], outputHint: "number" },
  "user.vacuum_leak_energy_5": { description: "Vakum Kaçağı Enerji Kaybı: CarbonEmissions = AnnualEnergyLoss * GridEmissionFactor", requiredInputs: [], outputHint: "number" },
  // ── Vardiya Maliyet Verimliliği ──
  "user.shift_cost_efficiency_0": { description: "Vardiya Maliyet Verimliliği: PlannedProductionTime = ShiftDuration - PlannedDowntime", requiredInputs: [], outputHint: "number" },
  "user.shift_cost_efficiency_1": { description: "Vardiya Maliyet Verimliliği: ActualRunTime = PlannedProductionTime - UnplannedDowntime", requiredInputs: [], outputHint: "number" },
  "user.shift_cost_efficiency_2": { description: "Vardiya Maliyet Verimliliği: LaborCost = Operators * ShiftHours * HourlyRate", requiredInputs: [], outputHint: "number" },
  "user.shift_cost_efficiency_3": { description: "Vardiya Maliyet Verimliliği: EnergyCost = MachinePower * ActualRunTime * ElecRate", requiredInputs: [], outputHint: "number" },
  "user.shift_cost_efficiency_4": { description: "Vardiya Maliyet Verimliliği: OutputValue = GoodUnits * UnitContributionMargin", requiredInputs: [], outputHint: "number" },
  "user.shift_cost_efficiency_5": { description: "Vardiya Maliyet Verimliliği: ShiftEfficiency = OutputValue / (LaborCost + EnergyCost + Overhead)", requiredInputs: [], outputHint: "number" },
  "user.shift_cost_efficiency_6": { description: "Vardiya Maliyet Verimliliği: CostPerUnit = (LaborCost + EnergyCost + Overhead) / GoodUnits", requiredInputs: [], outputHint: "number" },
  // ── Vsm finansal Dönüştürücü ──
  "user.vsm_financial_converter_0": { description: "Vsm finansal Dönüştürücü: LeadTimeCost = WIP_Inventory * DailyCarryingCost * TotalLeadTimeDays", requiredInputs: [], outputHint: "number" },
  "user.vsm_financial_converter_1": { description: "Vsm finansal Dönüştürücü: ValueAddedRatio = ValueAddedTime / TotalLeadTime", requiredInputs: [], outputHint: "number" },
  "user.vsm_financial_converter_2": { description: "Vsm finansal Dönüştürücü: NonValueAddedCost = (TotalLeadTime - ValueAddedTime) * CostPerMinute", requiredInputs: [], outputHint: "number" },
  "user.vsm_financial_converter_3": { description: "Vsm finansal Dönüştürücü: InventoryReductionSavings = (OldWIP - NewWIP) * CarryingRate", requiredInputs: [], outputHint: "number" },
  "user.vsm_financial_converter_4": { description: "Vsm finansal Dönüştürücü: ProductivityGain = (OldCycleTime - NewCycleTime) * AnnualVolume * LaborRate", requiredInputs: [], outputHint: "number" },
  "user.vsm_financial_converter_5": { description: "Vsm finansal Dönüştürücü: TotalFinancialImpact = InventoryReductionSavings + ProductivityGain + QualityImprovementSavings", requiredInputs: [], outputHint: "number" },
  // ── WPS Preheat Sıcaklık ──
  "user.wps_preheat_temperature_0": { description: "WPS Preheat Sıcaklık: CarbonEquivalent_CE = C + (Mn/6) + ((Cr+Mo+V)/5) + ((Ni+Cu)/15)", requiredInputs: [], outputHint: "number" },
  "user.wps_preheat_temperature_1": { description: "WPS Preheat Sıcaklık: PreheatTemp = f(CE, Thickness, HydrogenLevel, HeatInput)", requiredInputs: [], outputHint: "number" },
  "user.wps_preheat_temperature_2": { description: "WPS Preheat Sıcaklık: CriticalCoolingTime = t_8_5 = (Thickness^2 / HeatInput) * Constant", requiredInputs: [], outputHint: "number" },
  "user.wps_preheat_temperature_3": { description: "WPS Preheat Sıcaklık: HydrogenCrackingRisk = IF(PreheatTemp < RequiredPreheat, 'HIGH', 'LOW')", requiredInputs: [], outputHint: "number" },
  "user.wps_preheat_temperature_4": { description: "WPS Preheat Sıcaklık: EnergyCost = Mass * SpecificHeat * (PreheatTemp - AmbientTemp) / HeaterEfficiency * EnergyPrice", requiredInputs: [], outputHint: "number" },
  // ── Yakıt Rota Sapma ──
  "user.fuel_route_drift_0": { description: "Yakıt Rota Sapma: PlannedFuel = PlannedDistance * FuelEfficiency", requiredInputs: [], outputHint: "number" },
  "user.fuel_route_drift_1": { description: "Yakıt Rota Sapma: ActualFuel = ActualDistance * ActualFuelEfficiency", requiredInputs: [], outputHint: "number" },
  "user.fuel_route_drift_2": { description: "Yakıt Rota Sapma: RouteDrift = ActualDistance - PlannedDistance", requiredInputs: [], outputHint: "number" },
  "user.fuel_route_drift_3": { description: "Yakıt Rota Sapma: FuelWaste_Distance = RouteDrift * FuelEfficiency * FuelPrice", requiredInputs: [], outputHint: "number" },
  "user.fuel_route_drift_4": { description: "Yakıt Rota Sapma: FuelWaste_Efficiency = PlannedDistance * (ActualFuelEfficiency - FuelEfficiency) * FuelPrice", requiredInputs: [], outputHint: "number" },
  "user.fuel_route_drift_5": { description: "Yakıt Rota Sapma: IdleFuelCost = IdleTime * IdleConsumptionRate * FuelPrice", requiredInputs: [], outputHint: "number" },
  "user.fuel_route_drift_6": { description: "Yakıt Rota Sapma: TotalDriftCost = FuelWaste_Distance + FuelWaste_Efficiency + IdleFuelCost", requiredInputs: [], outputHint: "number" },
  // ── Yangın Hidrantı Akış ──
  "user.fire_hydrant_flow_0": { description: "Yangın Hidrantı Akış: FlowRate_Q = 29.83 * c_d * d^2 * SQRT(P_Pitot)", requiredInputs: [], outputHint: "number" },
  "user.fire_hydrant_flow_1": { description: "Yangın Hidrantı Akış: ResidualPressure = P_Static - (FlowRate_Q / Coefficient)^1.85", requiredInputs: [], outputHint: "number" },
  "user.fire_hydrant_flow_2": { description: "Yangın Hidrantı Akış: AvailableFlow_At20psi = FlowRate_Q * ((P_Static - 20) / (P_Static - P_Residual))^0.54", requiredInputs: [], outputHint: "number" },
  "user.fire_hydrant_flow_3": { description: "Yangın Hidrantı Akış: FrictionLoss = f * (Length / Diameter) * (Velocity^2 / 2g)", requiredInputs: [], outputHint: "number" },
  "user.fire_hydrant_flow_4": { description: "Yangın Hidrantı Akış: RequiredPumpHead = ElevationHead + FrictionLoss + NozzlePressure", requiredInputs: [], outputHint: "number" },
  "user.fire_hydrant_flow_5": { description: "Yangın Hidrantı Akış: Compliance = IF(AvailableFlow_At20psi > RequiredFlow, 'PASS', 'FAIL')", requiredInputs: [], outputHint: "number" },
  // ── Yenileme Bütçesi Optimize Edici ──
  "user.renovation_budget_optimizer_0": { description: "Yenileme Bütçesi Optimize Edici: BaseCost = Area * CostPerSqM_ByComplexity", requiredInputs: [], outputHint: "number" },
  "user.renovation_budget_optimizer_1": { description: "Yenileme Bütçesi Optimize Edici: Escalation = BaseCost * ((1 + InflationRate)^ProjectDuration - 1)", requiredInputs: [], outputHint: "number" },
  "user.renovation_budget_optimizer_2": { description: "Yenileme Bütçesi Optimize Edici: Contingency = (BaseCost + Escalation) * RiskFactor", requiredInputs: [], outputHint: "number" },
  "user.renovation_budget_optimizer_3": { description: "Yenileme Bütçesi Optimize Edici: SoftCosts = (BaseCost + Escalation) * (DesignFeePct + PermitFeePct)", requiredInputs: [], outputHint: "number" },
  "user.renovation_budget_optimizer_4": { description: "Yenileme Bütçesi Optimize Edici: TotalBudget = BaseCost + Escalation + Contingency + SoftCosts + FF_E", requiredInputs: [], outputHint: "number" },
  "user.renovation_budget_optimizer_5": { description: "Yenileme Bütçesi Optimize Edici: ROI_Renovation = (NewPropertyValue - OldPropertyValue - TotalBudget) / TotalBudget", requiredInputs: [], outputHint: "number" },
  // ── Yenilenebilir Enerji YG ──
  "user.renewable_energy_irr_0": { description: "Yenilenebilir Enerji YG: AnnualGeneration = SystemCapacity * CapacityFactor * 8760", requiredInputs: [], outputHint: "number" },
  "user.renewable_energy_irr_1": { description: "Yenilenebilir Enerji YG: AnnualSavings = AnnualGeneration * GridElectricityRate", requiredInputs: [], outputHint: "number" },
  "user.renewable_energy_irr_2": { description: "Yenilenebilir Enerji YG: AnnualOPEX = Maintenance + Insurance + InverterReplacementFund", requiredInputs: [], outputHint: "number" },
  "user.renewable_energy_irr_3": { description: "Yenilenebilir Enerji YG: NetCashFlow = AnnualSavings - AnnualOPEX + Incentives", requiredInputs: [], outputHint: "number" },
  "user.renewable_energy_irr_4": { description: "Yenilenebilir Enerji YG: PaybackPeriod = TotalCapex / NetCashFlow", requiredInputs: [], outputHint: "number" },
  "user.renewable_energy_irr_5": { description: "Yenilenebilir Enerji YG: LCOE = (TotalCapex + SUM(OPEX_t / (1+r)^t)) / SUM(Generation_t / (1+r)^t)", requiredInputs: [], outputHint: "number" },
  "user.renewable_energy_irr_6": { description: "Yenilenebilir Enerji YG: NPV = SUM(NetCashFlow_t / (1+WACC)^t) - TotalCapex", requiredInputs: [], outputHint: "number" },
  // ── YG ve NBD ──
  "user.roi_npv_0": { description: "YG ve NBD: ROI = (TotalNetProfit / TotalInvestment) * 100", requiredInputs: [], outputHint: "number" },
  "user.roi_npv_1": { description: "YG ve NBD: NPV = SUM(CashFlow_t / (1 + DiscountRate)^t) - InitialInvestment", requiredInputs: [], outputHint: "number" },
  "user.roi_npv_2": { description: "YG ve NBD: IRR = Rate where NPV = 0", requiredInputs: [], outputHint: "number" },
  "user.roi_npv_3": { description: "YG ve NBD: PaybackPeriod = Year before full recovery + (UnrecoveredCost / CashFlow_RecoveryYear)", requiredInputs: [], outputHint: "number" },
  "user.roi_npv_4": { description: "YG ve NBD: ProfitabilityIndex = PV_FutureCashFlows / InitialInvestment", requiredInputs: [], outputHint: "number" },
  "user.roi_npv_5": { description: "YG ve NBD: DiscountedPayback = Year where CumulativeDiscountedCashFlow > 0", requiredInputs: [], outputHint: "number" },
  // ── Zaman Etüdü Analizörü ──
  "user.standard_time_work_study_0": { description: "Zaman Etüdü Analizörü: ObservedTime = SUM(CycleTimes) / NumberOfCycles", requiredInputs: [], outputHint: "number" },
  "user.standard_time_work_study_1": { description: "Zaman Etüdü Analizörü: NormalTime = ObservedTime * PerformanceRating", requiredInputs: [], outputHint: "number" },
  "user.standard_time_work_study_2": { description: "Zaman Etüdü Analizörü: AllowancePct = Personal + Fatigue + Delay", requiredInputs: [], outputHint: "number" },
  "user.standard_time_work_study_3": { description: "Zaman Etüdü Analizörü: StandardTime = NormalTime * (1 + AllowancePct)", requiredInputs: [], outputHint: "number" },
  "user.standard_time_work_study_4": { description: "Zaman Etüdü Analizörü: StandardOutput = ShiftDuration / StandardTime", requiredInputs: [], outputHint: "number" },
  "user.standard_time_work_study_5": { description: "Zaman Etüdü Analizörü: LaborCostPerUnit = StandardTime * HourlyRate", requiredInputs: [], outputHint: "number" },
  "user.standard_time_work_study_6": { description: "Zaman Etüdü Analizörü: EfficiencyVariance = (StandardTime - ActualTime) * ActualProduction * HourlyRate", requiredInputs: [], outputHint: "number" },


// Total: 140 tools, 992 formulas
// Generated: 2026-06-20T23:39:17.597Z
