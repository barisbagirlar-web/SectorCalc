'use client';

/**
 * SectorCalc — Pro Tools Page
 * Drop into: /app/[locale]/pro-tools/page.jsx
 *
 * Key fixes implemented:
 *  1. All tool display names in English (mapped from Turkish slugs)
 *  2. Clear value proposition hero
 *  3. "What Pro unlocks" feature grid
 *  4. Sector-grouped tool list with English names
 *  5. Credit CTA
 */

import { useState } from 'react';
import Link from 'next/link';

// ─── English name map ─────────────────────────────────────────────────────────
// Maps Turkish slug → English display name.
// Extend this map as you add more pro tools.

const PRO_TOOLS_EN = [
  // Manufacturing Cost & Business
  { slug: 'fx-hedging-stratejisi-forward-option-natural-maliyet-fayda-calculator',        name: 'FX Hedging Strategy — Forward, Option & Natural Cost-Benefit',       sector: 'Finance' },
  { slug: 'garanti-ve-iade-karsiligi-optimizasyon-calculator',                             name: 'Warranty & Return Reserve Optimisation',                             sector: 'Finance' },
  { slug: 'isletme-sermayesi-ve-nakit-dongusu-optimizasyon-calculator',                   name: 'Working Capital & Cash Cycle Optimisation',                         sector: 'Finance' },
  { slug: 'leasing-vs-satin-alma-finansal-karsilastirma-calculator',                      name: 'Leasing vs. Purchase — Financial Comparison',                        sector: 'Finance' },
  { slug: 'musteri-kaybi-churn-ve-kaybedilen-gelir-calculator',                           name: 'Customer Churn & Lost Revenue Model',                                sector: 'Finance' },
  { slug: 'musteri-yasam-boyu-deger-clv-ve-edinme-maliyeti-cac-calculator',               name: 'Customer Lifetime Value (CLV) & Acquisition Cost (CAC)',             sector: 'Finance' },
  { slug: 'satis-kanali-karlilik-karsilastirma-calculator',                               name: 'Sales Channel Profitability Comparison',                             sector: 'Finance' },
  { slug: 'vade-farki-ve-erken-odeme-iskontosu-optimizasyon-calculator',                  name: 'Payment Term Difference & Early Payment Discount Optimisation',       sector: 'Finance' },
  // Quality, SPC & Six Sigma
  { slug: 'alti-sigma-proje-secimi-ve-yatirim-onceliklendirme-calculator',                name: 'Six Sigma Project Selection & Investment Prioritisation',             sector: 'Quality & Six Sigma' },
  { slug: 'aql-kabul-orneklemesi-risk-ve-maliyet-calculator',                             name: 'AQL Acceptance Sampling — Risk & Cost',                              sector: 'Quality & Six Sigma' },
  { slug: 'cpk-ppk-hata-maliyeti-ppm-calculator',                                        name: 'CPK/PPK Error Cost & PPM',                                           sector: 'Quality & Six Sigma' },
  { slug: 'fty-rty-haddelenmis-verim-finansal-calculator',                                name: 'FTY/RTY Rolled Throughput Yield — Financial Impact',                  sector: 'Quality & Six Sigma' },
  { slug: 'htea-rpn-skoru-parasal-risk-calculator',                                       name: 'FMEA RPN Score & Monetary Risk',                                     sector: 'Quality & Six Sigma' },
  { slug: 'msa-gage-r-r-yanlis-karar-maliyet-calculator',                                name: 'MSA Gage R&R — Wrong Decision Cost',                                 sector: 'Quality & Six Sigma' },
  { slug: 'spc-sinyal-kacirma-ve-gec-tespit-maliyet-calculator',                         name: 'SPC Signal Miss & Late Detection Cost',                              sector: 'Quality & Six Sigma' },
  { slug: 'taguchi-kalite-kayip-fonksiyonu-calculator',                                   name: 'Taguchi Quality Loss Function',                                      sector: 'Quality & Six Sigma' },
  // Technology, AI & Cloud
  { slug: 'ai-ml-compute-ve-api-token-maliyet-calculator',                               name: 'AI/ML Compute & API Token Cost',                                     sector: 'Technology & AI' },
  { slug: 'ai-otomasyon-roi-ve-is-gucu-etki-calculator',                                 name: 'AI Automation ROI & Workforce Impact',                               sector: 'Technology & AI' },
  { slug: 'ai-uyum-ve-etik-denetim-maliyet-eu-ai-act-calculator',                        name: 'AI Compliance & EU AI Act Audit Cost',                               sector: 'Technology & AI' },
  { slug: 'bulut-maliyet-optimizasyonu-ve-israf-eliminasyonu-calculator',                 name: 'Cloud Cost Optimisation & Waste Elimination',                        sector: 'Technology & AI' },
  { slug: 'global-pazarlama-lokalizasyon-ve-odeme-maliyet-calculator',                   name: 'Global Marketing Localisation & Payment Cost',                       sector: 'Technology & AI' },
  { slug: 'saas-lisans-kullanim-ve-shelfware-maliyet-calculator',                        name: 'SaaS Licence, Utilisation & Shelfware Cost',                         sector: 'Technology & AI' },
  { slug: 'siber-guvenlik-yatirimi-ve-breach-risk-maliyet-calculator',                   name: 'Cybersecurity Investment & Breach Risk Cost',                        sector: 'Technology & AI' },
  { slug: 'sinir-otesi-istihdam-ve-eor-maliyet-calculator',                              name: 'Cross-Border Employment & EOR Cost',                                 sector: 'Technology & AI' },
  // Electrical & Power
  { slug: 'jenerator-ve-ups-kapasite-secim-optimizasyon-calculator',                     name: 'Generator & UPS Capacity Selection Optimisation',                    sector: 'Electrical & Power' },
  { slug: 'kablo-kesiti-ve-gerilim-dusumu-optimizasyon-calculator',                      name: 'Cable Cross-Section & Voltage Drop Optimisation',                    sector: 'Electrical & Power' },
  { slug: 'kompanzasyon-ve-reaktif-ceza-optimizasyon-calculator',                        name: 'Power Factor Compensation & Reactive Energy Penalty Optimisation',   sector: 'Electrical & Power' },
  { slug: 'pano-isi-yuku-ve-sogutma-kapasite-calculator',                               name: 'Panel Heat Load & Cooling Capacity',                                 sector: 'Electrical & Power' },
  // Environment & ESG
  { slug: 'atik-yonetimi-ve-bertaraf-maliyet-optimizasyon-calculator',                   name: 'Waste Management & Disposal Cost Optimisation',                      sector: 'Energy & ESG' },
  { slug: 'cbam-karbon-sinir-vergisi-ve-ihracat-maliyet-etkisi-calculator',              name: 'CBAM Carbon Border Tax & Export Cost Impact',                        sector: 'Energy & ESG' },
  { slug: 'dongusel-ekonomi-ve-urun-omru-uzatma-roi-calculator',                         name: 'Circular Economy & Product Life Extension ROI',                      sector: 'Energy & ESG' },
  { slug: 'iso-50001-enerji-yonetimi-taban-cizgisi-ve-tasarruf-calculator',              name: 'ISO 50001 Energy Management Baseline & Savings',                     sector: 'Energy & ESG' },
  { slug: 'scope-1-2-3-emisyon-ve-surdurulebilirlik-raporlama-maliyet-calculator',       name: 'Scope 1-2-3 Emissions & Sustainability Reporting Cost',               sector: 'Energy & ESG' },
  { slug: 'su-tuketimi-ve-atik-su-aritma-maliyet-optimizasyon-calculator',               name: 'Water Consumption & Wastewater Treatment Cost Optimisation',         sector: 'Energy & ESG' },
  { slug: 'yenilenebilir-enerji-ges-res-yatirim-fizibilite-calculator',                  name: 'Renewable Energy (Solar/Wind) Investment Feasibility',               sector: 'Energy & ESG' },
  // CNC & Additive
  { slug: 'tools/premium-schema/3b-baski-destek-yapisi-ve-post-proses-maliyet-calculator', name: '3D Print Support Structure & Post-Process Cost',                   sector: 'CNC & Additive' },
  { slug: 'tools/premium-schema/3b-baski-parti-optimizasyonu-ve-yuvalama-calculator',    name: '3D Print Batch Optimisation & Nesting',                              sector: 'CNC & Additive' },
  { slug: 'tools/premium-schema/3b-baski-vs-talasli-imalat-basabas-noktasi-calculator', name: '3D Print vs. CNC Machining Break-Even',                              sector: 'CNC & Additive' },
  { slug: 'cnc-takim-yolu-bos-kesim-suresi-calculator',                                  name: 'CNC Tool Path — Air-Cut Time',                                       sector: 'CNC & Additive' },
  { slug: 'filament-recine-toz-maliyet-ve-fire-karsilastirma-calculator',                name: 'Filament/Resin/Powder Cost & Waste Comparison',                      sector: 'CNC & Additive' },
  { slug: 'isleme-stratejisi-sure-dagilim-optimizasyon-calculator',                      name: 'Machining Strategy Time Distribution Optimisation',                  sector: 'CNC & Additive' },
  { slug: 'kesme-parametreleri-takim-omru-optimizasyon-calculator',                      name: 'Cutting Parameters & Tool Life Optimisation',                        sector: 'CNC & Additive' },
  { slug: 'topoloji-optimizasyonu-hafiflik-ve-yakit-tasarrufu-calculator',               name: 'Topology Optimisation — Weight Reduction & Fuel Savings',            sector: 'CNC & Additive' },
  // Lean & OEE
  { slug: 'tools/premium-schema/5s-denetim-skoru-verimlilik-kaybi-maliyet-calculator',  name: '5S Audit Score & Productivity Loss Cost',                            sector: 'Lean & OEE' },
  { slug: 'tools/premium-schema/7-israf-muda-avcisi-parasal-karsilik-calculator',       name: '7 Wastes (Muda) — Monetary Mapping',                                 sector: 'Lean & OEE' },
  { slug: 'andon-sistemi-durus-ve-tepki-suresi-maliyet-calculator',                     name: 'Andon System — Stoppage & Response Time Cost',                       sector: 'Lean & OEE' },
  { slug: 'kaizen-kazanc-takip-ve-onceliklendirme-calculator',                           name: 'Kaizen Gain Tracking & Prioritisation',                              sector: 'Lean & OEE' },
  { slug: 'kanban-kart-sayisi-ve-supermarket-stok-calculator',                           name: 'Kanban Card Count & Supermarket Stock Level',                        sector: 'Lean & OEE' },
  { slug: 'kapasite-planlama-ve-darbogaz-yatirim-onceliklendirme-calculator',            name: 'Capacity Planning & Bottleneck Investment Prioritisation',           sector: 'Lean & OEE' },
  { slug: 'ogrenme-egrisi-ve-parti-sure-tahmin-calculator',                              name: 'Learning Curve & Batch Time Estimation',                             sector: 'Lean & OEE' },
  { slug: 'poka-yoke-hata-onleme-yatirim-geri-donus-calculator',                        name: 'Poka-Yoke Error Prevention Investment ROI',                          sector: 'Lean & OEE' },
  { slug: 'smed-setup-suresi-ve-ekonomik-parti-calculator',                              name: 'SMED Setup Time & Economic Batch Size',                              sector: 'Lean & OEE' },
  { slug: 'takt-time-esnek-is-gucu-dalgalanma-maliyet-calculator',                      name: 'Takt Time — Flexible Workforce Fluctuation Cost',                    sector: 'Lean & OEE' },
  { slug: 'urun-karmasi-karmasiklik-maliyeti-hidden-factory-calculator',                 name: 'Product Mix Complexity Cost — Hidden Factory',                       sector: 'Lean & OEE' },
  { slug: 'vsm-finansal-donusum-calculator',                                             name: 'Value Stream Map (VSM) — Financial Conversion',                      sector: 'Lean & OEE' },
  { slug: 'yamazumi-is-yuku-dengeleme-kayip-calculator',                                 name: 'Yamazumi Workload Balancing Loss',                                   sector: 'Lean & OEE' },
  { slug: 'zaman-etudu-ve-standart-sure-calculator',                                     name: 'Time Study & Standard Time',                                         sector: 'Lean & OEE' },
  // Maintenance
  { slug: 'kok-neden-analizi-rca-tekrarlayan-ariza-birikimli-maliyet-calculator',        name: 'Root Cause Analysis (RCA) — Cumulative Failure Cost',                sector: 'Maintenance & Reliability' },
  { slug: 'koruyucu-bakim-frekansi-ve-maliyet-optimizasyon-calculator',                  name: 'Preventive Maintenance Frequency & Cost Optimisation',               sector: 'Maintenance & Reliability' },
  { slug: 'kritiklik-risk-matrisi-ve-bakim-stratejisi-secim-calculator',                 name: 'Criticality Risk Matrix & Maintenance Strategy Selection',           sector: 'Maintenance & Reliability' },
  { slug: 'mtbf-mttr-ve-kullanilabilirlik-finansal-calculator',                          name: 'MTBF/MTTR Availability — Financial Impact',                          sector: 'Maintenance & Reliability' },
  { slug: 'yedek-parca-stok-seviyesi-ve-durus-riski-optimizasyon-calculator',           name: 'Spare Parts Stock Level & Downtime Risk Optimisation',               sector: 'Maintenance & Reliability' },
  // Construction
  { slug: 'beton-karisim-tasarimi-ve-maliyet-optimizasyon-calculator',                   name: 'Concrete Mix Design & Cost Optimisation',                            sector: 'Construction' },
  { slug: 'gecici-isler-ve-santiye-tesisleri-kurulum-maliyet-calculator',                name: 'Temporary Works & Site Facilities Setup Cost',                       sector: 'Construction' },
  { slug: 'hafriyat-ve-dolgu-dengesi-optimizasyon-calculator',                           name: 'Cut & Fill Balance Optimisation',                                    sector: 'Construction' },
  { slug: 'iskele-ve-kalip-kullanim-suresi-optimizasyon-calculator',                     name: 'Scaffolding & Formwork Usage Time Optimisation',                     sector: 'Construction' },
  { slug: 'kazanilmis-deger-yonetimi-evm-tamamlanma-maliyet-tahmin-calculator',         name: 'Earned Value Management (EVM) — Completion Cost Forecast',           sector: 'Construction' },
  { slug: 'kritik-yol-cpm-gecikme-cezasi-ve-hizlandirma-optimizasyon-calculator',       name: 'Critical Path (CPM) — Delay Penalty & Acceleration Optimisation',    sector: 'Construction' },
  { slug: 'proje-nakit-akisi-ve-ilerleme-hakedis-optimizasyon-calculator',               name: 'Project Cash Flow & Progress Payment Optimisation',                  sector: 'Construction' },
  // Automation & Digital Factory
  { slug: 'agv-amr-otonom-tasima-geri-donus-calculator',                                 name: 'AGV/AMR Autonomous Transport ROI',                                   sector: 'Automation & Digital Factory' },
  { slug: 'cobot-vs-manuel-iscilik-karsilastirma-calculator',                            name: 'Cobot vs. Manual Labour Comparison',                                 sector: 'Automation & Digital Factory' },
  { slug: 'dijital-ikiz-vs-fiziksel-deneme-maliyet-calculator',                          name: 'Digital Twin vs. Physical Trial Cost',                               sector: 'Automation & Digital Factory' },
  { slug: 'enerji-izleme-sistemi-yatirim-ve-tasarruf-tahmin-calculator',                 name: 'Energy Monitoring System Investment & Savings Forecast',             sector: 'Automation & Digital Factory' },
  { slug: 'iot-sensor-ve-ongorucu-bakim-yatirim-geri-donus-calculator',                 name: 'IoT Sensor & Predictive Maintenance ROI',                           sector: 'Automation & Digital Factory' },
  { slug: 'kagitsiz-uretim-dijital-is-emri-yatirim-geri-donus-calculator',               name: 'Paperless Manufacturing — Digital Work Order ROI',                   sector: 'Automation & Digital Factory' },
  // Supply Chain
  { slug: 'asgari-siparis-miktari-moq-ve-stok-tasima-maliyet-denge-calculator',         name: 'MOQ vs. Holding Cost Trade-Off',                                     sector: 'Supply Chain' },
  { slug: 'capraz-sevkiyat-cross-docking-vs-depolama-maliyet-calculator',               name: 'Cross-Docking vs. Storage Cost',                                     sector: 'Supply Chain' },
  { slug: 'depo-yerlesimi-ve-toplama-rotasi-optimizasyon-calculator',                    name: 'Warehouse Layout & Pick Route Optimisation',                         sector: 'Supply Chain' },
  { slug: 'tasima-modu-toplam-maliyet-ve-risk-calculator',                              name: 'Transport Mode — Total Cost & Risk',                                  sector: 'Supply Chain' },
  { slug: 'tedarikci-performans-skor-karti-ve-tco-calculator',                           name: 'Supplier Performance Scorecard & TCO',                               sector: 'Supply Chain' },
  { slug: 'toplam-sahip-olma-maliyeti-tco-ekipman-karsilastirma-calculator',             name: 'Total Cost of Ownership (TCO) — Equipment Comparison',               sector: 'Supply Chain' },
  // Food & Cold Chain
  { slug: 'haccp-kritik-kontrol-noktasi-sapma-maliyet-calculator',                       name: 'HACCP Critical Control Point Deviation Cost',                        sector: 'Food & Cold Chain' },
  { slug: 'raf-omru-ve-fire-optimizasyon-calculator',                                    name: 'Shelf Life & Waste Optimisation',                                    sector: 'Food & Cold Chain' },
  { slug: 'recete-maliyeti-ve-alternatif-hammadde-etki-calculator',                      name: 'Recipe Cost & Alternative Raw Material Impact',                      sector: 'Food & Cold Chain' },
  { slug: 'soguk-zincir-kirilmasi-ve-urun-kayip-maliyet-calculator',                    name: 'Cold Chain Break & Product Loss Cost',                               sector: 'Food & Cold Chain' },
  // HSE
  { slug: 'ergonomi-ve-kas-iskelet-rahatsizligi-kayip-maliyet-calculator',               name: 'Ergonomic & Musculoskeletal Disorder Loss Cost',                     sector: 'HSE & Risk' },
  { slug: 'isg-yatirimi-ve-risk-azaltma-getiri-calculator',                              name: 'HSE Investment & Risk Reduction ROI',                                sector: 'HSE & Risk' },
  { slug: 'kaza-maliyeti-dogrudan-ve-dolayli-toplam-kayip-calculator',                  name: 'Accident Cost — Direct & Indirect Total Loss',                       sector: 'HSE & Risk' },
  // Mechanical & HVAC
  { slug: 'buhar-kapani-steam-trap-kacak-ve-enerji-kayip-calculator',                   name: 'Steam Trap Leak & Energy Loss',                                      sector: 'Mechanical & HVAC' },
  { slug: 'hava-kanali-surtunme-ve-fan-enerji-tuketim-calculator',                      name: 'Duct Friction Loss & Fan Energy Consumption',                        sector: 'Mechanical & HVAC' },
  { slug: 'isi-degistirici-esanjor-kirlenme-ve-verim-kaybi-calculator',                  name: 'Heat Exchanger Fouling & Efficiency Loss',                           sector: 'Mechanical & HVAC' },
  { slug: 'yalitim-kalinligi-ve-enerji-tasarrufu-optimizasyon-calculator',               name: 'Insulation Thickness & Energy Savings Optimisation',                 sector: 'Mechanical & HVAC' },
  // Workforce & HR
  { slug: 'egitim-yatirimi-ve-verimlilik-artisi-geri-donus-calculator',                  name: 'Training Investment & Productivity Gain ROI',                        sector: 'Workforce & HR' },
  { slug: 'fazla-mesai-vs-yeni-ise-alim-basabas-calculator',                             name: 'Overtime vs. New Hire Break-Even',                                   sector: 'Workforce & HR' },
  { slug: 'isten-ayrilma-turnover-toplam-maliyet-calculator',                            name: 'Employee Turnover — Total Cost',                                     sector: 'Workforce & HR' },
  { slug: 'vardiya-sistemi-2-li-3-lu-maliyet-ve-verimlilik-calculator',                 name: '2-Shift vs. 3-Shift Cost & Productivity',                            sector: 'Workforce & HR' },
];

