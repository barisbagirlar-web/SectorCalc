import fs from 'fs';

const en = {
  badgePlatform: "Industrial calculation platform",
  titleBr: "Pay only for what you calculate.<br/> No subscription. No commitment.",
  subtitle: "Engineers in 40+ countries use SectorCalc credits to get audit-ready results in minutes.",
  trust: {
    paddle: "🔒 Paddle secure checkout",
    markets: "🌍 200+ markets · auto tax",
    pdf: "📄 PDF on every calculation",
    guarantee: "✅ 7-day guarantee",
    noAutoRenew: "🔁 No auto-renew",
    cards: "💳 Card · PayPal · Apple Pay"
  },
  stats: {
    engineersActive: "Engineers active",
    sectors: "Industry sectors",
    proTools: "Pro tools",
    countries: "Countries"
  },
  guarantee: {
    title: "7-day satisfaction guarantee",
    desc: "If your first credit doesn't deliver a usable result, email us within 7 days — we'll restore it. No forms, no friction."
  },
  testimonial: {
    quote: "“We replaced a €600/year software license with SectorCalc credits. Same results, a fraction of the cost.”",
    author: "— Production Manager, automotive supplier, Germany"
  },
  useCases: {
    title: "What 1 credit gets you",
    manufacturing: "Manufacturing",
    costing: "Costing",
    finance: "Finance",
    quality: "Quality",
    investment: "Investment",
    logistics: "Logistics",
    oee: "OEE Calculator",
    oeeDesc: "Availability, performance, quality breakdown with monthly loss estimate",
    mhr: "Machine Hourly Rate",
    mhrDesc: "Depreciation + energy + labor cost basis — ready for quoting",
    breakeven: "Break-Even Analysis",
    breakevenDesc: "Fixed/variable cost model with sensitivity graph",
    scrap: "Scrap & Material Loss",
    scrapDesc: "Annual cost of waste quantified and benchmarked",
    npv: "NPV / IRR Calculator",
    npvDesc: "Investment memo with scenario comparison and decision matrix",
    eoq: "EOQ & Safety Stock",
    eoqDesc: "Optimal order quantity with TCO comparison"
  },
  faq: {
    title: "Common questions",
    q1: "Do credits expire?",
    a1: "Credits are valid for 12 months from purchase. They never auto-renew.",
    q2: "Which payment methods are accepted?",
    a2: "Visa, Mastercard, Amex, PayPal, Apple Pay, Google Pay via Paddle. Tax handled automatically for 200+ countries.",
    q3: "Can I get an invoice or pay by bank transfer?",
    a3: "Yes — the 100-credit Enterprise pack supports invoice and PO billing. Email info@sectorcalc.com.",
    q4: "Can I share credits with my team?",
    a4: "Department (30) and Enterprise (100) packs support team credit sharing. Email us after purchase to set up.",
    q5: "What is the 7-day guarantee?",
    a5: "If your first credit doesn't produce a usable result, email us within 7 days and we'll restore it.",
    q6: "What if the calculator I need isn't available?",
    a6: "Submit a tool request — we build in priority order. Your credit is not consumed if the tool isn't live yet."
  },
  footer: {
    pricingDisclaimer: "Prices in {currency} · Paddle localizes currency at checkout · Tax included · Credits valid 12 months",
    companyInfo: "Sector Calculator · Tax ID 25403091318 · Folkart Towers Yanyolu No:47, 35530 Bayraklı/İzmir",
    terms: "Terms",
    privacy: "Privacy",
    refund: "Refund Policy"
  },
  card: {
    credit: "credit",
    credits: "credits",
    perCalculation: "per calculation",
    saveVsSingle: "Save {pct}% vs single",
    opening: "Opening…"
  },
  plans: {
    starter: {
      badgeText: "No commitment",
      cta: "Buy 1 credit",
      features: { f1: "1 pro calculation", f2: "PDF report included", f3: "No account required" }
    },
    essentials: {
      badgeText: "Save 50%",
      cta: "Get 5 credits",
      features: { f1: "5 pro calculations", f2: "PDF export on all", f3: "12-month validity" }
    },
    popular: {
      badgeText: "Most popular",
      cta: "Get 15 credits",
      features: { f1: "15 pro calculations", f2: "Shareable PDF reports", f3: "Priority support", f4: "12-month validity" }
    },
    department: {
      badgeText: "Teams",
      cta: "Get 30 credits",
      features: { f1: "30 pro calculations", f2: "Team PDF sharing", f3: "Usage dashboard", f4: "12-month validity" }
    },
    enterprise: {
      badgeText: "Best value",
      cta: "Get 100 credits",
      features: { f1: "100 pro calculations", f2: "Invoice / PO billing", f3: "API access (beta)", f4: "Dedicated onboarding", f5: "12-month validity" }
    }
  }
};

