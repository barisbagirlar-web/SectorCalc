import fs from 'fs';
import path from 'path';

// Simulation of middleware and routing logic for auditing purposes
const SUPPORTED_LOCALES = ['en', 'tr', 'de', 'fr', 'es', 'ar'];
const PREFIXED_LOCALES = ['tr', 'de', 'fr', 'es', 'ar'];
const ROOT_LOCALE = 'en';

const MIDDLEWARE_EXCLUDED_EXACT = new Set([
  "/favicon.ico",
  "/robots.txt",
  "/sitemap.xml",
  "/llms.txt",
  "/ai.txt",
  "/ai-tool-index.json",
  "/ai-tool-index.txt",
  "/ai-categories.json",
  "/ai-tool-routes.json",
  "/ai-search-manifest.json",
  "/ai-embedding-source.jsonl",
  "/sectorcalc-index.txt",
  "/services-products.txt",
  "/faq-knowledge.txt",
  "/manifest.json",
]);

const MIDDLEWARE_EXCLUDED_PREFIXES = ["/api", "/admin", "/_next", "/assets", "/images", "/icons"];

const STATIC_FILE_EXTENSION = /\.(?:ico|png|jpe?g|gif|webp|svg|txt|xml|json|jsonl|woff2?|ttf|eot|css|js|map)$/i;

const LOCALE_LESS_PUBLIC_ROUTES = [
  "/free-tools",
  "/premium-tools",
  "/industries",
  "/pricing",
  "/calculator-library",
  "/categories",
];

const NEXT_CONFIG_REDIRECTS = [
  { source: "/en", destination: "/", permanent: true },
  { source: "/en/:path*", destination: "/:path*", permanent: true },
  { source: "/premium-tools", destination: "/pro-tools", permanent: true },
  { source: "/:locale/premium-tools", destination: "/:locale/pro-tools", permanent: true },
  { source: "/tools/premium/:slug", destination: "/pro-tools/:slug", permanent: true },
  { source: "/:locale/tools/premium/:slug", destination: "/:locale/pro-tools/:slug", permanent: true },
  { source: "/tools/premium-schema/:slug", destination: "/pro-tools/:slug", permanent: true },
  { source: "/:locale/tools/premium-schema/:slug", destination: "/:locale/pro-tools/:slug", permanent: true },
  { source: "/blog", destination: "/case-studies", permanent: true },
  { source: "/:locale/blog", destination: "/:locale/case-studies", permanent: true },
  { source: "/formulas", destination: "/calculator-library", permanent: true },
  { source: "/:locale/formulas", destination: "/:locale/calculator-library", permanent: true },
  { source: "/api", destination: "/developer-showcase", permanent: true },
  { source: "/:locale/api", destination: "/:locale/developer-showcase", permanent: true },
  { source: "/signup", destination: "/login", permanent: true },
  { source: "/:locale/signup", destination: "/:locale/login", permanent: true },
];

// Helper functions matching codebase
function isLocalizedPath(pathname) {
  const segmentPattern = SUPPORTED_LOCALES.join('|');
  const localePrefix = new RegExp(`^/(${segmentPattern})(?=\\/|$)`, 'i');
  return localePrefix.test(pathname);
}

function parseLocaleFromPath(pathname) {
  const segmentPattern = SUPPORTED_LOCALES.join('|');
  const localePrefix = new RegExp(`^/(${segmentPattern})(?=\\/|$)`, 'i');
  const match = pathname.match(localePrefix);
  if (!match) return null;
  return match[1].toLowerCase();
}

function isPrefixedLocalePath(pathname) {
  const locale = parseLocaleFromPath(pathname);
  return locale !== null && locale !== ROOT_LOCALE;
}

function stripLocaleFromPath(pathname) {
  if (!pathname) return "/";
  const normalized = pathname.startsWith('/') ? pathname : `/${pathname}`;
  const locale = parseLocaleFromPath(normalized);
  if (!locale) return normalized;
  if (normalized.toLowerCase() === `/${locale}`) return "/";
  const rest = normalized.slice(locale.length + 1);
  return rest.length > 0 ? rest : "/";
}

