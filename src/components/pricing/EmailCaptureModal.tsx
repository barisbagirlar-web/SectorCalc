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
      <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-gray-900 p-6 shadow-xl">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-base font-semibold text-gray-900 dark:text-gray-50">Where should we send your PDF?</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">We&apos;ll email your calculation report after purchase.</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none ml-3" aria-label="Close dialog">×</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            ref={inputRef}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            autoComplete="email"
            className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2.5 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button type="submit" className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2.5 transition-colors">
            Continue to payment →
          </button>
          <button type="button" onClick={onSkip} className="w-full text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 py-1 transition-colors">
            Skip - I don&apos;t need an email receipt
          </button>
        </form>
        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-center gap-4 text-xs text-gray-400">
          <span>🔒 Paddle secure</span><span>·</span><span>No auto-renew</span><span>·</span><span>7-day guarantee</span>
        </div>
      </div>
    </div>
  )
}