const tr = {
  badgePlatform: "Endüstriyel hesaplama platformu",
  titleBr: "Sadece hesapladığınız kadar ödeyin.<br/> Abonelik yok. Taahhüt yok.",
  subtitle: "40'tan fazla ülkede mühendisler, dakikalar içinde denetime hazır sonuçlar almak için SectorCalc kredilerini kullanıyor.",
  trust: {
    paddle: "🔒 Paddle güvenli ödeme",
    markets: "🌍 200+ pazar · otomatik vergi",
    pdf: "📄 Her hesaplamada PDF",
    guarantee: "✅ 7 gün garanti",
    noAutoRenew: "🔁 Otomatik yenileme yok",
    cards: "💳 Kart · PayPal · Apple Pay"
  },
  stats: {
    engineersActive: "Aktif mühendis",
    sectors: "Endüstri sektörü",
    proTools: "Pro araç",
    countries: "Ülke"
  },
  guarantee: {
    title: "7 günlük memnuniyet garantisi",
    desc: "Eğer ilk krediniz kullanılabilir bir sonuç sağlamazsa, 7 gün içinde bize e-posta gönderin — kredinizi iade edelim. Form yok, zorluk yok."
  },
  testimonial: {
    quote: "“Yılda €600 ödediğimiz yazılım lisansını SectorCalc kredileri ile değiştirdik. Aynı sonuçlar, maliyetin sadece bir kısmı.”",
    author: "— Üretim Müdürü, otomotiv yan sanayi, Almanya"
  },
  useCases: {
    title: "1 kredi ile ne elde edersiniz?",
    manufacturing: "Üretim",
    costing: "Maliyet",
    finance: "Finans",
    quality: "Kalite",
    investment: "Yatırım",
    logistics: "Lojistik",
    oee: "OEE Hesaplayıcı",
    oeeDesc: "Aylık kayıp tahmini ile kullanılabilirlik, performans ve kalite kırılımı",
    mhr: "Makine Saat Ücreti",
    mhrDesc: "Amortisman + enerji + işçilik maliyeti tabanı — teklif vermek için hazır",
    breakeven: "Başabaş Analizi",
    breakevenDesc: "Duyarlılık grafiği ile sabit/değişken maliyet modeli",
    scrap: "Fire ve Malzeme Kaybı",
    scrapDesc: "Yıllık israf maliyeti hesaplanmış ve karşılaştırmalı analizi yapılmış",
    npv: "NBD / İGKO Hesaplayıcı",
    npvDesc: "Senaryo karşılaştırması ve karar matrisi içeren yatırım notu",
    eoq: "EOM ve Güvenlik Stoğu",
    eoqDesc: "TCO karşılaştırması ile optimum sipariş miktarı"
  },
  faq: {
    title: "Sıkça sorulan sorular",
    q1: "Kredilerin süresi doluyor mu?",
    a1: "Krediler satın alma tarihinden itibaren 12 ay boyunca geçerlidir. Hiçbir zaman otomatik yenilenmezler.",
    q2: "Hangi ödeme yöntemleri kabul ediliyor?",
    a2: "Paddle aracılığıyla Visa, Mastercard, Amex, PayPal, Apple Pay, Google Pay. Vergi 200'den fazla ülke için otomatik olarak işlenir.",
    q3: "Fatura alabilir miyim veya banka havalesiyle ödeyebilir miyim?",
    a3: "Evet — 100 kredilik Enterprise paketi fatura ve PO ile ödemeyi destekler. info@sectorcalc.com adresine e-posta gönderin.",
    q4: "Kredileri ekibimle paylaşabilir miyim?",
    a4: "Department (30) ve Enterprise (100) paketleri ekip kredi paylaşımını destekler. Satın aldıktan sonra kurulum için bize e-posta gönderin.",
    q5: "7 günlük garanti nedir?",
    a5: "Eğer ilk krediniz kullanılabilir bir sonuç üretmezse, 7 gün içinde bize e-posta gönderin, kredinizi iade edelim.",
    q6: "İhtiyacım olan hesaplayıcı mevcut değilse ne olur?",
    a6: "Araç talebinde bulunun — öncelik sırasına göre geliştiriyoruz. Araç henüz yayında değilse krediniz harcanmaz."
  },
  footer: {
    pricingDisclaimer: "Fiyatlar {currency} cinsindendir · Paddle ödeme sırasında yerel para birimine çevirir · Vergi dahildir · Krediler 12 ay geçerlidir",
    companyInfo: "Sector Calculator · Vergi No 25403091318 · Folkart Towers Yanyolu No:47, 35530 Bayraklı/İzmir",
    terms: "Şartlar",
    privacy: "Gizlilik",
    refund: "İade Politikası"
  },
  card: {
    credit: "kredi",
    credits: "kredi",
    perCalculation: "hesaplama başı",
    saveVsSingle: "Tekliye göre %{pct} tasarruf",
    opening: "Açılıyor…"
  },
  plans: {
    starter: {
      badgeText: "Taahhüt yok",
      cta: "1 Kredi Al",
      features: { f1: "1 pro hesaplama", f2: "PDF raporu dahil", f3: "Hesap gerekmez" }
    },
    essentials: {
      badgeText: "%50 Tasarruf",
      cta: "5 Kredi Al",
      features: { f1: "5 pro hesaplama", f2: "Tümünde PDF dışa aktarma", f3: "12 ay geçerlilik" }
    },
    popular: {
      badgeText: "En popüler",
      cta: "15 Kredi Al",
      features: { f1: "15 pro hesaplama", f2: "Paylaşılabilir PDF raporları", f3: "Öncelikli destek", f4: "12 ay geçerlilik" }
    },
    department: {
      badgeText: "Ekipler",
      cta: "30 Kredi Al",
      features: { f1: "30 pro hesaplama", f2: "Ekip PDF paylaşımı", f3: "Kullanım panosu", f4: "12 ay geçerlilik" }
    },
    enterprise: {
      badgeText: "En iyi değer",
      cta: "100 Kredi Al",
      features: { f1: "100 pro hesaplama", f2: "Fatura / PO ödeme", f3: "API erişimi (beta)", f4: "Özel katılım", f5: "12 ay geçerlilik" }
    }
  }
};

