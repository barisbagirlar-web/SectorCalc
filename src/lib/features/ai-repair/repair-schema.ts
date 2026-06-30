import { z } from "zod";

export const RepairSuggestionSchema = z.object({
  severity: z.enum(["info", "warning", "error", "deploy-blocker"]),
  summary: z.string().min(3),
  rootCause: z.string().min(3),
  affectedFiles: z.array(z.string()),
  proposedPatchPlan: z.array(z.string()).min(1),
  commandsToRun: z.array(z.string()).min(1),
  deployBlocker: z.boolean(),
  requiresHumanReview: z.boolean(),
  riskNotes: z.array(z.string()),
});

export type RepairSuggestionOutput = z.infer<typeof RepairSuggestionSchema>;
