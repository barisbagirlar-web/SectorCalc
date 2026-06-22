'use client'

import { useEffect, useRef } from 'react'

interface Props {
  open: boolean
  onClose: () => void
  onSubmit: (email: string) => void
  onSkip: () => void
  email: string
  setEmail: (v: string) => void
}

export function EmailCaptureModal({ open, onClose, onSubmit, onSkip, email, setEmail }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 80)
  }, [open])

  if (!open) return null

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onSubmit(email.trim())
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="w-full max-w-sm sc-pro-pricing-card sc-pro-letterpress p-6 shadow-xl border border-technical-gray bg-white relative">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-base font-semibold text-premium-velvet">Where should we send your PDF?</h2>
            <p className="text-sm text-body-charcoal mt-1">We&apos;ll email your calculation report after purchase.</p>
          </div>
          <button onClick={onClose} className="text-body-charcoal hover:text-sc-navy text-xl leading-none ml-3" aria-label="Close">×</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            ref={inputRef}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            autoComplete="email"
            className="w-full border border-technical-gray bg-industrial-matte px-4 py-2.5 text-sm text-premium-velvet placeholder-body-charcoal focus:outline-none focus:ring-2 focus:ring-sc-navy rounded-none"
          />
          <button type="submit" className="sc-cta-primary w-full py-2.5 flex justify-center">
            Continue to payment →
          </button>
          <button type="button" onClick={onSkip} className="w-full text-xs text-body-charcoal hover:text-premium-velvet transition-colors mt-2 flex justify-center">
            Skip &mdash; I don&apos;t need an email receipt
          </button>
        </form>
        <div className="mt-5 pt-4 border-t border-technical-gray flex justify-center gap-4 text-[11px] text-body-charcoal">
          <span>🔒 Paddle secure</span><span>·</span><span>No auto-renew</span><span>·</span><span>7-day guarantee</span>
        </div>
      </div>
    </div>
  )
}
