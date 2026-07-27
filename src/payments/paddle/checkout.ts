/**
 * Paddle.js v2 overlay checkout for SectorCalc credit packs.
 * Never pass successUrl in overlay mode — Paddle returns HTTP 500.
 */
import { getPaddlePublicConfig } from './config.js';
import { getPackageByPriceId } from '../../lib/pricing-packages.js';
import {
  fulfillCheckoutCompleted,
  type PaddleCheckoutEvent
} from './fulfill.js';

const PADDLE_SCRIPT = 'https://cdn.paddle.com/paddle/v2/paddle.js';

export interface PaddleCheckoutItem {
  priceId: string;
  quantity: number;
}

interface PaddleSdk {
  Environment?: { set: (env: 'sandbox' | 'production') => void };
  Initialize: (opts: {
    token: string;
    eventCallback?: (event: PaddleCheckoutEvent) => void;
  }) => void | Promise<void>;
  Checkout: {
    open: (opts: {
      items: PaddleCheckoutItem[];
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
let pendingCredits = 0;

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
    pendingCredits = 0;
    window.dispatchEvent(new CustomEvent('sectorcalc-checkout', { detail: { name: event.name } }));
    return;
  }
  if (event.name === 'checkout.error') {
    pendingCredits = 0;
    window.dispatchEvent(
      new CustomEvent('sectorcalc-checkout', {
        detail: { name: event.name, error: event.data }
      })
    );
    return;
  }
  if (event.name !== 'checkout.completed') return;

  const result = fulfillCheckoutCompleted(event, pendingCredits);
  pendingCredits = 0;
  window.dispatchEvent(
    new CustomEvent('sectorcalc-checkout', {
      detail: {
        name: event.name,
        transactionId: result.txnId,
        ...result
      }
    })
  );
  if (result.granted > 0) {
    window.dispatchEvent(
      new CustomEvent('sectorcalc-credits', {
        detail: { granted: result.granted, txnId: result.txnId, source: result.source }
      })
    );
  }
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
    // Environment MUST be set before Initialize.
    if (environment === 'sandbox' && paddle.Environment?.set) {
      paddle.Environment.set('sandbox');
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

/** Warm the SDK so the first Buy click is fast. */
export function preloadPaddle(): void {
  if (!isCheckoutConfigured()) return;
  void ensurePaddleReady().catch(() => {
    /* preload is best-effort */
  });
}

export async function openCreditCheckout(priceId: string): Promise<void> {
  if (!priceId.startsWith('pri_')) {
    throw new Error('Invalid Paddle price id');
  }
  const pack = getPackageByPriceId(priceId);
  if (!pack) throw new Error(`Unknown price id: ${priceId}`);
  const paddle = await ensurePaddleReady();
  pendingCredits = pack.credits;
  const customData: Record<string, string> = {
    product: 'credit_pack',
    credits: String(pack.credits),
    packageId: pack.id
  };
  try {
    const { currentUser } = await import('../../auth/session.js');
    const user = currentUser();
    if (user?.uid) customData.accountId = user.uid;
  } catch {
    /* optional */
  }
  window.dispatchEvent(
    new CustomEvent('sectorcalc-checkout', {
      detail: { name: 'checkout.open', priceId, credits: pack.credits }
    })
  );
  paddle.Checkout.open({
    items: [{ priceId, quantity: 1 }],
    settings: { displayMode: 'overlay', theme: 'light' },
    customData
  });
}
