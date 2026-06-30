/* eslint-disable */
// @ts-nocheck

import type { AppLocale } from "@/i18n/routing";

/**
 * Locale-aware overrides for revenue tool titles.
 *
 * The canonical revenue-tools registry stores English titles. This module
 * layers natural Turkish (and future locale) names on top, keyed by the
 * tool's free or paid slug. When an override is missing the registry's
 * English title is returned, so adding a locale is purely additive.
 */

type ToolKind = "free" | "paid";

const TR_PAID_TITLES: Record<string, string> = {
  "cnc-quote-risk-analyzer": "CNC Teklif Riski Analizi",
  "change-order-impact-analyzer": "İş Değişikliği Etki Analizi",
  "office-cleaning-bid-optimizer": "Ofis Temizliği Teklif Optimizasyonu",
  "menu-profit-leak-detector": "Menü Kâr Kaçağı Analizi",
  "return-profit-erosion-tool": "İade Kaynaklı Kâr Erozyonu Analizi",
  "welding-bid-risk-analyzer": "Kaynak Teklifi Risk Analizi",
  "hvac-project-margin-guard": "HVAC Proje Kârlılık Kontrolü",
  "panel-shop-margin-verdict": "Pano İmalatı Kârlılık Değerlendirmesi",
  "landscaping-contract-profit-tool": "Peyzaj Sözleşmesi Kâr Analizi",
  "auto-shop-margin-leak-detector": "Oto Servis Kâr Kaçağı Analizi",
  "signage-bid-safe-price-tool": "Tabela Teklifi Güvenli Fiyat Analizi",
  "plumbing-job-margin-verdict": "Tesisat İşi Kâr Marjı Değerlendirmesi",
  "millwork-bid-risk-analyzer": "Ahşap İmalat Teklif Riski Analizi",
  "roofing-contract-margin-guard": "Çatı İşi Sözleşme Kârlılık Kontrolü",
  "painting-job-profit-verdict": "Boya İşi Kâr Değerlendirmesi",
  "sheet-metal-quote-risk-tool": "Sac Metal Teklif Riski Analizi",
  "3d-print-job-margin-tool": "3D Baskı İşi Kâr Marjı Analizi",
  "route-optimization-analyzer": "Rota ve Yük Kayıp Analizi",
  "crop-yield-loss-analyzer": "Ürün Verim Kaybı Analizi",
  "water-optimization-verdict": "Su Verimliliği Değerlendirmesi",
  "feed-efficiency-analyzer": "Yem Verimliliği Analizi",
  "dairy-profit-detector": "Süt Üretimi Kâr Kaçağı Analizi",
  "energy-efficiency-report": "Enerji Verimliliği Raporu",
  "cbam-compliance-verdict": "CBAM Uyum Değerlendirmesi",
  "renovation-budget-optimizer": "Tadilat Bütçesi Optimizasyonu",
  "trip-budget-optimizer": "Yolculuk Bütçesi Optimizasyonu",
  "meal-planning-verdict": "Haftalık Yemek Planlama Değerlendirmesi",
};

