import { addLocaleToPath, stripLocaleFromPath } from "./src/lib/i18n/locale-routing";
import { LOCALE_DEFINITIONS } from "./src/lib/i18n/locale-config";

console.log("strip(/tr):", stripLocaleFromPath("/tr"));
console.log("add(/, de):", addLocaleToPath("/", "de"));

const pathname = "/tr";
const basePath = stripLocaleFromPath(pathname);
const nextPath = addLocaleToPath(basePath, "de");
console.log("result:", nextPath);
