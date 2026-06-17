/**
 * Deep-merge field i18n bundles — never overwrite existing localized copy.
 */

export function mergeFieldBundle(existingFields, incomingFields) {
  const merged = { ...(existingFields ?? {}) };

  for (const [fieldKey, incomingCopy] of Object.entries(incomingFields ?? {})) {
    const existingCopy = merged[fieldKey];
    if (!existingCopy || typeof existingCopy !== "object") {
      merged[fieldKey] = incomingCopy;
      continue;
    }

    merged[fieldKey] = { ...existingCopy };
    for (const part of ["label", "placeholder", "helper"]) {
      const incomingValue = incomingCopy?.[part];
      const existingValue = existingCopy?.[part];
      if (typeof incomingValue !== "string" || !incomingValue.trim()) {
        continue;
      }
      if (typeof existingValue === "string" && existingValue.trim() && existingValue !== incomingValue) {
        continue;
      }
      merged[fieldKey][part] = incomingValue;
    }
  }

  return merged;
}

export function mergeToolBundle(existingTools, incomingTools) {
  const merged = { ...(existingTools ?? {}) };

  for (const [slug, incomingFields] of Object.entries(incomingTools ?? {})) {
    merged[slug] = mergeFieldBundle(merged[slug], incomingFields);
  }

  return merged;
}
