import { getPosts, getCategories } from '@/lib/graphql';
import type { Metadata } from 'next';
import { getTenantCached } from '@/lib/modules';
import { buildModuleMetadata } from '@/lib/module-seo';
import BlogLayoutEditorial from '@/components/blog/BlogLayoutEditorial';
import BlogLayoutList from '@/components/blog/BlogLayoutList';
import BlogLayoutMagazine from '@/components/blog/BlogLayoutMagazine';
import BlogLayoutStream from '@/components/blog/BlogLayoutStream';
import BlogLayoutSpotlight from '@/components/blog/BlogLayoutSpotlight';
import BlogLayoutMacro from '@/components/blog/BlogLayoutMacro';

export const revalidate = 86400;

export async function generateMetadata(): Promise<Metadata> {
  const tenant = await getTenantCached().catch(() => null);
  return buildModuleMetadata(tenant, 'blog', 'Blog');
}

export default async function BlogPage() {
  const tenant = await getTenantCached();
  const savedModules = (tenant?.templateConfig?.modules) as Record<string, Record<string, unknown>> | undefined;
  const savedMod = savedModules?.blog ?? {};
  const savedLayout = (savedMod.layout ?? {}) as Record<string, unknown>;
  const savedColors = (savedMod.colors ?? {}) as Record<string, unknown>;
  const layoutVariant = (savedLayout.variant as string | undefined) ?? 'editorial';

  const moduleStyle = {
    ...(savedColors.accent          ? { '--template-accent':       savedColors.accent }          : {}),
    ...(savedColors.ink             ? { '--template-ink':          savedColors.ink }             : {}),
    ...(savedColors.panelBackground ? { '--template-panel':        savedColors.panelBackground } : {}),
    ...(savedColors.panelBorder     ? { '--template-panel-border': savedColors.panelBorder }     : {}),
  } as Record<string, string>;

  const templateMutedText = 'var(--template-muted-text, #6b7280)';

  let posts: Awaited<ReturnType<typeof getPosts>> = [];
  let categories: Awaited<ReturnType<typeof getCategories>> = [];
  let error: string | null = null;

  try {
    [posts, categories] = await Promise.all([getPosts(), getCategories('blog')]);
  } catch (e) {
    error = e instanceof Error ? e.message : 'Failed to load posts';
  }

  if (error) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6" style={{ color: templateMutedText }}>
        <p>{error}</p>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6" style={{ color: templateMutedText }}>
        No published posts yet.
      </div>
    );
  }

  let layout: React.ReactNode;
  if (layoutVariant === 'list')      layout = <BlogLayoutList      posts={posts} categories={categories} />;
  else if (layoutVariant === 'magazine')  layout = <BlogLayoutMagazine  posts={posts} categories={categories} />;
  else if (layoutVariant === 'stream')    layout = <BlogLayoutStream    posts={posts} categories={categories} />;
  else if (layoutVariant === 'spotlight') layout = <BlogLayoutSpotlight posts={posts} categories={categories} />;
  else if (layoutVariant === 'macro')     layout = <BlogLayoutMacro     posts={posts} categories={categories} />;
  else                                    layout = <BlogLayoutEditorial posts={posts} categories={categories} />;

  return <div style={moduleStyle}>{layout}</div>;
}
