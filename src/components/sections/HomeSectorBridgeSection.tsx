import Link from "next/link";
import { INDUSTRIES } from "@/data/industries";
import { getFreeToolsByIndustry, getPremiumToolsByIndustry } from "@/data/tools";

export function HomeSectorBridgeSection() {
  return (
    <section className="third-tab mc-sector-bridge" aria-labelledby="sector-bridge-heading">
      <div className="container text-center">
        <div className="row">
          <article className="col-xs-12">
            <h2 id="sector-bridge-heading">Start with one of five live sectors</h2>
            <p>
              Use quick estimators for fast numbers or open premium analyzers when the decision
              affects margin, pricing or risk.
            </p>
            <ul className="mc-sector-bridge-list">
              {INDUSTRIES.map((industry) => {
                const freeTool = getFreeToolsByIndustry(industry.slug)[0];
                const premiumTool = getPremiumToolsByIndustry(industry.slug)[0];
                if (!freeTool || !premiumTool) return null;
                return (
                  <li key={industry.slug}>
                    <Link href={industry.href} className="mc-sector-bridge-sector">
                      {industry.name}
                    </Link>
                    <span className="mc-sector-bridge-tools">
                      <Link href={freeTool.href}>{freeTool.name}</Link>
                      <span aria-hidden> / </span>
                      <Link href={premiumTool.href}>{premiumTool.name}</Link>
                    </span>
                  </li>
                );
              })}
            </ul>
          </article>
        </div>
      </div>
    </section>
  );
};
