import Link from "next/link";
import { getFreeToolsHref, getPremiumToolsHref } from "@/lib/tools/tool-links";

export function HomeTrustStrip() {
  return (
    <p className="mc-hero-trust-strip">
      17 sectors · Free checks · Premium verdicts · PDF reports · No ERP required
    </p>
  );
}

export function HomePainSection() {
  return (
    <section className="mc-home-conversion mc-home-pain" aria-labelledby="home-pain-heading">
      <div className="container">
        <p className="mc-home-conversion-eyebrow">Margin decision platform</p>
        <h2 id="home-pain-heading">Protect your margin before you quote.</h2>
        <p className="mc-home-conversion-lead">
          Generic calculators show a number. SectorCalc shows whether that quote is safe —
          with sector-specific risk signals, verdict reports and suggested actions before you
          send the bid.
        </p>
        <ul className="mc-home-pain-list">
          <li>Setup time, rework and hidden labor erode margin after the estimate looks fine.</li>
          <li>Free checks expose visible risk — premium analyzers deliver the full verdict.</li>
          <li>No ERP rollout, no consulting retainer — built for shops, trades and service teams.</li>
        </ul>
      </div>
    </section>
  );
}

export function HomeFreeCheckSection() {
  return (
    <section className="mc-home-conversion mc-home-free" aria-labelledby="home-free-heading">
      <div className="container">
        <div className="mc-home-conversion-grid">
          <div>
            <p className="mc-home-conversion-eyebrow mc-home-conversion-eyebrow--free">Step 1</p>
            <h2 id="home-free-heading">Run a free margin check</h2>
            <p className="mc-home-conversion-lead">
              Seventeen sector quick checks with 3–5 inputs. See visible risk in your browser —
              no account, no safe price, no final verdict.
            </p>
            <Link href={getFreeToolsHref()} className="sc-btn-primary mc-home-conversion-cta">
              Run Free Margin Check
            </Link>
          </div>
          <div className="mc-home-conversion-card">
            <p className="text-xs font-bold uppercase tracking-wider text-emerald">Free check output</p>
            <p className="mt-3 text-lg font-bold text-deep-navy">Risk signal: MEDIUM</p>
            <p className="mt-2 text-sm leading-relaxed text-slate">
              Visible setup and labor exposure — full safe price withheld on free tier.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function HomePremiumVerdictSection() {
  return (
    <section className="mc-home-conversion mc-home-premium" aria-labelledby="home-premium-heading">
      <div className="container">
        <div className="mc-home-conversion-grid mc-home-conversion-grid--reverse">
          <div className="mc-home-conversion-card mc-home-conversion-card--premium">
            <p className="text-xs font-bold uppercase tracking-wider text-amber">Premium verdict</p>
            <p className="mt-3 text-lg font-bold text-deep-navy">Minimum safe price + action</p>
            <p className="mt-2 text-sm leading-relaxed text-slate">
              Margin leak breakdown, accept / reprice verdict and exportable PDF report.
            </p>
          </div>
          <div>
            <p className="mc-home-conversion-eyebrow mc-home-conversion-eyebrow--premium">Step 2</p>
            <h2 id="home-premium-heading">Unlock the full verdict</h2>
            <p className="mc-home-conversion-lead">
              Premium analyzers add minimum safe price, margin leak drivers, suggested action
              and PDF export — the decision layer operators actually need before quoting.
            </p>
            <Link href={getPremiumToolsHref()} className="mc-btn-hero-secondary mc-home-conversion-cta">
              View Premium Analyzers
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export function HomeSampleVerdictSection() {
  return (
    <section
      className="mc-home-conversion mc-home-sample sc-section"
      aria-labelledby="home-sample-heading"
    >
      <div className="container">
        <p className="mc-home-conversion-eyebrow">Sample verdict report</p>
        <h2 id="home-sample-heading" className="sc-h2">
          CNC Quote Risk Report
        </h2>
        <p className="mc-home-conversion-lead">
          This is what a premium decision output looks like — not a spreadsheet dump.
        </p>
        <article className="mc-home-sample-verdict sc-card sc-reveal mx-auto max-w-3xl">
          <div className="mc-home-sample-verdict-row">
            <span className="mc-home-sample-label">Verdict</span>
            <strong className="mc-home-sample-value mc-home-sample-value--alert">
              DO NOT ACCEPT UNDER $1,840
            </strong>
          </div>
          <div className="mc-home-sample-verdict-row">
            <span className="mc-home-sample-label">Margin risk</span>
            <strong className="mc-home-sample-value">HIGH RISK</strong>
          </div>
          <div className="mc-home-sample-verdict-row">
            <span className="mc-home-sample-label">Main leak</span>
            <strong className="mc-home-sample-value">Setup time + tooling buffer</strong>
          </div>
          <div className="mc-home-sample-verdict-row">
            <span className="mc-home-sample-label">Suggested action</span>
            <strong className="mc-home-sample-value">
              Reprice or reduce scope before sending the quote.
            </strong>
          </div>
        </article>
        <div className="mc-home-sample-actions">
          <Link href="/reports/sample-decision-report" className="sc-btn-primary">
            View Sample Verdict Report
          </Link>
          <Link href="/tools/premium/cnc-quote-risk-analyzer" className="sc-btn-secondary">
            Open CNC Quote Risk Analyzer
          </Link>
        </div>
      </div>
    </section>
  );
}

export function HomeFreeVsProSection() {
  return (
    <section
      className="mc-home-conversion mc-home-free-vs-pro sc-section"
      aria-labelledby="home-compare-heading"
    >
      <div className="container">
        <p className="mc-home-conversion-eyebrow">Free vs Pro</p>
        <h2 id="home-compare-heading" className="sc-h2">
          Quick check vs full verdict
        </h2>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <article className="sc-card sc-card-interactive">
            <p className="sc-eyebrow text-emerald">Free check</p>
            <ul className="mt-4 space-y-3 text-sm leading-relaxed text-slate dark:text-slate-300">
              <li>Visible risk signal in your browser</li>
              <li>Direct cost exposure indicators</li>
              <li>No PDF export</li>
              <li>No saved report history</li>
            </ul>
            <Link href={getFreeToolsHref()} className="sc-btn-secondary mt-6 w-full sm:w-auto">
              Run Free Margin Check
            </Link>
          </article>
          <article className="sc-card sc-card-interactive border-amber/30">
            <p className="sc-eyebrow text-amber">Pro verdict</p>
            <ul className="mt-4 space-y-3 text-sm leading-relaxed text-slate dark:text-slate-300">
              <li>Minimum safe price</li>
              <li>Margin leak breakdown</li>
              <li>Accept / Reprice / Do Not Accept verdict</li>
              <li>PDF-ready report and saved history</li>
            </ul>
            <Link href={getPremiumToolsHref()} className="sc-btn-primary mt-6 w-full sm:w-auto">
              View Premium Verdicts
            </Link>
          </article>
        </div>
      </div>
    </section>
  );
}

export function HomeTrustSection() {
  return (
    <section className="mc-home-conversion mc-home-trust sc-section" aria-labelledby="home-trust-heading">
      <div className="container">
        <h2 id="home-trust-heading" className="sc-h2 text-center">
          Built for business quotes where pricing mistakes erase margin.
        </h2>
        <ul className="mc-home-trust-grid mt-10">
          <li>
            <strong>No ERP required</strong>
            <span>Free checks run without enterprise setup or onboarding.</span>
          </li>
          <li>
            <strong>Free checks run without setup</strong>
            <span>Seventeen sector quick checks in your browser — no account needed.</span>
          </li>
          <li>
            <strong>Premium verdicts explain the risk</strong>
            <span>Minimum safe price, margin leaks and suggested action before you quote.</span>
          </li>
          <li>
            <strong>Checkout secured by Stripe</strong>
            <span>Pro subscription billed securely through Stripe.</span>
          </li>
          <li>
            <strong>Business data is not sold</strong>
            <span>See privacy policy for data handling details.</span>
          </li>
        </ul>
      </div>
    </section>
  );
}
