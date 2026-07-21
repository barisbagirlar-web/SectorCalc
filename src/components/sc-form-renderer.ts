import { LitElement, html, css } from 'lit';
import { validate } from '../core/validator.js';
import './sc-number-input.js';
import './sc-select-input.js';

/**
 * Schema-driven form. Reads a JSON Schema (Draft 2020-12) and renders one
 * control per property: number -> sc-number-input, enum -> sc-select-input.
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
  }>;
}

export class ScFormRenderer extends LitElement {
  static override properties = {
    schema: { type: Object },
    submitLabel: { type: String }
  };

  static override styles = css`
    :host { display: block; }
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
    // required-but-empty surfaces as a friendly message
    for (const k of this.schema.required ?? []) {
      if (this.values[k] === undefined || this.values[k] === '') {
        next[k] = next[k] ?? 'required';
      }
    }
    this.errors = next;
  }

  private onField(key: string, e: Event) {
    this.values[key] = (e as CustomEvent).detail as string;
    this.revalidate();
    this.requestUpdate();
  }

  private get valid(): boolean {
    this.revalidate();
    return Object.keys(this.errors).length === 0;
  }

  private onSubmit() {
    if (!this.valid) return;
    this.dispatchEvent(new CustomEvent('sc-submit', { detail: this.parseNumeric(), bubbles: true, composed: true }));
  }

  override render() {
    const req = new Set(this.schema.required ?? []);
    return html`
      ${this.keys().map((k) => {
        const prop = this.schema.properties[k];
        const label = `${k}${req.has(k) ? ' *' : ''}`;
        const err = this.errors[k] ?? '';
        if (prop?.enum) {
          return html`<sc-select-input label=${label} .value=${this.values[k] ?? ''} .options=${prop.enum} @sc-input=${(e: Event) => this.onField(k, e)}></sc-select-input>`;
        }
        return html`<sc-number-input label=${label} .value=${this.values[k] ?? ''}
          min=${prop?.minimum !== undefined ? String(prop.minimum) : prop?.exclusiveMinimum !== undefined ? String(prop.exclusiveMinimum) : ''}
          max=${prop?.maximum !== undefined ? String(prop.maximum) : prop?.exclusiveMaximum !== undefined ? String(prop.exclusiveMaximum) : ''}
          .errorMessage=${err} @sc-input=${(e: Event) => this.onField(k, e)}></sc-number-input>`;
      })}
      <button ?disabled=${!this.valid} @click=${this.onSubmit}>${this.submitLabel}</button>
    `;
  }
}

if (!customElements.get('sc-form-renderer')) customElements.define('sc-form-renderer', ScFormRenderer);
