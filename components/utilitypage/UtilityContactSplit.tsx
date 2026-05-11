import { t, UtilityEyebrow, UtilityHeading, UtilitySubheading, ContactIcon, type UtilityLayoutProps } from './sections';

export default function UtilityContactSplit({ page }: UtilityLayoutProps) {
  const channels = page.contactChannels;
  return (
    <article className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
        <div>
          {page.eyebrow && <UtilityEyebrow>{page.eyebrow}</UtilityEyebrow>}
          <div className="mt-3"><UtilityHeading>{page.headline || page.title}</UtilityHeading></div>
          {page.subheadline && <div className="mt-4"><UtilitySubheading>{page.subheadline}</UtilitySubheading></div>}

          <ul className="mt-8 flex flex-col gap-4">
            {(channels.length > 0 ? channels : defaultChannels(page)).map((c) => (
              <li
                key={c.id || c.label}
                className="flex items-start gap-3"
                style={{ color: t.ink }}
              >
                <span
                  aria-hidden
                  className="inline-flex items-center justify-center"
                  style={{
                    width: 36,
                    height: 36,
                    flexShrink: 0,
                    borderRadius: 12,
                    background: `color-mix(in srgb, ${t.accent} 12%, transparent)`,
                    color: t.accent,
                  }}
                >
                  <ContactIcon icon={c.icon} />
                </span>
                <div className="min-w-0">
                  <p style={{ color: t.mutedText, fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase' }}>
                    {c.label}
                  </p>
                  {c.href ? (
                    <a href={c.href} className="mt-0.5 inline-block no-underline" style={{ color: t.ink, fontWeight: 600 }}>
                      {c.value}
                    </a>
                  ) : (
                    <p className="mt-0.5" style={{ color: t.ink, fontWeight: 600 }}>{c.value}</p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>

        {page.contactFormEnabled && <ContactForm />}
      </div>
    </article>
  );
}

function ContactForm() {
  return (
    <form
      action="#"
      method="post"
      className="flex flex-col gap-4 p-6 sm:p-8"
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
      <Field label="Subject"><input name="subject" type="text" style={inputStyle()} /></Field>
      <Field label="Message">
        <textarea name="message" rows={5} required style={{ ...inputStyle(), resize: 'vertical' }} />
      </Field>
      <button
        type="submit"
        className="mt-2 inline-flex items-center justify-center gap-2 px-5 py-3"
        style={{
          background: t.accent,
          color: t.textOnAccent,
          borderRadius: 12,
          fontWeight: 700,
          fontSize: '0.95rem',
          border: 'none',
          cursor: 'pointer',
          boxShadow: `0 8px 20px color-mix(in srgb, ${t.accent} 22%, transparent)`,
        }}
      >
        Send message
      </button>
    </form>
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

function defaultChannels(page: UtilityLayoutProps['page']): UtilityLayoutProps['page']['contactChannels'] {
  const out: UtilityLayoutProps['page']['contactChannels'] = [];
  if (page.contactEmail)   out.push({ id: 'email',   icon: 'mail',    label: 'Email',   value: page.contactEmail,   href: `mailto:${page.contactEmail}`, order: 0 });
  if (page.contactPhone)   out.push({ id: 'phone',   icon: 'phone',   label: 'Phone',   value: page.contactPhone,   href: `tel:${page.contactPhone.replace(/\s/g, '')}`, order: 1 });
  if (page.contactAddress) out.push({ id: 'address', icon: 'map-pin', label: 'Address', value: page.contactAddress, href: '', order: 2 });
  return out;
}