function isMiddlewareExcludedPath(pathname) {
  const lower = pathname.toLowerCase();
  if (MIDDLEWARE_EXCLUDED_EXACT.has(lower)) return true;
  if (MIDDLEWARE_EXCLUDED_PREFIXES.some(prefix => lower.startsWith(prefix.toLowerCase()))) return true;
  if (STATIC_FILE_EXTENSION.test(lower)) return true;
  return false;
}

function hasUppercase(pathname) {
  const lower = pathname.toLowerCase();
  if (
    lower.startsWith("/api") ||
    lower.startsWith("/_next") ||
    lower.startsWith("/assets") ||
    lower.startsWith("/images") ||
    lower.startsWith("/icons") ||
    lower.startsWith("/img") ||
    STATIC_FILE_EXTENSION.test(pathname)
  ) {
    return false;
  }
  return /[A-Z]/.test(pathname);
}

function cleanDoubleLocale(pathname) {
  if (!isPrefixedLocalePath(pathname)) return null;
  const stripped = stripLocaleFromPath(pathname);
  if (isPrefixedLocalePath(stripped)) {
    let current = stripped;
    while (isPrefixedLocalePath(current)) {
      current = stripLocaleFromPath(current);
    }
    const originalLocale = parseLocaleFromPath(pathname);
    if (originalLocale) {
      const base = stripLocaleFromPath(current);
      const normalized = base === "/" ? "/" : base.startsWith("/") ? base : `/${base}`;
      if (originalLocale === ROOT_LOCALE) return normalized;
      const prefix = `/${originalLocale}`;
      return normalized === "/" ? prefix : `${prefix}${normalized}`;
    }
  }
  return null;
}

// Scans app directory to find all registered pages
function scanAppDirectory(dir, currentRoute = '') {
  let routes = [];
  const items = fs.readdirSync(dir, { withFileTypes: true });

  for (const item of items) {
    if (item.isDirectory()) {
      const name = item.name;
      // Skip route groups in URL mapping but traverse them
      if (name.startsWith('(') && name.endsWith(')')) {
        routes = routes.concat(scanAppDirectory(path.join(dir, name), currentRoute));
      } else if (name === '[locale]') {
        routes = routes.concat(scanAppDirectory(path.join(dir, name), currentRoute + '/:locale'));
      } else {
        routes = routes.concat(scanAppDirectory(path.join(dir, name), currentRoute + '/' + name));
      }
    } else if (item.isFile() && (item.name === 'page.tsx' || item.name === 'page.ts')) {
      routes.push(currentRoute === '' ? '/' : currentRoute);
    }
  }
  return routes;
}

// Check next.config.mjs redirects simulation
function checkNextConfigRedirect(pathname) {
  for (const rule of NEXT_CONFIG_REDIRECTS) {
    // Basic regex pattern matcher for config redirects
    let sourcePattern = rule.source
      .replace(/:locale\([^)]+\)/g, '(?<locale>[a-z]{2})')
      .replace(/:locale/g, '(?<locale>[a-z]{2})')
      .replace(/:slug/g, '(?<slug>[^/]+)')
      .replace(/:path\*/g, '(?<path>.*)');
    
    sourcePattern = `^${sourcePattern}$`;
    const regex = new RegExp(sourcePattern);
    const match = pathname.match(regex);
    
    if (match) {
      let dest = rule.destination;
      if (match.groups) {
        if (match.groups.locale) dest = dest.replace('/:locale', `/${match.groups.locale}`).replace(':locale', match.groups.locale);
        if (match.groups.slug) dest = dest.replace('/:slug', `/${match.groups.slug}`).replace(':slug', match.groups.slug);
        if (match.groups.path) dest = dest.replace('/:path*', `/${match.groups.path}`).replace(':path*', match.groups.path);
      }
      return { destination: dest, permanent: rule.permanent };
    }
  }
  return null;
}

