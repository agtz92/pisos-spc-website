import Image from 'next/image';
import { resolveMediaUrl } from '@/lib/graphql';
import { t, UtilityEyebrow, UtilityHeading, UtilitySubheading, UtilityProse, UtilityCta, type UtilityLayoutProps } from './sections';

export default function UtilityAboutNarrative({ page }: UtilityLayoutProps) {
  const heroUrl = resolveMediaUrl(page.heroImage);
  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <header className="flex flex-col gap-4">
        {page.eyebrow && <UtilityEyebrow>{page.eyebrow}</UtilityEyebrow>}
        <UtilityHeading>{page.headline || page.title}</UtilityHeading>
        {page.subheadline && <UtilitySubheading>{page.subheadline}</UtilitySubheading>}
      </header>

      {heroUrl && (
        <div
          className="relative mt-10 overflow-hidden"
          style={{
            aspectRatio: '16 / 9',
            borderRadius: 18,
            border: `1px solid ${t.panelBorder}`,
            background: t.mutedPanel,
          }}
        >
          <Image src={heroUrl} alt={page.title} fill className="object-cover" />
        </div>
      )}

      <div className="mt-12">
        <UtilityProse body={page.body} />
      </div>

      {page.ctaText && (
        <div className="mt-10">
          <UtilityCta page={page} />
        </div>
      )}
    </article>
  );
}
