import Link from "next/link";
import { FeatureIconHeader, IconListItem, ScIcon, StatusIconBadge } from "@/components/icons/ScIcon";
import {
  PAIN_RISK_ICONS,
  STATUS_ICON,
  TOOL_CATEGORY_ICON,
  UI_ICON,
} from "@/lib/icons/icon-registry";
import { DocumentMagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { getFreeToolsHref, getPremiumToolsHref } from "@/lib/tools/tool-links";

const PAIN_ITEMS = [
  {
    icon: PAIN_RISK_ICONS.material,
    iconClass: "text-professional-blue",
    title: "Material cost risk",
    text: "Setup time, rework and hidden labor erode margin after the estimate looks fine.",
  },
  {
    icon: PAIN_RISK_ICONS.labor,
    iconClass: "text-amber",
    title: "Labor & time risk",
    text: "Free checks expose visible risk — premium analyzers deliver the full verdict.",
  },
  {
    icon: PAIN_RISK_ICONS.overhead,
    iconClass: "text-soft-red",
    title: "Overhead & scope risk",
    text: "No ERP rollout, no consulting retainer — built for shops, trades and service teams.",
  },
] as const;

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
        <ul className="mc-home-pain-list mt-8 grid gap-4 md:grid-cols-3">
          {PAIN_ITEMS.map((item) => (
            <li key={item.title} className="sc-card">
              <FeatureIconHeader
                icon={item.icon}
                iconClassName={item.iconClass}
                title={item.title}
                subtitle={item.text}
              />
            </li>
          ))}
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
            <StatusIconBadge status="free" label="Free check output" />
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
        <p className="mc-home-conversion-eyebrow flex items-center justify-center gap-2">
          <ScIcon icon={DocumentMagnifyingGlassIcon} size="compact" className="text-professional-blue" />
          Sample verdict report
        </p>
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
            <span className="mc-home-sample-label flex items-center gap-1.5">
              <ScIcon icon={STATUS_ICON.highRisk} size="compact" className="text-soft-red" />
              Margin risk
            </span>
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
            <StatusIconBadge status="free" label="Free check" className="mb-4" />
            <ul className="space-y-3 text-sm leading-relaxed text-slate dark:text-slate-300">
              <IconListItem icon={STATUS_ICON.free} iconClassName="text-emerald">
                Visible risk signal in your browser
              </IconListItem>
              <IconListItem icon={TOOL_CATEGORY_ICON.margin} iconClassName="text-emerald">
                Direct cost exposure indicators
              </IconListItem>
              <IconListItem icon={UI_ICON.exclude} iconClassName="text-slate">
                No PDF export
              </IconListItem>
              <IconListItem icon={UI_ICON.exclude} iconClassName="text-slate">
                No saved report history
              </IconListItem>
            </ul>
            <Link href={getFreeToolsHref()} className="sc-btn-secondary mt-6 w-full sm:w-auto">
              Run Free Margin Check
            </Link>
          </article>
          <article className="sc-card sc-card-interactive border-amber/30">
            <StatusIconBadge status="premium" label="Pro verdict" className="mb-4" />
            <ul className="space-y-3 text-sm leading-relaxed text-slate dark:text-slate-300">
              <IconListItem icon={TOOL_CATEGORY_ICON.safePrice} iconClassName="text-amber">
                Minimum safe price
              </IconListItem>
              <IconListItem icon={TOOL_CATEGORY_ICON.risk} iconClassName="text-amber">
                Margin leak breakdown
              </IconListItem>
              <IconListItem icon={TOOL_CATEGORY_ICON.quote} iconClassName="text-amber">
                Accept / Reprice / Do Not Accept verdict
              </IconListItem>
              <IconListItem icon={TOOL_CATEGORY_ICON.export} iconClassName="text-amber">
                PDF-ready report and saved history
              </IconListItem>
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
