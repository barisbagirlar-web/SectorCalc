'use client'

import { useState, useCallback } from 'react'
import { PLANS, Plan } from '@/lib/plans'
import { usePaddle } from '@/lib/paddle-provider'
import { PricingCard } from '@/components/pricing/PricingCard'
import { EmailCaptureModal } from '@/components/pricing/EmailCaptureModal'
import { Container } from "@/components/ui/Container"

function TrustRow() {
  return (
    <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 mb-10 text-[11px] text-body-charcoal">
      {['🔒 Paddle secure checkout','🌍 200+ markets · auto tax','📄 PDF on every calculation','✅ 7-day guarantee','🔁 No auto-renew','💳 Card · PayPal · Apple Pay'].map((t) => <span key={t}>{t}</span>)}
    </div>
  )
}

function StatsBar() {
  return (
    <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 mb-10 text-center">
      {[{num:'4,200+',label:'Engineers active'},{num:'18',label:'Industry sectors'},{num:'161',label:'Pro tools'},{num:'40+',label:'Countries'}].map((s) => (
        <div key={s.label}>
          <p className="text-xl font-semibold text-premium-velvet">{s.num}</p>
          <p className="text-xs text-body-charcoal">{s.label}</p>
        </div>
      ))}
    </div>
  )
}

function Guarantee() {
  return (
    <div className="mt-8 mb-10 sc-pro-pricing-card sc-pro-letterpress sc-pro-pricing-card--support p-5 text-center max-w-xl mx-auto border-emerald-900 bg-emerald-950/40">
      <p className="text-sm font-semibold text-emerald-400 mb-1">7-day satisfaction guarantee</p>
      <p className="text-xs text-emerald-500 leading-relaxed">
        If your first credit doesn&apos;t deliver a usable result, email us within 7 days &mdash; we&apos;ll restore it. No forms, no friction.
      </p>
    </div>
  )
}

function Testimonial() {
  return (
    <blockquote className="mx-auto max-w-xl text-center mb-10">
      <p className="text-sm text-premium-velvet italic leading-relaxed">
        &ldquo;We replaced a €600/year software license with SectorCalc credits. Same results, a fraction of the cost.&rdquo;
      </p>
      <cite className="mt-2 block text-xs text-body-charcoal not-italic">— Production Manager, automotive supplier, Germany</cite>
    </blockquote>
  )
}

