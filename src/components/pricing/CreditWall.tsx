'use client'

import { useState } from 'react'
import { usePaddle } from '@/lib/paddle-provider'
import { PLANS } from '@/lib/plans'

interface Props {
  toolName: string
  hasFreeMode?: boolean
  onFreeMode?: () => void
}

export function CreditWall({ toolName, hasFreeMode, onFreeMode }: Props) {
  const { ready, openCheckout } = usePaddle()
  const [email, setEmail] = useState('')
  const [emailSaved, setEmailSaved] = useState(false)
  const [loading, setLoading] = useState(false)

  const recommended = PLANS.find((p) => p.id === 'popular')!
  const starter = PLANS.find((p) => p.id === 'starter')!

  function triggerCheckout(plan: typeof PLANS[0], resolvedEmail?: string) {
    if (!ready || !plan.paddlePriceId) return
    setLoading(true)
    openCheckout({
      items: [{ priceId: plan.paddlePriceId, quantity: 1 }],
      ...(resolvedEmail ? { customer: { email: resolvedEmail } } : {}),
      customData: { planId: plan.id, credits: String(plan.credits), source: 'credit_wall', toolName },
      settings: {
        displayMode: 'overlay',
        theme: 'light',
        successUrl: typeof window !== 'undefined' ? `${window.location.origin}/account/credits?payment=success&credits=${plan.credits}` : '',
      },
    })
    setTimeout(() => setLoading(false), 1500)
  }

  function handleEmailSubmit(e: React.FormEvent, plan: typeof PLANS[0]) {
    e.preventDefault()
    const resolved = email.trim()
    if (!resolved) return
    setEmailSaved(true)
    fetch('/api/email-capture', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: resolved, planId: plan.id, source: `wall:${toolName}` }),
    }).catch(() => {})
    triggerCheckout(plan, resolved)
  }

  return (
    <div className="sc-pro-pricing-card sc-pro-letterpress sc-pro-pricing-card--support max-w-sm mx-auto my-8 p-6 text-center">
      <div className="inline-flex h-12 w-12 items-center justify-center bg-industrial-matte mb-4 border border-technical-gray">
        <svg className="h-5 w-5 text-sc-navy" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/>
        </svg>
      </div>
      <h2 className="text-base font-semibold text-premium-velvet mb-1">{toolName} is a Pro tool</h2>
      <p className="text-sm text-body-charcoal mb-5 leading-relaxed">
        1 credit unlocks the full calculation + PDF report.<br/>Credits valid 12 months. No auto-renew.
      </p>
      <button
        onClick={() => triggerCheckout(recommended)}
        disabled={loading || !ready}
        className="sc-cta-primary w-full py-2.5 mb-1.5 flex justify-center disabled:opacity-60"
      >
        {loading ? 'Opening checkout…' : `Get ${recommended.credits} credits · $${recommended.price.toFixed(2)}`}
      </button>
      <p className="text-xs text-sc-navy font-semibold mb-3">Save {recommended.savingPct}% vs single · most popular</p>
      <button
        onClick={() => triggerCheckout(starter)}
        disabled={loading || !ready}
        className="sc-cta-secondary w-full py-2 mb-5 flex justify-center disabled:opacity-60"
      >
        Or buy 1 credit · ${starter.price.toFixed(2)}
      </button>
      {!emailSaved ? (
        <form onSubmit={(e) => handleEmailSubmit(e, recommended)} className="mb-3">
          <p className="text-xs text-body-charcoal mb-2">Not ready yet? Get a reminder →</p>
          <div className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="flex-1 min-w-0 border border-technical-gray bg-white px-3 py-2 text-sm text-premium-velvet placeholder-body-charcoal focus:outline-none focus:ring-2 focus:ring-sc-navy rounded-none"
            />
            <button type="submit" className="sc-cta-secondary px-3 py-2 text-sm whitespace-nowrap">
              Save
            </button>
          </div>
        </form>
      ) : (
        <p className="text-xs text-sc-navy font-semibold mb-3">✓ Saved &mdash; we&apos;ll follow up if you don&apos;t complete checkout.</p>
      )}
      {hasFreeMode && onFreeMode && (
        <button onClick={onFreeMode} className="text-xs text-body-charcoal hover:text-sc-navy transition-colors">
          Try basic (free) mode instead →
        </button>
      )}
      <p className="mt-4 text-[11px] text-body-charcoal opacity-80">🔒 Paddle · Tax auto-handled · No auto-renew · 7-day guarantee</p>
    </div>
  )
}
