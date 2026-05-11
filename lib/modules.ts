import { cache } from 'react';
import { notFound } from 'next/navigation';
import { getTenant } from './graphql';

/**
 * Memoised per-request tenant fetch.
 * Layout + page can both call this without making two network requests.
 */
export const getTenantCached = cache(getTenant);

/**
 * Call at the top of a module layout or page.
 * Triggers a 404 if the tenant has not enabled the given module key.
 */
export async function requireModule(key: string): Promise<void> {
  const tenant = await getTenantCached();
  if (!tenant?.modules.includes(key)) {
    notFound();
  }
}
