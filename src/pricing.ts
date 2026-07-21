import { PACKAGES, CREDIT_VALIDITY } from './lib/pricing-packages.js';

function init(): void {
  const freeTier = document.querySelector('#free-tier');
  if (freeTier) {
    freeTier.textContent = 'All calculators are free to try now. Credit packs below are the planned prices - checkout goes live with Paddle (no fake success).';
  }

  const grid = document.querySelector('#packages');
  if (grid) {
    grid.innerHTML = PACKAGES.map((p) => `
      <div class="pkg ${p.featured ? 'featured' : ''}">
        ${p.badge ? `<div class="badge">${p.badge}</div>` : '<div class="badge" style="visibility:hidden">.</div>'}
        <div class="credits">${p.credits} credit${p.credits > 1 ? 's' : ''}</div>
        <div class="price">${p.price}</div>
        <div class="per">${p.perCredit} / credit</div>
        <button class="load" data-credits="${p.credits}" type="button">Notify me</button>
      </div>
    `).join('');
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
