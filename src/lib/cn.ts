type ClassValue = string | false | null | undefined | ClassValue[];

/** Merge class names, skipping falsy entries. Supports nested arrays. */
export function cn(...classes: ClassValue[]): string {
 const flat: string[] = [];
 for (const item of classes) {
 if (!item) continue;
 if (Array.isArray(item)) {
 flat.push(cn(...item));
 } else {
 flat.push(item);
 }
 }
 return flat.filter(Boolean).join(" ");
}
