import Link from "next/link";
import "@/styles/landing-page.css";

type ProductPath = {
  index: string;
  label: string;
  title: string;
  description: string;
  bullets: readonly string[];
  href: string;
  cta: string;
  featured?: boolean;
};

type DecisionCase = {
  index: string;
  label: string;
  question: string;
  exposure: string;
  action: string;
};

const productPaths: readonly ProductPath[] = [
  {
    index: "01",
    label: "Fast operational checks",
    title: "Free Tools",
    description:
      "Calculate cost, capacity, energy, production, logistics, quality and finance questions without a login.",
    bullets: ["Structured inputs", "Immediate result", "Clear next action"],
    href: "/free-tools",
    cta: "Open free calculators",
  },
  {
    index: "02",
    label: "Decision-grade analysis",
    title: "Pro Tools",
    description:
      "Use deeper models when a quote, investment, production plan or commercial commitment must survive review.",
    bullets: [
      "Sensitivity analysis",
      "Risk boundaries",
      "Downloadable decision reports",
    ],
    href: "/pro-tools",
    cta: "Explore Pro decision tools",
    featured: true,
  },
  {
    index: "03",
    label: "Evidence-led investigation",
    title: "Engineering Diagnostics",
    description:
      "Turn field photos, measurements and operating context into a structured diagnostic and corrective-action record.",
    bullets: ["Root-cause hypotheses", "Cost-at-risk", "NCR and CAPA support"],
    href: "/engineering-diagnostics",
    cta: "Start diagnostics",
  },
];

const decisionCases: readonly DecisionCase[] = [
  {
    index: "01",
    label: "PRECISION MACHINING",
    question:
      "Is this job still profitable after real machine time, setup, tooling and scrap?",
    exposure: "Underpriced work, locked capacity and margin leakage.",
    action: "Accept, reprice, redesign the process or decline.",
  },
  {
    index: "02",
    label: "ENERGY & FACILITIES",
    question:
      "Does the project still pay back when load, tariff and operating hours move?",
    exposure: "Overstated savings and capital committed to the wrong scope.",
    action: "Approve, resize, defer or request more evidence.",
  },
  {
    index: "03",
    label: "QUALITY & MAINTENANCE",
    question:
      "Which failure mode should be funded first when risk, downtime and rework compete?",
    exposure:
      "Recurring defects, avoidable stoppages and weak corrective action.",
    action: "Contain, correct, monitor or escalate for review.",
  },
];

const decisionStandards = [
  ["01", "Explicit inputs", "Units, assumptions and evidence remain visible."],
  ["02", "Traceable logic", "Formula context stays connected to the result."],
  [
    "03",
    "Decision boundaries",
    "Sensitivity shows what can reverse the recommendation.",
  ],
  ["04", "Action output", "The result ends with a practical next step."],
] as const;

const proCapabilities = [
  [
    "Sensitivity",
    "Identify the variables that control the result and how far they can move.",
  ],
  [
    "Risk boundary",
    "Show the threshold where the recommendation changes or escalation is required.",
  ],
  [
    "Assumptions and limits",
    "Keep missing evidence, tolerances and model limitations visible.",
  ],
  [
    "Report workflow",
    "Prepare a structured output for internal review, client discussion or verification.",
  ],
] as const;

function Arrow() {
  return <span aria-hidden="true">→</span>;
}

