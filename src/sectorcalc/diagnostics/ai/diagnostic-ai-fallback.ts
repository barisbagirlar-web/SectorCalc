/**
 * Engineering Diagnostics AI — Fallback Draft Templates
 *
 * Safe fallback when OpenAI is unavailable (key missing, network error,
 * validation rejection). Returns domain-aware templates so the user
 * still gets useful engineering guidance.
 *
 * STRICT:
 * - Never invent deterministic values
 * - Never claim certification or approval
 * - Always recommend manual verification
 */

import type { AiEngineeringDraft, EngineeringDraftInput } from "./diagnostic-ai-types";

/**
 * Build a safe fallback engineering draft when AI is unavailable.
 */
export function buildFallbackDraft(input: EngineeringDraftInput): AiEngineeringDraft {
  const domainName = input.domain_label;
  const decision = input.deterministic_result.decision;
  const worstCase = input.deterministic_result.worst_case_tolerance_status;

  return {
    visual_observations: [
      {
        observation: `No AI-generated visual observations — manual visual inspection of the ${domainName} process is required.`,
        confidence: 0,
        manual_verification_required: true,
        severity_hint: "MEDIUM",
      },
    ],
    engineering_interpretation: (
      `Engineering interpretation was not automatically generated. ` +
      `The deterministic engine has processed the measurements and produced a "${decision}" decision ` +
      `with a "${worstCase}" worst-case tolerance status. ` +
      `A qualified field engineer should review the measurement data, ` +
      `inspect the part or process visually, and document their professional interpretation.`
    ),
    root_cause_hypotheses: [
      {
        cause: "AI-assisted root cause analysis was not available. Manual root cause investigation is required.",
        likelihood: "MEDIUM",
        verification_method: "On-site inspection and measurement data cross-reference by a qualified engineer.",
      },
    ],
    required_manual_checks: [
      `Perform visual inspection of the ${domainName} process and document observations.`,
      `Verify all measurement tools are within calibration validity.`,
      "Cross-reference measurement results against process specifications.",
      "Consult process documentation for historical deviation patterns.",
    ],
    containment_actions: [
      "Segregate potentially non-conforming output for inspection.",
      "Flag the affected production batch for quality hold pending review.",
      "Notify the responsible production supervisor.",
    ],
    temporary_fix: [
      "Increase inspection frequency for the next production run.",
      "Document current process parameters for baseline comparison.",
      "Apply interim process adjustment if supported by deterministic results.",
    ],
    permanent_corrective_action: [
      "Conduct a formal root cause analysis (5-Why or Fishbone).",
      "Update process control plan based on findings.",
      "Implement mistake-proofing (poka-yoke) if applicable.",
    ],
    ncr_draft: {
      nonconformity: `Non-conformance observed in ${domainName} process — deterministic engine decision: ${decision}. Full NCR requires manual completion.`,
      affected_process: domainName,
      containment: "Segregate affected output and place on quality hold.",
      corrective_action: "Determine root cause through formal investigation.",
      verification_method: "Re-inspection after corrective action by qualified inspector.",
    },
    capa_draft: {
      root_cause_hypothesis: "AI-assisted root cause hypothesis unavailable — complete manually using 5-Why methodology.",
      corrective_action: "Implement corrective action based on root cause investigation results.",
      preventive_action: "Update FMEA and control plan to prevent recurrence.",
      evidence_required: "Inspection records, process parameter logs, and corrective action verification.",
    },
    executive_summary: (
      `An engineering diagnostic was performed on the ${domainName} process. ` +
      `The deterministic engine has evaluated the measurements and returned a "${decision}" decision. ` +
      `AI-assisted engineering reasoning was not available for this session. ` +
      `A qualified field engineer should review the complete diagnostic report, ` +
      `perform manual verification of critical findings, and complete the NCR and CAPA documentation.`
    ),
    limitations: [
      "AI-assisted engineering reasoning was not available — draft content is template-based.",
      "All observations require manual verification by a qualified engineer.",
      "This draft does not replace professional engineering judgment.",
      "The deterministic engine results are the only source of numeric decision values.",
    ],
  };
}
