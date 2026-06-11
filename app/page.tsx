import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { getHomepageLandingPage } from '@/lib/graphql';
import { fetchLandingPageModules, renderLandingPage } from '@/lib/render-landing-page';
import { buildMetadata } from '@/lib/landing-page-seo';

export const revalidate = 86400;

export async function generateMetadata(): Promise<Metadata> {
  try {
    const page = await getHomepageLandingPage();
    if (!page) return {};
    return buildMetadata(page);
  } catch {
    return {};
  }
}

export default async function HomePage() {
  const page = await getHomepageLandingPage().catch(() => null);
  if (!page) redirect('/blog');
  const modules = await fetchLandingPageModules(page);
  return await renderLandingPage(page, modules);
}
