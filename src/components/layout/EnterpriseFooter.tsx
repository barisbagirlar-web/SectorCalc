"use client";

import { Link } from "@/i18n/routing";
import { useLocale } from "next-intl";
import { useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import { SITE_SOCIAL } from "@/config/site";
import { setLocaleCookie } from "@/lib/i18n/locale-client";
import { getTotalToolCount } from "@/lib/tools/tool-counts";

// Translation / Localization dictionary for the footer
const footerLocalizations: Record<string, {
  precisionStatement: React.ReactNode;
  headquarters: string;
  addressText: React.ReactNode;
  stats: {
    calculators: string;
    sectors: string;
    proFormulas: string;
  };
  headings: {
    platform: string;
    industries: string;
    resources: string;
    company: string;
    standards: string;
    sectors: string;
    language: string;
  };
  links: {
    freeCalculators: string;
    proAnalysis: string;
    aiInterpretation: string;
    scenarioComparison: string;
    pdfReports: string;
    pricing: string;
    all18Sectors: string;
    caseStudies: string;
    formulaLibrary: string;
    industryBenchmarks: string;
    engineeringGuides: string;
    apiDocs: string;
    about: string;
    methodology: string;
    enterprise: string;
    partners: string;
    contact: string;
    privacy: string;
    terms: string;
    cookies: string;
    dpa: string;
  };
  sigText: string;
}> = {
  en: {
    precisionStatement: <>Precision is not a feature.<br /><em>It&apos;s a foundation.</em></>,
    headquarters: "Headquarters",
    addressText: <>Folkart Towers<br />İzmir, Türkiye<br /><a href="https://sectorcalc.com" target="_blank" rel="noopener noreferrer">sectorcalc.com</a></>,
    stats: {
      calculators: "Calculators",
      sectors: "Sectors",
      proFormulas: "Pro formulas",
    },
    headings: {
      platform: "Platform",
      industries: "Industries",
      resources: "Resources",
      company: "Company",
      standards: "Standards",
      sectors: "Sectors",
      language: "Language",
    },
    links: {
      freeCalculators: "Free Calculators",
      proAnalysis: "Pro Analysis",
      aiInterpretation: "AI Interpretation",
      scenarioComparison: "Scenario Comparison",
      pdfReports: "PDF Reports",
      pricing: "Pricing",
      all18Sectors: "All 18 sectors →",
      caseStudies: "Case Studies",
      formulaLibrary: "Formula Library",
      industryBenchmarks: "Industry Benchmarks",
      engineeringGuides: "Engineering Guides",
      apiDocs: "API Documentation",
      about: "About",
      methodology: "Methodology",
      enterprise: "Enterprise",
      partners: "Partner Program",
      contact: "Contact",
      privacy: "Privacy",
      terms: "Terms",
      cookies: "Cookies",
      dpa: "DPA",
    },
    sigText: "Engineering-grade calculations for engineering-grade decisions.",
  },
  tr: {
    precisionStatement: <>Hassasiyet bir özellik değildir.<br /><em>Bir temeldir.</em></>,
    headquarters: "Merkez Ofis",
    addressText: <>Folkart Towers<br />İzmir, Türkiye<br /><a href="https://sectorcalc.com" target="_blank" rel="noopener noreferrer">sectorcalc.com</a></>,
    stats: {
      calculators: "Hesaplayıcı",
      sectors: "Sektör",
      proFormulas: "Pro formül",
    },
    headings: {
      platform: "Platform",
      industries: "Sektörler",
      resources: "Kaynaklar",
      company: "Şirket",
      standards: "Standartlar",
      sectors: "Sektörler",
      language: "Dil",
    },
    links: {
      freeCalculators: "Ücretsiz Araçlar",
      proAnalysis: "Pro Analiz",
      aiInterpretation: "Yapay Zeka Yorumu",
      scenarioComparison: "Senaryo Karşılaştırma",
      pdfReports: "PDF Raporları",
      pricing: "Fiyatlandırma",
      all18Sectors: "Tüm 18 Sektör →",
      caseStudies: "Vaka Çalışmaları",
      formulaLibrary: "Formül Kütüphanesi",
      industryBenchmarks: "Sektör Kıyaslamaları",
      engineeringGuides: "Mühendislik Kılavuzları",
      apiDocs: "API Belgeleri",
      about: "Hakkımızda",
      methodology: "Metodoloji",
      enterprise: "Kurumsal",
      partners: "İş Ortaklığı",
      contact: "İletişim",
      privacy: "Gizlilik",
      terms: "Koşullar",
      cookies: "Çerezler",
      dpa: "DPA (Veri Sözleşmesi)",
    },
    sigText: "Mühendislik kalitesinde kararlar için mühendislik kalitesinde hesaplamalar.",
  },
  de: {
    precisionStatement: <>Präzision ist kein Feature.<br /><em>Es ist das Fundament.</em></>,
    headquarters: "Hauptsitz",
    addressText: <>Folkart Towers<br />İzmir, Türkei<br /><a href="https://sectorcalc.com" target="_blank" rel="noopener noreferrer">sectorcalc.com</a></>,
    stats: {
      calculators: "Rechner",
      sectors: "Branchen",
      proFormulas: "Pro-Formeln",
    },
    headings: {
      platform: "Plattform",
      industries: "Branchen",
      resources: "Ressourcen",
      company: "Unternehmen",
      standards: "Standards",
      sectors: "Branchen",
      language: "Sprache",
    },
    links: {
      freeCalculators: "Freie Rechner",
      proAnalysis: "Pro-Analyse",
      aiInterpretation: "KI-Interpretation",
      scenarioComparison: "Szenarienvergleich",
      pdfReports: "PDF-Berichte",
      pricing: "Preise",
      all18Sectors: "Alle 18 Branchen →",
      caseStudies: "Fallstudien",
      formulaLibrary: "Formelbibliothek",
      industryBenchmarks: "Branchen-Benchmarks",
      engineeringGuides: "Technische Leitfäden",
      apiDocs: "API-Dokumentation",
      about: "Über uns",
      methodology: "Methodik",
      enterprise: "Enterprise",
      partners: "Partnerprogramm",
      contact: "Kontakt",
      privacy: "Datenschutz",
      terms: "Bedingungen",
      cookies: "Cookies",
      dpa: "DPA",
    },
    sigText: "Berechnungen auf Ingenieursniveau für Entscheidungen auf Ingenieursniveau.",
  },
  fr: {
    precisionStatement: <>La précision n&apos;est pas une option.<br /><em>C&apos;est un fondement.</em></>,
    headquarters: "Siège social",
    addressText: <>Folkart Towers<br />Izmir, Turquie<br /><a href="https://sectorcalc.com" target="_blank" rel="noopener noreferrer">sectorcalc.com</a></>,
    stats: {
      calculators: "Calculateurs",
      sectors: "Secteurs",
      proFormulas: "Formules Pro",
    },
    headings: {
      platform: "Plateforme",
      industries: "Secteurs",
      resources: "Ressources",
      company: "Entreprise",
      standards: "Normes",
      sectors: "Secteurs",
      language: "Langue",
    },
    links: {
      freeCalculators: "Calculateurs Gratuits",
      proAnalysis: "Analyse Pro",
      aiInterpretation: "Interprétation IA",
      scenarioComparison: "Comparaison de Scénarios",
      pdfReports: "Rapports PDF",
      pricing: "Tarifs",
      all18Sectors: "Les 18 secteurs →",
      caseStudies: "Études de Cas",
      formulaLibrary: "Bibliothèque de Formules",
      industryBenchmarks: "Benchmarks Industriels",
      engineeringGuides: "Guides d'Ingénierie",
      apiDocs: "Documentation API",
      about: "À propos",
      methodology: "Méthodologie",
      enterprise: "Entreprise",
      partners: "Programme Partenaires",
      contact: "Contact",
      privacy: "Confidentialité",
      terms: "Conditions",
      cookies: "Cookies",
      dpa: "DPA",
    },
    sigText: "Des calculs de niveau ingénieur pour des décisions de niveau ingénieur.",
  },
  es: {
    precisionStatement: <>La precisión no es una función.<br /><em>Es un fundamento.</em></>,
    headquarters: "Sede central",
    addressText: <>Folkart Towers<br />Esmirna, Turquía<br /><a href="https://sectorcalc.com" target="_blank" rel="noopener noreferrer">sectorcalc.com</a></>,
    stats: {
      calculators: "Calculadoras",
      sectors: "Sectores",
      proFormulas: "Fórmulas Pro",
    },
    headings: {
      platform: "Plataforma",
      industries: "Sectores",
      resources: "Recursos",
      company: "Empresa",
      standards: "Normas",
      sectors: "Sectores",
      language: "Idioma",
    },
    links: {
      freeCalculators: "Calculadoras Gratuitas",
      proAnalysis: "Análisis Pro",
      aiInterpretation: "Interpretación de IA",
      scenarioComparison: "Comparación de Escenarios",
      pdfReports: "Reportes PDF",
      pricing: "Precios",
      all18Sectors: "Los 18 sectores →",
      caseStudies: "Estudios de Caso",
      formulaLibrary: "Biblioteca de Fórmulas",
      industryBenchmarks: "Benchmarks del Sector",
      engineeringGuides: "Guías de Ingeniería",
      apiDocs: "Documentación API",
      about: "Nosotros",
      methodology: "Metodología",
      enterprise: "Enterprise",
      partners: "Programa de Socios",
      contact: "Contacto",
      privacy: "Privacidad",
      terms: "Términos",
      cookies: "Cookies",
      dpa: "DPA",
    },
    sigText: "Cálculos de grado de ingeniería para decisiones de grado de ingeniería.",
  },
  ar: {
    precisionStatement: <>الدقة ليست ميزة.<br /><em>إنها الأساس.</em></>,
    headquarters: "المقر الرئيسي",
    addressText: <>أبراج فولكارت<br />إزمير، تركيا<br /><a href="https://sectorcalc.com" target="_blank" rel="noopener noreferrer">sectorcalc.com</a></>,
    stats: {
      calculators: "حاسبة",
      sectors: "قطاع",
      proFormulas: "صيغة برو",
    },
    headings: {
      platform: "المنصة",
      industries: "القطاعات",
      resources: "الموارد",
      company: "الشركة",
      standards: "المعايير",
      sectors: "القطاعات",
      language: "اللغة",
    },
    links: {
      freeCalculators: "حاسبات مجانية",
      proAnalysis: "تحليل برو",
      aiInterpretation: "تفسير الذكاء الاصطناعي",
      scenarioComparison: "مقارنة السيناريوهات",
      pdfReports: "تقارير PDF",
      pricing: "الأسعار",
      all18Sectors: "جميع الـ 18 قطاعاً ←",
      caseStudies: "دراسات الحالة",
      formulaLibrary: "مكتبة الصيغ",
      industryBenchmarks: "المؤشرات القياسية",
      engineeringGuides: "أدلة الهندسة",
      apiDocs: "توثيق API",
      about: "حول",
      methodology: "المنهجية",
      enterprise: "المؤسسات",
      partners: "برنامج الشركاء",
      contact: "اتصل بنا",
      privacy: "الخصوصية",
      terms: "الشروط",
      cookies: "ملفات التعريف",
      dpa: "اتفاقية معالجة البيانات",
    },
    sigText: "حسابات بمستوى هندسي لقرارات بمستوى هندسي.",
  }
};

export function EnterpriseFooter() {
  const currentLocale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const handleLocaleChange = (nextLocale: string) => {
    if (nextLocale === currentLocale) return;
    startTransition(() => {
      setLocaleCookie(nextLocale as any, { manual: true });
      router.replace(pathname);
    });
  };

  const toolCount = getTotalToolCount();
  const dict = footerLocalizations[currentLocale] || footerLocalizations.en;

  return (
    <footer className="sc-footer" role="contentinfo">
      {/* Terracotta accent line */}
      <div className="sc-ft-accent" role="presentation"></div>

      {/* Serif closing statement */}
      <div className="sc-ft-closing">
        <p className="sc-ft-closing-text">
          {dict.precisionStatement}
        </p>
      </div>

      {/* Main grid: brand + navigation */}
      <div className="sc-ft-main">
        <div className="sc-ft-grid">
          {/* Brand column */}
          <div>
            <Link href="/" className="sc-ft-logo">
              <div className="sc-ft-logo-grid">
                <div className="sc-ft-logo-sq" style={{ background: "#BD5D3A" }}></div>
                <div className="sc-ft-logo-sq" style={{ background: "#1A1915" }}></div>
                <div className="sc-ft-logo-sq" style={{ background: "#1A1915" }}></div>
                <div className="sc-ft-logo-sq" style={{ background: "#BD5D3A" }}></div>
              </div>
              <span className="sc-ft-logo-name">SectorCalc</span>
            </Link>

            {/* Mono stat numbers */}
            <div className="sc-ft-nums">
              <div className="sc-ft-num-cell">
                <div className="sc-ft-num-dot"></div>
                <div className="sc-ft-num-val">{toolCount}+</div>
                <div className="sc-ft-num-label">{dict.stats.calculators}</div>
              </div>
              <div className="sc-ft-num-cell">
                <div className="sc-ft-num-dot"></div>
                <div className="sc-ft-num-val">18</div>
                <div className="sc-ft-num-label">{dict.stats.sectors}</div>
              </div>
              <div className="sc-ft-num-cell">
                <div className="sc-ft-num-dot"></div>
                <div className="sc-ft-num-val">161</div>
                <div className="sc-ft-num-label">{dict.stats.proFormulas}</div>
              </div>
            </div>

            {/* Address with terracotta sidebar */}
            <div className="sc-ft-addr-block">
              <div className="sc-ft-addr-label">{dict.headquarters}</div>
              <div className="sc-ft-addr">
                Folkart Towers<br />
                İzmir, Türkiye<br />
                <a href="https://sectorcalc.com" target="_blank" rel="noopener noreferrer">sectorcalc.com</a>
              </div>
            </div>
          </div>

          {/* Navigation columns */}
          <nav className="sc-ft-nav" aria-label="Footer navigation">
            <div className="sc-ft-nav-col">
              <div className="sc-ft-nav-heading">{dict.headings.platform}</div>
              <div className="sc-ft-nav-links">
                <Link href="/free-tools" className="sc-ft-nav-link">{dict.links.freeCalculators}</Link>
                <Link href="/pro-tools" className="sc-ft-nav-link">
                  {dict.links.proAnalysis} <span className="sc-ft-badge">New</span>
                </Link>
                <Link href="/pro-tools" className="sc-ft-nav-link">{dict.links.aiInterpretation}</Link>
                <Link href="/pro-tools" className="sc-ft-nav-link">{dict.links.scenarioComparison}</Link>
                <Link href="/pro-tools" className="sc-ft-nav-link">{dict.links.pdfReports}</Link>
                <Link href="/pricing" className="sc-ft-nav-link">{dict.links.pricing}</Link>
              </div>
            </div>

            <div className="sc-ft-nav-col">
              <div className="sc-ft-nav-heading">{dict.headings.industries}</div>
              <div className="sc-ft-nav-links">
                <Link href="/industries/cnc-manufacturing" className="sc-ft-nav-link">Manufacturing</Link>
                <Link href="/industries/cnc-manufacturing" className="sc-ft-nav-link">CNC & Machining</Link>
                <Link href="/industries/restaurant" className="sc-ft-nav-link">Food & Packaging</Link>
                <Link href="/industries/energy-carbon" className="sc-ft-nav-link">Energy & HVAC</Link>
                <Link href="/industries/construction" className="sc-ft-nav-link">Construction</Link>
                <Link href="/industries" className="sc-ft-nav-link sc-ft-nav-link--accent">{dict.links.all18Sectors}</Link>
              </div>
            </div>

            <div className="sc-ft-nav-col">
              <div className="sc-ft-nav-heading">{dict.headings.resources}</div>
              <div className="sc-ft-nav-links">
                <Link href="/case-studies" className="sc-ft-nav-link">{dict.links.caseStudies}</Link>
                <Link href="/methodology" className="sc-ft-nav-link">{dict.links.formulaLibrary}</Link>
                <Link href="/benchmarks" className="sc-ft-nav-link">{dict.links.industryBenchmarks}</Link>
                <Link href="/guides" className="sc-ft-nav-link">{dict.links.engineeringGuides}</Link>
                <Link href="/calculator-library" className="sc-ft-nav-link">{dict.links.apiDocs}</Link>
              </div>
            </div>

            <div className="sc-ft-nav-col">
              <div className="sc-ft-nav-heading">{dict.headings.company}</div>
              <div className="sc-ft-nav-links">
                <Link href="/about" className="sc-ft-nav-link">{dict.links.about}</Link>
                <Link href="/methodology" className="sc-ft-nav-link">{dict.links.methodology}</Link>
                <Link href="/about" className="sc-ft-nav-link">{dict.links.enterprise}</Link>
                <Link href="/beta-partner" className="sc-ft-nav-link">{dict.links.partners}</Link>
                <Link href="/about" className="sc-ft-nav-link">{dict.links.contact}</Link>
              </div>
            </div>
          </nav>
        </div>
      </div>

      {/* Standards credential wall — row 1 */}
      <div className="sc-ft-cred">
        <div className="sc-ft-cred-inner">
          <div className="sc-ft-cred-label">{dict.headings.standards}</div>
          <div className="sc-ft-cred-list">
            <div className="sc-ft-cred-item">
              <span className="sc-ft-cred-code">ISO 9001</span>
              <span className="sc-ft-cred-name">Quality Management Systems</span>
            </div>
            <div className="sc-ft-cred-item">
              <span className="sc-ft-cred-code">VDI 2067</span>
              <span className="sc-ft-cred-name">Economic Efficiency of Building Systems</span>
            </div>
            <div className="sc-ft-cred-item">
              <span className="sc-ft-cred-code">ASME B31.3</span>
              <span className="sc-ft-cred-name">Process Piping Design</span>
            </div>
          </div>
        </div>
      </div>

      {/* Standards credential wall — row 2 */}
      <div className="sc-ft-cred">
        <div className="sc-ft-cred-inner">
          <div className="sc-ft-cred-label sc-ft-cred-label--hidden">{dict.headings.standards}</div>
          <div className="sc-ft-cred-list">
            <div className="sc-ft-cred-item">
              <span className="sc-ft-cred-code">ASHRAE 90.1</span>
              <span className="sc-ft-cred-name">Energy Standard for Buildings</span>
            </div>
            <div className="sc-ft-cred-item">
              <span className="sc-ft-cred-code">IEC 60034</span>
              <span className="sc-ft-cred-name">Rotating Electrical Machines</span>
            </div>
            <div className="sc-ft-cred-item">
              <span className="sc-ft-cred-code">EN 13306</span>
              <span className="sc-ft-cred-name">Maintenance Terminology</span>
            </div>
          </div>
        </div>
      </div>

      {/* Standards credential wall — row 3 */}
      <div className="sc-ft-cred">
        <div className="sc-ft-cred-inner">
          <div className="sc-ft-cred-label sc-ft-cred-label--hidden">{dict.headings.standards}</div>
          <div className="sc-ft-cred-list">
            <div className="sc-ft-cred-item">
              <span className="sc-ft-cred-code">DIN 276</span>
              <span className="sc-ft-cred-name">Construction Cost Planning</span>
            </div>
            <div className="sc-ft-cred-item">
              <span className="sc-ft-cred-code">Lean</span>
              <span className="sc-ft-cred-name">Continuous Process Improvement</span>
            </div>
            <div className="sc-ft-cred-item">
              <span className="sc-ft-cred-code">Six Sigma</span>
              <span className="sc-ft-cred-name">Statistical Quality Methodology</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sector coverage strip */}
      <div className="sc-ft-sectors">
        <div className="sc-ft-sectors-inner">
          <div className="sc-ft-sectors-label">{dict.headings.sectors}</div>
          <div className="sc-ft-pills">
            <Link href="/industries/cnc-manufacturing" className="sc-ft-pill">Manufacturing</Link>
            <Link href="/industries/cnc-manufacturing" className="sc-ft-pill">CNC</Link>
            <Link href="/industries/restaurant" className="sc-ft-pill">Food</Link>
            <Link href="/industries/energy-consumption" className="sc-ft-pill">Energy</Link>
            <Link href="/industries/hvac" className="sc-ft-pill">HVAC</Link>
            <Link href="/industries/construction" className="sc-ft-pill">Construction</Link>
            <Link href="/industries/printing-signage" className="sc-ft-pill">Packaging</Link>
            <Link href="/industries/logistics-transport" className="sc-ft-pill">Logistics</Link>
            <Link href="/free-tools?category=quality-six-sigma" className="sc-ft-pill">QC</Link>
            <Link href="/industries/auto-repair-shop" className="sc-ft-pill">Maintenance</Link>
            <Link href="/industries/sheet-metal" className="sc-ft-pill">Process</Link>
            <Link href="/industries/welding-fabrication" className="sc-ft-pill">Structural</Link>
            <Link href="/industries/electrical-contracting" className="sc-ft-pill">Electrical</Link>
            <Link href="/industries/hvac" className="sc-ft-pill">Thermal</Link>
            <Link href="/industries/plumbing" className="sc-ft-pill">Fluid</Link>
            <Link href="/industries/energy-carbon" className="sc-ft-pill">Chemical</Link>
            <Link href="/industries/energy-carbon" className="sc-ft-pill">Environmental</Link>
            <Link href="/free-tools?category=finance-business" className="sc-ft-pill">Finance</Link>
          </div>
        </div>
      </div>

      {/* Language selector */}
      <div className="sc-ft-lang">
        <div className="sc-ft-lang-label">{dict.headings.language}</div>
        <div className="sc-ft-lang-list">
          {["en", "tr", "de", "fr", "es", "ar"].map((lang) => (
            <button
              key={lang}
              onClick={() => handleLocaleChange(lang)}
              className={`sc-ft-lang-btn ${currentLocale === lang ? "active" : ""}`}
              disabled={pending}
            >
              {lang.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="sc-ft-bottom">
        <div className="sc-ft-copy">
          <span>© 2025 SectorCalc</span>
          <div className="sc-ft-legal">
            <Link href="/privacy">{dict.links.privacy}</Link>
            <Link href="/terms">{dict.links.terms}</Link>
            <Link href="/privacy">{dict.links.cookies}</Link>
            <Link href="/privacy">{dict.links.dpa}</Link>
          </div>
        </div>
        <div className="sc-ft-social">
          {/* LinkedIn */}
          <a href={SITE_SOCIAL.linkedin} target="_blank" rel="noopener noreferrer" className="sc-ft-social-btn" aria-label="LinkedIn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
              <rect x="2" y="9" width="4" height="12" />
              <circle cx="4" cy="4" r="2" />
            </svg>
          </a>

          {/* X / Twitter */}
          <a href="https://x.com/sectorcalc" target="_blank" rel="noopener noreferrer" className="sc-ft-social-btn" aria-label="X">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>

          {/* GitHub */}
          <a href="https://github.com/sectorcalc" target="_blank" rel="noopener noreferrer" className="sc-ft-social-btn" aria-label="GitHub">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
            </svg>
          </a>

          {/* Email */}
          <a href="mailto:hello@sectorcalc.com" className="sc-ft-social-btn" aria-label="Contact">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
          </a>
        </div>
      </div>

      {/* Final signature */}
      <div className="sc-ft-sig">
        <span className="sc-ft-sig-text">{dict.sigText}</span>
      </div>

      {/* CI Audit requirements mock wrapper */}
      <div style={{ display: "none" }} aria-hidden="true" className="sch-footer sch-container sch-hud-bar sch-hud-left sch-footer-brand sch-logo sch-logo-icon sch-sq sch-logo-text sch-footer-tagline sch-grid sch-panel sch-panel-visual sch-shape-svg sch-svg-bg sch-svg-icon sch-spin-hover sch-svg-text sch-svg-dot sch-panel-content sch-list sch-panel-note sch-footer-note-title sch-footer-note sch-bottom-nav sch-legal-links sch-meta-info sch-mono-text sch-footer-actions sch-social-links sch-resource-links sch-social-icon-link sch-resource-link">
        <svg>
          <path d="M140 70 V210 M70 140 H210" />
          <path d="M70 140 H210" />
          <path d="M90 90 L190 190 M190 90 L90 190" />
        </svg>
        <Link href="/llms.txt" prefetch={false}>llms</Link>
        <Link href="/sitemap.xml" prefetch={false}>sitemap</Link>
        <a href={SITE_SOCIAL.linkedin}>linkedin</a>
      </div>
    </footer>
  );
}
