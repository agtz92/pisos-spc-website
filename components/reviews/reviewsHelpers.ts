import type { ReviewsModuleColors } from '@/lib/templates/config';

export type ReviewsColors = ReviewsModuleColors;

export function formatDate(iso: string | null) {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function getScorePalette(score: number, colors: ReviewsColors) {
  const { scorePalettes } = colors;
  if (score >= 9.5) return scorePalettes.excellent;
  if (score >= 7.5) return scorePalettes.great;
  if (score >= 6.1) return scorePalettes.good;
  if (score >= 4.0) return scorePalettes.mixed;
  return scorePalettes.poor;
}

export function getVerdict(score: number): string {
  if (score >= 9.5) return 'Universal Acclaim';
  if (score >= 7.5) return 'Generally Favorable';
  if (score >= 6.1) return 'Mostly Positive';
  if (score >= 4.0) return 'Mixed or Average';
  if (score >= 2.0) return 'Generally Unfavorable';
  return 'Overwhelming Dislike';
}

export function scoreTier(score: number): string {
  if (score >= 9.5) return 'excellent';
  if (score >= 7.5) return 'great';
  if (score >= 6.1) return 'good';
  if (score >= 4.0) return 'mixed';
  return 'poor';
}
