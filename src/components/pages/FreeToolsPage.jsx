'use client';

/**
 * SectorCalc — Free Tools Page
 * Drop into: /app/[locale]/free-tools/page.jsx
 *
 * Features:
 *  - Live search (client-side, no API needed)
 *  - Sector filter tabs
 *  - Pro upsell banners injected every N tools
 *  - Clean card grid (replaces the footer-style list)
 *  - "Pro" lock icon on tools that require a credit
 *
 * Pass `freeTools` and `proTools` from your DB/API via props or server component.
 * Format: [{ slug, name, sector, isPro?, description? }]
 */

import { useState, useMemo } from 'react';
import Link from 'next/link';

// ─── Sample data shape ────────────────────────────────────────────────────────
// Replace with real data from your DB.
// The key fields: slug, name, sector, isPro (bool)

const SAMPLE_TOOLS = [
  // Free tools — from your existing /free-tools list (English names)
  { slug: 'overall-equipment-effectiveness-calculator',       name: 'OEE Calculator',                      sector: 'lean-oee',        isPro: false },
  { slug: 'scrap-rate-optimization-calculator',               name: 'Scrap Rate Optimization',             sector: 'lean-oee',        isPro: false },
  { slug: 'bottleneck-analysis-calculator',                   name: 'Bottleneck Analysis',                 sector: 'lean-oee',        isPro: false },
  { slug: 'line-balancing-calculator',                        name: 'Line Balancing',                      sector: 'lean-oee',        isPro: false },
  { slug: 'smed-setup-time-calculator',                       name: 'SMED Setup Time',                     sector: 'lean-oee',        isPro: false },
  { slug: 'learning-curve-calculator',                        name: 'Learning Curve',                      sector: 'lean-oee',        isPro: false },
  { slug: 'standard-time-calculator',                         name: 'Standard Time',                       sector: 'lean-oee',        isPro: false },
  { slug: 'machine-depreciation-calculator',                  name: 'Machine Depreciation',                sector: 'lean-oee',        isPro: false },
  { slug: 'beam-deflection-calculator',                       name: 'Beam Deflection',                     sector: 'mechanical-hvac', isPro: false },
  { slug: 'von-mises-stress-calculator',                      name: 'Von Mises Stress',                    sector: 'mechanical-hvac', isPro: false },
  { slug: 'asme-shaft-diameter-bending-torsion-calculator',  name: 'ASME Shaft Diameter (Bending+Torsion)',sector: 'mechanical-hvac', isPro: false },
  { slug: 'mohrs-circle-principal-stress-calculator',         name: "Mohr's Circle — Principal Stress",   sector: 'mechanical-hvac', isPro: false },
  { slug: 'steel-beam-maximum-bending-stress-calculator',     name: 'Steel Beam Max Bending Stress',       sector: 'mechanical-hvac', isPro: false },
  { slug: 'thin-walled-pressure-vessel-hoop-stress-calculator','name': 'Thin-Wall Pressure Vessel Hoop Stress', sector: 'mechanical-hvac', isPro: false },
  { slug: 'heat-transfer-rate-calculator',                    name: 'Heat Transfer Rate',                  sector: 'chemistry-process', isPro: false },
  { slug: 'bernoulli-pressure-calculator',                    name: 'Bernoulli Pressure',                  sector: 'chemistry-process', isPro: false },
  { slug: 'carbon-footprint-calculator',                      name: 'Carbon Footprint',                    sector: 'energy-esg',      isPro: false },
  { slug: 'esg-score-calculator',                             name: 'ESG Score',                           sector: 'energy-esg',      isPro: false },
  { slug: 'levelized-cost-of-energy-calculator',              name: 'Levelized Cost of Energy (LCOE)',     sector: 'energy-esg',      isPro: false },
  { slug: 'roi-calculator',                                   name: 'ROI Calculator',                      sector: 'finance-business',isPro: false },
  { slug: 'npv-calculator',                                   name: 'NPV Calculator',                      sector: 'finance-business',isPro: false },
  { slug: 'break-even-point-calculator',                      name: 'Break-Even Point',                    sector: 'finance-business',isPro: false },
  { slug: 'irr-calculator',                                   name: 'IRR Calculator',                      sector: 'finance-business',isPro: false },
  { slug: 'wacc-calculator',                                  name: 'WACC Calculator',                     sector: 'finance-business',isPro: false },
  { slug: 'ebitda-calculator',                                name: 'EBITDA Calculator',                   sector: 'finance-business',isPro: false },
  { slug: 'freight-cost-calculator',                          name: 'Freight Cost',                        sector: 'supply-chain',    isPro: false },
  { slug: 'container-loading-calculator',                     name: 'Container Loading',                   sector: 'supply-chain',    isPro: false },
  { slug: 'economic-order-quantity-calculator',               name: 'Economic Order Quantity (EOQ)',        sector: 'supply-chain',    isPro: false },
  { slug: 'inventory-turnover-calculator',                    name: 'Inventory Turnover',                  sector: 'supply-chain',    isPro: false },
  { slug: 'reorder-point-calculator',                         name: 'Reorder Point',                       sector: 'supply-chain',    isPro: false },
  { slug: 'capacitive-reactance-calculator',                  name: 'Capacitive Reactance',                sector: 'electrical-power',isPro: false },
  { slug: 'inductive-reactance-calculator',                   name: 'Inductive Reactance',                 sector: 'electrical-power',isPro: false },
  { slug: 'fabric-weight-calculator',                         name: 'Fabric Weight',                       sector: 'textile-printing',isPro: false },
  { slug: 'fabric-shrinkage-calculator',                      name: 'Fabric Shrinkage',                    sector: 'textile-printing',isPro: false },
  { slug: 'loom-production-calculator',                       name: 'Loom Production',                     sector: 'textile-printing',isPro: false },
  // Pro tools — English display names (slugs are your existing Turkish URLs)
  { slug: 'tools/premium-schema/7-israf-muda-avcisi-parasal-karsilik-calculator',        name: '7-Waste (Muda) Monetary Mapping',     sector: 'lean-oee',        isPro: true },
  { slug: 'tools/premium-schema/5s-denetim-skoru-verimlilik-kaybi-maliyet-calculator',   name: '5S Audit Score & Productivity Loss',  sector: 'lean-oee',        isPro: true },
  { slug: 'tools/generated/mtbf-mttr-ve-kullanilabilirlik-finansal-calculator',          name: 'MTBF/MTTR Availability & Financial',  sector: 'maintenance',     isPro: true },
  { slug: 'tools/generated/cpk-ppk-hata-maliyeti-ppm-calculator',                       name: 'CPK/PPK Error Cost & PPM',            sector: 'quality-spc',     isPro: true },
  { slug: 'tools/generated/htea-rpn-skoru-parasal-risk-calculator',                     name: 'FMEA RPN Score & Monetary Risk',      sector: 'quality-spc',     isPro: true },
  { slug: 'tools/generated/cobot-vs-manuel-iscilik-karsilastirma-calculator',           name: 'Cobot vs. Manual Labour ROI',         sector: 'automation-digital', isPro: true },
  { slug: 'tools/generated/iot-sensor-ve-ongorucu-bakim-yatirim-geri-donus-calculator', name: 'IoT Sensor & Predictive Maintenance ROI', sector: 'automation-digital', isPro: true },
  { slug: 'tools/generated/yenilenebilir-enerji-ges-res-yatirim-fizibilite-calculator', name: 'Renewable Energy (Solar/Wind) ROI',   sector: 'energy-esg',      isPro: true },
  { slug: 'tools/generated/cbam-karbon-sinir-vergisi-ve-ihracat-maliyet-etkisi-calculator','name': 'CBAM Carbon Border Tax & Export Cost', sector: 'energy-esg', isPro: true },
  { slug: 'tools/generated/kritik-yol-cpm-gecikme-cezasi-ve-hizlandirma-optimizasyon-calculator','name':'Critical Path (CPM) Delay & Acceleration', sector:'construction', isPro: true },
  { slug: 'tools/generated/kazanilmis-deger-yonetimi-evm-tamamlanma-maliyet-tahmin-calculator','name':'Earned Value Management (EVM) Completion Cost', sector:'construction', isPro: true },
  { slug: 'tools/generated/ai-otomasyon-roi-ve-is-gucu-etki-calculator',                'name': 'AI Automation ROI & Workforce Impact', sector: 'technology-cloud', isPro: true },
  { slug: 'tools/generated/bulut-maliyet-optimizasyonu-ve-israf-eliminasyonu-calculator','name': 'Cloud Cost Optimisation & Waste', sector: 'technology-cloud', isPro: true },
];

