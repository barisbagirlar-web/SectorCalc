import {
  callDeepSeekHealthcheck,
  getDeepSeekClientConfig,
  sanitizeDeepSeekErrorMessage,
} from "@/lib/ai/deepseek/deepseek-client";

export type DeepSeekHealthcheckReport = {
  apiKeyPresent: boolean;
  model: string;
  status: "ok" | "unavailable" | "error";
  jsonValid: boolean;
  blocker: string | null;
};

export async function runDeepSeekHealthcheck(): Promise<{
  report: DeepSeekHealthcheckReport;
  exitCode: number;
}> {
  const config = getDeepSeekClientConfig();
  const apiKeyPresent = Boolean(config.apiKey);

  if (!apiKeyPresent) {
    return {
      report: {
        apiKeyPresent: false,
        model: config.model,
        status: "unavailable",
        jsonValid: false,
        blocker: "DEEPSEEK_API_KEY missing",
      },
      exitCode: 0,
    };
  }

  const result = await callDeepSeekHealthcheck();

  if (!result.ok) {
    return {
      report: {
        apiKeyPresent: true,
        model: config.model,
        status: "error",
        jsonValid: false,
        blocker: sanitizeDeepSeekErrorMessage(result.message || result.errorCode),
      },
      exitCode: 1,
    };
  }

  return {
    report: {
      apiKeyPresent: true,
      model: config.model,
      status: "ok",
      jsonValid: true,
      blocker: null,
    },
    exitCode: 0,
  };
}

function printHealthcheckReport(report: DeepSeekHealthcheckReport): void {
  console.log("SONUÇ:");
  console.log(`API KEY PRESENT: ${report.apiKeyPresent ? "yes" : "no"}`);
  console.log(`MODEL: ${report.model}`);
  console.log(`STATUS: ${report.status}`);
  console.log(`JSON VALID: ${report.jsonValid ? "yes" : "no"}`);
  console.log(`BLOCKER: ${report.blocker ?? "none"}`);
}

async function main(): Promise<void> {
  const { report, exitCode } = await runDeepSeekHealthcheck();
  printHealthcheckReport(report);
  process.exit(exitCode);
}

main().catch((error) => {
  console.error(sanitizeDeepSeekErrorMessage(error instanceof Error ? error.message : String(error)));
  process.exit(1);
});
