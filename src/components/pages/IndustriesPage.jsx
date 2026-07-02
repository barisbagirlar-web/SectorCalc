'use client';

/**
 * SectorCalc - Industries Hub Page
 * Drop into: /app/(route)/industries/page.jsx
 *
 * Replaces the current placeholder with a real sector hub.
 * Each card links to a filtered tool view: /free-tools?sector=SLUG
 * SEO: each sector becomes a high-value keyword target.
 */

import Link from 'next/link';

// ─── Sector Data ─────────────────────────────────────────────────────────────
// Update freeCount / proCount from your database as tool counts change.

const SECTORS = [
  {
    slug: 'manufacturing',
    icon: '🏭',
    nameKey: 'Manufacturing & Production',
    descKey: 'Production output, machine efficiency, shift scheduling, and production cost analysis.',
    freeCount: 22,
    proCount: 18,
    featured: ['OEE Calculator', 'Scrap Rate Optimization', 'Machine Hourly Rate'],
  },
  {
    slug: 'lean-oee',
    icon: '📊',
    nameKey: 'Lean, OEE & Six Sigma',
    descKey: 'Value stream mapping, 7-waste analysis, SMED, Kaizen tracking, and SPC process control.',
    freeCount: 12,
    proCount: 21,
    featured: ['7 Muda Waste Calculator', 'SMED Setup Time', 'VSM Financial Conversion'],
  },
  {
    slug: 'quality-spc',
    icon: '🎯',
    nameKey: 'Quality, SPC & Six Sigma',
    descKey: 'CPK/PPK, FMEA RPN, Gage R&R, AQL sampling, and quality cost modelling.',
    freeCount: 6,
    proCount: 8,
    featured: ['CPK/PPK Error Cost', 'FMEA RPN Score', 'Taguchi Loss Function'],
  },
  {
    slug: 'construction',
    icon: '🏗️',
    nameKey: 'Construction & Project Management',
    descKey: 'Critical path, earned value, scaffolding optimisation, and site mobilisation costing.',
    freeCount: 18,
    proCount: 10,
    featured: ['Critical Path (CPM)', 'Earned Value (EVM)', 'Concrete Mix Optimisation'],
  },
  {
    slug: 'mechanical-hvac',
    icon: '⚙️',
    nameKey: 'Mechanical, HVAC & Energy Loss',
    descKey: 'Beam stress, shaft sizing, heat exchangers, steam traps, vacuum leak cost, and insulation ROI.',
    freeCount: 38,
    proCount: 10,
    featured: ['Von Mises Stress', 'Steam Trap Leak Cost', 'Insulation Thickness ROI'],
  },
  {
    slug: 'electrical-power',
    icon: '⚡',
    nameKey: 'Electrical, Panel & Power Systems',
    descKey: 'Cable cross-section, reactive power penalty, generator sizing, and panel heat load.',
    freeCount: 12,
    proCount: 4,
    featured: ['Cable Cross-Section', 'Reactive Power Penalty', 'Generator & UPS Sizing'],
  },
  {
    slug: 'supply-chain',
    icon: '🚚',
    nameKey: 'Supply Chain & Logistics',
    descKey: 'MOQ trade-off, warehouse slot optimisation, container loading, and cross-docking vs. storage.',
    freeCount: 8,
    proCount: 9,
    featured: ['MOQ vs. Holding Cost', 'Supplier TCO Scorecard', 'Container Loading'],
  },
  {
    slug: 'maintenance',
    icon: '🔩',
    nameKey: 'Maintenance & Reliability',
    descKey: 'MTBF/MTTR financial impact, predictive maintenance ROI, spare parts stock risk.',
    freeCount: 4,
    proCount: 5,
    featured: ['MTBF/MTTR Financial', 'Predictive Maintenance ROI', 'Spare Parts Risk'],
  },
  {
    slug: 'cnc-additive',
    icon: '🔬',
    nameKey: 'CNC, 3D Printing & Advanced Mfg',
    descKey: 'Cutting parameters, tool life, 3D-printing batch optimisation, and topology weight savings.',
    freeCount: 5,
    proCount: 12,
    featured: ['Cutting Parameters & Tool Life', '3D Print Batch Nesting', 'Weight vs. Fuel Savings'],
  },
  {
    slug: 'energy-esg',
    icon: '🌱',
    nameKey: 'Energy, ESG & Environment',
    descKey: 'Renewable energy feasibility, Scope 1-2-3 emissions, CBAM carbon border tax, and ISO 50001 baseline.',
    freeCount: 9,
    proCount: 7,
    featured: ['Renewable Energy ROI', 'Scope 1-2-3 Emissions', 'CBAM Border Tax Impact'],
  },
  {
    slug: 'chemistry-process',
    icon: '🧪',
    nameKey: 'Chemistry, Process & Fluids',
    descKey: 'Mass balance, pipe friction loss, batch yield, reactor heat balance, and blending optimisation.',
    freeCount: 15,
    proCount: 6,
    featured: ['Mass Balance & Waste Track', 'Pipe Friction Loss', 'Reactor Batch Yield'],
  },
  {
    slug: 'finance-business',
    icon: '💼',
    nameKey: 'Finance & Business',
    descKey: 'Break-even, ROI, WACC, NPV, quote pricing, and machine hourly rate costing.',
    freeCount: 28,
    proCount: 8,
    featured: ['Break-Even Point', 'Quote Pricing Tool', 'Machine Hourly Rate'],
  },
  {
    slug: 'workforce-hr',
    icon: '👥',
    nameKey: 'Workforce, Shift & HR',
    descKey: 'Overtime vs. hire break-even, shift cost comparison, turnover total cost, and training ROI.',
    freeCount: 3,
    proCount: 5,
    featured: ['Overtime vs. New Hire', 'Turnover Total Cost', 'Training Investment ROI'],
  },
  {
    slug: 'hse-risk',
    icon: '⛑️',
    nameKey: 'HSE, Ergonomics & Risk',
    descKey: 'Accident cost modelling, ergonomic loss, noise/vibration exposure, and safety investment ROI.',
    freeCount: 2,
    proCount: 4,
    featured: ['Accident Cost Model', 'Ergonomic Loss Cost', 'Safety Investment ROI'],
  },
  {
    slug: 'textile-printing',
    icon: '🧵',
    nameKey: 'Textile, Printing & Laboratory',
    descKey: 'Fabric yield, cutting waste, dye recipe cost, sewing line balancing, and lab sampling optimisation.',
    freeCount: 15,
    proCount: 5,
    featured: ['Fabric Cutting Waste', 'Sewing Line Balancing', 'Dye Recipe Cost'],
  },
  {
    slug: 'food-cold-chain',
    icon: '❄️',
    nameKey: 'Food, Cold Chain & Hygiene',
    descKey: 'HACCP deviation cost, shelf-life optimisation, cold chain break loss, and recipe cost analysis.',
    freeCount: 4,
    proCount: 6,
    featured: ['HACCP Deviation Cost', 'Cold Chain Break Loss', 'Recipe Cost Optimisation'],
  },
  {
    slug: 'automation-digital',
    icon: '🤖',
    nameKey: 'Automation & Digital Factory',
    descKey: 'Cobot vs. labour ROI, AGV payback, IoT sensor investment, and paperless factory savings.',
    freeCount: 3,
    proCount: 6,
    featured: ['Cobot vs. Labour', 'IoT Predictive Maintenance ROI', 'Digital Work Order ROI'],
  },
  {
    slug: 'technology-cloud',
    icon: '☁️',
    nameKey: 'Technology, AI & Cloud',
    descKey: 'Cloud cost waste, AI automation ROI, EU AI Act compliance cost, and SaaS shelfware audit.',
    freeCount: 9,
    proCount: 8,
    featured: ['Cloud Cost Optimisation', 'AI Automation ROI', 'EU AI Act Compliance'],
  },
];

