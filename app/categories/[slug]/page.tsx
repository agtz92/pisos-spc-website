import { redirect } from 'next/navigation';

// Redirect old /categories/[slug] URLs to new /blog/category/[slug]
export default async function OldCategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  redirect(`/blog/category/${slug}`);
}
