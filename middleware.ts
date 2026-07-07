import { NextRequest, NextResponse } from 'next/server';
import type { PublicRedirect } from '@/lib/graphql';

/**
 * Redirect middleware.
 *
 * This runs on the Edge for EVERY page request, BEFORE the page (or its
 * ``loading.tsx``) renders. The Edge runtime does NOT share Next's Data Cache,
 * so a naive ``await fetch(backend)`` here hits the backend on every single
 * request and blocks the whole response — and if the backend is briefly slow,
 * the middleware exceeds Vercel's invocation limit → 504
 * MIDDLEWARE_INVOCATION_TIMEOUT.
 *
 * Fixes:
 * - In-memory TTL cache. Edge instances are reused, so at most one refresh per
 *   ``TTL_MS`` per instance touches the backend; everything else is instant.
 * - Short fetch timeout, far below Vercel's middleware limit, so a slow/asleep
 *   backend can never make the middleware (and thus the whole site) time out.
 * - Fail-safe: on timeout/error we serve the last known list, or just let the
 *   request through. Redirects must never be able to take the site down.
 */

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8000';
const TENANT_SLUG = process.env.NEXT_PUBLIC_TENANT_SLUG ?? '';
const GRAPHQL_URL = `${API_BASE}/t/${TENANT_SLUG}/graphql/`;

const TTL_MS = 60_000;          // refresh redirects at most once a minute per instance
const FETCH_TIMEOUT_MS = 2_500; // hard ceiling, well under Vercel's middleware limit

let cached: { at: number; data: PublicRedirect[] } | null = null;

async function getRedirectsEdge(): Promise<PublicRedirect[]> {
  if (cached && Date.now() - cached.at < TTL_MS) return cached.data;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(GRAPHQL_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: 'query Redirects { redirects { fromPath toPath statusCode isWildcard } }',
      }),
      cache: 'no-store',
      signal: controller.signal,
    });
    const json = await res.json();
    const data: PublicRedirect[] = json?.data?.redirects ?? [];
    cached = { at: Date.now(), data };
    return data;
  } finally {
    clearTimeout(timer);
  }
}

export async function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  let redirects: PublicRedirect[];
  try {
    redirects = await getRedirectsEdge();
  } catch {
    // Timeout/network/parse error → use the last good list if we have one,
    // otherwise let the request through. Never block on redirects.
    if (!cached) return NextResponse.next();
    redirects = cached.data;
  }

  for (const r of redirects) {
    const target = matchRedirect(pathname, r);
    if (target !== null) {
      const dest = target.startsWith('http://') || target.startsWith('https://')
        ? target + search
        : new URL(target + search, req.url).toString();
      return NextResponse.redirect(dest, r.statusCode);
    }
  }

  return NextResponse.next();
}

function matchRedirect(
  pathname: string,
  r: { fromPath: string; toPath: string; isWildcard: boolean },
): string | null {
  if (r.isWildcard) {
    if (!r.fromPath.endsWith('/*')) return null;
    const prefix = r.fromPath.slice(0, -2);
    const matches = pathname === prefix || pathname.startsWith(prefix + '/');
    if (!matches) return null;
    const tail = pathname.slice(prefix.length);
    return r.toPath.endsWith('/*') ? r.toPath.slice(0, -2) + tail : r.toPath;
  }
  return pathname === r.fromPath ? r.toPath : null;
}

export const config = {
  // Run on every request EXCEPT Next internals, API routes, and real static
  // asset files (matched by known extension). The old `.*\..*` catch-all
  // excluded ANY path containing a dot, which silently skipped extension-bearing
  // *page* URLs like `/nosotros.html` or `/producto.php` — the single most
  // common 301 case (migrating an old .html/.php site). Excluding only known
  // asset extensions lets those page URLs reach the redirect middleware while
  // still skipping images/css/js/fonts/sitemap.xml/robots.txt/etc.
  matcher: [
    '/((?!_next/|api/|.*\\.(?:ico|png|jpe?g|gif|svg|webp|avif|bmp|css|js|mjs|map|txt|xml|json|woff2?|ttf|otf|eot|pdf|mp4|webm|mov|mp3|wav|ogg|zip|gz|csv)$).*)',
  ],
};
