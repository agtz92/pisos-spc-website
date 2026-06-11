/**
 * Manifesto — editorial-style oversized text block (Macro layout).
 *
 * ``data`` shape: ``{ label?: string, body: string }``. ``body`` may
 * contain newlines, which become line breaks visually. Plain text only
 * — markdown not parsed here on purpose (the visual rhythm depends on
 * the literal line breaks the editor wrote).
 */
import { t } from '../sections';

type ManifestoData = { label?: string; body?: string };

export default function Manifesto({ data }: { data: Record<string, unknown> }) {
  const d = data as ManifestoData;
  if (!d.body) return null;
  return (
    <section id="manifesto" className="py-24 sm:py-32" style={{ background: t.panel }}>
      <div className="max-w-5xl mx-auto px-6 sm:px-12">
        {d.label && (
          <p className="text-xs font-bold uppercase tracking-widest mb-6"
             style={{ color: t.mutedText }}>
            {d.label}
          </p>
        )}
        <h2
          className="font-black leading-[1.05] tracking-tight whitespace-pre-line"
          style={{ fontSize: 'clamp(2rem, 5vw, 4.5rem)', color: t.ink }}
        >
          {d.body}
        </h2>
      </div>
    </section>
  );
}
