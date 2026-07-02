"use client";

import { ToolSafeReviewState } from "@/components/tools/ToolSafeReviewState";

type Props = {
  readonly slug: string;
  readonly locale: string;
  readonly findings?: readonly string[];
  readonly showDebugFindings?: boolean;
};

/** @deprecated Use ToolSafeReviewState - kept for existing imports. */
export function PremiumToolReviewSafeState(props: Props) {
  return <ToolSafeReviewState {...props} />;
}
