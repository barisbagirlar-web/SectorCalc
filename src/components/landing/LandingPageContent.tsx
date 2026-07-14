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
  Cog6ToothIcon,
  DocumentArrowDownIcon,
  DocumentChartBarIcon,
  ExclamationTriangleIcon,
  FingerPrintIcon,
  FireIcon,
  MagnifyingGlassIcon,
  PresentationChartLineIcon,
  ShieldCheckIcon,
  TruckIcon,
  WrenchScrewdriverIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { ScIcon, type HeroIcon } from "@/components/icons/ScIcon";
import "@/styles/landing-page.css";

type IconItem = {
  icon: HeroIcon;
  title: string;
  description: string;
  href?: string;
  linkLabel?: string;
  meta?: string;
};

const outcomes: IconItem[] = [
  {
    icon: CalculatorIcon,
    title: "Find the number behind the problem",
    description:
      "Calculate machine cost, OEE, scrap, quote margin, energy loss, payback, downtime, FMEA RPN, and engineering risk from structured inputs.",
    href: "/free-tools",
    linkLabel: "Search calculators",
  },
  {
    icon: ClipboardDocumentCheckIcon,
    title: "Turn a result into a decision",
    description:
      "Move from a calculated value to a defensible action: proceed, hold, reprice, inspect, repair, reduce risk, or escalate for review.",
    href: "/pro-tools",
    linkLabel: "Explore Pro Tools",
  },
  {
    icon: CameraIcon,
    title: "Diagnose issues from evidence",
    description:
      "Combine field photos, measurements, and operating context into a structured diagnostic report with root-cause hypotheses and verification records.",
    href: "/engineering-diagnostics",
    linkLabel: "Start Diagnostics",
  },
];

const decisionPaths: IconItem[] = [
  {
    icon: BoltIcon,
    title: "Free Tools",
    meta: "FAST OPERATIONAL CHECKS",
    description:
      "Everyday calculators for cost, margin, energy, production, logistics, finance, and core engineering questions.",
    href: "/free-tools",
    linkLabel: "Browse Free Tools",
  },
  {
    icon: DocumentChartBarIcon,
    title: "Pro Tools",
    meta: "DECISION-GRADE ANALYSIS",
    description:
      "Sensitivity, tolerance guidance, business impact, uncertainty notes, and review-ready report outputs for higher-stakes decisions.",
    href: "/pro-tools",
    linkLabel: "Explore Pro Tools",
  },
  {
    icon: WrenchScrewdriverIcon,
    title: "Engineering Diagnostics",
    meta: "FIELD EVIDENCE TO REPORT",
    description:
      "Photo- and measurement-led investigation for defects, failures, quality issues, maintenance problems, and corrective-action reviews.",
    href: "/engineering-diagnostics",
    linkLabel: "Start Diagnostics",
  },
];

const caseStudies: IconItem[] = [
  {
    icon: Cog6ToothIcon,
    title: "CNC workshop",
    meta: "TURKEY · €85K/YR",
    description: "OEE gap and quote leakage identified through machining-cost and scrap-rate analysis.",
  },
  {
    icon: BoltIcon,
    title: "Energy and carbon",
    meta: "TURKEY · €32K/YR",
    description: "Reporting automation reduced manual compliance overhead and exposed efficiency losses.",
  },
  {
    icon: FireIcon,
    title: "Welding and metal",
    meta: "TURKEY · €45K/YR",
    description: "Consumable and process analysis supported weld-cost reduction and rework prevention.",
  },
  {
    icon: TruckIcon,
    title: "Automotive supply chain",
    meta: "GERMANY · €1.23M/YR",
    description: "OEE, SMED, and scrap optimization strengthened 5S performance and operating control.",
  },
];

const methodology: Array<{ icon: HeroIcon; label: string; code: string }> = [
  { icon: CalculatorIcon, label: "What was calculated", code: "01" },
  { icon: AdjustmentsHorizontalIcon, label: "Which inputs changed the result", code: "02" },
  { icon: ExclamationTriangleIcon, label: "Where the tolerance or risk zone starts", code: "03" },
  { icon: ArrowsRightLeftIcon, label: "What can flip the decision", code: "04" },
  { icon: MagnifyingGlassIcon, label: "What evidence is missing", code: "05" },
  { icon: CheckCircleIcon, label: "What action should be taken next", code: "06" },
  { icon: ShieldCheckIcon, label: "When qualified professional review is required", code: "07" },
];

