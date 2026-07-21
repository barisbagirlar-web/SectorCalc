import { LitElement, html, css } from 'lit';

/** 4-severity warning panel. Human wording, no AI smell. */
export interface WarningData {
  code: string;
  severity: 'CRITICAL' | 'WARNING' | 'INFO' | 'TIP';
  message: string;
  action: string;
}

const STYLE: Record<string, { border: string; bg: string; tag: string }> = {
  CRITICAL: { border: '#e74c3c', bg: '#fdedec', tag: 'Critical' },
  WARNING: { border: '#f39c12', bg: '#fef9e7', tag: 'Heads up' },
  INFO: { border: '#3498db', bg: '#ebf5fb', tag: 'Good to know' },
  TIP: { border: '#27ae60', bg: '#eafaf1', tag: 'Pro tip' }
};

export class ScWarningPanel extends LitElement {
  static override properties = { warnings: { type: Array } };

  static override styles = css`
    :host { display: block; }
    .w { border-left: 4px solid; border-radius: 6px; padding: 10px 12px; margin-bottom: 8px; font: 14px var(--sc-sans, system-ui); }
    .tag { font-weight: 700; text-transform: uppercase; font-size: 11px; letter-spacing: 0.5px; }
    .act { color: var(--sc-muted, #636e72); margin-top: 4px; }
  `;

  declare warnings: WarningData[];
  constructor() { super(); this.warnings = []; }

  override render() {
    if (this.warnings.length === 0) return html``;
    return html`${this.warnings.map((w) => {
      const s = STYLE[w.severity] ?? STYLE.INFO!;
      return html`<div class="w" style="border-color:${s.border};background:${s.bg}">
        <div class="tag" style="color:${s.border}">${s.tag}</div>
        <div>${w.message}</div>
        <div class="act">${w.action}</div>
      </div>`;
    })}`;
  }
}

if (!customElements.get('sc-warning-panel')) customElements.define('sc-warning-panel', ScWarningPanel);