// ─── Sector filter options ────────────────────────────────────────────────────

const SECTOR_TABS = [
  { id: 'all',               label: 'All' },
  { id: 'lean-oee',          label: 'Lean & OEE' },
  { id: 'mechanical-hvac',   label: 'Mechanical' },
  { id: 'finance-business',  label: 'Finance' },
  { id: 'supply-chain',      label: 'Supply Chain' },
  { id: 'construction',      label: 'Construction' },
  { id: 'energy-esg',        label: 'Energy & ESG' },
  { id: 'quality-spc',       label: 'Quality' },
  { id: 'electrical-power',  label: 'Electrical' },
  { id: 'chemistry-process', label: 'Chemistry' },
  { id: 'maintenance',       label: 'Maintenance' },
  { id: 'automation-digital','label': 'Automation' },
  { id: 'technology-cloud',  'label': 'Technology' },
  { id: 'textile-printing',  label: 'Textile' },
];

// ─── Upsell banner component ─────────────────────────────────────────────────

function UpsellBanner({ t }) {
  return (
    <div className="ft-upsell-banner">
      <div className="ft-upsell-left">
        <div className="ft-upsell-title">{t.pro_upsell_title || 'Need the full picture?'}</div>
        <div className="ft-upsell-body">{t.pro_upsell_body || 'Pro tools include real parameter inputs, PDF export, and industrial standards. From $1.99.'}</div>
      </div>
      <Link href="/pricing" className="ft-upsell-cta">
        {t.pro_upsell_cta || 'See pro tools →'}
      </Link>
    </div>
  );
}