const diagnosticFeatures: Array<{ icon: HeroIcon; label: string }> = [
  { icon: CameraIcon, label: "Photo-based issue capture with measurement context" },
  { icon: WrenchScrewdriverIcon, label: "CNC, welding, steel, concrete, electrical, and mechanical domains" },
  { icon: ClipboardDocumentCheckIcon, label: "NCR and CAPA draft support" },
  { icon: DocumentArrowDownIcon, label: "Decision-ready PDF report output" },
  { icon: FingerPrintIcon, label: "Cryptographic verification record" },
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

function CardIcon({ icon, inverse = false }: { icon: HeroIcon; inverse?: boolean }) {
  return (
    <span className={`landing-icon-frame${inverse ? " landing-icon-frame--inverse" : ""}`} aria-hidden="true">
      <ScIcon icon={icon} size="default" />
    </span>
  );
}

function ArrowLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} prefetch={true} className="landing-arrow-link">
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
                Industrial decision platform
              </div>
              <h1 id="landing-hero-title">
                Calculate the exposure.
                <span>Make the operating decision.</span>
              </h1>
              <p className="landing-hero-lead">
                Estimate cost, risk, downtime, margin, and production impact before uncertainty becomes an expensive operational mistake.
              </p>
              <div className="landing-hero-actions">
                <Link href="/free-tools" prefetch={true} className="landing-button landing-button--accent">
                  Explore Free Calculators
                  <ScIcon icon={ArrowRightIcon} size="compact" />
                </Link>
                <Link href="/pro-tools" prefetch={true} className="landing-button landing-button--ink">
                  View Pro Tools
                </Link>
              </div>
              <div className="landing-hero-proof" aria-label="Platform inventory">
                <span><strong>50</strong> free calculators</span>
                <span><strong>20</strong> Pro analyzers</span>
                <span><strong>27</strong> industry sectors</span>
              </div>
            </div>

            <aside className="landing-decision-panel" aria-label="SectorCalc decision workflow">
              <div className="landing-panel-header">
                <span>DECISION TRACE</span>
                <span className="landing-panel-status"><i aria-hidden="true" /> READY</span>
              </div>
              <div className="landing-panel-body">
                <div className="landing-panel-symbol" aria-hidden="true">
                  <ChartBarSquareIcon />
                </div>
                <p className="landing-panel-label">OPERATING EXPOSURE</p>
                <p className="landing-panel-value">Cost × Risk × Time</p>
                <div className="landing-trace-list">
                  <div><span>01</span><p>Define inputs and operating boundary</p><CheckCircleIcon aria-hidden="true" /></div>
                  <div><span>02</span><p>Calculate scenario and uncertainty</p><CheckCircleIcon aria-hidden="true" /></div>
                  <div><span>03</span><p>Issue action and review record</p><CheckBadgeIcon aria-hidden="true" /></div>
                </div>
              </div>
              <div className="landing-panel-footer">
                <span>METHOD CONTEXT</span>
                <strong>ISO / ASME referenced</strong>
              </div>
            </aside>
          </div>
        </section>

        <section className="landing-outcomes" aria-labelledby="outcomes-title">
          <div className="landing-wrap">
            <SectionHeading
              eyebrow="FROM QUESTION TO ACTION"
              title="Built around the decision, not just the answer."
              description="Each workflow connects an operating question to structured inputs, an explainable result, and a clear next action."
            />
            <div className="landing-outcome-grid">
              {outcomes.map((item, index) => (
                <article className="landing-outcome-card" key={item.title}>
                  <div className="landing-card-topline">
                    <CardIcon icon={item.icon} />
                    <span>0{index + 1}</span>
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  {item.href && item.linkLabel ? <ArrowLink href={item.href}>{item.linkLabel}</ArrowLink> : null}
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="landing-paths" aria-labelledby="paths-title">
          <div className="landing-wrap">
            <SectionHeading
              eyebrow="ONE INDUSTRIAL SYSTEM"
              title="Three paths for three levels of decision pressure."
              description="Start with the depth the decision demands, then move into diagnostics or review-ready analysis without changing platforms."
              inverse
            />
            <div className="landing-path-grid">
              {decisionPaths.map((item) => (
                <article className="landing-path-card" key={item.title}>
                  <div className="landing-path-card-head">
                    <CardIcon icon={item.icon} inverse />
                    <span>{item.meta}</span>
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  {item.href && item.linkLabel ? <ArrowLink href={item.href}>{item.linkLabel}</ArrowLink> : null}
                </article>
              ))}
            </div>
            <div className="landing-sector-rail" aria-label="Supported industry sectors">
              <span>SECTOR COVERAGE</span>
              <p>CNC / MACHINING</p>
              <p>WELDING / FABRICATION</p>
              <p>QUALITY / MAINTENANCE</p>
              <p>ENERGY / FACILITIES</p>
              <p>LOGISTICS / INVENTORY</p>
              <p>FINANCE / CONTROLLING</p>
            </div>
          </div>
        </section>

        <section className="landing-cases" aria-labelledby="cases-title">
          <div className="landing-wrap landing-cases-layout">
            <div className="landing-cases-intro">
              <SectionHeading
                eyebrow="OPERATIONAL EVIDENCE"
                title="Real workflows. Measurable impact."
                description="Anonymized case studies show how calculation-backed decisions expose wasted cost, weak process controls, quote leakage, and avoidable losses."
              />
              <Link href="/case-studies" prefetch={true} className="landing-button landing-button--outline">
                View Case Studies
                <ScIcon icon={ArrowRightIcon} size="compact" />
              </Link>
            </div>
            <div className="landing-case-list">
              {caseStudies.map((item) => (
                <article className="landing-case-row" key={item.title}>
                  <CardIcon icon={item.icon} />
                  <div>
                    <span>{item.meta}</span>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="landing-method" aria-labelledby="method-title">
          <div className="landing-wrap">
            <SectionHeading
              eyebrow="CALCULATION DISCIPLINE"
              title="What every serious calculation should show."
              description="A result is useful only when its assumptions, sensitivities, risk boundary, and required action remain visible."
            />
            <div className="landing-method-grid">
              {methodology.map((item) => (
                <article className="landing-method-item" key={item.code}>
                  <span className="landing-method-code">{item.code}</span>
                  <ScIcon icon={item.icon} size="default" />
                  <h3>{item.label}</h3>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="landing-diagnostics" aria-labelledby="diagnostics-title">
          <div className="landing-wrap landing-diagnostics-grid">
            <div className="landing-diagnostics-copy">
              <SectionHeading
                eyebrow="ENGINEERING DIAGNOSTICS"
                title="From field evidence to a structured report."
                description="Upload photos, add measurements, and describe the issue. SectorCalc organizes the evidence into root-cause hypotheses, cost exposure, corrective actions, and a verification trail."
              />
              <ul className="landing-feature-list">
                {diagnosticFeatures.map((feature) => (
                  <li key={feature.label}>
                    <span aria-hidden="true"><ScIcon icon={feature.icon} size="compact" /></span>
                    {feature.label}
                  </li>
                ))}
              </ul>
              <Link href="/engineering-diagnostics" prefetch={true} className="landing-button landing-button--accent">
                Start Engineering Diagnostics
                <ScIcon icon={ArrowRightIcon} size="compact" />
              </Link>
            </div>

            <div className="landing-report-shell" aria-label="Example Engineering Diagnostics report">
              <div className="landing-report-toolbar">
                <span><i aria-hidden="true" /> SAMPLE REPORT</span>
                <span>ED-2026-0042</span>
              </div>
              <div className="landing-report-title">
                <PresentationChartLineIcon aria-hidden="true" />
                <div>
                  <p>ENGINEERING DIAGNOSTICS</p>
                  <h3>Field Investigation Report</h3>
                </div>
              </div>
              <dl className="landing-report-data">
                <div><dt>Issue</dt><dd>Weld porosity · ISO 5817 B</dd></div>
                <div><dt>Probable cause</dt><dd>Shielding gas flow below process range</dd></div>
                <div><dt>Cost exposure</dt><dd>EUR 4,200</dd></div>
                <div><dt>Corrective action</dt><dd>Calibrate flow meter and verify operator setup</dd></div>
              </dl>
              <div className="landing-report-verification">
                <FingerPrintIcon aria-hidden="true" />
                <div><span>VERIFICATION RECORD</span><strong>SHA-256 · a3f2...c8e1</strong></div>
                <CheckBadgeIcon aria-hidden="true" />
              </div>
            </div>
          </div>
        </section>

        <section className="landing-final-cta" aria-labelledby="final-cta-title">
          <div className="landing-wrap landing-final-cta-inner">
            <div>
              <p className="landing-kicker">CHOOSE THE RIGHT LEVEL OF DEPTH</p>
              <h2 id="final-cta-title">Start with the decision you need to make today.</h2>
              <p>Use a free calculator for a quick check. Use Pro when the result affects price, production, quality, energy cost, rework, downtime, or customer commitment.</p>
            </div>
            <div className="landing-final-actions">
              <Link href="/free-tools" prefetch={true} className="landing-button landing-button--accent">
                Browse Free Tools
                <ScIcon icon={ArrowRightIcon} size="compact" />
              </Link>
              <Link href="/pro-tools" prefetch={true} className="landing-button landing-button--ghost">
                Explore Pro Tools
              </Link>
            </div>
          </div>
        </section>

        <section className="landing-seo-note" aria-label="SectorCalc scope notice">
          <div className="landing-wrap">
            <p>Industrial calculators for manufacturing, energy, quality, logistics, and engineering decisions. Decision-support reports—not financial, legal, or engineering advice.</p>
          </div>
        </section>
      </main>
    </div>
  );
}
