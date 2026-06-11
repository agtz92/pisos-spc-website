/**
 * PressKit — downloadable press kit block (Macro / Portfolio).
 *
 * ``data`` shape: ``{ heading?: string, body?: string, download_url: string, image_url?: string }``.
 */
import Link from 'next/link';
import { t } from '../sections';

type PressKitData = { heading?: string; body?: string; download_url?: string; image_url?: string };

export default function PressKit({ data }: { data: Record<string, unknown> }) {
  const d = data as PressKitData;
  if (!d.download_url) return null;
  return (
    <section className="py-16" style={{ background: t.panel }}>
      <div className="max-w-4xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 gap-8 items-center">
        <div>
          <h3 className="text-2xl font-bold" style={{ color: t.ink }}>
            {d.heading || 'Press kit'}
          </h3>
          {d.body && (
            <p className="mt-2 text-sm leading-relaxed" style={{ color: t.mutedText }}>{d.body}</p>
          )}
          <Link
            href={d.download_url}
            className="mt-5 inline-block px-6 py-3 rounded-xl font-semibold text-sm transition-transform hover:scale-105"
            style={{ background: t.accent, color: '#fff' }}
          >
            Download press kit (.zip)
          </Link>
        </div>
        <div
          className="aspect-[4/3] rounded-2xl flex items-center justify-center text-6xl"
          style={{ background: t.mutedPanel, border: `1px solid ${t.panelBorder}` }}
        >
          📰
        </div>
      </div>
    </section>
  );
}
