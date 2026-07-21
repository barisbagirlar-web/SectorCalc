import { LitElement, html, css } from 'lit';

export interface StackComponent { name: string; nominal: string; tol: string; distribution: 'normal' | 'uniform'; cpk: string; }
export interface StackSpec { usl: string; lsl: string; target: string; seed: string; iterations: string; }
export interface StackChange { spec: StackSpec; components: StackComponent[]; }

export class ScStackEditor extends LitElement {
  static properties = { spec: { type: Object }, components: { type: Array } };
  static styles = css`
    :host { display: block; }
    table { width: 100%; border-collapse: collapse; font: 13px var(--sc-sans, system-ui); }
    th, td { padding: 4px; text-align: left; }
    input, select { width: 100%; height: 36px; font: 14px var(--sc-mono, monospace); padding: 0 6px; box-sizing: border-box; border: 1px solid #dfe6e9; border-radius: 6px; }
    .spec { display: grid; grid-template-columns: repeat(5, 1fr); gap: 8px; margin-bottom: 12px; }
    .spec label { font: 11px var(--sc-sans, system-ui); color: var(--sc-muted, #636e72); display: block; }
    button { height: 36px; font: 600 13px var(--sc-sans, system-ui); border: none; border-radius: 6px; cursor: pointer; }
    .add { background: var(--sc-rust, #d35400); color: #fff; margin-top: 8px; }
    .rm { background: #ecf0f1; color: #2d3436; }
    h3 { font: 700 14px var(--sc-sans, system-ui); margin: 8px 0; }
  `;

  declare spec: StackSpec;
  declare components: StackComponent[];

  constructor() {
    super();
    this.spec = { usl: '31.5', lsl: '28.5', target: '30', seed: '12345', iterations: '5000' };
    this.components = [
      { name: 'Part A', nominal: '10', tol: '0.2', distribution: 'normal', cpk: '' },
      { name: 'Part B', nominal: '20', tol: '0.3', distribution: 'normal', cpk: '' }
    ];
  }

  private emit() {
    const detail: StackChange = { spec: this.spec, components: this.components };
    this.dispatchEvent(new CustomEvent('sc-stack-change', { detail, bubbles: true, composed: true }));
  }
  private setSpec(field: keyof StackSpec, value: string) { this.spec = { ...this.spec, [field]: value }; this.emit(); }
  private setComp(i: number, field: keyof StackComponent, value: string) {
    this.components = this.components.map((c, idx) => (idx === i ? { ...c, [field]: value } : c));
    this.emit();
  }
  private add() {
    const letter = String.fromCharCode(65 + this.components.length);
    this.components = [...this.components, { name: `Part ${letter}`, nominal: '0', tol: '0.1', distribution: 'normal', cpk: '' }];
    this.emit();
  }
  private removeComp(i: number) {
    if (this.components.length <= 1) return;
    this.components = this.components.filter((_, idx) => idx !== i);
    this.emit();
  }

  render() {
    return html`
      <h3>Specification</h3>
      <div class="spec">
        <div><label>USL</label><input type="number" .value=${this.spec.usl} @input=${(e: Event) => this.setSpec('usl', (e.target as HTMLInputElement).value)} /></div>
        <div><label>LSL</label><input type="number" .value=${this.spec.lsl} @input=${(e: Event) => this.setSpec('lsl', (e.target as HTMLInputElement).value)} /></div>
        <div><label>Target</label><input type="number" .value=${this.spec.target} @input=${(e: Event) => this.setSpec('target', (e.target as HTMLInputElement).value)} /></div>
        <div><label>Seed</label><input type="number" .value=${this.spec.seed} @input=${(e: Event) => this.setSpec('seed', (e.target as HTMLInputElement).value)} /></div>
        <div><label>Iterations</label><input type="number" .value=${this.spec.iterations} @input=${(e: Event) => this.setSpec('iterations', (e.target as HTMLInputElement).value)} /></div>
      </div>
      <h3>Components (tolerance chain)</h3>
      <table>
        <tr><th>Name</th><th>Nominal</th><th>Tol (+/-)</th><th>Distribution</th><th>Cpk</th><th></th></tr>
        ${this.components.map((c, i) => html`
          <tr>
            <td><input .value=${c.name} @input=${(e: Event) => this.setComp(i, 'name', (e.target as HTMLInputElement).value)} /></td>
            <td><input type="number" .value=${c.nominal} @input=${(e: Event) => this.setComp(i, 'nominal', (e.target as HTMLInputElement).value)} /></td>
            <td><input type="number" .value=${c.tol} @input=${(e: Event) => this.setComp(i, 'tol', (e.target as HTMLInputElement).value)} /></td>
            <td><select .value=${c.distribution} @change=${(e: Event) => this.setComp(i, 'distribution', (e.target as HTMLSelectElement).value)}>
              <option value="normal">normal</option><option value="uniform">uniform</option>
            </select></td>
            <td><input type="number" .value=${c.cpk} placeholder="1.0" @input=${(e: Event) => this.setComp(i, 'cpk', (e.target as HTMLInputElement).value)} /></td>
            <td><button class="rm" @click=${() => this.removeComp(i)}>x</button></td>
          </tr>`)}
      </table>
      <button class="add" @click=${this.add}>+ Add component</button>
    `;
  }
}
if (!customElements.get('sc-stack-editor')) customElements.define('sc-stack-editor', ScStackEditor);
