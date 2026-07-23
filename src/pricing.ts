import { PACKAGES, CREDIT_VALIDITY } from './lib/pricing-packages.js';

function init(): void {
  const freeTier = document.querySelector('#free-tier');
  if (freeTier) {
    freeTier.innerHTML =
      '<b>Payments launch with the credit store.</b> Until then, every calculator is free to use — no card, no login. Planned packs stay valid ' +
      CREDIT_VALIDITY +
      ' after purchase when Paddle connects.';
  }

  const grid = document.querySelector('#packages');
  if (grid) {
    grid.innerHTML = PACKAGES.map((p) => {
      const pop = p.featured ? ' pop' : '';
      const tag = p.badge ? `<span class="tag">${p.badge}</span>` : '';
      const perLabel = p.credits === 1 ? 'one calculation' : `${p.perCredit} / calc`;
      return `<div class="pack${pop}">${tag}<div class="amt">${p.price}</div><div class="cred">${p.credits} credit${p.credits === 1 ? '' : 's'}</div><div class="per">${perLabel}</div><button class="load btn btn-ghost" style="margin-top:14px;width:100%;justify-content:center" data-credits="${p.credits}" type="button">Notify me</button></div>`;
    }).join('');
  }

  const status = document.querySelector('#pay-status');
  document.querySelectorAll('.load').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (status) {
        status.textContent = `Checkout is not live yet. Planned packs stay valid ${CREDIT_VALIDITY} after purchase when Paddle connects.`;
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', init);