const TR_FREE_TITLES: Record<string, string> = {
  "machine-time-calculator": "Makine Süresi Hesaplama Aracı",
  "project-cost-calculator": "Proje Maliyeti Hesaplama Aracı",
  "cleaning-cost-calculator": "Temizlik Maliyeti Hesaplama Aracı",
  "food-cost-calculator": "Gıda Maliyeti Hesaplama Aracı",
  "product-margin-calculator": "Ürün Marjı Hesaplama Aracı",
  "welding-cost-estimator": "Kaynak Maliyeti Tahmin Aracı",
  "hvac-tonnage-rule-check": "HVAC Tonaj Kontrolü",
  "electrical-labor-estimator": "Elektrik İşçilik Tahmin Aracı",
  "lawn-care-cost-check": "Bahçe Bakımı Maliyet Kontrolü",
  "repair-time-vs-price-check": "Servis Süresi ve Fiyat Karşılaştırması",
  "print-job-cost-check": "Baskı İşi Maliyet Kontrolü",
  "plumbing-fixture-cost-check": "Tesisat Armatür Maliyet Kontrolü",
  "cabinet-cost-estimator": "Mobilya Maliyeti Tahmin Aracı",
  "roofing-square-cost-check": "Çatı Metrekare Maliyet Kontrolü",
  "paint-coverage-cost-check": "Boya Kapsam Maliyet Kontrolü",
  "laser-cutting-time-check": "Lazer Kesim Süresi Kontrolü",
  "3d-print-cost-check": "3D Baskı Maliyet Kontrolü",
  "desi-calculator": "Desi ve Hacimsel Ağırlık Hesaplama Aracı",
  "fertilizer-dosage-calculator": "Gübre Dozaj Hesaplama Aracı",
  "irrigation-cost-check": "Sulama Maliyet Kontrolü",
  "feed-cost-estimator": "Yem Maliyeti Tahmin Aracı",
  "milk-yield-check": "Süt Verimi Kontrolü",
  "kwh-consumption-check": "kWh Tüketim Kontrolü",
  "carbon-footprint-quick": "Hızlı Karbon Ayak İzi Tahmini",
  "home-renovation-m2": "Tadilat m² Maliyet Hesaplama Aracı",
  "fuel-consumption-check": "Yakıt Tüketim Kontrolü",
  "recipe-cost-check": "Tarif Maliyeti Kontrolü",
};

const DE_PAID_TITLES: Record<string, string> = {
  "cnc-quote-risk-analyzer": "CNC-Angebotsrisikoanalyse",
  "change-order-impact-analyzer": "Änderungsauftrag-Folgenanalyse",
  "office-cleaning-bid-optimizer": "Büroreinigung-Angebotsoptimierung",
  "menu-profit-leak-detector": "Menü-Gewinnverlustdetektor",
  "return-profit-erosion-tool": "Retourenbedingte Gewinnerosion",
  "welding-bid-risk-analyzer": "Schweißangebot-Risikoanalyse",
  "hvac-project-margin-guard": "HLK-Projektmargenschutz",
  "panel-shop-margin-verdict": "Schaltschrankbau-Margenbewertung",
  "landscaping-contract-profit-tool": "Landschaftsbau-Vertragsgewinnanalyse",
  "auto-shop-margin-leak-detector": "Kfz-Werkstatt-Margenverlustdetektor",
  "signage-bid-safe-price-tool": "Beschilderung-Sicherer-Preis-Rechner",
  "plumbing-job-margin-verdict": "Sanitär-Margenbewertung",
  "millwork-bid-risk-analyzer": "Schreinerei-Angebotsrisikoanalyse",
  "roofing-contract-margin-guard": "Dachdecker-Vertragsmargenschutz",
  "painting-job-profit-verdict": "Malerarbeiten-Gewinnbewertung",
  "sheet-metal-quote-risk-tool": "Blechbearbeitung-Angebotsrisiko",
  "3d-print-job-margin-tool": "3D-Druck-Auftragsmargenrechner",
  "route-optimization-analyzer": "Routen- und Frachtverlustanalyse",
  "crop-yield-loss-analyzer": "Ernteverlustanalyse",
  "water-optimization-verdict": "Wassereffizienzbewertung",
  "feed-efficiency-analyzer": "Futtereffizienzanalyse",
  "dairy-profit-detector": "Milchproduktion-Gewinndetektor",
  "energy-efficiency-report": "Energieeffizienzbericht",
  "cbam-compliance-verdict": "CBAM-Konformitätsbewertung",
  "renovation-budget-optimizer": "Renovierungsbudget-Optimierung",
  "trip-budget-optimizer": "Reisebudget-Optimierung",
  "meal-planning-verdict": "Wöchentliche Essensplanung",
};

