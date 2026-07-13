#!/usr/bin/env node

import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();
const formPath = resolve(root, "src/sectorcalc/pro-form/UniversalIndustrialDecisionForm.tsx");
const cssPath = resolve(root, "src/sectorcalc/pro-form/universal-industrial-decision-form.css");
let form = readFileSync(formPath, "utf8");
let css = readFileSync(cssPath, "utf8");

function replaceOnce(source, target, label) {
  const first = form.indexOf(source);
  const last = form.lastIndexOf(source);
  if (first < 0 || first !== last) {
    throw new Error(`${label}: expected exactly one source block`);
  }
  form = form.slice(0, first) + target + form.slice(first + source.length);
}

replaceOnce(
  `// ── Component ──────────────────────────────────────────────────────────────────

export function UniversalIndustrialDecisionForm`,
  `const PROFILE_MODE_COPY: Record<ProfileMode, string> = {
  quick: "Fast decision view — essential inputs and the primary decision only.",
  engineering: "Engineering view — normalized units, references, evidence, and technical controls.",
  cost: "Cost view — monetary drivers, exposure, and commercial decision outputs.",
  audit: "Audit view — source verification, traceability, and report controls.",
};

const PROFILE_MODE_LABELS: Record<ProfileMode, string> = {
  quick: "Quick",
  engineering: "Engineering",
  cost: "Cost",
  audit: "Audit",
};

// ── Component ──────────────────────────────────────────────────────────────────

export function UniversalIndustrialDecisionForm`,
  "profile mode copy",
);

replaceOnce(
  `      })()}
    </>
  );`,
  `      })()}
      {isPro && (
        <div className="sc-v531-mode-panel">
          <div className="sc-v531-mode-tabs" role="tablist" aria-label="Calculation view">
            {(["quick", "engineering", "cost", "audit"] as ProfileMode[]).map((mode) => {
              const active = state.profileModeState.mode === mode;
              return (
                <button
                  key={mode}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  className="sc-v531-mode-tab"
                  data-active={active ? "true" : "false"}
                  onClick={() => machine.setProfileMode(mode)}
                >
                  {PROFILE_MODE_LABELS[mode]}
                </button>
              );
            })}
          </div>
          <p className="sc-v531-view-description">
            {PROFILE_MODE_COPY[state.profileModeState.mode]}
          </p>
        </div>
      )}
    </>
  );`,
  "profile mode controls",
);

replaceOnce(
  `      {/* Clean reference helper — one line per input, "Currency" placeholder replaced */}
      {field.cleanReferenceHelper && (
        <p className="sc-v531-ref-helper">{replaceCurrencyLabel(field.cleanReferenceHelper, currencyCode)}</p>
      )}
    </div>`,
  `      {/* Clean reference helper — one line per input, "Currency" placeholder replaced */}
      {field.cleanReferenceHelper && (
        <p className="sc-v531-ref-helper">{replaceCurrencyLabel(field.cleanReferenceHelper, currencyCode)}</p>
      )}

      {!isFreeTier && (
        <div className="sc-v531-field-reference" aria-label={`${field.label} reference controls`}>
          <div className="sc-v531-field-reference-strip">
            {field.referenceStrip.map((line) => (
              <span key={line} className="sc-v531-ref-line">
                {replaceCurrencyLabel(line, currencyCode)}
              </span>
            ))}
          </div>
          {field.referenceSource && (
            <p className="sc-v531-ref-line">
              <strong>Source:</strong> {field.referenceSource}
            </p>
          )}
          {field.tolerancePct && (
            <p className="sc-v531-field-tolerance">
              <strong>Declared span:</strong> {field.tolerancePct}
            </p>
          )}
        </div>
      )}

      {!isFreeTier && (
        <fieldset className="sc-v531-field-evidence">
          <legend className="sc-v531-evidence-title">{field.evidence.evidenceLabel}</legend>
          <div className="sc-v531-evidence-options">
            <label>
              <input
                type="checkbox"
                checked={field.evidence.valueVerified}
                onChange={(event) =>
                  onEvidenceChange(event.target.checked, field.evidence.sourceVerified)
                }
              />
              Value verified
            </label>
            <label>
              <input
                type="checkbox"
                checked={field.evidence.sourceVerified}
                onChange={(event) =>
                  onEvidenceChange(field.evidence.valueVerified, event.target.checked)
                }
              />
              Source record checked
            </label>
          </div>
        </fieldset>
      )}
    </div>`,
  "field reference and evidence controls",
);

