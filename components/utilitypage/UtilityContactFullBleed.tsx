import Image from 'next/image';
import { resolveMediaUrl } from '@/lib/graphql';
import { t, UtilityEyebrow, ContactIcon, type UtilityLayoutProps } from './sections';

export default function UtilityContactFullBleed({ page }: UtilityLayoutProps) {
  const heroUrl = resolveMediaUrl(page.heroImage);
  const channels = page.contactChannels.length > 0 ? page.contactChannels : fallback(page);

  return (
    <article>
      <section
        className="relative overflow-hidden"
        style={{
          background: heroUrl ? '#000' : t.mutedPanel,
          minHeight: 'min(80vh, 640px)',
        }}
      >
        {heroUrl && (
          <Image src={heroUrl} alt={page.title} fill className="object-cover opacity-60" priority />
        )}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background: heroUrl
              ? `linear-gradient(180deg, color-mix(in srgb, ${t.ink} 30%, transparent) 0%, color-mix(in srgb, ${t.ink} 80%, transparent) 100%)`
              : `linear-gradient(180deg, transparent, color-mix(in srgb, ${t.accent} 14%, transparent))`,
          }}
        />
        <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center justify-center gap-4 px-4 py-24 text-center sm:px-6">
          {page.eyebrow && (
            <p
              style={{
                color: heroUrl ? '#fff' : t.accent,
                fontSize: '0.72rem',
                fontWeight: 800,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                opacity: heroUrl ? 0.85 : 1,
              }}
            >
              {page.eyebrow}
            </p>
          )}
          <h1
            style={{
              color: heroUrl ? '#fff' : t.ink,
              fontSize: 'clamp(2.4rem, 6vw, 4.4rem)',
              lineHeight: 1.02,
              letterSpacing: '-0.04em',
              fontWeight: 800,
            }}
          >
            {page.headline || page.title}
          </h1>
          {page.subheadline && (
            <p
              style={{
                color: heroUrl ? '#fff' : t.mutedText,
                fontSize: '1.1rem',
                lineHeight: 1.6,
                maxWidth: '46ch',
                opacity: heroUrl ? 0.88 : 1,
              }}
            >
              {page.subheadline}
            </p>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
          <div>
            <UtilityEyebrow>Channels</UtilityEyebrow>
            <ul className="mt-5 flex flex-col gap-4">
              {channels.map((c) => (
                <li key={c.id || c.label} className="flex items-start gap-3">
                  <span
                    aria-hidden
                    className="inline-flex items-center justify-center"
                    style={{
                      width: 38, height: 38, borderRadius: 12,
                      background: `color-mix(in srgb, ${t.accent} 12%, transparent)`,
                      color: t.accent, flexShrink: 0,
                    }}
                  >
                    <ContactIcon icon={c.icon} />
                  </span>
                  <div>
                    <p style={{ color: t.mutedText, fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
                      {c.label}
                    </p>
                    {c.href ? (
                      <a href={c.href} className="no-underline" style={{ color: t.ink, fontWeight: 600 }}>{c.value}</a>
                    ) : (
                      <p style={{ color: t.ink, fontWeight: 600 }}>{c.value}</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {page.contactFormEnabled && (
            <form
              action="#"
              method="post"
              className="flex flex-col gap-4 p-6 sm:p-8"
              style={{
                background: t.panel,
                border: `1px solid ${t.panelBorder}`,
                borderRadius: 18,
                boxShadow: '0 12px 36px rgba(22,18,24,0.08)',
              }}
            >
              <Field label="Full name"><input name="name" type="text" required style={inputStyle()} /></Field>
              <Field label="Email"><input name="email" type="email" required style={inputStyle()} /></Field>
              <Field label="What's on your mind?"><textarea name="message" rows={6} required style={{ ...inputStyle(), resize: 'vertical' }} /></Field>
              <button
                type="submit"
                className="mt-2 inline-flex items-center justify-center px-5 py-3"
                style={{
                  background: t.accent, color: t.textOnAccent, borderRadius: 12,
                  fontWeight: 700, fontSize: '0.95rem', border: 'none', cursor: 'pointer',
                }}
              >
                Get in touch
              </button>
            </form>
          )}
        </div>
      </section>
    </article>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span style={{ color: t.mutedText, fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
        {label}
      </span>
      {children}
    </label>
  );
}

function inputStyle(): React.CSSProperties {
  return {
    width: '100%',
    border: `1px solid ${t.panelBorder}`,
    background: t.mutedPanel,
    color: t.ink,
    borderRadius: 10,
    padding: '0.7rem 0.9rem',
    fontSize: '0.95rem',
    outline: 'none',
  };
}

function fallback(page: UtilityLayoutProps['page']): UtilityLayoutProps['page']['contactChannels'] {
  const out: UtilityLayoutProps['page']['contactChannels'] = [];
  if (page.contactEmail)   out.push({ id: 'email',   icon: 'mail',    label: 'Email',   value: page.contactEmail,   href: `mailto:${page.contactEmail}`, order: 0 });
  if (page.contactPhone)   out.push({ id: 'phone',   icon: 'phone',   label: 'Phone',   value: page.contactPhone,   href: `tel:${page.contactPhone.replace(/\s/g, '')}`, order: 1 });
  if (page.contactAddress) out.push({ id: 'address', icon: 'map-pin', label: 'Address', value: page.contactAddress, href: '', order: 2 });
  return out;
}
