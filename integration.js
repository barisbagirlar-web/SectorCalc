/**
 * ═══════════════════════════════════════════════════════════════════════
 *  SECTORCALC REDESIGN — Integration Guide
 *  Files delivered:
 *    1. pricing-translations.json   — 6-language strings (EN/TR/DE/FR/ES/AR)
 *    2. PricingPage.jsx             — Conversion-optimised pricing page
 *    3. IndustriesPage.jsx          — Real sector hub (18 sectors, card grid)
 *    4. FreeToolsPage.jsx           — Search + filter + Pro upsell banners
 *    5. ProToolsPage.jsx            — English names + value prop + sector filter
 *    6. integration.js              — This file (routing + locale hook)
 * ═══════════════════════════════════════════════════════════════════════
 */

// ─── 1. Locale detection hook ────────────────────────────────────────────────
// Drop into: /src/hooks/useLocale.js

export function useLocale() {
  if (typeof window === 'undefined') return 'en';
  const path = window.location.pathname;
  const match = path.match(/^\/(tr|de|fr|es|ar)(\/|$)/);
  return match ? match[1] : 'en';
}

// ─── 2. App Router page wrappers ─────────────────────────────────────────────
// Drop each snippet into the matching file.

/*
── /app/[locale]/pricing/page.jsx ──────────────────────────────────────────────

import translations from '@/i18n/pricing-translations.json';
import PricingPage   from '@/components/pages/PricingPage';

export function generateStaticParams() {
  return ['en','tr','de','fr','es','ar'].map((locale) => ({ locale }));
}
export const metadata = {
  title: 'Pricing — SectorCalc Credits',
  description: 'Industrial-grade calculators. Pay only when you use them. Credits from $1.99.',
};
export default function Page({ params }) {
  return <PricingPage locale={params.locale} translations={translations} />;
}

── /app/[locale]/industries/page.jsx ───────────────────────────────────────────

import translations from '@/i18n/pricing-translations.json';
import IndustriesPage from '@/components/pages/IndustriesPage';

export const metadata = {
  title: 'Industries — SectorCalc',
  description: 'Manufacturing, construction, energy, logistics — industrial calculators for every sector.',
};
export default function Page({ params }) {
  return <IndustriesPage locale={params.locale} translations={translations} />;
}

── /app/[locale]/free-tools/page.jsx ───────────────────────────────────────────

import translations from '@/i18n/pricing-translations.json';
import FreeToolsPage  from '@/components/pages/FreeToolsPage';
// Import your tools from DB/API:
// import { getAllTools } from '@/lib/tools';

export default async function Page({ params }) {
  // const tools = await getAllTools(); // fetch from your database
  return <FreeToolsPage locale={params.locale} translations={translations} />;
}

── /app/[locale]/pro-tools/page.jsx ────────────────────────────────────────────

import translations from '@/i18n/pricing-translations.json';
import ProToolsPage   from '@/components/pages/ProToolsPage';

export const metadata = {
  title: 'Pro Calculators — SectorCalc',
  description: '161 professional industrial calculators. PDF reports. Industrial standards. From $1.99 per calculation.',
};
export default function Page({ params }) {
  return <ProToolsPage locale={params.locale} translations={translations} />;
}
*/

// ─── 3. Middleware — locale redirect ─────────────────────────────────────────
// Drop into: /middleware.js
// Detects Accept-Language and redirects to the right locale prefix.
// .com → /en (default, no prefix) | /tr | /de | /fr | /es | /ar

/*
import { NextResponse } from 'next/server';

const SUPPORTED_LOCALES = ['en', 'tr', 'de', 'fr', 'es', 'ar'];
const DEFAULT_LOCALE    = 'en';

// Maps Accept-Language substrings to supported locales
const LANG_MAP = {
  tr: 'tr',
  de: 'de',
  fr: 'fr',
  es: 'es',
  ar: 'ar',
  // All others → English
};

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Skip for API routes, static files, _next, etc.
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api')   ||
    pathname.startsWith('/static')||
    /\.(.*)$/.test(pathname)
  ) {
    return NextResponse.next();
  }

  // Already has a locale prefix → do nothing
  const hasLocale = SUPPORTED_LOCALES.some(
    (loc) => pathname.startsWith(`/${loc}/`) || pathname === `/${loc}`
  );
  if (hasLocale) return NextResponse.next();

  // Detect locale from Accept-Language header
  const acceptLang = request.headers.get('accept-language') || '';
  const detected   = acceptLang.split(',')[0].split('-')[0].toLowerCase();
  const locale     = LANG_MAP[detected] || DEFAULT_LOCALE;

  // English → no redirect (serve at root)
  if (locale === DEFAULT_LOCALE) return NextResponse.next();

  // Other locales → redirect to prefixed URL
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname}`;
  return NextResponse.redirect(url, 307);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
*/

// ─── 4. next.config.js i18n block (Pages Router) ────────────────────────────
// If you're on Pages Router instead of App Router:

/*
// next.config.js
module.exports = {
  i18n: {
    locales:       ['en', 'tr', 'de', 'fr', 'es', 'ar'],
    defaultLocale: 'en',
    localeDetection: true,   // uses Accept-Language
  },
};
*/

// ─── 5. Critical SEO metadata per locale ─────────────────────────────────────
// Add these to your generateMetadata() or <Head> per page.

export const PRICING_META = {
  en: { title: 'Pricing — SectorCalc Credits',         description: 'Industrial-grade calculators. Pay only when you use them. Credits from $1.99. No subscription.' },
  tr: { title: 'Fiyatlandırma — SectorCalc Kredileri', description: 'Endüstriyel hesap makineleri. Sadece kullandığında öde. $1.99\'dan kredi. Abonelik yok.' },
  de: { title: 'Preise — SectorCalc Credits',           description: 'Professionelle Industrierechner. Zahlen Sie nur für das, was Sie nutzen. Ab 1,99 USD. Kein Abo.' },
  fr: { title: 'Tarifs — Crédits SectorCalc',           description: 'Calculateurs industriels professionnels. Payez uniquement ce que vous utilisez. Dès 1,99 USD. Sans abonnement.' },
  es: { title: 'Precios — Créditos SectorCalc',         description: 'Calculadoras industriales profesionales. Paga solo lo que usas. Desde $1.99. Sin suscripción.' },
  ar: { title: 'الأسعار — أرصدة SectorCalc',            description: 'حاسبات صناعية احترافية. ادفع فقط مقابل ما تستخدمه. من $1.99. بدون اشتراك.' },
};

// ─── 6. Revenue instrumentation — analytics events ───────────────────────────
// Add these calls inside PricingPage.jsx CTAs for full funnel tracking.

/*
// Tier viewed
analytics.track('pricing_tier_viewed', {
  tier_id: tier.id,
  credits: tier.credits,
  price: tier.price,
  locale,
});

// CTA clicked
analytics.track('pricing_cta_clicked', {
  tier_id: tier.id,
  credits: tier.credits,
  price: tier.price,
  locale,
  source: 'pricing_page',
});

// Free tool → Pro upsell banner click
analytics.track('pro_upsell_clicked', {
  banner_position: 'free_tools_grid',
  locale,
});
*/

// ─── 7. Tool name migration — Turkish → English ───────────────────────────────
// The ProToolsPage.jsx contains the full English name map (85+ tools).
// To update your database:
//
//   1. Export PRO_TOOLS_EN from ProToolsPage.jsx
//   2. Match slug → your DB tool record
//   3. Set `display_name_en` field
//   4. The page renders display_name_en; slug/URL stays unchanged
//
// This preserves existing URLs (no 404s), fixes the global trust issue.
