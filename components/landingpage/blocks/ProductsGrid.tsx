/**
 * ProductsGrid — generic products grid block.
 *
 * Used by Services, Portfolio, Macro and Links. Storefront and Digital
 * keep their own inline product rendering because each has a layout-
 * specific shape (full-bleed grid with category labels in Storefront,
 * numbered horizontal "curriculum" rows in Digital). This component is
 * the neutral default for every other layout — a clean 3-col card grid
 * that respects the per-page heading + "view all" link overrides.
 *
 * Renders nothing when:
 *  - ``productsSectionEnabled === false`` on the LP, OR
 *  - the tenant does not have the ``products`` module active (then
 *    ``fetchLandingPageModules`` returns an empty array), OR
 *  - ``modules.products`` is empty.
 */
import Image from 'next/image';
import Link from 'next/link';
import { resolveMediaUrl } from '@/lib/graphql';
import type { LandingPage } from '@/lib/graphql';
import type { ModuleData, Product } from '../sections';
import { t, newTabProps } from '../sections';

export default function ProductsGrid({
  page,
  modules,
  defaultHeading = 'Our Products',
  defaultLinkText = 'View all →',
  defaultLinkUrl = '/products',
}: {
  page: LandingPage;
  modules: ModuleData;
  defaultHeading?: string;
  defaultLinkText?: string;
  defaultLinkUrl?: string;
}) {
  if (page.productsSectionEnabled === false) return null;
  const items = modules.products || [];
  if (items.length === 0) return null;

  const heading = page.productsSectionHeading || defaultHeading;
  const linkText = page.productsSectionLinkText || defaultLinkText;
  const linkUrl = page.productsSectionLinkUrl || defaultLinkUrl;

  return (
    <section className="py-20" style={{ background: t.panel }}>
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-3xl font-bold" style={{ color: t.ink }}>{heading}</h2>
          {linkText && (
            <Link href={linkUrl} {...newTabProps(page.productsLinkNewTab)} className="text-sm font-semibold hover:underline" style={{ color: t.accent }}>
              {linkText}
            </Link>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((p: Product) => {
            const img = resolveMediaUrl(p.coverImage);
            return (
              <Link
                key={p.id}
                href={`/products/${p.slug}`}
                className="group rounded-2xl overflow-hidden transition-shadow hover:shadow-lg"
                style={{ border: `1px solid ${t.panelBorder}`, background: t.panel }}
              >
                {img && (
                  <div className="relative aspect-square bg-gray-50">
                    <Image
                      src={img}
                      alt={p.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                )}
                <div className="p-5">
                  {p.category && (
                    <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: t.accent }}>
                      {p.category.name}
                    </p>
                  )}
                  <h3 className="font-semibold text-lg" style={{ color: t.ink }}>{p.title}</h3>
                  {p.price && (
                    <p className="mt-2 text-xl font-bold" style={{ color: t.accent }}>
                      ${p.price}
                      {p.compareAtPrice && (
                        <span className="ml-2 text-sm line-through" style={{ color: t.mutedText }}>
                          ${p.compareAtPrice}
                        </span>
                      )}
                    </p>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
