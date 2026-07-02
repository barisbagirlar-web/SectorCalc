'use client';

/**
 * SectorCalc — Pricing Page
 * Drop into: /app/(route)/pricing/page.jsx  OR  /pages/pricing.jsx
 *
 * Locale detection:
 *   - Next.js App Router: read `params.locale` from layout
 *   - Pages Router:       read `router.locale`
 *   - Both:              import translations from './pricing-translations.json'
 *
 * Styled with CSS-in-JSX via <style> tag + inline styles.
 * Zero external dependencies beyond React.
 */

import { useState } from 'react';
import Link from 'next/link';

// ─── Data ────────────────────────────────────────────────────────────────────

const CREDIT_TIERS = [
  {
    id: 'trial',
    credits: 1,
    price: 1.99,
    perCredit: 1.99,
    savingsPct: 0,
    popular: false,
  },
  {
    id: 'starter',
    credits: 5,
    price: 4.99,
    perCredit: 1.00,
    savingsPct: 50,
    popular: false,
  },
  {
    id: 'standard',
    credits: 15,
    price: 7.99,
    perCredit: 0.53,
    savingsPct: 73,
    popular: true,
  },
  {
    id: 'professional',
    credits: 30,
    price: 11.99,
    perCredit: 0.40,
    savingsPct: 80,
    popular: false,
  },
  {
    id: 'enterprise',
    credits: 100,
    price: 24.99,
    perCredit: 0.25,
    savingsPct: 87,
    popular: false,
  },
];

const SOCIAL_PROOF = [
  { value: '18,000+', labelKey: 'social_calcs' },
  { value: '161',     labelKey: 'social_tools' },
  { value: '45+',     labelKey: 'social_countries' },
];

const UNLOCK_EXAMPLES = [
  {
    icon: '⚙️',
    titleEn: 'OEE Analysis',
    descEn: 'Availability × Performance × Quality — with your machine data. Reveals exact downtime cost per shift.',
  },
  {
    icon: '📉',
    titleEn: 'Scrap & Material Loss',
    descEn: 'Maps actual scrap rates to financial loss. Identifies the single biggest cost driver in your process.',
  },
  {
    icon: '🔧',
    titleEn: 'Maintenance ROI',
    descEn: 'MTBF × MTTR → operational availability and annual cost-of-failure vs. preventive investment.',
  },
];

// ─── Component ───────────────────────────────────────────────────────────────