// Helper functions for English rewrite
function needsEnglishLocaleRewrite(pathname) {
  if (pathname === "/en" || pathname.startsWith("/en/")) {
    return false;
  }
  if (isPrefixedLocalePath(pathname)) {
    return false;
  }
  return true;
}

function rewritePathToEnglishLocale(pathname) {
  if (pathname === "/") {
    return "/en";
  }
  return `/en${pathname}`;
}

// Simulate full request pipeline
function simulateRequest(pathname) {
  let steps = [];
  let currentPath = pathname;
  let iterations = 0;
  const maxIterations = 10;

  while (iterations < maxIterations) {
    iterations++;
    steps.push(currentPath);

    // 1. Next.js Config Redirects (Runs first, before middleware)
    const configRedirect = checkNextConfigRedirect(currentPath);
    if (configRedirect) {
      if (configRedirect.destination === currentPath) {
        return { status: 'LOOP', steps, error: `Config redirect loop on ${currentPath}` };
      }
      currentPath = configRedirect.destination;
      continue;
    }

    // 2. Middleware Simulation
    const cleanedDouble = cleanDoubleLocale(currentPath);
    if (cleanedDouble !== null) {
      if (cleanedDouble === currentPath) {
        return { status: 'LOOP', steps, error: `Double locale clean loop on ${currentPath}` };
      }
      currentPath = cleanedDouble;
      continue;
    }

    if (hasUppercase(currentPath)) {
      const lower = currentPath.toLowerCase();
      if (lower === currentPath) {
        return { status: 'LOOP', steps, error: `Case normalization loop on ${currentPath}` };
      }
      currentPath = lower;
      continue;
    }

    let middlewareAction = 'next';
    let middlewareRedirectTo = null;

    if (isPrefixedLocalePath(currentPath)) {
      const stripped = stripLocaleFromPath(currentPath);
      if (isMiddlewareExcludedPath(stripped)) {
        middlewareAction = 'redirect';
        middlewareRedirectTo = stripped;
      } else {
        middlewareAction = 'intl'; // Goes to next-intl middleware
      }
    } else if (isMiddlewareExcludedPath(currentPath)) {
      middlewareAction = 'next'; // Pass-through
    }

    if (middlewareAction === 'redirect') {
      if (middlewareRedirectTo === currentPath) {
        return { status: 'LOOP', steps, error: `Middleware redirect loop on ${currentPath}` };
      }
      currentPath = middlewareRedirectTo;
      continue;
    }

    // Simulate English rewrite for locale-less paths (terminates internally on Next.js server)
    if (middlewareAction !== 'redirect' && !isMiddlewareExcludedPath(currentPath) && needsEnglishLocaleRewrite(currentPath)) {
      currentPath = rewritePathToEnglishLocale(currentPath);
      return { status: 'RESOLVED', steps, finalPath: currentPath };
    }

    // 3. Routing Resolution
    return { status: 'RESOLVED', steps, finalPath: currentPath };
  }

  return { status: 'LOOP', steps, error: 'Maximum redirect iterations exceeded' };
}

