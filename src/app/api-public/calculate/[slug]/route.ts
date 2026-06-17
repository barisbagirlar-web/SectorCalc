import { headers } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { loadGeneratedCalculator } from "@/lib/generated-tools/calculator-registry";
import { getGeneratedToolSchema } from "@/lib/generated-tools/schema-loader";
import { resolveGeneratedToolTitle } from "@/lib/generated-tools/resolve-tool-display";
import { validateCalculatorRuntimeResult } from "@/lib/generated-tools/runtime-validate-calculator";
import { getLocaleTextDirection } from "@/lib/i18n/locale-config";
import {
  formatApiPublicMessage,
  resolveApiPublicLocale,
  tApiPublic,
} from "@/lib/validation/api-public-messages";
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
  readonly locale?: unknown;
  readonly inputs?: unknown;
};

function resolveClientIp(headerStore: Awaited<ReturnType<typeof headers>>): string {
  return (
    headerStore.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headerStore.get("x-real-ip") ||
    "local"
  );
}

function jsonWithLocale(
  locale: ReturnType<typeof resolveApiPublicLocale>,
  body: Record<string, unknown>,
  status: number,
): NextResponse {
  return NextResponse.json(
    { locale, ...body },
    {
      status,
      headers: {
        "Content-Language": locale,
        "Content-Direction": getLocaleTextDirection(locale),
      },
    },
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
  const headerStore = await headers();
  const acceptLanguage = headerStore.get("accept-language");
  const queryLocale = req.nextUrl.searchParams.get("locale");

  try {
    const { slug } = await context.params;
    const clientIp = resolveClientIp(headerStore);
    const body = (await req.json()) as CalculateRequestBody;
    const locale = resolveApiPublicLocale({
      queryLocale,
      bodyLocale: body.locale,
      acceptLanguage,
    });

    const rateLimit = await checkPublicCalculateRateLimit(clientIp);
    if (!rateLimit.ok) {
      return jsonWithLocale(
        locale,
        {
          error: tApiPublic(locale, "rateLimitError"),
          code: 429,
          message: tApiPublic(locale, "rateLimitMessage"),
        },
        429,
      );
    }

    const inputs = body.inputs;

    if (!inputs || typeof inputs !== "object" || Array.isArray(inputs)) {
      return jsonWithLocale(
        locale,
        {
          error: tApiPublic(locale, "invalidBodyError"),
          code: 400,
          message: tApiPublic(locale, "invalidBodyMessage"),
        },
        400,
      );
    }

    const toolSchema = getToolValidationSchema(slug);
    if (!toolSchema) {
      return jsonWithLocale(
        locale,
        {
          error: tApiPublic(locale, "toolNotFoundError"),
          code: 404,
          message: formatApiPublicMessage(locale, "toolNotFoundMessage", { slug }),
        },
        404,
      );
    }

    const generatedSchema = getGeneratedToolSchema(slug);
    const calculator = await loadGeneratedCalculator(slug);
    const validator = calculator?.inputSchema ?? getValidatorForTool(slug);

    if (!validator) {
      return jsonWithLocale(
        locale,
        {
          error: tApiPublic(locale, "schemaNotFoundError"),
          code: 500,
          message: formatApiPublicMessage(locale, "schemaNotFoundMessage", { slug }),
        },
        500,
      );
    }

    const validationResult = validator.safeParse(inputs);
    if (!validationResult.success) {
      const errors = formatZodValidationErrors(validationResult.error);

      return jsonWithLocale(
        locale,
        {
          error: tApiPublic(locale, "invalidInputError"),
          code: 422,
          details: errors,
          expected_format: {
            inputs: describeExpectedInputFormat(toolSchema.inputs),
          },
        },
        422,
      );
    }

    if (!calculator) {
      return jsonWithLocale(
        locale,
        {
          error: tApiPublic(locale, "engineNotFoundError"),
          code: 404,
          message: formatApiPublicMessage(locale, "engineNotFoundMessage", { slug }),
        },
        404,
      );
    }

    try {
      const result = calculator.calculate(
        validationResult.data as Record<string, unknown>,
      );

      const runtimeValidation = validateCalculatorRuntimeResult(result);
      if (runtimeValidation.status === "FAIL") {
        return jsonWithLocale(
          locale,
          {
            error: tApiPublic(locale, "invalidResultError"),
            code: 422,
            message: runtimeValidation.error ?? tApiPublic(locale, "invalidResultMessage"),
          },
          422,
        );
      }

      if (hasInvalidNumericOutput(result)) {
        return jsonWithLocale(
          locale,
          {
            error: tApiPublic(locale, "invalidResultError"),
            code: 422,
            message: tApiPublic(locale, "invalidResultMessage"),
          },
          422,
        );
      }

      const toolName =
        generatedSchema != null
          ? resolveGeneratedToolTitle(slug, generatedSchema, locale)
          : toolSchema.toolName;

      return jsonWithLocale(
        locale,
        {
          success: true,
          result,
          tool: {
            slug,
            name: toolName,
          },
          validations: toolSchema.inputs.map((input) => input.id),
        },
        200,
      );
    } catch (importError) {
      console.error("Import/Compute error:", importError);
      return jsonWithLocale(
        locale,
        {
          error: tApiPublic(locale, "engineFailedError"),
          code: 422,
          message: formatApiPublicMessage(locale, "engineFailedMessage", { slug }),
        },
        422,
      );
    }
  } catch (error) {
    console.error("API error:", error);
    const locale = resolveApiPublicLocale({
      queryLocale,
      bodyLocale: undefined,
      acceptLanguage,
    });
    return jsonWithLocale(
      locale,
      {
        error: tApiPublic(locale, "internalError"),
        code: 500,
      },
      500,
    );
  }
}
