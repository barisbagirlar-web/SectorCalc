function stripLocalePrefix(pathname: string): string {
  const match = pathname.match(/^\/(en|tr|es|de|ar)(\/.*)?$/);
  if (!match) {
    return pathname;
  }
  return match[2] ?? "/";
}

function normalizePath(pathname: string): string {
  const stripped = stripLocalePrefix(pathname);
  const withoutQuery = stripped.split("?")[0] ?? stripped;
  if (withoutQuery.length > 1 && withoutQuery.endsWith("/")) {
    return withoutQuery.slice(0, -1);
  }
  return withoutQuery;
}

/**
 * Precise header nav active matching — /audit must never activate Pricing.
 */
export function isNavLinkActive(pathname: string, href: string): boolean {
  const path = normalizePath(pathname);

  switch (href) {
    case "/free-tools":
      return path === "/free-tools" || path.startsWith("/tools/free/");
    case "/industries":
      return path === "/industries" || path.startsWith("/industries/");
    case "/categories":
      return path === "/categories";
    case "/account/reports":
      return path === "/account/reports" || path.startsWith("/account/reports/");
    case "/pricing":
      return path === "/pricing";
    case "/account":
      return path === "/account";
    default:
      return path === href || path.startsWith(`${href}/`);
  }
}

/** Audit hub routes — no primary nav item should appear active. */
export function isAuditHubPath(pathname: string): boolean {
  const path = normalizePath(pathname);
  return path === "/audit" || path.startsWith("/audit/");
}
