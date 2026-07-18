"use client";

/**
 * SectorCalc - Premium Global Header
 * Drop into: /src/components/Header.jsx
 *
 * Built to the standard of Stripe / Datadog / Linear navigation.
 *
 * Features:
 *   - Mega-menus for Products, Industries, Resources (hover desktop, tap mobile)
 *   - Two CTAs: "Sign in" (text) + "Get started" (filled) - converts new users
 *   - Language switcher (6 locales, RTL Arabic) - NO currency in header
 *   - Keyboard nav + focus states + reduced-motion respect
 *   - Mobile drawer with premium accordion sections (MobileNavigationShell)
 *
 * LOCALE: handled by middleware.js. This component displays + switches only.
 *   sectorcalc.com -> EN | /tr /de /fr /es /ar
 *   Currency is ALWAYS USD, surfaced on the pricing page - not here.
 */

import { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BRAND_ASSETS } from "@/config/brand";
import { AuthStatusIndicator } from "@/lib/ui-shared/auth/AuthStatusIndicator";
import { MobileNavigationShell } from "@/components/layout/mobile/MobileNavigationShell";

const t = {
  products: 'Products', industries: 'Industries', pricing: 'Pricing', resources: 'Resources',
  signin: 'Sign in', getStarted: 'Get started',
  col_free: 'Free tools', col_pro: 'Pro tools', col_engdiag: 'Engineering Diagnostics',
  products_free_desc: 'Engineering calculators, no login',
  products_pro_desc: 'Real parameters, PDF export',
  products_engdiag_desc: 'Capture problems, find root causes and generate action reports',
  view_all_industries: 'All industries',
  docintel: 'Document Intelligence', docintel_d: 'Convert engineering documents into validated, ERP-ready data',
  res_blog: 'Case Studies', res_blog_d: 'Methods & case studies',
  res_docs: 'FMEA RPN Calculator', res_docs_d: 'Failure Mode & Effects Analysis',
  tools: 'tools', lang_note: 'All prices shown in USD',
};

const INDUSTRY_GROUPS = [
  { groupEn:'Production', groupTr:'Production', items:[
    { slug:'cnc-manufacturing', href:'/industries/cnc-manufacturing', en:'CNC Manufacturing', count:40 },
    { slug:'welding-fabrication', href:'/industries/welding-fabrication', en:'Welding & Fabrication', count:22 },
    { slug:'3d-printing-service', href:'/industries/3d-printing-service', en:'3D Printing Service', count:8 },
  ]},
  { groupEn:'Engineering', groupTr:'Engineering', items:[
    { slug:'hvac', href:'/industries/hvac', en:'HVAC', count:48 },
    { slug:'electrical-contracting', href:'/industries/electrical-contracting', en:'Electrical Contracting', count:16 },
    { slug:'construction', href:'/industries/construction', en:'Construction', count:28 },
  ]},
  { groupEn:'Operations & Energy', groupTr:'Operasyon', items:[
    { slug:'logistics-transport', href:'/industries/logistics-transport', en:'Logistics & Transport', count:17 },
    { slug:'energy-consumption', href:'/industries/energy-consumption', en:'Energy Consumption', count:16 },
    { slug:'agriculture-crops', href:'/industries/agriculture-crops', en:'Agriculture', count:12 },
  ]},
];

// Flatten industry groups for mobile nav
const MOBILE_INDUSTRIES = INDUSTRY_GROUPS.flatMap((g) => g.items.map((it) => ({
  slug: it.slug,
  href: it.href,
  label: it.en,
  count: it.count,
})));

