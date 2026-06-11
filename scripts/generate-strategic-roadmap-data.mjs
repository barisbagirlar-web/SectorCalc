#!/usr/bin/env node
/**
 * Generates src/data/strategic-premium-calculators.ts and free-traffic-tool-roadmap.ts
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "..");
const SOURCE = JSON.parse(
  readFileSync(join(ROOT, "scripts/data/strategic-roadmap-source.json"), "utf8"),
);

const LOCALES = ["en", "tr", "de", "fr", "es", "ar"];

function toLocaleRecord(en, tr, de, fr, es, ar) {
  return { en, tr, de, fr, es, ar };
}

function calcSuffix(locale) {
  const map = {
    en: "Calculator",
    tr: "Hesaplayıcı",
    de: "Rechner",
    fr: "Calculateur",
    es: "Calculadora",
    ar: "حاسبة",
  };
  return map[locale];
}

function toolSuffix(locale) {
  const map = {
    en: "Calculation Tool",
    tr: "Hesaplama Aracı",
    de: "Berechnungstool",
    fr: "Outil de calcul",
    es: "Herramienta de cálculo",
    ar: "أداة حساب",
  };
  return toolSuffixInner(locale, map);
}

function toolSuffixInner(locale, map) {
  return map[locale];
}

function translateTitle(enTitle, locale) {
  if (locale === "en") return enTitle;
  const item = SOURCE.free.find((f) => f.enTitle === enTitle);
  if (locale === "tr" && item) return item.trTitle;

  const premium = SOURCE.premium.find((p) => enTitle.includes("Calculator") === false);
  void premium;

  const base = enTitle
    .replace(/\s+Calculator$/i, "")
    .replace(/\s+Converter$/i, "")
    .replace(/\s+Calculation$/i, "");

  if (locale === "tr") {
    return enTitle
      .replace(/Calculator/g, "Hesaplayıcı")
      .replace(/Converter/g, "Çevirici")
      .replace(/Calculation/g, "Hesaplama");
  }
  if (locale === "de") {
    if (/Converter$/i.test(enTitle)) return `${base}-Umrechner`;
    return `${base}-Rechner`;
  }
  if (locale === "fr") {
    if (/Converter$/i.test(enTitle)) return `Convertisseur ${base.toLowerCase()}`;
    return `Calculateur ${base.toLowerCase()}`;
  }
  if (locale === "es") {
    if (/Converter$/i.test(enTitle)) return `Convertidor ${base.toLowerCase()}`;
    return `Calculadora ${base.toLowerCase()}`;
  }
  if (locale === "ar") {
    if (/Converter$/i.test(enTitle)) return `محول ${base}`;
    return `حاسبة ${base}`;
  }
  return enTitle;
}

function translateAudience(enAudience, trAudience, locale) {
  if (locale === "en") return enAudience;
  if (locale === "tr") return trAudience;
  const map = {
    de: enAudience
      .replace(/Everyone/g, "Alle")
      .replace(/Business owners/g, "Unternehmer")
      .replace(/Accountants/g, "Buchhalter")
      .replace(/HR/g, "Personalwesen")
      .replace(/Logistics/g, "Logistik")
      .replace(/Construction/g, "Bau")
      .replace(/Maintenance/g, "Instandhaltung")
      .replace(/Electricians/g, "Elektriker")
      .replace(/Quality teams/g, "Qualitätsteams")
      .replace(/Finance teams/g, "Finanzteams")
      .replace(/Fleet managers/g, "Flottenmanager")
      .replace(/Office teams/g, "Büroteams"),
    fr: enAudience
      .replace(/Everyone/g, "Tous")
      .replace(/Business owners/g, "Dirigeants")
      .replace(/Accountants/g, "Comptables")
      .replace(/HR/g, "RH")
      .replace(/Logistics/g, "Logistique")
      .replace(/Construction/g, "Construction")
      .replace(/Maintenance/g, "Maintenance")
      .replace(/Electricians/g, "Électriciens")
      .replace(/Quality teams/g, "Équipes qualité")
      .replace(/Finance teams/g, "Équipes finance")
      .replace(/Fleet managers/g, "Gestionnaires de flotte")
      .replace(/Office teams/g, "Équipes de bureau"),
    es: enAudience
      .replace(/Everyone/g, "Todos")
      .replace(/Business owners/g, "Empresarios")
      .replace(/Accountants/g, "Contadores")
      .replace(/HR/g, "RR. HH.")
      .replace(/Logistics/g, "Logística")
      .replace(/Construction/g, "Construcción")
      .replace(/Maintenance/g, "Mantenimiento")
      .replace(/Electricians/g, "Electricistas")
      .replace(/Quality teams/g, "Equipos de calidad")
      .replace(/Finance teams/g, "Equipos financieros")
      .replace(/Fleet managers/g, "Gestores de flota")
      .replace(/Office teams/g, "Equipos de oficina"),
    ar: enAudience
      .replace(/Everyone/g, "الجميع")
      .replace(/Business owners/g, "أصحاب الأعمال")
      .replace(/Accountants/g, "المحاسبون")
      .replace(/HR/g, "الموارد البشرية")
      .replace(/Logistics/g, "اللوجستيات")
      .replace(/Construction/g, "البناء")
      .replace(/Maintenance/g, "الصيانة")
      .replace(/Electricians/g, "الكهربائيون")
      .replace(/Quality teams/g, "فرق الجودة")
      .replace(/Finance teams/g, "الفرق المالية")
      .replace(/Fleet managers/g, "مديرو الأساطيل")
      .replace(/Office teams/g, "فرق المكاتب"),
  };
  return map[locale] ?? enAudience;
}

const PREMIUM_COPY = {
  "sp-001": {
    shortDescription: toLocaleRecord(
      "Calculate quote price, margin, scrap, setup, payment terms and energy in one screen.",
      "Tekliflerde maliyet, fire, vade, enerji ve marj kalemlerini aynı ekranda hesaplayın.",
      "Berechnen Sie Angebotspreis, Marge, Ausschuss, Rüstzeit, Zahlungsziel und Energie auf einem Bildschirm.",
      "Calculez prix, marge, rebuts, réglage, délais de paiement et énergie sur un seul écran.",
      "Calcule precio, margen, merma, setup, plazo de pago y energía en una sola pantalla.",
      "احسب سعر العرض والهامش والهدر والإعداد وشروط الدفع والطاقة في شاشة واحدة.",
    ),
    pain: toLocaleRecord(
      "Quotes often omit scrap, setup time, payment-term cost and utility load before margin is set.",
      "Tekliflerde fire, kurulum süresi, vade maliyeti ve enerji yükü sıkça atlanır; marj buna göre incelir.",
      "Angebote lassen oft Ausschuss, Rüstzeit, Zahlungszielkosten und Energie außer Acht.",
      "Les devis omettent souvent rebuts, temps de réglage, coût de délai et charge énergétique.",
      "Las cotizaciones suelen omitir merma, setup, coste de plazo y carga energética.",
      "غالبًا ما تُهمَل الهدر ووقت الإعداد وتكلفة آجال الدفع والحمل الطاقي في العروض.",
    ),
    publicPromise: toLocaleRecord(
      "Structure every quote with the cost lines teams forget before margin is locked.",
      "Marj kilitlenmeden önce ekiplerin unuttuğu maliyet kalemlerini teklife ekleyin.",
      "Strukturieren Sie jedes Angebot mit vergessenen Kostenpositionen vor der Margenfixierung.",
      "Structurez chaque devis avec les postes de coût oubliés avant de figer la marge.",
      "Estructure cada cotización con las partidas olvidadas antes de fijar el margen.",
      "نظّم كل عرض بالبنود التي تُنسى قبل تثبيت الهامش.",
    ),
    internalSourceNote: "Strategic report tool 1 — quote margin; safe copy replaces aggressive margin guarantee.",
  },
  "sp-002": {
    shortDescription: toLocaleRecord(
      "See true machine hourly cost with depreciation, energy, maintenance and floor-space share.",
      "Makinenin saatlik maliyetini amortisman, enerji, bakım ve alan payı ile birlikte görün.",
      "Sehen Sie den echten Maschinenstundensatz inkl. Abschreibung, Energie, Wartung und Flächenanteil.",
      "Voyez le coût horaire réel avec amortissement, énergie, maintenance et part de surface.",
      "Vea el coste horario real con amortización, energía, mantenimiento y espacio.",
      "اعرض التكلفة الساعية الحقيقية مع الإهلاك والطاقة والصيانة وحصة المساحة.",
    ),
    pain: toLocaleRecord(
      "Most shops estimate shop rate from labor and power only, understating true hourly burden.",
      "Atölyelerin çoğu shop rate'i yalnızca işçilik ve elektrikle hesaplar; gerçek yük eksik kalır.",
      "Die meisten Werkstätten schätzen den Stundensatz nur aus Arbeit und Strom.",
      "La plupart des ateliers estiment le taux horaire avec main-d'œuvre et électricité seulement.",
      "La mayoría estima la tarifa horaria solo con mano de obra y electricidad.",
      "تقدّر معظم الورش التكلفة الساعية من العمالة والكهرباء فقط.",
    ),
    publicPromise: toLocaleRecord(
      "Build a defensible shop-rate profile in minutes instead of guessing from power bills alone.",
      "Shop rate profilini dakikalar içinde, yalnızca elektrik faturasından tahmin etmek yerine oluşturun.",
      "Erstellen Sie in Minuten ein belastbares Shop-Rate-Profil statt zu schätzen.",
      "Construisez un profil de taux horaire défendable en quelques minutes.",
      "Construya un perfil de tarifa horaria defendible en minutos.",
      "أنشئ ملف تكلفة ساعية موثوقًا في دقائق بدل التخمين.",
    ),
    internalSourceNote: "Strategic report tool 2 — shop rate.",
  },
  "sp-003": {
    shortDescription: toLocaleRecord(
      "Calculate break-even point and safety margin on one screen.",
      "Başabaş noktası ve güvenlik marjını tek ekranda hesaplayın.",
      "Berechnen Sie Break-even und Sicherheitsmarge auf einem Bildschirm.",
      "Calculez seuil de rentabilité et marge de sécurité sur un écran.",
      "Calcule punto de equilibrio y margen de seguridad en una pantalla.",
      "احسب نقطة التعادل وهامش الأمان في شاشة واحدة.",
    ),
    pain: toLocaleRecord(
      "Owners often learn profit or loss only after month-end statements arrive.",
      "İşletmeler kâr/zararı çoğu zaman ay sonu tabloları gelince öğrenir.",
      "Unternehmer erfahren Gewinn oder Verlust oft erst nach Monatsabschluss.",
      "Les dirigeants découvrent profit ou perte seulement en fin de mois.",
      "Los dueños conocen ganancia o pérdida solo al cierre mensual.",
      "يتعرّف أصحاب الأعمال الربح أو الخسارة غالبًا بعد إغلاق الشهر.",
    ),
    publicPromise: toLocaleRecord(
      "Track fixed and variable costs against revenue before the month closes.",
      "Ay kapanmadan sabit ve değişken maliyetleri ciroya göre takip edin.",
      "Verfolgen Sie Fix- und variable Kosten zum Umsatz vor Monatsende.",
      "Suivez coûts fixes et variables face au chiffre d'affaires avant la clôture.",
      "Siga costes fijos y variables frente a ingresos antes del cierre.",
      "تتبّع التكاليف الثابتة والمتغيرة مقابل الإيراد قبل إغلاق الشهر.",
    ),
    internalSourceNote: "Strategic report tool 3 — break-even dashboard.",
  },
  "sp-004": {
    shortDescription: toLocaleRecord(
      "Standardize parts and labor lines for repair-shop quotes on mobile.",
      "Tamirhane tekliflerinde parça ve işçilik satırlarını mobilde standartlaştırın.",
      "Standardisieren Sie Teile- und Arbeitszeilen für Werkstattangebote mobil.",
      "Standardisez pièces et main-d'œuvre pour devis d'atelier sur mobile.",
      "Estandarice piezas y mano de obra en cotizaciones de taller móvil.",
      "وحّد بنود القطع والعمالة لعروض الورش على الجوال.",
    ),
    pain: toLocaleRecord(
      "Repair quotes vary by technician and format, making price consistency hard.",
      "Tamir teklifleri ustaya göre değişir; fiyat tutarlılığı zorlaşır.",
      "Reparaturangebote variieren je Techniker und Format.",
      "Les devis de réparation varient selon le technicien.",
      "Las cotizaciones de reparación varían por técnico.",
      "تختلف عروض الإصلاح حسب الفني والنموذج.",
    ),
    publicPromise: toLocaleRecord(
      "Issue repeatable repair quotes with shared labor-time and parts structure.",
      "Ortak işçilik süresi ve parça yapısıyla tekrarlanabilir tamir teklifleri verin.",
      "Erstellen Sie wiederholbare Reparaturangebote mit gemeinsamer Struktur.",
      "Émettez des devis répétables avec structure commune.",
      "Emite cotizaciones repetibles con estructura común.",
      "قدّم عروض إصلاح مت repeatable ببنية مشتركة.",
    ),
    internalSourceNote: "Strategic report tool 4 — auto repair quote; planned premium build.",
  },
  "sp-005": {
    shortDescription: toLocaleRecord(
      "Estimate embedded carbon per product unit for export compliance workflows.",
      "İhracat uyum süreçleri için birim ürün gömülü karbonunu hesaplayın.",
      "Schätzen Sie eingebetteten Kohlenstoff pro Produkteinheit für Export-Compliance.",
      "Estimez le carbone incorporé par unité pour la conformité export.",
      "Estime carbono incorporado por unidad para cumplimiento exportador.",
      "قدّر الكربون المدمج لكل وحدة منتج للامتثال التصديري.",
    ),
    pain: toLocaleRecord(
      "Exporters need product-level carbon evidence but lack affordable tooling.",
      "İhracatçılar ürün bazlı karbon kanıtına ihtiyaç duyar; uygun araç azdır.",
      "Exporteure brauchen Produkt-Kohlenstoffnachweise ohne teure Berater.",
      "Les exportateurs manquent d'outils abordables pour le carbone produit.",
      "Exportadores carecen de herramientas asequibles de carbono por producto.",
      "يحتاج المصدرون أدوات ميسورة لكربون المنتج.",
    ),
    publicPromise: toLocaleRecord(
      "Document unit product carbon with traceable factors before customs review.",
      "Gümrük incelemesinden önce izlenebilir faktörlerle birim ürün karbonunu belgeleyin.",
      "Dokumentieren Sie Produkt-Kohlenstoff mit nachvollziehbaren Faktoren vor Zollprüfung.",
      "Documentez le carbone produit avec facteurs traçables avant douane.",
      "Documente carbono por unidad con factores trazables antes de aduana.",
      "وثّق كربون المنتج بعوامل قابلة للتتبع قبل الجمارك.",
    ),
    internalSourceNote: "Strategic report tool 5 — CBAM unit carbon; mapped to free CBAM quick check.",
  },
  "sp-006": {
    shortDescription: toLocaleRecord(
      "Calculate OEE from availability, performance and quality inputs.",
      "Uygunluk, performans ve kalite girdileriyle OEE hesaplayın.",
      "Berechnen Sie OEE aus Verfügbarkeit, Leistung und Qualität.",
      "Calculez l'OEE à partir de disponibilité, performance et qualité.",
      "Calcule OEE con disponibilidad, rendimiento y calidad.",
      "احسب OEE من التوفر والأداء والجودة.",
    ),
    pain: toLocaleRecord(
      "Without OEE tracking, chronic downtime and quality loss stay invisible.",
      "OEE takibi olmadan kronik duruş ve kalite kaybı görünmez kalır.",
      "Ohne OEE bleiben Stillstände und Qualitätsverlust unsichtbar.",
      "Sans OEE, arrêts chroniques et pertes qualité restent invisibles.",
      "Sin OEE, paradas crónicas y pérdida de calidad permanecen ocultas.",
      "بدون OEE تبقى التوقفات المزمنة وخسائر الجودة مخفية.",
    ),
    publicPromise: toLocaleRecord(
      "Enter three shift numbers and see equipment effectiveness and loss split.",
      "Üç vardiya değeri girin; ekipman etkinliği ve kayıp dağılımını görün.",
      "Geben Sie drei Schichtwerte ein und sehen Sie Effektivität und Verluste.",
      "Saisissez trois valeurs de poste et voyez efficacité et répartition des pertes.",
      "Introduce tres valores de turno y ve eficacia y pérdidas.",
      "أدخل ثلاث قيم نوبة واعرض الفعالية وتوزيع الخسائر.",
    ),
    internalSourceNote: "Strategic report tool 6 — OEE; live free calculator mapped.",
  },
  "sp-007": {
    shortDescription: toLocaleRecord(
      "Estimate annual cost of compressed-air leaks from orifice, pressure and runtime.",
      "Delik çapı, basınç ve çalışma süresinden basınçlı hava kaçağı yıllık maliyetini tahmin edin.",
      "Schätzen Sie jährliche Druckluftleckagekosten aus Öffnung, Druck und Laufzeit.",
      "Estimez le coût annuel des fuites d'air comprimé.",
      "Estime el coste anual de fugas de aire comprimido.",
      "قدّر التكلفة السنوية لتسربات الهواء المضغوط.",
    ),
    pain: toLocaleRecord(
      "Compressed-air leaks are rarely quantified even though they inflate utility bills.",
      "Basınçlı hava kaçakları faturayı şişirir ama nadiren sayısallaştırılır.",
      "Druckluftlecks werden selten beziffert, obwohl sie Kosten erhöhen.",
      "Les fuites d'air comprimé sont rarement chiffrées.",
      "Las fugas de aire comprimido rara vez se cuantifican.",
      "نادرًا ما تُ quantified تسربات الهواء المضغوط.",
    ),
    publicPromise: toLocaleRecord(
      "Turn leak size and pressure into a yearly cost figure maintenance can act on.",
      "Kaçak boyutu ve basıncı bakımın aksiyon alabileceği yıllık maliyete çevirin.",
      "Wandeln Sie Leckgröße und Druck in jährliche Kosten für die Wartung um.",
      "Transformez taille de fuite et pression en coût annuel actionnable.",
      "Convierta tamaño de fuga y presión en coste anual accionable.",
      "حوّل حجم التسرب والضغط إلى تكلفة سنوية قابلة للتنفيذ.",
    ),
    internalSourceNote: "Strategic report tool 7 — compressor leak cost.",
  },
  "sp-008": {
    shortDescription: toLocaleRecord(
      "Calculate full employer cost beyond net salary including SGK and benefits.",
      "Net maaşın ötesinde SGK ve yan haklarla işverenin tam personel maliyetini hesaplayın.",
      "Berechnen Sie volle Arbeitgeberkosten über Nettogehalt inkl. Sozialabgaben.",
      "Calculez le coût employeur total au-delà du salaire net.",
      "Calcule el coste total del empleador más allá del salario neto.",
      "احسب التكلفة الكاملة للEmployer beyond net salary.",
    ),
    pain: toLocaleRecord(
      "Hiring and pricing decisions often use net pay instead of loaded employer cost.",
      "İşe alım ve fiyatlama kararlarında net maaş kullanılır; tam maliyet eksik kalır.",
      "Einstellungsentscheidungen nutzen oft Netto statt voller Arbeitgeberkosten.",
      "Les décisions d'embauche utilisent souvent le net au lieu du coût chargé.",
      "Las decisiones de contratación usan a menudo el neto en lugar del coste total.",
      "قرارات التوظيف تستخدم غالبًا الصافي بدل التكلفة الكاملة.",
    ),
    publicPromise: toLocaleRecord(
      "See loaded headcount cost before hiring or quoting labor-heavy jobs.",
      "İş gücü yoğun iş teklif etmeden önce yüklenmiş personel maliyetini görün.",
      "Sehen Sie belastete Personalkosten vor Einstellung oder Angebot.",
      "Voyez le coût personnel chargé avant embauche ou devis.",
      "Vea el coste laboral cargado antes de contratar o cotizar.",
      "اعرض تكلفة الموظف المحمّلة قبل التوظيف أو العرض.",
    ),
    internalSourceNote: "Strategic report tool 8 — total employee cost.",
  },
  "sp-009": {
    shortDescription: toLocaleRecord(
      "Convert downtime minutes into lost output value using shop rate.",
      "Shop rate ile duruş dakikalarını kayıp çıktı değerine çevirin.",
      "Rechnen Sie Stillstandsminuten mit Shop-Rate in entgangenen Output um.",
      "Convertissez minutes d'arrêt en valeur perdue via taux horaire.",
      "Convierta minutos de parada en valor perdido con tarifa horaria.",
      "حوّل دقائق التوقف إلى قيمة مفقودة باستخدام التكلفة الساعية.",
    ),
    pain: toLocaleRecord(
      "Maintenance budgets ignore opportunity cost of machines not producing.",
      "Bakım bütçeleri makinenin üretmediği fırsat maliyetini yok sayar.",
      "Wartungsbudgets ignorieren entgangene Produktion.",
      "Les budgets maintenance ignorent le coût d'opportunité.",
      "Los presupuestos de mantenimiento ignoran el coste de oportunidad.",
      "تتجاهل ميزانيات الصيانة تكلفة الفرصة.",
    ),
    publicPromise: toLocaleRecord(
      "Quantify downtime in currency to justify preventive maintenance spend.",
      "Önleyici bakım harcamasını gerekçelendirmek için duruşu para biriminde ölçün.",
      "Quantifizieren Sie Stillstand in Währung für präventive Wartung.",
      "Quantifiez les arrêts en devise pour justifier la maintenance préventive.",
      "Cuantifique paradas en moneda para justificar mantenimiento preventivo.",
      "قِس التوقف بالعملة لتبرير الصيانة الوقائية.",
    ),
    internalSourceNote: "Strategic report tool 9 — downtime minute cost; planned.",
  },
  "sp-010": {
    shortDescription: toLocaleRecord(
      "Compare product and customer contribution after hidden service costs.",
      "Gizli hizmet maliyetleri sonrası ürün ve müşteri katkısını karşılaştırın.",
      "Vergleichen Sie Produkt- und Kundenbeitrag nach versteckten Servicekosten.",
      "Comparez contribution produit et client après coûts de service cachés.",
      "Compare contribución de producto y cliente tras costes ocultos.",
      "قارن مساهمة المنتج والعميل بعد التكاليف الخفية.",
    ),
    pain: toLocaleRecord(
      "High-revenue customers can destroy margin through returns, delays and rework.",
      "Yüksek cirolu müşteriler iade, gecikme ve rework ile marjı eritebilir.",
      "Umsatzstarke Kunden können Marge durch Retouren und Verzug zerstören.",
      "Les gros clients peuvent détruire la marge via retours et retards.",
      "Clientes de alto ingreso pueden destruir margen con devoluciones.",
      "عملاء الإيرادات العالية قد يمحون الهامش بالمرتجعات.",
    ),
    publicPromise: toLocaleRecord(
      "Rank customers and SKUs by contribution instead of invoice total alone.",
      "Yalnızca fatura toplamı yerine müşteri ve SKU katkısına göre sıralayın.",
      "Sortieren Sie nach Beitrag statt nur Rechnungssumme.",
      "Classez par contribution plutôt que total de facture seul.",
      "Ordene por contribución en lugar de solo factura total.",
      "رتّب حسب المساهمة بدل إجمالي الفاتورة فقط.",
    ),
    internalSourceNote: "Strategic report tool 10 — customer profitability.",
  },
  "sp-011": {
    shortDescription: toLocaleRecord(
      "Model inventory carrying cost and economic order quantity with sector scrap factors.",
      "Sektör fire katsayılarıyla stok taşıma maliyeti ve EOQ modelleyin.",
      "Modellieren Sie Lagerhaltungskosten und EOQ mit Branchen-Ausschussfaktoren.",
      "Modélisez coût de stockage et EOQ avec facteurs de rebut sectoriels.",
      "Modele coste de inventario y EOQ con factores de merma sectoriales.",
      "نمذج تكلفة حمل المخزون وEOQ بمعاملات الهدر القطاعية.",
    ),
    pain: toLocaleRecord(
      "Inventory cost is underestimated when only warehouse rent is counted.",
      "Stok maliyeti yalnızca depo kirası sayıldığında eksik kalır.",
      "Lagerkosten werden unterschätzt wenn nur Miete gezählt wird.",
      "Le coût stock est sous-estimé si seul le loyer est compté.",
      "El coste de inventario se subestima contando solo alquiler.",
      "يُUnderestimated تكلفة المخزون عند احتساب الإيجار فقط.",
    ),
    publicPromise: toLocaleRecord(
      "Expose holding cost and order size trade-offs before stock decisions.",
      "Stok kararlarından önce taşıma maliyeti ve sipariş büyüklüğü dengesini görün.",
      "Zeigen Sie Haltungskosten vor Bestellentscheidungen.",
      "Exposez coût de détention avant décisions de stock.",
      "Exponga coste de mantener stock antes de decidir.",
      "اعرض تكلفة الاحتفاظ قبل قرارات المخزون.",
    ),
    internalSourceNote: "Strategic report tool 11 — inventory EOQ.",
  },
  "sp-012": {
    shortDescription: toLocaleRecord(
      "Check common welded and bolted connection capacity with workshop-friendly inputs.",
      "Atölye dostu girdilerle yaygın kaynaklı ve bulonlu bağlantı kapasitesini kontrol edin.",
      "Prüfen Sie gängige Schweiß- und Bolzenverbindungen mit Werkstatt-Eingaben.",
      "Vérifiez connexions soudées et boulonnées avec entrées atelier.",
      "Verifique conexiones soldadas y atornilladas con entradas de taller.",
      "تحقق من وصلات اللحام والبراغي بمدخلات الورشة.",
    ),
    pain: toLocaleRecord(
      "Connection sizing relies on guesswork without quick structural checks.",
      "Bağlantı boyutlandırması hızlı kontrol olmadan sezgiye kalır.",
      "Verbindungsdimensionierung erfolgt ohne schnelle Prüfung per Bauchgefühl.",
      "Le dimensionnement repose sur l'intuition sans contrôle rapide.",
      "El dimensionamiento depende de intuición sin chequeo rápido.",
      "يعتمد تحديد حجم الوصلات على الحدس.",
    ),
    publicPromise: toLocaleRecord(
      "Screen weld and bolt capacity for common shop connections in minutes.",
      "Yaygın atölye bağlantıları için kaynak ve bulon kapasitesini dakikalar içinde tarayın.",
      "Prüfen Sie Schweiß- und Bolzenkapazität in Minuten.",
      "Filtrez capacité soudure et boulons en minutes.",
      "Evalúe capacidad de soldadura y pernos en minutos.",
      "افحص سعة اللحام والبراغي في دقائق.",
    ),
    internalSourceNote: "Strategic report tool 12 — weld/bolt; planned.",
  },
  "sp-013": {
    shortDescription: toLocaleRecord(
      "Run worst-case and RSS tolerance stack-up for assembly chains.",
      "Montaj zincirleri için en kötü durum ve RSS tolerans yığılmasını çalıştırın.",
      "Führen Sie WC- und RSS-Toleranzstack-up für Montageketten aus.",
      "Exécutez empilement de tolérances WC et RSS pour assemblages.",
      "Ejecute acumulación de tolerancias WC y RSS en ensamblajes.",
      "نفّذ تراكم التسامح WC وRSS لسلاسل التجميع.",
    ),
    pain: toLocaleRecord(
      "Fit issues often come from stacked tolerances without a documented chain check.",
      "Uyumsuzluklar çoğu zaman belgelenmiş zincir kontrolü olmadan birikir.",
      "Passungsprobleme entstehen durch gestapelte Toleranzen ohne Dokumentation.",
      "Les problèmes d'ajustement viennent de tolérances empilées non documentées.",
      "Problemas de ajuste vienen de tolerancias apiladas sin registro.",
      "مشاكل الملاءمة من tolerances متراكمة دون توثيق.",
    ),
    publicPromise: toLocaleRecord(
      "Identify which part drives assembly risk before scrap accumulates.",
      "Hurda birikmeden montaj riskini hangi parçanın taşıdığını görün.",
      "Identifizieren Sie das risikoträchtige Teil vor Ausschuss.",
      "Identifiez la pièce à risque avant rebuts.",
      "Identifique la pieza de riesgo antes de merma.",
      "حدّد القطعة المسببة للمخاطر قبل الهدر.",
    ),
    internalSourceNote: "Strategic report tool 13 — tolerance stack-up.",
  },
  "sp-014": {
    shortDescription: toLocaleRecord(
      "Calculate bolt tightening torque with friction and grade libraries.",
      "Sürtünme ve sınıf kütüphaneleriyle civata sıkma torkunu hesaplayın.",
      "Berechnen Sie Anzugsdrehmoment mit Reibungs- und Gütebibliotheken.",
      "Calculez couple de serrage avec bibliothèques de frottement et classe.",
      "Calcule par de apriete con bibliotecas de fricción y clase.",
      "احسب عزم شد البرغي بمكتبات الاحتكاك والدرجة.",
    ),
    pain: toLocaleRecord(
      "Critical fasteners are often tightened by feel instead of specified torque.",
      "Kritik bağlantılar çoğu zaman tork yerine hisle sıkılır.",
      "Kritische Verbindungen werden oft nach Gefühl statt Drehmoment angezogen.",
      "Les fixations critiques sont souvent serrées au feeling.",
      "Fijaciones críticas se aprietan a menudo a ojo.",
      "تُشد الوصلات الحرجة غالبًا بالحدس.",
    ),
    publicPromise: toLocaleRecord(
      "Set torque targets on mobile with grade and lubrication context.",
      "Sınıf ve yağlama bağlamıyla tork hedefini mobilde ayarlayın.",
      "Setzen Sie Drehmomentziele mobil mit Güte und Schmierung.",
      "Définissez le couple cible sur mobile avec classe et lubrification.",
      "Ajuste par de apriete en móvil con clase y lubricación.",
      "اضبط عزم الهدف على الجوال مع الدرجة والتزييت.",
    ),
    internalSourceNote: "Strategic report tool 14 — bolt torque; planned.",
  },
  "sp-015": {
    shortDescription: toLocaleRecord(
      "Compare LED, motor and compressor upgrade payback in local currency.",
      "LED, motor ve kompresör yatırımlarının geri dönüşünü yerel para biriminde karşılaştırın.",
      "Vergleichen Sie Amortisation von LED-, Motor- und Kompressor-Upgrades.",
      "Comparez retour sur investissement LED, moteur et compresseur.",
      "Compare retorno de LED, motor y compresor.",
      "قارن استرداد ترقيات LED والمحرك والضاغط.",
    ),
    pain: toLocaleRecord(
      "Energy upgrades stall when payback is unclear in monthly bill terms.",
      "Geri dönüş net değilse enerji yatırımları ertelenir.",
      "Energie-Upgrades stocken ohne klare Amortisation.",
      "Les upgrades énergie stagnent sans retour clair.",
      "Mejoras energéticas se posponen sin retorno claro.",
      "تتوقف ترقيات الطاقة بدون استرداد واضح.",
    ),
    publicPromise: toLocaleRecord(
      "See monthly savings and payback months before capex approval.",
      "Yatırım onayından önce aylık tasarruf ve geri dönüş ayını görün.",
      "Sehen Sie monatliche Einsparung und Amortisationsmonate vor Capex.",
      "Voyez économies mensuelles et mois de retour avant capex.",
      "Vea ahorro mensual y meses de retorno antes del capex.",
      "اعرض التوفير الشهري وأشهر الاسترداد قبل الاستثمار.",
    ),
    internalSourceNote: "Strategic report tool 15 — energy savings package.",
  },
  "sp-016": {
    shortDescription: toLocaleRecord(
      "Run payback period and NPV with sector discount guidance.",
      "Sektör iskonto rehberiyle geri dönüş süresi ve NPV hesaplayın.",
      "Berechnen Sie Payback und NPV mit Branchen-Diskontierung.",
      "Calculez payback et VAN avec guide sectoriel d'actualisation.",
      "Calcule payback y VAN con guía de descuento sectorial.",
      "احسب فترة الاسترداد وNPV مع إرشاد خصم قطاعي.",
    ),
    pain: toLocaleRecord(
      "Capex decisions skip discounted cash-flow checks in small businesses.",
      "KOBİ'ler yatırım kararında iskontolu nakit akışını atlar.",
      "KMU überspringen bei Investitionen DCF-Prüfungen.",
      "Les PME ignorent les flux actualisés pour le capex.",
      "Las pymes omiten flujos descontados en capex.",
      "تتجاهل الشركات الصغيرة التدفقات المخصومة.",
    ),
    publicPromise: toLocaleRecord(
      "Compare investment options with payback and NPV on one decision summary.",
      "Yatırım seçeneklerini tek karar özetinde payback ve NPV ile karşılaştırın.",
      "Vergleichen Sie Investitionen mit Payback und NPV in einer Übersicht.",
      "Comparez investissements avec payback et VAN en un résumé.",
      "Compare inversiones con payback y VAN en un resumen.",
      "قارن الخيارات الاستثمارية بملخص قرار واحد.",
    ),
    internalSourceNote: "Strategic report tool 16 — payback NPV.",
  },
  "sp-017": {
    shortDescription: toLocaleRecord(
      "Estimate fire-system flow and hydrant capacity for permit documentation.",
      "Ruhsat dokümantasyonu için yangın tesisatı debisi ve hidrant kapasitesini tahmin edin.",
      "Schätzen Sie Brandfluss und Hydrantkapazität für Genehmigungsunterlagen.",
      "Estimez débit incendie et capacité hydrants pour permis.",
      "Estime caudal contra incendios e hidrantes para permisos.",
      "قدّر تدفق نظام الإطفاء وسعة الحنفيات للتصاريح.",
    ),
    pain: toLocaleRecord(
      "Small facilities outsource basic fire hydraulic checks they could scope first.",
      "Küçük tesisler önce kapsamlandırılabilecek yangın hidroliğini dışarı verir.",
      "Kleine Betriebe outsourcen Brandhydraulik die vorab scoping braucht.",
      "Les petits sites externalisent l'hydraulique incendie évitable.",
      "Instalaciones pequeñas externalizan hidráulica evitable.",
      "تexternalize المنشآت الصغيرة فحوصات الحريق.",
    ),
    publicPromise: toLocaleRecord(
      "Produce first-pass fire flow numbers aligned with local checklist inputs.",
      "Yerel kontrol listesi girdilerine uygun ilk yangın debi rakamlarını üretin.",
      "Erzeugen Sie Erstberechnung Brandfluss passend zur lokalen Checkliste.",
      "Produisez un premier débit incendie aligné sur la checklist locale.",
      "Produzca primer caudal incendio alineado con checklist local.",
      "أنتج أرقام تدفق أولية متوافقة مع قائمة التحقق.",
    ),
    internalSourceNote: "Strategic report tool 17 — fire system; planned.",
  },
  "sp-018": {
    shortDescription: toLocaleRecord(
      "Calculate annual leave, severance and notice amounts under current rules.",
      "Güncel kurallara göre yıllık izin, kıdem ve ihbar tutarlarını hesaplayın.",
      "Berechnen Sie Urlaub, Abfindung und Kündigungsfrist nach aktuellen Regeln.",
      "Calculez congés, indemnités et préavis selon règles actuelles.",
      "Calcule vacaciones, indemnización y preaviso según reglas actuales.",
      "احسب الإجازة والمكافأة والإشعار وفق القواعد الحالية.",
    ),
    pain: toLocaleRecord(
      "HR teams rework exit-cost math whenever regulations or ceilings change.",
      "Mevzuat değişince çıkış maliyeti yeniden hesaplanır; hata riski artar.",
      "HR muss Austrittskosten bei Regeländerungen neu rechnen.",
      "Les RH recalculent les coûts de sortie à chaque changement réglementaire.",
      "RR. HH. recalcula costes de salida con cada cambio normativo.",
      "تعيد الموارد البشرية حساب تكلفة المغادرة عند تغيّر القواعد.",
    ),
    publicPromise: toLocaleRecord(
      "Model exit packages with gross and net views before signatures.",
      "İmza öncesi brüt ve net görünümle çıkış paketini modelleyin.",
      "Modellieren Sie Austrittspakete mit Brutto- und Nettosicht vor Unterschrift.",
      "Modélisez packages de sortie brut/net avant signature.",
      "Modele paquetes de salida bruto/neto antes de firmar.",
      "نمذج حزم المغادرة brut/net قبل التوقيع.",
    ),
    internalSourceNote: "Strategic report tool 18 — leave severance notice.",
  },
  "sp-019": {
    shortDescription: toLocaleRecord(
      "Calculate push and pull force for hydraulic and pneumatic cylinders.",
      "Hidrolik ve pnömatik silindirler için itme ve çekme kuvvetini hesaplayın.",
      "Berechnen Sie Druck- und Zugkraft für Hydraulik- und Pneumatikzylinder.",
      "Calculez force poussée/traction pour vérins hydrauliques et pneumatiques.",
      "Calcule fuerza empuje/tracción en cilindros hidráulicos y neumáticos.",
      "احسب قوة الدفع والسحب للأسطوانات.",
    ),
    pain: toLocaleRecord(
      "Wrong bore or pressure leads to undersized actuators and rework.",
      "Yanlış çap veya basınç yetersiz aktüatör ve rework doğurur.",
      "Falscher Bohrung/Druck führt zu unterdimensionierten Aktoren.",
      "Alésage ou pression erronés mènent à actionneurs sous-dimensionnés.",
      "Diámetro o presión incorrectos causan actuadores pequeños.",
      "القطر أو الضغط الخاطئ يؤدي لمح actuators صغيرة.",
    ),
    publicPromise: toLocaleRecord(
      "Validate cylinder selection with standard bore library and safety factor.",
      "Standart çap kütüphanesi ve emniyet katsayısıyla silindir seçimini doğrulayın.",
      "Validieren Sie Zylinderwahl mit Standardbohrungen und Sicherheitsfaktor.",
      "Validez le vérin avec bibliothèque d'alésages et facteur de sécurité.",
      "Valide cilindro con biblioteca de diámetros y factor de seguridad.",
      "تحقق من اختيار الأسطوانة بمكتبة الأقطار وعامل الأمان.",
    ),
    internalSourceNote: "Strategic report tool 19 — cylinder force; planned.",
  },
  "sp-020": {
    shortDescription: toLocaleRecord(
      "Calculate belt-pulley speed ratio and belt length for V and timing belts.",
      "V ve triger kayışlar için kasnak devir oranı ve kayış uzunluğunu hesaplayın.",
      "Berechnen Sie Übersetzung und Riemenlänge für Keil- und Zahnriemen.",
      "Calculez rapport de vitesse et longueur de courroie.",
      "Calcule relación de velocidad y longitud de correa.",
      "احسب نسبة السرعة وطول الحزام.",
    ),
    pain: toLocaleRecord(
      "Drive changes fail when speed ratio or belt length is mis-specified.",
      "Devir oranı veya kayış uzunluğu hatalıysa tahrik değişimi başarısız olur.",
      "Antriebswechsel scheitern bei falscher Übersetzung oder Riemenlänge.",
      "Les changements d'entraînement échouent si ratio ou longueur est faux.",
      "Cambios de transmisión fallan con ratio o longitud incorrectos.",
      "تفشل تغييرات النقل عند خطأ النسبة أو الطول.",
    ),
    publicPromise: toLocaleRecord(
      "Size belt drives with pulley diameters and center distance in minutes.",
      "Kasnak çapları ve merkez mesafesiyle kayış tahrikini dakikalar içinde boyutlandırın.",
      "Dimensionieren Sie Riemenantriebe in Minuten.",
      "Dimensionnez courroies en minutes avec poulies et entraxe.",
      "Dimensiona correas en minutos con poleas y distancia.",
      "حدّد أحزمة النقل في دقائق.",
    ),
    internalSourceNote: "Strategic report tool 20 — belt pulley; partial live mapping.",
  },
  "sp-021": {
    shortDescription: toLocaleRecord(
      "Split quality cost into prevention, appraisal and failure categories (PAF).",
      "Kalite maliyetini önleme, değerlendirme ve hata (PAF) kalemlerine ayırın.",
      "Teilen Sie Qualitätskosten in Prävention, Bewertung und Fehler (PAF).",
      "Répartissez coûts qualité en prévention, évaluation et échec (PAF).",
      "Separe costes de calidad en prevención, evaluación y fallo (PAF).",
      "قسّم تكلفة الجودة إلى PAF.",
    ),
    pain: toLocaleRecord(
      "External failure cost is rarely tracked even though it dominates quality spend.",
      "Dış hata maliyeti nadiren izlenir oysa kalite harcamasını domine eder.",
      "Externe Fehlerkosten werden selten erfasst obwohl dominant.",
      "Le coût d'échec externe est rarement suivi.",
      "El coste de fallo externo rara vez se rastrea.",
      "نادرًا ما تُ tracked تكاليف الفشل الخارجي.",
    ),
    publicPromise: toLocaleRecord(
      "Visualize PAF mix to prioritize prevention budget with evidence.",
      "PAF dağılımını görerek önleme bütçesini kanıtla önceliklendirin.",
      "Visualisieren Sie PAF-Mix für Präventionsbudget mit Beleg.",
      "Visualisez le mix PAF pour prioriser prévention.",
      "Visualice mix PAF para priorizar prevención.",
      "اعرض mix PAF ل prioritize الميزانية.",
    ),
    internalSourceNote: "Strategic report tool 21 — quality PAF; planned.",
  },
  "sp-022": {
    shortDescription: toLocaleRecord(
      "Estimate minimum wall thickness for common pressure vessel geometries.",
      "Yaygın basınçlı kap geometrileri için minimum cidar kalınlığını tahmin edin.",
      "Schätzen Sie Mindestwanddicke für gängige Druckbehältergeometrien.",
      "Estimez épaisseur paroi minimale pour géométries courantes.",
      "Estime espesor mínimo de pared para geometrías comunes.",
      "قدّر最小 سمك الجدار للأشكال الشائعة.",
    ),
    pain: toLocaleRecord(
      "Fabricators risk unsafe tanks when thickness rules are applied from memory.",
      "Cidar kalınlığı hafızadan uygulanırsa güvensiz tank riski artar.",
      "Falscher Wanddicken-Gedächtniswert riskiert unsichere Behälter.",
      "L'épaisseur de mémoire risque des cuves dangereuses.",
      "Espesor de memoria arriesga tanques inseguros.",
      "تطبيق السمك من الذاكرة يخاطر بالسلامة.",
    ),
    publicPromise: toLocaleRecord(
      "Screen cylindrical and spherical vessels with material and safety inputs.",
      "Malzeme ve emniyet girdileriyle silindirik ve küresel kapları tarayın.",
      "Prüfen Sie Zylinder- und Kugelbehälter mit Material und Sicherheit.",
      "Filtrez cuves cylindriques et sphériques avec matériau et sécurité.",
      "Evalúe vasijas cilíndricas y esféricas con material y seguridad.",
      "افحص الأوعية الأسطوانية والكروية.",
    ),
    internalSourceNote: "Strategic report tool 22 — pressure vessel; planned.",
  },
  "sp-023": {
    shortDescription: toLocaleRecord(
      "Build current-state value-stream map metrics for lean workshops.",
      "Yalın atölyeler için mevcut durum değer akış haritası metriklerini oluşturun.",
      "Erstellen Sie Ist-Zustand-VSM-Metriken für Lean-Workshops.",
      "Construisez métriques VSM état actuel pour ateliers lean.",
      "Construya métricas VSM estado actual para talleres lean.",
      "أنشئ مقاييس VSM للحالة الحالية.",
    ),
    pain: toLocaleRecord(
      "VSM work stays on whiteboards and cannot be compared week to week.",
      "VSM çalışması tahtada kalır; haftalık karşılaştırılamaz.",
      "VSM bleibt am Whiteboard ohne Wochenvergleich.",
      "Le VSM reste au tableau sans comparaison hebdomadaire.",
      "VSM permanece en pizarra sin comparación semanal.",
      "VSM يبقى على السبورة دون مقارنة.",
    ),
    publicPromise: toLocaleRecord(
      "Capture value-added ratio and lead time in a repeatable digital template.",
      "Katma değer oranı ve lead time'ı tekrarlanabilir dijital şablonda kaydedin.",
      "Erfassen Sie VA-Ratio und Durchlaufzeit in digitaler Vorlage.",
      "Capturez ratio VA et lead time dans modèle digital.",
      "Capture ratio VA y lead time en plantilla digital.",
      "سجّل نسبة القيمة المضافة وlead time.",
    ),
    internalSourceNote: "Strategic report tool 23 — VSM; planned.",
  },
};

function premiumTitle(item, locale) {
  const titles = {
    "sp-001": toLocaleRecord(
      "Quote Price and Profit Margin Calculator",
      "Teklif Fiyatı ve Kâr Marjı Hesaplayıcı",
      "Angebotspreis- und Gewinnmargen-Rechner",
      "Calculateur de prix de devis et marge bénéficiaire",
      "Calculadora de precio de cotización y margen de beneficio",
      "حاسبة سعر العرض وهامش الربح",
    ),
    "sp-002": toLocaleRecord(
      "Machine Hour Rate Calculator",
      "Makine Saat Ücreti Hesaplayıcı",
      "Maschinenstundensatz-Rechner",
      "Calculateur de taux horaire machine",
      "Calculadora de tarifa horaria de máquina",
      "حاسبة أجر الساعة للآلة",
    ),
    "sp-003": toLocaleRecord(
      "Break-Even and Safety Margin Calculator",
      "Başabaş Noktası ve Güvenlik Marjı Hesaplayıcı",
      "Break-even- und Sicherheitsmargen-Rechner",
      "Calculateur de seuil de rentabilité et marge de sécurité",
      "Calculadora de punto de equilibrio y margen de seguridad",
      "حاسبة نقطة التعادل وهامش الأمان",
    ),
    "sp-004": toLocaleRecord(
      "Auto Repair Parts and Labor Quote Calculator",
      "Tamirhane Parça ve İşçilik Teklif Hesaplayıcı",
      "Kfz-Teile- und Arbeitsangebots-Rechner",
      "Calculateur de devis pièces et main-d'œuvre garage",
      "Calculadora de cotización de piezas y mano de obra de taller",
      "حاسبة عرض قطع الغيار والعمالة للإصلاح",
    ),
    "sp-005": toLocaleRecord(
      "CBAM Unit Product Carbon Footprint Calculator",
      "SKDM Birim Ürün Karbon Ayak İzi Hesaplayıcı",
      "CBAM-Produkt-CO₂-Fußabdruck-Rechner",
      "Calculateur d'empreinte carbone unitaire CBAM",
      "Calculadora de huella de carbono unitaria CBAM",
      "حاسبة البصمة الكarbonية للوحدة CBAM",
    ),
    "sp-006": toLocaleRecord(
      "OEE Calculator",
      "OEE Hesaplayıcı",
      "OEE-Rechner",
      "Calculateur OEE",
      "Calculadora OEE",
      "حاسبة OEE",
    ),
    "sp-007": toLocaleRecord(
      "Compressor Leak Cost Calculator",
      "Kompresör Kaçağı Maliyet Hesaplayıcı",
      "Kompressor-Leckkosten-Rechner",
      "Calculateur de coût de fuite compresseur",
      "Calculadora de coste de fuga de compresor",
      "حاسبة تكلفة تسرب الضاغط",
    ),
    "sp-008": toLocaleRecord(
      "Employee Total Cost Calculator",
      "Personel Tam Maliyet Hesaplayıcı",
      "Personalkosten-Gesamtrechner",
      "Calculateur de coût total employé",
      "Calculadora de coste total del empleado",
      "حاسبة التكلفة الكاملة للموظف",
    ),
    "sp-009": toLocaleRecord(
      "Downtime Minute Cost Calculator",
      "Duruş Dakika Maliyeti Hesaplayıcı",
      "Stillstandsminutenkosten-Rechner",
      "Calculateur de coût minute d'arrêt",
      "Calculadora de coste por minuto de parada",
      "حاسبة تكلفة دقيقة التوقف",
    ),
    "sp-010": toLocaleRecord(
      "Product and Customer Profitability Calculator",
      "Ürün ve Müşteri Kârlılığı Hesaplayıcı",
      "Produkt- und Kundenrentabilitäts-Rechner",
      "Calculateur de rentabilité produit et client",
      "Calculadora de rentabilidad de producto y cliente",
      "حاسبة ربحية المنتج والعميل",
    ),
    "sp-011": toLocaleRecord(
      "Inventory Carrying Cost and EOQ Calculator",
      "Stok Taşıma Maliyeti ve EOQ Hesaplayıcı",
      "Lagerhaltungs- und EOQ-Rechner",
      "Calculateur de coût de stockage et EOQ",
      "Calculadora de coste de inventario y EOQ",
      "حاسبة تكلفة حمل المخzón وEOQ",
    ),
    "sp-012": toLocaleRecord(
      "Welded and Bolted Connection Calculator",
      "Kaynaklı ve Bulonlu Bağlantı Hesaplayıcı",
      "Schweiß- und Bolzenverbindungs-Rechner",
      "Calculateur de connexion soudée et boulonnée",
      "Calculadora de conexión soldada y atornillada",
      "حاسبة الوصلات الملحومة والم bolted",
    ),
    "sp-013": toLocaleRecord(
      "Tolerance Stack-Up Calculator",
      "Tolerans Yığılma Hesaplayıcı",
      "Toleranzstack-up-Rechner",
      "Calculateur d'empilement de tolérances",
      "Calculadora de acumulación de tolerancias",
      "حاسبة تراكم التسامح",
    ),
    "sp-014": toLocaleRecord(
      "Bolt Tightening Torque Calculator",
      "Civata Sıkma Torku Hesaplayıcı",
      "Anzugsdrehmoment-Rechner",
      "Calculateur de couple de serrage",
      "Calculadora de par de apriete",
      "حاسبة عزم شد البرغي",
    ),
    "sp-015": toLocaleRecord(
      "Energy Savings Calculator",
      "Enerji Tasarruf Hesaplayıcı",
      "Energiespar-Rechner",
      "Calculateur d'économies d'énergie",
      "Calculadora de ahorro energético",
      "حاسبة توفير الطاقة",
    ),
    "sp-016": toLocaleRecord(
      "Investment Payback and NPV Calculator",
      "Yatırım Geri Dönüş ve NPV Hesaplayıcı",
      "Investitions-Amortisations- und NPV-Rechner",
      "Calculateur de retour sur investissement et VAN",
      "Calculadora de retorno de inversión y VAN",
      "حاسبة استرداد الاستثمار وNPV",
    ),
    "sp-017": toLocaleRecord(
      "Fire System Flow and Hydrant Calculator",
      "Yangın Tesisatı Debi ve Hidrant Hesaplayıcı",
      "Brandanlagen-Durchfluss- und Hydranten-Rechner",
      "Calculateur de débit incendie et hydrants",
      "Calculadora de caudal contra incendios e hidrantes",
      "حاسبة تدفق نظام الإطفاء والhydrants",
    ),
    "sp-018": toLocaleRecord(
      "Annual Leave, Severance and Notice Calculator",
      "Yıllık İzin, Kıdem ve İhbar Tazminatı Hesaplayıcı",
      "Urlaubs-, Abfindungs- und Kündigungsfrist-Rechner",
      "Calculateur congés, indemnités et préavis",
      "Calculadora de vacaciones, indemnización y preaviso",
      "حاسبة الإجازة والمكافأة والإشعار",
    ),
    "sp-019": toLocaleRecord(
      "Hydraulic and Pneumatic Cylinder Force Calculator",
      "Hidrolik ve Pnömatik Silindir Kuvvet Hesaplayıcı",
      "Hydraulik-/Pneumatikzylinder-Kraft-Rechner",
      "Calculateur de force vérin hydraulique/pneumatique",
      "Calculadora de fuerza de cilindro hidráulico/neumático",
      "حاسبة قوة الأسطوانة الهيدraulique/ال neumática",
    ),
    "sp-020": toLocaleRecord(
      "Belt Pulley Speed and Length Calculator",
      "Kayış Kasnak Devir ve Uzunluk Hesaplayıcı",
      "Riemenscheiben-Drehzahl- und Längen-Rechner",
      "Calculateur vitesse et longueur courroie/poulie",
      "Calculadora de velocidad y longitud de correa/polea",
      "حاسبة سرعة وطول الحزام/البكرة",
    ),
    "sp-021": toLocaleRecord(
      "Quality Cost PAF Calculator",
      "Kalite Maliyeti PAF Hesaplayıcı",
      "Qualitätskosten-PAF-Rechner",
      "Calculateur coûts qualité PAF",
      "Calculadora de coste de calidad PAF",
      "حاسبة تكلفة الجودة PAF",
    ),
    "sp-022": toLocaleRecord(
      "Pressure Vessel Wall Thickness Calculator",
      "Basınçlı Kap Cidar Kalınlığı Hesaplayıcı",
      "Druckbehälter-Wanddicken-Rechner",
      "Calculateur d'épaisseur paroi récipient pression",
      "Calculadora de espesor de pared de recipiente a presión",
      "حاسبة سمك جدار الوعاء المضغوط",
    ),
    "sp-023": toLocaleRecord(
      "Value Stream Map VSM Calculator",
      "Değer Akış Haritası VSM Hesaplayıcı",
      "Value-Stream-Map-VSM-Rechner",
      "Calculateur VSM carte de flux de valeur",
      "Calculadora VSM mapa de flujo de valor",
      "حاسبة VSM خريطة تدفق القيمة",
    ),
  };
  return titles[item.id][locale];
}

function buildPremiumItems() {
  return SOURCE.premium.map((item) => {
    const copy = PREMIUM_COPY[item.id];
    const record = {
      id: item.id,
      slug: item.slug,
      phase: item.phase,
      score: item.score,
      status: item.status,
      categoryId: item.categoryId,
      title: {},
      shortDescription: copy.shortDescription,
      pain: copy.pain,
      publicPromise: copy.publicPromise,
      internalSourceNote: copy.internalSourceNote,
    };
    for (const locale of LOCALES) {
      record.title[locale] = premiumTitle(item, locale);
    }
    if (item.mappedLiveSlug) {
      record.mappedLiveSlug = item.mappedLiveSlug;
    }
    return record;
  });
}

function buildFreeItems() {
  const catMap = Object.fromEntries(SOURCE.categories.map((c) => [c.id, c]));
  return SOURCE.free.map((item) => {
    const cat = catMap[item.categoryId];
    const categoryName = toLocaleRecord(cat.en, cat.tr, cat.de, cat.fr, cat.es, cat.ar);
    const title = {};
    const targetAudience = {};
    for (const locale of LOCALES) {
      title[locale] = translateTitle(item.enTitle, locale);
      if (locale === "tr") title[locale] = item.trTitle;
      if (locale === "en") title[locale] = item.enTitle;
      targetAudience[locale] = translateAudience(item.enAudience, item.trAudience, locale);
    }
    const record = {
      id: item.id,
      slug: item.slug,
      categoryId: item.categoryId,
      categoryName,
      title,
      targetAudience,
      trafficPotential: item.trafficPotential,
      status: item.status,
    };
    if (item.mappedLiveSlug) record.mappedLiveSlug = item.mappedLiveSlug;
    return record;
  });
}

function serializeTs(typeExports, constName, items, itemType) {
  return `/**
 * Strategic roadmap data — generated by scripts/generate-strategic-roadmap-data.mjs
 * Do not edit manually; regenerate from scripts/data/strategic-roadmap-source.json
 */

