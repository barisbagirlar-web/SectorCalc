import Link from "@/lib/navigation/next-link";
import {
  AUTOMATION_BOUNDARY,
  NEXT_BUSINESS_STEPS,
  OPERATING_SYSTEM_GATES,
  OPERATING_SYSTEM_PIPELINE_STAGES,
} from "@/data/operating-system-content";
import { buildDebtRegister } from "@/lib/formula-governance/roadmap-debt-register/debt-register-builder";
import { compressRoadmapToNext3Batches } from "@/lib/formula-governance/roadmap-debt-register/roadmap-compressor";
import { PublicDemoCrossLinks } from "@/components/commercial/PublicDemoCrossLinks";
import { Container } from "@/components/ui/Container";

export function OperatingSystemPageContent() {
  const debt = buildDebtRegister();
  const nextBatches = compressRoadmapToNext3Batches();

  return (
    <div className="sc-pro-page public-demo-page">
      <section className="bg-deep-navy text-white">
        <Container className="sc-pro-container public-demo-hero">
          <p className="sc-pro-eyebrow text-white/70">Calculation operating system</p>
          <h1 className="mt-3 max-w-3xl text-3xl font-semibold tracking-tight md:text-4xl">
            Tool Factory — from idea to controlled deploy
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/80">
            SectorCalc accelerates sector tool production with governed pipelines — not infinite
            audit loops. Every stage has a gate; deploy requires human approval.
          </p>
          <div className="public-demo-cta-row mt-8">
            <Link
              href="/investor-demo"
              className="inline-flex min-h-[44px] items-center justify-center rounded-lg bg-white px-5 text-sm font-semibold text-deep-navy"
            >
              Investor demo pack
            </Link>
            <Link
              href="/pricing"
              className="inline-flex min-h-[44px] items-center justify-center rounded-lg border border-white/30 px-5 text-sm font-semibold text-white"
            >
              Commercial model
            </Link>
          </div>
        </Container>
      </section>

      <section className="sc-pro-section sc-pro-section--border">
        <Container className="sc-pro-container">
          <p className="sc-pro-eyebrow">Pipeline</p>
          <h2 className="sc-pro-title sc-pro-title--compact">ToolIdea → DeployReady</h2>
          <ol className="mt-8 grid gap-3 md:grid-cols-2">
            {OPERATING_SYSTEM_PIPELINE_STAGES.map((stage, index) => (
              <li key={stage.id} className="public-demo-pipeline-step sc-pro-panel flex gap-4 p-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-deep-navy text-sm font-semibold text-white">
                  {index + 1}
                </span>
                <div>
                  <p className="font-semibold text-deep-navy">{stage.label}</p>
                  <p className="mt-1 text-xs text-text-secondary">
                    {stage.automated === true
                      ? "Automated governance"
                      : stage.automated === "partial"
                        ? "Partial — feature-flag gated"
                        : "Human gate required"}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <section className="sc-pro-section sc-pro-section--alt">
        <Container className="sc-pro-container">
          <p className="sc-pro-eyebrow">Gates</p>
          <h2 className="sc-pro-title sc-pro-title--compact">What protects production</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {OPERATING_SYSTEM_GATES.map((gate) => (
              <article key={gate.id} className="sc-pro-panel p-5">
                <h3 className="font-semibold text-deep-navy">{gate.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-text-secondary">{gate.body}</p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="sc-pro-section sc-pro-section--border">
        <Container className="sc-pro-container">
          <p className="sc-pro-eyebrow">Automation boundary</p>
          <h2 className="sc-pro-title sc-pro-title--compact">Automated vs not automated</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-deep-navy">Automated</h3>
              <ul className="mt-3 space-y-2 text-sm text-text-secondary">
                {AUTOMATION_BOUNDARY.automated.map((item) => (
                  <li key={item}>— {item}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-deep-navy">Not automated</h3>
              <ul className="mt-3 space-y-2 text-sm text-text-secondary">
                {AUTOMATION_BOUNDARY.notAutomated.map((item) => (
                  <li key={item}>— {item}</li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </section>

      <section className="sc-pro-section sc-pro-section--alt">
        <Container className="sc-pro-container">
          <p className="sc-pro-eyebrow">Debt register</p>
          <h2 className="sc-pro-title sc-pro-title--compact">Remaining debt summary</h2>
          <p className="mt-3 text-sm text-text-secondary">{debt.length} tracked items — top priority:</p>
          <ul className="mt-4 space-y-2 text-sm text-text-secondary">
            {debt.slice(0, 5).map((entry) => (
              <li key={entry.id}>
                — {entry.description} ({entry.severity})
              </li>
            ))}
          </ul>
          <h3 className="mt-8 text-sm font-semibold text-deep-navy">Next 3 batches</h3>
          <ul className="mt-3 space-y-2 text-sm text-text-secondary">
            {nextBatches.map((batch) => (
              <li key={batch.batchId}>
                — {batch.batchId}: {batch.title}
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="bg-deep-navy text-white">
        <Container className="sc-pro-container py-14">
          <p className="sc-pro-eyebrow text-white/70">Business steps</p>
          <h2 className="text-2xl font-semibold">Next 3 real steps</h2>
          <ul className="mt-6 space-y-2 text-sm text-white/85">
            {NEXT_BUSINESS_STEPS.map((step) => (
              <li key={step}>— {step}</li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="sc-pro-section sc-pro-section--border">
        <Container className="sc-pro-container pb-10">
          <PublicDemoCrossLinks current="operating-system" />
        </Container>
      </section>
    </div>
  );
}
