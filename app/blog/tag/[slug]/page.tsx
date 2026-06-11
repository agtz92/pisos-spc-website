import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getPosts, getTags } from '@/lib/graphql';
import PostCard from '@/components/PostCard';

export const revalidate = 86400;

export async function generateStaticParams() {
  try {
    const tags = await getTags('blog');
    return tags.map((t) => ({ slug: t.slug }));
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
  const tags = await getTags('blog').catch(() => []);
  const tag = tags.find((t) => t.slug === slug);
  return { title: tag ? `#${tag.name} — Blog` : 'Tag' };
}

export default async function TagPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [tags, postsResult] = await Promise.all([
    getTags('blog').catch(() => []),
    getPosts({ tagSlug: slug })
      .then((p) => ({ ok: true as const, data: p }))
      .catch((e) => ({ ok: false as const, error: e.message })),
  ]);

  const tag = tags.find((t) => t.slug === slug);
  if (tags.length > 0 && !tag) notFound();

  const posts = postsResult.ok ? postsResult.data : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <Link href="/blog" style={{ fontSize: '0.8rem', fontWeight: 600, color: '#6b7280', textDecoration: 'none' }}
        className="hover:text-gray-900 transition-colors"
      >
        ← Blog
      </Link>
      <div className="mt-4 flex items-center gap-3">
        <div style={{ width: 4, height: 24, background: 'var(--template-accent, #e5201b)', borderRadius: 2 }} />
        <h1 className="text-3xl font-bold" style={{ color: '#111' }}>#{tag?.name ?? slug}</h1>
      </div>

      {!postsResult.ok && (
        <p className="mt-6 text-gray-500">{postsResult.error}</p>
      )}

      {posts.length === 0 && postsResult.ok ? (
        <p className="mt-6 text-gray-400">No published posts with this tag yet.</p>
      ) : (
        <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
