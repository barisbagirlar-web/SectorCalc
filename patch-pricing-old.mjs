import fs from 'fs';

let content = fs.readFileSync('tmp_pricing_content_old.tsx', 'utf8');

content = content.replace(
  "import { useState, useCallback } from 'react'",
  "import { useState, useCallback } from 'react'\nimport { useTranslations, useFormatter } from 'next-intl'"
);

content = content.replace(
  "function TrustRow() {",
  "function TrustRow() {\n  const t = useTranslations('pricing_v2.trust')"
);
content = content.replace(
  "['🔒 Paddle secure checkout','🌍 200+ markets · auto tax','📄 PDF on every calculation','✅ 7-day guarantee','🔁 No auto-renew','💳 Card · PayPal · Apple Pay']",
  "[t('paddle'), t('markets'), t('pdf'), t('guarantee'), t('noAutoRenew'), t('cards')]"
);

content = content.replace(
  "function StatsBar() {",
  "function StatsBar() {\n  const t = useTranslations('pricing_v2.stats')"
);
content = content.replace(
  "[{num:'4,200+',label:'Engineers active'},{num:'18',label:'Industry sectors'},{num:'161',label:'Pro tools'},{num:'40+',label:'Countries'}]",
  "[{num:'4,200+',label:t('engineersActive')},{num:'18',label:t('sectors')},{num:'161',label:t('proTools')},{num:'40+',label:t('countries')}]"
);

content = content.replace(
  "function Guarantee() {",
  "function Guarantee() {\n  const t = useTranslations('pricing_v2.guarantee')"
);
content = content.replace(
  "7-day satisfaction guarantee",
  "{t('title')}"
);
content = content.replace(
  "If your first credit doesn&apos;t deliver a usable result, email us within 7 days &mdash; we&apos;ll restore it. No forms, no friction.",
  "{t('desc')}"
);

content = content.replace(
  "function Testimonial() {",
  "function Testimonial() {\n  const t = useTranslations('pricing_v2.testimonial')"
);
content = content.replace(
  "&ldquo;We replaced a €600/year software license with SectorCalc credits. Same results, a fraction of the cost.&rdquo;",
  "{t('quote')}"
);
content = content.replace(
  "— Production Manager, automotive supplier, Germany",
  "{t('author')}"
);

content = content.replace(
  "function UseCaseGrid() {",
  "function UseCaseGrid() {\n  const t = useTranslations('pricing_v2.useCases')"
);
content = content.replace(
  "    const cases = [\n      {tool:'OEE Calculator',output:'Availability, performance, quality breakdown with monthly loss estimate',sector:'Manufacturing'},\n      {tool:'Machine Hourly Rate',output:'Depreciation + energy + labor cost basis — ready for quoting',sector:'Costing'},\n      {tool:'Break-Even Analysis',output:'Fixed/variable cost model with sensitivity graph',sector:'Finance'},\n      {tool:'Scrap & Material Loss',output:'Annual cost of waste quantified and benchmarked',sector:'Quality'},\n      {tool:'NPV / IRR Calculator',output:'Investment memo with scenario comparison and decision matrix',sector:'Investment'},\n      {tool:'EOQ & Safety Stock',output:'Optimal order quantity with TCO comparison',sector:'Logistics'},\n    ]",
  "    const cases = [\n      {tool:t('oee'),output:t('oeeDesc'),sector:t('manufacturing')},\n      {tool:t('mhr'),output:t('mhrDesc'),sector:t('costing')},\n      {tool:t('breakeven'),output:t('breakevenDesc'),sector:t('finance')},\n      {tool:t('scrap'),output:t('scrapDesc'),sector:t('quality')},\n      {tool:t('npv'),output:t('npvDesc'),sector:t('investment')},\n      {tool:t('eoq'),output:t('eoqDesc'),sector:t('logistics')},\n    ]"
);
content = content.replace(
  "What 1 credit gets you",
  "{t('title')}"
);

content = content.replace(
  "function FAQ() {",
  "function FAQ() {\n  const t = useTranslations('pricing_v2.faq')"
);
content = content.replace(
  "    const faqs = [\n      {q:'Do credits expire?',a:'Credits are valid for 12 months from purchase. They never auto-renew.'},\n      {q:'Which payment methods are accepted?',a:'Visa, Mastercard, Amex, PayPal, Apple Pay, Google Pay via Paddle. Tax handled automatically for 200+ countries.'},\n      {q:'Can I get an invoice or pay by bank transfer?',a:'Yes — the 100-credit Enterprise pack supports invoice and PO billing. Email info@sectorcalc.com.'},\n      {q:'Can I share credits with my team?',a:'Department (30) and Enterprise (100) packs support team credit sharing. Email us after purchase to set up.'},\n      {q:'What is the 7-day guarantee?',a:\"If your first credit doesn't produce a usable result, email us within 7 days and we'll restore it.\"},\n      {q:\"What if the calculator I need isn't available?\",a:\"Submit a tool request — we build in priority order. Your credit is not consumed if the tool isn't live yet.\"},\n    ]",
  "    const faqs = [\n      {q:t('q1'),a:t('a1')},\n      {q:t('q2'),a:t('a2')},\n      {q:t('q3'),a:t('a3')},\n      {q:t('q4'),a:t('a4')},\n      {q:t('q5'),a:t('a5')},\n      {q:t('q6'),a:t('a6')},\n    ]"
);
content = content.replace(
  "Common questions",
  "{t('title')}"
);

content = content.replace(
  "export function PricingPageContent() {",
  "export function PricingPageContent() {\n  const t = useTranslations('pricing_v2')\n  const format = useFormatter()"
);
content = content.replace(
  "Industrial calculation platform",
  "{t('badgePlatform')}"
);
content = content.replace(
  "Pay only for what you calculate.<br className=\"hidden sm:block\"/> No subscription. No commitment.",
  "<span dangerouslySetInnerHTML={{ __html: t('titleBr').replace('<br/>', '<br class=\"hidden sm:block\"/>') }} />"
);
content = content.replace(
  "Engineers in 40+ countries use SectorCalc credits to get audit-ready results in minutes.",
  "{t('subtitle')}"
);

// We need to restore the testUserId logic from the new version into the old one's checkout call
content = content.replace(
  "        customData: { planId: pendingPlan.id, credits: String(pendingPlan.credits) },",
  "        customData: { planId: pendingPlan.id, credits: String(pendingPlan.credits), userId: \"ornek_kullanici_abc123\" },"
);
content = content.replace(
  "successUrl: typeof window !== 'undefined' ? `${window.location.origin}/account/credits?payment=success&credits=${pendingPlan.credits}` : '',",
  "successUrl: `${window.location.origin}/account/credits?payment=success&credits=${pendingPlan.credits}`,"
);


fs.writeFileSync('src/components/pricing/PricingPageContent.tsx', content);
