"use client";

import { useCallback, useMemo, useState } from "react";
import { AdminAuthBar } from "@/components/admin/AdminAuthPanel";
import { AdminSubNav } from "@/components/admin/AdminSubNav";
import { useAdminAuth } from "@/lib/features/admin/use-admin-auth";
import { FORMULA_FAMILIES, FORMULA_FAMILY_LABELS } from "@/lib/features/premium-schema/formula-families";
import { FORMULA_REGISTRY_META, getFormulaRegistryMeta } from "@/lib/features/premium-schema/formula-registry";
import type { ExportFormat, PremiumOutputFormat } from "@/lib/features/premium-schema/premium-calculator-schema";
import {
  createDraftFormulaStep,
  createDraftInput,
  createDraftOutput,
  createEmptyPremiumSchemaDraft,
  draftToJson,
  draftToPremiumSchema,
  draftToTypeScriptExport,
  listReportSectionOptions,
  validatePremiumSchemaDraft,
  type DraftFormulaStep,
  type DraftInput,
  type DraftOutput,
  type DraftThreshold,
  type PremiumSchemaDraft,
} from "@/lib/features/premium-schema/schema-draft";
import { lintPremiumCalculatorSchema } from "@/lib/features/premium-schema/schema-linter";

const FIELD =
  "w-full min-h-[44px] rounded-lg border border-slate/25 bg-white px-3 text-sm text-deep-navy focus:border-professional-blue focus:outline-none focus:ring-2 focus:ring-professional-blue/20";

const TEXTAREA =
  "w-full min-h-[88px] rounded-lg border border-slate/25 bg-white px-3 py-2 text-sm text-deep-navy focus:border-professional-blue focus:outline-none focus:ring-2 focus:ring-professional-blue/20";

const BTN =
  "inline-flex min-h-[44px] items-center justify-center rounded-lg border border-slate/25 bg-white px-4 text-sm font-semibold text-deep-navy transition-colors hover:border-professional-blue/40 hover:bg-off-white";

const BTN_PRIMARY =
  "inline-flex min-h-[44px] items-center justify-center rounded-lg bg-professional-blue px-4 text-sm font-semibold text-white transition-colors hover:bg-black disabled:cursor-not-allowed disabled:opacity-50";

const OUTPUT_FORMATS: PremiumOutputFormat[] = [
  "currency",
  "percentage",
  "number",
  "duration",
  "score",
];

const EXPORT_FORMATS: ExportFormat[] = ["pdf", "excel", "csv"];

const GENERATOR_STEPS = [
  "Basics",
  "Inputs",
  "Formula Pipeline",
  "Outputs",
  "Thresholds",
  "Report",
  "Preview / Export",
] as const;

type GeneratorStep = (typeof GENERATOR_STEPS)[number];

function StepPanel({
  step,
  activeStep,
  children,
}: {
  step: GeneratorStep;
  activeStep: GeneratorStep;
  children: React.ReactNode;
}) {
  const visible = activeStep === step;
  return <div className={visible ? "block" : "hidden xl:block"}>{children}</div>;
}

function Label({ children, htmlFor }: { children: string; htmlFor?: string }) {
  return (
    <span className="text-xs font-medium uppercase tracking-wide text-text-secondary">
      {htmlFor ? <label htmlFor={htmlFor}>{children}</label> : children}
    </span>
  );
}

function SectionCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="sc-admin-schema-section rounded-sm border border-slate/20 bg-white p-4 shadow-card sm:p-5">
      <h3 className="text-sm font-bold text-deep-navy">{title}</h3>
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  );
}

function updateDraftInput(
  draft: PremiumSchemaDraft,
  index: number,
  patch: Partial<DraftInput>
): PremiumSchemaDraft {
  const inputs = [...draft.inputs];
  inputs[index] = { ...inputs[index], ...patch };
  return { ...draft, inputs };
}

function updateFormulaStep(
  draft: PremiumSchemaDraft,
  index: number,
  patch: Partial<DraftFormulaStep>
): PremiumSchemaDraft {
  const formulaPipeline = [...draft.formulaPipeline];
  formulaPipeline[index] = { ...formulaPipeline[index], ...patch };
  return { ...draft, formulaPipeline };
}

function updateOutput(
  draft: PremiumSchemaDraft,
  index: number,
  patch: Partial<DraftOutput>
): PremiumSchemaDraft {
  const outputs = [...draft.outputs];
  outputs[index] = { ...outputs[index], ...patch };
  return { ...draft, outputs };
}

