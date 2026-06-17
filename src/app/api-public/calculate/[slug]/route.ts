import { headers } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { loadGeneratedCalculator } from "@/lib/generated-tools/calculator-registry";
import { validateCalculatorRuntimeResult } from "@/lib/generated-tools/runtime-validate-calculator";
import {
  describeExpectedInputFormat,
  formatZodValidationErrors,
  getToolValidationSchema,
  getValidatorForTool,
} from "@/lib/validation/calculator-validator";
import { checkPublicCalculateRateLimit } from "@/lib/validation/public-calculate-rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type CalculateRequestBody = {
  readonly inputs?: unknown;
};

function resolveClientIp(headerStore: Awaited<ReturnType<typeof headers>>): string {
  return (
    headerStore.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headerStore.get("x-real-ip") ||
    "local"
  );
}

function hasInvalidNumericOutput(value: unknown): boolean {
  if (typeof value === "number") {
    return !Number.isFinite(value);
  }

  if (Array.isArray(value)) {
    return value.some((entry) => hasInvalidNumericOutput(entry));
  }

  if (value && typeof value === "object") {
    return Object.values(value as Record<string, unknown>).some((entry) =>
      hasInvalidNumericOutput(entry),
    );
  }

  return false;
}

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ slug: string }> },
): Promise<NextResponse> {
  try {
    const { slug } = await context.params;
    const headerStore = await headers();
    const clientIp = resolveClientIp(headerStore);

    const rateLimit = await checkPublicCalculateRateLimit(clientIp);
    if (!rateLimit.ok) {
      return NextResponse.json(
        {
          error: "Rate limit exceeded",
          code: 429,
          message: "Too many calculation requests. Please retry shortly.",
        },
        { status: 429 },
      );
    }

    const body = (await req.json()) as CalculateRequestBody;
    const inputs = body.inputs;

    if (!inputs || typeof inputs !== "object" || Array.isArray(inputs)) {
      return NextResponse.json(
        {
          error: "Invalid request body",
          code: 400,
          message: 'Request body must include an "inputs" object.',
        },
        { status: 400 },
      );
    }

    const toolSchema = getToolValidationSchema(slug);
    if (!toolSchema) {
      return NextResponse.json(
        {
          error: "Tool not found",
          code: 404,
          message: `"${slug}" isimli hesaplama aracı bulunamadı.`,
        },
        { status: 404 },
      );
    }

    const calculator = await loadGeneratedCalculator(slug);
    const validator = calculator?.inputSchema ?? getValidatorForTool(slug);

    if (!validator) {
      return NextResponse.json(
        {
          error: "Validation schema not found",
          code: 500,
          message: `"${slug}" aracının şeması yüklenemedi.`,
        },
        { status: 500 },
      );
    }

    const validationResult = validator.safeParse(inputs);
    if (!validationResult.success) {
      const errors = formatZodValidationErrors(validationResult.error);

      return NextResponse.json(
        {
          error: "Invalid input parameters (AI Hallucination detected)",
          code: 422,
          details: errors,
          expected_format: {
            inputs: describeExpectedInputFormat(toolSchema.inputs),
          },
        },
        { status: 422 },
      );
    }

    if (!calculator) {
      return NextResponse.json(
        {
          error: "Calculator engine not found",
          code: 404,
          message: `"${slug}" aracının hesaplama motoru bulunamadı.`,
        },
        { status: 404 },
      );
    }

    try {
      const result = calculator.calculate(
        validationResult.data as Record<string, unknown>,
      );

      const runtimeValidation = validateCalculatorRuntimeResult(result);
      if (runtimeValidation.status === "FAIL") {
        return NextResponse.json(
          {
            error: "Calculation produced invalid result (NaN/Infinity)",
            code: 422,
            message:
              runtimeValidation.error ??
              "Lütfen girdi değerlerinizi kontrol edin ve tekrar deneyin.",
          },
          { status: 422 },
        );
      }

      if (hasInvalidNumericOutput(result)) {
        return NextResponse.json(
          {
            error: "Calculation produced invalid result (NaN/Infinity)",
            code: 422,
            message: "Lütfen girdi değerlerinizi kontrol edin ve tekrar deneyin.",
          },
          { status: 422 },
        );
      }

      return NextResponse.json({
        success: true,
        result,
        tool: {
          slug,
          name:
            typeof toolSchema.toolName === "string" ? toolSchema.toolName : slug,
        },
        validations: toolSchema.inputs.map((input) => input.id),
      });
    } catch (importError) {
      console.error("Import/Compute error:", importError);
      return NextResponse.json(
        {
          error: "Engine execution failed",
          code: 422,
          message: `"${slug}" aracı çalıştırılamadı. Lütfen slug ve input formatını kontrol edin.`,
        },
        { status: 422 },
      );
    }
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        code: 500,
      },
      { status: 500 },
    );
  }
}
