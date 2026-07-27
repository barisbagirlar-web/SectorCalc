/**
 * Professional Analysis gate UI for SC-008 / SC-020.
 * Free calc stays open; paid actions require server entitlement.
 */
import { currentUser } from '../auth/index.js';
import { fetchWallet, openProfessionalSessionApi, trackBillingEvent } from './api.js';

export interface ProfessionalGateOptions {
  toolId: 'SC-008' | 'SC-020';
  mount: HTMLElement;
  /** Called when user is entitled (or monetization not enforced). */
  onEntitled?: (session: { expiresAt: string; reused: boolean } | null) => void;
}

function monetizationUiEnabled(): boolean {
  const env = (import.meta as ImportMeta & { env?: Record<string, string | undefined> }).env;
  return String(env?.VITE_CREDIT_MONETIZATION_ENABLED || '').toLowerCase() === 'true';
}

function esc(s: string): string {
  return s.replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!
  );
}

export class ProfessionalGate {
  readonly toolId: 'SC-008' | 'SC-020';
  private mount: HTMLElement;
  private onEntitled?: ProfessionalGateOptions['onEntitled'];
  private entitledUntil: string | null = null;
  private balance: number | null = null;
  private cost = 15;
  private enforce: boolean;

  constructor(opts: ProfessionalGateOptions) {
    this.toolId = opts.toolId;
    this.mount = opts.mount;
    this.onEntitled = opts.onEntitled;
    this.enforce = monetizationUiEnabled();
    this.render();
    void this.refresh();
  }

  isEntitled(): boolean {
    if (!this.enforce) return true;
    if (!this.entitledUntil) return false;
    return Date.parse(this.entitledUntil) > Date.now();
  }

  async ensureEntitled(): Promise<boolean> {
    if (!this.enforce) return true;
    if (this.isEntitled()) return true;
    await this.refresh();
    return this.isEntitled();
  }

  private async refresh(): Promise<void> {
    const user = currentUser();
    if (!user) {
      this.balance = null;
      this.entitledUntil = null;
      this.render();
      this.onEntitled?.(null);
      return;
    }
    try {
      const w = await fetchWallet();
      this.balance = w.spendableCredits;
    } catch {
      this.balance = null;
    }
    this.render();
  }

  private async startSession(): Promise<void> {
    const user = currentUser();
    if (!user) {
      window.location.href = `/login.html?next=${encodeURIComponent(window.location.pathname)}`;
      return;
    }
    trackBillingEvent('professional_session_requested', { toolId: this.toolId, creditCost: this.cost });
    try {
      const res = await openProfessionalSessionApi(this.toolId);
      if ('error' in res) {
        if (res.error === 'INSUFFICIENT_CREDITS') {
          trackBillingEvent('insufficient_credits', {
            toolId: this.toolId,
            creditCost: this.cost,
            available: res.availableCredits
          });
          this.renderError(
            `${this.cost} credits required. Your balance: ${res.availableCredits ?? 0} credits.`,
            true
          );
          return;
        }
        if (res.error === 'BILLING_DEBT') {
          trackBillingEvent('professional_session_blocked_debt', { toolId: this.toolId });
          this.renderError('Account has billing debt. Purchase credits to settle before unlocking.', false);
          return;
        }
        this.renderError(String(res.error), false);
        return;
      }
      this.entitledUntil = res.expiresAt;
      this.balance = res.newWalletBalance;
      trackBillingEvent(res.reused ? 'professional_session_reused' : 'professional_session_started', {
        toolId: this.toolId,
        creditCost: res.creditCost
      });
      this.render();
      this.onEntitled?.({ expiresAt: res.expiresAt, reused: res.reused });
    } catch (err) {
      this.renderError(err instanceof Error ? err.message : 'Session request failed', false);
    }
  }

  private renderError(msg: string, offerBuy: boolean): void {
    const buy = offerBuy
      ? `<a class="sc-pro-gate-btn sc-pro-gate-btn-primary" href="/pricing.html">Get credits</a>`
      : '';
    const status = this.mount.querySelector('.sc-pro-gate-status');
    if (status) {
      status.innerHTML = `<p class="sc-pro-gate-err">${esc(msg)}</p>${buy}`;
    }
  }

  private render(): void {
    const entitled = this.isEntitled();
    const bal =
      this.balance == null ? '—' : String(this.balance);
    const after =
      this.balance == null ? '—' : String(Math.max(0, this.balance - this.cost));

    let body: string;
    if (!this.enforce) {
      body = `<p class="sc-pro-gate-copy">Professional Analysis (15 credits / 24h) is prepared. Monetization enforcement is off in this environment — free calculation and reports remain available.</p>`;
    } else if (entitled) {
      const exp = this.entitledUntil
        ? new Date(this.entitledUntil).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })
        : '—';
      body = `
        <p class="sc-pro-gate-active">Professional Session Active</p>
        <p class="sc-pro-gate-copy">Expires: ${esc(exp)}</p>
        <p class="sc-pro-gate-copy">Balance: ${esc(bal)} credits</p>
        <button type="button" class="sc-pro-gate-btn sc-pro-gate-btn-primary" data-open-pro>Open professional analysis</button>`;
    } else {
      body = `
        <p class="sc-pro-gate-copy">Advanced analysis, engineering audit trail, professional report, and export functions.</p>
        <ul class="sc-pro-gate-meta">
          <li><strong>Cost:</strong> ${this.cost} credits</li>
          <li><strong>Current balance:</strong> ${esc(bal)} credits</li>
          <li><strong>After unlock:</strong> ${esc(after)} credits</li>
          <li><strong>Duration:</strong> 24 hours · unlimited recalculation</li>
        </ul>
        <div class="sc-pro-gate-actions">
          <button type="button" class="sc-pro-gate-btn sc-pro-gate-btn-primary" data-confirm-pro>Confirm — use ${this.cost} credits</button>
          <a class="sc-pro-gate-btn" href="/pricing.html">Get credits</a>
        </div>
        <div class="sc-pro-gate-status"></div>`;
    }

    this.mount.innerHTML = `
      <aside class="sc-pro-gate" data-tool="${this.toolId}">
        <p class="sc-pro-gate-kicker">Professional Analysis</p>
        <h2 class="sc-pro-gate-title">${this.cost} CREDITS</h2>
        ${body}
      </aside>`;

    this.mount.querySelector('[data-confirm-pro]')?.addEventListener('click', () => void this.startSession());
    this.mount.querySelector('[data-open-pro]')?.addEventListener('click', () => {
      this.onEntitled?.(
        this.entitledUntil ? { expiresAt: this.entitledUntil, reused: true } : null
      );
    });
  }
}

export function mountProfessionalGate(opts: ProfessionalGateOptions): ProfessionalGate {
  return new ProfessionalGate(opts);
}
