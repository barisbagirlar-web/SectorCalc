import { compile, safeEval } from "./src/lib/features/dynamic-form-v2/ast-parser";

const formula = "(Math.pow(etKalinlik, 2) / (Math.pow(Math.PI, 2) * Math.max(0.0001, termalDifuzyon))) * Math.log(Math.max(0.0001, (4 / Math.PI) * (erimeSicaklik - kalipSicaklik) / Math.max(0.0001, (50 - kalipSicaklik))))";

const scope = {
  etKalinlik: 2,
  termalDifuzyon: 0.1,
  erimeSicaklik: 200,
  kalipSicaklik: 40
};

try {
  const fn = compile(formula);
  console.log("Result:", safeEval(fn, scope));
} catch(e) {
  console.error("Crash:", e);
}
