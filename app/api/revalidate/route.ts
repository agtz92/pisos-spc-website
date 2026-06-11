import { revalidatePath, revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';
import { TAGS } from '@/lib/graphql';

/**
 * On-demand revalidation webhook.
 *
 * Called by the Django signal in ``backend/content/signals.py`` whenever a
 * content model is saved/deleted. The body carries the lowercased Django model
 * name so we can invalidate ONLY the affected pages via ``revalidateTag``
 * instead of rebuilding the whole site.
 *
 * Body (optional): { "model": "product", "slug": "my-product" }
 * - Known model → revalidateTag(s) for just that content type.
 * - Missing/unknown model (or no body) → fall back to revalidating everything,
 *   so older callers and unmapped models still work.
 */

// Django ``model._meta.model_name`` (lowercased class name) → cache tags.
// A tenant change touches the layout (logo/colors/modules) read by every page,
// so its tag is consumed by getTenant() everywhere — invalidating it rebuilds
// all routes, which is what we want for template/branding edits.
const MODEL_TO_TAGS: Record<string, string[]> = {
  post: [TAGS.blog],
  recipe: [TAGS.recipes],
  product: [TAGS.products],
  listing: [TAGS.listings],
  review: [TAGS.reviews],
  landingpage: [TAGS.landing],
  utilitypage: [TAGS.utility],
  tenant: [TAGS.tenant],
};

export async function POST(req: NextRequest) {
  const secret = process.env.REVALIDATE_SECRET;
  const auth = req.headers.get('authorization');

  if (!secret || auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Body is optional; tolerate empty/invalid JSON from older callers.
  let model: string | undefined;
  let slug: string | undefined;
  try {
    const body = await req.json();
    model = typeof body?.model === 'string' ? body.model.toLowerCase() : undefined;
    slug = typeof body?.slug === 'string' ? body.slug : undefined;
  } catch {
    // no/invalid body → handled by the fallback below
  }

  const tags = model ? MODEL_TO_TAGS[model] : undefined;

  if (tags) {
    tags.forEach((tag) => revalidateTag(tag));
    console.log(`[revalidate] model=${model} slug=${slug ?? '-'} → tags=${tags.join(',')}`);
    return NextResponse.json({ revalidated: true, model, tags });
  }

  // Unknown/missing model → revalidate the whole tree (previous behavior).
  revalidatePath('/', 'layout');
  console.log(`[revalidate] model=${model ?? '(none)'} → full site (revalidatePath '/')`);
  return NextResponse.json({ revalidated: true, scope: 'all' });
}
