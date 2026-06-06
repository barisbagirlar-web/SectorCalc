import Link from "next/link";
import { industryRegistry } from "@/lib/tools/industry-registry";

type FeatureItem = {
  label: string;
  href?: string;
};

const CAPABILITIES: {
  title: string;
  color: string;
  icon: string;
  summary: string;
  items: FeatureItem[];
}[] = [
  {
    title: "Validated Inputs",
    color: "blue",
    icon: "ico-blue",
    summary:
      "Sector tools use structured fields and validation so estimates start from consistent inputs.",
    items: [
      { label: "Industry-specific input sets", href: "/industries" },
      { label: "Required-field checks before results" },
      { label: "Free quick estimators", href: "/free-tools" },
    ],
  },
  {
    title: "Transparent Formulas",
    color: "green",
    icon: "ico-green",
    summary:
      "Outputs are built from documented calculation logic — not opaque scores or black-box benchmarks.",
    items: [
      { label: "Reusable tool definitions per sector" },
      { label: "Interpretation notes on every tool" },
      { label: "Premium analyzers", href: "/pricing" },
    ],
  },
  {
    title: "Risk Signals",
    color: "red",
    icon: "ico-red",
    summary:
      "Premium tools surface risk levels so teams see when margin, pricing or capacity decisions need caution.",
    items: [
      { label: "Structured risk verdict" },
      { label: "Decision-oriented recommendations" },
      { label: "Sample report preview", href: "/reports/sample-decision-report" },
    ],
  },
  {
    title: "Scenario Analysis",
    color: "orange",
    icon: "ico-orange",
    summary:
      "Compare conservative, base and aggressive paths before committing quotes, menus or contracts.",
    items: [
      { label: "Multi-path scenario evaluation" },
      { label: "Premium decision tools", href: "/pricing" },
      { label: "Sector packs", href: "/industries" },
    ],
  },
  {
    title: "Report Preview",
    color: "purple",
    icon: "ico-purple",
    summary:
      "Premium outputs package findings for stakeholders — export formats are preview-only in the MVP.",
    items: [
      { label: "Executive summary structure" },
      { label: "PDF / Excel / Word preview states" },
      { label: "View sample report", href: "/reports/sample-decision-report" },
    ],
  },
  {
    title: "Lead Intent Flow",
    color: "dark-green",
    icon: "ico-dark-green",
    summary:
      "Request premium report access and help shape billing and export rollout — payment is not live yet.",
    items: [
      { label: "Rate-limited lead capture" },
      { label: "Pricing plans", href: "/pricing" },
      { label: "For consultants", href: "/for-consultants" },
    ],
  },
];

export function PlatformCapabilitiesSection() {
  return (
    <section className="ninth-tab animation-element">
      <div className="container">
        <div className="row">
          <article className="col-xs-12">
            <h1>Comprehensive Set of Features</h1>
            <p>
              SectorCalc combines free quick estimates with premium decision reports — validated
              inputs, transparent formulas, scenarios, risk signals and report-ready structure
              across {industryRegistry.length} active sectors.
            </p>
          </article>
          {CAPABILITIES.map((capability) => (
            <article key={capability.title} className="col-xs-12 col-sm-6 col-md-4">
              <h4 className={capability.color}>{capability.title}</h4>
              <p className="mc-capability-summary">{capability.summary}</p>
              <ul className={`true-list ${capability.icon}`}>
                {capability.items.map((item) => (
                  <li key={item.label}>
                    {item.href ? (
                      <Link href={item.href}>{item.label}</Link>
                    ) : (
                      item.label
                    )}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
