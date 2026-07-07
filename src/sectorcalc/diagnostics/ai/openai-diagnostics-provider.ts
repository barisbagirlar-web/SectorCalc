/**
 * Engineering Diagnostics — OpenAI Provider (Vision-enabled)
 *
 * Server-side OpenAI integration for AI-assisted engineering interpretation.
 * Supports text-only and vision (photo) analysis.
 *
 * STRICT:
 * - OpenAI NEVER computes or overrides numeric values
 * - OpenAI only drafts descriptive/narrative content
 * - API key loaded from process.env.OPENAI_API_KEY only
 * - Output passes through guardrails before use
 * - Photos are sent as base64 — EXIF must be stripped before calling this
 */

import "server-only";
import type { AiDiagnosticInput, AiDiagnosticOutput } from "./diagnostic-ai-types";
import { validateAiOutput } from "./diagnostic-ai-guardrails";

const GPT_MODEL = "gpt-4o";
const MAX_RETRIES = 2;

type Message =
  | { role: "system" | "user"; content: string }
  | { role: "user"; content: Array<{ type: "text"; text: string } | { type: "image_url"; image_url: { url: string; detail?: string } }> };

function buildSystemPrompt(input: AiDiagnosticInput): string {
  const photoNote = input.photos && input.photos.length > 0
    ? `\nPHOTOS PROVIDED: ${input.photos.length} field photo(s) attached. Incorporate visual observations from these images. Describe what is visibly apparent — cracks, wear, discoloration, deformation, contaminants, or other visible indicators.`
    : "\nNo field photos provided. Base observations on the problem context and measurement data only.";

  return `You are an AI engineering diagnostic assistant. Your role is to help engineers interpret measurement data by providing structured observations and narrative analysis.

CONTEXT:
- Domain: ${input.domain_label} (${input.domain_id})
- Problem: ${input.problem_context}
- Number of measurements: ${input.measurements.length}${photoNote}

DETERMINISTIC RESULTS (for context only — do NOT restate numbers):
- Decision: ${input.deterministic.decision}
- Total risk score: ${input.deterministic.total_risk_score}/100
- Cost at risk: $${input.deterministic.cost_at_risk}
- Action plan items: ${input.deterministic.action_plan_items}

ABSOLUTE RULES:
1. NEVER output any risk score, cost value, or decision — those are computed by the deterministic engine
2. NEVER claim to certify, guarantee, or approve any part
3. NEVER reference specific standard clauses or coefficients you are not certain about
4. ALWAYS recommend manual verification for critical findings
5. ALWAYS base observations only on the provided measurement context
6. NEVER make up measurement values or technical specifications
7. When photos are provided, describe only what is visibly apparent in the images

YOUR TASK:
1. Provide structured visual observations based on the problem context and any photos
2. Write an engineering interpretation of the situation
3. Suggest possible root cause hypotheses
4. Draft an NCR (Non-Conformance Report) statement
5. Draft a CAPA (Corrective and Preventive Action) statement
6. Write an executive summary for management
7. Provide an action narrative to guide next steps

OUTPUT FORMAT: JSON object with these exact keys:
- visual_observations: array of { description: string, severity_hint: "LOW"|"MEDIUM"|"HIGH", confidence: number (0-1), manual_verification_required: boolean }
- engineering_interpretation: string (2-4 paragraphs)
- root_cause_hypotheses: array of strings (2-5 hypotheses)
- ncr_statement: string
- capa_statement: string
- executive_summary: string (1-2 paragraphs for management)
- action_narrative: string (step-by-step guidance)`;
}

function buildUserMessage(input: AiDiagnosticInput): Message[] {
  const textContent = `Provide engineering diagnostics interpretation for a ${input.domain_label} problem. Measurements: ${input.measurements.length} readings. Decision state: ${input.deterministic.decision}.`;

  if (!input.photos || input.photos.length === 0) {
    return [{ role: "user", content: textContent }];
  }

  const content: Array<{ type: "text"; text: string } | { type: "image_url"; image_url: { url: string; detail?: string } }> = [
    {
      type: "text" as const,
      text: `${textContent}\n\nThe user has attached ${input.photos.length} field photo(s). Analyze the visible features in these images and incorporate your observations into the diagnostic assessment.`,
    },
  ];

  for (const photo of input.photos.slice(0, 8)) {
    content.push({
      type: "image_url" as const,
      image_url: {
        url: photo,
        detail: "auto" as const,
      },
    });
  }

  return [{ role: "user" as const, content }];
}

export async function callAiDiagnosticProvider(
  input: AiDiagnosticInput,
): Promise<AiDiagnosticOutput> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not configured");
  }

  const systemPrompt = buildSystemPrompt(input);
  const userMessages = buildUserMessage(input);

  const messages: Message[] = [
    { role: "system", content: systemPrompt },
    ...userMessages,
  ];

  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: GPT_MODEL,
          messages,
          response_format: { type: "json_object" },
          temperature: 0.3,
          max_tokens: 4096,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text().catch(() => "Unknown error");
        throw new Error(`OpenAI API error ${response.status}: ${errorText}`);
      }

      const data = (await response.json()) as {
        choices: Array<{ message: { content: string } }>;
      };

      const rawContent = data.choices?.[0]?.message?.content;
      if (!rawContent) {
        throw new Error("OpenAI returned empty response");
      }

      let parsed: unknown;
      try {
        parsed = JSON.parse(rawContent);
      } catch {
        throw new Error("OpenAI response was not valid JSON");
      }

      const guardrailResult = validateAiOutput(parsed, input);
      if (!guardrailResult.ok || !guardrailResult.output) {
        throw new Error(`Guardrail rejection: ${guardrailResult.errors?.join("; ") ?? "unknown"}`);
      }

      return guardrailResult.output;
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      if (attempt < MAX_RETRIES) {
        await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)));
      }
    }
  }

  throw lastError ?? new Error("AI provider call failed after retries");
}