// ─── Component ───────────────────────────────────────────────────────────────

export default function IndustriesPage({ locale = 'en', translations }) {
  const t = translations?.(route)?.industries || translations?.['en']?.industries || {};
  const dir = translations?.(route)?.dir || 'ltr';

  return (
    <>
      <style>{`
        .ind-root {
          --bg:      #0F172A;
          --surface: #1E293B;
          --elevated:#253047;
          --gold:    #F59E0B;
          --green:   #10B981;
          --blue:    #38BDF8;
          --text:    #F1F5F9;
          --muted:   #94A3B8;
          --hint:    #64748B;
          --border:  rgba(255,255,255,0.07);
          --border2: rgba(255,255,255,0.14);
          --radius:  12px;
          font-family: 'DM Sans','SF Pro Text',-apple-system,BlinkMacSystemFont,sans-serif;
          background: var(--bg);
          color: var(--text);
          min-height: 100vh;
        }
        .ind-root *,
        .ind-root *::before,
        .ind-root *::after { box-sizing: border-box; margin:0; padding:0; }

        .ind-hero { text-align:center; padding:72px 24px 48px; max-width:640px; margin:0 auto; }
        .ind-hero h1 { font-size:clamp(28px,4.5vw,44px); font-weight:700; letter-spacing:-0.02em; line-height:1.15; margin-bottom:12px; }
        .ind-hero p  { font-size:16px; color:var(--muted); line-height:1.65; }

        .ind-grid {
          display:grid;
          grid-template-columns:repeat(auto-fill,minmax(280px,1fr));
          gap:14px;
          max-width:1100px;
          margin:0 auto;
          padding:0 24px 80px;
        }
        @media(max-width:600px){ .ind-grid { grid-template-columns:1fr; } }

        .ind-card {
          background:var(--surface);
          border:1px solid var(--border);
          border-radius:var(--radius);
          padding:22px 22px 18px;
          text-decoration:none;
          color:inherit;
          display:flex;
          flex-direction:column;
          gap:10px;
          transition:border-color 0.18s, background 0.18s;
        }
        .ind-card:hover { border-color:var(--border2); background:var(--elevated); }
        .ind-card:hover .ind-card-arrow { opacity:1; transform:translateX(4px); }

        [dir="rtl"] .ind-card:hover .ind-card-arrow { transform:translateX(-4px); }

        .ind-card-header { display:flex; align-items:flex-start; justify-content:space-between; gap:8px; }
        .ind-card-icon { font-size:26px; line-height:1; flex-shrink:0; }
        .ind-card-arrow { font-size:16px; color:var(--gold); opacity:0; transition:all 0.18s; margin-top:2px; }
        .ind-card-name { font-size:15px; font-weight:600; line-height:1.3; flex:1; }
        .ind-card-desc { font-size:12px; color:var(--muted); line-height:1.55; flex:1; }
        .ind-card-footer { display:flex; align-items:center; gap:10px; margin-top:4px; }
        .ind-badge { font-size:11px; font-weight:500; padding:3px 8px; border-radius:20px; }
        .ind-badge-free { background:rgba(16,185,129,0.12); color:var(--green); }
        .ind-badge-pro  { background:rgba(245,158,11,0.12);  color:var(--gold); }
        .ind-card-features { display:flex; flex-direction:column; gap:4px; margin-top:2px; }
        .ind-card-feature { font-size:11px; color:var(--hint); padding-left:12px; position:relative; }
        .ind-card-feature::before { content:'·'; position:absolute; left:2px; }
        [dir="rtl"] .ind-card-feature { padding-left:0; padding-right:12px; }
        [dir="rtl"] .ind-card-feature::before { left:auto; right:2px; }

        .ind-cta-banner {
          max-width:720px; margin:0 auto 48px; padding:0 24px;
        }
        .ind-cta-inner {
          background:rgba(245,158,11,0.08);
          border:1px solid rgba(245,158,11,0.2);
          border-radius:var(--radius);
          padding:24px 28px;
          display:flex;
          align-items:center;
          justify-content:space-between;
          gap:20px;
          flex-wrap:wrap;
        }
        .ind-cta-text { font-size:15px; color:var(--muted); }
        .ind-cta-text strong { color:var(--text); display:block; font-size:17px; margin-bottom:4px; }
        .ind-cta-link {
          display:inline-block;
          background:var(--gold);
          color:#0F172A;
          font-size:14px;
          font-weight:700;
          padding:10px 22px;
          border-radius:8px;
          text-decoration:none;
          white-space:nowrap;
          transition:background 0.15s;
          flex-shrink:0;
        }
        .ind-cta-link:hover { background:#FBBF24; }
      `}</style>

      <div className="ind-root" dir={dir}>

        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <div className="ind-hero">
          <h1>{t.hero_title || 'Find calculators for your industry'}</h1>
          <p>{t.hero_sub || '18 sectors. 300+ calculators. Free and pro.'}</p>
        </div>

        {/* ── Sector grid ──────────────────────────────────────────────── */}
        <div className="ind-grid">
          {SECTORS.map((sec) => (
            <Link
              key={sec.slug}
              href={`/free-tools?sector=${sec.slug}`}
              className="ind-card"
            >
              <div className="ind-card-header">
                <div>
                  <div className="ind-card-icon">{sec.icon}</div>
                </div>
                <div style={{ flex: 1 }}>
                  <div className="ind-card-name">{sec.nameKey}</div>
                </div>
                <div className="ind-card-arrow">→</div>
              </div>
              <div className="ind-card-desc">{sec.descKey}</div>
              <div className="ind-card-features">
                {sec.featured.slice(0, 2).map((f) => (
                  <div key={f} className="ind-card-feature">{f}</div>
                ))}
              </div>
              <div className="ind-card-footer">
                <span className="ind-badge ind-badge-free">
                  {sec.freeCount} {t.free_label || 'free'}
                </span>
                {sec.proCount > 0 && (
                  <span className="ind-badge ind-badge-pro">
                    {sec.proCount} {t.pro_label || 'pro'}
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>

        {/* ── Bottom CTA ───────────────────────────────────────────────── */}
        <div className="ind-cta-banner">
          <div className="ind-cta-inner">
            <div className="ind-cta-text">
              <strong>Need the full calculation, not just a number?</strong>
              Pro tools accept your real operating data and output a PDF-ready engineering report.
            </div>
            <Link href="/pricing" className="ind-cta-link">
              Get credits →
            </Link>
          </div>
        </div>

      </div>
    </>
  );
}