export default function PricingPage({ locale = 'en', translations }) {
  const t = translations?.(route)?.pricing || translations?.['en']?.pricing || {};
  const dir = translations?.(route)?.dir || 'ltr';

  const [openFaq, setOpenFaq] = useState(null);
  const toggleFaq = (i) => setOpenFaq(openFaq === i ? null : i);

  const faq = t.faq || [];
  const tierUseKeys = ['tier_use_1','tier_use_5','tier_use_15','tier_use_30','tier_use_100'];

  return (
    <>
      <style>{`
        .pricing-root {
          --bg:       #0F172A;
          --surface:  #1E293B;
          --elevated: #253047;
          --gold:     #F59E0B;
          --gold-dim: rgba(245,158,11,0.12);
          --green:    #10B981;
          --text:     #F1F5F9;
          --muted:    #94A3B8;
          --hint:     #64748B;
          --border:   rgba(255,255,255,0.07);
          --border2:  rgba(255,255,255,0.14);
          --radius:   12px;
          font-family: 'DM Sans', 'SF Pro Text', -apple-system, BlinkMacSystemFont, sans-serif;
          background: var(--bg);
          color: var(--text);
          min-height: 100vh;
        }
        .pricing-root *,
        .pricing-root *::before,
        .pricing-root *::after { box-sizing: border-box; margin: 0; padding: 0; }

        /* Hero */
        .pr-hero { text-align: center; padding: 80px 24px 56px; max-width: 720px; margin: 0 auto; }
        .pr-eyebrow { font-size: 12px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--gold); font-weight: 600; margin-bottom: 20px; }
        .pr-h1 { font-size: clamp(32px,5vw,52px); font-weight: 700; line-height: 1.12; white-space: pre-line; letter-spacing: -0.02em; }
        .pr-h1 em { color: var(--gold); font-style: normal; }
        .pr-sub { margin-top: 20px; font-size: 16px; color: var(--muted); line-height: 1.7; }

        /* Social proof bar */
        .pr-social { display: flex; justify-content: center; gap: 40px; flex-wrap: wrap; padding: 28px 24px; border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); margin: 0 24px; }
        .pr-social-item { text-align: center; }
        .pr-social-value { font-size: 22px; font-weight: 700; font-variant-numeric: tabular-nums; letter-spacing: -0.01em; }
        .pr-social-label { font-size: 12px; color: var(--muted); margin-top: 2px; }

        /* Value anchor */
        .pr-anchor { max-width: 680px; margin: 48px auto; padding: 0 24px; }
        .pr-anchor-box { background: var(--gold-dim); border: 1px solid rgba(245,158,11,0.25); border-radius: var(--radius); padding: 24px 28px; }
        .pr-anchor-headline { font-size: 17px; font-weight: 600; color: var(--gold); margin-bottom: 8px; line-height: 1.4; }
        .pr-anchor-body { font-size: 14px; color: var(--muted); line-height: 1.65; }

        /* Tier grid */
        .pr-tiers { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px; max-width: 1060px; margin: 0 auto; padding: 0 24px 56px; }
        .pr-tier { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 24px 20px 22px; display: flex; flex-direction: column; gap: 0; position: relative; transition: border-color 0.18s; }
        .pr-tier:hover { border-color: var(--border2); }
        .pr-tier.popular { border-color: var(--gold); background: linear-gradient(160deg, #1E293B 0%, #1c2a3a 100%); }
        .pr-tier-popular-badge { position: absolute; top: -11px; left: 50%; transform: translateX(-50%); background: var(--gold); color: #0F172A; font-size: 10px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; padding: 3px 10px; border-radius: 20px; white-space: nowrap; }
        .pr-tier-name { font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; font-weight: 600; color: var(--muted); margin-bottom: 4px; }
        .pr-tier-desc { font-size: 12px; color: var(--hint); margin-bottom: 20px; line-height: 1.4; min-height: 32px; }
        .pr-tier-credits { font-size: 36px; font-weight: 800; letter-spacing: -0.03em; line-height: 1; }
        .pr-tier-credits-label { font-size: 14px; font-weight: 400; color: var(--muted); margin-left: 4px; letter-spacing: 0; }
        .pr-tier-price { font-size: 22px; font-weight: 700; margin-top: 10px; }
        .pr-tier-per-credit { font-size: 12px; color: var(--muted); margin-top: 2px; }
        .pr-tier-savings { display: inline-block; font-size: 11px; font-weight: 600; padding: 3px 8px; background: rgba(16,185,129,0.12); color: var(--green); border-radius: 20px; margin-top: 8px; }
        .pr-tier-savings.invisible { visibility: hidden; }
        .pr-tier-divider { height: 1px; background: var(--border); margin: 18px 0; }
        .pr-tier-uses { display: flex; flex-direction: column; gap: 7px; flex: 1; }
        .pr-tier-use-item { font-size: 12px; color: var(--muted); line-height: 1.4; padding-left: 14px; position: relative; }
        .pr-tier-use-item::before { content: '→'; position: absolute; left: 0; color: var(--hint); }
        .pr-tier-cta { display: block; margin-top: 20px; text-align: center; padding: 11px 16px; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; text-decoration: none; transition: all 0.15s; }
        .pr-tier.popular .pr-tier-cta { background: var(--gold); color: #0F172A; }
        .pr-tier.popular .pr-tier-cta:hover { background: #FBBF24; }
        .pr-tier:not(.popular) .pr-tier-cta { background: transparent; color: var(--text); border: 1px solid var(--border2); }
        .pr-tier:not(.popular) .pr-tier-cta:hover { background: var(--elevated); border-color: var(--gold); color: var(--gold); }

        /* Section wrapper */
        .pr-section { max-width: 860px; margin: 0 auto; padding: 0 24px 64px; }
        .pr-section-title { font-size: 24px; font-weight: 700; letter-spacing: -0.02em; margin-bottom: 8px; }
        .pr-section-sub { font-size: 15px; color: var(--muted); margin-bottom: 32px; }

        /* What unlocks */
        .pr-unlock-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 16px; }
        .pr-unlock-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 22px 20px; }
        .pr-unlock-icon { font-size: 24px; margin-bottom: 12px; }
        .pr-unlock-title { font-size: 15px; font-weight: 600; margin-bottom: 6px; }
        .pr-unlock-desc { font-size: 13px; color: var(--muted); line-height: 1.6; }

        /* How it works */
        .pr-how-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
        @media(max-width:600px){ .pr-how-grid { grid-template-columns: 1fr; } }
        .pr-how-step { text-align: center; }
        .pr-how-num { width: 40px; height: 40px; border-radius: 50%; border: 1px solid var(--gold); color: var(--gold); font-size: 16px; font-weight: 700; display: flex; align-items: center; justify-content: center; margin: 0 auto 14px; }
        .pr-how-title { font-size: 15px; font-weight: 600; margin-bottom: 6px; }
        .pr-how-body { font-size: 13px; color: var(--muted); line-height: 1.6; }

        /* Why not subscription */
        .pr-why { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 32px 36px; margin-bottom: 64px; max-width: 860px; margin-left: auto; margin-right: auto; }
        @media(max-width:560px){ .pr-why { margin: 0 24px 64px; padding: 24px 20px; } }
        .pr-why-title { font-size: 20px; font-weight: 700; margin-bottom: 12px; }
        .pr-why-body { font-size: 15px; color: var(--muted); line-height: 1.75; }

        /* FAQ */
        .pr-faq { display: flex; flex-direction: column; gap: 4px; }
        .pr-faq-item { border: 1px solid var(--border); border-radius: 8px; overflow: hidden; }
        .pr-faq-q { width: 100%; text-align: left; padding: 16px 20px; font-size: 14px; font-weight: 500; background: var(--surface); color: var(--text); cursor: pointer; display: flex; justify-content: space-between; align-items: center; gap: 12px; border: none; }
        [dir="rtl"] .pr-faq-q { text-align: right; }
        .pr-faq-q:hover { background: var(--elevated); }
        .pr-faq-chevron { font-size: 12px; color: var(--muted); transition: transform 0.2s; flex-shrink: 0; }
        .pr-faq-chevron.open { transform: rotate(180deg); }
        .pr-faq-a { font-size: 13px; color: var(--muted); line-height: 1.65; padding: 0 20px; max-height: 0; overflow: hidden; transition: all 0.22s ease; }
        .pr-faq-a.open { padding: 12px 20px 16px; max-height: 200px; }

        /* Trust bar */
        .pr-trust { display: flex; justify-content: center; align-items: center; gap: 32px; flex-wrap: wrap; padding: 32px 24px; border-top: 1px solid var(--border); font-size: 13px; color: var(--hint); }
        .pr-trust-item { display: flex; align-items: center; gap: 7px; }
        .pr-trust-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--green); flex-shrink: 0; }
        .pr-trust a { color: var(--hint); text-decoration: underline; text-underline-offset: 3px; }
        .pr-trust a:hover { color: var(--muted); }
        .pr-usd-note { text-align: center; font-size: 12px; color: var(--hint); padding-bottom: 48px; }

        @media(max-width:860px){ .pr-tiers { grid-template-columns: repeat(2, 1fr); } }
        @media(max-width:480px){ .pr-tiers { grid-template-columns: 1fr; } }
        @media(max-width:480px){ .pr-social { gap: 24px; } }
      `}</style>

      <div className="pricing-root" dir={dir}>

        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <div className="pr-hero">
          <div className="pr-eyebrow">{t.eyebrow}</div>
          <h1 className="pr-h1">{t.hero_title}</h1>
          <p className="pr-sub">{t.hero_sub}</p>
        </div>

        {/* ── Social proof ─────────────────────────────────────────────── */}
        <div className="pr-social">
          {SOCIAL_PROOF.map(({ value, labelKey }) => (
            <div className="pr-social-item" key={labelKey}>
              <div className="pr-social-value">{value}</div>
              <div className="pr-social-label">{t[labelKey]}</div>
            </div>
          ))}
        </div>

        {/* ── Value anchor ─────────────────────────────────────────────── */}
        <div className="pr-anchor">
          <div className="pr-anchor-box">
            <div className="pr-anchor-headline">{t.value_anchor}</div>
            <div className="pr-anchor-body">{t.value_sub}</div>
          </div>
        </div>

        {/* ── Credit tiers ─────────────────────────────────────────────── */}
        <div className="pr-tiers">
          {CREDIT_TIERS.map((tier, idx) => {
            const nameKey   = `tier_${tier.id}_name`;
            const descKey   = `tier_${tier.id}_desc`;
            const uses      = t[tierUseKeys[idx]] || [];
            return (
              <div key={tier.id} className={`pr-tier${tier.popular ? ' popular' : ''}`}>
                {tier.popular && (
                  <span className="pr-tier-popular-badge">{t.popular_badge}</span>
                )}
                <div className="pr-tier-name">{t[nameKey]}</div>
                <div className="pr-tier-desc">{t[descKey]}</div>
                <div style={{ marginBottom: 6 }}>
                  <span className="pr-tier-credits">
                    {tier.credits}
                  </span>
                  <span className="pr-tier-credits-label">{t.credits_label}</span>
                </div>
                <div className="pr-tier-price">${tier.price}</div>
                <div className="pr-tier-per-credit">
                  ${tier.perCredit.toFixed(2)} {t.per_credit}
                </div>
                <div className={`pr-tier-savings${tier.savingsPct === 0 ? ' invisible' : ''}`}>
                  {t.save} {tier.savingsPct}%
                </div>
                <div className="pr-tier-divider" />
                <div className="pr-tier-uses">
                  {uses.map((u, i) => (
                    <div key={i} className="pr-tier-use-item">{u}</div>
                  ))}
                </div>
                <Link
                  href="/account/credits"
                  className="pr-tier-cta"
                >
                  {t.buy_cta}
                </Link>
              </div>
            );
          })}
        </div>

        <div className="pr-usd-note">{t.price_usd}</div>

        {/* ── What a credit unlocks ─────────────────────────────────────── */}
        <div className="pr-section">
          <h2 className="pr-section-title">{t.what_unlocks_title}</h2>
          <p className="pr-section-sub">{t.what_unlocks_sub}</p>
          <div className="pr-unlock-grid">
            {UNLOCK_EXAMPLES.map((ex) => (
              <div className="pr-unlock-card" key={ex.titleEn}>
                <div className="pr-unlock-icon">{ex.icon}</div>
                <div className="pr-unlock-title">{ex.titleEn}</div>
                <div className="pr-unlock-desc">{ex.descEn}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── How it works ─────────────────────────────────────────────── */}
        <div className="pr-section">
          <h2 className="pr-section-title">{t.how_title}</h2>
          <div className="pr-how-grid">
            {['step1','step2','step3'].map((s, i) => (
              <div className="pr-how-step" key={s}>
                <div className="pr-how-num">{i + 1}</div>
                <div className="pr-how-title">{t[`${s}_title`]}</div>
                <div className="pr-how-body">{t[`${s}_body`]}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── What is a credit ─────────────────────────────────────────── */}
        <div className="pr-section">
          <h2 className="pr-section-title">{t.credit_what}</h2>
          <p style={{ fontSize: 15, color: 'var(--muted)', lineHeight: 1.75 }}>
            {t.credit_what_body}
          </p>
        </div>

        {/* ── Why not subscription ─────────────────────────────────────── */}
        <div className="pr-why" style={{ marginLeft: 24, marginRight: 24 }}>
          <div className="pr-why-title">{t.why_not_sub_title}</div>
          <div className="pr-why-body">{t.why_not_sub_body}</div>
        </div>

        {/* ── FAQ ──────────────────────────────────────────────────────── */}
        <div className="pr-section">
          <h2 className="pr-section-title">{t.faq_title}</h2>
          <div className="pr-faq">
            {faq.map((item, i) => (
              <div className="pr-faq-item" key={i}>
                <button
                  className="pr-faq-q"
                  onClick={() => toggleFaq(i)}
                  aria-expanded={openFaq === i}
                >
                  {item.q}
                  <span className={`pr-faq-chevron${openFaq === i ? ' open' : ''}`}>▼</span>
                </button>
                <div className={`pr-faq-a${openFaq === i ? ' open' : ''}`}>
                  {item.a}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Trust bar ────────────────────────────────────────────────── */}
        <div className="pr-trust">
          <div className="pr-trust-item">
            <div className="pr-trust-dot" />
            {t.trust_secure}
          </div>
          <div className="pr-trust-item">
            <div className="pr-trust-dot" />
            {t.trust_valid}
          </div>
          <div className="pr-trust-item">
            <div className="pr-trust-dot" />
            {t.trust_worldwide}
          </div>
          <div className="pr-trust-item">
            <Link href="/refund-policy">{t.trust_refund}</Link>
          </div>
        </div>

      </div>
    </>
  );
}

/**
 * USAGE — Next.js App Router (src/app/(route)/pricing/page.jsx):
 *
 *   import translations from '@/i18n/pricing-translations.json';
 *   import PricingPage from '@/components/pages/PricingPage';
 *
 *   export default function Page({ params }) {
 *     return <PricingPage locale={params.locale} translations={translations} />;
 *   }
 *
 * USAGE — Pages Router (pages/pricing.jsx):
 *
 *   import { useRouter } from 'next/router';
 *   import translations from '../i18n/pricing-translations.json';
 *   import PricingPage from '../components/pages/PricingPage';
 *
 *   export default function Page() {
 *     const { locale } = useRouter();
 *     return <PricingPage locale={locale || 'en'} translations={translations} />;
 *   }
 */