export function LandingPageContent() {
  return (
    <div className="sc-landing">
      <section className="scx-hero" aria-labelledby="home-title">
        <div className="scx-shell scx-hero-grid">
          <div className="scx-hero-copy">
            <p className="scx-kicker">INDUSTRIAL DECISION SYSTEM</p>
            <h1 id="home-title">
              Make the decision
              <span>before the cost becomes irreversible.</span>
            </h1>
            <p className="scx-hero-lead">
              SectorCalc turns operating inputs into traceable cost, risk,
              production and engineering decisions — so you can price correctly,
              stop avoidable losses and commit with evidence.
            </p>

            <div className="scx-action-row">
              <Link
                href="/free-tools"
                prefetch
                className="scx-button scx-button-primary"
              >
                Run a free calculation <Arrow />
              </Link>
              <Link
                href="/pricing"
                prefetch
                className="scx-button scx-button-secondary"
              >
                See Pro pricing
              </Link>
            </div>

            <ul
              className="scx-hero-proof"
              aria-label="SectorCalc access and trust points"
            >
              <li>No login for free tools</li>
              <li>Server-side Pro calculations</li>
              <li>Report verification workflow</li>
            </ul>
          </div>

          <div
            className="scx-decision-console"
            aria-label="Illustrative SectorCalc decision output"
          >
            <div className="scx-console-head">
              <div>
                <span className="scx-console-signal" aria-hidden="true" />
                <span>QUOTE REVIEW / DECISION TRACE</span>
              </div>
              <span className="scx-console-state">MODEL COMPLETE</span>
            </div>

            <div className="scx-console-verdict">
              <p>RECOMMENDED ACTION</p>
              <strong>REPRICE BEFORE COMMITMENT</strong>
              <span>
                Current quote margin falls below target after cycle-time and
                scrap sensitivity.
              </span>
            </div>

            <div
              className="scx-console-metrics"
              aria-label="Illustrative decision metrics"
            >
              <div>
                <span>TRUE HOURLY COST</span>
                <strong>$117.40</strong>
              </div>
              <div>
                <span>CURRENT MARGIN</span>
                <strong>8.6%</strong>
              </div>
              <div>
                <span>TARGET MARGIN</span>
                <strong>20.0%</strong>
              </div>
            </div>

            <div className="scx-console-drivers">
              <div className="scx-console-drivers-head">
                <span>DECISION DRIVERS</span>
                <span>LOW → HIGH</span>
              </div>
              <div className="scx-driver-row">
                <span>Cycle time</span>
                <div className="scx-driver-track">
                  <span className="scx-driver-86" />
                </div>
                <strong>High</strong>
              </div>
              <div className="scx-driver-row">
                <span>Scrap rate</span>
                <div className="scx-driver-track">
                  <span className="scx-driver-64" />
                </div>
                <strong>Med.</strong>
              </div>
              <div className="scx-driver-row">
                <span>Material cost</span>
                <div className="scx-driver-track">
                  <span className="scx-driver-48" />
                </div>
                <strong>Med.</strong>
              </div>
            </div>

            <div className="scx-console-foot">
              <span>Illustrative preview — not a customer result</span>
              <span>TRACE / SC-7F21</span>
            </div>
          </div>
        </div>
      </section>

      <section
        data-fade
        className="scx-trust-strip"
        aria-label="SectorCalc calculation principles"
      >
        <div className="scx-shell scx-trust-strip-inner">
          <p>FROM INPUT TO ACTION</p>
          <ul>
            <li>Explicit assumptions</li>
            <li>Formula context</li>
            <li>Sensitivity and tolerances</li>
            <li>Review boundaries</li>
          </ul>
        </div>
      </section>

      <section
        data-fade
        className="scx-purchase-bridge"
        aria-labelledby="purchase-bridge-title"
      >
        <div className="scx-shell scx-purchase-bridge-grid">
          <div>
            <p className="scx-section-kicker">START WITHOUT RISK</p>
            <h2 id="purchase-bridge-title">
              Use the number free. Buy Pro when the decision must be defended.
            </h2>
          </div>
          <div className="scx-purchase-bridge-copy">
            <p>
              Free Tools answer the immediate question. Pro Tools add
              sensitivity, limits, assumptions and a decision-ready report when
              the result affects money, capacity, quality or customer
              commitment.
            </p>
            <Link href="/pricing" prefetch className="scx-text-link">
              Compare access and pricing <Arrow />
            </Link>
          </div>
        </div>
      </section>

      <section
        data-fade
        className="scx-section scx-products"
        aria-labelledby="product-paths-title"
      >
        <div className="scx-shell">
          <div className="scx-section-heading scx-section-heading-split">
            <div>
              <p className="scx-section-kicker">CHOOSE THE DECISION DEPTH</p>
              <h2 id="product-paths-title">
                One platform. Three ways to reach a defensible answer.
              </h2>
            </div>
            <p>
              Start with the lowest-friction path. Move deeper only when the
              cost of a wrong decision is greater than the cost of analysis.
            </p>
          </div>

          <div className="scx-product-grid" data-stagger>
            {productPaths.map((product) => (
              <Link
                href={product.href}
                prefetch
                className={`scx-product-link${product.featured ? " scx-product-link-featured" : ""}`}
                key={product.title}
              >
                <article className="scx-product-card">
                  <div className="scx-card-topline">
                    <span>{product.index}</span>
                    <span>{product.label}</span>
                  </div>
                  <h3>{product.title}</h3>
                  <p className="scx-product-description">
                    {product.description}
                  </p>
                  <ul>
                    {product.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                  <span className="scx-card-cta">
                    {product.cta} <Arrow />
                  </span>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section
        data-fade
        className="scx-section scx-loss-section"
        aria-labelledby="loss-title"
      >
        <div className="scx-shell">
          <div className="scx-section-heading scx-section-heading-centered">
            <p className="scx-section-kicker">THE ECONOMIC CONSEQUENCE</p>
            <h2 id="loss-title">
              A wrong input does not create a wrong number. It creates a wrong
              commitment.
            </h2>
            <p>
              SectorCalc is built for the point where operational detail becomes
              price, margin, downtime, quality exposure or capital risk.
            </p>
          </div>

          <div className="scx-case-grid" data-stagger>
            {decisionCases.map((item) => (
              <article className="scx-case-card" key={item.index}>
                <p className="scx-case-index">
                  {item.index} / {item.label}
                </p>
                <h3>{item.question}</h3>
                <dl>
                  <div>
                    <dt>Cost of being wrong</dt>
                    <dd>{item.exposure}</dd>
                  </div>
                  <div>
                    <dt>Decision output</dt>
                    <dd>{item.action}</dd>
                  </div>
                </dl>
              </article>
            ))}
          </div>

          <div className="scx-centered-link">
            <Link href="/case-studies" prefetch className="scx-text-link">
              View Case Studies <Arrow />
            </Link>
          </div>
        </div>
      </section>

      <section
        data-fade
        className="scx-section scx-method"
        aria-labelledby="method-title"
      >
        <div className="scx-shell">
          <div className="scx-section-heading scx-section-heading-split">
            <div>
              <p className="scx-section-kicker">
                WHY THE OUTPUT IS TRUSTWORTHY
              </p>
              <h2 id="method-title">
                The result stays connected to the evidence behind it.
              </h2>
            </div>
            <p>
              A serious calculation should show what was entered, what changed
              the answer, where the risk begins and what action follows.
            </p>
          </div>

          <div className="scx-method-grid" data-stagger>
            {decisionStandards.map(([index, title, text]) => (
              <article key={index}>
                <span>{index}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        data-fade
        className="scx-pro-section"
        aria-labelledby="pro-title"
      >
        <div className="scx-shell scx-pro-grid">
          <div className="scx-pro-copy">
            <p className="scx-section-kicker">PRO DECISION TOOLS</p>
            <h2 id="pro-title">
              When the result will be challenged, move to Pro.
            </h2>
            <p>
              Use Pro when a quote, CAPEX request, production plan, quality
              decision or commercial commitment must be explained, tested and
              documented.
            </p>
            <div className="scx-action-row">
              <Link
                href="/pricing"
                prefetch
                className="scx-button scx-button-light"
              >
                See pricing <Arrow />
              </Link>
              <Link
                href="/pro-tools"
                prefetch
                className="scx-button scx-button-dark-outline"
              >
                Explore Pro Tools
              </Link>
            </div>
            <p className="scx-pro-note">
              Decision support only. Qualified professional review remains
              required where safety, code, regulation or certification applies.
            </p>
          </div>

          <div className="scx-pro-capabilities">
            {proCapabilities.map(([title, text], index) => (
              <article key={title}>
                <span>0{index + 1}</span>
                <div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        data-fade
        className="scx-section scx-specialists"
        aria-labelledby="specialists-title"
      >
        <div className="scx-shell">
          <div className="scx-section-heading scx-section-heading-split">
            <div>
              <p className="scx-section-kicker">SPECIALIST WORKFLOWS</p>
              <h2 id="specialists-title">
                Use the right evidence path for risk and failure decisions.
              </h2>
            </div>
            <p>
              Rank failure modes with FMEA RPN or structure a field
              investigation with Engineering Diagnostics. Both paths keep
              evidence, limits and next actions visible.
            </p>
          </div>

          <div className="scx-specialist-grid">
            <Link
              href="/calculators/fmea-rpn"
              prefetch
              className="scx-specialist-card"
            >
              <article>
                <p>QUALITY / MAINTENANCE</p>
                <h3>FMEA RPN Calculator</h3>
                <span>
                  Rank severity, occurrence and detection; identify the failure
                  modes that require action first.
                </span>
                <strong>
                  Open FMEA RPN <Arrow />
                </strong>
              </article>
            </Link>

            <Link
              href="/engineering-diagnostics"
              prefetch
              className="scx-specialist-card scx-specialist-card-accent"
            >
              <article>
                <p>FIELD EVIDENCE / CORRECTIVE ACTION</p>
                <h3>Engineering Diagnostics</h3>
                <span>
                  Combine photos, measurements and operating context into a
                  structured diagnostic, cost-at-risk and corrective-action
                  record.
                </span>
                <strong>
                  Start Engineering Diagnostics <Arrow />
                </strong>
              </article>
            </Link>
          </div>
        </div>
      </section>

      <section
        data-fade
        className="scx-section scx-trust"
        aria-labelledby="trust-title"
      >
        <div className="scx-shell scx-trust-grid">
          <div>
            <p className="scx-section-kicker">PROFESSIONAL TRUST</p>
            <h2 id="trust-title">Serious analysis without false authority.</h2>
          </div>
          <div className="scx-trust-copy">
            <p>
              SectorCalc references recognized methods and standards where
              relevant, states assumptions and limitations, and separates
              calculation support from certification, code approval and
              qualified sign-off.
            </p>
            <div className="scx-trust-actions">
              <Link href="/verify" prefetch className="scx-text-link">
                Verify a report <Arrow />
              </Link>
              <Link href="/case-studies" prefetch className="scx-text-link">
                Read Case Studies <Arrow />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section
        data-fade
        className="scx-final-cta"
        aria-labelledby="final-cta-title"
      >
        <div className="scx-shell scx-final-cta-grid">
          <div>
            <p className="scx-section-kicker">MAKE THE NEXT DECISION VISIBLE</p>
            <h2 id="final-cta-title">
              Start with the calculation that can prevent the next expensive
              mistake.
            </h2>
            <p>
              Run a free check now. Move to Pro when the answer must support a
              price, investment, production or risk commitment.
            </p>
          </div>
          <div className="scx-final-actions">
            <Link
              href="/free-tools"
              prefetch
              className="scx-button scx-button-primary"
            >
              Browse Free Tools <Arrow />
            </Link>
            <Link
              href="/pricing"
              prefetch
              className="scx-button scx-button-secondary"
            >
              View pricing
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