function main() {
  console.log('=== SectorCalc Routing Permutations & Reverse Engineering Audit ===\n');
  const appPath = path.resolve('src/app');
  const physicalRoutes = scanAppDirectory(appPath);
  
  console.log(`Found ${physicalRoutes.length} physical page routes in src/app:`);
  physicalRoutes.forEach(r => console.log(`  - ${r}`));
  console.log('\nStarting combinatorics and vulnerability scanning...\n');

  let anomalies = [];
  let checkedCount = 0;

  // 1. Test every physical route across all locales
  for (const route of physicalRoutes) {
    // Generate actual path representations
    const cleanRoute = route.replace('/:locale', '');
    const pathsToTest = [
      cleanRoute,
      ...SUPPORTED_LOCALES.map(loc => {
        if (route.includes('/:locale')) {
          return route.replace('/:locale', `/${loc}`);
        }
        return `/${loc}${cleanRoute === '/' ? '' : cleanRoute}`;
      })
    ];

    for (const testPath of new Set(pathsToTest)) {
      checkedCount++;
      const result = simulateRequest(testPath);

      if (result.status === 'LOOP') {
        anomalies.push({
          type: 'REDIRECT_LOOP',
          path: testPath,
          detail: result.error,
          steps: result.steps
        });
      } else if (result.status === 'RESOLVED') {
        const final = result.finalPath;
        
        // Check if final path resolves to a physical page
        let resolvesToPage = false;
        
        // Translate final path to physical route match
        let matchedPhysicalRoute = null;
        for (const physical of physicalRoutes) {
          let pattern = physical
            .replace(/:locale/g, `(${SUPPORTED_LOCALES.join('|')})`)
            .replace(/\[[^\]]+\]/g, '[^/]+');
          pattern = `^${pattern}$`;
          
          if (new RegExp(pattern).test(final)) {
            resolvesToPage = true;
            matchedPhysicalRoute = physical;
            break;
          }
        }

        // If it's an excluded path like /admin or /api, it doesn't need to match localized group
        const isExcluded = isMiddlewareExcludedPath(final);
        if (isExcluded) {
          // Verify if it maps to any root level page (like /admin/...)
          resolvesToPage = physicalRoutes.some(p => {
            let pattern = p.replace(/:locale/g, '[^/]+').replace(/:slug/g, '[^/]+');
            return new RegExp(`^${pattern}$`).test(final);
          });
        }

        if (!resolvesToPage) {
          anomalies.push({
            type: 'POTENTIAL_404',
            path: testPath,
            detail: `Resolves to ${final} but no physical page exists at this location.`,
            steps: result.steps
          });
        }
      }
    }
  }

  // 2. Test edge cases (Double locale, uppercase locale, trailing slash, invalid formats)
  const edgeCases = [
    '/tr/tr/free-tools',
    '/de/fr/pricing',
    '/TR/pricing',
    '/tr/Admin',
    '/Admin/leads',
    '/tr/Admin/leads',
    '/tr/admin/',
    '/api/health/',
    '/favicon.ico/extra',
    '/tr/manifest.json',
    '/tr/sitemap.xml',
    '/tr/robots.txt',
    '/tr/TR/free-tools',
    '/de/FR/pricing',
    '/TR/pricing/'
  ];

  for (const edge of edgeCases) {
    checkedCount++;
    const result = simulateRequest(edge);
    if (result.status === 'LOOP') {
      anomalies.push({
        type: 'EDGE_CASE_LOOP',
        path: edge,
        detail: result.error,
        steps: result.steps
      });
    } else {
      const final = result.finalPath;
      if (edge.includes('admin') || edge.includes('api') || edge.includes('manifest.json') || edge.includes('sitemap.xml') || edge.includes('robots.txt')) {
        // These should resolve to their non-localized clean paths
        const isCleaned = !isPrefixedLocalePath(final);
        if (!isCleaned) {
          anomalies.push({
            type: 'UNRESOLVED_EXCLUDED_PATH',
            path: edge,
            detail: `Should resolve to clean non-localized path, but resolved to ${final}`,
            steps: result.steps
          });
        }
      }
    }
  }

  console.log(`Successfully checked ${checkedCount} route combinations.\n`);

  if (anomalies.length === 0) {
    console.log('✅ PASS: No routing loops, unresolved excluded paths, or unexpected 404 routes detected!');
  } else {
    console.log(`⚠️ WARNING: Found ${anomalies.length} routing anomalies/vulnerabilities:\n`);
    
    // Group anomalies by type
    const grouped = {};
    anomalies.forEach(a => {
      if (!grouped[a.type]) grouped[a.type] = [];
      grouped[a.type].push(a);
    });

    for (const [type, list] of Object.entries(grouped)) {
      console.log(`[${type}] (${list.length} occurrences):`);
      list.forEach(a => {
        console.log(`  - Path: ${a.path}`);
        console.log(`    Detail: ${a.detail}`);
        console.log(`    Redirect chain: ${a.steps.join(' -> ')}`);
      });
      console.log('');
    }
  }
}

main();
