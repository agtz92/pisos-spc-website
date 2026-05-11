import { getUtilityPages } from '@/lib/graphql';
import Link from 'next/link';
import type { Metadata } from 'next';

export const revalidate = 60;
export const metadata: Metadata = { title: 'Utility Pages' };

const accent = 'var(--template-accent, #2563eb)';
const ink = 'var(--template-ink, #161218)';
const panelBackground = 'var(--template-panel, #ffffff)';
const panelBorder = 'var(--template-panel-border, #e5e7eb)';
const mutedText = 'var(--template-muted-text, #6b7280)';

const KIND_LABEL: Record<string, string> = {
  about: 'About',
  contact: 'Contact',
  faq: 'FAQ',
  privacy: 'Privacy Policy',
  terms: 'Terms of Service',
  notfound: '404',
};

export default async function UtilityPagesIndex() {
  let pages: Awaited<ReturnType<typeof getUtilityPages>> = [];
  let error: string | null = null;
  try {
    pages = await getUtilityPages();
  } catch (e) {
    error = e instanceof Error ? e.message : 'Failed to load utility pages';
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
        <p className="text-sm font-medium">No utility pages published yet.</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-8 pb-16">
      <h1 className="text-3xl font-bold mb-8" style={{ color: ink }}>Utility Pages</h1>
      <ul className="grid gap-3 sm:grid-cols-2">
        {pages.map((p) => (
          <li key={p.slug}>
            <Link
              href={`/u/${p.slug}`}
              className="block px-5 py-4 no-underline"
              style={{
                background: panelBackground,
                border: `1px solid ${panelBorder}`,
                borderRadius: 14,
                color: ink,
              }}
            >
              <p style={{ color: accent, fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.18em', textTransform: 'uppercase' }}>
                {KIND_LABEL[p.kind] || p.kind}
              </p>
              <p className="mt-1" style={{ fontWeight: 700, fontSize: '1.05rem' }}>
                {p.title}
              </p>
              {p.subheadline && (
                <p className="mt-1 line-clamp-2" style={{ color: mutedText, fontSize: '0.85rem', lineHeight: 1.5 }}>
                  {p.subheadline}
                </p>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
