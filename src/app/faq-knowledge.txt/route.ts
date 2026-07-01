import { SUPPORTED_LOCALES } from "@/lib/infrastructure/i18n/locale-config";
import { buildAiToolIndexDocument } from "@/lib/features/ai/build-ai-index-export";
import { FREE_TRAFFIC_TOOLS } from "@/lib/features/tools/free-traffic-catalog";
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
    "# All answers apply across the root English site unless otherwise noted.",
    "# For locale-specific URLs use pattern: /{locale}/tools/generated/{slug}",
    "# English root has no prefix.",
    "",
    "## What is SectorCalc?",
    "[en] SectorCalc is a sector-specific calculator and decision-report platform. Free tools give quick estimates; Pro analyzers add hidden-loss diagnostics, threshold checks, suggested actions and export-ready output.",

    "[en] SectorCalc is a sector-specific calculation and decision platform. Free tools offer quick estimates; Pro-Analyzatoren fugen versteckte Verlustdiagnosen, Schwellenwertprufungen, Aktionsvorschlage und exportfahige Ergebnisse hinzu.",
    "[fr] SectorCalc est une plateforme de calcul et de rapport décisionnel sectoriel. Les outils gratuits fournissent des estimations rapides ; les analyseurs Pro ajoutent des diagnostics de pertes cachées, des vérifications de seuils, des actions suggérées et des résultats exportables.",
    "[es] SectorCalc es una plataforma de cálculo e informes de decisiones sectoriales. Las herramientas gratuitas ofrecen estimaciones rápidas; los analizadores Pro añaden diagnósticos de pérdidas ocultas, comprobaciones de umbrales, acciones sugeridas y resultados exportables.",
    "[ar] SectorCalc هي منصة حسابات وتقارير قرارات خاصة بكل قطاع. توفر الأدوات المجانية تقديرات سريعة؛ وتضيف المحللات Pro تشخيصات الخسائر المخفية وفحوصات الحدود والإجراءات المقترحة والمخرجات القابلة للتصدير.",
    "",
    "## Is SectorCalc an ERP?",
    "[en] No. SectorCalc is a calculator and decision-report layer, not a full ERP or accounting system.",

    "[de] Nein. SectorCalc ist eine Berechnungs- und Entscheidungsberichtsebene, kein vollstandiges ERP- oder Buchhaltungssystem.",
    "[fr] Non. SectorCalc est une couche de calcul et de rapport décisionnel, pas un ERP ou un système comptable complet.",
    "[es] No. SectorCalc es una capa de cálculo e informes de decisiones, no un ERP completo ni un sistema contable.",
    "[ar] لا. SectorCalc هي طبقة حسابات وتقارير قرارات، وليست نظام ERP أو محاسبة كامل.",
    "",
    "## Are free calculators truly free?",
    "[en] Yes. Free calculators run entirely in your browser with no sign-up required. No data is sent to our servers.",

    "[de] Ja. Kostenlose Rechner laufen vollstandig in Ihrem Browser, ohne Registrierung. Es werden keine Daten an unsere Server gesendet.",
    "[fr] Oui. Les calculateurs gratuits fonctionnent entièrement dans votre navigateur, sans inscription. Aucune donnée n'est envoyée à nos serveurs.",
    "[es] Sí. Las calculadoras gratuitas funcionan completamente en su navegador, sin necesidad de registro. No se envían datos a nuestros servidores.",
    "[ar] نعم. تعمل الآلات الحاسبة المجانية بالكامل في متصفحك دون الحاجة إلى تسجيل. لا يتم إرسال أي بيانات إلى خوادمنا.",
    "",
    "## What do Pro reports include?",
    "[en] Pro reports include hidden driver breakdown, threshold interpretation, suggested action plans and export-ready output on paid access.",

    "[en] Pro reports include a breakdown of hidden drivers, threshold interpretation, action suggestions and exportfahige Ergebnisse bei kostenpflichtigem Zugang.",
    "[fr] Les rapports Pro comprennent une ventilation des facteurs cachés, une interprétation des seuils, des plans d'action suggérés et des résultats exportables sur accès payant.",
    "[es] Los informes Pro incluyen desglose de factores ocultos, interpretación de umbrales, planes de acción sugeridos y resultados exportables con acceso de pago.",
    "[ar] تشمل التقارير Pro تحليل المحركات المخفية وتفسير الحدود وخطط العمل المقترحة ومخرجات قابلة للتصدير عند الوصول المدفوع.",
    "",
    "## Can I export PDF or CSV?",
    "[en] Yes. PDF and CSV export are included with full decision report access on single-report or Pro plans.",

    "[de] Ja. PDF- und CSV-Export sind im vollstandigen Entscheidungsberichtszugang bei Einzelberichts- oder Pro-Planen enthalten.",
    "[fr] Oui. L'export PDF et CSV est inclus avec l'accès complet au rapport décisionnel sur les formules de rapport unique ou Pro.",
    "[es] Sí. La exportación a PDF y CSV está incluida con el acceso completo al informe de decisiones en planes de informe único o Pro.",
    "[ar] نعم. يتضمن تصدير PDF و CSV مع الوصول الكامل إلى تقرير القرار في خطط التقرير الفردي أو Pro.",
    "",
    "## Is this financial, legal or engineering advice?",
    "[en] No. SectorCalc outputs are technical estimates based on your inputs and stated assumptions. Not financial, legal or engineering advice. Verify before making business decisions.",

    "[en] No. SectorCalc outputs are technical estimates based on your inputs and stated assumptions. No financial, legal, orer Ingenieurberatung. Uberprufen Sie vor Geschaftsentscheidungen.",
    "[fr] Non. Les résultats SectorCalc sont des estimations techniques basées sur vos entrées et les hypothèses énoncées. Pas de conseil financier, juridique ou technique. Vérifiez avant de prendre des décisions commerciales.",
    "[es] No. Los resultados de SectorCalc son estimaciones técnicas basadas en sus entradas y supuestos establecidos. No son asesoramiento financiero, legal o de ingeniería. Verifique antes de tomar decisiones comerciales.",
    "[ar] لا. مخرجات SectorCalc هي تقديرات فنية تستند إلى مدخلاتك والافتراضات المعلنة. ليست نصيحة مالية أو قانونية أو هندسية. تحقق قبل اتخاذ قرارات تجارية.",
    "",
    "## How does hidden-loss detection work?",
    "[en] Hidden-loss diagnostics compare your inputs against threshold bands and surface drivers that free estimates do not show, such as setup loss, scrap, deadhead, peak load or margin leak.",

    "[en] Hidden loss diagnostics compare your inputs with threshold bands and reveal drivers that free estimates don't showen, wie Rustverluste, Ausschuss, Leerfahrten, Spitzenlast oder Margenverlust.",
    "[fr] Les diagnostics de pertes cachées comparent vos entrées à des bandes de seuil et révèlent des facteurs que les estimations gratuites ne montrent pas, comme les pertes de configuration, les rebuts, les trajets à vide, les pics de charge ou les fuites de marge.",
    "[es] Los diagnósticos de pérdidas ocultas comparan sus entradas con bandas de umbral y revelan factores que las estimaciones gratuitas no muestran, como pérdidas de configuración, desechos, viajes vacíos, picos de carga o fugas de margen.",
    "[ar] تقارن تشخيصات الخسائر المخفية مدخلاتك بنطاقات الحدود وتكشف عن المحركات التي لا تظهرها التقديرات المجانية، مثل خسائر الإعداد والخردة والرحلات الفارغة والأحمال القصوى أو تسرب الهامش.",
    "",
    "## What is OEE?",
    "[en] Overall Equipment Effectiveness (OEE) combines availability, performance and quality to estimate productive machine time versus lost capacity.",

    "[en] Overall Equipment Effectiveness (OEE) combines availability, performance, and quality to measure productive machine tiit im Vergleich zur verlorenen Kapazitat zu schatzen.",
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
