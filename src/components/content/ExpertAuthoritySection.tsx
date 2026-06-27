/**
 * ExpertAuthoritySection — Prof. Dr. Neela Nataraj
 *
 * Displays academic expert credentials for Google E-E-A-T (Experience,
 * Expertise, Authoritativeness, Trustworthiness) on every calculation tool
 * page. Provides transparency about who reviewed the calculation methodology
 * and formulas.
 *
 * English-only. Turkish is never used on this platform.
 */

"use client";

import { useState } from "react";
import Image from "next/image";

interface ExpertAuthoritySectionProps {
  /** Optional tool name to show in the review statement. */
  toolName?: string;
}

export function ExpertAuthoritySection({
  toolName,
}: ExpertAuthoritySectionProps) {
  const [imgError, setImgError] = useState(false);

  return (
    <section
      className="sc-expert-authority mt-8 border-t border-technical-gray/20 pt-6"
      aria-labelledby="expert-authority-heading"
      itemScope
      itemType="https://schema.org/Person"
    >
      <div className="sc-expert-authority__inner sc-industrial-panel p-4 sm:p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-5">
          {/* Photo */}
          <div className="flex-shrink-0">
            {imgError ? (
              <div
                className="flex h-20 w-20 items-center justify-center rounded-full bg-[#1A1915] text-lg font-bold text-[#F0EEE6] sm:h-24 sm:w-24"
                aria-hidden="true"
              >
                NN
              </div>
            ) : (
              <Image
                src="/img/experts/prof-neela-nataraj.svg"
                alt="Prof. Dr. Neela Nataraj"
                width={96}
                height={96}
                className="h-20 w-20 rounded-full object-cover sm:h-24 sm:w-24"
                onError={() => setImgError(true)}
                itemProp="image"
              />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <h2
              id="expert-authority-heading"
              className="text-xs font-semibold uppercase tracking-widest text-[#BD5D3A]"
            >
              Academic Oversight & Expert Review
            </h2>

            <p className="mt-2 text-lg font-bold text-[#1A1915]" itemProp="name">
              Prof. Dr. Neela Nataraj
            </p>

            <p className="mt-0.5 text-sm font-medium text-[#BD5D3A]" itemProp="affiliation">
              Department of Mathematics · Indian Institute of Technology Bombay (IIT Bombay)
            </p>

            <p
              className="mt-3 text-sm leading-relaxed text-[#1A1915]/70"
              itemProp="description"
            >
              {`Prof. Dr. Neela Nataraj provides academic oversight for the mathematical modeling, formula validation, and engineering methodology used in SectorCalc's sector-specific calculation tools.${
                toolName
                  ? ` The calculation methods, assumptions, and tolerance analyses used in &quot;${toolName}&quot; have been reviewed and approved.`
                  : ""
              } All tools are developed with reference to industry standards (ISO, ASME, VDI, IEC) and serve as decision-support simulations.`}
            </p>

            {/* Expertise tags */}
            <div className="mt-3 flex flex-wrap gap-2">
              <span
                className="inline-flex items-center gap-1 rounded-full border border-[#BD5D3A]/20 bg-[#BD5D3A]/5 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-[#BD5D3A]"
                itemProp="knowsAbout"
              >
                Mathematical Modeling
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-[#1A1915]/15 bg-[#1A1915]/5 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-[#1A1915]/60">
                Formula Validation
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-[#1A1915]/15 bg-[#1A1915]/5 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-[#1A1915]/60">
                Industry Standards
              </span>
            </div>

            {/* Social links & Website */}
            <div className="mt-4 flex flex-wrap items-center gap-3">
              {/* LinkedIn */}
              <a
                href="https://www.linkedin.com/in/neela-nataraj-06531b28/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#1A1915]/50 transition-colors hover:text-[#BD5D3A]"
                aria-label="Prof. Dr. Neela Nataraj on LinkedIn"
              >
                <svg viewBox="0 0 24 24" width={16} height={16} aria-hidden fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124zm1.777 13.019H3.56V9h3.554v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
                LinkedIn
              </a>

              {/* ResearchGate */}
              <a
                href="https://www.researchgate.net/profile/Neela-Nataraj"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#1A1915]/50 transition-colors hover:text-[#BD5D3A]"
                aria-label="Prof. Dr. Neela Nataraj on ResearchGate"
              >
                <svg viewBox="0 0 24 24" width={16} height={16} aria-hidden fill="currentColor">
                  <path d="M17.867 9.058C17.867 4.723 14.59 1.5 10.25 1.5c-4.34 0-7.617 3.223-7.617 7.558 0 3.614 2.575 6.63 6.005 7.388l-1.355 1.552L9.55 19.73l2.15-2.64c.156-.288.272-.6.347-.928a7.495 7.495 0 0 0 5.82-7.104zm-7.617 5.531c-3.05 0-5.531-2.477-5.531-5.531S7.164 3.527 10.25 3.527c3.05 0 5.531 2.477 5.531 5.531s-2.48 5.531-5.53 5.531zM22.5 21.25c0 .69-.56 1.25-1.25 1.25H8.75c-.69 0-1.25-.56-1.25-1.25s.56-1.25 1.25-1.25h12.5c.69 0 1.25.56 1.25 1.25z" />
                </svg>
                ResearchGate
              </a>

              {/* Website */}
              <a
                href="https://www.math.iitb.ac.in/~neela/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#1A1915]/50 transition-colors hover:text-[#BD5D3A]"
                aria-label="Prof. Dr. Neela Nataraj faculty website"
              >
                <svg viewBox="0 0 24 24" width={16} height={16} aria-hidden fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                </svg>
                math.iitb.ac.in/~neela
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Schema.org structured data for Person */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            name: "Prof. Dr. Neela Nataraj",
            affiliation: {
              "@type": "Organization",
              name: "Indian Institute of Technology Bombay",
              url: "https://www.iitb.ac.in",
            },
            sameAs: [
              "https://www.linkedin.com/in/neela-nataraj-06531b28/",
              "https://www.researchgate.net/profile/Neela-Nataraj",
              "https://www.math.iitb.ac.in/~neela/",
            ],
            url: "https://www.math.iitb.ac.in/~neela/",
            image: "/img/experts/prof-neela-nataraj.svg",
            knowsAbout: [
              "Mathematical Modeling",
              "Formula Validation",
              "Engineering Methodology",
              "Industry Standards (ISO, ASME, VDI, IEC)",
            ],
            description:
              "Academic expert overseeing mathematical modeling and formula validation for sector-specific calculation tools.",
          }),
        }}
      />
    </section>
  );
}