const de = {
  badgePlatform: "Industrielle Berechnungsplattform",
  titleBr: "Zahlen Sie nur für das, was Sie berechnen.<br/> Kein Abo. Keine Verpflichtung.",
  subtitle: "Ingenieure in über 40 Ländern nutzen SectorCalc-Credits, um in Minuten prüffähige Ergebnisse zu erhalten.",
  trust: {
    paddle: "🔒 Paddle sicherer Checkout",
    markets: "🌍 200+ Märkte · Auto-Steuer",
    pdf: "📄 PDF bei jeder Berechnung",
    guarantee: "✅ 7-Tage-Garantie",
    noAutoRenew: "🔁 Keine automatische Verlängerung",
    cards: "💳 Karte · PayPal · Apple Pay"
  },
  stats: {
    engineersActive: "Aktive Ingenieure",
    sectors: "Industriesektoren",
    proTools: "Pro-Tools",
    countries: "Länder"
  },
  guarantee: {
    title: "7-Tage-Zufriedenheitsgarantie",
    desc: "Wenn Ihr erster Credit kein verwertbares Ergebnis liefert, schreiben Sie uns innerhalb von 7 Tagen — wir erstatten ihn. Keine Formulare, keine Reibung."
  },
  testimonial: {
    quote: "„Wir haben eine Softwarelizenz für 600 €/Jahr durch SectorCalc-Credits ersetzt. Gleiche Ergebnisse, ein Bruchteil der Kosten.“",
    author: "— Produktionsleiter, Automobilzulieferer, Deutschland"
  },
  useCases: {
    title: "Was 1 Credit Ihnen bringt",
    manufacturing: "Fertigung",
    costing: "Kalkulation",
    finance: "Finanzen",
    quality: "Qualität",
    investment: "Investition",
    logistics: "Logistik",
    oee: "OEE Rechner",
    oeeDesc: "Verfügbarkeit, Leistung, Qualitätsaufschlüsselung mit geschätztem monatlichen Verlust",
    mhr: "Maschinenstundensatz",
    mhrDesc: "Abschreibung + Energie + Lohnkostenbasis — bereit zur Angebotserstellung",
    breakeven: "Break-Even-Analyse",
    breakevenDesc: "Fixe/variable Kostenmodell mit Sensitivitätsdiagramm",
    scrap: "Ausschuss & Materialverlust",
    scrapDesc: "Jährliche Kosten der Verschwendung quantifiziert und verglichen",
    npv: "Kapitalwert / IZF Rechner",
    npvDesc: "Investitionsmemorandum mit Szenariovergleich und Entscheidungsmatrix",
    eoq: "EOQ & Sicherheitsbestand",
    eoqDesc: "Optimale Bestellmenge mit TCO-Vergleich"
  },
  faq: {
    title: "Häufige Fragen",
    q1: "Verfallen Credits?",
    a1: "Credits sind ab Kauf 12 Monate gültig. Sie verlängern sich nie automatisch.",
    q2: "Welche Zahlungsmethoden werden akzeptiert?",
    a2: "Visa, Mastercard, Amex, PayPal, Apple Pay, Google Pay über Paddle. Steuern werden für über 200 Länder automatisch berechnet.",
    q3: "Kann ich eine Rechnung erhalten oder per Überweisung bezahlen?",
    a3: "Ja — das 100-Credit-Enterprise-Paket unterstützt den Kauf auf Rechnung. Senden Sie eine E-Mail an info@sectorcalc.com.",
    q4: "Kann ich Credits mit meinem Team teilen?",
    a4: "Department (30) und Enterprise (100) Pakete unterstützen die gemeinsame Nutzung von Credits. Kontaktieren Sie uns nach dem Kauf für die Einrichtung.",
    q5: "Was ist die 7-Tage-Garantie?",
    a5: "Wenn Ihr erster Credit kein brauchbares Ergebnis liefert, schreiben Sie uns innerhalb von 7 Tagen und wir erstatten ihn.",
    q6: "Was passiert, wenn der von mir benötigte Rechner nicht verfügbar ist?",
    a6: "Reichen Sie eine Anfrage ein — wir entwickeln nach Priorität. Ihr Credit wird nicht verbraucht, wenn das Tool noch nicht live ist."
  },
  footer: {
    pricingDisclaimer: "Preise in {currency} · Paddle lokalisiert die Währung beim Checkout · Inkl. Steuern · Credits 12 Monate gültig",
    companyInfo: "Sector Calculator · Steuernummer 25403091318 · Folkart Towers Yanyolu No:47, 35530 Bayraklı/İzmir",
    terms: "Bedingungen",
    privacy: "Datenschutz",
    refund: "Rückerstattung"
  },
  card: {
    credit: "Credit",
    credits: "Credits",
    perCalculation: "pro Berechnung",
    saveVsSingle: "Sparen Sie {pct}% ggü. Einzelkauf",
    opening: "Öffnen…"
  },
  plans: {
    starter: {
      badgeText: "Keine Verpflichtung",
      cta: "1 Credit kaufen",
      features: { f1: "1 Pro-Berechnung", f2: "PDF-Bericht inklusive", f3: "Kein Konto erforderlich" }
    },
    essentials: {
      badgeText: "50% sparen",
      cta: "5 Credits holen",
      features: { f1: "5 Pro-Berechnungen", f2: "PDF-Export für alle", f3: "12 Monate Gültigkeit" }
    },
    popular: {
      badgeText: "Am beliebtesten",
      cta: "15 Credits holen",
      features: { f1: "15 Pro-Berechnungen", f2: "Teilbare PDF-Berichte", f3: "Prioritäts-Support", f4: "12 Monate Gültigkeit" }
    },
    department: {
      badgeText: "Teams",
      cta: "30 Credits holen",
      features: { f1: "30 Pro-Berechnungen", f2: "Team PDF-Teilung", f3: "Nutzungs-Dashboard", f4: "12 Monate Gültigkeit" }
    },
    enterprise: {
      badgeText: "Bester Wert",
      cta: "100 Credits holen",
      features: { f1: "100 Pro-Berechnungen", f2: "Rechnung / PO", f3: "API-Zugang (Beta)", f4: "Dediziertes Onboarding", f5: "12 Monate Gültigkeit" }
    }
  }
};

