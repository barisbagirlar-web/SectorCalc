/**
 * Tool-specific methodology overrides for premium print reports.
 * Default: generic manufacturing template (shared locale keys).
 * Per-tool override: CLV/CAC calculator (all 6 locales).
 */

export type ToolMethodology = {
  subtitle: string;
  formulaDisplay: string;
  formulaDesc: string;
  methodologyTitle: string;
  methodologyBody: string;
  standardRef: string;
  findings: Array<{ title: string; body: string; severity: "warning" | "info" | "danger" | "success" }>;
  trustStandardDesc: string;
  trustBoundaryDesc: string;
};

function isClvCacSlug(slug: string): boolean {
  return /^(clv-cac-calculator|clv-cac|cac-clv|customer-lifetime|cac-ratio|ltv-cac|clv-calculator)$/.test(slug);
}

const clvCacI18n: Record<string, ToolMethodology> = {
  en: {
    subtitle: "CLV/CAC Ratio Analysis — Customer profitability and acquisition efficiency",
    formulaDisplay: "CLV = (AOV × PF) × GM% × Lifetime",
    formulaDesc: "Customer Lifetime Value Model — SectorCalc Engine",
    methodologyTitle: "Calculation Methodology",
    methodologyBody:
      "The model calculates Customer Lifetime Value (CLV) using: Average Order Value (AOV), annual purchase frequency, gross margin percentage, and customer lifetime years. CLV/CAC ratio is CLV divided by Customer Acquisition Cost. Churn rate is derived as 100% − retention rate. Payback period: CAC divided by monthly gross profit. Healthy benchmark: CLV/CAC > 3:1.",
    standardRef: "Financial Accounting Standards",
    findings: [
      { title: "Low CLV/CAC Ratio", body: "CLV/CAC ratio below 3:1 indicates potential marketing spend inefficiency. Focus on reducing CAC or improving retention.", severity: "warning" },
      { title: "CAC Payback Period Review", body: "If CAC payback period exceeds 12 months, cash flow may be strained. Improve retention or lower acquisition costs.", severity: "info" },
    ],
    trustStandardDesc: "CLV and CLV/CAC ratio calculations follow accepted financial metrics. Assumptions are documented.",
    trustBoundaryDesc: "Valid under constant revenue model and steady retention rate assumptions. Does not include indirect value (referrals, brand equity).",
  },
  tr: {
    subtitle: "CLV/CAC Oranı Analizi — Müşteri kârlılığı ve edinme verimliliği",
    formulaDisplay: "CLV = (AOV × SF) × BM% × Ömür",
    formulaDesc: "Müşteri Yaşam Boyu Değer Modeli — SectorCalc Motoru",
    methodologyTitle: "Hesaplama Metodolojisi",
    methodologyBody:
      "Model, Müşteri Yaşam Boyu Değerini (CLV) şu girdilerle hesaplar: Ortalama Sipariş Değeri (AOV), yıllık satın alma sıklığı, brüt kar marjı yüzdesi ve müşteri ömrü (yıl). CLV/CAC oranı, CLV'nin Müşteri Edinme Maliyetine (CAC) bölünmesiyle elde edilir. Kayıp oranı: %100 − elde tutma oranı. Geri ödeme süresi: CAC / aylık brüt kar. Sağlıklı referans: CLV/CAC > 3:1.",
    standardRef: "Finansal Muhasebe Standartları",
    findings: [
      { title: "Düşük CLV/CAC Oranı", body: "CLV/CAC oranının 3:1'in altında olması pazarlama harcama verimsizliğine işaret edebilir. CAC'yi düşürmeye veya elde tutmayı artırmaya odaklanın.", severity: "warning" },
      { title: "CAC Geri Ödeme Süresi İncelemesi", body: "CAC geri ödeme süresi 12 ayı aşarsa nakit akışı zorlanabilir. Elde tutmayı iyileştirin veya edinme maliyetlerini düşürün.", severity: "info" },
    ],
    trustStandardDesc: "CLV ve CLV/CAC oranı hesaplamaları kabul görmüş finansal metrikleri takip eder. Varsayımlar belgelenmiştir.",
    trustBoundaryDesc: "Sabit gelir modeli ve istikrarlı elde tutma oranı varsayımları altında geçerlidir. Dolaylı değeri (yönlendirmeler, marka değeri) kapsamaz.",
  },
  de: {
    subtitle: "CLV/CAC-Verhältnisanalyse — Kundenrentabilität und Akquisitionseffizienz",
    formulaDisplay: "CLV = (AOV × KF) × BM% × Lebensdauer",
    formulaDesc: "Kundenlebenszeitwert-Modell — SectorCalc Engine",
    methodologyTitle: "Berechnungsmethodik",
    methodologyBody:
      "Das Modell berechnet den Customer Lifetime Value (CLV) anhand von: Durchschnittlichem Bestellwert (AOV), jährlicher Kaufhäufigkeit, Bruttomarge und Kundenlebensdauer in Jahren. Das CLV/CAC-Verhältnis ist der CLV geteilt durch die Kundenakquisitionskosten (CAC). Die Abwanderungsrate ergibt sich aus: 100 % − Bindungsrate. Amortisationszeit: CAC geteilt durch monatlichen Bruttogewinn. Gesundes Benchmark: CLV/CAC > 3:1.",
    standardRef: "Rechnungslegungsstandards",
    findings: [
      { title: "Niedriges CLV/CAC-Verhältnis", body: "Ein CLV/CAC-Verhältnis unter 3:1 deutet auf mögliche Ineffizienz der Marketingausgaben hin. Konzentrieren Sie sich auf die Senkung der CAC oder die Verbesserung der Kundenbindung.", severity: "warning" },
      { title: "CAC-Amortisationszeit Prüfung", body: "Übersteigt die CAC-Amortisationszeit 12 Monate, kann der Cashflow belastet werden. Verbessern Sie die Bindung oder senken Sie die Akquisitionskosten.", severity: "info" },
    ],
    trustStandardDesc: "CLV- und CLV/CAC-Verhältnisberechnungen folgen anerkannten Finanzkennzahlen. Annahmen sind dokumentiert.",
    trustBoundaryDesc: "Gültig unter Annahme konstanter Einnahmen und stabiler Bindungsrate. Beinhaltet keinen indirekten Wert (Empfehlungen, Markenwert).",
  },
  fr: {
    subtitle: "Analyse du Ratio CLV/CAC — Rentabilité client et efficacité d'acquisition",
    formulaDisplay: "CLV = (AOV × FA) × MB% × Durée",
    formulaDesc: "Modèle de Valeur Vie Client — Moteur SectorCalc",
    methodologyTitle: "Méthodologie de Calcul",
    methodologyBody:
      "Le modèle calcule la Valeur Vie Client (CLV) en utilisant : la Valeur Moyenne des Commandes (AOV), la fréquence d'achat annuelle, le pourcentage de marge brute et la durée de vie client en années. Le ratio CLV/CAC est la CLV divisée par le Coût d'Acquisition Client (CAC). Le taux d'attrition est dérivé : 100 % − taux de rétention. Période de récupération : CAC divisé par la marge brute mensuelle. Référence saine : CLV/CAC > 3:1.",
    standardRef: "Normes Comptables Financières",
    findings: [
      { title: "Ratio CLV/CAC Faible", body: "Un ratio CLV/CAC inférieur à 3:1 indique une inefficacité potentielle des dépenses marketing. Concentrez-vous sur la réduction du CAC ou l'amélioration de la rétention.", severity: "warning" },
      { title: "Examen de la Période de Récupération CAC", body: "Si la période de récupération du CAC dépasse 12 mois, les flux de trésorerie peuvent être sous pression. Améliorez la rétention ou réduisez les coûts d'acquisition.", severity: "info" },
    ],
    trustStandardDesc: "Les calculs de CLV et du ratio CLV/CAC suivent des métriques financières reconnues. Les hypothèses sont documentées.",
    trustBoundaryDesc: "Valable sous hypothèses de modèle de revenus constants et de taux de rétention stable. N'inclut pas la valeur indirecte (références, marque).",
  },
  es: {
    subtitle: "Análisis de Relación CLV/CAC — Rentabilidad del cliente y eficiencia de adquisición",
    formulaDisplay: "CLV = (AOV × FC) × MB% × Vida",
    formulaDesc: "Modelo de Valor de Vida del Cliente — Motor SectorCalc",
    methodologyTitle: "Metodología de Cálculo",
    methodologyBody:
      "El modelo calcula el Valor de Vida del Cliente (CLV) utilizando: Valor Promedio del Pedido (AOV), frecuencia de compra anual, porcentaje de margen bruto y años de vida del cliente. La relación CLV/CAC es el CLV dividido por el Costo de Adquisición de Clientes (CAC). La tasa de abandono se deriva: 100% − tasa de retención. Período de recuperación: CAC dividido por la ganancia bruta mensual. Referencia saludable: CLV/CAC > 3:1.",
    standardRef: "Normas de Contabilidad Financiera",
    findings: [
      { title: "Relación CLV/CAC Baja", body: "Una relación CLV/CAC inferior a 3:1 indica posible ineficiencia en el gasto de marketing. Concéntrese en reducir el CAC o mejorar la retención.", severity: "warning" },
      { title: "Revisión del Período de Recuperación CAC", body: "Si el período de recuperación del CAC supera los 12 meses, el flujo de caja puede verse afectado. Mejore la retención o reduzca los costos de adquisición.", severity: "info" },
    ],
    trustStandardDesc: "Los cálculos de CLV y relación CLV/CAC siguen métricas financieras aceptadas. Los supuestos están documentados.",
    trustBoundaryDesc: "Válido bajo supuestos de modelo de ingresos constantes y tasa de retención estable. No incluye valor indirecto (referencias, marca).",
  },
  ar: {
    subtitle: "تحليل نسبة CLV/CAC — ربحية العملاء وكفاءة الاكتساب",
    formulaDisplay: "CLV = (متوسط قيمة الطلب × تكرار الشراء) × هامش الربح × عمر العميل",
    formulaDesc: "نموذج القيمة الدائمة للعميل — محرك SectorCalc",
    methodologyTitle: "منهجية الحساب",
    methodologyBody:
      "يحسب النموذج القيمة الدائمة للعميل (CLV) باستخدام: متوسط قيمة الطلب، تكرار الشراء السنوي، هامش الربح الإجمالي، وعمر العميل. تُحسب نسبة CLV/CAC بقسمة CLV على تكلفة اكتساب العميل (CAC). يُحسب معدل التوقف بالعلاقة: 100% - معدل الاحتفاظ. فترة الاسترداد: CAC مقسومة على الربح الإجمالي الشهري. المعيار الصحي: CLV/CAC > 3.",
    standardRef: "معايير المحاسبة المالية",
    findings: [
      { title: "نسبة CLV/CAC منخفضة", body: "نسبة CLV/CAC أقل من 3:1 تشير إلى عدم كفاءة محتملة في الإنفاق التسويقي. التركيز على تقليل CAC أو زيادة الاحتفاظ بالعملاء.", severity: "warning" },
      { title: "فترة استرداد CAC", body: "إذا تجاوزت فترة استرداد CAC 12 شهرًا، قد يكون التدفق النقدي تحت الضغط. تحسين الاحتفاظ أو تقليل تكاليف الاكتساب موصى به.", severity: "info" },
    ],
    trustStandardDesc: "حسابات القيمة الدائمة للعميل ونسبة CLV/CAC وفقًا للمعايير المقبولة. تم تدوين الافتراضات.",
    trustBoundaryDesc: "صالح تحت افتراضات نموذج الإيرادات الثابت ومعدل الاحتفاظ الثابت. لا يشمل القيمة غير المباشرة (الإحالات، العلامة التجارية).",
  },
};

export function getToolMethodology(slug: string, locale: string): ToolMethodology | null {
  if (!isClvCacSlug(slug)) return null;
  return clvCacI18n[locale] ?? clvCacI18n.en;
}
