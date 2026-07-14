"use client";

import {
  AdjustmentsHorizontalIcon,
  ArrowRightIcon,
  ArrowsRightLeftIcon,
  BoltIcon,
  CalculatorIcon,
  CameraIcon,
  ChartBarSquareIcon,
  CheckBadgeIcon,
  CheckCircleIcon,
  ClipboardDocumentCheckIcon,
  ClockIcon,
  Cog6ToothIcon,
  CurrencyEuroIcon,
  DocumentArrowDownIcon,
  DocumentChartBarIcon,
  ExclamationTriangleIcon,
  FingerPrintIcon,
  MagnifyingGlassIcon,
  PresentationChartLineIcon,
  ScaleIcon,
  ShieldCheckIcon,
  WrenchScrewdriverIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { ScIcon, type HeroIcon } from "@/components/icons/ScIcon";
import "@/styles/landing-page.css";

type ValueCard = {
  icon: HeroIcon;
  code: string;
  title: string;
  description: string;
  outcome: string;
};

type ProductPath = {
  icon: HeroIcon;
  eyebrow: string;
  title: string;
  description: string;
  features: string[];
  href: string;
  linkLabel: string;
  featured?: boolean;
};

const valueCards: ValueCard[] = [
  {
    icon: CalculatorIcon,
    code: "01",
    title: "Quantify the exposure",
    description:
      "Convert cost, time, scrap, energy, margin, downtime, capacity, and engineering inputs into one decision baseline.",
    outcome: "Know what the problem is worth",
  },
  {
    icon: AdjustmentsHorizontalIcon,
    code: "02",
    title: "Test what can change it",
    description:
      "See sensitivity, tolerance, assumptions, and uncertainty before a fragile estimate reaches production or management.",
    outcome: "Find the decision boundary",
  },
  {
    icon: ClipboardDocumentCheckIcon,
    code: "03",
    title: "Act with a review trail",
    description:
      "Move from a number to a documented action: proceed, hold, reprice, inspect, repair, replace, or escalate.",
    outcome: "Defend the call after it is made",
  },
];

const productPaths: ProductPath[] = [
  {
    icon: BoltIcon,
    eyebrow: "FAST OPERATING ANSWER",
    title: "Free Calculators",
    description: "For focused calculations when you need a reliable number now.",
    features: ["50 essential calculators", "Structured inputs and units", "No sign-in required"],
    href: "/free-tools",
    linkLabel: "Calculate for free",
  },
  {
    icon: DocumentChartBarIcon,
    eyebrow: "DECISION-GRADE ANALYSIS",
    title: "Pro Decision Tools",
    description: "For decisions that affect price, capital, output, margin, or customer commitments.",
    features: ["Sensitivity and scenario analysis", "Decision-ready report output", "Assumptions and risk boundaries"],
    href: "/pro-tools",
    linkLabel: "Explore Pro tools",
    featured: true,
  },
  {
    icon: WrenchScrewdriverIcon,
    eyebrow: "FIELD EVIDENCE TO ACTION",
    title: "Engineering Diagnostics",
    description: "For defects, failures, maintenance issues, and corrective-action investigations.",
    features: ["Photo and measurement context", "Root-cause hypotheses", "NCR and CAPA report support"],
    href: "/engineering-diagnostics",
    linkLabel: "Start diagnostics",
  },
];

const reportCapabilities: Array<{ icon: HeroIcon; title: string; description: string }> = [
  {
    icon: MagnifyingGlassIcon,
    title: "Inputs stay visible",
    description: "The operating boundary and evidence remain attached to the result.",
  },
  {
    icon: ArrowsRightLeftIcon,
    title: "Sensitivity is explicit",
    description: "See which variable can reverse the recommendation before approval.",
  },
  {
    icon: ExclamationTriangleIcon,
    title: "Risk is not hidden",
    description: "Warnings, missing evidence, and qualified-review triggers remain clear.",
  },
  {
    icon: FingerPrintIcon,
    title: "The record can be verified",
    description: "Report identity and verification context support a durable review trail.",
  },
];

const proofCases: Array<{ icon: HeroIcon; meta: string; title: string; description: string; value: string }> = [
  {
    icon: Cog6ToothIcon,
    meta: "OEE + QUOTING",
    title: "CNC workshop",
    description: "Machine-cost and scrap analysis exposed capacity loss and quote leakage.",
    value: "€85K / yr",
  },
  {
    icon: BoltIcon,
    meta: "ENERGY + REPORTING",
    title: "Industrial energy",
    description: "Consumption and reporting analysis surfaced efficiency and compliance overhead.",
    value: "€32K / yr",
  },
  {
    icon: WrenchScrewdriverIcon,
    meta: "WELDING + REWORK",
    title: "Metal fabrication",
    description: "Consumable and process analysis clarified rework exposure and corrective action.",
    value: "€45K / yr",
  },
  {
    icon: ChartBarSquareIcon,
    meta: "OEE + SMED + SCRAP",
    title: "Automotive supply chain",
    description: "A combined operating model made the annualized improvement opportunity visible.",
    value: "€1.23M / yr",
  },
];

const diagnosticFeatures: Array<{ icon: HeroIcon; label: string }> = [
  { icon: CameraIcon, label: "Capture field photos, measurements, and operating context" },
  { icon: WrenchScrewdriverIcon, label: "Structure probable causes and verification steps" },
  { icon: ClipboardDocumentCheckIcon, label: "Prepare NCR and CAPA decision support" },
  { icon: DocumentArrowDownIcon, label: "Export a review-ready investigation report" },
];

const sectorItems: Array<{ icon: HeroIcon; label: string }> = [
  { icon: Cog6ToothIcon, label: "Manufacturing" },
  { icon: WrenchScrewdriverIcon, label: "Maintenance" },
  { icon: ShieldCheckIcon, label: "Quality" },
  { icon: BoltIcon, label: "Energy" },
  { icon: ScaleIcon, label: "Finance" },
  { icon: PresentationChartLineIcon, label: "Engineering" },
];

function SectionHeading({
  eyebrow,
  title,
  description,
  inverse = false,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  inverse?: boolean;
}) {
  return (
    <header className={`landing-section-heading${inverse ? " landing-section-heading--inverse" : ""}`}>
      <p className="landing-kicker">{eyebrow}</p>
      <h2>{title}</h2>
      {description ? <p className="landing-section-lead">{description}</p> : null}
    </header>
  );
}

function IconFrame({ icon, inverse = false }: { icon: HeroIcon; inverse?: boolean }) {
  return (
    <span className={`landing-icon-frame${inverse ? " landing-icon-frame--inverse" : ""}`} aria-hidden="true">
      <ScIcon icon={icon} size="default" />
    </span>
  );
}

function ArrowLink({ href, children, inverse = false }: { href: string; children: React.ReactNode; inverse?: boolean }) {
  return (
    <Link href={href} prefetch={true} className={`landing-arrow-link${inverse ? " landing-arrow-link--inverse" : ""}`}>
      <span>{children}</span>
      <ScIcon icon={ArrowRightIcon} size="compact" />
    </Link>
  );
}

export function LandingPageContent() {
  return (
    <div className="claude-landing">
      <main>
        <section className="landing-hero" aria-labelledby="landing-hero-title">
          <div className="landing-wrap landing-hero-grid">
            <div className="landing-hero-copy">
              <div className="landing-badge">
                <span className="landing-badge-dot" aria-hidden="true" />
                Industrial decision intelligence
              </div>
              <h1 id="landing-hero-title">
                Know the cost.
                <span>See the risk.</span>
                Make the call.
              </h1>
              <p className="landing-hero-lead">
                SectorCalc turns operating data into auditable calculations, sensitivity analysis, and engineering reports for manufacturing decisions.
              </p>
              <div className="landing-hero-actions">
                <Link href="/free-tools" prefetch={true} className="landing-button landing-button--accent">
                  Run a free calculation
                  <ScIcon icon={ArrowRightIcon} size="compact" />
                </Link>
                <Link href="/pro-tools" prefetch={true} className="landing-button landing-button--ink">
                  Explore Pro decision tools
                </Link>
              </div>
              <div className="landing-hero-assurance" aria-label="Platform access summary">
                <span><CheckCircleIcon aria-hidden="true" />50 free calculators</span>
                <span><CheckCircleIcon aria-hidden="true" />No sign-in to start</span>
                <span><CheckCircleIcon aria-hidden="true" />Reports when the stakes rise</span>
              </div>
            </div>

            <aside className="landing-decision-brief" aria-label="Illustrative SectorCalc decision brief">
              <div className="landing-brief-topbar">
                <span>ILLUSTRATIVE DECISION BRIEF</span>
                <span className="landing-brief-status"><i aria-hidden="true" /> ANALYSIS READY</span>
              </div>
              <div className="landing-brief-question">
                <span className="landing-brief-icon" aria-hidden="true"><Cog6ToothIcon /></span>
                <div>
                  <p>CAPITAL EQUIPMENT</p>
                  <h2>Replace or keep the compressor?</h2>
                </div>
              </div>
              <div className="landing-brief-inputs" aria-label="Example analysis inputs">
                <span>ENERGY</span><span>DOWNTIME</span><span>CAPEX</span><span>MAINTENANCE</span>
              </div>
              <div className="landing-brief-result">
                <div>
                  <span>RECOMMENDED ACTION</span>
                  <strong>REPLACE</strong>
                </div>
                <CheckBadgeIcon aria-hidden="true" />
              </div>
              <dl className="landing-brief-metrics">
                <div><dt>Annualized benefit</dt><dd>€38.4K</dd></div>
                <div><dt>Simple payback</dt><dd>14.8 mo</dd></div>
                <div><dt>Decision confidence</dt><dd>Moderate</dd></div>
              </dl>
              <div className="landing-brief-footer">
                <span><FingerPrintIcon aria-hidden="true" /> ASSUMPTIONS TRACEABLE</span>
                <span>SENSITIVITY INCLUDED</span>
              </div>
            </aside>
          </div>
        </section>

        <section className="landing-sector-band" aria-label="SectorCalc decision domains">
          <div className="landing-wrap landing-sector-band-inner">
            <p>Built for decisions across</p>
            <div>
              {sectorItems.map((item) => (
                <span key={item.label}><ScIcon icon={item.icon} size="compact" />{item.label}</span>
              ))}
            </div>
          </div>
        </section>

        <section className="landing-value" aria-labelledby="value-title">
          <div className="landing-wrap">
            <SectionHeading
              eyebrow="FROM INPUT TO ACTION"
              title="The number is only the beginning."
              description="SectorCalc is built for the moment a result must become an operating decision—not another disconnected spreadsheet cell."
            />
            <div className="landing-value-grid">
              {valueCards.map((item) => (
                <article className="landing-value-card" key={item.code}>
                  <div className="landing-card-topline">
                    <IconFrame icon={item.icon} />
                    <span>{item.code}</span>
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  <div className="landing-card-outcome"><CheckCircleIcon aria-hidden="true" />{item.outcome}</div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="landing-products" aria-labelledby="products-title">
          <div className="landing-wrap">
            <div className="landing-products-heading-row">
              <SectionHeading
                eyebrow="CHOOSE THE DECISION DEPTH"
                title="One platform. Three ways to reach clarity."
                description="Start free, move into decision-grade analysis, or investigate field evidence—without rebuilding the problem in another system."
                inverse
              />
              <Link href="/pricing" prefetch={true} className="landing-button landing-button--ghost">Compare access</Link>
            </div>
            <div className="landing-product-grid">
              {productPaths.map((item) => (
                <article className={`landing-product-card${item.featured ? " landing-product-card--featured" : ""}`} key={item.title}>
                  {item.featured ? <span className="landing-product-recommendation">MOST DECISION VALUE</span> : null}
                  <div className="landing-product-head">
                    <IconFrame icon={item.icon} inverse />
                    <span>{item.eyebrow}</span>
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  <ul>
                    {item.features.map((feature) => <li key={feature}><CheckCircleIcon aria-hidden="true" />{feature}</li>)}
                  </ul>
                  <ArrowLink href={item.href} inverse>{item.linkLabel}</ArrowLink>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="landing-report" aria-labelledby="report-title">
          <div className="landing-wrap landing-report-layout">
            <div className="landing-report-copy">
              <SectionHeading
                eyebrow="EXPLAINABLE BY DESIGN"
                title="Not another black-box result."
                description="A serious decision needs more than one final number. Pro outputs preserve the evidence, assumptions, uncertainty, and action logic around it."
              />
              <div className="landing-capability-list">
                {reportCapabilities.map((item) => (
                  <article key={item.title}>
                    <span aria-hidden="true"><ScIcon icon={item.icon} size="compact" /></span>
                    <div><h3>{item.title}</h3><p>{item.description}</p></div>
                  </article>
                ))}
              </div>
              <Link href="/how-it-works" prefetch={true} className="landing-button landing-button--outline">
                See how SectorCalc works
                <ScIcon icon={ArrowRightIcon} size="compact" />
              </Link>
            </div>

            <div className="landing-report-preview" aria-label="Example Pro decision report">
              <div className="landing-report-toolbar">
                <span><i aria-hidden="true" /> PRO DECISION REPORT</span>
                <span>SC-INV-2048</span>
              </div>
              <div className="landing-report-title">
                <DocumentChartBarIcon aria-hidden="true" />
                <div><p>CAPITAL EQUIPMENT APPRAISAL</p><h3>Machine investment decision</h3></div>
                <span className="landing-report-verdict">PROCEED</span>
              </div>
              <div className="landing-report-metric-grid">
                <div><span>NET PRESENT VALUE</span><strong>€214,800</strong><small>Positive case</small></div>
                <div><span>PAYBACK</span><strong>2.7 years</strong><small>Within limit</small></div>
                <div><span>CAPACITY EFFECT</span><strong>+18.6%</strong><small>Expected</small></div>
              </div>
              <div className="landing-sensitivity">
                <div className="landing-sensitivity-heading"><span>SENSITIVITY RANGE</span><strong>Decision remains positive</strong></div>
                <div className="landing-sensitivity-track" aria-hidden="true"><span /><i /></div>
                <div className="landing-sensitivity-labels"><span>DOWNSIDE</span><span>BASE CASE</span><span>UPSIDE</span></div>
              </div>
              <div className="landing-report-actions">
                <div><ExclamationTriangleIcon aria-hidden="true" /><span>Primary reversal risk</span><strong>Utilization below 61%</strong></div>
                <div><ClipboardDocumentCheckIcon aria-hidden="true" /><span>Next review action</span><strong>Validate demand forecast</strong></div>
              </div>
              <div className="landing-report-seal"><FingerPrintIcon aria-hidden="true" /><span>VERIFICATION RECORD</span><strong>SHA-256 · 7f4a...91c2</strong><CheckBadgeIcon aria-hidden="true" /></div>
            </div>
          </div>
        </section>

        <section className="landing-proof" aria-labelledby="proof-title">
          <div className="landing-wrap">
            <div className="landing-proof-heading-row">
              <SectionHeading
                eyebrow="OPERATIONAL EVIDENCE"
                title="Make hidden exposure visible."
                description="Selected anonymized workflow examples show the scale of cost, loss, and improvement opportunities a structured calculation can reveal."
              />
              <Link href="/case-studies" prefetch={true} className="landing-button landing-button--outline">View case studies</Link>
            </div>
            <div className="landing-proof-grid">
              {proofCases.map((item) => (
                <article className="landing-proof-card" key={item.title}>
                  <div className="landing-proof-icon"><ScIcon icon={item.icon} size="default" /></div>
                  <span>{item.meta}</span>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  <strong>{item.value}</strong>
                </article>
              ))}
            </div>
            <p className="landing-proof-note">Illustrative anonymized workflow outcomes. Actual results depend on verified inputs, operating conditions, and review scope.</p>
          </div>
        </section>

        <section className="landing-trust" aria-labelledby="trust-title">
          <div className="landing-wrap landing-trust-layout">
            <div>
              <SectionHeading
                eyebrow="BUILT FOR QUALIFIED REVIEW"
                title="Clarity without false certainty."
                description="SectorCalc separates calculation, evidence, uncertainty, and professional judgment so teams can move faster without hiding what still needs review."
                inverse
              />
              <div className="landing-trust-actions">
                <ArrowLink href="/methodology" inverse>Review the methodology</ArrowLink>
                <ArrowLink href="/trust" inverse>Trust and security</ArrowLink>
                <ArrowLink href="/verify" inverse>Verify a report</ArrowLink>
              </div>
            </div>
            <div className="landing-trust-grid">
              <article><ShieldCheckIcon aria-hidden="true" /><span>01</span><h3>Standards context</h3><p>Relevant ISO, ASME, and engineering context is surfaced without implying certification.</p></article>
              <article><ScaleIcon aria-hidden="true" /><span>02</span><h3>Decision boundaries</h3><p>Material assumptions, uncertainty, and reversal conditions remain visible.</p></article>
              <article><ClockIcon aria-hidden="true" /><span>03</span><h3>Review trail</h3><p>Outputs preserve the logic required for later operational or management review.</p></article>
              <article><FingerPrintIcon aria-hidden="true" /><span>04</span><h3>Verification context</h3><p>Report identity and cryptographic records help protect document integrity.</p></article>
            </div>
          </div>
        </section>

        <section className="landing-diagnostics" aria-labelledby="diagnostics-title">
          <div className="landing-wrap landing-diagnostics-grid">
            <div className="landing-diagnostics-copy">
              <SectionHeading
                eyebrow="ENGINEERING DIAGNOSTICS"
                title="When the evidence is in the field, start there."
                description="Turn photos, measurements, and operating context into a structured investigation with probable causes, corrective actions, and a verification trail."
              />
              <ul className="landing-feature-list">
                {diagnosticFeatures.map((feature) => (
                  <li key={feature.label}><span aria-hidden="true"><ScIcon icon={feature.icon} size="compact" /></span>{feature.label}</li>
                ))}
              </ul>
              <Link href="/engineering-diagnostics" prefetch={true} className="landing-button landing-button--accent">
                Start Engineering Diagnostics
                <ScIcon icon={ArrowRightIcon} size="compact" />
              </Link>
            </div>

            <div className="landing-diagnostic-preview" aria-label="Example Engineering Diagnostics investigation">
              <div className="landing-diagnostic-photo" aria-hidden="true">
                <div className="landing-crosshair landing-crosshair--one"><span>01</span></div>
                <div className="landing-crosshair landing-crosshair--two"><span>02</span></div>
                <div className="landing-weld-line" />
                <CameraIcon />
                <span>FIELD EVIDENCE / WELD JOINT</span>
              </div>
              <div className="landing-diagnostic-report">
                <div><span>INVESTIGATION</span><strong>ED-2026-0042</strong></div>
                <h3>Weld porosity assessment</h3>
                <dl>
                  <div><dt>Probable cause</dt><dd>Shielding gas flow below process range</dd></div>
                  <div><dt>Cost exposure</dt><dd>EUR 4,200</dd></div>
                  <div><dt>Corrective action</dt><dd>Calibrate flow meter and verify operator setup</dd></div>
                </dl>
                <div className="landing-diagnostic-status"><CheckBadgeIcon aria-hidden="true" /><span>Verification plan attached</span></div>
              </div>
            </div>
          </div>
        </section>

        <section className="landing-final-cta" aria-labelledby="final-cta-title">
          <div className="landing-wrap landing-final-cta-inner">
            <div className="landing-final-symbol" aria-hidden="true"><CurrencyEuroIcon /><span>×</span><ExclamationTriangleIcon /></div>
            <div>
              <p className="landing-kicker">CALCULATE BEFORE THE COST BECOMES REAL</p>
              <h2 id="final-cta-title">Your next expensive decision deserves more than a spreadsheet guess.</h2>
              <p>Start with a free calculation. Move to Pro when the decision needs sensitivity, documentation, and a defensible review trail.</p>
            </div>
            <div className="landing-final-actions">
              <Link href="/free-tools" prefetch={true} className="landing-button landing-button--accent">
                Start calculating free
                <ScIcon icon={ArrowRightIcon} size="compact" />
              </Link>
              <Link href="/pricing" prefetch={true} className="landing-button landing-button--ghost">Compare Pro access</Link>
            </div>
          </div>
        </section>

        <section className="landing-scope-note" aria-label="SectorCalc scope notice">
          <div className="landing-wrap">
            <ShieldCheckIcon aria-hidden="true" />
            <p>Decision-support calculations and reports—not financial, legal, or engineering advice. Qualified professional review is required where applicable.</p>
          </div>
        </section>
      </main>
    </div>
  );
}
