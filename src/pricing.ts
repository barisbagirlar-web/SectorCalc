import { PACKAGES, getPackageByKey, type CreditPackageKey } from './lib/pricing-packages.js';
import {
  isCheckoutConfigured,
  openPreparedCheckout,
  readCredits,
  getPaddlePublicConfig
} from './payments/paddle/index.js';
import { currentUser } from './auth/index.js';
import { createCheckout, pollPurchaseCredited, fetchWallet } from './billing/api.js';

function renderBalance(): void {
  const el = document.querySelector('#credit-balance');
  if (!el) return;
  const user = currentUser();
  if (!user) {
    const balance = readCredits().balance;
    el.textContent =
      balance > 0
        ? `Local cache: ${balance} (sign in for server wallet)`
        : 'Sign in to purchase credits — no subscription required.';
    return;
  }
  void fetchWallet()
    .then((w) => {
      el.textContent = `Balance: ${w.spendableCredits} credits (server wallet)`;
    })
    .catch(() => {
      el.textContent = 'Sign in required for server wallet.';
    });
}

function init(): void {
  const paddle = getPaddlePublicConfig();
  const freeTier = document.querySelector('#free-tier');
  if (freeTier) {
    freeTier.innerHTML = isCheckoutConfigured()
      ? `<b>Paddle ${paddle.environment} checkout is ready.</b> Open reference bench (5 instruments) calculates without credits. Tier-A decision tools require a session (CORE 3 / PRO 7 / ADVANCED 15 · 24h). Purchased credits do not expire.`
      : `<b>Checkout is not configured.</b> Set VITE_PADDLE_CLIENT_TOKEN. Purchased credits do not expire.`;
  }

  const grid = document.querySelector('#packages');
  if (grid) {
    grid.innerHTML = PACKAGES.map((p) => {
      const pop = p.featured ? ' pop' : '';
      const tag = p.badge ? `<span class="tag">${p.badge}</span>` : '';
      const perLabel = `${p.perCredit} / credit`;
      const label = isCheckoutConfigured() ? 'Buy one-time' : 'Notify me';
      const spec =
        p.key === 'STARTER'
          ? 'Shop check · light sessions'
          : p.key === 'WORKSHOP'
            ? 'Daily floor · most jobs'
            : p.key === 'PROFESSIONAL'
              ? 'Heavy analysis · report cycles'
              : 'Shared wallet · team load';
      return `<article class="pack${pop}" id="${p.key}">${tag}
        <div class="pack-top"><span class="pack-id">${p.key}</span><span class="pack-rev">ONE-TIME</span></div>
        <div class="pack-mid">
          <div class="amt">${p.price}</div>
          <div class="cred">${p.credits.toLocaleString('en-US')} credits</div>
          <div class="per">${perLabel} · never expire*</div>
          <div class="pack-spec">${spec}</div>
        </div>
        <div class="pack-foot">
          <button class="load btn btn-ghost" data-package-key="${p.key}" type="button">${label}</button>
        </div>
      </article>`;
    }).join('');
  }

  const status = document.querySelector('#pay-status');
  document.querySelectorAll<HTMLButtonElement>('.load').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const packageKey = btn.dataset.packageKey as CreditPackageKey | undefined;
      const pack = packageKey ? getPackageByKey(packageKey) : undefined;
      if (!pack) {
        if (status) status.textContent = 'Unknown package.';
        return;
      }
      if (!currentUser()) {
        if (status) status.textContent = 'Sign in required before purchasing credits.';
        window.location.href = `/login.html?next=${encodeURIComponent('/pricing.html')}`;
        return;
      }
      if (!isCheckoutConfigured()) {
        if (status) status.textContent = 'Checkout is not live yet.';
        return;
      }
      try {
        if (status) {
          status.textContent = `Preparing secure checkout for ${pack.credits} credits…`;
        }
        const { purchaseId, paddleTransactionId } = await createCheckout(
          pack.key,
          window.location.pathname
        );
        await openPreparedCheckout({ paddleTransactionId, purchaseId });
        if (status) status.textContent = 'Checkout open. Complete payment in Paddle…';

        window.addEventListener(
          'sectorcalc-checkout',
          async (ev) => {
            const detail = (ev as CustomEvent).detail;
            if (detail?.name !== 'checkout.completed' || detail.purchaseId !== purchaseId) return;
            if (status) status.textContent = 'Payment received. Activating credits…';
            const st = await pollPurchaseCredited(purchaseId);
            if (st.status === 'CREDITED') {
              if (status) status.textContent = 'Credits activated on your server wallet.';
              renderBalance();
            } else if (st.status === 'CREDIT_ACTIVATION_PENDING') {
              if (status) {
                status.textContent =
                  'Payment received. Credit activation is still processing — check your account shortly.';
              }
            } else {
              if (status) status.textContent = `Purchase status: ${st.status}`;
            }
          },
          { once: true }
        );
      } catch (err) {
        if (status) {
          status.textContent = err instanceof Error ? err.message : 'Checkout failed.';
        }
      }
    });
  });

  renderBalance();
  window.addEventListener('sectorcalc-checkout', ((ev: CustomEvent) => {
    if (!status) return;
    const name = ev.detail?.name;
    if (name === 'checkout.closed') status.textContent = 'Checkout closed.';
    if (name === 'checkout.error') status.textContent = 'Checkout error — try again.';
  }) as EventListener);
}

document.addEventListener('DOMContentLoaded', init);
