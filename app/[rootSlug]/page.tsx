import { getLandingPageByRootSlug, getLandingPages } from '@/lib/graphql';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { fetchLandingPageModules, renderLandingPage } from '@/lib/render-landing-page';
import { buildMetadata } from '@/lib/landing-page-seo';

export const revalidate = 86400;

// Prerender root-level landing pages at build (mirrors the resolver's
// root_path ∈ {root, home} filter) so top-level slugs aren't a blocking
// on-demand render on first visit.
export async function generateStaticParams() {
  try {
    const pages = await getLandingPages();
    return pages
      .filter((p) => p.rootPath === 'root' || p.rootPath === 'home')
      .map((p) => ({ rootSlug: p.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ rootSlug: string }>;
}): Promise<Metadata> {
  const { rootSlug } = await params;
  try {
    const page = await getLandingPageByRootSlug(rootSlug);
    if (!page) return {};
    return buildMetadata(page);
  } catch {
    return {};
  }
}

export default async function RootSlugPage({
  params,
}: {
  params: Promise<{ rootSlug: string }>;
}) {
  const { rootSlug } = await params;
  // Do NOT swallow errors into notFound(): a transient backend failure (cold
  // start, timeout, 5xx) would otherwise be baked as a static 404 by ISR for up
  // to `revalidate` seconds. Let backend errors throw (retryable 500) — only a
  // successful query that returns null is a genuine 404.
  const page = await getLandingPageByRootSlug(rootSlug);
  if (!page) notFound();
  const modules = await fetchLandingPageModules(page);
  return await renderLandingPage(page, modules);
}
