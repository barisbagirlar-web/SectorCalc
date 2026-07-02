import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const sectorCalcVerifyIgnores = {
  ignores: [
    ".next/**",
    ".firebase/**",
    "node_modules/**",
    "functions/node_modules/**",
    "functions/lib/**",
    "_safe_vault/**",
    "archive/**",
    "backups/**",
    "test-results/**",
    "tmp/**",
    "coverage/**",
    "out/**",
    "dist/**",
    "build/**",
    "public/sw.js",
    "public/wasm/**"
  ],
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  sectorCalcVerifyIgnores,
  {
    files: ["src/lib/features/premium-schema/formulas/chunk-*.ts"],
    rules: {
      "@typescript-eslint/ban-ts-comment": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "off"
    }
  },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      "generated/**",
      "src/tools/generated/**",
      "scripts/**",
      "_safe_vault/**",
      "*.js",
      "*.ts",
    ],
  },
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-empty-object-type": "off",
    }
  },
  {
    files: ["src/lib/features/tools/**/*.ts"],
    rules: {
      "@typescript-eslint/no-unused-vars": "off",
    }
  },
  // SECTORCALC_LEGACY_GATE_OVERRIDES_START
  {
    files: ["src/**/*.{ts,tsx}"],
    rules: {
      "@typescript-eslint/ban-ts-comment": ["error", {
        "ts-check": false,
        "ts-nocheck": false,
        "ts-ignore": false,
        "ts-expect-error": false,
        "minimumDescriptionLength": 3
      }]
    }
  },
  {
    files: ["src/i18n/routing.ts"],
    rules: {
      "@typescript-eslint/no-require-imports": "off"
    }
  }
  // SECTORCALC_LEGACY_GATE_OVERRIDES_END
];

export default eslintConfig;
