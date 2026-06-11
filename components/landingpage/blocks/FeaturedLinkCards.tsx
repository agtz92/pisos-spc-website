/**
 * FeaturedLinkCards — Big featured cards with cover image (Links layout).
 */
import Image from 'next/image';
import Link from 'next/link';
import { resolveMediaUrl } from '@/lib/graphql';
import type { LandingPage } from '@/lib/graphql';
import { t } from '../sections';

export default function FeaturedLinkCards({ page }: { page: LandingPage }) {
  const items = page.featuredLinks || [];
  if (items.length === 0) return null;
  return (
    <div className="flex flex-col gap-4 my-6">
      {items.map((l) => {
        const img = resolveMediaUrl(l.image);
        return (
          <Link key={l.id} href={l.url} className="block rounded-2xl overflow-hidden transition-shadow hover:shadow-md"
                style={{ background: t.panel, border: `1px solid ${t.panelBorder}` }}>
            {img && (
              <div className="relative w-full aspect-[16/9]">
                <Image src={img} alt={l.title} fill className="object-cover" />
              </div>
            )}
            <div className="p-4">
              {l.badge && (
                <span className="inline-block mb-2 px-2 py-0.5 text-xs font-bold rounded-full"
                      style={{ background: t.accent, color: '#fff' }}>{l.badge}</span>
              )}
              <p className="font-semibold" style={{ color: t.ink }}>{l.title}</p>
              {l.description && (
                <p className="text-sm mt-1" style={{ color: t.mutedText }}>{l.description}</p>
              )}
            </div>
          </Link>
        );
      })}
    </div>
  );
}
