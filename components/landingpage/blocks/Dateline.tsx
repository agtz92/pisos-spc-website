/**
 * Dateline — "5 min read · Updated Apr 12, 2026" (Phase 7).
 *
 * Reading time is computed from the page's text content using the
 * standard ~225 wpm rule of thumb. Sources: heroBody + featuresHeading +
 * features.description + faqItems.answer + manifesto block data.body if
 * present.
 */
import type { LandingPage } from '@/lib/graphql';
import { t } from '../sections';

function plainText(s: string | null | undefined): string {
  return (s ?? '').replace(/<[^>]*>/g, ' ');
}

function wordsOf(...parts: Array<string | null | undefined>): number {
  return parts
    .map(plainText)
    .join(' ')
    .split(/\s+/)
    .filter(Boolean).length;
}

function readingMinutes(page: LandingPage): number {
  const words =
    wordsOf(page.heroBody, page.heroSubheadline) +
    wordsOf(...(page.features || []).map((f) => f.description)) +
    wordsOf(...(page.faqItems || []).map((q) => q.answer)) +
    wordsOf(...(page.bonuses || []).map((b) => b.description)) +
    wordsOf(...(page.outcomes || []).map((o) => o.description));
  return Math.max(1, Math.round(words / 225));
}

function formatDate(iso: string | null | undefined): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

export default function Dateline({ page }: { page: LandingPage }) {
  const showRT = page.showReadingTime;
  const showLU = page.showLastUpdated;
  if (!showRT && !showLU) return null;
  const parts: string[] = [];
  if (showRT) parts.push(`${readingMinutes(page)} min read`);
  if (showLU && page.updatedAt) parts.push(`Updated ${formatDate(page.updatedAt)}`);
  if (parts.length === 0) return null;
  return (
    <div className="max-w-6xl mx-auto px-4 py-2 text-xs" style={{ color: t.mutedText }}>
      {parts.join(' · ')}
    </div>
  );
}
