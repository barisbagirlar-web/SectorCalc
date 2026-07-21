import { LitElement, html, css } from 'lit';
import { PRESETS } from '../lib/stack-presets.js';
import './sc-unit-input.js';

export interface StackComponent { name: string; nominal: string; nominalUnit: string; tol: string; tolUnit: string; distribution: 'normal' | 'uniform'; cpk: string; }
export interface StackSpec { usl: string; uslUnit: string; lsl: string; lslUnit: string; target: string; targetUnit: string; seed: string; iterations: string; }
export interface StackChange { spec: StackSpec; components: StackComponent[]; }

export class ScStackEditor extends LitElement {
  static properties = { spec: { type: Object }, components: { type: Array } };

  declare spec: StackSpec;
  declare components: StackComponent[];

  constructor() {
    super();
    this.spec = { usl: '31.5', uslUnit: 'mm', lsl: '28.5', lslUnit: 'mm', target: '30', targetUnit: 'mm', seed: '12345', iterations: '5000' };
    this.components = [
      { name: 'Part A', nominal: '10', nominalUnit: 'mm', tol: '0.2', tolUnit: 'mm', distribution: 'normal', cpk: '' },
      { name: 'Part B', nominal: '20', nominalUnit: 'mm', tol: '0.3', tolUnit: 'mm', distribution: 'normal', cpk: '' }
    ];
  }

  private emit() {
    this.dispatchEvent(new CustomEvent('sc-stack-change', { detail: { spec: this.spec, components: this.components }, bubbles: true, composed: true }));
  }

  private onPreset(e: Event) {
    const p = PRESETS.find((x) => x.id === (e.target as HTMLSelectElement).value);
    if (!p) return;
    this.spec = { usl: p.spec.usl, uslUnit: 'mm', lsl: p.spec.lsl, lslUnit: 'mm', target: p.spec.target, targetUnit: 'mm', seed: p.spec.seed, iterations: p.spec.iterations };
    this.components = p.components.map((c) => ({ ...c, nominalUnit: 'mm', tolUnit: 'mm' }));
    this.emit();
  }

  private onUnitField(e: Event) {
    const key = (e.target as HTMLElement).dataset.key ?? '';
    const d = (e as CustomEvent).detail as { value: string; unit: string };
    if (key === 'spec-usl') this.spec = { ...this.spec, usl: d.value, uslUnit: d.unit };
    else if (key === 'spec-lsl') this.spec = { ...this.spec, lsl: d.value, lslUnit: d.unit };
    else if (key === 'spec-target') this.spec = { ...this.spec, target: d.value, targetUnit: d.unit };
    else if (key.startsWith('comp-')) {
      const parts = key.split('-'); // comp-<i>-<nominal|tol>
      const idx = Number(parts[1]);
      const field = parts[2];
      this.components = this.components.map((c, i) => (i === idx ? { ...c, [field!]: d.value, [field! + 'Unit']: d.unit } : c));
    }
    this.emit();
  }

  private onSeed(e: Event) { this.spec = { ...this.spec, seed: (e.target as HTMLInputElement).value }; this.emit(); }
  private onIter(e: Event) { this.spec = { ...this.spec, iterations: (e.target as HTMLInputElement).value }; this.emit(); }
  private onName(i: number, e: Event) { this.components = this.components.map((c, ci) => (ci === i ? { ...c, name: (e.target as HTMLInputElement).value } : c)); this.emit(); }
  private onDist(i: number, e: Event) { this.components = this.components.map((c, ci) => (ci === i ? { ...c, distribution: (e.target as HTMLSelectElement).value as 'normal' | 'uniform' } : c)); this.emit(); }
  private onCpk(i: number, e: Event) { this.components = this.components.map((c, ci) => (ci === i ? { ...c, cpk: (e.target as HTMLInputElement).value } : c)); this.emit(); }

  private add() {
    const letter = String.fromCharCode(65 + this.components.length);
    this.components = [...this.components, { name: `Part ${letter}`, nominal: '0', nominalUnit: 'mm', tol: '0.1', tolUnit: 'mm', distribution: 'normal', cpk: '' }];
    this.emit();
  }

  private removeComp(i: number) {
    if (this.components.length <= 1) return;
    this.components = this.components.filter((_, idx) => idx !== i);
    this.emit();
  }

