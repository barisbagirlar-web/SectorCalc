'use client'

import { Plan } from '@/lib/plans'
import { usePaddle } from '@/lib/paddle-provider'
import { IconListItem } from "@/components/icons/ScIcon"
import { UI_ICON } from "@/lib/icons/icon-registry"
import { useTranslations } from 'next-intl'

interface Props {
  plan: Plan
  email: string
  onEmailNeeded: () => void
  loading: boolean
  setLoading: (id: string | null) => void
}

export function PricingCard({ plan, email, onEmailNeeded, loading, setLoading }: Props) {
  const t = useTranslations('pricing_v2')
  const { ready, openCheckout } = usePaddle()

  const isFeatured = plan.badge === 'popular'
  const isEnterprise = plan.badge === 'team' || plan.badge === 'bestval'

  const cardClasses = `flex flex-col h-full relative sc-pro-pricing-card sc-pro-letterpress ${
    isFeatured ? "sc-pro-pricing-card--featured" :
    isEnterprise ? "sc-pro-pricing-card--enterprise" :
    "sc-pro-pricing-card--support"
  }`

  const btnClass = isFeatured ? "sc-cta-primary" : "sc-cta-secondary"

  function handleBuy() {
    if (!ready) {
      alert("Billing system is initializing or unavailable in this environment.");
      return;
    }
    if (!plan.paddlePriceId) {
      console.error("[SectorCalc] Critical Error: Paddle Price ID is undefined for plan:", plan.id);
      return;
    }
    if (!email) { onEmailNeeded(); return }
    setLoading(plan.id)
    openCheckout({
      items: [{ priceId: plan.paddlePriceId, quantity: 1 }],
      customer: { email },
      customData: { planId: plan.id, credits: String(plan.credits) },
      settings: {
        displayMode: 'overlay',
        theme: 'light',
      },
    })
    setTimeout(() => setLoading(null), 1500)
  }

  return (
    <article className={cardClasses}>
      {plan.badge !== 'none' && (
        <span className="sc-pro-pricing-card__badge">{plan.badgeText}</span>
      )}
      
      <div className="flex flex-col mb-2 mt-2">
        <h3 className="text-lg font-semibold text-premium-velvet mb-1">{plan.label}</h3>
        <p className="text-sm text-body-charcoal">
          {plan.credits} {plan.credits === 1 ? (t.has('card.credit') ? t('card.credit') : 'credit') : (t.has('card.credits') ? t('card.credits') : 'credits')}
        </p>
      </div>

      <div className="flex items-end gap-1 mb-1">
        <span className="sc-pro-pricing-card__price">${plan.price.toFixed(2)}</span>
        <span className="text-sm text-body-charcoal mb-2">USD</span>
      </div>
      
      <p className="text-sm text-body-charcoal mb-1">
        ${plan.perCredit.toFixed(2)} / {t.has('card.credit') ? t('card.credit') : 'credit'}
      </p>
      
      {plan.savingPct > 0 ? (
        <p className="text-sm font-semibold text-emerald-600 mb-4">
          {t.has('card.saveVsSingle') ? t('card.saveVsSingle', { pct: plan.savingPct }) : `Save ${plan.savingPct}%`}
        </p>
      ) : (
        <div className="mb-4 h-5" />
      )}

      <ul className="sc-pro-pricing-card__features space-y-2 flex-1 mb-6">
        {plan.features.map((feature, idx) => (
          <IconListItem
            key={idx}
            icon={UI_ICON.check}
            iconClassName="text-sc-navy"
            className="text-body-charcoal"
          >
            {t.has(`plans.${plan.id}.features.f${idx + 1}`) ? t(`plans.${plan.id}.features.f${idx + 1}`) : feature}
          </IconListItem>
        ))}
      </ul>

      <div className="sc-pro-pricing-card__cta mt-auto">
        <button
          onClick={handleBuy}
          disabled={loading === true}
          className={`${btnClass} w-full flex justify-center py-2.5 font-medium rounded-md transition-colors`}
        >
          {loading ? (t.has('card.opening') ? t('card.opening') : 'Opening...') : (t.has(`plans.${plan.id}.cta`) ? t(`plans.${plan.id}.cta`) : plan.cta)}
        </button>
      </div>
    </article>
  )
}
