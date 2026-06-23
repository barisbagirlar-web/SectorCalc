'use client'

import { Plan } from '@/lib/plans'
import { usePaddle } from '@/lib/paddle-provider'

interface Props {
  plan: Plan
  email: string
  onEmailNeeded: () => void
  loading: boolean
  setLoading: (id: string | null) => void
}

const BADGE: Record<string, string> = {
  none:    'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300',
  popular: 'bg-blue-50 text-blue-800 dark:bg-blue-950 dark:text-blue-300',
  bestval: 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
  team:    'bg-amber-50 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
}

const CTA: Record<string, string> = {
  default: 'border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800',
  popular: 'bg-blue-600 text-white hover:bg-blue-700 border border-blue-600',
  bestval: 'bg-emerald-600 text-white hover:bg-emerald-700 border border-emerald-600',
}

export function PricingCard({ plan, email, onEmailNeeded, loading, setLoading }: Props) {
  const { ready, openCheckout } = usePaddle()

  const ring = plan.badge === 'popular'
    ? 'ring-2 ring-blue-500'
    : plan.badge === 'bestval'
    ? 'ring-2 ring-emerald-500'
    : 'ring-1 ring-gray-200 dark:ring-gray-700'

  const ctaStyle = plan.badge === 'popular' ? CTA.popular
    : plan.badge === 'bestval' ? CTA.bestval
    : CTA.default

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
        successUrl: `${window.location.origin}/account/credits?payment=success&credits=${plan.credits}`,
      },
    })
    setTimeout(() => setLoading(null), 1500)
  }

  return (
    <div className={`relative flex flex-col rounded-2xl bg-white dark:bg-gray-900 p-5 ${ring} transition-shadow hover:shadow-md`}>
      <span className={`self-start text-[11px] font-semibold px-3 py-1 rounded-full mb-3 ${BADGE[plan.badge]}`}>
        {plan.badgeText}
      </span>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{plan.credits} credit{plan.credits > 1 ? 's' : ''}</p>
      <div className="flex items-end gap-1 mb-0.5">
        <span className="text-[32px] font-semibold leading-none text-gray-900 dark:text-gray-50">${plan.price.toFixed(2)}</span>
        <span className="text-sm text-gray-400 mb-1">USD</span>
      </div>
      <p className="text-xs text-gray-400 dark:text-gray-500 mb-1">${plan.perCredit.toFixed(2)} per calculation</p>
      {plan.savingPct > 0
        ? <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400 mb-4">Save {plan.savingPct}% vs single</p>
        : <div className="mb-4 h-4" />
      }
      <button
        onClick={handleBuy}
        disabled={loading || !ready}
        className={`w-full py-2.5 px-4 rounded-xl text-sm font-medium transition-colors disabled:opacity-60 ${ctaStyle}`}
      >
        {loading ? (
          <span className="inline-flex items-center justify-center gap-2">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
            </svg>
            Opening…
          </span>
        ) : plan.cta}
      </button>
      <ul className="mt-4 space-y-2 border-t border-gray-100 dark:border-gray-800 pt-4">
        {plan.features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-300">
            <svg className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-emerald-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
            </svg>
            {f}
          </li>
        ))}
      </ul>
    </div>
  )
}
