import { PACKAGES, getPackageByCredits, getPackageById } from './lib/pricing-packages.js';
import {
  isCheckoutConfigured,
  openCreditCheckout,
  readCredits,
  getPaddlePublicConfig
} from './payments/paddle/index.js';
import { currentUser, recordLocalPurchase, recordCloudPurchase } from './auth/index.js';
import { trackBillingEvent } from './billing/analytics.js';

function renderBalance(): void {
  const el = document.querySelector('#credit-balance');
  if (!el) return;
  const { balance, purchasedCredits, promotionalCredits } = readCredits();
  const purchased = purchasedCredits ?? balance;
  const promo = promotionalCredits ?? 0;
  el.textContent =
    promo > 0
      ? `Balance: ${balance} credits (purchased ${purchased} · promotional ${promo}) — cache display`
      : balance === 1
        ? 'Balance: 1 credit (display cache; server ledger is authoritative when signed in)'
        : `Balance: ${balance} credits (display cache; server ledger is authoritative when signed in)`;
}

async function persistPurchase(detail: { granted?: number; txnId?: string; source?: string }): Promise<void> {
  const credits = Number(detail.granted) || 0;
  if (credits <= 0) return;
  recordLocalPurchase({ credits, txnId: detail.txnId, source: detail.source });
  trackBillingEvent('credit_purchase_success', {
    packageId: getPackageByCredits(credits)?.id,
    creditCost: credits,
    cohort: currentUser() ? 'account' : 'anonymous'
  });
  const user = currentUser();
  if (!user) return;
  try {
    await recordCloudPurchase(user, { credits, txnId: detail.txnId, source: detail.source });
  } catch {
    /* cloud purchase log best-effort until webhook is authoritative */
  }
}

function init(): void {
  const paddle = getPaddlePublicConfig();
  const freeTier = document.querySelector('#free-tier');
  if (freeTier) {
    freeTier.innerHTML = isCheckoutConfigured()
      ? `<b>Paddle ${paddle.environment} checkout is live.</b> No subscription required. Purchased credits do not expire. Use credits only when you need a professional calculation session.`
      : `<b>Checkout is not configured.</b> Set VITE_PADDLE_CLIENT_TOKEN to enable purchases. Purchased credits do not expire once checkout is live.`;
  }

  const grid = document.querySelector('#packages');
  if (grid) {
    grid.innerHTML = PACKAGES.map((p) => {
      const pop = p.featured ? ' pop' : '';
      const tag = p.badge ? `<span class="tag">${p.badge}</span>` : '';
      const perLabel = `${p.perCredit} / credit`;
      const label = isCheckoutConfigured() ? 'Buy credits' : 'Notify me';
      return `<div class="pack${pop}">${tag}<div class="amt">${p.price}</div><div class="cred">${p.credits} credits</div><div class="per">${perLabel}</div><button class="load btn btn-ghost" style="margin-top:14px;width:100%;justify-content:center" data-package-id="${p.id}" data-credits="${p.credits}" data-price-id="${p.paddlePriceId}" type="button">${label}</button></div>`;
    }).join('');
  }

  const status = document.querySelector('#pay-status');
  document.querySelectorAll<HTMLButtonElement>('.load').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const packageId = btn.dataset.packageId as
        | 'STARTER'
        | 'WORKSHOP'
        | 'PROFESSIONAL'
        | 'TEAM_WALLET'
        | undefined;
      const pack = packageId ? getPackageById(packageId) : getPackageByCredits(Number(btn.dataset.credits));
      if (!pack) {
        if (status) status.textContent = 'Unknown package.';
        return;
      }
      if (!isCheckoutConfigured()) {
        if (status) {
          status.textContent = `Checkout is not live yet. Planned packs never expire after purchase when Paddle connects.`;
        }
        return;
      }
      try {
        trackBillingEvent('checkout_started', {
          packageId: pack.id,
          creditCost: pack.credits,
          cohort: currentUser() ? 'account' : 'anonymous'
        });
        if (status) {
          status.textContent =
            paddle.environment === 'sandbox'
              ? `Opening Paddle sandbox checkout for ${pack.credits} credits (${pack.id})…`
              : `Opening checkout for ${pack.credits} credits (${pack.id})…`;
        }
        await openCreditCheckout(pack.paddlePriceId);
      } catch (err) {
        trackBillingEvent('credit_purchase_failed', { packageId: pack.id });
        if (status) {
          status.textContent = err instanceof Error ? err.message : 'Checkout failed.';
        }
      }
    });
  });

  renderBalance();
  trackBillingEvent('credit_wallet_viewed', { cohort: currentUser() ? 'account' : 'anonymous' });
  window.addEventListener('sectorcalc-credits', ((ev: CustomEvent) => {
    renderBalance();
    if (status) status.textContent = 'Credits added to display cache. Server ledger confirms via payment event.';
    void persistPurchase({
      granted: ev.detail?.granted,
      txnId: ev.detail?.txnId,
      source: ev.detail?.source
    });
  }) as EventListener);
  window.addEventListener('sectorcalc-checkout', ((ev: CustomEvent) => {
    if (!status) return;
    const name = ev.detail?.name;
    if (name === 'checkout.closed') status.textContent = 'Checkout closed.';
    if (name === 'checkout.error') {
      trackBillingEvent('credit_purchase_failed');
      status.textContent = 'Checkout error — try again.';
    }
  }) as EventListener);
}

document.addEventListener('DOMContentLoaded', init);
