import Link from "next/link";
import "@/styles/landing-page.css";
import { AnimatedCounter } from "@/components/landing/AnimatedCounter";
import { LiveCalcFlow } from "@/components/landing/LiveCalcFlow";
import { ProductDemoFilm } from "@/components/landing/ProductDemoFilm";

type IconName =
  | "calculator"
  | "report"
  | "diagnostics"
  | "input"
  | "formula"
  | "boundary"
  | "decision"
  | "machining"
  | "welding"
  | "quality"
  | "energy"
  | "logistics"
  | "finance"
  | "trace"
  | "limits"
  | "review";

function Icon({ name }: { name: IconName }) {
  const common = {
    width: 24,
    height: 24,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  switch (name) {
    case "calculator":
      return (
        <svg {...common}>
          <rect x="5" y="2.5" width="14" height="19" rx="1.5" />
          <path d="M8 6.5h8M8 11h1m3 0h1m3 0h1M8 15h1m3 0h1m3 0h1M8 19h5m3-4v4" />
        </svg>
      );
    case "report":
      return (
        <svg {...common}>
          <path d="M6 2.5h8l4 4V21.5H6z" />
          <path d="M14 2.5v4h4M9 11h6M9 15h6M9 19h4" />
        </svg>
      );
    case "diagnostics":
      return (
        <svg {...common}>
          <circle cx="10.5" cy="10.5" r="6.5" />
          <path d="m15.3 15.3 5.2 5.2M8 10.5h5M10.5 8v5" />
        </svg>
      );
    case "input":
      return (
        <svg {...common}>
          <path d="M4 5.5h16M4 12h16M4 18.5h16" />
          <circle cx="8" cy="5.5" r="1.8" fill="currentColor" stroke="none" />
          <circle cx="15" cy="12" r="1.8" fill="currentColor" stroke="none" />
          <circle cx="10" cy="18.5" r="1.8" fill="currentColor" stroke="none" />
        </svg>
      );
    case "formula":
      return (
        <svg {...common}>
          <path d="M6 5h5l-4 14h5M14.5 9.5l5 5M19.5 9.5l-5 5" />
        </svg>
      );
    case "boundary":
      return (
        <svg {...common}>
          <path d="M3 18 8 8l4 6 3-4 6 8" />
          <path d="M3 21h18M5 5h14" />
        </svg>
      );
    case "decision":
      return (
        <svg {...common}>
          <path d="M4 12h12M12 5l7 7-7 7" />
          <path d="M4 5v14" />
        </svg>
      );
    case "machining":
      return (
        <svg {...common}>
          <circle cx="8" cy="12" r="4.5" />
          <path d="M12.5 12H21M16 8.5V15.5M4 5h8M4 19h8" />
        </svg>
      );
    case "welding":
      return (
        <svg {...common}>
          <path d="M3 8h7l2 4 2-4h7M3 16h7l2-4 2 4h7" />
          <path d="m10 4 2 3 2-3M10 20l2-3 2 3" />
        </svg>
      );
    case "quality":
      return (
        <svg {...common}>
          <path d="M12 2.5 19 6v5.5c0 4.6-2.8 8-7 10-4.2-2-7-5.4-7-10V6z" />
          <path d="m8.5 12 2.2 2.2 4.8-5" />
        </svg>
      );
    case "energy":
      return (
        <svg {...common}>
          <path d="M13.5 2.5 5.5 13h6l-1 8.5 8-11h-6z" />
        </svg>
      );
    case "logistics":
      return (
        <svg {...common}>
          <path d="M3 6h11v11H3zM14 10h4l3 3v4h-7z" />
          <circle cx="7" cy="18.5" r="1.8" />
          <circle cx="18" cy="18.5" r="1.8" />
        </svg>
      );
    case "finance":
      return (
        <svg {...common}>
          <path d="M4 19V9M10 19V5M16 19v-7M22 19H2" />
          <path d="m3 6 6-3 6 4 6-4" />
        </svg>
      );
    case "trace":
      return (
        <svg {...common}>
          <path d="M3 12h4l2-5 3 10 3-7 2 2h4" />
        </svg>
      );
    case "limits":
      return (
        <svg {...common}>
          <path d="M5 3v18M19 3v18M9 8h6M9 16h6" />
          <path d="m11 6-2 2 2 2M13 14l2 2-2 2" />
        </svg>
      );
    case "review":
      return (
        <svg {...common}>
          <path d="M5 3h10l4 4v14H5zM15 3v4h4" />
          <path d="m8.5 14 2.2 2.2 4.8-5" />
        </svg>
      );
  }
}

const productPaths: Array<{
  icon: IconName;
  index: string;
  title: string;
  label: string;
  description: string;
  bullets: string[];
  href: string;
  cta: string;
}> = [
  {
    icon: "calculator",
    index: "01",
    title: "Free Calculators",
    label: "Fast operational checks",
    description:
      "Calculate cost, capacity, energy, production, logistics, quality and finance questions without a login.",
    bullets: ["Structured inputs", "Immediate result", "Clear next action"],
    href: "/free-tools",
    cta: "Browse free calculators",
  },
  {
    icon: "report",
    index: "02",
    title: "Pro Decision Tools",
    label: "Report-grade analysis",
    description:
      "Use deeper models when a quote, investment, production plan or commercial commitment must survive review.",
    bullets: ["Sensitivity analysis", "Risk boundaries", "Decision-ready reports"],
    href: "/pro-tools",
    cta: "Explore Pro decision tools",
  },
  {
    icon: "diagnostics",
    index: "03",
    title: "Engineering Diagnostics",
    label: "Evidence-led investigation",
    description:
      "Turn field photos, measurements and operating context into a structured diagnostic and corrective-action record.",
    bullets: ["Root-cause hypotheses", "Cost-at-risk", "NCR / CAPA support"],
    href: "/engineering-diagnostics",
    cta: "Start engineering diagnostics",
  },
];

const workflowSteps: Array<{
  icon: IconName;
  index: string;
  title: string;
  text: string;
}> = [
  {
    icon: "input",
    index: "01",
    title: "Capture the operating reality",
    text: "Use explicit units, assumptions and validation instead of hidden spreadsheet logic.",
  },
  {
    icon: "formula",
    index: "02",
    title: "Run the calculation path",
    text: "Apply a defined formula model with traceable inputs and calculation context.",
  },
  {
    icon: "boundary",
    index: "03",
    title: "Stress the decision",
    text: "Expose sensitivity, tolerance, uncertainty and the point where the answer changes.",
  },
  {
    icon: "decision",
    index: "04",
    title: "Issue the next action",
    text: "Proceed, hold, reprice, inspect, repair, escalate or prepare qualified review.",
  },
];

const sectors: Array<{
  icon: IconName;
  title: string;
  text: string;
}> = [
  {
    icon: "machining",
    title: "Machining & CNC",
    text: "Hourly rate, cycle time, tooling, scrap, quote margin, OEE and machine investment.",
  },
  {
    icon: "welding",
    title: "Welding & Fabrication",
    text: "Weld cost, consumables, rework exposure, preheat checks and fabrication decisions.",
  },
  {
    icon: "quality",
    title: "Quality & Maintenance",
    text: "FMEA RPN, recurring defects, calibration risk, downtime, NCR and CAPA priorities.",
  },
  {
    icon: "energy",
    title: "Energy & Facilities",
    text: "Energy loss, compressed air, HVAC load, equipment replacement and payback.",
  },
  {
    icon: "logistics",
    title: "Logistics & Inventory",
    text: "Freight cost, stock exposure, EOQ, throughput, route loss and working capital.",
  },
  {
    icon: "finance",
    title: "Finance & Investment",
    text: "Break-even, pricing, cash survival, NPV, IRR, payback and capital allocation.",
  },
];

const professionalPrinciples: Array<{
  icon: IconName;
  title: string;
  text: string;
}> = [
  {
    icon: "trace",
    title: "Traceable",
    text: "Inputs, formulas, assumptions and outputs remain connected so the result can be reviewed.",
  },
  {
    icon: "limits",
    title: "Bounded",
    text: "Tolerance, uncertainty, missing evidence and decision-flip conditions are made explicit.",
  },
  {
    icon: "review",
    title: "Review-aware",
    text: "The platform separates decision support from certification, code approval and qualified sign-off.",
  },
];

export function LandingPageContent() {
  return (
    <div className="sc-landing">
      <section className="sc-hero" aria-labelledby="home-title">
        <div className="sc-shell sc-hero-grid">
          <div className="sc-report-preview" aria-label="Illustrative SectorCalc decision report">
            <div className="sc-report-topline">
              <div>
                <span className="sc-report-mark" aria-hidden="true" />
                <span>DECISION TRACE / QUOTE REVIEW</span>
              </div>
              <span className="sc-report-status">MODEL COMPLETE</span>
            </div>

            <div className="sc-verdict-block">
              <p>DECISION</p>
              <strong>REPRICE BEFORE COMMITMENT</strong>
              <span>
                Current quote margin remains below target after cycle-time and scrap sensitivity.
              </span>
            </div>

            <div className="sc-report-metrics">
              <div>
                <span>TRUE HOURLY COST</span>
                <strong><AnimatedCounter value={117.4} prefix="$" decimals={2} /></strong>
              </div>
              <div>
                <span>QUOTE MARGIN</span>
                <strong><AnimatedCounter value={8.6} suffix="%" decimals={1} /></strong>
              </div>
              <div>
                <span>TARGET MARGIN</span>
                <strong><AnimatedCounter value={20} suffix="%" decimals={1} /></strong>
              </div>
            </div>

            <div className="sc-sensitivity">
              <div className="sc-sensitivity-head">
                <span>SENSITIVITY / DECISION DRIVERS</span>
                <span>LOW → HIGH</span>
              </div>
              <div className="sc-sensitivity-row">
                <span>Cycle time</span>
                <div className="sc-track"><span style={{ width: "86%" }} /></div>
                <strong>High</strong>
              </div>
              <div className="sc-sensitivity-row">
                <span>Scrap rate</span>
                <div className="sc-track"><span style={{ width: "64%" }} /></div>
                <strong>Med.</strong>
              </div>
              <div className="sc-sensitivity-row">
                <span>Material cost</span>
                <div className="sc-track"><span style={{ width: "48%" }} /></div>
                <strong>Med.</strong>
              </div>
            </div>

            <div className="sc-report-footer">
              <span>Illustrative report preview — not a customer result</span>
              <span>TRACE ID / SC-7F21</span>
            </div>
          </div>

          <div className="sc-hero-copy">
            <p className="sc-kicker">
              <span aria-hidden="true" />
              Industrial decision intelligence
            </p>
            <h1 id="home-title">
              Know the cost.
              <span>See the risk.</span>
              Make the call.
            </h1>
            <p className="sc-hero-lead">
              SectorCalc turns operating inputs into decision-ready calculations for manufacturing,
              engineering, operations and finance — before a weak estimate becomes an expensive
              commitment.
            </p>
            <div className="sc-action-row">
              <Link href="/free-tools" prefetch className="sc-button sc-button-primary">
                Open free calculators
                <span aria-hidden="true">→</span>
              </Link>
              <Link href="/pro-tools" prefetch className="sc-button sc-button-secondary">
                Explore Pro decision tools
              </Link>
            </div>
            <ul className="sc-hero-proof" aria-label="Platform capabilities">
              <li>No login for free tools</li>
              <li>Server-side Pro calculations</li>
              <li>Report and verification workflows</li>
            </ul>
          </div>
        </div>
      </section>

      <section data-fade className="sc-proof-strip" aria-label="SectorCalc calculation principles">
        <div className="sc-shell sc-proof-strip-inner">
          <p>FROM INPUT TO DECISION</p>
          <ul>
            <li>Explicit assumptions</li>
            <li>Formula context</li>
            <li>Sensitivity and tolerances</li>
            <li>Action-oriented output</li>
            <li>Qualified-review boundaries</li>
          </ul>
        </div>
      </section>

      <section data-fade className="sc-section sc-products" aria-labelledby="product-paths-title">
        <div className="sc-shell">
          <div className="sc-section-heading sc-section-heading-split">
            <div>
              <p className="sc-section-kicker">THE PLATFORM</p>
              <h2 id="product-paths-title">Three paths. One decision system.</h2>
            </div>
            <p>
              Start with a fast check. Move to deeper analysis when the result affects price,
              production, quality, investment or customer commitment.
            </p>
          </div>

          <div className="sc-product-grid" data-stagger>
            {productPaths.map((product, i) => (
              <article className={`sc-product-card${product.index === "02" ? " sc-product-card-featured" : ""}`} key={product.title} style={{ "--stagger-i": i } as React.CSSProperties}>
                <div className="sc-card-topline">
                  <span className="sc-icon-box"><Icon name={product.icon} /></span>
                  <span>{product.index}</span>
                </div>
                <p className="sc-product-label">{product.label}</p>
                <h3>{product.title}</h3>
                <p className="sc-product-description">{product.description}</p>
                <ul>
                  {product.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}
                </ul>
                <Link href={product.href} prefetch className="sc-text-link">
                  {product.cta}<span aria-hidden="true">→</span>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section data-fade className="sc-section sc-workflow" aria-labelledby="workflow-title">
        <div className="sc-shell">
          <div className="sc-section-heading sc-section-heading-centered">
            <p className="sc-section-kicker">THE DIFFERENCE</p>
            <h2 id="workflow-title">A calculator gives a number. SectorCalc shows what can change the decision.</h2>
            <p>
              The calculation path is designed to expose the variables, limits and evidence behind
              the answer — not bury them inside a spreadsheet.
            </p>
          </div>

          <div className="sc-workflow-grid" data-stagger>
            {workflowSteps.map((step, i) => (
              <article className="sc-workflow-step" key={step.index} style={{ "--stagger-i": i } as React.CSSProperties}>
                <div className="sc-workflow-number">{step.index}</div>
                <span className="sc-workflow-icon"><Icon name={step.icon} /></span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </article>
            ))}
          </div>

          <LiveCalcFlow />
        </div>
      </section>

      <section data-fade className="sc-pro-section" aria-labelledby="pro-title">
        <div className="sc-shell sc-pro-grid">
          <div className="sc-pro-copy">
            <p className="sc-section-kicker">PRO DECISION TOOLS</p>
            <h2 id="pro-title">When the number becomes a commitment, move to Pro.</h2>
            <p>
              Use Pro when a quote, CAPEX request, production plan, quality decision or commercial
              commitment must be explained, challenged and documented.
            </p>
            <div className="sc-action-row">
              <Link href="/pro-tools" prefetch className="sc-button sc-button-light">
                View Pro decision tools<span aria-hidden="true">→</span>
              </Link>
              <Link href="/pricing" prefetch className="sc-button sc-button-dark-outline">
                See pricing
              </Link>
            </div>
            <p className="sc-pro-note">
              Decision support only. Qualified professional review remains required where safety,
              code, regulation or certification applies.
            </p>
          </div>

          <div className="sc-pro-capabilities" data-stagger>
            <article style={{ "--stagger-i": 0 } as React.CSSProperties}>
              <span>01</span>
              <div>
                <h3>Sensitivity</h3>
                <p>Identify which variables control the outcome and how far they can move.</p>
              </div>
            </article>
            <article style={{ "--stagger-i": 1 } as React.CSSProperties}>
              <span>02</span>
              <div>
                <h3>Risk boundary</h3>
                <p>Show the threshold where the recommendation changes or escalation is required.</p>
              </div>
            </article>
            <article style={{ "--stagger-i": 2 } as React.CSSProperties}>
              <span>03</span>
              <div>
                <h3>Assumptions and limits</h3>
                <p>Keep missing evidence, tolerances and model limitations visible to reviewers.</p>
              </div>
            </article>
            <article style={{ "--stagger-i": 3 } as React.CSSProperties}>
              <span>04</span>
              <div>
                <h3>Report workflow</h3>
                <p>Prepare a structured output for internal review, client discussion or verification.</p>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section data-fade className="sc-section sc-sectors" aria-labelledby="sectors-title">
        <div className="sc-shell">
          <div className="sc-section-heading sc-section-heading-split">
            <div>
              <p className="sc-section-kicker">DECISIONS BY DOMAIN</p>
              <h2 id="sectors-title">Built for the point where operating detail meets financial consequence.</h2>
            </div>
            <p>
              SectorCalc connects shop-floor variables with cost, risk, downtime, margin and capital
              decisions across industrial work.
            </p>
          </div>

          <div className="sc-sector-grid" data-stagger>
            {sectors.map((sector, i) => (
              <article className="sc-sector-card" key={sector.title} style={{ "--stagger-i": i } as React.CSSProperties}>
                <span className="sc-sector-icon"><Icon name={sector.icon} /></span>
                <h3>{sector.title}</h3>
                <p>{sector.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section data-fade className="sc-section sc-cases" aria-labelledby="cases-title">
        <div className="sc-shell">
          <div className="sc-section-heading sc-section-heading-split">
            <div>
              <p className="sc-section-kicker">CALCULATION WORKFLOWS</p>
              <h2 id="cases-title">The value is not the result alone. It is the decision the result unlocks.</h2>
            </div>
            <Link href="/case-studies" prefetch className="sc-text-link sc-heading-link">
              View case studies<span aria-hidden="true">→</span>
            </Link>
          </div>

          <div className="sc-case-grid" data-stagger>
            <article className="sc-case-card" style={{ "--stagger-i": 0 } as React.CSSProperties}>
              <p className="sc-case-index">01 / PRECISION MACHINING</p>
              <h3>Is the job profitable after real machine time, tooling, setup and scrap?</h3>
              <dl>
                <div><dt>Decision trace</dt><dd>True hourly rate → cost per part → quote margin → reprice threshold</dd></div>
                <div><dt>Commercial action</dt><dd>Accept, reprice, redesign process or decline the job</dd></div>
              </dl>
            </article>
            <article className="sc-case-card" style={{ "--stagger-i": 1 } as React.CSSProperties}>
              <p className="sc-case-index">02 / ENERGY OPERATIONS</p>
              <h3>Does the efficiency project still pay back under realistic load and tariff changes?</h3>
              <dl>
                <div><dt>Decision trace</dt><dd>Baseline loss → recoverable savings → sensitivity → payback range</dd></div>
                <div><dt>Capital action</dt><dd>Approve, resize, defer or request additional evidence</dd></div>
              </dl>
            </article>
            <article className="sc-case-card" style={{ "--stagger-i": 2 } as React.CSSProperties}>
              <p className="sc-case-index">03 / QUALITY & MAINTENANCE</p>
              <h3>Which failure mode should be funded first when risk, downtime and rework compete?</h3>
              <dl>
                <div><dt>Decision trace</dt><dd>Failure priority → cost exposure → mitigation effect → residual risk</dd></div>
                <div><dt>Operational action</dt><dd>Contain, correct, monitor or escalate for qualified review</dd></div>
              </dl>
            </article>
          </div>
        </div>
      </section>

      <section data-fade className="sc-section sc-professional" aria-labelledby="professional-title">
        <div className="sc-shell sc-professional-grid">
          <div className="sc-professional-copy">
            <p className="sc-section-kicker">PROFESSIONAL TRUST</p>
            <h2 id="professional-title">Serious analysis without false authority.</h2>
            <p>
              SectorCalc references recognized methods and standards where relevant, states
              assumptions and limitations, and keeps calculation support separate from certification,
              code approval and qualified sign-off.
            </p>
            <Link href="/verify" prefetch className="sc-text-link">
              Verify a report<span aria-hidden="true">→</span>
            </Link>
          </div>
          <div className="sc-principle-grid" data-stagger>
            {professionalPrinciples.map((principle, i) => (
              <article key={principle.title} style={{ "--stagger-i": i } as React.CSSProperties}>
                <span><Icon name={principle.icon} /></span>
                <h3>{principle.title}</h3>
                <p>{principle.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section data-fade className="sc-final-cta" aria-labelledby="final-cta-title">
        <div className="sc-shell sc-final-cta-inner">
          <div>
            <p className="sc-section-kicker">START WITH THE DECISION</p>
            <h2 id="final-cta-title">Every costly commitment starts as an untested assumption.</h2>
            <p>Replace it with a traceable calculation before money, time or credibility is locked in.</p>
          </div>
          <div className="sc-action-row">
            <Link href="/free-tools" prefetch className="sc-button sc-button-primary">
              Find a free calculator<span aria-hidden="true">→</span>
            </Link>
            <Link href="/pro-tools" prefetch className="sc-button sc-button-secondary">
              Explore Pro tools
            </Link>
          </div>
        </div>
      </section>

      <section data-fade className="sc-seo-summary" aria-label="SectorCalc platform summary">
        <div className="sc-shell">
          <p>
            SectorCalc provides industrial calculators and decision tools for manufacturing,
            machining, welding, quality, maintenance, construction, energy, logistics and finance.
            Use free calculators for fast operational checks, Pro tools for sensitivity and
            report-grade analysis, and Engineering Diagnostics for evidence-led issue investigation.
          </p>
        </div>
      </section>

      <ProductDemoFilm />
    </div>
  );
}
