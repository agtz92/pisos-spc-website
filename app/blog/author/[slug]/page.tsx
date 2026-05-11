import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { getPosts, getAuthor, getAuthors, resolveMediaUrl } from '@/lib/graphql';
import PostCard from '@/components/PostCard';

export const revalidate = 60;

export async function generateStaticParams() {
  try {
    const authors = await getAuthors();
    return authors.map((a) => ({ slug: a.slug }));
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
  const author = await getAuthor(slug).catch(() => null);
  return { title: author ? `${author.name} — Blog` : 'Author' };
}

export default async function AuthorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [author, postsResult] = await Promise.all([
    getAuthor(slug).catch(() => null),
    getPosts({ authorSlug: slug })
      .then((p) => ({ ok: true as const, data: p }))
      .catch((e) => ({ ok: false as const, error: e.message })),
  ]);

  if (!author) notFound();

  const posts = postsResult.ok ? postsResult.data : [];
  const avatarUrl = resolveMediaUrl(author.avatar);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <Link href="/blog" style={{ fontSize: '0.8rem', fontWeight: 600, color: '#6b7280', textDecoration: 'none' }}
        className="hover:text-gray-900 transition-colors"
      >
        ← Blog
      </Link>

      {/* Author profile */}
      <div className="mt-8 flex items-center gap-5" style={{ paddingBottom: '1.5rem', borderBottom: '2px solid #111' }}>
        {avatarUrl ? (
          <Image
            src={avatarUrl}
            alt={author.name}
            width={80}
            height={80}
            className="rounded-full object-cover"
            style={{ border: '3px solid var(--template-accent, #e5201b)' }}
          />
        ) : (
          <div
            style={{
              width: 80, height: 80, borderRadius: '50%',
              background: 'var(--template-accent, #e5201b)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontWeight: 800, fontSize: '1.75rem', flexShrink: 0,
            }}
          >
            {author.name[0].toUpperCase()}
          </div>
        )}
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#111' }}>{author.name}</h1>
          {author.bio && (
            <p className="mt-1 text-sm max-w-md" style={{ color: '#6b7280' }}>{author.bio}</p>
          )}
        </div>
      </div>

      {/* Author's posts */}
      <div className="mt-8 flex items-center gap-3 mb-6">
        <div style={{ width: 4, height: 18, background: 'var(--template-accent, #e5201b)', borderRadius: 2, flexShrink: 0 }} />
        <span style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#374151' }}>
          Articles by {author.name}
        </span>
        <div style={{ flex: 1, height: 1, background: '#e5e7eb' }} />
      </div>

      {!postsResult.ok && (
        <p className="mt-4 text-gray-500">{postsResult.error}</p>
      )}

      {posts.length === 0 && postsResult.ok ? (
        <p className="mt-4 text-gray-400">No published posts by this author yet.</p>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
