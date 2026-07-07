"use client";

import Link from "next/link";
import "@/styles/landing-page.css";

export function LandingPageContent({
  freeCount = 0,
}: {
  freeCount?: number;
}) {
  return (
    <div className="claude-landing">
      <main>
        {/* HERO */}
        <section className="hero">
          <div className="wrap">
            <p className="eyebrow">Industrial calculators for real production decisions</p>
            <h1>Calculate cost, risk, downtime and engineering decisions before they become expensive mistakes.</h1>
            <p className="subhead">
              SectorCalc helps technicians, operators, engineers, production managers and workshop owners turn field data into clear decisions: estimate the cost, check the risk, compare scenarios, diagnose failures, prepare FMEA RPN, and document the result for review.
            </p>

            <div className="cta-row">
              <Link href="/free-tools" prefetch={true} className="btn-primary">Browse Free Tools</Link>
              <Link href="/pro-tools" prefetch={true} className="btn-secondary">Explore Pro Tools</Link>
              <Link href="/engineering-diagnostics" prefetch={true} className="btn-tertiary">Start Engineering Diagnostics</Link>
            </div>

            <div className="trust-row">
              <span>{freeCount || 195}+ Pro calculators</span>
              <span>Free industrial calculators</span>
              <span>Engineering Diagnostics with PDF reports</span>
              <span>FMEA RPN risk scoring</span>
              <span>Real case studies</span>
              <span>Pay-as-you-go credits</span>
            </div>
          </div>
        </section>

        {/* OUTCOME CARDS */}
        <section className="sec-section outcome-section">
          <div className="wrap">
            <div className="grid outcome-grid">
              <div className="outcome-card">
                <h3>Find the number behind the problem</h3>
                <p>Calculate machine cost, OEE, scrap, quote margin, energy loss, payback, downtime, FMEA RPN and engineering risk using structured inputs instead of rough guesses.</p>
                <Link href="/free-tools" prefetch={true} className="btn-link">Search calculators &rarr;</Link>
              </div>
              <div className="outcome-card">
                <h3>Decide what to do next</h3>
                <p>Each result must explain the decision: proceed, hold, reprice, inspect, repair, reduce risk, escalate or prepare a review-ready report.</p>
                <Link href="/pro-tools" prefetch={true} className="btn-link">Explore Pro Tools &rarr;</Link>
              </div>
              <div className="outcome-card">
                <h3>Diagnose field issues from evidence</h3>
                <p>Upload photos, add measurements, confirm context and generate an Engineering Diagnostics report with root-cause hypotheses, cost exposure, NCR/CAPA drafts and verification records.</p>
                <Link href="/engineering-diagnostics" prefetch={true} className="btn-link">Start Diagnostics &rarr;</Link>
              </div>
            </div>
          </div>
        </section>

        {/* PROBLEM SECTION */}
        <section className="sec-section problem-section">
          <div className="wrap">
            <h2>Built for the moments where a wrong estimate costs money</h2>
            <p className="section-intro">
              SectorCalc is not a general calculator library. It is built for the daily decisions where missing one variable can create scrap, rework, idle machines, bad quotes, energy loss, quality disputes or delayed projects.
            </p>
            <div className="problem-list">
              <div className="problem-item">
                <span className="problem-label">CNC / machining:</span>
                <span className="problem-text">wrong cycle time, weak hourly rate, tool wear, low OEE, underpriced jobs.</span>
              </div>
              <div className="problem-item">
                <span className="problem-label">Welding / fabrication:</span>
                <span className="problem-text">weld cost, rework risk, WPS preheat checks, distortion, material and labor exposure.</span>
              </div>
              <div className="problem-item">
                <span className="problem-label">Quality / maintenance:</span>
                <span className="problem-text">FMEA RPN, gage error, calibration drift, recurring defects, downtime and CAPA evidence.</span>
              </div>
              <div className="problem-item">
                <span className="problem-label">Construction / engineering:</span>
                <span className="problem-text">quantity checks, roof/load estimates, concrete and steel cost exposure, project delay risk.</span>
              </div>
              <div className="problem-item">
                <span className="problem-label">Energy / facilities:</span>
                <span className="problem-text">compressed air leaks, kWh cost, peak demand, HVAC load, compressor loss and carbon exposure.</span>
              </div>
              <div className="problem-item">
                <span className="problem-label">Logistics / inventory:</span>
                <span className="problem-text">freight cost, EOQ, stock risk, route loss, warehouse layout and working capital impact.</span>
              </div>
              <div className="problem-item">
                <span className="problem-label">Finance / controlling:</span>
                <span className="problem-text">break-even, margin leakage, payback, NPV, IRR, cash-flow gap and pricing decisions.</span>
              </div>
            </div>
          </div>
        </section>

        {/* PRODUCT SYSTEM */}
        <section className="sec-section product-system-section">
          <div className="wrap">
            <h2>One platform. Four decision paths.</h2>
            <div className="grid product-grid">
              <div className="product-card">
                <h3>Free Tools</h3>
                <p>Start with fast industrial calculators for everyday checks: cost, margin, energy, production, logistics, finance and basic engineering questions.</p>
                <Link href="/free-tools" prefetch={true} className="btn-link">Browse Free Tools &rarr;</Link>
              </div>
              <div className="product-card">
                <h3>Pro Tools</h3>
                <p>Use deeper calculators when the decision needs sensitivity, tolerance guidance, business impact, scenario comparison, uncertainty notes, PDF output or review-ready documentation.</p>
                <Link href="/pro-tools" prefetch={true} className="btn-link">Explore Pro Tools &rarr;</Link>
              </div>
              <div className="product-card">
                <h3>Engineering Diagnostics</h3>
                <p>Use photos, measurements and field context to create structured diagnostic reports for visible defects, failures, quality issues, maintenance problems and corrective-action discussions.</p>
                <Link href="/engineering-diagnostics" prefetch={true} className="btn-link">Start Engineering Diagnostics &rarr;</Link>
              </div>
              <div className="product-card">
                <h3>FMEA RPN Calculator</h3>
                <p>Score severity, occurrence and detection, rank failure modes, identify the highest-risk causes and turn quality discussions into a clear action list.</p>
                <Link href="/calculators/fmea-rpn" prefetch={true} className="btn-link">Open FMEA RPN Calculator &rarr;</Link>
              </div>
            </div>
          </div>
        </section>

        {/* CASE STUDIES */}
        <section className="sec-section casestudies-section">
          <div className="wrap">
            <h2>Real calculation workflows, real operational impact</h2>
            <p className="section-intro">
              SectorCalc case studies show how calculation-backed decisions can expose wasted cost, weak process controls, quote leakage and avoidable operational losses. Company names are anonymized where required.
            </p>
            <div className="grid cs-grid">
              <div className="cs-card">
                <h4>CNC workshop</h4>
                <p>Quote leakage, machining cost, OEE and annual savings.</p>
              </div>
              <div className="cs-card">
                <h4>Energy / carbon</h4>
                <p>Consumption, efficiency gap and annual savings.</p>
              </div>
              <div className="cs-card">
                <h4>Welding / metal</h4>
                <p>Rework, weld cost and corrective-action impact.</p>
              </div>
              <div className="cs-card">
                <h4>Automotive supply chain</h4>
                <p>5S audit score improvement and operational savings.</p>
              </div>
            </div>
            <div className="cta-center">
              <Link href="/case-studies" prefetch={true} className="btn-primary">View Case Studies</Link>
            </div>
          </div>
        </section>

        {/* METHODOLOGY */}
        <section className="sec-section methodology-section">
          <div className="wrap">
            <h2>What every serious calculation should show</h2>
            <div className="grid meth-grid">
              <div className="meth-card">What was calculated</div>
              <div className="meth-card">Which inputs changed the result</div>
              <div className="meth-card">Where the tolerance or risk zone starts</div>
              <div className="meth-card">What can flip the decision</div>
              <div className="meth-card">What evidence is missing</div>
              <div className="meth-card">What action should be taken next</div>
              <div className="meth-card meth-card-wide">When qualified professional review is required</div>
            </div>
          </div>
        </section>

        {/* FMEA FEATURE */}
        <section className="sec-section fmea-section">
          <div className="wrap">
            <h2>FMEA RPN for quality, maintenance and production risk</h2>
            <p className="section-intro">
              Use FMEA RPN when a defect, failure mode or process weakness must be ranked before action. Enter severity, occurrence and detection values, identify the highest-risk failure modes, and produce a clear mitigation list for review.
            </p>
            <ul className="feature-bullets">
              <li>Rank failure modes by RPN</li>
              <li>Separate high-risk issues from noise</li>
              <li>Support NCR, CAPA, maintenance and quality meetings</li>
              <li>Connect risk priority to cost, downtime and rework exposure</li>
              <li>Use Pro reports when documentation is needed</li>
            </ul>
            <div className="cta-center">
              <Link href="/calculators/fmea-rpn" prefetch={true} className="btn-primary">Open FMEA RPN Calculator</Link>
            </div>
          </div>
        </section>

        {/* DIAGNOSTICS FEATURE */}
        <section className="sec-section diagnostics-section">
          <div className="wrap">
            <h2>Engineering Diagnostics for field photos, failures and defects</h2>
            <p className="section-intro">
              Upload field photos, add measurements and describe the issue. SectorCalc helps structure the investigation with visible observations, measurement confidence, root-cause hypotheses, cost-at-risk, corrective-action drafts and a verification record.
            </p>
            <ul className="feature-bullets">
              <li>CNC, welding, steel, concrete, electrical and mechanical domains</li>
              <li>Photo-based issue capture</li>
              <li>Measurement and calibration context</li>
              <li>NCR / CAPA draft support</li>
              <li>PDF report and verification hash</li>
              <li>Decision-support only; qualified review required</li>
            </ul>
            <div className="cta-center">
              <Link href="/engineering-diagnostics" prefetch={true} className="btn-primary">Start Engineering Diagnostics</Link>
            </div>
          </div>
        </section>

        {/* CTA BAND */}
        <section className="sec-section cta-band">
          <div className="wrap text-center">
            <h2>Start with the decision you need to make today.</h2>
            <p className="cta-band-text">
              Use a free calculator for a quick check. Use Pro when the result affects price, production, quality, energy cost, rework, downtime, safety margin or customer commitment.
            </p>
            <div className="cta-row main-actions center">
              <Link href="/free-tools" prefetch={true} className="btn-primary">Browse Free Tools</Link>
              <Link href="/pro-tools" prefetch={true} className="btn-secondary">Explore Pro Tools</Link>
              <Link href="/case-studies" prefetch={true} className="btn-secondary">View Case Studies</Link>
            </div>
          </div>
        </section>

        {/* SEO BLOCK */}
        <section className="seo-block">
          <div className="wrap">
            <p>SectorCalc provides industrial calculators for manufacturing, engineering, workshops, quality, maintenance, energy, construction, logistics, and finance. Use the platform to calculate cost, risk, downtime, FMEA RPN, OEE, quotes, energy loss and engineering diagnostics with review-ready decision reports. Review-ready industrial calculators for cost, risk, quality, production, energy and engineering decisions. Built for decision support, documentation and qualified review.</p>
          </div>
        </section>
      </main>
    </div>
  );
}