const DE_FREE_TITLES: Record<string, string> = {
  "machine-time-calculator": "Maschinenzeitrechner",
  "project-cost-calculator": "Projektkostenrechner",
  "cleaning-cost-calculator": "Reinigungskostenrechner",
  "food-cost-calculator": "Lebensmittelkostenrechner",
  "product-margin-calculator": "Produktmargenrechner",
  "welding-cost-estimator": "Schweißkostenschätzer",
  "hvac-tonnage-rule-check": "HLK-Tonnage-Prüfung",
  "electrical-labor-estimator": "Elektro-Arbeitskostenschätzer",
  "lawn-care-cost-check": "Gartenpflegekosten-Prüfung",
  "repair-time-vs-price-check": "Reparaturzeit-Preis-Vergleich",
  "print-job-cost-check": "Druckauftragskosten-Prüfung",
  "plumbing-fixture-cost-check": "Sanitärarmaturen-Kostenprüfung",
  "cabinet-cost-estimator": "Schrankkostenschätzer",
  "roofing-square-cost-check": "Dachkosten-Quadratmeter-Prüfung",
  "paint-coverage-cost-check": "Farbdeckungskosten-Prüfung",
  "laser-cutting-time-check": "Laserschneidzeit-Prüfung",
  "3d-print-cost-check": "3D-Druckkosten-Prüfung",
  "desi-calculator": "Desi- und Volumengewichtsrechner",
  "fertilizer-dosage-calculator": "Düngerdosierungsrechner",
  "irrigation-cost-check": "Bewässerungskosten-Prüfung",
  "feed-cost-estimator": "Futterkostenschätzer",
  "milk-yield-check": "Milchertrags-Prüfung",
  "kwh-consumption-check": "kWh-Verbrauchs-Prüfung",
  "carbon-footprint-quick": "Schneller CO₂-Fußabdruck",
  "home-renovation-m2": "Haussanierung m²-Kostenrechner",
  "fuel-consumption-check": "Kraftstoffverbrauchs-Prüfung",
  "recipe-cost-check": "Rezeptkosten-Prüfung",
};

const FR_PAID_TITLES: Record<string, string> = {
  "cnc-quote-risk-analyzer": "Analyse de Risque d'Offre CNC",
  "change-order-impact-analyzer": "Analyse d'Impact des Avenants",
  "office-cleaning-bid-optimizer": "Optimisation d'Offre de Nettoyage",
  "menu-profit-leak-detector": "Détecteur de Fuite de Marge des Menus",
  "return-profit-erosion-tool": "Analyse d'Érosion des Bénéfices par Retours",
  "welding-bid-risk-analyzer": "Analyse de Risque d'Offre de Soudure",
  "hvac-project-margin-guard": "Protection de Marge de Projet CVC",
  "panel-shop-margin-verdict": "Évaluation de Marge d'Armoire Électrique",
  "landscaping-contract-profit-tool": "Analyse de Profit de Contrat Paysager",
  "auto-shop-margin-leak-detector": "Détecteur de Fuite de Marge Garage",
  "signage-bid-safe-price-tool": "Prix Sécurisé d'Offre d'Enseigne",
  "plumbing-job-margin-verdict": "Évaluation de Marge de Travaux de Plomberie",
  "millwork-bid-risk-analyzer": "Analyse de Risque d'Offre de Menuiserie",
  "roofing-contract-margin-guard": "Protection de Marge de Contrat de Toiture",
  "painting-job-profit-verdict": "Évaluation de Profit de Travaux de Peinture",
  "sheet-metal-quote-risk-tool": "Outil de Risque d'Offre de Tôlerie",
  "3d-print-job-margin-tool": "Outil de Marge d'Impression 3D",
  "route-optimization-analyzer": "Analyse de Perte de Route et Fret",
  "crop-yield-loss-analyzer": "Analyse de Perte de Rendement Agricole",
  "water-optimization-verdict": "Évaluation d'Efficacité d'Eau",
  "feed-efficiency-analyzer": "Analyse d'Efficacité Alimentaire",
  "dairy-profit-detector": "Détecteur de Profit de Production Laitière",
  "energy-efficiency-report": "Rapport d'Efficacité Énergétique",
  "cbam-compliance-verdict": "Évaluation de Conformité CBAM",
  "renovation-budget-optimizer": "Optimisation de Budget de Rénovation",
  "trip-budget-optimizer": "Optimisation de Budget de Voyage",
  "meal-planning-verdict": "Planification Hebdomadaire des Repas",
};

