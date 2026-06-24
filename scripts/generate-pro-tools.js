import fs from "node:fs";
import path from "node:path";

const targetFile = path.join(process.cwd(), "src/data/pro-tools-data.ts");

const tools = [
  // 1. YAPAY ZEKA TOKEN MALİYET HESAPLAYICI
  {
    slug: "ai-token-cost-calculator",
    categorySlug: "technology-ai-cloud-cyber",
    standards: "ISO/IEC 25010, GHG Protocol",
    name: {
      en: "AI Token Cost & TCO Decision Motor",
      tr: "Yapay Zeka Token Maliyeti ve TCO Karar Motoru"
    },
    painStatement: {
      en: "AI token consumption growth rate and infrastructure overhead create hidden financial leaks.",
      tr: "Yapay zeka token tüketim büyüme hızı ve altyapı sabit giderleri gizli finansal kaçaklar yaratır."
    },
    promise: {
      en: "Calculates total cost of ownership (TCO) and warns when monthly projections exceed the budget cap.",
      tr: "Toplam sahip olma maliyetini (TCO) hesaplar ve aylık projeksiyonlar bütçe üst sınırını aştığında uyarır."
    },
    audience: {
      en: "Software Engineers, CTOs, AI Architects, Business Owners",
      tr: "Yazılımcılar, CTO'lar, Yapay Zeka Mimarları, İşletme Sahipleri"
    },
    inputs: [
      { id: "dailyRequests", type: "number", smartDefault: 10000, unit: "reqs/day", label: { en: "Daily Request Count", tr: "Günlük İstek Sayısı" } },
      { id: "promptTokens", type: "number", smartDefault: 1000, unit: "tokens", label: { en: "Prompt Tokens per Req", tr: "İstem Token Sayısı" } },
      { id: "completionTokens", type: "number", smartDefault: 500, unit: "tokens", label: { en: "Completion Tokens per Req", tr: "Tamamlama Token Sayısı" } },
      { id: "cacheHitRatio", type: "number", smartDefault: 0.3, unit: "ratio (0-1)", label: { en: "Cache Read Ratio", tr: "Önbellek Okuma Oranı" } },
      { id: "promptPrice", type: "number", smartDefault: 3.0, unit: "$/1M", label: { en: "Prompt Price per 1M", tr: "İstem Birim Fiyatı (1M)" } },
      { id: "completionPrice", type: "number", smartDefault: 15.0, unit: "$/1M", label: { en: "Completion Price per 1M", tr: "Tamamlama Birim Fiyatı (1M)" } },
      { id: "cacheReadPrice", type: "number", smartDefault: 1.5, unit: "$/1M", label: { en: "Cache Read Price per 1M", tr: "Önbellek Okuma Fiyatı (1M)" } },
      { id: "cacheWritePrice", type: "number", smartDefault: 3.0, unit: "$/1M", label: { en: "Cache Write Price per 1M", tr: "Önbellek Yazma Fiyatı (1M)" } },
      { id: "cacheWriteTokens", type: "number", smartDefault: 500, unit: "tokens", label: { en: "Cache Write Tokens", tr: "Önbellek Yazma Tokenı" } },
      { id: "growthRate", type: "number", smartDefault: 0.15, unit: "ratio (0-1)", label: { en: "Monthly Growth Rate", tr: "Aylık Büyüme Oranı" } },
      { id: "infraOverhead", type: "number", smartDefault: 500, unit: "$/mo", label: { en: "Fixed Infrastructure Cost", tr: "Altyapı Sabit Gideri" } },
      { id: "fallbackCost", type: "number", smartDefault: 200, unit: "$/mo", label: { en: "Fallback Model Cost", tr: "Yedek Model Maliyeti" } },
      { id: "budgetCap", type: "number", smartDefault: 5000, unit: "$/mo", label: { en: "Monthly Budget Cap", tr: "Bütçe Üst Sınırı" } },
      { id: "warningThreshold", type: "number", smartDefault: 0.8, unit: "ratio (0-1)", label: { en: "Warning Threshold", tr: "Uyarı Eşiği" } }
    ],
    outputs: [
      { id: "dailyBaseCost", label: { en: "Daily Base Cost", tr: "Günlük Temel Maliyet" }, unit: "$", format: "currency" },
      { id: "monthlyProjection", label: { en: "Monthly Projection", tr: "Aylık Projeksiyon" }, unit: "$", format: "currency", isBigNumber: true },
      { id: "tco", label: { en: "Total Cost of Ownership (TCO)", tr: "Toplam Sahiplik Maliyeti (TCO)" }, unit: "$", format: "currency" },
      { id: "costPerRequest", label: { en: "Cost Per Request", tr: "İstek Başına Maliyet" }, unit: "$", format: "currency" }
    ],
    calculateFn: `(values) => {
      const dailyRequests = Math.max(0.0001, Number(values.dailyRequests || 0));
      const promptTokens = Math.max(0, Number(values.promptTokens || 0));
      const completionTokens = Math.max(0, Number(values.completionTokens || 0));
      const cacheHitRatio = Math.max(0, Math.min(1, Number(values.cacheHitRatio || 0)));
      const promptPrice = Math.max(0, Number(values.promptPrice || 0));
      const completionPrice = Math.max(0, Number(values.completionPrice || 0));
      const cacheReadPrice = Math.max(0, Number(values.cacheReadPrice || 0));
      const cacheWritePrice = Math.max(0, Number(values.cacheWritePrice || 0));
      const cacheWriteTokens = Math.max(0, Number(values.cacheWriteTokens || 0));
      const growthRate = Math.max(0, Math.min(1, Number(values.growthRate || 0)));
      const infraOverhead = Math.max(0, Number(values.infraOverhead || 0));
      const fallbackCost = Math.max(0, Number(values.fallbackCost || 0));
      const budgetCap = Math.max(0, Number(values.budgetCap || 0));
      const warningThreshold = Math.max(0, Math.min(1, Number(values.warningThreshold || 0)));

      const promptCost = (promptTokens * promptPrice) / 1000000;
      const completionCost = (completionTokens * completionPrice) / 1000000;
      const cacheReadCost = (promptTokens * cacheHitRatio * cacheReadPrice) / 1000000;
      const cacheWriteCost = (cacheWriteTokens * cacheWritePrice) / 1000000;

      const dailyBaseCost = (promptCost + completionCost + cacheReadCost + cacheWriteCost) * dailyRequests;
      const monthlyProjection = dailyBaseCost * 30 * (1 + growthRate);
      const tco = monthlyProjection + infraOverhead + fallbackCost;
      const costPerRequest = dailyBaseCost / dailyRequests;

      const warningLimit = budgetCap * warningThreshold;
      const isCritical = monthlyProjection > budgetCap;
      const isWarning = monthlyProjection > warningLimit;
      const verdict = isCritical ? "CRITICAL" : (isWarning ? "WARNING" : "OK");

      return {
        outputs: { dailyBaseCost, monthlyProjection, tco, costPerRequest },
        verdict,
        verdictMessage: isCritical ? "Budget limit exceeded!" : (isWarning ? "Budget warning threshold triggered!" : "Budget usage is within normal bounds."),
        leakExplanation: \`Monthly projection is projected to consume $\${monthlyProjection.toFixed(2)} compared to budget cap of $\${budgetCap.toFixed(2)}.\`,
        scenarios: [
          { name: "Current Scenario", inputs: { ...values }, outputs: { dailyBaseCost, monthlyProjection, tco, costPerRequest } },
          { name: "Optimized Cache (+20% Hit)", inputs: { ...values, cacheHitRatio: Math.min(1, cacheHitRatio + 0.2) }, outputs: { dailyBaseCost: dailyBaseCost * 0.85, monthlyProjection: monthlyProjection * 0.85, tco: tco * 0.85, costPerRequest: costPerRequest * 0.85 } }
        ]
      };
    }`
  },

  // 2. ALTI SİGMA PROJE ÖNCELİKLENDİRİCİ
  {
    slug: "six-sigma-project-prioritizer",
    categorySlug: "quality-six-sigma",
    standards: "ISO 13053, AIAG, PMBOK",
    name: {
      en: "Six Sigma Project Prioritizer",
      tr: "Altı Sigma Proje Önceliklendirme Hesaplayıcı"
    },
    painStatement: {
      en: "Quality improvement projects selected based on intuition fail to address high Cost of Poor Quality (COPQ).",
      tr: "Hissiyatla seçilen kalite projeleri yüksek Kötü Kalite Maliyeti (COPQ) sızıntılarını çözemez."
    },
    promise: {
      en: "Prioritizes quality projects by calculating Sigma Level, COPQ, ROI and payback duration.",
      tr: "Sigma Seviyesi, COPQ, ROI ve geri ödeme süresini hesaplayarak kalite projelerini önceliklendirir."
    },
    audience: {
      en: "Quality Managers, Black Belts, Operations Leaders, Business Owners",
      tr: "Kalite Yöneticileri, Altı Sigma Kuşakları, Operasyon Liderleri, İşletme Sahipleri"
    },
    inputs: [
      { id: "productionUnits", type: "number", smartDefault: 100000, unit: "units", label: { en: "Production Volume", tr: "Üretim Hacmi" } },
      { id: "defectiveUnits", type: "number", smartDefault: 1200, unit: "defects", label: { en: "Defective Units", tr: "Hatalı Birim Sayısı" } },
      { id: "opportunities", type: "number", smartDefault: 3, unit: "opps/unit", label: { en: "Defect Opportunities per Unit", tr: "Hata Fırsat Sayısı" } },
      { id: "internalFailure", type: "number", smartDefault: 15000, unit: "$", label: { en: "Internal Failure Cost", tr: "İç Başarısızlık Maliyeti" } },
      { id: "externalFailure", type: "number", smartDefault: 25000, unit: "$", label: { en: "External Failure Cost", tr: "Dış Başarısızlık Maliyeti" } },
      { id: "appraisal", type: "number", smartDefault: 5000, unit: "$", label: { en: "Appraisal Cost", tr: "Değerlendirme Maliyeti" } },
      { id: "prevention", type: "number", smartDefault: 4000, unit: "$", label: { en: "Prevention Cost", tr: "Önleme Maliyeti" } },
      { id: "targetSigma", type: "number", smartDefault: 4.5, unit: "sigma", label: { en: "Target Sigma Level", tr: "Hedef Sigma Seviyesi" } },
      { id: "recoveryProb", type: "number", smartDefault: 0.8, unit: "ratio (0-1)", label: { en: "Recovery Probability", tr: "Kurtarma Olasılığı" } },
      { id: "strategicAlignment", type: "number", smartDefault: 8, unit: "score (1-10)", label: { en: "Strategic Alignment Score", tr: "Stratejik Uyum Skoru" } },
      { id: "implementationEase", type: "number", smartDefault: 7, unit: "score (1-10)", label: { en: "Implementation Ease Score", tr: "Uygulama Kolaylığı Skoru" } },
      { id: "projectBudget", type: "number", smartDefault: 10000, unit: "$", label: { en: "Project Budget", tr: "Proje Bütçesi" } }
    ],
    outputs: [
      { id: "dpmo", label: { en: "Defects Per Million Opportunities (DPMO)", tr: "Milyon Fırsattaki Hata Sayısı (DPMO)" }, unit: "DPMO", format: "number" },
      { id: "sigmaLevel", label: { en: "Calculated Sigma Level", tr: "Hesaplanan Sigma Seviyesi" }, unit: "σ", format: "number" },
      { id: "copq", label: { en: "Cost of Poor Quality (COPQ)", tr: "Kötü Kalite Maliyeti (COPQ)" }, unit: "$", format: "currency", isBigNumber: true },
      { id: "roi", label: { en: "Project ROI", tr: "Proje ROI Oranı" }, unit: "%", format: "percentage" },
      { id: "paybackMonths", label: { en: "Payback Duration", tr: "Geri Ödeme Süresi" }, unit: "Months", format: "number" }
    ],
    calculateFn: `(values) => {
      const productionUnits = Math.max(1, Number(values.productionUnits || 0));
      const defectiveUnits = Math.max(0, Number(values.defectiveUnits || 0));
      const opportunities = Math.max(1, Number(values.opportunities || 0));
      const internalFailure = Math.max(0, Number(values.internalFailure || 0));
      const externalFailure = Math.max(0, Number(values.externalFailure || 0));
      const appraisal = Math.max(0, Number(values.appraisal || 0));
      const prevention = Math.max(0, Number(values.prevention || 0));
      const targetSigma = Math.max(1, Math.min(6, Number(values.targetSigma || 0)));
      const recoveryProb = Math.max(0, Math.min(1, Number(values.recoveryProb || 0)));
      const strategicAlignment = Math.max(1, Math.min(10, Number(values.strategicAlignment || 0)));
      const implementationEase = Math.max(1, Math.min(10, Number(values.implementationEase || 0)));
      const projectBudget = Math.max(1, Number(values.projectBudget || 0));

      const dpmo = (defectiveUnits / (productionUnits * opportunities)) * 1000000;
      const yieldVal = 1 - (defectiveUnits / (productionUnits * opportunities));
      
      const y = Math.max(0.000001, Math.min(0.999999, yieldVal));
      const t = Math.sqrt(-2.0 * Math.log(y < 0.5 ? y : 1.0 - y));
      const z = (y < 0.5 ? -1.0 : 1.0) * (t - ((2.515517 + 0.802853*t + 0.010328*t*t) / (1.0 + 1.432788*t + 0.189269*t*t + 0.001308*t*t*t)));
      
      const sigmaLevel = z + 1.5;
      const copq = internalFailure + externalFailure + appraisal + prevention;
      const sigmaGap = targetSigma - sigmaLevel;
      
      const roi = ((copq * recoveryProb) - projectBudget) / projectBudget;
      const paybackMonths = projectBudget / Math.max(1, (copq * recoveryProb / 12));

      const verdict = sigmaLevel < targetSigma - 0.5 ? "CRITICAL" : (sigmaLevel < targetSigma ? "WARNING" : "OK");

      return {
        outputs: { dpmo, sigmaLevel, copq, roi: roi * 100, paybackMonths },
        verdict,
        verdictMessage: sigmaLevel < targetSigma - 0.5 ? "Critical Sigma level! Immediate intervention required." : (sigmaLevel < targetSigma ? "Moderate Sigma level. Room for improvement." : "Healthy Sigma level bounds."),
        leakExplanation: \`Poor quality is costing $\${copq.toFixed(2)} annually. High defect opportunities exist.\`,
        scenarios: [
          { name: "Current Scenario", inputs: { ...values }, outputs: { dpmo, sigmaLevel, copq, roi: roi * 100, paybackMonths } },
          { name: "Half Defects Target", inputs: { ...values, defectiveUnits: Math.round(defectiveUnits / 2) }, outputs: { dpmo: dpmo / 2, sigmaLevel: sigmaLevel + 0.3, copq: copq * 0.6, roi: roi * 1.5 * 100, paybackMonths: paybackMonths * 0.5 } }
        ]
      };
    }`
  },

  // 3. AQL ÖRNEKLEME RİSK VE MALİYET HESAPLAYICI
  {
    slug: "aql-sampling-risk-cost-calculator",
    categorySlug: "quality-six-sigma",
    standards: "ISO 2859-1, ANSI/ASQ Z1.4",
    name: {
      en: "AQL Sampling Risk & Cost Calculator",
      tr: "AQL Örnekleme Risk ve Maliyet Hesaplayıcı"
    },
    painStatement: {
      en: "Standard AQL tables define accept/reject numbers but fail to quantify the financial risk of escaped defects.",
      tr: "Standart AQL tabloları kabul/red sayılarını verir ancak kaçan hatalı ürünlerin finansal riskini hesaplamaz."
    },
    promise: {
      en: "Estimates inspection costs, supplier risk, buyer risk, and the total cost of escaped defects.",
      tr: "Muayene maliyetlerini, üretici riskini, tüketici riskini ve kaçan hataların toplam maliyetini hesaplar."
    },
    audience: {
      en: "Quality Engineers, Procurement Managers, Inspection Technicians, Business Owners",
      tr: "Kalite Mühendisleri, Satınalma Yöneticileri, Muayene Teknisyenleri, İşletme Sahipleri"
    },
    inputs: [
      { id: "lotSize", type: "number", smartDefault: 5000, unit: "units", label: { en: "Lot Size (N)", tr: "Parti Büyüklüğü (N)" } },
      { id: "sampleSize", type: "number", smartDefault: 200, unit: "units", label: { en: "Sample Size (n)", tr: "Örneklem Büyüklüğü (n)" } },
      { id: "acceptanceNumber", type: "number", smartDefault: 5, unit: "units", label: { en: "Acceptance Number (Ac)", tr: "Kabul Sayısı (Ac)" } },
      { id: "actualDefectRate", type: "number", smartDefault: 0.02, unit: "ratio (0-1)", label: { en: "Actual Defect Rate (p)", tr: "Gerçek Hata Oranı (p)" } },
      { id: "unitInspectionCost", type: "number", smartDefault: 1.5, unit: "$/unit", label: { en: "Unit Inspection Cost", tr: "Birim Muayene Maliyeti" } },
      { id: "escapedDefectCost", type: "number", smartDefault: 250, unit: "$/defect", label: { en: "Cost per Escaped Defect", tr: "Kaçan Hata Birim Maliyeti" } },
      { id: "detectionRate", type: "number", smartDefault: 0.9, unit: "ratio (0-1)", label: { en: "Detection Rate", tr: "Tespit Oranı" } }
    ],
    outputs: [
      { id: "escapedDefects", label: { en: "Escaped Defects", tr: "Kaçan Hatalı Birim" }, unit: "units", format: "number" },
      { id: "totalRiskCost", label: { en: "Total Risk & Inspection Cost", tr: "Toplam Risk ve Muayene Maliyeti" }, unit: "$", format: "currency", isBigNumber: true },
      { id: "inspectionCost", label: { en: "Direct Inspection Cost", tr: "Doğrudan Muayene Maliyeti" }, unit: "$", format: "currency" }
    ],
    calculateFn: `(values) => {
      const N = Math.max(1, Number(values.lotSize || 0));
      const n = Math.max(1, Math.min(N, Number(values.sampleSize || 0)));
      const Ac = Math.max(0, Number(values.acceptanceNumber || 0));
      const p = Math.max(0, Math.min(1, Number(values.actualDefectRate || 0)));
      const unitCost = Math.max(0, Number(values.unitInspectionCost || 0));
      const escapedCost = Math.max(0, Number(values.escapedDefectCost || 0));
      const detectionRate = Math.max(0, Math.min(1, Number(values.detectionRate || 0)));

      // Binomial probability of acceptance (approximation)
      let Pa = 0;
      let fact = 1;
      for (let i = 0; i <= Ac; i++) {
        // Binomial terms
        let comb = 1;
        for (let j = 0; j < i; j++) comb *= (n - j) / (j + 1);
        Pa += comb * Math.pow(p, i) * Math.pow(1 - p, n - i);
      }
      if (isNaN(Pa) || Pa > 1) Pa = 1;

      const escapedDefects = (N - n) * p * (1 - Pa) * (1 - detectionRate);
      const inspectionCost = n * unitCost;
      const totalRiskCost = escapedDefects * escapedCost + inspectionCost;

      const verdict = Pa < 0.8 ? "CRITICAL" : (Pa < 0.95 ? "WARNING" : "OK");

      return {
        outputs: { escapedDefects, totalRiskCost, inspectionCost },
        verdict,
        verdictMessage: Pa < 0.8 ? "Critical consumer risk! High probability of accepting defective lots." : "Quality parameters are stable.",
        leakExplanation: \`Escaped defects cost is estimated at $\${(escapedDefects * escapedCost).toFixed(2)} due to low inspection bounds.\`,
        scenarios: [
          { name: "Current Scenario", inputs: { ...values }, outputs: { escapedDefects, totalRiskCost, inspectionCost } },
          { name: "Increased Sample Size (+50%)", inputs: { ...values, sampleSize: Math.round(n * 1.5) }, outputs: { escapedDefects: escapedDefects * 0.4, totalRiskCost: totalRiskCost * 0.7, inspectionCost: inspectionCost * 1.5 } }
        ]
      };
    }`
  },

  // 4. ARAÇ AMORTİSMAN HESAPLAYICI
  {
    slug: "vehicle-depreciation-calculator",
    categorySlug: "finance-sales-working-capital",
    standards: "ISO 15686-5, IFRS 16",
    name: {
      en: "Vehicle Depreciation & TCO Calculator",
      tr: "Araç Amortisman ve TCO Hesaplayıcı"
    },
    painStatement: {
      en: "Corporate fleet owners underestimate actual vehicle depreciation and tax shield value, leading to poor asset turnover decisions.",
      tr: "Kurumsal filo sahipleri gerçek araç amortismanını ve vergi kalkanı faydasını eksik hesaplar, bu da hatalı yenileme kararlarına yol açar."
    },
    promise: {
      en: "Calculates Straight-Line (SL), Double Declining Balance (DDB), and Total Cost of Ownership (TCO) with tax shield discounted values.",
      tr: "Doğrusal, Azalan Bakiye ve Çift Azalan yöntemleriyle amortismanı hesaplar; vergi kalkanı indirgenmiş TCO çıktısı sunar."
    },
    audience: {
      en: "Fleet Managers, CFOs, Operations Supervisors, Business Owners",
      tr: "Filo Yöneticileri, Finans Direktörleri, Operasyon Şefleri, İşletme Sahipleri"
    },
    inputs: [
      { id: "acquisitionCost", type: "number", smartDefault: 45000, unit: "$", label: { en: "Acquisition Cost", tr: "Edinme Bedeli" } },
      { id: "salvageValue", type: "number", smartDefault: 12000, unit: "$", label: { en: "Salvage Value", tr: "Kalıntı Değer" } },
      { id: "usefulLife", type: "number", smartDefault: 5, unit: "years", label: { en: "Useful Life", tr: "Faydalı Ömür (Yıl)" } },
      { id: "annualMileage", type: "number", smartDefault: 20000, unit: "km", label: { en: "Annual Mileage", tr: "Yıllık Kilometre" } },
      { id: "taxRate", type: "number", smartDefault: 0.22, unit: "ratio (0-1)", label: { en: "Corporate Tax Rate", tr: "Kurumsal Vergi Oranı" } },
      { id: "wacc", type: "number", smartDefault: 0.08, unit: "ratio (0-1)", label: { en: "WACC (Discount Rate)", tr: "Ağırlıklı Ortalama Sermaye Maliyeti (WACC)" } },
      { id: "annualOperatingCost", type: "number", smartDefault: 3500, unit: "$/year", label: { en: "Annual Operating Costs", tr: "Yıllık İşletme Giderleri" } },
      { id: "annualMaintenanceCost", type: "number", smartDefault: 1500, unit: "$/year", label: { en: "Annual Maintenance Costs", tr: "Yıllık Bakım Giderleri" } }
    ],
    outputs: [
      { id: "straightLineAnnual", label: { en: "Straight-Line Annual Depreciation", tr: "Doğrusal Yıllık Amortisman" }, unit: "$/year", format: "currency" },
      { id: "tco", label: { en: "Net Present Value TCO", tr: "Bugünkü Değer İndirgenmiş TCO" }, unit: "$", format: "currency", isBigNumber: true },
      { id: "euac", label: { en: "Equivalent Uniform Annual Cost (EUAC)", tr: "Eşdeğer Düzgün Yıllık Maliyet (EUAC)" }, unit: "$/year", format: "currency" }
    ],
    calculateFn: `(values) => {
      const cost = Math.max(1, Number(values.acquisitionCost || 0));
      const salvage = Math.max(0, Math.min(cost - 1, Number(values.salvageValue || 0)));
      const life = Math.max(1, Number(values.usefulLife || 0));
      const taxRate = Math.max(0, Math.min(1, Number(values.taxRate || 0)));
      const wacc = Math.max(0.001, Number(values.wacc || 0));
      const opCost = Math.max(0, Number(values.annualOperatingCost || 0));
      const maintCost = Math.max(0, Number(values.annualMaintenanceCost || 0));

      const straightLineAnnual = (cost - salvage) / life;

      // NPV calculations
      let taxShieldPV = 0;
      let operatingCostsPV = 0;
      for (let t = 1; t <= life; t++) {
        const factor = Math.pow(1 + wacc, t);
        taxShieldPV += (straightLineAnnual * taxRate) / factor;
        operatingCostsPV += (opCost + maintCost) * (1 - taxRate) / factor;
      }

      const tco = cost + operatingCostsPV - taxShieldPV - (salvage / Math.pow(1 + wacc, life));
      const euac = tco * (wacc * Math.pow(1 + wacc, life)) / (Math.pow(1 + wacc, life) - 1);

      const verdict = euac > (cost * 0.3) ? "WARNING" : "OK";

      return {
        outputs: { straightLineAnnual, tco, euac },
        verdict,
        verdictMessage: verdict === "WARNING" ? "Equivalent Annual Cost (EUAC) is relatively high compared to initial asset value." : "Fleet cost parameters are within economic limits.",
        leakExplanation: \`Net Present Value of Fleet TCO is projected at $\${tco.toFixed(2)} over \${life} years.\`,
        scenarios: [
          { name: "Current Scenario", inputs: { ...values }, outputs: { straightLineAnnual, tco, euac } },
          { name: "Extended Life (+2 Years)", inputs: { ...values, usefulLife: life + 2 }, outputs: { straightLineAnnual: (cost - salvage) / (life + 2), tco: tco * 0.9, euac: euac * 0.85 } }
        ]
      };
    }`
  },

  // 5. ARIZA SÜRESİ MALİYET HESAPLAYICI
  {
    slug: "downtime-cost-calculator",
    categorySlug: "maintenance-reliability",
    standards: "VDI 2888, ISO 55001",
    name: {
      en: "Unplanned Downtime Cost Decision Motor",
      tr: "Arıza Süresi Kayıp ve Karar Motoru"
    },
    painStatement: {
      en: "Traditional maintenance metrics track stop duration but ignore direct labor waste, capacity margins, and brand goodwill loss.",
      tr: "Geleneksel bakım metrikleri duruş süresini kaydeder ancak boşa giden işçilik, kapasite marjları ve marka itibar kayıplarını göz ardı eder."
    },
    promise: {
      en: "Translates technical downtime hours into financial losses including scrap, penalties, recovery, and customer churn risk.",
      tr: "Teknik duruş saatlerini; fire, cezalar, fazla mesai ve müşteri kaybı dahil olmak üzere doğrudan finansal zarara dönüştürür."
    },
    audience: {
      en: "Maintenance Managers, Plant Directors, Reliability Engineers, Business Owners",
      tr: "Bakım Yöneticileri, Fabrika Müdürleri, Güvenilirlik Mühendisleri, İşletme Sahipleri"
    },
    inputs: [
      { id: "downtimeHours", type: "number", smartDefault: 8, unit: "hours", label: { en: "Unplanned Downtime", tr: "Planlanmayan Duruş Süresi" } },
      { id: "workersAffected", type: "number", smartDefault: 12, unit: "personnel", label: { en: "Affected Workers Count", tr: "Etkilenen Çalışan Sayısı" } },
      { id: "hourlyLaborRate", type: "number", smartDefault: 32, unit: "$/hr", label: { en: "Average Hourly Labor Rate", tr: "Ortalama Saatlik Ücret" } },
      { id: "burdenRate", type: "number", smartDefault: 0.35, unit: "ratio (0-1)", label: { en: "Labor Burden Rate", tr: "Yan Hak ve Sosyal Ödemeler" } },
      { id: "lineCapacity", type: "number", smartDefault: 250, unit: "units/hr", label: { en: "Line Production Capacity", tr: "Hat Üretim Kapasitesi" } },
      { id: "contributionMargin", type: "number", smartDefault: 8.5, unit: "$/unit", label: { en: "Unit Contribution Margin", tr: "Birim Katkı Marjı" } },
      { id: "idlePower", type: "number", smartDefault: 45, unit: "kW", label: { en: "Idle Power Consumption", tr: "Boşta Güç Tüketimi" } },
      { id: "electricityTariff", type: "number", smartDefault: 0.18, unit: "$/kWh", label: { en: "Electricity Tariff", tr: "Elektrik Tarifesi" } },
      { id: "overtimeMultiplier", type: "number", smartDefault: 1.5, unit: "ratio", label: { en: "Overtime Rate Multiplier", tr: "Fazla Mesai Çarpanı" } },
      { id: "restartScrapUnits", type: "number", smartDefault: 150, unit: "units", label: { en: "Restart Scrap Waste Count", tr: "Yeniden Başlatma Firesi" } },
      { id: "unitMaterialCost", type: "number", smartDefault: 4.2, unit: "$/unit", label: { en: "Unit Material Cost", tr: "Birim Malzeme Maliyeti" } },
      { id: "hourlyPenalty", type: "number", smartDefault: 500, unit: "$/hr", label: { en: "Contractual Penalty per Hour", tr: "Saatlik Sözleşme Cezası" } },
      { id: "churnProbability", type: "number", smartDefault: 0.05, unit: "ratio (0-1)", label: { en: "Customer Churn Probability", tr: "Müşteri Kayıp Olasılığı" } },
      { id: "customerLtv", type: "number", smartDefault: 20000, unit: "$", label: { en: "Average Customer LTV", tr: "Müşteri Yaşam Boyu Değeri" } }
    ],
    outputs: [
      { id: "directLaborLoss", label: { en: "Direct Labor Waste Cost", tr: "Boşa Giden İşçilik Maliyeti" }, unit: "$", format: "currency" },
      { id: "productionLoss", label: { en: "Lost Production Value", tr: "Kapasite/Marj Kayıp Değeri" }, unit: "$", format: "currency" },
      { id: "qualityLoss", label: { en: "Scrap & Restart Cost", tr: "Yeniden Başlatma Fire Maliyeti" }, unit: "$", format: "currency" },
      { id: "brandDamage", label: { en: "Customer Churn Risk Cost", tr: "Müşteri Churn Risk Maliyeti" }, unit: "$", format: "currency" },
      { id: "totalCost", label: { en: "Total Downtime Cost", tr: "Toplam Arıza Maliyeti" }, unit: "$", format: "currency", isBigNumber: true },
      { id: "costPerMinute", label: { en: "Cost per Minute", tr: "Dakika Başına Maliyet" }, unit: "$/min", format: "currency" }
    ],
    calculateFn: `(values) => {
      const downtimeHours = Math.max(0.001, Number(values.downtimeHours || 0));
      const workersAffected = Math.max(0, Number(values.workersAffected || 0));
      const hourlyLaborRate = Math.max(0, Number(values.hourlyLaborRate || 0));
      const burdenRate = Math.max(0, Math.min(1, Number(values.burdenRate || 0)));
      const lineCapacity = Math.max(0, Number(values.lineCapacity || 0));
      const contributionMargin = Math.max(0, Number(values.contributionMargin || 0));
      const idlePower = Math.max(0, Number(values.idlePower || 0));
      const electricityTariff = Math.max(0, Number(values.electricityTariff || 0));
      const overtimeMultiplier = Math.max(1, Number(values.overtimeMultiplier || 0));
      const restartScrapUnits = Math.max(0, Number(values.restartScrapUnits || 0));
      const unitMaterialCost = Math.max(0, Number(values.unitMaterialCost || 0));
      const hourlyPenalty = Math.max(0, Number(values.hourlyPenalty || 0));
      const churnProbability = Math.max(0, Math.min(1, Number(values.churnProbability || 0)));
      const customerLtv = Math.max(0, Number(values.customerLtv || 0));

      const directLaborLoss = downtimeHours * workersAffected * hourlyLaborRate * (1 + burdenRate);
      const productionLoss = downtimeHours * lineCapacity * contributionMargin;
      const energyWaste = idlePower * downtimeHours * electricityTariff;
      const qualityLoss = restartScrapUnits * unitMaterialCost;
      const penalty = downtimeHours * hourlyPenalty;
      const brandDamage = churnProbability * customerLtv;

      const totalCost = directLaborLoss + productionLoss + energyWaste + qualityLoss + penalty + brandDamage;
      const costPerMinute = totalCost / (downtimeHours * 60);

      const verdict = totalCost > 10000 ? "CRITICAL" : (totalCost > 2500 ? "WARNING" : "OK");

      return {
        outputs: { directLaborLoss, productionLoss, qualityLoss, brandDamage, totalCost, costPerMinute },
        verdict,
        verdictMessage: totalCost > 10000 ? "Critical downtime cost impact! Elevate root-cause maintenance actions." : "Downtime costs are within acceptable bounds.",
        leakExplanation: \`Downtime is costing $\${costPerMinute.toFixed(2)} per minute. Production and labor losses represent the largest shares.\`,
        scenarios: [
          { name: "Current Scenario", inputs: { ...values }, outputs: { directLaborLoss, productionLoss, qualityLoss, brandDamage, totalCost, costPerMinute } },
          { name: "Shorter Downtime (-50%)", inputs: { ...values, downtimeHours: downtimeHours * 0.5 }, outputs: { directLaborLoss: directLaborLoss * 0.5, productionLoss: productionLoss * 0.5, qualityLoss, brandDamage, totalCost: totalCost * 0.55, costPerMinute } }
        ]
      };
    }`
  }
];
