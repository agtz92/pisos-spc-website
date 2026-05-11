import Image from 'next/image';
import { resolveMediaUrl } from '@/lib/graphql';
import { t, UtilityEyebrow, UtilityHeading, UtilitySubheading, UtilityProse, UtilityCta, type UtilityLayoutProps } from './sections';

export default function UtilityAboutTeamGrid({ page }: UtilityLayoutProps) {
  return (
    <article className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <header className="max-w-3xl">
        {page.eyebrow && <UtilityEyebrow>{page.eyebrow}</UtilityEyebrow>}
        <div className="mt-3"><UtilityHeading>{page.headline || page.title}</UtilityHeading></div>
        {page.subheadline && <div className="mt-4"><UtilitySubheading>{page.subheadline}</UtilitySubheading></div>}
      </header>

      {page.body && (
        <div className="mt-10 max-w-3xl">
          <UtilityProse body={page.body} />
        </div>
      )}

      {page.teamMembers.length > 0 && (
        <section className="mt-16">
          <p
            style={{
              color: t.accent,
              fontSize: '0.72rem',
              fontWeight: 800,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
            }}
          >
            The team
          </p>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {page.teamMembers.map((m) => {
              const photo = resolveMediaUrl(m.photo);
              return (
                <div
                  key={m.id}
                  className="overflow-hidden"
                  style={{
                    background: t.panel,
                    border: `1px solid ${t.panelBorder}`,
                    borderRadius: 18,
                    boxShadow: '0 4px 24px rgba(22,18,24,0.04)',
                  }}
                >
                  <div
                    className="relative"
                    style={{ aspectRatio: '1 / 1', background: t.mutedPanel }}
                  >
                    {photo && <Image src={photo} alt={m.name} fill className="object-cover" />}
                  </div>
                  <div className="p-5">
                    <h3 style={{ color: t.ink, fontSize: '1.05rem', fontWeight: 700 }}>{m.name}</h3>
                    {m.role && <p style={{ color: t.accent, fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{m.role}</p>}
                    {m.bio && <p className="mt-3" style={{ color: t.mutedText, fontSize: '0.9rem', lineHeight: 1.6 }}>{m.bio}</p>}
                    {m.linkUrl && (
                      <a
                        href={m.linkUrl}
                        className="mt-3 inline-flex items-center gap-1 no-underline"
                        style={{ color: t.accent, fontSize: '0.85rem', fontWeight: 700 }}
                      >
                        Learn more →
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {page.ctaText && (
        <div className="mt-12">
          <UtilityCta page={page} />
        </div>
      )}
    </article>
  );
}
