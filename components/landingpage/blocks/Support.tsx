/**
 * Support — tip jar / "Buy me a coffee" button (Links layout).
 *
 * ``data`` shape: ``{ label?: string, url: string, provider?: string }``.
 * Renders as a compact pill, typically near the bottom of the Links page.
 */
import Link from 'next/link';
import { t } from '../sections';

type SupportData = { label?: string; url?: string; provider?: string };

export default function Support({ data }: { data: Record<string, unknown> }) {
  const d = data as SupportData;
  if (!d.url) return null;
  return (
    <div className="my-6 text-center">
      <Link
        href={d.url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block px-5 py-2.5 rounded-full font-semibold text-sm transition-transform hover:scale-105"
        style={{ background: t.accent, color: '#fff' }}
      >
        {d.label || '☕ Support'}
      </Link>
    </div>
  );
}
