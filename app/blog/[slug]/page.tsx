import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getPost, getPosts, getTenant } from '@/lib/graphql';
import { getModuleSettings, getLayoutVariant } from '@/lib/templates/moduleLayout';
import BlogDetailStandard from '@/components/blog/detail/BlogDetailStandard';
import BlogDetailImmersive from '@/components/blog/detail/BlogDetailImmersive';
import BlogDetailSidebar from '@/components/blog/detail/BlogDetailSidebar';
import BlogDetailMinimal from '@/components/blog/detail/BlogDetailMinimal';

export const revalidate = 60;

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
  const [post, tenant] = await Promise.all([
    getPost(slug).catch(() => null),
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
