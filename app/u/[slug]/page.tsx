import { getUtilityPage, getUtilityPages } from '@/lib/graphql';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { renderUtilityPage } from '@/lib/render-utility-page';

export const revalidate = 86400;

// Prerender utility pages at build so the first visit isn't a blocking render.
export async function generateStaticParams() {
  try {
    const pages = await getUtilityPages();
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
    const page = await getUtilityPage(slug);
    if (!page) return {};
    return {
      title: page.metaTitle || page.title,
      description: page.metaDescription || undefined,
    };
  } catch {
    return {};
  }
}

export default async function UtilityPageRoute({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  // No `.catch(() => null)`: a transient backend failure must throw (retryable)
  // instead of being baked as a static 404 by ISR. Only a successful query that
  // returns null is a genuine not-found.
  const page = await getUtilityPage(slug);
  if (!page) notFound();
  return renderUtilityPage(page);
}
