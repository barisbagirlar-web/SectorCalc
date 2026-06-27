#!/usr/bin/env node
/** Clean homeAbout + aboutPage copy — fixes partial glossary corruption on AR. */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "..");

const PATCH = {
  ar: {
    homeAbout: {
      paragraph1:
      paragraph2:
    },
    aboutPage: {
      seoDescription:
      hero: {
      },
      why: {
      },
      what: {
      },
      problem: {
      },
      how: {
      },
      different: {
      },
      who: {
      },
      building: {
      },
      manifesto: {
      },
    },
  },
  de: {
    aboutPage: {
      how: {
        body: "Sie liefern die Eingaben, die Sie kennen; das System ermittelt, was erforderlich ist, führt deterministische Berechnungen unter Governance aus und validiert jedes Ergebnis anhand von Invarianten und Benchmarks, bevor es angezeigt wird.",
      },
    },
    region: { global: "Global · USD" },
    pilotCnc: { phase2: { label: "MarginCore · Phase 2" } },
    homeDashboard: { grid: { sectorCount: "{count} Module" } },
  },
  fr: {
    aboutPage: {
      how: {
        body: "Vous fournissez les entrées que vous connaissez ; le système détermine ce qui est requis, exécute des calculs déterministes gouvernés et valide chaque résultat par rapport aux invariants et aux repères avant affichage.",
      },
    },
    region: { global: "Global · USD" },
    pilotCnc: { phase2: { label: "MarginCore · Phase 2" } },
    homeDashboard: { grid: { sectorCount: "{count} modules métier" } },
  },
  es: {
    aboutPage: {
      how: {
        body: "Usted aporta las entradas que conoce; el sistema resuelve lo requerido, ejecuta cálculos deterministas gobernados y valida cada resultado frente a invariantes y referencias antes de mostrarlo.",
      },
    },
    region: { global: "Global · USD" },
  },
};

function deepMerge(target, source) {
  for (const [key, value] of Object.entries(source)) {
    if (value && typeof value === "object" && !Array.isArray(value)) {
      target[key] = deepMerge(target[key] ?? {}, value);
    } else {
      target[key] = value;
    }
  }
  return target;
}

for (const [locale, block] of Object.entries(PATCH)) {
  const path = join(ROOT, "messages", `${locale}.json`);
  const messages = JSON.parse(readFileSync(path, "utf8"));
  deepMerge(messages, block);
  writeFileSync(path, `${JSON.stringify(messages, null, 2)}\n`, "utf8");
  console.log(`Patched homeAbout/aboutPage → messages/${locale}.json`);
}
