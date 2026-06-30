"use client";

import { ArrowRight, Route, Sparkles } from "lucide-react";
import { Container } from "@/components/ui/Container";

export function openTraceChat(): void {
  if (typeof window === "undefined") {
    return;
  }

  const fab = document.getElementById("trace-fab");
  if (fab) {
    if (fab.getAttribute("aria-expanded") !== "true") {
      fab.click();
    }
    return;
  }

  window.dispatchEvent(new CustomEvent("trace:open"));
}

export type TraceIntroCopy = {
  readonly avatarAlt: string;
  readonly badge: string;
  readonly title: string;
  readonly description: string;
  readonly feature1: string;
  readonly feature2: string;
  readonly cta: string;
};

type TraceIntroProps = {
  readonly copy: TraceIntroCopy;
};

export function TraceIntro({ copy }: TraceIntroProps) {
  return (
    <section className="sc-trace-intro" aria-labelledby="trace-intro-heading">
      <Container size="wide" className="sc-pro-container sc-pro-container--wide min-w-0">
        <div className="sc-trace-intro__card">
          <div className="sc-trace-intro__inner">
            <div className="sc-trace-intro__avatar-wrap" aria-label={copy.avatarAlt}>
              <svg
                viewBox="0 0 512 512"
                role="img"
                aria-hidden="true"
                className="sc-trace-intro__avatar-svg"
              >
                <style>{`
                  @keyframes traceHue1 {
                    0%, 100% { fill: #F43F5E; }
                    20% { fill: #10B981; }
                    40% { fill: #F59E0B; }
                    60% { fill: #3B82F6; }
                    80% { fill: #F97316; }
                  }
                  @keyframes traceHue2 {
                    0%, 100% { fill: #F97316; }
                    20% { fill: #F43F5E; }
                    40% { fill: #10B981; }
                    60% { fill: #F59E0B; }
                    80% { fill: #3B82F6; }
                  }
                  @keyframes traceHue3 {
                    0%, 100% { fill: #3B82F6; }
                    20% { fill: #F97316; }
                    40% { fill: #F43F5E; }
                    60% { fill: #10B981; }
                    80% { fill: #F59E0B; }
                  }
                  @keyframes traceHue4 {
                    0%, 100% { fill: #F59E0B; }
                    20% { fill: #3B82F6; }
                    40% { fill: #F97316; }
                    60% { fill: #F43F5E; }
                    80% { fill: #10B981; }
                  }
                  .trace-shape-1 { animation: traceHue1 6s ease-in-out infinite; }
                  .trace-shape-2 { animation: traceHue2 6s ease-in-out infinite; }
                  .trace-shape-3 { animation: traceHue3 6s ease-in-out infinite; }
                  .trace-shape-4 { animation: traceHue4 6s ease-in-out infinite; }
                `}</style>
                <rect className="trace-shape-1" x="101" y="209" width="58" height="20" rx="0" />
                <rect className="trace-shape-2" x="355" y="209" width="58" height="20" rx="0" />
                <path className="trace-shape-3" d="M254 111H197V91H276V340H254V111Z" />
                <rect className="trace-shape-4" x="196" y="374" width="119" height="20" rx="0" />
              </svg>
            </div>

            <div className="sc-trace-intro__copy">
              <div className="sc-trace-intro__badge-row">
                <Route className="sc-trace-intro__badge-icon" aria-hidden />
                <span className="sc-trace-intro__badge">{copy.badge}</span>
              </div>

              <h2 id="trace-intro-heading" className="sc-trace-intro__title">
                {copy.title}
              </h2>

              <p className="sc-trace-intro__description whitespace-pre-line">{copy.description}</p>

              <ul className="sc-trace-intro__features">
                <li className="sc-trace-intro__feature">
                  <Sparkles className="sc-trace-intro__feature-icon" aria-hidden />
                  <span>{copy.feature1}</span>
                </li>
                <li className="sc-trace-intro__feature">
                  <Route className="sc-trace-intro__feature-icon" aria-hidden />
                  <span>{copy.feature2}</span>
                </li>
              </ul>
            </div>

            <div className="sc-trace-intro__cta-wrap">
              <button type="button" className="sc-cta-primary sc-trace-intro__cta" onClick={openTraceChat}>
                <span>{copy.cta}</span>
                <ArrowRight className="sc-trace-intro__cta-icon" aria-hidden />
              </button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
