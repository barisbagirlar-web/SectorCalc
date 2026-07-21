/**
 * App shell — Vanilla JS + Lit Web Components only.
 * Decision #4: never React / Vue / Next / Angular.
 */
import { LitElement, css, html } from 'lit';
import { money } from '../money/money.js';

export class SectorcalApp extends LitElement {
  static properties = {
    demoTotal: { type: String }
  };

  static styles = css`
    :host {
      display: block;
      min-height: 100vh;
      font-family: 'IBM Plex Sans', 'Segoe UI', sans-serif;
      color: #e8eef5;
      background: radial-gradient(1200px 600px at 10% -10%, #1a3a55 0%, transparent 55%),
        radial-gradient(900px 500px at 100% 0%, #0d2a22 0%, transparent 50%), #0b1218;
    }
    .wrap {
      max-width: 42rem;
      margin: 0 auto;
      padding: 4rem 1.5rem;
    }
    h1 {
      font-family: 'IBM Plex Serif', Georgia, serif;
      font-weight: 600;
      font-size: clamp(2rem, 5vw, 3rem);
      letter-spacing: -0.02em;
      margin: 0 0 0.5rem;
    }
    p {
      margin: 0 0 1.5rem;
      color: #9db0c3;
      line-height: 1.5;
    }
    .stack {
      display: grid;
      gap: 0.4rem;
      font-size: 0.9rem;
      color: #b7c7d6;
      font-variant-numeric: tabular-nums;
    }
    .ok {
      color: #6dcea1;
    }
  `;

  constructor() {
    super();
    const total = money('0.1', 'USD').add(money('0.2', 'USD'));
    this.demoTotal = total.toString();
  }

  render() {
    return html`
      <div class="wrap">
        <h1>SECTORCAL</h1>
        <p>Locked stack is live. Structure over fashion.</p>
        <div class="stack">
          <div class="ok">✓ JSON Schema Draft 2020-12</div>
          <div class="ok">✓ Decimal.js — demo ${this.demoTotal}</div>
          <div class="ok">✓ Paddle (Merchant of Record)</div>
          <div class="ok">✓ Vanilla JS + Lit</div>
          <div class="ok">✓ JSON only</div>
        </div>
      </div>
    `;
  }
}

customElements.define('sectorcal-app', SectorcalApp);
