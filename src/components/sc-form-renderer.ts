import { LitElement, html, css } from 'lit';
import './sc-unit-input.js';

interface FieldSchema {
  type?: string; enum?: string[]; minimum?: number; maximum?: number;
  exclusiveMinimum?: number; exclusiveMaximum?: number;
  default?: number | string; description?: string;
  'x-unit'?: string; 'x-dimension'?: string;
}
interface Preset { label: string; values: Record<string, number>; }
export interface FormSchema {
  type: string; required?: string[];
  properties: Record<string, FieldSchema>;
  'x-presets'?: Preset[];
}

/** Generic A-G form: defaults, unit picker/label, live validation, tooltips, presets, real-time. */
export class ScFormRenderer extends LitElement {
  static properties = { schema: { type: Object }, submitLabel: { type: String } };
  declare schema: FormSchema;
  declare submitLabel: string;
  private values: Record<string, string> = {};
  private errors: Record<string, string> = {};

  constructor() { super(); this.schema = { type: 'object', properties: {} }; this.submitLabel = 'Calculate'; }

  private keys(): string[] { return Object.keys(this.schema.properties ?? {}); }

  private validateField(k: string, raw: string): string {
    const p = this.schema.properties[k];
    if (!p) return '';
    if (raw === '') return (this.schema.required ?? []).includes(k) ? 'Required' : '';
    if (p.enum) return p.enum.includes(raw) ? '' : 'Invalid option';
    const n = Number(raw);
    if (!Number.isFinite(n)) return 'Must be a number';
    if (p.minimum !== undefined && n < p.minimum) return `Must be >= ${p.minimum}`;
    if (p.exclusiveMinimum !== undefined && n <= p.exclusiveMinimum) return `Must be > ${p.exclusiveMinimum}`;
    if (p.maximum !== undefined && n > p.maximum) return `Must be <= ${p.maximum}`;
    if (p.exclusiveMaximum !== undefined && n >= p.exclusiveMaximum) return `Must be < ${p.exclusiveMaximum}`;
    return '';
  }

  private onField(k: string, value: string) {
    this.values[k] = value;
    this.errors[k] = this.validateField(k, value);
    this.requestUpdate();
    this.emit(); // G: real-time — every keystroke
  }

  private applyPreset(p: Preset) {
    for (const k of this.keys()) {
      const v = p.values[k];
      if (v !== undefined) {
        const raw = String(v);
        this.values[k] = raw;
        this.errors[k] = this.validateField(k, raw);
      }
    }
    this.requestUpdate();
    this.emit();
  }

  private emit() {
    const parsed: Record<string, unknown> = {};
    for (const k of this.keys()) {
      const raw = this.values[k];
      const p = this.schema.properties[k];
      if (p?.enum) { if (raw) parsed[k] = raw; continue; }
      if (raw !== '' && raw !== undefined) { const n = Number(raw); if (Number.isFinite(n)) parsed[k] = n; }
    }
    this.dispatchEvent(new CustomEvent('sc-submit', { detail: parsed, bubbles: true, composed: true }));
  }

  render() {
    const req = new Set(this.schema.required ?? []);
    const presets = this.schema['x-presets'] ?? [];
    return html`
      ${presets.length ? html`<div class="presets"><label>Preset</label>
        <select @change=${(e: Event) => { const p = presets.find((x) => x.label === (e.target as HTMLSelectElement).value); if (p) this.applyPreset(p); }}>
          <option value="">Custom</option>${presets.map((p) => html`<option value=${p.label}>${p.label}</option>`)}
        </select></div>` : ''}
      ${this.keys().map((k) => {
        const p = this.schema.properties[k];
        if (!p) return html``;
        const label = `${k}${req.has(k) ? ' *' : ''}`;
        const err = this.errors[k] ?? '';
        if (p.enum) {
          return html`<div class="fld"><label>${label}${p.description ? html`<span class="tip" title=${p.description}>i</span>` : ''}</label>
            <select .value=${this.values[k] ?? ''} @change=${(e: Event) => this.onField(k, (e.target as HTMLSelectElement).value)}>
              ${p.enum.map((o) => html`<option value=${o} ?selected=${o === this.values[k]}>${o}</option>`)}
            </select></div>`;
        }
        const dim = p['x-dimension'];
        if (dim) {
          return html`<sc-unit-input label=${label} dimension=${dim} unit=${dim === 'length' ? 'mm' : dim === 'pressure' ? 'MPa' : ''}
            .value=${this.values[k] ?? ''} placeholder=${p.default !== undefined ? String(p.default) : ''}
            tooltip=${p.description ?? ''} min=${String(p.minimum ?? p.exclusiveMinimum ?? '')} max=${String(p.maximum ?? p.exclusiveMaximum ?? '')}
            errorMessage=${err} @sc-unit-change=${(e: Event) => this.onField(k, (e as CustomEvent<{ value: string }>).detail.value)}></sc-unit-input>`;
        }
        return html`<div class="fld"><label>${label}${p.description ? html`<span class="tip" title=${p.description}>i</span>` : ''}${p['x-unit'] ? html`<span class="unit">${p['x-unit']}</span>` : ''}</label>
          <input type="number" class=${err ? 'invalid' : ''} .value=${this.values[k] ?? ''} placeholder=${p.default !== undefined ? String(p.default) : ''}
            @input=${(e: Event) => this.onField(k, (e.target as HTMLInputElement).value)} />
          ${err ? html`<div class="err">${err}</div>` : ''}</div>`;
      })}
    `;
  }

  static styles = css`
    :host { display: block; }
    .presets { display: flex; align-items: center; gap: 8px; margin-bottom: 12px; }
    .presets label { font: 600 13px var(--sc-sans, system-ui); }
    .presets select { height: 36px; border: 1px solid #dfe6e9; border-radius: 6px; padding: 0 8px; }
    .fld { margin-bottom: 10px; }
    .fld label { display: flex; align-items: center; gap: 6px; font: 600 13px var(--sc-sans, system-ui); margin-bottom: 4px; }
    .tip { display: inline-flex; align-items: center; justify-content: center; width: 15px; height: 15px; border-radius: 50%; background: #dfe6e9; font: 700 10px var(--sc-sans, system-ui); cursor: help; }
    .unit { font: 600 11px var(--sc-mono, monospace); color: var(--sc-muted, #636e72); }
    .fld input, .fld select { width: 100%; height: 40px; font: 15px var(--sc-mono, monospace); padding: 0 10px; border: 1px solid #dfe6e9; border-radius: 8px; box-sizing: border-box; }
    .fld input.invalid { border-color: #e74c3c; background: #fdedec; }
    .err { color: #e74c3c; font: 12px var(--sc-sans, system-ui); margin-top: 4px; }
  `;
}
if (!customElements.get('sc-form-renderer')) customElements.define('sc-form-renderer', ScFormRenderer);
