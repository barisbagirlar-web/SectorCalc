'use client'

import { createContext, useContext, useEffect, useRef, useState, ReactNode } from 'react'


let isPaddleInitialized = false;
type PaddleInstance = {
  Checkout: { open: (opts: PaddleCheckoutOptions) => void }
  Environment: { set: (env: 'sandbox' | 'production') => void }
  Initialize: (opts: { token: string; eventCallback?: (e: PaddleEvent) => void }) => Promise<void>
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

// Guard: Paddle v2 SDK sometimes throws unhandled global errors (Connection closed)
// when its internal WebSocket/SSE connection drops. We install a window-level
// handler to silently swallow Paddle-specific errors so they don't crash the app.
let paddleErrorGuardInstalled = false

function installPaddleErrorGuard() {
  if (paddleErrorGuardInstalled) return
  paddleErrorGuardInstalled = true

  // Silence unhandled promise rejections originating from Paddle SDK
  window.addEventListener('unhandledrejection', (event: PromiseRejectionEvent) => {
    const msg = String(event.reason?.message || event.reason || '')
    if (/paddle|connection closed|Paddle\.Initialize/i.test(msg)) {
      event.preventDefault()
      console.warn('[PaddleGuard] Silenced unhandled rejection:', msg)
    }
  })

  // Silence global errors originating from Paddle SDK
  window.addEventListener('error', (event: ErrorEvent) => {
    const msg = String(event.message || '')
    if (/paddle|connection closed|Paddle\./i.test(msg)) {
      event.preventDefault()
      console.warn('[PaddleGuard] Silenced global error:', msg)
    }
  })
}

export function PaddleProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false)
  const paddleRef = useRef<PaddleInstance | null>(null)
  const initAttempted = useRef(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (initAttempted.current) return
    initAttempted.current = true

    // Install global error guard once
    installPaddleErrorGuard()

    if ((window as any).Paddle) { initPaddle(); return }

    const script = document.createElement('script')
    script.src = 'https://cdn.paddle.com/paddle/v2/paddle.js'
    script.async = true
    script.crossOrigin = 'anonymous'
    script.onload = initPaddle
    script.onerror = () => {
      console.warn('[PaddleProvider] Failed to load Paddle script — payment features unavailable.')
    }
    document.head.appendChild(script)
  }, [])

  function initPaddle() {
    try {
      const Paddle = (window as any).Paddle as PaddleInstance
      if (!Paddle) {
        console.warn('[PaddleProvider] Paddle object not found after script load.')
        return
      }

      const env = (process.env.NEXT_PUBLIC_PADDLE_ENV || 'sandbox') as 'sandbox' | 'production'
      const token = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN || 'test_6380be7c84b551e3fcd08d55d7e'

      const eventCallback = (e: PaddleEvent) => {
        if (e.name === 'checkout.completed') console.log('[Paddle] checkout completed', e.data)
      }

      // Set environment if configured
      if (env === 'sandbox' && Paddle.Environment && typeof Paddle.Environment.set === 'function') {
        try { Paddle.Environment.set('sandbox') } catch (_) {}
      }

      if (typeof Paddle.Initialize === 'function') {
        try {
          const initResult = Paddle.Initialize({ token, eventCallback })

          if (initResult && typeof (initResult as any).then === 'function') {
            (initResult as any)
              .then(() => {
                isPaddleInitialized = true
                paddleRef.current = Paddle
                setReady(true)
              })
              .catch((err: any) => {
                const msg = err?.message || String(err)
                if (msg.toLowerCase().includes('already initialized')) {
                  isPaddleInitialized = true
                  paddleRef.current = Paddle
                  setReady(true)
                } else {
                  console.warn('[PaddleProvider] Initialize rejected — payment unavailable:', msg)
                }
              })
          } else {
            isPaddleInitialized = true
            console.log('[PaddleProvider] Initialize OK')
            paddleRef.current = Paddle
            setReady(true)
          }
        } catch (innerErr) {
          console.warn('[PaddleProvider] Initialize call threw — payment unavailable:', String(innerErr))
        }
      } else if (typeof Paddle.Setup === 'function') {
        try {
          Paddle.Setup({ vendor: Number(token) || 0, eventCallback })
          paddleRef.current = Paddle
          setReady(true)
        } catch (_) {}
      } else {
        console.warn('[PaddleProvider] No Initialize or Setup method found on Paddle object.')
      }
    } catch (error) {
      console.warn('[PaddleProvider] Initialization failed — payment unavailable:', String(error))
      // Fail gracefully, ready stays false
    }
  }

  function openCheckout(opts: PaddleCheckoutOptions) {
    try {
      if (!paddleRef.current) {
        console.warn('[PaddleProvider] Checkout called before Paddle was ready.')
        return
      }

      // CRITICAL SAFETY CHECK: successUrl in overlay mode causes Paddle 500 error
      if (opts.settings?.displayMode === 'overlay' && opts.settings?.successUrl) {
        console.warn("[PaddleProvider] 'successUrl' invalid in 'overlay' mode — stripping to prevent crash.")
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