const FR_FREE_TITLES: Record<string, string> = {
  "machine-time-calculator": "Calculateur de Temps Machine",
  "project-cost-calculator": "Calculateur de Coût de Projet",
  "cleaning-cost-calculator": "Calculateur de Coût de Nettoyage",
  "food-cost-calculator": "Calculateur de Coût Alimentaire",
  "product-margin-calculator": "Calculateur de Marge Produit",
  "welding-cost-estimator": "Estimateur de Coût de Soudure",
  "hvac-tonnage-rule-check": "Contrôle de Tonnage CVC",
  "electrical-labor-estimator": "Estimateur de Main-d'Œuvre Électrique",
  "lawn-care-cost-check": "Contrôle de Coût d'Entretien de Jardin",
  "repair-time-vs-price-check": "Comparaison Temps de Réparation vs Prix",
  "print-job-cost-check": "Contrôle de Coût d'Impression",
  "plumbing-fixture-cost-check": "Contrôle de Coût d'Équipement Sanitaire",
  "cabinet-cost-estimator": "Estimateur de Coût d'Armoire",
  "roofing-square-cost-check": "Contrôle de Coût au m² de Toiture",
  "paint-coverage-cost-check": "Contrôle de Coût de Couverture de Peinture",
  "laser-cutting-time-check": "Contrôle de Temps de Découpe Laser",
  "3d-print-cost-check": "Contrôle de Coût d'Impression 3D",
  "desi-calculator": "Calculateur Desi et Poids Volumétrique",
  "fertilizer-dosage-calculator": "Calculateur de Dosage d'Engrais",
  "irrigation-cost-check": "Contrôle de Coût d'Irrigation",
  "feed-cost-estimator": "Estimateur de Coût Alimentaire Bétail",
  "milk-yield-check": "Contrôle de Rendement Laitier",
  "kwh-consumption-check": "Contrôle de Consommation kWh",
  "carbon-footprint-quick": "Empreinte Carbone Rapide",
  "home-renovation-m2": "Calculateur de Coût m² de Rénovation",
  "fuel-consumption-check": "Contrôle de Consommation de Carburant",
  "recipe-cost-check": "Contrôle de Coût de Recette",
};

const ES_PAID_TITLES: Record<string, string> = {
  "cnc-quote-risk-analyzer": "Análisis de Riesgo de Cotización CNC",
  "change-order-impact-analyzer": "Análisis de Impacto de Órdenes de Cambio",
  "office-cleaning-bid-optimizer": "Optimización de Oferta de Limpieza",
  "menu-profit-leak-detector": "Detector de Fuga de Ganancia en Menú",
  "return-profit-erosion-tool": "Análisis de Erosión de Ganancia por Devoluciones",
  "welding-bid-risk-analyzer": "Análisis de Riesgo de Oferta de Soldadura",
  "hvac-project-margin-guard": "Control de Margen de Proyecto HVAC",
  "panel-shop-margin-verdict": "Evaluación de Margen de Tablero Eléctrico",
  "landscaping-contract-profit-tool": "Análisis de Ganancia de Contrato de Jardinería",
  "auto-shop-margin-leak-detector": "Detector de Fuga de Margen de Taller",
  "signage-bid-safe-price-tool": "Precio Seguro de Oferta de Rotulación",
  "plumbing-job-margin-verdict": "Evaluación de Margen de Trabajo de Fontanería",
  "millwork-bid-risk-analyzer": "Análisis de Riesgo de Oferta de Carpintería",
  "roofing-contract-margin-guard": "Control de Margen de Contrato de Techado",
  "painting-job-profit-verdict": "Evaluación de Ganancia de Trabajo de Pintura",
  "sheet-metal-quote-risk-tool": "Herramienta de Riesgo de Cotización de Chapa",
  "3d-print-job-margin-tool": "Herramienta de Margen de Trabajo de Impresión 3D",
  "route-optimization-analyzer": "Análisis de Pérdida de Ruta y Carga",
  "crop-yield-loss-analyzer": "Análisis de Pérdida de Rendimiento de Cultivo",
  "water-optimization-verdict": "Evaluación de Eficiencia Hídrica",
  "feed-efficiency-analyzer": "Análisis de Eficiencia Alimenticia",
  "dairy-profit-detector": "Detector de Ganancia de Producción Lechera",
  "energy-efficiency-report": "Informe de Eficiencia Energética",
  "cbam-compliance-verdict": "Evaluación de Cumplimiento CBAM",
  "renovation-budget-optimizer": "Optimización de Presupuesto de Renovación",
  "trip-budget-optimizer": "Optimización de Presupuesto de Viaje",
  "meal-planning-verdict": "Planificación Semanal de Comidas",
};

