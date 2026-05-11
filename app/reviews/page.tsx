import type React from 'react';
import { getReviews } from '@/lib/graphql';
import type { Metadata } from 'next';
import { getModuleConfig, colorPalettes } from '@/lib/templates/config';
import { getTenantCached } from '@/lib/modules';
import ReviewsLayoutFeatured from '@/components/reviews/ReviewsLayoutFeatured';
import ReviewsLayoutGrid from '@/components/reviews/ReviewsLayoutGrid';
import ReviewsLayoutList from '@/components/reviews/ReviewsLayoutList';
import ReviewsLayoutLeaderboard from '@/components/reviews/ReviewsLayoutLeaderboard';
import ReviewsLayoutByType from '@/components/reviews/ReviewsLayoutByType';
import ReviewsLayoutMacro from '@/components/reviews/ReviewsLayoutMacro';

export const revalidate = 60;
export const metadata: Metadata = { title: 'Reviews' };

const reviewsConfig = getModuleConfig('reviews');
const REVIEW_TYPES = Object.entries(reviewsConfig.copy.reviewTypes).map(([key, label]) => ({ key, label }));

export default async function ReviewsPage() {
  const tenant = await getTenantCached();
  const savedModules = (tenant?.templateConfig?.modules) as Record<string, Record<string, unknown>> | undefined;
  const savedModConfig = savedModules?.reviews ?? {};
  const savedCopy = (savedModConfig.copy ?? {}) as Partial<typeof reviewsConfig.copy>;
  const savedLayout = (savedModConfig.layout ?? {}) as Partial<typeof reviewsConfig.layout>;
  const copy = { ...reviewsConfig.copy, ...savedCopy };
  const layout = { ...reviewsConfig.layout, ...savedLayout };
  const layoutVariant = (savedLayout as Record<string, unknown>).variant as string | undefined ?? 'featured';

  const savedColors = (savedModConfig.colors ?? {}) as Record<string, unknown>;
  const template = tenant?.template ?? 'modern';

  // Template-aware default accent for reviews module (used when user hasn't customized it)
  const templateDefaultAccent =
    template === 'retro'      ? colorPalettes.templateSpecific.retro.highlight :
    template === 'futuristic' ? colorPalettes.templateSpecific.futuristic.accent :
    template === 'executive'  ? colorPalettes.templateSpecific.executive.accent :
    colorPalettes.moduleStyleSpecific.reviews.accent;

  // Template-aware default ink for reviews module
  const templateDefaultInk =
    template === 'futuristic' ? colorPalettes.templateSpecific.futuristic.ink :
    template === 'executive'  ? colorPalettes.templateSpecific.executive.ink :
    colorPalettes.global.ink;

  // Merge type styles
  const mergedTypeStyles = { ...reviewsConfig.colors.typeStyles };
  const savedTypeStyles = (savedColors.typeStyles ?? {}) as Record<string, Partial<{ bg: string; text: string }>>;
  for (const type of Object.keys(savedTypeStyles)) {
    if (mergedTypeStyles[type as keyof typeof mergedTypeStyles]) {
      mergedTypeStyles[type as keyof typeof mergedTypeStyles] = {
        ...mergedTypeStyles[type as keyof typeof mergedTypeStyles],
        ...savedTypeStyles[type],
      };
    }
  }

  // Merge score palettes (template-aware)
  const baseScorePalettes =
    tenant?.template === 'retro'       ? colorPalettes.moduleStyleSpecific.reviews.retroScorePalettes :
    tenant?.template === 'futuristic'  ? colorPalettes.moduleStyleSpecific.reviews.futuristicScorePalettes :
    tenant?.template === 'executive'   ? colorPalettes.moduleStyleSpecific.reviews.executiveScorePalettes :
    reviewsConfig.colors.scorePalettes;
  const mergedScorePalettes = { ...baseScorePalettes };
  const savedScorePalettes = (savedColors.scorePalettes ?? {}) as Record<string, Partial<{ text: string; background: string; shadow: string }>>;
  for (const tier of Object.keys(savedScorePalettes)) {
    if (mergedScorePalettes[tier as keyof typeof mergedScorePalettes]) {
      mergedScorePalettes[tier as keyof typeof mergedScorePalettes] = {
        ...mergedScorePalettes[tier as keyof typeof mergedScorePalettes],
        ...savedScorePalettes[tier],
      };
    }
  }

  const resolvedAccent = (savedColors.accent as string | undefined) ?? templateDefaultAccent;
  const resolvedInk    = (savedColors.ink    as string | undefined) ?? templateDefaultInk;

  const mergedColors: typeof reviewsConfig.colors = {
    ...reviewsConfig.colors,
    accent: resolvedAccent,
    ink: resolvedInk,
    railBorder: (savedColors.railBorder as string | undefined) ?? reviewsConfig.colors.railBorder,
    featuredBadgeText: (savedColors.featuredBadgeText as string | undefined) ?? resolvedAccent,
    typeStyles: mergedTypeStyles,
    scorePalettes: mergedScorePalettes,
  };

  let reviews: Awaited<ReturnType<typeof getReviews>> = [];
  let error: string | null = null;

  try {
    reviews = await getReviews();
  } catch (e) {
    error = e instanceof Error ? e.message : 'Failed to load reviews';
  }

  if (error) return (
    <div className="text-center py-20" style={{ color: 'var(--template-ink, #161218)', opacity: 0.5 }}>
      <p>{error}</p>
    </div>
  );

  if (reviews.length === 0) return (
    <div className="text-center py-20" style={{ color: 'var(--template-ink, #161218)', opacity: 0.4 }}>
      <p className="text-sm font-medium">{copy.emptyState}</p>
    </div>
  );

  const activeTypes = REVIEW_TYPES.filter((t) => reviews.some((r) => r.reviewType === t.key));
  const typeCategories = activeTypes.map((t) => ({ slug: t.key, name: t.label }));

  const moduleStyle = {
    '--template-accent': mergedColors.accent,
    '--template-ink': mergedColors.ink,
    '--reviews-rail-border': mergedColors.railBorder,
  } as React.CSSProperties;

  if (layoutVariant === 'grid')        return <div style={moduleStyle}><ReviewsLayoutGrid        reviews={reviews} colors={mergedColors} copy={copy} typeCategories={typeCategories} /></div>;
  if (layoutVariant === 'list')        return <div style={moduleStyle}><ReviewsLayoutList        reviews={reviews} colors={mergedColors} copy={copy} typeCategories={typeCategories} /></div>;
  if (layoutVariant === 'leaderboard') return <div style={moduleStyle}><ReviewsLayoutLeaderboard reviews={reviews} colors={mergedColors} copy={copy} typeCategories={typeCategories} /></div>;
  if (layoutVariant === 'by-type')     return <div style={moduleStyle}><ReviewsLayoutByType     reviews={reviews} colors={mergedColors} copy={copy} typeCategories={typeCategories} /></div>;
  if (layoutVariant === 'macro')       return <div style={moduleStyle}><ReviewsLayoutMacro      reviews={reviews} colors={mergedColors} copy={copy} typeCategories={typeCategories} /></div>;
  return <div style={moduleStyle}><ReviewsLayoutFeatured reviews={reviews} colors={mergedColors} copy={copy} layout={layout} typeCategories={typeCategories} template={template} /></div>;
}
