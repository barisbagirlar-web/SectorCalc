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
    }
  },
  {
    files: ["src/lib/features/tools/**/*.ts"],
    rules: {
      "@typescript-eslint/no-unused-vars": "off",
    }
  }
];

export default eslintConfig;
