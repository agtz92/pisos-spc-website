import { getLandingPageByRootSlug } from '@/lib/graphql';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { fetchLandingPageModules, renderLandingPage } from '@/lib/render-landing-page';
import { buildMetadata } from '@/lib/landing-page-seo';

export const revalidate = 86400;

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
  const page = await getLandingPageByRootSlug(rootSlug).catch(() => null);
  if (!page) notFound();
  const modules = await fetchLandingPageModules(page);
  return await renderLandingPage(page, modules);
}
