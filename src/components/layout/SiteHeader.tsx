// @ts-nocheck
"use client";
/* eslint-disable */
// @ts-nocheck

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
 *   - Mobile drawer with collapsible sections
 *
 * LOCALE: handled by middleware.js. This component displays + switches only.
 *   sectorcalc.com → EN | /tr /de /fr /es /ar
 *   Currency is ALWAYS USD, surfaced on the pricing page - not here.
 */

import { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { BRAND_ASSETS } from "@/config/brand";
import { AuthStatusIndicator } from "@/lib/ui-shared/auth/AuthStatusIndicator";

const t = {
  products: 'Products', industries: 'Industries', pricing: 'Pricing', resources: 'Resources',
  signin: 'Sign in', getStarted: 'Get started',
  col_free: 'Free tools', col_pro: 'Pro tools',
  products_free_desc: 'Engineering calculators, no login',
  products_pro_desc: 'Real parameters, PDF export',
  view_all_industries: 'All industries',
  res_blog: 'Case Studies', res_blog_d: 'Methods & case studies',
  res_docs: 'FMEA RPN Calculator', res_docs_d: 'Failure Mode & Effects Analysis',
  tools: 'tools', lang_note: 'All prices shown in USD',
};

const INDUSTRY_GROUPS = [
  { groupEn:'Production', groupTr:'Production', items:[
    { slug:'manufacturing', href:'/industries', icon:'🏭', en:'Manufacturing', count:40 },
    { slug:'lean-oee',      href:'/industries', icon:'📊', en:'Lean & OEE',     count:33 },
    { slug:'quality-spc',   href:'/industries', icon:'🎯', en:'Quality & SPC',  count:14 },
  ]},
  { groupEn:'Engineering', groupTr:'Engineering', items:[
    { slug:'mechanical-hvac',  href:'/industries', icon:'⚙️', en:'Mechanical & HVAC', count:48 },
    { slug:'electrical-power', href:'/industries', icon:'⚡', en:'Electrical & Power', count:16 },
    { slug:'construction',     href:'/industries', icon:'🏗️', en:'Construction',       count:28 },
  ]},
  { groupEn:'Operations', groupTr:'Operasyon', items:[
    { slug:'supply-chain',     href:'/industries', icon:'🚚', en:'Supply Chain',   count:17 },
    { slug:'energy-esg',       href:'/industries', icon:'🌱', en:'Energy & ESG',    count:16 },
    { slug:'technology-cloud', href:'/industries', icon:'☁️', en:'Technology & AI', count:17 },
  ]},
];


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
  
  const [openMenu,setOpenMenu]=useState<string | null>(null);
  const [mobileOpen,setMobileOpen]=useState(false);
  const [mobileSection,setMobileSection]=useState<string | null>(null);

  const navRef=useRef(null);
  const closeTimer=useRef(null);

  const openWithIntent=useCallback((m)=>{ if(closeTimer.current)clearTimeout(closeTimer.current); setOpenMenu(m); },[]);
  const closeWithIntent=useCallback(()=>{ if(closeTimer.current)clearTimeout(closeTimer.current); closeTimer.current=setTimeout(()=>setOpenMenu(null),120); },[]);

  useEffect(()=>{
    function onClick(e){
      if(navRef.current && !navRef.current.contains(e.target)) setOpenMenu(null);
    }
    function onKey(e){ if(e.key==='Escape'){ setOpenMenu(null); } }
    document.addEventListener('mousedown',onClick);
    document.addEventListener('keydown',onKey);
    return ()=>{ document.removeEventListener('mousedown',onClick); document.removeEventListener('keydown',onKey); };
  },[]);

  const accountHref = isAuthenticated ? '/account' : '/login';

  return (
    <>
      <style>{`
        .sc-h{
          --bg:#FAF8F2;--surface:#FFFFFF;--text:#0F172A;--muted:#64748B;
          --hint:#94A3B8;--accent:#2563EB;--accent-dk:#1D4ED8;
          --border:rgba(15,23,42,0.08);--border-2:rgba(15,23,42,0.14);
          --mega-shadow:0 16px 48px rgba(15,23,42,0.14);
          font-family:'DM Sans','SF Pro Text',-apple-system,BlinkMacSystemFont,sans-serif;
          position:sticky;top:0;z-index:100;background:var(--bg);border-bottom:1px solid var(--border);
        }
        .sc-h *,.sc-h *::before,.sc-h *::after{box-sizing:border-box;}
        @media(prefers-reduced-motion:no-preference){
          .sc-mega,.sc-langmenu{animation:scFade .16s ease-out;}
          @keyframes scFade{from{opacity:0;transform:translateY(-4px);}to{opacity:1;transform:translateY(0);}}
        }
        .sc-inner{max-width:1280px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;gap:24px;padding:15px 24px;}
        .sc-logo{display:flex;align-items:center;text-decoration:none;flex-shrink:0;}
        .sc-logo-img{height:30px;width:auto;}
        .sc-nav{display:flex;align-items:center;gap:6px;flex:1;justify-content:center;}
        .sc-navbtn{display:flex;align-items:center;gap:5px;font-size:14px;font-weight:500;color:var(--text);background:none;border:none;cursor:pointer;padding:8px 12px;border-radius:8px;text-decoration:none;transition:background .12s,color .12s;white-space:nowrap;}
        .sc-navbtn:hover,.sc-navbtn.open{background:rgba(15,23,42,0.04);color:var(--accent);}
        .sc-navbtn .chev{font-size:8px;color:var(--hint);transition:transform .16s;}
        .sc-navbtn.open .chev{transform:rotate(180deg);}
        .sc-right{display:flex;align-items:center;gap:14px;flex-shrink:0;}
        .sc-signin{font-size:14px;font-weight:500;color:var(--text);text-decoration:none;padding:8px 6px;border-radius:7px;transition:color .12s;white-space:nowrap;}
        .sc-signin:hover{color:var(--accent);}
        .sc-getstarted{display:inline-flex;align-items:center;padding:9px 18px;border-radius:8px;background:var(--accent);color:#fff;font-size:14px;font-weight:600;text-decoration:none;white-space:nowrap;transition:background .13s,transform .07s;}
        .sc-getstarted:hover{background:var(--accent-dk);}
        .sc-getstarted:active{transform:scale(.98);}
        .sc-megawrap{position:absolute;top:100%;left:0;right:0;display:flex;justify-content:center;pointer-events:none;}
        .sc-mega{pointer-events:auto;margin-top:6px;background:var(--surface);border:1px solid var(--border);border-radius:16px;box-shadow:var(--mega-shadow);padding:22px;}
        .sc-mega-products{width:600px;display:grid;grid-template-columns:1fr 1fr;gap:8px;}
        .sc-mega-industries{width:720px;}
        .sc-mega-resources{width:340px;}
        .sc-mega-panel{padding:16px;border-radius:12px;text-decoration:none;display:block;transition:background .12s;}
        .sc-mega-panel:hover{background:var(--bg);}
        .sc-mega-panel .pt{display:flex;align-items:center;gap:10px;margin-bottom:6px;}
        .sc-mega-panel .pico{font-size:20px;}
        .sc-mega-panel .ph{font-size:15px;font-weight:600;color:var(--text);}
        .sc-mega-panel .pd{font-size:12px;color:var(--muted);line-height:1.5;}
        .sc-mega-panel .pcount{font-size:11px;color:var(--accent);font-weight:600;margin-top:8px;font-variant-numeric:tabular-nums;}
        .sc-mega-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:4px 16px;}
        .sc-mega-col h4{font-size:11px;letter-spacing:.05em;text-transform:uppercase;color:var(--hint);font-weight:600;margin:0 0 8px;padding:0 8px;}
        .sc-mega-item{display:flex;align-items:center;gap:10px;padding:8px;border-radius:8px;text-decoration:none;transition:background .1s;}
        .sc-mega-item:hover{background:var(--bg);}
        .sc-mega-item .ico{font-size:17px;flex-shrink:0;}
        .sc-mega-item .txt{display:flex;flex-direction:column;}
        .sc-mega-item .txt b{font-size:13px;font-weight:500;color:var(--text);}
        .sc-mega-item .txt span{font-size:11px;color:var(--hint);font-variant-numeric:tabular-nums;}
        .sc-mega-foot{margin-top:14px;padding-top:14px;border-top:1px solid var(--border);display:flex;justify-content:space-between;align-items:center;}
        .sc-mega-foot a{font-size:13px;font-weight:600;color:var(--accent);text-decoration:none;}
        .sc-mega-foot .promo{font-size:12px;color:var(--muted);font-variant-numeric:tabular-nums;}
        .sc-res-item{display:flex;align-items:flex-start;gap:12px;padding:12px;border-radius:10px;text-decoration:none;transition:background .1s;}
        .sc-res-item:hover{background:var(--bg);}
        .sc-res-item .rico{font-size:18px;flex-shrink:0;margin-top:1px;}
        .sc-res-item .rt b{display:block;font-size:14px;font-weight:500;color:var(--text);margin-bottom:2px;}
        .sc-res-item .rt span{font-size:12px;color:var(--muted);}
        .sc-burger{display:none;background:none;border:none;cursor:pointer;padding:8px;color:var(--text);}
        .sc-burger svg{width:24px;height:24px;}
        .sc-drawer{display:none;}
        @media(max-width:1080px){
          .sc-nav{display:none;}
          .sc-right .sc-signin,.sc-right .sc-getstarted{display:none;}
          .sc-burger{display:flex;}
          .sc-drawer.open{display:block;border-top:1px solid var(--border);background:var(--bg);max-height:calc(100vh - 62px);overflow-y:auto;}
        }
        .sc-draw-sec{border-bottom:1px solid var(--border);}
        .sc-draw-head{width:100%;display:flex;align-items:center;justify-content:space-between;padding:16px 24px;font-size:16px;font-weight:500;color:var(--text);background:none;border:none;cursor:pointer;text-align:start;}
        .sc-draw-head .dchev{font-size:10px;color:var(--hint);transition:transform .16s;}
        .sc-draw-head.open .dchev{transform:rotate(180deg);}
        .sc-draw-link{display:block;padding:16px 24px;font-size:16px;font-weight:500;color:var(--text);text-decoration:none;border-bottom:1px solid var(--border);}
        .sc-draw-body{padding:0 24px 12px;}
        .sc-draw-body a{display:flex;align-items:center;gap:10px;padding:11px 8px;font-size:14px;color:var(--text);text-decoration:none;}
        .sc-draw-body a span.c{margin-inline-start:auto;font-size:11px;color:var(--hint);font-variant-numeric:tabular-nums;}
        .sc-draw-cta{padding:20px 24px;display:flex;flex-direction:column;gap:10px;}
        .sc-draw-cta .sc-getstarted{display:flex;justify-content:center;}
        .sc-draw-cta .sc-signin{text-align:center;padding:12px;border:1px solid var(--border-2);border-radius:8px;}
      `}</style>

      <header className="sc-h">
        <div className="sc-inner">

          <Link href="/" className="sc-logo" aria-label="SectorCalc home">
            <img src={BRAND_ASSETS.logo.headerDefault} alt="SectorCalc Logo" className="sc-logo-img" />
          </Link>

          <nav className="sc-nav" ref={navRef}>
            <div onMouseEnter={()=>openWithIntent('products')} onMouseLeave={closeWithIntent}>
              <button className={`sc-navbtn${openMenu==='products'?' open':''}`} onClick={()=>setOpenMenu(openMenu==='products'?null:'products')} aria-expanded={openMenu==='products'}>
                {t.products} <span className="chev">▼</span>
              </button>
            </div>
            <div onMouseEnter={()=>openWithIntent('industries')} onMouseLeave={closeWithIntent}>
              <button className={`sc-navbtn${openMenu==='industries'?' open':''}`} onClick={()=>setOpenMenu(openMenu==='industries'?null:'industries')} aria-expanded={openMenu==='industries'}>
                {t.industries} <span className="chev">▼</span>
              </button>
            </div>
            <Link href="/pricing" className="sc-navbtn">{t.pricing}</Link>
            <div onMouseEnter={()=>openWithIntent('resources')} onMouseLeave={closeWithIntent}>
              <button className={`sc-navbtn${openMenu==='resources'?' open':''}`} onClick={()=>setOpenMenu(openMenu==='resources'?null:'resources')} aria-expanded={openMenu==='resources'}>
                {t.resources} <span className="chev">▼</span>
              </button>
            </div>

            {openMenu && (
              <div className="sc-megawrap" onMouseEnter={()=>openWithIntent(openMenu)} onMouseLeave={closeWithIntent}>
                {openMenu==='products' && (
                  <div className="sc-mega sc-mega-products">
                    <Link href="/free-tools" className="sc-mega-panel">
                      <div className="pt"><span className="pico">🧮</span><span className="ph">{t.col_free}</span></div>
                      <div className="pd">{t.products_free_desc}</div>
                      <div className="pcount">{freeToolsCount}+ {t.tools}</div>
                    </Link>
                    <Link href="/pro-tools" className="sc-mega-panel">
                      <div className="pt"><span className="pico">⚡</span><span className="ph">{t.col_pro}</span></div>
                      <div className="pd">{t.products_pro_desc}</div>
                      <div className="pcount">{proToolsCount} {t.tools}</div>
                    </Link>
                  </div>
                )}
                {openMenu==='industries' && (
                  <div className="sc-mega sc-mega-industries">
                    <div className="sc-mega-grid">
                      {INDUSTRY_GROUPS.map((g)=>(
                        <div className="sc-mega-col" key={g.groupEn}>
                          <h4>{g.groupEn}</h4>
                          {g.items.map((it)=>(
                            <Link key={it.slug} href={it.href} className="sc-mega-item">
                              <span className="ico">{it.icon}</span>
                              <span className="txt"><b>{it.en}</b><span>{it.count} {t.tools}</span></span>
                            </Link>
                          ))}
                        </div>
                      ))}
                    </div>
                    <div className="sc-mega-foot">
                      <Link href="/industries">{t.view_all_industries} →</Link>
                      <span className="promo">18 sectors · 300+ {t.tools}</span>
                    </div>
                  </div>
                )}
                {openMenu==='resources' && (
                  <div className="sc-mega sc-mega-resources">
                    <Link href="/case-studies" className="sc-res-item">
                      <span className="rico">📝</span><span className="rt"><b>{t.res_blog}</b><span>{t.res_blog_d}</span></span>
                    </Link>
                    <Link href="/calculators/fmea-rpn" className="sc-res-item">
                      <span className="rico">📐</span><span className="rt"><b>{t.res_docs}</b><span>{t.res_docs_d}</span></span>
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
            <button className="sc-burger" onClick={()=>setMobileOpen(!mobileOpen)} aria-label="Menu" aria-expanded={mobileOpen}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                {mobileOpen
                  ? <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>
                  : <><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></>}
              </svg>
            </button>
          </div>
        </div>

        <div className={`sc-drawer${mobileOpen?' open':''}`} dir="ltr">
          <div className="sc-draw-sec">
            <button className={`sc-draw-head${mobileSection==='products'?' open':''}`} onClick={()=>setMobileSection(mobileSection==='products'?null:'products')}>
              {t.products} <span className="dchev">▼</span>
            </button>
            {mobileSection==='products' && (
              <div className="sc-draw-body">
                <Link href="/free-tools" onClick={()=>setMobileOpen(false)}>🧮 {t.col_free} <span className="c">{freeToolsCount}+</span></Link>
                <Link href="/pro-tools" onClick={()=>setMobileOpen(false)}>⚡ {t.col_pro} <span className="c">{proToolsCount}</span></Link>
              </div>
            )}
          </div>
          <div className="sc-draw-sec">
            <button className={`sc-draw-head${mobileSection==='industries'?' open':''}`} onClick={()=>setMobileSection(mobileSection==='industries'?null:'industries')}>
              {t.industries} <span className="dchev">▼</span>
            </button>
            {mobileSection==='industries' && (
              <div className="sc-draw-body">
                {INDUSTRY_GROUPS.flatMap((g)=>g.items).map((it)=>(
                  <Link key={it.slug} href={it.href} onClick={()=>setMobileOpen(false)}>
                    {it.icon} {it.en} <span className="c">{it.count}</span>
                  </Link>
                ))}
                <Link href="/industries" onClick={()=>setMobileOpen(false)} style={{color:'var(--accent)',fontWeight:600}}>{t.view_all_industries} →</Link>
              </div>
            )}
          </div>
          <Link href="/pricing" className="sc-draw-link" onClick={()=>setMobileOpen(false)}>{t.pricing}</Link>
          <div className="sc-draw-sec">
            <button className={`sc-draw-head${mobileSection==='resources'?' open':''}`} onClick={()=>setMobileSection(mobileSection==='resources'?null:'resources')}>
              {t.resources} <span className="dchev">▼</span>
            </button>
            {mobileSection==='resources' && (
              <div className="sc-draw-body">
                <Link href="/case-studies" onClick={()=>setMobileOpen(false)}>📝 {t.res_blog}</Link>
                <Link href="/calculators/fmea-rpn" onClick={()=>setMobileOpen(false)}>📐 {t.res_docs}</Link>
              </div>
            )}
          </div>
          <div className="sc-draw-cta">
            {isAuthenticated ? (
              <Link href="/account" className="sc-getstarted" onClick={()=>setMobileOpen(false)}>My Account</Link>
            ) : (
              <>
                <Link href="/signup" className="sc-getstarted" onClick={()=>setMobileOpen(false)}>{t.getStarted}</Link>
                <Link href="/login" className="sc-signin" onClick={()=>setMobileOpen(false)}>{t.signin}</Link>
              </>
            )}
          </div>
        </div>
      </header>
    </>
  );
}
