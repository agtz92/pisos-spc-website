import { getLandingPages, resolveMediaUrl } from '@/lib/graphql';
import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';

export const revalidate = 86400;
export const metadata: Metadata = { title: 'Landing Pages' };

const accent = 'var(--template-accent, #e5201b)';
const ink = 'var(--template-ink, #161218)';
const panelBackground = 'var(--template-panel, #ffffff)';
const panelBorder = 'var(--template-panel-border, #e5e7eb)';
const mutedText = 'var(--template-muted-text, #6b7280)';

export default async function LandingPagesIndex() {
  let pages: Awaited<ReturnType<typeof getLandingPages>> = [];
  let error: string | null = null;

  try {
    pages = await getLandingPages();
  } catch (e) {
    error = e instanceof Error ? e.message : 'Failed to load landing pages';
  }

  if (error) {
    return (
      <div className="text-center py-20" style={{ color: ink, opacity: 0.5 }}>
        <p>{error}</p>
      </div>
    );
  }

  if (pages.length === 0) {
    return (
      <div className="text-center py-20" style={{ color: ink, opacity: 0.4 }}>
        <p className="text-sm font-medium">No landing pages published yet.</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-8 pb-16">
      <h1 className="text-3xl font-bold mb-8" style={{ color: ink }}>Landing Pages</h1>
      <div className="grid gap-6 sm:grid-cols-2">
        {pages.map((page) => {
          const imageUrl = resolveMediaUrl(page.heroImage);
          return (
            <Link
              key={page.slug}
              href={`/lp/${page.slug}`}
              className="group block overflow-hidden"
              style={{
                borderRadius: 18,
                border: `1px solid ${panelBorder}`,
                background: panelBackground,
                textDecoration: 'none',
                boxShadow: '0 4px 24px rgba(22,18,24,0.07)',
                transition: 'box-shadow 0.25s',
              }}
            >
              {imageUrl && (
                <div style={{ position: 'relative', aspectRatio: '16 / 9', overflow: 'hidden', background: '#e5e7eb' }}>
                  <Image
                    src={imageUrl}
                    alt={page.title}
                    fill
                    className="object-cover group-hover:scale-105"
                    style={{ transition: 'transform 0.5s ease' }}
                  />
                </div>
              )}
              <div style={{ padding: '1.25rem 1.5rem' }}>
                {page.heroBadge && (
                  <span style={{
                    display: 'inline-block',
                    marginBottom: '0.5rem',
                    padding: '0.2rem 0.6rem',
                    borderRadius: 999,
                    background: accent,
                    color: '#fff',
                    fontSize: '0.65rem',
                    fontWeight: 800,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                  }}>
                    {page.heroBadge}
                  </span>
                )}
                <h2 style={{ fontWeight: 700, fontSize: '1.15rem', lineHeight: 1.3, color: ink, marginBottom: '0.35rem' }}>
                  {page.heroHeadline || page.title}
                </h2>
                {page.heroSubheadline && (
                  <p style={{
                    fontSize: '0.85rem', color: mutedText, lineHeight: 1.5,
                    display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const, overflow: 'hidden',
                  }}>
                    {page.heroSubheadline}
                  </p>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
