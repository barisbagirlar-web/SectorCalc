'use client'

import { createContext, useContext, useEffect, useRef, useState, ReactNode } from 'react'

type PaddleInstance = {
  Checkout: { open: (opts: PaddleCheckoutOptions) => void }
  Environment: { set: (env: 'sandbox' | 'production') => void }
  Setup: (opts: { token: string; eventCallback?: (e: PaddleEvent) => void }) => void
}

export interface PaddleCheckoutOptions {
  items: Array<{ priceId: string; quantity: number }>
  customer?: { email?: string }
  customData?: Record<string, string>
  settings?: {
    displayMode?: 'overlay' | 'inline'
    theme?: 'light' | 'dark'
    locale?: string
    successUrl?: string
    frameTarget?: string
    frameStyle?: string
    frameInitialHeight?: number
  }
}

interface PaddleEvent {
  name: string
  data?: Record<string, unknown>
}

interface PaddleContextValue {
  ready: boolean
  openCheckout: (opts: PaddleCheckoutOptions) => void
}

const PaddleContext = createContext<PaddleContextValue>({
  ready: false,
  openCheckout: () => {},
})

export function PaddleProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false)
  const paddleRef = useRef<PaddleInstance | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if ((window as any).Paddle) { initPaddle(); return }
    const script = document.createElement('script')
    script.src = 'https://cdn.paddle.com/paddle/v2/paddle.js'
    script.async = true
    script.onload = initPaddle
    document.head.appendChild(script)
  }, [])

  function initPaddle() {
    const Paddle = (window as any).Paddle as PaddleInstance
    if (!Paddle) return
    const env = process.env.NEXT_PUBLIC_PADDLE_ENV as 'sandbox' | 'production'
    if (env === 'sandbox') Paddle.Environment.set('sandbox')
    Paddle.Setup({
      token: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN ?? '',
      eventCallback: (e: PaddleEvent) => {
        if (e.name === 'checkout.completed') console.log('[Paddle] checkout completed', e.data)
      },
    })
    paddleRef.current = Paddle
    setReady(true)
  }

  function openCheckout(opts: PaddleCheckoutOptions) {
    if (!paddleRef.current) return
    paddleRef.current.Checkout.open(opts)
  }

  return (
    <PaddleContext.Provider value={{ ready, openCheckout }}>
      {children}
    </PaddleContext.Provider>
  )
}

export function usePaddle() {
  return useContext(PaddleContext)
}