function UseCaseGrid() {
  const cases = [
    {tool:'OEE Calculator',output:'Availability, performance, quality breakdown with monthly loss estimate',sector:'Manufacturing'},
    {tool:'Machine Hourly Rate',output:'Depreciation + energy + labor cost basis — ready for quoting',sector:'Costing'},
    {tool:'Break-Even Analysis',output:'Fixed/variable cost model with sensitivity graph',sector:'Finance'},
    {tool:'Scrap & Material Loss',output:'Annual cost of waste quantified and benchmarked',sector:'Quality'},
    {tool:'NPV / IRR Calculator',output:'Investment memo with scenario comparison and decision matrix',sector:'Investment'},
    {tool:'EOQ & Safety Stock',output:'Optimal order quantity with TCO comparison',sector:'Logistics'},
  ]
  return (
    <section className="mt-12 mb-10">
      <p className="text-center text-xs font-semibold uppercase tracking-widest text-body-charcoal mb-5">What 1 credit gets you</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {cases.map((c) => (
          <div key={c.tool} className="sc-pro-pricing-card p-4 border border-technical-gray bg-industrial-matte">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-sc-navy mb-1 block">{c.sector}</span>
            <p className="text-sm font-medium text-premium-velvet mb-1.5">{c.tool}</p>
            <p className="text-xs text-body-charcoal leading-relaxed">{c.output}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

function FAQ() {
  const [open, setOpen] = useState<number | null>(null)
  const faqs = [
    {q:'Do credits expire?',a:'Credits are valid for 12 months from purchase. They never auto-renew.'},
    {q:'Which payment methods are accepted?',a:'Visa, Mastercard, Amex, PayPal, Apple Pay, Google Pay via Paddle. Tax handled automatically for 200+ countries.'},
    {q:'Can I get an invoice or pay by bank transfer?',a:'Yes — the 100-credit Enterprise pack supports invoice and PO billing. Email info@sectorcalc.com.'},
    {q:'Can I share credits with my team?',a:'Department (30) and Enterprise (100) packs support team credit sharing. Email us after purchase to set up.'},
    {q:'What is the 7-day guarantee?',a:"If your first credit doesn't produce a usable result, email us within 7 days and we'll restore it."},
    {q:"What if the calculator I need isn't available?",a:"Submit a tool request — we build in priority order. Your credit is not consumed if the tool isn't live yet."},
  ]
  return (
    <section className="mt-12 mb-10 max-w-2xl mx-auto">
      <p className="text-center text-xs font-semibold uppercase tracking-widest text-body-charcoal mb-6">Common questions</p>
      <div className="divide-y divide-technical-gray">
        {faqs.map((f, i) => (
          <div key={i}>
            <button className="w-full flex justify-between items-center py-4 text-left gap-4 group" onClick={() => setOpen(open === i ? null : i)}>
              <span className="text-sm font-medium text-premium-velvet group-hover:text-sc-navy transition-colors">{f.q}</span>
              <svg className={`flex-shrink-0 h-4 w-4 text-body-charcoal transition-transform ${open === i ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"/>
              </svg>
            </button>
            {open === i && <p className="pb-4 text-sm text-body-charcoal leading-relaxed">{f.a}</p>}
          </div>
        ))}
      </div>
    </section>
  )
}

export function PricingPageContent() {
  const { openCheckout } = usePaddle()
  const [email, setEmail] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [pendingPlan, setPendingPlan] = useState<Plan | null>(null)
  const [loadingPlan, setLoadingPlanId] = useState<string | null>(null)

  const handleEmailNeeded = useCallback((plan: Plan) => {
    setPendingPlan(plan)
    setModalOpen(true)
  }, [])

  const handleEmailSubmit = useCallback((submittedEmail: string) => {
    const resolvedEmail = submittedEmail.trim()
    setEmail(resolvedEmail)
    setModalOpen(false)
    if (resolvedEmail) {
      fetch('/api/email-capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resolvedEmail, planId: pendingPlan?.id, source: 'pricing_page' }),
      }).catch(() => {})
    }
    if (pendingPlan) {
      setLoadingPlanId(pendingPlan.id)
      openCheckout({
        items: [{ priceId: pendingPlan.paddlePriceId, quantity: 1 }],
        ...(resolvedEmail ? { customer: { email: resolvedEmail } } : {}),
        customData: { planId: pendingPlan.id, credits: String(pendingPlan.credits) },
        settings: {
          displayMode: 'overlay',
          theme: 'light',
          successUrl: typeof window !== 'undefined' ? `${window.location.origin}/account/credits?payment=success&credits=${pendingPlan.credits}` : '',
        },
      })
      setTimeout(() => setLoadingPlanId(null), 1500)
    }
    setPendingPlan(null)
  }, [pendingPlan, openCheckout])

  return (
    <div className="sc-pro-section sc-pro-section--alt">
      <EmailCaptureModal open={modalOpen} onClose={() => setModalOpen(false)} onSubmit={handleEmailSubmit} onSkip={() => handleEmailSubmit('')} email={email} setEmail={setEmail} />
      <Container className="sc-pro-container pb-10">
        <header className="text-center mb-10">
          <p className="sc-pro-eyebrow">Industrial calculation platform</p>
          <h1 className="sc-pro-title sc-pro-title--compact mb-4">
            Pay only for what you calculate.<br className="hidden sm:block"/> No subscription. No commitment.
          </h1>
          <p className="sc-pro-lead mx-auto mb-4">
            Engineers in 40+ countries use SectorCalc credits to get audit-ready results in minutes.
          </p>
        </header>
        <StatsBar />
        <TrustRow />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          {PLANS.map((plan) => (
            <PricingCard key={plan.id} plan={plan} email={email} onEmailNeeded={() => handleEmailNeeded(plan)} loading={loadingPlan === plan.id} setLoading={setLoadingPlanId} />
          ))}
        </div>
        <p className="text-center text-[11px] text-body-charcoal mb-2">
          Prices in USD · Paddle localizes currency at checkout · Tax included · Credits valid 12 months
        </p>
        <Guarantee />
        <Testimonial />
        <UseCaseGrid />
        <FAQ />
      </Container>
    </div>
  )
}
