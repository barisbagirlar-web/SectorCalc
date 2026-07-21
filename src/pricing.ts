import { PACKAGES, FREE_MONTHLY_CREDITS, CREDIT_VALIDITY } from './lib/pricing-packages.js';

function init(): void {
  const freeTier = document.querySelector('#free-tier');
  if (freeTier) {
    freeTier.textContent = `Free account — ${FREE_MONTHLY_CREDITS} free credits every month. Try the tools, earn your trust.`;
  }

  const grid = document.querySelector('#packages');
  if (grid) {
    grid.innerHTML = PACKAGES.map((p) => `
      <div class="pkg ${p.featured ? 'featured' : ''}">
        ${p.badge ? `<div class="badge">${p.badge}</div>` : '<div class="badge" style="visibility:hidden">.</div>'}
        <div class="credits">${p.credits} credit${p.credits > 1 ? 's' : ''}</div>
        <div class="price">${p.price}</div>
        <div class="per">${p.perCredit} / credit</div>
        <button class="load" data-credits="${p.credits}">Load credits</button>
      </div>
    `).join('');
  }

  const status = document.querySelector('#pay-status');
  document.querySelectorAll('.load').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (status) {
        status.textContent = `Credit checkout goes live with the payment integration. No subscription — credits valid ${CREDIT_VALIDITY}.`;
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', init);
