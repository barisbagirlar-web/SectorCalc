import { LitElement, html, css } from 'lit';
import { validate } from '../core/validator.js';
import './sc-select-input.js';

/**
 * Schema-driven form. Reads a JSON Schema (Draft 2020-12) and renders one
 * control per property: number -> unit-aware field, enum -> sc-select-input.
 * Supports description (tooltip), default (placeholder), x-unit (label).
 * Validates on every keystroke via the engine validator; emits 'sc-submit'
 * with parsed numeric values only when valid. Button label is human, not AI.
 */
export interface FormSchema {
  type: string;
  required?: string[];
  properties: Record<string, {
    type?: string;
    enum?: string[];
    minimum?: number;
    maximum?: number;
    exclusiveMinimum?: number;
    exclusiveMaximum?: number;
    default?: number | string;
    description?: string;
    'x-unit'?: string;
  }>;
}

export class ScFormRenderer extends LitElement {
  static properties = {
    schema: { type: Object },
    submitLabel: { type: String }
  };

  static styles = css`
    :host { display: block; }
    .fld { margin-bottom: 10px; }
    .fld label { display: flex; align-items: center; gap: 6px; font: 600 13px var(--sc-sans, system-ui); margin-bottom: 4px; }
    .tip { display: inline-flex; align-items: center; justify-content: center; width: 15px; height: 15px; border-radius: 50%; background: #dfe6e9; font: 700 10px var(--sc-sans, system-ui); cursor: help; }
    .unit { font: 600 11px var(--sc-mono, monospace); color: var(--sc-muted, #636e72); }
    .fld input { width: 100%; height: 40px; font: 15px var(--sc-mono, monospace); padding: 0 10px; border: 1px solid #dfe6e9; border-radius: 8px; box-sizing: border-box; }
    .err { color: #e74c3c; font: 12px var(--sc-sans, system-ui); margin-top: 4px; min-height: 14px; }
    button { height: 48px; min-width: 160px; font: 700 16px var(--sc-sans, system-ui); color: #fff;
             background: var(--sc-rust, #d35400); border: none; border-radius: 8px; cursor: pointer; margin-top: 8px; }
    button:disabled { background: #b2bec3; cursor: not-allowed; }
  `;

  declare schema: FormSchema;
  declare submitLabel: string;
  private values: Record<string, string> = {};
  private errors: Record<string, string> = {};

  constructor() {
    super();
    this.schema = { type: 'object', properties: {} };
    this.submitLabel = 'Run the Numbers';
  }

  private keys(): string[] {
    return Object.keys(this.schema.properties ?? {});
  }

  private parseNumeric(): Record<string, unknown> {
    const out: Record<string, unknown> = {};
    for (const k of this.keys()) {
      const raw = this.values[k];
      const prop = this.schema.properties[k];
      if (prop?.enum) {
        if (raw !== undefined && raw !== '') out[k] = raw;
        continue;
      }
      if (raw === undefined || raw === '') continue;
      const n = Number(raw);
      if (Number.isFinite(n)) out[k] = n;
    }
    return out;
  }

  private revalidate() {
    const parsed = this.parseNumeric();
    const res = validate(this.schema as unknown as object, parsed);
    const next: Record<string, string> = {};
    for (const e of res.errors) next[e.field] = e.message ?? 'invalid';
    for (const k of this.schema.required ?? []) {
      if (this.values[k] === undefined || this.values[k] === '') {
        next[k] = next[k] ?? 'required';
      }
    }
    this.errors = next;
  }

  private onField(key: string, value: string) {
    this.values[key] = value;
    this.revalidate();
    this.requestUpdate();
  }

  private onSelect(key: string, e: Event) {
    this.onField(key, (e as CustomEvent).detail as string);
  }

  private get valid(): boolean {
    this.revalidate();
    return Object.keys(this.errors).length === 0;
  }

  private onSubmit() {
    if (!this.valid) return;
    this.dispatchEvent(new CustomEvent('sc-submit', { detail: this.parseNumeric(), bubbles: true, composed: true }));
  }

  render() {
    const req = new Set(this.schema.required ?? []);
    return html`
      ${this.keys().map((k) => {
        const prop = this.schema.properties[k];
        if (!prop) return html``;
        const err = this.errors[k] ?? '';
        if (prop.enum) {
          const label = `${k}${req.has(k) ? ' *' : ''}`;
          return html`<sc-select-input label=${label} .value=${this.values[k] ?? ''} .options=${prop.enum} @sc-input=${(e: Event) => this.onSelect(k, e)}></sc-select-input>`;
        }
        const unit = prop['x-unit'] ?? '';
        const tip = prop.description ?? '';
        const def = prop.default !== undefined ? String(prop.default) : '';
        return html`<div class="fld">
          <label>${k}${req.has(k) ? ' *' : ''}${tip ? html`<span class="tip" title=${tip}>i</span>` : ''}${unit ? html`<span class="unit">${unit}</span>` : ''}</label>
          <input type="number" .value=${this.values[k] ?? ''} placeholder=${def}
            min=${prop.minimum !== undefined ? String(prop.minimum) : prop.exclusiveMinimum !== undefined ? String(prop.exclusiveMinimum) : ''}
            max=${prop.maximum !== undefined ? String(prop.maximum) : prop.exclusiveMaximum !== undefined ? String(prop.exclusiveMaximum) : ''}
            @input=${(e: Event) => this.onField(k, (e.target as HTMLInputElement).value)} />
          ${err ? html`<div class="err">${err}</div>` : html``}
        </div>`;
      })}
      <button ?disabled=${!this.valid} @click=${this.onSubmit}>${this.submitLabel}</button>
    `;
  }
}

if (!customElements.get('sc-form-renderer')) customElements.define('sc-form-renderer', ScFormRenderer);
