import { getLandingPage } from '@/lib/graphql';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { fetchLandingPageModules, renderLandingPage } from '@/lib/render-landing-page';

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    const page = await getLandingPage(slug);
    if (!page) return {};
    return {
      title: page.metaTitle || page.title,
      description: page.metaDescription || undefined,
    };
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
  const [page, modules] = await Promise.all([
    getLandingPage(slug).catch(() => null),
    fetchLandingPageModules(),
  ]);
  if (!page) notFound();
  return renderLandingPage(page, modules);
}
