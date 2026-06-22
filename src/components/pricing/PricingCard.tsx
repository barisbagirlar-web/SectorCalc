'use client'

import { Plan } from '@/lib/plans'
import { usePaddle } from '@/lib/paddle-provider'
import { IconListItem } from "@/components/icons/ScIcon"
import { UI_ICON } from "@/lib/icons/icon-registry"

interface Props {
  plan: Plan
  email: string
  onEmailNeeded: () => void
  loading: boolean
  setLoading: (id: string | null) => void
}

export function PricingCard({ plan, email, onEmailNeeded, loading, setLoading }: Props) {
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
    if (!ready || !plan.paddlePriceId) return
    if (!email) { onEmailNeeded(); return }
    setLoading(plan.id)
    openCheckout({
      items: [{ priceId: plan.paddlePriceId, quantity: 1 }],
      customer: { email },
      customData: { planId: plan.id, credits: String(plan.credits) },
      settings: {
        displayMode: 'overlay',
        theme: 'light',
        successUrl: typeof window !== 'undefined' ? `${window.location.origin}/account/credits?payment=success&credits=${plan.credits}` : '',
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
          {plan.credits} calculation{plan.credits > 1 ? 's' : ''}
        </p>
      </div>

      <div className="flex items-end gap-1 mb-1">
        <span className="sc-pro-pricing-card__price">${plan.price.toFixed(2)}</span>
        <span className="text-sm text-body-charcoal mb-2">USD</span>
      </div>
      
      <p className="text-sm text-body-charcoal mb-1">
        ${plan.perCredit.toFixed(2)} per calculation
      </p>
      
      {plan.savingPct > 0 ? (
        <p className="text-sm font-semibold text-emerald-600 mb-4">
          Save {plan.savingPct}% vs single
        </p>
      ) : (
        <div className="mb-4 h-5" />
      )}

      <ul className="sc-pro-pricing-card__features space-y-2 flex-1 mb-6">
        {plan.features.map((f) => (
          <IconListItem
            key={f}
            icon={UI_ICON.check}
            iconClassName="text-sc-navy"
            className="text-body-charcoal"
          >
            {f}
          </IconListItem>
        ))}
      </ul>

      <div className="sc-pro-pricing-card__cta mt-auto">
        <button
          onClick={handleBuy}
          disabled={loading === true || !ready}
          className={`${btnClass} w-full flex justify-center py-2.5 font-medium rounded-md transition-colors`}
        >
          {loading ? "Opening..." : plan.cta}
        </button>
      </div>
    </article>
  )
}
