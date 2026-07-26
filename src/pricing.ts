import { PACKAGES, CREDIT_VALIDITY, getPackageByCredits } from './lib/pricing-packages.js';
import {
  isCheckoutConfigured,
  openCreditCheckout,
  readCredits,
  getPaddlePublicConfig
} from './payments/paddle/index.js';

function renderBalance(): void {
  const el = document.querySelector('#credit-balance');
  if (!el) return;
  const balance = readCredits().balance;
  el.textContent =
    balance === 1 ? 'Balance: 1 credit (this browser)' : `Balance: ${balance} credits (this browser)`;
}

function init(): void {
  const paddle = getPaddlePublicConfig();
  const freeTier = document.querySelector('#free-tier');
  if (freeTier) {
    freeTier.innerHTML = isCheckoutConfigured()
      ? `<b>Paddle ${paddle.environment} checkout is live.</b> Credits stay valid ${CREDIT_VALIDITY}. Free exploratory runs remain available on calculators.`
      : `<b>Checkout is not configured.</b> Set VITE_PADDLE_CLIENT_TOKEN to enable purchases. Credits stay valid ${CREDIT_VALIDITY} after purchase.`;
  }

  const grid = document.querySelector('#packages');
  if (grid) {
    grid.innerHTML = PACKAGES.map((p) => {
      const pop = p.featured ? ' pop' : '';
      const tag = p.badge ? `<span class="tag">${p.badge}</span>` : '';
      const perLabel = p.credits === 1 ? 'one calculation' : `${p.perCredit} / calc`;
      const label = isCheckoutConfigured() ? 'Buy' : 'Notify me';
      return `<div class="pack${pop}">${tag}<div class="amt">${p.price}</div><div class="cred">${p.credits} credit${p.credits === 1 ? '' : 's'}</div><div class="per">${perLabel}</div><button class="load btn btn-ghost" style="margin-top:14px;width:100%;justify-content:center" data-credits="${p.credits}" data-price-id="${p.paddlePriceId}" type="button">${label}</button></div>`;
    }).join('');
  }

  const status = document.querySelector('#pay-status');
  document.querySelectorAll<HTMLButtonElement>('.load').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const credits = Number(btn.dataset.credits);
      const pack = getPackageByCredits(credits);
      if (!pack) {
        if (status) status.textContent = 'Unknown package.';
        return;
      }
      if (!isCheckoutConfigured()) {
        if (status) {
          status.textContent = `Checkout is not live yet. Planned packs stay valid ${CREDIT_VALIDITY} after purchase when Paddle connects.`;
        }
        return;
      }
      try {
        if (status) {
          status.textContent =
            paddle.environment === 'sandbox'
              ? `Opening Paddle sandbox checkout for ${pack.credits} credit${pack.credits === 1 ? '' : 's'}…`
              : `Opening checkout for ${pack.credits} credit${pack.credits === 1 ? '' : 's'}…`;
        }
        await openCreditCheckout(pack.paddlePriceId);
      } catch (err) {
        if (status) {
          status.textContent = err instanceof Error ? err.message : 'Checkout failed.';
        }
      }
    });
  });

  renderBalance();
  window.addEventListener('sectorcalc-credits', () => {
    renderBalance();
    if (status) status.textContent = 'Credits added to this browser.';
  });
  window.addEventListener('sectorcalc-checkout', ((ev: CustomEvent) => {
    if (!status) return;
    const name = ev.detail?.name;
    if (name === 'checkout.closed') status.textContent = 'Checkout closed.';
    if (name === 'checkout.error') status.textContent = 'Checkout error — try again.';
  }) as EventListener);
}

document.addEventListener('DOMContentLoaded', init);