function updateThreshold(
  draft: PremiumSchemaDraft,
  index: number,
  patch: Partial<DraftThreshold>
): PremiumSchemaDraft {
  const thresholds = [...draft.thresholds];
  thresholds[index] = { ...thresholds[index], ...patch };
  return { ...draft, thresholds };
}

export function SchemaGeneratorClient() {
  const { loading: authLoading, isAdmin } = useAdminAuth();
  const [draft, setDraft] = useState<PremiumSchemaDraft>(() => createEmptyPremiumSchemaDraft());
  const [activeStep, setActiveStep] = useState<GeneratorStep>("Basics");
  const [copyMessage, setCopyMessage] = useState<string | null>(null);

  const validation = useMemo(() => validatePremiumSchemaDraft(draft), [draft]);
  const schemaPreview = useMemo(() => draftToPremiumSchema(draft), [draft]);
  const linterResult = useMemo(() => {
    if (!schemaPreview) {
      return null;
    }
    return lintPremiumCalculatorSchema(schemaPreview);
  }, [schemaPreview]);

  const fieldOptions = useMemo(() => {
    const ids = [
      ...draft.inputs.map((input) => input.id).filter(Boolean),
      ...draft.outputs.map((output) => output.id).filter(Boolean),
    ];
    return ids;
  }, [draft.inputs, draft.outputs]);

  const copyText = useCallback(async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopyMessage(`${label} copied.`);
      window.setTimeout(() => setCopyMessage(null), 2500);
    } catch {
      setCopyMessage(`Could not copy ${label.toLowerCase()}.`);
    }
  }, []);

  if (authLoading) {
    return (
      <p className="text-sm text-text-secondary" role="status">
        Checking admin session…
      </p>
    );
  }

  return (
    <div className="sc-admin-schema-generator min-w-0 space-y-6">
      <AdminSubNav />
      <AdminAuthBar />

      {!isAdmin ? (
        <p className="text-sm text-text-secondary">
          Schema Generator is available only to accounts with the admin claim.
        </p>
      ) : (
        <>
          <div className="rounded-sm border border-slate/20 bg-off-white px-4 py-3 text-sm text-deep-navy">
            <p className="font-semibold">Authoring only - no auto-publish</p>
            <p className="mt-1 text-text-secondary">
              Drafts stay in this session. Production schemas require developer review and git commit.
            </p>
          </div>

          <div className="xl:hidden">
            <label className="block space-y-1.5">
              <Label>Step</Label>
              <select
                value={activeStep}
                onChange={(event) => setActiveStep(event.target.value as GeneratorStep)}
                className={FIELD}
              >
                {GENERATOR_STEPS.map((step) => (
                  <option key={step} value={step}>
                    {step}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="sc-admin-schema-generator__layout">
            <div className="sc-admin-schema-generator__left space-y-4">
              <StepPanel step="Basics" activeStep={activeStep}>
                <SectionCard title="Schema basics">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block space-y-1.5 sm:col-span-2">
                      <Label htmlFor="draft-slug">Slug (schema id)</Label>
                      <input
                        id="draft-slug"
                        value={draft.slug}
                        onChange={(event) => setDraft({ ...draft, slug: event.target.value })}
                        className={FIELD}
                        placeholder="cnc-oee-loss"
                      />
                    </label>
                    <label className="block space-y-1.5 sm:col-span-2">
                      <Label htmlFor="draft-name">Name</Label>
                      <input
                        id="draft-name"
                        value={draft.name}
                        onChange={(event) => setDraft({ ...draft, name: event.target.value })}
                        className={FIELD}
                      />
                    </label>
                    <label className="block space-y-1.5">
                      <Label htmlFor="draft-sector">Sector slug</Label>
                      <input
                        id="draft-sector"
                        value={draft.sectorSlug}
                        onChange={(event) => setDraft({ ...draft, sectorSlug: event.target.value })}
                        className={FIELD}
                      />
                    </label>
                    <label className="block space-y-1.5">
                      <Label htmlFor="draft-category">Category</Label>
                      <select
                        id="draft-category"
                        value={draft.category}
                        onChange={(event) =>
                          setDraft({
                            ...draft,
                            category: event.target.value as PremiumSchemaDraft["category"],
                          })
                        }
                        className={FIELD}
                      >
                        <option value="">Select family</option>
                        {FORMULA_FAMILIES.map((family) => (
                          <option key={family} value={family}>
                            {FORMULA_FAMILY_LABELS[family]}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="block space-y-1.5 sm:col-span-2">
                      <Label htmlFor="draft-pain">Pain statement</Label>
                      <textarea
                        id="draft-pain"
                        value={draft.painStatement}
                        onChange={(event) => setDraft({ ...draft, painStatement: event.target.value })}
                        className={TEXTAREA}
                      />
                    </label>
                    <label className="block space-y-1.5 sm:col-span-2">
                      <Label htmlFor="draft-promise">Promise (authoring note)</Label>
                      <textarea
                        id="draft-promise"
                        value={draft.promise}
                        onChange={(event) => setDraft({ ...draft, promise: event.target.value })}
                        className={TEXTAREA}
                      />
                    </label>
                    <label className="block space-y-1.5 sm:col-span-2">
                      <Label htmlFor="draft-legacy">Legacy paid slug (optional)</Label>
                      <input
                        id="draft-legacy"
                        value={draft.legacyPaidSlug}
                        onChange={(event) => setDraft({ ...draft, legacyPaidSlug: event.target.value })}
                        className={FIELD}
                      />
                    </label>
                  </div>
                </SectionCard>
              </StepPanel>

              <StepPanel step="Inputs" activeStep={activeStep}>
                <SectionCard title="Inputs">
                  {draft.inputs.map((input, index) => (
                    <div key={`input-${index}`} className="space-y-3 rounded-lg border border-slate/15 p-3">
                      <div className="grid gap-3 sm:grid-cols-2">
                        <label className="block space-y-1.5">
                          <Label>Input id</Label>
                          <input
                            value={input.id}
                            onChange={(event) =>
                              setDraft(updateDraftInput(draft, index, { id: event.target.value }))
                            }
                            className={FIELD}
                          />
                        </label>
                        <label className="block space-y-1.5">
                          <Label>Label</Label>
                          <input
                            value={input.label}
                            onChange={(event) =>
                              setDraft(updateDraftInput(draft, index, { label: event.target.value }))
                            }
                            className={FIELD}
                          />
                        </label>
                        <label className="block space-y-1.5">
                          <Label>Type</Label>
                          <select
                            value={input.type}
                            onChange={(event) =>
                              setDraft(
                                updateDraftInput(draft, index, {
                                  type: event.target.value as DraftInput["type"],
                                })
                              )
                            }
                            className={FIELD}
                          >
                            <option value="number">number</option>
                            <option value="select">select</option>
                            <option value="slider">slider</option>
                            <option value="boolean">boolean</option>
                          </select>
                        </label>
                        <label className="block space-y-1.5">
                          <Label>Unit</Label>
                          <input
                            value={input.unit}
                            onChange={(event) =>
                              setDraft(updateDraftInput(draft, index, { unit: event.target.value }))
                            }
                            className={FIELD}
                          />
                        </label>
                        <label className="block space-y-1.5">
                          <Label>Smart default</Label>
                          <input
                            value={input.smartDefault}
                            onChange={(event) =>
                              setDraft(updateDraftInput(draft, index, { smartDefault: event.target.value }))
                            }
                            className={FIELD}
                          />
                        </label>
                        <label className="flex min-h-[44px] items-center gap-2">
                          <input
                            type="checkbox"
                            checked={input.required}
                            onChange={(event) =>
                              setDraft(updateDraftInput(draft, index, { required: event.target.checked }))
                            }
                          />
                          <span className="text-sm text-deep-navy">Required</span>
                        </label>
                        <label className="block space-y-1.5">
                          <Label>Min</Label>
                          <input
                            value={input.min}
                            onChange={(event) =>
                              setDraft(updateDraftInput(draft, index, { min: event.target.value }))
                            }
                            className={FIELD}
                          />
                        </label>
                        <label className="block space-y-1.5">
                          <Label>Max</Label>
                          <input
                            value={input.max}
                            onChange={(event) =>
                              setDraft(updateDraftInput(draft, index, { max: event.target.value }))
                            }
                            className={FIELD}
                          />
                        </label>
                        <label className="block space-y-1.5 sm:col-span-2">
                          <Label>Helper</Label>
                          <input
                            value={input.helper}
                            onChange={(event) =>
                              setDraft(updateDraftInput(draft, index, { helper: event.target.value }))
                            }
                            className={FIELD}
                          />
                        </label>
                        <label className="block space-y-1.5 sm:col-span-2">
                          <Label>Expert meaning</Label>
                          <input
                            value={input.expertMeaning}
                            onChange={(event) =>
                              setDraft(updateDraftInput(draft, index, { expertMeaning: event.target.value }))
                            }
                            className={FIELD}
                          />
                        </label>
                      </div>
                      <button
                        type="button"
                        className={BTN}
                        onClick={() =>
                          setDraft({
                            ...draft,
                            inputs: draft.inputs.filter((_, rowIndex) => rowIndex !== index),
                          })
                        }
                      >
                        Remove input
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    className={BTN_PRIMARY}
                    onClick={() => setDraft({ ...draft, inputs: [...draft.inputs, createDraftInput()] })}
                  >
                    Add input
                  </button>
                </SectionCard>
              </StepPanel>

              <StepPanel step="Outputs" activeStep={activeStep}>
                <SectionCard title="Outputs">
                  {draft.outputs.map((output, index) => (
                    <div key={`output-${index}`} className="space-y-3 rounded-lg border border-slate/15 p-3">
                      <div className="grid gap-3 sm:grid-cols-2">
                        <label className="block space-y-1.5">
                          <Label>Output id</Label>
                          <input
                            value={output.id}
                            onChange={(event) =>
                              setDraft(updateOutput(draft, index, { id: event.target.value }))
                            }
                            className={FIELD}
                          />
                        </label>
                        <label className="block space-y-1.5">
                          <Label>Label</Label>
                          <input
                            value={output.label}
                            onChange={(event) =>
                              setDraft(updateOutput(draft, index, { label: event.target.value }))
                            }
                            className={FIELD}
                          />
                        </label>
                        <label className="block space-y-1.5">
                          <Label>Format</Label>
                          <select
                            value={output.format}
                            onChange={(event) =>
                              setDraft(
                                updateOutput(draft, index, {
                                  format: event.target.value as PremiumOutputFormat,
                                })
                              )
                            }
                            className={FIELD}
                          >
                            {OUTPUT_FORMATS.map((format) => (
                              <option key={format} value={format}>
                                {format}
                              </option>
                            ))}
                          </select>
                        </label>
                        <label className="block space-y-1.5">
                          <Label>Unit</Label>
                          <input
                            value={output.unit}
                            onChange={(event) =>
                              setDraft(updateOutput(draft, index, { unit: event.target.value }))
                            }
                            className={FIELD}
                          />
                        </label>
                        <label className="flex min-h-[44px] items-center gap-2 sm:col-span-2">
                          <input
                            type="checkbox"
                            checked={output.isBigNumber}
                            onChange={(event) =>
                              setDraft(updateOutput(draft, index, { isBigNumber: event.target.checked }))
                            }
                          />
                          <span className="text-sm text-deep-navy">Primary big number</span>
                        </label>
                        <label className="block space-y-1.5 sm:col-span-2">
                          <Label>Description (authoring)</Label>
                          <input
                            value={output.description}
                            onChange={(event) =>
                              setDraft(updateOutput(draft, index, { description: event.target.value }))
                            }
                            className={FIELD}
                          />
                        </label>
                      </div>
                      <button
                        type="button"
                        className={BTN}
                        onClick={() =>
                          setDraft({
                            ...draft,
                            outputs: draft.outputs.filter((_, rowIndex) => rowIndex !== index),
                          })
                        }
                      >
                        Remove output
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    className={BTN_PRIMARY}
                    onClick={() => setDraft({ ...draft, outputs: [...draft.outputs, createDraftOutput()] })}
                  >
                    Add output
                  </button>
                </SectionCard>
              </StepPanel>
            </div>

            <div className="sc-admin-schema-generator__middle space-y-4">
              <StepPanel step="Formula Pipeline" activeStep={activeStep}>
                <SectionCard title="Formula pipeline">
                  <p className="text-xs text-text-secondary">
                    Select formulaId from the Safe Formula Registry only. No expressions.
                  </p>
                  {draft.formulaPipeline.map((step, index) => {
                    const meta = getFormulaRegistryMeta(step.formulaId);
                    return (
                      <div key={`step-${index}`} className="space-y-3 rounded-lg border border-slate/15 p-3">
                        <label className="block space-y-1.5">
                          <Label>Formula ID</Label>
                          <select
                            value={step.formulaId}
                            onChange={(event) => {
                              const formulaId = event.target.value;
                              const formulaMeta = getFormulaRegistryMeta(formulaId);
                              const inputMap: Record<string, string> = {};
                              formulaMeta?.requiredInputs.forEach((param) => {
                                inputMap[param] = step.inputMap[param] ?? "";
                              });
                              setDraft(
                                updateFormulaStep(draft, index, { formulaId, inputMap })
                              );
                            }}
                            className={FIELD}
                          >
                            <option value="">Select formula</option>
                            {FORMULA_REGISTRY_META.map((item) => (
                              <option key={item.formulaId} value={item.formulaId}>
                                {item.formulaId} - {item.label}
                              </option>
                            ))}
                          </select>
                        </label>
                        {meta ? (
                          <p className="text-xs text-text-secondary">{meta.description}</p>
                        ) : null}
                        {meta ? (
                          <div className="space-y-2">
                            <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
                              Required inputs
                            </p>
                            {meta.requiredInputs.map((param) => (
                              <label key={param} className="block space-y-1.5">
                                <Label>{`${param} ← source`}</Label>
                                <select
                                  value={step.inputMap[param] ?? ""}
                                  onChange={(event) =>
                                    setDraft(
                                      updateFormulaStep(draft, index, {
                                        inputMap: { ...step.inputMap, [param]: event.target.value },
                                      })
                                    )
                                  }
                                  className={FIELD}
                                >
                                  <option value="">Select source</option>
                                  {fieldOptions.map((fieldId) => (
                                    <option key={`${param}-${fieldId}`} value={fieldId}>
                                      {fieldId}
                                    </option>
                                  ))}
                                  <option value="hiddenMultiplierConst">hiddenMultiplierConst</option>
                                  <option value="excessKwhDerived">excessKwhDerived</option>
                                </select>
                              </label>
                            ))}
                          </div>
                        ) : null}
                        <label className="block space-y-1.5">
                          <Label>Output id</Label>
                          <select
                            value={step.outputId}
                            onChange={(event) =>
                              setDraft(updateFormulaStep(draft, index, { outputId: event.target.value }))
                            }
                            className={FIELD}
                          >
                            <option value="">Select output</option>
                            {draft.outputs.map((output) => (
                              <option key={output.id || output.label} value={output.id}>
                                {output.id || "(unset)"}
                              </option>
                            ))}
                          </select>
                        </label>
                        <button
                          type="button"
                          className={BTN}
                          onClick={() =>
                            setDraft({
                              ...draft,
                              formulaPipeline: draft.formulaPipeline.filter((_, rowIndex) => rowIndex !== index),
                            })
                          }
                        >
                          Remove step
                        </button>
                      </div>
                    );
                  })}
                  <button
                    type="button"
                    className={BTN_PRIMARY}
                    onClick={() =>
                      setDraft({
                        ...draft,
                        formulaPipeline: [...draft.formulaPipeline, createDraftFormulaStep()],
                      })
                    }
                  >
                    Add formula step
                  </button>
                </SectionCard>
              </StepPanel>

              <StepPanel step="Thresholds" activeStep={activeStep}>
                <SectionCard title="Thresholds">
                  {draft.thresholds.map((threshold, index) => (
                    <div key={`threshold-${index}`} className="space-y-3 rounded-lg border border-slate/15 p-3">
                      <label className="block space-y-1.5">
                        <Label>Field id</Label>
                        <select
                          value={threshold.fieldId}
                          onChange={(event) =>
                            setDraft(updateThreshold(draft, index, { fieldId: event.target.value }))
                          }
                          className={FIELD}
                        >
                          <option value="">Select field</option>
                          {fieldOptions.map((fieldId) => (
                            <option key={fieldId} value={fieldId}>
                              {fieldId}
                            </option>
                          ))}
                        </select>
                      </label>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <label className="block space-y-1.5">
                          <Label>Warning</Label>
                          <input
                            value={threshold.warning}
                            onChange={(event) =>
                              setDraft(updateThreshold(draft, index, { warning: event.target.value }))
                            }
                            className={FIELD}
                          />
                        </label>
                        <label className="block space-y-1.5">
                          <Label>Critical</Label>
                          <input
                            value={threshold.critical}
                            onChange={(event) =>
                              setDraft(updateThreshold(draft, index, { critical: event.target.value }))
                            }
                            className={FIELD}
                          />
                        </label>
                      </div>
                      <label className="block space-y-1.5">
                        <Label>Direction</Label>
                        <select
                          value={threshold.direction}
                          onChange={(event) =>
                            setDraft(
                              updateThreshold(draft, index, {
                                direction: event.target.value as DraftThreshold["direction"],
                              })
                            )
                          }
                          className={FIELD}
                        >
                          <option value="higher_is_bad">higher_is_bad</option>
                          <option value="lower_is_bad">lower_is_bad</option>
                        </select>
                      </label>
                      <label className="block space-y-1.5">
                        <Label>Warning message</Label>
                        <textarea
                          value={threshold.warningMessage}
                          onChange={(event) =>
                            setDraft(updateThreshold(draft, index, { warningMessage: event.target.value }))
                          }
                          className={TEXTAREA}
                        />
                      </label>
                      <label className="block space-y-1.5">
                        <Label>Critical message</Label>
                        <textarea
                          value={threshold.criticalMessage}
                          onChange={(event) =>
                            setDraft(updateThreshold(draft, index, { criticalMessage: event.target.value }))
                          }
                          className={TEXTAREA}
                        />
                      </label>
                      <button
                        type="button"
                        className={BTN}
                        onClick={() =>
                          setDraft({
                            ...draft,
                            thresholds: draft.thresholds.filter((_, rowIndex) => rowIndex !== index),
                          })
                        }
                      >
                        Remove threshold
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    className={BTN_PRIMARY}
                    onClick={() =>
                      setDraft({
                        ...draft,
                        thresholds: [
                          ...draft.thresholds,
                          {
                            fieldId: "",
                            warning: "",
                            critical: "",
                            direction: "higher_is_bad",
                            warningMessage: "",
                            criticalMessage: "",
                          },
                        ],
                      })
                    }
                  >
                    Add threshold
                  </button>
                </SectionCard>
              </StepPanel>

              <StepPanel step="Report" activeStep={activeStep}>
                <SectionCard title="Report template">
                  <label className="block space-y-1.5">
                    <Label>Report title</Label>
                    <input
                      value={draft.report.title}
                      onChange={(event) =>
                        setDraft({
                          ...draft,
                          report: { ...draft.report, title: event.target.value },
                        })
                      }
                      className={FIELD}
                    />
                  </label>
                  <fieldset className="space-y-2">
                    <legend className="text-xs font-medium uppercase tracking-wide text-text-secondary">
                      Sections
                    </legend>
                    {listReportSectionOptions().map((section) => (
                      <label key={section} className="flex min-h-[44px] items-center gap-2">
                        <input
                          type="checkbox"
                          checked={draft.report.sections.includes(section)}
                          onChange={(event) => {
                            const sections = event.target.checked
                              ? [...draft.report.sections, section]
                              : draft.report.sections.filter((item) => item !== section);
                            setDraft({
                              ...draft,
                              report: { ...draft.report, sections },
                            });
                          }}
                        />
                        <span className="text-sm text-deep-navy">{section}</span>
                      </label>
                    ))}
                  </fieldset>
                  <fieldset className="space-y-2">
                    <legend className="text-xs font-medium uppercase tracking-wide text-text-secondary">
                      Export formats
                    </legend>
                    {EXPORT_FORMATS.map((format) => (
                      <label key={format} className="flex min-h-[44px] items-center gap-2">
                        <input
                          type="checkbox"
                          checked={draft.report.exportFormats.includes(format)}
                          onChange={(event) => {
                            const exportFormats = event.target.checked
                              ? [...draft.report.exportFormats, format]
                              : draft.report.exportFormats.filter((item) => item !== format);
                            setDraft({
                              ...draft,
                              report: { ...draft.report, exportFormats },
                            });
                          }}
                        />
                        <span className="text-sm text-deep-navy">{format}</span>
                      </label>
                    ))}
                  </fieldset>
                  <div className="grid gap-3 sm:grid-cols-3">
                    <label className="block space-y-1.5">
                      <Label>Hidden multiplier</Label>
                      <input
                        value={draft.report.hiddenLossMultiplier}
                        onChange={(event) =>
                          setDraft({
                            ...draft,
                            report: { ...draft.report, hiddenLossMultiplier: event.target.value },
                          })
                        }
                        className={FIELD}
                      />
                    </label>
                    <label className="block space-y-1.5">
                      <Label>Volatility %</Label>
                      <input
                        value={draft.report.volatilityPercent}
                        onChange={(event) =>
                          setDraft({
                            ...draft,
                            report: { ...draft.report, volatilityPercent: event.target.value },
                          })
                        }
                        className={FIELD}
                      />
                    </label>
                    <label className="block space-y-1.5">
                      <Label>Target margin %</Label>
                      <input
                        value={draft.report.targetMarginPercent}
                        onChange={(event) =>
                          setDraft({
                            ...draft,
                            report: { ...draft.report, targetMarginPercent: event.target.value },
                          })
                        }
                        className={FIELD}
                      />
                    </label>
                  </div>
                  <label className="block space-y-1.5">
                    <Label>Assumptions (one per line)</Label>
                    <textarea
                      value={draft.report.assumptionNotes.join("\n")}
                      onChange={(event) =>
                        setDraft({
                          ...draft,
                          report: {
                            ...draft.report,
                            assumptionNotes: event.target.value
                              .split("\n")
                              .map((line) => line.trim())
                              .filter(Boolean),
                          },
                        })
                      }
                      className={TEXTAREA}
                    />
                  </label>
                  <label className="block space-y-1.5">
                    <Label>Legal note</Label>
                    <textarea
                      value={draft.report.legalNote}
                      onChange={(event) =>
                        setDraft({
                          ...draft,
                          report: { ...draft.report, legalNote: event.target.value },
                        })
                      }
                      className={TEXTAREA}
                    />
                  </label>
                </SectionCard>
              </StepPanel>
            </div>

            <div className="sc-admin-schema-generator__right space-y-4">
              <StepPanel step="Preview / Export" activeStep={activeStep}>
                <>
                  <SectionCard title="Validation">
                    {validation.valid ? (
                      <p className="text-sm font-semibold text-[#1f4d2e]">
                        Schema draft is valid for developer review.
                      </p>
                    ) : (
                      <p className="text-sm font-semibold text-[#7a1f1f]">
                        Fix validation errors before export.
                      </p>
                    )}
                    {validation.errors.length > 0 ? (
                      <ul className="list-disc space-y-1 pl-5 text-sm text-[#7a1f1f]">
                        {validation.errors.map((error) => (
                          <li key={error}>{error}</li>
                        ))}
                      </ul>
                    ) : null}
                    {validation.warnings.length > 0 ? (
                      <ul className="list-disc space-y-1 pl-5 text-sm text-[#8a5a12]">
                        {validation.warnings.map((warning) => (
                          <li key={warning}>{warning}</li>
                        ))}
                      </ul>
                    ) : null}
                    {linterResult && validation.valid ? (
                      linterResult.valid ? (
                        <p className="text-sm text-text-secondary">Schema linter: passed.</p>
                      ) : (
                        <ul className="list-disc space-y-1 pl-5 text-sm text-[#7a1f1f]">
                          {linterResult.errors.map((issue) => (
                            <li key={`${issue.code}-${issue.message}`}>{issue.message}</li>
                          ))}
                        </ul>
                      )
                    ) : null}
                  </SectionCard>

                  <SectionCard title="Formula registry">
                    <ul className="max-h-64 space-y-2 overflow-y-auto text-xs text-deep-navy">
                      {FORMULA_REGISTRY_META.map((item) => (
                        <li key={item.formulaId} className="rounded border border-slate/15 p-2">
                          <p className="font-semibold">{item.formulaId}</p>
                          <p className="text-text-secondary">{item.description}</p>
                          <p className="mt-1 font-mono text-xs">
                            {item.requiredInputs.join(", ")}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </SectionCard>

                  <SectionCard title="Schema JSON preview">
                    <pre className="max-h-80 overflow-auto rounded-lg border border-slate/15 bg-off-white p-3 text-xs font-mono text-deep-navy">
                      {draftToJson(draft)}
                    </pre>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        className={BTN_PRIMARY}
                        onClick={() => void copyText(draftToJson(draft), "JSON")}
                      >
                        Copy JSON
                      </button>
                      <button
                        type="button"
                        className={BTN}
                        onClick={() => void copyText(draftToTypeScriptExport(draft), "TypeScript")}
                      >
                        Copy TS draft
                      </button>
                    </div>
                    {copyMessage ? (
                      <p className="text-sm text-text-secondary" role="status">
                        {copyMessage}
                      </p>
                    ) : null}
                  </SectionCard>
                </>
              </StepPanel>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
