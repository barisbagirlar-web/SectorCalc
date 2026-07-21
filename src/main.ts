import Decimal from 'decimal.js';

// Engine health: does 0.1 + 0.2 === 0.3? (Impossible with Number, exact with Decimal)
const a = new Decimal('0.1');
const b = new Decimal('0.2');
const sum = a.plus(b);

const span = document.querySelector<HTMLElement>('#engine-check span');
if (span) {
  const ok = sum.equals(new Decimal('0.3'));
  span.textContent = ok ? `OK (0.1 + 0.2 = ${sum.toString()})` : 'BROKEN';
  span.style.color = ok ? '#27AE60' : '#E74C3C';
}

console.log('[SectorCalc] Engine check:', sum.toString());