export type Locale = "en" | "tr" | "de" | "fr" | "es" | "ar";

${typeExports}

export const ${constName}: readonly ${itemType}[] = ${JSON.stringify(items, null, 2)} as const;
`;
}

const premiumItems = buildPremiumItems();
const freeItems = buildFreeItems();

writeFileSync(
  join(ROOT, "src/data/strategic-premium-calculators.ts"),
  serializeTs(
    `export type RoadmapStatus = "live" | "beta" | "planned";

export type StrategicPremiumCalculator = {
  id: string;
  slug: string;
  phase: 1 | 2 | 3 | 4;
  score: number;
  status: RoadmapStatus;
  categoryId: string;
  title: Record<Locale, string>;
  shortDescription: Record<Locale, string>;
  pain: Record<Locale, string>;
  publicPromise: Record<Locale, string>;
  internalSourceNote: string;
  mappedLiveSlug?: string;
};`,
    "STRATEGIC_PREMIUM_CALCULATORS",
    premiumItems,
    "StrategicPremiumCalculator",
  ),
);

writeFileSync(
  join(ROOT, "src/data/free-traffic-tool-roadmap.ts"),
  serializeTs(
    `export type TrafficPotential = "very-high" | "high" | "medium" | "low";

export type FreeTrafficToolRoadmapItem = {
  id: string;
  slug: string;
  categoryId: string;
  categoryName: Record<Locale, string>;
  title: Record<Locale, string>;
  targetAudience: Record<Locale, string>;
  trafficPotential: TrafficPotential;
  status: "live" | "planned";
  mappedLiveSlug?: string;
};`,
    "FREE_TRAFFIC_TOOL_ROADMAP",
    freeItems,
    "FreeTrafficToolRoadmapItem",
  ),
);

console.log(`Generated premium=${premiumItems.length}, free=${freeItems.length}`);
