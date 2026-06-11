/**
 * Helper to compose the carousel image list for a product.
 *
 * Rule (decided by user): ``cover_image`` always renders first. Gallery images
 * follow in their ``order`` field. Empty cover + empty gallery → empty array
 * (the renderer should show its placeholder).
 *
 * If the cover URL also appears in the gallery (e.g. user uploaded the same
 * file twice), we deduplicate so the carousel doesn't show duplicates back-
 * to-back. Comparison is by URL string equality, not by hash.
 */
import { resolveMediaUrl, type Product, type ProductImage } from './graphql';

export interface CarouselSlide {
  src: string;
  alt: string;
  /** Stable key for React lists — `'cover'` or `'gallery-<id>'`. */
  key: string;
}

export function buildGallery(product: Product): CarouselSlide[] {
  const slides: CarouselSlide[] = [];
  const seen = new Set<string>();

  const coverUrl = resolveMediaUrl(product.coverImage);
  if (coverUrl) {
    slides.push({ src: coverUrl, alt: product.title, key: 'cover' });
    seen.add(coverUrl);
  }

  const gallery: ProductImage[] = product.images ?? [];
  for (const img of gallery) {
    const url = resolveMediaUrl(img.image);
    if (!url || seen.has(url)) continue;
    slides.push({
      src: url,
      alt: img.alt || product.title,
      key: `gallery-${img.id}`,
    });
    seen.add(url);
  }

  return slides;
}
