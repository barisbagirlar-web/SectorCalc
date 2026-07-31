/**
 * Professional session gate UI — blocks calculation until the SERVER confirms
 * access. Every decision comes from the entitlement endpoint:
 * canOpenWithoutDebit (live session) or canStartNewSession (credits enough).
 * The browser never recomputes status, expiry, or credit math.
 */
import { currentUser } from '../auth/index.js';
import { isCreditRequired, resolveToolCost } from './domain/packages.js';
import { fetchToolEntitlement } from './entitlements-api.js';
import {
  fetchWallet,
  invalidateWalletCache,
  openProfessionalSessionApi,
  trackBillingEvent
} from './api.js';
import { cacheAuthoritativeBalances } from '../payments/paddle/credits.js';

export interface ProfessionalGateOptions {
  toolId: string;
  mount: HTMLElement;
  /** Called when user becomes entitled (or tool is free / enforcement off). */
  onEntitled?: (session: { expiresAt: string; reused: boolean } | null) => void;
}

function monetizationUiEnabled(): boolean {
  const env = (import.meta as ImportMeta & { env?: Record<string, string | undefined> }).env;
  return String(env?.VITE_CREDIT_MONETIZATION_ENABLED || '').toLowerCase() === 'true';
}

function esc(s: string): string {
  return s.replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!
  );
}

export class ProfessionalGate {
  readonly toolId: string;
  private mount: HTMLElement;
  private onEntitled?: ProfessionalGateOptions['onEntitled'];
  /** Backend decision: a live session exists → form opens, no new debit. */
  private canOpenWithoutDebit = false;
  /** Backend decision: session ended but wallet covers the cost. */
  private canStartNewSession = false;
  private suspended = false;
  /** No signed-in user (anonymous): show sign-in gate, not a credit error. */
  private userMissing = false;
  private entitledUntil: string | null = null;
  private balance: number | null = null;
  private cost: number;
  private tier: string;
  private enforce: boolean;

  constructor(opts: ProfessionalGateOptions) {
    this.toolId = opts.toolId;
    this.mount = opts.mount;
    this.onEntitled = opts.onEntitled;
    const pricing = resolveToolCost(opts.toolId);
    this.cost = pricing?.creditCost ?? 15;
    this.tier = pricing?.tier ?? 'ADVANCED';
    this.enforce = monetizationUiEnabled() && isCreditRequired(opts.toolId);
    this.render();
    void this.refresh();
  }

  isEntitled(): boolean {
    if (!this.enforce) return true;
    return this.canOpenWithoutDebit;
  }

  async ensureEntitled(): Promise<boolean> {
    if (!this.enforce) return true;
    if (this.isEntitled()) return true;
    await this.refresh();
    return this.isEntitled();
  }

  /** Scroll gate into view and return false when locked. */
  requireEntitled(): boolean {
    if (this.isEntitled()) return true;
    this.mount.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return false;
  }

  private async refresh(): Promise<void> {
    const user = currentUser();
    if (!user) {
      this.userMissing = true;
      this.balance = null;
      this.canOpenWithoutDebit = false;
      this.canStartNewSession = false;
      this.suspended = false;
      this.entitledUntil = null;
      this.render();
      this.onEntitled?.(null);
      return;
    }
    try {
      const view = await fetchToolEntitlement(this.toolId);
      this.userMissing = false;
      this.canOpenWithoutDebit = view.canOpenWithoutDebit;
      this.canStartNewSession = view.canStartNewSession;
      this.suspended = view.status === 'SUSPENDED';
      this.entitledUntil = view.sessionEndsAt;
      this.balance = view.creditsAvailable;
      this.cost = view.sessionCreditCost || this.cost;
      try {
        const w = await fetchWallet();
        cacheAuthoritativeBalances({
          purchasedCredits: w.purchasedCredits,
          promotionalCredits: w.promotionalCredits,
          availableCredits: w.spendableCredits
        });
      } catch {
        /* display cache only — never used for decisions */
      }
    } catch (err) {
      if (err instanceof Error && err.message === 'NOT_AUTHENTICATED') {
        // Anonymous / expired token: present the sign-in gate.
        this.userMissing = true;
        this.canOpenWithoutDebit = false;
        this.canStartNewSession = false;
        this.suspended = false;
        this.entitledUntil = null;
        this.balance = null;
      }
      // Any other failure: fail closed — keep the current lock state.
    }
    this.render();
    if (this.canOpenWithoutDebit && this.entitledUntil) {
      this.onEntitled?.({ expiresAt: this.entitledUntil, reused: true });
    }
  }

