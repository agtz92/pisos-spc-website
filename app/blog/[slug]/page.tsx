import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getPost, getPosts, getTenant } from '@/lib/graphql';
import { getModuleSettings, getLayoutVariant } from '@/lib/templates/moduleLayout';
import BlogDetailStandard from '@/components/blog/detail/BlogDetailStandard';
import BlogDetailImmersive from '@/components/blog/detail/BlogDetailImmersive';
import BlogDetailSidebar from '@/components/blog/detail/BlogDetailSidebar';
import BlogDetailMinimal from '@/components/blog/detail/BlogDetailMinimal';

export const revalidate = 86400;

export async function generateStaticParams() {
  try {
    const posts = await getPosts();
    return posts.map((p) => ({ slug: p.slug }));
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
  const post = await getPost(slug).catch(() => null);
  if (!post) return {};
  return {
    title: post.seo?.metaTitle || post.title,
    description: post.seo?.metaDescription || post.excerpt || undefined,
    openGraph: post.seo?.ogImage ? { images: [post.seo.ogImage] } : undefined,
    alternates: post.seo?.canonicalUrl ? { canonical: post.seo.canonicalUrl } : undefined,
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  // Fetch post + tenant in parallel — tenant powers the per-module layout +
  // color overrides.
  // `getPost` is NOT wrapped in `.catch(() => null)`: a transient backend
  // failure must throw (retryable) instead of being turned into a baked 404 by
  // ISR. Only a successful query returning null is a genuine not-found. Tenant
  // is best-effort (powers theming) so it keeps its tolerant catch.
  const [post, tenant] = await Promise.all([
    getPost(slug),
    getTenant().catch(() => null),
  ]);
  if (!post) notFound();

  const { layout, moduleStyle } = getModuleSettings(tenant, 'blog');
  const detailVariant = getLayoutVariant(layout, 'detailVariant', 'standard');

  let detail: React.ReactNode;
  if      (detailVariant === 'immersive') detail = <BlogDetailImmersive post={post} />;
  else if (detailVariant === 'sidebar')   detail = <BlogDetailSidebar   post={post} />;
  else if (detailVariant === 'minimal')   detail = <BlogDetailMinimal    post={post} />;
  else                                    detail = <BlogDetailStandard   post={post} />;

  return <div style={moduleStyle}>{detail}</div>;
}
