import fs from 'fs';

let content = fs.readFileSync('tmp_pricing_card_old.tsx', 'utf8');

content = content.replace(
  "import { UI_ICON } from \"@/lib/icons/icon-registry\"",
  "import { UI_ICON } from \"@/lib/icons/icon-registry\"\nimport { useTranslations } from 'next-intl'"
);

content = content.replace(
  "export function PricingCard({ plan, email, onEmailNeeded, loading, setLoading }: Props) {",
  "export function PricingCard({ plan, email, onEmailNeeded, loading, setLoading }: Props) {\n  const t = useTranslations('pricing_v2')"
);

content = content.replace(
  "        <h3 className=\"text-lg font-semibold text-premium-velvet mb-1\">{plan.label}</h3>\n        <p className=\"text-sm text-body-charcoal\">\n          {plan.credits} calculation{plan.credits > 1 ? 's' : ''}\n        </p>",
  "        <h3 className=\"text-lg font-semibold text-premium-velvet mb-1\">{t(`plans.${plan.id}.name`)}</h3>\n        <p className=\"text-sm text-body-charcoal\">\n          {t('card.calculationCredits', { count: plan.credits })}\n        </p>"
);

content = content.replace(
  "        <span className=\"text-sm text-body-charcoal mb-2\">USD</span>",
  "        <span className=\"text-sm text-body-charcoal mb-2\">{t('card.currency')}</span>"
);

content = content.replace(
  "        ${plan.perCredit.toFixed(2)} per calculation",
  "        {t('card.perCredit', { price: plan.perCredit.toFixed(2), currency: '$' })}"
);

content = content.replace(
  "        <p className=\"text-sm font-semibold text-emerald-600 mb-4\">\n          Save {plan.savingPct}% vs single\n        </p>",
  "        <p className=\"text-sm font-semibold text-emerald-600 mb-4\">\n          {t('card.saveVsSingle', { pct: plan.savingPct })}\n        </p>"
);

content = content.replace(
  "          <IconListItem\n            key={f}\n            icon={UI_ICON.check}\n            iconClassName=\"text-sc-navy\"\n            className=\"text-body-charcoal\"\n          >\n            {f}\n          </IconListItem>",
  "          <IconListItem\n            key={idx}\n            icon={UI_ICON.check}\n            iconClassName=\"text-sc-navy\"\n            className=\"text-body-charcoal\"\n          >\n            {t(`plans.${plan.id}.features.f${idx + 1}`)}\n          </IconListItem>"
);
content = content.replace(
  "        {plan.features.map((f) => (",
  "        {plan.features.map((_, idx) => ("
);

content = content.replace(
  "          {loading ? \"Opening...\" : plan.cta}",
  "          {loading ? t('card.loading') : t(`plans.${plan.id}.cta`)}"
);

fs.writeFileSync('src/components/pricing/PricingCard.tsx', content);
