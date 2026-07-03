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
  // No `.catch(() => null)`: a transient backend failure must not be silently
  // turned into a redirect/empty state that ISR then bakes into the static
  // prerender. Let backend errors throw (retryable) — only a successful query
  // that returns null means there's genuinely no homepage → redirect to /blog.
  const page = await getHomepageLandingPage();
  if (!page) redirect('/blog');
  const modules = await fetchLandingPageModules(page);
  return await renderLandingPage(page, modules);
}