const ES_FREE_TITLES: Record<string, string> = {
  "machine-time-calculator": "Calculadora de Tiempo de Máquina",
  "project-cost-calculator": "Calculadora de Costo de Proyecto",
  "cleaning-cost-calculator": "Calculadora de Costo de Limpieza",
  "food-cost-calculator": "Calculadora de Costo de Alimentos",
  "product-margin-calculator": "Calculadora de Margen de Producto",
  "welding-cost-estimator": "Estimador de Costo de Soldadura",
  "hvac-tonnage-rule-check": "Verificación de Tonelaje HVAC",
  "electrical-labor-estimator": "Estimador de Mano de Obra Eléctrica",
  "lawn-care-cost-check": "Verificación de Costo de Jardinería",
  "repair-time-vs-price-check": "Comparación de Tiempo de Reparación vs Precio",
  "print-job-cost-check": "Verificación de Costo de Impresión",
  "plumbing-fixture-cost-check": "Verificación de Costo de Accesorios de Fontanería",
  "cabinet-cost-estimator": "Estimador de Costo de Gabinete",
  "roofing-square-cost-check": "Verificación de Costo por m² de Techo",
  "paint-coverage-cost-check": "Verificación de Costo de Cobertura de Pintura",
  "laser-cutting-time-check": "Verificación de Tiempo de Corte Láser",
  "3d-print-cost-check": "Verificación de Costo de Impresión 3D",
  "desi-calculator": "Calculadora Desi y Peso Volumétrico",
  "fertilizer-dosage-calculator": "Calculadora de Dosificación de Fertilizante",
  "irrigation-cost-check": "Verificación de Costo de Riego",
  "feed-cost-estimator": "Estimador de Costo de Alimento",
  "milk-yield-check": "Verificación de Rendimiento Lechero",
  "kwh-consumption-check": "Verificación de Consumo kWh",
  "carbon-footprint-quick": "Huella de Carbono Rápida",
  "home-renovation-m2": "Calculadora de Costo m² de Renovación",
  "fuel-consumption-check": "Verificación de Consumo de Combustible",
  "recipe-cost-check": "Verificación de Costo de Receta",
};

