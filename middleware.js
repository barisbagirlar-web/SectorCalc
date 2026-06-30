import { NextResponse } from 'next/server';

const SUPPORTED_LOCALES = ['en'];
const DEFAULT_LOCALE    = 'en';

// Maps Accept-Language substrings to supported locales
const LANG_MAP = {
  // Only English is active as per routing.ts policy
};

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Skip for API routes, static files, _next, etc.
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api')   ||
    pathname.startsWith('/static')||
    /\.(.*)$/.test(pathname)
  ) {
    return NextResponse.next();
  }

  // Already has a locale prefix → do nothing
  const hasLocale = SUPPORTED_LOCALES.some(
    (loc) => pathname.startsWith(`/${loc}/`) || pathname === `/${loc}`
  );
  if (hasLocale) return NextResponse.next();

  // Detect locale from Accept-Language header
  const acceptLang = request.headers.get('accept-language') || '';
  const detected   = acceptLang.split(',')[0].split('-')[0].toLowerCase();
  const locale     = LANG_MAP[detected] || DEFAULT_LOCALE;

  // English → no redirect (serve at root)
  if (locale === DEFAULT_LOCALE) return NextResponse.next();

  // Other locales → redirect to prefixed URL
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname}`;
  return NextResponse.redirect(url, 307);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
