import { LitElement, html, css } from 'lit';
import { jsPDF } from 'jspdf';
import { buildWeldReportLines } from '../lib/weld-pdf-builder.js';
import type { WeldPdfInput } from '../lib/weld-pdf-builder.js';

/** SC-001 PDF shell. Lines from weld-pdf-builder (pure, tested). save() browser-only. */
export class ScWeldPdf extends LitElement {
  static properties = { input: { type: Object } };
  static styles = css`
    button { height: 44px; min-width: 180px; font: 700 14px var(--sc-sans, system-ui); color: #fff;
             background: var(--sc-steel, #2d3436); border: none; border-radius: 8px; cursor: pointer; }
    button:disabled { background: #b2bec3; cursor: not-allowed; }
  `;

  declare input: WeldPdfInput | null;
  constructor() { super(); this.input = null; }

  private download() {
    if (!this.input) return;
    const lines = buildWeldReportLines(this.input);
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    let y = 48;
    for (const line of lines) {
      const size = line.style === 'title' ? 16 : line.style === 'hero' ? 20 : line.style === 'head' ? 12 : 10;
      doc.setFontSize(size);
      doc.text(line.text, 48, y);
      y += size + 6;
      if (y > 780) { doc.addPage(); y = 48; }
    }
    doc.save('sectorcalc-SC-001.pdf');
  }

  render() {
    return html`<button ?disabled=${this.input === null} @click=${this.download}>Download PDF report</button>`;
  }
}

if (!customElements.get('sc-weld-pdf')) customElements.define('sc-weld-pdf', ScWeldPdf);