const AR_PAID_TITLES: Record<string, string> = {
  "cnc-quote-risk-analyzer": "تحليل مخاطر عروض التصنيع باستخدام الحاسب الآلي",
  "change-order-impact-analyzer": "تحليل تأثير أمر التغيير",
  "office-cleaning-bid-optimizer": "تحسين عروض تنظيف المكاتب",
  "menu-profit-leak-detector": "كشف تسرب أرباح القائمة",
  "return-profit-erosion-tool": "تحليل تآكل الأرباح بسبب المرتجعات",
  "welding-bid-risk-analyzer": "تحليل مخاطر عروض اللحام",
  "hvac-project-margin-guard": "حماية هامش مشاريع التكييف",
  "panel-shop-margin-verdict": "تقييم هامش تصنيع اللوحات الكهربائية",
  "landscaping-contract-profit-tool": "تحليل أرباح عقود تنسيق الحدائق",
  "auto-shop-margin-leak-detector": "كشف تسرب هامش ورشة السيارات",
  "signage-bid-safe-price-tool": "أداة السعر الآمن لعروض اللافتات",
  "plumbing-job-margin-verdict": "تقييم هامش أعمال السباكة",
  "millwork-bid-risk-analyzer": "تحليل مخاطر عروض النجارة",
  "roofing-contract-margin-guard": "حماية هامش عقود الأسقف",
  "painting-job-profit-verdict": "تقييم أرباح أعمال الدهان",
  "sheet-metal-quote-risk-tool": "أداة مخاطر عروض الصفائح المعدنية",
  "3d-print-job-margin-tool": "أداة هامش أعمال الطباعة ثلاثية الأبعاد",
  "route-optimization-analyzer": "تحليل خسائر الطرق والشحن",
  "crop-yield-loss-analyzer": "تحليل فقدان إنتاجية المحاصيل",
  "water-optimization-verdict": "تقييم كفاءة استخدام المياه",
  "feed-efficiency-analyzer": "تحليل كفاءة الأعلاف",
  "dairy-profit-detector": "كشف أرباح إنتاج الألبان",
  "energy-efficiency-report": "تقرير كفاءة الطاقة",
  "cbam-compliance-verdict": "تقييم الامتثال لآلية تعديل الحدود الكربونية",
  "renovation-budget-optimizer": "تحسين ميزانية التجديد",
  "trip-budget-optimizer": "تحسين ميزانية الرحلة",
  "meal-planning-verdict": "تخطيط الوجبات الأسبوعي",
};

const AR_FREE_TITLES: Record<string, string> = {
  "machine-time-calculator": "حاسبة وقت الماكينة",
  "project-cost-calculator": "حاسبة تكلفة المشروع",
  "cleaning-cost-calculator": "حاسبة تكلفة التنظيف",
  "food-cost-calculator": "حاسبة تكلفة الطعام",
  "product-margin-calculator": "حاسبة هامش المنتج",
  "welding-cost-estimator": "مقدر تكلفة اللحام",
  "hvac-tonnage-rule-check": "فحص حمولة التكييف",
  "electrical-labor-estimator": "مقدر تكلفة العمالة الكهربائية",
  "lawn-care-cost-check": "فحص تكلفة العناية بالحديقة",
  "repair-time-vs-price-check": "مقارنة وقت الإصلاح مقابل السعر",
  "print-job-cost-check": "فحص تكلفة أعمال الطباعة",
  "plumbing-fixture-cost-check": "فحص تكلفة تركيبات السباكة",
  "cabinet-cost-estimator": "مقدر تكلفة الخزائن",
  "roofing-square-cost-check": "فحص تكلفة المتر المربع للأسقف",
  "paint-coverage-cost-check": "فحص تكلفة تغطية الدهان",
  "laser-cutting-time-check": "فحص وقت القطع بالليزر",
  "3d-print-cost-check": "فحص تكلفة الطباعة ثلاثية الأبعاد",
  "desi-calculator": "حاسبة الديسي والوزن الحجمي",
  "fertilizer-dosage-calculator": "حاسبة جرعة السماد",
  "irrigation-cost-check": "فحص تكلفة الري",
  "feed-cost-estimator": "مقدر تكلفة العلف",
  "milk-yield-check": "فحص إنتاج الحليب",
  "kwh-consumption-check": "فحص استهلاك كيلوواط ساعة",
  "carbon-footprint-quick": "بصمة كربونية سريعة",
  "home-renovation-m2": "حاسبة تكلفة المتر المربع للتجديد",
  "fuel-consumption-check": "فحص استهلاك الوقود",
  "recipe-cost-check": "فحص تكلفة الوصفة",
};

