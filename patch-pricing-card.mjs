import fs from 'fs';

let content = fs.readFileSync('src/components/pricing/PricingCard.tsx', 'utf8');

if (!content.includes('useTranslations')) {
  content = content.replace(
    "import { usePaddle } from '@/lib/paddle-provider'",
    "import { usePaddle } from '@/lib/paddle-provider'\nimport { useTranslations } from 'next-intl'"
  );
}

content = content.replace(
  "export function PricingCard({ plan, email, onEmailNeeded, loading, setLoading }: Props) {",
  "export function PricingCard({ plan, email, onEmailNeeded, loading, setLoading }: Props) {\n  const t = useTranslations('pricing_v2')"
);

content = content.replace(
  "{plan.badgeText}",
  "{t(`plans.${plan.id}.badgeText`)}"
);

content = content.replace(
  "{plan.credits} credit{plan.credits > 1 ? 's' : ''}",
  "{plan.credits} {plan.credits > 1 ? t('card.credits') : t('card.credit')}"
);

content = content.replace(
  "${plan.perCredit.toFixed(2)} per calculation",
  "${plan.perCredit.toFixed(2)} {t('card.perCalculation')}"
);

content = content.replace(
  "Save {plan.savingPct}% vs single",
  "{t('card.saveVsSingle', { pct: plan.savingPct })}"
);

content = content.replace(
  "Opening…",
  "{t('card.opening')}"
);

content = content.replace(
  " : plan.cta}",
  " : t(`plans.${plan.id}.cta`)}"
);

// For features, plan.features is an array of strings in plans.ts.
// But we want to use t(`plans.${plan.id}.features.f1`), etc.
// Instead of mapping over plan.features which are english strings,
// we can map over an index:
content = content.replace(
  "{plan.features.map((f) => (",
  "{plan.features.map((_, idx) => (\n          <li key={idx} className=\"flex items-start gap-2 text-xs text-gray-600 dark:text-gray-300\">\n            <svg className=\"mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-emerald-500\" viewBox=\"0 0 20 20\" fill=\"currentColor\">\n              <path fillRule=\"evenodd\" d=\"M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z\" clipRule=\"evenodd\"/>\n            </svg>\n            {t(`plans.${plan.id}.features.f${idx + 1}`)}\n          </li>\n        ))}\n        {/*"
);
content = content.replace(
  "          </li>\n        ))}",
  " */}"
);

fs.writeFileSync('src/components/pricing/PricingCard.tsx', content);
