/**
 * Engineering Diagnostics AI — Zod Schema
 *
 * Zod validation for the richer engineering reasoning draft.
 * Must reject deterministic field names and forbidden claims.
 */

import { z } from "zod";

export const ObservationEntrySchema = z.object({
  observation: z.string().min(1),
  confidence: z.number().min(0).max(1),
  manual_verification_required: z.boolean(),
  severity_hint: z.enum(["LOW", "MEDIUM", "HIGH"]),
});

export const RootCauseHypothesisSchema = z.object({
  cause: z.string().min(1),
  likelihood: z.enum(["LOW", "MEDIUM", "HIGH"]),
  verification_method: z.string().min(1),
});

export const NcrDraftSchema = z.object({
  nonconformity: z.string().min(1),
  affected_process: z.string().min(1),
  containment: z.string().min(1),
  corrective_action: z.string().min(1),
  verification_method: z.string().min(1),
});

export const CapaDraftSchema = z.object({
  root_cause_hypothesis: z.string().min(1),
  corrective_action: z.string().min(1),
  preventive_action: z.string().min(1),
  evidence_required: z.string().min(1),
});

export const AiEngineeringDraftSchema = z.object({
  visual_observations: z.array(ObservationEntrySchema).min(0),
  engineering_interpretation: z.string().min(1),
  root_cause_hypotheses: z.array(RootCauseHypothesisSchema).min(0),
  required_manual_checks: z.array(z.string().min(1)).min(0),
  containment_actions: z.array(z.string().min(1)).min(0),
  temporary_fix: z.array(z.string().min(1)).min(0),
  permanent_corrective_action: z.array(z.string().min(1)).min(0),
  ncr_draft: NcrDraftSchema,
  capa_draft: CapaDraftSchema,
  executive_summary: z.string().min(1),
  limitations: z.array(z.string().min(1)).min(0),
});

export type ValidatedAiEngineeringDraft = z.infer<typeof AiEngineeringDraftSchema>;