  private async startSession(): Promise<void> {
    const user = currentUser();
    if (!user) {
      window.location.href = `/login.html?next=${encodeURIComponent(window.location.pathname + window.location.search)}`;
      return;
    }
    trackBillingEvent('professional_session_requested', {
      toolId: this.toolId,
      creditCost: this.cost
    });
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
          this.renderError(
            'Account has billing debt. Purchase credits to settle before unlocking.',
            false
          );
          return;
        }
        if (res.error === 'TOOL_NOT_MONETIZED') {
          this.renderError(
            'Credit monetization is currently unavailable for this tool. Please try again later.',
            false
          );
          return;
        }
        if (res.error === 'RATE_LIMITED' || res.error === 'SERVER_ERROR_429') {
          this.renderError(
            'High request volume detected. Please wait 10 seconds and try again.',
            false
          );
          return;
        }
        if (
          typeof res.error === 'string' &&
          (res.error.startsWith('SERVER_ERROR_') || res.error === 'SESSION_FAILED')
        ) {
          this.renderError(
            'Billing service is undergoing maintenance. Please try again in a few moments.',
            false
          );
          return;
        }
        const friendlyMsg = String(res.error);
        this.renderError(friendlyMsg, false);
        return;
      }
      this.entitledUntil = res.expiresAt;
      this.balance = res.newWalletBalance;
      this.canOpenWithoutDebit = true;
      this.canStartNewSession = false;
      cacheAuthoritativeBalances({
        purchasedCredits: res.newWalletBalance,
        promotionalCredits: 0,
        availableCredits: res.newWalletBalance
      });
      invalidateWalletCache();
      trackBillingEvent(
        res.reused ? 'professional_session_reused' : 'professional_session_started',
        {
          toolId: this.toolId,
          creditCost: res.creditCost
        }
      );
      this.render();
      this.onEntitled?.({ expiresAt: res.expiresAt, reused: res.reused });
    } catch (err) {
      this.renderError(err instanceof Error ? err.message : 'Session request failed', false);
    }
  }

  private renderError(msg: string, offerBuy: boolean): void {
    const buy = offerBuy
      ? `<a class="sc-pro-gate-btn sc-pro-gate-btn-primary" href="/pricing.html">Buy credits</a>`
      : '';
    const status = this.mount.querySelector('.sc-pro-gate-status');
    if (status) {
      status.innerHTML = `<p class="sc-pro-gate-err">${esc(msg)}</p>${buy}`;
    }
  }

  private render(): void {
    const entitled = this.isEntitled();
    const bal = this.balance == null ? '—' : String(this.balance);
    const after = this.balance == null ? '—' : String(Math.max(0, this.balance - this.cost));

    let body: string;
    if (!this.enforce) {
      body = `<p class="sc-pro-gate-copy">This tool is free in the current configuration (no credit debit).</p>`;
    } else if (this.suspended) {
      body = `
        <p class="sc-pro-gate-copy">Access to this tool is temporarily paused.</p>
        <div class="sc-pro-gate-actions">
          <a class="sc-pro-gate-btn" href="/contact.html">Contact support</a>
        </div>`;
    } else if (this.userMissing) {
      body = `
        <p class="sc-pro-gate-copy">Sign in to unlock a 24-hour session. One debit covers unlimited recalculation until expiry.</p>
        <ul class="sc-pro-gate-meta">
          <li><strong>Tier:</strong> ${esc(this.tier)}</li>
          <li><strong>Session cost:</strong> ${this.cost} credits</li>
          <li><strong>Duration:</strong> 24 hours · unlimited recalculation</li>
        </ul>
        <div class="sc-pro-gate-actions">
          <button type="button" class="sc-pro-gate-btn sc-pro-gate-btn-primary" data-confirm-pro>Confirm — use ${this.cost} credits</button>
          <a class="sc-pro-gate-btn" href="/pricing.html">Buy credits</a>
        </div>
        <div class="sc-pro-gate-status"></div>`;
    } else if (entitled) {
      const exp = this.entitledUntil
        ? new Date(this.entitledUntil).toLocaleString(undefined, {
            dateStyle: 'medium',
            timeStyle: 'short'
          })
        : '—';
      body = `
        <p class="sc-pro-gate-active">Session active — calculation unlocked</p>
        <p class="sc-pro-gate-copy">Expires: ${esc(exp)}</p>
        <p class="sc-pro-gate-copy">Balance: ${esc(bal)} credits</p>`;
    } else if (this.canStartNewSession) {
      body = `
        <p class="sc-pro-gate-copy">Session ended. Start a new 24-hour session to run this calculator. One debit covers unlimited recalculation until expiry.</p>
        <ul class="sc-pro-gate-meta">
          <li><strong>Tier:</strong> ${esc(this.tier)}</li>
          <li><strong>Session cost:</strong> ${this.cost} credits</li>
          <li><strong>Current balance:</strong> ${esc(bal)} credits</li>
          <li><strong>After unlock:</strong> ${esc(after)} credits</li>
          <li><strong>Duration:</strong> 24 hours · unlimited recalculation</li>
        </ul>
        <div class="sc-pro-gate-actions">
          <button type="button" class="sc-pro-gate-btn sc-pro-gate-btn-primary" data-confirm-pro>Start New Session — use ${this.cost} credits</button>
          <a class="sc-pro-gate-btn" href="/pricing.html">Buy credits</a>
        </div>
        <div class="sc-pro-gate-status"></div>`;
    } else {
      body = `
        <p class="sc-pro-gate-copy">Session ended and your balance is below the session cost.</p>
        <ul class="sc-pro-gate-meta">
          <li><strong>Credits required:</strong> ${this.cost}</li>
          <li><strong>Credits available:</strong> ${esc(bal)}</li>
        </ul>
        <div class="sc-pro-gate-actions">
          <a class="sc-pro-gate-btn sc-pro-gate-btn-primary" href="/pricing.html">Buy credits</a>
        </div>
        <div class="sc-pro-gate-status"></div>`;
    }

    this.mount.innerHTML = `
      <aside class="sc-pro-gate" data-tool="${esc(this.toolId)}">
        <p class="sc-pro-gate-kicker">Credit unlock · ${esc(this.toolId)} · ${esc(this.tier)}</p>
        <h2 class="sc-pro-gate-title">${esc(this.tier)} · ${this.cost} CREDITS</h2>
        ${body}
      </aside>`;

    this.mount
      .querySelector('[data-confirm-pro]')
      ?.addEventListener('click', () => void this.startSession());
  }
}

export function mountProfessionalGate(opts: ProfessionalGateOptions): ProfessionalGate {
  return new ProfessionalGate(opts);
}
