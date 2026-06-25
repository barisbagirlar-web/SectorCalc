'use client'

import { createContext, useContext, useEffect, useRef, useState, ReactNode } from 'react'

type PaddleInstance = {
  Checkout: { open: (opts: PaddleCheckoutOptions) => void }
  Environment: { set: (env: 'sandbox' | 'production') => void }
  Initialize: (opts: { token: string; environment?: string; eventCallback?: (e: PaddleEvent) => void }) => Promise<void>
  Setup?: (opts: { vendor?: number; token?: string; eventCallback?: (e: PaddleEvent) => void }) => void
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
    try {
      const Paddle = (window as any).Paddle as PaddleInstance
      if (!Paddle) return
      
      const env = (process.env.NEXT_PUBLIC_PADDLE_ENV || 'sandbox') as 'sandbox' | 'production'
      
      const token = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN || 'test_6380be7c84b551e3fcd08d55d7e';
      const eventCallback = (e: PaddleEvent) => {
        if (e.name === 'checkout.completed') console.log('[Paddle] checkout completed', e.data)
      };

      if (typeof Paddle.Initialize === 'function') {
        if (typeof Paddle.Environment?.set === 'function') {
          Paddle.Environment.set(env)
        }
        Paddle.Initialize({
          token,
          eventCallback,
        }).then(() => {
          paddleRef.current = Paddle
          setReady(true)
        }).catch(err => {
          console.error('[PaddleProvider] Initialize promise rejected:', err)
        })
      } else if (typeof Paddle.Setup === 'function') {
        if (env === 'sandbox' && typeof Paddle.Environment?.set === 'function') {
          Paddle.Environment.set('sandbox')
        }
        Paddle.Setup({ token, eventCallback })
        paddleRef.current = Paddle
        setReady(true)
      }
    } catch (error) {
      console.error('[PaddleProvider] Initialization failed:', error)
      // Fail gracefully, ready stays false
    }
  }

  function openCheckout(opts: PaddleCheckoutOptions) {
    try {
      if (!paddleRef.current) {
        console.warn('[PaddleProvider] Checkout called before Paddle was ready.')
        return
      }
      
      // CRITICAL SAFETY CHECK: Paddle API throws 500 if successUrl is passed in overlay mode
      if (opts.settings?.displayMode === 'overlay' && opts.settings?.successUrl) {
        console.warn("[PaddleProvider] 'successUrl' is invalid in 'overlay' mode. Automatically stripping it to prevent crash.")
        delete opts.settings.successUrl
      }
      
      // Ensure all customData values are strict strings to prevent internal 400 errors
      if (opts.customData) {
        Object.keys(opts.customData).forEach(key => {
          opts.customData![key] = String(opts.customData![key])
        })
      }

      paddleRef.current.Checkout.open(opts)
    } catch (error) {
      console.error('[PaddleProvider] Failed to open checkout:', error)
      alert("Payment system is currently unavailable. Please refresh the page and try again.")
    }
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
