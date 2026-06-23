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
        successUrl: `${window.location.origin}/account/credits?payment=success&credits=${plan.credits}`,
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
    <div className="rounded-2xl border border-blue-100 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/40 p-6 text-center max-w-sm mx-auto my-8">
      <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900 mb-4">
        <svg className="h-5 w-5 text-blue-600 dark:text-blue-300" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/>
        </svg>
      </div>
      <h2 className="text-base font-semibold text-gray-900 dark:text-gray-50 mb-1">{toolName} is a Pro tool</h2>
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-5 leading-relaxed">
        1 credit unlocks the full calculation + PDF report.<br/>Credits valid 12 months. No auto-renew.
      </p>
      <button
        onClick={() => triggerCheckout(recommended)}
        disabled={loading || !ready}
        className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2.5 mb-1.5 transition-colors disabled:opacity-60"
      >
        {loading ? 'Opening checkout…' : `Get ${recommended.credits} credits · $${recommended.price.toFixed(2)}`}
      </button>
      <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mb-3">Save {recommended.savingPct}% vs single · most popular</p>
      <button
        onClick={() => triggerCheckout(starter)}
        disabled={loading || !ready}
        className="w-full rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 text-sm py-2 mb-5 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-60"
      >
        Or buy 1 credit · ${starter.price.toFixed(2)}
      </button>
      {!emailSaved ? (
        <form onSubmit={(e) => handleEmailSubmit(e, recommended)} className="mb-3">
          <p className="text-[11px] text-gray-400 dark:text-gray-500 mb-2">Not ready yet? Get a reminder →</p>
          <div className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="flex-1 min-w-0 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-xs text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button type="submit" className="rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 text-xs font-medium px-3 py-2 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
              Save
            </button>
          </div>
        </form>
      ) : (
        <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mb-3">✓ Saved — we'll follow up if you don't complete checkout.</p>
      )}
      {hasFreeMode && onFreeMode && (
        <button onClick={onFreeMode} className="text-[11px] text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
          Try basic (free) mode instead →
        </button>
      )}
      <p className="mt-4 text-[10px] text-gray-300 dark:text-gray-600">🔒 Paddle · Tax auto-handled · No auto-renew · 7-day guarantee</p>
    </div>
  )
}