const fr = {
  badgePlatform: "Plateforme de calcul industriel",
  titleBr: "Ne payez que ce que vous calculez.<br/> Pas d'abonnement. Sans engagement.",
  subtitle: "Des ingénieurs dans plus de 40 pays utilisent les crédits SectorCalc pour obtenir des résultats prêts pour l'audit en quelques minutes.",
  trust: {
    paddle: "🔒 Paiement sécurisé Paddle",
    markets: "🌍 200+ marchés · taxe auto",
    pdf: "📄 PDF sur chaque calcul",
    guarantee: "✅ Garantie 7 jours",
    noAutoRenew: "🔁 Pas de renouvellement automatique",
    cards: "💳 Carte · PayPal · Apple Pay"
  },
  stats: {
    engineersActive: "Ingénieurs actifs",
    sectors: "Secteurs industriels",
    proTools: "Outils Pro",
    countries: "Pays"
  },
  guarantee: {
    title: "Garantie de satisfaction de 7 jours",
    desc: "Si votre premier crédit ne fournit pas un résultat utilisable, envoyez-nous un e-mail dans les 7 jours — nous le restaurerons. Pas de formulaires, pas de friction."
  },
  testimonial: {
    quote: "« Nous avons remplacé une licence logicielle à 600 €/an par des crédits SectorCalc. Mêmes résultats, une fraction du coût. »",
    author: "— Directeur de production, fournisseur automobile, Allemagne"
  },
  useCases: {
    title: "Ce qu'un crédit vous offre",
    manufacturing: "Fabrication",
    costing: "Chiffrage",
    finance: "Finance",
    quality: "Qualité",
    investment: "Investissement",
    logistics: "Logistique",
    oee: "Calculateur TRS",
    oeeDesc: "Disponibilité, performance, répartition de la qualité avec estimation des pertes mensuelles",
    mhr: "Taux horaire machine",
    mhrDesc: "Amortissement + énergie + base de coût de main-d'œuvre — prêt pour devis",
    breakeven: "Seuil de rentabilité",
    breakevenDesc: "Modèle de coûts fixes/variables avec graphique de sensibilité",
    scrap: "Rebuts et perte de matériel",
    scrapDesc: "Coût annuel du gaspillage quantifié et évalué",
    npv: "Calculateur VAN / TRI",
    npvDesc: "Mémorandum d'investissement avec comparaison de scénarios et matrice de décision",
    eoq: "QEC et Stock de sécurité",
    eoqDesc: "Quantité de commande optimale avec comparaison TCO"
  },
  faq: {
    title: "Questions courantes",
    q1: "Les crédits expirent-ils ?",
    a1: "Les crédits sont valables 12 mois à compter de l'achat. Ils ne se renouvellent jamais automatiquement.",
    q2: "Quels modes de paiement sont acceptés ?",
    a2: "Visa, Mastercard, Amex, PayPal, Apple Pay, Google Pay via Paddle. Taxes gérées automatiquement pour plus de 200 pays.",
    q3: "Puis-je obtenir une facture ou payer par virement bancaire ?",
    a3: "Oui — le pack Enterprise de 100 crédits prend en charge la facturation sur facture et bon de commande. Envoyez un e-mail à info@sectorcalc.com.",
    q4: "Puis-je partager des crédits avec mon équipe ?",
    a4: "Les packs Department (30) et Enterprise (100) permettent le partage de crédits en équipe. Envoyez-nous un e-mail après l'achat pour la configuration.",
    q5: "Quelle est la garantie de 7 jours ?",
    a5: "Si votre premier crédit ne produit pas un résultat utilisable, envoyez-nous un e-mail dans les 7 jours et nous le restaurerons.",
    q6: "Que faire si le calculateur dont j'ai besoin n'est pas disponible ?",
    a6: "Soumettez une demande d'outil — nous développons par ordre de priorité. Votre crédit n'est pas consommé si l'outil n'est pas encore en ligne."
  },
  footer: {
    pricingDisclaimer: "Prix en {currency} · Paddle localise la monnaie au moment du paiement · Taxes incluses · Crédits valables 12 mois",
    companyInfo: "Sector Calculator · N° TVA 25403091318 · Folkart Towers Yanyolu No:47, 35530 Bayraklı/İzmir",
    terms: "Conditions",
    privacy: "Confidentialité",
    refund: "Politique de remboursement"
  },
  card: {
    credit: "crédit",
    credits: "crédits",
    perCalculation: "par calcul",
    saveVsSingle: "Économisez {pct}% vs l'unité",
    opening: "Ouverture…"
  },
  plans: {
    starter: {
      badgeText: "Sans engagement",
      cta: "Acheter 1 crédit",
      features: { f1: "1 calcul pro", f2: "Rapport PDF inclus", f3: "Aucun compte requis" }
    },
    essentials: {
      badgeText: "Économisez 50%",
      cta: "Obtenir 5 crédits",
      features: { f1: "5 calculs pro", f2: "Export PDF sur tous", f3: "Validité de 12 mois" }
    },
    popular: {
      badgeText: "Le plus populaire",
      cta: "Obtenir 15 crédits",
      features: { f1: "15 calculs pro", f2: "Rapports PDF partageables", f3: "Support prioritaire", f4: "Validité de 12 mois" }
    },
    department: {
      badgeText: "Équipes",
      cta: "Obtenir 30 crédits",
      features: { f1: "30 calculs pro", f2: "Partage PDF en équipe", f3: "Tableau de bord", f4: "Validité de 12 mois" }
    },
    enterprise: {
      badgeText: "Meilleure valeur",
      cta: "Obtenir 100 crédits",
      features: { f1: "100 calculs pro", f2: "Facturation sur facture / BC", f3: "Accès API (bêta)", f4: "Intégration dédiée", f5: "Validité de 12 mois" }
    }
  }
};

