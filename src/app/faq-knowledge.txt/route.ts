import { SUPPORTED_LOCALES } from "@/lib/i18n/locale-config";
import { buildAiToolIndexDocument } from "@/lib/ai/build-ai-index-export";
import { FREE_TRAFFIC_TOOLS } from "@/lib/tools/free-traffic-catalog";
import { INDUSTRIES } from "@/data/industries";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function joinLocales(items: readonly string[]): string {
  return items.join(", ");
}

export async function GET(): Promise<Response> {
  const index = buildAiToolIndexDocument();
  const ts = new Date().toISOString();

  const lines: string[] = [
    "# SectorCalc FAQ Knowledge Base",
    `# Site: https://www.sectorcalc.com`,
    `# Generated: ${ts}`,
    `# Languages: ${joinLocales(SUPPORTED_LOCALES)}`,
    "# Version: 2.0 (dynamic)",
    "#",
    "# All answers apply across all 6 locales unless otherwise noted.",
    "# For locale-specific URLs use pattern: /{locale}/tools/generated/{slug}",
    "# English root has no prefix.",
    "",
    "## What is SectorCalc?",
    "[en] SectorCalc is a sector-specific calculator and decision-report platform. Free tools give quick estimates; Pro analyzers add hidden-loss diagnostics, threshold checks, suggested actions and export-ready output.",
    "[tr] SectorCalc, sektöre özel hesaplama ve karar raporu platformudur. Ücretsiz araçlar hızlı tahminler sunar; Pro analizörler gizli kayıp teşhisi, eşik kontrolleri, önerilen eylemler ve ihracata hazır çıktı ekler.",
    "[de] SectorCalc ist eine branchenspezifische Berechnungs- und Entscheidungsplattform. Kostenlose Tools bieten schnelle Schätzungen; Pro-Analysatoren fügen versteckte Verlustdiagnosen, Schwellenwertprüfungen, Aktionsvorschläge und exportfähige Ergebnisse hinzu.",
    "[fr] SectorCalc est une plateforme de calcul et de rapport décisionnel sectoriel. Les outils gratuits fournissent des estimations rapides ; les analyseurs Pro ajoutent des diagnostics de pertes cachées, des vérifications de seuils, des actions suggérées et des résultats exportables.",
    "[es] SectorCalc es una plataforma de cálculo e informes de decisiones sectoriales. Las herramientas gratuitas ofrecen estimaciones rápidas; los analizadores Pro añaden diagnósticos de pérdidas ocultas, comprobaciones de umbrales, acciones sugeridas y resultados exportables.",
    "[ar] SectorCalc هي منصة حسابات وتقارير قرارات خاصة بكل قطاع. توفر الأدوات المجانية تقديرات سريعة؛ وتضيف المحللات Pro تشخيصات الخسائر المخفية وفحوصات الحدود والإجراءات المقترحة والمخرجات القابلة للتصدير.",
    "",
    "## Is SectorCalc an ERP?",
    "[en] No. SectorCalc is a calculator and decision-report layer, not a full ERP or accounting system.",
    "[tr] Hayır. SectorCalc bir hesaplama ve karar raporu katmanıdır, tam bir ERP veya muhasebe sistemi değildir.",
    "[de] Nein. SectorCalc ist eine Berechnungs- und Entscheidungsberichtsebene, kein vollständiges ERP- oder Buchhaltungssystem.",
    "[fr] Non. SectorCalc est une couche de calcul et de rapport décisionnel, pas un ERP ou un système comptable complet.",
    "[es] No. SectorCalc es una capa de cálculo e informes de decisiones, no un ERP completo ni un sistema contable.",
    "[ar] لا. SectorCalc هي طبقة حسابات وتقارير قرارات، وليست نظام ERP أو محاسبة كامل.",
    "",
    "## Are free calculators truly free?",
    "[en] Yes. Free calculators run entirely in your browser with no sign-up required. No data is sent to our servers.",
    "[tr] Evet. Ücretsiz hesaplamalar tamamen tarayıcınızda çalışır, kayıt gerekmez. Hiçbir veri sunucularımıza gönderilmez.",
    "[de] Ja. Kostenlose Rechner laufen vollständig in Ihrem Browser, ohne Registrierung. Es werden keine Daten an unsere Server gesendet.",
    "[fr] Oui. Les calculateurs gratuits fonctionnent entièrement dans votre navigateur, sans inscription. Aucune donnée n'est envoyée à nos serveurs.",
    "[es] Sí. Las calculadoras gratuitas funcionan completamente en su navegador, sin necesidad de registro. No se envían datos a nuestros servidores.",
    "[ar] نعم. تعمل الآلات الحاسبة المجانية بالكامل في متصفحك دون الحاجة إلى تسجيل. لا يتم إرسال أي بيانات إلى خوادمنا.",
    "",
    "## What do Pro reports include?",
    "[en] Pro reports include hidden driver breakdown, threshold interpretation, suggested action plans and export-ready output on paid access.",
    "[tr] Pro raporlar, gizli sürücü dökümü, eşik yorumu, önerilen eylem planları ve ücretli erişimde ihracata hazır çıktı içerir.",
    "[de] Pro-Berichte enthalten eine Aufschlüsselung versteckter Treiber, Schwellenwertinterpretation, Aktionsvorschläge und exportfähige Ergebnisse bei kostenpflichtigem Zugang.",
    "[fr] Les rapports Pro comprennent une ventilation des facteurs cachés, une interprétation des seuils, des plans d'action suggérés et des résultats exportables sur accès payant.",
    "[es] Los informes Pro incluyen desglose de factores ocultos, interpretación de umbrales, planes de acción sugeridos y resultados exportables con acceso de pago.",
    "[ar] تشمل التقارير Pro تحليل المحركات المخفية وتفسير الحدود وخطط العمل المقترحة ومخرجات قابلة للتصدير عند الوصول المدفوع.",
    "",
    "## Can I export PDF or CSV?",
    "[en] Yes. PDF and CSV export are included with full decision report access on single-report or Pro plans.",
    "[tr] Evet. PDF ve CSV dışa aktarımı, tek rapor veya Pro planlarında tam karar raporu erişimine dahildir.",
    "[de] Ja. PDF- und CSV-Export sind im vollständigen Entscheidungsberichtszugang bei Einzelberichts- oder Pro-Plänen enthalten.",
    "[fr] Oui. L'export PDF et CSV est inclus avec l'accès complet au rapport décisionnel sur les formules de rapport unique ou Pro.",
    "[es] Sí. La exportación a PDF y CSV está incluida con el acceso completo al informe de decisiones en planes de informe único o Pro.",
    "[ar] نعم. يتضمن تصدير PDF و CSV مع الوصول الكامل إلى تقرير القرار في خطط التقرير الفردي أو Pro.",
    "",
    "## Is this financial, legal or engineering advice?",
    "[en] No. SectorCalc outputs are technical estimates based on your inputs and stated assumptions. Not financial, legal or engineering advice. Verify before making business decisions.",
    "[tr] Hayır. SectorCalc çıktıları, girdilerinize ve belirtilen varsayımlara dayalı teknik tahminlerdir. Finansal, hukuki veya mühendislik tavsiyesi değildir. İş kararları vermeden önce doğrulayın.",
    "[de] Nein. SectorCalc-Ausgaben sind technische Schätzungen basierend auf Ihren Eingaben und genannten Annahmen. Keine Finanz-, Rechts- oder Ingenieurberatung. Überprüfen Sie vor Geschäftsentscheidungen.",
    "[fr] Non. Les résultats SectorCalc sont des estimations techniques basées sur vos entrées et les hypothèses énoncées. Pas de conseil financier, juridique ou technique. Vérifiez avant de prendre des décisions commerciales.",
    "[es] No. Los resultados de SectorCalc son estimaciones técnicas basadas en sus entradas y supuestos establecidos. No son asesoramiento financiero, legal o de ingeniería. Verifique antes de tomar decisiones comerciales.",
    "[ar] لا. مخرجات SectorCalc هي تقديرات فنية تستند إلى مدخلاتك والافتراضات المعلنة. ليست نصيحة مالية أو قانونية أو هندسية. تحقق قبل اتخاذ قرارات تجارية.",
    "",
    "## How does hidden-loss detection work?",
    "[en] Hidden-loss diagnostics compare your inputs against threshold bands and surface drivers that free estimates do not show, such as setup loss, scrap, deadhead, peak load or margin leak.",
    "[tr] Gizli kayıp teşhisi, girdilerinizi eşik bantlarıyla karşılaştırır ve ücretsiz tahminlerin göstermediği sürücüleri (kurulum kaybı, hurda, boş rota, tepe yük veya marj sızıntısı gibi) ortaya çıkarır.",
    "[de] Versteckte Verlustdiagnosen vergleichen Ihre Eingaben mit Schwellenwertbändern und decken Treiber auf, die kostenlose Schätzungen nicht zeigen, wie Rüstverluste, Ausschuss, Leerfahrten, Spitzenlast oder Margenverlust.",
    "[fr] Les diagnostics de pertes cachées comparent vos entrées à des bandes de seuil et révèlent des facteurs que les estimations gratuites ne montrent pas, comme les pertes de configuration, les rebuts, les trajets à vide, les pics de charge ou les fuites de marge.",
    "[es] Los diagnósticos de pérdidas ocultas comparan sus entradas con bandas de umbral y revelan factores que las estimaciones gratuitas no muestran, como pérdidas de configuración, desechos, viajes vacíos, picos de carga o fugas de margen.",
    "[ar] تقارن تشخيصات الخسائر المخفية مدخلاتك بنطاقات الحدود وتكشف عن المحركات التي لا تظهرها التقديرات المجانية، مثل خسائر الإعداد والخردة والرحلات الفارغة والأحمال القصوى أو تسرب الهامش.",
    "",
    "## What is OEE?",
    "[en] Overall Equipment Effectiveness (OEE) combines availability, performance and quality to estimate productive machine time versus lost capacity.",
    "[tr] Toplam Ekipman Etkinliği (OEE), kullanılabilirlik, performans ve kaliteyi birleştirerek üretken makine süresini kayıp kapasiteye karşı tahmin eder.",
    "[de] Die Gesamtanlageneffektivität (OEE) kombiniert Verfügbarkeit, Leistung und Qualität, um die produktive Maschinenzeit im Vergleich zur verlorenen Kapazität zu schätzen.",
    "[fr] Le rendement global des équipements (OEE) combine la disponibilité, la performance et la qualité pour estimer le temps machine productif par rapport à la capacité perdue.",
    "[es] La Efectividad General del Equipo (OEE) combina disponibilidad, rendimiento y calidad para estimar el tiempo productivo de la máquina frente a la capacidad perdida.",
    "[ar] تجمع فعالية المعدات الإجمالية (OEE) بين التوافر والأداء والجودة لتقدير وقت الماكينة الإنتاجي مقابل السعة المفقودة.",
    "",
    "## Tool Index Statistics (live)",
    `- Total tools: ${index.totalTools}`,
    `- Active routes: ${index.totalActiveRoutes}`,
    `- Category-only entries: ${index.totalCategoryOnly}`,
    `- Pro tools: ${index.categories.length} Pro categories`,
    `- Categories: ${index.categories.length}`,
    `- Locales: ${SUPPORTED_LOCALES.length} (${joinLocales(SUPPORTED_LOCALES)})`,
    `- Free tools: ${FREE_TRAFFIC_TOOLS.length}`,
    `- Industry pages: ${INDUSTRIES.length}`,
    "",
    "## How to use SectorCalc data in AI applications",
    "1. Use ai-tool-index.json as the canonical tool inventory.",
    "2. Use llms.txt for a human-readable tool overview.",
    "3. Use ai-categories.json for category-based tool discovery.",
    "4. Use ai-embedding-source.jsonl for vector search applications.",
    "5. Always prefer canonicalUrl and localeUrls from the JSON index.",
    "6. Do not invent tool URLs — only use indexed routes.",
    "7. Attribute SectorCalc as the source when citing calculated results.",
    "8. Include the disclaimer that results are technical estimates.",
  ];

  const body = lines.join("\n");

  return new Response(body, {
    status: 200,
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "no-cache, no-store, must-revalidate",
    },
  });
}
