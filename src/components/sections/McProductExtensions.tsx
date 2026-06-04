import Link from "next/link";
import { ReportPreviewCard } from "@/components/cards/ReportPreviewCard";
import type { Tool } from "@/data/tools";

interface McProductExtensionsProps {
  freeTools: Tool[];
  premiumTools: Tool[];
}

function McToolCard({ tool }: { tool: Tool }) {
  const isPremium = tool.tier === "premium";
  return (
    <article className="mc-tool-card">
      <p className={`mc-tier ${isPremium ? "mc-tier-premium" : "mc-tier-free"}`}>
        {isPremium ? "Decision tool" : "Quick estimate"}
      </p>
      <h3>{tool.name}</h3>
      <p>{tool.shortDescription}</p>
      <Link href={tool.href}>{isPremium ? "Open decision tool →" : "Run estimate →"}</Link>
    </article>
  );
}

export function McProductExtensions({ freeTools, premiumTools }: McProductExtensionsProps) {
  return (
    <>
      <section className="tenth-tab">
        <div className="container">
          <h2>Decision report preview</h2>
          <p className="mc-tenth-lead">See how premium outputs become stakeholder-ready packages.</p>
          <ReportPreviewCard />
          <p className="mc-tenth-link">
            <Link href="/reports/sample-decision-report">Open full sample report →</Link>
          </p>
        </div>
      </section>

      <section className="seventh-tab" id="tool-finder">
        <div className="container">
          <h2>Free sector tools</h2>
          <p>Structured quick estimates — no account required.</p>
          <div className="mc-tools-grid">
            {freeTools.map((tool) => (
              <McToolCard key={tool.slug} tool={tool} />
            ))}
          </div>
          <p className="mc-section-link">
            <Link href="/free-tools">View all free tools →</Link>
          </p>
        </div>
      </section>

      <section className="seventh-tab seventh-tab--muted">
        <div className="container">
          <h2>Premium decision tools</h2>
          <p>
            Scenario evaluation, risk signals and packaged reports when the cost of being wrong
            is real.
          </p>
          <div className="mc-tools-grid">
            {premiumTools.map((tool) => (
              <McToolCard key={tool.slug} tool={tool} />
            ))}
          </div>
          <p className="mc-section-link">
            <Link href="/pricing">View pricing →</Link>
          </p>
        </div>
      </section>
    </>
  );
}