const es = {
  badgePlatform: "Plataforma de cálculo industrial",
  titleBr: "Paga solo por lo que calculas.<br/> Sin suscripción. Sin compromiso.",
  subtitle: "Ingenieros en más de 40 países usan créditos de SectorCalc para obtener resultados listos para auditoría en minutos.",
  trust: {
    paddle: "🔒 Pago seguro con Paddle",
    markets: "🌍 200+ mercados · impuestos auto",
    pdf: "📄 PDF en cada cálculo",
    guarantee: "✅ Garantía de 7 días",
    noAutoRenew: "🔁 Sin renovación automática",
    cards: "💳 Tarjeta · PayPal · Apple Pay"
  },
  stats: {
    engineersActive: "Ingenieros activos",
    sectors: "Sectores industriales",
    proTools: "Herramientas Pro",
    countries: "Países"
  },
  guarantee: {
    title: "Garantía de satisfacción de 7 días",
    desc: "Si tu primer crédito no entrega un resultado utilizable, envíanos un correo en 7 días y te lo devolveremos. Sin formularios, sin fricciones."
  },
  testimonial: {
    quote: "“Reemplazamos una licencia de software de 600 €/año por créditos SectorCalc. Mismos resultados, una fracción del costo.”",
    author: "— Jefe de Producción, proveedor de automoción, Alemania"
  },
  useCases: {
    title: "Lo que obtienes con 1 crédito",
    manufacturing: "Fabricación",
    costing: "Costeo",
    finance: "Finanzas",
    quality: "Calidad",
    investment: "Inversión",
    logistics: "Logística",
    oee: "Calculadora de OEE",
    oeeDesc: "Desglose de disponibilidad, rendimiento y calidad con estimación de pérdida mensual",
    mhr: "Tarifa Horaria de Máquina",
    mhrDesc: "Depreciación + energía + costo laboral base — listo para cotizar",
    breakeven: "Análisis de Punto de Equilibrio",
    breakevenDesc: "Modelo de costos fijos/variables con gráfico de sensibilidad",
    scrap: "Merma y pérdida de material",
    scrapDesc: "Costo anual del desperdicio cuantificado y comparado",
    npv: "Calculadora de VPN / TIR",
    npvDesc: "Memorándum de inversión con comparación de escenarios y matriz de decisión",
    eoq: "CEP y Stock de seguridad",
    eoqDesc: "Cantidad de pedido óptima con comparación de TCO"
  },
  faq: {
    title: "Preguntas frecuentes",
    q1: "¿Los créditos caducan?",
    a1: "Los créditos son válidos por 12 meses desde la compra. Nunca se renuevan automáticamente.",
    q2: "¿Qué métodos de pago se aceptan?",
    a2: "Visa, Mastercard, Amex, PayPal, Apple Pay, Google Pay a través de Paddle. Impuestos manejados automáticamente para más de 200 países.",
    q3: "¿Puedo obtener una factura o pagar por transferencia bancaria?",
    a3: "Sí — el paquete Enterprise de 100 créditos admite facturación. Envía un correo a info@sectorcalc.com.",
    q4: "¿Puedo compartir créditos con mi equipo?",
    a4: "Los paquetes Department (30) y Enterprise (100) admiten el uso compartido de créditos en equipo. Envíanos un correo después de la compra para configurarlo.",
    q5: "¿Qué es la garantía de 7 días?",
    a5: "Si tu primer crédito no produce un resultado útil, envíanos un correo en 7 días y lo restauraremos.",
    q6: "¿Qué pasa si la calculadora que necesito no está disponible?",
    a6: "Envía una solicitud de herramienta — desarrollamos por orden de prioridad. Tu crédito no se consume si la herramienta aún no está activa."
  },
  footer: {
    pricingDisclaimer: "Precios en {currency} · Paddle localiza la moneda al pagar · Impuestos incluidos · Créditos válidos por 12 meses",
    companyInfo: "Sector Calculator · ID Fiscal 25403091318 · Folkart Towers Yanyolu No:47, 35530 Bayraklı/İzmir",
    terms: "Términos",
    privacy: "Privacidad",
    refund: "Política de reembolso"
  },
  card: {
    credit: "crédito",
    credits: "créditos",
    perCalculation: "por cálculo",
    saveVsSingle: "Ahorra {pct}% vs individual",
    opening: "Abriendo…"
  },
  plans: {
    starter: {
      badgeText: "Sin compromiso",
      cta: "Comprar 1 crédito",
      features: { f1: "1 cálculo pro", f2: "Reporte PDF incluido", f3: "No requiere cuenta" }
    },
    essentials: {
      badgeText: "Ahorra 50%",
      cta: "Obtener 5 créditos",
      features: { f1: "5 cálculos pro", f2: "Exportación a PDF", f3: "Validez de 12 meses" }
    },
    popular: {
      badgeText: "Más popular",
      cta: "Obtener 15 créditos",
      features: { f1: "15 cálculos pro", f2: "Reportes PDF para compartir", f3: "Soporte prioritario", f4: "Validez de 12 meses" }
    },
    department: {
      badgeText: "Equipos",
      cta: "Obtener 30 créditos",
      features: { f1: "30 cálculos pro", f2: "Compartir PDF en equipo", f3: "Panel de uso", f4: "Validez de 12 meses" }
    },
    enterprise: {
      badgeText: "Mejor valor",
      cta: "Obtener 100 créditos",
      features: { f1: "100 cálculos pro", f2: "Factura / Orden de compra", f3: "Acceso a API (beta)", f4: "Integración dedicada", f5: "Validez de 12 meses" }
    }
  }
};

