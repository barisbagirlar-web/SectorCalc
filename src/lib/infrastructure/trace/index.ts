export type { TraceHealthResponse } from "@/lib/infrastructure/trace/types";
export { handleFreeTraceRequest } from "@/lib/infrastructure/trace/free-handler";
export { handleProTraceRequest } from "@/lib/infrastructure/trace/pro-handler";
export { findBestTools } from "@/lib/infrastructure/trace/tool-recommendation";
export {
  TRACE_FREE_SYSTEM_PROMPT,
  TRACE_PRO_SYSTEM_PROMPT,
} from "@/lib/infrastructure/trace/prompts";
export {
  sanitizeHistory,
  stripAllToolBlocks,
} from "@/lib/infrastructure/trace/trace-sanitizer";
export type {
  SanitizableMessage,
  ContentBlock,
} from "@/lib/infrastructure/trace/trace-sanitizer";
