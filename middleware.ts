import { NextRequest, NextResponse } from 'next/server';
import { getRedirects } from '@/lib/graphql';

export async function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  let redirects;
  try {
    redirects = await getRedirects();
  } catch {
    return NextResponse.next();
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
  matcher: ['/((?!_next/|api/|.*\\..*).*)'],
};