const REVENUE_TOOL_TITLES: Partial<
  Record<AppLocale, { paid: Record<string, string>; free: Record<string, string> }>
> = {
  tr: { paid: TR_PAID_TITLES, free: TR_FREE_TITLES },
  de: { paid: DE_PAID_TITLES, free: DE_FREE_TITLES },
  fr: { paid: FR_PAID_TITLES, free: FR_FREE_TITLES },
  es: { paid: ES_PAID_TITLES, free: ES_FREE_TITLES },
  ar: { paid: AR_PAID_TITLES, free: AR_FREE_TITLES },
};

export function getLocalizedRevenueToolTitle(
  slug: string,
  kind: ToolKind,
  locale: string,
  fallback: string,
): string {
  const map = REVENUE_TOOL_TITLES[locale as AppLocale];
  if (!map) return fallback;
  return map[kind][slug] ?? fallback;
}

// ═══════════════════════════════════════════════════════════════
// Locale-aware overrides for revenue tool FREE/PAID descriptions.
// Added to fix English description leaks in categories page.
// ═══════════════════════════════════════════════════════════════

/* TR */
const TR_FREE_DESCRIPTIONS: Record<string, string> = {
  "carbon-footprint-quick": "Üretim hacmi ve enerji karışımından görünür CO₂ maruziyetini tahmin et.",
  "feed-cost-estimator": "Sürü büyüklüğü ve günlük rasyondan aylık yem harcamasını tahmin et.",
  "fertilizer-dosage-calculator": "N-P-K yükünü ve aşırı gübreleme riskini hesapla.",
  "fuel-consumption-check": "Mesafe ve tüketimden yakıt maliyetini tahmin et.",
  "home-renovation-m2": "Metrekare başına görünür malzeme ve işçilik maliyetini tahmin et.",
  "irrigation-cost-check": "Görünür pompa süresi ve su maliyeti maruziyetini tahmin et.",
  "kwh-consumption-check": "Aylık kWh maruziyetini referans tarife karşısında kontrol et.",
  "milk-yield-check": "Süt gelirini görünür yem maliyeti baskısıyla karşılaştır.",
  "recipe-cost-check": "Malzeme listesinden porsiyon başına maliyeti hesapla.",
};

const TR_PAID_DESCRIPTIONS: Record<string, string> = {
  "carbon-footprint-quick": "Proses emisyonları, nakliye ve CBAM maliyet maruziyetini modelle.",
  "feed-cost-estimator": "Atık, su kalitesi ve yem-çıktı verimliliğini modelle.",
  "fertilizer-dosage-calculator": "Nem, hava ve girdi maliyeti kaçaklarını verim kararıyla modelle.",
  "fuel-consumption-check": "Köprüler, dönüş ayağı ve gerçekçi yolculuk bütçesi için tampon ekle.",
  "home-renovation-m2": "Mevsimsel gecikme, bölgesel çarpan ve gerçekçi toplam ekle.",
  "irrigation-cost-check": "Verimlilik kararıyla minimum uygulanabilir sulama harcamasını bul.",
  "kwh-consumption-check": "Talep bedelleri, güç faktörü ve verimlilik kararını modelle.",
  "milk-yield-check": "Tam maliyet yığını kararıyla süt kâr kaçaklarını tespit et.",
  "recipe-cost-check": "Atık ve enflasyon tamponuyla haftalık bakkal planını modelle.",
};

const REVENUE_TOOL_DESCRIPTIONS: Partial<
  Record<AppLocale, { paid: Record<string, string>; free: Record<string, string> }>
> = {
  tr: { paid: TR_PAID_DESCRIPTIONS, free: TR_FREE_DESCRIPTIONS },
};

export function getLocalizedRevenueToolDescription(
  slug: string,
  kind: ToolKind,
  locale: string,
  fallback: string,
): string {
  const map = REVENUE_TOOL_DESCRIPTIONS[locale as AppLocale];
  if (!map) return fallback;
  return map[kind][slug] ?? fallback;
}
