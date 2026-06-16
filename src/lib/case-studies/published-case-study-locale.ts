import type { SupportedLocale } from "@/lib/i18n/locale-config";
import { SUPPORTED_LOCALES } from "@/lib/i18n/locale-config";
import { publishedCaseStudyBase } from "@/lib/case-studies/data";
import type {
  CaseStudy,
  PublishedCaseStudyLocaleContent,
} from "@/lib/case-studies/types";

type LocaleContentMap = Readonly<
  Record<(typeof publishedCaseStudyBase)[number]["slug"], Readonly<Record<SupportedLocale, PublishedCaseStudyLocaleContent>>>
>;

const CONTENT: LocaleContentMap = {
  "muller-prazision-5s-optimization": {
    en: {
      title: "Müller Präzision GmbH: 5S audit score 38→87, €1.232M efficiency gain in 5 months",
      subtitle: "5S productivity breakthrough: €1.2M cash gain in five months without CAPEX",
      industry: "Automotive supply chain (precision CNC parts)",
      challenge:
        "At the Stuttgart plant, a Q4 2025 internal audit scored 5S at 38/100; bench search time averaged 14 min/shift, unplanned downtime was 14.2%, and scrap cost ran €187,000/month.\n\nHidden inefficiency cost:\n500 employees × 22 days × 8 hours × 12% time loss = 10,560 hours/month\nFully loaded hourly cost (German automotive, IG Metall scale): €35/hour\nMonthly cash-flow loss: €369,600",
      solution:
        "SectorCalc Trust Trace™ 5S Audit & Efficiency Loss Cost Converter module was deployed.\n\nImplementation standards:\n- DIN EN ISO 9001:2015 Clause 7.1.4 (Process environment)\n- VDI 2067 Part 3.2 (Economic production evaluation)\n- JIPM TPM Seiri-Seiton-Seiso-Seiketsu-Shitsuke audit protocol\n- Sector: Automotive supply chain, IATF 16949 aligned.",
      results: [
        { metric: "5S audit score", before: "38/100", after: "87/100" },
        { metric: "Scrap rate", before: "8.2%", after: "3.1%" },
        { metric: "Unplanned downtime", before: "14.2%", after: "5.8%" },
        { metric: "Bench search time", before: "14 min/shift", after: "3.2 min/shift" },
        { metric: "Monthly efficiency loss", before: "€369,600", after: "€123,200" },
      ],
      testimonial: {
        quote:
          "SectorCalc's cost converter model turned 5S from a cleaning project into a cash-flow line item on the CFO report. €1.2M in five months — in our pocket with process discipline alone, without any CAPEX.",
        author: "Klaus Weber",
        title: "COO / Plant Director",
        company: "Müller Präzision GmbH",
      },
    },
    tr: {
      title: "Müller Präzision GmbH: 5S Denetim Skoru 38→87, 5 Ayda 1.232.000€ Verimlilik Kazancı",
      subtitle: "5S ile verimlilikte devrim: 5 ayda 1.2 milyon euro nakit kazanç",
      industry: "Otomotiv Yan Sanayi (CNC hassas parça)",
      challenge:
        "Stuttgart tesisinde 2025 Q4 iç denetiminde 5S skoru 38/100 olarak ölçüldü; tezgâh başı arama süresi ortalama 14 dk/shift, plansız duruş (downtime) oranı %14.2, hurda/fire maliyeti aylık 187.000€ seviyesindeydi.\n\nVerimsizlik kaynaklı gizli maliyet:\n500 çalışan × 22 gün × 8 saat × %12 zaman kaybı = 10.560 saat/ay\nSaatlik tam yük maliyeti (Almanya otomotiv, IG Metall tarifesi): 35€/saat\nAylık nakit akışı kaybı: 369.600€",
      solution:
        "SectorCalc Trust Trace™ 5S Denetim & Verimlilik Kaybı Maliyet Dönüştürücü modülü devreye alındı.\n\nUygulama standartları:\n- DIN EN ISO 9001:2015 Madde 7.1.4 (Proses ortamı)\n- VDI 2067 Madde 3.2 (Ekonomik üretim değerlendirme)\n- JIPM TPM Seiri-Seiton-Seiso-Seiketsu-Shitsuke audit protokolü\n- Sektör: Otomotiv tedarik zinciri, IATF 16949 uyumlu.",
      results: [
        { metric: "5S Denetim Skoru", before: "38/100", after: "87/100" },
        { metric: "Hurda / Fire Oranı", before: "%8.2", after: "%3.1" },
        { metric: "Plansız Downtime", before: "%14.2", after: "%5.8" },
        { metric: "Tezgâh Başı Arama Süresi", before: "14 dk/shift", after: "3.2 dk/shift" },
        { metric: "Aylık Verimlilik Kaybı", before: "369.600€", after: "123.200€" },
      ],
      testimonial: {
        quote:
          "SectorCalc'ın maliyet dönüştürücü modeli bize 5S'i \"temizlik projesi\" olmaktan çıkarıp CFO raporuna giren bir nakit akışı kalemine dönüştürdü. 5 ayda 1.2 milyon euro, herhangi bir CAPEX yatırımı yapmadan, sadece proses disipliniyle cebimize kaldı.",
        author: "Klaus Weber",
        title: "COO / Plant Director",
        company: "Müller Präzision GmbH",
      },
    },
    de: {
      title: "Müller Präzision GmbH: 5S-Audit 38→87, 1,232 Mio. € Effizienzgewinn in 5 Monaten",
      subtitle: "5S-Produktivitätssprung: 1,2 Mio. € Cash-Gewinn in fünf Monaten ohne CAPEX",
      industry: "Automobilzulieferer (Präzisions-CNC-Teile)",
      challenge:
        "Im Werk Stuttgart ergab das Q4-2025-Internaudit einen 5S-Score von 38/100; die Suchzeit am Arbeitsplatz lag bei 14 Min./Schicht, ungeplante Stillstände bei 14,2 %, Ausschusskosten bei 187.000 €/Monat.\n\nVersteckte Ineffizienzkosten:\n500 Mitarbeitende × 22 Tage × 8 Stunden × 12 % Zeitverlust = 10.560 Stunden/Monat\nVollkosten pro Stunde (Automotive DE, IG Metall): 35 €/Stunde\nMonatlicher Cashflow-Verlust: 369.600 €",
      solution:
        "Das SectorCalc Trust Trace™ 5S-Audit- & Effizienzverlust-Kostenkonverter-Modul wurde eingeführt.\n\nUmsetzungsstandards:\n- DIN EN ISO 9001:2015 Abschnitt 7.1.4 (Prozessumgebung)\n- VDI 2067 Blatt 3.2 (Wirtschaftliche Produktionsbewertung)\n- JIPM-TPM-Seiri-Seiton-Seiso-Seiketsu-Shitsuke-Auditprotokoll\n- Branche: Automobil-Lieferkette, IATF 16949 ausgerichtet",
      results: [
        { metric: "5S-Audit-Score", before: "38/100", after: "87/100" },
        { metric: "Ausschussquote", before: "8,2 %", after: "3,1 %" },
        { metric: "Ungeplante Stillstände", before: "14,2 %", after: "5,8 %" },
        { metric: "Suchzeit am Arbeitsplatz", before: "14 Min./Schicht", after: "3,2 Min./Schicht" },
        { metric: "Monatlicher Effizienzverlust", before: "369.600 €", after: "123.200 €" },
      ],
      testimonial: {
        quote:
          "SectorCalcs Kostenkonverter hat 5S von einem Reinigungsprojekt zu einer Cashflow-Position im CFO-Bericht gemacht. 1,2 Mio. € in fünf Monaten — ohne CAPEX, nur durch Prozessdisziplin.",
        author: "Klaus Weber",
        title: "COO / Werksleiter",
        company: "Müller Präzision GmbH",
      },
    },
    fr: {
      title: "Müller Präzision GmbH : score 5S 38→87, 1,232 M€ de gain d'efficacité en 5 mois",
      subtitle: "Percée 5S : 1,2 M€ de trésorerie gagnée en cinq mois sans CAPEX",
      industry: "Équipementier automobile (pièces CNC de précision)",
      challenge:
        "À l'usine de Stuttgart, l'audit interne T4 2025 a mesuré un score 5S de 38/100 ; temps de recherche au poste 14 min/équipe, arrêts non planifiés 14,2 %, coût rebut 187 000 €/mois.\n\nCoût caché d'inefficacité :\n500 employés × 22 jours × 8 h × 12 % perte de temps = 10 560 h/mois\nCoût horaire chargé (automobile DE, échelle IG Metall) : 35 €/h\nPerte de trésorerie mensuelle : 369 600 €",
      solution:
        "Déploiement du module SectorCalc Trust Trace™ Audit 5S & convertisseur de coût de perte d'efficacité.\n\nStandards appliqués :\n- DIN EN ISO 9001:2015 Article 7.1.4 (Environnement de processus)\n- VDI 2067 Partie 3.2 (Évaluation économique de production)\n- Protocole d'audit JIPM TPM Seiri-Seiton-Seiso-Seiketsu-Shitsuke\n- Secteur : chaîne d'approvisionnement automobile, aligné IATF 16949",
      results: [
        { metric: "Score audit 5S", before: "38/100", after: "87/100" },
        { metric: "Taux de rebut", before: "8,2 %", after: "3,1 %" },
        { metric: "Arrêts non planifiés", before: "14,2 %", after: "5,8 %" },
        { metric: "Temps de recherche au poste", before: "14 min/équipe", after: "3,2 min/équipe" },
        { metric: "Perte d'efficacité mensuelle", before: "369 600 €", after: "123 200 €" },
      ],
      testimonial: {
        quote:
          "Le modèle convertisseur de SectorCalc a transformé le 5S en ligne de trésorerie au rapport CFO. 1,2 M€ en cinq mois — sans CAPEX, par discipline de processus seule.",
        author: "Klaus Weber",
        title: "COO / Directeur d'usine",
        company: "Müller Präzision GmbH",
      },
    },
    es: {
      title: "Müller Präzision GmbH: puntuación 5S 38→87, 1,232 M€ de ganancia de eficiencia en 5 meses",
      subtitle: "Avance 5S: 1,2 M€ en caja en cinco meses sin CAPEX",
      industry: "Proveedor automotriz (piezas CNC de precisión)",
      challenge:
        "En la planta de Stuttgart, la auditoría interna Q4 2025 midió 5S en 38/100; búsqueda en puesto 14 min/turno, paradas no planificadas 14,2 %, coste de scrap 187.000 €/mes.\n\nCoste oculto por ineficiencia:\n500 empleados × 22 días × 8 h × 12 % pérdida de tiempo = 10.560 h/mes\nCoste horario cargado (automoción DE, escala IG Metall): 35 €/h\nPérdida de caja mensual: 369.600 €",
      solution:
        "Se desplegó el módulo SectorCalc Trust Trace™ Auditoría 5S y convertidor de coste de pérdida de eficiencia.\n\nEstándares aplicados:\n- DIN EN ISO 9001:2015 Cláusula 7.1.4 (Entorno de proceso)\n- VDI 2067 Parte 3.2 (Evaluación económica de producción)\n- Protocolo de auditoría JIPM TPM Seiri-Seiton-Seiso-Seiketsu-Shitsuke\n- Sector: cadena de suministro automotriz, alineado IATF 16949",
      results: [
        { metric: "Puntuación auditoría 5S", before: "38/100", after: "87/100" },
        { metric: "Tasa de scrap", before: "8,2 %", after: "3,1 %" },
        { metric: "Paradas no planificadas", before: "14,2 %", after: "5,8 %" },
        { metric: "Tiempo de búsqueda en puesto", before: "14 min/turno", after: "3,2 min/turno" },
        { metric: "Pérdida mensual de eficiencia", before: "369.600 €", after: "123.200 €" },
      ],
      testimonial: {
        quote:
          "El convertidor de costes de SectorCalc convirtió el 5S de un proyecto de limpieza en una partida de caja en el informe del CFO. 1,2 M€ en cinco meses — sin CAPEX, solo disciplina de proceso.",
        author: "Klaus Weber",
        title: "COO / Director de planta",
        company: "Müller Präzision GmbH",
      },
    },
    ar: {
      title: "Müller Präzision GmbH: درجة تدقيق 5S من 38→87، 1.232 مليون € كسب كفاءة في 5 أشهر",
      subtitle: "قفزة إنتاجية 5S: 1.2 مليون € نقداً في خمسة أشهر دون CAPEX",
      industry: "سلسلة توريد السيارات (قطع CNC دقيقة)",
      challenge:
        "في مصنع Stuttgart، قياس التدقيق الداخلي Q4 2025 درجة 5S عند 38/100؛ وقت البحث عند المقعد 14 د/وردية، توقف غير مخطط 14.2%، تكلفة الهدر 187,000 €/شهر.\n\nتكلفة خفية للانخفاض:\n500 موظف × 22 يوم × 8 س × 12% فقد وقت = 10,560 س/شهر\nتكلفة ساعية كاملة (سيارات ألمانيا، IG Metall): 35 €/س\nفقد تدفق نقدي شهري: 369,600 €",
      solution:
        "تم نشر وحدة SectorCalc Trust Trace™ تدقيق 5S ومحوّل تكلفة فقد الكفاءة.\n\nمعايير التطبيق:\n- DIN EN ISO 9001:2015 البند 7.1.4 (بيئة العملية)\n- VDI 2067 الجزء 3.2 (تقييم الإنتاج الاقتصادي)\n- بروتوكول تدقيق JIPM TPM Seiri-Seiton-Seiso-Seiketsu-Shitsuke\n- القطاع: سلسلة توريد السيارات، متوافق IATF 16949",
      results: [
        { metric: "درجة تدقيق 5S", before: "38/100", after: "87/100" },
        { metric: "معدل الهدر", before: "8.2%", after: "3.1%" },
        { metric: "توقف غير مخطط", before: "14.2%", after: "5.8%" },
        { metric: "وقت البحث عند المقعد", before: "14 د/وردية", after: "3.2 د/وردية" },
        { metric: "فقد كفاءة شهري", before: "369,600 €", after: "123,200 €" },
      ],
      testimonial: {
        quote:
          "حوّل محوّل التكلفة من SectorCalc 5S من مشروع تنظيف إلى بند تدفق نقدي في تقرير CFO. 1.2 مليون € في خمسة أشهر — دون CAPEX، بانضباط العملية فقط.",
        author: "Klaus Weber",
        title: "COO / مدير المصنع",
        company: "Müller Präzision GmbH",
      },
    },
  },
  "cnc-oee-improvement": {
    en: {
      title: "CNC shop raised OEE from 18% to 61%",
      subtitle: "How unplanned downtime, setup time, and quality losses were reversed",
      industry: "Manufacturing / CNC machining",
      challenge:
        "A CNC job shop running 12 machines for batch production had an OEE of 18%. Unplanned downtime, long setups, and quality losses were eroding throughput — roughly 40 hours of unplanned stops each month.",
      solution:
        "SectorCalc OEE Downtime Calculator mapped stop categories. SMED Changeover Optimizer cut setup from 45 minutes to 12. Scrap rate dropped from 8% to 3% after rework buffers were priced into jobs.",
      results: [
        { metric: "OEE", before: "18%", after: "61%" },
        { metric: "Setup time", before: "45 min", after: "12 min" },
        { metric: "Scrap rate", before: "8%", after: "3%" },
        { metric: "Annual savings", before: "$0", after: "$85,000" },
      ],
      testimonial: {
        quote:
          "With SectorCalc we tripled shop-floor visibility. We now see which machine stopped and why within minutes.",
        author: "Ali Yilmaz",
        title: "Production Manager",
        company: "Izmir CNC Workshop",
      },
    },
    tr: {
      title: "CNC Atölyesi OEE'sini %18'den %61'e Çıkardı",
      subtitle: "Plansız duruşlar, setup süreleri ve kalite kayıpları nasıl tersine çevrildi?",
      industry: "Üretim / CNC İşleme",
      challenge:
        "İzmir merkezli bir CNC atölyesi, 12 makine ile seri üretim yapıyordu. OEE oranı %18 idi. Plansız duruşlar, setup süreleri ve kalite kayıpları üretimi vuruyordu. Her ay ortalama 40 saat plansız duruş yaşanıyordu.",
      solution:
        "SectorCalc OEE Duruş Hesaplayıcı ile duruş analizi yapıldı. SMED Changeover Optimizer ile setup süreleri 45 dakikadan 12 dakikaya indi. Fire oranı %8'den %3'e düştü.",
      results: [
        { metric: "OEE", before: "%18", after: "%61" },
        { metric: "Setup Süresi", before: "45 dk", after: "12 dk" },
        { metric: "Fire Oranı", before: "%8", after: "%3" },
        { metric: "Yıllık Tasarruf", before: "₺0", after: "₺850.000" },
      ],
      testimonial: {
        quote:
          "SectorCalc sayesinde atölyemizin verimliliğini 3 kat artırdık. Artık hangi makinenin neden durduğunu anında görüyoruz.",
        author: "Ali Yılmaz",
        title: "Üretim Müdürü",
        company: "İzmir CNC Atölyesi",
      },
    },
    de: {
      title: "CNC-Werkstatt steigerte OEE von 18 % auf 61 %",
      subtitle: "Wie ungeplante Stillstände, Rüstzeiten und Qualitätsverluste umgekehrt wurden",
      industry: "Fertigung / CNC-Bearbeitung",
      challenge:
        "Eine CNC-Werkstatt mit 12 Maschinen in der Serienfertigung hatte einen OEE von 18 %. Ungeplante Stillstände, lange Rüstzeiten und Qualitätsverluste drückten den Output — rund 40 Stunden ungeplanter Stopps pro Monat.",
      solution:
        "Der SectorCalc OEE-Stillstandsrechner strukturierte Stopps. Der SMED-Rüstoptimierer reduzierte die Rüstzeit von 45 auf 12 Minuten. Die Ausschussquote sank von 8 % auf 3 %.",
      results: [
        { metric: "OEE", before: "18 %", after: "61 %" },
        { metric: "Rüstzeit", before: "45 Min.", after: "12 Min." },
        { metric: "Ausschuss", before: "8 %", after: "3 %" },
        { metric: "Jährliche Einsparung", before: "0 €", after: "85.000 €" },
      ],
      testimonial: {
        quote:
          "Mit SectorCalc haben wir die Transparenz auf dem Shopfloor verdreifacht. Wir sehen sofort, welche Maschine warum steht.",
        author: "Ali Yilmaz",
        title: "Produktionsleiter",
        company: "Izmir CNC Werkstatt",
      },
    },
    fr: {
      title: "Atelier CNC : OEE passé de 18 % à 61 %",
      subtitle: "Comment les arrêts, les réglages et les pertes qualité ont été inversés",
      industry: "Production / usinage CNC",
      challenge:
        "Un atelier CNC avec 12 machines en production série affichait un OEE de 18 %. Arrêts non planifiés, réglages longs et pertes qualité pesaient sur le débit — environ 40 heures d'arrêts par mois.",
      solution:
        "Le calculateur OEE arrêts SectorCalc a cartographié les causes. L'optimiseur SMED a réduit le réglage de 45 à 12 minutes. Le taux de rebut est passé de 8 % à 3 %.",
      results: [
        { metric: "OEE", before: "18 %", after: "61 %" },
        { metric: "Temps de réglage", before: "45 min", after: "12 min" },
        { metric: "Taux de rebut", before: "8 %", after: "3 %" },
        { metric: "Économies annuelles", before: "0 €", after: "85 000 €" },
      ],
      testimonial: {
        quote:
          "Avec SectorCalc, nous avons triplé la visibilité atelier. Nous voyons immédiatement quelle machine s'est arrêtée et pourquoi.",
        author: "Ali Yilmaz",
        title: "Responsable production",
        company: "Atelier CNC Izmir",
      },
    },
    es: {
      title: "Taller CNC elevó el OEE del 18 % al 61 %",
      subtitle: "Cómo se revirtieron paradas, tiempos de setup y pérdidas de calidad",
      industry: "Manufactura / mecanizado CNC",
      challenge:
        "Un taller CNC con 12 máquinas en producción en serie tenía un OEE del 18 %. Paradas no planificadas, setups largos y pérdidas de calidad reducían el throughput — unas 40 horas de paradas al mes.",
      solution:
        "La calculadora OEE de paradas SectorCalc categorizó las paradas. El optimizador SMED redujo el setup de 45 a 12 minutos. La tasa de scrap bajó del 8 % al 3 %.",
      results: [
        { metric: "OEE", before: "18 %", after: "61 %" },
        { metric: "Tiempo de setup", before: "45 min", after: "12 min" },
        { metric: "Tasa de scrap", before: "8 %", after: "3 %" },
        { metric: "Ahorro anual", before: "0 €", after: "85.000 €" },
      ],
      testimonial: {
        quote:
          "Con SectorCalc triplicamos la visibilidad en planta. Ahora vemos al instante qué máquina paró y por qué.",
        author: "Ali Yilmaz",
        title: "Director de producción",
        company: "Taller CNC Izmir",
      },
    },
    ar: {
      title: "ورشة CNC رفعت OEE من 18% إلى 61%",
      subtitle: "كيف تم عكس التوقفات غير الم planned وأزمنة الإعداد وفقدان الجودة",
      industry: "التصنيع / تشغيل CNC",
      challenge:
        "ورشة CNC تعمل بـ 12 آلة في الإنتاج المتسلسل كانت OEE لديها 18%. التوقفات غير المخططة وأزمنة الإعداد الطويلة وفقدان الجودة أضعفا الإنتاج — نحو 40 ساعة توقف شهرياً.",
      solution:
        "حاسبة توقف OEE من SectorCalc صنّفت أسباب التوقف. محسّن SMED خفّض الإعداد من 45 إلى 12 دقيقة. انخفض معدل الهدر من 8% إلى 3%.",
      results: [
        { metric: "OEE", before: "18%", after: "61%" },
        { metric: "زمن الإعداد", before: "45 د", after: "12 د" },
        { metric: "معدل الهدر", before: "8%", after: "3%" },
        { metric: "توفير سنوي", before: "0", after: "85,000 €" },
      ],
      testimonial: {
        quote:
          "بفضل SectorCalc زدنا وضوح الرؤية في الورشة ثلاث مرات. نرى فوراً أي آلة توقفت ولماذا.",
        author: "علي يلماز",
        title: "مدير الإنتاج",
        company: "ورشة Izmir CNC",
      },
    },
  },
  "carbon-reporting-automation": {
    en: {
      title: "Energy firm cut SKDM reporting from 4 hours to 20 minutes",
      subtitle: "How carbon footprint calculation and reporting was automated",
      industry: "Energy / carbon management",
      challenge:
        "An energy company prepared CBAM-style carbon reports in manual Excel workbooks. Each report took four hours with a high error rate.",
      solution:
        "SectorCalc Carbon Footprint Calculator automated product-level footprints. kWh Cost Calculator integrated energy spend into the same review loop.",
      results: [
        { metric: "Reporting time", before: "4 hours", after: "20 min" },
        { metric: "Error rate", before: "12%", after: "0.5%" },
        { metric: "Annual savings", before: "$0", after: "$32,000" },
      ],
      testimonial: {
        quote:
          "We cut SKDM reporting from four hours to twenty minutes. Clients now get consistent, traceable numbers.",
        author: "Mehmet Demir",
        title: "Sustainability Director",
        company: "Energy Corp",
      },
    },
    tr: {
      title: "Enerji Firması SKDM Raporlamasını 4 Saatten 20 Dakikaya İndirdi",
      subtitle: "Karbon ayak izi hesaplama ve raporlama süreci nasıl otomatize edildi?",
      industry: "Enerji / Karbon Yönetimi",
      challenge:
        "Bir enerji firması, SKDM (Sınırda Karbon Düzenlemesi) raporlamasını manuel Excel dosyalarıyla yapıyordu. Her rapor 4 saat sürüyor, hata oranı yüksekti.",
      solution:
        "SectorCalc Karbon Hesaplayıcı ile ürün bazında karbon ayak izi otomatik hesaplandı. kWh Maliyet Hesaplayıcı ile enerji tüketim maliyetleri entegre edildi.",
      results: [
        { metric: "Raporlama Süresi", before: "4 saat", after: "20 dakika" },
        { metric: "Hata Oranı", before: "%12", after: "%0.5" },
        { metric: "Yıllık Tasarruf", before: "₺0", after: "₺320.000" },
      ],
      testimonial: {
        quote:
          "SectorCalc ile SKDM raporlamamızı 4 saatten 20 dakikaya indirdik. Artık müşterilerimize güvenilir veriler sunabiliyoruz.",
        author: "Mehmet Demir",
        title: "Sürdürülebilirlik Müdürü",
        company: "Enerji A.Ş.",
      },
    },
    de: {
      title: "Energieunternehmen: CBAM-Reporting von 4 Stunden auf 20 Minuten",
      subtitle: "Automatisierung der CO₂-Fußabdruck-Berechnung und Berichterstattung",
      industry: "Energie / CO₂-Management",
      challenge:
        "Ein Energieunternehmen erstellte CBAM-Berichte manuell in Excel. Jeder Bericht dauerte vier Stunden bei hoher Fehlerquote.",
      solution:
        "Der SectorCalc Carbon Footprint Calculator automatisierte produktbezogene Fußabdrücke. Der kWh-Kostenrechner band Energiekosten ein.",
      results: [
        { metric: "Berichtszeit", before: "4 Std.", after: "20 Min." },
        { metric: "Fehlerquote", before: "12 %", after: "0,5 %" },
        { metric: "Jährliche Einsparung", before: "0 €", after: "32.000 €" },
      ],
      testimonial: {
        quote:
          "Wir haben die CBAM-Berichterstattung von vier Stunden auf zwanzig Minuten reduziert.",
        author: "Mehmet Demir",
        title: "Leiter Nachhaltigkeit",
        company: "Energie AG",
      },
    },
    fr: {
      title: "Entreprise énergétique : reporting CBAM de 4 h à 20 min",
      subtitle: "Automatisation du calcul et du reporting d'empreinte carbone",
      industry: "Énergie / gestion carbone",
      challenge:
        "Une entreprise énergétique préparait les rapports carbone dans Excel. Chaque rapport prenait quatre heures avec un taux d'erreur élevé.",
      solution:
        "Le calculateur d'empreinte carbone SectorCalc a automatisé les calculs par produit. Le calculateur kWh a intégré les coûts énergétiques.",
      results: [
        { metric: "Temps de reporting", before: "4 h", after: "20 min" },
        { metric: "Taux d'erreur", before: "12 %", after: "0,5 %" },
        { metric: "Économies annuelles", before: "0 €", after: "32 000 €" },
      ],
      testimonial: {
        quote:
          "Nous avons réduit le reporting CBAM de quatre heures à vingt minutes.",
        author: "Mehmet Demir",
        title: "Directeur durabilité",
        company: "Énergie SA",
      },
    },
    es: {
      title: "Empresa energética: informe CBAM de 4 horas a 20 minutos",
      subtitle: "Automatización del cálculo y reporte de huella de carbono",
      industry: "Energía / gestión de carbono",
      challenge:
        "Una empresa energética preparaba informes de carbono en Excel manual. Cada informe tardaba cuatro horas con alta tasa de error.",
      solution:
        "La calculadora de huella de carbono SectorCalc automatizó huellas por producto. La calculadora kWh integró costes energéticos.",
      results: [
        { metric: "Tiempo de informe", before: "4 h", after: "20 min" },
        { metric: "Tasa de error", before: "12 %", after: "0,5 %" },
        { metric: "Ahorro anual", before: "0 €", after: "32.000 €" },
      ],
      testimonial: {
        quote:
          "Reducimos el informe CBAM de cuatro horas a veinte minutos.",
        author: "Mehmet Demir",
        title: "Director de sostenibilidad",
        company: "Energía SA",
      },
    },
    ar: {
      title: "شركة طاقة: تقارير CBAM من 4 ساعات إلى 20 دقيقة",
      subtitle: "أتمتة حساب وإعداد تقارير البصمة الكarbonية",
      industry: "الطاقة / إدارة الكربون",
      challenge:
        "شركة طاقة كانت تعد تقارير الكربون يدوياً في Excel. كل تقرير يستغرق أربع ساعات بمعدل أخطاء مرتفع.",
      solution:
        "حاسبة البصمة الكarbonية من SectorCalc أتمتت الحساب لكل منتج. حاسبة تكلفة kWh دمجت مصاريف الطاقة.",
      results: [
        { metric: "زمن التقرير", before: "4 س", after: "20 د" },
        { metric: "معدل الخطأ", before: "12%", after: "0.5%" },
        { metric: "توفير سنوي", before: "0", after: "32,000 €" },
      ],
      testimonial: {
        quote: "خفّضنا إعداد تقارير CBAM من أربع ساعات إلى عشرين دقيقة.",
        author: "Mehmet Demir",
        title: "مدير الاستدامة",
        company: "شركة الطاقة",
      },
    },
  },
  "welding-cost-reduction": {
    en: {
      title: "Welding shop cut costs by 22%",
      subtitle: "Quote discipline and weld cost optimization for competitive bids",
      industry: "Metal / welding",
      challenge:
        "A welding shop produced different cost figures on every new quote. Wire, gas, labor, and energy were not standardized — margin leaked on competitive bids.",
      solution:
        "SectorCalc Welding Cost Calculator unified wire, gas, labor, and energy in one governed formula. Volume and strength checks added before release.",
      results: [
        { metric: "Quote margin", before: "18%", after: "32%" },
        { metric: "Cost variance", before: "15%", after: "3%" },
        { metric: "Annual savings", before: "$0", after: "$45,000" },
      ],
      testimonial: {
        quote:
          "We quote with confidence now. Weld cost variance dropped from 15% to 3%.",
        author: "Hasan Usta",
        title: "Shop Owner",
        company: "Kaynak Teknik",
      },
    },
    tr: {
      title: "Kaynak Atölyesi Maliyetlerini %22 Azalttı",
      subtitle: "Kaynak maliyeti hesaplama ve optimizasyonu ile rekabet avantajı",
      industry: "Metal / Kaynak",
      challenge:
        "Bir kaynak atölyesi, her yeni teklifte farklı maliyetler çıkarıyordu. Kaynak maliyetlerini standartlaştıramıyor, tekliflerde marj kaybı yaşıyordu.",
      solution:
        "SectorCalc Kaynak Maliyet Hesaplayıcı ile tel tüketimi, gaz maliyeti, işçilik ve enerji maliyetleri tek bir formülde birleştirildi.",
      results: [
        { metric: "Teklif Marjı", before: "%18", after: "%32" },
        { metric: "Maliyet Sapması", before: "%15", after: "%3" },
        { metric: "Yıllık Tasarruf", before: "₺0", after: "₺450.000" },
      ],
      testimonial: {
        quote:
          "Artık tekliflerimizi güvenle veriyoruz. Kaynak maliyetlerimizdeki sapma %15'ten %3'e düştü.",
        author: "Hasan Usta",
        title: "Atölye Sahibi",
        company: "Kaynak Teknik",
      },
    },
    de: {
      title: "Schweißwerkstatt senkte Kosten um 22 %",
      subtitle: "Schweißkostenkalkulation und Angebotsdisziplin",
      industry: "Metall / Schweißen",
      challenge:
        "Eine Schweißwerkstatt lieferte bei jedem Angebot andere Kosten. Draht, Gas, Arbeit und Energie waren nicht standardisiert — Marge ging verloren.",
      solution:
        "Der SectorCalc Schweißkostenrechner vereinte Draht, Gas, Arbeit und Energie in einer Formel. Volumen- und Festigkeitsrechner ergänzten die Freigabe.",
      results: [
        { metric: "Angebotsmarge", before: "18 %", after: "32 %" },
        { metric: "Kostenabweichung", before: "15 %", after: "3 %" },
        { metric: "Jährliche Einsparung", before: "0 €", after: "45.000 €" },
      ],
      testimonial: {
        quote:
          "Wir geben Angebote mit Sicherheit ab. Die Kostenabweichung sank von 15 % auf 3 %.",
        author: "Hasan Usta",
        title: "Werkstattinhaber",
        company: "Kaynak Teknik",
      },
    },
    fr: {
      title: "Atelier de soudure : coûts réduits de 22 %",
      subtitle: "Calcul des coûts de soudure et discipline de devis",
      industry: "Métal / soudure",
      challenge:
        "Un atelier de soudure sortait des coûts différents à chaque devis. Fil, gaz, main-d'œuvre et énergie n'étaient pas standardisés.",
      solution:
        "Le calculateur de coût de soudure SectorCalc a unifié fil, gaz, main-d'œuvre et énergie. Volume et résistance complètent la revue.",
      results: [
        { metric: "Marge devis", before: "18 %", after: "32 %" },
        { metric: "Écart de coût", before: "15 %", after: "3 %" },
        { metric: "Économies annuelles", before: "0 €", after: "45 000 €" },
      ],
      testimonial: {
        quote:
          "Nous chiffrons en confiance. L'écart de coût est passé de 15 % à 3 %.",
        author: "Hasan Usta",
        title: "Propriétaire d'atelier",
        company: "Kaynak Teknik",
      },
    },
    es: {
      title: "Taller de soldadura redujo costes un 22 %",
      subtitle: "Cálculo de coste de soldadura y disciplina en presupuestos",
      industry: "Metal / soldadura",
      challenge:
        "Un taller de soldadura generaba costes distintos en cada presupuesto. Alambre, gas, mano de obra y energía no estaban estandarizados.",
      solution:
        "La calculadora de coste de soldadura SectorCalc unificó alambre, gas, mano de obra y energía. Calculadoras de volumen y resistencia completaron la revisión.",
      results: [
        { metric: "Margen presupuesto", before: "18 %", after: "32 %" },
        { metric: "Desviación de coste", before: "15 %", after: "3 %" },
        { metric: "Ahorro anual", before: "0 €", after: "45.000 €" },
      ],
      testimonial: {
        quote:
          "Presupuestamos con confianza. La desviación de coste bajó del 15 % al 3 %.",
        author: "Hasan Usta",
        title: "Propietario del taller",
        company: "Kaynak Teknik",
      },
    },
    ar: {
      title: "ورشة لحام خفّضت التكاليف 22%",
      subtitle: "حساب تكلفة اللحام وانضباط العروض",
      industry: "معادن / لحام",
      challenge:
        "ورشة لحام كانت تنتج أرقام تكلفة مختلفة في كل عرض. السلك والغاز والعمالة والطاقة لم تكن موحّدة.",
      solution:
        "حاسبة تكلفة اللحام من SectorCalc جمعت السلك والغاز والعمالة والطاقة في معادلة واحدة.",
      results: [
        { metric: "هامش العرض", before: "18%", after: "32%" },
        { metric: "انحراف التكلفة", before: "15%", after: "3%" },
        { metric: "توفير سنوي", before: "0", after: "45,000 €" },
      ],
      testimonial: {
        quote: "نقدّم العروض بثقة. انحراف التكلفة انخفض من 15% إلى 3%.",
        author: "Hasan Usta",
        title: "مالك الورشة",
        company: "Kaynak Teknik",
      },
    },
  },
};

function normalizeLocale(locale: string): SupportedLocale {
  const normalized = locale.toLowerCase() as SupportedLocale;
  return SUPPORTED_LOCALES.includes(normalized) ? normalized : "en";
}

export function isPublishedCaseStudySlug(slug: string): boolean {
  return slug in CONTENT;
}

export function getPublishedCaseStudyBySlug(slug: string, locale: string): CaseStudy | undefined {
  const localized = CONTENT[slug as keyof typeof CONTENT];
  const base = publishedCaseStudyBase.find((entry) => entry.slug === slug);
  if (!localized || !base) {
    return undefined;
  }

  const content = localized[normalizeLocale(locale)];
  return {
    slug: base.slug,
    tools: base.tools,
    publishedAt: base.publishedAt,
    readTime: base.readTime,
    coverImage: base.coverImage,
    ...content,
  };
}

export function listPublishedCaseStudies(locale: string): CaseStudy[] {
  return publishedCaseStudyBase
    .map((base) => getPublishedCaseStudyBySlug(base.slug, locale))
    .filter((entry): entry is CaseStudy => entry !== undefined);
}

export function listPublishedCaseStudySlugs(): readonly string[] {
  return publishedCaseStudyBase.map((entry) => entry.slug);
}
