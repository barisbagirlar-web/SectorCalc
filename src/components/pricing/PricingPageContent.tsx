"use client";
/* eslint-disable react/no-unescaped-entities */

import { useState, useCallback } from 'react'
import { useFormatter } from '@/lib/i18n-stub'
import { PLANS, Plan } from '@/lib/features/plans'
import { usePaddle } from '@/lib/ui-shared/paddle-provider'
import { PricingCard } from '@/components/pricing/PricingCard'
import { EmailCaptureModal } from '@/components/pricing/EmailCaptureModal'
import { Container } from "@/components/ui/Container"
import Link from "next/link";

function TrustRow() {
  return (
    <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 mt-4 mb-12 text-xs text-slate-500 font-medium">
      {['Secure payments by Paddle', 'Global market coverage', 'PDF exports included', '7-Day Guarantee', 'No auto-renewal', 'All major cards accepted'].map((t) => <span key={t}>{t}</span>)}
    </div>
  )
}

function StatsBar() {
  return (
    <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 mb-10 text-center">
      {[{num:'4,200+',label:'Active Engineers'},{num:'18',label:'Sectors'},{num:'161',label:'Premium Analyzers'},{num:'40+',label:'Countries'}].map((s) => (
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
    <div className="mt-8 mb-10 sc-pro-pricing-card sc-pro-letterpress sc-pro-pricing-card--support p-5 max-w-xl mx-auto border-emerald-900 bg-emerald-950/40">
      <p className="text-sm font-semibold text-emerald-400 mb-1 text-center">7-Day No-Nonsense Guarantee</p>
      <p className="text-xs text-emerald-500 leading-relaxed text-left">
        If your first calculation doesn't yield a usable result, email us within 7 days. We'll restore your credit so you can use it on a tool that works for you.
      </p>
    </div>
  )
}

function Testimonial() {
  return (
    <blockquote className="mx-auto max-w-xl text-left mb-10">
      <p className="text-sm text-premium-velvet italic leading-relaxed">
        "SectorCalc turned a 4-hour spreadsheet battle into a 3-minute web form. The PDF export alone paid for the credits on the first day."
      </p>
      <cite className="mt-2 block text-xs text-body-charcoal not-italic">- Manufacturing Engineer, Tier 1 Automotive</cite>
    </blockquote>
  )
}

function UseCaseGrid() {
  const cases = [
    {tool:'OEE Calculator',output:'Availability, performance, quality breakdown with monthly loss estimate',sector:'Manufacturing'},
    {tool:'Machine Hourly Rate',output:'Depreciation + energy + labor cost basis - ready for quoting',sector:'Costing'},
    {tool:'Break-Even Analysis',output:'Fixed/variable cost model with sensitivity graph',sector:'Finance'},
    {tool:'Scrap & Material Loss',output:'Annual cost of waste quantified and benchmarked',sector:'Quality'},
    {tool:'NPV / IRR Calculator',output:'Investment memo with scenario comparison and decision matrix',sector:'Investment'},
    {tool:'EOQ & Safety Stock',output:'Optimal order quantity with TCO comparison',sector:'Logistics'},
  ]
  return (
    <section className="mt-12 mb-10">
      <p className="text-center text-xs font-semibold uppercase tracking-widest text-body-charcoal mb-5">COMMON USE CASES</p>
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
    {q:'Which payment methods are accepted?',a:'Visa, Mastercard, Amex, SharePal, Apple Share, Google Share via Paddle. Tax handled automatically for 200+ countries.'},
    {q:'Can I get an invoice or share by bank transfer?',a:'Yes - the 100-credit Enterprise pack supports invoice and PO billing. Email info@sectorcalc.com.'},
    {q:'Can I share credits with my team?',a:'Department (30) and Enterprise (100) packs support team credit sharing. Email us after purchase to set up.'},
    {q:'What is the 7-day guarantee?',a:"If your first credit doesn't produce a usable result, email us within 7 days and we'll restore it."},
    {q:"What if the calculator I need isn't available?",a:"Submit a tool request - we build in priority order. Your credit is not consumed if the tool isn't live yet."},
  ]
  return (
    <section className="mt-12 mb-10 max-w-2xl mx-auto">
      <p className="text-center text-xs font-semibold uppercase tracking-widest text-body-charcoal mb-6">Frequently Asked Questions</p>
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
      if (!pendingPlan.paddlePriceId) {
        console.error("[SectorCalc] Critical Error: Paddle Price ID is undefined for plan:", pendingPlan.id);
        setLoadingPlanId(null);
        return;
      }
      setLoadingPlanId(pendingPlan.id)
      openCheckout({
        items: [{ priceId: pendingPlan.paddlePriceId, quantity: 1 }],
        ...(resolvedEmail ? { customer: { email: resolvedEmail } } : {}),
        customData: { planId: pendingPlan.id, credits: String(pendingPlan.credits), userId: "sample_user_abc123" },
        settings: {
          displayMode: 'overlay',
          theme: 'light',
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
        <header className="text-center mb-12 flex flex-col items-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-4">INDUSTRIAL INTELLIGENCE PLATFORM</p>
          <h1 className="text-center mx-auto max-w-3xl font-bold text-3xl sm:text-4xl leading-snug mb-5 text-slate-900 tracking-tight">
            <span dangerouslySetInnerHTML={{ __html: 'Share only for what you calculate.<br class="hidden sm:block"/> No subscriptions.' }} />
          </h1>
          <p className="text-left text-lg text-slate-600 max-w-2xl mx-auto mb-8 leading-relaxed">
            Professional-grade calculation models and PDF exports. Buy credits once, use them whenever you need.
          </p>
        </header>
        <StatsBar />
        <TrustRow />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          {PLANS.map((plan) => (
            <PricingCard key={plan.id} plan={plan} email={email} onEmailNeeded={() => handleEmailNeeded(plan)} loading={loadingPlan === plan.id} setLoading={setLoadingPlanId} />
          ))}
        </div>
        <p className="text-left text-[11px] text-body-charcoal mb-2">
          All prices are in USD. Local taxes may apply based on your billing address. Payments securely processed by Paddle.
        </p>
        <Guarantee />
        <Testimonial />
        <UseCaseGrid />
        <FAQ />
        <footer className="text-center text-[11px] text-body-charcoal leading-7 border-t border-technical-gray pt-8 mt-4">
          © 2024 SectorCalc. All rights reserved.<br/>
          <a href="mailto:info@sectorcalc.com" className="hover:text-sc-navy">info@sectorcalc.com</a>
          {' · '}<Link href="/terms" className="hover:text-sc-navy">Terms of Service</Link>
          {' · '}<Link href="/privacy" className="hover:text-sc-navy">Privacy Policy</Link>
          {' · '}<Link href="/refund-policy" className="hover:text-sc-navy">Refund Policy</Link>
        </footer>
      </Container>
    </div>
  )
}
