import { getLandingPage, getLandingPages } from '@/lib/graphql';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { fetchLandingPageModules, renderLandingPage } from '@/lib/render-landing-page';
import { buildMetadata } from '@/lib/landing-page-seo';

export const revalidate = 86400;

// Prerender every landing page at build so visitors never trigger a blocking
// on-demand render of the heaviest query in the app. Pages created after build
// still work (dynamicParams) — cached on first hit, then tag-revalidated.
export async function generateStaticParams() {
  try {
    const pages = await getLandingPages();
    return pages.map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    const page = await getLandingPage(slug);
    if (!page) return {};
    return buildMetadata(page);
  } catch {
    return {};
  }
}

export default async function LandingPagePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = await getLandingPage(slug).catch(() => null);
  if (!page) notFound();
  // Module fetch depends on the page's per-section settings, so we must
  // resolve `page` first. Phase 2 changes this from parallel to sequential.
  const modules = await fetchLandingPageModules(page);
  return await renderLandingPage(page, modules);
}