export function SiteHeader({ 
  isAuthenticated = false,
  freeToolsCount = 0,
  proToolsCount = 0
}: { 
  isAuthenticated?: boolean;
  freeToolsCount?: number;
  proToolsCount?: number;
}) {
  const pathname = usePathname() || '/';
  
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const navRef = useRef<HTMLElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout>>(null);

  const openWithIntent = useCallback((m: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenMenu(m);
  }, []);

  const closeWithIntent = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpenMenu(null), 120);
  }, []);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) setOpenMenu(null);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') { setOpenMenu(null); }
    }
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  const closeMobile = useCallback(() => {
    setMobileOpen(false);
  }, []);

  return (
    <>
      <style>{`
        .sc-h {
          --bg: #FAF8F2; --surface: #FFFFFF; --text: #1A1915; --muted: #696764;
          --hint: #94A3B8; --accent: #BD5D3A; --accent-dk: #A34D2E;
          --border: rgba(26,25,21,0.10); --border-2: rgba(26,25,21,0.18);
          --mega-shadow: 0 16px 48px rgba(26,25,21,0.14);
          font-family: var(--font-inter), 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          position: sticky; top: 0; z-index: 100; background: var(--bg); border-bottom: 1px solid var(--border);
        }
        .sc-h *, .sc-h *::before, .sc-h *::after { box-sizing: border-box; }
        /* Fade kept active on every device, including OS "reduce motion". */
        .sc-mega, .sc-langmenu { animation: scFade .16s ease-out; }
        @keyframes scFade { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } }
        .sc-inner { max-width: 1280px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; gap: 24px; padding: 15px 24px; }
        .sc-logo { display: flex; align-items: center; text-decoration: none; flex-shrink: 0; }
        .sc-logo-img { height: 30px; width: auto; }
        .sc-nav { display: flex; align-items: center; gap: 6px; flex: 1; justify-content: center; }
        .sc-navbtn { display: flex; align-items: center; gap: 5px; font-size: 14px; font-weight: 500; color: var(--text); background: none; border: none; cursor: pointer; padding: 8px 12px; border-radius: 8px; text-decoration: none; transition: background .12s, color .12s; white-space: nowrap; min-height: 36px; }
        .sc-navbtn:hover, .sc-navbtn.open { background: rgba(15,23,42,0.04); color: var(--accent); }
        .sc-navbtn .chev { width: 14px; height: 14px; color: var(--hint); transition: transform .16s; flex-shrink: 0; }
        .sc-navbtn.open .chev { transform: rotate(180deg); }
        .sc-right { display: flex; align-items: center; gap: 14px; flex-shrink: 0; }
        .sc-signin { font-size: 14px; font-weight: 500; color: var(--text); text-decoration: none; padding: 8px 6px; border-radius: 7px; transition: color .12s; white-space: nowrap; display: inline-flex; align-items: center; min-height: 36px; }
        .sc-signin:hover { color: var(--accent); }
        .sc-getstarted { display: inline-flex; align-items: center; padding: 9px 18px; border-radius: 8px; background: var(--accent); color: #fff; font-size: 14px; font-weight: 600; text-decoration: none; white-space: nowrap; transition: background .13s, transform .07s; min-height: 36px; }
        .sc-getstarted:hover { background: var(--accent-dk); }
        .sc-getstarted:active { transform: scale(.98); }
        .sc-megawrap { position: absolute; top: 100%; left: 0; right: 0; display: flex; justify-content: center; pointer-events: none; }
        .sc-mega { pointer-events: auto; margin-top: 6px; background: var(--surface); border: 1px solid var(--border); border-radius: 16px; box-shadow: var(--mega-shadow); padding: 22px; }
        .sc-mega-products { width: 760px; display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; }
        .sc-mega-industries { width: 720px; }
        .sc-mega-resources { width: 340px; }
        .sc-mega-panel { padding: 16px; border-radius: 12px; text-decoration: none; display: block; transition: background .12s; }
        .sc-mega-panel:hover { background: var(--bg); }
        .sc-mega-panel .pt { display: flex; align-items: center; gap: 10px; margin-bottom: 6px; }
        .sc-mega-panel .pico { width: 22px; height: 22px; flex-shrink: 0; color: var(--accent); }
        .sc-mega-panel .ph { font-size: 15px; font-weight: 600; color: var(--text); }
        .sc-mega-panel .pd { font-size: 12px; color: var(--muted); line-height: 1.5; }
        .sc-mega-panel .pcount { font-size: 11px; color: var(--accent); font-weight: 600; margin-top: 8px; font-variant-numeric: tabular-nums; }
        .sc-mega-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 4px 16px; }
        .sc-mega-col h4 { font-size: 11px; letter-spacing: .05em; text-transform: uppercase; color: var(--hint); font-weight: 600; margin: 0 0 8px; padding: 0 8px; }
        .sc-mega-item { display: flex; align-items: center; gap: 10px; padding: 8px; border-radius: 8px; text-decoration: none; transition: background .1s; }
        .sc-mega-item:hover { background: var(--bg); }
        .sc-mega-item .ico { width: 20px; height: 20px; flex-shrink: 0; color: var(--muted); }
        .sc-mega-item .txt { display: flex; flex-direction: column; }
        .sc-mega-item .txt b { font-size: 13px; font-weight: 500; color: var(--text); }
        .sc-mega-item .txt span { font-size: 11px; color: var(--hint); font-variant-numeric: tabular-nums; }
        .sc-mega-foot { margin-top: 14px; padding-top: 14px; border-top: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; }
        .sc-mega-foot a { font-size: 13px; font-weight: 600; color: var(--accent); text-decoration: none; }
        .sc-mega-foot .promo { font-size: 12px; color: var(--muted); font-variant-numeric: tabular-nums; }
        .sc-res-item { display: flex; align-items: flex-start; gap: 12px; padding: 12px; border-radius: 10px; text-decoration: none; transition: background .1s; }
        .sc-res-item:hover { background: var(--bg); }
        .sc-res-item .rico { width: 20px; height: 20px; flex-shrink: 0; margin-top: 1px; color: var(--accent); }
        .sc-res-item .rt b { display: block; font-size: 14px; font-weight: 500; color: var(--text); margin-bottom: 2px; }
        .sc-res-item .rt span { font-size: 12px; color: var(--muted); }
        .sc-burger { display: none; background: none; border: none; cursor: pointer; padding: 10px; min-width: 44px; min-height: 44px; color: var(--text); border-radius: 8px; }
        .sc-burger:hover { background: rgba(15,23,42,0.04); }
        .sc-burger svg { width: 24px; height: 24px; display: block; }
        @media (max-width: 1080px) {
          .sc-nav { display: none; }
          .sc-right .sc-signin, .sc-right .sc-getstarted { display: none; }
          .sc-burger { display: flex; }
        }
        @media (max-width: 760px) {
          .sc-inner { padding: 12px 16px !important; gap: 12px !important; }
          .sc-logo-img { height: 26px !important; }
          .sc-right { gap: 8px !important; }
          .auth-status__text, .auth-status__label { display: none !important; }
          .auth-status { width: auto !important; }
        }
      `}</style>

      <header className="sc-h">
        <div className="sc-inner">
          <Link href="/" prefetch={true} className="sc-logo" aria-label="SectorCalc home">
            <img src={BRAND_ASSETS.logo.headerDefault} alt="SectorCalc Logo" className="sc-logo-img" fetchPriority="low" />
          </Link>

          <nav className="sc-nav" ref={navRef}>
            <div onMouseEnter={() => openWithIntent('products')} onMouseLeave={closeWithIntent}>
              <button className={`sc-navbtn${openMenu === 'products' ? ' open' : ''}`} onClick={() => setOpenMenu(openMenu === 'products' ? null : 'products')} aria-expanded={openMenu === 'products'}>
                {t.products} <svg className="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
              </button>
            </div>
            <div onMouseEnter={() => openWithIntent('industries')} onMouseLeave={closeWithIntent}>
              <button className={`sc-navbtn${openMenu === 'industries' ? ' open' : ''}`} onClick={() => setOpenMenu(openMenu === 'industries' ? null : 'industries')} aria-expanded={openMenu === 'industries'}>
                {t.industries} <svg className="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
              </button>
            </div>
            <Link href="/pricing" prefetch={true} className="sc-navbtn">{t.pricing}</Link>
            <div onMouseEnter={() => openWithIntent('resources')} onMouseLeave={closeWithIntent}>
              <button className={`sc-navbtn${openMenu === 'resources' ? ' open' : ''}`} onClick={() => setOpenMenu(openMenu === 'resources' ? null : 'resources')} aria-expanded={openMenu === 'resources'}>
                {t.resources} <svg className="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
              </button>
            </div>

            {openMenu && (
              <div className="sc-megawrap" onMouseEnter={() => openWithIntent(openMenu)} onMouseLeave={closeWithIntent}>
                {openMenu === 'products' && (
                  <div className="sc-mega sc-mega-products">
                    <Link href="/free-tools" prefetch={true} className="sc-mega-panel">
                      <div className="pt"><svg className="pico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20V10" /><path d="M18 20V4" /><path d="M6 20v-4" /></svg><span className="ph">{t.col_free}</span></div>
                      <div className="pd">{t.products_free_desc}</div>
                      <div className="pcount">{freeToolsCount} {t.tools}</div>
                    </Link>
                    <Link href="/pro-tools" prefetch={true} className="sc-mega-panel">
                      <div className="pt"><svg className="pico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg><span className="ph">{t.col_pro}</span></div>
                      <div className="pd">{t.products_pro_desc}</div>
                      <div className="pcount">{proToolsCount} {t.tools}</div>
                    </Link>
                    <Link href="/engineering-diagnostics" prefetch={true} className="sc-mega-panel">
                      <div className="pt"><svg className="pico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg><span className="ph">{t.col_engdiag}</span></div>
                      <div className="pd">{t.products_engdiag_desc}</div>
                    </Link>
                    <Link href="/document-intelligence" prefetch={true} className="sc-mega-panel">
                      <div className="pt"><svg className="pico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><path d="M9 15l2 2 4-4" /></svg><span className="ph">Document Intelligence</span></div>
                      <div className="pd">Convert engineering documents into validated, ERP-ready data</div>
                    </Link>
                  </div>
                )}
                {openMenu === 'industries' && (
                  <div className="sc-mega sc-mega-industries">
                    <div className="sc-mega-grid">
                      {INDUSTRY_GROUPS.map((g) => (
                        <div className="sc-mega-col" key={g.groupEn}>
                          <h4>{g.groupEn}</h4>
                          {g.items.map((it) => (
                            <Link key={it.slug} href={it.href} className="sc-mega-item">
                              <svg className="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>
                              <span className="txt"><b>{it.en}</b><span>{it.count} {t.tools}</span></span>
                            </Link>
                          ))}
                        </div>
                      ))}
                    </div>
                    <div className="sc-mega-foot">
                      <Link href="/industries" prefetch={true}>{t.view_all_industries} <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: 'middle' }}><polyline points="9 18 15 12 9 6" /></svg></Link>
                      <span className="promo">18 sectors &middot; 300+ {t.tools}</span>
                    </div>
                  </div>
                )}
                {openMenu === 'resources' && (
                  <div className="sc-mega sc-mega-resources">
                    <Link href="/case-studies" className="sc-res-item">
                      <svg className="rico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg><span className="rt"><b>{t.res_blog}</b><span>{t.res_blog_d}</span></span>
                    </Link>
                    <Link href="/calculators/fmea-rpn" className="sc-res-item">
                      <svg className="rico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg><span className="rt"><b>{t.res_docs}</b><span>{t.res_docs_d}</span></span>
                    </Link>
                  </div>
                )}
              </div>
            )}
          </nav>

          <div className="sc-right">
            <AuthStatusIndicator />
            {!isAuthenticated && (
              <Link href="/signup" className="sc-getstarted">{t.getStarted}</Link>
            )}
            <button className="sc-burger" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu" aria-expanded={mobileOpen}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                {mobileOpen
                  ? <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>
                  : <><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></>}
              </svg>
            </button>
          </div>
        </div>
      </header>

      <MobileNavigationShell
        isOpen={mobileOpen}
        onClose={closeMobile}
        isAuthenticated={isAuthenticated}
        freeToolsCount={freeToolsCount}
        proToolsCount={proToolsCount}
        industryGroups={MOBILE_INDUSTRIES}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
    </>
  );
}
