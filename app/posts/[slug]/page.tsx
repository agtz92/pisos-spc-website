import { redirect } from 'next/navigation';

// Redirect old /posts/[slug] URLs to new /blog/[slug]
export default async function OldPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  redirect(`/blog/${slug}`);
}