  render() {
    return html`
      <div class="preset">
        <label>Preset</label>
        <select @change=${this.onPreset}>
          <option value="">Custom</option>
          ${PRESETS.map((p) => html`<option value=${p.id}>${p.label}</option>`)}
        </select>
      </div>
      <h3>Specification</h3>
      <div class="spec">
        <sc-unit-input label="USL" dimension="length" unit=${this.spec.uslUnit} .value=${this.spec.usl} placeholder="31.5" data-key="spec-usl" @sc-unit-change=${this.onUnitField}></sc-unit-input>
        <sc-unit-input label="LSL" dimension="length" unit=${this.spec.lslUnit} .value=${this.spec.lsl} placeholder="28.5" data-key="spec-lsl" @sc-unit-change=${this.onUnitField}></sc-unit-input>
        <sc-unit-input label="Target" dimension="length" unit=${this.spec.targetUnit} .value=${this.spec.target} placeholder="30" data-key="spec-target" @sc-unit-change=${this.onUnitField}></sc-unit-input>
        <div class="plain"><label>Seed</label><input type="number" .value=${this.spec.seed} @input=${this.onSeed} /></div>
        <div class="plain"><label>Iterations</label><input type="number" .value=${this.spec.iterations} @input=${this.onIter} /></div>
      </div>
      <h3>Components (tolerance chain)</h3>
      <table>
        <tr><th>Name</th><th>Nominal</th><th>Tol (+/-)</th><th>Dist</th><th>Cpk</th><th></th></tr>
        ${this.components.map((c, i) => html`
          <tr>
            <td><input .value=${c.name} @input=${(e: Event) => this.onName(i, e)} /></td>
            <td><sc-unit-input dimension="length" unit=${c.nominalUnit} .value=${c.nominal} placeholder="10" data-key="comp-${i}-nominal" @sc-unit-change=${this.onUnitField}></sc-unit-input></td>
            <td><sc-unit-input dimension="length" unit=${c.tolUnit} .value=${c.tol} placeholder="0.2" data-key="comp-${i}-tol" @sc-unit-change=${this.onUnitField}></sc-unit-input></td>
            <td><select .value=${c.distribution} @change=${(e: Event) => this.onDist(i, e)}><option value="normal">normal</option><option value="uniform">uniform</option></select></td>
            <td><input type="number" .value=${c.cpk} placeholder="1.0" @input=${(e: Event) => this.onCpk(i, e)} /></td>
            <td><button class="rm" @click=${() => this.removeComp(i)}>x</button></td>
          </tr>`)}
      </table>
      <button class="add" @click=${this.add}>+ Add component</button>
    `;
  }

  static styles = css`
    :host { display: block; }
    .preset { display: flex; align-items: center; gap: 8px; margin-bottom: 12px; }
    .preset label { font: 600 13px var(--sc-sans, system-ui); }
    .preset select { height: 36px; font: 14px var(--sc-sans, system-ui); border: 1px solid #dfe6e9; border-radius: 6px; padding: 0 8px; }
    h3 { font: 700 14px var(--sc-sans, system-ui); margin: 8px 0; }
    .spec { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 12px; }
    .plain label { display: block; font: 11px var(--sc-sans, system-ui); color: var(--sc-muted, #636e72); }
    .plain input { width: 100%; height: 36px; font: 14px var(--sc-mono, monospace); padding: 0 8px; border: 1px solid #dfe6e9; border-radius: 6px; box-sizing: border-box; }
    table { width: 100%; border-collapse: collapse; font: 13px var(--sc-sans, system-ui); }
    th, td { padding: 4px; text-align: left; vertical-align: top; }
    td input, td select { width: 100%; height: 34px; font: 13px var(--sc-mono, monospace); padding: 0 6px; border: 1px solid #dfe6e9; border-radius: 6px; box-sizing: border-box; }
    button { height: 34px; font: 600 13px var(--sc-sans, system-ui); border: none; border-radius: 6px; cursor: pointer; }
    .add { background: var(--sc-rust, #d35400); color: #fff; margin-top: 8px; }
    .rm { background: #ecf0f1; color: #2d3436; }
  `;
}
if (!customElements.get('sc-stack-editor')) customElements.define('sc-stack-editor', ScStackEditor);