const ar = {
  badgePlatform: "منصة الحسابات الصناعية",
  titleBr: "ادفع فقط مقابل ما تحسبه.<br/> بدون اشتراك. بدون التزام.",
  subtitle: "يستخدم المهندسون في أكثر من 40 دولة أرصدة SectorCalc للحصول على نتائج جاهزة للتدقيق في دقائق.",
  trust: {
    paddle: "🔒 دفع آمن عبر Paddle",
    markets: "🌍 +200 سوق · ضريبة تلقائية",
    pdf: "📄 PDF لكل حساب",
    guarantee: "✅ ضمان 7 أيام",
    noAutoRenew: "🔁 لا تجديد تلقائي",
    cards: "💳 بطاقة · PayPal · Apple Pay"
  },
  stats: {
    engineersActive: "مهندسون نشطون",
    sectors: "قطاعات صناعية",
    proTools: "أدوات برو",
    countries: "دول"
  },
  guarantee: {
    title: "ضمان رضا لمدة 7 أيام",
    desc: "إذا لم يقدم رصيدك الأول نتيجة قابلة للاستخدام، راسلنا عبر البريد في غضون 7 أيام وسنعيده إليك. لا نماذج معقدة، لا عوائق."
  },
  testimonial: {
    quote: "“استبدلنا ترخيص برنامج بقيمة 600 يورو/السنة بأرصدة SectorCalc. نفس النتائج، بجزء بسيط من التكلفة.”",
    author: "— مدير إنتاج، مورد سيارات، ألمانيا"
  },
  useCases: {
    title: "ما يوفره لك رصيد واحد",
    manufacturing: "التصنيع",
    costing: "التكلفة",
    finance: "المالية",
    quality: "الجودة",
    investment: "الاستثمار",
    logistics: "اللوجستيات",
    oee: "حاسبة OEE",
    oeeDesc: "تفصيل الجاهزية والأداء والجودة مع تقدير الخسارة الشهرية",
    mhr: "معدل الساعة للآلة",
    mhrDesc: "الإهلاك + الطاقة + تكلفة العمالة الأساسية — جاهز للتسعير",
    breakeven: "تحليل نقطة التعادل",
    breakevenDesc: "نموذج التكاليف الثابتة/المتغيرة مع رسم بياني للحساسية",
    scrap: "الخردة وفقد المواد",
    scrapDesc: "التكلفة السنوية للهدر محسوبة ومقارنة",
    npv: "حاسبة NPV / IRR",
    npvDesc: "مذكرة استثمار مع مقارنة السيناريوهات ومصفوفة القرار",
    eoq: "كمية الطلب الاقتصادي ومخزون الأمان",
    eoqDesc: "كمية الطلب المثلى مع مقارنة إجمالي تكلفة الملكية"
  },
  faq: {
    title: "أسئلة شائعة",
    q1: "هل تنتهي صلاحية الأرصدة؟",
    a1: "الأرصدة صالحة لمدة 12 شهرًا من الشراء. ولا يتم تجديدها تلقائيًا أبدًا.",
    q2: "ما هي طرق الدفع المقبولة؟",
    a2: "Visa و Mastercard و Amex و PayPal و Apple Pay و Google Pay عبر Paddle. تُحسب الضرائب تلقائيًا لأكثر من 200 دولة.",
    q3: "هل يمكنني الحصول على فاتورة أو الدفع عن طريق التحويل المصرفي؟",
    a3: "نعم — تدعم باقة Enterprise التي تحتوي على 100 رصيد الفواتير وأوامر الشراء. راسلنا على info@sectorcalc.com.",
    q4: "هل يمكنني مشاركة الأرصدة مع فريقي؟",
    a4: "تدعم باقات Department (30) و Enterprise (100) مشاركة الأرصدة مع الفريق. راسلنا بعد الشراء لإعداد ذلك.",
    q5: "ما هو ضمان الـ 7 أيام؟",
    a5: "إذا لم ينتج رصيدك الأول نتيجة قابلة للاستخدام، راسلنا عبر البريد الإلكتروني في غضون 7 أيام وسنقوم بإعادته.",
    q6: "ماذا لو كانت الحاسبة التي أحتاجها غير متوفرة؟",
    a6: "أرسل طلب أداة — نقوم بالبناء حسب الأولوية. لا يتم استهلاك رصيدك إذا لم تكن الأداة حية بعد."
  },
  footer: {
    pricingDisclaimer: "الأسعار بعملة {currency} · يقوم Paddle بتحويل العملة محليًا عند الدفع · شامل الضريبة · الأرصدة صالحة لمدة 12 شهرًا",
    companyInfo: "Sector Calculator · الرقم الضريبي 25403091318 · أبراج فولكارت، شارع جانبي رقم 47، 35530 بايرقلي/إزمير",
    terms: "الشروط",
    privacy: "الخصوصية",
    refund: "سياسة الاسترداد"
  },
  card: {
    credit: "رصيد",
    credits: "أرصدة",
    perCalculation: "لكل حساب",
    saveVsSingle: "وفر {pct}% مقارنة بالمفرد",
    opening: "جاري الفتح…"
  },
  plans: {
    starter: {
      badgeText: "بدون التزام",
      cta: "شراء 1 رصيد",
      features: { f1: "1 حساب برو", f2: "تقرير PDF متضمن", f3: "لا يتطلب حساب" }
    },
    essentials: {
      badgeText: "وفر 50%",
      cta: "الحصول على 5 أرصدة",
      features: { f1: "5 حسابات برو", f2: "تصدير PDF للجميع", f3: "صلاحية 12 شهرًا" }
    },
    popular: {
      badgeText: "الأكثر شعبية",
      cta: "الحصول على 15 رصيد",
      features: { f1: "15 حساب برو", f2: "تقارير PDF قابلة للمشاركة", f3: "أولوية الدعم", f4: "صلاحية 12 شهرًا" }
    },
    department: {
      badgeText: "فرق",
      cta: "الحصول على 30 رصيد",
      features: { f1: "30 حساب برو", f2: "مشاركة PDF مع الفريق", f3: "لوحة تحكم للاستخدام", f4: "صلاحية 12 شهرًا" }
    },
    enterprise: {
      badgeText: "أفضل قيمة",
      cta: "الحصول على 100 رصيد",
      features: { f1: "100 حساب برو", f2: "دفع الفاتورة / PO", f3: "وصول API (تجريبي)", f4: "تهيئة مخصصة", f5: "صلاحية 12 شهرًا" }
    }
  }
};

const map = { en, tr, de, fr, es, ar };

for (const [lang, data] of Object.entries(map)) {
  const filePath = `messages/${lang}.json`;
  const fileData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  fileData.pricing_v2 = data;
  fs.writeFileSync(filePath, JSON.stringify(fileData, null, 2));
  console.log(`Updated ${lang}.json`);
}

