/**
 * Paddle.js v2 overlay checkout — opens server-prepared transactionId only.
 */
import { getPaddlePublicConfig } from './config.js';
import { fulfillCheckoutCompleted, type PaddleCheckoutEvent } from './fulfill.js';

const PADDLE_SCRIPT = 'https://cdn.paddle.com/paddle/v2/paddle.js';

interface PaddleSdk {
  Environment?: { set: (env: 'sandbox' | 'production') => void };
  Initialize: (opts: {
    token: string;
    eventCallback?: (event: PaddleCheckoutEvent) => void;
  }) => void | Promise<void>;
  Checkout: {
    open: (opts: {
      transactionId?: string;
      items?: Array<{ priceId: string; quantity: number }>;
      settings?: { displayMode?: 'overlay' | 'inline'; theme?: 'light' | 'dark' };
      customData?: Record<string, string>;
    }) => void;
  };
}

declare global {
  interface Window {
    Paddle?: PaddleSdk;
  }
}

let initPromise: Promise<PaddleSdk> | null = null;
let pendingPurchaseId = '';

function loadScript(): Promise<void> {
  if (window.Paddle) return Promise.resolve();
  const existing = document.querySelector<HTMLScriptElement>(`script[src="${PADDLE_SCRIPT}"]`);
  if (existing) {
    return new Promise((resolve, reject) => {
      existing.addEventListener('load', () => resolve(), { once: true });
      existing.addEventListener('error', () => reject(new Error('Failed to load Paddle.js')), {
        once: true
      });
    });
  }
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = PADDLE_SCRIPT;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Paddle.js'));
    document.head.appendChild(script);
  });
}

function onPaddleEvent(event: PaddleCheckoutEvent): void {
  if (event.name === 'checkout.closed') {
    window.dispatchEvent(
      new CustomEvent('sectorcalc-checkout', {
        detail: { name: event.name, purchaseId: pendingPurchaseId }
      })
    );
    pendingPurchaseId = '';
    return;
  }
  if (event.name === 'checkout.error') {
    window.dispatchEvent(
      new CustomEvent('sectorcalc-checkout', {
        detail: { name: event.name, error: event.data, purchaseId: pendingPurchaseId }
      })
    );
    pendingPurchaseId = '';
    return;
  }
  if (event.name !== 'checkout.completed') return;

  const result = fulfillCheckoutCompleted(event);
  const purchaseId = pendingPurchaseId;
  pendingPurchaseId = '';
  window.dispatchEvent(
    new CustomEvent('sectorcalc-checkout', {
      detail: {
        name: event.name,
        transactionId: result.txnId,
        purchaseId,
        pendingActivation: result.pendingActivation,
        granted: 0
      }
    })
  );
}

export function isCheckoutConfigured(): boolean {
  const { clientToken } = getPaddlePublicConfig();
  return clientToken.length > 0;
}

export async function ensurePaddleReady(): Promise<PaddleSdk> {
  if (initPromise) return initPromise;
  initPromise = (async () => {
    const { clientToken, environment } = getPaddlePublicConfig();
    if (!clientToken) {
      throw new Error('Paddle client token missing (set VITE_PADDLE_CLIENT_TOKEN)');
    }
    await loadScript();
    const paddle = window.Paddle;
    if (!paddle) throw new Error('Paddle.js loaded but window.Paddle is missing');
    if (paddle.Environment?.set) {
      paddle.Environment.set(environment);
    }
    try {
      const result = paddle.Initialize({ token: clientToken, eventCallback: onPaddleEvent });
      if (result && typeof (result as Promise<void>).then === 'function') {
        await result;
      }
    } catch (err) {
      const msg = String((err as Error)?.message || err);
      if (!/already initialized/i.test(msg)) throw err;
    }
    return paddle;
  })();
  try {
    return await initPromise;
  } catch (err) {
    initPromise = null;
    throw err;
  }
}

export function preloadPaddle(): void {
  if (!isCheckoutConfigured()) return;
  void ensurePaddleReady().catch(() => {
    /* preload is best-effort */
  });
}

/** Open checkout for a server-prepared Paddle transaction. */
export async function openPreparedCheckout(input: {
  paddleTransactionId: string;
  purchaseId: string;
}): Promise<void> {
  if (!input.paddleTransactionId.startsWith('txn_')) {
    throw new Error('Invalid Paddle transaction id');
  }
  const paddle = await ensurePaddleReady();
  pendingPurchaseId = input.purchaseId;
  window.dispatchEvent(
    new CustomEvent('sectorcalc-checkout', {
      detail: {
        name: 'checkout.open',
        purchaseId: input.purchaseId,
        transactionId: input.paddleTransactionId
      }
    })
  );
  paddle.Checkout.open({
    transactionId: input.paddleTransactionId,
    settings: { displayMode: 'overlay', theme: 'light' }
  });
}

/**
 * @deprecated Client must not open checkout by priceId.
 */
export async function openCreditCheckout(_priceId: string): Promise<void> {
  throw new Error('Client priceId checkout is disabled. Use server-prepared transactionId flow.');
}
