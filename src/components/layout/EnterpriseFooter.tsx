"use client";

import Link from "next/link";
import { BRAND_ASSETS } from "@/config/brand";

export function EnterpriseFooter({ hideCta = false }: { hideCta?: boolean }) {
  return (
    <>
      {!hideCta && (
        <section className="footer-cta gradient">
          <div className="content-wrapper">
            <h2 className="cta-text">
              Ready to streamline your calculations?
            </h2>
            <p className="description">
              Start with a free sector check or unlock the full premium library of calculators and decision reports.
            </p>
            <div className="cta-buttons">
              <Link href="/free-tools" prefetch={true} className="btn btn-primary">
                Browse Free Tools
              </Link>
              <Link href="/pricing" prefetch={true} className="btn btn-secondary">
                View Pricing
              </Link>
            </div>
          </div>
        </section>
      )}

      <footer className="site-footer">
        <div className="footer-container">
          {/* Top Section: 4-Column Grid */}
          <div className="footer-grid">
            <div className="footer-col brand-col">
              <Link href="/" prefetch={true} aria-label="SectorCalc home" className="footer-logo">
                <img src={BRAND_ASSETS.logo.onDark} alt="SectorCalc Logo" className="footer-logo-img" loading="lazy" fetchPriority="low" />
              </Link>
              <p className="footer-tagline">
                Review-ready industrial calculators for cost, risk, quality, production, energy and engineering decisions. Built for decision support, documentation and qualified review.
              </p>
              <div className="trust-badges">
                <span className="badge">Standards-context methodology</span>
                <span className="badge">Privacy-first processing</span>
                <span className="badge">Secure checkout</span>
              </div>
            </div>

            <div className="footer-col">
              <h4 className="footer-heading">Platform</h4>
              <ul className="footer-links">
                <li>
                  <Link href="/calculator-library">All Calculators</Link>
                </li>
                <li>
                  <Link href="/pro-tools" prefetch={true}>Pro Calculators</Link>
                </li>
                <li>
                  <Link href="/free-tools" prefetch={true}>Free Calculators</Link>
                </li>
                <li>
                  <Link href="/engineering-diagnostics" prefetch={true}>Engineering Diagnostics</Link>
                </li>
                <li>
                  <Link href="/pricing" prefetch={true}>Credit Pricing</Link>
                </li>
                <li>
                  <Link href="/how-it-works">How it Works</Link>
                </li>
                <li>
                  <Link href="/verify">Report Verification</Link>
                </li>
              </ul>
            </div>

            <div className="footer-col">
              <h4 className="footer-heading">Resources</h4>
              <ul className="footer-links">
                <li>
                  <Link href="/guides">Guides & Docs</Link>
                </li>
                <li>
                  <Link href="/case-studies">Case Studies</Link>
                </li>
                <li>
                  <Link href="/methodology">Methodology</Link>
                </li>
                <li>
                  <Link href="/benchmarks">Benchmarks</Link>
                </li>
                <li>
                  <Link href="/industries" prefetch={true}>Industry Data</Link>
                </li>
                <li>
                  <Link href="/beta-partner">Beta Partner Program</Link>
                </li>
              </ul>
            </div>

            <div className="footer-col">
              <h4 className="footer-heading">Company</h4>
              <ul className="footer-links">
                <li>
                  <Link href="/about-us">About Us</Link>
                </li>
                <li>
                  <Link href="/about">Our Manifesto</Link>
                </li>
                <li>
                  <Link href="/trust">Trust & Security</Link>
                </li>
                <li>
                  <Link href="/privacy">Privacy Policy</Link>
                </li>
                <li>
                  <Link href="/terms">Terms of Service</Link>
                </li>
                <li>
                  <Link href="/refund-policy">Refund Policy</Link>
                </li>
                <li>
                  <Link href="/disclaimer">Legal Disclaimer</Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Mobile essential view */}
          <div className="footer-mobile-essential">
            <Link href="/pricing">Pricing</Link>
            <Link href="/free-tools">All Calculators</Link>
            <Link href="/verify">Report Verification</Link>
            <Link href="/about">About</Link>
            <Link href="/sitemap.xml" className="footer-mobile-sitemap-link">Full site map</Link>
          </div>
          <div className="footer-mobile-legal">
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
          </div>

          {/* Bottom Bar: VERTICAL STACK DESIGN */}
          <div className="footer-bottom">
            <div className="bottom-row-social">
              <a
                href="https://linkedin.com/company/sectorcalc"
                className="social-link"
                aria-label="LinkedIn"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
              <a
                href="https://github.com/sectorcalc"
                className="social-link"
                aria-label="GitHub"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </a>
            </div>

            <div className="bottom-row-legal">
              <span>&copy; 2026 SectorCalc</span>
              <span className="origin">
                Stuttgart, Germany · Global Engineering Standards
              </span>
              <span>
                <a href="mailto:hello@sectorcalc.com" style={{ textDecoration: "none", color: "inherit" }} className="footer-email-link">hello@sectorcalc.com</a>
              </span>
            </div>
          </div>
        </div>

        <style
          dangerouslySetInnerHTML={{
            __html: `
          .site-footer, .site-footer * { margin: 0; padding: 0; box-sizing: border-box; }

          .site-footer {
            background: var(--bg-surface);
            border-top: 1px solid var(--border-light);
            padding: 48px 48px 32px;
            font-family: var(--font-sans);
            color: var(--text-primary);
            width: 100%;
          }

          .footer-container {
            max-width: 1200px;
            margin: 0 auto;
            width: 100%;
          }

          /* Upper Grid */
          .footer-grid {
            display: grid;
            grid-template-columns: 1.5fr 1fr 1fr 1fr;
            gap: 32px;
            margin-bottom: 32px;
            padding-bottom: 32px;
            border-bottom: 1px solid var(--border-light);
          }

          .footer-logo { display: block; margin-bottom: 16px; }
          .footer-logo-img { height: 32px; width: auto; }
          .footer-tagline { font-size: 13px; line-height: 1.5; opacity: 0.7; max-width: 280px; margin-bottom: 16px; }
          .trust-badges { display: flex; flex-wrap: wrap; gap: 8px; }
          .badge { font-size: 11px; font-family: var(--font-mono); padding: 4px 8px; background: var(--bg-ground); border: 1px solid var(--border-light); border-radius: 4px; opacity: 0.8; white-space: nowrap; }
          
          .footer-heading { font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 16px; opacity: 0.9; }
          .footer-links { list-style: none; display: flex; flex-direction: column; gap: 6px; }
          .footer-links a { font-size: 13px; color: var(--text-primary); text-decoration: none; opacity: 0.6; transition: all 0.2s ease; display: inline-block; padding: 2px 0; }
          .footer-links a:hover { opacity: 1; color: var(--accent-terracotta); transform: translateX(2px); }

          /* BOTTOM BAR: VERTICAL STACK - NO HORIZONTAL CONFLICT POSSIBLE */
          .footer-bottom {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 20px;
            width: 100%;
            padding-top: 16px;
          }

          .bottom-row-social {
            display: flex;
            align-items: center;
            gap: 16px;
          }

          .social-link {
            display: flex; align-items: center; justify-content: center;
            width: 44px; height: 44px;
            border-radius: 8px;
            color: var(--text-primary); opacity: 0.5;
            transition: all 0.2s ease;
          }
          .social-link:hover { opacity: 1; background: var(--bg-ground); color: var(--accent-terracotta); }

          .lang-selector {
            display: flex; align-items: center; gap: 6px;
            font-size: 13px; font-family: var(--font-mono);
            opacity: 0.6; cursor: pointer;
            padding: 0 10px; height: 36px;
            border-radius: 4px; transition: all 0.2s ease;
          }
          .lang-selector:hover, .lang-selector:focus-visible { opacity: 1; background: var(--bg-ground); outline: none; }

          .bottom-row-legal {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            font-size: 12px;
            font-family: var(--font-mono);
            opacity: 0.5;
            line-height: 1;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            max-width: 100%;
          }
          .bottom-row-legal span + span::before {
            content: "·";
            margin-right: 8px;
            opacity: 0.3;
          }
          .bottom-row-legal a { color: inherit; text-decoration: none; transition: opacity 0.2s ease; }
          .bottom-row-legal a:hover { opacity: 1; color: var(--accent-terracotta); text-decoration: underline; }

          .origin { letter-spacing: 0.02em; }

          @media (max-width: 900px) {
            .site-footer { padding: 36px 24px 24px; }
            .footer-grid { grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 24px; padding-bottom: 24px; }
            .brand-col { grid-column: span 2; }
          }

          .footer-mobile-essential { display: none; }
          .footer-mobile-legal { display: none; }

          @media (max-width: 760px) {
            .footer-cta { display: none !important; }
            .site-footer { padding: 24px 16px calc(env(safe-area-inset-bottom, 0px) + 12px) !important; }
            .footer-bottom { display: none !important; }
            .footer-grid { display: none !important; }
            .footer-mobile-essential {
              display: flex; flex-wrap: wrap; gap: 12px 20px;
              padding: 24px 16px; font-size: 14px;
            }
            .footer-mobile-essential a {
              color: var(--sc-text, #1a1915);
              text-decoration: none;
              min-height: 44px;
              display: flex;
              align-items: center;
            }
            .footer-mobile-essential a:hover {
              color: var(--sc-copper, #bd5d3a);
            }
            .footer-mobile-sitemap-link {
              width: 100%;
              font-size: 12px;
              opacity: 0.6;
              margin-top: 4px;
            }
            .footer-mobile-legal {
              display: flex; gap: 16px; padding: 12px 16px;
              font-size: 12px; opacity: 0.6;
              border-top: 1px solid rgba(26,25,21,0.08);
            }
            .footer-mobile-legal a {
              color: inherit; text-decoration: none;
              min-height: 44px; display: flex; align-items: center;
            }
          }

          /* Pre-footer CTA/Tagline section */
          .footer-cta,
          .tagline-section,
          .bottom-cta-section {
            width: 100%;
            max-width: 100%;
            padding: 60px 24px;
            margin: 0;
            background: #F9FAFB;
            border-top: 1px solid #E5E7EB;
            text-align: center;
          }

          /* Content container - proportional to page width */
          .footer-cta .container,
          .footer-cta .content-wrapper {
            max-width: 1400px;
            margin: 0 auto;
            padding: 0 24px;
          }

          /* Main text - responsive and proportional */
          .footer-cta p,
          .footer-cta .tagline,
          .footer-cta .cta-text {
            font-family: 'Inter', 'SF Pro Display', system-ui, sans-serif;
            font-size: clamp(24px, 4vw, 40px);
            font-weight: 600;
            line-height: 1.4;
            color: #111827;
            margin: 0 auto;
            max-width: 1000px;
            letter-spacing: -0.02em;
          }

          /* If there is subtext/description */
          .footer-cta .subtitle,
          .footer-cta .description {
            font-size: clamp(16px, 2vw, 18px);
            color: #6B7280;
            margin-top: 16px;
            max-width: 700px;
            margin-left: auto;
            margin-right: auto;
          }

          /* If there are CTA buttons */
          .footer-cta .cta-buttons {
            margin-top: 24px;
            display: flex;
            gap: 12px;
            justify-content: center;
            flex-wrap: wrap;
          }

          .footer-cta .btn {
            padding: 14px 28px;
            font-size: 15px;
            font-weight: 600;
            border-radius: 8px;
            text-decoration: none;
            transition: all 0.2s ease;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            min-height: 48px;
          }

          .footer-cta .btn-primary {
            background: #B45C3C;
            color: #FFFFFF;
            border: 2px solid #B45C3C;
          }

          .footer-cta .btn-primary:hover {
            background: #9A4A2E;
            border-color: #9A4A2E;
            transform: translateY(-2px);
          }

          .footer-cta .btn-secondary {
            background: transparent;
            color: #374151;
            border: 2px solid #D1D5DB;
          }

          .footer-cta .btn-secondary:hover {
            border-color: #9CA3AF;
            background: #F3F4F6;
          }

          /* Responsive layout */
          @media (max-width: 768px) {
            .footer-cta {
              padding: 40px 16px;
            }
            
            .footer-cta .container,
            .footer-cta .content-wrapper {
              padding: 0 12px;
            }
            
            .footer-cta .cta-buttons {
              flex-direction: column;
              align-items: center;
            }
            
            .footer-cta .btn {
              width: 100%;
              max-width: 100%;
              min-height: 48px;
            }
          }

          /* Alternative: Gradient for more prominent visual */
          .footer-cta.gradient {
            background: linear-gradient(135deg, #F5F3EF 0%, #FFFFFF 50%, #F9FAFB 100%);
          }

          /* Alternatif: Koyu tema */
          .footer-cta.dark {
            background: #111827;
            border-top: none;
          }

          .footer-cta.dark p,
          .footer-cta.dark .tagline {
            color: #FFFFFF;
          }
        `,
          }}
        />
      </footer>
    </>
  );
}