// ─── Tool card ───────────────────────────────────────────────────────────────

function ToolCard({ tool, t }) {
  const href = tool.isPro
    ? `/pricing`          // Pro tools gate to pricing
    : `/tools/generated/${tool.slug}`;

  return (
    <Link href={href} className={`ft-tool-card${tool.isPro ? ' ft-pro-card' : ''}`}>
      <div className="ft-tool-card-inner">
        <div className="ft-tool-name">{tool.name}</div>
        <div className="ft-tool-badge-row">
          {tool.isPro
            ? <span className="ft-badge ft-badge-pro">🔒 {t.badge_pro || 'Pro'}</span>
            : <span className="ft-badge ft-badge-free">{t.badge_free || 'Free'}</span>
          }
          {tool.isPro && (
            <span className="ft-tool-credit-hint">1 credit</span>
          )}
        </div>
      </div>
      <div className="ft-tool-arrow">→</div>
    </Link>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function FreeToolsPage({ locale = 'en', translations, tools = SAMPLE_TOOLS }) {
  const t   = translations?.[locale]?.free_tools || translations?.['en']?.free_tools || {};
  const dir = translations?.[locale]?.dir || 'ltr';

  const [query,     setQuery]     = useState('');
  const [sector,    setSector]    = useState('all');
  const [showAll,   setShowAll]   = useState(false);

  const PAGE_SIZE = 30;

  const filtered = useMemo(() => {
    let list = tools;
    if (sector !== 'all') list = list.filter((t) => t.sector === sector);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((t) => t.name.toLowerCase().includes(q));
    }
    return list;
  }, [tools, query, sector]);

  const visible = showAll ? filtered : filtered.slice(0, PAGE_SIZE);

  // Insert upsell banners every 12 items in the visible list
  const UPSELL_EVERY = 12;
  const itemsWithBanners = [];
  visible.forEach((tool, i) => {
    itemsWithBanners.push({ type: 'tool', tool });
    if ((i + 1) % UPSELL_EVERY === 0 && i < visible.length - 1) {
      itemsWithBanners.push({ type: 'upsell' });
    }
  });

  return (
    <>
      <style>{`
        .ft-root {
          --bg:      #0F172A;
          --surface: #1E293B;
          --elevated:#253047;
          --gold:    #F59E0B;
          --green:   #10B981;
          --text:    #F1F5F9;
          --muted:   #94A3B8;
          --hint:    #64748B;
          --border:  rgba(255,255,255,0.07);
          --border2: rgba(255,255,255,0.14);
          --radius:  10px;
          font-family:'DM Sans','SF Pro Text',-apple-system,BlinkMacSystemFont,sans-serif;
          background:var(--bg);
          color:var(--text);
          min-height:100vh;
        }
        .ft-root *,.ft-root *::before,.ft-root *::after{box-sizing:border-box;margin:0;padding:0;}

        .ft-hero{text-align:center;padding:64px 24px 36px;max-width:600px;margin:0 auto;}
        .ft-hero h1{font-size:clamp(26px,4vw,40px);font-weight:700;letter-spacing:-0.02em;margin-bottom:10px;}
        .ft-hero p{font-size:15px;color:var(--muted);line-height:1.6;}

        /* Search */
        .ft-search-wrap{max-width:520px;margin:0 auto 24px;padding:0 24px;}
        .ft-search{
          width:100%;padding:12px 16px;
          background:var(--surface);
          border:1px solid var(--border2);
          border-radius:8px;
          color:var(--text);
          font-size:15px;
          outline:none;
          transition:border-color 0.15s;
        }
        .ft-search:focus{border-color:var(--gold);}
        .ft-search::placeholder{color:var(--hint);}

        /* Sector tabs */
        .ft-tabs-wrap{overflow-x:auto;padding:0 24px 24px;scrollbar-width:none;}
        .ft-tabs-wrap::-webkit-scrollbar{display:none;}
        .ft-tabs{display:flex;gap:8px;white-space:nowrap;max-width:1060px;margin:0 auto;}
        .ft-tab{
          padding:7px 14px;
          border-radius:20px;
          font-size:13px;
          font-weight:500;
          cursor:pointer;
          border:1px solid var(--border);
          background:transparent;
          color:var(--muted);
          transition:all 0.15s;
        }
        .ft-tab:hover{border-color:var(--border2);color:var(--text);}
        .ft-tab.active{background:var(--gold);color:#0F172A;border-color:var(--gold);font-weight:700;}

        /* Tool grid */
        .ft-grid{
          display:grid;
          grid-template-columns:repeat(auto-fill,minmax(260px,1fr));
          gap:10px;
          max-width:1060px;
          margin:0 auto;
          padding:0 24px;
        }
        @media(max-width:560px){.ft-grid{grid-template-columns:1fr;}}

        .ft-tool-card{
          background:var(--surface);
          border:1px solid var(--border);
          border-radius:var(--radius);
          padding:14px 16px;
          text-decoration:none;
          color:inherit;
          display:flex;
          align-items:center;
          justify-content:space-between;
          gap:10px;
          transition:border-color 0.15s,background 0.15s;
        }
        .ft-tool-card:hover{border-color:var(--border2);background:var(--elevated);}
        .ft-tool-card:hover .ft-tool-arrow{opacity:1;transform:translateX(3px);}
        .ft-pro-card{border-color:rgba(245,158,11,0.15);}
        .ft-pro-card:hover{border-color:rgba(245,158,11,0.4);}
        .ft-tool-card-inner{flex:1;min-width:0;}
        .ft-tool-name{font-size:13px;font-weight:500;line-height:1.35;margin-bottom:6px;}
        .ft-tool-badge-row{display:flex;align-items:center;gap:6px;}
        .ft-badge{font-size:10px;font-weight:600;padding:2px 7px;border-radius:10px;}
        .ft-badge-free{background:rgba(16,185,129,0.12);color:var(--green);}
        .ft-badge-pro{background:rgba(245,158,11,0.12);color:var(--gold);}
        .ft-tool-credit-hint{font-size:10px;color:var(--hint);}
        .ft-tool-arrow{font-size:14px;color:var(--muted);opacity:0;transition:all 0.15s;flex-shrink:0;}

        /* Upsell banner */
        .ft-upsell-banner{
          grid-column:1/-1;
          background:rgba(245,158,11,0.07);
          border:1px solid rgba(245,158,11,0.2);
          border-radius:var(--radius);
          padding:20px 22px;
          display:flex;
          align-items:center;
          justify-content:space-between;
          gap:16px;
          flex-wrap:wrap;
        }
        .ft-upsell-left{flex:1;}
        .ft-upsell-title{font-size:14px;font-weight:600;color:var(--gold);margin-bottom:4px;}
        .ft-upsell-body{font-size:12px;color:var(--muted);line-height:1.5;}
        .ft-upsell-cta{
          background:var(--gold);color:#0F172A;
          font-size:13px;font-weight:700;
          padding:9px 18px;border-radius:7px;
          text-decoration:none;white-space:nowrap;
          transition:background 0.15s;flex-shrink:0;
        }
        .ft-upsell-cta:hover{background:#FBBF24;}

        /* Results count + show more */
        .ft-meta{max-width:1060px;margin:0 auto 16px;padding:0 24px;display:flex;align-items:center;justify-content:space-between;}
        .ft-meta-count{font-size:13px;color:var(--hint);}
        .ft-show-more{
          display:block;max-width:240px;margin:24px auto 48px;
          padding:11px 24px;background:var(--surface);
          border:1px solid var(--border2);border-radius:8px;
          color:var(--muted);font-size:14px;font-weight:500;
          text-align:center;cursor:pointer;transition:all 0.15s;
        }
        .ft-show-more:hover{border-color:var(--gold);color:var(--gold);background:var(--elevated);}
        .ft-empty{text-align:center;padding:48px 24px;color:var(--hint);font-size:15px;}
      `}</style>

      <div className="ft-root" dir={dir}>

        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <div className="ft-hero">
          <h1>{t.hero_title || 'Free industrial calculators'}</h1>
          <p>{t.hero_sub || 'Engineering-grade tools. No login required. Instant results.'}</p>
        </div>

        {/* ── Search ───────────────────────────────────────────────────── */}
        <div className="ft-search-wrap">
          <input
            className="ft-search"
            type="search"
            placeholder={t.search_placeholder || 'Search calculators...'}
            value={query}
            onChange={(e) => { setQuery(e.target.value); setShowAll(false); }}
          />
        </div>

        {/* ── Sector tabs ──────────────────────────────────────────────── */}
        <div className="ft-tabs-wrap">
          <div className="ft-tabs">
            {SECTOR_TABS.map((tab) => (
              <button
                key={tab.id}
                className={`ft-tab${sector === tab.id ? ' active' : ''}`}
                onClick={() => { setSector(tab.id); setShowAll(false); }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Results meta ─────────────────────────────────────────────── */}
        <div className="ft-meta">
          <div className="ft-meta-count">
            {filtered.length} {t.tools_count || 'tools'}
          </div>
        </div>

        {/* ── Tool grid ────────────────────────────────────────────────── */}
        {filtered.length === 0 ? (
          <div className="ft-empty">No tools found. Try a different search or sector.</div>
        ) : (
          <>
            <div className="ft-grid">
              {itemsWithBanners.map((item, i) =>
                item.type === 'upsell'
                  ? <UpsellBanner key={`upsell-${i}`} t={t} />
                  : <ToolCard key={item.tool.slug} tool={item.tool} t={t} />
              )}
            </div>
            {!showAll && filtered.length > PAGE_SIZE && (
              <button className="ft-show-more" onClick={() => setShowAll(true)}>
                Show all {filtered.length} tools ↓
              </button>
            )}
          </>
        )}

      </div>
    </>
  );
}
