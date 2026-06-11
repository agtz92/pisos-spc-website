/**
 * Guarantee — money-back guarantee badge (Digital layout primarily).
 *
 * ``data`` shape: ``{ title: string, body?: string, days?: number }``.
 */
import { t } from '../sections';

type GuaranteeData = { title?: string; body?: string; days?: number };

export default function Guarantee({ data }: { data: Record<string, unknown> }) {
  const d = data as GuaranteeData;
  if (!d.title) return null;
  return (
    <section className="py-12" style={{ background: t.panel }}>
      <div
        className="max-w-md mx-auto px-6 py-8 rounded-2xl text-center"
        style={{
          background: 'rgba(22,163,74,0.06)',
          border: '2px solid rgba(22,163,74,0.30)',
        }}
      >
        <div className="text-4xl mb-2">🛡️</div>
        <h3 className="text-lg font-bold" style={{ color: t.ink }}>{d.title}</h3>
        {d.body && (
          <p className="mt-2 text-sm leading-relaxed" style={{ color: t.mutedText }}>{d.body}</p>
        )}
        {d.days != null && (
          <p className="mt-3 text-xs font-semibold" style={{ color: '#16a34a' }}>
            {d.days}-day guarantee
          </p>
        )}
      </div>
    </section>
  );
}
