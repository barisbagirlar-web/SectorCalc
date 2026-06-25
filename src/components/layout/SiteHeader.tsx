'use client';
/**
 * SectorCalc — Premium Global Header
 * Drop into: /src/components/Header.jsx
 *
 * Built to the standard of Stripe / Datadog / Linear navigation.
 *
 * Features:
 *   - Mega-menus for Products, Industries, Resources (hover desktop, tap mobile)
 *   - Two CTAs: "Sign in" (text) + "Get started" (filled) — converts new users
 *   - Language switcher (6 locales, RTL Arabic) — NO currency in header
 *   - Keyboard nav + focus states + reduced-motion respect
 *   - Mobile drawer with collapsible sections
 *
 * LOCALE: handled by middleware.js. This component displays + switches only.
 *   sectorcalc.com → EN | /tr /de /fr /es /ar
 *   Currency is ALWAYS USD, surfaced on the pricing page — not here.
 */

import { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from "next/navigation";
import { useLocale } from 'next-intl';
import { getFreeToolCount, getPremiumToolCount } from "@/lib/tools/tool-counts";

const LOCALES = [
  { code: 'en', label: 'English',  short: 'EN', dir: 'ltr' },
  { code: 'tr', label: 'Türkçe',   short: 'TR', dir: 'ltr' },
  { code: 'de', label: 'Deutsch',  short: 'DE', dir: 'ltr' },
  { code: 'fr', label: 'Français', short: 'FR', dir: 'ltr' },
  { code: 'es', label: 'Español',  short: 'ES', dir: 'ltr' },
  { code: 'ar', label: 'العربية',  short: 'AR', dir: 'rtl' },
];

const T = {
  en: {
    products:'Products', industries:'Industries', pricing:'Pricing', resources:'Resources',
    signin:'Sign in', getStarted:'Get started',
    col_free:'Free tools', col_pro:'Premium',
    products_free_desc:'Engineering calculators, no login',
    products_pro_desc:'Real parameters, PDF export',
    view_all_industries:'All industries',
    res_blog:'Engineering blog', res_blog_d:'Methods & case studies',
    res_docs:'Formula reference', res_docs_d:'Standards & sources',
    res_api:'API access', res_api_d:'Integrate calculations',
    grp_production:'Production', grp_engineering:'Engineering', grp_operations:'Operations',
    ind_manufacturing:'Manufacturing', ind_lean_oee:'Lean & OEE', ind_quality_spc:'Quality & SPC',
    ind_mechanical_hvac:'Mechanical & HVAC', ind_electrical_power:'Electrical & Power', ind_construction:'Construction',
    ind_supply_chain:'Supply Chain', ind_energy_esg:'Energy & ESG', ind_technology_cloud:'Technology & AI',
    tools:'tools', lang_note:'All prices shown in USD',
  },
  tr: {
    products:'Ürünler', industries:'Sektörler', pricing:'Fiyatlandırma', resources:'Kaynaklar',
    signin:'Giriş yap', getStarted:'Başla',
    col_free:'Ücretsiz araçlar', col_pro:'Premium',
    products_free_desc:'Mühendislik hesaplayıcıları, giriş yok',
    products_pro_desc:'Gerçek parametreler, PDF export',
    view_all_industries:'Tüm sektörler',
    res_blog:'Mühendislik blogu', res_blog_d:'Yöntemler & vaka analizleri',
    res_docs:'Formül referansı', res_docs_d:'Standartlar & kaynaklar',
    res_api:'API erişimi', res_api_d:'Hesaplamaları entegre et',
    grp_production:'Üretim', grp_engineering:'Mühendislik', grp_operations:'Operasyonlar',
    ind_manufacturing:'Üretim', ind_lean_oee:'Yalın & OEE', ind_quality_spc:'Kalite & İPK',
    ind_mechanical_hvac:'Mekanik & İklimlendirme', ind_electrical_power:'Elektrik & Güç', ind_construction:'İnşaat',
    ind_supply_chain:'Tedarik Zinciri', ind_energy_esg:'Enerji & ÇYS', ind_technology_cloud:'Teknoloji & YZ',
    tools:'araç', lang_note:'Tüm fiyatlar USD cinsindendir',
  },
  de: {
    products:'Produkte', industries:'Branchen', pricing:'Preise', resources:'Ressourcen',
    signin:'Anmelden', getStarted:'Loslegen',
    col_free:'Kostenlose Tools', col_pro:'Premium',
    products_free_desc:'Ingenieur-Rechner, kein Login',
    products_pro_desc:'Echte Parameter, PDF-Export',
    view_all_industries:'Alle Branchen',
    res_blog:'Engineering-Blog', res_blog_d:'Methoden & Fallstudien',
    res_docs:'Formel-Referenz', res_docs_d:'Normen & Quellen',
    res_api:'API-Zugang', res_api_d:'Berechnungen integrieren',
        grp_production:'Produktion', grp_engineering:'Ingenieurwesen', grp_operations:'Betrieb',
    ind_manufacturing:'Fertigung', ind_lean_oee:'Lean & OEE', ind_quality_spc:'Qualität & SPC',
    ind_mechanical_hvac:'Mechanik & HLK', ind_electrical_power:'Elektrik & Energie', ind_construction:'Bauwesen',
    ind_supply_chain:'Lieferkette', ind_energy_esg:'Energie & ESG', ind_technology_cloud:'Technologie & KI',
    tools:'Tools', lang_note:'Alle Preise in USD',
  },
  fr: {
    products:'Produits', industries:'Secteurs', pricing:'Tarifs', resources:'Ressources',
    signin:'Connexion', getStarted:'Commencer',
    col_free:'Outils gratuits', col_pro:'Premium',
    products_free_desc:"Calculateurs d'ingénierie, sans connexion",
    products_pro_desc:'Paramètres réels, export PDF',
    view_all_industries:'Tous les secteurs',
    res_blog:"Blog d'ingénierie", res_blog_d:'Méthodes & études de cas',
    res_docs:'Référence des formules', res_docs_d:'Normes & sources',
    res_api:'Accès API', res_api_d:'Intégrer les calculs',
        grp_production:'Production', grp_engineering:'Ingénierie', grp_operations:'Opérations',
    ind_manufacturing:'Fabrication', ind_lean_oee:'Lean & TRS', ind_quality_spc:'Qualité & MSP',
    ind_mechanical_hvac:'Mécanique & CVC', ind_electrical_power:'Électricité & Énergie', ind_construction:'Construction',
    ind_supply_chain:'Chaîne logistique', ind_energy_esg:'Énergie & ESG', ind_technology_cloud:'Technologie & IA', tools:'Outils', lang_note:'Tous les prix en USD',
  },
  es: {
    products:'Productos', industries:'Sectores', pricing:'Precios', resources:'Recursos',
    signin:'Iniciar sesión', getStarted:'Empezar',
    col_free:'Herramientas gratis', col_pro:'Premium',
    products_free_desc:'Calculadoras de ingeniería, sin login',
    products_pro_desc:'Parámetros reales, exportación PDF',
    view_all_industries:'Todos los sectores',
    res_blog:'Blog de ingeniería', res_blog_d:'Métodos y casos de estudio',
    res_docs:'Referencia de fórmulas', res_docs_d:'Normas y fuentes',
    res_api:'Acceso API', res_api_d:'Integrar cálculos',
        grp_production:'Producción', grp_engineering:'Ingeniería', grp_operations:'Operaciones',
    ind_manufacturing:'Fabricación', ind_lean_oee:'Lean & OEE', ind_quality_spc:'Calidad y CEP',
    ind_mechanical_hvac:'Mecánica y HVAC', ind_electrical_power:'Eléctrica y Energía', ind_construction:'Construcción',
    ind_supply_chain:'Cadena de Suministro', ind_energy_esg:'Energía y ESG', ind_technology_cloud:'Tecnología e IA',
    tools:'herramientas', lang_note:'Todos los precios en USD',
  },
  ar: {
    products:'المنتجات', industries:'القطاعات', pricing:'الأسعار', resources:'الموارد',
    signin:'تسجيل الدخول', getStarted:'ابدأ الآن',
    col_free:'أدوات مجانية', col_pro:'بريميوم',
    products_free_desc:'حاسبات هندسية، بدون تسجيل دخول',
    products_pro_desc:'معايير حقيقية، تصدير PDF',
    view_all_industries:'كل القطاعات',
    res_blog:'مدونة هندسية', res_blog_d:'طرق ودراسات حالة',
    res_docs:'مرجع الصيغ', res_docs_d:'المعايير والمصادر',
    res_api:'وصول API', res_api_d:'دمج الحسابات',
        grp_production:'إنتاج', grp_engineering:'هندسة', grp_operations:'عمليات',
    ind_manufacturing:'تصنيع', ind_lean_oee:'لين و OEE', ind_quality_spc:'جودة و SPC',
    ind_mechanical_hvac:'ميكانيكا وتكييف', ind_electrical_power:'كهرباء وطاقة', ind_construction:'بناء',
    ind_supply_chain:'سلسلة التوريد', ind_energy_esg:'طاقة و ESG', ind_technology_cloud:'تكنولوجيا وذكاء اصطناعي', tools:'أدوات', lang_note:'جميع الأسعار بالدولار الأمريكي',
  },
};

const INDUSTRY_GROUPS = [
  { groupKey:'grp_production', items:[
    { slug:'cnc-manufacturing', icon:'🏭', key:'ind_manufacturing', count:40 },
    { slug:'welding-fabrication', icon:'⚡', key:'ind_lean_oee', count:33 },
    { slug:'printing-signage', icon:'🖨️', key:'ind_quality_spc', count:14 },
  ]},
  { groupKey:'grp_engineering', items:[
    { slug:'hvac', icon:'❄️', key:'ind_mechanical_hvac', count:48 },
    { slug:'electrical-contracting', icon:'🔌', key:'ind_electrical_power', count:16 },
    { slug:'construction', icon:'🏗️', key:'ind_construction', count:28 },
  ]},
  { groupKey:'grp_operations', items:[
    { slug:'logistics-transport', icon:'🚚', key:'ind_supply_chain', count:17 },
    { slug:'energy-carbon', icon:'🌱', key:'ind_energy_esg', count:16 },
    { slug:'energy-consumption', icon:'⚡', key:'ind_technology_cloud', count:17 },
  ]},
];

function getLocale(p: string){ const m=p.match(/^\/(tr|de|fr|es|ar)(\/|$)/); return m?m[1]:'en'; }
function href(loc: string,slug: string){ return loc==='en'?`/${slug}`:`/${loc}/${slug}`; }
function rootHref(loc: string){ return loc==='en'?'/':`/${loc}`; }
function buildLocalePath(p: string,target: string){
  const s=p.replace(/^\/(tr|de|fr|es|ar)(?=\/|$)/,'')||'/';
  return target==='en'?s:`/${target}${s==='/'?'':s}`;
}

export function SiteHeader({ isAuthenticated = false }) {
  const pathname = usePathname() || '/';
  const router   = useRouter();
  const locale   = useLocale();
  const dir      = LOCALES.find((l)=>l.code===locale)?.dir || 'ltr';
  const t        = T[locale as keyof typeof T] || T.en;

  const [openMenu,setOpenMenu]=useState<string | null>(null);
  const [langOpen,setLangOpen]=useState(false);
  const [mobileOpen,setMobileOpen]=useState(false);
  const [mobileSection,setMobileSection]=useState<string | null>(null);

  const navRef=useRef<any>(null);
  const langRef=useRef<any>(null);
  const closeTimer=useRef<any>(null);

  const openWithIntent=useCallback((m: string)=>{ if(closeTimer.current)clearTimeout(closeTimer.current); setOpenMenu(m); setLangOpen(false); },[]);
  const closeWithIntent=useCallback(()=>{ if(closeTimer.current)clearTimeout(closeTimer.current); closeTimer.current=setTimeout(()=>setOpenMenu(null),120); },[]);

  useEffect(()=>{
    function onClick(e: any){
      if(navRef.current && !navRef.current.contains(e.target)) setOpenMenu(null);
      if(langRef.current && !langRef.current.contains(e.target)) setLangOpen(false);
    }
    function onKey(e: any){ if(e.key==='Escape'){ setOpenMenu(null); setLangOpen(false); } }
    document.addEventListener('mousedown',onClick);
    document.addEventListener('keydown',onKey);
    return ()=>{ document.removeEventListener('mousedown',onClick); document.removeEventListener('keydown',onKey); };
  },[]);

  const switchLocale=(code: string)=>{
    setLangOpen(false);
    document.cookie=`NEXT_LOCALE=${code};path=/;max-age=31536000;samesite=lax`;
    router.push(pathname);
  };

  const accountHref = isAuthenticated ? '/account' : '/login';
  
  const freeToolsCount = getFreeToolCount();
  const proToolsCount = getPremiumToolCount();

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
        .sc-logo{display:flex;align-items:center;gap:9px;text-decoration:none;flex-shrink:0;}
        .sc-logo-mark{width:30px;height:30px;flex-shrink:0;}
        .sc-logo-text{font-size:21px;font-weight:700;color:var(--text);letter-spacing:-0.01em;}
        .sc-logo-text .a{color:var(--accent);}
        .sc-nav{display:flex;align-items:center;gap:6px;flex:1;justify-content:center;}
        .sc-navbtn{display:flex;align-items:center;gap:5px;font-size:14px;font-weight:500;color:var(--text);background:none;border:none;cursor:pointer;padding:8px 12px;border-radius:8px;text-decoration:none;transition:background .12s,color .12s;white-space:nowrap;}
        .sc-navbtn:hover,.sc-navbtn.open{background:rgba(15,23,42,0.04);color:var(--accent);}
        .sc-navbtn .chev{font-size:8px;color:var(--hint);transition:transform .16s;}
        .sc-navbtn.open .chev{transform:rotate(180deg);}
        .sc-right{display:flex;align-items:center;gap:14px;flex-shrink:0;}
        .sc-lang{position:relative;}
        .sc-langbtn{display:flex;align-items:center;gap:6px;background:none;border:none;cursor:pointer;font-size:13px;font-weight:500;color:var(--muted);padding:6px 8px;border-radius:7px;transition:background .12s;}
        .sc-langbtn:hover{background:rgba(15,23,42,0.04);color:var(--text);}
        .sc-globe{width:15px;height:15px;opacity:.65;}
        .sc-langchev{font-size:8px;}
        .sc-langmenu{position:absolute;top:calc(100% + 8px);min-width:190px;background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:6px;box-shadow:var(--mega-shadow);}
        [dir="ltr"] .sc-langmenu{right:0;}
        [dir="rtl"] .sc-langmenu{left:0;}
        .sc-langitem{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:9px 12px;border-radius:7px;font-size:14px;color:var(--text);background:none;border:none;width:100%;text-align:start;cursor:pointer;transition:background .1s;}
        .sc-langitem:hover{background:var(--bg);}
        .sc-langitem.active{background:var(--bg);font-weight:500;}
        .sc-langitem .sh{font-size:11px;color:var(--hint);font-weight:500;font-variant-numeric:tabular-nums;}
        .sc-langnote{padding:9px 12px 6px;margin-top:4px;border-top:1px solid var(--border);font-size:11px;color:var(--hint);}
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
        .sc-draw-lang{display:flex;flex-wrap:wrap;gap:6px;padding:16px 24px;border-top:1px solid var(--border);}
        .sc-draw-lang button{padding:7px 14px;border-radius:20px;border:1px solid var(--border);background:none;font-size:13px;color:var(--text);cursor:pointer;}
        .sc-draw-lang button.active{background:var(--accent);color:#fff;border-color:var(--accent);}
      `}</style>

      <header className="sc-h" dir={dir}>
        <div className="sc-inner">

          <Link href={rootHref(locale)} className="sc-logo" aria-label="SectorCalc home">
            <svg className="sc-logo-mark" viewBox="0 0 32 32" fill="none" aria-hidden="true">
              <rect x="2"  y="2"  width="13" height="13" rx="3" fill="#0F172A"/>
              <rect x="17" y="2"  width="13" height="13" rx="3" fill="#2563EB"/>
              <rect x="2"  y="17" width="13" height="13" rx="3" fill="#10B981"/>
              <rect x="17" y="17" width="13" height="13" rx="3" fill="#F59E0B"/>
            </svg>
            <span className="sc-logo-text">Sector<span className="a">Calc</span></span>
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
            <Link href={href(locale,'pricing')} className="sc-navbtn">{t.pricing}</Link>
            <div onMouseEnter={()=>openWithIntent('resources')} onMouseLeave={closeWithIntent}>
              <button className={`sc-navbtn${openMenu==='resources'?' open':''}`} onClick={()=>setOpenMenu(openMenu==='resources'?null:'resources')} aria-expanded={openMenu==='resources'}>
                {t.resources} <span className="chev">▼</span>
              </button>
            </div>

            {openMenu && (
              <div className="sc-megawrap" onMouseEnter={()=>openWithIntent(openMenu)} onMouseLeave={closeWithIntent}>
                {openMenu==='products' && (
                  <div className="sc-mega sc-mega-products">
                    <Link href={href(locale,'free-tools')} className="sc-mega-panel">
                      <div className="pt"><span className="pico">🧮</span><span className="ph">{t.col_free}</span></div>
                      <div className="pd">{t.products_free_desc}</div>
                      <div className="pcount">{freeToolsCount}+ {t.tools}</div>
                    </Link>
                    <Link href={href(locale,'pricing')} className="sc-mega-panel">
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
                        <div className="sc-mega-col" key={g.groupKey}>
                          <Link href={href(locale, 'industries')} style={{ textDecoration: 'none' }}>
                            <h4>{t[g.groupKey as keyof typeof t]}</h4>
                          </Link>
                          {g.items.map((it)=>(
                            <Link key={it.slug} href={href(locale,`industries/${it.slug}`)} className="sc-mega-item">
                              <span className="ico">{it.icon}</span>
                              <span className="txt"><b>{t[it.key as keyof typeof t]}</b><span>{it.count} {t.tools}</span></span>
                            </Link>
                          ))}
                        </div>
                      ))}
                    </div>
                    <div className="sc-mega-foot">
                      <Link href={href(locale,'industries')}>{t.view_all_industries} →</Link>
                      <span className="promo">18 sectors · 552 {t.tools}</span>
                    </div>
                  </div>
                )}
                {openMenu==='resources' && (
                  <div className="sc-mega sc-mega-resources">
                    <Link href={href(locale,'case-studies')} className="sc-res-item">
                      <span className="rico">📝</span><span className="rt"><b>{t.res_blog}</b><span>{t.res_blog_d}</span></span>
                    </Link>
                    <Link href={href(locale,'calculator-library')} className="sc-res-item">
                      <span className="rico">📐</span><span className="rt"><b>{t.res_docs}</b><span>{t.res_docs_d}</span></span>
                    </Link>
                  </div>
                )}
              </div>
            )}
          </nav>

          <div className="sc-right">
            <Link href={accountHref} className="sc-signin">{t.signin}</Link>
            <Link href={href(locale,'login')} className="sc-getstarted">{t.getStarted}</Link>
            <button className="sc-burger" onClick={()=>setMobileOpen(!mobileOpen)} aria-label="Menu" aria-expanded={mobileOpen}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                {mobileOpen
                  ? <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>
                  : <><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></>}
              </svg>
            </button>
          </div>
        </div>

        <div className={`sc-drawer${mobileOpen?' open':''}`} dir={dir}>
          <div className="sc-draw-sec">
            <button className={`sc-draw-head${mobileSection==='products'?' open':''}`} onClick={()=>setMobileSection(mobileSection==='products'?null:'products')}>
              {t.products} <span className="dchev">▼</span>
            </button>
            {mobileSection==='products' && (
              <div className="sc-draw-body">
                <Link href={href(locale,'free-tools')} onClick={()=>setMobileOpen(false)}>🧮 {t.col_free} <span className="c">{freeToolsCount}+</span></Link>
                <Link href={href(locale,'pricing')} onClick={()=>setMobileOpen(false)}>⚡ {t.col_pro} <span className="c">{proToolsCount}</span></Link>
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
                  <Link key={it.slug} href={href(locale,`industries/${it.slug}`)} onClick={()=>setMobileOpen(false)}>
                    {it.icon} {t[it.key as keyof typeof t]} <span className="c">{it.count}</span>
                  </Link>
                ))}
                <Link href={href(locale,'industries')} onClick={()=>setMobileOpen(false)} style={{color:'var(--accent)',fontWeight:600}}>{t.view_all_industries} →</Link>
              </div>
            )}
          </div>
          <Link href={href(locale,'pricing')} className="sc-draw-link" onClick={()=>setMobileOpen(false)}>{t.pricing}</Link>
          <div className="sc-draw-sec">
            <button className={`sc-draw-head${mobileSection==='resources'?' open':''}`} onClick={()=>setMobileSection(mobileSection==='resources'?null:'resources')}>
              {t.resources} <span className="dchev">▼</span>
            </button>
            {mobileSection==='resources' && (
              <div className="sc-draw-body">
              <Link href={href(locale,'case-studies')} onClick={()=>setMobileOpen(false)}>
                <span className="rico">📝</span> {t.res_blog}
              </Link>
              <Link href={href(locale,'calculator-library')} onClick={()=>setMobileOpen(false)}>
                <span className="rico">📐</span> {t.res_docs}
              </Link>
            </div>)}
          </div>
          <div className="sc-draw-cta">
            <Link href={href(locale,'login')} className="sc-getstarted" onClick={()=>setMobileOpen(false)}>{t.getStarted}</Link>
            <Link href={accountHref} className="sc-signin" onClick={()=>setMobileOpen(false)}>{t.signin}</Link>
          </div>

        </div>
      </header>
    </>
  );
}
