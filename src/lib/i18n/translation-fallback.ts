/**
 * Global translation fallback middleware.
 *
 * Provides hardcoded English text for all known translation keys used across
 * public pages.  This is a production workaround until the real localization
 * message system is wired up.
 *
 * Two resolution strategies:
 *  1.  `resolve(key)` - exact lookup in FALLBACK_MAP
 *  2.  `has(key)`     - does the key exist in the map?
 *
 * Keys are stored as `namespace.key` (flat).  The i18n-stub combines the
 * active namespace with the lookup key before calling resolve/has.
 */

export const FALLBACK_MAP: Record<string, string> = {
  // ─── Pricing CTAs ─────────────────────────────────────────────────
  "pricing_v2.plans.starter.cta": "Buy 1 Credit",
  "pricing_v2.plans.essentials.cta": "Get 5 Credits",
  "pricing_v2.plans.popular.cta": "Get 15 Credits",
  "pricing_v2.plans.department.cta": "Get 30 Credits",
  "pricing_v2.plans.enterprise.cta": "Get 100 Credits",
  "pricing_v2.card.credit": "credit",
  "pricing_v2.card.credits": "credits",
  "pricing_v2.card.saveVsSingle": "Save {pct}%",
  "pricing_v2.card.opening": "Opening...",

  // ─── Home / Hero ──────────────────────────────────────────────────
  "homepageHybrid.hero.title": "Sector-Specific Engineering Calculators",
  "homepageHybrid.hero.subtitle":
    "Precision calculation models for industry professionals - free checks and paid decision reports.",
  "homepageHybrid.coverage.subtitle": "",
  "homepageHybrid.losses.subtitle": "",
  "industrialHome.hero.title": "Industrial Intelligence Platform",
  "industrialHome.hero.subtitle": "",

  // ─── For Consultants ──────────────────────────────────────────────
  "forConsultants.eyebrow": "FOR CONSULTANTS",
  "forConsultants.title": "Engineering Calculators Built for Consultants",
  "forConsultants.description":
    "Save hours per proposal with sector-specific calculation models. Generate professional PDF reports in minutes.",
  "forConsultants.builtFor": "Built for",
  "forConsultants.audience.0": "Manufacturing Consultants",
  "forConsultants.audience.1": "Process Engineers",
  "forConsultants.audience.2": "Quality Specialists",
  "forConsultants.audience.3": "Cost Estimators",
  "forConsultants.audience.4": "Maintenance Managers",
  "forConsultants.audience.5": "Industrial Engineers",
  "forConsultants.benefits.0.title": "Cut Calculation Time",
  "forConsultants.benefits.0.description":
    "Replace spreadsheet macros with verified, sector-specific calculation models.",
  "forConsultants.benefits.1.title": "Professional Reports",
  "forConsultants.benefits.1.description":
    "Generate PDF decision reports with full methodology, assumptions, and risk analysis.",
  "forConsultants.benefits.2.title": "Trust & Transparency",
  "forConsultants.benefits.2.description":
    "Every calculation includes reference standards, uncertainty bounds, and a verifiable audit trail.",
  "forConsultants.allCalculators": "All Calculators",
  "forConsultants.allCalculatorsDesc":
    "Browse our full catalog of engineering and industrial calculators.",
  "forConsultants.viewPricing": "View Pricing →",
  "forConsultants.consultantProgram": "Consultant Partnership Program",
  "forConsultants.consultantProgramDesc":
    "Get priority access to new tools, API credits, and co-branded reports.",
  "forConsultants.seeSampleReport": "See Sample Report",
  "forConsultants.ctaTitle": "Ready to streamline your calculations?",
  "forConsultants.ctaSubtitle": "Start with a free sector check or unlock the full premium library.",
  "forConsultants.ctaPrimary": "Browse Calculators",
  "forConsultants.ctaSecondary": "See Pricing",
  "forConsultants.meta.title": "For Consultants",
  "forConsultants.meta.description":
    "Sector-specific engineering calculators for consultants. Save hours per proposal.",

  // ─── Login / Signup ───────────────────────────────────────────────
  "loginPage.title": "Sign In",
  "loginPage.subtitle": "Access your reports, credits, and account settings.",
  "loginPage.meta.title": "Sign In | SectorCalc",
  "loginPage.meta.description": "Sign in to your SectorCalc account.",

  // ─── Premium Access (Sign-in Panel) ──────────────────────────────
  "premiumAccess.panelTitle": "Sign In",
  "premiumAccess.panelDescription": "Access your reports, credits, and account settings.",
  "premiumAccess.signInButton": "Sign in with Google",
  "premiumAccess.signingIn": "Signing in...",

  // ─── Privacy ──────────────────────────────────────────────────────
  "privacy.title": "Privacy Policy",
  "privacy.heroDescription":
    "How we collect, use, and protect your data when you use SectorCalc.",
  "privacy.effective": "Effective: January 1, 2024",
  "privacy.intro":
    "SectorCalc (\"we\", \"our\", \"us\") respects your privacy. This policy describes our practices regarding data collection and usage.",
  "privacy.section1.title": "1. Information We Collect",
  "privacy.section1.content":
    "We collect information you provide directly: name, email, company, and any inputs you submit to our calculators. We also automatically collect usage data such as page views, tool selections, and calculation parameters.",
  "privacy.section2.title": "2. How We Use Your Information",
  "privacy.section2.content":
    "We use your information to provide and improve our calculation tools, process payments, send service updates, and analyze platform usage patterns.",
  "privacy.section3.title": "3. Data Sharing",
  "privacy.section3.content":
    "We do not sell your personal data. We may share anonymized, aggregated data with partners or publish benchmark statistics. Payment information is processed by Paddle and never stored on our servers.",
  "privacy.section4.title": "4. Data Retention",
  "privacy.section4.content":
    "We retain your account data for as long as your account is active. Calculation inputs are retained for 12 months to support report regeneration. You may request deletion at any time.",
  "privacy.section5.title": "5. Your Rights",
  "privacy.section5.content":
    "You may access, correct, or delete your personal data at any time through your account settings or by emailing info@sectorcalc.com.",
  "privacy.section6.title": "6. Cookies",
  "privacy.section6.content":
    "We use essential cookies for authentication and session management. We use analytics cookies to understand platform usage. You can disable cookies in your browser settings.",
  "privacy.section7.title": "7. Security",
  "privacy.section7.content":
    "We implement industry-standard security measures including encryption in transit (TLS) and at rest. We conduct regular security audits.",
  "privacy.section8.title": "8. International Transfers",
  "privacy.section8.content":
    "Your data may be processed in the United States or other countries where our service providers operate. We ensure appropriate safeguards are in place.",
  "privacy.section9.title": "9. Contact",
  "privacy.section9.content":
    "For privacy-related inquiries, contact us at info@sectorcalc.com.",

  // ─── Legal Common ─────────────────────────────────────────────────
  "legalCommon.eyebrow": "LEGAL",
  "legalCommon.privacyFooter":
    "See our <privacy>Privacy Policy</privacy> and <refund>Refund Policy</refund> for more details.",
  "legalCommon.termsFooter":
    "See our <terms>Terms of Service</terms> and <refund>Refund Policy</refund> for more details.",

  // ─── Terms ────────────────────────────────────────────────────────
  "terms.title": "Terms of Service",
  "terms.heroDescription":
    "The terms governing your use of SectorCalc calculation tools and services.",
  "terms.lastUpdated": "Last updated: {date}",
  "terms.lastUpdatedDate": "January 1, 2024",
  "terms.intro":
    "By using SectorCalc (\"the Platform\"), you agree to these terms. If you do not agree, do not use the Platform.",
  "terms.section1.title": "1. Service Description",
  "terms.section1.content":
    "SectorCalc provides sector-specific calculation models and decision-report tools. Free tools provide basic checks. Paid tools provide full analysis, risk drivers, and PDF export.",
  "terms.section2.title": "2. User Accounts",
  "terms.section2.content":
    "You are responsible for maintaining the confidentiality of your account credentials. You must be 18 or older to create an account.",
  "terms.section3.title": "3. Credits & Payments",
  "terms.section3.content":
    "Credits are purchased via Paddle. Credits are non-refundable except as stated in our Refund Policy. Credits expire 12 months from purchase.",
  "terms.section4.title": "4. Acceptable Use",
  "terms.section4.content":
    "You agree not to misuse the Platform, including automated scraping, reverse engineering, or interfering with service operations.",
  "terms.section5.title": "5. Intellectual Property",
  "terms.section5.content":
    "Calculation models, methodologies, and output formats are proprietary. You may use generated reports for your business purposes but may not redistribute the calculation engine.",
  "terms.section6.title": "6. Disclaimer",
  "terms.section6.content":
    "Calculations are for informational and decision-support purposes only. They do not constitute professional engineering, legal, or financial advice.",
  "terms.section7.title": "7. Limitation of Liability",
  "terms.section7.content":
    "SectorCalc shall not be liable for indirect, incidental, or consequential damages arising from use of the Platform.",

  // ─── Refund Policy ────────────────────────────────────────────────
  "refundPolicy.title": "Refund Policy",
  "refundPolicy.heroDescription":
    "Our 7-day guarantee and refund terms for credit purchases.",
  "refundPolicy.lastUpdated": "Last updated: {date}",
  "refundPolicy.lastUpdatedDate": "January 1, 2024",
  "refundPolicy.intro":
    "We stand behind our calculation tools. If your first credit does not produce a usable result, we will restore it.",
  "refundPolicy.section1.title": "1. 7-Day Guarantee",
  "refundPolicy.section1.content":
    "If your first calculation does not yield a usable result, email us within 7 days of purchase. We will restore your credit.",
  "refundPolicy.section2.title": "2. Non-Refundable Credits",
  "refundPolicy.section2.content":
    "Credits that have been successfully used for a calculation are non-refundable. Unused credits that have passed the 12-month validity period are non-refundable.",
  "refundPolicy.section3.title": "3. How to Request",
  "refundPolicy.section3.content":
    "Email info@sectorcalc.com with your purchase email and the tool you used. We respond within 2 business days.",

  // ─── Disclaimer ───────────────────────────────────────────────────
  "disclaimerPage.eyebrow": "DISCLAIMER",
  "disclaimerPage.title": "Legal Disclaimer",
  "disclaimerPage.description":
    "Important notices about the use of SectorCalc calculation tools and generated reports.",
  "disclaimerPage.intro":
    "SectorCalc (\"the Platform\") provides technical calculation models for informational and decision-support purposes only.",
  "disclaimerPage.sections": "",

  // ─── Verify ───────────────────────────────────────────────────────
  "verify.eyebrow": "REPORT VERIFICATION",
  "verify.title": "Verify a Decision Report",
  "verify.description":
    "Enter a report ID or scan a verification hash to validate the authenticity and integrity of a SectorCalc decision report.",
  "verify.metaTitle": "Verify Report | SectorCalc",
  "verify.metaDescription":
    "Verify the authenticity and integrity of a SectorCalc decision report.",

  // ─── Beta Partner ─────────────────────────────────────────────────
  "betaPartner.metaTitle": "Beta Partner Program | SectorCalc",
  "betaPartner.metaDescription":
    "Join the SectorCalc beta partner program and help shape the future of industrial calculations.",
  "betaPartner.hero.eyebrow": "BETA PARTNER PROGRAM",
  "betaPartner.hero.title": "Help Shape the Future of Industrial Calculations",
  "betaPartner.hero.subtitle":
    "Join a select group of industry professionals who guide our tool development.",
  "betaPartner.who.title": "Who We Are Looking For",
  "betaPartner.who.item1": "Manufacturing, process, or quality engineers",
  "betaPartner.who.item2": "Cost estimators and procurement specialists",
  "betaPartner.who.item3": "Industrial consultants and advisors",
  "betaPartner.who.item4": "Anyone who regularly performs technical calculations",
  "betaPartner.data.title": "What Data We Collect",
  "betaPartner.data.item1": "Anonymized calculation parameters and results",
  "betaPartner.data.item2": "Tool usage frequency and feature preferences",
  "betaPartner.data.item3": "Feedback ratings and qualitative comments",
  "betaPartner.benefits.title": "Benefits of Joining",
  "betaPartner.benefits.item1": "Free premium credits during the beta period",
  "betaPartner.benefits.item2": "Early access to new tools and features",
  "betaPartner.benefits.item3": "Direct influence on tool design and priorities",
  "betaPartner.form.heading": "Apply to Join",
  "betaPartner.form.intro":
    "Fill out the form below and we will review your application within 3 business days.",

  // ─── Developer Showcase ───────────────────────────────────────────
  "developerShowcase.eyebrow": "DEVELOPER SHOWCASE",
  "developerShowcase.title": "SectorCalc Developer Showcase",
  "developerShowcase.intro":
    "A curated collection of technical demonstrations, integration examples, and platform capabilities.",
  "developerShowcase.semantic.title": "Semantic Calculation Engine",
  "developerShowcase.semantic.body":
    "Each tool understands the domain context of its inputs - units, tolerances, and applicable standards are resolved automatically.",
  "developerShowcase.semantic.item1": "Automatic unit detection and conversion",
  "developerShowcase.semantic.item2": "Standard-aware reference data binding",
  "developerShowcase.semantic.item3": "Uncertainty propagation through multi-step calculations",
  "developerShowcase.resources.title": "Resources",
  "developerShowcase.resources.library": "View API Documentation",
  "developerShowcase.resources.note":
    "API access is currently available for Enterprise plan subscribers.",
  "developerShowcase.index.title": "Calculator Index",
  "developerShowcase.index.body":
    "Browse the complete catalog of available calculation tools.",

  // ─── Catalog Explorer Labels ──────────────────────────────────────
  "catalogExplorer.labels.free-tools.countLabel": "{count} tools",
  "catalogExplorer.labels.free-tools.allLabel": "All Free Tools",
  "catalogExplorer.labels.premium-tools.countLabel": "{count} tools",
  "catalogExplorer.labels.premium-tools.allLabel": "All Premium Analyzers",

  // ─── Categories ───────────────────────────────────────────────────
  "catalogExplorer.categories.eyebrow": "CATEGORIES",
  "catalogExplorer.categories.title": "Browse by Category",
  "catalogExplorer.categories.subtitle":
    "Find the right calculation tool for your specific engineering or industrial need.",

  // ─── Generated Tools Catalog ──────────────────────────────────────
  "generatedToolCatalog.eyebrow": "FREE CALCULATORS",
  "generatedToolCatalog.title": "Free Engineering Calculators",
  "generatedToolCatalog.subtitleCompact":
    "Quick, browser-based checks for common engineering calculations.",
  "generatedToolCatalog.metaTitle": "Free Engineering Calculators | SectorCalc",
  "generatedToolCatalog.metaDescription":
    "Free, browser-based engineering calculators for common industrial calculations.",

  // ─── About ────────────────────────────────────────────────────────
  "aboutPage.hero.title": "About SectorCalc",
  "aboutPage.hero.lead":
    "We are building the world's most comprehensive platform for sector-specific engineering calculations.",
  "aboutPage.seoTitle": "About Us | SectorCalc",
  "aboutPage.seoDescription":
    "Learn about SectorCalc's mission, team, and approach to industrial calculation tools.",

  // ─── How It Works ─────────────────────────────────────────────────
  "howItWorks.meta.title": "How It Works | SectorCalc",
  "howItWorks.meta.description":
    "Learn how SectorCalc works - from free checks to premium decision reports.",
  "howItWorks.eyebrow": "HOW IT WORKS",
  "howItWorks.title": "From Free Check to Paid Decision - in Minutes",
  "howItWorks.lead":
    "SectorCalc turns complex engineering calculations into simple web forms. Get answers fast, with full transparency and traceability.",
  "howItWorks.privacyNote":
    "Free tools run entirely in your browser. Nothing is stored unless you save a report.",
  "howItWorks.compareTitle": "Free vs Premium",
  "howItWorks.freeTitle": "Free Tool",
  "howItWorks.premiumTitle": "Premium Analyzer",
  "howItWorks.linksFree": "Browse Free Tools",
  "howItWorks.linksSample": "See a Sample Report",
  "howItWorks.linksPremium": "Browse Premium Analyzers",
  "howItWorks.linksPricing": "See Pricing",

  // ─── Calculator Library ───────────────────────────────────────────
  "calculatorLibrary.metaTitle": "Calculator Library | SectorCalc",
  "calculatorLibrary.meta.description":
    "Browse the complete SectorCalc library of engineering and industrial calculators.",
  "calculatorLibrary.title": "Calculator Library",
  "calculatorLibrary.lead":
    "Browse our complete catalog of sector-specific calculation tools.",
  "calculatorLibrary.resourcesTitle": "Resources",

  // ─── Industries ───────────────────────────────────────────────────
  "industries.metaTitle": "Industries | SectorCalc",
  "industries.meta.description":
    "Browse engineering calculators by industry sector.",
  "industries.title": "Industries We Serve",
  "industries.subtitle":
    "Find the right calculation tools for your specific industry.",
  "industries.searchPlaceholder": "Search tools by industry...",
  "industries.categoryTitle": "All Industries",

  // ─── Free Tools ───────────────────────────────────────────────────
  "freeTools.metaTitle": "Free Engineering Calculators | SectorCalc",
  "freeTools.meta.description":
    "Free, browser-based engineering calculators for quick checks.",
  "freeTools.title": "Free Calculators",
  "freeTools.subtitle": "Quick, browser-based checks - no account needed.",
  "freeTools.searchPlaceholder": "Search free calculators...",
  "freeTools.categoryTitle": "Categories",

  // ─── Premium Tools ────────────────────────────────────────────────
  "premiumTools.metaTitle": "Premium Analyzers | SectorCalc",
  "premiumTools.meta.description":
    "Full-featured premium calculation analyzers with PDF export.",
  "premiumTools.title": "Premium Analyzers",
  "premiumTools.subtitle": "Full-featured analyzers with PDF export and comprehensive parameter control.",
  "premiumTools.searchPlaceholder": "Search premium analyzers...",
  "premiumTools.categoryTitle": "Categories",

  // ─── SEO Pages ────────────────────────────────────────────────────
  "seoPage.guidesEyebrow": "GUIDE",
  "seoPage.whatYouCalculate": "What You Will Calculate",
  "seoPage.faq": "Frequently Asked Questions",
  "seoPage.relatedGuides": "Related Guides",
  "seoPage.seoHubIndex": "All Guides",

  // ─── Audit ────────────────────────────────────────────────────────
  "auditPage.meta.title": "Sustainability Audit | SectorCalc",
  "auditPage.meta.description":
    "Measure and benchmark your manufacturing sustainability metrics.",
  "auditPage.semanticTitle": "Related Resources",

  // ─── Benchmarks ───────────────────────────────────────────────────
  "benchmarksPage.meta.title": "Industry Benchmarks | SectorCalc",
  "benchmarksPage.meta.description":
    "Compare your operational metrics against industry benchmarks.",
  "benchmarksPage.semanticTitle": "More Resources",

  // ─── Sustainability ───────────────────────────────────────────────
  "sustainabilityPage.meta.title": "Sustainability Tools | SectorCalc",
  "sustainabilityPage.meta.description":
    "Measure and improve your manufacturing sustainability.",
  "sustainabilityPage.semanticTitle": "More Resources",

  // ─── Case Studies Database ────────────────────────────────────────
  "caseStudies.database.breadcrumbHome": "Home",
  "caseStudies.database.breadcrumbCurrent": "Case Studies",
  "caseStudies.database.filterIndustry": "Industry",
  "caseStudies.database.filterAll": "All",
  "caseStudies.database.filterCountry": "Country",
  "caseStudies.database.filterYear": "Year",
  "caseStudies.database.filterSavings": "Savings",
  "caseStudies.database.filterSavingsAll": "All",
  "caseStudies.database.filterSavings0To100k": "€0 - €100k",
  "caseStudies.database.filterSavings100kTo500k": "€100k - €500k",
  "caseStudies.database.filterSavings500kTo1m": "€500k - €1m",
  "caseStudies.database.filterSavings1mPlus": "€1m+",
  "caseStudies.database.filterApply": "Apply",
  "caseStudies.database.filterCsv": "Download CSV",
  "caseStudies.database.indexSummaryHeading": "Real Results from Engineering Decisions",
  "caseStudies.database.indexSummaryIntro": "Each case study documents a real operational loss, the calculation method used, and the financial impact of the recommended action. Companies and names are anonymized to protect confidentiality.",
  "caseStudies.database.indexSummaryLineSavingsOnly": "{company} - {savings} in savings",
  "caseStudies.database.indexSummaryLineWithMetric": "{company} - {metric}: {before} to {after}, {savings} savings",
  "caseStudies.database.colIndex": "#",
  "caseStudies.database.colCompany": "Company",
  "caseStudies.database.colCity": "City",
  "caseStudies.database.colCountry": "Country",
  "caseStudies.database.colIndustry": "Industry",
  "caseStudies.database.colProjectDuration": "Duration",
  "caseStudies.database.colBefore": "Before",
  "caseStudies.database.colAfter": "After",
  "caseStudies.database.colSavings": "Savings",
  "caseStudies.database.colYear": "Year",
  "caseStudies.database.colDetail": "Details",
  "caseStudies.database.detailLink": "View Case Study",
  "caseStudies.database.unspecified": "N/A",
  "caseStudies.database.noResults": "No case studies match the selected filters.",
  "caseStudies.database.emDash": "-",
  "caseStudies.database.authorityLine1": "This database is maintained and updated quarterly. All figures are anonymized.",
  "caseStudies.database.authorityLine2": "Updated {date} - {total} case studies indexed.",
  "caseStudies.database.metaTitle": "Case Studies | SectorCalc",
  "caseStudies.database.metaDescription": "Real-world examples of how SectorCalc tools drive decisions.",

  // ─── Case Studies ─────────────────────────────────────────────────
  "caseStudiesIndex.metaTitle": "Case Studies | SectorCalc",
  "caseStudiesIndex.metaDescription":
    "Real-world examples of how SectorCalc tools drive decisions.",

  // ─── Checkout ─────────────────────────────────────────────────────
  "checkoutSuccess.successEyebrow": "PURCHASE CONFIRMED",
  "checkoutSuccess.successTitle": "Thank You for Your Purchase!",
  "checkoutSuccess.successText":
    "Your credits have been added to your account. Start using them on any premium analyzer.",

  // ─── Data ─────────────────────────────────────────────────────────
  "seoAuthority.dataPageMetaTitle": "Data & Benchmarks | SectorCalc",
  "seoAuthority.dataPageHeading": "Industry Data & Benchmarks",
  "seoAuthority.dataPageLead":
    "Access anonymized, aggregated benchmark data from real industrial calculations.",

  // ─── OS / Operating System ────────────────────────────────────────
  "operatingSystemPage.meta.title": "Manufacturing OS | SectorCalc",
  "operatingSystemPage.meta.description":
    "The Manufacturing Operating System - connect tools, data, and decisions.",

  // ─── Methodology ──────────────────────────────────────────────────
  "methodologyPage.meta.title": "Methodology | SectorCalc",
  "methodologyPage.meta.description":
    "Learn about the calculation methodologies used across SectorCalc tools.",

  // ─── Manifesto ────────────────────────────────────────────────────
  "manifestoPage.meta.title": "Manifesto | SectorCalc",
  "manifestoPage.meta.description":
    "The vision and principles behind SectorCalc.",

  // ─── Trust ────────────────────────────────────────────────────────
  "trustPage.meta.title": "Trust & Security | SectorCalc",
  "trustPage.meta.description":
    "Learn how SectorCalc ensures calculation accuracy, data privacy, and report integrity.",

  // ─── Investor Demo ────────────────────────────────────────────────
  "investorDemoPage.meta.title": "Investor Demo | SectorCalc",
  "investorDemoPage.meta.description":
    "SectorCalc platform demo for investors and partners.",

  // ─── CNC Quote Risk ───────────────────────────────────────────────
  "cncQuoteRiskPage.meta.title": "CNC Quote Risk Analyzer | SectorCalc",
  "cncQuoteRiskPage.meta.description":
    "Analyze risk factors in your CNC machining quotes.",

  // ─── Construction Bid Margin ──────────────────────────────────────
  "constructionBidMarginPage.meta.title":
    "Construction Bid Margin Analyzer | SectorCalc",
  "constructionBidMarginPage.meta.description":
    "Analyze margin risk in construction bids.",

  // ─── Cleaning Contract Margin ─────────────────────────────────────
  "cleaningContractMarginPage.meta.title":
    "Cleaning Contract Margin Analyzer | SectorCalc",
  "cleaningContractMarginPage.meta.description":
    "Analyze margin risk in cleaning contracts.",

  // ─── Account Pages ────────────────────────────────────────────────
  "accountPage.meta.title": "My Account | SectorCalc",
  "accountPage.meta.description": "Manage your SectorCalc account settings.",
  "accountCreditsPage.meta.title": "My Credits | SectorCalc",
  "accountCreditsPage.meta.description":
    "View and manage your SectorCalc credits.",
  "accountReportsPage.meta.title": "My Reports | SectorCalc",
  "accountReportsPage.meta.description":
    "View your saved SectorCalc reports.",
  "accountFeedbackPage.meta.title": "Feedback | SectorCalc",
  "accountFeedbackPage.meta.description":
    "Submit feedback about SectorCalc calculators.",
  "accountReportDetailPage.meta.title": "Report Details | SectorCalc",
  "accountReportDetailPage.meta.description":
    "View details of your SectorCalc report.",

  // ─── Sample Report ───────────────────────────────────────────────
  "sampleReportPage.meta.title": "Sample Decision Report | SectorCalc",
  "sampleReportPage.meta.description":
    "Preview a sample SectorCalc premium decision report.",

  // ─── Developer Showcase (page-level) ──────────────────────────────
  "developerShowcase.meta.title": "Developer Showcase | SectorCalc",
  "developerShowcase.meta.description":
    "Technical demonstrations of SectorCalc platform capabilities.",

  // ─── Premium Schema Page (featured question + bullets) ───────────
  "premiumSchemaPage.eyebrow": "PREMIUM ANALYZER",
  "premiumSchemaPage.featuredQuestion": "What does {name} analyze?",
  "premiumSchemaPage.bullet1": "Comprehensive input collection covering all cost and operational parameters.",
  "premiumSchemaPage.bullet2": "Real-time calculation with risk thresholds and actionable insights.",
  "premiumSchemaPage.bullet3": "PDF export with full methodology, assumptions, and decision report.",
  "premiumSchemaPage.legalQuestion": "Is this financial or legal advice?",
  "premiumSchemaPage.legalAnswer":
    "No. SectorCalc provides technical simulations for decision support only. Verify all results with qualified professionals before making business decisions.",
};

/**
 * Resolve a translation key to its English text.
 * Returns the mapped string, or the key itself if not found.
 */
export function resolve(key: string): string {
  return FALLBACK_MAP[key] ?? key;
}

/**
 * Check if a translation key has a mapping.
 */
export function has(key: string): boolean {
  return key in FALLBACK_MAP;
}
