import { t, UtilityEyebrow, UtilityHeading, UtilitySubheading, ContactIcon, type UtilityLayoutProps } from './sections';

export default function UtilityContactCentered({ page }: UtilityLayoutProps) {
  const channels = page.contactChannels.length > 0 ? page.contactChannels : fallback(page);

  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <header className="text-center">
        {page.eyebrow && <UtilityEyebrow>{page.eyebrow}</UtilityEyebrow>}
        <div className="mt-3"><UtilityHeading>{page.headline || page.title}</UtilityHeading></div>
        {page.subheadline && (
          <div className="mt-4 inline-flex flex-col items-center">
            <UtilitySubheading>{page.subheadline}</UtilitySubheading>
          </div>
        )}
      </header>

      {channels.length > 0 && (
        <ul className="mt-10 grid gap-3 sm:grid-cols-2">
          {channels.map((c) => (
            <li
              key={c.id || c.label}
              className="flex items-center gap-3 px-4 py-3"
              style={{
                background: t.panel,
                border: `1px solid ${t.panelBorder}`,
                borderRadius: 14,
              }}
            >
              <span
                aria-hidden
                className="inline-flex items-center justify-center"
                style={{
                  width: 34, height: 34, borderRadius: 10,
                  background: `color-mix(in srgb, ${t.accent} 12%, transparent)`,
                  color: t.accent, flexShrink: 0,
                }}
              >
                <ContactIcon icon={c.icon} />
              </span>
              <div className="min-w-0">
                <p style={{ color: t.mutedText, fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
                  {c.label}
                </p>
                {c.href ? (
                  <a href={c.href} className="block no-underline truncate" style={{ color: t.ink, fontWeight: 600 }}>{c.value}</a>
                ) : (
                  <p style={{ color: t.ink, fontWeight: 600 }} className="truncate">{c.value}</p>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      {page.contactFormEnabled && (
        <form
          action="#"
          method="post"
          className="mt-10 flex flex-col gap-4 p-6 sm:p-8"
          style={{
            background: t.panel,
            border: `1px solid ${t.panelBorder}`,
            borderRadius: 18,
            boxShadow: '0 8px 32px rgba(22,18,24,0.05)',
          }}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Name"><input name="name" type="text" required style={inputStyle()} /></Field>
            <Field label="Email"><input name="email" type="email" required style={inputStyle()} /></Field>
          </div>
          <Field label="Message"><textarea name="message" rows={5} required style={{ ...inputStyle(), resize: 'vertical' }} /></Field>
          <button
            type="submit"
            className="self-center mt-2 inline-flex items-center justify-center px-6 py-3"
            style={{
              background: t.accent, color: t.textOnAccent, borderRadius: 999,
              fontWeight: 700, fontSize: '0.95rem', border: 'none', cursor: 'pointer',
            }}
          >
            Send
          </button>
        </form>
      )}
    </article>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span style={{ color: t.mutedText, fontSize: '0.74rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
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