// Group by sector
const groupBySector = (tools) => {
  const map = {};
  tools.forEach((t) => {
    if (!map[t.sector]) map[t.sector] = [];
    map[t.sector].push(t);
  });
  return map;
};

// ─── Features ────────────────────────────────────────────────────────────────

const FEATURES = [
  { icon: '📐', titleKey: 'feature_1_title', bodyKey: 'feature_1_body' },
  { icon: '📄', titleKey: 'feature_2_title', bodyKey: 'feature_2_body' },
  { icon: '📋', titleKey: 'feature_3_title', bodyKey: 'feature_3_body' },
  { icon: '💰', titleKey: 'feature_4_title', bodyKey: 'feature_4_body' },
];

// ─── Component ───────────────────────────────────────────────────────────────

export default function ProToolsPage({ locale = 'en', translations }) {
  const t   = translations?.[locale]?.pro_tools || translations?.['en']?.pro_tools || {};
  const dir = translations?.[locale]?.dir || 'ltr';

  const [activeSector, setActiveSector] = useState('all');
  const grouped = groupBySector(PRO_TOOLS_EN);
  const sectors  = Object.keys(grouped);

  const displayTools = activeSector === 'all'
    ? PRO_TOOLS_EN
    : grouped[activeSector] || [];

  return (
    <>
      <style>{`
        .pt-root {
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
        .pt-root *,.pt-root *::before,.pt-root *::after{box-sizing:border-box;margin:0;padding:0;}

        /* Hero */
        .pt-hero{padding:64px 24px 48px;max-width:760px;margin:0 auto;text-align:center;}
        .pt-eyebrow{font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:var(--gold);font-weight:600;margin-bottom:16px;}
        .pt-h1{font-size:clamp(28px,4.5vw,44px);font-weight:700;letter-spacing:-0.02em;line-height:1.15;margin-bottom:14px;}
        .pt-sub{font-size:15px;color:var(--muted);line-height:1.7;max-width:600px;margin:0 auto 28px;}
        .pt-credit-pill{display:inline-flex;align-items:center;gap:8px;background:var(--surface);border:1px solid var(--border2);border-radius:20px;padding:8px 18px;font-size:13px;color:var(--muted);}
        .pt-credit-pill strong{color:var(--gold);}

        /* Features */
        .pt-features{max-width:900px;margin:0 auto;padding:0 24px 56px;}
        .pt-features-title{font-size:20px;font-weight:700;margin-bottom:24px;letter-spacing:-0.01em;}
        .pt-features-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:14px;}
        .pt-feature-card{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:20px 18px;}
        .pt-feature-icon{font-size:22px;margin-bottom:10px;}
        .pt-feature-title{font-size:14px;font-weight:600;margin-bottom:6px;}
        .pt-feature-body{font-size:12px;color:var(--muted);line-height:1.6;}

        /* Sector filter */
        .pt-filter-wrap{overflow-x:auto;padding:0 24px 20px;scrollbar-width:none;}
        .pt-filter-wrap::-webkit-scrollbar{display:none;}
        .pt-filter{display:flex;gap:8px;white-space:nowrap;max-width:1060px;margin:0 auto;}
        .pt-filter-btn{padding:7px 14px;border-radius:20px;font-size:13px;font-weight:500;cursor:pointer;border:1px solid var(--border);background:transparent;color:var(--muted);transition:all 0.15s;}
        .pt-filter-btn:hover{border-color:var(--border2);color:var(--text);}
        .pt-filter-btn.active{background:var(--gold);color:#0F172A;border-color:var(--gold);font-weight:700;}

        /* Tool list */
        .pt-tools-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:10px;max-width:1060px;margin:0 auto;padding:8px 24px 64px;}
        @media(max-width:560px){.pt-tools-grid{grid-template-columns:1fr;}}

        .pt-tool-card{
          background:var(--surface);
          border:1px solid rgba(245,158,11,0.12);
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
        .pt-tool-card:hover{border-color:rgba(245,158,11,0.4);background:var(--elevated);}
        .pt-tool-card:hover .pt-tool-arrow{opacity:1;transform:translateX(3px);}
        .pt-tool-inner{flex:1;min-width:0;}
        .pt-tool-name{font-size:13px;font-weight:500;line-height:1.35;margin-bottom:5px;}
        .pt-tool-sector{font-size:10px;color:var(--hint);}
        .pt-tool-badge{font-size:10px;font-weight:600;padding:2px 7px;border-radius:10px;background:rgba(245,158,11,0.12);color:var(--gold);}
        .pt-tool-right{display:flex;flex-direction:column;align-items:flex-end;gap:6px;flex-shrink:0;}
        .pt-tool-arrow{font-size:14px;color:var(--muted);opacity:0;transition:all 0.15s;}

        /* CTA bar */
        .pt-cta-bar{max-width:860px;margin:0 auto 64px;padding:0 24px;}
        .pt-cta-inner{background:rgba(245,158,11,0.07);border:1px solid rgba(245,158,11,0.2);border-radius:12px;padding:28px 32px;display:flex;align-items:center;justify-content:space-between;gap:20px;flex-wrap:wrap;}
        .pt-cta-text strong{display:block;font-size:18px;font-weight:700;margin-bottom:6px;}
        .pt-cta-text p{font-size:14px;color:var(--muted);line-height:1.5;}
        .pt-cta-link{display:inline-block;background:var(--gold);color:#0F172A;font-size:14px;font-weight:700;padding:12px 28px;border-radius:8px;text-decoration:none;white-space:nowrap;transition:background 0.15s;flex-shrink:0;}
        .pt-cta-link:hover{background:#FBBF24;}
        .pt-cta-sub{font-size:12px;color:var(--hint);margin-top:6px;}
      `}</style>

      <div className="pt-root" dir={dir}>

        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <div className="pt-hero">
          <div className="pt-eyebrow">{t.hero_eyebrow || 'Pro calculator library'}</div>
          <h1 className="pt-h1">{t.hero_title || '161 calculators built for real engineering decisions.'}</h1>
          <p className="pt-sub">{t.hero_sub || 'Pro tools accept your actual operating data. Results include professional PDF export and applicable industrial standards. Each tool costs one credit.'}</p>
          <div className="pt-credit-pill">
            <strong>1 credit</strong> {t.one_credit || 'per calculation'}
            &nbsp;·&nbsp;
            <Link href="/pricing" style={{ color: 'var(--gold)', textDecoration: 'underline' }}>
              {t.credits_cta || 'Get credits →'}
            </Link>
          </div>
        </div>

        {/* ── What Pro unlocks ─────────────────────────────────────────── */}
        <div className="pt-features">
          <div className="pt-features-title">{t.what_pro_title || 'What separates pro tools'}</div>
          <div className="pt-features-grid">
            {FEATURES.map((f) => (
              <div className="pt-feature-card" key={f.titleKey}>
                <div className="pt-feature-icon">{f.icon}</div>
                <div className="pt-feature-title">{t[f.titleKey]}</div>
                <div className="pt-feature-body">{t[f.bodyKey]}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Sector filter ─────────────────────────────────────────────── */}
        <div className="pt-filter-wrap">
          <div className="pt-filter">
            <button
              className={`pt-filter-btn${activeSector === 'all' ? ' active' : ''}`}
              onClick={() => setActiveSector('all')}
            >
              All ({PRO_TOOLS_EN.length})
            </button>
            {sectors.map((sec) => (
              <button
                key={sec}
                className={`pt-filter-btn${activeSector === sec ? ' active' : ''}`}
                onClick={() => setActiveSector(sec)}
              >
                {sec} ({grouped[sec].length})
              </button>
            ))}
          </div>
        </div>

        {/* ── Tool grid ─────────────────────────────────────────────────── */}
        <div className="pt-tools-grid">
          {displayTools.map((tool) => (
            <Link
              key={tool.slug}
              href={`/${tool.slug}`}
              className="pt-tool-card"
            >
              <div className="pt-tool-inner">
                <div className="pt-tool-name">{tool.name}</div>
                <div className="pt-tool-sector">{tool.sector}</div>
              </div>
              <div className="pt-tool-right">
                <span className="pt-tool-badge">Pro</span>
                <span className="pt-tool-arrow">→</span>
              </div>
            </Link>
          ))}
        </div>

        {/* ── Bottom CTA ─────────────────────────────────────────────────── */}
        <div className="pt-cta-bar">
          <div className="pt-cta-inner">
            <div className="pt-cta-text">
              <strong>Ready to use a pro tool?</strong>
              <p>One credit unlocks any calculation. Credits valid 12 months. No subscription.</p>
              <div className="pt-cta-sub">From $1.99 · Secure checkout via Stripe</div>
            </div>
            <Link href="/pricing" className="pt-cta-link">
              Get credits →
            </Link>
          </div>
        </div>

      </div>
    </>
  );
}