replaceOnce(
  `    <section className="sc-v531-advanced-section" aria-label="Formula logic">
      <h3 className="sc-v531-advanced-title">Formula logic</h3>
      <p className="sc-v531-methodology-text">{formulaText}</p>`,
  `    <section className="sc-v531-advanced-section" aria-label="Protected methodology">
      <h3 className="sc-v531-advanced-title">Protected methodology</h3>
      <p className="sc-v531-methodology-text"><strong>Formula logic:</strong> {formulaText}</p>`,
  "protected methodology heading",
);

const cssMarker = "/* V5.3.1 evidence and profile controls — production contract */";
if (css.includes(cssMarker)) {
  throw new Error("UX hardening CSS already exists");
}
css += `

${cssMarker}
.sc-v531-mode-panel {
  margin-top: 16px;
  padding-top: 14px;
  border-top: 1px solid var(--sc-v531-line);
}

.sc-v531-mode-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.sc-v531-mode-tab {
  min-height: 38px;
  padding: 8px 14px;
  border: 1px solid var(--sc-v531-line);
  background: var(--sc-v531-surface);
  color: var(--sc-v531-muted);
  font: inherit;
  font-weight: 600;
  cursor: pointer;
}

.sc-v531-mode-tab[data-active="true"] {
  border-color: var(--sc-v531-accent, #C65B35);
  color: var(--sc-v531-fg);
  box-shadow: inset 0 -2px 0 var(--sc-v531-accent, #C65B35);
}

.sc-v531-mode-tab:focus-visible,
.sc-v531-field-evidence input:focus-visible {
  outline: 3px solid color-mix(in srgb, var(--sc-v531-accent, #C65B35) 35%, transparent);
  outline-offset: 2px;
}

.sc-v531-view-description {
  margin: 10px 0 0;
  color: var(--sc-v531-muted);
  font-size: 0.9rem;
  line-height: 1.45;
}

.sc-v531-field-reference {
  margin-top: 12px;
  padding-top: 10px;
  border-top: 1px solid var(--sc-v531-line);
}

.sc-v531-field-reference-strip {
  display: grid;
  gap: 4px;
}

.sc-v531-ref-line,
.sc-v531-field-tolerance {
  margin: 0;
  color: var(--sc-v531-muted);
  font-size: 0.78rem;
  line-height: 1.4;
}

.sc-v531-field-evidence {
  margin: 12px 0 0;
  padding: 10px 12px;
  border: 1px solid var(--sc-v531-line);
  min-width: 0;
}

.sc-v531-evidence-title {
  padding: 0 6px;
  color: var(--sc-v531-fg);
  font-size: 0.78rem;
  font-weight: 700;
}

.sc-v531-evidence-options {
  display: flex;
  flex-wrap: wrap;
  gap: 10px 16px;
}

.sc-v531-evidence-options label {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  color: var(--sc-v531-muted);
  font-size: 0.78rem;
  cursor: pointer;
}

.sc-v531-evidence-options input {
  inline-size: 16px;
  block-size: 16px;
  margin: 0;
}

@media (max-width: 640px) {
  .sc-v531-mode-tabs {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .sc-v531-mode-tab {
    width: 100%;
  }

  .sc-v531-evidence-options {
    display: grid;
  }
}
`;

writeFileSync(formPath, form, "utf8");
writeFileSync(cssPath, css, "utf8");
console.log("V531_FORM_UX_HARDENING=APPLIED");
