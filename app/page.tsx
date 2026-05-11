import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { getHomepageLandingPage } from '@/lib/graphql';
import { fetchLandingPageModules, renderLandingPage } from '@/lib/render-landing-page';

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  try {
    const page = await getHomepageLandingPage();
    if (!page) return {};
    return {
      title: page.metaTitle || page.title,
      description: page.metaDescription || undefined,
    };
  } catch {
    return {};
  }
}

export default async function HomePage() {
  const page = await getHomepageLandingPage().catch(() => null);
  if (!page) redirect('/blog');
  const modules = await fetchLandingPageModules();
  return renderLandingPage(page, modules);
}
